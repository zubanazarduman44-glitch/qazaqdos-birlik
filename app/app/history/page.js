"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../../components/Store";
import Qyran from "../../components/Qyran";
import Icon from "../../components/Icon";
import Quiz from "../../components/Quiz";
import { SITES } from "../../../lib/history";
import { REGIONS } from "../../../lib/regions";
import { L } from "../../../lib/i18n";
import { shuffle } from "../../../lib/words";
import { tx } from "../../../lib/tx";

function useCountUp(target, ms = 1100) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const a = from.current;
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / ms);
      const e = 1 - Math.pow(1 - k, 3);
      const val = Math.round(a + (target - a) * e);
      setV(val);
      from.current = val;
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

const fmtYear = (y, lang) => {
  const n = Math.abs(y);
  if (y < 0) return `${n} ${lang === "kk" ? "б.з.д." : lang === "ru" ? "до н. э." : "BC"}`;
  return lang === "kk" ? `${n} ж.` : lang === "ru" ? `${n} г.` : `${n} AD`;
};

const SORTED = [...SITES].sort((a, b) => a.year - b.year);

const trW = (w, lang) => (lang === "en" || !["ru", "kk"].includes(lang) ? w.en : w.ru);

function buildQuiz(site, lang, explain) {
  const answers = site.a.map((x, i) => ({ key: String(i), label: L(x, lang) }));
  const qs = [{ prompt: L(site.q, lang), options: shuffle(answers), answer: "0" }];
  const pool = SITES.flatMap((s) => s.words);
  for (const w of site.words) {
    const others = shuffle(pool.filter((p) => trW(p, explain) !== trW(w, explain))).slice(0, 3);
    qs.push({
      prompt: `${w.e} ${w.kk} → ?`,
      options: shuffle([w, ...others]).map((o) => ({ key: o.kk, label: trW(o, explain) })),
      answer: w.kk,
    });
  }
  return qs;
}

