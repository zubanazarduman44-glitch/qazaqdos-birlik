// Жазу көмекшісі: қазақша мәтінді түзетіп, себебін түсіндіреді
import { callGemini, GeminiError, LANG_NAMES } from "../../../lib/gemini";

export const maxDuration = 60;

const SCHEMA = {
  type: "OBJECT",
  properties: {
    corrected: { type: "STRING", description: "Мәтіннің толық түзетілген нұсқасы (қазақша)" },
    score: { type: "INTEGER", description: "Мәтін сапасы 0–100" },
    praise: { type: "STRING", description: "Бір қысқа мақтау (түсіндіру тілінде)" },
    changes: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          from: { type: "STRING", description: "Бастапқы үзінді" },
          to: { type: "STRING", description: "Түзетілген үзінді" },
          why: { type: "STRING", description: "Себебі, қысқа (түсіндіру тілінде)" },
        },
        required: ["from", "to", "why"],
      },
    },
    tip: { type: "STRING", description: "Келесі жолы ескеретін бір кеңес (түсіндіру тілінде)" },
  },
  required: ["corrected", "score", "changes", "tip", "praise"],
};

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  const { text, level = "A1", explain = "ru" } = body || {};
  if (typeof text !== "string" || !text.trim()) return Response.json({ error: "Bad request" }, { status: 400 });
  const lang = LANG_NAMES[explain] || LANG_NAMES.ru;

  const prompt = `Сен — қазақ тілінің мейірімді мұғалімі Aqylсің. Оқушы деңгейі: ${String(level).slice(0, 4)}.
Төмендегі мәтінді тексер: емле, жалғаулар, септіктер, сөз тәртібі, үндестік заңы.
Мағынасын өзгертпе, тек қателерді түзет. corrected мәтіні ТОЛЫҒЫМЕН қазақша болсын: егер мәтінде орысша немесе ағылшынша сөз (мысалы «сок», «juice») қалып қойса, оны қазақшаға аударып («шырын») ауыстыр және әрқайсысын changes тізіміне жаз. Қазақша сөздердің орнына шетел сөздерін қалдырма. Әр өзгерісті changes тізіміне бөлек жаз. Қате жоқ болса — changes бос болсын.
Түсіндірмелердегі (why, tip, praise) мысалдар мен атаулар қазақша болсын; түсіндіру тілі: ${lang}.

Мәтін:
"""${text.slice(0, 2000)}"""`;

  try {
    const out = await callGemini([{ role: "user", parts: [{ text: prompt }] }], { schema: SCHEMA, temperature: 0.2, fast: true, thinking: "low" });
    return Response.json(JSON.parse(out));
  } catch (e) {
    const status = e instanceof GeminiError ? e.status : 500;
    return Response.json({ error: e.message || "AI error" }, { status });
  }
}
