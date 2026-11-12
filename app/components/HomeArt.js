"use client";
// Басты беттің киіз-аппликация суреттері.
// HomeYurt  — киіз үйдің іші («төр»): шаңырақтағы аспан тәуліктің уақытын көрсетеді,
//             уықтар бүгінгі XP-мен алтынға боялады, ошақ оты — серия, тұс киіздегі жамаулар — мөрлер.
// HomeFlame — ошақ (серия карточкасы). HomeChest — сандық (тапсырма сыйлығы).
import { useEffect, useId, useState } from "react";
import { Dombyra } from "./NatArt";

const WOOD = "#8A5326", WOOD_D = "#6B3B1C", GOLD = "#E0A526", PGOLD = "#F6E3B0", RED = "#B8322A", RED_D = "#8A2018", BLUE = "#0F5E7A", CREAM = "#FFFDF7";

// Тәулік бөлігі: SSR-де «күн», клиентте нақты сағатпен ауысады (гидрация қатесіз)
export function useDayPhase() {
  const [phase, setPhase] = useState("day");
  useEffect(() => {
    const h = new Date().getHours();
    setPhase(h >= 5 && h < 10 ? "morning" : h >= 10 && h < 17 ? "day" : h >= 17 && h < 21 ? "evening" : "night");
  }, []);
  return phase;
}

const SKIES = {
  morning: ["#F7C9A0", "#FBE6C4", "#FFF3DA"],
  day: ["#4FA9C9", "#9ED3E3", "#E3F3F4"],
  evening: ["#8A2F4A", "#E0703A", "#F6C26A"],
  night: ["#0D1A3A", "#1D2F5E", "#2E4378"],
};
// Шаңырақ ішіндегі күн/ай орны (шеңбер ортасы 320,80)
const ORB = { morning: [292, 104, 13], day: [334, 58, 13], evening: [350, 104, 14], night: [302, 64, 10] };

/* ── От: негізі (0,0), биіктігі ~92 · s ── */
function Fire({ lit, s = 1, sparks = true }) {
  return (
    <g className={`hf ${lit ? "hf-on" : "hf-off"}`}>
      <g className="hf-logs">
        <rect x="-34" y="-7" width="68" height="11" rx="5.5" fill={WOOD_D} transform="rotate(-12)" />
        <rect x="-34" y="-7" width="68" height="11" rx="5.5" fill={WOOD} transform="rotate(12)" />
      </g>
      <ellipse className="hf-coal" cx="0" cy="-2" rx="26" ry="7" fill="#F08A2C" />
      {lit && (
        <g transform={`scale(${s})`}>
          <path className="hf-l hf-l1" d="M0 0C-30 0-40-22-32-44C-26-58-14-62-12-80C-2-70 2-58 0-46C8-56 14-70 10-92C28-76 40-52 36-28C34-10 22 0 0 0Z" fill={RED} />
          <path className="hf-l hf-l2" d="M0 0C-20 0-27-16-22-32C-18-42-10-46-8-58C0-50 3-42 2-34C8-42 12-50 10-64C22-52 28-36 25-20C23-7 15 0 0 0Z" fill="#E8762B" />
          <path className="hf-l hf-l3" d="M0 0C-12 0-17-10-14-20C-11-28-5-31-4-40C3-33 6-26 5-20C9-25 11-30 10-36C16-28 18-18 16-11C14-4 9 0 0 0Z" fill={GOLD} />
          <path className="hf-l hf-l4" d="M0-2C-6-2-8-7-6-12C-4-17 0-20 0-24C4-19 7-14 6-9C5-4 3-2 0-2Z" fill="#FFE7A8" />
        </g>
      )}
      {lit && sparks && (
        <g className="hf-sparks" fill={GOLD}>
          {[[-14, -40, 0], [10, -56, 0.7], [18, -30, 1.3], [-6, -64, 1.9], [4, -36, 2.5]].map(([x, y, d], i) => (
            <circle key={i} cx={x * s} cy={y * s} r={i % 2 ? 2 : 2.6} style={{ animationDelay: `${d}s` }} />
          ))}
        </g>
      )}
    </g>
  );
}

const Stones = () => (
  <g fill="#7D7466">
    {[[-40, 4, 10], [-24, 9, 9], [-4, 11, 10], [16, 10, 9], [34, 6, 10], [44, -1, 7], [-48, -2, 7]].map(([x, y, r], i) => (
      <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.62} fill={i % 2 ? "#8C8274" : "#6F675B"} />
    ))}
  </g>
);

