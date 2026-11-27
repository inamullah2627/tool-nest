"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, type IconName } from "@/components/design/icon";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { tools } from "@/data/tools";
import { ExactToolCard } from "@/features/home/react-home-page";
import { OpenGraphWorkspace } from "./open-graph-workspace";

const tool = tools.find((item) => item.slug === "open-graph-generator")!;
const steps: Array<[IconName, string, string]> = [
  [
    "edit",
    "Enter Your Page Information",
    "Add the title, description, page URL and public sharing-image URL.",
  ],
  [
    "sliders",
    "Customize and Preview",
    "Configure content, image and Twitter Card settings and inspect illustrative previews.",
  ],
  [
    "copy",
    "Copy Your Meta Tags",
    "Generate, review and export escaped HTML metadata for your page head.",
  ],
];
const features: Array<[IconName, string, string]> = [
  [
    "share",
    "Open Graph Metadata",
    "Create core Open Graph, image and content-specific properties.",
  ],
  [
    "msg",
    "Twitter Card Generation",
    "Build Summary or Summary Card with Large Image metadata.",
  ],
  [
    "eye",
    "Four Live Previews",
    "Review illustrative Facebook, LinkedIn, X and WhatsApp cards.",
  ],
  [
    "upload",
    "Local Image Preview",
    "Inspect a local image and detect its actual pixel dimensions.",
  ],
  [
    "shieldCheck",
    "Validated Output",
    "Reject malformed values and omit empty or invalid properties.",
  ],
  [
    "code",
    "Safe HTML Export",
    "Copy or download escaped code that is never executed.",
  ],
];
const faqs = [
  [
    "What are Open Graph tags?",
    "Open Graph tags describe a page to platforms that build link previews, including its title, description, URL, type and sharing image.",
  ],
  [
    "What is the recommended image size?",
    "About 1200 × 630 pixels is a common recommendation. Platforms may crop or resize images differently.",
  ],
  [
    "What is the difference between Open Graph and Twitter Cards?",
    "Open Graph is read by many platforms. X uses Twitter Card metadata and can fall back to Open Graph values when dedicated tags are absent.",
  ],
  [
    "Are the social previews exact?",
    "No. They are illustrative. Platform rendering, caching, device dimensions and available metadata can change the actual result.",
  ],
  [
    "Is my local image added to generated metadata?",
    "No. A local image is used only for an in-browser preview and dimension detection. Generated tags require a public HTTP or HTTPS image URL.",
  ],
  [
    "Does ToolNest fetch my URLs?",
    "No. Website and remote image URLs are validated as text but are not crawled or loaded by this tool.",
  ],
] as const;

export function OpenGraphGeneratorPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const related = tools
    .filter((item) => item.category === "seo" && item.id !== tool.id)
    .slice(0, 5);
  return (
    <ToolPageLayout
      tool={tool}
      icon="share"
      heading="Open Graph Generator"
      description="Generate Open Graph and Twitter Card metadata and preview how content may appear when shared on social platforms."
    >
      <OpenGraphWorkspace />
      <section className="tool-section">
        <div className="wrap">
          <div className="sh c">
            <h2>How to Generate Open Graph Meta Tags</h2>
          </div>
          <div className="steps">
            {steps.map(([icon, title, text], index) => (
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
      <section className="tool-section">
        <div className="wrap">
          <div className="sh c">
            <h2>Powerful Open Graph Generator Features</h2>
          </div>
          <div className="fcg f3">
            {features.map(([icon, title, text]) => (
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
      <section className="tool-section">
        <div className="wrap">
          <div className="sh c">
            <h2>Open Graph Tags in HTML</h2>
          </div>
          <div className="og-code-examples">
            <CodeExample
              title="Open Graph"
              code={
                '<meta property="og:title" content="Your Page Title" />\n<meta property="og:type" content="website" />\n<meta property="og:url" content="https://example.com/page" />\n<meta property="og:image" content="https://example.com/social-image.jpg" />'
              }
            />
            <CodeExample
              title="Twitter Cards"
              code={
                '<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="Your Page Title" />\n<meta name="twitter:image" content="https://example.com/social-image.jpg" />'
              }
            />
          </div>
          <p className="example-note">
            These values are illustrative. Replace them with your own metadata
            and place the tags inside the page head.
          </p>
        </div>
      </section>
      <section className="tool-section">
        <div className="wrap">
          <div className="edu">
            <h2>Understanding Open Graph Metadata</h2>
            <h3>What is Open Graph?</h3>
            <p>
              Open Graph is a metadata protocol that lets a page describe itself
              to platforms that create rich link previews. Core properties
              identify the title, page type, canonical page URL and public
              image.
            </p>
            <h3>Open Graph and Twitter Cards</h3>
            <p>
              Many platforms read Open Graph properties. X supports dedicated{" "}
              <code>twitter:*</code> card tags and can fall back to Open Graph
              metadata. This generator provides Summary and Summary Card with
              Large Image options.
            </p>
            <h3>Image requirements</h3>
            <p>
              A public HTTP or HTTPS image URL is required for other platforms
              to retrieve an image. A local file selected here never leaves the
              browser and is never written into generated metadata.
              Approximately 1200 × 630 pixels is common guidance, but cropping
              differs by platform.
            </p>
            <h3>Safe generation and validation</h3>
            <p>
              HTML attribute values are escaped and output is rendered only as
              text. Invalid URLs, dimensions, locales, dates and handles are
              identified and omitted. The tool does not crawl pages or fetch
              remote images.
            </p>
            <h3>Preview limitations</h3>
            <p>
              Facebook, LinkedIn, X and WhatsApp control their own layouts and
              caching. The previews on this page illustrate relative structure
              only and cannot guarantee the final platform appearance.
            </p>
            <div className="callout">
              <Icon name="info" size={20} />
              <p>
                Check your existing theme, framework or SEO plugin before adding
                tags manually so you do not publish duplicate metadata.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="tool-section">
        <div className="wrap">
          <div className="related-heading">
            <div className="sh">
              <h2>Related SEO Tools</h2>
            </div>
            <Link href="/tools/category/seo" className="btn">
              View All SEO Tools
            </Link>
          </div>
          <div className="fcg">
            {related.map((item) => (
              <ExactToolCard tool={item} detailedIcon key={item.id} />
            ))}
          </div>
        </div>
      </section>
      <section className="tool-section">
        <div className="wrap">
          <div className="sh c">
            <h2>Open Graph Generator FAQs</h2>
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
      <section className="tool-cta">
        <div className="wrap">
          <div className="cta">
            <span className="mono-d category-mono-left">og:</span>
            <span className="mono-d category-mono-right">share</span>
            <h2>Explore More SEO Tools</h2>
            <p>
              Discover free utilities for metadata, URLs and content workflows.
            </p>
            <Link href="/tools/category/seo" className="btn w">
              Explore SEO Tools
            </Link>
            <Link href="/tools" className="sl">
              View All Tools
            </Link>
          </div>
        </div>
      </section>
    </ToolPageLayout>
  );
}

function CodeExample({ title, code }: { title: string; code: string }) {
  return (
    <article>
      <header>
        <span />
        <span />
        <span />
        <b>{title}</b>
      </header>
      <pre>
        <code>{code}</code>
      </pre>
    </article>
  );
}
