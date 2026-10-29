import type { Feed } from "@/lib/types";
import { CONTACT_EMAIL, REPO_URL } from "@/lib/site";
import { ExternalLink } from "./ExternalLink";

export function Footer({ sources }: { sources: Feed["sources"] }) {
  return (
    <footer className="site-footer">
      <div className="container">
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG logo */}
        <img src="/brand/logo-white-h.svg" alt="Selentic Group" width={120} height={23} loading="lazy" />
        <p id="privacy">
          <strong>Privacy:</strong> this site sets no cookies, runs no ads and does not track you. We don&apos;t ask
          for your email here; checks happen on am-i-exposed.com under its own privacy policy.
        </p>
        {sources.length > 0 && (
          <p>
            Incident data:{" "}
            {sources.map((s, i) => (
              <span key={s.url}>
                {i > 0 && ", "}
                <ExternalLink href={s.url}>{s.name}</ExternalLink>
                {s.license && ` (${s.license})`}
              </span>
            ))}
            . Ransomware entries are claims made by the groups themselves and are not independently verified.
          </p>
        )}
        <div className="footer-links">
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy</a>
          {REPO_URL && <ExternalLink href={REPO_URL}>Source code</ExternalLink>}
          <span>© Selentic Group</span>
        </div>
      </div>
    </footer>
  );
}
