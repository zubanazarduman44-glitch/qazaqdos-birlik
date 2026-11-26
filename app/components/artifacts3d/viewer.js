// Интерактив 3D көрермен: OrbitControls (инерциямен), баяу авто-айналу, масштаб, бастапқы көрініс.
// Ортақ рендерерді уақытша алады; жабылғанда модельдің барлық ресурсы тазаланып, контекст босайды.
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { getRenderer, acquire, buildStage } from "./stage.js";

const MAX_DPR = 2;

export async function createViewer(host, modelId, { autoRotate = true, onAutoChange } = {}) {
  const release = await acquire();
  let st = null;
  let disposed = false;
  let raf = 0;
  let ro = null;
  let controls = null;
  let renderer = null;
  let dirty = true;
  const cleanups = [];

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(raf);
    if (ro) ro.disconnect();
    cleanups.forEach((f) => f());
    if (controls) controls.dispose();
    if (st) st.dispose();
    if (renderer && renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    if (renderer) renderer.renderLists.dispose();
    release();
  };

  try {
    // Жүктелу белгісі экранға шығып үлгеруі үшін бір кадр күтеміз (модель құрастыру ауыр)
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
    if (disposed) return null;
    renderer = getRenderer();
    const rect = host.getBoundingClientRect();
    const w = Math.max(1, rect.width), h = Math.max(1, rect.height);
    // Тар экранда текстураларды сәл кішірейтеміз — ашылуы жылдамырақ
    const quality = Math.min(window.innerWidth, window.innerHeight) < 700 ? 0.75 : 1;
    st = await buildStage(modelId, { quality, aspect: w / h });
    if (disposed) return null;
    const { scene, camera, target, R, fit, place } = st;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
    renderer.setSize(w, h);
    const canvas = renderer.domElement;
    canvas.style.touchAction = "none";
    host.appendChild(canvas);

    controls = new OrbitControls(camera, canvas);
    controls.target.copy(target);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 0.9;
    controls.minDistance = R * 1.15;
    controls.maxDistance = fit(w / h) * 2.2;
    controls.minPolarAngle = 0.12;
    controls.maxPolarAngle = Math.PI * 0.58;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.1;
    controls.update();
    controls.saveState();

    const setAuto = (v) => {
      if (!controls || controls.autoRotate === v) return;
      controls.autoRotate = v;
      dirty = true;
      if (onAutoChange) onAutoChange(v);
    };
    // Қолданушы ұстаған сәттен авто-айналу тоқтайды
    const onStart = () => setAuto(false);
    controls.addEventListener("start", onStart);
    const onChange = () => { dirty = true; };
    controls.addEventListener("change", onChange);
    cleanups.push(() => {
      controls.removeEventListener("start", onStart);
      controls.removeEventListener("change", onChange);
    });

    let last = performance.now();
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const moved = controls.update(dt);
      if (moved || dirty) {
        renderer.render(scene, camera);
        dirty = false;
      }
    };
    raf = requestAnimationFrame(loop);

    ro = new ResizeObserver(() => {
      const r = host.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      renderer.setSize(r.width, r.height);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
      controls.maxDistance = fit(camera.aspect) * 2.2;
      dirty = true;
    });
    ro.observe(host);

    const dist = () => camera.position.distanceTo(controls.target);
    const setDist = (d) => {
      const v = camera.position.clone().sub(controls.target);
      v.setLength(THREE.MathUtils.clamp(d, controls.minDistance, controls.maxDistance));
      camera.position.copy(controls.target).add(v);
      dirty = true;
    };
    const sph = new THREE.Spherical();
    const orbit = (dTheta, dPhi) => {
      setAuto(false);
      const v = camera.position.clone().sub(controls.target);
      sph.setFromVector3(v);
      sph.theta += dTheta;
      sph.phi = THREE.MathUtils.clamp(sph.phi + dPhi, controls.minPolarAngle, controls.maxPolarAngle);
      v.setFromSpherical(sph);
      camera.position.copy(controls.target).add(v);
      dirty = true;
    };

    return {
      zoom: (f) => setDist(dist() * f),
      reset: () => {
        controls.reset();
        place(camera.aspect);
        controls.target.copy(target);
        controls.update();
        dirty = true;
      },
      orbit,
      setAuto,
      dispose,
    };
  } catch (e) {
    dispose();
    throw e;
  }
}
