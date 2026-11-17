// «Ақсүйек» деректері мен тапсырма генераторының сынағы: node app/components/games/aqsuiek.test.mjs
import { LANGS, S, NIGHTS, RIDDLES, PROVERBS, LEVELS, W, H, HORIZON, makeTask, planNight, isPlain, confusers, clampPos, starsFor, pick } from "./aqsuiekData.js";

let fail = 0;
const ok = (cond, msg) => {
  if (!cond) {
    fail++;
    console.log("FAIL:", msg);
  }
};

// 1) Барлық мәтін 11 тілде, бос емес
const all11 = (arr, name) => ok(Array.isArray(arr) && arr.length === LANGS.length && arr.every((x) => typeof x === "string" && x.trim()), `${name}: 11 тіл керек`);
for (const [k, v] of Object.entries(S)) all11(v, `S.${k}`);
for (const n of NIGHTS) all11(n.name, `night ${n.id}`);
for (const r of RIDDLES) all11(r.tr, `riddle ${r.id}`);
for (const p of PROVERBS) all11(p.mean, `proverb ${p.id}`);
ok(pick(S.next, "xx") === S.next[2], "белгісіз тіл → ағылшынша");

// 2) Жұмбақтар: 4 нұсқа, қайталанбайды, аудармасы бар; түн санынан кем емес
ok(RIDDLES.length >= NIGHTS.length, "жұмбақ саны ≥ түн саны");
for (const r of RIDDLES) {
  ok(r.opts.length === 4 && new Set(r.opts.map((o) => o.kk)).size === 4, `${r.id}: 4 түрлі нұсқа`);
  ok(r.opts.every((o) => o.ru && o.en), `${r.id}: нұсқа аудармасы`);
  ok(/[.!?]$/.test(r.kk), `${r.id}: сөйлем белгісі`);
}

// 3) Мақалдар: бөлік саны = түн саны, бөліктер бірегей
for (const p of PROVERBS) {
  ok(p.parts.length === NIGHTS.length, `${p.id}: ${NIGHTS.length} бөлік`);
  ok(new Set(p.parts).size === p.parts.length, `${p.id}: бөліктер бірегей (ретін тексеру үшін)`);
}

// 4) Орындар сахна ішінде, жерде, бір-бірінен алыс
for (const n of NIGHTS) {
  ok(n.spots.length >= LEVELS[LEVELS.length - 1].bones + 1, `${n.id}: орын жеткілікті`);
  for (const [x, y] of n.spots) ok(x > 10 && x < W - 10 && y > HORIZON && y < H - 6, `${n.id}: орын ${x},${y} сахнада`);
  for (let i = 0; i < n.spots.length; i++)
    for (let j = i + 1; j < n.spots.length; j++) {
      const d = Math.hypot(n.spots[i][0] - n.spots[j][0], n.spots[i][1] - n.spots[j][1]);
      ok(d >= 28, `${n.id}: ${i}–${j} тым жақын (${d.toFixed(0)})`);
    }
  ok(n.spots.every(([x, y]) => Math.hypot(x - n.start[0], y - n.start[1]) > LEVELS[0].r * 0.42), `${n.id}: бастапқы нүкте сүйекке тым жақын емес`);
}

// 5) Тапсырма генераторы
const WORDS = [
  ["family", "ана", "мама", "mother"], ["family", "әке", "папа", "father"], ["family", "бала", "ребёнок", "child"], ["family", "аға", "старший брат", "older brother"],
  ["nature", "жұлдыз", "звезда", "star"], ["nature", "өзен", "река", "river"], ["nature", "тау", "гора", "mountain"], ["nature", "көл", "озеро", "lake"],
  ["animals", "қой", "овца", "sheep"], ["animals", "түйе", "верблюд", "camel"], ["animals", "жылқы", "лошадь", "horse"], ["animals", "ит", "собака", "dog"],
  ["food", "нан", "хлеб", "bread"], ["food", "қымыз", "кумыс", "kumis"], ["food", "ет", "мясо", "meat"], ["greet", "Сәлем", "Привет", "Hello"],
  ["travel", "жол", "дорога", "road"], ["travel", "пойыз", "поезд", "train"], ["travel", "қала", "город", "city"], ["numbers", "бес", "пять", "five"],
  ["colors", "ақ", "белый", "white"], ["colors", "қызыл", "красный", "red"], ["travel", "ұшақ", "самолёт", "plane"], ["greet", "Қайырлы таң", "Доброе утро", "Good morning"],
].map(([t, kk, ru, en]) => ({ t, kk, ru, en }));
const trf = (w) => w.en;
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

