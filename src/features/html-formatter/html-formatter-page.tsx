"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, type IconName } from "@/components/design/icon";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { tools } from "@/data/tools";
import { ExactToolCard } from "@/features/home/react-home-page";
import { HtmlWorkspace } from "./html-workspace";

const tool = tools.find((item) => item.slug === "html-formatter")!;
const sample =
  '<div class="container"><h1>Hello ToolNest</h1><p>Format your HTML code easily.</p></div>';
const formatted =
  '<div class="container">\n  <h1>Hello ToolNest</h1>\n  <p>Format your HTML code easily.</p>\n</div>';
const steps: Array<[IconName, string, string]> = [
  [
    "edit",
    "Enter Your HTML",
    "Paste HTML into the editor or upload an .html or .htm file.",
  ],
  [
    "sliders",
    "Choose Formatting Options",
    "Select indentation, wrapping and conservative preservation options.",
  ],
  [
    "zap",
    "Format and Copy",
    "Format or minify locally, then copy or download the result.",
  ],
];
const features: Array<[IconName, string, string]> = [
  [
    "spark",
    "HTML Beautification",
    "Add consistent indentation and line breaks.",
  ],
  [
    "min",
    "Conservative Minification",
    "Reduce safe whitespace without removing comments, tags or attributes.",
  ],
  [
    "sliders",
    "Custom Formatting",
    "Choose indentation, line wrapping and preservation settings.",
  ],
  [
    "code",
    "Syntax Highlighting",
    "Review tags, attributes and values in readable colors.",
  ],
  [
    "download",
    "File Actions",
    "Upload HTML and copy or download processed output.",
  ],
  [
    "shieldCheck",
    "Browser Processing",
    "Keep source code in browser memory without rendering it.",
  ],
];
const faqs = [
  [
    "What is an HTML formatter?",
    "It rewrites HTML with consistent indentation and line breaks so the document structure is easier to read.",
  ],
  [
    "Does formatting repair invalid HTML?",
    "No. Formatting changes code layout; it is not an HTML validator or repair engine.",
  ],
  [
    "What does conservative minification change?",
    "It collapses safe whitespace while retaining comments, attributes, optional tags and embedded CSS or JavaScript source.",
  ],
  [
    "Are inline spaces and preformatted text preserved?",
    "The processors account for inline text and preserve content inside pre and textarea elements, but you should review output for template-specific behavior.",
  ],
  [
    "Can it format CSS and JavaScript inside HTML?",
    "Yes. Embedded formatting can be enabled for style and script elements. Disable it for unsupported template or language syntax.",
  ],
  ["Which files can I upload?", "HTML and HTM files up to 2 MB are supported."],
  [
    "Is code uploaded or executed?",
    "No. Processing happens locally in a Web Worker. Input is displayed as text and is never rendered as active HTML.",
  ],
  [
    "Does minification remove comments?",
    "No. Comments are retained by the conservative defaults because some projects use comments as directives or template markers.",
  ],
  [
    "Can I format template syntax?",
    "Common Django, ERB, Handlebars and PHP-style template markers are recognized by the formatter. Framework-specific edge cases may still require ignore or preserve directives.",
  ],
  [
    "Can I use it on mobile?",
    "Yes. The editors stack responsively, although large documents are more comfortable on a desktop screen.",
  ],
] as const;

export function HtmlFormatterPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const related = tools
    .filter((item) => item.category === "developer" && item.id !== tool.id)
    .slice(0, 3);
  return (
    <ToolPageLayout
      tool={tool}
      icon="html"
      heading="HTML Formatter"
      description="Format, beautify and conservatively minify HTML code directly in your browser."
    >
      <HtmlWorkspace />
      <section className="tool-section">
        <div className="wrap">
          <div className="sh c">
            <h2>How to Format HTML Online</h2>
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
            <h2>Powerful HTML Formatting Features</h2>
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
            <h2>HTML Formatting Example</h2>
          </div>
          <div className="cmp">
            <CodeExample title="Before Formatting" code={sample} />
            <CodeExample title="After Formatting" code={formatted} />
          </div>
          <p className="comparison-copy">
            Formatting reorganizes whitespace for readability. It does not
            render the code, validate document semantics or execute embedded
            content.
          </p>
        </div>
      </section>
      <section className="tool-section">
        <div className="wrap">
          <div className="edu">
            <h2>Understanding HTML Formatting</h2>
            <h3>What Is an HTML Formatter?</h3>
            <p>
              An HTML formatter applies consistent indentation and line breaks
              while keeping elements, attributes and text intact. This makes
              nested markup easier to inspect and maintain.
            </p>
            <h3>Formatting and Minification</h3>
            <p>
              Formatting adds whitespace for people. Minification removes safe
              whitespace for smaller delivery. ToolNest uses conservative
              minification: comments, attribute quotes, optional tags and
              embedded code are retained.
            </p>
            <h3>Whitespace-Sensitive Content</h3>
            <p>
              Spaces can affect inline text, and content inside pre or textarea
              is intentionally significant. The selected libraries preserve
              these cases, but templates and custom elements should always be
              reviewed after processing.
            </p>
            <h3>Templates and Embedded Code</h3>
            <p>
              Common template markers are supported by the formatter. Embedded
              CSS and JavaScript formatting is optional because
              framework-specific script types and template expressions may
              require their original layout.
            </p>
            <div className="callout">
              <Icon name="alert" size={20} />
              <p>
                Formatting does not validate or repair HTML. Test processed
                markup in the actual target project before deployment.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="tool-section">
        <div className="wrap">
          <div className="related-heading">
            <div className="sh">
              <h2>Related Developer Tools</h2>
            </div>
            <Link href="/tools/category/developer" className="btn">
              View All Developer Tools
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
            <h2>HTML Formatter FAQs</h2>
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
            <span className="mono-d category-mono-left">{"{ }"}</span>
            <span className="mono-d category-mono-right">{"</>"}</span>
            <h2>Discover More Developer Tools</h2>
            <p>
              Explore free utilities designed to simplify your development
              workflow.
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
