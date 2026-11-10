// Кию үлгісі: кейіпкер (алдынан қарап тұрған бүркіт не жануар) + ұлттық киімдер SVG қабаттары.
// Барлығы бір координат жүйесінде (200×230): бас орталығы (100,100), дене (100,176), аяқ y≈224.
import { useId } from "react";
import { AnimalArt } from "./Animals";
import { Dombyra } from "./NatArt";

const GOLD = "#e8a400", GOLD2 = "#ffd35a", RED = "#a8231c", TEAL = "#0a7f99", EM = "#12665a", CREAM = "#fff3d4", INK = "#2a1708";

/* ───────── Алдынан қараған бүркіт ───────── */
function EagleFront({ uid }) {
  const B = `ef${uid}b`, H = `ef${uid}h`, Cc = `ef${uid}c`, K = `ef${uid}k`;
  return (
    <g>
      <defs>
        <linearGradient id={B} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a5326" /><stop offset="1" stopColor="#3a220d" /></linearGradient>
        <radialGradient id={H} cx="45%" cy="30%" r="80%"><stop offset="0" stopColor="#ecb94f" /><stop offset=".65" stopColor="#bb7b2a" /><stop offset="1" stopColor="#7a4a18" /></radialGradient>
        <linearGradient id={Cc} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e2bd80" /><stop offset="1" stopColor="#a8732f" /></linearGradient>
        <linearGradient id={K} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f3c43a" /><stop offset=".4" stopColor="#d9a21c" /><stop offset=".7" stopColor="#4a4540" /><stop offset="1" stopColor="#1c1a18" /></linearGradient>
      </defs>
      {/* Құйрық ұштары */}
      <path d="M84 206 L78 232 L92 224Z M116 206 L122 232 L108 224Z M100 210 L100 234 L94 226 L106 226Z" fill="#2c1a09" />
      {/* Қанаттар */}
      <path d="M58 124 C34 146 34 200 62 226 C72 204 70 160 66 130Z" fill="#4a2c12" stroke="#1f1206" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M142 124 C166 146 166 200 138 226 C128 204 130 160 134 130Z" fill="#4a2c12" stroke="#1f1206" strokeWidth="1.4" strokeLinejoin="round" />
      <g stroke="#d8b684" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".4"><path d="M52 150 C50 176 54 200 62 218 M60 144 C60 170 62 190 66 206 M148 150 C150 176 146 200 138 218 M140 144 C140 170 138 190 134 206" /></g>
      {/* Дене */}
      <ellipse cx="100" cy="176" rx="46" ry="52" fill={`url(#${B})`} />
      <ellipse cx="100" cy="184" rx="31" ry="42" fill={`url(#${Cc})`} />
      <g fill="none" stroke="#5a3314" strokeWidth="1.6" strokeLinecap="round" opacity=".7">
        {[150, 162, 174, 186, 198].map((y, i) => (<path key={y} d={`M${76 + (i % 2) * 6} ${y} q6 7 12 0 q6 7 12 0 q6 7 12 0 ${i % 2 ? "" : "q6 7 12 0"}`} />))}
      </g>
      {/* Бұтталы қауырсындар мен аяқ */}
      <ellipse cx="80" cy="212" rx="15" ry="13" fill={`url(#${Cc})`} stroke="#5a3314" strokeWidth="1.2" />
      <ellipse cx="120" cy="212" rx="15" ry="13" fill={`url(#${Cc})`} stroke="#5a3314" strokeWidth="1.2" />
      <g stroke="#d9a21c" strokeWidth="4.6" strokeLinecap="round" fill="none"><path d="M68 224 l-3 6 M78 226 v7 M90 224 l3 6 M110 224 l-3 6 M122 226 v7 M132 224 l3 6" /></g>
      <g stroke="#1c1a18" strokeWidth="2.6" strokeLinecap="round" fill="none"><path d="M65 230 l-2 3 M78 233 v2 M93 230 l2 3 M107 230 l-2 3 M122 233 v2 M135 230 l2 3" /></g>
      {/* Мойын жалы */}
      <ellipse cx="100" cy="140" rx="40" ry="16" fill={`url(#${H})`} />
      <g fill="#e6b04a" stroke="#a86b1c" strokeWidth="1">
        {[62, 74, 86, 100, 114, 126, 138].map((x, i) => (<path key={x} d="M0 0 C-4 5 -4 12 0 18 C4 12 4 5 0 0Z" transform={`translate(${x} ${134 + (i % 2) * 2}) rotate(${(x - 100) * 0.5})`} />))}
      </g>
      {/* Бас */}
      <ellipse cx="100" cy="98" rx="41" ry="43" fill={`url(#${H})`} />
      <path d="M72 66 C84 56 116 56 128 66" stroke="#f5d68a" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".5" />
      <g stroke="#a86b1c" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".7"><path d="M66 100 l-6 4 M64 112 l-7 4 M134 100 l6 4 M136 112 l7 4 M80 64 l2 6 M120 64 l-2 6 M100 58 v6" /></g>
      {/* Ауыр қас */}
      <path d="M62 82 C72 72 90 74 99 86 L97 90 C88 82 74 82 66 90Z" fill="#3a200a" />
      <path d="M138 82 C128 72 110 74 101 86 L103 90 C112 82 126 82 134 90Z" fill="#3a200a" />
      {/* Көз */}
      <g className="bk-eyes" style={{ transformOrigin: "100px 92px" }}>
        {[78, 122].map((x) => (
          <g key={x}>
            <circle cx={x} cy="94" r="9.6" fill="#2a1708" />
            <circle cx={x} cy="94" r="8" fill="#e9a21c" />
            <circle cx={x} cy="94" r="8" fill="none" stroke="#a85f06" strokeWidth="1.6" />
            <circle cx={x} cy="95" r="4.2" fill="#0d0805" />
            <circle cx={x + 2.4} cy="91" r="2.2" fill="#fff" />
          </g>
        ))}
      </g>
      {/* Тұмсық (алдынан) */}
      <path d="M86 98 C86 88 114 88 114 98 C114 114 108 128 100 138 C92 128 86 114 86 98Z" fill={`url(#${K})`} stroke="#1c1a18" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M86 98 C86 88 114 88 114 98 C114 106 111 112 108 116 C103 108 97 108 92 116 C89 112 86 106 86 98Z" fill="#f2c13a" stroke="#c78b00" strokeWidth="1" />
      <ellipse cx="95" cy="100" rx="2" ry="3" fill="#3a2a00" /><ellipse cx="105" cy="100" rx="2" ry="3" fill="#3a2a00" />
      <path d="M100 112 V134" stroke="#0f0d0b" strokeWidth="1.4" opacity=".6" />
    </g>
  );
}

