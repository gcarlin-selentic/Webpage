import type { MetadataRoute } from "next";
import { HOME } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

const languages = { en: `${SITE_URL}${HOME.en}`, es: `${SITE_URL}${HOME.es}` };

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: languages.en, changeFrequency: "daily", priority: 1, alternates: { languages } },
    { url: languages.es, changeFrequency: "daily", priority: 1, alternates: { languages } },
  ];
}
