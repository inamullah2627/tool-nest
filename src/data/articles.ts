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

const robotsTxtArticleContent: ArticleBlock[] = [
  { type: "heading", level: 2, text: "What Is a Robots.txt File?" },
  {
    type: "paragraph",
    content: [
      "A robots.txt file is a plain-text file that gives web crawlers instructions about which parts of a website they may request. Search engines normally check this file before crawling pages. It helps you manage crawl activity, but it does not remove pages from search results and it must never be treated as a security feature.",
    ],
  },
  {
    type: "callout",
    tone: "warning",
    content: [
      { type: "strong", text: "Important: " },
      "Robots.txt rules are public and voluntary. Use authentication or server permissions—not robots.txt—to protect private content.",
    ],
  },
  { type: "heading", level: 2, text: "Where Should Robots.txt Be Located?" },
  {
    type: "paragraph",
    content: [
      "Place the file at the root of the exact host and protocol it controls. For example, the robots.txt file for https://example.com must be available at https://example.com/robots.txt. A file stored in /blog/robots.txt does not control the full site, and subdomains such as shop.example.com need their own files.",
    ],
  },
  { type: "heading", level: 2, text: "How to Create a Robots.txt File" },
  {
    type: "paragraph",
    content: [
      "You can create robots.txt with any plain-text editor. The filename must be lowercase and end in .txt. Do not save it as a rich-text document or as robots.txt.txt.",
    ],
  },
  {
    type: "list",
    ordered: true,
    items: [
      [
        "Open a plain-text editor such as Notepad, VS Code, or TextEdit in plain-text mode.",
      ],
      ["Add a User-agent line to identify the crawler the rule applies to."],
      ["Add Allow or Disallow rules on separate lines."],
      ["Optionally add the absolute URL of your XML sitemap."],
      ["Save the file as robots.txt using UTF-8 encoding."],
      [
        "Upload it to the root directory and open /robots.txt in a browser to confirm it is publicly accessible.",
      ],
    ],
  },
  { type: "heading", level: 2, text: "Robots.txt Syntax Explained" },
  {
    type: "paragraph",
    content: [
      "A robots.txt group begins with User-agent and is followed by one or more rules. A blank line separates groups. Directive names are not case-sensitive, but paths can be case-sensitive depending on your server, so copy URL paths exactly.",
    ],
  },
  {
    type: "list",
    items: [
      [
        { type: "strong", text: "User-agent: " },
        "selects a crawler. An asterisk applies the group to all crawlers that do not have a more specific group.",
      ],
      [
        { type: "strong", text: "Disallow: " },
        "asks the selected crawler not to request matching paths.",
      ],
      [
        { type: "strong", text: "Allow: " },
        "permits a more specific path inside a broader disallowed directory when supported.",
      ],
      [
        { type: "strong", text: "Sitemap: " },
        "points crawlers to an XML sitemap using an absolute URL.",
      ],
    ],
  },
  { type: "heading", level: 2, text: "Basic Robots.txt Example" },
  {
    type: "paragraph",
    content: [
      "This example allows crawlers to access the public website, asks them not to crawl the private and temporary directories, and identifies the sitemap:",
    ],
  },
  {
    type: "code",
    language: "text",
    label: "robots.txt · basic example",
    code: "User-agent: *\nDisallow: /private/\nDisallow: /temp/\n\nSitemap: https://example.com/sitemap.xml",
  },
  { type: "heading", level: 2, text: "Useful Robots.txt Examples" },
  { type: "heading", level: 3, text: "Allow all crawlers" },
  {
    type: "paragraph",
    content: [
      "An empty Disallow value means there are no crawl restrictions for that group.",
    ],
  },
  {
    type: "code",
    language: "text",
    label: "robots.txt · allow all",
    code: "User-agent: *\nDisallow:",
  },
  { type: "heading", level: 3, text: "Block all crawling" },
  {
    type: "paragraph",
    content: [
      "The following rule asks compliant crawlers not to request any URL on the host. Use it carefully, especially on production websites.",
    ],
  },
  {
    type: "code",
    language: "text",
    label: "robots.txt · block all",
    code: "User-agent: *\nDisallow: /",
  },
  { type: "heading", level: 3, text: "Block a folder but allow one file" },
  {
    type: "code",
    language: "text",
    label: "robots.txt · allow exception",
    code: "User-agent: *\nDisallow: /resources/\nAllow: /resources/public-guide.pdf",
  },
  { type: "heading", level: 3, text: "Create a rule for one crawler" },
  {
    type: "paragraph",
    content: [
      "Replace ExampleBot with the documented user-agent token of the crawler you want to address.",
    ],
  },
  {
    type: "code",
    language: "text",
    label: "robots.txt · specific crawler",
    code: "User-agent: ExampleBot\nDisallow: /",
  },
  { type: "heading", level: 2, text: "Robots.txt for SEO" },
  {
    type: "paragraph",
    content: [
      "For SEO, robots.txt is most useful for reducing unnecessary crawling of duplicate filters, internal search pages, temporary files, or low-value URL patterns. This can help crawlers spend more time on pages you want discovered, particularly on large websites.",
    ],
  },
  {
    type: "paragraph",
    content: [
      "Do not block CSS, JavaScript, or image resources that search engines need to render important pages. Also remember that blocking crawling is different from preventing indexing: a blocked URL can still appear in results if other pages link to it. Use a noindex directive in page HTML or an X-Robots-Tag response header when you need supported search engines to exclude a page from their index.",
    ],
  },
  { type: "heading", level: 2, text: "How to Generate Robots.txt" },
  {
    type: "paragraph",
    content: [
      "A generator can help assemble common directives and reduce typing mistakes. ToolNest lists a Robots.txt Generator in its SEO catalog, but its processing interface is still coming soon. Until it is operational, create and review the plain-text file manually using the examples above.",
    ],
  },
  { type: "tool-cta", toolId: "robots-txt-generator" },
  { type: "heading", level: 2, text: "Common Robots.txt Mistakes" },
  {
    type: "list",
    items: [
      [
        { type: "strong", text: "Uploading it to the wrong location. " },
        "Only the root-level /robots.txt file applies to that host.",
      ],
      [
        { type: "strong", text: "Blocking the entire live site. " },
        "A leftover Disallow: / rule from staging can stop normal crawling.",
      ],
      [
        { type: "strong", text: "Using robots.txt for private data. " },
        "The file itself reveals the listed paths to anyone who opens it.",
      ],
      [
        { type: "strong", text: "Expecting it to remove indexed URLs. " },
        "Crawl controls and indexing controls solve different problems.",
      ],
      [
        { type: "strong", text: "Writing incomplete paths. " },
        "A missing slash or incorrect letter case can change which URLs match.",
      ],
    ],
  },
  { type: "heading", level: 2, text: "Test and Monitor Your File" },
  {
    type: "paragraph",
    content: [
      "After publishing the file, request its URL in a browser and verify that the server returns a successful response with plain text. Test important allowed and blocked paths with the robots.txt tools offered by the search engines you target. Recheck the file after migrations, staging deployments, or URL-structure changes.",
    ],
  },
  { type: "divider" },
  { type: "heading", level: 2, text: "Conclusion" },
  {
    type: "paragraph",
    content: [
      "To create a robots.txt file, write plain-text crawler groups, save the file with the exact lowercase filename, upload it to the site's root, and test every important rule. Keep the file as simple as possible, include your sitemap when useful, and use proper access or indexing controls for anything robots.txt cannot protect.",
    ],
  },
];

