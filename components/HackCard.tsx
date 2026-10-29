import type { Hack } from "@/lib/types";
import { DICT, localized, type Locale } from "@/lib/i18n";
import { RelativeDate } from "./RelativeDate";

export function SeverityChip({ severity, locale }: { severity: Hack["severity"]; locale: Locale }) {
  return <span className={`sev sev-${severity}`}>{DICT[locale].severity[severity]}</span>;
}

export function HackCard({ hack, locale, onOpen }: { hack: Hack; locale: Locale; onOpen: (hack: Hack) => void }) {
  const t = DICT[locale].card;
  const { summary, tags } = localized(hack, locale);
  const headingId = `hack-${hack.id}`;
  return (
    <li>
      <article className="hack-card" aria-labelledby={headingId}>
        <div className="hack-card-top">
          <SeverityChip severity={hack.severity} locale={locale} />
          <RelativeDate iso={hack.date_published} locale={locale} />
          {tags[0] && <span>{tags[0]}</span>}
        </div>
        <h3 id={headingId}>{hack.title}</h3>
        {hack.affected_domains.length > 0 && (
          <div className="domains">
            {t.affects} {hack.affected_domains.map((d) => `@${d}`).join(", ")}
          </div>
        )}
        <p>{summary}</p>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onOpen(hack)} aria-haspopup="dialog">
          {t.readDetails}
          <span className="visually-hidden">
            {" "}
            {t.about} {hack.title}
          </span>
        </button>
      </article>
    </li>
  );
}
