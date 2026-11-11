"use client";
import { useEffect, useRef, useState } from "react";
import { NatEmpty } from "../../components/NatArt";
import { useApp } from "../../components/Store";
import Qyran from "../../components/Qyran";
import Icon from "../../components/Icon";
import { toWav } from "../../../lib/audio";
import { sayKk } from "../../../lib/speak";
import { tx } from "../../../lib/tx";

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

const VQ = {
  kk: "Мына суреттегі зат қазақша қалай аталады?",
  ru: "Как по-казахски называется предмет на фото?",
  en: "What is the object in this photo called in Kazakh?",
};
const VL = {
  kk: { photo: "Сурет", cam: "Суретпен сұрау", close: "Жабу", none: "Суреттен таныс зат таба алмадым. Басқа бұрыштан түсіріп көр.", gone: "Сурет сақталмайды" },
  ru: { photo: "Фото", cam: "Спросить по фото", close: "Закрыть", none: "Не нашёл знакомый предмет на фото. Попробуйте снять с другого ракурса.", gone: "Фото не сохраняется" },
  en: { photo: "Photo", cam: "Ask with a photo", close: "Close", none: "I couldn't find a known object in the photo. Try another angle.", gone: "Photos aren't stored" },
};

// Aqyl Vision жауабы — чаттағы сөз картасы
function VisionCard({ v, t, saved, onSave }) {
  return (
    <div className="vz-card">
      <div className="vz-top">
        <div>
          <b className="vz-kk" lang="kk">{v.kk}</b>
          {v.translit && <span className="vz-tl">[{v.translit}]</span>}
        </div>
        <button type="button" className="vz-say" onClick={() => sayKk(v.kk)} aria-label="listen"><Icon name="volume" size={18} /></button>
      </div>
      <div className="vz-tr">{v.translation}</div>
      {v.example_kk && (
        <div className="vz-ex">
          <small>{t.example}</small>
          <b lang="kk">{v.example_kk}</b>
          {v.example_tr && <span>{v.example_tr}</span>}
        </div>
      )}
      {v.tip && <p className="vz-tip">{v.tip}</p>}
      <button type="button" className={`vz-save ${saved ? "on" : ""}`} onClick={onSave} disabled={saved}>
        <Icon name={saved ? "check" : "plus"} size={16} /> {saved ? t.saved : t.saveWord}
      </button>
    </div>
  );
}

// Қауіпсіз форматтау (HTML енгізілмейді): **жуан**, *көлбеу*, `код`, ### тақырып, тізімдер, кесте
function inline(str) {
  return str.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) return <b key={i}>{part.slice(2, -2)}</b>;
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <i key={i}>{part.slice(1, -1)}</i>;
    return <span key={i}>{part}</span>;
  });
}
const cells = (row) => row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
const isSep = (row) => /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(row) && row.includes("-");

