"use client";
import "../../literature.css";
import { NatEmpty } from "../../components/NatArt";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAnimGate } from "../../components/AnimGate";
import { useApp } from "../../components/Store";
import Qyran from "../../components/Qyran";
import Icon from "../../components/Icon";
import Quiz from "../../components/Quiz";
import { LitEmblem, LitCorner, LitHeroArt, LIT_COVER } from "../../components/LitArt";
import { getKkVoice, fetchTtsUrl } from "../../../lib/speak";
import { shuffle } from "../../../lib/wordTools";
import { whenIdle } from "../../../lib/idle";
import { WORKS, LEVELS, loadEpisodes, splitSent } from "../../../lib/literature";
import { LT } from "./litL10n";
import { tx } from "../../../lib/tx";
import { L } from "../../../lib/i18n";

// Дайын орысша/ағылшынша аудармалар (lib/litTr.js) бетпен бірге емес, керек кезде жүктеледі
let LIT_TR = null;
let LIT_EPT = null;
let litTrP = null;
const loadLitTr = (to) => (to === "ru" || to === "en" ? (litTrP ||= import("../../../lib/litTr").then((m) => { LIT_EPT = m.LIT_EP_TR; return (LIT_TR = m.LIT_TR); }).catch(() => (litTrP = null))) : Promise.resolve());
// ep=true: эпизод мәтіні (тек негізгі деңгейде дайын аударма бар); lead=true: эпизодқа кіріспе сөйлем
const staticTr = (w, to, ep, lvl, lead) => {
  if (to !== "ru" && to !== "en") return null;
  if (ep) return lvl === w.lvl ? LIT_EPT?.[w.id]?.[to]?.[lead ? 0 : 1] || null : null;
  return !LIT_TR ? null : LIT_TR[w.id]?.[to === "ru" ? 0 : 1];
};

// «т.» — автордың туған жылы (шығарма жылы емес)
const BORN = { kk: "т.", ru: "р.", en: "b." };
const SPEEDS = [0.75, 1, 1.25];
const LS_LVL = "qd_lit_lvl"; // {шығарма id: деңгей}
const LS_SPEED = "qd_lit_speed";
const lsGet = (k, d) => {
  try {
    const v = localStorage.getItem(k);
    return v == null ? d : JSON.parse(v);
  } catch {
    return d;
  }
};
const lsSet = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};
// Бастапқы деңгей: бұрын таңдалғаны → оқушының деңгейі (шығарманың деңгейлеріне сыйса) → шығарманың өз деңгейі
const pickLevel = (w, cefr) => {
  const saved = lsGet(LS_LVL, {})?.[w.id];
  if (w.levels.includes(saved)) return saved;
  const ci = LEVELS.indexOf(cefr);
  if (ci >= 0 && ci <= LEVELS.indexOf(w.levels[0])) return w.levels[0];
  if (w.levels.includes(cefr)) return cefr;
  return w.lvl;
};
// Aqyl чаты мен тестке: қысқа мәлімет + таңдалған деңгейдегі эпизод
const fullText = (w, ep) => (ep ? `${w.text}\n\n${ep.title.kk}. ${ep.lead} ${ep.paras.join(" ")}` : w.text);
const coverStyle = (w) => {
  const [c, d] = LIT_COVER[w.art] || ["#8A2018", "#5E140F"];
  return { "--lc": c, "--ld": d };
};

