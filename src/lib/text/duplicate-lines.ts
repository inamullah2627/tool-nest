export type DuplicateOutputMode = "unique" | "duplicates" | "non-repeated";
export type DuplicateKeep = "first" | "last";
export type DuplicateSort = "preserve" | "az" | "za" | "shortest" | "longest";

export interface DuplicateLineOptions {
  caseSensitive: boolean;
  ignoreSurroundingWhitespace: boolean;
  removeEmptyLines: boolean;
  keep: DuplicateKeep;
  sort: DuplicateSort;
  mode: DuplicateOutputMode;
}

export interface DuplicateLineResult {
  output: string;
  outputLines: string[];
  originalLines: number;
  uniqueLines: number;
  duplicateOccurrences: number;
  emptyLinesRemoved: number;
  totalLinesRemoved: number;
  removalPercentage: number;
}

interface Group {
  count: number;
  firstIndex: number;
  lastIndex: number;
  firstLine: string;
  lastLine: string;
}

export const DEFAULT_DUPLICATE_OPTIONS: DuplicateLineOptions = {
  caseSensitive: true,
  ignoreSurroundingWhitespace: true,
  removeEmptyLines: true,
  keep: "first",
  sort: "preserve",
  mode: "unique",
};

export function splitTextLines(text: string): string[] {
  if (!text) return [];
  const lines = text.split(/\r\n|\n/u);
  if (lines.length > 1 && lines.at(-1) === "") lines.pop();
  return lines;
}

export function processDuplicateLines(
  text: string,
  options: DuplicateLineOptions,
): DuplicateLineResult {
  const lines = splitTextLines(text);
  const isEmpty = (line: string) => line.trim() === "";
  const emptyLineCount = lines.reduce(
    (count, line) => count + (isEmpty(line) ? 1 : 0),
    0,
  );
  const candidates = options.removeEmptyLines
    ? lines.filter((line) => !isEmpty(line))
    : lines;
  const groups = new Map<string, Group>();
  const seen = new Set<string>();

  candidates.forEach((line, index) => {
    const comparable = options.ignoreSurroundingWhitespace ? line.trim() : line;
    const key = options.caseSensitive ? comparable : comparable.toLowerCase();
    const existing = groups.get(key);
    if (existing) {
      existing.count += 1;
      existing.lastIndex = index;
      existing.lastLine = line;
    } else {
      seen.add(key);
      groups.set(key, {
        count: 1,
        firstIndex: index,
        lastIndex: index,
        firstLine: line,
        lastLine: line,
      });
    }
  });

  const keepLast = options.keep === "last";
  const retained = [...groups.values()]
    .filter((group) => {
      if (options.mode === "duplicates") return group.count > 1;
      if (options.mode === "non-repeated") return group.count === 1;
      return true;
    })
    .map((group) => ({
      line: keepLast ? group.lastLine : group.firstLine,
      order: keepLast ? group.lastIndex : group.firstIndex,
    }))
    .sort((a, b) => a.order - b.order);

  const selectedSort = options.sort;
  if (selectedSort !== "preserve") {
    retained.sort((a, b) => compareOutput(a, b, selectedSort));
  }

  const outputLines = retained.map((item) => item.line);
  const totalLinesRemoved = lines.length - outputLines.length;
  return {
    output: outputLines.join("\n"),
    outputLines,
    originalLines: lines.length,
    uniqueLines: seen.size,
    duplicateOccurrences: candidates.length - seen.size,
    emptyLinesRemoved: options.removeEmptyLines ? emptyLineCount : 0,
    totalLinesRemoved,
    removalPercentage: lines.length
      ? (totalLinesRemoved / lines.length) * 100
      : 0,
  };
}

function compareOutput(
  a: { line: string; order: number },
  b: { line: string; order: number },
  sort: Exclude<DuplicateSort, "preserve">,
) {
  const lexical = compareText(a.line, b.line);
  if (sort === "az") return lexical || a.order - b.order;
  if (sort === "za") return -lexical || a.order - b.order;
  const lengthDifference =
    Array.from(a.line).length - Array.from(b.line).length;
  if (sort === "shortest")
    return lengthDifference || lexical || a.order - b.order;
  return -lengthDifference || lexical || a.order - b.order;
}

function compareText(a: string, b: string) {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function getLineInputMetrics(text: string) {
  const lines = splitTextLines(text);
  return {
    lines: lines.length,
    characters: Array.from(text).length,
    emptyLines: lines.filter((line) => line.trim() === "").length,
  };
}
