// Saiys — «Бәйге алаңы» иллюстрациялары: киіз-аппликация стилі (тегіс қабат + тігіс сызығы).
import { Horse } from "./games/Frame";

const RED = "#B8322A", RED_D = "#8A2018", GOLD = "#E0A526", GOLD_L = "#F6E3B0", CREAM = "#FFFDF7", INK = "#1F2430", BLUE = "#0F5E7A";

// Медаль түстері: [негіз, ашық тігіс, қою жиек, сан]
export const METAL = [
  ["#E0A526", "#FBEBC0", "#9A6B0E", "#3A2500"],
  ["#CFCBC2", "#F6F3EC", "#7E7A72", "#22252C"],
  ["#C98450", "#F3D2B4", "#7E4520", "#2B1A10"],
];

/* Медаль: таспа + тігісті диск + орын саны */
export function SaiysMedal({ place = 0, size = 32, className = "" }) {
  const [c, l, d, t] = METAL[place] || METAL[2];
  return (
    <svg className={`sy-medal ${className}`} viewBox="0 0 40 50" width={size} height={(size * 50) / 40} aria-hidden="true" focusable="false">
      <path d="M9 0h9l6 18h-9Z" fill={RED} />
      <path d="M31 0h-9l-6 18h9Z" fill={BLUE} />
      <path d="M11 2h5M24 2h5" stroke={GOLD_L} strokeWidth="1.2" strokeDasharray="1.5 2" />
      <circle cx="20" cy="33" r="15" fill={d} />
      <circle cx="20" cy="32" r="14" fill={c} />
      <circle cx="20" cy="32" r="10.5" fill="none" stroke={l} strokeWidth="1.4" strokeDasharray="2 2.2" />
      <text x="20" y="37.2" textAnchor="middle" fontFamily="Unbounded, Golos Text, sans-serif" fontWeight="800" fontSize="14" fill={t}>{place + 1}</text>
    </svg>
  );
}

/* Үкі — құрмет белгісі: 1-орын иесінің басында */
export function SaiysPlume({ size = 26, className = "" }) {
  return (
    <svg className={`sy-plume ${className}`} viewBox="0 0 26 34" width={size} height={(size * 34) / 26} aria-hidden="true" focusable="false">
      <path d="M13 33V18" stroke={RED_D} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M13 20C5 20 2 14 5 9 3 5 7 1 11 3 13 0 18 1 19 5 24 6 25 12 21 15 21 19 17 21 13 20Z" fill={CREAM} stroke="#C9BFA8" strokeWidth="1.2" />
      <path d="M8 12c2-3 5-4 9-2M9 16c3-2 6-2 9 0" stroke="#D8CDB3" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <circle cx="13" cy="21" r="2.6" fill={GOLD} />
    </svg>
  );
}

/* Қошқар мүйіз — тұғыр алдындағы өрнек */
export function SaiysOrn({ color = CREAM, size = 44, className = "" }) {
  return (
    <svg className={`sy-orn ${className}`} viewBox="0 0 48 26" width={size} height={(size * 26) / 48} aria-hidden="true" focusable="false">
      <g fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round">
        <path d="M24 24c0-8-6-12-12-9-4 2-2 8 3 7" />
        <path d="M24 24c0-8 6-12 12-9 4 2 2 8-3 7" />
      </g>
      <path d="M24 2l5 5-5 5-5-5z" fill={color} />
    </svg>
  );
}

/* Жүлде: сыйлық = ою-өрнекті сандық; монета = алтын теңгелер */
export function SaiysPrizeArt({ kind = "coins", size = 96, className = "" }) {
  if (kind === "gift")
    return (
      <svg className={`sy-prize-art ${className}`} viewBox="0 0 96 96" width={size} height={size} aria-hidden="true" focusable="false">
        <ellipse cx="48" cy="86" rx="34" ry="5" fill={INK} opacity=".12" />
        <path d="M14 46h68v32a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6Z" fill={RED} />
        <path d="M12 38c0-10 8-16 18-16h36c10 0 18 6 18 16v10H12Z" fill={RED_D} />
        <path d="M18 54h60v24H18Z" fill="none" stroke={GOLD_L} strokeWidth="1.6" strokeDasharray="3 3" />
        <path d="M44 22h8v62h-8Z" fill={GOLD} />
        <path d="M12 46h72v6H12Z" fill={GOLD} />
        <g fill="none" stroke={GOLD_L} strokeWidth="2.2" strokeLinecap="round">
          <path d="M30 76c0-7-5-10-10-7-3 2-1 6 2 5" />
          <path d="M66 76c0-7 5-10 10-7 3 2 1 6-2 5" />
        </g>
        <circle cx="48" cy="60" r="6" fill={GOLD_L} stroke="#9A6B0E" strokeWidth="1.4" />
        <path d="M48 58v4" stroke="#9A6B0E" strokeWidth="2" strokeLinecap="round" />
        <path d="M48 22C40 8 26 8 28 16c1 5 12 6 20 6Z" fill={GOLD} />
        <path d="M48 22c8-14 22-14 20-6-1 5-12 6-20 6Z" fill={GOLD} />
        <path d="M48 22C42 13 33 12 33 16" stroke="#9A6B0E" strokeWidth="1.2" fill="none" strokeDasharray="2 2" />
        <circle cx="48" cy="22" r="4.5" fill="#C98E14" />
      </svg>
    );
  const coin = (x, y, s = 1) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="4" rx="22" ry="8" fill="#9A6B0E" />
      <ellipse cx="0" cy="0" rx="22" ry="8" fill={GOLD} />
      <ellipse cx="0" cy="0" rx="16" ry="5" fill="none" stroke={GOLD_L} strokeWidth="1.3" strokeDasharray="2.5 2" />
    </g>
  );
  return (
    <svg className={`sy-prize-art ${className}`} viewBox="0 0 96 96" width={size} height={size} aria-hidden="true" focusable="false">
      <ellipse cx="48" cy="88" rx="38" ry="5" fill={INK} opacity=".12" />
      {coin(30, 78)}
      {coin(30, 70)}
      {coin(32, 62)}
      {coin(29, 54)}
      <g className="sy-coin-big">
        <circle cx="64" cy="58" r="26" fill="#9A6B0E" />
        <circle cx="62" cy="56" r="26" fill={GOLD} />
        <circle cx="62" cy="56" r="20" fill="none" stroke={GOLD_L} strokeWidth="1.6" strokeDasharray="3 2.6" />
        <g fill="none" stroke="#7A520A" strokeWidth="2.4" strokeLinecap="round">
          <circle cx="62" cy="56" r="8" />
          <path d="M54 56h16M62 48v16M56.5 50.5l11 11M67.5 50.5l-11 11" />
        </g>
      </g>
      <path className="sy-glint" d="M84 20l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill={GOLD_L} />
    </svg>
  );
}

