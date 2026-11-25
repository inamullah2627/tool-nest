import { chromium } from "playwright";

const browser = await chromium.launch();
const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const checks = [];
const check = (name, passed) => {
  checks.push([name, passed]);
  if (!passed) process.exitCode = 1;
};

await page.goto(`${baseUrl}/`);
check(
  "homepage heading",
  await page.getByRole("heading", { name: /Every Tool You Need/ }).isVisible(),
);
await page
  .getByRole("link", { name: "All Tools", exact: true })
  .first()
  .click();
await page.waitForURL("**/tools");
await page.getByRole("heading", { name: "Explore All Tools" }).waitFor();
check("real /tools URL", new URL(page.url()).pathname === "/tools");
check(
  "directory visible",
  await page.getByRole("heading", { name: "Explore All Tools" }).isVisible(),
);

const search = page.getByRole("textbox", { name: "Search tools" });
await search.fill("JSON Formatter");
check("directory search", (await page.locator(".dir .tc").count()) === 1);
await search.fill("");
await page
  .getByRole("button", { name: /Text Tools/ })
  .last()
  .click();
check("category filter", (await page.locator(".dir .tc").count()) === 5);
await page.getByRole("button", { name: "List view" }).click();
check("list view", await page.locator(".dir .tg.lv").isVisible());
await page.locator(".faq .qi button").nth(1).click();
check(
  "directory FAQ",
  await page
    .locator(".faq .qi")
    .nth(1)
    .evaluate((item) => item.classList.contains("open")),
);

const beforeTheme = await page.locator("html").getAttribute("class");
await page.locator("header .tt:visible").click();
check(
  "theme toggle",
  (await page.locator("html").getAttribute("class")) !== beforeTheme,
);

await page.setViewportSize({ width: 390, height: 844 });
await page.getByRole("button", { name: "Open menu" }).click();
check(
  "mobile navigation",
  await page
    .locator(".drawer.open")
    .evaluate((drawer) => drawer.classList.contains("open")),
);

for (const [name, passed] of checks)
  console.log(`${passed ? "PASS" : "FAIL"}: ${name}`);
await browser.close();
