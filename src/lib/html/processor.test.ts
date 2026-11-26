import { describe, expect, it, vi } from "vitest";

vi.mock("html-minifier-terser/dist/htmlminifier.esm.bundle", async () => {
  const library = await import("html-minifier-terser");
  return { minify: library.minify };
});
import {
  formatHtml,
  getHtmlMetrics,
  getSizeReduction,
  minifyHtml,
  validateHtmlFile,
  type HtmlFormatOptions,
} from "./processor";

const options: HtmlFormatOptions = {
  indent: 2,
  wrapLength: 0,
  preserveLineBreaks: false,
  indentInnerHtml: true,
  formatEmbedded: true,
};

describe("HTML processor", () => {
  it("formats nested HTML, fragments, comments and void elements", () => {
    const output = formatHtml(
      '<!doctype html><!--x--><main><img src="x"><section><p>Hello</p></section></main>',
      options,
    );
    expect(output).toContain("\n  <section>");
    expect(output).toContain('<img src="x">');
    expect(output).toContain("<!--x-->");
  });

  it("preserves Unicode, inline spacing and template syntax", () => {
    const source = "<p>Hello <strong>世界 🌍</strong> ! {{ user.name }}</p>";
    const output = formatHtml(source, options);
    expect(output).toContain(
      "Hello <strong>世界 🌍</strong> ! {{ user.name }}",
    );
  });

  it("preserves preformatted and textarea content", () => {
    const source = "<pre>  alpha\n beta</pre><textarea> one\n  two</textarea>";
    const output = formatHtml(source, options);
    expect(output).toContain("  alpha\n beta");
    expect(output).toContain(" one\n  two");
  });

  it("formats embedded CSS and JavaScript when enabled", () => {
    const output = formatHtml(
      "<style>.a{color:red}</style><script>if(true){console.log('x')}</script>",
      options,
    );
    expect(output).toContain("color: red");
    expect(output).toContain("if (true)");
  });

  it("minifies conservatively without changing inline or preformatted text", async () => {
    const source =
      "<p>Hello <strong>world</strong> !</p><pre>  a\n b </pre><!--keep-->";
    const output = await minifyHtml(source, false);
    expect(output).toContain("Hello <strong>world</strong> !");
    expect(output).toContain("<pre>  a\n b </pre>");
    expect(output).toContain("<!--keep-->");
    expect(getSizeReduction(source, output)).toBeGreaterThanOrEqual(0);
  });

  it("counts UTF-8 bytes and validates uploads", () => {
    expect(getHtmlMetrics("🌍")).toEqual({ lines: 1, characters: 2, bytes: 4 });
    expect(
      validateHtmlFile({ name: "page.html", type: "text/html", size: 20 }),
    ).toBeNull();
    expect(
      validateHtmlFile({ name: "page.txt", type: "text/plain", size: 20 }),
    ).toMatch(/Unsupported/);
    expect(
      validateHtmlFile({
        name: "page.html",
        type: "text/html",
        size: 3 * 1024 * 1024,
      }),
    ).toMatch(/2 MB/);
  });
});
