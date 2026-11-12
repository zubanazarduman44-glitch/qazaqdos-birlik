// Тарих бөлімінің мәтіндері басқа 8 тілде. Тарихи атаулар (ескерткіш аттары) аударылмайды.
// Аударма тіл таңдалғанда ғана жүктеліп, SITES объектілеріне [lang] кілті болып қосылады.
import { useEffect, useState } from "react";
import { SITES } from "./history";

const LANGS = ["zh", "es", "de", "fr", "tr", "ar", "ko", "ja"];
const cache = {};
// Дәуір сүзгілерінің аттары мен жыл үлгілері: { lang: { "ERA.old": "...", "YEAR.bc": "{n} ..." } }
export const HIST_UI = {};

function load(lang) {
  if (!LANGS.includes(lang)) return Promise.resolve(null);
  if (!cache[lang]) cache[lang] = import(`./l10n/history/${lang}.js`).then((m) => m.default || null).catch(() => null);
  return cache[lang];
}

function patch(map, lang) {
  const byId = Object.fromEntries(SITES.map((s) => [s.id, s]));
  const ui = (HIST_UI[lang] = HIST_UI[lang] || {});
  for (const [k, v] of Object.entries(map)) {
    if (!v) continue;
    if (k.startsWith("H.")) {
      const [, id, field, i] = k.split(".");
      const s = byId[id];
      const obj = field === "a" ? s?.a?.[Number(i)] : s?.[field];
      if (obj && typeof obj === "object") obj[lang] = v;
    } else ui[k] = v;
  }
}

export function useHistoryL10n(lang) {
  const [ver, setVer] = useState(0);
  useEffect(() => {
    let dead = false;
    load(lang).then((map) => {
      if (!map || dead) return;
      patch(map, lang);
      setVer((v) => v + 1);
    });
    return () => {
      dead = true;
    };
  }, [lang]);
  return ver;
}
