// Тарих бөліміндегі 3D картаға арналған таза есептеулер (three.js-сіз, Node-та да тексеріледі):
// облыс шекараларынан елдің тұтас контуры, географиялық координат → SVG (1000×554) сәйкестігі,
// нақты географияға сүйенген процедуралық жер бедері (сыртқы дерек жүктелмейді) және түстер.
import { KZ_PATHS } from "./kzmap";
import { RIVERS, LAKES } from "./kzscene";

export const MAP_W = 1000;
export const MAP_H = 554;

/* ── SVG жолдарын оқу ── */
// «M x y L x y … Z» → көпбұрыштар
export function parsePolys(d) {
  const polys = [];
  let cur = null;
  for (const t of d.match(/[MLZ][^MLZ]*/g) || []) {
    const c = t[0];
    if (c === "Z") { if (cur && cur.length > 2) polys.push(cur); cur = null; continue; }
    const n = t.slice(1).trim().split(/[ ,]+/).filter(Boolean).map(Number);
    if (c === "M") { if (cur && cur.length > 2) polys.push(cur); cur = []; }
    if (!cur) cur = [];
    for (let i = 0; i + 1 < n.length; i += 2) cur.push([n[i], n[i + 1]]);
  }
  if (cur && cur.length > 2) polys.push(cur);
  return polys;
}

// Абсолютті M / L / C / Q / Z жолын сынық сызыққа айналдыру (step — шамамен қадам, SVG бірлігі)
export function samplePath(d, step = 2) {
  const out = [];
  let cur = null, x = 0, y = 0, sx = 0, sy = 0;
  const toks = d.match(/[MLCQZ]|-?\d*\.?\d+(?:e-?\d+)?/gi) || [];
  let i = 0, cmd = "";
  const num = () => Number(toks[i++]);
  while (i < toks.length) {
    if (/[MLCQZ]/i.test(toks[i])) cmd = toks[i++].toUpperCase();
    if (cmd === "M") {
      if (cur && cur.pts.length > 1) out.push(cur);
      x = num(); y = num(); sx = x; sy = y;
      cur = { pts: [[x, y]], closed: false };
      cmd = "L";
    } else if (cmd === "L") {
      const nx = num(), ny = num();
      const n = Math.max(1, Math.ceil(Math.hypot(nx - x, ny - y) / step));
      for (let k = 1; k <= n; k++) cur.pts.push([x + ((nx - x) * k) / n, y + ((ny - y) * k) / n]);
      x = nx; y = ny;
    } else if (cmd === "C" || cmd === "Q") {
      const p = cmd === "C" ? [num(), num(), num(), num(), num(), num()] : [num(), num(), num(), num()];
      const ex = p[p.length - 2], ey = p[p.length - 1];
      const len = Math.hypot(p[0] - x, p[1] - y) + Math.hypot(ex - p[p.length - 4], ey - p[p.length - 3]) + (cmd === "C" ? Math.hypot(p[2] - p[0], p[3] - p[1]) : 0);
      const n = Math.max(2, Math.ceil(len / step));
      for (let k = 1; k <= n; k++) {
        const t = k / n, u = 1 - t;
        if (cmd === "C") cur.pts.push([u * u * u * x + 3 * u * u * t * p[0] + 3 * u * t * t * p[2] + t * t * t * ex, u * u * u * y + 3 * u * u * t * p[1] + 3 * u * t * t * p[3] + t * t * t * ey]);
        else cur.pts.push([u * u * x + 2 * u * t * p[0] + t * t * ex, u * u * y + 2 * u * t * p[1] + t * t * ey]);
      }
      x = ex; y = ey;
    } else if (cmd === "Z") {
      if (cur) { cur.closed = true; if (cur.pts.length > 1) out.push(cur); }
      cur = null; x = sx; y = sy; cmd = "";
    } else i++;
  }
  if (cur && cur.pts.length > 1) out.push(cur);
  return out;
}

