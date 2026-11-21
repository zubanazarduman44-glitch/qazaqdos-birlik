"use client";
// Aqyl чатындағы «Айтылымды тексер» режимі: фраза таңдау, тыңдау, 15 секунд жазу.
// Нәтиже чат ағынына хабар болып түседі (onAsk → onDone), сөйлеу деңгейі state.speaking-те сақталады.
import { useEffect, useRef, useState } from "react";
import { useApp } from "./Store";
import Icon from "./Icon";
import { TuzelWave } from "./TuzelKit";
import { PHRASES, SP_PASS, SP_LEVELS } from "../../lib/phrases";
import { toWav } from "../../lib/audio";
import { sayKk, stopKk } from "../../lib/speak";

const MAX_MS = 15000;
// Баяу тыңдау түймесінің жазуы (LessonPlayer-дегі мәтінмен бірдей)
const SLOW = { kk: "Баяу", ru: "Медленно" };

export default function AqylSpeak({ x, busy, retry = 0, onAsk, onDone, onPhase }) {
  const { lang, explain, state, update, award } = useApp();
  const sp = state.speaking || { level: null, best: {}, log: [] };
  const [lv, setLv] = useState(() => (sp.level && SP_LEVELS[Math.min(SP_LEVELS.length - 1, SP_LEVELS.indexOf(sp.level) + 1)]) || "A1");
  const [idx, setIdx] = useState(0);
  const [custom, setCustom] = useState("");
  const [own, setOwn] = useState(false); // өз фразаң жолы ашық па
  const [useCustom, setUseCustom] = useState(false);
  const [phase, setPhaseRaw] = useState("idle"); // idle | rec | busy
  const [ms, setMs] = useState(0);
  const [play, setPlay] = useState(""); // "" | "n" | "s"
  const [err, setErr] = useState("");
  const recRef = useRef(null);
  const timer = useRef(null);

  const list = PHRASES.filter((p) => p.lvl === lv);
  const cur = useCustom && custom.trim() ? { lvl: null, kk: custom.trim(), ru: "", en: "" } : list[idx % list.length];
  const pos = (idx % list.length) + 1;
  const gloss = explain === "ru" ? cur.ru : cur.en;

  function setPhase(p) {
    setPhaseRaw(p);
    onPhase?.(p);
  }

  useEffect(() => () => {
    clearInterval(timer.current);
    const r = recRef.current;
    if (r) {
      r.onstop = null;
      if (r.state === "recording") r.stop();
      r.stream?.getTracks().forEach((t) => t.stop());
    }
    stopKk();
    onPhase?.("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Нәтиже хабарындағы «Қайталау» түймесі
  useEffect(() => {
    if (retry) start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retry]);

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

  function record(target, d) {
    const entry = { kk: target.kk, score: d.score, lvl: target.lvl, at: Date.now() };
    let up = null;
    update((s) => {
      const cs = s.speaking || { level: null, best: {}, log: [] };
      const best = { ...cs.best };
      if (target.lvl && d.score > (best[target.lvl] || 0)) best[target.lvl] = d.score;
      let level = null;
      for (const l of SP_LEVELS) if ((best[l] || 0) >= SP_PASS) level = l;
      if (level && level !== cs.level) up = level;
      return { ...s, speaking: { level, best, log: [entry, ...(cs.log || [])].slice(0, 10) } };
    });
    award(d.score >= SP_PASS ? 15 : 5, d.score >= SP_PASS ? 5 : 0, up ? `${x.spNewLevel}: ${up}` : undefined);
  }

  async function start() {
    if (phase !== "idle" || busy) return;
    setErr("");
    stopKk();
    setPlay("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") return setErr(x.spNoMic);
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    } catch {
      return setErr(x.spMicDenied);
    }
    const target = cur;
    const chunks = [];
    const rec = new MediaRecorder(stream);
    recRef.current = rec;
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    rec.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      clearInterval(timer.current);
      setPhase("busy");
      onAsk?.(target.kk);
      try {
        const audio = await toWav(new Blob(chunks, { type: rec.mimeType || "audio/webm" }));
        const r = await fetch("/api/speaking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ audio, mime: "audio/wav", target: target.kk, explain }) });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
        record(target, d);
        onDone?.(target.kk, d, "");
      } catch (e) {
        onDone?.(target.kk, null, e.message || "Error");
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

  const rec = phase === "rec";
  const wait = phase === "busy";
  const secs = Math.min(15, ms / 1000);
  const slowL = SLOW[lang] || "Slowly";

  return (
    <section className={`cx-sp ${phase}`} aria-label={x.spTarget}>
      <div className="cx-sp-top">
        <div className="cx-sp-lv" role="group" aria-label={x.spPick}>
          {SP_LEVELS.map((l) => {
            const best = sp.best?.[l] || 0;
            const done = best >= SP_PASS;
            const on = lv === l && !useCustom;
            return (
              <button key={l} type="button" className={`cx-sp-l ${on ? "on" : ""} ${done ? "done" : ""}`} aria-pressed={on} disabled={rec || wait} title={best ? `${x.spScore}: ${best}` : undefined} onClick={() => { setLv(l); setIdx(0); setUseCustom(false); setErr(""); }}>
                {l}
                {done && <Icon name="check" size={13} stroke={3} />}
              </button>
            );
          })}
          <button type="button" className={`cx-sp-l own ${useCustom || own ? "on" : ""}`} aria-pressed={own} aria-label={x.spCustom} title={x.spCustom} disabled={rec || wait} onClick={() => { setOwn((o) => !o); if (own) setUseCustom(false); }}>
            <Icon name="pen" size={16} />
          </button>
        </div>
        <span className="cx-sp-badge" title={x.spLevelHow}>
          <small>{x.spLevelNow}</small>
          <b>{sp.level || x.spLevelNone}</b>
        </span>
      </div>

      {own && (
        <form className="cx-sp-own" onSubmit={(e) => { e.preventDefault(); if (custom.trim()) { setUseCustom(true); setErr(""); } }}>
          <input className="input" value={custom} maxLength={160} onChange={(e) => setCustom(e.target.value)} placeholder={x.spCustomPh} aria-label={x.spCustom} lang="kk" dir="auto" />
          <button type="submit" className="cx-sp-use" disabled={!custom.trim() || rec || wait}>{x.spUse}</button>
        </form>
      )}

      <div className="cx-sp-card">
        <div className="cx-sp-txt">
          <span className="cx-sp-tag">{useCustom ? x.spCustom : `${lv} · ${pos}/${list.length}`}</span>
          <p className="cx-sp-phrase" dir="auto" lang="kk" key={cur.kk}>{cur.kk}</p>
          {gloss && <p className="cx-sp-gloss">{gloss}</p>}
        </div>
        <div className="cx-sp-acts">
          <button type="button" className={`cx-sp-btn ${play === "n" ? "playing" : ""}`} onClick={() => listen(false)} aria-label={x.spListen} title={x.spListen}>
            <Icon name="volume" size={20} />
          </button>
          <button type="button" className={`cx-sp-btn soft ${play === "s" ? "playing" : ""}`} onClick={() => listen(true)} aria-label={slowL} title={slowL}>
            <span dir="ltr">0.5×</span>
          </button>
          {!useCustom && (
            <button type="button" className="cx-sp-btn ghost" onClick={() => { setIdx(idx + 1); setErr(""); }} disabled={rec || wait} aria-label={x.spNext} title={x.spNext}>
              <Icon name="right" size={20} className="tz-flip" />
            </button>
          )}
        </div>
      </div>

      <div className="cx-sp-rec">
        <button type="button" className="cx-sp-mic" onClick={rec ? stop : start} disabled={wait || (busy && !rec)} aria-label={rec ? x.spStop : x.spRec}>
          <Icon name={rec ? "stop" : "mic"} size={24} stroke={2.4} />
        </button>
        <div className="cx-sp-state">
          <p className="cx-sp-status" aria-live="polite">
            {rec ? (
              <>
                <span className="cx-sp-dot" aria-hidden="true" /> {x.spRecording} <b>{secs.toFixed(1)}</b> / 15
              </>
            ) : wait ? (
              x.spAnalyzing
            ) : (
              x.spRec
            )}
          </p>
          {rec ? <TuzelWave stream={recRef.current?.stream || null} bars={15} className="cx-sp-wave" /> : <small className="cx-sp-hint">{x.spLimit} · {x.spHint}</small>}
        </div>
      </div>
      {err && (
        <p className="cx-sp-err" role="alert">
          <Icon name="x" size={16} /> {err}
        </p>
      )}
    </section>
  );
}
