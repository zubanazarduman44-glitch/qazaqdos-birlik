"use client";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../components/Store";
import Qyran from "../../components/Qyran";
import Icon from "../../components/Icon";
import { QUESTIONS, LEVELS, grade } from "../../../lib/levelTest";
import { tx } from "../../../lib/tx";
import { shuffle } from "../../../lib/words";

const pick = (v, lang) => (typeof v === "string" ? v : v[lang] || v.en || v.ru || v.kk);

function Level() {
  const { lang, state, update, award } = useApp();
  const router = useRouter();
  const x = tx(lang);
  const [phase, setPhase] = useState("intro");
  const [i, setI] = useState(0);
  const [order, setOrder] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [picked, setPicked] = useState(null);
  const [res, setRes] = useState(null);

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
        update((s) => ({ ...s, cefr: g.cefr }));
        award(20 + g.total * 2, 10);
        setPhase("result");
      }
    }, 650);
  }

  const lvls = ["A0", ...LEVELS];
  if (phase === "intro")
    return (
      <div className="level">
        <section className="card lv-intro rise">
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
            <button className="btn gold big" onClick={start}>
              {x.lvlStart} <Icon name="right" size={18} />
            </button>
            <Link href="/app" className="btn ghost">
              {x.lvlSkip}
            </Link>
          </div>
        </section>
      </div>
    );

  if (phase === "quiz") {
    const q = QUESTIONS[i];
    return (
      <div className="level">
        <section className="card lv-quiz" key={i}>
          <div className="lv-top">
            <span className="chip">{x.lvlQ(i + 1, QUESTIONS.length)}</span>
            <div className="bar">
              <i style={{ width: `${(i / QUESTIONS.length) * 100}%` }} />
            </div>
          </div>
          <h2 className="lv-q rise">{pick(q.p, lang)}</h2>
          <div className="lv-opts">
            {order[i].map((k, n) => {
              const on = picked === k;
              const right = picked !== null && k === q.a;
              const bad = on && k !== q.a;
              return (
                <button key={k} className={`lv-opt ${right ? "right" : ""} ${bad ? "bad" : ""}`} disabled={picked !== null} onClick={() => answer(k)} style={{ animationDelay: `${n * 0.05}s` }}>
                  <i>{String.fromCharCode(65 + n)}</i>
                  <span>{pick(q.o[k], lang)}</span>
                </button>
              );
            })}
          </div>
          <button className="btn ghost small" disabled={picked !== null} onClick={() => answer(-1)}>
            {x.lvlDont}
          </button>
        </section>
      </div>
    );
  }

  const cur = res.cefr;
  return (
    <div className="level">
      <section className="card lv-res rise">
        <Qyran mood={cur === "A0" ? "support" : "cheer"} size={130} />
        <span className="kicker">{x.lvlResult}</span>
        <div className="lv-badge pop">{cur}</div>
        <h2>{x.lvlNames[cur]}</h2>
        <p>{x.lvlDesc[cur]}</p>
        <div className="lv-scale">
          {lvls.map((l) => (
            <span key={l} className={l === cur ? "on" : lvls.indexOf(l) < lvls.indexOf(cur) ? "past" : ""}>
              {l}
            </span>
          ))}
        </div>
        <p className="muted small">{x.lvlScore(res.total, res.count)}</p>
        <p className="lv-next">💡 {x.lvlNext[cur]}</p>
        <p className="muted small">{x.lvlHint}</p>
        <div className="lv-actions">
          <button className="btn gold big" onClick={() => router.push("/app")}>
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
