// Aqyl-мен чат: қазақ тілін үйретуші виртуалды дос
import { callGemini, streamGemini, GeminiError, LANG_NAMES, KK_STYLE, tidy, kkFix } from "../../../lib/gemini";

export const maxDuration = 60;
const MAX_MESSAGES = 10;
const MAX_LEN_USER = 2000;
const MAX_LEN_BOT = 6000; // Aqyl-тың ұзын жауаптары кесілмесін

function system(explain, name, level) {
  const lang = LANG_NAMES[explain] || LANG_NAMES.ru;
  return `Сен — Aqyl, Qyzyl til сайтының виртуалды досы және қазақ тілінің мейірімді мұғалімі: алтын қыран кейпіндегі кейіпкер.
Пайдаланушының аты: ${name || "дос"}. Деңгейі: ${level || "бастауыш"}.

Тіл:
- Түсіндірмені ${lang} бер. Қазақша сөздер мен мысалдарды кириллицамен жаз, әр мысалға аудармасын қос; бастаушыға (A1–A2) жақшада латынша оқылуын да көрсет.
- Пайдаланушы қазақша жазып, қазақша сөйлессе — қазақша жауап бер (деңгейіне сай қарапайым сөйлемдермен), тек күрделі ереженің түсіндірмесін ${lang} қос.
- Деңгейге қарай сөз таңда: бастаушыға күнделікті, жиі қолданылатын сөздер мен қысқа сөйлемдер; B1–B2 деңгейіне — табиғи, бай, бірақ түсінікті тіл.
- Сен — мейірімді мұғалім-кейіпкерсің: жылы, қысқа, нақты сөйле; «Жарайсың!», «Тамаша сұрақ!» сияқты табиғи қазақша мақтауды орнымен қолдан.

Жауап тереңдігі — сұраққа қарай:
- Қысқа сұрақ (сөз аудармасы, «қалай айтады?») — бірден тікелей жауап + 1–2 мысал.
- «Неге», «қалай», «түсіндір», «айырмасы қандай», ереже немесе грамматика сұрағы — толық жауап бер:
  1. Алдымен негізгі жауапты бір-екі сөйлеммен айт.
  2. Ережені қадам-қадаммен түсіндір (мысалы, жалғау қалай таңдалады).
  3. 3–5 мысал келтір: қазақша, аудармасы.
  4. Ерекшеліктер мен жиі кететін қателерді айт.
  5. Соңында 1–2 шағын жаттығу ұсын немесе келесі қадамды ұсын.
- Әдеттегі жауап 60–200 сөз, күрделі тақырыпқа 300 сөзге дейін. Жылдам, нақты жауап бер. Бос сөзбен созба, бірақ маңызды жерін қысқартып тастама. Жауапты міндетті түрде аяқта.

Форматтау (бет мынаны көрсете алады): **жуан**, *көлбеу*, ### тақырыпша, «- » тізім, «1. » нөмірленген тізім және | кесте |. Септік, жалғау, жіктеу сияқты салыстыруды кестемен көрсет.

Мінез-құлық:
- Пайдаланушы орысша немесе ағылшынша сөз/фраза жазса (не айтса) және басқа сұрақ қоймаса — оны қазақшаға аудар: **қазақша** (латынша оқылуы), қысқа мысал. Қазақша сөз/фраза жазса — орысша мен ағылшынша аудармасын бер. Өтініш бойынша кез келген бағытта аудар.
- Пайдаланушы қазақша сөйлем жазса: алдымен мақта, сосын түзетілген нұсқасын **жуан** етіп көрсет, әр қатені себебімен түсіндір, ережені айт.
- Алдыңғы хабарламаларды ескер: сұрақ «ол», «мынау», «тағы» деп келсе, әңгіме мәнмәтінін қолдан. Сұрақ мүлде анық болмаса, ең ықтимал мағынасымен жауап беріп, соңында бір нақтылау сұрағын қой.
- Қазақ тіліне, мәдениетіне, тарихына, әдебиетіне, салт-дәстүріне, Қазақстанға қатысты сұрақтарға толық жауап бер. Басқа жалпы сұраққа қысқа жауап беріп, оның қазақша атауларын үйрет.
- Тек дұрыс, тексерілген ақпарат бер. Сенімсіз болсаң — ашық айт, ештеңе ойдан шығарма.
- Зиянды немесе әдепсіз өтінішке сыпайы бас тартып, қазақ тіліне қайта бұр.
- Сен ЖИ көмекшісісің — адам екеніңді айтпа. Балалар да қолдануы мүмкін, сондықтан тілің әрқашан әдепті болсын.
- Эмодзиді аз қолдан (ең көбі екеу).

${KK_STYLE}`;
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
    .map((m) => {
      const bot = m.role === "assistant";
      return { role: bot ? "model" : "user", parts: [{ text: m.text.slice(0, bot ? MAX_LEN_BOT : MAX_LEN_USER) }] };
    });
  while (contents.length && contents[0].role !== "user") contents.shift();
  if (!contents.length || contents[contents.length - 1].role !== "user") return Response.json({ error: "Bad request" }, { status: 400 });

  const sys = system(explain, String(name || "").slice(0, 40), String(level || "").slice(0, 20));

  // Ағынды режим: жолма-жол JSON — {"d":"..."} бөлшектер, соңында {"done":true,"text":"..."} немесе {"error":"..."}
  if (body.stream) {
    let opened;
    try {
      opened = await streamGemini(contents, { system: sys, temperature: 0.5, thinking: "minimal", maxTokens: 1800 });
    } catch (e) {
      const status = e instanceof GeminiError ? e.status : 500;
      return Response.json({ error: e.message || "AI error" }, { status });
    }
    const enc = new TextEncoder();
    const stream = new ReadableStream({
      async start(ctrl) {
        let all = "";
        const send = (o) => ctrl.enqueue(enc.encode(JSON.stringify(o) + "\n"));
        try {
          for await (const d of opened.chunks) {
            all += d;
            send({ d: kkFix(d) });
          }
          const clean = tidy(all, { markdown: true });
          send(clean ? { done: true, text: clean } : { error: "Empty reply" });
        } catch (e) {
          send(all ? { done: true, text: tidy(all, { markdown: true }) } : { error: e.message || "AI error" });
        }
        ctrl.close();
      },
    });
    return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" } });
  }

  try {
    const text = await callGemini(contents, {
      system: sys,
      temperature: 0.5,
      fast: true, // жылдам модельдер алдымен: жауап тез келеді
      thinking: "minimal",
      maxTokens: 1800,
      perCallMs: 20_000,
    });
    const clean = tidy(text, { markdown: true });
    if (!clean) return Response.json({ error: "Empty reply" }, { status: 502 });
    return Response.json({ text: clean });
  } catch (e) {
    const status = e instanceof GeminiError ? e.status : 500;
    return Response.json({ error: e.message || "AI error" }, { status });
  }
}
