// Әкімші бетінің суреттері — тегіс иллюстрация (тек inline SVG, градиентсіз, id жоқ).
// AdminKpi   — көрсеткіш белгісі (44×44 түсті тақтайша): users | active | fresh | lessons | xp | teacher | classes | members
// AdminScene — бос/қате күй суреті (220×150): ноутбуктағы тақта; kind: login | forbidden | setup | error | search | empty
const GOLD = "#F2C14E", GOLD_D = "#E0A526", RED = "#B8322A", RED_D = "#8A2018", CREAM = "#FFF6DC", PAPER = "#FFFDF7";
const FELT = "#F4ECDA", FELT2 = "#E6D9BC", INK = "#1F2430", SLATE = "#4A5160", BLUE = "#0F5E7A", GREEN = "#3A7440", WINE = "#6E1E2E";

const TONE = {
  users: [BLUE, "#E2EDF1"], active: [GREEN, "#E7EDE1"], fresh: [RED, "#F6E4DF"], lessons: ["#7A2E6E", "#EFE4E7"],
  xp: ["#96690A", "#F6ECD2"], teacher: ["#1F4E8C", "#E4E8EF"], classes: [RED_D, "#F1E2DC"], members: [SLATE, "#E9E8E5"],
};

function Glyph({ kind, c }) {
  const s = { fill: "none", stroke: c, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (kind) {
    case "users": return (<g {...s}><circle cx="18" cy="17" r="4.5" /><path d="M10 31c0-4.6 3.6-8 8-8s8 3.4 8 8" /><circle cx="28" cy="18.5" r="3.5" fill={c} fillOpacity="0.25" /><path d="M27 24.2c3.6-.4 7 2.2 7 6.8" /></g>);
    case "active": return (<g {...s}><path d="M9 23h5l3-7 5 14 4-10 2 3h6" /></g>);
    case "fresh": return (<g {...s}><circle cx="19" cy="17" r="4.5" /><path d="M11 31c0-4.6 3.6-8 8-8 2 0 3.8.7 5.2 1.9" /><path d="M30 24v8M26 28h8" strokeWidth="2.4" /></g>);
    case "lessons": return (<g {...s}><path d="M22 14.5c-3.4-2.3-7-2.7-10-1.7v14.4c3-1 6.6-.6 10 1.7 3.4-2.3 7-2.7 10-1.7V12.8c-3-1-6.6-.6-10 1.7Z" /><path d="M22 14.5v14.4" /></g>);
    case "xp": return (<g><path d="M22 10.5l3.4 7 7.6 1-5.5 5.3 1.3 7.6L22 27.8l-6.8 3.6 1.3-7.6L11 18.5l7.6-1z" fill={GOLD} stroke={c} strokeWidth="1.8" strokeLinejoin="round" /></g>);
    case "teacher": return (<g {...s}><rect x="10" y="11" width="24" height="15" rx="2.5" /><path d="M14 17h9M14 21h6" /><path d="M18 26l-3 7M26 26l3 7" /></g>);
    case "classes": return (<g {...s}><path d="M10 22c0-6.6 5.4-11 12-11s12 4.4 12 11" /><path d="M10 22v10h24V22" /><path d="M19 32v-6h6v6" /><path d="M16 15.5l12 0" strokeOpacity="0.5" /></g>);
    default: return (<g {...s}><circle cx="15" cy="18" r="3.5" /><circle cx="22" cy="15.5" r="3.8" /><circle cx="29" cy="18" r="3.5" /><path d="M9 31c0-3.6 2.6-6.2 6-6.2M35 31c0-3.6-2.6-6.2-6-6.2M15 32c0-4 3.1-7 7-7s7 3 7 7" /></g>);
  }
}

export function AdminKpi({ kind, size = 44 }) {
  const [c, soft] = TONE[kind] || TONE.members;
  return (
    <svg className="adm-kic" width={size} height={size} viewBox="0 0 44 44" aria-hidden="true" focusable="false">
      <rect x="0.5" y="0.5" width="43" height="43" rx="13" fill={soft} />
      <Glyph kind={kind} c={c} />
    </svg>
  );
}

function Screen({ kind }) {
  const s = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "login" || kind === "forbidden") return (
    <g>
      <rect x="96" y="46" width="28" height="22" rx="5" fill={kind === "forbidden" ? WINE : RED} />
      <path d="M101 46v-6a9 9 0 0 1 18 0v6" {...s} stroke={kind === "forbidden" ? WINE : RED} strokeWidth="3.4" />
      <circle cx="110" cy="55" r="2.6" fill={CREAM} /><path d="M110 57v4" stroke={CREAM} strokeWidth="2.4" strokeLinecap="round" />
    </g>
  );
  if (kind === "setup") return (
    <g {...s} stroke={BLUE} strokeWidth="3">
      <circle cx="110" cy="52" r="8" />
      <path d="M110 36v5M110 63v5M94 52h5M121 52h5M98.7 40.7l3.5 3.5M117.8 59.8l3.5 3.5M98.7 63.3l3.5-3.5M117.8 44.2l3.5-3.5" />
    </g>
  );
  if (kind === "error") return (
    <g>
      <path d="M110 34l17 30H93z" fill={GOLD} stroke={GOLD_D} strokeWidth="2" strokeLinejoin="round" />
      <path d="M110 44v10" stroke={INK} strokeWidth="3" strokeLinecap="round" /><circle cx="110" cy="59" r="1.9" fill={INK} />
    </g>
  );
  if (kind === "search") return (
    <g {...s}>
      {[0, 1, 2].map((i) => <path key={i} d={`M88 ${40 + i * 10}h${[30, 22, 26][i]}`} stroke={FELT2} strokeWidth="4" />)}
      <circle cx="120" cy="52" r="10" stroke={BLUE} strokeWidth="3.2" fill={PAPER} />
      <path d="M127.5 59.5l7 7" stroke={BLUE} strokeWidth="4" />
    </g>
  );
  /* empty: бос бағаналар */
  return (
    <g>
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={88 + i * 10} y={64 - [6, 10, 4, 14, 8][i]} width="6" height={[6, 10, 4, 14, 8][i]} rx="2" fill={i === 3 ? RED : FELT2} />)}
      <path d="M86 66h50" stroke={FELT2} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

