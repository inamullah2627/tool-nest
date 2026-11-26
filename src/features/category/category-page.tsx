"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { DesignFooter, DesignHeader } from "@/components/design/site-shell";
import { Icon, type IconName } from "@/components/design/icon";
import { usePreferences } from "@/components/providers/app-providers";
import {
  categories,
  categoryMap,
  plannedCategoryTools,
  tools,
} from "@/data/tools";
import type { Tool } from "@/types/tool";
import { categoryConfigs } from "./category-config";

const categoryIcons = {
  developer: "code",
  text: "type",
  seo: "search",
  image: "image",
  pdf: "file",
  calculators: "calc",
} as const;
const toolIcons: Record<string, IconName> = {
  Braces: "braces",
  CodeXml: "html",
  Minimize2: "min",
  Binary: "bin",
  Link: "link",
  Hash: "hash",
  CaseSensitive: "case",
  CopyMinus: "copy",
  Sparkles: "spark",
  AlignLeft: "align",
  Tags: "tag",
  ChartNoAxesColumnIncreasing: "bar",
  Route: "route",
  Bot: "bot",
  Share2: "share",
  Maximize2: "maximize",
  Crop: "crop",
  Image: "image",
  Repeat2: "repeat",
  Layers: "layers",
  Scissors: "scissors",
  FileText: "file",
  LayoutGrid: "grid",
  CalendarDays: "calendar",
  Heart: "heart",
  Percent: "percent",
  Wallet: "wallet",
  Clock3: "clock",
};

type CategoryTool = Pick<
  Tool,
  "id" | "slug" | "name" | "shortDescription" | "category" | "iconKey" | "group"
> & { implementationStatus?: Tool["implementationStatus"] };

