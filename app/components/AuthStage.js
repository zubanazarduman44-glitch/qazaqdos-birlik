"use client";
// Алғашқы жол (кіру · тіркелу · онбординг) сахнасы: сол жақта — қызыл киіз қабырға, логотип, мақал және Aqyl,
// оң жақта — мазмұн. Телефонда қабырға ықшам жолаққа айналады.
import Link from "next/link";
import Qyran from "./Qyran";
import QyzylMark from "./QyzylMark";
import Icon from "./Icon";
import { LangSeg } from "./Shell";
import { useApp } from "./Store";
import { authL, PROVERB } from "./AuthL10n";

// Қошқар мүйіз — қабырғадағы киіз ою
function Horn({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 120 70" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round">
        <path d="M60 64c0-26-20-38-36-27-12 9-6 27 9 23 10-3 10-15 1-16" />
        <path d="M60 64c0-26 20-38 36-27 12 9 6 27-9 23-10-3-10-15-1-16" />
      </g>
      <path d="M60 4 70 14 60 24 50 14Z" fill="currentColor" />
    </svg>
  );
}

export default function AuthStage({ mood = "happy", bubble, steps, step = 0, perks, children }) {
  const { lang } = useApp();
  const a = authL(lang);
  return (
    <div className={`au ${steps ? "au-steps" : ""}`}>
      <aside className="au-wall">
        <div className="au-wall-top">
          <Link href="/" className="au-logo" aria-label="Qyzyl til">
            <span className="au-logo-mark"><QyzylMark size={34} /></span>
            <span className="au-logo-word">Qyzyl <b>til</b></span>
          </Link>
          <LangSeg />
        </div>

        <div className="au-scene">
          <div className="au-disc">
            <Horn className="au-horn" />
            <Qyran mood={mood} size={176} className="au-aqyl" />
          </div>
          {bubble && <p className="au-bubble" key={bubble}>{bubble}</p>}
        </div>

        <figure className="au-prov">
          <blockquote lang="kk">«{PROVERB}»</blockquote>
          <figcaption>{a.provMean}</figcaption>
        </figure>

        {steps ? (
          <ol className="au-track" aria-label={a.stepOf(step + 1, steps.length)}>
            {steps.map((s, i) => (
              <li key={s} className={i < step ? "done" : i === step ? "now" : ""} aria-current={i === step ? "step" : undefined}>
                <i>{i < step ? <Icon name="check" size={14} stroke={3} /> : i + 1}</i>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        ) : (
          perks && (
            <ul className="au-perks">
              {perks.map((p) => (
                <li key={p}><i><Icon name="check" size={13} stroke={3} /></i>{p}</li>
              ))}
            </ul>
          )
        )}
      </aside>
      <section className="au-main">{children}</section>
    </div>
  );
}
