"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, type IconName } from "@/components/design/icon";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { tools } from "@/data/tools";
import { DateDifferenceWorkspace } from "./date-difference-workspace";

const tool = tools.find((item) => item.slug === "date-difference-calculator")!;
const steps: Array<[IconName, string, string]> = [
  [
    "calendar",
    "Select Your Dates",
    "Choose a start date and end date using the date picker.",
  ],
  [
    "sliders",
    "Choose Calculation Options",
    "Select date difference, date arithmetic or business days.",
  ],
  [
    "check",
    "Calculate Your Results",
    "Review calendar duration, statistics and a copyable summary.",
  ],
];
const features: Array<[IconName, string, string]> = [
  [
    "calendar",
    "Accurate Date Difference",
    "Integer calendar-day arithmetic avoids timezone and daylight-saving errors.",
  ],
  [
    "list",
    "Years, Months and Days",
    "See complete calendar years and months plus remaining days.",
  ],
  [
    "plus",
    "Add and Subtract Dates",
    "Apply calendar years and months before exact weeks and days.",
  ],
  [
    "clock",
    "Business Day Calculation",
    "Count custom working days across short or very large ranges.",
  ],
  [
    "sliders",
    "Working Days and Holidays",
    "Choose your working week and manually exclude unique holidays.",
  ],
  [
    "shieldCheck",
    "Browser-Based",
    "Dates remain in browser memory and are never uploaded or persisted.",
  ],
];
const planned = [
  "Age Calculator",
  "Percentage Calculator",
  "Loan Calculator",
  "Discount Calculator",
  "BMI Calculator",
];
const faqs = [
  [
    "What is a Date Difference Calculator?",
    "A Date Difference Calculator works out how much time lies between two calendar dates, in days, weeks, months and years. This one can also add or subtract time from a date and count business days.",
  ],
  [
    "How do I calculate the number of days between two dates?",
    "Choose a start date and an end date in Date Difference mode, then select Calculate Difference. The total days and detailed breakdown appear in the results.",
  ],
  [
    "Can I calculate the difference in years, months and days?",
    "Yes. Calendar duration shows complete years, complete months and remaining days using real calendar lengths.",
  ],
  [
    "Does the calculator include the end date?",
    "Not by default. Enable Include End Date to add the final calendar day to the counted range.",
  ],
  [
    "What happens if the start and end dates are the same?",
    "The exclusive result is 0 days. With Include End Date enabled, the single date counts as 1 day.",
  ],
  [
    "Can I calculate a future date by adding days?",
    "Yes. Use Add / Subtract Dates, choose Add, and enter days, weeks, months or years.",
  ],
  [
    "Can I subtract months or years from a date?",
    "Yes. Choose Subtract. Calendar years and months are applied first, followed by weeks and days.",
  ],
  [
    "Does the calculator account for leap years?",
    "Yes. Gregorian leap-year rules and February 29 are handled automatically.",
  ],
  [
    "What happens when adding one month to January 31?",
    "The result uses the last available day of the target month: February 28, or February 29 in a leap year.",
  ],
  [
    "How do I calculate business days between two dates?",
    "Switch to Business Days, choose the range and working days, optionally add holidays, then calculate.",
  ],
  [
    "Can I exclude weekends and holidays?",
    "Yes. Weekends are excluded by the selected working week, and holidays can be entered manually.",
  ],
  [
    "Can I customize my working days?",
    "Yes. Select any combination of Sunday through Saturday. At least one working day is required.",
  ],
  [
    "Does the calculator account for time zones?",
    "No. The calculator works with whole calendar dates, not timezone-aware timestamps or elapsed clock hours.",
  ],
  [
    "Is this Date Difference Calculator free?",
    "Yes. It is free to use and does not require registration.",
  ],
  [
    "Are my dates uploaded to a server?",
    "No. All calculations happen locally and entered dates are not persisted.",
  ],
] as const;

