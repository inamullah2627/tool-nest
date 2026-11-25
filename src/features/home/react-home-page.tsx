"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePreferences } from "@/components/providers/app-providers";
import { categories, categoryMap, tools } from "@/data/tools";
import type { CategoryId, Tool } from "@/types/tool";
import { DesignFooter, DesignHeader } from "@/components/design/site-shell";
import { Icon, type IconName } from "@/components/design/icon";

export const categoryIcons: Record<CategoryId, IconName> = {
  developer: "code",
  text: "type",
  seo: "search",
  image: "image",
  pdf: "file",
  calculators: "calc",
};
const popularIds = [
  "json-formatter",
  "word-counter",
  "css-minifier",
  "meta-tag-generator",
  "base64-encoder-decoder",
  "case-converter",
  "keyword-density-checker",
  "url-slug-generator",
];
const faqs = [
  [
    "Is ToolNest completely free?",
    "Yes. The tools on ToolNest are free to use, and there are no subscription plans. We may show unobtrusive advertising in the future to help cover running costs.",
  ],
  [
    "Do I need to create an account?",
    "No. You can open a tool and start using it right away, without registering.",
  ],
  [
    "Is my data safe when using ToolNest?",
    "Where a tool supports it, processing happens directly in your browser. Even so, we recommend avoiding passwords, private keys or other highly sensitive information in any online tool.",
  ],
  [
    "Can I use ToolNest on mobile devices?",
    "Yes. The interface is responsive and designed to work on phones, tablets and desktop screens.",
  ],
  [
    "Are new tools added regularly?",
    "We plan to keep expanding the collection, starting with Developer, Text and SEO tools, with Image, PDF and Calculator categories to follow.",
  ],
  [
    "Can I suggest a new tool?",
    "Absolutely. Use the Suggest a Tool link to tell us what would make your work easier, and we will consider it for future releases.",
  ],
] as const;

const detailedToolIcons: Partial<Record<Tool["iconKey"], IconName>> = {
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
};

export function ExactToolCard({
  tool,
  detailedIcon = false,
}: {
  tool: Tool;
  detailedIcon?: boolean;
}) {
  const { favorites, toggleFavorite, recordRecent } = usePreferences();
  const category = categoryMap[tool.category];
  const favorite = favorites.includes(tool.id);
  return (
    <article
      className="tc"
      style={{ "--c": category.color } as React.CSSProperties}
    >
      <div className="top">
        <span className="cico">
          <Icon
            name={
              detailedIcon
                ? (detailedToolIcons[tool.iconKey] ??
                  categoryIcons[tool.category])
                : tool.iconKey === "Link" || tool.iconKey === "Braces"
                  ? (detailedToolIcons[tool.iconKey] ??
                    categoryIcons[tool.category])
                  : categoryIcons[tool.category]
            }
          />
        </span>
        <button
          className="fav"
          aria-pressed={favorite}
          aria-label={`Favorite ${tool.name}`}
          onClick={() => toggleFavorite(tool.id)}
        >
          <Icon name="heart" size={18} />
        </button>
      </div>
      <h3>{tool.name}</h3>
      <p>{tool.shortDescription}</p>
      <span className="cat">{category.shortName} Tools</span>
      <button className="use" onClick={() => recordRecent(tool.id)}>
        Use Tool <Icon name="arrow" size={16} />
      </button>
    </article>
  );
}

function CategoryBento() {
  return (
    <div className="bento">
      {categories.map((category) => {
        const count = tools.filter(
          (tool) => tool.category === category.id,
        ).length;
        const sizes: Record<CategoryId, React.CSSProperties> = {
          developer: { gridColumn: "span 3", gridRow: "span 2" },
          text: { gridColumn: "span 3" },
          seo: { gridColumn: "span 3" },
          image: { gridColumn: "span 2" },
          pdf: { gridColumn: "span 2" },
          calculators: { gridColumn: "span 2" },
        };
        const content = (
          <>
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
              {!category.active && <span className="soon">Coming Soon</span>}
            </div>
            <h3 style={{ zIndex: 1 }}>{category.name}</h3>
            <p style={{ zIndex: 1 }}>{category.description}</p>
            {category.id === "developer" && (
              <pre className="code">
                <b>{"{"}</b>
                {`\n  "tool": `}
                <b>&quot;json&quot;</b>
                {`,\n  "indent": 2\n`}
                <b>{"}"}</b>
              </pre>
            )}
            {category.id === "text" && (
              <>
                <div className="bars">
                  <i />
                  <i style={{ width: "90%" }} />
                  <i style={{ width: "70%" }} />
                </div>
                <span
                  className="mini"
                  style={{
                    alignSelf: "flex-start",
                    zIndex: 1,
                    fontFamily: "var(--mf)",
                  }}
                >
                  128 words
                </span>
              </>
            )}
            {category.id === "seo" && (
              <div className="bars">
                <i style={{ width: "55%" }} />
                <i />
                <i style={{ width: "80%" }} />
              </div>
            )}
            {category.active && (
              <span className="go">
                Browse {count} tools <Icon name="arrow" size={18} />
              </span>
            )}
          </>
        );
        const style = {
          "--c": category.color,
          ...sizes[category.id],
        } as React.CSSProperties;
        return category.active ? (
          <Link
            href={`/tools?category=${category.id}`}
            className="bc"
            style={style}
            key={category.id}
          >
            {content}
          </Link>
        ) : (
          <div className="bc off" style={style} key={category.id}>
            {content}
          </div>
        );
      })}
    </div>
  );
}

