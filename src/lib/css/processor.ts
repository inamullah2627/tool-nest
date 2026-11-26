import { minify } from "csso";
import { css_beautify } from "js-beautify/js/lib/beautify-css.js";

export const MAX_CSS_FILE_BYTES = 2 * 1024 * 1024;
export type CssIndent = 2 | 4 | "tab";

export interface CssProcessingOptions {
  indent: CssIndent;
  preserveLicenseComments: boolean;
}

export interface CssMetrics {
  lines: number;
  characters: number;
  bytes: number;
}

export interface CompressionMetrics {
  inputBytes: number;
  outputBytes: number;
  bytesSaved: number;
  percentage: number;
}

export function minifyCss(
  input: string,
  options: Pick<CssProcessingOptions, "preserveLicenseComments">,
): string {
  ensureProcessable(input);
  rejectUnsupportedSyntax(input);
  const source = options.preserveLicenseComments
    ? normalizeLicenseComments(input)
    : input;
  return minify(source, {
    restructure: false,
    forceMediaMerge: false,
    comments: options.preserveLicenseComments ? "exclamation" : false,
  }).css;
}

export function beautifyCss(
  input: string,
  options: Pick<CssProcessingOptions, "indent">,
): string {
  ensureProcessable(input);
  return css_beautify(input, {
    indent_size: options.indent === "tab" ? 1 : options.indent,
    indent_char: options.indent === "tab" ? "\t" : " ",
    indent_with_tabs: options.indent === "tab",
    preserve_newlines: true,
    max_preserve_newlines: 2,
    end_with_newline: false,
  });
}

export function getCssMetrics(text: string): CssMetrics {
  return {
    lines: text ? text.split(/\r\n|\r|\n/u).length : 0,
    characters: Array.from(text).length,
    bytes: new TextEncoder().encode(text).length,
  };
}

export function getCompressionMetrics(
  input: string,
  output: string,
): CompressionMetrics {
  const inputBytes = getCssMetrics(input).bytes;
  const outputBytes = getCssMetrics(output).bytes;
  const bytesSaved = inputBytes - outputBytes;
  return {
    inputBytes,
    outputBytes,
    bytesSaved,
    percentage: inputBytes ? (bytesSaved / inputBytes) * 100 : 0,
  };
}

export function validateCssFile(
  file: Pick<File, "name" | "type" | "size">,
): string | null {
  const extensionAllowed = /\.css$/iu.test(file.name);
  const mimeAllowed =
    !file.type || file.type === "text/css" || file.type === "text/plain";
  if (!extensionAllowed || !mimeAllowed)
    return "Unsupported file. Choose a standard .css file.";
  if (file.size > MAX_CSS_FILE_BYTES)
    return "This file exceeds the 2 MB limit. Choose a smaller CSS file.";
  return null;
}

function normalizeLicenseComments(input: string): string {
  let output = "";
  let index = 0;
  while (index < input.length) {
    const character = input[index];
    if (character === '"' || character === "'") {
      const quote = character;
      const start = index++;
      while (index < input.length) {
        if (input[index] === "\\") index += 2;
        else if (input[index++] === quote) break;
      }
      output += input.slice(start, index);
      continue;
    }
    if (character === "/" && input[index + 1] === "*") {
      const end = input.indexOf("*/", index + 2);
      const stop = end < 0 ? input.length : end + 2;
      const comment = input.slice(index, stop);
      output +=
        !comment.startsWith("/*!") && /@(?:license|preserve)\b/iu.test(comment)
          ? `/*!${comment.slice(2)}`
          : comment;
      index = stop;
      continue;
    }
    output += character;
    index += 1;
  }
  return output;
}

function rejectUnsupportedSyntax(input: string) {
  const structuralText = input.replace(
    /\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/gu,
    (match) => " ".repeat(match.length),
  );
  if (/(?:^|[;{}])\s*&(?:\s|[>+~.#:]|\[|$)/mu.test(structuralText))
    throw new Error(
      "Native CSS nesting is not supported by this minifier version. Flatten nested rules before processing.",
    );
  if (/@media[^{}]*[<>]=?[^{}]*\{/iu.test(structuralText))
    throw new Error(
      "Range-style media queries are not supported by this minifier version. Use min-width or max-width syntax.",
    );
}

function ensureProcessable(input: string) {
  if (!input.trim()) throw new Error("Enter CSS before processing.");
  if (getCssMetrics(input).bytes > MAX_CSS_FILE_BYTES)
    throw new Error("Input exceeds the 2 MB processing limit.");
  validateBalancedSyntax(input);
}

function validateBalancedSyntax(input: string) {
  const stack: string[] = [];
  const pairs: Record<string, string> = { "}": "{", ")": "(", "]": "[" };
  let index = 0;
  while (index < input.length) {
    const character = input[index];
    if (character === '"' || character === "'") {
      const quote = character;
      index += 1;
      let closed = false;
      while (index < input.length) {
        if (input[index] === "\\") index += 2;
        else if (input[index++] === quote) {
          closed = true;
          break;
        }
      }
      if (!closed) throw new Error("Unterminated CSS string.");
      continue;
    }
    if (character === "/" && input[index + 1] === "*") {
      const end = input.indexOf("*/", index + 2);
      if (end < 0) throw new Error("Unterminated CSS comment.");
      index = end + 2;
      continue;
    }
    if (character === "{" || character === "(" || character === "[")
      stack.push(character);
    else if (character in pairs && stack.pop() !== pairs[character])
      throw new Error(`Unexpected closing token “${character}”.`);
    index += 1;
  }
  if (stack.length)
    throw new Error(`Missing closing token for “${stack.at(-1)}”.`);
}
