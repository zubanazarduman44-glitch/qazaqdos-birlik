"use client";
// Жазбаны 16 кГц моно WAV-қа айналдырамыз (Gemini түсінеді, көлемі аз)
export async function toWav(blob) {
  const ab = await blob.arrayBuffer();
  const AC = window.AudioContext || window.webkitAudioContext;
  const ctx = new AC();
  const buf = await new Promise((ok, no) => ctx.decodeAudioData(ab, ok, no));
  ctx.close?.();
  const rate = 16000;
  const off = new OfflineAudioContext(1, Math.max(1, Math.ceil(buf.duration * rate)), rate);
  const src = off.createBufferSource();
  src.buffer = buf;
  src.connect(off.destination);
  src.start();
  const out = (await off.startRendering()).getChannelData(0);
  const pcm = new DataView(new ArrayBuffer(44 + out.length * 2));
  const w = (o, s) => [...s].forEach((c, i) => pcm.setUint8(o + i, c.charCodeAt(0)));
  w(0, "RIFF");
  pcm.setUint32(4, 36 + out.length * 2, true);
  w(8, "WAVEfmt ");
  pcm.setUint32(16, 16, true);
  pcm.setUint16(20, 1, true);
  pcm.setUint16(22, 1, true);
  pcm.setUint32(24, rate, true);
  pcm.setUint32(28, rate * 2, true);
  pcm.setUint16(32, 2, true);
  pcm.setUint16(34, 16, true);
  w(36, "data");
  pcm.setUint32(40, out.length * 2, true);
  for (let i = 0; i < out.length; i++) pcm.setInt16(44 + i * 2, Math.max(-1, Math.min(1, out[i])) * 0x7fff, true);
  const bytes = new Uint8Array(pcm.buffer);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

