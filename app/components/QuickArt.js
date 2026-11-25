// Басты беттегі «Жылдам өту» тақтайшаларының суреттері — әр бөлімге шағын көрініс (виньетка).
// Әр сурет екі қабат: back — доғал «есік» терезесінің ішіндегі алыс көрініс (терезеге қиылады),
// front — басты кейіпкер; оның жоғарғы бөлігі (күмбез ұшы, ұшқан асық, сөз бұлты, ұшқындар) терезеден асып шығады.
// Екі қабат та бір viewBox (200×160), бір preserveAspectRatio — сондықтан дәл беттеседі; жер мен төбелер
// терезе кең болса да толтыру үшін viewBox-тан тыс созылады. Түстер — B палитрасы, сызық қалыңдығы 2.
import Qyran from "./Qyran";

const INK = "#1f2430", RED = "#a3242b", RED_D = "#741820", TEAL = "#0b6e7e", TEAL_F = "#0e8fa3", GOLD = "#e8b23a";
const SAND = "#efd7a6", SAND_D = "#d6ae6c", BONE = "#f8eedb", WOOD = "#8a5a2b", WOOD_D = "#5e3b1a", SH = "#5a3a1c";
const S = { stroke: INK, strokeWidth: 2, strokeLinejoin: "round", strokeLinecap: "round" };

// Қала қамалының тістері (бір рет есептеледі)
const CRENEL = (() => {
  let d = "";
  for (let x = -216; x < 420; x += 13) d += `M${x} 112v-6h7v6`;
  return d;
})();

// Шағын қошқар мүйіз белгісі (cx, cy орталығы; ≈14 бірлік)
const Horn = ({ x, y, c = GOLD, w = 1.8 }) => (
  <path
    d={`M${x} ${y + 4}v-4m0 0c0-4-5-6-7-3.5-1.4 1.6 0 4 2 3.2M${x} ${y}c0-4 5-6 7-3.5 1.4 1.6 0 4-2 3.2`}
    fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"
  />
);

// Төрт сәулелі ұшқын
const Spark = ({ x, y, s = 1, d = 0, c = GOLD }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path className="qa-tw" style={{ animationDelay: `${d}s` }} d="M0-5 1.2-1.2 5 0 1.2 1.2 0 5-1.2 1.2-5 0-1.2-1.2Z" fill={c} />
  </g>
);

// Асық: белі қысыңқы сүйек (орталығы 0,0)
const Asyq = ({ x, y, r = 0, s = 1, fill = BONE }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M-12-6C-12-10-6-10-3-7-1-5 1-5 3-7 6-10 12-10 12-6V6C12 10 6 10 3 7 1 5-1 5-3 7-6 10-12 10-12 6Z" fill={fill} {...S} />
    <path d="M-6-1Q0 3 6-1M-8 4h3M5 4h3" fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round" opacity=".55" />
  </g>
);

