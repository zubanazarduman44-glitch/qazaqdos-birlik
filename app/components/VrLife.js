"use client";
// VR «өмір» қозғалтқышы: орынның сценарийін (биттер тізбегін) ойнатады — көше, есік, ішке кіру, отыру, кейіпкердің келуі,
// әр диалог түйініндегі әрекет (мәзір әкелу, жазу, тамақ беру…). Орынның суреті мен сценарийі — vr-places/<орын>.js.
// Сыртқа: onSay(node) — кейіпкер сөйлей бастайтын сәт, onFree(node) — жауап таңдауға болады. ctl.current.skip() — өткізіп жіберу.
// Сенімділік: әр ойнатудың өз нөмірі (ескі таймерлер елеусіз), вкладка жасырын болса таймер кідіреді, reduced-motion — бірден соңғы күй + ақырын ауысу.
import { useEffect, useRef, useState } from "react";
import { MyHand } from "./vr-places/kit";

const reduced = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const SHOT0 = { x: 400, y: 225, z: 1 };
// Камера: дүниенің (x,y) нүктесі кадр ортасына, z есе үлкейтіп. Сахна 16:9-дан кеңірек болса (slice жоғары-төменін кеседі),
// кадр «анкермен» түзетіледі: b — төменгі жиек сақталады (үстел, сөре), m — орта, t — жоғарғы жиек. hv — көрінетін биіктік.
const camT = (c, hv) => {
  const k = c.a === "m" ? 0 : c.a === "t" ? -1 : 1;
  const y = c.y + (k * (225 - hv / 2)) / c.z;
  return `translate(400px, 225px) scale(${c.z}) translate(${-c.x}px, ${-y}px)`;
};

// Бір битті күйге қосу (таза функция)
export function applyBeat(st, b, mod) {
  const n = { ...st };
  if ("cam" in b) n.camMs = b.camMs ?? b.ms ?? 0;
  for (const k of ["set", "cam", "walk", "dip", "hand"]) if (k in b) n[k] = b[k];
  if (b.p) n.p = { ...st.p, ...b.p };
  if (b.a) {
    n.a = { ...st.a };
    for (const [id, pa] of Object.entries(b.a)) {
      const prev = st.a?.[id] || {};
      const nx = { ...prev, ...pa };
      if (pa.at !== undefined) {
        const sp = typeof pa.at === "string" ? mod.spots?.[pa.at] : pa.at;
        if (sp) Object.assign(nx, { x: sp.x, y: sp.y, s: sp.s ?? 1 });
        const dx = (nx.x ?? 0) - (prev.x ?? nx.x ?? 0), dy = (nx.y ?? 0) - (prev.y ?? nx.y ?? 0);
        if (nx.pose === "walk") {
          if (Math.abs(dx) < Math.abs(dy) * 1.6) { nx.pose = "walkz"; nx.face = pa.face ?? 1; }
          else nx.face = pa.face ?? (Math.abs(dx) > 8 ? Math.sign(dx) : prev.face ?? 1);
        }
        nx.dur = pa.dur ?? b.ms ?? 0;
      } else {
        nx.dur = 0;
        if (pa.pose && pa.pose !== "walk" && pa.face === undefined) nx.face = 1;
      }
      n.a[id] = nx;
    }
  }
  return n;
}
const applyAll = (st, beats, mod) => beats.reduce((s, b) => applyBeat(s, b, mod), st);
// Ауа райы қабаты (экран кеңістігінде, камерадан тәуелсіз): қар үлпектері / жаңбыр тамшылары. Орындары тұрақты (псевдокездейсоқ).
const PR = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const FLAKES = Array.from({ length: 44 }, (_, i) => ({ x: PR(i, 1) * 820 - 10, y: PR(i, 2) * 450, r: 1.4 + PR(i, 3) * 2.6, d: 6 + PR(i, 4) * 7, dl: -PR(i, 5) * 12, dx: (PR(i, 6) - 0.5) * 70 }));
const DROPS = Array.from({ length: 40 }, (_, i) => ({ x: PR(i, 7) * 860 - 30, y: PR(i, 8) * 450, d: 0.55 + PR(i, 9) * 0.35, dl: -PR(i, 10) * 2 }));
function Weather({ wx, out }) {
  if (wx !== "snow" && wx !== "rain") return null;
  return (
    <g className={`lf-wx lf-wx-${wx}${out ? " on" : ""}`} aria-hidden="true">
      {wx === "snow"
        ? FLAKES.map((f, i) => <circle key={i} cx={f.x} cy={f.y} r={f.r} style={{ "--y": f.y, "--dx": `${f.dx}px`, animationDuration: `${f.d}s`, animationDelay: `${f.dl}s` }} />)
        : DROPS.map((f, i) => <path key={i} d={`M${f.x} ${f.y}l-7 22`} style={{ "--y": f.y, animationDuration: `${f.d}s`, animationDelay: `${f.dl}s` }} />)}
    </g>
  );
}

