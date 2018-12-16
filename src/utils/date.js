import {
  format,
  startOfToday,
  endOfToday,
  startOfTomorrow,
  endOfTomorrow,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  getTime,
  getMonth,
  getDate,
  differenceInDays,
  differenceInHours
} from "date-fns";

export function isDateRangeEqual(rangeA, rangeB) {
  if (!rangeA || !rangeB) {
    return false;
  }
  if (!rangeA.length && !rangeB.length) {
    return true;
  }
  return rangeA[0] === rangeB[0] && rangeA[1] === rangeB[1];
}

export function getTodayTsRange() {
  return [+startOfToday(), +endOfToday()];
}

export function getTmrTsRange() {
  return [+startOfTomorrow(), +endOfTomorrow()];
}

export function getWeekTsRange() {
  const now = new Date();
  return [+startOfWeek(now), +endOfWeek(now)];
}

export function getMonthTsRange() {
  const now = new Date();
  return [+startOfMonth(now), +endOfMonth(now)];
}

export function getMonthAndDay(ts) {
  if (typeof ts !== "number") {
    ts = +ts;
  }
  const month = `${getMonth(new Date(ts)) + 1}`.padStart(2, "0");
  const day = `${getDate(new Date(ts))}`.padStart(2, "0");
  return `${month}/${day}`;
}

export function getDayDifference(dateA, dateB) {
  return differenceInDays(dateA, dateB);
}

export function getHourDifference(dateA, dateB) {
  return differenceInHours(dateA, dateB);
}

export function formatDate(date, formatStyle = "YYYY-MM-DD") {
  return format(date, formatStyle);
}

export function toTs(date) {
  return getTime(new Date(date));
}

export function toSearchQueryString({ channels, before, after }) {
  let str = "?";
  if (channels.length > 0) {
    str = `${str}channels=${channels}`;
  }
  if (after) {
    const dateQuery = `after=${after}&before=${before}`;
    str = channels.length > 0 ? `${str}&${dateQuery}` : `${str}${dateQuery}`;
  }
  return str;
}
