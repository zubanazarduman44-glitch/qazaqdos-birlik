"use client";
import "./landing.css";
import { useMemo, useRef } from "react";
import Link from "next/link";
import { useApp } from "./components/Store";
import Qyran from "./components/Qyran";
import Icon from "./components/Icon";
import QyzylMark from "./components/QyzylMark";
import { LangSeg, Logo } from "./components/Shell";
import dynamic from "next/dynamic";
// Ауыр суреттер (SightArt ~68 KB, GameArt ~18 KB) бөлек чанкпен: сервер HTML-ге бәрібір салады,
// ал браузер негізгі JS-ті жеңіл алады — бет тезірек интерактивті болады
const SightArt = dynamic(() => import("./components/SightArt"));
const RegionScene = dynamic(() => import("./components/SightArt").then((m) => m.RegionScene));
const GameScene = dynamic(() => import("./components/games/GameArt").then((m) => m.GameScene));
import { LandingRibbon, LandingSwoosh, LandingTyped, LandingChatArt, LandingVisionArt, useLandingFx } from "./components/LandingArt";
import { REGIONS } from "../lib/regions";
import { L } from "../lib/i18n";
import { useClientDate } from "../lib/useClientDate";
import { useAnimGate } from "./components/AnimGate";
import { startL } from "./components/StartL10n";
import { FIRST_LESSON, VR_BREAD, continueLesson, hasRealProgress, lessonHref } from "../lib/progress";
import { catalogCounts } from "../lib/catalog";
// VR дүкен ғимараты (VrArt) — бөлек чанк, тек VR карточкасына
const VrBuilding = dynamic(() => import("./components/VrArt").then((m) => m.VrBuilding));
// Санақтар нақты каталогтардан: ойын/квест, өңір, түсіндірме тілдері (онбордингтегі тізіммен бірдей)
const COUNTS = catalogCounts();

// «Қызыл тіл» лентасындағы сөздер — өңірлер сөздігінен (lib/regions.js)
const RIBBON_KK = ["сөз", "тау", "көл", "дала", "жылқы", "алма", "өлең", "жол", "керуен", "теңіз", "қызғалдақ", "киіз үй", "ақын", "су", "қар", "бал", "жайлау", "шың", "құм", "түйе", "кітап", "жел", "өзен"];
const WORD_IDX = (() => {
  const m = {};
  for (const r of REGIONS) for (const w of r.words || []) if (!m[w.kk]) m[w.kk] = w;
  return m;
})();
// Төрт әлемнің суреті (t.feats ретімен: саяхат, ойындар, чат, Vision)
const FEAT_ART = ["travel", "games", "chat", "vision"];

// Жыл — клиентте (гидрациядан кейін); сервер/гидрация рендерінде орны сақталған көрінбейтін белгі
function FootYear() {
  const now = useClientDate();
  return now ? now.getFullYear() : <span style={{ visibility: "hidden" }}>0000</span>;
}

