import type { Metadata } from "next";
import { NotFoundPage } from "@/features/not-found/not-found-page";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The requested ToolNest page could not be found.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundPage />;
}
