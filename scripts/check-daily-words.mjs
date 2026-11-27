// «Бүгінгі 10 сөз» тексеру (lib/wordsDaily.js): деңгейге сай пул, тұрақты күн тізімі, үйренген сөздер.
// Іске қосу: node --no-warnings scripts/check-daily-words.mjs   (қате болса — шығу коды 1)
// Тексерілетіні:
//  1) әр сөздің деңгейі бар; «сыни ойлау» сияқты B2 тіркестер — B2; A1-де тіркес тек сәлемдесу/сандар/негізгі тізімде;
//  2) A0/A1/деңгейсіз оқушыға 120 күн бойы тек A1 сөздер, әр күні 10 бөлек сөз, әр мақсатпен;
//  3) бір күн — бір тізім (сол тұқыммен қайта таңдау бірдей); үйренген сөздер қайта шықпайды;
//  4) A1 таусылса — A2-ге кеңейеді (B1/B2-ге емес); A2/B1/B2 оқушыға өз деңгейі мен көршісі;
//  5) ескі (деңгейсіз) тізімді бір рет қайта таңдау ережесі: белгіленген сөзі бар тізім өзгермейді.
import { register } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

register(
  "data:text/javascript," +
    encodeURIComponent(`export async function resolve(s, c, next) {
      try { return await next(s, c); } catch (e) { if (s.startsWith(".") && !s.endsWith(".js")) return next(s + ".js", c); throw e; }
    }`),
  import.meta.url
);

const root = fileURLToPath(new URL("..", import.meta.url));
const imp = (p) => import(pathToFileURL(root + p).href);
const { WORDS } = await imp("lib/words.js");
const D = await imp("lib/wordsDaily.js");

let errors = 0;
const fail = (m) => { errors++; console.log(`   ✗ ${m}`); };
const ok = (m) => console.log(`✓ ${m}`);
const uniq = WORDS.filter((w, i, a) => a.findIndex((z) => z.kk === w.kk) === i);
const lv = new Map(uniq.map((w) => [w.kk, D.levelOfWord(w)]));
const GOALS = [null, "travel", "study", "work", "life"];
const day = (i) => new Date(Date.UTC(2026, 0, 1) + i * 86400000).toISOString().slice(0, 10);

// 1) деңгейлер
{
  const n0 = errors;
  for (const w of uniq) if (!["A1", "A2", "B1", "B2"].includes(lv.get(w.kk))) fail(`${w.kk}: деңгей жоқ`);
  for (const k of ["сыни ойлау", "жасанды интеллект", "келісімшарт", "жел электр станциясы"]) if (lv.get(k) === "A1" || lv.get(k) === "A2") fail(`«${k}» — ${lv.get(k)} (бастаушыға тым күрделі)`);
  for (const k of ["от", "жол", "су", "нан", "ана", "Сәлем", "бір"]) if (lv.has(k) && !["A1", "A2"].includes(lv.get(k))) fail(`«${k}» — ${lv.get(k)} (жеңіл сөз)`);
  for (const k of ["жол", "су", "нан", "ана", "Сәлем", "бір"]) if (lv.get(k) !== "A1") fail(`«${k}» A1 болуы керек, ${lv.get(k)}`);
  for (const w of uniq) if (lv.get(w.kk) === "A1" && /\s/.test(w.kk.trim()) && w.src !== 0 && !["greet", "numbers"].includes(w.t)) fail(`A1 тіркес: ${w.kk}`);
  const cnt = {};
  for (const l of lv.values()) cnt[l] = (cnt[l] || 0) + 1;
  if ((cnt.A1 || 0) < 150) fail(`A1 пулы тым аз: ${cnt.A1}`);
  if (errors === n0) ok(`деңгейлер: ${Object.entries(cnt).map(([k, v]) => `${k} ${v}`).join(", ")}`);
}

