import type { Metadata } from "next";
import { Suspense } from "react";
import { ReactToolsPage } from "@/features/tools-directory/react-tools-page";

export const metadata: Metadata = {
  title: "All Tools",
  description:
    "Browse free online developer, text and SEO tools in the ToolNest directory.",
};

export default function ToolsPage() {
  return (
    <Suspense>
      <ReactToolsPage />
    </Suspense>
  );
}
