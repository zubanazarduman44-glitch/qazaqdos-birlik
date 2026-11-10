"use client";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../../components/Store";
import Alash from "../../components/Alash";
import Icon from "../../components/Icon";

// Суретті кішірейтеміз (1024 px, JPEG) — жылдам жіберу үшін
function shrink(src, max = 1024) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

export default function Vision() {
  const { t, explain, state, update, award, saveWord } = useApp();
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

  return (
    <div className="vision">
      <header className="page-head">
        <div>
          <span className="kicker">AI · Vision</span>
          <h1>{t.visionTitle}</h1>
          <p>{t.visionSub}</p>
        </div>
      </header>

      <div className="grid g2 vision-grid">
        <section className="card cam">
          <div className="viewfinder">
            {cam ? (
              <video ref={videoRef} playsInline muted />
            ) : shot ? (
              <img src={shot} alt="" />
            ) : (
              <div className="vf-empty">
                <Alash mood="wow" size={110} />
              </div>
            )}
            <span className="vf-c tl" />
            <span className="vf-c tr" />
            <span className="vf-c bl" />
            <span className="vf-c br" />
            {busy && (
              <div className="vf-scan">
                <span className="vf-beam" />
                <b>{t.analyzing}</b>
              </div>
            )}
          </div>
          <div className="cam-btns">
            {cam ? (
              <button className="btn gold big" onClick={snap}>
                <Icon name="camera" size={20} /> {t.snap}
              </button>
            ) : (
              <button className="btn blue big" onClick={startCam} disabled={busy}>
                <Icon name="camera" size={20} /> {t.cameraOn}
              </button>
            )}
            <button className="btn ghost big" onClick={() => fileRef.current?.click()} disabled={busy}>
              <Icon name="upload" size={20} /> {t.upload}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          </div>
          <p className="muted small privacy">
            <Icon name="lock" size={14} /> {t.privacy}
          </p>
        </section>

        <section className="card vres">
          {err && <p className="alert">{err}</p>}
          {res ? (
            res.found ? (
              <div className="vword pop">
                <span className="vword-e">{res.emoji}</span>
                <h2>{res.kk}</h2>
                {res.translit && <span className="muted">[{res.translit}]</span>}
                <span className="vword-tr">{res.translation}</span>
                {res.category && <span className="chip">{res.category}</span>}
                <div className="vex">
                  <span className="badge">{t.example}</span>
                  <b>{res.example_kk}</b>
                  <span className="muted">{res.example_tr}</span>
                </div>
                {res.tip && (
                  <div className="fact">
                    <Alash mood="idle" size={44} />
                    <p>{res.tip}</p>
                  </div>
                )}
                <button className="btn gold" onClick={keep} disabled={inCol}>
                  <Icon name={inCol ? "check" : "plus"} size={18} /> {inCol ? t.saved : t.saveWord}
                </button>
              </div>
            ) : (
              <div className="vword">
                <Alash mood="support" size={100} />
                <p>{res.translation}</p>
              </div>
            )
          ) : (
            <div className="vword muted">
              <Alash mood={busy ? "think" : "idle"} size={100} />
              <p>{busy ? t.analyzing : t.visionSub}</p>
            </div>
          )}
        </section>
      </div>

      <section className="collection">
        <h2>
          📦 {t.collection} <span className="muted small">{t.found(state.vision?.length || 0)}</span>
        </h2>
        {state.vision?.length ? (
          <div className="col-grid">
            {state.vision.map((v) => (
              <div key={v.kk} className="card tight col-item" title={v.ex}>
                <span>{v.e}</span>
                <b>{v.kk}</b>
                <small className="muted">{v.tr}</small>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">—</p>
        )}
      </section>
    </div>
  );
}