/* ───────── Киімдер (қабаттар) ───────── */
function Gold({ d, w = 2.2 }) { return <path d={d} fill="none" stroke={GOLD2} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />; }
function Curls({ xs, y, s = 1, c = GOLD2 }) {
  return <g fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round">{xs.map((x) => <path key={x} transform={`translate(${x} ${y}) scale(${s})`} d="M0 5 c0 -6 -7 -8 -8 -3 c-1 4 5 5 6 1 M0 5 c0 -6 7 -8 8 -3 c1 4 -5 5 -6 1" />)}</g>;
}

const HEAD = {
  takiya: () => (
    <g>
      <path d="M62 68 C62 34 138 34 138 68 C138 78 62 78 62 68Z" fill={RED} stroke={INK} strokeWidth="2" />
      <path d="M62 64 C80 74 120 74 138 64 L138 74 C120 84 80 84 62 74Z" fill={TEAL} stroke={INK} strokeWidth="1.6" />
      <Gold d="M84 54 l6 -8 6 8 -6 8z M104 54 l6 -8 6 8 -6 8z" w={1.8} />
      <g fill={GOLD2}>{[70, 84, 100, 116, 130].map((x) => <circle key={x} cx={x} cy={x === 100 ? 80 : 78} r="2" />)}</g>
    </g>
  ),
  borik: () => (
    <g>
      <path d="M54 76 C48 30 152 30 146 76 C132 88 68 88 54 76Z" fill="#4a2c12" stroke={INK} strokeWidth="2" />
      <g stroke="#7a4a1f" strokeWidth="2.2" strokeLinecap="round" fill="none">{[62, 74, 86, 98, 110, 122, 134].map((x, i) => <path key={x} d={`M${x} ${78 + (i % 2) * 2} l${i % 2 ? 3 : -3} 8`} />)}</g>
      <path d="M68 52 C78 22 122 22 132 52 C114 44 86 44 68 52Z" fill={RED} stroke={INK} strokeWidth="1.8" />
      <path d="M126 36 C138 22 150 14 158 -2 C148 6 136 12 122 30Z" fill="#f4f1ea" stroke="#8a8a8a" strokeWidth="1.2" />
      <circle cx="100" cy="72" r="5" fill={GOLD} stroke={INK} strokeWidth="1.2" /><circle cx="100" cy="72" r="2" fill={TEAL} />
    </g>
  ),
  kimeshek: () => (
    <g>
      <path d="M62 80 C34 100 30 146 40 176 C54 170 64 156 68 140 C62 120 64 98 70 84Z" fill="#fffaf0" stroke="#bda57a" strokeWidth="1.6" />
      <path d="M138 80 C166 100 170 146 160 176 C146 170 136 156 132 140 C138 120 136 98 130 84Z" fill="#fffaf0" stroke="#bda57a" strokeWidth="1.6" />
      <path d="M50 78 C46 34 154 34 150 78 C132 66 68 66 50 78Z" fill="#fffaf0" stroke="#bda57a" strokeWidth="1.6" />
      <path d="M54 72 C82 62 118 62 146 72 L146 82 C118 72 82 72 54 82Z" fill={RED} stroke={INK} strokeWidth="1.4" />
      <Curls xs={[72, 90, 110, 128]} y={70} s={0.7} />
      <path d="M40 150 C70 172 130 172 160 150 L156 176 C124 192 76 192 44 176Z" fill="#fffaf0" stroke="#bda57a" strokeWidth="1.6" />
      <path d="M44 172 C76 188 124 188 156 172" stroke={RED} strokeWidth="3" fill="none" />
    </g>
  ),
  saukele: () => (
    <g>
      <path d="M64 72 L93 4 L107 4 L136 72 C118 80 82 80 64 72Z" fill={RED} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M93 4 L100 -2 L107 4Z" fill={GOLD} />
      <Gold d="M82 36 C92 42 108 42 118 36 M74 54 C88 62 112 62 126 54" w={2.4} />
      <Curls xs={[88, 100, 112]} y={26} s={0.55} />
      <path d="M62 68 C82 78 118 78 138 68 L136 80 C118 90 82 90 64 80Z" fill={GOLD} stroke={INK} strokeWidth="1.6" />
      <g fill={TEAL} stroke={INK} strokeWidth="1"><circle cx="78" cy="80" r="3.4" /><circle cx="100" cy="84" r="3.8" /><circle cx="122" cy="80" r="3.4" /></g>
      {[62, 138].map((x) => (
        <g key={x}>
          <path d={`M${x} 80 V132`} stroke={GOLD2} strokeWidth="1.8" strokeDasharray="1 5" strokeLinecap="round" />
          <circle cx={x} cy="86" r="3" fill={GOLD} /><circle cx={x} cy="100" r="3" fill={TEAL} /><circle cx={x} cy="114" r="3" fill={GOLD} />
          <path d={`M${x} 124 l-5 8 5 8 5 -8z`} fill={RED} stroke={GOLD2} strokeWidth="1.4" />
        </g>
      ))}
    </g>
  ),
};

