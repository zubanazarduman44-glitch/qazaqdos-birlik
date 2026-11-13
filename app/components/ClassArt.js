// «Менің сыныбым» — «Алқа-қотан» суреттері (тек inline SVG, градиентсіз — id қақтығысы болмасын).
// ClassBand       — тұскиіз жиегі: қошқар мүйіз өрнегі бар алтын кесте жолағы.
// ClassMedallion  — алқаның ортасындағы ою-розетка (төрт қошқар мүйіз).
// ClassCushion    — көрпеше/жастық: оқушыға қызыл, төрдегі мұғалімге алтын кестелі.
// ClassSeal       — тапсырма түрінің балауыз мөрі (сабақ — кітап, ойын — асық, өз тапсырмам — қаламұш); done — мөр басылды.
// ClassKindGlyph  — сол белгілердің мөрсіз нұсқасы. ClassThreadRing — алтын жіп сақина-прогресс.
// ClassEmptyCircle — бос алқа-қотан: төр мен айнала бос көрпешелер. ClassHourglass — мерзім белгісі.

const GOLD = "#F2C14E", GOLD_D = "#E0A526", CREAM = "#FFF6DC", RED = "#B8322A", RED_D = "#8A2018", RED_DD = "#6E1712", WINE_DK = "#4E0E0B";
const r1 = (v) => Math.round(v * 10) / 10;

/* Қошқар мүйіз: бағаны (20,23)-те, екі иірім жоғарыда. 40×24 аумақ. */
export const HORN = "M20 23V13C20 7.5 15 4.5 11 6.2C7.6 7.7 8.2 12.4 11.6 12.4C13.6 12.4 14.2 10 12.6 9.3M20 13C20 7.5 25 4.5 29 6.2C32.4 7.7 31.8 12.4 28.4 12.4C26.4 12.4 25.8 10 27.4 9.3M15 23H25";

export function ClassHorn({ size = 40, className = "" }) {
  return (
    <svg className={`cl-horn ${className}`} width={size} height={(size * 26) / 40} viewBox="0 0 40 26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
      <path d={HORN} />
    </svg>
  );
}

export function ClassBand({ id = "cl-band", className = "" }) {
  return (
    <svg className={`cl-band ${className}`} width="100%" height="28" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width="48" height="28" patternUnits="userSpaceOnUse">
          <path d="M0 1.5H48M0 26.5H48" stroke={GOLD_D} strokeWidth="1.2" strokeDasharray="3 2.5" fill="none" />
          <g transform="translate(4 1)"><path d={HORN} fill="none" stroke={GOLD} strokeWidth="1.7" strokeLinecap="round" /></g>
          <path d="M0 10.5l3.5 3.5L0 17.5M48 10.5l-3.5 3.5 3.5 3.5" fill={GOLD_D} stroke="none" />
        </pattern>
      </defs>
      <rect width="100%" height="28" fill={`url(#${id})`} />
    </svg>
  );
}

export function ClassMedallion({ size = 110, className = "" }) {
  const horns = [0, 90, 180, 270];
  return (
    <svg className={`cl-medal ${className}`} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="47" fill={RED_DD} stroke={GOLD_D} strokeWidth="1.4" />
      <circle cx="50" cy="50" r="42" fill="none" stroke={GOLD} strokeWidth="1.1" strokeDasharray="2.4 2.6" />
      {horns.map((a) => (
        <g key={a} transform={`translate(50 50) rotate(${a}) translate(0 -5) scale(1.35) translate(-20 -23)`}>
          <path d={HORN} fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" />
        </g>
      ))}
      {[45, 135, 225, 315].map((a) => (
        <circle key={a} cx={r1(50 + Math.cos((a * Math.PI) / 180) * 28)} cy={r1(50 + Math.sin((a * Math.PI) / 180) * 28)} r="2.2" fill={GOLD_D} />
      ))}
      <path d="M50 43l7 7-7 7-7-7z" fill={RED} stroke={GOLD} strokeWidth="1.3" />
    </svg>
  );
}

/* Көрпеше: 80×26. tor — алтын, ою жиекті. */
export function ClassCushion({ tor = false, empty = false, className = "" }) {
  const body = tor ? GOLD_D : empty ? "#7E1B15" : "#C2382D";
  const top = tor ? GOLD : empty ? "#8E231B" : "#D0463A";
  const trim = tor ? RED_D : GOLD;
  return (
    <svg className={`cl-cushion ${tor ? "is-tor" : ""} ${className}`} viewBox="0 0 80 26" aria-hidden="true" focusable="false">
      <ellipse cx="40" cy="15" rx="38" ry="10" fill={WINE_DK} opacity="0.55" />
      <ellipse cx="40" cy="12.5" rx="37" ry="10" fill={body} />
      <ellipse cx="40" cy="11" rx="34" ry="8" fill={top} />
      <ellipse cx="40" cy="11" rx="27" ry="5.4" fill="none" stroke={trim} strokeWidth="1.2" strokeDasharray={empty ? "2 3" : "3 2"} opacity={empty ? 0.6 : 1} />
      {tor && <path d="M33 11l3.5-3 3.5 3 3.5-3 3.5 3M33 11l3.5 3 3.5-3 3.5 3 3.5-3" fill="none" stroke={RED_D} strokeWidth="1.2" />}
      <circle cx="3.5" cy="12.5" r="2.4" fill={tor ? RED : GOLD_D} />
      <circle cx="76.5" cy="12.5" r="2.4" fill={tor ? RED : GOLD_D} />
    </svg>
  );
}

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

