"use client";
// Басты беттің (лендинг) безендіру бөлшектері: «қызыл тіл» лентасы, теру эффектісі,
// чат пен Vision суреттері және айналдырғанда пайда болу. Мәтін қоспайды — тек
// lib/i18n.js пен lib/regions.js деректерін көрсетеді.
import { useEffect, useId, useRef, useState } from "react";
import TopicArt from "./TopicArt";

const R = "#B8322A", RD = "#8A2018", G = "#E0A526", PG = "#F6E3B0", C = "#FFFDF7", K = "#0F5E7A", I = "#1F2430";

function reduced() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/* ── Айналдыру: [data-reveal] элементтері көрінгенде .in алады ── */
export function useLandingFx(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root || reduced() || typeof IntersectionObserver === "undefined") return;
    root.classList.add("ld-js");
    const els = root.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
}

/* ── Теру: экран оқу құралы толық мәтінді бірден оқиды ── */
export function LandingTyped({ text, delay = 1200, speed = 34 }) {
  const [n, setN] = useState(null); // null = толық мәтін (SSR / қозғалыссыз)
  useEffect(() => {
    if (reduced()) return;
    let i = 0, iv;
    setN(0);
    const to = setTimeout(() => {
      iv = setInterval(() => {
        i += 1;
        setN(i);
        if (i >= text.length) clearInterval(iv);
      }, speed);
    }, delay);
    return () => {
      clearTimeout(to);
      clearInterval(iv);
    };
  }, [text, delay, speed]);
  const shown = n === null ? text : text.slice(0, n);
  const typing = n !== null && n < text.length;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span className="ld-typed" aria-hidden="true">
        {/* орын алдын ала сақталады — бұлт өлшемі секірмейді */}
        <span className="ld-typed-ghost">{text}</span>
        <span className="ld-typed-live">
          {shown}
          {typing && <i className="ld-caret" />}
        </span>
      </span>
    </>
  );
}

