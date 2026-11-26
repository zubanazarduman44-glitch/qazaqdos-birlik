// Жәдігерлер галереясы: процедуралық текстуралар мен PBR материалдар.
// Canvas қолданылмайды — бәрі DataTexture (браузерде де, Node тестінде де жұмыс істейді).
import * as THREE from "three";

// ── Детерминді шу ──
export function rng(seed = 1) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

function hash2(x, y, seed) {
  let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
const fade = (t) => t * t * (3 - 2 * t);

// Тайлданатын мәнді шу (period — тор ұяшықтарының саны)
export function vnoise(x, y, period = 0, seed = 7) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const w = (v) => (period ? ((v % period) + period) % period : v);
  const a = hash2(w(xi), w(yi), seed), b = hash2(w(xi + 1), w(yi), seed);
  const c = hash2(w(xi), w(yi + 1), seed), d = hash2(w(xi + 1), w(yi + 1), seed);
  const u = fade(xf), v = fade(yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export function fbm(x, y, oct = 4, period = 0, seed = 7) {
  let s = 0, amp = 0.5, f = 1, n = 0;
  for (let i = 0; i < oct; i++) {
    s += amp * vnoise(x * f, y * f, period ? period * f : 0, seed + i * 17);
    n += amp; amp *= 0.5; f *= 2;
  }
  return s / n;
}

// Кесіндіге дейінгі қашықтық (оюлар мен жазуларды «қашау» үшін)
export function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const l = dx * dx + dy * dy || 1e-9;
  let t = ((px - ax) * dx + (py - ay) * dy) / l;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const x = ax + dx * t - px, y = ay + dy * t - py;
  return Math.sqrt(x * x + y * y);
}

// Сызықтардың жиынтығына (полилиния) қашықтық
export function polyDist(px, py, lines) {
  let d = 1e9;
  for (const pts of lines) {
    for (let i = 0; i + 3 < pts.length; i += 2) {
      const v = segDist(px, py, pts[i], pts[i + 1], pts[i + 2], pts[i + 3]);
      if (v < d) d = v;
    }
  }
  return d;
}

// Текстура сапасы: карточка суреттері үшін 0.5 (жылдам), 3D көрерменде 1.
let Q = 1;
export const setQuality = (q) => { Q = q; };
export const qs = (n) => Math.max(16, Math.round(n * Q));

// fn(u, v, px, py) → [r, g, b, a] (0..255). u, v ∈ [0, 1). Өлшемі сапаға қарай кішірейеді.
export function makeTex(size, fn, { srgb = true, repeat = true, w, h } = {}) {
  const W = qs(w || size), H = qs(h || size);
  const data = new Uint8Array(W * H * 4);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = fn(x / W, y / H, x, y);
      const i = (y * W + x) * 4;
      data[i] = c[0]; data[i + 1] = c[1]; data[i + 2] = c[2]; data[i + 3] = c[3] ?? 255;
    }
  }
  const t = new THREE.DataTexture(data, W, H, THREE.RGBAFormat);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.wrapS = t.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 4;
  t.needsUpdate = true;
  return t;
}

// Өрнек функциясын бір рет есептеп, пиксель торына сақтау (түс пен бедер қайталап есептемейді)
export function grid(fn, W, H) {
  const out = new Float32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) out[y * W + x] = fn(x / W, y / H);
  return out;
}

const clamp255 = (v) => (v < 0 ? 0 : v > 255 ? 255 : v | 0);
export const mix = (a, b, t) => a + (b - a) * t;
export const mixRGB = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
export const gray = (g) => { const v = clamp255(g * 255); return [v, v, v, 255]; };
export const rgb = (c) => [clamp255(c[0]), clamp255(c[1]), clamp255(c[2]), 255];

// ── Материалдар ──
// Әр құрастырушы өз материалдарын жасайды; dispose() кезінде бәрі тазаланады.

export function gold({ rough = 0.26, tint = 0xf0c25c } = {}) {
  const noise = makeTex(128, (u, v) => {
    const n = fbm(u * 16, v * 16, 3, 16, 3);
    return gray(0.55 + n * 0.45);
  }, { srgb: false });
  return new THREE.MeshPhysicalMaterial({
    color: tint, metalness: 1, roughness: rough,
    roughnessMap: noise, // G арнасы — кедір-бұдырдың аздаған өзгерісі
    clearcoat: 0.25, clearcoatRoughness: 0.35,
    envMapIntensity: 1.15,
  });
}