const initState = (mod) => applyBeat({ set: "out", cam: "wide", camMs: 0, walk: false, dip: false, hand: null, a: {}, p: {} }, { ...(mod.init || {}), ms: 0 }, mod);

// Түйін әрекеті: scenes.js ішіндегі node.act → орын файлындағы script[сцена][түйін] → acts.talk → бос
function actBeats(mod, scene, nodeId, st) {
  const node = scene.nodes[nodeId] || {};
  let a = node.act ?? mod.script?.[scene.id]?.[nodeId] ?? "talk";
  if (typeof a === "string") a = mod.acts?.[a] ?? mod.acts?.talk ?? [];
  if (typeof a === "function") a = a({ scene, node: nodeId, st });
  return Array.isArray(a) ? a : [];
}

export default function VrLife({ mod, scene, node, run, intro, talk, mood, label, ctl, onSay, onFree, onIntroSeen, onCue, wx }) {
  const [st, setSt] = useState(() => initState(mod));
  const [instant, setInstant] = useState(false);
  const [xf, setXf] = useState(0);
  const stRef = useRef(st);
  const svgRef = useRef(null);
  const [hv, setHv] = useState(450);
  useEffect(() => {
    const el = svgRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      const b = el.getBoundingClientRect();
      if (b.width > 0 && b.height > 0) setHv(Math.round(Math.min(450, (800 * b.height) / b.width)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const R = useRef({ id: 0, beats: null, i: 0, said: true, freed: true, node: null, run: null, intro: false });
  const T = useRef({ h: 0, fn: null, left: 0, at: 0 });
  const cb = useRef({});
  cb.current = { onSay, onFree, onIntroSeen, onCue };

  const put = (s) => { stRef.current = s; setSt(s); };
  const fire = (r) => {
    if (!r.said) { r.said = true; cb.current.onSay?.(r.node); }
    if (!r.freed) {
      r.freed = true;
      cb.current.onFree?.(r.node);
      if (r.intro) { r.intro = false; cb.current.onIntroSeen?.(); }
    }
  };
  const wait = (ms, fn) => {
    const t = T.current;
    clearTimeout(t.h);
    t.fn = fn; t.left = ms;
    if (typeof document !== "undefined" && document.hidden) return;
    t.at = performance.now();
    t.h = setTimeout(() => { t.fn = null; fn(); }, ms);
  };
  const stopTimer = () => { clearTimeout(T.current.h); T.current.fn = null; };
  const flash = () => {
    setInstant(true);
    setXf((x) => x + 1);
    requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)));
  };

  // Биттерді ойнату
  const play = (beats, { nodeId, isIntro }) => {
    const r = R.current;
    stopTimer();
    r.id++; r.beats = beats; r.i = 0; r.said = false; r.freed = false; r.node = nodeId; r.intro = !!isIntro;
    const id = r.id;
    if (reduced()) {
      put(applyAll(stRef.current, beats, mod));
      flash();
      wait(isIntro ? 700 : 260, () => r.id === id && fire(r));
      return;
    }
    const step = () => {
      if (r.id !== id) return;
      if (r.i >= r.beats.length) return fire(r);
      const b = r.beats[r.i++];
      put(applyBeat(stRef.current, b, mod));
      if (b.say && !r.said) { r.said = true; cb.current.onSay?.(r.node); }
      if (b.free) fire(r);
      wait(Math.max(40, b.ms || 0), step);
    };
    step();
  };

  // Өткізіп жіберу: қалған биттер бірден, сосын сөз бен жауаптар
  const skip = () => {
    const r = R.current;
    if (!r.beats || (r.freed && r.i >= r.beats.length)) return;
    stopTimer();
    r.id++;
    put(applyAll(stRef.current, r.beats.slice(r.i), mod));
    r.i = r.beats.length;
    flash();
    fire(r);
  };
  if (ctl) ctl.current = { skip };

  // Түйін не ойнату нөмірі ауысқанда — сәйкес биттер
  useEffect(() => {
    const r = R.current;
    const fresh = r.run !== run;
    r.run = run;
    if (fresh) {
      let s = initState(mod);
      if (!intro) {
        s = applyAll(s, mod.intro || [], mod);
        put(s);
        flash();
        play(actBeats(mod, scene, node, s), { nodeId: node });
      } else {
        put(s);
        play([...(mod.intro || []), ...actBeats(mod, scene, node, applyAll(s, mod.intro || [], mod))], { nodeId: node, isIntro: true });
      }
    } else play(actBeats(mod, scene, node, stRef.current), { nodeId: node });
    return () => {
      // Ескі ойнату тоқтайды; кіріспе ортасында үзілсе (StrictMode қайта іске қосуы) — келесі жолы басынан
      stopTimer();
      if (r.intro) r.run = null;
      r.id++;
    };
  }, [node, run]); // eslint-disable-line react-hooks/exhaustive-deps

  // Вкладка жасырын — таймер кідіреді; қайта көрінгенде қалған уақытынан жалғасады
  useEffect(() => {
    const onVis = () => {
      const t = T.current;
      if (!t.fn) return;
      if (document.hidden) { clearTimeout(t.h); t.left = Math.max(0, t.left - (performance.now() - t.at)); }
      else wait(t.left, t.fn);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Дыбыс белгілері: көше/іші ауысуы, қадам, есіктен өту
  useEffect(() => { cb.current.onCue?.({ set: st.set, walk: !!st.walk, dip: !!st.dip }); }, [st.set, st.walk, st.dip]);

  const shot = (typeof st.cam === "string" ? mod.shots?.[st.cam] : st.cam) || SHOT0;
  const Stage = mod.Stage;
  const npc = st.a?.npc;
  const out = st.set === "out";
  return (
    <svg ref={svgRef} className={`vr-art lf-art${instant ? " lf-instant" : ""}`} viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label} focusable="false">
      {mod.css && <style>{mod.css}</style>}
      <g className={`lf-cam${st.walk ? " is-walk" : ""}`} style={{ transform: camT(shot, hv), transitionDuration: `${st.camMs || 0}ms` }}>
        <g className="lf-bob">
          {/* Кейіпкер сөйлегенде камера оған ақырын жақындайды (фокус) */}
          <g className={`lf-push${talk && npc && !npc.hide && !st.walk ? " on" : ""}`} style={npc ? { transformOrigin: `${npc.x ?? 400}px ${(npc.y ?? 400) - 210 * (npc.s ?? 1)}px` } : undefined}>
            <Stage st={st} talk={talk} mood={mood} scene={scene} />
          </g>
        </g>
      </g>
      {wx && <rect className={`lf-tint t-${wx.tod}${out ? " out" : ""}`} x="-20" y="-20" width="840" height="490" aria-hidden="true" />}
      {wx && <Weather wx={wx.wx} out={out} />}
      <MyHand item={st.hand} />
      <rect className={`lf-dip${st.dip ? " on" : ""}`} x="-20" y="-20" width="840" height="490" fill={mod.dip || "#FBE9C8"} />
      {xf > 0 && <rect key={xf} className="lf-xf" x="-20" y="-20" width="840" height="490" fill={mod.dip || "#FBE9C8"} />}
    </svg>
  );
}
