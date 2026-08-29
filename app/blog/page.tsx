/**
 * /blog - article listing page.
 * Drop this into your Next.js app at app/blog/page.tsx.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { getSeoEngineClient } from "@/lib/seo-engine";
import { articlePath, blogPath } from "@/lib/paths";

const BASE_METADATA: Metadata = {
  title: "Blog",
  description: "Articles and insights from our team.",
  alternates: { canonical: blogPath() },
};

const LIMIT = 12;

interface BlogPageProps {
  searchParams: Promise<{ page?: string; tag?: string }>;
}

function pageNumber(value?: string) {
  return Math.max(0, parseInt(value || "0", 10));
}

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const { page: pageParam, tag } = await searchParams;
  const page = pageNumber(pageParam);
  const tagSlug = tag?.trim() || "";

  try {
    const { total } = tagSlug
      ? await getSeoEngineClient().getTagArticles(tagSlug, page, LIMIT)
      : await getSeoEngineClient().getArticles(page, LIMIT);
    return {
      ...BASE_METADATA,
      ...(total === 0 ? { robots: { index: false, follow: true } } : {}),
    };
  } catch {
    return BASE_METADATA;
  }
}

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page: pageParam, tag } = await searchParams;
  const page = pageNumber(pageParam);
  const tagSlug = tag?.trim() || "";

  const client = getSeoEngineClient();
  const { articles, total } = tagSlug
    ? await client.getTagArticles(tagSlug, page, LIMIT)
    : await client.getArticles(page, LIMIT);
  const totalPages = Math.ceil(total / LIMIT);
  const pageHref = (targetPage: number) =>
    tagSlug
      ? `${blogPath()}?tag=${encodeURIComponent(tagSlug)}&page=${targetPage}`
      : `${blogPath()}?page=${targetPage}`;

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        {tagSlug ? `Articles tagged ${tagSlug.replaceAll("-", " ")}` : "Blog"}
      </h1>
      <p className="text-gray-500 mb-10">
        {total} article{total !== 1 ? "s" : ""}
        {tagSlug ? (
          <>
            {" "}
            <Link href={blogPath()} className="text-blue-600 hover:underline">
              Clear filter
            </Link>
          </>
        ) : null}
      </p>

      {articles.length === 0 ? (
        <p className="text-gray-400">No articles published yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={article.url || articlePath(article.slug)}
              className="group flex flex-col border border-gray-200 rounded-xl p-6 hover:border-gray-400 transition-colors"
            >
              {article.category?.title && (
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                  {article.category.title}
                </span>
              )}
              <h2 className="text-base font-semibold leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {article.headline}
              </h2>
              <p className="text-sm text-gray-500 flex-1 line-clamp-3 mb-4">
                {article.metaDescription}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-auto">
                <span>{article.readingTime} min read</span>
                {article.publishedAt && (
                  <span>{formatDate(article.publishedAt)}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-3">
          {page > 0 && (
            <Link
              href={pageHref(page - 1)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              ← Previous
            </Link>
          )}
          <span className="text-sm text-gray-400">
            Page {page + 1} of {totalPages}
          </span>
          {page < totalPages - 1 && (
            <Link
              href={pageHref(page + 1)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Next →
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
