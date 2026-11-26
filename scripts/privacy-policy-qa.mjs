import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3100";
await mkdir("qa/privacy-policy", { recursive: true });
const browser = await chromium.launch();

try {
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["tablet", 768, 1024],
    ["mobile", 390, 844],
  ]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/privacy-policy`, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    if (overflow > 1)
      throw new Error(`${name}: ${overflow}px horizontal overflow`);
    if ((await page.locator(".legal-section").count()) !== 14)
      throw new Error(`${name}: legal section count mismatch`);
    await page.screenshot({
      path: `qa/privacy-policy/${name}.png`,
      fullPage: true,
    });
    await context.close();
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/privacy-policy`, { waitUntil: "networkidle" });
  const robots = await page
    .locator('meta[name="robots"]')
    .getAttribute("content");
  if (!robots?.includes("noindex") || !robots.includes("nofollow"))
    throw new Error(`Unexpected robots metadata: ${robots}`);
  await page
    .getByRole("button", { name: /Cookies and Browser Storage/ })
    .click();
  await page.waitForFunction(() => location.hash === "#privacy-storage");
  await page.waitForFunction(() =>
    document
      .querySelector('[aria-current="true"]')
      ?.textContent?.includes("Cookies and Browser Storage"),
  );
  if (
    (await page.locator(".legal-contact-card a").getAttribute("href")) !==
    "/contact?inquiry=privacy-concern"
  )
    throw new Error("Privacy Contact action is not preselected");

  await page.getByRole("button", { name: "Toggle dark mode" }).click();
  await page.waitForFunction(() =>
    document.documentElement.classList.contains("dark"),
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "qa/privacy-policy/desktop-dark.png",
    fullPage: true,
  });
  const axe = await new AxeBuilder({ page }).analyze();
  if (axe.violations.length)
    throw new Error(
      `Accessibility violations:\n${axe.violations.map((item) => `${item.id}: ${item.help} (${item.nodes.map((node) => node.target.join(" ")).join(", ")})`).join("\n")}`,
    );
  await context.close();

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const mobile = await mobileContext.newPage();
  await mobile.goto(`${baseUrl}/privacy-policy`, { waitUntil: "networkidle" });
  const tocButton = mobile.getByRole("button", { name: "On This Page" });
  if ((await tocButton.getAttribute("aria-expanded")) !== "false")
    throw new Error("Mobile contents should start collapsed");
  await tocButton.click();
  if ((await tocButton.getAttribute("aria-expanded")) !== "true")
    throw new Error("Mobile contents did not expand");
  await mobileContext.close();

  const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  if (sitemap.includes("/privacy-policy"))
    throw new Error("Draft Privacy Policy must remain outside sitemap");
  console.log(
    "Privacy Policy QA passed: draft indexing, sitemap exclusion, TOC navigation, mobile accordion, responsive overflow, dark mode and axe audit.",
  );
} finally {
  await browser.close();
}
