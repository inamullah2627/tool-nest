"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, type IconName } from "@/components/design/icon";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { tools } from "@/data/tools";
import { ExactToolCard } from "@/features/home/react-home-page";
import { WordCounterWorkspace } from "./word-counter-workspace";

const tool = tools.find((item) => item.slug === "word-counter")!;
const steps: Array<[IconName, string, string]> = [
  ["edit", "Enter Your Text", "Type, paste or upload a plain text file."],
  [
    "zap",
    "View Live Statistics",
    "See counts update instantly as the text changes.",
  ],
  [
    "bar",
    "Analyze Your Writing",
    "Review timing, averages and keyword density.",
  ],
  ["download", "Copy or Download", "Export your text when you are finished."],
];
const features: Array<[IconName, string, string]> = [
  [
    "zap",
    "Real-Time Counting",
    "Get immediate results without submitting your text.",
  ],
  [
    "hash",
    "Character Counting",
    "Count Unicode characters with and without whitespace.",
  ],
  ["list", "Structure Analysis", "Measure sentences, paragraphs and lines."],
  [
    "clock",
    "Reading and Speaking Time",
    "Estimate reading at 200 WPM and speech at 130 WPM.",
  ],
  [
    "bar",
    "Keyword Frequency",
    "See case-insensitive frequency and density percentages.",
  ],
  [
    "shieldCheck",
    "Private Processing",
    "Keep all entered text inside your browser.",
  ],
];
const faqs = [
  [
    "How are words counted?",
    "Where supported, the tool uses Intl.Segmenter to identify language-aware word boundaries. A Unicode-aware letters-and-numbers fallback is used in older browsers.",
  ],
  [
    "Do character counts include emoji?",
    "Yes. Characters are counted as Unicode code points, so an emoji is generally one character. Combined emoji sequences may contain multiple code points.",
  ],
  [
    "How are sentences and paragraphs counted?",
    "Sentence boundaries use Intl.Segmenter when available, with punctuation-based fallback detection. Paragraphs are non-empty blocks separated by one or more blank lines.",
  ],
  [
    "How are reading and speaking times calculated?",
    "Reading time is word count divided by 200 words per minute. Speaking time uses 130 words per minute. Both are rounded up to the next second and are estimates.",
  ],
  [
    "What does keyword density mean?",
    "Density is a keyword’s case-insensitive occurrence count divided by the total word count, multiplied by 100. Excluding common words changes the displayed list, not the denominator.",
  ],
  [
    "Can I upload a text file?",
    "Yes. Plain .txt files up to 1 MB are supported. Files are read locally and are not uploaded.",
  ],
  [
    "Is my text saved?",
    "No. Entered text is held only in the current page session and is not uploaded or written to local storage.",
  ],
] as const;

export function WordCounterPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const related = tools.filter(
    (item) => item.category === "text" && item.id !== tool.id,
  );
  return (
    <ToolPageLayout
      tool={tool}
      icon="hash"
      heading="Free Online Word Counter"
      description="Instantly count words, characters, sentences and paragraphs while analyzing your text with detailed writing statistics."
    >
      <WordCounterWorkspace />
      <section className="tool-section">
        <div className="wrap">
          <div className="sh c">
            <h2>How to Use the Word Counter</h2>
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
            <h2>More Than Just a Word Counter</h2>
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
            <h2>Understanding Word Counts</h2>
            <h3>Counting conventions</h3>
            <p>
              Words are language-aware word-like segments where the browser
              supports them. The fallback recognizes Unicode letters, combining
              marks and numbers, including apostrophes and hyphens inside words.
              Punctuation and standalone emoji are not words.
            </p>
            <h3>Characters and text structure</h3>
            <p>
              The character count uses Unicode code points rather than UTF-16
              storage units. “Without whitespace” removes spaces, tabs and line
              breaks. Lines are separated by any common newline sequence, while
              paragraphs are non-empty text blocks separated by blank lines.
            </p>
            <h3>Estimation and keyword methods</h3>
            <p>
              Reading time assumes 200 words per minute and speaking time
              assumes 130. Keyword matching is case-insensitive. Density equals
              keyword occurrences divided by the total word count, multiplied by
              100. These values are guides; language, complexity and individual
              pace affect real results.
            </p>
            <div className="callout">
              <Icon name="info" size={20} />
              <p>
                Sentence boundaries and user-perceived characters can vary
                across languages and browsers, especially for abbreviations and
                multi-code-point emoji.
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
            <h2>Word Counter FAQs</h2>
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
            <span className="mono-d category-mono-right">#</span>
            <h2>Make Every Word Count</h2>
            <p>
              Explore free text utilities for writing, editing and content
              creation.
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
