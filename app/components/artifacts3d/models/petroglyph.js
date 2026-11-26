// Тамғалы петроглифі (қола дәуірі, б.з.д. XIV–XIII ғғ.; ЮНЕСКО, 2004).
// Күңгірт «шөл лагымен» қапталған жартас тақтасына тас құралмен шекіп салынған
// күн бас адам бейнесі, кішірек күн бас тұлға, өгіз және бұғы. Шекілген жер ашық түсті.
import * as THREE from "three";
import { makeTex, rgb, gray, mixRGB, fbm, vnoise, groove, polyDist, qs } from "../kit.js";

export const view = { azim: 0.12, elev: 0.08 };

const SX = 0.95, SY = 0.7, SZ = 0.42;

// ── Мотив (физикалық бірлікпен, тақта бетінің ортасы — 0,0) ──
function sunHead(cx, cy, s) {
  const L = [];
  const P = (x, y) => [cx + x * s, cy + y * s];
  const line = (...pts) => L.push(pts.flatMap(([x, y]) => P(x, y)));
  // басы: шеңбер
  const ring = [];
  for (let i = 0; i <= 24; i++) { const a = (i / 24) * Math.PI * 2; ring.push([Math.cos(a) * 0.09, 0.32 + Math.sin(a) * 0.09]); }
  line(...ring);
  // ішіндегі айқас
  line([-0.05, 0.32], [0.05, 0.32]);
  line([0, 0.27], [0, 0.37]);
  // сәулелер
  const dots = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + 0.13;
    line([Math.cos(a) * 0.115, 0.32 + Math.sin(a) * 0.115], [Math.cos(a) * 0.18, 0.32 + Math.sin(a) * 0.18]);
    dots.push(P(Math.cos(a) * 0.215, 0.32 + Math.sin(a) * 0.215));
  }
  // денесі, қолы, аяғы
  line([0, 0.23], [0, -0.12]);
  line([-0.16, 0.25], [-0.15, 0.13], [0, 0.15], [0.15, 0.13], [0.16, 0.25]);
  line([-0.06, -0.38], [-0.11, -0.25], [0, -0.12], [0.11, -0.25], [0.06, -0.38]);
  line([-0.1, -0.38], [-0.03, -0.38]);
  line([0.03, -0.38], [0.1, -0.38]);
  return { L, dots: dots.map(([x, y]) => [x, y, 0.016 * Math.max(0.7, s)]), box: [cx - 0.25 * s, cy - 0.42 * s, cx + 0.25 * s, cy + 0.56 * s] };
}

function bull(cx, cy, s) {
  const L = [];
  const P = (x, y) => [cx + x * s, cy + y * s];
  const line = (...pts) => L.push(pts.flatMap(([x, y]) => P(x, y)));
  line([0.15, 0.05], [0.2, -0.0], [0.22, -0.12]); // басы
  line([0.17, 0.05], [0.12, 0.13], [0.15, 0.2]); // мүйізі
  line([0.21, 0.04], [0.26, 0.11], [0.24, 0.18]);
  for (const x of [-0.12, -0.07, 0.07, 0.12]) line([x, -0.04], [x + 0.01, -0.17]);
  line([-0.15, 0.03], [-0.21, -0.07], [-0.2, -0.13]); // құйрығы
  return { L, dots: [], ell: [cx, cy + 0.01 * s, 0.16 * s, 0.055 * s], box: [cx - 0.25 * s, cy - 0.2 * s, cx + 0.3 * s, cy + 0.22 * s] };
}

function deer(cx, cy, s) {
  const L = [];
  const P = (x, y) => [cx + x * s, cy + y * s];
  const line = (...pts) => L.push(pts.flatMap(([x, y]) => P(x, y)));
  line([-0.12, 0], [0.1, 0.01], [0.15, 0.1], [0.2, 0.08]); // арқа, мойын, бас
  line([-0.11, -0.03], [0.09, -0.03]);
  for (const x of [-0.1, -0.06, 0.05, 0.09]) line([x, -0.03], [x, -0.15]);
  line([0.15, 0.11], [0.12, 0.24], [0.06, 0.3]); // мүйіз
  line([0.13, 0.18], [0.2, 0.25]);
  line([0.125, 0.22], [0.08, 0.2]);
  return { L, dots: [], box: [cx - 0.2 * s, cy - 0.2 * s, cx + 0.25 * s, cy + 0.35 * s] };
}

const FIGS = [sunHead(-0.18, -0.04, 1), sunHead(0.42, 0.16, 0.55), bull(0.36, -0.3, 0.85), deer(-0.6, -0.28, 0.75)];

