"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DesignFooter, DesignHeader } from "@/components/design/site-shell";
import { Icon } from "@/components/design/icon";
import {
  articleCategories,
  articles,
  type Article,
  type ArticleBlock,
  type ArticleInline,
} from "@/data/articles";
import { categoryMap, tools } from "@/data/tools";
import { ExactToolCard } from "@/features/home/react-home-page";
import { getArticleTableOfContents } from "@/lib/blog/article-content";
import {
  ArticleCard,
  ArticleCoverArt,
  ArticleMetadata,
} from "./blog-components";

export function ArticleLayout({ article }: { article: Article }) {
  const content = article.content ?? [];
  const toc = getArticleTableOfContents(content);
  const [activeHeading, setActiveHeading] = useState("");
  const [progress, setProgress] = useState(0);
  const [mobileToc, setMobileToc] = useState(false);
  const [message, setMessage] = useState("");
  const contentRef = useRef<HTMLElement>(null);
  const category = articleCategories[article.category];
  const relatedTools = tools.filter((tool) =>
    article.relatedToolIds.includes(tool.id),
  );
  const relatedArticles = (article.relatedArticleIds ?? [])
    .map((id) => articles.find((item) => item.id === id))
    .filter((item): item is Article => Boolean(item));

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const element = contentRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight * 0.6);
      setProgress(Math.min(1, Math.max(0, -rect.top / distance)));
      const headings = Array.from(
        element.querySelectorAll<HTMLElement>("h2[id], h3[id]"),
      );
      let current = "";
      headings.forEach((heading) => {
        if (heading.getBoundingClientRect().top < 145) current = heading.id;
      });
      setActiveHeading(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const notify = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2400);
  };
  const share = async () => {
    const data = {
      title: article.title,
      text: article.excerpt,
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(window.location.href);
        notify("Article link copied.");
      }
    } catch (error) {
      if ((error as DOMException).name !== "AbortError")
        notify("Sharing is unavailable in this browser.");
    }
  };
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify("Article link copied.");
    } catch {
      notify("Clipboard access is unavailable.");
    }
  };

  return (
    <div
      className="article-page blog-page"
      style={{ "--c": category.color } as React.CSSProperties}
    >
      <DesignHeader />
      <div className="reading-progress" aria-hidden="true">
        <i style={{ transform: `scaleX(${progress})` }} />
      </div>
      <main>
        <div className="wrap">
          <nav className="bcr article-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">
              <Icon name="home" size={14} />
              Home
            </Link>
            <Icon name="chev" size={14} />
            <Link href="/blog">Blog</Link>
            <Icon name="chev" size={14} />
            <span aria-current="page">{article.title}</span>
          </nav>
          <div className="adt">
            <div className="top">
              <span className="cat">{category.name}</span>
              {article.status !== "published" && (
                <span className="mini">
                  <Icon name="info" size={13} />
                  Demonstration article, not reviewed or published
                </span>
              )}
            </div>
            <h1>{article.title}</h1>
            <p className="lead">{article.excerpt}</p>
            <div className="adm">
              <div className="au">
                <span className="av" aria-hidden="true">
                  TN
                </span>
                <div>
                  <b>{article.author}</b>
                  <small>
                    {article.status === "published"
                      ? "Editorial team"
                      : "Sample author"}
                  </small>
                </div>
              </div>
              <ArticleMetadata article={article} />
              {article.updatedAt && (
                <span className="article-updated">
                  <Icon name="repeat" size={14} />
                  Updated {formatDate(article.updatedAt)}
                </span>
              )}
              <button className="btn" onClick={share}>
                <Icon name="share" size={16} />
                Share Article
              </button>
            </div>
          </div>
          <div className="aly">
            <div className="amn">
              <div className="acv">
                <ArticleCoverArt
                  cover={article.cover}
                  color={category.color}
                  label={category.name}
                  imageSrc={article.featuredImage}
                  imageAlt={article.featuredImageAlt}
                />
              </div>
              <div className="mtoc">
                <button
                  aria-expanded={mobileToc}
                  aria-controls="mobile-article-toc"
                  onClick={() => setMobileToc(!mobileToc)}
                >
                  In This Article
                  <Icon name="chev" size={18} />
                </button>
                <div id="mobile-article-toc" hidden={!mobileToc}>
                  <TableOfContents items={toc} active={activeHeading} />
                </div>
              </div>
              <article className="ac" ref={contentRef}>
                <ArticleContent blocks={content} toc={toc} onMessage={notify} />
              </article>
              <div className="aft">
                <div className="article-tags">
                  {article.tags?.map((tag) => (
                    <span className="mini" key={tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="acd">
                  <span className="av" aria-hidden="true">
                    TN
                  </span>
                  <div>
                    <b>{article.author}</b>
                    <p>
                      The ToolNest Editorial Team prepares practical guides
                      about browser-based tools, development workflows, and
                      everyday productivity.
                    </p>
                  </div>
                </div>
                <div className="article-footer-row">
                  <ArticleShare onShare={share} onCopy={copyLink} />
                  <Link href="/blog" className="btn">
                    <Icon name="arrow" className="back-arrow" size={16} />
                    Back to Blog
                  </Link>
                </div>
              </div>
            </div>
            <aside className="asd">
              <TableOfContents items={toc} active={activeHeading} />
              {relatedTools[0] && <SidebarTool tool={relatedTools[0]} />}
              <ArticleShare onShare={share} onCopy={copyLink} />
            </aside>
          </div>
        </div>
        <section className="article-related-section">
          <div className="wrap">
            <div className="sh">
              <h2>Tools Mentioned in This Article</h2>
            </div>
            <div className="fcg">
              {relatedTools.map((tool) => (
                <ExactToolCard tool={tool} detailedIcon key={tool.id} />
              ))}
            </div>
          </div>
        </section>
        <section className="article-related-section">
          <div className="wrap">
            <div className="article-section-heading">
              <div className="sh">
                <h2>You Might Also Like</h2>
              </div>
              <Link href="/blog" className="btn">
                View All Articles
              </Link>
            </div>
            <div className="bg3 blog-grid">
              {relatedArticles.map((item) => (
                <ArticleCard article={item} key={item.id} />
              ))}
            </div>
          </div>
        </section>
        <section className="tool-cta article-cta">
          <div className="wrap">
            <div className="cta">
              <span className="mono-d category-mono-left">{"{ }"}</span>
              <span className="mono-d category-mono-right">{"</>"}</span>
              <h2>Make Development Easier with ToolNest</h2>
              <p>
                Explore free tools designed to simplify everyday development
                work.
              </p>
              <Link href="/tools/category/developer" className="btn w">
                Explore Developer Tools
              </Link>
              <Link href="/tools" className="sl">
                View All Tools
              </Link>
            </div>
          </div>
        </section>
      </main>
      <DesignFooter />
      {message && (
        <div className="toast on" role="status">
          <Icon name="check" size={16} />
          {message}
        </div>
      )}
    </div>
  );
}

function ArticleContent({
  blocks,
  toc,
  onMessage,
}: {
  blocks: ArticleBlock[];
  toc: ReturnType<typeof getArticleTableOfContents>;
  onMessage: (message: string) => void;
}) {
  let headingIndex = 0;
  return blocks.map((block, index) => {
    if (block.type === "heading") {
      const item = toc[headingIndex++];
      return block.level === 2 ? (
        <h2 id={item.id} key={item.id}>
          {block.text}
        </h2>
      ) : (
        <h3 id={item.id} key={item.id}>
          {block.text}
        </h3>
      );
    }
    switch (block.type) {
      case "paragraph":
        return (
          <p key={index}>
            <InlineContent content={block.content} />
          </p>
        );
      case "list": {
        const List = block.ordered ? "ol" : "ul";
        return (
          <List key={index}>
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                <InlineContent content={item} />
              </li>
            ))}
          </List>
        );
      }
      case "quote":
        return <blockquote key={index}>{block.text}</blockquote>;
      case "code":
        return <CodeBlock block={block} onMessage={onMessage} key={index} />;
      case "table":
        return (
          <div className="atb" key={index}>
            <table>
              <thead>
                <tr>
                  {block.headers.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "callout":
        return (
          <div
            className={`callout ${block.tone === "warning" ? "wn" : ""}`}
            key={index}
          >
            <Icon
              name={block.tone === "warning" ? "alert" : "info"}
              size={20}
            />
            <p>
              <InlineContent content={block.content} />
            </p>
          </div>
        );
      case "figure":
        return (
          <figure key={index}>
            <div className="article-inline-figure">
              <ArticleCoverArt
                cover={block.cover}
                color="#4F46E5"
                label="Article"
              />
            </div>
            <figcaption>{block.caption}</figcaption>
          </figure>
        );
      case "tool-cta":
        return <ContextualToolCta toolId={block.toolId} key={index} />;
      case "divider":
        return <hr key={index} />;
    }
  });
}

function InlineContent({ content }: { content: ArticleInline[] }) {
  return content.map((part, index) => {
    if (typeof part === "string") return part;
    if (part.type === "strong") return <strong key={index}>{part.text}</strong>;
    if (part.type === "code") return <code key={index}>{part.text}</code>;
    return (
      <Link href={`/tools/${part.toolId}`} key={index}>
        {part.text}
      </Link>
    );
  });
}

function CodeBlock({
  block,
  onMessage,
}: {
  block: Extract<ArticleBlock, { type: "code" }>;
  onMessage: (message: string) => void;
}) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(block.code);
      onMessage("Code copied to clipboard.");
    } catch {
      onMessage("Clipboard access is unavailable.");
    }
  };
  return (
    <figure className="acb">
      <div className="acbh">
        <span className="tag2">{block.label}</span>
        <button
          className="btn"
          onClick={copy}
          aria-label={`Copy ${block.language} code`}
        >
          <Icon name="copy" size={14} />
          Copy Code
        </button>
      </div>
      <pre className="acbp">
        <code>{block.code}</code>
      </pre>
    </figure>
  );
}

