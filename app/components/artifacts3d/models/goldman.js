// Алтын адамның бас киімі (Есік қорғаны, б.з.д. V–IV ғғ.).
// Биік сүйір киіз бөрік: маңдайында қанатты, мүйізді екі тұлпар, төрт алтын жебе,
// «тау» тақташалары мен құстар, ұшында — алтын арқар мүсіншесі.
import * as THREE from "three";
import { gold, felt, mesh, smoothProfile, taperTube } from "../kit.js";

export const view = { azim: 0.35, elev: 0.12 };

// Қанатты, мүйізді тұлпардың сұлбасы (бүйірден, бас жағы оңға қараған)
function horseShape() {
  const s = new THREE.Shape();
  s.moveTo(-0.5, -0.2);
  s.quadraticCurveTo(-0.55, 0.05, -0.38, 0.12); // сауыры
  s.lineTo(-0.3, 0.12);
  s.quadraticCurveTo(-0.2, 0.55, -0.48, 0.72); // қанат (артқа қайырылған)
  s.quadraticCurveTo(-0.08, 0.66, 0.02, 0.18);
  s.quadraticCurveTo(0.18, 0.22, 0.26, 0.38); // мойын
  s.quadraticCurveTo(0.22, 0.68, 0.06, 0.9); // мүйіз (тау ешкінікіндей артқа иілген)
  s.quadraticCurveTo(0.34, 0.7, 0.36, 0.46);
  s.lineTo(0.54, 0.32); // тұмсық
  s.quadraticCurveTo(0.56, 0.24, 0.46, 0.24);
  s.lineTo(0.3, 0.14);
  s.quadraticCurveTo(0.26, -0.04, 0.34, -0.36); // алдыңғы аяқ
  s.lineTo(0.24, -0.36);
  s.quadraticCurveTo(0.14, -0.08, 0.0, -0.06);
  s.lineTo(-0.28, -0.06);
  s.quadraticCurveTo(-0.34, -0.2, -0.3, -0.38); // артқы аяқ
  s.lineTo(-0.4, -0.38);
  s.closePath();
  return s;
}

function mountainShape() {
  const s = new THREE.Shape();
  s.moveTo(-0.5, 0);
  s.lineTo(-0.22, 0.42);
  s.lineTo(-0.08, 0.3);
  s.lineTo(0.08, 0.62);
  s.lineTo(0.22, 0.36);
  s.lineTo(0.5, 0);
  s.closePath();
  return s;
}

function birdShape() {
  const s = new THREE.Shape();
  s.moveTo(0, -0.5);
  s.quadraticCurveTo(0.08, -0.1, 0.5, 0.2);
  s.quadraticCurveTo(0.1, 0.12, 0.06, 0.36);
  s.quadraticCurveTo(0, 0.5, -0.06, 0.36);
  s.quadraticCurveTo(-0.1, 0.12, -0.5, 0.2);
  s.quadraticCurveTo(-0.08, -0.1, 0, -0.5);
  return s;
}

const H = 1.55; // биіктігі
const coneR = (y) => {
  // Профиль: төмені 0.34 радиус, жоғары қарай ойыстау болып сүйірленеді
  const t = y / H;
  return 0.34 * Math.pow(1 - t, 1.25) + 0.012;
};

// Конус бетіне тақташаны қою: бұрыш (ang), биіктік (y), шығыңқы (lift)
function onCone(obj, ang, y, lift = 0.012) {
  const r = coneR(y) + lift;
  obj.position.set(Math.sin(ang) * r, y, Math.cos(ang) * r);
  // Конус бетінің көлбеуіне сәйкес шалқайту
  const slope = Math.atan2(coneR(y - 0.02) - coneR(y + 0.02), 0.04);
  obj.rotation.set(0, ang, 0);
  obj.rotateX(-slope);
  return obj;
}

