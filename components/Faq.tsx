import { DICT, type Locale } from "@/lib/i18n";

// Answers are plain text in lib/i18n.ts so the same list feeds the page and the FAQPage JSON-LD.
export function Faq({ locale }: { locale: Locale }) {
  const t = DICT[locale].faq;
  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className="container" style={{ display: "grid", gap: "1rem" }}>
        <h2 id="faq-title">{t.title}</h2>
        <div className="faq-list">
          {t.items.map(({ q, a }) => (
            <details key={q} className="faq-item">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
