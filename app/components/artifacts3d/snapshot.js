// Карточкалар үшін статикалық сурет: ортақ рендерерде бір рет салып, dataURL ретінде сақтау.
// Нәтиже IndexedDB-де кэштеледі — келесі ашылуда three.js жүктелмей-ақ шығады (cache.js).
import { getRenderer, acquire, buildStage } from "./stage.js";
import { storeShot, shotKey } from "./cache.js";

const mem = new Map();
const queue = [];
let running = false;

const idle = () =>
  new Promise((r) => (typeof requestIdleCallback === "function" ? requestIdleCallback(() => r(), { timeout: 700 }) : setTimeout(r, 30)));

async function render(modelId, size) {
  const release = await acquire();
  let st = null;
  try {
    const r = getRenderer();
    st = await buildStage(modelId, { quality: 0.5, aspect: 1 });
    r.setPixelRatio(1);
    r.setSize(size, size, false);
    r.render(st.scene, st.camera);
    let url = r.domElement.toDataURL("image/webp", 0.86);
    if (!url.startsWith("data:image/webp")) url = r.domElement.toDataURL("image/png");
    return url;
  } finally {
    if (st) st.dispose();
    release();
  }
}

async function pump() {
  if (running) return;
  running = true;
  while (queue.length) {
    await idle(); // басты ағынды бұғаттамау үшін әр суреттің арасында үзіліс
    const job = queue.shift();
    if (!job) break;
    try {
      const url = await render(job.id, job.size);
      mem.set(job.key, url);
      storeShot(job.key, url);
      job.resolve(url);
    } catch (e) {
      job.reject(e);
    }
  }
  running = false;
}

// Жәдігердің суретін алу (жад → кезек). priority: true — кезектің басына.
export function snapshot(id, { size = 512, priority = false } = {}) {
  const key = shotKey(id, size);
  if (mem.has(key)) return Promise.resolve(mem.get(key));
  const pending = queue.find((j) => j.key === key);
  if (pending) {
    if (priority) {
      queue.splice(queue.indexOf(pending), 1);
      queue.unshift(pending);
    }
    return pending.promise;
  }
  let resolve, reject;
  const promise = new Promise((a, b) => {
    resolve = a;
    reject = b;
  });
  const job = { id, size, key, resolve, reject, promise };
  if (priority) queue.unshift(job);
  else queue.push(job);
  pump();
  return promise;
}
