"use client";
import Link from "next/link";
import { useMemo } from "react";
import { DAILY_GOAL, dayKey, localDayIndex, useApp } from "../components/Store";
import Alash from "../components/Alash";
import Icon from "../components/Icon";
import { REGIONS } from "../../lib/regions";
import { WORDS, tr } from "../../lib/words";
import { L } from "../../lib/i18n";
import { photoUrl } from "../../lib/photo";

function Ring({ value, max }) {
  const pct = Math.min(1, value / max);
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <svg className="ring" viewBox="0 0 100 100" width="104" height="104" aria-hidden="true">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--line)" strokeWidth="10" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="url(#ringG)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${c * pct} ${c}`}
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dasharray .8s cubic-bezier(.2,.8,.2,1)" }}
      />
      <defs>
        <linearGradient id="ringG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe07a" />
          <stop offset="1" stopColor="#f2a900" />
        </linearGradient>
      </defs>
      <text x="50" y="47" textAnchor="middle" fontSize="20" fontWeight="800" fill="currentColor">
        {Math.min(value, max)}
      </text>
      <text x="50" y="64" textAnchor="middle" fontSize="11" fill="currentColor" opacity=".6">
        / {max} XP
      </text>
    </svg>
  );
}

export default function Home() {
  const { t, lang, explain, state, saveWord, award, update } = useApp();
  const today = dayKey();
  const todayXp = state.today?.date === today ? state.today.xp : 0;
  const stampCount = Object.keys(state.stamps || {}).length;
  const next = REGIONS.find((r) => !state.stamps?.[r.id]);
  const dayIdx = localDayIndex();
  const word = WORDS[dayIdx % WORDS.length];
  const tip = t.alashTip[dayIdx % t.alashTip.length];
  const savedToday = state.vocab?.some((v) => v.kk === word.kk);
  const mood = todayXp >= DAILY_GOAL ? "cheer" : todayXp > 0 ? "happy" : "idle";

  const quick = useMemo(
    () => [
      { href: "/app/history", e: "🏺", t: t.nav.history },
      { href: "/app/games", e: "🎯", t: t.nav.games },
      { href: "/app/alash", e: "💬", t: t.navLong.chat },
      { href: "/app/vision", e: "📷", t: t.navLong.vision },
      { href: "/app/writing", e: "✍️", t: t.navLong.writing },
    ],
    [t]
  );

  return (
    <div className="home">
      <section className="card home-hero rise">
        <div className="hh-text">
          <h1>{t.hello(state.profile.name || "Дос")}</h1>
          <p className="muted">{t.helloSub}</p>
          <div className="bubble hh-bubble">{tip}</div>
        </div>
        <div className="hh-art">
          <Alash mood={mood} size={150} />
        </div>
        <div className="hh-goal">
          <Ring value={todayXp} max={DAILY_GOAL} />
          <span className="muted small">{t.todayGoal}</span>
        </div>
      </section>

      <div className="grid g4 home-stats">
        {[
          { e: "⭐", v: state.xp || 0, l: t.statsXp },
          { e: "🪙", v: state.coins || 0, l: t.statsCoins },
          { e: "🔥", v: state.streak || 0, l: t.statsStreak },
          { e: "🛂", v: `${stampCount}/${REGIONS.length}`, l: t.statsStamps },
        ].map((s, i) => (
          <div key={s.l} className="card tight stat rise" style={{ animationDelay: `${0.05 * i}s` }}>
            <span className="stat-e">{s.e}</span>
            <b>{s.v}</b>
            <small className="muted">{s.l}</small>
          </div>
        ))}
      </div>

      <div className="grid g2 home-main">
        {next ? (
          <Link href={`/app/travel?r=${next.id}`} className="card hover next-card">
            {next.photo ? (
              <img src={photoUrl(next.photo, 900, 600)} alt="" />
            ) : (
              <span className="next-emoji" aria-hidden="true">
                {next.e}
              </span>
            )}
            <span className="next-body">
              <span className="badge">{t.nextStep}</span>
              <h2>{t.nextTravel(L(next.name, lang))}</h2>
              <span className="muted">{t.nextTravelSub}</span>
              <span className="btn gold">
                {t.start} <Icon name="right" size={18} />
              </span>
            </span>
          </Link>
        ) : (
          <Link href="/app/games" className="card hover next-card">
            <span className="next-emoji">🏆</span>
            <span className="next-body">
              <h2>{t.allStamps}</h2>
              <span className="btn gold">
                {t.nav.games} <Icon name="right" size={18} />
              </span>
            </span>
          </Link>
        )}

        <div className="card wod">
          <span className="badge">{t.wordOfDay}</span>
          <div className="wod-word">
            <span className="wod-e">{word.e}</span>
            <div>
              <b>{word.kk}</b>
              <span className="muted">{tr(word, explain)}</span>
            </div>
          </div>
          <button
            className="btn ghost small"
            disabled={savedToday}
            onClick={() => {
              saveWord({ kk: word.kk, tr: tr(word, explain), e: word.e, src: "day" });
              award(2, 1);
            }}
          >
            <Icon name={savedToday ? "check" : "plus"} size={16} /> {savedToday ? t.saved : t.saveWord}
          </button>
          {state.vocab?.length > 0 && (
            <div className="vocab-mini">
              {state.vocab.slice(0, 8).map((v) => (
                <span key={v.kk} className="chip" title={v.tr}>
                  {v.e} {v.kk}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <h3 className="sec-title">{t.quick}</h3>
      <div className="quick">
        {quick.map((q) => (
          <Link key={q.href} href={q.href} className="card hover quick-card">
            <span className="quick-e">{q.e}</span>
            <b>{q.t}</b>
          </Link>
        ))}
      </div>
    </div>
  );
}
