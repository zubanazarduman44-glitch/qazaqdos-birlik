// Aqyl кейіпкерлерінің суреттерін дайындау: art/aqyl-pair.webp → public/aqyl/*.webp
// Әр кейіпкер (qyz — әңгімеші қыз, jigit — әңгімеші жігіт) қабаттарға бөлінеді:
//   base  — денесі (жест жасайтын қолы алынған)
//   up    — көтерілген қол (бастапқы суреттегі жест)
//   down  — төмен түскен қол (екінші қолдың айнадағы көшірмесі)
//   lids  — жабық қабақ (көз жұму үшін тері түстес жамау), mouth — жабық ауыз жамауы
//   face  — портрет (бас пен иық, шаршы)
// Барлық қабаттың өлшемі бірдей (CW×CH), сондықтан бір-бірінің үстіне дәл түседі.
// Іске қосу: node scripts/build-aqyl-art.cjs
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "art", "aqyl-pair.webp");
const OUT = path.join(ROOT, "public", "aqyl");
const K = 0.72; // қабаттардың шығыс масштабы
const CW = 490, CH = 950; // кенеп (бастапқы пиксельмен)

const CHARS = {
  qyz: {
    origin: [195, 24],
    axis: 458,
    // көтерілген қол: жең + білек + алақан
    up: [[200, 336], [345, 334], [378, 350], [404, 352], [403, 420], [400, 488], [397, 532], [300, 545], [200, 545]],
    // денені толтыру жолағы (қол алынған жер, қол астындағы көйлек)
    fill: [[372, 356], [404, 352], [401, 490], [397, 530], [372, 530]],
    fillDx: 44,
    beltTop: 487, // толтыру белдіктен жоғары ғана
    cuff: 556, // одан төмен — алақан (ішкі шеті жұмсартылмайды)
    // салбыраған оң қол (айналы көшірме көзі)
    arm: [[508, 352], [560, 350], [600, 370], [626, 420], [630, 520], [628, 600], [625, 700], [560, 700], [548, 600], [540, 560], [523, 520], [512, 470], [508, 420]],
    pivot: [403, 362],
    eyes: [{ cx: 423, cy: 221, rx: 30, ry: 28 }, { cx: 530, cy: 241, rx: 38, ry: 25 }],
    mouth: { cx: 465, cy: 291, rx: 33, ry: 19 },
    portrait: { x: 286, y: 33, s: 380 },
  },
  jigit: {
    origin: [823, 24],
    axis: 1104,
    up: [[856, 318], [985, 318], [1000, 340], [1046, 340], [1042, 370], [1040, 500], [1034, 512], [1032, 532], [940, 540], [856, 540]],
    fill: [[1012, 345], [1046, 340], [1040, 500], [1034, 512], [1012, 512]],
    fillDx: 40,
    beltTop: 512,
    cuff: 498,
    arm: [[1160, 345], [1200, 350], [1235, 380], [1262, 440], [1266, 520], [1262, 600], [1258, 700], [1185, 700], [1182, 600], [1182, 540], [1180, 505], [1162, 500], [1160, 420]],
    pivot: [1042, 362],
    eyes: [{ cx: 1070, cy: 208, rx: 24, ry: 24 }, { cx: 1158, cy: 226, rx: 31, ry: 23 }],
    mouth: { cx: 1103, cy: 279, rx: 33, ry: 19 },
    portrait: { x: 930, y: 26, s: 368 },
  },
};

function inPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
const bbox = (poly) => {
  const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]);
  return [Math.floor(Math.min(...xs)), Math.floor(Math.min(...ys)), Math.ceil(Math.max(...xs)), Math.ceil(Math.max(...ys))];
};
// Шалбардың көк-жасыл түсі және шаш/белдіктің өте қою түсі қолға қосылмайды
const isTeal = (r, g, b) => g > r + 18 && b > r + 8;
const isDark = (r, g, b) => r + g + b < 200;
const isCream = (r, g, b) => r > 190 && g > 160 && b > 105 && r - b < 110;
// Шаш ұшындағы жартылай мөлдір қою пиксельдер (иық тұсында)
const isFringe = (r, g, b, y) => y < 380 && r + g + b < 360;
const isSkin = (r, g, b) => r > 170 && r > g + 25 && g > b + 15 && r - b > 70;

