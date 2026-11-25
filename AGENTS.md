# ToolNest contributor guide

- Keep route files lightweight and prefer Server Components unless interaction requires a Client Component.
- Treat `src/data/tools.ts` as the catalog source of truth; do not duplicate tool metadata.
- Preserve semantic tokens in `src/app/globals.css` and the established light/dark design.
- Catalog visibility does not mean a processing interface exists. Keep `implementationStatus` accurate.
- Add processing logic as isolated pure TypeScript modules when individual tools are implemented.
- Run lint, typecheck, and build before handoff.
