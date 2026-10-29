import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

// Social preview, rendered once at build time from brand assets.
// TODO(selentic): replace with a designed 1200x630 image from the brand team if one exists.
export const alt = "Selentic Group: latest breaches and how to check your exposure";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = await readFile(join(process.cwd(), "app/fonts/DMSans-Bold.ttf"));
const logo = await readFile(join(process.cwd(), "public/brand/logo-white-h.svg"), "base64");

export default async function Image() {
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
        {/* eslint-disable-next-line jsx-a11y/alt-text -- rendered to PNG, not HTML */}
        <img src={`data:image/svg+xml;base64,${logo}`} width={320} height={60} />
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 64, lineHeight: 1.1, maxWidth: 960 }}>Daily alerts on the latest data breaches</div>
          <div style={{ fontSize: 32, color: "#05b5de" }}>Check if you&apos;re exposed at am-i-exposed.com</div>
        </div>
        <div style={{ display: "flex", height: 12, background: "#305f94", borderRadius: 6 }} />
      </div>
    ),
    { ...size, fonts: [{ name: "DM Sans", data: font, weight: 700, style: "normal" }] },
  );
}
