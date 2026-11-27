// «Бүгінгі 10 сөз»: оқушының деңгейіне сай сөз таңдау (Сөздік беті және scripts/check-daily-words.mjs).
//
// Сөздерде CEFR белгісі жоқ, сондықтан деңгейді осы ережемен анықтаймыз (levelOfWord):
//  1) Негізгі бастапқы тізім (lib/words.js басындағы W(...) сөздер, src 0) — A1: ана, су, жол, үй, күн...
//  2) Қалған сөздерге — Жаттығу курсындағы тақырып деңгейі (lib/courseIndex.js LEVELS):
//     A1 — greet, family, numbers, colors, food, animals, home, body, clothes, time; A2 — school, city, verbs...;
//     B1 — feelings, tech, society, work, hist...; B2 — media, economy, science, art, edu, law, mind, idiom.
//  3) A1 тақырыбындағы сөз A1 болып қалады, егер: бастапқы тізімнен не бірінші кеңейтуден (words2) келсе
//     (words3/4-тен тек сәлемдесу, сандар, апта күндері мен айлар), бір сөз болса (сәлемдесу мен сандарда
//     тіркес болуы мүмкін) және ұзындығы 10 әріптен аспаса. Әйтпесе A2.
//  4) words6 (B2 «Қыстау» сөз қоры) — әрқашан B2.
// Сонда «сыни ойлау» (mind, B2) A0/A1 оқушыға шықпайды.
//
// Оқушы деңгейі: state.cefr (Деңгей тестінің нәтижесі: A0, A1, A2, B1, B2). Жоқ болса — бастаушы (A1).
// Алдымен деңгей пулы, үйренбеген сөздер азайса ғана көрші деңгейге кеңейеді; сосын мақсат (pickForGoal).
import { LEVELS } from "./courseIndex";
import { pickForGoal } from "./goals";

const TOPIC_LEVEL = Object.fromEntries(LEVELS.flatMap((l) => l.units.map((u) => [u, l.id])));
const PHRASE_OK = new Set(["greet", "numbers"]);
const letters = (s) => (s.match(/\p{L}/gu) || []).length;

export function levelOfWord(w) {
  if (!w) return "B2";
  if (w.src === 0) return "A1";
  if (w.src === 5) return "B2";
  const lv = TOPIC_LEVEL[w.t] || "B2";
  if (lv !== "A1") return lv;
  // Кейінгі кеңейтулер (words3/4) A1 тақырыптарында да арнайы сөздер береді (кимешек, саукеле, шанышқы):
  // олардан тек сәлемдесу/есімдіктер, сандар және апта күндері мен айлар — A1
  if (w.src >= 2 && !A1_EXTRA[w.src]?.has(w.t)) return "A2";
  const parts = w.kk.trim().split(/[\s-]+/);
  if (parts.length > 1 && !PHRASE_OK.has(w.t)) return "A2";
  if (parts.some((p) => letters(p) > 10)) return "A2";
  return "A1";
}
const A1_EXTRA = { 2: new Set(["greet", "numbers"]), 3: new Set(["time"]) };

// Деңгей бойынша кезек: бірінші топ — негізгі пул, қалғаны — сөз таусылғанда ғана
export function tiersFor(cefr) {
  switch (cefr) {
    case "A2": return [["A2", "A1"], ["B1"], ["B2"]];
    case "B1": return [["B1", "A2"], ["A1"], ["B2"]];
    case "B2": return [["B2", "B1"], ["A2"], ["A1"]];
    default: return [["A1"], ["A2"], ["B1"], ["B2"]]; // null, A0, A1
  }
}
export const mainBands = (cefr) => new Set(tiersFor(cefr)[0]);

// Тұрақты кездейсоқ сан (бір күнге бір тізім)
export function seeded(seed) {
  let h = 2166136261;
  for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)), ((h >>> 0) % 100000) / 100000);
}

// words — бірегей сөздер; learned — { kk: ts }; exclude — Set(kk) (мысалы, «Жаңа 10 сөз» кезінде бүгінгілер)
export function pickDaily({ words, learned = {}, cefr = null, goal = null, rnd = Math.random, exclude = null, n = 10 }) {
  const lv = new Map(words.map((w) => [w.kk, levelOfWord(w)]));
  const free = (w) => !exclude?.has(w.kk);
  let pool = [];
  const allowed = new Set();
  for (const tier of tiersFor(cefr)) {
    for (const b of tier) allowed.add(b);
    pool = words.filter((w) => free(w) && allowed.has(lv.get(w.kk)) && !learned[w.kk]);
    if (pool.length >= n) break;
  }
  // Бәрі үйренілсе — негізгі деңгейдің сөздерін қайталаймыз
  if (pool.length < n) {
    const main = mainBands(cefr);
    pool = words.filter((w) => free(w) && main.has(lv.get(w.kk)));
  }
  const order = pool.map((w) => [rnd(), w]).sort((a, b) => a[0] - b[0]).map((p) => p[1]);
  return pickForGoal(order, goal, n);
}

const RANK = { A1: 1, A2: 2, B1: 3, B2: 4 };
const topBand = (cefr) => Math.max(...[...mainBands(cefr)].map((b) => RANK[b]));

// Бұрынғы нұсқа (деңгейсіз) таңдаған бүгінгі тізімде оқушының деңгейінен жоғары сөз болса және
// бір сөзі де әлі белгіленбесе — бір рет қайта таңдауға болады
export function needsRepick(list, words, cefr, learned = {}) {
  if (!list?.length) return false;
  if (list.some((k) => learned[k])) return false;
  const byKk = new Map(words.map((w) => [w.kk, w]));
  const top = topBand(cefr);
  return list.some((k) => RANK[levelOfWord(byKk.get(k))] > top);
}
