"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/design/icon";
import { usePreferences } from "@/components/providers/app-providers";
import {
  ImageDropZone,
  ImageStatGrid,
  ImageWorkspacePanel,
} from "@/components/tools/image-workspace";
import {
  MAX_IMAGE_FILES,
  MAX_IMAGE_PIXELS,
  MAX_IMAGE_SIDE,
  batchReduction,
  compressDecodedImage,
  inspectImageHeader,
  outputFilename,
  reductionPercent,
  validateImageFile,
  type CompressionResult,
  type CompressionSettings,
  type ImageFormat,
} from "@/lib/image/image-compressor";
import { createImageZip } from "@/lib/image/image-zip";

type Status = "ready" | "processing" | "done" | "error";
interface ImageItem {
  id: string;
  file: File;
  url: string;
  width: number;
  height: number;
  format: ImageFormat;
  status: Status;
  progress: number;
  error?: string;
  result?: CompressionResult;
  resultUrl?: string;
}

const defaults: CompressionSettings = {
  outputFormat: "keep",
  quality: 75,
  mode: "quality",
  targetBytes: 500 * 1024,
  resize: false,
  width: 0,
  height: 0,
  preserveAspectRatio: true,
  preventUpscale: true,
  preventLargerOutput: true,
  backgroundColor: "#ffffff",
  suffix: "-compressed",
};

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const sign = bytes < 0 ? "-" : "";
  const absolute = Math.abs(bytes);
  const units = ["B", "KB", "MB"];
  const index = Math.min(Math.floor(Math.log(absolute) / Math.log(1024)), 2);
  return `${sign}${(absolute / 1024 ** index).toFixed(index ? 2 : 0)} ${units[index]}`;
}

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function decode(file: File) {
  if ("createImageBitmap" in window) {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
    return {
      source: bitmap as CanvasImageSource,
      width: bitmap.width,
      height: bitmap.height,
      close: () => bitmap.close(),
    };
  }
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.decoding = "async";
  image.src = url;
  await image.decode();
  return {
    source: image as CanvasImageSource,
    width: image.naturalWidth,
    height: image.naturalHeight,
    close: () => URL.revokeObjectURL(url),
  };
}

function ComparisonView({
  item,
  stale,
  compare,
  zoom,
  mode,
}: {
  item: ImageItem;
  stale: boolean;
  compare: number;
  zoom: number;
  mode: "side" | "slider";
}) {
  const hasOutput = Boolean(item.resultUrl && item.result && !stale);
  return (
    <div
      className={`image-compare-frame ${hasOutput ? "has-output" : ""} is-${mode}`}
      style={
        {
          "--compare": `${compare}%`,
          "--zoom": `${zoom / 100}`,
        } as React.CSSProperties
      }
    >
      <div className="image-compare-pane image-before-pane">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.url} alt={`Original ${item.file.name}`} />
        <span className="before-label">Before</span>
      </div>
      {(hasOutput || mode === "side") && (
        <div className="image-compare-pane image-after-pane">
          {hasOutput ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.resultUrl} alt={`Compressed ${item.file.name}`} />
            </>
          ) : (
            <div className="image-after-placeholder">
              <Icon name="image" size={22} />
              <span>
                {stale
                  ? "Settings changed. Recompress to update this preview."
                  : "Not compressed yet. The compressed image appears here after processing."}
              </span>
            </div>
          )}
          <span className="after-label">After</span>
        </div>
      )}
      {hasOutput && mode === "slider" && (
        <span className="image-compare-divider" aria-hidden="true">
          <i />
        </span>
      )}
    </div>
  );
}

