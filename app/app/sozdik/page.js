"use client";
import "../../sozdik.css";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "../../components/Store";
import Icon from "../../components/Icon";
import { NatEmpty } from "../../components/NatArt";
import LangPicker from "../../components/LangPicker";
import TopicArt, { TOPIC_TINT } from "../../components/TopicArt";
import Qyran from "../../components/Qyran";
import { WORDS, WTR, TOPICS, setWordTr, tr } from "../../../lib/words";
import { tx } from "../../../lib/tx";
import { sayKk } from "../../../lib/speak";
import Quiz from "../../components/Quiz";
import { shuffle } from "../../../lib/words";

// Әр рет басқаша сұрақтар: түрі де, нұсқалары да кездейсоқ
function mkTest(words, explain) {
  const kinds = shuffle(["kk2tr", "tr2kk"]);
  return shuffle(words).map((w, i) => {
    const kind = kinds[i % kinds.length];
    const others = shuffle(uniq.filter((z) => z.kk !== w.kk && tr(z, explain) !== tr(w, explain))).slice(0, 3);
    const opts = shuffle([w, ...others]);
    if (kind === "kk2tr") return { prompt: `${w.kk} → ?`, options: opts.map((o) => ({ key: o.kk, label: tr(o, explain) })), answer: w.kk };
    return { prompt: `${tr(w, explain)} → ?`, options: opts.map((o) => ({ key: o.kk, label: o.kk })), answer: w.kk };
  });
}

const OFF = 5 * 3600_000;
const dayKey = () => new Date(Date.now() + OFF).toISOString().slice(0, 10);
function seeded(seed) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)), ((h >>> 0) % 100000) / 100000);
}
const uniq = WORDS.filter((w, i, a) => a.findIndex((z) => z.kk === w.kk) === i);
const topicOf = (kk) => uniq.find((w) => w.kk === kk)?.t || "other";

const TOPIC_NAME = (t, lang) => TOPICS[t]?.[lang === "kk" ? "kk" : lang === "ru" ? "ru" : "en"] || "";
const HINT = { kk: "Аудармасы", ru: "Перевод", en: "Translation" };
const BACK = { kk: "Сөзге оралу", ru: "Назад к слову", en: "Back to word" };
const ALL = { kk: "Барлығы", ru: "Все", en: "All" };
const OTHER = { kk: "Басқа", ru: "Другое", en: "Other" };
const pick = (m, lang) => m[lang] || m.en;
// Карточканың жоғарғы жиегі тақырып түсімен (ақ киіз түсі көрінбейді — сұр киіз)
const tintOf = (t) => {
  const bg = TOPIC_TINT[t]?.bg || "#D9D2C2";
  return bg.toUpperCase() === "#FAF6EE" ? "#D9D2C2" : bg;
};

