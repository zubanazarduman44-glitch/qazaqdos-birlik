"use client";
// «VR Әлем» сахнасы: бірінші жақтан көрінетін орын, кейіпкердің сөзі (дыбыспен), жауап таңдау немесе дауыспен айту,
// мақсат картасы, негізгі сөздер және соңындағы нәтиже (жұлдыз, XP).
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "./Store";
import Icon from "./Icon";
import ShellGlyph from "./ShellGlyph";
import { VrScene, npcSide } from "./VrArt";
import VrLife from "./VrLife";
import { hasLife, lifeSide, loadLife } from "./vr-places";
import { vrL, vf } from "./VrL10n";
import { useAnimGate } from "./AnimGate";
import { L } from "../../lib/i18n";
import { sayKk, stopKk, prefetchKk } from "../../lib/speak";
import { toWav } from "../../lib/audio";

// Түсіндірме: орысша түсіндірме — ru, қалғаны — en (сахна деректері kk/ru/en ғана)
export const trLang = (explain) => (explain === "ru" ? "ru" : "en");
export const wordTr = (w, explain) => (explain === "ru" ? w[1] : w[2]) || w[2] || w[1] || "";

// Қазақ әріптерін қалыпқа келтіру (дауыспен жауапты салыстыру үшін)
const FOLD = { ә: "а", ғ: "г", қ: "к", ң: "н", ө: "о", ұ: "у", ү: "у", һ: "х", і: "и", ё: "е", й: "и", ъ: "", ь: "" };
export function normKk(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[әғқңөұүһіёйъь]/g, (c) => FOLD[c])
    .replace(/[^a-zа-я0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
export function ratio(a, b) {
  if (!a && !b) return 1;
  const m = a.length, n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return 1 - prev[n] / Math.max(m, n, 1);
}
export function bestMatch(heard, replies) {
  const h = normKk(heard);
  let best = -1, score = 0;
  replies.forEach((r, i) => {
    const x = ratio(h, normKk(r.kk));
    if (x > score) { score = x; best = i; }
  });
  return score >= 0.6 ? best : -1;
}

// Жауаптар ретін араластырамыз (дұрысы әрдайым бірінші болмасын); бір түйінде тұрақты
function order(n, seed) {
  const idx = Array.from({ length: n }, (_, i) => i);
  let s = 0;
  for (const ch of seed) s = (s * 33 + ch.charCodeAt(0)) >>> 0;
  for (let i = n - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) >>> 0;
    const j = s % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}
// Аяққа дейінгі ең қысқа жол (қадам санағышы үшін)
function stepsLeft(nodes, from) {
  const seen = new Set([from]);
  let q = [[from, 0]];
  while (q.length) {
    const nq = [];
    for (const [id, d] of q) {
      const n = nodes[id];
      if (!n || n.end || !n.replies?.length) return d;
      for (const r of n.replies) if (r.ok && !seen.has(r.next)) { seen.add(r.next); nq.push([r.next, d + 1]); }
    }
    q = nq;
  }
  return 0;
}
const reducedMotion = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const INTRO_MS = 1000; // есік ашылуы (reduced-motion: 380 мс ақырын сөну)
// «Өмір» кіріспесі көрілген жағдаяттар (келесі жолы бірден үстелден басталады)
const SEEN = "qd_vr_intro_v1";
const seenIntro = (id) => { try { return JSON.parse(localStorage.getItem(SEEN) || "[]").includes(id); } catch { return false; } };
const markIntro = (id) => { try { const a = JSON.parse(localStorage.getItem(SEEN) || "[]"); if (!a.includes(id)) localStorage.setItem(SEEN, JSON.stringify([...a, id].slice(-60))); } catch {} };

// Сөз көпіршігі: сөздер дыбыспен қатар бірте-бірте шығады (мәтін DOM-да әрдайым толық)
function Typed({ text, lead = 0 }) {
  let at = 0;
  return String(text)
    .split(/(\s+)/)
    .map((w, i) => {
      if (!w.trim()) return w;
      const t = lead + Math.min(at, 40) * 52;
      at += w.length + 1;
      return <span key={i} className="vr-w" style={{ "--t": `${t}ms` }}>{w}</span>;
    });
}

// Сан біртіндеп өседі (reduced-motion — бірден соңғы мән)
function useCount(to, ms = 900, delay = 0) {
  const [v, setV] = useState(() => (reducedMotion() ? to : 0));
  useEffect(() => {
    if (reducedMotion()) { setV(to); return; }
    let raf = 0, t0 = 0;
    const tick = (now) => {
      if (!t0) t0 = now;
      const k = Math.min(1, Math.max(0, (now - t0 - delay) / ms));
      setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, ms, delay]);
  return v;
}
function Reward({ xp, coins, t }) {
  const a = useCount(xp, 900, 500), b = useCount(coins, 900, 650);
  return (
    <span className="vr-chip gold vr-reward">
      <ShellGlyph name="coin" size={16} /> <span aria-hidden="true">{t.reward(a, b)}</span>
      <span className="sr-only">{t.reward(xp, coins)}</span>
    </span>
  );
}

const starsFor = (m) => (m === 0 ? 3 : m <= 2 ? 2 : 1);
const canRecord = () => typeof window !== "undefined" && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== "undefined" && !!(window.AudioContext || window.webkitAudioContext);

function Stars({ n, size = 18, label }) {
  return (
    <span className="vr-stars" role="img" aria-label={label}>
      {[1, 2, 3].map((i) => (
        <svg key={i} className={i <= n ? "on" : ""} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
          <path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17.1 6.4 20l1.1-6.2L2.9 9.4l6.3-.9Z" />
        </svg>
      ))}
    </span>
  );
}
export { Stars };

// Киіз үйдің есігі (сықырлауық): қызыл киіз, алтын қошқар мүйіз, үзік тігіс
function DoorArt({ flip }) {
  return (
    <svg viewBox="0 0 200 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <rect width="200" height="450" fill="#8a2018" />
      <rect x="0" y="0" width="200" height="450" fill="#b8322a" />
      <rect x="10" y="10" width="180" height="430" rx="6" fill="none" stroke="rgba(255,253,247,.55)" strokeWidth="2" strokeDasharray="6 6" />
      <rect x="0" y="0" width="200" height="22" fill="#e0a526" />
      <rect x="0" y="428" width="200" height="22" fill="#e0a526" />
      <rect x="182" y="0" width="18" height="450" fill="#86532b" />
      <path d="M182 0v450" stroke="#5a3418" strokeWidth="2" />
      <path d="M100 150l52 75-52 75-52-75Z" fill="#8a2018" stroke="#e0a526" strokeWidth="3" />
      <path d="M100 172l36 53-36 53-36-53Z" fill="none" stroke="rgba(255,253,247,.5)" strokeWidth="1.6" strokeDasharray="4 4" />
      <path transform="translate(100 226) scale(1.5) translate(-20 -15)" d="M20 23V13C20 7.5 15 4.5 11 6.2C7.6 7.7 8.2 12.4 11.6 12.4C13.6 12.4 14.2 10 12.6 9.3M20 13C20 7.5 25 4.5 29 6.2C32.4 7.7 31.8 12.4 28.4 12.4C26.4 12.4 25.8 10 27.4 9.3M15 23H25" fill="none" stroke="#e0a526" strokeWidth="1.8" strokeLinecap="round" />
      {[70, 380].map((y) => (
        <path key={y} transform={`translate(100 ${y}) scale(1.1) translate(-20 -15)`} d="M20 23V13C20 7.5 15 4.5 11 6.2C7.6 7.7 8.2 12.4 11.6 12.4C13.6 12.4 14.2 10 12.6 9.3M20 13C20 7.5 25 4.5 29 6.2C32.4 7.7 31.8 12.4 28.4 12.4C26.4 12.4 25.8 10 27.4 9.3M15 23H25" fill="none" stroke="#f2c14e" strokeWidth="2" strokeLinecap="round" />
      ))}
      <circle cx="168" cy="226" r="7" fill="#e0a526" />
    </svg>
  );
}

export default function VrPlay({ scene, place, onBack, onNext, hasNext, onTalk }) {
  const { lang, explain, state, update, award, saveWord, t } = useApp();
  const T = vrL(lang);
  const tl = trLang(explain);
  const [node, setNode] = useState(scene.start);
  const [run, setRun] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [picked, setPicked] = useState(null); // { i, ok }
  const [tried, setTried] = useState([]); // осы түйінде қате таңдалғандар
  const [showTr, setShowTr] = useState(false);
  const [log, setLog] = useState([]);
  const [talk, setTalk] = useState(false);
  const [audioErr, setAudioErr] = useState(false);
  const [result, setResult] = useState(null);
  const [rec, setRec] = useState(null); // null | "rec" | "busy"
  const [heard, setHeard] = useState(null); // { text, miss }
  const [micOk, setMicOk] = useState(false);
  const [goodK, setGoodK] = useState(0);
  const stageRef = useRef(null);
  const gate = useAnimGate(stageRef);
  const [intro, setIntro] = useState(true);
  const lead = useRef(null); // бірінші сөз есік ашылған соң
  if (lead.current === null) lead.current = reducedMotion() ? 400 : INTRO_MS - 80;
  const drawerRef = useRef(null);
  const recRef = useRef(null);
  const tok = useRef(0);
  const advTimer = useRef(null);
  const awarded = useRef(false);
  const mounted = useRef(true);

  // «Өмір» қабаты: орынның жеке файлы болса — кинематографиялық сахна (жүктелмесе — бұрынғы сурет)
  const art = place?.art || scene.place;
  const [lifeMod, setLifeMod] = useState(null); // null — жүктелуде, false — жоқ/қате
  const lifeOn = hasLife(art) && lifeMod !== false;
  const lifeOnRef = useRef(lifeOn);
  lifeOnRef.current = lifeOn;
  const [busy, setBusy] = useState(lifeOn); // кейіпкердің әрекеті жүріп жатыр — жауаптар күтеді
  const [introOn, setIntroOn] = useState(() => !seenIntro(scene.id));
  const lifeCtl = useRef(null);
  useEffect(() => {
    if (!hasLife(art)) return;
    let live = true;
    loadLife(art).then((m) => live && setLifeMod(m), () => live && setLifeMod(false));
    return () => { live = false; };
  }, [art]);

  const n = scene.nodes[node] || {};
  const isEnd = !!n.end || !n.replies?.length;
  const ord = useMemo(() => order(n.replies?.length || 0, `${scene.id}:${node}:${run}`), [scene.id, node, run, n.replies?.length]);
  const replies = ord.map((i) => n.replies[i]);
  const total = useMemo(() => log.filter((x) => x.me).length + stepsLeft(scene.nodes, node), [scene.nodes, node, log]);
  const step = log.filter((x) => x.me).length + (isEnd ? 0 : 1);
  const side = lifeOn ? lifeSide(art) : npcSide(art);

  useEffect(() => {
    const id = setTimeout(() => setIntro(false), reducedMotion() ? 400 : INTRO_MS + 120);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    mounted.current = true;
    setMicOk(canRecord());
    return () => {
      mounted.current = false;
      clearTimeout(advTimer.current);
      try { recRef.current?.state === "recording" && recRef.current.stop(); } catch {}
      stopKk();
    };
  }, []);

  // Дыбыс: әр сөйлеуге жаңа белгі (ескі қоңыраулар елеусіз қалады)
  const speak = useCallback((text, { slow = false, npc = true, done } = {}) => {
    const my = ++tok.current;
    let fin = false;
    const end = () => { if (fin) return; fin = true; done && done(); };
    sayKk(text, {
      slow,
      onState: (s) => {
        if (!mounted.current || my !== tok.current) return end();
        if (s === "playing") { setAudioErr(false); npc && setTalk(true); }
        if (s === "idle" || s === "error") { setTalk(false); if (s === "error") setAudioErr(true); end(); }
      },
    }).catch(() => { if (my === tok.current) { setTalk(false); setAudioErr(true); } end(); });
    return end;
  }, []);

  // Кейіпкердің жаңа сөзі: тізімге қосып, дауыстап айтамыз
  useEffect(() => {
    const line = scene.nodes[node]?.npc;
    if (!line) return;
    setLog((l) => [...l, { me: false, kk: line.kk, tr: L(line, tl) }]);
    // «Өмір» сахнасында сөз әрекеттің тиісті сәтінде айтылады (onSay)
    const id = lifeOnRef.current ? 0 : setTimeout(() => speak(line.kk), lead.current);
    lead.current = 350;
    // Дұрыс жауаптардың және келесі кейіпкер сөздерінің дыбысын алдын ала жүктейміз — басқанда бірден айтылсын
    const n = scene.nodes[node];
    const ahead = [];
    for (const r of n?.replies || []) {
      if (r.ok && r.kk) ahead.push(r.kk);
      const nx = scene.nodes[r.next]?.npc?.kk;
      if (r.ok && nx) ahead.push(nx);
    }
    if (ahead.length) prefetchKk([...new Set(ahead)]);
    return () => clearTimeout(id);
  }, [node, run]); // eslint-disable-line react-hooks/exhaustive-deps

  // Соңғы түйін: нәтиже және марапат (бір рет)
  useEffect(() => {
    if (!isEnd || result) return;
    const stars = starsFor(mistakes);
    const prev = state.vr?.done?.[scene.id];
    const first = !prev;
    const xp = first ? 12 : 3, coins = first ? 6 : 1;
    setResult({ stars, first, xp, coins });
    if (awarded.current) return;
    awarded.current = true;
    update((s) => {
      const vr = s.vr && typeof s.vr === "object" ? s.vr : {};
      const done = vr.done && typeof vr.done === "object" ? vr.done : {};
      const best = Math.max(stars, done[scene.id]?.stars || 0);
      return { ...s, vr: { ...vr, done: { ...done, [scene.id]: { stars: best, at: Date.now() } } } };
    });
    award(xp, coins);
  }, [isEnd]); // eslint-disable-line react-hooks/exhaustive-deps

  // Орын файлы жүктелмей қалса — бұрынғы суретпен жалғастырамыз: күтіп тұрған сөзді айтып, жауаптарды ашамыз
  useEffect(() => {
    if (lifeMod !== false || !busy) return;
    setBusy(false);
    const ln = scene.nodes[node]?.npc;
    if (ln) speak(ln.kk);
  }, [lifeMod]); // eslint-disable-line react-hooks/exhaustive-deps

  const onLifeSay = useCallback((nid) => {
    if (!mounted.current) return;
    const ln = scene.nodes[nid]?.npc;
    if (ln) speak(ln.kk);
  }, [scene.nodes, speak]);
  const onLifeFree = useCallback(() => { if (mounted.current) setBusy(false); }, []);
  const onIntroSeen = useCallback(() => { markIntro(scene.id); setIntroOn(false); }, [scene.id]);
  const skipLife = useCallback(() => lifeCtl.current?.skip?.(), []);

  const goNext = useCallback((r) => {
    clearTimeout(advTimer.current);
    if (lifeOnRef.current) setBusy(true);
    setPicked(null);
    setTried([]);
    setHeard(null);
    setShowTr(false);
    setNode(scene.nodes[r.next] ? r.next : "__end");
  }, [scene.nodes]);

  function choose(k) {
    if (isEnd || (picked && picked.ok) || busy) return;
    const r = replies[k];
    if (!r || tried.includes(k)) return;
    setHeard(null);
    if (r.ok) {
      setPicked({ i: k, ok: true });
      setGoodK((g) => g + 1);
      setLog((l) => [...l, { me: true, kk: r.kk, tr: L(r, tl) }]);
      // Жауап айтылып біткен соң келесі қадамға өтеміз (ең көбі 6 с)
      // Өз сөзің осы бетте бірден айтылады; ол біткенше келесі бетке өтпейміз (дыбыс жүктелмесе — ең көбі 9 с)
      let gone = false;
      const go = () => { if (gone || !mounted.current) return; gone = true; goNext(r); };
      speak(r.kk, { npc: false, done: () => { clearTimeout(advTimer.current); advTimer.current = setTimeout(go, 450); } });
      advTimer.current = setTimeout(go, 9000);
    } else {
      setPicked({ i: k, ok: false });
      setTried((x) => [...x, k]);
      setMistakes((m) => m + 1);
    }
  }
  const pickedRef = useRef(null);
  pickedRef.current = { picked, replies, choose, goNext, isEnd, busy, skipLife };

  // Пернетақта: 1–3 — жауап, Enter — жалғастыру
  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const tag = (e.target?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || drawerRef.current?.open) return;
      const { picked: p, replies: rs, choose: ch, goNext: gn, isEnd: end, busy: wait, skipLife: sk } = pickedRef.current;
      if (wait) {
        // Кейіпкердің әрекеті жүріп жатыр: Enter — өткізу, сандар — елеусіз
        if (e.key === "Enter" && tag !== "button") { e.preventDefault(); sk(); }
        return;
      }
      if (/^[1-9]$/.test(e.key)) {
        const k = Number(e.key) - 1;
        if (k < rs.length) { e.preventDefault(); ch(k); }
      } else if (e.key === "Enter" && p?.ok && !end && tag !== "button") {
        e.preventDefault();
        gn(rs[p.i]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Параллакс: тінтуір/саусақ және құрылғы еңісі (тек transform; reduced-motion кезінде өшеді)
  useEffect(() => {
    const el = stageRef.current;
    if (!el || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const set = (x, y) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--px", x.toFixed(3));
        el.style.setProperty("--py", y.toFixed(3));
      });
    };
    const onMove = (e) => {
      const b = el.getBoundingClientRect();
      set(Math.max(-1, Math.min(1, ((e.clientX - b.left) / b.width) * 2 - 1)), Math.max(-1, Math.min(1, ((e.clientY - b.top) / b.height) * 2 - 1)));
    };
    const onLeave = () => set(0, 0);
    const onTilt = (e) => {
      if (e.gamma == null) return;
      set(Math.max(-1, Math.min(1, e.gamma / 25)), Math.max(-1, Math.min(1, ((e.beta || 45) - 45) / 25)));
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    window.addEventListener("deviceorientation", onTilt);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, []);

  async function mic() {
    if (rec === "rec") return recRef.current?.stop();
    if (rec || isEnd || picked?.ok) return;
    setHeard(null);
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setMicOk(false);
      setHeard({ text: "", miss: true, err: T.micErr });
      return;
    }
    stopKk();
    const chunks = [];
    const r = new MediaRecorder(stream);
    recRef.current = r;
    r.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    r.onstop = async () => {
      stream.getTracks().forEach((x) => x.stop());
      if (!mounted.current) return;
      setRec("busy");
      try {
        const audio = await toWav(new Blob(chunks, { type: r.mimeType || "audio/webm" }));
        const res = await fetch("/api/transcribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ audio }) });
        const d = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(d.error || `HTTP ${res.status}`);
        if (!mounted.current) return;
        const text = String(d.text || "").trim();
        const k = text ? bestMatch(text, pickedRef.current.replies) : -1;
        if (k >= 0) { setHeard({ text, miss: false }); pickedRef.current.choose(k); }
        else setHeard({ text, miss: true });
      } catch (e) {
        if (mounted.current) setHeard({ text: "", miss: true, err: e.message || T.micErr });
      } finally {
        if (mounted.current) setRec(null);
      }
    };
    r.start();
    setRec("rec");
    setTimeout(() => r.state === "recording" && r.stop(), 10000);
  }

  function replay(withIntro = false) {
    clearTimeout(advTimer.current);
    if (withIntro) setIntroOn(true);
    if (lifeOnRef.current) setBusy(true);
    stopKk();
    tok.current++;
    awarded.current = false;
    setResult(null);
    setMistakes(0);
    setPicked(null);
    setTried([]);
    setHeard(null);
    setLog([]);
    setShowTr(false);
    setNode(scene.start);
    setRun((x) => x + 1);
  }

  const vocab = state.vocab || [];
  const line = n.npc || { kk: "" };
  const good = T.good[goodK % T.good.length];
  const fb = picked && (picked.ok ? { ok: true } : { ok: false, note: L(replies[picked.i]?.note, tl) || T.defaultNote });
  const mood = result ? "ok" : picked ? (picked.ok ? "ok" : "bad") : null;
  const said = log.filter((x) => x.me);
  const doneSteps = result ? total : said.length;
  const bubbleLead = lifeOn ? 120 : intro ? INTRO_MS - 60 : 300;
  const lifeLabel = `${L(place?.name, "kk")} — ${scene.npc.name}`;

  return (
    <div className="vr-play">
      <header className="vr-bar">
        <button type="button" className="btn ghost small vr-back" onClick={onBack}>
          <Icon name="left" size={18} className="vr-flip" /> <span>{T.back}</span>
        </button>
        <div className="vr-bar-t">
          <small><span lang="kk">{L(place?.name, "kk")}</span> · <span className={`vr-lv lv-${scene.level}`}>{scene.level}</span></small>
          <b lang="kk">{L(scene.title, "kk")}</b>
        </div>
        <div className="vr-bar-r">
          {!result && <span className="vr-step" aria-live="polite">{vf(T.step, Math.max(1, step), `${total}`)}</span>}
          <button type="button" className="btn ghost small" onClick={() => drawerRef.current?.showModal?.()} aria-haspopup="dialog">
            <ShellGlyph name="chest" size={18} /> <span className="vr-hide-s">{T.words}</span>
          </button>
        </div>
      </header>
      <ol className="vr-path" aria-hidden="true">
        {Array.from({ length: Math.max(1, total) }, (_, i) => (
          <li key={i} className={i < doneSteps ? "done" : i === doneSteps ? "now" : ""} style={{ "--i": i }}>
            {i < doneSteps ? (
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17.1 6.4 20l1.1-6.2L2.9 9.4l6.3-.9Z" /></svg>
            ) : i === doneSteps ? (
              <svg viewBox="0 0 24 24" width="20" height="20"><path d="M7.5 3c2 0 3 2.4 2.6 5.2-.3 2-1 3.3-2.6 3.3S5 10.2 4.9 8.2C4.7 5.4 5.5 3 7.5 3ZM5.6 13.6h4.2l-.4 2.6c-.3 1.6-3.2 1.6-3.5 0ZM16.5 7c2 0 2.8 2.4 2.6 5.2-.1 2-1 3.3-2.6 3.3s-2.3-1.3-2.6-3.3C13.5 9.4 14.5 7 16.5 7ZM14.2 17.6h4.2l-.4 2.6c-.3 1.6-3.2 1.6-3.5 0Z" /></svg>
            ) : (
              <i />
            )}
          </li>
        ))}
      </ol>

      <div className={`vr-scene side-${side}${intro && !lifeOn ? " is-intro" : ""}${lifeOn ? " is-life" : ""}`}>
      <div className={`vr-stage${lifeOn ? " is-life" : ""}`} ref={gate}>
        {lifeOn ? (
          lifeMod && (
            <VrLife mod={lifeMod} scene={scene} node={node} run={run} intro={introOn} talk={talk} mood={mood} label={lifeLabel}
              ctl={lifeCtl} onSay={onLifeSay} onFree={onLifeFree} onIntroSeen={onIntroSeen} />
          )
        ) : (
          <>
            <VrScene art={art} npc={scene.npc} talk={talk} mood={mood} label={lifeLabel} />
            <span className="vr-light" aria-hidden="true" />
            <span className="vr-motes" aria-hidden="true"><i /><i /><i /><i /><i /><i /></span>
          </>
        )}
        <span className="vr-vignette" aria-hidden="true" />
        {lifeOn && !result && (busy || (node === scene.start && !picked)) && (
          <div className="vr-life-ctl">
            {busy ? (
              <button type="button" className="vr-life-btn" onClick={skipLife}>
                {T.skip} <Icon name="right" size={16} className="vr-flip" />
              </button>
            ) : (
              <button type="button" className="vr-life-btn" onClick={() => replay(true)}>
                <Icon name="refresh" size={16} /> {T.rewatch}
              </button>
            )}
          </div>
        )}
        {picked?.ok && replies[picked.i] && (
          <div className="vr-me" aria-hidden="true" key={`me-${node}-${run}`}>
            <small>{T.you}</small>
            <span lang="kk">{replies[picked.i].kk}</span>
          </div>
        )}
        {intro && !lifeOn && (
          <div className="vr-doors" aria-hidden="true" onClick={() => setIntro(false)}>
            <i className="vr-door l"><DoorArt /></i>
            <i className="vr-door r"><DoorArt flip /></i>
            <span className="vr-doors-plaque">
              <small>{T.entering}</small>
              <b lang="kk">{L(place?.name, "kk")}</b>
            </span>
          </div>
        )}
      </div>
        <div className={`vr-bubble ${talk ? "is-talk" : ""} ${picked?.ok || result ? "is-done" : ""}${busy && !result ? " is-wait" : ""}`} key={`${node}-${run}-${busy ? 0 : 1}`} aria-hidden={busy && !result ? "true" : undefined} aria-live="polite" style={{ "--lead": `${bubbleLead}ms` }}>
          <span className="vr-bubble-who">
            <b>{scene.npc.name}</b> · {L(scene.npc.role, tl)}
          </span>
          <p className="vr-bubble-kk" lang="kk"><Typed text={line.kk} lead={bubbleLead + 120} /></p>
          {showTr && <p className="vr-bubble-tr">{L(line, tl)}</p>}
          <div className="vr-bubble-tools">
            <button type="button" className="vr-tool" onClick={() => speak(line.kk)} aria-label={T.replay} title={T.replay}>
              <Icon name="volume" size={18} /><span>{T.replay}</span>
            </button>
            <button type="button" className="vr-tool" onClick={() => speak(line.kk, { slow: true })} aria-label={T.slow} title={T.slow}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M3 15c0-4 4-7 8-7s7 2 8 5c1 0 2 1 2 2h-3c-1 2-4 3-7 3s-6-1-8-3Z M7 18l-1 2M15 18l1 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span>{T.slow}</span>
            </button>
            <button type="button" className={`vr-tool ${showTr ? "on" : ""}`} onClick={() => setShowTr((x) => !x)} aria-pressed={showTr}>
              <Icon name="globe" size={18} /><span>{showTr ? T.hideTr : T.showTr}</span>
            </button>
          </div>
          {audioErr && <small className="vr-audio-err">{T.audioFail}</small>}
        </div>
      </div>

      <div className="vr-body">
        <section className="vr-main" aria-label={T.yourReply}>
          {result ? (
            <div className={`vr-result card s-${result.stars}`} role="status">
              {result.stars >= 2 && (
                <span className="vr-confetti" aria-hidden="true">
                  {Array.from({ length: 14 }, (_, i) => <i key={i} style={{ "--i": i }} />)}
                </span>
              )}
              <div className="vr-res-top">
                <span className="vr-res-medal">
                  <Stars n={result.stars} size={34} label={vf(T.stars, result.stars)} />
                </span>
                <div>
                  <h2>{T.result}</h2>
                  <p>{result.stars === 3 ? T.s3 : result.stars === 2 ? T.s2 : T.s1}</p>
                </div>
              </div>
              <div className="vr-res-meta">
                <span className="vr-chip">{vf(T.mistakes, mistakes)}</span>
                <Reward xp={result.xp} coins={result.coins} t={t} />
                <small>{result.first ? T.firstReward : T.repeatReward}</small>
              </div>
              <div className="vr-res-btns">
                {hasNext && <button type="button" className="btn primary" onClick={onNext}>{T.next} <Icon name="right" size={18} className="vr-flip" /></button>}
                <button type="button" className="btn ghost" onClick={() => replay()}><Icon name="refresh" size={18} /> {T.replayScene}</button>
                <button type="button" className="btn ghost" onClick={onBack}>{T.toMap}</button>
              </div>
              {said.length > 0 && (
                <div className="vr-said">
                  <h3>{T.phrases}</h3>
                  <ol>
                    {said.map((x, i) => (
                      <li key={i} style={{ "--i": i }}>
                        <button type="button" className="vr-w-say" onClick={() => speak(x.kk, { npc: false })} aria-label={`${T.listen}: ${x.kk}`}><Icon name="volume" size={18} /></button>
                        <span><b lang="kk">{x.kk}</b><small>{x.tr}</small></span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              <button type="button" className="vr-talk-cta" onClick={onTalk}>
                <span className="vr-talk-ic"><ShellGlyph name="feather" size={22} /></span>
                <span><b lang="kk">{T.free}</b><small>{T.freeSub}</small></span>
                <Icon name="right" size={18} className="vr-flip" />
              </button>
            </div>
          ) : (
            <>
              <div className="vr-replies-h">
                <h2>{T.yourReply}</h2>
                {busy ? <span className="vr-wait-dots" aria-hidden="true"><i /><i /><i /></span> : <small className="vr-hint">{T.pickHint}</small>}
              </div>
              <ol className={`vr-replies${busy ? " is-wait" : ""}`} aria-hidden={busy ? "true" : undefined}>
                {replies.map((r, k) => {
                  const st = picked?.i === k ? (picked.ok ? "ok" : "bad") : tried.includes(k) ? "bad" : "";
                  const reveal = showTr || !!picked || tried.includes(k);
                  return (
                    <li key={`${node}-${k}`}>
                      <button type="button" className={`vr-reply ${st}`} onClick={() => choose(k)} disabled={busy || (picked?.ok && picked.i !== k) || tried.includes(k)} aria-keyshortcuts={String(k + 1)} style={{ "--d": `${k * 60}ms` }}>
                        <span className="vr-key" aria-hidden="true">{k + 1}</span>
                        <span className="vr-reply-t">
                          <b lang="kk">{r.kk}</b>
                          {reveal && <small>{L(r, tl)}</small>}
                        </span>
                        {st === "ok" && <Icon name="check" size={20} />}
                        {st === "bad" && <Icon name="x" size={20} />}
                      </button>
                    </li>
                  );
                })}
              </ol>
              {fb && (
                <div className={`vr-fb ${fb.ok ? "ok" : "bad"}`} role="status" key={`${picked.i}-${picked.ok}`}>
                  {fb.ok ? (
                    <>
                      <b>{good}</b>
                      <button type="button" className="btn primary small" onClick={() => goNext(replies[picked.i])}>{T.cont} <Icon name="right" size={16} className="vr-flip" /></button>
                    </>
                  ) : (
                    <>
                      <div><b>{T.wrong}</b><p>{fb.note}</p></div>
                      <small>{T.retry}</small>
                    </>
                  )}
                </div>
              )}
              {micOk && (
                <div className="vr-voice">
                  <button type="button" className={`vr-mic ${rec === "rec" ? "on" : ""}`} onClick={mic} disabled={busy || rec === "busy" || !!picked?.ok} aria-pressed={rec === "rec"}>
                    <Icon name={rec === "rec" ? "stop" : "mic"} size={20} />
                    <span>{rec === "rec" ? T.listening : rec === "busy" ? T.recog : T.voice}</span>
                  </button>
                  {heard && (heard.text || heard.err) && (
                    <p className={`vr-heard ${heard.miss ? "miss" : ""}`} role="status">
                      {heard.text && <><small>{T.heard}:</small> <b lang="kk">«{heard.text}»</b> </>}
                      {heard.miss && <span>{heard.err && !heard.text ? heard.err : T.noMatch}</span>}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </section>

        <aside className="vr-side">
          <div className="vr-goal">
            <span className="vr-goal-ic" aria-hidden="true"><ShellGlyph name="pennant" size={22} /></span>
            <div>
              <small>{T.goal}</small>
              <p>{L(scene.goal, tl)}</p>
              <p className="vr-goal-kk" lang="kk">{L(scene.goal, "kk")}</p>
            </div>
          </div>
          {log.length > 1 && (
            <details className="vr-log">
              <summary>{T.dialog}</summary>
              <ol>
                {log.slice(0, -1).map((x, i) => (
                  <li key={i} className={x.me ? "me" : ""}>
                    <small>{x.me ? T.you : scene.npc.name}</small>
                    <span lang="kk">{x.kk}</span>
                  </li>
                ))}
              </ol>
            </details>
          )}
        </aside>
      </div>

      <dialog className="vr-drawer" ref={drawerRef} aria-label={T.words} onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}>
        <div className="vr-drawer-in">
          <header>
            <h2>{T.words}</h2>
            <button type="button" className="icon-btn" onClick={() => drawerRef.current?.close()} aria-label={T.close}><Icon name="x" size={20} /></button>
          </header>
          <ul>
            {(scene.words || []).map((w) => {
              const saved = vocab.some((v) => v.kk === w[0]);
              return (
                <li key={w[0]}>
                  <button type="button" className="vr-w-say" onClick={() => speak(w[0], { npc: false })} aria-label={`${T.listen}: ${w[0]}`}><Icon name="volume" size={18} /></button>
                  <span className="vr-w-t"><b lang="kk">{w[0]}</b><small>{wordTr(w, explain)}</small></span>
                  <button type="button" className={`btn small ${saved ? "ghost" : "gold"}`} disabled={saved} onClick={() => saveWord({ kk: w[0], ru: w[1], en: w[2], tr: wordTr(w, explain), src: "vr" })}>
                    <Icon name={saved ? "check" : "plus"} size={16} /> <span className="vr-hide-s">{saved ? T.saved : T.save}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </dialog>
    </div>
  );
}