export function DateDifferenceCalculatorPage() {
  const [openFaq, setOpenFaq] = useState(0);
  return (
    <ToolPageLayout
      tool={tool}
      icon="clock"
      heading="Date Difference Calculator"
      description="Calculate the exact difference between two dates in years, months, weeks and days. Add or subtract dates and calculate weekdays with our free online Date Difference Calculator."
    >
      <DateDifferenceWorkspace />
      <section className="tool-section">
        <div className="wrap">
          <div className="sh c">
            <h2>How to Calculate the Difference Between Two Dates</h2>
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
            <h2>Powerful Date Calculation Features</h2>
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
            <h2>Date Difference Calculator Examples</h2>
          </div>
          <div className="tblw">
            <table className="stbl">
              <thead>
                <tr>
                  <th>Calculation</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>January 1–31, 2025</td>
                  <td>
                    <code>30 days</code>
                  </td>
                </tr>
                <tr>
                  <td>January 1, 2025–January 1, 2026</td>
                  <td>
                    <code>365 days</code>
                  </td>
                </tr>
                <tr>
                  <td>January 1, 2024–January 1, 2025</td>
                  <td>
                    <code>366 days</code>
                  </td>
                </tr>
                <tr>
                  <td>March 1–15, 2026</td>
                  <td>
                    <code>14 days</code>
                  </td>
                </tr>
                <tr>
                  <td>January 1, 2026 + 30 days</td>
                  <td>
                    <code>January 31, 2026</code>
                  </td>
                </tr>
                <tr>
                  <td>January 31, 2025 + 1 month</td>
                  <td>
                    <code>February 28, 2025</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="examples-note">
            Examples exclude the end date unless stated otherwise. Enable
            Include End Date when both boundary dates should count.
          </p>
        </div>
      </section>
      <section className="tool-section">
        <div className="wrap">
          <div className="edu">
            <h2>Understanding Date Calculations</h2>
            <h3>Calendar dates, not elapsed timestamps</h3>
            <p>
              ToolNest assigns each date an integer day number in the proleptic
              Gregorian calendar. A calendar day is a date boundary—not
              necessarily 24 elapsed clock hours in a timezone—so
              daylight-saving transitions cannot change the answer.
            </p>
            <h3>Years, months and remaining days</h3>
            <p>
              Calendar duration counts complete real calendar months from the
              earlier boundary, then reports remaining days. Months are not
              treated as 30-day blocks and years are not treated as 365-day
              blocks.
            </p>
            <h3>Addition and subtraction order</h3>
            <p>
              Years and months are combined and applied first using calendar
              arithmetic. If the target month is shorter, its final day is used.
              Weeks and days are then applied as exact calendar days.
            </p>
            <h3>Inclusive, reversed and identical ranges</h3>
            <p>
              The end date is excluded by default. Reversed ranges produce the
              same positive magnitude with a direction notice. Identical dates
              produce zero days exclusively or one day inclusively.
            </p>
            <h3>Business days and holidays</h3>
            <p>
              Full weeks are counted mathematically for efficiency; only the
              remaining partial week is inspected. Manual holidays are
              deduplicated, and only dates inside the range on working days are
              subtracted.
            </p>
            <div className="callout">
              <Icon name="info" size={20} />
              <p>
                For legal, financial or contractual deadlines, confirm the
                applicable inclusion, holiday and jurisdiction rules
                independently.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="tool-section">
        <div className="wrap">
          <div className="related-heading">
            <div className="sh">
              <h2>Related Calculators</h2>
            </div>
            <Link className="btn" href="/tools/category/calculators">
              View All Calculators
            </Link>
          </div>
          <div className="fcg">
            {planned.map((name) => (
              <article className="tc" key={name}>
                <div className="top">
                  <span className="cico">
                    <Icon name="calc" />
                  </span>
                  <span className="soon">Coming Soon</span>
                </div>
                <h3>{name}</h3>
                <p>Additional calculator planned for a future release.</p>
                <span className="cat">Calculators</span>
                <span className="use unavailable">Coming Soon</span>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="tool-section">
        <div className="wrap">
          <div className="sh c">
            <h2>Date Difference Calculator FAQs</h2>
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
            <span className="mono-d category-mono-left">123</span>
            <span className="mono-d category-mono-right">days</span>
            <h2>Explore More Online Calculators</h2>
            <p>
              Discover free online calculators that simplify everyday
              calculations, planning and decision-making.
            </p>
            <Link className="btn w" href="/tools/category/calculators">
              Explore Calculators
            </Link>
            <Link className="sl" href="/tools">
              View All Tools
            </Link>
          </div>
        </div>
      </section>
    </ToolPageLayout>
  );
}