/* Бәйге алаңы: дала, киіз үйлер, жалаушалар, мәре бағаны, шауып келе жатқан аттар */
export function SaiysArena({ className = "" }) {
  const flags = Array.from({ length: 13 }, (_, i) => {
    const t = i / 12;
    const x = 8 + t * 352;
    const y = 26 + 58 * t + 30 * Math.sin(Math.PI * t);
    return { x, y, c: [RED, GOLD, BLUE, CREAM][i % 4], i };
  });
  const yurt = (x, y, s) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-14 0v-8c4-10 24-10 28 0v8Z" fill={CREAM} />
      <path d="M-14-6h28" stroke={RED} strokeWidth="2.4" />
      <path d="M-3 0v-6h6v6" fill={RED_D} />
      <path d="M-4-14c2-2 6-2 8 0" stroke={GOLD} strokeWidth="1.6" fill="none" />
    </g>
  );
  const tuft = (x, y) => <path d={`M${x} ${y}c1-6 3-8 4-9M${x + 3} ${y}c0-5 1-7 3-10M${x + 6} ${y}c1-4 3-6 6-7`} stroke="#2F6B4F" strokeWidth="1.8" fill="none" strokeLinecap="round" />;
  return (
    <svg className={`sy-arena-svg ${className}`} viewBox="0 0 420 230" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
      <circle cx="150" cy="70" r="26" fill="#F2C45A" />
      <circle cx="150" cy="70" r="19" fill="none" stroke={CREAM} strokeWidth="1.6" strokeDasharray="3 4" />
      <path d="M0 150C40 122 84 118 124 130 164 142 196 112 244 110 292 108 322 134 362 128 392 124 410 126 420 128V230H0Z" fill="#E8D6AF" />
      <path d="M0 172C62 152 132 152 200 162 268 172 340 152 420 160V230H0Z" fill="#DBC394" />
      {yurt(318, 163, 1.05)}
      {yurt(344, 160, 0.8)}
      <path d="M0 184H420V230H0Z" fill="#CFAF72" />
      <path d="M0 190H420V222H0Z" fill="#E4CF9E" />
      <path d="M0 190H420M0 222H420" stroke={CREAM} strokeWidth="1.6" strokeDasharray="6 5" />
      {tuft(20, 186)}
      {tuft(250, 186)}
      {tuft(330, 228)}
      {tuft(120, 228)}
      <g className="sy-bunting">
        <path d={`M${flags.map((f) => `${f.x} ${f.y}`).join(" L")}`} stroke={RED_D} strokeWidth="1.2" fill="none" />
        {flags.map((f) => (
          <path key={f.i} className="sy-flag" style={{ animationDelay: `${-f.i * 0.23}s` }} d={`M${f.x - 6} ${f.y}h12l-6 13Z`} fill={f.c} stroke={f.c === CREAM ? "#C9BFA8" : "none"} strokeWidth="1" />
        ))}
      </g>
      <path d="M362 190v32" stroke={INK} strokeWidth="5" strokeDasharray="4 4" />
      <path d="M362 190v32" stroke={CREAM} strokeWidth="5" strokeDasharray="4 4" strokeDashoffset="4" />
      <rect x="370" y="88" width="6" height="134" rx="2" fill={RED_D} />
      <g className="sy-pennant">
        <path d="M376 112h36l-9 11 9 11h-36Z" fill={RED} />
        <path d="M379 116h26l-6 7 6 7h-26Z" fill="none" stroke={GOLD_L} strokeWidth="1.2" strokeDasharray="2.5 2" />
      </g>
      <g className="sy-dust">
        <circle cx="62" cy="214" r="6" fill={CREAM} />
        <circle cx="50" cy="210" r="4" fill={CREAM} />
        <circle cx="168" cy="216" r="7" fill={CREAM} />
        <circle cx="154" cy="211" r="4.5" fill={CREAM} />
      </g>
      <Horse className="sy-h sy-h2" x="58" y="128" width="104" height="94" coat="#3A2A20" mane="#1F140C" cloth={BLUE} rider={RED_D} />
      <Horse className="sy-h sy-h1" x="176" y="114" width="122" height="110" coat="#E9DDC6" mane="#7A5A3A" cloth={RED} rider={BLUE} />
    </svg>
  );
}
