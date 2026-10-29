import { cacheLife } from "next/cache";
import mock from "@/data/mock-hacks.json";
import { matchesQuery, normalizeQuery } from "./search";
import { SEVERITIES, type Feed, type FeedResult, type FeedStats, type Hack, type Severity } from "./types";

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

/** Most search results a single request returns. */
const MAX_SEARCH = 50;

type Loaded = { ok: true; feed: Feed; all: Hack[] } | { ok: false; error: string };

/** One cached fetch feeds both the page (trimmed list) and search (every incident). */
async function loadFeed(): Promise<Loaded> {
  "use cache";
  try {
    const raw = FEED_URL === "mock" ? mock : await fetchUpstream(FEED_URL);
    const { feed, all } = normalizeFeed(raw);
    cacheLife("hours");
    return { ok: true, feed, all };
  } catch (err) {
    // Keep failures short-lived so the next visitor triggers a retry.
    cacheLife("minutes");
    console.error("[feed] failed to load", err);
    return { ok: false, error: "upstream_unavailable" };
  }
}

export async function getFeed(): Promise<FeedResult> {
  const result = await loadFeed();
  return result.ok ? { ok: true, feed: result.feed } : result;
}

/** Searches every incident in the upstream feed, not just the ones the page lists. */
export async function searchHacks(
  query: string,
): Promise<{ ok: true; hacks: Hack[]; total: number } | { ok: false; error: string }> {
  const result = await loadFeed();
  if (!result.ok) return result;
  const q = normalizeQuery(query);
  const matches = q ? result.all.filter((h) => matchesQuery(h, q)) : [];
  return { ok: true, hacks: matches.slice(0, MAX_SEARCH), total: matches.length };
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

export function normalizeFeed(raw: unknown): { feed: Feed; all: Hack[] } {
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

  // Strict ISO 8601: the value ends up in the sitemap XML and in <time> elements.
  const updated = toIso(root.generated) ?? toIso(root.updated) ?? new Date().toISOString();
  const feed: Feed = {
    hacks,
    updated,
    sources: sources.filter((s) => s.name && s.url),
    stats: radarStats(list.filter(isObj).filter((item) => "victim" in item), updated, Number(root.window_days)),
  };
  return { feed, all };
}

const DAY_MS = 86_400_000;
/** Days in the hero area chart. Ransomware claims stay in the feed for about 18 days. */
const CHART_DAYS = 14;
/** Days behind the hero's stat cards, sectors and region gauge. */
const WEEK = 7;
// ISO codes for Latin America and the Caribbean's Spanish- and Portuguese-speaking countries.
const LATAM = new Set("AR BO BR CL CO CR CU DO EC GT HN MX NI PA PE PR PY SV UY VE".split(" "));

/** Totals for the hero dashboard, from every radar item rather than the trimmed list. */
function radarStats(items: Obj[], updated: string, windowDays: number): FeedStats | undefined {
  const end = toIso(updated);
  if (!items.length || !end) return undefined;
  const last = Date.parse(end.slice(0, 10));
  const daily = Array.from({ length: CHART_DAYS }, (_, i) => ({
    day: new Date(last - (CHART_DAYS - 1 - i) * DAY_MS).toISOString().slice(0, 10),
    claims: 0,
  }));
  const byDay = new Map(daily.map((d) => [d.day, d]));
  const weekStart = daily[CHART_DAYS - WEEK].day;
  const countries = new Set<string>();
  const sectors = new Map<string, number>();
  const groups = new Map<string, number>();
  let claims = 0;
  let latam = 0;
  // The upstream already limits the feed to its window, so every breach in it counts.
  const days = Number.isFinite(windowDays) && windowDays > 0 ? windowDays : 180;
  let breaches = 0;
  for (const item of items) {
    const day = (str(item.day) || str(item.seen)).slice(0, 10);
    if (str(item.type) === "filtracion") {
      breaches++;
      continue;
    }
    const bucket = byDay.get(day);
    if (!bucket) continue;
    bucket.claims++;
    if (day < weekStart) continue;
    claims++;
    const country = str(item.country).toUpperCase();
    if (country) countries.add(country);
    if (LATAM.has(country)) latam++;
    const sector = str(item.sector);
    if (SECTORS[sector]) sectors.set(sector, (sectors.get(sector) ?? 0) + 1);
    const group = str(item.group);
    if (group) groups.set(group, (groups.get(group) ?? 0) + 1);
  }
  const top = (m: Map<string, number>, n: number) =>
    [...m].sort((a, b) => b[1] - a[1]).slice(0, n).map(([key, count]) => ({ key, count }));
  const topGroup = top(groups, 1)[0];
  return {
    daily,
    claims,
    countries: countries.size,
    breaches: { count: breaches, days },
    sectors: top(sectors, 5).map(({ key, count }) => ({ ...SECTORS[key], count })),
    topGroup: topGroup ? { name: topGroup.key, count: topGroup.count } : undefined,
    latam: { count: latam, total: claims },
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

// radar.json labels sectors in Spanish, without accents.
const SECTORS: Record<string, { en: string; es: string }> = {
  manufactura: { en: "Manufacturing", es: "Manufactura" },
  servicios: { en: "Services", es: "Servicios" },
  tecnologia: { en: "Technology", es: "Tecnología" },
  salud: { en: "Healthcare", es: "Salud" },
  transporte: { en: "Transport", es: "Transporte" },
  finanzas: { en: "Finance", es: "Finanzas" },
  retail: { en: "Retail", es: "Retail" },
  gobierno: { en: "Government", es: "Gobierno" },
  hoteleria: { en: "Hospitality", es: "Hotelería" },
  educacion: { en: "Education", es: "Educación" },
  energia: { en: "Energy", es: "Energía" },
  construccion: { en: "Construction", es: "Construcción" },
  legal: { en: "Legal", es: "Legal" },
  medios: { en: "Media", es: "Medios" },
};

function fromRadar(item: Obj): Hack | null {
  const date = toIso(item.seen) ?? toIso(item.day);
  const victim = str(item.victim);
  if (!date || !victim) return null;

  const isBreach = str(item.type) === "filtracion";
  const group = str(item.group);
  const source = str(item.source);
  const sector = SECTORS[str(item.sector)];
  const country = str(item.country);

  // radar.json has no severity. We estimate it from the incident type and say so in the UI:
  // a verified breach exposes account data (high); a ransomware claim is unverified (medium).
  const severity: Severity = isBreach ? "high" : "medium";
  const breachSource = source || "Have I Been Pwned";
  const claimSource = source || "a leak-site tracker";
  const summary = isBreach
    ? `${breachSource} verified a data breach at ${victim}. If you had an account there, check whether your email was included and change that password.`
    : `The ransomware group "${group}" claims to have breached ${victim}. The claim is listed on ${claimSource} and has not been independently verified.`;
  const summaryEs = isBreach
    ? `${breachSource} verificó una filtración de datos en ${victim}. Si tenía una cuenta allí, revise si su correo fue incluido y cambie esa contraseña.`
    : `El grupo de ransomware "${group}" afirma haber vulnerado a ${victim}. El reclamo aparece en ${source || "un rastreador de sitios de filtración"} y no ha sido verificado de forma independiente.`;

  return {
    id: str(item.id) || `${victim}-${date}`,
    title: victim,
    summary,
    severity,
    severity_estimated: true,
    kind: isBreach ? "breach" : "ransomware",
    affected_domains: victim.split(/[\s,]+/).filter((t) => DOMAIN_RE.test(t)),
    date_published: date,
    source_url: httpsUrl(item.sourceUrl),
    source_name: source,
    tags: [isBreach ? "Data breach" : "Ransomware claim", sector?.en, country].filter((t): t is string => !!t),
    es: {
      summary: summaryEs,
      tags: [isBreach ? "Filtración de datos" : "Reclamo de ransomware", sector?.es, country].filter(
        (t): t is string => !!t,
      ),
    },
  };
}
