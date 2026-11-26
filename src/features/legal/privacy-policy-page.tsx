import {
  LegalPageLayout,
  type LegalSection,
} from "@/components/legal/legal-page-layout";

const sections: LegalSection[] = [
  {
    id: "privacy-introduction",
    title: "Introduction",
    content: (
      <>
        <p>
          This working draft describes the privacy-relevant behavior currently
          verified in the ToolNest codebase. It applies to the ToolNest website
          and available browser-based tools, but is not a finalized legal
          policy.
        </p>
        <p>
          ToolNest&apos;s legal operator, governing jurisdiction, hosting
          environment and launch configuration have not yet been confirmed.
          Those details require review before this page can be published as a
          binding policy.
        </p>
      </>
    ),
  },
  {
    id: "privacy-information",
    title: "Information Involved",
    content: (
      <>
        <h3>Tool input</h3>
        <p>
          Available tools accept text, code, metadata or local files in your
          browser. The current implementations process that input locally and do
          not send it to a ToolNest server.
        </p>
        <h3>Contact form details</h3>
        <p>
          The Contact form accepts a name, email address, inquiry type, optional
          tool, subject and message. Delivery is not configured: validation
          occurs in the browser and the information is not transmitted or
          persisted.
        </p>
        <h3>Technical server information</h3>
        <p>
          Production hosting has not been selected or audited. A future hosting
          provider may process ordinary request data such as IP addresses,
          requested URLs, timestamps and browser information in infrastructure
          logs. No claim about those logs or their retention is made yet.
        </p>
      </>
    ),
  },
  {
    id: "privacy-tool-processing",
    title: "Browser-Based Tool Processing",
    content: (
      <>
        <p>
          JSON Formatter uses a browser Web Worker. Word Counter and Meta Tag
          Generator run in browser memory. Supported uploads use browser file
          APIs, while downloads use locally created browser objects. None of
          these implementations contains an application network request for user
          input.
        </p>
        <p>
          Clipboard actions run only after a user action and remain subject to
          browser permissions. Tool input and generated output are not written
          to ToolNest localStorage.
        </p>
        <div className="callout">
          <span aria-hidden="true">!</span>
          <p>
            Avoid entering passwords, private keys or similarly sensitive
            material into any online tool, even when processing is local.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "privacy-storage",
    title: "Cookies and Browser Storage",
    content: (
      <>
        <p>
          The current application stores only interface preferences in browser
          localStorage:
        </p>
        <ul>
          <li>
            <code>toolnest:favorites</code> for favorited tool identifiers.
          </li>
          <li>
            <code>toolnest:recent</code> for up to eight recently used tool
            identifiers.
          </li>
          <li>The theme preference managed by the theme component.</li>
        </ul>
        <p>
          These values remain on your device until changed or cleared through
          your browser. The application code does not currently set cookies, use
          sessionStorage or use IndexedDB. Final hosting behavior must still be
          audited before launch.
        </p>
      </>
    ),
  },
  {
    id: "privacy-contact",
    title: "Contact Form",
    content: (
      <>
        <p>
          The Contact page currently provides a user interface and local
          validation only. Its modular submission handler always returns an
          unavailable status and performs no network transmission, database
          write, email delivery or browser-storage write.
        </p>
        <p>
          Before message delivery is enabled, this section must identify the
          provider, purposes, lawful basis where applicable, recipients,
          retention period and deletion process.
        </p>
      </>
    ),
  },
  {
    id: "privacy-analytics",
    title: "Analytics Services",
    content: (
      <>
        <p>
          <strong>
            No analytics service is active in the audited application code.
          </strong>{" "}
          Analytics may be considered later but is planned, not current
          functionality.
        </p>
        <p>
          Before analytics is enabled, this draft must be updated with the
          provider, collected events, identifiers, cookie or storage behavior,
          retention, international transfers and applicable consent or opt-out
          controls.
        </p>
      </>
    ),
  },
  {
    id: "privacy-advertising",
    title: "Advertising",
    content: (
      <>
        <p>
          <strong>
            No advertising service, advertising script or cookie-consent system
            is active.
          </strong>{" "}
          Advertising is a possible future business model only. ToolNest has no
          verified advertising provider or approved integration.
        </p>
        <p>
          Advertising must not be activated until the provider and data flow are
          audited, this policy is finalized, and any required consent and
          preference controls are implemented.
        </p>
      </>
    ),
  },
  {
    id: "privacy-third-parties",
    title: "Third-Party Services and Links",
    content: (
      <>
        <p>
          The audited runtime has no configured analytics, advertising,
          email-delivery, CMS or database integration. Fonts are bundled through
          the application&apos;s build system rather than requested from Google
          by page visitors.
        </p>
        <p>
          ToolNest pages may link to external websites. Following an external
          link is a separate action governed by that website&apos;s policies.
          Production hosting, monitoring and deployment services remain
          unverified and must be added here before launch.
        </p>
      </>
    ),
  },
  {
    id: "privacy-retention",
    title: "Retention and Security",
    content: (
      <>
        <p>
          Tool input and Contact form fields are currently held only in
          temporary browser component memory and disappear when the relevant
          page state is discarded. Local interface preferences remain until
          changed or cleared.
        </p>
        <p>
          No server-side retention schedule can be stated because production
          hosting and delivery services are not configured. Security controls
          and incident-response contacts also require pre-launch review.
        </p>
      </>
    ),
  },
  {
    id: "privacy-rights",
    title: "Privacy Rights",
    content: (
      <>
        <p>
          Privacy rights depend on the operator, user location, processing
          purposes and applicable law. This draft does not claim compliance with
          GDPR, UK GDPR, CCPA/CPRA or another named privacy framework.
        </p>
        <p>
          You may submit a privacy question through the Contact page. Because
          delivery is not configured, no rights-request channel is currently
          operational. A verified contact method and identity-verification
          process are required before launch.
        </p>
      </>
    ),
  },
  {
    id: "privacy-children",
    title: "Children's Privacy",
    content: (
      <>
        <div className="callout">
          <span aria-hidden="true">!</span>
          <p>
            <strong>Draft section requiring legal review.</strong> The intended
            minimum user age and child-data rules have not been established.
          </p>
        </div>
        <p>
          No age threshold or parental-consent claim is made until the target
          audience, operator jurisdiction and applicable requirements are
          confirmed.
        </p>
      </>
    ),
  },
  {
    id: "privacy-transfers",
    title: "International Transfers",
    content: (
      <>
        <p>
          Hosting locations, service-provider locations and transfer mechanisms
          have not been selected or verified. This section must be completed if
          future infrastructure processes personal information outside a
          user&apos;s country.
        </p>
      </>
    ),
  },
  {
    id: "privacy-changes",
    title: "Changes to This Draft",
    content: (
      <>
        <p>
          This draft will change as ToolNest&apos;s operator, hosting,
          integrations and legal requirements are confirmed. A real effective
          date, change-notice process and version history must be established
          before indexing or public launch.
        </p>
      </>
    ),
  },
  {
    id: "privacy-contact-us",
    title: "Contact Us",
    content: (
      <>
        <p>
          Use the{" "}
          <a href="/contact?inquiry=privacy-concern">
            Contact page with Privacy Concern selected
          </a>{" "}
          for privacy-related feedback. The form currently cannot deliver
          messages, and no verified privacy email address or postal address is
          available.
        </p>
      </>
    ),
  },
];

export function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      label="LEGAL & PRIVACY"
      description="Review the verified privacy behavior of ToolNest, together with the disclosures that still require legal and operational confirmation."
      icon="shieldCheck"
      updated="Draft — not finalized"
      draftNotice={
        <>
          <strong>Draft content.</strong> This page is based on a code audit,
          not legal review. It is excluded from indexing and must be completed
          before production publication.
        </>
      }
      highlights={[
        {
          icon: "monitor",
          title: "Browser-Based Processing",
          description:
            "Available tools process user input locally in the browser.",
        },
        {
          icon: "user",
          title: "No Account Required",
          description:
            "The current application has no registration or account system.",
        },
        {
          icon: "eye",
          title: "Audited Disclosures",
          description:
            "Active behavior is separated from planned services and unknown hosting details.",
        },
        {
          icon: "shieldCheck",
          title: "Draft Safeguards",
          description:
            "Unverified legal and operational claims are clearly marked for review.",
        },
      ]}
      sections={sections}
      contactHeading="Have a Privacy Question?"
      contactText="Use the privacy-preselected Contact form. Delivery remains unavailable until a real service is configured."
      contactHref="/contact?inquiry=privacy-concern"
      contactIcon="shieldCheck"
      relatedDocuments={[
        { title: "Terms & Conditions", href: "/terms-and-conditions" },
        { title: "Disclaimer", href: "/disclaimer" },
      ]}
    />
  );
}
