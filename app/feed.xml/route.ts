import { getSeoEngineClient } from "@/lib/seo-engine";
import type { IArticleListItem } from "@/types/blog";
import { absoluteArticleUrl, absoluteUrl, blogPath } from "@/lib/paths";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://fieldflow.demo.sageobot.com";
const BASE_URL_CLEAN = BASE_URL.replace(/\/$/, "");
const SITE_NAME = process.env.SEOENGINE_SITE || "fieldflow";
const WEB_SUB_HUB = "https://pubsubhubbub.appspot.com/";
const MAX_ITEMS = 20;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(): Promise<Response> {
  let articles: IArticleListItem[] = [];

  try {
    const response = await getSeoEngineClient().getArticles(0, MAX_ITEMS);
    articles = response.articles || [];
  } catch (error) {
    console.error("Failed to build feed from seo-engine:", error);
  }

  const updatedAt = articles[0]?.updatedAt || articles[0]?.publishedAt || new Date().toISOString();
  const entries = articles
    .map((article) => {
      const articleUrl = article.url
        ? absoluteUrl(BASE_URL_CLEAN, article.url)
        : absoluteArticleUrl(BASE_URL_CLEAN, article.slug);
      const publishedAt = article.publishedAt || updatedAt;
      const articleUpdatedAt = article.updatedAt || publishedAt;

      return `
  <entry>
    <title>${escapeXml(article.headline)}</title>
    <link href="${escapeXml(articleUrl)}" />
    <id>${escapeXml(articleUrl)}</id>
    <updated>${escapeXml(articleUpdatedAt)}</updated>
    <published>${escapeXml(publishedAt)}</published>
    <summary>${escapeXml(article.metaDescription || "")}</summary>
  </entry>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(`${SITE_NAME} blog`)}</title>
  <id>${escapeXml(`${BASE_URL_CLEAN}/feed.xml`)}</id>
  <updated>${escapeXml(updatedAt)}</updated>
  <link rel="self" href="${escapeXml(`${BASE_URL_CLEAN}/feed.xml`)}" />
  <link rel="hub" href="${escapeXml(WEB_SUB_HUB)}" />
  <link rel="alternate" href="${escapeXml(`${BASE_URL_CLEAN}${blogPath()}`)}" />
${entries}
</feed>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
