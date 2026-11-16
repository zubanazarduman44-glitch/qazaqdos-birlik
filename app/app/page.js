"use client";
import "../home.css";
import { tx } from "../../lib/tx";
import { PROVERBS, TRADITIONS } from "../../lib/culture";
import Link from "next/link";
import { useTor, TorLesson, TorHearth, TorQuests } from "../components/Tor";
import { useEffect, useMemo, useState } from "react";
import { DAILY_GOAL, dayKey, useApp } from "../components/Store";
import { useClientDate, utcDayIndex, localDayIndexOf } from "../../lib/useClientDate";
import Qyran from "../components/Qyran";
import Icon from "../components/Icon";
import Avatar from "../components/Avatar";
import TopicArt from "../components/TopicArt";
import { NatArt } from "../components/NatArt";
import { RegionScene } from "../components/SightArt";
import HomeYurt, { useDayPhase } from "../components/HomeArt";
import { useAnimGate } from "../components/AnimGate";
import { REGIONS } from "../../lib/regions";
import { tr } from "../../lib/wordTools";
import { L } from "../../lib/i18n";

// Дәстүр карточкасының суреті (TRADITIONS ретімен): киіз үй, қонақжайлылық, Наурыз, домбыра, бүркітші, тұсау кесу, көкпар, шапан
const TRAD_ART = [
  { nat: "yurt" }, { nat: "bowl" }, { topic: "tradition" }, { nat: "dombyra" },
  { eagle: true }, { topic: "family" }, { nat: "kamshy" }, { topic: "clothes" },
];
function TradArt({ i }) {
  const a = TRAD_ART[i] || { nat: "yurt" };
  if (a.eagle) return <Qyran mood="wow" size={92} />;
  if (a.topic) return <TopicArt topic={a.topic} size={92} />;
  return <NatArt name={a.nat} size={120} />;
}

// «Күн сөзі» жүктелгенше орын ұстайтын бейтарап сөз (көрінбейді)
const WORD0 = { t: "greet", kk: "Сәлеметсіз бе", ru: "Здравствуйте", en: "Hello" };

