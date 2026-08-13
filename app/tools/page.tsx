import type { Metadata } from "next";
import Link from "next/link";
import { getSeoEngineClient } from "@/lib/seo-engine";

export const metadata: Metadata = {
  title: "Tools",
  description: "Interactive SEO and AI tools.",
  alternates: { canonical: "/tools" },
};

const LIMIT = 12;

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(0, parseInt(pageParam || "0", 10));

  const client = getSeoEngineClient();
  const { tools, total } = await client.getTools(page, LIMIT);
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Tools</h1>
      <p className="text-gray-500 mb-10">
        {total} tool{total !== 1 ? "s" : ""}
      </p>

      {tools.length === 0 ? (
        <p className="text-gray-400">No tools published yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group flex flex-col border border-gray-200 rounded-xl p-6 hover:border-gray-400 transition-colors"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                Interactive tool
              </span>
              <h2 className="text-base font-semibold leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {tool.headline}
              </h2>
              <p className="text-sm text-gray-500 flex-1 line-clamp-3 mb-4">
                {tool.metaDescription}
              </p>
              <div className="text-xs text-gray-400 mt-auto">{formatDate(tool.updatedAt)}</div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-3">
          {page > 0 && (
            <Link
              href={`/tools?page=${page - 1}`}
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
              href={`/tools?page=${page + 1}`}
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

