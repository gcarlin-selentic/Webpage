import type { AnchorHTMLAttributes } from "react";
import { DICT, type Locale } from "@/lib/i18n";

/** Every outbound link: new tab, no opener, no referrer, and an announcement for screen readers. */
export function ExternalLink({
  children,
  locale = "en",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { locale?: Locale }) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <span className="visually-hidden"> {DICT[locale].newTab}</span>
    </a>
  );
}

export function ArrowIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M5 3h8v8M13 3 3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
