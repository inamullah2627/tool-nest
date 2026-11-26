import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3100";
await mkdir("qa/css-minifier", { recursive: true });
const browser = await chromium.launch();

try {
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["tablet", 768, 1024],
    ["mobile", 390, 844],
  ]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/tools/css-minifier`, {
      waitUntil: "networkidle",
    });
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    if (overflow > 1)
      throw new Error(`${name}: ${overflow}px horizontal overflow`);
    await page.getByLabel("Load Sample").first().click();
    await page.getByRole("button", { name: "Minify CSS" }).click();
    await page.getByText("CSS minified.").waitFor();
    const output = await page.getByLabel("Read-only CSS output").textContent();
    if (!output?.includes(".card{"))
      throw new Error(`${name}: Worker minification failed`);
    await page.screenshot({
      path: `qa/css-minifier/${name}.png`,
      fullPage: true,
    });
    await context.close();
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  const requested = [];
  page.on("request", (request) => requested.push(request.url()));
  await page.goto(`${baseUrl}/tools/css-minifier`, {
    waitUntil: "networkidle",
  });
  const input = page.getByLabel("CSS input");
  await input.fill(
    '/*! License */ :root { --gap: calc(100% - 2rem); } .hero { content: "世界  x"; background: url("https://example.invalid/a b.svg"); }',
  );
  await page.getByRole("button", { name: "Minify CSS" }).click();
  await page.getByText("CSS minified.").waitFor();
  const output = await page.getByLabel("Read-only CSS output").textContent();
  for (const expected of [
    "License",
    "--gap:calc(100% - 2rem)",
    "世界  x",
    "example.invalid",
  ])
    if (!output?.includes(expected))
      throw new Error(`Conservative output lost: ${expected}`);
  if (requested.some((url) => url.includes("example.invalid")))
    throw new Error("CSS URL was fetched");
  await page.getByRole("switch", { name: "Preserve License Comments" }).click();
  if (await page.getByLabel("Read-only CSS output").count())
    throw new Error("Output was not cleared after settings changed");
  await input.fill(".a { color:");
  await page.getByRole("button", { name: "Minify CSS" }).click();
  const processingAlert = page.locator(".css-workspace .alert");
  await processingAlert.waitFor();
  const invalidMessage = await processingAlert.textContent();
  if (!invalidMessage?.includes("Missing closing token"))
    throw new Error(`Invalid CSS error missing: ${invalidMessage}`);
  await input.fill(".a{color:red}");
  await page.getByRole("button", { name: "Beautify CSS" }).click();
  await page.getByText("CSS beautified.").waitFor();
  await page.getByLabel("Fullscreen").first().click();
  if (
    !(await page
      .locator(".css-workspace .wsp")
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
    path: "qa/css-minifier/desktop-dark.png",
    fullPage: true,
  });
  await context.close();

  const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  if (!sitemap.includes("/tools/css-minifier"))
    throw new Error("CSS Minifier missing from sitemap");
  console.log(
    "CSS Minifier QA passed: browser Worker minification/beautification, conservative values/comments, invalid CSS, stale output, no URL fetch, responsive layout, fullscreen, accessibility and sitemap.",
  );
} finally {
  await browser.close();
}
