import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3100";
await mkdir("qa/not-found", { recursive: true });
const browser = await chromium.launch();

try {
  for (const path of [
    "/missing-page",
    "/tools/missing-tool",
    "/tools/category/missing-category",
    "/blog/missing-article",
  ]) {
    const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
    if (response.status !== 404)
      throw new Error(`${path} returned ${response.status}, expected 404`);
  }

  for (const path of ["/", "/tools", "/about", "/contact"]) {
    const response = await fetch(`${baseUrl}${path}`);
    if (response.status !== 200)
      throw new Error(`Valid route ${path} returned ${response.status}`);
  }

  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["tablet", 768, 1024],
    ["mobile", 390, 844],
  ]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    const response = await page.goto(`${baseUrl}/definitely-missing`, {
      waitUntil: "networkidle",
    });
    if (response?.status() !== 404)
      throw new Error(`${name}: soft 404 detected`);
    if (new URL(page.url()).pathname !== "/404")
      throw new Error(`${name}: missing route URL was not replaced with /404`);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    if (overflow > 1)
      throw new Error(`${name}: ${overflow}px horizontal overflow`);
    await page.screenshot({ path: `qa/not-found/${name}.png`, fullPage: true });
    await context.close();
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/definitely-missing`, {
    waitUntil: "networkidle",
  });
  if (new URL(page.url()).pathname !== "/404")
    throw new Error("Missing route URL was not replaced with /404");
  const robots = await page
    .locator('meta[name="robots"]')
    .evaluateAll((items) =>
      items.map((item) => item.getAttribute("content")).join(", "),
    );
  if (!robots.includes("noindex") || !robots.includes("nofollow"))
    throw new Error(`Unexpected robots metadata: ${robots}`);
  if ((await page.locator(".nf-tools .tc").count()) !== 3)
    throw new Error("Recommended tools are not registry-backed");
  await page.getByLabel("Search tools, articles and more").fill("word");
  await page.getByRole("option", { name: /Word Counter/ }).click();
  await page.waitForURL("**/tools/word-counter");
  await page.goBack({ waitUntil: "networkidle" });
  const favorite = page.getByRole("button", {
    name: "Favorite JSON Formatter",
  });
  await favorite.click();
  if ((await favorite.getAttribute("aria-pressed")) !== "true")
    throw new Error("Shared favorite functionality failed");
  const axe = await new AxeBuilder({ page }).analyze();
  if (axe.violations.length)
    throw new Error(
      `Accessibility violations:\n${axe.violations.map((item) => `${item.id}: ${item.help}`).join("\n")}`,
    );
  await page.getByRole("button", { name: "Toggle dark mode" }).click();
  await page.waitForFunction(() =>
    document.documentElement.classList.contains("dark"),
  );
  await page.screenshot({
    path: "qa/not-found/desktop-dark.png",
    fullPage: true,
  });
  await context.close();

  const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  if (sitemap.includes("/404") || sitemap.includes("missing-page"))
    throw new Error("404 route leaked into sitemap");
  console.log(
    "404 QA passed: true HTTP statuses, valid-route regression, recovery actions, registry search, favorites, responsive layouts, dark mode, accessibility and sitemap exclusion.",
  );
} finally {
  await browser.close();
}
