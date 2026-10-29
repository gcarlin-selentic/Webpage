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
        <nav aria-label="Main">
          <a className="nav-link" href="#incidents">
            Latest incidents
          </a>
          <a className="nav-link" href="#check">
            How to check
          </a>
          <ExternalLink className="btn btn-primary btn-sm" href={EXPOSURE_URL}>
            Check exposure <ArrowIcon />
          </ExternalLink>
        </nav>
      </div>
    </header>
  );
}
