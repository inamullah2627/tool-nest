import { describe, expect, it } from "vitest";
import {
  CASE_MODES,
  convertCase,
  getTextCounts,
  splitIdentifierWords,
} from "./case-converter";

describe("case converter", () => {
  it("exposes and processes all twelve modes", () => {
    expect(CASE_MODES).toHaveLength(12);
    for (const mode of CASE_MODES)
      expect(convertCase("hello world", mode.id)).not.toBe("");
  });

  it("keeps sentence, title, and capitalized rules distinct", () => {
    const source = "THE lord of THE rings. another STORY!";
    expect(convertCase(source, "sentence")).toBe(
      "The lord of the rings. Another story!",
    );
    expect(convertCase("the lord of the rings", "title")).toBe(
      "The Lord of the Rings",
    );
    expect(convertCase("the lord of the rings", "capitalized")).toBe(
      "The Lord Of The Rings",
    );
  });

  it("preserves punctuation and whitespace in standard modes", () => {
    expect(convertCase("hello,  WORLD!\nnext line", "lower")).toBe(
      "hello,  world!\nnext line",
    );
    expect(convertCase("hello\n world", "upper", false)).toBe("HELLO WORLD");
  });

  it("uses deterministic alternating and true inverse case", () => {
    expect(convertCase("A b-c!", "alternating")).toBe("a B-c!");
    expect(convertCase("Hello WORLD 123 🌍", "inverse")).toBe(
      "hELLO world 123 🌍",
    );
  });

  it("splits existing identifiers, separators, and acronyms", () => {
    expect(splitIdentifierWords("parseHTTPResponse-value_name")).toEqual([
      "parse",
      "HTTP",
      "Response",
      "value",
      "name",
    ]);
    expect(convertCase("parseHTTPResponse-value_name", "snake")).toBe(
      "parse_http_response_value_name",
    );
    expect(convertCase("hello world\nsecond-value", "camel")).toBe(
      "helloWorld\nsecondValue",
    );
  });

  it("supports Unicode, multiline text, acronyms, and code-point counts", () => {
    expect(convertCase("élan ÜBER 東京", "capitalized")).toBe("Élan Über 東京");
    expect(convertCase("XMLHttpRequest", "kebab")).toBe("xml-http-request");
    expect(getTextCounts("Hello 🌍\nनमस्ते दुनिया")).toEqual({
      words: 3,
      characters: 21,
      lines: 2,
    });
  });
});
