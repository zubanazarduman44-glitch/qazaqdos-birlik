// Сабақ жоспары: таза функциялар (React жоқ). Жаттығулар тізбегін құрады, жауапты тексереді,
// «Қайта орал» кезегін және сабақ күйін (reducer) басқарады.
import { WORDS, tr } from "./words";
import { PHRASES as PHRASES_ABC } from "./words2";
import { PHRASES_D } from "./words6";

const PHRASES = { ...PHRASES_ABC, ...PHRASES_D };

export const MAX_REPEATS = 2;

/* ── Көмекшілер ── */
export const explainLang = (explain) => (explain === "ru" ? "ru" : "en");
export const norm = (s) => String(s ?? "").trim().replace(/\s+/g, " ").toLowerCase();

// Тұқымнан қайталанатын кездейсоқ сан (тест пен скриншот үшін)
export function seededRng(seed) {
  const n = Number(seed) || 0;
  let a = (n >= 1 ? n : n * 4294967296) >>> 0;
  if (!a) a = 0x9e3779b9;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function hashSeed(str) {
  let h = 2166136261;
  for (const c of String(str)) h = Math.imul(h ^ c.codePointAt(0), 16777619);
  return (h >>> 0) || 1;
}

export function shuf(arr, rng = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
// Араластыру, бірақ бастапқы ретпен дәл келмесін (мүмкін болса)
function shufNot(arr, rng, same) {
  let out = shuf(arr, rng);
  for (let i = 0; i < 20 && same(out); i++) out = shuf(arr, rng);
  if (same(out)) out = [...out].reverse();
  return out;
}

/* ── Сабақ бірліктері: сөз де, сөйлем де бір пішінге келтіріледі ── */
export function lessonItems(lesson, explain) {
  const ex = explainLang(explain);
  if (!lesson) return [];
  if (lesson.kind === "phrases") return (lesson.phrases || []).map((p) => ({ kk: p.kk, tr: ex === "ru" ? p.ru : p.en, e: "" }));
  return (lesson.words || []).map((w) => ({ kk: w.kk, tr: tr(w, ex), e: w.e || "" }));
}

// Алаңдатқыш нұсқалар: алдымен осы тақырып, содан кейін бүкіл қор. Жазылуы да, аудармасы да қайталанбайды.
function pickDistractors(item, pool, n, rng, taken = []) {
  const kks = new Set([norm(item.kk), ...taken.map((x) => norm(x.kk))]);
  const trs = new Set([norm(item.tr), ...taken.map((x) => norm(x.tr))]);
  const out = [];
  for (const group of pool) {
    for (const c of shuf(group, rng)) {
      if (out.length >= n) return out;
      const k = norm(c.kk), t = norm(c.tr);
      if (!k || !t || kks.has(k) || trs.has(t)) continue;
      kks.add(k);
      trs.add(t);
      out.push(c);
    }
  }
  return out;
}

function pools(lesson, explain) {
  const ex = explainLang(explain);
  if (lesson.kind === "phrases") {
    const own = lessonItems(lesson, ex);
    const rest = Object.entries(PHRASES)
      .filter(([t]) => t !== lesson.topic)
      .flatMap(([, list]) => list.map(([kk, ru, en]) => ({ kk, tr: ex === "ru" ? ru : en, e: "" })));
    return [own, rest];
  }
  const all = WORDS.map((w) => ({ kk: w.kk, tr: tr(w, ex), e: w.e || "", t: w.t }));
  return [all.filter((w) => w.t === lesson.topic), all.filter((w) => w.t !== lesson.topic)];
}

/* ── Тақташалар ── */
// Сөз → әріптер (кіші әріппен); бірнеше сөз болса → сөздер. Қазақ әріптері бір таңба ретінде бөлінеді.
export function splitTiles(kk) {
  const s = String(kk ?? "").trim().replace(/\s+/g, " ");
  if (s.includes(" ")) return { mode: "words", parts: s.split(" ") };
  return { mode: "letters", parts: Array.from(s.toLowerCase()) };
}
// Сөйлем → сөздер; тыныс белгісі өз сөзіне жабысып тұрады, жеке сызықша алдыңғы сөзге қосылады.
export function sentenceTiles(kk) {
  const raw = String(kk ?? "").trim().split(/\s+/).filter(Boolean);
  const out = [];
  for (const tok of raw) {
    if (out.length && !/[\p{L}\p{N}]/u.test(tok)) out[out.length - 1] += " " + tok;
    else out.push(tok);
  }
  return out;
}
// Сөздің өзегі мен шетіндегі тыныс белгілері: «Айдос.» → ["", "Айдос", "."]
export function splitPunct(tok) {
  const m = /^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u.exec(String(tok));
  return m ? [m[1], m[2], m[3]] : ["", String(tok), ""];
}
const joinTiles = (parts, mode) => parts.join(mode === "letters" ? "" : " ");

// Құрастырылған жауапты тексеру: әріп регистрі мен шеткі бос орындар ескерілмейді
export function checkBuild(placed, answer, mode = "letters") {
  const got = Array.isArray(placed) ? joinTiles(placed.map((p) => (typeof p === "string" ? p : p?.ch ?? "")), mode) : String(placed ?? "");
  const a = norm(answer), g = norm(got);
  if (mode === "letters") return g.replace(/ /g, "") === a.replace(/ /g, "");
  return g === a;
}
export const checkOrder = (placed, answer) => checkBuild(placed, answer, "words");
export const checkChoice = (step, key) => norm(key) === norm(step.answer);

const mkTiles = (parts, rng, extra = []) => {
  const base = parts.map((ch, i) => ({ id: `t${i}`, ch }));
  const add = extra.map((ch, i) => ({ id: `x${i}`, ch, extra: true }));
  const sameOrder = (a) => a.filter((t) => !t.extra).every((t, i) => t.ch === parts[i]);
  return shufNot([...base, ...add], rng, sameOrder);
};

// Сөйлемге жатпайтын артық сөздер (алаңдатқыш тақташалар мен бос орын нұсқалары үшін)
function strayWords(item, pool, n, rng, { cap = null } = {}) {
  const own = new Set(sentenceTiles(item.kk).map((t) => norm(splitPunct(t)[1])));
  const seen = new Set(own);
  const out = [];
  for (const group of pool) {
    const cands = [];
    for (const p of group) {
      if (norm(p.kk) === norm(item.kk)) continue;
      sentenceTiles(p.kk).forEach((t, i) => {
        const core = splitPunct(t)[1];
        if (!core || core.includes(" ")) return;
        const lower = core[0] === core[0].toLowerCase();
        if (cap === true) cands.push(core[0].toUpperCase() + core.slice(1));
        else if (cap === false) {
          if (lower) cands.push(core);
          else if (i === 0) cands.push(core[0].toLowerCase() + core.slice(1)); // сөйлем басындағы бас әріп
        } else cands.push(core);
      });
    }
    for (const c of shuf(cands, rng)) {
      if (out.length >= n) return out;
      const k = norm(c);
      if (seen.has(k) || k.length < 2) continue;
      seen.add(k);
      out.push(c);
    }
  }
  return out;
}

/* ── Жеке қадамдарды жасаушылар ── */
const opt = (it, side, withE) => ({ key: it.kk, label: side === "kk" ? it.kk : it.tr, e: withE ? it.e : "" });

function mkChoose(item, dir, pool, rng) {
  const ds = pickDistractors(item, pool, 3, rng);
  const side = dir === "kk2tr" ? "tr" : "kk";
  return {
    type: "choose", dir, items: [item.kk], item,
    prompt: dir === "kk2tr" ? item.kk : item.tr,
    options: shuf([item, ...ds], rng).map((x) => opt(x, side, dir === "kk2tr")),
    answer: item.kk, answerLabel: dir === "kk2tr" ? item.tr : item.kk,
  };
}
function mkListen(item, pool, rng) {
  const ds = pickDistractors(item, pool, 3, rng);
  return { type: "listen", items: [item.kk], item, audio: item.kk, options: shuf([item, ...ds], rng).map((x) => opt(x, "kk", false)), answer: item.kk, answerLabel: item.kk };
}
function mkTrueFalse(item, pool, rng) {
  const truth = rng() < 0.5;
  const wrong = truth ? null : pickDistractors(item, pool, 1, rng)[0];
  const shown = wrong ? wrong.tr : item.tr;
  return { type: "truefalse", items: [item.kk], item, kk: item.kk, shown, answer: !wrong, answerLabel: `${item.kk} — ${item.tr}` };
}
function mkBuild(item, pool, rng) {
  const { mode, parts } = splitTiles(item.kk);
  const extra = mode === "words" && parts.length <= 3 ? strayWords(item, pool, 2, rng) : [];
  return { type: "build", mode, items: [item.kk], item, prompt: item.tr, solution: parts, tiles: mkTiles(parts, rng, extra), answer: item.kk, answerLabel: item.kk };
}
function mkOrder(item, pool, rng) {
  const parts = sentenceTiles(item.kk);
  const extra = parts.length <= 3 ? strayWords(item, pool, parts.length <= 2 ? 2 : 1, rng, { cap: false }) : [];
  return { type: "order", mode: "words", items: [item.kk], item, prompt: item.tr, solution: parts, tiles: mkTiles(parts, rng, extra), answer: item.kk, answerLabel: item.kk };
}
function mkGap(item, pool, rng) {
  const parts = sentenceTiles(item.kk);
  const cands = parts.map((t, i) => ({ i, core: splitPunct(t)[1] })).filter((c) => c.core && !c.core.includes(" "));
  // Мүмкін болса бірінші сөз емес (бас әріп жауапты ашып қоймасын) және тым қысқа емес сөз
  const long = cands.filter((c) => Array.from(c.core).length >= 3);
  const inner = long.filter((c) => c.i > 0);
  const from = inner.length ? inner : long.length ? long : cands;
  const pick = from[Math.floor(rng() * from.length)];
  const [pre, core, post] = splitPunct(parts[pick.i]);
  const capital = core[0] !== core[0].toLowerCase();
  const ds = strayWords(item, pool, 3, rng, { cap: capital });
  return {
    type: "gap", items: [item.kk], item, prompt: item.tr,
    before: [...parts.slice(0, pick.i), pre].join(" ").trim(), after: post, tail: parts.slice(pick.i + 1).join(" "),
    options: shuf([core, ...ds], rng).map((w) => ({ key: w, label: w, e: "" })),
    answer: core, answerLabel: item.kk,
  };
}
function mkMatch(group, lessonKks, rng) {
  return {
    type: "match", items: group.filter((p) => lessonKks.has(p.kk)).map((p) => p.kk),
    pairs: group.map((p) => ({ kk: p.kk, tr: p.tr, e: p.e })),
    left: shuf(group, rng).map((p) => p.kk), right: shuf(group, rng).map((p) => p.kk),
    answer: null, answerLabel: "",
  };
}
// Жұптар: жазылуы да, аудармасы да әртүрлі болуы керек
function uniquePairs(list) {
  const kks = new Set(), trs = new Set(), out = [];
  for (const p of list) {
    if (kks.has(norm(p.kk)) || trs.has(norm(p.tr))) continue;
    kks.add(norm(p.kk)); trs.add(norm(p.tr)); out.push(p);
  }
  return out;
}

const WORD_SEQ = ["choose:kk2tr", "choose:tr2kk", "listen", "truefalse", "build", "choose:tr2kk", "listen", "build", "truefalse", "choose:kk2tr", "build", "listen"];
const PHRASE_SEQ = ["choose:kk2tr", "gap", "order", "listen", "order", "truefalse", "gap", "choose:tr2kk", "order", "gap", "listen", "order"];

/* ── Жоспар ── */
export function buildPlan(lesson, explain, rng = Math.random) {
  const ex = explainLang(explain);
  const phrases = lesson?.kind === "phrases";
  const items = uniquePairs(lessonItems(lesson, ex).filter((x) => x.kk && x.tr));
  if (!items.length) return [];
  const pool = pools(lesson, ex);
  const kks = new Set(items.map((x) => x.kk));
  const n = items.length;

  // Жұптастыру топтары
  const groups = [];
  if (phrases) {
    if (n >= 3) groups.push(shuf(items, rng).slice(0, 4));
  } else {
    const order = shuf(items, rng);
    const first = order.slice(0, 5);
    if (first.length < 4) first.push(...pickDistractors(first[0], pool, 4 - first.length, rng, first));
    groups.push(first);
    if (n > 5) {
      const rest = order.slice(5);
      const pad = shuf(order.slice(0, 5), rng).slice(0, Math.max(0, 4 - rest.length));
      groups.push([...rest, ...pad]);
    }
  }
  const matches = groups.filter((g) => g.length >= 3).map((g) => mkMatch(g, kks, rng));

  const total = Math.min(12, Math.max(10, n + matches.length + 3));
  const singles = Math.max(total - matches.length, n);
  const seq = phrases ? PHRASE_SEQ : WORD_SEQ;
  const count = Object.fromEntries(items.map((x) => [x.kk, 0]));
  const used = Object.fromEntries(items.map((x) => [x.kk, new Set()]));
  const eligible = (it, key) => {
    if (key === "order" || key === "gap") return sentenceTiles(it.kk).length >= 2;
    if (key === "build") return Array.from(it.kk.trim()).length >= 2;
    return true;
  };
  const make = (it, key) => {
    if (key === "choose:kk2tr") return mkChoose(it, "kk2tr", pool, rng);
    if (key === "choose:tr2kk") return mkChoose(it, "tr2kk", pool, rng);
    if (key === "listen") return mkListen(it, pool, rng);
    if (key === "truefalse") return mkTrueFalse(it, pool, rng);
    if (key === "build") return mkBuild(it, pool, rng);
    if (key === "order") return mkOrder(it, pool, rng);
    return mkGap(it, pool, rng);
  };

  const out = [];
  let prev = null;
  for (let i = 0; i < singles; i++) {
    let key = seq[i % seq.length];
    // Ең аз жаттыққан, осы түрді әлі көрмеген, алдыңғы қадамда болмаған бірлік
    const rank = shuf(items, rng)
      .map((it) => ({ it, score: count[it.kk] * 10 + (used[it.kk].has(key) ? 4 : 0) + (it.kk === prev && n > 1 ? 3 : 0) + (eligible(it, key) ? 0 : 100) }))
      .sort((a, b) => a.score - b.score);
    let it = rank[0].it;
    if (!eligible(it, key)) {
      it = shuf(items, rng).sort((a, b) => count[a.kk] - count[b.kk])[0];
      key = ["choose:kk2tr", "listen", "choose:tr2kk", "truefalse"].find((k) => !used[it.kk].has(k)) || "choose:kk2tr";
    }
    count[it.kk]++;
    used[it.kk].add(key);
    prev = it.kk;
    out.push(make(it, key));
  }
  // Жұптастыру: біріншісі үш-төрт қадамнан кейін, екіншісі соңына таман
  if (matches[0]) out.splice(Math.min(phrases ? 4 : 3, out.length), 0, matches[0]);
  if (matches[1]) out.splice(Math.max(out.length - 2, 5), 0, matches[1]);
  return out.map((s, i) => ({ ...s, id: `s${i}`, origin: `s${i}`, repeat: 0 }));
}

/* ── «Қайта орал» ── */
// Қате жауап берілген қадамның қайталама нұсқасы (нұсқалар қайта араластырылады).
export function retryStep(step, wrong = [], rng = Math.random) {
  const repeat = (step.repeat || 0) + 1;
  const base = { ...step, repeat, id: `${step.origin || step.id}r${repeat}`, origin: step.origin || step.id };
  if (step.type === "match") {
    const bad = new Set(wrong);
    let pairs = step.pairs.filter((p) => bad.has(p.kk));
    for (const p of shuf(step.pairs, rng)) {
      if (pairs.length >= Math.min(3, step.pairs.length)) break;
      if (!pairs.includes(p)) pairs.push(p);
    }
    pairs = pairs.slice(0, 4);
    const keep = new Set(pairs.map((p) => p.kk));
    return { ...base, pairs, items: step.items.filter((k) => keep.has(k)), left: shuf(pairs, rng).map((p) => p.kk), right: shuf(pairs, rng).map((p) => p.kk) };
  }
  if (step.options) base.options = shuf(step.options, rng);
  if (step.tiles) {
    const sol = step.solution;
    base.tiles = shufNot(step.tiles, rng, (a) => a.filter((t) => !t.extra).every((t, i) => t.ch === sol[i]));
  }
  return base;
}

// Кезекті жаңарту: қате болса қадам соңына қайта қойылады (әр қадам ең көбі MAX_REPEATS рет қайталанады).
export function nextQueue(queue, step, correct, { wrong = [], rng = Math.random, max = MAX_REPEATS } = {}) {
  if (correct || (step.repeat || 0) >= max) return queue;
  return [...queue, retryStep(step, wrong, rng)];
}

/* ── Жұптастыру логикасы ── */
export const initMatch = () => ({ pick: null, locked: [], miss: null, wrong: [] });
// side: "l" | "r"; kk — сол жұптың қазақша кілті
export function matchTap(st, side, kk) {
  if (st.locked.includes(kk)) return { ...st, miss: null };
  if (!st.pick || st.pick.side === side) {
    const same = st.pick && st.pick.side === side && st.pick.kk === kk;
    return { ...st, pick: same ? null : { side, kk }, miss: null };
  }
  if (st.pick.kk === kk) return { ...st, pick: null, miss: null, locked: [...st.locked, kk] };
  const l = side === "l" ? kk : st.pick.kk, r = side === "r" ? kk : st.pick.kk;
  return { ...st, pick: null, miss: { l, r }, wrong: [...new Set([...st.wrong, l, r])] };
}
export const matchDone = (st, step) => st.locked.length >= step.pairs.length;

/* ── Сабақ күйі (reducer) ── */
export function initSession(plan, introCount = 0) {
  return { phase: introCount > 0 ? "intro" : plan.length ? "steps" : "summary", introIdx: 0, introN: introCount, queue: plan, pos: 0, first: {}, mistakes: [], answered: null };
}
export function sessionReducer(s, a) {
  switch (a.type) {
    case "reset":
      return initSession(a.plan, a.introCount);
    case "introNext":
      if (s.phase !== "intro") return s;
      if (s.introIdx + 1 < s.introN) return { ...s, introIdx: s.introIdx + 1 };
      return { ...s, phase: s.queue.length ? "steps" : "summary" };
    case "introBack":
      return s.phase === "intro" && s.introIdx > 0 ? { ...s, introIdx: s.introIdx - 1 } : s;
    case "answer": {
      if (s.phase !== "steps" || s.answered) return s;
      const step = s.queue[s.pos];
      if (!step) return s;
      const correct = !!a.correct;
      let wrong = correct ? [] : a.wrong?.length ? a.wrong : step.items;
      if (step.type === "match") wrong = wrong.filter((k) => step.items.includes(k));
      const first = step.repeat ? s.first : { ...s.first, [step.origin]: correct };
      const requeued = !correct && (step.repeat || 0) < MAX_REPEATS;
      return {
        ...s, first,
        mistakes: [...new Set([...s.mistakes, ...wrong])],
        queue: nextQueue(s.queue, step, correct, { wrong, rng: seededRng(a.seed ?? 0.5) }),
        answered: { correct, requeued },
      };
    }
    case "continue": {
      if (s.phase !== "steps" || !s.answered) return s;
      const pos = s.pos + 1;
      return pos >= s.queue.length ? { ...s, pos, phase: "summary", answered: null } : { ...s, pos, answered: null };
    }
    default:
      return s;
  }
}
export function sessionResult(s) {
  const vals = Object.values(s.first);
  const total = s.queue.filter((q) => !q.repeat).length;
  return { right: vals.filter(Boolean).length, total, mistakes: [...s.mistakes] };
}
export function sessionProgress(s) {
  const total = s.introN + s.queue.length;
  const done = s.phase === "intro" ? s.introIdx : s.phase === "summary" ? total : s.introN + s.pos + (s.answered ? 1 : 0);
  return { total, done, current: s.phase === "summary" || s.answered ? -1 : done };
}
