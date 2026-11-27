// Бастау жолын тексеру: «нақты прогресс» ережесі, деңгей тестінің нәтижесін бір рет сақтау, лендинг санақтары.
// Іске қосу: node --no-warnings scripts/check-start-flow.mjs   (қате болса — шығу коды 1)
// Тексерілетіні:
//  1) бос профиль / бастапқы XP сыйлығы / онбординг прогреске жатпайды; сабақ, ойын, VR, тест — жатады;
//  2) «Жалғастыру» соңғы аяқталмаған сабаққа, болмаса келесі қолжетімдіге апарады; бастау — A1 · greet-w1;
//  3) тест нәтижесі бір run үшін бір рет жазылады; өткізіп жіберу тест өтті деп саналмайды; біріктіруде нәтиже жоғалмайды;
//  4) лендинг санақтары каталогтан: ойын/квест (lib/games.js), өңір (lib/regions.js), түсіндірме тілдері (EXPLAIN_LANGS — API мен аудармалар бар);
//  5) жаңа белгілер 11 тілде, қазақша атаулар дәл; Shell енді /app/level?first=1-ге мәжбүрлеп бұрмайды.
import { register } from "node:module";
import { existsSync, readFileSync } from "node:fs";
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
const src = (p) => readFileSync(root + p, "utf8");
const P = await imp("lib/progress.js");
const { ALL_LESSONS, LEVELS } = await imp("lib/courseIndex.js");
const { QUESTIONS, grade } = await imp("lib/levelTest.js");
const { catalogCounts } = await imp("lib/catalog.js");
const { GAMES } = await imp("lib/games.js");
const { REGIONS } = await imp("lib/regions.js");
const { EXPLAIN_LANGS } = await imp("lib/i18n.js");
const { startL, START_LANGS } = await imp("app/components/StartL10n.js");
const { levelL } = await imp("app/components/LevelL10n.js");

let errors = 0;
const ok = (c, m) => { if (!c) { errors++; console.log(`   ✗ ${m}`); } };
const LANGS = ["kk", "ru", "en", "zh", "es", "de", "fr", "tr", "ar", "ko", "ja"];

// Store.js EMPTY-нің көшірмесі (React-сыз)
const EMPTY = { profile: { name: "", onboarded: false }, xp: 0, coins: 0, stamps: {}, sites: {}, games: {}, vocab: [], chat: [], cefr: null, sozdik: { days: {}, learned: {}, done: {} }, course: { done: {} }, lit: {} };

console.log("1) Нақты прогресс");
ok(!P.hasRealProgress(EMPTY), "бос күй прогресс емес");
const gifted = { ...EMPTY, xp: 10, coins: 5, streak: 1, today: { date: "2026-11-27", xp: 10 }, profile: { name: "Дос", onboarded: true } };
ok(!P.hasRealProgress(gifted), "онбординг сыйлығы (10 XP, 5 тиын) прогреске жатпайды");
ok(!P.hasRealProgress({ ...gifted, vocab: [{ kk: "сәлем" }], chat: [{ role: "user" }] }), "күн сөзін сақтау/чат прогресс емес");
ok(!P.hasRealProgress({ ...gifted, course: { done: {}, last: { id: "greet-w1", at: 1 } } }), "сабақты ашу ғана прогресс емес");
ok(P.hasRealProgress({ ...gifted, course: { done: { "greet-w1": { score: 80, at: 1 } } } }), "өтілген сабақ — прогресс");
ok(P.hasRealProgress({ ...gifted, games: { baige: { plays: 1 } } }), "ойын — прогресс");
ok(P.hasRealProgress({ ...gifted, vr: { done: { "shop-bread": 1 } } }), "VR жағдаят — прогресс");
ok(!P.hasRealProgress(P.skipLevelTest(gifted)), "тестті өткізу прогресс емес");

