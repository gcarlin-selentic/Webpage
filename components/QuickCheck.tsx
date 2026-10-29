import { EXPOSURE_URL } from "@/lib/site";
import { ArrowIcon, ExternalLink } from "./ExternalLink";

export function QuickCheck() {
  return (
    <section id="check" className="section" aria-labelledby="check-title">
      <div className="container">
        <div className="quick-check">
          <div style={{ display: "grid", gap: "1rem" }}>
            <h2 id="check-title">Check your email in under a minute</h2>
            <ol>
              <li>Open Am I Exposed? in a new tab.</li>
              <li>Enter your personal or work email address. No account needed.</li>
              <li>See whether it appears in known breaches, then follow the steps below.</li>
            </ol>
            <p>Am I Exposed? is built by Selentic Group. The basic check is free.</p>
          </div>
          <ExternalLink className="btn btn-primary" href={EXPOSURE_URL}>
            Check if you&apos;re exposed <ArrowIcon />
          </ExternalLink>
        </div>
      </div>
    </section>
  );
}

export function Guidance() {
  return (
    <section className="section guidance" aria-labelledby="guidance-title">
      <div className="container" style={{ display: "grid", gap: "1rem" }}>
        <h2 id="guidance-title">If your company shows up in a breach</h2>
        <ul>
          <li>
            <strong>Change the password</strong> for that service, and anywhere else you reused it.
          </li>
          <li>
            <strong>Turn on two-step verification</strong> on your email first, since it resets every other account.
          </li>
          <li>
            <strong>Expect targeted phishing.</strong> Leaked emails are used for convincing fake invoices and
            password-reset messages.
          </li>
          <li>
            <strong>Tell your IT or security team</strong> if a work address is involved, so they can check sign-ins.
          </li>
        </ul>
      </div>
    </section>
  );
}
