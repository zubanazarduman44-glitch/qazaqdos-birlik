"use client";
import "../../tuzel.css";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../../components/Store";
import Icon from "../../components/Icon";
import TuzelMic from "../../components/TuzelMic";
import TuzelSpeakResult from "../../components/TuzelSpeakResult";
import { PHRASES, SP_PASS, SP_LEVELS } from "../../../lib/phrases";
import { tx } from "../../../lib/tx";
import { toWav } from "../../../lib/audio";
import { sayKk, stopKk } from "../../../lib/speak";

const MAX_MS = 15000;
// Баяу тыңдау түймесінің жазуы (LessonPlayer-дегі мәтінмен бірдей)
const SLOW = { kk: "Баяу", ru: "Медленно" };

export default function Speaking() {
  const { lang, explain, state, update, award } = useApp();
  const x = tx(lang);
  const sp = state.speaking || { level: null, best: {}, log: [] };
  const [lv, setLv] = useState("A1");
  const [idx, setIdx] = useState(0);
  const [custom, setCustom] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | rec | busy
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");
  const [ms, setMs] = useState(0);
  const [play, setPlay] = useState(""); // "" | "n" | "s" — қай дыбыс түймесі ойнап тұр
  const recRef = useRef(null);
  const timer = useRef(null);

  const list = PHRASES.filter((p) => p.lvl === lv);
  const cur = useCustom && custom.trim() ? { lvl: null, kk: custom.trim(), ru: "", en: "" } : list[idx % list.length];
  const pos = (idx % list.length) + 1;

  useEffect(() => () => {
    clearInterval(timer.current);
    recRef.current?.stream?.getTracks().forEach((t) => t.stop());
    window.speechSynthesis?.cancel();
    stopKk();
  }, []);

  function listen(slow) {
    setErr("");
    const k = slow ? "s" : "n";
    sayKk(cur.kk, {
      slow,
      onState: (s) => {
        if (s === "error") {
          setPlay("");
          setErr(x.spNoVoice);
        } else setPlay(s === "idle" ? "" : k);
      },
    });
  }

  async function start() {
    setErr("");
    setRes(null);
    stopKk();
    setPlay("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") return setErr(x.spNoMic);
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    } catch {
      return setErr(x.spMicDenied);
    }
    const chunks = [];
    const rec = new MediaRecorder(stream);
    recRef.current = rec;
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    rec.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      clearInterval(timer.current);
      setPhase("busy");
      try {
        const audio = await toWav(new Blob(chunks, { type: rec.mimeType || "audio/webm" }));
        const r = await fetch("/api/speaking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ audio, mime: "audio/wav", target: cur.kk, explain }) });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
        setRes(d);
        record(d);
      } catch (e) {
        setErr(e.message || "Error");
      } finally {
        setPhase("idle");
      }
    };
    rec.start();
    setPhase("rec");
    setMs(0);
    const t0 = Date.now();
    timer.current = setInterval(() => {
      const d = Date.now() - t0;
      setMs(d);
      if (d >= MAX_MS && rec.state === "recording") rec.stop();
    }, 100);
  }
  function stop() {
    if (recRef.current?.state === "recording") recRef.current.stop();
  }

  function record(d) {
    const entry = { kk: cur.kk, score: d.score, lvl: cur.lvl, at: Date.now() };
    let up = null;
    update((s) => {
      const cs = s.speaking || { level: null, best: {}, log: [] };
      const best = { ...cs.best };
      if (cur.lvl && d.score > (best[cur.lvl] || 0)) best[cur.lvl] = d.score;
      let level = null;
      for (const l of SP_LEVELS) if ((best[l] || 0) >= SP_PASS) level = l;
      if (level && level !== cs.level) up = level;
      return { ...s, speaking: { level, best, log: [entry, ...(cs.log || [])].slice(0, 10) } };
    });
    award(d.score >= SP_PASS ? 15 : 5, d.score >= SP_PASS ? 5 : 0, up ? `${x.spNewLevel}: ${up}` : undefined);
  }

  const gloss = explain === "ru" ? cur.ru : cur.en;
  return (
    <div className="speaking tzs">
      <header className="tz-head tzs-head">
        <div>
          <span className="kicker">{x.spKicker}</span>
          <h1>{x.spTitle}</h1>
          <p>{x.spSub}</p>
        </div>
        <span className="tzs-lvbadge">
          <span className="tzs-lvbadge-ic" aria-hidden="true"><Icon name="mic" size={18} /></span>
          <span>
            <small>{x.spLevelNow}</small>
            <b>{sp.level || x.spLevelNone}</b>
          </span>
        </span>
      </header>

      <section className="tzs-levels" aria-labelledby="tzs-pick">
        <h3 id="tzs-pick">{x.spPick}</h3>
        <ol className="tzs-steps">
          {SP_LEVELS.map((l, i) => {
            const best = sp.best?.[l] || 0;
            const done = best >= SP_PASS;
            const on = lv === l && !useCustom;
            return (
              <li key={l} style={{ "--i": i }}>
                <button type="button" className={`tzs-step ${on ? "on" : ""} ${done ? "done" : ""}`} aria-pressed={on} onClick={() => { setLv(l); setIdx(0); setUseCustom(false); setRes(null); setErr(""); }}>
                  <span className="tzs-step-top">
                    <b>{l}</b>
                    {done && <Icon name="check" size={16} stroke={3} className="tzs-step-ok" />}
                  </span>
                  <span className="tzs-step-bar" aria-hidden="true"><i style={{ transform: `scaleX(${Math.min(1, best / 100)})` }} /></span>
                  <small>{best ? `${best}` : "–"}</small>
                </button>
              </li>
            );
          })}
        </ol>
        <p className="tzs-how">
          <Icon name="target" size={15} /> {x.spLevelHow}
        </p>
      </section>

      <section className={`tzs-stage ${phase}`} aria-label={x.spTarget}>
        <div className="tzs-card">
          <div className="tzs-card-top">
            <span className="kicker">{x.spTarget}</span>
            {useCustom ? (
              <span className="tzs-tag"><Icon name="pen" size={14} /> {x.spCustom}</span>
            ) : (
              <span className="tzs-tag">{lv} · {pos}/{list.length}</span>
            )}
          </div>
          <p className="tzs-phrase" dir="auto" lang="kk" key={cur.kk}>{cur.kk}</p>
          {(cur.ru || cur.en) && <p className="tzs-gloss">{gloss}</p>}
          <div className="tzs-audio">
            <button type="button" className={`tzs-play ${play === "n" ? "playing" : ""}`} onClick={() => listen(false)}>
              <Icon name="volume" size={20} /> {x.spListen}
            </button>
            <button type="button" className={`tzs-play slow ${play === "s" ? "playing" : ""}`} onClick={() => listen(true)}>
              <Icon name="volume" size={18} /> {SLOW[lang] || "Slowly"}
              <span className="tzs-x" dir="ltr" aria-hidden="true">0.5×</span>
            </button>
            {!useCustom && (
              <button type="button" className="tzs-next" onClick={() => { setIdx(idx + 1); setRes(null); setErr(""); }}>
                {x.spNext} <Icon name="right" size={16} className="tz-flip" />
              </button>
            )}
          </div>
        </div>

        <TuzelMic x={x} phase={phase} ms={ms} stream={phase === "rec" ? recRef.current?.stream || null : null} onStart={start} onStop={stop} />
        {err && (
          <p className="tz-alert tzs-err" role="alert">
            <Icon name="x" size={16} /> {err}
          </p>
        )}
      </section>

      {res && <TuzelSpeakResult x={x} res={res} pass={SP_PASS} target={cur.kk} onRetry={start} />}

      <div className="tzs-more">
        <section className="tzs-custom" aria-labelledby="tzs-custom-h">
          <h3 id="tzs-custom-h"><Icon name="pen" size={18} /> {x.spCustom}</h3>
          <div className="tzs-custom-row">
            <input className="input" value={custom} maxLength={160} onChange={(e) => setCustom(e.target.value)} placeholder={x.spCustomPh} aria-label={x.spCustom} lang="kk" dir="auto" />
            <button type="button" className="tzs-use" disabled={!custom.trim()} onClick={() => { setUseCustom(true); setRes(null); setErr(""); }}>
              {x.spUse}
            </button>
          </div>
        </section>

        {sp.log?.length > 0 && (
          <section className="tzs-log" aria-labelledby="tzs-log-h">
            <h3 id="tzs-log-h"><Icon name="chart" size={18} /> {x.spHistory}</h3>
            <ul>
              {sp.log.slice(0, 6).map((e, i) => (
                <li key={i}>
                  <span className={`tzs-sc ${e.score >= SP_PASS ? "good" : e.score >= 40 ? "mid" : ""}`}>{e.score}</span>
                  <span className="tzs-log-kk" dir="auto" lang="kk">{e.kk}</span>
                  {e.lvl && <em>{e.lvl}</em>}
                </li>
              ))}
            </ul>
            <p className="tzs-priv"><Icon name="lock" size={14} /> {x.spPrivacy}</p>
          </section>
        )}
      </div>
    </div>
  );
}