export function ReactHomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | CategoryId>("all");
  const [openFaq, setOpenFaq] = useState(0);
  const shown =
    tab === "all" ? tools : tools.filter((tool) => tool.category === tab);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    router.push(`/tools${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  };
  return (
    <div className="page-home">
      <DesignHeader />
      <main>
        <section className="hero" id="home">
          <div
            className="fl"
            style={
              { "--c": "#4F46E5", left: "9%", top: 90 } as React.CSSProperties
            }
          >
            <Icon name="code" size={22} />
          </div>
          <div
            className="fl"
            style={
              {
                "--c": "#9333EA",
                left: "16%",
                top: 300,
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
                right: "10%",
                top: 110,
                animationDelay: "-1s",
              } as React.CSSProperties
            }
          >
            <Icon name="search" size={22} />
          </div>
          <div
            className="fl"
            style={
              {
                "--c": "#0284C7",
                right: "17%",
                top: 310,
                animationDelay: "-3s",
              } as React.CSSProperties
            }
          >
            <Icon name="calc" size={22} />
          </div>
          <div className="wrap">
            <span className="eyebrow">
              <Icon name="zap" size={14} />
              Your Everyday Digital Toolkit
            </span>
            <h1>
              Every Tool You Need.
              <br />
              <span className="gt">All in One Nest.</span>
            </h1>
            <p className="lead">
              Discover a growing collection of free online tools to simplify
              your work, boost productivity, and get things done faster.
            </p>
            <form className="sw" onSubmit={submit}>
              <div className="sb">
                <span style={{ color: "var(--m)", display: "flex" }}>
                  <Icon name="search" size={22} />
                </span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="text"
                  placeholder="Search for a tool..."
                  autoComplete="off"
                  aria-label="Search for a tool"
                />
                <kbd>Ctrl + K</kbd>
                <button className="btn pr">
                  <span>Search</span>
                  <Icon name="arrow" size={16} />
                </button>
              </div>
            </form>
            <div className="pop">
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
                  onClick={() =>
                    router.push(`/tools?q=${encodeURIComponent(name)}`)
                  }
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="trust">
              {[
                "100% Free",
                "No Registration",
                "Fast & Lightweight",
                "Privacy Focused",
              ].map((label) => (
                <span key={label}>
                  <Icon name="check" size={16} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>
        <section id="categories" style={{ paddingTop: 24 }}>
          <div className="wrap">
            <div className="sh">
              <h2>Find the Right Tool for Every Task</h2>
              <p>
                Explore our collection of tools organized around the way you
                work.
              </p>
            </div>
            <CategoryBento />
          </div>
        </section>
        <section id="popular" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sh">
              <h2>Popular Tools</h2>
              <p>Quick access to useful tools for everyday tasks.</p>
            </div>
            <div className="tg">
              {popularIds.map((id) => (
                <ExactToolCard
                  tool={tools.find((tool) => tool.id === id)!}
                  key={id}
                />
              ))}
            </div>
          </div>
        </section>
        <section
          id="all"
          style={{
            background: "var(--card)",
            borderBlock: "1px solid var(--bd)",
          }}
        >
          <div className="wrap">
            <div className="sh">
              <h2>Your Complete Online Toolkit</h2>
            </div>
            <div className="tabs" role="tablist">
              {[
                ["all", "All Tools"],
                ["developer", "Developer"],
                ["text", "Text"],
                ["seo", "SEO"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(id as typeof tab)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="rg">
              {shown.map((tool) => {
                const category = categoryMap[tool.category];
                return (
                  <div
                    className="rw"
                    style={{ "--c": category.color } as React.CSSProperties}
                    key={tool.id}
                  >
                    <span className="cico">
                      <Icon name={categoryIcons[tool.category]} />
                    </span>
                    <div>
                      <div className="n">{tool.name}</div>
                      <span className="cat">{category.shortName}</span>
                    </div>
                    <Icon name="arrow" size={16} />
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <Link href="/tools" className="btn">
                View All Tools
              </Link>
            </div>
          </div>
        </section>
        <section id="about">
          <div className="wrap">
            <div className="sh">
              <h2>Built to Make Your Life Easier</h2>
            </div>
            <div className="fx">
              {[
                [
                  "gift",
                  "Completely Free",
                  "Access useful tools without subscriptions.",
                  "price: free",
                ],
                [
                  "shield",
                  "Privacy Focused",
                  "Designed to process supported tasks directly in your browser.",
                  "in-browser",
                ],
                [
                  "zap",
                  "Lightning Fast",
                  "Lightweight interfaces built for everyday productivity.",
                  "lightweight UI",
                ],
                [
                  "user",
                  "No Account Required",
                  "Start using tools without unnecessary registration.",
                  "open → use",
                ],
              ].map(([icon, title, copy, tag]) => (
                <div className="ft" key={title}>
                  <div className="ti">
                    <Icon name={icon as IconName} size={26} />
                  </div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <span className="mini">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="how" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sh c">
              <h2>Simple Tools. Instant Results.</h2>
            </div>
            <div className="steps">
              {[
                [
                  "cursor",
                  "Choose a Tool",
                  "Find the right tool using search or categories.",
                ],
                [
                  "edit",
                  "Enter Your Data",
                  "Paste your text, enter information or select a file.",
                ],
                [
                  "check",
                  "Get Your Results",
                  "Copy, download or use your results.",
                ],
              ].map(([icon, title, copy], index) => (
                <div className="st" key={title}>
                  <div className="nm">
                    <Icon name={icon as IconName} size={28} />
                    <b>0{index + 1}</b>
                  </div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <BlogSection />
        <section id="faq" style={{ paddingTop: 0 }}>
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
            <div className="cta">
              <h2>Everything You Need to Work Smarter.</h2>
              <p>
                Explore free online tools designed to simplify your everyday
                digital tasks.
              </p>
              <Link href="/tools" className="btn w">
                Explore All Tools
              </Link>
              <a href="#faq" className="sl">
                Suggest a Tool
              </a>
            </div>
          </div>
        </section>
      </main>
      <DesignFooter />
    </div>
  );
}

function BlogSection() {
  const posts = [
    [
      "developer",
      "How to Format and Validate JSON Like a Pro",
      "Learn how clean formatting and validation help you catch errors early and read data with ease.",
      "5 min read",
    ],
    [
      "text",
      "10 Essential Online Tools for Content Creators",
      "A practical shortlist of utilities that speed up writing, editing and publishing workflows.",
      "6 min read",
    ],
    [
      "seo",
      "A Beginner’s Guide to Website Meta Tags",
      "Understand which meta tags matter, what they do, and how to write them for search and sharing.",
      "4 min read",
    ],
  ] as const;
  return (
    <section id="blog" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 48,
          }}
        >
          <div className="sh" style={{ margin: 0 }}>
            <h2>Learn, Explore and Work Smarter</h2>
          </div>
          <span className="btn">View All Articles</span>
        </div>
        <div className="bg3">
          {posts.map(([categoryId, title, copy, time], index) => {
            const category = categoryMap[categoryId];
            return (
              <article
                className="post"
                style={{ "--c": category.color } as React.CSSProperties}
                key={title}
              >
                <BlogArt index={index} />
                <div className="bd">
                  <div className="meta">
                    <b>{category.shortName}</b>
                    <span>{time}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <span className="rd">
                    Read Article <Icon name="arrow" size={16} />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BlogArt({ index }: { index: number }) {
  if (index === 0)
    return (
      <svg
        className="th"
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Abstract illustration"
      >
        <rect width="400" height="200" fill="var(--sub)" />
        <g fill="#4F46E5">
          <rect x="60" y="34" width="120" height="14" rx="7" />
          <rect x="84" y="62" width="170" height="14" rx="7" opacity=".7" />
          <rect x="84" y="90" width="110" height="14" rx="7" fill="#8B5CF6" />
          <rect x="108" y="118" width="190" height="14" rx="7" opacity=".5" />
          <rect x="60" y="146" width="80" height="14" rx="7" />
        </g>
        <circle cx="330" cy="60" r="34" fill="#8B5CF6" opacity=".25" />
      </svg>
    );
  if (index === 1)
    return (
      <svg
        className="th"
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Abstract illustration"
      >
        <rect width="400" height="200" fill="var(--sub)" />
        <circle cx="150" cy="100" r="62" fill="#9333EA" opacity=".25" />
        <circle cx="220" cy="100" r="62" fill="#4F46E5" opacity=".25" />
        <circle cx="290" cy="100" r="62" fill="#059669" opacity=".25" />
        <g fill="none" stroke="var(--p)" strokeWidth="3" strokeLinecap="round">
          <path d="M120 100h60M190 80v40M250 100h80" />
        </g>
      </svg>
    );
  return (
    <svg
      className="th"
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Abstract illustration"
    >
      <rect width="400" height="200" fill="var(--sub)" />
      <rect
        x="70"
        y="32"
        width="260"
        height="136"
        rx="14"
        fill="var(--card)"
        stroke="var(--bd)"
        strokeWidth="2"
      />
      <path d="M70 62h260" stroke="var(--bd)" strokeWidth="2" />
      <g fill="#8B5CF6">
        <circle cx="92" cy="47" r="5" />
        <circle cx="110" cy="47" r="5" opacity=".6" />
      </g>
      <g fontFamily="JetBrains Mono,monospace" fontSize="12" fill="var(--m)">
        <text x="92" y="92">
          &lt;title&gt;
        </text>
        <text x="92" y="116" fill="#059669">
          &lt;meta name=&quot;…&quot;&gt;
        </text>
        <text x="92" y="140">
          &lt;link rel=&quot;…&quot;&gt;
        </text>
      </g>
    </svg>
  );
}