export default function Literature() {
  const { lang, explain, state, update, award } = useApp();
  const x = tx(lang);
  const lt = LT(lang);
  const [id, setId] = useState(null);
  const [stage, setStage] = useState("info"); // "info" — қысқа мәлімет | "read" — эпизод
  const [lvl, setLvl] = useState("A1");
  const [eps, setEps] = useState(null); // барлық эпизод (жүктелген соң)
  const [epErr, setEpErr] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [cur, setCur] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [noVoice, setNoVoice] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [quiz, setQuiz] = useState(null); // null | "loading" | {qs} | "error"
  const [qres, setQres] = useState(null);
  const [loadingTts, setLoadingTts] = useState(false);
  const [trans, setTrans] = useState(null); // null | "loading" | text
  const [chatOn, setChatOn] = useState(false);
  const [pick, setPick] = useState(null); // оқу басталатын таңдалған сөйлем
  const audioRef = useRef(null);
  const speedRef = useRef(1);
  const run = useRef(0);
  const timer = useRef(null);
  const listRef = useRef(null);
  // Экраннан тыс суреттердің анимациясы кідіреді (AnimGate)
  const gHero = useAnimGate();
  const work = WORKS.find((w) => w.id === id);
  const lit = state.lit || {};
  const epAll = work && eps ? eps[work.id] : null;
  const ep = epAll?.v[lvl] ? { title: epAll.title, ...epAll.v[lvl] } : null;
  const inRead = stage === "read";
  const reading = inRead && !!ep;

  // Эпизод: абзацтар → сөйлемдер (дауыстап оқу мен аударма сөйлем бойынша жүреді)
  const { sentences, paraOf, paraSent } = useMemo(() => {
    if (!reading) {
      const s = work ? splitSent(work.text) : [];
      return { sentences: s, paraOf: s.map(() => 0), paraSent: [s] };
    }
    const ps = ep.paras.map(splitSent);
    return { sentences: ps.flat(), paraOf: ps.flatMap((p, k) => p.map(() => k)), paraSent: ps };
  }, [work?.id, reading, lvl, eps]);
  const srcText = work ? (reading ? ep.paras.join(" ") : work.text) : "";
  const trKey = work ? `qd_lt_${work.id}${reading ? `_ep_${lvl}` : ""}_${explain}` : "";

  useEffect(() => {
    const s = lsGet(LS_SPEED, 1);
    if (SPEEDS.includes(s)) {
      setSpeed(s);
      speedRef.current = s;
    }
    // Эпизодтар бөлек чанкта: бет ашылған соң бос уақытта алдын ала жүктейміз
    return whenIdle(() => loadEpisodes().then(setEps));
  }, []);

  const stop = () => {
    run.current++;
    clearTimeout(timer.current);
    try {
      window.speechSynthesis?.cancel();
    } catch {}
    audioRef.current?.pause();
    setPlaying(false);
    setLoadingTts(false);
  };
  useEffect(() => stop, []);
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs.length, busy]);

  function getEps() {
    setEpErr(false);
    loadEpisodes().then(setEps).catch(() => setEpErr(true));
  }

  function open(w) {
    stop();
    setId(w.id);
    setStage("info");
    setLvl(pickLevel(w, state.cefr));
    setCur(-1);
    setPick(null);
    setMsgs([]);
    setErr("");
    setNoVoice(false);
    setQuiz(null);
    setQres(null);
    setChatOn(false);
    setTrans(null);
    if (!eps) getEps();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseLvl(l) {
    if (l === lvl) return;
    stop();
    setLvl(l);
    setCur(-1);
    setPick(null);
    setTrans(null);
    lsSet(LS_LVL, { ...(lsGet(LS_LVL, {}) || {}), [work.id]: l });
  }

  // Дыбыс жылдамдығы: дауыс биіктігі өзгермейді (preservesPitch)
  const applyRate = (a) => {
    a.preservesPitch = true;
    a.mozPreservesPitch = true;
    a.webkitPreservesPitch = true;
    a.defaultPlaybackRate = speedRef.current;
    a.playbackRate = speedRef.current;
  };
  function chooseSpeed(s) {
    setSpeed(s);
    speedRef.current = s;
    lsSet(LS_SPEED, s);
    if (audioRef.current) audioRef.current.playbackRate = s;
  }

  // from — қай сөйлемнен бастау
  async function play(from) {
    if (playing) return stop();
    const my = ++run.current;
    const N = sentences.length;
    if (!N) return;
    const voice = await getKkVoice();
    if (run.current !== my) return;
    setNoVoice(false);
    setErr("");
    setPlaying(true);
    const i0 = from != null ? from : cur >= 0 && cur < N - 1 ? cur : 0;

    // Құрылғыда қазақша дауыс бар: сөйлем-сөйлеммен
    const speakFrom = (i, v) => {
      const s = window.speechSynthesis;
      const step = () => {
        if (run.current !== my) return;
        if (i >= N) return setPlaying(false);
        setCur(i);
        if (!v) {
          const ms = Math.max(1800, sentences[i].length * 70) / speedRef.current;
          i++;
          timer.current = setTimeout(step, ms);
          return;
        }
        const u = new SpeechSynthesisUtterance(sentences[i]);
        u.voice = v;
        u.lang = v.lang;
        u.rate = 0.85 * speedRef.current;
        const next = () => {
          i++;
          step();
        };
        u.onend = next;
        u.onerror = next;
        s.speak(u);
      };
      step();
    };
    if (voice) return speakFrom(i0, voice);

    // Қазақша дауыс жоқ: серверден абзац-абзацпен (Gemini TTS); келесі абзац алдын ала жүктеледі
    const paraEnd = (k) => {
      const p = paraOf[k];
      let e = k;
      while (e < N && paraOf[e] === p) e++;
      return e;
    };
    const segOf = (k) => sentences.slice(k, paraEnd(k)).join(" ");
    const fallback = (k, e) => {
      setLoadingTts(false);
      setNoVoice(true);
      setErr(String(e?.message || "").slice(0, 200));
      // орыс (немесе кез келген) дауысымен оқимыз — кирилл әріптері ұқсас оқылады
      const sy = window.speechSynthesis;
      const vs = sy?.getVoices() || [];
      const alt = vs.find((v) => /^ru/i.test(v.lang)) || vs.find((v) => /^(tr|uz|ky)/i.test(v.lang)) || vs[0];
      speakFrom(k, alt);
    };
    const playSeg = async (k) => {
      if (run.current !== my) return;
      if (k >= N) return setPlaying(false);
      try {
        setLoadingTts(true);
        const seg = sentences.slice(k, paraEnd(k));
        const url = await fetchTtsUrl(seg.join(" "));
        if (run.current !== my) return;
        setLoadingTts(false);
        const nx = paraEnd(k);
        if (nx < N) fetchTtsUrl(segOf(nx)).catch(() => {});
        const a = new Audio(url);
        audioRef.current = a;
        applyRate(a);
        const total = seg.join(" ").length || 1;
        const ends = [];
        let acc = 0;
        seg.forEach((sn) => {
          acc += sn.length + 1;
          ends.push(acc / total);
        });
        setCur(k);
        a.ontimeupdate = () => {
          if (run.current !== my) return;
          const q = a.currentTime / (a.duration || 1);
          setCur(k + Math.max(0, ends.findIndex((e) => q <= e)));
        };
        a.onended = () => playSeg(nx);
        a.onerror = () => run.current === my && fallback(k, new Error("audio"));
        await a.play();
      } catch (e) {
        if (run.current === my) fallback(k, e);
      }
    };
    playSeg(i0);
  }

  // Мәтінді ашқанда аударма фонда әзірленеді: батырманы басқанда лезде шығады
  const ready = useRef({});
  useEffect(() => {
    if (!work || explain === "kk" || (inRead && !ep)) return;
    let on = true;
    loadLitTr(explain).then(() => on && prep());
    return () => { on = false; };
    function prep() {
      if (staticTr(work, explain, reading, lvl)) return;
      const key = trKey;
      try {
        const hit = localStorage.getItem(key);
        if (hit) {
          ready.current[key] = hit;
          return;
        }
      } catch {}
      if (ready.current[key]) return;
      ready.current[key] = fetch("/api/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: srcText, to: explain }) })
        .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
        .then(({ ok, d }) => {
          if (!ok || !d.text) throw new Error("err");
          ready.current[key] = d.text;
          try {
            localStorage.setItem(key, d.text);
          } catch {}
          return d.text;
        })
        .catch(() => {
          delete ready.current[key];
          return null;
        });
    }
  }, [id, explain, reading, lvl, !!ep]);
  async function translate() {
    if (trans) return setTrans(null);
    await loadLitTr(explain);
    const st = staticTr(work, explain, reading, lvl);
    if (st) return setTrans(st);
    const key = trKey;
    let v = ready.current[key];
    if (typeof v === "string") return setTrans(v);
    setTrans("loading");
    v = await (v || fetch("/api/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: srcText, to: explain }) }).then((r) => r.json()).then((d) => d.text).catch(() => null));
    if (v) setTrans(v);
    else {
      setTrans(null);
      setErr("Translate error");
    }
  }

  function startReading() {
    stop();
    setStage("read");
    setCur(-1);
    setPick(null);
    setTrans(null);
    if (!eps) getEps();
    requestAnimationFrame(() => document.getElementById("lit-episode")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
  function backToInfo() {
    stop();
    setStage("info");
    setCur(-1);
    setPick(null);
    setTrans(null);
  }

  async function ask(t) {
    const q = (t ?? text).trim();
    if (!q || busy) return;
    setText("");
    setErr("");
    const next = [...msgs, { role: "user", text: q }];
    setMsgs(next);
    setBusy(true);
    try {
      const r = await fetch("/api/literature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, title: work.work, author: work.author, text: fullText(work, ep), explain, level: lvl, name: state.profile.name }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
      setMsgs([...next, { role: "assistant", text: d.text }]);
    } catch (e) {
      setErr(e.message || "Error");
    } finally {
      setBusy(false);
    }
  }
  async function finish() {
    stop();
    if (!lit[work.id]) {
      update((s) => ({ ...s, lit: { ...(s.lit || {}), [work.id]: Date.now() } }));
      award(20, 8);
    }
    setQuiz("loading");
    setQres(null);
    try {
      const r = await fetch("/api/literature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "quiz", title: work.work, author: work.author, text: fullText(work, ep), explain, level: lvl }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
      setQuiz({
        qs: d.questions.map((q) => ({
          prompt: q.q,
          options: shuffle(q.options.map((o, k) => ({ key: String(k), label: o }))),
          answer: String(q.answer),
        })),
      });
    } catch (e) {
      setErr(e.message || "Error");
      setQuiz("error");
    }
  }
  function quizDone(right, total) {
    setQres({ right, total });
    award(right * 4, right >= 4 ? 5 : 0, right >= 4 ? `🏆 ${right}/${total}` : undefined);
  }

  // Бұрын оқылған, бірақ қазір тізімде жоқ шығармалар (мысалы, алынып тасталған өлеңдер) санға кірмейді
  const readN = WORKS.filter((w) => lit[w.id]).length;
  const corners = (
    <span className="lit-corners" aria-hidden="true">
      <i><LitCorner /></i><i><LitCorner /></i><i><LitCorner /></i><i><LitCorner /></i>
    </span>
  );
  const book = (w, i) => (
    <li key={w.id} className="lit-slot" style={{ "--i": i }}>
      <button className={`lit-book ${lit[w.id] ? "is-read" : ""}`} onClick={() => open(w)} style={coverStyle(w)}>
        <span className="lit-cover">
          {corners}
          <span className="lit-cover-top">
            <span className="lit-lvl">{w.levels.join(" · ")}</span>
            {w.born && <span className="lit-year">{BORN[lang] || BORN.en} {w.born}</span>}
          </span>
          <span className="lit-art"><LitEmblem id={w.art} size={84} /></span>
          <span className="lit-cover-txt">
            <b lang="kk" dir="ltr">{w.work}</b>
            <small lang="kk" dir="ltr">{w.author}</small>
          </span>
        </span>
        <em className="lit-kind">{L(w.kind, lang)}</em>
        {lit[w.id] && (
          <span className="lit-ribbon" title={x.litDoneMark}>
            <Icon name="check" size={14} stroke={3} />
            <span className="sr-only">{x.litDoneMark}</span>
          </span>
        )}
      </button>
    </li>
  );

  if (!work) {
    let n = 0;
    return (
      <div className="literature lit-lib">
        <header ref={gHero} className="lit-hero">
          <div className="lit-hero-txt">
            <span className="kicker">{x.litKicker}</span>
            <h1>{x.litTitle}</h1>
            <p className="lit-epi" lang="kk" dir="ltr">«Өнер алды — қызыл тіл»</p>
            <p className="lit-sub">{lt.sub}</p>
            <div className="head-tools">
              <span className="chip gold lit-count"><Icon name="book" size={16} /> {readN}/{WORKS.length}</span>
            </div>
            <div className="lit-spines" aria-hidden="true">
              {WORKS.map((w) => <i key={w.id} className={lit[w.id] ? "on" : ""} style={coverStyle(w)} />)}
            </div>
          </div>
          <div className="lit-hero-art">
            <LitHeroArt />
            <span className="lit-hero-aqyl"><Qyran mood={readN ? "happy" : "idle"} size={92} /></span>
          </div>
        </header>

        {LEVELS.map((lv) => {
          const list = WORKS.filter((w) => w.lvl === lv);
          if (!list.length) return null;
          return (
            <section key={lv} className="lit-shelf" aria-labelledby={`lit-sh-${lv}`}>
              <h2 className="lit-shelf-h" id={`lit-sh-${lv}`}>
                <span className="lit-shelf-lv">{lv}</span>
                <span>{lt[`shelf${lv}`]}</span>
                <small>{list.length}</small>
              </h2>
              <ul className="lit-books">{list.map((w) => book(w, n++))}</ul>
            </section>
          );
        })}
      </div>
    );
  }

  const tr = typeof trans === "string" && trans !== "loading" ? splitSent(trans) : null;
  const parallel = !!tr && tr.length === sentences.length;
  const leadTr = reading && tr ? staticTr(work, explain, true, lvl, true) : null;
  const mood = loadingTts || busy || quiz === "loading" ? "think" : playing ? "happy" : qres ? (qres.right >= 4 ? "cheer" : "support") : "idle";
  const prog = reading && sentences.length ? Math.max(0, cur + 1) / sentences.length : 0;
  const curPara = cur >= 0 ? paraOf[cur] : -1;
  const epTitleTr = ep && (explain === "ru" || explain === "en") ? ep.title[explain] || null : null;
  const trBtn = explain !== "kk" && (
    <button className={`btn ghost lit-tbtn ${trans && trans !== "loading" ? "is-on" : ""}`} onClick={translate} aria-pressed={!!trans && trans !== "loading"}>
      <Icon name="globe" size={18} /> {trans && trans !== "loading" ? x.litTransHide : x.litTrans}
    </button>
  );
  const levelSwitch = (
    <div className="lit-seg lit-lvls" role="group" aria-label={lt.level}>
      {work.levels.map((l) => (
        <button key={l} type="button" className={l === lvl ? "is-on" : ""} aria-pressed={l === lvl} onClick={() => chooseLvl(l)}>
          {l}
        </button>
      ))}
    </div>
  );
  const transBox = trans && (
    <p className={`lit-trans ${trans === "loading" ? "is-loading" : ""}`} lang={trans === "loading" ? undefined : explain} dir="auto" data-notap="">
      {trans === "loading" ? x.tapLoading : trans}
    </p>
  );

  return (
    <div className="literature lit-read" style={coverStyle(work)}>
      <nav className="lit-top">
        <button className="btn ghost small" onClick={() => { stop(); setId(null); }}>
          <Icon name="left" size={16} /> {x.litBack}
        </button>
        <span className="lit-crumb">{x.litKicker}</span>
      </nav>

      {!inRead ? (
        <article className="lit-spread rise">
          <header className="lit-verso">
            <div className="lit-mini-cover">
              {corners}
              <LitEmblem id={work.art} size={104} />
            </div>
            <div className="lit-verso-txt">
              <span className="lit-badge">{L(work.kind, lang)} · {work.lvl}</span>
              <h2 lang="kk" dir="ltr">{work.work}</h2>
              <p className="lit-by" lang="kk" dir="ltr">
                {work.author}
                {work.born && <span className="lit-by-y"> · {BORN[lang] || BORN.en} {work.born}</span>}
              </p>
            </div>
            <div className="lit-gist">
              <Icon name="sparkle" size={18} />
              <p dir="ltr">{L(work.gist, explain === "ru" ? "ru" : "en")}</p>
            </div>
            <div className="lit-aqyl">
              <Qyran mood={mood} size={84} />
            </div>
          </header>

          <section className="lit-recto lit-info">
            <h3 className="lit-sec-h"><Icon name="book" size={16} /> {lt.about}</h3>
            <p className={`reader-text lit-text lit-intro ${/^[«"“(]/.test(sentences[0] || "") ? "no-cap" : ""}`} lang="kk" dir="ltr">
              {sentences.map((sn, i) => <span key={i} className="snt">{sn}{" "}</span>)}
            </p>
            {transBox}
            <div className="lit-start">
              <span className="lit-adapt"><Icon name="scroll" size={14} /> {lt.adapted}</span>
              {epAll && <p className="lit-start-t" lang="kk" dir="ltr">{epAll.title.kk}</p>}
              {epTitleTr && <p className="lit-start-tr" dir="auto">{epTitleTr}</p>}
              <div className="lit-start-lv">
                <span className="lit-start-lvt">{lt.level}</span>
                {levelSwitch}
              </div>
              <div className="lit-start-row">
                <button className="btn lit-go" onClick={startReading}>
                  <Icon name="book" size={20} /> {lt.start}
                </button>
                {trBtn}
              </div>
            </div>
          </section>
        </article>
      ) : (
        <article className="lit-card rise" id="lit-episode">
          <div className="lit-thread" aria-hidden="true"><i style={{ transform: `scaleX(${prog})` }} /></div>
          <div className="lit-card-bar">
            <button className="lit-ep-back" onClick={backToInfo}><Icon name="left" size={14} /> {lt.about}</button>
            {levelSwitch}
          </div>
          {!ep ? (
            epErr ? (
              <div className="lit-note lit-warn">
                <span>{lt.loadErr}</span>
                <button className="btn ghost small" onClick={getEps}><Icon name="refresh" size={15} /> {x.spTryAgain}</button>
              </div>
            ) : (
              <p className="lit-note lit-wait-t" role="status">{x.tapLoading}</p>
            )
          ) : (
            <>
              <header className="lit-card-head">
                <p className="lit-label">
                  <b>{lvl}</b> · {lt.adapted} · {L(work.kind, lang)}
                </p>
                <h2 lang="kk" dir="ltr">{ep.title.kk}</h2>
                {epTitleTr && <p className="lit-ep-ttr" dir="auto">{epTitleTr}</p>}
                <p className="lit-card-by" lang="kk" dir="ltr">«{work.work}» · {work.author}</p>
                <p className="lit-lead" lang="kk" dir="ltr">{ep.lead}</p>
                {leadTr && <p className="lit-tr lit-lead-tr" lang={explain} dir="auto" data-notap="">{leadTr}</p>}
              </header>
              {/* Абзацтар: сөйлемді басса — сол жерден оқиды; оқылып жатқан абзац ақырын белгіленеді */}
              <div className="lit-flow" lang="kk" dir="ltr">
                {paraSent.map((ps, g) => {
                  const base = paraOf.indexOf(g);
                  return (
                    <div key={g} className={`lit-para ${playing && g === curPara ? "is-now" : ""}`}>
                      <p className="reader-text lit-text">
                        {ps.map((sn, j) => {
                          const k = base + j;
                          return (
                            <span
                              key={k}
                              className={`snt ${k === cur ? "now" : ""}`}
                              onClick={() => { if (!playing) { setPick(k); setCur(k); } }}
                            >
                              {sn}{" "}
                            </span>
                          );
                        })}
                      </p>
                      {parallel && <p className="lit-tr lit-para-tr" lang={explain} dir="auto" data-notap="">{ps.map((_, j) => tr[base + j]).join(" ")}</p>}
                    </div>
                  );
                })}
              </div>
              {!parallel && transBox}
              <p className="lit-note"><Icon name="sparkle" size={15} /> {lt.levelHint}</p>
              <p className="lit-note"><Icon name="search" size={15} /> {lt.hint}</p>
              <p className="lit-note lit-adapt-note"><Icon name="scroll" size={15} /> {lt.adaptedNote}</p>
              {noVoice && <p className="lit-note lit-warn">{x.litNoVoice}{err ? ` (${err})` : ""}</p>}
            </>
          )}
        </article>
      )}

      {reading && (
        <div className="lit-dock">
          <span className={`lit-dock-aqyl ${playing ? "is-on" : ""}`} aria-hidden="true"><Qyran mood={mood} size={40} /></span>
          <button className={`btn lit-play ${playing ? "is-on" : ""}`} onClick={() => { const f = !playing ? pick : null; setPick(null); play(f != null ? f : undefined); }}>
            <Icon name={playing ? "stop" : "volume"} size={18} /> {loadingTts ? x.tapLoading : playing ? x.litPause : lt.readAll}
          </button>
          <div className="lit-seg lit-speed" role="group" aria-label={lt.speed} title={lt.speed}>
            <Icon name="slow" size={16} />
            {SPEEDS.map((s) => (
              <button key={s} type="button" className={s === speed ? "is-on" : ""} aria-pressed={s === speed} onClick={() => chooseSpeed(s)}>
                {s}×
              </button>
            ))}
          </div>
          {trBtn}
          <button className="btn gold lit-done" disabled={quiz === "loading"} onClick={finish}>
            <Icon name={lit[work.id] ? "star" : "check"} size={18} /> {lit[work.id] ? x.litDoneMark : x.litDone}
          </button>
          {cur >= 0 && <span className="lit-pos" aria-hidden="true">{cur + 1}/{sentences.length}</span>}
        </div>
      )}

      {quiz && (
        <section className="card lit-quiz rise">
          <h3 className="lit-h"><span className="lit-h-ic"><Icon name="trophy" size={18} /></span> {x.litTest}</h3>
          {quiz === "loading" && (
            <div className="lit-wait"><Qyran mood="think" size={56} /><p className="muted">{x.litTestLoading}</p></div>
          )}
          {quiz === "error" && (
            <>
              {err && <p className="alert">{err}</p>}
              <button className="btn gold" onClick={finish}><Icon name="refresh" size={16} /> {x.spTryAgain}</button>
            </>
          )}
          {quiz?.qs && <Quiz key={quiz.qs[0].prompt} questions={quiz.qs} onDone={quizDone} pass={4} />}
          {qres && (
            <div className="alert ok rise lit-score">
              <Icon name="trophy" size={18} /> <span>{x.litTestScore(qres.right, qres.total)}</span>
              <button className="btn ghost small" onClick={finish}><Icon name="refresh" size={15} /> {x.spTryAgain}</button>
            </div>
          )}
        </section>
      )}

      {!chatOn && (
        <button className="lit-ask" onClick={() => setChatOn(true)}>
          <span className="lit-ask-av"><Qyran mood="support" size={44} /></span>
          <span className="lit-ask-t">{x.litAskBtn}</span>
          <Icon name="chat" size={20} />
        </button>
      )}
      {chatOn && (
        <section className="card lit-chat rise">
          <h3 className="lit-h"><span className="lit-h-ic"><Icon name="chat" size={18} /></span> {x.litChatTitle}</h3>
          {msgs.length === 0 && <NatEmpty art="kamshy" size={90} text={x.litAsk} lang={lang} />}
          <div className="lit-list" ref={listRef}>
            {msgs.map((m, i) => (
              <div key={i} className={`msg ${m.role === "user" ? "me" : "bot"}`}>
                {m.role !== "user" && <span className="msg-av"><Qyran size={32} /></span>}
                <div className="msg-b">{m.text}</div>
              </div>
            ))}
            {busy && (
              <div className="msg bot">
                <span className="msg-av"><Qyran mood="think" size={32} /></span>
                <div className="msg-b typing"><i /><i /><i /></div>
              </div>
            )}
            {err && <p className="alert">{err}</p>}
          </div>
          <form className="composer" onSubmit={(e) => { e.preventDefault(); ask(); }}>
            <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder={x.litAsk} maxLength={600} />
            <button className="btn blue" disabled={busy || !text.trim()} aria-label="send"><Icon name="send" size={18} /></button>
          </form>
        </section>
      )}
    </div>
  );
}
