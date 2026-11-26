export const articleCategories = {
  developer: { name: "Developer Guides", color: "#4F46E5" },
  writing: { name: "Text & Writing", color: "#9333EA" },
  seo: { name: "SEO Tips", color: "#059669" },
  productivity: { name: "Productivity", color: "#0284C7" },
  tutorials: { name: "Tutorials", color: "#EA580C" },
} as const;

export type ArticleCategoryId = keyof typeof articleCategories;
export type ArticleCover =
  | "json"
  | "minify"
  | "errors"
  | "count"
  | "seo"
  | "canonical"
  | "tools"
  | "writing"
  | "slug"
  | "workflow";

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategoryId;
  cover: ArticleCover;
  author: string;
  publishedAt: string;
  readingMinutes: number;
  featured: boolean;
  relatedToolIds: string[];
  status: "draft" | "published";
}

export const articles: Article[] = [
  {
    id: "article-json-formatting",
    slug: "format-and-validate-json-like-a-pro",
    title: "How to Format and Validate JSON Like a Pro",
    excerpt:
      "Learn how to format, validate and debug JSON data, avoid common syntax errors and simplify your development workflow with free online tools.",
    category: "developer",
    cover: "json",
    author: "ToolNest Editorial",
    publishedAt: "2026-10-28",
    readingMinutes: 7,
    featured: true,
    relatedToolIds: ["json-formatter"],
    status: "draft",
  },
  {
    id: "article-json-minification",
    slug: "json-formatting-vs-minification",
    title: "JSON Formatting vs. Minification: What’s the Difference?",
    excerpt:
      "Both change only whitespace, but they serve different goals. See when readable JSON beats compact JSON, and the reverse.",
    category: "developer",
    cover: "minify",
    author: "ToolNest Editorial",
    publishedAt: "2026-10-14",
    readingMinutes: 5,
    featured: false,
    relatedToolIds: ["json-formatter"],
    status: "draft",
  },
  {
    id: "article-json-errors",
    slug: "common-json-syntax-errors",
    title: "10 Common JSON Syntax Errors and How to Fix Them",
    excerpt:
      "Trailing commas, single quotes and unquoted keys trip up almost everyone. Learn to spot each error and fix it quickly.",
    category: "tutorials",
    cover: "errors",
    author: "ToolNest Editorial",
    publishedAt: "2026-10-07",
    readingMinutes: 6,
    featured: false,
    relatedToolIds: ["json-formatter"],
    status: "draft",
  },
  {
    id: "article-word-count",
    slug: "count-words-and-characters-accurately",
    title: "How to Count Words and Characters Accurately",
    excerpt:
      "Why different tools report different totals, and how to count correctly for essays, social posts and meta descriptions.",
    category: "writing",
    cover: "count",
    author: "ToolNest Editorial",
    publishedAt: "2026-09-30",
    readingMinutes: 4,
    featured: false,
    relatedToolIds: ["word-counter"],
    status: "draft",
  },
  {
    id: "article-seo-metadata",
    slug: "better-seo-titles-and-meta-descriptions",
    title: "How to Write Better SEO Titles and Meta Descriptions",
    excerpt:
      "Practical ways to write clear, accurate titles and descriptions that help people decide to click.",
    category: "seo",
    cover: "seo",
    author: "ToolNest Editorial",
    publishedAt: "2026-09-22",
    readingMinutes: 6,
    featured: false,
    relatedToolIds: ["meta-tag-generator"],
    status: "draft",
  },
  {
    id: "article-canonical",
    slug: "understanding-canonical-urls",
    title: "Understanding Canonical URLs: A Beginner’s Guide",
    excerpt:
      "What a canonical URL is, when duplicate addresses cause trouble and how to point search engines to the right one.",
    category: "seo",
    cover: "canonical",
    author: "ToolNest Editorial",
    publishedAt: "2026-09-15",
    readingMinutes: 5,
    featured: false,
    relatedToolIds: ["meta-tag-generator"],
    status: "draft",
  },
  {
    id: "article-developer-tools",
    slug: "essential-free-tools-for-web-developers",
    title: "Essential Free Online Tools for Web Developers",
    excerpt:
      "A short, practical list of browser-based utilities for formatting, encoding and cleaning up code.",
    category: "developer",
    cover: "tools",
    author: "ToolNest Editorial",
    publishedAt: "2026-09-08",
    readingMinutes: 6,
    featured: false,
    relatedToolIds: ["json-formatter"],
    status: "draft",
  },
  {
    id: "article-writing-analysis",
    slug: "improve-writing-with-text-analysis-tools",
    title: "How to Improve Your Writing with Text Analysis Tools",
    excerpt:
      "Use word counts, reading time and keyword frequency to tighten drafts without losing your voice.",
    category: "writing",
    cover: "writing",
    author: "ToolNest Editorial",
    publishedAt: "2026-09-01",
    readingMinutes: 5,
    featured: false,
    relatedToolIds: ["word-counter"],
    status: "draft",
  },
  {
    id: "article-url-slugs",
    slug: "create-seo-friendly-url-slugs",
    title: "How to Create SEO-Friendly URL Slugs",
    excerpt:
      "Turn page titles into short, readable URLs, with simple rules for hyphens, case and special characters.",
    category: "tutorials",
    cover: "slug",
    author: "ToolNest Editorial",
    publishedAt: "2026-08-25",
    readingMinutes: 4,
    featured: false,
    relatedToolIds: ["meta-tag-generator"],
    status: "draft",
  },
  {
    id: "article-productivity",
    slug: "simplify-daily-workflow-with-online-tools",
    title: "Simplify Your Daily Workflow with Online Tools",
    excerpt:
      "Small utilities can remove repetitive steps from your day. Here is how to build a lightweight toolkit.",
    category: "productivity",
    cover: "workflow",
    author: "ToolNest Editorial",
    publishedAt: "2026-08-18",
    readingMinutes: 5,
    featured: false,
    relatedToolIds: ["word-counter"],
    status: "draft",
  },
];
