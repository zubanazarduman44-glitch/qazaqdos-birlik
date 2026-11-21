"use client";
// Саяхат пен Тарих беттерінің жеңіл әсерлері (кітапханасыз): айналдырғанда пайда болу және тінтуірге еретін 3D еңкею.
// Барлығы тек transform / opacity арқылы; «қозғалысты азайту» қосулы болса немесе сенсорлы экранда өшеді.
import { useEffect } from "react";

export const reducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const finePointer = () =>
  typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// Айналдырғанда пайда болу: түбірге data-fx="on", [data-rv] элементтеріне көрінгенде data-rv="in".
// Бет ашылғанда экранда тұрғандары бірден "in" алады — жыпылықтамайды. SSR/JS-сіз бәрі көрінеді.
export function useReveal(ref, deps = []) {
  useEffect(() => {
    const root = ref.current;
    if (!root || reducedMotion() || typeof IntersectionObserver === "undefined") return;
    const els = [...root.querySelectorAll('[data-rv]:not([data-rv="in"])')];
    const vh = window.innerHeight || 800;
    const later = [];
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) el.setAttribute("data-rv", "in");
      else later.push(el);
    }
    root.setAttribute("data-fx", "on");
    if (!later.length) return;
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-rv", "in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );
    later.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// 3D еңкею: [data-tilt] элементтеріне --rx/--ry (градус) және --mx/--my (-1…1) айнымалылары беріледі.
// Тек тінтуір/қалам; бір кадрға бір есептеу (rAF); React қайта салынбайды.
export function useTilt(ref, max = 7) {
  useEffect(() => {
    const root = ref.current;
    if (!root || reducedMotion() || !finePointer()) return;
    let cur = null;
    let raf = 0;
    let px = 0;
    let py = 0;
    const VARS = ["--rx", "--ry", "--mx", "--my"];
    const reset = (el) => {
      VARS.forEach((v) => el.style.removeProperty(v));
      el.removeAttribute("data-tilting");
    };
    const apply = () => {
      raf = 0;
      if (!cur || !cur.isConnected) return;
      const r = cur.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const nx = Math.max(-1, Math.min(1, ((px - r.left) / r.width) * 2 - 1));
      const ny = Math.max(-1, Math.min(1, ((py - r.top) / r.height) * 2 - 1));
      const m = Number(cur.getAttribute("data-tilt")) || max;
      cur.style.setProperty("--rx", `${(-ny * m).toFixed(2)}deg`);
      cur.style.setProperty("--ry", `${(nx * m).toFixed(2)}deg`);
      cur.style.setProperty("--mx", nx.toFixed(3));
      cur.style.setProperty("--my", ny.toFixed(3));
    };
    const move = (e) => {
      if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      const t = e.target && e.target.closest ? e.target.closest("[data-tilt]") : null;
      const el = t && root.contains(t) ? t : null;
      if (el !== cur) {
        if (cur) reset(cur);
        cur = el;
        if (cur) cur.setAttribute("data-tilting", "");
      }
      px = e.clientX;
      py = e.clientY;
      if (cur && !raf) raf = requestAnimationFrame(apply);
    };
    const leave = () => {
      if (cur) reset(cur);
      cur = null;
    };
    root.addEventListener("pointermove", move, { passive: true });
    root.addEventListener("pointerleave", leave);
    return () => {
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", leave);
      if (raf) cancelAnimationFrame(raf);
      if (cur) reset(cur);
    };
  }, [ref, max]);
}
