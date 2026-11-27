import type { IconName } from "@/components/design/icon";
import type { CategoryId } from "@/types/tool";

export type CategoryConfig = {
  slug: CategoryId;
  label: string;
  heading: string;
  lead: string;
  button: string;
  comingSoon: boolean;
  groups: string[];
  exploreHeading?: string;
  exploreText: string;
  preview: "code" | "text" | "seo" | "image" | "pdf" | "calculator";
  featuresHeading: string;
  featuresText: string;
  features: Array<[IconName, string, string]>;
  stepsHeading: string;
  steps: Array<[IconName, string, string]>;
  educationHeading: string;
  education: Array<[string, string]>;
  callout: string;
  faqHeading: string;
  faqs: Array<[string, string]>;
  ctaHeading: string;
  ctaText: string;
};

const activeFaq = (name: string): Array<[string, string]> => [
  [
    `What are online ${name.toLowerCase()}?`,
    `They are browser-based utilities for common ${name.toLowerCase()} tasks, available without installing software.`,
  ],
  [
    `Are ToolNest ${name.toLowerCase()} free?`,
    "Yes. The tools are free to use, with no subscription or registration required.",
  ],
  [
    "Is my data stored or shared?",
    "Where a tool supports it, processing is designed to happen in your browser. Avoid entering passwords, private keys or confidential information into any online utility.",
  ],
  [
    `Can I use ${name.toLowerCase()} on mobile devices?`,
    "Yes. The layout is responsive and works on phones and tablets.",
  ],
];

const plannedFaq = (name: string, list: string): Array<[string, string]> => [
  [
    `Are ${name} available now?`,
    `No. ${name[0].toUpperCase()}${name.slice(1)} are planned and not yet available.`,
  ],
  [`Which ${name} are planned?`, list],
  [
    `Will the ${name} be free?`,
    "Our intention is to offer essential utilities without mandatory accounts, but final details have not been confirmed.",
  ],
  [
    `When will the ${name} launch?`,
    "No release date has been set. Details may change as the tools are designed.",
  ],
  [
    "Can I suggest a tool?",
    "Yes. Use the Suggest a Tool link to tell us what you would like to see.",
  ],
];

const plannedCta =
  "Explore the free utilities available today while we build what comes next.";

