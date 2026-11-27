// Кию үлгісі: таңдалған Aqyl (әңгімеші қыз не жігіт, AqylFigure) + ұлттық киімдер.
// Киімдер кейіпкердің өз нүктелеріне (lib/aqyl.js → AQYL_GEOM[id].A) қарай сызылады; координат — кенеп (490×950).
// Қабаттар: behind (арқадағы аспап) → дене суреті → body (шапан, белдік, алқа, оң жең) → қолдар (өз жеңдерімен) → бас киім.
// Киіз стилі: тегіс түс + қою жиек + ақшыл тігіс сызығы.
import { AqylFigure } from "./Qyran";
import { useAqylChoice } from "../../lib/aqylChoice";
import { AQYL_GEOM, aqylId } from "../../lib/aqyl";
import { Dombyra, Kobyz, Kamshy } from "./NatArt";

const GOLD = "#e8a400", GOLD2 = "#ffd35a", RED = "#a8231c", TEAL = "#0a7f99", EM = "#12665a", CREAM = "#fff3d4", INK = "#2a1708";

function Gold({ d, w = 2.2 }) { return <path d={d} fill="none" stroke={GOLD2} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />; }
function Curls({ xs, y, s = 1, c = GOLD2 }) {
  return <g fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round">{xs.map((x) => <path key={x} transform={`translate(${x} ${y}) scale(${s})`} d="M0 5 c0 -6 -7 -8 -8 -3 c-1 4 5 5 6 1 M0 5 c0 -6 7 -8 8 -3 c1 4 -5 5 -6 1" />)}</g>;
}

/* ───────── Бас киімдер (200 өлшемді жүйеде сызылған; басқа қарай масштабталады, түбі (100,80)) ───────── */
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
  tumak: () => (
    <g>
      <path d="M54 80 C48 30 152 30 146 80 L148 122 C144 136 128 136 126 122 L124 88 C112 92 88 92 76 88 L74 122 C72 136 56 136 52 122Z" fill="#8a6a4a" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M58 76 C84 88 116 88 142 76 L142 88 C116 100 84 100 58 88Z" fill="#6a4a2c" stroke={INK} strokeWidth="1.6" />
      <g stroke="#d9bd94" strokeWidth="2" strokeLinecap="round" opacity=".85">{[62, 76, 90, 110, 124, 138].map((x, i) => <path key={x} d={`M${x} ${50 + (i % 2) * 8} l${i % 2 ? 3 : -3} 12`} />)}</g>
      <circle cx="100" cy="36" r="5" fill={RED} stroke={INK} strokeWidth="1.4" />
      <Curls xs={[100]} y={82} s={0.7} />
    </g>
  ),
  kalpak: () => (
    <g>
      <path d="M62 84 C58 46 74 20 100 12 C126 20 142 46 138 84 C122 92 78 92 62 84Z" fill="#fffaf0" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M100 12 C88 40 82 66 84 88 M100 12 C112 40 118 66 116 88" fill="none" stroke="#d9cdb4" strokeWidth="1.6" />
      <path d="M60 70 C80 82 120 82 140 70 L141 86 C120 98 80 98 59 86Z" fill="#1e1814" stroke={INK} strokeWidth="1.6" />
      <Curls xs={[84, 100, 116]} y={84} s={0.55} />
    </g>
  ),
  oramal: () => (
    <g>
      <path d="M50 82 C46 34 154 34 150 82 C132 68 68 68 50 82Z" fill="#c23a4b" stroke={INK} strokeWidth="2" />
      <path d="M50 80 C40 106 42 134 56 148 C62 128 62 106 70 88Z" fill="#c23a4b" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M150 80 C160 106 158 134 144 148 C138 128 138 106 130 88Z" fill="#c23a4b" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M54 76 C80 64 120 64 146 76" fill="none" stroke={GOLD2} strokeWidth="2.4" strokeLinecap="round" strokeDasharray="1 6" />
      <g fill={GOLD2}>{[[52, 104], [50, 124], [148, 104], [150, 124], [76, 52], [124, 52], [100, 44]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.6" />)}</g>
      <path d="M52 144 l-10 12 14 2 z M148 144 l10 12 -14 2 z" fill="#a82a3c" stroke={INK} strokeWidth="1.2" />
    </g>
  ),
};


/* ───────── Адамға арналған киімдер ───────── */
const SW = 4; // жиек қалыңдығы
const STITCH = { fill: "none", strokeWidth: 3.2, strokeDasharray: "11 9", strokeLinecap: "round" };
const shade = (hex, k = 0.72) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * k));
  return `rgb(${c.join(",")})`;
};
// Киіз бөлшегі: түс, қою жиек, ішкі тігіс (сәл кішірейтілген контур)
function Felt({ d, color, stitch = CREAM }) {
  return (
    <g>
      <path d={d} fill={color} stroke={shade(color)} strokeWidth={SW} strokeLinejoin="round" />
      {stitch && <path d={d} {...STITCH} stroke={stitch} opacity=".75" style={{ transform: "scale(.93)", transformBox: "fill-box", transformOrigin: "50% 50%" }} />}
    </g>
  );
}
// Жең: қолдың сүйегі бойымен жуан сызық (қол бұрылғанда жеңі де бірге бұрылады)
function Sleeve({ pts, color, w, cuff = GOLD }) {
  const d = "M" + pts.map((p) => p.join(" ")).join(" L");
  const a = pts[pts.length - 2], b = pts[pts.length - 1];
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  const ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len;
  const c0 = [b[0] - ux * 20, b[1] - uy * 20];
  return (
    <g fill="none" strokeLinejoin="round" strokeLinecap="butt">
      <path d={d} stroke={shade(color)} strokeWidth={w + SW * 2} />
      <path d={d} stroke={color} strokeWidth={w} />
      {cuff && <path d={`M${c0[0]} ${c0[1]} L${b[0]} ${b[1]}`} stroke={cuff} strokeWidth={w} />}
    </g>
  );
}

