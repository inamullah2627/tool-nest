# Routes

Implemented: `/`, `/tools`, `/blog`, and the shared `/tools/category/[slug]` template.

The reusable individual-tool route `/tools/[slug]` is established. `/tools/json-formatter`, `/tools/word-counter` and `/tools/meta-tag-generator` are operational tool pages.

Active indexed category routes: `/tools/category/developer`, `/tools/category/text`, and `/tools/category/seo`.

Reviewable Coming Soon routes: `/tools/category/image`, `/tools/category/pdf`, and `/tools/category/calculators`. These routes are marked `noindex` and excluded from `sitemap.xml`.

The `/blog` listing and reusable `/blog/[slug]` route are implemented. The featured preview links to `/blog/how-to-format-and-validate-json`; this demonstration article and the listing use `noindex, nofollow` and remain excluded from the sitemap. Unknown or content-less slugs return `notFound()`.

Reserved for later designs: additional `/tools/[slug]` implementations, real published blog content, `/about`, `/contact`, `/privacy-policy`, `/terms-and-conditions`, `/disclaimer`, and `/search`.

Unimplemented destinations are not linked as functional. Shared navigation now resolves category links to their dedicated category routes.
