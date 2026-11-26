"use client";
// «Жәдігерлер галереясы» — Тарих бетіндегі цифрлық музей.
// Карточкаларда — ортақ рендерерде бір рет салынған статикалық 3D сурет (IndexedDB кэші бар),
// «Толығырақ» терезесінде — айналдыруға, үлкейтуге болатын интерактив 3D модель.
// three.js пен модельдер тек галерея көрінгенде (dynamic import) жүктеледі.
// Қолданылуы: <ArtifactGallery /> — тіл useApp()-тен алынады. Қосымша: id (якорь), className.
import "../artifacts.css";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useApp } from "./Store";
import Icon from "./Icon";
import { ARTIFACTS, at } from "../../lib/artifacts";
import { agL, agf } from "./ArtifactGalleryL10n";
import { hasWebGL } from "./artifacts3d/gl";
import { cachedShot, shotKey } from "./artifacts3d/cache";

const SHOT = 560; // карточка суретінің өлшемі (px)

const reduced = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// ── Сурет нұсқасы (WebGL жоқ болса не сурет әзір болмаса): қарапайым SVG сұлбалар ──
const TONE = {
  gold: ["#e8b23a", "#9a6a12"], clay: ["#b9744a", "#6e3c20"], bronze: ["#9a6a3a", "#4f3418"],
  stone: ["#8a735c", "#4a3a2c"], leather: ["#7a4524", "#3e2010"], wood: ["#9a6434", "#4f2e14"],
};
const ART = {
  goldman: <><path d="M40 104 L60 14 L80 104Z" /><path d="M38 96h44M39 88h42" className="agx-ln" /><path d="M54 70V34M60 68V30M66 70V34" className="agx-ln" /><circle cx="60" cy="12" r="4" /></>,
  deer: <path d="M14 78q-2-14 12-16 26-4 52-4 6-14 14-16l14-2 4 6-12 4q-4 12-10 18 6 4 4 12H70q-20 2-40 0-6 6-14 4Zm60-24q-8-16-34-14 18-6 30-2-4-10-14-14 16 4 20 16Z" />,
  berel: <><path d="M44 104q-4-30 6-48l8-18q10-6 16 4l8 30q2 12-6 14l-8-4-6 22Z" /><path d="M56 40q-6-22 8-34 18-4 26 12 4 12-4 18 2-12-6-18-12-2-14 10Z" /></>,
  botai: <path d="M38 104q-8-2-10-14-6-30 2-60 2-6 8-8h44q6 2 8 8 8 30 2 60-2 12-10 14Z" />,
  andronovo: <path d="M42 104h36l14-40q2-10-8-18l2-14q2-6 6-8H28q4 2 6 8l2 14q-10 8-8 18Z" />,
  cauldron: <><path d="M20 40h80q0 34-30 40H50q-30-6-30-40Z" /><path d="M50 80h20l12 24H38Z" /><path d="M28 40q0-14 10-14t10 14M72 40q0-14 10-14t10 14" className="agx-ln" /></>,
  petroglyph: <><path d="M10 100 16 30q20-18 50-14 34 2 44 22l-2 62Z" /><g className="agx-carve"><circle cx="56" cy="44" r="7" /><path d="M56 30v-5M56 63v-5M42 44h-5M75 44h-5M46 34l-3-3M66 34l3-3M56 51v20M44 56l12-4 12 4M48 86l8-15 8 15" /></g></>,
  coin: <path fillRule="evenodd" d="M60 18a42 42 0 1 1 0 84 42 42 0 0 1 0-84Zm-9 33v18h18V51Z" />,
  taikazan: <><path d="M8 34h104q-4 38-36 46H44Q12 72 8 34Z" /><path d="M46 80h28l10 22H36Z" /></>,
  torsyk: <><path d="M54 14h12v14q30 10 30 44 0 30-36 32-36-2-36-32 0-34 30-44Z" /><path d="M44 58q16-14 32 0M44 74q16 14 32 0" className="agx-ln" /></>,
  dombyra: <><path d="M60 104q-30 0-30-30 0-24 22-34l4-30h8l4 30q22 10 22 34 0 30-30 30Z" /><circle cx="60" cy="62" r="4" className="agx-hole" /></>,
};

