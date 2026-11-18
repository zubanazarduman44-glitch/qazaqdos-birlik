"use client";
// Басты бет (/app) — «Бүгін не үйренемін?» деген сұраққа бір қарағанда жауап береді.
// 1) Бүгінгі оқу миссиясы (келесі сабақ + бір басты батырма, бүгінгі мақсат пен ошақ ықшам)
// 2) Көш картасы — курс прогресі Қазақстан өңірлері бойымен (KoshMap, жалқау жүктеледі)  ·  Aqyl панелі
// 3) Соңғы сабақ · Менің жолым (деңгей, сөз, сабақ) · Таңбалар
import "../home.css";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { DAILY_GOAL, dayKey, useApp } from "../components/Store";
import { useClientDate, localDayIndexOf } from "../../lib/useClientDate";
import { useAnimGate } from "../components/AnimGate";
import Icon from "../components/Icon";
import Avatar from "../components/Avatar";
import AqylGuide from "../components/AqylGuide";
import { HomeTanba } from "../components/HomeTanba";
import { useHomeL } from "../components/HomeL10n";
import { koshRegions, regionName } from "../components/KoshRoute";
import { ALL_LESSONS, LEVELS, UNITS, lessonById, lessonTitle, levelOfTopic, levelStats } from "../../lib/courseIndex";

const KoshMap = dynamic(() => import("../components/KoshMap"), { ssr: false, loading: () => <div className="km km-ph" aria-busy="true" /> });

const LESSON_XP = 15; // курс сабағын алғаш өткенде (app/app/course/page.js: award(15, 8))
const BADGES = ["first", "stamp1", "streak7", "words50", "stamp5", "a1", "a2", "kosh"];

function TodayRing({ v, max }) {
  const p = Math.min(1, v / max), C = 2 * Math.PI * 22;
  return (
    <svg className="hm-ring" viewBox="0 0 52 52" width="52" height="52" aria-hidden="true">
      <circle cx="26" cy="26" r="22" className="hm-ring-bg" />
      <circle cx="26" cy="26" r="22" className="hm-ring-fg" strokeDasharray={`${C * p} ${C}`} transform="rotate(-90 26 26)" />
    </svg>
  );
}