export function ImageCompressorWorkspace() {
  const { recordRecent } = usePreferences();
  const [items, setItems] = useState<ImageItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [settings, setSettings] = useState(defaults);
  const [notice, setNotice] = useState("");
  const [processing, setProcessing] = useState(false);
  const [stale, setStale] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [filenameMode, setFilenameMode] = useState<"keep" | "suffix">("suffix");
  const [targetUnit, setTargetUnit] = useState<"KB" | "MB">("KB");
  const [comparisonMode, setComparisonMode] = useState<"side" | "slider">(
    "side",
  );
  const [compare, setCompare] = useState(50);
  const [zoom, setZoom] = useState(100);
  const [fullscreen, setFullscreen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"reset" | "clear" | null>(
    null,
  );
  const abortRef = useRef<AbortController | null>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(
    () => () => {
      abortRef.current?.abort();
      for (const item of itemsRef.current) {
        URL.revokeObjectURL(item.url);
        if (item.resultUrl && item.resultUrl !== item.url)
          URL.revokeObjectURL(item.resultUrl);
      }
    },
    [],
  );
  useEffect(() => {
    if (!fullscreen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [fullscreen]);

  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  const completed = items.filter(
    (item) => item.result && item.status === "done" && !stale,
  );
  const totals = batchReduction(
    completed.map((item) => ({
      original: item.file.size,
      output: item.result!.blob.size,
    })),
  );

  function markSettings(update: Partial<CompressionSettings>) {
    setSettings((current) => ({ ...current, ...update }));
    if (items.some((item) => item.result)) setStale(true);
  }

  async function addFiles(files: File[]) {
    setNotice("");
    const appendNotice = (message: string) =>
      setNotice((current) => (current ? `${current}\n${message}` : message));
    const remaining = MAX_IMAGE_FILES - items.length;
    if (remaining <= 0)
      return appendNotice("A batch can contain up to 20 images.");
    if (files.length > remaining)
      appendNotice(
        `Only the first ${remaining} image${remaining === 1 ? "" : "s"} were added (20 maximum).`,
      );
    const additions: ImageItem[] = [];
    for (const file of files.slice(0, remaining)) {
      const fileError = validateImageFile(file);
      if (fileError) {
        appendNotice(`${file.name}: ${fileError}`);
        continue;
      }
      try {
        const headerBytes = new Uint8Array(
          await file.slice(0, 128 * 1024).arrayBuffer(),
        );
        const header = inspectImageHeader(headerBytes);
        if (header.error || header.animated || !header.format)
          throw new Error(
            header.error ?? "Animated PNG and WebP images are not supported.",
          );
        const decoded = await decode(file);
        const unsafe =
          decoded.width * decoded.height > MAX_IMAGE_PIXELS ||
          decoded.width > MAX_IMAGE_SIDE ||
          decoded.height > MAX_IMAGE_SIDE;
        decoded.close();
        if (unsafe)
          throw new Error(
            "Image exceeds the 50 megapixel or 16,384 px decoded safety limit.",
          );
        additions.push({
          id: `${Date.now()}-${Math.random()}`,
          file,
          url: URL.createObjectURL(file),
          width: decoded.width,
          height: decoded.height,
          format: header.format,
          status: "ready",
          progress: 0,
        });
      } catch (error) {
        appendNotice(
          `${file.name}: ${error instanceof Error ? error.message : "Could not read this image."}`,
        );
      }
    }
    if (additions.length) {
      setItems((current) => [...current, ...additions]);
      setSelectedId((current) => current || additions[0].id);
      setStale(false);
    }
  }

  function removeItem(id: string) {
    const item = items.find((entry) => entry.id === id);
    if (item) {
      URL.revokeObjectURL(item.url);
      if (item.resultUrl && item.resultUrl !== item.url)
        URL.revokeObjectURL(item.resultUrl);
    }
    const next = items.filter((entry) => entry.id !== id);
    setItems(next);
    if (selectedId === id) setSelectedId(next[0]?.id ?? "");
  }

  async function compress(onlyId?: string) {
    if (!items.length || processing) return;
    setNotice("");
    setProcessing(true);
    setStale(false);
    abortRef.current = new AbortController();
    const targets = onlyId
      ? items.filter((item) => item.id === onlyId)
      : items.filter(
          (item) => stale || !item.result || item.status === "error",
        );
    for (const item of targets) {
      if (abortRef.current.signal.aborted) break;
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? { ...entry, status: "processing", progress: 15, error: undefined }
            : entry,
        ),
      );
      let decoded: Awaited<ReturnType<typeof decode>> | undefined;
      try {
        decoded = await decode(item.file);
        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id ? { ...entry, progress: 45 } : entry,
          ),
        );
        const result = await compressDecodedImage(
          item.file,
          decoded.source,
          decoded.width,
          decoded.height,
          item.format,
          settings,
          abortRef.current.signal,
        );
        decoded.close();
        decoded = undefined;
        const resultUrl = result.retainedOriginal
          ? item.url
          : URL.createObjectURL(result.blob);
        setItems((current) =>
          current.map((entry) => {
            if (entry.id !== item.id) return entry;
            if (entry.resultUrl && entry.resultUrl !== entry.url)
              URL.revokeObjectURL(entry.resultUrl);
            return {
              ...entry,
              result,
              resultUrl,
              status: "done",
              progress: 100,
            };
          }),
        );
      } catch (error) {
        const aborted =
          error instanceof DOMException && error.name === "AbortError";
        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id
              ? {
                  ...entry,
                  status: aborted ? "ready" : "error",
                  progress: 0,
                  error: aborted
                    ? undefined
                    : error instanceof Error
                      ? error.message
                      : "Compression failed.",
                }
              : entry,
          ),
        );
      } finally {
        decoded?.close();
      }
    }
    const cancelled = abortRef.current.signal.aborted;
    if (!cancelled) recordRecent("image-compressor");
    else
      setNotice(
        "Processing cancelled. Completed results remain available; unprocessed images are ready to compress.",
      );
    setProcessing(false);
    abortRef.current = null;
  }

  function clearAll() {
    abortRef.current?.abort();
    items.forEach((item) => {
      URL.revokeObjectURL(item.url);
      if (item.resultUrl && item.resultUrl !== item.url)
        URL.revokeObjectURL(item.resultUrl);
    });
    setItems([]);
    setSelectedId("");
    setNotice("");
    setStale(false);
  }

  function resetAll() {
    clearAll();
    setSettings(defaults);
    setFilenameMode("suffix");
    setTargetUnit("KB");
    setComparisonMode("side");
    setCompare(50);
    setZoom(100);
    setAdvanced(false);
    setConfirmAction(null);
  }

  async function downloadZip() {
    const files = completed.map((item) => ({
      name: outputFilename(
        item.file.name,
        filenameMode === "suffix" ? settings.suffix : "",
        item.result!.format,
      ),
      blob: item.result!.blob,
    }));
    if (!files.length) return;
    triggerDownload(
      await createImageZip(files),
      "toolnest-compressed-images.zip",
    );
  }

  const selectedReduction =
    selected?.result && !stale
      ? reductionPercent(selected.file.size, selected.result.blob.size)
      : 0;
  const pngOutput =
    settings.outputFormat === "png" ||
    (settings.outputFormat === "keep" && selected?.format === "png");
  const resultName = selected?.result
    ? outputFilename(
        selected.file.name,
        filenameMode === "suffix" ? settings.suffix : "",
        selected.result.format,
      )
    : "";
  const canCompress =
    items.length > 0 &&
    !processing &&
    (stale || items.some((item) => !item.result || item.status === "error"));

  return (
    <section className="tool-section image-compressor-section">
      <div className="wrap">
        <ImageDropZone
          active={items.length > 0}
          disabled={processing}
          compact={items.length > 0}
          count={items.length}
          onFiles={addFiles}
        />
        {notice && (
          <div className="image-notice" role="alert">
            <Icon name="alert" size={18} />
            {notice}
          </div>
        )}
        {confirmAction && (
          <div className="image-confirm" role="alert">
            <Icon name="alert" size={18} />
            <span>
              {confirmAction === "reset"
                ? "Reset the tool? This removes all images and results and restores default settings."
                : `Remove all ${items.length} selected ${items.length === 1 ? "image" : "images"} and their results?`}
            </span>
            <button
              className="btn primary"
              onClick={() =>
                confirmAction === "reset"
                  ? resetAll()
                  : (clearAll(), setConfirmAction(null))
              }
            >
              Confirm
            </button>
            <button className="btn" onClick={() => setConfirmAction(null)}>
              Cancel
            </button>
          </div>
        )}
        {items.length > 0 && (
          <section className="image-selected-panel">
            <header>
              <div>
                <b>Selected Images</b>
                <span>{items.length} of 20</span>
              </div>
              <button
                className="btn"
                disabled={processing}
                onClick={() => setConfirmAction("clear")}
              >
                <Icon name="trash" size={15} />
                Remove All
              </button>
            </header>
            <div className="image-file-list" aria-label="Selected images">
              {items.map((item) => (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={item.id === selected?.id}
                  className={item.id === selected?.id ? "active" : ""}
                  onClick={() => setSelectedId(item.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedId(item.id);
                    }
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt="" />
                  <span>
                    <b>{item.file.name}</b>
                    <small>
                      {formatBytes(item.file.size)} · {item.width}×{item.height}
                    </small>
                  </span>
                  <em>
                    {stale && item.result
                      ? "Outdated"
                      : item.status === "processing"
                        ? `${item.progress}%`
                        : item.status === "done" && !stale
                          ? item.result?.retainedOriginal
                            ? "Already Optimized"
                            : "Compressed"
                          : item.status === "error"
                            ? "Failed"
                            : "Queued"}
                  </em>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`Remove ${item.file.name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      removeItem(item.id);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        event.stopPropagation();
                        removeItem(item.id);
                      }
                    }}
                  >
                    <Icon name="x" size={16} />
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
        <div className="image-workspace">
          <div className="image-settings-column">
            <ImageWorkspacePanel
              title="Compression Settings"
              className="image-settings-panel"
            >
              <fieldset className="image-presets">
                <legend>Compression Preset</legend>
                {(
                  [
                    [
                      90,
                      "High Quality",
                      "Prioritize visual quality. Suggested quality: 90%.",
                    ],
                    [
                      75,
                      "Balanced",
                      "Balance image quality and file size. Suggested quality: 75%.",
                    ],
                    [
                      50,
                      "Maximum Compression",
                      "Prioritize smaller file sizes. Suggested quality: 50%.",
                    ],
                  ] as const
                ).map(([quality, label, note]) => (
                  <button
                    key={quality}
                    disabled={pngOutput}
                    aria-pressed={
                      settings.quality === quality &&
                      settings.mode === "quality"
                    }
                    onClick={() => markSettings({ quality, mode: "quality" })}
                  >
                    <b>{label}</b>
                    <small>{note}</small>
                  </button>
                ))}
              </fieldset>
              <div className="image-range">
                <label htmlFor="image-quality">
                  <span>
                    Quality{" "}
                    {!pngOutput && ![50, 75, 90].includes(settings.quality) && (
                      <em className="image-custom-tag">Custom</em>
                    )}
                  </span>
                  <b>{pngOutput ? "N/A" : `${settings.quality}%`}</b>
                </label>
                <input
                  id="image-quality"
                  type="range"
                  min="10"
                  max="100"
                  value={settings.quality}
                  disabled={pngOutput || settings.mode === "target"}
                  onChange={(event) =>
                    markSettings({
                      quality: Number(event.target.value),
                      mode: "quality",
                    })
                  }
                />
                <small>
                  {pngOutput
                    ? "PNG uses lossless pixel encoding; quality does not affect it."
                    : settings.mode === "target"
                      ? "Target File Size mode chooses quality automatically for JPG and WebP."
                      : "Quality affects lossy JPG and WebP output; it is not a guaranteed file-size reduction."}
                </small>
              </div>
              <fieldset className="image-choice">
                <legend>Compression Method</legend>
                <button
                  aria-pressed={settings.mode === "quality"}
                  onClick={() => markSettings({ mode: "quality" })}
                >
                  Quality
                </button>
                <button
                  aria-pressed={settings.mode === "target"}
                  onClick={() => markSettings({ mode: "target" })}
                >
                  Target Size
                </button>
              </fieldset>
              {settings.mode === "target" && (
                <label className="image-field">
                  Target File Size
                  <span className="image-target-input">
                    <input
                      className="inp"
                      type="number"
                      min="0.01"
                      step={targetUnit === "KB" ? 1 : 0.01}
                      value={
                        targetUnit === "KB"
                          ? Math.round(settings.targetBytes / 1024)
                          : Number((settings.targetBytes / 1048576).toFixed(2))
                      }
                      onChange={(event) =>
                        markSettings({
                          targetBytes:
                            Math.max(1, Number(event.target.value)) *
                            (targetUnit === "KB" ? 1024 : 1048576),
                        })
                      }
                    />
                    <select
                      className="inp"
                      value={targetUnit}
                      onChange={(event) =>
                        setTargetUnit(event.target.value as "KB" | "MB")
                      }
                    >
                      <option>KB</option>
                      <option>MB</option>
                    </select>
                  </span>
                  <small>
                    Exact target sizes may not be achievable. JPG and WebP never
                    go below 10% quality; PNG cannot be tuned by quality.
                  </small>
                </label>
              )}
              <fieldset className="image-formats">
                <legend>Output Format</legend>
                {(["keep", "jpeg", "png", "webp"] as const).map((format) => (
                  <button
                    key={format}
                    aria-pressed={settings.outputFormat === format}
                    onClick={() => markSettings({ outputFormat: format })}
                  >
                    <b>
                      {format === "keep"
                        ? "Keep Original Format"
                        : format === "jpeg"
                          ? "JPG"
                          : format.toUpperCase()}
                    </b>
                    <small>
                      {
                        {
                          keep: "Each image keeps its own format (JPG, PNG or WebP).",
                          jpeg: "Suitable for photographs and smaller lossy files.",
                          png: "Suitable for lossless storage and transparency.",
                          webp: "Suitable for modern web images with efficient compression.",
                        }[format]
                      }
                    </small>
                  </button>
                ))}
              </fieldset>
              {settings.outputFormat === "jpeg" && (
                <div className="image-jpeg-options">
                  <p>
                    <Icon name="alert" size={16} />
                    JPG does not support transparency. Transparent areas use the
                    selected background.
                  </p>
                  <div>
                    <span>Background</span>
                    {[
                      ["#ffffff", "White"],
                      ["#000000", "Black"],
                      ["#808080", "Gray"],
                    ].map(([color, label]) => (
                      <button
                        key={color}
                        className="chip"
                        aria-pressed={
                          settings.backgroundColor.toLowerCase() === color
                        }
                        onClick={() => markSettings({ backgroundColor: color })}
                      >
                        <i style={{ background: color }} />
                        {label}
                      </button>
                    ))}
                    <label className="chip">
                      <i style={{ background: settings.backgroundColor }} />
                      Custom
                      <input
                        type="color"
                        value={settings.backgroundColor}
                        onChange={(event) =>
                          markSettings({ backgroundColor: event.target.value })
                        }
                      />
                    </label>
                  </div>
                </div>
              )}
              <button
                className="image-advanced-toggle"
                aria-expanded={advanced}
                onClick={() => setAdvanced(!advanced)}
              >
                Advanced Settings <Icon name="chev" size={17} />
              </button>
              {advanced && (
                <div className="image-advanced">
                  <label className="image-check">
                    <input
                      type="checkbox"
                      checked={settings.resize}
                      onChange={(event) =>
                        markSettings({ resize: event.target.checked })
                      }
                    />{" "}
                    Resize images
                  </label>
                  {settings.resize && (
                    <div className="image-size-fields">
                      <label>
                        Maximum Width (px)
                        <input
                          className="inp"
                          type="number"
                          min="1"
                          max={MAX_IMAGE_SIDE}
                          placeholder="Auto"
                          value={settings.width || ""}
                          onChange={(event) =>
                            markSettings({ width: Number(event.target.value) })
                          }
                        />
                      </label>
                      <label>
                        Maximum Height (px)
                        <input
                          className="inp"
                          type="number"
                          min="1"
                          max={MAX_IMAGE_SIDE}
                          placeholder="Auto"
                          value={settings.height || ""}
                          onChange={(event) =>
                            markSettings({ height: Number(event.target.value) })
                          }
                        />
                      </label>
                    </div>
                  )}
                  {settings.resize && (
                    <>
                      <label className="image-check">
                        <input
                          type="checkbox"
                          checked={settings.preserveAspectRatio}
                          onChange={(event) =>
                            markSettings({
                              preserveAspectRatio: event.target.checked,
                            })
                          }
                        />{" "}
                        Preserve aspect ratio
                      </label>
                      <label className="image-check">
                        <input
                          type="checkbox"
                          checked={settings.preventUpscale}
                          onChange={(event) =>
                            markSettings({
                              preventUpscale: event.target.checked,
                            })
                          }
                        />{" "}
                        Prevent upscaling
                      </label>
                    </>
                  )}
                  <div className="image-metadata-note">
                    <Icon name="info" size={18} />
                    <p>
                      <b>Metadata:</b> re-encoding usually removes EXIF and GPS
                      information. An unchanged Already Optimized file keeps its
                      original metadata.
                    </p>
                  </div>
                  <fieldset className="image-choice">
                    <legend>Output Filename</legend>
                    <button
                      aria-pressed={filenameMode === "keep"}
                      onClick={() => setFilenameMode("keep")}
                    >
                      Keep Original Filename
                    </button>
                    <button
                      aria-pressed={filenameMode === "suffix"}
                      onClick={() => setFilenameMode("suffix")}
                    >
                      Add Filename Suffix
                    </button>
                  </fieldset>
                  {filenameMode === "suffix" && (
                    <label className="image-field">
                      Filename suffix
                      <input
                        className="inp"
                        value={settings.suffix}
                        maxLength={40}
                        onChange={(event) =>
                          markSettings({ suffix: event.target.value })
                        }
                      />
                      <small>
                        {selected
                          ? `${selected.file.name} → ${selected.file.name.replace(/\.[^.]+$/, "")}${settings.suffix}.${selected.result ? (selected.result.format === "jpeg" ? "jpg" : selected.result.format) : "jpg"}`
                          : `photo.jpg → photo${settings.suffix}.jpg`}
                      </small>
                    </label>
                  )}
                  <label className="image-check">
                    <input
                      type="checkbox"
                      checked={settings.preventLargerOutput}
                      onChange={(event) =>
                        markSettings({
                          preventLargerOutput: event.target.checked,
                        })
                      }
                    />{" "}
                    Prevent Larger Output
                  </label>
                  <small className="image-advanced-help">
                    If compression would make a file larger without a format or
                    size change, keep the original as Already Optimized.
                  </small>
                </div>
              )}
              {stale && (
                <div className="image-stale">
                  <Icon name="info" size={17} />
                  Settings changed. Compress again to update results.
                </div>
              )}
            </ImageWorkspacePanel>
            <ImageWorkspacePanel
              title="Actions"
              className="image-actions-panel"
            >
              {processing && (
                <div
                  className="image-processing-progress"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(
                    items.reduce((sum, item) => sum + item.progress, 0) /
                      Math.max(items.length, 1),
                  )}
                >
                  <div>
                    <span>Compressing images</span>
                    <b>
                      {Math.round(
                        items.reduce((sum, item) => sum + item.progress, 0) /
                          Math.max(items.length, 1),
                      )}
                      %
                    </b>
                  </div>
                  <i>
                    <b
                      style={{
                        width: `${Math.round(items.reduce((sum, item) => sum + item.progress, 0) / Math.max(items.length, 1))}%`,
                      }}
                    />
                  </i>
                </div>
              )}
              <div className="image-actions">
                <button
                  className="btn primary"
                  disabled={!canCompress}
                  onClick={() => compress()}
                >
                  {processing
                    ? "Compressing…"
                    : `Compress ${items.length > 1 ? `${items.length} Images` : "Image"}`}
                </button>
                {processing ? (
                  <button
                    className="btn"
                    onClick={() => abortRef.current?.abort()}
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    className="btn"
                    onClick={() => {
                      if (items.length || notice) setConfirmAction("reset");
                      else resetAll();
                    }}
                  >
                    Reset
                  </button>
                )}
                <button
                  className="btn"
                  disabled={!selected?.result || stale}
                  onClick={() =>
                    selected?.result &&
                    triggerDownload(selected.result.blob, resultName)
                  }
                >
                  <Icon name="download" size={16} />
                  Download Image
                </button>
                <button
                  className="btn"
                  disabled={completed.length < 2}
                  onClick={downloadZip}
                >
                  <Icon name="download" size={16} />
                  Download All as ZIP
                  {completed.length > 1 ? ` (${completed.length})` : ""}
                </button>
              </div>
              <p className="image-action-help">
                {!items.length
                  ? "Select images to enable compression."
                  : stale
                    ? "Settings changed. Compress again to update results."
                    : completed.length === items.length
                      ? "All images are compressed with the current settings."
                      : `${items.length - completed.length} of ${items.length} ${items.length === 1 ? "image is" : "images are"} ready to compress.`}
              </p>
            </ImageWorkspacePanel>
          </div>
          <div className="image-results-column">
            <ImageWorkspacePanel
              title="Image Comparison"
              action={
                selected ? (
                  <span className="image-panel-tag">{selected.file.name}</span>
                ) : undefined
              }
            >
              <div className="image-comparison">
                <div className="image-preview-toolbar">
                  <div className="image-view-modes">
                    <button
                      aria-pressed={comparisonMode === "side"}
                      onClick={() => setComparisonMode("side")}
                    >
                      Side-by-Side
                    </button>
                    <button
                      aria-pressed={comparisonMode === "slider"}
                      onClick={() => setComparisonMode("slider")}
                    >
                      Before / After Slider
                    </button>
                  </div>
                  <span />
                  <div>
                    <button
                      className="ib"
                      aria-label="Zoom out"
                      disabled={!selected || zoom <= 25}
                      onClick={() => setZoom(Math.max(25, zoom - 25))}
                    >
                      −
                    </button>
                    <b>{zoom}%</b>
                    <button
                      className="ib"
                      aria-label="Zoom in"
                      disabled={!selected || zoom >= 400}
                      onClick={() => setZoom(Math.min(400, zoom + 25))}
                    >
                      +
                    </button>
                    <button
                      className="ib"
                      aria-label="Fit to view"
                      disabled={!selected}
                      onClick={() => setZoom(100)}
                    >
                      <Icon name="fullscreen" size={16} />
                    </button>
                    <button
                      className="ib"
                      aria-label="Fullscreen preview"
                      disabled={!selected}
                      onClick={() => setFullscreen(true)}
                    >
                      <Icon name="maximize" size={16} />
                    </button>
                  </div>
                </div>
                {selected ? (
                  <ComparisonView
                    item={selected}
                    stale={stale}
                    compare={compare}
                    zoom={zoom}
                    mode={comparisonMode}
                  />
                ) : (
                  <div className="image-empty">
                    <Icon name="image" size={42} />
                    <b>Your preview will appear here</b>
                    <span>
                      Add an image to compare the original and compressed
                      result.
                    </span>
                  </div>
                )}
                <div className="image-preview-controls">
                  {comparisonMode === "slider" && (
                    <label>
                      Compare{" "}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={compare}
                        disabled={!selected?.result || stale}
                        onChange={(event) =>
                          setCompare(Number(event.target.value))
                        }
                      />
                    </label>
                  )}
                  <span>
                    {selected?.result && !stale
                      ? `Original ${formatBytes(selected.file.size)} · Compressed ${formatBytes(selected.result.blob.size)}`
                      : selected
                        ? "Compress this image to compare before and after."
                        : "Select an image to begin."}
                  </span>
                </div>
              </div>
            </ImageWorkspacePanel>
            <ImageWorkspacePanel
              title="Compression Statistics"
              action={
                <span
                  className={`image-panel-tag ${selected ? "" : "is-draft"}`}
                >
                  {selected?.result && !stale
                    ? "Actual result"
                    : selected
                      ? "Pending"
                      : "Illustrative"}
                </span>
              }
            >
              <ImageStatGrid
                items={[
                  [
                    "Original Size",
                    selected ? formatBytes(selected.file.size) : "2.40 MB",
                  ],
                  [
                    "Compressed Size",
                    selected?.result && !stale
                      ? formatBytes(selected.result.blob.size)
                      : selected
                        ? "—"
                        : "720 KB",
                  ],
                  [
                    "Space Saved",
                    selected?.result && !stale
                      ? formatBytes(
                          selected.file.size - selected.result.blob.size,
                        )
                      : selected
                        ? "—"
                        : "1.68 MB",
                    selectedReduction >= 0 ? "good" : "warn",
                  ],
                  [
                    "Size Reduction",
                    selected?.result && !stale
                      ? `${selectedReduction.toFixed(1)}%`
                      : selected
                        ? "—"
                        : "70%",
                    selectedReduction >= 0 ? "good" : "warn",
                  ],
                ]}
              />
              <div className="image-size-bars">
                <div>
                  <span>Original</span>
                  <i>
                    <b style={{ width: "100%" }} />
                  </i>
                  <em>
                    {selected ? formatBytes(selected.file.size) : "2.40 MB"}
                  </em>
                </div>
                <div>
                  <span>Compressed</span>
                  <i>
                    <b
                      style={{
                        width:
                          selected?.result && !stale
                            ? `${Math.min(100, (selected.result.blob.size / Math.max(selected.file.size, selected.result.blob.size)) * 100)}%`
                            : selected
                              ? "0%"
                              : "29%",
                      }}
                    />
                  </i>
                  <em>
                    {selected?.result && !stale
                      ? formatBytes(selected.result.blob.size)
                      : selected
                        ? "—"
                        : "720 KB"}
                  </em>
                </div>
              </div>
              {!selected && (
                <p className="image-result-note">
                  Illustrative example only, not a result from your images. Real
                  values appear after compression.
                </p>
              )}
              {selected && !selected.result && !stale && (
                <div className="image-result-placeholder">
                  <Icon name="info" size={24} />
                  <b>No results yet</b>
                  <span>Select Compress Image to see real file sizes.</span>
                </div>
              )}
              {selected && stale && (
                <div className="image-result-placeholder">
                  <Icon name="alert" size={24} />
                  <b>Results are outdated</b>
                  <span>
                    Settings changed. Select Compress Images to update the
                    result.
                  </span>
                </div>
              )}
              {selected?.result?.retainedOriginal && !stale && (
                <p className="image-result-note">
                  <Icon name="info" size={15} /> Already optimized: the encoded
                  file was larger, so the original was retained unchanged.
                </p>
              )}
              {selected?.result &&
                !stale &&
                !selected.result.retainedOriginal &&
                selected.result.blob.size < selected.file.size && (
                  <p className="image-result-note is-success">
                    <Icon name="check" size={15} />
                    Compression reduced this image by{" "}
                    {formatBytes(
                      selected.file.size - selected.result.blob.size,
                    )}{" "}
                    ({selectedReduction.toFixed(1)}%).
                  </p>
                )}
              {selected?.result &&
                !stale &&
                selected.result.format !== selected.format && (
                  <p className="image-result-note">
                    <Icon name="info" size={15} />
                    Converted from {selected.format.toUpperCase()} to{" "}
                    {selected.result.format.toUpperCase()}.
                  </p>
                )}
              {selected?.result && !stale && (
                <p className="image-result-note">
                  <Icon name="info" size={15} />
                  Re-encoding removes embedded metadata such as EXIF and GPS
                  data.
                </p>
              )}
              {selected?.result && !selected.result.targetReached && !stale && (
                <p className="image-result-note">
                  The target size could not be reached at the safe minimum
                  quality.
                </p>
              )}
              {completed.length > 1 && (
                <p className="image-batch-total">
                  Batch: {formatBytes(totals.original)} →{" "}
                  {formatBytes(totals.output)} ({totals.percent.toFixed(1)}%
                  weighted reduction)
                </p>
              )}
              {selected?.status === "error" && (
                <button className="btn" onClick={() => compress(selected.id)}>
                  Retry
                </button>
              )}
              {selected?.error && (
                <p className="image-error">{selected.error}</p>
              )}
            </ImageWorkspacePanel>
            {items.length > 1 && (
              <ImageWorkspacePanel title="Batch Summary">
                <ImageStatGrid
                  items={[
                    ["Total Images", String(items.length)],
                    [
                      "Successfully Compressed",
                      String(
                        completed.filter(
                          (item) => !item.result?.retainedOriginal,
                        ).length,
                      ),
                    ],
                    [
                      "Already Optimized",
                      String(
                        completed.filter(
                          (item) => item.result?.retainedOriginal,
                        ).length,
                      ),
                    ],
                    [
                      "Failed Images",
                      String(
                        items.filter((item) => item.status === "error").length,
                      ),
                    ],
                    [
                      "Total Original Size",
                      completed.length ? formatBytes(totals.original) : "—",
                    ],
                    [
                      "Total Output Size",
                      completed.length ? formatBytes(totals.output) : "—",
                    ],
                    [
                      "Total Space Saved",
                      completed.length ? formatBytes(totals.saved) : "—",
                      totals.saved >= 0 ? "good" : "warn",
                    ],
                    [
                      "Overall Reduction",
                      completed.length ? `${totals.percent.toFixed(1)}%` : "—",
                      totals.percent >= 0 ? "good" : "warn",
                    ],
                  ]}
                />
                <p className="image-result-note">
                  Overall reduction uses total bytes from current results, not
                  an average of percentages.
                </p>
              </ImageWorkspacePanel>
            )}
          </div>
        </div>
        <div className="image-privacy">
          <Icon name="shieldCheck" size={20} />
          <div>
            <b>Your images stay private</b>
            <span>
              Everything is processed locally in your browser. Files are never
              uploaded or saved by ToolNest.
            </span>
          </div>
        </div>
      </div>
      {fullscreen && selected && (
        <div
          className="image-fullscreen"
          role="dialog"
          aria-modal="true"
          aria-label="Image comparison preview"
        >
          <button
            className="ib"
            aria-label="Close fullscreen"
            onClick={() => setFullscreen(false)}
          >
            <Icon name="x" />
          </button>
          <ComparisonView
            item={selected}
            stale={stale}
            compare={compare}
            zoom={zoom}
            mode={comparisonMode}
          />
        </div>
      )}
    </section>
  );
}
