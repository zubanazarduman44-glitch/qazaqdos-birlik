// «VR Әлем» суреттері: бірінші жақтан көрінетін 16 орын, киіз кейіпкерлер және қала-дала картасының ғимараттары.
// Жалпақ «киіз аппликация»: түсті кесінділер, астындағы қою «көлеңке» қабаты, үзік тігіс сызықтары, қошқар мүйіз өрнегі.
// Градиент пен id жоқ (бір бетте бірнеше сурет қатар тұрады). Терезе сыртындағы қозғалыс — қабырғаның «тесік» жолымен жабылады.
// Қабаттар: vr-l0 (артқы қабырға) → vr-l1 (орта) → vr-ln (кейіпкер) → vr-l2 (алдыңғы үстел). CSS --px/--py арқылы параллакс.
import { memo } from "react";

const C = {
  cream: "#FAF6EE", surf: "#FFFDF7", felt: "#F4ECDA", ink: "#1F2430", thread: "#3A2210", red: "#B8322A", deep: "#8A2018",
  gold: "#E0A526", gold2: "#F2C14E", goldS: "#F6E3B0", blue: "#0F5E7A", blue2: "#0A4A61", sky: "#CFE6EC", green: "#2F6B4F",
  leaf: "#5E8C4A", leaf2: "#46703A", wood: "#A8703F", wood2: "#86532B", wood3: "#C48A52", grey: "#C9C2B2", navy: "#1F2A44", teal: "#2C7A78",
};
const ST = "rgba(255,253,247,.6)"; // ақшыл тігіс
const STD = "rgba(58,34,16,.35)"; // қою тігіс
const HORN = "M20 23V13C20 7.5 15 4.5 11 6.2C7.6 7.7 8.2 12.4 11.6 12.4C13.6 12.4 14.2 10 12.6 9.3M20 13C20 7.5 25 4.5 29 6.2C32.4 7.7 31.8 12.4 28.4 12.4C26.4 12.4 25.8 10 27.4 9.3M15 23H25";

function hash(s) {
  let h = 7;
  for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return Math.abs(h);
}

// Киіз тікбұрыш: астында көлеңке, ішінде үзік тігіс
function R({ x, y, w, h, r = 6, c, sh, st = ST, d = 4, op }) {
  return (
    <g opacity={op}>
      {sh && <rect x={x} y={y + d} width={w} height={h} rx={r} fill={sh} />}
      <rect x={x} y={y} width={w} height={h} rx={r} fill={c} />
      {st && w > 18 && h > 18 && <rect x={x + 5} y={y + 5} width={w - 10} height={h - 10} rx={Math.max(0, r - 3)} fill="none" stroke={st} strokeWidth="1.5" strokeDasharray="4 4" />}
    </g>
  );
}
const Horn = ({ x, y, s = 1, c = C.gold, w = 2 }) => <path transform={`translate(${x} ${y}) scale(${s}) translate(-20 -15)`} d={HORN} fill="none" stroke={c} strokeWidth={w / s} strokeLinecap="round" />;
// Көлденең өрнек жолағы
function Band({ y, h = 22, c = C.deep, oc = C.gold, x0 = -30, x1 = 830, step = 64 }) {
  const n = Math.ceil((x1 - x0) / step);
  return (
    <g>
      <rect x={x0} y={y} width={x1 - x0} height={h} fill={c} />
      <path d={`M${x0} ${y + 3}H${x1}M${x0} ${y + h - 3}H${x1}`} stroke={oc} strokeWidth="1.2" strokeDasharray="3 3" opacity=".8" />
      {Array.from({ length: n }, (_, i) => <Horn key={i} x={x0 + step / 2 + i * step} y={y + h / 2 + 1} s={h / 34} c={oc} w={1.8} />)}
    </g>
  );
}
// Қабырға: сыртқы тікбұрыштан «тесіктер» (терезелер) ойылады
const holes = (list, x = -40, y = -40, w = 880, hh = 530) =>
  `M${x} ${y}H${x + w}V${y + hh}H${x}Z ` + list.map((r) => (r.d ? r.d : `M${r.x} ${r.y}h${r.w}v${r.h}h${-r.w}Z`)).join(" ");
function Wall({ c, list = [] }) {
  return <path d={holes(list)} fill={c} fillRule="evenodd" />;
}
// Терезе жақтауы
function Frame({ x, y, w, h, c = C.wood2, cols = 2, rows = 1, t = 8 }) {
  const v = [];
  for (let i = 1; i < cols; i++) v.push(<rect key={"v" + i} x={x + (w * i) / cols - t / 4} y={y} width={t / 2} height={h} fill={c} />);
  for (let i = 1; i < rows; i++) v.push(<rect key={"h" + i} x={x} y={y + (h * i) / rows - t / 4} width={w} height={t / 2} fill={c} />);
  return (
    <g>
      <rect x={x - t / 2} y={y - t / 2} width={w + t} height={h + t} rx="4" fill="none" stroke={c} strokeWidth={t} />
      {v}
      <rect x={x - t} y={y + h + t / 2} width={w + 2 * t} height="8" rx="3" fill={c} />
    </g>
  );
}
const Cloud = ({ x, y, s = 1, c = "#fff" }) => <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 20c-10 0-14-12-4-16 0-10 14-14 20-6 6-8 22-6 22 6 10 0 12 16 0 16Z" fill={c} opacity=".92" />;
// Бу (шай/кофе): CSS vr-steam жоғары көтеріледі
const Steam = ({ x, y, s = 1 }) => (
  <g className="vr-steam" transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0c-6-8 6-14 0-24s6-14 0-22" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".85" />
    <path d="M12 -4c-5-7 5-12 0-20s5-12 0-18" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".65" />
  </g>
);
// Кесе
const Kese = ({ x, y, s = 1, c = C.blue }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="18" rx="24" ry="5" fill="rgba(58,34,16,.18)" />
    <path d="M-22 -2h44c-2 14-10 20-22 20s-20-6-22-20Z" fill={C.surf} />
    <path d="M-20 4h40" stroke={c} strokeWidth="4" />
    <ellipse cx="0" cy="-2" rx="22" ry="5" fill="#B5712E" />
    <ellipse cx="0" cy="-2" rx="22" ry="5" fill="none" stroke={C.surf} strokeWidth="2.5" />
  </g>
);
// Шәйнек
const Teapot = ({ x, y, s = 1, c = C.blue }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="34" rx="44" ry="7" fill="rgba(58,34,16,.18)" />
    <path d="M30 4c18-6 26-22 30-24 2 4-6 24-24 34" fill={c} />
    <path d="M-34 -2c-18 0-20 26-2 26" fill="none" stroke={c} strokeWidth="7" />
    <path d="M-36 -6c0 26 10 40 36 40s36-14 36-40Z" fill={c} />
    <path d="M-28 6c6 14 16 20 28 20s22-6 28-20" fill="none" stroke={C.gold} strokeWidth="3" strokeDasharray="5 4" />
    <ellipse cx="0" cy="-6" rx="36" ry="8" fill={C.blue2} />
    <path d="M-14 -12c2-12 26-12 28 0" fill={c} />
    <circle cx="0" cy="-20" r="5" fill={C.gold} />
    <Horn x={0} y={14} s={0.7} c={C.goldS} w={2} />
  </g>
);
// Бауырсақ табақ
const Baursak = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="8" rx="56" ry="15" fill="rgba(58,34,16,.18)" />
    <ellipse cx="0" cy="2" rx="54" ry="15" fill={C.surf} />
    <ellipse cx="0" cy="2" rx="46" ry="11" fill="none" stroke={C.red} strokeWidth="2.5" strokeDasharray="5 4" />
    {[[-26, -4], [-6, -8], [16, -6], [-16, 2], [6, 0], [28, 2], [-2, -16], [18, -16]].map(([a, b], i) => (
      <g key={i}>
        <path d={`M${a - 11} ${b + 2}q11-14 22 0q-11 9-22 0Z`} fill={i % 2 ? "#C98A34" : "#D99C44"} />
        <path d={`M${a - 6} ${b - 1}q6-5 12 0`} fill="none" stroke="#F2C77A" strokeWidth="1.6" />
      </g>
    ))}
  </g>
);
const Plant = ({ x, y, s = 1, pot = C.red }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g className="vr-sway up">
      <path d="M0 -20C-30 -40 -34 -76 -22 -96C-6 -74 -4 -44 0 -20Z" fill={C.leaf} />
      <path d="M0 -20C24 -46 34 -84 22 -104C6 -82 2 -50 0 -20Z" fill={C.leaf2} />
      <path d="M0 -20C-8 -50 -2 -84 8 -100C14 -74 10 -46 0 -20Z" fill={C.leaf} />
    </g>
    <path d="M-22 -24h44l-6 30h-32Z" fill={pot} />
    <path d="M-18 -16h36" stroke={C.gold} strokeWidth="2" strokeDasharray="4 3" />
  </g>
);
// Сағат (минут тілі баяу айналады)
function Clock({ x, y, r = 26, c = C.surf, rim = C.deep }) {
  return (
    <g>
      <circle cx={x} cy={y + 3} r={r + 4} fill="rgba(58,34,16,.2)" />
      <circle cx={x} cy={y} r={r + 4} fill={rim} />
      <circle cx={x} cy={y} r={r} fill={c} />
      {[0, 90, 180, 270].map((a) => <rect key={a} x={x - 1.5} y={y - r + 3} width="3" height="6" fill={C.ink} transform={`rotate(${a} ${x} ${y})`} />)}
      <path d={`M${x} ${y}l${-r * 0.35} ${-r * 0.3}`} stroke={C.ink} strokeWidth="4" strokeLinecap="round" />
      <path className="vr-spin" d={`M${x} ${y}V${y - r * 0.75}`} stroke={C.red} strokeWidth="3" strokeLinecap="round" />
      <circle cx={x} cy={y} r="3.5" fill={C.ink} />
    </g>
  );
}
// Шамдал (асылып тұр)
const Lamp = ({ x, y = 0, len = 70, c = C.red }) => (
  <g className="vr-sway">
    <path d={`M${x} ${y - 20}V${y + len}`} stroke={C.thread} strokeWidth="2.5" />
    <path d={`M${x - 30} ${y + len + 26}c4-20 14-28 30-28s26 8 30 28Z`} fill={c} />
    <path d={`M${x - 22} ${y + len + 18}h44`} stroke={C.gold} strokeWidth="2" strokeDasharray="4 3" />
    <ellipse cx={x} cy={y + len + 27} rx="12" ry="5" fill={C.goldS} />
  </g>
);
// Тақта жазуы (бор)
const Chalk = ({ x, y, size = 22, children, c = "#F4F1E6" }) => (
  <text x={x} y={y} fill={c} fontSize={size} fontFamily="'Golos Text', 'Segoe UI', sans-serif" fontWeight="600" lang="kk">{children}</text>
);
// Табло жолдары (жарықтары кезекпен жыпылықтайды)
function Board({ x, y, w, h, rows = 4, c = C.navy, head }) {
  const rh = (h - 26) / rows;
  return (
    <g>
      <R x={x} y={y} w={w} h={h} r={6} c={c} sh="rgba(20,20,30,.3)" st={null} />
      {head && <Chalk x={x + 12} y={y + 19} size={13} c={C.gold2}>{head}</Chalk>}
      {Array.from({ length: rows }, (_, i) => (
        <g key={i} className={i % 2 ? "vr-blink b2" : "vr-blink"}>
          <rect x={x + 12} y={y + 26 + i * rh} width={w * 0.34} height={rh * 0.5} rx="2" fill="#F2B544" opacity=".9" />
          <rect x={x + 18 + w * 0.36} y={y + 26 + i * rh} width={w * 0.2} height={rh * 0.5} rx="2" fill="#F2B544" opacity=".65" />
          <rect x={x + w - 12 - w * 0.2} y={y + 26 + i * rh} width={w * 0.2} height={rh * 0.5} rx="2" fill={i === 1 ? "#E46B5E" : "#7FD0A7"} opacity=".9" />
        </g>
      ))}
    </g>
  );
}
const Apple = ({ x, y, r = 11, c = "#C8392E" }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={c} />
    <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.28} fill="#fff" opacity=".35" />
    <path d={`M${x} ${y - r}q2-6 6-7`} stroke={C.thread} strokeWidth="2" fill="none" />
  </g>
);
function Pile({ x, y, n = 3, r = 11, c, c2 }) {
  const out = [];
  let k = 0;
  for (let row = 0; row < n; row++)
    for (let i = 0; i < n - row; i++) out.push(<Apple key={k++} x={x + (i - (n - row - 1) / 2) * r * 2} y={y - row * r * 1.7} r={r} c={(i + row) % 3 === 1 && c2 ? c2 : c} />);
  return <g>{out}</g>;
}
// Қалалық сұлба (терезе сыртына)
function City({ x = 0, y = 240, w = 800, c = "#9FB7C2", c2 = "#B9CCD3", seed = 3 }) {
  const out = [];
  let px = x - 20;
  let i = 0;
  while (px < x + w + 20) {
    const bw = 40 + ((seed * 13 + i * 29) % 50);
    const bh = 60 + ((seed * 7 + i * 41) % 110);
    out.push(<rect key={i} x={px} y={y - bh} width={bw} height={bh + 40} fill={i % 2 ? c : c2} />);
    for (let wy = y - bh + 14; wy < y - 10; wy += 22) out.push(<rect key={i + "w" + wy} x={px + 8} y={wy} width={bw - 16} height="6" rx="2" fill="#EEF5F6" opacity=".55" />);
    px += bw + 6;
    i++;
  }
  return <g>{out}</g>;
}
const Bus = ({ x, y, s = 1, c = C.red }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="0" y="-60" width="170" height="56" rx="12" fill={c} />
    <rect x="0" y="-26" width="170" height="8" fill={C.gold} />
    {[10, 48, 86, 124].map((wx) => <rect key={wx} x={wx} y="-52" width="32" height="20" rx="4" fill="#DCEFF3" />)}
    <circle cx="36" cy="-4" r="11" fill={C.ink} /><circle cx="134" cy="-4" r="11" fill={C.ink} />
    <circle cx="36" cy="-4" r="4" fill={C.grey} /><circle cx="134" cy="-4" r="4" fill={C.grey} />
  </g>
);
const Car = ({ x, y, s = 1, c = C.blue }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -14c0-14 10-18 24-20l16-16h52l20 16c18 2 28 6 28 20v10H0Z" fill={c} />
    <path d="M44 -46h22v14H34ZM72 -46h18l14 14H72Z" fill="#DCEFF3" />
    <circle cx="30" cy="-4" r="10" fill={C.ink} /><circle cx="110" cy="-4" r="10" fill={C.ink} />
  </g>
);
const Plane = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0c0-8 10-12 24-12h110c14 0 26 6 30 12-4 6-16 12-30 12H24C10 12 0 8 0 0Z" fill="#fff" />
    <path d="M60 -10 40 -46h18l40 36ZM60 10 44 40h16l34-30ZM8 -6 0 -30h12l16 20Z" fill={C.blue} />
    <path d="M140 -6h14" stroke={C.blue2} strokeWidth="4" strokeLinecap="round" />
    {[34, 50, 66, 82, 98, 114].map((wx) => <circle key={wx} cx={wx} cy="-2" r="3" fill={C.blue2} />)}
    <path d="M24 6h112" stroke={C.red} strokeWidth="3" />
  </g>
);
const Train = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map((k) => (
      <g key={k} transform={`translate(${k * 190} 0)`}>
        <rect x="0" y="-80" width="182" height="72" rx={k === 2 ? 30 : 8} fill={C.green} />
        <rect x="0" y="-36" width="182" height="10" fill={C.red} />
        <rect x="0" y="-26" width="182" height="4" fill={C.gold} />
        {[14, 56, 98, 140].map((wx) => <rect key={wx} x={wx} y="-68" width="30" height="22" rx="5" fill="#DCEFF3" />)}
      </g>
    ))}
  </g>
);
const Mountains = ({ y = 200, c = "#9DB8C4", c2 = "#B7CCD5" }) => (
  <g>
    <path d={`M-40 ${y}L80 ${y - 90}l60 50 90-110 110 120 70-60 120 100 90-90 140 120 100-70 60 50V${y + 40}H-40Z`} fill={c2} />
    <path d={`M200 ${y - 60}l30-50 30 34-20-6-14 14Z M540 ${y - 40}l22-50 30 40-18-6-16 12Z`} fill="#fff" opacity=".9" />
    <path d={`M-40 ${y + 20}L60 ${y - 40}l90 60 110-70 120 80 140-60 110 70 120-50 100 60V${y + 60}H-40Z`} fill={c} />
  </g>
);

