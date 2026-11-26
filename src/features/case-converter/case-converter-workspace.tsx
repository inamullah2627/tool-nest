"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/design/icon";
import { usePreferences } from "@/components/providers/app-providers";
import {
  CASE_MODES,
  convertCase,
  getTextCounts,
  type CaseMode,
} from "@/lib/text/case-converter";
import { validateTextFile } from "@/lib/text/word-counter";

const SAMPLE_TEXT =
  "welcome to ToolNest! this is a free online case converter. easily transform your text into different letter cases for writing, coding and everyday tasks.";
const LARGE_TEXT_WARNING = 200_000;

const MODE_NOTES: Partial<Record<CaseMode | "developer", string>> = {
  sentence:
    "Sentence case capitalizes the first letter after sentence-ending punctuation. Proper nouns are not detected, so review names manually.",
  title:
    "Title Case capitalizes the first and last word and keeps common minor words such as ‘and’, ‘of’ and ‘the’ lowercase. Style guides differ.",
  capitalized:
    "Capitalized Case capitalizes every word, including minor words such as ‘and’ and ‘of’.",
  developer:
    "Developer cases turn each line into one identifier. Separators and punctuation are removed, and existing camelCase or acronym boundaries are split.",
};

export function CaseConverterWorkspace() {
  const { recordRecent } = usePreferences();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<CaseMode>("upper");
  const [preserveLineBreaks, setPreserveLineBreaks] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const recorded = useRef(false);
  const definition = CASE_MODES.find((item) => item.id === mode)!;
  const output = useMemo(
    () => convertCase(input, mode, preserveLineBreaks),
    [input, mode, preserveLineBreaks],
  );
  const inputCounts = useMemo(() => getTextCounts(input), [input]);
  const outputCounts = useMemo(() => getTextCounts(output), [output]);
  const note =
    MODE_NOTES[definition.group === "developer" ? "developer" : mode];

  useEffect(() => {
    if (input && !recorded.current) {
      recordRecent("case-converter");
      recorded.current = true;
    }
  }, [input, recordRecent]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const notify = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2400);
  };
  const replaceInput = (text: string) => {
    setError("");
    setInput(text);
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
    try {
      await navigator.clipboard.writeText(output);
      notify("Converted text copied to clipboard.");
    } catch {
      setError(
        "Clipboard access is unavailable. Select the converted text and press Ctrl+C.",
      );
    }
  };
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([output], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "converted-text.txt";
    link.click();
    URL.revokeObjectURL(url);
    notify("converted-text.txt downloaded.");
  };
  const upload = async (file?: File) => {
    if (!file) return;
    const validationError = validateTextFile(file);
    if (validationError) return setError(validationError);
    try {
      replaceInput(await file.text());
      notify("Text file loaded.");
    } catch {
      setError("The selected file could not be read.");
    }
  };
  const reset = () => {
    setMode("upper");
    setPreserveLineBreaks(true);
    replaceInput("");
  };

  return (
    <section className="tool-workspace-section case-workspace">
      <div className="wrap">
        <div className={`wsp cc-w ${fullscreen ? "fs" : ""}`}>
          {(error || input.length > LARGE_TEXT_WARNING) && (
            <div className="alert" role="alert">
              <Icon name="alert" size={18} />
              <span>
                {error ||
                  "Large input detected. Conversion may feel slower on some devices."}
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
          <div className="ph2 cc-head">
            <div className="pt">
              <b>Choose Text Case</b>
            </div>
            <div className="pa">
              <button
                className="btn compact"
                disabled={!output}
                onClick={() => replaceInput(output)}
              >
                <Icon name="repeat" size={15} /> Use Output as Input
              </button>
              <button className="btn compact" onClick={reset}>
                <Icon name="rotate" size={15} /> Reset
              </button>
            </div>
          </div>
          <ModeGroup
            title="Standard Text Cases"
            group="standard"
            selected={mode}
            onSelect={setMode}
          />
          <ModeGroup
            title="Developer Cases"
            subtitle="Identifier-style text"
            group="developer"
            selected={mode}
            onSelect={setMode}
          />
          {(definition.group === "standard" || note) && (
            <div className="cst">
              {definition.group === "standard" && (
                <button
                  className="sw2"
                  role="switch"
                  aria-checked={preserveLineBreaks}
                  onClick={() => setPreserveLineBreaks(!preserveLineBreaks)}
                >
                  <i /> Preserve Line Breaks
                </button>
              )}
              {note && (
                <p>
                  <Icon name="info" size={16} />
                  <span>{note}</span>
                </p>
              )}
            </div>
          )}
          <div className="wk">
            <EditorPanel
              title="Original Text"
              value={input}
              counts={inputCounts}
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
                    onClick={() => replaceInput(SAMPLE_TEXT)}
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
              onChange={replaceInput}
              placeholder="Type or paste your text here..."
              label="Original text"
            />
            <EditorPanel
              title="Converted Text"
              tag={definition.label}
              value={output}
              counts={outputCounts}
              actions={
                <>
                  <Action
                    label="Copy"
                    icon="copy"
                    disabled={!output}
                    onClick={copy}
                  />
                  <Action
                    label="Download TXT"
                    icon="download"
                    disabled={!output}
                    onClick={download}
                  />
                  <Action
                    label={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    icon={fullscreen ? "x" : "fullscreen"}
                    onClick={() => setFullscreen(!fullscreen)}
                  />
                </>
              }
              readOnly
              placeholder="Your converted text will appear here..."
              label="Converted text"
            />
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
        <div className="priv">
          <Icon name="shieldCheck" size={20} />
          <span>
            Your text is processed directly in your browser and is never
            uploaded or persisted. TXT files are limited to 1 MB.
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

function ModeGroup({
  title,
  subtitle,
  group,
  selected,
  onSelect,
}: {
  title: string;
  subtitle?: string;
  group: "standard" | "developer";
  selected: CaseMode;
  onSelect: (mode: CaseMode) => void;
}) {
  const modes = CASE_MODES.filter((item) => item.group === group);
  return (
    <div className="cgs">
      <div className="cgh">
        {title}
        {subtitle && <small>{subtitle}</small>}
      </div>
      <div
        className={`cog ${group === "standard" ? "c7" : "c5"}`}
        role="radiogroup"
        aria-label={title}
      >
        {modes.map((item) => (
          <button
            key={item.id}
            className="cob"
            role="radio"
            aria-checked={selected === item.id}
            tabIndex={
              selected === item.id ||
              (!modes.some((mode) => mode.id === selected) && item === modes[0])
                ? 0
                : -1
            }
            onClick={() => onSelect(item.id)}
            onKeyDown={(event) => {
              if (!/^Arrow(Left|Right|Up|Down)$/u.test(event.key)) return;
              event.preventDefault();
              const index = modes.findIndex(
                (candidate) => candidate.id === item.id,
              );
              const delta = /Right|Down/u.test(event.key) ? 1 : -1;
              const next = modes[(index + delta + modes.length) % modes.length];
              onSelect(next.id);
              (
                event.currentTarget.parentElement?.querySelector(
                  `[data-mode="${next.id}"]`,
                ) as HTMLButtonElement | null
              )?.focus();
            }}
            data-mode={item.id}
          >
            <b>{item.label}</b>
            <span>{item.example}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function EditorPanel({
  title,
  tag,
  value,
  counts,
  actions,
  onChange,
  readOnly,
  placeholder,
  label,
}: {
  title: string;
  tag?: string;
  value: string;
  counts: ReturnType<typeof getTextCounts>;
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
          {tag && <span className="tag2">{tag}</span>}
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
        <span>
          {counts.words.toLocaleString()}{" "}
          {counts.words === 1 ? "word" : "words"}
        </span>
        <span>
          {counts.characters.toLocaleString()}{" "}
          {counts.characters === 1 ? "character" : "characters"}
        </span>
        <span>
          {counts.lines.toLocaleString()}{" "}
          {counts.lines === 1 ? "line" : "lines"}
        </span>
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
