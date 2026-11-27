import { describe, expect, it } from "vitest";
import {
  DEFAULT_OPEN_GRAPH_INPUT,
  generateOpenGraphMetadata,
  validateLocalSocialImage,
  validateOpenGraphInput,
  type OpenGraphInput,
} from "./open-graph";

const base: OpenGraphInput = {
  ...DEFAULT_OPEN_GRAPH_INPUT,
  title: "Example",
  url: "https://example.com/page",
};

describe("Open Graph metadata", () => {
  it("escapes HTML attributes and preserves Unicode", () => {
    const output = generateOpenGraphMetadata({
      ...base,
      title: 'Café & "Tools" <Guide>',
      description: "اردو metadata",
    }).all.join("\n");
    expect(output).toContain("Café &amp; &quot;Tools&quot; &lt;Guide&gt;");
    expect(output).toContain("اردو metadata");
  });

  it("rejects malformed protocols, locales, dimensions and dates", () => {
    const result = validateOpenGraphInput({
      ...base,
      url: "javascript:alert(1)",
      locale: "english_US",
      imageWidth: "12.5",
      type: "article",
      articlePublishedTime: "not-a-date",
    });
    expect(result.errors.url).toBeTruthy();
    expect(result.errors.locale).toBeTruthy();
    expect(result.errors.imageWidth).toBeTruthy();
    expect(result.errors.articlePublishedTime).toBeTruthy();
  });

  it("emits conditional article fields and omits profile fields", () => {
    const output = generateOpenGraphMetadata({
      ...base,
      type: "article",
      articleAuthor: "Ayesha",
      articlePublishedTime: "2026-11-27T10:00",
      articleTags: "SEO, Social",
      profileUsername: "ignored",
    }).openGraph.join("\n");
    expect(output).toContain('property="article:author"');
    expect(output.match(/property="article:tag"/gu)).toHaveLength(2);
    expect(output).not.toContain("profile:username");
  });

  it("generates profile fields only for profile metadata", () => {
    const output = generateOpenGraphMetadata({
      ...base,
      type: "profile",
      profileFirstName: "Zoë",
      profileLastName: "Khan",
      profileUsername: "zoe",
    }).openGraph.join("\n");
    expect(output).toContain('property="profile:first_name"');
    expect(output).toContain('content="Zoë"');
  });

  it("omits invalid optional image properties and never emits blob URLs", () => {
    const validation = validateOpenGraphInput({
      ...base,
      imageUrl: "blob:test",
    });
    expect(validation.errors.imageUrl).toBeTruthy();
    const output = generateOpenGraphMetadata(base).all.join("\n");
    expect(output).not.toContain("og:image");
    expect(output).not.toContain("blob:");
  });

  it("supports both Twitter card types and independent values", () => {
    const output = generateOpenGraphMetadata({
      ...base,
      twitterCard: "summary",
      twitterUseOpenGraph: false,
      twitterTitle: "Twitter title",
      twitterDescription: "Card copy",
      twitterImageUrl: "https://example.com/card.png",
      twitterSite: "toolnest",
    }).twitter.join("\n");
    expect(output).toContain('content="summary"');
    expect(output).toContain('content="@toolnest"');
    expect(output).toContain('content="Twitter title"');
  });

  it("validates local image type and size", () => {
    expect(
      validateLocalSocialImage({
        name: "image.svg",
        size: 10,
        type: "image/svg+xml",
      }),
    ).toBeTruthy();
    expect(
      validateLocalSocialImage({
        name: "large.png",
        size: 11 * 1024 * 1024,
        type: "image/png",
      }),
    ).toBeTruthy();
    expect(
      validateLocalSocialImage({
        name: "social.webp",
        size: 100,
        type: "image/webp",
      }),
    ).toBeNull();
  });
});
