import { CONTACT_EMAIL, CONTACT_LOCATION, CONTACT_PHONE, CONTACT_PHONE_DISPLAY, WHATSAPP_URL } from "@/lib/site";
import { ExternalLink } from "./ExternalLink";

export function Contact() {
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container" style={{ display: "grid", gap: "1rem" }}>
        <h2 id="contact-title">Contact</h2>
        <p className="section-note">Questions about this site, a correction, or something else? Write or message us.</p>
        <dl className="contact-grid">
          <div className="contact-item">
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </dd>
          </div>
          <div className="contact-item">
            <dt>Phone / WhatsApp</dt>
            <dd>
              <a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE_DISPLAY}</a>
              <br />
              <ExternalLink href={WHATSAPP_URL}>Message on WhatsApp</ExternalLink>
            </dd>
          </div>
          <div className="contact-item">
            <dt>Location</dt>
            <dd>{CONTACT_LOCATION}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
