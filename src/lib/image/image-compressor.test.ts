import { describe, expect, it } from "vitest";
import {
  batchReduction,
  calculateOutputDimensions,
  inspectImageHeader,
  outputFilename,
  reductionPercent,
  shouldRetainOriginal,
  validateImageFile,
} from "./image-compressor";

describe("image compressor utilities", () => {
  it("recognizes supported image signatures", () => {
    expect(inspectImageHeader(Uint8Array.from([0xff, 0xd8, 0xff])).format).toBe(
      "jpeg",
    );
    expect(
      inspectImageHeader(
        Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 13, 10, 26, 10]),
      ).format,
    ).toBe("png");
    const webp = new Uint8Array(16);
    webp.set(
      [..."RIFF"].map((value) => value.charCodeAt(0)),
      0,
    );
    webp.set(
      [..."WEBP"].map((value) => value.charCodeAt(0)),
      8,
    );
    expect(inspectImageHeader(webp).format).toBe("webp");
  });
  it("rejects GIF and detects animated PNG", () => {
    expect(
      inspectImageHeader(new TextEncoder().encode("GIF89a")).animated,
    ).toBe(true);
    const png = new Uint8Array(32);
    png.set([0x89, 0x50, 0x4e, 0x47, 13, 10, 26, 10]);
    png.set(new TextEncoder().encode("acTL"), 12);
    expect(inspectImageHeader(png).animated).toBe(true);
  });
  it("validates size and extension", () => {
    expect(validateImageFile({ name: "x.png", size: 0 })).toMatch(/empty/);
    expect(validateImageFile({ name: "x.svg", size: 10 })).toMatch(/JPG/);
    expect(validateImageFile({ name: "x.webp", size: 10 })).toBeUndefined();
  });
  it("resizes proportionally without upscaling", () => {
    expect(
      calculateOutputDimensions(1200, 800, {
        resize: true,
        width: 600,
        height: 600,
        preserveAspectRatio: true,
      preventUpscale: true,
      }),
    ).toEqual({ width: 600, height: 400 });
    expect(
      calculateOutputDimensions(400, 200, {
        resize: true,
        width: 800,
        height: 800,
        preserveAspectRatio: true,
        preventUpscale: true,
      }),
    ).toEqual({ width: 400, height: 200 });
  });
  it("uses byte-weighted batch reduction and safe filenames", () => {
    expect(reductionPercent(100, 75)).toBe(25);
    expect(
      batchReduction([
        { original: 1000, output: 500 },
        { original: 100, output: 100 },
      ]).percent,
    ).toBeCloseTo(45.45, 1);
    expect(outputFilename("photo.PNG", "-compressed", "jpeg")).toBe(
      "photo-compressed.jpg",
    );
    expect(shouldRetainOriginal(100, 110, true, true)).toBe(true);
    expect(shouldRetainOriginal(100, 110, false, true)).toBe(false);
  });
});
