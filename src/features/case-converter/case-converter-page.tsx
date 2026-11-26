"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, type IconName } from "@/components/design/icon";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { tools } from "@/data/tools";
import { ExactToolCard } from "@/features/home/react-home-page";
import { CASE_MODES, convertCase } from "@/lib/text/case-converter";
import { CaseConverterWorkspace } from "./case-converter-workspace";

const tool = tools.find((item) => item.slug === "case-converter")!;
const steps: Array<[IconName, string, string]> = [
  [
    "edit",
    "Enter Your Text",
    "Type, paste or upload the text you want to convert.",
  ],
  [
    "case",
    "Choose a Text Case",
    "Select one of twelve standard or developer case modes.",
  ],
  [
    "copy",
    "Copy or Download",
    "Use the instant result or save it as a text file.",
  ],
];
const features: Array<[IconName, string, string]> = [
  [
    "zap",
    "Instant Case Conversion",
    "Results update as you type or switch cases.",
  ],
  [
    "case",
    "12 Text Case Options",
    "Seven standard text cases and five developer formats.",
  ],
  [
    "code",
    "Developer Naming Formats",
    "Create camelCase, PascalCase, snake_case, kebab-case and CONSTANT_CASE.",
  ],
  [
    "bar",
    "Live Text Statistics",
    "See words, Unicode characters and lines for input and output.",
  ],
  [
    "upload",
    "File Upload and Download",
    "Load a local TXT file and save the converted result.",
  ],
  [
    "shieldCheck",
    "Browser-Based Processing",
    "Conversion stays in browser memory without a server upload.",
  ],
];
const faqs = [
  [
    "What is a Case Converter?",
    "A Case Converter changes capitalization or turns text into developer identifiers without requiring manual retyping.",
  ],
  [
    "What is the difference between sentence case and title case?",
    "Sentence case capitalizes sentence starts. Title Case capitalizes the first, last and principal words while leaving a defined list of minor words lowercase.",
  ],
  [
    "What is the difference between Title Case and Capitalized Case?",
    "Capitalized Case starts every recognized word with a capital. Title Case leaves common minor words such as ‘and’, ‘of’ and ‘the’ lowercase unless first or last.",
  ],
  [
    "How are alternating and inverse case defined?",
    "Alternating case starts the first cased character lowercase and alternates only across cased characters. Inverse case swaps each uppercase and lowercase character independently.",
  ],
  [
    "How are existing identifiers handled?",
    "Developer modes split spaces, hyphens, underscores, camelCase, PascalCase and common acronym boundaries before rebuilding each line.",
  ],
  [
    "Does it preserve punctuation and line breaks?",
    "Standard modes preserve punctuation and whitespace. Line breaks can optionally be joined. Developer modes remove separators and punctuation and create one identifier per line.",
  ],
  [
    "Does it support Unicode?",
    "It uses JavaScript Unicode case mapping and Unicode-aware matching. Many scripts work correctly, but locale-specific casing and word rules can differ.",
  ],
  [
    "Can I convert a text file?",
    "Yes. Plain TXT files up to 1 MB are read locally in your browser.",
  ],
  [
    "Is my text saved or uploaded?",
    "No. Text remains in the current browser page and is neither uploaded nor persisted by this tool.",
  ],
] as const;

export function CaseConverterPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const related = tools
    .filter((item) => item.category === "text" && item.id !== tool.id)
    .slice(0, 4);
  return (
    <ToolPageLayout
      tool={tool}
      icon="case"
      heading="Case Converter"
      description="Convert text to uppercase, lowercase, sentence case, title case and developer naming formats instantly."
    >
      <CaseConverterWorkspace />
      <section className="tool-section">
        <div className="wrap">
          <div className="sh c">
            <h2>How to Convert Text Case Online</h2>
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
            <h2>Powerful Text Case Conversion Features</h2>
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
            <h2>Text Case Conversion Examples</h2>
            <p>The same phrase converted using every supported mode.</p>
          </div>
          <div className="atb case-table">
            <table>
              <thead>
                <tr>
                  <th>Case</th>
                  <th>Result for “hello world”</th>
                </tr>
              </thead>
              <tbody>
                {CASE_MODES.map((mode) => (
                  <tr key={mode.id}>
                    <td>{mode.label}</td>
                    <td>
                      <code>{convertCase("hello world", mode.id)}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="tool-section">
        <div className="wrap">
          <div className="edu">
            <h2>Understanding Text Case Conversion</h2>
            <h3>Standard text cases</h3>
            <p>
              UPPERCASE and lowercase normalize every cased character. Sentence
              case lowercases the text before capitalizing recognized sentence
              starts. Capitalized Case capitalizes every recognized word.
              Alternating case follows a deterministic lower-then-upper
              sequence, while inverse case swaps each cased character.
            </p>
            <h3>Title Case conventions</h3>
            <p>
              ToolNest capitalizes the first and last word of each line plus all
              words except a defined English list of minor articles,
              conjunctions and short prepositions. Style guides disagree about
              capitalization, so treat this result as a consistent starting
              point rather than a universal publishing rule.
            </p>
            <h3>Developer naming conventions</h3>
            <p>
              Developer formats split spaces, punctuation, hyphens, underscores,
              existing lower-to-upper boundaries and common acronym boundaries.
              Each source line becomes a separate camelCase, PascalCase,
              snake_case, kebab-case or CONSTANT_CASE identifier.
            </p>
            <h3>Unicode and language limitations</h3>
            <p>
              The converter uses native JavaScript Unicode case mappings and
              Unicode property escapes. This supports accented letters and many
              writing systems, but it does not infer language or locale.
              Locale-sensitive rules such as Turkish dotted I, proper nouns,
              abbreviations and scripts without letter case may require manual
              review.
            </p>
            <div className="callout">
              <Icon name="info" size={20} />
              <p>
                Standard conversions preserve punctuation and whitespace.
                Developer conversions intentionally remove separators and
                punctuation while preserving line boundaries.
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
            <h2>Case Converter FAQs</h2>
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
            <span className="mono-d category-mono-right">aA</span>
            <h2>Explore More Text Tools</h2>
            <p>
              Discover free utilities that simplify writing, formatting and
              everyday text processing.
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
