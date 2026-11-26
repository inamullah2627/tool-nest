import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPage } from "@/features/search/search-page";

export const metadata: Metadata = {
  title: "Search ToolNest",
  description: "Search available ToolNest tools, categories and resources.",
  robots: { index: false, follow: true },
};

export default function SearchRoute() {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
}