for (let n = 0; n < 300; n++) {
  const w = WORDS[n % WORDS.length];
  for (const type of ["meaning", "translate", "gap", "build"]) {
    const t = makeTask(w, type, WORDS, trf, rnd);
    if (t.type === "meaning" || t.type === "translate") {
      ok(t.options.length === 4, `${w.kk}/${type}: 4 нұсқа`);
      ok(t.options.filter((o) => o.key === t.answer).length === 1, `${w.kk}/${type}: бір ғана дұрыс жауап`);
      ok(new Set(t.options.map((o) => o.label.toLowerCase())).size === 4, `${w.kk}/${type}: нұсқалар қайталанбайды`);
    } else if (t.type === "gap") {
      ok(isPlain(w.kk), `${w.kk}: gap тек қарапайым сөзге`);
      ok(t.prompt.replace("_", t.answer) === w.kk.toLowerCase(), `${w.kk}: gap қалпына келеді`);
      ok(t.gapAt > 0, `${w.kk}: бірінші әріп жасырылмайды`);
      ok(t.options.length === 4 && new Set(t.options.map((o) => o.key)).size === 4, `${w.kk}: gap 4 түрлі әріп`);
    } else {
      ok(t.type === "build" && isPlain(w.kk), `${w.kk}: build тек қарапайым сөзге`);
      ok(t.letters.map((l) => l.c).sort().join("") === [...w.kk.toLowerCase()].sort().join(""), `${w.kk}: әріптер толық`);
      ok(t.letters.map((l) => l.c).join("") !== t.answer, `${w.kk}: әріптер араласқан`);
    }
    if (type === "gap" || type === "build") if (!isPlain(w.kk)) ok(t.type === "meaning", `${w.kk}: күрделі сөз → meaning`);
  }
}
for (const ch of "аәоөуүұыіқкғгңнжш") {
  const c = confusers(ch, rnd);
  ok(c.length === 3 && !c.includes(ch) && new Set(c).size === 3, `confusers(${ch})`);
}

// 6) Түн жоспары: сүйек саны деңгейге сай, сөздер қайталанбайды, ақ сүйек бос орында
for (let lv = 1; lv <= LEVELS.length; lv++)
  for (let n = 0; n < NIGHTS.length; n++) {
    const used = new Set();
    const p = planNight(n, lv, WORDS, trf, rnd, used);
    ok(p.bones.length === LEVELS[lv - 1].bones, `L${lv} N${n}: ${LEVELS[lv - 1].bones} сүйек`);
    ok(new Set(p.bones.map((b) => b.task.word.kk)).size === p.bones.length, `L${lv} N${n}: сөздер бірегей`);
    ok(!p.bones.some((b) => b.x === p.white.x && b.y === p.white.y), `L${lv} N${n}: ақ сүйек бөлек орында`);
  }

// 7) Шекаралар мен жұлдыздар
const [cx, cy] = clampPos([-50, 999]);
ok(cx >= 0 && cy <= H, "clampPos");
ok(starsFor(10, 10) === 3 && starsFor(7, 10) === 2 && starsFor(3, 10) === 1, "starsFor");

console.log(fail ? `${fail} FAILED` : "aqsuiek: all ok");
process.exit(fail ? 1 : 0);
