export type SlugSeparator = "-" | "_" | ".";

export interface SlugOptions {
  separator: SlugSeparator;
  lowercase: boolean;
  removeSpecialCharacters: boolean;
  normalizeAccents: boolean;
  removeNumbers: boolean;
  removeStopWords: boolean;
  removeDuplicateWords: boolean;
  characterLimit: number | null;
  preserveCompleteWords: boolean;
  customStopWords: string;
}

export interface BulkSlugEntry {
  line: number;
  input: string;
  slug: string;
  empty: boolean;
  duplicate: boolean;
}

export const DEFAULT_SLUG_OPTIONS: SlugOptions = {
  separator: "-",
  lowercase: true,
  removeSpecialCharacters: true,
  normalizeAccents: true,
  removeNumbers: false,
  removeStopWords: false,
  removeDuplicateWords: false,
  characterLimit: null,
  preserveCompleteWords: true,
  customStopWords: "",
};

export const DEFAULT_STOP_WORDS = new Set(
  "a an the and or but of to in on at for with as by from is are was were be it this that".split(
    " ",
  ),
);

const EXTRA_LATIN_FOLDS: Record<string, string> = {
  ß: "ss",
  Æ: "AE",
  æ: "ae",
  Ø: "O",
  ø: "o",
  Đ: "D",
  đ: "d",
  Ł: "L",
  ł: "l",
  Œ: "OE",
  œ: "oe",
};

function normalizeAccents(value: string) {
  return value
    .replace(/[ßÆæØøĐđŁłŒœ]/gu, (character) => EXTRA_LATIN_FOLDS[character])
    .normalize("NFD")
    .replace(/[\u0300-\u036f]+/gu, "")
    .normalize("NFC");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function stopWords(custom: string) {
  const words = new Set(DEFAULT_STOP_WORDS);
  for (const value of custom.split(/[,\n]/u)) {
    const word = value.trim().toLocaleLowerCase();
    if (word) words.add(word);
  }
  return words;
}

function truncateSlug(slug: string, options: SlugOptions) {
  const limit = options.characterLimit;
  if (!limit || limit < 1 || slug.length <= limit) return slug;
  let output = slug.slice(0, Math.min(255, Math.floor(limit)));
  if (
    options.preserveCompleteWords &&
    slug[output.length] !== options.separator
  ) {
    const boundary = output.lastIndexOf(options.separator);
    if (boundary > 0) output = output.slice(0, boundary);
  }
  return output.replace(
    new RegExp(`${escapeRegExp(options.separator)}+$`, "u"),
    "",
  );
}

export function generateSlug(input: string, options = DEFAULT_SLUG_OPTIONS) {
  let value = input.normalize("NFC");
  if (options.normalizeAccents) value = normalizeAccents(value);
  if (options.lowercase) value = value.toLocaleLowerCase();
  if (options.removeNumbers) value = value.replace(/\p{N}+/gu, " ");

  const existingSeparator = new RegExp(
    `${escapeRegExp(options.separator)}+`,
    "gu",
  );
  value = value.replace(existingSeparator, " ");
  const words = options.removeSpecialCharacters
    ? value.replace(/[’']/gu, "").split(/[^\p{L}\p{N}\p{M}]+/u)
    : value.split(/\s+/u);
  let filtered = words.filter(Boolean);

  if (options.removeStopWords) {
    const excluded = stopWords(options.customStopWords);
    filtered = filtered.filter(
      (word) => !excluded.has(word.toLocaleLowerCase()),
    );
  }
  if (options.removeDuplicateWords) {
    const seen = new Set<string>();
    filtered = filtered.filter((word) => {
      const key = word.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  let slug = filtered.join(options.separator);
  const repeated = new RegExp(`${escapeRegExp(options.separator)}{2,}`, "gu");
  const edges = new RegExp(
    `^${escapeRegExp(options.separator)}+|${escapeRegExp(options.separator)}+$`,
    "gu",
  );
  slug = slug.replace(repeated, options.separator).replace(edges, "");
  return truncateSlug(slug, options);
}

export function validateWebsiteUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return { valid: true as const, url: null };
  try {
    const url = new URL(trimmed);
    if (!/^https?:$/u.test(url.protocol) || !url.hostname) {
      return {
        valid: false as const,
        error: "Enter a complete URL beginning with http:// or https://.",
      };
    }
    url.search = "";
    url.hash = "";
    if (!url.pathname.endsWith("/")) url.pathname += "/";
    return { valid: true as const, url };
  } catch {
    return {
      valid: false as const,
      error: "Enter a valid HTTP or HTTPS website URL.",
    };
  }
}

export function buildFullUrl(base: string, slug: string) {
  const validation = validateWebsiteUrl(base);
  if (!validation.valid || !validation.url || !slug) return null;
  const url = new URL(validation.url.toString());
  url.pathname = `${url.pathname}${encodeURIComponent(slug)}`;
  return url.toString();
}

export function generateBulkSlugs(
  input: string,
  options = DEFAULT_SLUG_OPTIONS,
) {
  const lines = input.replace(/\r\n?/gu, "\n").split("\n");
  if (lines.at(-1) === "") lines.pop();
  const entries: BulkSlugEntry[] = lines.map((line, index) => ({
    line: index + 1,
    input: line,
    slug: generateSlug(line.trim(), options),
    empty: false,
    duplicate: false,
  }));
  const occurrences = new Map<string, number>();
  for (const entry of entries) {
    entry.empty = !entry.slug;
    if (entry.slug) {
      occurrences.set(entry.slug, (occurrences.get(entry.slug) ?? 0) + 1);
    }
  }
  for (const entry of entries) {
    entry.duplicate = Boolean(
      entry.slug && (occurrences.get(entry.slug) ?? 0) > 1,
    );
  }
  return entries;
}
