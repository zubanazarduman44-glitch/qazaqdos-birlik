// Саяхат бөлімінің мәтіндері басқа 8 тілде (zh, es, de, fr, tr, ar, ko, ja).
// Аударма файлы тіл таңдалғанда ғана жүктеледі, сосын деректер объектілеріне [lang] кілті болып қосылады,
// сондықтан L(obj, lang) бірден дұрыс тілде көрсетеді.
import { useEffect, useState } from "react";
import { REGIONS } from "./regions";

const LANGS = ["zh", "es", "de", "fr", "tr", "ar", "ko", "ja"];
const cache = {};

function load(lang) {
  if (!LANGS.includes(lang)) return Promise.resolve(null);
  if (!cache[lang]) {
    cache[lang] = import(`./l10n/travel/${lang}.js`).then((m) => m.default || null).catch(() => null);
  }
  return cache[lang];
}

const set = (obj, lang, v) => {
  if (obj && typeof obj === "object" && v) obj[lang] = v;
};

// extra: { sights: SIGHTS, labels: LBL } — RegionAtlas өзі береді (ол бөлек жүктеледі)
// about: lib/regionAbout.js-тің REGION_ABOUT (өңір мәтіндері ауыр, сондықтан тек керек кезде жүктеледі)
function patch(map, lang, extra = {}, about = null) {
  const byId = Object.fromEntries(REGIONS.map((r) => [r.id, r]));
  for (const [k, v] of Object.entries(map)) {
    if (k.startsWith("R.")) {
      const [, id, field, i] = k.split(".");
      const r = byId[id];
      if (!r) continue;
      if (field === "s") set(r.sights?.[Number(i)], lang, v);
      else set(r[field], lang, v);
    } else if (k.startsWith("A.")) set(about?.[k.slice(2)], lang, v);
    else if (k.startsWith("S.")) set(extra.sights?.[k.slice(2)]?.text, lang, v);
    else if (k.startsWith("LBL.")) set(extra.labels?.[k.slice(4)], lang, v);
  }
}

// Аударма жүктелген соң компонентті қайта салу үшін нұсқа нөмірін қайтарады
export function useTravelL10n(lang, extra) {
  const [ver, setVer] = useState(0);
  useEffect(() => {
    let dead = false;
    load(lang).then(async (map) => {
      if (!map || dead) return;
      const about = Object.keys(map).some((k) => k.startsWith("A.")) ? (await import("./regionAbout")).REGION_ABOUT : null;
      if (dead) return;
      patch(map, lang, extra, about);
      setVer((v) => v + 1);
    });
    return () => {
      dead = true;
    };
    // extra — модуль деңгейіндегі тұрақты объектілер
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);
  return ver;
}
