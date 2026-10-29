import { cacheLife } from "next/cache";
import mock from "@/data/mock-hacks.json";
import { SEVERITIES, type Feed, type FeedResult, type Hack, type Severity } from "./types";

/**
 * Default upstream: the public radar feed that powers the Daily Hack page on
 * am-i-exposed.com. It is refreshed once a day by a GitHub Action in that repo.
 * Override with HACKS_API_URL; set it to "mock" to serve data/mock-hacks.json.
 */
const DEFAULT_FEED_URL = "https://www.am-i-exposed.com/data/radar.json";

/** How many incidents the page receives. The list shows 10 and reveals the rest on demand. */
const MAX_ITEMS = 60;
/**
 * Ransomware claims arrive at ~40 a day and would crowd out verified breaches,
 * which matter most for email exposure. Always keep this many of the newest
 * high/critical incidents on top of MAX_ITEMS.
 */
const MAX_SEVERE = 20;

export const FEED_URL = process.env.HACKS_API_URL || DEFAULT_FEED_URL;

export async function getFeed(): Promise<FeedResult> {
  "use cache";
  try {
    const raw = FEED_URL === "mock" ? mock : await fetchUpstream(FEED_URL);
    const feed = normalizeFeed(raw);
    cacheLife("hours");
    return { ok: true, feed };
  } catch (err) {
    // Keep failures short-lived so the next visitor triggers a retry.
    cacheLife("minutes");
    console.error("[feed] failed to load", err);
    return { ok: false, error: "upstream_unavailable" };
  }
}

async function fetchUpstream(url: string): Promise<unknown> {
  const headers: Record<string, string> = { accept: "application/json" };
  if (process.env.HACKS_API_KEY) headers.authorization = `Bearer ${process.env.HACKS_API_KEY}`;
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`upstream ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Normalisation. Accepts either the documented Hack shape (any future Hack
// Dashboard API) or the radar.json shape used by am-i-exposed.com today.
// ---------------------------------------------------------------------------

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function normalizeFeed(raw: unknown): Feed {
  const root = isObj(raw) ? raw : {};
  const list = Array.isArray(raw) ? raw : Array.isArray(root.items) ? root.items : Array.isArray(root.hacks) ? root.hacks : null;
  if (!list) throw new Error("feed has no items array");

  const all = list
    .filter(isObj)
    .map((item) => ("victim" in item ? fromRadar(item) : fromHack(item)))
    .filter((h): h is Hack => h !== null)
    .sort((a, b) => b.date_published.localeCompare(a.date_published));
  const severe = all.filter((h) => h.severity === "critical" || h.severity === "high").slice(0, MAX_SEVERE);
  const keep = new Set([...all.slice(0, MAX_ITEMS), ...severe]);
  const hacks = all.filter((h) => keep.has(h));

  const sources = Array.isArray(root.sources)
    ? root.sources.filter(isObj).map((s) => ({
        name: str(s.name) || str(s.nombre),
        url: httpsUrl(s.url),
        license: str(s.license) || str(s.licencia) || undefined,
      }))
    : [];

  return {
    hacks,
    updated: str(root.generated) || str(root.updated) || new Date().toISOString(),
    sources: sources.filter((s) => s.name && s.url),
  };
}

function toIso(v: unknown): string | null {
  const d = new Date(str(v));
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function asSeverity(v: unknown): Severity {
  const s = str(v).toLowerCase();
  if (s === "med") return "medium";
  return (SEVERITIES as readonly string[]).includes(s) ? (s as Severity) : "medium";
}

function httpsUrl(v: unknown): string {
  const s = str(v);
  return /^https:\/\//i.test(s) ? s : "";
}

function fromHack(item: Obj): Hack | null {
  const date = toIso(item.date_published);
  const title = str(item.title);
  if (!date || !title) return null;
  const sourceUrl = httpsUrl(item.source_url);
  return {
    id: str(item.id) || `${title}-${date}`,
    title,
    summary: str(item.summary),
    severity: asSeverity(item.severity),
    severity_estimated: !str(item.severity),
    affected_domains: Array.isArray(item.affected_domains) ? item.affected_domains.map(str).filter(Boolean) : [],
    date_published: date,
    source_url: sourceUrl,
    source_name: str(item.source_name) || (sourceUrl ? new URL(sourceUrl).hostname : ""),
    tags: Array.isArray(item.tags) ? item.tags.map(str).filter(Boolean) : [],
  };
}

const DOMAIN_RE = /^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

// radar.json labels sectors in Spanish.
const SECTORS: Record<string, string> = {
  manufactura: "Manufacturing",
  servicios: "Services",
  tecnologia: "Technology",
  salud: "Healthcare",
  transporte: "Transport",
  finanzas: "Finance",
  retail: "Retail",
  gobierno: "Government",
  hoteleria: "Hospitality",
  educacion: "Education",
  energia: "Energy",
  construccion: "Construction",
  legal: "Legal",
  medios: "Media",
  otros: "",
};

function fromRadar(item: Obj): Hack | null {
  const date = toIso(item.seen) ?? toIso(item.day);
  const victim = str(item.victim);
  if (!date || !victim) return null;

  const isBreach = str(item.type) === "filtracion";
  const group = str(item.group);
  const source = str(item.source);
  const sector = SECTORS[str(item.sector)] ?? "";
  const country = str(item.country);

  // radar.json has no severity. We estimate it from the incident type and say so in the UI:
  // a verified breach exposes account data (high); a ransomware claim is unverified (medium).
  const severity: Severity = isBreach ? "high" : "medium";
  const summary = isBreach
    ? `${source || "Have I Been Pwned"} verified a data breach at ${victim}. If you had an account there, check whether your email was included and change that password.`
    : `The ransomware group "${group}" claims to have breached ${victim}. The claim is listed on ${source || "a leak-site tracker"} and has not been independently verified.`;

  return {
    id: str(item.id) || `${victim}-${date}`,
    title: victim,
    summary,
    severity,
    severity_estimated: true,
    affected_domains: victim.split(/[\s,]+/).filter((t) => DOMAIN_RE.test(t)),
    date_published: date,
    source_url: httpsUrl(item.sourceUrl),
    source_name: source,
    tags: [isBreach ? "Data breach" : "Ransomware claim", sector, country].filter(Boolean),
  };
}
