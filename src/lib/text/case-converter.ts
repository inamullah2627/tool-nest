import { analyzeText } from "./word-counter";

export type CaseMode =
  | "upper"
  | "lower"
  | "sentence"
  | "title"
  | "capitalized"
  | "alternating"
  | "inverse"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant";

export interface CaseModeDefinition {
  id: CaseMode;
  label: string;
  example: string;
  group: "standard" | "developer";
}

export const CASE_MODES: readonly CaseModeDefinition[] = [
  {
    id: "upper",
    label: "UPPERCASE",
    example: "HELLO WORLD",
    group: "standard",
  },
  {
    id: "lower",
    label: "lowercase",
    example: "hello world",
    group: "standard",
  },
  {
    id: "sentence",
    label: "Sentence case",
    example: "Hello world.",
    group: "standard",
  },
  {
    id: "title",
    label: "Title Case",
    example: "Hello World",
    group: "standard",
  },
  {
    id: "capitalized",
    label: "Capitalized Case",
    example: "Every Word",
    group: "standard",
  },
  {
    id: "alternating",
    label: "aLtErNaTiNg CaSe",
    example: "hElLo WoRlD",
    group: "standard",
  },
  {
    id: "inverse",
    label: "InVeRsE CaSe",
    example: "hELLO wORLD",
    group: "standard",
  },
  {
    id: "camel",
    label: "camelCase",
    example: "helloWorld",
    group: "developer",
  },
  {
    id: "pascal",
    label: "PascalCase",
    example: "HelloWorld",
    group: "developer",
  },
  {
    id: "snake",
    label: "snake_case",
    example: "hello_world",
    group: "developer",
  },
  {
    id: "kebab",
    label: "kebab-case",
    example: "hello-world",
    group: "developer",
  },
  {
    id: "constant",
    label: "CONSTANT_CASE",
    example: "HELLO_WORLD",
    group: "developer",
  },
] as const;

const MINOR_TITLE_WORDS = new Set(
  "a an the and but or for nor on at to from by of in up as so yet off per via vs".split(
    " ",
  ),
);
const WORD_PATTERN = /[\p{L}\p{N}][\p{L}\p{M}\p{N}'’]*/gu;

function capitalize(word: string): string {
  const [first = "", ...rest] = Array.from(word);
  return first.toLocaleUpperCase() + rest.join("");
}

export function splitIdentifierWords(value: string): string[] {
  return value
    .replace(/['’]/gu, "")
    .replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, "$1 $2")
    .replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, "$1 $2")
    .split(/[^\p{L}\p{M}\p{N}]+/u)
    .filter(Boolean);
}

function eachLine(text: string, convert: (line: string) => string): string {
  return text
    .split(/\r\n|\r|\n/u)
    .map(convert)
    .join("\n");
}

function sentenceCase(text: string): string {
  return text
    .toLocaleLowerCase()
    .replace(
      /(^|[.!?。！？]\s+|\n\s*)(\p{L})/gu,
      (_, prefix: string, letter: string) =>
        prefix + letter.toLocaleUpperCase(),
    );
}

function titleCase(text: string): string {
  return eachLine(text.toLocaleLowerCase(), (line) => {
    const matches = [...line.matchAll(WORD_PATTERN)];
    let result = line;
    let offset = 0;
    matches.forEach((match, index) => {
      const word = match[0];
      if (
        index === 0 ||
        index === matches.length - 1 ||
        !MINOR_TITLE_WORDS.has(word.toLocaleLowerCase())
      ) {
        const replacement = capitalize(word);
        const position = (match.index ?? 0) + offset;
        result =
          result.slice(0, position) +
          replacement +
          result.slice(position + word.length);
        offset += replacement.length - word.length;
      }
    });
    return result;
  });
}

function developerCase(text: string, mode: CaseMode): string {
  return eachLine(text, (line) => {
    const words = splitIdentifierWords(line);
    if (mode === "camel")
      return words
        .map((word, index) =>
          index
            ? capitalize(word.toLocaleLowerCase())
            : word.toLocaleLowerCase(),
        )
        .join("");
    if (mode === "pascal")
      return words.map((word) => capitalize(word.toLocaleLowerCase())).join("");
    if (mode === "snake") return words.join("_").toLocaleLowerCase();
    if (mode === "kebab") return words.join("-").toLocaleLowerCase();
    return words.join("_").toLocaleUpperCase();
  });
}

export function convertCase(
  text: string,
  mode: CaseMode,
  preserveLineBreaks = true,
): string {
  if (!text) return "";
  const definition = CASE_MODES.find((item) => item.id === mode);
  if (!definition) return text;
  const source =
    definition.group === "standard" && !preserveLineBreaks
      ? text.replace(/\s*\r?\n\s*/gu, " ")
      : text;

  if (mode === "upper") return source.toLocaleUpperCase();
  if (mode === "lower") return source.toLocaleLowerCase();
  if (mode === "sentence") return sentenceCase(source);
  if (mode === "title") return titleCase(source);
  if (mode === "capitalized")
    return source.toLocaleLowerCase().replace(WORD_PATTERN, capitalize);
  if (mode === "alternating") {
    let letterIndex = 0;
    return Array.from(source)
      .map((character) => {
        if (character.toLocaleLowerCase() === character.toLocaleUpperCase())
          return character;
        const next =
          letterIndex % 2
            ? character.toLocaleUpperCase()
            : character.toLocaleLowerCase();
        letterIndex += 1;
        return next;
      })
      .join("");
  }
  if (mode === "inverse")
    return Array.from(source)
      .map((character) => {
        const lower = character.toLocaleLowerCase();
        const upper = character.toLocaleUpperCase();
        if (lower === upper) return character;
        return character === lower ? upper : lower;
      })
      .join("");
  return developerCase(source, mode);
}

export function getTextCounts(text: string) {
  const analysis = analyzeText(text);
  return {
    words: analysis.wordCount,
    characters: analysis.characterCount,
    lines: analysis.lineCount,
  };
}
