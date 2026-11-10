// Сөз аудармасы: кез келген сөзге басқанда қазақша / орысша / ағылшынша көрсетеді
import { callGemini, GeminiError } from "../../../lib/gemini";

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
