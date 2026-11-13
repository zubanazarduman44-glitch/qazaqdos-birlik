"use client";
// «Түзел · Жазу» нәтижесі: тексерілген дәптер беті (сызылған қате → жасыл түзету),
// жиектегі ескертпелер (әр түзетудің себебі) және Aqyl мөрі (ұпай).
import { useMemo, useRef, useState } from "react";
import Icon from "./Icon";
import { TuzelMeter, TuzelSay, diffWords, matchChanges, splitWord } from "./TuzelKit";

// Түзету мазмұны: бір сөз болса — тек өзгерген әріптер белгіленеді
function Fix({ p }) {
  const w = splitWord(p.del, p.ins);
  if (w)
    return (
      <>
        {w.pre && <span className="stem">{w.pre}</span>}
        {w.del && <del>{w.del}</del>}
        {w.ins && <ins>{w.ins}</ins>}
        {w.post && <span className="stem">{w.post}</span>}
      </>
    );
  return (
    <>
      {p.del && <del>{p.del}</del>}
      {p.del && p.ins && " "}
      {p.ins && <ins>{p.ins}</ins>}
    </>
  );
}

export default function TuzelWriteResult({ t, text, res }) {
  const score = Math.max(0, Math.min(100, Number(res?.score) || 0));
  const changes = Array.isArray(res?.changes) ? res.changes : [];
  const parts = useMemo(() => matchChanges(diffWords(text, res?.corrected || ""), changes), [text, res, changes]);
  const [act, setAct] = useState(-1);
  const notes = useRef([]);
  const mood = score >= 85 ? "cheer" : score >= 60 ? "happy" : "support";

  function pick(k, scroll) {
    if (k < 0) return;
    setAct(k);
    if (scroll) notes.current[k]?.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
  }

  return (
    <section className="tzw-out rise" aria-live="polite">
      <div className="tzw-verdict">
        <div className="tzw-seal">
          <TuzelMeter value={score} label="/100" size={132} />
          <Icon name="stamp" size={20} className="tzw-seal-ic" />
        </div>
        <TuzelSay mood={mood} size={84} tone={score >= 60 ? "ok" : ""}>
          {res?.praise ? <p className="tzw-praise">{res.praise}</p> : <p className="tzw-praise">{changes.length ? t.changes : t.noChanges}</p>}
        </TuzelSay>
      </div>

      <div className={`tzw-check ${changes.length ? "" : "clean"}`}>
        <article className="tzw-page" aria-labelledby="tzw-page-h">
          <header className="tzw-page-head">
            <h3 id="tzw-page-h">{t.corrected}</h3>
            {changes.length > 0 && (
              <span className="tzw-legend" aria-hidden="true">
                <span className="lg-del">{t.original}</span>
                <Icon name="right" size={14} className="tz-flip" />
                <span className="lg-ins">{t.corrected}</span>
              </span>
            )}
          </header>
          <p className="tzw-diff" dir="auto" lang="kk">
            {parts.map((p, i) =>
              p.t === "eq" ? (
                <span key={i}>{p.s}</span>
              ) : p.k >= 0 ? (
                <span key={i}>
                  <button type="button" className={`tzw-fix ${act === p.k ? "on" : ""}`} aria-pressed={act === p.k} onClick={() => pick(p.k, true)}>
                    <Fix p={p} />
                    <sup aria-hidden="true">{p.k + 1}</sup>
                  </button>
                  {p.tail}
                </span>
              ) : (
                <span key={i} className="tzw-fix plain">
                  <Fix p={p} />
                  {p.tail}
                </span>
              )
            )}
          </p>
          <details className="tzw-orig">
            <summary>
              <Icon name="pen" size={16} /> {t.original}
            </summary>
            <p dir="auto" lang="kk">{text}</p>
          </details>
        </article>

        <aside className="tzw-notes" aria-labelledby="tzw-notes-h">
          <h3 id="tzw-notes-h">
            <Icon name="book" size={18} /> {t.changes}
          </h3>
          {changes.length ? (
            <ol>
              {changes.map((c, i) => (
                <li key={i} ref={(el) => (notes.current[i] = el)} className={act === i ? "on" : ""}>
                  <button type="button" aria-pressed={act === i} onClick={() => pick(i, false)}>
                    <span className="tzw-n" aria-hidden="true">{i + 1}</span>
                    <span className="tzw-pair" dir="auto" lang="kk">
                      {c.from && <del>{c.from}</del>}
                      <Icon name="right" size={14} className="tz-flip" />
                      {c.to && <ins>{c.to}</ins>}
                    </span>
                  </button>
                  {c.why && <p className="tzw-why">{c.why}</p>}
                </li>
              ))}
            </ol>
          ) : (
            <p className="tzw-clean">
              <Icon name="check" size={18} /> {t.noChanges}
            </p>
          )}
        </aside>
      </div>

      {res?.tip && (
        <TuzelSay mood="idle" size={56} className="tzw-tip">
          <p>
            <b>{t.tip}: </b>
            {res.tip}
          </p>
        </TuzelSay>
      )}
    </section>
  );
}
