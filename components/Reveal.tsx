import type { FeedStats } from "@/lib/types";
import { DICT, type Locale } from "@/lib/i18n";
import { EXPOSURE_URL } from "@/lib/site";
import { ArrowIcon, ExternalLink } from "./ExternalLink";

/**
 * "In numbers": two large figures, each with its caption, then the call to
 * action. Cards fade up as they scroll into view (CSS only; off for reduced
 * motion and in browsers without scroll-driven animations).
 */
export function Reveal({ stats, locale }: { stats: FeedStats; locale: Locale }) {
  const d = DICT[locale];
  const t = d.reveal;
  const num = new Intl.NumberFormat(locale);
  const figures = [
    { value: num.format(stats.claims), label: t.claims, note: t.inDays(7) },
    { value: num.format(stats.breaches.count), label: t.breaches, note: t.inDays(stats.breaches.days) },
  ];
  return (
    <section className="section reveal" aria-labelledby="reveal-title">
      <div className="container">
        <p className="eyebrow" id="reveal-title">
          {t.eyebrow}
        </p>
        <dl className="figures">
          {figures.map((f) => (
            <div key={f.label} className="figure reveal-in">
              <dt className="figure-label">{f.label}</dt>
              <dd className="figure-value">{f.value}</dd>
              <dd className="figure-note">{f.note}</dd>
            </div>
          ))}
        </dl>
        <div className="figures-cta reveal-in">
          <div>
            <p className="figures-closing">{t.closing}</p>
            <p className="figures-sub">{t.closingSub}</p>
          </div>
          <ExternalLink className="btn btn-primary" href={EXPOSURE_URL} locale={locale}>
            {d.checkLong} <ArrowIcon />
          </ExternalLink>
        </div>
      </div>
    </section>
  );
}
