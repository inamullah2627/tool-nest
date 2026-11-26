import type { IconName } from "@/components/design/icon";
import type { LegalSection } from "@/components/legal/legal-page-layout";

export const termsHighlights: Array<{
  icon: IconName;
  title: string;
  description: string;
}> = [
  {
    icon: "unlock",
    title: "Free Access",
    description:
      "Access available online utilities without mandatory subscriptions.",
  },
  {
    icon: "shieldCheck",
    title: "Responsible Use",
    description: "Use ToolNest lawfully and responsibly.",
  },
  {
    icon: "copyright",
    title: "Intellectual Property",
    description: "Respect applicable intellectual property rights.",
  },
  {
    icon: "globe",
    title: "Service Availability",
    description: "Tools and features may change as the platform evolves.",
  },
];

export const termsSections: LegalSection[] = [
  {
    id: "terms-introduction",
    title: "Introduction",
    content: (
      <>
        <p>
          These draft Terms &amp; Conditions describe proposed rules for access
          to and use of the ToolNest website and its online tools (the
          “Service”).
        </p>
        <p>
          “ToolNest”, “we”, “us” and “our” would refer to the website operator.
          The operator&apos;s legal identity, address and company status are not
          specified or implied by this draft.
        </p>
      </>
    ),
  },
  {
    id: "terms-acceptance",
    title: "Acceptance of Terms",
    content: (
      <>
        <p>
          The finalized Terms are intended to govern use of ToolNest. Until
          legal review and publication are complete, this draft should not be
          treated as a final agreement.
        </p>
        <p>
          The process for accepting updated terms, including use on behalf of an
          organization, requires confirmation before launch.
        </p>
      </>
    ),
  },
  {
    id: "terms-services",
    title: "Description of Services",
    content: (
      <>
        <p>
          ToolNest provides browser-based utilities for developers, writers, SEO
          professionals and everyday users, including formatters, text analysis
          and metadata generation.
        </p>
        <p>
          Some tools are operational while other catalog entries and categories
          are marked as planned or Coming Soon. Planned features are not release
          commitments and may change or never be released.
        </p>
      </>
    ),
  },
  {
    id: "terms-eligibility",
    title: "Eligibility and Access",
    content: (
      <>
        <p>
          Users are responsible for ensuring that their use of ToolNest is
          permitted under rules that apply to them and for providing their own
          compatible device, browser and internet access.
        </p>
        <div className="callout">
          <span aria-hidden="true">!</span>
          <p>
            <strong>Draft note.</strong> No minimum age, contracting-capacity
            rule or jurisdiction-specific eligibility requirement has been
            established.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "terms-permitted-use",
    title: "Permitted Use",
    content: (
      <>
        <p>
          Available tools are intended for lawful personal, educational and
          professional use, subject to finalized Terms and any clear
          requirements shown on an individual tool page.
        </p>
        <p>
          Users should use the Service reasonably and avoid conduct that impairs
          access or operation for others.
        </p>
      </>
    ),
  },
  {
    id: "terms-prohibited-activities",
    title: "Prohibited Activities",
    content: (
      <>
        <p>The finalized Terms are expected to prohibit using ToolNest to:</p>
        <ul>
          <li>Engage in illegal activity or assist others in doing so.</li>
          <li>Use the Service for malicious purposes.</li>
          <li>Distribute malware, viruses or harmful code.</li>
          <li>
            Attempt unauthorized access to the Service, infrastructure or
            another person&apos;s information.
          </li>
          <li>Interfere with or disrupt website operation.</li>
          <li>Infringe intellectual property or other rights.</li>
          <li>
            Abuse infrastructure through excessive automation or attempted
            overload.
          </li>
        </ul>
        <p>
          The enforceability and wording of these restrictions require legal
          review.
        </p>
      </>
    ),
  },
  {
    id: "terms-user-content",
    title: "User Content and Tool Input",
    content: (
      <>
        <p>
          Users are responsible for the information entered into tools and for
          having the right to use it. Passwords, private keys and similarly
          sensitive material should not be entered into any online tool.
        </p>
        <p>
          Operational tools process input locally in the browser. The Contact
          form currently validates locally but does not deliver or persist
          messages. Any future server-based processing must be disclosed before
          activation.
        </p>
        <p>
          ToolNest does not currently claim ownership of content entered into
          tools or results generated from that content. The final ownership and
          licence wording requires legal confirmation.
        </p>
      </>
    ),
  },
  {
    id: "terms-intellectual-property",
    title: "Intellectual Property Rights",
    content: (
      <>
        <p>
          Rights in the ToolNest name, logo, website content, interface designs,
          source code and third-party materials must be confirmed before the
          final Terms make ownership or licensing claims.
        </p>
        <p>
          Third-party and open-source software remains subject to its applicable
          licences. This draft does not claim a trademark registration, company
          ownership structure or rights beyond those that can later be verified.
        </p>
      </>
    ),
  },
  {
    id: "terms-tool-results",
    title: "Tool Accuracy and Results",
    content: (
      <>
        <p>
          Tool outputs may contain errors, omissions or limitations and may vary
          based on input, browser capabilities and language rules. Users should
          independently verify important results before relying on them.
        </p>
        <p>
          ToolNest is not presented as legal, medical or financial advice. The
          precise disclaimer and allocation of responsibility require legal
          review.
        </p>
      </>
    ),
  },
  {
    id: "terms-third-parties",
    title: "Third-Party Links and Services",
    content: (
      <>
        <p>
          ToolNest may contain links to external websites. External sites have
          their own terms and privacy practices, and users should review them
          separately.
        </p>
        <p>
          No analytics, advertising, email delivery, CMS or database service is
          currently configured in the audited application. Production hosting
          and monitoring providers remain unverified.
        </p>
      </>
    ),
  },
  {
    id: "terms-advertising",
    title: "Advertising",
    content: (
      <>
        <p>
          No advertising service is active. Advertising is a possible future
          business model only, and this draft does not state that Google AdSense
          or another provider is approved or integrated.
        </p>
        <p>
          Advertising terms, provider responsibilities and required user
          controls must be reviewed before any advertising is enabled.
        </p>
      </>
    ),
  },
  {
    id: "terms-availability",
    title: "Service Availability and Modifications",
    content: (
      <>
        <p>
          Tools and features may be updated, modified, suspended or
          discontinued. The Service may experience interruption or errors, and
          planned items should not be treated as guaranteed availability.
        </p>
        <p>
          Any final commitments about uptime, support, maintenance or notice of
          material changes must be confirmed operationally and legally.
        </p>
      </>
    ),
  },
  {
    id: "terms-warranties",
    title: "Disclaimer of Warranties",
    content: (
      <>
        <div className="callout">
          <span aria-hidden="true">!</span>
          <p>
            <strong>Draft clause requiring legal review.</strong> The scope and
            enforceability of warranty exclusions depend on applicable law and
            the operator&apos;s jurisdiction.
          </p>
        </div>
        <p>
          The attached design proposes that the Service be provided “as is” and
          “as available”, without guarantees that cannot yet be verified. No
          final warranty exclusion is asserted by this draft.
        </p>
      </>
    ),
  },
  {
    id: "terms-liability",
    title: "Limitation of Liability",
    content: (
      <>
        <div className="callout">
          <span aria-hidden="true">!</span>
          <p>
            <strong>Draft clause requiring legal review.</strong> Liability
            caps, excluded losses and non-excludable liabilities have not been
            determined.
          </p>
        </div>
        <p>
          No final limitation of liability is stated until the legal operator,
          jurisdiction and applicable consumer protections are confirmed.
        </p>
      </>
    ),
  },
  {
    id: "terms-privacy",
    title: "Privacy",
    content: (
      <>
        <p>
          The audited privacy behavior and outstanding disclosures are described
          in the <a href="/privacy-policy">draft Privacy Policy</a>. That
          document is also pending legal and production-infrastructure review.
        </p>
      </>
    ),
  },
  {
    id: "terms-restriction",
    title: "Restriction of Access",
    content: (
      <>
        <p>
          ToolNest does not currently provide user accounts. A future operator
          may need to restrict website access where use is abusive, unlawful,
          insecure or harmful, subject to applicable law and technical
          capability.
        </p>
        <p>
          The grounds, process, duration and appeal mechanism for any
          restriction require confirmation before publication.
        </p>
      </>
    ),
  },
  {
    id: "terms-governing-law",
    title: "Governing Law and Disputes",
    content: (
      <>
        <div className="callout">
          <span aria-hidden="true">!</span>
          <p>
            <strong>Required placeholder.</strong> No governing law, courts,
            arbitration process or dispute venue has been selected. These
            details must be based on the verified legal operator and qualified
            legal advice.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "terms-changes",
    title: "Changes to These Terms",
    content: (
      <>
        <p>
          A final version should explain how updates take effect, how the “Last
          updated” date is maintained and when additional notice is provided. No
          effective-date or acceptance mechanism is currently established.
        </p>
      </>
    ),
  },
  {
    id: "terms-contact",
    title: "Contact Us",
    content: (
      <>
        <p>
          Questions may be prepared through the{" "}
          <a href="/contact">Contact page</a>, but message delivery is not
          configured. A verified legal contact email, postal address and service
          process remain required before launch.
        </p>
      </>
    ),
  },
];
