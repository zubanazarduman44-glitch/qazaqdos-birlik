// Домбыра (XIX ғ.): алмұрт пішінді шанағы бар, екі ішекті қазақтың ұлттық аспабы.
// Шанағы жіңішке тақталардан құралған, қақпағы жұқа ағаш, мойнында ішектен
// байланған пернелер, басында екі құлақ күйі.
import * as THREE from "three";
import { wood, mesh, plain } from "../kit.js";

export const view = { azim: 0.45, elev: 0.1 };

const BL = 0.52; // шанақ ұзындығы
const bodyR = (y) => {
  const t = Math.min(1, Math.max(0, y / BL));
  // Алмұрт: төменгі жағы кең, мойынға қарай біртіндеп тарылады
  const a = Math.sin(Math.PI * Math.pow(t, 0.62));
  return 0.205 * a * (1 - 0.55 * t) + (t > 0.85 ? (t - 0.85) * 0.25 : 0);
};

export default function build() {
  const g = new THREE.Group();
  const back = wood({ base: [128, 70, 34], dark: [78, 38, 16], rings: 9, rough: 0.35 }); // тақталар
  const top = wood({ base: [206, 162, 106], dark: [170, 124, 74], rings: 40, rough: 0.45 });
  const neckW = wood({ base: [110, 60, 30], dark: [66, 34, 14], rings: 4, rough: 0.4 });
  const dark = plain(0x1d1410, { roughness: 0.8 });
  const gut = plain(0xd8c7a0, { roughness: 0.55 });
  const steel = new THREE.MeshStandardMaterial({ color: 0xdcd6c8, metalness: 1, roughness: 0.3 });

  const inst = new THREE.Group();
  // Шанақ (артқы күмбез)
  const pts = [];
  for (let i = 0; i <= 48; i++) { const y = (i / 48) * BL; pts.push(new THREE.Vector2(bodyR(y), y)); }
  const bowl = new THREE.LatheGeometry(pts, 48, Math.PI / 2, Math.PI);
  bowl.scale(1, 1, 0.85);
  inst.add(mesh(bowl, back));
  // Қақпақ
  const sh = new THREE.Shape();
  sh.moveTo(0, 0);
  for (let i = 1; i <= 48; i++) { const y = (i / 48) * BL; sh.lineTo(bodyR(y), y); }
  for (let i = 48; i >= 0; i--) { const y = (i / 48) * BL; sh.lineTo(-bodyR(y), y); }
  const topGeo = new THREE.ExtrudeGeometry(sh, { depth: 0.008, bevelEnabled: false });
  // uv: ShapeGeometry uv — x, y координаттары; талшықты бойлай бағыттаймыз
  inst.add(mesh(topGeo, top));
  // Қақпақ жиегіндегі жіңішке қара жиек
  const edge = [];
  for (let i = 0; i <= 48; i++) { const y = (i / 48) * BL; edge.push(new THREE.Vector3(bodyR(y), y, 0.004)); }
  for (let i = 48; i >= 0; i--) { const y = (i / 48) * BL; edge.push(new THREE.Vector3(-bodyR(y), y, 0.004)); }
  inst.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(edge, true), 160, 0.005, 6, true), dark));
  // Үн шығатын ұсақ тесіктер (розетка)
  const holeGeo = new THREE.CircleGeometry(0.009, 16);
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const h = mesh(holeGeo, dark, { cast: false });
    h.position.set(i === 6 ? 0 : Math.cos(a) * 0.032, 0.36 + (i === 6 ? 0 : Math.sin(a) * 0.032), 0.0085);
    if (i === 6) h.position.set(0, 0.36, 0.0085);
    inst.add(h);
  }
  // Тиек (ішек тірегі) және ішек ілгіш
  const bridge = mesh(new THREE.BoxGeometry(0.06, 0.012, 0.022), neckW);
  bridge.position.set(0, 0.12, 0.019);
  inst.add(bridge);
  const tail = mesh(new THREE.BoxGeometry(0.03, 0.02, 0.016), dark);
  tail.position.set(0, 0.012, 0.012);
  inst.add(tail);

  // Мойын
  const NL = 0.78;
  const neck = new THREE.BoxGeometry(0.052, NL, 0.036, 1, 8, 1);
  const np = neck.attributes.position;
  for (let i = 0; i < np.count; i++) {
    const t = (np.getY(i) + NL / 2) / NL;
    np.setX(i, np.getX(i) * (1 - t * 0.2));
  }
  neck.computeVertexNormals();
  const neckM = mesh(neck, neckW);
  neckM.position.set(0, BL - 0.04 + NL / 2, -0.012);
  inst.add(neckM);
  // Пернелер (байланған ішек): қашықтығы мойын бойымен жақындай береді
  let y = BL + 0.02;
  let step = 0.075;
  for (let i = 0; i < 11; i++) {
    const f = mesh(new THREE.CapsuleGeometry(0.0035, 0.05 * (1 - (y - BL) / NL * 0.2), 3, 6), gut);
    f.rotation.z = Math.PI / 2;
    f.position.set(0, y, 0.0075);
    inst.add(f);
    y += step;
    step *= 0.93;
  }
  // Бас және құлақ күйлер
  const headY = BL - 0.04 + NL;
  const head = mesh(new THREE.BoxGeometry(0.046, 0.14, 0.034), neckW);
  head.position.set(0, headY + 0.07, -0.02);
  head.rotation.x = -0.18;
  inst.add(head);
  for (const [s, dy] of [[-1, 0.05], [1, 0.1]]) {
    const peg = mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.1, 10), neckW);
    peg.rotation.z = Math.PI / 2;
    peg.position.set(s * 0.04, headY + dy, -0.025);
    inst.add(peg);
    const knob = mesh(new THREE.SphereGeometry(0.016, 14, 10), neckW);
    knob.scale.set(0.6, 1.2, 1);
    knob.position.set(s * 0.09, headY + dy, -0.025);
    inst.add(knob);
  }
  const nut = mesh(new THREE.BoxGeometry(0.05, 0.008, 0.01), plain(0xe9e1cc));
  nut.position.set(0, headY - 0.005, 0.008);
  inst.add(nut);
  // Екі ішек
  for (const s of [-1, 1]) {
    const a = new THREE.Vector3(s * 0.009, 0.012, 0.02);
    const b = new THREE.Vector3(s * 0.008, headY, 0.013);
    const len = a.distanceTo(b);
    const str = mesh(new THREE.CylinderGeometry(0.0013, 0.0013, len, 6), steel, { cast: false });
    str.position.copy(a).add(b).multiplyScalar(0.5);
    str.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    inst.add(str);
  }

  // Аспапты тұғырға сүйеп қоямыз
  inst.rotation.set(-0.12, 0, 0.0);
  inst.position.set(0, 0.06, 0.05);
  g.add(inst);
  const stand = mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.05, 40), plain(0x2b211b, { roughness: 0.5 }));
  stand.position.y = 0.025;
  g.add(stand);
  return g;
}
