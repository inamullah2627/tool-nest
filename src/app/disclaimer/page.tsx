import type { Metadata } from "next";
import { DisclaimerPage } from "@/features/legal/disclaimer-page";

export const metadata: Metadata = {
  title: "Disclaimer Draft",
  description:
    "Draft ToolNest disclaimer covering verified tool limitations and content disclosures pending legal review.",
  alternates: { canonical: "/disclaimer" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Disclaimer Draft — ToolNest",
    description:
      "Draft limitations and disclosures for ToolNest tools and content.",
    url: "/disclaimer",
    type: "website",
  },
};

export default function Page() {
  return <DisclaimerPage />;
}
