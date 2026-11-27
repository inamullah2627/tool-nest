"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, type IconName } from "@/components/design/icon";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { tools } from "@/data/tools";
import { ExactToolCard } from "@/features/home/react-home-page";
import { generateSlug } from "@/lib/seo/url-slug";
import { UrlSlugWorkspace } from "./url-slug-workspace";

const tool = tools.find((item) => item.slug === "url-slug-generator")!;
const steps: Array<[IconName, string, string]> = [
  [
    "edit",
    "Enter Your Title",
    "Paste a page title, article heading or any text.",
  ],
  [
    "sliders",
    "Customize Your Slug",
    "Choose separators, formatting and optional limits.",
  ],
  [
    "copy",
    "Copy Your Slug",
    "Copy the generated slug or complete website URL.",
  ],
];
const features: Array<[IconName, string, string]> = [
  [
    "route",
    "Readable URL Slugs",
    "Create clean, descriptive slugs from titles and text.",
  ],
  [
    "zap",
    "Instant Generation",
    "See every setting change reflected immediately.",
  ],
  ["sliders", "Custom Separators", "Choose hyphens, underscores or periods."],
  ["list", "Bulk Generation", "Convert many titles in their original order."],
  [
    "link",
    "Complete URL Preview",
    "Validate an HTTP(S) base and preview its encoded path.",
  ],
  [
    "shieldCheck",
    "Browser-Based",
    "Process text locally without uploads or external APIs.",
  ],
];
const examples = [
  "Hello World",
  "Best WordPress Plugins 2026",
  "How to Learn Next.js",
  "Café & Restaurant Design",
  "Website Design Tips!",
];
const faqs = [
  [
    "What is a URL slug?",
    "It is the readable, page-specific part of a web address, such as url-slug-guide in example.com/blog/url-slug-guide.",
  ],
  [
    "Should slugs use hyphens or underscores?",
    "Hyphens are the common readable default. This tool also supports underscores and periods when your project requires them.",
  ],
  [
    "Is there an ideal slug length?",
    "There is no strict required length. The optional 75-character default is guidance only and not an SEO score or ranking guarantee.",
  ],
  [
    "Does it support Unicode?",
    "Yes. Meaningful multilingual letters are preserved. Accent normalization folds many Latin characters, but transliteration between writing systems is not included.",
  ],
  [
    "How does bulk mode handle duplicates?",
    "It preserves every input line and its order, then flags empty results and matching generated slugs without silently removing them.",
  ],
  [
    "Does ToolNest visit my website URL?",
    "No. URL validation and construction happen locally. The address is never fetched, uploaded or persisted.",
  ],
] as const;

export function UrlSlugGeneratorPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const related = tools.filter(
    (item) => item.category === "seo" && item.id !== tool.id,
  );
  return (
    <ToolPageLayout
      tool={tool}
      icon="route"
      heading="URL Slug Generator"
      description="Convert titles and text into clean, readable URL slugs instantly with flexible formatting controls."
    >
      <UrlSlugWorkspace />
      <section className="tool-section">
        <div className="wrap">
          <div className="sh c">
            <h2>How to Generate a URL Slug Online</h2>
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
            <h2>Powerful URL Slug Generation Features</h2>
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
            <h2>URL Slug Generator Examples</h2>
          </div>
          <div className="slug-example-table">
            <table>
              <thead>
                <tr>
                  <th>Input Text</th>
                  <th>Generated Slug</th>
                </tr>
              </thead>
              <tbody>
                {examples.map((example) => (
                  <tr key={example}>
                    <td>{example}</td>
                    <td>
                      <code>{generateSlug(example)}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="example-note">
            These examples use lowercase, hyphens, special-character removal and
            accent normalization.
          </p>
        </div>
      </section>
      <section className="tool-section">
        <div className="wrap">
          <div className="edu">
            <h2>Understanding URL Slugs</h2>
            <h3>What is a URL slug?</h3>
            <p>
              A slug is the readable part of an address that identifies a page.
              For example, <code>url-slug-guide</code> is the slug in{" "}
              <code>example.com/blog/url-slug-guide</code>.
            </p>
            <h3>Safe URL construction</h3>
            <p>
              The optional website field accepts complete HTTP and HTTPS
              addresses only. Multilingual slug characters are safely
              percent-encoded when a full URL is constructed. Validation is
              entirely local and never contacts the entered website.
            </p>
            <h3>Unicode and accent handling</h3>
            <p>
              Unicode letters and numbers are recognized across writing systems.
              Optional accent normalization folds Latin diacritics where
              possible, while other scripts remain meaningful and unchanged.
              Transliteration into Latin characters is deliberately not guessed.
            </p>
            <h3>Length and SEO guidance</h3>
            <p>
              Short descriptive slugs are generally easier to read and share,
              but no character count guarantees rankings. Statistics and
              feedback describe the generated result without producing a
              fabricated SEO score.
            </p>
            <h3>Changing published slugs</h3>
            <p>
              Changing an existing slug changes the page address. Configure an
              appropriate permanent redirect and update internal links before
              publishing that change.
            </p>
            <div className="callout">
              <Icon name="info" size={20} />
              <p>
                Stop-word removal can change meaning. Always review the
                generated result before using it.
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
            <h2>URL Slug Generator FAQs</h2>
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
            <span className="mono-d category-mono-left">/slug</span>
            <span className="mono-d category-mono-right">SEO</span>
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
