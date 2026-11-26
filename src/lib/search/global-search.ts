import { articles, articleCategories } from "../../data/articles";
import { searchablePages } from "../../data/search-pages";
import { categories, categoryMap, tools } from "../../data/tools";
import type { IconName } from "../../components/design/icon";

export type SearchResultType = "tool" | "category" | "article" | "page";
export type SearchSort = "relevance" | "az" | "za";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  href: string;
  label: string;
  keywords: string[];
  icon: IconName;
  color: string;
  score: number;
  meta?: string;
}

const categoryIcons = {
  developer: "code",
  text: "type",
  seo: "search",
  image: "image",
  pdf: "file",
  calculators: "calc",
} as const;

const synonyms: Record<string, string[]> = {
  format: ["formatter", "beautify", "prettify"],
  formatter: ["format", "beautify"],
  count: ["counter", "counting"],
  counter: ["count"],
  character: ["characters"],
  characters: ["character"],
  meta: ["metadata", "tags"],
  tags: ["tag", "meta"],
  dev: ["developer", "code"],
  developer: ["dev", "code", "programming"],
  seo: ["search", "optimization", "metadata"],
  help: ["contact", "support"],
};

export function tokenizeSearchQuery(query: string): string[] {
  return [
    ...new Set(query.toLocaleLowerCase().trim().split(/\s+/u).filter(Boolean)),
  ];
}

function variants(token: string) {
  return [
    ...new Set(
      [
        token,
        ...(synonyms[token] ?? []),
        token.length > 3 && token.endsWith("s") ? token.slice(0, -1) : token,
      ].filter(Boolean),
    ),
  ];
}

export function getGlobalSearchIndex(): SearchResult[] {
  const operationalTools: SearchResult[] = tools
    .filter((tool) => tool.implementationStatus === "operational")
    .map((tool) => ({
      id: tool.id,
      type: "tool",
      title: tool.name,
      description: tool.shortDescription,
      href: `/tools/${tool.slug}`,
      label: `${categoryMap[tool.category].shortName} Tools`,
      keywords: [...tool.keywords, tool.group, categoryMap[tool.category].name],
      icon: categoryIcons[tool.category],
      color: categoryMap[tool.category].color,
      score: 0,
      meta: "Available",
    }));
  const activeCategories: SearchResult[] = categories
    .filter((category) => category.active)
    .map((category) => ({
      id: `category-${category.id}`,
      type: "category",
      title: category.name,
      description: category.description,
      href: `/tools/category/${category.id}`,
      label: "Category",
      keywords: [category.shortName, "category", "tools"],
      icon: categoryIcons[category.id],
      color: category.color,
      score: 0,
      meta: `${tools.filter((tool) => tool.category === category.id && tool.implementationStatus === "operational").length} available`,
    }));
  const publishedArticles: SearchResult[] = articles
    .filter(
      (article) => article.status === "published" && article.content?.length,
    )
    .map((article) => ({
      id: article.id,
      type: "article",
      title: article.title,
      description: article.excerpt,
      href: `/blog/${article.slug}`,
      label: articleCategories[article.category].name,
      keywords: [...(article.tags ?? []), "article", "guide", "tutorial"],
      icon: "file",
      color: articleCategories[article.category].color,
      score: 0,
      meta: `${article.readingMinutes} min read`,
    }));
  const pages: SearchResult[] = searchablePages.map((page) => ({
    ...page,
    type: "page",
    label: page.group,
    icon:
      page.id === "page-contact"
        ? "msg"
        : page.id === "page-tools"
          ? "grid"
          : page.id === "page-about"
            ? "info"
            : "home",
    color: "#4F46E5",
    score: 0,
  }));
  return [
    ...operationalTools,
    ...activeCategories,
    ...publishedArticles,
    ...pages,
  ];
}

function scoreResult(item: SearchResult, tokens: string[], fullQuery: string) {
  const title = item.title.toLocaleLowerCase();
  const titleWords = title.split(/[^\p{L}\p{N}]+/u);
  const description = item.description.toLocaleLowerCase();
  const label = item.label.toLocaleLowerCase();
  const keywords = item.keywords.join(" ").toLocaleLowerCase();
  let total = 0;
  for (const token of tokens) {
    let best = 0;
    for (const candidate of variants(token)) {
      if (title === candidate) best = Math.max(best, 60);
      else if (titleWords.includes(candidate) || title.startsWith(candidate))
        best = Math.max(best, 40);
      else if (title.includes(candidate)) best = Math.max(best, 30);
      else if (keywords.split(/\s+/u).includes(candidate))
        best = Math.max(best, 22);
      else if (keywords.includes(candidate)) best = Math.max(best, 16);
      else if (description.includes(candidate)) best = Math.max(best, 10);
      else if (label.includes(candidate)) best = Math.max(best, 6);
    }
    if (!best) return 0;
    total += best;
  }
  return (
    total + (title === fullQuery ? 100 : title.includes(fullQuery) ? 40 : 0)
  );
}

export function searchGlobalContent(
  query: string,
  type: "all" | SearchResultType = "all",
  sort: SearchSort = "relevance",
) {
  const tokens = tokenizeSearchQuery(query);
  if (!tokens.length) return [];
  const fullQuery = tokens.join(" ");
  const results = getGlobalSearchIndex()
    .map((item) => ({ ...item, score: scoreResult(item, tokens, fullQuery) }))
    .filter((item) => item.score > 0 && (type === "all" || item.type === type));
  return results.sort((a, b) =>
    sort === "az"
      ? a.title.localeCompare(b.title)
      : sort === "za"
        ? b.title.localeCompare(a.title)
        : b.score - a.score || a.title.localeCompare(b.title),
  );
}

export function highlightSearchText(text: string, query: string) {
  const tokens = tokenizeSearchQuery(query);
  if (!tokens.length) return [{ text, match: false }];
  const escaped = tokens.map((token) =>
    token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const matcher = new RegExp(`(${escaped.join("|")})`, "giu");
  return text
    .split(matcher)
    .filter(Boolean)
    .map((part) => ({
      text: part,
      match: tokens.includes(part.toLocaleLowerCase()),
    }));
}
