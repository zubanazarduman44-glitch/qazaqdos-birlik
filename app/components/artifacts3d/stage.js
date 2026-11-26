// Ортақ рендерер, студиялық жарық және камераны жәдігерге бейімдеу.
// Бүкіл галерея үшін БІР ғана WebGL контексті: карточка суреттері де, 3D көрермен де соны пайдаланады.
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MODELS } from "./registry.js";
import { disposeObject, setQuality } from "./kit.js";
import { markNoWebGL } from "./gl.js";

let renderer = null;
let envTex = null;
let lost = false;

export const isLost = () => lost;

export function getRenderer() {
  if (lost) throw new Error("webgl-lost");
  if (renderer) return renderer;
  const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "default", preserveDrawingBuffer: false });
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.05;
  r.setClearColor(0x000000, 0);
  r.domElement.className = "agx-canvas";
  r.domElement.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    lost = true;
    markNoWebGL();
  });
  const pm = new THREE.PMREMGenerator(r);
  const room = new RoomEnvironment();
  envTex = pm.fromScene(room, 0.04).texture;
  room.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) o.material.dispose();
  });
  pm.dispose();
  renderer = r;
  return r;
}

// ── Рендерерге кезекпен қол жеткізу (сурет түсіру мен көрермен бір-біріне кедергі келтірмейді) ──
let busy = false;
const waiters = [];
export function acquire() {
  return new Promise((resolve) => {
    let done = false;
    const release = () => {
      if (done) return;
      done = true;
      busy = false;
      const next = waiters.shift();
      if (next) next();
    };
    const grant = () => {
      busy = true;
      resolve(release);
    };
    if (!busy) grant();
    else waiters.push(grant);
  });
}

// Жұмсақ жанасу көлеңкесі (shadow map-сыз, арзан)
function contactShadow(radius) {
  const S = 128;
  const data = new Uint8Array(S * S * 4);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const dx = (x / (S - 1)) * 2 - 1, dy = (y / (S - 1)) * 2 - 1;
      const a = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy));
      data[(y * S + x) * 4 + 3] = Math.round(Math.pow(a, 1.8) * 255);
    }
  }
  const tex = new THREE.DataTexture(data, S, S, THREE.RGBAFormat);
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(radius * 2, radius * 2),
    new THREE.MeshBasicMaterial({ map: tex, color: 0x1f160f, transparent: true, opacity: 0.55, depthWrite: false, toneMapped: false })
  );
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.001;
  m.renderOrder = -1;
  return m;
}

// Модельді құрастырып, сахнаға қою. quality: 0.5 — карточка суреті, 1 — көрермен.
export async function buildStage(modelId, { quality = 1, aspect = 1 } = {}) {
  const load = MODELS[modelId];
  if (!load) throw new Error(`unknown model ${modelId}`);
  const mod = await load();
  setQuality(quality);
  let model;
  try {
    model = mod.default();
  } finally {
    setQuality(1);
  }
  const view = { azim: 0.4, elev: 0.2, ...(mod.view || {}) };

  // Табанын y = 0-ге, ортасын оське келтіреміз
  const box = new THREE.Box3().setFromObject(model);
  const c = box.getCenter(new THREE.Vector3());
  model.position.x -= c.x;
  model.position.z -= c.z;
  model.position.y -= box.min.y;
  const holder = new THREE.Group();
  holder.add(model);
  box.setFromObject(holder);
  const size = box.getSize(new THREE.Vector3());
  const R = box.getBoundingSphere(new THREE.Sphere()).radius;

  const scene = new THREE.Scene();
  scene.environment = envTex;
  scene.environmentIntensity = 0.85;
  scene.add(holder);
  const key = new THREE.DirectionalLight(0xfff0dc, 2.2);
  key.position.set(-2.2 * R, 3.2 * R, 2.6 * R);
  const rim = new THREE.DirectionalLight(0xd8ecff, 1.7);
  rim.position.set(2.6 * R, 1.8 * R, -3 * R);
  const fill = new THREE.HemisphereLight(0xfff8ee, 0x3a2a20, 0.35);
  scene.add(key, rim, fill);
  const shadow = contactShadow(Math.max(size.x, size.z) * 0.75 + R * 0.15);
  scene.add(shadow);

  const camera = new THREE.PerspectiveCamera(30, aspect, R * 0.02, R * 30);
  const target = new THREE.Vector3(0, size.y * 0.5, 0);
  // Сфераны кадрға толық сыйғызатын қашықтық (тар экранда көлденең бұрыш шешеді)
  const fit = (asp) => {
    const vf = THREE.MathUtils.degToRad(camera.fov) / 2;
    const hf = Math.atan(Math.tan(vf) * asp);
    return (R * 1.04) / Math.sin(Math.min(vf, hf));
  };
  const place = (asp, dist = fit(asp)) => {
    camera.aspect = asp;
    camera.updateProjectionMatrix();
    const ce = Math.cos(view.elev);
    camera.position.set(Math.sin(view.azim) * ce * dist, target.y + Math.sin(view.elev) * dist, Math.cos(view.azim) * ce * dist);
    camera.lookAt(target);
  };
  place(aspect);

  const dispose = () => {
    disposeObject(holder);
    shadow.geometry.dispose();
    shadow.material.map.dispose();
    shadow.material.dispose();
  };
  return { scene, camera, target, R, fit, place, dispose };
}
