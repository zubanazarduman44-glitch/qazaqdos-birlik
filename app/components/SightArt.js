"use client";
// Көрікті жерлердің суреттері: жалпақ, қабатты пейзаждар (саяхат плакаттарының бір сериясы).
// <SightArt kind="canyon" />        — карточка (360×200)
// <SightArt kind="canyon" wide />   — кең баннер (hero)
// <SightArt kind="canyon" mini />   — 40px белгіше (тек басты нысан, анимациясыз)
import { useEffect, useId, useRef } from "react";
// Тек түр картасы (мәтіндері бар lib/sights.js бұл бетке жүктелмейді)
import { SIGHT_KINDS, SIGHT_KIND } from "../../lib/sightKinds";

export { SIGHT_KINDS };

export function kindOf(sight) {
  const k = sight && SIGHT_KIND[sight.en];
  return k && SIGHT_KINDS.includes(k) ? k : "steppeReserve";
}

/* ── Геометрия көмекшілері (детерминді: SSR мен клиент бірдей) ── */
const X0 = -460, X1 = 660, YB = 232;
const f1 = (n) => Math.round(n * 10) / 10;
function rnd(seed, i) {
  const x = Math.sin(seed * 91.7 + i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
// Жұмсақ төбелер
function hills(base, amp, seed, step = 60, x0 = X0, x1 = X1) {
  const p = [];
  for (let x = x0, i = 0; x <= x1 + step; x += step, i++) p.push([x, base - amp * rnd(seed, i)]);
  let d = `M${x0} ${YB}L${p[0][0]} ${f1(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const [ax, ay] = p[i], [bx, by] = p[i + 1];
    d += `Q${ax} ${f1(ay)} ${f1((ax + bx) / 2)} ${f1((ay + by) / 2)}`;
  }
  return d + `L${p[p.length - 1][0]} ${YB}Z`;
}
// Үшкір шыңдар: нүктелер тізімі
function jagPts(base, amp, seed, step = 46, x0 = X0, x1 = X1) {
  const p = [];
  for (let x = x0, i = 0; x <= x1 + step; x += step / 2, i++) {
    const hi = i % 2 === 0;
    p.push([x + (rnd(seed, i + 50) - 0.5) * step * 0.3, base - (hi ? amp * (0.35 + 0.65 * rnd(seed, i)) : amp * 0.18 * rnd(seed, i))]);
  }
  return p;
}
const ptsPath = (p) => `M${p[0][0]} ${YB}` + p.map(([x, y]) => `L${f1(x)} ${f1(y)}`).join("") + `L${p[p.length - 1][0]} ${YB}Z`;
// Шыңдардағы қар
function capsPath(p, k = 0.34, minH = 0) {
  let d = "";
  for (let i = 1; i < p.length - 1; i++) {
    const [px, py] = p[i], [ax, ay] = p[i - 1], [bx, by] = p[i + 1];
    if (py > ay || py > by || (minH && py > minH)) continue;
    const L = (t, q) => [px + (q[0] - px) * t, py + (q[1] - py) * t];
    const A = L(k, [ax, ay]), C = L(k, [bx, by]), F = L(k * 0.55, [ax, ay]), D = L(k * 0.55, [bx, by]);
    const mid = [px + (rnd(px, 1) - 0.5) * 4, py + (Math.max(A[1], C[1]) - py) * 0.75];
    d += `M${f1(A[0])} ${f1(A[1])}L${f1(px)} ${f1(py)}L${f1(C[0])} ${f1(C[1])}L${f1(D[0])} ${f1(D[1] + 3)}L${f1(mid[0])} ${f1(mid[1])}L${f1(F[0])} ${f1(F[1] + 4)}Z`;
  }
  return d;
}
// Шыршалар қатары (бір path)
function spruces(x0, x1, y, h, seed, gap = 9, jitter = 6) {
  let d = "";
  for (let x = x0, i = 0; x < x1; x += gap * (0.7 + rnd(seed, i) * 0.6), i++) {
    const hh = h * (0.7 + rnd(seed, i + 9) * 0.6), w = hh * 0.28, yy = y + (rnd(seed, i + 3) - 0.5) * jitter;
    d += `M${f1(x - w)} ${f1(yy)}L${f1(x)} ${f1(yy - hh)}L${f1(x + w)} ${f1(yy)}Z`;
    d += `M${f1(x - w * 0.75)} ${f1(yy - hh * 0.38)}L${f1(x)} ${f1(yy - hh * 1.02)}L${f1(x + w * 0.75)} ${f1(yy - hh * 0.38)}Z`;
  }
  return d;
}
// Шыршалар беткейде: y = f(x)
function slopeSpruces(x0, x1, f, h, seed, gap = 8) {
  let d = "";
  for (let x = x0, i = 0; x < x1; x += gap * (0.7 + rnd(seed, i) * 0.6), i++) {
    const yy = f(x) + rnd(seed, i + 4) * 6, hh = h * (0.7 + rnd(seed, i + 9) * 0.6), w = hh * 0.27;
    d += `M${f1(x - w)} ${f1(yy)}L${f1(x)} ${f1(yy - hh)}L${f1(x + w)} ${f1(yy)}Z`;
  }
  return d;
}
// Қалалық көкжиек
function skyline(x0, x1, base, hmax, seed, spires = false) {
  let d = "";
  for (let x = x0, i = 0; x < x1; i++) {
    const w = 8 + rnd(seed, i) * 14, h = hmax * (0.25 + rnd(seed, i + 7) * 0.75);
    d += `M${f1(x)} ${base}V${f1(base - h)}H${f1(x + w)}V${base}Z`;
    if (spires && rnd(seed, i + 3) > 0.78) d += `M${f1(x + w / 2 - 1)} ${f1(base - h)}V${f1(base - h - 9)}H${f1(x + w / 2 + 1)}V${f1(base - h)}Z`;
    x += w + 1 + rnd(seed, i + 2) * 4;
  }
  return d;
}
// Шөп / құрақ
function blades(x0, x1, y, h, seed, gap = 4, lean = 3) {
  let d = "";
  for (let x = x0, i = 0; x < x1; x += gap * (0.6 + rnd(seed, i)), i++) {
    const hh = h * (0.5 + rnd(seed, i + 1) * 0.7), l = (rnd(seed, i + 2) - 0.3) * lean;
    d += `M${f1(x)} ${y}q${f1(l * 0.3)} ${f1(-hh * 0.6)} ${f1(l)} ${f1(-hh)}`;
  }
  return d;
}
const Cloud = ({ x, y, s = 1, o = 0.9, d = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g className="sa-cloud" style={{ animationDelay: `${-d}s` }}>
      <path d="M-30 6h62a10 10 0 0 0-6-18 14 14 0 0 0-26-6 11 11 0 0 0-20 6 9 9 0 0 0-10 18z" fill="#fff" opacity={o} />
    </g>
  </g>
);
const Birds = ({ x = 0, y = 40, n = 3, c = "#2a3442", d = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g className="sa-birds" style={{ animationDelay: `${-d}s` }}>
      {Array.from({ length: n }, (_, i) => (
        <g key={i} transform={`translate(${i * 13 - (i % 2) * 5} ${(i % 2) * 6 + i * 2})`}>
          <path className="sa-flap" style={{ animationDelay: `${-i * 0.23}s` }} d="M-5 0q2.5-3 5 0q2.5-3 5 0" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" />
        </g>
      ))}
    </g>
  </g>
);
// Су бетіндегі жылтыр сызықтар
const Shimmer = ({ lines, c = "#fff" }) => (
  <g stroke={c} strokeLinecap="round" fill="none">
    {lines.map(([x, y, w, dl], i) => (
      <path key={i} className="sa-shim" style={{ animationDelay: `${dl ?? -i * 0.7}s` }} d={`M${x} ${y}h${w}`} strokeWidth="1.4" />
    ))}
  </g>
);
const Twinkles = ({ pts, c = "#fff" }) => (
  <g fill={c}>
    {pts.map(([x, y, s = 1], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
        <path className="sa-tw" style={{ animationDelay: `${-i * 0.9}s` }} d="M0-4L1 -1 4 0 1 1 0 4-1 1-4 0-1-1Z" />
      </g>
    ))}
  </g>
);
const Pine = ({ x, y, h = 30, c = "#2f4a3c", t = "#5a4130" }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M-1 0V${-h * 0.7}h2V0Z`} fill={t} />
    <path d={`M${-h * 0.3} ${-h * 0.5}q${h * 0.05} ${-h * 0.35} ${h * 0.3} ${-h * 0.5}q${h * 0.28} ${h * 0.12} ${h * 0.3} ${h * 0.45}q${-h * 0.1} ${h * 0.12} ${-h * 0.3} ${h * 0.08}q${-h * 0.18} ${h * 0.06} ${-h * 0.3} ${-h * 0.03}Z`} fill={c} />
    <path d={`M${-h * 0.26} ${-h * 0.28}q${h * 0.12} ${-h * 0.14} ${h * 0.24} ${-h * 0.02}q${h * 0.1} ${-h * 0.1} ${h * 0.24} ${0}q${-h * 0.2} ${h * 0.1} ${-h * 0.48} ${h * 0.02}Z`} fill={c} />
  </g>
);
const Tree = ({ x, y, r = 10, c = "#5d7f4f", t = "#6b5038" }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M-1 0V${-r}h2V0Z`} fill={t} />
    <circle cy={-r * 1.5} r={r} fill={c} />
    <circle cx={-r * 0.35} cy={-r * 1.75} r={r * 0.45} fill="#fff" opacity=".12" />
  </g>
);

/* ── Тақырыптық түстер ── */
const SKY = {
  day: ["#8EC3D6", "#F4ECDA"],
  soft: ["#B4D6E2", "#FBF3E3"],
  warm: ["#E7A973", "#FAE6C7"],
  gold: ["#D9B57A", "#FBF0DA"],
  dusk: ["#3F5F86", "#EBB487"],
  cold: ["#A9CCE0", "#F1F5F3"],
  desert: ["#E2C08A", "#FCF0DA"],
  sunset: ["#C97B6E", "#FBE1B6"],
};

/* ── 30 сахна ── */
const SCENES = {
  tower: (u) => ({
    sky: SKY.day, sun: [290, 46, 13, "#FBE6A6"], focus: [180, 92, 128],
    clouds: [[40, 40, 0.9], [300, 30, 0.7], [-200, 50, 1], [520, 44, 0.8]],
    far: <path d={skyline(X0, X1, 152, 46, 3, true)} fill="#B8CBD3" />,
    mid: <path d={skyline(X0, X1, 160, 30, 8)} fill="#93AEB9" />,
    land: (
      <g>
        <rect x={X0} y="158" width={X1 - X0} height="80" fill="#E7DCC2" />
        <path d="M120 168h120l30 40H90z" fill="#D7C7A4" />
        <path d="M168 168 L174 92 h12 L192 168Z" fill="#F7F4EC" />
        <path d="M174 92 L172 168 M186 92 L188 168 M180 92 V168" stroke="#C9C3B5" strokeWidth="1.2" />
        <path d="M176 96 C150 86 146 60 158 40 M184 96 C210 86 214 60 202 40 M178 96 C162 82 160 58 166 38 M182 96 C198 82 200 58 194 38 M180 96 V36" fill="none" stroke="#F7F4EC" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M176 96 C150 86 146 60 158 40 M184 96 C210 86 214 60 202 40" fill="none" stroke="#C9C3B5" strokeWidth="0.8" />
        <g className="sa-glow"><circle cx="180" cy="54" r="26" fill="#F2C25B" opacity=".25" /></g>
        <circle cx="180" cy="56" r="17" fill={u("gold")} />
        <path d="M171 50a10 10 0 0 1 8-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".8" />
      </g>
    ),
    fore: (
      <g>
        {[-300, -220, -140, -60, 20, 70, 290, 340, 420, 500, 580].map((x, i) => <Tree key={i} x={x} y={190} r={9 + (i % 3) * 2} c={i % 2 ? "#5E7F52" : "#4E7048"} />)}
        <Birds x={60} y={66} n={3} />
      </g>
    ),
  }),
  tent: (u) => ({
    sky: SKY.gold, sun: [80, 58, 18, "#FCE1A0"], focus: [190, 100, 130],
    clouds: [[260, 40, 0.8], [-160, 36, 1], [480, 50, 0.9]],
    far: <path d={skyline(X0, X1, 150, 40, 21, true)} fill="#D7C2A0" />,
    mid: <path d={skyline(X0, X1, 158, 24, 13)} fill="#B9A585" />,
    land: (
      <g>
        <rect x={X0} y="156" width={X1 - X0} height="80" fill="#E9DDC0" />
        <ellipse cx="186" cy="160" rx="82" ry="9" fill="#C7B490" />
        <clipPath id={u.raw("tc")}><path d="M106 160 Q150 120 202 34 Q232 110 268 160 Z" /></clipPath>
        <path d="M106 160 Q150 120 202 34 Q232 110 268 160 Z" fill={u("glass")} />
        <g clipPath={u("tc")}>
          <path d="M100 150 L210 30 M120 160 L222 40 M150 166 L236 60 M180 168 L248 90 M90 130 L196 34 M80 100 L190 30 M200 170 L190 30 M230 170 L198 30 M150 170 L196 30" stroke="#ffffff" strokeWidth="1" opacity=".55" />
          <path d="M100 120 Q190 112 280 124 M100 140 Q190 132 280 146 M130 90 Q200 84 260 96 M160 62 Q205 58 240 66" stroke="#ffffff" strokeWidth="1" opacity=".4" fill="none" />
          <g className="sa-sweep"><path d="M120 170 L150 170 L230 20 L210 20Z" fill="#fff" opacity=".35" /></g>
        </g>
        <path d="M202 34 L206 8" stroke="#8C99A0" strokeWidth="2" />
        <path d="M106 160 Q150 120 202 34 Q232 110 268 160" fill="none" stroke="#8FB8C2" strokeWidth="1.4" />
      </g>
    ),
    fore: <g><path d={hills(186, 6, 4, 50)} fill="#CDBB94" /><Birds x={-60} y={60} n={2} /></g>,
  }),
  embankment: (u) => ({
    sky: SKY.warm, sun: [240, 70, 20, "#FCE3AE"], focus: [180, 120, 130],
    clouds: [[60, 36, 0.8], [-200, 40, 1], [440, 34, 0.8]],
    far: <path d={skyline(X0, X1, 128, 52, 31, true)} fill="#C9A88A" />,
    mid: (
      <g>
        <path d={skyline(X0, X1, 134, 30, 7)} fill="#A6866D" />
        <rect x={X0} y="132" width={X1 - X0} height="44" fill={u("w")} />
      </g>
    ),
    land: (
      <g>
        <path d="M60 134 Q180 70 300 134" fill="none" stroke="#F4EAD8" strokeWidth="4" />
        <path d="M60 134 Q180 70 300 134" fill="none" stroke="#8D7360" strokeWidth="1" />
        {[90, 120, 150, 180, 210, 240, 270].map((x) => <path key={x} d={`M${x} ${134 - Math.max(0, 64 - Math.abs(x - 180) * 0.55) * 0.95}V134`} stroke="#F4EAD8" strokeWidth="1.2" />)}
        <path d="M40 134h280" stroke="#8D7360" strokeWidth="3" />
        <Shimmer lines={[[-120, 146, 30], [20, 152, 24], [120, 144, 40], [230, 158, 30], [330, 148, 26], [460, 154, 30]]} />
      </g>
    ),
    fore: (
      <g>
        <rect x={X0} y="174" width={X1 - X0} height="60" fill="#D9C5A2" />
        <path d={`M${X0} 172h${X1 - X0}`} stroke="#6D5A4A" strokeWidth="2" />
        <path d={Array.from({ length: 60 }, (_, i) => `M${X0 + i * 20} 172v-9`).join("")} stroke="#6D5A4A" strokeWidth="1.4" />
        <path d={`M${X0} 164h${X1 - X0}`} stroke="#6D5A4A" strokeWidth="1.4" />
        {[-280, -100, 40, 330, 520].map((x) => <g key={x}><path d={`M${x} 174V138`} stroke="#5B4B3E" strokeWidth="1.6" /><circle cx={x} cy="137" r="3" fill="#FCE3AE" className="sa-glow" /></g>)}
        <Birds x={-20} y={52} n={3} />
      </g>
    ),
    water: ["#C69C80", "#7E8EA0"],
  }),
  ice: (u) => {
    const p = jagPts(104, 60, 11, 70);
    return {
      sky: SKY.cold, sun: [300, 40, 12, "#FFF6D8"], focus: [180, 140, 120],
      clouds: [[120, 30, 0.7], [-260, 40, 0.9], [480, 30, 0.8]],
      far: <g><path d={ptsPath(p)} fill="#8FA9BE" /><path d={capsPath(p)} fill="#FAFCFD" /></g>,
      mid: <g><path d={hills(140, 24, 5, 50)} fill="#3F6556" /><path d={spruces(X0, X1, 142, 16, 2, 7)} fill="#2E5044" /></g>,
      land: (
        <g>
          <path d="M60 196 Q60 128 180 126 Q300 128 300 196Z" fill="#B7C3C8" />
          <path d={Array.from({ length: 6 }, (_, i) => `M${70 + i * 3} ${190 - i * 8}Q180 ${126 + i * 2} ${290 - i * 3} ${190 - i * 8}`).join("")} stroke="#94A2A9" strokeWidth="1.4" fill="none" />
          <ellipse cx="180" cy="176" rx="96" ry="22" fill="#EAF6FA" />
          <ellipse cx="180" cy="176" rx="96" ry="22" fill="none" stroke="#7FB4C9" strokeWidth="2" />
          <ellipse cx="180" cy="176" rx="72" ry="12" fill="none" stroke="#B9DCEA" strokeWidth="1.2" />
          {[62, 298].map((x) => <g key={x}><path d={`M${x} 196V96`} stroke="#5C6970" strokeWidth="2" /><rect x={x - 7} y="90" width="14" height="7" rx="1.5" fill="#F7F1D8" stroke="#5C6970" /></g>)}
          <g className="sa-skate"><path d="M150 176v-7m0 0 3-4m-3 4-3-3" stroke="#A63A2B" strokeWidth="2" strokeLinecap="round" /><circle cx="150" cy="163" r="1.8" fill="#A63A2B" /></g>
          <g className="sa-skate sa-rev"><path d="M206 180v-7m0 0 3-4m-3 4-3-3" stroke="#0F5E7A" strokeWidth="2" strokeLinecap="round" /><circle cx="206" cy="167" r="1.8" fill="#0F5E7A" /></g>
        </g>
      ),
      fore: <Twinkles pts={[[200, 172, 0.8], [120, 178, 0.6], [252, 170, 0.7], [-40, 100], [390, 96]]} />,
    };
  },
  hill: (u) => ({
    sky: SKY.soft, sun: [70, 50, 14, "#FCE7B2"], focus: [228, 92, 130],
    clouds: [[20, 36, 0.8], [-220, 30, 1], [420, 40, 0.8]],
    far: (() => { const p = jagPts(96, 52, 27, 80); return <g><path d={ptsPath(p)} fill="#A9BCC9" /><path d={capsPath(p)} fill="#F7FAFB" /></g>; })(),
    mid: <path d={skyline(X0, X1, 176, 30, 17)} fill="#C2B9A4" />,
    land: (
      <g>
        <path d="M110 200 Q170 130 236 116 Q320 120 420 200Z" fill="#6E8F5E" />
        <path d={slopeSpruces(150, 360, (x) => 116 + Math.abs(x - 236) * 0.62, 12, 6, 9)} fill="#4E6E48" />
        <path d="M232 116 L236 30 L240 116Z" fill="#B9BEC4" />
        <path d="M236 30V10" stroke="#8B939B" strokeWidth="1.6" />
        <rect x="229" y="62" width="14" height="5" fill="#E7E2D6" />
        <rect x="231" y="80" width="10" height="4" fill="#E7E2D6" />
        <circle cx="236" cy="11" r="1.6" fill="#A63A2B" className="sa-glow" />
        <path d="M-40 196 L232 120" stroke="#4A4F57" strokeWidth="1" />
        <path d="M-40 190 L232 114" stroke="#4A4F57" strokeWidth="0.8" />
        <g className="sa-gondola" style={{ "--dx": "200px", "--dy": "-55px" }}>
          <path d="M20 179v4" stroke="#4A4F57" strokeWidth="1" />
          <rect x="14" y="183" width="12" height="9" rx="2" fill="#A63A2B" />
          <rect x="16" y="185" width="8" height="3" fill="#F4ECDA" />
        </g>
      </g>
    ),
    fore: <g><path d={hills(194, 8, 9, 40)} fill="#5B7C51" /><Birds x={80} y={60} n={2} /></g>,
  }),
  ski: (u) => {
    const p = [[X0, 120], [-200, 70], [-100, 104], [40, 40], [130, 76], [210, 20], [330, 86], [430, 54], [X1, 110]];
    return {
      sky: SKY.cold, sun: [300, 30, 11, "#FFF7DE"], focus: [180, 88, 140],
      clouds: [[80, 40, 0.6], [-260, 44, 0.9], [500, 36, 0.8]],
      far: <g><path d={ptsPath(p)} fill="#9CB3C6" /><path d={capsPath(p, 0.5)} fill="#FBFDFE" /></g>,
      mid: <path d="M-460 232 L-460 150 Q60 70 210 60 Q330 90 660 150 L660 232Z" fill="#F5F8FA" />,
      land: (
        <g>
          <path d="M210 62 Q170 120 110 196 M210 62 Q240 120 300 196" stroke="#DCE6EC" strokeWidth="6" fill="none" />
          <path d={slopeSpruces(-460, 120, (x) => 150 - (x + 460) * 0.12 + 20, 14, 3, 8)} fill="#2F5245" />
          <path d={slopeSpruces(290, 660, (x) => 104 + (x - 290) * 0.12 + 18, 14, 8, 8)} fill="#2F5245" />
          <path d="M70 186 L250 70" stroke="#4A4F57" strokeWidth="1" />
          {[[70, 186], [250, 70]].map(([x, y]) => <path key={x} d={`M${x} ${y + 8}V${y - 2}M${x - 5} ${y - 2}h10`} stroke="#4A4F57" strokeWidth="2" />)}
          {[0, 1, 2].map((i) => (
            <g key={i} className="sa-chair" style={{ "--dx": "180px", "--dy": "-116px", animationDelay: `${-i * 4}s` }}>
              <path d="M70 186v5m-3 0h6v3" stroke="#A63A2B" strokeWidth="1.6" fill="none" />
            </g>
          ))}
          <g className="sa-skier"><path d="M184 110l4-6m-4 6 6 1" stroke="#0F5E7A" strokeWidth="1.8" strokeLinecap="round" /><circle cx="188" cy="102" r="1.6" fill="#0F5E7A" /></g>
        </g>
      ),
      fore: <Twinkles pts={[[180, 70], [230, 40, 0.8], [40, 52, 0.7], [-160, 80], [420, 64]]} />,
    };
  },
  park: (u) => ({
    sky: SKY.warm, sun: [270, 52, 16, "#FFE6AE"], focus: [180, 132, 120],
    clouds: [[40, 34, 0.8], [-220, 44, 0.9], [460, 40, 0.8]],
    far: <path d={hills(132, 16, 41, 70)} fill="#B9B48B" />,
    mid: <g>{Array.from({ length: 24 }, (_, i) => <Tree key={i} x={-450 + i * 47} y={150} r={11 + (i % 3) * 3} c={i % 2 ? "#7E9B62" : "#6A8A57"} />)}</g>,
    land: (
      <g>
        <rect x={X0} y="146" width={X1 - X0} height="90" fill="#9DB57A" />
        <path d="M150 200 L172 150 h16 L210 200Z" fill="#E8D9B6" />
        <ellipse cx="180" cy="164" rx="44" ry="9" fill="#5FA3B5" />
        <ellipse cx="180" cy="164" rx="44" ry="9" fill="none" stroke="#E8D9B6" strokeWidth="3" />
        {[-24, -10, 0, 10, 24].map((dx, i) => (
          <g key={i} transform={`translate(${180 + dx} 162)`}><path className="sa-jet" style={{ animationDelay: `${-i * 0.4}s` }} d={`M0 0 Q${dx * 0.3} ${-30 + Math.abs(dx) * 0.5} ${dx * 0.6} -6`} stroke="#DDF0F4" strokeWidth="2" fill="none" strokeLinecap="round" /></g>
        ))}
        <g fill="#F2E7D0" stroke="#8B7A63" strokeWidth=".8">
          <rect x="70" y="118" width="60" height="5" /><rect x="230" y="118" width="60" height="5" />
          {[74, 86, 98, 110, 122, 234, 246, 258, 270, 282].map((x) => <rect key={x} x={x} y="123" width="4" height="26" />)}
        </g>
      </g>
    ),
    fore: <g>{[-380, -250, 40, 330, 470, 600].map((x, i) => <Tree key={i} x={x} y={204} r={16} c="#577A4A" />)}<Birds x={-80} y={64} n={3} /></g>,
  }),
  bazaar: (u) => ({
    sky: SKY.gold, sun: [70, 48, 16, "#FFE4A6"], focus: [180, 128, 124],
    clouds: [[260, 36, 0.8], [-200, 40, 1], [500, 44, 0.8]],
    far: <path d={skyline(X0, X1, 130, 30, 51)} fill="#D8C49D" />,
    mid: (
      <g>
        <rect x="60" y="92" width="240" height="44" fill="#E7D3AE" />
        {[100, 180, 260].map((x, i) => <g key={x}><path d={`M${x - 30} 94 a30 ${i === 1 ? 32 : 24} 0 0 1 60 0Z`} fill={i === 1 ? "#2E8E95" : "#3A9AA0"} /><path d={`M${x} ${94 - (i === 1 ? 32 : 24)}v-8`} stroke="#8D6C3F" strokeWidth="2" /></g>)}
        {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${70 + i * 22} 136v-26a7 7 0 0 1 14 0v26Z`} fill="#B9926B" />)}
      </g>
    ),
    land: (
      <g>
        <rect x={X0} y="134" width={X1 - X0} height="100" fill="#E6D2AE" />
        {[-380, -260, -140, -20, 100, 220, 340, 460, 580].map((x, i) => (
          <g key={x} transform={`translate(${x} 0)`}>
            <path d="M0 146h70l-6 14H6Z" fill={i % 2 ? "#A63A2B" : "#0F5E7A"} />
            <path d="M10 146l-4 14M24 146l-2 14M38 146v14M52 146l2 14M64 146l4 14" stroke="#FFFDF7" strokeWidth="5" opacity=".9" />
            <path d="M6 160v26M64 160v26" stroke="#6A5440" strokeWidth="2" />
            <rect x="4" y="178" width="62" height="10" fill="#8D6C4C" />
            {[12, 22, 32, 42, 52].map((cx, j) => <circle key={j} cx={cx} cy="175" r="5" fill={["#E39B2E", "#C8452E", "#F0C350", "#7E9A3E", "#D86A3A"][(j + i) % 5]} />)}
            {[17, 27, 37, 47].map((cx, j) => <circle key={j} cx={cx} cy="168" r="4.5" fill={["#C8452E", "#F0C350", "#E39B2E", "#7E9A3E"][(j + i) % 4]} />)}
          </g>
        ))}
      </g>
    ),
    fore: <g className="sa-bob"><path d="M-460 220h1120" stroke="#CDB68F" strokeWidth="18" /></g>,
  }),
  pineLake: (u) => ({
    sky: SKY.soft, sun: [80, 46, 14, "#FFF1C7"], focus: [196, 120, 116],
    clouds: [[260, 34, 0.8], [-180, 40, 1], [480, 30, 0.8]],
    far: <g><path d={hills(110, 34, 61, 70)} fill="#8BA49D" /><path d={slopeSpruces(X0, X1, () => 112, 14, 4, 6)} fill="#6F8B83" /></g>,
    mid: (
      <g>
        <path d="M100 132 Q120 74 150 70 Q170 54 196 78 Q226 66 240 100 Q262 110 270 132Z" fill="#A3A09A" />
        <path d="M150 70 Q170 54 196 78 Q226 66 240 100" fill="none" stroke="#C9C5BE" strokeWidth="3" />
        <path d={slopeSpruces(96, 272, (x) => 130 - Math.max(0, 40 - Math.abs(x - 190) * 0.4), 18, 13, 7)} fill="#2E4D3E" />
        <rect x={X0} y="130" width={X1 - X0} height="70" fill={u("w")} />
      </g>
    ),
    land: (
      <g>
        <path d="M176 150 Q178 120 196 112 Q214 110 220 124 Q232 130 230 150Z" fill="#8E8A84" />
        <path d="M196 112 Q214 110 220 124" fill="none" stroke="#C4BFB7" strokeWidth="2.5" />
        <path d="M188 128 q6-4 12 0" stroke="#6D6964" strokeWidth="1.4" fill="none" />
        <path d="M176 150 Q178 172 202 176 Q226 172 230 150Z" fill="#8E8A84" opacity=".28" />
        <Shimmer lines={[[-200, 150, 40], [-40, 164, 30], [60, 144, 26], [250, 160, 34], [380, 146, 30], [520, 166, 30]]} />
      </g>
    ),
    fore: (
      <g>
        <path d={hills(196, 10, 21, 60)} fill="#5C6B4A" />
        {[-400, -320, -10, 20, 330, 370, 560].map((x, i) => <Pine key={x} x={x} y={196} h={58 + (i % 3) * 10} />)}
        <Birds x={20} y={58} n={2} />
      </g>
    ),
    water: ["#7FB0BC", "#3F7E8E"],
  }),
  wetland: (u) => {
    const Flamingo = ({ x, y, s = 1, d = 0 }) => (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <g className="sa-wade" style={{ animationDelay: `${-d}s` }}>
          <path d="M0 0V-16M3 0l-1-8-1-8" stroke="#C26C6A" strokeWidth="1.2" />
          <ellipse cx="2" cy="-20" rx="8" ry="5" fill="#EE9C94" />
          <path d="M8 -21 Q14 -26 11 -34 Q9 -40 13 -41" stroke="#EE9C94" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M13 -41l4 2" stroke="#2a2a2a" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      </g>
    );
    return {
      sky: SKY.warm, sun: [250, 88, 20, "#FFE0AE"], focus: [180, 132, 100],
      clouds: [[40, 36, 0.8], [-240, 40, 1], [450, 30, 0.8]],
      far: <path d={hills(122, 6, 71, 90)} fill="#C2AE87" />,
      mid: <rect x={X0} y="122" width={X1 - X0} height="80" fill={u("w")} />,
      land: (
        <g>
          <Shimmer lines={[[-300, 140, 40], [-120, 132, 30], [40, 136, 26], [270, 140, 34], [420, 134, 30]]} />
          <Flamingo x={150} y={160} s={1.2} />
          <Flamingo x={186} y={156} s={1} d={1.3} />
          <Flamingo x={216} y={164} s={1.3} d={2.1} />
          <Flamingo x={-150} y={156} s={1} d={0.6} />
          <Flamingo x={420} y={158} s={1.1} d={1.7} />
          <path d="M150 160h12M184 156h10M214 164h14" stroke="#F6D2C0" strokeWidth="1" opacity=".7" />
          <g transform="translate(40 62)"><g className="sa-fly">
            {[0, 1, 2].map((i) => <path key={i} d={`M${i * 18} ${i * 5}l10 0 m-10 0 q-6-3-10-1 m10 1 l-8 4 m8-4 l9 -6`} stroke="#E88E87" strokeWidth="1.6" fill="none" strokeLinecap="round" />)}
          </g></g>
        </g>
      ),
      fore: (
        <g>
          <path d={hills(186, 6, 31, 40)} fill="#8B8B4E" />
          <g className="sa-sway"><path d={blades(X0, X1, 190, 34, 7, 5, 6)} stroke="#6E7442" strokeWidth="1.4" fill="none" /></g>
          <path d={blades(-460, 660, 200, 18, 3, 3)} stroke="#5D6338" strokeWidth="1.2" fill="none" />
        </g>
      ),
      water: ["#E7BC9A", "#8AA7AE"],
    };
  },
  reservoir: (u) => ({
    sky: SKY.day, sun: [80, 44, 14, "#FFF0C2"], focus: [214, 128, 112],
    clouds: [[230, 40, 0.8], [-220, 36, 1], [470, 44, 0.8]],
    far: <path d={hills(114, 22, 81, 80)} fill="#B8B28A" />,
    mid: <g><path d={hills(126, 12, 83, 60)} fill="#A19C70" /><rect x={X0} y="124" width={X1 - X0} height="40" fill={u("w")} /></g>,
    land: (
      <g>
        <path d={`M${X0} 160 H${X1} V200 H${X0}Z`} fill="#BFB48F" />
        <path d="M140 124 L300 124 L320 160 L120 160Z" fill="#CFCAC0" />
        <path d="M140 124 L300 124" stroke="#9A958B" strokeWidth="2" />
        {[160, 190, 220, 250, 280].map((x) => <path key={x} d={`M${x} 126 L${x + 4} 158`} stroke="#B3AEA4" strokeWidth="1.2" />)}
        {[150, 210, 270].map((x) => <g key={x}><path d={`M${x} 124V112`} stroke="#6E6A63" strokeWidth="1.2" /><circle cx={x} cy="111" r="1.8" fill="#F5D57C" /></g>)}
        <Shimmer lines={[[-300, 134, 40], [-100, 142, 30], [20, 132, 26], [330, 140, 34], [480, 136, 30]]} />
        <g transform="translate(40 136)"><g className="sa-sail"><path d="M0 0h16l-3 4H3Z" fill="#7A5B43" /><path d="M8 0V-18L16-2Z" fill="#FFFDF7" /><path d="M7 -2V-14L1-2Z" fill="#A63A2B" /></g></g>
      </g>
    ),
    fore: <g><path d={hills(196, 8, 85, 50)} fill="#9F9668" /><path d={blades(X0, X1, 200, 14, 9, 6)} stroke="#7E7650" strokeWidth="1.2" fill="none" /><Birds x={160} y={54} n={3} /></g>,
    water: ["#7FB2C2", "#3E7F93"],
  }),
  lowMountains: (u) => ({
    sky: SKY.warm, sun: [180, 92, 22, "#FFE2A8"], focus: [180, 118, 130],
    clouds: [[40, 34, 0.7], [-260, 40, 1], [450, 36, 0.8]],
    far: <path d={hills(96, 34, 91, 90)} fill="#C59C83" opacity=".85" />,
    mid: <g><path d={hills(118, 40, 93, 70)} fill="#9C7A66" /><path d="M60 140 Q120 74 180 92 Q240 70 300 140Z" fill="#8C6B58" /><path d="M100 120 Q130 96 160 100 M214 92 Q240 96 262 120" stroke="#A88470" strokeWidth="2.5" fill="none" strokeLinecap="round" /></g>,
    land: <g><path d={hills(150, 18, 95, 60)} fill="#A9A06C" /><path d={slopeSpruces(70, 290, (x) => 140 + Math.abs(x - 180) * 0.1, 11, 9, 14)} fill="#3F5A45" /></g>,
    fore: <g><path d={hills(184, 10, 97, 50)} fill="#C2B57D" /><g className="sa-sway"><path d={blades(X0, X1, 200, 22, 11, 6, 7)} stroke="#E8DDB4" strokeWidth="1.2" fill="none" /></g><Birds x={-40} y={60} n={3} /></g>,
  }),
  canyon: (u) => ({
    sky: SKY.desert, sun: [300, 40, 16, "#FFF2C8"], focus: [180, 112, 130],
    clouds: [[60, 34, 0.7], [-260, 44, 0.9], [470, 36, 0.8]],
    far: <path d="M-460 232V96H-300V84H-120V96H40V88H170V98H330V86H480V96H660V232Z" fill="#D9A27F" />,
    mid: (
      <g>
        <path d="M-460 232V110 H-260 L-250 120 H-170 L-160 104 H-60 L-50 116 H40 L56 132 L70 232Z" fill="#B7583F" />
        <path d="M290 232 L304 128 L320 112 H420 L430 102 H540 L552 116 H660 V232Z" fill="#B7583F" />
        <path d="M-460 130H50M310 130H660M-460 150H60M300 152H660" stroke="#9C4431" strokeWidth="2" />
      </g>
    ),
    land: (
      <g>
        <path d="M110 200 V100 h10 v-12 h8 v12 h12 v-20 h8 v20 h10 V200Z" fill="#C4664A" />
        <path d="M178 200 V84 h8 v-14 l6 -8 l6 8 v14 h8 V200Z" fill="#B5553C" />
        <path d="M220 200 V110 h8 v-10 h8 v10 h16 v-16 h6 v16 h6 V200Z" fill="#C4664A" />
        <path d="M110 120h48M110 140h48M178 110h28M178 136h28M220 128h44M220 150h44" stroke="#9C4431" strokeWidth="1.6" />
        <path d="M130 200V100M194 200V80M240 200V110" stroke="#D88466" strokeWidth="2" opacity=".6" />
      </g>
    ),
    fore: (
      <g>
        <path d="M-460 232V184 Q0 172 180 180 Q360 188 660 176V232Z" fill="#9E8E6A" />
        <path d="M-460 196 Q-100 186 180 194 Q420 200 660 190" stroke="#3FA6A6" strokeWidth="9" fill="none" />
        <Shimmer lines={[[-200, 190, 20], [60, 192, 18], [260, 195, 20], [440, 190, 18]]} />
        {[-320, -40, 90, 280, 510].map((x) => <circle key={x} cx={x} cy="178" r="9" fill="#6E8A4E" />)}
        <Birds x={140} y={46} n={2} c="#5a3a2a" />
      </g>
    ),
  }),
  alpineLakes: (u) => {
    const p = [[X0, 90], [-300, 50], [-180, 90], [-40, 44], [80, 84], [180, 30], [280, 82], [400, 40], [520, 84], [X1, 60]];
    return {
      sky: SKY.soft, sun: [300, 34, 12, "#FFF6D8"], focus: [180, 116, 130],
      clouds: [[40, 30, 0.7], [-260, 40, 0.9], [480, 30, 0.8]],
      far: <g><path d={ptsPath(p)} fill="#9AB0C0" /><path d={capsPath(p, 0.45)} fill="#FAFCFD" /></g>,
      mid: (
        <g>
          <path d="M-460 232 V60 Q-80 70 120 150 L120 232Z" fill="#355B4C" />
          <path d="M660 232 V60 Q420 70 240 150 L240 232Z" fill="#2E5244" />
          <path d={slopeSpruces(-460, 120, (x) => 62 + Math.pow((x + 460) / 580, 1.6) * 92, 16, 5, 7)} fill="#244236" />
          <path d={slopeSpruces(240, 660, (x) => 62 + Math.pow((660 - x) / 420, 1.6) * 92, 16, 6, 7)} fill="#1F3B30" />
        </g>
      ),
      land: (
        <g>
          <path d="M40 150 Q180 140 320 150 L360 200 H0Z" fill={u("w")} />
          <path d="M90 154 L180 150 L270 154" stroke="#B8E4E2" strokeWidth="1" opacity=".6" />
          <path d="M150 162 L180 150 L210 162Z" fill="#9AB0C0" opacity=".35" />
          <Shimmer lines={[[100, 160, 30], [200, 168, 24], [140, 178, 40], [250, 184, 26]]} />
        </g>
      ),
      fore: <g><path d={spruces(X0, 40, 206, 40, 4, 10)} fill="#1B3229" /><path d={spruces(320, X1, 206, 40, 5, 10)} fill="#1B3229" /><Birds x={160} y={50} n={2} /></g>,
      water: ["#4FB7B4", "#1F7A84"],
    };
  },
  river: (u) => ({
    sky: SKY.day, sun: [70, 48, 14, "#FFF0C2"], focus: [180, 150, 110],
    clouds: [[220, 34, 0.8], [-180, 40, 1], [470, 30, 0.8]],
    far: <path d={hills(120, 8, 111, 90)} fill="#BFB98F" />,
    mid: <rect x={X0} y="120" width={X1 - X0} height="110" fill="#C9C28F" />,
    land: (
      <g>
        <path d="M-460 124 Q-60 122 120 126 Q260 132 200 146 Q60 164 160 186 Q240 204 300 232 L60 232 Q-60 204 40 182 Q130 162 140 148 Q130 134 -460 132Z" fill={u("w")} />
        <path d="M60 232 Q-60 204 40 182 Q130 162 140 148" stroke="#E8DFB8" strokeWidth="3" fill="none" />
        <Shimmer lines={[[160, 140, 20], [90, 160, 24], [130, 180, 28], [180, 200, 30], [-200, 128, 30]]} />
        {[[-80, 150], [-30, 160], [300, 170], [340, 160], [420, 176]].map(([x, y], i) => <Tree key={i} x={x} y={y} r={8 + (i % 2) * 3} c="#7B9257" />)}
        <g transform="translate(150 166)"><g className="sa-sail"><path d="M0 0h18l-3 4H3Z" fill="#6E513A" /><path d="M2 0l5-7" stroke="#6E513A" strokeWidth="1.4" /></g></g>
      </g>
    ),
    fore: <g><g className="sa-sway"><path d={blades(-460, 40, 210, 30, 13, 4, 6)} stroke="#7B7744" strokeWidth="1.4" fill="none" /><path d={blades(320, 660, 210, 30, 15, 4, 6)} stroke="#7B7744" strokeWidth="1.4" fill="none" /></g><Birds x={20} y={60} n={3} /></g>,
    water: ["#7DB4C6", "#3B7E95"],
  }),
  ruins: (u) => ({
    sky: SKY.gold, sun: [290, 60, 18, "#FFE6AE"], focus: [180, 132, 120],
    clouds: [[40, 34, 0.8], [-220, 44, 0.9], [480, 36, 0.8]],
    far: <path d={hills(126, 10, 121, 90)} fill="#D5BE95" />,
    mid: <path d="M-460 232V136 Q-200 128 0 124 Q100 100 180 100 Q260 100 340 124 Q500 130 660 134V232Z" fill="#C9A57A" />,
    land: (
      <g>
        <path d="M60 150V120h30v-8h20v8h40v-12h16v12h40v-6h20v6h40v-10h18v40Z" fill="#B88C61" />
        <path d="M60 150V120h30v-8h20v8h40v-12h16v12h40v-6h20v6h40v-10h18v40" fill="none" stroke="#9C7350" strokeWidth="1.6" />
        <path d="M150 150v-24a14 14 0 0 1 28 0v24" fill="#8E6747" />
        <path d="M156 150v-22a8 8 0 0 1 16 0v22Z" fill="#E7CDA2" />
        <path d="M40 176 h280 l-20 22 H60Z" fill="#B28A63" />
        <g stroke="#E3C89C" strokeWidth="2" fill="none"><path d="M70 180h240M90 190h200M120 176v20M180 176v20M240 176v20" /></g>
        <path d="M60 176v-6h14v6M286 176v-8h16v8" fill="#9C7350" />
      </g>
    ),
    fore: <g><path d={hills(200, 6, 123, 40)} fill="#C6AA80" /><g className="sa-sway"><path d={blades(X0, X1, 206, 16, 17, 7, 5)} stroke="#A68C5E" strokeWidth="1.2" fill="none" /></g><Birds x={-20} y={56} n={2} c="#5a3a2a" /></g>,
  }),
  mausoleum: (u) => ({
    sky: SKY.gold, sun: [70, 60, 18, "#FFE4A0"], focus: [190, 98, 140],
    clouds: [[300, 34, 0.7], [-200, 40, 1], [500, 46, 0.8]],
    far: <path d={hills(150, 6, 131, 80)} fill="#D6C29A" />,
    mid: <g>{[-380, -300, -220, 420, 500, 590].map((x, i) => <path key={x} d={`M${x} 158 q4-${30 + (i % 3) * 8} 8 0Z`} fill="#8E9A6A" />)}</g>,
    land: (
      <g>
        <ellipse cx="236" cy="78" rx="34" ry="32" fill={u("dome")} />
        <path d={Array.from({ length: 7 }, (_, i) => `M${208 + i * 9.3} 96 Q${236 + (i - 3) * 4} 40 236 46`).join("")} stroke="#1E6E78" strokeWidth="1" fill="none" opacity=".7" />
        <rect x="200" y="94" width="72" height="12" fill="#C79E6B" />
        <path d="M200 98h72" stroke="#2C8E96" strokeWidth="3" />
        <path d="M150 94 a18 16 0 0 1 36 0Z" fill="#3A9AA0" />
        <rect x="110" y="104" width="180" height="62" fill="#D2AA76" />
        <path d={Array.from({ length: 9 }, (_, i) => `M110 ${110 + i * 6.5}h180`).join("")} stroke="#C29A66" strokeWidth=".8" />
        <rect x="128" y="52" width="66" height="114" fill="#D9B27E" />
        <path d="M128 52h66" stroke="#B88A55" strokeWidth="3" />
        <path d="M128 60h66" stroke="#2C8E96" strokeWidth="4" />
        <path d="M140 166V96a21 24 0 0 1 42 0V166Z" fill="#7C5A3A" />
        <path d="M146 166V100a15 18 0 0 1 30 0V166Z" fill="#3D6D74" />
        <path d="M146 112h30M161 100v66" stroke="#2C8E96" strokeWidth="1" opacity=".6" />
        {[124, 192].map((x) => <g key={x}><rect x={x} y="40" width="8" height="126" fill="#C99E6A" /><path d={`M${x} 40a4 5 0 0 1 8 0Z`} fill="#3A9AA0" /></g>)}
        {[210, 236, 262].map((x) => <path key={x} d={`M${x - 6} 166v-26a6 7 0 0 1 12 0v26Z`} fill="#A57F55" />)}
      </g>
    ),
    fore: <g><rect x={X0} y="166" width={X1 - X0} height="70" fill="#E7D6B0" /><path d="M-460 172h1120" stroke="#D2BC92" strokeWidth="2" /><Birds x={20} y={54} n={3} c="#5a3a2a" /></g>,
  }),
  peaks: (u) => {
    const p = [[X0, 130], [-340, 90], [-260, 120], [-160, 80], [-60, 116], [60, 70], [110, 92], [170, 46], [220, 84], [280, 64], [350, 112], [450, 80], [560, 118], [X1, 96]];
    return {
      sky: SKY.warm, sun: [320, 60, 15, "#FFE3A8"], focus: [180, 96, 130],
      clouds: [[40, 30, 0.7], [-220, 36, 1], [480, 30, 0.8]],
      far: <path d={hills(110, 20, 141, 80)} fill="#C9A68C" opacity=".8" />,
      mid: (
        <g>
          <path d={ptsPath(p)} fill="#8A6A5C" />
          <path d={p.slice(1, -1).map(([x, y], i) => `M${x} ${y}L${x + (i % 2 ? 10 : -12)} ${y + 40}`).join("")} stroke="#6E5246" strokeWidth="3" />
          <path d={capsPath(p, 0.22, 80)} fill="#B48D78" />
        </g>
      ),
      land: <path d={hills(160, 16, 143, 60)} fill="#A59468" />,
      fore: (
        <g>
          <path d={hills(186, 8, 145, 50)} fill="#C8B67C" />
          <g className="sa-sway"><path d={blades(X0, X1, 204, 26, 19, 5, 9)} stroke="#EFE6C2" strokeWidth="1.2" fill="none" /></g>
          <Birds x={120} y={40} n={1} s={1.6} c="#3a2a22" />
        </g>
      ),
    };
  },
  dunes: (u) => ({
    sky: SKY.desert, sun: [70, 50, 16, "#FFF2C8"], focus: [196, 118, 130],
    clouds: [[280, 30, 0.6], [-220, 40, 0.8], [480, 34, 0.7]],
    far: <path d={hills(110, 34, 151, 110)} fill="#B8A7A0" opacity=".7" />,
    mid: <path d={hills(140, 16, 153, 80)} fill="#D8B27A" />,
    land: (
      <g>
        <path d="M-60 200 Q60 170 150 104 Q190 76 230 92 Q300 120 420 200Z" fill="#E9C182" />
        <path d="M150 104 Q190 76 230 92 Q260 120 300 200 H200 Q190 150 150 104Z" fill="#CF9C5C" />
        <path d="M150 104 Q190 76 230 92" stroke="#F6DDA8" strokeWidth="2" fill="none" />
        <clipPath id={u.raw("dc")}><path d="M-60 200 Q60 170 150 104 Q190 150 200 200Z" /></clipPath>
        <g clipPath={u("dc")}><g className="sa-sand">{Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${-60 + i * 30} 200 q30 -46 70 -84`} stroke="#D7AA6A" strokeWidth="1.2" fill="none" />)}</g></g>
        <g className="sa-blow">{[0, 1, 2, 3].map((i) => <circle key={i} cx={232 + i * 6} cy={92 + i * 2} r=".9" fill="#E9C182" />)}</g>
      </g>
    ),
    fore: <g><path d={hills(196, 6, 155, 60)} fill="#E3B576" /><path d="M-460 210 q40-4 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" stroke="#D2A060" fill="none" strokeWidth="1.2" /></g>,
  }),
  steppeReserve: (u) => {
    const Saiga = ({ x, y, s = 1, d = 0 }) => (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <g className="sa-graze" style={{ animationDelay: `${-d}s` }}>
          <ellipse cx="0" cy="-9" rx="9" ry="5" fill="#B9946A" />
          <path d="M-6 -6v8M-3 -6v8M4 -6v8M7 -6v8" stroke="#8A6A48" strokeWidth="1.4" />
          <path d="M7 -12 q5 -2 7 2 q1 3 -3 3Z" fill="#B9946A" />
          <path d="M11 -12 l1 -6" stroke="#E8DCC0" strokeWidth="1.2" />
        </g>
      </g>
    );
    return {
      sky: SKY.soft, sun: [300, 64, 16, "#FFEFC0"], focus: [184, 138, 100],
      clouds: [[60, 36, 0.8], [-200, 44, 1], [460, 34, 0.9]],
      far: <g><path d={hills(130, 8, 161, 100)} fill="#B9B88E" />{[-300, -60, 420].map((x) => <path key={x} d={spruces(x, x + 70, 132, 18, x, 7, 3)} fill="#5D7A5A" />)}</g>,
      mid: <path d={hills(150, 6, 163, 80)} fill="#CBC08D" />,
      land: (
        <g>
          <path d={spruces(262, 340, 140, 26, 7, 8, 4)} fill="#46664C" />
          <path d={spruces(-150, -40, 140, 24, 9, 9, 4)} fill="#557357" />
          <ellipse cx="80" cy="146" rx="40" ry="3.5" fill="#8DBBC4" />
          <Shimmer lines={[[58, 146, 16], [88, 147, 12]]} />
          <path d="M110 152 Q180 140 250 152Z" fill="#B7AC78" />
          <Saiga x={128} y={152} s={1.6} /><Saiga x={166} y={148} s={1.8} d={1.2} /><Saiga x={206} y={151} s={1.7} d={2} /><Saiga x={244} y={154} s={1.4} d={0.9} />
          <Saiga x={-160} y={150} s={1.3} d={0.7} /><Saiga x={430} y={150} s={1.3} d={1.6} />
        </g>
      ),
      fore: (
        <g>
          <path d={hills(186, 6, 165, 50)} fill="#C2B67C" />
          <g className="sa-sway"><path d={blades(X0, X1, 206, 30, 21, 5, 12)} stroke="#F1EBCF" strokeWidth="1.4" fill="none" /></g>
          <Birds x={60} y={56} n={2} s={1.3} />
        </g>
      ),
    };
  },
  lakeShore: (u) => ({
    sky: SKY.day, sun: [80, 46, 14, "#FFF0C2"], focus: [180, 140, 120],
    clouds: [[260, 36, 0.8], [-220, 40, 1], [480, 34, 0.8]],
    far: <path d={hills(128, 6, 171, 100)} fill="#C2B48F" />,
    mid: (
      <g>
        <rect x={X0} y="128" width="640" height="50" fill="#8CC2BE" />
        <rect x="180" y="128" width="480" height="50" fill="#2F8DA0" />
        <path d="M150 178 Q170 150 190 140 Q200 134 214 130 L230 130 Q206 140 200 150 Q190 166 196 178Z" fill="#D9C79E" />
      </g>
    ),
    land: (
      <g>
        <Shimmer lines={[[-200, 140, 30], [40, 152, 24], [260, 144, 30], [380, 160, 28], [520, 140, 30]]} />
        <path d="M-460 232V176 Q-120 168 120 178 Q260 186 660 172V232Z" fill="#CDB98F" />
        {[[-40, 182], [-10, 186], [260, 184], [300, 182]].map(([x, y], i) => <path key={i} d={`M${x - 14} ${y} q4 -12 14 -12 q12 0 16 12Z`} fill="#A69479" />)}
        <g><path d="M120 178V150" stroke="#F4ECDA" strokeWidth="5" /><path d="M120 156V150" stroke="#A63A2B" strokeWidth="5" /><circle cx="120" cy="147" r="3" fill="#F5D57C" className="sa-glow" /></g>
      </g>
    ),
    fore: <g><path d={hills(204, 6, 173, 50)} fill="#B9A57A" /><Birds x={240} y={70} n={2} c="#fff" s={1.3} /><Birds x={-60} y={54} n={2} /></g>,
  }),
  rocket: (u) => ({
    sky: SKY.dusk, sun: [70, 120, 18, "#FFD9A0"], focus: [180, 100, 140],
    stars: [[30, 30], [120, 18], [260, 24], [330, 50], [-140, 30], [-300, 20], [460, 30], [560, 18]],
    far: <path d={hills(150, 6, 181, 100)} fill="#8C7C78" />,
    mid: <rect x={X0} y="150" width={X1 - X0} height="90" fill="#B99C7E" />,
    land: (
      <g>
        <path d="M130 168h110v10H130z" fill="#5E5A5C" />
        <path d="M216 168V44h10v124z" fill="#7B6E6A" />
        <path d={Array.from({ length: 12 }, (_, i) => `M216 ${52 + i * 10}l10 6`).join("")} stroke="#A49690" strokeWidth="1" />
        <path d="M200 80h16M200 110h16" stroke="#7B6E6A" strokeWidth="3" />
        <g className="sa-rocket">
          <g className="sa-flame"><path d="M172 150 q8 22 16 0Z" fill="#FFC86A" /><path d="M175 150 q5 12 10 0Z" fill="#FFF3C8" /></g>
          <path d="M174 150V64 q6-24 12 0V150Z" fill="#F4F1EA" />
          <path d="M174 72h12" stroke="#A63A2B" strokeWidth="3" />
          <path d="M174 64 q6-24 12 0" fill="#0F5E7A" />
          <path d="M166 150 V112 q2-10 8-12 V150Z M194 150 V112 q-2-10 -8-12 V150Z" fill="#E4DFD4" />
          <path d="M162 150 l4 -16 v16Z M198 150 l-4 -16 v16Z" fill="#B8B1A6" />
        </g>
        <g className="sa-smoke">{[[-16, 0, 12], [0, 6, 14], [18, 0, 12], [-30, 8, 8], [32, 8, 9]].map(([x, y, r], i) => <circle key={i} cx={180 + x} cy={166 + y} r={r} fill="#F2ECE4" opacity=".85" />)}</g>
      </g>
    ),
    fore: <g><path d={hills(196, 4, 183, 60)} fill="#A68A6C" />{[-300, 420, 560].map((x) => <path key={x} d={`M${x} 196V170M${x - 8} 176h16`} stroke="#6D5F58" strokeWidth="1.6" />)}</g>,
  }),
  sea: (u) => {
    const Ship = ({ x, y, s = 1, c = "#8A4B32" }) => (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-30 0 L-24 -12 H22 L32 -16 L26 0Z" fill={c} />
        <path d="M-12 -12V-24h14v12M2 -18h8v6" fill={c} opacity=".9" />
        <path d="M-6 -24V-40" stroke={c} strokeWidth="2" />
        <path d="M-24 -8H24" stroke="#5E3322" strokeWidth="1.2" />
      </g>
    );
    return {
      sky: SKY.day, sun: [300, 46, 15, "#FFF2C8"], focus: [170, 150, 110],
      clouds: [[60, 30, 0.8], [-240, 40, 1], [480, 36, 0.8]],
      far: <g className="sa-tide"><rect x={X0} y="124" width={X1 - X0} height="12" fill={u("w")} /></g>,
      mid: <g><rect x={X0} y="134" width={X1 - X0} height="100" fill="#E1CDA4" /><Shimmer lines={[[-300, 128, 40], [-80, 130, 30], [100, 127, 36], [300, 130, 30], [460, 128, 40]]} /></g>,
      land: (
        <g>
          <path d="M-460 150h1120M-460 170h1120" stroke="#D2BC8F" strokeWidth="1" />
          <path d="M20 180l20-8 16 6 22-4M200 190l18-10 26 4M100 200l26-8 20 6M260 170l24 4 16-6" stroke="#B9A076" strokeWidth="1.2" fill="none" />
          <Ship x={150} y={170} s={1.5} />
          <Ship x={270} y={150} s={0.9} c="#9A5A3C" />
          <Ship x={-160} y={156} s={1} c="#9A5A3C" />
          <path d="M120 172 q30 4 60 0" stroke="#C7AE84" strokeWidth="3" fill="none" />
        </g>
      ),
      fore: <g><path d={hills(204, 4, 191, 60)} fill="#D7BF92" /><Birds x={200} y={84} n={2} c="#fff" s={1.2} /><Birds x={-20} y={60} n={2} /></g>,
      water: ["#67B0C4", "#2C7F99"],
    };
  },
  whiteCliffs: (u) => ({
    sky: SKY.day, sun: [70, 46, 14, "#FFF3CE"], focus: [200, 104, 130],
    clouds: [[300, 34, 0.7], [-240, 40, 0.9], [500, 40, 0.8]],
    far: (
      <g>
        <path d="M-460 232V108H-200V103H40V110H120V100H560V106H660V232Z" fill="#E6CBB2" />
        <path d="M-460 108H-200V103H40V110H120V100H560V106H660" fill="none" stroke="#C8A389" strokeWidth="2.5" />
      </g>
    ),
    mid: (
      <g>
        <clipPath id={u.raw("cl")}><path d="M-460 232V122H-150L-140 128H-40L-28 124H50L70 140L84 232Z M290 232L304 142L322 124H660V232Z" /></clipPath>
        <path d="M-460 232V122H-150L-140 128H-40L-28 124H50L70 140L84 232Z M290 232L304 142L322 124H660V232Z" fill="#F4EDE3" />
        <g clipPath={u("cl")}>
          <path d="M-460 130H660" stroke="#C9A98F" strokeWidth="3" />
          <path d="M-460 142H660" stroke="#EBBFA9" strokeWidth="5" />
          <path d="M-460 156H660" stroke="#F8F4EE" strokeWidth="4" />
          <path d="M-460 166H660" stroke="#E7C79D" strokeWidth="4" />
          <path d="M-460 182H660" stroke="#EDC4B2" strokeWidth="6" />
          <path d="M50 124L70 140L84 232H40Z M304 142L322 124L330 232H296Z" fill="#B89A82" opacity=".28" />
        </g>
      </g>
    ),
    land: (
      <g>
        <clipPath id={u.raw("fg")}><path d="M160 196 L172 120 L182 50 L190 44 L198 120 L208 196Z M214 196 L224 112 L230 62 L238 58 L244 116 L256 196Z M108 196 L116 150 H150 L158 196Z M262 196 L268 160 H298 L306 196Z" /></clipPath>
        <path d="M160 196 L172 120 L182 50 L190 44 L198 120 L208 196Z M214 196 L224 112 L230 62 L238 58 L244 116 L256 196Z M108 196 L116 150 H150 L158 196Z M262 196 L268 160 H298 L306 196Z" fill="#F7F2EA" />
        <g clipPath={u("fg")}>
          <path d="M100 74H310" stroke="#EBC0AB" strokeWidth="3" />
          <path d="M100 98H310" stroke="#E6C59B" strokeWidth="4" />
          <path d="M100 124H310" stroke="#EBBFA9" strokeWidth="6" />
          <path d="M100 146H310" stroke="#F8F4EE" strokeWidth="4" />
          <path d="M100 160H310" stroke="#E2B795" strokeWidth="5" />
          <path d="M100 178H310" stroke="#EDC4B2" strokeWidth="7" />
          <path d="M190 44 L198 120 L208 196 H188Z M238 58 L244 116 L256 196 H238Z M150 150 L158 196 H140Z M298 160 L306 196 H292Z" fill="#9C7A62" opacity=".22" />
        </g>
      </g>
    ),
    fore: (
      <g>
        <path d={hills(196, 5, 201, 60)} fill="#D7BD94" />
        <path d="M-460 206 Q0 200 660 208" stroke="#C7A97F" strokeWidth="1.2" fill="none" />
        {[-330, -190, 20, 96, 330, 470].map((x, i) => <g key={x}><circle cx={x} cy={200} r={3 + (i % 2)} fill="#8A8A5A" /><circle cx={x + 5} cy={201} r={2.4} fill="#7A7A4E" /></g>)}
        <Birds x={60} y={56} n={2} c="#3a2a22" />
      </g>
    ),
  }),
  cave: (u) => ({
    sky: SKY.gold, sun: [300, 46, 15, "#FFE6AE"], focus: [180, 132, 120],
    clouds: [[50, 34, 0.7], [-220, 40, 0.9], [500, 40, 0.8]],
    far: <path d="M-460 232V100H660V232Z" fill="#E9DFD0" />,
    mid: <g><path d="M-460 232V106H660V232Z" fill="#EFE5D6" /><path d="M-460 126H660M-460 148H660" stroke="#DCCDB8" strokeWidth="2" /></g>,
    land: (
      <g>
        <path d="M60 106 Q180 96 300 106 V200 H60Z" fill="#E4D4BD" />
        <path d="M130 172V140a22 26 0 0 1 44 0v32Z" fill="#4A3A2E" />
        <path d="M186 172V146a16 20 0 0 1 32 0v26Z" fill="#4A3A2E" />
        <path d="M90 172V154a10 12 0 0 1 20 0v18Z M238 172V152a11 13 0 0 1 22 0v20Z" fill="#5C4A3C" />
        <g className="sa-glow"><path d="M140 172V144a12 14 0 0 1 24 0v28Z" fill="#E7A94C" opacity=".55" /></g>
        <path d="M120 172h120l20 24H100Z" fill="#D8C5A8" />
        <path d="M112 182h136M106 190h148" stroke="#C3AE8D" strokeWidth="1.4" />
        <path d="M160 106 v-14 M150 98 h20" stroke="#C3AE8D" strokeWidth="0" />
      </g>
    ),
    fore: <g><path d={hills(200, 4, 211, 60)} fill="#D9C7A6" /><g transform="translate(70 196)"><path d="M0 0v-10M0-10a2.2 2.2 0 1 0 0-.1" stroke="#5B4636" strokeWidth="2.2" fill="#5B4636" /></g><g transform="translate(290 198)"><path d="M0 0v-9M0-9a2 2 0 1 0 0-.1" stroke="#5B4636" strokeWidth="2" fill="#5B4636" /></g><Birds x={200} y={58} n={2} c="#3a2a22" /></g>,
  }),
  rocks: (u) => ({
    sky: SKY.soft, sun: [300, 44, 14, "#FFF1C7"], focus: [176, 112, 130],
    clouds: [[60, 34, 0.8], [-220, 40, 1], [480, 30, 0.8]],
    far: <path d={hills(108, 30, 221, 70)} fill="#9AA7A0" />,
    mid: <g><path d={slopeSpruces(X0, X1, () => 124, 18, 223, 8)} fill="#4E6A58" /><rect x={X0} y="130" width={X1 - X0} height="80" fill={u("w")} /></g>,
    land: (
      <g>
        <path d="M84 140 Q84 118 104 112 Q124 108 132 124 L134 140Z" fill="#A98D78" />
        <path d="M120 140 Q116 104 140 96 Q164 92 170 116 L172 140Z" fill="#B99E89" />
        <path d="M140 98 Q138 72 156 64 Q178 58 184 80 Q186 92 172 100Z" fill="#AE927D" />
        <path d="M158 66 Q160 46 174 44 Q188 46 186 62 Q182 72 170 70Z" fill="#C2A893" />
        <path d="M166 140 Q164 108 190 100 Q218 96 226 118 Q230 128 226 140Z" fill="#A98D78" />
        <path d="M214 140 Q216 122 236 118 Q256 118 262 140Z" fill="#B99E89" />
        <path d="M104 112 Q96 124 100 138 M140 96 Q132 112 136 136 M156 64 Q150 76 154 92 M174 44 Q168 54 172 66 M190 100 Q182 114 186 138 M236 118 Q230 128 232 140" stroke="#E3D2C2" strokeWidth="2" fill="none" opacity=".7" />
        <path d="M132 124 L134 140 M170 116 L172 140 M184 80 L172 100" stroke="#86705F" strokeWidth="1.4" fill="none" />
        <path d="M84 140 Q90 160 130 164 Q180 170 230 162 Q258 156 262 140Z" fill="#A98D78" opacity=".25" />
        <Pine x={240} y={110} h={34} /><Pine x={110} y={112} h={28} />
        <Shimmer lines={[[-200, 150, 40], [-20, 164, 30], [120, 176, 30], [290, 154, 34], [440, 166, 30]]} />
      </g>
    ),
    fore: <g><path d={hills(198, 8, 225, 50)} fill="#7D8A66" />{[-380, -300, 360, 420, 590].map((x, i) => <Pine key={x} x={x} y={198} h={50 + (i % 2) * 14} />)}<Birds x={-40} y={58} n={2} /></g>,
    water: ["#7EB4C0", "#356F82"],
  }),
  ancient: (u) => {
    const Horse = ({ x, y, s = 1, d = 0, c = "#8A5A3A" }) => (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <g className="sa-graze" style={{ animationDelay: `${-d}s` }}>
          <path d="M-12 -14 Q0 -18 10 -14 L16 -24 Q20 -26 22 -22 L14 -10 Q12 -6 10 -6 L9 0 H7 L7 -6 H-6 L-8 0 H-10 L-10 -6 Q-14 -8 -12 -14Z" fill={c} />
          <path d="M-12 -12 q-5 2 -5 8" stroke={c} strokeWidth="2" fill="none" />
          <path d="M14 -22 L10 -14" stroke="#3C2A1E" strokeWidth="2" />
        </g>
      </g>
    );
    return {
      sky: SKY.warm, sun: [80, 96, 22, "#FFE0A6"], focus: [170, 140, 120],
      clouds: [[260, 34, 0.7], [-220, 40, 1], [480, 30, 0.8]],
      far: <path d={hills(126, 10, 231, 90)} fill="#C5A67E" />,
      mid: <path d={hills(146, 8, 233, 70)} fill="#BFA875" />,
      land: (
        <g>
          {[[86, 158, 1.6], [146, 164, 2], [-160, 152, 1.4], [420, 156, 1.4]].map(([x, y, s], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
              <path d="M-22 0 Q-20 -18 0 -22 Q20 -18 22 0Z" fill="#9C7A55" />
              <path d="M-16 -8 Q0 -14 16 -8 M-10 -16 Q0 -19 10 -16" stroke="#7F6044" strokeWidth="1.2" fill="none" />
              <path d="M-5 0 v-8 a5 5 0 0 1 10 0 v8Z" fill="#4A3628" />
              <path d="M0 -22 l-3 -8 M0 -22 l3 -7" stroke="#7F6044" strokeWidth="1.4" />
            </g>
          ))}
          <Horse x={220} y={168} s={1.3} />
          <Horse x={262} y={162} s={1} d={1.1} c="#A4744C" />
          <Horse x={-60} y={160} s={1} d={2} c="#A4744C" />
          <Horse x={500} y={166} s={1.1} d={0.5} />
        </g>
      ),
      fore: <g><path d={hills(190, 6, 235, 50)} fill="#B49A63" /><g className="sa-sway"><path d={blades(X0, X1, 206, 22, 23, 5, 8)} stroke="#E4D7AA" strokeWidth="1.2" fill="none" /></g><Birds x={40} y={60} n={2} /></g>,
    };
  },
  horde: (u) => {
    const Yurt = ({ x, y, s = 1 }) => (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-20 0 V-14 Q-18 -28 0 -30 Q18 -28 20 -14 V0Z" fill="#F7F1E4" />
        <path d="M-20 -14 Q0 -18 20 -14" stroke="#A63A2B" strokeWidth="2" fill="none" />
        <path d="M-20 -8 Q0 -11 20 -8" stroke="#C9BFA8" strokeWidth="1" fill="none" />
        <rect x="-4" y="-11" width="8" height="11" fill="#A63A2B" />
      </g>
    );
    return {
      sky: SKY.soft, sun: [300, 56, 15, "#FFEDBA"], focus: [170, 130, 130],
      clouds: [[40, 34, 0.8], [-220, 40, 1], [480, 36, 0.8]],
      far: <path d={hills(134, 8, 241, 90)} fill="#BDB794" />,
      mid: <g><path d={hills(150, 6, 243, 70)} fill="#C9BE8E" />{[-300, -200, 440, 540].map((x) => <Tree key={x} x={x} y={152} r={12} c="#7F9661" />)}</g>,
      land: (
        <g>
          <rect x="98" y="92" width="130" height="60" fill="#E9DCC0" />
          <path d="M92 94 L163 70 L234 94Z" fill="#7C5A42" />
          <path d="M98 120h130" stroke="#CBB892" strokeWidth="2" />
          {[110, 128, 146, 180, 198, 216].map((x) => <g key={x}><rect x={x - 4} y="100" width="8" height="12" fill="#4F6E80" /><rect x={x - 4} y="128" width="8" height="14" fill="#4F6E80" /></g>)}
          <rect x="152" y="96" width="22" height="56" fill="#F3EBD8" />
          {[154, 160, 166, 172].map((x) => <path key={x} d={`M${x} 98V152`} stroke="#CDBB98" strokeWidth="1.6" />)}
          <path d="M148 96 L163 84 L178 96Z" fill="#6A4C38" />
          <Yurt x={60} y={160} s={1.1} /><Yurt x={268} y={162} s={1.2} /><Yurt x={312} y={158} s={0.9} /><Yurt x={-120} y={158} /><Yurt x={460} y={160} />
        </g>
      ),
      fore: <g><path d={hills(194, 6, 245, 50)} fill="#B8AD78" /><g className="sa-sway"><path d={blades(X0, X1, 206, 18, 27, 6, 6)} stroke="#E6DDB2" strokeWidth="1.2" fill="none" /></g><Birds x={60} y={56} n={3} /></g>,
    };
  },
  snowPeak: (u) => {
    const p = [[X0, 120], [-300, 76], [-180, 110], [-60, 70], [40, 104], [120, 52], [158, 22], [180, 40], [204, 18], [250, 64], [330, 100], [440, 66], [560, 108], [X1, 90]];
    return {
      sky: SKY.cold, sun: [320, 40, 12, "#FFF6D8"], focus: [180, 70, 130],
      clouds: [[40, 46, 0.8], [-240, 40, 1], [480, 34, 0.8]],
      far: <g><path d={ptsPath(p)} fill="#8DA4B8" /><path d="M120 52 L158 22 L180 40 L204 18 L250 64 L236 70 L214 58 L200 72 L182 60 L164 74 L148 62 L132 70Z" fill="#FBFDFE" /><path d={capsPath(p, 0.32, 80)} fill="#FBFDFE" /><path d="M204 18 L250 64 L236 70 L214 58Z M158 22 L180 40 L170 50Z" fill="#D9E5EE" /></g>,
      mid: <g><path d={hills(124, 20, 251, 60)} fill="#4E7262" /><path d={slopeSpruces(X0, X1, (x) => 126 - Math.sin(x / 40) * 6, 16, 253, 7)} fill="#355748" /></g>,
      land: <path d={hills(156, 14, 255, 60)} fill="#5E7F5A" />,
      fore: (
        <g>
          <path d={spruces(X0, X1, 206, 40, 257, 12, 10)} fill="#1F3B30" />
          <Twinkles pts={[[160, 30], [204, 26, 0.9], [226, 50, 0.7], [140, 52, 0.8], [-60, 80], [440, 76]]} />
          <Birds x={260} y={80} n={2} />
        </g>
      ),
    };
  },
  mountainLake: (u) => ({
    sky: SKY.soft, sun: [180, 70, 16, "#FFF1C7"], focus: [180, 130, 120],
    clouds: [[40, 34, 0.8], [-220, 40, 1], [480, 36, 0.8]],
    far: (() => { const p = jagPts(96, 40, 261, 90); return <g><path d={ptsPath(p)} fill="#9DB0B8" /><path d={capsPath(p, 0.25, 70)} fill="#F6F9FA" /></g>; })(),
    mid: <g><path d={hills(118, 22, 263, 70)} fill="#3F6654" /><path d={slopeSpruces(X0, X1, (x) => 120 - Math.sin(x / 50) * 8, 15, 265, 6)} fill="#2C4C3E" /></g>,
    land: (
      <g>
        <rect x={X0} y="130" width={X1 - X0} height="60" fill={u("w")} />
        <g className="sa-mist"><path d="M-460 132 h400 q20-6 60 0 h400 q20-6 60 0 h200" stroke="#fff" strokeWidth="6" opacity=".35" fill="none" strokeLinecap="round" /></g>
        <Shimmer lines={[[-300, 146, 40], [-80, 156, 30], [100, 142, 30], [210, 162, 34], [380, 150, 30], [520, 160, 30]]} />
        <g transform="translate(150 158)"><g className="sa-sail"><path d="M0 0h20l-4 4H4Z" fill="#6E513A" /><circle cx="10" cy="-3" r="2" fill="#A63A2B" /><path d="M14 -2 l8 -10" stroke="#3a2a22" strokeWidth=".8" /></g></g>
      </g>
    ),
    fore: <g><path d={hills(194, 10, 267, 50)} fill="#425E44" /><path d={spruces(X0, 60, 200, 44, 269, 11)} fill="#1F3B30" /><path d={spruces(300, X1, 200, 44, 271, 11)} fill="#1F3B30" /><Birds x={120} y={52} n={3} /></g>,
    water: ["#6FA6B4", "#2F6475"],
  }),
};

function useLive(ref, on) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !on) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("sa-on");
      return;
    }
    const io = new IntersectionObserver((es) => es.forEach((e) => el.classList.toggle("sa-on", e.isIntersecting)), { rootMargin: "60px" });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, on]);
}

function Defs({ raw, s, mini, skyC }) {
  const water = s.water || ["#7FB2C2", "#3E7F93"];
  const sky = skyC || s.sky;
  return (
    <>
      <linearGradient id={`${raw}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={sky[0]} />
        <stop offset="1" stopColor={sky[1]} />
      </linearGradient>
      <linearGradient id={`${raw}w`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={water[0]} />
        <stop offset="1" stopColor={water[1]} />
      </linearGradient>
      <radialGradient id={`${raw}gold`} cx=".38" cy=".35" r=".7">
        <stop offset="0" stopColor="#FFF0B8" />
        <stop offset=".45" stopColor="#F2C14E" />
        <stop offset="1" stopColor="#B87A12" />
      </radialGradient>
      <radialGradient id={`${raw}dome`} cx=".38" cy=".3" r=".8">
        <stop offset="0" stopColor="#8EDDE0" />
        <stop offset=".5" stopColor="#2FA3AB" />
        <stop offset="1" stopColor="#17646E" />
      </radialGradient>
      <linearGradient id={`${raw}glass`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#E8F3F2" />
        <stop offset=".6" stopColor="#A9CFD3" />
        <stop offset="1" stopColor="#7FAFB8" />
      </linearGradient>
      <linearGradient id={`${raw}haze`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#fff" stopOpacity=".55" />
      </linearGradient>
      {!mini && (
        <pattern id={`${raw}grain`} width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r=".6" fill="#3a2a10" />
          <circle cx="5" cy="4.5" r=".45" fill="#fff" />
        </pattern>
      )}
    </>
  );
}
const Sky = ({ raw }) => <rect x={X0} y="-40" width={X1 - X0} height="280" fill={`url(#${raw}sky)`} />;
const Sun = ({ sun }) =>
  sun ? (
    <g transform={`translate(${sun[0]} ${sun[1]})`}>
      <g className="sa-sunr">
        <circle r={sun[2] * 2} fill={sun[3]} opacity=".28" />
        <circle r={sun[2]} fill={sun[3]} />
      </g>
    </g>
  ) : null;
const Clouds = ({ s }) => (s.clouds ? <g className="sa-p0">{s.clouds.map(([x, y, sc], i) => <Cloud key={i} x={x} y={y} s={sc} d={i * 7} o={0.75} />)}</g> : null);
const Grain = ({ raw }) => <rect x={X0} y="-40" width={X1 - X0} height="280" fill={`url(#${raw}grain)`} opacity=".07" />;
const Haze = ({ raw }) => <rect x={X0} y="80" width={X1 - X0} height="70" fill={`url(#${raw}haze)`} opacity=".55" />;

function useParallax(on) {
  if (!on) return {};
  return {
    onPointerMove: (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(2));
      e.currentTarget.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(2));
    },
    onPointerLeave: (e) => {
      e.currentTarget.style.setProperty("--mx", "0");
      e.currentTarget.style.setProperty("--my", "0");
    },
  };
}
function mk(raw) {
  const u = (n) => `url(#${raw}${n})`;
  u.raw = (n) => `${raw}${n}`;
  return u;
}
const HERO_VB = "-250 0 620 200";

export default function SightArt({ kind, mini = false, wide = false, className = "", title }) {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ref = useRef(null);
  useLive(ref, !mini);
  const k = SCENES[kind] ? kind : "steppeReserve";
  const s = SCENES[k](mk(raw));
  const [cx, cy, size] = s.focus;
  const vb = mini ? `${cx - size / 2} ${cy - size / 2} ${size} ${size}` : wide ? HERO_VB : "0 0 360 200";
  return (
    <div ref={ref} className={`sa sa-k-${k}${mini ? " sa-mini" : ""}${wide ? " sa-wide" : ""} ${className}`} {...useParallax(!mini)} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <svg viewBox={vb} preserveAspectRatio={wide ? "xMaxYMid slice" : "xMidYMid slice"} focusable="false">
        <defs><Defs raw={raw} s={s} mini={mini} /></defs>
        <Sky raw={raw} />
        {s.stars && !mini && <Twinkles pts={s.stars.map(([x, y]) => [x, y, 0.6])} />}
        <Sun sun={s.sun} />
        {!mini && <Clouds s={s} />}
        <g className="sa-p1">{s.far}</g>
        <Haze raw={raw} />
        <g className="sa-p2">{s.mid}</g>
        <g className="sa-p3">{s.land}</g>
        <g className="sa-p4">{s.fore}</g>
        {!mini && <Grain raw={raw} />}
      </svg>
    </div>
  );
}

/* ── Өңір панорамасы: екі көрікті жер бір аспан астында + өңірге тән тіршілік ── */
const Camel = ({ x, y, s = 1, c = "#5B3B2C" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={c}>
    <path d="M-10 -6Q-11 -11 -7 -12Q-5 -17 -2 -12Q0 -17 3 -12Q7 -12 8 -9Q10 -12 11 -16Q12 -18 15 -17L15.5 -15.5Q13.5 -15 13 -13Q11.5 -7 8 -5Q2 -3 -10 -6Z" />
    <path d="M-8 -6V0M-5.5 -5V0M4 -5V0M6.5 -5.5V0" stroke={c} strokeWidth="1.4" />
    <path d="M-10 -8q-2 1-2 4" stroke={c} strokeWidth="1" fill="none" />
  </g>
);
const HorseS = ({ x, y, s = 1, c = "#4A3428", flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} fill={c}>
    <path d="M-12 -14Q0 -18 10 -14L16 -24Q20 -26 22 -22L14 -10Q12 -6 10 -6L9 0H7L7 -6H-6L-8 0H-10L-10 -6Q-14 -8 -12 -14Z" />
    <path d="M-12 -12q-5 2 -5 8" stroke={c} strokeWidth="2" fill="none" />
  </g>
);
const ACCENTS = {
  camels: (
    <g transform="translate(330 190)">
      <g className="sa-walk">
        <Camel x={0} y={0} s={0.95} />
        <Camel x={-22} y={1} s={0.9} />
        <Camel x={-44} y={0} s={0.85} />
        <Camel x={-64} y={1} s={0.75} c="#6B4A38" />
        <path d="M14 -14 L-8 -12 M-8 -13 L-30 -11 M-30 -12 L-52 -10" stroke="#5B3B2C" strokeWidth=".5" opacity=".6" />
      </g>
    </g>
  ),
  horses: (
    <g transform="translate(320 192)">
      <g className="sa-walk sa-walk-slow">
        <HorseS x={0} y={0} s={0.7} />
        <HorseS x={-26} y={3} s={0.62} c="#6B4A34" />
        <HorseS x={-50} y={-1} s={0.55} c="#8A5F3E" flip />
        <HorseS x={20} y={4} s={0.5} c="#6B4A34" />
      </g>
    </g>
  ),
  eagle: (
    <g transform="translate(-60 40)">
      <g className="sa-soar">
        <path d="M-22 2Q-12 -8 -2 0L0 3L2 0Q12 -8 22 2Q12 -3 4 4L0 8L-4 4Q-12 -3 -22 2Z" fill="#3A2C24" />
        <path d="M-2 6l2 5 2-5" fill="#3A2C24" />
      </g>
    </g>
  ),
  birds: <Birds x={-120} y={50} n={4} s={1.2} />,
};
const HERO = {
  astana: { acc: ["birds"] },
  "almaty-city": { acc: ["eagle"] },
  shymkent: { sky: "gold", acc: ["birds"] },
  akmola: { acc: ["eagle"] },
  aktobe: { sky: "warm", acc: ["horses"] },
  "almaty-reg": { sky: "desert", acc: ["eagle"] },
  atyrau: { sky: "gold", acc: ["camels"], sea: 1 },
  abai: { sky: "warm", acc: ["horses"] },
  zhambyl: { sky: "gold", acc: ["camels"] },
  zhetysu: { sky: "desert", acc: ["camels"] },
  karaganda: { sky: "warm", acc: ["horses"] },
  kostanay: { acc: ["horses"] },
  kyzylorda: { acc: ["camels"] },
  mangystau: { sky: "sunset", acc: ["camels", "birds"], sea: 1 },
  pavlodar: { acc: ["eagle"] },
  "north-kz": { acc: ["horses"] },
  turkistan: { sky: "gold", acc: ["camels"] },
  ulytau: { sky: "warm", acc: ["horses", "eagle"] },
  "west-kz": { acc: ["horses"] },
  "east-kz": { sky: "cold", acc: ["eagle"] },
};

export function RegionScene({ region, className = "" }) {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ref = useRef(null);
  useLive(ref, true);
  const sights = (region && region.sights) || [];
  const k1 = kindOf(sights[0]);
  let k2 = sights[1] ? kindOf(sights[1]) : "steppeReserve";
  if (k2 === k1) k2 = sights[2] ? kindOf(sights[2]) : k1 === "steppeReserve" ? "river" : "steppeReserve";
  const cfg = HERO[region && region.id] || {};
  const s1 = SCENES[k1](mk(raw));
  const s2 = SCENES[k2](mk(`${raw}b`));
  const sky = cfg.sky ? SKY[cfg.sky] : s1.sky;
  const sun = s1.sun ? [s1.sun[0], cfg.sky === "sunset" ? Math.max(s1.sun[1], 96) : s1.sun[1], s1.sun[2] * 1.15, s1.sun[3]] : null;
  const mL = `url(#${raw}mL)`, mR = `url(#${raw}mR)`;
  return (
    <div ref={ref} className={`sa sa-wide sa-region ${className}`} {...useParallax(true)} aria-hidden="true">
      <svg viewBox={HERO_VB} preserveAspectRatio="xMaxYMid slice" focusable="false">
        <defs>
          <Defs raw={raw} s={s1} skyC={sky} />
          <Defs raw={`${raw}b`} s={s2} mini />
          <linearGradient id={`${raw}fL`} gradientUnits="userSpaceOnUse" x1="-140" y1="0" x2="40" y2="0">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <linearGradient id={`${raw}fR`} gradientUnits="userSpaceOnUse" x1="-140" y1="0" x2="40" y2="0">
            <stop offset="0" stopColor="#000" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
          <radialGradient id={`${raw}mist`}>
            <stop offset="0" stopColor="#fff" stopOpacity=".3" />
            <stop offset=".6" stopColor="#fff" stopOpacity=".12" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id={`${raw}mL`} maskUnits="userSpaceOnUse" x={X0} y="-40" width={X1 - X0} height="280">
            <rect x={X0} y="-40" width={X1 - X0} height="280" fill={`url(#${raw}fL)`} />
          </mask>
          <mask id={`${raw}mR`} maskUnits="userSpaceOnUse" x={X0} y="-40" width={X1 - X0} height="280">
            <rect x={X0} y="-40" width={X1 - X0} height="280" fill={`url(#${raw}fR)`} />
          </mask>
        </defs>
        <Sky raw={raw} />
        {s1.stars && <Twinkles pts={s1.stars.map(([x, y]) => [x, y, 0.6])} />}
        <Sun sun={sun} />
        <Clouds s={s1} />
        {cfg.sea && (
          <g className="sa-p1">
            <rect x={X0} y="90" width={X1 - X0} height="40" fill="#4BA5AE" />
            <rect x={X0} y="90" width={X1 - X0} height="1.6" fill="#D6EFEC" />
            <Shimmer lines={[[-220, 95, 30], [-90, 98, 24], [40, 94, 30], [200, 97, 26], [320, 95, 30]]} />
          </g>
        )}
        <g mask={mR}>
          <g className="sa-p1">{s1.far}</g>
        </g>
        <g mask={mL}>
          <g transform="translate(-330 0)">
            <g className="sa-p1">{s2.far}</g>
          </g>
        </g>
        <Haze raw={raw} />
        <g mask={mR}>
          <g className="sa-p2">{s1.mid}</g>
        </g>
        <g mask={mL}>
          <g transform="translate(-330 0)">
            <g className="sa-p2">{s2.mid}</g>
            <g className="sa-p3">{s2.land}</g>
          </g>
        </g>
        <ellipse cx="-50" cy="128" rx="150" ry="70" fill={`url(#${raw}mist)`} />
        <g mask={mR}>
          <g className="sa-p3">{s1.land}</g>
        </g>
        <g className="sa-p4">{s1.fore}</g>
        <g className="sa-p4">{(cfg.acc || []).filter((a) => a !== "eagle" && a !== "birds").map((a) => <g key={a}>{ACCENTS[a]}</g>)}</g>
        {(cfg.acc || []).filter((a) => a === "eagle" || a === "birds").map((a) => <g key={a}>{ACCENTS[a]}</g>)}
        <Grain raw={raw} />
      </svg>
    </div>
  );
}
