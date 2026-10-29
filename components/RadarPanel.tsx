import type { ReactNode } from "react";
import type { Feed, FeedStats } from "@/lib/types";
import { DICT, localized, type Locale } from "@/lib/i18n";
import { SeverityChip } from "./HackCard";
import { RelativeDate } from "./RelativeDate";

/**
 * Dashboard-style hero visual built from the live feed: stat cards, a 14-day
 * area chart, the most targeted sectors, a Latin America gauge and the latest
 * verified breach. Every number comes from FeedStats (lib/feed.ts).
 */
export function RadarPanel({ feed, locale }: { feed: Feed; locale: Locale }) {
  const stats = feed.stats;
  if (!stats) return null;
  const t = DICT[locale].radar;
  const num = new Intl.NumberFormat(locale);
  const breach = feed.hacks.find((h) => h.kind === "breach");

  return (
    <section className="dash" aria-labelledby="dash-title">
      <div className="dash-head">
        <span className="radar-dot" aria-hidden="true" />
        <h2 id="dash-title">{t.title}</h2>
        <span className="dash-updated">
          <RelativeDate iso={feed.updated} locale={locale} />
        </span>
      </div>

      <dl className="dash-kpis">
        <Kpi icon={<ShieldIcon />} label={t.claims} note={t.lastWeek} value={num.format(stats.claims)} />
        <Kpi icon={<GlobeIcon />} label={t.countries} note={t.lastWeek} value={num.format(stats.countries)} />
        <Kpi
          icon={<DatabaseIcon />}
          label={t.breaches}
          note={t.lastDays(stats.breaches.days)}
          value={num.format(stats.breaches.count)}
        />
        {stats.topGroup && (
          <Kpi
            icon={<UsersIcon />}
            label={t.topGroup}
            note={t.claimsCount(num.format(stats.topGroup.count))}
            value={stats.topGroup.name}
            text
          />
        )}
      </dl>

      <div className="dash-grid">
        <div className="dash-card dash-area">
          <CardHead title={t.chart} note={t.lastDays(stats.daily.length)} id="dash-area-title" />
          <AreaChart stats={stats} locale={locale} />
        </div>

        <div className="dash-card dash-gauge">
          <CardHead title={t.latam} note={t.lastWeek} />
          <Gauge count={stats.latam.count} total={stats.latam.total} locale={locale} />
          <p className="dash-note">{t.latamNote}</p>
        </div>

        <div className="dash-card dash-sectors">
          <CardHead title={t.sectors} note={t.lastWeek} />
          <ol className="sector-list">
            {stats.sectors.map((s) => (
              <li key={s.en}>
                <span className="sector-name">{s[locale]}</span>
                <span className="sector-track" aria-hidden="true">
                  <span className="sector-bar" style={{ width: `${(s.count / stats.sectors[0].count) * 100}%` }} />
                </span>
                <span className="sector-count">{num.format(s.count)}</span>
              </li>
            ))}
          </ol>
        </div>

        {breach && (
          <div className="dash-card dash-breach">
            <CardHead title={t.latestBreach} />
            <div className="radar-float-meta">
              <SeverityChip severity={breach.severity} locale={locale} />
              <RelativeDate iso={breach.date_published} locale={locale} />
            </div>
            <p className="dash-breach-title">{breach.title}</p>
            <p className="dash-note">{localized(breach, locale).summary}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function Kpi({ icon, label, note, value, text }: { icon: ReactNode; label: string; note: string; value: string; text?: boolean }) {
  return (
    <div className="kpi">
      <div>
        <dt>{label}</dt>
        <dd className={text ? "kpi-value kpi-text" : "kpi-value"}>{value}</dd>
        <dd className="kpi-note">{note}</dd>
      </div>
      <span className="kpi-icon" aria-hidden="true">
        {icon}
      </span>
    </div>
  );
}

function CardHead({ title, note, id }: { title: string; note?: string; id?: string }) {
  return (
    <div className="dash-card-head">
      <h3 id={id}>{title}</h3>
      {note && <span>{note}</span>}
    </div>
  );
}

/** Single-series area chart. The SVG draws; an HTML column per day carries the hover tooltip. */
function AreaChart({ stats, locale }: { stats: FeedStats; locale: Locale }) {
  const t = DICT[locale].radar;
  const num = new Intl.NumberFormat(locale);
  const short = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", timeZone: "UTC" });
  const long = new Intl.DateTimeFormat(locale, { weekday: "long", month: "short", day: "numeric", timeZone: "UTC" });
  const days = stats.daily;
  const max = Math.max(1, ...days.map((d) => d.claims));
  const peak = days.findIndex((d) => d.claims === max);
  const last = days.length - 1;
  // Plot in a 0-100 box; 15% headroom keeps the peak label clear of the top.
  const x = (i: number) => (i / last) * 100;
  const y = (v: number) => 100 - (v / max) * 85;
  const pts = days.map((d, i) => [x(i), y(d.claims)] as const);
  const line = smoothPath(pts);
  const area = `${line} L100,100 L0,100 Z`;
  const date = (day: string) => new Date(`${day}T00:00:00Z`);

  return (
    <div className="area">
      <div className="area-plot" aria-hidden="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="area-svg">
          <defs>
            <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#05b5de" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#05b5de" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[25, 50, 75].map((g) => (
            <line key={g} x1="0" x2="100" y1={g} y2={g} className="area-grid" vectorEffect="non-scaling-stroke" />
          ))}
          <path d={area} fill="url(#area-fill)" />
          <path d={line} className="area-line" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="area-cols">
          {days.map((d, i) => (
            <div
              key={d.day}
              className="area-col"
              data-tip={`${long.format(date(d.day))}: ${t.claimsCount(num.format(d.claims))}${i === last ? ` (${t.soFar})` : ""}`}
            >
              <span className="area-dot" style={{ bottom: `${100 - y(d.claims)}%` }} />
              {i === peak && (
                <span className="area-peak" style={{ bottom: `${100 - y(d.claims)}%` }}>
                  {num.format(d.claims)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="area-axis" aria-hidden="true">
        {days.map((d, i) => (
          <span key={d.day}>{i % 2 === last % 2 ? short.format(date(d.day)) : ""}</span>
        ))}
      </div>
      <table className="visually-hidden" aria-labelledby="dash-area-title">
        <thead>
          <tr>
            <th scope="col">{t.day}</th>
            <th scope="col">{t.chart}</th>
          </tr>
        </thead>
        <tbody>
          {days.map((d, i) => (
            <tr key={d.day}>
              <th scope="row">{long.format(date(d.day))}</th>
              <td>
                {num.format(d.claims)}
                {i === last && ` (${t.soFar})`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Catmull-Rom through the points, as cubic Béziers, clamped so the curve never dips below zero. */
function smoothPath(pts: readonly (readonly [number, number])[]): string {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [pts[i - 1] ?? pts[i], pts[i], pts[i + 1], pts[i + 2] ?? pts[i + 1]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, Math.min(100, p1[1] + (p2[1] - p0[1]) / 6)];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, Math.min(100, p2[1] - (p3[1] - p1[1]) / 6)];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
}

function Gauge({ count, total, locale }: { count: number; total: number; locale: Locale }) {
  const t = DICT[locale].radar;
  const num = new Intl.NumberFormat(locale);
  const pct = new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 });
  const share = total ? count / total : 0;
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="gauge">
      <svg viewBox="0 0 120 120" className="gauge-svg" aria-hidden="true">
        <circle cx="60" cy="60" r={r} className="gauge-track" />
        <circle
          cx="60"
          cy="60"
          r={r}
          className="gauge-fill"
          strokeDasharray={`${Math.max(share * c, 2)} ${c}`}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="gauge-center">
        <span className="gauge-pct">{pct.format(share)}</span>
        <span className="gauge-of">{t.latamOf(num.format(count), num.format(total))}</span>
      </div>
    </div>
  );
}

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function ShieldIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
      <path d="M12 8v5M12 16h.01" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg {...iconProps}>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.5c1.6.8 2.6 2.7 3 5.5" />
    </svg>
  );
}
