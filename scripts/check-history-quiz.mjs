// Тарих сұрақтарын тексеру: әр сұрақтың жауабы мен негізгі сөздері сол орынның мәтінінде бар ма.
// Іске қосу: node --no-warnings scripts/check-history-quiz.mjs   (қате болса — шығу коды 1)
// Тексерілетіні:
//  1) әр орында 4 бөлім мен 3 сұрақ (әрқайсысында 3 жауап) бар;
//  2) key (мәтіндегі дәлел) мәтінде сөзбе-сөз кездеседі;
//  3) дұрыс жауаптың әр сөзі (түбірі) key ішінде бар, сандар — дәл сол күйінде;
//  4) қате жауаптар мәтінде сөзбе-сөз кездеспейді;
//  5) орынның 3 сөзі мәтінде бар;
//  6) 10 тілдің аударма файлында барлық P./Q. кілттері бар, жауаптағы сандар аудармада да сақталған.
import { register } from "node:module";
import { readdirSync } from "node:fs";
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
const { SITES } = await imp("lib/history.js");
const { HIST_TEXT, keySentence } = await imp("lib/historyText.js");

const low = (s) => s.toLocaleLowerCase("kk").replace(/ё/g, "е");
const tokens = (s) => low(s).match(/[\p{L}\p{N}]+/gu) || [];
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const hasWord = (hay, tok) => new RegExp(`(^|[^\\p{L}\\p{N}])${esc(tok)}`, "u").test(hay);
// Сөз түбірі: қазақ сөзі жалғаумен өзгереді, сондықтан алғашқы 5 әріп (қысқа сөз — толық, сөз басынан)
const stemOk = (hay, tok) => (/^\p{N}+$/u.test(tok) ? new RegExp(`(^|\\D)${tok}(\\D|$)`, "u").test(hay) : hasWord(hay, tok.length <= 4 ? tok : tok.slice(0, 5)));

let errors = 0;
const fail = (m) => { errors++; console.log(`   ✗ ${m}`); };

const LANGS = readdirSync(root + "lib/l10n/history").filter((f) => f.endsWith(".js")).map((f) => f.slice(0, -3)).sort();
const TR = {};
for (const l of LANGS) TR[l] = (await imp(`lib/l10n/history/${l}.js`)).default || {};

for (const s of SITES) {
  const t = HIST_TEXT[s.id];
  console.log(`\n■ ${s.name.kk} (${s.id})`);
  if (!t) { fail("мәтін жоқ"); continue; }
  if (t.parts?.length !== 4) fail(`бөлім саны ${t.parts?.length} (4 керек)`);
  if (t.quiz?.length !== 3) fail(`сұрақ саны ${t.quiz?.length} (3 керек)`);
  const text = t.parts.join(" ");
  const lt = low(text);

  for (const w of s.words) if (!lt.includes(low(w.kk))) fail(`сөз мәтінде жоқ: ${w.kk}`);

  t.quiz.forEach((q, i) => {
    const [ans, ...bad] = q.a;
    const lk = low(q.key);
    const problems = [];
    if (q.a.length !== 3) problems.push("жауап саны 3 емес");
    if (!text.includes(q.key)) problems.push(`key мәтінде жоқ: «${q.key}»`);
    const miss = tokens(ans).filter((tok) => !stemOk(lk, tok));
    if (miss.length) problems.push(`жауап сөздері key-де жоқ: ${miss.join(", ")}`);
    for (const b of bad) {
      if (hasWord(lt, low(b.replace(/[«»]/g, "")))) problems.push(`қате жауап мәтінде сөзбе-сөз бар: «${b}»`);
      if (low(b) === low(ans)) problems.push(`қате жауап дұрысымен бірдей: «${b}»`);
    }
    const nums = ans.match(/\d+/g) || [];
    for (const l of LANGS) {
      const tq = TR[l][`Q.${s.id}.${i}`];
      if (!tq) problems.push(`${l}: Q.${s.id}.${i} аудармасы жоқ`);
      const tt = [0, 1, 2, 3].map((n) => TR[l][`P.${s.id}.${n}`] || "").join(" ");
      for (const n of nums) if (!tt.replace(/[\s,.  ]/g, "").includes(n) && !tt.includes(n)) problems.push(`${l}: «${n}» саны аудармада жоқ`);
    }
    const mark = problems.length ? "✗" : "✓";
    console.log(`  ${mark} ${i + 1}. ${q.q}`);
    console.log(`      жауап: ${ans}`);
    console.log(`      мәтінде: ${keySentence(s.id, q.key)}`);
    problems.forEach(fail);
  });

  for (const l of LANGS) {
    for (let n = 0; n < 4; n++) if (!TR[l][`P.${s.id}.${n}`]) fail(`${l}: P.${s.id}.${n} аудармасы жоқ`);
    if (!["ru", "en"].includes(l) && !TR[l][`H.${s.id}.era`]) fail(`${l}: H.${s.id}.era жоқ`);
  }
}

console.log(`\nАударма тілдері: ${LANGS.join(", ")}`);
console.log(errors ? `\n${errors} қате табылды.` : "\nБәрі дұрыс: әр сұрақтың жауабы мәтінде бар.");
process.exit(errors ? 1 : 0);
