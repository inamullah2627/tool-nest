import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import {
  disclaimerHighlights,
  disclaimerSections,
} from "@/data/legal/disclaimer";

export function DisclaimerPage() {
  return (
    <LegalPageLayout
      title="Disclaimer"
      label="LEGAL INFORMATION"
      description="Important draft information about the use, accuracy and limitations of ToolNest and its online utilities."
      icon="info"
      updated="Draft — not finalized"
      draftNotice={
        <>
          <strong>Draft content.</strong> This disclaimer reflects audited
          product behavior but has not received legal review and remains
          excluded from production indexing.
        </>
      }
      highlights={disclaimerHighlights}
      sections={disclaimerSections}
      contactHeading="Have Questions About This Disclaimer?"
      contactText="Use the Contact page for feedback. Message delivery remains unavailable until a real service is configured."
      contactHref="/contact"
      contactIcon="msg"
      relatedDocuments={[
        { title: "Privacy Policy", href: "/privacy-policy" },
        { title: "Terms & Conditions", href: "/terms-and-conditions" },
      ]}
    />
  );
}
