"use client";

import { useMemo, useState } from "react";
import { SEVERITIES, type Feed, type Hack, type Severity } from "@/lib/types";
import { EXPOSURE_URL, SEVERITY_LABEL } from "@/lib/site";
import { ExternalLink } from "./ExternalLink";
import { HackCard } from "./HackCard";
import { HackDetail } from "./HackDetail";

const PAGE = 10;

export function HackFeed({ initial }: { initial: Feed | null }) {
  const [feed, setFeed] = useState(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "error">(initial ? "idle" : "error");
  const [severity, setSeverity] = useState<Severity | "all">("all");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE);
  const [open, setOpen] = useState<Hack | null>(null);

  const hacks = useMemo(() => feed?.hacks ?? [], [feed]);
  const present = SEVERITIES.filter((s) => hacks.some((h) => h.severity === s));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^@/, "");
    return hacks.filter(
      (h) =>
        (severity === "all" || h.severity === severity) &&
        (!q ||
          h.title.toLowerCase().includes(q) ||
          h.affected_domains.some((d) => d.toLowerCase().includes(q)) ||
          h.tags.some((t) => t.toLowerCase().includes(q))),
    );
  }, [hacks, severity, query]);

  const shown = filtered.slice(0, visible);

  async function retry() {
    setStatus("loading");
    try {
      const res = await fetch("/api/hacks", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      setFeed((await res.json()) as Feed);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  if (!feed) {
    return (
      <div className="banner" role="alert">
        <span>Couldn&apos;t load the latest alerts. Try refreshing.</span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={retry} disabled={status === "loading"}>
          {status === "loading" ? "Loading…" : "Try again"}
        </button>
      </div>
    );
  }

  if (hacks.length === 0) {
    return (
      <p className="empty">
        No recent incidents detected. Check back soon. Meanwhile, you can{" "}
        <ExternalLink href={EXPOSURE_URL}>check whether your email was exposed</ExternalLink>.
      </p>
    );
  }

  return (
    <>
      <form className="filters" role="search" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend className="visually-hidden">Filter by severity</legend>
          {(["all", ...present] as const).map((s) => (
            <label key={s} className="chip-toggle">
              <input
                type="radio"
                name="severity"
                value={s}
                checked={severity === s}
                onChange={() => {
                  setSeverity(s);
                  setVisible(PAGE);
                }}
              />
              <span>{s === "all" ? "All" : SEVERITY_LABEL[s]}</span>
            </label>
          ))}
        </fieldset>
        <label className="visually-hidden" htmlFor="hack-search">
          Search incidents by company, domain or tag
        </label>
        <input
          id="hack-search"
          className="search"
          type="search"
          placeholder="Search company or domain"
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisible(PAGE);
          }}
        />
      </form>

      <p className="visually-hidden" aria-live="polite">
        Showing {shown.length} of {filtered.length} incidents
      </p>

      {filtered.length === 0 ? (
        <div className="empty">
          No incidents match these filters.{" "}
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setQuery("");
              setSeverity("all");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="hack-list">
          {shown.map((h) => (
            <HackCard key={h.id} hack={h} onOpen={setOpen} />
          ))}
        </ul>
      )}

      {filtered.length > visible && (
        <div className="list-footer">
          <button type="button" className="btn btn-ghost" onClick={() => setVisible((v) => v + PAGE)}>
            Show {Math.min(PAGE, filtered.length - visible)} more
          </button>
        </div>
      )}

      <HackDetail hack={open} onClose={() => setOpen(null)} />
    </>
  );
}
