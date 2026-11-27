# Project context

ToolNest is a free, SEO-focused collection of browser-based utilities for developers, writers, SEO professionals, students, and general users. The business model anticipates organic traffic and optional advertising, without mandatory accounts or subscriptions.

The supplied interactive HTML artifacts establish the visual reference. Catalog visibility is separate from functional readiness; `src/data/tools.ts` is the current source of truth for operational and planned tools.

The Blog listing currently demonstrates the future editorial structure with local draft content. It is deliberately excluded from indexing until real articles are reviewed and published.

The About page is static and uses the tool registry for category availability and tool counts. The Contact page provides a frontend-only validated form; its delivery adapter intentionally performs no network request or persistence until a real service is configured. Unfinished legal pages are not presented as published.

The Privacy Policy is an implementation-audited working draft, not finalized legal advice. Current code has no analytics, advertising, cookie-setting, email delivery, CMS or database integration. Local storage is limited to theme, favorites and recently used tool preferences. Production hosting and legal details require a separate pre-launch audit.

The Terms & Conditions page is also an explicitly non-indexed working draft. Its content does not identify an operator, company, jurisdiction or governing law and does not claim that proposed warranty or liability language is enforceable.

The Disclaimer is a third non-indexed legal draft. Its tool-specific statements are tied to currently operational processors and registry availability rather than treating catalog visibility as functionality. All three legal drafts link to one another.

# 404 behavior

Unknown routes use the App Router `src/app/not-found.tsx` convention and return HTTP 404. After hydration the recovery UI replaces the visible invalid address with `/404`, while retaining the original 404 response rather than creating a standalone 200-status route. The page reuses the shared shell, registry, directory query parameter and favorites provider and remains outside the sitemap.

# Global search

The `/search` route performs all matching locally against centralized static data. URL parameters preserve query/filter/sort/page state for browser navigation. Unpublished articles and unfinished destinations are omitted, and the route remains noindex and outside the sitemap.

# HTML Formatter audit

The operational HTML Formatter uses browser-bundled HTML-aware libraries rather than regex processing. Minification is intentionally conservative and embedded CSS/JavaScript minification is unsupported; formatting those blocks is optional. Invalid HTML is not validated or repaired, and framework-specific templates require output review.

# Case Converter audit

Case Converter uses twelve native TypeScript conversion modes and no new dependency. Title Case follows a documented English minor-word convention; proper nouns and locale-specific casing still require review. Base64 and URL encoder/decoder tools remain planned.

# CSS Minifier audit

CSS Minifier uses CSSO 5 with restructuring disabled and the existing js-beautify CSS processor. It preserves exclamation, `@license` and `@preserve` comments by default, but removes regular comments and can perform safe value normalization. Native CSS nesting and range-style media queries are explicitly rejected because CSSO 5 cannot preserve them safely. CSS is never applied to the interface or used to fetch resources.

# Remove Duplicate Lines audit

Remove Duplicate Lines uses native Map and Set processing with no dependency. It treats a single terminal newline as a terminator, normalizes CRLF output to LF, preserves retained source content, and reports duplicate occurrences separately from removed empty lines. It is a whole-line processor rather than a CSV parser.

# URL Slug Generator audit

URL Slug Generator uses native Unicode property escapes and adds no dependency. Accent normalization folds Latin diacritics and selected Latin letters, but does not transliterate other scripts. Bulk mode preserves line order and blank results. Full URLs accept only HTTP(S), remove query/fragment data from the preview base, and percent-encode the generated path without making a request.

# Open Graph Generator audit

Open Graph Generator performs validation and escaped HTML generation locally with no dependency or network request. Local JPG, PNG and WebP files up to 10 MB are decoded by the browser only to preview content and detect dimensions; temporary object URLs are revoked and excluded from metadata. Platform cards are illustrative and do not reproduce proprietary rendering or cache behavior exactly.

# Text Cleaner audit

Text Cleaner uses native Unicode property escapes and browser-inert HTML containers with no new dependency. Its URL matcher targets explicit HTTP(S) and `www.` addresses, while its email matcher covers common domain-based forms rather than every RFC-valid edge case. HTML block boundaries become line or paragraph separation; scripts, styles and embedded-resource blocks are discarded without execution or network loading.

# Date Difference Calculator audit

Date calculations use a native integer proleptic-Gregorian engine with a supported input range of years 0001 through 9999 and no date dependency. Counts describe whole calendar dates rather than timezone-aware elapsed timestamps. The end date is excluded by default; reversed ranges return positive magnitudes with direction; years/months are applied before weeks/days; shorter target months clamp to their final day. Business-day holidays are manual, deduplicated and never fetched from an external service.
