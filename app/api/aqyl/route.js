// Aqyl — мұғалім-кейіпкер: сабақтағы сөзді/сөйлемді түсіндіреді («explain») және қате жауаптың себебін айтады («why»).
// Жауап қысқа, таза мәтін (markdown-сыз). Бірдей сұрақ сервер жадында сақталады — лимит үнемделеді.
import { callGemini, GeminiError, LANG_NAMES, KK_STYLE, tidy } from "../../../lib/gemini";

export const maxDuration = 30;

const cache = new Map();
const clip = (v, n) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, n);

function system(lang, level) {
  return `You are Aqyl, the friendly golden-eagle teacher of the Qyzyl til Kazakh-learning app. Learner level: ${level}.
Write the explanation ${lang}; every Kazakh word, form or example is in Kazakh Cyrillic.
Style: warm, encouraging, very short — 2 to 4 short sentences, at most 60 words in total. Plain text only: no markdown, no lists, no headings, no emoji, no greeting, no transliteration unless the learner is A1.
Be correct and concrete: name the rule (vowel harmony, case ending, plural, possessive, personal ending, word order, a special letter) and show the right form. Never invent meanings; if a word has several meanings, give the one that fits.

${KK_STYLE}`;
}

export async function POST(req) {
  let b;
  try {
    b = await req.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  const mode = b?.mode === "why" ? "why" : "explain";
  const explain = LANG_NAMES[b?.explain] ? b.explain : "ru";
  const lang = LANG_NAMES[explain];
  const level = clip(b?.level || "A1", 8);
  const kk = clip(b?.kk, 160);
  const tr = clip(b?.tr, 160);
  const picked = clip(b?.picked, 160);
  const question = clip(b?.question, 300);
  const task = clip(b?.task, 30);
  if (!kk) return Response.json({ error: "Bad request" }, { status: 400 });

  const key = [mode, explain, level, kk, tr, picked, question].join("|").toLowerCase();
  if (cache.has(key)) return Response.json({ text: cache.get(key), cached: true });

  const prompt =
    mode === "explain"
      ? `Explain this Kazakh ${kk.includes(" ") ? "phrase" : "word"} to the learner: «${kk}»${tr ? ` (meaning: ${tr})` : ""}.
Say what it means and how it is built (root + suffixes, if any), add one useful tip (pronunciation of a special letter, a typical ending, or when to use it), then give ONE short natural example sentence in Kazakh with its translation in brackets.`
      : `The learner made a mistake${task ? ` in a "${task}" exercise` : ""}.${question ? `\nQuestion: ${question}` : ""}
Correct answer: «${kk}»${tr ? ` (${tr})` : ""}.
Learner's answer: «${picked || "—"}».
Explain kindly why the learner's answer is wrong (what it means or which letter/ending/word order is off) and why the correct answer is right. Show the correct form once more at the end.`;

  try {
    const out = await callGemini([{ role: "user", parts: [{ text: prompt }] }], {
      system: system(lang, level),
      temperature: 0.3,
      fast: true,
      thinking: "minimal",
      maxTokens: 400,
      perCallMs: 12_000,
    });
    const text = tidy(out, { markdown: false }).slice(0, 700);
    if (!text) return Response.json({ error: "Empty reply" }, { status: 502 });
    if (cache.size > 800) cache.clear();
    cache.set(key, text);
    return Response.json({ text });
  } catch (e) {
    return Response.json({ error: e.message || "AI error" }, { status: e instanceof GeminiError ? e.status : 500 });
  }
}
