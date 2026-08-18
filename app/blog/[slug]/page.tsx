/**
 * /blog/[slug] - article detail page.
 * Drop this into your Next.js app at app/blog/[slug]/page.tsx.
 *
 * Requires: @tailwindcss/typography (for the prose styles)
 *   npm install @tailwindcss/typography
 *   Then add `require('@tailwindcss/typography')` to your Tailwind plugins.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { getSeoEngineClient } from "@/lib/seo-engine";
import {
  absoluteUrl,
  articlePath,
  blogPath,
  categoryPath,
  tagPath,
} from "@/lib/paths";

interface Props {
  params: Promise<{ slug: string }>;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://fieldflow.demo.sageobot.com";
const BASE_URL_CLEAN = BASE_URL.replace(/\/$/, "");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await getSeoEngineClient().getArticle(slug);
    const altLanguages = article.hreflang
      ? Object.fromEntries(
          Object.entries(article.hreflang).filter(([k, v]) => Boolean(k && v))
        )
      : undefined;
    return {
      title: article.headline,
      description: article.metaDescription,
      keywords: article.metaKeywords,
      alternates: {
        canonical: articlePath(article.slug),
        ...(altLanguages ? { languages: altLanguages } : {}),
      },
      openGraph: {
        type: "article",
        title: article.headline,
        description: article.metaDescription,
        publishedTime: article.publishedAt,
        modifiedTime: article.updatedAt,
        tags: article.tags.map((t) => t.title),
        ...(article.image ? { images: [article.image] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title: article.headline,
        description: article.metaDescription,
      },
    };
  } catch {
    return { title: "Article not found" };
  }
}

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function extractH2Headings(markdown: string): Array<{ title: string; id: string }> {
  if (!markdown) return [];
  const lines = markdown.split("\n");
  const headings: Array<{ title: string; id: string }> = [];
  for (const line of lines) {
    if (line.startsWith("## ")) {
      const title = line.replace(/^##\s+/, "").trim();
      if (title && title.toLowerCase() !== "table of contents") {
        headings.push({ title, id: slugifyHeading(title) });
      }
    }
  }
  return headings.slice(0, 12);
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let article;
  try {
    article = await getSeoEngineClient().getArticle(slug);
  } catch {
    notFound();
  }
  const toc = extractH2Headings(article.markdown || "");
  const authorName = article.author || "Editorial team";
  const hasModifiedDate = Boolean(article.updatedAt && article.updatedAt !== article.publishedAt);
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Blog",
      item: absoluteUrl(BASE_URL_CLEAN, blogPath()),
    },
  ];

  if (article.category?.slug && article.category.title) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: breadcrumbItems.length + 1,
      name: article.category.title,
      item: absoluteUrl(BASE_URL_CLEAN, categoryPath(article.category.slug)),
    });
  }

  breadcrumbItems.push({
    "@type": "ListItem",
    position: breadcrumbItems.length + 1,
    name: article.headline,
    item: absoluteUrl(BASE_URL_CLEAN, articlePath(article.slug)),
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      {/* JSON-LD structured data */}
      {article.jsonldBlogposting && (
        <Script
          id="jsonld-blogposting"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: article.jsonldBlogposting }}
        />
      )}
      {article.jsonldFaqpage && (
        <Script
          id="jsonld-faqpage"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: article.jsonldFaqpage }}
        />
      )}
      {article.jsonldTypeSpecific && (
        <Script
          id="jsonld-type-specific"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: article.jsonldTypeSpecific }}
        />
      )}
      {article.jsonldVideoobject && (
        <Script
          id="jsonld-videoobject"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: article.jsonldVideoobject }}
        />
      )}
      <script
        id="jsonld-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8">
        <Link href={blogPath()} className="hover:text-gray-600 transition-colors">
          Blog
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-600">
          {article.category?.title || "Article"}
        </span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        {article.category?.title && (
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {article.category.title}
          </span>
        )}
        <h1 className="text-3xl font-bold tracking-tight mt-2 mb-4 leading-tight">
          {article.headline}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          {article.publishedAt && (
            <time dateTime={article.publishedAt}>
              Published {formatDate(article.publishedAt)}
            </time>
          )}
          {hasModifiedDate ? (
            <time dateTime={article.updatedAt}>
              Updated {formatDate(article.updatedAt)}
            </time>
          ) : null}
          <span>{article.readingTime} min read</span>
          {article.aeoScore ? <span>AEO score: {Math.round(article.aeoScore)}</span> : null}
        </div>

        {article.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={tagPath(tag.slug)}
                className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200 transition-colors"
              >
                {tag.title}
              </Link>
            ))}
          </div>
        )}
      </header>

      {article.image ? (
        <figure className="mb-8">
          <Image
            src={article.image}
            alt={article.headline}
            width={1600}
            height={900}
            className="w-full h-auto rounded-lg border border-gray-200"
            unoptimized
          />
        </figure>
      ) : null}

      {toc.length > 0 && (
        <section className="mb-8 rounded-lg border border-gray-200 p-4 bg-gray-50">
          <h2 className="text-base font-semibold mb-2">Table of contents</h2>
          <ul className="space-y-1 text-sm">
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-blue-700 hover:underline">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Article body - pre-rendered HTML from seo-engine */}
      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: article.html }}
      />

      <section className="mt-10 rounded-lg border border-gray-200 bg-gray-50 p-5 text-sm text-gray-700">
        <h2 className="mb-3 text-base font-semibold text-gray-900">Editorial trust</h2>
        <div className="space-y-2">
          <p>
            Written by <strong>{authorName}</strong>
            {article.reviewedBy ? (
              <>
                {" "}
                and reviewed by <strong>{article.reviewedBy}</strong>
              </>
            ) : null}
          </p>
          {hasModifiedDate ? (
            <p>
              Last updated <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
            </p>
          ) : null}
          {article.articleType ? <p>Article format: {formatLabel(article.articleType)}</p> : null}
          {article.expertiseLevel ? <p>Expertise level: {formatLabel(article.expertiseLevel)}</p> : null}
          {article.methodology ? <p>Methodology: {article.methodology}</p> : null}
        </div>
      </section>

      {article.sourcesUsed && article.sourcesUsed.length > 0 ? (
        <section className="mt-6 rounded-lg border border-gray-200 p-5 text-sm text-gray-700">
          <h2 className="mb-3 text-base font-semibold text-gray-900">Sources used</h2>
          {article.provenance ? (
            <p className="mb-3 text-gray-500">
              {article.provenance.sourceCount} cited source
              {article.provenance.sourceCount !== 1 ? "s" : ""} across{" "}
              {article.provenance.sourceDomains.length} domain
              {article.provenance.sourceDomains.length !== 1 ? "s" : ""}
              {article.provenance.numericClaimCount
                ? `, supporting ${article.provenance.numericClaimCount} numeric claim${
                    article.provenance.numericClaimCount !== 1 ? "s" : ""
                  }`
                : ""}
              .
            </p>
          ) : null}
          <ul className="space-y-2">
            {article.sourcesUsed.slice(0, 8).map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  {source.title || source.domain}
                </a>
                <span className="text-gray-400"> - {source.domain}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Related posts */}
      {article.relatedPosts?.length > 0 && (
        <aside className="mt-16 border-t border-gray-100 pt-10">
          <h2 className="text-lg font-semibold mb-4">Related articles</h2>
          <ul className="space-y-2">
            {article.relatedPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={post.url || articlePath(post.slug)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {post.headline}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  );
}
