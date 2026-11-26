import { html_beautify } from "js-beautify/js/lib/beautify-html.js";

export const MAX_HTML_FILE_BYTES = 2 * 1024 * 1024;
export type HtmlIndent = 2 | 4 | "tab";
export type HtmlWrapLength = 0 | 80 | 120;

export interface HtmlFormatOptions {
  indent: HtmlIndent;
  wrapLength: HtmlWrapLength;
  preserveLineBreaks: boolean;
  indentInnerHtml: boolean;
  formatEmbedded: boolean;
}

export function formatHtml(input: string, options: HtmlFormatOptions) {
  ensureProcessable(input);
  return html_beautify(input, {
    indent_size: options.indent === "tab" ? 1 : options.indent,
    indent_char: options.indent === "tab" ? "\t" : " ",
    indent_with_tabs: options.indent === "tab",
    wrap_line_length: options.wrapLength,
    preserve_newlines: options.preserveLineBreaks,
    max_preserve_newlines: options.preserveLineBreaks ? 10 : 0,
    indent_inner_html: options.indentInnerHtml,
    indent_scripts: "normal",
    templating: ["auto"],
    content_unformatted: ["pre", "textarea"],
    unformatted: options.formatEmbedded ? [] : ["script", "style"],
    extra_liners: [],
    end_with_newline: false,
  });
}

export async function minifyHtml(input: string, preserveLineBreaks: boolean) {
  ensureProcessable(input);
  const { minify } =
    await import("html-minifier-terser/dist/htmlminifier.esm.bundle");
  return minify(input, {
    collapseWhitespace: true,
    conservativeCollapse: true,
    preserveLineBreaks,
    removeComments: false,
    removeAttributeQuotes: false,
    removeEmptyAttributes: false,
    removeOptionalTags: false,
    sortAttributes: false,
    sortClassName: false,
    decodeEntities: false,
    minifyCSS: false,
    minifyJS: false,
    keepClosingSlash: true,
    continueOnParseError: false,
  });
}

export function getHtmlMetrics(text: string) {
  return {
    lines: text ? text.split("\n").length : 0,
    characters: text.length,
    bytes: new TextEncoder().encode(text).length,
  };
}

export function getSizeReduction(input: string, output: string) {
  const inputBytes = getHtmlMetrics(input).bytes;
  const outputBytes = getHtmlMetrics(output).bytes;
  return inputBytes > 0 && outputBytes < inputBytes
    ? ((inputBytes - outputBytes) / inputBytes) * 100
    : 0;
}

export function validateHtmlFile(file: Pick<File, "name" | "type" | "size">) {
  const extensionAllowed = /\.html?$/iu.test(file.name);
  const mimeAllowed =
    !file.type ||
    file.type === "text/html" ||
    file.type === "application/xhtml+xml";
  if (!extensionAllowed || !mimeAllowed)
    return "Unsupported file. Choose an .html or .htm file.";
  if (file.size > MAX_HTML_FILE_BYTES)
    return "This file exceeds the 2 MB size limit. Choose a smaller HTML file.";
  return null;
}

function ensureProcessable(input: string) {
  if (!input.trim()) throw new Error("Enter HTML before processing.");
  if (getHtmlMetrics(input).bytes > MAX_HTML_FILE_BYTES)
    throw new Error("Input exceeds the 2 MB processing limit.");
}
