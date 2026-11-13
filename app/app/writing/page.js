"use client";
import "../../tuzel.css";
import { useState } from "react";
import { NatEmpty } from "../../components/NatArt";
import { useApp } from "../../components/Store";
import Qyran from "../../components/Qyran";
import Icon from "../../components/Icon";
import TuzelWriteResult from "../../components/TuzelWriteResult";
import { TuzelSay } from "../../components/TuzelKit";

const LEVELS = ["A1", "A2", "B1", "B2", "C1"];

export default function Writing() {
  const { t, lang, explain, award } = useApp();
  const [text, setText] = useState("");
  const [level, setLevel] = useState("A1");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(""); // тексерілген мәтін (нәтиже соған салыстырылады)

  async function check() {
    if (!text.trim() || busy) return;
    setBusy(true);
    setErr("");
    setRes(null);
    setSent(text);
    try {
      const r = await fetch("/api/writing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, level, explain }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
      setRes(d);
      award(5, 2);
    } catch (e) {
      setErr(e.message || t.errGeneric);
    } finally {
      setBusy(false);
    }
  }

  const fill = Math.min(1, text.length / 2000);
  return (
    <div className="writing tzw">
      <header className="tz-head">
        <span className="kicker">AI · {t.nav.writing}</span>
        <h1>{t.writingTitle}</h1>
      </header>

      <div className="tzw-desk">
        <section className="tzw-book" aria-label={t.writingTitle}>
          <div className="tzw-tabs" role="group" aria-label={t.yourLevel}>
            <span className="tzw-tabs-l">{t.yourLevel}</span>
            {LEVELS.map((l, i) => (
              <button key={l} type="button" className={`tzw-tab t${i} ${level === l ? "on" : ""}`} aria-pressed={level === l} onClick={() => setLevel(l)}>
                {l}
              </button>
            ))}
          </div>
          <div className="tzw-sheet">
            <label className="sr-only" htmlFor="tzw-text">{t.writingTitle}</label>
            <textarea id="tzw-text" dir="auto" lang="kk" className="tzw-area" value={text} onChange={(e) => setText(e.target.value)} placeholder={t.writingPh} maxLength={2000} rows={7} />
          </div>
          <div className="tzw-foot">
            <span className="tzw-count" aria-live="off">
              <span className="tzw-count-bar" aria-hidden="true"><i style={{ transform: `scaleX(${fill})` }} /></span>
              <span className="small">{text.length} / 2000</span>
            </span>
            <button type="button" className="tz-cta" onClick={check} disabled={busy || !text.trim()}>
              {busy ? <span className="tz-cta-bird"><Qyran mood="think" size={30} /></span> : <Icon name="sparkle" size={18} />} {t.improve}
            </button>
          </div>
          {err && (
            <p className="tz-alert" role="alert">
              <Icon name="x" size={16} /> {err}
            </p>
          )}
        </section>

        <aside className="tzw-aqyl">
          <TuzelSay mood={busy ? "think" : res ? (Number(res.score) >= 85 ? "cheer" : "happy") : "idle"} size={110} className="tzw-aqyl-say">
            {busy ? (
              <span className="tz-dots" aria-hidden="true"><i /><i /><i /></span>
            ) : (
              <p>{t.writingSub}</p>
            )}
          </TuzelSay>
        </aside>
      </div>

      {busy && (
        <div className="tzw-skel" aria-hidden="true">
          <i /><i /><i /><i />
          <span className="tzw-skel-pen"><Icon name="pen" size={22} /></span>
        </div>
      )}
      {!res && !busy && <NatEmpty art="taqiya" size={110} lang={lang} proverb />}
      {res && <TuzelWriteResult t={t} text={sent || text} res={res} />}
    </div>
  );
}
