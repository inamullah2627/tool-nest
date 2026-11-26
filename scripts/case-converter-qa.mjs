import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3100";
await mkdir("qa/case-converter", { recursive: true });
const browser = await chromium.launch();

try {
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["tablet", 768, 1024],
    ["mobile", 390, 844],
  ]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/tools/case-converter`, {
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
    await page.getByRole("radio", { name: /Title Case/ }).click();
    if (
      !(await page.getByLabel("Converted text").inputValue()).includes(
        "Welcome to Toolnest",
      )
    )
      throw new Error(`${name}: instant conversion failed`);
    await page.screenshot({
      path: `qa/case-converter/${name}.png`,
      fullPage: true,
    });
    await context.close();
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/tools/case-converter`, {
    waitUntil: "networkidle",
  });
  const input = page.getByLabel("Original text");
  await input.fill("parseHTTPResponse-value_name\nélan ÜBER");
  await page.getByRole("radio", { name: /snake_case/ }).click();
  if (
    (await page.getByLabel("Converted text").inputValue()) !==
    "parse_http_response_value_name\nélan_über"
  )
    throw new Error("Developer identifier conversion failed");
  if ((await input.inputValue()) !== "parseHTTPResponse-value_name\nélan ÜBER")
    throw new Error("Original input changed when switching mode");
  await page.getByRole("button", { name: "Use Output as Input" }).click();
  if (
    (await input.inputValue()) !== "parse_http_response_value_name\nélan_über"
  )
    throw new Error("Use Output as Input failed");
  await page.getByLabel("Fullscreen").first().click();
  if (
    !(await page
      .locator(".cc-w")
      .evaluate((element) => element.classList.contains("fs")))
  )
    throw new Error("Fullscreen failed");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Toggle dark mode" }).click();
  const axe = await new AxeBuilder({ page }).analyze();
  if (axe.violations.length)
    throw new Error(
      `Accessibility violations:\n${axe.violations
        .map(
          (item) =>
            `${item.id}\n${item.nodes.map((node) => `  ${node.target.join(" ")}: ${node.failureSummary}`).join("\n")}`,
        )
        .join("\n")}`,
    );
  await page.screenshot({
    path: "qa/case-converter/desktop-dark.png",
    fullPage: true,
  });
  await context.close();

  const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  if (!sitemap.includes("/tools/case-converter"))
    throw new Error("Case Converter missing from sitemap");
  console.log(
    "Case Converter QA passed: instant standard/developer conversion, input preservation, responsive layout, fullscreen, dark mode, accessibility and sitemap.",
  );
} finally {
  await browser.close();
}
