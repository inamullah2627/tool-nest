export const MAX_JSON_FILE_BYTES = 2 * 1024 * 1024;

export type JsonIndent = 2 | 4 | "tab";
export type JsonMode = "format" | "minify" | "validate";
export type JsonValue =
  null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

export type JsonProcessOptions = {
  mode: JsonMode;
  indent: JsonIndent;
  sortKeys: boolean;
};

export type JsonSuccess = {
  ok: true;
  value: JsonValue;
  output: string;
};

export type JsonFailure = {
  ok: false;
  error: { message: string; line?: number; column?: number };
};

export type JsonProcessResult = JsonSuccess | JsonFailure;

type Token = {
  type: "string" | "number" | "literal" | "punctuation";
  raw: string;
  offset: number;
};

class DataSafetyError extends Error {
  constructor(
    message: string,
    readonly offset: number,
  ) {
    super(message);
  }
}

export function processJson(
  input: string,
  options: JsonProcessOptions,
): JsonProcessResult {
  if (!input.trim()) {
    return { ok: false, error: { message: "Enter JSON before processing." } };
  }

  try {
    auditJsonDataSafety(input);
    const parsed = JSON.parse(input) as JsonValue;
    const value = options.sortKeys ? sortJsonKeys(parsed) : parsed;
    const indentation = options.indent === "tab" ? "\t" : options.indent;
    const output =
      options.mode === "minify"
        ? JSON.stringify(value)
        : JSON.stringify(value, null, indentation);
    return { ok: true, value, output };
  } catch (error) {
    const parsedError = error as Error;
    const offset =
      error instanceof DataSafetyError
        ? error.offset
        : getJsonErrorOffset(parsedError.message, input);
    const location =
      offset === undefined ? {} : getLineAndColumn(input, offset);
    return {
      ok: false,
      error: {
        message: cleanJsonError(parsedError.message),
        ...location,
      },
    };
  }
}

export function sortJsonKeys(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return value.map(sortJsonKeys);
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort((left, right) => left.localeCompare(right))
      .reduce<Record<string, JsonValue>>((result, key) => {
        result[key] = sortJsonKeys(value[key]);
        return result;
      }, {});
  }
  return value;
}

export function getTextMetrics(text: string) {
  const bytes = new TextEncoder().encode(text).length;
  return {
    lines: text ? text.split("\n").length : 0,
    characters: text.length,
    bytes,
  };
}

export function validateJsonFile(file: Pick<File, "name" | "type" | "size">) {
  if (
    !file.name.toLowerCase().endsWith(".json") &&
    file.type !== "application/json"
  ) {
    return "Unsupported file. Choose a .json file.";
  }
  if (file.size > MAX_JSON_FILE_BYTES) {
    return "This file exceeds the 2 MB size limit. Choose a smaller JSON file.";
  }
  return null;
}

function auditJsonDataSafety(input: string) {
  const tokens = tokenize(input);
  let index = 0;
  const current = () => tokens[index];
  const consume = (raw?: string) => {
    const token = tokens[index++];
    if (!token || (raw !== undefined && token.raw !== raw))
      throw new Error("audit");
    return token;
  };
  const walkValue = (depth = 0): void => {
    const token = current();
    if (!token) throw new Error("audit");
    if (depth > 256) {
      throw new DataSafetyError(
        "This JSON is nested more than 256 levels deep and cannot be displayed safely.",
        token.offset,
      );
    }
    if (token.raw === "{") {
      consume("{");
      const keys = new Set<string>();
      if (current()?.raw === "}") return void consume("}");
      while (true) {
        const keyToken = consume();
        if (keyToken.type !== "string") throw new Error("audit");
        const key = JSON.parse(keyToken.raw) as string;
        if (keys.has(key)) {
          throw new DataSafetyError(
            `Duplicate object key “${key}” is not accepted because parsers would silently overwrite an earlier value.`,
            keyToken.offset,
          );
        }
        keys.add(key);
        consume(":");
        walkValue(depth + 1);
        if (current()?.raw === "}") return void consume("}");
        consume(",");
      }
    }
    if (token.raw === "[") {
      consume("[");
      if (current()?.raw === "]") return void consume("]");
      while (true) {
        walkValue(depth + 1);
        if (current()?.raw === "]") return void consume("]");
        consume(",");
      }
    }
    const scalar = consume();
    if (scalar.type === "number") {
      const number = Number(scalar.raw);
      const coefficient = scalar.raw.split(/[eE]/)[0];
      const significantDigits = coefficient
        .replace(/^-/, "")
        .replace(".", "")
        .replace(/^0+/, "").length;
      if (
        !Number.isFinite(number) ||
        (Number.isInteger(number) && !Number.isSafeInteger(number))
      ) {
        throw new DataSafetyError(
          "This JSON contains an integer outside JavaScript’s safe numeric range. Convert it to a quoted string to preserve every digit.",
          scalar.offset,
        );
      }
      if (
        (scalar.raw.includes(".") || /[eE]/.test(scalar.raw)) &&
        significantDigits > 15
      ) {
        throw new DataSafetyError(
          "This JSON number has more precision than JavaScript can preserve safely. Convert it to a quoted string to prevent rounding.",
          scalar.offset,
        );
      }
    }
  };
  try {
    walkValue();
  } catch (error) {
    if (error instanceof DataSafetyError) throw error;
    // JSON.parse remains the source of truth for malformed syntax.
  }
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  while (index < input.length) {
    if (/\s/.test(input[index])) {
      index += 1;
      continue;
    }
    const offset = index;
    const char = input[index];
    if ("{}[],:".includes(char)) {
      tokens.push({ type: "punctuation", raw: char, offset });
      index += 1;
      continue;
    }
    if (char === '"') {
      index += 1;
      let escaped = false;
      while (index < input.length) {
        const next = input[index++];
        if (escaped) escaped = false;
        else if (next === "\\") escaped = true;
        else if (next === '"') break;
      }
      tokens.push({ type: "string", raw: input.slice(offset, index), offset });
      continue;
    }
    const number = input
      .slice(index)
      .match(/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/);
    if (number) {
      tokens.push({ type: "number", raw: number[0], offset });
      index += number[0].length;
      continue;
    }
    const literal = input.slice(index).match(/^(?:true|false|null)/);
    if (literal) {
      tokens.push({ type: "literal", raw: literal[0], offset });
      index += literal[0].length;
      continue;
    }
    index += 1;
  }
  return tokens;
}

function getJsonErrorOffset(message: string, input: string) {
  const position = message.match(/position\s+(\d+)/i);
  if (position) return Number(position[1]);
  const lineColumn = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  if (lineColumn) {
    const lines = input.split("\n");
    return (
      lines
        .slice(0, Number(lineColumn[1]) - 1)
        .reduce((sum, line) => sum + line.length + 1, 0) +
      Number(lineColumn[2]) -
      1
    );
  }
  if (/unexpected end|end of json/i.test(message)) return input.length;
  return undefined;
}

function getLineAndColumn(input: string, offset: number) {
  const before = input.slice(0, Math.max(0, offset)).split("\n");
  return { line: before.length, column: before.at(-1)!.length + 1 };
}

function cleanJsonError(message: string) {
  return message
    .replace(/\s+in JSON at position\s+\d+.*/i, "")
    .replace(/\s+at position\s+\d+.*/i, "")
    .replace(/\s+at line\s+\d+\s+column\s+\d+.*/i, "");
}
