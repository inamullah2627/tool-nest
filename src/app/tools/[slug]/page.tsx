import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tools } from "@/data/tools";
import { JsonFormatterPage } from "@/features/json-formatter/json-formatter-page";
import { HtmlFormatterPage } from "@/features/html-formatter/html-formatter-page";
import { MetaTagGeneratorPage } from "@/features/meta-tag-generator/meta-tag-generator-page";
import { WordCounterPage } from "@/features/word-counter/word-counter-page";
import { CaseConverterPage } from "@/features/case-converter/case-converter-page";
import { CssMinifierPage } from "@/features/css-minifier/css-minifier-page";
import { DuplicateLinesPage } from "@/features/duplicate-lines/duplicate-lines-page";

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
    description: tool.seo.description,
    alternates: { canonical: `/tools/${tool.slug}` },
  };
}

export default async function ToolRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "json-formatter") return <JsonFormatterPage />;
  if (slug === "html-formatter") return <HtmlFormatterPage />;
  if (slug === "word-counter") return <WordCounterPage />;
  if (slug === "case-converter") return <CaseConverterPage />;
  if (slug === "css-minifier") return <CssMinifierPage />;
  if (slug === "remove-duplicate-lines") return <DuplicateLinesPage />;
  if (slug === "meta-tag-generator") return <MetaTagGeneratorPage />;
  notFound();
}
