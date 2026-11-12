"use client";
import "../../class.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import ClassView from "../../components/ClassView";
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

  const copyCode = () => { navigator.clipboard?.writeText(cur.code); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const dropClass = () => ask(async () => { try { isOwner ? await deleteClass(cur.id) : await leaveClass(cur.id, user.id); setCur(null); await loadLists(); } catch (e) { fail(e); } });
  const dropMember = (m) => ask(async () => { try { await removeMember(cur.id, m.user_id); await loadClass(); } catch (e) { fail(e); } });
  const dropTask = (t) => ask(async () => { try { await deleteTask(t.id); await loadClass(); } catch (e) { fail(e); } });

  return (
    <ClassView
      T={T} li={li} lang={lang} user={user} authReady={authReady} teacher={teacher} setup={setup} err={err}
      classes={classes} cur={cur} setCur={setCur} isOwner={isOwner} members={members} tasks={tasks} subs={subs}
      my={my} doneCount={doneCount} ago={ago} myAvatar={state.profile?.avatar}
      name={name} setName={setName} code={code} setCode={setCode} busy={busy} copied={copied} onCopy={copyCode}
      tf={tf} setTf={setTf} onMake={make} onEnter={enter} onAddTask={addTask} onMark={mark}
      onDropClass={dropClass} onRemoveMember={dropMember} onDeleteTask={dropTask}
    />
  );
}
