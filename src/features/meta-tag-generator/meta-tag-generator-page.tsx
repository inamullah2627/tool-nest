"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, type IconName } from "@/components/design/icon";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { tools } from "@/data/tools";
import { ExactToolCard } from "@/features/home/react-home-page";
import { MetaTagWorkspace } from "./meta-tag-workspace";

const tool = tools.find((item) => item.slug === "meta-tag-generator")!;
const steps: Array<[IconName, string, string]> = [
  [
    "edit",
    "Enter Page Information",
    "Add the title, description and optional URLs.",
  ],
  [
    "sliders",
    "Configure SEO Settings",
    "Choose robots, author, encoding and viewport options.",
  ],
  [
    "search",
    "Preview the Search Result",
    "Review the illustrative desktop or mobile preview.",
  ],
  ["copy", "Generate and Export", "Copy or download safe HTML metadata."],
];
const features: Array<[IconName, string, string]> = [
  ["type", "SEO Title Builder", "Write a title with live character guidance."],
  [
    "align",
    "Meta Description Builder",
    "Draft a description and monitor its length.",
  ],
  [
    "search",
    "Live Result Preview",
    "Switch between illustrative desktop and mobile views.",
  ],
  ["link", "Canonical URL", "Define the preferred HTTP or HTTPS page address."],
  ["bot", "Robots Configuration", "Choose index/noindex and follow/nofollow."],
  [
    "download",
    "Copy and Download",
    "Export escaped HTML without executing it.",
  ],
];
const faqs = [
  [
    "What does this generator create?",
    "It creates a title element plus description, robots, author, charset, viewport and canonical metadata according to the fields you complete.",
  ],
  [
    "Are all fields required?",
    "Only the page title is required. Empty optional fields such as description, author and canonical URL are omitted rather than emitted as empty tags.",
  ],
  [
    "What title and description lengths should I use?",
    "Around 50–60 characters for titles and 150–160 for descriptions are common guidelines, not strict limits or ranking guarantees.",
  ],
  [
    "What does noindex do?",
    "Noindex asks search engines to exclude the page from search results. Select it only when that outcome is intentional.",
  ],
  [
    "Is the search preview exact?",
    "No. It is illustrative. Search engines can truncate or rewrite titles and descriptions and display results differently.",
  ],
  [
    "Are URLs checked?",
    "Yes. Website and canonical URLs must be complete HTTP or HTTPS addresses. No external website is contacted to validate them.",
  ],
  [
    "Is entered metadata stored or uploaded?",
    "No. Generation and validation happen locally in your browser and the entered values are not persisted.",
  ],
] as const;

export function MetaTagGeneratorPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const related = tools.filter(
    (item) => item.category === "seo" && item.id !== tool.id,
  );
  return (
    <ToolPageLayout
      tool={tool}
      icon="tag"
      heading="Free Online Meta Tag Generator"
      description="Generate SEO-friendly HTML metadata and preview how your website could appear in search results."
    >
      <MetaTagWorkspace />
      <section className="tool-section">
        <div className="wrap">
          <div className="sh c">
            <h2>How to Generate Meta Tags</h2>
          </div>
          <div className="steps s4">
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
            <h2>Essential Features for Better Metadata</h2>
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
          <div className="edu">
            <h2>Understanding Meta Tags</h2>
            <h3>What does the generator produce?</h3>
            <p>
              The tool creates one deterministic set of HTML metadata. Charset
              is placed first, followed by the optional viewport, required
              title, optional description, one robots directive, optional author
              and optional canonical link. Empty optional fields are omitted to
              prevent meaningless or duplicate output.
            </p>
            <h3>Safe generation and URL validation</h3>
            <p>
              Text and attribute values are escaped for their HTML contexts.
              Generated code is displayed as text and never inserted as
              executable markup. Website and canonical addresses accept only
              complete HTTP or HTTPS URLs; validation is local and no site is
              fetched.
            </p>
            <h3>SEO guidance and previews</h3>
            <p>
              Title and description length ranges are common recommendations
              rather than strict limits. Search engines may select different
              text, truncate content or render results differently, so both
              previews are illustrative and no ranking prediction is made.
            </p>
            <h3>Robots and canonical metadata</h3>
            <p>
              Index or noindex controls whether crawlers are asked to include a
              page in search, while follow or nofollow applies to its links. A
              canonical URL identifies a preferred version of similar pages.
              These directives are signals and do not replace correct site
              configuration.
            </p>
            <div className="callout">
              <Icon name="alert" size={20} />
              <p>
                Review noindex carefully before publishing. Leaving it on
                unintentionally can remove a page from search results.
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
            <h2>Meta Tag Generator FAQs</h2>
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
            <span className="mono-d category-mono-left">&lt;meta&gt;</span>
            <span className="mono-d category-mono-right">SEO</span>
            <h2>Optimize Your Website Metadata</h2>
            <p>
              Explore more free utilities for content and technical SEO
              workflows.
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
