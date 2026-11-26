declare module "js-beautify/js/lib/beautify-html.js" {
  export function html_beautify(
    source: string,
    options?: Record<string, unknown>,
  ): string;
}

declare module "js-beautify/js/lib/beautify-css.js" {
  export function css_beautify(
    source: string,
    options?: Record<string, unknown>,
  ): string;
}

declare module "html-minifier-terser/dist/htmlminifier.esm.bundle" {
  export function minify(
    source: string,
    options?: Record<string, unknown>,
  ): Promise<string>;
}

declare module "html-minifier-terser" {
  export function minify(
    source: string,
    options?: Record<string, unknown>,
  ): Promise<string>;
}
