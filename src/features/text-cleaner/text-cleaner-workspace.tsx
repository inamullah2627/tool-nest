"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/design/icon";
import { usePreferences } from "@/components/providers/app-providers";
import {
  CLEANING_OPTIONS,
  cleanText,
  optionsFromPreset,
  textMetrics,
  type CleaningOption,
  type CleaningOptions,
  type CleaningPreset,
  type CleaningResult,
} from "@/lib/text/text-cleaner";
import { validateTextFile } from "@/lib/text/word-counter";

const SAMPLE = `<h2>  Welcome   to   the ToolNest Blog!!  </h2>
<p>Our guides &amp; tutorials help you work faster — try them today 🚀</p>

   Visit https://example.com/tools for   more tips.
Questions?   Email support@example.com

Thanks for reading!!
Thanks for reading!!`;
const LARGE_INPUT = 200_000;

const PRESETS: Array<[CleaningPreset, string, string]> = [
  ["basic", "Basic Cleanup", "Spaces · trim · empty lines"],
  ["web", "Web Content Cleanup", "HTML · entities · spaces"],
  ["single-line", "Single Line Text", "Line breaks to spaces"],
  ["custom", "Custom Cleanup", "Choose your own options"],
];

const GROUPS: Array<{
  title: string;
  options: Array<[CleaningOption, string, string]>;
}> = [
  {
    title: "Whitespace and Formatting",
    options: [
      ["spaces", "Remove Extra Spaces", "Collapse repeated spaces into one."],
      [
        "trim",
        "Trim Leading and Trailing Spaces",
        "Trim both ends of every line.",
      ],
      [
        "empty",
        "Remove Empty Lines",
        "Remove blank and whitespace-only lines.",
      ],
      [
        "breaks",
        "Remove Line Breaks",
        "Replace line breaks with spaces so words stay separated.",
      ],
      [
        "tabs",
        "Replace Tabs with Spaces",
        "Turn every tab into one ordinary space.",
      ],
      [
        "trailing",
        "Remove Trailing Whitespace",
        "Remove spaces and tabs at line endings.",
      ],
    ],
  },
  {
    title: "Characters and Symbols",
    options: [
      [
        "numbers",
        "Remove Numbers",
        "Remove Unicode numeric characters including 7, ½ and ٣.",
      ],
      [
        "punctuation",
        "Remove Punctuation",
        "Remove Unicode punctuation while preserving letters.",
      ],
      [
        "symbols",
        "Remove Special Characters",
        "Remove Unicode symbols but retain emoji for its own option.",
      ],
      [
        "emoji",
        "Remove Emojis",
        "Remove emoji sequences, flags and modifiers; retain ©, ® and ™.",
      ],
      [
        "invisible",
        "Remove Invisible Formatting",
        "Remove zero-width and direction marks while retaining script joiners.",
      ],
    ],
  },
  {
    title: "Web Content",
    options: [
      [
        "html",
        "Remove HTML Tags",
        "Keep inert readable text, preserve blocks and discard script/style content.",
      ],
      [
        "entities",
        "Decode HTML Entities",
        "Convert entities such as &amp; and &#39; into characters.",
      ],
      [
        "urls",
        "Remove URLs",
        "Remove addresses beginning with http://, https:// or www.",
      ],
      [
        "emails",
        "Remove Email Addresses",
        "Remove common domain-based email address forms.",
      ],
    ],
  },
  {
    title: "Additional Cleanup",
    options: [
      [
        "duplicates",
        "Remove Duplicate Lines",
        "Reuse whole-line duplicate processing and keep the first copy.",
      ],
      [
        "quotes",
        "Normalize Quotation Marks",
        "Convert curly quotation marks to straight quotes.",
      ],
      [
        "dashes",
        "Normalize Dashes",
        "Convert typographic dashes and minus signs to a hyphen.",
      ],
    ],
  },
];

