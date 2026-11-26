export type RobotsIndex = "index" | "noindex";
export type RobotsFollow = "follow" | "nofollow";
export type CharacterEncoding = "UTF-8" | "ISO-8859-1";

export interface MetaTagInput {
  title: string;
  description?: string;
  websiteUrl?: string;
  canonicalUrl?: string;
  robotsIndex: RobotsIndex;
  robotsFollow: RobotsFollow;
  author?: string;
  charset: CharacterEncoding;
  includeViewport: boolean;
}

export interface MetaTagValidation {
  valid: boolean;
  errors: Partial<Record<"title" | "websiteUrl" | "canonicalUrl", string>>;
}

export function escapeHtmlText(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function escapeHtmlAttribute(value: string): string {
  return escapeHtmlText(value)
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function parseHttpUrl(value: string): URL | null {
  const candidate = value.trim();
  if (!candidate) return null;
  try {
    const url = new URL(candidate);
    return (url.protocol === "http:" || url.protocol === "https:") &&
      url.hostname
      ? url
      : null;
  } catch {
    return null;
  }
}

export function validateMetaTagInput(input: MetaTagInput): MetaTagValidation {
  const errors: MetaTagValidation["errors"] = {};
  if (!input.title.trim()) errors.title = "Page title is required.";
  if (input.websiteUrl?.trim() && !parseHttpUrl(input.websiteUrl))
    errors.websiteUrl = "Enter a complete HTTP or HTTPS URL.";
  if (input.canonicalUrl?.trim() && !parseHttpUrl(input.canonicalUrl))
    errors.canonicalUrl = "Enter a complete HTTP or HTTPS URL.";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function generateMetaTags(input: MetaTagInput): string {
  const validation = validateMetaTagInput(input);
  if (!validation.valid) throw new Error("Cannot generate invalid metadata.");

  const lines = [`<meta charset="${input.charset}">`];
  if (input.includeViewport)
    lines.push(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    );
  lines.push(`<title>${escapeHtmlText(input.title.trim())}</title>`);
  if (input.description?.trim())
    lines.push(
      `<meta name="description" content="${escapeHtmlAttribute(input.description.trim())}">`,
    );
  lines.push(
    `<meta name="robots" content="${input.robotsIndex}, ${input.robotsFollow}">`,
  );
  if (input.author?.trim())
    lines.push(
      `<meta name="author" content="${escapeHtmlAttribute(input.author.trim())}">`,
    );
  if (input.canonicalUrl?.trim())
    lines.push(
      `<link rel="canonical" href="${escapeHtmlAttribute(input.canonicalUrl.trim())}">`,
    );
  return lines.join("\n");
}

export function countCharacters(value: string): number {
  return Array.from(value).length;
}
