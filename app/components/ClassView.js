"use client";
// «Менің сыныбым» көрінісі — Әдебиет/«қағаз» стиліндегі тыныш, анық бет.
// Құрылымы: бет тақырыбы → (сынып ауыстырғыш) → сынып картасы (атауы, көрсеткіштер, код) →
// мұғалімге «Тапсырмалар | Оқушылар» қойындылары, оқушыға «Менің тапсырмаларым» → тағы сынып құру/қосылу.
// Барлық күй мен Supabase шақырулары app/app/class/page.js ішінде; бұл файл тек сызады.
import { useMemo, useState } from "react";
import Link from "next/link";
import Avatar from "./Avatar";
import Icon from "./Icon";
import ClassConfirm from "./ClassConfirm";
import { ClassScene, ClassEmblem, ClassKindTile, ClassKindGlyph, ClassRank, ClassThreadRing, ClassHourglass, KIND_TONE } from "./ClassArt";
import { GAMES } from "../../lib/games";
import { ALL_LESSONS, lessonTitle } from "../../lib/courseIndex";
import { L } from "../../lib/i18n";
import { useClientDate } from "../../lib/useClientDate";

// Ағымдағы уақыт (мс): негізгі компонент әр рендерде useClientDate арқылы қояды.
// Сервер/гидрация рендерінде null — «бүгін/кешікті/жақын» белгілері бейтарап, гидрациядан кейін қойылады.
let NOW = null;
const DAY = 86400000;
const todayISO = () => (NOW == null ? "" : new Date(NOW).toISOString().slice(0, 10));
const daysSince = (iso) => (iso && NOW != null ? Math.floor((NOW - new Date(iso).getTime()) / DAY) : Infinity);
const daysTo = (d) => (NOW == null ? Infinity : Math.round((new Date(d + "T00:00:00Z").getTime() - new Date(todayISO() + "T00:00:00Z").getTime()) / DAY));
const KINDS = ["lesson", "game", "custom"];
const kindKey = { lesson: "kLesson", game: "kGame", custom: "kCustom" };
const CONFIRM = { class: ["delClass", "cfClass", "del"], leave: ["leave", "cfLeave", "leave"], member: ["remove", "cfMember", "remove"], task: ["del", "cfTask", "del"] };

/* ── Бөлім тақырыбы: белгі-шаршы + тақырып + сан (Әдебиеттің сөре тақырыбы сияқты) ── */
function Head({ id, icon, title, count, children }) {
  return (
    <div className="cl-h">
      <span className="cl-h-ic" aria-hidden="true">{icon}</span>
      <h2 id={id}>{title}</h2>
      {count != null && <span className="cl-count">{count}</span>}
      {children && <div className="cl-h-tools">{children}</div>}
    </div>
  );
}

/* ── Бос күй картасы ── */
function Empty({ kind, title, text, children, small }) {
  return (
    <div className={`cl-empty ${small ? "is-small" : ""}`}>
      <ClassScene kind={kind} className="cl-empty-art" />
      <div className="cl-empty-body">
        {title && <h3 className="cl-empty-t">{title}</h3>}
        {text && <p className="cl-empty-p">{text}</p>}
        {children}
      </div>
    </div>
  );
}

/* ── Сынып коды (мұғалім) ── */
function CodeBox({ code, T, copied, onCopy }) {
  return (
    <div className={`cl-code ${copied ? "is-copied" : ""}`}>
      <span className="cl-code-cap" id="cl-code-cap">{T("code")}</span>
      <b className="cl-code-val" translate="no" aria-labelledby="cl-code-cap">
        {String(code || "").split("").map((c, i) => <span key={i}>{c}</span>)}
      </b>
      <button type="button" className={`btn small ${copied ? "cl-ok" : "ghost"} cl-copy`} onClick={onCopy}>
        <Icon name={copied ? "check" : "stamp"} size={18} />
        <span aria-live="polite">{copied ? T("copied") : T("copy")}</span>
      </button>
      <small className="cl-code-hint">{T("shareCode")}</small>
    </div>
  );
}

