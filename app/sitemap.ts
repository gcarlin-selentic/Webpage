import type { MetadataRoute } from "next";
import { getFeed } from "@/lib/feed";
import { HOME } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

const languages = { en: `${SITE_URL}${HOME.en}`, es: `${SITE_URL}${HOME.es}` };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // The page content changes with the feed, so its timestamp is the page's last change.
  const result = await getFeed();
  const lastModified = result.ok ? result.feed.updated : undefined;
  return [
    { url: languages.en, lastModified, changeFrequency: "daily", priority: 1, alternates: { languages } },
    { url: languages.es, lastModified, changeFrequency: "daily", priority: 1, alternates: { languages } },
  ];
}
