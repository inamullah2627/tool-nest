import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactPage } from "@/features/contact/contact-page";
import { tools } from "@/data/tools";
import { parseContactPreset } from "@/lib/contact/contact";

export const metadata: Metadata = {
  title: "Contact ToolNest",
  description:
    "Contact ToolNest with a general question, tool suggestion, bug report, feature request or privacy concern.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact ToolNest",
    description:
      "Share questions, suggestions and product feedback with ToolNest.",
    url: "/contact",
    type: "website",
  },
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function ContactWithPreset({ searchParams }: Props) {
  const params = await searchParams;
  const preset = parseContactPreset(
    params.inquiry,
    params.tool,
    new Set(tools.map((tool) => tool.slug)),
  );
  return (
    <ContactPage initialInquiry={preset.inquiry} initialTool={preset.tool} />
  );
}

export default function Page({ searchParams }: Props) {
  return (
    <Suspense fallback={<ContactPage initialInquiry="" initialTool="" />}>
      <ContactWithPreset searchParams={searchParams} />
    </Suspense>
  );
}