const LABELS: Record<CleaningOption, string> = Object.fromEntries(
  GROUPS.flatMap((group) => group.options.map(([id, label]) => [id, label])),
) as Record<CleaningOption, string>;

export function TextCleanerWorkspace() {
  const { recordRecent } = usePreferences();
  const [input, setInput] = useState("");
  const [preset, setPreset] = useState<CleaningPreset>("basic");
  const [options, setOptions] = useState<CleaningOptions>(() =>
    optionsFromPreset("basic"),
  );
  const [result, setResult] = useState<CleaningResult | null>(null);
  const [stale, setStale] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(GROUPS.map((group) => group.title)),
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const inputMetrics = useMemo(() => textMetrics(input), [input]);
  const outputMetrics = useMemo(
    () => textMetrics(result?.output ?? ""),
    [result],
  );
  const selected = CLEANING_OPTIONS.filter((option) => options[option]).length;

  useEffect(() => {
    const close = (event: KeyboardEvent) =>
      event.key === "Escape" && setFullscreen(false);
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);

  const notify = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2400);
  };
  const invalidate = () => {
    if (result) setStale(true);
    setResult(null);
  };
  const replaceInput = (value: string) => {
    setInput(value);
    setResult(null);
    setStale(false);
    setError("");
  };
  const selectPreset = (value: CleaningPreset) => {
    setPreset(value);
    if (value !== "custom") setOptions(optionsFromPreset(value));
    invalidate();
  };
  const changeOption = (option: CleaningOption, checked: boolean) => {
    setOptions((current) => ({ ...current, [option]: checked }));
    setPreset("custom");
    invalidate();
  };
  const setGroup = (group: (typeof GROUPS)[number], checked: boolean) => {
    setOptions((current) => ({
      ...current,
      ...Object.fromEntries(group.options.map(([option]) => [option, checked])),
    }));
    setPreset("custom");
    invalidate();
  };
  const process = () => {
    if (!input) return setError("Enter or paste some text to clean.");
    if (!selected) return setError("Select at least one cleaning option.");
    setResult(cleanText(input, options));
    setStale(false);
    setError("");
    recordRecent("text-cleaner");
    notify("Text cleaned.");
  };
  const paste = async () => {
    try {
      replaceInput(await navigator.clipboard.readText());
    } catch {
      setError(
        "Clipboard access is unavailable. Paste into the original text editor manually.",
      );
    }
  };
  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.output);
      notify("Cleaned text copied.");
    } catch {
      setError(
        "Clipboard access is unavailable. Select and copy the cleaned text manually.",
      );
    }
  };
  const upload = async (file?: File) => {
    if (!file) return;
    const validation = validateTextFile(file);
    if (validation) return setError(validation);
    try {
      replaceInput(await file.text());
      notify("Text file loaded.");
    } catch {
      setError("The selected text file could not be read.");
    }
  };
  const download = () => {
    if (!result) return;
    const url = URL.createObjectURL(
      new Blob([result.output], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "cleaned-text.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const reset = () => {
    setInput("");
    setPreset("basic");
    setOptions(optionsFromPreset("basic"));
    setResult(null);
    setStale(false);
    setFullscreen(false);
    setError("");
  };

  return (
    <section className="tool-workspace-section text-cleaner-workspace">
      <div className="wrap">
        <div className={`wsp cc-w ${fullscreen ? "fs" : ""}`}>
          {(error || input.length > LARGE_INPUT) && (
            <div className="alert" role="alert">
              <Icon name="alert" size={18} />
              <span>
                {error ||
                  "Large input detected. Cleaning may feel slower on some devices."}
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
          <div className="ph2">
            <div className="pt">
              <b>Quick Cleaning Presets</b>
            </div>
          </div>
          <div
            className="cleaner-presets"
            role="radiogroup"
            aria-label="Quick cleaning presets"
          >
            {PRESETS.map(([value, title, description]) => (
              <button
                role="radio"
                aria-checked={preset === value}
                key={value}
                onClick={() => selectPreset(value)}
              >
                <b>{title}</b>
                <span>{description}</span>
              </button>
            ))}
          </div>
          <div className="cleaner-options-head">
            <div>
              <b>Cleaning Options</b>
              <small>
                {selected} of {CLEANING_OPTIONS.length} selected
              </small>
            </div>
            <div>
              <button
                onClick={() => {
                  setOptions(optionsFromPreset("custom"));
                  setPreset("custom");
                  invalidate();
                }}
              >
                Deselect All
              </button>
              <button
                onClick={() => {
                  setOptions(
                    Object.fromEntries(
                      CLEANING_OPTIONS.map((option) => [option, true]),
                    ) as CleaningOptions,
                  );
                  setPreset("custom");
                  invalidate();
                }}
              >
                Select All
              </button>
            </div>
          </div>
          <div className="cleaner-groups">
            {GROUPS.map((group) => (
              <details
                className="cleaner-group"
                open={openGroups.has(group.title)}
                onToggle={(event) => {
                  const isOpen = event.currentTarget.open;
                  setOpenGroups((current) => {
                    if (current.has(group.title) === isOpen) return current;
                    const next = new Set(current);
                    if (isOpen) next.add(group.title);
                    else next.delete(group.title);
                    return next;
                  });
                }}
                key={group.title}
              >
                <summary>
                  {group.title}
                  <span>
                    {group.options.filter(([option]) => options[option]).length}
                    /{group.options.length}
                  </span>
                  <Icon name="chev" size={16} />
                </summary>
                <div className="cleaner-group-body">
                  <div className="cleaner-group-actions">
                    <button onClick={() => setGroup(group, true)}>
                      Select all
                    </button>
                    <button onClick={() => setGroup(group, false)}>
                      Deselect all
                    </button>
                  </div>
                  {group.options.map(([option, label, description]) => (
                    <div className="cleaner-option" key={option}>
                      <button
                        className="sw2"
                        role="switch"
                        aria-checked={options[option]}
                        onClick={() => changeOption(option, !options[option])}
                      >
                        <i />
                        {label}
                      </button>
                      <p>{description}</p>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
          <div className="wk cc cleaner-editors">
            <Editor
              title="Original Text"
              value={input}
              placeholder="Paste or type the text you want to clean..."
              label="Original text"
              metrics={inputMetrics}
              onChange={(value) => {
                setInput(value);
                invalidate();
                setError("");
              }}
              actions={
                <>
                  <Action icon="paste" label="Paste" onClick={paste} />
                  <Action
                    icon="upload"
                    label="Upload TXT File"
                    onClick={() => fileInput.current?.click()}
                  />
                  <Action
                    icon="file"
                    label="Load Sample"
                    onClick={() => replaceInput(SAMPLE)}
                  />
                  <Action
                    icon="trash"
                    label="Clear"
                    onClick={() => replaceInput("")}
                  />
                  <Action
                    icon="fullscreen"
                    label="Fullscreen"
                    onClick={() => setFullscreen(!fullscreen)}
                  />
                </>
              }
            />
            <Editor
              title="Cleaned Text"
              value={result?.output ?? ""}
              placeholder="Your cleaned text will appear here..."
              label="Cleaned text"
              metrics={outputMetrics}
              readOnly
              actions={
                <>
                  <Action
                    icon="copy"
                    label="Copy"
                    onClick={copy}
                    disabled={!result}
                  />
                  <Action
                    icon="download"
                    label="Download TXT"
                    onClick={download}
                    disabled={!result}
                  />
                  <Action
                    icon="fullscreen"
                    label="Fullscreen"
                    onClick={() => setFullscreen(!fullscreen)}
                  />
                </>
              }
            />
          </div>
          {stale && (
            <div className="dnote">
              <Icon name="alert" size={16} />
              Input or options changed. Clean the text again to update the
              results.
            </div>
          )}
          <div className="wtb">
            <button className="btn pr" onClick={process}>
              <Icon name="spark" size={16} />
              Clean Text
            </button>
            <span className="cleaner-selected">
              {selected} {selected === 1 ? "option" : "options"} selected
            </span>
            <button
              className="btn"
              disabled={!result}
              onClick={() => result && replaceInput(result.output)}
            >
              <Icon name="repeat" size={16} />
              Use Output as Input
            </button>
            <button className="btn" onClick={reset}>
              <Icon name="rotate" size={16} />
              Reset
            </button>
          </div>
          <input
            ref={fileInput}
            type="file"
            hidden
            accept=".txt,text/plain"
            onChange={(event) => {
              upload(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </div>
        {result && <CleaningStatistics result={result} />}
        <div className="cleaner-privacy">
          <Icon name="shieldCheck" size={18} />
          <b>
            Your text is processed only in browser memory and is never uploaded
            or persisted. TXT files are limited to 1 MB.
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

function Editor({
  title,
  value,
  placeholder,
  label,
  metrics,
  readOnly,
  onChange,
  actions,
}: {
  title: string;
  value: string;
  placeholder: string;
  label: string;
  metrics: ReturnType<typeof textMetrics>;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  actions: React.ReactNode;
}) {
  return (
    <div className="wp">
      <div className="ph2">
        <div className="pt">
          <b>{title}</b>
        </div>
        <div className="pa">{actions}</div>
      </div>
      <textarea
        className="wta"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        readOnly={readOnly}
        spellCheck={false}
      />
      <div className="sbar">
        <span>{metrics.characters.toLocaleString()} characters</span>
        <span>{metrics.lines.toLocaleString()} lines</span>
        <span>{formatBytes(metrics.bytes)}</span>
      </div>
    </div>
  );
}
function Action({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      className="ib sm"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon name={icon} size={17} />
    </button>
  );
}
function CleaningStatistics({ result }: { result: CleaningResult }) {
  const increase = result.byteDifference < 0;
  const changed = CLEANING_OPTIONS.filter(
    (option) => (result.operationCounts[option] ?? 0) > 0,
  );
  return (
    <div className="cleaner-results">
      <div className="dstat">
        <Stat label="Original Characters" value={result.originalCharacters} />
        <Stat label="Cleaned Characters" value={result.cleanedCharacters} />
        <Stat
          label={
            result.characterDifference < 0
              ? "Characters Added"
              : "Characters Removed"
          }
          value={Math.abs(result.characterDifference)}
        />
        <Stat
          label={increase ? "Size Increase" : "Size Reduction"}
          value={`${increase ? "+" : ""}${Math.abs(result.reductionPercentage).toFixed(1)}%`}
        />
      </div>
      <div className="dsum">
        {changed.length ? (
          changed.map((option) => (
            <span key={option}>
              {LABELS[option]}:{" "}
              <b>{result.operationCounts[option]?.toLocaleString()}</b>
            </span>
          ))
        ) : (
          <span>No individual operation changed the text.</span>
        )}
        <small>
          UTF-8 size: {formatBytes(result.originalBytes)} →{" "}
          {formatBytes(result.cleanedBytes)}. Counts are recorded sequentially,
          so text changed by an earlier operation is not counted again by a
          later one.
        </small>
      </div>
      {!result.output.trim() ? (
        <div className="callout wn">
          <Icon name="alert" size={20} />
          <p>
            Nothing is left after cleaning. The selected options removed all
            text.
          </p>
        </div>
      ) : !result.changed ? (
        <div className="callout">
          <Icon name="info" size={20} />
          <p>
            No changes were needed. The text already matches the selected
            options.
          </p>
        </div>
      ) : null}
    </div>
  );
}
function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="sc">
      <div className="lb2">
        <span>{label}</span>
      </div>
      <b>{typeof value === "number" ? value.toLocaleString() : value}</b>
    </div>
  );
}
function formatBytes(bytes: number) {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}
