import { DICT, type Locale } from "@/lib/i18n";
import { EXPOSURE_URL } from "@/lib/site";
import { ArrowIcon, ExternalLink } from "./ExternalLink";

export function QuickCheck({ locale }: { locale: Locale }) {
  const d = DICT[locale];
  return (
    <section id="check" className="section" aria-labelledby="check-title">
      <div className="container">
        <div className="quick-check">
          <div style={{ display: "grid", gap: "1rem" }}>
            <h2 id="check-title">{d.check.title}</h2>
            <ol>
              {d.check.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p>{d.check.note}</p>
          </div>
          <ExternalLink className="btn btn-primary" href={EXPOSURE_URL} locale={locale}>
            {d.checkLong} <ArrowIcon />
          </ExternalLink>
        </div>
      </div>
    </section>
  );
}

export function Guidance({ locale }: { locale: Locale }) {
  const t = DICT[locale].guidance;
  return (
    <section className="section guidance" aria-labelledby="guidance-title">
      <div className="container" style={{ display: "grid", gap: "1rem" }}>
        <h2 id="guidance-title">{t.title}</h2>
        <ul>
          {t.items.map(([lead, rest]) => (
            <li key={lead}>
              <strong>{lead}</strong> {rest}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
