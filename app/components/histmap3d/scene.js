// Тарих бөлімінің 3D картасы: three.js сахнасы (тек осы бетте, динамикалық импортпен жүктеледі).
// Тек сұраныс бойынша сызылады: камера қозғалғанда/анимацияда ғана кадр, бос тұрғанда 0 FPS.
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  MAP_W, MAP_H, rasterizeLand, traceOutline, densify, isLand, heightAt, colorAt,
  riverLines, borderLines, LAKE_POLYS, LAKE_LEVELS,
} from "../../../lib/kzTerrain";

const S = 0.01; // 1 SVG бірлігі → әлем бірлігі (ел ені ≈ 10)
const HS = 0.5; // биіктік асыра көрсету
const BASE = 0.16; // «диорама тақтасының» қалыңдығы
const wx = (x) => (x - MAP_W / 2) * S;
const wz = (y) => (y - MAP_H / 2) * S;
const wy = (x, y) => heightAt(x, y) * HS;

const DEF = { target: new THREE.Vector3(0, 0.06, 0.12), phi: 0.84, theta: 0 }; // phi тар экранда кішірейеді (жоғарырақтан қарау)
const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const tick = () => new Promise((r) => setTimeout(r, 0));

function srgb(c, r, g, b) { return c.setRGB(r, g, b, THREE.SRGBColorSpace); }

function makeCanvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  return c;
}

function outlinePath(ctx, pts, sx, sy, ox = 0, oy = 0) {
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x * sx + ox, y * sy + oy) : ctx.moveTo(x * sx + ox, y * sy + oy)));
  ctx.closePath();
}