/* ── Код енгізу ── */
function JoinForm({ code, setCode, T, id, onEnter, busy }) {
  return (
    <form className="cl-form" onSubmit={(e) => { e.preventDefault(); onEnter(); }}>
      <label className="cl-label" htmlFor={id}>{T("enterCode")}</label>
      <div className="cl-form-row">
        <input id={id} className="input cl-code-in" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={8}
          placeholder="QZ7K2A" autoComplete="off" autoCapitalize="characters" spellCheck={false} translate="no" />
        <button type="submit" className="btn primary" disabled={busy || !code.trim()}>
          <span>{T("joinBtn")}</span><Icon name="right" size={18} className="cl-flip" />
        </button>
      </div>
    </form>
  );
}

function CreateForm({ T, name, setName, busy, onMake, id }) {
  return (
    <form className="cl-form" onSubmit={(e) => { e.preventDefault(); onMake(); }}>
      <label className="cl-label" htmlFor={id}>{T("className")}</label>
      <div className="cl-form-row">
        <input id={id} className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} autoComplete="off" />
        <button type="submit" className="btn primary" disabled={busy || !name.trim()}><Icon name="plus" size={18} /><span>{T("create")}</span></button>
      </div>
    </form>
  );
}

/* Құру / қосылу карталары — бір торда */
function Actions({ T, teacher, name, setName, code, setCode, busy, onMake, onEnter }) {
  return (
    <div className={`cl-actions ${teacher ? "is-two" : ""}`}>
      {teacher && (
        <section className="card cl-act" aria-labelledby="cl-act-new">
          <Head id="cl-act-new" icon={<Icon name="plus" size={18} />} title={T("newClass")} />
          <CreateForm T={T} name={name} setName={setName} busy={busy} onMake={onMake} id="cl-new" />
        </section>
      )}
      <section className="card cl-act" aria-labelledby="cl-act-join">
        <Head id="cl-act-join" icon={<Icon name="right" size={18} className="cl-flip" />} title={T("join")} />
        <JoinForm code={code} setCode={setCode} T={T} id="cl-code" onEnter={onEnter} busy={busy} />
      </section>
    </div>
  );
}

/* ── Көшбасшылар тізімі (мұғалім) ── */
function Leaders({ members, T, ago, doneBy, total, onRemove, maxXp }) {
  return (
    <ol className="cl-board">
      {members.map((m, i) => {
        const fresh = daysSince(m.last_active) <= 0;
        const xp = m.week_xp || 0;
        const d = doneBy(m.user_id);
        return (
          <li key={m.user_id} className={`cl-row ${i < 3 && xp > 0 ? "is-top" : ""}`}>
            <span className="cl-row-rank"><ClassRank rank={i + 1} /></span>
            <span className="cl-row-av">
              <Avatar value={m.avatar} size={44} />
              <i className={`cl-dot ${fresh ? "on" : ""}`} aria-hidden="true" />
            </span>
            <div className="cl-row-who">
              <b dir="auto">{m.name || "—"}</b>
              <small>{T("last")}: {ago(m.last_active)}</small>
            </div>
            <div className="cl-row-xp" title={T("weekXp")}>
              <span className="cl-bar" aria-hidden="true"><i style={{ width: `${maxXp ? Math.max(4, (xp / maxXp) * 100) : 0}%` }} /></span>
              <b>{xp}<small> XP</small></b>
            </div>
            <ul className="cl-row-stats">
              <li title={T("lessons")}><Icon name="book" size={15} /><b>{m.lessons || 0}</b><span className="sr-only"> {T("lessons")}</span></li>
              <li title={T("tasks")}><Icon name="scroll" size={15} /><b>{d}/{total}</b><span className="sr-only"> {T("tasks")}</span></li>
              <li title={T("streak")}><Icon name="flame" size={15} /><b>{m.streak || 0}</b><span className="sr-only"> {T("streak")}</span></li>
            </ul>
            <button type="button" className="cl-x" aria-label={`${T("remove")}: ${m.name || "—"}`} title={T("remove")} onClick={() => onRemove(m)}><Icon name="x" size={16} /></button>
          </li>
        );
      })}
    </ol>
  );
}

