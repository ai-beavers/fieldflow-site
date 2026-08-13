/**
 * seo-engine Article API client.
 *
 * Set these env vars (server-side only, never prefix with NEXT_PUBLIC_):
 *   SEOENGINE_API_URL   e.g. https://seo.yourengine.com
 *   SEOENGINE_API_KEY   your site's public_api_key
 *   SEOENGINE_SITE      your site name, e.g. "fieldflow"
 *
 * When these are unset (the shell deploy before the blog is wired), every
 * list call returns an empty result and every detail call throws, which the
 * pages translate into a 404. Nothing 500s without env.
 */

import type {
  IArticle,
  IArticlesResponse,
  ISitemapEntry,
  ITool,
  IToolsResponse,
} from "@/types/blog";

export function isSeoEngineConfigured(): boolean {
  return Boolean(
    process.env.SEOENGINE_API_URL &&
      process.env.SEOENGINE_API_KEY &&
      process.env.SEOENGINE_SITE
  );
}

function getConfig() {
  const apiUrl = process.env.SEOENGINE_API_URL;
  const apiKey = process.env.SEOENGINE_API_KEY;
  const site = process.env.SEOENGINE_SITE;

  if (!apiUrl) throw new Error("SEOENGINE_API_URL is not set");
  if (!apiKey) throw new Error("SEOENGINE_API_KEY is not set");
  if (!site) throw new Error("SEOENGINE_SITE is not set");

  return { apiUrl: apiUrl.replace(/\/$/, ""), apiKey, site };
}

async function apiFetch<T>(path: string): Promise<T> {
  const { apiUrl, apiKey } = getConfig();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
  };

  const res = await fetch(`${apiUrl}${path}`, {
    headers,
    // Cache for 5 minutes.
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`seo-engine API error ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

export class SeoEngineClient {
  private site: string;

  constructor(site: string) {
    this.site = site;
  }

  /** Paginated article list (no body). page is zero-based. */
  async getArticles(page = 0, limit = 12): Promise<IArticlesResponse> {
    if (!isSeoEngineConfigured()) return { articles: [], total: 0 };
    return apiFetch<IArticlesResponse>(
      `/api/v1/${this.site}/articles?page=${page}&limit=${limit}`
    );
  }

  /** Single article with full HTML, markdown, and JSON-LD. */
  async getArticle(slug: string): Promise<IArticle> {
    if (!isSeoEngineConfigured()) {
      throw new Error("seo-engine is not configured");
    }
    return apiFetch<IArticle>(`/api/v1/${this.site}/articles/${slug}`);
  }

  /** Articles by category slug. */
  async getCategoryArticles(
    categorySlug: string,
    page = 0,
    limit = 12
  ): Promise<IArticlesResponse> {
    if (!isSeoEngineConfigured()) return { articles: [], total: 0 };
    return apiFetch<IArticlesResponse>(
      `/api/v1/${this.site}/categories/${categorySlug}/articles?page=${page}&limit=${limit}`
    );
  }

  /** Articles by tag slug. */
  async getTagArticles(
    tagSlug: string,
    page = 0,
    limit = 12
  ): Promise<IArticlesResponse> {
    if (!isSeoEngineConfigured()) return { articles: [], total: 0 };
    return apiFetch<IArticlesResponse>(
      `/api/v1/${this.site}/tags/${tagSlug}/articles?page=${page}&limit=${limit}`
    );
  }

  /** Minimal slug + date list for sitemap generation. */
  async getSitemapEntries(): Promise<ISitemapEntry[]> {
    if (!isSeoEngineConfigured()) return [];
    return apiFetch<ISitemapEntry[]>(`/api/v1/${this.site}/sitemap`);
  }

  /** Paginated generated tools list. */
  async getTools(page = 0, limit = 12): Promise<IToolsResponse> {
    if (!isSeoEngineConfigured()) return { tools: [], total: 0 };
    return apiFetch<IToolsResponse>(
      `/api/v1/${this.site}/tools?page=${page}&limit=${limit}`
    );
  }

  /** Single generated tool page HTML. */
  async getTool(slug: string): Promise<ITool> {
    if (!isSeoEngineConfigured()) {
      throw new Error("seo-engine is not configured");
    }
    return apiFetch<ITool>(`/api/v1/${this.site}/tools/${slug}`);
  }
}

/** Singleton, initialised from env vars. Safe to construct without env. */
export function getSeoEngineClient(): SeoEngineClient {
  return new SeoEngineClient(process.env.SEOENGINE_SITE || "");
}
