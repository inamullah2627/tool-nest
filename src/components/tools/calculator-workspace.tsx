"use client";

import type { ReactNode } from "react";

export function CalculatorWorkspace({
  modeSelector,
  children,
}: {
  modeSelector: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="wsp calculator-workspace">
      <div className="calculator-toolbar">
        <span>Calculator Mode</span>
        {modeSelector}
      </div>
      <div className="calculator-panels">{children}</div>
    </div>
  );
}

export function CalculatorPanel({
  title,
  children,
  footer,
  live = false,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  live?: boolean;
}) {
  return (
    <div className="calculator-panel">
      <header>
        <b>{title}</b>
      </header>
      <div
        className="calculator-panel-body"
        aria-live={live ? "polite" : undefined}
      >
        {children}
      </div>
      {footer && <footer>{footer}</footer>}
    </div>
  );
}

export function CalculatorStats({
  items,
}: {
  items: Array<[string, string, string?]>;
}) {
  return (
    <div className="calculator-stats">
      {items.map(([label, value, note]) => (
        <div className="calculator-stat" key={label}>
          <span>{label}</span>
          <b>{value}</b>
          {note && <small>{note}</small>}
        </div>
      ))}
    </div>
  );
}

export function CalculatorSummary({
  title = "Calculation Summary",
  rows,
  onCopy,
}: {
  title?: string;
  rows: Array<[string, string]>;
  onCopy: () => void;
}) {
  return (
    <div className="calculator-summary">
      <div>
        <b>{title}</b>
        <button className="btn" onClick={onCopy}>
          Copy Summary
        </button>
      </div>
      <dl>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
