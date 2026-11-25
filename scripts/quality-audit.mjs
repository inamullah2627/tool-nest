import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const browser = await chromium.launch();
let failed = false;

for (const route of ["/", "/tools"]) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__vitals = { cls: 0, lcp: 0 };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        window.__vitals.lcp = entry.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        if (!entry.hadRecentInput) window.__vitals.cls += entry.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const vitals = await page.evaluate(() => ({
    ...window.__vitals,
    fcp:
      performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0,
  }));
  const accessibility = await new AxeBuilder({ page }).analyze();
  const serious = accessibility.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact ?? ""),
  );
  const pass = vitals.lcp < 2500 && vitals.cls < 0.1 && serious.length === 0;
  failed ||= !pass;
  console.log(
    `${pass ? "PASS" : "FAIL"} ${route}: LCP ${vitals.lcp.toFixed(0)}ms, FCP ${vitals.fcp.toFixed(0)}ms, CLS ${vitals.cls.toFixed(4)}, serious accessibility violations ${serious.length}`,
  );
  if (serious.length)
    console.log(
      serious
        .map(
          (violation) =>
            `${violation.id}: ${violation.help} [${violation.nodes.map((node) => node.target.join(" ")).join(", ")}]`,
        )
        .join("\n"),
    );
  await context.close();
}

await browser.close();
if (failed) process.exitCode = 1;