const BODY = {
  kamzol: () => (
    <g>
      <path d="M58 148 C72 138 90 138 99 150 L96 204 C80 208 64 204 54 196Z" fill={TEAL} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M142 148 C128 138 110 138 101 150 L104 204 C120 208 136 204 146 196Z" fill={TEAL} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <Gold d="M58 148 C72 138 90 138 99 150 L96 204 M142 148 C128 138 110 138 101 150 L104 204" w={2.4} />
      <Curls xs={[70, 130]} y={176} s={0.8} /><Curls xs={[74, 126]} y={194} s={0.6} />
      <g fill={GOLD2}><circle cx="92" cy="164" r="2" /><circle cx="108" cy="164" r="2" /><circle cx="92" cy="180" r="2" /><circle cx="108" cy="180" r="2" /></g>
    </g>
  ),
  shapan: () => (
    <g>
      <ellipse cx="42" cy="178" rx="15" ry="34" fill={EM} stroke={INK} strokeWidth="1.8" transform="rotate(10 42 178)" />
      <ellipse cx="158" cy="178" rx="15" ry="34" fill={EM} stroke={INK} strokeWidth="1.8" transform="rotate(-10 158 178)" />
      <path d="M36 200 q6 8 16 4 M164 200 q-6 8 -16 4" stroke={GOLD2} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M52 146 C74 134 126 134 148 146 L160 214 C128 228 72 228 40 214Z" fill={EM} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M78 140 L100 172 L122 140 L112 138 L100 154 L88 138Z" fill={CREAM} stroke={INK} strokeWidth="1.2" />
      <Gold d="M100 150 V224 M52 146 C74 134 126 134 148 146 M40 214 C72 228 128 228 160 214" w={3} />
      <Gold d="M46 206 C74 220 126 220 154 206" w={1.6} />
      <Curls xs={[60, 74, 126, 140]} y={206} s={0.7} /><Curls xs={[72, 128]} y={176} s={0.9} />
    </g>
  ),
  koilek: () => (
    <g>
      <ellipse cx="46" cy="170" rx="13" ry="28" fill="#c23a4b" stroke={INK} strokeWidth="1.8" transform="rotate(12 46 170)" />
      <ellipse cx="154" cy="170" rx="13" ry="28" fill="#c23a4b" stroke={INK} strokeWidth="1.8" transform="rotate(-12 154 170)" />
      <path d="M34 190 q5 7 14 4 M166 190 q-5 7 -14 4" stroke={GOLD2} strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d="M64 144 C84 136 116 136 136 144 C142 172 160 202 172 226 C130 238 70 238 28 226 C40 202 58 172 64 144Z" fill="#c23a4b" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M64 146 C84 154 116 154 136 146 L137 160 C116 168 84 168 63 160Z" fill={GOLD} stroke={INK} strokeWidth="1.4" />
      <Curls xs={[78, 100, 122]} y={152} s={0.6} c="#7a1b18" />
      <path d="M30 226 C70 238 130 238 170 226 L168 218 C130 230 70 230 32 218Z" fill={CREAM} stroke={INK} strokeWidth="1.2" />
      <Gold d="M40 214 C74 226 126 226 160 214" w={1.6} />
      <g fill={GOLD2}>{[90, 110, 80, 120, 100].map((x, i) => <path key={i} d={`M${x} ${186 + i * 6} l3 -4 3 4 -3 4z`} />)}</g>
    </g>
  ),
};