export function ClassKindGlyph({ kind, size = 26, className = "" }) {
  return (
    <svg className={`cl-kglyph ${className}`} width={size} height={size} viewBox="8 8 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <KindPath kind={kind} />
    </svg>
  );
}

/* Балауыз мөр: тұрақты «толқынды» жиек. */
const BLOB = (() => {
  const W = [1, 0.94, 1.03, 0.97, 1.05, 0.95, 1.02, 0.93, 1.04, 0.98, 1.01, 0.95, 1.04, 0.96];
  const n = W.length;
  const pts = W.map((w, i) => { const a = (i / n) * Math.PI * 2; return [20 + Math.cos(a) * 18.4 * w, 20 + Math.sin(a) * 18.4 * w]; });
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p = pts[(i + 1) % n], q = pts[i];
    const mx = (q[0] + p[0]) / 2, my = (q[1] + p[1]) / 2;
    const k = 1.06; // сыртқа сәл дөңес
    d += ` Q${r1(20 + (mx - 20) * k * 1.04)} ${r1(20 + (my - 20) * k * 1.04)} ${r1(p[0])} ${r1(p[1])}`;
  }
  return d + "Z";
})();

export function ClassSeal({ kind, done = false, size = 52, className = "" }) {
  return (
    <svg className={`cl-seal k-${kind} ${done ? "is-done" : ""} ${className}`} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <path d={BLOB} fill={RED_D} transform="translate(0.8 1.4)" />
      <path d={BLOB} fill={done ? RED_D : RED} />
      <circle cx="20" cy="20" r="13" fill="none" stroke={CREAM} strokeOpacity="0.55" strokeWidth="1" strokeDasharray={done ? "none" : "1.6 1.8"} />
      <g fill="none" stroke={CREAM} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity={done ? 0.35 : 1}><KindPath kind={kind} /></g>
      {done && <path d="M13 20.5l4.6 4.6L27.5 15" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
      <path d="M10.5 9.5c2.5-2 5.5-3 8.5-3" fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.6" strokeLinecap="round" />
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

/* Бос алқа-қотан: 320×230. Төрде алтын көрпеше, айнала 8 бос көрпеше, ортасында розетка. */
export function ClassEmptyCircle({ className = "" }) {
  const cx = 160, cy = 122, rx = 132, ry = 84;
  const seats = [-58, -26, 6, 38, 142, 174, 206, 238];
  const cush = (x, y, s, tor, k) => (
    <g key={k} transform={`translate(${r1(x - 40 * s)} ${r1(y - 13 * s)}) scale(${s})`}>
      <ellipse cx="40" cy="15" rx="38" ry="10" fill={WINE_DK} opacity="0.55" />
      <ellipse cx="40" cy="12.5" rx="37" ry="10" fill={tor ? GOLD_D : "#7E1B15"} />
      <ellipse cx="40" cy="11" rx="34" ry="8" fill={tor ? GOLD : "#962A21"} />
      <ellipse cx="40" cy="11" rx="27" ry="5.4" fill="none" stroke={tor ? RED_D : GOLD} strokeWidth="1.2" strokeDasharray="2 3" opacity={tor ? 1 : 0.7} />
      <circle cx="3.5" cy="12.5" r="2.4" fill={tor ? RED : GOLD_D} /><circle cx="76.5" cy="12.5" r="2.4" fill={tor ? RED : GOLD_D} />
    </g>
  );
  return (
    <svg className={`cl-emptyc ${className}`} viewBox="0 0 320 230" aria-hidden="true" focusable="false">
      <ellipse cx={cx} cy={cy + 4} rx={rx + 14} ry={ry + 12} fill={WINE_DK} opacity="0.35" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={GOLD} strokeOpacity="0.55" strokeWidth="1.3" strokeDasharray="4 4" />
      <ellipse cx={cx} cy={cy} rx={rx - 30} ry={ry - 22} fill={RED_DD} opacity="0.6" />
      <g transform={`translate(${cx - 26} ${cy - 26}) scale(0.52)`}>
        <circle cx="50" cy="50" r="42" fill="none" stroke={GOLD} strokeWidth="1.6" strokeDasharray="2.4 2.6" />
        {[0, 90, 180, 270].map((a) => (
          <g key={a} transform={`translate(50 50) rotate(${a}) translate(0 -5) scale(1.35) translate(-20 -23)`}>
            <path d={HORN} fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" />
          </g>
        ))}
      </g>
      {cush(cx, cy - ry, 0.78, true, "tor")}
      {seats.map((d, i) => { const a = (d * Math.PI) / 180; return cush(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, 0.56, false, i); })}
    </svg>
  );
}
