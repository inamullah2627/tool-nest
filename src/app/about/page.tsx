import type { Metadata } from "next";
import { AboutPage } from "@/features/about/about-page";

export const metadata: Metadata = {
  title: "About ToolNest",
  description:
    "Learn why ToolNest brings practical browser-based tools together in one simple, accessible and privacy-conscious workspace.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About ToolNest",
    description:
      "Discover ToolNest's mission to make everyday digital tools simple, accessible and convenient.",
    url: "/about",
    type: "website",
  },
};

export default function Page() {
  return <AboutPage />;
}
