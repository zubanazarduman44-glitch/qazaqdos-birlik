"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "../../components/Store";
import { authed } from "../../../lib/auth";

const DAY = 86400000;
const fmt = (iso) => (iso ? new Date(iso).toLocaleString("kk-KZ", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—");
const day = (iso) => new Date(new Date(iso).getTime() + 5 * 3600000).toISOString().slice(0, 10);

export default function Admin() {
  const { user, authReady } = useApp();
  const [d, setD] = useState(null);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("created_at");
  const [busy, setBusy] = useState(false);

  async function load() {
    setBusy(true); setErr("");
    try { setD(await authed("/rest/v1/rpc/admin_overview", { method: "POST", body: "{}" })); }
    catch (e) { setErr(/forbidden/.test(e.body || "") ? "forbidden" : /404|PGRST202|does not exist/i.test((e.body || "") + e.status) ? "setup" : e.message || "error"); }
    setBusy(false);
  }
  useEffect(() => { if (user) load(); }, [user?.id]); // eslint-disable-line

  const st = useMemo(() => {
    if (!d) return null;
    const now = new Date(d.now).getTime();
    const users = d.users || [];
    const act = (u) => Math.max(u.last_sign_in_at ? new Date(u.last_sign_in_at).getTime() : 0, u.seen ? new Date(u.seen).getTime() : 0);
    const within = (ms, f) => users.filter((u) => now - f(u) <= ms).length;
    const created = (u) => new Date(u.created_at).getTime();
    const days = Array.from({ length: 14 }, (_, i) => day(new Date(now - (13 - i) * DAY).toISOString()));
    const per = days.map((k) => ({ k, n: users.filter((u) => day(u.created_at) === k).length }));
    return {
      users, total: users.length,
      new1: within(DAY, created), new7: within(7 * DAY, created),
      a1: within(DAY, act), a7: within(7 * DAY, act), a30: within(30 * DAY, act),
      teachers: users.filter((u) => u.role === "teacher").length,
      active: users.filter((u) => (u.xp || 0) > 0).length,
      lessons: users.reduce((s, u) => s + (u.lessons || 0), 0),
      per, max: Math.max(1, ...per.map((x) => x.n)), act,
    };
  }, [d]);

  const rows = useMemo(() => {
    if (!st) return [];
    const k = q.trim().toLowerCase();
    const list = st.users.filter((u) => !k || `${u.email || ""} ${u.name || ""}`.toLowerCase().includes(k));
    const key = { created_at: (u) => new Date(u.created_at).getTime(), last: (u) => st.act(u), xp: (u) => u.xp || 0, lessons: (u) => u.lessons || 0 }[sort];
    return [...list].sort((a, b) => key(b) - key(a));
  }, [st, q, sort]);

  if (!authReady) return null;
  if (!user) return <div className="card adm-note"><p>Алдымен әкімші аккаунтымен кіріңіз.</p><Link className="btn gold" href="/login">Кіру</Link></div>;
  if (err === "forbidden") return <div className="card adm-note"><h2>Қолжетімсіз</h2><p>Бұл аккаунт әкімші тізімінде жоқ.</p></div>;
  if (err === "setup") return <div className="card adm-note"><h2>Әкімші панелі баптала қоймаған</h2><p>Supabase → SQL Editor-де <b>supabase/admin.sql</b> файлын (өз email-іңізді қойып) бір рет іске қосыңыз.</p></div>;

  return (
    <div className="adm">
      <header className="page-head">
        <div><span className="kicker">Әкімші</span><h1>Қолданушылар</h1><p>Сайтқа кірген адамдар мен олардың белсенділігі.</p></div>
        <button className="btn ghost" onClick={load} disabled={busy}>{busy ? "…" : "Жаңарту"}</button>
      </header>
      {err && err !== "forbidden" && err !== "setup" && <div className="alert">{err}</div>}
      {st && (
        <>
          <div className="adm-kpi">
            {[["Барлығы", st.total], ["Бүгін тіркелген", st.new1], ["7 күнде тіркелген", st.new7], ["Бүгін белсенді", st.a1], ["7 күнде белсенді", st.a7], ["30 күнде белсенді", st.a30],
              ["XP жинаған", st.active], ["Өткен сабақ", st.lessons], ["Мұғалім", st.teachers], ["Сынып", d.classes], ["Сыныпқа қосылған", d.members]].map(([n, v]) => (
              <div key={n} className="card adm-k"><b>{v}</b><small>{n}</small></div>
            ))}
          </div>
          <section className="card">
            <h3>Соңғы 14 күнде тіркелу</h3>
            <div className="adm-bars">{st.per.map((x) => (
              <div key={x.k} className="adm-bar" title={`${x.k}: ${x.n}`}><i style={{ height: `${(x.n / st.max) * 100}%` }} /><b>{x.n}</b><small>{x.k.slice(8)}</small></div>
            ))}</div>
          </section>
          <section className="card">
            <div className="adm-tools">
              <input className="input" placeholder="Email немесе аты бойынша іздеу" value={q} onChange={(e) => setQ(e.target.value)} />
              <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="created_at">Жаңа тіркелгендер</option><option value="last">Соңғы белсенділік</option><option value="xp">XP бойынша</option><option value="lessons">Сабақ бойынша</option>
              </select>
            </div>
            <div className="adm-wrap">
              <table className="adm-table">
                <thead><tr><th>Аты</th><th>Email</th><th>Рөл</th><th>XP</th><th>Сабақ</th><th>Серия</th><th>Тіркелген</th><th>Соңғы кіру</th></tr></thead>
                <tbody>{rows.map((u) => (
                  <tr key={u.id}><td>{u.name || "—"}</td><td>{u.email}</td><td>{u.role === "teacher" ? "Мұғалім" : "Оқушы"}</td><td>{u.xp}</td><td>{u.lessons}</td><td>{u.streak}</td><td>{fmt(u.created_at)}</td><td>{fmt(u.last_sign_in_at)}</td></tr>
                ))}</tbody>
              </table>
            </div>
            <small className="muted">Көрсетілді: {rows.length} / {st.total}</small>
          </section>
        </>
      )}
    </div>
  );
}
