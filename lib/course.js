// Курс құрылымы: деңгей → тақырып (бөлім) → сабақтар. Сабақтар сөз қорынан автоматты жасалады.
import { TOPICS, WORDS } from "./words";
import { PHRASES as PHRASES_ABC } from "./words2";
import { PHRASES_D } from "./words6";

const PHRASES = { ...PHRASES_ABC, ...PHRASES_D };

export const LEVELS = [
  { id: "A1", units: ["greet", "family", "numbers", "colors", "food", "animals", "home", "body", "clothes", "time"] },
  { id: "A2", units: ["school", "city", "verbs", "adj", "weather", "nature", "jobs", "transport", "health", "shop", "direction", "travel"] },
  { id: "B1", units: ["feelings", "hobby", "tradition", "tech", "society", "eco", "work", "hist"] },
  { id: "B2", units: ["media", "economy", "science", "art", "edu", "law", "mind", "idiom"] },
];

const CHUNK = 5;

export function unitLessons(topic) {
  const words = WORDS.filter((w) => w.t === topic);
  const out = [];
  for (let i = 0; i < words.length; i += CHUNK) {
    const part = words.slice(i, i + CHUNK);
    if (part.length < 3 && out.length) {
      out[out.length - 1].words.push(...part);
      continue;
    }
    out.push({ id: `${topic}-w${out.length + 1}`, kind: "words", topic, words: part });
  }
  const ph = PHRASES[topic];
  if (ph?.length) out.push({ id: `${topic}-p`, kind: "phrases", topic, phrases: ph.map(([kk, ru, en]) => ({ kk, ru, en })) });
  return out;
}

export const UNITS = Object.fromEntries(LEVELS.flatMap((l) => l.units).map((t) => [t, { topic: t, meta: TOPICS[t], lessons: unitLessons(t) }]));
export const ALL_LESSONS = Object.values(UNITS).flatMap((u) => u.lessons);
export const lessonById = (id) => ALL_LESSONS.find((l) => l.id === id);
export const lessonTitle = (l, lang) => {
  const m = TOPICS[l.topic];
  const n = (m && (m[lang] || m.en || m.kk)) || l.topic;
  const idx = UNITS[l.topic].lessons.findIndex((x) => x.id === l.id) + 1;
  return `${n} · ${idx}`;
};
export const levelStats = (lv, done) => {
  const ls = lv.units.flatMap((u) => UNITS[u].lessons);
  return { total: ls.length, done: ls.filter((l) => done?.[l.id]).length };
};
