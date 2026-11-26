import type { IconName } from "@/components/design/icon";
import type { LegalSection } from "@/components/legal/legal-page-layout";

export const disclaimerHighlights: Array<{
  icon: IconName;
  title: string;
  description: string;
}> = [
  {
    icon: "info",
    title: "Informational Purpose",
    description:
      "Tools and content are provided for general informational and practical purposes.",
  },
  {
    icon: "clipboardCheck",
    title: "Independent Verification",
    description: "Verify important tool outputs before relying on them.",
  },
  {
    icon: "shieldCheck",
    title: "User Responsibility",
    description:
      "Users are responsible for how they use tools and their results.",
  },
  {
    icon: "external",
    title: "External Services",
    description:
      "Third-party websites and services operate under their own policies.",
  },
];

export const disclaimerSections: LegalSection[] = [
  {
    id: "disclaimer-general",
    title: "General Disclaimer",
    content: (
      <>
        <p>
          ToolNest provides browser-based utilities and draft educational
          content for general informational and practical use. This page
          describes known limitations but has not received legal review.
        </p>
        <p>
          Use of the tools and content, and decisions based on their output,
          remain the user&apos;s responsibility. Final risk-allocation wording
          requires confirmation by the legal operator.
        </p>
      </>
    ),
  },
  {
    id: "disclaimer-accuracy",
    title: "Accuracy of Information",
    content: (
      <>
        <p>
          Errors, omissions and outdated information can occur. ToolNest does
          not currently claim that every page, example or output is complete,
          current or suitable for every situation.
        </p>
        <p>
          Important information should be checked against an authoritative
          source appropriate to the user&apos;s circumstances.
        </p>
      </>
    ),
  },
  {
    id: "disclaimer-results",
    title: "Tool Results and Limitations",
    content: (
      <>
        <p>
          Tool output depends on input, implementation rules, browser
          capabilities and the limits of each tool. A technically valid result
          may still be unsuitable for a particular project or purpose.
        </p>
        <p>
          Keep original files or source text where relevant and independently
          verify important output before publishing, deploying or relying on it.
        </p>
      </>
    ),
  },
  {
    id: "disclaimer-developer-tools",
    title: "Developer Tools Disclaimer",
    content: (
      <>
        <p>
          The operational JSON Formatter parses JSON using browser JavaScript,
          rejects duplicate object keys, rejects unsafe numeric values and
          excessive nesting, and can format, minify, validate or sort keys.
          These checks do not prove compatibility with every parser, programming
          language, API or production system.
        </p>
        <p>
          Formatting changes whitespace, while sorting changes property order.
          Review and test output in the actual target environment before use.
        </p>
      </>
    ),
  },
  {
    id: "disclaimer-text-tools",
    title: "Text Tools Disclaimer",
    content: (
      <>
        <p>
          The operational Word Counter uses <code>Intl.Segmenter</code> where
          available and Unicode-aware fallbacks otherwise. Word, sentence and
          paragraph counts may differ from other editors because language,
          punctuation, abbreviations, emoji and formatting rules vary.
        </p>
        <p>
          Reading time is estimated at 200 words per minute and speaking time at
          130 words per minute. Keyword density is an arithmetic analysis, not a
          writing-quality or SEO assessment.
        </p>
      </>
    ),
  },
  {
    id: "disclaimer-seo-tools",
    title: "SEO Tools Disclaimer",
    content: (
      <>
        <p>
          The Meta Tag Generator escapes generated text, validates only complete
          HTTP or HTTPS URLs and produces metadata locally. Its
          title/description guidance is advisory and its search-result previews
          are illustrative.
        </p>
        <p>
          No ToolNest feature guarantees search rankings, traffic, indexing,
          display format, SEO performance or advertising approval. Search
          engines and platforms may ignore, rewrite or render metadata
          differently.
        </p>
      </>
    ),
  },
  {
    id: "disclaimer-image-pdf",
    title: "Image and PDF Tools Disclaimer",
    content: (
      <>
        <div className="callout">
          <span aria-hidden="true">i</span>
          <p>
            <strong>Not currently available.</strong> Image and PDF catalog
            entries are planned interfaces, not operational processing tools.
          </p>
        </div>
        <p>
          If these tools are implemented later, their actual formats, limits,
          local/server processing and quality effects must be audited before
          this disclaimer is updated.
        </p>
      </>
    ),
  },
  {
    id: "disclaimer-calculators",
    title: "Calculator Tools Disclaimer",
    content: (
      <>
        <div className="callout">
          <span aria-hidden="true">i</span>
          <p>
            <strong>Not currently available.</strong> Calculator catalog entries
            are planned and produce no active calculations.
          </p>
        </div>
        <p>
          Any future calculator would require formula, rounding, unit and
          professional-use limitations to be documented before release.
        </p>
      </>
    ),
  },
  {
    id: "disclaimer-educational-content",
    title: "Educational and Blog Content",
    content: (
      <>
        <p>
          Current blog material is sample draft content, uses{" "}
          <code>noindex, nofollow</code> and remains outside the sitemap. It
          should not be treated as reviewed or published guidance.
        </p>
        <p>
          Future articles and tutorials may not cover every situation or reflect
          later product and industry changes. Important information should be
          independently verified.
        </p>
      </>
    ),
  },
  {
    id: "disclaimer-professional-advice",
    title: "No Professional Advice",
    content: (
      <>
        <p>
          ToolNest is not presented as a provider of legal, medical, financial,
          tax or other regulated professional advice. Tool outputs and articles
          should not replace advice from an appropriately qualified
          professional.
        </p>
        <p>
          The exact scope and wording of this exclusion requires legal review
          based on the final operator, audience and available tools.
        </p>
      </>
    ),
  },
  {
    id: "disclaimer-external-links",
    title: "External Links Disclaimer",
    content: (
      <>
        <p>
          ToolNest may link to external websites. External content,
          availability, security and privacy practices are controlled by their
          respective operators, and a link should not be interpreted as an
          endorsement.
        </p>
        <p>
          No runtime analytics, advertising, email delivery, CMS or database
          integration is active in the audited application; production hosting
          and monitoring providers remain unverified.
        </p>
      </>
    ),
  },
  {
    id: "disclaimer-advertising",
    title: "Advertising Disclaimer",
    content: (
      <>
        <p>
          No advertising service is active or approved. Advertising, including
          any possible third-party provider, is planned business functionality
          only.
        </p>
        <p>
          If advertising is introduced, provider disclosures, endorsement
          language, data practices and required user controls must be reviewed
          before activation.
        </p>
      </>
    ),
  },
  {
    id: "disclaimer-availability",
    title: "Service Availability",
    content: (
      <>
        <p>
          Tools and website functionality may be changed, interrupted or
          discontinued. No uptime, support-response or uninterrupted-access
          commitment has been established.
        </p>
        <p>“Coming Soon” labels describe plans rather than release promises.</p>
      </>
    ),
  },
  {
    id: "disclaimer-liability",
    title: "Limitation of Liability",
    content: (
      <>
        <div className="callout">
          <span aria-hidden="true">!</span>
          <p>
            <strong>Draft clause requiring legal review.</strong> No liability
            cap, excluded-loss category or jurisdiction-specific exception has
            been finalized.
          </p>
        </div>
        <p>
          This draft does not assert an enforceable limitation until the legal
          operator, governing law and applicable consumer protections are
          confirmed.
        </p>
      </>
    ),
  },
  {
    id: "disclaimer-changes",
    title: "Changes to This Disclaimer",
    content: (
      <>
        <p>
          This draft must be updated as operational tools, third-party services
          and platform functionality change. A verified effective date, version
          history and material-change notice process have not been established.
        </p>
      </>
    ),
  },
  {
    id: "disclaimer-contact",
    title: "Contact Us",
    content: (
      <>
        <p>
          Questions may be prepared through the{" "}
          <a href="/contact">Contact page</a>, but message delivery is not
          configured. A verified legal contact email, postal address and
          operator identity remain required before publication.
        </p>
      </>
    ),
  },
];
