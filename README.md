# ToolNest

Production-oriented Next.js foundation for a growing collection of free browser-based utilities.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Validate with `npm run lint`, `npm run typecheck`, and `npm run build`.

Implemented routes include the homepage, all-tools directory, and six reusable category pages under `/tools/category/[slug]`. Developer, Text and SEO are active; Image, PDF and Calculators are clearly marked Coming Soon.

JSON Formatter, Word Counter and Meta Tag Generator are operational browser-side utilities. Meta Tag Generator safely escapes generated HTML, validates HTTP(S) URLs locally and provides illustrative search previews without fetching external sites. Run `npm test` for focused processor tests and `npm run qa:json` against a production server for JSON interaction checks.

The `/blog` route provides a responsive, filterable preview listing backed by typed local article data. A structured demonstration article is available at `/blog/how-to-format-and-validate-json`. All current content is unpublished and remains `noindex, nofollow` and outside the sitemap until editorial review.

The optional `NEXT_PUBLIC_SITE_URL` environment variable supplies a future canonical metadata base. See `docs/` for design, architecture, routes, and status.
