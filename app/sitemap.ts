import type { MetadataRoute } from "next";
import { getSeoEngineClient } from "@/lib/seo-engine";
import { absoluteArticleUrl, absoluteUrl, blogPath } from "@/lib/paths";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://fieldflow.demo.sageobot.com";
const BASE_URL_CLEAN = BASE_URL.replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL_CLEAN, priority: 1.0 },
  ];

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const entries = await getSeoEngineClient().getSitemapEntries();
    if (entries.length > 0) {
      staticRoutes.push({
        url: `${BASE_URL_CLEAN}${blogPath()}`,
        priority: 0.9,
      });
    }
    blogRoutes = entries.map((entry) => ({
      url: entry.url
        ? absoluteUrl(BASE_URL_CLEAN, entry.url)
        : absoluteArticleUrl(BASE_URL_CLEAN, entry.slug),
      ...(entry.updatedAt ? { lastModified: new Date(entry.updatedAt) } : {}),
      priority: 0.7,
    }));
  } catch (err) {
    console.error("Failed to fetch blog sitemap from seo-engine:", err);
  }

  return [...staticRoutes, ...blogRoutes];
}
