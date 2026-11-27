"use client";
import "../../history.css";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../../components/Store";
import Qyran from "../../components/Qyran";
import Icon from "../../components/Icon";
import Quiz from "../../components/Quiz";
import KzSymbols from "../../components/KzSymbols";
import HistSymbols from "../../components/HistSymbols";
import { buildDecor, TERRAIN, RIVERS, LAKES } from "../../../lib/kzscene";
import { KZ_CENTERS, KZ_PATHS, KZ_VIEW } from "../../../lib/kzmap";
import { SITES } from "../../../lib/history";
import { HIST_TEXT, keySentence } from "../../../lib/historyText";
import { REGIONS } from "../../../lib/regions";
import { useHistoryL10n, HIST_UI, histTr, hl } from "../../../lib/l10nHistory";
import { useTravelL10n } from "../../../lib/l10nTravel";
import { L } from "../../../lib/i18n";
import { shuffle, tr } from "../../../lib/wordTools";
import { tx } from "../../../lib/tx";
import { useReveal, useTilt, reducedMotion } from "../travel/fx";
import { hm3t } from "../../components/HistMap3DL10n";

// Жәдігерлер галереясы өз қойындысында: коды, мәтіндері мен three.js тек қойынды ашылғанда жүктеледі
const ArtifactGallery = dynamic(() => import("../../components/ArtifactGallery"), { ssr: false, loading: () => <section className="card ag-loading" aria-busy="true" style={{ minHeight: 420 }} /> });
// Орын карточкасындағы «3D-де қарау»: галерея торынсыз, тек көрермен терезесі
const ArtifactViewer = dynamic(() => import("../../components/ArtifactGallery").then((m) => m.ArtifactViewer), {
  ssr: false,
  loading: () => <div className="hz-view-wait" aria-busy="true"><span className="hm3-spin" aria-hidden="true" /></div>,
});
const preloadGallery = () => import("../../components/ArtifactGallery");

// 3D карта (three.js) тек клиентте және тек осы бетте жүктеледі; WebGL болмаса — бұрынғы 2D SVG карта
const HistMap3D = dynamic(() => import("../../components/HistMap3D"), {
  ssr: false,
  loading: () => <div className="hm3-wrap hm3-boot" aria-busy="true"><div className="hm3-loading"><span className="hm3-spin" aria-hidden="true" /></div></div>,
});

function useCountUp(target, ms = 1100) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    // «Қозғалысты азайту» қосулы болса — жыл бірден ауысады
    if (reducedMotion()) {
      from.current = target;
      setV(target);
      return;
    }
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
  const tpl = HIST_UI[lang]?.[y < 0 ? "YEAR.bc" : "YEAR.ad"];
  if (tpl) return tpl.replace("{n}", n);
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
const PART_ICON = ["search", "home", "star", "sparkle"];
const TR_KEY = "qd_hist_tr";

const SORTED = [...SITES].sort((a, b) => a.year - b.year);
const ORDER = [...REGIONS.filter((r) => !r.city), ...REGIONS.filter((r) => r.city)];
const HAS_SITE = new Set(SITES.map((q) => q.region));
const pos = (st) => {
  const r = REGIONS.find((q) => q.id === st.region);
  const c = (r && KZ_CENTERS[r.map]) || [500, 280];
  return [c[0] + (st.dx || 0), c[1] + (st.dy || 0)];
};
const SILK_PTS = SILK.map((id) => SITES.find((q) => q.id === id)).filter(Boolean).map(pos);
const SILK_D = SILK_PTS.reduce((d, p, i, a) => (i ? `${d} Q${(p[0] + a[i - 1][0]) / 2} ${(p[1] + a[i - 1][1]) / 2 - 26} ${p[0]} ${p[1]}` : `M${p[0]} ${p[1]}`), "");

