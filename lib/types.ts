export const SEVERITIES = ["critical", "high", "medium", "low"] as const;
export type Severity = (typeof SEVERITIES)[number];

/** One incident, in the shape every component consumes. */
export interface Hack {
  id: string;
  title: string;
  summary: string;
  severity: Severity;
  /** True when the upstream had no severity and we derived it from the incident type. */
  severity_estimated: boolean;
  affected_domains: string[];
  /** ISO 8601 */
  date_published: string;
  source_url: string;
  /** Name of the upstream source, e.g. "Have I Been Pwned". */
  source_name: string;
  tags: string[];
  /** Incident type, when the source says so (radar.json does). */
  kind?: "breach" | "ransomware";
  /** Spanish summary and tags, when the source lets us write them. */
  es?: { summary: string; tags: string[] };
}

export interface Feed {
  hacks: Hack[];
  /** ISO 8601 timestamp of the upstream feed, or of our fetch when it has none. */
  updated: string;
  /** Upstream sources to credit (licences require attribution). */
  sources: { name: string; url: string; license?: string }[];
  /** Counts over the whole upstream feed, before trimming to what the page lists. */
  stats?: FeedStats;
}

export interface FeedStats {
  /** Last seven days, oldest first, as YYYY-MM-DD (UTC). The last day may still be in progress. */
  daily: { day: string; claims: number }[];
  /** Ransomware claims over those seven days. */
  claims: number;
  /** Countries named in those claims. */
  countries: number;
  /** Verified breaches over the feed's whole window, which is much longer than a week. */
  breaches: { count: number; days: number };
}

export type FeedResult = { ok: true; feed: Feed } | { ok: false; error: string };
