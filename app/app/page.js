"use client";
import "../home.css";
import { tx } from "../../lib/tx";
import { PROVERBS, TRADITIONS } from "../../lib/culture";
import Link from "next/link";
import { useTor, TorLesson, TorHearth, TorQuests } from "../components/Tor";
import { useEffect, useMemo, useState } from "react";
import { DAILY_GOAL, dayKey, useApp } from "../components/Store";
import { useClientDate, utcDayIndex, localDayIndexOf } from "../../lib/useClientDate";
import Icon from "../components/Icon";
import Avatar from "../components/Avatar";
import TopicArt from "../components/TopicArt";
import { NatArt } from "../components/NatArt";
import dynamic from "next/dynamic";
// Өңір суреті (SightArt ~68 KB) — тек «келесі өңір» карточкасына керек: бөлек чанкпен жүктеледі
const RegionScene = dynamic(() => import("../components/SightArt").then((m) => m.RegionScene), { loading: () => null });
import HomeYurt, { useDayPhase } from "../components/HomeArt";
import { useAnimGate } from "../components/AnimGate";
import { REGIONS } from "../../lib/regions";
import { tr } from "../../lib/wordTools";
import { L } from "../../lib/i18n";
import { lessonTitle } from "../../lib/courseIndex";
import { AqylSays } from "../components/Aqyl";
import { useAqylL } from "../components/AqylL10n";
import ShellGlyph from "../components/ShellGlyph";
import { SECTIONS, SECTION_HINT, pickL, secVars } from "../../lib/sections";
import { levelL } from "../components/LevelL10n";
import { FIRST_LESSON, lessonHref as lessonLink } from "../../lib/progress";

// Басты бет — ықшам «Бүгін» (Duolingo / Babbel / Khan Academy үлгісі): жоғарыда жіңішке сәлем жолы
// (мақсат + серия), бір басты әрекет (сабақты жалғастыру), одан кейін қысқа, тығыз карточкалар.
// Бөлімдер мен олардың реті бұрынғыдай: Төр · Aqyl кеңесі · Күн · Жол мен сөз · Мәдениет · Жылдам өту.

// Дәстүр карточкасының суреті (TRADITIONS ретімен): киіз үй, қонақжайлылық, Наурыз, домбыра, бүркітші, тұсау кесу, көкпар, шапан
const TRAD_ART = [
  { nat: "yurt" }, { nat: "bowl" }, { topic: "tradition" }, { nat: "dombyra" },
  { topic: "animals" }, { topic: "family" }, { nat: "kamshy" }, { topic: "clothes" },
];
function TradArt({ i }) {
  const a = TRAD_ART[i] || { nat: "yurt" };
  if (a.topic) return <TopicArt topic={a.topic} size={44} />;
  return <NatArt name={a.nat} size={54} />;
}

// Киіз үй суреті тек кең экранда (≥ 900px) көрінеді: телефонда орын басты әрекетке беріледі.
// Сервер мен гидрацияда false — сурет кейін қосылады, бірақ орны CSS-та алдын ала сақталған (ығыспайды).
function useWide(q = "(min-width: 900px)") {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const m = window.matchMedia?.(q);
    if (!m) return;
    const f = () => setOn(m.matches);
    f();
    m.addEventListener?.("change", f);
    return () => m.removeEventListener?.("change", f);
  }, [q]);
  return on;
}

// Aqyl кеңесінің «әлсіз сөздері» (сабақтан кейін сақталады): 3 күннен ескі емес, кемі 2 сөз
function readWeak() {
  try {
    const w = JSON.parse(localStorage.getItem("qd_aqyl_weak") || "null");
    if (w && Array.isArray(w.words) && w.words.length >= 2 && Date.now() - (w.at || 0) < 3 * 86_400_000) return w.words;
  } catch {}
  return null;
}

// Деңгей атаулары профильмен бірдей (ProfileL10n: gameLvl / kzLvl / lvlTest): «Атау: мән»
const HOME_LVL = {
  kzLvl: { kk: "Қазақ тілі деңгейі", ru: "Уровень казахского", en: "Kazakh level", zh: "哈萨克语水平", es: "Nivel de kazajo", de: "Kasachisch-Niveau", fr: "Niveau de kazakh", tr: "Kazakça seviyesi", ar: "مستوى الكازاخية", ko: "카자흐어 레벨", ja: "カザフ語レベル" },
  lvlTest: { kk: "Деңгейді анықтау / қайта тапсыру", ru: "Определить / пересдать уровень", en: "Take / retake the level test", zh: "测试 / 重新测试水平", es: "Hacer / repetir la prueba de nivel", de: "Einstufungstest machen / wiederholen", fr: "Passer / repasser le test de niveau", tr: "Seviye testine gir / yeniden gir", ar: "أداء / إعادة اختبار المستوى", ko: "레벨 테스트 보기 / 다시 보기", ja: "レベルテストを受ける / 受け直す" },
};