/* ── География → SVG ── */
// KZ_CENTERS-тегі үш қала бойынша аффиндік сәйкестік (Астана, Алматы, Шымкент)
export const GEO_REF = [
  { name: "Астана", lat: 51.17, lon: 71.45, x: 609, y: 165 },
  { name: "Алматы", lat: 43.24, lon: 76.95, x: 741, y: 449 },
  { name: "Шымкент", lat: 42.32, lon: 69.59, x: 564, y: 481 },
];
function det3(m) {
  return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
}
function solve3(M, v) {
  const D = det3(M);
  return [0, 1, 2].map((c) => det3(M.map((r, k) => r.map((q, j) => (j === c ? v[k] : q)))) / D);
}
const GM = GEO_REF.map((r) => [r.lon, r.lat, 1]);
export const GEO_AX = solve3(GM, GEO_REF.map((r) => r.x));
export const GEO_AY = solve3(GM, GEO_REF.map((r) => r.y));
export function geoToSvg(lat, lon) {
  return [GEO_AX[0] * lon + GEO_AX[1] * lat + GEO_AX[2], GEO_AY[0] * lon + GEO_AY[1] * lat + GEO_AY[2]];
}
const GDET = GEO_AX[0] * GEO_AY[1] - GEO_AX[1] * GEO_AY[0];
export function svgToGeo(x, y) {
  const a = x - GEO_AX[2], b = y - GEO_AY[2];
  return [(GEO_AX[0] * b - GEO_AY[0] * a) / GDET, (GEO_AY[1] * a - GEO_AX[1] * b) / GDET]; // [lat, lon]
}

/* ── Растр: елдің тұтас пішіні ── */
// Барлық облыс көпбұрыштарын жол-жолымен (scanline) бояймыз, кейін 1 пиксельге «жабамыз» (облыстар арасындағы саңылаулар жойылады)
export function rasterizeLand(res = 1) {
  const W = Math.ceil(MAP_W * res) + 2, H = Math.ceil(MAP_H * res) + 2; // 1 пиксель бос жиек
  const g = new Uint8Array(W * H);
  const xs = [];
  // Әр облыс жеке боялады (even-odd облыс ішінде), нәтиже — «кез келгенінің ішінде»
  for (const d of Object.values(KZ_PATHS)) {
    const polys = parsePolys(d);
    const pe = [];
    for (const p of polys) for (let i = 0, j = p.length - 1; i < p.length; j = i++) pe.push([p[j][0] * res + 1, p[j][1] * res + 1, p[i][0] * res + 1, p[i][1] * res + 1]);
    let y0m = 1e9, y1m = -1e9;
    for (const e of pe) { y0m = Math.min(y0m, e[1], e[3]); y1m = Math.max(y1m, e[1], e[3]); }
    for (let r = Math.max(0, Math.floor(y0m)); r <= Math.min(H - 1, Math.ceil(y1m)); r++) {
      const yc = r + 0.5;
      xs.length = 0;
      for (const [x0, y0, x1, y1] of pe) if ((y0 > yc) !== (y1 > yc)) xs.push(x0 + ((yc - y0) * (x1 - x0)) / (y1 - y0));
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const a = Math.max(0, Math.ceil(xs[k] - 0.5)), b = Math.min(W - 1, Math.floor(xs[k + 1] - 0.5));
        for (let c = a; c <= b; c++) g[r * W + c] = 1;
      }
    }
  }
  const morph = (src, dilate) => {
    const o = new Uint8Array(W * H);
    for (let r = 1; r < H - 1; r++) for (let c = 1; c < W - 1; c++) {
      let v = dilate ? 0 : 1;
      for (let dr = -1; dr <= 1 && v === (dilate ? 0 : 1); dr++) for (let dc = -1; dc <= 1; dc++) {
        const s = src[(r + dr) * W + c + dc];
        if (dilate && s) { v = 1; break; }
        if (!dilate && !s) { v = 0; break; }
      }
      o[r * W + c] = v;
    }
    return o;
  };
  const closed = morph(morph(g, true), false);
  return { W, H, res, data: closed };
}

