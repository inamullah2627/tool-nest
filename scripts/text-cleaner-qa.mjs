import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3103";
await mkdir("qa/text-cleaner", { recursive: true });
const browser = await chromium.launch();

try {
  for (const [name, width, height] of [["desktop", 1440, 1000], ["tablet", 768, 1024], ["mobile", 390, 844]]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/tools/text-cleaner`, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 1) throw new Error(`${name}: ${overflow}px horizontal overflow`);
    await page.getByLabel("Load Sample").click();
    await page.getByRole("button", { name: "Clean Text" }).click();
    const basic = await page.getByLabel("Cleaned text").inputValue();
    if (!basic.includes("<h2> Welcome to the ToolNest Blog!! </h2>")) throw new Error(`${name}: basic preset failed`);
    await page.getByRole("radio", { name: /Web Content Cleanup/ }).click();
    await page.getByRole("button", { name: "Clean Text" }).click();
    const web = await page.getByLabel("Cleaned text").inputValue();
    if (web.includes("<h2>") || !web.includes("Our guides & tutorials")) throw new Error(`${name}: inert HTML/entity cleanup failed`);
    await page.screenshot({ path: `qa/text-cleaner/${name}.png`, fullPage: true });
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/tools/text-cleaner`, { waitUntil: "networkidle" });
  const input = page.getByLabel("Original text");
  const multilingual = "\u0627\u0631\u062f\u0648 \u0939\u093f\u0902\u0926\u0940 cafe\u0301 \ud83d\ude0a";
  await input.fill(`${multilingual}\nVisit https://example.com\nEmail me@example.com\nrepeat\nrepeat`);
  await page.getByRole("radio", { name: /Custom Cleanup/ }).click();
  await page.getByRole("switch", { name: "Remove URLs" }).click();
  await page.getByRole("switch", { name: "Remove Email Addresses" }).click();
  await page.getByRole("switch", { name: "Remove Duplicate Lines" }).click();
  await page.getByRole("button", { name: "Clean Text" }).click();
  const output = await page.getByLabel("Cleaned text").inputValue();
  if (!output.includes(multilingual) || output.includes("https://") || output.includes("me@example.com") || output.match(/repeat/g)?.length !== 1) throw new Error("Combined multilingual/web/duplicate cleanup failed");
  await page.getByRole("switch", { name: "Remove Emojis" }).click();
  if (await page.getByLabel("Cleaned text").inputValue()) throw new Error("Stale output was not cleared");
  await page.getByText("Input or options changed. Clean the text again to update the results.").waitFor();
  await page.getByRole("button", { name: "Clean Text" }).click();
  if ((await page.getByLabel("Cleaned text").inputValue()).includes("\ud83d\ude0a")) throw new Error("Emoji removal failed");
  await page.getByLabel("Fullscreen").first().click();
  await page.keyboard.press("Escape");
  const axe = await new AxeBuilder({ page }).analyze();
  if (axe.violations.length) throw new Error(`Accessibility violations: ${axe.violations.map((item) => item.id).join(", ")}`);
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await page.screenshot({ path: "qa/text-cleaner/desktop-dark.png", fullPage: true });
  const sitemap = await (await page.request.get(`${baseUrl}/sitemap.xml`)).text();
  if (!sitemap.includes("/tools/text-cleaner")) throw new Error("Text Cleaner missing from sitemap");
  await context.close();
  console.log("Text Cleaner QA passed: presets, inert HTML, combined Unicode operations, duplicate reuse, stale output, responsive layout, fullscreen, accessibility, dark mode and sitemap.");
} finally {
  await browser.close();
}
