import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { DesignFooter, DesignHeader } from "@/components/design/site-shell";
import { Icon, type IconName } from "@/components/design/icon";
import { categories, tools } from "@/data/tools";
import type { CategoryId } from "@/types/tool";

const categoryIcons: Record<CategoryId, IconName> = {
  developer: "code",
  text: "type",
  seo: "search",
  image: "image",
  pdf: "file",
  calculators: "calc",
};

const sectionLinks = [
  ["Our story", "about-story"],
  ["Purpose", "about-mission"],
  ["Principles", "about-values"],
  ["Categories", "about-categories"],
  ["Privacy", "privacy"],
] as const;

const values: Array<[IconName, string, string]> = [
  [
    "spark",
    "Simplicity",
    "Clean interfaces that help users focus on completing their tasks.",
  ],
  [
    "accessibility",
    "Accessibility",
    "Tools designed to be usable across devices and different user needs.",
  ],
  [
    "shieldCheck",
    "Privacy",
    "Browser-based processing wherever possible, with minimal unnecessary data collection.",
  ],
  [
    "zap",
    "Performance",
    "Lightweight experiences designed to reduce unnecessary loading and complexity.",
  ],
  [
    "unlock",
    "Free Access",
    "Essential utilities available without mandatory subscriptions or account registration.",
  ],
  [
    "refresh",
    "Continuous Improvement",
    "A growing collection of tools shaped by practical needs and user feedback.",
  ],
];

const audiences: Array<[string, IconName, string, string]> = [
  [
    "#4F46E5",
    "code",
    "Developers",
    "Format code, validate structured data and simplify common development tasks.",
  ],
  [
    "#9333EA",
    "penline",
    "Writers and Content Creators",
    "Analyze text, count words and improve everyday writing workflows.",
  ],
  [
    "#059669",
    "search",
    "SEO Professionals and Marketers",
    "Generate metadata and simplify website optimization tasks.",
  ],
  [
    "#0284C7",
    "grad",
    "Students and Everyday Users",
    "Access convenient utilities for studying, productivity and everyday digital tasks.",
  ],
];

function colorStyle(color: string) {
  return { "--c": color } as CSSProperties;
}

