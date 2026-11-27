import { describe, expect, it } from "vitest";
import {
  CLEANING_OPTIONS,
  cleanText,
  optionsFromPreset,
  type CleaningOption,
} from "./text-cleaner";

function only(option: CleaningOption) {
  const options = optionsFromPreset("custom");
  options[option] = true;
  return options;
}

describe("text cleaner", () => {
  const cases: Array<[CleaningOption, string, string]> = [
    ["spaces", "a   b", "a b"],
    ["trim", "  a  \n b ", "a\nb"],
    ["empty", "a\n  \nb", "a\nb"],
    ["breaks", "a\nb", "a b"],
    ["tabs", "a\tb", "a b"],
    ["trailing", "a  \nb\t", "a\nb"],
    ["numbers", "A7 ½ ٣", "A  "],
    ["punctuation", "Hello, world!", "Hello world"],
    ["symbols", "cost $5 + tax ©", "cost 5  tax ©"],
    ["emoji", "Hi 👩🏽‍💻 🇵🇰 ©", "Hi   ©"],
    ["invisible", "a\u200bb\u200dc", "ab\u200dc"],
    [
      "html",
      "<p>Hello <b>world</b></p><script src='https://x'>bad()</script>",
      "Hello world\n\n",
    ],
    ["entities", "Tom &amp; &#39;Jerry&#39;", "Tom & 'Jerry'"],
    ["urls", "Visit https://example.com/test, now", "Visit , now"],
    ["emails", "Email me@example.com now", "Email  now"],
    ["duplicates", "one\ntwo\none", "one\ntwo"],
    ["quotes", "“Hello” ‘world’", "\"Hello\" 'world'"],
    ["dashes", "one—two–three−four", "one-two-three-four"],
  ];

  for (const [option, input, expected] of cases) {
    it(`applies ${option}`, () => {
      const result = cleanText(input, only(option));
      expect(result.output).toBe(expected);
      expect(result.operationCounts[option]).toBeGreaterThan(0);
    });
  }

  it("implements all four presets", () => {
    expect(
      Object.values(optionsFromPreset("basic")).filter(Boolean),
    ).toHaveLength(3);
    expect(
      Object.values(optionsFromPreset("web")).filter(Boolean),
    ).toHaveLength(4);
    expect(
      Object.values(optionsFromPreset("single-line")).filter(Boolean),
    ).toHaveLength(3);
    expect(
      Object.values(optionsFromPreset("custom")).filter(Boolean),
    ).toHaveLength(0);
  });

  it("runs combined operations deterministically without removing multilingual letters or combining marks", () => {
    const options = optionsFromPreset("web");
    Object.assign(options, {
      emoji: true,
      urls: true,
      emails: true,
      empty: true,
    });
    const input =
      "<p>  اردو   हिंदी café &amp; text 😊 </p>\n\nVisit https://example.com or me@example.com";
    const result = cleanText(input, options);
    expect(result.output).toContain("اردو हिंदी café & text");
    expect(result.output).not.toContain("😊");
    expect(result.output).not.toContain("https://");
    expect(result.output).not.toContain("me@example.com");
  });

  it("reports UTF-8 sizes and non-overlapping sequential operation counts", () => {
    const options = optionsFromPreset("custom");
    Object.assign(options, { tabs: true, spaces: true });
    const result = cleanText("é\t  text", options);
    expect(result.originalBytes).toBe(
      new TextEncoder().encode("é\t  text").length,
    );
    expect(result.operationCounts.tabs).toBe(1);
    expect(result.operationCounts.spaces).toBe(2);
    expect(result.cleanedBytes).toBeLessThan(result.originalBytes);
    expect(result.reductionPercentage).toBeGreaterThan(0);
  });

  it("handles empty results and unchanged text", () => {
    expect(cleanText("123", only("numbers")).output).toBe("");
    expect(cleanText("clean", only("spaces")).changed).toBe(false);
  });

  it("documents conservative URL and email matching boundaries", () => {
    expect(
      cleanText("example.com mail@localhost", { ...only("urls"), emails: true })
        .output,
    ).toBe("example.com mail@localhost");
  });

  it("exposes every required operation", () => {
    expect(CLEANING_OPTIONS).toHaveLength(18);
  });
});
