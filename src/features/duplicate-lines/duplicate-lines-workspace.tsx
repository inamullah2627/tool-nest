"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/design/icon";
import { usePreferences } from "@/components/providers/app-providers";
import {
  DEFAULT_DUPLICATE_OPTIONS,
  getLineInputMetrics,
  processDuplicateLines,
  type DuplicateKeep,
  type DuplicateLineOptions,
  type DuplicateLineResult,
  type DuplicateOutputMode,
  type DuplicateSort,
} from "@/lib/text/duplicate-lines";
import { validateTextFile } from "@/lib/text/word-counter";

const SAMPLE =
  "Apple\nBanana\nOrange\nApple\nMango\nBanana\nGrapes\nOrange\nPineapple\nMango";
const LARGE_INPUT_CHARACTERS = 200_000;
const MODE_CONTENT: Record<
  DuplicateOutputMode,
  { label: string; action: string; description: string; file: string }
> = {
  unique: {
    label: "Unique Lines",
    action: "Remove Duplicate Lines",
    description:
      "Remove repeated occurrences while keeping one representative of each distinct line.",
    file: "unique-lines.txt",
  },
  duplicates: {
    label: "Duplicate Lines Only",
    action: "Find Duplicate Lines",
    description:
      "Show one representative of each line that appears more than once.",
    file: "duplicate-lines.txt",
  },
  "non-repeated": {
    label: "Non-Repeated Lines Only",
    action: "Keep Non-Repeated Lines",
    description: "Show only lines that occur exactly once.",
    file: "non-repeated-lines.txt",
  },
};