// Сынық сызық бойымен жер бетіне жабысқан таспа (өзен, Жібек жолы)
function ribbon(lines, width, lift, taper = true) {
  const pos = [], idx = [];
  for (const pts of lines) {
    if (pts.length < 2) continue;
    const base = pos.length / 3;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      let tx = b[0] - a[0], ty = b[1] - a[1];
      const l = Math.hypot(tx, ty) || 1;
      tx /= l; ty /= l;
      const k = taper ? Math.min(1, i / 4, (pts.length - 1 - i) / 4) * 0.6 + 0.4 : 1;
      const hw = (width / S / 2) * k;
      const [x, y] = pts[i];
      for (const sgn of [1, -1]) {
        const px = x - ty * hw * sgn, py = y + tx * hw * sgn;
        pos.push(wx(px), wy(px, py) + lift, wz(py));
      }
      if (i) { const v = base + i * 2; idx.push(v - 2, v - 1, v, v - 1, v + 1, v); }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export async function createMapScene({ canvas, anchors, silk = [], coarse = false, reduced = false, onProject, onLost, cancelled = () => false }) {
  /* ── Рендерер ── */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping ?? THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false; // жарық пен жер қозғалмайды — көлеңке картасы бір рет есептеледі

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 120);

  let disposed = false;
  const lost = (e) => { e.preventDefault(); if (!disposed) onLost?.(); };
  canvas.addEventListener("webglcontextlost", lost);

  /* ── Жарық ── */
  scene.add(new THREE.HemisphereLight(0xfff3df, 0x6e5539, 1.15));
  const sun = new THREE.DirectionalLight(0xfff0d6, 2.5);
  sun.position.set(-4.5, 8.5, -5.5); // солтүстік-батыстан (картографиялық дәстүр)
  sun.castShadow = true;
  sun.shadow.mapSize.set(coarse ? 1024 : 2048, coarse ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 2, far: 24 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.012;
  scene.add(sun, sun.target);
  const fill = new THREE.DirectionalLight(0xffe2c0, 0.35);
  fill.position.set(5, 3, 6);
  scene.add(fill);

  const abort = () => { disposed = true; canvas.removeEventListener("webglcontextlost", lost); renderer.dispose(); renderer.forceContextLoss(); return null; };
  await tick();
  if (cancelled()) return abort();

  /* ── Елдің пішіні ── */
  const mask = rasterizeLand(1);
  const outline = traceOutline(mask, 0.6);
  await tick();
  if (cancelled()) return abort();

  /* ── Жер бедері: тор + альфа-маска (контур тегіс шығады) ── */
  const step = coarse ? 4 : 2.75;
  const nx = Math.ceil(MAP_W / step) + 1, ny = Math.ceil(MAP_H / step) + 1;
  const pos = new Float32Array(nx * ny * 3), col = new Float32Array(nx * ny * 3), uv = new Float32Array(nx * ny * 2);
  const land = new Uint8Array(nx * ny);
  const tmp = new THREE.Color();
  for (let j = 0; j < ny; j++) {
    const y = Math.min(MAP_H, j * step);
    for (let i = 0; i < nx; i++) {
      const x = Math.min(MAP_W, i * step);
      const k = j * nx + i;
      const h = heightAt(x, y);
      pos[k * 3] = wx(x); pos[k * 3 + 1] = h * HS; pos[k * 3 + 2] = wz(y);
      const c = colorAt(x, y, h);
      srgb(tmp, c[0], c[1], c[2]);
      col[k * 3] = tmp.r; col[k * 3 + 1] = tmp.g; col[k * 3 + 2] = tmp.b;
      uv[k * 2] = x / MAP_W; uv[k * 2 + 1] = 1 - y / MAP_H;
      land[k] = isLand(mask, x, y) ? 1 : 0;
    }
    if (j % 40 === 39) await tick();
  }
  if (cancelled()) return abort();
  const idx = [];
  for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    const a = j * nx + i, b = a + 1, c = a + nx, d = c + 1;
    const near = land[a] | land[b] | land[c] | land[d] || isLand(mask, (i + 0.5) * step, (j + 0.5) * step);
    if (near) idx.push(a, c, b, b, c, d);
  }
  const tGeo = new THREE.BufferGeometry();
  tGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  tGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  tGeo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  tGeo.setIndex(idx);
  tGeo.computeVertexNormals();

  const mw = coarse ? 1024 : 2048, mh = Math.round((mw * MAP_H) / MAP_W);
  const mc = makeCanvas(mw, mh);
  const mctx = mc.getContext("2d");
  mctx.fillStyle = "#000"; mctx.fillRect(0, 0, mw, mh);
  mctx.fillStyle = "#fff";
  outlinePath(mctx, outline, mw / MAP_W, mh / MAP_H);
  mctx.fill();
  const maskTex = new THREE.CanvasTexture(mc);
  maskTex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());

  const tMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.94, metalness: 0, alphaMap: maskTex, alphaTest: 0.5 });
  const terrain = new THREE.Mesh(tGeo, tMat);
  terrain.castShadow = terrain.receiveShadow = true;
  scene.add(terrain);
  await tick();
  if (cancelled()) { tGeo.dispose(); tMat.dispose(); maskTex.dispose(); return abort(); }

  /* ── Тақтаның бүйір қабырғалары (жер қабаттары) ── */
  const wall = densify(outline, step);
  const rows = [0, -0.012, -BASE * 0.5, -BASE];
  const rowCol = [null, [0.42, 0.31, 0.2], [0.66, 0.5, 0.33], [0.5, 0.37, 0.25]];
  const wPos = [], wCol = [], wIdx = [];
  const n = wall.length;
  for (let i = 0; i < n; i++) {
    const [x, y] = wall[i];
    const top = wy(x, y);
    const tc = colorAt(x, y, heightAt(x, y));
    rows.forEach((r, ri) => {
      const yy = ri === 0 ? top : ri === 1 ? top + r : r;
      wPos.push(wx(x), yy, wz(y));
      const c = rowCol[ri] || tc;
      srgb(tmp, c[0], c[1], c[2]);
      wCol.push(tmp.r, tmp.g, tmp.b);
    });
  }
  const R = rows.length;
  for (let i = 0; i < n; i++) {
    const a = i * R, b = ((i + 1) % n) * R;
    for (let r = 0; r < R - 1; r++) wIdx.push(a + r, a + r + 1, b + r, b + r, a + r + 1, b + r + 1);
  }
  const wGeo = new THREE.BufferGeometry();
  wGeo.setAttribute("position", new THREE.Float32BufferAttribute(wPos, 3));
  wGeo.setAttribute("color", new THREE.Float32BufferAttribute(wCol, 3));
  wGeo.setIndex(wIdx);
  wGeo.computeVertexNormals();
  const walls = new THREE.Mesh(wGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0, side: THREE.DoubleSide }));
  walls.castShadow = walls.receiveShadow = true;
  scene.add(walls);

  /* ── Табан: көлеңке қабылдағыш + жұмсақ «байланыс» көлеңкесі + Каспий жағы ── */
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ color: 0x3b2716, opacity: 0.2 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -BASE - 0.002;
  ground.receiveShadow = true;
  scene.add(ground);

  const sw = 512, sh = Math.round((sw * MAP_H) / MAP_W), pad = 60;
  const scv = makeCanvas(sw + pad * 2, sh + pad * 2);
  const sctx = scv.getContext("2d");
  sctx.shadowColor = "rgba(45, 28, 12, 0.55)";
  sctx.shadowBlur = 26;
  sctx.shadowOffsetX = 4000; // пішіннің өзі кенептен тыс, тек көлеңкесі көрінеді (барлық браузерде істейді)
  sctx.fillStyle = "#000";
  outlinePath(sctx, outline, sw / MAP_W, sh / MAP_H, pad - 4000, pad + 6);
  sctx.fill();
  const shTex = new THREE.CanvasTexture(scv);
  shTex.colorSpace = THREE.SRGBColorSpace;
  const cW = ((sw + pad * 2) / sw) * MAP_W * S, cH = ((sh + pad * 2) / sh) * MAP_H * S;
  const contact = new THREE.Mesh(new THREE.PlaneGeometry(cW, cH), new THREE.MeshBasicMaterial({ map: shTex, transparent: true, depthWrite: false }));
  contact.rotation.x = -Math.PI / 2;
  contact.position.y = -BASE - 0.001;
  scene.add(contact);

  const sea = makeCanvas(256, 256);
  const sea2 = sea.getContext("2d");
  const grd = sea2.createRadialGradient(128, 128, 10, 128, 128, 128);
  grd.addColorStop(0, "rgba(14, 143, 163, 0.38)");
  grd.addColorStop(0.6, "rgba(14, 143, 163, 0.16)");
  grd.addColorStop(1, "rgba(14, 143, 163, 0)");
  sea2.fillStyle = grd; sea2.fillRect(0, 0, 256, 256);
  const seaTex = new THREE.CanvasTexture(sea);
  seaTex.colorSpace = THREE.SRGBColorSpace;
  const caspian = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 4.4), new THREE.MeshBasicMaterial({ map: seaTex, transparent: true, depthWrite: false }));
  caspian.rotation.x = -Math.PI / 2;
  caspian.position.set(wx(-40), -BASE - 0.0015, wz(330));
  scene.add(caspian);

  /* ── Көлдер ── */
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x3f93b2, roughness: 0.28, metalness: 0.05, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const shoreMat = new THREE.LineBasicMaterial({ color: 0xeaf6f6, transparent: true, opacity: 0.55, depthWrite: false });
  LAKE_POLYS.forEach((p, li) => {
    const lvl = LAKE_LEVELS[li] * HS;
    if (p.length < 3) return;
    const shape = new THREE.Shape(p.map(([x, y]) => new THREE.Vector2(wx(x), -wz(y))));
    const g = new THREE.ShapeGeometry(shape, 1);
    g.rotateX(-Math.PI / 2);
    const lake = new THREE.Mesh(g, waterMat);
    lake.position.y = lvl + 0.002;
    lake.receiveShadow = true;
    scene.add(lake);
    const lg = new THREE.BufferGeometry().setFromPoints(p.concat([p[0]]).map(([x, y]) => new THREE.Vector3(wx(x), lvl + 0.0028, wz(y))));
    scene.add(new THREE.Line(lg, shoreMat));
  });

  /* ── Өзендер ── */
  const rl = riverLines(mask, 2);
  const riverMat = new THREE.MeshStandardMaterial({ color: 0x2f86a6, roughness: 0.35, metalness: 0, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
  const big = rl.filter((r) => r.ri === 0 || r.ri === 4 || r.ri === 3).map((r) => r.pts);
  const small = rl.filter((r) => !(r.ri === 0 || r.ri === 4 || r.ri === 3)).map((r) => r.pts);
  for (const [lines, w] of [[big, 0.03], [small, 0.022]]) {
    const m = new THREE.Mesh(ribbon(lines, w, 0.006), riverMat);
    m.receiveShadow = true;
    scene.add(m);
  }

  /* ── Облыс шекаралары (әлсіз сызықтар) ── */
  const bPos = [];
  for (const line of borderLines(3)) {
    for (let i = 0; i < line.length; i++) {
      const a = line[i], b = line[(i + 1) % line.length];
      bPos.push(wx(a[0]), wy(a[0], a[1]) + 0.005, wz(a[1]), wx(b[0]), wy(b[0], b[1]) + 0.005, wz(b[1]));
    }
  }
  const bGeo = new THREE.BufferGeometry();
  bGeo.setAttribute("position", new THREE.Float32BufferAttribute(bPos, 3));
  scene.add(new THREE.LineSegments(bGeo, new THREE.LineBasicMaterial({ color: 0x5b3a1f, transparent: true, opacity: 0.26, depthWrite: false })));

  /* ── Ұлы Жібек жолы: алтын үзік таспа ── */
  if (silk.length > 1) {
    const pts = [];
    for (let i = 1; i < silk.length; i++) {
      const [x0, y0] = silk[i - 1], [x1, y1] = silk[i];
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2 - 26;
      for (let k = i === 1 ? 0 : 1; k <= 24; k++) {
        const t = k / 24, u = 1 - t;
        pts.push([u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1]);
      }
    }
    const dashes = [];
    let acc = 0, cur = [pts[0]], on = true;
    for (let i = 1; i < pts.length; i++) {
      acc += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (on) cur.push(pts[i]);
      if (acc > (on ? 7 : 4.5)) { if (on && cur.length > 1) dashes.push(cur); on = !on; acc = 0; cur = [pts[i]]; }
    }
    if (on && cur.length > 1) dashes.push(cur);
    const sm = new THREE.Mesh(ribbon(dashes, 0.016, 0.012, false), new THREE.MeshStandardMaterial({ color: 0xe8b23a, emissive: 0x6b4a00, emissiveIntensity: 0.25, roughness: 0.5, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }));
    scene.add(sm);
  }

  /* ── Тарихи орындардың тұғыры (белгі астындағы алтын шеңбер) ── */
  const ringGeo = new THREE.RingGeometry(0.038, 0.058, 32);
  ringGeo.rotateX(-Math.PI / 2);
  const discGeo = new THREE.CircleGeometry(0.038, 32);
  discGeo.rotateX(-Math.PI / 2);
  const C_GOLD = new THREE.Color(0xe8b23a), C_RED = new THREE.Color(0xa3242b), C_DIM = new THREE.Color(0x9c9284);
  const pins = anchors.map((a) => {
    const g = new THREE.Group();
    const y = wy(a.x, a.y);
    g.position.set(wx(a.x), y + 0.004, wz(a.y));
    const ringMat = new THREE.MeshStandardMaterial({ color: C_GOLD.clone(), roughness: 0.45, metalness: 0.2, polygonOffset: true, polygonOffsetFactor: -5, polygonOffsetUnits: -5 });
    const discMat = new THREE.MeshBasicMaterial({ color: 0xfff7e2, transparent: true, opacity: 0.7, depthWrite: false });
    g.add(new THREE.Mesh(discGeo, discMat), new THREE.Mesh(ringGeo, ringMat));
    scene.add(g);
    return { id: a.id, group: g, ringMat, world: new THREE.Vector3(wx(a.x), y + 0.012, wz(a.y)) };
  });

  /* ── Камера және басқару ── */
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = !reduced;
  controls.dampingFactor = 0.085;
  controls.rotateSpeed = 0.55;
  controls.zoomSpeed = 0.9;
  controls.panSpeed = 0.8;
  controls.screenSpacePanning = false;
  controls.minPolarAngle = 0.12;
  controls.maxPolarAngle = 1.22;
  controls.minDistance = 2.2;
  controls.zoomToCursor = !coarse;
  controls.cursor.copy(DEF.target);
  controls.maxTargetRadius = 4.8;
  if (coarse) {
    // Телефон: бір саусақ — бетті айналдыру (scroll), екі саусақ — картаны бұру/үлкейту
    controls.touches = { ONE: -1, TWO: THREE.TOUCH.DOLLY_ROTATE };
    canvas.style.touchAction = "pan-y";
  }
  const onTouchStart = (e) => { if (e.touches.length >= 2 && e.cancelable) e.preventDefault(); };
  canvas.addEventListener("touchstart", onTouchStart, { passive: false });

  let W = 1, H = 1, fitR = 16, userMoved = false;
  const sph = new THREE.Spherical();
  function computeFit() {
    const v = THREE.MathUtils.degToRad(camera.fov);
    const hf = 2 * Math.atan(Math.tan(v / 2) * camera.aspect);
    const halfW = camera.aspect < 1.2 ? 4.9 : 5.35;
    DEF.phi = camera.aspect < 1.2 ? 0.66 : 0.84;
    return Math.max(halfW / Math.tan(hf / 2), (2.77 * Math.cos(DEF.phi) + 0.35) / Math.tan(v / 2));
  }
  function place(target, r, phi, theta) {
    sph.set(r, phi, theta);
    camera.position.setFromSpherical(sph).add(target);
    controls.target.copy(target);
    camera.lookAt(target);
  }

  /* ── Анимация (камера ұшуы) ── */
  let tween = null;
  function current() {
    const off = camera.position.clone().sub(controls.target);
    const s = new THREE.Spherical().setFromVector3(off);
    return { target: controls.target.clone(), r: s.radius, phi: s.phi, theta: s.theta };
  }
  function go(to, dur) {
    const from = current();
    if (reduced || dur <= 0) { place(to.target, to.r, to.phi, to.theta); tween = null; request(); return; }
    let dT = to.theta - from.theta;
    dT = Math.atan2(Math.sin(dT), Math.cos(dT));
    tween = { from, to: { ...to, theta: from.theta + dT }, t0: performance.now(), dur };
    request();
  }
  function stepTween(now) {
    const { from, to, t0, dur } = tween;
    const k = Math.min(1, (now - t0) / dur), e = ease(k);
    const tg = from.target.clone().lerp(to.target, e);
    // ұзақ ұшуда сәл жоғары көтеріліп барып түседі
    const lift = to.arc ? Math.sin(Math.PI * e) * to.arc : 0;
    place(tg, from.r + (to.r - from.r) * e + lift, from.phi + (to.phi - from.phi) * e, from.theta + (to.theta - from.theta) * e);
    if (k >= 1) tween = null;
    return k < 1;
  }
  controls.addEventListener("start", () => { tween = null; userMoved = true; });

  /* ── Кадр циклы (тек қажет кезде) ── */
  let raf = 0, visible = true;
  const proj = anchors.map((a) => ({ id: a.id, x: 0, y: 0, d: 0, on: false }));
  const v3 = new THREE.Vector3();
  function request() {
    if (!raf && !disposed && visible && !document.hidden) raf = requestAnimationFrame(frame);
  }
  function frame(now) {
    raf = 0;
    if (disposed) return;
    const anim = tween ? stepTween(now) : false;
    const changed = controls.update();
    renderer.render(scene, camera);
    for (let i = 0; i < pins.length; i++) {
      v3.copy(pins[i].world).project(camera);
      const p = proj[i];
      p.x = (v3.x * 0.5 + 0.5) * W;
      p.y = (-v3.y * 0.5 + 0.5) * H;
      p.on = v3.z < 1 && p.x > -40 && p.x < W + 40 && p.y > -60 && p.y < H + 60;
      p.d = camera.position.distanceTo(pins[i].world);
    }
    onProject?.(proj);
    if (anim || changed) request();
  }
  controls.addEventListener("change", request);
  const onVis = () => request();
  document.addEventListener("visibilitychange", onVis);

  function resize(w, h) {
    W = Math.max(1, w); H = Math.max(1, h);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    fitR = computeFit();
    controls.maxDistance = fitR * 1.5;
    if (!userMoved && !tween) place(DEF.target, fitR, DEF.phi, DEF.theta);
    request();
  }

  const api = {
    resize,
    render: () => request(),
    setVisible(v) { visible = v; if (v) request(); },
    setState({ sel, dim }) {
      for (const p of pins) {
        const isSel = p.id === sel, isDim = dim.has(p.id);
        p.ringMat.color.copy(isSel ? C_RED : isDim ? C_DIM : C_GOLD);
        p.group.scale.setScalar(isSel ? 1.45 : 1);
      }
      request();
    },
    flyTo(id) {
      const p = pins.find((q) => q.id === id);
      if (!p) return;
      userMoved = true;
      const c = current();
      const r = Math.max(2.6, Math.min(c.r, 3.4));
      const far = c.target.distanceTo(p.world);
      go({ target: new THREE.Vector3(p.world.x, 0.06, p.world.z), r, phi: Math.min(0.95, Math.max(0.6, c.phi)), theta: c.theta, arc: far > 2 ? Math.min(1.6, far * 0.35) : 0 }, 1150);
    },
    zoom(f) {
      userMoved = true;
      const c = tween ? { ...tween.to } : current();
      go({ ...c, r: THREE.MathUtils.clamp(c.r * f, controls.minDistance, controls.maxDistance), arc: 0 }, 380);
    },
    reset() {
      userMoved = false;
      go({ target: DEF.target.clone(), r: fitR, phi: DEF.phi, theta: DEF.theta, arc: 0 }, 900);
    },
    intro() {
      // ашылғанда камера жоғарыдан баяу түседі (қозғалыс азайтылса — бірден)
      place(DEF.target, fitR * 1.25, 0.35, -0.5);
      go({ target: DEF.target.clone(), r: fitR, phi: DEF.phi, theta: DEF.theta, arc: 0 }, reduced ? 0 : 1600);
    },
    stats() { return { triangles: renderer.info.render.triangles, calls: renderer.info.render.calls }; },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      controls.dispose();
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("webglcontextlost", lost);
      document.removeEventListener("visibilitychange", onVis);
      scene.traverse((o) => {
        o.geometry?.dispose?.();
        const ms = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
        for (const m of ms) { for (const k of ["map", "alphaMap"]) m[k]?.dispose?.(); m.dispose(); }
      });
      sun.shadow.map?.dispose?.();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
  renderer.shadowMap.needsUpdate = true;
  return api;
}
