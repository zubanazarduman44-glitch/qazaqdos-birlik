"use client";
// Қауіпті әрекетті растау терезесі (window.confirm орнына): нақты не болатынын айтады, «Болдырмау» — әдепкі фокус.
// Esc және фонды басу — болдырмау. Сынып пен әкімші беттері ортақ қолданады.
import { useEffect, useRef } from "react";

export default function ClassConfirm({ open, title, text, name, okLabel, cancelLabel, onOk, onCancel, prefix = "cl" }) {
  const cancelRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    cancelRef.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); prev?.focus?.(); };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!open) return null;
  return (
    <div className={`${prefix}-modal`} onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className={`${prefix}-dialog`} role="alertdialog" aria-modal="true" aria-labelledby={`${prefix}-dlg-t`} aria-describedby={`${prefix}-dlg-p`}>
        <span className={`${prefix}-dialog-ic`} aria-hidden="true">
          <svg viewBox="0 0 48 48" width="48" height="48">
            <rect x="1" y="1" width="46" height="46" rx="14" fill="#F3E3E6" />
            <path d="M24 12l13 23H11z" fill="none" stroke="#6E1E2E" strokeWidth="2.6" strokeLinejoin="round" />
            <path d="M24 21v6" stroke="#6E1E2E" strokeWidth="2.8" strokeLinecap="round" />
            <circle cx="24" cy="31" r="1.7" fill="#6E1E2E" />
          </svg>
        </span>
        <h2 id={`${prefix}-dlg-t`} className={`${prefix}-dialog-t`}>{title}</h2>
        {name && <p className={`${prefix}-dialog-name`} dir="auto">«{name}»</p>}
        <p id={`${prefix}-dlg-p`} className={`${prefix}-dialog-p`}>{text}</p>
        <div className={`${prefix}-dialog-row`}>
          <button ref={cancelRef} type="button" className="btn ghost" onClick={onCancel}>{cancelLabel}</button>
          <button type="button" className={`btn ${prefix}-danger`} onClick={onOk}>{okLabel}</button>
        </div>
      </div>
    </div>
  );
}
