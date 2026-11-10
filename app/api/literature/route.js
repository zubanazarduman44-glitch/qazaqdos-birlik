// Әдебиет: Qyran мәтінді оқығаннан кейін сол мәтін бойынша сұрақ қояды және жауап береді
import { callGemini, GeminiError, LANG_NAMES } from "../../../lib/gemini";

export const maxDuration = 60;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  const { messages, title = "", author = "", text = "", explain = "ru", level = "A2", name = "" } = body || {};
  if (!Array.isArray(messages) || !messages.length || typeof text !== "string" || !text.trim()) return Response.json({ error: "Bad request" }, { status: 400 });
  const lang = LANG_NAMES[explain] || LANG_NAMES.ru;

  const system = `Сен — Qyran, қазақ әдебиетін үйретуші мейірімді мұғалімсің. Оқушы (${String(name).slice(0, 40) || "дос"}, деңгейі ${String(level).slice(0, 6)}) мына мәтінді оқып болды.
Шығарма: «${String(title).slice(0, 80)}», автор: ${String(author).slice(0, 80)}.
Мәтін:
"""${text.slice(0, 2500)}"""

Тапсырма:
- Оқушы «оқып бітірдім» десе, мәтін бойынша үш қарапайым сұрақ қой, бірақ БІР-БІРЛЕП: алдымен тек бірінші сұрақты қой.
- Оқушы жауап берсе: дұрыс/дұрыс емес екенін айт, мәтінге сүйеніп қысқаша түсіндір, қазақша қатесі болса ақырын түзет, содан кейін келесі сұрақты қой. Үшінші жауаптан кейін қысқа қорытынды мен мақтау айт.
- Оқушы өзі сұрақ қойса, мәтінге және шығарма/автор туралы белгілі шындыққа сүйеніп жауап бер. Сенімсіз болсаң — ашық айт, ештеңе ойдан шығарма.
- Сұрақтар мен мысалдар қазақша болсын, түсіндірме ${lang} болсын. Жауап қысқа (150 сөзден аспасын), **жуан** және «- » тізімді қолдануға болады. Эмодзиді аз қолдан.`;

  const contents = messages
    .slice(-14)
    .filter((m) => typeof m?.text === "string" && m.text.trim())
    .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.text.slice(0, 1500) }] }));
  while (contents.length && contents[0].role !== "user") contents.shift();
  if (!contents.length || contents[contents.length - 1].role !== "user") return Response.json({ error: "Bad request" }, { status: 400 });

  try {
    const out = await callGemini(contents, { system, temperature: 0.4, fast: false, thinking: "low", maxTokens: 1200 });
    return Response.json({ text: out });
  } catch (e) {
    const status = e instanceof GeminiError ? e.status : 500;
    return Response.json({ error: e.message || "AI error" }, { status });
  }
}