// Растрдан контур (marching squares) → ең үлкен тұйық сызық, Дуглас–Пекер бойынша жеңілдетілген, SVG координатында
export function traceOutline(mask, tol = 0.6) {
  const { W, H, res, data } = mask;
  const V = (c, r) => (c < 0 || r < 0 || c >= W || r >= H ? 0 : data[r * W + c]);
  // түйіндер: көлденең қабырға (c,r)-(c+1,r) → id = r*W+c ; тік қабырға (c,r)-(c,r+1) → W*H + r*W + c
  const adj = new Map();
  const link = (a, b) => {
    (adj.get(a) || adj.set(a, []).get(a)).push(b);
    (adj.get(b) || adj.set(b, []).get(b)).push(a);
  };
  for (let r = -1; r < H; r++) for (let c = -1; c < W; c++) {
    const a = V(c, r), b = V(c + 1, r), cc = V(c + 1, r + 1), d = V(c, r + 1);
    const T = a !== b ? "h" + c + "," + r : null;
    const B = d !== cc ? "h" + c + "," + (r + 1) : null;
    const Lf = a !== d ? "v" + c + "," + r : null;
    const R = b !== cc ? "v" + (c + 1) + "," + r : null;
    const e = [T, R, B, Lf].filter(Boolean);
    if (e.length === 2) link(e[0], e[1]);
    else if (e.length === 4) {
      if (a) { link(T, R); link(B, Lf); } else { link(Lf, T); link(R, B); }
    }
  }
  const pt = (k) => {
    const [cs, rs] = k.slice(1).split(",");
    const c = +cs, r = +rs;
    // пиксель (c,r) центрі = (c+0.5, r+0.5); 1 пиксель жиекті шегереміз
    const px = k[0] === "h" ? c + 1 : c + 0.5;
    const py = k[0] === "h" ? r + 0.5 : r + 1;
    return [(px - 1) / res, (py - 1) / res];
  };
  const seen = new Set();
  let best = null, bestA = 0;
  for (const start of adj.keys()) {
    if (seen.has(start)) continue;
    const loop = [];
    let prev = null, cur = start;
    while (cur && !seen.has(cur)) {
      seen.add(cur);
      loop.push(pt(cur));
      const nb = adj.get(cur);
      const nx = nb[0] !== prev ? nb[0] : nb[1];
      prev = cur;
      cur = nx;
    }
    const A = Math.abs(polyArea(loop));
    if (A > bestA) { bestA = A; best = loop; }
  }
  return simplifyClosed(best || [], tol);
}

export function polyArea(p) {
  let a = 0;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) a += (p[j][0] - p[i][0]) * (p[j][1] + p[i][1]);
  return a / 2;
}

