"use client";

import { useMemo, useState } from "react";
import { SEVERITIES, type Feed, type Hack, type Severity } from "@/lib/types";
import { EXPOSURE_URL } from "@/lib/site";
import { DICT, localized, type Locale } from "@/lib/i18n";
import { ExternalLink } from "./ExternalLink";
import { HackCard } from "./HackCard";
import { HackDetail } from "./HackDetail";

const PAGE = 10;

export function HackFeed({ initial, locale }: { initial: Feed | null; locale: Locale }) {
  const t = DICT[locale].feed;
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
          [...h.tags, ...localized(h, locale).tags].some((tag) => tag.toLowerCase().includes(q))),
    );
  }, [hacks, severity, query, locale]);

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
        <span>{t.error}</span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={retry} disabled={status === "loading"}>
          {status === "loading" ? t.loading : t.retry}
        </button>
      </div>
    );
  }

  if (hacks.length === 0) {
    return (
      <p className="empty">
        {t.empty}{" "}
        <ExternalLink href={EXPOSURE_URL} locale={locale}>
          {t.emptyLink}
        </ExternalLink>
        .
      </p>
    );
  }

  return (
    <>
      <form className="filters" role="search" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend className="visually-hidden">{t.filterLegend}</legend>
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
              <span>{s === "all" ? t.all : DICT[locale].severity[s]}</span>
            </label>
          ))}
        </fieldset>
        <label className="visually-hidden" htmlFor="hack-search">
          {t.searchLabel}
        </label>
        <input
          id="hack-search"
          className="search"
          type="search"
          placeholder={t.searchPlaceholder}
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisible(PAGE);
          }}
        />
      </form>

      <p className="visually-hidden" aria-live="polite">
        {t.showing(shown.length, filtered.length)}
      </p>

      {filtered.length === 0 ? (
        <div className="empty">
          {t.noMatch}{" "}
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setQuery("");
              setSeverity("all");
            }}
          >
            {t.clear}
          </button>
        </div>
      ) : (
        <ul className="hack-list">
          {shown.map((h) => (
            <HackCard key={h.id} hack={h} locale={locale} onOpen={setOpen} />
          ))}
        </ul>
      )}

      {filtered.length > visible && (
        <div className="list-footer">
          <button type="button" className="btn btn-ghost" onClick={() => setVisible((v) => v + PAGE)}>
            {t.showMore(Math.min(PAGE, filtered.length - visible))}
          </button>
        </div>
      )}

      <HackDetail hack={open} locale={locale} onClose={() => setOpen(null)} />
    </>
  );
}
