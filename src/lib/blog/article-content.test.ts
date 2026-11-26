import { describe, expect, it } from "vitest";
import { articles, type ArticleBlock } from "../../data/articles";
import {
  getArticleReadingTime,
  getArticleTableOfContents,
  slugifyHeading,
} from "./article-content";

describe("structured article content", () => {
  it("creates stable unique table-of-contents identifiers", () => {
    const content: ArticleBlock[] = [
      { type: "heading", level: 2, text: "What Is JSON?" },
      { type: "heading", level: 3, text: "What Is JSON?" },
    ];
    expect(getArticleTableOfContents(content).map((item) => item.id)).toEqual([
      "what-is-json",
      "what-is-json-2",
    ]);
  });

  it("slugifies Unicode headings safely", () => {
    expect(slugifyHeading("Café & JSON 日本語")).toBe("cafe-json-日本語");
  });

  it("calculates reading time from actual structured content", () => {
    const article = articles.find(
      (item) => item.slug === "how-to-format-json-in-vscode",
    )!;
    expect(article.content?.length).toBeGreaterThan(20);
    expect(getArticleReadingTime(article)).toBeGreaterThanOrEqual(3);
  });
});
