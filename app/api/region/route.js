// Өңір туралы қысқаша таныстыру (сұраққа дейін)
import { callGemini, GeminiError, LANG_NAMES } from "../../../lib/gemini";

export const maxDuration = 30;

export async function POST(req) {
  let b;
  try {
    b = await req.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  const name = String(b?.name || "").slice(0, 60);
  const center = String(b?.center || "").slice(0, 60);
  const sights = Array.isArray(b?.sights) ? b.sights.map((s) => String(s).slice(0, 60)).slice(0, 6) : [];
  const lang = LANG_NAMES[b?.explain] || LANG_NAMES.ru;
  if (!name) return Response.json({ error: "Bad request" }, { status: 400 });
  const prompt = `Қазақстанның «${name}» (орталығы: ${center}${sights.length ? `; көрікті жерлері: ${sights.join(", ")}` : ""}) өңірі туралы 4-5 қысқа сөйлем жаз: орналасуы, табиғаты, танымал жері, халқы/кәсібі. Тек сенімді, жалпыға белгілі деректер бер; сенімсіз болсаң, нақты сан немесе жылды жазба. Жауап ${lang} болсын, 2-3 қазақша сөзді кириллицамен жақшада аудармасымен қос. Тақырыпсыз, тек мәтін.`;
  try {
    const text = await callGemini([{ role: "user", parts: [{ text: prompt }] }], { temperature: 0.3, fast: true, thinking: "minimal", maxTokens: 450 });
    return Response.json({ text });
  } catch (e) {
    return Response.json({ error: e.message || "AI error" }, { status: e instanceof GeminiError ? e.status : 500 });
  }
}
