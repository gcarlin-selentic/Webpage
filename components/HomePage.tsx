import { Contact } from "@/components/Contact";
import { ArrowIcon, ExternalLink } from "@/components/ExternalLink";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { HackFeed } from "@/components/HackFeed";
import { Header } from "@/components/Header";
import { Guidance, QuickCheck } from "@/components/QuickCheck";
import { RadarPanel } from "@/components/RadarPanel";
import { RelativeDate } from "@/components/RelativeDate";
import { Reveal } from "@/components/Reveal";
import { getFeed } from "@/lib/feed";
import { DICT, HOME, localized, type Locale } from "@/lib/i18n";
import { CONTACT_EMAIL, CONTACT_PHONE, EXPERT_EMAIL, EXPOSURE_URL, SITE_NAME, SITE_URL } from "@/lib/site";
import type { Feed } from "@/lib/types";

/** The whole landing page, rendered once per language by app/(en)/page.tsx and app/(es)/es/page.tsx. */
export async function HomePage({ locale }: { locale: Locale }) {
  // Cached for an hour (see lib/feed.ts), so the page is served as static HTML.
  const result = await getFeed();
  const feed = result.ok ? result.feed : null;
  const t = DICT[locale];

  return (
    <>
      <Header locale={locale} />
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="container">
            <p className="eyebrow" lang="en">
              Technology &amp; beyond
            </p>
            <h1 id="hero-title">
              <span className="accent">{t.hero.titleAccent}</span> {t.hero.titleRest}
            </h1>
            <p className="hero-sub">{t.hero.sub}</p>
            <div className="hero-actions">
              <ExternalLink className="btn btn-primary" href={EXPOSURE_URL} locale={locale}>
                {t.checkLong} <ArrowIcon />
              </ExternalLink>
              <a className="btn btn-ghost" href="#incidents">
                {t.hero.seeIncidents}
              </a>
            </div>
            {feed && !feed.stats && (
              <p className="hero-meta">
                {t.hero.updated} <RelativeDate iso={feed.updated} locale={locale} />
              </p>
            )}
            {feed?.stats && <RadarPanel feed={feed} locale={locale} />}
            <div className="expert-cta">
              <a
                className="btn btn-expert"
                href={`mailto:${EXPERT_EMAIL}?subject=${encodeURIComponent(t.expert.subject)}`}
              >
                {t.expert.label}
              </a>
            </div>
          </div>
        </section>

        {feed?.stats && <Reveal stats={feed.stats} locale={locale} />}

        <section id="incidents" className="section" aria-labelledby="incidents-title">
          <div className="container">
            <div className="section-head">
              <h2 id="incidents-title">{t.incidents.title}</h2>
              <p className="section-note">{t.incidents.note}</p>
            </div>
            <HackFeed initial={feed} locale={locale} />
          </div>
        </section>

        <QuickCheck locale={locale} />
        <Guidance locale={locale} />
        <Faq locale={locale} />
        <Contact locale={locale} />
      </main>
      <Footer sources={feed?.sources ?? []} locale={locale} />
      {feed && <JsonLd feed={feed} locale={locale} />}
    </>
  );
}

function JsonLd({ feed, locale }: { feed: Feed; locale: Locale }) {
  const t = DICT[locale];
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/brand/logo-white-stacked.svg`,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: CONTACT_EMAIL,
        telephone: CONTACT_PHONE,
        availableLanguage: ["English", "Spanish"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: locale,
      url: `${SITE_URL}${HOME[locale]}`,
      mainEntity: t.faq.items.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: t.incidents.listName,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: Math.min(10, feed.hacks.length),
      itemListElement: feed.hacks.slice(0, 10).map((h, i) => {
        const { summary, tags } = localized(h, locale);
        return {
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "CreativeWork",
            name: h.title,
            description: summary,
            datePublished: h.date_published,
            keywords: tags.join(", "),
            ...(h.source_url && { url: h.source_url }),
          },
        };
      }),
    },
  ];
  return (
    <script
      type="application/ld+json"
      // Escape "<" so feed content can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
