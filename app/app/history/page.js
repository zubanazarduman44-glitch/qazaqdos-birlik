"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useApp } from "../../components/Store";
import Alash from "../../components/Alash";
import Icon from "../../components/Icon";
import Quiz from "../../components/Quiz";
import { SITES } from "../../../lib/history";
import { REGIONS } from "../../../lib/regions";
import { L } from "../../../lib/i18n";
import { shuffle } from "../../../lib/words";

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
  const [sel, setSel] = useState(SITES[0].id);
  const [quiz, setQuiz] = useState(null);
  const [res, setRes] = useState(null);
  const panel = useRef(null);
  const site = SITES.find((s) => s.id === sel);
  const done = state.sites || {};
  const count = Object.keys(done).length;
  const reg = REGIONS.find((r) => r.id === site.region);

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
    <div className="history">
      <header className="page-head">
        <div>
          <span className="kicker">{t.histKicker}</span>
          <h1>{t.histTitle}</h1>
          <p>{t.histSub}</p>
        </div>
        <span className="chip gold">🏺 {t.sitesDone(count, SITES.length)}</span>
      </header>

      <section className="card timeline-card">
        <div className="timeline">
          {SITES.map((s, i) => (
            <button key={s.id} className={`tl-node ${sel === s.id ? "on" : ""} ${done[s.id] ? "done" : ""}`} onClick={() => pick(s.id)} style={{ animationDelay: `${i * 0.04}s` }}>
              <span className="tl-dot">{done[s.id] ? "🏅" : s.e}</span>
              <b>{L(s.name, lang)}</b>
              <small>{L(s.era, lang)}</small>
            </button>
          ))}
        </div>
      </section>

      <div ref={panel} className="region-anchor" />
      <section className="card site rise" key={site.id}>
        <div className="site-head">
          <span className="site-e">{site.e}</span>
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
            <Alash mood="idle" size={70} />
            <p>{L(site.story, lang)}</p>
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
