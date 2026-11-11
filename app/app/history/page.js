"use client";
import LangPicker from "../../components/LangPicker";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../../components/Store";
import Qyran from "../../components/Qyran";
import Icon from "../../components/Icon";
import Quiz from "../../components/Quiz";
import KzSymbols from "../../components/KzSymbols";
import HistSymbols from "../../components/HistSymbols";
import { buildDecor, TERRAIN, RIVERS, LAKES } from "../../../lib/kzscene";
import { KZ_CENTERS, KZ_PATHS, KZ_VIEW } from "../../../lib/kzmap";
import { SITES } from "../../../lib/history";
import { REGIONS } from "../../../lib/regions";
import { L } from "../../../lib/i18n";
import { shuffle, tr } from "../../../lib/words";
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

const symId = (n) => (n.startsWith("hl-") || n.startsWith("ht-") ? n : `ks-${n}`);
const ERAS = [
  { id: "all", n: ["Барлығы", "Все", "All"], f: () => true },
  { id: "old", n: ["Көне дәуір", "Древность", "Ancient"], f: (y) => y < 0 },
  { id: "early", n: ["Ерте орта ғасыр", "Раннее средневековье", "Early Middle Ages"], f: (y) => y >= 0 && y < 1100 },
  { id: "mid", n: ["Орта ғасыр", "Средневековье", "Middle Ages"], f: (y) => y >= 1100 },
];
const SILK = ["taraz", "otrar", "turkistan", "sauran", "syganak"];

const SORTED = [...SITES].sort((a, b) => a.year - b.year);

