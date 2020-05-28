import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

export function timeElapsedSince(date) {
  const now = new Date().getTime();

  const diffMins = differenceInMinutes(now, date);
  if (diffMins < 1) {
    return "just now";
  }
  if (diffMins < 60) {
    return diffMins.toString() + "m ago";
  }

  const diffHours = differenceInHours(now, date);
  if (diffHours < 24) {
    return diffHours.toString() + "h ago";
  }

  const diffDays = differenceInDays(now, date);
  const diffMonths = differenceInMonths(now, date);
  if (diffMonths < 1) {
    return diffDays.toString() + "d ago";
  }

  const diffYears = differenceInYears(now, date);
  if (diffYears < 1) {
    return diffMonths.toString() + "mo ago";
  }

  return diffYears.toString() + "y ago";
}