/* ── Тапсырма ── */
function Task({ t, T, lang, isOwner, sub, doneN, members, onMark, onDelete }) {
  const lesson = t.kind === "lesson" ? ALL_LESSONS.find((l) => l.id === t.ref) : null;
  const game = t.kind === "game" ? GAMES.find((g) => g.id === t.ref) : null;
  const done = !isOwner && sub?.done;
  const late = t.due && !done && t.due < todayISO();
  const soon = t.due && !late && !done && daysTo(t.due) <= 2;
  const what = lesson ? lessonTitle(lesson, lang) : game ? L(game.name, lang) : null;
  const pct = members ? Math.round((Math.min(doneN, members) / members) * 100) : 0;
  const tone = (KIND_TONE[t.kind] || KIND_TONE.custom)[0];
  return (
    <li className={`cl-task ${done ? "is-done" : ""} ${late ? "is-late" : ""}`} style={{ "--k": tone }}>
      <ClassKindTile kind={t.kind} done={done} className="cl-task-ic" />
      <div className="cl-task-body">
        <span className="cl-task-kind">{T(kindKey[t.kind] || "kCustom")}</span>
        <b className="cl-task-title" dir="auto">{t.title}</b>
        {what && what !== t.title && <small className="cl-task-what" dir="auto">{what}</small>}
        {t.due && (
          <span className={`cl-due ${late ? "is-late" : soon ? "is-soon" : ""}`}>
            <ClassHourglass />{T("due")}: {t.due}{late ? ` · ${T("late")}` : soon ? ` · ${T("soon")}` : ""}
          </span>
        )}
      </div>
      <div className="cl-task-side">
        {isOwner ? (
          <div className="cl-task-count">
            <span><b>{doneN}</b>/{members} {T("done")}</span>
            <span className="cl-bar" aria-hidden="true"><i style={{ width: `${pct}%` }} /></span>
          </div>
        ) : done ? (
          <span className="cl-done-chip"><Icon name="check" size={16} stroke={3} />{T("done")}</span>
        ) : lesson ? (
          <Link className="btn primary small" href={`/app/course?l=${t.ref}`}>{T("start")}<Icon name="right" size={16} className="cl-flip" /></Link>
        ) : game ? (
          <Link className="btn primary small" href={`/app/games/${game.id}`}>{T("start")}<Icon name="right" size={16} className="cl-flip" /></Link>
        ) : t.kind === "custom" ? (
          <button type="button" className="btn ghost small" onClick={() => onMark(t)}><Icon name="check" size={16} />{T("mark")}</button>
        ) : null}
        {isOwner && <button type="button" className="cl-x" aria-label={`${T("del")}: ${t.title}`} title={T("del")} onClick={onDelete}><Icon name="x" size={16} /></button>}
      </div>
    </li>
  );
}

