import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3100";
await mkdir("qa/duplicate-lines", { recursive: true });
const browser = await chromium.launch();

try {
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["tablet", 768, 1024],
    ["mobile", 390, 844],
  ]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/tools/remove-duplicate-lines`, {
      waitUntil: "networkidle",
    });
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    if (overflow > 1)
      throw new Error(`${name}: ${overflow}px horizontal overflow`);
    await page.getByLabel("Load Sample").click();
    await page.getByRole("button", { name: "Remove Duplicate Lines" }).click();
    await page.getByText("Unique Lines generated.").waitFor();
    const output = await page.getByLabel("Processed text").inputValue();
    if (output !== "Apple\nBanana\nOrange\nMango\nGrapes\nPineapple")
      throw new Error(`${name}: unique output failed`);
    await page.screenshot({
      path: `qa/duplicate-lines/${name}.png`,
      fullPage: true,
    });
    await context.close();
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/tools/remove-duplicate-lines`, {
    waitUntil: "networkidle",
  });
  const input = page.getByLabel("Original text");
  await input.fill(" Apple \nBanana\nApple\nbanana\n東京\n東京\n\n");
  await page.getByRole("switch", { name: "Case Sensitive" }).click();
  await page.locator("#duplicate-keep").selectOption("last");
  await page.getByRole("button", { name: "Remove Duplicate Lines" }).click();
  await page.getByText("Unique Lines generated.").waitFor();
  if (
    (await page.getByLabel("Processed text").inputValue()) !==
    "Apple\nbanana\n東京"
  )
    throw new Error("Case-insensitive keep-last failed");
  await page.locator("#duplicate-sort").selectOption("az");
  if (await page.getByLabel("Processed text").inputValue())
    throw new Error("Stale output was not cleared");
  await page
    .getByText("Input or options changed. Process again to update the results.")
    .waitFor();
  await page
    .getByRole("button", { name: "Duplicate Lines Only", exact: true })
    .click();
  await page.getByRole("button", { name: "Find Duplicate Lines" }).click();
  await page.getByText("Duplicate Lines Only generated.").waitFor();
  if (
    (await page.getByLabel("Processed text").inputValue()) !==
    "Apple\nbanana\n東京"
  )
    throw new Error("Duplicate-only output failed");
  await page
    .getByRole("button", { name: "Non-Repeated Lines Only", exact: true })
    .click();
  await page.getByRole("button", { name: "Keep Non-Repeated Lines" }).click();
  await page.getByText("Non-Repeated Lines Only generated.").waitFor();
  if (await page.getByLabel("Processed text").inputValue())
    throw new Error("Expected empty non-repeated output");
  await page
    .getByText("No non-repeated lines remain with these settings.")
    .waitFor();
  await page.getByLabel("Fullscreen").first().click();
  if (
    !(await page
      .locator(".duplicate-workspace .wsp")
      .evaluate((element) => element.classList.contains("fs")))
  )
    throw new Error("Fullscreen failed");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Toggle dark mode" }).click();
  const axe = await new AxeBuilder({ page }).analyze();
  if (axe.violations.length)
    throw new Error(
      `Accessibility violations: ${axe.violations.map((item) => item.id).join(", ")}`,
    );
  await page.screenshot({
    path: "qa/duplicate-lines/desktop-dark.png",
    fullPage: true,
  });
  await context.close();

  const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  if (!sitemap.includes("/tools/remove-duplicate-lines"))
    throw new Error("Remove Duplicate Lines missing from sitemap");
  console.log(
    "Remove Duplicate Lines QA passed: all output modes, matching, keep-last, sorting invalidation, empty output, responsive layout, fullscreen, accessibility and sitemap.",
  );
} finally {
  await browser.close();
}
