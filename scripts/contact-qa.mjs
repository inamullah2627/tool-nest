import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3100";
await mkdir("qa/contact", { recursive: true });
const browser = await chromium.launch();

try {
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["tablet", 768, 1024],
    ["mobile", 390, 844],
  ]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/contact`, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    if (overflow > 1)
      throw new Error(`${name}: ${overflow}px horizontal overflow`);
    await page.screenshot({ path: `qa/contact/${name}.png`, fullPage: true });
    await context.close();
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/contact?inquiry=report-a-bug&tool=word-counter`, {
    waitUntil: "networkidle",
  });
  if ((await page.locator("#contact-inquiry").inputValue()) !== "report-a-bug")
    throw new Error("Valid inquiry preset was not applied");
  if ((await page.locator("#contact-tool").inputValue()) !== "word-counter")
    throw new Error("Valid tool preset was not applied");

  await page.locator("#contact-message").fill("A short test message.");
  if (!(await page.locator("#contact-count").textContent())?.startsWith("21 /"))
    throw new Error("Character count did not update");
  await page.getByRole("button", { name: "Review Submission" }).click();
  if ((await page.locator("[aria-invalid=true]").count()) !== 3)
    throw new Error("Required validation errors were not exposed");

  await page.locator("#contact-name").fill("QA User");
  await page.locator("#contact-email").fill("qa@example.com");
  await page.locator("#contact-subject").fill("Bug report");
  await page.getByRole("button", { name: "Review Submission" }).click();
  await page.getByText("Message delivery is not configured yet.").waitFor();

  await page.getByRole("button", { name: "Toggle dark mode" }).click();
  await page.waitForFunction(() =>
    document.documentElement.classList.contains("dark"),
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "qa/contact/desktop-dark.png",
    fullPage: true,
  });

  const axe = await new AxeBuilder({ page }).analyze();
  if (axe.violations.length)
    throw new Error(
      `Accessibility violations:\n${axe.violations.map((item) => `${item.id}: ${item.help}`).join("\n")}`,
    );
  console.log(
    "Contact QA passed: responsive overflow, presets, conditional tools, validation, character count, unavailable delivery and axe audit.",
  );
  await context.close();
} finally {
  await browser.close();
}
