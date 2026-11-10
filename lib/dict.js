// Жергілікті сөздік: сайттағы сөздерден жасалады, сұранысты күтпей лезде аударады.
import { WORDS } from "./words";
import { REGIONS } from "./regions";
import { SITES } from "./history";

let map = null;
const norm = (s) => String(s).toLowerCase().replace(/ё/g, "е").trim();

function build() {
  map = new Map();
  const add = (w) => {
    if (!w?.kk || !w.ru || !w.en) return;
    const k = norm(w.kk);
    if (!map.has(k)) map.set(k, { kk: w.kk, ru: w.ru, en: w.en, e: w.e });
  };
  WORDS.forEach(add);
  REGIONS.forEach((r) => (r.words || []).forEach(add));
  SITES.forEach((s) => (s.words || []).forEach(add));
}

// Дәл сөз ғана (жалғаусыз) — қате аударма болмауы үшін жалғаулы формаларды серверге береміз
export function lookupLocal(word) {
  if (!map) build();
  return map.get(norm(word)) || null;
}

// Барлық белгілі қазақша сөздер тізімі (аударма жүктеу үшін)
export function allKkWords() {
  if (!map) build();
  return [...map.values()].map((w) => w.kk);
}