const removeDuplicateLinesArticleContent: ArticleBlock[] = [
  { type: "heading", level: 2, text: "What Are Duplicate Lines?" },
  {
    type: "paragraph",
    content: [
      "Duplicate lines are repeated rows that contain the same text. They often appear after combining email lists, copying spreadsheet columns, merging exports, collecting keywords, or pasting log data. Removing repeated lines makes the result shorter, easier to review, and safer to import into another system.",
    ],
  },
  {
    type: "quote",
    text: "A clean unique list keeps the first useful entry and removes unnecessary repetitions.",
  },
  { type: "heading", level: 2, text: "How to Remove Duplicate Lines Quickly" },
  {
    type: "paragraph",
    content: [
      "The fastest workflow is to place one item on each line, choose how matching should work, remove duplicates, and review the cleaned output before replacing the original data.",
    ],
  },
  {
    type: "list",
    ordered: true,
    items: [
      ["Keep a backup of the original text."],
      ["Paste the list into a duplicate-line remover or text editor."],
      [
        "Choose whether the comparison should ignore letter case or surrounding spaces.",
      ],
      ["Remove repeated lines while preserving the first occurrence."],
      ["Check the result, then copy or download the cleaned list."],
    ],
  },
  { type: "heading", level: 2, text: "Example: Before and After" },
  {
    type: "paragraph",
    content: [
      "In this example, apple and banana each appear twice. A standard cleanup keeps their first occurrence and preserves the original order.",
    ],
  },
  {
    type: "code",
    language: "text",
    label: "Text · before cleanup",
    code: "apple\nbanana\napple\norange\nbanana",
  },
  {
    type: "code",
    language: "text",
    label: "Text · after cleanup",
    code: "apple\nbanana\norange",
  },
  { type: "heading", level: 2, text: "Exact Matches vs. Normalized Matches" },
  {
    type: "paragraph",
    content: [
      "Before deleting duplicate entries, decide what counts as the same line. Exact matching treats every character as significant. Normalized matching can ignore differences that are visually easy to miss.",
    ],
  },
  {
    type: "table",
    headers: ["Comparison option", "Result", "Useful for"],
    rows: [
      [
        "Exact match",
        "Apple and apple stay separate",
        "IDs, codes, case-sensitive data",
      ],
      [
        "Ignore case",
        "Apple and apple are duplicates",
        "Names, tags, general lists",
      ],
      [
        "Trim spaces",
        "item and item␠ are duplicates",
        "Copied or exported text",
      ],
      [
        "Ignore blank lines",
        "Empty rows are removed",
        "Documents with uneven spacing",
      ],
    ],
  },
  {
    type: "callout",
    tone: "warning",
    content: [
      { type: "strong", text: "Review case-sensitive data carefully. " },
      "Product codes, usernames, file paths, and identifiers may look similar while representing different values.",
    ],
  },
  { type: "heading", level: 2, text: "Remove Duplicate Text Online" },
  {
    type: "paragraph",
    content: [
      "An online cleaner is convenient for ordinary non-sensitive lists because it avoids formulas and scripts. ToolNest includes Remove Duplicate Lines in its text-tools catalog, but the processing interface is still planned. Until it becomes operational, use a trusted local editor or one of the manual methods below.",
    ],
  },
  { type: "tool-cta", toolId: "remove-duplicate-lines" },
  { type: "heading", level: 2, text: "Remove Repeated Lines in VS Code" },
  {
    type: "paragraph",
    content: [
      "VS Code can remove duplicate lines with a suitable extension, or you can sort the lines and inspect repeated neighbors. If you sort first, remember that the original order changes. Always work on a copy when sequence matters.",
    ],
  },
  {
    type: "list",
    ordered: true,
    items: [
      ["Select the lines you want to clean."],
      ["Open the Command Palette."],
      ["Run a trusted extension command for unique or duplicate lines."],
      [
        "Review the diff and undo the operation if meaningful variants were removed.",
      ],
    ],
  },
  {
    type: "heading",
    level: 2,
    text: "Remove Duplicate Entries in Excel or Google Sheets",
  },
  {
    type: "paragraph",
    content: [
      "For spreadsheet data, place the values in one column and use the built-in duplicate-removal feature. In Excel, select the range and choose Data, then Remove Duplicates. In Google Sheets, select the range and choose Data, Data cleanup, then Remove duplicates. Confirm whether the first row is a header before applying the change.",
    ],
  },
  { type: "heading", level: 2, text: "Remove Duplicate Lines with JavaScript" },
  {
    type: "paragraph",
    content: [
      "Developers can split text into lines, place the lines in a Set, and join them again. A Set preserves insertion order, so the first occurrence remains in its original position.",
    ],
  },
  {
    type: "code",
    language: "javascript",
    label: "JavaScript · preserve first occurrence",
    code: 'const uniqueText = [...new Set(text.split(/\\r?\\n/))].join("\\n");',
  },
  {
    type: "paragraph",
    content: [
      "For case-insensitive cleanup, keep a separate normalized key for comparison instead of lowercasing the final output. That approach removes repeated values without changing the capitalization of the first line you keep.",
    ],
  },
  { type: "heading", level: 2, text: "Common Cleanup Mistakes" },
  {
    type: "list",
    items: [
      [
        { type: "strong", text: "Removing near-duplicates automatically. " },
        "Similar lines are not always true duplicates.",
      ],
      [
        { type: "strong", text: "Changing the order unintentionally. " },
        "Sorting makes duplicates easier to see but may damage an ordered list.",
      ],
      [
        { type: "strong", text: "Ignoring invisible whitespace. " },
        "Tabs and trailing spaces can prevent visually identical lines from matching.",
      ],
      [
        { type: "strong", text: "Cleaning sensitive text online. " },
        "Use a local tool for passwords, customer data, private URLs, or confidential records.",
      ],
      [
        { type: "strong", text: "Overwriting the source immediately. " },
        "Keep a backup until you verify the unique list.",
      ],
    ],
  },
  { type: "heading", level: 2, text: "Best Practices for Clean Unique Lists" },
  {
    type: "list",
    items: [
      ["Define whether matching should ignore case, spaces, or blank rows."],
      ["Preserve the first occurrence when the original sequence has meaning."],
      ["Record the number of removed lines for large data-cleaning jobs."],
      ["Spot-check the output before importing it into another application."],
      ["Keep raw source data separate from the cleaned version."],
    ],
  },
  { type: "divider" },
  { type: "heading", level: 2, text: "Conclusion" },
  {
    type: "paragraph",
    content: [
      "To remove duplicate lines safely, decide how matches should be compared, preserve the order when necessary, and verify the cleaned list before replacing your source. A dedicated remover is ideal for quick cleanup, while spreadsheets, editors, and a small JavaScript Set provide reliable alternatives for repeated workflows.",
    ],
  },
];