function TableOfContents({
  items,
  active,
}: {
  items: ReturnType<typeof getArticleTableOfContents>;
  active: string;
}) {
  return (
    <nav className="toc" aria-label="Table of contents">
      <b>In This Article</b>
      {items.map((item) => (
        <a
          className={`${item.level === 3 ? "s3" : ""} ${active === item.id ? "on" : ""}`}
          aria-current={active === item.id ? "location" : undefined}
          href={`#${item.id}`}
          key={item.id}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}

function ContextualToolCta({ toolId }: { toolId: string }) {
  const tool = tools.find((item) => item.id === toolId);
  if (!tool) return null;
  const isWordCounter = tool.id === "word-counter";
  return (
    <aside className="atc">
      <span className="cico">
        <Icon name={isWordCounter ? "type" : "braces"} size={22} />
      </span>
      <div>
        <h4>
          {isWordCounter
            ? "Count Your Words Instantly"
            : "Format Your JSON in Seconds"}
        </h4>
        <p>
          {isWordCounter
            ? "Check words, characters, sentences and reading time in your browser."
            : "Beautify, validate and minify JSON directly in your browser."}
        </p>
      </div>
      <Link href={`/tools/${tool.slug}`} className="btn pr">
        Try {tool.name}
      </Link>
    </aside>
  );
}

function SidebarTool({ tool }: { tool: (typeof tools)[number] }) {
  const category = categoryMap[tool.category];
  return (
    <article className="tc article-sidebar-tool">
      <span className="cico">
        <Icon name={tool.id === "word-counter" ? "type" : "braces"} size={22} />
      </span>
      <span className="cat">{category.name}</span>
      <h3>{tool.name}</h3>
      <p>{tool.shortDescription}</p>
      <Link href={`/tools/${tool.slug}`} className="btn pr">
        Try {tool.name}
      </Link>
    </article>
  );
}

function ArticleShare({
  onShare,
  onCopy,
}: {
  onShare: () => void;
  onCopy: () => void;
}) {
  return (
    <div>
      <span className="shl">Share Article</span>
      <div className="shr">
        <button
          className="ib"
          aria-label="Copy article link"
          title="Copy article link"
          onClick={onCopy}
        >
          <Icon name="link" size={18} />
        </button>
        <button
          className="ib"
          aria-label="Share article"
          title="Share article"
          onClick={onShare}
        >
          <Icon name="share" size={18} />
        </button>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}
