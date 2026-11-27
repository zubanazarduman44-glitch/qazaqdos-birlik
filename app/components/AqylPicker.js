"use client";
// Aqyl бейнесін таңдау: әңгімеші қыз / әңгімеші жігіт. Бір чат, бір тарих — тек сурет ауысады.
// AqylChoice — екі портреттен тұратын радиотоп (профильде тұрақты, чатта қалқымалы терезеде).
// AqylLookButton — чат тақырыбындағы ықшам «Ақылдың бейнесі» батырмасы + қалқымалы терезе.
import { useEffect, useId, useRef, useState } from "react";
import { useApp } from "./Store";
import { AqylAvatar } from "./Qyran";
import { AQYL_IDS, aqylId, aqylL } from "../../lib/aqyl";

export function AqylChoice({ onPicked, autoFocus = false, size = 72 }) {
  const { state, setProfile } = useApp();
  const L = aqylL(state.profile.ui || "kk");
  const cur = aqylId(state.profile.aqyl);
  const refs = useRef({});
  useEffect(() => {
    if (autoFocus) refs.current[cur]?.focus();
  }, [autoFocus]); // eslint-disable-line
  const pick = (id) => {
    if (id !== cur) setProfile({ aqyl: id });
    onPicked?.(id);
  };
  const onKey = (e, id) => {
    const i = AQYL_IDS.indexOf(id);
    let n = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = AQYL_IDS[(i + 1) % AQYL_IDS.length];
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = AQYL_IDS[(i + AQYL_IDS.length - 1) % AQYL_IDS.length];
    if (n) {
      e.preventDefault();
      setProfile({ aqyl: n });
      refs.current[n]?.focus();
    }
  };
  return (
    <div className="aqp-opts" role="radiogroup" aria-label={L.look}>
      {AQYL_IDS.map((id) => {
        const on = id === cur;
        return (
          <button
            key={id}
            ref={(el) => { refs.current[id] = el; }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            className={`aqp-opt ${on ? "on" : ""}`}
            onClick={() => pick(id)}
            onKeyDown={(e) => onKey(e, id)}
          >
            <span className="aqp-pic">
              <AqylAvatar char={id} size={size} />
              <span className="aqp-check" aria-hidden="true">
                <svg viewBox="0 0 20 20" width="14" height="14"><path d="M4.5 10.5 8.2 14 15.5 6.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </span>
            <span className="aqp-cap">{L[id]}</span>
          </button>
        );
      })}
    </div>
  );
}

export function AqylLookButton({ className = "" }) {
  const { state } = useApp();
  const L = aqylL(state.profile.ui || "kk");
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const btn = useRef(null);
  const pid = useId();
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div className={`aqp ${className}`} ref={wrap}>
      <button
        ref={btn}
        type="button"
        className="aqp-btn"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? pid : undefined}
        title={L.look}
        onClick={() => setOpen((v) => !v)}
      >
        <AqylAvatar size={26} />
        <span className="aqp-btn-t">{L.look}</span>
      </button>
      {open && (
        <div className="aqp-pop" id={pid} role="dialog" aria-label={L.look}>
          <b className="aqp-title">{L.look}</b>
          <AqylChoice autoFocus onPicked={() => { setOpen(false); btn.current?.focus(); }} />
        </div>
      )}
    </div>
  );
}
