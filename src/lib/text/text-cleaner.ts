import { processDuplicateLines } from "./duplicate-lines";

export type CleaningOption =
  | "spaces"
  | "trim"
  | "empty"
  | "breaks"
  | "tabs"
  | "trailing"
  | "numbers"
  | "punctuation"
  | "symbols"
  | "emoji"
  | "invisible"
  | "html"
  | "entities"
  | "urls"
  | "emails"
  | "duplicates"
  | "quotes"
  | "dashes";

export type CleaningOptions = Record<CleaningOption, boolean>;
export type CleaningPreset = "basic" | "web" | "single-line" | "custom";

export interface CleaningResult {
  output: string;
  operationCounts: Partial<Record<CleaningOption, number>>;
  originalCharacters: number;
  cleanedCharacters: number;
  characterDifference: number;
  originalBytes: number;
  cleanedBytes: number;
  byteDifference: number;
  reductionPercentage: number;
  changed: boolean;
}

export const CLEANING_OPTIONS: CleaningOption[] = [
  "spaces",
  "trim",
  "empty",
  "breaks",
  "tabs",
  "trailing",
  "numbers",
  "punctuation",
  "symbols",
  "emoji",
  "invisible",
  "html",
  "entities",
  "urls",
  "emails",
  "duplicates",
  "quotes",
  "dashes",
];

export const PRESET_OPTIONS: Record<CleaningPreset, CleaningOption[] | null> = {
  basic: ["spaces", "trim", "empty"],
  web: ["html", "entities", "spaces", "trim"],
  "single-line": ["breaks", "spaces", "trim"],
  custom: null,
};

export function optionsFromPreset(preset: CleaningPreset): CleaningOptions {
  const enabled = new Set(PRESET_OPTIONS[preset] ?? []);
  return Object.fromEntries(
    CLEANING_OPTIONS.map((option) => [option, enabled.has(option)]),
  ) as CleaningOptions;
}

const ENTITY_MAP: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00a0",
  copy: "©",
  reg: "®",
  trade: "™",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  euro: "€",
  pound: "£",
  yen: "¥",
  cent: "¢",
  laquo: "«",
  raquo: "»",
  bull: "•",
  middot: "·",
};

