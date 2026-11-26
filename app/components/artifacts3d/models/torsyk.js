// Торсық (XIX ғ.): қымыз бен су сақтайтын жалпақ былғары ыдыс.
// Екі жақ беті бүйірінен қалың жіппен тігілген, бетіне «қошқар мүйіз» өрнегі
// бедерленіп басылған; аузы ағаш тығынмен жабылады, бауы өткізілетін құлақтары бар.
import * as THREE from "three";
import { leather, wood, mesh, smoothProfile, taperTube, groove, polyDist } from "../kit.js";

export const view = { azim: 0.35, elev: 0.15 };

const OUT = [[0, 0], [0.24, 0], [0.34, 0.04], [0.41, 0.16], [0.43, 0.32], [0.39, 0.48], [0.29, 0.62], [0.15, 0.73], [0.085, 0.8], [0.08, 0.9]];
const HT = 0.9;

// Қошқар мүйіз өрнегі (s — бет ортасынан көлденең қашықтық, y — биіктік)
function spiral(cx, cy, dir, flip) {
  const pts = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const a = t * Math.PI * 2.1;
    const r = 0.075 * (1 - t * 0.78);
    pts.push(cx + dir * (Math.cos(a) * r - 0.075), cy + flip * Math.sin(a) * r);
  }
  return pts;
}
const MOTIF = [];
for (const flip of [1, -1]) {
  const cy = 0.34 + flip * 0.12;
  for (const dir of [-1, 1]) MOTIF.push(spiral(0, cy, dir, flip));
}
MOTIF.push([0, 0.22, 0, 0.46]);
// Шеткі жиек өрнегі (сопақ)
const border = [];
for (let i = 0; i <= 60; i++) { const a = (i / 60) * Math.PI * 2; border.push(Math.cos(a) * 0.27, 0.33 + Math.sin(a) * 0.26); }
MOTIF.push(border);

function emboss(u, v) {
  // Алдыңғы бет u≈0.75, артқы бет u≈0.25 (Lathe басталуы бүйірде)
  const du = Math.min(Math.abs(u - 0.75), Math.abs(u - 0.25));
  const s = du * 2 * Math.PI * 0.4;
  const y = v * HT;
  if (s > 0.36) return 0;
  // u-ға қатысты таңбалы координата (сол/оң айнасы)
  const sign = (u > 0.75 || (u > 0.25 && u < 0.5)) ? 1 : -1;
  return groove(polyDist(sign * s, y, MOTIF), 0.012);
}

export default function build() {
  const g = new THREE.Group();
  const skin = leather({ base: [112, 62, 30], emboss, seed: 7 });
  const seamMat = leather({ base: [70, 38, 18], seed: 8, size: 128 });
  const pts = smoothProfile(OUT, 80);
  pts[0].x = 0;
  pts.push(new THREE.Vector2(0.0, HT));
  const geo = new THREE.LatheGeometry(pts, 96, Math.PI / 2, Math.PI * 2);
  const pos = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    pos.setZ(i, pos.getZ(i) * 0.5); // жалпақ пішін
    uv.setY(i, pos.getY(i) / HT);
  }
  geo.computeVertexNormals();
  g.add(mesh(geo, skin));

  // Бүйірдегі тігіс (z = 0 жазықтығында сұлбаны айнала)
  const rAt = (y) => {
    for (let i = 1; i < pts.length; i++) if (pts[i].y >= y) {
      const a = pts[i - 1], b = pts[i];
      return a.x + (b.x - a.x) * ((y - a.y) / (b.y - a.y || 1));
    }
    return pts[pts.length - 2].x;
  };
  const seam = [];
  for (let i = 0; i <= 30; i++) { const y = 0.02 + (i / 30) * 0.86; seam.push(new THREE.Vector3(rAt(y) + 0.004, y, 0)); }
  for (let i = 30; i >= 0; i--) { const y = 0.02 + (i / 30) * 0.86; seam.push(new THREE.Vector3(-rAt(y) - 0.004, y, 0)); }
  const path = new THREE.CatmullRomCurve3(seam, false);
  g.add(mesh(taperTube(path, 320, 0.016, 8, (t) => 0.85 + 0.25 * Math.abs(Math.sin(t * 170))), seamMat));

  // Тығын
  const wd = wood({ base: [128, 84, 44], dark: [80, 50, 24], rings: 6 });
  const plug = mesh(new THREE.CylinderGeometry(0.075, 0.068, 0.12, 24), wd);
  plug.position.y = HT + 0.03;
  g.add(plug);
  const knob = mesh(new THREE.SphereGeometry(0.06, 20, 14), wd);
  knob.scale.set(1, 0.7, 1);
  knob.position.y = HT + 0.1;
  g.add(knob);
  // Мойнын орайтын былғары бау
  const neckBand = mesh(new THREE.TorusGeometry(0.088, 0.014, 8, 40), seamMat);
  neckBand.rotation.x = Math.PI / 2;
  neckBand.scale.set(1, 0.6, 1);
  neckBand.position.y = 0.8;
  g.add(neckBand);
  // Бау өткізетін құлақтар
  for (const s of [-1, 1]) {
    const ear = mesh(new THREE.TorusGeometry(0.045, 0.014, 8, 24), seamMat);
    ear.position.set(s * (rAt(0.6) + 0.03), 0.6, 0);
    g.add(ear);
  }
  return g;
}