export default function History() {
  const { t, lang, explain, state, update, award, saveWord } = useApp();
  const [sel, setSel] = useState(SORTED[0].id);
  const [quiz, setQuiz] = useState(null);
  const [res, setRes] = useState(null);
  const panel = useRef(null);
  const riverRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const site = SITES.find((s) => s.id === sel);
  const done = state.sites || {};
  const count = Object.keys(done).length;
  const reg = REGIONS.find((r) => r.id === site.region);
  const idx = SORTED.findIndex((q) => q.id === sel);
  const year = useCountUp(site.year);
  const sentences = L(site.story, lang).split(/(?<=[.!?])\s+/).filter(Boolean);
  const x = tx(lang);

  useEffect(() => {
    const el = riverRef.current?.querySelector(".tl-node.on");
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [sel]);

  function pick(id) {
    setSel(id);
    setQuiz(null);
    setRes(null);
    setTimeout(() => panel.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }
  function finish(right, total) {
    const ok = right >= total - 1;
    setRes({ ok, right, total });
    if (ok && !done[site.id]) {
      update((s) => ({ ...s, sites: { ...s.sites, [site.id]: Date.now() } }));
      award(25, 10, `${t.badge} +25 XP`);
    } else award(ok ? 5 : 2, ok ? 2 : 0);
  }

  return (
    <div className="history" style={{ "--h": 18 + idx * 34 }}>
      <div className="h-bg" aria-hidden>
        {Array.from({ length: 22 }).map((_, i) => (
          <i key={i} style={{ left: `${(i * 47) % 100}%`, animationDelay: `${(i % 9) * 0.9}s`, animationDuration: `${9 + (i % 5) * 2}s`, "--s": 0.5 + (i % 4) * 0.35 }} />
        ))}
      </div>
      <header className="page-head">
        <div>
          <span className="kicker">{t.histKicker}</span>
          <h1>{t.histTitle}</h1>
          <p>{t.histSub}</p>
        </div>
        <span className="chip gold">🏺 {t.sitesDone(count, SITES.length)}</span>
      </header>

      <section className="card portal">
        <div className="portal-year" aria-live="polite">
          <small>{L(site.era, lang)}</small>
          <b>{fmtYear(year, lang)}</b>
        </div>
        <div className="river" ref={riverRef}>
          <svg className="river-wave" viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden>
            <path className="rw rw1" d="M0 40 C 80 10, 160 70, 250 40 S 420 10, 500 40 S 660 70, 750 40 S 920 10, 1000 40" />
            <path className="rw rw2" d="M0 44 C 90 74, 170 14, 260 44 S 430 74, 510 44 S 670 14, 760 44 S 930 74, 1000 44" />
            <path className="rw-fill" style={{ clipPath: `inset(0 ${100 - ((idx + 0.5) / SORTED.length) * 100}% 0 0)` }} d="M0 42 C 80 12, 160 72, 250 42 S 420 12, 500 42 S 660 72, 750 42 S 920 12, 1000 42" />
          </svg>
          <div className="timeline">
            {SORTED.map((s, i) => (
              <button key={s.id} className={`tl-node ${sel === s.id ? "on" : ""} ${done[s.id] ? "done" : ""} ${i < idx ? "past" : ""}`} onClick={() => pick(s.id)} style={{ animationDelay: `${i * 0.07}s`, "--n": 18 + i * 34 }}>
                <span className="tl-dot">{done[s.id] ? "🏅" : s.e}</span>
                <b>{L(s.name, lang)}</b>
                <small>{fmtYear(s.year, lang)}</small>
              </button>
            ))}
          </div>
        </div>
        <div className="portal-nav">
          <button className="btn ghost small" disabled={idx === 0} onClick={() => pick(SORTED[idx - 1].id)}>
            <Icon name="left" size={16} /> {x.hPrev}
          </button>
          <button className="btn ghost small" disabled={idx === SORTED.length - 1} onClick={() => pick(SORTED[idx + 1].id)}>
            {x.hNext} <Icon name="right" size={16} />
          </button>
        </div>
      </section>

      <div ref={panel} className="region-anchor" />
      <section className="card site rise" key={site.id}>
        <div className="site-head">
          <div
            className="artifact"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -26, y: ((e.clientX - r.left) / r.width - 0.5) * 26 });
            }}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          >
            <i className="ar a1" />
            <i className="ar a2" />
            <span className="art-e" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>{site.e}</span>
          </div>
          <div>
            <span className="badge">{L(site.era, lang)}</span>
            <h2>{L(site.name, lang)}</h2>
            {reg && (
              <Link href={`/app/travel?r=${reg.id}`} className="site-reg">
                <Icon name="map" size={15} /> {L(reg.name, lang)}
              </Link>
            )}
          </div>
          {done[site.id] && <span className="stamp-mark static pop">🏅 {t.badge}</span>}
        </div>
        <div className="site-body">
          <div className="story">
            <Qyran mood="idle" size={70} />
            <p className="story-lines">
              {sentences.map((sn, i) => (
                <span key={i} style={{ "--i": i }}>{sn} </span>
              ))}
            </p>
          </div>
          <div className="site-words">
            {site.words.map((w) => {
              const saved = state.vocab?.some((v) => v.kk === w.kk);
              return (
                <button key={w.kk} className={`word-chip ${saved ? "saved" : ""}`} onClick={() => saveWord({ kk: w.kk, tr: trW(w, explain), e: w.e, src: site.id })}>
                  <span className="wc-e">{w.e}</span>
                  <span>
                    <b>{w.kk}</b>
                    <small>{trW(w, explain)}</small>
                  </span>
                  <Icon name={saved ? "check" : "plus"} size={16} />
                </button>
              );
            })}
          </div>
          <div className="site-quiz">
            {quiz ? (
              <>
                <Quiz questions={quiz} onDone={finish} pass={quiz.length - 1} />
                {res && (
                  <div className={`alert ${res.ok ? "ok" : ""} rise`}>
                    {res.ok ? `🏅 ${t.badge}` : t.score(res.right, res.total)}
                    <button className="btn ghost small" onClick={() => { setQuiz(buildQuiz(site, lang, explain)); setRes(null); }}>
                      <Icon name="refresh" size={15} /> {t.retry}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button className="btn gold big" onClick={() => setQuiz(buildQuiz(site, lang, explain))}>
                <Icon name="trophy" size={20} /> {t.histQuiz}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