export default function Home() {
  const { t, lang, state, update, toast } = useApp();
  const H = useHomeL(lang);
  const gMap = useAnimGate();
  const now = useClientDate();
  const today = now ? dayKey(now) : null;
  const isToday = !!today && state.today?.date === today;
  const todayXp = isToday ? state.today.xp || 0 : 0;

  const done = state.course?.done || {};
  const regions = useMemo(() => koshRegions(done), [done]);
  const next = ALL_LESSONS.find((l) => !done[l.id]);
  const unit = next && UNITS[next.topic];
  const lev = next && levelOfTopic(next.topic);
  const curR = regions.find((r) => r.state === "cur");
  const doneCount = ALL_LESSONS.filter((l) => done[l.id]).length;
  const stampsN = regions.filter((r) => r.state === "done").length;
  const learned = Object.keys(state.sozdik?.learned || {}).length;
  const missionHref = next ? `/app/course?l=${next.id}` : "/app/sozdik";

  const lastId = Object.entries(done).filter(([, d]) => d?.at).sort((a, b) => b[1].at - a[1].at)[0]?.[0];
  const last = lastId && lessonById(lastId);

  // Күндік тапсырмалар сыйлығы (бұрынғы «Төр» тапсырмаларымен бірдей шарт): 30 XP · 1 сабақ · 3 жаттығу
  const lessonsToday = today ? Object.values(done).filter((d) => d?.at && dayKey(new Date(d.at)) === today).length : 0;
  const questsDone = isToday && todayXp >= 30 && lessonsToday >= 1 && (state.today.tasks || 0) >= 3;
  const claimed = !!today && state.quests?.date === today && state.quests.claimed;
  const claim = () => { update((s) => ({ ...s, coins: (s.coins || 0) + 15, quests: { date: today, claimed: true } })); toast(`+15 ${t.coins}`); };

  const lvDone = (id) => { const v = LEVELS.find((x) => x.id === id); const s = v && levelStats(v, done); return !!s && s.total > 0 && s.done >= s.total; };
  const earned = {
    first: doneCount > 0, stamp1: stampsN >= 1, streak7: (state.streak || 0) >= 7, words50: learned >= 50,
    stamp5: stampsN >= 5, a1: lvDone("A1"), a2: lvDone("A2"), kosh: stampsN >= regions.length,
  };
  const earnedN = BADGES.filter((b) => earned[b]).length;

  return (
    <div className="hm">
      {/* ── 1 · Бүгінгі оқу миссиясы ── */}
      <section className="hm-mission hm-in" style={{ "--i": 0 }} aria-labelledby="hm-mis-t">
        <header className="hm-greet">
          <Avatar value={state.profile.avatar} size={44} />
          <div>
            <h1>{t.hello(state.profile.name || "Дос")}</h1>
            <p>{H.tagline}</p>
          </div>
        </header>

        <div className="hm-mis">
          <span className="hm-kicker">{H.mission}</span>
          <p className="hm-ask">{H.ask}</p>
          {next ? (
            <>
              <h2 id="hm-mis-t" className="hm-mis-t">{lessonTitle(next, lang)}</h2>
              <ul className="hm-mis-meta">
                <li className="hm-lv">{lev?.id}</li>
                {curR && <li><Icon name="map" size={16} /> {regionName(curR.id, lang)}</li>}
                <li><Icon name="book" size={16} /> {next.kind === "phrases" ? H.phrases : H.words(5)}</li>
                <li>{H.min(5)}</li>
                <li><Icon name="star" size={16} /> +{LESSON_XP} XP</li>
              </ul>
              <div className="hm-mis-dots" aria-hidden="true">
                {unit.lessons.map((l) => <i key={l.id} className={done[l.id] ? "on" : l.id === next.id ? "cur" : ""} />)}
              </div>
            </>
          ) : (
            <h2 id="hm-mis-t" className="hm-mis-t hm-mis-all">{H.allDone}</h2>
          )}
          <Link href={missionHref} className="btn primary big hm-cta">
            {next ? H.start : H.review} <Icon name="right" size={20} className="hm-flip" />
          </Link>
        </div>

        <aside className="hm-today" style={today ? undefined : { visibility: "hidden" }}>
          <div className="hm-today-xp">
            <TodayRing v={todayXp} max={DAILY_GOAL} />
            <span><b>{Math.min(todayXp, DAILY_GOAL)}/{DAILY_GOAL} XP</b><small>{H.today}</small></span>
          </div>
          <div className={`hm-today-fire${state.lastDay === today ? " lit" : ""}`}>
            <span className="hm-fire-i"><Icon name="flame" size={20} /></span>
            <span><b>{state.streak || 0}</b><small>{t.statsStreak}</small></span>
          </div>
          {questsDone && !claimed && (
            <button type="button" className="btn gold small hm-claim" onClick={claim}>
              <Icon name="coin" size={16} /> {H.claim}
            </button>
          )}
        </aside>
      </section>

      {/* ── 2 · Көш картасы + Aqyl ── */}
      <div className="hm-mid">
        <section ref={gMap} className="hm-map hm-in" style={{ "--i": 2 }} aria-labelledby="hm-map-t">
          <header className="hm-map-h">
            <div>
              <h2 id="hm-map-t">{H.mapT}</h2>
              <p>{H.mapSub}</p>
            </div>
            <span className="hm-map-n"><Icon name="stamp" size={16} /> {H.regions(stampsN, regions.length)}</span>
          </header>
          <KoshMap regions={regions} lang={lang} L={H} />
        </section>

        <div className="hm-aq hm-in" style={{ "--i": 1 }}>
          <AqylGuide
            variant="panel"
            missionHref={missionHref}
            tipLabel={H.tipK}
            dayIdx={now ? localDayIndexOf(now) : 0}
            links={[{ href: "/app/sozdik", icon: "refresh", t: H.review }, { href: "/app/qyran", icon: "chat", t: H.askAqyl }]}
            state={state}
            lang={lang}
            today={today}
            todayXp={todayXp}
            goal={DAILY_GOAL}
            next={next}
            nextTitle={next ? lessonTitle(next, lang) : ""}
            hour={now ? now.getHours() : 12}
          />
        </div>
      </div>

      {/* ── 3 · Соңғы сабақ · жол · таңбалар ── */}
      <div className="hm-low">
        <section className="hm-card hm-last hm-in" style={{ "--i": 3 }}>
          <span className="hm-kicker">{H.last}</span>
          {last ? (
            <>
              <h3>{lessonTitle(last, lang)}</h3>
              <p className="hm-muted">{levelOfTopic(last.topic)?.id} · {H.score(done[last.id]?.score ?? 0)}</p>
              <Link href={`/app/course?l=${last.id}`} className="btn ghost hm-card-go">
                <Icon name="refresh" size={16} /> {H.repeat}
              </Link>
            </>
          ) : (
            <>
              <p className="hm-muted">{H.lastNone}</p>
              <Link href="/app/course" className="btn ghost hm-card-go">
                {t.nav.course} <Icon name="right" size={16} className="hm-flip" />
              </Link>
            </>
          )}
        </section>

        <section className="hm-card hm-prog hm-in" style={{ "--i": 4 }}>
          <span className="hm-kicker">{H.prog}</span>
          <dl className="hm-nums">
            <div><dt>{H.level}</dt><dd>{state.cefr || lev?.id || "B2"}</dd></div>
            <div><dt>{H.learned}</dt><dd>{learned}</dd></div>
            <div><dt>{H.lessonsDone}</dt><dd>{doneCount}<small>/{ALL_LESSONS.length}</small></dd></div>
          </dl>
          <ul className="hm-levels">
            {LEVELS.map((v) => {
              const s = levelStats(v, done);
              return (
                <li key={v.id} aria-label={`${v.id}: ${s.done}/${s.total}`}>
                  <span>{v.id}</span>
                  <i aria-hidden="true"><b style={{ transform: `scaleX(${s.total ? s.done / s.total : 0})` }} /></i>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="hm-card hm-badges hm-in" style={{ "--i": 5 }}>
          <span className="hm-kicker">{H.badges} <small>{earnedN}/{BADGES.length}</small></span>
          <ul>
            {BADGES.map((b) => (
              <li key={b} className={earned[b] ? "on" : ""}>
                <HomeTanba glyph={b} on={earned[b]} size={48} />
                <span>{H.b[b]}</span>
                {earned[b] && <span className="sr-only">· {H.earned}</span>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
