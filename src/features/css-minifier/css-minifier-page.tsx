"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, type IconName } from "@/components/design/icon";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { tools } from "@/data/tools";
import { ExactToolCard } from "@/features/home/react-home-page";
import { CssWorkspace } from "./css-workspace";

const tool = tools.find((item) => item.slug === "css-minifier")!;
const before = `/* Card component */
.card {
  display: flex;
  padding: 24px;
  background-color: #ffffff;
}`;
const after = ".card{display:flex;padding:24px;background-color:#fff}";
const steps: Array<[IconName, string, string]> = [
  ["edit", "Enter Your CSS", "Paste CSS code or upload a local stylesheet."],
  [
    "min",
    "Minify Your Code",
    "Choose comment preferences and run conservative minification.",
  ],
  [
    "download",
    "Copy or Download",
    "Review the result and export the processed CSS.",
  ],
];
const features: Array<[IconName, string, string]> = [
  [
    "min",
    "CSS Minification",
    "Remove unnecessary whitespace and eligible comments.",
  ],
  [
    "spark",
    "CSS Beautification",
    "Turn compact CSS into consistently indented source.",
  ],
  [
    "bar",
    "File Size Reduction",
    "See UTF-8 sizes, bytes saved and the exact percentage.",
  ],
  ["code", "Syntax Highlighting", "Review CSS output as safe, readable text."],
  [
    "download",
    "File Upload and Download",
    "Open a CSS file and export the processed result.",
  ],
  [
    "shieldCheck",
    "Browser-Based Processing",
    "Keep stylesheets in browser memory without applying them.",
  ],
];
const faqs = [
  [
    "What is a CSS Minifier?",
    "A CSS minifier parses a stylesheet and removes characters browsers do not need, producing a smaller delivery file.",
  ],
  [
    "Does minification change rule order?",
    "ToolNest disables CSSO restructuring and unsafe media merging. Rules remain in source order, although safe value-level normalization may occur.",
  ],
  [
    "What happens to comments?",
    "Regular comments are removed. By default, /*! comments and comments containing @license or @preserve are retained. You can disable license-comment preservation.",
  ],
  [
    "Does it preserve custom properties and calc()?",
    "CSSO parses these constructs as CSS and preserves their meaning. Strings, URLs and whitespace-sensitive values are handled by the parser rather than regex minification.",
  ],
  [
    "What is the difference between minification and beautification?",
    "Minification creates compact delivery CSS. Beautification adds indentation and line breaks for human editing.",
  ],
  [
    "Can I upload an entire stylesheet?",
    "Yes. Standard .css files up to 2 MB are read locally in your browser.",
  ],
  [
    "Does it support SCSS, Sass or Less?",
    "No. This page processes standard CSS only and does not compile preprocessor variables, mixins or functions. Native nesting and range-style media queries are rejected because this CSSO version cannot preserve them safely.",
  ],
  [
    "Can CSS URLs load external resources here?",
    "No. Input and output are displayed only as text. ToolNest never injects the stylesheet or fetches referenced resources.",
  ],
  [
    "Is my CSS uploaded or stored?",
    "No. Processing runs locally in a browser Worker, and entered code is not uploaded or persisted.",
  ],
] as const;

export function CssMinifierPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const related = tools
    .filter((item) => item.category === "developer" && item.id !== tool.id)
    .slice(0, 4);
  return (
    <ToolPageLayout
      tool={tool}
      icon="min"
      heading="CSS Minifier"
      description="Minify and compress CSS code online while preserving cascade behavior with conservative browser-side processing."
    >
      <CssWorkspace />
      <section className="tool-section">
        <div className="wrap">
          <div className="sh c">
            <h2>How to Minify CSS Online</h2>
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
            <h2>Powerful CSS Minification Features</h2>
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
            <h2>CSS Minification Example</h2>
          </div>
          <div className="cmp cm2">
            <CodeExample title="Before Minification" code={before} />
            <CodeExample title="After Minification" code={after} />
          </div>
          <p className="example-note">
            Minification removes the regular comment and unnecessary formatting
            while retaining rule order and declaration meaning.
          </p>
        </div>
      </section>
      <section className="tool-section">
        <div className="wrap">
          <div className="edu">
            <h2>Understanding CSS Minification</h2>
            <h3>What Is a CSS Minifier?</h3>
            <p>
              A CSS-aware minifier parses stylesheet syntax before removing
              unnecessary characters. This lets it distinguish declarations from
              strings, comments, URLs, functions and custom properties.
            </p>
            <h3>Conservative optimization</h3>
            <p>
              ToolNest uses CSSO with structural optimization disabled. Rules
              and media blocks are not merged or reordered. CSSO can still
              perform safe token and value normalization, such as shortening
              colors, so always test production output in the target website.
            </p>
            <h3>Comments and licenses</h3>
            <p>
              Regular comments are removed. License comments beginning with{" "}
              <code>{"/*!"}</code> and comments containing <code>@license</code>{" "}
              or <code>@preserve</code> remain by default. The setting can
              remove all comments when project requirements allow it.
            </p>
            <h3>CSS beautification</h3>
            <p>
              The existing js-beautify CSS processor adds readable indentation
              using two spaces, four spaces or tabs. Beautification is for
              editing; minification is intended for delivery.
            </p>
            <h3>Supported syntax</h3>
            <p>
              Standard CSS, custom properties, traditional media queries,
              keyframes and modern functions are parsed by CSSO. Native CSS
              nesting and range-style media queries are rejected because this
              CSSO version cannot preserve them safely. SCSS, Sass and Less
              compilation, CSS validation, source maps, unused-rule removal and
              browser-prefix generation are outside this tool’s scope.
            </p>
            <div className="callout">
              <Icon name="info" size={20} />
              <p>
                Keep readable source files and test minified output before
                deployment. This tool does not apply CSS or resolve any URL
                found in it.
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
            <h2>CSS Minifier FAQs</h2>
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
            <span className="mono-d category-mono-right">.css</span>
            <h2>Explore More Developer Tools</h2>
            <p>
              Discover free utilities for formatting, optimizing and simplifying
              everyday development work.
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