export function DuplicateLinesWorkspace() {
  const { recordRecent } = usePreferences();
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<DuplicateLineOptions>(
    DEFAULT_DUPLICATE_OPTIONS,
  );
  const [result, setResult] = useState<DuplicateLineResult | null>(null);
  const [staleResult, setStaleResult] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const inputMetrics = useMemo(() => getLineInputMetrics(input), [input]);
  const outputMetrics = useMemo(
    () => getLineInputMetrics(result?.output ?? ""),
    [result],
  );
  const mode = MODE_CONTENT[options.mode];

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
    if (result) setStaleResult(true);
    setResult(null);
  };
  const replaceInput = (text: string, showStale = false) => {
    if (showStale) setStaleResult((current) => current || Boolean(result));
    else setStaleResult(false);
    setInput(text);
    setResult(null);
    setError("");
  };
  const changeOptions = (next: Partial<DuplicateLineOptions>) => {
    setOptions((current) => ({ ...current, ...next }));
    invalidate();
    setError("");
  };
  const process = () => {
    if (!input) {
      setError("Enter or paste some text to process.");
      return;
    }
    const next = processDuplicateLines(input, options);
    setResult(next);
    setStaleResult(false);
    setError("");
    recordRecent("remove-duplicate-lines");
    notify(`${mode.label} generated.`);
  };
  const paste = async () => {
    try {
      replaceInput(await navigator.clipboard.readText());
    } catch {
      setError(
        "Clipboard access is unavailable. Press Ctrl+V in the original text editor instead.",
      );
    }
  };
  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.output);
      notify("Processed text copied to clipboard.");
    } catch {
      setError(
        "Clipboard access is unavailable. Select the processed text and press Ctrl+C.",
      );
    }
  };
  const download = () => {
    if (!result) return;
    const url = URL.createObjectURL(
      new Blob([result.output], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = mode.file;
    anchor.click();
    URL.revokeObjectURL(url);
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
  const reset = () => {
    setInput("");
    setOptions(DEFAULT_DUPLICATE_OPTIONS);
    setResult(null);
    setStaleResult(false);
    setFullscreen(false);
    setError("");
  };

  return (
    <section className="tool-workspace-section duplicate-workspace">
      <div className="wrap">
        <div className={`wsp cc-w ${fullscreen ? "fs" : ""}`}>
          {(error || input.length > LARGE_INPUT_CHARACTERS) && (
            <div className="alert" role="alert">
              <Icon name="alert" size={18} />
              <span>
                {error ||
                  "Large input detected. Processing may feel slower on some devices."}
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
              <b>Removal Options</b>
            </div>
          </div>
          <div className="dsg">
            <Setting>
              <Switch
                label="Case Sensitive"
                checked={options.caseSensitive}
                onChange={(caseSensitive) => changeOptions({ caseSensitive })}
              />
              <p>
                {options.caseSensitive
                  ? "Apple and apple are different lines."
                  : "Apple and apple are treated as duplicates."}
              </p>
            </Setting>
            <Setting>
              <Switch
                label="Ignore Leading and Trailing Spaces"
                checked={options.ignoreSurroundingWhitespace}
                onChange={(ignoreSurroundingWhitespace) =>
                  changeOptions({ ignoreSurroundingWhitespace })
                }
              />
              <p>
                {options.ignoreSurroundingWhitespace
                  ? "Surrounding spaces are ignored for comparison; retained content is unchanged."
                  : "Lines must match exactly, including surrounding spaces."}
              </p>
            </Setting>
            <Setting>
              <Switch
                label="Remove Empty Lines"
                checked={options.removeEmptyLines}
                onChange={(removeEmptyLines) =>
                  changeOptions({ removeEmptyLines })
                }
              />
              <p>
                {options.removeEmptyLines
                  ? "Empty and whitespace-only lines are removed."
                  : "Empty lines are compared like any other line."}
              </p>
            </Setting>
            <Setting>
              <label htmlFor="duplicate-keep">Keep Occurrence</label>
              <select
                className="sel"
                id="duplicate-keep"
                value={options.keep}
                onChange={(event) =>
                  changeOptions({ keep: event.target.value as DuplicateKeep })
                }
              >
                <option value="first">Keep First Occurrence</option>
                <option value="last">Keep Last Occurrence</option>
              </select>
              <p>
                {options.keep === "first"
                  ? "Keeps the first original occurrence."
                  : "Keeps the last original occurrence."}
              </p>
            </Setting>
            <Setting>
              <label htmlFor="duplicate-sort">Sort Output</label>
              <select
                className="sel"
                id="duplicate-sort"
                value={options.sort}
                onChange={(event) =>
                  changeOptions({ sort: event.target.value as DuplicateSort })
                }
              >
                <option value="preserve">Preserve Original Order</option>
                <option value="az">Alphabetical (A–Z)</option>
                <option value="za">Alphabetical (Z–A)</option>
                <option value="shortest">Shortest to Longest</option>
                <option value="longest">Longest to Shortest</option>
              </select>
              <p>{sortDescription(options.sort)}</p>
            </Setting>
          </div>
          <div className="dmd">
            <div className="vt tx" role="group" aria-label="Output mode">
              {(Object.keys(MODE_CONTENT) as DuplicateOutputMode[]).map(
                (key) => (
                  <button
                    key={key}
                    aria-pressed={options.mode === key}
                    onClick={() => changeOptions({ mode: key })}
                  >
                    {MODE_CONTENT[key].label}
                  </button>
                ),
              )}
            </div>
            <p>{mode.description}</p>
          </div>
          <div className="wk">
            <EditorPanel
              title="Original Text"
              value={input}
              metrics={inputMetrics}
              onChange={(value) => replaceInput(value, true)}
              placeholder="Paste or type your text here, with each entry on a new line..."
              label="Original text"
              actions={
                <>
                  <Action label="Paste" icon="paste" onClick={paste} />
                  <Action
                    label="Upload TXT File"
                    icon="upload"
                    onClick={() => fileInput.current?.click()}
                  />
                  <Action
                    label="Load Sample"
                    icon="file"
                    onClick={() => replaceInput(SAMPLE)}
                  />
                  <Action
                    label="Clear"
                    icon="trash"
                    disabled={!input}
                    onClick={() => replaceInput("")}
                  />
                  <Action
                    label={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    icon={fullscreen ? "x" : "fullscreen"}
                    onClick={() => setFullscreen(!fullscreen)}
                  />
                </>
              }
            />
            <EditorPanel
              title={mode.label}
              value={result?.output ?? ""}
              metrics={
                result
                  ? outputMetrics
                  : { lines: 0, characters: 0, emptyLines: 0 }
              }
              readOnly
              placeholder="Your processed text will appear here..."
              label="Processed text"
              actions={
                <>
                  <Action
                    label="Copy"
                    icon="copy"
                    disabled={!result}
                    onClick={copy}
                  />
                  <Action
                    label="Download TXT"
                    icon="download"
                    disabled={!result}
                    onClick={download}
                  />
                  <Action
                    label={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    icon={fullscreen ? "x" : "fullscreen"}
                    onClick={() => setFullscreen(!fullscreen)}
                  />
                </>
              }
            />
          </div>
          {staleResult && (
            <div className="dnote">
              <Icon name="alert" size={16} />
              Input or options changed. Process again to update the results.
            </div>
          )}
          <div className="wtb duplicate-actions">
            <button className="btn pr" disabled={!input} onClick={process}>
              <Icon name="layers" size={16} />
              {mode.action}
            </button>
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
            accept=".txt,text/plain"
            hidden
            onChange={(event) => {
              void upload(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </div>
        {result && <DuplicateStatistics result={result} mode={options.mode} />}
        <div className="priv">
          <Icon name="shieldCheck" size={20} />
          <span>
            Your text is processed only in browser memory and is never uploaded
            or persisted. TXT files are limited to 1 MB.
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

function DuplicateStatistics({
  result,
  mode,
}: {
  result: DuplicateLineResult;
  mode: DuplicateOutputMode;
}) {
  const cards = [
    ["Original Lines", result.originalLines, "list"],
    ["Unique Lines", result.uniqueLines, "check"],
    ["Duplicate Occurrences", result.duplicateOccurrences, "layers"],
    ["Empty Lines Removed", result.emptyLinesRemoved, "trash"],
  ] as const;
  const noOutput = result.outputLines.length === 0;
  return (
    <div className="drs">
      <div className="dstat">
        {cards.map(([label, value, icon]) => (
          <div className="sc" key={label}>
            <div className="lb2">
              <span>{label}</span>
              <Icon name={icon} size={16} />
            </div>
            <b>{value.toLocaleString()}</b>
          </div>
        ))}
      </div>
      <div className="dsum">
        <span>
          Output: <b>{result.outputLines.length.toLocaleString()} lines</b>
        </span>
        <span>
          Lines removed: <b>{result.totalLinesRemoved.toLocaleString()}</b>
        </span>
        <span>
          Removed: <b>{formatPercentage(result.removalPercentage)}</b>
        </span>
        <small>
          Duplicate occurrences count only repeated copies. Empty lines removed
          are reported separately.
        </small>
      </div>
      {noOutput && (
        <div className="callout">
          <Icon name="info" size={20} />
          <p>
            {mode === "duplicates"
              ? "No duplicate lines were found."
              : mode === "non-repeated"
                ? "No non-repeated lines remain with these settings."
                : "No lines remain after filtering."}
          </p>
        </div>
      )}
    </div>
  );
}

function Setting({ children }: { children: React.ReactNode }) {
  return <div className="dc">{children}</div>;
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
      className="sw2"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
    >
      <i />
      {label}
    </button>
  );
}
function EditorPanel({
  title,
  value,
  metrics,
  actions,
  onChange,
  readOnly,
  placeholder,
  label,
}: {
  title: string;
  value: string;
  metrics: ReturnType<typeof getLineInputMetrics>;
  actions: React.ReactNode;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder: string;
  label: string;
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
        <span>{metrics.lines.toLocaleString()} lines</span>
        <span>{metrics.characters.toLocaleString()} characters</span>
        <span>{metrics.emptyLines.toLocaleString()} empty lines</span>
      </div>
    </div>
  );
}
function Action({
  label,
  icon,
  onClick,
  disabled,
}: {
  label: string;
  icon: IconName;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      className="ib sm"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon name={icon} size={17} />
    </button>
  );
}
function sortDescription(sort: DuplicateSort) {
  return {
    preserve: "Keeps retained lines in occurrence order.",
    az: "Sorts by deterministic character order, A–Z.",
    za: "Sorts by deterministic character order, Z–A.",
    shortest: "Sorts by Unicode character length, shortest first.",
    longest: "Sorts by Unicode character length, longest first.",
  }[sort];
}
function formatPercentage(value: number) {
  return `${Number(value.toFixed(1))}%`;
}
