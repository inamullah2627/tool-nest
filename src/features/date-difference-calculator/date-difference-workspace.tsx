"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/design/icon";
import { usePreferences } from "@/components/providers/app-providers";
import {
  CalculatorPanel,
  CalculatorStats,
  CalculatorSummary,
  CalculatorWorkspace,
} from "@/components/tools/calculator-workspace";
import {
  DAY_NAMES,
  DEFAULT_WORKING_DAYS,
  addOrSubtractDate,
  calculateBusinessDays,
  calculateDateDifference,
  dayOfWeek,
  formatDate,
  parseDateOnly,
  type BusinessDaysResult,
  type DateArithmeticResult,
  type DateDifferenceResult,
} from "@/lib/date/date-calculator";

type Mode = "difference" | "arithmetic" | "business";
type Operation = "add" | "subtract";
const MODES: Array<[Mode, string]> = [
  ["difference", "Date Difference"],
  ["arithmetic", "Add / Subtract Dates"],
  ["business", "Business Days"],
];
const MODE_TITLES: Record<Mode, [string, string, string]> = {
  difference: [
    "Calculate Date Difference",
    "Date Difference Results",
    "Calculate Difference",
  ],
  arithmetic: [
    "Add or Subtract Time from a Date",
    "Calculated Date",
    "Calculate Date",
  ],
  business: [
    "Business Days Calculator",
    "Business Days Results",
    "Calculate Business Days",
  ],
};

