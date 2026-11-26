"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { DesignFooter, DesignHeader } from "@/components/design/site-shell";
import { Icon } from "@/components/design/icon";
import {
  articleCategories,
  articles,
  type ArticleCategoryId,
} from "@/data/articles";
import { tools } from "@/data/tools";
import { ExactToolCard } from "@/features/home/react-home-page";
import {
  filterAndSortArticles,
  paginateArticles,
  type ArticleSort,
} from "@/lib/blog/articles";
import {
  ArticleCard,
  BlogEmptyState,
  BlogPagination,
  FeaturedArticle,
} from "./blog-components";

const PAGE_SIZE = 6;

export function BlogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | ArticleCategoryId>("all");
  const [sort, setSort] = useState<ArticleSort>("newest");
  const [page, setPage] = useState(1);
  const directoryRef = useRef<HTMLElement>(null);
  const filtersActive = Boolean(search.trim() || category !== "all");
  const featured = articles.find((article) => article.featured);
  const listingSource = filtersActive
    ? articles
    : articles.filter((article) => !article.featured);
  const filtered = useMemo(
    () => filterAndSortArticles(listingSource, { search, category, sort }),
    [category, listingSource, search, sort],
  );
  const paged = paginateArticles(filtered, page, PAGE_SIZE);
  const relatedTools = tools.filter((tool) =>
    ["json-formatter", "word-counter", "meta-tag-generator"].includes(tool.id),
  );

  const reset = () => {
    setSearch("");
    setCategory("all");
    setPage(1);
  };
  const selectPage = (next: number) => {
    setPage(next);
    directoryRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="blog-page">
      <DesignHeader />
      <main>
        <section className="blog-hero">
          <div className="wrap">
            <nav className="bcr blog-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">
                <Icon name="home" size={14} />
                Home
              </Link>
              <Icon name="chev" size={14} />
              <span aria-current="page">Blog</span>
            </nav>
            <span className="eyebrow">
              <Icon name="edit" size={14} />
              THE TOOLNEST BLOG
            </span>
            <h1>Insights, Guides &amp; Tutorials</h1>
            <p className="lead">
              Practical guides, developer tips, SEO strategies and productivity
              insights to help you get more done with ToolNest.
            </p>
            <div className="sw blog-search">
              <div className="sb">
                <span className="blog-search-icon">
                  <Icon name="search" size={22} />
                </span>
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  type="search"
                  placeholder="Search articles, guides and tutorials..."
                  autoComplete="off"
                  aria-label="Search articles"
                />
                {search && (
                  <button
                    className="ib"
                    aria-label="Clear search"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                  >
                    <Icon name="x" size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
        {!filtersActive && featured && (
          <section className="blog-featured">
            <div className="wrap">
              <FeaturedArticle article={featured} />
            </div>
          </section>
        )}
        <section className="bdir" ref={directoryRef}>
          <div className="wrap">
            <div className="sh">
              <h2>Latest Articles</h2>
              <p>Practical guides, tutorials, and tips from ToolNest.</p>
            </div>
            <div className="btabs">
              <div
                className="tabs"
                role="tablist"
                aria-label="Article categories"
              >
                <button
                  role="tab"
                  aria-selected={category === "all"}
                  onClick={() => {
                    setCategory("all");
                    setPage(1);
                  }}
                >
                  All Articles
                </button>
                {Object.entries(articleCategories).map(([id, config]) => (
                  <button
                    role="tab"
                    aria-selected={category === id}
                    onClick={() => {
                      setCategory(id as ArticleCategoryId);
                      setPage(1);
                    }}
                    key={id}
                  >
                    {config.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="btb">
              <div className="btl">
                <span>
                  {filtered.length}{" "}
                  {filtered.length === 1 ? "article" : "articles"}
                  {category !== "all"
                    ? ` in ${articleCategories[category].name}`
                    : ""}
                </span>
                {search.trim() && (
                  <span className="mini">Search: “{search.trim()}”</span>
                )}
                {filtersActive && (
                  <button className="btn" onClick={reset}>
                    <Icon name="x" size={14} />
                    Clear Filters
                  </button>
                )}
              </div>
              <select
                className="sel"
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value as ArticleSort);
                  setPage(1);
                }}
                aria-label="Sort articles"
              >
                <option value="newest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A–Z</option>
              </select>
            </div>
            {paged.items.length ? (
              <div className="bg3 blog-grid">
                {paged.items.map((article) => (
                  <ArticleCard article={article} key={article.id} />
                ))}
              </div>
            ) : (
              <BlogEmptyState onReset={reset} />
            )}
            <BlogPagination
              currentPage={paged.currentPage}
              pageCount={paged.pageCount}
              onPage={selectPage}
            />
          </div>
        </section>
        <section className="blog-tools">
          <div className="wrap">
            <div className="blog-tools-heading">
              <div className="sh">
                <h2>Put Your Knowledge into Practice</h2>
                <p>Explore operational tools related to these guides.</p>
              </div>
              <Link href="/tools" className="btn">
                View All Tools
              </Link>
            </div>
            <div className="fcg">
              {relatedTools.map((tool) => (
                <ExactToolCard tool={tool} detailedIcon key={tool.id} />
              ))}
            </div>
          </div>
        </section>
        <section className="tool-cta blog-cta">
          <div className="wrap">
            <div className="cta">
              <span className="mono-d category-mono-left">{"{ }"}</span>
              <span className="mono-d category-mono-right">{"</>"}</span>
              <h2>Discover More. Get More Done.</h2>
              <p>
                Explore free online tools for developers, writers and SEO
                professionals.
              </p>
              <Link href="/tools" className="btn w">
                Explore All Tools
              </Link>
              <Link href="/#categories" className="sl">
                Browse Categories
              </Link>
            </div>
          </div>
        </section>
      </main>
      <DesignFooter />
    </div>
  );
}
