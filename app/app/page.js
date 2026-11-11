"use client";
import { tx } from "../../lib/tx";
import { PROVERBS, TRADITIONS } from "../../lib/culture";
import Link from "next/link";
import Tor from "../components/Tor";
import { useMemo } from "react";
import { DAILY_GOAL, dayKey, localDayIndex, useApp } from "../components/Store";
import Qyran from "../components/Qyran";
import Icon from "../components/Icon";
import Avatar from "../components/Avatar";
import { NatArt } from "../components/NatArt";
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
  const x0 = tx(lang);
  const dayN = Math.floor(Date.now() / 86400000);
  const PROV = PROVERBS[dayN % PROVERBS.length];
  const TRAD = TRADITIONS[dayN % TRADITIONS.length];
  const today = dayKey();
  const todayXp = state.today?.date === today ? state.today.xp : 0;
  const stampCount = Object.keys(state.stamps || {}).length;
  const next = REGIONS.find((r) => !state.stamps?.[r.id]);
  const dayIdx = localDayIndex();
  const word = WORDS[dayIdx % WORDS.length];
  const tip = t.qyranTip[dayIdx % t.qyranTip.length];
  const savedToday = state.vocab?.some((v) => v.kk === word.kk);
  const mood = todayXp >= DAILY_GOAL ? "cheer" : todayXp > 0 ? "happy" : "idle";

  const quick = useMemo(
    () => [
      { href: "/app/history", art: "bowl", e: "🏺", t: t.nav.history },
      { href: "/app/games", art: "kamshy", e: "🎯", t: t.nav.games },
      { href: "/app/qyran", art: "dombyra", e: "💬", t: t.navLong.chat },
      { href: "/app/tuzel", art: "taqiya", e: "✍️", t: t.navLong.tuzel },
    ],
    [t]
  );

  return (
    <div className="home">
      <section className="card home-hero scene rise">
        <svg className="hs-bg" viewBox="0 0 800 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
          <defs>
            <linearGradient id="hsSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#58c8dc" /><stop offset=".6" stopColor="#bfeaf0" /><stop offset="1" stopColor="#fff0c4" /></linearGradient>
            <linearGradient id="hsHill1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8cf7a" /><stop offset="1" stopColor="#9fb350" /></linearGradient>
            <linearGradient id="hsHill2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a8c25a" /><stop offset="1" stopColor="#6fa33a" /></linearGradient>
          </defs>
          <rect width="800" height="260" fill="url(#hsSky)" />
          <g className="hs-rays" transform="translate(650 70)">{Array.from({ length: 16 }).map((_, i) => <path key={i} d="M0 0 L-9 -150 L9 -150Z" fill="#fff6c8" opacity=".45" transform={`rotate(${i * 22.5})`} />)}</g>
          <circle className="hs-sun" cx="650" cy="70" r="36" fill="#ffd35a" stroke="#fff3b0" strokeWidth="6" />
          <g fill="#fff" opacity=".85"><ellipse className="hs-cloud c1" cx="150" cy="60" rx="46" ry="14" /><ellipse className="hs-cloud c1" cx="180" cy="50" rx="30" ry="12" /><ellipse className="hs-cloud c2" cx="430" cy="38" rx="40" ry="12" /><ellipse className="hs-cloud c2" cx="455" cy="30" rx="26" ry="10" /></g>
          <path d="M0 170 L90 96 L150 140 L240 70 L330 150 L400 110 L470 160 L800 160 V260 H0Z" fill="#8fa6c4" opacity=".55" />
          <path d="M240 70 L262 92 L246 88 L240 98 L230 88 L220 92Z" fill="#fff" opacity=".9" />
          <path d="M0 190 C120 160 260 190 400 176 C560 160 680 190 800 172 V260 H0Z" fill="url(#hsHill1)" />
          <path d="M0 220 C140 200 300 226 460 212 C600 200 700 222 800 210 V260 H0Z" fill="url(#hsHill2)" />
          <g transform="translate(120 196)"><path d="M-26 0 Q0 -40 26 0Z" fill="#fff8e6" stroke="#b8822a" strokeWidth="2" /><path d="M-8 0 V-14 Q0 -22 8 0Z" fill="#7a3a12" /><path d="M-24 -6 H24" stroke="#00afca" strokeWidth="3" /><path d="M0 -38 V-48" stroke="#b8322a" strokeWidth="2" /></g>
          <g transform="translate(205 206) scale(.7)"><path d="M-26 0 Q0 -40 26 0Z" fill="#fff8e6" stroke="#b8822a" strokeWidth="2" /><path d="M-8 0 V-14 Q0 -22 8 0Z" fill="#7a3a12" /><path d="M-24 -6 H24" stroke="#b8322a" strokeWidth="3" /></g>
          <g className="hs-herd" fill="#6b4220">{[0, 1, 2].map((i) => <g key={i} transform={`translate(${470 + i * 34} ${214 + (i % 2) * 6})`}><ellipse rx="9" ry="5" /><circle cx="9" cy="-3" r="3.4" /><path d="M-5 4 v6 M4 4 v6" stroke="#6b4220" strokeWidth="2" /></g>)}</g>
        </svg>
        <div className="hs-eagle" aria-hidden="true"><Qyran mood={mood} size={96} /></div>
        <div className="hh-text hs-text">
          <div className="hs-who"><Avatar value={state.profile.avatar} size={54} /><h1>{t.hello(state.profile.name || "Дос")}</h1></div>
          <p>{t.helloSub}</p>
          <div className="bubble hh-bubble">{tip}</div>
        </div>
        <div className="hh-goal hs-goal">
          <Ring value={todayXp} max={DAILY_GOAL} />
          <span className="small">{t.todayGoal}</span>
        </div>
      </section>
      <Tor />
      {!state.cefr && (
        <Link href="/app/level" className="card hover lv-banner rise">
          <Qyran mood="wow" size={56} />
          <b>{tx(lang).lvlBanner}</b>
          <Icon name="right" size={18} />
        </Link>
      )}

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

      <div className="culture">
        <article className="card proverb">
          <span className="badge">{x0.proverb}</span>
          <blockquote>{PROV.kk}</blockquote>
          <p className="muted">{lang === "kk" ? (explain === "ru" ? PROV.ru : PROV.en) : lang === "ru" ? PROV.ru : PROV.en}</p>
        </article>
        <article className="card tradition">
          <span className="trad-e">{TRAD.e}</span>
          <div>
            <span className="badge">{x0.tradition}</span>
            <h4>{L(TRAD.t, lang)}</h4>
            <p>{L(TRAD.d, lang)}</p>
          </div>
        </article>
      </div>

      <h3 className="sec-title">{t.quick}</h3>
      <div className="quick">
        {quick.map((q) => (
          <Link key={q.href} href={q.href} className="card hover quick-card">
            <span className="quick-e"><NatArt name={q.art} size={64} /></span>
            <b>{q.t}</b>
          </Link>
        ))}
      </div>
    </div>
  );
}
