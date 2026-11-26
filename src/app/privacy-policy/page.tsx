import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@/features/legal/privacy-policy-page";

export const metadata: Metadata = {
  title: "Privacy Policy Draft",
  description:
    "Draft ToolNest privacy disclosures based on the currently audited application behavior.",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Privacy Policy Draft — ToolNest",
    description:
      "Draft privacy disclosures pending legal and production-infrastructure review.",
    url: "/privacy-policy",
    type: "website",
  },
};

export default function Page() {
  return <PrivacyPolicyPage />;
}
