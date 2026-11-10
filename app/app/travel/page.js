"use client";
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
import { shuffle } from "../../../lib/words";
import { photoUrl } from "../../../lib/photo";

const CITY_IDS = ["astana", "almaty-city", "shymkent"];

function trW(w, lang) {
  return lang === "en" || !["ru", "kk"].includes(lang) ? w.en : w.ru;
}

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
        <span className="chip gold">🛂 {t.stamps(count, REGIONS.length)}</span>
      </header>

      <section className="card map-card">
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
                    {r.e} {L(r.name, lang)}
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
        <div className="kzmap-wrap sky" onMouseLeave={() => setHov(null)}>
          <div className="sky-stars" aria-hidden />
          <svg className="kzmap" viewBox={KZ_VIEW} role="img" aria-label={t.travelTitle}>
            <defs>
              <linearGradient id="stampG" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ffe48a" />
                <stop offset="1" stopColor="#f2b100" />
              </linearGradient>
              <linearGradient id="selG" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#7ff0ff" />
                <stop offset="1" stopColor="#2f7bff" />
              </linearGradient>
              <filter id="glowF" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {order.map((r, i) => (
              <path
                key={r.id}
                d={KZ_PATHS[r.map]}
                className={`reg ${stamps[r.id] ? "done" : ""} ${sel === r.id ? "sel" : ""} ${r.city ? "city" : ""}`}
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
              {links.map(([a, b]) => {
                const on = stamps[a.id] && stamps[b.id];
                const [x1, y1] = ctr(a);
                const [x2, y2] = ctr(b);
                return <line key={a.id + b.id} x1={x1} y1={y1} x2={x2} y2={y2} className={`const ${on ? "on" : ""}`} />;
              })}
              {REGIONS.map((r) => {
                const c = ctr(r);
                if (!c) return null;
                return (
                  <g key={r.id} transform={`translate(${c[0]} ${c[1]})`} className={`reg-pin ${stamps[r.id] ? "got" : ""}`}>
                    {r.city ? <circle r="6" className="city-dot" /> : <circle r="3.4" className="star" style={{ animationDelay: `${(r.id.length % 7) * 0.4}s` }} />}
                    {!r.city && <text className="reg-e" textAnchor="middle" dy="-8">{stamps[r.id] ? "🛂" : r.e}</text>}
                  </g>
                );
              })}
              {routeD && <path d={routeD} className="journey" filter="url(#glowF)" />}
              {trail && <path key={trail.k} className="flight" d={`M${trail.from[0]} ${trail.from[1]} Q${(trail.from[0] + trail.to[0]) / 2} ${(trail.from[1] + trail.to[1]) / 2 - 60} ${trail.to[0]} ${trail.to[1]}`} />}
              <g className="eagle" style={{ transform: `translate(${eagleAt[0]}px, ${eagleAt[1]}px)` }}>
                <circle className="eagle-ring" r="16" />
                <g className="eagle-fly">
                  <g transform="translate(-26 -52) scale(0.26)">
                    <Qyran mood="happy" size={200} />
                  </g>
                </g>
              </g>
            </g>
          </svg>
          {hovR && ctr(hovR) && (
            <div className="map-chip" style={{ left: `${(ctr(hovR)[0] / VW) * 100}%`, top: `${(ctr(hovR)[1] / VH) * 100}%` }}>
              <b>{hovR.e} {L(hovR.name, lang)}</b>
              <span>{L(hovR.center, lang)}{stamps[hovR.id] ? " · 🛂" : ""}</span>
            </div>
          )}
          <div className="sky-hint">{x.tapHint}</div>
        </div>
        <p className="muted small map-note">{t.mapNote} © OpenStreetMap</p>
      </section>

      <div ref={panelRef} className="region-anchor" />
      {region ? (
        <section className="card region rise" key={region.id}>
          <div className="region-hero">
            {region.photo ? <img src={photoUrl(region.photo, 1400, 600)} alt="" /> : <span className="region-e">{region.e}</span>}
            <span className="region-shade" />
            <div className="region-title">
              <h2>{L(region.name, lang)}</h2>
              <span>
                {t.regionCenter}: <b>{L(region.center, lang)}</b>
              </span>
            </div>
            {stamps[region.id] && <span className="stamp-mark pop">🛂 {t.visited}</span>}
          </div>

          <div className="region-body">
            <div className="region-info">
              <h3>{t.sights}</h3>
              <div className="chips-row">
                {region.sights.map((s) => (
                  <span key={s.kk} className="chip">
                    📍 {L(s, lang)}
                  </span>
                ))}
              </div>
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
                        <span className="flip-e">{w.e}</span>
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
                    {result.ok ? (stamps[region.id] ? `🛂 ${t.stampGot}` : t.stampGot) : t.stampMiss}
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
          🛂 {t.passport} <span className="muted small">{t.stamps(count, REGIONS.length)}</span>
        </h2>
        <div className="stamp-grid">
          {REGIONS.map((r) => (
            <button key={r.id} className={`stamp ${stamps[r.id] ? "got" : ""}`} onClick={() => pick(r.id)} title={L(r.name, lang)}>
              <span className="stamp-e">{r.e}</span>
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