/* ═════════════ Кейіпкерлер ═════════════ */
const SKIN = ["#EDC39C", "#DDA87E", "#C98E65"];
const SKIN_D = ["#D9A57C", "#C48D63", "#AD7450"];
const HAIR = ["#2B1A12", "#3B2416", "#1E1A1A", "#4E2F1B"];
// Орынға сай киім: top — көйлек/күрте, apron — алжапқыш, coat — ақ халат, cap — күләпара, tie/collar, badge
const OUT = {
  shop: { top: "#2C7A78", apron: C.red },
  bazaar: { top: "#5E8C4A", apron: C.gold, scarf: C.red, cap: "#5A4632" },
  school: { top: "#1F4E8C", collar: C.surf, glasses: true },
  airport: { top: "#0F3F57", tie: C.gold, collar: C.surf, badge: C.gold },
  station: { top: C.green, tie: C.red, collar: C.surf, cap: "#1E4A36" },
  taxi: { top: "#7A4A21", cap: "#3A3F4E", tache: true },
  hotel: { top: C.deep, collar: C.surf, badge: C.gold },
  cafe: { top: C.surf, apron: C.thread, pad: true },
  pharmacy: { top: "#FFFFFF", coat: true, shirt: C.teal, badge: "#2F8F5B" },
  clinic: { top: "#FFFFFF", coat: true, shirt: "#5B87A8", steth: true },
  bank: { top: C.navy, tie: C.red, collar: C.surf, badge: C.gold },
  post: { top: "#1F4E8C", badge: C.gold, collar: C.goldS },
  bus: { top: "#D9692A", strap: true, cap: "#3A3F4E" },
  guest: { top: C.deep, trim: C.gold, scarf: C.surf, taqiya: true, old: true },
  phone: { top: "#5B3FA8" },
  office: { top: "#3F4A5C", collar: C.surf },
};

function Npc({ voice = "f", place = "shop", name = "", talk = false, mood = null }) {
  const h = hash(name + place);
  const k = h % 3;
  const skin = SKIN[k], skd = SKIN_D[k];
  const o = OUT[place] || OUT.shop;
  const f = voice === "f";
  const hair = o.old && h % 2 ? "#BDB6AA" : HAIR[(h >> 3) % HAIR.length];
  const top = place === "guest" && !f ? "#5A3A22" : o.top;
  const style = f ? (o.scarf && (place === "guest" || h % 2) ? "scarf" : ["long", "bun", "braid"][(h >> 4) % 3]) : o.cap ? "cap" : o.taqiya ? "taqiya" : "short";
  const phone = place === "phone";
  const dark = top === "#FFFFFF" || top === C.surf ? "#D8D2C4" : "rgba(0,0,0,.22)";
  return (
    <g className={`vr-npc${talk ? " is-talk" : ""}${mood ? ` is-${mood}` : ""}`}>
      <g className="vr-body">
        {/* артқы шаш */}
        <g className="vr-head"><g className="vr-react">
        {style === "long" && <path d="M-37 -262C-46 -304 46 -304 37 -262L44 -188C28 -178-28 -178-44 -188Z" fill={hair} />}
        {style === "bun" && <circle cx="0" cy="-294" r="16" fill={hair} />}
        </g></g>
        {/* аяқ */}
        <path d="M-44 -100L-40 -8H-6L-2 -80H2L6 -8H40L44 -100Z" fill={o.coat ? "#3A3F4E" : "#3A3F4E"} />
        <ellipse cx="-23" cy="-6" rx="20" ry="8" fill={C.ink} />
        <ellipse cx="23" cy="-6" rx="20" ry="8" fill={C.ink} />
        {/* дене */}
        <path d={o.coat ? "M-56 -206C-74 -200-78 -170-76 -140L-70 -40H70L76 -140C78 -170 74 -200 56 -206C30 -214-30 -214-56 -206Z" : "M-56 -206C-74 -200-76 -170-72 -140L-64 -96C-40 -88 40 -88 64 -96L72 -140C76 -170 74 -200 56 -206C30 -214-30 -214-56 -206Z"} fill={top} />
        <path d="M-58 -96h116" stroke={dark} strokeWidth="5" opacity={o.coat ? 0 : 1} />
        <path d="M-50 -196C-64 -188-66 -168-63 -142L-57 -104M50 -196C64 -188 66 -168 63 -142L57 -104" fill="none" stroke={top === "#FFFFFF" ? "#C8C0AE" : ST} strokeWidth="1.6" strokeDasharray="4 4" />
        {o.coat && (
          <>
            <path d="M-17 -209L0 -170L17 -209Z" fill={o.shirt} />
            <path d="M-17 -209L-4 -150M17 -209L4 -150M0 -150V-46" stroke="#D2CBBB" strokeWidth="2.5" fill="none" />
            <rect x="24" y="-150" width="22" height="14" rx="3" fill="#E9E4D8" />
          </>
        )}
        {o.collar && <path d="M-18 -210L0 -176L18 -210Z" fill={o.collar} />}
        {o.tie && <path d="M-5 -200H5L8 -150L0 -138L-8 -150Z" fill={o.tie} />}
        {o.trim && (
          <>
            <path d="M-16 -209C-12 -170-12 -130-10 -96M16 -209C12 -170 12 -130 10 -96" fill="none" stroke={o.trim} strokeWidth="5" />
            <Horn x={-34} y={-128} s={0.55} c={o.trim} w={2} />
            <Horn x={34} y={-128} s={0.55} c={o.trim} w={2} />
          </>
        )}
        {o.apron && (
          <>
            <path d="M-38 -168H38L46 -70H-46Z" fill={o.apron} />
            <path d="M-38 -168L-28 -206M38 -168L28 -206" stroke={o.apron} strokeWidth="6" />
            <path d="M-32 -160H32L38 -78H-38Z" fill="none" stroke={ST} strokeWidth="1.5" strokeDasharray="4 4" />
            <Horn x={0} y={-112} s={0.75} c={o.apron === C.gold ? C.deep : C.gold} w={2} />
          </>
        )}
        {o.strap && <path d="M-46 -204L44 -112" stroke="#5A3A22" strokeWidth="8" />}
        {o.strap && <rect x="30" y="-126" width="34" height="26" rx="5" fill="#5A3A22" />}
        {o.badge && !o.coat && <rect x="24" y="-178" width="20" height="10" rx="2" fill={o.badge} />}
        {o.badge && o.coat && <path d="M33 -147h4v4h4v4h-4v4h-4v-4h-4v-4h4Z" fill={o.badge} />}
        {/* сол қол (төмен) */}
        <path d="M-60 -196C-78 -176-82 -140-78 -110" fill="none" stroke={top} strokeWidth="24" strokeLinecap="round" />
        <circle cx="-78" cy="-104" r="11" fill={skin} />
        {/* мойын мен бас */}
        <rect x="-11" y="-226" width="22" height="24" fill={skd} />
        <g className="vr-head"><g className="vr-react">
        {style === "braid" && <path d="M-30 -270C-40 -300 40 -300 30 -270Z" fill={hair} />}
        <circle cx="-31" cy="-252" r="7" fill={skd} />
        <circle cx="31" cy="-252" r="7" fill={skd} />
        <ellipse cx="0" cy="-254" rx="31" ry="35" fill={skin} />
        {/* бет */}
        <g className="vr-eyes">
          <ellipse cx="-11" cy="-256" rx="3.4" ry="4.4" fill={C.ink} />
          <ellipse cx="11" cy="-256" rx="3.4" ry="4.4" fill={C.ink} />
          <circle cx="-10" cy="-258" r="1.1" fill="#fff" />
          <circle cx="12" cy="-258" r="1.1" fill="#fff" />
        </g>
        <path className="vr-brow" d={f ? "M-18 -266Q-11 -270-5 -266M5 -266Q11 -270 18 -266" : "M-19 -265Q-11 -271-4 -266M4 -266Q11 -271 19 -265"} fill="none" stroke={o.old && h % 2 ? "#8E877C" : hair} strokeWidth={f ? 2.4 : 3.6} strokeLinecap="round" />
        <path d="M1 -251Q5 -244-1 -242" fill="none" stroke={skd} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="-19" cy="-242" r="6" fill="#E07B6A" opacity=".3" />
        <circle cx="19" cy="-242" r="6" fill="#E07B6A" opacity=".3" />
        <path className="vr-smile" d="M-8 -233Q0 -226 8 -233" fill="none" stroke="#7A2A22" strokeWidth="2.6" strokeLinecap="round" />
        <path className="vr-grin" d="M-11 -235Q0 -233 11 -235Q9 -223 0 -223Q-9 -223-11 -235Z" fill="#7A2A22" />
        <path className="vr-grin" d="M-8 -233.6Q0 -232.4 8 -233.6V-231H-8Z" fill="#fff" />
        <path className="vr-hmm" d="M-7 -230Q-2 -234 3 -231T9 -232" fill="none" stroke="#7A2A22" strokeWidth="2.6" strokeLinecap="round" />
        <ellipse className="vr-mouth" cx="0" cy="-231" rx="6" ry="3.6" fill="#7A2A22" />
        {o.tache && <path d="M-13 -236Q-6 -242 0 -237Q6 -242 13 -236Q6 -232 0 -235Q-6 -232-13 -236Z" fill={hair} />}
        {o.glasses && (
          <g fill="none" stroke={C.ink} strokeWidth="2">
            <circle cx="-12" cy="-256" r="8.5" />
            <circle cx="12" cy="-256" r="8.5" />
            <path d="M-3.5 -257h7" />
          </g>
        )}
        {/* шаш / бас киім */}
        {style === "short" && <path d="M-32 -258C-37 -300 37 -300 32 -258C28 -276 14 -283 0 -281C-14 -283-28 -276-32 -258Z" fill={hair} />}
        {(style === "long" || style === "braid") && <path d="M-33 -256C-35 -298 35 -298 33 -256C24 -278 6 -278 0 -268C-8 -279-26 -276-33 -256Z" fill={hair} />}
        {style === "bun" && <path d="M-33 -256C-36 -299 36 -299 33 -256C26 -278-26 -278-33 -256Z" fill={hair} />}
        {style === "braid" && (
          <g>
            {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={30 + i * 2.4} cy={-236 + i * 15} rx="8" ry="9" fill={hair} />)}
            <circle cx="42" cy="-160" r="6" fill={C.gold} />
            <path d="M38 -154l-2 8M42 -154v9M46 -154l2 8" stroke={C.gold} strokeWidth="2" />
          </g>
        )}
        {style === "scarf" && (
          <g>
            <path d="M-41 -250C-47 -308 47 -308 41 -250C39 -226 31 -212 22 -208L20 -240C16 -276-16 -276-20 -240L-22 -208C-31 -212-39 -226-41 -250Z" fill={o.scarf} />
            <path d="M-34 -258C-34 -294 34 -294 34 -258" fill="none" stroke={o.scarf === C.surf ? "#D7CDB8" : ST} strokeWidth="1.6" strokeDasharray="4 4" />
            {[[-26, -280], [0, -292], [26, -280], [-34, -246], [34, -246]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r="2.4" fill={o.scarf === C.surf ? C.red : C.goldS} />)}
            <path d="M36 -222l14 10-4 14-12-10Z" fill={o.scarf} />
          </g>
        )}
        {style === "cap" && (
          <g>
            <rect x="-34" y="-262" width="8" height="16" rx="3" fill={hair} />
            <rect x="26" y="-262" width="8" height="16" rx="3" fill={hair} />
            <path d="M-34 -262C-34 -302 34 -302 34 -262Z" fill={o.cap} />
            <path d="M-34 -266C-10 -274 30 -272 50 -261C30 -256-10 -258-34 -262Z" fill={C.ink} opacity=".85" />
            <path d="M-32 -270H32" stroke={C.gold} strokeWidth="3" />
            <circle cx="0" cy="-284" r="4" fill={C.gold} />
          </g>
        )}
        {style === "taqiya" && (
          <g>
            <path d="M-32 -258C-37 -290 37 -290 32 -258C28 -270 14 -274 0 -272C-14 -274-28 -270-32 -258Z" fill={hair} />
            <path d="M-29 -272C-28 -302 28 -302 29 -272C10 -277-10 -277-29 -272Z" fill={C.red} />
            <Horn x={0} y={-284} s={0.42} c={C.gold} w={1.6} />
            <path d="M-28 -274C-10 -279 10 -279 28 -274" fill="none" stroke={C.gold} strokeWidth="2" />
          </g>
        )}
        </g></g>
        {/* реакция белгілері: «?» (қате) және ұшқын (дұрыс) */}
        <g transform="translate(58 -312)"><g className="vr-q">
          <circle r="17" fill={C.surf} stroke={C.gold} strokeWidth="2.5" />
          <circle r="12" fill="none" stroke={STD} strokeWidth="1.2" strokeDasharray="3 3" />
          <path d="M-5 -4Q-5 -10 0 -10Q6 -10 6 -5Q6 -1 1 1V4" fill="none" stroke={C.deep} strokeWidth="3.4" strokeLinecap="round" />
          <circle cy="9.5" r="2.2" fill={C.deep} />
        </g></g>
        <g className="vr-spark">
          {[[-58, -300, 1], [56, -318, 1.3], [64, -268, 0.8], [-48, -332, 0.7]].map(([a, b, k], i) => (
            <path key={i} transform={`translate(${a} ${b}) scale(${k})`} d="M0 -12Q2 -2 12 0Q2 2 0 12Q-2 2-12 0Q-2 -2 0 -12Z" fill={i % 2 ? C.gold2 : C.gold} />
          ))}
        </g>
        {o.steth && (
          <g fill="none" stroke="#5F6470" strokeWidth="3.4">
            <path d="M-17 -208C-22 -170-10 -150 0 -150C10 -150 22 -170 17 -208" />
            <circle cx="0" cy="-146" r="6" fill="#9AA0A8" stroke="none" />
          </g>
        )}
        {/* оң қол */}
        {phone ? (
          <g>
            <path d="M60 -196C86 -170 78 -226 44 -244" fill="none" stroke={top} strokeWidth="24" strokeLinecap="round" />
            <rect x="26" y="-280" width="15" height="40" rx="5" fill={C.ink} transform="rotate(12 33 -260)" />
            <circle cx="42" cy="-246" r="11" fill={skin} />
          </g>
        ) : (
          <g className="vr-arm">
            <path d="M60 -196C82 -180 86 -150 68 -134C58 -126 44 -128 34 -134" fill="none" stroke={top} strokeWidth="24" strokeLinecap="round" />
            {o.pad && <rect x="6" y="-170" width="30" height="38" rx="3" fill={C.surf} stroke="#D2CBBB" strokeWidth="2" transform="rotate(-10 20 -150)" />}
            <circle cx="30" cy="-136" r="11" fill={skin} />
          </g>
        )}
      </g>
    </g>
  );
}

