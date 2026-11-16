"use client";
import "../../class.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import ClassView from "../../components/ClassView";
import { useApp } from "../../components/Store";
import { GAMES } from "../../../lib/games";
import { ALL_LESSONS, lessonTitle } from "../../../lib/courseIndex";
import { L } from "../../../lib/i18n";
import { clT, clIdx } from "../../components/ClassL10n";
import { useClientDate } from "../../../lib/useClientDate";
import { createClass, createTask, deleteClass, deleteTask, isSetupError, joinClass, joinedClasses, leaveClass, listMembers, listSubs, listTasks, ownedClasses, removeMember, upsertSub } from "../../../lib/classes";

// now — useClientDate()-тан (мс); сервер/гидрация рендерінде null → бейтарап «—»
function ago(iso, T, now) {
  if (!iso) return T("never");
  if (now == null) return "—";
  const d = Math.floor((now - new Date(iso).getTime()) / 86400000);
  return d <= 0 ? T("today") : `${d} ${T("daysAgo")}`;
}

export default function ClassPage() {
  const { lang, user, state, authReady } = useApp();
  const nowD = useClientDate();
  const nowMs = nowD ? nowD.getTime() : null;
  const li = clIdx(lang);
  const T = useMemo(() => clT(lang), [lang]);
  const teacher = state.profile?.role === "teacher";
  const [owned, setOwned] = useState([]);
  const [joined, setJoined] = useState([]);
  const [cur, setCur] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [subs, setSubs] = useState([]);
  const [err, setErr] = useState("");
  const [setup, setSetup] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false); // сыныптар тізімі бір рет жүктелді ме
  const [pending, setPending] = useState(null); // { kind, name, fn } — жою/шығу алдындағы растау терезесі
  const [tf, setTf] = useState({ title: "", kind: "lesson", ref: ALL_LESSONS[0]?.id || "", due: "" });

  const fail = (e) => { if (isSetupError(e)) setSetup(true); else setErr(e?.body?.includes("class_not_found") ? T("notFound") : e?.message || "error"); };

  const loadLists = useCallback(async () => {
    if (!user) return;
    try {
      const [o, j] = await Promise.all([ownedClasses(user.id), joinedClasses(user.id)]);
      setOwned(o || []); setJoined(j || []);
      setCur((c) => c || (teacher ? o?.[0] : j?.[0]) || o?.[0] || j?.[0] || null);
    } catch (e) { fail(e); }
    setLoaded(true);
  }, [user?.id, teacher]); // eslint-disable-line
  useEffect(() => { loadLists(); }, [loadLists]);

  const loadClass = useCallback(async () => {
    if (!cur) return;
    try {
      const own = cur.owner === user.id;
      const ts = await listTasks(cur.id);
      setTasks(ts);
      setSubs(await listSubs(ts.map((t) => t.id)));
      setMembers(own ? await listMembers(cur.id) : []);
    } catch (e) { fail(e); }
  }, [cur?.id, user?.id]); // eslint-disable-line
  useEffect(() => { loadClass(); }, [loadClass]);

  const isOwner = cur && user && cur.owner === user.id;
  const my = (t) => subs.find((s) => s.task_id === t.id && s.user_id === user?.id);

  async function make() {
    if (!name.trim()) return;
    setBusy(true); setErr("");
    try { const c = await createClass(name.trim()); setName(""); setCur(c); await loadLists(); } catch (e) { fail(e); }
    setBusy(false);
  }
  async function enter() {
    if (!code.trim()) return;
    setBusy(true); setErr("");
    try { const c = await joinClass(code.trim(), state.profile.name || "Дос", state.profile.avatar || ""); setCode(""); setCur(c); await loadLists(); } catch (e) { fail(e); }
    setBusy(false);
  }
  async function addTask() {
    if (!tf.title.trim() && tf.kind === "custom") return;
    const lesson = tf.kind === "lesson" ? ALL_LESSONS.find((l) => l.id === tf.ref) : null;
    const game = tf.kind === "game" ? GAMES.find((g) => g.id === tf.ref) : null;
    const title = tf.title.trim() || (lesson ? lessonTitle(lesson, lang) : game ? L(game.name, lang) : "");
    try { await createTask({ class_id: cur.id, title, kind: tf.kind, ref: tf.kind === "custom" ? null : tf.ref, due: tf.due || null }); setTf({ ...tf, title: "" }); await loadClass(); } catch (e) { fail(e); }
  }
  async function mark(t) { try { await upsertSub({ task_id: t.id, user_id: user.id, done: true, score: 100, base: 0 }); await loadClass(); } catch (e) { fail(e); } }
  // Қауіпті әрекет — алдымен растау терезесі (ClassConfirm), сосын ғана орындалады
  const ask = (kind, name, fn) => setPending({ kind, name, fn });
  const okPending = () => { const p = pending; setPending(null); p?.fn(); };

  const classes = useMemo(() => { const m = new Map(); [...owned, ...joined].forEach((c) => m.set(c.id, c)); return [...m.values()]; }, [owned, joined]);

  const doneCount = (t) => subs.filter((s) => s.task_id === t.id && s.done).length;

  const copyCode = () => { navigator.clipboard?.writeText(cur.code); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const dropClass = () => ask(isOwner ? "class" : "leave", cur?.name, async () => { try { isOwner ? await deleteClass(cur.id) : await leaveClass(cur.id, user.id); setCur(null); await loadLists(); } catch (e) { fail(e); } });
  const dropMember = (m) => ask("member", m?.name, async () => { try { await removeMember(cur.id, m.user_id); await loadClass(); } catch (e) { fail(e); } });
  const dropTask = (t) => ask("task", t?.title, async () => { try { await deleteTask(t.id); await loadClass(); } catch (e) { fail(e); } });

  return (
    <ClassView
      T={T} li={li} lang={lang} user={user} authReady={authReady} teacher={teacher} setup={setup} err={err}
      classes={classes} cur={cur} setCur={setCur} isOwner={isOwner} members={members} tasks={tasks} subs={subs}
      my={my} doneCount={doneCount} ago={(iso) => ago(iso, T, nowMs)} myAvatar={state.profile?.avatar}
      name={name} setName={setName} code={code} setCode={setCode} busy={busy} copied={copied} onCopy={copyCode}
      tf={tf} setTf={setTf} onMake={make} onEnter={enter} onAddTask={addTask} onMark={mark}
      loading={!!user && !loaded && !setup} pending={pending} onConfirm={okPending} onCancel={() => setPending(null)}
      onDropClass={dropClass} onRemoveMember={dropMember} onDeleteTask={dropTask}
    />
  );
}
