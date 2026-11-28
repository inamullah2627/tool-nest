"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, type IconName } from "@/components/design/icon";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { tools } from "@/data/tools";
import { ImageCompressorWorkspace } from "./image-compressor-workspace";

const tool = tools.find((item) => item.slug === "image-compressor")!;
const features: Array<[IconName, string, string]> = [
  [
    "zap",
    "Real Image Compression",
    "Native browser encoders reduce JPG and WebP size with adjustable quality.",
  ],
  [
    "layers",
    "Batch Processing",
    "Compress up to 20 images sequentially with progress, cancellation and retry.",
  ],
  [
    "image",
    "Format Conversion",
    "Convert between JPG, PNG and WebP with matching MIME types and filenames.",
  ],
  [
    "maximize",
    "Optional Resizing",
    "Resize with aspect-ratio control and prevent accidental upscaling.",
  ],
  [
    "eye",
    "Before & After Preview",
    "Inspect the actual encoded result with comparison, zoom and fullscreen controls.",
  ],
  [
    "shieldCheck",
    "Private by Design",
    "Images stay in browser memory and are never uploaded or persisted.",
  ],
];
const faqs = [
  [
    "How does the Image Compressor work?",
    "It decodes your image in the browser, draws the pixels to an isolated canvas and encodes a new JPG, PNG or WebP file. Nothing is uploaded.",
  ],
  [
    "Which image formats are supported?",
    "JPG, JPEG, PNG and WebP input and output are supported when the browser provides the relevant decoder and encoder.",
  ],
  [
    "What is the maximum file size?",
    "Each image can be up to 20 MB, with at most 20 images in one batch. A 50 megapixel and 16,384 pixel side limit also protects browser memory.",
  ],
  [
    "Does compression reduce image quality?",
    "JPG and WebP use lossy quality settings. PNG is re-encoded losslessly at the pixel level, so its quality control is disabled.",
  ],
  [
    "Can I target a specific file size?",
    "Yes for JPG and WebP. ToolNest tests several quality levels, but the target is best-effort because image complexity and browser encoders vary.",
  ],
  [
    "Can I convert PNG transparency to JPG?",
    "Yes. Because JPG has no transparency, transparent pixels are filled with your selected background color.",
  ],
  [
    "Will a larger compressed file replace my original?",
    "No when format and dimensions are unchanged. ToolNest retains the original if the encoded result is not smaller.",
  ],
  [
    "Are animated images supported?",
    "No. Animated PNG and WebP files are rejected instead of being silently flattened. GIF is outside the supported formats.",
  ],
  [
    "Does ToolNest preserve image metadata?",
    "No. Canvas output normally removes EXIF and other metadata. Browser decoding applies supported EXIF orientation before encoding.",
  ],
  [
    "Can I resize images while compressing?",
    "Yes. Set maximum width and height, preserve the aspect ratio and keep prevent-upscaling enabled by default.",
  ],
  [
    "Why can results differ across browsers?",
    "Canvas codecs are supplied by the browser, so encoder availability, output bytes and visual quality can differ slightly.",
  ],
  [
    "Can I download a batch at once?",
    "Yes. Completed results can be downloaded individually or bundled locally into a ZIP file.",
  ],
  [
    "Are my images uploaded or stored?",
    "No. Files and temporary preview URLs remain only in your current browser tab and are released when removed or when the page closes.",
  ],
  [
    "Does it work on mobile?",
    "Modern mobile browsers with Canvas, Blob and supported image codecs can use it, subject to device memory limits.",
  ],
] as const;

