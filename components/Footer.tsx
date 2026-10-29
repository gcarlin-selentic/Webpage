import type { Feed } from "@/lib/types";
import { DICT, type Locale } from "@/lib/i18n";
import { CONTACT_EMAIL, REPO_URL } from "@/lib/site";
import { ExternalLink } from "./ExternalLink";

export function Footer({ sources, locale }: { sources: Feed["sources"]; locale: Locale }) {
  const t = DICT[locale].footer;
  return (
    <footer className="site-footer">
      <div className="container">
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG logo */}
        <img src="/brand/logo-white-h.svg" alt="Selentic Group" width={120} height={23} loading="lazy" />
        <p id="privacy">
          <strong>{t.privacyLabel}</strong> {t.privacy}
        </p>
        {sources.length > 0 && (
          <p>
            {t.data}{" "}
            {sources.map((s, i) => (
              <span key={s.url}>
                {i > 0 && ", "}
                <ExternalLink href={s.url} locale={locale}>
                  {s.name}
                </ExternalLink>
                {s.license && ` (${s.license})`}
              </span>
            ))}
            . {t.claims}
          </p>
        )}
        <div className="footer-links">
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <a href="#faq">{t.faq}</a>
          <a href="#contact">{t.contact}</a>
          <a href="#privacy">{t.privacyLink}</a>
          {REPO_URL && (
            <ExternalLink href={REPO_URL} locale={locale}>
              {t.source}
            </ExternalLink>
          )}
          <span>© Selentic Group</span>
        </div>
      </div>
    </footer>
  );
}
