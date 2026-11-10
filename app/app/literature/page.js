"use client";
import LangPicker from "../../components/LangPicker";
import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../../components/Store";
import Qyran from "../../components/Qyran";
import Icon from "../../components/Icon";
import Quiz from "../../components/Quiz";
import { getKkVoice, fetchTtsUrl } from "../../../lib/speak";
import { shuffle } from "../../../lib/words";
import { WORKS } from "../../../lib/literature";
import { tx } from "../../../lib/tx";
import { L } from "../../../lib/i18n";

export default function Literature() {
  const { lang, explain, state, update, award } = useApp();
  const x = useMemo(() => tx(lang), [lang]);
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

  async function translate() {
    if (trans) return setTrans(null);
    const key = `qd_lt_${work.id}_${explain}`;
    try {
      const hit = localStorage.getItem(key);
      if (hit) return setTrans(hit);
    } catch {}
    setTrans("loading");
    try {
      const r = await fetch("/api/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: work.text, to: explain }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.text) throw new Error(d.error || "err");
      setTrans(d.text);
      try {
        localStorage.setItem(key, d.text);
      } catch {}
    } catch {
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

  if (!work)
    return (
      <div className="literature">
        <header className="page-head">
          <div>
            <span className="kicker">{x.litKicker}</span>
            <h1>{x.litTitle}</h1>
            <p>{x.litSub}</p>
          </div>
          <div className="head-tools">
            <LangPicker />
            <span className="chip gold">📚 {Object.keys(lit).length}/{WORKS.length}</span>
          </div>
        </header>
        <div className="works">
          {WORKS.map((w, i) => (
            <button key={w.id} className={`card work ${lit[w.id] ? "read" : ""}`} onClick={() => open(w)} style={{ animationDelay: `${i * 0.04}s` }}>
              <span className="work-e">{w.e}</span>
              <span className="work-b">
                <b>{w.work}</b>
                <small>{w.author}</small>
                <em>{L(w.kind, lang)} · {w.lvl}</em>
              </span>
              {lit[w.id] && <span className="work-ok">✓</span>}
            </button>
          ))}
        </div>
      </div>
    );

  return (
    <div className="literature">
      <button className="btn ghost small" onClick={() => { stop(); setId(null); }}>
        <Icon name="left" size={16} /> {x.litBack}
      </button>
      <section className="card reader rise">
        <div className="reader-head">
          <span className="work-e big">{work.e}</span>
          <div>
            <span className="badge">{L(work.kind, lang)} · {work.lvl}</span>
            <h2>{work.work}</h2>
            <p className="muted">{work.author}</p>
          </div>
          <Qyran mood={playing ? "happy" : "idle"} size={80} />
        </div>
        <p className="reader-text">
          {sentences.map((sn, i) => (
            <span key={i} className={`snt ${i === cur ? "now" : ""} ${i < cur ? "past" : ""}`} onClick={() => setCur(i)}>
              {sn}{" "}
            </span>
          ))}
        </p>
        {trans && <p className="lit-trans">{trans === "loading" ? x.tapLoading : trans}</p>}
        <p className="muted small">💡 {L(work.gist, explain === "ru" ? "ru" : "en")}</p>
        <p className="muted small">{x.litNote}</p>
        {noVoice && <p className="muted small">{x.litNoVoice}{err ? ` (${err})` : ""}</p>}
        <div className="reader-actions">
          <button className="btn blue" onClick={play}>
            <Icon name={playing ? "stop" : "volume"} size={18} /> {loadingTts ? x.tapLoading : playing ? x.litPause : x.litRead}
          </button>
          {explain !== "kk" && (
            <button className="btn ghost" onClick={translate}>
              <Icon name="globe" size={18} /> {trans && trans !== "loading" ? x.litTransHide : x.litTrans}
            </button>
          )}
          <button className="btn gold" disabled={quiz === "loading"} onClick={finish}>
            <Icon name="check" size={18} /> {lit[work.id] ? x.litDoneMark : x.litDone}
          </button>
        </div>
      </section>

      {quiz && (
        <section className="card lit-quiz rise">
          <h3>🏆 {x.litTest}</h3>
          {quiz === "loading" && <p className="muted">{x.litTestLoading}</p>}
          {quiz === "error" && (
            <>
              {err && <p className="alert">{err}</p>}
              <button className="btn gold" onClick={finish}><Icon name="refresh" size={16} /> {x.spTryAgain}</button>
            </>
          )}
          {quiz?.qs && <Quiz key={quiz.qs[0].prompt} questions={quiz.qs} onDone={quizDone} pass={4} />}
          {qres && (
            <div className="alert ok rise">
              {x.litTestScore(qres.right, qres.total)}
              <button className="btn ghost small" onClick={finish}><Icon name="refresh" size={15} /> {x.spTryAgain}</button>
            </div>
          )}
        </section>
      )}

      {!chatOn && (
        <button className="btn ghost" onClick={() => setChatOn(true)}>
          <Icon name="chat" size={18} /> {x.litAskBtn}
        </button>
      )}
      {chatOn && (
        <section className="card lit-chat rise">
          <h3>{x.litChatTitle}</h3>
          {msgs.length === 0 && <p className="muted small">{x.litAsk}</p>}
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
