// «Менің сыныбым» суреттері — тегіс иллюстрация (тек inline SVG, градиентсіз, id жоқ — қақтығыс болмасын).
// Әдебиет/«қағаз бен киіз» стиліне сай: кілегей фон, ағаш, алтын, бір-екі екпін түсі. Тыныш, бірақ «жанды».
// ClassScene       — бос күй суреттері: тақта + парта + кітап; kind: login | setup | teacher | student | desks | tasks | done
// ClassKindTile    — тапсырма түрінің түсті тақтайшасы (сабақ/ойын/өз тапсырмам)
// ClassKindGlyph   — сол белгілердің сызықтық нұсқасы. ClassRank — 1–3 орын медальдары.
// ClassThreadRing  — алтын жіп сақина-прогресс. ClassHourglass — мерзім белгісі.

const GOLD = "#F2C14E", GOLD_D = "#E0A526", CREAM = "#FFF6DC", RED = "#B8322A", RED_D = "#8A2018";
const PAPER = "#FFFDF7", FELT = "#F4ECDA", FELT2 = "#E6D9BC", WOOD = "#7A4A22", WOOD_D = "#4F2E14", WOOD_L = "#A8703C";
const BOARD = "#1F4E5A", BOARD_D = "#163A43", INK = "#1F2430", BLUE = "#0F5E7A", GREEN = "#3A7440";

/* Қошқар мүйіз: бағаны (20,23)-те, екі иірім жоғарыда. 40×24 аумақ. */
export const HORN = "M20 23V13C20 7.5 15 4.5 11 6.2C7.6 7.7 8.2 12.4 11.6 12.4C13.6 12.4 14.2 10 12.6 9.3M20 13C20 7.5 25 4.5 29 6.2C32.4 7.7 31.8 12.4 28.4 12.4C26.4 12.4 25.8 10 27.4 9.3M15 23H25";

/* Түр белгілері 40×40 кеңістікте (ортасы 20,20). */
function KindPath({ kind }) {
  if (kind === "lesson") return (
    <>
      <path d="M20 14.5c-3.2-2.2-6.6-2.6-9.5-1.6v13.6c2.9-1 6.3-.6 9.5 1.6 3.2-2.2 6.6-2.6 9.5-1.6V12.9c-2.9-1-6.3-.6-9.5 1.6Z" />
      <path d="M20 14.5v13.6M13.2 17.2c1.6-.3 3.1 0 4.3.7M22.5 17.9c1.2-.7 2.7-1 4.3-.7" />
    </>
  );
  if (kind === "game") return (
    <>
      <path d="M12.5 13.2c4 2.2 11 2.2 15 0 1.9 4.2 1.9 9.4 0 13.6-4-2.2-11-2.2-15 0-1.9-4.2-1.9-9.4 0-13.6Z" />
      <path d="M16.5 20c1.1-1.4 5.9-1.4 7 0" />
      <circle cx="20" cy="20" r="0.4" />
    </>
  );
  return (
    <>
      <path d="M28.5 11c-7.8 1.6-12.5 7-14.2 15.5 3.6-3.3 6.2-4.7 9.4-5.3-2.2-.2-3.6-.6-4.6-1.4 4.2-1.3 7.3-4.2 9.4-8.8Z" />
      <path d="M14.3 26.5l-2.6 3.5" />
    </>
  );
}

/* Тапсырма түрлерінің түсі — бөлім реңдерімен үйлес (Жаттығу — жасыл, Ойындар — сарғыш, өз тапсырма — сия көгі) */
export const KIND_TONE = { lesson: ["#3A7440", "#E7EDE1"], game: ["#B4510E", "#F6E8DB"], custom: ["#1F4E8C", "#E4E8EA"] };

export function ClassKindGlyph({ kind, size = 26, className = "" }) {
  return (
    <svg className={`cl-kglyph ${className}`} width={size} height={size} viewBox="8 8 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <KindPath kind={kind} />
    </svg>
  );
}

