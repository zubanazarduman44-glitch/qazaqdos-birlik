"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "./Store";
import { lookupLocal } from "../../lib/dict";
import { tx } from "../../lib/tx";
import { getKkVoice, fetchTtsUrl } from "../../lib/speak";

const WORD = /[\p{L}\p{M}][\p{L}\p{M}'’-]*/u;
const SKIP = "button,a,input,textarea,select,label,summary,[data-notap],svg,.wt-pop,.toasts,nav,.msg-input,.composer";
const cache = new Map();

function wordAt(x, y) {
  let node, off;
  if (document.caretPositionFromPoint) {
    const p = document.caretPositionFromPoint(x, y);
    if (p) [node, off] = [p.offsetNode, p.offset];
  } else if (document.caretRangeFromPoint) {
    const r = document.caretRangeFromPoint(x, y);
    if (r) [node, off] = [r.startContainer, r.startOffset];
  }
  if (!node || node.nodeType !== 3) return null;
  const text = node.textContent;
  let a = Math.min(off, text.length);
  let b = a;
  const isL = (c) => /[\p{L}\p{M}'’-]/u.test(c || "");
  while (a > 0 && isL(text[a - 1])) a--;
  while (b < text.length && isL(text[b])) b++;
  const w = text.slice(a, b).replace(/^[-'’]+|[-'’]+$/g, "");
  if (!w || !WORD.test(w) || w.length > 30) return null;
  const r = document.createRange();
  r.setStart(node, a);
  r.setEnd(node, b);
  // нүкте тек сөздің үстінде болса ғана
  const box = r.getBoundingClientRect();
  if (x < box.left - 4 || x > box.right + 4 || y < box.top - 4 || y > box.bottom + 4) return null;
  // сөйлем (мағына үшін)
  const ctx = text.slice(Math.max(0, a - 80), Math.min(text.length, b + 80)).replace(/\s+/g, " ").trim();
  return { w, box, ctx };
}

export default function WordTap() {
  const { lang, saveWord, state, explain } = useApp();
  const x = tx(lang);
  const [pop, setPop] = useState(null); // {w, box, data, loading, err}
  const popRef = useRef(null);
  const seq = useRef(0);

  useEffect(() => {
    function onClick(e) {
      if (popRef.current?.contains(e.target)) return;
      if (e.target.closest?.(SKIP)) return setPop(null);
      if (window.getSelection()?.toString()) return;
      const hit = wordAt(e.clientX, e.clientY);
      if (!hit) return setPop(null);
      const id = ++seq.current;
      const key = hit.w.toLowerCase();
      const local = lookupLocal(hit.w) || cache.get(key);
      if (local) return setPop({ w: hit.w, box: hit.box, data: local });
      setPop({ w: hit.w, box: hit.box, loading: true });
      fetch("/api/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ word: hit.w, context: hit.ctx }) })
        .then(async (r) => {
          const d = await r.json().catch(() => ({}));
          if (!r.ok) throw new Error(d.error || "err");
          cache.set(key, d);
          if (id === seq.current) setPop({ w: hit.w, box: hit.box, data: d });
        })
        .catch(() => id === seq.current && setPop({ w: hit.w, box: hit.box, err: true }));
    }
    const close = () => setPop(null);
    const esc = (e) => e.key === "Escape" && setPop(null);
    document.addEventListener("click", onClick);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", esc);
    };
  }, []);

  async function say(word) {
    const v = await getKkVoice();
    if (v) {
      const u = new SpeechSynthesisUtterance(word);
      u.voice = v;
      u.lang = v.lang;
      u.rate = 0.85;
      window.speechSynthesis.cancel();
      return window.speechSynthesis.speak(u);
    }
    try {
      new Audio(await fetchTtsUrl(word)).play();
    } catch {}
  }

  if (!pop) return null;
  const W = 250;
  const left = Math.max(10, Math.min(window.innerWidth - W - 10, pop.box.left + pop.box.width / 2 - W / 2));
  const below = pop.box.bottom + 150 < window.innerHeight;
  const style = { left, width: W, ...(below ? { top: pop.box.bottom + 8 } : { bottom: window.innerHeight - pop.box.top + 8 }) };
  const d = pop.data;
  const saved = d && state.vocab?.some((v) => v.kk === d.kk);
  const tr = d ? (explain === "ru" ? d.ru : d.en) : "";
  return (
    <div ref={popRef} className={`wt-pop ${below ? "dn" : "up"}`} style={style} role="dialog" aria-label={pop.w}>
      <div className="wt-head">
        <b>{pop.w}</b>
        <button className="wt-x" onClick={() => setPop(null)} aria-label="close">×</button>
      </div>
      {pop.loading && <p className="wt-load"><i /><i /><i /> {x.tapLoading}</p>}
      {pop.err && <p className="wt-err">{x.tapErr}</p>}
      {d && (
        <>
          <dl>
            <div><dt>{x.tapKk}</dt><dd>{d.kk}</dd></div>
            <div><dt>{x.tapRu}</dt><dd>{d.ru}</dd></div>
            <div><dt>{x.tapEn}</dt><dd>{d.en}</dd></div>
          </dl>
          {d.form && <p className="wt-form">{d.form}</p>}
          <div className="wt-row">
            <button className="btn small ghost" onClick={() => say(d.kk)}>🔊 {x.listen}</button>
          <button className={`btn small ${saved ? "ghost" : "gold"}`} disabled={saved} onClick={() => saveWord({ kk: d.kk, tr, e: d.e || "💬", src: "tap" })}>
            {saved ? `✓ ${x.tapSaved}` : `+ ${x.tapSave}`}
          </button>
          </div>
        </>
      )}
    </div>
  );
}
