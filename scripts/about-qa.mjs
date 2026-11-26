import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3100";
const viewports = [
  ["desktop", 1440, 1000],
  ["tablet", 768, 1024],
  ["mobile", 390, 844],
];

await mkdir("qa/about", { recursive: true });
const browser = await chromium.launch();

try {
  for (const [name, width, height] of viewports) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/about`, { waitUntil: "networkidle" });

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    if (overflow > 1)
      throw new Error(`${name}: ${overflow}px horizontal overflow`);

    const categoryCards = await page.locator(".about-category-card").count();
    const sectionLinks = await page.locator(".about-section-nav a").count();
    if (categoryCards !== 6)
      throw new Error(
        `${name}: expected 6 category cards, got ${categoryCards}`,
      );
    if (sectionLinks !== 5)
      throw new Error(`${name}: expected 5 section links, got ${sectionLinks}`);

    await page.screenshot({ path: `qa/about/${name}.png`, fullPage: true });
    await context.close();
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/about`, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Discover Our Mission" }).click();
  await page.waitForFunction(() => location.hash === "#about-mission");

  await page.getByRole("button", { name: "Toggle dark mode" }).click();
  await page.waitForFunction(() =>
    document.documentElement.classList.contains("dark"),
  );
  await page.screenshot({ path: "qa/about/desktop-dark.png", fullPage: true });

  const results = await new AxeBuilder({ page }).analyze();
  if (results.violations.length) {
    throw new Error(
      `Accessibility violations:\n${results.violations.map((item) => `${item.id}: ${item.help} ${item.nodes.map((node) => node.target.join(" ")).join(", ")}`).join("\n")}`,
    );
  }
  console.log(
    "About QA passed: responsive overflow, content, navigation, dark mode and axe audit.",
  );
  await context.close();
} finally {
  await browser.close();
}
