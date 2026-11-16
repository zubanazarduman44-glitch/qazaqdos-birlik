"use client";
// «Aqyl-мен еркін сөйлесу»: Aqyl таңдалған орындағы кейіпкердің рөлін ойнайды (/api/roleplay).
// Кейіпкер жолдары қазақша айтылады; «✎ » деп басталатын жол — оқушыға түзету (бөлек безендіріледі).
import { useEffect, useRef, useState } from "react";
import { useApp } from "./Store";
import Icon from "./Icon";
import ShellGlyph from "./ShellGlyph";
import { VrScene, VrFace } from "./VrArt";
import { vrL } from "./VrL10n";
import { L } from "../../lib/i18n";
import { sayKk, stopKk } from "../../lib/speak";
import { toWav } from "../../lib/audio";

const LEVELS = ["A1", "A2", "B1", "B2"];
const FIX = /^\s*✎\s*/;
const split = (text) => String(text || "").split(/\n+/).map((s) => s.trim()).filter(Boolean);
const spoken = (text) => split(text).filter((l) => !FIX.test(l)).join(" ");

export default function VrTalk({ places, scenes, scene, place: place0, level: level0, onClose }) {
  const { lang, explain, award, t } = useApp();
  const T = vrL(lang);
  const [place, setPlace] = useState(scene?.place || place0 || Object.keys(places)[0]);
  const [level, setLevel] = useState(scene?.level || level0 || "A1");
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [rec, setRec] = useState(null);
  const [micOk, setMicOk] = useState(false);
  const [talk, setTalk] = useState(false);
  const listRef = useRef(null);
  const recRef = useRef(null);
  const mounted = useRef(true);
  const req = useRef(0);
  const sceneFixed = scene && scene.place === place ? scene : null;
  const npcScene = sceneFixed || scenes.find((s) => s.place === place) || null;
  const npc = npcScene?.npc || { name: "Aqyl", voice: "f", role: { kk: "", ru: "", en: "" } };
  const art = places[place]?.art || place;

  useEffect(() => {
    mounted.current = true;
    setMicOk(typeof window !== "undefined" && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== "undefined");
    return () => { mounted.current = false; stopKk(); };
  }, []);
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs.length, busy]);

  const say = (kk) => {
    if (!kk) return;
    sayKk(kk, { onState: (s) => mounted.current && setTalk(s === "playing") }).catch(() => mounted.current && setTalk(false));
  };

  async function ask(history) {
    const my = ++req.current;
    const live = () => mounted.current && my === req.current;
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/roleplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scene: sceneFixed?.id, place, level, explain, messages: history.slice(-10) }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.text) throw new Error(d.error || `HTTP ${r.status}`);
      if (!live()) return;
      setMsgs((m) => [...m, { role: "assistant", text: d.text }]);
      say(spoken(d.text));
    } catch {
      if (live()) setErr(T.freeErr);
    } finally {
      if (live()) setBusy(false);
    }
  }

  // Орын не деңгей ауысқанда — жаңа әңгіме, кейіпкер өзі бастайды
  useEffect(() => {
    stopKk();
    setMsgs([]);
    ask([]);
  }, [place, level]); // eslint-disable-line react-hooks/exhaustive-deps

  function send(q) {
    const msg = String(q ?? text).trim();
    if (!msg || busy) return;
    setText("");
    const next = [...msgs, { role: "user", text: msg.slice(0, 600) }];
    setMsgs(next);
    award(2, 1);
    ask(next);
  }

  async function mic() {
    if (rec === "rec") return recRef.current?.stop();
    if (rec || busy) return;
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setMicOk(false);
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
        if (!res.ok) throw new Error(d.error);
        if (d.text && mounted.current) send(d.text);
      } catch {
        if (mounted.current) setErr(T.micErr);
      } finally {
        if (mounted.current) setRec(null);
      }
    };
    r.start();
    setRec("rec");
    setTimeout(() => r.state === "recording" && r.stop(), 15000);
  }

  return (
    <section className="vr-talk card" aria-label={T.free}>
      <header className="vr-talk-head">
        <div className="vr-talk-stage" aria-hidden="true">
          <VrScene art={art} npc={npc} talk={talk} />
        </div>
        <div className="vr-talk-t">
          <small className="vr-kicker">{T.free}</small>
          <h2><span>{npc.name}</span>{npc.role && <small> · {L(npc.role, explain === "ru" ? "ru" : "en")}</small>}</h2>
          <p className="muted">{T.freeSub}</p>
          <div className="vr-talk-ctl">
            {!sceneFixed && (
              <label className="vr-sel">
                <span>{T.placeLbl}</span>
                <select value={place} onChange={(e) => setPlace(e.target.value)} lang="kk">
                  {Object.entries(places).map(([k, p]) => <option key={k} value={k}>{L(p.name, "kk")}</option>)}
                </select>
              </label>
            )}
            {sceneFixed && <span className="vr-chip" lang="kk">{L(sceneFixed.title, "kk")}</span>}
            <div className="vr-seg" role="group" aria-label={T.levelLbl}>
              {LEVELS.map((l) => (
                <button key={l} type="button" className={level === l ? "on" : ""} aria-pressed={level === l} onClick={() => setLevel(l)}>{l}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="vr-talk-x">
          <button type="button" className="btn ghost small" onClick={() => { stopKk(); setMsgs([]); ask([]); }} disabled={busy}><Icon name="refresh" size={16} /> <span className="vr-hide-s">{T.restart}</span></button>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={T.close}><Icon name="x" size={20} /></button>
        </div>
      </header>

      <div className="vr-talk-list" ref={listRef} aria-live="polite">
        {msgs.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="vr-msg me"><p lang="kk">{m.text}</p></div>
          ) : (
            <div key={i} className="vr-msg npc">
              <span className="vr-msg-av"><VrFace art={art} npc={npc} size={40} /></span>
              <div className="vr-msg-b">
                {split(m.text).map((l, k) =>
                  FIX.test(l) ? (
                    <p key={k} className="vr-fix">
                      <span className="vr-fix-l"><ShellGlyph name="nib" size={15} /> {T.fix}</span>
                      <span>{l.replace(FIX, "")}</span>
                    </p>
                  ) : (
                    <p key={k} lang="kk">{l}</p>
                  )
                )}
                <button type="button" className="vr-tool sm" onClick={() => say(spoken(m.text))} aria-label={T.replay} title={T.replay}><Icon name="volume" size={16} /></button>
              </div>
            </div>
          )
        )}
        {busy && (
          <div className="vr-msg npc">
            <span className="vr-msg-av"><VrFace art={art} npc={npc} size={40} /></span>
            <div className="vr-msg-b vr-typing" aria-label={`${npc.name} ${T.typing}`}><i /><i /><i /></div>
          </div>
        )}
        {err && (
          <p className="vr-err" role="alert">
            {err} <button type="button" className="btn ghost small" onClick={() => ask(msgs)}>{t.retry}</button>
          </p>
        )}
      </div>

      <form className={`vr-compose ${rec === "rec" ? "is-rec" : ""}`} onSubmit={(e) => { e.preventDefault(); send(); }}>
        {micOk && (
          <button type="button" className={`vr-mic sq ${rec === "rec" ? "on" : ""}`} onClick={mic} disabled={busy || rec === "busy"} aria-pressed={rec === "rec"} aria-label={rec === "rec" ? T.listening : T.voice} title={T.voice}>
            <Icon name={rec === "rec" ? "stop" : "mic"} size={20} />
          </button>
        )}
        <textarea
          rows={1}
          lang="kk"
          value={text}
          maxLength={600}
          placeholder={rec === "busy" ? T.recog : T.freePh}
          aria-label={T.freePh}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
        />
        <button className="btn primary vr-send" disabled={busy || !text.trim()} aria-label={T.send}><Icon name="send" size={20} className="vr-flip" /></button>
      </form>
    </section>
  );
}
