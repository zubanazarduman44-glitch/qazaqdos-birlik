"use client";
import Link from "next/link";
import { useApp } from "./components/Store";
import Qyran from "./components/Qyran";
import Icon from "./components/Icon";
import { LangSeg, Logo, Orn } from "./components/Shell";
import { REGIONS } from "../lib/regions";
import { L } from "../lib/i18n";
import { photoUrl } from "../lib/photo";

export default function Landing() {
  const { t, lang, user, state } = useApp();
  const startHref = user || state.profile.onboarded ? "/app" : "/register";
  const shown = REGIONS.filter((r) => r.photo);

  return (
    <div className="landing">
      <header className="l-head">
        <Logo />
        <div className="l-head-r">
          <LangSeg />
          {user || state.profile.onboarded ? (
            <Link href="/app" className="btn gold small">
              {t.cont} <Icon name="right" size={16} />
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn ghost small hide-xs">
                {t.login}
              </Link>
              <Link href="/register" className="btn gold small">
                {t.register}
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy rise">
          <span className="kicker">{t.heroKicker}</span>
          <h1>
            {t.heroTitle1}
            <br />
            <span className="hl">{t.heroTitle2}</span>
          </h1>
          <p className="hero-text">{t.heroText}</p>
          <div className="hero-cta">
            <Link href={startHref} className="btn gold big">
              {t.heroCta} <Icon name="right" size={20} />
            </Link>
            <Link href="/onboarding" className="btn ghost big">
              {t.heroTry}
            </Link>
          </div>
          <ul className="hero-checks">
            {t.heroChecks.map((c) => (
              <li key={c}>
                <Icon name="check" size={16} stroke={3} /> {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-art rise" style={{ animationDelay: "0.12s" }}>
          <div className="hero-photo">
            <img src={photoUrl("1543166987-85e4689dfe82", 1400, 1100)} alt="" />
            <span className="hero-photo-fade" />
          </div>
          <div className="hero-qyran">
            <Qyran mood="happy" size={230} />
          </div>
          <div className="bubble hero-bubble">{t.heroBubble}</div>
          <span className="float-chip c1">🗺️ 20 · {t.nav.travel}</span>
          <span className="float-chip c2">🎯 6 · {t.nav.games}</span>
          <span className="float-chip c3">💬 AI · {t.nav.chat}</span>
        </div>
      </section>

      <Orn className="l-orn" />

      <section className="l-sec">
        <h2 className="l-title">{t.featTitle}</h2>
        <div className="grid g4">
          {t.feats.map((f, i) => (
            <div key={f.t} className="card hover feat rise" style={{ animationDelay: `${i * 0.06}s` }}>
              <span className="feat-e">{f.e}</span>
              <h3>{f.t}</h3>
              <p className="muted">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="l-sec">
        <h2 className="l-title">{t.travelTitle}</h2>
        <div className="strip">
          {shown.map((r) => (
            <Link key={r.id} href={`/app/travel?r=${r.id}`} className="strip-card">
              <img src={photoUrl(r.photo, 700, 900)} alt={L(r.name, lang)} loading="lazy" />
              <span className="strip-txt">
                <b>{L(r.name, lang)}</b>
                <small>{L(r.sights[0], lang)}</small>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="l-sec">
        <h2 className="l-title">{t.stepsTitle}</h2>
        <div className="grid g3">
          {t.steps.map((s, i) => (
            <div key={s.t} className="card step">
              <span className="step-n">0{i + 1}</span>
              <h3>{s.t}</h3>
              <p className="muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="l-sec faq">
        <h2 className="l-title">{t.faqTitle}</h2>
        {t.faq.map((f) => (
          <details key={f.q} className="card tight">
            <summary>{f.q}</summary>
            <p className="muted">{f.a}</p>
          </details>
        ))}
      </section>

      <section className="l-cta card">
        <Qyran mood="cheer" size={130} />
        <div>
          <h2>{t.footer}</h2>
          <Link href={startHref} className="btn gold big">
            {t.heroCta} <Icon name="right" size={20} />
          </Link>
        </div>
      </section>

      <footer className="l-foot">
        <Orn />
        <p className="muted small">© {new Date().getFullYear()} TILIM · Aqyl</p>
      </footer>
    </div>
  );
}
