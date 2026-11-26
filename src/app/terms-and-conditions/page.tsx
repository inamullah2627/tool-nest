import type { Metadata } from "next";
import { TermsAndConditionsPage } from "@/features/legal/terms-and-conditions-page";

export const metadata: Metadata = {
  title: "Terms & Conditions Draft",
  description:
    "Draft ToolNest terms and conditions pending operator, jurisdiction and legal review.",
  alternates: { canonical: "/terms-and-conditions" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Terms & Conditions Draft — ToolNest",
    description:
      "Draft terms for ToolNest pending legal and operational confirmation.",
    url: "/terms-and-conditions",
    type: "website",
  },
};

export default function Page() {
  return <TermsAndConditionsPage />;
}
