// Тайқазан (1399 ж., Түркістан, Қожа Ахмет Ясауи кесенесі).
// Жеті металл қорытпасынан құйылған алып қазан: ернеуі кең ашылған терең тостаған,
// лотос гүліне ұқсас аяқ, иығында он құлақ және араб жазуы бар белдеулер.
// Жазу белдеуі мұнда шартты түрде көрсетілген (нақты мәтін емес).
import * as THREE from "three";
import { bronze, vessel, mesh, groove, segDist, rng, makeTex, gray } from "../kit.js";

export const view = { azim: 0.3, elev: 0.32 };

// Шартты «сулс» жазуы: биік тік әріптер, негізгі сызық және доғалар
const R = rng(1399);
const GLYPHS = Array.from({ length: 64 }, () => {
  const k = R();
  return { tall: k < 0.4, bowl: k > 0.7, dot: R() > 0.6, w: 0.6 + R() * 0.6 };
});

function decor(u, v) {
  let m = 0;
  // Белдеулер шекаралары
  for (const yy of [0.93, 0.8, 0.74, 0.6]) m = Math.max(m, groove(Math.abs(v - yy), 0.006));
  // Жоғарғы жазу белдеуі v ∈ [0.8, 0.93]
  if (v > 0.8 && v < 0.93) {
    const n = GLYPHS.length;
    const x = u * n, i = Math.floor(x), cx = x - i;
    const gl = GLYPHS[i];
    const y = (v - 0.8) / 0.13; // 0..1
    const base = 0.25;
    let d = Math.abs(y - base) * 0.13 * 4; // негізгі сызық
    if (gl.tall) d = Math.min(d, segDist(cx, y, 0.5, base, 0.55, 0.9) * 0.13);
    if (gl.bowl) {
      const r = Math.hypot((cx - 0.5) * 1.4, (y - base - 0.02) * 1.0);
      d = Math.min(d, Math.abs(r - 0.22) * 0.13 + (y > base + 0.1 ? 0.01 : 0));
    }
    if (gl.dot) d = Math.min(d, Math.hypot(cx - 0.3, y - 0.72) * 0.13 - 0.004);
    m = Math.max(m, groove(Math.max(0, d), 0.007));
  }
  // Ортаңғы белдеу: медальондар
  if (v > 0.6 && v < 0.74) {
    const x = u * 20, cx = x - Math.floor(x) - 0.5;
    const y = (v - 0.67) / 0.07;
    const r = Math.hypot(cx * 1.2, y * 0.55);
    m = Math.max(m, groove(Math.abs(r - 0.38), 0.05), groove(Math.abs(r - 0.18), 0.04));
  }
  return m;
}

export default function build() {
  const g = new THREE.Group();
  const mat = bronze({ patina: 0.18, seed: 21, scale: 6, base: [116, 84, 54] });
  const outer = [[0, 0], [0.4, 0.02], [0.7, 0.12], [0.92, 0.32], [1.04, 0.56], [1.08, 0.76], [1.12, 0.9], [1.22, 0.98]];
  const { outerGeo, innerGeo } = vessel(outer, { thick: 0.05, segs: 128 });
  const inMat = bronze({ patina: 0.1, seed: 22, scale: 5, base: [96, 66, 40] });
  // Өрнекті сыртқы материал: bronze + жазу бедері
  const bump = makeTex(0, (u, v) => gray(0.55 + decor(u, v) * 0.43), { srgb: false, w: 1024, h: 512 });
  const outMat = mat.clone();
  outMat.bumpMap = bump;
  outMat.bumpScale = 3;
  const bowl = new THREE.Group();
  bowl.add(mesh(outerGeo, outMat));
  bowl.add(mesh(innerGeo, inMat));
  bowl.position.y = 0.5;
  g.add(bowl);

  // Лотос аяқ: жоғарыдан тарылып, төменде қоңырау сияқты кеңейеді
  const foot = [
    [0.0, 0.0], [0.5, 0.0], [0.53, 0.03], [0.5, 0.08], [0.38, 0.18], [0.3, 0.3], [0.3, 0.38], [0.36, 0.44], [0.42, 0.5], [0.0, 0.52],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  g.add(mesh(new THREE.LatheGeometry(foot, 96), mat));
  // Аяқтағы жапырақ тәрізді қырлар
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const leaf = mesh(new THREE.SphereGeometry(0.07, 12, 10), mat);
    leaf.scale.set(0.5, 1.6, 0.35);
    leaf.position.set(Math.sin(a) * 0.36, 0.14, Math.cos(a) * 0.36);
    leaf.rotation.set(0.55, a, 0, "YXZ");
    g.add(leaf);
  }

  // Он құлақ: иықтағы тік ілмектер
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + Math.PI / 10;
    const r = 1.1;
    const hold = new THREE.Group();
    // жергілікті -X — сыртқа қараған радиус бағыты
    const loop = mesh(new THREE.TorusGeometry(0.1, 0.028, 12, 40), mat);
    loop.position.set(-0.1, -0.05, 0);
    hold.add(loop);
    const boss = mesh(new THREE.SphereGeometry(0.06, 16, 12), mat);
    boss.scale.set(0.7, 1.3, 1);
    boss.position.set(-0.02, 0.04, 0);
    hold.add(boss);
    hold.position.set(Math.sin(a) * r, 0.5 + 0.78, Math.cos(a) * r);
    hold.rotation.y = a + Math.PI / 2;
    g.add(hold);
  }
  return g;
}
