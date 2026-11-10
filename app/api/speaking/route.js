// Aitylym: дыбыс пен мақсатты фразаны салыстырып, айтылымды бағалайды. Дыбыс сақталмайды.
import { callGemini, GeminiError, LANG_NAMES } from "../../../lib/gemini";

export const maxDuration = 60;

const SCHEMA = {
  type: "OBJECT",
  properties: {
    heard: { type: "STRING", description: "Дыбыста естілген мәтін (қазақша, кириллица)" },
    score: { type: "INTEGER", description: "0-100: айтылым дәлдігі мен айқындығы" },
    tips: { type: "ARRAY", items: { type: "STRING" }, description: "1-3 нақты кеңес (түсіндіру тілінде)" },
    verdict: { type: "STRING", description: "Бір қысқа сөйлем баға (түсіндіру тілінде)" },
  },
  required: ["heard", "score", "tips", "verdict"],
};

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  const { audio, mime = "audio/wav", target, explain = "ru" } = body || {};
  if (typeof audio !== "string" || audio.length < 500 || audio.length > 3_000_000) return Response.json({ error: "Bad audio" }, { status: 400 });
  const phrase = String(target || "").slice(0, 200);
  if (!phrase) return Response.json({ error: "Bad request" }, { status: 400 });
  if (!/^audio\/(wav|x-wav|mp3|mpeg|ogg|flac|aac)/.test(mime)) return Response.json({ error: "Bad audio type" }, { status: 400 });
  const lang = LANG_NAMES[explain] || LANG_NAMES.ru;

  const prompt = `Сен — қазақ тілінің айтылым мұғалімісің. Аудиода оқушы мына қазақша фразаны айтуға тырысты:
«${phrase}»
1) heard — аудиода нақты не естігеніңді жаз (ойдан толықтырма; ештеңе естілмесе бос жол).
2) score — 0-100 ұпай: сөздердің дұрыс айтылуы, ерекше қазақ дыбыстары (ә, ө, ү, ұ, қ, ғ, ң, һ, і), екпін мен айқындық. Фразаның жартысы айтылмаса 50-ден аспасын; тыныштық/шу болса 0-10.
3) tips — ең маңызды 1-3 нақты кеңес (қай сөз, қай дыбыс қате болды).
4) verdict — бір қысқа мейірімді баға.
Кеңестер мен баға ${lang} жазылсын, қазақша сөздер — кириллицамен.`;

  try {
    const text = await callGemini(
      [{ role: "user", parts: [{ text: prompt }, { inline_data: { mime_type: mime, data: audio } }] }],
      { schema: SCHEMA, temperature: 0.1, fast: false, thinking: "low", maxTokens: 600 }
    );
    const d = JSON.parse(text);
    d.score = Math.max(0, Math.min(100, Math.round(Number(d.score) || 0)));
    return Response.json(d);
  } catch (e) {
    const status = e instanceof GeminiError ? e.status : 500;
    return Response.json({ error: e.message || "AI error" }, { status });
  }
}