// Көк-жасыл патинасы бар қола
export function bronze({ patina = 0.55, base = [150, 96, 52], seed = 11, scale = 6 } = {}) {
  const S = 256;
  const pat = (u, v) => {
    const n = fbm(u * scale, v * scale, 5, scale, seed);
    return Math.max(0, Math.min(1, (n - (0.62 - patina * 0.3)) * 4));
  };
  const color = makeTex(S, (u, v) => {
    const p = pat(u, v);
    const g = fbm(u * 40, v * 40, 2, 40, seed + 5) * 30;
    const metal = [base[0] + g, base[1] + g * 0.7, base[2] + g * 0.4];
    const green = [58 + g * 0.6, 128 + g, 108 + g * 0.6];
    return rgb(mixRGB(metal, green, p * 0.9));
  });
  // ORM: G — roughness, B — metalness
  const orm = makeTex(S, (u, v) => {
    const p = pat(u, v);
    return [255, clamp255((0.38 + p * 0.5) * 255), clamp255((0.95 - p * 0.75) * 255), 255];
  }, { srgb: false });
  return new THREE.MeshStandardMaterial({
    map: color, roughnessMap: orm, metalnessMap: orm,
    roughness: 1, metalness: 1, bumpMap: orm, bumpScale: 0.6,
  });
}

// Күйдірілген саз (терракота): түсі мен кедір-бұдыры, қосымша bump функциясы (u, v) → 0..1
export function clay({ base = [168, 98, 60], dark = [96, 58, 38], bump = null, ink = null, seed = 21, repeat = 1 } = {}) {
  // Өрнекті бетке айналасы бойынша екі есе көп пиксель — сызықтар жіңішке
  const S = bump ? 512 : 256;
  const dims = bump ? { w: 1024, h: 512 } : {};
  const W = qs(dims.w || S), H = qs(dims.h || S);
  const bG = bump ? grid(bump, W, H) : null;
  const iG = ink ? (ink === bump ? bG : grid(ink, W, H)) : null;
  const color = makeTex(S, (u, v, px, py) => {
    const n = fbm(u * 8 * repeat, v * 8, 5, 8 * repeat, seed);
    const soot = Math.max(0, fbm(u * 3 * repeat, v * 3, 3, 3 * repeat, seed + 9) - 0.55) * 2.2;
    let c = mixRGB(base, dark, n * 0.45 + soot * 0.6);
    if (iG) {
      const k = iG[py * W + px];
      if (k > 0) c = mixRGB(c, [70, 42, 28], k * 0.8);
    }
    return rgb(c);
  }, dims);
  const height = makeTex(S, (u, v, px, py) => {
    const n = fbm(u * 30 * repeat, v * 30, 3, 30 * repeat, seed + 3);
    const b = bG ? bG[py * W + px] : 0;
    return gray(0.6 + n * 0.25 - b * 0.55);
  }, { srgb: false, ...dims });
  return new THREE.MeshStandardMaterial({ map: color, bumpMap: height, bumpScale: 2.2, roughness: 0.92, metalness: 0 });
}

// Былғары (торсық, қамшы)
export function leather({ base = [104, 58, 30], seed = 31, emboss = null, size = 512 } = {}) {
  const S = size;
  const W = qs(S);
  const eG = emboss ? grid(emboss, W, W) : null;
  const color = makeTex(S, (u, v, px, py) => {
    const n = fbm(u * 10, v * 10, 5, 10, seed);
    const wear = Math.max(0, fbm(u * 4, v * 4, 3, 4, seed + 2) - 0.5) * 1.6;
    let c = mixRGB(base, [56, 30, 16], n * 0.55);
    c = mixRGB(c, [150, 96, 58], wear * 0.5);
    if (eG) { const e = eG[py * W + px]; if (e > 0) c = mixRGB(c, [62, 32, 16], e * 0.35); }
    return rgb(c);
  });
  const height = makeTex(S, (u, v, px, py) => {
    const pores = fbm(u * 90, v * 90, 2, 90, seed + 5);
    const e = eG ? eG[py * W + px] : 0;
    return gray(0.5 + pores * 0.2 + e * 0.3);
  }, { srgb: false });
  return new THREE.MeshPhysicalMaterial({ map: color, bumpMap: height, bumpScale: 2.6, roughness: 0.62, metalness: 0, sheen: 0.4, sheenRoughness: 0.6, sheenColor: 0x7a4a2a });
}

// Ағаш: жылдық сақиналар мен талшық (v бойымен)
export function wood({ base = [150, 96, 52], dark = [92, 54, 26], seed = 41, rough = 0.5, rings = 18 } = {}) {
  const S = 256;
  const color = makeTex(S, (u, v) => {
    const w = fbm(u * 4, v * 1.2, 4, 4, seed) * 2.4;
    const g = 0.5 + 0.5 * Math.sin((u * rings + w) * Math.PI * 2);
    const fine = fbm(u * 60, v * 4, 2, 60, seed + 3);
    return rgb(mixRGB(base, dark, g * 0.55 + fine * 0.25));
  });
  return new THREE.MeshPhysicalMaterial({ map: color, roughness: rough, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.4 });
}

