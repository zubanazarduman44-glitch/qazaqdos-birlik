// Сөз аудармасы: кез келген сөзге басқанда қазақша / орысша / ағылшынша көрсетеді
import { callGemini, GeminiError, LANG_NAMES } from "../../../lib/gemini";

export const maxDuration = 30;

const SCHEMA = {
  type: "OBJECT",
  properties: {
    kk: { type: "STRING", description: "Қазақша (сөздің түбір/сөздік формасы, кириллица)" },
    ru: { type: "STRING", description: "Русский перевод" },
    en: { type: "STRING", description: "English translation" },
    form: { type: "STRING", description: "Егер сөз жалғаулы болса — қысқаша түсіндірме (мысалы: «барды» = бару + өткен шақ), әйтпесе бос" },
  },
  required: ["kk", "ru", "en"],
};

const cache = new Map();

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  // Көп сөзді бірден аудару (басқа тілге ауысқанда)
  if (Array.isArray(body?.words)) {
    const lang = LANG_NAMES[body.to];
    const words = body.words.map((w) => String(w).slice(0, 40)).filter(Boolean).slice(0, 90);
    if (!lang || !words.length) return Response.json({ error: "Bad request" }, { status: 400 });
    const schema = { type: "OBJECT", properties: { items: { type: "ARRAY", items: { type: "OBJECT", properties: { k: { type: "STRING" }, t: { type: "STRING" } }, required: ["k", "t"] } } }, required: ["items"] };
    try {
      const out = await callGemini([{ role: "user", parts: [{ text: `Translate each Kazakh word or phrase into ${lang}. Return k = the exact original Kazakh string, t = a short dictionary translation (1-3 words).\n${JSON.stringify(words)}` }] }], { schema, temperature: 0, fast: true, thinking: "minimal", maxTokens: 3500 });
      const map = {};
      for (const it of JSON.parse(out).items || []) if (it?.k && it?.t) map[it.k] = String(it.t).slice(0, 60);
      return Response.json({ map });
    } catch (e) {
      return Response.json({ error: e.message || "AI error" }, { status: e instanceof GeminiError ? e.status : 500 });
    }
  }
  // Интерфейс жолдарын аудару
  if (Array.isArray(body?.ui)) {
    const lang = LANG_NAMES[body.to];
    const items = body.ui.map((x) => String(x).slice(0, 400)).slice(0, 90);
    if (!lang || !items.length) return Response.json({ error: "Bad request" }, { status: 400 });
    const schema = { type: "OBJECT", properties: { items: { type: "ARRAY", items: { type: "STRING" } } }, required: ["items"] };
    try {
      const out = await callGemini([{ role: "user", parts: [{ text: `Translate these user-interface strings of a Kazakh-learning app from English into ${lang}. Return the same number of items in the same order. Keep emojis, punctuation and numbers. Do NOT translate Kazakh words, the app name TILIM, the mascot name Aqyl, or section names Tuzel, Saiys, Duken, Adebiet, Dengei, Aitylym, Jazu.\n${JSON.stringify(items)}` }] }], { schema, temperature: 0, fast: true, thinking: "minimal", maxTokens: 6000 });
      const arr = JSON.parse(out).items || [];
      return Response.json({ items: arr.length === items.length ? arr : null });
    } catch (e) {
      return Response.json({ error: e.message || "AI error" }, { status: e instanceof GeminiError ? e.status : 500 });
    }
  }
  // Ұзын мәтінді аудару (Әдебиет)
  if (typeof body?.text === "string" && body.text.trim()) {
    const lang = LANG_NAMES[body.to];
    if (!lang) return Response.json({ error: "Bad request" }, { status: 400 });
    try {
      const out = await callGemini([{ role: "user", parts: [{ text: `Translate this Kazakh text ${lang}. Output only the translation, keep it faithful and natural.\n\n${body.text.slice(0, 2500)}` }] }], { temperature: 0.1, fast: true, thinking: "minimal", maxTokens: 1500 });
      return Response.json({ text: out });
    } catch (e) {
      return Response.json({ error: e.message || "AI error" }, { status: e instanceof GeminiError ? e.status : 500 });
    }
  }
  const word = String(body?.word || "").trim().slice(0, 40);
  const context = String(body?.context || "").trim().slice(0, 200);
  if (!word || !/\p{L}/u.test(word)) return Response.json({ error: "Bad request" }, { status: 400 });
  const key = word.toLowerCase();
  if (!context && cache.has(key)) return Response.json(cache.get(key));

  const prompt = `Сөзді аудар: «${word}».${context ? `\nСөйлем: «${context}» (мағынаны осыдан ал).` : ""}
Сөздің тілін өзің анықта (қазақша, орысша немесе ағылшынша) және үш тілде де бер: kk (қазақша), ru, en. Қазақша сөз жалғаулы болса, kk өрісіне түбірін жаз, form өрісінде жалғауын түсіндір. Тек қысқа сөздік аударма, артық сөз қоспа.`;
  try {
    const text = await callGemini([{ role: "user", parts: [{ text: prompt }] }], {
      schema: SCHEMA,
      temperature: 0,
      fast: true,
      thinking: "minimal",
      maxTokens: 220,
    });
    const data = JSON.parse(text);
    if (!context) {
      if (cache.size > 500) cache.clear();
      cache.set(key, data);
    }
    return Response.json(data);
  } catch (e) {
    const status = e instanceof GeminiError ? e.status : 500;
    return Response.json({ error: e.message || "AI error" }, { status });
  }
}