/* ── Тарих: күн шуағындағы дала қаласының қақпасы ── */
function HistoryBack() {
  return (
    <>
      <circle className="qa-pulse" cx="152" cy="42" r="40" fill={GOLD} opacity=".2" />
      <circle cx="152" cy="42" r="23" fill={GOLD} opacity=".9" />
      <path d="M-220 118Q-150 94-80 110T40 104T160 108T280 100T420 110V160H-220Z" fill="#e6d2a2" opacity=".75" />
      <g {...S} strokeWidth="1.6">
        <rect x="19" y="62" width="10" height="50" fill={SAND_D} />
        <path d="M17 62h14l-3-7h-8Z" fill={TEAL_F} />
        <rect x="171" y="70" width="9" height="42" fill={SAND_D} />
        <path d="M169 70h13l-6.5-9Z" fill={TEAL_F} />
      </g>
      <path d={`${CRENEL}M-220 112H420V140H-220Z`} fill="#dcb47a" {...S} strokeWidth="1.6" />
      <path d="M-220 125H420" stroke={WOOD} strokeWidth="1.2" opacity=".3" />
      <rect x="-220" y="139" width="640" height="40" fill="#c99a52" />
      <path d="M-220 139H420" {...S} strokeWidth="1.6" />
      <path d="M86 140h28l40 24H46Z" fill="#e2bd7f" />
    </>
  );
}
function HistoryFront() {
  return (
    <>
      <g className="qa-float">
        <path d="M24 10q5-5 10 0q5-5 10 0M48 2q3.5-3.5 7 0q3.5-3.5 7 0" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <ellipse cx="100" cy="141" rx="56" ry="3.5" fill={SH} opacity=".2" />
      {/* күмбез — терезеден асып тұрады */}
      <path d="M100-8V2" stroke={GOLD} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="100" cy="-10" r="3" fill={GOLD} />
      <path d="M72 46C70 22 86 8 100 2c14 6 30 20 28 44Z" fill={TEAL_F} {...S} />
      <path d="M100 3v43M87 11q-6 17-4 35M113 11q6 17 4 35" fill="none" stroke={TEAL} strokeWidth="1.4" opacity=".75" />
      <path d="M84 20q8-8 14-10" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".5" />
      <rect x="76" y="44" width="48" height="8" fill={SAND} {...S} />
      {/* мұнаралар */}
      <g {...S}>
        <rect x="54" y="34" width="12" height="106" fill={SAND_D} />
        <path d="M52 34h16l-8-13Z" fill={TEAL_F} />
        <rect x="134" y="34" width="12" height="106" fill={SAND_D} />
        <path d="M132 34h16l-8-13Z" fill={TEAL_F} />
      </g>
      <path d="M56 60h8M56 84h8M56 108h8M136 60h8M136 84h8M136 108h8" stroke={WOOD} strokeWidth="1.4" opacity=".5" />
      {/* пештақ */}
      <rect x="62" y="40" width="76" height="100" fill={SAND} {...S} />
      <rect x="62" y="40" width="76" height="10" fill={TEAL} {...S} />
      <g fill={GOLD}>
        <circle cx="72" cy="45" r="1.6" /><circle cx="86" cy="45" r="1.6" /><circle cx="100" cy="45" r="1.6" /><circle cx="114" cy="45" r="1.6" /><circle cx="128" cy="45" r="1.6" />
      </g>
      <rect x="68" y="54" width="64" height="86" fill="none" stroke="#c9922c" strokeWidth="1.6" />
      <Horn x={100} y={60} />
      <path d="M82 140V98q0-22 18-32 18 10 18 32v42Z" fill="#6b4320" {...S} />
      <path d="M87 140v-40q0-17 13-25 13 8 13 25v40Z" fill={WOOD} opacity=".55" />
      <path d="M91 140h18l-5-24h-8Z" fill={GOLD} opacity=".55" />
    </>
  );
}

/* ── Ойындар: сырмақ үстінде ұшып бара жатқан асықтар ── */
function GamesBack() {
  return (
    <>
      <path d="M-220 116Q-140 98-60 110T80 104T220 110T420 102V160H-220Z" fill="#ead6ab" opacity=".85" />
      <g {...S} strokeWidth="1.6">
        <path d="M4 112q0-15 18-19 18 4 18 19Z" fill={BONE} />
        <rect x="4" y="112" width="36" height="12" fill="#f1dfbd" />
        <rect x="18" y="114" width="8" height="10" fill={RED} />
      </g>
      <path d="M8 104q14-5 28 0" fill="none" stroke={RED} strokeWidth="1.4" opacity=".7" />
      <rect x="-220" y="123" width="640" height="50" fill="#d9b77a" />
      <path d="M-220 123H420" {...S} strokeWidth="1.6" />
    </>
  );
}
function GamesFront() {
  return (
    <>
      {/* сырмақ */}
      <path d="M28 152l30-28h112l28 28Z" fill={RED} {...S} />
      <path d="M44 147l21-18h98l21 18Z" fill="#fbefd9" />
      <path d="M52 147l16-13h92l16 13" fill="none" stroke={RED} strokeWidth="1.2" strokeDasharray="3 4" opacity=".6" />
      <Horn x={114} y={136} c={RED} w={1.5} />
      {/* ұшу ізі */}
      <path d="M58 122Q70 50 122 22M150 132q20-44 10-82" fill="none" stroke={GOLD} strokeWidth="2.2" strokeDasharray="1 6" strokeLinecap="round" />
      <ellipse cx="88" cy="142" rx="13" ry="2.4" fill={SH} opacity=".2" />
      <ellipse cx="138" cy="144" rx="9" ry="2" fill={SH} opacity=".14" />
      <Asyq x={88} y={134} />
      <Asyq x={66} y={140} r={-14} s={0.85} />
      <g className="qa-float">
        <Asyq x={134} y={14} r={28} s={1.25} fill={RED} />
        <path d="M128 10q4-2 8 1" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity=".6" />
      </g>
      <g className="qa-float qa-d2">
        <Asyq x={162} y={50} r={-35} s={0.95} />
      </g>
      <Spark x={58} y={70} d={0} />
      <Spark x={178} y={24} s={0.8} d={1.1} />
    </>
  );
}

