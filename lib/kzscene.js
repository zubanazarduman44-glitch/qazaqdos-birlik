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
  "M938 268 C905 262 880 236 846 214 C812 192 770 176 742 150 C716 128 700 96 696 52 L694 14", // Ертіс
  "M648 262 C632 220 618 188 606 160 C596 128 592 92 584 40 L580 10", // Есіл
  "M420 130 C446 112 472 96 492 70 C506 52 520 34 540 10", // Тобыл
  "M258 140 C238 170 216 202 190 232 C168 256 150 280 144 304 C140 322 128 338 118 352", // Жайық
  "M604 520 C572 492 538 470 506 444 C476 420 446 400 420 378 C392 360 366 350 338 340", // Сырдария
  "M752 452 C752 420 744 392 730 366 C716 346 704 336 700 330", // Іле
];
export const LAKES = [
  "M640 338 C664 322 700 330 724 322 C752 314 776 322 794 336 C772 342 748 340 726 346 C700 354 664 360 640 338Z", // Балқаш
  "M804 322 C814 316 828 320 830 330 C822 340 808 338 804 322Z", // Алакөл
  "M880 286 C892 280 912 284 914 294 C902 302 884 300 880 286Z", // Зайсан
  "M572 222 C584 216 600 220 602 230 C592 240 576 238 572 222Z", // Теңіз
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
