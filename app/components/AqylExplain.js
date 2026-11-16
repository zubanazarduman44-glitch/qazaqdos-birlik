"use client";
// Aqyl мұғалім ретінде: сөзді/сөйлемді түсіндіреді және қате жауаптың себебін айтады.
// Алдымен — статикалық ереже (үндестік, жалғау, ерекше әріптер, сұраулық шылау…), қажет болса — ЖИ (/api/aqyl), нәтиже кэштеледі.
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { AqylSays } from "./Aqyl";
import { aqylL } from "./AqylL10n";
import { sayKk } from "../../lib/speak";

/* ══════════ Статикалық талдау ══════════ */
const VOWELS = "аәеиоөуұүыіэюяё";
const VOICELESS = "кқпстфхцчшщ";
const SPECIAL = "әғқңөұүһі";
const lower = (s) => String(s || "").toLocaleLowerCase("kk");

/** Үндестік: соңғы айқын дауысты бойынша — "back" (жуан) | "front" (жіңішке) | null */
export function harmony(word) {
  const w = lower(word);
  for (let i = w.length - 1; i >= 0; i--) {
    if ("аоұыяё".includes(w[i])) return "back";
    if ("әеөүіэ".includes(w[i])) return "front";
  }
  if (/и/.test(w)) return "front";
  if (/у/.test(w)) return /[кгә]/.test(w) ? "front" : "back";
  return null;
}

// Тек зат есім тақырыптарында көпше/септік түрін көрсетеміз
const NOUN_TOPICS = new Set(["family", "animals", "home", "body", "clothes", "food", "school", "city", "transport", "jobs", "nature", "tech"]);

/** Зат есімнің көпше, барыс, жатыс түрлері (бір сөз үшін) */
export function nounForms(word) {
  const w = String(word || "").trim();
  if (!/^[Ѐ-ӿ]{2,}$/.test(w)) return null;
  const h = harmony(w);
  if (!h) return null;
  const b = h === "back";
  const last = lower(w).slice(-1);
  const vl = VOICELESS.includes(last);
  const open = VOWELS.includes(last) || "рй".includes(last);
  return {
    pl: w + (open ? (b ? "лар" : "лер") : vl ? (b ? "тар" : "тер") : b ? "дар" : "дер"),
    dat: w + (vl ? (b ? "қа" : "ке") : b ? "ға" : "ге"),
    loc: w + (vl ? (b ? "та" : "те") : b ? "да" : "де"),
  };
}

