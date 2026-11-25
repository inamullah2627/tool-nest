"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/design/icon";
import { usePreferences } from "@/components/providers/app-providers";
import {
  getTextMetrics,
  MAX_JSON_FILE_BYTES,
  type JsonIndent,
  type JsonProcessResult,
  type JsonValue,
  validateJsonFile,
} from "@/lib/json/processor";

const SAMPLE_JSON =
  '{"name":"ToolNest","category":"Developer Tools","free":true,"features":["Format","Validate","Minify"],"version":1}';

export function JsonWorkspace() {
  const { recordRecent } = usePreferences();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [value, setValue] = useState<JsonValue>();
  const [error, setError] = useState<{
    message: string;
    line?: number;
    column?: number;
  } | null>(null);
  const [indent, setIndent] = useState<JsonIndent>(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [wordWrap, setWordWrap] = useState(false);
  const [view, setView] = useState<"code" | "tree">("code");
  const [processing, setProcessing] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [message, setMessage] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const fileInput = useRef<HTMLInputElement>(null);
  const inputLines = useRef<HTMLPreElement>(null);

  const inputMetrics = useMemo(() => getTextMetrics(input), [input]);
  const outputMetrics = useMemo(() => getTextMetrics(output), [output]);
  const valid = Boolean(output && !error);

  useEffect(() => {
    const closeFullscreen = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
    };
    document.addEventListener("keydown", closeFullscreen);
    return () => document.removeEventListener("keydown", closeFullscreen);
  }, []);

  const updateInput = (next: string) => {
    setInput(next);
    setOutput("");
    setValue(undefined);
    setError(null);
    setView("code");
    setCollapsed(new Set());
  };

  const run = (
    mode: "format" | "minify" | "validate",
    overrides?: { sortKeys?: boolean; indent?: JsonIndent },
  ) => {
    if (!input.trim()) {
      setError({ message: "Enter JSON before processing." });
      return;
    }
    if (new TextEncoder().encode(input).length > MAX_JSON_FILE_BYTES) {
      setError({ message: "Input exceeds the 2 MB processing limit." });
      setOutput("");
      setValue(undefined);
      return;
    }
    setProcessing(true);
    setError(null);
    const worker = new Worker(
      new URL("../../workers/json-processor.worker.ts", import.meta.url),
      { type: "module" },
    );
    worker.onmessage = (event: MessageEvent<JsonProcessResult>) => {
      const result = event.data;
      if (result.ok) {
        setOutput(result.output);
        setValue(result.value);
        setError(null);
        setCollapsed(new Set());
        recordRecent("json-formatter");
        showMessage(
          mode === "validate"
            ? "JSON is valid."
            : mode === "minify"
              ? "JSON minified."
              : "JSON formatted.",
        );
      } else {
        setOutput("");
        setValue(undefined);
        setError(result.error);
      }
      setProcessing(false);
      worker.terminate();
    };
    worker.onerror = () => {
      setError({
        message:
          "The browser could not process this JSON. Try a smaller document.",
      });
      setOutput("");
      setValue(undefined);
      setProcessing(false);
      worker.terminate();
    };
    worker.postMessage({
      input,
      options: {
        mode,
        indent: overrides?.indent ?? indent,
        sortKeys: overrides?.sortKeys ?? sortKeys,
      },
    });
  };

  const showMessage = (next: string) => {
    setMessage(next);
    window.setTimeout(() => setMessage(""), 2400);
  };

  const loadSample = () => updateInput(SAMPLE_JSON);
  const paste = async () => {
    try {
      updateInput(await navigator.clipboard.readText());
    } catch {
      showMessage(
        "Clipboard access is unavailable. Press Ctrl+V in the editor instead.",
      );
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      showMessage("JSON copied to clipboard.");
    } catch {
      showMessage("Clipboard access is unavailable.");
    }
  };
  const download = () => {
    const blob = new Blob([output], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "formatted.json";
    link.click();
    URL.revokeObjectURL(url);
  };
  const upload = async (file?: File) => {
    if (!file) return;
    const validationError = validateJsonFile(file);
    if (validationError) {
      setError({ message: validationError });
      return;
    }
    try {
      updateInput(await file.text());
    } catch {
      setError({ message: "The selected file could not be read." });
    }
  };
  const collapseAll = () =>
    value && setCollapsed(new Set(getContainerPaths(value)));

  return (
    <section className="tool-workspace-section">
      <div className="wrap">
        <div
          className={`wsp ${fullscreen ? "fs" : ""} ${wordWrap ? "wrp" : ""}`}
        >
          {error && (
            <div className="alert" role="alert">
              <Icon name="alert" size={18} />
              <span>
                {error.message}
                {error.line
                  ? ` Line ${error.line}, column ${error.column ?? 1}.`
                  : ""}
              </span>
              <button
                className="ib sm"
                aria-label="Dismiss error"
                onClick={() => setError(null)}
              >
                <Icon name="x" size={16} />
              </button>
            </div>
          )}
          <div className="wtb">
            <button
              className="btn pr"
              disabled={!input.trim() || processing}
              onClick={() => run("format")}
            >
              <Icon name="spark" size={16} />
              {processing ? "Processing…" : "Format JSON"}
            </button>
            <button
              className="btn"
              disabled={!input.trim() || processing}
              onClick={() => run("minify")}
            >
              <Icon name="min" size={16} />
              Minify JSON
            </button>
            <button
              className="btn"
              disabled={!input.trim() || processing}
              onClick={() => run("validate")}
            >
              <Icon name="check" size={16} />
              Validate JSON
            </button>
            <span className="sp" />
            <label className="lb">
              Indent{" "}
              <select
                className="sel"
                value={indent}
                onChange={(event) =>
                  setIndent(
                    event.target.value === "tab"
                      ? "tab"
                      : (Number(event.target.value) as 2 | 4),
                  )
                }
                aria-label="Indentation"
              >
                <option value="2">2 Spaces</option>
                <option value="4">4 Spaces</option>
                <option value="tab">Tab</option>
              </select>
            </label>
            <Switch
              label="Sort Keys"
              checked={sortKeys}
              onChange={(next) => {
                setSortKeys(next);
                if (valid) run("format", { sortKeys: next });
              }}
            />
            <Switch
              label="Word Wrap"
              checked={wordWrap}
              onChange={setWordWrap}
            />
          </div>
          <div className="wg">
            <div className="wp">
              <PanelHeader title="JSON Input">
                <IconButton label="Paste" icon="paste" onClick={paste} />
                <IconButton
                  label="Upload JSON File"
                  icon="upload"
                  onClick={() => fileInput.current?.click()}
                />
                <IconButton
                  label="Load Sample"
                  icon="file"
                  onClick={loadSample}
                />
                <IconButton
                  label="Clear"
                  icon="trash"
                  disabled={!input && !output}
                  onClick={() => updateInput("")}
                />
              </PanelHeader>
              <div className="json-editor input-editor">
                <pre
                  className="line-numbers"
                  ref={inputLines}
                  aria-hidden="true"
                >
                  {lineNumbers(input)}
                </pre>
                <textarea
                  value={input}
                  onChange={(event) => updateInput(event.target.value)}
                  onScroll={(event) => {
                    if (inputLines.current)
                      inputLines.current.scrollTop =
                        event.currentTarget.scrollTop;
                  }}
                  spellCheck={false}
                  autoComplete="off"
                  placeholder="Paste your JSON here..."
                  aria-label="JSON input"
                />
              </div>
              <StatusBar
                metrics={inputMetrics}
                status={
                  error
                    ? "Invalid JSON"
                    : valid
                      ? "Valid JSON"
                      : "Not validated"
                }
              />
            </div>
            <div className="wp">
              <PanelHeader title="JSON Output">
                <IconButton
                  label="Copy"
                  icon="copy"
                  disabled={!valid}
                  onClick={copy}
                />
                <IconButton
                  label="Download JSON"
                  icon="download"
                  disabled={!valid}
                  onClick={download}
                />
                <IconButton
                  label="Fullscreen"
                  icon={fullscreen ? "x" : "fullscreen"}
                  onClick={() => setFullscreen(!fullscreen)}
                />
                <div className="vt tx">
                  <button
                    aria-label="Code view"
                    aria-pressed={view === "code"}
                    disabled={!valid}
                    onClick={() => setView("code")}
                  >
                    Code
                  </button>
                  <button
                    aria-label="Tree view"
                    aria-pressed={view === "tree"}
                    disabled={!valid}
                    onClick={() => setView("tree")}
                  >
                    Tree
                  </button>
                </div>
              </PanelHeader>
              <div className="json-editor output-editor" aria-live="polite">
                {error ? (
                  <EmptyOutput error={error} />
                ) : !output ? (
                  <div className="pad es0">
                    <span className="ei">
                      <Icon name="braces" size={26} />
                    </span>
                    <p>Your formatted JSON will appear here.</p>
                    <div className="bs">
                      <button className="btn pr" onClick={loadSample}>
                        Load Sample
                      </button>
                    </div>
                  </div>
                ) : view === "tree" && value !== undefined ? (
                  <div className="pad tree-wrap">
                    <div className="ttb">
                      <button
                        className="btn"
                        onClick={() => setCollapsed(new Set())}
                      >
                        Expand All
                      </button>
                      <button className="btn" onClick={collapseAll}>
                        Collapse All
                      </button>
                    </div>
                    <div className="tree">
                      <TreeNode
                        value={value}
                        path="$"
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                      />
                    </div>
                  </div>
                ) : (
                  <HighlightedCode code={output} wrap={wordWrap} />
                )}
              </div>
              <StatusBar
                metrics={
                  valid ? outputMetrics : { lines: 0, characters: 0, bytes: 0 }
                }
                status={
                  valid
                    ? "Valid JSON"
                    : error
                      ? "Invalid JSON"
                      : "Awaiting input"
                }
              />
            </div>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept=".json,application/json"
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
            Processing happens in your browser. JSON is never uploaded or saved.
            Files are limited to 2 MB. Integers outside JavaScript&apos;s safe
            range and duplicate keys are rejected to prevent silent data loss.
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

function PanelHeader({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="ph2">
      <div className="pt">
        <b>{title}</b>
        <span className="tag2">JSON</span>
      </div>
      <div className="pa">{children}</div>
    </div>
  );
}

function IconButton({
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

function Switch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
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

function StatusBar({
  metrics,
  status,
}: {
  metrics: { lines: number; characters: number; bytes: number };
  status: string;
}) {
  return (
    <div className="sbar">
      <span>
        {metrics.lines} {metrics.lines === 1 ? "line" : "lines"}
      </span>
      <span>{metrics.characters} chars</span>
      <span>{formatBytes(metrics.bytes)}</span>
      <span
        className={
          status === "Valid JSON" ? "ok" : status === "Invalid JSON" ? "er" : ""
        }
      >
        {status}
      </span>
    </div>
  );
}

function EmptyOutput({
  error,
}: {
  error: { message: string; line?: number; column?: number };
}) {
  return (
    <div className="pad es0">
      <span className="ei er">
        <Icon name="alert" size={26} />
      </span>
      <h4>Invalid JSON</h4>
      <p className="er">{error.message}</p>
      {error.line && (
        <code>
          Line {error.line}, Column {error.column ?? 1}
        </code>
      )}
      <p>Your original input has been preserved. The output was cleared.</p>
    </div>
  );
}

function HighlightedCode({ code, wrap }: { code: string; wrap: boolean }) {
  return (
    <pre
      className={`oc code-output ${wrap ? "wrap" : ""}`}
      aria-label="Read-only JSON output"
    >
      {code.split("\n").map((line, index) => (
        <span className="code-line" key={`${index}-${line}`}>
          <span className="line-number">{index + 1}</span>
          <code>{highlightLine(line)}</code>
        </span>
      ))}
    </pre>
  );
}

function highlightLine(line: string) {
  const tokens = line.split(
    /("(?:\\.|[^"\\])*")(?=\s*:)|("(?:\\.|[^"\\])*")|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
  );
  return tokens
    .filter((token) => token !== undefined && token !== "")
    .map((token, index) => {
      const className = /^"/.test(token)
        ? line.includes(`${token}:`)
          ? "t-k"
          : "t-s"
        : /^(true|false|null)$/.test(token)
          ? "t-b"
          : /^-?\d/.test(token)
            ? "t-n"
            : undefined;
      return (
        <span className={className} key={`${index}-${token}`}>
          {token}
        </span>
      );
    });
}

function TreeNode({
  value,
  path,
  label,
  collapsed,
  setCollapsed,
}: {
  value: JsonValue;
  path: string;
  label?: string;
  collapsed: Set<string>;
  setCollapsed: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
  const container = value !== null && typeof value === "object";
  if (!container)
    return (
      <div className="tn lf">
        {label !== undefined && (
          <span className="t-k">{JSON.stringify(label)}: </span>
        )}
        <span
          className={
            typeof value === "string"
              ? "t-s"
              : typeof value === "number"
                ? "t-n"
                : "t-b"
          }
        >
          {JSON.stringify(value)}
        </span>
      </div>
    );
  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : Object.entries(value);
  const isCollapsed = collapsed.has(path);
  return (
    <div className={`tn ${isCollapsed ? "col" : ""}`}>
      <button
        className="tt"
        aria-label={`${isCollapsed ? "Expand" : "Collapse"} node`}
        onClick={() =>
          setCollapsed((current) => {
            const next = new Set(current);
            if (next.has(path)) next.delete(path);
            else next.add(path);
            return next;
          })
        }
      >
        <Icon name="chev" size={14} />
      </button>
      {label !== undefined && (
        <span className="t-k">{JSON.stringify(label)}: </span>
      )}
      <span className="t-z">{Array.isArray(value) ? "[" : "{"}</span>
      <span className="cnt t-z">
        {" "}
        {entries.length} {Array.isArray(value) ? "items" : "keys"}{" "}
      </span>
      <div className="tk">
        {entries.map(([key, child]) => (
          <TreeNode
            key={`${path}.${key}`}
            value={child}
            label={key}
            path={`${path}.${key}`}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        ))}
      </div>
      <span className="t-z cl">{Array.isArray(value) ? "]" : "}"}</span>
    </div>
  );
}

function getContainerPaths(
  value: JsonValue,
  path = "$",
  paths: string[] = [],
): string[] {
  if (value !== null && typeof value === "object") {
    paths.push(path);
    const entries = Array.isArray(value)
      ? value.entries()
      : Object.entries(value);
    for (const [key, child] of entries)
      getContainerPaths(child, `${path}.${key}`, paths);
  }
  return paths;
}

function lineNumbers(text: string) {
  const count = Math.max(1, text.split("\n").length);
  return Array.from({ length: count }, (_, index) => index + 1).join("\n");
}

function formatBytes(bytes: number) {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}
