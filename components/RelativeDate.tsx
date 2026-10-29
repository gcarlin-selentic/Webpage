"use client";

import { useSyncExternalStore } from "react";
import type { Locale } from "@/lib/i18n";

const absolute = (locale: Locale) =>
  new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const relative = (locale: Locale) => new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
const DAY = 86_400_000;

// The server renders the absolute date; the browser swaps in "today" / "3 days ago"
// after hydration, so the static HTML never goes stale or mismatches.
const subscribe = () => () => {};
const today = () => Math.floor(Date.now() / DAY);
const serverToday = () => null;

export function RelativeDate({ iso, locale }: { iso: string; locale: Locale }) {
  const now = useSyncExternalStore(subscribe, today, serverToday);
  const date = new Date(iso);
  const abs = absolute(locale).format(date);
  // Upstream timestamps are only reliable to the day, so we never show hours.
  const label = now === null ? abs : relative(locale).format(Math.floor(date.getTime() / DAY) - now, "day");
  return (
    <time dateTime={iso} title={abs}>
      {label}
    </time>
  );
}