/* ── Aqyl-мен чат: тұғырдағы Aqyl (оқушы таңдаған кейіпкер) мен сөз бұлты ── */
function ChatBack() {
  return (
    <>
      <g fill="#fff" opacity=".85">
        <ellipse cx="22" cy="40" rx="14" ry="5" /><ellipse cx="32" cy="36" rx="9" ry="6" />
      </g>
      <path d="M-220 122-150 70-100 100-40 52 10 96 60 62 110 106 170 58 230 100 290 66 350 104 420 80V160H-220Z" fill="#a9bcb7" {...S} strokeWidth="1.6" />
      <g fill="#fff">
        <path d="M-50 60-40 52-30 60-35 58-40 62-45 58Z" />
        <path d="M51 69 60 62 69 69 64 67 60 71 56 67Z" />
        <path d="M160 66 170 58 180 66 175 64 170 68 165 64Z" />
        <path d="M281 73 290 66 299 73 294 71 290 75 286 71Z" />
      </g>
      <path d="M-220 124Q-140 110-60 120T100 116T260 122T420 116V160H-220Z" fill="#dcc79c" />
      <rect x="-220" y="136" width="640" height="40" fill="#c79a5c" />
      <path d="M-220 136H420" {...S} strokeWidth="1.6" />
    </>
  );
}
function ChatFront() {
  return (
    <>
      <ellipse cx="88" cy="140" rx="34" ry="3" fill={SH} opacity=".2" />
      {/* тұғыр */}
      <g {...S}>
        <rect x="85" y="132" width="6" height="8" fill={WOOD_D} />
        <rect x="56" y="128" width="66" height="6" rx="3" fill={WOOD} />
      </g>
      <g transform="translate(46 34)">
        <Qyran mood="talk" size={84} />
      </g>
      {/* сөз бұлты — терезеден асып шығады */}
      <g className="qa-float">
        <path d="M134-6h48a12 12 0 0 1 12 12v16a12 12 0 0 1-12 12h-34l-14 12 4-12h-4a12 12 0 0 1-12-12V6a12 12 0 0 1 12-12Z" fill="#fff" {...S} />
        <text x="158" y="20" textAnchor="middle" fontSize="15" fontWeight="700" fill={RED_D} style={{ fontFamily: "var(--head, inherit)" }} lang="kk">Сәлем!</text>
      </g>
      <rect x="150" y="48" width="38" height="18" rx="9" fill={TEAL} {...S} strokeWidth="1.6" />
      <g fill="#fff">
        <circle className="qa-tw" cx="160" cy="57" r="2.2" />
        <circle className="qa-tw" style={{ animationDelay: ".3s" }} cx="169" cy="57" r="2.2" />
        <circle className="qa-tw" style={{ animationDelay: ".6s" }} cx="178" cy="57" r="2.2" />
      </g>
    </>
  );
}