// Киіз (Алтын адамның бас киімі киізден тігілген)
export function felt({ color = 0x4a1614 } = {}) {
  const fuzz = makeTex(256, (u, v) => gray(0.45 + fbm(u * 70, v * 70, 3, 70, 5) * 0.5), { srgb: false });
  return new THREE.MeshPhysicalMaterial({ color, roughness: 1, metalness: 0, bumpMap: fuzz, bumpScale: 1.2, sheen: 1, sheenRoughness: 0.8, sheenColor: 0xa04a3a });
}

export function plain(color, opts = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0, ...opts });
}

// ── Геометрия көмекшілері ──

// Lathe профилі: [[r, y], ...] → Vector2 тізімі
export const prof = (pts) => pts.map(([r, y]) => new THREE.Vector2(Math.max(0, r), y));

// Профильді Catmull-Rom арқылы тегістеу
export function smoothProfile(pts, n = 64) {
  const curve = new THREE.SplineCurve(pts.map(([r, y]) => new THREE.Vector2(r, y)));
  return curve.getSpacedPoints(n).map((p) => new THREE.Vector2(Math.max(0, p.x), p.y));
}

// Түтікті жіңішкерту/қырлау: radiusFn(t) — көбейткіш
export function taperTube(path, segs, radius, radial, radiusFn) {
  const g = new THREE.TubeGeometry(path, segs, radius, radial, false);
  const pos = g.attributes.position;
  const c = new THREE.Vector3();
  const p = new THREE.Vector3();
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    path.getPointAt(t, c);
    const k = radiusFn(t);
    for (let j = 0; j <= radial; j++) {
      const idx = i * (radial + 1) + j;
      p.fromBufferAttribute(pos, idx).sub(c).multiplyScalar(k).add(c);
      pos.setXYZ(idx, p.x, p.y, p.z);
    }
  }
  pos.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

export function mesh(geo, mat, { cast = true } = {}) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = cast;
  return m;
}

// Топтағы барлық ресурсты тазалау
export function disposeObject(root) {
  const seen = new Set();
  root.traverse((o) => {
    if (o.geometry && !seen.has(o.geometry)) { seen.add(o.geometry); o.geometry.dispose(); }
    const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
    for (const m of mats) {
      if (seen.has(m)) continue;
      seen.add(m);
      for (const k of Object.keys(m)) {
        const v = m[k];
        if (v && v.isTexture && !seen.has(v)) { seen.add(v); v.dispose(); }
      }
      m.dispose();
    }
  });
}

// Қыш/қола ыдыс: сыртқы беті (өрнекті материал) және ішкі беті + ерні (жай материал).
// outer — [[r, y], ...] түбінің ортасынан ерінге дейін; thick — қабырға қалыңдығы.
// Сыртқы беттің uv.y = биіктік үлесі (0 — түбі, 1 — ерні), uv.x — айнала.
export function vessel(outer, { thick = 0.03, segs = 96, smooth = 96 } = {}) {
  const pts = smoothProfile(outer, smooth);
  pts[0].x = 0;
  const top = pts[pts.length - 1];
  const H = top.y;
  const outerGeo = new THREE.LatheGeometry(pts, segs);
  const uv = outerGeo.attributes.uv, pos = outerGeo.attributes.position;
  for (let i = 0; i < uv.count; i++) uv.setY(i, pos.getY(i) / H);
  // Ішкі профиль: нормаль бойымен ішке ығысқан, ернінен түбіне қарай
  const inner = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const tx = b.x - a.x, ty = b.y - a.y;
    const l = Math.hypot(tx, ty) || 1;
    // сыртқы нормаль (ty, -tx); ішке қарай — керісінше
    inner.push(new THREE.Vector2(Math.max(0, pts[i].x - (ty / l) * thick), pts[i].y + (tx / l) * thick));
  }
  inner[inner.length - 1].x = 0;
  inner[inner.length - 1].y = Math.max(inner[inner.length - 1].y, thick * 1.2);
  // Ерін: сыртқы шетінен ішкі шетіне жарты шеңбер
  const lip = [];
  const ix = inner[0];
  for (let k = 0; k <= 8; k++) {
    const t = k / 8;
    const a = Math.PI * t;
    lip.push(new THREE.Vector2((top.x + ix.x) / 2 + Math.cos(a) * (top.x - ix.x) / 2, (top.y + ix.y) / 2 + Math.sin(a) * thick * 0.5));
  }
  const innerGeo = new THREE.LatheGeometry([...lip, ...inner.slice(1)], segs);
  return { outerGeo, innerGeo, H, R: Math.max(...pts.map((p) => p.x)) };
}

// Жіңішке ойық сызық маскасы (0..1) — d: қашықтық, w: ені
export const groove = (d, w) => (d >= w ? 0 : 1 - (d / w) * (d / w));
