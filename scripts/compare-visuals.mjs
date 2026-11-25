import { readFileSync } from "node:fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const pages = ["home", "tools"];
const sizes = ["desktop", "tablet", "mobile"];

for (const page of pages) {
  for (const size of sizes) {
    const reference = PNG.sync.read(
      readFileSync(`qa/reference-${page}-${size}.png`),
    );
    const implementation = PNG.sync.read(
      readFileSync(`qa/app-${page}-${size}.png`),
    );
    if (
      reference.width !== implementation.width ||
      reference.height !== implementation.height
    ) {
      console.log(
        `${page}-${size}: dimension mismatch ${reference.width}x${reference.height} vs ${implementation.width}x${implementation.height}`,
      );
      continue;
    }
    const different = pixelmatch(
      reference.data,
      implementation.data,
      null,
      reference.width,
      reference.height,
      { threshold: 0.1 },
    );
    const total = reference.width * reference.height;
    console.log(
      `${page}-${size}: ${different} different pixels (${((different / total) * 100).toFixed(5)}%)`,
    );
  }
}
