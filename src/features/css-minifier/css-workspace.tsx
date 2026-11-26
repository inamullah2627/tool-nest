"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/design/icon";
import { usePreferences } from "@/components/providers/app-providers";
import {
  getCompressionMetrics,
  getCssMetrics,
  MAX_CSS_FILE_BYTES,
  validateCssFile,
  type CssIndent,
  type CssProcessingOptions,
} from "@/lib/css/processor";

const sample = `/* Card component */
.card {
  display: flex;
  align-items: center;
  padding: 24px;
  margin: 16px;
  background-color: #ffffff;
  border-radius: 12px;
}

.card:hover {
  background-color: #f8fafc;
}`;
const defaults: CssProcessingOptions = {
  indent: 2,
  preserveLicenseComments: true,
};

type Status = "idle" | "minified" | "beautified" | "error";

export function CssWorkspace() {
  const { recordRecent } = usePreferences();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [options, setOptions] = useState(defaults);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [wordWrap, setWordWrap] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [message, setMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const lineNumbers = useRef<HTMLPreElement>(null);
  const inputMetrics = useMemo(() => getCssMetrics(input), [input]);
  const outputMetrics = useMemo(() => getCssMetrics(output), [output]);
  const compression = useMemo(
    () => getCompressionMetrics(input, output),
    [input, output],
  );

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
  const stale = (next = input) => {
    setInput(next);
    setOutput("");
    setStatus("idle");
    setError("");
  };
  const changeOptions = (next: Partial<CssProcessingOptions>) => {
    setOptions((current) => ({ ...current, ...next }));
    setOutput("");
    setStatus("idle");
    setError("");
  };
  const run = (mode: "minify" | "beautify") => {
    if (!input.trim()) {
      setError("Enter CSS before processing.");
      setStatus("error");
      return;
    }
    if (inputMetrics.bytes > MAX_CSS_FILE_BYTES) {
      setError("Input exceeds the 2 MB processing limit.");
      setStatus("error");
      return;
    }
    setProcessing(true);
    setError("");
    const worker = new Worker(
      new URL("../../workers/css-processor.worker.ts", import.meta.url),
      { type: "module" },
    );
    worker.onmessage = (
      event: MessageEvent<{ ok: boolean; output?: string; error?: string }>,
    ) => {
      if (event.data.ok) {
        setOutput(event.data.output ?? "");
        setStatus(mode === "minify" ? "minified" : "beautified");
        recordRecent("css-minifier");
        notify(mode === "minify" ? "CSS minified." : "CSS beautified.");
      } else {
        setOutput("");
        setError(
          event.data.error ??
            "CSS processing failed. Check that the input is valid standard CSS.",
        );
        setStatus("error");
      }
      setProcessing(false);
      worker.terminate();
    };
    worker.onerror = () => {
      setOutput("");
      setError(
        "The browser could not process this CSS. Try a smaller stylesheet.",
      );
      setStatus("error");
      setProcessing(false);
      worker.terminate();
    };
    worker.postMessage({ input, mode, options });
  };
  const paste = async () => {
    try {
      stale(await navigator.clipboard.readText());
    } catch {
      notify(
        "Clipboard access is unavailable. Press Ctrl+V in the editor instead.",
      );
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      notify("CSS copied to clipboard.");
    } catch {
      notify(
        "Clipboard access is unavailable. Select the output and press Ctrl+C.",
      );
    }
  };
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([output], { type: "text/css;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = status === "minified" ? "minified.css" : "beautified.css";
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const upload = async (file?: File) => {
    if (!file) return;
    const validation = validateCssFile(file);
    if (validation) {
      setError(validation);
      setStatus("error");
      return;
    }
    try {
      stale(await file.text());
    } catch {
      setError("The selected CSS file could not be read.");
      setStatus("error");
    }
  };
  const reset = () => {
    setInput("");
    setOutput("");
    setOptions(defaults);
    setStatus("idle");
    setError("");
    setProcessing(false);
    setWordWrap(false);
    setFullscreen(false);
  };

  return (
    <section className="tool-workspace-section css-workspace">
      <div className="wrap">
        <div
          className={`wsp ${fullscreen ? "fs" : ""} ${wordWrap ? "wrp" : ""}`}
        >
          {error && (
            <div className="alert" role="alert">
              <Icon name="alert" size={18} />
              <span>{error}</span>
              <button
                className="ib sm"
                aria-label="Dismiss error"
                onClick={() => {
                  setError("");
                  if (status === "error") setStatus("idle");
                }}
              >
                <Icon name="x" size={16} />
              </button>
            </div>
          )}
          <div className="wtb">
            <button
              className="btn pr"
              disabled={!input.trim() || processing}
              onClick={() => run("minify")}
            >
              <Icon name="min" size={16} />
              {processing ? "Processing…" : "Minify CSS"}
            </button>
            <button
              className="btn"
              disabled={!input.trim() || processing}
              onClick={() => run("beautify")}
            >
              <Icon name="spark" size={16} />
              Beautify CSS
            </button>
            <button className="btn" onClick={reset}>
              <Icon name="rotate" size={16} />
              Reset
            </button>
            <span className="sp" />
            <Switch
              label="Preserve License Comments"
              checked={options.preserveLicenseComments}
              onChange={(value) =>
                changeOptions({ preserveLicenseComments: value })
              }
            />
            <label className="lb">
              Beautify indent{" "}
              <select
                className="sel"
                value={options.indent}
                aria-label="Beautify indentation"
                onChange={(event) =>
                  changeOptions({
                    indent:
                      event.target.value === "tab"
                        ? "tab"
                        : (Number(event.target.value) as CssIndent),
                  })
                }
              >
                <option value="2">2 Spaces</option>
                <option value="4">4 Spaces</option>
                <option value="tab">Tab</option>
              </select>
            </label>
            <Switch
              label="Word Wrap"
              checked={wordWrap}
              onChange={setWordWrap}
            />
          </div>
          <div className="wg">
            <div className="wp">
              <PanelHeader title="CSS Input">
                <IconButton label="Paste" icon="paste" onClick={paste} />
                <IconButton
                  label="Upload CSS File"
                  icon="upload"
                  onClick={() => fileInput.current?.click()}
                />
                <IconButton
                  label="Load Sample"
                  icon="file"
                  onClick={() => stale(sample)}
                />
                <IconButton
                  label="Clear"
                  icon="trash"
                  disabled={!input && !output}
                  onClick={() => stale("")}
                />
                <IconButton
                  label="Fullscreen"
                  icon={fullscreen ? "x" : "fullscreen"}
                  onClick={() => setFullscreen(!fullscreen)}
                />
              </PanelHeader>
              <div className="json-editor input-editor">
                <pre
                  className="line-numbers"
                  ref={lineNumbers}
                  aria-hidden="true"
                >
                  {makeLineNumbers(input)}
                </pre>
                <textarea
                  value={input}
                  onChange={(event) => stale(event.target.value)}
                  onScroll={(event) => {
                    if (lineNumbers.current)
                      lineNumbers.current.scrollTop =
                        event.currentTarget.scrollTop;
                  }}
                  spellCheck={false}
                  autoComplete="off"
                  placeholder="Paste or type your CSS code here..."
                  aria-label="CSS input"
                />
              </div>
              <StatusBar
                metrics={inputMetrics}
                status={status === "error" ? "Invalid CSS" : "Input CSS"}
              />
            </div>
            <div className="wp">
              <PanelHeader
                title={
                  status === "beautified" ? "Beautified CSS" : "Minified CSS"
                }
              >
                <IconButton
                  label="Copy"
                  icon="copy"
                  disabled={!output}
                  onClick={copy}
                />
                <IconButton
                  label="Download CSS"
                  icon="download"
                  disabled={!output}
                  onClick={download}
                />
                <IconButton
                  label="Fullscreen"
                  icon={fullscreen ? "x" : "fullscreen"}
                  onClick={() => setFullscreen(!fullscreen)}
                />
              </PanelHeader>
              <div className="json-editor output-editor" aria-live="polite">
                {!output ? (
                  <div className="pad es0">
                    <span className="ei">
                      <Icon name="min" size={26} />
                    </span>
                    <p>Your processed CSS will appear here.</p>
                    <button className="btn pr" onClick={() => stale(sample)}>
                      Load Sample
                    </button>
                  </div>
                ) : (
                  <HighlightedCss code={output} wrap={wordWrap} />
                )}
              </div>
              <StatusBar
                metrics={
                  output ? outputMetrics : { lines: 0, characters: 0, bytes: 0 }
                }
                status={
                  status === "minified"
                    ? "Minified"
                    : status === "beautified"
                      ? "Beautified"
                      : "Awaiting input"
                }
              />
            </div>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept=".css,text/css"
            hidden
            onChange={(event) => {
              void upload(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </div>
        {status === "minified" && <CompressionResults metrics={compression} />}
        <div className="priv">
          <Icon name="shieldCheck" size={20} />
          <span>
            CSS is processed locally and displayed only as text. It is never
            uploaded, persisted, applied to ToolNest or used to fetch referenced
            URLs. Files are limited to 2 MB.
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

function CompressionResults({
  metrics,
}: {
  metrics: ReturnType<typeof getCompressionMetrics>;
}) {
  const smaller = metrics.bytesSaved > 0;
  const equal = metrics.bytesSaved === 0;
  return (
    <div className="crs">
      <div className="crh">
        <b>Compression Results</b>
        <span className={smaller ? "ok" : ""}>
          <Icon name={smaller ? "check" : "info"} size={14} />
          {smaller
            ? `Smaller by ${metrics.percentage.toFixed(1)}%`
            : equal
              ? "No size change"
              : `Output increased by ${Math.abs(metrics.percentage).toFixed(1)}%`}
        </span>
      </div>
      <div className="compression-stats">
        {[
          ["Original Size", formatBytes(metrics.inputBytes)],
          ["Minified Size", formatBytes(metrics.outputBytes)],
          ["Bytes Saved", `${metrics.bytesSaved.toLocaleString()} B`],
          ["Size Reduction", `${metrics.percentage.toFixed(1)}%`],
        ].map(([label, value]) => (
          <div className="sc" key={label}>
            <div className="lb2">
              <span>{label}</span>
            </div>
            <b>{value}</b>
          </div>
        ))}
      </div>
      {!smaller && (
        <p className="cnote">
          {equal
            ? "This CSS is already compact, so no size reduction was possible."
            : "Conservative processing produced a larger result; keep the original if file size is your priority."}
        </p>
      )}
    </div>
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
        <span className="tag2">CSS</span>
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
function StatusBar({
  metrics,
  status,
}: {
  metrics: ReturnType<typeof getCssMetrics>;
  status: string;
}) {
  return (
    <div className="sbar">
      <span>
        {metrics.lines.toLocaleString()}{" "}
        {metrics.lines === 1 ? "line" : "lines"}
      </span>
      <span>{metrics.characters.toLocaleString()} chars</span>
      <span>{formatBytes(metrics.bytes)}</span>
      <span className={/Minified|Beautified/u.test(status) ? "ok" : ""}>
        {status}
      </span>
    </div>
  );
}
function makeLineNumbers(value: string) {
  return Array.from(
    { length: value ? value.split(/\r\n|\r|\n/u).length : 1 },
    (_, index) => index + 1,
  ).join("\n");
}
function formatBytes(bytes: number) {
  if (Math.abs(bytes) < 1024) return `${bytes.toLocaleString()} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function HighlightedCss({ code, wrap }: { code: string; wrap: boolean }) {
  return (
    <pre
      className={`oc css-output ${wrap ? "wrap" : ""}`}
      aria-label="Read-only CSS output"
    >
      <code>
        {code
          .split(
            /(\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[\da-fA-F]{3,8}\b|@[\w-]+|--[\w-]+|[{}:;])/gu,
          )
          .map((part, index) => (
            <span className={cssTokenClass(part)} key={`${index}-${part}`}>
              {part}
            </span>
          ))}
      </code>
    </pre>
  );
}
function cssTokenClass(token: string) {
  if (/^\/\*/u.test(token)) return "t-z";
  if (/^["']/u.test(token)) return "t-s";
  if (/^#[\da-fA-F]{3,8}$/u.test(token)) return "t-b";
  if (/^@/u.test(token)) return "t-k";
  if (/^--/u.test(token)) return "t-n";
  if (/^[{}:;]$/u.test(token)) return "t-z";
  return "";
}
