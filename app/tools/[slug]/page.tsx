import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeoEngineClient } from "@/lib/seo-engine";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const tool = await getSeoEngineClient().getTool(slug);
    return {
      title: tool.headline,
      description: tool.metaDescription,
      alternates: { canonical: `/tools/${tool.slug}` },
    };
  } catch {
    return { title: "Tool not found" };
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

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  let tool;
  try {
    tool = await getSeoEngineClient().getTool(slug);
  } catch {
    notFound();
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/tools" className="hover:text-gray-600 transition-colors">
          Tools
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-600">{tool.headline}</span>
      </nav>
      <h1 className="text-3xl font-bold tracking-tight mb-2">{tool.headline}</h1>
      <p className="text-gray-500 mb-8">{tool.metaDescription}</p>
      <div className="text-xs text-gray-400 mb-8">Updated {formatDate(tool.updatedAt)}</div>
      <section
        className="rounded-lg border border-gray-200 overflow-hidden"
        dangerouslySetInnerHTML={{ __html: tool.html }}
      />
    </main>
  );
}

