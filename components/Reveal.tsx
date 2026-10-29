import type { FeedStats } from "@/lib/types";
import { DICT, type Locale } from "@/lib/i18n";

/**
 * A large statement whose words brighten as it scrolls into view. Pure CSS
 * (scroll-driven animations); browsers without support, and visitors who
 * prefer reduced motion, simply see the full text.
 */
export function Reveal({ stats, locale }: { stats: FeedStats; locale: Locale }) {
  const t = DICT[locale].reveal;
  const num = new Intl.NumberFormat(locale);
  const lines = t.lines(num.format(stats.claims), num.format(stats.breaches.count), stats.breaches.days);
  return (
    <section className="section reveal" aria-labelledby="reveal-title">
      <div className="container">
        <p className="eyebrow" id="reveal-title">
          {t.eyebrow}
        </p>
        <p className="reveal-text">
          {lines.map((line, l) => (
            <span key={l} className="reveal-line">
              {line.split(" ").map((word, w) => (
                <span key={w} className="reveal-word">
                  {word}{" "}
                </span>
              ))}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
