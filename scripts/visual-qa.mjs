import { chromium } from "playwright";
import path from "node:path";

const browser = await chromium.launch();
const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const reference = `file:///${path.resolve("C:/Users/dell/Downloads/ToolNest — All your tools. One place.html").replaceAll("\\", "/")}`;
const cases = [
  ["desktop", 1440, 1000],
  ["tablet", 768, 1024],
  ["mobile", 390, 844],
];

for (const [name, width, height] of cases) {
  const page = await browser.newPage({
    viewport: { width, height },
    colorScheme: "light",
  });
  await page.goto(reference);
  await page.evaluate(() => window.ToolNest.nav("home"));
  await page.screenshot({
    path: `qa/reference-home-${name}.png`,
    fullPage: true,
  });
  await page.goto(`${baseUrl}/`);
  await page.screenshot({ path: `qa/app-home-${name}.png`, fullPage: true });
  await page.goto(reference);
  await page.screenshot({
    path: `qa/reference-tools-${name}.png`,
    fullPage: true,
  });
  await page.goto(`${baseUrl}/tools`);
  await page.screenshot({ path: `qa/app-tools-${name}.png`, fullPage: true });
  await page.close();
}

await browser.close();
