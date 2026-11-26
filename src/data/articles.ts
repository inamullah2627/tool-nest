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
  featuredImage?: string;
  featuredImageAlt?: string;
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
      "If a JSON file opens as one long line in Visual Studio Code, you do not need to re-indent it by hand. VS Code can beautify the document in seconds with its built-in formatter. This beginner-friendly guide shows you how to format JSON in VS Code, use the JSON formatting shortcut, troubleshoot common issues, and validate the result.",
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
    text: "In VS Code, Format Document turns compact JSON into readable, consistently indented code without changing the data.",
  },
  { type: "heading", level: 2, text: "How to Format JSON in VS Code" },
  {
    type: "paragraph",
    content: [
      "VS Code includes JSON language support, so no extension is required for ordinary JSON files. Follow these steps:",
    ],
  },
  {
    type: "list",
    ordered: true,
    items: [
      ["Open your JSON file in VS Code."],
      [
        "Confirm the language mode in the lower-right corner says JSON. If it does not, select it and choose JSON.",
      ],
      ["Right-click anywhere in the editor and select Format Document."],
      ["Save the file after reviewing the new indentation."],
    ],
  },
  { type: "heading", level: 2, text: "JSON Formatting Shortcut" },
  {
    type: "paragraph",
    content: [
      "The quickest method is the built-in Format Document keyboard shortcut: use ",
      { type: "code", text: "Shift+Alt+F" },
      " on Windows, ",
      { type: "code", text: "Shift+Option+F" },
      " on macOS, or ",
      { type: "code", text: "Ctrl+Shift+I" },
      " on Linux. You can also open the Command Palette and run Format Document.",
    ],
  },
  { type: "heading", level: 2, text: "Format JSON Automatically on Save" },
  {
    type: "paragraph",
    content: [
      "To keep JSON consistently formatted, open Settings, search for ",
      { type: "code", text: "Format On Save" },
      ", and enable Editor: Format On Save. If several formatters are installed, use Format Document With... once and choose a default formatter for JSON files.",
    ],
  },
  { type: "heading", level: 2, text: "How to Format JSON Online" },
  {
    type: "paragraph",
    content: [
      "If VS Code is unavailable, or you want a quick formatting and validation check, the ToolNest ",
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
    type: "callout",
    tone: "info",
    content: [
      { type: "strong", text: "Format command not working? " },
      "Check that the file is recognized as JSON and fix any red syntax errors first. A formatter cannot reliably beautify malformed JSON.",
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
      "VS Code can format JSON with a menu command, a keyboard shortcut, or automatically whenever you save. Whichever method you choose, validate the data before using it in an application. For a fast browser-based alternative, open the ",
      { type: "tool-link", text: "JSON Formatter", toolId: "json-formatter" },
      " and try it with your own data.",
    ],
  },
];