export const categoryConfigs: Record<CategoryId, CategoryConfig> = {
  developer: {
    slug: "developer",
    label: "DEVELOPER TOOLKIT",
    heading: "Free Online Developer Tools",
    lead: "Format, optimize, encode and transform your code with powerful browser-based tools built for modern developers.",
    button: "Browse Developer Tools",
    comingSoon: false,
    groups: ["Formatter", "Minifier", "Encoder & Decoder"],
    exploreText: "Find the right utility for your development workflow.",
    preview: "code",
    featuresHeading: "Built for a Better Development Workflow",
    featuresText: "Spend less time on repetitive tasks and more time building.",
    features: [
      [
        "zap",
        "Fast and Lightweight",
        "Quickly access essential utilities without installing additional software.",
      ],
      [
        "shieldCheck",
        "Privacy-Focused",
        "Designed for local browser processing wherever technically supported.",
      ],
      [
        "code",
        "Developer-Friendly",
        "Clean interfaces, readable code and straightforward workflows.",
      ],
      [
        "globe",
        "Free and Accessible",
        "Use essential developer utilities without subscriptions or mandatory accounts.",
      ],
    ],
    stepsHeading: "From Input to Output in Three Simple Steps",
    steps: [
      [
        "cursor",
        "Choose a Tool",
        "Select the developer utility that matches your task.",
      ],
      [
        "edit",
        "Add Your Input",
        "Paste your code, text or data into the tool interface.",
      ],
      [
        "check",
        "Get Your Result",
        "Process your input and copy or download the result where supported.",
      ],
    ],
    educationHeading: "Essential Online Tools for Developers",
    education: [
      [
        "What Are Online Developer Tools?",
        "Online developer tools are small, focused utilities that run in your browser and handle routine tasks such as tidying code, shrinking files or converting data.",
      ],
      [
        "Why Are Code Formatting Tools Useful?",
        "Formatting adds consistent indentation and line breaks, which makes code easier to read and review. Minification removes whitespace and comments so files are smaller to deliver.",
      ],
      [
        "Understanding Encoding and Decoding",
        "Base64 represents data using readable characters, while URL encoding replaces reserved characters so they can travel safely inside a web address. Both are reversible transformations, not encryption.",
      ],
      [
        "Improving Your Everyday Development Workflow",
        "Keeping reliable utilities one click away shortens small interruptions and works on any device with a modern browser.",
      ],
    ],
    callout:
      "Encoding is not encryption. Avoid pasting secrets into any online tool unless you are sure how it handles your data.",
    faqHeading: "Developer Tools FAQs",
    faqs: [
      ...activeFaq("developer tools"),
      [
        "What is the difference between formatting and minification?",
        "Formatting makes code easier for people to read. Minification removes unnecessary characters to reduce file size.",
      ],
    ],
    ctaHeading: "Build Smarter. Work Faster.",
    ctaText:
      "Discover more free online utilities designed to simplify your everyday workflow.",
  },
  text: {
    slug: "text",
    label: "TEXT PRODUCTIVITY TOOLKIT",
    heading: "Free Online Text Tools",
    lead: "Transform, clean, format and analyze your text with simple and powerful online utilities.",
    button: "Browse Text Tools",
    comingSoon: false,
    groups: [
      "Text Analysis",
      "Text Formatting",
      "Text Cleaning",
      "Text Generators",
    ],
    exploreText:
      "Find the right utility for writing, editing and cleaning text.",
    preview: "text",
    featuresHeading: "Built for Smoother Writing and Editing",
    featuresText: "Spend less time fixing text and more time on your ideas.",
    features: [
      [
        "zap",
        "Quick Text Edits",
        "Clean up or reshape text in moments without opening a word processor.",
      ],
      [
        "edit",
        "Made for Writers",
        "Simple, distraction-free interfaces suited to drafting, editing and proofreading.",
      ],
      [
        "check",
        "Clear, Readable Results",
        "Outputs are laid out so you can review and copy them easily.",
      ],
      [
        "globe",
        "Free and Accessible",
        "Use everyday text utilities without subscriptions or mandatory accounts.",
      ],
    ],
    stepsHeading: "From Raw Text to Polished Result in Three Steps",
    steps: [
      [
        "cursor",
        "Choose a Tool",
        "Pick the text utility that fits what you need to do.",
      ],
      [
        "edit",
        "Add Your Text",
        "Paste or type your content into the tool interface.",
      ],
      [
        "check",
        "Copy Your Result",
        "Review the output and copy it where supported.",
      ],
    ],
    educationHeading: "Essential Online Tools for Text Work",
    education: [
      [
        "What Are Online Text Tools?",
        "Online text tools are small utilities that analyze, transform or clean text directly in your browser.",
      ],
      [
        "Why Are Text Analysis and Formatting Tools Useful?",
        "Word counters help with limits, while case converters quickly fix inconsistent capitalization.",
      ],
      [
        "Cleaning and Organizing Text",
        "Cleaning tools remove extra spaces, stray line breaks or repeated lines so content is easier to work with.",
      ],
      [
        "Placeholder Text and Everyday Writing Workflows",
        "Placeholder text helps teams judge layout and typography before final copy is ready.",
      ],
    ],
    callout:
      "Review the output before you use it. Automated cleanup can remove characters or lines you meant to keep.",
    faqHeading: "Text Tools FAQs",
    faqs: activeFaq("text tools"),
    ctaHeading: "Write Clearly. Edit Faster.",
    ctaText:
      "Explore more free online utilities for your writing and everyday digital tasks.",
  },
  seo: {
    slug: "seo",
    label: "SEO OPTIMIZATION TOOLKIT",
    heading: "Free Online SEO Tools",
    lead: "Optimize your website content, metadata and search visibility with essential SEO utilities.",
    button: "Browse SEO Tools",
    comingSoon: false,
    groups: [
      "Metadata",
      "Content Analysis",
      "URL Optimization",
      "Technical SEO",
    ],
    exploreText:
      "Find the right utility for metadata, content and technical SEO.",
    preview: "seo",
    featuresHeading: "Built for Smarter Search Optimization",
    featuresText:
      "Spend less time on repetitive setup and more time on quality content.",
    features: [
      [
        "zap",
        "Essential SEO Utilities",
        "Handle common optimization tasks without installing extra software.",
      ],
      [
        "check",
        "Clear, Practical Output",
        "Generate snippets and settings that are straightforward to review and copy.",
      ],
      [
        "user",
        "Built for Website Owners",
        "Simple workflows for marketers, bloggers and developers alike.",
      ],
      [
        "globe",
        "Free and Accessible",
        "Use essential SEO utilities without subscriptions or mandatory accounts.",
      ],
    ],
    stepsHeading: "From Page Details to Ready-to-Use Output",
    steps: [
      [
        "cursor",
        "Choose a Tool",
        "Select the SEO utility that matches your task.",
      ],
      [
        "edit",
        "Add Your Details",
        "Enter your page information, text or website settings.",
      ],
      [
        "check",
        "Copy Your Output",
        "Review the generated result and copy it into your website.",
      ],
    ],
    educationHeading: "Essential Online Tools for SEO",
    education: [
      [
        "What Are Online SEO Tools?",
        "Online SEO tools help prepare page titles, descriptions, URLs and crawler instructions.",
      ],
      [
        "Why Do Metadata and Open Graph Tags Matter?",
        "Metadata shapes search results and social previews, helping people understand a page before they click.",
      ],
      [
        "Keywords, Slugs and Crawler Rules",
        "Analysis highlights repetition, clean slugs improve readability, and robots.txt gives crawlers request guidance.",
      ],
      [
        "Building a Repeatable SEO Workflow",
        "Checking metadata, copy and URLs before publishing makes every page more consistent.",
      ],
    ],
    callout:
      "No tool can guarantee search rankings. Treat these utilities as helpers for good on-page practice, not shortcuts.",
    faqHeading: "SEO Tools FAQs",
    faqs: activeFaq("SEO tools"),
    ctaHeading: "Optimize With Confidence.",
    ctaText:
      "Explore more free online utilities for your website and everyday digital tasks.",
  },
  image: planned(
    "image",
    "IMAGE OPTIMIZATION TOOLKIT",
    "Free Online Image Tools",
    "Compress, resize, convert and optimize images with convenient browser-based utilities.",
    ["Compression", "Resizing & Cropping", "Conversion"],
    "image",
    "Image Tools FAQs",
    "Image Tools Are on the Way.",
    plannedCta,
  ),
  pdf: planned(
    "pdf",
    "PDF PRODUCTIVITY TOOLKIT",
    "Free Online PDF Tools",
    "Simplify document management with convenient PDF conversion, compression and organization tools.",
    ["PDF Management", "Compression", "Conversion"],
    "pdf",
    "PDF Tools FAQs",
    "PDF Tools Are on the Way.",
    plannedCta,
  ),
  calculators: {
    slug: "calculators",
    label: "EVERYDAY CALCULATION TOOLKIT",
    heading: "Free Online Calculators",
    lead: "Calculate date differences and explore practical browser-based utilities for everyday calculations.",
    button: "Browse Calculators",
    comingSoon: false,
    groups: [
      "Date & Time",
      "General Calculators",
      "Financial Calculators",
      "Health Calculators",
    ],
    exploreText:
      "Use the available calculator or preview utilities planned for future releases.",
    preview: "calculator",
    featuresHeading: "Straightforward Browser-Based Calculations",
    featuresText:
      "Clear inputs, documented conventions and useful result breakdowns.",
    features: [
      [
        "calendar",
        "Calendar Calculations",
        "Calculate date differences, date arithmetic and business days.",
      ],
      [
        "shieldCheck",
        "Browser-Based",
        "Available calculations run locally without uploading your inputs.",
      ],
      [
        "sliders",
        "Documented Options",
        "Adjust inclusion rules, working weeks and other relevant settings.",
      ],
      [
        "globe",
        "Free Access",
        "Use available calculators without registration or subscriptions.",
      ],
    ],
    stepsHeading: "Calculate in Three Simple Steps",
    steps: [
      [
        "cursor",
        "Choose a Calculator",
        "Select an available calculator for your task.",
      ],
      [
        "edit",
        "Enter Your Values",
        "Provide the dates or numbers requested by the calculator.",
      ],
      [
        "check",
        "Review the Result",
        "Check the output, conventions and detailed breakdown.",
      ],
    ],
    educationHeading: "Understanding Online Calculators",
    education: [
      [
        "What Are Online Calculators?",
        "Focused calculators help solve everyday numerical and calendar tasks directly in a browser.",
      ],
      [
        "Calendar Calculations",
        "Date calculations need real month lengths, leap-year rules and explicit boundary conventions.",
      ],
      [
        "Understanding Results",
        "Always review whether a result uses inclusive dates, calendar days, business days or estimates.",
      ],
      [
        "Future Calculator Toolkit",
        "Date Difference Calculator is available now. Other listed calculators remain planned and do not have processing interfaces.",
      ],
    ],
    callout:
      "Calculator results depend on the chosen conventions. For legal, financial, health or contractual decisions, verify the applicable rules with a qualified professional.",
    faqHeading: "Calculator FAQs",
    faqs: [
      ...activeFaq("calculators"),
      [
        "Which calculator is available now?",
        "Date Difference Calculator is currently available. Other calculator cards are marked Coming Soon.",
      ],
    ],
    ctaHeading: "Calculate Dates with Confidence",
    ctaText:
      "Use the Date Difference Calculator for calendar durations, date arithmetic and customizable business-day counts.",
  },
};