// 2–3) бастаушы: тек A1, тұрақты, үйренгені қайталанбайды
for (const cefr of [null, "A0", "A1"]) for (const goal of GOALS) {
  const n0 = errors;
  const learned = {};
  for (let i = 0; i < 120; i++) {
    const k = day(i);
    const a = D.pickDaily({ words: uniq, learned, cefr, goal, rnd: D.seeded(k) }).map((w) => w.kk);
    const b = D.pickDaily({ words: uniq, learned, cefr, goal, rnd: D.seeded(k) }).map((w) => w.kk);
    if (a.join() !== b.join()) fail(`${cefr}/${goal} ${k}: тізім тұрақсыз`);
    if (a.length !== 10 || new Set(a).size !== 10) fail(`${cefr}/${goal} ${k}: ${a.length} сөз / қайталау бар`);
    const above = a.filter((x) => lv.get(x) !== "A1");
    // A1 пулы таусылғаннан кейін ғана A2 рұқсат
    const freeA1 = uniq.filter((w) => lv.get(w.kk) === "A1" && !learned[w.kk]).length;
    if (above.length && freeA1 >= 10) fail(`${cefr}/${goal} ${k}: A1 емес сөздер: ${above.join(", ")}`);
    const freeA = uniq.filter((w) => ["A1", "A2"].includes(lv.get(w.kk)) && !learned[w.kk]).length;
    if (freeA >= 10 && a.some((x) => ["B1", "B2"].includes(lv.get(x)))) fail(`${cefr}/${goal} ${k}: A сөздері таусылмай тұрып B деңгейлі сөз шықты`);
    if (i < 24 && above.length) fail(`${cefr}/${goal} ${k}: алғашқы 24 күнде A1 емес сөз`);
    if (a.some((x) => learned[x])) fail(`${cefr}/${goal} ${k}: үйренген сөз қайта шықты`);
    for (const x of a) learned[x] = i + 1; // оқушы бәрін үйренді
  }
  if (errors === n0) ok(`${cefr ?? "деңгейсіз"} · мақсат ${goal ?? "жоқ"}: 120 күн — A1 (таусылған соң A2), тұрақты, қайталанбайды`);
}

// 4) басқа деңгейлер
for (const [cefr, allow] of [["A2", ["A2", "A1"]], ["B1", ["B1", "A2"]], ["B2", ["B2", "B1"]]]) {
  const n0 = errors;
  for (let i = 0; i < 30; i++) {
    const a = D.pickDaily({ words: uniq, cefr, goal: GOALS[i % 5], rnd: D.seeded(day(i)) });
    const bad = a.filter((w) => !allow.includes(lv.get(w.kk)));
    if (bad.length) fail(`${cefr}: деңгейден тыс ${bad.map((w) => `${w.kk}(${lv.get(w.kk)})`).join(", ")}`);
  }
  if (errors === n0) ok(`${cefr}: тек ${allow.join("/")}`);
}

// «Жаңа 10 сөз»: бүгінгілер қайталанбайды
{
  const first = D.pickDaily({ words: uniq, cefr: "A1", rnd: D.seeded("x") });
  const ex = new Set(first.map((w) => w.kk));
  const next = D.pickDaily({ words: uniq, cefr: "A1", exclude: ex });
  if (next.some((w) => ex.has(w.kk)) || next.some((w) => lv.get(w.kk) !== "A1")) fail("«Жаңа 10 сөз»: қайталанды не деңгейден асты");
  else ok("«Жаңа 10 сөз»: жаңа 10 A1 сөз");
}

// 5) ескі тізім
{
  const old = ["от", "жол", "сыни ойлау", "нан", "су", "ана", "әке", "бала", "үй", "қала"].filter((k) => lv.has(k));
  if (!D.needsRepick(old, uniq, "A1", {})) fail("ескі тізім «сыни ойлау»-мен қайта таңдалмайды");
  if (D.needsRepick(old, uniq, "A1", { нан: 1 })) fail("белгіленген сөзі бар ескі тізім өзгеріп кетеді");
  if (D.needsRepick(["жол", "нан", "су"], uniq, null, {})) fail("A1 тізім бекер қайта таңдалады");
  if (D.needsRepick(old, uniq, "B2", {})) fail("B2 оқушының тізімі бекер қайта таңдалады");
  if (errors === 0) ok("ескі тізім ережесі: деңгейден асса және белгісі жоқ болса ғана бір рет қайта таңдау");
}

if (errors) {
  console.log(`\n✗ ${errors} қате`);
  process.exit(1);
}
console.log("\n✓ Бүгінгі 10 сөз: барлық тексеру өтті");
