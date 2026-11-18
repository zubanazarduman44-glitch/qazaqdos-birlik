"use client";
// Басты беттегі Aqyl кеңесі: оқушының күйіне қарап «келесі не істейміз?» дегенді айтады.
// Ретпен: деңгей тесті → ошақ сөнгелі тұр → қате сөздерді қайталау → бүгінгі сабақ → мақсатқа аз қалды → VR Әлем / чат.
import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { AqylSays, aqylMood } from "./Aqyl";
import Qyran from "./Qyran";
import { aqylL, useAqylL } from "./AqylL10n";

function readWeak() {
  try {
    const w = JSON.parse(localStorage.getItem("qd_aqyl_weak") || "null");
    // 3 күннен ескі емес, кемі 2 сөз
    if (w && Array.isArray(w.words) && w.words.length >= 2 && Date.now() - (w.at || 0) < 3 * 86_400_000) return w.words;
  } catch {}
  return null;
}

/**
 * props: state, lang, today (dayKey немесе null — гидрацияға дейін), todayXp, goal, next (келесі сабақ), nextTitle, hour
 * variant="panel" — басты беттің оң жақ панелі: Aqyl көңіл-күйі + кеңес; әрекеті миссия батырмасымен бірдей болса
 *   (missionHref), қайталанбайды. Оның орнына тілдің бір нақты сыры (күн сайын ауысады) және қосымша сілтемелер (links).
 */
const TIPS = ["hard", "soft", "q", "polite", "neg", "verb", "verbLast"];
export default function AqylGuide({ state, lang, today, todayXp = 0, goal = 50, next, nextTitle, hour = 12, variant, missionHref, tipLabel, dayIdx = 0, links }) {
  const A = useAqylL(lang);
  const L = A.guide;
  const [weak, setWeak] = useState(null);
  useEffect(() => { setWeak(readWeak()); }, []);

  let g;
  if (!state.cefr) g = { mood: "wow", txt: L.level, href: "/app/level", icon: "chart" };
  else if (today && state.streak > 0 && state.lastDay !== today && hour >= 17) g = { mood: "sleepy", txt: L.streak(state.streak), href: next ? `/app/course?l=${next.id}` : "/app/course", icon: "flame" };
  else if (weak && todayXp < goal) g = { mood: "explaining", txt: L.weak(weak.length), href: "/app/sozdik", icon: "refresh" };
  else if (todayXp === 0 && next) g = { mood: "talking", txt: L.start(nextTitle || ""), href: `/app/course?l=${next.id}`, icon: "book" };
  else if (todayXp > 0 && todayXp < goal) g = { mood: "happy", txt: L.more(goal - todayXp), href: next ? `/app/course?l=${next.id}` : "/app/games", icon: "right" };
  else if (todayXp >= goal && !Object.keys(state.vr?.done || {}).length) g = { mood: "proud", txt: L.vr, href: "/app/vr", icon: "globe" };
  else g = { mood: todayXp >= goal ? "celebrate" : "idle", txt: L.chat, href: "/app/qyran", icon: "chat" };

  const [say, cta] = g.txt;
  if (variant === "panel") {
    const dup = g.href === missionHref;
    const tip = A[TIPS[dayIdx % TIPS.length]];
    return (
      <section className="aq-panel" aria-label={L.kicker} style={today ? undefined : { visibility: "hidden" }}>
        <div className="aq-panel-top">
          <span className="aq-panel-av" aria-hidden="true"><Qyran mood={aqylMood(g.mood)} size={96} /></span>
          <div className="aq-panel-say">
            <b className="aq-panel-k">{L.kicker}</b>
            <p>{say}</p>
          </div>
        </div>
        {!dup && (
          <Link href={g.href} className="btn gold aq-panel-go">
            <Icon name={g.icon} size={18} /> {cta} <Icon name="right" size={16} className="aq-guide-arrow" />
          </Link>
        )}
        {tip && (
          <p className="aq-panel-tip">
            <b>{tipLabel}</b> {tip}
          </p>
        )}
        {links?.length > 0 && (
          <nav className="aq-panel-links">
            {links.map((l) => (
              <Link key={l.href} href={l.href}><Icon name={l.icon} size={16} /> {l.t}</Link>
            ))}
          </nav>
        )}
      </section>
    );
  }
  return (
    <section className="aq-guide" aria-label={L.kicker} style={today ? undefined : { visibility: "hidden" }}>
      <AqylSays mood={g.mood} size={84} title={L.kicker} tone="paper">
        <p className="aq-guide-say">{say}</p>
      </AqylSays>
      <Link href={g.href} className="btn primary big aq-guide-go">
        <Icon name={g.icon} size={18} /> {cta} <Icon name="right" size={18} className="aq-guide-arrow" />
      </Link>
    </section>
  );
}
