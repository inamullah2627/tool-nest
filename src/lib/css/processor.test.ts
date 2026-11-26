import { describe, expect, it } from "vitest";
import {
  beautifyCss,
  getCompressionMetrics,
  getCssMetrics,
  minifyCss,
  validateCssFile,
} from "./processor";

describe("CSS processor", () => {
  it("minifies conservatively without restructuring rule order", () => {
    const input = ".a { color: red; }\n.a { color: blue; }";
    expect(minifyCss(input, { preserveLicenseComments: true })).toBe(
      ".a{color:red}.a{color:#00f}",
    );
  });

  it("preserves custom properties, calc, strings, URLs, and Unicode", () => {
    const input = `:root { --gap: calc(100% - 2rem); --label: "你好  world"; }
.hero { width: calc(100% - var(--gap)); background: url("images/a b.svg?x=1&y=2"); content: "a  b"; }`;
    const output = minifyCss(input, { preserveLicenseComments: true });
    expect(output).toContain("--gap:calc(100% - 2rem)");
    expect(output).toContain('"你好  world"');
    expect(output).toContain("url(images/a\\ b.svg?x=1&y=2)");
    expect(output).toContain('content:"a  b"');
  });

  it("supports media queries, keyframes, and modern values", () => {
    const input = `@media (min-width: 40rem) { .card { display: grid; color: color(display-p3 1 0 0); } }
@keyframes fade { from { opacity: 0; } to { opacity: 1; } }`;
    const output = minifyCss(input, { preserveLicenseComments: true });
    expect(output).toContain("@media (min-width:40rem)");
    expect(output).toContain("@keyframes fade");
    expect(output).toContain("color(display-p3 1 0 0)");
    expect(() =>
      minifyCss(".card { & > h2 { color: red } }", {
        preserveLicenseComments: true,
      }),
    ).toThrow(/nesting/u);
    expect(() =>
      minifyCss("@media (width >= 40rem) { .card { display: grid } }", {
        preserveLicenseComments: true,
      }),
    ).toThrow(/Range-style/u);
  });

  it("removes regular comments and preserves license comments by preference", () => {
    const input =
      "/* ordinary */ /*! Copyright */ /* @license MIT */ .a { color: red }";
    const kept = minifyCss(input, { preserveLicenseComments: true });
    expect(kept).not.toContain("ordinary");
    expect(kept).toContain("Copyright");
    expect(kept).toContain("@license MIT");
    expect(minifyCss(input, { preserveLicenseComments: false })).not.toContain(
      "Copyright",
    );
  });

  it("beautifies using selected indentation and reports invalid CSS", () => {
    expect(beautifyCss(".a{color:red}", { indent: 4 })).toContain(
      "    color: red",
    );
    expect(() =>
      minifyCss(".a { color:", { preserveLicenseComments: true }),
    ).toThrow();
  });

  it("calculates UTF-8 metrics, savings, increases, and validates files", () => {
    expect(getCssMetrics("/* 世界 */\n.a{}")).toEqual({
      lines: 2,
      characters: 13,
      bytes: 17,
    });
    expect(getCompressionMetrics("12345", "12")).toMatchObject({
      bytesSaved: 3,
      percentage: 60,
    });
    expect(getCompressionMetrics("1", "123")).toMatchObject({
      bytesSaved: -2,
      percentage: -200,
    });
    expect(
      validateCssFile({ name: "site.css", type: "text/css", size: 10 }),
    ).toBeNull();
    expect(
      validateCssFile({ name: "site.scss", type: "text/plain", size: 10 }),
    ).toMatch(/Unsupported/u);
    expect(
      validateCssFile({
        name: "site.css",
        type: "text/css",
        size: 2 * 1024 * 1024 + 1,
      }),
    ).toMatch(/2 MB/u);
  });
});
