import type { Article, ArticleBlock, ArticleInline } from "../../data/articles";

export const ARTICLE_READING_WORDS_PER_MINUTE = 200;

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export function getArticleTableOfContents(content: ArticleBlock[]): TocItem[] {
  const used = new Map<string, number>();
  return content.flatMap((block) => {
    if (block.type !== "heading") return [];
    const base = slugifyHeading(block.text) || "section";
    const occurrence = (used.get(base) ?? 0) + 1;
    used.set(base, occurrence);
    return [
      {
        id: occurrence === 1 ? base : `${base}-${occurrence}`,
        text: block.text,
        level: block.level,
      },
    ];
  });
}

export function getArticleReadingTime(article: Article): number {
  if (!article.content?.length) return article.readingMinutes;
  const text = article.content.map(blockText).join(" ");
  const words =
    text.match(/[\p{L}\p{M}\p{N}]+(?:['’\-][\p{L}\p{M}\p{N}]+)*/gu) ?? [];
  return Math.max(
    1,
    Math.ceil(words.length / ARTICLE_READING_WORDS_PER_MINUTE),
  );
}

export function slugifyHeading(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\p{M}]/gu, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
}

function inlineText(content: ArticleInline[]) {
  return content
    .map((part) => (typeof part === "string" ? part : part.text))
    .join("");
}

function blockText(block: ArticleBlock): string {
  switch (block.type) {
    case "heading":
    case "quote":
      return block.text;
    case "paragraph":
    case "callout":
      return inlineText(block.content);
    case "list":
      return block.items.map(inlineText).join(" ");
    case "code":
      return `${block.label} ${block.code}`;
    case "table":
      return [...block.headers, ...block.rows.flat()].join(" ");
    case "figure":
      return block.caption;
    case "tool-cta":
      return "";
    case "divider":
      return "";
  }
}
