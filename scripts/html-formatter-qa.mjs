import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3100";
await mkdir("qa/html-formatter", { recursive: true });
const browser = await chromium.launch();

try {
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["tablet", 768, 1024],
    ["mobile", 390, 844],
  ]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/tools/html-formatter`, {
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
    await page.getByRole("button", { name: "Format HTML" }).click();
    await page.getByText("HTML formatted.").waitFor();
    if (
      !(await page.getByLabel("Read-only HTML output").textContent())?.includes(
        "Hello ToolNest",
      )
    )
      throw new Error(`${name}: formatting output missing`);
    await page.screenshot({
      path: `qa/html-formatter/${name}.png`,
      fullPage: true,
    });
    await context.close();
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/tools/html-formatter`, {
    waitUntil: "networkidle",
  });
  const input = page.getByLabel("HTML input");
  const source =
    "<p>Hello <strong>世界 🌍</strong> !</p><pre>  a\n b </pre><!--keep--><script>const x = 1 < 2;</script>";
  await input.fill(source);
  await page.getByRole("button", { name: "Minify HTML" }).click();
  await page.getByText("HTML minified.").waitFor();
  const minified = await page.getByLabel("Read-only HTML output").textContent();
  for (const expected of [
    "世界 🌍",
    "Hello",
    " a",
    "<!--keep-->",
    "const x = 1 < 2;",
  ])
    if (!minified?.includes(expected))
      throw new Error(`Conservative output lost: ${expected}`);
  await page.getByRole("button", { name: "Advanced Options" }).click();
  await page
    .getByRole("switch", { name: "Preserve Existing Line Breaks" })
    .click();
  if (await page.getByLabel("Read-only HTML output").count())
    throw new Error("Output was not cleared after settings changed");
  await input.fill("<div><span>changed</span></div>");
  if (await page.getByLabel("Read-only HTML output").count())
    throw new Error("Output was not cleared after input changed");
  await page.getByRole("button", { name: "Format HTML" }).click();
  await page.getByText("HTML formatted.").waitFor();
  await page.getByRole("button", { name: "Fullscreen" }).first().click();
  if (
    !(await page
      .locator(".html-workspace .wsp")
      .evaluate((element) => element.classList.contains("fs")))
  )
    throw new Error("Fullscreen failed");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Toggle dark mode" }).click();
  await page.screenshot({
    path: "qa/html-formatter/desktop-dark.png",
    fullPage: true,
  });
  const axe = await new AxeBuilder({ page }).analyze();
  if (axe.violations.length)
    throw new Error(
      `Accessibility violations:\n${axe.violations
        .map(
          (item) =>
            `${item.id}: ${item.help}\n${item.nodes
              .map((node) => `  ${node.target.join(" ")}: ${node.failureSummary}`)
              .join("\n")}`,
        )
        .join("\n")}`,
    );
  await context.close();

  const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  if (!sitemap.includes("/tools/html-formatter"))
    throw new Error("HTML Formatter missing from sitemap");
  console.log(
    "HTML Formatter QA passed: browser Worker formatting/minification, Unicode and whitespace preservation, stale-output prevention, responsive layouts, fullscreen, dark mode, accessibility and sitemap integration.",
  );
} finally {
  await browser.close();
}