function Belt({ x1, x2, y }) {
  return (
    <g>
      <path d={`M${x1} ${y} C${x1 + 26} ${y + 10} ${x2 - 26} ${y + 10} ${x2} ${y} L${x2} ${y + 12} C${x2 - 26} ${y + 22} ${x1 + 26} ${y + 22} ${x1} ${y + 12}Z`} fill={RED} stroke={INK} strokeWidth="1.6" />
      <Gold d={`M${x1 + 4} ${y + 5} C${x1 + 28} ${y + 14} ${x2 - 28} ${y + 14} ${x2 - 4} ${y + 5}`} w={1.6} />
      <rect x="90" y={y + 3} width="20" height="16" rx="4" fill={GOLD} stroke={INK} strokeWidth="1.4" />
      <circle cx="100" cy={y + 11} r="4" fill={TEAL} stroke={INK} strokeWidth="1" />
    </g>
  );
}
function Necklace() {
  const pts = Array.from({ length: 9 }, (_, i) => { const t = i / 8; const x = (1 - t) ** 3 * 68 + 3 * (1 - t) ** 2 * t * 72 + 3 * (1 - t) * t ** 2 * 128 + t ** 3 * 132; const y = (1 - t) ** 3 * 142 + 3 * (1 - t) ** 2 * t * 172 + 3 * (1 - t) * t ** 2 * 172 + t ** 3 * 142; return [x, y]; });
  return (
    <g>
      <path d="M68 142 C72 172 128 172 132 142" fill="none" stroke="#7a4a1f" strokeWidth="1.4" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4.4" fill={i % 2 ? TEAL : "#e0574a"} stroke={INK} strokeWidth="1" />)}
      <path d="M100 160 l-8 10 8 14 8 -14z" fill={GOLD} stroke={INK} strokeWidth="1.4" /><circle cx="100" cy="170" r="4" fill={TEAL} stroke={INK} strokeWidth="1" />
    </g>
  );
}
function Boots({ eagle }) {
  const y = eagle ? 0 : 2;
  return (
    <g>
      {[1, -1].map((f) => { const x = 66; return (
        <g key={f} transform={f === -1 ? "translate(200 0) scale(-1 1)" : ""}>
          <path d={`M${x} ${202 + y} H${x + 26} V${224 + y} C${x + 36} ${225 + y} ${x + 38} ${236 + y} ${x + 26} ${236 + y} H${x - 2} C${x - 8} ${236 + y} ${x - 8} ${227 + y} ${x} ${224 + y}Z`} fill="#6b3a16" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
          <rect x={x - 1} y={200 + y} width="28" height="7" rx="2" fill={RED} stroke={INK} strokeWidth="1.2" />
          <Curls xs={[x + 13]} y={214 + y} s={0.7} />
          <path d={`M${x - 6} ${234 + y} H${x + 32}`} stroke={INK} strokeWidth="3" strokeLinecap="round" />
        </g>
      ); })}
    </g>
  );
}
function Ring({ eagle }) {
  const [x, y] = eagle ? [128, 228] : [154, 192];
  return <g><circle cx={x} cy={y} r="6" fill="none" stroke={GOLD} strokeWidth="3.2" /><circle cx={x} cy={y - 6} r="3.2" fill={TEAL} stroke={INK} strokeWidth="1" /></g>;
}