// Ұзын сырт киім пішіні (шапан, бешпент, ішік): иықтан етекке дейін, оң қолдың алақаны ашық қалады
function coatPath(A, { hem, flare = 1 }) {
  const [L, R] = A.sh;
  const top = A.shY - 6;
  const handY = A.handR[1] + 30;
  const wl = L - 10, wr = R + 10;
  const bl = A.cx - (A.cx - A.hemX[0]) * 0.62 * flare, br = A.cx + (A.hemX[1] - A.cx) * 0.62 * flare;
  return `M${A.cx - 40} ${A.collarY - 18} Q${A.cx} ${A.collarY + 24} ${A.cx + 40} ${A.collarY - 18}
    L${wr} ${top} C${wr + 8} ${A.waistY} ${R + 4} ${handY - 40} ${R - 2} ${handY} C${br - 12} ${hem - 60} ${br} ${hem - 20} ${br} ${hem}
    Q${A.cx} ${hem + 18} ${bl} ${hem} C${bl} ${hem - 80} ${wl - 30} ${A.waistY + 60} ${wl} ${top} Z`;
}

const BODY = {
  kamzol: (A) => {
    const [L, R] = A.sh;
    const yb = A.hipY + 26;
    const left = `M${L + 10} ${A.shY} Q${A.cx - 40} ${A.collarY - 8} ${A.cx - 22} ${A.collarY + 10} L${A.cx - 12} ${yb} Q${(L + A.cx) / 2} ${yb + 14} ${L + 4} ${yb - 6} Z`;
    const right = `M${R - 12} ${A.shY} Q${A.cx + 40} ${A.collarY - 8} ${A.cx + 22} ${A.collarY + 10} L${A.cx + 12} ${yb} Q${(R + A.cx) / 2} ${yb + 14} ${R - 8} ${yb - 6} Z`;
    return (
      <g>
        <Felt d={left} color={TEAL} stitch={GOLD2} />
        <Felt d={right} color={TEAL} stitch={GOLD2} />
        <Curls xs={[(L + A.cx) / 2 + 4, (R + A.cx) / 2 - 4]} y={A.waistY + 10} s={3} />
      </g>
    );
  },
  shapan: (A) => {
    const hem = A.hipY + (A.hemY - A.hipY) * 0.72;
    return (
      <g>
        <Felt d={coatPath(A, { hem, flare: 1.05 })} color={EM} stitch={GOLD2} />
        <path d={`M${A.cx - 40} ${A.collarY - 18} Q${A.cx} ${A.collarY + 24} ${A.cx + 40} ${A.collarY - 18}`} fill="none" stroke={GOLD} strokeWidth="9" strokeLinecap="round" />
        <path d={`M${A.cx} ${A.collarY + 22} V${hem + 8}`} stroke={GOLD} strokeWidth="6" />
        <Curls xs={[A.cx - 55, A.cx + 55]} y={A.hipY + 120} s={3.2} />
      </g>
    );
  },
  beshpent: (A) => {
    const hem = A.hipY + (A.hemY - A.hipY) * 0.45;
    return (
      <g>
        <Felt d={coatPath(A, { hem, flare: 0.86 })} color="#26407a" stitch={GOLD2} />
        <path d={`M${A.cx} ${A.collarY + 20} V${hem + 8}`} stroke="#14244a" strokeWidth="4" />
        <g fill={GOLD2} stroke="#14244a" strokeWidth="2">{[0, 1, 2, 3].map((i) => <circle key={i} cx={A.cx - 16} cy={A.collarY + 60 + i * 44} r="8" />)}</g>
        <path d={`M${A.cx - 44} ${A.collarY - 16} L${A.cx} ${A.collarY + 22} L${A.cx + 44} ${A.collarY - 16}`} fill="none" stroke={GOLD} strokeWidth="8" strokeLinejoin="round" />
      </g>
    );
  },
  ishik: (A) => {
    const hem = A.hipY + (A.hemY - A.hipY) * 0.55;
    return (
      <g>
        <Felt d={coatPath(A, { hem, flare: 1 })} color="#7a4a22" stitch="#c79a64" />
        <path d={`M${A.cx - 52} ${A.collarY - 22} Q${A.cx} ${A.collarY + 40} ${A.cx + 52} ${A.collarY - 22}`} fill="none" stroke="#fffaf0" strokeWidth="26" strokeLinecap="round" />
        <path d={`M${A.cx} ${A.collarY + 30} V${hem}`} stroke="#fffaf0" strokeWidth="18" />
        <path d={`M${A.cx - (A.cx - A.hemX[0]) * 0.62} ${hem} Q${A.cx} ${hem + 18} ${A.cx + (A.hemX[1] - A.cx) * 0.62} ${hem}`} fill="none" stroke="#fffaf0" strokeWidth="22" strokeLinecap="round" />
        <g fill={GOLD} stroke={INK} strokeWidth="2"><circle cx={A.cx + 22} cy={A.collarY + 80} r="9" /><circle cx={A.cx + 22} cy={A.collarY + 140} r="9" /></g>
      </g>
    );
  },
  koilek: (A) => {
    const [L, R] = A.sh;
    const hy = A.hemY - 24;
    const d = `M${L - 4} ${A.shY - 4} Q${A.cx} ${A.collarY - 10} ${R + 4} ${A.shY - 4} L${R - 6} ${A.waistY}
      C${R + 2} ${A.handR[1] + 20} ${A.hemX[1] - 6} ${hy - 160} ${A.hemX[1] + 12} ${hy}
      Q${A.cx} ${hy + 26} ${A.hemX[0] - 12} ${hy} C${A.hemX[0] + 6} ${hy - 160} ${L - 2} ${A.handR[1] + 20} ${L + 6} ${A.waistY} Z`;
    return (
      <g>
        <Felt d={d} color="#c23a4b" stitch={GOLD2} />
        <path d={`M${A.cx - 42} ${A.collarY - 14} Q${A.cx} ${A.collarY + 26} ${A.cx + 42} ${A.collarY - 14}`} fill="none" stroke={GOLD} strokeWidth="10" strokeLinecap="round" />
        <path d={`M${A.hemX[0] - 8} ${hy - 6} Q${A.cx} ${hy + 18} ${A.hemX[1] + 8} ${hy - 6}`} fill="none" stroke={CREAM} strokeWidth="18" strokeLinecap="round" />
        <Curls xs={[A.cx - 70, A.cx, A.cx + 70]} y={hy - 70} s={3} />
      </g>
    );
  },
};
// Сырт киімнің жеңдері: [түсі, жеңнің ұшы]
const SLEEVES = { shapan: [EM, GOLD], beshpent: ["#26407a", GOLD], ishik: ["#7a4a22", "#fffaf0"], koilek: ["#c23a4b", GOLD] };