// Мазмұн күн белгілі болғанша (SSR/гидрация) қаңқа сызықтары ретінде көрінеді: мәтін орнын ұстайды, бос карточка көрінбейді
const Sk = ({ on, children }) => <span className={on ? "hm-skl" : undefined}>{children}</span>;

// «Күн сөзі» жүктелгенше орын ұстайтын бейтарап сөз (көрінбейді)
const WORD0 = { t: "greet", kk: "Сәлеметсіз бе", ru: "Здравствуйте", en: "Hello" };

export default function Home() {
  const { t, lang, explain, state, saveWord, award } = useApp();
  const tor = useTor();
  const G = useAqylL(lang).guide;
  // Экраннан тыс суреттердің анимациясы кідіреді (AnimGate)
  const gHero = useAnimGate(), gDay = useAnimGate(), gDisc = useAnimGate();
  const phase = useDayPhase();
  const wide = useWide();
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
  const [weak, setWeak] = useState(null);
  useEffect(() => {
    let on = true;
    import("../../lib/words").then((m) => on && setWords(m.WORDS));
    setWeak(readWeak());
    return () => { on = false; };
  }, []);
  const word = WORDS ? WORDS[dayIdx % WORDS.length] : WORD0;
  const wodHide = now && WORDS ? undefined : { visibility: "hidden" };
  const savedToday = state.vocab?.some((v) => v.kk === word.kk);
  const wait = !now;
  const goalPct = Math.min(1, todayXp / DAILY_GOAL);
  const goalTxt = t.todayGoalTxt ? t.todayGoalTxt(Math.min(todayXp, DAILY_GOAL), DAILY_GOAL) : `${Math.min(todayXp, DAILY_GOAL)} / ${DAILY_GOAL} XP`;
  const streak = state.streak || 0;

  // Aqyl кеңесі — келесі қадам (деңгей тесті → ошақ → қате сөздер → сабақ → мақсат → VR → чат).
  // Кеңес басты әрекетпен бірдей сабаққа апарса, қайталанатын батырма көрсетілмейді — тек сөз қалады.
  const lessonHref = tor.next ? `/app/course?l=${tor.next.id}` : "/app/sozdik";
  const hour = now ? now.getHours() : 12;
  let g;
  // Деңгей анықтау ұсынылса — екі анық таңдау: «Нөлден бастаймын» (A1 · 1-сабақ) және «Деңгейімді анықтаймын» (тест).
  // Тестті өткізіп жібергенге немесе сабақ өткенге бұл ұсыныс қайталанбайды (тест профильден де ашылады).
  const lx = levelL(lang);
  const offerLevel = !state.cefr && !state.levelTest?.skipped && !Object.keys(state.course?.done || {}).length;
  if (offerLevel) g = { mood: "wow", txt: [lx.choose, lx.find], href: "/app/level", icon: "chart", zero: true };
  else if (today && streak > 0 && state.lastDay !== today && hour >= 17) g = { mood: "support", txt: G.streak(streak), href: tor.next ? lessonHref : "/app/course", icon: "flame" };
  else if (weak && todayXp < DAILY_GOAL) g = { mood: "explaining", txt: G.weak(weak.length), href: "/app/sozdik?tab=review", icon: "refresh" };
  else if (todayXp === 0 && tor.next) g = { mood: "talking", txt: G.start(lessonTitle(tor.next, lang)), href: lessonHref, icon: "book" };
  else if (todayXp > 0 && todayXp < DAILY_GOAL) g = { mood: "happy", txt: G.more(DAILY_GOAL - todayXp), href: tor.next ? lessonHref : "/app/games", icon: "right" };
  else if (todayXp >= DAILY_GOAL && !Object.keys(state.vr?.done || {}).length) g = { mood: "cheer", txt: G.vr, href: "/app/vr", icon: "globe" };
  else g = { mood: todayXp >= DAILY_GOAL ? "cheer" : "idle", txt: G.chat, href: "/app/qyran", icon: "chat" };
  const [say, cta] = g.txt;
  const guideGo = !wait && g.href !== lessonHref;

  const quick = useMemo(
    () => [
      { k: "history", t: t.nav.history },
      { k: "games", t: t.nav.games },
      { k: "chat", t: t.navLong.chat },
      { k: "vr", t: t.navLong.vr },
    ].map((q) => ({ ...q, href: SECTIONS[q.k].href, glyph: SECTIONS[q.k].glyph, hint: pickL(SECTION_HINT[q.k], lang) })),
    [t, lang]
  );

  // Есеп: серия жоғарыда (сәлем жолы мен ошақта) тұр — мұнда қайталанбайды
  const stats = [
    { i: "star", v: state.xp || 0, l: t.statsXp, c: "gold" },
    { i: "coin", v: state.coins || 0, l: t.statsCoins, c: "gold" },
    { i: "stamp", v: `${stampCount}/${REGIONS.length}`, l: t.statsStamps, c: "blue" },
  ];

  return (
    <div className="hm">
      {/* ── 1 · Төр: сәлем + мақсат + серия, бүгінгі сабақ (басты әрекет), кең экранда — киіз үй ── */}
      <section ref={gHero} className="hm-hero hm-in" style={{ "--i": 0 }}>
        <div className="hm-top">
          <Avatar value={state.profile.avatar} size={40} />
          <div className="hm-hi">
            <h1>{t.hello(state.profile.name || "Дос")}</h1>
            <div
              className={`hm-goal${goalPct >= 1 ? " is-done" : ""}`}
              role="progressbar"
              aria-label={t.todayGoal}
              aria-valuemin={0}
              aria-valuemax={DAILY_GOAL}
              aria-valuenow={Math.min(todayXp, DAILY_GOAL)}
              title={t.todayGoal}
            >
              <span className="hm-goal-bar" aria-hidden="true"><i style={{ transform: `scaleX(${goalPct})` }} /></span>
              <span className="hm-goal-n">{goalTxt}</span>
              <span className="hm-goal-l">{t.todayGoal}</span>
            </div>
            {state.cefr && (
              <Link href="/app/level" className="hm-kzlvl" title={pickL(HOME_LVL.lvlTest, lang)}>
                {pickL(HOME_LVL.kzLvl, lang)}: <b>{state.cefr}</b>
              </Link>
            )}
          </div>
          <span className={`hm-streak${tor.lit ? " is-lit" : ""}`} role="img" aria-label={`${t.statsStreak}: ${streak}`} title={t.statsStreak}>
            <Icon name="flame" size={18} />
            <b>{streak}</b>
          </span>
        </div>

        <TorLesson tor={tor} />

        <div className={`hm-scene ph-${phase}`} aria-hidden="true">
          {wide && <HomeYurt phase={phase} xp={todayXp} goal={DAILY_GOAL} lit={tor.lit} streak={tor.streak} stamps={stampCount} stampTotal={REGIONS.length} />}
        </div>
      </section>

      {/* ── Aqyl кеңесі: келесі қадам ── */}
      <section className={`hm-guide hm-in${wait ? " is-wait" : ""}`} style={{ "--i": 1 }} aria-label={G.kicker} aria-busy={wait || undefined}>
        <AqylSays mood={wait ? "idle" : g.mood} size={52} tone="paper">
          <p className="hm-guide-say">{wait ? <><i className="aq-sk" /><i className="aq-sk aq-sk-2" /></> : say}</p>
        </AqylSays>
        {guideGo && g.zero && (
          <Link href={lessonLink(FIRST_LESSON)} className="hm-guide-go">
            <ShellGlyph name="trail" size={18} /> <span>{lx.zero}</span> <Icon name="right" size={16} className="hm-arrow" />
          </Link>
        )}
        {guideGo && (
          <Link href={g.href} className="hm-guide-go">
            <Icon name={g.icon} size={18} /> <span>{cta}</span> {g.icon !== "right" && <Icon name="right" size={16} className="hm-arrow" />}
          </Link>
        )}
      </section>

      {/* ── 2 · Күн: ошақ, тапсырмалар, есеп ── */}
      <div ref={gDay} className="hm-bento hm-day">
        <div className="hm-in" style={{ "--i": 2 }}><TorHearth tor={tor} /></div>
        <div className="hm-in" style={{ "--i": 3 }}><TorQuests tor={tor} /></div>
        <ul className="hm-stats hm-in" style={{ "--i": 4 }}>
          {stats.map((s) => (
            <li key={s.l} className={`hm-stat c-${s.c}`}>
              <span className="hm-stat-i"><Icon name={s.i} size={16} /></span>
              <b>{s.v}</b>
              <small>{s.l}</small>
            </li>
          ))}
        </ul>
      </div>

      {/* ── 3 · Жол мен сөз ── */}
      <div ref={gDisc} className="hm-bento hm-discover">
        {next ? (
          <Link href={`/app/travel?r=${next.id}`} className="hm-tile hm-next hm-in" style={{ ...secVars("travel"), "--i": 5 }}>
            <span className="hm-next-art" aria-hidden="true"><RegionScene region={next} /></span>
            <span className="hm-next-body">
              <span className="hm-kicker">{t.nextStep}</span>
              <h2>{t.nextTravel(L(next.name, lang))}</h2>
              <span className="hm-next-sub">{t.nextTravelSub}</span>
            </span>
            <span className="hm-go" aria-hidden="true"><Icon name="right" size={18} /></span>
          </Link>
        ) : (
          <Link href="/app/games" className="hm-tile hm-next hm-next-all hm-in" style={{ ...secVars("games"), "--i": 5 }}>
            <span className="hm-next-art hm-next-trophy" aria-hidden="true"><Icon name="trophy" size={32} /></span>
            <span className="hm-next-body"><h2>{t.allStamps}</h2></span>
            <span className="hm-go" aria-hidden="true"><Icon name="right" size={18} /></span>
          </Link>
        )}

        <section className={`hm-tile hm-wod hm-in${wodHide ? " is-wait" : ""}`} style={{ ...secVars("sozdik"), "--i": 6 }} aria-label={t.wordOfDay}>
          <div className="hm-wod-top">
            <span className="hm-kicker">{t.wordOfDay}</span>
            <button
              type="button"
              className={`hm-wod-save${savedToday ? " is-saved" : ""}`}
              disabled={savedToday || !now || !WORDS}
              style={wodHide}
              onClick={() => {
                saveWord({ kk: word.kk, tr: tr(word, explain), e: word.e, src: "day" });
                award(2, 1);
              }}
            >
              <Icon name={savedToday ? "check" : "plus"} size={16} /> {savedToday ? t.saved : t.saveWord}
            </button>
          </div>
          <div className="hm-wod-word">
            <span className="hm-wod-art" aria-hidden="true"><TopicArt topic={word.t} size={40} /></span>
            <div>
              <b lang="kk"><Sk on={wodHide}>{word.kk}</Sk></b>
              <span><Sk on={wodHide}>{tr(word, explain)}</Sk></span>
            </div>
          </div>
        </section>
      </div>

      {/* ── 4 · Мәдениет ── */}
      <div className="hm-bento hm-culture">
        <article className={`hm-tile hm-proverb hm-in${wait ? " is-wait" : ""}`} style={{ "--i": 7 }}>
          <span className="hm-kicker">{x0.proverb}</span>
          <blockquote lang="kk"><Sk on={wait}>{PROV.kk}</Sk></blockquote>
          <p><Sk on={wait}>{lang === "kk" ? (explain === "ru" ? PROV.ru : PROV.en) : lang === "ru" ? PROV.ru : PROV.en}</Sk></p>
        </article>
        <article className={`hm-tile hm-trad hm-in${wait ? " is-wait" : ""}`} style={{ "--i": 8 }}>
          <span className="hm-trad-art" aria-hidden="true"><span style={hide}><TradArt i={tradI} /></span></span>
          <div>
            <span className="hm-kicker">{x0.tradition}</span>
            <h3><Sk on={wait}>{L(TRAD.t, lang)}</Sk></h3>
            <p><Sk on={wait}>{L(TRAD.d, lang)}</Sk></p>
          </div>
        </article>
      </div>

      {/* ── 5 · Жылдам өту: әр сілтеме өз бөлімінің реңінде ── */}
      <nav className="hm-quick-w hm-in" style={{ "--i": 9 }} aria-labelledby="hm-quick-h">
        <h3 id="hm-quick-h" className="hm-sec">{t.quick}</h3>
        <ul className="hm-quick">
          {quick.map((q) => (
            <li key={q.href}>
              <Link href={q.href} className="hm-qt" style={secVars(q.k)}>
                <span className="hm-qgl" aria-hidden="true"><ShellGlyph name={q.glyph} size={22} /></span>
                <span className="hm-qtxt">
                  <b>{q.t}</b>
                  <small>{q.hint}</small>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
