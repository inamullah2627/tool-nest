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

export type ArticleInline =
  | string
  | { type: "strong"; text: string }
  | { type: "code"; text: string }
  | { type: "tool-link"; text: string; toolId: string };

export type ArticleBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; content: ArticleInline[] }
  | { type: "list"; ordered?: boolean; items: ArticleInline[][] }
  | { type: "quote"; text: string }
  | { type: "code"; language: string; label: string; code: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "callout"; tone: "info" | "warning"; content: ArticleInline[] }
  | { type: "figure"; cover: ArticleCover; caption: string }
  | { type: "tool-cta"; toolId: string }
  | { type: "divider" };

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
  updatedAt?: string;
  tags?: string[];
  relatedArticleIds?: string[];
  content?: ArticleBlock[];
}

const compactJson =
  '{"name":"ToolNest","type":"tools","free":true,"tags":["json","dev"],"links":{"home":"/","blog":"/blog"}}';
const formattedJson = `{
  "name": "ToolNest",
  "type": "tools",
  "free": true,
  "tags": [
    "json",
    "dev"
  ],
  "links": {
    "home": "/",
    "blog": "/blog"
  }
}`;

const jsonArticleContent: ArticleBlock[] = [
  { type: "heading", level: 2, text: "Introduction" },
  {
    type: "paragraph",
    content: [
      "JSON is the format behind most web APIs, configuration files and data exports. When it is readable and valid, it is easy to review and debug. When it is a single unbroken line—or missing one comma—it can cost you an afternoon. This guide explains how to format and validate JSON, what usually goes wrong, and which habits keep structured data clean.",
    ],
  },
  { type: "heading", level: 2, text: "What Is JSON?" },
  {
    type: "paragraph",
    content: [
      "JSON (JavaScript Object Notation) is a lightweight text format for structured data. It supports objects, arrays, strings, numbers, booleans and ",
      { type: "code", text: "null" },
      ". Although its syntax was inspired by JavaScript, JSON is language-independent and is commonly used in REST APIs, ",
      { type: "code", text: "package.json" },
      " files, application settings and data exports.",
    ],
  },
  { type: "heading", level: 2, text: "Why JSON Formatting Matters" },
  {
    type: "paragraph",
    content: [
      "Formatting adds indentation and line breaks. It changes whitespace only, so the represented data stays the same. The practical benefits include:",
    ],
  },
  {
    type: "list",
    items: [
      [
        { type: "strong", text: "Readability: " },
        "nested objects and arrays become easier to follow.",
      ],
      [
        { type: "strong", text: "Debugging: " },
        "a misplaced bracket or value stands out on its own line.",
      ],
      [
        { type: "strong", text: "Collaboration: " },
        "consistent formatting produces cleaner code-review diffs.",
      ],
    ],
  },
  {
    type: "quote",
    text: "Formatting makes JSON easier to read, and validating it makes it safer to use.",
  },
  { type: "heading", level: 2, text: "How to Format JSON Online" },
  {
    type: "paragraph",
    content: [
      "The ToolNest ",
      { type: "tool-link", text: "JSON Formatter", toolId: "json-formatter" },
      " runs entirely in your browser. No JSON is uploaded to ToolNest.",
    ],
  },
  {
    type: "list",
    ordered: true,
    items: [
      [
        "Open the ",
        { type: "tool-link", text: "JSON Formatter", toolId: "json-formatter" },
        ".",
      ],
      ["Paste JSON into the input editor or upload a supported file."],
      ["Choose two spaces, four spaces or tabs for indentation."],
      ["Select Format JSON. Invalid input produces a clear parsing error."],
      ["Review the output, then copy or download it."],
    ],
  },
  { type: "tool-cta", toolId: "json-formatter" },
  { type: "heading", level: 2, text: "JSON Before and After Formatting" },
  {
    type: "paragraph",
    content: [
      "The following examples contain identical information. Only their whitespace differs.",
    ],
  },
  {
    type: "code",
    language: "json",
    label: "JSON · compact",
    code: compactJson,
  },
  {
    type: "code",
    language: "json",
    label: "JSON · formatted",
    code: formattedJson,
  },
  { type: "heading", level: 2, text: "Common JSON Syntax Errors" },
  {
    type: "paragraph",
    content: [
      "JSON is stricter than JavaScript object syntax. These mistakes account for many parsing failures.",
    ],
  },
  {
    type: "figure",
    cover: "errors",
    caption: "Illustration: a syntax error highlighted in a code editor.",
  },
  { type: "heading", level: 3, text: "Missing commas" },
  {
    type: "paragraph",
    content: [
      "Every property or array item except the last requires a comma after it.",
    ],
  },
  {
    type: "code",
    language: "json",
    label: "JSON · invalid",
    code: '{\n  "name": "ToolNest"\n  "free": true\n}',
  },
  { type: "heading", level: 3, text: "Trailing commas" },
  {
    type: "paragraph",
    content: [
      "A comma after the final item is not allowed in JSON, even though some programming languages accept it.",
    ],
  },
  {
    type: "code",
    language: "json",
    label: "JSON · invalid",
    code: '{\n  "tags": ["json", "dev",]\n}',
  },
  { type: "heading", level: 3, text: "Unquoted property names" },
  {
    type: "paragraph",
    content: [
      "Property names must be strings enclosed in straight double quotation marks.",
    ],
  },
  {
    type: "code",
    language: "json",
    label: "JSON · invalid",
    code: '{\n  name: "ToolNest"\n}',
  },
  { type: "heading", level: 3, text: "Missing brackets" },
  {
    type: "paragraph",
    content: [
      "Every opening brace or square bracket needs a matching closing character in the correct location.",
    ],
  },
  {
    type: "code",
    language: "json",
    label: "JSON · invalid",
    code: '{\n  "items": [1, 2, 3\n}',
  },
  { type: "heading", level: 3, text: "Incorrect quotation marks" },
  {
    type: "paragraph",
    content: [
      "JSON accepts straight double quotes. Single quotes and typographic curly quotes both fail validation.",
    ],
  },
  {
    type: "code",
    language: "json",
    label: "JSON · invalid",
    code: "{\n  'name': \"ToolNest\"\n}",
  },
  { type: "heading", level: 2, text: "JSON Formatting vs. Minification" },
  {
    type: "paragraph",
    content: [
      "Formatting and minification produce JSON representing the same data. Their whitespace and intended use differ.",
    ],
  },
  {
    type: "table",
    headers: ["Aspect", "Formatting", "Minification"],
    rows: [
      [
        "Readability",
        "High, with indentation and line breaks",
        "Low, usually one line",
      ],
      ["Whitespace", "Added for visible structure", "Removed where possible"],
      ["File size", "Slightly larger", "Smaller"],
      [
        "Common use",
        "Debugging, reviews and documentation",
        "Network transfer and storage",
      ],
    ],
  },
  { type: "heading", level: 2, text: "Best Practices for Working with JSON" },
  {
    type: "list",
    items: [
      [
        { type: "strong", text: "Validate early. " },
        "Check JSON before it reaches production code or an API request.",
      ],
      [
        { type: "strong", text: "Format consistently. " },
        "Agree on one indentation style across the team.",
      ],
      [
        { type: "strong", text: "Keep keys predictable. " },
        "Use a consistent naming style such as camelCase.",
      ],
      [
        { type: "strong", text: "Minify only for delivery. " },
        "Keep readable versions in source control.",
      ],
    ],
  },
  {
    type: "callout",
    tone: "warning",
    content: [
      { type: "strong", text: "Handle sensitive data carefully. " },
      "Avoid placing passwords, API keys or personal information in any online utility. Remove secrets from examples before sharing them.",
    ],
  },
  { type: "divider" },
  { type: "heading", level: 2, text: "Conclusion" },
  {
    type: "paragraph",
    content: [
      "Readable, valid JSON saves time throughout development. Format it to understand it, validate it to trust it, and minify it only when size matters. When you are ready, open the ",
      { type: "tool-link", text: "JSON Formatter", toolId: "json-formatter" },
      " and try it with your own data.",
    ],
  },
];

export const articles: Article[] = [
  {
    id: "article-json-formatting",
    slug: "how-to-format-and-validate-json",
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
    updatedAt: "2026-11-12",
    tags: ["JSON", "Web Development", "Developer Tools", "API", "Tutorials"],
    relatedArticleIds: [
      "article-json-minification",
      "article-json-errors",
      "article-developer-tools",
    ],
    content: jsonArticleContent,
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