const tokens = (s) => lower(s).replace(/[.,!?;:«»"“”()—–-]/g, " ").split(/\s+/).filter(Boolean);

/** Сөз/сөйлем туралы қысқа ереже жолдары (UI тілінде) */
export function explainItem(item, { lang, topic, kind } = {}) {
  const L = aqylL(lang);
  const kk = String(item?.kk || "");
  const toks = tokens(kk);
  const single = toks.length === 1;
  const out = { lines: [], forms: null, letters: [] };
  const h = harmony(single ? kk : toks[toks.length - 1] || kk);
  if (single && h) out.lines.push(h === "back" ? L.hard : L.soft);
  if (single && topic === "verbs" && /у$/.test(lower(kk))) out.lines.push(L.verb);
  if (single && kind !== "phrases" && NOUN_TOPICS.has(topic)) out.forms = nounForms(kk);
  if (toks.some((t) => ["ма", "ме", "ба", "бе", "па", "пе"].includes(t))) out.lines.push(L.q);
  if (toks.some((t) => /^сіз/.test(t)) || /(сыз|сіз)$/.test(toks[toks.length - 1] || "")) out.lines.push(L.polite);
  if (toks.some((t) => /^емес/.test(t))) out.lines.push(L.neg);
  const seen = new Set();
  for (const ch of lower(kk)) if (SPECIAL.includes(ch) && !seen.has(ch)) { seen.add(ch); out.letters.push(L.letters[ch]); }
  out.letters = out.letters.slice(0, 3);
  return out;
}

function firstDiff(a, b) {
  const x = Array.from(lower(a)), y = Array.from(lower(b));
  if (x.length !== y.length) return null;
  const diffs = x.map((c, i) => (c !== y[i] ? i : -1)).filter((i) => i >= 0);
  return diffs.length >= 1 && diffs.length <= 2 ? [x[diffs[0]], y[diffs[0]]] : null;
}
function sameRoot(a, b) {
  const x = lower(a), y = lower(b);
  let i = 0;
  while (i < x.length && i < y.length && x[i] === y[i]) i++;
  return x !== y && i >= 3 && i >= Math.min(x.length, y.length) * 0.6;
}

/**
 * Қате жауаптың статикалық түсіндірмесі.
 * ctx: { type, dir, item:{kk,tr}, picked, pickedLabel, built, prompt, answer, shown, truth, wrongPairs:[{kk,tr}] }
 */
export function whyLines(ctx, lang) {
  const L = aqylL(lang);
  const { type, dir, item = {}, picked, pickedLabel, built, answer, shown, truth, wrongPairs } = ctx || {};
  const out = [];
  if (type === "choose" && dir === "kk2tr" && pickedLabel && picked) out.push(L.wrongTr(pickedLabel, picked));
  else if ((type === "choose" || type === "listen") && picked) {
    const d = firstDiff(picked, item.kk);
    if (d) out.push(L.letter(d[0], d[1]));
    else if (sameRoot(picked, item.kk)) out.push(L.root(picked, item.kk));
    else out.push(L.notThis(picked));
  } else if (type === "gap" && picked) {
    if (sameRoot(picked, answer)) out.push(L.root(picked, answer));
    else {
      const d = firstDiff(picked, answer);
      out.push(d ? L.letter(d[0], d[1]) : L.notThis(picked));
    }
  } else if (type === "truefalse") {
    out.push(truth ? L.tfYes(item.kk, item.tr) : L.tfNo(item.kk, item.tr, shown));
  } else if ((type === "build" || type === "order") && built) {
    out.push(L.built(built));
    const d = firstDiff(built.replace(/\s+/g, " "), item.kk);
    if (d) out.push(L.letter(d[0], d[1]));
    if (type === "order") out.push(L.verbLast);
  } else if (type === "match" && wrongPairs?.length) {
    out.push(`${L.pairs} ${wrongPairs.map((p) => `${p.kk} — ${p.tr}`).join("; ")}`);
  }
  return out;
}

/* ══════════ ЖИ: /api/aqyl, кэшпен ══════════ */
const MEM = new Map();
const LS = "qd_aqyl_ai_v1";
function lsGet(k) {
  try { return JSON.parse(localStorage.getItem(LS) || "{}")[k] || null; } catch { return null; }
}
function lsSet(k, v) {
  try {
    const m = JSON.parse(localStorage.getItem(LS) || "{}");
    m[k] = v;
    const keys = Object.keys(m);
    if (keys.length > 160) keys.slice(0, keys.length - 160).forEach((x) => delete m[x]);
    localStorage.setItem(LS, JSON.stringify(m));
  } catch {}
}
export async function askAqyl(payload) {
  const k = JSON.stringify([payload.mode, payload.explain, payload.kk, payload.picked || "", payload.question || ""]);
  if (MEM.has(k)) return MEM.get(k);
  const c = lsGet(k);
  if (c) { MEM.set(k, c); return c; }
  const r = await fetch("/api/aqyl", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.text) throw new Error(d.error || `HTTP ${r.status}`);
  MEM.set(k, d.text);
  lsSet(k, d.text);
  return d.text;
}

function useAsk() {
  const [st, setSt] = useState({ busy: false, text: "", err: "" });
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);
  const run = async (payload) => {
    if (st.busy) return;
    setSt({ busy: true, text: "", err: "" });
    try {
      const text = await askAqyl(payload);
      if (alive.current) setSt({ busy: false, text, err: "" });
    } catch {
      if (alive.current) setSt({ busy: false, text: "", err: "fail" });
    }
  };
  return [st, run];
}

function AiBlock({ st, L }) {
  if (st.busy) return <p className="aq-ai aq-ai-busy" aria-busy="true"><span className="aq-dots" aria-hidden="true"><i /><i /><i /></span> {L.thinking}</p>;
  if (st.err) return <p className="aq-ai aq-ai-err">{L.aiFail}</p>;
  if (st.text) return <p className="aq-ai">{st.text}</p>;
  return null;
}

/* ══════════ «Aqyl түсіндіреді» панелі (сабақтағы танысу картасы) ══════════ */
export function AqylExplainPanel({ item, lang, explain, level, topic, kind, onClose }) {
  const L = aqylL(lang);
  const info = explainItem(item, { lang, topic, kind });
  const [st, run] = useAsk();
  const mood = st.busy ? "thinking" : st.text ? "talking" : "explaining";
  const forms = info.forms;
  return (
    <AqylSays
      mood={mood}
      size={68}
      tone="gold"
      className="aq-explain"
      title={L.explains}
      live
      actions={
        <>
          {!st.text && (
            <button type="button" className="aq-btn" onClick={() => run({ mode: "explain", kk: item.kk, tr: item.tr, explain, level })} disabled={st.busy}>
              <Icon name="sparkle" size={16} /> {L.askMore}
            </button>
          )}
          {onClose && (
            <button type="button" className="aq-btn ghost" onClick={onClose}>
              {L.close}
            </button>
          )}
        </>
      }
    >
      <p className="aq-ex-word"><b lang="kk">{item.kk}</b> — {item.tr}</p>
      {info.lines.map((l) => <p key={l} className="aq-ex-line">{l}</p>)}
      {forms && (
        <ul className="aq-forms" lang="kk">
          {[["pl", forms.pl], ["dat", forms.dat], ["loc", forms.loc]].map(([k, v]) => (
            <li key={k}>
              <button type="button" className="aq-form" onClick={() => { try { sayKk(v); } catch {} }}>
                <b>{v}</b>
                <small lang={lang}>{L.forms[k]}</small>
                <Icon name="volume" size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {info.letters.length > 0 && (
        <ul className="aq-letters">
          {info.letters.map((l) => <li key={l}>{l}</li>)}
        </ul>
      )}
      <AiBlock st={st} L={L} />
    </AqylSays>
  );
}

/* ══════════ Қате жауаптан кейін: «Неге?» ══════════ */
export function AqylWhy({ ctx, lang, explain, level, task, question, compact = false, extra = [] }) {
  const L = aqylL(lang);
  const lines = [...whyLines(ctx, lang), ...extra.filter(Boolean)];
  const [st, run] = useAsk();
  const kk = ctx?.item?.kk || ctx?.answer || "";
  const picked = ctx?.pickedLabel || ctx?.picked || ctx?.built || ctx?.shown || "";
  const mood = st.busy ? "thinking" : st.text ? "talking" : "support";
  return (
    <AqylSays
      mood={mood}
      size={compact ? 48 : 56}
      tone="bad"
      className={`aq-why ${compact ? "is-compact" : ""}`}
      actions={
        !st.text && kk ? (
          <button type="button" className="aq-btn" onClick={() => run({ mode: "why", kk, tr: ctx?.item?.tr || "", picked, task: task || ctx?.type, question, explain, level })} disabled={st.busy}>
            <Icon name="sparkle" size={16} /> {L.why}
          </button>
        ) : null
      }
    >
      {lines.map((l) => <p key={l} className="aq-ex-line">{l}</p>)}
      <AiBlock st={st} L={L} />
    </AqylSays>
  );
}