/* ── Тапсырма беру формасы ── */
function Composer({ T, lang, tf, setTf, onAdd, onClose }) {
  return (
    <form className="card cl-compose" onSubmit={(e) => { e.preventDefault(); onAdd(); }}>
      <fieldset className="cl-kinds">
        <legend className="cl-label">{T("taskType")}</legend>
        <div className="cl-kinds-row">
          {KINDS.map((k) => (
            <label key={k} className={`cl-kind ${tf.kind === k ? "is-on" : ""}`} style={{ "--k": KIND_TONE[k][0], "--ks": KIND_TONE[k][1] }}>
              <input type="radio" name="cl-kind" value={k} checked={tf.kind === k}
                onChange={(e) => setTf({ ...tf, kind: e.target.value, ref: e.target.value === "lesson" ? ALL_LESSONS[0].id : e.target.value === "game" ? GAMES[0]?.id || "" : "" })} />
              <ClassKindGlyph kind={k} size={24} />
              <span>{T(kindKey[k])}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="cl-compose-grid">
        {tf.kind === "lesson" && (
          <label className="cl-field is-wide"><span className="cl-label">{T("kLesson")}</span>
            <select className="input" value={tf.ref} onChange={(e) => setTf({ ...tf, ref: e.target.value })}>{ALL_LESSONS.map((l) => <option key={l.id} value={l.id}>{l.id.split("-")[0]} · {lessonTitle(l, lang)}</option>)}</select>
          </label>
        )}
        {tf.kind === "game" && (
          <label className="cl-field is-wide"><span className="cl-label">{T("kGame")}</span>
            <select className="input" value={tf.ref} onChange={(e) => setTf({ ...tf, ref: e.target.value })}>{GAMES.map((g) => <option key={g.id} value={g.id}>{L(g.name, lang)}</option>)}</select>
          </label>
        )}
        <label className="cl-field is-wide"><span className="cl-label">{tf.kind === "custom" ? T("taskTitle") : T("titleOpt")}</span>
          <input className="input" value={tf.title} onChange={(e) => setTf({ ...tf, title: e.target.value })} maxLength={80} required={tf.kind === "custom"} />
        </label>
        <label className="cl-field"><span className="cl-label">{T("due")}</span>
          <input className="input" type="date" value={tf.due} onChange={(e) => setTf({ ...tf, due: e.target.value })} />
        </label>
      </div>
      <div className="cl-compose-row">
        <button type="button" className="btn ghost" onClick={onClose}>{T("close")}</button>
        <button type="submit" className="btn primary" disabled={tf.kind === "custom" && !tf.title.trim()}><Icon name="plus" size={18} />{T("addTask")}</button>
      </div>
    </form>
  );
}

export default function ClassView(p) {
  const { T, lang, user, authReady, teacher, setup, err, classes, cur, setCur, isOwner, members, tasks, subs, my, doneCount, ago, loading,
    name, setName, code, setCode, busy, copied, onCopy, tf, setTf, onMake, onEnter, onAddTask, onMark, onDropClass, onRemoveMember, onDeleteTask,
    pending, onConfirm, onCancel, tab0 } = p;
  const now = useClientDate();
  NOW = now ? now.getTime() : null;

  const ranked = useMemo(() => [...members].sort((a, b) => (b.week_xp || 0) - (a.week_xp || 0)), [members]);
  const [tab, setTab] = useState(tab0 || "tasks");
  const [composing, setComposing] = useState(false);

  const myDone = tasks.filter((t) => my(t)?.done).length;
  const doneBy = (uid) => subs.filter((s) => s.user_id === uid && s.done).length;
  const xpSum = members.reduce((a, m) => a + (m.week_xp || 0), 0);
  const maxXp = ranked[0]?.week_xp || 0;
  const activeToday = members.filter((m) => daysSince(m.last_active) <= 0).length;
  const addTask = async () => { await onAddTask(); };
  const cf = pending ? CONFIRM[pending.kind] : null;
  const formProps = { T, teacher, name, setName, code, setCode, busy, onMake, onEnter };

  const taskList = (
    <ul className="cl-tasks">
      {tasks.map((t) => (
        <Task key={t.id} t={t} T={T} lang={lang} isOwner={isOwner} sub={my(t)} doneN={doneCount(t)} members={members.length}
          onMark={onMark} onDelete={() => onDeleteTask(t)} />
      ))}
    </ul>
  );

  return (
    <div className="class-page cl">
      <header className="page-head cl-head">
        <div>
          <span className="kicker">{T("kicker")}</span>
          <h1>{T("title")}</h1>
          <p>{teacher ? T("subT") : T("subS")}</p>
        </div>
      </header>

      {!user ? (
        <section className="card cl-solo">
          <Empty kind="login" title={T("loginT")} text={authReady ? T("login") : "…"}>
            <Link href="/login" className="btn primary big"><Icon name="user" size={20} />{T("signin")}</Link>
          </Empty>
        </section>
      ) : setup ? (
        <section className="card cl-solo">
          <Empty kind="setup" title={T("setupT")} text={T("setup")} />
        </section>
      ) : loading ? (
        <div className="cl-skel" aria-busy="true" aria-live="polite">
          <div className="card cl-skel-hero"><i /><i /><i /></div>
          <div className="card cl-skel-list"><i /><i /><i /></div>
        </div>
      ) : (
        <>
          {err && <div className="alert cl-alert" role="alert"><Icon name="x" size={18} />{err}</div>}

          {classes.length > 1 && (
            <nav className="cl-switch" aria-label={T("myClasses")}>
              {classes.map((c) => (
                <button key={c.id} type="button" className={`cl-switch-b ${cur?.id === c.id ? "is-on" : ""}`} aria-pressed={cur?.id === c.id} onClick={() => setCur(c)}>
                  <Icon name={c.owner === user.id ? "star" : "home"} size={16} /><span dir="auto">{c.name}</span>
                </button>
              ))}
            </nav>
          )}

          {cur ? (
            <div className="cl-stack">
              {/* ── Сынып картасы ── */}
              <section className={`card cl-hero ${isOwner ? "is-owner" : "is-student"}`} aria-labelledby="cl-name">
                <div className="cl-hero-main">
                  <div className="cl-hero-id">
                    <ClassEmblem size={56} />
                    <div>
                      <span className={`cl-role ${isOwner ? "is-t" : ""}`}>{isOwner ? T("teacher") : T("student")}</span>
                      <h2 id="cl-name" className="cl-name" dir="auto">{cur.name}</h2>
                    </div>
                  </div>
                  {isOwner ? (
                    <ul className="cl-facts">
                      <li><Icon name="user" size={18} /><b>{members.length}</b><span>{T("students")}</span></li>
                      <li><Icon name="scroll" size={18} /><b>{tasks.length}</b><span>{T("tasks")}</span></li>
                      <li><Icon name="star" size={18} /><b>{xpSum}</b><span>{T("weekXp")}</span></li>
                      <li><Icon name="sun" size={18} /><b>{activeToday}</b><span>{T("activeToday")}</span></li>
                    </ul>
                  ) : (
                    <div className="cl-mine">
                      <ClassThreadRing done={myDone} total={tasks.length} size={84} label={`${myDone} / ${tasks.length} ${T("done")}`}>
                        <Avatar value={p.myAvatar} size={58} />
                      </ClassThreadRing>
                      <div>
                        <small>{T("progress")}</small>
                        <b>{myDone}<span>/{tasks.length}</span></b>
                        <span>{tasks.length > 0 && myDone >= tasks.length ? T("allDone") : T("done")}</span>
                      </div>
                    </div>
                  )}
                </div>
                {isOwner && <CodeBox code={cur.code} T={T} copied={copied} onCopy={onCopy} />}
                <div className="cl-hero-foot">
                  <button type="button" className="cl-danger-link" onClick={onDropClass}>
                    <Icon name={isOwner ? "x" : "logout"} size={16} className={isOwner ? "" : "cl-flip"} />{isOwner ? T("delClass") : T("leave")}
                  </button>
                </div>
              </section>

              {isOwner ? (
                <>
                  {/* ── Қойындылар: Тапсырмалар | Оқушылар ── */}
                  <div className="cl-tabs" role="tablist" aria-label={cur.name}>
                    <button type="button" role="tab" id="cl-tab-tasks" aria-controls="cl-panel-tasks" aria-selected={tab === "tasks"} className={tab === "tasks" ? "is-on" : ""} onClick={() => setTab("tasks")}>
                      <Icon name="scroll" size={18} />{T("tasks")}<span className="cl-count">{tasks.length}</span>
                    </button>
                    <button type="button" role="tab" id="cl-tab-people" aria-controls="cl-panel-people" aria-selected={tab === "people"} className={tab === "people" ? "is-on" : ""} onClick={() => setTab("people")}>
                      <Icon name="trophy" size={18} />{T("students")}<span className="cl-count">{members.length}</span>
                    </button>
                  </div>

                  {tab === "tasks" ? (
                    <section className="cl-panel" role="tabpanel" id="cl-panel-tasks" aria-labelledby="cl-tab-tasks">
                      {composing ? (
                        <Composer T={T} lang={lang} tf={tf} setTf={setTf} onAdd={addTask} onClose={() => setComposing(false)} />
                      ) : (
                        <button type="button" className="cl-new" onClick={() => setComposing(true)}>
                          <span className="cl-new-ic" aria-hidden="true"><Icon name="plus" size={20} /></span>
                          <span><b>{T("newTask")}</b><small>{T("kLesson")} · {T("kGame")} · {T("kCustom")}</small></span>
                        </button>
                      )}
                      {tasks.length === 0 ? (
                        <div className="card"><Empty kind="tasks" title={T("noTasks")} text={T("noTasksO")} small /></div>
                      ) : taskList}
                    </section>
                  ) : (
                    <section className="cl-panel" role="tabpanel" id="cl-panel-people" aria-labelledby="cl-tab-people">
                      {members.length === 0 ? (
                        <div className="card">
                          <Empty kind="desks" title={T("noStudentsT")} text={T("noStudents")} small>
                            <span className="cl-mini-code" translate="no">{cur.code}</span>
                          </Empty>
                        </div>
                      ) : (
                        <div className="card cl-board-card">
                          <Head id="cl-lead-h" icon={<Icon name="trophy" size={18} />} title={T("leaders")} />
                          <p className="cl-hint">{T("leadersHint")}</p>
                          <Leaders members={ranked} T={T} ago={ago} doneBy={doneBy} total={tasks.length} onRemove={onRemoveMember} maxXp={maxXp} />
                        </div>
                      )}
                    </section>
                  )}
                </>
              ) : (
                <section className="cl-panel" aria-labelledby="cl-my-h">
                  <Head id="cl-my-h" icon={<Icon name="scroll" size={18} />} title={T("myTasks")} count={tasks.length || null} />
                  {tasks.length === 0 ? (
                    <div className="card"><Empty kind="tasks" title={T("noTasks")} text={T("noTasksT")} small /></div>
                  ) : taskList}
                </section>
              )}

              {/* ── Тағы сынып / қосылу ── */}
              <section className="cl-more" aria-labelledby="cl-more-h">
                <h2 id="cl-more-h" className="cl-more-t">{T("another")}</h2>
                <Actions {...formProps} />
                {!teacher && <p className="cl-tip"><Icon name="sparkle" size={16} />{T("teacherTip")}</p>}
              </section>
            </div>
          ) : (
            /* ── Сынып жоқ ── */
            <div className="cl-stack">
              <section className="card cl-solo">
                <Empty kind={teacher ? "teacher" : "student"} title={T("noClassT")} text={teacher ? T("noClassTeacher") : T("noClassStudent")} />
              </section>
              <Actions {...formProps} />
              {!teacher && <p className="cl-tip"><Icon name="sparkle" size={16} />{T("teacherTip")}</p>}
            </div>
          )}
        </>
      )}

      <ClassConfirm open={!!pending} title={cf ? T(cf[0]) : ""} text={cf ? T(cf[1]) : ""} name={pending?.name} okLabel={cf ? T(cf[2]) : ""}
        cancelLabel={T("cancel")} onOk={onConfirm} onCancel={onCancel} />
    </div>
  );
}
