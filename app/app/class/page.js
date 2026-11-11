"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import LangPicker from "../../components/LangPicker";
import Avatar from "../../components/Avatar";
import { NatArt } from "../../components/NatArt";
import Icon from "../../components/Icon";
import { useApp } from "../../components/Store";
import { GAMES } from "../../../lib/games";
import { ALL_LESSONS, lessonTitle } from "../../../lib/course";
import { L } from "../../../lib/i18n";
import { createClass, createTask, deleteClass, deleteTask, isSetupError, joinClass, joinedClasses, leaveClass, listMembers, listSubs, listTasks, ownedClasses, removeMember, upsertSub } from "../../../lib/classes";

const X = {
  kicker: ["Мұғалім мен оқушы", "Учитель и ученик", "Teacher & student"],
  title: ["Менің сыныбым", "Мой класс", "My class"],
  subT: ["Сынып ашып, кодты оқушыларға бер. Тапсырма беріп, олардың белсенділігін бақыла.", "Создайте класс, дайте код ученикам, назначайте задания и следите за активностью.", "Create a class, share the code, assign tasks and track activity."],
  subS: ["Мұғалімнің кодымен сыныпқа қосыл да, берген тапсырмаларды орында.", "Вступите в класс по коду учителя и выполняйте задания.", "Join a class with your teacher's code and complete the tasks."],
  login: ["Сыныпты пайдалану үшін аккаунтқа кір.", "Войдите в аккаунт, чтобы пользоваться классами.", "Sign in to use classes."],
  signin: ["Кіру", "Войти", "Sign in"],
  setup: ["Сынып кестелері әлі қосылмаған. Сайт иесі supabase/classes.sql файлын Supabase → SQL Editor-де бір рет іске қосуы керек.", "Таблицы класса ещё не созданы. Владельцу сайта нужно один раз выполнить supabase/classes.sql в Supabase → SQL Editor.", "Class tables are not set up yet. The site owner must run supabase/classes.sql once in Supabase → SQL Editor."],
  newClass: ["Жаңа сынып", "Новый класс", "New class"],
  className: ["Сынып атауы (мыс.: 7Ә)", "Название класса (напр.: 7Б)", "Class name (e.g. 7B)"],
  create: ["Құру", "Создать", "Create"],
  code: ["Сынып коды", "Код класса", "Class code"],
  copy: ["Көшіру", "Копировать", "Copy"],
  copied: ["Көшірілді", "Скопировано", "Copied"],
  students: ["Оқушылар", "Ученики", "Students"],
  noStudents: ["Әзірге оқушы жоқ. Кодты оқушыларға жібер.", "Пока нет учеников. Отправьте им код.", "No students yet. Share the code."],
  tasks: ["Тапсырмалар", "Задания", "Tasks"],
  addTask: ["Тапсырма беру", "Дать задание", "Assign a task"],
  taskTitle: ["Тапсырма атауы", "Название задания", "Task title"],
  kLesson: ["Курс сабағы", "Урок курса", "Course lesson"],
  kGame: ["Ойында жеңу", "Победа в игре", "Win a game"],
  kCustom: ["Өз тапсырмам", "Своё задание", "Custom task"],
  due: ["Мерзімі", "Срок", "Due date"],
  done: ["орындады", "выполнили", "done"],
  active: ["Белсенділік", "Активность", "Activity"],
  weekXp: ["апталық XP", "XP за неделю", "week XP"],
  lessons: ["сабақ", "уроков", "lessons"],
  words: ["сөз", "слов", "words"],
  last: ["соңғы кіру", "заходил(а)", "last seen"],
  never: ["әлі кірмеген", "ещё не заходил(а)", "not yet"],
  join: ["Сыныпқа қосылу", "Вступить в класс", "Join a class"],
  enterCode: ["Мұғалімнің кодын енгіз", "Введите код учителя", "Enter the teacher's code"],
  joinBtn: ["Қосылу", "Вступить", "Join"],
  notFound: ["Мұндай код табылмады", "Такой код не найден", "Code not found"],
  myTasks: ["Менің тапсырмаларым", "Мои задания", "My tasks"],
  noTasks: ["Әзірге тапсырма жоқ", "Заданий пока нет", "No tasks yet"],
  start: ["Бастау", "Начать", "Start"],
  mark: ["Орындадым", "Выполнено", "Mark done"],
  leave: ["Сыныптан шығу", "Выйти из класса", "Leave class"],
  del: ["Жою", "Удалить", "Delete"],
  confirm: ["Сенімдісің бе?", "Вы уверены?", "Are you sure?"],
  teacherTip: ["Профильде рөлді «Мұғалім» етіп таңдағанда, бұл бетте сынып ашып тапсырма бере аласың.", "В профиле выберите роль «Учитель», чтобы создавать классы и давать задания.", "Choose the “Teacher” role in your profile to create classes and assign tasks."],
  today: ["бүгін", "сегодня", "today"],
  daysAgo: ["күн бұрын", "дн. назад", "d ago"],
};

