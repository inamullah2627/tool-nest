# Architecture

The App Router owns routing and metadata. Route pages are lightweight and render feature components. The root layout provides optimized fonts and providers; the shared responsive shell lives under `src/components/design`. Feature folders contain interactive homepage and directory UI, while catalog data and types remain independent.

Favorites and recent identifiers persist through one context. Directory state remains local and accepts initial URL parameters. Future processing logic should use independent pure TypeScript modules.

Category directories share one client feature template and typed configuration, rendered by the static dynamic route `/tools/category/[slug]`. Catalog records stay in `src/data/tools.ts`; category-specific editorial content stays in `src/features/category/category-config.ts`.

Individual utilities use the reusable `ToolPageLayout` under `/tools/[slug]`. Each tool keeps its workspace and pure processing logic isolated. JSON Formatter runs parsing and serialization in a dedicated browser Web Worker; no input is sent to a server or persisted locally.

HTML Formatter uses `js-beautify` and the official browser ESM bundle from `html-minifier-terser` inside a dedicated Web Worker. Its conservative minifier preserves comments, quoted attributes, optional tags and embedded code; user HTML is displayed only as escaped React text and is never rendered.

Case Converter keeps all twelve transformations in an isolated native TypeScript module. Its client workspace derives output from unchanged source text and the selected mode, while file and clipboard actions remain local to the browser.

CSS Minifier runs CSSO with structural restructuring and unsafe media merging disabled inside a browser Web Worker. The existing js-beautify dependency provides CSS beautification. CSS is displayed as text and is never injected into the document.

Remove Duplicate Lines uses an isolated native TypeScript processor built around Map grouping and Set identity tracking. Matching normalization is separate from retained line content, and the client workspace clears derived output whenever source text or options change.

URL Slug Generator uses one isolated Unicode-aware TypeScript transformation pipeline for single and bulk modes. HTTP(S) URL validation and encoded full-URL construction are pure local helpers; entered addresses are never fetched.

Open Graph Generator keeps validation, conditional property selection, HTML escaping and Open Graph/Twitter Card generation in an isolated TypeScript module. Social previews use React text rendering. Local image object URLs are preview-only and revoked by the client workspace; remote URLs are never fetched.

The blog uses typed static data from `src/data/articles.ts`, reusable components under `src/features/blog`, and pure listing/content helpers under `src/lib/blog`. Structured article blocks are rendered as React elements without parsing arbitrary HTML. Publication status controls indexing, sitemap inclusion and Article structured data.

Global search uses a pure local index under `src/lib/search`, sourcing operational tools and active categories from the tool registry, published articles from article data, and public pages from `src/data/search-pages.ts`. Search state is URL-based and no query data is transmitted or persisted.