function dp(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const st = [[0, pts.length - 1]];
  while (st.length) {
    const [a, b] = st.pop();
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const L = Math.hypot(bx - ax, by - ay) || 1e-9;
    let md = 0, mi = -1;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs((bx - ax) * (ay - pts[i][1]) - (ax - pts[i][0]) * (by - ay)) / L;
      if (d > md) { md = d; mi = i; }
    }
    if (md > tol && mi > 0) { keep[mi] = 1; st.push([a, mi], [mi, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
function simplifyClosed(p, tol) {
  if (p.length < 8) return p;
  const h = Math.floor(p.length / 2);
  const a = dp(p.slice(0, h + 1), tol), b = dp(p.slice(h).concat([p[0]]), tol);
  return a.slice(0, -1).concat(b.slice(0, -1));
}

// Сынық сызықты max қадамға дейін тығыздау (тұйық болса соңғы-бірінші кесіндісі де)
export function densify(pts, maxStep, closed = true) {
  const out = [];
  const n = pts.length;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    const k = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / maxStep));
    for (let s = 0; s < k; s++) out.push([a[0] + ((b[0] - a[0]) * s) / k, a[1] + ((b[1] - a[1]) * s) / k]);
  }
  if (!closed) out.push(pts[n - 1]);
  return out;
}

export function isLand(mask, x, y) {
  const c = Math.floor(x * mask.res) + 1, r = Math.floor(y * mask.res) + 1;
  if (c < 0 || r < 0 || c >= mask.W || r >= mask.H) return false;
  return mask.data[r * mask.W + c] === 1;
}

/* ── Шу (детерминді) ── */
function hash2(i, j) {
  let h = Math.imul(i, 374761393) + Math.imul(j, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi), b = hash2(xi + 1, yi), c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; // 0..1
}
function fbm(x, y, oct = 4) {
  let s = 0, amp = 0.5, f = 1, n = 0;
  for (let o = 0; o < oct; o++) { s += amp * vnoise(x * f + o * 17.3, y * f - o * 9.1); n += amp; amp *= 0.5; f *= 2.03; }
  return s / n;
}
function ridged(x, y, oct = 4) {
  let s = 0, amp = 0.5, f = 1, n = 0;
  for (let o = 0; o < oct; o++) { const r = 1 - Math.abs(vnoise(x * f + o * 31.7, y * f + o * 5.3) * 2 - 1); s += amp * r * r; n += amp; amp *= 0.5; f *= 2.1; }
  return s / n;
}
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/* ── Жер бедері: нақты тау жоталары (ендік, бойлық) ── */
// [ат, lat1, lon1, lat2, lon2, биіктік (1 ≈ ең биік шың), ені (SVG бірлігі ≈ 3 км)]
const RIDGES = [
  ["Іле Алатауы", 43.08, 75.5, 43.02, 78.4, 0.82, 15],
  ["Күнгей Алатауы", 42.88, 76.4, 42.92, 78.9, 0.62, 12],
  ["Хантәңірі сілемі", 42.3, 79.3, 42.22, 80.25, 1.0, 17],
  ["Кетпен", 43.32, 79.4, 43.05, 80.4, 0.5, 12],
  ["Қырғыз Алатауы", 42.78, 71.6, 42.66, 74.7, 0.6, 13],
  ["Талас Алатауы / Өгем", 42.62, 69.9, 42.18, 70.95, 0.68, 13],
  ["Қаратау", 42.8, 70.05, 44.2, 68.0, 0.3, 9],
  ["Шу-Іле таулары", 44.0, 73.6, 44.95, 75.6, 0.2, 14],
  ["Жетісу Алатауы", 44.72, 78.4, 45.35, 81.2, 0.78, 19],
  ["Тарбағатай", 47.3, 80.1, 47.1, 83.4, 0.42, 12],
  ["Сауыр", 47.18, 84.0, 47.02, 85.4, 0.56, 12],
  ["Кенді Алтай", 50.3, 82.9, 49.85, 84.6, 0.48, 15],
  ["Оңтүстік Алтай", 49.15, 83.6, 49.8, 86.7, 0.95, 22],
  ["Қалба", 49.4, 81.0, 48.8, 83.8, 0.28, 14],
  ["Шыңғыстау", 48.8, 78.4, 49.3, 80.5, 0.24, 18],
  ["Мұғалжар", 49.0, 58.3, 47.2, 59.0, 0.2, 11],
  ["Маңғыстау Қаратауы", 44.42, 51.3, 44.05, 52.65, 0.12, 6],
];
// [ат, lat, lon, биіктік, радиус]
const HILLS = [
  ["Сарыарқа", 49.0, 73.0, 0.13, 95],
  ["Сарыарқа батысы", 50.0, 70.0, 0.08, 70],
  ["Қарқаралы", 49.4, 75.5, 0.2, 16],
  ["Ақсораң", 48.4, 75.5, 0.23, 18],
  ["Баянауыл", 50.8, 75.7, 0.17, 12],
  ["Кент", 49.2, 76.4, 0.17, 14],
  ["Ұлытау", 48.7, 67.0, 0.24, 18],
  ["Көкшетау", 53.0, 70.2, 0.13, 14],
  ["Бетпақдала", 45.8, 70.0, 0.07, 60],
  ["Мұғалжар үстірті", 48.0, 58.6, 0.06, 35],
  ["Жалпы Сырт", 50.6, 56.0, 0.07, 50],
  ["Торғай үстірті", 50.6, 61.8, 0.05, 40],
];
const toSvgSeg = (r) => { const a = geoToSvg(r[1], r[2]), b = geoToSvg(r[3], r[4]); return { ax: a[0], ay: a[1], bx: b[0], by: b[1], h: r[5], w: r[6] }; };
const RSEG = RIDGES.map(toSvgSeg);
const HPTS = HILLS.map((r) => { const p = geoToSvg(r[1], r[2]); return { x: p[0], y: p[1], h: r[3], r: r[4] }; });
const USTYURT = (() => { const c = geoToSvg(44.2, 56.4); return { x: c[0], y: c[1], rx: 2.4 * GEO_AX[0], ry: 1.55 * -GEO_AY[1] }; })();
const CASPIAN_LOW = (() => { const c = geoToSvg(47.4, 50.2); return { x: c[0], y: c[1], r: 150 }; })();
const TURAN = (() => { const c = geoToSvg(44.6, 63.0); return { x: c[0], y: c[1], r: 150 }; })();
const KARAGIYE = (() => { const c = geoToSvg(43.45, 51.6); return { x: c[0], y: c[1], r: 7 }; })();

// Көл ойпаттары (LAKES жолдарынан — 2D картадағы орнымен бірдей)
export const LAKE_POLYS = LAKES.map((d) => samplePath(d, 3)[0]?.pts || []);
const LAKE_E = LAKE_POLYS.map((p) => {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const [x, y] of p) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  // су деңгейі — жағалаудың ең төмен нүктесі (көл жер бетінен «кратер» болып ойылмайды)
  const level = Math.max(0.006, Math.min(...p.map(([x, y]) => rawHeight(x, y))) - 0.003);
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, rx: (x1 - x0) / 2 + 2, ry: (y1 - y0) / 2 + 2, level };
});
export const LAKE_LEVELS = LAKE_E.map((e) => e.level);

