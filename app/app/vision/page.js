"use client";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../../components/Store";
import Icon from "../../components/Icon";
import { tx } from "../../../lib/tx";
import { getKkVoice, fetchTtsUrl } from "../../../lib/speak";

// Суретті кішірейтеміз (640 px, JPEG) — жылдам жіберу үшін
function shrink(src, max = 640) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

export default function Vision() {
  const { t, lang, explain, state, update, award, saveWord } = useApp();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileRef = useRef(null);
  const [cam, setCam] = useState(false);
  const [shot, setShot] = useState(null);
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => () => streamRef.current?.getTracks().forEach((tr) => tr.stop()), []);

  async function startCam() {
    setErr("");
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 1280 } }, audio: false });
      streamRef.current = s;
      setCam(true);
      setShot(null);
      setRes(null);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play().catch(() => {});
        }
      }, 30);
    } catch {
      setErr(t.camDenied);
    }
  }
  function stopCam() {
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    setCam(false);
  }
  async function snap() {
    const v = videoRef.current;
    if (!v) return;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d").drawImage(v, 0, 0);
    stopCam();
    analyze(await shrink(c.toDataURL("image/jpeg", 0.9)));
  }
  function onFile(f) {
    if (!f) return;
    const r = new FileReader();
    r.onload = async () => analyze(await shrink(r.result));
    r.readAsDataURL(f);
  }
  async function analyze(img) {
    setShot(img);
    setRes(null);
    setErr("");
    setBusy(true);
    try {
      const r = await fetch("/api/vision", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: img, explain }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
      setRes(d);
    } catch (e) {
      setErr(e.message || t.errGeneric);
    } finally {
      setBusy(false);
    }
  }
  const inCol = res?.kk && state.vision?.some((v) => v.kk === res.kk);
  function keep() {
    if (!res?.found || inCol) return;
    const item = { kk: res.kk, tr: res.translation, e: res.emoji || "📦", ex: res.example_kk, at: Date.now() };
    update((s) => ({ ...s, vision: [item, ...(s.vision || [])].slice(0, 200) }));
    saveWord({ kk: res.kk, tr: res.translation, e: res.emoji, src: "vision" });
    award(5, 3);
  }

  const x = tx(lang);
  async function say(w) {
    const v = await getKkVoice();
    if (v) {
      const u = new SpeechSynthesisUtterance(w);
      u.voice = v;
      u.lang = v.lang;
      u.rate = 0.85;
      window.speechSynthesis.cancel();
      return window.speechSynthesis.speak(u);
    }
    try {
      new Audio(await fetchTtsUrl(w)).play();
    } catch {}
  }

  return (
    <div className="vision v2">
      <header className="page-head">
        <div>
          <span className="kicker">AI · Vision</span>
          <h1>{x.vTitle}</h1>
          <p>{x.vHint}</p>
        </div>
        <span className="chip gold">📦 {state.vision?.length || 0}</span>
      </header>

      <div className="v2-grid">
        <section className="scanner">
          <div className={`v2-frame ${busy ? "busy" : ""} ${res?.found ? "ok" : ""}`}>
            {cam ? <video ref={videoRef} playsInline muted /> : shot ? <img src={shot} alt="" /> : (
              <div className="v2-empty">
                <span className="v2-ico" aria-hidden="true">📷</span>
                <p>{x.vHint}</p>
              </div>
            )}
            <i className="c tl" /><i className="c tr" /><i className="c bl" /><i className="c br" />
            <span className="v2-grid-lines" />
            {busy && <span className="v2-beam" />}
            {busy && <b className="v2-status">{t.analyzing}</b>}
            {res?.found && !busy && <span className="v2-tag pop">{res.emoji} {res.kk}</span>}
          </div>
          <div className="v2-bar">
            <button className="v2-side" onClick={() => fileRef.current?.click()} disabled={busy} aria-label={x.vGallery}>
              <Icon name="upload" size={22} />
              <small>{x.vGallery}</small>
            </button>
            {cam ? (
              <button className="v2-shutter" onClick={snap} aria-label={x.vShot}><i /></button>
            ) : (
              <button className="v2-shutter idle" onClick={startCam} disabled={busy} aria-label={x.vCamera}><Icon name="camera" size={28} /></button>
            )}
            <button className="v2-side" onClick={() => (cam ? stopCam() : (setShot(null), setRes(null), startCam()))} disabled={busy} aria-label={x.vRetake}>
              <Icon name="refresh" size={22} />
              <small>{cam ? "✕" : x.vRetake}</small>
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          </div>
          <p className="muted small privacy"><Icon name="lock" size={14} /> {t.privacy}</p>
        </section>

        <section className="v2-res">
          {err && <p className="alert">{err}</p>}
          {res?.found ? (
            <div className="v2-card pop">
              <span className="badge">{x.vResultTitle}</span>
              <div className="v2-word">
                <span className="v2-e">{res.emoji}</span>
                <div>
                  <h2>{res.kk}</h2>
                  {res.translit && <span className="muted">[{res.translit}]</span>}
                </div>
                <button className="v2-say" onClick={() => say(res.kk)} aria-label="listen"><Icon name="volume" size={20} /></button>
              </div>
              <div className="v2-tr">{res.translation}</div>
              <div className="v2-ex">
                <small>{t.example}</small>
                <b>{res.example_kk}</b>
                <span className="muted">{res.example_tr}</span>
              </div>
              {res.tip && <p className="v2-tip">💡 {res.tip}</p>}
              <button className="btn gold big" onClick={keep} disabled={inCol}>
                <Icon name={inCol ? "check" : "plus"} size={18} /> {inCol ? t.saved : t.saveWord}
              </button>
            </div>
          ) : res ? (
            <div className="v2-card"><p>{res.translation}</p></div>
          ) : (
            <div className="v2-card idle">
              <p>{busy ? t.analyzing : x.vHint}</p>
            </div>
          )}
        </section>
      </div>

      <section className="collection">
        <h2>📦 {t.collection} <span className="muted small">{t.found(state.vision?.length || 0)}</span></h2>
        {state.vision?.length ? (
          <div className="v2-col">
            {state.vision.map((v) => (
              <button key={v.kk} className="v2-chip" onClick={() => say(v.kk)} title={v.ex}>
                <span>{v.e}</span>
                <b>{v.kk}</b>
                <small>{v.tr}</small>
              </button>
            ))}
          </div>
        ) : (
          <p className="muted">—</p>
        )}
      </section>
    </div>
  );
}