const EMOJI_PATTERN =
  /[0-9#*]\uFE0F?\u20E3|[\u{1F1E6}-\u{1F1FF}]{2}|\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?)*/gu;
const URL_PATTERN = /\b(?:https?:\/\/|www\.)[^\s<>"']+/giu;
const EMAIL_PATTERN =
  /[\p{L}\p{N}._%+-]+@[\p{L}\p{N}-]+(?:\.[\p{L}\p{N}-]+)*\.\p{L}{2,}/gu;

function codePoints(value: string) {
  return Array.from(value).length;
}
function utf8Bytes(value: string) {
  return new TextEncoder().encode(value).byteLength;
}

function replaceCount(
  value: string,
  pattern: RegExp,
  replacement: string | ((match: string) => string),
) {
  let count = 0;
  const output = value.replace(pattern, (match) => {
    count += 1;
    return typeof replacement === "function" ? replacement(match) : replacement;
  });
  return { output, count };
}

function decodeEntityFallback(value: string) {
  return replaceCount(
    value,
    /&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/giu,
    (match) => {
      const entity = match.slice(1, -1);
      if (entity.startsWith("#")) {
        const hexadecimal = entity[1]?.toLowerCase() === "x";
        const number = Number.parseInt(
          entity.slice(hexadecimal ? 2 : 1),
          hexadecimal ? 16 : 10,
        );
        return number > 0 &&
          number <= 0x10ffff &&
          !(number >= 0xd800 && number <= 0xdfff)
          ? String.fromCodePoint(number)
          : match;
      }
      return ENTITY_MAP[entity.toLowerCase()] ?? match;
    },
  );
}

export function decodeHtmlEntitiesInert(value: string) {
  if (typeof document === "undefined") return decodeEntityFallback(value);
  const textarea = document.createElement("textarea");
  let count = 0;
  const output = value.replace(
    /&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/giu,
    (match) => {
      textarea.innerHTML = match;
      const decoded = textarea.value;
      if (decoded === match) return match;
      count += 1;
      return decoded;
    },
  );
  return { output, count };
}

export function stripHtmlInert(value: string) {
  let count = 0;
  let safe = value.replace(/<!--[\s\S]*?-->/gu, () => {
    count += 1;
    return "";
  });
  safe = safe.replace(
    /<(script|style|iframe|object|embed|svg|math|template|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/giu,
    () => {
      count += 1;
      return "";
    },
  );
  safe = safe.replace(/<br\s*\/?>/giu, () => {
    count += 1;
    return "\n";
  });
  safe = safe.replace(/<\/(p|h[1-6]|blockquote)\s*>/giu, () => {
    count += 1;
    return "\n\n";
  });
  safe = safe.replace(
    /<\/(div|li|tr|ul|ol|table|section|article|header|footer|pre|dl|dt|dd|form|figure)\s*>/giu,
    () => {
      count += 1;
      return "\n";
    },
  );
  safe = safe.replace(/<\/(td|th)\s*>/giu, () => {
    count += 1;
    return " ";
  });
  if (typeof document === "undefined") {
    const stripped = replaceCount(safe, /<\/?[A-Za-z][^<>]*>/gu, "");
    const decoded = decodeEntityFallback(stripped.output);
    return { output: decoded.output, count: count + stripped.count };
  }
  const template = document.createElement("template");
  template.innerHTML = safe;
  const tags = template.content.querySelectorAll("*").length;
  template.content
    .querySelectorAll(
      "script,style,iframe,object,embed,svg,math,template,noscript",
    )
    .forEach((node) => node.remove());
  return { output: template.content.textContent ?? "", count: count + tags };
}

export function cleanText(
  input: string,
  options: CleaningOptions,
): CleaningResult {
  const normalizedInput = input.replace(/\r\n?/gu, "\n");
  let text = normalizedInput;
  const operationCounts: Partial<Record<CleaningOption, number>> = {};
  const apply = (
    option: CleaningOption,
    operation: () => { output: string; count: number },
  ) => {
    if (!options[option]) return;
    const result = operation();
    text = result.output;
    operationCounts[option] = result.count;
  };

  apply("html", () => stripHtmlInert(text));
  apply("entities", () => decodeHtmlEntitiesInert(text));
  apply("invisible", () =>
    replaceCount(
      text,
      /[\u00ad\u200b\u200e\u200f\u202a-\u202e\u2060\u2066-\u2069\ufeff]/gu,
      "",
    ),
  );
  apply("urls", () =>
    replaceCount(
      text,
      URL_PATTERN,
      (match) => (match.match(/[.,;:!?)\]}]+$/u) ?? [""])[0],
    ),
  );
  apply("emails", () => replaceCount(text, EMAIL_PATTERN, ""));
  apply("quotes", () => {
    let count = 0;
    const output = text
      .replace(/[“”„‟]/gu, () => {
        count += 1;
        return '"';
      })
      .replace(/[‘’‚‛]/gu, () => {
        count += 1;
        return "'";
      });
    return { output, count };
  });
  apply("dashes", () => replaceCount(text, /[\u2010-\u2015\u2212]/gu, "-"));
  apply("emoji", () => {
    let count = 0;
    const output = text.replace(EMOJI_PATTERN, (match) => {
      if (["©", "®", "™"].includes(match.replace(/\ufe0f/gu, ""))) return match;
      count += 1;
      return "";
    });
    return { output, count };
  });
  apply("punctuation", () => replaceCount(text, /\p{P}/gu, ""));
  apply("symbols", () =>
    replaceCount(text, /\p{S}/gu, (match) =>
      /\p{Extended_Pictographic}/u.test(match) ? match : "",
    ),
  );
  apply("numbers", () => replaceCount(text, /\p{N}/gu, ""));
  apply("tabs", () => replaceCount(text, /\t/gu, " "));
  apply("breaks", () => replaceCount(text, /\n/gu, " "));

  let lines = text.split("\n");
  if (options.trailing) {
    let count = 0;
    lines = lines.map((line) => {
      const output = line.replace(/[^\S\n]+$/gu, "");
      count += codePoints(line) - codePoints(output);
      return output;
    });
    operationCounts.trailing = count;
  }
  if (options.trim) {
    let count = 0;
    lines = lines.map((line) => {
      const output = line.trim();
      count += codePoints(line) - codePoints(output);
      return output;
    });
    operationCounts.trim = count;
  }
  if (options.spaces) {
    let count = 0;
    lines = lines.map((line) =>
      line.replace(/[^\S\n]{2,}/gu, (match) => {
        count += codePoints(match) - 1;
        return " ";
      }),
    );
    operationCounts.spaces = count;
  }
  if (options.empty) {
    const before = lines.length;
    lines = lines.filter((line) => line.trim() !== "");
    operationCounts.empty = before - lines.length;
  }
  text = lines.join("\n");
  if (options.duplicates) {
    const result = processDuplicateLines(text, {
      caseSensitive: true,
      ignoreSurroundingWhitespace: true,
      removeEmptyLines: false,
      keep: "first",
      sort: "preserve",
      mode: "unique",
    });
    text = result.output;
    operationCounts.duplicates = result.duplicateOccurrences;
  }

  const originalCharacters = codePoints(input);
  const cleanedCharacters = codePoints(text);
  const originalBytes = utf8Bytes(input);
  const cleanedBytes = utf8Bytes(text);
  const byteDifference = originalBytes - cleanedBytes;
  return {
    output: text,
    operationCounts,
    originalCharacters,
    cleanedCharacters,
    characterDifference: originalCharacters - cleanedCharacters,
    originalBytes,
    cleanedBytes,
    byteDifference,
    reductionPercentage: originalBytes
      ? (byteDifference / originalBytes) * 100
      : 0,
    changed: text !== normalizedInput,
  };
}

export function textMetrics(value: string) {
  return {
    characters: codePoints(value),
    lines: value ? value.replace(/\r\n?/gu, "\n").split("\n").length : 0,
    bytes: utf8Bytes(value),
  };
}
