// Дүкен бұйымдарының суреттері (SVG): әр зат өз атына сай.
import { NatArt } from "./NatArt";
const GOLD = "#e8a400", RED = "#b8322a", TEAL = "#0a7f99", DARK = "#4a2c12", CREAM = "#fff3d4", FUR = "#a8743e";
const Orn = ({ x, y, s = 1, c = GOLD }) => <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 0 c4 -8 12 -6 10 1 c-2 6 -9 4 -7 -1 M0 0 c-4 -8 -12 -6 -10 1 c2 6 9 4 7 -1" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" />;

const ART = {
  borik: (
    <g>
      <path d="M30 118 C26 60 70 36 100 36 C130 36 174 60 170 118 C150 130 50 130 30 118Z" fill={FUR} stroke={DARK} strokeWidth="3" />
      <path d="M30 118 C60 134 140 134 170 118 L172 142 C140 160 60 160 28 142Z" fill="#7a4a22" stroke={DARK} strokeWidth="3" />
      <g stroke="#d8a86a" strokeWidth="2.4" strokeLinecap="round" opacity=".8">{[50, 66, 82, 100, 118, 134, 150].map((x, i) => <path key={x} d={`M${x} ${70 + (i % 2) * 8} l-4 18`} />)}</g>
      <path d="M100 36 C96 24 106 18 100 8" stroke={GOLD} strokeWidth="4" fill="none" strokeLinecap="round" /><circle cx="100" cy="8" r="5" fill={RED} />
      <Orn x={100} y={104} s={1.3} />
    </g>
  ),
  kimeshek: (
    <g>
      <path d="M100 20 C52 20 36 64 40 108 C42 140 30 170 24 186 H176 C170 170 158 140 160 108 C164 64 148 20 100 20Z" fill="#fffaf0" stroke={DARK} strokeWidth="3" />
      <path d="M100 20 C70 24 62 60 64 100 C66 130 60 160 56 186 H100Z" fill="#f1e6cc" opacity=".7" />
      <ellipse cx="100" cy="92" rx="34" ry="42" fill="#f3c9a0" stroke={DARK} strokeWidth="2.6" />
      <path d="M62 86 C70 44 130 44 138 86 C124 66 76 66 62 86Z" fill="#fffaf0" stroke={DARK} strokeWidth="2.4" />
      <path d="M40 150 H160" stroke={RED} strokeWidth="6" /><path d="M36 164 H164" stroke={GOLD} strokeWidth="4" strokeDasharray="2 8" strokeLinecap="round" />
      <Orn x={100} y={60} s={1.1} c={RED} />
    </g>
  ),
  kamzol: (
    <g>
      <path d="M58 30 L84 22 L100 40 L116 22 L142 30 L152 70 L142 78 L146 168 H54 L58 78 L48 70Z" fill={TEAL} stroke={DARK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M100 40 V168" stroke={DARK} strokeWidth="2.6" /><path d="M54 150 H146" stroke={GOLD} strokeWidth="6" />
      <path d="M62 36 L84 28 L100 44 L116 28 L138 36" fill="none" stroke={GOLD} strokeWidth="4" />
      <Orn x={76} y={96} /><Orn x={124} y={96} /><Orn x={76} y={124} /><Orn x={124} y={124} />
      {[60, 80, 112, 132].map((y) => <circle key={y} cx="100" cy={y + 16} r="3" fill={GOLD} />)}
    </g>
  ),
  shapan: (
    <g>
      <path d="M62 24 L100 36 L138 24 L176 62 L164 128 L146 120 L148 184 H52 L54 120 L36 128 L24 62Z" fill="#2f7d4f" stroke={DARK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M100 36 L84 184 M100 36 L116 184" stroke="#1d5a38" strokeWidth="2.6" fill="none" />
      <path d="M62 24 L100 36 L138 24" fill="none" stroke={GOLD} strokeWidth="5" strokeLinecap="round" />
      <path d="M52 150 H148" stroke={GOLD} strokeWidth="6" /><path d="M24 62 L36 128 M176 62 L164 128" stroke={GOLD} strokeWidth="5" />
      <Orn x={72} y={88} /><Orn x={128} y={88} /><Orn x={100} y={120} s={1.3} />
    </g>
  ),
  koilek: (
    <g>
      <path d="M72 24 L100 38 L128 24 L146 54 L128 84 L170 184 H30 L72 84 L54 54Z" fill={RED} stroke={DARK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M72 24 L100 38 L128 24" fill="none" stroke={GOLD} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M72 84 H128" stroke={GOLD} strokeWidth="5" />
      <path d="M36 164 H164" stroke={GOLD} strokeWidth="5" /><path d="M32 176 H168" stroke={TEAL} strokeWidth="5" />
      <g>{[60, 84, 108, 132].map((x, i) => <Orn key={x} x={x + 4} y={134 + (i % 2) * 4} s={.9} />)}</g>
    </g>
  ),
  etik: (
    <g>
      <path d="M66 20 H116 L122 120 C150 124 176 134 176 160 V176 H50 C46 150 58 130 62 120Z" fill="#8a4a24" stroke={DARK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M66 20 H116" stroke={GOLD} strokeWidth="6" /><path d="M50 160 H176" stroke={GOLD} strokeWidth="4" />
      <path d="M50 176 H176 V188 H50Z" fill="#3b1d0c" stroke={DARK} strokeWidth="3" />
      <path d="M142 130 C158 134 170 142 174 156" fill="none" stroke="#c98a52" strokeWidth="3" />
      <Orn x={90} y={70} s={1.2} /><Orn x={90} y={104} s={1} c={RED} />
    </g>
  ),
  beldik: (
    <g>
      <path d="M14 78 H186 V122 H14Z" fill="#7a2a22" stroke={DARK} strokeWidth="3" />
      <path d="M14 88 H186 M14 112 H186" stroke={GOLD} strokeWidth="3" />
      <g>{[34, 62, 138, 166].map((x) => <Orn key={x} x={x} y={106} s={.9} />)}</g>
      <rect x="76" y="68" width="48" height="64" rx="12" fill="url(#ia-gold)" stroke={DARK} strokeWidth="3" />
      <circle cx="100" cy="100" r="14" fill={RED} stroke={DARK} strokeWidth="2.4" /><circle cx="100" cy="100" r="5" fill={CREAM} />
    </g>
  ),
  algha: (
    <g>
      <path d="M34 36 C34 130 166 130 166 36" fill="none" stroke={GOLD} strokeWidth="5" strokeLinecap="round" />
      {Array.from({ length: 11 }).map((_, i) => { const t = i / 10; const x = 34 + t * 132; const y = 36 + Math.sin(t * Math.PI) * 86; return <circle key={i} cx={x} cy={y} r={i % 3 === 1 ? 9 : 7} fill={i % 3 === 1 ? TEAL : i % 3 === 2 ? RED : "#f7efe0"} stroke={DARK} strokeWidth="2" />; })}
      <path d="M100 122 L84 150 L100 178 L116 150Z" fill="url(#ia-gold)" stroke={DARK} strokeWidth="3" /><circle cx="100" cy="150" r="7" fill={TEAL} stroke={DARK} strokeWidth="2" />
    </g>
  ),
  zhuzik: (
    <g>
      <ellipse cx="100" cy="118" rx="52" ry="54" fill="none" stroke="url(#ia-silver)" strokeWidth="16" />
      <ellipse cx="100" cy="118" rx="52" ry="54" fill="none" stroke={DARK} strokeWidth="2" opacity=".4" />
      <path d="M72 44 H128 L140 70 H60Z" fill="url(#ia-silver)" stroke={DARK} strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="100" cy="58" rx="22" ry="14" fill={RED} stroke={DARK} strokeWidth="3" /><ellipse cx="94" cy="54" rx="7" ry="4" fill="#fff" opacity=".55" />
      <g fill="#e6edf2" stroke={DARK} strokeWidth="1.6">{[66, 134].map((x) => <circle key={x} cx={x} cy="56" r="4" />)}</g>
    </g>
  ),
};

export default function ItemArt({ id, size = 96, className = "" }) {
  const nat = id === "takiya" ? "taqiya" : id === "saukele" ? "saukele" : id === "dombyra" ? "dombyra" : null;
  if (nat) return <NatArt name={nat} size={size} className={className} />;
  return (
    <svg className={`nat-art item-art ${className}`} viewBox="0 0 200 200" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="ia-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff0a8" /><stop offset=".55" stopColor="#ffd35a" /><stop offset="1" stopColor="#c47e00" /></linearGradient>
        <linearGradient id="ia-silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset=".5" stopColor="#cfd8de" /><stop offset="1" stopColor="#8e9aa3" /></linearGradient>
      </defs>
      {ART[id] || null}
    </svg>
  );
}