const reduceImageSizeArticleContent: ArticleBlock[] = [
  {
    type: "heading",
    level: 2,
    text: "Can You Reduce Image Size Without Losing Quality?",
  },
  {
    type: "paragraph",
    content: [
      "Yes—up to a point. Lossless compression can reduce file size without changing image data, while carefully chosen lossy compression removes detail that most viewers will not notice. The practical goal is usually to preserve visible quality at the image's intended display size, not to guarantee that every pixel remains identical.",
    ],
  },
  {
    type: "callout",
    tone: "info",
    content: [
      { type: "strong", text: "Best first step: " },
      "Resize an oversized image to the dimensions it will actually use before lowering its quality setting.",
    ],
  },
  { type: "heading", level: 2, text: "How Image Compression Works" },
  {
    type: "paragraph",
    content: [
      "An image's file size depends on its pixel dimensions, format, compression level, color complexity, transparency, and metadata. Compression encodes the same visual information more efficiently or discards less noticeable information to save additional space.",
    ],
  },
  {
    type: "table",
    headers: ["Method", "Quality impact", "Best use"],
    rows: [
      [
        "Resize dimensions",
        "None at the intended display size",
        "Images larger than their layout",
      ],
      [
        "Lossless compression",
        "No image-data loss",
        "Graphics, screenshots, archival copies",
      ],
      [
        "Lossy compression",
        "Adjustable and often subtle",
        "Photos and web delivery",
      ],
      ["Remove metadata", "No visible change", "Camera photos with EXIF data"],
      [
        "Change format",
        "Depends on settings",
        "Modern browser and app delivery",
      ],
    ],
  },
  { type: "heading", level: 2, text: "How to Reduce Image Size in KB" },
  {
    type: "paragraph",
    content: [
      "Use a copy of the original so you can compare results or start again with different settings. Then follow this order to avoid unnecessary quality loss:",
    ],
  },
  {
    type: "list",
    ordered: true,
    items: [
      ["Check the image's current dimensions and file size."],
      [
        "Resize the width and height to the largest dimensions you actually need.",
      ],
      [
        "Choose a suitable output format: JPEG or WebP for photos, PNG for graphics that need lossless detail or transparency.",
      ],
      ["Start with a high quality setting and compress the copy."],
      ["Compare the result at 100% zoom and at its real display size."],
      [
        "Lower the quality gradually until the file reaches the target size without visible artifacts.",
      ],
    ],
  },
  { type: "heading", level: 2, text: "Choose the Right Image Format" },
  {
    type: "paragraph",
    content: [
      "The output format can make a major difference. A format suited to the image type often produces a smaller file than aggressive compression in the wrong format.",
    ],
  },
  {
    type: "list",
    items: [
      [
        { type: "strong", text: "JPEG: " },
        "a strong choice for photographs and detailed images without transparency. It supports adjustable lossy compression.",
      ],
      [
        { type: "strong", text: "PNG: " },
        "best for logos, interface screenshots, sharp graphics, and transparency, but large photos can become heavy.",
      ],
      [
        { type: "strong", text: "WebP: " },
        "supports lossy and lossless compression and often creates smaller web images than JPEG or PNG.",
      ],
      [
        { type: "strong", text: "AVIF: " },
        "can deliver excellent compression for modern browsers, although encoding and compatibility requirements should be checked for your workflow.",
      ],
    ],
  },
  { type: "heading", level: 2, text: "How to Compress an Image for the Web" },
  {
    type: "paragraph",
    content: [
      "For websites, match the exported dimensions to the largest rendered size. A 4,000-pixel camera photo does not need to remain 4,000 pixels wide if the layout never displays it above 1,200 pixels. Responsive sites can also provide multiple image widths so smaller screens do not download the desktop version.",
    ],
  },
  {
    type: "list",
    items: [
      ["Crop unused areas before export."],
      ["Use sRGB color for predictable web display."],
      ["Remove unnecessary EXIF metadata."],
      ["Export photos as WebP or a well-compressed JPEG."],
      ["Keep a lossless original outside the website's public assets."],
    ],
  },
  { type: "heading", level: 2, text: "Reduce Image Size to 100KB" },
  {
    type: "paragraph",
    content: [
      "A 100KB target is achievable for many profile photos, thumbnails, and small web images. Resize first—often to approximately 800 to 1,200 pixels on the longest edge, depending on detail—then export as WebP or JPEG. Begin around a high quality level and reduce it in small steps while watching hair, text, gradients, and high-contrast edges for artifacts.",
    ],
  },
  {
    type: "callout",
    tone: "warning",
    content: [
      {
        type: "strong",
        text: "A fixed KB target cannot guarantee fixed quality. ",
      },
      "A simple portrait may compress cleanly to 100KB, while a detailed landscape at the same dimensions may need more data.",
    ],
  },
  { type: "heading", level: 2, text: "Reduce Image Size to 200KB" },
  {
    type: "paragraph",
    content: [
      "A 200KB limit gives more room for larger dimensions or complex detail. It is a practical target for many article images, application uploads, and medium-sized web photos. Use the same resize-first workflow, then adjust compression until the result falls below the limit with a small safety margin.",
    ],
  },
  { type: "heading", level: 2, text: "How to Reduce JPG File Size" },
  {
    type: "paragraph",
    content: [
      "JPG files respond well to three changes: smaller pixel dimensions, a lower quality setting, and removal of metadata. Avoid repeatedly opening and saving the same JPG because every lossy re-encode can introduce additional artifacts. Return to the original file for each new export.",
    ],
  },
  {
    type: "paragraph",
    content: [
      "If a photograph still exceeds the limit, compare a WebP export. If the image contains text, logos, or large flat color areas, also compare PNG or lossless WebP because JPEG artifacts may be more noticeable around sharp edges.",
    ],
  },
  { type: "heading", level: 2, text: "Use an Image Compressor" },
  {
    type: "paragraph",
    content: [
      "A dedicated compressor can combine resizing, format conversion, quality adjustment, and metadata removal in one workflow. ToolNest lists an Image Compressor in its image-tools catalog, but its processing interface is still planned. Until it is operational, use a trusted local image editor or an established compressor that clearly explains how files are handled.",
    ],
  },
  { type: "tool-cta", toolId: "image-compressor" },
  { type: "heading", level: 2, text: "How to Compare Image Quality" },
  {
    type: "paragraph",
    content: [
      "File size alone does not tell you whether an image is usable. Compare the source and result side by side at the final display size, then inspect the compressed copy at 100% zoom. Look closely at faces, fine textures, text, shadows, gradients, and edges around objects.",
    ],
  },
  {
    type: "list",
    items: [
      ["Check for blocky squares in detailed areas."],
      ["Look for color bands in skies and smooth gradients."],
      ["Inspect halos or ringing around sharp edges."],
      ["Confirm that small text remains readable."],
      ["Test transparency if the output format supports it."],
    ],
  },
  { type: "heading", level: 2, text: "Common Image Compression Mistakes" },
  {
    type: "list",
    items: [
      [
        { type: "strong", text: "Compressing before resizing. " },
        "Unused pixels make it harder to reach a small file target cleanly.",
      ],
      [
        { type: "strong", text: "Using JPEG for transparency. " },
        "JPEG does not preserve transparent backgrounds.",
      ],
      [
        { type: "strong", text: "Chasing the smallest possible file. " },
        "Extra savings are not worthwhile when visible artifacts damage the image.",
      ],
      [
        { type: "strong", text: "Overwriting the original. " },
        "Keep a high-quality master for future sizes and formats.",
      ],
      [
        { type: "strong", text: "Judging only while zoomed in. " },
        "Also inspect the image at the size people will actually see it.",
      ],
    ],
  },
  { type: "divider" },
  { type: "heading", level: 2, text: "Conclusion" },
  {
    type: "paragraph",
    content: [
      "To reduce image size in KB without noticeable quality loss, resize to the required dimensions, select the right format, remove unnecessary metadata, and lower compression quality gradually. Compare every result at its real display size, keep the original, and stop compressing once further savings become visibly destructive.",
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
    id: "article-robots-txt",
    slug: "how-to-create-robots-txt-file",
    title: "How to Create a Robots.txt File for Your Website",
    excerpt:
      "Learn how to create a robots.txt file, understand its syntax, avoid common SEO mistakes, and publish it in the correct location.",
    category: "seo",
    cover: "seo",
    featuredImage: "/blog/how-to-create-robots-txt-file.png",
    featuredImageAlt:
      "A robots.txt document directing a crawler toward allowed and blocked website sections",
    author: "ToolNest Editorial",
    publishedAt: "2026-11-24",
    readingMinutes: 8,
    featured: false,
    relatedToolIds: ["robots-txt-generator"],
    status: "published",
    updatedAt: "2026-11-24",
    tags: [
      "Robots.txt",
      "Technical SEO",
      "Search Crawlers",
      "Website Indexing",
      "SEO Guide",
    ],
    relatedArticleIds: ["article-canonical"],
    content: robotsTxtArticleContent,
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
    id: "article-reduce-image-size",
    slug: "how-to-reduce-image-size-in-kb",
    title: "How to Reduce Image Size in KB Without Losing Quality",
    excerpt:
      "Learn how to compress an image, reduce JPG file size, and reach 100KB or 200KB targets while preserving visible quality.",
    category: "tutorials",
    cover: "slug",
    featuredImage: "/blog/how-to-reduce-image-size-in-kb.png",
    featuredImageAlt:
      "A large 2.4 MB landscape image compressed into a visually identical 200 KB image",
    author: "ToolNest Editorial",
    publishedAt: "2026-11-22",
    readingMinutes: 8,
    featured: false,
    relatedToolIds: ["image-compressor"],
    status: "published",
    updatedAt: "2026-11-22",
    tags: [
      "Image Compression",
      "Reduce Image Size",
      "JPG Compression",
      "Web Images",
      "Image Optimization",
    ],
    content: reduceImageSizeArticleContent,
  },
  {
    id: "article-remove-duplicate-lines",
    slug: "how-to-remove-duplicate-lines",
    title: "How to Remove Duplicate Lines From Text Quickly",
    excerpt:
      "Learn how to remove repeated lines, delete duplicate entries safely, preserve list order, and clean duplicate text efficiently.",
    category: "productivity",
    cover: "workflow",
    featuredImage: "/blog/how-to-remove-duplicate-lines.png",
    featuredImageAlt:
      "A before-and-after text list with repeated lines removed into a clean unique list",
    author: "ToolNest Editorial",
    publishedAt: "2026-11-23",
    readingMinutes: 7,
    featured: false,
    relatedToolIds: ["remove-duplicate-lines"],
    status: "published",
    updatedAt: "2026-11-23",
    tags: [
      "Remove Duplicate Lines",
      "Text Cleanup",
      "Unique Lists",
      "Productivity",
      "Data Cleaning",
    ],
    content: removeDuplicateLinesArticleContent,
  },
];
