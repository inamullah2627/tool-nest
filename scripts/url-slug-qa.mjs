import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3101";
await mkdir("qa/url-slug-generator", { recursive: true });
const browser = await chromium.launch();

try {
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["tablet", 768, 1024],
    ["mobile", 390, 844],
  ]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/tools/url-slug-generator`, {
      waitUntil: "networkidle",
    });
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    if (overflow > 1)
      throw new Error(`${name}: ${overflow}px horizontal overflow`);
    await page.screenshot({
      path: `qa/url-slug-generator/${name}.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "Load sample" }).click();
    const slug = await page
      .getByPlaceholder("Your slug will appear here")
      .inputValue();
    if (slug !== "10-best-seo-tools-for-web-developers")
      throw new Error(`${name}: default slug generation failed: ${slug}`);
    await context.close();
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/tools/url-slug-generator`, {
    waitUntil: "networkidle",
  });
  await page
    .getByPlaceholder("Enter your page title, blog post title or text...")
    .fill("Café हिंदी Guide Guide 2026");
  await page.getByRole("switch", { name: "Remove Numbers" }).click();
  await page.getByRole("switch", { name: "Remove Duplicate Words" }).click();
  if (
    (await page.getByPlaceholder("Your slug will appear here").inputValue()) !==
    "cafe-हिंदी-guide"
  )
    throw new Error("Unicode/options output failed");
  await page
    .getByPlaceholder("https://example.com/blog/")
    .fill("javascript:alert(1)");
  await page
    .getByText("Enter a complete URL beginning with http:// or https://.")
    .waitFor();
  await page
    .getByPlaceholder("https://example.com/blog/")
    .fill("https://example.com/blog");
  await page.getByRole("button", { name: "Bulk Generator" }).click();
  await page
    .getByLabel("Bulk titles")
    .fill("Hello World\n!!!\nhello world\n東京");
  if (
    (await page.getByLabel("Generated slugs").inputValue()) !==
    "hello-world\n\nhello-world\n東京"
  )
    throw new Error("Bulk order/output failed");
  await page.getByText("1 empty").waitFor();
  await page.getByText("1 duplicate slugs").waitFor();
  const violations = await new AxeBuilder({ page }).analyze();
  if (violations.violations.length)
    throw new Error(
      `Accessibility violations: ${violations.violations.map((item) => item.id).join(", ")}`,
    );
  await page.evaluate(() =>
    document.documentElement.setAttribute("data-theme", "dark"),
  );
  await page.screenshot({
    path: "qa/url-slug-generator/desktop-dark.png",
    fullPage: true,
  });
  const sitemap = await (
    await page.request.get(`${baseUrl}/sitemap.xml`)
  ).text();
  if (!sitemap.includes("/tools/url-slug-generator"))
    throw new Error("Tool missing from sitemap");
  await context.close();
  console.log(
    "URL Slug Generator QA passed: responsive layout, single/bulk generation, Unicode, settings, URL validation, accessibility, dark mode and sitemap.",
  );
} finally {
  await browser.close();
}
