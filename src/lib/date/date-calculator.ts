export type CalendarDate = { year: number; month: number; day: number };
export type DateDirection = "after" | "before" | "same";

export type CalendarDuration = {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
};

export type DateDifferenceResult = {
  start: number;
  end: number;
  lower: number;
  upper: number;
  inclusive: boolean;
  direction: DateDirection;
  totalDays: number;
  weeks: number;
  remainingDays: number;
  weekdays: number;
  weekendDays: number;
  duration: CalendarDuration;
  includesLeapDay: boolean;
};

export type DateArithmeticResult = {
  start: number;
  result: number;
  operation: "add" | "subtract";
  years: number;
  months: number;
  weeks: number;
  days: number;
  totalDays: number;
  adjustedEndOfMonth: boolean;
  originalDay: number;
};

export type BusinessDaysResult = {
  start: number;
  end: number;
  lower: number;
  upper: number;
  inclusive: boolean;
  direction: DateDirection;
  calendarDays: number;
  workingDaysBeforeHolidays: number;
  businessDays: number;
  nonWorkingDays: number;
  excludedHolidays: number;
  holidaysOutsideRange: number;
  holidaysOnNonWorkingDays: number;
  workingDays: ReadonlySet<number>;
};

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;
export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;
export const DEFAULT_WORKING_DAYS = new Set([1, 2, 3, 4, 5]);

export function isLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function daysInMonth(year: number, month: number) {
  return (
    [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
      month - 1
    ] ?? 0
  );
}

// Howard Hinnant's civil calendar algorithms, shifted to the Unix epoch.
// The result is an integer calendar-day number and never passes through Date.
export function dateToDayNumber({ year, month, day }: CalendarDate) {
  const adjustedYear = year - (month <= 2 ? 1 : 0);
  const era = Math.floor(adjustedYear / 400);
  const yearOfEra = adjustedYear - era * 400;
  const shiftedMonth = month + (month > 2 ? -3 : 9);
  const dayOfYear = Math.floor((153 * shiftedMonth + 2) / 5) + day - 1;
  const dayOfEra =
    yearOfEra * 365 +
    Math.floor(yearOfEra / 4) -
    Math.floor(yearOfEra / 100) +
    dayOfYear;
  return era * 146097 + dayOfEra - 719468;
}

export function dayNumberToDate(dayNumber: number): CalendarDate {
  const shifted = dayNumber + 719468;
  const era = Math.floor(shifted / 146097);
  const dayOfEra = shifted - era * 146097;
  const yearOfEra = Math.floor(
    (dayOfEra -
      Math.floor(dayOfEra / 1460) +
      Math.floor(dayOfEra / 36524) -
      Math.floor(dayOfEra / 146096)) /
      365,
  );
  const year = yearOfEra + era * 400;
  const dayOfYear =
    dayOfEra -
    (365 * yearOfEra + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100));
  const monthPrime = Math.floor((5 * dayOfYear + 2) / 153);
  const day = dayOfYear - Math.floor((153 * monthPrime + 2) / 5) + 1;
  const month = monthPrime + (monthPrime < 10 ? 3 : -9);
  return { year: year + (month <= 2 ? 1 : 0), month, day };
}

export const MIN_DAY = dateToDayNumber({ year: 1, month: 1, day: 1 });
export const MAX_DAY = dateToDayNumber({ year: 9999, month: 12, day: 31 });

export function parseDateOnly(value: string): {
  dayNumber?: number;
  error?: string;
} {
  if (!value) return { error: "Choose a date." };
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return { error: "Enter a valid date." };
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || year > 9999)
    return { error: "Year must be between 0001 and 9999." };
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
    return { error: "Enter a valid date." };
  }
  return { dayNumber: dateToDayNumber({ year, month, day }) };
}

export function toIsoDate(dayNumber: number) {
  const { year, month, day } = dayNumberToDate(dayNumber);
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function dayOfWeek(dayNumber: number) {
  return (((dayNumber + 4) % 7) + 7) % 7;
}

export function formatDate(dayNumber: number, includeWeekday = false) {
  const { year, month, day } = dayNumberToDate(dayNumber);
  const value = `${MONTH_NAMES[month - 1]} ${day}, ${year}`;
  return includeWeekday
    ? `${DAY_NAMES[dayOfWeek(dayNumber)]}, ${value}`
    : value;
}

export function addCalendarMonths(dayNumber: number, months: number) {
  const source = dayNumberToDate(dayNumber);
  const index = source.year * 12 + source.month - 1 + months;
  const year = Math.floor(index / 12);
  const month = index - year * 12 + 1;
  const day = Math.min(source.day, daysInMonth(year, month));
  return {
    dayNumber: dateToDayNumber({ year, month, day }),
    adjustedEndOfMonth: day < source.day,
    originalDay: source.day,
  };
}

export function calendarDuration(
  lower: number,
  upper: number,
): CalendarDuration {
  const start = Math.min(lower, upper);
  const end = Math.max(lower, upper);
  const a = dayNumberToDate(start);
  const b = dayNumberToDate(end);
  let totalMonths = (b.year - a.year) * 12 + b.month - a.month;
  while (
    totalMonths > 0 &&
    addCalendarMonths(start, totalMonths).dayNumber > end
  )
    totalMonths--;
  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    days: end - addCalendarMonths(start, totalMonths).dayNumber,
    totalMonths,
  };
}

