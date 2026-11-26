import type { Metadata } from "next";
import { articles } from "@/data/articles";
import { BlogPage } from "@/features/blog/blog-page";

const hasPublishedArticles = articles.some(
  (article) => article.status === "published" && article.content?.length,
);

export const metadata: Metadata = {
  title: "Blog Preview",
  description:
    "Preview upcoming ToolNest guides about browser-based tools, writing, development and SEO.",
  alternates: { canonical: "/blog" },
  robots: hasPublishedArticles
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function BlogRoute() {
  return <BlogPage />;
}
