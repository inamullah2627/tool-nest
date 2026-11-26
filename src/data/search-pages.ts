import { siteConfig } from "../config/site";

export interface SearchablePage {
  id: string;
  title: string;
  description: string;
  href: string;
  group: string;
  keywords: string[];
}

export const searchablePages: SearchablePage[] = [
  {
    id: "page-home",
    title: "Home",
    description: "Discover ToolNest tools, categories and platform features.",
    href: siteConfig.routes.home,
    group: "General",
    keywords: ["home", "toolnest", "online tools"],
  },
  {
    id: "page-tools",
    title: "All Tools",
    description: "Browse and filter the complete available ToolNest directory.",
    href: siteConfig.routes.tools,
    group: "Directory",
    keywords: ["tools", "directory", "browse", "utilities"],
  },
  {
    id: "page-about",
    title: "About ToolNest",
    description:
      "Learn about ToolNest, its principles and available utilities.",
    href: siteConfig.routes.about,
    group: "General",
    keywords: ["about", "platform", "mission"],
  },
  {
    id: "page-contact",
    title: "Contact",
    description: "Ask a question, suggest a tool or report an issue.",
    href: siteConfig.routes.contact,
    group: "Support",
    keywords: ["contact", "feedback", "suggest", "report", "bug", "help"],
  },
];