export function countSelectedWeekdays(
  start: number,
  length: number,
  selected: ReadonlySet<number>,
) {
  if (length <= 0 || selected.size === 0) return 0;
  let count = Math.floor(length / 7) * selected.size;
  for (let index = 0; index < length % 7; index++) {
    if (selected.has(dayOfWeek(start + index))) count++;
  }
  return count;
}

function direction(start: number, end: number): DateDirection {
  return end > start ? "after" : end < start ? "before" : "same";
}

function rangeIncludesLeapDay(lower: number, upper: number) {
  if (upper < lower) return false;
  const firstYear = dayNumberToDate(lower).year;
  const lastYear = dayNumberToDate(upper).year;
  for (let year = firstYear; year <= lastYear; year++) {
    if (!isLeapYear(year)) continue;
    const leapDay = dateToDayNumber({ year, month: 2, day: 29 });
    if (leapDay >= lower && leapDay <= upper) return true;
  }
  return false;
}

export function calculateDateDifference(
  start: number,
  end: number,
  inclusive = false,
): DateDifferenceResult {
  const lower = Math.min(start, end);
  const upper = Math.max(start, end);
  const totalDays = upper - lower + (inclusive ? 1 : 0);
  const weekdays = countSelectedWeekdays(
    lower,
    totalDays,
    DEFAULT_WORKING_DAYS,
  );
  return {
    start,
    end,
    lower,
    upper,
    inclusive,
    direction: direction(start, end),
    totalDays,
    weeks: Math.floor(totalDays / 7),
    remainingDays: totalDays % 7,
    weekdays,
    weekendDays: totalDays - weekdays,
    duration: calendarDuration(lower, upper + (inclusive ? 1 : 0)),
    includesLeapDay: rangeIncludesLeapDay(lower, lower + totalDays - 1),
  };
}

export function addOrSubtractDate(
  start: number,
  operation: "add" | "subtract",
  values: { years: number; months: number; weeks: number; days: number },
): DateArithmeticResult {
  for (const value of Object.values(values)) {
    if (!Number.isInteger(value) || value < 0 || value > 1_000_000)
      throw new Error("Durations must be whole numbers from 0 to 1,000,000.");
  }
  const sign = operation === "add" ? 1 : -1;
  const monthResult = addCalendarMonths(
    start,
    sign * (values.years * 12 + values.months),
  );
  const result =
    monthResult.dayNumber + sign * (values.weeks * 7 + values.days);
  if (result < MIN_DAY || result > MAX_DAY)
    throw new Error(
      "The result falls outside the supported range (year 0001 to 9999).",
    );
  return {
    start,
    result,
    operation,
    ...values,
    totalDays: Math.abs(result - start),
    adjustedEndOfMonth: monthResult.adjustedEndOfMonth,
    originalDay: monthResult.originalDay,
  };
}

export function calculateBusinessDays(
  start: number,
  end: number,
  inclusive: boolean,
  workingDays: ReadonlySet<number>,
  holidays: readonly number[],
): BusinessDaysResult {
  if (
    workingDays.size === 0 ||
    [...workingDays].some((day) => !Number.isInteger(day) || day < 0 || day > 6)
  ) {
    throw new Error("Select at least one valid working day.");
  }
  const lower = Math.min(start, end);
  const upper = Math.max(start, end);
  const calendarDays = upper - lower + (inclusive ? 1 : 0);
  const lastCountedDay = lower + calendarDays - 1;
  const workingDaysBeforeHolidays = countSelectedWeekdays(
    lower,
    calendarDays,
    workingDays,
  );
  const uniqueHolidays = [...new Set(holidays)];
  const inRange = uniqueHolidays.filter(
    (holiday) => holiday >= lower && holiday <= lastCountedDay,
  );
  const excludedHolidays = inRange.filter((holiday) =>
    workingDays.has(dayOfWeek(holiday)),
  ).length;
  return {
    start,
    end,
    lower,
    upper,
    inclusive,
    direction: direction(start, end),
    calendarDays,
    workingDaysBeforeHolidays,
    businessDays: workingDaysBeforeHolidays - excludedHolidays,
    nonWorkingDays: calendarDays - workingDaysBeforeHolidays,
    excludedHolidays,
    holidaysOutsideRange: uniqueHolidays.length - inRange.length,
    holidaysOnNonWorkingDays: inRange.length - excludedHolidays,
    workingDays,
  };
}
