/**
 * /blog/category/[slug] - articles filtered by category.
 * Drop this into app/blog/category/[slug]/page.tsx.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeoEngineClient } from "@/lib/seo-engine";
import { articlePath, blogPath, categoryPath } from "@/lib/paths";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

const LIMIT = 12;

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const label = slug.replace(/-/g, " ");
  return {
    title: label,
    description: `All articles in the ${label} category.`,
    alternates: { canonical: categoryPath(slug) },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(0, parseInt(pageParam || "0", 10));

  const client = getSeoEngineClient();
  const { articles, total } = await client.getCategoryArticles(slug, page, LIMIT);

  if (total === 0 && page === 0) notFound();

  const totalPages = Math.ceil(total / LIMIT);
  const label = slug.replace(/-/g, " ");

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-400 mb-8">
        <Link href={blogPath()} className="hover:text-gray-600 transition-colors">
          Blog
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-600 capitalize">{label}</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight capitalize mb-2">{label}</h1>
      <p className="text-gray-500 mb-10">
        {total} article{total !== 1 ? "s" : ""}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={article.url || articlePath(article.slug)}
            className="group flex flex-col border border-gray-200 rounded-xl p-6 hover:border-gray-400 transition-colors"
          >
            <h2 className="text-base font-semibold leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {article.headline}
            </h2>
            <p className="text-sm text-gray-500 flex-1 line-clamp-3 mb-4">
              {article.metaDescription}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-400 mt-auto">
              <span>{article.readingTime} min read</span>
              {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-3">
          {page > 0 && (
            <Link
              href={`${categoryPath(slug)}?page=${page - 1}`}
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
              href={`${categoryPath(slug)}?page=${page + 1}`}
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