/* ── Серия карточкасының ошағы ── */
export function HomeFlame({ lit, streak = 0 }) {
  const s = lit ? 0.82 + Math.min(streak, 14) * 0.02 : 0.6;
  return (
    <svg className="hm-flame" viewBox="-70 -118 140 140" aria-hidden="true" focusable="false">
      <circle className="hf-halo" cx="0" cy="-34" r="62" fill={lit ? "#F6C26A" : "#F08A2C"} opacity={lit ? 0.35 : 0.1} />
      <ellipse cx="0" cy="10" rx="58" ry="9" fill="#2A1A10" opacity=".12" />
      <Fire lit={lit} s={s} />
      <Stones />
    </svg>
  );
}

/* ── Сандық: тапсырма сыйлығы ── */
export function HomeChest({ open, ready }) {
  return (
    <svg className={`hm-chest${open ? " open" : ""}${ready ? " ready" : ""}`} viewBox="0 0 64 56" width="52" height="46" aria-hidden="true" focusable="false">
      <ellipse cx="32" cy="53" rx="24" ry="3" fill="#2A1A10" opacity=".14" />
      {open && <circle cx="32" cy="20" r="16" fill={GOLD} opacity=".35" />}
      <rect x="8" y="24" width="48" height="27" rx="4" fill={RED} />
      <rect x="8" y="24" width="48" height="27" rx="4" fill="none" stroke={RED_D} strokeWidth="2" />
      <path d="M14 38c0-6 6-8 8-4M50 38c0-6-6-8-8-4" fill="none" stroke={GOLD} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M32 31l4 4-4 4-4-4z" fill={GOLD} />
      <g className="hm-lid">
        {open ? (
          <>
            <path d="M8 24 L14 8 H50 L56 24Z" fill={RED_D} />
            <circle cx="26" cy="22" r="4" fill={GOLD} /><circle cx="35" cy="21" r="4" fill="#F0BE45" /><circle cx="41" cy="23" r="3.4" fill={GOLD} />
          </>
        ) : (
          <>
            <path d="M8 24 C8 12 16 8 32 8 S56 12 56 24Z" fill={RED_D} />
            <path d="M10 22 C12 14 20 11 32 11 S52 14 54 22" fill="none" stroke={GOLD} strokeWidth="1.6" strokeDasharray="2 3" />
          </>
        )}
      </g>
      <rect x="28" y="22" width="8" height="8" rx="2" fill={GOLD} />
    </svg>
  );
}

/* ── Киіз үйдің іші ── */
const C0 = [320, 80], RS = 58;
const DOME = "M20 440V258Q20 242 36 234L268 106A58 58 0 1 1 372 106L604 234Q620 242 620 258V440Z";
const wallTop = (t) => [20 + 600 * t, 236 + 128 * t * (1 - t)];
const ROOF = "M0 0H640V236H620Q320 300 20 236H0Z M370 80A50 50 0 1 0 270 80A50 50 0 1 0 370 80Z";
const WALL = "M0 236H20Q320 300 620 236H640V500H0Z";
const BAND = "M20 236Q320 300 620 236";
const POLES = 13;

