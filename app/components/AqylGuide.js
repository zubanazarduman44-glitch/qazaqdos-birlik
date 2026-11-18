"use client";
// Басты беттегі Aqyl кеңесі: оқушының күйіне қарап «келесі не істейміз?» дегенді айтады.
// Ретпен: деңгей тесті → ошақ сөнгелі тұр → қате сөздерді қайталау → бүгінгі сабақ → мақсатқа аз қалды → VR Әлем / чат.
import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { AqylSays } from "./Aqyl";
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
 */
export default function AqylGuide({ state, lang, today, todayXp = 0, goal = 50, next, nextTitle, hour = 12 }) {
  const L = useAqylL(lang).guide;
  const [weak, setWeak] = useState(null);
  useEffect(() => { setWeak(readWeak()); }, []);

  let g;
  if (!state.cefr) g = { mood: "wow", txt: L.level, href: "/app/level", icon: "chart" };
  else if (today && state.streak > 0 && state.lastDay !== today && hour >= 17) g = { mood: "support", txt: L.streak(state.streak), href: next ? `/app/course?l=${next.id}` : "/app/course", icon: "flame" };
  else if (weak && todayXp < goal) g = { mood: "explaining", txt: L.weak(weak.length), href: "/app/sozdik", icon: "refresh" };
  else if (todayXp === 0 && next) g = { mood: "talking", txt: L.start(nextTitle || ""), href: `/app/course?l=${next.id}`, icon: "book" };
  else if (todayXp > 0 && todayXp < goal) g = { mood: "happy", txt: L.more(goal - todayXp), href: next ? `/app/course?l=${next.id}` : "/app/games", icon: "right" };
  else if (todayXp >= goal && !Object.keys(state.vr?.done || {}).length) g = { mood: "cheer", txt: L.vr, href: "/app/vr", icon: "globe" };
  else g = { mood: todayXp >= goal ? "cheer" : "idle", txt: L.chat, href: "/app/qyran", icon: "chat" };

  const [say, cta] = g.txt;
  // Гидрацияға дейін (today = null) кеңес белгісіз: орын бос қалмас үшін қаңқа (skeleton) көрсетеміз, сілтеме басылмайды
  const wait = !today;
  return (
    <section className={`aq-guide${wait ? " is-wait" : ""}`} aria-label={L.kicker} aria-busy={wait || undefined}>
      <AqylSays mood={wait ? "idle" : g.mood} size={84} title={L.kicker} tone="paper">
        <p className="aq-guide-say">{wait ? <><i className="aq-sk" /><i className="aq-sk aq-sk-2" /></> : say}</p>
      </AqylSays>
      <Link href={g.href} className="btn ghost big aq-guide-go" tabIndex={wait ? -1 : undefined} aria-hidden={wait || undefined}>
        <Icon name={g.icon} size={18} /> {cta} {g.icon !== "right" && <Icon name="right" size={18} className="aq-guide-arrow" />}
      </Link>
    </section>
  );
}
