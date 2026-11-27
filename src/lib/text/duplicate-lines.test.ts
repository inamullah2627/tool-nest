import { describe, expect, it } from "vitest";
import {
  DEFAULT_DUPLICATE_OPTIONS,
  getLineInputMetrics,
  processDuplicateLines,
  splitTextLines,
  type DuplicateLineOptions,
} from "./duplicate-lines";

const run = (text: string, options: Partial<DuplicateLineOptions> = {}) =>
  processDuplicateLines(text, { ...DEFAULT_DUPLICATE_OPTIONS, ...options });

describe("duplicate line processor", () => {
  it("keeps first or last original content in occurrence order", () => {
    expect(run(" Apple \nBanana\nApple\nbanana").output).toBe(
      " Apple \nBanana\nbanana",
    );
    expect(
      run(" Apple \nBanana\nApple\nbanana", {
        caseSensitive: false,
        keep: "last",
      }).output,
    ).toBe("Apple\nbanana");
  });

  it("implements all output modes without double-counting statistics", () => {
    const text = "A\nA\nB\nC\nC\nC\n\n";
    expect(run(text, { mode: "unique" }).output).toBe("A\nB\nC");
    expect(run(text, { mode: "duplicates" }).output).toBe("A\nC");
    expect(run(text, { mode: "non-repeated" }).output).toBe("B");
    expect(run(text)).toMatchObject({
      originalLines: 7,
      uniqueLines: 3,
      duplicateOccurrences: 3,
      emptyLinesRemoved: 1,
      totalLinesRemoved: 4,
    });
  });

  it("supports exact, trimmed, and case-insensitive matching", () => {
    const text = "Apple\n apple \nApple ";
    expect(run(text).uniqueLines).toBe(2);
    expect(run(text, { caseSensitive: false }).uniqueLines).toBe(1);
    expect(
      run(text, { caseSensitive: false, ignoreSurroundingWhitespace: false })
        .uniqueLines,
    ).toBe(3);
  });

  it("handles empty and whitespace-only lines consistently", () => {
    expect(run("\n \n\t\n").output).toBe("");
    expect(run("\n \n\t\n")).toMatchObject({
      originalLines: 3,
      emptyLinesRemoved: 3,
      removalPercentage: 100,
    });
    expect(run("\n \n", { removeEmptyLines: false }).outputLines).toEqual([""]);
  });

  it("implements all five deterministic sorting options", () => {
    const text = "bb\na\ncc\nB\n😀😀\n😀";
    expect(run(text, { sort: "preserve" }).output).toBe(text);
    expect(run(text, { sort: "az" }).output).toBe("B\na\nbb\ncc\n😀\n😀😀");
    expect(run(text, { sort: "za" }).output).toBe("😀😀\n😀\ncc\nbb\na\nB");
    expect(run(text, { sort: "shortest" }).output).toBe(
      "B\na\n😀\nbb\ncc\n😀😀",
    );
    expect(run(text, { sort: "longest" }).output).toBe(
      "bb\ncc\n😀😀\nB\na\n😀",
    );
  });

  it("handles CRLF, LF, Unicode, trailing newlines, and metrics", () => {
    expect(splitTextLines("é\r\n東京\r\né\r\n")).toEqual(["é", "東京", "é"]);
    expect(run("é\r\n東京\r\né\r\n").output).toBe("é\n東京");
    expect(getLineInputMetrics("é\n😀\n")).toEqual({
      lines: 2,
      characters: 4,
      emptyLines: 0,
    });
  });
});
