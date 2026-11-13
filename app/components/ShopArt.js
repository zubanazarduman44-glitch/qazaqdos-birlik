// Дүкен (шеберхана базары) безендіру суреттері: киіз әмиян, тиын, айна төбесі, сырмақ кілем.
// Жалпақ «киіз аппликация» стилі: тігіс сызықтары — үзік жолақ, өрнек — қошқар мүйіз.
const RED = "#b8322a", DEEP = "#8a2018", GOLD = "#e0a526", GOLD2 = "#f6d27a", CREAM = "#fff7e6", INK = "#3a2210", BLUE = "#0f5e7a";

const Horn = ({ x, y, s = 1, c = GOLD, w = 3 }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 0 c4 -10 15 -9 13 0 c-2 7 -11 5 -8 -1 M0 0 c-4 -10 -15 -9 -13 0 c2 7 11 5 8 -1" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" />
);

export function ShopCoin({ size = 20, className = "" }) {
  return (
    <svg className={`sh-coin-art ${className}`} viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      <circle cx="20" cy="21.5" r="17" fill="#b07c10" />
      <circle cx="20" cy="19.5" r="17" fill={GOLD} />
      <circle cx="20" cy="19.5" r="12.5" fill="none" stroke="#fff1c4" strokeWidth="2" strokeDasharray="2 3" />
      <path d="M20 11 l5 8.5 -5 8.5 -5 -8.5z" fill="#fff1c4" />
      <path d="M20 14.5 l3 5 -3 5 -3 -5z" fill="#b07c10" />
    </svg>
  );
}

// Киіз әмиян: қызыл киіз, алтын бау, ішінен тиындар көрінеді
export function ShopPurse({ size = 72, className = "" }) {
  return (
    <svg className={`sh-purse-art ${className}`} viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      <ellipse cx="60" cy="110" rx="40" ry="5" fill="#2a1708" opacity=".14" />
      <g className="sh-purse-coins">
        <circle cx="46" cy="30" r="10" fill={GOLD} stroke="#b07c10" strokeWidth="2.5" />
        <circle cx="66" cy="24" r="10" fill={GOLD} stroke="#b07c10" strokeWidth="2.5" />
        <circle cx="76" cy="34" r="9" fill={GOLD2} stroke="#b07c10" strokeWidth="2.5" />
        <path d="M66 19 l3 5 -3 5 -3 -5z" fill="#fff1c4" />
      </g>
      <path d="M24 46 C14 66 16 98 30 104 C46 110 74 110 90 104 C104 98 106 66 96 46 Z" fill={RED} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M30 52 C22 70 24 94 34 99 C48 104 72 104 86 99 C96 94 98 70 90 52" fill="none" stroke="#f3c7b8" strokeWidth="1.8" strokeDasharray="3 4" opacity=".9" />
      <path d="M20 44 C40 34 80 34 100 44 C92 52 28 52 20 44 Z" fill={DEEP} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M26 46 C44 40 76 40 94 46" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
      <Horn x={60} y={78} s={1.25} c={GOLD} w={3.4} />
      <path d="M56 70 l4 -6 4 6 -4 6z" fill={GOLD} />
      <path d="M92 46 C102 52 104 62 98 70" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
      <circle cx="98" cy="72" r="4.5" fill={GOLD} stroke={INK} strokeWidth="2" />
      <path d="M95 76 l-2 9 M98 77 l0 9 M101 76 l2 9" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// Айна жақтауының төбесі: қошқар мүйіз тәжі
export function ShopCrown({ className = "" }) {
  return (
    <svg className={`sh-crown ${className}`} viewBox="0 0 200 64" width="200" height="64" aria-hidden="true">
      <path d="M100 6 C80 6 70 26 46 30 C30 33 18 44 14 58 H186 C182 44 170 33 154 30 C130 26 120 6 100 6 Z" fill={RED} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M100 13 C84 14 76 31 52 36 C38 39 28 47 24 54 H176 C172 47 162 39 148 36 C124 31 116 14 100 13 Z" fill="none" stroke="#f3c7b8" strokeWidth="1.8" strokeDasharray="3 4" />
      <Horn x={100} y={42} s={1.6} c={GOLD} w={3} />
      <path d="M100 18 l6 8 -6 8 -6 -8z" fill={GOLD} stroke={INK} strokeWidth="2" />
      <Horn x={56} y={46} s={.9} c={CREAM} w={2.6} />
      <Horn x={144} y={46} s={.9} c={CREAM} w={2.6} />
    </svg>
  );
}

// Сырмақ кілем: кейіпкер тұратын сопақ киіз
export function ShopRug({ className = "" }) {
  return (
    <svg className={`sh-rug ${className}`} viewBox="0 0 300 70" width="300" height="70" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <ellipse cx="150" cy="38" rx="146" ry="30" fill="#6b1a14" />
      <ellipse cx="150" cy="35" rx="146" ry="30" fill={RED} stroke={INK} strokeWidth="2.5" />
      <ellipse cx="150" cy="35" rx="132" ry="24" fill="none" stroke={GOLD} strokeWidth="3" strokeDasharray="1 9" strokeLinecap="round" />
      <ellipse cx="150" cy="35" rx="112" ry="18" fill={CREAM} stroke={INK} strokeWidth="2" />
      <ellipse cx="150" cy="35" rx="104" ry="14" fill="none" stroke="#e6c99a" strokeWidth="1.6" strokeDasharray="3 4" />
      {[-80, -40, 40, 80].map((d) => <Horn key={d} x={150 + d} y={37} s={.75} c={d % 80 ? BLUE : RED} w={3} />)}
      <path d="M150 26 l7 9 -7 9 -7 -9z" fill={GOLD} stroke={INK} strokeWidth="1.6" />
    </svg>
  );
}
