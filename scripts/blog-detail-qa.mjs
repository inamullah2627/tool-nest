import { chromium } from "playwright";

const browser = await chromium.launch();
const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const route = "/blog/how-to-format-and-validate-json";
const cases = [
  ["desktop", 1440, 1000],
  ["tablet", 768, 1024],
  ["mobile", 390, 844],
];
let failed = false;

for (const [name, width, height] of cases) {
  const page = await browser.newPage({
    viewport: { width, height },
    colorScheme: "light",
  });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("/_next/hmr"))
      errors.push(message.text());
  });
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  const metrics = await page.evaluate(() => {
    const box = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        bottom: Math.round(rect.bottom),
      };
    };
    return {
      viewport: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      layout: box(".aly"),
      main: box(".amn"),
      sidebar: box(".asd"),
      content: box(".ac"),
      tocVisible: Boolean(
        document.querySelector(".asd .toc")?.getClientRects().length,
      ),
      mobileTocVisible: Boolean(
        document.querySelector(".mtoc")?.getClientRects().length,
      ),
      tags: box(".article-tags"),
      authorCard: box(".acd"),
    };
  });
  const noOverflow = metrics.scrollWidth <= metrics.viewport;
  const responsiveToc =
    width > 860
      ? metrics.tocVisible && !metrics.mobileTocVisible
      : !metrics.tocVisible && metrics.mobileTocVisible;
  const noAuthorOverlap = Boolean(
    metrics.tags &&
    metrics.authorCard &&
    metrics.tags.height > 16 &&
    metrics.tags.bottom <= metrics.authorCard.y,
  );
  const passed =
    noOverflow && responsiveToc && noAuthorOverlap && errors.length === 0;
  failed ||= !passed;
  console.log(
    `${passed ? "PASS" : "FAIL"}: ${name}`,
    JSON.stringify({ ...metrics, errors }),
  );
  await page.screenshot({ path: `qa/blog-detail-${name}.png`, fullPage: true });
  await page.close();
}

const interactionContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  permissions: ["clipboard-read", "clipboard-write"],
});
const interactionPage = await interactionContext.newPage();
await interactionPage.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
await interactionPage.locator(".acb button").first().click();
const copyStatus = await interactionPage.getByRole("status").textContent();
await interactionPage.locator(".asd .toc a").nth(6).click();
await interactionPage.waitForTimeout(300);
const activeToc = await interactionPage.locator(".toc a.on").count();
const progress = await interactionPage
  .locator(".reading-progress i")
  .evaluate((element) => getComputedStyle(element).transform);
const interactionsPassed =
  copyStatus?.includes("Code copied") && activeToc > 0 && progress !== "none";
failed ||= !interactionsPassed;
console.log(`${interactionsPassed ? "PASS" : "FAIL"}: interactions`, {
  copyStatus,
  activeToc,
  progress,
});
await interactionContext.close();
await browser.close();
if (failed) process.exitCode = 1;