/* ── «Қызыл тіл» лентасы: сөздер толқынды лента бойымен ағып, аудармасын ала жүреді ── */
// Жол 2400 бірлік ені, ортасы (x≈1200) әрқашан экран ортасында — Aqyl сол жерде отырады.
const RIB = "M-120 132C120 40 360 40 560 104S900 160 1010 104C1110 62 1290 62 1400 100S1760 168 1960 112S2330 44 2540 92";
export function LandingRibbon({ words }) {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, "");
  const tp = useRef(null);
  const txt = useRef(null);
  const wrap = useRef(null);
  useEffect(() => {
    if (reduced() || !tp.current || !txt.current) return;
    let raf = 0, last = 0, off = 0, on = true, hold = false, period = 0;
    try {
      period = txt.current.getComputedTextLength() / 2;
    } catch {}
    if (!period || !isFinite(period)) return;
    const speed = 38; // бірлік/сек — баяу, оқуға болады
    const step = (ts) => {
      if (last && !hold) off = (off + ((ts - last) / 1000) * speed) % period;
      last = ts;
      tp.current.setAttribute("startOffset", String(-off.toFixed(1)));
      raf = on ? requestAnimationFrame(step) : 0;
    };
    const start = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(step);
      }
    };
    const io = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(([e]) => {
          on = e.isIntersecting;
          if (on) start();
        })
      : null;
    if (io) io.observe(wrap.current);
    else start();
    const el = wrap.current;
    const h1 = () => (hold = true), h0 = () => (hold = false);
    el.addEventListener("pointerenter", h1);
    el.addEventListener("pointerleave", h0);
    return () => {
      on = false;
      cancelAnimationFrame(raf);
      if (io) io.disconnect();
      el.removeEventListener("pointerenter", h1);
      el.removeEventListener("pointerleave", h0);
    };
  }, [words]);
  const set = (k) =>
    words.map((w, i) => (
      <tspan key={k + i}>
        <tspan className="ld-rib-kk">{w.kk}</tspan>
        <tspan className="ld-rib-tr" dx="10">{w.tr}</tspan>
        <tspan className="ld-rib-dot" dx="16">◆</tspan>
        <tspan dx="16"> </tspan>
      </tspan>
    ));
  return (
    <div className="ld-rib" ref={wrap} aria-hidden="true">
      <svg viewBox="0 0 2400 180" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <path id={`${raw}p`} d={RIB} />
        </defs>
        <use href={`#${raw}p`} className="ld-rib-shade" transform="translate(0 7)" />
        <use href={`#${raw}p`} className="ld-rib-band" />
        <use href={`#${raw}p`} className="ld-rib-stitch" transform="translate(0 -22)" />
        <use href={`#${raw}p`} className="ld-rib-stitch" transform="translate(0 22)" />
        <text ref={txt} className="ld-rib-txt" dy="8">
          <textPath ref={tp} href={`#${raw}p`} startOffset="0">
            {set("a")}
            {set("b")}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

/* ── Логотиптегі тіл пішіні: тақырып астындағы сызба ── */
export function LandingSwoosh({ className = "" }) {
  return (
    <svg className={`ld-swoosh ${className}`} viewBox="0 0 400 34" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M6 22C90 8 230 4 330 14C356 17 380 22 394 30" fill="none" stroke={R} strokeWidth="9" strokeLinecap="round" pathLength="1" />
      <path d="M330 14C356 17 380 22 394 30C378 33 352 28 336 20Z" fill={R} />
    </svg>
  );
}

/* ── Чат суреті: киіз фондағы сөйлесу бұлттары ── */
export function LandingChatArt() {
  return (
    <svg className="ld-art-svg" viewBox="0 0 360 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="360" height="200" fill="#DCE9EE" />
      <path d="M0 168C80 156 260 156 360 170V200H0Z" fill="#B9D3DC" />
      <g className="ld-chat-b1">
        <rect x="150" y="26" width="178" height="52" rx="22" fill={C} />
        <path d="M300 74l22 16-4-22Z" fill={C} />
        <rect x="170" y="44" width="96" height="9" rx="4.5" fill={K} opacity=".75" />
        <rect x="170" y="58" width="132" height="7" rx="3.5" fill={I} opacity=".18" />
      </g>
      <g className="ld-chat-b2">
        <rect x="150" y="100" width="150" height="48" rx="22" fill={R} />
        <path d="M156 140l-14 18 24-10Z" fill={R} />
        <rect x="168" y="116" width="72" height="8" rx="4" fill={PG} />
        <rect x="168" y="129" width="108" height="7" rx="3.5" fill={C} opacity=".55" />
      </g>
      <rect x="6" y="6" width="348" height="188" rx="14" fill="none" stroke={K} strokeOpacity=".4" strokeWidth="1.6" strokeDasharray="5 4" />
    </svg>
  );
}

/* ── Vision суреті: камера жақтауындағы зат + оның қазақша атауы (деректен) ── */
export function LandingVisionArt({ word }) {
  return (
    <div className="ld-vision">
      <svg className="ld-art-svg" viewBox="0 0 360 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <rect width="360" height="200" fill="#F3E6CF" />
        <path d="M0 150C90 140 270 140 360 152V200H0Z" fill="#E6CFA6" />
        <rect x="6" y="6" width="348" height="188" rx="14" fill="none" stroke={RD} strokeOpacity=".35" strokeWidth="1.6" strokeDasharray="5 4" />
      </svg>
      <span className="ld-vision-obj">
        <TopicArt topic="animals" size={120} />
      </span>
      <svg className="ld-vision-frame" viewBox="0 0 160 160" aria-hidden="true" focusable="false">
        <g fill="none" stroke={C} strokeWidth="7" strokeLinecap="round">
          <path d="M6 40V12a6 6 0 0 1 6-6h28M120 6h28a6 6 0 0 1 6 6v28M154 120v28a6 6 0 0 1-6 6h-28M40 154H12a6 6 0 0 1-6-6v-28" />
        </g>
        <g fill="none" stroke={R} strokeWidth="3.4" strokeLinecap="round">
          <path d="M6 40V12a6 6 0 0 1 6-6h28M120 6h28a6 6 0 0 1 6 6v28M154 120v28a6 6 0 0 1-6 6h-28M40 154H12a6 6 0 0 1-6-6v-28" />
        </g>
        <line className="ld-vision-scan" x1="18" x2="142" y1="80" y2="80" stroke={G} strokeWidth="3" strokeLinecap="round" />
      </svg>
      {word && (
        <span className="ld-vision-tag" aria-hidden="true">
          <b lang="kk">{word.kk}</b>
          <span>{word.tr}</span>
        </span>
      )}
    </div>
  );
}
