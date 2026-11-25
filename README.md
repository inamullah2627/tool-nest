# ToolNest

Production-oriented Next.js foundation for a growing collection of free browser-based utilities.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Validate with `npm run lint`, `npm run typecheck`, and `npm run build`.

Implemented routes include the homepage, all-tools directory, and six reusable category pages under `/tools/category/[slug]`. Developer, Text and SEO are active; Image, PDF and Calculators are clearly marked Coming Soon.

JSON Formatter is the first operational browser-side utility at `/tools/json-formatter`. Run `npm test` for focused processor tests and `npm run qa:json` against a production server for browser interaction checks.

The optional `NEXT_PUBLIC_SITE_URL` environment variable supplies a future canonical metadata base. See `docs/` for design, architecture, routes, and status.
