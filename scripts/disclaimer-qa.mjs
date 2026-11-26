import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3100";
await mkdir("qa/disclaimer", { recursive: true });
const browser = await chromium.launch();

try {
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["tablet", 768, 1024],
    ["mobile", 390, 844],
  ]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/disclaimer`, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    if (overflow > 1)
      throw new Error(`${name}: ${overflow}px horizontal overflow`);
    if ((await page.locator(".legal-section").count()) !== 16)
      throw new Error(`${name}: disclaimer section count mismatch`);
    await page.screenshot({
      path: `qa/disclaimer/${name}.png`,
      fullPage: true,
    });
    await context.close();
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/disclaimer`, { waitUntil: "networkidle" });
  const robots = await page
    .locator('meta[name="robots"]')
    .getAttribute("content");
  if (!robots?.includes("noindex") || !robots.includes("nofollow"))
    throw new Error(`Unexpected robots metadata: ${robots}`);
  await page.getByRole("button", { name: "SEO Tools Disclaimer" }).click();
  await page.waitForFunction(() => location.hash === "#disclaimer-seo-tools");
  await page.waitForFunction(() =>
    document
      .querySelector('[aria-current="true"]')
      ?.textContent?.includes("SEO Tools Disclaimer"),
  );

  const relatedHrefs = await page
    .locator(".legal-related-card")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  if (
    !relatedHrefs.includes("/privacy-policy") ||
    !relatedHrefs.includes("/terms-and-conditions")
  )
    throw new Error("Disclaimer legal cross-links are incomplete");
  if (
    (await page.locator('.legal-contact-card a[href="/contact"]').count()) !== 1
  )
    throw new Error("Disclaimer Contact link is missing");

  const body = await page.locator("body").innerText();
  for (const disclosure of [
    "200 words per minute",
    "130 words per minute",
    "JSON Formatter",
    "Meta Tag Generator",
    "Not currently available",
    "No advertising service is active",
  ]) {
    if (!body.includes(disclosure))
      throw new Error(`Missing verified disclosure: ${disclosure}`);
  }

  await page.getByRole("button", { name: "Toggle dark mode" }).click();
  await page.waitForFunction(() =>
    document.documentElement.classList.contains("dark"),
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "qa/disclaimer/desktop-dark.png",
    fullPage: true,
  });
  const axe = await new AxeBuilder({ page }).analyze();
  if (axe.violations.length)
    throw new Error(
      `Accessibility violations:\n${axe.violations.map((item) => `${item.id}: ${item.help}`).join("\n")}`,
    );
  await context.close();

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const mobile = await mobileContext.newPage();
  await mobile.goto(`${baseUrl}/disclaimer`, { waitUntil: "networkidle" });
  const toc = mobile.getByRole("button", { name: "On This Page" });
  if ((await toc.getAttribute("aria-expanded")) !== "false")
    throw new Error("Mobile TOC should start collapsed");
  await toc.click();
  if ((await toc.getAttribute("aria-expanded")) !== "true")
    throw new Error("Mobile TOC did not expand");
  await mobileContext.close();

  const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  for (const path of [
    "/disclaimer",
    "/privacy-policy",
    "/terms-and-conditions",
  ]) {
    if (sitemap.includes(path))
      throw new Error(`Draft legal route leaked into sitemap: ${path}`);
  }
  console.log(
    "Disclaimer QA passed: verified tool disclosures, legal interlinks, draft metadata, sitemap exclusion, TOC navigation, mobile accordion, responsive overflow, dark mode and axe audit.",
  );
} finally {
  await browser.close();
}
