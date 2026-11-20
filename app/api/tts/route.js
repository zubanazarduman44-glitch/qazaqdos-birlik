// Қазақша дауыстап оқу (құрылғыда қазақша дауыс болмаса): Gemini TTS
export const maxDuration = 60;

const FALLBACK = [process.env.GEMINI_TTS_MODEL, "gemini-3.8-flash-tts", "gemini-2.5-flash-preview-tts", "gemini-3.8-flash-lite-tts"].filter(Boolean);
// Тілді нақты көрсетеміз: әйтпесе модель кириллицаны кейде орысша оқиды. Қолдамаған модель — келесі модельге өтеміз.
const LANG = "kk-KZ";
const noLang = new Set();
const cache = new Map();
let found = { at: 0, list: [] };

async function ttsModels(key) {
  if (Date.now() - found.at < 3_600_000) return found.list;
  try {
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", { headers: { "x-goog-api-key": key }, signal: AbortSignal.timeout(4000) });
    if (r.ok) {
      const d = await r.json();
      found = { at: Date.now(), list: (d.models || []).map((m) => String(m.name).replace(/^models\//, "")).filter((n) => /tts/.test(n)) };
    }
  } catch {}
  return found.list;
}

function wav(pcm, rate = 24000) {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + pcm.length, 4);
  h.write("WAVEfmt ", 8);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(rate, 24);
  h.writeUInt32LE(rate * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

// Дыбысты тазалау. Gemini кейде сөздің соңына дем шығару / «шш» деген шуыл қосады — соны кесеміз.
// 10 мс терезелермен қараймыз: қуаты (RMS) мен нөлден өту жиілігі (ZCR). Соңынан бастап
// тым әлсіз терезелерді және «ысылдаған» (ZCR жоғары, қуаты төмен) терезелерді алып тастаймыз.
function cleanPcm(buf, rate = 24000) {
  const n = Math.floor(buf.length / 2);
  if (n < rate / 10) return buf;
  const src = new Int16Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + n * 2));
  const W = Math.round(rate * 0.01);
  const wins = Math.floor(n / W);
  const rms = new Float64Array(wins);
  const zcr = new Float64Array(wins);
  let peak = 0;
  for (let w = 0; w < wins; w++) {
    let e = 0, z = 0;
    for (let i = w * W, end = i + W; i < end; i++) {
      e += src[i] * src[i];
      if (i > w * W && (src[i] >= 0) !== (src[i - 1] >= 0)) z++;
    }
    rms[w] = Math.sqrt(e / W);
    zcr[w] = z / W;
    if (rms[w] > peak) peak = rms[w];
  }
  if (peak < 300) return buf;
  const quiet = (w) => rms[w] < peak * 0.05;
  const hiss = (w) => zcr[w] > 0.22 && rms[w] < peak * 0.3;
  let a = 0;
  while (a < wins && quiet(a)) a++;
  let b = wins - 1;
  // Соңынан: үнсіздік пен ысылды кесеміз (бірақ сөздің өзінен 40%-дан артық емес)
  const minB = a + Math.floor((wins - a) * 0.6);
  while (b > minB && (quiet(b) || hiss(b))) b--;
  if (b <= a) return buf;
  let s0 = Math.max(0, a * W - Math.round(rate * 0.03));
  let s1 = Math.min(n, (b + 1) * W + Math.round(rate * 0.01));
  const body = src.slice(s0, s1);
  const fin = Math.min(Math.round(rate * 0.012), body.length >> 2);
  const fout = Math.min(Math.round(rate * 0.06), body.length >> 2);
  for (let i = 0; i < fin; i++) body[i] = Math.round(body[i] * (i / fin));
  for (let i = 0; i < fout; i++) {
    const k = body.length - 1 - i;
    const g = 0.5 - 0.5 * Math.cos((Math.PI * i) / fout); // жұмсақ (косинус) сөну
    body[k] = Math.round(body[k] * g);
  }
  const padStart = Math.round(rate * 0.03);
  const padEnd = Math.round(rate * 0.15);
  const out = new Int16Array(padStart + body.length + padEnd);
  out.set(body, padStart);
  return Buffer.from(out.buffer);
}

export async function POST(req) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return Response.json({ error: "GEMINI_API_KEY missing" }, { status: 500 });
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  const text = String(body?.text || "").trim().slice(0, 1000);
  if (!text) return Response.json({ error: "Bad request" }, { status: 400 });
  // Модельге ТЕК экрандағы мәтін жіберіледі — ешқандай нұсқаусыз.
  // Нұсқау берілгенде модель кейде оны да дауыстап оқитын немесе артық сөз/дыбыс қосатын.
  // Баяу режим клиентте ойнату жылдамдығымен жасалады (lib/speak.js), сондықтан бір мәтінге бір жазба.
  const prompt = text
    .replace(/[*_#`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const ckey = prompt;
  if (cache.has(ckey)) return Response.json({ audio: cache.get(ckey) });

  const models = [...new Set([...FALLBACK, ...(await ttsModels(key))])].slice(0, 5);
  // Алдымен kk-KZ қабылдайтын модельдердің бәрін байқаймыз. Бұрын бірінші модель kk-KZ-ті
  // қабылдамаса, тілсіз сол модельмен оқылатын — сөз орыс акцентімен шығатын.
  // Тілсіз оқу — тек ешбір модель kk-KZ-пен жауап бермесе ғана (соңғы амал).
  const tries = [
    ...models.filter((m) => !noLang.has(m)).map((m) => [m, true]),
    ...models.map((m) => [m, false]),
  ];
  let last = "";
  for (const [m, withLang] of tries) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: { ...(withLang ? { languageCode: LANG } : {}), voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } },
          },
        }),
        signal: AbortSignal.timeout(40_000),
      });
      if (r.status === 400 && withLang) noLang.add(m);
      if (!r.ok) {
        last = `${m} (${r.status})`;
        continue;
      }
      const d = await r.json();
      const part = (d?.candidates?.[0]?.content?.parts || []).find((p) => p.inlineData?.data || p.inline_data?.data);
      const b64 = part?.inlineData?.data || part?.inline_data?.data;
      if (!b64) {
        last = `${m}: empty`;
        continue;
      }
      const audio = wav(cleanPcm(Buffer.from(b64, "base64"))).toString("base64");
      // Тілсіз (акцент болуы мүмкін) жазбаны сақтамаймыз — келесі жолы kk-KZ-пен қайта байқалады.
      if (withLang) {
        if (cache.size > 40) cache.clear();
        cache.set(ckey, audio);
      }
      // Тексеру үшін: қай модель, қазақ тілі қосулы ма (құпия емес)
      return Response.json({ audio, kk: withLang }, { headers: { "X-TTS-Model": m, "X-TTS-Lang": withLang ? LANG : "auto" } });
    } catch (e) {
      last = `${m}: ${e.message}`;
    }
  }
  return Response.json({ error: `TTS unavailable — ${last}` }, { status: 502 });
}