function segDist(px, py, s) {
  const dx = s.bx - s.ax, dy = s.by - s.ay;
  const t = Math.max(0, Math.min(1, ((px - s.ax) * dx + (py - s.ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - s.ax - t * dx, py - s.ay - t * dy);
}

// Көлсіз «шикі» биіктік
function rawHeight(x, y) {
  // негізгі жазықтық: жұмсақ толқындар
  let base = 0.035 + 0.035 * (fbm(x * 0.012, y * 0.012, 3) - 0.5);
  // Каспий маңы ойпаты және Тұран ойпаты — төмен
  const dc = Math.hypot(x - CASPIAN_LOW.x, (y - CASPIAN_LOW.y) * 1.1);
  base *= 0.15 + 0.85 * smooth(CASPIAN_LOW.r * 0.45, CASPIAN_LOW.r * 1.15, dc);
  const dt = Math.hypot(x - TURAN.x, y - TURAN.y);
  const turan = 1 - smooth(TURAN.r * 0.4, TURAN.r, dt);
  base *= 1 - 0.45 * turan;
  // құм төбелері (Қызылқұм, Арал маңы) — өте ұсақ
  base += turan * 0.01 * fbm(x * 0.08, y * 0.06, 2);
  // Қарақия ойысы
  base -= 0.02 * (1 - smooth(0, KARAGIYE.r * 2.2, Math.hypot(x - KARAGIYE.x, y - KARAGIYE.y)));

  // Үстірт: тегіс үстірт, шеті тік «шың» жар
  const ux = (x - USTYURT.x) / USTYURT.rx, uy = (y - USTYURT.y) / USTYURT.ry;
  const ud = Math.pow(ux ** 4 + uy ** 4, 0.25) + 0.12 * (fbm(x * 0.03, y * 0.03, 2) - 0.5);
  base += 0.06 * (1 - smooth(0.8, 1.0, ud));

  // Төбелер мен қыраттар
  let hills = 0;
  for (const p of HPTS) {
    const d2 = ((x - p.x) ** 2 + (y - p.y) ** 2) / (p.r * p.r);
    if (d2 < 9) hills += p.h * Math.exp(-d2);
  }
  hills *= 0.7 + 0.6 * fbm(x * 0.05, y * 0.05, 3);

  // Тау жоталары
  let mtn = 0;
  for (const s of RSEG) {
    const d = segDist(x, y, s);
    if (d < s.w * 3.2) mtn = Math.max(mtn, s.h * Math.exp(-((d / s.w) ** 2)));
  }
  let h = base + hills;
  if (mtn > 1e-4) {
    const r = ridged(x * 0.045, y * 0.045, 4);
    h += mtn * (0.55 + 0.6 * r);
  }
  return h;
}

// Биіктік 0…≈1 (1 ≈ 5 км шың), SVG координатында
export function heightAt(x, y) {
  let h = rawHeight(x, y);
  // Көлдер: айнала жер жайпақ түсіп, су деңгейіне жетеді
  for (const e of LAKE_E) {
    const ed = Math.hypot((x - e.x) / e.rx, (y - e.y) / e.ry);
    if (ed < 1.9) { const lv = e.level - 0.004; h = lv + (Math.max(lv, h) - lv) * smooth(0.9, 1.9, ed); }
  }
  // жұмсақ шек: шыңдар найза болмас үшін
  return h < 0.6 ? h : 0.6 + (1 - Math.exp(-(h - 0.6) * 2.2)) / 2.2;
}

/* ── Түстер (sRGB 0…1): солтүстік — жасылдау дала, оңтүстік — құм, таулар — қоңыр, шыңдар — қар ── */
const C = {
  north: [0.64, 0.66, 0.42], steppe: [0.80, 0.71, 0.48], sand: [0.88, 0.77, 0.55], caspian: [0.84, 0.76, 0.58],
  foot: [0.55, 0.6, 0.38], brown: [0.62, 0.52, 0.38], rock: [0.53, 0.5, 0.46], snow: [0.96, 0.95, 0.92],
};
const mix3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
export function colorAt(x, y, h) {
  const [lat, lon] = svgToGeo(x, y);
  const n = fbm(x * 0.03 + 50, y * 0.03, 3);
  // ендік бойынша жазық түсі
  let c = mix3(C.sand, C.steppe, smooth(44.5, 47.5, lat + (n - 0.5) * 1.5));
  c = mix3(c, C.north, smooth(50.0, 53.5, lat + (n - 0.5) * 1.2));
  c = mix3(c, C.caspian, (1 - smooth(60, 150, Math.hypot(x - CASPIAN_LOW.x, y - CASPIAN_LOW.y))) * 0.7);
  // тау бөктері (Жетісу, Алтай) — жасылдау орман/бау
  const foothill = smooth(0.1, 0.22, h) * (1 - smooth(0.4, 0.55, h)) * (lon > 69 ? 1 : 0.4);
  c = mix3(c, C.foot, foothill * 0.75);
  c = mix3(c, C.brown, smooth(0.3, 0.48, h) * 0.85);
  c = mix3(c, C.rock, smooth(0.48, 0.64, h));
  c = mix3(c, C.snow, smooth(0.66 + (n - 0.5) * 0.08, 0.78, h));
  const k = 0.94 + 0.1 * n;
  return [Math.min(1, c[0] * k), Math.min(1, c[1] * k), Math.min(1, c[2] * k)];
}

/* ── Өзендер мен облыс шекаралары ── */
export function riverLines(mask, step = 2) {
  const out = [];
  RIVERS.forEach((d, ri) => {
    for (const seg of samplePath(d, step)) {
      let cur = [];
      for (const p of seg.pts) {
        if (isLand(mask, p[0], p[1])) cur.push(p);
        else { if (cur.length > 1) out.push({ ri, pts: cur }); cur = []; }
      }
      if (cur.length > 1) out.push({ ri, pts: cur });
    }
  });
  return out;
}
export function borderLines(step = 3) {
  const out = [];
  for (const d of Object.values(KZ_PATHS)) for (const p of parsePolys(d)) out.push(densify(p, step, true));
  return out;
}
