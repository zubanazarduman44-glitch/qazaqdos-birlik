// lib/courseIndex.js файлын lib/course.js-тен жасайды (сөз деректерінсіз жеңіл курс индексі).
// Іске қосу: node --no-warnings scripts/gen-course-index.mjs   (сөз файлдары не курс құрылымы өзгерсе — қайта іске қос)
import { register } from "node:module";
import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

// lib/* импорттары кеңейтімсіз ("./words") — Node үшін ".js" қосамыз
register(
  "data:text/javascript," +
    encodeURIComponent(`export async function resolve(s, c, next) {
      try { return await next(s, c); } catch (e) { if (s.startsWith(".") && !s.endsWith(".js")) return next(s + ".js", c); throw e; }
    }`),
  import.meta.url
);

const root = fileURLToPath(new URL("..", import.meta.url));
const { LEVELS, UNITS } = await import(pathToFileURL(root + "lib/course.js").href);
const { TOPICS } = await import(pathToFileURL(root + "lib/words.js").href);

// Әр тақырып: [сөз сабақтарының саны, сөйлем сабағы бар ма (1/0)]
const shape = {};
const topics = {};
for (const lv of LEVELS)
  for (const t of lv.units) {
    const ls = UNITS[t].lessons;
    const w = ls.filter((l) => l.kind === "words").length;
    const p = ls.filter((l) => l.kind === "phrases").length;
    ls.forEach((l, i) => {
      const want = i < w ? `${t}-w${i + 1}` : `${t}-p`;
      if (l.id !== want || (i < w ? l.kind !== "words" : l.kind !== "phrases")) throw new Error(`unexpected lesson order in ${t}: ${l.id}`);
    });
    if (p > 1) throw new Error(`more than one phrase lesson in ${t}`);
    shape[t] = [w, p];
    topics[t] = TOPICS[t];
  }

const J = (v) => JSON.stringify(v);
const out = `// ⚠ ЖАСАЛҒАН ФАЙЛ — қолмен өзгертпе. Көзі: lib/course.js + lib/words.js; жасаушы: node --no-warnings scripts/gen-course-index.mjs
// Курстың жеңіл индексі: сабақ id-лері, тақырып атаулары, деңгей құрылымы — сөз массивтерінсіз (~110 KB үнемдейді).
// Тек тізім/санақ/атау керек беттерге (сынып, профиль, басты бет «Төр»). Сабақ мазмұны (words/phrases) — lib/course.js-те.

export const LEVELS = ${J(LEVELS.map((l) => ({ id: l.id, units: l.units })))};

// Тақырып атаулары (11 тілде) мен эмодзи — lib/words.js TOPICS-тен
export const TOPICS = {
${Object.entries(topics).map(([t, m]) => `  ${J(t)}: ${J(m)},`).join("\n")}
};

// тақырып → [сөз сабақтарының саны, сөйлем сабағы (1/0)]
const SHAPE = ${J(shape)};

export const UNITS = Object.fromEntries(
  LEVELS.flatMap((l) => l.units).map((t) => {
    const [w, p] = SHAPE[t];
    const lessons = Array.from({ length: w }, (_, i) => ({ id: \`\${t}-w\${i + 1}\`, kind: "words", topic: t }));
    if (p) lessons.push({ id: \`\${t}-p\`, kind: "phrases", topic: t });
    return [t, { topic: t, meta: TOPICS[t], lessons }];
  })
);
export const ALL_LESSONS = Object.values(UNITS).flatMap((u) => u.lessons);
export const lessonById = (id) => ALL_LESSONS.find((l) => l.id === id);
export const lessonTitle = (l, lang) => {
  const m = TOPICS[l.topic];
  const n = (m && (m[lang] || m.en || m.kk)) || l.topic;
  const idx = UNITS[l.topic].lessons.findIndex((x) => x.id === l.id) + 1;
  return \`\${n} · \${idx}\`;
};
export const levelStats = (lv, done) => {
  const ls = lv.units.flatMap((u) => UNITS[u].lessons);
  return { total: ls.length, done: ls.filter((l) => done?.[l.id]).length };
};
export const levelOfTopic = (topic) => LEVELS.find((v) => v.units.includes(topic));
// Келесі өтілмеген сабақ (done — state.course.done)
export const nextLesson = (done) => ALL_LESSONS.find((l) => !done?.[l.id]);
`;
writeFileSync(root + "lib/courseIndex.js", out);
console.log("lib/courseIndex.js:", Buffer.byteLength(out), "bytes,", Object.values(shape).reduce((a, [w, p]) => a + w + p, 0), "lessons");
