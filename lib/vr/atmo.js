// VR Әлем — әр кірудің ауа райы мен тәулік уақыты: нақты сағат пен Қазақстан климаты бойынша (қыста — қар).
// Бір күн ішінде бір орында тұрақты (seed + күн). Тексеру үшін URL: ?t=morning|day|evening|night&w=snow|rain|cloud|clear
const MEAN = [-14, -13, -5, 6, 14, 20, 22, 20, 13, 4, -5, -11]; // Астана, айлық орташа (°C)
const hash = (s) => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0; return (h % 10007) / 10007; };
const TODS = ["morning", "day", "evening", "night"];
const WXS = ["snow", "rain", "cloud", "clear"];

export function atmo(seed = "", d = new Date()) {
  const h = d.getHours(), m = d.getMonth();
  let tod = h >= 5 && h < 11 ? "morning" : h < 17 ? "day" : h < 21 ? "evening" : "night";
  const r = hash(`${seed}|${d.getFullYear()}-${m}-${d.getDate()}`);
  const cold = m >= 10 || m <= 2;
  let wx = cold ? (r < (m === 2 ? 0.35 : 0.6) ? "snow" : r < 0.8 ? "cloud" : "clear")
    : m === 3 || m === 4 || m === 8 || m === 9 ? (r < 0.3 ? "rain" : r < 0.6 ? "cloud" : "clear")
    : r < 0.12 ? "rain" : r < 0.3 ? "cloud" : "clear";
  try {
    const q = new URLSearchParams(window.location.search);
    if (TODS.includes(q.get("t"))) tod = q.get("t");
    if (WXS.includes(q.get("w"))) wx = q.get("w");
  } catch {}
  let temp = MEAN[m] + Math.round((r - 0.5) * 8) + (tod === "day" ? 3 : tod === "night" ? -4 : tod === "morning" ? -2 : 0);
  if (wx === "snow" && temp > -1) temp = -1 - Math.round(r * 4);
  if (wx === "rain" && temp < 3) temp = 3 + Math.round(r * 4);
  return { tod, wx, temp };
}

const KK_TOD = { morning: "Таң", day: "Күндіз", evening: "Кеш", night: "Түн" };
const KK_WX = { snow: "қар жауып тұр", rain: "жаңбыр жауып тұр", cloud: "бұлтты", clear: "ашық" };
// Кадрдағы қазақша жазу: «Кеш · қар жауып тұр · −6°»
export const atmoKk = (a) => `${KK_TOD[a.tod]} · ${KK_WX[a.wx]} · ${a.temp < 0 ? "−" : a.temp > 0 ? "+" : ""}${Math.abs(a.temp)}°`;
