"use client";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../../components/Store";
import Alash from "../../components/Alash";
import Icon from "../../components/Icon";

// Қарапайым форматтау: **жуан** және жаңа жол (HTML енгізілмейді)
function Rich({ text }) {
  return text.split("\n").map((line, i) => (
    <p key={i}>
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? <b key={j}>{part.slice(2, -2)}</b> : <span key={j}>{part.replace(/^\s*[-*]\s+/, "• ")}</span>
      )}
    </p>
  ));
}

export default function Chat() {
  const { t, state, update, explain, award, lvl } = useApp();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
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
        body: JSON.stringify({ messages: next.slice(-16), explain, name: state.profile.name, level: `level ${lvl.level}` }),
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

  return (
    <div className="chat-page">
      <section className="card chat">
        <header className="chat-head">
          <Alash mood={busy ? "think" : "happy"} size={58} />
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
              <Alash size={34} />
            </span>
            <div className="msg-b">{t.chatHi}</div>
          </div>
          {msgs.map((m, i) => (
            <div key={i} className={`msg ${m.role === "user" ? "me" : "bot"} rise`}>
              {m.role !== "user" && (
                <span className="msg-av">
                  <Alash size={34} />
                </span>
              )}
              <div className="msg-b">{m.role === "user" ? m.text : <Rich text={m.text} />}</div>
            </div>
          ))}
          {busy && (
            <div className="msg bot">
              <span className="msg-av">
                <Alash mood="think" size={34} />
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
          <button className="btn blue" disabled={busy || !text.trim()} aria-label={t.send}>
            <Icon name="send" size={18} />
          </button>
        </form>
      </section>
    </div>
  );
}
