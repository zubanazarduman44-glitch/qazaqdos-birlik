"use client";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../../components/Store";
import Qyran from "../../components/Qyran";
import Icon from "../../components/Icon";
import { toWav } from "../../../lib/audio";

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
  const { t, state, update, explain, award, lvl } = useApp();
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
          {msgs.map((m, i) => (
            <div key={i} className={`msg ${m.role === "user" ? "me" : "bot"} rise`}>
              {m.role !== "user" && (
                <span className="msg-av">
                  <Qyran size={34} />
                </span>
              )}
              <div className="msg-b">{m.role === "user" ? m.text : <Rich text={m.text} />}</div>
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

        {msgs.length === 0 && (
          <div className="suggest">
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