export default function HomeYurt({ phase = "day", xp = 0, goal = 50, lit = false, streak = 0, stamps = 0, stampTotal = 20 }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const u = (n) => `url(#${id}${n})`;
  const sky = SKIES[phase] || SKIES.day;
  const [ox, oy, orr] = ORB[phase] || ORB.day;
  const night = phase === "night";
  const litPoles = Math.round((Math.min(xp, goal) / goal) * POLES);
  const mid = (POLES - 1) / 2;
  // Ортадағы уықтан бастап шетке қарай жанады
  const poles = Array.from({ length: POLES }, (_, i) => {
    const t = i / (POLES - 1);
    const a = ((165 - t * 150) * Math.PI) / 180;
    const [x2, y2] = wallTop(t);
    const rank = Math.abs(i - mid) * 2 - (i < mid ? 1 : 0);
    return { i, x1: C0[0] + RS * Math.cos(a), y1: C0[1] + RS * Math.sin(a), x2, y2, rank: Math.max(0, rank) };
  });
  const fireS = lit ? 0.95 + Math.min(streak, 14) * 0.035 : 0.7;
  const cols = 5, rows = Math.ceil(stampTotal / cols);

  return (
    <svg className={`hm-yurt ph-${phase}`} viewBox="0 0 640 440" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`${id}dome`}><path d={DOME} /></clipPath>
        <clipPath id={`${id}hole`}><circle cx={C0[0]} cy={C0[1]} r="50" /></clipPath>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} /><stop offset=".6" stopColor={sky[1]} /><stop offset="1" stopColor={sky[2]} />
        </linearGradient>
        <linearGradient id={`${id}roof`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF6E2" /><stop offset="1" stopColor="#EAD5AC" />
        </linearGradient>
        <linearGradient id={`${id}beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={night ? "#BFD3FF" : "#FFF7DC"} stopOpacity={night ? 0.35 : 0.85} />
          <stop offset="1" stopColor={night ? "#BFD3FF" : "#FFF7DC"} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFB547" stopOpacity=".75" /><stop offset=".5" stopColor="#F08A2C" stopOpacity=".22" /><stop offset="1" stopColor="#F08A2C" stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}lat`} width="26" height="22" patternUnits="userSpaceOnUse">
          <path d="M-2 -1.7L28 23.7M28 -1.7L-2 23.7" stroke={WOOD} strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="13" cy="11" r="2.2" fill={WOOD_D} />
        </pattern>
        <pattern id={`${id}felt`} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r=".7" fill="#7A5A2A" opacity=".18" /><circle cx="4.5" cy="4.2" r=".6" fill="#fff" opacity=".35" />
        </pattern>
      </defs>

      {/* сыртқы көлеңке — киіз үйдің сұлбасы */}
      <path d={DOME} transform="translate(0 6)" fill="#3A2412" opacity=".12" />

      <g clipPath={u("dome")}>
        {/* Шаңырақтағы аспан */}
        <g clipPath={u("hole")}>
          <rect x="260" y="20" width="120" height="120" fill={u("sky")} />
          {night && (
            <g fill="#FFF6D8" className="hy-stars">
              {[[296, 50], [340, 44], [352, 74], [286, 86], [326, 104], [312, 38]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 2 ? 1.1 : 1.6} style={{ animationDelay: `${i * 0.5}s` }} />)}
            </g>
          )}
          {night ? (
            <g><circle cx={ox} cy={oy} r={orr} fill="#FFF3C9" /><circle cx={ox + 5} cy={oy - 3} r={orr} fill={sky[1]} /></g>
          ) : (
            <g className="hy-sun"><circle cx={ox} cy={oy} r={orr + 6} fill="#FFF3C0" opacity=".45" /><circle cx={ox} cy={oy} r={orr} fill={phase === "evening" ? "#FFD27A" : "#FFD35A"} /></g>
          )}
          <g className="hy-cloud" fill="#fff" opacity={night ? 0.18 : 0.85}>
            <ellipse cx="300" cy="72" rx="20" ry="6" /><ellipse cx="312" cy="67" rx="12" ry="6" />
          </g>
        </g>

        {/* Шатыр киізі (уықтар арасы) */}
        <path d={ROOF} fill={u("roof")} fillRule="evenodd" />
        <path d={ROOF} fill={u("felt")} fillRule="evenodd" />

        {/* Уықтар: бүгінгі XP-мен алтынға боялады */}
        <g className="hy-poles" strokeLinecap="round">
          {poles.map((p) => (
            <g key={p.i}>
              <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke={WOOD} strokeWidth="7" />
              <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke={WOOD_D} strokeWidth="2" opacity=".35" transform="translate(1.6 1.2)" />
              {p.rank < litPoles && (
                <g className="hy-pole-on" style={{ animationDelay: `${0.5 + p.rank * 0.09}s` }}>
                  <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke={GOLD} strokeWidth="7" />
                  <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke="#FFE7A0" strokeWidth="2" transform="translate(-1.4 -1)" />
                </g>
              )}
            </g>
          ))}
        </g>

        {/* Кереге (тор қабырға) */}
        <path d={WALL} fill="#D9BC8A" />
        <path d={WALL} fill={u("lat")} />
        {/* Басқұр — кереге басындағы өрнекті бау */}
        <path d={BAND} fill="none" stroke={RED_D} strokeWidth="12" />
        <path d={BAND} fill="none" stroke={GOLD} strokeWidth="3" strokeDasharray="8 7" />

        {/* Жарық шоғы */}
        <path className="hy-beam" d="M286 116L354 116L452 440L188 440Z" fill={u("beam")} />

        {/* Тұс киіз — мөрлер жамау болып тігіледі */}
        <g className="hy-tus" transform="translate(62 262) rotate(-1.5)">
          <path d="M8 -6 V2 M128 -6 V2" stroke={WOOD_D} strokeWidth="2" />
          <rect x="0" y="0" width="136" height={rows * 19 + 18} rx="5" fill={RED_D} />
          <rect x="4" y="4" width="128" height={rows * 19 + 10} rx="3" fill="none" stroke={GOLD} strokeWidth="1.6" strokeDasharray="4 3" />
          {Array.from({ length: stampTotal }, (_, k) => {
            const c = k % cols, r = Math.floor(k / cols);
            const x = 12 + c * 24, y = 10 + r * 19;
            return k < stamps ? (
              <g key={k} className="hy-patch" style={{ animationDelay: `${0.8 + k * 0.05}s` }}>
                <rect x={x} y={y} width="17" height="14" rx="2.5" fill={GOLD} />
                <path d={`M${x + 8.5} ${y + 11}v-4c0-3-4-3.6-4.2-.9M${x + 8.5} ${y + 7}c0-3 4-3.6 4.2-.9`} fill="none" stroke={RED_D} strokeWidth="1.4" strokeLinecap="round" />
              </g>
            ) : (
              <rect key={k} x={x} y={y} width="17" height="14" rx="2.5" fill="none" stroke={PGOLD} strokeOpacity=".55" strokeWidth="1.2" strokeDasharray="2.4 2.2" />
            );
          })}
          {[14, 40, 66, 92, 118].map((x) => <path key={x} d={`M${x} ${rows * 19 + 18}v7`} stroke={GOLD} strokeWidth="2.4" strokeLinecap="round" />)}
        </g>

        {/* Домбыра керегеде ілулі */}
        <g transform="translate(236 394) rotate(-10) scale(.6) translate(-100 -166)"><Dombyra /></g>

        {/* Еден мен сырмақ */}
        <path d="M0 356Q320 440 640 356V460H0Z" fill="#6B3B1C" />
        <ellipse cx="320" cy="430" rx="262" ry="44" fill={BLUE} />
        <ellipse cx="320" cy="430" rx="248" ry="36" fill="none" stroke={PGOLD} strokeWidth="2" strokeDasharray="6 6" opacity=".8" />
        {[-180, -96, 96, 180].map((dx) => (
          <path key={dx} d={`M${320 + dx} 434c0-8-8-10-10-4M${320 + dx} 434c0-8 8-10 10-4`} fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
        ))}

        {/* Сандық — Ақыл осының үстінде отырады */}
        <g transform="translate(470 330)">
          <rect x="0" y="0" width="120" height="58" rx="6" fill={RED} />
          <rect x="0" y="0" width="120" height="12" rx="5" fill={RED_D} />
          <path d="M18 40c0-12 14-15 16-6M102 40c0-12-14-15-16-6" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
          <path d="M60 22l9 9-9 9-9-9z" fill={GOLD} />
          <rect x="4" y="50" width="112" height="8" rx="3" fill={RED_D} />
        </g>

        {/* Түнде іш күңгірттенеді, от жарығы күшейеді */}
        {night && <rect width="640" height="440" fill="#1A1F4A" opacity=".24" />}
        {phase === "evening" && <rect width="640" height="440" fill="#8A2F4A" opacity=".08" />}
        <ellipse className="hy-glow" cx="320" cy="380" rx={lit ? 170 : 90} ry={lit ? 120 : 60} fill={u("glow")} opacity={lit ? 1 : 0.5} />

        {/* Түтін шаңыраққа қарай көтеріледі */}
        {lit && (
          <g className="hy-smoke" fill={night ? "#C9D3EA" : "#FFFFFF"}>
            {[0, 1, 2].map((i) => <ellipse key={i} cx="320" cy="318" rx="10" ry="7" style={{ animationDelay: `${i * 2}s` }} />)}
          </g>
        )}

        {/* Ошақ */}
        <g transform="translate(320 412)">
          <ellipse cx="0" cy="10" rx="66" ry="12" fill="#2A1A10" opacity=".25" />
          <Fire lit={lit} s={fireS} />
          <Stones />
        </g>
      </g>

      {/* Шаңырақ */}
      <g className="hy-shanyrak">
        <g clipPath={u("hole")} stroke={WOOD_D} strokeWidth="3.4" fill="none" strokeLinecap="round">
          <path d="M306 22Q300 80 306 138M334 22Q340 80 334 138" />
          <path d="M262 66Q320 60 378 66M262 94Q320 100 378 94" />
        </g>
        <circle cx={C0[0]} cy={C0[1]} r="54" fill="none" stroke={WOOD_D} strokeWidth="11" />
        <circle cx={C0[0]} cy={C0[1]} r="54" fill="none" stroke={litPoles >= POLES ? GOLD : WOOD} strokeWidth="6" className={litPoles >= POLES ? "hy-crown" : ""} />
        <circle cx={C0[0]} cy={C0[1]} r="54" fill="none" stroke={PGOLD} strokeWidth="1.6" strokeDasharray="2 6" opacity=".9" />
      </g>
    </svg>
  );
}
