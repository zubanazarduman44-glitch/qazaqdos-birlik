// Сақтардың құрбандық қазаны (Жетісу, б.з.д. V–III ғғ.).
// Қоладан құйылған жарты шар тәрізді тостаған, конус пішінді қуыс аяқ және
// ернеуінде тік тұрған екі доға құлақ. Беті көкшіл патинамен жабылған.
import * as THREE from "three";
import { bronze, vessel, mesh } from "../kit.js";

export const view = { azim: 0.5, elev: 0.3 };

export default function build() {
  const g = new THREE.Group();
  const mat = bronze({ patina: 0.45, seed: 4, scale: 5 });
  const inMat = bronze({ patina: 0.35, seed: 8, scale: 4, base: [120, 78, 44] });

  // Тостаған
  const outer = [[0, 0], [0.18, 0.01], [0.34, 0.07], [0.45, 0.18], [0.5, 0.32], [0.5, 0.44], [0.49, 0.48]];
  const { outerGeo, innerGeo } = vessel(outer, { thick: 0.028, segs: 96 });
  const bowl = new THREE.Group();
  bowl.add(mesh(outerGeo, mat));
  bowl.add(mesh(innerGeo, inMat));
  bowl.position.y = 0.36;
  g.add(bowl);

  // Ернеу астындағы өрілген арқан тәрізді белдеу
  const band = mesh(new THREE.TorusGeometry(0.502, 0.014, 10, 120), mat);
  band.rotation.x = Math.PI / 2;
  band.position.y = 0.36 + 0.38;
  g.add(band);

  // Конус аяқ (ішкі қуысы бар тұйық профиль)
  const foot = [
    [0.265, 0.0], [0.3, 0.0], [0.305, 0.025], [0.27, 0.06], [0.2, 0.16], [0.14, 0.28], [0.11, 0.38], [0.1, 0.42],
    [0.06, 0.42], [0.08, 0.36], [0.11, 0.26], [0.17, 0.15], [0.24, 0.06], [0.265, 0.0],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  g.add(mesh(new THREE.LatheGeometry(foot, 72), mat));
  // Аяқ пен тостаған жалғасатын белдік
  const collar = mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.05, 48), mat);
  collar.position.y = 0.4;
  g.add(collar);

  // Тік доға құлақтар
  for (const s of [-1, 1]) {
    const h = mesh(new THREE.TorusGeometry(0.1, 0.022, 14, 40, Math.PI), mat);
    h.position.set(s * 0.475, 0.36 + 0.48, 0);
    h.rotation.y = Math.PI / 2;
    g.add(h);
    // құлақ түбіндегі қалың тірек
    for (const t of [-1, 1]) {
      const st = mesh(new THREE.CylinderGeometry(0.026, 0.03, 0.04, 12), mat);
      st.position.set(s * 0.475, 0.36 + 0.48, t * 0.1);
      g.add(st);
    }
  }
  return g;
}