export default function build() {
  const g = new THREE.Group();
  const au = gold();
  const auDark = gold({ rough: 0.4, tint: 0xd9a441 });
  const cap = felt();

  // Киіз бөрік (Lathe)
  const pts = [];
  for (let i = 0; i <= 48; i++) {
    const y = (i / 48) * H;
    pts.push(new THREE.Vector2(coneR(y), y));
  }
  pts.unshift(new THREE.Vector2(0.0, 0.0));
  const capGeo = new THREE.LatheGeometry(pts, 72);
  g.add(mesh(capGeo, cap));

  // Төменгі алтын жиектер (үш қатар)
  for (let k = 0; k < 3; k++) {
    const y = 0.02 + k * 0.05;
    const ring = mesh(new THREE.TorusGeometry(coneR(y) + 0.004, 0.011, 10, 96), k === 1 ? auDark : au);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    g.add(ring);
  }
  // Жиектегі ұсақ шеңбер-тақташалар
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2;
    const d = mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.006, 16), au);
    d.rotation.x = Math.PI / 2;
    const holder = new THREE.Group();
    holder.add(d);
    g.add(onCone(holder, a, 0.045, 0.012));
  }

  const extr = (shape, depth, bevel) =>
    new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 18 });

  // «Тау» тақташалары — бөріктің ортаңғы белдеуі бойымен
  const mGeo = extr(mountainShape(), 0.01, 0.006);
  mGeo.translate(0, 0, -0.005);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + Math.PI / 9;
    if (Math.abs(Math.sin(a / 2)) < 0.28) continue; // маңдай алдын тұлпарларға қалдырамыз
    const m = mesh(mGeo, au);
    m.scale.setScalar(0.17);
    g.add(onCone(m, a, 0.2));
  }

  // Құстар — жоғарырақ
  const bGeo = extr(birdShape(), 0.008, 0.005);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.5;
    const m = mesh(bGeo, au);
    m.scale.setScalar(0.08);
    g.add(onCone(m, a, 0.62));
  }

  // Маңдайдағы қанатты тұлпарлар (бір-біріне қараған жұп)
  const hGeo = extr(horseShape(), 0.012, 0.007);
  hGeo.translate(0, 0, -0.006);
  for (const side of [-1, 1]) {
    const m = mesh(hGeo, au);
    m.scale.set(0.24 * -side, 0.24, 0.24);
    g.add(onCone(m, side * 0.42, 0.33, 0.016));
  }

  // Төрт алтын жебе — маңдайда тік тұрады, ұшы жоғары
  const shaftMat = au;
  for (let i = 0; i < 4; i++) {
    const a = (i - 1.5) * 0.18;
    const arrow = new THREE.Group();
    const L = 0.62;
    arrow.add(mesh(new THREE.CylinderGeometry(0.007, 0.007, L, 10), shaftMat));
    const tip = mesh(new THREE.ConeGeometry(0.02, 0.07, 3), au);
    tip.position.y = L / 2 + 0.03;
    arrow.add(tip);
    // қауырсындар
    for (const s of [-1, 1]) {
      const f = mesh(new THREE.BoxGeometry(0.03, 0.09, 0.003), auDark);
      f.position.set(s * 0.016, -L / 2 + 0.06, 0);
      f.rotation.z = s * 0.25;
      arrow.add(f);
    }
    const y0 = 0.72;
    const r = coneR(y0) + 0.03;
    arrow.position.set(Math.sin(a) * r, y0, Math.cos(a) * r);
    arrow.rotation.set(-0.2, a, 0);
    g.add(arrow);
  }

  // Ұшындағы алтын арқар (ешкі мүсіншесі)
  const top = new THREE.Group();
  const body = mesh(new THREE.CapsuleGeometry(0.03, 0.06, 6, 14), au);
  body.rotation.z = Math.PI / 2;
  top.add(body);
  for (const [x, z] of [[-0.035, -0.015], [-0.035, 0.015], [0.035, -0.015], [0.035, 0.015]]) {
    const leg = mesh(new THREE.CylinderGeometry(0.007, 0.006, 0.06, 8), au);
    leg.position.set(x, -0.045, z);
    top.add(leg);
  }
  const neck = mesh(new THREE.CylinderGeometry(0.014, 0.02, 0.06, 10), au);
  neck.position.set(0.06, 0.03, 0);
  neck.rotation.z = -0.7;
  top.add(neck);
  const head = mesh(new THREE.SphereGeometry(0.02, 14, 10), au);
  head.scale.set(1.4, 1, 0.9);
  head.position.set(0.085, 0.06, 0);
  top.add(head);
  // Иірілген мүйіздер
  for (const s of [-1, 1]) {
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.08, 0.075, s * 0.012),
      new THREE.Vector3(0.05, 0.11, s * 0.03),
      new THREE.Vector3(0.02, 0.09, s * 0.045),
      new THREE.Vector3(0.035, 0.055, s * 0.05),
      new THREE.Vector3(0.06, 0.06, s * 0.045),
    ]);
    top.add(mesh(taperTube(path, 24, 0.009, 8, (t) => 1 - t * 0.7), au));
  }
  top.position.y = H + 0.06;
  g.add(top);

  // Ұштағы шыбық тұғыры
  const spike = mesh(new THREE.CylinderGeometry(0.006, 0.012, 0.06, 8), au);
  spike.position.y = H;
  g.add(spike);

  // Алдыңғы жағын көрерменге қаратамыз (маңдай +Z бағытта)
  return g;
}
