// Қазақша дауыстап оқу (құрылғыда қазақша дауыс болмаса): Gemini TTS
export const maxDuration = 60;

const FALLBACK = [process.env.GEMINI_TTS_MODEL, "gemini-2.5-flash-preview-tts", "gemini-3.1-flash-tts-preview", "gemini-2.5-pro-preview-tts"].filter(Boolean);
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

// Дыбысты тазалау: басы мен соңындағы үнсіздікті кесеміз, жұмсақ кіру/сөну қосамын,
// соңына қысқа тыныштық қоямыз — сонда соңында «шырт» еткен дыбыс болмайды.
function cleanPcm(buf, rate = 24000) {
  const n = Math.floor(buf.length / 2);
  if (n < rate / 10) return buf;
  const src = new Int16Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + n * 2));
  const TH = 600; // ~ -35 dB
  let a = 0;
  while (a < n && Math.abs(src[a]) < TH) a++;
  let b = n - 1;
  while (b > a && Math.abs(src[b]) < TH) b--;
  if (b - a < rate / 20) return buf; // тым қысқа — өзгертпейміз
  a = Math.max(0, a - Math.round(rate * 0.04));
  // Сөну дыбыстың нақты соңына келеді (үнсіздікке емес) — кенет үзілген жерде де шырт етпейді
  b = Math.min(n - 1, b + Math.round(rate * 0.015));
  const body = src.slice(a, b + 1);
  const fin = Math.min(Math.round(rate * 0.012), body.length >> 2);
  const fout = Math.min(Math.round(rate * 0.07), body.length >> 2);
  for (let i = 0; i < fin; i++) body[i] = Math.round(body[i] * (i / fin));
  for (let i = 0; i < fout; i++) {
    const k = body.length - 1 - i;
    const g = i / fout;
    body[k] = Math.round(body[k] * g * g);
  }
  const padStart = Math.round(rate * 0.03);
  const padEnd = Math.round(rate * 0.18);
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
  const slow = Boolean(body?.slow);
  if (!text) return Response.json({ error: "Bad request" }, { status: 400 });
  const ckey = `${slow ? "s" : "n"}|${text}`;
  if (cache.has(ckey)) return Response.json({ audio: cache.get(ckey) });
  // Нұсқаулық өте қысқа: модель тек қос нүктеден кейінгі мәтінді айтады, артық сөз қоспайды
  const short = text.split(/\s+/).length <= 3;
  const prompt = short
    ? `Say in Kazakh, ${slow ? "slowly and very clearly" : "clearly"}: ${text}`
    : `Read aloud in Kazakh, ${slow ? "slowly" : "at a calm pace"}: ${text}`;

  const models = [...new Set([...FALLBACK, ...(await ttsModels(key))])].slice(0, 5);
  let last = "";
  for (const m of models) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } } },
        }),
        signal: AbortSignal.timeout(40_000),
      });
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
      if (cache.size > 40) cache.clear();
      cache.set(ckey, audio);
      return Response.json({ audio });
    } catch (e) {
      last = `${m}: ${e.message}`;
    }
  }
  return Response.json({ error: `TTS unavailable — ${last}` }, { status: 502 });
}
