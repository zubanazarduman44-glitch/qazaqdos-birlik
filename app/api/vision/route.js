// Alash Vision: суреттегі затты тауып, қазақша атауын үйретеді. Сурет сақталмайды.
import { callGemini, GeminiError, LANG_NAMES } from "../../../lib/gemini";

export const maxDuration = 60;

const SCHEMA = {
  type: "OBJECT",
  properties: {
    found: { type: "BOOLEAN", description: "Суретте нақты бір зат анық көрінсе true" },
    kk: { type: "STRING", description: "Заттың қазақша атауы (кириллица, кіші әріппен, жалғаусыз)" },
    translit: { type: "STRING", description: "Қазақша атаудың латынша оқылуы" },
    translation: { type: "STRING", description: "Атаудың аудармасы (түсіндіру тілінде)" },
    emoji: { type: "STRING", description: "Затқа сай бір эмодзи" },
    category: { type: "STRING", description: "Санаты (түсіндіру тілінде, бір-екі сөз)" },
    example_kk: { type: "STRING", description: "Осы сөз бар қысқа, қарапайым қазақша сөйлем" },
    example_tr: { type: "STRING", description: "Сөйлемнің аудармасы (түсіндіру тілінде)" },
    tip: { type: "STRING", description: "Сөз туралы бір қысқа пайдалы кеңес немесе қызық дерек (түсіндіру тілінде)" },
  },
  required: ["found", "kk", "translation", "emoji", "example_kk", "example_tr"],
};

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  const { image, explain = "ru" } = body || {};
  if (typeof image !== "string" || !image.startsWith("data:image/")) return Response.json({ error: "Bad request" }, { status: 400 });
  const [meta, base64] = image.split(",");
  if (!base64 || base64.length > 6_000_000) return Response.json({ error: "Image too large" }, { status: 413 });
  const lang = LANG_NAMES[explain] || LANG_NAMES.ru;

  const prompt = `Сен — Alash, қазақ тілін үйретуші дос. Суреттің ортасындағы негізгі затты анықта.
Түсіндіру тілі: ${lang}. Қазақша сөздер мен сөйлемдер — кириллицамен, грамматикасы дұрыс, бастауыш деңгейге түсінікті болсын.
Егер суретте адамның беті, құжат немесе жеке ақпарат болса — оны сипаттама, found=false қой.
Зат анық көрінбесе found=false қойып, translation өрісіне қысқаша «затты жақынырақ түсір» деген кеңес жаз.`;

  try {
    const text = await callGemini(
      [{ role: "user", parts: [{ text: prompt }, { inline_data: { mime_type: meta.slice(5, meta.indexOf(";")), data: base64 } }] }],
      { schema: SCHEMA, temperature: 0.2, fast: true, thinking: "minimal", mediaResolution: "MEDIA_RESOLUTION_MEDIUM" }
    );
    const data = JSON.parse(text);
    return Response.json(data);
  } catch (e) {
    const status = e instanceof GeminiError ? e.status : 500;
    return Response.json({ error: e.message || "AI error" }, { status });
  }
}
