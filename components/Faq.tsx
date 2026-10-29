// Plain-text answers so the same list feeds the page and the FAQPage JSON-LD.
export const FAQ = [
  {
    q: "What is this site?",
    a: "A daily list of publicly reported data breaches and ransomware claims, with a link to check whether your own email was exposed. Selentic Group publishes it as a free information service. Nothing is sold here and no sign-up is needed.",
  },
  {
    q: "Where does the incident data come from?",
    a: "From two public sources: Have I Been Pwned, which lists verified data breaches, and RansomLook, which tracks claims posted on ransomware groups' leak sites. Both publish under CC BY 4.0. The list is refreshed once a day.",
  },
  {
    q: "What's the difference between a data breach and a ransomware claim?",
    a: "A data breach entry has been verified by Have I Been Pwned: the leaked data exists and was analysed. A ransomware claim is what a criminal group says it did. It is listed as reported and has not been independently verified, so treat it as a warning, not a confirmation.",
  },
  {
    q: "How is the severity level decided?",
    a: "The sources don't publish a severity rating, so it is estimated from the type of incident. Verified breaches are marked High because account data is known to be exposed; unverified ransomware claims are marked Medium. Each incident's details say when the level is an estimate.",
  },
  {
    q: "Does checking my email cost anything?",
    a: "No. The basic check on Am I Exposed? is free and needs no account. The tool is built by Selentic Group and opens in a new tab.",
  },
  {
    q: "Does this site collect my data?",
    a: "No. It sets no cookies, runs no ads and does not track you. This page never asks for your email; the check happens on am-i-exposed.com under its own privacy policy.",
  },
  {
    q: "A company I use is on the list. What should I do?",
    a: "Check your email on Am I Exposed?, change the password for that service and anywhere you reused it, and turn on two-step verification on your email account. The steps above this section explain each one.",
  },
  {
    q: "I think an entry is wrong. Who do I tell?",
    a: "Entries come straight from the public sources listed above, so corrections start there. If something looks wrong, write to us using the contact details below and we will look into it.",
  },
] as const;

export function Faq() {
  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className="container" style={{ display: "grid", gap: "1rem" }}>
        <h2 id="faq-title">Frequently asked questions</h2>
        <div className="faq-list">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="faq-item">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
