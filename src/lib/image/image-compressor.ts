export const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
export const MAX_IMAGE_FILES = 20;
export const MAX_IMAGE_PIXELS = 50_000_000;
export const MAX_IMAGE_SIDE = 16_384;

export type ImageFormat = "jpeg" | "png" | "webp";
export type OutputFormat = "keep" | ImageFormat;

export interface CompressionSettings {
  outputFormat: OutputFormat;
  quality: number;
  mode: "quality" | "target";
  targetBytes: number;
  resize: boolean;
  width: number;
  height: number;
  preserveAspectRatio: boolean;
  preventUpscale: boolean;
  preventLargerOutput: boolean;
  backgroundColor: string;
  suffix: string;
}

export interface ImageHeader {
  format?: ImageFormat;
  animated: boolean;
  error?: string;
}

export interface CompressionResult {
  blob: Blob;
  width: number;
  height: number;
  format: ImageFormat;
  retainedOriginal: boolean;
  targetReached: boolean;
}

const JPEG = [0xff, 0xd8, 0xff];
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function startsWith(bytes: Uint8Array, signature: number[]) {
  return signature.every((value, index) => bytes[index] === value);
}

function ascii(bytes: Uint8Array, start: number, length: number) {
  return String.fromCharCode(...bytes.slice(start, start + length));
}

export function inspectImageHeader(bytes: Uint8Array): ImageHeader {
  if (startsWith(bytes, JPEG)) return { format: "jpeg", animated: false };
  if (startsWith(bytes, PNG)) {
    return {
      format: "png",
      animated: ascii(bytes, 0, Math.min(bytes.length, 1024)).includes("acTL"),
    };
  }
  if (ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 4) === "WEBP") {
    let animated = false;
    for (let index = 12; index + 8 <= bytes.length;) {
      const type = ascii(bytes, index, 4);
      const size =
        bytes[index + 4] |
        (bytes[index + 5] << 8) |
        (bytes[index + 6] << 16) |
        (bytes[index + 7] << 24);
      if (type === "ANIM") animated = true;
      if (type === "VP8X" && index + 8 < bytes.length)
        animated ||= Boolean(bytes[index + 8] & 0x02);
      index += 8 + Math.max(0, size) + (size % 2);
    }
    return { format: "webp", animated };
  }
  if (ascii(bytes, 0, 3) === "GIF")
    return {
      animated: true,
      error:
        "GIF files are not supported. Animated images are never flattened silently.",
    };
  return {
    animated: false,
    error: "Unsupported or corrupted file. Choose a JPG, PNG or WebP image.",
  };
}

export function validateImageFile(file: Pick<File, "name" | "size">) {
  if (file.size <= 0) return "The selected file is empty.";
  if (file.size > MAX_IMAGE_BYTES)
    return "Each image must be 20 MB or smaller.";
  if (!/\.(?:jpe?g|png|webp)$/i.test(file.name))
    return "Choose a JPG, JPEG, PNG or WebP image.";
  return undefined;
}

export function calculateOutputDimensions(
  originalWidth: number,
  originalHeight: number,
  settings: Pick<
    CompressionSettings,
    "resize" | "width" | "height" | "preserveAspectRatio" | "preventUpscale"
  >,
) {
  if (!settings.resize) return { width: originalWidth, height: originalHeight };
  let width = Math.max(1, Math.round(settings.width || originalWidth));
  let height = Math.max(1, Math.round(settings.height || originalHeight));
  if (settings.preserveAspectRatio) {
    const scale = Math.min(width / originalWidth, height / originalHeight);
    const safeScale = settings.preventUpscale ? Math.min(scale, 1) : scale;
    width = Math.max(1, Math.round(originalWidth * safeScale));
    height = Math.max(1, Math.round(originalHeight * safeScale));
  } else if (settings.preventUpscale) {
    width = Math.min(width, originalWidth);
    height = Math.min(height, originalHeight);
  }
  return { width, height };
}

export function mimeFor(format: ImageFormat) {
  return `image/${format}`;
}

export function extensionFor(format: ImageFormat) {
  return format === "jpeg" ? "jpg" : format;
}

