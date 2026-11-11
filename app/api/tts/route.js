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
  // Қысқа сөз бе, сөйлем бе — нұсқаулық соған қарай
  const short = text.split(/\s+/).length <= 3;
  const pace = slow ? "very slowly, syllable by syllable, then once more at a slow natural pace" : "slowly and clearly at a calm, even pace";
  const prompt = short
    ? `Language: Kazakh (kk-KZ). Pronounce this Kazakh word or phrase in standard Kazakh phonetics (not Russian, not Turkish), ${pace}, with correct vowel harmony and the special Kazakh sounds (ә, ө, ү, ұ, қ, ғ, ң, һ, і). Say only the text, nothing else, no introduction: ${text}`
    : `Language: Kazakh (kk-KZ). Read this Kazakh text aloud in standard Kazakh phonetics (not Russian), ${pace}, warm and natural intonation, pausing briefly at punctuation. Read only the text: ${text}`;

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
      const audio = wav(Buffer.from(b64, "base64")).toString("base64");
      if (cache.size > 40) cache.clear();
      cache.set(ckey, audio);
      return Response.json({ audio });
    } catch (e) {
      last = `${m}: ${e.message}`;
    }
  }
  return Response.json({ error: `TTS unavailable — ${last}` }, { status: 502 });
}
