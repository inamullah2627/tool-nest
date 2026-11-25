import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await context.newPage();
const checks = [];
const check = (name, passed) => {
  checks.push([name, Boolean(passed)]);
  if (!passed) process.exitCode = 1;
};

await page.goto(`${base}/tools/json-formatter`, { waitUntil: "networkidle" });
check("tool route", page.url().endsWith("/tools/json-formatter"));
check(
  "tool heading",
  await page
    .getByRole("heading", { name: "JSON Formatter & Validator" })
    .isVisible(),
);

const input = page.getByLabel("JSON input");
await input.fill('{"z":1,"nested":{"b":2,"a":1},"items":[3,1,2]}');
await page.getByRole("button", { name: "Format JSON", exact: true }).click();
await page.getByText("JSON formatted.").waitFor();
check(
  "format JSON",
  (await page.getByLabel("Read-only JSON output").textContent())?.includes(
    '"nested"',
  ),
);
check(
  "recent recorded",
  await page.evaluate(() =>
    JSON.parse(localStorage.getItem("toolnest:recent") ?? "[]").includes(
      "json-formatter",
    ),
  ),
);

await page.getByRole("switch", { name: "Sort Keys" }).click();
await page.waitForFunction(() => {
  const text =
    document.querySelector('[aria-label="Read-only JSON output"]')
      ?.textContent ?? "";
  return text.indexOf('"a"') >= 0 && text.indexOf('"a"') < text.indexOf('"b"');
});
const sorted = await page.getByLabel("Read-only JSON output").textContent();
check(
  "recursive sort",
  sorted.indexOf('"a"') >= 0 && sorted.indexOf('"a"') < sorted.indexOf('"b"'),
);

await page.getByRole("button", { name: "Minify JSON" }).click();
await page.getByText("JSON minified.").waitFor();
check(
  "minify JSON",
  !(await page.getByLabel("Read-only JSON output").textContent()).includes(
    "\n",
  ),
);

await input.fill('{"broken":true,}');
check(
  "stale output cleared",
  (await page.locator(".code-output").count()) === 0,
);
await page.getByRole("button", { name: "Format JSON", exact: true }).click();
await page.getByRole("heading", { name: "Invalid JSON" }).waitFor();
check("invalid JSON error", await page.locator(".wsp .alert").isVisible());

await page.getByRole("button", { name: "Load Sample" }).first().click();
await page.getByRole("button", { name: "Format JSON", exact: true }).click();
await page.getByText("JSON formatted.").waitFor();
await page.getByRole("button", { name: "Tree view", exact: true }).click();
check("tree view", await page.locator(".tree").isVisible());
await page.getByRole("button", { name: "Collapse All" }).click();
check("collapse all", (await page.locator(".tree .tn.col").count()) > 0);
await page.getByRole("button", { name: "Expand All" }).click();
check("expand all", (await page.locator(".tree .tn.col").count()) === 0);

await page.getByRole("button", { name: "Fullscreen" }).click();
check("fullscreen", await page.locator(".wsp.fs").isVisible());
await page.keyboard.press("Escape");
check("fullscreen escape", (await page.locator(".wsp.fs").count()) === 0);

await page.getByRole("button", { name: /Favorites/ }).click();
check(
  "favorite tool",
  (await page
    .getByRole("button", { name: /Favorites/ })
    .getAttribute("aria-pressed")) === "true",
);

const downloadPromise = page.waitForEvent("download");
await page.getByRole("button", { name: "Download JSON", exact: true }).click();
const download = await downloadPromise;
check("download JSON", download.suggestedFilename() === "formatted.json");

await page.locator('input[type="file"]').setInputFiles({
  name: "uploaded.json",
  mimeType: "application/json",
  buffer: Buffer.from('{"uploaded":true}'),
});
await page.waitForFunction(() =>
  (document.querySelector('[aria-label="JSON input"]')?.value ?? "").includes(
    "uploaded",
  ),
);
check("upload JSON", (await input.inputValue()).includes("uploaded"));

await page.setViewportSize({ width: 390, height: 844 });
const mobileOverflow = await page.evaluate(() => ({
  page: document.documentElement.scrollWidth - innerWidth,
  elements: [...document.querySelectorAll("*")]
    .filter(
      (element) =>
        element.getBoundingClientRect().right > innerWidth + 1 ||
        element.getBoundingClientRect().left < -1,
    )
    .slice(0, 8)
    .map((element) => `${element.tagName}.${element.className}`),
  scrollContainers: [...document.querySelectorAll("*")]
    .filter((element) => element.scrollWidth > element.clientWidth + 1)
    .slice(0, 12)
    .map(
      (element) =>
        `${element.tagName}.${element.className}:${element.scrollWidth}/${element.clientWidth}`,
    ),
}));
check("mobile responsive", mobileOverflow.page <= 0);
if (mobileOverflow.page > 0) console.log("OVERFLOW", mobileOverflow);

await page.setViewportSize({ width: 1440, height: 1000 });
const serious = (await new AxeBuilder({ page }).analyze()).violations.filter(
  (violation) => ["serious", "critical"].includes(violation.impact ?? ""),
);
check("serious accessibility violations", serious.length === 0);
if (serious.length) console.log("AXE", JSON.stringify(serious, null, 2));
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
check("tool in sitemap", sitemap.includes("/tools/json-formatter"));

for (const [name, passed] of checks)
  console.log(`${passed ? "PASS" : "FAIL"}: ${name}`);
await browser.close();