export default function Landing() {
  const { t, lang, user, state } = useApp();
  const s = startL(lang);
  // Басты әрекет: жаңа адамға — бір басумен A1 · «Сәлемдесу · 1»; нақты оқу прогресі барға — «Жалғастыру»
  // (бастапқы XP сыйлығы, тақтаға жай кіру немесе бос профиль прогреске жатпайды — lib/progress.js)
  const progress = hasRealProgress(state);
  const mainHref = progress ? lessonHref(continueLesson(state)) : lessonHref(FIRST_LESSON);
  const mainLabel = progress ? s.cont : s.first;
  const faq = t.faq.map((f, i) => (i === 0 ? { ...f, a: s.faqGuest(s.guest) } : f));
  const checks = [t.heroChecks[0], t.heroChecks[1], s.explainN(COUNTS.explain)];
  const shown = REGIONS.filter((r) => r.photo);
  const root = useRef(null);
  useLandingFx(root);
  // Экраннан тыс суреттердің анимациясы кідіреді (AnimGate)
  const gHero = useAnimGate(), gFeat = useAnimGate(), gFinal = useAnimGate();

  // Аударма тілі: орыс/ағылшын интерфейсінде — сол тіл; қазақшада — орысша
  const trLang = lang === "en" ? "en" : lang === "kk" || lang === "ru" ? "ru" : "en";
  const words = useMemo(
    () => RIBBON_KK.map((k) => WORD_IDX[k]).filter(Boolean).map((w) => ({ kk: w.kk, tr: w[trLang] })),
    [trLang]
  );
  const horse = WORD_IDX["жылқы"];
  const visionWord = horse ? { kk: horse.kk, tr: horse[trLang] } : null;

  // Мақал: «… қызыл тіл»: аудармасы → екі жолға бөлеміз (мәтін өзгермейді)
  const ki = t.heroKicker.indexOf(":");
  const proverb = ki > 0 ? t.heroKicker.slice(0, ki) : t.heroKicker;
  const gloss = ki > 0 ? t.heroKicker.slice(ki + 1).trim() : "";

  return (
    <div className="ld" ref={root}>
      <header className="ld-head ld-wrap">
        <Logo />
        <div className="ld-head-r">
          <LangSeg />
          {progress || user ? (
            <Link href={mainHref} className="btn gold small ld-primary">
              {progress ? s.cont : s.start} <Icon name="right" size={16} />
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn ghost small hide-xs">
                {t.login}
              </Link>
              <Link href="/register" className="btn gold small ld-primary">
                {t.register}
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ═════ HERO: сөз — қызыл тіл ═════ */}
      <section ref={gHero} className="ld-hero">
        <div className="ld-hero-in ld-wrap">
          <div className="ld-copy">
            <p className="ld-proverb">
              <span className="ld-proverb-kk" lang="kk">
                {proverb}
              </span>
              {gloss && (
                <span className="ld-proverb-tr">
                  <span className="sr-only">: </span>
                  {gloss}
                </span>
              )}
            </p>
            <h1 className="ld-title">
              <span className="ld-t1">{t.heroTitle1}</span>
              <span className="ld-t2">
                <span className="ld-hl">{t.heroTitle2}</span>
                <LandingSwoosh />
              </span>
            </h1>
            <p className="ld-lead">{t.heroText}</p>
            <div className="ld-cta">
              <Link href={mainHref} className="btn gold big ld-primary">
                {mainLabel} <Icon name="right" size={20} />
              </Link>
              {!user && !progress && (
                <Link href="/onboarding" className="btn ghost big ld-second">
                  {s.guest}
                </Link>
              )}
              {!user && progress && (
                <Link href="/register" className="btn ghost big ld-second">
                  {t.register}
                </Link>
              )}
            </div>
            <ul className="ld-checks">
              {checks.map((c) => (
                <li key={c}>
                  <span className="ld-tick">
                    <Icon name="check" size={14} stroke={3} />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="ld-stage">
            <div className="ld-arch">
              <SightArt kind="alpineLakes" wide />
              <span className="ld-arch-sun" aria-hidden="true" />
            </div>
            <span className="ld-chip c1">
              <span className="ld-chip-ic">
                <Icon name="map" size={16} />
              </span>
              {s.regions(COUNTS.regions)}
            </span>
            <span className="ld-chip c2">
              <span className="ld-chip-ic">
                <Icon name="target" size={16} />
              </span>
              {s.games(COUNTS.games, COUNTS.quests)}
            </span>
            <span className="ld-chip c3">
              <span className="ld-chip-ic">
                <Icon name="chat" size={16} />
              </span>
              {s.aqyl}
            </span>
            <div className="ld-bubble">
              <LandingTyped text={t.heroBubble} />
            </div>
            <div className="ld-aqyl">
              <Qyran mood="happy" size={230} />
            </div>
          </div>
        </div>
        <LandingRibbon words={words} />
      </section>

      {/* ═════ Төрт әлем: бір жіппен тігілген әңгіме ═════ */}
      <section ref={gFeat} className="ld-sec ld-wrap">
        <h2 className="ld-h2" data-reveal>
          {t.featTitle}
        </h2>
        <ol className="ld-worlds">
          {t.feats.map((f, i) => (
            <li key={f.t} className={`ld-world w-${FEAT_ART[i] || "x"}`} data-reveal>
              <div className="ld-world-art">
                {FEAT_ART[i] === "travel" && <SightArt kind="canyon" />}
                {FEAT_ART[i] === "games" && <GameScene id="baige" />}
                {FEAT_ART[i] === "chat" && (
                  <>
                    <LandingChatArt />
                    <span className="ld-world-aqyl">
                      <Qyran mood="think" size={130} />
                    </span>
                  </>
                )}
                {FEAT_ART[i] === "vision" && <LandingVisionArt word={visionWord} />}
              </div>
              <span className="ld-world-n" aria-hidden="true">
                {i + 1}
              </span>
              <div className="ld-world-txt">
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </div>
            </li>
          ))}
        </ol>
        {/* VR Әлем: «Нан сатып алу» жағдаятына тікелей жол (басты сабақ батырмасынан кіші) */}
        <div className="ld-vr" data-reveal>
          <span className="ld-vr-art" aria-hidden="true">
            <VrBuilding kind="shop" size={92} />
          </span>
          <div className="ld-vr-txt">
            <span className="ld-vr-k">{s.vrKicker}</span>
            <h3>{s.vrTitle}</h3>
            <p>{s.vrDesc}</p>
            <Link href={VR_BREAD} className="btn ghost ld-second ld-vr-go">
              {s.vrGo} <Icon name="right" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═════ Саяхат: паспорт мөрі түріндегі ашықхаттар ═════ */}
      <section className="ld-sec ld-travel">
        <div className="ld-wrap">
          <h2 className="ld-h2" data-reveal>
            {t.travelTitle}
          </h2>
        </div>
        <div className="ld-cards" data-reveal>
          {shown.map((r, i) => (
            <Link key={r.id} href={`/app/travel?r=${r.id}`} className="ld-card" style={{ "--tilt": `${[-2, 1.5, -1, 2, -1.5, 1][i % 6]}deg` }}>
              <span className="ld-card-in">
                <span className="ld-card-art">
                  <RegionScene region={r} />
                </span>
                <span className="ld-card-txt">
                  <b>{L(r.name, lang)}</b>
                  <small>{L(r.sights[0], lang)}</small>
                </span>
              </span>
              <span className="ld-card-stamp" aria-hidden="true">
                <QyzylMark size={28} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═════ Қадамдар: сыбырдан шешендікке дейін өсетін бұлттар ═════ */}
      <section className="ld-sec ld-wrap">
        <h2 className="ld-h2" data-reveal>
          {t.stepsTitle}
        </h2>
        <ol className="ld-steps">
          {t.steps.map((s, i) => (
            <li key={s.t} className={`ld-step s${i + 1}`} data-reveal style={{ "--d": `${i * 0.12}s` }}>
              <span className="ld-step-n" aria-hidden="true">
                0{i + 1}
              </span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ═════ FAQ: Aqyl-мен сұхбат ═════ */}
      <section className="ld-sec ld-wrap ld-faq">
        <h2 className="ld-h2" data-reveal>
          {t.faqTitle}
        </h2>
        <div className="ld-dialog">
          {faq.map((f, i) => (
            <details key={f.q} className="ld-qa" data-reveal open={i === 0 || undefined}>
              <summary>
                <span className="ld-q">{f.q}</span>
                <span className="ld-q-ic" aria-hidden="true">
                  <Icon name="plus" size={18} stroke={2.6} />
                </span>
              </summary>
              <div className="ld-a">
                <span className="ld-a-av" aria-hidden="true">
                  <Qyran mood="happy" size={46} />
                </span>
                <p>{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ═════ Соңғы шақыру: қызыл киіз ═════ */}
      <section ref={gFinal} className="ld-wrap">
        <div className="ld-final" data-reveal>
          <div className="ld-final-aqyl">
            <Qyran mood="cheer" size={150} />
          </div>
          <div className="ld-final-txt">
            <h2>{t.footer}</h2>
            <Link href={mainHref} className="btn gold big ld-onred">
              {mainLabel} <Icon name="right" size={20} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="ld-foot ld-wrap">
        <p className="small">© <FootYear /> Qyzyl til · Aqyl</p>
      </footer>
    </div>
  );
}
