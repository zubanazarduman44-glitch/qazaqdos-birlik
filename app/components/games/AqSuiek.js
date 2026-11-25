"use client";
// «Ақсүйек» — түнгі квест. Ай жарығындағы далада шырақпен сүйек іздеу: әр сөз сүйегі — тапсырма,
// әр түннің соңында ақ сүйек пен жұмбақ, төрт түннің құпиясы — мақал.
// Басқару: тінтуір / түрту (сахнаны бас немесе сүйре), пернетақта (← ↑ → ↓, WASD; 1–4; Enter).
import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useApp } from "../Store";
import Icon from "../Icon";
import Qyran from "../Qyran";
import Frame, { Burst, Ready, useFinish } from "./Frame";
import { Horse } from "./GameArt";
import { WORDS, tr } from "../../../lib/words";
import { sayKk } from "../../../lib/speak";
import { H, HORIZON, LEVELS, NIGHTS, PROVERBS, RIDDLES, S, W, clampPos, dist, lower, pick, planNight, shuffleWith, starsFor } from "./aqsuiekData";

const SPEED = 170; // бірлік / с
const reduced = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const fmt = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k]);

// Батырма мен Enter бір уақытта басылса да, жауап бір рет қана есептеледі
function useOnce(fn) {
  const done = useRef(false);
  return (...a) => {
    if (done.current) return;
    done.current = true;
    fn(...a);
  };
}

// Жаңа карточка экраннан тыс қалмасын (телефонда сахнаның астында ашылады)
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el?.getBoundingClientRect) return;
    const b = el.getBoundingClientRect();
    if (b.bottom > window.innerHeight || b.top < 0) el.scrollIntoView({ block: "nearest", behavior: reduced() ? "auto" : "smooth" });
  }, []);
  return ref;
}

function useQ() {
  const { lang } = useApp();
  return useMemo(() => {
    const o = {};
    for (const [k, v] of Object.entries(S)) o[k] = pick(v, lang);
    return o;
  }, [lang]);
}

/* ═════ Сурет бөлшектері (тегіс, «Ақ киіз» стилі: тігіс сызықтары, қою түстер) ═════ */
const NIGHT_C = { sky1: "#0E1B33", sky2: "#22385F", hill: "#1B2C4A", ground: "#2C4A45", ground2: "#25403C", ink: "#0A1424", cream: "#FFFDF7", gold: "#E0A526", red: "#A63A2B" };