export function AdminScene({ kind = "empty", className = "" }) {
  return (
    <svg className={`adm-scene ${className}`} viewBox="0 0 220 150" aria-hidden="true" focusable="false">
      <path d="M18 84C12 44 50 14 104 12c54-2 100 16 106 58 6 40-24 66-92 70C58 144 24 122 18 84Z" fill={FELT} />
      {/* ноутбук */}
      <rect x="66" y="22" width="88" height="62" rx="7" fill={SLATE} />
      <rect x="71" y="27" width="78" height="52" rx="4" fill={PAPER} />
      <Screen kind={kind} />
      <path d="M52 88h116l-8 10H60z" fill="#C9C2B2" />
      <path d="M52 88h116v2H52z" fill="#B3AB99" />
      <ellipse cx="110" cy="112" rx="70" ry="5" fill={INK} opacity="0.07" />
      {/* дәптер мен қалам */}
      <g transform="translate(150 96) rotate(-8)">
        <rect width="34" height="24" rx="3" fill={RED} />
        <rect x="4" y="0" width="2" height="24" fill={RED_D} />
        <path d="M11 8h17M11 13h12" stroke={CREAM} strokeWidth="2" strokeLinecap="round" />
      </g>
      <path d="M36 106l26-8" stroke={GOLD_D} strokeWidth="4" strokeLinecap="round" />
      <path d="M58.5 99l3.5-1" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      {/* ұшқындар */}
      <path d="M40 46l2 4.2 4.2 2-4.2 2-2 4.2-2-4.2-4.2-2 4.2-2z" fill={GOLD} />
      <circle cx="184" cy="40" r="3" fill={BLUE} opacity="0.5" />
      <path d="M180 66l1.4 3 3 1.4-3 1.4-1.4 3-1.4-3-3-1.4 3-1.4z" fill={GREEN} opacity="0.7" />
    </svg>
  );
}
