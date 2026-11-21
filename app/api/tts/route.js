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

// «Чы-чық» шуылы: сөз біткен соң ~0,3 с үнсіздік, сосын екі қатты қысқа дыбыс, араларында дәл нөл.
// Соңынан қараймыз: үнсіз аралықтан (≥100 мс) кейінгі қысқа соңғы бөлік артефакт болса — кесеміз.
// Артефакт белгісі: ішінде дәл нөл терезелер бар (≤400 мс) немесе ұзақ үнсіздіктен кейінгі өте қысқа дыбыс.
function cutTailBurst(rms, zero, wins, peak) {
  const silent = (k) => rms[k] < peak * 0.02 && !zero[k];
  const low = (k) => rms[k] < peak * 0.02;
  let end = wins;
  for (let pass = 0; pass < 2; pass++) {
    let k = end - 1;
    while (k >= 0 && low(k)) k--;
    if (k < 0) break;
    const tailEnd = k;
    let j = k, run = 0;
    for (; j >= 0; j--) {
      if (silent(j)) { if (++run >= 10) break; } else run = 0;
    }
    if (j < 0) break; // үнсіз аралық жоқ — бәрі бір сөз
    const tailStart = j + 10;
    let g = j;
    while (g >= 0 && low(g)) g--;
    const gapLen = tailStart - (g + 1);
    const tailLen = tailEnd - tailStart + 1;
    let loudBefore = 0;
    for (let i = 0; i <= g; i++) if (rms[i] >= peak * 0.05) loudBefore++;
    let zeroIn = false;
    for (let i = tailStart + 1; i <= tailEnd; i++) if (zero[i] && zero[i - 1]) zeroIn = true;
    const burst = (zeroIn && tailLen <= 40) || (gapLen >= 25 && tailLen <= 20);
    if (!burst || loudBefore < 15) break;
    end = g + 1 + Math.min(gapLen, 5);
  }
  return end;
}

// Дыбысты тазалау. Gemini кейде сөздің соңына дем шығару / «шш» деген шуыл қосады — соны кесеміз.
// 10 мс терезелермен қараймыз: қуаты (RMS) мен нөлден өту жиілігі (ZCR). Соңынан бастап
// тым әлсіз терезелерді және «ысылдаған» (ZCR жоғары, қуаты төмен) терезелерді алып тастаймыз.
function cleanPcm(buf, rate = 24000) {
  const n = Math.floor(buf.length / 2);
  if (n < rate / 10) return buf;
  const src = new Int16Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + n * 2));
  const W = Math.round(rate * 0.01);
  let wins = Math.floor(n / W);
  const rms = new Float64Array(wins);
  const zcr = new Float64Array(wins);
  const zero = new Uint8Array(wins); // терезедегі барлық сэмпл дәл 0 (табиғи сөзде болмайды)
  let peak = 0;
  for (let w = 0; w < wins; w++) {
    let e = 0, z = 0, nz = 0;
    for (let i = w * W, end = i + W; i < end; i++) {
      e += src[i] * src[i];
      if (src[i] !== 0) nz++;
      if (i > w * W && (src[i] >= 0) !== (src[i - 1] >= 0)) z++;
    }
    rms[w] = Math.sqrt(e / W);
    zcr[w] = z / W;
    zero[w] = nz === 0 ? 1 : 0;
    if (rms[w] > peak) peak = rms[w];
  }
  if (peak < 300) return buf;
  wins = cutTailBurst(rms, zero, wins, peak);
  // Соңынан тек үнсіздікті кесеміз. Бұрынғы «ысыл» кескіш (ZCR) соңғы дауыссыз дыбысты (с, ш, қ, п)
  // жеп қоятын — нақты шуылды енді cutTailBurst алып тастайды.
  const quiet = (w) => rms[w] < peak * 0.02;
  let a = 0;
  while (a < wins && rms[a] < peak * 0.05) a++;
  let b = wins - 1;
  const minB = a + Math.floor((wins - a) * 0.6);
  while (b > minB && quiet(b)) b--;
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
