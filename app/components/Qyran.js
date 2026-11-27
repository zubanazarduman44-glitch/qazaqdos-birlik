"use client";
// Aqyl — «Qyzyl til» кейіпкері: киіз-аппликация стиліндегі екі әңгімеші (қыз не жігіт — профильдегі таңдау).
// Сурет қабаттардан құралады (lib/aqyl.js, public/aqyl/*): дене, төмен түскен қол, көтерілген қол,
// көз жұмған қабақ пен жабық ауыз жамаулары. Әдетте кейіпкер тік тұрады (қолы төмен, демалады, көзін жұмып-ашады),
// ал кеңес берген, түсіндірген, сөйлеген кезде қолын көтеріп ым жасайды.
// mood: idle | happy | think | wow | support | cheer | sleep | talk | explain | proud | oops (+ синонимдер, ALIAS)
// size: бұрынғы бүркіттің өлшемі сияқты. size < 100 → бас пен иық (портрет кадры), әйтпесе бойымен.
// framing="bust" | "full" — мәжбүрлеп таңдау. char="qyz" | "jigit" — таңдауды елемей нақты бейне.
import { useId } from "react";
import { AQYL_GEOM, aqylId, aqylSrc, CANVAS } from "../../lib/aqyl";
import { useAqylChoice } from "../../lib/aqylChoice";

const ALIAS = { thinking: "think", talking: "talk", explaining: "explain", praise: "cheer", celebrate: "cheer", surprised: "wow", encouraging: "support", encourage: "support", sleepy: "sleep", sad: "oops", wrong: "oops" };

// Қалыптар: arm — қол көтеріле ме; eyes — "open" | "sleep" (‿) | "joy" (∩); mouth — null (суреттегі күлкі) | smile | o | side | talk
const POSE = {
  idle: { arm: false, eyes: "open", mouth: null },
  happy: { arm: false, eyes: "open", mouth: null },
  think: { arm: false, eyes: "open", mouth: "side" },
  wow: { arm: true, eyes: "open", mouth: "o" },
  support: { arm: true, eyes: "open", mouth: null },
  cheer: { arm: true, eyes: "joy", mouth: null },
  sleep: { arm: false, eyes: "sleep", mouth: "smile" },
  talk: { arm: true, eyes: "open", mouth: "talk" },
  explain: { arm: true, eyes: "open", mouth: "talk" },
  proud: { arm: false, eyes: "joy", mouth: null },
  oops: { arm: false, eyes: "open", mouth: "o" },
};

const LASH = "#3a2016";
const LIP = "#8a3426";
const FULL_VB = [-30, -40, 550, 1000]; // эффекттерге орын қалдырамыз

const pct = (v, total) => `${((v / total) * 100).toFixed(3)}%`;

function Lids({ g, kind }) {
  return (
    <g className="aq2-lids">
      <image href={aqylSrc(g.id, "lids")} x="0" y="0" width={CANVAS.w} height={CANVAS.h} />
      {g.eyes.map(([cx, cy, rx, ry], i) => {
        const d =
          kind === "joy"
            ? `M${cx - rx * 0.8} ${cy + ry * 0.35} Q${cx} ${cy - ry * 0.55} ${cx + rx * 0.8} ${cy + ry * 0.35}`
            : `M${cx - rx * 0.85} ${cy + ry * 0.05} Q${cx} ${cy + ry * 0.62} ${cx + rx * 0.85} ${cy + ry * 0.05}`;
        // сыртқы кірпік ұшы (екінші көз — оң жақ)
        const ox = i === 1 ? cx + rx * 0.85 : cx - rx * 0.85;
        const oy = kind === "joy" ? cy + ry * 0.35 : cy + ry * 0.05;
        const f = i === 1 ? 1 : -1;
        return (
          <g key={i} fill="none" stroke={LASH} strokeLinecap="round" strokeLinejoin="round">
            <path d={d} strokeWidth="6" />
            {g.id === "qyz" && <path d={`M${ox} ${oy} l${f * 9} ${kind === "joy" ? 2 : -7}`} strokeWidth="4.5" />}
          </g>
        );
      })}
    </g>
  );
}

