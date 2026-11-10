"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../../components/Store";
import Qyran from "../../components/Qyran";
import Icon from "../../components/Icon";
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function play() {
    if (playing) return stop();
    const my = ++run.current;
    const s = window.speechSynthesis;
    const voice = s?.getVoices().find((v) => /^kk/i.test(v.lang));
    setNoVoice(!voice);
    setPlaying(true);
    let i = cur >= sentences.length - 1 ? 0 : Math.max(0, cur + 1);
    const step = () => {
      if (run.current !== my) return;
      if (i >= sentences.length) {
        setPlaying(false);
        return;
      }
      setCur(i);
      const sentence = sentences[i];
      const next = () => {
        i++;
        step();
      };
      if (voice) {
        const u = new SpeechSynthesisUtterance(sentence);
        u.voice = voice;
        u.lang = voice.lang;
        u.rate = 0.85;
        u.onend = next;
        u.onerror = next;
        s.speak(u);
      } else timer.current = setTimeout(next, Math.max(1800, sentence.length * 70));
    };
    step();
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
  function finish() {
    stop();
    if (!lit[work.id]) {
      update((s) => ({ ...s, lit: { ...(s.lit || {}), [work.id]: Date.now() } }));
      award(20, 8);
    }
    ask(x.litFirst);
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
          <span className="chip gold">📚 {Object.keys(lit).length}/{WORKS.length}</span>
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
        <p className="muted small">💡 {L(work.gist, explain === "ru" ? "ru" : "en")}</p>
        <p className="muted small">{x.litNote}</p>
        {noVoice && <p className="muted small">{x.litNoVoice}</p>}
        <div className="reader-actions">
          <button className="btn blue" onClick={play}>
            <Icon name={playing ? "stop" : "volume"} size={18} /> {playing ? x.litPause : x.litRead}
          </button>
          <button className="btn gold" disabled={busy || msgs.length > 0} onClick={finish}>
            <Icon name="check" size={18} /> {lit[work.id] ? x.litDoneMark : x.litDone}
          </button>
        </div>
      </section>

      {msgs.length > 0 && (
        <section className="card lit-chat rise">
          <h3>{x.litChatTitle}</h3>
          <div className="lit-list" ref={listRef}>
            {msgs.slice(1).map((m, i) => (
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
