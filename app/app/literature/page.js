"use client";
import "../../literature.css";
import LangPicker from "../../components/LangPicker";
import { NatEmpty } from "../../components/NatArt";
import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../../components/Store";
import Qyran from "../../components/Qyran";
import Icon from "../../components/Icon";
import Quiz from "../../components/Quiz";
import { LitEmblem, LitCorner, LitHeroArt, LIT_COVER, LIT_YEAR } from "../../components/LitArt";
import { getKkVoice, fetchTtsUrl } from "../../../lib/speak";
import { shuffle } from "../../../lib/wordTools";
import { WORKS } from "../../../lib/literature";
import { LIT_TR } from "../../../lib/litTr";
const staticTr = (id, to) => (to === "ru" ? LIT_TR[id]?.[0] : to === "en" ? LIT_TR[id]?.[1] : null);
import { tx } from "../../../lib/tx";
import { L } from "../../../lib/i18n";

// Сөре: халық жырлары бөлек, авторлық шығармалар — авторлардың туған жылы бойынша
const FOLK = WORKS.filter((w) => !LIT_YEAR[w.id]);
// «т.» — автордың туған жылы (шығарма жылы емес)
const BORN = { kk: "т.", ru: "р.", en: "b." };
const BORN_TITLE = { kk: "Авторлардың туған жылдары", ru: "Годы рождения авторов", en: "Authors\u2019 birth years" };
const AUTH = WORKS.filter((w) => LIT_YEAR[w.id]).sort((a, b) => LIT_YEAR[a.id] - LIT_YEAR[b.id]);
const Y0 = 1835, Y1 = 1925;
const coverStyle = (id) => {
  const [c, d] = LIT_COVER[id] || ["#8A2018", "#5E140F"];
  return { "--lc": c, "--ld": d };
};
export default function Literature() {
  const { lang, explain, state, update, award } = useApp();
  const x = tx(lang);
  const [id, setId] = useState(null);
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
  const audioRef = useRef(null);
  const run = useRef(0);
  const timer = useRef(null);
  const listRef = useRef(null);
  const work = WORKS.find((w) => w.id === id);
  const lit = state.lit || {};
  const sentences = useMemo(() => (work ? work.text.split(/(?<=[.!?])\s+/).filter(Boolean) : []), [work]);

  const stop = () => {
    run.current++;
    clearTimeout(timer.current);
    window.speechSynthesis?.cancel();
    audioRef.current?.pause();
    setPlaying(false);
  };
  useEffect(() => stop, []);
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs.length, busy]);

  function open(w) {
    stop();
    setId(w.id);
    setCur(-1);
    setMsgs([]);
    setErr("");
    setNoVoice(false);
    setQuiz(null);
    setQres(null);
    setChatOn(false);
    setTrans(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function play() {
    if (playing) return stop();
    const my = ++run.current;
    const voice = await getKkVoice();
    if (run.current !== my) return;
    setNoVoice(false);
    setPlaying(true);
    let i = cur >= sentences.length - 1 ? 0 : Math.max(0, cur + 1);

    if (voice) {
      const s = window.speechSynthesis;
      const step = () => {
        if (run.current !== my) return;
        if (i >= sentences.length) return setPlaying(false);
        setCur(i);
        const u = new SpeechSynthesisUtterance(sentences[i]);
        u.voice = voice;
        u.lang = voice.lang;
        u.rate = 0.85;
        const next = () => {
          i++;
          step();
        };
        u.onend = next;
        u.onerror = next;
        s.speak(u);
      };
      return step();
    }

    // Құрылғыда қазақша дауыс жоқ: серверден дыбыс аламыз (Gemini TTS)
    try {
      setLoadingTts(true);
      const url = await fetchTtsUrl(work.text);
      setLoadingTts(false);
      if (run.current !== my) return;
      const a = new Audio(url);
      audioRef.current = a;
      const total = work.text.length;
      const ends = [];
      let acc = 0;
      sentences.forEach((sn) => {
        acc += sn.length + 1;
        ends.push(acc / total);
      });
      a.ontimeupdate = () => {
        const k = a.currentTime / (a.duration || 1);
        setCur(Math.max(0, ends.findIndex((e) => k <= e)));
      };
      a.onended = () => setPlaying(false);
      a.onerror = () => setPlaying(false);
      await a.play();
    } catch (e) {
      setLoadingTts(false);
      setNoVoice(true);
      setErr(String(e?.message || "").slice(0, 200));
      // Қазақша дауыс жоқ: орыс (немесе кез келген) дауысымен оқимыз — кирилл әріптері ұқсас оқылады
      const sy = window.speechSynthesis;
      const alt = sy?.getVoices().find((v) => /^ru/i.test(v.lang)) || sy?.getVoices().find((v) => /^(tr|uz|ky)/i.test(v.lang)) || sy?.getVoices()[0];
      const step = () => {
        if (run.current !== my) return;
        if (i >= sentences.length) return setPlaying(false);
        setCur(i);
        if (alt) {
          const u = new SpeechSynthesisUtterance(sentences[i]);
          u.voice = alt;
          u.lang = alt.lang;
          u.rate = 0.85;
          const nx = () => {
            i++;
            step();
          };
          u.onend = nx;
          u.onerror = nx;
          sy.speak(u);
        } else {
          const ms = Math.max(1800, sentences[i].length * 70);
          i++;
          timer.current = setTimeout(step, ms);
        }
      };
      step();
    }
  }

  // Мәтінді ашқанда аударма фонда әзірленеді: батырманы басқанда лезде шығады
  const ready = useRef({});
  useEffect(() => {
    if (!work || explain === "kk" || staticTr(work.id, explain)) return;
    const key = `qd_lt_${work.id}_${explain}`;
    try {
      const hit = localStorage.getItem(key);
      if (hit) {
        ready.current[key] = hit;
        return;
      }
    } catch {}
    if (ready.current[key]) return;
    ready.current[key] = fetch("/api/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: work.text, to: explain }) })
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
  }, [id, explain]);
  async function translate() {
    if (trans) return setTrans(null);
    const st = staticTr(work.id, explain);
    if (st) return setTrans(st);
    const key = `qd_lt_${work.id}_${explain}`;
    let v = ready.current[key];
    if (typeof v === "string") return setTrans(v);
    setTrans("loading");
    v = await (v || fetch("/api/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: work.text, to: explain }) }).then((r) => r.json()).then((d) => d.text).catch(() => null));
    if (v) setTrans(v);
    else {
      setTrans(null);
      setErr("Translate error");
    }
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
        body: JSON.stringify({ messages: next, title: work.work, author: work.author, text: work.text, explain, level: state.cefr || work.lvl, name: state.profile.name }),
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
        body: JSON.stringify({ mode: "quiz", title: work.work, author: work.author, text: work.text, explain, level: state.cefr || work.lvl }),
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


  const readN = Object.keys(lit).length;
  const corners = (
    <span className="lit-corners" aria-hidden="true">
      <i><LitCorner /></i><i><LitCorner /></i><i><LitCorner /></i><i><LitCorner /></i>
    </span>
  );
  const book = (w, i) => (
    <li key={w.id} className="lit-slot" style={{ "--i": i }}>
      <button className={`lit-book ${lit[w.id] ? "is-read" : ""}`} onClick={() => open(w)} style={coverStyle(w.id)}>
        <span className="lit-cover">
          {corners}
          <span className="lit-cover-top">
            <span className="lit-lvl">{w.lvl}</span>
            {LIT_YEAR[w.id] && <span className="lit-year">{BORN[lang] || BORN.en} {LIT_YEAR[w.id]}</span>}
          </span>
          <span className="lit-art"><LitEmblem id={w.id} size={84} /></span>
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
    // Уақыт сызығы: жақын жылдар бір-бірін баспасын деп қатарларға бөлінеді
    const lanes = [];
    const dots = AUTH.map((w) => {
      const y = LIT_YEAR[w.id];
      let k = 0;
      while (lanes[k] != null && y - lanes[k] < 6) k++;
      lanes[k] = y;
      return { w, y, k, p: ((y - Y0) / (Y1 - Y0)) * 100 };
    });
    return (
      <div className="literature lit-lib">
        <header className="lit-hero">
          <div className="lit-hero-txt">
            <span className="kicker">{x.litKicker}</span>
            <h1>{x.litTitle}</h1>
            <p className="lit-epi" lang="kk" dir="ltr">«Өнер алды — қызыл тіл»</p>
            <p className="lit-sub">{x.litSub}</p>
            <div className="head-tools">
              <LangPicker />
              <span className="chip gold lit-count"><Icon name="book" size={16} /> {readN}/{WORKS.length}</span>
            </div>
            <div className="lit-spines" aria-hidden="true">
              {WORKS.map((w) => <i key={w.id} className={lit[w.id] ? "on" : ""} style={coverStyle(w.id)} />)}
            </div>
          </div>
          <div className="lit-hero-art">
            <LitHeroArt />
            <span className="lit-hero-aqyl"><Qyran mood={readN ? "happy" : "idle"} size={92} /></span>
          </div>
        </header>

        <section className="lit-shelf" aria-labelledby="lit-sh-folk">
          <h2 className="lit-shelf-h" id="lit-sh-folk">
            <span className="lit-shelf-ic"><Icon name="scroll" size={18} /></span>
            <span lang="kk" dir="ltr">{FOLK[0]?.author}</span>
            <small>{FOLK.length}</small>
          </h2>
          <ul className="lit-books">{FOLK.map(book)}</ul>
        </section>

        <section className="lit-shelf" aria-labelledby="lit-sh-auth">
          <h2 className="lit-shelf-h" id="lit-sh-auth">
            <span className="lit-shelf-ic"><Icon name="pen" size={18} /></span>
            <span title={BORN_TITLE[lang] || BORN_TITLE.en}>{LIT_YEAR[AUTH[0].id]} — {LIT_YEAR[AUTH[AUTH.length - 1].id]}</span>
            <small>{AUTH.length}</small>
          </h2>
          <div className="lit-line" aria-hidden="true">
            <span className="lit-line-axis" />
            {[1840, 1860, 1880, 1900, 1920].map((t) => (
              <span key={t} className="lit-tick" style={{ insetInlineStart: `${((t - Y0) / (Y1 - Y0)) * 100}%` }}>{t}</span>
            ))}
            {dots.map(({ w, k, p }) => (
              <i key={w.id} className={`lit-dot ${lit[w.id] ? "on" : ""}`} style={{ ...coverStyle(w.id), insetInlineStart: `${p}%`, "--k": k }} />
            ))}
          </div>
          <ul className="lit-books">{AUTH.map((w, i) => book(w, i + FOLK.length))}</ul>
        </section>
      </div>
    );
  }

  const tr = typeof trans === "string" && trans !== "loading" ? trans.split(/(?<=[.!?])\s+/).filter(Boolean) : null;
  const parallel = !!tr && tr.length === sentences.length;
  const mood = loadingTts || busy || quiz === "loading" ? "think" : playing ? "happy" : qres ? (qres.right >= 4 ? "cheer" : "support") : "idle";
  const prog = sentences.length ? Math.max(0, cur + 1) / sentences.length : 0;
  const snt = (sn, i) => (
    <span key={i} className={`snt ${i === cur ? "now" : ""} ${i < cur ? "past" : ""}`} onClick={() => setCur(i)}>
      {sn}{" "}
    </span>
  );

  return (
    <div className="literature lit-read" style={coverStyle(work.id)}>
      <nav className="lit-top">
        <button className="btn ghost small" onClick={() => { stop(); setId(null); }}>
          <Icon name="left" size={16} /> {x.litBack}
        </button>
        <span className="lit-crumb">{x.litKicker}</span>
      </nav>

      <article className="lit-spread rise">
        <header className="lit-verso">
          <div className="lit-mini-cover">
            {corners}
            <LitEmblem id={work.id} size={104} />
          </div>
          <div className="lit-verso-txt">
            <span className="lit-badge">{L(work.kind, lang)} · {work.lvl}</span>
            <h2 lang="kk" dir="ltr">{work.work}</h2>
            <p className="lit-by" lang="kk" dir="ltr">
              {work.author}
              {LIT_YEAR[work.id] && <span className="lit-by-y"> · {BORN[lang] || BORN.en} {LIT_YEAR[work.id]}</span>}
            </p>
          </div>
          <div className="lit-gist">
            <Icon name="sparkle" size={18} />
            <p dir="ltr">{L(work.gist, explain === "ru" ? "ru" : "en")}</p>
          </div>
          <div className={`lit-aqyl ${playing ? "is-on" : ""}`}>
            <Qyran mood={mood} size={84} />
          </div>
        </header>

        <section className="lit-recto">
          <div className="lit-thread" aria-hidden="true"><i style={{ transform: `scaleX(${prog})` }} /></div>
          {parallel ? (
            <ol className="lit-par">
              {sentences.map((sn, i) => (
                <li key={i} className={`lit-row ${i === cur ? "now" : ""}`}>
                  <span className="lit-n" aria-hidden="true">{i + 1}</span>
                  <span className="lit-kk" lang="kk" dir="ltr">{snt(sn, i)}</span>
                  <span className="lit-tr" lang={explain} dir="auto" data-notap="">{tr[i]}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className={`reader-text lit-text ${/^[«"“(]/.test(sentences[0] || "") ? "no-cap" : ""}`} lang="kk" dir="ltr">{sentences.map(snt)}</p>
          )}
          {trans && !parallel && (
            <p className={`lit-trans ${trans === "loading" ? "is-loading" : ""}`} lang={trans === "loading" ? undefined : explain} dir="auto" data-notap="">
              {trans === "loading" ? x.tapLoading : trans}
            </p>
          )}
          <p className="lit-note"><Icon name="search" size={15} /> {x.litNote}</p>
          {noVoice && <p className="lit-note lit-warn">{x.litNoVoice}{err ? ` (${err})` : ""}</p>}
        </section>
      </article>

      <div className="lit-dock">
        <button className={`btn lit-play ${playing ? "is-on" : ""}`} onClick={play}>
          <Icon name={playing ? "stop" : "volume"} size={18} /> {loadingTts ? x.tapLoading : playing ? x.litPause : x.litRead}
        </button>
        {explain !== "kk" && (
          <button className={`btn ghost lit-tbtn ${trans && trans !== "loading" ? "is-on" : ""}`} onClick={translate} aria-pressed={!!trans && trans !== "loading"}>
            <Icon name="globe" size={18} /> {trans && trans !== "loading" ? x.litTransHide : x.litTrans}
          </button>
        )}
        <button className="btn gold lit-done" disabled={quiz === "loading"} onClick={finish}>
          <Icon name={lit[work.id] ? "star" : "check"} size={18} /> {lit[work.id] ? x.litDoneMark : x.litDone}
        </button>
        {cur >= 0 && <span className="lit-pos" aria-hidden="true">{cur + 1}/{sentences.length}</span>}
      </div>

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
