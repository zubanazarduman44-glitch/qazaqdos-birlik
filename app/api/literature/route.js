// Әдебиет: Aqyl мәтінді оқығаннан кейін сол мәтін бойынша сұрақ қояды және жауап береді
import { callGemini, GeminiError, LANG_NAMES } from "../../../lib/gemini";

export const maxDuration = 60;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  const { mode, messages, title = "", author = "", text = "", explain = "ru", level = "A2", name = "" } = body || {};
  if (typeof text !== "string" || !text.trim()) return Response.json({ error: "Bad request" }, { status: 400 });
  if (mode !== "quiz" && (!Array.isArray(messages) || !messages.length)) return Response.json({ error: "Bad request" }, { status: 400 });
  const lang = LANG_NAMES[explain] || LANG_NAMES.ru;

  if (mode === "quiz") {
    const schema = {
      type: "OBJECT",
      properties: {
        questions: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              q: { type: "STRING", description: "Сұрақ (қазақша)" },
              options: { type: "ARRAY", items: { type: "STRING" }, description: "4 жауап нұсқасы (қазақша)" },
              answer: { type: "INTEGER", description: "Дұрыс жауаптың нөмірі 0-3" },
              why: { type: "STRING", description: "Қысқа түсіндірме (түсіндіру тілінде)" },
            },
            required: ["q", "options", "answer", "why"],
          },
        },
      },
      required: ["questions"],
    };
    const prompt = `Мына мәтін бойынша дәл 5 сұрақтан тұратын тест жаса. Шығарма: «${String(title).slice(0, 80)}», автор: ${String(author).slice(0, 80)}. Деңгей: ${String(level).slice(0, 6)}.
Мәтін:
"""${text.slice(0, 2500)}"""
Ережелер: сұрақтар тек осы мәтіннен тікелей жауап табылатындай болсын; әр сұрақта 4 нұсқа, біреуі ғана дұрыс; дұрыс жауап орны әр сұрақта әртүрлі болсын; сұрақ пен нұсқалар қазақша, қысқа және қарапайым; why — ${lang}.`;
    try {
      const out = await callGemini([{ role: "user", parts: [{ text: prompt }] }], { schema, temperature: 0.5, fast: false, thinking: "low", maxTokens: 1800 });
      const d = JSON.parse(out);
      const qs = (d.questions || []).filter((x) => x?.q && Array.isArray(x.options) && x.options.length === 4 && x.answer >= 0 && x.answer <= 3).slice(0, 5);
      if (qs.length < 3) throw new GeminiError("Test could not be built", 502);
      return Response.json({ questions: qs });
    } catch (e) {
      const status = e instanceof GeminiError ? e.status : 500;
      return Response.json({ error: e.message || "AI error" }, { status });
    }
  }

  const system = `Сен — Aqyl, қазақ әдебиетін үйретуші мейірімді мұғалімсің. Оқушы (${String(name).slice(0, 40) || "дос"}, деңгейі ${String(level).slice(0, 6)}) мына мәтінді оқып болды.
Шығарма: «${String(title).slice(0, 80)}», автор: ${String(author).slice(0, 80)}.
Мәтін:
"""${text.slice(0, 2500)}"""

Тапсырма:
- Оқушы мәтін, шығарма не автор туралы сұраса, мәтінге және белгілі шындыққа сүйеніп жауап бер. Сенімсіз болсаң — ашық айт, ештеңе ойдан шығарма.
- Қазақша жазса, қатесін ақырын түзет.
- Мысалдар қазақша болсын, түсіндірме ${lang} болсын. Жауап қысқа (150 сөзден аспасын), **жуан** және «- » тізімді қолдануға болады. Эмодзиді аз қолдан.`;

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