export default function Home() {
  const { t, lang, explain, state, saveWord, award } = useApp();
  const tor = useTor();
  // Экраннан тыс суреттердің анимациясы кідіреді (AnimGate)
  const gHero = useAnimGate(), gDay = useAnimGate(), gDisc = useAnimGate(), gCult = useAnimGate(), gQuick = useAnimGate();
  const phase = useDayPhase();
  const x0 = tx(lang);
  // Күнге тәуелді мазмұн: сервер мен гидрация рендерінде now = null → бейтарап (0-индекс, көрінбейді),
  // гидрациядан кейін нақты күн қойылады (бірдей өлшем, орын ығыспайды)
  const now = useClientDate();
  const hide = now ? undefined : { visibility: "hidden" };
  const dayN = now ? utcDayIndex(now) : 0;
  const PROV = PROVERBS[dayN % PROVERBS.length];
  const tradI = dayN % TRADITIONS.length;
  const TRAD = TRADITIONS[tradI];
  const today = now ? dayKey(now) : null;
  const todayXp = today && state.today?.date === today ? state.today.xp : 0;
  const stampCount = Object.keys(state.stamps || {}).length;
  const next = REGIONS.find((r) => !state.stamps?.[r.id]);
  const dayIdx = now ? localDayIndexOf(now) : 0;
  // Сөз қоры (~110 KB) — тек «күн сөзі» үшін: гидрациядан кейін бөлек жүктеледі (бастапқы JS жеңіл).
  // Жүктелгенше карточка орнын бейтарап көрінбейтін сөз ұстап тұрады.
  const [WORDS, setWords] = useState(null);
  useEffect(() => {
    let on = true;
    import("../../lib/words").then((m) => on && setWords(m.WORDS));
    return () => { on = false; };
  }, []);
  const word = WORDS ? WORDS[dayIdx % WORDS.length] : WORD0;
  const wodHide = now && WORDS ? undefined : { visibility: "hidden" };
  const tip = t.qyranTip[dayIdx % t.qyranTip.length];
  const savedToday = state.vocab?.some((v) => v.kk === word.kk);
  const mood = todayXp >= DAILY_GOAL ? "cheer" : todayXp > 0 ? "happy" : "idle";
  const goalTxt = t.todayGoalTxt ? t.todayGoalTxt(Math.min(todayXp, DAILY_GOAL), DAILY_GOAL) : `${Math.min(todayXp, DAILY_GOAL)} / ${DAILY_GOAL} XP`;

  const quick = useMemo(
    () => [
      { href: "/app/history", art: "bowl", t: t.nav.history },
      { href: "/app/games", art: "kamshy", t: t.nav.games },
      { href: "/app/qyran", art: "dombyra", t: t.navLong.chat },
      { href: "/app/tuzel", art: "taqiya", t: t.navLong.tuzel },
    ],
    [t]
  );

  const stats = [
    { i: "star", v: state.xp || 0, l: t.statsXp, c: "gold" },
    { i: "coin", v: state.coins || 0, l: t.statsCoins, c: "gold" },
    { i: "flame", v: state.streak || 0, l: t.statsStreak, c: "red" },
    { i: "stamp", v: `${stampCount}/${REGIONS.length}`, l: t.statsStamps, c: "blue" },
  ];

  return (
    <div className="hm">
      {/* ── 1 · Төр: сәлем, бүгінгі сабақ және киіз үйдің іші ── */}
      <section ref={gHero} className="hm-hero hm-in" style={{ "--i": 0 }}>
        <div className="hm-greet">
          <Avatar value={state.profile.avatar} size={48} />
          <div>
            <h1>{t.hello(state.profile.name || "Дос")}</h1>
            <p>{t.helloSub}</p>
          </div>
        </div>

        <div className={`hm-scene ph-${phase}`}>
          <HomeYurt phase={phase} xp={todayXp} goal={DAILY_GOAL} lit={tor.lit} streak={tor.streak} stamps={stampCount} stampTotal={REGIONS.length} />
          <div className="hm-goal">
            <span className="hm-goal-n">{goalTxt}</span>
            <span className="hm-goal-l">{t.todayGoal}</span>
            <span className="hm-goal-bar" aria-hidden="true"><i style={{ transform: `scaleX(${Math.min(1, todayXp / DAILY_GOAL)})` }} /></span>
          </div>
          <div className="hm-aqyl" aria-hidden="true"><Qyran mood={mood} size={120} /></div>
          <p className="hm-tip" style={hide}>{tip}</p>
        </div>

        <TorLesson tor={tor} />
      </section>

      {!state.cefr && (
        <Link href="/app/level" className="hm-level hm-in" style={{ "--i": 1 }}>
          <Qyran mood="wow" size={56} />
          <b>{tx(lang).lvlBanner}</b>
          <span className="hm-level-go"><Icon name="right" size={18} /></span>
        </Link>
      )}

      {/* ── 2 · Күн: ошақ, тапсырмалар, есеп ── */}
      <div ref={gDay} className="hm-bento hm-day">
        <div className="hm-in" style={{ "--i": 2 }}><TorHearth tor={tor} /></div>
        <div className="hm-in" style={{ "--i": 3 }}><TorQuests tor={tor} /></div>
        <ul className="hm-stats hm-in" style={{ "--i": 4 }}>
          {stats.map((s) => (
            <li key={s.l} className={`hm-stat c-${s.c}`}>
              <span className="hm-stat-i"><Icon name={s.i} size={18} /></span>
              <b>{s.v}</b>
              <small>{s.l}</small>
            </li>
          ))}
        </ul>
      </div>

      {/* ── 3 · Жол мен сөз ── */}
      <div ref={gDisc} className="hm-bento hm-discover">
        {next ? (
          <Link href={`/app/travel?r=${next.id}`} className="hm-tile hm-next hm-in" style={{ "--i": 5 }}>
            <span className="hm-next-art"><RegionScene region={next} /></span>
            <span className="hm-next-body">
              <span className="hm-kicker">{t.nextStep}</span>
              <h2>{t.nextTravel(L(next.name, lang))}</h2>
              <span className="hm-next-sub">{t.nextTravelSub}</span>
              <span className="btn gold hm-next-btn">
                {t.start} <Icon name="right" size={18} />
              </span>
            </span>
          </Link>
        ) : (
          <Link href="/app/games" className="hm-tile hm-next hm-next-all hm-in" style={{ "--i": 5 }}>
            <span className="hm-next-trophy" aria-hidden="true"><Icon name="trophy" size={56} /></span>
            <span className="hm-next-body">
              <h2>{t.allStamps}</h2>
              <span className="btn gold hm-next-btn">
                {t.nav.games} <Icon name="right" size={18} />
              </span>
            </span>
          </Link>
        )}

        <section className="hm-tile hm-wod hm-in" style={{ "--i": 6 }} aria-label={t.wordOfDay}>
          <span className="hm-kicker">{t.wordOfDay}</span>
          <div className="hm-wod-word" style={wodHide}>
            <TopicArt topic={word.t} size={72} />
            <div>
              <b lang="kk">{word.kk}</b>
              <span>{tr(word, explain)}</span>
            </div>
          </div>
          <button
            type="button"
            className="btn ghost small hm-wod-save"
            disabled={savedToday || !now || !WORDS}
            style={wodHide}
            onClick={() => {
              saveWord({ kk: word.kk, tr: tr(word, explain), e: word.e, src: "day" });
              award(2, 1);
            }}
          >
            <Icon name={savedToday ? "check" : "plus"} size={16} /> {savedToday ? t.saved : t.saveWord}
          </button>
          {state.vocab?.length > 0 && (
            <div className="hm-vocab">
              {state.vocab.slice(0, 8).map((v) => (
                <span key={v.kk} className="hm-vchip" title={v.tr} lang="kk">
                  {v.kk}
                </span>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── 4 · Мәдениет ── */}
      <div ref={gCult} className="hm-bento hm-culture">
        <article className="hm-tile hm-proverb hm-in" style={{ "--i": 7 }}>
          <span className="hm-kicker">{x0.proverb}</span>
          <blockquote lang="kk" style={hide}>{PROV.kk}</blockquote>
          <p style={hide}>{lang === "kk" ? (explain === "ru" ? PROV.ru : PROV.en) : lang === "ru" ? PROV.ru : PROV.en}</p>
        </article>
        <article className="hm-tile hm-trad hm-in" style={{ "--i": 8 }}>
          <span className="hm-trad-art" aria-hidden="true" style={hide}><TradArt i={tradI} /></span>
          <div>
            <span className="hm-kicker">{x0.tradition}</span>
            <h3 style={hide}>{L(TRAD.t, lang)}</h3>
            <p style={hide}>{L(TRAD.d, lang)}</p>
          </div>
        </article>
      </div>

      {/* ── 5 · Жылдам өту ── */}
      <h3 className="hm-sec hm-in" style={{ "--i": 9 }}>{t.quick}</h3>
      <nav ref={gQuick} className="hm-quick hm-in" style={{ "--i": 10 }} aria-label={t.quick}>
        {quick.map((q, i) => (
          <Link key={q.href} href={q.href} className={`hm-qcard tint-${i}`}>
            <span className="hm-qart"><NatArt name={q.art} size={96} /></span>
            <b>{q.t}</b>
            <span className="hm-qgo" aria-hidden="true"><Icon name="right" size={16} /></span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