function Moon({ x, y, r, phase, gid }) {
  // phase 0..1: орақ ай → толған ай (көлеңке маска арқылы — аспан градиентін бүлдірмейді)
  const off = r * 2 * (1 - phase);
  return (
    <g>
      <circle cx={x} cy={y} r={r * 1.9} fill={NIGHT_C.cream} opacity=".05" />
      <circle cx={x} cy={y} r={r * 1.4} fill={NIGHT_C.cream} opacity=".07" />
      <g mask={phase < 1 ? `url(#${gid}moon)` : undefined}>
      {phase < 1 && (
        <mask id={`${gid}moon`} maskUnits="userSpaceOnUse" x={x - r * 2} y={y - r * 2} width={r * 4} height={r * 4}>
          <rect x={x - r * 2} y={y - r * 2} width={r * 4} height={r * 4} fill="#fff" />
          <circle cx={x - off} cy={y - r * 0.08} r={r * 1.02} fill="#000" />
        </mask>
      )}
      <circle cx={x} cy={y} r={r} fill="#F6E9C4" />
      <circle cx={x - r * 0.3} cy={y - r * 0.2} r={r * 0.18} fill="#E6D3A0" />
      <circle cx={x + r * 0.28} cy={y + r * 0.3} r={r * 0.12} fill="#E6D3A0" />
      </g>
    </g>
  );
}
const STARS = [[22, 22], [58, 48], [94, 16], [130, 40], [168, 12], [204, 34], [252, 18], [276, 52], [330, 26], [384, 44], [112, 70], [236, 66], [16, 80], [190, 84], [366, 88]];
function Sky({ phase, gid }) {
  return (
    <>
      <defs>
        <linearGradient id={`${gid}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={NIGHT_C.sky1} />
          <stop offset="1" stopColor={NIGHT_C.sky2} />
        </linearGradient>
      </defs>
      <rect width={W} height={HORIZON + 10} fill={`url(#${gid}sky)`} />
      {STARS.map(([x, y], i) => (
        <circle key={i} className="aq-star" cx={x} cy={y} r={i % 3 ? 1.2 : 1.8} fill={NIGHT_C.cream} style={{ "--i": i }} />
      ))}
      <Moon x={326} y={44} r={17} phase={phase} gid={gid} />
    </>
  );
}
function Yurt({ x, y, s = 1, door = true }) {
  // x,y — есіктің төменгі ортасы
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-34 0V-22H34V0Z" fill="#E9DEC6" />
      <path d="M-34 -22C-30 -42 -14 -50 0 -51C14 -50 30 -42 34 -22Z" fill="#F4ECDA" />
      <path d="M-31 -10H31M-31 -18H31" stroke="#B8322A" strokeWidth="2.2" strokeDasharray="5 3" />
      <path d="M-30 -24C-24 -36 -12 -42 0 -43C12 -42 24 -36 30 -24" stroke="#B8322A" strokeWidth="2.4" fill="none" strokeDasharray="4 3" />
      <rect x="-6" y="-56" width="12" height="6" rx="2" fill="#8A6A44" />
      {door && <path d="M-8 0V-17H8V0Z" fill="#F0B640" />}
      {door && <path d="M-8 -17H8" stroke="#8A2018" strokeWidth="2" />}
    </g>
  );
}
function Rock({ x, y, w = 30, h = 18, fill = "#5B6474" }) {
  return (
    <g>
      <path d={`M${x} ${y}C${x} ${y - h * 0.8} ${x + w * 0.3} ${y - h} ${x + w * 0.55} ${y - h}C${x + w * 0.9} ${y - h} ${x + w} ${y - h * 0.5} ${x + w} ${y}Z`} fill={fill} />
      <path d={`M${x + w * 0.2} ${y - h * 0.5}C${x + w * 0.3} ${y - h * 0.8} ${x + w * 0.5} ${y - h * 0.85} ${x + w * 0.65} ${y - h * 0.8}`} stroke={NIGHT_C.cream} strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="2 2.5" fill="none" />
    </g>
  );
}
function Bush({ x, y, s = 1, fill = "#3D6650" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-16 0C-20 -10 -10 -18 -4 -12C-2 -22 12 -22 12 -10C20 -12 22 -2 16 0Z" fill={fill} />
      <path d="M-8 -6C-4 -10 4 -10 8 -6" stroke={NIGHT_C.cream} strokeOpacity=".3" strokeWidth="1.3" strokeDasharray="2 2" fill="none" />
    </g>
  );
}
function Fir({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-2.5" y="-8" width="5" height="9" fill="#5A3A22" />
      <path d="M0 -50L-14 -26H-7L-18 -8H18L7 -26H14Z" fill="#2F6B4F" />
      <path d="M-8 -20H8M-4 -36H4" stroke={NIGHT_C.cream} strokeOpacity=".3" strokeWidth="1.3" strokeDasharray="2 2" />
    </g>
  );
}
function Sheep({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-9" y="-6" width="3" height="7" fill="#3A3A44" />
      <rect x="5" y="-6" width="3" height="7" fill="#3A3A44" />
      <ellipse cx="0" cy="-11" rx="14" ry="9" fill="#EDE4D0" />
      <ellipse cx="14" cy="-14" rx="5" ry="4" fill="#3A3A44" />
      <path d="M-8 -14C-4 -18 4 -18 8 -14" stroke="#B8AE96" strokeWidth="1.3" strokeDasharray="2 2" fill="none" />
    </g>
  );
}
function Fire({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-14 0L12 -6M-12 -6L14 0" stroke="#6A4326" strokeWidth="4" strokeLinecap="round" />
      <path className="aq-flame" d="M0 -6C-9 -12 -6 -22 0 -30C2 -22 9 -18 6 -10C5 -7 3 -6 0 -6Z" fill="#E0A526" />
      <path d="M0 -7C-4 -10 -3 -15 0 -19C2 -15 4 -12 2 -9Z" fill="#FFF1C4" />
    </g>
  );
}

const SceneArt = memo(function SceneArt({ id, phase, gid }) {
  const groundPath = `M0 ${HORIZON}C80 ${HORIZON - 6} 160 ${HORIZON + 4} 240 ${HORIZON - 2}C300 ${HORIZON - 6} 360 ${HORIZON} 400 ${HORIZON - 4}V${H}H0Z`;
  return (
    <g>
      <Sky phase={phase} gid={gid} />
      {id === "tau" ? (
        <>
          <path d={`M-10 ${HORIZON + 4}L60 70L104 112L150 52L214 ${HORIZON}Z`} fill="#2A3D63" />
          <path d="M150 52L134 76L146 72L152 80L160 70L166 76Z" fill={NIGHT_C.cream} opacity=".85" />
          <path d="M60 70L48 88L58 84L64 90L70 84Z" fill={NIGHT_C.cream} opacity=".85" />
          <path d={`M180 ${HORIZON + 4}L262 60L332 120L362 92L414 ${HORIZON + 4}Z`} fill="#33496F" />
          <path d="M262 60L246 82L258 78L264 86L272 78L280 84Z" fill={NIGHT_C.cream} opacity=".85" />
        </>
      ) : (
        <path d={`M0 ${HORIZON - 6}C50 ${HORIZON - 34} 110 ${HORIZON - 30} 160 ${HORIZON - 12}C220 ${HORIZON - 40} 300 ${HORIZON - 36} 400 ${HORIZON - 10}V${HORIZON + 6}H0Z`} fill={NIGHT_C.hill} />
      )}
      <path d={groundPath} fill={NIGHT_C.ground} />
      <path d={`M0 ${H - 34}C120 ${H - 46} 260 ${H - 26} 400 ${H - 40}V${H}H0Z`} fill={NIGHT_C.ground2} />
      {id === "aul" && (
        <>
          <Yurt x={92} y={HORIZON + 22} s={0.95} />
          <Yurt x={196} y={HORIZON + 12} s={0.7} door={false} />
          <Yurt x={300} y={HORIZON + 26} s={1.05} />
          <path d="M226 206V176M222 178H252M248 206V176" stroke="#7A4A22" strokeWidth="4" strokeLinecap="round" />
          <Horse x="228" y="170" width="58" height="52" coat="#5A4632" mane="#2B1A10" riderOn={false} />
          <Bush x={36} y={232} s={0.9} />
          <Bush x={350} y={238} s={1.1} />
          <Rock x={140} y={240} w={26} h={12} />
        </>
      )}
      {id === "river" && (
        <>
          <path d={`M-10 196C80 176 150 214 230 196C300 180 350 206 410 192V218C350 232 300 206 230 222C150 240 80 202 -10 222Z`} fill="#1E5A78" />
          <path d="M40 204C60 200 74 202 90 206M200 206C220 202 240 204 254 200M300 198C318 196 332 200 346 202" stroke={NIGHT_C.cream} strokeOpacity=".45" strokeWidth="2" strokeDasharray="6 5" fill="none" strokeLinecap="round" />
          <path d="M318 196V212M326 200V214M310 202V214" stroke="#F6E9C4" strokeOpacity=".45" strokeWidth="2.5" strokeLinecap="round" />
          {[24, 30, 36, 120, 126, 268, 274, 280, 380].map((x, i) => (
            <path key={i} d={`M${x} ${i % 2 ? 182 : 186}C${x - 2} ${172} ${x + 2} ${164} ${x} ${158 + (i % 3) * 3}`} stroke="#4D7A55" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          ))}
          <g transform="translate(178 172)">
            <rect x="-3" y="-30" width="6" height="32" fill="#5A3A22" />
            <path d="M0 -28C-30 -30 -34 -6 -26 4M0 -28C30 -30 34 -6 26 4M0 -30C-12 -42 12 -42 0 -30" stroke="#3E7050" strokeWidth="9" fill="none" strokeLinecap="round" />
          </g>
          <Rock x={60} y={242} w={34} h={16} />
          <Rock x={300} y={244} w={28} h={14} fill="#4E586A" />
        </>
      )}
      {id === "jailau" && (
        <>
          <Yurt x={330} y={HORIZON + 6} s={0.55} door />
          <path d="M20 190H140M24 182V198M60 182V198M96 182V198M132 182V198" stroke="#7A4A22" strokeWidth="3" strokeLinecap="round" />
          <Sheep x={70} y={226} />
          <Sheep x={106} y={236} s={0.9} />
          <Sheep x={244} y={212} s={0.85} />
          <Horse x="150" y="160" width="70" height="63" coat="#8E8A80" mane="#3A3A3A" riderOn={false} />
          <Horse x="280" y="176" width="64" height="58" coat="#6B4A2E" mane="#2B1A10" riderOn={false} />
          <Bush x={372} y={238} />
        </>
      )}
      {id === "tau" && (
        <>
          <Fir x={34} y={196} s={0.9} />
          <Fir x={62} y={186} s={0.7} />
          <Fir x={360} y={204} s={1} />
          <Fir x={332} y={192} s={0.75} />
          <Rock x={120} y={214} w={44} h={24} />
          <Rock x={250} y={240} w={36} h={18} fill="#4E586A" />
          <Fire x={210} y={214} />
          <Bush x={290} y={196} s={0.8} fill="#35594A" />
        </>
      )}
    </g>
  );
});

function Bone({ x, y, white = false, s = 1 }) {
  const fill = white ? "#FFFDF7" : "#F2C14E";
  const edge = white ? "#BFB49A" : "#9A6A10";
  return (
    <g transform={`translate(${x} ${y}) rotate(-18) scale(${s})`}>
      <circle r="16" fill={white ? "#FFFDF7" : "#E0A526"} opacity=".22" />
      <rect x="-9" y="-2.6" width="18" height="5.2" rx="2.6" fill={fill} stroke={edge} strokeWidth=".8" />
      {[-9, 9].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="-3" r="3.6" fill={fill} stroke={edge} strokeWidth=".8" />
          <circle cx={cx} cy="3" r="3.6" fill={fill} stroke={edge} strokeWidth=".8" />
        </g>
      ))}
    </g>
  );
}

