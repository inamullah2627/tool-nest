"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { DesignFooter, DesignHeader } from "@/components/design/site-shell";
import { Icon } from "@/components/design/icon";
import {
  categories,
  categoryMap,
  plannedCategoryTools,
  tools,
} from "@/data/tools";
import { categoryIcons, ExactToolCard } from "@/features/home/react-home-page";

const recommendedIds = ["json-formatter", "word-counter", "meta-tag-generator"];
const recommendedTools = recommendedIds.flatMap((id) => {
  const tool = tools.find((item) => item.id === id);
  return tool ? [tool] : [];
});

export function NotFoundPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    const replaceMissingUrl = window.setTimeout(() => {
      if (window.location.pathname !== "/404") {
        window.History.prototype.replaceState.call(
          window.history,
          window.history.state,
          "",
          "/404",
        );
      }
    }, 0);
    return () => window.clearTimeout(replaceMissingUrl);
  }, []);
  const matches = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    const source = needle
      ? tools.filter((tool) =>
          [
            tool.name,
            tool.shortDescription,
            categoryMap[tool.category].name,
            ...tool.keywords,
          ]
            .join(" ")
            .toLocaleLowerCase()
            .includes(needle),
        )
      : recommendedTools;
    return source.slice(0, 7);
  }, [query]);

  const submitSearch = (event?: FormEvent) => {
    event?.preventDefault();
    const value = query.trim();
    if (value) router.push(`/tools?q=${encodeURIComponent(value)}`);
  };

  const goBack = () => {
    try {
      const referrer = document.referrer ? new URL(document.referrer) : null;
      if (
        window.history.length > 1 &&
        referrer?.origin === window.location.origin
      ) {
        router.back();
        return;
      }
    } catch {}
    router.push("/");
  };

  return (
    <div className="not-found-page">
      <DesignHeader />
      <main>
        <section className="hero nfh">
          <div className="wrap">
            <ErrorIllustration />
            <span className="eyebrow">ERROR 404</span>
            <h1>Oops! Page Not Found</h1>
            <p className="lead">
              The page you’re looking for may have been moved, removed or never
              existed. Don’t worry — there’s still plenty to explore on
              ToolNest.
            </p>
            <div className="nfa">
              <Link href="/" className="btn pr">
                <Icon name="home" size={16} /> Back to Homepage
              </Link>
              <Link href="/tools" className="btn">
                <Icon name="grid" size={16} /> Explore All Tools
              </Link>
              <button className="sl" type="button" onClick={goBack}>
                <Icon name="arrowLeft" size={16} /> Go Back
              </button>
            </div>
          </div>
        </section>

        <section className="nfs">
          <div className="wrap">
            <h2>Looking for Something Specific?</h2>
            <p>Search for a tool, category or helpful resource.</p>
            <form className="sw" onSubmit={submitSearch}>
              <div className="sb">
                <span className="nf-search-icon">
                  <Icon name="search" size={22} />
                </span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => window.setTimeout(() => setFocused(false), 120)}
                  placeholder="Search tools, articles and more..."
                  autoComplete="off"
                  role="combobox"
                  aria-expanded={focused}
                  aria-controls="not-found-suggestions"
                  aria-autocomplete="list"
                  aria-label="Search tools, articles and more"
                />
                {query && (
                  <button
                    className="ib"
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setQuery("")}
                  >
                    <Icon name="x" size={18} />
                  </button>
                )}
                <button className="btn pr" type="submit">
                  Search
                </button>
              </div>
              {focused && (
                <div
                  className="sg open"
                  id="not-found-suggestions"
                  role="listbox"
                >
                  <div className="h">
                    {query.trim() ? "Matching tools" : "Popular tools"}
                  </div>
                  {matches.length ? (
                    matches.map((tool) => (
                      <Link
                        key={tool.id}
                        role="option"
                        aria-selected="false"
                        href={
                          tool.implementationStatus === "operational"
                            ? `/tools/${tool.slug}`
                            : `/tools?q=${encodeURIComponent(tool.name)}`
                        }
                        className="nf-suggestion"
                      >
                        <span
                          className="cico"
                          style={
                            {
                              "--c": categoryMap[tool.category].color,
                            } as React.CSSProperties
                          }
                        >
                          <Icon name={categoryIcons[tool.category]} size={16} />
                        </span>
                        {tool.name}
                        <small>{categoryMap[tool.category].shortName}</small>
                      </Link>
                    ))
                  ) : (
                    <p className="nf-no-results">
                      No tools match “{query.trim()}”. Try another keyword.
                    </p>
                  )}
                </div>
              )}
            </form>
          </div>
        </section>

        <section className="nf-tools">
          <div className="wrap">
            <div className="sh c">
              <span className="eyebrow">EXPLORE OUR TOOLS</span>
              <h2>Discover Useful Tools</h2>
              <p>
                Get back on track with some of our featured online utilities.
              </p>
            </div>
            <div className="bg3">
              {recommendedTools.map((tool) => (
                <ExactToolCard key={tool.id} tool={tool} detailedIcon />
              ))}
            </div>
            <div className="nf-centered">
              <Link href="/tools" className="btn">
                View All Tools
              </Link>
            </div>
          </div>
        </section>

        <section className="nf-categories">
          <div className="wrap">
            <div className="sh c">
              <h2>Explore by Category</h2>
            </div>
            <div className="nfg">
              {categories.map((category) => {
                const count = [...tools, ...plannedCategoryTools].filter(
                  (tool) => tool.category === category.id,
                ).length;
                return (
                  <Link
                    key={category.id}
                    href={`/tools/category/${category.id}`}
                    className={category.active ? "bc" : "bc off"}
                    style={{ "--c": category.color } as React.CSSProperties}
                  >
                    <span className="cico">
                      <Icon name={categoryIcons[category.id]} size={22} />
                    </span>
                    <h3>{category.name}</h3>
                    {category.active ? (
                      <span className="go">
                        {count} tools <Icon name="arrow" size={16} />
                      </span>
                    ) : (
                      <span className="soon">Coming Soon</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="nf-help">
          <div className="wrap">
            <div className="nfk">
              <span
                className="cico"
                style={{ "--c": "#4F46E5" } as React.CSSProperties}
              >
                <Icon name="help" size={22} />
              </span>
              <div>
                <h3>Think Something Is Wrong?</h3>
                <p>
                  If you followed a broken link or expected to find a page here,
                  let us know so we can improve ToolNest.
                </p>
              </div>
              <Link href="/contact?inquiry=report-a-bug" className="btn">
                Report a Broken Link
              </Link>
            </div>
          </div>
        </section>
      </main>
      <DesignFooter />
    </div>
  );
}

function ErrorIllustration() {
  return (
    <div
      className="nfv"
      role="img"
      aria-label="Large 404 with floating tool icons"
    >
      <svg viewBox="0 0 560 220" aria-hidden="true">
        <defs>
          <linearGradient id="not-found-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--p)" />
            <stop offset="1" stopColor="var(--ac)" />
          </linearGradient>
        </defs>
        <circle cx="280" cy="110" r="96" fill="var(--sub)" />
        <g
          fontFamily="var(--hf)"
          fontWeight="800"
          fontSize="190"
          textAnchor="middle"
          fill="url(#not-found-gradient)"
        >
          <text x="116" y="170">
            4
          </text>
          <text x="444" y="170">
            4
          </text>
        </g>
        <circle
          cx="280"
          cy="108"
          r="54"
          fill="none"
          stroke="url(#not-found-gradient)"
          strokeWidth="26"
        />
      </svg>
      <FloatingIcon name="code" color="#4F46E5" className="nf-fl-a" />
      <FloatingIcon name="type" color="#9333EA" className="nf-fl-b" />
      <FloatingIcon name="search" color="#059669" className="nf-fl-c" />
      <FloatingIcon name="image" color="#EA580C" className="nf-fl-d" />
      <FloatingIcon name="file" color="#DC2626" className="nf-fl-e" />
      <FloatingIcon name="calc" color="#0284C7" className="nf-fl-f" />
    </div>
  );
}

function FloatingIcon({
  name,
  color,
  className,
}: {
  name: "code" | "type" | "search" | "image" | "file" | "calc";
  color: string;
  className: string;
}) {
  return (
    <span
      className={`fl ${className}`}
      style={{ "--c": color } as React.CSSProperties}
    >
      <Icon name={name} size={20} />
    </span>
  );
}
