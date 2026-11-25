import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const slugs = ["developer", "text", "seo", "image", "pdf", "calculators"];
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
let failed = false;
const check = (label, pass) => {
  console.log(`${pass ? "PASS" : "FAIL"}: ${label}`);
  if (!pass) failed = true;
};

for (const slug of slugs) {
  await page.goto(`${base}/tools/category/${slug}`, {
    waitUntil: "networkidle",
  });
  check(`${slug} route`, page.url().endsWith(`/tools/category/${slug}`));
  check(`${slug} heading`, await page.locator("h1").isVisible());
  check(
    `${slug} cards`,
    (await page.locator(".category-directory .tc").count()) >= 5,
  );
  const robotsLocator = page.locator('meta[name="robots"]');
  const robots = (await robotsLocator.count())
    ? await robotsLocator.getAttribute("content")
    : null;
  check(
    `${slug} indexing`,
    ["image", "pdf", "calculators"].includes(slug)
      ? robots?.includes("noindex")
      : !robots?.includes("noindex"),
  );
}

await page.goto(`${base}/tools/category/developer`, {
  waitUntil: "networkidle",
});
await page.getByLabel("Search Developer Tools").fill("CSS");
check(
  "category search",
  (await page.locator(".category-directory .tc").count()) === 1,
);
await page.getByRole("tab", { name: "Minifier" }).click();
check(
  "category filter",
  (await page.locator(".category-directory .tc").count()) === 1,
);
await page.getByLabel("List view").click();
check(
  "list view",
  await page.locator(".category-directory .tg.lv").isVisible(),
);
await page.locator(".category-block .qi button").nth(1).click();
check(
  "FAQ interaction",
  await page
    .locator(".category-block .qi")
    .nth(1)
    .evaluate((node) => node.classList.contains("open")),
);
await page.locator(".category-directory .fav").first().click();
check(
  "favorites",
  (await page
    .locator(".category-directory .fav")
    .first()
    .getAttribute("aria-pressed")) === "true",
);

for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
]) {
  await page.setViewportSize(viewport);
  await page.goto(`${base}/tools/category/text`, { waitUntil: "networkidle" });
  check(
    `${viewport.width}px responsive`,
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  );
}

await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(`${base}/tools/category/developer`, {
  waitUntil: "networkidle",
});
const serious = (await new AxeBuilder({ page }).analyze()).violations.filter(
  (violation) => ["serious", "critical"].includes(violation.impact ?? ""),
);
check("serious accessibility violations", serious.length === 0);

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
check(
  "active categories in sitemap",
  ["developer", "text", "seo"].every((slug) =>
    sitemap.includes(`/tools/category/${slug}`),
  ),
);
check(
  "coming-soon categories excluded",
  ["image", "pdf", "calculators"].every(
    (slug) => !sitemap.includes(`/tools/category/${slug}`),
  ),
);

await browser.close();
if (failed) process.exitCode = 1;
