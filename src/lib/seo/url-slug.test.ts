import { describe, expect, it } from "vitest";
import {
  DEFAULT_SLUG_OPTIONS,
  buildFullUrl,
  generateBulkSlugs,
  generateSlug,
  validateWebsiteUrl,
} from "./url-slug";

describe("URL slug generation", () => {
  it("uses every separator and normalizes punctuation and repeats", () => {
    expect(generateSlug("  Hello---world!!!  ")).toBe("hello-world");
    expect(
      generateSlug("Hello world", { ...DEFAULT_SLUG_OPTIONS, separator: "_" }),
    ).toBe("hello_world");
    expect(
      generateSlug("Hello world", { ...DEFAULT_SLUG_OPTIONS, separator: "." }),
    ).toBe("hello.world");
    expect(
      generateSlug("Hello!!! world", {
        ...DEFAULT_SLUG_OPTIONS,
        removeSpecialCharacters: false,
      }),
    ).toBe("hello!!!-world");
  });

  it("supports case, numbers, stop words, custom words and duplicate words", () => {
    const options = {
      ...DEFAULT_SLUG_OPTIONS,
      lowercase: false,
      removeNumbers: true,
      removeStopWords: true,
      removeDuplicateWords: true,
      customStopWords: "Guide",
    };
    expect(generateSlug("The 2026 Guide for React React", options)).toBe(
      "React",
    );
  });

  it("folds Latin accents while preserving other scripts", () => {
    expect(generateSlug("Café Straße déjà vu हिंदी العربية 東京")).toBe(
      "cafe-strasse-deja-vu-हिंदी-العربية-東京",
    );
    expect(
      generateSlug("Crème brûlée", {
        ...DEFAULT_SLUG_OPTIONS,
        normalizeAccents: false,
      }),
    ).toBe("crème-brûlée");
  });

  it("applies character limits with or without complete words", () => {
    expect(
      generateSlug("alpha beta gamma", {
        ...DEFAULT_SLUG_OPTIONS,
        characterLimit: 12,
      }),
    ).toBe("alpha-beta");
    expect(
      generateSlug("alpha beta gamma", {
        ...DEFAULT_SLUG_OPTIONS,
        characterLimit: 12,
        preserveCompleteWords: false,
      }),
    ).toBe("alpha-beta-g");
  });

  it("validates only HTTP(S) URLs and safely constructs encoded paths", () => {
    expect(validateWebsiteUrl("javascript:alert(1)").valid).toBe(false);
    expect(validateWebsiteUrl("https://example.com/blog?q=x#hash").valid).toBe(
      true,
    );
    expect(buildFullUrl("https://example.com/blog", "हिंदी-guide")).toBe(
      "https://example.com/blog/%E0%A4%B9%E0%A4%BF%E0%A4%82%E0%A4%A6%E0%A5%80-guide",
    );
  });

  it("keeps bulk order and flags empty and duplicate results", () => {
    const entries = generateBulkSlugs("Hello World\n!!!\nhello world\n東京\n");
    expect(entries.map((entry) => entry.slug)).toEqual([
      "hello-world",
      "",
      "hello-world",
      "東京",
    ]);
    expect(entries.map((entry) => entry.line)).toEqual([1, 2, 3, 4]);
    expect(entries[1].empty).toBe(true);
    expect(entries[0].duplicate).toBe(true);
    expect(entries[2].duplicate).toBe(true);
  });
});