function Belt({ A }) {
  const [x1, x2] = A.waistX;
  const y = A.waistY;
  return (
    <g>
      <path d={`M${x1 - 4} ${y - 16} Q${A.cx} ${y - 6} ${x2 + 4} ${y - 16} L${x2 + 4} ${y + 16} Q${A.cx} ${y + 26} ${x1 - 4} ${y + 16} Z`} fill={RED} stroke="#6a120c" strokeWidth={SW} />
      <path d={`M${x1 + 6} ${y} Q${A.cx} ${y + 10} ${x2 - 6} ${y}`} {...STITCH} stroke={GOLD2} />
      <rect x={A.buckle[0] - 26} y={y - 20} width="52" height="42" rx="10" fill={GOLD} stroke={INK} strokeWidth="3" />
      <circle cx={A.buckle[0]} cy={y + 1} r="10" fill={TEAL} stroke={INK} strokeWidth="2.4" />
    </g>
  );
}
function Necklace({ A }) {
  const [nx] = A.neck;
  const y0 = A.collarY - 4;
  const pts = Array.from({ length: 9 }, (_, i) => {
    const t = i / 8;
    const x = (1 - t) ** 3 * (nx - 56) + 3 * (1 - t) ** 2 * t * (nx - 50) + 3 * (1 - t) * t ** 2 * (nx + 50) + t ** 3 * (nx + 56);
    const y = (1 - t) ** 3 * y0 + 3 * (1 - t) ** 2 * t * (y0 + 70) + 3 * (1 - t) * t ** 2 * (y0 + 70) + t ** 3 * y0;
    return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
  });
  return (
    <g>
      <path d={`M${nx - 56} ${y0} C${nx - 50} ${y0 + 70} ${nx + 50} ${y0 + 70} ${nx + 56} ${y0}`} fill="none" stroke="#7a4a1f" strokeWidth="3" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="9" fill={i % 2 ? TEAL : "#e0574a"} stroke={INK} strokeWidth="2" />)}
      <path d={`M${nx} ${y0 + 46} l-16 20 16 28 16 -28z`} fill={GOLD} stroke={INK} strokeWidth="3" />
      <circle cx={nx} cy={y0 + 66} r="7" fill={TEAL} stroke={INK} strokeWidth="2" />
    </g>
  );
}
function Earrings({ A }) {
  return (
    <g>{A.ears.map(([x, y]) => (
      <g key={x}>
        <circle cx={x} cy={y} r="6" fill="none" stroke={GOLD} strokeWidth="4" />
        <path d={`M${x} ${y + 5} l-9 16 9 22 9 -22z`} fill={GOLD2} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        <circle cx={x} cy={y + 24} r="6" fill={TEAL} stroke={INK} strokeWidth="2" />
      </g>
    ))}</g>
  );
}
function Bangle({ at, tilt = 0 }) {
  const [x, y] = at;
  return (
    <g transform={`rotate(${tilt} ${x} ${y})`}>
      <ellipse cx={x} cy={y} rx="30" ry="10" fill="none" stroke={INK} strokeWidth="12" />
      <ellipse cx={x} cy={y} rx="30" ry="10" fill="none" stroke={GOLD2} strokeWidth="7" />
      <circle cx={x} cy={y + 10} r="5" fill="#e0574a" stroke={INK} strokeWidth="1.6" />
    </g>
  );
}
function Ring({ A }) {
  const [x, y] = A.handR;
  return <g><circle cx={x} cy={y} r="9" fill="none" stroke={GOLD} strokeWidth="6" /><circle cx={x} cy={y - 10} r="6" fill={TEAL} stroke={INK} strokeWidth="2" /></g>;
}
function Boots({ A, c = "#6b3a16", band = RED, low = false }) {
  return (
    <g>
      {A.feet.map(([x, y], i) => {
        const f = i === 0 ? -1 : 1; // сыртқа қараған ұшы
        const w = A.footW * 1.12;
        const top = low ? y - 30 : y - 130;
        const xl = x - w / 2, xr = x + w / 2;
        const d = f > 0
          ? `M${xl} ${top} H${xr} V${y - 8} C${xr + 26} ${y - 6} ${xr + 30} ${y + 22} ${xr + 14} ${y + 22} H${xl} C${xl - 4} ${y + 22} ${xl} ${y - 6} ${xl} ${y - 8} Z`
          : `M${xr} ${top} H${xl} V${y - 8} C${xl - 26} ${y - 6} ${xl - 30} ${y + 22} ${xl - 14} ${y + 22} H${xr} C${xr + 4} ${y + 22} ${xr} ${y - 6} ${xr} ${y - 8} Z`;
        return (
          <g key={i}>
            <path d={d} fill={c} stroke={shade(c, 0.6)} strokeWidth={SW} strokeLinejoin="round" />
            {!low && <rect x={xl - 2} y={top - 2} width={w + 4} height="18" rx="5" fill={band} stroke={shade(band, 0.6)} strokeWidth="3" />}
            {!low && <Curls xs={[x]} y={top + 52} s={2.6} />}
            <path d={`M${xl - (f < 0 ? 18 : 2)} ${y + 22} H${xr + (f > 0 ? 18 : 2)}`} stroke={INK} strokeWidth="7" strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

const HAT_FIT = { kimeshek: 1.02, saukele: 0.9, kalpak: 0.96, oramal: 1.04, tumak: 1.05, borik: 1.04, takiya: 1 };

export function dressSlots(wear, id) {
  const A = AQYL_GEOM[id].A;
  const head = HEAD[wear.head];
  const body = BODY[wear.body];
  const sl = SLEEVES[wear.body];
  const k = (A.headW / 84) * (HAT_FIT[wear.head] || 1);
  const hatT = `translate(${A.headCx} ${A.hairline + 4}) rotate(${A.hatRot || 0}) scale(${k.toFixed(3)}) translate(-100 -80)`;
  const sw = id === "qyz" ? 118 : 96;
  const inst = wear.acc === "dombyra" ? Dombyra : wear.acc === "kobyz" ? Kobyz : null;
  return {
    body: (
      <g>
        {body && body(A)}
        {sl && <Sleeve pts={A.armR} color={sl[0]} cuff={sl[1]} w={sw} />}
        {wear.acc === "beldik" && <Belt A={A} />}
        {wear.acc === "algha" && <Necklace A={A} />}
        {inst && <g transform={`translate(${A.cx + 14} ${A.waistY - 10}) rotate(34) scale(2) translate(-100 -100)`}>{inst()}</g>}
        {wear.foot === "etik" && <Boots A={A} />}
        {wear.foot === "masy" && <Boots A={A} c="#d4ad72" band="#e8a400" />}
        {wear.foot === "kebis" && <Boots A={A} c="#241c18" band="#e8a400" low />}
        {wear.acc === "bilezik" && <Bangle at={A.wristR} tilt={-10} />}
        {wear.acc === "zhuzik" && <Ring A={A} />}
        {wear.acc === "kamshy" && <g transform={`translate(${A.handR[0] - 4} ${A.handR[1] - 26}) rotate(-6) scale(1.5) translate(-93 -30)`}><Kamshy /></g>}
      </g>
    ),
    armDown: (
      <g>
        {sl && <Sleeve pts={A.armDown} color={sl[0]} cuff={sl[1]} w={sw} />}
        {wear.acc === "bilezik" && <Bangle at={A.wristDown} tilt={12} />}
      </g>
    ),
    armUp: (
      <g>
        {sl && <Sleeve pts={A.armUp} color={sl[0]} cuff={sl[1]} w={sw} />}
        {wear.acc === "bilezik" && <Bangle at={A.wristUp} tilt={-70} />}
      </g>
    ),
    front: (
      <g>
        {wear.acc === "sirga" && !["kimeshek", "oramal", "tumak"].includes(wear.head) && <Earrings A={A} />}
        {head && <g transform={hatT}>{head()}</g>}
      </g>
    ),
  };
}

// size — бұрынғыдай; биіктік бойға қарай. size < 100 → бас пен иық (бас киім мен алқа көрінеді).
const DRESS_VB = [-40, -130, 570, 1100];
export default function DressUp({ wear = {}, size = 220, mood = "idle", char }) {
  const chosen = useAqylChoice();
  const id = aqylId(char || chosen);
  const slots = dressSlots(wear, id);
  if (size < 100) {
    const G = AQYL_GEOM[id];
    // бас киім биік болса кадрды жоғары кеңейтеміз
    const up = wear.head === "saukele" ? 150 : wear.head ? 60 : 0;
    const vb = [G.face[0] - up / 2, G.face[1] - up, G.face[2] + up, G.face[2] + up];
    return <AqylFigure char={id} mood={mood} framing="bust" viewBox={vb} width={size} height={size} slots={slots} className="dress-svg" title="Aqyl" />;
  }
  const h = Math.round(size * 1.25);
  const w = Math.round((h * DRESS_VB[2]) / DRESS_VB[3]);
  return <AqylFigure char={id} mood={mood} framing="full" viewBox={DRESS_VB} width={w} height={h} slots={slots} className="dress-svg" title="Aqyl" />;
}
