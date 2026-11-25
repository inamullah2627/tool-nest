import { describe, expect, it } from "vitest";
import {
  analyzeText,
  getKeywordFrequency,
  MAX_TEXT_FILE_BYTES,
  validateTextFile,
} from "./word-counter";

describe("word counter", () => {
  it("counts words, punctuation, sentences, paragraphs and lines", () => {
    const result = analyzeText("Hello, world!\n\nThis is a test.\nLast line?");
    expect(result.wordCount).toBe(8);
    expect(result.sentenceCount).toBe(3);
    expect(result.paragraphCount).toBe(2);
    expect(result.lineCount).toBe(4);
    expect(result.longestWord).toBe("Hello");
  });

  it("counts Unicode code points and ignores whitespace when requested", () => {
    const result = analyzeText("Café 😊 世界");
    expect(result.characterCount).toBe(9);
    expect(result.characterCountNoWhitespace).toBe(7);
    expect(result.wordCount).toBe(2);
  });

  it("handles empty and repeated whitespace", () => {
    expect(analyzeText("   \n\t ").wordCount).toBe(0);
    expect(analyzeText("one    two").wordCount).toBe(2);
  });

  it("calculates case-insensitive keyword frequency and density", () => {
    const result = analyzeText("Tools tools make work work work easier");
    const keywords = getKeywordFrequency(result.words, false);
    expect(keywords[0]).toMatchObject({ word: "work", count: 3 });
    expect(keywords[0].density).toBeCloseTo((3 / 7) * 100);
  });

  it("uses 200 WPM reading and 130 WPM speaking estimates", () => {
    const result = analyzeText(Array(200).fill("word").join(" "));
    expect(result.readingTimeSeconds).toBe(60);
    expect(result.speakingTimeSeconds).toBe(93);
  });

  it("validates TXT type and the 1 MB limit", () => {
    expect(
      validateTextFile({ name: "notes.txt", type: "text/plain", size: 10 }),
    ).toBeNull();
    expect(
      validateTextFile({
        name: "notes.pdf",
        type: "application/pdf",
        size: 10,
      }),
    ).toContain("plain .txt");
    expect(
      validateTextFile({
        name: "notes.txt",
        type: "text/plain",
        size: MAX_TEXT_FILE_BYTES + 1,
      }),
    ).toContain("1 MB");
  });
});