function Illustration({ art }) {
  const [fill, stroke] = TONE[art.tone] || TONE.gold;
  return (
    <svg className="agx-illus" viewBox="0 0 120 120" aria-hidden="true" style={{ "--ag-fill": fill, "--ag-stroke": stroke }}>
      <g fill={fill} stroke={stroke} strokeWidth="2.2" strokeLinejoin="round">{ART[art.id]}</g>
    </svg>
  );
}

// Тұғыр: «есік-арка» тәрізді тыныш көрме алаңы (CSS-пен), үстінде модельдің суреті
function Stage({ art, shot, state, t, big = false }) {
  return (
    <div className={`agx-stage agx-tone-${art.tone}${big ? " big" : ""}`}>
      <span className="agx-spot" aria-hidden="true" />
      <span className="agx-plinth" aria-hidden="true" />
      {shot ? (
        <img className="agx-shot" src={shot} alt="" width={SHOT} height={SHOT} decoding="async" draggable="false" />
      ) : (
        <span className={`agx-ill-wrap${state === "loading" ? " wait" : ""}`}><Illustration art={art} /></span>
      )}
      {shot ? <span className="agx-badge">{t.model3d}</span> : state === "fail" ? <span className="agx-badge muted">{t.illus}</span> : null}
      {state === "loading" && !shot ? <span className="agx-spin" aria-hidden="true" /> : null}
    </div>
  );
}

function ArtCard({ art, lang, t, gl, onOpen, index }) {
  const ref = useRef(null);
  const [shot, setShot] = useState(null);
  const [state, setState] = useState("idle");

  useEffect(() => {
    if (gl === null) return;
    let alive = true;
    let io = null;
    const key = shotKey(art.model, SHOT);
    (async () => {
      const hit = await cachedShot(key);
      if (!alive) return;
      if (hit) { setShot(hit); setState("ready"); return; }
      if (!gl) { setState("fail"); return; }
      const start = () => {
        setState("loading");
        import("./artifacts3d/snapshot")
          .then((m) => m.snapshot(art.model, { size: SHOT }))
          .then((url) => { if (alive) { setShot(url); setState("ready"); } })
          .catch(() => { if (alive) setState("fail"); });
      };
      if (typeof IntersectionObserver === "undefined") return start();
      io = new IntersectionObserver((es) => {
        if (es.some((e) => e.isIntersecting)) { io.disconnect(); start(); }
      }, { rootMargin: "240px 0px" });
      if (ref.current) io.observe(ref.current);
    })();
    return () => { alive = false; if (io) io.disconnect(); };
  }, [art.model, gl]);

  const titleId = `agx-t-${art.id}`;
  return (
    <li className="agx-card" ref={ref} style={{ "--i": index }}>
      <div className="agx-card-stage" onClick={(e) => onOpen(index, e.currentTarget.parentNode.querySelector(".agx-more"))} aria-hidden="true">
        <Stage art={art} shot={shot} state={state} t={t} />
      </div>
      <div className="agx-body">
        <h3 id={titleId} className="agx-name">{at(art.name, lang)}</h3>
        <dl className="agx-meta">
          <div><dt>{t.period}</dt><dd>{at(art.period, lang)}</dd></div>
          <div><dt>{t.place}</dt><dd>{at(art.place, lang)}</dd></div>
        </dl>
        <p className="agx-short">{at(art.short, lang)}</p>
        <button type="button" className="btn small agx-more" aria-describedby={titleId} onClick={(e) => onOpen(index, e.currentTarget)}>
          {t.more}
          <Icon name="right" size={18} className="agx-flip" />
        </button>
      </div>
    </li>
  );
}