export function ImageCompressorPage() {
  const [openFaq, setOpenFaq] = useState(0);
  return (
    <ToolPageLayout
      tool={tool}
      icon="image"
      heading="Image Compressor"
      description="Compress JPG, PNG and WebP images online. Reduce file size, resize or convert images securely in your browser."
    >
      <ImageCompressorWorkspace />
      <section className="tool-section">
        <div className="wrap">
          <div className="sh c">
            <h2>How to Compress Images Online</h2>
          </div>
          <div className="steps">
            {(
              [
                [
                  "upload",
                  "Upload Your Images",
                  "Choose or drag up to 20 JPG, PNG or WebP files.",
                ],
                [
                  "sliders",
                  "Adjust Compression",
                  "Select a preset, quality, output format and optional dimensions.",
                ],
                [
                  "download",
                  "Preview & Download",
                  "Compare the actual result, then download one image or a ZIP.",
                ],
              ] as Array<[IconName, string, string]>
            ).map(([icon, title, text], index) => (
              <div className="st" key={title}>
                <div className="nm">
                  <Icon name={icon} size={28} />
                  <b>0{index + 1}</b>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="tool-section">
        <div className="wrap">
          <div className="sh c">
            <h2>Powerful Image Compression Features</h2>
          </div>
          <div className="fcg f3">
            {features.map(([icon, title, text]) => (
              <article className="tc" key={title}>
                <span className="cico">
                  <Icon name={icon} size={22} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="tool-section">
        <div className="wrap">
          <div className="sh c">
            <h2>Supported Image Formats</h2>
          </div>
          <div className="image-format-info">
            <article>
              <b>JPG / JPEG</b>
              <p>
                Best for photographs. Uses adjustable lossy quality and a solid
                background.
              </p>
            </article>
            <article>
              <b>PNG</b>
              <p>
                Lossless pixel re-encoding with transparency. Quality settings
                do not apply.
              </p>
            </article>
            <article>
              <b>WebP</b>
              <p>
                Modern compression with adjustable quality and transparency
                support.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="tool-section">
        <div className="wrap">
          <div className="edu">
            <h2>How Image Compression Works</h2>
            <h3>Quality compression and target size</h3>
            <p>
              Quality mode sends the chosen quality to the browser JPG or WebP
              encoder. Target mode searches a safe quality range and returns the
              best result it can find; it cannot guarantee an exact byte count.
            </p>
            <h3>PNG behavior</h3>
            <p>
              Canvas exposes no PNG quality control. ToolNest therefore performs
              a lossless pixel re-encode, removes metadata and retains the
              original when the new PNG is larger and no format or dimension
              change was requested.
            </p>
            <h3>Orientation, metadata and animation</h3>
            <p>
              Modern browser decoders normalize supported EXIF orientation
              before pixels reach the canvas. Re-encoding removes EXIF and other
              metadata. Animated PNG and WebP are rejected because Canvas would
              flatten them.
            </p>
            <h3>Memory and privacy</h3>
            <p>
              Files are processed sequentially with decoded dimension limits.
              Object URLs and decoded image resources are released when no
              longer needed. ToolNest does not send, fetch or persist image
              data.
            </p>
            <div className="callout">
              <Icon name="info" size={20} />
              <p>
                Browser codecs differ. WebP encoding depends on browser support,
                and output size can vary between browsers even with identical
                settings.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="tool-section">
        <div className="wrap">
          <div className="related-heading">
            <div className="sh">
              <h2>More Image Tools</h2>
            </div>
            <Link className="btn" href="/tools/category/image">
              View Image Tools
            </Link>
          </div>
          <div className="fcg">
            {[
              "Image Resizer",
              "Image Cropper",
              "WebP Converter",
              "PNG to JPG",
              "JPG to PNG",
            ].map((name) => (
              <article className="tc" key={name}>
                <div className="top">
                  <span className="cico">
                    <Icon name="image" />
                  </span>
                  <span className="soon">Coming Soon</span>
                </div>
                <h3>{name}</h3>
                <p>This image tool is planned for a future release.</p>
                <span className="cat">Image Tools</span>
                <span className="use unavailable">Coming Soon</span>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="tool-section">
        <div className="wrap">
          <div className="sh c">
            <h2>Image Compressor FAQs</h2>
          </div>
          <div className="faq">
            {faqs.map(([question, answer], index) => (
              <div
                className={`qi ${openFaq === index ? "open" : ""}`}
                key={question}
              >
                <button
                  aria-expanded={openFaq === index}
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                >
                  {question}
                  <Icon name="plus" size={20} />
                </button>
                <p className="qa">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="tool-cta">
        <div className="wrap">
          <div className="cta">
            <span className="mono-d category-mono-left">JPG</span>
            <span className="mono-d category-mono-right">WebP</span>
            <h2>Explore More Image Tools</h2>
            <p>
              Optimize, resize and convert images with private browser-based
              tools.
            </p>
            <Link className="btn w" href="/tools/category/image">
              Explore Image Tools
            </Link>
            <Link className="sl" href="/tools">
              View All Tools
            </Link>
          </div>
        </div>
      </section>
    </ToolPageLayout>
  );
}