export default function DressUp({ skin = "eagle", wear = {}, size = 220, mood = "idle" }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const eagle = skin === "eagle";
  const head = HEAD[{ takiya: "takiya", borik: "borik", kimeshek: "kimeshek", saukele: "saukele" }[wear.head]];
  const body = BODY[wear.body];
  const beltOn = wear.acc === "beldik";
  const koi = wear.body === "koilek";
  return (
    <svg className={`qyran dress-svg bk-${mood}`} viewBox="-4 -12 208 252" width={size} height={(size * 252) / 208} role="img" aria-label="Aqyl">
      <ellipse className="bk-shadow" cx="100" cy="236" rx="62" ry="5" fill="#2a1708" opacity=".18" />
      <g className="bk-float">
        {eagle ? <EagleFront uid={uid} /> : <AnimalArt id={skin} mood="idle" uid={uid} />}
        {body && body()}
        {beltOn && (koi ? <Belt x1={64} x2={136} y={160} /> : <Belt x1={50} x2={150} y={184} />)}
        {wear.acc === "algha" && <Necklace />}
        {wear.foot === "etik" && <Boots eagle={eagle} />}
        {wear.acc === "zhuzik" && <Ring eagle={eagle} />}
        {head && head()}
        {wear.acc === "dombyra" && <g transform="translate(100 178) rotate(30) scale(.66) translate(-100 -92)"><Dombyra /></g>}
      </g>
    </svg>
  );
}
