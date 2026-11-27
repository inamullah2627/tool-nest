import { escapeHtmlAttribute, parseHttpUrl } from "./meta-tags";

export type OpenGraphType =
  "website" | "article" | "product" | "profile" | "video.other" | "music.song";
export type TwitterCardType = "summary" | "summary_large_image";
export type ImageMimeType = "" | "image/jpeg" | "image/png" | "image/webp";

export interface OpenGraphInput {
  title: string;
  description: string;
  url: string;
  siteName: string;
  type: OpenGraphType;
  locale: string;
  alternateLocale: string;
  imageUrl: string;
  imageAlt: string;
  imageWidth: string;
  imageHeight: string;
  imageType: ImageMimeType;
  secureImageUrl: string;
  articleAuthor: string;
  articlePublishedTime: string;
  articleModifiedTime: string;
  articleSection: string;
  articleTags: string;
  profileFirstName: string;
  profileLastName: string;
  profileUsername: string;
  twitterEnabled: boolean;
  twitterCard: TwitterCardType;
  twitterSite: string;
  twitterCreator: string;
  twitterUseOpenGraph: boolean;
  twitterTitle: string;
  twitterDescription: string;
  twitterImageUrl: string;
  twitterImageAlt: string;
}

export type OpenGraphField =
  | "title"
  | "url"
  | "locale"
  | "alternateLocale"
  | "imageUrl"
  | "secureImageUrl"
  | "imageWidth"
  | "imageHeight"
  | "articlePublishedTime"
  | "articleModifiedTime"
  | "twitterSite"
  | "twitterCreator"
  | "twitterImageUrl";

export interface GeneratedMetadata {
  openGraph: string[];
  twitter: string[];
  all: string[];
}

export const DEFAULT_OPEN_GRAPH_INPUT: OpenGraphInput = {
  title: "",
  description: "",
  url: "",
  siteName: "",
  type: "website",
  locale: "en_US",
  alternateLocale: "",
  imageUrl: "",
  imageAlt: "",
  imageWidth: "",
  imageHeight: "",
  imageType: "",
  secureImageUrl: "",
  articleAuthor: "",
  articlePublishedTime: "",
  articleModifiedTime: "",
  articleSection: "",
  articleTags: "",
  profileFirstName: "",
  profileLastName: "",
  profileUsername: "",
  twitterEnabled: true,
  twitterCard: "summary_large_image",
  twitterSite: "",
  twitterCreator: "",
  twitterUseOpenGraph: true,
  twitterTitle: "",
  twitterDescription: "",
  twitterImageUrl: "",
  twitterImageAlt: "",
};

export const SAMPLE_OPEN_GRAPH_INPUT: OpenGraphInput = {
  ...DEFAULT_OPEN_GRAPH_INPUT,
  title: "ToolNest — Free Online Tools for Everyone",
  description:
    "Discover free online tools for developers, writers and SEO professionals. Simplify everyday digital tasks with ToolNest.",
  url: "https://example.com/tools",
  siteName: "ToolNest",
  imageUrl: "https://example.com/social-image.jpg",
  imageAlt: "ToolNest online tools platform",
  imageWidth: "1200",
  imageHeight: "630",
  imageType: "image/jpeg",
};

export function isValidLocale(value: string) {
  return /^[a-z]{2}(?:_[A-Z]{2})?$/u.test(value.trim());
}

export function isValidDate(value: string) {
  return Boolean(value && !Number.isNaN(new Date(value).getTime()));
}

export function normalizeHandle(value: string) {
  const handle = value.trim();
  if (!handle) return "";
  return /^@?[A-Za-z0-9_]{1,15}$/u.test(handle)
    ? `@${handle.replace(/^@/u, "")}`
    : "";
}

