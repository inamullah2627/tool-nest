# Architecture

The App Router owns routing and metadata. Route pages are lightweight and render feature components. The root layout provides optimized fonts and providers; the shared responsive shell lives under `src/components/design`. Feature folders contain interactive homepage and directory UI, while catalog data and types remain independent.

Favorites and recent identifiers persist through one context. Directory state remains local and accepts initial URL parameters. Future processing logic should use independent pure TypeScript modules.

Category directories share one client feature template and typed configuration, rendered by the static dynamic route `/tools/category/[slug]`. Catalog records stay in `src/data/tools.ts`; category-specific editorial content stays in `src/features/category/category-config.ts`.

Individual utilities use the reusable `ToolPageLayout` under `/tools/[slug]`. Each tool keeps its workspace and pure processing logic isolated. JSON Formatter runs parsing and serialization in a dedicated browser Web Worker; no input is sent to a server or persisted locally.

The blog uses typed static data from `src/data/articles.ts`, reusable components under `src/features/blog`, and pure listing/content helpers under `src/lib/blog`. Structured article blocks are rendered as React elements without parsing arbitrary HTML. Publication status controls indexing, sitemap inclusion and Article structured data.

Global search uses a pure local index under `src/lib/search`, sourcing operational tools and active categories from the tool registry, published articles from article data, and public pages from `src/data/search-pages.ts`. Search state is URL-based and no query data is transmitted or persisted.
