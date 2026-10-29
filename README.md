# selenticgroup.com

Single-page information site for Selentic Group: the latest data breaches and ransomware claims, plus a prominent link to [Am I Exposed?](https://www.am-i-exposed.com/) so visitors can check their own email. The site sells nothing and requires no sign-up.

Next.js 16 (App Router, Cache Components), TypeScript, plain CSS with brand tokens. No UI libraries, no client-side data fetching on first load.

## Roadmap

1. **MVP (this repo):** landing page, incident feed from the existing Daily Hack radar, filters and search, detail dialog, quick-check panel, SEO, security headers. *Done.*
2. **Go live:** deploy to Vercel, point `selenticgroup.com` DNS at it (steps below), submit the sitemap to Google Search Console.
3. **Content:** confirm the contact address and footer links (see TODOs), and decide whether a Spanish version (`/es`) is needed.
4. **Optional:** opt-in Plausible analytics; a dedicated Hack Dashboard API with real per-incident severity and summaries (drop-in via `HACKS_API_URL`).

## File tree

```
app/
  api/hacks/route.ts     normalised feed as JSON (used by the "Try again" button)
  fonts/                 DM Sans (brand typeface) subset to Latin WOFF2; Bold TTF for the OG image
  globals.css            ALL design tokens and styles
  icon.svg               favicon from the stacked brand logo
  layout.tsx             fonts, metadata, opt-in analytics
  opengraph-image.tsx    1200x630 social preview, generated at build time
  page.tsx               landing page + JSON-LD
  robots.ts, sitemap.ts
components/
  ExternalLink.tsx       new tab + rel="noopener noreferrer" + screen-reader hint
  Footer.tsx             privacy statement, data source credits, contact
  HackCard.tsx           one incident card + severity chip
  HackDetail.tsx         native <dialog> with details and source link
  HackFeed.tsx           client island: filters, search, "show more", error/empty states
  Header.tsx
  QuickCheck.tsx         "check in under a minute" panel + guidance list
  RelativeDate.tsx       absolute date in HTML, relative after hydration
data/mock-hacks.json     sample feed (HACKS_API_URL=mock)
lib/
  feed.ts                fetch, cache (1 h), normalise radar.json or the Hack shape
  site.ts                URLs, contact, labels (TODOs here)
  types.ts               Hack / Feed types
public/brand/            logos from the brand manual (SVG)
next.config.ts           CSP and security headers
```

## Data source

By default the page reads `https://www.am-i-exposed.com/data/radar.json`, the same feed behind the Daily Hack page. A GitHub Action in the `am-i-exposed` repo refreshes it once a day from RansomLook (ransomware claims) and Have I Been Pwned (verified breaches), both CC BY 4.0, which is why the footer credits them.

`lib/feed.ts` maps each radar item to this shape:

```json
{
  "id": "7566269d4140f168",
  "title": "Assurance Retraite",
  "summary": "Have I Been Pwned verified a data breach at Assurance Retraite. If you had an account there, check whether your email was included and change that password.",
  "severity": "high",
  "severity_estimated": true,
  "affected_domains": [],
  "date_published": "2026-10-20T12:00:00.000Z",
  "source_url": "https://haveibeenpwned.com/PwnedWebsites#AssuranceRetraite",
  "source_name": "Have I Been Pwned",
  "tags": ["Data breach", "Government", "FR"]
}
```

The radar has no severity field, so it is **estimated from the incident type** (verified breach = high, unverified ransomware claim = medium) and the detail dialog says so. A future API that sends its own `severity` is used as-is. The page receives the 60 newest incidents plus the 20 newest high/critical ones, because ransomware claims arrive at about 40 a day and would otherwise push every verified breach off the page.

To use another API, set `HACKS_API_URL` to any endpoint returning `{ "items": [...] }`, `{ "hacks": [...] }` or a bare array of objects with the fields in `data/mock-hacks.json`. `HACKS_API_KEY`, if set, goes out as a Bearer token.

Caching: `getFeed()` is a `"use cache"` function with `cacheLife("hours")`, so the page is static HTML regenerated at most hourly. A failed fetch is cached for only a minute, so the next visitor triggers a retry.

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start   # production build, what Vercel runs
npm run lint
```

Copy `.env.example` to `.env.local` to override the feed (`HACKS_API_URL=mock` works offline).

## Deploy to Vercel

The site lives in [gcarlin-selentic/Webpage](https://github.com/gcarlin-selentic/Webpage) and deploys through the Vercel project `selentic/webpage`, which already serves `www.selenticgroup.com`.

1. Push a branch: Vercel builds a preview deployment with its own URL. Pushing to `main` deploys to production.
2. `vercel.json` sets the framework to Next.js, overriding whatever preset the project kept from the old static site, so no dashboard change is needed.
3. Environment variables (all optional): `HACKS_API_URL`, `HACKS_API_KEY`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. Leaving them empty gives the live radar feed and no analytics.
4. Check the preview URL before merging into `main`. If production misbehaves after a merge, use **Instant Rollback** in the Vercel project.

### Domain: keep it at Squarespace, point DNS at Vercel

No forwarding is needed, and the domain stays registered at Squarespace.

1. Vercel > Project > **Settings > Domains**: add `selenticgroup.com` and `www.selenticgroup.com`, and choose `www` as primary (the apex will 308 to it, matching `SITE_URL` in `lib/site.ts`).
2. Squarespace > **Domains > selenticgroup.com > DNS settings**: remove any Squarespace website records (the default A records and the `www` CNAME to `ext-squarespace.com`), then add the records Vercel shows on the Domains page. Today these are normally an `A` record for `@` and a `CNAME` for `www`, but copy the exact values Vercel displays.
3. **Do not touch MX, SPF/DKIM/DMARC (TXT) records.** Company email keeps working only if those stay as they are.
4. Vercel issues the SSL certificate automatically once DNS resolves (minutes to a few hours).

## Analytics (off by default)

Nothing tracks visitors unless you opt in. To enable Plausible: create the site in Plausible, set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=www.selenticgroup.com` in Vercel and redeploy. The CSP adds `plausible.io` automatically only when that variable is set. Update the footer privacy statement at the same time.

## Brand: where to change things

| What | Where |
|---|---|
| Colours (navy `#305F94`, blue `#367ABC`, cyan `#05B5DE`, charcoal `#253138`, ink `#0C0D0D`) | `:root` in `app/globals.css` (from the brand manual deck) |
| Typeface (DM Sans 400/500/700) | `app/fonts/` + `localFont` in `app/layout.tsx` |
| Logos | `public/brand/*.svg` (white horizontal in header/footer, stacked for the favicon and JSON-LD) |
| Social image | `app/opengraph-image.tsx` (TODO: replace with a designed image if the brand team has one) |
| Contact email, repo link | `lib/site.ts` (TODOs) |

Severity colours are not in the manual. They are functional and always paired with a text label.

## Presenting "Check if you're exposed"

The link appears three times, each where a visitor naturally decides to act: in the header (always visible, also on mobile), as the primary button in the hero (above the fold on a 375 px phone), and inside every incident's detail dialog, the moment a visitor has just read about a breach that may involve them. It always uses the same label, "Check if you're exposed", in the brand cyan, and always says it opens in a new tab, so visitors don't lose their place in the feed. Trust comes from being plain: the quick-check panel says in three steps what will happen, that no account is needed, that the basic check is free and that Selentic builds the tool. The page itself never asks for an email, so the only place anyone types an address is the tool built for it.

## QA checklist and acceptance criteria

Verified locally on 2026-10-29 against a production build (`next start`), Lighthouse 13.6 mobile preset (simulated throttling):

| Criterion | Target | Result |
|---|---|---|
| Lighthouse Performance | >= 90 | 100 (one cold-start run scored 87; reruns 100) |
| Lighthouse Accessibility / Best Practices / SEO | 100 / >= 90 / >= 90 | 100 / 100 / 100 |
| FCP / LCP / CLS / TBT | < 1 s / < 2 s / < 0.1 / < 200 ms | 0.8 s / 0.8 s / 0 / 40 ms |
| Latest 10 incidents in first HTML | yes | yes (server-rendered, no client fetch) |
| am-i-exposed link above the fold on 375x812 | yes | header button and hero button, no horizontal scroll |
| Keyboard | full | skip link, visible focus ring, radio filters, Enter opens dialog, Esc closes, focus returns to the card |
| External links | new tab, `rel="noopener"` | all, plus `noreferrer` and a screen-reader hint |
| Feed failure | friendly banner + retry | "Couldn't load the latest alerts" with Try again |
| Empty feed | optimistic message + link | implemented |
| Meta | title, description, canonical, OG, Twitter, JSON-LD | Organization + ItemList (10 items) |
| Security headers | CSP, HSTS, nosniff, referrer, permissions | set in `next.config.ts` |

Before each release:

- [ ] `npm run lint && npm run build` pass
- [ ] Lighthouse mobile on the Vercel preview URL: all categories >= 90
- [ ] Tab through the page: every control reachable and visibly focused
- [ ] Open and close a detail dialog with the keyboard only
- [ ] Check the page at 375 px: no horizontal scroll, CTA visible without scrolling
- [ ] Rich Results Test / Schema validator on the live URL
- [ ] securityheaders.com on the live URL
