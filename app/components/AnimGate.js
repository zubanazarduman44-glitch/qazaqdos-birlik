"use client";
// Экраннан тыс суреттердің шексіз CSS-анимацияларын тоқтату (бұлт, ұшқын, толқын, жұлдыз, жалын…).
// useAnimGate(ref) — үлкен анимациялы контейнерге: экраннан шыққанда (±100px) data-offscreen қойылады,
// app/anim.css ішіндегі ереже оның өзі мен ішіндегі барлық анимацияны кідіртеді. Экранда — ештеңе өзгермейді.
// Бет (вкладка) жасырын болса, <html data-tab-hidden> — бүкіл беттегі анимация кідіреді.
import { useCallback } from "react";

let io = null;
let tabHooked = false;
const outside = new WeakSet(); // қазір экраннан тыс элементтер

// Бір реттік (шексіз емес) анимациялар — мыс. кіру анимациясы (hm-in, ldUp) — әлі жүріп жатса,
// олар аяқталғанша күтеміз: кідіртпейміз, сонда беттің көрінісі бұрынғыдай қалады.
function finiteRunning(el) {
  if (!el.getAnimations) return [];
  return el.getAnimations({ subtree: true }).filter((a) => a.playState === "running" && a.effect?.getComputedTiming?.().iterations !== Infinity);
}
function markOff(el) {
  if (!outside.has(el)) return;
  const busy = finiteRunning(el);
  if (busy.length) Promise.all(busy.map((a) => a.finished.catch(() => {}))).then(() => markOff(el));
  else el.setAttribute("data-offscreen", "");
}

function observer() {
  if (io || typeof IntersectionObserver === "undefined") return io;
  io = new IntersectionObserver(
    (es) => {
      for (const e of es) {
        if (e.isIntersecting) {
          outside.delete(e.target);
          e.target.removeAttribute("data-offscreen");
        } else {
          outside.add(e.target);
          markOff(e.target);
        }
      }
    },
    { rootMargin: "100px" }
  );
  return io;
}

function hookTab() {
  if (tabHooked || typeof document === "undefined") return;
  tabHooked = true;
  const sync = () => {
    if (document.visibilityState === "hidden") document.documentElement.setAttribute("data-tab-hidden", "");
    else document.documentElement.removeAttribute("data-tab-hidden");
  };
  document.addEventListener("visibilitychange", sync);
  sync();
}

// Императив нұсқа: бар эффект ішінен шақыруға болады. Тазалау функциясын қайтарады.
export function animGate(el) {
  hookTab();
  const o = el && observer();
  if (!o) return () => {};
  o.observe(el);
  return () => {
    o.unobserve(el);
    outside.delete(el);
    el.removeAttribute("data-offscreen");
  };
}

// Callback-ref қайтарады: ref={useAnimGate()}. Элемент кейін пайда болса да (шартты рендер) бақыланады.
// Контейнерде өз useRef-і болса, соны береміз: useAnimGate(wrap) — wrap.current та қойылады.
export function useAnimGate(ref) {
  return useCallback(
    (el) => {
      if (ref) ref.current = el;
      if (!el) return;
      const off = animGate(el);
      return () => {
        off();
        if (ref) ref.current = null;
      };
    },
    [ref]
  );
}
