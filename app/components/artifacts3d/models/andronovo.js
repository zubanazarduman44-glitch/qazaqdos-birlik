// Андронов мәдениетінің қыш ыдысы (қола дәуірі, б.з.д. XVIII–XV ғғ. шамасы).
// Түбі тегіс, иығы айқын; мойнында ілмелі үшбұрыштар, иығында меандр, бүйірінде
// штрихталған үшбұрыштар — геометриялық өрнек сызылып, тісті штамппен басылған.
import * as THREE from "three";
import { clay, vessel, mesh, groove, segDist } from "../kit.js";

export const view = { azim: 0.2, elev: 0.3 };

const PH = 0.92, R = 0.5, PC = 2 * Math.PI * R * 0.92;

function lines(u, v) {
  const y = v * PH, x = u * PC;
  const w = 0.0065;
  let m = 0;
  // Белдеулерді бөлетін көлденең сызықтар
  for (const yy of [0.84, 0.77, 0.71, 0.56, 0.5, 0.3]) m = Math.max(m, groove(Math.abs(y - yy), w));
  // Мойын: ілмелі (төмен қараған) үшбұрыштар — 18 дана
  if (y > 0.77 && y < 0.84) {
    const cw = PC / 18;
    const cx = x - Math.floor(x / cw) * cw;
    const yl = y - 0.77;
    const d1 = segDist(cx, yl, 0, 0.07, cw / 2, 0.005);
    const d2 = segDist(cx, yl, cw / 2, 0.005, cw, 0.07);
    m = Math.max(m, groove(Math.min(d1, d2), w));
  }
  // Иық: меандр (сатылы ирек) — 12 модуль
  if (y > 0.56 && y < 0.71) {
    const cw = PC / 12;
    const cx = x - Math.floor(x / cw) * cw;
    const yl = y - 0.56;
    const h = 0.15, a = cw;
    const pts = [
      [0, 0.03], [a * 0.5, 0.03], [a * 0.5, h - 0.03], [a * 0.2, h - 0.03], [a * 0.2, 0.075], [a * 0.35, 0.075],
    ];
    const pts2 = [[a * 0.5, h - 0.03], [a, h - 0.03]];
    let d = 1;
    for (let i = 0; i + 1 < pts.length; i++) d = Math.min(d, segDist(cx, yl, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]));
    d = Math.min(d, segDist(cx, yl, pts2[0][0], pts2[0][1], pts2[1][0], pts2[1][1]));
    d = Math.min(d, segDist(cx, yl, a, h - 0.03, a, 0.03)); // келесі модульге жалғанатын тік сызық
    m = Math.max(m, groove(d, w));
  }
  // Бүйір: штрихталған үшбұрыштар — 14 дана, ұшы төмен
  if (y > 0.3 && y < 0.5) {
    const cw = PC / 14;
    const cx = x - Math.floor(x / cw) * cw;
    const yl = y - 0.3;
    const top = 0.2, bot = 0.03;
    const xl = cw * 0.1, xr = cw * 0.9, xm = cw * 0.5;
    let d = Math.min(segDist(cx, yl, xl, top, xm, bot), segDist(cx, yl, xm, bot, xr, top));
    // ішіндегі штрих (қиғаш параллель сызықтар)
    const inside = yl < top && Math.abs(cx - xm) < ((yl - bot) / (top - bot)) * (xm - xl);
    if (inside) {
      const s = (cx + yl * 0.8) % 0.03;
      d = Math.min(d, Math.abs(s - 0.015));
    }
    m = Math.max(m, groove(d, w * (inside ? 0.8 : 1)));
  }
  // Тісті штамп әсері: сызық бойындағы ұсақ нүктелер
  if (m > 0) m *= 0.7 + 0.3 * Math.cos((x + y) * 900);
  return m;
}

export default function build() {
  const g = new THREE.Group();
  const outer = [[0, 0], [0.3, 0], [0.34, 0.03], [0.44, 0.3], [0.5, 0.55], [0.47, 0.68], [0.42, 0.78], [0.43, 0.86], [0.46, 0.92]];
  const { outerGeo, innerGeo } = vessel(outer, { thick: 0.032 });
  const mat = clay({ base: [176, 124, 82], dark: [96, 66, 44], bump: lines, ink: lines, seed: 13 });
  const inMat = clay({ base: [150, 100, 66], dark: [90, 60, 40], seed: 17 });
  g.add(mesh(outerGeo, mat));
  g.add(mesh(innerGeo, inMat));
  return g;
}
