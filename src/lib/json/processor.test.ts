import { describe, expect, it } from "vitest";
import {
  MAX_JSON_FILE_BYTES,
  processJson,
  validateJsonFile,
} from "./processor";

const run = (
  input: string,
  mode: "format" | "minify" | "validate" = "format",
  sortKeys = false,
) => processJson(input, { mode, indent: 2, sortKeys });

describe("JSON processing", () => {
  it("formats valid nested objects and arrays without reordering arrays", () => {
    const result = run('{"nested":{"b":2},"items":[3,1,2]}');
    expect(result.ok && result.output).toBe(
      '{\n  "nested": {\n    "b": 2\n  },\n  "items": [\n    3,\n    1,\n    2\n  ]\n}',
    );
  });
  it("minifies JSON", () =>
    expect(run('{ "a": 1 }', "minify")).toMatchObject({
      ok: true,
      output: '{"a":1}',
    }));
  it("recursively sorts object keys", () =>
    expect(run('{"z":{"b":1,"a":2},"a":0}', "format", true)).toMatchObject({
      ok: true,
      output: '{\n  "a": 0,\n  "z": {\n    "a": 2,\n    "b": 1\n  }\n}',
    }));
  it.each(["null", "true", '"hello"', "42"])("supports primitive %s", (value) =>
    expect(run(value)).toMatchObject({ ok: true }),
  );
  it("preserves Unicode", () =>
    expect(run('{"message":"سلام 🌍"}', "minify")).toMatchObject({
      ok: true,
      output: '{"message":"سلام 🌍"}',
    }));
  it("rejects empty input", () =>
    expect(run("  ")).toMatchObject({ ok: false }));
  it("rejects invalid JSON and trailing commas", () =>
    expect(run('{"a":1,}')).toMatchObject({ ok: false }));
  it("rejects unsafe large integers instead of rounding them", () =>
    expect(run('{"id":9007199254740993}')).toMatchObject({ ok: false }));
  it("rejects high-precision decimals instead of rounding them", () =>
    expect(run('{"value":0.12345678901234567}')).toMatchObject({ ok: false }));
  it("rejects duplicate object keys instead of overwriting data", () =>
    expect(run('{"a":1,"a":2}')).toMatchObject({ ok: false }));
  it("enforces upload limits", () =>
    expect(
      validateJsonFile({
        name: "large.json",
        type: "application/json",
        size: MAX_JSON_FILE_BYTES + 1,
      }),
    ).toContain("2 MB"));
});
