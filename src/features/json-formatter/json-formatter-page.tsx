"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, type IconName } from "@/components/design/icon";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { tools } from "@/data/tools";
import { ExactToolCard } from "@/features/home/react-home-page";
import { JsonWorkspace } from "./json-workspace";

const tool = tools.find((item) => item.slug === "json-formatter")!;
const steps: Array<[IconName, string, string]> = [
  [
    "upload",
    "Paste or Upload JSON",
    "Add JSON data using the input editor or upload a JSON file.",
  ],
  [
    "sliders",
    "Choose Your Settings",
    "Select indentation and optional formatting preferences.",
  ],
  [
    "zap",
    "Format or Validate",
    "Choose the required action to process your JSON.",
  ],
  [
    "download",
    "Copy or Download",
    "Copy the result or download the formatted JSON file.",
  ],
];
const features: Array<[IconName, string, string]> = [
  ["spark", "JSON Beautification", "Make compact JSON easier to read."],
  [
    "shieldCheck",
    "JSON Validation",
    "Identify invalid JSON syntax without changing the input.",
  ],
  ["min", "JSON Minification", "Remove unnecessary whitespace."],
  ["sliders", "Custom Indentation", "Choose 2 spaces, 4 spaces or tabs."],
  ["share", "JSON Tree View", "Explore nested objects and arrays."],
  ["download", "Copy and Download", "Export processed JSON easily."],
];
const faqs = [
  [
    "What is a JSON formatter?",
    "A JSON formatter rewrites JSON text with consistent indentation and line breaks so its structure is easier to read. It changes whitespace only, not the data.",
  ],
  [
    "How do I format JSON online?",
    "Paste JSON into the input editor or upload a .json file, choose your indentation, then select Format JSON.",
  ],
  [
    "What is the difference between formatting and minifying JSON?",
    "Formatting adds indentation and line breaks. Minifying removes unnecessary whitespace. Both represent the same data.",
  ],
  [
    "How can I check whether my JSON is valid?",
    "Select Validate JSON. Valid syntax produces output; otherwise the tool reports the parsing error and location when available.",
  ],
  [
    "Does formatting change my JSON data?",
    "Whitespace changes do not alter data. Sort Keys changes object property order only. Duplicate keys and unsafe integers are rejected to avoid silent data loss.",
  ],
  [
    "Can I upload and download JSON files?",
    "Yes. Upload .json files up to 2 MB and download the valid processed result as formatted.json.",
  ],
  [
    "Is my JSON data sent to a server?",
    "No. Processing happens in a browser Web Worker. Input is neither uploaded nor stored in LocalStorage.",
  ],
  [
    "What is JSON Tree View?",
    "Tree View shows objects and arrays as an expandable hierarchy with Expand All and Collapse All controls.",
  ],
  [
    "Can I use the JSON formatter on mobile devices?",
    "Yes. The editors stack on smaller screens, though larger screens are more comfortable for large documents.",
  ],
] as const;

export function JsonFormatterPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const related = tools.filter(
    (item) => item.category === "developer" && item.id !== tool.id,
  );
  return (
    <ToolPageLayout
      tool={tool}
      icon="braces"
      heading="JSON Formatter & Validator"
      description="Format, beautify, minify and validate your JSON data with a fast and easy-to-use online JSON formatter."
    >
      <JsonWorkspace />
      <section className="tool-section">
        <div className="wrap">
          <div className="sh c">
            <h2>How to Format JSON Online</h2>
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
            <h2>Everything You Need to Work with JSON</h2>
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
            <h2>See the Difference</h2>
          </div>
          <div className="cmp">
            <CodeExample
              title="Before Formatting"
              code={
                '{"name":"ToolNest","free":true,"features":["Format","Validate"]}'
              }
            />
            <CodeExample
              title="After Formatting"
              code={
                '{\n  "name": "ToolNest",\n  "free": true,\n  "features": [\n    "Format",\n    "Validate"\n  ]\n}'
              }
            />
          </div>
          <p className="comparison-copy">
            Formatting changes whitespace only. Keys and values remain
            unchanged, so the structure becomes easier to read without changing
            the data.
          </p>
        </div>
      </section>
      <section className="tool-section">
        <div className="wrap">
          <div className="edu">
            <h2>Understanding JSON Formatting</h2>
            <h3>What Is a JSON Formatter?</h3>
            <p>
              A JSON formatter rewrites JSON text with consistent indentation
              and line breaks so its structure is easy to read.
            </p>
            <h3>What Is JSON?</h3>
            <p>
              JSON is a lightweight text format for structured data. It supports
              objects, arrays, strings, numbers, booleans and null. Strings and
              property names must use double quotes.
            </p>
            <h3>Formatting, Minification and Validation</h3>
            <p>
              Formatting adds whitespace for readability, minification removes
              it for compact delivery, and validation checks whether the text
              follows JSON grammar.
            </p>
            <h3>Numeric Precision and Duplicate Keys</h3>
            <p>
              JavaScript numbers use IEEE-754 precision. This tool rejects
              integers outside the safe range and duplicate object keys instead
              of silently rounding or overwriting data. Represent larger
              identifiers as quoted strings.
            </p>
            <div className="callout">
              <Icon name="alert" size={20} />
              <p>
                JSON is parsed as data only. It is never evaluated or executed
                as JavaScript.
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
            <h2>JSON Formatter FAQs</h2>
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
              Explore free utilities designed to simplify your everyday
              development workflow.
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
