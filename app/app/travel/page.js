"use client";
import LangPicker from "../../components/LangPicker";
import KzSymbols from "../../components/KzSymbols";
import { buildDecor, TERRAIN, LANDMARK, RIVERS, LAKES } from "../../../lib/kzscene";
import dynamic from "next/dynamic";
import SightArt, { kindOf, RegionScene } from "../../components/SightArt";
import { REGION_ABOUT } from "../../../lib/regionAbout";
import { whenIdle } from "../../../lib/idle";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "../../components/Store";
import Qyran from "../../components/Qyran";
import Icon from "../../components/Icon";
import Quiz from "../../components/Quiz";
import { tx } from "../../../lib/tx";
import { REGIONS } from "../../../lib/regions";
import { KZ_CENTERS, KZ_PATHS, KZ_VIEW } from "../../../lib/kzmap";
import { L } from "../../../lib/i18n";
import { shuffle, tr } from "../../../lib/wordTools";

// Өңір атласы (көрікті жерлер мәтіндерімен) тек өңір таңдалғанда керек: бөлек чанк, бет ашылған соң алдын ала жүктеледі
const loadAtlas = () => import("../../components/RegionAtlas");
const RegionAtlas = dynamic(() => import("../../components/RegionAtlas"), { loading: () => <section className="ra" aria-busy="true" style={{ minHeight: 420 }} /> });

const CITY_IDS = ["astana", "almaty-city", "shymkent"];

const trW = tr;

// Баннерге «Өңір туралы» мәтінінің алғашқы сөйлемі
const teaser = (t) => {
  const first = (t || "").split(/(?<=[.!?])\s+/)[0] || "";
  return first.length > 150 ? first.slice(0, 150).replace(/\s+\S*$/, "") + "…" : first;
};

function buildQuiz(r, t, lang, explain) {
  const centers = shuffle(REGIONS.filter((x) => x.id !== r.id).map((x) => L(x.center, lang))).slice(0, 3);
  const qs = [
    {
      prompt: t.quizCenter(L(r.name, lang)),
      options: shuffle([L(r.center, lang), ...centers]).map((c) => ({ key: c, label: c })),
      answer: L(r.center, lang),
    },
  ];
  const pool = REGIONS.flatMap((x) => x.words);
  for (const w of r.words) {
    const others = shuffle(pool.filter((p) => trW(p, explain) !== trW(w, explain))).slice(0, 3);
    qs.push({
      prompt: t.quizWord(w.kk),
      options: shuffle([w, ...others]).map((o) => ({ key: o.kk + trW(o, explain), label: trW(o, explain), e: o.e })),
      answer: w.kk + trW(w, explain),
    });
  }
  return qs;
}

const shortName = (r, lang) => {
  const n = L(r.name, lang).replace(/ қаласы$|^город |^г\. | city$| city/gi, "").replace(/ облысы$/, " обл.").replace(/ область$/, " обл.").replace(/ region$/i, "");
  return n.length > 15 ? L(r.center, lang) : n;
};

