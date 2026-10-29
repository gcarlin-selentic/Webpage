import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { DICT, HOME, type Locale } from "@/lib/i18n";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "@/app/globals.css";

// DM Sans, the brand typeface from the Selentic manual, self-hosted and subset to Latin.
const dmSans = localFont({
  src: [
    { path: "../app/fonts/DMSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/DMSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../app/fonts/DMSans-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});

/** Metadata for one language, with hreflang links to the other. */
export function localeMetadata(locale: Locale): Metadata {
  const { title, description, ogLocale } = DICT[locale].meta;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: HOME[locale],
      languages: { en: HOME.en, es: HOME.es, "x-default": HOME.en },
    },
    openGraph: {
      type: "website",
      url: HOME[locale],
      siteName: SITE_NAME,
      title,
      description,
      locale: ogLocale,
      alternateLocale: locale === "en" ? DICT.es.meta.ogLocale : DICT.en.meta.ogLocale,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const viewport: Viewport = {
  themeColor: "#0c0d0d",
  width: "device-width",
  initialScale: 1,
};

// Opt-in analytics. Nothing loads unless NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set in Vercel.
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

/**
 * Each language is its own root layout (app/(en) and app/(es)) so <html lang>
 * is right for screen readers and search engines.
 */
export function RootDocument({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={locale} className={dmSans.variable}>
      <body>
        <a className="skip-link" href="#main">
          {DICT[locale].skip}
        </a>
        {children}
        {plausibleDomain && (
          <Script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
