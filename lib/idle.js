// Бет жүктеліп болған соң (браузер бос кезде) ауыр модульді алдын ала жүктеу.
// Пайдаланушы батырманы басқанда чанк дайын тұрады, ал бірінші жүктеу жеңіл қалады.
export function whenIdle(fn, timeout = 3000) {
  if (typeof window === "undefined") return () => {};
  const run = () => {
    try {
      const p = fn();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch {}
  };
  if (window.requestIdleCallback) {
    const id = window.requestIdleCallback(run, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(run, 1200);
  return () => clearTimeout(id);
}