// Шежіре безендіруі: балауыз мөр, бұрыштағы қошқар мүйіз өрнегі, киіз медальон
function HistSeal({ size = 40 }) {
  return (
    <svg className="hist-seal" viewBox="0 0 40 40" width={size} height={size} aria-hidden="true" focusable="false">
      <path className="hs-wax" d="M20 2.5c3 0 4 2.2 6.6 3s5-.4 6.8 1.8.4 4.8 1.4 7.3 3 3.6 2.7 6.4-2.6 3.6-3.4 6.2.6 5.1-1.6 6.9-4.7.6-7.3 1.6S23 39.5 20 39.5s-4-2.6-6.6-3.6-5.2.4-7.3-1.6-.8-4.4-1.6-6.9-3.1-3.4-3.4-6.2 1.7-3.9 2.7-6.4-.4-5.1 1.4-7.3 4.2-1 6.8-1.8S17 2.5 20 2.5Z" />
      <circle className="hs-ring" cx="20" cy="21" r="11.5" />
      <path className="hs-mark" d="M14.5 21.2l3.8 3.8 7.4-8" />
    </svg>
  );
}

function HistCorner({ c }) {
  return (
    <svg className={`hf-corner ${c}`} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path d="M4 44V12a8 8 0 0 1 8-8h32" />
      <path className="hf-horn" d="M17 17c6 0 9 3 9 7.5S22 30 19.5 27.5 20 22 23 23" />
      <circle cx="4" cy="44" r="2.6" />
      <circle cx="44" cy="4" r="2.6" />
    </svg>
  );
}

function HistFelt() {
  // Киіз медальон: тігіс жолы бар ойық шеңбер
  const pts = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    const r = i % 2 ? 58 : 63;
    return `${(64 + Math.cos(a) * r).toFixed(1)} ${(64 + Math.sin(a) * r).toFixed(1)}`;
  });
  return (
    <svg className="hist-felt" viewBox="0 0 128 128" aria-hidden="true" focusable="false">
      <path className="hfl-a" d={`M${pts.join(" L")}Z`} />
      <circle className="hfl-b" cx="64" cy="64" r="49" />
      <circle className="hfl-st" cx="64" cy="64" r="44" />
      <circle className="hfl-c" cx="64" cy="64" r="38" />
    </svg>
  );
}

// 3D белгісі (Icon.js-те жоқ): изометриялық текше
function Cube({ size = 18 }) {
  return (
    <svg className="ic" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Zm0 9 8-4.5M12 12v9m0-9L4 7.5" />
    </svg>
  );
}

// Тест сәтті біткенде: балауыз мөр басылып, айналасына алтын ұшқындар шашырайды (тек transform/opacity)
function HistBurst() {
  return (
    <span className="hz-burst" aria-hidden="true">
      <span className="hzb-ring" />
      {Array.from({ length: 10 }, (_, k) => (
        <i key={k} style={{ "--a": `${k * 36}deg` }} />
      ))}
      <span className="hzb-seal"><HistSeal size={40} /></span>
    </span>
  );
}

// Тест: алдымен мәтін бойынша 3 сұрақ (жауабы мәтінде бар), сосын орынның 3 сөзі
function buildQuiz(site, explain, H) {
  const txt = HIST_TEXT[site.id];
  const qs = (txt?.quiz || []).map((q, i) => {
    const trq = explain !== "kk" ? histTr(explain, `Q.${site.id}.${i}`) : "";
    const proof = keySentence(site.id, q.key);
    return {
      prompt: trq ? `${q.q}\n${trq}` : q.q,
      options: shuffle(q.a.map((label, k) => ({ key: String(k), label }))),
      answer: "0",
      why: proof ? `${H.inText} «${proof}»` : "",
    };
  });
  const pool = SITES.flatMap((s) => s.words);
  for (const w of site.words) {
    const others = shuffle(pool.filter((p) => tr(p, explain) !== tr(w, explain))).slice(0, 3);
    qs.push({
      prompt: H.wordQ(w.kk),
      options: shuffle([w, ...others]).map((o) => ({ key: o.kk, label: tr(o, explain) })),
      answer: w.kk,
    });
  }
  return qs;
}

