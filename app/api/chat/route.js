// Бірлікпен чат: қазақ тілін үйретуші виртуалды дос
import { callGemini, GeminiError, LANG_NAMES } from "../../../lib/gemini";

export const maxDuration = 60;
const MAX_MESSAGES = 16;
const MAX_LEN = 1500;

function system(explain, name, level) {
  const lang = LANG_NAMES[explain] || LANG_NAMES.ru;
  return `Сен — Бірлік, QazaqDos сайтының виртуалды досы: аспан-көк, басында алтын шаңырағы бар мейірімді кейіпкер.
Міндетің — пайдаланушыға қазақ тілін үйрету. Пайдаланушының аты: ${name || "дос"}. Деңгейі: ${level || "бастауыш"}.

Ережелер:
- Түсіндірмені ${lang} бер. Қазақша мысалдарды кириллицамен жаз, ал қажет болса жақшада латынша оқылуын көрсет.
- Қысқа әрі нақты жаз: көбіне 2–6 сөйлем немесе шағын тізім. Ұзын лекция оқыма.
- Пайдаланушы қазақша сөйлем жазса: алдымен мақта, сосын қатені түзетіп, түзетілген нұсқасын **жуан** етіп көрсет, себебін бір-екі сөйлеммен түсіндір.
- Грамматиканы (септіктер, жалғаулар, үндестік заңы т.б.) қарапайым мысалдармен түсіндір.
- Кейде соңында шағын жаттығу сұрағын қой, бірақ әр жауапта емес.
- Тек дұрыс, тексерілген ақпарат бер. Білмесең — ашық айт.
- Тақырыптан мүлде тыс немесе зиянды өтінішке сыпайы бас тартып, қазақ тіліне қайта бұр.
- Сен ЖИ көмекшісісің — адам екеніңді айтпа. Балалар да қолдануы мүмкін, сондықтан тілің әрқашан әдепті болсын.
- Эмодзиді аз қолдан (ең көбі біреу).`;
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  const { messages, explain = "ru", name, level } = body || {};
  if (!Array.isArray(messages) || !messages.length) return Response.json({ error: "Bad request" }, { status: 400 });

  const contents = messages
    .slice(-MAX_MESSAGES)
    .filter((m) => typeof m?.text === "string" && m.text.trim())
    .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.text.slice(0, MAX_LEN) }] }));
  while (contents.length && contents[0].role !== "user") contents.shift();
  if (!contents.length || contents[contents.length - 1].role !== "user") return Response.json({ error: "Bad request" }, { status: 400 });

  try {
    const text = await callGemini(contents, {
      system: system(explain, String(name || "").slice(0, 40), String(level || "").slice(0, 20)),
      temperature: 0.6,
      fast: true,
      thinking: "minimal",
      maxTokens: 900,
    });
    return Response.json({ text });
  } catch (e) {
    const status = e instanceof GeminiError ? e.status : 500;
    return Response.json({ error: e.message || "AI error" }, { status });
  }
}
