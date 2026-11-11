// Аватарлар: қазақи кейіпкерлердің SVG портреттері. "av:<id>" форматында сақталады; ескі эмодзилер де көрсетіледі.
const GOLD = "#e8a400", RED = "#b8322a", TEAL = "#0a7f99", DARK = "#4a2c12", SKIN = "#f1c39a", SKIN2 = "#e6ad80";

export const AVATAR_IDS = ["batyr", "zhigit", "aqsaqal", "han", "berkut", "dombyra", "bala", "qyz-saukele", "qyz-ormek", "apa", "bike", "shopan"];
export const AV_LIST = AVATAR_IDS.map((i) => `av:${i}`);

const Face = ({ skin = SKIN, cheek = true, brow = DARK, mouth = "smile", lash = false }) => (
  <g>
    <ellipse cx="50" cy="48" rx="20" ry="23" fill={skin} stroke={DARK} strokeWidth="1.6" />
    <ellipse cx="30.5" cy="50" rx="3.2" ry="5" fill={skin} stroke={DARK} strokeWidth="1.2" /><ellipse cx="69.5" cy="50" rx="3.2" ry="5" fill={skin} stroke={DARK} strokeWidth="1.2" />
    <path d="M38 40 q4 -3 8 0 M54 40 q4 -3 8 0" stroke={brow} strokeWidth="2" fill="none" strokeLinecap="round" />
    <ellipse cx="42" cy="46" rx="2.2" ry="2.6" fill="#2a1708" /><ellipse cx="58" cy="46" rx="2.2" ry="2.6" fill="#2a1708" />
    <circle cx="42.8" cy="45.2" r=".8" fill="#fff" /><circle cx="58.8" cy="45.2" r=".8" fill="#fff" />
    {lash && <path d="M39.5 44 l-2 -1.5 M60.5 44 l2 -1.5" stroke="#2a1708" strokeWidth="1.2" strokeLinecap="round" />}
    {cheek && <><circle cx="36" cy="55" r="3.6" fill="#ee8a7a" opacity=".45" /><circle cx="64" cy="55" r="3.6" fill="#ee8a7a" opacity=".45" /></>}
    <path d="M50 49 v5 q-2 1 -3 0" stroke={DARK} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity=".6" />
    {mouth === "smile" ? <path d="M43 59 q7 6 14 0" stroke="#7a2a22" strokeWidth="2" fill="none" strokeLinecap="round" /> : <path d="M44 60 q6 3 12 0" stroke="#7a2a22" strokeWidth="2" fill="none" strokeLinecap="round" />}
  </g>
);
const Body = ({ c = RED, trim = GOLD, neck = SKIN }) => (
  <g>
    <path d="M12 100 C12 80 28 72 50 72 C72 72 88 80 88 100Z" fill={c} stroke={DARK} strokeWidth="1.8" />
    <path d="M42 70 h16 v8 q-8 6 -16 0z" fill={neck} stroke={DARK} strokeWidth="1.4" />
    <path d="M38 74 q12 14 24 0" stroke={trim} strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M18 92 h64" stroke={trim} strokeWidth="2.4" strokeDasharray="1 5" strokeLinecap="round" />
  </g>
);
const Orn = ({ x, y, s = 1, c = GOLD }) => <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 0 c3 -6 9 -4 7 1 c-2 4 -7 3 -5 -1 M0 0 c-3 -6 -9 -4 -7 1 c2 4 7 3 5 -1" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" />;
const Taqiya = ({ c = RED }) => (
  <g>
    <path d="M30 34 C30 10 70 10 70 34 C70 38 30 38 30 34Z" fill={c} stroke={DARK} strokeWidth="1.8" />
    <path d="M30 32 q20 6 40 0 v6 q-20 6 -40 0z" fill={TEAL} stroke={DARK} strokeWidth="1.4" />
    <Orn x={50} y={22} s={.9} />
  </g>
);

