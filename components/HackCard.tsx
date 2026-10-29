import type { Hack } from "@/lib/types";
import { SEVERITY_LABEL } from "@/lib/site";
import { RelativeDate } from "./RelativeDate";

export function SeverityChip({ severity }: { severity: Hack["severity"] }) {
  return <span className={`sev sev-${severity}`}>{SEVERITY_LABEL[severity]}</span>;
}

export function HackCard({ hack, onOpen }: { hack: Hack; onOpen: (hack: Hack) => void }) {
  const headingId = `hack-${hack.id}`;
  return (
    <li>
      <article className="hack-card" aria-labelledby={headingId}>
        <div className="hack-card-top">
          <SeverityChip severity={hack.severity} />
          <RelativeDate iso={hack.date_published} />
          {hack.tags[0] && <span>{hack.tags[0]}</span>}
        </div>
        <h3 id={headingId}>{hack.title}</h3>
        {hack.affected_domains.length > 0 && (
          <div className="domains">
            Affects {hack.affected_domains.map((d) => `@${d}`).join(", ")}
          </div>
        )}
        <p>{hack.summary}</p>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onOpen(hack)} aria-haspopup="dialog">
          Read details<span className="visually-hidden"> about {hack.title}</span>
        </button>
      </article>
    </li>
  );
}