/* ── VR Әлем: киіз үйдің ашық есігі — ішінде тірі түнгі дала ── */
function VrBack() {
  return (
    <>
      <g fill="#fff">
        <circle className="qa-tw" cx="22" cy="30" r="1.6" />
        <circle className="qa-tw" style={{ animationDelay: ".8s" }} cx="44" cy="58" r="1.2" />
        <circle className="qa-tw" style={{ animationDelay: "1.4s" }} cx="170" cy="40" r="1.6" />
        <circle className="qa-tw" style={{ animationDelay: ".4s" }} cx="186" cy="72" r="1.2" />
        <circle cx="-30" cy="50" r="1.4" /><circle cx="230" cy="44" r="1.4" />
      </g>
      <path d="M-220 120Q-150 96-80 112T50 106T180 112T300 100T420 114V160H-220Z" fill="#cdc0e4" opacity=".85" />
      <rect x="-220" y="138" width="640" height="40" fill="#d8bd86" />
      <path d="M-220 138H420" {...S} strokeWidth="1.6" />
    </>
  );
}
function VrFront() {
  const NIGHT = "#2d2150";
  return (
    <>
      <path d="M74 140h52l26 20H48Z" fill={GOLD} opacity=".3" />
      {/* есік жақтауы */}
      <path d="M64 140V40q36-16 72 0v100Z" fill={RED} {...S} />
      <path d="M74 140V48q26-12 52 0v92Z" fill={NIGHT} />
      {/* есік ішіндегі түнгі дала */}
      <path d="M74 82q26-18 52-8v8q-26-10-52 8Z" fill={TEAL_F} opacity=".55" />
      <circle cx="112" cy="62" r="8" fill={GOLD} />
      <circle cx="116" cy="59" r="7" fill={NIGHT} />
      <g fill="#fff">
        <circle cx="84" cy="60" r="1.3" /><circle cx="96" cy="70" r="1" /><circle cx="120" cy="92" r="1.1" />
      </g>
      <path d="M74 122q14-12 28-5t24-4v27H74Z" fill="#43337a" />
      <path d="M82 124q0-9 10-11 10 2 10 11Z" fill={BONE} />
      <rect x="82" y="124" width="20" height="7" fill="#f1dfbd" />
      <rect x="90" y="125" width="4" height="6" fill={GOLD} />
      <path d="M74 140V48q26-12 52 0v92" fill="none" {...S} />
      {/* жақтау өрнегі */}
      <path d="M69 138V44q31-14 62 0v94" fill="none" stroke={GOLD} strokeWidth="1.4" opacity=".85" />
      <Horn x={100} y={33} w={1.6} />
      {/* ашық есік жапқышы */}
      <path d="M126 48l24 8v90l-24-6Z" fill={RED_D} {...S} />
      <path d="M138 92l5 8-5 8-5-8Z" fill={GOLD} />
      <path d="M131 62l14 4M131 130l14 4" stroke={GOLD} strokeWidth="1.4" opacity=".7" />
      <rect x="60" y="138" width="80" height="5" rx="2" fill={WOOD_D} {...S} strokeWidth="1.6" />
      {/* есіктен ұшып шыққан ұшқындар — терезеден асады */}
      <Spark x={100} y={12} d={0} />
      <Spark x={80} y={20} s={0.7} d={0.7} />
      <Spark x={124} y={2} s={0.85} d={1.3} c="#fff" />
    </>
  );
}

const ART = {
  history: [HistoryBack, HistoryFront],
  games: [GamesBack, GamesFront],
  chat: [ChatBack, ChatFront],
  vr: [VrBack, VrFront],
};

// layer: "back" | "front"
export default function QuickArt({ name, layer = "front" }) {
  const pair = ART[name] || ART.history;
  const C = layer === "back" ? pair[0] : pair[1];
  return (
    <svg className={`hm-qt-${layer}`} viewBox="0 0 200 160" preserveAspectRatio="xMidYMax meet" overflow="visible" aria-hidden="true" focusable="false">
      <C />
    </svg>
  );
}
