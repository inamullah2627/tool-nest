"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, type IconName } from "@/components/design/icon";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { tools } from "@/data/tools";
import { ExactToolCard } from "@/features/home/react-home-page";
import { DuplicateLinesWorkspace } from "./duplicate-lines-workspace";

const tool = tools.find((item) => item.slug === "remove-duplicate-lines")!;
const sample =
  "Apple\nBanana\nOrange\nApple\nMango\nBanana\nGrapes\nOrange\nPineapple\nMango";
const cleaned = "Apple\nBanana\nOrange\nMango\nGrapes\nPineapple";
const steps: Array<[IconName, string, string]> = [
  ["edit", "Enter Your Text", "Paste a list or upload a local TXT file."],
  [
    "sliders",
    "Choose Removal Options",
    "Configure matching, occurrence, sorting and output mode.",
  ],
  [
    "copy",
    "Remove and Copy",
    "Process the lines, review statistics and export the result.",
  ],
];
const features: Array<[IconName, string, string]> = [
  [
    "zap",
    "Efficient Duplicate Removal",
    "Clean large line-based lists with Map and Set processing.",
  ],
  [
    "case",
    "Case Matching",
    "Treat Apple and apple as different lines or as duplicates.",
  ],
  [
    "align",
    "Whitespace Handling",
    "Ignore surrounding spaces and optionally remove empty lines.",
  ],
  [
    "list",
    "Five Sorting Options",
    "Preserve order or sort alphabetically or by Unicode length.",
  ],
  [
    "layers",
    "Three Output Modes",
    "Return unique, duplicate-only or non-repeated lines.",
  ],
  [
    "shieldCheck",
    "Browser-Based Processing",
    "Keep entered text in the current browser page.",
  ],
];
const faqs = [
  [
    "What is a duplicate line remover?",
    "It compares complete text lines and removes or extracts entries according to their occurrence count.",
  ],
  [
    "Can I preserve the original order?",
    "Yes. Preserve Original Order retains first-occurrence order when keeping first, or last-occurrence order when keeping last.",
  ],
  [
    "What is case-insensitive matching?",
    "Apple and apple share the same comparison key, while the retained line keeps its original capitalization.",
  ],
  [
    "How are surrounding spaces handled?",
    "When ignored, spaces are removed only from the comparison key. The retained original line is not trimmed or rewritten.",
  ],
  [
    "What are Duplicate Lines Only and Non-Repeated Lines Only?",
    "Duplicate Lines Only returns one representative of every line appearing more than once. Non-Repeated returns only lines appearing exactly once.",
  ],
  [
    "How are empty lines counted?",
    "Blank and whitespace-only lines are counted as empty. If removal is enabled, they are excluded before duplicate grouping and reported separately.",
  ],
  [
    "Are trailing newlines counted as extra lines?",
    "A single final newline terminates the last line and does not create an extra entry. Additional trailing blank lines remain countable entries.",
  ],
  [
    "Can I sort the output?",
    "Yes. Options are original order, A–Z, Z–A, shortest first and longest first. Ties use deterministic character ordering.",
  ],
  [
    "Can I upload a text file?",
    "Yes. Plain TXT files up to 1 MB are read locally.",
  ],
  [
    "Does it parse CSV columns?",
    "No. Every complete line is treated as one value; quoted CSV fields and individual columns are not parsed.",
  ],
  [
    "Is my text uploaded or saved?",
    "No. Text remains in browser memory and is neither uploaded nor persisted by this tool.",
  ],
] as const;

export function DuplicateLinesPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const related = tools
    .filter((item) => item.category === "text" && item.id !== tool.id)
    .slice(0, 4);
  return (
    <ToolPageLayout
      tool={tool}
      icon="list"
      heading="Remove Duplicate Lines"
      description="Remove repeated lines, extract duplicates or keep non-repeated entries with precise matching and sorting controls."
    >
      <DuplicateLinesWorkspace />
      <section className="tool-section">
        <div className="wrap">
          <div className="sh c">
            <h2>How to Remove Duplicate Lines Online</h2>
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
            <h2>Powerful Duplicate Line Removal Features</h2>
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
            <h2>Duplicate Line Removal Example</h2>
          </div>
          <div className="cmp dlx">
            <CodeExample
              title="Before Removing Duplicates · 10 lines"
              code={sample}
            />
            <CodeExample
              title="After Removing Duplicates · 6 lines"
              code={cleaned}
            />
          </div>
          <p className="dlc">
            Four repeated occurrences are removed while the first original
            occurrence of each fruit remains in its original order.
          </p>
        </div>
      </section>
      <section className="tool-section">
        <div className="wrap">
          <div className="edu">
            <h2>Understanding Duplicate Line Removal</h2>
            <h3>How duplicate detection works</h3>
            <p>
              Each line receives a comparison key. Depending on the settings,
              that key can ignore surrounding spaces and letter case. Map
              entries store counts plus first and last occurrences, while a Set
              tracks distinct comparison keys efficiently.
            </p>
            <h3>Original content and order</h3>
            <p>
              Comparison normalization never rewrites retained content. Keeping
              first returns the first original line and its occurrence order.
              Keeping last returns the last original line and orders retained
              entries by their last positions unless sorting is selected.
            </p>
            <h3>Three output modes</h3>
            <ul>
              <li>
                <strong>Unique Lines:</strong> one representative of every
                distinct line.
              </li>
              <li>
                <strong>Duplicate Lines Only:</strong> one representative of
                every line occurring more than once.
              </li>
              <li>
                <strong>Non-Repeated Lines Only:</strong> only lines occurring
                exactly once.
              </li>
            </ul>
            <h3>Statistics</h3>
            <p>
              Duplicate occurrences count repeated copies beyond the first
              representative. Empty lines removed are counted separately and
              never added to duplicate occurrences. Total removal and percentage
              compare original input entries with final output entries,
              including filtering caused by the selected output mode.
            </p>
            <h3>Line-ending conventions</h3>
            <p>
              LF and CRLF inputs are accepted and output uses LF. A single
              terminal newline is treated as a terminator, not another line.
              Whitespace-only lines count as empty, and Unicode characters are
              preserved exactly in retained lines.
            </p>
            <div className="callout">
              <Icon name="info" size={20} />
              <p>
                This is a whole-line tool, not a structured CSV parser. Sorting
                changes output order only when explicitly selected.
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
            <h2>Remove Duplicate Lines FAQs</h2>
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
            <span className="mono-d category-mono-left">≠</span>
            <span className="mono-d category-mono-right">≡</span>
            <h2>Explore More Text Tools</h2>
            <p>
              Discover free utilities that simplify text editing, formatting and
              everyday productivity.
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
    <div className="ide">
      <div className="ih">
        <i />
        <i />
        <i />
        <span>{title}</span>
      </div>
      <pre className="oc2">
        <code>{code}</code>
      </pre>
    </div>
  );
}
