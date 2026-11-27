"use client";

import NextImage from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/design/icon";
import { usePreferences } from "@/components/providers/app-providers";
import {
  DEFAULT_OPEN_GRAPH_INPUT,
  SAMPLE_OPEN_GRAPH_INPUT,
  generateOpenGraphMetadata,
  validateLocalSocialImage,
  validateOpenGraphInput,
  type OpenGraphField,
  type OpenGraphInput,
} from "@/lib/seo/open-graph";
import { countCharacters, parseHttpUrl } from "@/lib/seo/meta-tags";

type PreviewPlatform = "facebook" | "linkedin" | "x" | "whatsapp";
type OutputTab = "all" | "openGraph" | "twitter";
interface LocalImage {
  url: string;
  name: string;
  size: number;
  width: number;
  height: number;
}

const LOCALES = [
  "en_US",
  "en_GB",
  "ur_PK",
  "fr_FR",
  "de_DE",
  "es_ES",
  "ar_AR",
  "hi_IN",
];

export function OpenGraphWorkspace() {
  const { recordRecent } = usePreferences();
  const [input, setInput] = useState<OpenGraphInput>(DEFAULT_OPEN_GRAPH_INPUT);
  const [generated, setGenerated] = useState<ReturnType<
    typeof generateOpenGraphMetadata
  > | null>(null);
  const [tab, setTab] = useState<OutputTab>("all");
  const [platform, setPlatform] = useState<PreviewPlatform>("facebook");
  const [advanced, setAdvanced] = useState(false);
  const [twitterOpen, setTwitterOpen] = useState(true);
  const [attempted, setAttempted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [localImage, setLocalImage] = useState<LocalImage | null>(null);
  const [localError, setLocalError] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const validation = useMemo(() => validateOpenGraphInput(input), [input]);
  const liveMetadata = useMemo(() => generateOpenGraphMetadata(input), [input]);
  const output = generated
    ? tab === "openGraph"
      ? generated.openGraph
      : tab === "twitter"
        ? generated.twitter
        : generated.all
    : [];

  useEffect(() => {
    return () => {
      if (localImage?.url) URL.revokeObjectURL(localImage.url);
    };
  }, [localImage]);
  useEffect(() => {
    const close = (event: KeyboardEvent) =>
      event.key === "Escape" && setFullscreen(false);
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);

  const update = <K extends keyof OpenGraphInput>(
    key: K,
    value: OpenGraphInput[K],
  ) => {
    setInput((current) => ({ ...current, [key]: value }));
    if (generated) {
      setGenerated(null);
      setNotice("Generated output cleared because the metadata changed.");
    }
  };
  const notify = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2400);
  };
  const generate = () => {
    setAttempted(true);
    setGenerated(liveMetadata);
    recordRecent("open-graph-generator");
    setNotice(
      validation.valid
        ? ""
        : "Invalid or missing properties were omitted. Review the highlighted fields and checklist.",
    );
    notify("Metadata generated.");
  };
  const loadSample = () => {
    setInput(SAMPLE_OPEN_GRAPH_INPUT);
    setGenerated(generateOpenGraphMetadata(SAMPLE_OPEN_GRAPH_INPUT));
    setAttempted(false);
    setNotice(
      "Sample values loaded. The domain and remote image URL are illustrative.",
    );
    recordRecent("open-graph-generator");
  };
  const reset = () => {
    setInput(DEFAULT_OPEN_GRAPH_INPUT);
    setGenerated(null);
    setAttempted(false);
    setAdvanced(false);
    setTwitterOpen(true);
    setLocalImage(null);
    setLocalError("");
    setNotice("");
  };
  const copy = async () => {
    if (!output.length) return;
    try {
      await navigator.clipboard.writeText(output.join("\n"));
      notify("Metadata copied to clipboard.");
    } catch {
      setNotice(
        "Clipboard access is unavailable. Select and copy the code manually.",
      );
    }
  };
  const download = () => {
    if (!output.length) return;
    const url = URL.createObjectURL(
      new Blob([`${output.join("\n")}\n`], { type: "text/html;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "open-graph-meta-tags.html";
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const loadLocalImage = (file?: File) => {
    if (!file) return;
    const error = validateLocalSocialImage(file);
    if (error) return setLocalError(error);
    const url = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      setLocalImage({
        url,
        name: file.name,
        size: file.size,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
      setLocalError("");
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      setLocalError("The selected image could not be decoded.");
    };
    image.src = url;
  };

  const errorFor = (field: OpenGraphField) =>
    attempted ? validation.errors[field] : undefined;
  const previewTitle = input.title.trim() || "Your page title";
  const previewDescription =
    input.description.trim() || "Your page description will appear here.";
  const previewDomain = parseHttpUrl(input.url)?.hostname ?? "yourwebsite.com";
  const checks = getChecklist(input, localImage);

  return (
    <section className="tool-workspace-section og-workspace">
      <div className="wrap">
        <div className="wsp">
          {(notice || localError) && (
            <div className="alert og-alert" role="alert">
              <Icon name="alert" size={18} />
              <span>{localError || notice}</span>
              <button
                className="ib sm"
                aria-label="Dismiss message"
                onClick={() => {
                  setNotice("");
                  setLocalError("");
                }}
              >
                <Icon name="x" size={16} />
              </button>
            </div>
          )}
          <div className="wtb">
            <button className="btn pr" onClick={generate}>
              <Icon name="spark" size={16} />
              Generate Meta Tags
            </button>
            <button className="btn" onClick={loadSample}>
              <Icon name="file" size={16} />
              Load Sample
            </button>
            <button className="btn" onClick={reset}>
              <Icon name="rotate" size={16} />
              Reset
            </button>
          </div>
          <div className="og-layout">
            <div className="og-form-column">
              <FormSection title="Basic Information">
                <TextField
                  label="Page Title"
                  value={input.title}
                  onChange={(value) => update("title", value)}
                  placeholder="Enter your page title..."
                  error={errorFor("title")}
                  counter={`${countCharacters(input.title)} characters`}
                  hint="About 60 characters is common preview guidance, not an Open Graph limit."
                />
                <TextField
                  label="Page Description"
                  textarea
                  value={input.description}
                  onChange={(value) => update("description", value)}
                  placeholder="Enter a short description of your page..."
                  counter={`${countCharacters(input.description)} characters`}
                  hint="About 150–160 characters is common preview guidance, not a required limit."
                />
                <TextField
                  label="Website URL"
                  type="url"
                  value={input.url}
                  onChange={(value) => update("url", value)}
                  placeholder="https://example.com/page"
                  error={errorFor("url")}
                />
                <TextField
                  label="Website Name"
                  value={input.siteName}
                  onChange={(value) => update("siteName", value)}
                  placeholder="Your website name"
                />
                <SelectField
                  label="Content Type"
                  value={input.type}
                  onChange={(value) =>
                    update("type", value as OpenGraphInput["type"])
                  }
                  options={[
                    ["website", "Website"],
                    ["article", "Article"],
                    ["product", "Product"],
                    ["profile", "Profile"],
                    ["video.other", "Video"],
                    ["music.song", "Music"],
                  ]}
                />
                <SelectField
                  label="Locale"
                  value={input.locale}
                  onChange={(value) => update("locale", value)}
                  options={LOCALES.map((locale) => [locale, locale])}
                  error={errorFor("locale")}
                />
              </FormSection>
              <FormSection title="Social Sharing Image">
                <TextField
                  label="Image URL"
                  type="url"
                  value={input.imageUrl}
                  onChange={(value) => update("imageUrl", value)}
                  placeholder="https://example.com/social-image.jpg"
                  error={errorFor("imageUrl")}
                  hint="Must be publicly accessible. Remote images are not loaded automatically."
                />
                <div className="og-field">
                  <label>
                    Local image preview <span className="tag2">Optional</span>
                  </label>
                  <button
                    className="og-drop"
                    onClick={() => fileInput.current?.click()}
                  >
                    <Icon name="upload" size={22} />
                    <b>Choose a local image for preview</b>
                    <span>JPG, PNG or WebP · maximum 10 MB</span>
                  </button>
                  <input
                    ref={fileInput}
                    hidden
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => {
                      loadLocalImage(event.target.files?.[0]);
                      event.target.value = "";
                    }}
                  />
                  <small>
                    Preview only. The image is not uploaded and its blob URL is
                    never generated as metadata.
                  </small>
                  {localImage && (
                    <div className="og-local">
                      <NextImage
                        unoptimized
                        src={localImage.url}
                        alt="Selected local preview"
                        width={96}
                        height={64}
                      />
                      <div>
                        <b>{localImage.name}</b>
                        <span>
                          {localImage.width} × {localImage.height}px ·{" "}
                          {(localImage.size / 1024).toFixed(1)} KB
                        </span>
                        <div>
                          <button
                            className="btn"
                            onClick={() => {
                              update("imageWidth", String(localImage.width));
                              update("imageHeight", String(localImage.height));
                            }}
                          >
                            Use dimensions
                          </button>
                          <button
                            className="btn"
                            onClick={() => setLocalImage(null)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <TextField
                  label="Image Alt Text"
                  value={input.imageAlt}
                  onChange={(value) => update("imageAlt", value)}
                  placeholder="Describe your social sharing image..."
                />
                <div className="og-field-row">
                  <TextField
                    label="Image Width"
                    type="number"
                    value={input.imageWidth}
                    onChange={(value) => update("imageWidth", value)}
                    placeholder="1200"
                    error={errorFor("imageWidth")}
                  />
                  <TextField
                    label="Image Height"
                    type="number"
                    value={input.imageHeight}
                    onChange={(value) => update("imageHeight", value)}
                    placeholder="630"
                    error={errorFor("imageHeight")}
                  />
                </div>
              </FormSection>
              <Collapsible
                title="Advanced Settings"
                open={advanced}
                onToggle={() => setAdvanced(!advanced)}
              >
                <SelectField
                  label="Image MIME Type"
                  value={input.imageType}
                  onChange={(value) =>
                    update("imageType", value as OpenGraphInput["imageType"])
                  }
                  options={[
                    ["", "Not specified"],
                    ["image/jpeg", "image/jpeg"],
                    ["image/png", "image/png"],
                    ["image/webp", "image/webp"],
                  ]}
                />
                <TextField
                  label="Secure Image URL"
                  type="url"
                  value={input.secureImageUrl}
                  onChange={(value) => update("secureImageUrl", value)}
                  placeholder="https://example.com/social-image.jpg"
                  error={errorFor("secureImageUrl")}
                />
                <TextField
                  label="Alternative Locale"
                  value={input.alternateLocale}
                  onChange={(value) => update("alternateLocale", value)}
                  placeholder="en_GB"
                  error={errorFor("alternateLocale")}
                />
                {input.type === "article" && (
                  <>
                    <h3>Article Properties</h3>
                    <TextField
                      label="Article Author"
                      value={input.articleAuthor}
                      onChange={(value) => update("articleAuthor", value)}
                      placeholder="Author name or profile URL"
                    />
                    <div className="og-field-row">
                      <TextField
                        label="Published Date"
                        type="datetime-local"
                        value={input.articlePublishedTime}
                        onChange={(value) =>
                          update("articlePublishedTime", value)
                        }
                        error={errorFor("articlePublishedTime")}
                      />
                      <TextField
                        label="Modified Date"
                        type="datetime-local"
                        value={input.articleModifiedTime}
                        onChange={(value) =>
                          update("articleModifiedTime", value)
                        }
                        error={errorFor("articleModifiedTime")}
                      />
                    </div>
                    <TextField
                      label="Article Section"
                      value={input.articleSection}
                      onChange={(value) => update("articleSection", value)}
                      placeholder="Technology"
                    />
                    <TextField
                      label="Article Tags"
                      value={input.articleTags}
                      onChange={(value) => update("articleTags", value)}
                      placeholder="SEO, Social Media"
                      hint="Comma-separated; each becomes an article:tag property."
                    />
                  </>
                )}
                {input.type === "profile" && (
                  <>
                    <h3>Profile Properties</h3>
                    <div className="og-field-row">
                      <TextField
                        label="First Name"
                        value={input.profileFirstName}
                        onChange={(value) => update("profileFirstName", value)}
                      />
                      <TextField
                        label="Last Name"
                        value={input.profileLastName}
                        onChange={(value) => update("profileLastName", value)}
                      />
                    </div>
                    <TextField
                      label="Username"
                      value={input.profileUsername}
                      onChange={(value) => update("profileUsername", value)}
                    />
                  </>
                )}
              </Collapsible>
              <Collapsible
                title="Twitter Card Settings"
                open={twitterOpen}
                onToggle={() => setTwitterOpen(!twitterOpen)}
              >
                <Switch
                  label="Enable Twitter Card Metadata"
                  checked={input.twitterEnabled}
                  onChange={(value) => update("twitterEnabled", value)}
                />
                {input.twitterEnabled && (
                  <>
                    <SelectField
                      label="Card Type"
                      value={input.twitterCard}
                      onChange={(value) =>
                        update(
                          "twitterCard",
                          value as OpenGraphInput["twitterCard"],
                        )
                      }
                      options={[
                        ["summary", "Summary Card"],
                        [
                          "summary_large_image",
                          "Summary Card with Large Image",
                        ],
                      ]}
                    />
                    <div className="og-field-row">
                      <TextField
                        label="Twitter/X Site Username"
                        value={input.twitterSite}
                        onChange={(value) => update("twitterSite", value)}
                        placeholder="@yourwebsite"
                        error={errorFor("twitterSite")}
                      />
                      <TextField
                        label="Twitter/X Creator Username"
                        value={input.twitterCreator}
                        onChange={(value) => update("twitterCreator", value)}
                        placeholder="@author"
                        error={errorFor("twitterCreator")}
                      />
                    </div>
                    <Switch
                      label="Use Open Graph Information"
                      checked={input.twitterUseOpenGraph}
                      onChange={(value) => update("twitterUseOpenGraph", value)}
                    />
                    {!input.twitterUseOpenGraph && (
                      <>
                        <TextField
                          label="Twitter Card Title"
                          value={input.twitterTitle}
                          onChange={(value) => update("twitterTitle", value)}
                        />
                        <TextField
                          label="Twitter Card Description"
                          textarea
                          value={input.twitterDescription}
                          onChange={(value) =>
                            update("twitterDescription", value)
                          }
                        />
                        <TextField
                          label="Twitter Card Image URL"
                          type="url"
                          value={input.twitterImageUrl}
                          onChange={(value) => update("twitterImageUrl", value)}
                          error={errorFor("twitterImageUrl")}
                        />
                        <TextField
                          label="Twitter Image Alt Text"
                          value={input.twitterImageAlt}
                          onChange={(value) => update("twitterImageAlt", value)}
                        />
                      </>
                    )}
                  </>
                )}
              </Collapsible>
            </div>
            <div className="og-preview-column">
              <FormSection title="Social Media Preview">
                <div className="tabs og-tabs" role="tablist">
                  {(
                    [
                      ["facebook", "Facebook"],
                      ["linkedin", "LinkedIn"],
                      ["x", "X (Twitter)"],
                      ["whatsapp", "WhatsApp"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      role="tab"
                      aria-selected={platform === value}
                      onClick={() => setPlatform(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <SocialPreview
                  platform={platform}
                  title={previewTitle}
                  description={previewDescription}
                  domain={previewDomain}
                  localImage={localImage?.url}
                  large={input.twitterCard === "summary_large_image"}
                />
                <p className="og-platform-note">
                  Illustrative only. Actual previews vary by platform, device,
                  cropping, caching and metadata availability. Remote images are
                  not fetched.
                </p>
              </FormSection>
              <div
                className={`og-output-section ${fullscreen ? "og-fullscreen" : ""}`}
              >
                <div className="ph2">
                  <div className="pt">
                    <b>Generated Meta Tags</b>
                    <span className="tag2">
                      {generated?.all.length ?? 0} tags
                    </span>
                  </div>
                  <div className="pa">
                    <button
                      className="ib sm"
                      onClick={copy}
                      disabled={!output.length}
                      aria-label="Copy generated metadata"
                    >
                      <Icon name="copy" size={17} />
                    </button>
                    <button
                      className="ib sm"
                      onClick={download}
                      disabled={!output.length}
                      aria-label="Download HTML"
                    >
                      <Icon name="download" size={17} />
                    </button>
                    <button
                      className="ib sm"
                      onClick={() => setFullscreen(!fullscreen)}
                      aria-label={
                        fullscreen
                          ? "Exit fullscreen"
                          : "Fullscreen code preview"
                      }
                    >
                      <Icon name={fullscreen ? "x" : "fullscreen"} size={17} />
                    </button>
                  </div>
                </div>
                <div className="tabs og-tabs" role="tablist">
                  {(
                    [
                      ["all", "All Tags", generated?.all.length ?? 0],
                      [
                        "openGraph",
                        "Open Graph",
                        generated?.openGraph.length ?? 0,
                      ],
                      [
                        "twitter",
                        "Twitter Cards",
                        generated?.twitter.length ?? 0,
                      ],
                    ] as const
                  ).map(([value, label, count]) => (
                    <button
                      key={value}
                      role="tab"
                      aria-selected={tab === value}
                      onClick={() => setTab(value)}
                    >
                      {label} <span className="tag2">{count}</span>
                    </button>
                  ))}
                </div>
                <textarea
                  className="og-code"
                  readOnly
                  value={output.join("\n")}
                  aria-label="Generated metadata code"
                  placeholder="Your generated meta tags will appear here."
                />
              </div>
              <FormSection title="Metadata Checklist">
                <ul className="og-checklist">
                  {checks.map((check) => (
                    <li
                      className={
                        check.ok ? "ok" : check.required ? "warn" : "info"
                      }
                      key={check.text}
                    >
                      <Icon
                        name={
                          check.ok ? "check" : check.required ? "alert" : "info"
                        }
                        size={15}
                      />
                      <span>
                        {check.text}{" "}
                        <em>{check.required ? "Required" : "Recommended"}</em>
                      </span>
                    </li>
                  ))}
                </ul>
              </FormSection>
            </div>
          </div>
        </div>
        <div className="og-privacy">
          <Icon name="shieldCheck" size={18} />
          <b>
            Metadata and local images stay in browser memory. Nothing is
            uploaded, persisted or fetched.
          </b>
        </div>
        {message && (
          <div className="toast" role="status">
            <Icon name="check" size={16} />
            {message}
          </div>
        )}
      </div>
    </section>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="og-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
function Collapsible({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="og-section">
      <button className="og-collapse" aria-expanded={open} onClick={onToggle}>
        <h2>{title}</h2>
        <Icon name="chev" size={18} />
      </button>
      {open && <div className="og-collapse-body">{children}</div>}
    </section>
  );
}
function TextField({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  textarea = false,
  hint,
  counter,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  hint?: string;
  counter?: string;
  error?: string;
}) {
  return (
    <label className="og-field">
      <span>{label}</span>
      {textarea ? (
        <textarea
          className="og-input"
          rows={3}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
        />
      ) : (
        <input
          className="og-input"
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
        />
      )}
      {hint && <small>{hint}</small>}
      {counter && <small className="og-counter">{counter}</small>}
      {error && <strong role="alert">{error}</strong>}
    </label>
  );
}
function SelectField({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<readonly [string, string]>;
  error?: string;
}) {
  return (
    <label className="og-field">
      <span>{label}</span>
      <select
        className="og-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
      >
        {options.map(([value, text]) => (
          <option value={value} key={value}>
            {text}
          </option>
        ))}
      </select>
      {error && <strong role="alert">{error}</strong>}
    </label>
  );
}
function Switch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      className="sw2 og-switch"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
    >
      <i />
      {label}
    </button>
  );
}
function SocialPreview({
  platform,
  title,
  description,
  domain,
  localImage,
  large,
}: {
  platform: PreviewPlatform;
  title: string;
  description: string;
  domain: string;
  localImage?: string;
  large: boolean;
}) {
  const image = (
    <div className="og-preview-image">
      {localImage ? (
        <NextImage
          unoptimized
          src={localImage}
          alt="Local social preview"
          width={1200}
          height={630}
        />
      ) : (
        <div className="og-placeholder">
          <Icon name="image" size={42} />
        </div>
      )}
    </div>
  );
  return (
    <div
      className={`og-social-card ${platform} ${platform === "x" && !large ? "summary" : ""}`}
    >
      {image}
      <div className="og-preview-copy">
        <span>{domain}</span>
        <b>{title}</b>
        {platform !== "linkedin" && <p>{description}</p>}
      </div>
    </div>
  );
}
function getChecklist(input: OpenGraphInput, local: LocalImage | null) {
  const dimensions = local
    ? [local.width, local.height]
    : [Number(input.imageWidth), Number(input.imageHeight)];
  return [
    {
      ok: Boolean(input.title.trim()),
      required: true,
      text: input.title.trim()
        ? "Page title provided."
        : "Add a page title (og:title).",
    },
    {
      ok: Boolean(parseHttpUrl(input.url)),
      required: true,
      text: parseHttpUrl(input.url)
        ? "Valid page URL provided."
        : "Add a valid absolute page URL (og:url).",
    },
    {
      ok: Boolean(parseHttpUrl(input.imageUrl)),
      required: true,
      text: parseHttpUrl(input.imageUrl)
        ? "Public image URL provided; availability is not verified."
        : "Add a public image URL; local previews are not included in tags.",
    },
    {
      ok: Boolean(input.description.trim()),
      required: false,
      text: input.description.trim()
        ? "Page description provided."
        : "A page description is recommended.",
    },
    {
      ok: Boolean(input.imageAlt.trim()),
      required: false,
      text: input.imageAlt.trim()
        ? "Image alt text provided."
        : "Image alt text is recommended.",
    },
    {
      ok: dimensions[0] >= 1200 && dimensions[1] >= 630,
      required: false,
      text:
        dimensions[0] && dimensions[1]
          ? `Image dimensions: ${dimensions[0]} × ${dimensions[1]}px.`
          : "Image dimensions are unknown; 1200 × 630px is commonly recommended.",
    },
    {
      ok: input.twitterEnabled,
      required: false,
      text: input.twitterEnabled
        ? "Twitter Card metadata is enabled."
        : "Twitter Card metadata is disabled.",
    },
  ];
}
