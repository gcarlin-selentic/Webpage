import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const analytics = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ? " https://plausible.io" : "";

// The page is statically generated, so it uses a CSP without nonces (see the
// Next.js CSP guide). 'unsafe-inline' for scripts covers Next's inline bootstrap.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${analytics}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src 'self'${analytics}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // Pages from the previous sites that Google still has indexed. Spanish pages
  // go to /es, English ones to the home page; permanent, so search engines
  // transfer them.
  async redirects() {
    return [
      ...["/servicios", "/politica-de-privacidad", "/index.html", "/contacto.html", "/quienes-somos.html", "/partners.html"].map(
        (source) => ({ source, destination: "/es", permanent: true }),
      ),
      ...["/contact", "/about"].map((source) => ({ source, destination: "/", permanent: true })),
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
