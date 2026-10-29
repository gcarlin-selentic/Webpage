import { DICT } from "@/lib/i18n";
import { ogSize, renderOgImage } from "@/lib/og";

export const alt = DICT.es.meta.ogAlt;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage("es");
}
