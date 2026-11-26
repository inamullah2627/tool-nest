import { describe, expect, it } from "vitest";
import { articles } from "../../data/articles";
import { filterAndSortArticles, paginateArticles } from "./articles";

describe("blog article listing", () => {
  it("filters by category and every search word", () => {
    const result = filterAndSortArticles(articles, {
      search: "meta descriptions",
      category: "seo",
      sort: "newest",
    });
    expect(result.map((article) => article.slug)).toEqual([
      "better-seo-titles-and-meta-descriptions",
    ]);
  });

  it("sorts oldest and title order", () => {
    const oldest = filterAndSortArticles(articles, {
      search: "",
      category: "all",
      sort: "oldest",
    });
    expect(oldest[0].publishedAt).toBe("2026-08-18");
    const alphabetical = filterAndSortArticles(articles, {
      search: "",
      category: "all",
      sort: "title",
    });
    expect(alphabetical[0].title).toBe(
      "10 Common JSON Syntax Errors and How to Fix Them",
    );
  });

  it("paginates and clamps out-of-range pages", () => {
    expect(paginateArticles(articles, 1, 6).items).toHaveLength(6);
    const last = paginateArticles(articles, 99, 6);
    expect(last.currentPage).toBe(2);
    expect(last.items).toHaveLength(4);
  });
});
