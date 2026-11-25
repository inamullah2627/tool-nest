import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, categoryMap } from "@/data/tools";
import { CategoryPage } from "@/features/category/category-page";
import { categoryConfigs } from "@/features/category/category-config";
import type { CategoryId } from "@/types/tool";

export function generateStaticParams() {
  return categories.map(({ id }) => ({ slug: id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!(slug in categoryConfigs)) return {};
  const category = categoryMap[slug as CategoryId];
  const comingSoon = !category.active;
  return {
    title: `${category.name} — Free Online Utilities`,
    description: categoryConfigs[slug as CategoryId].lead,
    robots: comingSoon ? { index: false, follow: true } : undefined,
    alternates: { canonical: `/tools/category/${slug}` },
  };
}

export default async function ToolCategoryRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!(slug in categoryConfigs)) notFound();
  return <CategoryPage slug={slug as CategoryId} />;
}