/* ═════════════ 16 орын ═════════════ */
// Әр орын: back, mid, front және кейіпкердің орны {x, y, s}
const ART = {
  shop: () => ({
    npc: { x: 520, y: 470, s: 1 },
    back: (
      <>
        <rect x="-40" y="-40" width="880" height="530" fill="#F1E4C6" />
        <Band y={14} />
        {[128, 212].map((sy, r) => (
          <g key={sy}>
            {[[24, 330], [610, 800]].map(([a, b]) => (
              <g key={a}>
                <rect x={a} y={sy} width={b - a} height="12" rx="3" fill={C.wood2} />
                {Array.from({ length: Math.floor((b - a - 10) / 46) }, (_, i) => {
                  const ix = a + 10 + i * 46;
                  const kind = (i + r) % 4;
                  return kind === 0 ? (
                    <g key={i}><rect x={ix} y={sy - 50} width="34" height="50" rx="6" fill="#E8D9B2" /><rect x={ix + 4} y={sy - 58} width="26" height="10" rx="3" fill={C.red} /><rect x={ix + 6} y={sy - 34} width="22" height="16" rx="2" fill={C.gold} /></g>
                  ) : kind === 1 ? (
                    <g key={i}><rect x={ix} y={sy - 44} width="38" height="44" rx="3" fill={C.blue} /><rect x={ix + 6} y={sy - 32} width="26" height="10" fill={C.goldS} /></g>
                  ) : kind === 2 ? (
                    <g key={i}><ellipse cx={ix + 19} cy={sy - 16} rx="20" ry="15" fill="#C98A3E" /><path d={`M${ix + 8} ${sy - 22}q10-6 22 0`} stroke="#E8B871" strokeWidth="3" fill="none" /></g>
                  ) : (
                    <g key={i}><rect x={ix + 4} y={sy - 58} width="14" height="58" rx="5" fill={C.green} /><rect x={ix + 22} y={sy - 52} width="14" height="52" rx="5" fill="#C8392E" /></g>
                  );
                })}
                <rect x={a + 14} y={sy + 12} width="26" height="14" rx="2" fill={C.surf} stroke={C.red} strokeWidth="1.5" />
              </g>
            ))}
          </g>
        ))}
        <rect x="-40" y="300" width="880" height="200" fill="#D9C29A" />
      </>
    ),
    mid: <Lamp x={250} y={36} len={40} c={C.red} />,
    front: (
      <>
        <R x={-30} y={316} w={860} h={24} r={4} c={C.wood3} sh={C.wood2} st={null} />
        <rect x="-30" y="340" width="860" height="140" fill={C.red} />
        <rect x="-20" y="350" width="840" height="120" fill="none" stroke={ST} strokeWidth="1.6" strokeDasharray="5 5" />
        {[60, 220, 380, 540, 700].map((x) => <Horn key={x} x={x + 40} y={398} s={1.5} c={C.gold} w={2.6} />)}
        <g>
          <R x={110} y={256} w={120} h={64} r={8} c="#3F4A5C" sh={C.ink} st={null} />
          <rect x="124" y="266" width="92" height="26" rx="4" fill="#B9E3C9" />
          <text x="132" y="285" fontSize="16" fontWeight="700" fill={C.green} fontFamily="'Golos Text', sans-serif">1 250 ₸</text>
        </g>
        <g>
          <rect x="630" y="296" width="110" height="22" rx="6" fill={C.grey} />
          <path d="M640 296c10-30 80-30 90 0Z" fill={C.surf} />
          <Pile x={685} y={282} n={2} r={11} c="#C8392E" c2="#7EA548" />
        </g>
      </>
    ),
  }),
  bazaar: () => ({
    npc: { x: 520, y: 470, s: 1 },
    back: (
      <>
        <rect x="-40" y="-40" width="880" height="530" fill={C.sky} />
        <circle cx="120" cy="70" r="34" fill={C.gold2} />
        <circle cx="120" cy="70" r="44" fill="none" stroke={C.gold2} strokeWidth="3" strokeDasharray="6 8" />
        <Mountains y={200} />
        <g className="vr-fly"><path d="M300 60q8-8 16 0q8-8 16 0" fill="none" stroke={C.thread} strokeWidth="2.5" /></g>
        <rect x="-40" y="230" width="880" height="260" fill="#E6D3A8" />
      </>
    ),
    mid: (
      <>
        {[[-10, 270, C.red], [620, 830, C.blue]].map(([a, b, c]) => (
          <g key={a}>
            <rect x={a + 10} y="120" width="8" height="200" fill={C.wood2} /><rect x={b - 18} y="120" width="8" height="200" fill={C.wood2} />
            <path d={`M${a} 110H${b}l-10 40H${a + 10}Z`} fill={c} />
            {Array.from({ length: Math.floor((b - a) / 40) }, (_, i) => <path key={i} d={`M${a + 10 + i * 40} 150h20v14q-10 10-20 0Z`} fill={i % 2 ? c : C.surf} />)}
            <R x={a + 20} y={250} w={b - a - 40} h={60} r={4} c={C.wood} sh={C.wood2} />
            <Pile x={a + 70} y={240} n={3} r={12} c="#E6702E" />
            <Pile x={a + 170} y={240} n={3} r={12} c="#7EA548" c2="#A8C45A" />
          </g>
        ))}
        <g className="vr-flutter">
          <path d="M360 86H680l-12 46H372Z" fill={C.gold} />
          {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${372 + i * 37} 132h20v14q-10 10-20 0Z`} fill={i % 2 ? C.gold : C.red} />)}
          <path d="M380 96H660" stroke={C.deep} strokeWidth="2" strokeDasharray="5 4" />
        </g>
        <rect x="372" y="132" width="8" height="190" fill={C.wood2} /><rect x="662" y="132" width="8" height="190" fill={C.wood2} />
        <path d="M390 160q40 20 80 0" fill="none" stroke={C.thread} strokeWidth="2" />
        {[400, 418, 436, 454].map((x, i) => <path key={x} d={`M${x} ${166 + (i % 2) * 3}q4 18 0 26`} stroke="#C8392E" strokeWidth="7" strokeLinecap="round" />)}
      </>
    ),
    front: (
      <>
        <rect x="-30" y="318" width="860" height="170" fill={C.wood} />
        <path d="M-30 318H830" stroke={C.wood2} strokeWidth="8" />
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${-30 + i * 150} 330v150`} stroke={C.wood2} strokeWidth="4" />)}
        <path d="M-20 346H820M-20 400H820" stroke={STD} strokeWidth="1.5" strokeDasharray="6 5" />
        <Pile x={120} y={308} n={4} r={13} c="#C8392E" c2="#E14F3C" />
        <ellipse cx="330" cy="300" rx="48" ry="30" fill="#6E9C42" />
        <path d="M290 296q40-24 80 0M300 312q30-14 60 0" stroke="#A9C873" strokeWidth="4" fill="none" />
        <ellipse cx="420" cy="306" rx="38" ry="24" fill="#E3B341" />
        <path d="M388 302q32-18 64 0" stroke="#F4D27A" strokeWidth="3" fill="none" />
        <Pile x={690} y={306} n={3} r={12} c="#E6702E" c2="#F09A3E" />
      </>
    ),
  }),
  school: () => ({
    npc: { x: 520, y: 450, s: 1 },
    back: (
      <>
        <rect x="-40" y="-40" width="880" height="530" fill="#DCE8E0" />
        <rect x="-40" y="300" width="880" height="200" fill="#B99B70" />
        <path d="M-40 300H840" stroke={C.wood2} strokeWidth="6" />
        <R x={50} y={60} w={330} h={190} r={6} c={C.wood2} st={null} sh="rgba(58,34,16,.25)" />
        <rect x="62" y="72" width="306" height="166" rx="4" fill="#2F5D4A" />
        <Chalk x={84} y={120} size={30}>Сәлем!</Chalk>
        <Chalk x={84} y={160} size={20}>Мен — оқушымын.</Chalk>
        <Chalk x={84} y={196} size={20}>А Ә Б В Г Ғ</Chalk>
        <rect x="290" y="232" width="40" height="8" rx="3" fill="#F4F1E6" />
        <Clock x={460} y={70} r={24} />
        <R x={620} y={70} w={150} h={120} r={6} c={C.surf} sh="rgba(58,34,16,.18)" />
        <path d="M640 120c14-20 40-24 60-16s36 4 52 14c-4 24-20 40-40 44s-36-6-52-6-26-14-20-36Z" fill="#9DBF8E" />
        <circle cx="690" cy="128" r="5" fill={C.red} />
        <path d="M640 92h40" stroke={C.ink} strokeWidth="3" />
      </>
    ),
    mid: (
      <>
        <R x={600} y={296} w={190} h={24} r={4} c={C.wood3} sh={C.wood2} st={null} />
        <rect x="610" y="320" width="14" height="110" fill={C.wood2} /><rect x="766" y="320" width="14" height="110" fill={C.wood2} />
        <circle cx="660" cy="262" r="26" fill="#6FA3C0" />
        <path d="M640 252c8-6 18-2 22 6s14 6 18 0M646 274c8-2 14 4 20 2" stroke="#9DBF8E" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M660 288v8M644 298h32" stroke={C.wood2} strokeWidth="5" />
        <rect x="712" y="264" width="54" height="12" rx="2" fill={C.red} /><rect x="716" y="276" width="48" height="12" rx="2" fill={C.blue} /><rect x="710" y="288" width="58" height="10" rx="2" fill={C.gold} />
      </>
    ),
    front: (
      <>
        <path d="M-40 392L40 372H760L840 392V490H-40Z" fill={C.wood3} />
        <path d="M-40 392L40 372H760L840 392" stroke={C.wood2} strokeWidth="6" fill="none" />
        <path d="M200 420l20-34h170l10 34Z" fill={C.surf} />
        <path d="M300 386v34" stroke="#D2CBBB" strokeWidth="2" />
        {[396, 404, 412].map((y) => <path key={y} d={`M226 ${y}h64M312 ${y}h80`} stroke="#9CB4C8" strokeWidth="1.6" />)}
        <path d="M430 418l90-30" stroke={C.gold} strokeWidth="8" strokeLinecap="round" />
        <path d="M520 388l10-3" stroke={C.thread} strokeWidth="8" strokeLinecap="round" />
      </>
    ),
  }),
  airport: () => ({
    npc: { x: 520, y: 470, s: 1 },
    back: (
      <>
        <rect x="-40" y="-40" width="880" height="300" fill="#D5E9F0" />
        <Cloud x={420} y={50} s={1.4} />
        <rect x="-40" y="200" width="880" height="60" fill="#A9B7A0" />
        <path d="M-40 230H840" stroke="#fff" strokeWidth="3" strokeDasharray="30 20" />
        <g className="vr-pass slow"><Plane x={-260} y={130} s={0.9} /></g>
        <Wall c="#E9E4D8" list={[{ x: 380, y: 30, w: 440, h: 200 }]} />
        <Frame x={380} y={30} w={440} h={200} cols={4} c="#8E9AA6" />
        <Board x={40} y={40} w={290} h={150} rows={4} head="Ұшу · Departures" />
      </>
    ),
    mid: (
      <>
        <R x={420} y={110} w={200} h={40} r={6} c={C.blue} sh={C.blue2} st={ST} />
        <Chalk x={446} y={137} size={17} c="#fff">Тіркеу · 12</Chalk>
        <rect x="518" y="70" width="4" height="40" fill="#8E9AA6" />
        <rect x="640" y="296" width="200" height="22" rx="6" fill="#5F6470" />
        {[650, 690, 730, 770, 810].map((x) => <circle key={x} cx={x} cy="307" r="6" fill="#3F4A5C" />)}
        <R x={672} y={232} w={92} h={64} r={10} c={C.red} sh={C.deep} />
        <path d="M700 232v-14h36v14" fill="none" stroke={C.thread} strokeWidth="5" />
        <rect x="672" y="258" width="92" height="6" fill={C.gold} />
      </>
    ),
    front: (
      <>
        <R x={-30} y={318} w={660} h={22} r={4} c="#E9E7E1" sh="#B8B2A4" st={null} />
        <rect x="-30" y="340" width="660" height="140" fill={C.blue} />
        <rect x="-30" y="356" width="660" height="10" fill={C.gold} />
        <rect x="-20" y="374" width="640" height="96" fill="none" stroke={ST} strokeWidth="1.5" strokeDasharray="5 5" />
        <R x={630} y={330} w={200} h={150} r={0} c="#3F4A5C" st={null} />
        <g transform="rotate(-8 230 300)">
          <rect x="200" y="282" width="56" height="74" rx="6" fill={C.deep} />
          <circle cx="228" cy="312" r="12" fill="none" stroke={C.gold} strokeWidth="3" />
          <rect x="270" y="292" width="92" height="40" rx="4" fill={C.surf} />
          <rect x="280" y="302" width="40" height="6" fill={C.blue} /><rect x="280" y="314" width="62" height="5" fill="#9AA0A8" />
        </g>
      </>
    ),
  }),
  station: () => ({
    npc: { x: 520, y: 470, s: 1 },
    back: (
      <>
        <rect x="-40" y="-40" width="880" height="530" fill="#D5E9F0" />
        <rect x="-40" y="190" width="880" height="80" fill="#B9AE98" />
        <g className="vr-pass"><Train x={-620} y={196} s={0.8} /></g>
        <Wall c="#E8D9BC" list={[{ d: "M40 230V120a110 90 0 0 1 220 0V230Z" }]} />
        <path d="M40 230V120a110 90 0 0 1 220 0V230" fill="none" stroke={C.deep} strokeWidth="10" />
        <path d="M150 34V230M40 140H260" stroke={C.deep} strokeWidth="5" />
        <Band y={0} h={20} />
        <Board x={600} y={50} w={190} h={130} rows={3} head="Пойыздар" />
        <rect x="-40" y="320" width="880" height="200" fill="#CDBB98" />
      </>
    ),
    mid: (
      <>
        <rect x="340" y="320" width="380" height="20" fill={C.wood2} />
        <Clock x={160} y={262} r={26} rim={C.deep} />
        <path d="M160 232V214" stroke={C.deep} strokeWidth="5" />
      </>
    ),
    front: (
      <>
        <path d="M330 30H730V490H330Z M370 120H690V318H370Z" fill="#C9A36D" fillRule="evenodd" />
        <path d="M330 30V490M730 30V490" stroke={C.wood2} strokeWidth="6" />
        <path d="M370 120H690V318H370Z" fill="#DCEFF3" opacity=".2" />
        <path d="M400 140l60-16M400 168l110-30" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".55" />
        <rect x="358" y="108" width="344" height="222" rx="8" fill="none" stroke={C.wood2} strokeWidth="14" />
        <R x={420} y={60} w={220} h={40} r={6} c={C.deep} sh="#5E140F" />
        <Chalk x={446} y={87} size={17} c={C.goldS}>Билет кассасы</Chalk>
        <circle cx="530" cy="268" r="20" fill="none" stroke={C.wood2} strokeWidth="3" />
        {[-8, 0, 8].map((d) => <path key={d} d={`M${522} ${268 + d}h16`} stroke={C.wood2} strokeWidth="2" />)}
        <R x={330} y={326} w={400} h={26} r={4} c={C.wood3} sh={C.wood2} st={null} />
        <rect x="480" y="330" width="100" height="10" rx="4" fill={C.wood2} />
        <path d="M344 380H716" stroke={STD} strokeWidth="1.6" strokeDasharray="6 5" />
        {[440, 620].map((x) => <Horn key={x} x={x} y={420} s={1.4} c={C.wood2} w={2.4} />)}
      </>
    ),
  }),
  taxi: () => ({
    npc: { x: 290, y: 500, s: 1.05 },
    back: (
      <>
        <rect x="-40" y="-40" width="880" height="530" fill={C.sky} />
        <g className="vr-pass slow"><City x={-400} y={210} w={1600} seed={5} /></g>
        <rect x="-40" y="200" width="880" height="80" fill="#8E949C" />
        <path d="M-40 236H840" stroke="#fff" strokeWidth="4" strokeDasharray="40 30" />
        <g className="vr-pass"><Car x={-220} y={226} s={0.7} c={C.gold} /></g>
        <Wall c="#3B3A3F" list={[{ d: "M60 30Q400 0 760 30L800 250H20Z" }]} />
        <path d="M60 30Q400 0 760 30L800 250H20Z" fill="none" stroke="#2A292E" strokeWidth="10" />
      </>
    ),
    mid: (
      <>
        <rect x="400" y="24" width="80" height="22" rx="8" fill="#2A292E" />
        <rect x="406" y="28" width="68" height="14" rx="5" fill="#9FB7C2" />
        <g className="vr-sway">
          <path d="M440 46V96" stroke={C.gold} strokeWidth="2" />
          <Horn x={440} y={110} s={0.8} c={C.red} w={3} />
          <circle cx="440" cy="102" r="5" fill={C.gold} />
        </g>
      </>
    ),
    front: (
      <>
        <path d="M-40 300C120 270 680 270 840 300V490H-40Z" fill="#2E2D33" />
        <path d="M-20 310C130 284 670 284 820 310" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1.6" strokeDasharray="6 5" />
        <circle cx="250" cy="372" r="84" fill="none" stroke="#1C1B20" strokeWidth="18" />
        <path d="M180 380h140M250 380v60" stroke="#1C1B20" strokeWidth="16" />
        <circle cx="250" cy="380" r="18" fill={C.deep} />
        <R x={470} y={300} w={150} h={84} r={10} c="#1C1B20" st={null} />
        <rect x="480" y="310" width="130" height="64" rx="6" fill="#244F5C" />
        <path d="M494 360c20-30 40 0 60-24s30-10 40-16" fill="none" stroke={C.gold2} strokeWidth="4" strokeLinecap="round" />
        <circle cx="594" cy="320" r="6" fill={C.red} />
        <rect x="660" y="330" width="110" height="34" rx="6" fill="#1C1B20" />
        <text x="672" y="354" fontSize="18" fontWeight="700" fill="#7FD0A7" fontFamily="'Golos Text', sans-serif">1 800 ₸</text>
      </>
    ),
  }),
  hotel: () => ({
    npc: { x: 520, y: 470, s: 1 },
    back: (
      <>
        <rect x="-40" y="-40" width="880" height="530" fill="#F0E2CF" />
        <rect x="-40" y="240" width="880" height="260" fill={C.deep} />
        <Band y={240} h={18} c={C.deep} />
        {[["Астана", 110], ["Стамбұл", 210], ["Пекин", 310]].map(([n, x], i) => (
          <g key={n}>
            <Clock x={x} y={90} r={28} rim={C.wood2} />
            <Chalk x={x - 26} y={146} size={13} c={C.thread}>{n}</Chalk>
          </g>
        ))}
        <R x={590} y={70} w={180} h={150} r={8} c={C.wood} sh={C.wood2} />
        {[0, 1, 2].map((r) => [0, 1, 2, 3].map((cIdx) => (
          <g key={r + "-" + cIdx}>
            <circle cx={618 + cIdx * 42} cy={96 + r * 42} r="3" fill={C.thread} />
            <path d={`M${618 + cIdx * 42} ${99 + r * 42}v10`} stroke={C.gold} strokeWidth="3" />
            {(r + cIdx) % 3 !== 1 && <rect x={612 + cIdx * 42} y={110 + r * 42} width="12" height="8" rx="2" fill={C.goldS} />}
          </g>
        )))}
      </>
    ),
    mid: <Plant x={70} y={330} s={1.1} pot={C.blue} />,
    front: (
      <>
        <R x={-30} y={314} w={860} h={26} r={4} c="#EDE6DA" sh="#C9C0AE" st={null} />
        <rect x="-30" y="340" width="860" height="140" fill="#6B3B1F" />
        <path d="M-20 352H820M-20 470H820" stroke={C.gold} strokeWidth="2" strokeDasharray="5 4" />
        {[80, 240, 400, 560, 720].map((x) => <Horn key={x} x={x} y={412} s={1.6} c={C.gold} w={2.6} />)}
        <g>
          <ellipse cx="660" cy="312" rx="30" ry="6" fill="#8E6A1A" />
          <path d="M634 310c0-26 52-26 52 0Z" fill={C.gold} />
          <circle cx="660" cy="282" r="5" fill={C.gold} />
          <path d="M644 300q6-10 14-12" stroke="#FBE6A6" strokeWidth="3" fill="none" />
        </g>
        <g transform="rotate(-4 220 300)">
          <rect x="150" y="286" width="150" height="26" rx="3" fill={C.surf} />
          <path d="M225 288v22" stroke="#C9C0AE" strokeWidth="2" />
          {[294, 300, 306].map((y) => <path key={y} d={`M160 ${y}h54M236 ${y}h54`} stroke="#9AA0A8" strokeWidth="1.4" />)}
        </g>
      </>
    ),
  }),
  cafe: () => ({
    npc: { x: 590, y: 480, s: 1.02 },
    back: (
      <>
        <rect x="-40" y="-40" width="880" height="300" fill={C.sky} />
        <City x={40} y={230} w={300} seed={2} />
        <rect x="40" y="200" width="300" height="60" fill="#8E949C" />
        <g className="vr-pass"><Bus x={-240} y={238} s={0.8} /></g>
        <Wall c="#F0DCC4" list={[{ x: 50, y: 60, w: 260, h: 180 }]} />
        <Frame x={50} y={60} w={260} h={180} cols={2} rows={2} c={C.wood2} />
        <R x={620} y={60} w={150} h={150} r={6} c="#2F3A36" sh={C.ink} st={null} />
        <Chalk x={640} y={92} size={20} c={C.goldS}>Мәзір</Chalk>
        {[["Шай", "300"], ["Кофе", "800"], ["Бауырсақ", "500"]].map(([n, p], i) => (
          <g key={n}>
            <Chalk x={640} y={124 + i * 26} size={15}>{n}</Chalk>
            <Chalk x={724} y={124 + i * 26} size={15}>{p}</Chalk>
          </g>
        ))}
        <rect x="-40" y="320" width="880" height="200" fill="#C99F72" />
      </>
    ),
    mid: (
      <>
        <Lamp x={420} y={0} len={50} c={C.blue} />
        <Lamp x={760} y={0} len={30} c={C.red} />
      </>
    ),
    front: (
      <>
        <ellipse cx="360" cy="470" rx="440" ry="110" fill="#E9DDC7" />
        <ellipse cx="360" cy="462" rx="440" ry="110" fill={C.surf} />
        <ellipse cx="360" cy="462" rx="420" ry="98" fill="none" stroke={C.red} strokeWidth="5" strokeDasharray="14 8" />
        <Teapot x={170} y={378} s={1} />
        <Steam x={240} y={340} s={0.9} />
        <Kese x={320} y={408} />
        <Steam x={316} y={392} s={0.7} />
        <Kese x={470} y={418} c={C.red} />
        <Baursak x={400} y={386} s={0.9} />
      </>
    ),
  }),
  pharmacy: () => ({
    npc: { x: 520, y: 470, s: 1 },
    back: (
      <>
        <rect x="-40" y="-40" width="880" height="530" fill="#E3EFEA" />
        <g className="vr-glow">
          <rect x="666" y="48" width="68" height="68" rx="12" fill="#2F8F5B" />
          <path d="M692 60h16v16h16v16h-16v16h-16V92h-16V76h16Z" fill="#fff" />
        </g>
        {[110, 190, 270].map((sy, r) => (
          <g key={sy}>
            {[[24, 330], [600, 800]].map(([a, b]) => (
              <g key={a}>
                <rect x={a} y={sy} width={b - a} height="10" rx="3" fill="#B8C9C1" />
                {a !== 600 || sy > 120 ? Array.from({ length: Math.floor((b - a - 10) / 36) }, (_, i) => (
                  <g key={i}>
                    <rect x={a + 8 + i * 36} y={sy - 40 + ((i + r) % 2) * 8} width="30" height={40 - ((i + r) % 2) * 8} rx="3" fill={C.surf} />
                    <rect x={a + 8 + i * 36} y={sy - 26} width="30" height="7" fill={["#2F8F5B", C.blue, C.red, C.gold][(i + r) % 4]} />
                  </g>
                )) : null}
              </g>
            ))}
          </g>
        ))}
      </>
    ),
    mid: null,
    front: (
      <>
        <R x={-30} y={316} w={860} h={24} r={4} c="#F7F7F2" sh="#C9CFC9" st={null} />
        <rect x="-30" y="340" width="860" height="140" fill="#2F8F5B" />
        <rect x="-30" y="352" width="860" height="8" fill={C.surf} opacity=".5" />
        <path d="M-20 372H820" stroke={ST} strokeWidth="1.6" strokeDasharray="6 5" />
        {[140, 400, 660].map((x) => <path key={x} d={`M${x - 8} 400h16v16h16v16h-16v16h-16v-16h-16v-16h16Z`} fill="#fff" opacity=".85" />)}
        <g>
          <rect x="150" y="270" width="34" height="48" rx="6" fill="#E46B5E" /><rect x="148" y="262" width="38" height="12" rx="3" fill={C.surf} />
          <rect x="196" y="282" width="56" height="36" rx="3" fill={C.surf} /><rect x="196" y="294" width="56" height="8" fill={C.blue} />
          <R x={650} y={264} w={60} h={54} r={8} c="#3F4A5C" st={null} />
          <rect x="660" y="274" width="40" height="16" rx="3" fill="#B9E3C9" />
        </g>
      </>
    ),
  }),
  clinic: () => ({
    npc: { x: 510, y: 505, s: 1 },
    back: (
      <>
        <rect x="-40" y="-40" width="880" height="530" fill="#CFE6EC" />
        <circle cx="690" cy="130" r="50" fill={C.leaf} />
        <rect x="684" y="150" width="12" height="90" fill={C.wood2} />
        <g className="vr-sway up"><circle cx="660" cy="110" r="26" fill={C.leaf2} /><circle cx="720" cy="104" r="30" fill={C.leaf2} /></g>
        <Wall c="#DDE9EE" list={[{ x: 600, y: 50, w: 170, h: 170 }]} />
        <Frame x={600} y={50} w={170} h={170} cols={2} c="#9FB4BE" />
        <R x={60} y={50} w={130} h={200} r={4} c={C.surf} sh="rgba(58,34,16,.15)" st={null} />
        {[["Ш Б", 30, 96], ["М Н К", 22, 132], ["Ы Б Ш М", 16, 164], ["Б Ы Н К Ш", 12, 192], ["Н К Ы Б М Ш", 10, 216]].map(([t, s, y]) => (
          <text key={t} x="125" y={y} fontSize={s} fontWeight="700" textAnchor="middle" fill={C.ink} fontFamily="'Golos Text', sans-serif">{t}</text>
        ))}
        <Clock x={330} y={80} r={24} rim="#5B87A8" />
        <rect x="-40" y="290" width="880" height="200" fill="#B8CCD3" />
      </>
    ),
    mid: <R x={250} y={150} w={150} h={150} r={6} c={C.surf} sh="#B8C4C8" />,
    front: (
      <>
        <R x={-30} y={330} w={860} h={26} r={4} c="#E8D8BC" sh={C.wood} st={null} />
        <rect x="-30" y="356" width="860" height="140" fill={C.wood3} />
        <path d="M-20 370H820" stroke={STD} strokeWidth="1.6" strokeDasharray="6 5" />
        <rect x="620" y="240" width="140" height="90" rx="8" fill="#5F6470" />
        <rect x="676" y="330" width="28" height="6" fill="#5F6470" />
        <g transform="rotate(5 230 322)">
          <rect x="160" y="304" width="110" height="26" rx="2" fill={C.surf} />
          {[310, 316, 322].map((y) => <path key={y} d={`M170 ${y}h80`} stroke="#9AA0A8" strokeWidth="1.4" />)}
        </g>
        <path d="M340 324c20-20 60-20 60 0s-40 10-50 0" fill="none" stroke="#5F6470" strokeWidth="4" />
        <circle cx="402" cy="326" r="8" fill="#9AA0A8" />
        <rect x="470" y="296" width="30" height="34" rx="4" fill={C.blue} />
        <path d="M478 296l-4-22M490 296l6-24" stroke={C.red} strokeWidth="3" />
      </>
    ),
  }),
  bank: () => ({
    npc: { x: 520, y: 470, s: 1 },
    back: (
      <>
        <rect x="-40" y="-40" width="880" height="530" fill="#E6E1D3" />
        {[30, 760].map((x) => (
          <g key={x}><rect x={x} y="0" width="34" height="320" fill="#D7D0BE" /><rect x={x - 6} y="0" width="46" height="16" fill="#C9C0AE" /></g>
        ))}
        <R x={90} y={60} w={230} h={160} r={6} c={C.navy} sh={C.ink} st={null} />
        <Chalk x={108} y={86} size={14} c={C.goldS}>Валюта бағамы</Chalk>
        {[["USD", "512"], ["EUR", "548"], ["RUB", "5,6"], ["CNY", "71"]].map(([n, v], i) => (
          <g key={n} className={i % 2 ? "vr-blink b2" : "vr-blink"}>
            <Chalk x={110} y={118 + i * 26} size={16} c="#F2B544">{n}</Chalk>
            <Chalk x={230} y={118 + i * 26} size={16} c="#7FD0A7">{v}</Chalk>
          </g>
        ))}
        <R x={420} y={40} w={200} h={46} r={6} c={C.ink} st={null} />
        <g className="vr-blink"><text x="520" y="73" textAnchor="middle" fontSize="24" fontWeight="800" fill="#F2B544" fontFamily="'Golos Text', sans-serif">A-012 → 3</text></g>
      </>
    ),
    mid: null,
    front: (
      <>
        <path d="M380 110H660V316H380Z" fill="#DCEFF3" opacity=".22" />
        <path d="M400 130l70-18M400 160l130-34" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".5" />
        <rect x="374" y="104" width="292" height="218" rx="6" fill="none" stroke="#8E9AA6" strokeWidth="10" />
        <R x={-30} y={316} w={860} h={26} r={4} c="#ECE8DE" sh="#B8B2A4" st={null} />
        <rect x="-30" y="342" width="860" height="140" fill="#174A55" />
        <path d="M-30 356H830" stroke={C.gold} strokeWidth="3" />
        <path d="M-20 372H820" stroke={ST} strokeWidth="1.5" strokeDasharray="6 5" />
        <text x="140" y="440" fontSize="54" fontWeight="800" fill={C.gold} opacity=".8" fontFamily="'Golos Text', sans-serif">₸</text>
        <rect x="470" y="318" width="100" height="14" rx="5" fill="#9AA0A8" />
        <rect x="220" y="300" width="10" height="20" fill="#5F6470" />
        <path d="M225 300l40-30" stroke={C.ink} strokeWidth="5" strokeLinecap="round" />
        <R x={680} y={262} w={64} h={56} r={8} c="#3F4A5C" st={null} />
        <rect x="690" y="272" width="44" height="16" rx="3" fill="#B9E3C9" />
      </>
    ),
  }),
  post: () => ({
    npc: { x: 520, y: 470, s: 1 },
    back: (
      <>
        <rect x="-40" y="-40" width="880" height="530" fill="#DCE3E6" />
        {Array.from({ length: 5 }, (_, r) => Array.from({ length: 6 }, (_, cI) => (
          <g key={r + "-" + cI}>
            <rect x={40 + cI * 50} y={60 + r * 44} width="44" height="38" rx="3" fill={(r + cI) % 5 === 2 ? C.gold : "#B9C3C7"} />
            <circle cx={62 + cI * 50} cy={79 + r * 44} r="3" fill="#5F6470" />
          </g>
        )))}
        <R x={420} y={34} w={200} h={56} r={8} c="#1F4E8C" sh="#153968" />
        <rect x="438" y="46" width="44" height="32" rx="3" fill={C.gold} />
        <path d="M438 46l22 18 22-18" fill="none" stroke={C.deep} strokeWidth="3" />
        <Chalk x={494} y={70} size={20} c="#fff">Пошта</Chalk>
      </>
    ),
    mid: (
      <>
        <rect x="610" y="150" width="190" height="10" fill={C.wood2} />
        <rect x="610" y="240" width="190" height="10" fill={C.wood2} />
        {[[620, 100, 60, 50], [690, 112, 50, 38], [750, 92, 44, 58], [624, 196, 70, 44], [704, 206, 80, 34]].map(([x, y, w, h], i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} rx="3" fill={i % 2 ? "#C79A62" : "#B5864F"} />
            <path d={`M${x + w / 2} ${y}v${h}M${x} ${y + h / 2}h${w}`} stroke="#F4ECDA" strokeWidth="2.5" />
          </g>
        ))}
      </>
    ),
    front: (
      <>
        <R x={-30} y={316} w={860} h={24} r={4} c="#E9E4D8" sh="#B8B2A4" st={null} />
        <rect x="-30" y="340" width="860" height="140" fill="#1F4E8C" />
        <rect x="-30" y="352" width="860" height="8" fill={C.gold} />
        <path d="M-20 372H820" stroke={ST} strokeWidth="1.5" strokeDasharray="6 5" />
        {[100, 360, 620].map((x) => (
          <g key={x}><rect x={x} y="398" width="60" height="40" rx="3" fill={C.gold} opacity=".9" /><path d={`M${x} 398l30 22 30-22`} fill="none" stroke={C.deep} strokeWidth="3" /></g>
        ))}
        <rect x="160" y="300" width="120" height="18" rx="5" fill="#9AA0A8" />
        <rect x="176" y="250" width="88" height="52" rx="3" fill="#C79A62" />
        <path d="M220 250v52M176 276h88" stroke="#F4ECDA" strokeWidth="3" />
        <g transform="rotate(-6 680 300)">
          <rect x="640" y="284" width="90" height="56" rx="3" fill={C.surf} />
          <rect x="706" y="290" width="18" height="22" fill={C.red} />
          <path d="M650 300h40M650 310h30" stroke="#9AA0A8" strokeWidth="2" />
        </g>
      </>
    ),
  }),
  bus: () => ({
    npc: { x: 470, y: 470, s: 1 },
    back: (
      <>
        <rect x="-40" y="-40" width="880" height="530" fill={C.sky} />
        <g className="vr-pass slow"><City x={-600} y={260} w={2000} seed={9} /></g>
        <Wall
          c="#E8E2D2"
          list={[
            { d: "M-30 90L200 120V260L-30 280Z" },
            { d: "M600 120L830 90V280L600 260Z" },
          ]}
        />
        <path d="M-30 90L200 120V260L-30 280ZM600 120L830 90V280L600 260Z" fill="none" stroke="#8E9AA6" strokeWidth="8" />
        <path d="M80 104V270M720 104V270" stroke="#8E9AA6" strokeWidth="6" />
        <path d="M200 120H600V260H200Z" fill="#D9D2C0" />
        <path d="M-40 -40H840L600 120H200Z" fill="#CFC8B6" />
        <R x={290} y={26} w={220} h={44} r={6} c={C.ink} st={null} />
        <Chalk x={304} y={54} size={15} c="#F2B544">Келесі: Орталық базар</Chalk>
        <g className="vr-blink"><circle cx="494" cy="48" r="5" fill="#E46B5E" /></g>
        <path d="M-40 490L200 300H600L840 490Z" fill="#5F6470" />
        <path d="M400 300V490" stroke="#F2B544" strokeWidth="4" strokeDasharray="14 12" />
      </>
    ),
    mid: (
      <>
        <path d="M60 60L340 96M740 60L460 96" stroke="#9AA0A8" strokeWidth="6" />
        {[[110, 66], [180, 76], [250, 84], [550, 84], [620, 76], [690, 66]].map(([x, y], i) => (
          <g key={x} className="vr-sway" style={{ animationDelay: `${i * -0.6}s` }}>
            <path d={`M${x} ${y}v26`} stroke="#5F6470" strokeWidth="3" />
            <path d={`M${x - 10} ${y + 26}l10 18 10-18Z`} fill="none" stroke="#3F4A5C" strokeWidth="4" strokeLinejoin="round" />
          </g>
        ))}
        {[[220, 230, 0.7], [580, 230, 0.7]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s}) ${i ? "scale(-1 1)" : ""}`}>
            <rect x="-70" y="-60" width="70" height="90" rx="12" fill={C.red} />
            <rect x="-62" y="-52" width="54" height="10" rx="3" fill={C.gold} />
          </g>
        ))}
        <rect x="352" y="80" width="10" height="400" fill={C.gold} />
      </>
    ),
    front: (
      <>
        <rect x="660" y="-40" width="18" height="530" fill={C.gold} />
        <rect x="654" y="210" width="30" height="12" rx="4" fill="#B88A1A" />
        <path d="M-40 350C-10 330 220 322 260 340L270 490H-40Z" fill={C.red} />
        <path d="M-20 352C20 338 210 332 248 346" fill="none" stroke={ST} strokeWidth="1.8" strokeDasharray="6 5" />
        <rect x="-40" y="364" width="300" height="12" fill={C.gold} />
        <Horn x={110} y={420} s={1.6} c={C.goldS} w={2.6} />
      </>
    ),
  }),
  guest: () => ({
    npc: { x: 470, y: 476, s: 1.04 },
    back: (
      <>
        <rect x="-40" y="-40" width="880" height="530" fill="#F2E6CE" />
        <R x={140} y={20} w={500} h={270} r={10} c={C.red} sh={C.deep} st={null} />
        <rect x="156" y="36" width="468" height="238" rx="6" fill="none" stroke={C.gold} strokeWidth="10" />
        <rect x="172" y="52" width="436" height="206" rx="4" fill="none" stroke={C.goldS} strokeWidth="2" strokeDasharray="6 5" />
        {[0, 1, 2, 3].map((i) => <Horn key={i} x={210 + i * 120} y={84} s={1.4} c={C.gold} w={3} />)}
        <path d="M390 120l60 40-60 40-60-40Z" fill={C.deep} stroke={C.gold} strokeWidth="4" />
        <Horn x={390} y={168} s={1.1} c={C.goldS} w={2.4} />
        <R x={650} y={190} w={150} h={110} r={6} c={C.wood} sh={C.wood2} />
        <path d="M660 210H790M660 280H790" stroke={C.gold} strokeWidth="4" />
        <circle cx="725" cy="246" r="10" fill={C.gold} />
        {[["#3F7CAC", 176], [C.gold, 160], [C.red, 144], [C.green, 128]].map(([c, y]) => <rect key={y} x="656" y={y} width="140" height="16" rx="6" fill={c} />)}
        <R x={-20} y={40} w={130} h={150} r={6} c="#CFE6EC" st={null} />
        <path d="M45 40v150M-20 115h130" stroke={C.wood2} strokeWidth="6" />
        <rect x="-40" y="300" width="880" height="200" fill="#B5543F" />
      </>
    ),
    mid: (
      <>
        <rect x="200" y="296" width="420" height="36" rx="16" fill={C.gold} />
        <path d="M214 314H606" stroke={C.deep} strokeWidth="2" strokeDasharray="6 5" />
      </>
    ),
    front: (
      <>
        <path d="M-40 376L60 340H740L840 376V490H-40Z" fill={C.surf} />
        <path d="M-10 380L74 352H726L810 380" fill="none" stroke={C.red} strokeWidth="8" />
        <path d="M10 396L88 368H712L790 396" fill="none" stroke={C.gold} strokeWidth="3" strokeDasharray="10 6" />
        <Baursak x={300} y={384} s={1.1} />
        <Teapot x={600} y={356} s={0.9} c={C.blue} />
        <Steam x={470} y={360} s={0.8} />
        <Kese x={470} y={400} s={1} />
        <Kese x={170} y={414} s={1} c={C.red} />
        <Steam x={168} y={396} s={0.7} />
        <g>
          <ellipse cx="700" cy="430" rx="60" ry="18" fill="#D9A658" />
          <ellipse cx="700" cy="426" rx="52" ry="14" fill="#E8BE74" />
          {[-24, 0, 24].map((d) => <circle key={d} cx={700 + d} cy="426" r="3" fill="#B98238" />)}
        </g>
      </>
    ),
  }),
  phone: () => ({
    npc: { x: 540, y: 470, s: 1 },
    back: (
      <>
        <rect x="-40" y="-40" width="880" height="300" fill="#F2D9A6" />
        <circle cx="320" cy="120" r="40" fill={C.gold2} />
        <Mountains y={220} c="#C9A877" c2="#DDBF8C" />
        <Wall c="#E7DCEB" list={[{ x: 230, y: 50, w: 200, h: 170 }]} />
        <Frame x={230} y={50} w={200} h={170} cols={2} c={C.wood2} />
        <rect x="660" y="120" width="140" height="10" fill={C.wood2} />
        {[[670, 72, C.red], [690, 80, C.blue], [708, 66, C.gold], [726, 78, C.green]].map(([x, y, c], i) => <rect key={i} x={x} y={y} width="16" height={120 - y} rx="2" fill={c} />)}
        <Plant x={770} y={118} s={0.5} />
        <rect x="-40" y="320" width="880" height="200" fill="#B99B70" />
        <R x={640} y={250} w={170} h={80} r={8} c="#5B3FA8" sh="#3E2A78" />
      </>
    ),
    mid: <Lamp x={700} y={0} len={60} c={C.gold} />,
    front: (
      <g transform="translate(0 46)">
        <g className="vr-ring">
          <path d="M290 250q30 30 0 60" fill="none" stroke={C.gold} strokeWidth="6" strokeLinecap="round" />
          <path d="M316 228q50 52 0 104" fill="none" stroke={C.gold} strokeWidth="6" strokeLinecap="round" opacity=".7" />
        </g>
        <g transform="rotate(-10 170 380)">
          <R x={80} y={230} w={180} h={300} r={28} c={C.ink} st={null} sh="rgba(0,0,0,.3)" />
          <rect x="94" y="250" width="152" height="250" rx="18" fill="#2C3A4F" />
          <circle cx="170" cy="310" r="30" fill="#5B3FA8" />
          <path d="M152 300a18 18 0 0 1 36 0c0 14-36 14-36 0ZM146 334c6-12 42-12 48 0" fill={C.goldS} />
          <text x="170" y="370" textAnchor="middle" fontSize="18" fontWeight="700" fill="#fff" fontFamily="'Golos Text', sans-serif">00:42</text>
          <circle cx="132" cy="440" r="18" fill="#2F8F5B" />
          <circle cx="208" cy="440" r="18" fill="#C8392E" />
          <path d="M200 440h16" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        </g>
        <path d="M40 520C40 420 60 380 100 372c30-6 50 20 48 40l-8 90 30 30H40Z" fill={SKIN[1]} />
        <path d="M230 360c22 0 30 18 26 34l-10 20" fill="none" stroke={SKIN[1]} strokeWidth="22" strokeLinecap="round" />
      </g>
    ),
  }),
  office: () => ({
    npc: { x: 500, y: 470, s: 1 },
    back: (
      <>
        <rect x="-40" y="-40" width="880" height="300" fill={C.sky} />
        <g className="vr-pass slow"><Cloud x={-200} y={60} s={1.4} /></g>
        <City x={470} y={250} w={330} seed={4} c="#7E9AA8" c2="#9FB7C2" />
        <Wall c="#E4E6E3" list={[{ x: 470, y: 30, w: 330, h: 230 }]} />
        <Frame x={470} y={30} w={330} h={230} cols={3} c="#8E9AA6" />
        <R x={40} y={50} w={330} h={190} r={6} c="#fff" sh="#B8B2A4" st={null} />
        <path d="M70 210H340M70 210V80" stroke={C.ink} strokeWidth="3" />
        {[[90, 50, C.blue], [140, 80, C.gold], [190, 64, C.red], [240, 110, C.green], [290, 96, C.blue]].map(([x, h, c]) => <rect key={x} x={x} y={210 - h} width="30" height={h} fill={c} />)}
        <path d="M90 170L150 140L200 150L260 100L310 110" fill="none" stroke={C.red} strokeWidth="3" strokeDasharray="6 4" />
        <rect x="-40" y="300" width="880" height="200" fill="#9AA0A8" />
      </>
    ),
    mid: <Plant x={420} y={320} s={1} pot={C.blue} />,
    front: (
      <>
        <path d="M-40 380L60 344H740L840 380V490H-40Z" fill="#5A3A22" />
        <path d="M60 344H740" stroke="#7A5233" strokeWidth="6" />
        <path d="M0 386L80 356H720L800 386" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="1.6" strokeDasharray="6 5" />
        <path d="M150 360l20-96h170l20 96Z" fill="#B9BEC4" />
        <path d="M130 360h250l-10 18H140Z" fill="#9AA0A8" />
        <Horn x={255} y={316} s={1.1} c={C.surf} w={2.4} />
        <Kese x={470} y={372} c={C.red} />
        <Steam x={466} y={356} s={0.7} />
        <g transform="rotate(8 620 370)">
          <rect x="570" y="350" width="110" height="40" rx="2" fill={C.surf} />
          <path d="M580 360h70M580 370h50M580 380h80" stroke="#9AA0A8" strokeWidth="2" />
        </g>
      </>
    ),
  }),
};

// Орын тірлігі (қосымша): нан буы, жаңбыр тамшысы, көгершін, қоңырау, қағаз ұшақ…
const Drops = ({ list }) => (
  <g>
    {list.map(([x, y, d], i) => (
      <g key={i} className="vr-drop" style={{ animationDelay: `${-d}s` }}>
        <path d={`M${x} ${y - 16}v14`} stroke="#fff" strokeWidth="2" opacity=".5" strokeLinecap="round" />
        <path d={`M${x} ${y}q-5 9 0 13q5-4 0-13Z`} fill="#fff" stroke="rgba(15,94,122,.45)" strokeWidth="1.2" />
      </g>
    ))}
  </g>
);
const Pigeon = ({ x, y, s = 1, flip = false, delay = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx="0" cy="2" rx="18" ry="3" fill="rgba(58,34,16,.18)" />
    <path d="M-16 -10Q-22 -12-26 -6L-14 -4Z" fill="#6F7686" />
    <path d="M-16 -8C-14 -22 6 -24 14 -14L10 0H-10Z" fill="#9AA1AF" />
    <path d="M-8 -14C-2 -18 6 -16 8 -10" fill="none" stroke="#6F7686" strokeWidth="3" strokeLinecap="round" />
    <path d="M-2 0v4M4 0v4" stroke="#C0563C" strokeWidth="2" strokeLinecap="round" />
    <g className="vr-peck" style={{ animationDelay: `${-delay}s` }}>
      <path d="M8 -14C8 -24 20 -26 22 -18L20 -12Z" fill="#7C8494" />
      <path d="M8 -14Q14 -10 18 -13" fill="none" stroke="#5E8C7A" strokeWidth="3" />
      <circle cx="17" cy="-20" r="1.6" fill={C.ink} />
      <path d="M22 -19l5 1.5-5 1.5Z" fill="#E0A526" />
    </g>
  </g>
);
const PaperPlane = ({ y = 70 }) => (
  <g className="vr-glide">
    <g transform={`translate(0 ${y}) rotate(-8)`}>
      <path d="M0 0L44 -8L10 8Z" fill={C.surf} />
      <path d="M10 8L44 -8L16 2Z" fill="#E4DACA" />
      <path d="M0 0L16 2L10 8Z" fill="#D2C6B1" />
    </g>
  </g>
);
const AMB = {
  shop: {
    front: (
      <g>
        <ellipse cx="370" cy="318" rx="46" ry="6" fill="rgba(58,34,16,.18)" />
        <path d="M326 296h88l-8 22h-72Z" fill={C.wood} />
        <path d="M330 302h80" stroke={C.wood2} strokeWidth="2" strokeDasharray="5 4" />
        <path d="M334 298q14-26 32-4M356 296q16-30 36-2M380 298q12-20 26-2" fill="#D99C44" />
        <path d="M342 290q6-6 12 0M366 286q8-7 16 0M388 290q5-5 10 0" fill="none" stroke="#F2C77A" strokeWidth="2" />
        <Steam x={352} y={272} s={0.55} />
        <Steam x={386} y={268} s={0.5} />
      </g>
    ),
  },
  bazaar: { front: <><Pigeon x={560} y={318} s={0.9} /><Pigeon x={604} y={320} s={0.8} flip delay={0.9} /></> },
  taxi: { back: <Drops list={[[90, 60, 0], [150, 120, 1.1], [230, 40, 2.3], [330, 150, 0.6], [420, 70, 1.8], [500, 130, 2.9], [580, 50, 0.3], [650, 140, 1.5], [720, 90, 2.6], [270, 180, 3.2], [610, 190, 0.9], [120, 190, 2]]} /> },
  school: { mid: <PaperPlane y={120} /> },
  post: { mid: <PaperPlane y={60} /> },
  hotel: {
    front: (
      <g transform="translate(662 280)">
        <path className="vr-ding" d="M-26 -14q-6 8 0 16M26 -14q6 8 0 16M-34 -20q-10 14 0 28M34 -20q10 14 0 28" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" />
      </g>
    ),
  },
};

export const VR_ARTS = Object.keys(ART);
const cache = new Map();
const sceneOf = (art) => {
  const k = ART[art] ? art : "shop";
  if (!cache.has(k)) cache.set(k, ART[k]());
  return cache.get(k);
};
export const npcSide = (art) => (sceneOf(art).npc.x < 400 ? "left" : "right");

// Толық сахна. talk — кейіпкер сөйлеп тұр (ауыз қимылы). npc={voice,name} болмаса — бос орын.
export const VrScene = memo(function VrScene({ art, npc, talk = false, mood = null, className = "", label }) {
  const sc = sceneOf(art);
  const amb = AMB[art] || {};
  const { x, y, s } = sc.npc;
  return (
    <svg className={`vr-art ${className}`} viewBox="0 0 800 450" preserveAspectRatio="xMidYMax slice" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : "true"} focusable="false">
      <g className="vr-lay vr-l0">{sc.back}{amb.back}</g>
      <g className="vr-lay vr-l1">{sc.mid}{amb.mid}</g>
      {npc && (
        <g className="vr-lay vr-ln">
          <g transform={`translate(${x} ${y}) scale(${s})`}>
            <Npc voice={npc.voice} place={art} name={npc.name} talk={talk} mood={mood} />
          </g>
        </g>
      )}
      <g className="vr-lay vr-l2">{sc.front}{amb.front}</g>
    </svg>
  );
});

// Шағын портрет (чат аватары): кейіпкердің басы мен иығы
export function VrFace({ art, npc, size = 40 }) {
  return (
    <svg className="vr-face" viewBox="-60 -320 120 130" width={size} height={size} aria-hidden="true" focusable="false">
      <circle cx="0" cy="-255" r="62" fill={(OUT[art] || OUT.shop).top === "#FFFFFF" ? "#DCE8E0" : C.felt} />
      <Npc voice={npc?.voice} place={art} name={npc?.name} />
    </svg>
  );
}

/* ═════════════ Карта ғимараттары (100×90, жер — y 84) ═════════════ */
const Gnd = () => <ellipse cx="50" cy="85" rx="44" ry="6" fill="rgba(58,34,16,.16)" />;
const Win = ({ x, y, w = 10, h = 10, c = "#DCEFF3" }) => <rect x={x} y={y} width={w} height={h} rx="2" fill={c} />;
const BLD = {
  shop: (
    <>
      <Gnd />
      <rect x="16" y="38" width="68" height="46" rx="3" fill={C.felt} />
      <path d="M10 40L50 14L90 40Z" fill={C.red} />
      <path d="M16 44h68v8H16Z" fill={C.surf} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${16 + i * 17} 52h17v5q-8.5 7-17 0Z`} fill={i % 2 ? C.surf : C.red} />)}
      <rect x="22" y="62" width="22" height="16" rx="2" fill="#DCEFF3" />
      <rect x="54" y="60" width="18" height="24" rx="2" fill={C.wood2} />
      <circle cx="68" cy="73" r="1.6" fill={C.gold} />
    </>
  ),
  bazaar: (
    <>
      <Gnd />
      {[[8, C.gold, C.red], [52, C.blue, C.surf]].map(([x, a, b]) => (
        <g key={x}>
          <rect x={x + 3} y="40" width="3" height="44" fill={C.wood2} /><rect x={x + 35} y="40" width="3" height="44" fill={C.wood2} />
          <path d={`M${x} 42L${x + 6} 22H${x + 36}L${x + 42} 42Z`} fill={a} />
          {[0, 1, 2].map((i) => <path key={i} d={`M${x + i * 14} 42h14v5q-7 6-14 0Z`} fill={i % 2 ? a : b} />)}
          <rect x={x + 2} y="64" width="38" height="12" rx="2" fill={C.wood} />
          <circle cx={x + 12} cy="61" r="4" fill="#C8392E" /><circle cx={x + 21} cy="61" r="4" fill="#7EA548" /><circle cx={x + 30} cy="61" r="4" fill="#E6702E" />
        </g>
      ))}
    </>
  ),
  school: (
    <>
      <Gnd />
      <rect x="10" y="34" width="80" height="50" rx="2" fill="#E9C98E" />
      <path d="M6 36L50 16L94 36Z" fill={C.deep} />
      <circle cx="50" cy="29" r="6" fill={C.surf} /><path d="M50 29v-4M50 29h3" stroke={C.ink} strokeWidth="1.4" />
      {[16, 32, 60, 76].map((x) => <Win key={x} x={x} y={44} w={9} h={11} />)}
      {[16, 32, 60, 76].map((x) => <Win key={"b" + x} x={x} y={62} w={9} h={11} />)}
      <rect x="43" y="60" width="14" height="24" rx="2" fill={C.wood2} />
      <path d="M88 34V6" stroke={C.thread} strokeWidth="2" />
      <rect x="88" y="6" width="16" height="10" fill="#33B5E5" transform="translate(-16 0)" />
      <circle cx="80" cy="11" r="2.4" fill={C.gold} />
    </>
  ),
  airport: (
    <>
      <Gnd />
      <rect x="10" y="60" width="64" height="24" rx="3" fill="#D7DEE2" />
      <rect x="14" y="66" width="56" height="8" rx="2" fill="#9FC3D2" />
      <rect x="72" y="26" width="12" height="58" fill="#C9D2D7" />
      <path d="M66 18h24l-3 10H69Z" fill={C.blue} />
      <rect x="68" y="20" width="20" height="5" fill="#DCEFF3" />
      <g transform="translate(14 22) scale(.32)"><Plane x={0} y={0} /></g>
    </>
  ),
  station: (
    <>
      <Gnd />
      <rect x="8" y="40" width="84" height="40" rx="2" fill="#D9B98A" />
      <path d="M4 42h92l-6-10H10Z" fill={C.green} />
      <rect x="40" y="16" width="20" height="20" fill="#D9B98A" /><path d="M36 18L50 6l14 12Z" fill={C.green} />
      <circle cx="50" cy="26" r="6" fill={C.surf} /><path d="M50 26v-4M50 26h3" stroke={C.ink} strokeWidth="1.4" />
      {[14, 32, 58, 76].map((x) => <path key={x} d={`M${x} 70v-14a5 5 0 0 1 10 0v14Z`} fill="#DCEFF3" />)}
      <path d="M2 84H98M2 88H98" stroke={C.thread} strokeWidth="1.6" />
    </>
  ),
  taxi: (
    <>
      <Gnd />
      <path d="M8 74c0-12 8-14 18-16l12-14h28l14 14c12 2 14 6 14 16v4H8Z" fill={C.gold} />
      <path d="M40 48h12v10H32ZM56 48h10l9 10H56Z" fill="#DCEFF3" />
      <rect x="8" y="64" width="86" height="6" fill={C.ink} opacity=".85" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={10 + i * 10.6} y={i % 2 ? 64 : 67} width="5.3" height="3" fill={C.gold} />)}
      <rect x="44" y="36" width="16" height="8" rx="2" fill={C.ink} /><rect x="47" y="38" width="10" height="4" fill={C.gold} />
      <circle cx="26" cy="80" r="7" fill={C.ink} /><circle cx="76" cy="80" r="7" fill={C.ink} />
      <circle cx="26" cy="80" r="2.6" fill={C.grey} /><circle cx="76" cy="80" r="2.6" fill={C.grey} />
    </>
  ),
  hotel: (
    <>
      <Gnd />
      <rect x="24" y="12" width="52" height="72" rx="2" fill={C.deep} />
      {[0, 1, 2, 3, 4].map((r) => [0, 1, 2].map((c) => <Win key={r + "-" + c} x={30 + c * 15} y={22 + r * 11} w={10} h={7} c={(r + c) % 3 ? "#F6E3B0" : "#DCEFF3"} />))}
      <rect x="42" y="72" width="16" height="12" fill={C.wood2} />
      {[36, 50, 64].map((x) => <path key={x} d={`M${x} 2l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4Z`} fill={C.gold} />)}
    </>
  ),
  cafe: (
    <>
      <Gnd />
      <rect x="14" y="36" width="72" height="48" rx="3" fill="#F0DCC4" />
      <path d="M10 38h80l-4-12H14Z" fill={C.blue} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${12 + i * 19} 38h19v5q-9.5 7-19 0Z`} fill={i % 2 ? C.blue : C.surf} />)}
      <rect x="20" y="52" width="26" height="20" rx="2" fill="#DCEFF3" />
      <rect x="56" y="54" width="18" height="30" rx="2" fill={C.wood2} />
      <circle cx="50" cy="16" r="11" fill={C.surf} stroke={C.blue} strokeWidth="2" />
      <path d="M44 13h10v5a5 5 0 0 1-10 0ZM54 15h3a2 2 0 0 1 0 4h-3" fill={C.red} />
    </>
  ),
  pharmacy: (
    <>
      <Gnd />
      <rect x="14" y="30" width="72" height="54" rx="3" fill="#EAF3EE" />
      <rect x="10" y="26" width="80" height="8" rx="2" fill="#2F8F5B" />
      <rect x="20" y="48" width="24" height="24" rx="2" fill="#DCEFF3" />
      <rect x="54" y="52" width="20" height="32" rx="2" fill="#2F8F5B" />
      <rect x="40" y="4" width="20" height="20" rx="4" fill="#2F8F5B" />
      <path d="M47 8h6v5h5v6h-5v-2h0v2h-6v-6h-5v-5h5Z" fill="#fff" />
    </>
  ),
  clinic: (
    <>
      <Gnd />
      <rect x="8" y="30" width="84" height="54" rx="3" fill="#F3F6F7" />
      <rect x="8" y="30" width="84" height="8" fill={C.teal} />
      {[14, 30, 62, 78].map((x) => <Win key={x} x={x} y={46} w={10} h={10} />)}
      {[14, 30, 62, 78].map((x) => <Win key={"b" + x} x={x} y={64} w={10} h={10} />)}
      <rect x="43" y="60" width="14" height="24" fill={C.teal} />
      <path d="M50 22c-7-6-14 0-10 6l10 9 10-9c4-6-3-12-10-6Z" fill="#E46B5E" />
      <path d="M40 22h6l2-4 3 8 2-4h7" fill="none" stroke="#fff" strokeWidth="1.6" />
    </>
  ),
  bank: (
    <>
      <Gnd />
      <path d="M6 34L50 12L94 34Z" fill="#D7D0BE" />
      <text x="50" y="31" textAnchor="middle" fontSize="14" fontWeight="800" fill={C.deep} fontFamily="'Golos Text', sans-serif">₸</text>
      <rect x="10" y="34" width="80" height="6" fill="#C9C0AE" />
      {[16, 32, 60, 76].map((x) => <rect key={x} x={x} y="40" width="8" height="36" fill="#EDE8DC" />)}
      <rect x="44" y="52" width="12" height="24" fill={C.wood2} />
      <rect x="6" y="76" width="88" height="5" fill="#C9C0AE" /><rect x="2" y="81" width="96" height="4" fill="#B8B2A4" />
    </>
  ),
  post: (
    <>
      <Gnd />
      <rect x="12" y="32" width="76" height="52" rx="3" fill="#1F4E8C" />
      <path d="M8 34L50 14L92 34Z" fill="#153968" />
      <rect x="32" y="40" width="36" height="24" rx="2" fill={C.gold} />
      <path d="M32 40l18 13 18-13" fill="none" stroke={C.deep} strokeWidth="2" />
      <rect x="42" y="68" width="16" height="16" rx="2" fill={C.surf} />
      <Win x={18} y={68} w={14} h={10} /><Win x={68} y={68} w={14} h={10} />
    </>
  ),
  bus: (
    <>
      <Gnd />
      <g transform="translate(4 86) scale(.5)"><Bus x={0} y={0} /></g>
      <path d="M92 84V30" stroke={C.thread} strokeWidth="2.4" />
      <rect x="82" y="22" width="18" height="16" rx="3" fill={C.blue} />
      <path d="M86 28h10M86 33h7" stroke="#fff" strokeWidth="2" />
    </>
  ),
  guest: (
    <>
      <Gnd />
      <path d="M12 82V50C12 44 26 36 50 36S88 44 88 50V82Z" fill={C.surf} />
      <path d="M10 50C14 26 34 14 50 14S86 26 90 50C78 44 64 42 50 42S22 44 10 50Z" fill="#EFE6D2" />
      <path d="M12 56H88" stroke={C.red} strokeWidth="5" />
      <path d="M14 56h72" stroke={C.gold} strokeWidth="1.6" strokeDasharray="3 3" />
      <circle cx="50" cy="16" r="5" fill={C.wood2} />
      <path d="M40 82V64a10 10 0 0 1 20 0v18Z" fill={C.red} />
      <path d="M44 70h12M50 64v18" stroke={C.gold} strokeWidth="1.6" />
      <path d="M22 30c8-4 16-6 28-6" stroke={C.wood2} strokeWidth="1.6" fill="none" />
    </>
  ),
  phone: (
    <>
      <Gnd />
      <rect x="30" y="20" width="40" height="64" rx="5" fill={C.red} />
      <path d="M30 26h40" stroke={C.gold} strokeWidth="3" />
      <rect x="36" y="32" width="28" height="36" rx="2" fill="#DCEFF3" />
      <path d="M43 42c0-4 4-4 5 0l-2 3c1 3 3 5 6 6l3-2c4 1 4 5 0 5-8 0-12-6-12-12Z" fill={C.deep} />
      <path d="M76 28q8 8 0 16M82 22q14 14 0 28" fill="none" stroke={C.gold} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M24 28q-8 8 0 16M18 22q-14 14 0 28" fill="none" stroke={C.gold} strokeWidth="2.6" strokeLinecap="round" />
    </>
  ),
  office: (
    <>
      <Gnd />
      <rect x="14" y="20" width="34" height="64" rx="2" fill="#6F8EA0" />
      <rect x="52" y="8" width="36" height="76" rx="2" fill="#4F6E80" />
      {[0, 1, 2, 3, 4, 5].map((r) => <rect key={r} x="56" y={14 + r * 11} width="28" height="6" fill="#B9D6E2" opacity=".85" />)}
      {[0, 1, 2, 3, 4].map((r) => <rect key={"l" + r} x="18" y={26 + r * 11} width="26" height="6" fill="#DCEFF3" opacity=".8" />)}
      <path d="M70 8V0" stroke={C.thread} strokeWidth="2" /><circle cx="70" cy="0" r="2" fill={C.red} />
    </>
  ),
};

export function VrBuilding({ kind, size = 84 }) {
  return (
    <svg className="vr-bld" viewBox="0 -4 100 94" width={size} height={(size * 94) / 100} aria-hidden="true" focusable="false">
      {BLD[kind] || BLD.shop}
    </svg>
  );
}

// Тақтаның фоны: дала, тау, өзен, жол, ағаштар, киіз үйлер (бос безендіру)
export function VrTownBg() {
  return (
    <svg className="vr-town-bg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="1000" height="600" fill="#E8DDB9" />
      <path d="M0 0H1000V110H0Z" fill="#D7E8EA" />
      <path d="M0 110L90 50l70 40 110-70 120 80 80-50 130 70 100-60 140 70 90-40 70 30V140H0Z" fill="#B7CCD5" />
      <path d="M232 42l38-22 30 28-16-6-14 10ZM640 40l30-20 30 30-18-6-14 8Z" fill="#fff" opacity=".9" />
      <path d="M0 140C120 120 260 150 400 132S700 120 1000 140V170H0Z" fill="#C9D5A6" />
      <path d="M0 160C200 150 380 168 560 158S860 150 1000 162V600H0Z" fill="#DCCF9E" />
      <path d="M-20 260C200 240 300 300 520 280S820 230 1020 260" fill="none" stroke="#C7B884" strokeWidth="26" strokeLinecap="round" />
      <path d="M-20 260C200 240 300 300 520 280S820 230 1020 260" fill="none" stroke="#F4ECDA" strokeWidth="3" strokeDasharray="14 12" />
      <path d="M-20 470C220 450 360 510 560 490S860 440 1020 470" fill="none" stroke="#C7B884" strokeWidth="26" strokeLinecap="round" />
      <path d="M-20 470C220 450 360 510 560 490S860 440 1020 470" fill="none" stroke="#F4ECDA" strokeWidth="3" strokeDasharray="14 12" />
      <path d="M940 150C880 240 960 300 900 380S940 520 880 620" fill="none" stroke="#8FBCCB" strokeWidth="22" strokeLinecap="round" />
      <path d="M940 150C880 240 960 300 900 380S940 520 880 620" fill="none" stroke="#CFE6EC" strokeWidth="2.4" strokeDasharray="10 12" />
      {[[60, 200], [470, 360], [770, 560], [210, 580], [620, 190], [960, 420]].map(([x, y], i) => (
        <g key={i}><circle cx={x} cy={y - 16} r="14" fill={i % 2 ? C.leaf : C.leaf2} /><rect x={x - 2} y={y - 4} width="4" height="10" fill={C.wood2} /></g>
      ))}
      {[[330, 380], [860, 330]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(.45)`}><path d="M12 82V50C12 44 26 36 50 36S88 44 88 50V82Z" fill={C.surf} /><path d="M10 50C14 26 34 14 50 14S86 26 90 50C78 44 64 42 50 42S22 44 10 50Z" fill="#EFE6D2" /><path d="M12 56H88" stroke={C.red} strokeWidth="5" /></g>
      ))}
      <g className="vr-rays"><circle cx="880" cy="56" r="38" fill="none" stroke={C.gold2} strokeWidth="3" strokeDasharray="5 9" strokeLinecap="round" /></g>
      <circle cx="880" cy="56" r="26" fill={C.gold2} />
      {/* Тірлік: бұлттар, құстар, киіз үй түтіні, жолдағы автобус пен такси */}
      <g className="vr-drift"><Cloud x={120} y={30} s={1.3} /></g>
      <g className="vr-drift d2"><Cloud x={520} y={56} s={0.9} /></g>
      <g className="vr-drift d3"><Cloud x={760} y={18} s={1.1} /></g>
      <g className="vr-birds">
        <path d="M0 0q6-6 12 0q6-6 12 0M30 10q5-5 10 0q5-5 10 0M14 18q4-4 8 0q4-4 8 0" fill="none" stroke={C.thread} strokeWidth="2" strokeLinecap="round" transform="translate(0 70)" />
      </g>
      {[[352, 384], [882, 334]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {[0, 1, 2].map((k) => <circle key={k} className="vr-puff" style={{ animationDelay: `${-(k * 1.2 + i * 0.6)}s` }} cx="0" cy="0" r={5 + k} fill="#F7F2E6" />)}
        </g>
      ))}
      <g className="vr-car r2">
        <g transform="translate(-23 -20)">
          <rect x="0" y="0" width="46" height="16" rx="4" fill={C.red} />
          <rect x="0" y="9" width="46" height="2.5" fill={C.gold} />
          {[3, 14, 25, 36].map((wx) => <rect key={wx} x={wx} y="2.5" width="8" height="5" rx="1.2" fill="#DCEFF3" />)}
          <circle cx="10" cy="16" r="3.4" fill={C.ink} /><circle cx="36" cy="16" r="3.4" fill={C.ink} />
        </g>
      </g>
      <g className="vr-car r1">
        <g transform="translate(17 -16) scale(-1 1)">
          <path d="M0 9c0-4 3-5 6-5.5l5-5h14l5 5c4 .5 4 2 4 5.5v3H0Z" fill={C.gold} />
          <rect x="13" y="-5" width="8" height="3" rx="1" fill={C.ink} />
          <path d="M12 0h5v4h-8ZM19 0h5l3 4h-8Z" fill="#DCEFF3" />
          <circle cx="8" cy="12.5" r="3.2" fill={C.ink} /><circle cx="27" cy="12.5" r="3.2" fill={C.ink} />
        </g>
      </g>
    </svg>
  );
}
