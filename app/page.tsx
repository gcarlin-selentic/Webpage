import { Contact } from "@/components/Contact";
import { FAQ, Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { ArrowIcon, ExternalLink } from "@/components/ExternalLink";
import { HackFeed } from "@/components/HackFeed";
import { Header } from "@/components/Header";
import { Guidance, QuickCheck } from "@/components/QuickCheck";
import { RelativeDate } from "@/components/RelativeDate";
import { getFeed } from "@/lib/feed";
import { CONTACT_EMAIL, CONTACT_PHONE, EXPOSURE_URL, SITE_NAME, SITE_URL } from "@/lib/site";
import type { Feed } from "@/lib/types";

export default async function Home() {
  // Cached for an hour (see lib/feed.ts), so the page is served as static HTML.
  const result = await getFeed();
  const feed = result.ok ? result.feed : null;

  return (
    <>
      <Header />
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="container">
            <p className="eyebrow">Technology &amp; beyond</p>
            <h1 id="hero-title">Daily alerts on the latest data breaches and ransomware attacks</h1>
            <p className="hero-sub">
              We track hacks and leaks so you can quickly see who was hit and check whether your email was exposed.
              No sales, just practical guidance.
            </p>
            <div className="hero-actions">
              <ExternalLink className="btn btn-primary" href={EXPOSURE_URL}>
                Check if you&apos;re exposed <ArrowIcon />
              </ExternalLink>
              <a className="btn btn-ghost" href="#incidents">
                See latest incidents
              </a>
            </div>
            {feed && (
              <p className="hero-meta">
                Feed updated <RelativeDate iso={feed.updated} />
              </p>
            )}
          </div>
        </section>

        <section id="incidents" className="section" aria-labelledby="incidents-title">
          <div className="container">
            <div className="section-head">
              <h2 id="incidents-title">Latest incidents</h2>
              <p className="section-note">Newest first. Updated daily.</p>
            </div>
            <HackFeed initial={feed} />
          </div>
        </section>

        <QuickCheck />
        <Guidance />
        <Faq />
        <Contact />
      </main>
      <Footer sources={feed?.sources ?? []} />
      {feed && <JsonLd feed={feed} />}
    </>
  );
}

function JsonLd({ feed }: { feed: Feed }) {
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
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Latest security incidents",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: Math.min(10, feed.hacks.length),
      itemListElement: feed.hacks.slice(0, 10).map((h, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "CreativeWork",
          name: h.title,
          description: h.summary,
          datePublished: h.date_published,
          keywords: h.tags.join(", "),
          ...(h.source_url && { url: h.source_url }),
        },
      })),
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
