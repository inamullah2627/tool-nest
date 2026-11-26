"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { DesignFooter, DesignHeader } from "@/components/design/site-shell";
import { Icon } from "@/components/design/icon";
import { usePreferences } from "@/components/providers/app-providers";
import { categories, categoryMap, tools } from "@/data/tools";
import type { CategoryId } from "@/types/tool";
import { categoryIcons, ExactToolCard } from "@/features/home/react-home-page";

type QuickFilter = "all" | "favorites" | "recent";
const upcoming = {
  image: ["Image Compressor", "WebP Converter", "Image Resizer"],
  pdf: ["PDF Merger", "PDF Splitter", "PDF Compressor"],
  calculators: ["Age Calculator", "BMI Calculator", "Loan Calculator"],
} as const;
const faqs = [
  [
    "Are all ToolNest tools free to use?",
    "Yes. Every tool listed here is free to use, and no subscription is required.",
  ],
  [
    "How do I find the right tool?",
    "Use the search field, pick a category, or combine filters and sorting to narrow the directory.",
  ],
  [
    "Do I need to download any software?",
    "No. The tools are designed to run in your web browser, so nothing needs to be installed.",
  ],
  [
    "Can I use these tools on my phone?",
    "Yes. The layout adapts to phones and tablets, with touch-friendly controls.",
  ],
  [
    "Can I save my favorite tools?",
    "Yes. Tap the heart on any tool card, then use the Favorites filter to find it again.",
  ],
  [
    "Will more tools be added in the future?",
    "We plan to expand the collection over time, including Image, PDF and Calculator categories. No release dates have been set.",
  ],
] as const;

