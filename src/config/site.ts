export const siteConfig = {
  name: "ToolNest",
  tagline: "All your tools. One place.",
  description:
    "Free browser-based tools for developers, writers, SEO professionals, students and everyday digital tasks.",
  url: process.env.NEXT_PUBLIC_SITE_URL,
  routes: {
    home: "/",
    tools: "/tools",
    categories: "/tools/category/[slug]",
    tool: "/tools/[slug]",
    blog: "/blog",
  },
  futureRoutes: [
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
    "/disclaimer",
    "/search",
  ],
} as const;
