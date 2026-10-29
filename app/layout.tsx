import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

// DM Sans, the brand typeface from the Selentic manual, self-hosted and subset to Latin.
const dmSans = localFont({
  src: [
    { path: "./fonts/DMSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/DMSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/DMSans-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});

const title = "Selentic Group | Latest breaches and how to check your exposure";
const description =
  "Free, daily-updated alerts on the latest data breaches and ransomware claims, with a one-click check of whether your email was exposed. No sales, just practical guidance.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title,
    description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#0c0d0d",
  width: "device-width",
  initialScale: 1,
};

// Opt-in analytics. Nothing loads unless NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set in Vercel.
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        {plausibleDomain && (
          <Script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
