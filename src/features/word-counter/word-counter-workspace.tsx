"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/design/icon";
import { usePreferences } from "@/components/providers/app-providers";
import {
  analyzeText,
  formatDuration,
  getKeywordFrequency,
  validateTextFile,
} from "@/lib/text/word-counter";

const SAMPLE_TEXT =
  "Writing is rewriting. A first draft only needs to exist; the real work begins when you read it back, trim the extra words, and sharpen each sentence.\n\nGood editors count words not to limit ideas, but to protect the reader’s time. A short, clear paragraph often says more than a long one.\n\nTry pasting your own text here to see how the numbers change as you type.";

export function WordCounterWorkspace() {
  const { recordRecent } = usePreferences();
  const [text, setText] = useState("");
  const [excludeCommon, setExcludeCommon] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const recorded = useRef(false);
  const deferredText = useDeferredValue(text);
  const analysis = useMemo(() => analyzeText(deferredText), [deferredText]);
  const keywords = useMemo(
    () => getKeywordFrequency(analysis.words, excludeCommon),
    [analysis.words, excludeCommon],
  );

  useEffect(() => {
    if (text && !recorded.current) {
      recordRecent("word-counter");
      recorded.current = true;
    }
  }, [recordRecent, text]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const notify = (next: string) => {
    setMessage(next);
    window.setTimeout(() => setMessage(""), 2400);
  };
  const replaceText = (next: string) => {
    setError("");
    setText(next);
  };
  const paste = async () => {
    try {
      replaceText(await navigator.clipboard.readText());
    } catch {
      notify(
        "Clipboard access is unavailable. Press Ctrl+V in the editor instead.",
      );
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      notify("Text copied to clipboard.");
    } catch {
      notify("Clipboard access is unavailable.");
    }
  };
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "toolnest-text.txt";
    link.click();
    URL.revokeObjectURL(url);
  };
  const upload = async (file?: File) => {
    if (!file) return;
    const validationError = validateTextFile(file);
    if (validationError) return setError(validationError);
    try {
      replaceText(await file.text());
      notify("Text file loaded.");
    } catch {
      setError("The selected file could not be read.");
    }
  };

  const cards = [
    ["Words", analysis.wordCount, "type"],
    ["Characters", analysis.characterCount, "hash"],
    ["Without Whitespace", analysis.characterCountNoWhitespace, "min"],
    ["Sentences", analysis.sentenceCount, "edit"],
    ["Paragraphs", analysis.paragraphCount, "list"],
    ["Reading Time", formatDuration(analysis.readingTimeSeconds), "clock"],
  ] as const;
  const details = [
    ["Speaking Time", formatDuration(analysis.speakingTimeSeconds)],
    [
      "Average Word Length",
      analysis.wordCount
        ? `${analysis.averageWordLength.toFixed(1)} characters`
        : "0",
    ],
    [
      "Average Sentence Length",
      analysis.sentenceCount
        ? `${analysis.averageSentenceLength.toFixed(1)} words`
        : "0",
    ],
    ["Unique Words", analysis.uniqueWordCount.toLocaleString()],
    ["Longest Word", analysis.longestWord || "—"],
    ["Line Count", analysis.lineCount.toLocaleString()],
  ];

  return (
    <section className="tool-workspace-section">
      <div className="wrap">
        <div className="wst">
          {cards.map(([label, value, icon]) => (
            <div className="sc" key={label}>
              <div className="lb2">
                <span>{label}</span>
                <Icon name={icon} size={16} />
              </div>
              <b>
                {typeof value === "number" ? value.toLocaleString() : value}
              </b>
            </div>
          ))}
        </div>
        <div className={`wsp word-workspace ${fullscreen ? "fs" : ""}`}>
          {error && (
            <div className="alert" role="alert">
              <Icon name="alert" size={18} />
              <span>{error}</span>
              <button
                className="ib sm"
                aria-label="Dismiss error"
                onClick={() => setError("")}
              >
                <Icon name="x" size={16} />
              </button>
            </div>
          )}
          <div className="wk">
            <div className="wp">
              <div className="ph2">
                <div className="pt">
                  <b>Text Editor</b>
                </div>
                <div className="pa">
                  <Action label="Paste Text" icon="paste" onClick={paste} />
                  <Action
                    label="Upload TXT File"
                    icon="upload"
                    onClick={() => fileInput.current?.click()}
                  />
                  <Action
                    label="Load Sample"
                    icon="file"
                    onClick={() => replaceText(SAMPLE_TEXT)}
                  />
                  <Action
                    label="Copy Text"
                    icon="copy"
                    disabled={!text}
                    onClick={copy}
                  />
                  <Action
                    label="Download Text"
                    icon="download"
                    disabled={!text}
                    onClick={download}
                  />
                  <Action
                    label="Clear Text"
                    icon="trash"
                    disabled={!text}
                    onClick={() => replaceText("")}
                  />
                  <Action
                    label={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    icon={fullscreen ? "x" : "fullscreen"}
                    onClick={() => setFullscreen(!fullscreen)}
                  />
                </div>
              </div>
              <textarea
                className="wta"
                value={text}
                onChange={(event) => replaceText(event.target.value)}
                placeholder="Type or paste your text here to start counting..."
                aria-label="Text to analyze"
                spellCheck
              />
              <div className="sbar">
                <span className="live">Live counting</span>
                <span>
                  {analysis.characterCount.toLocaleString()} characters
                </span>
                <span>
                  {deferredText === text ? "Up to date" : "Analyzing…"}
                </span>
              </div>
            </div>
            <aside className="wp ap" aria-label="Text analysis">
              <div className="pt">
                <b>Text Analysis</b>
              </div>
              <div>
                {details.map(([label, value]) => (
                  <div className="ar" key={label}>
                    <span>{label}</span>
                    <b>{value}</b>
                  </div>
                ))}
              </div>
              <div>
                <b className="keyword-title">Keyword Frequency</b>
                <button
                  className="sw2"
                  role="switch"
                  aria-checked={excludeCommon}
                  onClick={() => setExcludeCommon(!excludeCommon)}
                >
                  <i />
                  Exclude Common Words
                </button>
                <div className="keyword-list">
                  {!analysis.wordCount ? (
                    <p className="kn">Start typing to see keyword frequency.</p>
                  ) : !keywords.length ? (
                    <p className="kn">
                      No meaningful keywords found. Try including common words.
                    </p>
                  ) : (
                    keywords.map((keyword) => (
                      <div className="kr" key={keyword.word}>
                        <span className="kk">{keyword.word}</span>
                        <span className="kd">
                          {keyword.count}× · {keyword.density.toFixed(1)}%
                        </span>
                        <div className="kb">
                          <i
                            style={{
                              width: `${(keyword.count / keywords[0].count) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </aside>
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
            Analysis happens only in your browser. Text is never uploaded or
            persisted. TXT uploads are limited to 1 MB.
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

function Action({
  label,
  icon,
  onClick,
  disabled,
}: {
  label: string;
  icon: Parameters<typeof Icon>[0]["name"];
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
