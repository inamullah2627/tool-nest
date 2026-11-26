import { Icon } from "@/components/design/icon";
import {
  articleCategories,
  type Article,
  type ArticleCover,
} from "@/data/articles";

export function ArticleCard({ article }: { article: Article }) {
  const category = articleCategories[article.category];
  return (
    <article
      className="post bpost"
      style={{ "--c": category.color } as React.CSSProperties}
    >
      <ArticleCoverArt
        cover={article.cover}
        color={category.color}
        label={category.name}
      />
      <div className="bd">
        <div className="blog-card-labels">
          <span className="cat">{category.name}</span>
          <span className="mini">Preview</span>
        </div>
        <h3>{article.title}</h3>
        <p className="bex">{article.excerpt}</p>
        <div className="bfoot">
          <ArticleMetadata article={article} />
          <span className="blog-coming">Article coming soon</span>
        </div>
      </div>
    </article>
  );
}

export function FeaturedArticle({ article }: { article: Article }) {
  const category = articleCategories[article.category];
  return (
    <article
      className="post bpost fa"
      style={{ "--c": category.color } as React.CSSProperties}
    >
      <div className="facv">
        <ArticleCoverArt
          cover={article.cover}
          color={category.color}
          label={category.name}
        />
      </div>
      <div className="bd">
        <div className="top">
          <span className="eyebrow">
            <Icon name="spark" size={14} />
            Featured Preview
          </span>
          <span className="cat">{category.name}</span>
        </div>
        <h2>{article.title}</h2>
        <p className="bex">{article.excerpt}</p>
        <div className="au">
          <span className="av" aria-hidden="true">
            TN
          </span>
          <div>
            <b>{article.author}</b>
            <small>Unpublished sample article</small>
          </div>
        </div>
        <ArticleMetadata article={article} />
        <span className="btn pr blog-disabled-action" aria-disabled="true">
          Article Coming Soon
        </span>
      </div>
    </article>
  );
}

export function ArticleMetadata({ article }: { article: Article }) {
  return (
    <span className="bmeta">
      <span>
        <Icon name="calendar" size={14} />
        {formatArticleDate(article.publishedAt)}
      </span>
      <span>
        <Icon name="clock" size={14} />
        {article.readingMinutes} min read
      </span>
    </span>
  );
}

export function BlogEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="es blog-empty">
      <span className="ei">
        <Icon name="search" size={28} />
      </span>
      <h3>No articles found</h3>
      <p>Try a different search term or explore another category.</p>
      <div className="bs">
        <button className="btn pr" onClick={onReset}>
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export function BlogPagination({
  currentPage,
  pageCount,
  onPage,
}: {
  currentPage: number;
  pageCount: number;
  onPage: (page: number) => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <nav className="bpg" aria-label="Article pagination">
      <button
        className="btn"
        disabled={currentPage === 1}
        onClick={() => onPage(currentPage - 1)}
      >
        <Icon name="arrow" className="back-arrow" size={16} />
        Previous
      </button>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map(
        (page) => (
          <button
            className={`btn ${page === currentPage ? "pr" : ""}`}
            aria-current={page === currentPage ? "page" : undefined}
            aria-label={`Page ${page}`}
            onClick={() => onPage(page)}
            key={page}
          >
            {page}
          </button>
        ),
      )}
      <button
        className="btn"
        disabled={currentPage === pageCount}
        onClick={() => onPage(currentPage + 1)}
      >
        Next
        <Icon name="arrow" size={16} />
      </button>
    </nav>
  );
}

function ArticleCoverArt({
  cover,
  color,
  label,
}: {
  cover: ArticleCover;
  color: string;
  label: string;
}) {
  const symbol: Record<ArticleCover, string> = {
    json: "{ }",
    minify: "{…}",
    errors: "!",
    count: "Aa",
    seo: "SEO",
    canonical: "↗",
    tools: "++",
    writing: "✎",
    slug: "/url",
    workflow: "✓",
  };
  return (
    <svg
      className="bth"
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${label} article illustration`}
    >
      <rect width="400" height="225" fill="var(--sub)" />
      <circle cx="350" cy="30" r="70" fill={color} opacity=".12" />
      <circle cx="40" cy="210" r="56" fill="#8B5CF6" opacity=".1" />
      <rect
        x="62"
        y="38"
        width="276"
        height="150"
        rx="16"
        fill="var(--card)"
        stroke="var(--bd)"
        strokeWidth="2"
      />
      <rect
        x="62"
        y="38"
        width="276"
        height="34"
        rx="16"
        fill={color}
        opacity=".12"
      />
      <circle cx="84" cy="55" r="5" fill={color} />
      <circle cx="101" cy="55" r="5" fill={color} opacity=".5" />
      <text
        x="200"
        y="137"
        textAnchor="middle"
        fill={color}
        fontSize={cover === "slug" ? 30 : 48}
        fontWeight="700"
        fontFamily="var(--font-heading), sans-serif"
      >
        {symbol[cover]}
      </text>
      <rect
        x="126"
        y="158"
        width="148"
        height="8"
        rx="4"
        fill={color}
        opacity=".28"
      />
    </svg>
  );
}

function formatArticleDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}
