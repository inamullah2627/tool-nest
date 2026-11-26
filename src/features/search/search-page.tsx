"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useState } from "react";
import { DesignFooter, DesignHeader } from "@/components/design/site-shell";
import { Icon } from "@/components/design/icon";
import { usePreferences } from "@/components/providers/app-providers";
import { categories, tools } from "@/data/tools";
import {
  highlightSearchText,
  searchGlobalContent,
  type SearchResult,
  type SearchResultType,
  type SearchSort,
} from "@/lib/search/global-search";

const pageSize = 6;
const popular = [
  "JSON Formatter",
  "Word Counter",
  "Meta Tag Generator",
  "SEO Tools",
];
const filterLabels: Record<"all" | SearchResultType, string> = {
  all: "All Results",
  tool: "Tools",
  category: "Categories",
  article: "Blog Articles",
  page: "Pages",
};

function validType(value: string | null): "all" | SearchResultType {
  return value === "tool" ||
    value === "category" ||
    value === "article" ||
    value === "page"
    ? value
    : "all";
}
function validSort(value: string | null): SearchSort {
  return value === "az" || value === "za" ? value : "relevance";
}

export function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { favorites, recent } = usePreferences();
  const query = params.get("q")?.trim() ?? "";
  const type = validType(params.get("type"));
  const sort = validSort(params.get("sort"));
  const requestedPage = Math.max(
    1,
    Number.parseInt(params.get("page") ?? "1", 10) || 1,
  );
  const [input, setInput] = useState(query);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  useEffect(() => {
    const syncInput = window.setTimeout(() => setInput(query), 0);
    return () => window.clearTimeout(syncInput);
  }, [query]);

  const allResults = useMemo(() => searchGlobalContent(query), [query]);
  const filtered = useMemo(
    () => searchGlobalContent(query, type, sort),
    [query, type, sort],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(requestedPage, pages);
  const visible = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const suggestions = useMemo(
    () => searchGlobalContent(input).slice(0, 7),
    [input],
  );

  const navigate = (next: {
    q?: string;
    type?: "all" | SearchResultType;
    sort?: SearchSort;
    page?: number;
  }) => {
    const search = new URLSearchParams(params.toString());
    const nextQuery = next.q ?? query;
    const nextType = next.type ?? type;
    const nextSort = next.sort ?? sort;
    const nextPage = next.page ?? 1;
    if (nextQuery) search.set("q", nextQuery);
    else search.delete("q");
    if (nextType === "all") search.delete("type");
    else search.set("type", nextType);
    if (nextSort === "relevance") search.delete("sort");
    else search.set("sort", nextSort);
    if (nextPage > 1) search.set("page", String(nextPage));
    else search.delete("page");
    router.push(`${pathname}${search.size ? `?${search}` : ""}`);
  };
  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    setSuggestionsOpen(false);
    navigate({ q: input.trim(), page: 1 });
  };
  const selectSuggestion = (item: SearchResult) => {
    setSuggestionsOpen(false);
    router.push(item.href);
  };
  const onSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && suggestions.length) {
      event.preventDefault();
      setSuggestionsOpen(true);
      setActiveSuggestion((value) =>
        Math.min(value + 1, suggestions.length - 1),
      );
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestion((value) => Math.max(value - 1, 0));
    }
    if (event.key === "Escape") {
      setSuggestionsOpen(false);
      setActiveSuggestion(-1);
    }
    if (event.key === "Enter" && suggestionsOpen && activeSuggestion >= 0) {
      event.preventDefault();
      selectSuggestion(suggestions[activeSuggestion]);
    }
  };
  const count = (key: "all" | SearchResultType) =>
    key === "all"
      ? allResults.length
      : allResults.filter((item) => item.type === key).length;
  const favoriteTools = tools.filter(
    (tool) =>
      favorites.includes(tool.id) &&
      tool.implementationStatus === "operational",
  );
  const recentTools = recent.flatMap((id) => {
    const tool = tools.find(
      (item) => item.id === id && item.implementationStatus === "operational",
    );
    return tool ? [tool] : [];
  });

  return (
    <div className="search-page">
      <DesignHeader />
      <main>
        <section className="hero ph search-hero">
          <div className="wrap">
            <nav className="bcr" aria-label="Breadcrumb">
              <Link href="/">
                <Icon name="home" size={14} />
                Home
              </Link>
              <span>/</span>
              <span aria-current="page">Search Results</span>
            </nav>
            <h1>Search ToolNest</h1>
            <p className="lead">
              Find the right tools, helpful guides and resources for your
              everyday tasks.
            </p>
            <form className="sw search-global-box" onSubmit={submit}>
              <div className="sb">
                <span className="search-input-icon">
                  <Icon name="search" size={22} />
                </span>
                <input
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value);
                    setSuggestionsOpen(true);
                    setActiveSuggestion(-1);
                  }}
                  onFocus={() => setSuggestionsOpen(true)}
                  onKeyDown={onSearchKeyDown}
                  placeholder="Search tools, articles and more..."
                  autoComplete="off"
                  role="combobox"
                  aria-expanded={suggestionsOpen}
                  aria-controls="global-search-suggestions"
                  aria-activedescendant={
                    activeSuggestion >= 0
                      ? `search-suggestion-${activeSuggestion}`
                      : undefined
                  }
                  aria-label="Search ToolNest"
                />
                {input && (
                  <button
                    className="ib"
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                      setInput("");
                      navigate({ q: "" });
                    }}
                  >
                    <Icon name="x" size={18} />
                  </button>
                )}
                <button className="btn pr" type="submit">
                  Search <Icon name="arrow" size={16} />
                </button>
              </div>
              {suggestionsOpen && (
                <div
                  className="sg open"
                  id="global-search-suggestions"
                  role="listbox"
                >
                  <div className="h">
                    {input.trim() ? "Suggestions" : "Popular searches"}
                  </div>
                  {input.trim()
                    ? suggestions.map((item, index) => (
                        <button
                          key={item.id}
                          id={`search-suggestion-${index}`}
                          role="option"
                          aria-selected={index === activeSuggestion}
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => selectSuggestion(item)}
                        >
                          <span
                            className="cico"
                            style={{ "--c": item.color } as React.CSSProperties}
                          >
                            <Icon name={item.icon} size={16} />
                          </span>
                          {item.title}
                          <small>{item.label}</small>
                        </button>
                      ))
                    : popular.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => {
                            setInput(term);
                            navigate({ q: term });
                          }}
                        >
                          <Icon name="search" size={16} />
                          {term}
                        </button>
                      ))}
                  {input.trim() && !suggestions.length && (
                    <p className="search-suggestion-empty">
                      No matching suggestions
                    </p>
                  )}
                  <button className="va" type="submit">
                    View all results <Icon name="arrow" size={16} />
                  </button>
                </div>
              )}
            </form>
          </div>
        </section>
        <section className="search-results-section">
          <div className="wrap">
            <div className="search-summary">
              {query && (
                <div>
                  <h2>Search results for “{query}”</h2>
                  <p>
                    {allResults.length}{" "}
                    {allResults.length === 1 ? "result" : "results"} found
                  </p>
                </div>
              )}
              {(type !== "all" || sort !== "relevance") && (
                <button
                  className="btn search-clear-filters"
                  onClick={() => navigate({ type: "all", sort: "relevance" })}
                >
                  Clear Filters
                </button>
              )}
            </div>
            {query && (
              <div className="search-controls">
                <div
                  className="tabs search-tabs"
                  role="tablist"
                  aria-label="Result types"
                >
                  {(
                    Object.keys(filterLabels) as Array<"all" | SearchResultType>
                  ).map((key) => (
                    <button
                      key={key}
                      role="tab"
                      aria-selected={type === key}
                      onClick={() => navigate({ type: key, page: 1 })}
                    >
                      {filterLabels[key]}{" "}
                      <span className="tcn">{count(key)}</span>
                    </button>
                  ))}
                </div>
                <select
                  className="sel"
                  value={sort}
                  onChange={(event) =>
                    navigate({
                      sort: event.target.value as SearchSort,
                      page: 1,
                    })
                  }
                  aria-label="Sort results"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="az">Title A–Z</option>
                  <option value="za">Title Z–A</option>
                </select>
              </div>
            )}
            <div className="search-layout">
              <div className="search-result-list">
                {!query ? (
                  <EmptyQuery
                    onSearch={(term) => {
                      setInput(term);
                      navigate({ q: term });
                    }}
                  />
                ) : !allResults.length ? (
                  <NoResults
                    onClear={() => {
                      setInput("");
                      navigate({ q: "" });
                    }}
                  />
                ) : !filtered.length ? (
                  <FilteredEmpty
                    onReset={() => navigate({ type: "all", sort: "relevance" })}
                  />
                ) : (
                  <>
                    {visible.map((item) => (
                      <ResultRow key={item.id} item={item} query={query} />
                    ))}
                    {pages > 1 && (
                      <nav className="pgn" aria-label="Pagination">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => navigate({ page: currentPage - 1 })}
                        >
                          Previous
                        </button>
                        {Array.from(
                          { length: pages },
                          (_, index) => index + 1,
                        ).map((page) => (
                          <button
                            key={page}
                            aria-current={
                              page === currentPage ? "page" : undefined
                            }
                            aria-label={`Page ${page}`}
                            onClick={() => navigate({ page })}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          disabled={currentPage === pages}
                          onClick={() => navigate({ page: currentPage + 1 })}
                        >
                          Next
                        </button>
                      </nav>
                    )}
                  </>
                )}
              </div>
              <aside className="search-sidebar">
                <SidebarGroup title="Popular Searches">
                  {popular.map((term) => (
                    <button
                      className="chip"
                      key={term}
                      onClick={() => {
                        setInput(term);
                        navigate({ q: term });
                      }}
                    >
                      {term}
                    </button>
                  ))}
                </SidebarGroup>
                <SidebarGroup title="Browse Categories">
                  {categories
                    .filter((item) => item.active)
                    .map((category) => (
                      <Link
                        className="rl"
                        href={`/tools/category/${category.id}`}
                        key={category.id}
                      >
                        {category.name}
                        <Icon name="arrow" size={15} />
                      </Link>
                    ))}
                </SidebarGroup>
                {favoriteTools.length > 0 && (
                  <SidebarGroup title="Favorites">
                    {favoriteTools.map((tool) => (
                      <Link
                        className="chip"
                        href={`/tools/${tool.slug}`}
                        key={tool.id}
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </SidebarGroup>
                )}
                {recentTools.length > 0 && (
                  <SidebarGroup title="Recently Used">
                    {recentTools.map((tool) => (
                      <Link
                        className="chip"
                        href={`/tools/${tool.slug}`}
                        key={tool.id}
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </SidebarGroup>
                )}
                <SidebarGroup title="Quick Access">
                  <Link className="rl" href="/tools">
                    <Icon name="grid" size={18} />
                    All Tools
                    <Icon name="arrow" size={15} />
                  </Link>
                </SidebarGroup>
              </aside>
            </div>
          </div>
        </section>
        <section className="search-cta">
          <div className="wrap">
            <div className="cta">
              <h2>Still Looking for the Right Tool?</h2>
              <p>
                Explore our growing collection of free online utilities or
                suggest a tool you would like to see.
              </p>
              <Link href="/tools" className="btn w">
                Explore All Tools
              </Link>
              <Link href="/contact?inquiry=feature-request" className="sl">
                Suggest a Tool
              </Link>
            </div>
          </div>
        </section>
      </main>
      <DesignFooter />
    </div>
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  return (
    <>
      {highlightSearchText(text, query).map((part, index) =>
        part.match ? (
          <mark className="mk" key={`${part.text}-${index}`}>
            {part.text}
          </mark>
        ) : (
          <span key={`${part.text}-${index}`}>{part.text}</span>
        ),
      )}
    </>
  );
}
function ResultRow({ item, query }: { item: SearchResult; query: string }) {
  return (
    <article
      className="srr"
      style={{ "--c": item.color } as React.CSSProperties}
    >
      <span className="cico">
        <Icon name={item.icon} size={22} />
      </span>
      <div className="srb">
        <div className="srt">
          <h3>
            <Highlight text={item.title} query={query} />
          </h3>
          {item.meta === "Available" && (
            <span className="st2 av">Available</span>
          )}
        </div>
        <p className="srd">
          <Highlight text={item.description} query={query} />
        </p>
        <div className="srm">
          <span
            className="cat"
            style={{ "--c": item.color } as React.CSSProperties}
          >
            {item.label}
          </span>
          {item.meta && item.meta !== "Available" && <span>{item.meta}</span>}
        </div>
      </div>
      <div className="sra">
        <Link href={item.href} className="use">
          {item.type === "tool"
            ? "Open Tool"
            : item.type === "category"
              ? "Explore Category"
              : "Visit Page"}
          <Icon name="arrow" size={16} />
        </Link>
      </div>
    </article>
  );
}
function SidebarGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="gp">
      <div className="gh">{title}</div>
      <div className="search-sidebar-content">{children}</div>
    </div>
  );
}
function EmptyQuery({ onSearch }: { onSearch: (term: string) => void }) {
  return (
    <div className="es">
      <div className="ei">
        <Icon name="search" size={28} />
      </div>
      <h3>What Are You Looking For?</h3>
      <p>Search available tools, categories or helpful resources.</p>
      <div className="pop">
        <span>Try:</span>
        {popular.slice(0, 3).map((term) => (
          <button className="chip" key={term} onClick={() => onSearch(term)}>
            {term}
          </button>
        ))}
      </div>
      <Link href="/tools" className="btn">
        Browse All Tools
      </Link>
    </div>
  );
}
function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="es">
      <div className="ei">
        <Icon name="search" size={28} />
      </div>
      <h3>No results found.</h3>
      <p>Check the spelling, try shorter keywords or browse available tools.</p>
      <div className="bs">
        <button className="btn pr" onClick={onClear}>
          Clear Search
        </button>
        <Link href="/tools" className="btn">
          Explore All Tools
        </Link>
        <Link href="/contact?inquiry=feature-request" className="btn">
          Suggest a Tool
        </Link>
      </div>
    </div>
  );
}
function FilteredEmpty({ onReset }: { onReset: () => void }) {
  return (
    <div className="es">
      <div className="ei">
        <Icon name="search" size={28} />
      </div>
      <h3>No results in this content type.</h3>
      <p>Try another tab or clear the active filters.</p>
      <button className="btn pr" onClick={onReset}>
        Clear Filters
      </button>
    </div>
  );
}
