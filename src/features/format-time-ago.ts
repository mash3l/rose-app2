const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

type TimeAgoTranslator = (
  key: "justNow" | "minutesAgo" | "hoursAgo" | "daysAgo",
  values?: { count: number },
) => string;

export function formatTimeAgo(date: Date, t: TimeAgoTranslator): string {
  const elapsedMs = Date.now() - date.getTime();

  if (elapsedMs < MINUTE_MS) {
    return t("justNow");
  }
  if (elapsedMs < HOUR_MS) {
    return t("minutesAgo", { count: Math.floor(elapsedMs / MINUTE_MS) });
  }
  if (elapsedMs < DAY_MS) {
    return t("hoursAgo", { count: Math.floor(elapsedMs / HOUR_MS) });
  }
  return t("daysAgo", { count: Math.floor(elapsedMs / DAY_MS) });
}

export function formatUnreadBadgeCount(count: number): string {
  const MAX_DISPLAY_COUNT = 99;
  return count > MAX_DISPLAY_COUNT ? `${MAX_DISPLAY_COUNT}+` : String(count);
}
