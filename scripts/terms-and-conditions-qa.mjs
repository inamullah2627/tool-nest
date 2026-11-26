import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3100";
await mkdir("qa/terms-and-conditions", { recursive: true });
const browser = await chromium.launch();

try {
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["tablet", 768, 1024],
    ["mobile", 390, 844],
  ]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/terms-and-conditions`, {
      waitUntil: "networkidle",
    });
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    if (overflow > 1)
      throw new Error(`${name}: ${overflow}px horizontal overflow`);
    if ((await page.locator(".legal-section").count()) !== 19)
      throw new Error(`${name}: terms section count mismatch`);
    await page.screenshot({
      path: `qa/terms-and-conditions/${name}.png`,
      fullPage: true,
    });
    await context.close();
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/terms-and-conditions`, {
    waitUntil: "networkidle",
  });
  const robots = await page
    .locator('meta[name="robots"]')
    .getAttribute("content");
  if (!robots?.includes("noindex") || !robots.includes("nofollow"))
    throw new Error(`Unexpected robots metadata: ${robots}`);
  await page
    .getByRole("button", { name: "Governing Law and Disputes" })
    .click();
  await page.waitForFunction(() => location.hash === "#terms-governing-law");
  await page.waitForFunction(() =>
    document
      .querySelector('[aria-current="true"]')
      ?.textContent?.includes("Governing Law and Disputes"),
  );
  if (
    (await page
      .locator('.legal-related-card[href="/privacy-policy"]')
      .count()) !== 1
  )
    throw new Error("Privacy Policy cross-link is missing");
  if (
    (await page.locator('.legal-contact-card a[href="/contact"]').count()) !== 1
  )
    throw new Error("Contact link is missing");
  const body = await page.locator("body").innerText();
  if (
    !body.includes("No governing law") ||
    !body.includes("operator's legal identity")
  )
    throw new Error("Required legal placeholders are missing");

  await page.getByRole("button", { name: "Toggle dark mode" }).click();
  await page.waitForFunction(() =>
    document.documentElement.classList.contains("dark"),
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "qa/terms-and-conditions/desktop-dark.png",
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
  await mobile.goto(`${baseUrl}/terms-and-conditions`, {
    waitUntil: "networkidle",
  });
  const toc = mobile.getByRole("button", { name: "On This Page" });
  if ((await toc.getAttribute("aria-expanded")) !== "false")
    throw new Error("Mobile TOC should start collapsed");
  await toc.click();
  if ((await toc.getAttribute("aria-expanded")) !== "true")
    throw new Error("Mobile TOC did not expand");
  await mobileContext.close();

  const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  if (sitemap.includes("/terms-and-conditions"))
    throw new Error("Draft Terms must remain outside sitemap");
  console.log(
    "Terms QA passed: draft metadata, sitemap exclusion, centralized sections, TOC navigation, mobile accordion, cross-links, responsive overflow, dark mode and axe audit.",
  );
} finally {
  await browser.close();
}