export default function History() {
  const { t, lang, explain, state, update, award, saveWord } = useApp();
  useHistoryL10n(lang, explain);
  useTravelL10n(lang);
  const H = hl(lang);
  const [sel, setSel] = useState(SORTED[0].id);
  const [quiz, setQuiz] = useState(null);
  const [res, setRes] = useState(null);
  const [tab, setTab] = useState("sites");
  const [artsOn, setArtsOn] = useState(false);
  const [view, setView] = useState(null);
  const [showTr, setShowTr] = useState(false);
  const panel = useRef(null);
  const riverRef = useRef(null);
  const rootRef = useRef(null);
  const viewBtn = useRef(null);
  const tabRefs = useRef({});
  const site = SITES.find((s) => s.id === sel);
  const txt = HIST_TEXT[site.id];
  const done = state.sites || {};
  const count = Object.keys(done).length;
  const reg = REGIONS.find((r) => r.id === site.region);
  const idx = SORTED.findIndex((q) => q.id === sel);
  const year = useCountUp(site.year);
  const x = tx(lang);
  const [era, setEra] = useState("all");
  const eraF = ERAS.find((e) => e.id === era);
  const li = lang === "kk" ? 0 : lang === "ru" ? 1 : 2;
  const [map2d, setMap2d] = useState(false);
  // Аударма — түсіндіру тілінде (Әдебиеттегідей); түсіндіру тілі қазақша болса, батырма жоқ
  const trReady = explain !== "kk" && !!histTr(explain, `P.${site.id}.0`);
  const sites3d = useMemo(() => SORTED.map((st) => {
    const [mx, my] = pos(st);
    return { id: st.id, sym: symId(st.sym), tsym: st.tsym, name: L(st.name, lang), year: fmtYear(st.year, lang), x: mx, y: my, on: eraF.f(st.year), done: !!done[st.id] };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [lang, era, state.sites]);
  useReveal(rootRef);
  useTilt(rootRef);
  // Картаның өзгермейтін қабаттары бір рет салынады (шекара деректері DOM-да бір рет, қалғаны <use>)
  const MAP_DEFS = useMemo(() => (
    <defs>
      <linearGradient id="tfSteppe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9c78a" /><stop offset="1" stopColor="#b9a25f" /></linearGradient>
      <linearGradient id="tfForest" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9c77a" /><stop offset="1" stopColor="#9aa25a" /></linearGradient>
      <linearGradient id="tfDesert" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f0dc9e" /><stop offset="1" stopColor="#dcb465" /></linearGradient>
      <linearGradient id="tfMountain" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8b98a" /><stop offset="1" stopColor="#a08b5e" /></linearGradient>
      <filter id="softSh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="2.4" floodColor="#2a1708" floodOpacity=".35" /></filter>
      <g id="hkzLand">{ORDER.map((r, i) => <path key={r.id} id={`hkz${i}`} d={KZ_PATHS[r.map]} />)}</g>
      <clipPath id="landClip">{ORDER.map((r, i) => <use key={r.id} href={`#hkz${i}`} />)}</clipPath>
      <KzSymbols />
      <HistSymbols />
    </defs>
  ), []);
  const MAP_BASE = useMemo(() => {
    if (!map2d) return null;
    const decor = buildDecor();
    return (
      <>
        <g aria-hidden="true">
          <use href="#hkzLand" className="kz-foam" />
          <use href="#hkzLand" className="kz-cliff2" transform="translate(0 15)" />
          <use href="#hkzLand" className="kz-cliff1" transform="translate(0 7)" />
        </g>
        {ORDER.map((r) => (
          <path key={r.id} d={KZ_PATHS[r.map]} className={`reg tf-${TERRAIN[r.map] || "steppe"} ${HAS_SITE.has(r.id) ? "hs" : ""}`} />
        ))}
        <g pointerEvents="none">
          {LAKES.map((d, i) => <path key={i} d={d} className="kz-lake" />)}
          <g clipPath="url(#landClip)">{RIVERS.map((d, i) => <path key={i} d={d} className="kz-river" />)}{RIVERS.map((d, i) => <path key={`f${i}`} d={d} className="kz-river-flow" />)}</g>
          {decor.map((it, i) => {
            const h = it.k === "mountain" ? it.w * 0.75 : it.k === "pine" ? it.w * 1.38 : it.k === "yurt" ? it.w * 0.82 : it.k === "dune" ? it.w * 0.37 : it.k === "camelS" ? it.w * 0.82 : it.w * 0.67;
            return <use key={i} href={`#ks-${it.k}`} x={it.x - it.w / 2} y={it.y - h} width={it.w} height={h} opacity=".85" />;
          })}
          <path d={SILK_D} className="silk-road" />
        </g>
      </>
    );
  }, [map2d]);

  // Аударма көрсету таңдауы осы құрылғыда есте қалады (міндетті күй емес)
  useEffect(() => {
    try {
      setShowTr(localStorage.getItem(TR_KEY) === "1");
    } catch {}
    // Сілтеме #artifacts болса — бірден жәдігерлер қойындысы
    if (typeof location !== "undefined" && location.hash === "#artifacts") {
      setTab("arts");
      setArtsOn(true);
    }
  }, []);

  useEffect(() => {
    if (tab !== "sites") return;
    const el = riverRef.current?.querySelector(".tl-node.on");
    el?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", inline: "center", block: "nearest" });
  }, [sel, tab]);

  function pick(id) {
    setSel(id);
    setQuiz(null);
    setRes(null);
    setTimeout(() => panel.current?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" }), 60);
  }
  function finish(right, total) {
    const ok = right >= total - 1;
    setRes({ ok, right, total });
    if (ok && !done[site.id]) {
      update((s) => ({ ...s, sites: { ...s.sites, [site.id]: Date.now() } }));
      award(25, 10, `${t.badge} +25 XP`);
    } else award(ok ? 5 : 2, ok ? 2 : 0);
  }
  function openTab(id) {
    setTab(id);
    if (id === "arts") setArtsOn(true);
    try {
      history.replaceState(null, "", id === "arts" ? "#artifacts" : location.pathname + location.search);
    } catch {}
  }
  function onTabKey(e) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const next = tab === "sites" ? "arts" : "sites";
    const id = e.key === "Home" ? "sites" : e.key === "End" ? "arts" : next;
    openTab(id);
    tabRefs.current[id]?.focus();
  }
  function toggleTr() {
    setShowTr((v) => {
      try {
        localStorage.setItem(TR_KEY, v ? "0" : "1");
      } catch {}
      return !v;
    });
  }
  const closeView = useCallback(() => {
    setView(null);
    requestAnimationFrame(() => viewBtn.current?.focus({ preventScroll: true }));
  }, []);

  const quizLen = (txt?.quiz.length || 0) + site.words.length;

  return (
    <div className="history" ref={rootRef}>
      <header className="page-head hist-head">
        <div className="hist-head-t">
          <span className="kicker">{t.histKicker}</span>
          <h1>{t.histTitle}</h1>
          <p>{H.sub}</p>
        </div>
        <div className="hist-prog">
          <span className="hist-prog-t"><Icon name="scroll" size={16} /> {t.sitesDone(count, SITES.length)}</span>
          <span className="hist-prog-bar" aria-hidden="true"><i style={{ transform: `scaleX(${count / SITES.length})` }} /></span>
        </div>
      </header>

      <div className="hist-tabs" role="tablist" aria-label={t.histTitle} onKeyDown={onTabKey}>
        <button type="button" role="tab" id="htab-sites" aria-controls="hpanel-sites" aria-selected={tab === "sites"} tabIndex={tab === "sites" ? 0 : -1} className={tab === "sites" ? "on" : ""} onClick={() => openTab("sites")} ref={(el) => (tabRefs.current.sites = el)}>
          <Icon name="map" size={18} /> <span>{H.tabSites}</span>
        </button>
        <button type="button" role="tab" id="htab-arts" aria-controls="hpanel-arts" aria-selected={tab === "arts"} tabIndex={tab === "arts" ? 0 : -1} className={tab === "arts" ? "on" : ""} onClick={() => openTab("arts")} onPointerEnter={preloadGallery} onFocus={preloadGallery} ref={(el) => (tabRefs.current.arts = el)}>
          <Cube size={18} /> <span>{H.tabArts}</span>
        </button>
      </div>

      <div id="hpanel-sites" role="tabpanel" aria-labelledby="htab-sites" className="hist-panel" hidden={tab !== "sites"}>
        <section className="card map-card hist-map" data-rv="">
          <div className="hm-eras hist-ribbon">
            {ERAS.map((e, k) => {
              const list = SORTED.filter((st) => e.f(st.year));
              return (
                <button key={e.id} className={`hr-seg ${era === e.id ? "on" : ""}`} aria-pressed={era === e.id} onClick={() => setEra(e.id)} style={{ "--k": k }}>
                  <b>{HIST_UI[lang]?.[`ERA.${e.id}`] || e.n[li]}</b>
                  {list.length > 0 && <small>{fmtYear(list[0].year, lang)} – {fmtYear(list[list.length - 1].year, lang)}</small>}
                  <span className="hr-dots" aria-hidden="true">{list.map((st, d) => <i key={st.id} className={done[st.id] ? "got" : ""} style={{ "--d": d }} />)}</span>
                </button>
              );
            })}
          </div>
          {map2d ? (<>
          <div className="kzmap-wrap sky hist">
            <div className="sky-stars" aria-hidden />
            <div className="map-sun" aria-hidden />
            <svg className="kzmap kz3d" viewBox={KZ_VIEW} role="img" aria-label={t.histTitle}>
              {MAP_DEFS}
              {MAP_BASE}
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
          </div>
          <p className="hm3-note">{hm3t(lang).fallback}</p>
          </>) : (<>
            {/* 2D карта көрсетілмегенде де белгілер (<symbol>) уақыт жолы мен медальонға керек */}
            <svg className="hm3-defs" width="0" height="0" aria-hidden="true" focusable="false">{MAP_DEFS}</svg>
            <HistMap3D sites={sites3d} sel={sel} onPick={pick} silk={SILK_PTS} lang={lang} label={t.histTitle} onFallback={() => setMap2d(true)} />
          </>)}
        </section>

        <section className="card portal" data-rv="">
          <div className="portal-year" aria-live="polite">
            <small>{L(site.era, lang)}</small>
            <b>{fmtYear(year, lang)}</b>
          </div>
          <div className="river" ref={riverRef}>
            <svg className="river-wave" viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden>
              <path className="rw rw1" d="M0 40 C 80 10, 160 70, 250 40 S 420 10, 500 40 S 660 70, 750 40 S 920 10, 1000 40" />
              {/* Өткен уақыт сызығы: масканың ішіндегі тіктөртбұрыш scaleX-пен өседі (тек transform) */}
              <defs>
                <mask id="hzRiverM" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="80">
                  <rect className="rw-mask" width="1000" height="80" fill="#fff" style={{ transform: `scaleX(${(idx + 0.5) / SORTED.length})` }} />
                </mask>
              </defs>
              <path className="rw-fill" mask="url(#hzRiverM)" d="M0 42 C 80 12, 160 72, 250 42 S 420 12, 500 42 S 660 72, 750 42 S 920 12, 1000 42" />
            </svg>
            <div className="timeline">
              {SORTED.map((s, i) => (
                <button key={s.id} className={`tl-node ${sel === s.id ? "on" : ""} ${done[s.id] ? "done" : ""} ${i < idx ? "past" : ""}`} aria-current={sel === s.id ? "true" : undefined} onClick={() => pick(s.id)} style={{ "--i": i }}>
                  <span className="tl-dot"><svg viewBox="0 0 64 64" aria-hidden="true"><use href={`#${s.tsym}`} /></svg>{done[s.id] && <HistSeal size={20} />}</span>
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
        <section className="card site hist-folio rise" key={site.id} aria-labelledby="hf-title">
          <HistCorner c="tl" />
          <HistCorner c="br" />
          <div className="site-head hf-head">
            <div className="artifact" data-tilt="14">
              <span className="hf-depth" aria-hidden="true"><HistFelt /></span>
              <span className="art-e"><svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true"><use href={`#${site.tsym}`} /></svg></span>
              <i className="art-glare" aria-hidden="true"><i /></i>
            </div>
            <div className="hf-head-t">
              <span className="badge">{L(site.era, lang)}</span>
              <h2 id="hf-title">{L(site.name, lang)}</h2>
              <div className="hf-chips">
                {reg && (
                  <Link href={`/app/travel?r=${reg.id}`} className="site-reg">
                    <Icon name="map" size={16} /> {L(reg.name, lang)}
                  </Link>
                )}
                {site.art && (
                  <button type="button" className="hf-3d" ref={viewBtn} onClick={() => setView(site.art)} onPointerEnter={preloadGallery} onFocus={preloadGallery} aria-haspopup="dialog">
                    <Cube size={18} /> {H.view3d}
                  </button>
                )}
              </div>
            </div>
            {done[site.id] && <span className="stamp-mark static pop hist-wax"><HistSeal size={28} /> <span>{t.badge}</span></span>}
          </div>

          <div className="site-body hf-body">
            <div className="hf-guide">
              <span className="hf-guide-av" aria-hidden="true"><Qyran mood="idle" size={40} /></span>
              <p>{H.guide}</p>
              {trReady && (
                <button type="button" className="btn ghost small hf-trbtn" aria-pressed={showTr} onClick={toggleTr}>
                  <Icon name="globe" size={16} /> {showTr ? H.trHide : H.trShow}
                </button>
              )}
            </div>

            <div className="hf-parts">
              {txt?.parts.map((p, i) => (
                <section className="hf-part" key={i} style={{ "--i": i }}>
                  <h3 className="hf-part-h"><span className="hf-part-ic" aria-hidden="true"><Icon name={PART_ICON[i]} size={16} /></span>{H.parts[i]}</h3>
                  <p className="hf-part-t" lang="kk" dir="ltr">{p}</p>
                  {showTr && trReady && <p className="hf-part-tr" lang={explain} dir="auto" data-notap="">{histTr(explain, `P.${site.id}.${i}`)}</p>}
                </section>
              ))}
            </div>

            <div className="hf-words">
              <h3 className="hf-sub">{H.words}</h3>
              <div className="site-words">
                {site.words.map((w) => {
                  const saved = state.vocab?.some((v) => v.kk === w.kk);
                  return (
                    <button key={w.kk} className={`word-chip ${saved ? "saved" : ""}`} data-tilt="5" aria-pressed={saved} onClick={() => saveWord({ kk: w.kk, tr: tr(w, explain), e: w.e, src: site.id })}>
                      <span className="wc-e hist-tamga" aria-hidden="true">{w.kk.charAt(0).toUpperCase()}</span>
                      <span>
                        <b lang="kk">{w.kk}</b>
                        <small>{tr(w, explain)}</small>
                      </span>
                      <Icon name={saved ? "check" : "plus"} size={16} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="site-quiz">
              {quiz ? (
                <>
                  <Quiz questions={quiz} onDone={finish} pass={quiz.length - 1} />
                  {res && (
                    <div className={`alert ${res.ok ? "ok hz-win" : ""} rise`}>
                      {res.ok && <HistBurst />}
                      <span className="hist-res">{res.ok ? <><HistSeal size={26} /> {t.badge}</> : t.score(res.right, res.total)}</span>
                      <button className="btn ghost small" onClick={() => { setQuiz(buildQuiz(site, explain, H)); setRes(null); }}>
                        <Icon name="refresh" size={15} /> {t.retry}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button className="btn big hf-quiz-btn" onClick={() => setQuiz(buildQuiz(site, explain, H))}>
                  <Icon name="trophy" size={20} /> {H.quiz} <small>{H.qCount(quizLen)}</small>
                </button>
              )}
            </div>
          </div>
        </section>
      </div>

      <div id="hpanel-arts" role="tabpanel" aria-labelledby="htab-arts" className="hist-panel" hidden={tab !== "arts"}>
        {artsOn && <ArtifactGallery id="artifacts" />}
      </div>

      {view && <ArtifactViewer id={view} onClose={closeView} />}
    </div>
  );
}
