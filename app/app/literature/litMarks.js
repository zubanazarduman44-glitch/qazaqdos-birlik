// Оқу мәтініндегі сөз белгілері: «Апта сөзі» · «Үйреніп жатырсың» · «Меңгерілді».
// Дереккөздер (state қалпы өзгермейді, тек оқылады):
//   state.vocab            — сақталған сөздер (WordTap / Сөздік)
//   state.review           — қайталау қораптары (lib/review.js): { kk: { box, due, miss } }
//   state.sozdik.learned   — Сөздікте «үйрендім» деп белгіленген сөздер
//   state.sozdik.days      — күн сайынғы 10 сөз; осы аптаның (дүйсенбі–жексенбі) сөздері — «Апта сөзі»
import { dayKey } from "../../components/Store";

// Қайталауда 4-қорапқа жеткен сөз (қатарынан үш дұрыс жауап, келесі аралық 7+ күн) — «меңгерілді»
export const MASTER_BOX = 4;

const norm = (s) => String(s || "").toLowerCase().replace(/ё/g, "е").replace(/[­́]/g, "");

// Сөздік формасы → кілт: жақшадағы түсініктеме мен балама нұсқалар алынады; тіркес (бірнеше сөз) белгіленбейді
export function keyOf(kk) {
  const s = norm(kk).replace(/\(.*?\)/g, " ").split(/[,;/]/)[0].replace(/[!?.…«»"“”:]/g, "").trim();
  return s && /^[\p{L}\p{M}][\p{L}\p{M}'’-]*$/u.test(s) ? s : null;
}

// ── Жалғаулар (қатаң тізім: түбірге тек нағыз грамматикалық жалғау ғана жалғанады) ──
const PL = "(?:лар|лер|дар|дер|тар|тер)";
const POSS = "(?:ымыз|іміз|ыңыз|іңіз|мыз|міз|ңыз|ңіз|ым|ім|ың|ің|сы|сі|м|ң|ы|і)";
const POSS2 = "(?:ымыз|іміз|ыңыз|іңіз|мыз|міз|ңыз|ңіз|ым|ім|ың|ің|сы|сі)";
const CASE = "ның|нің|дың|дің|тың|тің|ға|ге|қа|ке|ны|ні|ды|ді|ты|ті|да|де|та|те|дан|ден|тан|тен|нан|нен|мен|бен|пен";
const CASE_B = `(?:${CASE})`; // жалаң түбірден кейін
const CASE_P = `(?:${CASE}|нда|нде|на|не|а|е|н)`; // тәуелдік жалғаудан кейін
const EXTRA = "(?:дағы|дегі|тағы|тегі|ндағы|ндегі|дай|дей|тай|тей|ша|ше|мын|мін|бын|бін|пын|пін|сың|сің|сыз|сіз|быз|біз|пыз|піз|ма|ме|ба|бе|па|пе)";
const NOUN = new RegExp(`^${PL}?(?:${POSS}${CASE_P}?|${CASE_B})?${EXTRA}?$`);
// Екі әріпті түбір (үй, су, ел): жалғыз әріпті жалғауға рұқсат жоқ — «ой» → «ойын» сияқты бөтен сөз белгіленбейді
// («ер» → «ерте» болмауы үшін қысқа түбірге -та/-те жатыс жалғауы да алынбайды)
const CASE_S = `(?:${CASE.replace("|та|те", "")})`;
const NOUN_SHORT = new RegExp(`^(?:${PL}(?:${POSS}${CASE_P}?|${CASE_B})?|${POSS2}${CASE_P}?|[ыі](?:нда|нде|на|не|нің|ның|нан|нен)|${CASE_S})$`);
// Етістік: (дәнекер дауысты) + негізгі жұрнақ + ең көбі екі қосымша
const LINK = "[ыіаеий]?";
const VCORE = "(?:ды|ді|ты|ті|ған|ген|қан|кен|тын|тін|п|у|са|се|сын|сін|ма|ме|ба|бе|па|пе|р|с|йын|йін|ңыз|ңіз|ңдар|ңдер|ғы|гі|қы|кі|мақ|мек|бақ|бек|пақ|пек|шы|ші|мын|мін|сың|сің|сыз|сіз|мыз|міз)";
const VTAIL = `(?:[ыіаеий]?(?:ды|ді|ты|ті|ған|ген|қан|кен|тын|тін|п|сын|сін|са|се|мын|мін|сың|сің|сыз|сіз|мыз|міз|м|ң|қ|к|ңыз|ңіз|сы|сі|ы|і|${CASE}|нда|нде|на|не|н|лар|лер|дар|дер|тар|тер|й|з))`;
const VERB = new RegExp(`^${LINK}${VCORE}${VTAIL}{0,2}$`);
const VOWEL0 = /^[аәеиоөұүыіэюя]/;
const VOICE = { п: "б", к: "г", қ: "ғ" };
const DEVOICE = { б: "п", г: "к", ғ: "қ" };

// Етістік пе? (сөздік формасы -у және аудармасы етістік: «-ть», «to …»)
const verbHint = (i) => !!i && [i.ru, i.en, i.tr].some((t) => /^to\s/i.test(t || "") || /(ть|ться|чь|чься|ти|тись)$/i.test(String(t || "").trim()));

// Осы аптаның күн кілттері (дүйсенбіден бүгінге дейін, жергілікті уақыт)
export function weekDays(now = new Date()) {
  const back = (now.getDay() + 6) % 7;
  const out = [];
  for (let i = back; i >= 0; i--) out.push(dayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)));
  return out;
}

// state → { status: Map<кілт, "week"|"learn"|"ok">, saved: Set<кілт>, match(сөз) → кілт | null }
export function buildMarks(state, lookup) {
  const vocab = state?.vocab || [];
  const sz = state?.sozdik || {};
  const info = new Map();
  const saved = new Set();
  for (const v of vocab) {
    const k = keyOf(v?.kk);
    if (!k) continue;
    saved.add(k);
    if (!info.has(k)) info.set(k, v);
  }
  const review = new Map();
  for (const [kk, r] of Object.entries(state?.review || {})) {
    const k = keyOf(kk);
    if (k && r) review.set(k, Math.max(review.get(k) || 0, r.box || 1));
  }
  const learned = new Set(Object.keys(sz.learned || {}).map(keyOf).filter(Boolean));
  const week = new Set();
  for (const d of weekDays()) for (const kk of sz.days?.[d] || []) {
    const k = keyOf(kk);
    if (k) week.add(k);
  }

  const status = new Map();
  for (const k of new Set([...saved, ...review.keys(), ...learned, ...week])) {
    const box = review.get(k);
    const ok = box ? box >= MASTER_BOX : learned.has(k);
    status.set(k, ok ? "ok" : week.has(k) ? "week" : "learn");
  }

  // Түбірлер: сөздің өзі (зат есім ережесі), етістік түбірі (-у-сыз), дыбыс алмасуы (кітап → кітабы, табу → тапты)
  const stems = new Map();
  const add = (stem, rule) => {
    if (stem.length < 2) return;
    if (!stems.has(stem)) stems.set(stem, []);
    stems.get(stem).push(rule);
  };
  for (const k of status.keys()) {
    if (k.length < 2) continue;
    add(k, { k, re: k.length === 2 ? NOUN_SHORT : NOUN });
    const last = k.at(-1);
    if (VOICE[last] && k.length >= 3) add(k.slice(0, -1) + VOICE[last], { k, re: NOUN, vowel: true });
    if (last === "у" && k.length >= 3 && verbHint(info.get(k) || lookup?.(k))) {
      const s = k.slice(0, -1);
      add(s, { k, re: VERB, short: s.length === 2 });
      const sl = s.at(-1);
      if (DEVOICE[sl] && s.length >= 3) add(s.slice(0, -1) + DEVOICE[sl], { k, re: VERB, cons: true });
    }
  }

  const cache = new Map();
  function match(word) {
    const w = norm(word);
    if (cache.has(w)) return cache.get(w);
    let hit = status.has(w) ? w : null;
    for (let i = w.length - 1; !hit && i >= 2; i--) {
      const rules = stems.get(w.slice(0, i));
      if (!rules) continue;
      const rem = w.slice(i);
      for (const r of rules) {
        if (r.vowel && !VOWEL0.test(rem)) continue;
        if (r.cons && VOWEL0.test(rem)) continue;
        if (r.short && (rem.length < 2 || !/^[ыіаеи]/.test(rem))) continue;
        if (r.re.test(rem)) {
          hit = r.k;
          break;
        }
      }
    }
    cache.set(w, hit);
    return hit;
  }
  return { status, saved, match, size: status.size };
}

// Сөйлемді бөліктерге бөлу: жай мәтін + белгіленген сөздер. found — табылған кілттер жиналады
const TOKEN = /[\p{L}\p{M}]+(?:[-'’][\p{L}\p{M}]+)*/gu;
export function markParts(text, marks, found) {
  if (!marks?.size) return [text];
  const out = [];
  let at = 0;
  for (const m of text.matchAll(TOKEN)) {
    const k = marks.match(m[0]);
    if (!k) continue;
    if (m.index > at) out.push(text.slice(at, m.index));
    out.push({ w: m[0], k, st: marks.status.get(k) });
    found?.add(k);
    at = m.index + m[0].length;
  }
  if (at < text.length) out.push(text.slice(at));
  return out;
}
