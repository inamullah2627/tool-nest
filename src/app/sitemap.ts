import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { categories, tools } from "@/data/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url ?? "https://toolnest.example";
  const paths = [
    "",
    "/tools",
    ...categories
      .filter((category) => category.active)
      .map((category) => `/tools/category/${category.id}`),
    ...tools
      .filter((tool) => tool.implementationStatus === "operational")
      .map((tool) => `/tools/${tool.slug}`),
  ];
  return paths.map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/tools" ? 0.9 : 0.8,
  }));
}
