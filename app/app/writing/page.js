"use client";
import { useState } from "react";
import { useApp } from "../../components/Store";
import Alash from "../../components/Alash";
import Icon from "../../components/Icon";

const LEVELS = ["A1", "A2", "B1", "B2", "C1"];

export default function Writing() {
  const { t, explain, award } = useApp();
  const [text, setText] = useState("");
  const [level, setLevel] = useState("A1");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");

  async function check() {
    if (!text.trim() || busy) return;
    setBusy(true);
    setErr("");
    setRes(null);
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

  const score = Math.max(0, Math.min(100, Number(res?.score) || 0));
  return (
    <div className="writing">
      <header className="page-head">
        <div>
          <span className="kicker">AI · {t.nav.writing}</span>
          <h1>{t.writingTitle}</h1>
          <p>{t.writingSub}</p>
        </div>
      </header>

      <section className="card wr-in">
        <div className="wr-top">
          <span className="muted small">{t.yourLevel}</span>
          <div className="seg">
            {LEVELS.map((l) => (
              <button key={l} className={level === l ? "on" : ""} onClick={() => setLevel(l)}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <textarea className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder={t.writingPh} maxLength={2000} rows={6} />
        <div className="wr-actions">
          <span className="muted small">{text.length} / 2000</span>
          <button className="btn gold big" onClick={check} disabled={busy || !text.trim()}>
            {busy ? <Alash mood="think" size={28} /> : <Icon name="sparkle" size={18} />} {t.improve}
          </button>
        </div>
        {err && <p className="alert">{err}</p>}
      </section>

      {res && (
        <section className="card wr-out rise">
          <div className="wr-score">
            <Alash mood={score >= 85 ? "cheer" : score >= 60 ? "happy" : "support"} size={90} />
            <div>
              <b className="wr-num">{score}</b>
              <span className="muted">/100</span>
              <div className="bar">
                <i style={{ width: `${score}%` }} />
              </div>
              {res.praise && <p>{res.praise}</p>}
            </div>
          </div>
          <div className="grid g2">
            <div>
              <h3>{t.original}</h3>
              <p className="wr-text">{text}</p>
            </div>
            <div>
              <h3>{t.corrected}</h3>
              <p className="wr-text good">{res.corrected}</p>
            </div>
          </div>
          <h3>{t.changes}</h3>
          {res.changes?.length ? (
            <ul className="changes">
              {res.changes.map((c, i) => (
                <li key={i}>
                  <span className="del">{c.from}</span>
                  <Icon name="right" size={16} />
                  <span className="ins">{c.to}</span>
                  <small className="muted">{c.why}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className="alert ok">{t.noChanges}</p>
          )}
          {res.tip && (
            <div className="fact">
              <Alash mood="idle" size={44} />
              <p>
                <b>{t.tip}: </b>
                {res.tip}
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
