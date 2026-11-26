"use client";
// Тарих картасының 3D нұсқасы: «цифрлық музейдегі» диорама-тақта.
// three.js тек осы компонент экранда пайда болғанда динамикалық импортпен жүктеледі.
// Белгілер — HTML батырмалар (≥44px, пернетақта фокусы, aria-label), орны әр кадрда DOM transform арқылы жаңарады (React қайта сызбайды).
import { useEffect, useRef, useState } from "react";
import { hm3t } from "./HistMap3DL10n";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}
const mq = (q) => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(q).matches;
const overlap = (a, b) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];

export default function HistMap3D({ sites, sel, onPick, silk, lang, label, onFallback }) {
  const t = hm3t(lang);
  const wrapRef = useRef(null);
  const hintRef = useRef(null);
  const apiRef = useRef(null);
  const pinRefs = useRef({});
  const labelW = useRef({});
  const selRef = useRef(sel);
  const dimRef = useRef(new Set());
  const pickRef = useRef(onPick);
  const fbRef = useRef(onFallback);
  const sitesRef = useRef(sites);
  const firstSel = useRef(true);
  const [phase, setPhase] = useState("loading");
  const [coarse] = useState(() => mq("(pointer: coarse)"));

  pickRef.current = onPick;
  fbRef.current = onFallback;
  sitesRef.current = sites;
  selRef.current = sel;
  dimRef.current = new Set(sites.filter((s) => !s.on).map((s) => s.id));

  // Белгілерді орналастыру: таңдалғаны мен жақындары бірінші; жазуы басқаға мінсе — тек белгі (hover/фокуста ашылады)
  const layout = (proj) => {
    const pins = pinRefs.current;
    const selId = selRef.current, dim = dimRef.current;
    const order = [];
    for (let i = 0; i < proj.length; i++) {
      const el = pins[proj[i].id];
      if (!el) continue;
      if (!proj[i].on) { if (el.style.visibility !== "hidden") el.style.visibility = "hidden"; continue; }
      if (el.style.visibility) el.style.visibility = "";
      order.push(i);
    }
    const pri = (p) => (p.id === selId ? -1e6 : 0) + (dim.has(p.id) ? 1e5 : 0) + p.d;
    order.sort((a, b) => pri(proj[a]) - pri(proj[b]));
    const placed = [];
    order.forEach((i, rank) => {
      const p = proj[i];
      const el = pins[p.id];
      el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
      el.style.zIndex = String(40 - rank);
      const lw = labelW.current[p.id] || 110;
      const icon = [p.x - 22, p.y - 52, p.x + 22, p.y];
      const lab = [p.x - lw / 2, p.y + 2, p.x + lw / 2, p.y + 40];
      const compact = p.id !== selId && placed.some((b) => overlap(b, lab));
      placed.push(icon);
      if (!compact) placed.push(lab);
      if (el.classList.contains("compact") !== compact) el.classList.toggle("compact", compact);
    });
  };

  // Сахнаны құру
  useEffect(() => {
    let dead = false;
    const fail = () => { if (!dead) fbRef.current?.(); };
    if (!hasWebGL()) { fail(); return; }
    const reduced = mq("(prefers-reduced-motion: reduce)");
    const anchors = sitesRef.current.map((s) => ({ id: s.id, x: s.x, y: s.y }));
    // Кенеп әр құрылғанда жаңа (StrictMode-та екі рет іске қосылса да, жоғалған WebGL контексті қайта қолданылмайды)
    const canvas = document.createElement("canvas");
    canvas.className = "hm3-canvas";
    canvas.setAttribute("aria-hidden", "true");
    wrapRef.current.prepend(canvas);
    let ro, io;
    import("./histmap3d/scene")
      .then(({ createMapScene }) => createMapScene({
        canvas, anchors, silk, coarse, reduced,
        onProject: layout, onLost: fail, cancelled: () => dead,
      }))
      .then((api) => {
        if (!api) return;
        if (dead) { api.dispose(); return; }
        apiRef.current = api;
        const wrap = wrapRef.current;
        const r = wrap.getBoundingClientRect();
        api.resize(r.width, r.height);
        api.setState({ sel: selRef.current, dim: dimRef.current });
        api.intro();
        ro = new ResizeObserver((es) => { const c = es[0].contentRect; api.resize(c.width, c.height); });
        ro.observe(wrap);
        io = new IntersectionObserver((es) => api.setVisible(es[0].isIntersecting), { rootMargin: "80px" });
        io.observe(wrap);
        setPhase("ready");
      })
      .catch((e) => { if (process.env.NODE_ENV !== "production") console.warn("HistMap3D:", e); fail(); });
    return () => {
      dead = true;
      ro?.disconnect();
      io?.disconnect();
      apiRef.current?.dispose();
      apiRef.current = null;
      canvas.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Таңдау / дәуір сүзгісі → тұғыр түсі; таңдау өзгерсе — камера сол жерге ұшады
  const dimKey = sites.filter((s) => !s.on).map((s) => s.id).join(",");
  const doneKey = sites.filter((s) => s.done).map((s) => s.id).join(",");
  useEffect(() => {
    apiRef.current?.setState({ sel, dim: dimRef.current });
  }, [sel, dimKey, phase]);
  useEffect(() => {
    if (firstSel.current) { firstSel.current = false; return; }
    apiRef.current?.flyTo(sel);
  }, [sel]);

  // Жазу енін тіл ауысқанда бір рет өлшейміз (әр кадрда layout оқымау үшін)
  useEffect(() => {
    const m = {};
    for (const [id, el] of Object.entries(pinRefs.current)) {
      const l = el?.querySelector(".hm3-lbl");
      if (l) m[id] = l.offsetWidth + 6;
    }
    labelW.current = m;
    apiRef.current?.render(); // className өзгерсе «compact» белгісі қайта есептелсін
  }, [lang, phase, doneKey, sel, dimKey]);

  // Телефонда бір саусақпен сүйрегенде — «екі саусақ» кеңесін қысқа көрсетеміз
  useEffect(() => {
    if (!coarse) return;
    const cv = wrapRef.current;
    let tm;
    const onMove = (e) => {
      if (e.touches.length !== 1 || !hintRef.current || e.target.tagName !== "CANVAS") return;
      hintRef.current.classList.add("flash");
      clearTimeout(tm);
      tm = setTimeout(() => hintRef.current?.classList.remove("flash"), 1800);
    };
    cv.addEventListener("touchmove", onMove, { passive: true });
    return () => { cv.removeEventListener("touchmove", onMove); clearTimeout(tm); };
  }, [coarse]);

  // Компьютерде: жай дөңгелек бетті айналдырады (карта «қамап» алмасын), Ctrl/⌘ + дөңгелек — жақындату.
  // Тачпадтағы қысу (pinch) браузерде ctrlKey-мен келеді, сондықтан ол да жұмыс істейді.
  // Капчур фазасында ұстаймыз: OrbitControls-тың wheel өңдегішіне жетпейді, preventDefault болмайды → бет айналады.
  useEffect(() => {
    if (coarse) return;
    const el = wrapRef.current;
    if (!el) return;
    let tm;
    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey || e.target.tagName !== "CANVAS") return;
      e.stopImmediatePropagation();
      if (!hintRef.current) return;
      hintRef.current.classList.add("flash");
      clearTimeout(tm);
      tm = setTimeout(() => hintRef.current?.classList.remove("flash"), 1600);
    };
    el.addEventListener("wheel", onWheel, { capture: true, passive: true });
    return () => { el.removeEventListener("wheel", onWheel, { capture: true }); clearTimeout(tm); };
  }, [coarse]);

  return (
    <div className={`hm3-wrap ${phase === "ready" ? "ready" : ""}`} ref={wrapRef} role="group" aria-label={label || t.region}>
      <div className="hm3-vignette" aria-hidden="true" />
      <div className="hm3-pins">
        {sites.map((s) => (
          <div key={s.id} ref={(el) => { pinRefs.current[s.id] = el; }} className={`hm3-pin ${sel === s.id ? "sel" : ""} ${s.on ? "" : "dim"} ${s.done ? "got" : ""}`}>
            <button type="button" className="hm3-mk" onClick={() => pickRef.current?.(s.id)} aria-label={`${s.name}, ${s.year}`} aria-pressed={sel === s.id}>
              <span className="hm3-art" aria-hidden="true">
                <svg viewBox="0 0 64 64" width="40" height="40" focusable="false"><use href={`#${s.sym}`} width="64" height="64" /></svg>
              </span>
              <span className="hm3-tr" aria-hidden="true">
                <svg viewBox="0 0 64 64" width="22" height="22" focusable="false"><use href={`#${s.tsym}`} width="64" height="64" /></svg>
              </span>
              {s.done && (
                <span className="hm3-seal" aria-hidden="true">
                  <svg viewBox="-10 -10 20 20" width="18" height="18" focusable="false"><circle r="9" /><path d="M-4 0 L-1 3.4 L5 -3.4" /></svg>
                </span>
              )}
              <span className="hm3-lbl" aria-hidden="true"><b>{s.name}</b><small>{s.year}</small></span>
            </button>
          </div>
        ))}
      </div>
      <div className="hm3-ctl">
        <button type="button" onClick={() => apiRef.current?.zoom(0.72)} aria-label={t.zoomIn} title={t.zoomIn} disabled={phase !== "ready"}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        </button>
        <button type="button" onClick={() => apiRef.current?.zoom(1.38)} aria-label={t.zoomOut} title={t.zoomOut} disabled={phase !== "ready"}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 12h14" /></svg>
        </button>
        <button type="button" onClick={() => apiRef.current?.reset()} aria-label={t.reset} title={t.reset} disabled={phase !== "ready"}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" /><path d="M4 4.5v4h4" /></svg>
        </button>
      </div>
      <div className="hm3-hint" ref={hintRef}>{coarse ? t.hintTouch : t.hintDrag}</div>
      {phase !== "ready" && (
        <div className="hm3-loading" role="status">
          <span className="hm3-spin" aria-hidden="true" />
          <span>{t.loading}</span>
        </div>
      )}
    </div>
  );
}
