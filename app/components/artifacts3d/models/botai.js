// Ботай қыш құмырасы (Солтүстік Қазақстан, б.з.д. 3500 ж. шамасы).
// Қалың қабырғалы, қолмен жапсырылып жасалған; беті тұтасымен шұқыр мен тарақ таңбасымен өрнектелген.
// Осындай ыдыстардың ішінен бие сүтінің қалдығы табылған.
import * as THREE from "three";
import { clay, vessel, mesh, groove } from "../kit.js";

export const view = { azim: 0.4, elev: 0.28 };

const PH = 0.9, PC = 2 * Math.PI * 0.42; // биіктігі мен шеңбер ұзындығы (физикалық бірлік)

// Өрнек: шұқырлардың шахмат тәрізді қатарлары + арасында тарақпен басылған қиғаш жолақтар
function decor(u, v) {
  if (v < 0.08 || v > 0.97) return 0;
  const y = v * PH, x = u * PC;
  const band = Math.floor(y / 0.11);
  const yl = y - band * 0.11;
  if (band % 2 === 0) {
    // шұқырлар
    const step = PC / 44;
    const off = (band / 2) % 2 ? step / 2 : 0;
    const cx = Math.round((x - off) / step) * step + off;
    const d = Math.hypot(x - cx, yl - 0.055);
    return d < 0.017 ? 1 - (d / 0.017) ** 2 : 0;
  }
  // тарақ таңбасы: қысқа қиғаш сызықтар (тістердің іздері нүктелі)
  const step = PC / 60;
  const cx = x - Math.floor(x / step) * step;
  const t = yl / 0.11;
  const d = Math.abs(cx - step * 0.2 - t * step * 0.6);
  const teeth = 0.55 + 0.45 * Math.cos(t * Math.PI * 10);
  return groove(d, 0.006) * teeth * (t > 0.12 && t < 0.88 ? 1 : 0);
}

export default function build() {
  const g = new THREE.Group();
  const outer = [[0, 0], [0.26, 0.0], [0.33, 0.06], [0.4, 0.22], [0.425, 0.45], [0.41, 0.7], [0.39, 0.85], [0.395, 0.9]];
  const { outerGeo, innerGeo } = vessel(outer, { thick: 0.045 });
  const mat = clay({ base: [146, 112, 84], dark: [72, 58, 46], bump: decor, seed: 5 });
  const inMat = clay({ base: [120, 92, 70], dark: [62, 50, 40], seed: 9 });
  g.add(mesh(outerGeo, mat));
  g.add(mesh(innerGeo, inMat));
  return g;
}