export function ReactToolsPage() {
  const params = useSearchParams();
  const { favorites, recent } = usePreferences();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState<"all" | CategoryId>(
    (params.get("category") as CategoryId) ?? "all",
  );
  const [quick, setQuick] = useState<QuickFilter>("all");
  const [availability, setAvailability] = useState<"now" | "soon">(
    params.get("availability") === "soon" ? "soon" : "now",
  );
  const [sort, setSort] = useState("rec");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const filtered = useMemo(() => {
    let result = [...tools];
    if (category !== "all")
      result = result.filter((tool) => tool.category === category);
    if (quick === "favorites")
      result = result.filter((tool) => favorites.includes(tool.id));
    if (quick === "recent")
      result = result
        .filter((tool) => recent.includes(tool.id))
        .sort((a, b) => recent.indexOf(a.id) - recent.indexOf(b.id));
    const needle = query.toLowerCase().trim();
    if (needle)
      result = result.filter((tool) =>
        [
          tool.name,
          tool.shortDescription,
          ...tool.keywords,
          categoryMap[tool.category].name,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle),
      );
    if (sort === "az") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") result.sort((a, b) => b.name.localeCompare(a.name));
    return result;
  }, [category, quick, query, sort, favorites, recent]);
  const reset = () => {
    setQuery("");
    setCategory("all");
    setQuick("all");
    setAvailability("now");
    setSort("rec");
  };
  const filters = (
    <>
      <FilterGroup
        title="Categories"
        options={[
          ["all", "All Tools", "grid"],
          ["developer", "Developer Tools", "code"],
          ["text", "Text Tools", "type"],
          ["seo", "SEO Tools", "search"],
        ]}
        current={category}
        onChange={(value) => {
          setCategory(value as typeof category);
          setAvailability("now");
        }}
      />
      <FilterGroup
        title="Quick Access"
        options={[
          ["all", "All Available Tools", "zap"],
          ["favorites", "Favorites", "heart"],
          ["recent", "Recently Used", "clock"],
        ]}
        current={quick}
        onChange={(value) => setQuick(value as QuickFilter)}
      />
      <FilterGroup
        title="Availability"
        options={[
          ["now", "Available Now", "check"],
          ["soon", "Coming Soon", "clock"],
        ]}
        current={availability}
        onChange={(value) => setAvailability(value as typeof availability)}
      />
      <button
        className="btn"
        style={{ width: "100%", justifyContent: "center" }}
        onClick={reset}
      >
        Clear Filters
      </button>
    </>
  );
  const resultTitle =
    availability === "soon"
      ? "Coming Soon"
      : quick === "favorites"
        ? "Favorites"
        : quick === "recent"
          ? "Recently Used"
          : category === "all"
            ? "All Tools"
            : categoryMap[category].name;
  return (
    <div className="page-tools">
      <DesignHeader />
      <main>
        <section className="hero ph">
          <div
            className="fl"
            style={
              { "--c": "#4F46E5", right: "9%", top: 60 } as React.CSSProperties
            }
          >
            <Icon name="braces" size={22} />
          </div>
          <div
            className="fl"
            style={
              {
                "--c": "#9333EA",
                right: "20%",
                top: 130,
                animationDelay: "-2s",
              } as React.CSSProperties
            }
          >
            <Icon name="type" size={22} />
          </div>
          <div
            className="fl"
            style={
              {
                "--c": "#059669",
                right: "6%",
                top: 160,
                animationDelay: "-1s",
              } as React.CSSProperties
            }
          >
            <Icon name="search" size={22} />
          </div>
          <div className="wrap">
            <nav className="bcr" aria-label="Breadcrumb">
              <Link href="/">
                <Icon name="home" size={14} />
                Home
              </Link>
              <span>/</span>
              <span aria-current="page">All Tools</span>
            </nav>
            <span className="eyebrow">
              <Icon name="zap" size={14} />
              YOUR DIGITAL TOOLKIT
            </span>
            <h1>Explore All Tools</h1>
            <p className="lead">
              Discover free, powerful and easy-to-use online tools designed to
              simplify your everyday digital tasks.
            </p>
            <div className="trust">
              {[
                "15 Available Tools",
                "3 Active Categories",
                "Free to Use",
                "No Registration",
              ].map((label) => (
                <span key={label}>
                  <Icon name="check" size={16} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>
        <section style={{ padding: "32px 0 0" }}>
          <div className="wrap">
            <div className="sw" style={{ maxWidth: "none" }}>
              <div className="sb">
                <span style={{ color: "var(--m)", display: "flex" }}>
                  <Icon name="search" size={22} />
                </span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="text"
                  placeholder="Search tools by name, category or keyword..."
                  autoComplete="off"
                  aria-label="Search tools"
                />
                {query && (
                  <button
                    className="ib"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                  >
                    <Icon name="x" size={18} />
                  </button>
                )}
                <kbd>Ctrl + K</kbd>
              </div>
            </div>
            <div
              className="pop"
              style={{ justifyContent: "flex-start", margin: "16px 0 0" }}
            >
              <span>Popular:</span>
              {[
                "JSON Formatter",
                "Word Counter",
                "Meta Tag Generator",
                "CSS Minifier",
              ].map((name) => (
                <button
                  className="chip"
                  key={name}
                  onClick={() => setQuery(name)}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="cn">
              <CategoryButton
                label="All Tools"
                sub="15 tools"
                icon="grid"
                active={category === "all" && availability === "now"}
                onClick={() => {
                  setCategory("all");
                  setAvailability("now");
                }}
              />
              {categories.map((item) => (
                <CategoryButton
                  key={item.id}
                  label={item.name}
                  sub={item.active ? "5 tools" : "Coming Soon"}
                  icon={categoryIcons[item.id]}
                  color={item.color}
                  active={category === item.id && availability === "now"}
                  onClick={() =>
                    item.active
                      ? (setCategory(item.id), setAvailability("now"))
                      : setAvailability("soon")
                  }
                />
              ))}
            </div>
          </div>
        </section>
        <section style={{ padding: "32px 0 96px" }}>
          <div className="wrap">
            <div className="dir">
              <aside className="sd" aria-label="Filters">
                {filters}
              </aside>
              <div style={{ minWidth: 0 }}>
                <div className="tb">
                  <div>
                    <h2 style={{ fontSize: 24, fontWeight: 600 }}>
                      {resultTitle}
                    </h2>
                    <span style={{ fontSize: 14, color: "var(--m)" }}>
                      {availability === "soon" ? 9 : filtered.length}{" "}
                      {availability === "soon" ? "upcoming " : ""}tools
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
                    <button
                      className="btn fbtn"
                      onClick={() => setFiltersOpen(true)}
                    >
                      <Icon name="sliders" size={16} />
                      Filters
                    </button>
                    <select
                      className="sel"
                      value={sort}
                      onChange={(event) => setSort(event.target.value)}
                      aria-label="Sort tools"
                    >
                      <option value="rec">Recommended</option>
                      <option value="az">Name: A–Z</option>
                      <option value="za">Name: Z–A</option>
                    </select>
                    <div className="vt">
                      <button
                        aria-pressed={view === "grid"}
                        onClick={() => setView("grid")}
                        aria-label="Grid view"
                      >
                        <Icon name="grid" size={18} />
                      </button>
                      <button
                        aria-pressed={view === "list"}
                        onClick={() => setView("list")}
                        aria-label="List view"
                      >
                        <Icon name="list" size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                {availability === "soon" ? (
                  <UpcomingGrid view={view} />
                ) : filtered.length ? (
                  <div className={`tg ${view === "list" ? "lv" : ""}`}>
                    {filtered.map((tool) => (
                      <ExactToolCard tool={tool} detailedIcon key={tool.id} />
                    ))}
                  </div>
                ) : (
                  <EmptyState reset={reset} quick={quick} />
                )}
              </div>
            </div>
          </div>
        </section>
        <ComingSoon />
        <Editorial />
        <section style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sh c">
              <h2>Frequently Asked Questions</h2>
            </div>
            <div className="faq">
              {faqs.map(([question, answer], index) => (
                <div
                  className={`qi ${openFaq === index ? "open" : ""}`}
                  key={question}
                >
                  <button
                    aria-expanded={openFaq === index}
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  >
                    {question}
                    <Icon name="plus" size={20} />
                  </button>
                  <p className="qa">{answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section style={{ padding: 0 }}>
          <div className="wrap">
            <div className="cta" style={{ padding: "56px 32px" }}>
              <h2 style={{ fontSize: 36 }}>Can’t Find the Tool You Need?</h2>
              <p>
                We’re always looking for new ways to make your everyday tasks
                easier. Tell us what tool you would like to see next.
              </p>
              <Link href="/contact?inquiry=suggest-a-tool" className="btn w">
                Suggest a Tool
              </Link>
              <Link href="/contact" className="sl">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <DesignFooter />
      {filtersOpen && (
        <div className="drawer open">
          <button
            className="bk"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <aside>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <h3 style={{ fontSize: 20 }}>Filters</h3>
              <button className="ib" onClick={() => setFiltersOpen(false)}>
                <Icon name="x" />
              </button>
            </div>
            {filters}
            <button
              className="btn pr"
              onClick={() => setFiltersOpen(false)}
              style={{ width: "100%", justifyContent: "center", marginTop: 16 }}
            >
              Show {availability === "soon" ? 9 : filtered.length} tools
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

function FilterGroup({
  title,
  options,
  current,
  onChange,
}: {
  title: string;
  options: readonly string[][];
  current: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="gp">
      <div className="gh">{title}</div>
      {options.map(([value, label, icon]) => (
        <button
          className="fo"
          aria-pressed={current === value}
          onClick={() => onChange(value)}
          key={value}
        >
          <span className="fi">
            <Icon name={icon as Parameters<typeof Icon>[0]["name"]} size={16} />
          </span>
          {label}
        </button>
      ))}
    </div>
  );
}
function CategoryButton({
  label,
  sub,
  icon,
  color = "var(--p)",
  active,
  onClick,
}: {
  label: string;
  sub: string;
  icon: Parameters<typeof Icon>[0]["name"];
  color?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="cb"
      style={{ "--c": color } as React.CSSProperties}
      aria-pressed={active}
      onClick={onClick}
    >
      <span className="cico">
        <Icon name={icon} size={18} />
      </span>
      <span>
        <b>{label}</b>
        <small>{sub}</small>
      </span>
    </button>
  );
}
function UpcomingGrid({ view }: { view: "grid" | "list" }) {
  return (
    <div className={`tg ${view === "list" ? "lv" : ""}`}>
      {Object.entries(upcoming).flatMap(([categoryId, names]) =>
        names.map((name) => {
          const category = categoryMap[categoryId as CategoryId];
          return (
            <article
              className="tc"
              style={{ "--c": category.color } as React.CSSProperties}
              key={name}
            >
              <div className="top">
                <span className="cico">
                  <Icon name={categoryIcons[category.id]} />
                </span>
                <span className="soon">Coming Soon</span>
              </div>
              <h3>{name}</h3>
              <p>Planned for an upcoming release.</p>
              <span className="cat">{category.shortName} Tools</span>
            </article>
          );
        }),
      )}
    </div>
  );
}
function EmptyState({
  reset,
  quick,
}: {
  reset: () => void;
  quick: QuickFilter;
}) {
  return (
    <div className="es">
      <div className="ei">
        <Icon
          name={
            quick === "favorites"
              ? "heart"
              : quick === "recent"
                ? "clock"
                : "search"
          }
          size={28}
        />
      </div>
      <h3>
        {quick === "favorites"
          ? "Your favorite tools live here"
          : quick === "recent"
            ? "No recently used tools yet"
            : "No tools found"}
      </h3>
      <p>
        {quick === "favorites"
          ? "Tap the heart on any tool to save it here for quick access."
          : quick === "recent"
            ? "Tools you open will appear here so you can jump back in quickly."
            : "Try a different keyword or adjust your filters."}
      </p>
      <button className="btn pr" onClick={reset}>
        Reset Filters
      </button>
    </div>
  );
}
function ComingSoon() {
  return (
    <section>
      <div className="wrap">
        <div className="sh c">
          <h2>More Powerful Tools Are on the Way</h2>
        </div>
        <div className="bento">
          {categories
            .filter((item) => !item.active)
            .map((category) => (
              <div
                className="bc off"
                style={
                  {
                    "--c": category.color,
                    gridColumn: "span 2",
                    minHeight: 240,
                  } as React.CSSProperties
                }
                key={category.id}
              >
                <span className="wm">
                  <Icon name={categoryIcons[category.id]} size={96} />
                </span>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    zIndex: 1,
                  }}
                >
                  <span className="cico">
                    <Icon name={categoryIcons[category.id]} size={22} />
                  </span>
                  <span className="soon">Coming Soon</span>
                </div>
                <h3 style={{ zIndex: 1 }}>{category.name}</h3>
                <p style={{ zIndex: 1 }}>{category.description}</p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    zIndex: 1,
                    marginTop: "auto",
                  }}
                >
                  {upcoming[category.id as keyof typeof upcoming].map(
                    (name) => (
                      <span className="mini" key={name}>
                        {name}
                      </span>
                    ),
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
function Editorial() {
  return (
    <section style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="ed">
          <h2>Free Online Tools for Every Workflow</h2>
          <div>
            <p>
              ToolNest brings together practical online tools for developers,
              designers, students, marketers and content creators. Instead of
              hunting for a different site each time, you can format code, clean
              up text or prepare SEO metadata from one familiar place.
            </p>
            <p>
              Where a tool supports it, processing happens directly in your
              browser, so there is nothing to install. Open a tool, paste your
              input and copy the result in moments.
            </p>
            <p>
              Every tool is free and does not require registration. We are
              starting with Developer, Text and SEO tools, with more categories
              planned over time.
            </p>
            <ul>
              {[
                "Built for quick, everyday tasks",
                "No installation or sign-up needed",
                "Works across desktop, tablet and mobile",
              ].map((label) => (
                <li key={label}>
                  <Icon name="check" size={18} />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