export function outputFilename(
  name: string,
  suffix: string,
  format: ImageFormat,
) {
  const stem = name.replace(/\.[^.]+$/, "") || "image";
  const safeSuffix = suffix.replace(/[\\/:*?"<>|]/g, "");
  return `${stem}${safeSuffix}.${extensionFor(format)}`;
}

export function reductionPercent(original: number, output: number) {
  if (original <= 0) return 0;
  return ((original - output) / original) * 100;
}

export function batchReduction(
  items: Array<{ original: number; output: number }>,
) {
  const original = items.reduce((sum, item) => sum + item.original, 0);
  const output = items.reduce((sum, item) => sum + item.output, 0);
  return {
    original,
    output,
    saved: original - output,
    percent: reductionPercent(original, output),
  };
}

export function shouldRetainOriginal(
  originalBytes: number,
  outputBytes: number,
  sameFormat: boolean,
  sameDimensions: boolean,
) {
  return sameFormat && sameDimensions && outputBytes >= originalBytes;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality?: number,
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob || blob.type.toLowerCase() !== mime)
          reject(new Error(`This browser cannot encode ${mime}.`));
        else resolve(blob);
      },
      mime,
      quality,
    );
  });
}

export async function compressDecodedImage(
  file: File,
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  sourceFormat: ImageFormat,
  settings: CompressionSettings,
  signal?: AbortSignal,
): Promise<CompressionResult> {
  signal?.throwIfAborted();
  if (
    sourceWidth * sourceHeight > MAX_IMAGE_PIXELS ||
    sourceWidth > MAX_IMAGE_SIDE ||
    sourceHeight > MAX_IMAGE_SIDE
  )
    throw new Error(
      "Decoded image dimensions exceed the 50 megapixel or 16,384 px safety limit.",
    );
  const { width, height } = calculateOutputDimensions(
    sourceWidth,
    sourceHeight,
    settings,
  );
  if (
    width * height > MAX_IMAGE_PIXELS ||
    width > MAX_IMAGE_SIDE ||
    height > MAX_IMAGE_SIDE
  )
    throw new Error(
      "Output dimensions exceed the 50 megapixel or 16,384 px safety limit.",
    );
  const format =
    settings.outputFormat === "keep" ? sourceFormat : settings.outputFormat;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: format !== "jpeg" });
  if (!context) throw new Error("Canvas is unavailable in this browser.");
  if (format === "jpeg") {
    context.fillStyle = settings.backgroundColor || "#ffffff";
    context.fillRect(0, 0, width, height);
  }
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(source, 0, 0, width, height);
  signal?.throwIfAborted();
  const mime = mimeFor(format);
  let blob: Blob;
  let targetReached = true;
  if (
    format !== "png" &&
    settings.mode === "target" &&
    settings.targetBytes > 0
  ) {
    let low = 0.1;
    let high = Math.max(low, settings.quality / 100);
    let best = await canvasToBlob(canvas, mime, high);
    for (let iteration = 0; iteration < 7; iteration += 1) {
      signal?.throwIfAborted();
      const quality = (low + high) / 2;
      const candidate = await canvasToBlob(canvas, mime, quality);
      if (candidate.size <= settings.targetBytes) {
        best = candidate;
        low = quality;
      } else {
        if (candidate.size < best.size) best = candidate;
        high = quality;
      }
    }
    blob = best;
    targetReached = blob.size <= settings.targetBytes;
  } else {
    blob = await canvasToBlob(
      canvas,
      mime,
      format === "png" ? undefined : settings.quality / 100,
    );
    if (settings.mode === "target" && settings.targetBytes > 0)
      targetReached = blob.size <= settings.targetBytes;
  }
  const sameDimensions = width === sourceWidth && height === sourceHeight;
  const retainedOriginal =
    settings.preventLargerOutput &&
    shouldRetainOriginal(
      file.size,
      blob.size,
      format === sourceFormat,
      sameDimensions,
    );
  if (retainedOriginal) blob = file;
  canvas.width = 1;
  canvas.height = 1;
  return { blob, width, height, format, retainedOriginal, targetReached };
}
