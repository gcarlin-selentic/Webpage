"use client";

import { useEffect, useRef } from "react";
import type { Hack } from "@/lib/types";
import { EXPOSURE_URL } from "@/lib/site";
import { DICT, localized, type Locale } from "@/lib/i18n";
import { ArrowIcon, ExternalLink } from "./ExternalLink";
import { SeverityChip } from "./HackCard";
import { RelativeDate } from "./RelativeDate";

/**
 * Native <dialog>: showModal() gives focus trapping, Esc to close, an inert
 * background and focus return to the opener without extra JavaScript.
 */
export function HackDetail({ hack, locale, onClose }: { hack: Hack | null; locale: Locale; onClose: () => void }) {
  const d = DICT[locale];
  const t = d.detail;
  const text = hack && localized(hack, locale);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (hack && !dialog.open) dialog.showModal();
    if (!hack && dialog.open) dialog.close();
  }, [hack]);

  return (
    <dialog
      ref={ref}
      className="detail"
      aria-labelledby="detail-title"
      onClose={onClose}
      onClick={(e) => {
        // Click on the backdrop closes the dialog.
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
    >
      {hack && text && (
        <div className="detail-body">
          <div className="detail-head">
            <h2 id="detail-title">{hack.title}</h2>
            <button type="button" className="icon-btn" onClick={() => ref.current?.close()} aria-label={t.close}>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18">
                <path d="M4 4l10 10M14 4 4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <p>{text.summary}</p>
          <dl>
            <dt>{t.severity}</dt>
            <dd>
              <SeverityChip severity={hack.severity} locale={locale} />
            </dd>
            <dt>{t.reported}</dt>
            <dd>
              <RelativeDate iso={hack.date_published} locale={locale} />
            </dd>
            {hack.affected_domains.length > 0 && (
              <>
                <dt>{t.domains}</dt>
                <dd>{hack.affected_domains.join(", ")}</dd>
              </>
            )}
            {text.tags.length > 0 && (
              <>
                <dt>{t.tags}</dt>
                <dd>{text.tags.join(" · ")}</dd>
              </>
            )}
            {hack.source_name && (
              <>
                <dt>{t.source}</dt>
                <dd>{hack.source_name}</dd>
              </>
            )}
          </dl>
          {hack.severity_estimated && (
            <p className="section-note">{t.estimated}</p>
          )}
          <div className="detail-actions">
            <ExternalLink className="btn btn-primary" href={EXPOSURE_URL} locale={locale}>
              {d.checkLong} <ArrowIcon />
            </ExternalLink>
            {hack.source_url && (
              <ExternalLink className="btn btn-ghost" href={hack.source_url} locale={locale}>
                {t.viewSource} <ArrowIcon />
              </ExternalLink>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
