# Routes

Implemented: `/`, `/about`, `/contact`, `/privacy-policy`, `/terms-and-conditions`, `/disclaimer`, `/tools`, `/blog`, `/search`, and the shared `/tools/category/[slug]` template.

The App Router `not-found.tsx` convention provides the custom recovery experience for unknown general, tool, category and article URLs. Invalid destinations return a real HTTP 404 response and the hydrated recovery UI replaces the visible address with `/404`; no separate 200-status `/404` page is created or included in the sitemap.

The reusable individual-tool route `/tools/[slug]` is established. `/tools/json-formatter`, `/tools/html-formatter`, `/tools/css-minifier`, `/tools/word-counter`, `/tools/case-converter`, `/tools/remove-duplicate-lines`, `/tools/text-cleaner`, `/tools/meta-tag-generator`, `/tools/url-slug-generator`, `/tools/open-graph-generator` and `/tools/date-difference-calculator` are operational tool pages.

Active indexed category routes: `/tools/category/developer`, `/tools/category/text`, `/tools/category/seo`, and `/tools/category/calculators`.

Reviewable Coming Soon routes: `/tools/category/image` and `/tools/category/pdf`. These routes are marked `noindex` and excluded from `sitemap.xml`.

The `/blog` listing and reusable `/blog/[slug]` route are implemented. The featured preview links to `/blog/how-to-format-and-validate-json`; this demonstration article and the listing use `noindex, nofollow` and remain excluded from the sitemap. Unknown or content-less slugs return `notFound()`.

The static `/about` route includes section navigation and registry-derived platform status. The interactive `/contact` route accepts validated `inquiry` and `tool` URL parameters, but does not transmit or persist submissions until delivery is configured.

The reusable legal layout is implemented with the draft `/privacy-policy`, `/terms-and-conditions` and `/disclaimer` routes. All use `noindex, nofollow` and are deliberately excluded from `sitemap.xml` pending legal, operator and production-infrastructure review.

The local `/search` route accepts URL parameters including `q`, `type`, `sort` and `page`. It is marked `noindex` and excluded from the sitemap. Only operational tools, active categories, published articles and implemented public pages can become navigable results.

Reserved for later designs: additional `/tools/[slug]` implementations and real published blog content.

Unimplemented destinations are not linked as functional. Shared navigation now resolves category links to their dedicated category routes.