// Детерминді шу (жамау киіз сияқты көрінсін)
let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const gauss = () => {
  let u = 0, v = 0;
  while (!u) u = rnd();
  while (!v) v = rnd();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

async function main() {
  const { data: S, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const px = (x, y) => (y * W + x) * 4;

  for (const [id, c] of Object.entries(CHARS)) {
    const [ox, oy] = c.origin;
    const mk = () => Buffer.alloc(CW * CH * 4);
    const base = mk(), up = mk(), down = mk(), lids = mk(), mouth = mk();
    const removed = new Uint8Array(CW * CH);
    const cp = (dst, cx, cy, sx, sy, a = null) => {
      if (cx < 0 || cy < 0 || cx >= CW || cy >= CH || sx < 0 || sy < 0 || sx >= W || sy >= H) return;
      const d = (cy * CW + cx) * 4, s = px(sx, sy);
      dst[d] = S[s]; dst[d + 1] = S[s + 1]; dst[d + 2] = S[s + 2]; dst[d + 3] = a == null ? S[s + 3] : a;
    };
    // 1) base = бастапқы сурет
    for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) cp(base, x, y, x + ox, y + oy);
    // 2) көтерілген қолды бөліп алу
    const [ux0, uy0, ux1, uy1] = bbox(c.up);
    for (let y = uy0; y <= uy1; y++) for (let x = ux0; x <= ux1; x++) {
      if (!inPoly(x + 0.5, y + 0.5, c.up)) continue;
      const s = px(x, y);
      if (S[s + 3] === 0) continue;
      // Шаш (мөлдір емес қою) пен шалбар денеде қалады; алақанның жартылай мөлдір шеті қолмен бірге кетеді
      const opaque = S[s + 3] > 200;
      if (isTeal(S[s], S[s + 1], S[s + 2]) || (opaque && isDark(S[s], S[s + 1], S[s + 2]))) continue;
      cp(up, x - ox, y - oy, x, y);
      base[((y - oy) * CW + (x - ox)) * 4 + 3] = 0;
      removed[(y - oy) * CW + (x - ox)] = 1;
    }
    // 3) қол астындағы көйлекті толтыру (қол бұрылғанда тесік көрінбесін)
    const [fx0, fy0, fx1, fy1] = bbox(c.fill);
    for (let y = fy0; y <= fy1; y++) for (let x = fx0; x <= fx1; x++) {
      if (!inPoly(x + 0.5, y + 0.5, c.fill)) continue;
      if (y >= c.beltTop || !removed[(y - oy) * CW + (x - ox)]) continue;
      const s = px(x + c.fillDx, y);
      if (S[s + 3] < 250 || !isCream(S[s], S[s + 1], S[s + 2])) continue;
      cp(base, x - ox, y - oy, x + c.fillDx, y, 255);
    }
    // 4) төмен түскен қол = оң қолдың айналы көшірмесі
    const [ax0, ay0, ax1, ay1] = bbox(c.arm);
    // Ішкі (денеге жанасқан) және жоғарғы кесік шеттері жұмсақ болсын — айналы жең денемен тігіссіз қосылады
    const xin = {}, ytop = {};
    for (let y = ay0; y <= ay1; y++) for (let x = ax0; x <= ax1; x++) if (inPoly(x + 0.5, y + 0.5, c.arm)) { if (xin[y] == null) xin[y] = x; if (ytop[x] == null) ytop[x] = y; }
    const ramp = (v, w) => Math.max(0, Math.min(1, v / w));
    for (let y = ay0; y <= ay1; y++) for (let x = ax0; x <= ax1; x++) {
      if (!inPoly(x + 0.5, y + 0.5, c.arm)) continue;
      const s = px(x, y);
      if (S[s + 3] === 0) continue;
      if (isDark(S[s], S[s + 1], S[s + 2]) || isTeal(S[s], S[s + 1], S[s + 2]) || isFringe(S[s], S[s + 1], S[s + 2], y)) continue;
      let a = S[s + 3];
      if (y < c.cuff && isCream(S[s], S[s + 1], S[s + 2])) a = Math.round(a * ramp(x - xin[y], 14));
      a = Math.round(a * ramp(y - ytop[x] + 1, 6));
      cp(down, 2 * c.axis - x - ox, y - oy, x, y, a);
    }
    // 5) Жамаулар: көз бен ауыз орнына тері түсі + шу
    const patch = (dst, e) => {
      let n = 0, m = [0, 0, 0], q = [0, 0, 0];
      for (let y = Math.floor(e.cy - e.ry * 1.7); y <= e.cy + e.ry * 1.7; y++) for (let x = Math.floor(e.cx - e.rx * 1.7); x <= e.cx + e.rx * 1.7; x++) {
        const t = ((x - e.cx) / e.rx) ** 2 + ((y - e.cy) / e.ry) ** 2;
        if (t < 1.25 || t > 2.6) continue;
        const s = px(x, y);
        if (!isSkin(S[s], S[s + 1], S[s + 2])) continue;
        for (let k = 0; k < 3; k++) { m[k] += S[s + k]; q[k] += S[s + k] ** 2; }
        n++;
      }
      m = m.map((v) => v / n);
      const sd = q.map((v, k) => Math.sqrt(Math.max(0, v / n - m[k] ** 2)));
      for (let y = Math.floor(e.cy - e.ry - 2); y <= e.cy + e.ry + 2; y++) for (let x = Math.floor(e.cx - e.rx - 2); x <= e.cx + e.rx + 2; x++) {
        const t = Math.sqrt(((x - e.cx) / e.rx) ** 2 + ((y - e.cy) / e.ry) ** 2);
        if (t > 1) continue;
        const edge = Math.min(1, ((1 - t) * Math.min(e.rx, e.ry)) / 2.5); // 2.5px жұмсақ шет
        const g = gauss() * 0.7;
        const d = ((y - oy) * CW + (x - ox)) * 4;
        for (let k = 0; k < 3; k++) dst[d + k] = Math.max(0, Math.min(255, Math.round(m[k] + g * sd[k])));
        dst[d + 3] = Math.round(255 * edge);
      }
      return m;
    };
    const skin = patch(lids, c.eyes[0]);
    patch(lids, c.eyes[1]);
    patch(mouth, c.mouth);

    const raw = { raw: { width: CW, height: CH, channels: 4 } };
    const save = async (buf, name) => {
      const b = await sharp(buf, raw).png().toBuffer();
      await sharp(b)
        .resize({ width: Math.round(CW * K), height: Math.round(CH * K), kernel: "lanczos3" })
        .webp({ quality: 86, alphaQuality: 90, effort: 6 })
        .toFile(path.join(OUT, `${id}-${name}.webp`));
    };
    await save(base, "base");
    await save(up, "up");
    await save(down, "down");
    await save(lids, "lids");
    await save(mouth, "mouth");
    // Портрет: base + төмен қол (иықтар симметриялы)
    const idle = await sharp(base, raw).composite([{ input: await sharp(down, raw).png().toBuffer() }]).png().toBuffer();
    const p = c.portrait;
    await sharp(idle)
      .extract({ left: p.x - ox, top: p.y - oy, width: p.s, height: p.s })
      .resize(256, 256, { kernel: "lanczos3" })
      .webp({ quality: 88, alphaQuality: 92, effort: 6 })
      .toFile(path.join(OUT, `${id}-face.webp`));
    console.log(
      id,
      "skin", skin.map((v) => Math.round(v)).join(","),
      "pivot", c.pivot[0] - ox, c.pivot[1] - oy,
      "eyes", c.eyes.map((e) => [e.cx - ox, e.cy - oy, e.rx, e.ry].join("/")).join(" "),
      "mouth", [c.mouth.cx - ox, c.mouth.cy - oy].join("/"),
      "portrait", [p.x - ox, p.y - oy, p.s].join("/")
    );
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
