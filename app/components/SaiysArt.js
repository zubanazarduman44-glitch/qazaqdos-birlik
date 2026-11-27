// Saiys иллюстрациялары: медаль мен жүлде белгісі (киіз-аппликация: тегіс қабат + тігіс сызығы).
// Бұрынғы бәйге алаңы, үкі мен ою тұғыры алынды — бет Сөздік үлгісінде ықшам.

const RED = "#B8322A", RED_D = "#8A2018", GOLD = "#E0A526", GOLD_L = "#F6E3B0", INK = "#1F2430", BLUE = "#0F5E7A";

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

/* Жүлде: сыйлық = ою-өрнекті сандық; монета = алтын теңгелер */
export function SaiysPrizeArt({ kind = "coins", size = 96, className = "" }) {
  if (kind === "gift")
    return (
      <svg className={`sy-prize-svg ${className}`} viewBox="0 0 96 96" width={size} height={size} aria-hidden="true" focusable="false">
        <ellipse cx="48" cy="86" rx="34" ry="5" fill={INK} opacity=".12" />
        <path d="M14 46h68v32a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6Z" fill={RED} />
        <path d="M12 38c0-10 8-16 18-16h36c10 0 18 6 18 16v10H12Z" fill={RED_D} />
        <path d="M18 54h60v24H18Z" fill="none" stroke={GOLD_L} strokeWidth="1.6" strokeDasharray="3 3" />
        <path d="M44 22h8v62h-8Z" fill={GOLD} />
        <path d="M12 46h72v6H12Z" fill={GOLD} />
        <circle cx="48" cy="60" r="6" fill={GOLD_L} stroke="#9A6B0E" strokeWidth="1.4" />
        <path d="M48 58v4" stroke="#9A6B0E" strokeWidth="2" strokeLinecap="round" />
        <path d="M48 22C40 8 26 8 28 16c1 5 12 6 20 6Z" fill={GOLD} />
        <path d="M48 22c8-14 22-14 20-6-1 5-12 6-20 6Z" fill={GOLD} />
        <circle cx="48" cy="22" r="4.5" fill="#C98E14" />
      </svg>
    );
  const coin = (x, y) => (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="4" rx="22" ry="8" fill="#9A6B0E" />
      <ellipse cx="0" cy="0" rx="22" ry="8" fill={GOLD} />
      <ellipse cx="0" cy="0" rx="16" ry="5" fill="none" stroke={GOLD_L} strokeWidth="1.3" strokeDasharray="2.5 2" />
    </g>
  );
  return (
    <svg className={`sy-prize-svg ${className}`} viewBox="0 0 96 96" width={size} height={size} aria-hidden="true" focusable="false">
      <ellipse cx="48" cy="88" rx="38" ry="5" fill={INK} opacity=".12" />
      {coin(30, 78)}
      {coin(30, 70)}
      {coin(32, 62)}
      {coin(29, 54)}
      <circle cx="64" cy="58" r="26" fill="#9A6B0E" />
      <circle cx="62" cy="56" r="26" fill={GOLD} />
      <circle cx="62" cy="56" r="20" fill="none" stroke={GOLD_L} strokeWidth="1.6" strokeDasharray="3 2.6" />
      <g fill="none" stroke="#7A520A" strokeWidth="2.4" strokeLinecap="round">
        <circle cx="62" cy="56" r="8" />
        <path d="M54 56h16M62 48v16M56.5 50.5l11 11M67.5 50.5l-11 11" />
      </g>
    </svg>
  );
}
