// «Менің сыныбым» — киіз-аппликация суреттері.
// ClassAul     — ауыл: үлкен киіз үй (сынып), шағын үйлер, төбелер, күн. Жамау тігісі — ақшыл үзік сызық.
// ClassTaskArt — тапсырма түрі: сабақ (кітап), ойын (жамбы — садақпен атылатын нысана), өз тапсырмам (орам + қалам).
// ClassRing    — аватар айналасындағы шағын прогресс шеңбері.
// ClassSealRim — мөрдің ою жиегі (код ортасында HTML мәтін болып тұрады).

const RED = "#B8322A", RED_D = "#8A2018", GOLD = "#E0A526", PGOLD = "#F6E3B0", BLUE = "#0F5E7A", BLUE_L = "#3E8AA6",
  CREAM = "#FFFDF7", FELT = "#F4ECDA", OK = "#2F6B4F", OK_L = "#5E9277", WOOD = "#8A5326", INK = "#1F2430";

const stitch = { fill: "none", stroke: CREAM, strokeWidth: 1.6, strokeDasharray: "3 3", strokeLinecap: "round", opacity: 0.9 };

function Yurt({ x, y, s = 1, wall = CREAM, band = RED, door = RED_D, roof = CREAM }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* күмбез */}
      <path d="M-62 -20 Q-56 -62 0 -74 Q56 -62 62 -20Z" fill={roof} />
      <path d="M-50 -28 Q-44 -58 0 -66 Q44 -58 50 -28" {...stitch} stroke={PGOLD} opacity="1" />
      {/* шаңырақ */}
      <ellipse cx="0" cy="-73" rx="14" ry="4.5" fill={GOLD} />
      <path d="M-8 -73 h16 M0 -77 v8" stroke={RED_D} strokeWidth="1.6" strokeLinecap="round" />
      {/* бау */}
      <rect x="-64" y="-24" width="128" height="10" rx="2" fill={band} />
      <path d="M-58 -19 h116" {...stitch} />
      {/* кереге */}
      <rect x="-60" y="-14" width="120" height="44" fill={wall} />
      <path d="M-60 -14 l12 14 l12 -14 l12 14 l12 -14 l12 14 l12 -14 l12 14 l12 -14 l12 14 l12 -14 M-60 0 l12 14 l12 -14 l12 14 l12 -14 l12 14 l12 -14 l12 14 l12 -14 l12 14 l12 -14" fill="none" stroke={PGOLD} strokeWidth="2" strokeLinejoin="round" />
      {/* есік */}
      <path d="M-14 30 V-4 Q0 -14 14 -4 V30Z" fill={door} />
      <path d="M-9 26 V-1 Q0 -8 9 -1 V26" {...stitch} />
      <path d="M-4 10 q4 -6 8 0 q-4 6 -8 0Z" fill={GOLD} />
    </g>
  );
}

export function ClassAul({ className = "", night = false }) {
  return (
    <svg className={`cl-aul-art ${className}`} viewBox="0 0 320 190" aria-hidden="true" focusable="false">
      {/* күн */}
      <g className="cl-sun">
        <circle cx="250" cy="46" r="22" fill={night ? PGOLD : GOLD} />
        <circle cx="250" cy="46" r="30" fill="none" stroke={GOLD} strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
      </g>
      {/* құстар */}
      <g className="cl-birds" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" opacity=".55">
        <path d="M58 40 q6 -6 12 0 q6 -6 12 0" />
        <path d="M92 26 q4 -4 8 0 q4 -4 8 0" />
      </g>
      {/* төбелер */}
      <path d="M-4 150 Q60 96 140 128 Q210 92 324 132 V194 H-4Z" fill={OK_L} />
      <path d="M10 140 Q60 104 128 130" {...stitch} />
      <path d="M-4 168 Q90 132 190 160 Q260 140 324 156 V194 H-4Z" fill={OK} />
      <path d="M200 158 Q260 142 312 154" {...stitch} />
      {/* шағын үйлер */}
      <Yurt x={62} y={144} s={0.42} wall={FELT} band={BLUE} door={BLUE} />
      <Yurt x={262} y={150} s={0.36} wall={FELT} band={BLUE} door={BLUE} />
      {/* басты үй — сынып */}
      <Yurt x={164} y={150} s={0.9} />
      {/* түтін */}
      <g className="cl-smoke" fill={CREAM} opacity=".85">
        <circle cx="164" cy="74" r="5" /><circle cx="170" cy="64" r="4" /><circle cx="166" cy="55" r="3" />
      </g>
    </svg>
  );
}

