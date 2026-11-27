import { describe, expect, it } from "vitest";
import {
  addOrSubtractDate,
  calculateBusinessDays,
  calculateDateDifference,
  dateToDayNumber,
  dayOfWeek,
  formatDate,
  parseDateOnly,
  toIsoDate,
} from "./date-calculator";

const day = (value: string) => {
  const parsed = parseDateOnly(value);
  if (parsed.dayNumber === undefined) throw new Error(parsed.error);
  return parsed.dayNumber;
};

describe("date-only Gregorian calculations", () => {
  it("round trips leap dates and validates impossible dates", () => {
    expect(toIsoDate(day("2024-02-29"))).toBe("2024-02-29");
    expect(parseDateOnly("2023-02-29").error).toBe("Enter a valid date.");
    expect(parseDateOnly("2025-13-01").error).toBeTruthy();
  });

  it("calculates leap years and calendar duration", () => {
    const result = calculateDateDifference(
      day("2024-01-01"),
      day("2025-01-01"),
    );
    expect(result.totalDays).toBe(366);
    expect(result.duration).toMatchObject({
      years: 1,
      months: 0,
      days: 0,
      totalMonths: 12,
    });
    expect(result.includesLeapDay).toBe(true);
  });

  it("handles reversed, identical and inclusive ranges consistently", () => {
    const reversed = calculateDateDifference(
      day("2025-03-20"),
      day("2024-01-15"),
    );
    expect(reversed.direction).toBe("before");
    expect(reversed.duration).toMatchObject({ years: 1, months: 2, days: 5 });
    expect(
      calculateDateDifference(day("2025-01-01"), day("2025-01-01")).totalDays,
    ).toBe(0);
    expect(
      calculateDateDifference(day("2025-01-01"), day("2025-01-01"), true)
        .totalDays,
    ).toBe(1);
  });

  it("does not depend on daylight-saving transitions", () => {
    expect(
      calculateDateDifference(day("2025-03-08"), day("2025-03-10")).totalDays,
    ).toBe(2);
    expect(
      calculateDateDifference(day("2025-11-01"), day("2025-11-03")).totalDays,
    ).toBe(2);
  });

  it("adds calendar months first with end-of-month adjustment", () => {
    const common = addOrSubtractDate(day("2025-01-31"), "add", {
      years: 0,
      months: 1,
      weeks: 0,
      days: 0,
    });
    const leap = addOrSubtractDate(day("2024-01-31"), "add", {
      years: 0,
      months: 1,
      weeks: 0,
      days: 0,
    });
    expect(toIsoDate(common.result)).toBe("2025-02-28");
    expect(toIsoDate(leap.result)).toBe("2024-02-29");
    expect(common.adjustedEndOfMonth).toBe(true);
  });

  it("applies months before weeks and days when subtracting", () => {
    const result = addOrSubtractDate(day("2025-03-31"), "subtract", {
      years: 0,
      months: 1,
      weeks: 1,
      days: 1,
    });
    expect(toIsoDate(result.result)).toBe("2025-02-20");
  });

  it("counts custom working weeks efficiently and deduplicates holidays", () => {
    const result = calculateBusinessDays(
      day("2026-06-01"),
      day("2026-06-08"),
      false,
      new Set([1, 2, 3, 4, 5]),
      [
        day("2026-06-02"),
        day("2026-06-02"),
        day("2026-06-06"),
        day("2027-01-01"),
      ],
    );
    expect(result.calendarDays).toBe(7);
    expect(result.workingDaysBeforeHolidays).toBe(5);
    expect(result.excludedHolidays).toBe(1);
    expect(result.holidaysOnNonWorkingDays).toBe(1);
    expect(result.holidaysOutsideRange).toBe(1);
    expect(result.businessDays).toBe(4);
  });

  it("supports custom weekends and inclusive business ranges", () => {
    const result = calculateBusinessDays(
      day("2026-06-01"),
      day("2026-06-08"),
      true,
      new Set([0, 1, 2, 3, 4]),
      [],
    );
    expect(result.calendarDays).toBe(8);
    expect(result.businessDays).toBe(6);
  });

  it("handles very large ranges without per-day iteration", () => {
    const result = calculateBusinessDays(
      day("0001-01-01"),
      day("9999-12-31"),
      true,
      new Set([1, 2, 3, 4, 5]),
      [],
    );
    expect(result.businessDays).toBeGreaterThan(2_000_000);
  });

  it("keeps weekday formatting deterministic", () => {
    const value = dateToDayNumber({ year: 1970, month: 1, day: 1 });
    expect(value).toBe(0);
    expect(dayOfWeek(value)).toBe(4);
    expect(formatDate(value, true)).toBe("Thursday, January 1, 1970");
  });
});