function Mouth({ g, kind }) {
  const [mx, my] = g.mouth;
  let shape;
  if (kind === "o") shape = <ellipse cx={mx} cy={my + 2} rx="9" ry="11" fill={LIP} />;
  else if (kind === "side") shape = <path d={`M${mx - 16} ${my + 1} Q${mx + 2} ${my + 7} ${mx + 18} ${my - 5}`} stroke={LIP} strokeWidth="5" fill="none" strokeLinecap="round" />;
  else shape = <path d={`M${mx - 20} ${my - 6} Q${mx} ${my + 10} ${mx + 20} ${my - 6}`} stroke={LIP} strokeWidth="5" fill="none" strokeLinecap="round" />;
  return (
    <g className={`aq2-mouth ${kind === "talk" ? "is-talk" : ""}`}>
      <image href={aqylSrc(g.id, "mouth")} x="0" y="0" width={CANVAS.w} height={CANVAS.h} />
      {shape}
    </g>
  );
}

// Эффекттер (кенеп координатымен; басы мен көтерілген қолдың маңында)
function Fx({ mood }) {
  const S = (x, y, s, fill) => <path d={`M${x} ${y - 13 * s} l${3.6 * s} ${9.4 * s} ${9.4 * s} ${3.6 * s} ${-9.4 * s} ${3.6 * s} ${-3.6 * s} ${9.4 * s} ${-3.6 * s} ${-9.4 * s} ${-9.4 * s} ${-3.6 * s} ${9.4 * s} ${-3.6 * s}z`} fill={fill} />;
  if (mood === "think")
    return (
      <g className="aq2-fx aq2-dots">
        <circle cx="462" cy="96" r="8" fill="#fff" stroke="#e0a526" strokeWidth="4" />
        <circle cx="484" cy="62" r="12" fill="#fff" stroke="#e0a526" strokeWidth="4" />
        <circle cx="500" cy="8" r="28" fill="#fff" stroke="#e0a526" strokeWidth="4.5" />
        <path d="M491 0 C491 -12 509 -12 509 0 C509 8 500 8 500 17" stroke="#a3242b" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="500" cy="27" r="3.8" fill="#a3242b" />
      </g>
    );
  if (mood === "wow" || mood === "cheer" || mood === "proud")
    return (
      <g className="aq2-fx aq2-spark">
        {S(30, 120, 1.5, "#e0a526")}
        {S(486, 150, 1.2, "#e0a526")}
        {S(470, 10, 0.9, "#a3242b")}
        {mood === "cheer" && (
          <g className="aq2-confetti">
            <path d="M60 40 l14 -6 4 8 -14 6z" fill="#a3242b" />
            <path d="M470 230 l14 8 -4 7 -14 -8z" fill="#0b6e7e" />
            <circle cx="96" cy="250" r="6" fill="#0b6e7e" />
            <circle cx="500" cy="300" r="5" fill="#a3242b" />
          </g>
        )}
      </g>
    );
  if (mood === "explain")
    return (
      <g className="aq2-fx aq2-idea">
        {S(36, 262, 1.2, "#e0a526")}
        {S(92, 236, 0.75, "#a3242b")}
        <circle cx="10" cy="226" r="6" fill="#0b6e7e" />
      </g>
    );
  if (mood === "oops")
    return (
      <g className="aq2-fx aq2-sweat">
        <path d="M466 70 C454 92 450 102 450 108 a16 16 0 0 0 32 0 C482 102 478 92 466 70Z" fill="#cfe6ee" stroke="#0b6e7e" strokeWidth="4" />
        <path d="M460 104 a6 6 0 0 0 6 6" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
    );
  if (mood === "sleep")
    return (
      <g className="aq2-fx aq2-zzz" fill="none" stroke="#d0901c" strokeLinecap="round" strokeLinejoin="round">
        <path d="M440 70 h22 l-22 24 h22" strokeWidth="6" />
        <path d="M474 34 h17 l-17 19 h17" strokeWidth="5" />
        <path d="M500 4 h13 l-13 14 h13" strokeWidth="4" />
      </g>
    );
  return null;
}

/**
 * Қабатты фигура. slots — киім/әшекей қабаттары (DressUp қолданады):
 * behind (дененің артында), body (денеде, қолдың астында), armDown / armUp (сол қолмен бірге қозғалады), front (ең үсті).
 */
