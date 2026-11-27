import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3104";
await mkdir("qa/date-calculator", { recursive: true });
const browser = await chromium.launch();

try {
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["tablet", 768, 1024],
    ["mobile", 390, 844],
  ]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/tools/date-difference-calculator`, {
      waitUntil: "networkidle",
    });
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    if (overflow > 1)
      throw new Error(`${name}: ${overflow}px horizontal overflow`);
    await page
      .getByRole("textbox", { name: "Start Date", exact: true })
      .fill("2024-01-01");
    await page
      .getByRole("textbox", { name: "End Date", exact: true })
      .fill("2025-01-01");
    await page.getByRole("button", { name: "Calculate Difference" }).click();
    await page
      .locator(".calculator-primary > b")
      .filter({ hasText: "366 Days" })
      .waitFor();
    await page.screenshot({
      path: `qa/date-calculator/${name}.png`,
      fullPage: true,
    });
    await context.close();
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/tools/date-difference-calculator`, {
    waitUntil: "networkidle",
  });

  await page.getByRole("tab", { name: "Add / Subtract Dates" }).click();
  await page.getByLabel("Starting Date").fill("2025-01-31");
  await page.getByLabel("Months").fill("1");
  await page.getByRole("button", { name: "Calculate Date" }).click();
  await page
    .locator(".calculator-primary > b")
    .filter({ hasText: "February 28, 2025" })
    .waitFor();
  await page.getByText(/End-of-month adjustment/).waitFor();
  await page.getByLabel("Months").fill("2");
  await page.getByText("Inputs changed", { exact: true }).waitFor();

  await page.getByRole("tab", { name: "Business Days" }).click();
  await page
    .getByRole("textbox", { name: "Start Date", exact: true })
    .fill("2026-06-01");
  await page
    .getByRole("textbox", { name: "End Date", exact: true })
    .fill("2026-06-08");
  await page.getByRole("button", { name: /Exclude Holidays/ }).click();
  await page.getByLabel("Holiday date").fill("2026-06-02");
  await page.getByRole("button", { name: "Add Holiday" }).click();
  await page
    .getByRole("button", { name: "Calculate Business Days", exact: true })
    .click();
  await page.getByText("4 Business Days", { exact: true }).waitFor();

  const axe = await new AxeBuilder({ page }).analyze();
  if (axe.violations.length)
    throw new Error(
      `Accessibility violations: ${axe.violations.map((item) => `${item.id}: ${item.nodes.map((node) => node.html).join(" | ")}`).join("; ")}`,
    );
  await page.evaluate(() =>
    document.documentElement.setAttribute("data-theme", "dark"),
  );
  await page.screenshot({
    path: "qa/date-calculator/desktop-dark.png",
    fullPage: true,
  });
  const sitemap = await (
    await page.request.get(`${baseUrl}/sitemap.xml`)
  ).text();
  if (
    !sitemap.includes("/tools/date-difference-calculator") ||
    !sitemap.includes("/tools/category/calculators")
  )
    throw new Error("Calculator route or category missing from sitemap");
  await context.close();
  console.log(
    "Date Calculator QA passed: responsive layout, date difference, leap year, month-end adjustment, stale output, business days, holidays, accessibility, dark mode and sitemap.",
  );
} finally {
  await browser.close();
}
