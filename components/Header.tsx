import Link from "next/link";
import { DICT, HOME, type Locale } from "@/lib/i18n";
import { EXPOSURE_URL } from "@/lib/site";
import { ArrowIcon, ExternalLink } from "./ExternalLink";

export function Header({ locale }: { locale: Locale }) {
  const t = DICT[locale];
  const other: Locale = locale === "en" ? "es" : "en";
  return (
    <header className="site-header">
      <div className="container">
        <Link href={HOME[locale]} aria-label={t.home}>
          {/* Logo from the brand manual (white horizontal version). */}
          {/* eslint-disable-next-line @next/next/no-img-element -- a 3 KB SVG needs no image optimisation */}
          <img src="/brand/logo-white-h.svg" alt="" width={148} height={28} />
        </Link>
        <nav aria-label={t.nav.label} className="site-nav">
          <a className="nav-link" href="#incidents">
            {t.nav.incidents}
          </a>
          <a className="nav-link" href="#faq">
            {t.nav.faq}
          </a>
          <a className="nav-link" href="#contact">
            {t.nav.contact}
          </a>
          {/* A plain anchor: each language has its own root layout, so this is a full page load. */}
          <a className="nav-link lang-switch" href={HOME[other]} hrefLang={other} lang={other} title={t.switchTo.title}>
            <span aria-hidden="true">{t.switchTo.label}</span>
            <span className="visually-hidden">{t.switchTo.title}</span>
          </a>
        </nav>
        <ExternalLink className="btn btn-primary btn-sm header-cta" href={EXPOSURE_URL} locale={locale}>
          {t.checkShort} <ArrowIcon />
        </ExternalLink>
      </div>
    </header>
  );
}
