"use client";

import { useEffect, useRef } from "react";
import type { Hack } from "@/lib/types";
import { EXPOSURE_URL } from "@/lib/site";
import { ArrowIcon, ExternalLink } from "./ExternalLink";
import { SeverityChip } from "./HackCard";
import { RelativeDate } from "./RelativeDate";

/**
 * Native <dialog>: showModal() gives focus trapping, Esc to close, an inert
 * background and focus return to the opener without extra JavaScript.
 */
export function HackDetail({ hack, onClose }: { hack: Hack | null; onClose: () => void }) {
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
      {hack && (
        <div className="detail-body">
          <div className="detail-head">
            <h2 id="detail-title">{hack.title}</h2>
            <button type="button" className="icon-btn" onClick={() => ref.current?.close()} aria-label="Close details">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18">
                <path d="M4 4l10 10M14 4 4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <p>{hack.summary}</p>
          <dl>
            <dt>Severity</dt>
            <dd>
              <SeverityChip severity={hack.severity} />
            </dd>
            <dt>Reported</dt>
            <dd>
              <RelativeDate iso={hack.date_published} />
            </dd>
            {hack.affected_domains.length > 0 && (
              <>
                <dt>Domains</dt>
                <dd>{hack.affected_domains.join(", ")}</dd>
              </>
            )}
            {hack.tags.length > 0 && (
              <>
                <dt>Tags</dt>
                <dd>{hack.tags.join(" · ")}</dd>
              </>
            )}
            {hack.source_name && (
              <>
                <dt>Source</dt>
                <dd>{hack.source_name}</dd>
              </>
            )}
          </dl>
          {hack.severity_estimated && (
            <p className="section-note">
              Severity is our estimate from the incident type: verified breaches rank high, unverified ransomware
              claims rank medium.
            </p>
          )}
          <div className="detail-actions">
            <ExternalLink className="btn btn-primary" href={EXPOSURE_URL}>
              Check if you&apos;re exposed <ArrowIcon />
            </ExternalLink>
            {hack.source_url && (
              <ExternalLink className="btn btn-ghost" href={hack.source_url}>
                View source <ArrowIcon />
              </ExternalLink>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