/* ═════ Түнгі сахна ═════ */
function NightScene({ night, plan, pos, r, found, phase, shimmer, trail, onAim, label, whiteOn }) {
  const raw = useId();
  const gid = "aq" + raw.replace(/[^a-zA-Z0-9]/g, "");
  const svgRef = useRef(null);
  const down = useRef(false);
  const toSvg = (e) => {
    const b = svgRef.current.getBoundingClientRect();
    return [((e.clientX - b.left) / b.width) * W, ((e.clientY - b.top) / b.height) * H];
  };
  const pd = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    down.current = true;
    try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch {}
    onAim(toSvg(e));
  };
  const pm = (e) => down.current && onAim(toSvg(e));
  const pu = () => (down.current = false);
  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className={`aq-scene ${phase === "explore" ? "live" : ""}`}
      role="img"
      aria-label={label}
      onPointerDown={pd}
      onPointerMove={pm}
      onPointerUp={pu}
      onPointerCancel={pu}
    >
      <defs>
        <radialGradient id={`${gid}hole`}>
          <stop offset="0" stopColor="#000" />
          <stop offset=".55" stopColor="#000" />
          <stop offset="1" stopColor="#fff" />
        </radialGradient>
        <linearGradient id={`${gid}dark`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#06101C" stopOpacity=".55" />
          <stop offset=".18" stopColor="#06101C" stopOpacity=".86" />
          <stop offset="1" stopColor="#06101C" stopOpacity=".93" />
        </linearGradient>
        <radialGradient id={`${gid}warm`}>
          <stop offset="0" stopColor="#FFD77A" stopOpacity=".28" />
          <stop offset="1" stopColor="#FFD77A" stopOpacity="0" />
        </radialGradient>
        <mask id={`${gid}m`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <rect width={W} height={H} fill="#fff" />
          <circle cx={pos[0]} cy={pos[1] - 6} r={r} fill={`url(#${gid}hole)`} />
        </mask>
      </defs>
      <SceneArt id={night.id} phase={night.moon} gid={gid} />
      {/* Сүйек тек шырақ жарығына іліккенде ғана сызылады — қараңғыда көрінбейді */}
      {plan.bones.map((b) => !found[b.id] && dist(pos, [b.x, b.y]) < r + 16 && <Bone key={b.id} x={b.x} y={b.y} />)}
      {whiteOn && dist(pos, [plan.white.x, plan.white.y]) < r + 20 && <Bone x={plan.white.x} y={plan.white.y} white s={1.35} />}
      {/* Қараңғылық: шырақ шеңберінен басқа жердің бәрі көмескі */}
      <rect y={HORIZON - 24} width={W} height={H - HORIZON + 24} fill={`url(#${gid}dark)`} mask={`url(#${gid}m)`} />
      <circle cx={pos[0]} cy={pos[1] - 6} r={r} fill={`url(#${gid}warm)`} pointerEvents="none" />
      {/* Табылған сүйектер — алтын жұлдызша */}
      {plan.bones.map((b) =>
        found[b.id] ? (
          <g key={b.id} transform={`translate(${b.x} ${b.y})`} className={`aq-mark ${found[b.id] === "bad" ? "bad" : ""}`}>
            <circle r="6.5" fill={found[b.id] === "bad" ? "#F3E3E6" : "#E0A526"} />
            {found[b.id] === "bad" ? (
              <path d="M-2.4 -2.4L2.4 2.4M2.4 -2.4L-2.4 2.4" stroke="#6E1E2E" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M-3 0L-1 2.2L3.2 -2.4" stroke="#3A2500" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            )}
          </g>
        ) : shimmer ? (
          <circle key={b.id} className="aq-glint" cx={b.x} cy={b.y} r="2.2" fill="#F6D27A" style={{ "--i": b.id }} />
        ) : null
      )}
      {whiteOn && <circle className="aq-whiteglow" cx={plan.white.x} cy={plan.white.y} r="13" fill="#FFFDF7" opacity=".16" />}
      {trail && (
        <g className="aq-trail" pointerEvents="none">
          <path d={`M${pos[0]} ${pos[1]}L${trail[0]} ${trail[1]}`} stroke="#F6D27A" strokeWidth="2" strokeDasharray="3 6" strokeLinecap="round" />
          <circle cx={trail[0]} cy={trail[1]} r="14" fill="none" stroke="#F6D27A" strokeWidth="2" className="aq-trail-ring" />
        </g>
      )}
      {/* Шырақ ұстаған бала (кішкентай) */}
      <g transform={`translate(${pos[0]} ${pos[1]})`} pointerEvents="none">
        <ellipse cx="0" cy="2" rx="8" ry="2.4" fill="#000" opacity=".3" />
        <path d="M-5 0V-14C-5 -19 5 -19 5 -14V0Z" fill="#B8322A" />
        <path d="M-5 -7H5" stroke="#E0A526" strokeWidth="1.4" strokeDasharray="2 1.5" />
        <circle cx="0" cy="-21" r="4.6" fill="#D9A577" />
        <path d="M-5 -23C-5 -28 5 -28 5 -23C3 -25 -3 -25 -5 -23Z" fill="#1F2430" />
        <path d="M5 -12L10 -16" stroke="#3A2A1A" strokeWidth="1.5" strokeLinecap="round" />
        <g className="aq-lamp">
          <circle cx="11" cy="-14" r="7" fill="#FFD77A" opacity=".35" />
          <rect x="8.4" y="-17" width="5.2" height="6.4" rx="1.4" fill="#FFE7A6" stroke="#9A6A10" strokeWidth=".9" />
          <path d="M9 -18H13" stroke="#9A6A10" strokeWidth="1.2" />
        </g>
      </g>
    </svg>
  );
}

/* ═════ Тапсырма карточкасы ═════ */
function SayBtn({ text, label }) {
  return (
    <button type="button" className="aq-say" onClick={() => sayKk(text).catch?.(() => {})} aria-label={`${label}: ${text}`}>
      <Icon name="volume" size={18} />
    </button>
  );
}

function TaskCard({ task, q, explain, onDone: done1 }) {
  const onDone = useOnce(done1);
  const box = useReveal();
  const [picked, setPicked] = useState(null);
  const [built, setBuilt] = useState([]); // әріп id-лері
  const [checked, setChecked] = useState(null); // "ok" | "bad"
  const typeTitle = { meaning: q.tMeaning, translate: q.tTranslate, gap: q.tGap, build: q.tBuild }[task.type];
  const isBuild = task.type === "build";
  const done = Boolean(checked);
  const ok = checked === "ok";
  const choose = useCallback(
    (key) => {
      if (done) return;
      setPicked(key);
      setChecked(key === task.answer ? "ok" : "bad");
    },
    [done, task]
  );
  const tap = (id) => {
    if (done || built.includes(id)) return;
    const nb = [...built, id];
    setBuilt(nb);
    if (nb.length === task.letters.length) {
      const word = nb.map((i) => task.letters[i].c).join("");
      setChecked(word === task.answer ? "ok" : "bad");
    }
  };
  const undo = () => !done && setBuilt((b) => b.slice(0, -1));
  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.target?.tagName === "BUTTON" && (e.key === "Enter" || e.key === " ")) return;
      if (done && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onDone(ok);
        return;
      }
      if (done) return;
      if (!isBuild) {
        const i = "1234".indexOf(e.key);
        if (i >= 0 && task.options[i]) choose(task.options[i].key);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        undo();
      } else {
        const ch = lower(e.key);
        const free = task.letters.find((l) => l.c === ch && !built.includes(l.id));
        if (free) tap(free.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  const shownWord = task.word.kk;
  return (
    <section ref={box} className={`card aq-task ${checked || ""}`} aria-live="polite">
      <div className="aq-task-top">
        <span className="aq-task-kind">
          <Icon name="sparkle" size={16} /> {q.found}
        </span>
        <b className="aq-task-title">{typeTitle}</b>
      </div>
      {task.type === "gap" ? (
        <p className="aq-prompt kk" dir="ltr">
          {[...task.prompt].map((c, i) =>
            i === task.gapAt ? (
              <span key={i} className={`aq-gap ${checked ? "on" : ""}`}>{checked ? task.answer : " "}</span>
            ) : (
              <span key={i}>{c}</span>
            )
          )}
        </p>
      ) : (
        <p className={`aq-prompt ${task.type === "meaning" ? "kk" : ""}`} dir={task.type === "meaning" ? "ltr" : undefined}>{task.prompt}</p>
      )}
      {task.sub && <p className="aq-sub">{task.sub}</p>}
      {isBuild ? (
        <>
          <div className="aq-slots" dir="ltr">
            {task.letters.map((_, i) => (
              <span key={i} className={`aq-slot ${built[i] !== undefined ? "on" : ""}`}>{built[i] !== undefined ? task.letters[built[i]].c : ""}</span>
            ))}
          </div>
          <div className="aq-letters" dir="ltr">
            {task.letters.map((l) => (
              <button key={l.id} type="button" className={`aq-letter ${built.includes(l.id) ? "used" : ""}`} disabled={done || built.includes(l.id)} onClick={() => tap(l.id)}>
                {l.c}
              </button>
            ))}
          </div>
          {!done && (
            <div className="aq-row">
              <button type="button" className="btn ghost" onClick={undo} disabled={!built.length}>
                <Icon name="left" size={16} /> {q.clear}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="g-opts aq-opts">
          {task.options.map((o, i) => {
            const st = picked ? (o.key === task.answer ? "ok" : o.key === picked ? "bad" : "dim") : "";
            return (
              <button key={o.key + i} type="button" className={`qopt ${st}`} disabled={done} onClick={() => choose(o.key)}>
                <kbd className="qk" aria-hidden="true">{i + 1}</kbd>
                <span dir={task.type === "meaning" ? undefined : "ltr"}>{o.label}</span>
                {st === "ok" && picked === o.key && <Burst />}
              </button>
            );
          })}
        </div>
      )}
      {done && (
        <div className={`aq-fb ${checked}`}>
          <span className="aq-fb-mark" aria-hidden="true"><Icon name={ok ? "check" : "x"} size={18} stroke={3} /></span>
          <span className="aq-fb-txt">
            <b>{ok ? q.right : q.wrong}</b>
            <span>
              <span dir="ltr" className="kk">{shownWord}</span> — {tr(task.word, explain)}
            </span>
          </span>
          <SayBtn text={shownWord} label={q.lantern} />
          <button type="button" className="btn gold aq-next" onClick={() => onDone(ok)} autoFocus>
            {q.next} <Icon name="right" size={16} className="aq-flip" />
          </button>
        </div>
      )}
    </section>
  );
}

/* ═════ Жұмбақ ═════ */
function RiddleCard({ riddle, q, lang, explain, onSolved: solved1 }) {
  const onSolved = useOnce(solved1);
  const box = useReveal();
  const [wrong, setWrong] = useState([]);
  const [solved, setSolved] = useState(false);
  const [clue, setClue] = useState(false);
  const opts = useMemo(() => shuffleWith(riddle.opts), [riddle]);
  const choose = useCallback(
    (o) => {
      if (solved || wrong.includes(o.kk)) return;
      if (o.kk === riddle.opts[0].kk) setSolved(true);
      else {
        setWrong((w) => [...w, o.kk]);
        setClue(true);
      }
    },
    [solved, wrong, riddle]
  );
  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.target?.tagName === "BUTTON" && e.key === "Enter") return;
      if (solved && e.key === "Enter") return onSolved(wrong.length === 0);
      const i = "1234".indexOf(e.key);
      if (i >= 0 && opts[i]) choose(opts[i]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  return (
    <section ref={box} className={`card aq-riddle ${solved ? "ok" : ""}`} aria-live="polite">
      <div className="aq-task-top">
        <span className="aq-task-kind moon">
          <Icon name="moon" size={16} /> {q.riddle}
        </span>
        <b className="aq-task-title">{q.riddleAsk}</b>
      </div>
      <blockquote className="aq-riddle-q kk" dir="ltr">
        {riddle.kk}
      </blockquote>
      {clue || solved ? (
        <p className="aq-sub aq-clue">
          <Icon name="sparkle" size={15} /> {pick(riddle.tr, lang)}
        </p>
      ) : (
        <button type="button" className="btn ghost aq-clue-btn" onClick={() => setClue(true)}>
          <Icon name="sparkle" size={16} /> {q.clue}
        </button>
      )}
      <div className="g-opts aq-opts">
        {opts.map((o, i) => {
          const isAns = o.kk === riddle.opts[0].kk;
          const st = solved ? (isAns ? "ok" : "dim") : wrong.includes(o.kk) ? "bad" : "";
          return (
            <button key={o.kk} type="button" className={`qopt ${st}`} disabled={solved || wrong.includes(o.kk)} onClick={() => choose(o)}>
              <kbd className="qk" aria-hidden="true">{i + 1}</kbd>
              <span className="aq-opt2">
                <b dir="ltr">{o.kk}</b>
                <small>{tr(o, explain)}</small>
              </span>
              {st === "ok" && <Burst />}
            </button>
          );
        })}
      </div>
      {solved && (
        <div className="aq-fb ok">
          <span className="aq-fb-mark" aria-hidden="true"><Icon name="check" size={18} stroke={3} /></span>
          <span className="aq-fb-txt">
            <b>{q.right}</b>
            <span><span dir="ltr" className="kk">{riddle.opts[0].kk}</span> — {tr(riddle.opts[0], explain)}</span>
          </span>
          <button type="button" className="btn gold aq-next" onClick={() => onSolved(wrong.length === 0)} autoFocus>
            {q.next} <Icon name="right" size={16} className="aq-flip" />
          </button>
        </div>
      )}
    </section>
  );
}

/* ═════ Құпия: мақал бөліктері ═════ */
function Scroll({ proverb, have, q, lang, full = false }) {
  return (
    <div className={`aq-scroll ${full ? "full" : ""}`}>
      <span className="aq-scroll-cap">{q.secret}</span>
      <p className="aq-scroll-line kk" dir="ltr">
        {proverb.parts.map((p, i) => (
          <span key={i} className={`aq-piece ${i < have ? "on" : ""} ${i === have - 1 && !full ? "new" : ""}`} style={{ "--i": i }}>
            {i < have ? p : "• • •"}
          </span>
        ))}
      </p>
      {full && (
        <p className="aq-scroll-mean">
          <b>{q.meaning}:</b> {pick(proverb.mean, lang)}
        </p>
      )}
    </div>
  );
}

function Assemble({ proverb, q, lang, onDone: done1 }) {
  const onDone = useOnce(done1);
  const tiles = useMemo(() => {
    const idx = proverb.parts.map((_, i) => i);
    let s = shuffleWith(idx);
    for (let k = 0; k < 5 && s.every((v, i) => v === i); k++) s = shuffleWith(idx);
    if (s.every((v, i) => v === i)) s = [...idx.slice(1), idx[0]];
    return s;
  }, [proverb]);
  const [seq, setSeq] = useState([]);
  const [st, setSt] = useState(null);
  const [miss, setMiss] = useState(0);
  const tap = (i) => {
    if (st === "ok" || seq.includes(i)) return;
    const ns = [...seq, i];
    setSeq(ns);
    if (ns.length === tiles.length) {
      if (ns.every((v, k) => v === k)) setSt("ok");
      else {
        setSt("bad");
        setMiss((m) => m + 1);
        setTimeout(() => {
          setSeq([]);
          setSt(null);
        }, reduced() ? 600 : 1000);
      }
    }
  };
  useEffect(() => {
    const onKey = (e) => {
      if (e.target?.tagName === "BUTTON" && e.key === "Enter") return;
      if (st === "ok" && e.key === "Enter") return onDone(miss === 0);
      const n = "1234".indexOf(e.key);
      if (n >= 0 && tiles[n] !== undefined) tap(tiles[n]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  return (
    <section className={`card aq-assemble ${st || ""}`} aria-live="polite">
      <div className="aq-task-top">
        <span className="aq-task-kind moon">
          <Icon name="scroll" size={16} /> {q.secret}
        </span>
        <b className="aq-task-title">{q.assemble}</b>
      </div>
      <p className="aq-line kk" dir="ltr">
        {proverb.parts.map((_, k) => (
          <span key={k} className={`aq-lslot ${seq[k] !== undefined ? "on" : ""}`}>{seq[k] !== undefined ? proverb.parts[seq[k]] : ""}</span>
        ))}
      </p>
      {st !== "ok" && (
      <div className="aq-tiles" dir="ltr">
        {tiles.map((i, n) => (
          <button key={i} type="button" className={`aq-tile ${seq.includes(i) ? "used" : ""}`} disabled={st === "ok" || seq.includes(i)} onClick={() => tap(i)}>
            <kbd className="qk" aria-hidden="true">{n + 1}</kbd>
            {proverb.parts[i]}
          </button>
        ))}
      </div>
      )}
      {st === "ok" && <Scroll proverb={proverb} have={proverb.parts.length} q={q} lang={lang} full />}
      {st === "ok" && (
        <button type="button" className="btn gold big aq-final" onClick={() => onDone(miss === 0)} autoFocus>
          <Icon name="trophy" size={18} /> {q.finish}
        </button>
      )}
    </section>
  );
}

/* ═════ Дайындық экранындағы түндер жолағы ═════ */
function NightsStrip({ q, lang }) {
  return (
    <div className="aq-strip">
      <span className="aq-strip-cap">{q.nights}</span>
      <ol className="aq-strip-row">
        {NIGHTS.map((n, i) => (
          <li key={n.id}>
            <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true" focusable="false">
              <rect width="40" height="40" rx="10" fill="#1B2C4A" />
              <circle cx="20" cy="20" r="10" fill="#F6E9C4" />
              {n.moon < 1 && <circle cx={20 - 20 * (1 - n.moon)} cy="19" r="10.2" fill="#1B2C4A" />}
            </svg>
            <span>
              <small>{fmt(q.night, { n: i + 1 })}</small>
              <b>{pick(n.name, lang)}</b>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ═════ Негізгі ойын ═════ */
export function AqSuiek({ game }) {
  const { lang, explain, award } = useApp();
  const q = useQ();
  const { finish, reset } = useFinish(game.id);
  const [level, setLevel] = useState(1);
  const [phase, setPhase] = useState("ready"); // ready | intro | explore | task | riddle | piece | assemble | done
  const [ni, setNi] = useState(0);
  const [plan, setPlan] = useState(null);
  const [pos, setPos] = useState([200, 200]);
  const [found, setFound] = useState({}); // id → "ok" | "bad"
  const [cur, setCur] = useState(null); // ағымдағы сүйек
  const [trailsLeft, setTrailsLeft] = useState(0);
  const [trail, setTrail] = useState(null);
  const [score, setScore] = useState({ good: 0, total: 0 });
  const [result, setResult] = useState(null);
  const [quest, setQuest] = useState(null); // { riddles, proverb }
  const posRef = useRef([200, 200]);
  const target = useRef(null);
  const keys = useRef(new Set());
  const st = useRef({});
  const used = useRef(new Set());
  const lv = LEVELS[level - 1];
  const trf = useCallback((w) => tr(w, explain), [explain]);

  const allFound = plan ? plan.bones.every((b) => found[b.id]) : false;
  st.current = { phase, plan, found, allFound, r: lv.r };

  const beginNight = useCallback(
    (n) => {
      const p = planNight(n, level, WORDS, trf, Math.random, used.current);
      p.bones.forEach((b) => used.current.add(lower(b.task.word.kk)));
      setPlan(p);
      setNi(n);
      setFound({});
      setCur(null);
      setTrail(null);
      setTrailsLeft(LEVELS[level - 1].trails);
      posRef.current = [...p.night.start];
      setPos(posRef.current);
      target.current = null;
      setPhase("intro");
    },
    [level, trf]
  );

  function start() {
    reset();
    used.current = new Set();
    setScore({ good: 0, total: 0 });
    setResult(null);
    setQuest({ riddles: shuffleWith(RIDDLES).slice(0, NIGHTS.length), proverb: shuffleWith(PROVERBS)[0] });
    beginNight(0);
  }

  // Табу: шырақ сүйекке жақындағанда
  const check = useCallback((p) => {
    const s = st.current;
    if (s.phase !== "explore" || !s.plan) return false;
    const near = s.r * 0.42;
    const b = s.plan.bones.find((x) => !s.found[x.id] && dist(p, [x.x, x.y]) < near);
    if (b) {
      target.current = null;
      keys.current.clear();
      setCur(b);
      setTrail(null);
      setPhase("task");
      return true;
    }
    if (s.allFound && dist(p, [s.plan.white.x, s.plan.white.y]) < near) {
      target.current = null;
      keys.current.clear();
      setTrail(null);
      setPhase("riddle");
      return true;
    }
    return false;
  }, []);

  // Қозғалыс циклі
  useEffect(() => {
    if (phase !== "explore") return;
    let raf, last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      let [x, y] = posRef.current;
      const k = keys.current;
      let moved = false;
      if (k.size) {
        const dx = (k.has("r") ? 1 : 0) - (k.has("l") ? 1 : 0);
        const dy = (k.has("d") ? 1 : 0) - (k.has("u") ? 1 : 0);
        if (dx || dy) {
          const m = Math.hypot(dx, dy);
          [x, y] = clampPos([x + (dx / m) * SPEED * dt, y + (dy / m) * SPEED * dt * 0.8]);
          target.current = null;
          moved = true;
        }
      } else if (target.current) {
        const [tx, ty] = target.current;
        const d = Math.hypot(tx - x, ty - y);
        const step = SPEED * dt;
        if (d <= step || reduced()) {
          [x, y] = [tx, ty];
          target.current = null;
        } else [x, y] = [x + ((tx - x) / d) * step, y + ((ty - y) / d) * step];
        moved = true;
      }
      if (moved) {
        posRef.current = [x, y];
        setPos([x, y]);
        if (check([x, y])) return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase, check]);

  // Пернетақта
  useEffect(() => {
    if (phase !== "explore") return;
    const MAP = { ArrowLeft: "l", ArrowRight: "r", ArrowUp: "u", ArrowDown: "d", a: "l", d: "r", w: "u", s: "d", A: "l", D: "r", W: "u", S: "d" };
    const dn = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const m = MAP[e.key];
      if (m) {
        e.preventDefault();
        keys.current.add(m);
      }
    };
    const upk = (e) => {
      const m = MAP[e.key];
      if (m) keys.current.delete(m);
    };
    const blur = () => keys.current.clear();
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup", upk);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", dn);
      window.removeEventListener("keyup", upk);
      window.removeEventListener("blur", blur);
      keys.current.clear();
    };
  }, [phase]);

  const aim = useCallback(
    (p) => {
      if (st.current.phase === "intro") setPhase("explore");
      else if (st.current.phase !== "explore") return;
      target.current = clampPos(p);
    },
    []
  );

  // «Із»: ең жақын табылмаған нысанға бағыт
  const showTrail = () => {
    if (!plan || trailsLeft <= 0) return;
    const goals = allFound ? [[plan.white.x, plan.white.y]] : plan.bones.filter((b) => !found[b.id]).map((b) => [b.x, b.y]);
    if (!goals.length) return;
    goals.sort((a, b) => dist(posRef.current, a) - dist(posRef.current, b));
    setTrail(goals[0]);
    setTrailsLeft((n) => n - 1);
  };
  useEffect(() => {
    if (!trail) return;
    const id = setTimeout(() => setTrail(null), 2600);
    return () => clearTimeout(id);
  }, [trail]);

  const taskDone = (ok) => {
    setFound((f) => ({ ...f, [cur.id]: ok ? "ok" : "bad" }));
    setScore((s) => ({ good: s.good + (ok ? 1 : 0), total: s.total + 1 }));
    setCur(null);
    setPhase("explore");
  };
  const riddleDone = (ok) => {
    setScore((s) => ({ good: s.good + (ok ? 1 : 0), total: s.total + 1 }));
    award(8 + (level - 1) * 4, 8 + (level - 1) * 4); // әр жұмбақ: тиын екі есе (квест қиын)
    setPhase("piece");
  };
  const nextNight = () => {
    if (ni + 1 < NIGHTS.length) beginNight(ni + 1);
    else setPhase("assemble");
  };
  const questDone = (ok) => {
    const good = score.good + (ok ? 1 : 0);
    const total = score.total + 1;
    setScore({ good, total });
    finish(true, good, level);
    setResult({ win: true, stars: starsFor(good, total), text: fmt(q.result, { a: good, b: total }), level });
    setPhase("done");
  };

  const night = plan?.night;
  const bonesFound = plan ? plan.bones.filter((b) => found[b.id]).length : 0;
  const exploring = phase === "intro" || phase === "explore";

  return (
    <Frame game={game} result={result} onRestart={start}>
      {phase === "ready" ? (
        <Ready game={game} onStart={start} level={level} setLevel={setLevel} extra={<NightsStrip q={q} lang={lang} />} />
      ) : phase === "assemble" ? (
        <Assemble proverb={quest.proverb} q={q} lang={lang} onDone={questDone} />
      ) : plan ? (
        <section className={`card aq aq-n-${night.id}`}>
          <div className="aq-top">
            <span className="aq-night">
              <Icon name="moon" size={16} /> {fmt(q.night, { n: ni + 1 })} · <b>{pick(night.name, lang)}</b>
            </span>
            <span className="aq-side">
              <span className="chip aq-chip" aria-label={`${q.bones}: ${bonesFound} / ${plan.bones.length}`}>
                <svg viewBox="-12 -8 24 16" width="20" height="14" aria-hidden="true" focusable="false"><Bone x={0} y={0} s={0.7} /></svg>
                <span dir="ltr"><b>{bonesFound}</b> / {plan.bones.length}</span>
              </span>
              <span className="chip aq-chip" aria-label={`${q.stars}: ${score.good}`}>
                <Icon name="star" size={15} /> <b>{score.good}</b>
              </span>
            </span>
          </div>
          <div className="aq-body">
          <div className={`aq-stage ${phase === "explore" ? "on" : ""}`}>
            <NightScene
              night={night}
              plan={plan}
              pos={pos}
              r={lv.r}
              found={found}
              phase={phase}
              shimmer={lv.shimmer}
              trail={trail}
              onAim={aim}
              label={`${q.scene}: ${pick(night.name, lang)}`}
              whiteOn={allFound}
            />
            {phase === "intro" && (
              <div className="aq-intro">
                <span className="aq-intro-n">{fmt(q.night, { n: ni + 1 })}</span>
                <b>{pick(night.name, lang)}</b>
                <button type="button" className="btn gold" onClick={() => setPhase("explore")} autoFocus>
                  <Icon name="search" size={16} /> {q.go}
                </button>
              </div>
            )}
          </div>
          <div className="aq-panel">
          {exploring && (
            <div className="aq-help">
              <p className="aq-say-line" aria-live="polite">{allFound ? q.whiteBone : q.explore}</p>
              <button type="button" className="btn ghost aq-trail-btn" onClick={showTrail} disabled={phase !== "explore" || trailsLeft <= 0}>
                <Icon name="target" size={16} /> {q.trail} <span className="aq-count">{trailsLeft}</span>
              </button>
            </div>
          )}
          {phase === "explore" && (
            <div className="aq-pad" role="group" aria-label={q.lantern} dir="ltr">
              {[["u", "up", "aq-u"], ["l", "left", "aq-l"], ["d", "down", "aq-d"], ["r", "right2", "aq-r"]].map(([k, lb, cls]) => (
                <button
                  key={k}
                  type="button"
                  className={`aq-padb ${cls}`}
                  aria-label={q[lb]}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    keys.current.add(k);
                  }}
                  onPointerUp={() => keys.current.delete(k)}
                  onPointerLeave={() => keys.current.delete(k)}
                  onPointerCancel={() => keys.current.delete(k)}
                  onContextMenu={(e) => e.preventDefault()}
                  onClick={(e) => {
                    if (e.detail !== 0) return; // тек пернетақтамен басылғанда: бір қадам
                    const d = { u: [0, -28], d: [0, 28], l: [-34, 0], r: [34, 0] }[k];
                    target.current = clampPos([posRef.current[0] + d[0], posRef.current[1] + d[1]]);
                  }}
                >
                  <Icon name={k === "l" ? "left" : "right"} size={20} />
                </button>
              ))}
            </div>
          )}
          {phase === "task" && cur && <TaskCard key={`${ni}-${cur.id}`} task={cur.task} q={q} explain={explain} onDone={taskDone} />}
          {phase === "riddle" && <RiddleCard key={ni} riddle={quest.riddles[ni]} q={q} lang={lang} explain={explain} onSolved={riddleDone} />}
          {phase === "piece" && (
            <div className="aq-piecebox">
              <p className="aq-piece-head">
                <Qyran mood="cheer" size={56} />
                <b>{q.piece}</b>
              </p>
              <Scroll proverb={quest.proverb} have={ni + 1} q={q} lang={lang} />
              <button type="button" className="btn gold big" onClick={nextNight} autoFocus>
                {ni + 1 < NIGHTS.length ? q.nextNight : q.toSecret} <Icon name="right" size={18} className="aq-flip" />
              </button>
            </div>
          )}
          </div>
          </div>
        </section>
      ) : null}
    </Frame>
  );
}
