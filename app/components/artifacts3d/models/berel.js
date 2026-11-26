// Берел қорғанынан табылған жылқы бетпердесі (Алтай, б.з.д. IV–III ғғ.).
// Ағаштан ойылып, алтын жапырақпен қапталған: маңдай-тұмсықты жабатын бетперде,
// құлақтар және арқардың (тау ешкісінің) қырлы, артқа иілген үлкен мүйіздері.
// Музейлік қойылымдағыдай күңгірт ағаш бас-манекенге кигізілген.
import * as THREE from "three";
import { gold, wood, mesh, taperTube } from "../kit.js";

export const view = { azim: 0.9, elev: 0.15 };

// Бас пішінінің профилі (Lathe осі бойымен: 0 — желке, 1 — тұмсық)
const headR = (y) => {
  const t = y / 0.95;
  if (t < 0) return 0;
  const base = 0.2 - 0.09 * t;
  const capBack = Math.sqrt(Math.max(0, 1 - Math.pow(1 - Math.min(1, t / 0.12), 2)));
  const capFront = Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, (t - 0.88) / 0.12), 2)));
  return base * capBack * capFront;
};

function maskGeometry(nu = 48, nv = 64) {
  // Бас бетінің үстіңгі жартысына жабысқан қабыршақ: u — көлденең, v — желкеден тұмсыққа
  const pos = [], uv = [], idx = [];
  const v0 = 0.1, v1 = 0.86;
  for (let j = 0; j <= nv; j++) {
    const v = j / nv;
    const y = v0 + (v1 - v0) * v;
    const half = 1.15 - 0.45 * v; // тұмсыққа қарай тарыла береді
    const r = headR(y) + 0.014;
    for (let i = 0; i <= nu; i++) {
      const u = i / nu * 2 - 1;
      const phi = Math.PI + u * half;
      pos.push(Math.sin(phi) * r, y, Math.cos(phi) * r);
      uv.push(i / nu, v);
    }
  }
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return { g, v0, v1 };
}

function maskRim(v0, v1) {
  // Бетперде жиегін айнала өтетін алтын «моншақ» жиек
  const pts = [];
  const N = 40;
  const at = (v, u) => {
    const y = v0 + (v1 - v0) * v;
    const half = 1.15 - 0.45 * v;
    const r = headR(y) + 0.016;
    const phi = Math.PI + u * half;
    return new THREE.Vector3(Math.sin(phi) * r, y, Math.cos(phi) * r);
  };
  for (let i = 0; i <= N; i++) pts.push(at(i / N, -1));
  for (let i = 1; i <= N / 2; i++) pts.push(at(1, -1 + (i / (N / 2)) * 2));
  for (let i = N - 1; i >= 0; i--) pts.push(at(i / N, 1));
  for (let i = 1; i < N / 2; i++) pts.push(at(0, 1 - (i / (N / 2)) * 2));
  return new THREE.CatmullRomCurve3(pts, true);
}

export default function build() {
  const root = new THREE.Group();
  const au = gold({ rough: 0.3, tint: 0xeab852 });
  const dark = wood({ base: [58, 40, 30], dark: [34, 22, 16], rough: 0.7, rings: 10 });

  const head = new THREE.Group();
  // Манекен бас
  const hp = [];
  for (let i = 0; i <= 40; i++) { const y = (i / 40) * 0.95; hp.push(new THREE.Vector2(headR(y), y)); }
  head.add(mesh(new THREE.LatheGeometry(hp, 48), dark));

  // Алтын бетперде
  const { g: mg, v0, v1 } = maskGeometry();
  head.add(mesh(mg, au));
  head.add(mesh(new THREE.TubeGeometry(maskRim(v0, v1), 200, 0.008, 8, true), au));
  // Бетпердедегі бедерлі ою: маңдайдағы иірімдер мен тұмсықтағы жолақ
  for (const s of [-1, 1]) {
    const curl = mesh(new THREE.TorusGeometry(0.05, 0.007, 8, 32, Math.PI * 1.6), au);
    curl.position.set(s * 0.06, 0.3, -headR(0.3) - 0.018);
    curl.rotation.set(0, 0, s > 0 ? 0.4 : 2.6);
    head.add(curl);
  }
  const ridge = mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.36, 8), au);
  ridge.position.set(0, 0.6, -headR(0.6) - 0.016);
  head.add(ridge);

  // Құлақтар
  for (const s of [-1, 1]) {
    const ear = mesh(new THREE.ConeGeometry(0.045, 0.16, 16), au);
    ear.scale.set(1, 1, 0.5);
    ear.position.set(s * 0.12, 0.09, -0.19);
    ear.rotation.set(-Math.PI / 2 - 0.3, 0, s * 0.35);
    head.add(ear);
  }

  // Тау ешкісінің қырлы мүйіздері: жоғары көтеріліп, артқа қарай доғаланып иіледі
  for (const s of [-1, 1]) {
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(s * 0.06, 0.12, -0.18),
      new THREE.Vector3(s * 0.09, 0.0, -0.5),
      new THREE.Vector3(s * 0.16, -0.28, -0.78),
      new THREE.Vector3(s * 0.23, -0.62, -0.82),
      new THREE.Vector3(s * 0.28, -0.86, -0.6),
      new THREE.Vector3(s * 0.29, -0.9, -0.42),
    ]);
    const horn = taperTube(path, 140, 0.075, 16, (t) => (1 - t * 0.82) * (1 + 0.16 * Math.max(0, Math.sin(t * 46))));
    head.add(mesh(horn, au));
  }

  // Басты еңкейтеміз: тұмсығы алға әрі сәл төмен
  head.rotation.x = Math.PI / 2 + 0.45;
  head.position.set(0, 0.95, -0.15);
  root.add(head);

  // Тұғыр: мойын-тірек және дөңгелек табан
  const neck = mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.9, 20), dark);
  neck.position.set(0, 0.5, 0.05);
  root.add(neck);
  const base = mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.07, 48), dark);
  base.position.y = 0.035;
  root.add(base);
  return root;
}