console.log("2) Бастау және «Жалғастыру»");
ok(P.FIRST_LESSON === "greet-w1" && ALL_LESSONS[0].topic === "greet", "алғашқы сабақ — A1 · «Сәлемдесу · 1» (greet-w1)");
ok(P.lessonHref(P.FIRST_LESSON) === "/app/course?l=greet-w1", "алғашқы сабақ сілтемесі");
ok(P.continueLesson(EMPTY) === "greet-w1", "бос күйде — greet-w1");
const d1 = { "greet-w1": { at: 10 }, "greet-w2": { at: 20 } };
ok(P.continueLesson({ ...EMPTY, course: { done: d1 } }) === "greet-w3", "соңғы өтілгеннен кейінгі сабақ");
ok(P.continueLesson({ ...EMPTY, course: { done: d1, last: { id: "family-w2", at: 30 } } }) === "family-w2", "соңғы ашылған аяқталмаған сабақ");
ok(P.continueLesson({ ...EMPTY, course: { done: { ...d1, "greet-w3": { at: 40 } }, last: { id: "greet-w3", at: 30 } } }) === "greet-w4", "аяқталған last өткізіледі");
ok(P.startLessonFor("A0", {}) === "greet-w1" && P.startLessonFor(null, {}) === "greet-w1", "A0 → алғашқы A1 сабағы");
for (const l of LEVELS) {
  const first = ALL_LESSONS.find((x) => l.units.includes(x.topic)).id;
  ok(P.startLessonFor(l.id, {}) === first, `${l.id} → сол деңгейдің алғашқы сабағы (${first})`);
}
ok(P.continueLesson({ ...EMPTY, cefr: "B1" }) === P.startLessonFor("B1", {}), "B1 тестінен кейін «Жалғастыру» B1-ден");

console.log("3) Деңгей тесті нәтижесі");
const all = QUESTIONS.map((q) => q.a);
ok(grade(all).cefr === "B2" && grade([]).cefr === "A0" && grade(all).count === 20, "grade: бәрі дұрыс → B2, бос → A0, 20 сұрақ");
const g = grade(all);
const s1 = P.saveLevelResult(gifted, "run1", g, 100);
const s2 = P.saveLevelResult(s1, "run1", g, 200);
ok(s2 === s1, "бір run екінші рет жазылмайды (екі рет басу / жаңарту)");
ok(s1.cefr === "B2" && s1.levelTest.done && s1.levelTest.per.A1.n === 6 && s1.profile.levelPending === false, "нәтиже сақталды, levelPending өшті");
const sk = P.skipLevelTest(gifted, 5);
ok(sk.cefr === null && sk.levelTest.skipped && !sk.levelTest.done, "өткізу: cefr жоқ, тест өтпеді");
ok(P.skipLevelTest(s1).levelTest.done && P.skipLevelTest(s1).cefr === "B2", "нәтижеден кейін өткізу нәтижені өшірмейді");
ok(P.mergeLevelTest(s1.levelTest, sk.levelTest) === s1.levelTest && P.mergeLevelTest(sk.levelTest, s1.levelTest) === s1.levelTest, "біріктіру: аяқталған тест басым (қонақ → аккаунт)");
ok(P.mergeLevelTest(null, s1.levelTest) === s1.levelTest && P.mergeLevelTest(s1.levelTest, undefined) === s1.levelTest, "біріктіру: бір жақта ғана бар");
const store = src("app/components/Store.js");
ok(/mergeLevelTest\(a\.levelTest, b\.levelTest\)/.test(store), "Store.js merge() levelTest-ті біріктіреді");

