// Саяхат тестін тексеру: 20 өңірдің әрқайсысында әр сұрақтың бір ғана дұрыс жауабы бар ма.
// Іске қосу: node --no-warnings scripts/check-travel-quiz.mjs   (қате болса — шығу коды 1)
// Тексерілетіні (әр өңір × түсіндіру тілі kk/ru/en × 11 интерфейс тілі × көп кездейсоқ тарту):
//  1) 5 сұрақ: облыста — «орталығы қай қала?», республикалық маңызы бар қалада — «Бос орынды толтыр»
//     (қалаға «орталығы» сұрағы қойылмайды); қалған 4-еуі — карточкадағы 4 сөз;
//  2) нұсқалардың кілттері де, жазулары да қайталанбайды, дұрыс кілт нұсқалар ішінде дәл бір рет;
//  3) сөз сұрағында қате нұсқалардың аудармасы (ru, en, түсіндіру тілі) дұрысымен сәйкес не ұқсас емес,
//     мағынасы жақын топтан емес;
//  4) облыс сұрағында қате нұсқалар — басқа облыстың орталығы, қала да, өңірдің бұрынғы орталығы да емес;
//  5) «Бос орынды толтыр»: бір ғана «___», жауап карточкадағы деректе (fact.kk) бар, қате нұсқалар жоқ;
//  6) мөр жолы: сөздер → тест → мөр бір рет; қайта ашып тапсырғанда мөр де, XP/тиын да қайталанбайды.
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
const { REGIONS } = await imp("lib/regions.js");
const { tr } = await imp("lib/wordTools.js");
const Q = await imp("lib/travelQuiz.js");

const LANGS = ["kk", "ru", "en", "zh", "es", "de", "fr", "tr", "ar", "ko", "ja"];
const EXPLAIN = ["kk", "ru", "en"];
const RUNS = 40;
let errors = 0;
const seen = new Set();
const fail = (m) => { if (seen.has(m)) return; seen.add(m); errors++; console.log(`   ✗ ${m}`); };
const norm = (s) => String(s || "").toLocaleLowerCase().replace(/ё/g, "е").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const like = (a, b) => { const x = norm(a), y = norm(b); return x === y || x.includes(y) || y.includes(x); };
const wordIn = (text, w) => new RegExp(`(^|[^\\p{L}])${w}([^\\p{L}]|$)`, "u").test(text);

// Тіл мәтіндері 11 тілде толық
for (const [k, m] of Object.entries(Q.TQ)) for (const l of LANGS) if (!m[l]) fail(`TQ.${k}: «${l}» жоқ`);

if (REGIONS.length !== 20) fail(`өңір саны ${REGIONS.length}, 20 болуы керек`);
const cities = REGIONS.filter((r) => r.city).map((r) => r.id).sort();
if (cities.join() !== "almaty-city,astana,shymkent") fail(`республикалық қалалар: ${cities.join()}`);
for (const id of cities) if (!Q.CITY_BLANK[id]) fail(`${id}: «Бос орынды толтыр» сұрағы жоқ`);
const cityCenters = new Set(REGIONS.filter((r) => r.city).map((r) => r.center.kk));