export function CategoryPage({ slug }: { slug: keyof typeof categoryConfigs }) {
  const config = categoryConfigs[slug];
  const category = categoryMap[slug];
  const { favorites, toggleFavorite } = usePreferences();
  const sectionRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [sort, setSort] = useState("recommended");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [openFaq, setOpenFaq] = useState(0);
  const source: CategoryTool[] = config.comingSoon
    ? plannedCategoryTools.filter((tool) => tool.category === slug)
    : tools.filter((tool) => tool.category === slug);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const result = source.filter(
      (tool) =>
        (group === "all" || tool.group === group) &&
        (!term ||
          `${tool.name} ${tool.shortDescription} ${tool.group}`
            .toLowerCase()
            .includes(term)),
    );
    return sort === "recommended"
      ? result
      : [...result].sort(
          (a, b) => a.name.localeCompare(b.name) * (sort === "az" ? 1 : -1),
        );
  }, [group, query, sort, source]);

  return (
    <div
      className="cpg"
      style={{ "--c": category.color } as React.CSSProperties}
    >
      <DesignHeader />
      <main>
        <section className="hero ph category-hero">
          <div className="wrap">
            <nav className="bcr" aria-label="Breadcrumb">
              <Link href="/">
                <Icon name="home" size={14} />
                Home
              </Link>
              <Icon name="chev" size={14} />
              <Link href="/tools">All Tools</Link>
              <Icon name="chev" size={14} />
              <span aria-current="page">{category.name}</span>
            </nav>
            <div className="cg">
              <div>
                <span className="cico cbig">
                  <Icon name={categoryIcons[slug]} size={28} />
                </span>
                <div>
                  <span className="eyebrow">
                    <Icon
                      name={
                        config.comingSoon ? categoryIcons[slug] : "terminal"
                      }
                      size={14}
                    />
                    {config.label}
                  </span>
                  {config.comingSoon && (
                    <span className="soon category-soon">Coming Soon</span>
                  )}
                </div>
                <h1>{config.heading}</h1>
                <p className="lead">{config.lead}</p>
                <button
                  className="btn pr"
                  onClick={() =>
                    sectionRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {config.button}
                  <Icon name="arrow" size={16} />
                </button>
                <div className="trust category-trust">
                  {(config.comingSoon
                    ? ["Coming Soon", "Planned Utilities", "Not Yet Available"]
                    : [
                        "Free to Use",
                        "No Registration",
                        "Browser-Based Utilities",
                      ]
                  ).map((item) => (
                    <span key={item}>
                      <Icon name="check" size={16} />
                      {item}
                    </span>
                  ))}
                  <span className="mini">
                    {source.length}{" "}
                    {config.comingSoon
                      ? "planned tools"
                      : "tools in this category"}
                  </span>
                </div>
              </div>
              <CategoryPreview kind={config.preview} />
            </div>
          </div>
        </section>

        <section ref={sectionRef} className="category-directory">
          <div className="wrap">
            <div className="sh">
              <h2>
                {config.exploreHeading ?? `Explore ${category.shortName} Tools`}
              </h2>
              <p>{config.exploreText}</p>
            </div>
            <div className="ctb">
              <div className="sb">
                <Icon name="search" size={20} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={`Search ${category.shortName.toLowerCase()} tools...`}
                  aria-label={`Search ${category.name}`}
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
              </div>
              <select
                className="sel"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                aria-label="Sort tools"
              >
                <option value="recommended">Recommended</option>
                <option value="az">Name: A–Z</option>
                <option value="za">Name: Z–A</option>
              </select>
              <div className="vt">
                <button
                  aria-label="Grid view"
                  aria-pressed={view === "grid"}
                  onClick={() => setView("grid")}
                >
                  <Icon name="grid" size={18} />
                </button>
                <button
                  aria-label="List view"
                  aria-pressed={view === "list"}
                  onClick={() => setView("list")}
                >
                  <Icon name="list" size={18} />
                </button>
              </div>
            </div>
            <div className="ctr">
              <div className="tabs ctabs" role="tablist">
                {["all", ...config.groups].map((item) => (
                  <button
                    key={item}
                    role="tab"
                    aria-selected={group === item}
                    onClick={() => setGroup(item)}
                  >
                    {item === "all" ? "All Tools" : item}
                  </button>
                ))}
              </div>
              <span>
                {filtered.length} {filtered.length === 1 ? "tool" : "tools"}
              </span>
            </div>
            {filtered.length ? (
              <div className={`tg ${view === "list" ? "lv" : ""}`}>
                {filtered.map((tool) => (
                  <CategoryToolCard
                    key={tool.id}
                    tool={tool}
                    comingSoon={config.comingSoon}
                    favorite={favorites.includes(tool.id)}
                    onFavorite={() => toggleFavorite(tool.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="es">
                <span className="ei">
                  <Icon name="search" size={28} />
                </span>
                <h3>No {category.shortName.toLowerCase()} tools found</h3>
                <p>Try a different keyword or select another tool type.</p>
                <button
                  className="btn"
                  onClick={() => {
                    setQuery("");
                    setGroup("all");
                  }}
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="category-block">
          <div className="wrap">
            <div className="sh c">
              <h2>{config.featuresHeading}</h2>
              <p>{config.featuresText}</p>
            </div>
            <div className="fcg">
              {config.features.map(([icon, title, text]) => (
                <article className="tc" key={title}>
                  <span className="cico">
                    <Icon name={icon} size={22} />
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="category-block">
          <div className="wrap">
            <div className="sh c">
              <h2>{config.stepsHeading}</h2>
            </div>
            <div className="steps">
              {config.steps.map(([icon, title, text], index) => (
                <div className="st" key={title}>
                  <div className="nm">
                    <Icon name={icon} size={28} />
                    <b>0{index + 1}</b>
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="category-block">
          <div className="wrap">
            <div className="edu">
              <h2>{config.educationHeading}</h2>
              {config.education.map(([heading, text], index) => (
                <div key={heading}>
                  <h3>{heading}</h3>
                  <p>{text}</p>
                  {index === 2 && (
                    <div className="callout">
                      <Icon name="shieldCheck" size={20} />
                      <p>{config.callout}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section>
          <div className="wrap">
            <div className="category-related-head">
              <div className="sh">
                <h2>Explore More Tool Categories</h2>
                <p>
                  Discover more useful tools for your everyday digital tasks.
                </p>
              </div>
              <Link className="btn" href="/tools">
                Explore All Tools
              </Link>
            </div>
            <div className="rel">
              {categories
                .filter((item) => item.id !== slug)
                .map((item) => (
                  <Link
                    href={`/tools/category/${item.id}`}
                    className={`bc ${item.active ? "" : "off"}`}
                    style={{ "--c": item.color } as React.CSSProperties}
                    key={item.id}
                  >
                    <span className="cico">
                      <Icon name={categoryIcons[item.id]} size={22} />
                    </span>
                    <h3>{item.name}</h3>
                    {item.active ? (
                      <span className="go">
                        {
                          tools.filter((tool) => tool.category === item.id)
                            .length
                        }{" "}
                        tools <Icon name="arrow" size={16} />
                      </span>
                    ) : (
                      <span className="soon">Coming Soon</span>
                    )}
                  </Link>
                ))}
            </div>
          </div>
        </section>
        <section className="category-block">
          <div className="wrap">
            <div className="sh c">
              <h2>{config.faqHeading}</h2>
            </div>
            <div className="faq">
              {config.faqs.map(([question, answer], index) => (
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
        <section className="category-cta">
          <div className="wrap">
            <div className="cta">
              <span className="mono-d category-mono-left">{"{ }"}</span>
              <span className="mono-d category-mono-right">{"</>"}</span>
              <h2>{config.ctaHeading}</h2>
              <p>{config.ctaText}</p>
              <Link href="/tools" className="btn w">
                Explore All Tools
              </Link>
              <Link href="/contact?inquiry=suggest-a-tool" className="sl">
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

function CategoryToolCard({
  tool,
  comingSoon,
  favorite,
  onFavorite,
}: {
  tool: CategoryTool;
  comingSoon: boolean;
  favorite: boolean;
  onFavorite: () => void;
}) {
  return (
    <article className="tc">
      <div className="top">
        <span className="cico">
          <Icon name={toolIcons[tool.iconKey] ?? "code"} />
        </span>
        {comingSoon ? (
          <span className="soon">Coming Soon</span>
        ) : (
          <button
            className="fav"
            aria-label={`Favorite ${tool.name}`}
            aria-pressed={favorite}
            onClick={onFavorite}
          >
            <Icon name="heart" size={18} />
          </button>
        )}
      </div>
      <h3>{tool.name}</h3>
      <p>{tool.shortDescription}</p>
      <span className="cat">{tool.group}</span>
      {!comingSoon &&
        (tool.implementationStatus === "operational" ? (
          <Link className="use" href={`/tools/${tool.slug}`}>
            Use Tool <Icon name="arrow" size={16} />
          </Link>
        ) : (
          <span className="use unavailable">Coming Soon</span>
        ))}
    </article>
  );
}

function CategoryPreview({ kind }: { kind: CategoryConfigPreview }) {
  const names = {
    code: "response.json",
    text: "draft.txt",
    seo: "search-preview",
    image: "preview.png",
    pdf: "documents.pdf",
    calculator: "calculator",
  } as const;
  return (
    <div className="art" aria-hidden="true">
      <div className="ide">
        <div className="ih">
          <i />
          <i />
          <i />
          <span>{names[kind]}</span>
        </div>
        <div className={`category-preview preview-${kind}`}>
          {kind === "code" && (
            <pre>
              <code>{`{\n  "name": "toolnest",\n  "tools": ["json", "html"],\n  "minify": true,\n  "indent": 2\n}`}</code>
            </pre>
          )}
          {kind === "text" && (
            <>
              <div className="row">
                <span className="tag">6 words</span>
                <span className="tag">36 characters</span>
                <span className="tag">1 sentence</span>
              </div>
              <p>
                Great <mark>tools</mark> make simple work <mark>faster</mark>.
              </p>
              <div className="row">
                <span className="tag">UPPERCASE</span>
                <span className="tag">Title Case</span>
              </div>
            </>
          )}
          {kind === "seo" && (
            <>
              <small>example.com › blog › meta-tags</small>
              <h3>Meta Tags Explained for Beginners</h3>
              <p>
                A short, clear <mark>meta description</mark> tells readers what
                a page covers.
              </p>
            </>
          )}
          {kind === "image" && (
            <div className="image-preview">
              <Icon name="image" size={72} />
              <Icon name="arrow" />
              <Icon name="image" size={48} />
            </div>
          )}
          {kind === "pdf" && (
            <div className="pdf-preview">
              {[1, 2, 3].map((item) => (
                <span key={item}>
                  <Icon name="file" size={40} />
                </span>
              ))}
            </div>
          )}
          {kind === "calculator" && (
            <>
              <div className="calc-result">25% of 80 = 20</div>
              <div className="kp">
                {[
                  "7",
                  "8",
                  "9",
                  "÷",
                  "4",
                  "5",
                  "6",
                  "×",
                  "1",
                  "2",
                  "3",
                  "%",
                ].map((key) => (
                  <span key={key}>{key}</span>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="term">
          <span>$</span>{" "}
          {kind === "calculator" ? "calc 25% of 80" : `${kind} --preview`}
          <b />
        </div>
      </div>
    </div>
  );
}

type CategoryConfigPreview =
  (typeof categoryConfigs)[keyof typeof categoryConfigs]["preview"];
