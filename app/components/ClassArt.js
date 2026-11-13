// «Менің сыныбым» — «Жұлдызды аспан» суреттері (тек inline SVG).
// ClassStarfield — тұрақты (seed) жұлдыз өрісі + Құс жолы. Кездейсоқтық модуль жүктелгенде бір рет,
//                  бекітілген seed-пен есептеледі → сервер мен клиентте бірдей (hydration қатесі жоқ).
// ClassPoleStar  — Темірқазық (мұғалім), ClassStarGlyph — оқушы жұлдызы.
// ClassGlyph     — тапсырма түрі: сабақ (кітап-шоқжұлдыз), ойын (орбита-нысана), өз тапсырмам (құйрықты жұлдыз).
// ClassMoon      — мерзім: ай фазасы. ClassOrbit — нүктелі орбита-прогресс.
// ClassDipper    — Жетіқарақшы, ClassPleiades — Үркер (безендіру).

const GOLD = "#F2C14E", GOLD_D = "#E0A526", CREAM = "#FFF6DC", NAVY_L = "#2A4266", WINE = "#B85466", RED = "#B8322A";

function lcg(seed) {
  let s = seed >>> 0;
  return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
}
const r1 = (v) => Math.round(v * 10) / 10;

const FIELD = (() => {
  const rnd = lcg(20261113);
  const out = [];
  for (let i = 0; i < 90; i++) {
    out.push({ x: r1(rnd() * 1000), y: r1(rnd() * 640), r: r1(0.5 + rnd() * rnd() * 1.6), o: r1(0.35 + rnd() * 0.55), tw: i % 9 === 0 });
  }
  // Құс жолы бойындағы тығыз ұсақ жұлдыздар: (0,520) → (1000,40) диагоналі маңы
  for (let i = 0; i < 70; i++) {
    const t = rnd(), off = (rnd() - 0.5) * (rnd() * 120);
    out.push({ x: r1(t * 1000 + off * 0.43), y: r1(520 - t * 480 + off), r: r1(0.4 + rnd() * 0.7), o: r1(0.25 + rnd() * 0.45), tw: false });
  }
  return out;
})();

export function ClassStarfield() {
  return (
    <svg className="cl-field" viewBox="0 0 1000 640" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="cl-mw" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#A9CBE6" stopOpacity="0.24" />
          <stop offset="0.45" stopColor="#6C8FB8" stopOpacity="0.12" />
          <stop offset="1" stopColor="#0E1B2E" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cl-mw2" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={CREAM} stopOpacity="0.13" />
          <stop offset="1" stopColor={CREAM} stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform="rotate(-25.6 500 280)">
        <ellipse cx="500" cy="280" rx="720" ry="96" fill="url(#cl-mw)" />
        <ellipse cx="560" cy="276" rx="420" ry="34" fill="url(#cl-mw2)" />
        <ellipse cx="300" cy="290" rx="220" ry="22" fill="url(#cl-mw2)" />
      </g>
      {FIELD.map((s, i) => (
        <circle key={i} className={s.tw ? "cl-tw" : undefined} style={s.tw ? { "--d": `${(i % 7) * 0.6}s` } : undefined}
          cx={s.x} cy={s.y} r={s.r} fill={CREAM} opacity={s.o} />
      ))}
    </svg>
  );
}

const SPARK = "M12 0C12.9 8.4 15.6 11.1 24 12C15.6 12.9 12.9 15.6 12 24C11.1 15.6 8.4 12.9 0 12C8.4 11.1 11.1 8.4 12 0Z";

