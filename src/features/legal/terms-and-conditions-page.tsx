import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import {
  termsHighlights,
  termsSections,
} from "@/data/legal/terms-and-conditions";

export function TermsAndConditionsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      label="LEGAL INFORMATION"
      description="Please review these draft terms for the proposed rules, responsibilities and limitations associated with using ToolNest."
      icon="file"
      updated="Draft — not finalized"
      draftNotice={
        <>
          <strong>Draft content.</strong> These terms have not received legal
          review, are excluded from indexing and must not be treated as a final
          agreement.
        </>
      }
      highlights={termsHighlights}
      sections={termsSections}
      contactHeading="Have Questions About Our Terms?"
      contactText="Use the Contact page for feedback. Message delivery remains unavailable until a real service is configured."
      contactHref="/contact"
      contactIcon="msg"
      relatedDocuments={[
        { title: "Privacy Policy", href: "/privacy-policy" },
        { title: "Disclaimer" },
      ]}
    />
  );
}
