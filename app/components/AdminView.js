"use client";
// Әкімші тақтасының көрінісі (тек сызады). Деректер — app/app/admin/page.js ішіндегі admin_overview RPC-ден.
// Шолу: негізгі көрсеткіштер → 14 күндік тіркелу → оқу жолы → үздіктер/жаңалар.
// Қолданушылар: іздеу, рөл/белсенділік сүзгісі, сұрыптау, CSV, кесте (телефонда — карталар), толық карта.
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import { AdminKpi, AdminScene } from "./AdminArt";

const DAY = 86400000;
const PAGE = 60;
export const fmt = (iso) => (iso ? new Date(iso).toLocaleString("kk-KZ", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—");
const day = (iso) => new Date(new Date(iso).getTime() + 5 * 3600000).toISOString().slice(0, 10);
const ms = (iso) => (iso ? new Date(iso).getTime() : 0);
const act = (u) => Math.max(ms(u.last_sign_in_at), ms(u.seen));
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

function Stat({ kind, label, value, note, big }) {
  return (
    <div className={`adm-stat ${big ? "is-big" : ""}`}>
      <AdminKpi kind={kind} size={big ? 44 : 38} />
      <div className="adm-stat-t">
        <b>{value}</b>
        <span>{label}</span>
        {note && <small>{note}</small>}
      </div>
    </div>
  );
}

function State({ kind, title, text, children }) {
  return (
    <section className="card adm-state">
      <AdminScene kind={kind} className="adm-state-art" />
      <div>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
        {children}
      </div>
    </section>
  );
}

function Who({ u, onOpen }) {
  return (
    <button type="button" className="adm-who" onClick={() => onOpen(u)}>
      <span className={`adm-ava ${u.role === "teacher" ? "is-t" : ""}`} aria-hidden="true">{(u.name || u.email || "?").trim().charAt(0).toUpperCase()}</span>
      <span className="adm-who-t">{u.name ? <><b dir="auto">{u.name}</b><small dir="ltr">{u.email}</small></> : <b dir="ltr">{u.email || "—"}</b>}</span>
    </button>
  );
}

/* ── Қолданушы картасы (модаль) ── */
function UserCard({ u, T, now, ago, onClose }) {
  const [copied, setCopied] = useState("");
  const closeRef = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); prev?.focus?.(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const copy = (k, v) => { navigator.clipboard?.writeText(v); setCopied(k); setTimeout(() => setCopied(""), 1400); };
  const rows = [[T("cCreated"), fmt(u.created_at), ago(u.created_at)], [T("cLast"), fmt(u.last_sign_in_at), ago(u.last_sign_in_at)], [T("cSeen"), fmt(u.seen), ago(u.seen)]];
  return (
    <div className="adm-modal" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="adm-dialog" role="dialog" aria-modal="true" aria-labelledby="adm-u-t">
        <div className="adm-dialog-head">
          <span className={`adm-ava is-lg ${u.role === "teacher" ? "is-t" : ""}`} aria-hidden="true">{(u.name || u.email || "?").trim().charAt(0).toUpperCase()}</span>
          <div className="adm-dialog-who">
            <span className={`adm-role ${u.role === "teacher" ? "is-t" : ""}`}>{u.role === "teacher" ? T("teacher") : T("student")}</span>
            <h2 id="adm-u-t" dir="auto">{u.name || "—"}</h2>
          </div>
          <button ref={closeRef} type="button" className="adm-x" aria-label={T("close")} onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="adm-copyrow">
          <span dir="ltr">{u.email}</span>
          <button type="button" className="btn ghost small" onClick={() => copy("e", u.email || "")}><Icon name={copied === "e" ? "check" : "stamp"} size={16} />{copied === "e" ? T("copied") : T("copy")}</button>
        </div>
        <ul className="adm-dialog-stats">
          <li><AdminKpi kind="xp" size={34} /><b>{u.xp || 0}</b><span>{T("cXp")}</span></li>
          <li><AdminKpi kind="lessons" size={34} /><b>{u.lessons || 0}</b><span>{T("cLessons")}</span></li>
          <li><AdminKpi kind="active" size={34} /><b>{u.streak || 0}</b><span>{T("cStreak")}</span></li>
        </ul>
        <dl className="adm-dl">
          {rows.map(([k, v, r]) => <div key={k}><dt>{k}</dt><dd>{v}{r && <small> · {r}</small>}</dd></div>)}
          <div><dt>ID</dt><dd className="adm-id"><code>{u.id}</code><button type="button" className="adm-mini" onClick={() => copy("i", u.id)} aria-label={`${T("copy")} ID`}><Icon name={copied === "i" ? "check" : "stamp"} size={14} /></button></dd></div>
        </dl>
      </div>
    </div>
  );
}

export default function AdminView({ T, user, authReady, d, err, busy, loadedAt, onReload, tab0, open0 }) {
  const [tab, setTab] = useState(tab0 || "overview");
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [seen, setSeen] = useState("all");
  const [sort, setSort] = useState("created_at");
  const [limit, setLimit] = useState(PAGE);
  const [open, setOpen] = useState(open0 || null);

  const st = useMemo(() => {
    if (!d) return null;
    const now = new Date(d.now).getTime();
    const users = d.users || [];
    const within = (span, f) => users.filter((u) => now - f(u) <= span).length;
    const created = (u) => ms(u.created_at);
    const days = Array.from({ length: 14 }, (_, i) => day(new Date(now - (13 - i) * DAY).toISOString()));
    const per = days.map((k) => ({ k, n: users.filter((u) => day(u.created_at) === k).length }));
    const lessons = users.reduce((s, u) => s + (u.lessons || 0), 0);
    return {
      now, users, total: users.length,
      new1: within(DAY, created), new7: within(7 * DAY, created),
      a1: within(DAY, act), a7: within(7 * DAY, act), a30: within(30 * DAY, act),
      teachers: users.filter((u) => u.role === "teacher").length,
      active: users.filter((u) => (u.xp || 0) > 0).length,
      learners: users.filter((u) => (u.lessons || 0) > 0).length,
      lessons, per, per14: per.reduce((s, x) => s + x.n, 0), max: Math.max(1, ...per.map((x) => x.n)),
      top: [...users].filter((u) => (u.xp || 0) > 0).sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 5),
      recent: users.slice().sort((a, b) => created(b) - created(a)).slice(0, 5),
    };
  }, [d]);

  const ago = (iso) => {
    if (!iso || !st) return iso ? "" : T("never");
    const n = Math.floor((st.now - ms(iso)) / DAY);
    return n <= 0 ? T("today") : `${n} ${T("daysAgo")}`;
  };

  const rows = useMemo(() => {
    if (!st) return [];
    const k = q.trim().toLowerCase();
    const span = { today: DAY, d7: 7 * DAY, d30: 30 * DAY }[seen];
    const list = st.users.filter((u) => {
      if (k && !`${u.email || ""} ${u.name || ""}`.toLowerCase().includes(k)) return false;
      if (role === "teacher" && u.role !== "teacher") return false;
      if (role === "student" && u.role === "teacher") return false;
      if (span && st.now - act(u) > span) return false;
      if (seen === "inactive" && st.now - act(u) <= 30 * DAY) return false;
      return true;
    });
    const key = { created_at: (u) => ms(u.created_at), last: act, xp: (u) => u.xp || 0, lessons: (u) => u.lessons || 0 }[sort];
    return [...list].sort((a, b) => key(b) - key(a));
  }, [st, q, role, seen, sort]);
  useEffect(() => { setLimit(PAGE); }, [q, role, seen, sort]);

  const filtered = q || role !== "all" || seen !== "all";
  const clear = () => { setQ(""); setRole("all"); setSeen("all"); };
  const goUsers = (s) => { setSort(s); clear(); setTab("users"); };

  function exportCsv() {
    const cols = ["name", "email", "role", "xp", "lessons", "streak", "created_at", "last_sign_in_at", "seen"];
    const esc = (v) => { const s = v == null ? "" : String(v); return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const csv = "﻿" + [cols.join(","), ...rows.map((u) => cols.map((c) => esc(c === "role" ? u.role || "student" : u[c])).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = `tilim-users-${day(new Date().toISOString())}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  const head = (tools) => (
    <header className="page-head adm-head">
      <div>
        <span className="kicker">{T("kicker")}</span>
        <h1>{T("title")}</h1>
        <p>{T("sub")}</p>
      </div>
      {tools}
    </header>
  );

  if (!authReady) return <div className="adm">{head(null)}<div className="adm-skel" aria-busy="true"><i /><i /><i /><i /></div></div>;
  if (!user) return <div className="adm">{head(null)}<State kind="login" title={T("loginT")} text={T("loginP")}><Link className="btn primary" href="/login"><Icon name="user" size={18} />{T("signin")}</Link></State></div>;
  if (err === "forbidden") return <div className="adm">{head(null)}<State kind="forbidden" title={T("forbT")} text={T("forbP")} /></div>;
  if (err === "setup") return <div className="adm">{head(null)}<State kind="setup" title={T("setupT")} text={T("setupP")} /></div>;

  const tools = (
    <div className="head-tools adm-tools-top">
      {loadedAt && <small className="adm-upd">{T("updated")}: {loadedAt}</small>}
      <button className="btn ghost" onClick={onReload} disabled={busy}>
        <Icon name="refresh" size={18} className={busy ? "adm-spin" : ""} />{T("refresh")}
      </button>
    </div>
  );

  return (
    <div className="adm">
      {head(tools)}
      {err && (
        st ? <div className="alert adm-alert" role="alert"><Icon name="x" size={18} /><span>{T("errT")}: {err}</span><button type="button" className="btn ghost small" onClick={onReload}>{T("retry")}</button></div>
          : <State kind="error" title={T("errT")} text={err}><button type="button" className="btn primary" onClick={onReload}><Icon name="refresh" size={18} />{T("retry")}</button></State>
      )}
      {!st && !err && <div className="adm-skel" aria-busy="true"><i /><i /><i /><i /></div>}
      {st && (
        <>
          <div className="adm-tabs" role="tablist" aria-label={T("title")}>
            <button type="button" role="tab" id="adm-t-o" aria-controls="adm-p-o" aria-selected={tab === "overview"} className={tab === "overview" ? "is-on" : ""} onClick={() => setTab("overview")}><Icon name="chart" size={18} />{T("tabOverview")}</button>
            <button type="button" role="tab" id="adm-t-u" aria-controls="adm-p-u" aria-selected={tab === "users"} className={tab === "users" ? "is-on" : ""} onClick={() => setTab("users")}><Icon name="user" size={18} />{T("tabUsers")}<span className="adm-count">{st.total}</span></button>
          </div>

          {tab === "overview" ? (
            <div className="adm-grid" role="tabpanel" id="adm-p-o" aria-labelledby="adm-t-o">
              <section className="adm-kpis" aria-label={T("tabOverview")}>
                <Stat big kind="users" label={T("total")} value={st.total} note={`${T("today")}: +${st.new1}`} />
                <Stat big kind="active" label={T("active7")} value={st.a7} note={`${T("today")}: ${st.a1} · ${T("in30")}: ${st.a30}`} />
                <Stat big kind="fresh" label={T("new7")} value={st.new7} note={`${T("today")}: +${st.new1}`} />
                <Stat big kind="lessons" label={T("lessonsDone")} value={st.lessons} note={st.total ? `${(st.lessons / st.total).toFixed(1)} ${T("perUser")}` : null} />
              </section>
              <section className="card adm-mini-kpis">
                <Stat kind="xp" label={T("withXp")} value={st.active} />
                <Stat kind="teacher" label={T("teachers")} value={st.teachers} />
                <Stat kind="classes" label={T("classes")} value={d.classes ?? 0} />
                <Stat kind="members" label={T("members")} value={d.members ?? 0} />
              </section>

              <section className="card adm-chart" aria-labelledby="adm-ch-h">
                <div className="adm-h"><h2 id="adm-ch-h">{T("signups14")}</h2><span className="adm-count">{st.per14}</span></div>
                <div className="adm-bars">{st.per.map((x, i) => (
                  <div key={x.k} className={`adm-bar ${i === st.per.length - 1 ? "is-today" : ""}`} title={`${x.k}: ${x.n}`}>
                    <b>{x.n || ""}</b>
                    <span className="adm-bar-col"><i style={{ height: `${x.n ? Math.max(6, (x.n / st.max) * 100) : 0}%` }} /></span>
                    <small>{x.k.slice(8)}</small>
                  </div>
                ))}</div>
              </section>

              <section className="card adm-funnel" aria-labelledby="adm-fn-h">
                <div className="adm-h"><h2 id="adm-fn-h">{T("funnel")}</h2></div>
                <ol>
                  {[[T("fReg"), st.total], [T("fXp"), st.active], [T("fLesson"), st.learners], [T("fBack"), st.a7]].map(([n, v], i) => (
                    <li key={n} style={{ "--w": `${Math.max(2, pct(v, st.total))}%`, "--i": i }}>
                      <span className="adm-fn-l">{n}</span>
                      <span className="adm-fn-bar" aria-hidden="true"><i /></span>
                      <b>{v}</b><small>{pct(v, st.total)}%</small>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="card adm-list" aria-labelledby="adm-top-h">
                <div className="adm-h"><h2 id="adm-top-h">{T("top")}</h2><button type="button" className="adm-link" onClick={() => goUsers("xp")}>{T("seeAll")}<Icon name="right" size={15} className="adm-flip" /></button></div>
                {st.top.length ? (
                  <ol className="adm-people">{st.top.map((u, i) => (
                    <li key={u.id}><span className="adm-n">{i + 1}</span><Who u={u} onOpen={setOpen} /><b className="adm-v">{u.xp} <small>XP</small></b></li>
                  ))}</ol>
                ) : <p className="adm-empty-line">{T("noUsers")}</p>}
              </section>

              <section className="card adm-list" aria-labelledby="adm-new-h">
                <div className="adm-h"><h2 id="adm-new-h">{T("recent")}</h2><button type="button" className="adm-link" onClick={() => goUsers("created_at")}>{T("seeAll")}<Icon name="right" size={15} className="adm-flip" /></button></div>
                {st.recent.length ? (
                  <ul className="adm-people">{st.recent.map((u) => (
                    <li key={u.id}><Who u={u} onOpen={setOpen} /><small className="adm-v is-date">{ago(u.created_at)}</small></li>
                  ))}</ul>
                ) : <p className="adm-empty-line">{T("noUsers")}</p>}
              </section>
            </div>
          ) : (
            <section className="card adm-users" role="tabpanel" id="adm-p-u" aria-labelledby="adm-t-u">
              <div className="adm-filters">
                <label className="adm-search">
                  <Icon name="search" size={18} />
                  <input className="input" type="search" placeholder={T("search")} aria-label={T("search")} value={q} onChange={(e) => setQ(e.target.value)} />
                </label>
                <label className="adm-sel"><span>{T("role")}</span>
                  <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="all">{T("all")}</option><option value="student">{T("student")}</option><option value="teacher">{T("teacher")}</option>
                  </select>
                </label>
                <label className="adm-sel"><span>{T("activity")}</span>
                  <select className="input" value={seen} onChange={(e) => setSeen(e.target.value)}>
                    <option value="all">{T("all")}</option><option value="today">{T("actToday")}</option><option value="d7">{T("act7")}</option><option value="d30">{T("act30")}</option><option value="inactive">{T("inactive")}</option>
                  </select>
                </label>
                <label className="adm-sel"><span>{T("sort")}</span>
                  <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="created_at">{T("sNew")}</option><option value="last">{T("sLast")}</option><option value="xp">{T("sXp")}</option><option value="lessons">{T("sLessons")}</option>
                  </select>
                </label>
              </div>
              <div className="adm-bar-row">
                <small className="adm-shown" aria-live="polite">{T("shown")}: <b>{Math.min(limit, rows.length)}</b> / {rows.length}{filtered ? ` (${st.total})` : ""}</small>
                {filtered && <button type="button" className="adm-link" onClick={clear}><Icon name="x" size={15} />{T("clear")}</button>}
                <button type="button" className="btn ghost small adm-csv" onClick={exportCsv} disabled={!rows.length}><Icon name="upload" size={16} className="adm-down" />{T("export")}</button>
              </div>

              {rows.length === 0 ? (
                <div className="adm-none">
                  <AdminScene kind={st.total ? "search" : "empty"} className="adm-none-art" />
                  <div><h3>{st.total ? T("noResults") : T("noUsers")}</h3>{st.total > 0 && <p>{T("noResultsP")}</p>}
                    {filtered && <button type="button" className="btn ghost small" onClick={clear}>{T("clear")}</button>}</div>
                </div>
              ) : (
                <>
                  <table className="adm-table">
                    <thead><tr><th scope="col">{T("cName")}</th><th scope="col">{T("role")}</th><th scope="col" className="num">{T("cXp")}</th><th scope="col" className="num">{T("cLessons")}</th><th scope="col" className="num">{T("cStreak")}</th><th scope="col">{T("cCreated")}</th><th scope="col">{T("cLast")}</th></tr></thead>
                    <tbody>{rows.slice(0, limit).map((u) => {
                      const a = act(u);
                      const fresh = a && st.now - a <= DAY;
                      return (
                        <tr key={u.id}>
                          <td className="adm-td-who"><Who u={u} onOpen={setOpen} /></td>
                          <td data-l={T("role")}><span className={`adm-role ${u.role === "teacher" ? "is-t" : ""}`}>{u.role === "teacher" ? T("teacher") : T("student")}</span></td>
                          <td data-l={T("cXp")} className="num">{u.xp || 0}</td>
                          <td data-l={T("cLessons")} className="num">{u.lessons || 0}</td>
                          <td data-l={T("cStreak")} className="num">{u.streak || 0}</td>
                          <td data-l={T("cCreated")}><span className="adm-date">{fmt(u.created_at)}</span></td>
                          <td data-l={T("cLast")}><span className="adm-date"><i className={`adm-dot ${fresh ? "on" : ""}`} aria-hidden="true" />{a ? ago(new Date(a).toISOString()) : T("never")}</span></td>
                        </tr>
                      );
                    })}</tbody>
                  </table>
                  {rows.length > limit && <button type="button" className="btn ghost adm-more" onClick={() => setLimit(limit + PAGE)}>{T("more")} ({rows.length - limit})</button>}
                </>
              )}
            </section>
          )}
        </>
      )}
      {open && <UserCard u={open} T={T} ago={ago} onClose={() => setOpen(null)} />}
    </div>
  );
}
