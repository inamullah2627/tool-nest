import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { articles } from "@/data/articles";
import { categories, tools } from "@/data/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url ?? "https://toolnest.example";
  const publishedArticlePaths = articles
    .filter(
      (article) => article.status === "published" && article.content?.length,
    )
    .map((article) => `/blog/${article.slug}`);
  const paths = [
    "",
    "/tools",
    ...categories
      .filter((category) => category.active)
      .map((category) => `/tools/category/${category.id}`),
    ...tools
      .filter((tool) => tool.implementationStatus === "operational")
      .map((tool) => `/tools/${tool.slug}`),
    ...(publishedArticlePaths.length ? ["/blog"] : []),
    ...publishedArticlePaths,
  ];
  return paths.map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/tools" ? 0.9 : 0.8,
  }));
}
