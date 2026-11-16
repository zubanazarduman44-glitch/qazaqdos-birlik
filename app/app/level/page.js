"use client";
import "../../level.css";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "../../components/Store";
import Qyran from "../../components/Qyran";
import { NatArt } from "../../components/NatArt";
import Icon from "../../components/Icon";
import ShellGlyph from "../../components/ShellGlyph";
import { levelL } from "../../components/LevelL10n";
import { QUESTIONS, LEVELS, PASS, grade } from "../../../lib/levelTest";
import { tx } from "../../../lib/tx";
import { shuffle } from "../../../lib/wordTools";

const pick = (v, lang) => (typeof v === "string" ? v : v[lang] || v.en || v.ru || v.kk);

function Level() {
  const { lang, state, update, award } = useApp();
  const router = useRouter();
  // Тіркелгеннен кейінгі бірінші тест: кіріспесіз бірден басталады, өткізіп жіберу жоқ
  const first = useSearchParams().get("first") === "1" || Boolean(state.profile.levelPending);
  const x = tx(lang);
  const lx = levelL(lang);
  const [phase, setPhase] = useState("intro");
  const [i, setI] = useState(0);
  const [order, setOrder] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [picked, setPicked] = useState(null);
  const [res, setRes] = useState(null);
  useEffect(() => {
    if (first && phase === "intro") start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [first]);

  function start() {
    setOrder(QUESTIONS.map((q) => shuffle(q.o.map((_, k) => k))));
    setAnswers([]);
    setI(0);
    setPicked(null);
    setPhase("quiz");
  }
  function answer(k) {
    if (picked !== null) return;
    setPicked(k);
    const next = [...answers, k === -1 ? -1 : k];
    setAnswers(next);
    setTimeout(() => {
      if (i + 1 < QUESTIONS.length) {
        setI(i + 1);
        setPicked(null);
      } else {
        const g = grade(next);
        setRes(g);
        update((s) => ({ ...s, cefr: g.cefr, profile: { ...s.profile, levelPending: false } }));
        award(20 + g.total * 2, 10);
        setPhase("result");
      }
    }, 650);
  }

  const lvls = ["A0", ...LEVELS];
  if (phase === "intro")
    return (
      <div className="level lvx">
        <section className="card lv-intro lvx-intro rise">
          <Qyran mood="wow" size={140} />
          <span className="kicker">{x.lvlKicker}</span>
          <h1>{x.lvlTitle}</h1>
          <p>{x.lvlSub}</p>
          {state.cefr && (
            <p className="chip gold">
              {x.lvlResult}: {state.cefr} · {x.lvlNames[state.cefr]}
            </p>
          )}
          <div className="lv-actions">
            <button className="btn blue big" onClick={start}>
              {x.lvlStart} <Icon name="right" size={18} />
            </button>
            <Link href="/app" className="btn ghost">
              {x.lvlSkip}
            </Link>
          </div>
        </section>
        <section className="card lv-how rise">
          <h2>{x.lvlHow}</h2>
          <ol>
            {x.lvlSteps?.map(([h, d], n) => (
              <li key={n}><b>{n + 1}</b><div><strong>{h}</strong><span>{d}</span></div></li>
            ))}
          </ol>
          <div className="lv-art"><NatArt name="dombyra" size={90} /><NatArt name="yurt" size={90} /><NatArt name="taqiya" size={80} /><NatArt name="bowl" size={80} /><NatArt name="kamshy" size={90} /></div>
        </section>
      </div>
    );

  if (phase === "quiz") {
    const q = QUESTIONS[i];
    const pct = ((i + (picked !== null ? 1 : 0)) / QUESTIONS.length) * 100;
    const mood = picked === null ? "think" : picked === q.a ? "happy" : "support";
    return (
      <div className="level lvx">
        <div className="lvx-trail" aria-hidden="true">
          {lvls.slice(1).map((l) => (
            <span key={l} className={`lvx-stop ${q.lvl === l ? "now" : lvls.indexOf(l) < lvls.indexOf(q.lvl) ? "past" : ""}`}>{l}</span>
          ))}
        </div>
        <section className="card lv-quiz lvx-quiz">
          <div className="lv-top lvx-top">
            <span className="lvx-count">{x.lvlQ(i + 1, QUESTIONS.length)}</span>
            <div className="lvx-bar" role="progressbar" aria-valuemin={0} aria-valuemax={QUESTIONS.length} aria-valuenow={i + 1} aria-label={x.lvlQ(i + 1, QUESTIONS.length)}>
              <i style={{ transform: `scaleX(${pct / 100})` }} />
            </div>
          </div>
          <div className="lvx-ask" key={i}>
            <span className="lvx-aqyl"><Qyran mood={mood} size={74} /></span>
            <h2 className="lv-q">{pick(q.p, lang)}</h2>
          </div>
          <div className="lv-opts lvx-opts" key={`o${i}`}>
            {order[i].map((k, n) => {
              const on = picked === k;
              const right = picked !== null && k === q.a;
              const bad = on && k !== q.a;
              return (
                <button key={k} className={`lv-opt ${right ? "right" : ""} ${bad ? "bad" : ""}`} disabled={picked !== null} onClick={() => answer(k)} style={{ animationDelay: `${n * 0.05}s` }}>
                  <i>{right ? <Icon name="check" size={16} stroke={3} /> : bad ? <Icon name="x" size={16} stroke={3} /> : String.fromCharCode(65 + n)}</i>
                  <span>{pick(q.o[k], lang)}</span>
                </button>
              );
            })}
          </div>
          <div className="lvx-dont">
            <button className={`lvx-dont-b ${picked === -1 ? "on" : ""}`} disabled={picked !== null} onClick={() => answer(-1)}>
              <ShellGlyph name="feather" size={18} /> {x.lvlDont}
            </button>
            <small>{lx.tip}</small>
          </div>
        </section>
      </div>
    );
  }

  const cur = res.cefr;
  const ci = lvls.indexOf(cur);
  return (
    <div className="level lvx">
      <section className="card lv-res lvx-res">
        <div className="lvx-burst" aria-hidden="true">
          {Array.from({ length: 10 }, (_, n) => <i key={n} style={{ "--a": `${n * 36}deg`, "--d": `${n * 0.03}s` }} />)}
        </div>
        <Qyran mood={cur === "A0" ? "support" : "cheer"} size={130} />
        <span className="kicker">{x.lvlResult}</span>
        <div className="lv-badge lvx-badge">{cur}</div>
        <h2>{x.lvlNames[cur]}</h2>
        <p className="lvx-desc">{x.lvlDesc[cur]}</p>
        <ol className="lvx-scale" aria-label={x.lvlResult}>
          {lvls.map((l, n) => (
            <li key={l} className={n === ci ? "on" : n < ci ? "past" : ""} aria-current={n === ci ? "true" : undefined}>
              <i />
              <b>{l}</b>
            </li>
          ))}
        </ol>
        <div className="lvx-per" aria-label={lx.per}>
          {LEVELS.map((l) => (
            <span key={l} className={res.per[l].ok >= PASS[l] ? "ok" : ""}>
              <b>{l}</b> {res.per[l].ok}/{res.per[l].n}
            </span>
          ))}
        </div>
        <p className="muted small">{x.lvlScore(res.total, res.count)}</p>
        <div className="lvx-next">
          <span className="lvx-next-gl"><ShellGlyph name="trail" size={22} /></span>
          <div>
            <b>{lx.next}</b>
            <p>{x.lvlNext[cur]}</p>
            <small>{x.lvlHint}</small>
          </div>
        </div>
        <div className="lv-actions">
          <button className="btn blue big" onClick={() => router.replace("/app")}>
            {x.lvlGo} <Icon name="right" size={18} />
          </button>
          <button className="btn ghost" onClick={start}>
            <Icon name="refresh" size={16} /> {x.lvlRetake}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Level />
    </Suspense>
  );
}