function FeatureCard({
  icon,
  title,
  children,
  color = "#4F46E5",
}: {
  icon: IconName;
  title: string;
  children: ReactNode;
  color?: string;
}) {
  return (
    <article className="tc about-feature-card" style={colorStyle(color)}>
      <span className="cico">
        <Icon name={icon} size={22} />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="sh c about-section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

function HeroVisualCard({
  category,
  label,
  children,
}: {
  category: CategoryId;
  label: string;
  children: ReactNode;
}) {
  const data = categories.find((item) => item.id === category)!;
  return (
    <div className="about-visual-card" style={colorStyle(data.color)}>
      <div className="about-visual-card-head">
        <span className="cico">
          <Icon name={categoryIcons[category]} size={16} />
        </span>
        {label}
      </div>
      {children}
    </div>
  );
}

export function AboutPage() {
  const activeCategories = categories.filter((category) => category.active);
  const upcomingCategories = categories.filter((category) => !category.active);
  const operationalCount = tools.filter(
    (tool) => tool.implementationStatus === "operational",
  ).length;

  return (
    <div className="about-page">
      <DesignHeader />
      <main>
        <section className="hero ph about-hero">
          <div className="wrap">
            <nav className="bcr" aria-label="Breadcrumb">
              <Link href="/">
                <Icon name="home" size={14} />
                Home
              </Link>
              <Icon name="chev" size={14} />
              <span aria-current="page">About</span>
            </nav>
            <nav className="about-section-nav" aria-label="About page sections">
              {sectionLinks.map(([label, id]) => (
                <a key={id} href={`#${id}`}>
                  {label}
                </a>
              ))}
            </nav>
            <div className="cg about-hero-grid">
              <div className="about-hero-copy">
                <span className="eyebrow">ABOUT TOOLNEST</span>
                <h1>Simplifying Everyday Digital Tasks</h1>
                <p className="lead">
                  ToolNest brings essential online tools together in one place,
                  helping developers, writers, creators and website owners
                  complete everyday tasks without unnecessary complexity.
                </p>
                <p className="about-hero-summary">
                  Our goal is simple: make useful digital tools accessible,
                  intuitive and convenient for everyone.
                </p>
                <div className="about-actions">
                  <Link href="/tools" className="btn pr">
                    Explore All Tools <Icon name="arrow" size={16} />
                  </Link>
                  <a href="#about-mission" className="btn">
                    Discover Our Mission
                  </a>
                </div>
              </div>
              <div
                className="about-visual-grid"
                role="img"
                aria-label="Illustration of ToolNest tool categories"
              >
                <HeroVisualCard category="developer" label="JSON Formatter">
                  <div className="about-code">
                    <span>{"{"}</span>
                    <span>
                      &nbsp;&nbsp;&quot;valid&quot;: <b>true</b>
                    </span>
                    <span>{"}"}</span>
                  </div>
                </HeroVisualCard>
                <HeroVisualCard category="text" label="Text Analysis">
                  <div className="about-number">128</div>
                  <div className="about-lines">
                    <i className="long" />
                    <i className="short" />
                  </div>
                </HeroVisualCard>
                <HeroVisualCard category="seo" label="SEO Metadata">
                  <div className="about-lines">
                    <i className="long" />
                    <i />
                    <i className="short" />
                  </div>
                </HeroVisualCard>
                <HeroVisualCard category="image" label="Image Optimization">
                  <div className="about-image-art" />
                </HeroVisualCard>
                <HeroVisualCard category="pdf" label="PDF Management">
                  <div className="about-lines">
                    <i className="long" />
                    <i />
                    <i />
                    <i className="short" />
                  </div>
                </HeroVisualCard>
                <HeroVisualCard
                  category="calculators"
                  label="Everyday Calculations"
                >
                  <div className="about-keypad">
                    {Array.from({ length: 9 }, (_, index) => (
                      <i key={index} />
                    ))}
                  </div>
                </HeroVisualCard>
              </div>
            </div>
          </div>
        </section>

        <section id="about-story">
          <div className="wrap">
            <div className="ed about-story-grid">
              <div>
                <span className="eyebrow">WHY TOOLNEST EXISTS</span>
                <h2>Useful Tools Shouldn&apos;t Be Complicated</h2>
              </div>
              <div className="about-story-copy">
                <p>
                  Everyday digital tasks often mean juggling several websites
                  and apps: one to format code, another to count words and a
                  third to prepare page metadata.
                </p>
                <p>
                  Many online utilities add friction along the way, with
                  cluttered pages, unclear options or sign-up walls before you
                  can do something simple.
                </p>
                <p>
                  People should be able to use essential tools without creating
                  an account. Open a tool, add your input and get your result.
                </p>
                <p>
                  ToolNest brings useful utilities together in one consistent,
                  convenient experience, so every tool feels familiar from your
                  first visit.
                </p>
                <div className="cmp about-workflows">
                  <div className="ide">
                    <div className="ih">
                      <i />
                      <i />
                      <i />
                      <span>Scattered workflow</span>
                    </div>
                    <div className="about-workflow-tags">
                      {[
                        "JSON site",
                        "Word count site",
                        "SEO checker",
                        "Image app",
                        "Sign-up needed",
                      ].map((item) => (
                        <span className="tag about-dashed-tag" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ide">
                    <div className="ih">
                      <i />
                      <i />
                      <i />
                      <span>ToolNest workspace</span>
                    </div>
                    <div className="about-workflow-tags">
                      {[
                        "JSON Formatter",
                        "Word Counter",
                        "Meta Tag Generator",
                      ].map((item) => (
                        <span className="tag" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about-mission" className="about-condensed-section">
          <div className="wrap">
            <SectionHeading eyebrow="OUR PURPOSE" title="What Drives Us" />
            <div className="cmp about-purpose-grid">
              <FeatureCard icon="target" title="Our Mission">
                Make essential digital utilities accessible, easy to use and
                available without unnecessary barriers.
              </FeatureCard>
              <FeatureCard icon="compass" title="Our Vision" color="#8B5CF6">
                Build a trusted collection of online tools that simplifies
                everyday work for people around the world.
              </FeatureCard>
            </div>
          </div>
        </section>

        <section id="about-values" className="about-condensed-section">
          <div className="wrap">
            <SectionHeading
              eyebrow="OUR PRINCIPLES"
              title="Built Around What Matters"
            />
            <div className="fcg f3 about-values-grid">
              {values.map(([icon, title, description]) => (
                <FeatureCard key={title} icon={icon} title={title}>
                  {description}
                </FeatureCard>
              ))}
            </div>
          </div>
        </section>

        <section id="about-categories" className="about-condensed-section">
          <div className="wrap">
            <div className="about-ecosystem-head">
              <div className="sh">
                <h2>One Platform. Multiple Possibilities.</h2>
                <p>
                  Explore a growing collection of utilities designed for
                  different everyday workflows.
                </p>
              </div>
              <Link href="/tools" className="btn">
                View All Tools
              </Link>
            </div>
            <div className="about-category-grid">
              {categories.map((category) => {
                const count = tools.filter(
                  (tool) => tool.category === category.id,
                ).length;
                const content = (
                  <>
                    <span className="about-watermark">
                      <Icon name={categoryIcons[category.id]} size={96} />
                    </span>
                    <div className="about-category-top">
                      <span className="cico">
                        <Icon name={categoryIcons[category.id]} size={22} />
                      </span>
                      {!category.active && (
                        <span className="soon">Coming Soon</span>
                      )}
                    </div>
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                    {category.active && (
                      <span className="go">
                        Browse {count} tools <Icon name="arrow" size={18} />
                      </span>
                    )}
                  </>
                );
                return category.active ? (
                  <Link
                    key={category.id}
                    href={`/tools/category/${category.id}`}
                    className={`bc about-category-card about-category-${category.id}`}
                    style={colorStyle(category.color)}
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    key={category.id}
                    className={`bc off about-category-card about-category-${category.id}`}
                    style={colorStyle(category.color)}
                    aria-label={`${category.name}, coming soon`}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="about-condensed-section">
          <div className="wrap">
            <SectionHeading
              eyebrow="WHO IT'S FOR"
              title="Designed for Everyday Work"
            />
            <div className="fcg about-audience-grid">
              {audiences.map(([color, icon, title, description]) => (
                <FeatureCard
                  key={title}
                  icon={icon}
                  title={title}
                  color={color}
                >
                  {description}
                </FeatureCard>
              ))}
            </div>
          </div>
        </section>

        <section id="privacy" className="about-condensed-section">
          <div className="wrap">
            <div className="about-privacy-panel">
              <div className="ed about-privacy-grid">
                <div>
                  <span className="eyebrow">PRIVACY BY DESIGN</span>
                  <h2>Your Work Should Stay Yours</h2>
                  <p>
                    ToolNest is built so that supported tools handle your input
                    in the browser, with clear communication about how each tool
                    works.
                  </p>
                  <ul>
                    {[
                      "Supported tools process your input directly in the browser.",
                      "No mandatory account registration.",
                      "No unnecessary uploading of tool input.",
                      "Clear communication about how individual tools handle data.",
                      "Transparent privacy practices.",
                    ].map((item) => (
                      <li key={item}>
                        <Icon name="check" size={18} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/privacy-policy" className="about-text-link">
                    Read our Privacy Policy draft{" "}
                    <Icon name="arrow" size={16} />
                  </Link>
                </div>
                <aside id="privacy-note" className="about-privacy-note">
                  <span className="cico">
                    <Icon name="shieldCheck" size={28} />
                  </span>
                  <h3>Tool input and website data are different things</h3>
                  <p>
                    Where a tool supports it, what you type or paste is
                    processed locally in your browser rather than sent to a
                    server.
                  </p>
                  <hr />
                  <p>
                    Like most websites, ToolNest may use general analytics and
                    cookies, and may show advertising in the future. These work
                    separately from your tool input. The current Privacy Policy
                    is a non-indexed draft pending legal and hosting review.
                  </p>
                </aside>
              </div>
            </div>
          </div>
        </section>

        <section id="about-roadmap" className="about-condensed-section">
          <div className="wrap">
            <SectionHeading
              eyebrow="ALWAYS IMPROVING"
              title="A Growing Collection of Useful Tools"
            />
            <div className="about-roadmap-grid">
              <article className="tc">
                <span className="about-status">Available Now</span>
                <p className="about-roadmap-summary">
                  {operationalCount} working tools across{" "}
                  {activeCategories.length} active categories
                </p>
                <ul>
                  {activeCategories.map((category) => (
                    <li key={category.id}>
                      <span className="cico" style={colorStyle(category.color)}>
                        <Icon name={categoryIcons[category.id]} size={16} />
                      </span>
                      {category.name}
                    </li>
                  ))}
                </ul>
              </article>
              <article className="tc">
                <span className="soon">Coming Soon</span>
                <ul>
                  {upcomingCategories.map((category) => (
                    <li key={category.id}>
                      <span className="cico" style={colorStyle(category.color)}>
                        <Icon name={categoryIcons[category.id]} size={16} />
                      </span>
                      {category.name}
                    </li>
                  ))}
                </ul>
              </article>
              <article className="tc">
                <span className="about-status muted">Future Improvements</span>
                <ul>
                  {[
                    "Additional utilities",
                    "Improved accessibility",
                    "Better tool experiences",
                    "More practical guides and tutorials",
                  ].map((item) => (
                    <li key={item}>
                      <Icon name="chev" size={16} />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section id="about-feedback" className="about-condensed-section">
          <div className="wrap">
            <div className="about-feedback">
              <div>
                <h2>Help Shape the Future of ToolNest</h2>
                <p>
                  Have an idea for a useful tool or a suggestion to improve the
                  platform? We welcome practical feedback that helps make
                  ToolNest more useful.
                </p>
              </div>
              <div className="about-actions">
                <Link className="btn pr" href="/contact?inquiry=suggest-a-tool">
                  Suggest a Tool
                </Link>
                <Link className="btn" href="/contact">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="about-final-section">
          <div className="wrap">
            <div className="cta about-cta">
              <span className="mono-d about-mono-left">{"{ }"}</span>
              <span className="mono-d about-mono-right">&lt;/&gt;</span>
              <h2>All Your Tools. One Place.</h2>
              <p>
                Discover simple, accessible online utilities designed to make
                everyday digital tasks easier.
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