function today() {
  const date = new Date();
  return `${String(date.getFullYear()).padStart(4, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function plural(value: number, unit: string) {
  return `${value.toLocaleString("en-US")} ${unit}${value === 1 ? "" : "s"}`;
}
function durationText(result: DateDifferenceResult) {
  const { years, months, days } = result.duration;
  return `${plural(years, "Year")}, ${plural(months, "Month")}, ${plural(days, "Day")}`;
}
function workingWeekLabel(days: ReadonlySet<number>) {
  if ([1, 2, 3, 4, 5].every((day) => days.has(day)) && days.size === 5)
    return "Monday to Friday";
  return [1, 2, 3, 4, 5, 6, 0]
    .filter((day) => days.has(day))
    .map((day) => DAY_NAMES[day])
    .join(", ");
}

function DateField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const parsed = parseDateOnly(value);
  return (
    <div className="calculator-field">
      <label htmlFor={id}>{label}</label>
      <div className="calculator-date-input">
        <input
          className="inp"
          id={id}
          type="date"
          min="0001-01-01"
          max="9999-12-31"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(parsed.error)}
        />
        <button className="btn" type="button" onClick={() => onChange(today())}>
          Today
        </button>
      </div>
      <small>
        {parsed.dayNumber === undefined
          ? parsed.error
          : formatDate(parsed.dayNumber, true)}
      </small>
    </div>
  );
}

function Switch({
  checked,
  label,
  description,
  onChange,
}: {
  checked: boolean;
  label: string;
  description: string;
  onChange: () => void;
}) {
  return (
    <div className="calculator-option">
      <button
        className="sw2"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
      >
        <i />
        {label}
      </button>
      <small>{description}</small>
    </div>
  );
}

function ResultPlaceholder({
  stale,
  action,
}: {
  stale: boolean;
  action: string;
}) {
  return (
    <div className="calculator-placeholder">
      <Icon name="info" size={28} />
      <h3>{stale ? "Inputs changed" : "Ready to calculate"}</h3>
      <p>
        {stale
          ? `The previous result is hidden. Select ${action} to update it.`
          : "Enter the required values and calculate to see a detailed result."}
      </p>
    </div>
  );
}

export function DateDifferenceWorkspace() {
  const { recordRecent } = usePreferences();
  const initial = today();
  const [mode, setMode] = useState<Mode>("difference");
  const [start, setStart] = useState(initial);
  const [end, setEnd] = useState(initial);
  const [inclusive, setInclusive] = useState(false);
  const [details, setDetails] = useState(true);
  const [arithmeticStart, setArithmeticStart] = useState(initial);
  const [operation, setOperation] = useState<Operation>("add");
  const [amounts, setAmounts] = useState({
    years: "0",
    months: "0",
    weeks: "0",
    days: "0",
  });
  const [businessStart, setBusinessStart] = useState(initial);
  const [businessEnd, setBusinessEnd] = useState(initial);
  const [businessInclusive, setBusinessInclusive] = useState(false);
  const [showUnits, setShowUnits] = useState(false);
  const [workingDays, setWorkingDays] = useState(
    () => new Set(DEFAULT_WORKING_DAYS),
  );
  const [holidayInput, setHolidayInput] = useState("");
  const [holidays, setHolidays] = useState<number[]>([]);
  const [holidayOpen, setHolidayOpen] = useState(false);
  const [result, setResult] = useState<
    DateDifferenceResult | DateArithmeticResult | BusinessDaysResult | null
  >(() =>
    calculateDateDifference(
      parseDateOnly(initial).dayNumber!,
      parseDateOnly(initial).dayNumber!,
      false,
    ),
  );
  const [resultMode, setResultMode] = useState<Mode | null>("difference");
  const [stale, setStale] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const titles = MODE_TITLES[mode];

  const invalidate = () => {
    if (result) setStale(true);
    setResult(null);
    setError("");
  };
  const update = <T,>(setter: (value: T) => void, value: T) => {
    setter(value);
    invalidate();
  };
  const notify = (value: string) => {
    setMessage(value);
    window.setTimeout(() => setMessage(""), 2200);
  };
  const copy = async (value: string, success: string) => {
    try {
      await navigator.clipboard.writeText(value);
      notify(success);
    } catch {
      setError("Clipboard access failed. Select and copy the result manually.");
    }
  };
  const parse = (value: string, label: string) => {
    const parsed = parseDateOnly(value);
    if (parsed.dayNumber === undefined)
      throw new Error(`${label}: ${parsed.error}`);
    return parsed.dayNumber;
  };
  const amountValues = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(amounts).map(([key, value]) => [key, Number(value)]),
      ) as { years: number; months: number; weeks: number; days: number },
    [amounts],
  );

  const calculateMode = (selectedMode: Mode, announce = true) => {
    try {
      let next:
        DateDifferenceResult | DateArithmeticResult | BusinessDaysResult;
      if (selectedMode === "difference")
        next = calculateDateDifference(
          parse(start, "Start date"),
          parse(end, "End date"),
          inclusive,
        );
      else if (selectedMode === "arithmetic")
        next = addOrSubtractDate(
          parse(arithmeticStart, "Starting date"),
          operation,
          amountValues,
        );
      else
        next = calculateBusinessDays(
          parse(businessStart, "Start date"),
          parse(businessEnd, "End date"),
          businessInclusive,
          workingDays,
          holidays,
        );
      setResult(next);
      setResultMode(selectedMode);
      setStale(false);
      setError("");
      if (announce) {
        recordRecent("date-difference-calculator");
        notify("Calculation completed.");
      }
    } catch (caught) {
      setResult(null);
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to calculate with these values.",
      );
    }
  };
  const calculate = () => calculateMode(mode);

  const reset = () => {
    const defaultDay = parseDateOnly(initial).dayNumber!;
    if (mode === "difference") {
      setStart(initial);
      setEnd(initial);
      setInclusive(false);
      setDetails(true);
    } else if (mode === "arithmetic") {
      setArithmeticStart(initial);
      setOperation("add");
      setAmounts({ years: "0", months: "0", weeks: "0", days: "0" });
    } else {
      setBusinessStart(initial);
      setBusinessEnd(initial);
      setBusinessInclusive(false);
      setWorkingDays(new Set(DEFAULT_WORKING_DAYS));
      setHolidays([]);
      setHolidayInput("");
      setHolidayOpen(false);
    }
    setResult(
      mode === "difference"
        ? calculateDateDifference(defaultDay, defaultDay, false)
        : mode === "arithmetic"
          ? addOrSubtractDate(defaultDay, "add", {
              years: 0,
              months: 0,
              weeks: 0,
              days: 0,
            })
          : calculateBusinessDays(
              defaultDay,
              defaultDay,
              false,
              DEFAULT_WORKING_DAYS,
              [],
            ),
    );
    setResultMode(mode);
    setStale(false);
    setError("");
  };

  const loadExample = () => {
    if (mode === "difference") {
      setStart("2024-01-15");
      setEnd("2026-03-20");
      setInclusive(false);
    } else if (mode === "arithmetic") {
      setArithmeticStart("2025-01-31");
      setOperation("add");
      setAmounts({ years: "0", months: "1", weeks: "0", days: "0" });
    } else {
      setBusinessStart("2026-06-01");
      setBusinessEnd("2026-07-01");
      setBusinessInclusive(false);
      setWorkingDays(new Set(DEFAULT_WORKING_DAYS));
      setHolidays([parse("2026-06-19", "Holiday")]);
      setHolidayOpen(true);
    }
    setResult(null);
    setStale(true);
    setError("");
    notify("Example loaded. Select calculate to view the result.");
  };

  const dateDifferenceRows = (
    value: DateDifferenceResult,
  ): Array<[string, string]> => [
    ["Start Date", formatDate(value.start, true)],
    ["End Date", formatDate(value.end, true)],
    ["Calendar Duration", durationText(value)],
    ["Total Days", value.totalDays.toLocaleString("en-US")],
    [
      "Total Weeks",
      `${plural(value.weeks, "week")}, ${plural(value.remainingDays, "day")}`,
    ],
    ["Weekdays", value.weekdays.toLocaleString("en-US")],
    ["Weekend Days", value.weekendDays.toLocaleString("en-US")],
    ["End Date Inclusion", value.inclusive ? "Included" : "Not included"],
  ];
  const arithmeticRows = (
    value: DateArithmeticResult,
  ): Array<[string, string]> => [
    ["Original Date", formatDate(value.start, true)],
    ["Operation", value.operation === "add" ? "Add" : "Subtract"],
    [
      "Applied Duration",
      `${plural(value.years, "year")}, ${plural(value.months, "month")}, ${plural(value.weeks, "week")}, ${plural(value.days, "day")}`,
    ],
    ["Resulting Date", formatDate(value.result, true)],
  ];
  const businessRows = (value: BusinessDaysResult): Array<[string, string]> => [
    [
      "Date Range",
      value.calendarDays
        ? `${formatDate(value.lower)} to ${formatDate(value.lower + value.calendarDays - 1)}`
        : `${formatDate(value.lower)} (no days counted)`,
    ],
    ["Working Days", workingWeekLabel(value.workingDays)],
    ["Total Calendar Days", value.calendarDays.toLocaleString("en-US")],
    ["Business Days", value.businessDays.toLocaleString("en-US")],
    ["Excluded Holidays", value.excludedHolidays.toLocaleString("en-US")],
    ["Non-Working Days", value.nonWorkingDays.toLocaleString("en-US")],
  ];
  const rows =
    result && resultMode === mode
      ? mode === "difference"
        ? dateDifferenceRows(result as DateDifferenceResult)
        : mode === "arithmetic"
          ? arithmeticRows(result as DateArithmeticResult)
          : businessRows(result as BusinessDaysResult)
      : [];
  const resultText = rows
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  return (
    <section className="tool-workspace-section date-calculator-section">
      <div className="wrap">
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
        {message && (
          <div className="calculator-toast" role="status">
            {message}
          </div>
        )}
        <CalculatorWorkspace
          modeSelector={
            <div
              className="calculator-modes"
              role="tablist"
              aria-label="Calculator mode"
            >
              {MODES.map(([value, label]) => (
                <button
                  key={value}
                  role="tab"
                  aria-selected={mode === value}
                  onClick={() => {
                    setMode(value);
                    setStale(false);
                    setError("");
                    calculateMode(value, false);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          }
        >
          <CalculatorPanel
            title={titles[0]}
            footer={
              <div className="calculator-actions">
                <button className="btn pr" onClick={calculate}>
                  <Icon name="calc" size={16} />
                  {titles[2]}
                </button>
                <button
                  className="btn"
                  disabled={!result || resultMode !== mode}
                  onClick={() => copy(resultText, "Result copied.")}
                >
                  <Icon name="copy" size={16} />
                  Copy Result
                </button>
                <button className="btn" onClick={loadExample}>
                  <Icon name="file" size={16} />
                  Load Example
                </button>
                <button className="btn ghost" onClick={reset}>
                  <Icon name="repeat" size={16} />
                  Reset
                </button>
              </div>
            }
          >
            {mode === "difference" && (
              <>
                <DateField
                  id="difference-start"
                  label="Start Date"
                  value={start}
                  onChange={(value) => update(setStart, value)}
                />
                <div className="calculator-swap">
                  <i />
                  <button
                    className="ib sm"
                    aria-label="Swap start and end dates"
                    onClick={() => {
                      const previous = start;
                      setStart(end);
                      setEnd(previous);
                      invalidate();
                    }}
                  >
                    <Icon name="swap" size={17} />
                  </button>
                  <i />
                </div>
                <DateField
                  id="difference-end"
                  label="End Date"
                  value={end}
                  onChange={(value) => update(setEnd, value)}
                />
                <div className="calculator-options">
                  <Switch
                    checked={inclusive}
                    label="Include End Date"
                    description="Off by default. Including the end date adds one calendar day."
                    onChange={() => update(setInclusive, !inclusive)}
                  />
                  <Switch
                    checked={details}
                    label="Show Detailed Breakdown"
                    description="Shows calendar units, weekdays, weekends and range information."
                    onChange={() => setDetails(!details)}
                  />
                </div>
              </>
            )}
            {mode === "arithmetic" && (
              <>
                <DateField
                  id="arithmetic-start"
                  label="Starting Date"
                  value={arithmeticStart}
                  onChange={(value) => update(setArithmeticStart, value)}
                />
                <fieldset className="calculator-operation">
                  <legend>Operation</legend>
                  <div>
                    {(["add", "subtract"] as Operation[]).map((value) => (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={operation === value}
                        onClick={() => update(setOperation, value)}
                      >
                        {value === "add" ? "Add" : "Subtract"}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset className="calculator-duration">
                  <legend>Duration</legend>
                  <div>
                    {Object.entries(amounts).map(([key, value]) => (
                      <label key={key}>
                        {key[0].toUpperCase() + key.slice(1)}
                        <input
                          className="inp"
                          type="number"
                          min="0"
                          max="1000000"
                          step="1"
                          inputMode="numeric"
                          value={value}
                          onChange={(event) => {
                            setAmounts((current) => ({
                              ...current,
                              [key]: event.target.value,
                            }));
                            invalidate();
                          }}
                        />
                      </label>
                    ))}
                  </div>
                </fieldset>
                <p className="calculator-help">
                  Years and months are applied first as calendar months. Weeks
                  and days are then applied as exact calendar days. Shorter
                  target months use their final day.
                </p>
              </>
            )}
            {mode === "business" && (
              <>
                <DateField
                  id="business-start"
                  label="Start Date"
                  value={businessStart}
                  onChange={(value) => update(setBusinessStart, value)}
                />
                <div className="calculator-swap">
                  <i />
                  <button
                    className="ib sm"
                    aria-label="Swap business start and end dates"
                    onClick={() => {
                      const previous = businessStart;
                      setBusinessStart(businessEnd);
                      setBusinessEnd(previous);
                      invalidate();
                    }}
                  >
                    <Icon name="swap" size={17} />
                  </button>
                  <i />
                </div>
                <DateField
                  id="business-end"
                  label="End Date"
                  value={businessEnd}
                  onChange={(value) => update(setBusinessEnd, value)}
                />
                <fieldset className="working-days">
                  <legend>Working Days</legend>
                  <div>
                    {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                      <button
                        type="button"
                        key={day}
                        aria-pressed={workingDays.has(day)}
                        onClick={() => {
                          const next = new Set(workingDays);
                          if (next.has(day)) next.delete(day);
                          else next.add(day);
                          update(setWorkingDays, next);
                        }}
                      >
                        {DAY_NAMES[day]}
                      </button>
                    ))}
                  </div>
                  <small>
                    {workingDays.size
                      ? `Working week: ${workingWeekLabel(workingDays)}.`
                      : "Select at least one working day."}
                  </small>
                </fieldset>
                <Switch
                  checked={businessInclusive}
                  label="Include End Date"
                  description="Adds the end date to the counted range."
                  onChange={() =>
                    update(setBusinessInclusive, !businessInclusive)
                  }
                />
                <div className="holiday-settings">
                  <button
                    className="btn"
                    aria-expanded={holidayOpen}
                    onClick={() => setHolidayOpen(!holidayOpen)}
                  >
                    <Icon name="plus" size={16} />
                    Exclude Holidays (optional)
                    {holidays.length ? ` — ${holidays.length} added` : ""}
                  </button>
                  {holidayOpen && (
                    <div>
                      <div className="calculator-date-input">
                        <input
                          className="inp"
                          type="date"
                          min="0001-01-01"
                          max="9999-12-31"
                          aria-label="Holiday date"
                          value={holidayInput}
                          onChange={(event) =>
                            setHolidayInput(event.target.value)
                          }
                        />
                        <button
                          className="btn pr"
                          onClick={() => {
                            try {
                              const value = parse(holidayInput, "Holiday");
                              if (holidays.includes(value))
                                return setError(
                                  `${formatDate(value)} has already been added.`,
                                );
                              setHolidays((current) => [...current, value]);
                              setHolidayInput("");
                              invalidate();
                            } catch (caught) {
                              setError((caught as Error).message);
                            }
                          }}
                        >
                          <Icon name="plus" size={16} />
                          Add Holiday
                        </button>
                      </div>
                      <ul>
                        {holidays
                          .slice()
                          .sort((a, b) => a - b)
                          .map((holiday) => (
                            <li key={holiday}>
                              <span>{formatDate(holiday)}</span>
                              <button
                                className="ib sm"
                                aria-label={`Remove holiday ${formatDate(holiday)}`}
                                onClick={() =>
                                  update(
                                    setHolidays,
                                    holidays.filter(
                                      (value) => value !== holiday,
                                    ),
                                  )
                                }
                              >
                                <Icon name="x" size={16} />
                              </button>
                            </li>
                          ))}
                      </ul>
                      <div className="holiday-note">
                        <small>
                          Holidays are manual. Only unique dates inside the
                          counted range that fall on working days are excluded.
                        </small>
                        {holidays.length > 0 && (
                          <button
                            className="btn ghost"
                            onClick={() => update(setHolidays, [])}
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </CalculatorPanel>
          <CalculatorPanel title={titles[1]} live>
            {!result || resultMode !== mode ? (
              <ResultPlaceholder stale={stale} action={titles[2]} />
            ) : (
              <ResultContent
                mode={mode}
                result={result}
                details={details}
                showUnits={showUnits}
                onToggleUnits={() => setShowUnits((current) => !current)}
                rows={rows}
                onCopy={() =>
                  copy(
                    `${titles[1]} - ToolNest Date Difference Calculator\n${resultText}`,
                    "Summary copied.",
                  )
                }
              />
            )}
          </CalculatorPanel>
        </CalculatorWorkspace>
        <div className="calculator-privacy">
          <Icon name="shieldCheck" size={17} />
          Dates and holidays are processed only in browser memory. They are
          never uploaded or persisted.
        </div>
      </div>
    </section>
  );
}

function ResultContent({
  mode,
  result,
  details,
  showUnits,
  onToggleUnits,
  rows,
  onCopy,
}: {
  mode: Mode;
  result: DateDifferenceResult | DateArithmeticResult | BusinessDaysResult;
  details: boolean;
  showUnits: boolean;
  onToggleUnits: () => void;
  rows: Array<[string, string]>;
  onCopy: () => void;
}) {
  if (mode === "difference") {
    const value = result as DateDifferenceResult;
    return (
      <>
        <div className="calculator-primary">
          <span>Total days</span>
          <b>{plural(value.totalDays, "Day")}</b>
          <strong>Calendar duration: {durationText(value)}</strong>
          <div>
            <em>
              {value.direction === "after"
                ? "End date is after start date"
                : value.direction === "before"
                  ? "End date is before start date"
                  : "Start and end dates are the same"}
            </em>
            <em>
              {value.inclusive ? "End date included" : "End date not included"}
            </em>
          </div>
        </div>
        {details && (
          <CalculatorStats
            items={[
              ["Total Days", value.totalDays.toLocaleString("en-US")],
              [
                "Total Weeks",
                plural(value.weeks, "Week"),
                `and ${plural(value.remainingDays, "day")}`,
              ],
              [
                "Complete Calendar Months",
                value.duration.totalMonths.toLocaleString("en-US"),
                "Calendar months, not 30-day blocks",
              ],
              [
                "Complete Calendar Years",
                Math.floor(value.duration.totalMonths / 12).toLocaleString(
                  "en-US",
                ),
                "Calendar years, not 365-day blocks",
              ],
              [
                "Weekdays",
                value.weekdays.toLocaleString("en-US"),
                "Monday to Friday",
              ],
              [
                "Weekend Days",
                value.weekendDays.toLocaleString("en-US"),
                "Saturday and Sunday",
              ],
            ]}
          />
        )}
        {details && (
          <div className="calculator-extra">
            <button
              className="btn"
              aria-expanded={showUnits}
              onClick={onToggleUnits}
            >
              <Icon name="chev" size={15} /> Additional Time Units
            </button>
            {showUnits && (
              <>
                <CalculatorStats
                  items={[
                    [
                      "Total Hours",
                      (value.totalDays * 24).toLocaleString("en-US"),
                    ],
                    [
                      "Total Minutes",
                      (value.totalDays * 1440).toLocaleString("en-US"),
                    ],
                    [
                      "Total Seconds",
                      (value.totalDays * 86400).toLocaleString("en-US"),
                    ],
                  ]}
                />
                <p className="calculator-help">
                  These conversions use 24-hour calendar days. They are not
                  timezone-aware elapsed timestamp measurements.
                </p>
              </>
            )}
          </div>
        )}
        {details && (
          <div className="calculator-date-range">
            <b>Date Range</b>
            <div className="calculator-range-row">
              <div className="calculator-range-date">
                <span className="cico">
                  <Icon name="calendar" size={16} />
                </span>
                <small>Start</small>
                <strong>{DAY_NAMES[dayOfWeek(value.start)]}</strong>
                <span>{formatDate(value.start)}</span>
              </div>
              <div className="calculator-range-line">
                <i />
                <span>{plural(value.totalDays, "Day")}</span>
                <i />
              </div>
              <div className="calculator-range-date">
                <span className="cico">
                  <Icon name="calendar" size={16} />
                </span>
                <small>End</small>
                <strong>{DAY_NAMES[dayOfWeek(value.end)]}</strong>
                <span>{formatDate(value.end)}</span>
              </div>
            </div>
          </div>
        )}
        {value.direction === "before" && (
          <p className="calculator-notice">
            The difference is shown as a positive duration between the two
            dates.
          </p>
        )}
        {value.direction === "same" && (
          <p className="calculator-notice">
            Identical dates count as{" "}
            {value.inclusive
              ? "1 day when the end date is included"
              : "0 days when the end date is excluded"}
            .
          </p>
        )}
        {value.includesLeapDay && (
          <p className="calculator-notice">
            The counted range includes February 29 of a leap year.
          </p>
        )}
        <CalculatorSummary rows={rows} onCopy={onCopy} />
      </>
    );
  }
  if (mode === "arithmetic") {
    const value = result as DateArithmeticResult;
    return (
      <>
        <div className="calculator-primary">
          <span>Calculated date</span>
          <b>{formatDate(value.result)}</b>
          <strong>{DAY_NAMES[dayOfWeek(value.result)]}</strong>
          <div>
            <em>
              {value.operation === "add" ? "Added" : "Subtracted"}:{" "}
              {plural(value.years, "year")}, {plural(value.months, "month")},{" "}
              {plural(value.weeks, "week")}, {plural(value.days, "day")}
            </em>
          </div>
        </div>
        <CalculatorStats
          items={[
            ["Day of the Week", DAY_NAMES[dayOfWeek(value.result)]],
            [
              "Total Calendar Days",
              value.totalDays.toLocaleString("en-US"),
              "Between original and calculated date",
            ],
            ["Operation", value.operation === "add" ? "Add" : "Subtract"],
          ]}
        />
        {value.adjustedEndOfMonth && (
          <p className="calculator-notice">
            End-of-month adjustment: day {value.originalDay} does not exist in
            the target month, so its last day was used.
          </p>
        )}
        <CalculatorSummary rows={rows} onCopy={onCopy} />
      </>
    );
  }
  const value = result as BusinessDaysResult;
  return (
    <>
      <div className="calculator-primary">
        <span>Total business days</span>
        <b>{plural(value.businessDays, "Business Day")}</b>
        <strong>
          {value.calendarDays
            ? `${formatDate(value.lower)} to ${formatDate(value.lower + value.calendarDays - 1)}`
            : formatDate(value.lower)}
        </strong>
        <div>
          <em>{workingWeekLabel(value.workingDays)}</em>
          <em>
            {value.inclusive ? "End date included" : "End date not included"}
          </em>
        </div>
      </div>
      <CalculatorStats
        items={[
          ["Total Business Days", value.businessDays.toLocaleString("en-US")],
          ["Total Calendar Days", value.calendarDays.toLocaleString("en-US")],
          ["Non-Working Days", value.nonWorkingDays.toLocaleString("en-US")],
          ["Holidays Excluded", value.excludedHolidays.toLocaleString("en-US")],
        ]}
      />
      {value.direction === "before" && (
        <p className="calculator-notice">
          The end date is before the start date. Days are counted from the
          earlier date to the later date.
        </p>
      )}
      {value.holidaysOutsideRange > 0 && (
        <p className="calculator-notice">
          {plural(value.holidaysOutsideRange, "holiday")} outside the selected
          range were not counted.
        </p>
      )}
      {value.holidaysOnNonWorkingDays > 0 && (
        <p className="calculator-notice">
          {plural(value.holidaysOnNonWorkingDays, "holiday")} on non-working
          days were not deducted again.
        </p>
      )}
      <CalculatorSummary rows={rows} onCopy={onCopy} />
    </>
  );
}
