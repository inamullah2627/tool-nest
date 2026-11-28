"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/design/icon";

export function ImageDropZone({
  active,
  disabled,
  compact = false,
  count = 0,
  onFiles,
}: {
  active: boolean;
  disabled?: boolean;
  compact?: boolean;
  count?: number;
  onFiles: (files: File[]) => void;
}) {
  return (
    <label
      className={`image-drop-zone ${compact ? "is-compact" : ""} ${active ? "is-active" : ""} ${disabled ? "is-disabled" : ""}`}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        if (!disabled) onFiles(Array.from(event.dataTransfer.files));
      }}
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        multiple
        disabled={disabled}
        onChange={(event) => {
          onFiles(Array.from(event.target.files ?? []));
          event.currentTarget.value = "";
        }}
      />
      {compact ? (
        <>
          <span className="image-drop-icon">
            <Icon name="upload" size={20} />
          </span>
          <span>
            Drag and drop more images here, or click to add more. <b>{count}</b>{" "}
            of 20 selected.
          </span>
        </>
      ) : (
        <>
          <span className="image-drop-icon">
            <Icon name="upload" size={30} />
          </span>
          <strong>Drag &amp; Drop Your Images Here</strong>
          <span>
            Choose images from your device or drag and drop them here to start
            compressing.
          </span>
          <span className="btn primary">
            <Icon name="image" size={16} />
            Select Images
          </span>
          <div className="image-format-chips">
            <i>JPG</i>
            <i>JPEG</i>
            <i>PNG</i>
            <i>WebP</i>
          </div>
          <small>
            Up to 20 images per batch, 20 MB per image. Your images stay on your
            device.
          </small>
        </>
      )}
    </label>
  );
}

export function ImageWorkspacePanel({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`image-panel ${className}`}>
      <header>
        <b>{title}</b>
        {action}
      </header>
      <div className="image-panel-body">{children}</div>
    </section>
  );
}

export function ImageStatGrid({
  items,
}: {
  items: Array<[string, string, string?]>;
}) {
  return (
    <div className="image-stats">
      {items.map(([label, value, tone]) => (
        <div key={label} className={tone ? `is-${tone}` : ""}>
          <span>{label}</span>
          <b>{value}</b>
        </div>
      ))}
    </div>
  );
}