const wordsToPagesArticleContent: ArticleBlock[] = [
  {
    type: "heading",
    level: 2,
    text: "Quick Answer: How Many Pages Is 1000 Words?",
  },
  {
    type: "paragraph",
    content: [
      "A 1,000-word document is usually about two pages single spaced or four pages double spaced. This estimate assumes a standard 12-point font, one-inch margins, and a common typeface such as Arial or Times New Roman. Your actual page count can change when you adjust any of those settings.",
    ],
  },
  {
    type: "callout",
    tone: "info",
    content: [
      { type: "strong", text: "At a glance: " },
      "1,000 words is approximately 2 pages single spaced, 4 pages double spaced, or 3 pages with 1.5 line spacing.",
    ],
  },
  { type: "heading", level: 2, text: "1000 Words to Pages Conversion Table" },
  {
    type: "paragraph",
    content: [
      "The table below uses 12-point Arial or Times New Roman with one-inch margins. Treat the results as practical estimates rather than fixed totals.",
    ],
  },
  {
    type: "table",
    headers: ["Word count", "Single spaced", "1.5 spacing", "Double spaced"],
    rows: [
      ["250 words", "0.5 page", "0.75 page", "1 page"],
      ["500 words", "1 page", "1.5 pages", "2 pages"],
      ["1,000 words", "2 pages", "3 pages", "4 pages"],
      ["1,500 words", "3 pages", "4.5 pages", "6 pages"],
      ["2,000 words", "4 pages", "6 pages", "8 pages"],
    ],
  },
  { type: "heading", level: 2, text: "1000 Words Double Spaced" },
  {
    type: "paragraph",
    content: [
      "A 1,000-word essay is normally around four pages when double spaced. Double spacing leaves a full blank line of vertical space between each line of text, which gives teachers and editors room to add comments. This is why many academic assignments require double-spaced formatting.",
    ],
  },
  {
    type: "paragraph",
    content: [
      "If your document includes a title page, references, large headings, block quotations, tables, or images, those elements may add extra pages. They usually do not count toward the essay's 1,000-word total unless the assignment instructions say otherwise.",
    ],
  },
  { type: "heading", level: 2, text: "1000 Words Single Spaced" },
  {
    type: "paragraph",
    content: [
      "A 1,000-word document is generally about two pages when single spaced. Business reports, blog drafts, and digital documents often use single spacing because it keeps the layout compact. Smaller fonts or narrow margins can reduce the page count, while larger fonts and wider margins increase it.",
    ],
  },
  { type: "heading", level: 2, text: "What Affects the Number of Pages?" },
  {
    type: "paragraph",
    content: [
      "Words-to-pages conversion is an estimate because document formatting controls how much text fits on each page. These factors make the biggest difference:",
    ],
  },
  {
    type: "list",
    items: [
      [
        { type: "strong", text: "Font family: " },
        "Arial, Calibri, and Times New Roman have different character widths even at the same size.",
      ],
      [
        { type: "strong", text: "Font size: " },
        "A 14-point font uses more space than a standard 12-point font.",
      ],
      [
        { type: "strong", text: "Line spacing: " },
        "Double spacing produces roughly twice as many pages as single spacing.",
      ],
      [
        { type: "strong", text: "Margins: " },
        "Wider margins create a smaller writing area and increase the page count.",
      ],
      [
        { type: "strong", text: "Paragraph structure: " },
        "Frequent headings, short paragraphs, and blank lines use additional vertical space.",
      ],
    ],
  },
  { type: "heading", level: 2, text: "How Long Is a 1000 Word Essay?" },
  {
    type: "paragraph",
    content: [
      "For most students, a 1,000-word essay is a short-to-medium assignment. A balanced structure might use about 100 to 150 words for the introduction, 700 to 800 words for the main argument, and 100 to 150 words for the conclusion. That usually allows three to five focused body paragraphs.",
    ],
  },
  {
    type: "paragraph",
    content: [
      "Reading 1,000 words takes approximately four to five minutes at an average adult reading speed. Writing the first draft can take one to three hours, while research, outlining, citations, and editing may extend the full task to several hours.",
    ],
  },
  { type: "heading", level: 2, text: "How to Check Your Exact Word Count" },
  {
    type: "paragraph",
    content: [
      "Page count is useful for planning, but word count is the accurate measure when an assignment or client specifies a limit. The ToolNest ",
      { type: "tool-link", text: "Word Counter", toolId: "word-counter" },
      " counts words, characters, sentences, paragraphs, and estimated reading time directly in your browser.",
    ],
  },
  {
    type: "list",
    ordered: true,
    items: [
      ["Open the ToolNest Word Counter."],
      ["Paste or type your draft into the text area."],
      ["Review the live word and character totals."],
      ["Edit the draft until it meets the required length."],
    ],
  },
  { type: "tool-cta", toolId: "word-counter" },
  { type: "heading", level: 2, text: "Frequently Asked Questions" },
  { type: "heading", level: 3, text: "Can 1000 words fit on one page?" },
  {
    type: "paragraph",
    content: [
      "Not with normal document settings. Fitting 1,000 words on one page would require a very small font, tight spacing, or narrow margins, making the text difficult to read. Standard formatting produces about two single-spaced pages.",
    ],
  },
  { type: "heading", level: 3, text: "Is 1000 words a long essay?" },
  {
    type: "paragraph",
    content: [
      "It is longer than a short response but shorter than a typical research paper. Most writers can develop one clear argument with several supporting points in 1,000 words.",
    ],
  },
  { type: "heading", level: 3, text: "How many paragraphs are in 1000 words?" },
  {
    type: "paragraph",
    content: [
      "A 1,000-word piece commonly contains five to ten paragraphs. The exact number depends on whether your paragraphs average about 100, 150, or 200 words and how the topic is organized.",
    ],
  },
  { type: "divider" },
  { type: "heading", level: 2, text: "Conclusion" },
  {
    type: "paragraph",
    content: [
      "In standard formatting, 1,000 words equals about two single-spaced pages or four double-spaced pages. Font, margins, spacing, headings, and visual elements can change the final total, so use page estimates for planning and a reliable ",
      { type: "tool-link", text: "Word Counter", toolId: "word-counter" },
      " when the exact length matters.",
    ],
  },
];

export const articles: Article[] = [
  {
    id: "article-json-formatting",
    slug: "how-to-format-json-in-vscode",
    title: "How to Format JSON in VS Code: A Complete Beginner's Guide",
    excerpt:
      "Learn how to format JSON in VS Code using Format Document, keyboard shortcuts, format on save, and a free online JSON formatter.",
    category: "developer",
    cover: "json",
    featuredImage: "/blog/how-to-format-json-in-vscode.png",
    featuredImageAlt:
      "A code editor transforming compact JSON into clean, indented JSON",
    author: "ToolNest Editorial",
    publishedAt: "2026-11-26",
    readingMinutes: 7,
    featured: true,
    relatedToolIds: ["json-formatter"],
    status: "published",
    updatedAt: "2026-11-26",
    tags: [
      "JSON",
      "VS Code",
      "JSON Formatting",
      "Developer Tools",
      "Tutorials",
    ],
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
    slug: "how-many-pages-is-1000-words",
    title: "How Many Pages Is 1000 Words? A Complete Guide",
    excerpt:
      "Find out how many pages 1,000 words is when single or double spaced, what changes the page count, and how long a 1,000-word essay takes.",
    category: "writing",
    cover: "count",
    featuredImage: "/blog/how-many-pages-is-1000-words.png",
    featuredImageAlt:
      "A writing desk comparing 1,000 words as two single-spaced pages and four double-spaced pages",
    author: "ToolNest Editorial",
    publishedAt: "2026-11-25",
    readingMinutes: 6,
    featured: false,
    relatedToolIds: ["word-counter"],
    status: "published",
    updatedAt: "2026-11-25",
    tags: [
      "1000 Words",
      "Words to Pages",
      "Essay Writing",
      "Word Count",
      "Writing Tips",
    ],
    relatedArticleIds: ["article-writing-analysis"],
    content: wordsToPagesArticleContent,
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
