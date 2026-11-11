// Қазақстан картасының «ойын» стиліндегі көрінісі: жер бедері, орман, тау, өзен, көл. Барлығы детерминді (бір сайдың өзінде бірдей).
import { KZ_PATHS, KZ_CENTERS } from "./kzmap";

function parse(d) {
  const polys = [];
  let cur = null;
  for (const t of d.match(/[MLZ][^MLZ]*/g) || []) {
    const c = t[0];
    if (c === "Z") { if (cur && cur.length > 2) polys.push(cur); cur = null; continue; }
    const n = t.slice(1).trim().split(/[ ,]+/).map(Number);
    if (c === "M") { if (cur && cur.length > 2) polys.push(cur); cur = []; }
    if (!cur) cur = [];
    for (let i = 0; i + 1 < n.length; i += 2) cur.push([n[i], n[i + 1]]);
  }
  if (cur && cur.length > 2) polys.push(cur);
  return polys;
}
function inside(polys, x, y) {
  let c = false;
  for (const p of polys) for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, yi] = p[i], [xj, yj] = p[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// Жер бедері түрі
export const TERRAIN = {
  "Абай облысы": "forest", "Ақмола облысы": "steppe", "Ақтөбе облысы": "steppe", "Алматы облысы": "mountain", "Атырау облысы": "desert",
  "Батыс Қазақстан облысы": "steppe", "Жамбыл облысы": "steppe", "Жетісу облысы": "mountain", "Қарағанды облысы": "steppe", "Қостанай облысы": "steppe",
  "Қызылорда облысы": "desert", "Маңғыстау облысы": "desert", "Павлодар облысы": "steppe", "Солтүстік Қазақстан облысы": "forest",
  "Түркістан облысы": "steppe", "Ұлытау облысы": "desert", "Шығыс Қазақстан облысы": "mountain", "Астана": "steppe", "Алматы": "mountain", "Шымкент": "steppe",
};
const CITIES = ["Астана", "Алматы", "Шымкент"];
// Әр өңірдің үлкен белгісі
export const LANDMARK = {
  astana: "baiterek", "almaty-city": "almaty", shymkent: "mosque", akmola: "lake", aktobe: "canyon", "almaty-reg": "canyon", atyrau: "fish", abai: "monument",
  zhambyl: "mausoleum", zhetysu: "mountain", karaganda: "mine", kostanay: "wheat", kyzylorda: "rocket", mangystau: "camel", pavlodar: "lake",
  "north-kz": "snowpine", turkistan: "yasawi", ulytau: "mausoleum", "west-kz": "yurt", "east-kz": "deer",
};

export const RIVERS = [
  "M962 296 C934 284 908 266 882 242 C850 214 804 194 764 168 C728 144 704 110 698 70 L694 8", // Ертіс
  "M672 304 C654 262 638 216 620 176 C606 140 598 100 590 56 L585 6", // Есіл
  "M392 196 C420 164 452 142 478 114 C502 84 518 50 538 6", // Тобыл
  "M262 118 C248 160 226 196 196 228 C168 258 150 284 144 306 C140 324 128 340 116 354", // Жайық
  "M612 524 C576 494 540 470 506 444 C476 420 446 400 420 378 C392 360 364 350 334 344", // Сырдария
  "M768 476 C762 440 746 404 730 372 C716 352 706 342 700 336", // Іле
];
export const LAKES = [
  "M640 338 C664 322 700 330 724 322 C752 314 776 322 794 336 C772 342 748 340 726 346 C700 354 664 360 640 338Z", // Балқаш
  "M804 322 C814 316 828 320 830 330 C822 340 808 338 804 322Z", // Алакөл
  "M880 286 C892 280 912 284 914 294 C902 302 884 300 880 286Z", // Зайсан
  "M572 222 C584 216 600 220 602 230 C592 240 576 238 572 222Z", // Теңіз
  "M296 348 C308 336 334 338 342 350 C332 366 304 364 296 348Z", // Арал
  "M538 114 C546 108 560 110 562 120 C554 128 542 126 538 114Z", // Бурабай
];

// Орман, тау, құм, киіз үй — өңірдің ішіне жайғастырамыз
export function buildDecor() {
  const polys = Object.fromEntries(Object.entries(KZ_PATHS).map(([k, d]) => [k, parse(d)]));
  const cityPolys = CITIES.map((k) => polys[k]);
  const items = [];
  const R = rng(20241110);
  for (const [k, ps] of Object.entries(polys)) {
    if (CITIES.includes(k)) continue;
    const t = TERRAIN[k] || "steppe";
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const p of ps) for (const [x, y] of p) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    const c = KZ_CENTERS[k];
    const tries = Math.round(((x1 - x0) * (y1 - y0)) / 55);
    // [түрі, салмағы, ені мин, ені макс, қабылдау ықтималдығы]
    const kinds = {
      forest: [["pine", 10, 14, 20, 0.75], ["bush", 2, 9, 13, 0.3], ["mountain", 1, 34, 50, 0.4]],
      steppe: [["yurt", 1, 20, 26, 0.5], ["pine", 4, 12, 17, 0.2], ["bush", 5, 9, 13, 0.25]],
      desert: [["dune", 8, 26, 40, 0.22], ["camelS", 1, 16, 20, 0.35], ["bush", 2, 8, 11, 0.3]],
      mountain: [["mountain", 6, 38, 64, 0.35], ["pine", 9, 12, 17, 0.5]],
    }[t];
    const tot = kinds.reduce((a, b) => a + b[1], 0);
    for (let i = 0; i < tries; i++) {
      const x = x0 + R() * (x1 - x0), y = y0 + R() * (y1 - y0);
      let r = R() * tot, kd = kinds[0];
      for (const q of kinds) { if (r < q[1]) { kd = q; break; } r -= q[1]; }
      if (R() > kd[4] * (kd[0] === "pine" || kd[0] === "mountain" ? 1 : 1) * 0.35) continue;
      if (!inside(ps, x, y) || !inside(ps, x - 7, y) || !inside(ps, x + 7, y) || !inside(ps, x, y - 9) || !inside(ps, x, y + 4)) continue;
      if (c && Math.hypot(x - c[0], (y - c[1]) * 1.3) < 44) continue;
      if (cityPolys.some((cp) => inside(cp, x, y))) continue;
      items.push({ k: kd[0], x, y, w: kd[2] + R() * (kd[3] - kd[2]) });
    }
  }
  // кішірек нәрселерді алғаш, биіктерін соңыра (y бойынша)
  // тым жақын орналасқандарын сиретеміз
  const out = [];
  for (const it of items.sort((a, b) => a.y - b.y)) {
    if (out.some((o) => Math.abs(o.x - it.x) < (o.w + it.w) * 0.34 && Math.abs(o.y - it.y) < (o.w + it.w) * 0.2)) continue;
    out.push(it);
  }
  return out;
}
