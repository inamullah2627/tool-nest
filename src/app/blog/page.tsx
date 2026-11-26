import type { Metadata } from "next";
import { BlogPage } from "@/features/blog/blog-page";

export const metadata: Metadata = {
  title: "Blog Preview",
  description:
    "Preview upcoming ToolNest guides about browser-based tools, writing, development and SEO.",
  alternates: { canonical: "/blog" },
  robots: { index: false, follow: false },
};

export default function BlogRoute() {
  return <BlogPage />;
}
