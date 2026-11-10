// Қазақтың ұлттық аспаптары мен бұйымдары: бос жерлерді безендіру үшін SVG суреттер.
import { PROVERBS } from "../../lib/culture";
import { L } from "../../lib/i18n";

const GOLD = "#e8a400", RED = "#b8322a", TEAL = "#0a7f99", WOOD = "#8a5326", DARK = "#4a2c12", CREAM = "#fff3d4";

function Dombyra() {
  return (
    <g>
      <path d="M100 150 C60 150 50 112 78 96 C60 82 78 62 100 70 C122 62 140 82 122 96 C150 112 140 150 100 150Z" fill={WOOD} stroke={DARK} strokeWidth="3" />
      <circle cx="100" cy="106" r="14" fill={DARK} /><circle cx="100" cy="106" r="14" fill="none" stroke={GOLD} strokeWidth="2.4" />
      <path d="M88 130 q12 10 24 0" stroke={GOLD} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <rect x="95" y="6" width="10" height="68" rx="4" fill={DARK} />
      <path d="M92 6 h16 l4 14 h-24z" fill={WOOD} stroke={DARK} strokeWidth="2" />
      <circle cx="90" cy="14" r="3.4" fill={GOLD} /><circle cx="110" cy="14" r="3.4" fill={GOLD} />
      <path d="M97 14 V132 M103 14 V132" stroke={CREAM} strokeWidth="1.4" />
      <path d="M92 150 h16" stroke={GOLD} strokeWidth="3" />
      <g fill="none" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round"><path d="M70 126 c4 -6 10 -4 8 2 M130 126 c-4 -6 -10 -4 -8 2" /></g>
    </g>
  );
}
function Kobyz() {
  return (
    <g>
      <path d="M100 160 C58 162 50 116 100 92 C150 116 142 162 100 160Z" fill={WOOD} stroke={DARK} strokeWidth="3" />
      <path d="M100 160 C70 160 66 122 100 100 C134 122 130 160 100 160Z" fill="#a8672e" />
      <rect x="96" y="14" width="8" height="82" rx="4" fill={DARK} />
      <path d="M96 14 C88 8 90 -2 100 2 C110 -2 112 8 104 14" fill="none" stroke={DARK} strokeWidth="4" />
      <circle cx="90" cy="22" r="3.2" fill={GOLD} /><circle cx="110" cy="30" r="3.2" fill={GOLD} />
      <path d="M99 18 L96 150 M101 18 L104 150" stroke={CREAM} strokeWidth="1.2" />
      <path d="M150 40 C120 96 110 130 70 160" stroke="#6b4220" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d="M150 40 C124 92 112 128 74 158" stroke="#e6c88a" strokeWidth="1" fill="none" />
      <g fill={RED}><circle cx="100" cy="132" r="3" /><circle cx="86" cy="140" r="2.4" /><circle cx="114" cy="140" r="2.4" /></g>
    </g>
  );
}
function Yurt() {
  return (
    <g>
      <path d="M26 150 C26 100 56 78 100 78 C144 78 174 100 174 150Z" fill={CREAM} stroke={DARK} strokeWidth="3" />
      <path d="M100 38 C70 44 40 66 28 100 C50 82 76 76 100 76 C124 76 150 82 172 100 C160 66 130 44 100 38Z" fill="#fff9ea" stroke={DARK} strokeWidth="3" />
      <circle cx="100" cy="36" r="9" fill="none" stroke={GOLD} strokeWidth="3" />
      <path d="M100 27 v-10 M100 45 v6 M91 36 h-6 M109 36 h6" stroke={GOLD} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M26 118 H174" stroke={TEAL} strokeWidth="14" />
      <g fill="none" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round">{[40, 62, 84, 106, 128, 150].map((x) => <path key={x} d={`M${x} 118 c5 -6 11 -2 8 3 c-3 4 -9 1 -6 -3`} />)}</g>
      <path d="M26 112 H174 M26 124 H174" stroke={RED} strokeWidth="2" />
      <path d="M82 150 V120 Q100 106 118 120 V150Z" fill={RED} stroke={DARK} strokeWidth="2.4" />
      <path d="M100 112 V150 M82 134 H118" stroke={GOLD} strokeWidth="2" />
      <path d="M14 152 H186" stroke="#5a8a3a" strokeWidth="6" strokeLinecap="round" />
    </g>
  );
}
function Taqiya() {
  return (
    <g>
      <path d="M36 118 C36 62 164 62 164 118 C164 132 36 132 36 118Z" fill={RED} stroke={DARK} strokeWidth="3" />
      <path d="M36 112 C70 124 130 124 164 112 L164 126 C130 138 70 138 36 126Z" fill={TEAL} stroke={DARK} strokeWidth="2.4" />
      <g fill="none" stroke={GOLD} strokeWidth="2.6" strokeLinecap="round"><path d="M70 98 c4 -10 14 -8 12 0 c-2 6 -10 4 -8 -2" /><path d="M130 98 c-4 -10 -14 -8 -12 0 c2 6 10 4 8 -2" /><path d="M100 76 l8 10 -8 10 -8 -10z" /></g>
      <g fill={GOLD}><circle cx="52" cy="126" r="2.4" /><circle cx="76" cy="130" r="2.4" /><circle cx="100" cy="132" r="2.4" /><circle cx="124" cy="130" r="2.4" /><circle cx="148" cy="126" r="2.4" /></g>
      <path d="M100 60 C96 46 104 40 100 30 M100 60 C106 48 98 40 104 30" stroke="#e6e6e6" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}
function Bowl() {
  return (
    <g>
      <path d="M34 90 H166 C166 140 138 160 100 160 C62 160 34 140 34 90Z" fill={CREAM} stroke={DARK} strokeWidth="3" />
      <ellipse cx="100" cy="90" rx="66" ry="12" fill="#fff" stroke={DARK} strokeWidth="3" />
      <ellipse cx="100" cy="92" rx="58" ry="8" fill="#f1e3c0" />
      <path d="M44 112 H156" stroke={TEAL} strokeWidth="9" />
      <g fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round">{[54, 74, 94, 114, 134].map((x) => <path key={x} d={`M${x} 112 c4 -5 9 -2 7 2 c-3 3 -7 1 -5 -2`} />)}</g>
      <path d="M74 160 h52 l6 10 h-64z" fill={WOOD} stroke={DARK} strokeWidth="2.4" />
      <path d="M80 70 C76 56 88 52 84 40 M104 70 C100 56 112 52 108 40 M126 70 C124 60 132 56 130 48" stroke="#d9c9a4" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".8" />
    </g>
  );
}
function Saukele() {
  return (
    <g>
      <path d="M100 14 L128 120 H72Z" fill={RED} stroke={DARK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M100 14 L112 66 H88Z" fill="#c94a3f" />
      <circle cx="100" cy="12" r="6" fill={GOLD} stroke={DARK} strokeWidth="2" />
      <g fill="none" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round"><path d="M92 82 c4 -6 10 -2 8 3 M108 82 c-4 -6 -10 -2 -8 3 M86 104 h28" /></g>
      <path d="M64 120 H136 C140 132 134 140 100 140 C66 140 60 132 64 120Z" fill={TEAL} stroke={DARK} strokeWidth="2.6" />
      <g fill={GOLD}>{[72, 86, 100, 114, 128].map((x) => <circle key={x} cx={x} cy="130" r="3" />)}</g>
      {[70, 82, 118, 130].map((x, i) => (<g key={x}><path d={`M${x} 140 V${170 + (i % 2) * 6}`} stroke={GOLD} strokeWidth="2" /><circle cx={x} cy={172 + (i % 2) * 6} r="3.4" fill={RED} stroke={GOLD} strokeWidth="1.4" /></g>))}
    </g>
  );
}
function Kamshy() {
  return (
    <g>
      <rect x="86" y="22" width="14" height="86" rx="6" fill={WOOD} stroke={DARK} strokeWidth="3" transform="rotate(14 93 65)" />
      <g stroke={GOLD} strokeWidth="2.4" fill="none" transform="rotate(14 93 65)"><path d="M86 40 h14 M86 56 h14 M86 72 h14 M86 88 h14" /></g>
      <path d="M96 110 C60 120 50 150 74 164 C98 176 134 160 128 134" fill="none" stroke="#3a2410" strokeWidth="5" strokeLinecap="round" />
      <path d="M128 134 l8 20 M128 134 l-2 22 M128 134 l16 14" stroke={RED} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

const ART = { dombyra: Dombyra, kobyz: Kobyz, yurt: Yurt, taqiya: Taqiya, bowl: Bowl, saukele: Saukele, kamshy: Kamshy };
export const NAT_KEYS = Object.keys(ART);

export function NatArt({ name = "dombyra", size = 120, className = "" }) {
  const C = ART[name] || Dombyra;
  return (
    <svg className={`nat-art ${className}`} viewBox="0 0 200 180" width={size} height={(size * 180) / 200} aria-hidden="true">
      <ellipse cx="100" cy="172" rx="62" ry="5" fill="#6b4220" opacity=".14" />
      <C />
    </svg>
  );
}

// Бос орынға: сурет + қысқа мәтін (мақал не өз мәтіні)
export function NatEmpty({ art = "dombyra", text, lang = "kk", size = 120, proverb = false, children }) {
  const day = Math.floor(Date.now() / 86400000);
  const p = PROVERBS[(day + art.length) % PROVERBS.length];
  return (
    <div className="nat-empty">
      <NatArt name={art} size={size} />
      {text && <p>{text}</p>}
      {proverb && <small className="muted">«{L(p, lang)}»</small>}
      {children}
    </div>
  );
}
