import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.QA_BASE_URL ?? "http://localhost:3000";
await mkdir("qa/search", { recursive: true });
const browser = await chromium.launch();

try {
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["tablet", 768, 1024],
    ["mobile", 390, 844],
  ]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/search?q=json`, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    if (overflow > 1)
      throw new Error(`${name}: ${overflow}px horizontal overflow`);
    if ((await page.getByText("JSON Formatter", { exact: true }).count()) < 1)
      throw new Error(`${name}: JSON result missing`);
    await page.screenshot({ path: `qa/search/${name}.png`, fullPage: true });
    await context.close();
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/search?q=json`, { waitUntil: "networkidle" });
  await page.getByRole("combobox", { name: "Search ToolNest" }).fill("");
  await page.getByRole("combobox", { name: "Search ToolNest" }).focus();
  const suggestionBox = page.locator("#global-search-suggestions");
  await suggestionBox.waitFor({ state: "visible" });
  const suggestionGeometry = await page.evaluate(() => {
    const dropdown = document
      .querySelector("#global-search-suggestions")
      ?.getBoundingClientRect();
    const hero = document
      .querySelector(".search-hero")
      ?.getBoundingClientRect();
    return {
      dropdownBottom: dropdown?.bottom ?? 0,
      heroBottom: hero?.bottom ?? 0,
    };
  });
  if (suggestionGeometry.dropdownBottom <= suggestionGeometry.heroBottom)
    throw new Error("Suggestions are still clipped inside the search hero");
  if ((await suggestionBox.getByRole("button").count()) < 5)
    throw new Error("Popular search suggestions are incomplete");
  await page.getByRole("combobox", { name: "Search ToolNest" }).fill("json");
  const robots = await page
    .locator('meta[name="robots"]')
    .evaluateAll((items) =>
      items.map((item) => item.getAttribute("content")).join(","),
    );
  if (!robots.includes("noindex"))
    throw new Error(`Search is indexable: ${robots}`);
  await page.getByRole("tab", { name: /Tools/ }).click();
  await page.waitForURL(/type=tool/);
  await page.getByLabel("Sort results").selectOption("az");
  await page.waitForURL(/sort=az/);
  await page.goBack();
  await page.waitForURL(
    (url) =>
      url.searchParams.get("type") === "tool" && !url.searchParams.has("sort"),
  );
  await page.getByRole("combobox", { name: "Search ToolNest" }).fill("word");
  await page
    .getByRole("combobox", { name: "Search ToolNest" })
    .press("ArrowDown");
  await page.getByRole("combobox", { name: "Search ToolNest" }).press("Enter");
  await page.waitForURL("**/tools/word-counter");
  await page.goto(`${baseUrl}/search`, { waitUntil: "networkidle" });
  if (!(await page.getByText("What Are You Looking For?").isVisible()))
    throw new Error("Empty query state missing");
  await page
    .getByRole("combobox", { name: "Search ToolNest" })
    .fill("definitely-no-match");
  await page
    .getByRole("button", { name: /Search/ })
    .last()
    .click();
  await page.waitForURL(/q=definitely-no-match/);
  if (!(await page.getByText("No results found.").isVisible()))
    throw new Error("No-results state missing");
  const axe = await new AxeBuilder({ page }).analyze();
  if (axe.violations.length)
    throw new Error(
      `Accessibility violations:\n${axe.violations.map((item) => `${item.id}: ${item.help}`).join("\n")}`,
    );
  await page.getByRole("button", { name: "Toggle dark mode" }).click();
  await page.screenshot({ path: "qa/search/desktop-dark.png", fullPage: true });
  await context.close();

  const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  if (sitemap.includes("/search"))
    throw new Error("Search leaked into sitemap");
  console.log(
    "Search QA passed: URL state, navigation history, keyboard suggestions, filters, sorting, empty states, responsive layouts, noindex, sitemap exclusion, dark mode and axe.",
  );
} finally {
  await browser.close();
}
