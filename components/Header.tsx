import Link from "next/link";
import { EXPOSURE_URL } from "@/lib/site";
import { ArrowIcon, ExternalLink } from "./ExternalLink";

export function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" aria-label="Selentic Group, home">
          {/* Logo from the brand manual (white horizontal version). */}
          {/* eslint-disable-next-line @next/next/no-img-element -- a 3 KB SVG needs no image optimisation */}
          <img src="/brand/logo-white-h.svg" alt="" width={148} height={28} />
        </Link>
        <nav aria-label="Main" className="site-nav">
          <a className="nav-link" href="#incidents">
            Incidents
          </a>
          <a className="nav-link" href="#faq">
            FAQ
          </a>
          <a className="nav-link" href="#contact">
            Contact
          </a>
        </nav>
        <ExternalLink className="btn btn-primary btn-sm header-cta" href={EXPOSURE_URL}>
          Check exposure <ArrowIcon />
        </ExternalLink>
      </div>
    </header>
  );
}
