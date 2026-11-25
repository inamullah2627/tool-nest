export const MAX_TEXT_FILE_BYTES = 1024 * 1024;
export const READING_WORDS_PER_MINUTE = 200;
export const SPEAKING_WORDS_PER_MINUTE = 130;

const COMMON_WORDS = new Set(
  "the a an and or but of to in on at for with as by from is are was were be been being it this that these those i you he she we they me him her us them my your his our their its not no so if then than too very can could will would should just do does did have has had".split(
    " ",
  ),
);

export interface KeywordStat {
  word: string;
  count: number;
  density: number;
}

export interface TextAnalysis {
  words: string[];
  wordCount: number;
  characterCount: number;
  characterCountNoWhitespace: number;
  sentenceCount: number;
  paragraphCount: number;
  lineCount: number;
  uniqueWordCount: number;
  averageWordLength: number;
  averageSentenceLength: number;
  longestWord: string;
  readingTimeSeconds: number;
  speakingTimeSeconds: number;
}

type SegmenterConstructor = new (
  locales?: string | string[],
  options?: { granularity: "word" | "sentence" },
) => {
  segment(input: string): Iterable<{ segment: string; isWordLike?: boolean }>;
};

function getSegmenter(): SegmenterConstructor | undefined {
  return (Intl as typeof Intl & { Segmenter?: SegmenterConstructor }).Segmenter;
}

export function segmentWords(text: string): string[] {
  if (!text) return [];
  const Segmenter = getSegmenter();
  if (Segmenter) {
    return Array.from(
      new Segmenter(undefined, { granularity: "word" }).segment(text),
    )
      .filter((part) => part.isWordLike)
      .map((part) => part.segment);
  }
  return text.match(/[\p{L}\p{M}\p{N}]+(?:['’\-][\p{L}\p{M}\p{N}]+)*/gu) ?? [];
}

function countSentences(text: string): number {
  if (!/[\p{L}\p{N}]/u.test(text)) return 0;
  const Segmenter = getSegmenter();
  if (Segmenter) {
    return Array.from(
      new Segmenter(undefined, { granularity: "sentence" }).segment(text),
    ).filter((part) => /[\p{L}\p{N}]/u.test(part.segment)).length;
  }
  return (text.match(/[^.!?。！？]+(?:[.!?。！？]+|$)/gu) ?? []).filter(
    (part) => /[\p{L}\p{N}]/u.test(part),
  ).length;
}

const normalizedWord = (word: string) => word.toLocaleLowerCase();
const wordLength = (word: string) =>
  Array.from(word).filter((character) => /[\p{L}\p{M}\p{N}]/u.test(character))
    .length;

export function analyzeText(text: string): TextAnalysis {
  const words = segmentWords(text);
  const wordCount = words.length;
  const sentenceCount = countSentences(text);
  const lengths = words.map(wordLength);
  const totalWordCharacters = lengths.reduce((sum, length) => sum + length, 0);
  let longestWord = "";
  let longestLength = 0;
  words.forEach((word, index) => {
    if (lengths[index] > longestLength) {
      longestWord = word;
      longestLength = lengths[index];
    }
  });

  return {
    words,
    wordCount,
    characterCount: Array.from(text).length,
    characterCountNoWhitespace: Array.from(text).filter(
      (character) => !/\s/u.test(character),
    ).length,
    sentenceCount,
    paragraphCount: text.trim()
      ? text
          .trim()
          .split(/(?:\r?\n)[\t ]*(?:\r?\n)+/u)
          .filter((part) => part.trim()).length
      : 0,
    lineCount: text ? text.split(/\r\n|\r|\n/u).length : 0,
    uniqueWordCount: new Set(words.map(normalizedWord)).size,
    averageWordLength: wordCount ? totalWordCharacters / wordCount : 0,
    averageSentenceLength: sentenceCount ? wordCount / sentenceCount : 0,
    longestWord,
    readingTimeSeconds: wordCount
      ? Math.ceil((wordCount / READING_WORDS_PER_MINUTE) * 60)
      : 0,
    speakingTimeSeconds: wordCount
      ? Math.ceil((wordCount / SPEAKING_WORDS_PER_MINUTE) * 60)
      : 0,
  };
}

export function getKeywordFrequency(
  words: string[],
  excludeCommonWords = true,
  limit = 10,
): KeywordStat[] {
  const counts = new Map<string, number>();
  for (const sourceWord of words) {
    const word = normalizedWord(sourceWord);
    if (excludeCommonWords && (COMMON_WORDS.has(word) || wordLength(word) < 3))
      continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts]
    .sort(
      ([wordA, countA], [wordB, countB]) =>
        countB - countA || wordA.localeCompare(wordB),
    )
    .slice(0, limit)
    .map(([word, count]) => ({
      word,
      count,
      density: words.length ? (count / words.length) * 100 : 0,
    }));
}

export function validateTextFile(file: {
  name: string;
  type: string;
  size: number;
}): string | null {
  const validExtension = /\.txt$/iu.test(file.name);
  const validType = !file.type || file.type === "text/plain";
  if (!validExtension || !validType)
    return "Unsupported file. Please choose a plain .txt file.";
  if (file.size > MAX_TEXT_FILE_BYTES)
    return "This file exceeds the 1 MB size limit. Please choose a smaller text file.";
  return null;
}

export function formatDuration(seconds: number): string {
  if (!seconds) return "0 sec";
  if (seconds < 60) return `${seconds} sec`;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return remainder ? `${minutes} min ${remainder} sec` : `${minutes} min`;
}
