# Routes

Implemented: `/`, `/tools`, and the shared `/tools/category/[slug]` template.

The reusable individual-tool route `/tools/[slug]` is established. `/tools/json-formatter` is the only operational tool page.

Active indexed category routes: `/tools/category/developer`, `/tools/category/text`, and `/tools/category/seo`.

Reviewable Coming Soon routes: `/tools/category/image`, `/tools/category/pdf`, and `/tools/category/calculators`. These routes are marked `noindex` and excluded from `sitemap.xml`.

Reserved for later designs: additional `/tools/[slug]` implementations, `/blog`, `/blog/[slug]`, `/about`, `/contact`, `/privacy-policy`, `/terms-and-conditions`, `/disclaimer`, and `/search`.

Unimplemented destinations are not linked as functional. Shared navigation now resolves category links to their dedicated category routes.