console.log("4) Лендинг санақтары каталогтан");
const c = catalogCounts();
ok(c.games + c.quests === GAMES.length && c.quests === GAMES.filter((x) => x.tag?.en === "Quest").length, `ойын ${c.games} + квест ${c.quests} = каталог ${GAMES.length}`);
ok(c.regions === REGIONS.length, `өңір ${c.regions}`);
ok(c.explain === EXPLAIN_LANGS.length, `түсіндірме тілдері ${c.explain} = онбординг тізімі`);
const gem = src("lib/gemini.js");
const names = gem.slice(gem.indexOf("export const LANG_NAMES"), gem.indexOf("};", gem.indexOf("export const LANG_NAMES")));
for (const l of EXPLAIN_LANGS) {
  ok(new RegExp(`\\n\\s*${l.id}:`).test(names), `${l.id}: ЖИ түсіндірмесі (LANG_NAMES) бар`);
  ok(["kk", "ru", "en"].includes(l.id) || existsSync(root + `lib/wtr/${l.id}.js`), `${l.id}: сөз аудармасы (lib/wtr) бар`);
}
const land = src("app/page.js");
ok(!/\b(6|7|20) · \{t\.nav/.test(land) && !/heroCta|heroTry/.test(land), "лендингте қолмен жазылған сан мен ескі батырмалар жоқ");
ok(land.includes("catalogCounts()") && land.includes("VR_BREAD"), "лендинг каталог санағы мен VR «Нан сатып алу» сілтемесін қолданады");
const vrIdx = src("lib/vr/sceneIndex.js");
ok(P.VR_BREAD === "/app/vr?s=shop-bread" && vrIdx.includes('"id":"shop-bread"'), "VR «Нан сатып алу» жағдаяты бар");

console.log("5) Белгілер мен бағыттау");
ok(START_LANGS.length === 11 && LANGS.every((l) => START_LANGS.includes(l)), "StartL10n — 11 тіл");
const keys = Object.keys(startL("kk"));
for (const l of LANGS) {
  const x = startL(l);
  ok(keys.every((k) => x[k]), `${l}: StartL10n кілттері толық`);
  ok(x.faqGuest(x.guest).includes(x.guest), `${l}: FAQ жауабы нақты батырма атын келтіреді`);
  const lx = levelL(l);
  ok(["choose", "zero", "find", "skip", "lesson", "home", "later"].every((k) => lx[k]), `${l}: LevelL10n таңдау белгілері`);
}
const kk = startL("kk");
ok(kk.guest === "Тіркелмей байқап көру" && kk.first === "Алғашқы сабақты бастау" && kk.cont === "Жалғастыру", "қазақша батырма атаулары дәл");
ok(kk.vrGo === "Дүкенде қазақша сөйлесіп көр", "VR батырмасы дәл");
ok(kk.games(6, 1) === "6 ойын және 1 квест" && kk.regions(20) === "20 өңір" && kk.explainN(11) === "11 тілде түсіндірме", "қазақша чиптер");
ok(![kk.games(6, 1), kk.regions(20), kk.explainN(11)].some((t) => /[A-Za-z]/.test(t)), "қазақша чиптерде латын әрпі жоқ");
const lk = levelL("kk");
ok(lk.zero === "Нөлден бастаймын" && lk.find === "Деңгейімді анықтаймын" && lk.skip === "Тестті өткізіп, алғашқы сабақты бастау" && lk.lesson === "Сабақты бастау", "деңгей таңдауларының қазақша атаулары дәл");
const shell = src("app/components/Shell.js");
ok(!shell.includes("/app/level?first=1") && !/levelPending\s*\?|if \(levelPending\)/.test(shell), "Shell деңгей тестіне мәжбүрлемейді және орауышын ауыстырмайды");
ok(/path === "\/app"\) router\.replace\("\/onboarding"\)/.test(shell), "онбординг тек «Басты» тақтада ұсынылады");
const lvl = src("app/app/level/page.js");
ok(!/if \(first && phase === "intro"\) start\(\)/.test(lvl), "деңгей тесті өздігінен қайта басталмайды");
ok(src("app/components/AuthForm.js").includes("startL(lang).guest"), "кіру/тіркелу беті бірдей «Тіркелмей байқап көру» атауын қолданады");

console.log(errors ? `\n✗ ${errors} қате` : "\n✓ Бәрі дұрыс");
process.exit(errors ? 1 : 0);
