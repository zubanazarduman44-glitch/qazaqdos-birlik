"use client";
import "./landing.css";
import { useMemo, useRef } from "react";
import Link from "next/link";
import { useApp } from "./components/Store";
import Qyran from "./components/Qyran";
import Icon from "./components/Icon";
import QyzylMark from "./components/QyzylMark";
import { LangSeg, Logo, Orn } from "./components/Shell";
import SightArt, { RegionScene } from "./components/SightArt";
import { GameScene } from "./components/games/Frame";
import { LandingRibbon, LandingSwoosh, LandingTyped, LandingChatArt, LandingVisionArt, useLandingFx } from "./components/LandingArt";
import { REGIONS } from "../lib/regions";
import { L } from "../lib/i18n";

// «Қызыл тіл» лентасындағы сөздер — өңірлер сөздігінен (lib/regions.js)
const RIBBON_KK = ["сөз", "тау", "көл", "дала", "жылқы", "алма", "өлең", "жол", "керуен", "теңіз", "қызғалдақ", "киіз үй", "ақын", "су", "қар", "бал", "жайлау", "шың", "құм", "түйе", "кітап", "жел", "өзен"];
const WORD_IDX = (() => {
  const m = {};
  for (const r of REGIONS) for (const w of r.words || []) if (!m[w.kk]) m[w.kk] = w;
  return m;
})();
// Төрт әлемнің суреті (t.feats ретімен: саяхат, ойындар, чат, Vision)
const FEAT_ART = ["travel", "games", "chat", "vision"];

export default function Landing() {
  const { t, lang, user, state } = useApp();
  const startHref = user || state.profile.onboarded ? "/app" : "/register";
  const shown = REGIONS.filter((r) => r.photo);
  const root = useRef(null);
  useLandingFx(root);

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
          {user || state.profile.onboarded ? (
            <Link href="/app" className="btn gold small ld-primary">
              {t.cont} <Icon name="right" size={16} />
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
      <section className="ld-hero">
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
              <Link href={startHref} className="btn gold big ld-primary">
                {t.heroCta} <Icon name="right" size={20} />
              </Link>
              <Link href="/onboarding" className="btn ghost big ld-second">
                {t.heroTry}
              </Link>
            </div>
            <ul className="ld-checks">
              {t.heroChecks.map((c) => (
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
              20 · {t.nav.travel}
            </span>
            <span className="ld-chip c2">
              <span className="ld-chip-ic">
                <Icon name="target" size={16} />
              </span>
              6 · {t.nav.games}
            </span>
            <span className="ld-chip c3">
              <span className="ld-chip-ic">
                <Icon name="chat" size={16} />
              </span>
              AI · {t.nav.chat}
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

      <Orn className="ld-orn" />

      {/* ═════ Төрт әлем: бір жіппен тігілген әңгіме ═════ */}
      <section className="ld-sec ld-wrap">
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
          {t.faq.map((f, i) => (
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
      <section className="ld-wrap">
        <div className="ld-final" data-reveal>
          <div className="ld-final-aqyl">
            <Qyran mood="cheer" size={150} />
          </div>
          <div className="ld-final-txt">
            <h2>{t.footer}</h2>
            <Link href={startHref} className="btn gold big ld-onred">
              {t.heroCta} <Icon name="right" size={20} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="ld-foot ld-wrap">
        <Orn />
        <p className="small">© {new Date().getFullYear()} Qyzyl til · Aqyl</p>
      </footer>
    </div>
  );
}