const trW = tr;

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
  const [era, setEra] = useState("all");
  const eraF = ERAS.find((e) => e.id === era);
  const li = lang === "kk" ? 0 : lang === "ru" ? 1 : 2;
  const DECOR = useMemo(() => buildDecor(), []);
  const order = useMemo(() => [...REGIONS.filter((r) => !r.city), ...REGIONS.filter((r) => r.city)], []);
  const pos = (st) => {
    const r = REGIONS.find((q) => q.id === st.region);
    const c = (r && KZ_CENTERS[r.map]) || [500, 280];
    return [c[0] + (st.dx || 0), c[1] + (st.dy || 0)];
  };
  const silkD = SILK.map((id) => SITES.find((q) => q.id === id)).filter(Boolean).map(pos).reduce((d, p, i, a) => (i ? `${d} Q${(p[0] + a[i - 1][0]) / 2} ${(p[1] + a[i - 1][1]) / 2 - 26} ${p[0]} ${p[1]}` : `M${p[0]} ${p[1]}`), "");
  const hasSite = useMemo(() => new Set(SITES.map((q) => q.region)), []);

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
        <div className="head-tools">
          <LangPicker />
          <span className="chip gold">🏺 {t.sitesDone(count, SITES.length)}</span>
        </div>
      </header>

      <section className="card map-card hist-map">
        <div className="hm-eras">
          {ERAS.map((e) => (
            <button key={e.id} className={`chip ${era === e.id ? "gold" : ""}`} onClick={() => setEra(e.id)}>{e.n[li]}</button>
          ))}
        </div>
        <div className="kzmap-wrap sky hist">
          <div className="sky-stars" aria-hidden />
          <div className="map-sun" aria-hidden />
          <svg className="kzmap kz3d" viewBox={KZ_VIEW} role="img" aria-label={t.histTitle}>
            <defs>
              <linearGradient id="tfSteppe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9c78a" /><stop offset="1" stopColor="#b9a25f" /></linearGradient>
              <linearGradient id="tfForest" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9c77a" /><stop offset="1" stopColor="#9aa25a" /></linearGradient>
              <linearGradient id="tfDesert" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f0dc9e" /><stop offset="1" stopColor="#dcb465" /></linearGradient>
              <linearGradient id="tfMountain" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8b98a" /><stop offset="1" stopColor="#a08b5e" /></linearGradient>
              <filter id="softSh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="2.4" floodColor="#2a1708" floodOpacity=".35" /></filter>
              <filter id="glowF" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              <clipPath id="landClip">{order.map((r) => <path key={r.id} d={KZ_PATHS[r.map]} />)}</clipPath>
              <KzSymbols />
              <HistSymbols />
            </defs>
            <g className="kz-foam" aria-hidden="true">{order.map((r) => <path key={r.id} d={KZ_PATHS[r.map]} />)}</g>
            <g className="kz-cliff2" aria-hidden="true">{order.map((r) => <path key={r.id} d={KZ_PATHS[r.map]} transform="translate(0 15)" />)}</g>
            <g className="kz-cliff1" aria-hidden="true">{order.map((r) => <path key={r.id} d={KZ_PATHS[r.map]} transform="translate(0 7)" />)}</g>
            {order.map((r) => (
              <path key={r.id} d={KZ_PATHS[r.map]} className={`reg tf-${TERRAIN[r.map] || "steppe"} ${hasSite.has(r.id) ? "hs" : ""}`} />
            ))}
            <g pointerEvents="none">
              {LAKES.map((d, i) => <path key={i} d={d} className="kz-lake" />)}
              <g clipPath="url(#landClip)">{RIVERS.map((d, i) => (<g key={i}><path d={d} className="kz-river" /><path d={d} className="kz-river-flow" /></g>))}</g>
              {DECOR.map((it, i) => {
                const h = it.k === "mountain" ? it.w * 0.75 : it.k === "pine" ? it.w * 1.38 : it.k === "yurt" ? it.w * 0.82 : it.k === "dune" ? it.w * 0.37 : it.k === "camelS" ? it.w * 0.82 : it.w * 0.67;
                return <use key={i} href={`#ks-${it.k}`} x={it.x - it.w / 2} y={it.y - h} width={it.w} height={h} opacity=".85" />;
              })}
              <path d={silkD} className="silk-road" />
            </g>
            {SITES.map((st) => {
              const [cx, cy] = pos(st);
              const on = eraF.f(st.year);
              const W = 52;
              return (
                <g key={st.id} transform={`translate(${cx} ${cy})`} className={`hm-site ${sel === st.id ? "sel" : ""} ${on ? "" : "dim"} ${done[st.id] ? "got" : ""}`} onClick={() => pick(st.id)} role="button" tabIndex={0} aria-label={L(st.name, lang)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && pick(st.id)}>
                  <ellipse className="kz-lm-sh" cx="0" cy="6" rx={W * 0.42} ry="6" />
                  <g className="kz-lm-art" filter="url(#softSh)"><use href={`#${symId(st.sym)}`} x={-W / 2} y={-W + 8} width={W} height={W} /></g>
                  <g className="hm-treasure" transform={`translate(${st.tdx} ${st.tdy - 36})`}>
                    <circle r="21" className="hm-halo" />
                    <use href={`#${st.tsym}`} x="-17" y="-17" width="34" height="34" />
                  </g>
                  {done[st.id] && <g className="kz-badge" transform="translate(-30 -52)"><circle r="9" /><path d="M-4 0 L-1 3.4 L5 -3.4" /></g>}
                  <text className="kz-lm-name" y="22" textAnchor="middle">{L(st.name, lang)}</text>
                  <text className="hm-year" y="34" textAnchor="middle">{fmtYear(st.year, lang)}</text>
                </g>
              );
            })}
          </svg>
          <div className="sky-hint">{x.tapHint}</div>
        </div>
        <ul className="hm-treasures">
          {SORTED.filter((st) => eraF.f(st.year)).map((st) => (
            <li key={st.id}>
              <button className={sel === st.id ? "on" : ""} onClick={() => pick(st.id)}>
                <svg viewBox="0 0 64 64" width="38" height="38"><use href={`#${st.tsym}`} /></svg>
                <span><b>{L(st.treasure, lang)}</b><small>{L(st.name, lang)} · {fmtYear(st.year, lang)}</small></span>
              </button>
            </li>
          ))}
        </ul>
      </section>

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
            <span className="art-e" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}><svg viewBox="0 0 64 64" width="84" height="84"><use href={`#${site.tsym}`} /></svg></span>
          </div>
          <div>
            <span className="badge">{L(site.era, lang)}</span>
            <h2>{L(site.name, lang)}</h2>
            <p className="site-treasure">💎 {L(site.treasure, lang)}</p>
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
