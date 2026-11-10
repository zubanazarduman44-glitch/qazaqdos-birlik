"use client";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "../../components/Store";
import Icon from "../../components/Icon";
import { NatEmpty } from "../../components/NatArt";
import LangPicker from "../../components/LangPicker";
import { WORDS, WTR, setWordTr, tr } from "../../../lib/words";
import { tx } from "../../../lib/tx";
import { sayKk } from "../../../lib/speak";

const OFF = 5 * 3600_000;
const dayKey = () => new Date(Date.now() + OFF).toISOString().slice(0, 10);
function seeded(seed) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)), ((h >>> 0) % 100000) / 100000);
}
const uniq = WORDS.filter((w, i, a) => a.findIndex((z) => z.kk === w.kk) === i);

// Қалам мен қағаз анимациясы
function PenPaper() {
  return (
    <svg className="penpaper" viewBox="0 0 220 260" aria-hidden="true">
      <defs>
        <linearGradient id="ppg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fffdf5" /><stop offset="1" stopColor="#f4e8c8" /></linearGradient>
      </defs>
      <g transform="rotate(-4 110 130)">
        <rect x="26" y="20" width="168" height="220" rx="8" fill="#d8bd86" transform="translate(5 6)" opacity=".5" />
        <rect x="26" y="20" width="168" height="220" rx="8" fill="url(#ppg)" stroke="#b8822a" strokeWidth="2" />
        <path d="M44 20 v220" stroke="#e0574a" strokeWidth="1.4" opacity=".55" />
        <g stroke="#9db8c8" strokeWidth="1.2" opacity=".7">{[56, 80, 104, 128, 152, 176, 200].map((y) => <path key={y} d={`M32 ${y} H188`} />)}</g>
        <g fill="none" stroke="#1d2f6e" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path className="pp-w w1" d="M54 52 c6 -10 10 -10 10 0 s6 10 12 -2 s8 8 14 0 s8 -6 12 2 s8 6 14 -4 s8 8 14 0 s8 -4 10 0" />
          <path className="pp-w w2" d="M54 76 c6 -9 10 -9 10 0 s6 9 12 -2 s10 8 16 -2 s10 4 14 -2 s8 8 14 0 s8 -4 14 0" />
          <path className="pp-w w3" d="M54 100 c6 -10 10 -10 10 0 s6 10 12 -2 s8 8 14 0 s8 -6 12 2 s8 4 16 -2" />
          <path className="pp-w w4" d="M54 124 c5 -9 9 -9 9 0 s6 9 12 -1 s10 7 14 -2 s10 4 14 0 s8 6 16 -2 s8 4 12 0" />
        </g>
      </g>
      <g className="pp-pen">
        <path d="M0 0 L9 -6 L120 -92 L132 -80 L18 7Z" fill="#b8322a" stroke="#4a1210" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M10 -2 L120 -88" stroke="#ffd35a" strokeWidth="2.4" />
        <path d="M0 0 L9 -6 L18 7Z" fill="#f2d9a0" stroke="#4a1210" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M0 0 L4 -3 L6 3Z" fill="#1d2f6e" />
        <path d="M120 -92 L132 -80 L150 -104 C146 -112 138 -110 130 -102Z" fill="#fff" stroke="#9a9a9a" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

function DayCard({ w, lang, explain, flipped, known, onFlip, onKnow }) {
  return (
    <div className={`sz-card ${flipped ? "flip" : ""} ${known ? "known" : ""}`}>
      <button className="sz-face sz-front" onClick={onFlip} aria-label={w.kk}>
        <span className="sz-e">{w.e}</span>
        <b>{w.kk}</b>
        {known && <i className="sz-ok"><Icon name="check" size={14} /></i>}
      </button>
      <div className="sz-face sz-back">
        <span className="sz-e">{w.e}</span>
        <b>{tr(w, explain)}</b>
        <small>{w.kk}</small>
        <div className="sz-acts">
          <button className="icon-btn" onClick={() => sayKk(w.kk)} aria-label="listen"><Icon name="volume" size={16} /></button>
          <button className={`btn small ${known ? "ghost" : "gold"}`} onClick={onKnow}>{known ? "✓" : tx(lang).szKnow}</button>
          <button className="icon-btn" onClick={onFlip} aria-label="back"><Icon name="refresh" size={16} /></button>
        </div>
      </div>
    </div>
  );
}

export default function Sozdik() {
  const { lang, explain, state, update, award, saveWord } = useApp();
  const x = tx(lang);
  const [tab, setTab] = useState("day");
  const [flip, setFlip] = useState({});
  const [q, setQ] = useState("");
  const [, bump] = useState(0);
  const today = dayKey();
  const sz = state.sozdik || { days: {}, learned: {}, done: {} };

  // Бүгінгі 10 сөзді бір рет таңдап сақтаймыз (үйренген сөздер қайталанбайды)
  useEffect(() => {
    if (sz.days?.[today]) return;
    update((s) => {
      const cur = s.sozdik || { days: {}, learned: {}, done: {} };
      if (cur.days?.[today]) return s;
      const rnd = seeded(today);
      const fresh = uniq.filter((w) => !cur.learned?.[w.kk]);
      const pool = (fresh.length >= 10 ? fresh : uniq).map((w) => [rnd(), w]).sort((a, b) => a[0] - b[0]).map((p) => p[1].kk);
      return { ...s, sozdik: { ...cur, days: { ...cur.days, [today]: pool.slice(0, 10) } } };
    });
  }, [today, sz.days, update]);

  const words = useMemo(() => (sz.days?.[today] || []).map((k) => uniq.find((w) => w.kk === k)).filter(Boolean), [sz.days, today]);
  const known = words.filter((w) => sz.learned?.[w.kk]).length;

  // Таңдалған тілде аудармасы жоқ сөздерді (сақталған сөздер де) ЖИ арқылы аударамыз
  useEffect(() => {
    if (["ru", "en", "kk"].includes(explain)) return;
    const key = `qd_wtr_${explain}`;
    const need = [...new Set([...(state.vocab || []).map((v) => v.kk), ...words.map((w) => w.kk)])].filter((k) => !WTR[explain]?.[k]);
    if (!need.length) return;
    let dead = false;
    (async () => {
      for (let i = 0; i < need.length && !dead; i += 60) {
        try {
          const r = await fetch("/api/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ words: need.slice(i, i + 60), to: explain }) });
          const d = await r.json();
          if (!r.ok || !d.map) break;
          setWordTr(explain, d.map);
          try { localStorage.setItem(key, JSON.stringify({ ...JSON.parse(localStorage.getItem(key) || "{}"), ...d.map })); } catch {}
          if (!dead) bump((v) => v + 1);
        } catch { break; }
      }
    })();
    return () => { dead = true; };
  }, [explain, state.vocab?.length, words.length]); // eslint-disable-line react-hooks/exhaustive-deps

  function mark(w) {
    update((s) => {
      const cur = s.sozdik || { days: {}, learned: {}, done: {} };
      const learned = { ...cur.learned };
      if (learned[w.kk]) delete learned[w.kk];
      else learned[w.kk] = Date.now();
      return { ...s, sozdik: { ...cur, learned } };
    });
    saveWord({ kk: w.kk, ru: w.ru, en: w.en, e: w.e });
  }
  useEffect(() => {
    if (words.length === 10 && known === 10 && !sz.done?.[today]) {
      update((s) => ({ ...s, sozdik: { ...(s.sozdik || {}), done: { ...(s.sozdik?.done || {}), [today]: true } } }));
      award(40, 20, x.szDone);
    }
  }, [known, words.length, today]); // eslint-disable-line react-hooks/exhaustive-deps

  const mine = (state.vocab || []).filter((v) => !q.trim() || [v.kk, v.ru, v.en].some((t) => (t || "").toLowerCase().includes(q.trim().toLowerCase())));

  return (
    <div className="sozdik">
      <header className="page-head">
        <div>
          <span className="kicker">{x.szKicker}</span>
          <h1>{x.szTitle}</h1>
          <p>{x.szSub}</p>
        </div>
        <div className="head-tools"><LangPicker /><span className="chip gold">📚 {state.vocab?.length || 0}</span></div>
      </header>

      <div className="sz-grid">
        <div className="sz-main">
          <div className="shop-tabs">
            <button className={`chip tab ${tab === "day" ? "on" : ""}`} onClick={() => setTab("day")}>🌅 {x.szDay}</button>
            <button className={`chip tab ${tab === "mine" ? "on" : ""}`} onClick={() => setTab("mine")}>📖 {x.szMine}</button>
          </div>

          {tab === "day" && (
            <section className="card">
              <div className="sz-bar">
                <b>{x.szLearnedN(known)}</b>
                <span className="sz-prog"><i style={{ width: `${known * 10}%` }} /></span>
              </div>
              <p className="muted small">{x.szTap}</p>
              <div className="sz-cards">
                {words.map((w) => (
                  <DayCard key={w.kk} w={w} lang={lang} explain={explain} flipped={!!flip[w.kk]} known={!!sz.learned?.[w.kk]}
                    onFlip={() => { setFlip((f) => ({ ...f, [w.kk]: !f[w.kk] })); }} onKnow={() => mark(w)} />
                ))}
              </div>
              {known === 10 && words.length === 10 && <p className="alert ok">🎉 {x.szDone}</p>}
            </section>
          )}

          {tab === "mine" && (
            <section className="card">
              <div className="search sz-search">
                <Icon name="search" size={18} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={x.szSearch} aria-label={x.szSearch} />
              </div>
              <p className="muted small">{x.szTotal(state.vocab?.length || 0)}</p>
              {mine.length === 0 ? (
                <NatEmpty art="kobyz" size={120} text={x.szEmpty} lang={lang} />
              ) : (
                <ul className="sz-list">
                  {mine.map((v) => (
                    <li key={v.kk}>
                      <span className="sz-e">{v.e || "📝"}</span>
                      <span className="sz-w"><b>{v.kk}</b><small>{tr(v, explain)}</small></span>
                      <button className="icon-btn" onClick={() => sayKk(v.kk)} aria-label="listen"><Icon name="volume" size={16} /></button>
                      <button className="icon-btn" title={x.szDel} aria-label={x.szDel} onClick={() => update((s) => ({ ...s, vocab: s.vocab.filter((z) => z.kk !== v.kk) }))}><Icon name="x" size={16} /></button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
        <aside className="sz-side"><PenPaper /><p className="muted small">{x.szNew}</p></aside>
      </div>
    </div>
  );
}
