"use client";
// «Түзел» бөлімінің ортақ бөлшектері (киіз-аппликация стилі):
// TuzelMeter — 20 буыннан тұратын ұпай сақинасы (шарап → алтын → жасыл белдеулер)
// TuzelWave  — жазу кезіндегі дыбыс толқыны (микрофон ағынынан, болмаса жай анимация)
// TuzelSay   — Aqyl-дың сөз көпіршігі
// TuzelArt   — қойындыларға арналған шағын суреттер (дәптер, микрофон)
// diffWords / matchChanges — бастапқы және түзетілген мәтінді сөз бойынша салыстыру
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Qyran from "./Qyran";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const reduced = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Санды 0-ден мәніне дейін жүгіртеді (SSR кезінде бірден соңғы мән)
export function useCountUp(value, ms = 900) {
  const [n, setN] = useState(value);
  useIso(() => {
    if (reduced()) return setN(value);
    let raf;
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / ms);
      setN(Math.round(value * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    setN(0);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return n;
}

export const band = (v) => (v >= 70 ? "ok" : v >= 40 ? "mid" : "low");

// Сақина буыны (сегмент) — доғаның жолы
function arc(i, n, r, gap) {
  const step = 360 / n;
  const a0 = ((-90 + i * step + gap / 2) * Math.PI) / 180;
  const a1 = ((-90 + (i + 1) * step - gap / 2) * Math.PI) / 180;
  const p = (a) => `${(60 + r * Math.cos(a)).toFixed(2)} ${(60 + r * Math.sin(a)).toFixed(2)}`;
  return `M${p(a0)} A${r} ${r} 0 0 1 ${p(a1)}`;
}
const SEG = 20;
const segBand = (i) => (i >= 14 ? "ok" : i >= 8 ? "mid" : "low");

export function TuzelMeter({ value = 0, label, size = 148, className = "" }) {
  const v = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  const n = useCountUp(v);
  const lit = Math.round(v / 5);
  return (
    <div className={`tz-meter b-${band(v)} ${className}`} style={{ "--sz": `${size}px` }}>
      <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
        <circle cx="60" cy="60" r="38" className="tz-meter-face" />
        <circle cx="60" cy="60" r="38" className="tz-meter-stitch" />
        {Array.from({ length: SEG }, (_, i) => (
          <path key={i} d={arc(i, SEG, 49, 7.5)} className={`tz-seg s-${segBand(i)} ${i < lit ? "on" : ""}`} style={{ "--i": i }} />
        ))}
      </svg>
      <div className="tz-meter-num" dir="ltr" role="img" aria-label={`${label ? label + ": " : ""}${v} / 100`}>
        <b aria-hidden="true">{n}</b>
        {label && <small aria-hidden="true">{label}</small>}
      </div>
    </div>
  );
}

// Дыбыс толқыны: stream берілсе — нақты деңгей (AnalyserNode), әйтпесе CSS анимация
export function TuzelWave({ stream, bars = 21, className = "" }) {
  const refs = useRef([]);
  const [live, setLive] = useState(false);
  useEffect(() => {
    if (!stream) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    let ctx, raf;
    try {
      ctx = new AC();
      const src = ctx.createMediaStreamSource(stream);
      const an = ctx.createAnalyser();
      an.fftSize = 128;
      an.smoothingTimeConstant = 0.72;
      src.connect(an);
      const data = new Uint8Array(an.frequencyBinCount);
      const mid = (bars - 1) / 2;
      setLive(true);
      const tick = () => {
        an.getByteFrequencyData(data);
        refs.current.forEach((el, i) => {
          if (!el) return;
          // ортасы — төменгі жиіліктер, шеттеріне қарай жоғарылары (симметриялы)
          const bin = 2 + Math.round(Math.abs(i - mid) * 1.6);
          const v = data[bin] / 255;
          el.style.transform = `scaleY(${(0.12 + v * 0.88).toFixed(3)})`;
        });
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    } catch {
      setLive(false);
    }
    return () => {
      cancelAnimationFrame(raf);
      setLive(false);
      try { ctx?.close(); } catch {}
    };
  }, [stream, bars]);
  return (
    <div className={`tz-wave ${live ? "live" : "auto"} ${className}`} aria-hidden="true">
      {Array.from({ length: bars }, (_, i) => (
        <i key={i} ref={(el) => (refs.current[i] = el)} style={{ "--i": i, "--d": Math.abs(i - (bars - 1) / 2) }} />
      ))}
    </div>
  );
}

// Aqyl-дың сөз көпіршігі
export function TuzelSay({ mood = "idle", size = 64, tone = "", children, className = "", hideBird = false }) {
  return (
    <div className={`tz-say ${tone} ${hideBird ? "nobird" : ""} ${className}`}>
      {!hideBird && (
        <span className="tz-say-bird">
          <Qyran mood={mood} size={size} />
        </span>
      )}
      <div className="tz-say-bubble">{children}</div>
    </div>
  );
}

const RED = "#B8322A", RED_D = "#8A2018", GOLD = "#E0A526", PGOLD = "#F6E3B0", BLUE = "#0F5E7A", CREAM = "#FFFDF7", INK = "#1F2430";

// Қойынды суреттері (56×56)
export function TuzelArt({ name, size = 56 }) {
  if (name === "mic")
    return (
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" className="tz-art">
        <circle cx="32" cy="32" r="30" fill="#DDEBEF" />
        <g fill="none" stroke={BLUE} strokeWidth="3" strokeLinecap="round" className="tz-art-waves">
          <path d="M13 24c-3 5-3 11 0 16" />
          <path d="M51 24c3 5 3 11 0 16" />
          <path d="M8 19c-5 8-5 18 0 26" opacity=".55" />
          <path d="M56 19c5 8 5 18 0 26" opacity=".55" />
        </g>
        <rect x="24" y="10" width="16" height="28" rx="8" fill={RED} />
        <path d="M24 22h16M24 27h16M24 32h16" stroke={RED_D} strokeWidth="1.6" strokeDasharray="2 2" />
        <rect x="27.5" y="13" width="3" height="8" rx="1.5" fill="#E46A5E" />
        <path d="M18 30c0 9 6 14 14 14s14-5 14-14" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <path d="M32 44v8" stroke={INK} strokeWidth="3" />
        <rect x="22" y="51" width="20" height="5" rx="2.5" fill={GOLD} />
      </svg>
    );
  // дәптер + қалам
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" className="tz-art">
      <circle cx="32" cy="32" r="30" fill={PGOLD} />
      <g transform="rotate(-8 32 34)">
        <rect x="14" y="12" width="34" height="42" rx="4" fill={RED_D} />
        <rect x="16" y="11" width="32" height="42" rx="3.5" fill={CREAM} />
        <path d="M22 11v42" stroke={RED} strokeWidth="1.6" />
        <g stroke="#9CC3CF" strokeWidth="1.4">
          <path d="M18 21h28M18 27h28M18 33h28M18 39h28M18 45h28" />
        </g>
        <path d="M25 26.6c3-2 5 1 8-1s5 1 8-1" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M25 32.6c4-1 7 1 11-.5" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M25 38.4h9" stroke="#2F6B4F" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M14 18h4M14 26h4M14 34h4M14 42h4" stroke={GOLD} strokeWidth="2.4" strokeLinecap="round" />
      </g>
      <g transform="rotate(38 46 40)">
        <rect x="42" y="16" width="8" height="30" rx="2" fill={BLUE} />
        <rect x="42" y="16" width="8" height="5" rx="2" fill={GOLD} />
        <path d="M42 46h8l-4 8z" fill={PGOLD} />
        <path d="M45 51h2l-1 3z" fill={INK} />
      </g>
    </svg>
  );
}

// ── Сөз бойынша салыстыру ──
const norm = (s) => String(s || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const tok = (s) => String(s || "").match(/\S+\s*/g) || [];

// Нәтиже: [{ t: "eq", s }] | [{ t: "fix", del: "…", ins: "…", tail: " " }]
export function diffWords(a, b) {
  const A = tok(a), B = tok(b);
  const n = A.length, m = B.length;
  if (n * m > 400000) return [{ t: "fix", del: a, ins: b, tail: "" }];
  const ka = A.map((x) => x.trim()), kb = B.map((x) => x.trim());
  const L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = ka[i] === kb[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const out = [];
  let cur = null;
  const flush = () => {
    if (cur) {
      cur.del = cur.del.join(" ");
      cur.ins = cur.ins.join(" ");
      out.push(cur);
      cur = null;
    }
  };
  let i = 0, j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && ka[i] === kb[j]) {
      flush();
      out.push({ t: "eq", s: B[j] });
      i++; j++;
    } else if (j < m && (i >= n || L[i][j + 1] >= L[i + 1][j])) {
      cur = cur || { t: "fix", del: [], ins: [], tail: " " };
      cur.ins.push(kb[j]);
      cur.tail = B[j].slice(kb[j].length) || " ";
      j++;
    } else {
      cur = cur || { t: "fix", del: [], ins: [], tail: " " };
      cur.del.push(ka[i]);
      if (!cur.ins.length) cur.tail = A[i].slice(ka[i].length) || " ";
      i++;
    }
  }
  flush();
  return out;
}

// Бір сөз ішіндегі өзгеріс: ортақ басы/соңы бөлек (сабақ → саба|қ→ғым)
export function splitWord(del, ins) {
  if (!del || !ins || /\s/.test(del) || /\s/.test(ins)) return null;
  const a = [...del], b = [...ins];
  let p = 0;
  while (p < a.length && p < b.length && a[p] === b[p]) p++;
  let q = 0;
  while (q < a.length - p && q < b.length - p && a[a.length - 1 - q] === b[b.length - 1 - q]) q++;
  if (p + q < 2) return null;
  return { pre: a.slice(0, p).join(""), del: a.slice(p, a.length - q).join(""), ins: b.slice(p, b.length - q).join(""), post: a.slice(a.length - q).join("") };
}

// Әр түзетуге API берген түсіндірмені (changes[i]) табу
export function matchChanges(parts, changes = []) {
  const used = new Set();
  const hit = (p, c) => {
    const f = norm(c.from), t = norm(c.to), d = norm(p.del), s = norm(p.ins);
    return (f && d && (d.includes(f) || f.includes(d))) || (t && s && (s.includes(t) || t.includes(s)));
  };
  return parts.map((p) => {
    if (p.t !== "fix") return p;
    let k = changes.findIndex((c, i) => !used.has(i) && hit(p, c));
    if (k < 0) k = changes.findIndex((c, i) => used.has(i) && hit(p, c));
    if (k >= 0) used.add(k);
    return { ...p, k };
  });
}
