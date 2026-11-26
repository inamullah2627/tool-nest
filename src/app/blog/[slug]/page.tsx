import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { articles } from "@/data/articles";
import { ArticleLayout } from "@/features/blog/article-layout";
import { getArticleReadingTime } from "@/lib/blog/article-content";

const availableArticles = articles.filter((article) => article.content?.length);

export function generateStaticParams() {
  return availableArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = availableArticles.find((item) => item.slug === slug);
  if (!article) return {};
  const published = article.status === "published";
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/blog/${article.slug}` },
    robots: published
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: `/blog/${article.slug}`,
      publishedTime: published ? article.publishedAt : undefined,
      modifiedTime: published ? article.updatedAt : undefined,
      authors: published ? [article.author] : undefined,
      tags: published ? article.tags : undefined,
      images: article.featuredImage
        ? [
            {
              url: `${siteConfig.url ?? "https://toolnest.example"}${article.featuredImage}`,
              alt: article.featuredImageAlt ?? article.title,
            },
          ]
        : undefined,
    },
  };
}

export default async function ArticleRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = availableArticles.find((item) => item.slug === slug);
  if (!article) notFound();
  const published = article.status === "published";
  const articleSchema = published
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.excerpt,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt ?? article.publishedAt,
        author: { "@type": "Organization", name: article.author },
        mainEntityOfPage: `${siteConfig.url ?? "https://toolnest.example"}/blog/${article.slug}`,
        image: article.featuredImage
          ? `${siteConfig.url ?? "https://toolnest.example"}${article.featuredImage}`
          : undefined,
        timeRequired: `PT${getArticleReadingTime(article)}M`,
      }
    : null;
  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema).replaceAll("<", "\\u003c"),
          }}
        />
      )}
      <ArticleLayout article={article} />
    </>
  );
}
