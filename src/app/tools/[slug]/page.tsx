import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tools } from "@/data/tools";
import { JsonFormatterPage } from "@/features/json-formatter/json-formatter-page";

const implementedTools = tools.filter(
  (tool) => tool.implementationStatus === "operational",
);

export function generateStaticParams() {
  return implementedTools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = implementedTools.find((item) => item.slug === slug);
  if (!tool) return {};
  return {
    title: tool.seo.title,
    description:
      "Format, beautify, minify, validate and explore JSON securely in your browser with ToolNest.",
    alternates: { canonical: `/tools/${tool.slug}` },
  };
}

export default async function ToolRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug !== "json-formatter") notFound();
  return <JsonFormatterPage />;
}