const quizWord = (w) => `«${w}» сөзінің аудармасы қандай?`;
for (const r of REGIONS) {
  const before = errors;
  for (const lang of LANGS) for (const explain of EXPLAIN) for (let n = 0; n < RUNS; n++) {
    const qs = Q.buildRegionQuiz(r, { lang, explain, quizWord, trFn: tr });
    if (qs.length !== 5) fail(`${r.id}: ${qs.length} сұрақ (5 керек)`);
    const [first, ...words] = qs;
    if (r.city && first.kind !== "blank") fail(`${r.id}: қалаға «${first.kind}» сұрағы (blank керек)`);
    if (!r.city && first.kind !== "center") fail(`${r.id}: облысқа «${first.kind}» сұрағы (center керек)`);
    if (/орталығы/.test(first.prompt) && r.city) fail(`${r.id}: қалаға «орталығы» сұрағы: ${first.prompt}`);
    if (lang === "kk" && first.kind === "center" && !first.prompt.startsWith(`${r.name.kk}ның `)) fail(`${r.id}: kk сұрақ үлгісі: ${first.prompt}`);
    if (words.map((q) => q.answer).join() !== r.words.map((w) => w.kk).join()) fail(`${r.id}: сөз сұрақтары карточкадағы сөздерге сай емес`);
    for (const q of qs) {
      if (!q.prompt || /undefined|null/.test(q.prompt)) fail(`${r.id}/${lang}: бос сұрақ: ${q.prompt}`);
      const keys = q.options.map((o) => o.key);
      const labels = q.options.map((o) => norm(o.label));
      if (q.options.length !== 4) fail(`${r.id}/${explain}: «${q.prompt}» — ${q.options.length} нұсқа`);
      if (new Set(keys).size !== keys.length) fail(`${r.id}/${explain}: «${q.prompt}» — кілт қайталанады`);
      if (new Set(labels).size !== labels.length) fail(`${r.id}/${explain}: «${q.prompt}» — жазу қайталанады: ${labels.join(" | ")}`);
      if (keys.filter((k) => k === q.answer).length !== 1) fail(`${r.id}/${explain}: «${q.prompt}» — дұрыс жауап ${keys.filter((k) => k === q.answer).length} рет`);
      if (labels.some((l) => !l)) fail(`${r.id}/${lang}/${explain}: «${q.prompt}» — бос жазу`);
    }
    // сөз сұрақтары
    for (const q of words) {
      const w = r.words.find((x) => x.kk === q.answer);
      for (const o of q.options) {
        if (o.key === q.answer) continue;
        const p = REGIONS.flatMap((x) => x.words).find((x) => x.kk === o.key);
        if (!p) { fail(`${r.id}: белгісіз нұсқа ${o.key}`); continue; }
        if (like(p.en, w.en) || like(p.ru, w.ru) || like(tr(p, explain), tr(w, explain))) fail(`${r.id}: «${w.kk}» ~ «${p.kk}» (${w.en} / ${p.en}) — екі дұрыс жауапқа ұқсас`);
        if (Q.CLOSE.some((g) => g.includes(p.kk) && g.includes(w.kk))) fail(`${r.id}: «${w.kk}» мен «${p.kk}» мағынасы жақын`);
      }
    }
    // облыс сұрағы
    if (first.kind === "center") {
      if (first.answer !== r.center.kk) fail(`${r.id}: дұрыс жауап ${first.answer}, орталығы ${r.center.kk}`);
      const past = new Set(Q.PAST_CENTERS[r.id] || []);
      for (const o of first.options) {
        if (o.key === first.answer) continue;
        if (cityCenters.has(o.key)) fail(`${r.id}: қате нұсқа — республикалық қала ${o.key}`);
        if (past.has(o.key)) fail(`${r.id}: қате нұсқа — бұрынғы орталық ${o.key}`);
        if (!REGIONS.some((x) => !x.city && x.center.kk === o.key)) fail(`${r.id}: қате нұсқа облыс орталығы емес: ${o.key}`);
      }
    }
    // бос орын
    if (first.kind === "blank") {
      const b = Q.CITY_BLANK[r.id];
      if ((b.text.match(/___/g) || []).length !== 1) fail(`${r.id}: «___» саны дұрыс емес`);
      if (!wordIn(r.fact.kk, b.answer)) fail(`${r.id}: жауап «${b.answer}» карточкадағы деректе жоқ`);
      for (const x of b.wrong) if (wordIn(r.fact.kk, x)) fail(`${r.id}: қате нұсқа «${x}» деректе бар (екі жауап)`);
      const filled = b.text.replace("___", b.answer).replace(/[«».,]/g, "");
      const factN = norm(r.fact.kk);
      const miss = filled.split(/\s+/).filter((t) => t.length > 3 && !factN.includes(norm(t).slice(0, 5)));
      if (miss.length) fail(`${r.id}: сөйлем деректен алыс (${miss.join(", ")})`);
    }
  }
  console.log(`${errors === before ? "✓" : "✗"} ${r.id}${r.city ? " (қала)" : ""}`);
}

// 6) мөр жолы: сөздер → тест → мөр. Бетті қайта ашқанда (stamps сақталған) мөр де, марапат та қайталанбайды
{
  let state = { xp: 0, coins: 0, stamps: {} };
  const run = (id, right) => {
    const o = Q.stampOutcome(state.stamps, id, right);
    if (o.grant) state = { ...state, xp: state.xp + 30, coins: state.coins + 15, stamps: { ...state.stamps, [id]: Date.now() } };
    return o;
  };
  const a = run("astana", 3);
  if (a.ok || a.grant || state.stamps.astana) fail("мөр: 3/5 өткен болып саналды");
  const b = run("astana", 5);
  if (!b.grant || state.xp !== 30 || state.coins !== 15) fail("мөр: 5/5 мөр бермеді");
  const saved = JSON.parse(JSON.stringify(state)); // «қайта ашу» — сақталған күйден
  state = saved;
  const c = run("astana", 5);
  const d = run("astana", 4);
  if (c.grant || d.grant || !c.had || state.xp !== 30 || state.coins !== 15 || Object.keys(state.stamps).length !== 1) fail("мөр: қайта тапсырғанда мөр/XP қайталанды");
  const e = run("akmola", 4);
  if (!e.grant || Object.keys(state.stamps).length !== 2 || state.xp !== 60) fail("мөр: келесі өңірдің мөрі берілмеді");
  console.log(`${errors ? "·" : "✓"} мөр жолы (бір мөр, бір марапат)`);
}

if (errors) {
  console.log(`\n✗ ${errors} қате`);
  process.exit(1);
}
console.log(`\n✓ ${REGIONS.length} өңір, барлық сұрақтың бір ғана дұрыс жауабы бар`);
