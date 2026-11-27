"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, type IconName } from "@/components/design/icon";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { tools } from "@/data/tools";
import { ExactToolCard } from "@/features/home/react-home-page";
import { TextCleanerWorkspace } from "./text-cleaner-workspace";

const tool = tools.find((item) => item.slug === "text-cleaner")!;
const steps: Array<[IconName, string, string]> = [
  ["edit", "Enter Your Text", "Paste messy text or upload a local TXT file."],
  [
    "sliders",
    "Choose Cleaning Options",
    "Select a preset or combine individual operations.",
  ],
  [
    "copy",
    "Clean and Copy",
    "Review statistics and copy or download the cleaned result.",
  ],
];
const features: Array<[IconName, string, string]> = [
  [
    "sliders",
    "18 Cleaning Options",
    "Combine whitespace, character, web and normalization operations.",
  ],
  [
    "zap",
    "Quick Presets",
    "Start with Basic, Web Content, Single Line or Custom cleanup.",
  ],
  [
    "align",
    "Whitespace Cleanup",
    "Handle spaces, tabs, line breaks, trailing whitespace and blank lines.",
  ],
  [
    "code",
    "Safe HTML Removal",
    "Extract inert readable text without executing markup or fetching resources.",
  ],
  [
    "trash",
    "Character Removal",
    "Remove selected numbers, punctuation, symbols, emoji, URLs or emails.",
  ],
  [
    "shieldCheck",
    "Browser-Based",
    "Keep entered text in local browser memory without uploads.",
  ],
];
const faqs = [
  [
    "What does Text Cleaner remove?",
    "You choose from 18 operations covering whitespace, formatting, characters, HTML, entities, URLs, emails and duplicate lines.",
  ],
  [
    "Can it safely remove HTML?",
    "Yes. Browser processing uses inert parsing. Script and style content is discarded, markup is never rendered, and network-bearing resources are never loaded.",
  ],
  [
    "Does it support multilingual text?",
    "Yes. Unicode letter handling preserves multilingual letters and essential combining characters. Numbers, punctuation, symbols and emoji are separate options.",
  ],
  [
    "How are duplicate lines removed?",
    "The shared duplicate-line processor keeps the first copy, ignores surrounding spaces for comparison and preserves original order.",
  ],
  [
    "What URLs and emails are detected?",
    "URL removal targets addresses beginning with http://, https:// or www. Email matching handles common domain-based addresses. Bare domains, localhost addresses and every valid international edge case are not guaranteed.",
  ],
  [
    "Is text uploaded or stored?",
    "No. Text and TXT files are processed in browser memory and are neither uploaded nor persisted by this tool.",
  ],
] as const;

export function TextCleanerPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const related = tools
    .filter((item) => item.category === "text" && item.id !== tool.id)
    .slice(0, 5);
  return (
    <ToolPageLayout
      tool={tool}
      icon="spark"
      heading="Text Cleaner"
      description="Clean and format messy text with deterministic whitespace, character, HTML and content-removal controls."
    >
      <TextCleanerWorkspace />
      <section className="tool-section">
        <div className="wrap">
          <div className="sh c">
            <h2>How to Clean Text Online</h2>
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
            <h2>Powerful Text Cleaning Features</h2>
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
            <h2>Text Cleaning Example</h2>
          </div>
          <div className="cmp dlx">
            <CodeExample
              title="Before Cleaning"
              code={
                "<p>  Welcome   to ToolNest!  </p>\n\nA clean   browser-based tool."
              }
            />
            <CodeExample
              title="After Web Cleanup"
              code={"Welcome to ToolNest!\nA clean browser-based tool."}
            />
          </div>
          <p className="example-note">
            The example removes HTML, decodes entities, collapses spaces, trims
            lines and removes empty lines. Unselected content remains unchanged.
          </p>
        </div>
      </section>
      <section className="tool-section">
        <div className="wrap">
          <div className="edu">
            <h2>Understanding Text Cleaning</h2>
            <h3>Deterministic cleaning pipeline</h3>
            <p>
              Selected operations always run in a documented order: HTML and
              entities, invisible and web patterns, typographic normalization,
              emoji and character classes, tabs and line breaks, per-line
              whitespace, empty lines and finally duplicate lines. Sequential
              statistics prevent the same text from being counted twice.
            </p>
            <h3>Safe HTML and entity processing</h3>
            <p>
              HTML is parsed only in inert browser containers. Script, style and
              embedded-resource blocks are removed before parsing, tags are
              never mounted into the page, and referenced resources are never
              requested. Block tags and line breaks become meaningful text
              separation.
            </p>
            <h3>Unicode handling</h3>
            <p>
              Letters from every writing system and their essential combining
              characters are preserved unless a directly relevant option is
              selected. Separate Unicode-aware rules handle numbers,
              punctuation, symbols and emoji sequences.
            </p>
            <h3>URL and email limitations</h3>
            <p>
              URL detection intentionally targets explicit <code>http://</code>,{" "}
              <code>https://</code> and <code>www.</code> addresses. Email
              matching supports common domain-based forms. Bare domains, unusual
              quoted addresses and every technically valid international edge
              case may require manual review.
            </p>
            <h3>Statistics and size changes</h3>
            <p>
              Character counts use Unicode code points while file sizes use
              UTF-8 bytes. Reduction can be zero or negative when a
              transformation expands output. Always review destructive cleanup
              before replacing the original.
            </p>
            <div className="callout">
              <Icon name="info" size={20} />
              <p>
                Keep a copy of important source text before removing
                punctuation, numbers, links, emails, HTML or duplicate lines.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="tool-section">
        <div className="wrap">
          <div className="related-heading">
            <div className="sh">
              <h2>Related Text Tools</h2>
            </div>
            <Link href="/tools/category/text" className="btn">
              View All Text Tools
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
            <h2>Text Cleaner FAQs</h2>
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
            <span className="mono-d category-mono-left">Aa</span>
            <span className="mono-d category-mono-right">clean</span>
            <h2>Explore More Text Tools</h2>
            <p>
              Discover free utilities for writing, formatting and everyday
              productivity.
            </p>
            <Link href="/tools/category/text" className="btn w">
              Explore Text Tools
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
    <article className="ide">
      <div className="ih">
        <i />
        <i />
        <i />
        <span>{title}</span>
      </div>
      <pre className="oc2">{code}</pre>
    </article>
  );
}
