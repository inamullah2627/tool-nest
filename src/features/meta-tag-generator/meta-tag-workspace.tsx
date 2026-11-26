"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/design/icon";
import { usePreferences } from "@/components/providers/app-providers";
import {
  countCharacters,
  generateMetaTags,
  parseHttpUrl,
  validateMetaTagInput,
  type MetaTagInput,
} from "@/lib/seo/meta-tags";

const EMPTY_INPUT: MetaTagInput = {
  title: "",
  description: "",
  websiteUrl: "",
  canonicalUrl: "",
  robotsIndex: "index",
  robotsFollow: "follow",
  author: "",
  charset: "UTF-8",
  includeViewport: true,
};
const SAMPLE_INPUT: MetaTagInput = {
  ...EMPTY_INPUT,
  title: "ToolNest - Free Online Tools",
  description:
    "Explore free online tools for developers, writers and SEO professionals.",
  websiteUrl: "https://example.com",
  canonicalUrl: "https://example.com/tools",
};

export function MetaTagWorkspace() {
  const { recordRecent } = usePreferences();
  const [input, setInput] = useState<MetaTagInput>(EMPTY_INPUT);
  const [generated, setGenerated] = useState("");
  const [generatedSnapshot, setGeneratedSnapshot] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [touchedUrls, setTouchedUrls] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [fullscreen, setFullscreen] = useState(false);
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const validation = useMemo(() => validateMetaTagInput(input), [input]);
  const currentSignature = JSON.stringify(input);
  const stale = Boolean(generated && generatedSnapshot !== currentSignature);
  const titleLength = countCharacters(input.title.trim());
  const descriptionLength = countCharacters(input.description?.trim() ?? "");
  const previewUrl =
    parseHttpUrl(input.canonicalUrl ?? "") ??
    parseHttpUrl(input.websiteUrl ?? "");

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);

  const update = <K extends keyof MetaTagInput>(
    key: K,
    value: MetaTagInput[K],
  ) => {
    setInput((current) => ({ ...current, [key]: value }));
    setAlert("");
  };
  const notify = (next: string) => {
    setMessage(next);
    window.setTimeout(() => setMessage(""), 2400);
  };
  const generate = (nextInput = input) => {
    setAttempted(true);
    const nextValidation = validateMetaTagInput(nextInput);
    if (!nextValidation.valid) {
      setTouchedUrls(true);
      setAlert(
        "Please complete the required field and fix invalid URLs before generating.",
      );
      if (nextValidation.errors.title) titleRef.current?.focus();
      return;
    }
    const code = generateMetaTags(nextInput);
    setGenerated(code);
    setGeneratedSnapshot(JSON.stringify(nextInput));
    setAlert("");
    recordRecent("meta-tag-generator");
    notify("Meta tags generated.");
  };
  const loadSample = () => {
    setInput(SAMPLE_INPUT);
    setAttempted(false);
    setTouchedUrls(false);
    setAlert("");
    const code = generateMetaTags(SAMPLE_INPUT);
    setGenerated(code);
    setGeneratedSnapshot(JSON.stringify(SAMPLE_INPUT));
    recordRecent("meta-tag-generator");
  };
  const reset = () => {
    setInput(EMPTY_INPUT);
    setGenerated("");
    setGeneratedSnapshot("");
    setAttempted(false);
    setTouchedUrls(false);
    setAlert("");
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(generated);
      notify("Meta tags copied to clipboard.");
    } catch {
      notify("Clipboard access is unavailable.");
    }
  };
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([`${generated}\n`], { type: "text/html;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "meta-tags.html";
    link.click();
    URL.revokeObjectURL(url);
  };

  const hostname = previewUrl?.hostname.replace(/^www\./u, "") ?? "example.com";
  const path = previewUrl
    ? previewUrl.pathname
        .split("/")
        .filter(Boolean)
        .map((part) => ` › ${safeDecode(part)}`)
        .join("")
    : "";
  const feedback = getFeedback(
    input,
    titleLength,
    descriptionLength,
    validation,
  );

  return (
    <section className="tool-workspace-section">
      <div className="wrap">
        <div className="mt">
          <div className="col">
            <div className="wsp">
              {alert && (
                <div className="alert" role="alert">
                  <Icon name="alert" size={18} />
                  <span>{alert}</span>
                  <button
                    className="ib sm"
                    aria-label="Dismiss error"
                    onClick={() => setAlert("")}
                  >
                    <Icon name="x" size={16} />
                  </button>
                </div>
              )}
              <div className="ph2">
                <div className="pt">
                  <span className="cico">
                    <Icon name="tag" size={16} />
                  </span>
                  <b>Basic SEO Information</b>
                </div>
                <span className="tag2">Title required</span>
              </div>
              <div className="mtb">
                <LengthField
                  label="Page Title"
                  required
                  value={input.title}
                  length={titleLength}
                  min={50}
                  max={60}
                  error={attempted ? validation.errors.title : undefined}
                  input={
                    <input
                      ref={titleRef}
                      className={`fi ${attempted && validation.errors.title ? "bad" : ""}`}
                      value={input.title}
                      onChange={(event) => update("title", event.target.value)}
                      placeholder="Enter your page title."
                      autoComplete="off"
                    />
                  }
                />
                <LengthField
                  label="Meta Description"
                  value={input.description ?? ""}
                  length={descriptionLength}
                  min={150}
                  max={160}
                  input={
                    <textarea
                      className="fi"
                      value={input.description}
                      onChange={(event) =>
                        update("description", event.target.value)
                      }
                      placeholder="Write a compelling description of your page."
                      rows={3}
                    />
                  }
                />
                <UrlField
                  label="Website URL"
                  value={input.websiteUrl ?? ""}
                  error={touchedUrls ? validation.errors.websiteUrl : undefined}
                  hint="Used for the domain shown in the illustrative search preview."
                  onChange={(value) => update("websiteUrl", value)}
                  onBlur={() => setTouchedUrls(true)}
                />
                <UrlField
                  label="Canonical URL"
                  value={input.canonicalUrl ?? ""}
                  error={
                    touchedUrls ? validation.errors.canonicalUrl : undefined
                  }
                  hint="Optional. The preferred address for this page. Leave empty to omit the tag."
                  onChange={(value) => update("canonicalUrl", value)}
                  onBlur={() => setTouchedUrls(true)}
                />
              </div>
              <div className="adv">
                <button
                  className="advh"
                  aria-expanded={advanced}
                  aria-controls="meta-advanced"
                  onClick={() => setAdvanced(!advanced)}
                >
                  <span className="cico">
                    <Icon name="sliders" size={16} />
                  </span>
                  Advanced SEO Settings
                  <span className="sm">
                    {input.robotsIndex}, {input.robotsFollow} · {input.charset}
                  </span>
                  <span className="cv">
                    <Icon name="chev" size={18} />
                  </span>
                </button>
                <div className="advp" id="meta-advanced" hidden={!advanced}>
                  <SelectField
                    label="Robots Indexing"
                    value={input.robotsIndex}
                    onChange={(value) =>
                      update(
                        "robotsIndex",
                        value as MetaTagInput["robotsIndex"],
                      )
                    }
                    options={["index", "noindex"]}
                  />
                  <SelectField
                    label="Robots Link Following"
                    value={input.robotsFollow}
                    onChange={(value) =>
                      update(
                        "robotsFollow",
                        value as MetaTagInput["robotsFollow"],
                      )
                    }
                    options={["follow", "nofollow"]}
                  />
                  {input.robotsIndex === "noindex" && (
                    <div className="mtw full" role="status">
                      <Icon name="alert" size={16} />
                      <span>
                        Noindex asks search engines not to show this page in
                        results. Use it only for pages you want kept out of
                        search.
                      </span>
                    </div>
                  )}
                  <div className="fld">
                    <div className="fh">
                      <label htmlFor="meta-author">
                        Author Name <span className="mcn">optional</span>
                      </label>
                    </div>
                    <input
                      id="meta-author"
                      className="fi"
                      value={input.author}
                      onChange={(event) => update("author", event.target.value)}
                      placeholder="Enter author name"
                      autoComplete="off"
                    />
                  </div>
                  <SelectField
                    label="Character Encoding"
                    value={input.charset}
                    onChange={(value) =>
                      update("charset", value as MetaTagInput["charset"])
                    }
                    options={["UTF-8", "ISO-8859-1"]}
                  />
                  <div className="fld full">
                    <button
                      className="sw2"
                      role="switch"
                      aria-checked={input.includeViewport}
                      onClick={() =>
                        update("includeViewport", !input.includeViewport)
                      }
                    >
                      <i />
                      Include responsive viewport tag
                    </button>
                    <p className="hint">
                      Adds the standard width and scale settings for responsive
                      pages.
                    </p>
                  </div>
                </div>
              </div>
              <div className="wtb">
                <button className="btn pr" onClick={() => generate()}>
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
            </div>
          </div>
          <div className="col">
            <div className="wsp">
              <div className="ph2">
                <div className="pt">
                  <span className="cico">
                    <Icon name="search" size={16} />
                  </span>
                  <b>Search Result Preview</b>
                </div>
                <div className="vt tx" role="group" aria-label="Preview device">
                  <button
                    aria-pressed={device === "desktop"}
                    onClick={() => setDevice("desktop")}
                  >
                    <Icon name="monitor" size={15} />
                    Desktop
                  </button>
                  <button
                    aria-pressed={device === "mobile"}
                    onClick={() => setDevice("mobile")}
                  >
                    <Icon name="phone" size={15} />
                    Mobile
                  </button>
                </div>
              </div>
              <div className="srb">
                <div className={`sr ${device === "mobile" ? "m" : ""}`}>
                  <div className="srh">
                    <span className="fv">
                      <Icon name="globe" size={15} />
                    </span>
                    <div className="srd">
                      <b>{hostname}</b>
                      <span>
                        https://{hostname}
                        {path}
                      </span>
                    </div>
                  </div>
                  <div className={`srt ${input.title.trim() ? "" : "ph"}`}>
                    {input.title.trim() || "Your page title will appear here"}
                  </div>
                  <div
                    className={`srx ${input.description?.trim() ? "" : "ph"}`}
                  >
                    {input.description?.trim() ||
                      "Your meta description will appear here."}
                  </div>
                </div>
              </div>
              <p className="dsc">
                Illustrative preview only. Actual results may vary, and search
                engines may rewrite titles and descriptions.
              </p>
            </div>
            <div className={`wsp meta-code ${fullscreen ? "fs" : ""}`}>
              <div className="ph2">
                <div className="pt">
                  <b>Generated Meta Tags</b>
                  <span className="tag2">HTML</span>
                </div>
                <div className="pa">
                  <Action
                    label="Copy Code"
                    icon="copy"
                    disabled={!generated || stale}
                    onClick={copy}
                  />
                  <Action
                    label="Download HTML"
                    icon="download"
                    disabled={!generated || stale}
                    onClick={download}
                  />
                  <Action
                    label={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    icon={fullscreen ? "x" : "fullscreen"}
                    onClick={() => setFullscreen(!fullscreen)}
                  />
                </div>
              </div>
              <div className="meta-code-output">
                {generated ? (
                  <pre>
                    <code>{generated}</code>
                  </pre>
                ) : (
                  <div className="pad es0">
                    <span className="ei">
                      <Icon name="html" size={26} />
                    </span>
                    <p>Your generated meta tags will appear here.</p>
                    <div className="bs">
                      <button className="btn pr" onClick={loadSample}>
                        Load Sample
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="sbar">
                {generated ? (
                  <>
                    <span>{generated.split("\n").length} lines</span>
                    <span>{countCharacters(generated)} chars</span>
                    <span className={stale ? "wn" : "ok"}>
                      <Icon name={stale ? "alert" : "check"} size={13} />
                      {stale ? "Inputs changed — generate again" : "Up to date"}
                    </span>
                  </>
                ) : (
                  <span>Awaiting generation</span>
                )}
              </div>
              <div className="mtn">
                <Icon name="info" size={16} />
                Add the generated tags inside the head section of your HTML
                document.
              </div>
            </div>
            <div className="wsp">
              <div className="ph2">
                <div className="pt">
                  <span className="cico">
                    <Icon name="check" size={16} />
                  </span>
                  <b>SEO Content Feedback</b>
                </div>
              </div>
              <ul className="fb">
                {feedback.map((item) => (
                  <li key={item.text}>
                    <span className={item.tone}>
                      <Icon
                        name={
                          item.tone === "ok"
                            ? "check"
                            : item.tone === "wn"
                              ? "alert"
                              : "info"
                        }
                        size={18}
                      />
                    </span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <p className="dsc feedback-note">
                Based only on the information you enter. No score or ranking
                estimate is shown.
              </p>
            </div>
          </div>
        </div>
        <div className="priv">
          <Icon name="shieldCheck" size={20} />
          <span>
            Metadata is generated locally in your browser. Nothing is uploaded,
            fetched from external websites or persisted.
          </span>
        </div>
      </div>
      {message && (
        <div className="toast on" role="status">
          <Icon name="check" size={16} />
          {message}
        </div>
      )}
    </section>
  );
}

function LengthField({
  label,
  required,
  value,
  length,
  min,
  max,
  input,
  error,
}: {
  label: string;
  required?: boolean;
  value: string;
  length: number;
  min: number;
  max: number;
  input: React.ReactNode;
  error?: string;
}) {
  const status =
    !value.trim() || length < min ? "" : length <= max ? "ok" : "wn";
  const wording = !length
    ? `suggested ${min}–${max}`
    : length < min
      ? `below ${min}–${max}`
      : length <= max
        ? `within ${min}–${max}`
        : `above ${min}–${max}`;
  return (
    <div className="fld" data-s={status}>
      <div className="fh">
        <label>
          {label}
          {required && <i aria-hidden="true">*</i>}
        </label>
        <span className="mcn">
          {length} chars · {wording}
        </span>
      </div>
      {input}
      <div className="mtr">
        <i style={{ width: `${Math.min(100, (length / max) * 100)}%` }} />
      </div>
      <p className="hint">
        Suggested length: {min}–{max} characters. Guidance only, not a strict
        SEO limit.
      </p>
      {error && (
        <p className="ferr">
          <Icon name="alert" size={14} />
          {error}
        </p>
      )}
    </div>
  );
}

function UrlField({
  label,
  value,
  error,
  hint,
  onChange,
  onBlur,
}: {
  label: string;
  value: string;
  error?: string;
  hint: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  return (
    <div className="fld">
      <div className="fh">
        <label>{label}</label>
      </div>
      <input
        className={`fi ${error ? "bad" : ""}`}
        type="url"
        inputMode="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder="https://example.com"
        autoComplete="off"
        aria-invalid={Boolean(error)}
      />
      <p className="hint">{hint}</p>
      {error && (
        <p className="ferr">
          <Icon name="alert" size={14} />
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="fld">
      <div className="fh">
        <label>{label}</label>
      </div>
      <select
        className="sel"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option
            key={option}
            value={option.toLowerCase() === option ? option : option}
          >
            {option[0].toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

function Action({
  label,
  icon,
  disabled,
  onClick,
}: {
  label: string;
  icon: Parameters<typeof Icon>[0]["name"];
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="ib sm"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon name={icon} size={17} />
    </button>
  );
}

function getFeedback(
  input: MetaTagInput,
  titleLength: number,
  descriptionLength: number,
  validation: ReturnType<typeof validateMetaTagInput>,
) {
  const items: Array<{ tone: "ok" | "wn" | "in"; text: string }> = [];
  items.push(
    input.title.trim()
      ? {
          tone: "ok",
          text: "Page title provided for the search result headline.",
        }
      : { tone: "wn", text: "Page title missing. Add one before generating." },
  );
  if (titleLength)
    items.push({
      tone: titleLength <= 60 ? "in" : "wn",
      text: `${titleLength} title characters. The 50–60 recommendation is guidance, and results may truncate differently.`,
    });
  items.push(
    input.description?.trim()
      ? { tone: "ok", text: "Meta description provided." }
      : {
          tone: "in",
          text: "No description. A search engine may select its own snippet.",
        },
  );
  if (descriptionLength)
    items.push({
      tone: descriptionLength <= 160 ? "in" : "wn",
      text: `${descriptionLength} description characters. The 150–160 recommendation is not a strict limit.`,
    });
  if (validation.errors.websiteUrl || validation.errors.canonicalUrl)
    items.push({
      tone: "wn",
      text: "One or more URLs are invalid. Use a complete HTTP or HTTPS address.",
    });
  else if (input.canonicalUrl?.trim())
    items.push({ tone: "ok", text: "Canonical URL is valid." });
  else
    items.push({
      tone: "in",
      text: "No canonical URL. This optional tag can identify a preferred page address.",
    });
  items.push(
    input.robotsIndex === "noindex"
      ? {
          tone: "wn",
          text: "Noindex is selected. Search engines are asked to exclude this page from results.",
        }
      : {
          tone: "ok",
          text: `Indexing allowed; links are set to ${input.robotsFollow}.`,
        },
  );
  return items;
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