export function ClassTaskArt({ kind, size = 56 }) {
  return (
    <svg className={`cl-kind-art k-${kind}`} viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" focusable="false">
      {kind === "lesson" ? (
        <g>
          <path d="M6 18 Q19 12 32 18 Q45 12 58 18 V52 Q45 46 32 52 Q19 46 6 52Z" fill={BLUE} />
          <path d="M9 16 Q20 10 31 16 V48 Q20 42 9 48Z" fill={CREAM} />
          <path d="M33 16 Q44 10 55 16 V48 Q44 42 33 48Z" fill={FELT} />
          <path d="M14 22 q8 -3 13 0 M14 29 q8 -3 13 0 M14 36 q6 -2 10 0" fill="none" stroke={BLUE_L} strokeWidth="2" strokeLinecap="round" />
          <path d="M44 22 c-4 -4 -9 0 -5 4 c4 3 9 -1 5 -4 M44 22 c4 -4 9 0 5 4 c-4 3 -9 -1 -5 -4" fill="none" stroke={RED} strokeWidth="2" strokeLinecap="round" />
          <path d="M38 36 h12 M40 41 h8" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M46 10 V30 l-3 -3 l-3 3 V10Z" fill={RED} transform="translate(4 0)" />
          <path d="M7 50 Q19 44 32 50 Q45 44 57 50" {...stitch} stroke={PGOLD} />
        </g>
      ) : kind === "game" ? (
        <g>
          {/* жамбы: жіпке ілінген алтын құйма, оны садақ оғы тесіп өткен */}
          <path d="M32 4 V14" stroke={WOOD} strokeWidth="2" />
          <path d="M18 14 H46 L54 30 L46 46 H18 L10 30Z" fill={GOLD} />
          <path d="M21 18 H43 L49 30 L43 42 H21 L15 30Z" fill="none" {...stitch} stroke={CREAM} />
          <circle cx="32" cy="30" r="9" fill={RED} />
          <circle cx="32" cy="30" r="4" fill={CREAM} />
          <g className="cl-arrow">
            <path d="M4 52 L32 30" stroke={WOOD} strokeWidth="3" strokeLinecap="round" />
            <path d="M3 48 l-1 7 l7 -1 Z M7 46 l-2 6 l6 -1Z" fill={BLUE} />
          </g>
          <path d="M32 30 l5 -4" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          {/* орам мен қалам */}
          <rect x="10" y="12" width="40" height="42" rx="4" fill={CREAM} />
          <rect x="6" y="8" width="48" height="8" rx="4" fill={RED} />
          <rect x="6" y="50" width="48" height="8" rx="4" fill={RED} />
          <path d="M10 12 h40" {...stitch} stroke={PGOLD} />
          <path d="M16 24 h22 M16 31 h18 M16 38 h12" stroke={BLUE_L} strokeWidth="2.4" strokeLinecap="round" />
          <g transform="rotate(38 48 34)">
            <rect x="44" y="12" width="8" height="34" rx="2" fill={BLUE} />
            <path d="M44 46 h8 l-4 9Z" fill={GOLD} />
            <rect x="44" y="12" width="8" height="5" fill={GOLD} />
          </g>
        </g>
      )}
    </svg>
  );
}

// Аватар айналасындағы прогресс шеңбері (0..1)
export function ClassRing({ value = 0, size = 72, stroke = 5, children, full = false }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value || 0));
  return (
    <span className={`cl-ring ${full || v >= 1 ? "is-full" : ""}`} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden="true" focusable="false">
        <circle className="cl-ring-bg" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
        <circle className="cl-ring-fg" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${c} ${c}`} strokeDashoffset={c * (1 - v)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <span className="cl-ring-in">{children}</span>
    </span>
  );
}

// Мөрдің ою жиегі: 24 жапырақты розетка, ішкі сақина, төрт жақта қошқар мүйіз
export function ClassSealRim() {
  const petals = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    return <circle key={i} cx={100 + Math.cos(a) * 88} cy={100 + Math.sin(a) * 88} r="9" />;
  });
  return (
    <svg className="cl-seal-rim" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <g fill="currentColor">{petals}</g>
      <circle cx="100" cy="100" r="88" fill="currentColor" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="#FFFDF7" strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="100" cy="100" r="70" fill="none" stroke="#FFFDF7" strokeWidth="1.4" opacity=".5" />
      <g fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round">
        {[0, 90, 180, 270].map((d) => (
          <path key={d} transform={`rotate(${d} 100 100)`} d="M100 24 c-6 -6 -14 -2 -10 4 c3 3 7 0 5 -2 M100 24 c6 -6 14 -2 10 4 c-3 3 -7 0 -5 -2" />
        ))}
      </g>
    </svg>
  );
}