function Rich({ text }) {
  const lines = String(text).replace(/\r/g, "").split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
    } else if (line.trim().startsWith("|") && i + 1 < lines.length && isSep(lines[i + 1])) {
      const head = cells(line);
      const rows = [];
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(cells(lines[i++]));
      out.push(
        <div className="tbl" key={out.length}>
          <table>
            <thead>
              <tr>{head.map((c, k) => <th key={k}>{inline(c)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, k) => (
                <tr key={k}>{r.map((c, m) => <td key={m}>{inline(c)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (/^\s{0,3}#{1,4}\s+/.test(line)) {
      out.push(<h4 key={out.length}>{inline(line.replace(/^\s*#{1,4}\s+/, ""))}</h4>);
      i++;
    } else if (/^\s*[-*•]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*•]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*•]\s+/, ""));
      out.push(<ul key={out.length}>{items.map((it, k) => <li key={k}>{inline(it)}</li>)}</ul>);
    } else if (/^\s*\d+[.)]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*\d+[.)]\s+/, ""));
      out.push(<ol key={out.length}>{items.map((it, k) => <li key={k}>{inline(it)}</li>)}</ol>);
    } else {
      out.push(<p key={out.length}>{inline(line)}</p>);
      i++;
    }
  }
  return out;
}

export default function Chat() {
  const { t, lang, state, update, explain, award, lvl, saveWord } = useApp();
  const x = tx(lang);
  const vl = VL[lang] || VL.en;
  const [cam, setCam] = useState(false);
  const [imgs, setImgs] = useState({}); // id → суреттің өзі (тек осы сессияда, сақталмайды)
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileRef = useRef(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [rec, setRec] = useState(null); // null | "rec" | "busy"
  const recRef = useRef(null);
  const listRef = useRef(null);
  const msgs = state.chat || [];

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs.length, busy]);

  async function send(q) {
    const msg = (q ?? text).trim();
    if (!msg || busy) return;
    setText("");
    setErr("");
    const next = [...msgs, { role: "user", text: msg }];
    update((s) => ({ ...s, chat: next.slice(-40) }));
    setBusy(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-20), explain, name: state.profile.name, level: state.cefr ? `${state.cefr} (CEFR)` : `level ${lvl.level}` }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
      update((s) => ({ ...s, chat: [...(s.chat || []), { role: "assistant", text: d.text }].slice(-40) }));
      award(2, 1);
    } catch (e) {
      setErr(e.message || t.errGeneric);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => () => streamRef.current?.getTracks().forEach((k) => k.stop()), []);
  function stopCam() {
    streamRef.current?.getTracks().forEach((k) => k.stop());
    streamRef.current = null;
    setCam(false);
  }
  async function openCam() {
    if (busy) return;
    setErr("");
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("no cam");
      const st = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 1280 } }, audio: false });
      streamRef.current = st;
      setCam(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = st;
          videoRef.current.play().catch(() => {});
        }
      }, 30);
    } catch {
      // Камера жоқ не рұқсат жоқ — бірден галереядан таңдатамыз
      fileRef.current?.click();
    }
  }
  async function snap() {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d").drawImage(v, 0, 0);
    stopCam();
    ask(await shrink(c.toDataURL("image/jpeg", 0.9)));
  }
  function onFile(f) {
    if (!f) return;
    stopCam();
    const r = new FileReader();
    r.onload = async () => ask(await shrink(r.result));
    r.readAsDataURL(f);
  }
  async function ask(img) {
    if (busy) return;
    const id = Date.now();
    setImgs((m) => ({ ...m, [id]: img }));
    setErr("");
    update((s) => ({ ...s, chat: [...(s.chat || []), { role: "user", kind: "photo", id, text: VQ[lang] || VQ.en }].slice(-40) }));
    setBusy(true);
    try {
      const r = await fetch("/api/vision", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: img, explain }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
      const text = d.found ? `${d.kk} — ${d.translation}.${d.example_kk ? ` ${d.example_kk}` : ""}` : d.translation || vl.none;
      const v = d.found ? { kk: d.kk, translit: d.translit, translation: d.translation, example_kk: d.example_kk, example_tr: d.example_tr, tip: d.tip } : null;
      update((s) => ({ ...s, chat: [...(s.chat || []), { role: "assistant", kind: v ? "vision" : undefined, v, text }].slice(-40) }));
      award(2, 1);
    } catch (e) {
      setErr(e.message || t.errGeneric);
    } finally {
      setBusy(false);
    }
  }
  function keep(v) {
    if (state.vision?.some((z) => z.kk === v.kk)) return;
    update((s) => ({ ...s, vision: [{ kk: v.kk, tr: v.translation, ex: v.example_kk, at: Date.now() }, ...(s.vision || [])].slice(0, 200) }));
    saveWord({ kk: v.kk, tr: v.translation, src: "vision" });
    award(5, 3);
  }

  async function mic() {
    if (rec === "rec") return recRef.current?.stop();
    if (rec) return;
    setErr("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") return setErr("Mic not supported");
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      return setErr("Mic denied");
    }
    const chunks = [];
    const r = new MediaRecorder(stream);
    recRef.current = r;
    r.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    r.onstop = async () => {
      stream.getTracks().forEach((x) => x.stop());
      setRec("busy");
      try {
        const audio = await toWav(new Blob(chunks, { type: r.mimeType || "audio/webm" }));
        const res = await fetch("/api/transcribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ audio }) });
        const d = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(d.error || `HTTP ${res.status}`);
        if (d.text) send(d.text);
      } catch (e) {
        setErr(e.message || t.errGeneric);
      } finally {
        setRec(null);
      }
    };
    r.start();
    setRec("rec");
    setTimeout(() => r.state === "recording" && r.stop(), 20000);
  }

  return (
    <div className="chat-page">
      <section className="card chat">
        <header className="chat-head">
          <Qyran mood={busy ? "think" : "happy"} size={58} />
          <div>
            <h1>{t.chatTitle}</h1>
            <p className="muted small">{t.chatSub}</p>
          </div>
          {msgs.length > 0 && (
            <button className="icon-btn" title={t.chatClear} aria-label={t.chatClear} onClick={() => update((s) => ({ ...s, chat: [] }))}>
              <Icon name="refresh" size={18} />
            </button>
          )}
        </header>

        <div className="chat-list" ref={listRef}>
          <div className="msg bot">
            <span className="msg-av">
              <Qyran size={34} />
            </span>
            <div className="msg-b">{t.chatHi}</div>
          </div>
          {msgs.length === 0 && <div className="chat-empty"><NatEmpty art="dombyra" size={150} lang={lang} proverb /></div>}
          {msgs.map((m, i) => (
            <div key={i} className={`msg ${m.role === "user" ? "me" : "bot"} rise`}>
              {m.role !== "user" && (
                <span className="msg-av">
                  <Qyran size={34} />
                </span>
              )}
              {m.kind === "photo" ? (
                <div className="msg-b msg-photo">
                  {imgs[m.id] ? <img src={imgs[m.id]} alt={vl.photo} /> : <span className="vz-gone"><Icon name="camera" size={18} /> {vl.gone}</span>}
                  <span>{m.text}</span>
                </div>
              ) : m.kind === "vision" && m.v ? (
                <div className="msg-b msg-vision"><VisionCard v={m.v} t={t} saved={!!state.vision?.some((z) => z.kk === m.v.kk)} onSave={() => keep(m.v)} /></div>
              ) : (
                <div className="msg-b">{m.role === "user" ? m.text : <Rich text={m.text} />}</div>
              )}
            </div>
          ))}
          {busy && (
            <div className="msg bot">
              <span className="msg-av">
                <Qyran mood="think" size={34} />
              </span>
              <div className="msg-b typing">
                <i />
                <i />
                <i />
              </div>
            </div>
          )}
          {err && <p className="alert">{err}</p>}
        </div>

        {cam && (
          <div className="vz-sheet" role="dialog" aria-label={x.vTitle}>
            <div className="vz-view">
              <video ref={videoRef} playsInline muted />
              <i className="c tl" /><i className="c tr" /><i className="c bl" /><i className="c br" />
              <span className="vz-hint">{x.vHint}</span>
            </div>
            <div className="vz-bar">
              <button type="button" className="vz-side" onClick={() => fileRef.current?.click()} aria-label={x.vGallery}><Icon name="upload" size={20} /><small>{x.vGallery}</small></button>
              <button type="button" className="vz-shutter" onClick={snap} aria-label={x.vShot}><i /></button>
              <button type="button" className="vz-side" onClick={stopCam} aria-label={vl.close}><Icon name="x" size={20} /><small>{vl.close}</small></button>
            </div>
            <p className="vz-privacy"><Icon name="lock" size={13} /> {t.privacy}</p>
          </div>
        )}

        {msgs.length === 0 && !cam && (
          <div className="suggest">
            <button className="chip vz-chip" onClick={openCam}><Icon name="camera" size={15} /> {vl.cam}</button>
            {t.chatSuggest.map((s) => (
              <button key={s} className="chip" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          className="composer"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <textarea
            className="input"
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={t.chatPh}
            maxLength={1500}
          />
          <button type="button" className={`btn ghost mic-mini ${cam ? "on" : ""}`} onClick={() => (cam ? stopCam() : openCam())} disabled={busy} aria-label={vl.cam} title={vl.cam}>
            <Icon name="camera" size={18} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
          <button type="button" className={`btn ghost mic-mini ${rec === "rec" ? "on" : ""}`} onClick={mic} disabled={busy || rec === "busy"} aria-label="mic">
            <Icon name={rec === "rec" ? "stop" : "mic"} size={18} />
          </button>
          <button className="btn blue" disabled={busy || !text.trim()} aria-label={t.send}>
            <Icon name="send" size={18} />
          </button>
        </form>
      </section>
    </div>
  );
}
