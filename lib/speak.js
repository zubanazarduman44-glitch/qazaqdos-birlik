"use client";
// Қазақша дауыстап оқу: құрылғының қазақша дауысы болса — сол, болмаса сервердегі Gemini TTS.
// Жақсартулар: аудио құрылғыда сақталады (қайта айтқанда лезде), бір уақытта бір ғана дыбыс, қайталау, баяу режим.

export function getKkVoice() {
  return new Promise((resolve) => {
    const s = typeof window !== "undefined" ? window.speechSynthesis : null;
    if (!s) return resolve(null);
    const pick = () => s.getVoices().find((v) => /^kk/i.test(v.lang)) || null;
    const v = pick();
    if (v || s.getVoices().length) return resolve(v);
    const done = () => {
      s.removeEventListener("voiceschanged", done);
      resolve(pick());
    };
    s.addEventListener("voiceschanged", done);
    setTimeout(done, 700);
  });
}

const CACHE = "tilim-tts-v2"; // v2: артық сөзсіз, соңы тегіс дыбыстар (ескі кэш қолданылмайды)
const urls = new Map(); // жад ішіндегі: кілт -> blob URL
const pending = new Map(); // жүріп жатқан сұраныстар (қайталанбасын)
const key = (text, slow) => `${slow ? "s" : "n"}|${text}`;
const cacheReq = (k) => new Request(`/__tts/${encodeURIComponent(k)}`);

function b64ToBlob(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: "audio/wav" });
}

async function fromDisk(k) {
  try {
    const c = await caches.open(CACHE);
    const r = await c.match(cacheReq(k));
    return r ? await r.blob() : null;
  } catch {
    return null;
  }
}
// Ескі нұсқаның кэшін өшіреміз (орын босасын)
if (typeof caches !== "undefined") caches.delete("tilim-tts-v1").catch(() => {});

async function toDisk(k, blob) {
  try {
    const c = await caches.open(CACHE);
    await c.put(cacheReq(k), new Response(blob, { headers: { "Content-Type": "audio/wav" } }));
    const keys = await c.keys();
    if (keys.length > 600) await c.delete(keys[0]); // ескілерін өшіреміз
  } catch {}
}

export async function fetchTtsUrl(text, slow = false) {
  const k = key(text, slow);
  if (urls.has(k)) return urls.get(k);
  if (pending.has(k)) return pending.get(k);
  const job = (async () => {
    const saved = await fromDisk(k);
    if (saved) {
      const u = URL.createObjectURL(saved);
      urls.set(k, u);
      return u;
    }
    let lastErr;
    for (let i = 0; i < 2; i++) {
      try {
        const r = await fetch("/api/tts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, slow }) });
        const d = await r.json().catch(() => ({}));
        if (!r.ok || !d.audio) throw new Error(d.error || "TTS");
        const blob = b64ToBlob(d.audio);
        toDisk(k, blob);
        const u = URL.createObjectURL(blob);
        urls.set(k, u);
        return u;
      } catch (e) {
        lastErr = e;
        await new Promise((res) => setTimeout(res, 600));
      }
    }
    throw lastErr;
  })().finally(() => pending.delete(k));
  pending.set(k, job);
  return job;
}

// Алдын ала жүктеу: келесі сөздер басқанда лезде айтылсын
export function prefetchKk(list, slow = false) {
  (async () => {
    for (const t of list) {
      try {
        await fetchTtsUrl(t, slow);
      } catch {
        return;
      }
      await new Promise((r) => setTimeout(r, 400));
    }
  })();
}

let current = null;
export function stopKk() {
  try {
    window.speechSynthesis?.cancel();
  } catch {}
  if (current) {
    try {
      current.pause();
    } catch {}
    current = null;
  }
}

// Сөзді дауыстап айту. { slow: true } — баяу. onState("loading"|"playing"|"idle"|"error")
export async function sayKk(text, { slow = false, onState } = {}) {
  const st = (s) => onState && onState(s);
  stopKk();
  const v = await getKkVoice();
  if (v) {
    const u = new SpeechSynthesisUtterance(text);
    u.voice = v;
    u.lang = v.lang;
    u.rate = slow ? 0.55 : 0.8;
    u.onend = () => st("idle");
    st("playing");
    return window.speechSynthesis.speak(u);
  }
  st("loading");
  try {
    const url = await fetchTtsUrl(text, slow);
    stopKk();
    const a = new Audio(url);
    current = a;
    a.onended = () => st("idle");
    a.onerror = () => st("error");
    st("playing");
    await a.play();
  } catch {
    st("error");
  }
}
