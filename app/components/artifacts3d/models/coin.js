// Түргеш қағанатының қола теңгесі (VIII ғ., Жетісу мен Тараз өңірі).
// Қытай үлгісімен құйылған дөңгелек теңге, ортасында шаршы тесігі бар.
// Бет жағында тесікті айнала соғды жазуы, сырт жағында — түргеш таңбасы (тамғасы).
// Жазу шартты түрде берілген (нақты мәтіннің көшірмесі емес).
import * as THREE from "three";
import { bronze, makeTex, gray, fbm, groove, segDist, mesh, rng } from "../kit.js";

export const view = { azim: 0.15, elev: 0.22 };

const HOLE = 0.2;

function coinShape() {
  const s = new THREE.Shape();
  s.absarc(0, 0, 1, 0, Math.PI * 2, false);
  const h = new THREE.Path();
  h.moveTo(-HOLE, -HOLE); h.lineTo(-HOLE, HOLE); h.lineTo(HOLE, HOLE); h.lineTo(HOLE, -HOLE); h.closePath();
  s.holes.push(h);
  return s;
}

// Шартты соғды жазуы: тесікті айнала тігінен жазылған қиғаш, ілмекті әріптер
const R = rng(744);
const STROKES = [];
for (let q = 0; q < 4; q++) {
  const ang = (q * Math.PI) / 2;
  const ca = Math.cos(ang), sa = Math.sin(ang);
  const rot = (x, y) => [x * ca - y * sa, x * sa + y * ca];
  let y = -0.5;
  while (y < 0.5) {
    const h = 0.08 + R() * 0.1;
    const x0 = 0.4 + R() * 0.08, x1 = 0.72 + R() * 0.1;
    const kind = R();
    const pts = kind < 0.5
      ? [[x0, y], [x1, y + h * 0.3], [x1 - 0.05, y + h]]
      : [[x0, y + h], [(x0 + x1) / 2, y], [x1, y + h * 0.6]];
    STROKES.push(pts.map(([a, b]) => rot(a, b)));
    y += h + 0.05;
  }
}

function obverse(x, y) {
  const r = Math.hypot(x, y);
  let h = 0;
  if (r > 0.86 && r < 0.99) h = 1; // сыртқы жиек
  const m = Math.max(Math.abs(x), Math.abs(y));
  if (m > HOLE && m < HOLE + 0.09) h = 1; // тесік жиегі
  if (r < 0.84 && m > HOLE + 0.12) {
    let d = 1;
    for (const s of STROKES) for (let i = 0; i + 1 < s.length; i++) d = Math.min(d, segDist(x, y, s[i][0], s[i][1], s[i + 1][0], s[i + 1][1]));
    h = Math.max(h, groove(d, 0.035));
  }
  return h;
}

function reverse(x, y) {
  const r = Math.hypot(x, y);
  let h = 0;
  if (r > 0.86 && r < 0.99) h = 1;
  const m = Math.max(Math.abs(x), Math.abs(y));
  if (m > HOLE && m < HOLE + 0.09) h = 1;
  // Түргеш тамғасы: тесіктің оң жағында доға мен тік сызық
  const ax = 0.55, ay = 0;
  const arc = Math.abs(Math.hypot((x - ax) * 1.3, y - ay) - 0.26);
  const arcMask = x < ax + 0.05 ? 1 : 0;
  const d = Math.min(arcMask ? arc : 1, segDist(x, y, ax + 0.08, -0.32, ax + 0.08, 0.32));
  h = Math.max(h, groove(d, 0.045));
  return h;
}

function reliefTex(fn, seed) {
  const t = makeTex(512, (u, v) => {
    const x = u * 2 - 1, y = v * 2 - 1;
    const n = fbm(u * 40, v * 40, 3, 40, seed);
    return gray(0.35 + fn(x, y) * 0.45 + n * 0.12);
  }, { srgb: false, repeat: false });
  t.repeat.set(0.5, 0.5);
  t.offset.set(0.5, 0.5);
  return t;
}

export default function build() {
  const g = new THREE.Group();
  const geo = new THREE.ExtrudeGeometry(coinShape(), { depth: 0.1, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 4, curveSegments: 96 });
  geo.translate(0, 0, -0.05);
  // Бет жағы (алдыңғы қақпақ) мен сырт жағы бір геометрияда — екі дана теңге жасаймыз
  const mA = bronze({ patina: 0.3, seed: 33, scale: 4, base: [128, 86, 48] });
  mA.bumpMap = reliefTex(obverse, 3);
  mA.bumpScale = 4;
  const mB = bronze({ patina: 0.4, seed: 44, scale: 4, base: [118, 80, 46] });
  mB.bumpMap = reliefTex(reverse, 5);
  mB.bumpScale = 4;
  // Бронза текстурасы да осы uv кеңістігінде: шеткі пикселдер қайталанбас үшін сол түрлендіру
  for (const m of [mA, mB]) for (const t of [m.map, m.roughnessMap]) { t.repeat.set(0.5, 0.5); t.offset.set(0.5, 0.5); }

  // Тік тұрған теңге (бет жағы) — мөлдір тұғырда
  const acrylic = new THREE.MeshPhysicalMaterial({ color: 0xf4f8fa, roughness: 0.08, metalness: 0, transparent: true, opacity: 0.32, clearcoat: 1, depthWrite: false });
  const a = mesh(geo, mA);
  a.position.set(-0.35, 1.1, 0);
  a.rotation.x = -0.18;
  g.add(a);
  const stand = mesh(new THREE.BoxGeometry(0.7, 0.05, 0.4), acrylic);
  stand.position.set(-0.35, 0.025, 0.05);
  g.add(stand);
  const rest = mesh(new THREE.BoxGeometry(0.5, 1.4, 0.03), acrylic);
  rest.rotation.x = -0.18;
  rest.position.set(-0.35, 0.74, -0.03); // теңгенің арқа жағына дәл тиіп тұр
  g.add(rest);

  // Жатқан теңге (сырт жағы — тамғасы жоғары қараған)
  const b = mesh(geo, mB);
  b.rotation.x = -Math.PI / 2;
  b.rotation.z = 0.5;
  b.position.set(0.9, 0.08, 0.95);
  g.add(b);
  return g;
}
