"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/design/icon";
import { usePreferences } from "@/components/providers/app-providers";
import {
  getHtmlMetrics,
  getSizeReduction,
  MAX_HTML_FILE_BYTES,
  validateHtmlFile,
  type HtmlFormatOptions,
  type HtmlIndent,
  type HtmlWrapLength,
} from "@/lib/html/processor";

const sample =
  '<div class="container"><h1>Hello ToolNest</h1><p>Format your HTML code easily.</p><ul><li>Fast</li><li>Free</li><li>Simple</li></ul></div>';
const defaults: HtmlFormatOptions = {
  indent: 2,
  wrapLength: 0,
  preserveLineBreaks: false,
  indentInnerHtml: true,
  formatEmbedded: true,
};

export function HtmlWorkspace() {
  const { recordRecent } = usePreferences();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [options, setOptions] = useState(defaults);
  const [status, setStatus] = useState<
    "idle" | "formatted" | "minified" | "error"
  >("idle");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [wordWrap, setWordWrap] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [message, setMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const inputLines = useRef<HTMLPreElement>(null);
  const inputMetrics = useMemo(() => getHtmlMetrics(input), [input]);
  const outputMetrics = useMemo(() => getHtmlMetrics(output), [output]);
  const reduction = status === "minified" ? getSizeReduction(input, output) : 0;

  useEffect(() => {
    const close = (event: KeyboardEvent) =>
      event.key === "Escape" && setFullscreen(false);
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);

  const showMessage = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2400);
  };
  const stale = (next = input) => {
    setInput(next);
    setOutput("");
    setStatus("idle");
    setError("");
  };
  const changeOptions = (next: Partial<HtmlFormatOptions>) => {
    setOptions((current) => ({ ...current, ...next }));
    setOutput("");
    setStatus("idle");
    setError("");
  };

  const run = (mode: "format" | "minify") => {
    if (!input.trim()) {
      setError("Enter HTML before processing.");
      setStatus("error");
      return;
    }
    if (inputMetrics.bytes > MAX_HTML_FILE_BYTES) {
      setError("Input exceeds the 2 MB processing limit.");
      setOutput("");
      setStatus("error");
      return;
    }
    setProcessing(true);
    setError("");
    const worker = new Worker(
      new URL("../../workers/html-processor.worker.ts", import.meta.url),
      { type: "module" },
    );
    worker.onmessage = (
      event: MessageEvent<{ ok: boolean; output?: string; error?: string }>,
    ) => {
      if (event.data.ok) {
        setOutput(event.data.output ?? "");
        setStatus(mode === "format" ? "formatted" : "minified");
        recordRecent("html-formatter");
        showMessage(mode === "format" ? "HTML formatted." : "HTML minified.");
      } else {
        setOutput("");
        setError(event.data.error ?? "HTML processing failed.");
        setStatus("error");
      }
      setProcessing(false);
      worker.terminate();
    };
    worker.onerror = () => {
      setOutput("");
      setError(
        "The browser could not process this HTML. Try a smaller document.",
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
      showMessage(
        "Clipboard access is unavailable. Press Ctrl+V in the editor instead.",
      );
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      showMessage("HTML copied to clipboard.");
    } catch {
      showMessage("Clipboard access is unavailable.");
    }
  };
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([output], { type: "text/html;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download =
      status === "minified" ? "minified.html" : "formatted.html";
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const upload = async (file?: File) => {
    if (!file) return;
    const validation = validateHtmlFile(file);
    if (validation) {
      setError(validation);
      setStatus("error");
      return;
    }
    try {
      stale(await file.text());
    } catch {
      setError("The selected file could not be read.");
      setStatus("error");
    }
  };
  const reset = () => {
    setInput("");
    setOutput("");
    setOptions(defaults);
    setStatus("idle");
    setError("");
    setWordWrap(false);
    setAdvanced(false);
    setFullscreen(false);
  };

  return (
    <section className="tool-workspace-section html-workspace">
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
              onClick={() => run("format")}
            >
              <Icon name="spark" size={16} />
              {processing ? "Processing…" : "Format HTML"}
            </button>
            <button
              className="btn"
              disabled={!input.trim() || processing}
              onClick={() => run("minify")}
            >
              <Icon name="min" size={16} />
              Minify HTML
            </button>
            <button className="btn" onClick={reset}>
              <Icon name="rotate" size={16} />
              Reset
            </button>
            <span className="sp" />
            <label className="lb">
              Indent{" "}
              <select
                className="sel"
                value={options.indent}
                aria-label="Indentation"
                onChange={(event) =>
                  changeOptions({
                    indent:
                      event.target.value === "tab"
                        ? "tab"
                        : (Number(event.target.value) as HtmlIndent),
                  })
                }
              >
                <option value="2">2 Spaces</option>
                <option value="4">4 Spaces</option>
                <option value="tab">Tab</option>
              </select>
            </label>
            <label className="lb">
              Line wrap{" "}
              <select
                className="sel"
                value={options.wrapLength}
                aria-label="Line wrap"
                onChange={(event) =>
                  changeOptions({
                    wrapLength: Number(event.target.value) as HtmlWrapLength,
                  })
                }
              >
                <option value="0">No Wrap</option>
                <option value="80">80 Characters</option>
                <option value="120">120 Characters</option>
              </select>
            </label>
            <Switch
              label="Word Wrap"
              checked={wordWrap}
              onChange={setWordWrap}
            />
            <button
              className="btn"
              aria-expanded={advanced}
              onClick={() => setAdvanced(!advanced)}
            >
              <Icon name="sliders" size={16} />
              Advanced Options
            </button>
          </div>
          {advanced && (
            <div className="html-advanced">
              <Switch
                label="Preserve Existing Line Breaks"
                checked={options.preserveLineBreaks}
                onChange={(value) =>
                  changeOptions({ preserveLineBreaks: value })
                }
              />
              <Switch
                label="Indent Inner HTML"
                checked={options.indentInnerHtml}
                onChange={(value) => changeOptions({ indentInnerHtml: value })}
              />
              <Switch
                label="Format Inline CSS and JavaScript"
                checked={options.formatEmbedded}
                onChange={(value) => changeOptions({ formatEmbedded: value })}
              />
            </div>
          )}
          <div className="wg">
            <div className="wp">
              <PanelHeader title="HTML Input">
                <IconButton label="Paste" icon="paste" onClick={paste} />
                <IconButton
                  label="Upload HTML File"
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
                  ref={inputLines}
                  aria-hidden="true"
                >
                  {lineNumbers(input)}
                </pre>
                <textarea
                  value={input}
                  onChange={(event) => stale(event.target.value)}
                  onScroll={(event) => {
                    if (inputLines.current)
                      inputLines.current.scrollTop =
                        event.currentTarget.scrollTop;
                  }}
                  spellCheck={false}
                  autoComplete="off"
                  placeholder="Paste or type your HTML code here..."
                  aria-label="HTML input"
                />
              </div>
              <StatusBar
                metrics={inputMetrics}
                status={status === "error" ? "Processing failed" : "Input HTML"}
              />
            </div>
            <div className="wp">
              <PanelHeader title="Formatted HTML">
                <IconButton
                  label="Copy"
                  icon="copy"
                  disabled={!output}
                  onClick={copy}
                />
                <IconButton
                  label="Download HTML"
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
                      <Icon name="code" size={26} />
                    </span>
                    <p>Your formatted HTML will appear here.</p>
                    <button className="btn pr" onClick={() => stale(sample)}>
                      Load Sample
                    </button>
                  </div>
                ) : (
                  <HighlightedHtml code={output} wrap={wordWrap} />
                )}
              </div>
              <StatusBar
                metrics={
                  output ? outputMetrics : { lines: 0, characters: 0, bytes: 0 }
                }
                status={
                  status === "formatted"
                    ? "Formatted"
                    : status === "minified"
                      ? `Minified${reduction ? ` · ${reduction.toFixed(1)}% smaller` : ""}`
                      : "Awaiting input"
                }
              />
            </div>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept=".html,.htm,text/html,application/xhtml+xml"
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
            Processing happens locally in your browser. HTML is never uploaded,
            rendered or executed. Files are limited to 2 MB.
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
        <span className="tag2">HTML</span>
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
  onClick: () => void | Promise<void>;
  disabled?: boolean;
}) {
  return (
    <button
      className="ib sm"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={() => void onClick()}
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
  metrics: { lines: number; characters: number; bytes: number };
  status: string;
}) {
  return (
    <div className="sbar">
      <span>
        {metrics.lines} {metrics.lines === 1 ? "line" : "lines"}
      </span>
      <span>{metrics.characters.toLocaleString()} chars</span>
      <span>{formatBytes(metrics.bytes)}</span>
      <span
        className={
          status.startsWith("Formatted") || status.startsWith("Minified")
            ? "ok"
            : status.includes("failed")
              ? "er"
              : ""
        }
      >
        {status}
      </span>
    </div>
  );
}
function HighlightedHtml({ code, wrap }: { code: string; wrap: boolean }) {
  return (
    <pre
      className={`oc code-output ${wrap ? "wrap" : ""}`}
      aria-label="Read-only HTML output"
    >
      {code.split("\n").map((line, index) => (
        <span className="code-line" key={`${index}-${line}`}>
          <span className="line-number">{index + 1}</span>
          <code>{highlightHtml(line)}</code>
        </span>
      ))}
    </pre>
  );
}
function highlightHtml(line: string) {
  const parts = line.split(/(<!--[\s\S]*?-->|<![^>]*>|<\/?[A-Za-z][^>]*>)/gu);
  return parts.filter(Boolean).map((part, index) => {
    if (!part.startsWith("<")) return <span key={index}>{part}</span>;
    if (part.startsWith("<!--") || part.startsWith("<!"))
      return (
        <span className="t-z" key={index}>
          {part}
        </span>
      );
    const tokens = part
      .split(/("[^"]*"|'[^']*'|[\w:@.-]+|\s+|.)/gu)
      .filter(Boolean);
    return (
      <span key={index}>
        {tokens.map((token, tokenIndex) => (
          <span
            className={
              /^['"]/.test(token)
                ? "t-s"
                : /^[A-Za-z_:][\w:.-]*$/u.test(token)
                  ? tokenIndex <= 2
                    ? "t-k"
                    : "t-n"
                  : "t-z"
            }
            key={`${tokenIndex}-${token}`}
          >
            {token}
          </span>
        ))}
      </span>
    );
  });
}
function lineNumbers(text: string) {
  return Array.from(
    { length: Math.max(1, text ? text.split("\n").length : 1) },
    (_, index) => index + 1,
  ).join("\n");
}
function formatBytes(bytes: number) {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}
