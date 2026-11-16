"use client";
// Aqyl — бренд мұғалім-кейіпкер. Бір ғана бейне (Qyran.js) барлық жерде: сабақта, тестте, басты бетте, чатта.
// Семантикалық қалыптар: idle · thinking · talking · happy · explaining (+ cheer, support, wow).
import { useEffect, useState } from "react";
import Qyran from "./Qyran";

const MOOD = { idle: "idle", thinking: "think", talking: "talk", happy: "happy", explaining: "explain", cheer: "cheer", support: "support", wow: "wow" };
export const aqylMood = (m) => MOOD[m] || m || "idle";

/** Aqyl + қағаз «сөз бұлты». tone: paper | ok | bad | gold */
export function AqylSays({ mood = "idle", size = 64, tone = "paper", title, children, actions, className = "", live = false, id }) {
  return (
    <div className={`aq-says tone-${tone} ${className}`} id={id} role={live ? "status" : undefined} aria-live={live ? "polite" : undefined}>
      <span className="aq-says-av" aria-hidden="true">
        <Qyran mood={aqylMood(mood)} size={size} />
      </span>
      <div className="aq-says-b">
        {title && <b className="aq-says-t">{title}</b>}
        {children}
        {actions && <div className="aq-says-acts">{actions}</div>}
      </div>
    </div>
  );
}

/**
 * Мақтау сәті: экран бұрышында Aqyl қысқа уақыт пайда болады (бөгемейді, өзі жоғалады).
 * cue — өзгерген сайын қайта көрсетеді (мысалы, санауыш). text — мақтау, badge — «+15 XP» сияқты.
 */
export function AqylPraise({ cue, text, badge, mood = "cheer", ms = 2800 }) {
  const [shown, setShown] = useState(null);
  useEffect(() => {
    if (!cue || !text) return undefined;
    setShown({ text, badge, mood, k: cue });
    const t = setTimeout(() => setShown(null), ms);
    return () => clearTimeout(t);
  }, [cue]); // eslint-disable-line
  return (
    <div className="aq-praise-slot" role="status" aria-live="polite">
      {shown && (
        <div className="aq-praise" key={shown.k}>
          <span className="aq-praise-av" aria-hidden="true">
            <Qyran mood={aqylMood(shown.mood)} size={58} />
          </span>
          <span className="aq-praise-t">
            {shown.text}
            {shown.badge && <b className="aq-praise-badge">{shown.badge}</b>}
          </span>
        </div>
      )}
    </div>
  );
}

/** Басқа беттер үшін: window оқиғасы арқылы мақтау сәтін шақыру (тыңдаушы — AqylPraiseHost). */
export function aqylPraise(detail) {
  try {
    window.dispatchEvent(new CustomEvent("aqyl:praise", { detail }));
  } catch {}
}
export function AqylPraiseHost() {
  const [p, setP] = useState({ cue: 0 });
  useEffect(() => {
    const on = (e) => setP((x) => ({ cue: x.cue + 1, ...(e.detail || {}) }));
    window.addEventListener("aqyl:praise", on);
    return () => window.removeEventListener("aqyl:praise", on);
  }, []);
  return <AqylPraise cue={p.cue} text={p.text} badge={p.badge} mood={p.mood} />;
}
