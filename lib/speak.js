"use client";
// Қазақша дауыстап оқу: алдымен құрылғы дауысы, болмаса сервердегі Gemini TTS

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

const urls = new Map();
export async function fetchTtsUrl(text) {
  if (urls.has(text)) return urls.get(text);
  const r = await fetch("/api/tts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.audio) throw new Error(d.error || "TTS");
  const bin = atob(d.audio);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const url = URL.createObjectURL(new Blob([bytes], { type: "audio/wav" }));
  urls.set(text, url);
  return url;
}