// Кішкене SVG белгішелер (Icon.js-те жоқтары)
const Glyph = ({ d, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const G = { minus: "M5 12h14", plus: "M12 5v14M5 12h14", pause: "M9 6v12M15 6v12", play: "M8 5.5v13l10-6.5Z", reset: "M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" };

function ArtModal({ index, onClose, onNav, lang, t, gl }) {
  const art = ARTIFACTS[index];
  const dlgRef = useRef(null);
  const hostRef = useRef(null);
  const ctlRef = useRef(null);
  const closeRef = useRef(null);
  const [phase, setPhase] = useState(gl ? "loading" : "nogl");
  const [auto, setAuto] = useState(!reduced());
  const uid = useId();
  const titleId = `${uid}-title`;
  const hintId = `${uid}-hint`;

  // 3D көрерменді құру / тазалау
  useEffect(() => {
    if (!gl) { setPhase("nogl"); return; }
    let cancelled = false;
    setPhase("loading");
    setAuto(!reduced());
    import("./artifacts3d/viewer")
      .then((m) => m.createViewer(hostRef.current, art.model, { autoRotate: !reduced(), onAutoChange: (v) => !cancelled && setAuto(v) }))
      .then((ctl) => {
        if (!ctl) return;
        if (cancelled) { ctl.dispose(); return; }
        ctlRef.current = ctl;
        setPhase("ready");
      })
      .catch(() => { if (!cancelled) setPhase("nogl"); });
    return () => {
      cancelled = true;
      if (ctlRef.current) { ctlRef.current.dispose(); ctlRef.current = null; }
    };
  }, [art.model, gl]);

  // Бет айналымын бұғаттау және бастапқы фокус
  useEffect(() => {
    const el = document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    // Фокус терезеден тыс болса да (мысалы, 3D алаңын басқанда) Esc жұмыс істейді
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => { el.style.overflow = prev; document.removeEventListener("keydown", esc); };
  }, [onClose]);

  // Esc — жабу; Tab — терезе ішінде айналады (фокус тұзағы)
  const onKeyDown = (e) => {
    if (e.key === "Escape") { e.stopPropagation(); onClose(); return; }
    if (e.key !== "Tab") return;
    const items = [...dlgRef.current.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')].filter((n) => n.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  // 3D алаңындағы пернелер
  const onViewerKey = (e) => {
    const c = ctlRef.current;
    if (!c) return;
    const k = e.key;
    const map = {
      ArrowLeft: () => c.orbit(0.18, 0), ArrowRight: () => c.orbit(-0.18, 0), ArrowUp: () => c.orbit(0, -0.12), ArrowDown: () => c.orbit(0, 0.12),
      "+": () => c.zoom(0.85), "=": () => c.zoom(0.85), "-": () => c.zoom(1.18), _: () => c.zoom(1.18), "0": () => c.reset(), Home: () => c.reset(),
    };
    if (map[k]) { e.preventDefault(); map[k](); }
  };

  const ready = phase === "ready";
  const total = ARTIFACTS.length;
  const rows = [
    [t.period, art.period], [t.place, art.place], [t.museum, art.museum], [t.material, art.material],
  ];

  return createPortal(
    <div className="agx-modal" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="agx-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dlgRef} onKeyDown={onKeyDown}>
        <div className="agx-dlg-top">
          <span className="agx-count">{agf(t.count, index + 1, total)}</span>
          <div className="agx-dlg-nav">
            <button type="button" className="agx-ico" onClick={() => onNav(-1)} aria-label={t.prev} title={t.prev}><Icon name="left" size={20} className="agx-flip" /></button>
            <button type="button" className="agx-ico" onClick={() => onNav(1)} aria-label={t.next} title={t.next}><Icon name="right" size={20} className="agx-flip" /></button>
            <button type="button" className="agx-ico close" onClick={onClose} aria-label={t.close} title={t.close} ref={closeRef}><Icon name="x" size={20} /></button>
          </div>
        </div>

        <div className="agx-dlg-grid">
          <div className="agx-viewer-col">
            <div className={`agx-viewer agx-tone-${art.tone}`}>
              <span className="agx-spot" aria-hidden="true" />
              <div
                className="agx-gl"
                ref={hostRef}
                tabIndex={ready ? 0 : -1}
                role="application"
                aria-roledescription="3D"
                aria-label={agf(t.viewer, at(art.name, lang))}
                aria-describedby={hintId}
                onKeyDown={onViewerKey}
                hidden={phase === "nogl"}
              />
              {phase === "nogl" ? (
                <div className="agx-nogl">
                  <Stage art={art} shot={null} state="fail" t={t} big />
                  <p role="note">{t.noGL}</p>
                </div>
              ) : null}
              {phase === "loading" ? (
                <div className="agx-loading" role="status">
                  <span className="agx-spin" aria-hidden="true" />
                  <span>{t.loading}</span>
                </div>
              ) : null}
              {ready ? (
                <div className="agx-tools" role="toolbar" aria-label={t.model3d}>
                  <button type="button" className="agx-ico" onClick={() => ctlRef.current?.zoom(1.18)} aria-label={t.zoomOut} title={t.zoomOut}><Glyph d={G.minus} /></button>
                  <button type="button" className="agx-ico" onClick={() => ctlRef.current?.zoom(0.85)} aria-label={t.zoomIn} title={t.zoomIn}><Glyph d={G.plus} /></button>
                  <button type="button" className="agx-ico" onClick={() => ctlRef.current?.reset()} aria-label={t.reset} title={t.reset}><Glyph d={G.reset} /></button>
                  <button type="button" className="agx-ico" onClick={() => ctlRef.current?.setAuto(!auto)} aria-label={auto ? t.pause : t.play} aria-pressed={auto} title={auto ? t.pause : t.play}>
                    <Glyph d={auto ? G.pause : G.play} />
                  </button>
                </div>
              ) : null}
            </div>
            <p className="agx-hint" id={hintId} hidden={phase === "nogl"}>{t.hint}</p>
          </div>

          <div className="agx-info">
            <p className="agx-kicker">{t.kicker}</p>
            <h2 id={titleId} className="agx-dlg-title">{at(art.name, lang)}</h2>
            <dl className="agx-facts">
              {rows.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{at(v, lang)}</dd></div>
              ))}
            </dl>
            <p className="agx-lead">{at(art.short, lang)}</p>
            <p>{at(art.details, lang)}</p>
            <h3 className="agx-sig-h">{t.sig}</h3>
            <p className="agx-sig">{at(art.sig, lang)}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function ArtifactGallery({ id = "artifacts", className = "" }) {
  const { lang } = useApp();
  const t = agL(lang);
  const [gl, setGl] = useState(null); // null — әлі тексерілмеді (SSR)
  const [open, setOpen] = useState(-1);
  const opener = useRef(null);

  useEffect(() => { setGl(hasWebGL()); }, []);

  const onOpen = useCallback((i, el) => {
    opener.current = el || null;
    setOpen(i);
  }, []);
  const onClose = useCallback(() => {
    setOpen(-1);
    const el = opener.current;
    if (el) requestAnimationFrame(() => el.focus({ preventScroll: true }));
  }, []);
  const onNav = useCallback((d) => setOpen((i) => (i + d + ARTIFACTS.length) % ARTIFACTS.length), []);

  return (
    <section className={`agx ${className}`} id={id} aria-labelledby={`${id}-title`}>
      <header className="agx-head">
        <p className="agx-kicker">{t.kicker}</p>
        <h2 id={`${id}-title`} className="agx-title">{t.title}</h2>
        <p className="agx-sub">{t.sub}</p>
      </header>
      <ul className="agx-grid">
        {ARTIFACTS.map((a, i) => (
          <ArtCard key={a.id} art={a} lang={lang} t={t} gl={gl} onOpen={onOpen} index={i} />
        ))}
      </ul>
      {open >= 0 && gl !== null ? <ArtModal index={open} onClose={onClose} onNav={onNav} lang={lang} t={t} gl={gl} /> : null}
    </section>
  );
}
