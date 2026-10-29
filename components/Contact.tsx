import { DICT, type Locale } from "@/lib/i18n";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_DISPLAY, WHATSAPP_URL } from "@/lib/site";
import { ExternalLink } from "./ExternalLink";

export function Contact({ locale }: { locale: Locale }) {
  const t = DICT[locale].contact;
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container" style={{ display: "grid", gap: "1rem" }}>
        <h2 id="contact-title">{t.title}</h2>
        <p className="section-note">{t.note}</p>
        <dl className="contact-grid">
          <div className="contact-item">
            <dt>{t.email}</dt>
            <dd>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </dd>
          </div>
          <div className="contact-item">
            <dt>{t.phone}</dt>
            <dd>
              <a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE_DISPLAY}</a>
              <br />
              <ExternalLink href={WHATSAPP_URL} locale={locale}>
                {t.whatsapp}
              </ExternalLink>
            </dd>
          </div>
          <div className="contact-item">
            <dt>{t.location}</dt>
            <dd>{t.locationValue}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
