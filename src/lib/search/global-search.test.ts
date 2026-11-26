import { describe, expect, it } from "vitest";
import {
  getGlobalSearchIndex,
  highlightSearchText,
  searchGlobalContent,
  tokenizeSearchQuery,
} from "./global-search";

describe("global search", () => {
  it("matches case-insensitively and supports partial titles", () => {
    expect(
      searchGlobalContent("JsOn").some((item) => item.id === "json-formatter"),
    ).toBe(true);
    expect(
      searchGlobalContent("count").some((item) => item.id === "word-counter"),
    ).toBe(true);
  });

  it("requires every keyword and applies curated synonyms", () => {
    expect(searchGlobalContent("beautify json")[0]?.id).toBe("json-formatter");
    expect(searchGlobalContent("word metadata")).toHaveLength(0);
  });

  it("filters content types and sorts titles", () => {
    expect(
      searchGlobalContent("tools", "category").every(
        (item) => item.type === "category",
      ),
    ).toBe(true);
    const titles = searchGlobalContent("tools", "all", "az").map(
      (item) => item.title,
    );
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
  });

  it("excludes planned tools, inactive categories and unpublished articles", () => {
    const index = getGlobalSearchIndex();
    expect(index.some((item) => item.id === "base64-encoder-decoder")).toBe(
      false,
    );
    expect(index.some((item) => item.id === "html-formatter")).toBe(true);
    expect(index.some((item) => item.id === "case-converter")).toBe(true);
    expect(index.some((item) => item.id === "category-image")).toBe(false);
    expect(
      index.some(
        (item) =>
          item.type === "article" && item.id === "article-json-formatting",
      ),
    ).toBe(true);
    expect(
      index.some(
        (item) =>
          item.type === "article" && item.id === "article-json-minification",
      ),
    ).toBe(false);
  });

  it("tokenizes repeated whitespace and creates safe highlight segments", () => {
    expect(tokenizeSearchQuery("  JSON   formatter json ")).toEqual([
      "json",
      "formatter",
    ]);
    expect(highlightSearchText("JSON <script>", "json")).toEqual([
      { text: "JSON", match: true },
      { text: " <script>", match: false },
    ]);
  });
});