function carve(x, y) {
  let m = 0;
  for (const f of FIGS) {
    const [x0, y0, x1, y1] = f.box;
    if (x < x0 - 0.03 || x > x1 + 0.03 || y < y0 - 0.03 || y > y1 + 0.03) continue;
    m = Math.max(m, groove(polyDist(x, y, f.L), 0.014));
    for (const [dx, dy, r] of f.dots) { const d = Math.hypot(x - dx, y - dy); if (d < r) m = Math.max(m, 1 - (d / r) ** 4); }
    if (f.ell) {
      const [ex, ey, rx, ry] = f.ell;
      const e = ((x - ex) / rx) ** 2 + ((y - ey) / ry) ** 2;
      if (e < 1) m = Math.max(m, Math.min(1, (1 - e) * 6));
    }
  }
  return m;
}

// Жартас беті (ортақ функция — алдыңғы және артқы материалдарда бірдей, жік көрінбейді)
function rock(u, v) {
  const n = fbm(u * 6, v * 4.5, 5, 0, 61);
  const fine = fbm(u * 40, v * 30, 3, 0, 62);
  const crackN = fbm(u * 3, v * 2.4, 4, 0, 63);
  const crack = groove(Math.abs(crackN - 0.5), 0.012);
  const lichen = Math.max(0, vnoise(u * 28, v * 21, 0, 64) - 0.82) * 5;
  let c = mixRGB([58, 36, 28], [104, 70, 50], n * 0.9);
  c = mixRGB(c, [40, 28, 22], crack * 0.8);
  c = mixRGB(c, [178, 140, 72], Math.min(1, lichen) * 0.6);
  return { c, h: 0.55 + n * 0.25 + fine * 0.15 - crack * 0.3 };
}

function texPair(withCarving) {
  const W = withCarving ? 1024 : 512, H = withCarving ? 768 : 384;
  const QW = qs(W); // makeTex өлшемді сапаға қарай кішірейтеді
  const hs = new Float32Array(QW * qs(H));
  const color = makeTex(0, (u, v, px, py) => {
    const r = rock(u, v);
    let c = r.c, h = r.h;
    if (withCarving) {
      const x = (u * 2 - 1) * SX, y = (v * 2 - 1) * SY;
      const k = carve(x, y);
      if (k > 0) {
        const peck = 0.6 + 0.4 * vnoise(u * 420, v * 320, 0, 70);
        const kk = Math.min(1, k * peck * 1.3);
        c = mixRGB(c, [190, 142, 104], kk);
        h -= kk * 0.35;
      }
    }
    hs[py * QW + px] = h;
    return rgb(c);
  }, { w: W, h: H, repeat: false });
  const height = makeTex(0, (u, v, px, py) => gray(hs[py * QW + px]), { srgb: false, w: W, h: H, repeat: false });
  return { color, height };
}

// 3D шу: үш жазықтыққа проекцияланған 2D шудың қосындысы
const n3 = (x, y, z) => (fbm(x, y, 4, 0, 81) + fbm(y + 3.1, z, 4, 0, 82) + fbm(z + 7.7, x, 4, 0, 83)) / 3;

export default function build() {
  const g = new THREE.Group();
  const geo = new THREE.SphereGeometry(1, 160, 120);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  const v = new THREE.Vector3();
  const zf = 0.22;
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const d = 1 + (n3(v.x * 1.6, v.y * 1.6, v.z * 1.6) - 0.5) * 0.35;
    let x = v.x * SX * d, y = v.y * SY * d, z = v.z * SZ * d;
    // Алдыңғы бетті тегістейміз — суреттер салынған жазық тақта
    if (z > zf) z = zf + (z - zf) * 0.12 + (fbm(x * 5 + 9, y * 5, 3, 0, 90) - 0.5) * 0.015;
    // Артқы жағы — жерге батып жатқан жалпақ табан
    if (y < -SY * 0.82) y = -SY * 0.82 + (y + SY * 0.82) * 0.15;
    pos.setXYZ(i, x, y, z);
    uv.setXY(i, Math.min(1, Math.max(0, x / SX / 2 + 0.5)), Math.min(1, Math.max(0, y / SY / 2 + 0.5)));
  }
  geo.computeVertexNormals();
  // Үшбұрыштарды екі топқа бөлеміз: алды (мотив бар) және арты (тек жартас)
  const idx = geo.index.array;
  const front = [], back = [];
  for (let t = 0; t < idx.length; t += 3) {
    const zc = (pos.getZ(idx[t]) + pos.getZ(idx[t + 1]) + pos.getZ(idx[t + 2])) / 3;
    (zc > 0.05 ? front : back).push(idx[t], idx[t + 1], idx[t + 2]);
  }
  geo.setIndex([...front, ...back]);
  geo.clearGroups();
  geo.addGroup(0, front.length, 0);
  geo.addGroup(front.length, back.length, 1);

  const A = texPair(true), B = texPair(false);
  const mk = (t) => new THREE.MeshStandardMaterial({ map: t.color, bumpMap: t.height, bumpScale: 3.2, roughness: 0.94, metalness: 0 });
  const m = new THREE.Mesh(geo, [mk(A), mk(B)]);
  m.castShadow = true;
  m.rotation.x = -0.12; // сәл шалқайып тұр
  m.position.y = SY * 0.82;
  g.add(m);
  return g;
}
