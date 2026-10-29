import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { DICT, type Locale } from "./i18n";

// Social preview, rendered once at build time from brand assets, one per language.
// TODO(selentic): replace with a designed 1200x630 image from the brand team if one exists.
export const ogSize = { width: 1200, height: 630 };

const font = readFile(join(process.cwd(), "app/fonts/DMSans-Bold.ttf"));
const logo = readFile(join(process.cwd(), "public/brand/logo-white-h.svg"), "base64");

export async function renderOgImage(locale: Locale) {
  const t = DICT[locale].meta;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0c0d0d",
          color: "#ffffff",
          fontFamily: "DM Sans",
        }}
      >
        {/* eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element -- rendered to PNG, not HTML */}
        <img src={`data:image/svg+xml;base64,${await logo}`} width={320} height={60} />
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 64, lineHeight: 1.1, maxWidth: 1000 }}>{t.ogTitle}</div>
          <div style={{ fontSize: 32, color: "#05b5de" }}>{t.ogCta}</div>
        </div>
        <div style={{ display: "flex", height: 12, background: "#305f94", borderRadius: 6 }} />
      </div>
    ),
    { ...ogSize, fonts: [{ name: "DM Sans", data: await font, weight: 700, style: "normal" }] },
  );
}
