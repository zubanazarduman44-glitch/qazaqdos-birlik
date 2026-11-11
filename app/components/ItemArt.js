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
  tumak: (
    <g>
      <path d="M34 112 C30 52 70 30 100 30 C130 30 170 52 166 112 L170 150 C160 168 144 164 138 146 L132 112 C116 118 84 118 68 112 L62 146 C56 164 40 168 30 150Z" fill="#8a6a4a" stroke={DARK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M62 100 C84 110 116 110 138 100 L140 118 C118 126 82 126 60 118Z" fill="#6a4a2c" stroke={DARK} strokeWidth="2.4" />
      <g stroke="#d9bd94" strokeWidth="2.4" strokeLinecap="round" opacity=".85">{[50, 66, 84, 102, 120, 138, 152].map((x, i) => <path key={x} d={`M${x} ${60 + (i % 2) * 10} l${i % 2 ? 4 : -4} 16`} />)}</g>
      <circle cx="100" cy="36" r="6" fill={RED} stroke={DARK} strokeWidth="2" />
      <Orn x={100} y={92} s={1.1} />
    </g>
  ),
  kalpak: (
    <g>
      <path d="M52 140 C46 90 66 34 100 16 C134 34 154 90 148 140 C128 150 72 150 52 140Z" fill="#fffaf0" stroke={DARK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M100 16 C84 50 76 100 78 146 M100 16 C116 50 124 100 122 146" fill="none" stroke="#d9cdb4" strokeWidth="2" />
      <path d="M50 120 C70 134 130 134 150 120 L152 150 C130 166 70 166 48 150Z" fill="#1e1814" stroke={DARK} strokeWidth="2.6" />
      <Orn x={100} y={142} s={1.1} c="#ffd35a" />
    </g>
  ),
  oramal: (
    <g>
      <path d="M100 22 C60 22 34 60 40 112 C44 150 62 172 100 178 C138 172 156 150 160 112 C166 60 140 22 100 22Z" fill="#c23a4b" stroke={DARK} strokeWidth="3" />
      <ellipse cx="100" cy="102" rx="36" ry="44" fill="#f3c9a0" stroke={DARK} strokeWidth="2.4" />
      <path d="M62 92 C66 42 134 42 138 92 C122 70 78 70 62 92Z" fill="#c23a4b" stroke={DARK} strokeWidth="2.4" />
      <path d="M44 156 C70 176 130 176 156 156" fill="none" stroke={GOLD} strokeWidth="5" strokeLinecap="round" strokeDasharray="1 9" />
      <g fill="#ffd35a">{[[56, 90], [48, 118], [150, 90], [152, 118], [70, 50], [130, 50], [100, 34]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.6" />)}</g>
      <path d="M142 150 C160 150 168 170 160 188 C150 178 144 168 142 150Z" fill="#a82a3c" stroke={DARK} strokeWidth="2" />
    </g>
  ),
  beshpent: (
    <g>
      <path d="M62 26 L86 20 L100 38 L114 20 L138 26 L168 70 L156 168 C128 180 72 180 44 168 L32 70Z" fill="#26407a" stroke={DARK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M100 38 V178" stroke={DARK} strokeWidth="2.4" />
      <path d="M62 26 L86 20 L100 38 L114 20 L138 26" fill="none" stroke={GOLD} strokeWidth="4.4" />
      <g fill="#ffd35a" stroke={DARK} strokeWidth="1.4">{[58, 80, 102, 124, 146].map((y) => <circle key={y} cx="92" cy={y} r="4.4" />)}</g>
      <path d="M40 160 C72 174 128 174 160 160" fill="none" stroke={GOLD} strokeWidth="3.6" />
      <Orn x={134} y={110} s={1.1} /><Orn x={66} y={110} s={1.1} />
    </g>
  ),
  ishik: (
    <g>
      <path d="M58 28 L86 22 L100 42 L114 22 L142 28 L172 74 L162 176 C130 188 70 188 38 176 L28 74Z" fill="#7a4a22" stroke={DARK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M58 28 C72 50 128 50 142 28 L130 70 C116 84 84 84 70 70Z" fill="#fffaf0" stroke={DARK} strokeWidth="2.4" />
      <g stroke="#a8743e" strokeWidth="2.4" strokeLinecap="round" opacity=".8">{[50, 70, 90, 110, 130, 150].map((x, i) => <path key={x} d={`M${x} ${110 + (i % 2) * 14} l-3 20 M${x + 8} ${150 - (i % 2) * 10} l-3 18`} />)}</g>
      <path d="M34 170 C70 192 130 192 166 170 L162 184 C130 200 70 200 38 184Z" fill="#fffaf0" stroke={DARK} strokeWidth="2.4" />
      <path d="M100 84 V176" stroke={DARK} strokeWidth="2.4" /><circle cx="100" cy="100" r="4.4" fill={GOLD} stroke={DARK} strokeWidth="1.2" /><circle cx="100" cy="126" r="4.4" fill={GOLD} stroke={DARK} strokeWidth="1.2" />
    </g>
  ),
  masy: (
    <g>
      {[0, 1].map((k) => (
        <g key={k} transform={`translate(${k * 70} 0)`}>
          <path d="M26 54 H66 V122 C86 124 92 148 76 154 H30 C14 154 12 128 26 122Z" fill="#d4ad72" stroke={DARK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M26 66 H66" stroke={GOLD} strokeWidth="4" /><Orn x={46} y={96} s={0.9} c="#7a3a12" />
          <path d="M16 154 H84" stroke={DARK} strokeWidth="5" strokeLinecap="round" />
        </g>
      ))}
    </g>
  ),
  kebis: (
    <g>
      {[0, 1].map((k) => (
        <g key={k} transform={`translate(${k * 70} 0)`}>
          <path d="M22 96 H70 C72 120 94 124 94 144 C94 154 88 158 78 158 H26 C14 158 12 140 22 134Z" fill="#241c18" stroke={DARK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M26 108 H66" stroke="#e8a400" strokeWidth="3.4" /><path d="M20 160 H88" stroke="#b8322a" strokeWidth="5" strokeLinecap="round" />
          <path d="M34 118 C38 112 52 112 56 118" fill="none" stroke="#4a3d36" strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}
    </g>
  ),
  sirga: (
    <g>
      {[62, 138].map((x) => (
        <g key={x}>
          <circle cx={x} cy="46" r="7" fill="none" stroke={GOLD} strokeWidth="4" />
          <path d={`M${x} 56 L${x - 14} 96 L${x} 150 L${x + 14} 96Z`} fill={GOLD} stroke={DARK} strokeWidth="3" strokeLinejoin="round" />
          <circle cx={x} cy="96" r="9" fill={TEAL} stroke={DARK} strokeWidth="2.4" /><circle cx={x - 3} cy="93" r="2.6" fill="#bff1fb" />
          <circle cx={x} cy="150" r="5.4" fill="#e0574a" stroke={DARK} strokeWidth="2" />
        </g>
      ))}
    </g>
  ),
  bilezik: (
    <g>
      <ellipse cx="100" cy="108" rx="64" ry="30" fill="none" stroke={DARK} strokeWidth="16" />
      <ellipse cx="100" cy="108" rx="64" ry="30" fill="none" stroke="url(#ia-gold)" strokeWidth="11" />
      <g fill={TEAL} stroke={DARK} strokeWidth="2">{[56, 100, 144].map((x, i) => <circle key={x} cx={x} cy={i === 1 ? 140 : 128 - (i === 0 ? 4 : 4)} r={i === 1 ? 9 : 6} fill={i === 1 ? "#e0574a" : TEAL} />)}</g>
      <Orn x={100} y={82} s={1} c="#7a3a12" />
    </g>
  ),
};

export default function ItemArt({ id, size = 96, className = "" }) {
  const nat = { takiya: "taqiya", saukele: "saukele", dombyra: "dombyra", kamshy: "kamshy", kobyz: "kobyz" }[id] || null;
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