/* Түсті тақтайша 48×48: жұмсақ фон, түсті белгі, done — алтын құсбелгі мөрі. */
export function ClassKindTile({ kind, done = false, size = 48, className = "" }) {
  const [tone, soft] = KIND_TONE[kind] || KIND_TONE.custom;
  return (
    <svg className={`cl-ktile ${className}`} width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="46" height="46" rx="13" fill={done ? FELT : soft} />
      <rect x="1" y="1" width="46" height="46" rx="13" fill="none" stroke={tone} strokeOpacity="0.18" />
      <g transform="translate(4 4)" fill="none" stroke={done ? "#8C8577" : tone} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><KindPath kind={kind} /></g>
      {done && (
        <g>
          <circle cx="36" cy="36" r="9.5" fill={GREEN} stroke={PAPER} strokeWidth="2" />
          <path d="M31.8 36.2l2.9 2.9 5.4-5.6" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
}

/* 1–3 орын: таспалы медаль. Басқа орындар — жай сан (CSS). */
const MEDAL = { 1: [GOLD, GOLD_D, "#7A5208"], 2: ["#D9DCE0", "#AEB4BC", "#4A5160"], 3: ["#E3A26E", "#B8743E", "#5E3218"] };
export function ClassRank({ rank, size = 34 }) {
  const m = MEDAL[rank];
  if (!m) return <span className="cl-rank-n" aria-hidden="true">{rank}</span>;
  return (
    <svg className="cl-rank-m" width={size} height={size} viewBox="0 0 34 34" aria-hidden="true" focusable="false">
      <path d="M10 2h6l3 10h-6zM24 2h-6l-3 10h6z" fill={rank === 1 ? RED : rank === 2 ? BLUE : GREEN} />
      <path d="M10 2h6l3 10h-6z" fill="#000" fillOpacity="0.15" />
      <circle cx="17" cy="21" r="11" fill={m[1]} />
      <circle cx="17" cy="20" r="11" fill={m[0]} />
      <circle cx="17" cy="20" r="7.6" fill="none" stroke={m[1]} strokeWidth="1.4" />
      <text x="17" y="24.2" textAnchor="middle" fontSize="11.5" fontWeight="800" fontFamily="Nunito, system-ui, sans-serif" fill={m[2]}>{rank}</text>
    </svg>
  );
}

/* Алтын жіп сақина: done/total. pathLength=100 — пайызбен. */
export function ClassThreadRing({ done = 0, total = 0, size = 76, label, children, className = "", light = false }) {
  const pct = total > 0 ? Math.round((Math.min(done, total) / total) * 100) : 0;
  return (
    <span className={`cl-ring ${pct === 100 ? "is-full" : ""} ${light ? "is-light" : ""} ${className}`} style={{ width: size, height: size }} role="img" aria-label={label}>
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" focusable="false">
        <circle className="cl-ring-track" cx="32" cy="32" r="29" fill="none" strokeWidth="2" strokeDasharray="2.2 2.6" />
        {pct > 0 && <circle className="cl-ring-fill" cx="32" cy="32" r="29" fill="none" strokeWidth="3.4" strokeLinecap="round" pathLength="100" strokeDasharray={`${pct} 100`} transform="rotate(-90 32 32)" />}
      </svg>
      {children != null && <span className="cl-ring-in">{children}</span>}
    </span>
  );
}

export function ClassHourglass({ size = 14 }) {
  return (
    <svg className="cl-hg" width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M4 2h8M4 14h8M5 2c0 3.2 6 4 6 6s-6 2.8-6 6M11 2c0 3.2-6 4-6 6s6 2.8 6 6" />
    </svg>
  );
}

/* ── Бос күй суреті: 260×170. Киіз қабырға, ағаш жақтаулы тақта, парта, кітап.
   kind тақтадағы «бор жазуын» және алдыңғы бөлшекті өзгертеді. ── */
function Board({ kind }) {
  const chalk = { fill: "none", stroke: CREAM, strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "login") return (
    <g {...chalk}>
      <rect x="114" y="52" width="32" height="26" rx="5" />
      <path d="M120 52v-7a10 10 0 0 1 20 0v7" />
      <path d="M130 62v6" strokeWidth="3" />
    </g>
  );
  if (kind === "setup") return (
    <g {...chalk}>
      <circle cx="122" cy="58" r="9" />
      <path d="M122 43v5M122 68v5M107 58h5M132 58h5M111.5 47.5l3.5 3.5M129 65l3.5 3.5M111.5 68.5l3.5-3.5M129 51l3.5-3.5" />
      <path d="M140 74l12-12M149 59a5 5 0 1 0 6 6" />
    </g>
  );
  if (kind === "student") return (
    <g>
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={96 + i * 12} y="52" width="9" height="13" rx="2.5" fill="none" stroke={CREAM} strokeWidth="1.8" strokeOpacity={i < 3 ? 1 : 0.45} />)}
      {["Q", "Z", "7"].map((c, i) => <text key={i} x={100.5 + i * 12} y="62.4" textAnchor="middle" fontSize="9" fontWeight="800" fontFamily="Nunito, system-ui, sans-serif" fill={GOLD}>{c}</text>)}
      <path d="M100 76h52" stroke={CREAM} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" strokeDasharray="5 5" />
    </g>
  );
  if (kind === "tasks" || kind === "done") return (
    <g {...chalk}>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="100" y={46 + i * 12} width="8" height="8" rx="2" strokeWidth="1.8" />
          {(kind === "done" || i === 0) && <path d={`M101.5 ${50 + i * 12}l2 2 3.5-4`} stroke={GOLD} strokeWidth="2" />}
          <path d={`M114 ${50 + i * 12}h${[38, 30, 34][i]}`} strokeOpacity="0.75" />
        </g>
      ))}
    </g>
  );
  if (kind === "desks") return (
    <g {...chalk}>
      <circle cx="112" cy="56" r="5" /><path d="M104 72c0-5 3.6-8 8-8s8 3 8 8" />
      <circle cx="148" cy="56" r="5" strokeOpacity="0.5" strokeDasharray="3 3" /><path d="M140 72c0-5 3.6-8 8-8s8 3 8 8" strokeOpacity="0.5" strokeDasharray="3 3" />
      <path d="M128 60h6M131 57v6" stroke={GOLD} />
    </g>
  );
  /* teacher: «Сәлем!» орнына әліпби мен қосу белгісі */
  return (
    <g>
      <text x="112" y="68" textAnchor="middle" fontSize="20" fontWeight="800" fontFamily="Unbounded, Nunito, system-ui, sans-serif" fill={CREAM}>Әә</text>
      <path d="M138 61h14M145 54v14" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

export function ClassScene({ kind = "teacher", className = "" }) {
  return (
    <svg className={`cl-scene k-${kind} ${className}`} viewBox="0 0 260 170" aria-hidden="true" focusable="false">
      {/* фон: киіз дақ */}
      <path d="M22 96C14 52 52 16 112 14c58-2 116 16 126 62 9 44-22 78-96 82C70 162 30 140 22 96Z" fill={FELT} />
      <path d="M40 40c6-8 15-13 25-15" fill="none" stroke={FELT2} strokeWidth="3" strokeLinecap="round" />
      {/* тақта ілгіші + қошқар мүйіз ою */}
      <path d="M130 18v10" stroke={WOOD} strokeWidth="2" />
      <g transform="translate(118 8) scale(0.6)"><path d={HORN} fill="none" stroke={GOLD_D} strokeWidth="3" strokeLinecap="round" /></g>
      {/* тақта */}
      <rect x="78" y="30" width="104" height="66" rx="8" fill={WOOD_D} />
      <rect x="78" y="28" width="104" height="66" rx="8" fill={WOOD} />
      <rect x="84" y="34" width="92" height="54" rx="4" fill={BOARD} />
      <path d="M84 80h92v4a4 4 0 0 1-4 4H88a4 4 0 0 1-4-4z" fill={BOARD_D} />
      <Board kind={kind} />
      <rect x="150" y="90" width="16" height="4" rx="2" fill={CREAM} />
      {/* парта */}
      <ellipse cx="132" cy="154" rx="86" ry="6" fill={INK} opacity="0.08" />
      <rect x="62" y="122" width="140" height="10" rx="4" fill={WOOD_L} />
      <rect x="62" y="122" width="140" height="4" rx="2" fill="#C08750" />
      <path d="M74 132v20M190 132v20" stroke={WOOD} strokeWidth="6" strokeLinecap="round" />
      {/* ашық кітап */}
      <g transform="translate(78 104)">
        <path d="M0 18 L22 14 L44 18 L44 2 L22 -2 L0 2Z" fill={RED_D} />
        <path d="M2 16 L22 12 L22 -1 L2 3Z" fill={PAPER} />
        <path d="M42 16 L22 12 L22 -1 L42 3Z" fill="#F7EFDD" />
        <path d="M6 6l12-2.4M6 10l12-2.4M26 3.6l12 2.4M26 7.6l12 2.4" stroke={FELT2} strokeWidth="1.4" strokeLinecap="round" />
      </g>
      {/* оң жақ бөлшек: түріне қарай */}
      {kind === "login" ? (
        <g transform="translate(150 98)">
          <circle cx="10" cy="12" r="8" fill="none" stroke={GOLD_D} strokeWidth="4" />
          <path d="M18 12h22M33 12v7M39 12v5" stroke={GOLD_D} strokeWidth="4" strokeLinecap="round" />
        </g>
      ) : kind === "student" ? (
        <g transform="translate(146 100)">
          <rect x="0" y="0" width="44" height="22" rx="5" fill={RED} />
          <circle cx="0" cy="11" r="4" fill={FELT} /><circle cx="44" cy="11" r="4" fill={FELT} />
          <path d="M10 8h24M10 14h16" stroke={CREAM} strokeWidth="2" strokeLinecap="round" />
        </g>
      ) : kind === "done" ? (
        <g transform="translate(160 92)">
          <circle cx="14" cy="14" r="14" fill={GREEN} />
          <path d="M7.5 14.5l4.5 4.5 9-9.5" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : (
        <g transform="translate(150 96)">
          <rect x="0" y="6" width="20" height="20" rx="4" fill={BLUE} />
          <path d="M5 6V3h10v3" fill="none" stroke={BLUE} strokeWidth="2" />
          <path d="M26 24l14-22" stroke={GOLD_D} strokeWidth="4" strokeLinecap="round" />
          <path d="M38.2 4.8l1.8-2.8" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
      {/* жұлдызша ұшқындар */}
      <path d="M40 70l2.4 5 5 2.4-5 2.4-2.4 5-2.4-5-5-2.4 5-2.4z" fill={GOLD} />
      <path d="M214 46l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z" fill={RED} opacity="0.7" />
      <circle cx="206" cy="104" r="3" fill={BLUE} opacity="0.5" />
    </svg>
  );
}
