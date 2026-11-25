# Architecture

The App Router owns routing and metadata. Route pages are lightweight and render feature components. The root layout provides optimized fonts and providers; the shared responsive shell lives under `src/components/design`. Feature folders contain interactive homepage and directory UI, while catalog data and types remain independent.

Favorites and recent identifiers persist through one context. Directory state remains local and accepts initial URL parameters. Future processing logic should use independent pure TypeScript modules.

Category directories share one client feature template and typed configuration, rendered by the static dynamic route `/tools/category/[slug]`. Catalog records stay in `src/data/tools.ts`; category-specific editorial content stays in `src/features/category/category-config.ts`.
