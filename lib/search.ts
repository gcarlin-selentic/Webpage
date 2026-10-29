import type { Hack } from "./types";

/** Lowercase, without accents or a leading "@", so "Tecnologia" finds "Tecnología". */
export function normalizeQuery(q: string): string {
  return fold(q.trim().replace(/^@/, ""));
}

function fold(s: string): string {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

/**
 * Ransomware claims usually name the company, not its website, so a domain
 * query also matches on its name part: "www.interseguro.pe" finds "Interseguro".
 */
function domainName(q: string): string | null {
  if (/\s/.test(q) || !q.includes(".")) return null;
  const name = q.replace(/^https?:\/\//, "").replace(/^www\./, "").split(/[./]/)[0];
  return name.length >= 3 ? name : null;
}

/** Same rule on the page (loaded incidents) and in /api/hacks?q= (the whole feed). */
export function matchesQuery(h: Hack, q: string): boolean {
  if (!q) return true;
  const name = domainName(q);
  const fields = [h.title, ...h.affected_domains, ...h.tags, ...(h.es?.tags ?? [])].map(fold);
  return fields.some((field) => field.includes(q) || (name !== null && field.includes(name)));
}