export function AqylFigure({ char, mood: moodIn = "idle", framing = "full", width, height, className = "", title = "Aqyl", slots = {}, decorative = false, viewBox }) {
  const chosen = useAqylChoice();
  const uid = useId();
  const id = aqylId(char || chosen);
  const G = AQYL_GEOM[id];
  const g = { ...G, id };
  const mood = ALIAS[moodIn] || moodIn;
  const p = POSE[mood] || POSE.idle;
  const vb = viewBox || (framing === "bust" ? [G.face[0], G.face[1], G.face[2], G.face[2]] : FULL_VB);
  const origin = `${pct(G.pivot[0], CANVAS.w)} ${pct(G.pivot[1], CANVAS.h)}`;
  // Әр кейіпкер өз уақытында жыпылықтасын (бәрі бірге емес)
  let h = 0;
  for (const c of uid) h = (h * 31 + c.charCodeAt(0)) % 997;
  const blinkDelay = `${-((h % 50) / 10).toFixed(1)}s`;
  const eyesShut = p.eyes !== "open";

  return (
    <svg
      className={`qyran aq2 aq2-${id} m-${mood} ${p.arm ? "arm-up" : ""} ${eyesShut ? "eyes-shut" : ""} ${p.mouth ? "mouth-on" : ""} aq2-${framing} ${className}`}
      viewBox={vb.join(" ")}
      width={width}
      height={height}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative ? "true" : undefined}
      style={{ "--bd": blinkDelay }}
    >
      <g className="aq2-react">
        <g className="aq2-fig">
          {slots.behind}
          <image href={aqylSrc(id, "base")} x="0" y="0" width={CANVAS.w} height={CANVAS.h} />
          {slots.body}
          <g className="aq2-arm aq2-down" style={{ transformOrigin: origin }}>
            <image href={aqylSrc(id, "down")} x="0" y="0" width={CANVAS.w} height={CANVAS.h} />
            {slots.armDown}
          </g>
          <g className="aq2-arm aq2-up" style={{ transformOrigin: origin }}>
            <image href={aqylSrc(id, "up")} x="0" y="0" width={CANVAS.w} height={CANVAS.h} />
            {slots.armUp}
          </g>
          <Lids g={g} kind={p.eyes === "joy" ? "joy" : "sleep"} />
          {p.mouth && <Mouth g={g} kind={p.mouth} />}
          {slots.front}
        </g>
        {framing === "full" && <Fx mood={mood} />}
      </g>
    </svg>
  );
}

const FULL_RATIO = FULL_VB[2] / FULL_VB[3];
// Бұрынғы бүркіттің кадры (ені:бойы = 200:230). Ескі орындарда CSS енін береді (мысалы, width: 104px; height: auto) —
// кейіпкер биік болғандықтан, кадрды екі жағынан кеңейтеміз: бойы бұрынғыдай қалады, макет бұзылмайды.
const WIDE_VB = [-190, -40, 870, 1000];

export default function Qyran({ mood = "idle", size = 160, className = "", title = "Aqyl", framing, char, tight = false }) {
  const f = framing || (size < 100 ? "bust" : "full");
  if (f === "bust") return <AqylFigure char={char} mood={mood} framing="bust" width={size} height={size} className={className} title={title} />;
  const h = Math.round(size * 1.15);
  // tight — кейіпкердің өз ені (чат сахнасы сияқты арнайы орындар үшін)
  const w = tight ? Math.round(h * FULL_RATIO) : size;
  return <AqylFigure char={char} mood={mood} framing="full" viewBox={tight ? undefined : WIDE_VB} width={w} height={h} className={className} title={title} />;
}

/** Кішкентай статикалық портрет (мәзір, чат тақырыбы, таңдау батырмалары). */
export function AqylAvatar({ size = 40, char, className = "", alt = "" }) {
  const chosen = useAqylChoice();
  const id = aqylId(char || chosen);
  return (
    <span className={`aq-avatar aq-avatar-${id} ${className}`} style={{ width: size, height: size }}>
      <img src={aqylSrc(id, "face")} alt={alt} width={size} height={size} decoding="async" draggable="false" />
    </span>
  );
}