function ago(iso, li) {
  if (!iso) return X.never[li];
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  return d <= 0 ? X.today[li] : `${d} ${X.daysAgo[li]}`;
}

function Task({ t, sub, li, lang, onMark }) {
  const L2 = (k) => X[k][li];
  const isLesson = t.kind === "lesson";
  const lesson = isLesson ? ALL_LESSONS.find((l) => l.id === t.ref) : null;
  const game = t.kind === "game" ? GAMES.find((g) => g.id === t.ref) : null;
  return (
    <li className={`cls-task ${sub?.done ? "done" : ""}`}>
      <span className="cls-task-ic">{sub?.done ? "✓" : isLesson ? "📘" : game ? game.e : "📝"}</span>
      <div className="cls-task-t">
        <b>{t.title}</b>
        <small>{isLesson && lesson ? lessonTitle(lesson, lang) : game ? L(game.name, lang) : L2("kCustom")}{t.due ? ` · ${L2("due")}: ${t.due}` : ""}</small>
      </div>
      {!sub?.done && isLesson && <Link className="btn gold small" href={`/app/course?l=${t.ref}`}>{L2("start")}</Link>}
      {!sub?.done && game && <Link className="btn gold small" href={`/app/games/${game.id}`}>{L2("start")}</Link>}
      {!sub?.done && t.kind === "custom" && <button className="btn ghost small" onClick={() => onMark(t)}>{L2("mark")}</button>}
    </li>
  );
}