function Travel() {
  const { t, lang, explain, state, update, award, saveWord } = useApp();
  const params = useSearchParams();
  const [sel, setSel] = useState(null);
  const [q, setQ] = useState("");
  const [flipped, setFlipped] = useState({});
  const [quiz, setQuiz] = useState(null);
  const [result, setResult] = useState(null);
  const panelRef = useRef(null);
  const [hov, setHov] = useState(null);
  const prevRef = useRef(null);
  const [trail, setTrail] = useState(null);

  useEffect(() => whenIdle(loadAtlas), []);

  useEffect(() => {
    const id = params.get("r");
    if (id && REGIONS.some((r) => r.id === id)) pick(id, false);
  }, [params]);

  const region = REGIONS.find((r) => r.id === sel);
  const stamps = state.stamps || {};
  const count = Object.keys(stamps).length;
  const byMap = useMemo(() => Object.fromEntries(REGIONS.map((r) => [r.map, r])), []);

  function pick(id, scroll = true) {
    const from = prevRef.current ? KZ_CENTERS[REGIONS.find((r) => r.id === prevRef.current)?.map] : null;
    const to = KZ_CENTERS[REGIONS.find((r) => r.id === id)?.map];
    if (from && to) setTrail({ from, to, k: Date.now() });
    prevRef.current = id;
    setSel(id);
    setFlipped({});
    setQuiz(null);
    setResult(null);
    if (scroll) setTimeout(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }

  const ctr = (r) => KZ_CENTERS[r.map];
  const [VW, VH] = KZ_VIEW.split(" ").slice(2).map(Number);
  // Жұлдыз картасы: әр өңір ең жақын екі көршісімен жіппен байланысады
  const links = useMemo(() => {
    const pts = REGIONS.filter((r) => KZ_CENTERS[r.map]);
    const seen = new Set();
    const out = [];
    for (const a of pts) {
      const [ax, ay] = KZ_CENTERS[a.map];
      pts
        .filter((b) => b !== a)
        .map((b) => ({ b, d: Math.hypot(KZ_CENTERS[b.map][0] - ax, KZ_CENTERS[b.map][1] - ay) }))
        .sort((m, n) => m.d - n.d)
        .slice(0, 2)
        .forEach(({ b }) => {
          const k = [a.id, b.id].sort().join("|");
          if (!seen.has(k)) {
            seen.add(k);
            out.push([a, b]);
          }
        });
    }
    return out;
  }, []);
  // Саяхат жолың: мөр басқан өңірлер реті бойынша алтын сызық
  const route = REGIONS.filter((r) => stamps[r.id] && ctr(r)).sort((a, b) => stamps[a.id] - stamps[b.id]).map(ctr);
  const routeD = route.reduce((d, p, i) => {
    if (!i) return `M${p[0]} ${p[1]}`;
    const q = route[i - 1];
    const mx = (p[0] + q[0]) / 2;
    const my = (p[1] + q[1]) / 2 - Math.hypot(p[0] - q[0], p[1] - q[1]) * 0.18;
    return `${d} Q${mx} ${my} ${p[0]} ${p[1]}`;
  }, "");
  const eagleAt = (region && ctr(region)) || KZ_CENTERS["Астана"] || [500, 200];
  const hovR = hov && REGIONS.find((r) => r.id === hov);
  const x = tx(lang);
  const DECOR = useMemo(() => buildDecor(), []);

  const matches = q.trim()
    ? REGIONS.filter((r) => `${r.name.kk} ${r.name.ru} ${r.name.en} ${r.center.kk} ${r.center.ru} ${r.center.en}`.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 6)
    : [];

  function finishQuiz(right, total) {
    const ok = right >= 4;
    setResult({ right, total, ok });
    if (ok && !stamps[region.id]) {
      update((s) => ({ ...s, stamps: { ...s.stamps, [region.id]: Date.now() } }));
      award(30, 15, `${t.stampGot} +30 XP`);
    } else if (ok) award(5, 2);
    else award(2, 0);
  }

  // Карта: облыстар алдымен, қалалар үстінде
  const order = [...REGIONS.filter((r) => !r.city), ...REGIONS.filter((r) => r.city)];

  return (
    <div className="travel">
      <header className="page-head">
        <div>
          <span className="kicker">{t.travelKicker}</span>
          <h1>{t.travelTitle}</h1>
          <p>{t.travelSub}</p>
        </div>
        <div className="head-tools">
          <LangPicker />
          <span className="chip gold"><Icon name="stamp" size={16} /> {t.stamps(count, REGIONS.length)}</span>
        </div>
      </header>

      <section className="card map-card map-split">
        <div className="map-main">
        <div className="kzmap-wrap sky" onMouseLeave={() => setHov(null)}>
          <div className="sky-stars" aria-hidden />
          <div className="map-sun" aria-hidden />
          <svg className="kzmap kz3d" viewBox={KZ_VIEW} role="img" aria-label={t.travelTitle}>
            <defs>
              <linearGradient id="tfSteppe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c4de64" /><stop offset="1" stopColor="#8fc23f" /></linearGradient>
              <linearGradient id="tfForest" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7cc04e" /><stop offset="1" stopColor="#4a9a3a" /></linearGradient>
              <linearGradient id="tfDesert" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4dd96" /><stop offset="1" stopColor="#e2b85f" /></linearGradient>
              <linearGradient id="tfMountain" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a9c76a" /><stop offset="1" stopColor="#7ea653" /></linearGradient>
              <linearGradient id="stampG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffe48a" /><stop offset="1" stopColor="#e39b00" /></linearGradient>
              <linearGradient id="selG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4fd3e4" /><stop offset="1" stopColor="#0a7f99" /></linearGradient>
              <filter id="glowF" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="softSh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="2.4" floodColor="#2a1708" floodOpacity=".35" /></filter>
              <clipPath id="landClip">{order.map((r) => <path key={r.id} d={KZ_PATHS[r.map]} />)}</clipPath>
              <KzSymbols />
            </defs>
            {/* Жағалау көбігі және жартас (3D) */}
            <g className="kz-foam" aria-hidden="true">{order.map((r) => <path key={r.id} d={KZ_PATHS[r.map]} />)}</g>
            <g className="kz-cliff2" aria-hidden="true">{order.map((r) => <path key={r.id} d={KZ_PATHS[r.map]} transform="translate(0 15)" />)}</g>
            <g className="kz-cliff1" aria-hidden="true">{order.map((r) => <path key={r.id} d={KZ_PATHS[r.map]} transform="translate(0 7)" />)}</g>
            {order.map((r, i) => (
              <path
                key={r.id}
                d={KZ_PATHS[r.map]}
                className={`reg tf-${TERRAIN[r.map] || "steppe"} ${stamps[r.id] ? "done" : ""} ${sel === r.id ? "sel" : ""} ${r.city ? "city" : ""}`}
                style={{ "--tone": `${(i * 37) % 100}` }}
                onClick={() => pick(r.id)}
                onMouseEnter={() => setHov(r.id)}
                onFocus={() => setHov(r.id)}
                tabIndex={0}
                role="button"
                aria-label={`${L(r.name, lang)}: ${stamps[r.id] ? t.visited : t.notVisited}`}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && pick(r.id)}
              />
            ))}
            <g pointerEvents="none">
              {LAKES.map((d, i) => <path key={i} d={d} className="kz-lake" />)}
              <g clipPath="url(#landClip)">{RIVERS.map((d, i) => (<g key={i}><path d={d} className="kz-river" /><path d={d} className="kz-river-flow" /></g>))}</g>
              {DECOR.map((it, i) => {
                const h = it.k === "mountain" ? it.w * 0.75 : it.k === "pine" ? it.w * 1.38 : it.k === "yurt" ? it.w * 0.82 : it.k === "dune" ? it.w * 0.37 : it.k === "camelS" ? it.w * 0.82 : it.w * 0.67;
                return <use key={i} href={`#ks-${it.k}`} x={it.x - it.w / 2} y={it.y - h} width={it.w} height={h} />;
              })}
              {routeD && <path d={routeD} className="journey" filter="url(#glowF)" />}
              {trail && <path key={trail.k} className="flight" d={`M${trail.from[0]} ${trail.from[1]} Q${(trail.from[0] + trail.to[0]) / 2} ${(trail.from[1] + trail.to[1]) / 2 - 60} ${trail.to[0]} ${trail.to[1]}`} />}
            </g>
            {/* Өңірлердің үлкен белгілері */}
            {REGIONS.map((r) => {
              const c = ctr(r);
              if (!c) return null;
              const sym = LANDMARK[r.id] || "yurt";
              const W = r.city ? 52 : 62;
              const H = sym === "baiterek" ? W * 1.2 : sym === "mountain" ? W * 0.75 : W;
              return (
                <g key={r.id} transform={`translate(${c[0]} ${c[1]})`} className={`kz-lm ${stamps[r.id] ? "got" : ""} ${hov === r.id ? "hot" : ""} ${sel === r.id ? "sel" : ""}`}
                  onClick={() => pick(r.id)} onMouseEnter={() => setHov(r.id)} role="presentation">
                  <ellipse className="kz-lm-sh" cx="0" cy="6" rx={W * 0.4} ry="5" />
                  <g className="kz-lm-art" filter="url(#softSh)"><use href={`#ks-${sym}`} x={-W / 2} y={-H + 8} width={W} height={H} /></g>
                  {stamps[r.id] && <g className="kz-badge" transform={`translate(${W * 0.32} ${-H * 0.55})`}><circle r="9" /><path d="M-4 0 L-1 3.4 L5 -3.4" /></g>}
                  <text className="kz-lm-name" y="20" textAnchor="middle">{shortName(r, lang)}</text>
                </g>
              );
            })}
            <g pointerEvents="none">
              <g className={`eagle ${trail ? "flying" : ""}`} style={{ transform: `translate(${eagleAt[0] + 40}px, ${eagleAt[1] - 6}px)` }}>
                <circle className="eagle-ring" r="16" />
                <g className="eagle-fly">
                  <g transform="translate(-26 -86) scale(0.26)">
                    <Qyran mood="happy" size={200} />
                  </g>
                </g>
              </g>
            </g>
          </svg>
          {hovR && ctr(hovR) && (
            <div className="map-chip" style={{ left: `${(ctr(hovR)[0] / VW) * 100}%`, top: `${(ctr(hovR)[1] / VH) * 100}%` }}>
              <b>{L(hovR.name, lang)}</b>
              <span>{L(hovR.center, lang)}{stamps[hovR.id] ? ` · ${t.visited}` : ""}</span>
            </div>
          )}
          <div className="sky-hint">{x.tapHint}</div>
        </div>
        </div>
        <aside className="map-side">
          <div className="side-prog">
            <div className="ring" style={{ "--p": `${Math.round((count / REGIONS.length) * 100)}%` }}><b>{count}</b><small>/ {REGIONS.length}</small></div>
            <div><h3>{t.stamps(count, REGIONS.length)}</h3><div className="map-legend"><span><i className="lg-done" /> {t.visited}</span><span><i className="lg-todo" /> {t.notVisited}</span></div></div>
          </div>
        <div className="map-tools">
          <div className="search">
            <Icon name="search" size={18} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.searchRegion} aria-label={t.searchRegion} />
            {matches.length > 0 && (
              <div className="search-pop">
                {matches.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      pick(r.id);
                      setQ("");
                    }}
                  >
                    {L(r.name, lang)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="map-legend">
            <span>
              <i className="lg-done" /> {t.visited}
            </span>
            <span>
              <i className="lg-todo" /> {t.notVisited}
            </span>
          </div>
        </div>
          <ul className="reg-list">
            {order.map((r) => (
              <li key={r.id}>
                <button className={`${sel === r.id ? "on" : ""} ${stamps[r.id] ? "got" : ""}`} onClick={() => pick(r.id)} onMouseEnter={() => setHov(r.id)} onMouseLeave={() => setHov(null)}>
                  <span className="rl-e"><SightArt kind={kindOf(r.sights[0])} mini />{stamps[r.id] && <span className="rl-ok"><Icon name="check" size={11} /></span>}</span>
                  <span className="rl-t"><b>{L(r.name, lang)}</b><small>{L(r.center, lang)}</small></span>
                </button>
              </li>
            ))}
          </ul>
          <p className="muted small map-note">{t.mapNote} © OpenStreetMap</p>
        </aside>
        
      </section>

      <div ref={panelRef} className="region-anchor" />
      {region ? (
        <section className="card region rise" key={region.id}>
          <div className="region-hero">
            <RegionScene region={region} />
            <span className="region-shade" />
            <div className="region-title">
              <h2>{L(region.name, lang)}</h2>
              <span>
                {t.regionCenter}: <b>{L(region.center, lang)}</b>
              </span>
              {REGION_ABOUT[region.id] && <p className="region-tease">{teaser(L(REGION_ABOUT[region.id], lang))}</p>}
            </div>
            {stamps[region.id] && <span className="stamp-mark pop"><Icon name="stamp" size={16} /> {t.visited}</span>}
          </div>

          <RegionAtlas region={region} lang={lang} />
          <div className="region-body">
            <div className="region-info">
              <div className="fact">
                <Qyran mood="wow" size={56} />
                <p>
                  <b>{t.fact}: </b>
                  {L(region.fact, lang)}
                </p>
              </div>
            </div>

            <div className="region-words">
              <h3>{t.learnWords}</h3>
              <p className="muted small">{t.tapCard}</p>
              <div className="flip-grid">
                {region.words.map((w) => (
                  <button
                    key={w.kk}
                    className={`flip ${flipped[w.kk] ? "on" : ""}`}
                    onClick={() => {
                      setFlipped((f) => ({ ...f, [w.kk]: !f[w.kk] }));
                      if (!flipped[w.kk]) saveWord({ kk: w.kk, tr: trW(w, explain), e: w.e, src: region.id });
                    }}
                  >
                    <span className="flip-in">
                      <span className="flip-f">
                        <b>{w.kk}</b>
                      </span>
                      <span className="flip-b">
                        <b>{trW(w, explain)}</b>
                        <small>{w.kk}</small>
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="region-quiz">
            {quiz ? (
              <>
                <Quiz questions={quiz} onDone={finishQuiz} pass={4} />
                {result && (
                  <div className={`alert ${result.ok ? "ok" : ""} rise`}>
                    {result.ok ? t.stampGot : t.stampMiss}
                    <button className="btn ghost small" onClick={() => { setQuiz(buildQuiz(region, t, lang, explain)); setResult(null); }}>
                      <Icon name="refresh" size={15} /> {t.retry}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button className="btn gold big" onClick={() => setQuiz(buildQuiz(region, t, lang, explain))}>
                <Icon name="stamp" size={20} /> {t.takeQuiz}
              </button>
            )}
          </div>
        </section>
      ) : (
        <section className="card pick-hint">
          <Qyran mood="think" size={90} />
          <p>{t.travelSub}</p>
        </section>
      )}

      <section className="passport">
        <h2>
          <Icon name="stamp" size={22} /> {t.passport} <span className="muted small">{t.stamps(count, REGIONS.length)}</span>
        </h2>
        <div className="stamp-grid">
          {REGIONS.map((r) => (
            <button key={r.id} className={`stamp ${stamps[r.id] ? "got" : ""}`} onClick={() => pick(r.id)} title={L(r.name, lang)}>
              <span className="stamp-e"><SightArt kind={kindOf(r.sights[0])} mini /></span>
              <span className="stamp-n">{L(r.center, lang)}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Travel />
    </Suspense>
  );
}