// Екі жақты карта: шын 3D аудару, бүкіл карта басылады, көрінбейтін жағы фокус алмайды
function DayCard({ w, i, lang, explain, flipped, back, known, knownLabel, onFlip, onKnow }) {
  const stop = (fn) => (e) => { e.stopPropagation(); fn(); };
  function key(e) { if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onFlip(); } }
  const topic = TOPIC_NAME(w.t, lang);
  return (
    <li className="szk-slot" style={{ "--i": i, "--tint": tintOf(w.t) }}>
      <div className={`szk-card ${flipped ? "flip" : ""} ${back ? "unflip" : ""} ${known ? "known" : ""}`} onClick={onFlip} onKeyDown={key}
        role="button" tabIndex={0} aria-pressed={flipped} aria-label={flipped ? `${w.kk} — ${tr(w, explain)}` : w.kk}>
        <span className="szk-shadow" aria-hidden="true" />
        <div className="szk-inner">
          <div className="szk-face szk-front" inert={flipped ? true : undefined} aria-hidden={flipped}>
            <span className="szk-topic">{topic}</span>
            <span className="szk-art"><TopicArt topic={w.t} size={64} /></span>
            <b lang="kk">{w.kk}</b>
            {known && <span className="szk-seal" aria-hidden="true"><Icon name="check" size={18} stroke={3} /></span>}
            <span className="szk-foot">
              <button type="button" className="szk-say" onClick={stop(() => sayKk(w.kk))} aria-label="listen"><Icon name="volume" size={17} /></button>
              {known
                ? <span className="szk-hint ok"><Icon name="check" size={13} stroke={3} /> {knownLabel}</span>
                : <span className="szk-hint"><Icon name="refresh" size={13} /> {HINT[lang] || HINT.en}</span>}
            </span>
          </div>
          <div className="szk-face szk-back" inert={flipped ? undefined : true} aria-hidden={!flipped}>
            <span className="szk-backtop" lang="kk">{w.kk}</span>
            <b>{tr(w, explain)}</b>
            <span className="szk-acts">
              <button type="button" className="szk-say" onClick={stop(() => sayKk(w.kk))} aria-label="listen"><Icon name="volume" size={17} /></button>
              <button type="button" className={`szk-know ${known ? "on" : ""}`} onClick={stop(onKnow)} aria-pressed={known}>
                <Icon name="check" size={15} stroke={2.6} /> {tx(lang).szKnow}
              </button>
            </span>
            <span className="sr-only">{BACK[lang] || BACK.en}</span>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function Sozdik() {
  const { lang, explain, state, update, award, saveWord } = useApp();
  const x = tx(lang);
  const [tab, setTab] = useState("day");
  const [flip, setFlip] = useState({});
  const [q, setQ] = useState("");
  const [ft, setFt] = useState("all");
  const [, bump] = useState(0);
  const [test, setTest] = useState(null);
  const [tres, setTres] = useState(null);
  const [round, setRound] = useState(0);
  const li = lang === "kk" ? 0 : lang === "ru" ? 1 : 2;
  const T = { test: ["Тест", "Тест", "Quiz"][li], newSet: ["Жаңа 10 сөз", "Новые 10 слов", "New 10 words"][li], again: ["Қайта тапсыру (жаңа сұрақтар)", "Пройти заново (новые вопросы)", "Retake (new questions)"][li], start: ["Тестті бастау", "Начать тест", "Start the quiz"][li] };
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
  const allDone = known === 10 && words.length === 10;

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

  function newSet() {
    update((s) => {
      const cur = s.sozdik || { days: {}, learned: {}, done: {} };
      const old = new Set(cur.days?.[today] || []);
      const fresh = uniq.filter((w) => !cur.learned?.[w.kk] && !old.has(w.kk));
      const base = fresh.length >= 10 ? fresh : uniq.filter((w) => !old.has(w.kk));
      return { ...s, sozdik: { ...cur, days: { ...cur.days, [today]: shuffle(base).slice(0, 10).map((w) => w.kk) } } };
    });
    setFlip({}); setTest(null); setTres(null);
  }
  function startTest() { setRound((n) => n + 1); setTres(null); setTest(mkTest(words, explain)); }
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

  // Менің сөздерім: іздеу + тақырып сүзгісі + тақырып бойынша топтар
  const vocab = state.vocab || [];
  const found = vocab.filter((v) => !q.trim() || [v.kk, v.ru, v.en].some((t) => (t || "").toLowerCase().includes(q.trim().toLowerCase())));
  const counts = useMemo(() => {
    const m = new Map();
    for (const v of vocab) { const t = topicOf(v.kk); m.set(t, (m.get(t) || 0) + 1); }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [vocab]);
  const groups = useMemo(() => {
    const m = new Map();
    for (const v of found) {
      const t = topicOf(v.kk);
      if (ft !== "all" && t !== ft) continue;
      if (!m.has(t)) m.set(t, []);
      m.get(t).push(v);
    }
    return [...m.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [found, ft]);
  const shown = groups.reduce((n, g) => n + g[1].length, 0);
  const tname = (t) => (t === "other" ? pick(OTHER, lang) : TOPIC_NAME(t, lang) || pick(OTHER, lang));

  const mood = allDone ? "cheer" : known >= 5 ? "happy" : known > 0 ? "support" : "idle";
  const TABS = [["day", "sun", x.szDay], ["test", "target", T.test], ["mine", "book", x.szMine]];

  return (
    <div className="sozdik szk" data-notap>
      <header className="page-head">
        <div>
          <span className="kicker">{x.szKicker}</span>
          <h1>{x.szTitle}</h1>
          <p>{x.szSub}</p>
        </div>
        <div className="head-tools"><LangPicker /><span className="chip gold"><Icon name="book" size={15} /> {vocab.length}</span></div>
      </header>

      <div className="szk-tabs">
        {TABS.map(([id, ic, label]) => (
          <button key={id} type="button" className={tab === id ? "on" : ""} aria-pressed={tab === id} onClick={() => setTab(id)}>
            <Icon name={ic} size={17} /> <span>{label}</span>
            {id === "day" && words.length > 0 && <em>{known}/10</em>}
            {id === "mine" && <em>{vocab.length}</em>}
          </button>
        ))}
      </div>

      {tab === "day" && (
        <section className={`szk-table ${allDone ? "done" : ""}`}>
          <div className="szk-hero">
            <div className="szk-hero-txt">
              <span className="szk-eyebrow">{x.szNew}</span>
              <b className="szk-count">{x.szLearnedN(known)}</b>
              <ol className="szk-beads" aria-hidden="true">
                {(words.length ? words : Array.from({ length: 10 }, () => null)).map((w, i) => {
                  const on = w && sz.learned?.[w.kk];
                  return <li key={i} className={on ? "on" : ""} style={{ "--i": i }}>{on ? <Icon name="check" size={12} stroke={3} /> : null}</li>;
                })}
              </ol>
            </div>
            <div className="szk-aqyl"><Qyran mood={mood} size={92} /></div>
          </div>

          {allDone && <p className="szk-done" role="status"><Icon name="sparkle" size={18} /> {x.szDone}</p>}

          <p className="szk-tap"><Icon name="refresh" size={14} /> {x.szTap}</p>
          <ul className="szk-deck">
            {words.map((w, i) => (
              <DayCard key={w.kk} i={i} w={w} lang={lang} explain={explain} knownLabel={x.szKnown}
                flipped={!!flip[w.kk]} back={flip[w.kk] === false} known={!!sz.learned?.[w.kk]}
                onFlip={() => { setFlip((f) => ({ ...f, [w.kk]: !f[w.kk] })); }} onKnow={() => mark(w)} />
            ))}
          </ul>
          <div className="szk-foot-row">
            <button type="button" className="btn ghost small" onClick={newSet}><Icon name="refresh" size={15} /> {T.newSet}</button>
          </div>
        </section>
      )}

      {tab === "test" && (
        <section className="szk-game">
          <div className="szk-game-in">
            {test ? (
              <>
                <Quiz key={round} questions={test} onDone={(r, t2) => { setTres({ r, t2 }); award(r >= t2 - 1 ? 15 : 5, r >= t2 - 1 ? 8 : 1); }} />
                {tres && <div className="szk-again"><button type="button" className="btn gold" onClick={startTest}><Icon name="refresh" size={15} /> {T.again}</button></div>}
              </>
            ) : (
              <div className="szk-start">
                <h2 className="szk-start-h">{x.szDay}</h2>
                <div className="szk-fan" aria-hidden="true">
                  {words.slice(0, 5).map((w, i) => (
                    <span key={w.kk} style={{ "--k": i - 2, "--tint": tintOf(w.t) }}><TopicArt topic={w.t} size={64} /><i /><i /></span>
                  ))}
                </div>
                <div className="szk-start-row">
                  <span className="szk-chip"><Icon name="target" size={15} /> {words.length}</span>
                  <button type="button" className="btn gold big" onClick={startTest} disabled={!words.length}>{T.start}</button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {tab === "mine" && (
        <section className="szk-chest">
          <div className="szk-chest-top">
            <div className="search szk-search">
              <Icon name="search" size={18} />
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={x.szSearch} aria-label={x.szSearch} />
            </div>
            <p className="szk-total">{x.szTotal(vocab.length)}</p>
          </div>
          {counts.length > 1 && (
            <div className="szk-filters">
              <button type="button" className={ft === "all" ? "on" : ""} aria-pressed={ft === "all"} onClick={() => setFt("all")}>
                {pick(ALL, lang)} <em>{vocab.length}</em>
              </button>
              {counts.map(([t, n]) => (
                <button key={t} type="button" className={ft === t ? "on" : ""} aria-pressed={ft === t} onClick={() => setFt(ft === t ? "all" : t)}>
                  <TopicArt topic={t} size={22} /> {tname(t)} <em>{n}</em>
                </button>
              ))}
            </div>
          )}
          {shown === 0 ? (
            <NatEmpty art="kobyz" size={120} text={x.szEmpty} lang={lang} />
          ) : (
            <div className="szk-groups">{groups.map(([t, list]) => (
              <section key={t} className="szk-group" style={{ "--tint": tintOf(t) }}>
                <h2><TopicArt topic={t} size={40} /> <span>{tname(t)}</span> <em>{list.length}</em></h2>
                <ul className="szk-words">
                  {list.map((v) => (
                    <li key={v.kk}>
                      <span className="szk-w"><b lang="kk">{v.kk}</b><small>{tr(v, explain)}</small></span>
                      <button type="button" className="szk-say" onClick={() => sayKk(v.kk)} aria-label="listen"><Icon name="volume" size={17} /></button>
                      <button type="button" className="szk-del" title={x.szDel} aria-label={x.szDel} onClick={() => update((s) => ({ ...s, vocab: s.vocab.filter((z) => z.kk !== v.kk) }))}><Icon name="x" size={15} /></button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}</div>
          )}
        </section>
      )}
    </div>
  );
}
