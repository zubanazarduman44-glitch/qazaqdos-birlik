"use client";
import { useEffect, useRef, useState } from "react";
import { useApp } from "./Store";
import { EXPLAIN_LANGS } from "../../lib/i18n";
import { tx } from "../../lib/tx";

// Қазақ тілін қай тілмен үйренемін: оң жақ үстіндегі таңдау
export default function LangPicker() {
  const { explain, setProfile, lang } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const cur = EXPLAIN_LANGS.find((l) => l.id === explain) || EXPLAIN_LANGS[0];
  const x = tx(lang);
  useEffect(() => {
    const f = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("click", f);
    return () => document.removeEventListener("click", f);
  }, []);
  return (
    <div className="lang-pick" ref={ref} data-notap>
      <button className="lp-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open} title={x.lpTitle}>
        <span>{cur.flag}</span>
        <b>{cur.name}</b>
        <i>▾</i>
      </button>
      {open && (
        <div className="lp-menu rise">
          <small>{x.lpTitle}</small>
          {EXPLAIN_LANGS.map((l) => (
            <button key={l.id} className={l.id === explain ? "on" : ""} onClick={() => { setProfile({ explain: l.id }); setOpen(false); }}>
              <span>{l.flag}</span> {l.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