export function ClassStarGlyph({ className = "" }) {
  return (
    <svg className={`cl-glyph-star ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={SPARK} fill="currentColor" />
      <circle cx="12" cy="12" r="2.4" fill="#FFFDF4" />
    </svg>
  );
}

export function ClassPoleStar({ size = 64 }) {
  return (
    <svg className="cl-pole-art" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="cl-pg" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={GOLD} stopOpacity="0.55" />
          <stop offset="0.5" stopColor={GOLD_D} stopOpacity="0.14" />
          <stop offset="1" stopColor={GOLD_D} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill="url(#cl-pg)" />
      <path d={SPARK} transform="translate(32 32) rotate(45) scale(1.15) translate(-12 -12)" fill={GOLD} opacity="0.75" />
      <path d={SPARK} transform="translate(32 32) scale(1.9) translate(-12 -12)" fill={CREAM} />
      <circle cx="32" cy="32" r="4" fill="#FFFFFF" />
      <circle cx="32" cy="32" r="9" fill="none" stroke={RED} strokeWidth="1.6" opacity="0.9" />
    </svg>
  );
}

/* Тапсырма түрі — жұлдыз картасы белгілері. currentColor — қараңғы да, ашық та фонда жарайды. */
export function ClassGlyph({ kind, size = 28 }) {
  const dot = (x, y, r = 1.7) => <circle cx={x} cy={y} r={r} fill="currentColor" stroke="none" />;
  return (
    <svg className={`cl-glyph k-${kind}`} width={size} height={size} viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {kind === "lesson" ? (
        <>
          <path d="M3 7.5 L14 10 L25 7.5 L25 21 L14 23.5 L3 21 Z" opacity="0.55" />
          <path d="M14 10 V23.5" opacity="0.55" />
          {dot(3, 7.5)}{dot(14, 10, 2.1)}{dot(25, 7.5)}{dot(25, 21)}{dot(14, 23.5, 2.1)}{dot(3, 21)}
          <path d="M14 2.5 l0.9 2.1 2.1 0.9 -2.1 0.9 -0.9 2.1 -0.9 -2.1 -2.1 -0.9 2.1 -0.9Z" fill="currentColor" stroke="none" />
        </>
      ) : kind === "game" ? (
        <>
          <circle cx="14" cy="14" r="10.5" strokeDasharray="1.2 3.2" />
          <circle cx="14" cy="14" r="5.5" opacity="0.6" />
          <path d="M14 9.6 l1.1 3.3 3.3 1.1 -3.3 1.1 -1.1 3.3 -1.1 -3.3 -3.3 -1.1 3.3 -1.1Z" fill="currentColor" stroke="none" />
          {dot(23.3, 9.1, 2.3)}
        </>
      ) : (
        <>
          <path d="M4 24 L17 11" opacity="0.4" strokeWidth="3.2" />
          <path d="M6.5 23 L17.5 12" opacity="0.8" />
          {dot(5, 23, 1.2)}{dot(9, 19.2, 1)}
          <path d="M20 3 l1.5 4.5 4.5 1.5 -4.5 1.5 -1.5 4.5 -1.5 -4.5 -4.5 -1.5 4.5 -1.5Z" fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  );
}

/* Мерзім → ай фазасы. late — тұтылу (шарап түсті). days: бүгінге дейін қалған күн. */
export function ClassMoon({ days, late, size = 18 }) {
  const lit = late ? null
    : days <= 0 ? <circle cx="9" cy="9" r="7" fill={CREAM} />
    : days <= 2 ? <path d="M9 2 A7 7 0 0 1 9 16 A4 7 0 0 1 9 2Z" fill={CREAM} />
    : days <= 6 ? <path d="M9 2 A7 7 0 0 1 9 16 Z" fill={CREAM} />
    : <path d="M9 2 A7 7 0 0 1 9 16 A4.6 7 0 0 0 9 2Z" fill={CREAM} />;
  return (
    <svg className="cl-moon" width={size} height={size} viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      {late ? (
        <>
          <circle cx="9" cy="9" r="7.4" fill="none" stroke="#F1A6B4" strokeWidth="1.3" />
          <circle cx="9" cy="9" r="5.6" fill={WINE} />
          <circle cx="11" cy="8" r="4.6" fill="#3A1C2B" />
        </>
      ) : (
        <>
          <circle cx="9" cy="9" r="7" fill={NAVY_L} stroke="rgba(255,246,220,0.55)" strokeWidth="1" />
          {lit}
        </>
      )}
    </svg>
  );
}

/* Нүктелі орбита: done/total. 24 нүктеден көп болмайды. Ортасындағы мәтін — HTML (children). */
export function ClassOrbit({ done = 0, total = 0, size = 64, label, children, className = "" }) {
  const n = total > 0 ? Math.min(total, 24) : 12;
  const on = total > 0 ? Math.round((Math.min(done, total) / total) * n) : 0;
  const c = 32, R = 27;
  return (
    <span className={`cl-orbit ${on === n && total > 0 ? "is-full" : ""} ${className}`} style={{ width: size, height: size }} role="img" aria-label={label}>
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" focusable="false">
        <circle cx={c} cy={c} r={R} fill="none" stroke="rgba(255,246,220,0.12)" strokeWidth="1" />
        {Array.from({ length: n }, (_, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          const x = r1(c + Math.cos(a) * R), y = r1(c + Math.sin(a) * R);
          return i < on
            ? <circle key={i} className="cl-orbit-on" style={{ "--i": i }} cx={x} cy={y} r={n > 16 ? 2.4 : 3.1} />
            : <circle key={i} className="cl-orbit-off" cx={x} cy={y} r={n > 16 ? 1.4 : 1.8} />;
        })}
      </svg>
      {children != null && <span className="cl-orbit-in">{children}</span>}
    </span>
  );
}

/* Жетіқарақшы — жеті қарақшы. Безендіру. */
export function ClassDipper({ className = "" }) {
  const P = [[8, 62], [40, 58], [64, 66], [88, 70], [118, 66], [128, 92], [100, 100]];
  return (
    <svg className={`cl-dipper ${className}`} viewBox="0 0 140 110" aria-hidden="true" focusable="false">
      <polyline points={P.map((p) => p.join(",")).join(" ") + " 88,70"} fill="none" stroke={CREAM} strokeOpacity="0.28" strokeWidth="1" strokeDasharray="2 3" />
      {P.map(([x, y], i) => <circle key={i} className={i === 3 ? "cl-tw" : undefined} style={{ "--d": "1.4s" }} cx={x} cy={y} r={i === 3 ? 2.1 : 2.7} fill={i % 3 === 0 ? GOLD : CREAM} />)}
    </svg>
  );
}

/* Үркер — шағын шоғыр. */
export function ClassPleiades({ className = "" }) {
  const P = [[10, 14, 2.4], [22, 8, 1.8], [30, 18, 2.2], [18, 24, 1.6], [38, 10, 1.5], [6, 28, 1.3], [28, 30, 1.4]];
  return (
    <svg className={`cl-pleiades ${className}`} viewBox="0 0 44 36" aria-hidden="true" focusable="false">
      {P.map(([x, y, r], i) => <circle key={i} className={i === 2 ? "cl-tw" : undefined} style={{ "--d": "0.7s" }} cx={x} cy={y} r={r} fill={i === 0 ? GOLD : "#CFE3F2"} />)}
    </svg>
  );
}