const BG = { batyr: ["#ffe3b0", "#f2a65a"], zhigit: ["#cdeef6", "#52b8d0"], aqsaqal: ["#f0ead8", "#b9a77c"], han: ["#ffe9a8", "#e8a400"], berkut: ["#d9e8f5", "#7aa3c9"], dombyra: ["#ffd9d0", "#e2776a"], bala: ["#e3f3c8", "#8fc23f"], "qyz-saukele": ["#ffd6e3", "#e57a9d"], "qyz-ormek": ["#e8dcff", "#9d82e0"], apa: ["#ffe9d6", "#d99a62"], bike: ["#d3f5ea", "#4fc4a3"], shopan: ["#e6f0d2", "#9bb45a"] };

const ART = {
  batyr: (
    <>
      <Body c="#8a2a22" trim={GOLD} />
      <path d="M12 100 C16 82 30 74 40 78 L36 100Z M88 100 C84 82 70 74 60 78 L64 100Z" fill="#b8322a" opacity=".5" />
      <Face mouth="flat" />
      <path d="M40 58 q10 -4 20 0 q-4 5 -10 5 q-6 0 -10 -5z" fill="#2a1708" />
      <path d="M28 40 C26 6 74 6 72 40 L66 40 C66 24 34 24 34 40Z" fill="#c9d3da" stroke={DARK} strokeWidth="1.8" />
      <path d="M50 8 V-2 M50 8 C44 0 50 -6 56 -2" stroke={RED} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M28 36 h44" stroke={GOLD} strokeWidth="3.4" /><circle cx="50" cy="30" r="3" fill={RED} stroke={DARK} strokeWidth="1" />
    </>
  ),
  zhigit: (
    <>
      <Body c={TEAL} />
      <Face />
      <path d="M32 30 C32 22 40 24 50 28 C60 24 68 22 68 30 C62 28 56 30 50 34 C44 30 38 28 32 30Z" fill="#2a1708" />
      <Taqiya />
    </>
  ),
  aqsaqal: (
    <>
      <Body c="#35623f" trim="#e6d29a" />
      <path d="M32 54 C30 76 42 84 50 84 C58 84 70 76 68 54 C62 62 56 62 50 62 C44 62 38 62 32 54Z" fill="#f4f1ea" stroke={DARK} strokeWidth="1.6" />
      <Face skin={SKIN2} cheek={false} brow="#e9e4d8" mouth="flat" />
      <path d="M40 58 q10 -5 20 0 q-4 4 -10 4 q-6 0 -10 -4z" fill="#f4f1ea" stroke={DARK} strokeWidth="1" />
      <path d="M26 36 C24 6 76 6 74 36 C66 30 34 30 26 36Z" fill="#7a4a22" stroke={DARK} strokeWidth="1.8" />
      <path d="M26 36 C34 42 66 42 74 36 L74 42 C64 48 36 48 26 42Z" fill="#4a2c12" stroke={DARK} strokeWidth="1.4" />
      <g stroke="#d8a86a" strokeWidth="1.4" strokeLinecap="round">{[36, 44, 52, 60, 66].map((x) => <path key={x} d={`M${x} 20 l-1 10`} />)}</g>
      <path d="M42 24 q-1 -4 -2 -8 M58 24 q1 -4 2 -8" stroke="#e9e4d8" strokeWidth="1.4" opacity="0" />
    </>
  ),
  han: (
    <>
      <Body c="#6a1f4f" trim="#ffd35a" />
      <path d="M12 100 C14 84 26 76 36 76 M88 100 C86 84 74 76 64 76" stroke="#ffd35a" strokeWidth="3" fill="none" />
      <path d="M34 60 q16 8 32 0 q-4 12 -16 12 q-12 0 -16 -12z" fill="#2a1708" />
      <Face mouth="flat" />
      <path d="M40 58 q10 -5 20 0 q-4 4 -10 4 q-6 0 -10 -4z" fill="#2a1708" />
      <path d="M26 34 C24 8 76 8 74 34 L68 34 C66 22 34 22 32 34Z" fill="#b8322a" stroke={DARK} strokeWidth="1.8" />
      <path d="M26 34 h48 v6 h-48z" fill="url(#avg)" stroke={DARK} strokeWidth="1.4" />
      <path d="M50 10 l-6 -10 5 4 1 -8 1 8 5 -4z" fill="#ffd35a" stroke={DARK} strokeWidth="1" />
      <circle cx="50" cy="37" r="2.6" fill={RED} stroke={DARK} strokeWidth=".8" />
    </>
  ),
  berkut: (
    <>
      <Body c="#6b4a2a" trim="#e6c98a" />
      <path d="M62 66 q8 -12 18 -10 l4 -8 4 10 q4 8 -2 16 q-14 6 -26 2z" fill="#7a4a22" stroke={DARK} strokeWidth="1.6" />
      <path d="M80 48 l7 4 -6 3z" fill="#f0b323" stroke={DARK} strokeWidth="1.2" /><circle cx="82" cy="50" r="1.4" fill="#2a1708" />
      <path d="M66 72 q10 4 18 -2" stroke="#4a2c12" strokeWidth="2" fill="none" />
      <Face mouth="flat" />
      <path d="M40 58 q10 -4 20 0 q-3 4 -10 4 q-7 0 -10 -4z" fill="#2a1708" />
      <path d="M24 38 C22 6 78 6 76 38 L72 44 C60 36 40 36 28 44Z" fill="#8a5a30" stroke={DARK} strokeWidth="1.8" />
      <path d="M26 40 C40 46 60 46 74 40 L76 48 C60 54 40 54 24 48Z" fill="#5a3a1c" stroke={DARK} strokeWidth="1.4" />
    </>
  ),
  dombyra: (
    <>
      <Body c="#8a2a50" />
      <Face />
      <path d="M32 30 C32 22 40 24 50 28 C60 24 68 22 68 30 C62 28 56 30 50 34 C44 30 38 28 32 30Z" fill="#2a1708" />
      <Taqiya c="#e8a400" />
      <g transform="rotate(-24 70 84)">
        <path d="M70 100 C56 100 54 86 62 80 C56 74 64 66 70 70 C76 66 84 74 78 80 C86 86 84 100 70 100Z" fill="#a8672e" stroke={DARK} strokeWidth="1.6" />
        <circle cx="70" cy="82" r="4" fill={DARK} /><rect x="68" y="42" width="4" height="30" rx="2" fill={DARK} /><path d="M69 44 V88 M71 44 V88" stroke="#fff3d4" strokeWidth=".7" />
      </g>
    </>
  ),
  bala: (
    <>
      <Body c="#e8a400" trim="#fff3d4" />
      <ellipse cx="50" cy="50" rx="21" ry="23" fill={SKIN} stroke={DARK} strokeWidth="1.6" />
      <Face />
      <path d="M34 28 C38 22 62 22 66 28 C60 26 54 30 50 33 C46 30 40 26 34 28Z" fill="#2a1708" />
      <path d="M30 30 C30 12 70 12 70 30 C70 33 30 33 30 30Z" fill={TEAL} stroke={DARK} strokeWidth="1.8" />
      <Orn x={50} y={22} s={.8} c="#fff3d4" /><circle cx="50" cy="12" r="2.4" fill={GOLD} />
    </>
  ),
  "qyz-saukele": (
    <>
      <Body c="#b8322a" trim="#fff3d4" neck={SKIN} />
      <path d="M26 50 C22 70 26 84 30 90 M74 50 C78 70 74 84 70 90" stroke="#2a1708" strokeWidth="6" fill="none" strokeLinecap="round" />
      <Face lash />
      <path d="M31 40 C32 24 68 24 69 40 C60 32 40 32 31 40Z" fill="#2a1708" />
      <path d="M50 -4 L66 36 H34Z" fill="#b8322a" stroke={DARK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M50 -4 L56 14 H44Z" fill="#d85a4a" /><circle cx="50" cy="-4" r="3" fill={GOLD} stroke={DARK} strokeWidth="1" />
      <path d="M32 36 H68 q2 6 -4 6 H36 q-6 0 -4 -6z" fill={TEAL} stroke={DARK} strokeWidth="1.4" />
      <g fill={GOLD}>{[38, 44, 50, 56, 62].map((x) => <circle key={x} cx={x} cy="39" r="1.8" />)}</g><Orn x={50} y={22} s={.9} />
      <g stroke={GOLD} strokeWidth="1.4">{[34, 40, 60, 66].map((x) => <path key={x} d={`M${x} 42 v9`} />)}</g>
    </>
  ),
  "qyz-ormek": (
    <>
      <Body c="#2f7d6a" trim="#ffd35a" />
      <path d="M32 46 C26 62 30 80 34 92 M68 46 C74 62 70 80 66 92" stroke="#2a1708" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M31 66 l-5 6 M69 66 l5 6" stroke={RED} strokeWidth="3" strokeLinecap="round" />
      <Face lash />
      <path d="M30 42 C28 14 72 14 70 42 C62 30 38 30 30 42Z" fill="#2a1708" />
      <path d="M30 28 C34 10 66 10 70 28 C70 32 30 32 30 28Z" fill="#f7efe0" stroke={DARK} strokeWidth="1.6" />
      <path d="M32 30 h36" stroke={RED} strokeWidth="3" /><Orn x={50} y={20} s={.9} c={RED} /><circle cx="50" cy="9" r="2.4" fill={GOLD} />
    </>
  ),
  apa: (
    <>
      <Body c="#6a4a8a" trim="#e6d29a" />
      <path d="M50 14 C24 14 22 56 24 82 C30 92 42 90 50 90 C58 90 70 92 76 82 C78 56 76 14 50 14Z" fill="#fffaf0" stroke={DARK} strokeWidth="1.8" />
      <Face skin={SKIN2} cheek />
      <path d="M32 40 C34 24 66 24 68 40 C60 32 40 32 32 40Z" fill="#fffaf0" stroke={DARK} strokeWidth="1.4" />
      <path d="M36 30 q14 -8 28 0" fill="none" stroke={RED} strokeWidth="3" strokeLinecap="round" /><Orn x={50} y={24} s={.8} c={RED} />
      <path d="M40 40 q2 -2 4 0 M56 40 q2 -2 4 0" stroke="#bda07a" strokeWidth="1" fill="none" opacity="0" />
    </>
  ),
  bike: (
    <>
      <Body c="#d94f7a" trim="#fff3d4" />
      <path d="M28 44 C20 54 22 68 28 74 M72 44 C80 54 78 68 72 74" stroke="#2a1708" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M26 74 l-4 6 6 -1 M74 74 l4 6 -6 -1" fill={GOLD} stroke={GOLD} strokeWidth="2" />
      <Face lash />
      <path d="M31 40 C30 20 70 20 69 40 C62 28 38 28 31 40Z" fill="#2a1708" />
      <path d="M36 24 q14 -10 28 0" stroke={GOLD} strokeWidth="3" fill="none" /><circle cx="64" cy="22" r="3.4" fill={RED} stroke={DARK} strokeWidth="1" />
    </>
  ),
  shopan: (
    <>
      <Body c="#4a7a3a" trim="#e6d29a" />
      <Face />
      <path d="M32 32 C34 24 66 24 68 32 C62 30 56 33 50 36 C44 33 38 30 32 32Z" fill="#2a1708" />
      <path d="M26 36 C24 6 76 6 74 36 C60 30 40 30 26 36Z" fill="#f2e6c8" stroke={DARK} strokeWidth="1.8" />
      <path d="M26 36 C38 44 62 44 74 36 L76 44 C62 52 38 52 24 44Z" fill="#c9a263" stroke={DARK} strokeWidth="1.4" />
      <path d="M44 20 c4 -6 10 -6 12 0" stroke={GOLD} strokeWidth="2" fill="none" />
      <path d="M78 96 V62 q4 -4 8 0" stroke="#8a5a30" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
};

export default function Avatar({ value, size = 44, className = "" }) {
  const raw = typeof value === "string" && value.startsWith("av:") ? value.slice(3) : "zhigit";
  const id = ART[raw] ? raw : "zhigit";
  const [a, b] = BG[id] || ["#fff", "#ccc"];
  return (
    <svg className={`avatar ${className}`} viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={id}>
      <defs>
        <radialGradient id={`avbg-${id}`} cx=".35" cy=".25" r="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></radialGradient>
        <linearGradient id="avg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff0a8" /><stop offset="1" stopColor="#c47e00" /></linearGradient>
        <clipPath id={`avc-${id}`}><circle cx="50" cy="50" r="49" /></clipPath>
      </defs>
      <circle cx="50" cy="50" r="49" fill={`url(#avbg-${id})`} />
      <g clipPath={`url(#avc-${id})`}>{ART[id]}</g>
      <circle cx="50" cy="50" r="48" fill="none" stroke="#e8a400" strokeWidth="3" />
    </svg>
  );
}
