// Апта: дүйсенбіден бастап, Қазақстан уақытымен (UTC+5)
const OFF = 5 * 3600_000;
const DAY = 86400_000;

export function weekStart(ts = Date.now()) {
  const d = new Date(ts + OFF);
  const day = (d.getUTCDay() + 6) % 7; // дүйсенбі = 0
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - day) - OFF;
}
export function weekKey(ts = Date.now()) {
  return new Date(weekStart(ts) + OFF).toISOString().slice(0, 10);
}
export const prevWeekKey = (ts = Date.now()) => weekKey(weekStart(ts) - DAY);
export const weekEnd = (ts = Date.now()) => weekStart(ts) + 7 * DAY;
// Жүлде кезектеседі: тақ апта — бағалы сыйлық, жұп апта — монета
export function prizeKind(key) {
  const n = Math.floor(Date.parse(key) / (7 * DAY));
  return n % 2 ? "gift" : "coins";
}
export const COIN_PRIZES = [500, 300, 150];
