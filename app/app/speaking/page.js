"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../../components/Store";
import Qyran from "../../components/Qyran";
import Icon from "../../components/Icon";
import { PHRASES, SP_PASS, SP_LEVELS } from "../../../lib/phrases";
import { tx } from "../../../lib/tx";
import { toWav } from "../../../lib/audio";
import { getKkVoice, fetchTtsUrl } from "../../../lib/speak";

const MAX_MS = 15000;

export default function Speaking() {
  const { lang, explain, state, update, award } = useApp();
  const x = useMemo(() => tx(lang), [lang]);
  const sp = state.speaking || { level: null, best: {}, log: [] };
  const [lv, setLv] = useState("A1");
  const [idx, setIdx] = useState(0);
  const [custom, setCustom] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | rec | busy
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");
  const [ms, setMs] = useState(0);
  const recRef = useRef(null);
  const timer = useRef(null);

  const list = PHRASES.filter((p) => p.lvl === lv);
  const cur = useCustom && custom.trim() ? { lvl: null, kk: custom.trim(), ru: "", en: "" } : list[idx % list.length];

  useEffect(() => () => {
    clearInterval(timer.current);
    recRef.current?.stream?.getTracks().forEach((t) => t.stop());
    window.speechSynthesis?.cancel();
  }, []);

  async function listen() {
    setErr("");
    const voice = await getKkVoice();
    if (voice) {
      const u = new SpeechSynthesisUtterance(cur.kk);
      u.voice = voice;
      u.lang = voice.lang;
      u.rate = 0.85;
      window.speechSynthesis.cancel();
      return window.speechSynthesis.speak(u);
    }
    try {
      const url = await fetchTtsUrl(cur.kk);
      new Audio(url).play();
    } catch {
      setErr(x.spNoVoice);
    }
  }

  async function start() {
    setErr("");
    setRes(null);
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

  const secs = Math.min(15, ms / 1000);
  const tone = !res ? "" : res.score >= SP_PASS ? "good" : res.score >= 40 ? "mid" : "low";
  return (
    <div className="speaking">
      <header className="page-head">
        <div>
          <span className="kicker">{x.spKicker}</span>
          <h1>{x.spTitle}</h1>
          <p>{x.spSub}</p>
        </div>
        <span className="chip gold">
          🎤 {x.spLevelNow}: {sp.level || x.spLevelNone}
        </span>
      </header>

      <section className="card sp-levels">
        <h3>{x.spPick}</h3>
        <div className="sp-lv-row">
          {SP_LEVELS.map((l) => (
            <button key={l} className={`sp-lv ${lv === l && !useCustom ? "on" : ""} ${(sp.best?.[l] || 0) >= SP_PASS ? "done" : ""}`} onClick={() => { setLv(l); setIdx(0); setUseCustom(false); setRes(null); setErr(""); }}>
              <b>{l}</b>
              <small>{sp.best?.[l] ? `${sp.best[l]}` : "–"}</small>
            </button>
          ))}
        </div>
        <p className="muted small">{x.spLevelHow}</p>
      </section>

      <section className="card sp-stage">
        <span className="kicker">{x.spTarget}</span>
        <p className="sp-phrase">{cur.kk}</p>
        {(cur.ru || cur.en) && <p className="muted">{explain === "ru" ? cur.ru : cur.en}</p>}
        <div className="sp-actions">
          <button className="btn ghost" onClick={listen}>
            <Icon name="volume" size={18} /> {x.spListen}
          </button>
          {!useCustom && (
            <button className="btn ghost" onClick={() => { setIdx(idx + 1); setRes(null); setErr(""); }}>
              {x.spNext} <Icon name="right" size={16} />
            </button>
          )}
        </div>

        <div className={`mic-wrap ${phase}`}>
          {phase === "rec" && <><i className="ring r1" /><i className="ring r2" /><i className="ring r3" /></>}
          <button className="mic-btn" disabled={phase === "busy"} onClick={phase === "rec" ? stop : start} aria-label={phase === "rec" ? x.spStop : x.spRec}>
            <Icon name={phase === "rec" ? "stop" : "mic"} size={34} />
          </button>
        </div>
        <p className="sp-status">
          {phase === "rec" ? `${x.spRecording} ${secs.toFixed(1)} / 15` : phase === "busy" ? x.spAnalyzing : x.spRec}
        </p>
        {phase === "busy" && <div className="sp-wave"><i /><i /><i /><i /><i /></div>}
        <p className="muted small">{x.spLimit} · {x.spHint}</p>
        {err && <div className="alert">{err}</div>}
      </section>

      {res && (
        <section className={`card sp-res rise ${tone}`}>
          <div className="sp-ring" style={{ "--p": res.score }}>
            <b>{res.score}</b>
            <small>{x.spScore}</small>
          </div>
          <div className="sp-res-body">
            <h3>{res.verdict}</h3>
            <p className="sp-heard">
              <span>{x.spHeard}:</span> {res.heard ? `«${res.heard}»` : "—"}
            </p>
            {res.tips?.length > 0 && (
              <>
                <h4>{x.spTips}</h4>
                <ul>{res.tips.map((tp, i) => <li key={i}>{tp}</li>)}</ul>
              </>
            )}
            <button className="btn gold" onClick={start}>
              <Icon name="refresh" size={16} /> {x.spTryAgain}
            </button>
          </div>
          <Qyran mood={res.score >= SP_PASS ? "cheer" : "support"} size={90} />
        </section>
      )}

      <section className="card sp-custom">
        <h3>{x.spCustom}</h3>
        <div className="sp-custom-row">
          <input className="input" value={custom} maxLength={160} onChange={(e) => setCustom(e.target.value)} placeholder={x.spCustomPh} />
          <button className="btn ghost" disabled={!custom.trim()} onClick={() => { setUseCustom(true); setRes(null); setErr(""); }}>
            {x.spUse}
          </button>
        </div>
      </section>

      {sp.log?.length > 0 && (
        <section className="card sp-log">
          <h3>{x.spHistory}</h3>
          <ul>
            {sp.log.slice(0, 6).map((e, i) => (
              <li key={i}>
                <span className={`sc ${e.score >= SP_PASS ? "good" : ""}`}>{e.score}</span>
                <span>{e.kk}</span>
                {e.lvl && <em>{e.lvl}</em>}
              </li>
            ))}
          </ul>
          <p className="muted small">{x.spPrivacy}</p>
        </section>
      )}
    </div>
  );
}
