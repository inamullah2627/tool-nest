import { describe, expect, it } from "vitest";
import {
  countCharacters,
  escapeHtmlAttribute,
  escapeHtmlText,
  generateMetaTags,
  parseHttpUrl,
  type MetaTagInput,
  validateMetaTagInput,
} from "./meta-tags";

const base: MetaTagInput = {
  title: "Example page",
  robotsIndex: "index",
  robotsFollow: "follow",
  charset: "UTF-8",
  includeViewport: true,
};

describe("meta tag generator", () => {
  it("escapes text and attribute contexts without executing markup", () => {
    expect(escapeHtmlText('<script>& "test"</script>')).toBe(
      '&lt;script&gt;&amp; "test"&lt;/script&gt;',
    );
    expect(escapeHtmlAttribute('A "quote" & <tag>')).toBe(
      "A &quot;quote&quot; &amp; &lt;tag&gt;",
    );
  });

  it("accepts only complete HTTP and HTTPS URLs", () => {
    expect(parseHttpUrl("https://example.com/page")?.hostname).toBe(
      "example.com",
    );
    expect(parseHttpUrl("http://localhost:3000")?.protocol).toBe("http:");
    expect(parseHttpUrl("javascript:alert(1)")).toBeNull();
    expect(parseHttpUrl("example.com")).toBeNull();
  });

  it("omits empty optional fields", () => {
    const html = generateMetaTags(base);
    expect(html).not.toContain('name="description"');
    expect(html).not.toContain('name="author"');
    expect(html).not.toContain('rel="canonical"');
  });

  it("counts Unicode characters by code point", () => {
    expect(countCharacters("Café 😊")).toBe(6);
  });

  it("generates one non-conflicting robots tag", () => {
    const html = generateMetaTags({
      ...base,
      robotsIndex: "noindex",
      robotsFollow: "nofollow",
    });
    expect(html.match(/name="robots"/g)).toHaveLength(1);
    expect(html).toContain('content="noindex, nofollow"');
  });

  it("generates complete escaped HTML output", () => {
    const html = generateMetaTags({
      ...base,
      title: "Tools & SEO <Guide>",
      description: 'A "safe" description',
      author: "Zoë & Team",
      canonicalUrl: "https://example.com/tools?x=1&y=2",
    });
    expect(html).toContain("<title>Tools &amp; SEO &lt;Guide&gt;</title>");
    expect(html).toContain('content="A &quot;safe&quot; description"');
    expect(html).toContain('content="Zoë &amp; Team"');
    expect(html).toContain("x=1&amp;y=2");
    expect(html.split("\n")[0]).toBe('<meta charset="UTF-8">');
  });

  it("validates the required title and optional URLs", () => {
    expect(
      validateMetaTagInput({ ...base, title: "" }).errors.title,
    ).toBeTruthy();
    expect(
      validateMetaTagInput({ ...base, canonicalUrl: "ftp://example.com" })
        .errors.canonicalUrl,
    ).toBeTruthy();
  });
});
