import {
  articleCategories,
  type Article,
  type ArticleCategoryId,
} from "../../data/articles";

export type ArticleSort = "newest" | "oldest" | "title";

export interface ArticleQuery {
  search: string;
  category: "all" | ArticleCategoryId;
  sort: ArticleSort;
}

export function filterAndSortArticles(
  source: Article[],
  query: ArticleQuery,
): Article[] {
  const words = query.search
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/u)
    .filter(Boolean);
  return source
    .filter((article) => {
      if (query.category !== "all" && article.category !== query.category)
        return false;
      const haystack = [
        article.title,
        article.excerpt,
        articleCategories[article.category].name,
        ...article.relatedToolIds,
      ]
        .join(" ")
        .toLocaleLowerCase();
      return words.every((word) => haystack.includes(word));
    })
    .sort((a, b) =>
      query.sort === "title"
        ? a.title.localeCompare(b.title)
        : query.sort === "oldest"
          ? a.publishedAt.localeCompare(b.publishedAt)
          : b.publishedAt.localeCompare(a.publishedAt),
    );
}

export function paginateArticles(
  source: Article[],
  page: number,
  pageSize: number,
) {
  const pageCount = Math.ceil(source.length / pageSize);
  const currentPage = Math.min(Math.max(1, page), Math.max(1, pageCount));
  return {
    items: source.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    currentPage,
    pageCount,
  };
}
