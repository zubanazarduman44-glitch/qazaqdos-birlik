// «Аң стиліндегі» алтын бұғы тақташасы (Шілікті, Бәйгетөбе қорғаны, б.з.д. VIII–VII ғғ.).
// Аяғын бауырына бүгіп жатқан бұғы, мүйізі арқасы бойымен толқындана созылған.
import * as THREE from "three";
import { gold, mesh, wood } from "../kit.js";

export const view = { azim: 0.25, elev: 0.18 };

function deerShape() {
  const s = new THREE.Shape();
  // Денесі (бүйірден, басы оңға)
  s.moveTo(-0.9, -0.05);
  s.quadraticCurveTo(-1.0, 0.25, -0.78, 0.32); // сауыры
  s.quadraticCurveTo(-0.3, 0.42, 0.25, 0.34); // арқасы
  s.quadraticCurveTo(0.42, 0.38, 0.5, 0.56); // мойны
  s.quadraticCurveTo(0.56, 0.7, 0.68, 0.7); // желкесі
  s.lineTo(0.98, 0.56); // тұмсығы
  s.quadraticCurveTo(1.02, 0.48, 0.92, 0.47);
  s.quadraticCurveTo(0.7, 0.44, 0.62, 0.32); // алқымы
  s.quadraticCurveTo(0.56, 0.12, 0.62, -0.02); // кеудесі
  // Бүгілген алдыңғы аяқ
  s.quadraticCurveTo(0.82, -0.06, 0.86, -0.2);
  s.lineTo(0.72, -0.24);
  s.quadraticCurveTo(0.5, -0.24, 0.34, -0.2);
  // Бауыры
  s.quadraticCurveTo(0.0, -0.16, -0.3, -0.2);
  // Бүгілген артқы аяқ
  s.quadraticCurveTo(-0.5, -0.24, -0.62, -0.26);
  s.lineTo(-0.82, -0.22);
  s.quadraticCurveTo(-0.92, -0.16, -0.9, -0.05);
  return s;
}

// Мүйіз: артқа созылған негізгі сабақ пен жоғары иілген «S» тармақтар
function antlerShapes() {
  const shapes = [];
  const beam = new THREE.Shape();
  beam.moveTo(0.64, 0.66);
  beam.quadraticCurveTo(0.3, 0.92, -0.85, 0.72);
  beam.quadraticCurveTo(-0.95, 0.66, -0.86, 0.62);
  beam.quadraticCurveTo(0.2, 0.8, 0.58, 0.6);
  beam.closePath();
  shapes.push(beam);
  // Тармақтар
  const tines = [-0.62, -0.32, -0.02, 0.28];
  tines.forEach((x, i) => {
    const t = new THREE.Shape();
    const y0 = 0.78 - Math.abs(x + 0.2) * 0.12;
    t.moveTo(x - 0.05, y0 - 0.04);
    t.quadraticCurveTo(x - 0.06, y0 + 0.26, x + 0.12, y0 + 0.34);
    t.quadraticCurveTo(x + 0.22, y0 + 0.36, x + 0.2, y0 + 0.24); // ұшы иірімге айналады
    t.quadraticCurveTo(x + 0.14, y0 + 0.26, x + 0.12, y0 + 0.22);
    t.quadraticCurveTo(x + 0.04, y0 + 0.16, x + 0.05, y0 - 0.04);
    t.closePath();
    shapes.push(t);
    void i;
  });
  return shapes;
}

export default function build() {
  const g = new THREE.Group();
  const au = gold({ rough: 0.24 });
  const opts = { depth: 0.07, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.03, bevelSegments: 5, curveSegments: 28 };
  const body = new THREE.ExtrudeGeometry(deerShape(), opts);
  const antl = new THREE.ExtrudeGeometry(antlerShapes(), { ...opts, depth: 0.04, bevelThickness: 0.025, bevelSize: 0.02 });
  const plaque = new THREE.Group();
  plaque.add(mesh(body, au));
  plaque.add(mesh(antl, au));
  // Көзі, құлағы — бедерлі ұсақ бөлшектер
  const eye = mesh(new THREE.TorusGeometry(0.035, 0.012, 8, 24), au);
  eye.position.set(0.76, 0.6, 0.11);
  plaque.add(eye);
  const ear = mesh(new THREE.ConeGeometry(0.04, 0.16, 12), au);
  ear.position.set(0.58, 0.74, 0.05);
  ear.rotation.z = 0.9;
  plaque.add(ear);
  // Санындағы «аң стиліне» тән иірім (бедер)
  for (const [x, y, r] of [[-0.62, 0.08, 0.13], [0.42, 0.08, 0.1]]) {
    const curl = mesh(new THREE.TorusGeometry(r, 0.018, 8, 40, Math.PI * 1.5), au);
    curl.position.set(x, y, 0.11);
    plaque.add(curl);
  }
  plaque.position.y = 0.42;
  g.add(plaque);

  // Ағаш тұғыр мен ұстағыш (музейлік қойылым)
  const stand = mesh(new THREE.BoxGeometry(1.5, 0.08, 0.36), wood({ base: [70, 44, 28], dark: [40, 24, 14] }));
  stand.position.y = 0.04;
  g.add(stand);
  const rod = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 8), new THREE.MeshStandardMaterial({ color: 0x2b2b2b, metalness: 0.8, roughness: 0.4 }));
  rod.position.set(0, 0.2, 0.0);
  g.add(rod);
  return g;
}
