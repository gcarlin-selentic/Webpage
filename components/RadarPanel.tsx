import type { Feed } from "@/lib/types";
import { DICT, localized, type Locale } from "@/lib/i18n";
import { SeverityChip } from "./HackCard";
import { RelativeDate } from "./RelativeDate";

/**
 * Dashboard-style hero visual built from the live feed: three stat tiles, a
 * seven-day column chart and the latest verified breach floating over it.
 */
export function RadarPanel({ feed, locale }: { feed: Feed; locale: Locale }) {
  const stats = feed.stats;
  if (!stats) return null;
  const t = DICT[locale].radar;
  const num = new Intl.NumberFormat(locale);
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
  const longDay = new Intl.DateTimeFormat(locale, { weekday: "long", month: "short", day: "numeric", timeZone: "UTC" });
  const max = Math.max(1, ...stats.daily.map((d) => d.claims));
  const peak = stats.daily.findIndex((d) => d.claims === max);
  const lastIndex = stats.daily.length - 1;
  const breach = feed.hacks.find((h) => h.kind === "breach");

  return (
    <div className="radar-wrap">
      <figure className="radar" aria-labelledby="radar-title">
        <div className="radar-head">
          <span className="radar-dot" aria-hidden="true" />
          <span id="radar-title">{t.title}</span>
          <span className="radar-updated">
            <RelativeDate iso={feed.updated} locale={locale} />
          </span>
        </div>

        <div className="radar-body">
        <dl className="radar-tiles">
          <div className="radar-tile radar-tile-hero">
            <dt>{t.claims}</dt>
            <dd>{num.format(stats.claims)}</dd>
          </div>
          <div className="radar-tile">
            <dt>{t.countries}</dt>
            <dd>{num.format(stats.countries)}</dd>
          </div>
          <div className="radar-tile">
            <dt>{t.breaches(stats.breaches.days)}</dt>
            <dd>{num.format(stats.breaches.count)}</dd>
          </div>
        </dl>

        <div className="radar-chart">
          <p className="radar-chart-title" id="radar-chart-title">
            {t.chart}
          </p>
          {/* The columns are visual only; the table below carries the same numbers for screen readers. */}
          <div className="bars" aria-hidden="true">
            {stats.daily.map((d, i) => {
              const date = new Date(`${d.day}T00:00:00Z`);
              const tip = `${longDay.format(date)}: ${t.claimsCount(num.format(d.claims))}${i === lastIndex ? ` (${t.soFar})` : ""}`;
              return (
                <div key={d.day} className="bar-col" data-tip={tip}>
                  <span className="bar-area">
                    {i === peak && <span className="bar-value">{num.format(d.claims)}</span>}
                    <span
                      className={`bar${i === lastIndex ? " bar-partial" : ""}`}
                      style={{ height: `${Math.max(3, (d.claims / max) * 82)}%` }}
                    />
                  </span>
                  <span className="bar-label">{weekday.format(date)}</span>
                </div>
              );
            })}
          </div>
          <table className="visually-hidden" aria-labelledby="radar-chart-title">
            <thead>
              <tr>
                <th scope="col">{t.day}</th>
                <th scope="col">{t.chart}</th>
              </tr>
            </thead>
            <tbody>
              {stats.daily.map((d, i) => (
                <tr key={d.day}>
                  <th scope="row">{longDay.format(new Date(`${d.day}T00:00:00Z`))}</th>
                  <td>
                    {num.format(d.claims)}
                    {i === lastIndex && ` (${t.soFar})`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </figure>

      {breach && (
        <aside className="radar-float" aria-label={t.latestBreach}>
          <p className="radar-float-label">{t.latestBreach}</p>
          <div className="radar-float-meta">
            <SeverityChip severity={breach.severity} locale={locale} />
            <RelativeDate iso={breach.date_published} locale={locale} />
          </div>
          <p className="radar-float-title">{breach.title}</p>
          <p className="radar-float-tags">{localized(breach, locale).tags.slice(1).join(" · ")}</p>
        </aside>
      )}
    </div>
  );
}
