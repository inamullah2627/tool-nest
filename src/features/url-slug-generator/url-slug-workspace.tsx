"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/design/icon";
import { usePreferences } from "@/components/providers/app-providers";
import {
  DEFAULT_SLUG_OPTIONS,
  buildFullUrl,
  generateBulkSlugs,
  generateSlug,
  validateWebsiteUrl,
  type SlugOptions,
  type SlugSeparator,
} from "@/lib/seo/url-slug";

const SAMPLES = [
  "10 Best SEO Tools for Web Developers",
  "How to Improve Your Website Performance",
  "WordPress Development: A Complete Guide",
  "Café & Restaurant Website Design",
  "Next.js Tips for Beginners",
];
const LARGE_BULK_LINES = 1_000;

export function UrlSlugWorkspace() {
  const { recordRecent } = usePreferences();
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [title, setTitle] = useState("");
  const [website, setWebsite] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [options, setOptions] = useState(DEFAULT_SLUG_OPTIONS);
  const [customOpen, setCustomOpen] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const slug = useMemo(() => generateSlug(title, options), [title, options]);
  const untruncated = useMemo(
    () => generateSlug(title, { ...options, characterLimit: null }),
    [title, options],
  );
  const urlValidation = useMemo(() => validateWebsiteUrl(website), [website]);
  const fullUrl = useMemo(() => buildFullUrl(website, slug), [website, slug]);
  const bulk = useMemo(
    () => generateBulkSlugs(bulkInput, options),
    [bulkInput, options],
  );
  const bulkOutput = bulk.map((entry) => entry.slug).join("\n");
  const emptyCount = bulk.filter((entry) => entry.empty).length;
  const duplicateSlugs = new Map<string, number[]>();
  for (const entry of bulk) {
    if (!entry.duplicate) continue;
    const lines = duplicateSlugs.get(entry.slug) ?? [];
    lines.push(entry.line);
    duplicateSlugs.set(entry.slug, lines);
  }

  const notify = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2400);
  };
  const updateOptions = (next: Partial<SlugOptions>) => {
    setOptions((current) => ({ ...current, ...next }));
    setError("");
    recordRecent("url-slug-generator");
  };
  const paste = async () => {
    try {
      const value = await navigator.clipboard.readText();
      if (mode === "bulk") setBulkInput(value);
      else setTitle(value.replace(/\s*\n\s*/gu, " "));
      setError("");
      recordRecent("url-slug-generator");
    } catch {
      setError(
        "Clipboard access is unavailable. Paste into the editor manually.",
      );
    }
  };
  const copy = async (value: string, success: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      notify(success);
      recordRecent("url-slug-generator");
    } catch {
      setError(
        "Clipboard access is unavailable. Select and copy the text manually.",
      );
    }
  };
  const loadSample = () => {
    if (mode === "bulk") setBulkInput(SAMPLES.join("\n"));
    else setTitle(SAMPLES[0]);
    setError("");
    recordRecent("url-slug-generator");
  };
  const clear = () => {
    if (mode === "bulk") setBulkInput("");
    else setTitle("");
    setError("");
  };
  const reset = () => {
    setMode("single");
    setTitle("");
    setWebsite("");
    setBulkInput("");
    setOptions(DEFAULT_SLUG_OPTIONS);
    setCustomOpen(false);
    setError("");
  };
  const download = () => {
    if (!bulkOutput) return;
    const url = URL.createObjectURL(
      new Blob([bulkOutput], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "generated-slugs.txt";
    anchor.click();
    URL.revokeObjectURL(url);
    recordRecent("url-slug-generator");
  };

  const separatorLabel =
    options.separator === "-"
      ? "Hyphen"
      : options.separator === "_"
        ? "Underscore"
        : "Period";
  const wordCount = slug
    ? slug.split(options.separator).filter(Boolean).length
    : 0;
  const previewSlug = slug || "your-generated-slug";
  const previewBase =
    urlValidation.valid && urlValidation.url
      ? urlValidation.url.toString()
      : "https://example.com/blog/";

  return (
    <section className="tool-workspace-section slug-workspace">
      <div className="wrap">
        <div className="wsp">
          {(error || bulk.length > LARGE_BULK_LINES) && (
            <div className="alert" role="alert">
              <Icon name="alert" size={18} />
              <span>
                {error ||
                  `Large bulk input detected (${bulk.length.toLocaleString()} lines). Processing may feel slower.`}
              </span>
              {error && (
                <button
                  className="ib sm"
                  aria-label="Dismiss error"
                  onClick={() => setError("")}
                >
                  <Icon name="x" size={16} />
                </button>
              )}
            </div>
          )}
          <div className="wtb slug-toolbar">
            <span className="lb">Mode</span>
            <div
              className="vt tx slug-mode"
              role="group"
              aria-label="Generation mode"
            >
              <button
                aria-pressed={mode === "single"}
                onClick={() => setMode("single")}
              >
                Single Slug
              </button>
              <button
                aria-pressed={mode === "bulk"}
                onClick={() => setMode("bulk")}
              >
                Bulk Generator
              </button>
            </div>
            <span className="sp" />
            <button className="btn" onClick={reset}>
              <Icon name="rotate" size={16} />
              Reset
            </button>
          </div>

          {mode === "single" ? (
            <div className="wg slug-main">
              <div className="wp">
                <PanelHeader
                  title="Slug Generator"
                  onPaste={paste}
                  onSample={loadSample}
                  onClear={clear}
                />
                <div className="sgp">
                  <label className="slug-field">
                    <b>Enter Title or Text</b>
                    <textarea
                      className="inp"
                      rows={4}
                      value={title}
                      onChange={(event) => {
                        setTitle(event.target.value);
                        recordRecent("url-slug-generator");
                      }}
                      placeholder="Enter your page title, blog post title or text..."
                    />
                  </label>
                  <div className="slug-samples">
                    {SAMPLES.map((sample) => (
                      <button
                        className="chip"
                        key={sample}
                        onClick={() => setTitle(sample)}
                      >
                        {sample}
                      </button>
                    ))}
                    <span>{Array.from(title).length} characters</span>
                  </div>
                  <label className="slug-field">
                    <b>
                      Website URL <span className="tag2">Optional</span>
                    </b>
                    <input
                      className="inp"
                      type="url"
                      value={website}
                      aria-invalid={!urlValidation.valid}
                      onChange={(event) => setWebsite(event.target.value)}
                      placeholder="https://example.com/blog/"
                      autoComplete="off"
                    />
                    <small>
                      Used only to preview the complete URL. ToolNest does not
                      fetch or visit it.
                    </small>
                    {!urlValidation.valid && (
                      <span className="field-error" role="alert">
                        {urlValidation.error}
                      </span>
                    )}
                  </label>
                  <label className="slug-field">
                    <b>
                      Generated Slug <span className="tag2">Read-only</span>
                    </b>
                    <span className="sgo">
                      <input
                        className="inp"
                        readOnly
                        value={slug}
                        placeholder="Your slug will appear here"
                      />
                      <button
                        className="btn pr"
                        disabled={!slug}
                        onClick={() => copy(slug, "Slug copied to clipboard.")}
                      >
                        <Icon name="copy" size={16} />
                        Copy Slug
                      </button>
                    </span>
                    <small className="slug-count">
                      {Array.from(slug).length} characters
                    </small>
                  </label>
                </div>
              </div>
              <div className="wp">
                <div className="ph2">
                  <div className="pt">
                    <b>URL Preview</b>
                  </div>
                </div>
                <div className="sgp">
                  <div className="slug-preview">
                    <span
                      className={`preview-badge ${fullUrl ? "" : "illustrative"}`}
                    >
                      {fullUrl
                        ? "Your website URL"
                        : "Illustrative example, not your website"}
                    </span>
                    <div className="preview-url">
                      {previewBase}
                      <strong>{previewSlug}</strong>
                    </div>
                    <small>
                      {fullUrl
                        ? "Full URL with an encoded path"
                        : "Add a valid website URL to preview and copy your complete URL."}
                    </small>
                    <button
                      className="btn"
                      disabled={!fullUrl}
                      onClick={() =>
                        copy(fullUrl ?? "", "Full URL copied to clipboard.")
                      }
                    >
                      <Icon name="copy" size={16} />
                      Copy Full URL
                    </button>
                  </div>
                  <h2 className="slug-analysis-title">Slug Analysis</h2>
                  <div className="slug-stats">
                    <Stat
                      label="Character Count"
                      value={Array.from(slug).length}
                    />
                    <Stat label="Word Count" value={wordCount} />
                    <Stat label="Separator Type" value={separatorLabel} />
                    <Stat
                      label="Characters Removed"
                      value={Math.max(
                        0,
                        Array.from(title).length - Array.from(slug).length,
                      )}
                    />
                  </div>
                  <ul className="slug-feedback">
                    {title.trim() && !slug && (
                      <Feedback
                        warning
                        text="The selected settings produce an empty slug."
                      />
                    )}
                    {slug && (
                      <Feedback
                        text={`Uses ${separatorLabel.toLowerCase()} separators and contains no spaces.`}
                      />
                    )}
                    {slug && /[^\x00-\x7F]/u.test(slug) && (
                      <Feedback
                        warning
                        text="Multilingual characters are preserved and will be percent-encoded in a complete URL."
                      />
                    )}
                    {options.characterLimit &&
                      untruncated.length > slug.length && (
                        <Feedback
                          text={`The character limit shortened the slug from ${untruncated.length} to ${slug.length} characters.`}
                        />
                      )}
                    {slug.length > 75 && (
                      <Feedback
                        warning
                        text="The slug is longer than the common 75-character guidance; this is not a ranking score or strict limit."
                      />
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="wg slug-main">
              <div className="wp">
                <PanelHeader
                  title="Bulk Input"
                  tag="One title per line"
                  onPaste={paste}
                  onSample={loadSample}
                  onClear={clear}
                />
                <textarea
                  className="wta slug-bulk-editor"
                  value={bulkInput}
                  onChange={(event) => setBulkInput(event.target.value)}
                  placeholder="Enter one title per line..."
                  aria-label="Bulk titles"
                />
                <div className="sbar">
                  <span>
                    {bulk.length} {bulk.length === 1 ? "title" : "titles"}
                  </span>
                </div>
              </div>
              <div className="wp">
                <div className="ph2">
                  <div className="pt">
                    <b>Generated Slugs</b>
                    <span className="tag2">Read-only</span>
                  </div>
                  <div className="pa">
                    <button
                      className="ib sm"
                      disabled={!bulkOutput}
                      onClick={() => copy(bulkOutput, "All slugs copied.")}
                      aria-label="Copy all slugs"
                    >
                      <Icon name="copy" size={17} />
                    </button>
                    <button
                      className="ib sm"
                      disabled={!bulkOutput}
                      onClick={download}
                      aria-label="Download slugs as TXT"
                    >
                      <Icon name="download" size={17} />
                    </button>
                  </div>
                </div>
                <textarea
                  className="wta slug-bulk-editor slug-output"
                  value={bulkOutput}
                  readOnly
                  aria-label="Generated slugs"
                />
                <div className="sbar">
                  <span>{bulk.length - emptyCount} generated</span>
                  <span>{emptyCount} empty</span>
                  <span>{duplicateSlugs.size} duplicate slugs</span>
                </div>
                {(emptyCount > 0 || duplicateSlugs.size > 0) && (
                  <ul className="slug-feedback bulk-issues">
                    {bulk
                      .filter((entry) => entry.empty)
                      .slice(0, 10)
                      .map((entry) => (
                        <Feedback
                          key={`empty-${entry.line}`}
                          warning
                          text={`Line ${entry.line} produced an empty slug.`}
                        />
                      ))}
                    {[...duplicateSlugs].slice(0, 10).map(([value, lines]) => (
                      <Feedback
                        key={value}
                        warning
                        text={`Lines ${lines.join(", ")} generate the same slug: ${value}`}
                      />
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <div className="slug-settings">
            <h2>Slug Settings</h2>
            <div className="slug-settings-grid">
              <div>
                <h3>Separator</h3>
                <div
                  className="vt tx slug-separators"
                  role="radiogroup"
                  aria-label="Separator"
                >
                  {(
                    [
                      ["-", "Hyphen (-)"],
                      ["_", "Underscore (_)"],
                      [".", "Period (.)"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      role="radio"
                      aria-checked={options.separator === value}
                      key={value}
                      onClick={() =>
                        updateOptions({ separator: value as SlugSeparator })
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p>Hyphens are the recommended default for readable URLs.</p>
              </div>
              <div>
                <h3>Formatting Options</h3>
                <div className="slug-options">
                  <OptionSwitch
                    label="Convert to Lowercase"
                    hint="Converts all letters to lowercase for consistent URLs."
                    checked={options.lowercase}
                    onChange={(value) => updateOptions({ lowercase: value })}
                  />
                  <OptionSwitch
                    label="Remove Special Characters"
                    hint="Replaces punctuation and symbols with the separator."
                    checked={options.removeSpecialCharacters}
                    onChange={(value) =>
                      updateOptions({ removeSpecialCharacters: value })
                    }
                  />
                  <OptionSwitch
                    label="Remove Accents"
                    hint="Converts Latin letters such as é and ü to e and u."
                    checked={options.normalizeAccents}
                    onChange={(value) =>
                      updateOptions({ normalizeAccents: value })
                    }
                  />
                  <OptionSwitch
                    label="Remove Numbers"
                    hint="Strips digits such as years or counts from the slug."
                    checked={options.removeNumbers}
                    onChange={(value) =>
                      updateOptions({ removeNumbers: value })
                    }
                  />
                  <OptionSwitch
                    label="Remove Common Stop Words"
                    hint="Drops words like “the”, “and” and “of”."
                    checked={options.removeStopWords}
                    onChange={(value) =>
                      updateOptions({ removeStopWords: value })
                    }
                  />
                  <OptionSwitch
                    label="Remove Duplicate Words"
                    hint="Keeps only the first occurrence of a repeated word."
                    checked={options.removeDuplicateWords}
                    onChange={(value) =>
                      updateOptions({ removeDuplicateWords: value })
                    }
                  />
                </div>
                {options.removeStopWords && (
                  <div className="custom-stops">
                    <button
                      className="btn"
                      aria-expanded={customOpen}
                      onClick={() => setCustomOpen(!customOpen)}
                    >
                      <Icon name="plus" size={16} />
                      Custom stop words
                    </button>
                    {customOpen && (
                      <input
                        className="inp"
                        value={options.customStopWords}
                        onChange={(event) =>
                          updateOptions({ customStopWords: event.target.value })
                        }
                        placeholder="e.g. best, top, guide"
                        aria-label="Custom stop words"
                      />
                    )}
                  </div>
                )}
              </div>
              <div>
                <h3>Maximum Slug Length</h3>
                <OptionSwitch
                  label="Enable Character Limit"
                  checked={options.characterLimit !== null}
                  onChange={(value) =>
                    updateOptions({ characterLimit: value ? 75 : null })
                  }
                />
                <label className="limit-field">
                  Limit{" "}
                  <input
                    className="inp"
                    type="number"
                    min={1}
                    max={255}
                    disabled={options.characterLimit === null}
                    value={options.characterLimit ?? 75}
                    onChange={(event) =>
                      updateOptions({
                        characterLimit: Math.max(
                          1,
                          Math.min(255, Number(event.target.value) || 1),
                        ),
                      })
                    }
                  />{" "}
                  characters
                </label>
                <OptionSwitch
                  label="Preserve Complete Words"
                  checked={options.preserveCompleteWords}
                  onChange={(value) =>
                    updateOptions({ preserveCompleteWords: value })
                  }
                />
                <p>
                  75 is guidance, not a ranking requirement. The limit is off by
                  default.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="privacy slug-privacy">
          <Icon name="shieldCheck" size={18} />
          <b>
            Your text and URLs stay in browser memory. Nothing is uploaded,
            fetched or persisted.
          </b>
        </div>
      </div>
      {message && (
        <div className="toast" role="status">
          <Icon name="check" size={16} />
          {message}
        </div>
      )}
    </section>
  );
}

function PanelHeader({
  title,
  tag,
  onPaste,
  onSample,
  onClear,
}: {
  title: string;
  tag?: string;
  onPaste: () => void;
  onSample: () => void;
  onClear: () => void;
}) {
  return (
    <div className="ph2">
      <div className="pt">
        <b>{title}</b>
        {tag && <span className="tag2">{tag}</span>}
      </div>
      <div className="pa">
        <button className="ib sm" onClick={onPaste} aria-label="Paste">
          <Icon name="paste" size={17} />
        </button>
        <button className="ib sm" onClick={onSample} aria-label="Load sample">
          <Icon name="file" size={17} />
        </button>
        <button className="ib sm" onClick={onClear} aria-label="Clear">
          <Icon name="trash" size={17} />
        </button>
      </div>
    </div>
  );
}
function OptionSwitch({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="slug-option">
      <button
        className="sw2"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
      >
        <i />
        {label}
      </button>
      {hint && <small>{hint}</small>}
    </div>
  );
}
function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="slug-stat">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
function Feedback({
  text,
  warning = false,
}: {
  text: string;
  warning?: boolean;
}) {
  return (
    <li className={warning ? "warning" : "good"}>
      <Icon name={warning ? "alert" : "check"} size={15} />
      <span>{text}</span>
    </li>
  );
}
