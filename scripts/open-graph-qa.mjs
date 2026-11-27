import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3102";
await mkdir("qa/open-graph-generator", { recursive: true });
const browser = await chromium.launch();

try {
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["tablet", 768, 1024],
    ["mobile", 390, 844],
  ]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/tools/open-graph-generator`, {
      waitUntil: "networkidle",
    });
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    if (overflow > 1)
      throw new Error(`${name}: ${overflow}px horizontal overflow`);
    await page.getByRole("button", { name: "Load Sample" }).click();
    const code = await page.getByLabel("Generated metadata code").inputValue();
    if (
      !code.includes('property="og:title"') ||
      !code.includes('name="twitter:card"')
    )
      throw new Error(`${name}: generated output missing required groups`);
    await page.screenshot({
      path: `qa/open-graph-generator/${name}.png`,
      fullPage: true,
    });
    await context.close();
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/tools/open-graph-generator`, {
    waitUntil: "networkidle",
  });
  await page.getByRole("button", { name: "Load Sample" }).click();
  await page.getByLabel("Page Title").fill('Café & "Guide"');
  if (await page.getByLabel("Generated metadata code").inputValue())
    throw new Error("Output was not cleared after input changed");
  await page
    .getByText("Generated output cleared because the metadata changed.")
    .waitFor();
  await page.getByLabel("Content Type").selectOption("article");
  await page.getByRole("button", { name: "Advanced Settings" }).click();
  await page.getByLabel("Article Author").fill("Ayesha Khan");
  await page.getByLabel("Article Tags").fill("SEO, Social");
  await page.getByRole("button", { name: "Generate Meta Tags" }).click();
  const articleCode = await page
    .getByLabel("Generated metadata code")
    .inputValue();
  if (
    !articleCode.includes("article:author") ||
    (articleCode.match(/article:tag/g) ?? []).length !== 2
  )
    throw new Error("Article conditional output failed");
  await page.getByRole("tab", { name: /Twitter Cards/ }).click();
  if (
    !(await page.getByLabel("Generated metadata code").inputValue()).includes(
      "summary_large_image",
    )
  )
    throw new Error("Twitter output tab failed");
  await page.getByRole("tab", { name: "X (Twitter)" }).click();
  await page.getByRole("tab", { name: "WhatsApp" }).click();
  await page.getByRole("tab", { name: "LinkedIn" }).click();
  await page.getByRole("tab", { name: "Facebook" }).click();
  await page
    .locator('input[type="file"]')
    .setInputFiles(resolve("qa/about/desktop.png"));
  await page.getByText(/desktop\.png/).waitFor();
  await page.getByRole("button", { name: "Use dimensions" }).click();
  if ((await page.getByLabel("Image Width").inputValue()) !== "1440")
    throw new Error("Local image dimensions were not applied");
  await page.getByRole("button", { name: "Fullscreen code preview" }).click();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Fullscreen code preview" }).waitFor();
  const axe = await new AxeBuilder({ page }).analyze();
  if (axe.violations.length)
    throw new Error(
      `Accessibility violations: ${axe.violations.map((item) => item.id).join(", ")}`,
    );
  await page.evaluate(() =>
    document.documentElement.setAttribute("data-theme", "dark"),
  );
  await page.screenshot({
    path: "qa/open-graph-generator/desktop-dark.png",
    fullPage: true,
  });
  const sitemap = await (
    await page.request.get(`${baseUrl}/sitemap.xml`)
  ).text();
  if (!sitemap.includes("/tools/open-graph-generator"))
    throw new Error("Tool missing from sitemap");
  await context.close();
  console.log(
    "Open Graph Generator QA passed: responsive layout, stale output, conditional metadata, platform/output tabs, local image dimensions, fullscreen, accessibility, dark mode and sitemap.",
  );
} finally {
  await browser.close();
}