export default function ClassPage() {
  const { lang, user, state, authReady } = useApp();
  const li = lang === "kk" ? 0 : lang === "ru" ? 1 : 2;
  const T = (k) => X[k][li];
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
  const [tf, setTf] = useState({ title: "", kind: "lesson", ref: ALL_LESSONS[0]?.id || "", due: "" });

  const fail = (e) => { if (isSetupError(e)) setSetup(true); else setErr(e?.body?.includes("class_not_found") ? T("notFound") : e?.message || "error"); };

  const loadLists = useCallback(async () => {
    if (!user) return;
    try {
      const [o, j] = await Promise.all([ownedClasses(user.id), joinedClasses(user.id)]);
      setOwned(o || []); setJoined(j || []);
      setCur((c) => c || (teacher ? o?.[0] : j?.[0]) || o?.[0] || j?.[0] || null);
    } catch (e) { fail(e); }
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
  const ask = (fn) => { if (window.confirm(T("confirm"))) fn(); };

  const classes = useMemo(() => { const m = new Map(); [...owned, ...joined].forEach((c) => m.set(c.id, c)); return [...m.values()]; }, [owned, joined]);

  const doneCount = (t) => subs.filter((s) => s.task_id === t.id && s.done).length;

  return (
    <div className="class-page">
      <header className="page-head">
        <div>
          <span className="kicker">{T("kicker")}</span>
          <h1>{T("title")}</h1>
          <p>{teacher ? T("subT") : T("subS")}</p>
        </div>
        <div className="head-tools"><LangPicker /></div>
      </header>

      {!user ? (
        <section className="card cls-empty">
          <NatArt name="yurt" size={120} />
          <p>{authReady ? T("login") : "…"}</p>
          <Link href="/login" className="btn gold">{T("signin")}</Link>
        </section>
      ) : setup ? (
        <section className="card cls-empty"><NatArt name="bowl" size={110} /><p>{T("setup")}</p></section>
      ) : (
        <>
          {err && <div className="alert">{err}</div>}
          {classes.length > 1 && (
            <div className="cls-tabs">{classes.map((c) => <button key={c.id} className={`chip tab ${cur?.id === c.id ? "on" : ""}`} onClick={() => setCur(c)}>{c.name}</button>)}</div>
          )}

          <div className="cls-grid">
            <div className="cls-main">
              {cur ? (
                <>
                  <section className="card cls-head">
                    <div>
                      <h2>{cur.name}</h2>
                      <small className="muted">{isOwner ? T("students") + ": " + members.length : ""}</small>
                    </div>
                    {isOwner && (
                      <div className="cls-code">
                        <small>{T("code")}</small>
                        <b>{cur.code}</b>
                        <button className="btn ghost small" onClick={() => { navigator.clipboard?.writeText(cur.code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? T("copied") : T("copy")}</button>
                      </div>
                    )}
                    <button className="btn ghost small danger-btn" onClick={() => ask(async () => { try { isOwner ? await deleteClass(cur.id) : await leaveClass(cur.id, user.id); setCur(null); await loadLists(); } catch (e) { fail(e); } })}>{isOwner ? T("del") : T("leave")}</button>
                  </section>

                  {isOwner && (
                    <section className="card">
                      <h3>{T("students")}</h3>
                      {members.length === 0 ? <p className="muted">{T("noStudents")}</p> : (
                        <ul className="cls-members">
                          {members.map((m) => {
                            const done = subs.filter((s) => s.user_id === m.user_id && s.done).length;
                            return (
                              <li key={m.user_id}>
                                <Avatar value={m.avatar} size={44} />
                                <div className="cls-m-main">
                                  <b>{m.name || "—"}</b>
                                  <small>{T("last")}: {ago(m.last_active, li)} · 🔥 {m.streak || 0}</small>
                                  <span className="cls-bar"><i style={{ width: `${tasks.length ? (done / tasks.length) * 100 : 0}%` }} /></span>
                                </div>
                                <div className="cls-m-stats">
                                  <span><b>{m.week_xp || 0}</b><small>{T("weekXp")}</small></span>
                                  <span><b>{m.lessons || 0}</b><small>{T("lessons")}</small></span>
                                  <span><b>{done}/{tasks.length}</b><small>{T("tasks")}</small></span>
                                </div>
                                <button className="icon-btn" aria-label={T("del")} onClick={() => ask(async () => { try { await removeMember(cur.id, m.user_id); await loadClass(); } catch (e) { fail(e); } })}><Icon name="x" size={16} /></button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </section>
                  )}

                  <section className="card">
                    <h3>{isOwner ? T("tasks") : T("myTasks")}</h3>
                    {isOwner && (
                      <div className="cls-form">
                        <select className="input" value={tf.kind} onChange={(e) => setTf({ ...tf, kind: e.target.value, ref: e.target.value === "lesson" ? ALL_LESSONS[0].id : e.target.value === "game" ? GAMES[0].id : "" })}>
                          <option value="lesson">{T("kLesson")}</option><option value="game">{T("kGame")}</option><option value="custom">{T("kCustom")}</option>
                        </select>
                        {tf.kind === "lesson" && <select className="input" value={tf.ref} onChange={(e) => setTf({ ...tf, ref: e.target.value })}>{ALL_LESSONS.map((l) => <option key={l.id} value={l.id}>{l.id.split("-")[0]} · {lessonTitle(l, lang)}</option>)}</select>}
                        {tf.kind === "game" && <select className="input" value={tf.ref} onChange={(e) => setTf({ ...tf, ref: e.target.value })}>{GAMES.map((g) => <option key={g.id} value={g.id}>{g.e} {L(g.name, lang)}</option>)}</select>}
                        <input className="input" placeholder={T("taskTitle")} value={tf.title} onChange={(e) => setTf({ ...tf, title: e.target.value })} maxLength={80} />
                        <input className="input" type="date" value={tf.due} onChange={(e) => setTf({ ...tf, due: e.target.value })} aria-label={T("due")} />
                        <button className="btn gold" onClick={addTask}>{T("addTask")}</button>
                      </div>
                    )}
                    {tasks.length === 0 ? <p className="muted">{T("noTasks")}</p> : (
                      <ul className="cls-tasks">
                        {tasks.map((t) => isOwner ? (
                          <li key={t.id} className="cls-task">
                            <span className="cls-task-ic">{t.kind === "lesson" ? "📘" : t.kind === "game" ? "🎯" : "📝"}</span>
                            <div className="cls-task-t"><b>{t.title}</b><small>{doneCount(t)} / {members.length} {T("done")}{t.due ? ` · ${T("due")}: ${t.due}` : ""}</small></div>
                            <button className="icon-btn" aria-label={T("del")} onClick={() => ask(async () => { try { await deleteTask(t.id); await loadClass(); } catch (e) { fail(e); } })}><Icon name="x" size={16} /></button>
                          </li>
                        ) : <Task key={t.id} t={t} sub={my(t)} li={li} lang={lang} onMark={mark} />)}
                      </ul>
                    )}
                  </section>
                </>
              ) : (
                <section className="card cls-empty"><NatArt name="dombyra" size={120} /><p>{teacher ? T("subT") : T("subS")}</p></section>
              )}
            </div>

            <aside className="cls-side">
              {teacher && (
                <section className="card">
                  <h3>{T("newClass")}</h3>
                  <input className="input" placeholder={T("className")} value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
                  <button className="btn gold" disabled={busy || !name.trim()} onClick={make}>{T("create")}</button>
                </section>
              )}
              <section className="card">
                <h3>{T("join")}</h3>
                <input className="input cls-code-in" placeholder={T("enterCode")} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={8} />
                <button className="btn blue" disabled={busy || !code.trim()} onClick={enter}>{T("joinBtn")}</button>
              </section>
              {!teacher && <p className="muted small">{T("teacherTip")}</p>}
              <div className="cls-art"><NatArt name="taqiya" size={70} /><NatArt name="kobyz" size={70} /></div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