export function validateOpenGraphInput(input: OpenGraphInput) {
  const errors: Partial<Record<OpenGraphField, string>> = {};
  if (!input.title.trim()) errors.title = "Page title is required.";
  if (!parseHttpUrl(input.url))
    errors.url = "Enter a complete HTTP or HTTPS page URL.";
  if (!isValidLocale(input.locale))
    errors.locale = "Use a locale such as en_US or ur_PK.";
  if (input.alternateLocale.trim() && !isValidLocale(input.alternateLocale))
    errors.alternateLocale = "Use a locale such as en_GB.";
  if (input.imageUrl.trim() && !parseHttpUrl(input.imageUrl))
    errors.imageUrl = "Enter a complete HTTP or HTTPS image URL.";
  if (
    input.secureImageUrl.trim() &&
    parseHttpUrl(input.secureImageUrl)?.protocol !== "https:"
  )
    errors.secureImageUrl = "Secure image URL must begin with https://.";
  for (const [field, value] of [
    ["imageWidth", input.imageWidth],
    ["imageHeight", input.imageHeight],
  ] as const) {
    if (value.trim() && (!/^\d+$/u.test(value) || Number(value) < 1))
      errors[field] = "Enter a positive whole number.";
  }
  if (
    input.type === "article" &&
    input.articlePublishedTime &&
    !isValidDate(input.articlePublishedTime)
  )
    errors.articlePublishedTime = "Enter a valid published date.";
  if (
    input.type === "article" &&
    input.articleModifiedTime &&
    !isValidDate(input.articleModifiedTime)
  )
    errors.articleModifiedTime = "Enter a valid modified date.";
  if (input.twitterSite && !normalizeHandle(input.twitterSite))
    errors.twitterSite = "Use a valid username such as @yourwebsite.";
  if (input.twitterCreator && !normalizeHandle(input.twitterCreator))
    errors.twitterCreator = "Use a valid username such as @author.";
  if (
    input.twitterEnabled &&
    !input.twitterUseOpenGraph &&
    input.twitterImageUrl.trim() &&
    !parseHttpUrl(input.twitterImageUrl)
  )
    errors.twitterImageUrl = "Enter a complete HTTP or HTTPS image URL.";
  return { valid: Object.keys(errors).length === 0, errors };
}

function isoDate(value: string) {
  return isValidDate(value) ? new Date(value).toISOString() : "";
}

function tag(attribute: "property" | "name", key: string, value: unknown) {
  const content = String(value ?? "").trim();
  return content
    ? `<meta ${attribute}="${key}" content="${escapeHtmlAttribute(content)}" />`
    : "";
}

export function generateOpenGraphMetadata(
  input: OpenGraphInput,
): GeneratedMetadata {
  const openGraph: string[] = [];
  const twitter: string[] = [];
  const addOg = (key: string, value: unknown) => {
    const line = tag("property", key, value);
    if (line) openGraph.push(line);
  };
  const addTwitter = (key: string, value: unknown) => {
    const line = tag("name", key, value);
    if (line) twitter.push(line);
  };

  addOg("og:title", input.title);
  addOg("og:description", input.description);
  if (parseHttpUrl(input.url)) addOg("og:url", input.url);
  addOg("og:type", input.type);
  addOg("og:site_name", input.siteName);
  if (isValidLocale(input.locale)) addOg("og:locale", input.locale);
  if (isValidLocale(input.alternateLocale))
    addOg("og:locale:alternate", input.alternateLocale);
  if (parseHttpUrl(input.imageUrl)) {
    addOg("og:image", input.imageUrl);
    if (parseHttpUrl(input.secureImageUrl)?.protocol === "https:")
      addOg("og:image:secure_url", input.secureImageUrl);
    addOg("og:image:type", input.imageType);
    if (/^[1-9]\d*$/u.test(input.imageWidth))
      addOg("og:image:width", input.imageWidth);
    if (/^[1-9]\d*$/u.test(input.imageHeight))
      addOg("og:image:height", input.imageHeight);
    addOg("og:image:alt", input.imageAlt);
  }
  if (input.type === "article") {
    addOg("article:author", input.articleAuthor);
    addOg("article:published_time", isoDate(input.articlePublishedTime));
    addOg("article:modified_time", isoDate(input.articleModifiedTime));
    addOg("article:section", input.articleSection);
    for (const value of input.articleTags.split(","))
      addOg("article:tag", value);
  }
  if (input.type === "profile") {
    addOg("profile:first_name", input.profileFirstName);
    addOg("profile:last_name", input.profileLastName);
    addOg("profile:username", input.profileUsername);
  }

  if (input.twitterEnabled) {
    addTwitter("twitter:card", input.twitterCard);
    addTwitter("twitter:site", normalizeHandle(input.twitterSite));
    addTwitter("twitter:creator", normalizeHandle(input.twitterCreator));
    const title = input.twitterUseOpenGraph ? input.title : input.twitterTitle;
    const description = input.twitterUseOpenGraph
      ? input.description
      : input.twitterDescription;
    const image = input.twitterUseOpenGraph
      ? input.imageUrl
      : input.twitterImageUrl;
    const imageAlt = input.twitterUseOpenGraph
      ? input.imageAlt
      : input.twitterImageAlt;
    addTwitter("twitter:title", title);
    addTwitter("twitter:description", description);
    if (parseHttpUrl(image)) {
      addTwitter("twitter:image", image);
      addTwitter("twitter:image:alt", imageAlt);
    }
  }
  return { openGraph, twitter, all: [...openGraph, ...twitter] };
}

export function validateLocalSocialImage(
  file: Pick<File, "name" | "size" | "type">,
) {
  if (!/^image\/(?:jpeg|png|webp)$/u.test(file.type))
    return "Choose a JPG, PNG or WebP image.";
  if (file.size > 10 * 1024 * 1024)
    return "Choose an image no larger than 10 MB.";
  return null;
}