function planned(
  slug: "image" | "pdf" | "calculators",
  label: string,
  heading: string,
  lead: string,
  groups: string[],
  preview: CategoryConfig["preview"],
  faqHeading: string,
  ctaHeading: string,
  ctaText: string,
): CategoryConfig {
  const singular = slug === "calculators" ? "calculator" : slug;
  const names =
    slug === "image"
      ? "an image compressor, resizer, cropper and format converters"
      : slug === "pdf"
        ? "a PDF merger, splitter, compressor, organizer and converters"
        : "age, BMI, percentage, loan, discount and date difference calculators";
  return {
    slug,
    label,
    heading,
    lead,
    button: "Browse Planned Tools",
    comingSoon: true,
    groups,
    exploreHeading: `Explore Planned ${slug === "calculators" ? "Calculators" : `${slug.toUpperCase() === "PDF" ? "PDF" : "Image"} Tools`}`,
    exploreText: `Preview the ${singular} utilities we are planning to build.`,
    preview,
    featuresHeading: `What We Are Planning for ${slug === "calculators" ? "Calculators" : `${slug === "pdf" ? "PDF" : "Image"} Tools`}`,
    featuresText: "A look at the experience we are working toward.",
    features: [
      [
        slug === "calculators" ? "calc" : slug === "pdf" ? "file" : "image",
        "Planned Utilities",
        `A focused set of practical ${singular} tools.`,
      ],
      [
        "shieldCheck",
        "Browser-First Goal",
        "We aim to process files in your browser wherever technically possible.",
      ],
      [
        "user",
        "Made for Everyday Work",
        "Designed for clear, straightforward workflows.",
      ],
      [
        "globe",
        "Free Access, Planned",
        "Our goal is to offer essential utilities without mandatory accounts.",
      ],
    ],
    stepsHeading: `How ${slug === "calculators" ? "Calculators Are" : `${slug === "pdf" ? "PDF" : "Image"} Tools Are`} Planned to Work`,
    steps: [
      ["cursor", "Choose a Tool", `Select the ${singular} utility you need.`],
      [
        "edit",
        "Add Your Input",
        "Enter the requested values or select a file in the planned interface.",
      ],
      [
        "check",
        "Get Your Result",
        "Review the output and save it where supported.",
      ],
    ],
    educationHeading: `Why ${slug === "calculators" ? "Everyday Calculators Are Useful" : `${slug === "pdf" ? "Simple PDF Tools Help" : "Image Optimization Matters"}`}`,
    education: [
      [
        `What Are Online ${slug === "calculators" ? "Calculators" : `${slug === "pdf" ? "PDF" : "Image"} Tools`}?`,
        `Online ${singular} utilities handle common everyday tasks. They are planned for ToolNest but are not available yet.`,
      ],
      [
        "Everyday Uses",
        "Focused online utilities save time on small but frequent tasks without requiring dedicated desktop software.",
      ],
      [
        "Understanding the Results",
        "Results depend on the values or files provided and should always be reviewed before use.",
      ],
      [
        "What to Expect From the Future Toolkit",
        "We plan to start with a practical set and expand over time. No release dates have been set.",
      ],
    ],
    callout:
      slug === "calculators"
        ? "Calculators provide general estimates only. For financial or health decisions, consult a qualified professional."
        : `These tools are planned and not yet available. Nothing on this page processes ${slug === "pdf" ? "documents" : "images"} today.`,
    faqHeading,
    faqs: plannedFaq(`${singular} tools`, `Planned tools include ${names}.`),
    ctaHeading,
    ctaText,
  };
}
