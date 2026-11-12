"use client";
// «Менің сыныбым» көрінісі: ауыл-жиын. Барлық күй мен Supabase шақырулары app/app/class/page.js ішінде,
// бұл файл тек сызады (сондықтан жалған деректермен де тексеруге болады).
import Link from "next/link";
import LangPicker from "./LangPicker";
import Avatar from "./Avatar";
import Icon from "./Icon";
import Qyran from "./Qyran";
import { ClassAul, ClassTaskArt, ClassRing, ClassSealRim } from "./ClassArt";
import { GAMES } from "../../lib/games";
import { ALL_LESSONS, lessonTitle } from "../../lib/course";
import { L } from "../../lib/i18n";

const todayISO = () => new Date().toISOString().slice(0, 10);
const KINDS = ["lesson", "game", "custom"];
const kindKey = { lesson: "kLesson", game: "kGame", custom: "kCustom" };

/* ── Мөр: сынып коды ── */
function ClassSeal({ code, T, copied, onCopy }) {
  return (
    <div className="cl-seal-wrap">
      <div className={`cl-seal ${copied ? "is-pressed" : ""}`}>
        <ClassSealRim />
        <span className="cl-seal-cap">{T("code")}</span>
        <b className="cl-seal-code" translate="no">{code}</b>
      </div>
      <button type="button" className={`btn small cl-copy ${copied ? "is-ok" : ""}`} onClick={onCopy} aria-live="polite">
        <Icon name={copied ? "check" : "stamp"} size={18} />
        <span>{copied ? T("copied") : T("copy")}</span>
      </button>
    </div>
  );
}

/* ── Код енгізу: алты ұяшық (нақты өріс — біреу, мөлдір, үстінде) ── */
function ClassCodeField({ code, setCode, T, id, onEnter, busy, big }) {
  const n = Math.max(6, code.length);
  return (
    <form className={`cl-join ${big ? "is-big" : ""}`} onSubmit={(e) => { e.preventDefault(); onEnter(); }}>
      <label className="cl-join-label" htmlFor={id}>{T("enterCode")}</label>
      <div className="cl-cells" style={{ "--n": n }}>
        <input id={id} className="cl-cells-input" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={8}
          autoComplete="off" autoCapitalize="characters" spellCheck={false} inputMode="text" />
        <div className="cl-cells-row" aria-hidden="true">
          {Array.from({ length: n }, (_, i) => (
            <span key={i} className={`cl-cell ${code[i] ? "is-on" : ""} ${i === Math.min(code.length, n - 1) ? "is-cur" : ""}`}>{code[i] || ""}</span>
          ))}
        </div>
      </div>
      <button type="submit" className="btn blue cl-join-btn" disabled={busy || !code.trim()}>
        <span>{T("joinBtn")}</span><Icon name="right" size={18} className="cl-flip" />
      </button>
    </form>
  );
}

function ClassCreate({ T, name, setName, busy, onMake, id, big }) {
  return (
    <form className={`cl-create ${big ? "is-big" : ""}`} onSubmit={(e) => { e.preventDefault(); onMake(); }}>
      <label className="cl-join-label" htmlFor={id}>{T("newClass")}</label>
      <div className="cl-create-row">
        <input id={id} className="input cl-create-in" placeholder={T("className")} value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
        <button type="submit" className="btn blue" disabled={busy || !name.trim()}><Icon name="plus" size={18} /><span>{T("create")}</span></button>
      </div>
    </form>
  );
}

/* ── Оқушы плиткасы ── */
function ClassMember({ m, i, T, li, ago, done, total, top, onRemove }) {
  const pct = total ? done / total : 0;
  const fresh = m.last_active && Math.floor((Date.now() - new Date(m.last_active).getTime()) / 86400000) <= 0;
  return (
    <li className="cl-member" style={{ "--i": i }}>
      <div className="cl-member-av">
        <ClassRing value={pct} size={76} stroke={5}><Avatar value={m.avatar} size={60} /></ClassRing>
        {(m.streak || 0) > 0 && <span className="cl-streak"><Icon name="flame" size={13} stroke={2.4} />{m.streak}</span>}
        {top && <span className="cl-top"><Icon name="trophy" size={14} stroke={2.2} /></span>}
      </div>
      <b className="cl-member-name">{m.name || "—"}</b>
      <small className="cl-member-seen"><i className={`cl-dot ${fresh ? "on" : ""}`} aria-hidden="true" /> {T("last")}: {ago(m.last_active, li)}</small>
      <dl className="cl-member-stats">
        <div title={T("weekXp")}><dt><Icon name="star" size={14} /><span className="sr-only">{T("weekXp")}</span></dt><dd>{m.week_xp || 0}</dd></div>
        <div title={T("lessons")}><dt><Icon name="book" size={14} /><span className="sr-only">{T("lessons")}</span></dt><dd>{m.lessons || 0}</dd></div>
        <div title={T("tasks")}><dt><Icon name="scroll" size={14} /><span className="sr-only">{T("tasks")}</span></dt><dd>{done}/{total}</dd></div>
      </dl>
      <button type="button" className="cl-x" aria-label={`${T("del")}: ${m.name || "—"}`} onClick={onRemove}><Icon name="x" size={16} /></button>
    </li>
  );
}

/* ── Тапсырма карточкасы ── */
function ClassTask({ t, i, T, lang, isOwner, sub, doneN, members, onMark, onDelete }) {
  const lesson = t.kind === "lesson" ? ALL_LESSONS.find((l) => l.id === t.ref) : null;
  const game = t.kind === "game" ? GAMES.find((g) => g.id === t.ref) : null;
  const done = !isOwner && sub?.done;
  const late = t.due && !done && t.due < todayISO();
  const what = lesson ? lessonTitle(lesson, lang) : game ? L(game.name, lang) : T("kCustom");
  const pct = members ? doneN / members : 0;
  return (
    <li className={`cl-task k-${t.kind} ${done ? "is-done" : ""}`} style={{ "--i": i }}>
      <span className="cl-pin" aria-hidden="true" />
      <div className="cl-task-art"><ClassTaskArt kind={t.kind} size={52} /></div>
      <div className="cl-task-body">
        <span className="cl-task-kind">{T(kindKey[t.kind] || "kCustom")}</span>
        <b className="cl-task-title">{t.title}</b>
        {what !== t.title && <small className="cl-task-what">{what}</small>}
      </div>
      <div className="cl-task-foot">
        {t.due && <span className={`cl-due ${late ? "is-late" : ""}`}><Icon name="sun" size={14} />{T("due")}: {t.due}</span>}
        {isOwner ? (
          <span className="cl-task-prog">
            <span className="cl-bar" aria-hidden="true"><i style={{ transform: `scaleX(${pct})` }} /></span>
            <small>{doneN} / {members} {T("done")}</small>
          </span>
        ) : done ? (
          <span className="cl-done-chip"><Icon name="check" size={14} stroke={3} />{T("done")}</span>
        ) : null}
      </div>
      {isOwner ? (
        <button type="button" className="cl-x" aria-label={`${T("del")}: ${t.title}`} onClick={onDelete}><Icon name="x" size={16} /></button>
      ) : done ? (
        <span className="cl-done-stamp" aria-hidden="true"><Icon name="check" size={22} stroke={3} /></span>
      ) : lesson ? (
        <Link className="btn gold small cl-task-go" href={`/app/course?l=${t.ref}`}>{T("start")}<Icon name="right" size={16} className="cl-flip" /></Link>
      ) : game ? (
        <Link className="btn gold small cl-task-go" href={`/app/games/${game.id}`}>{T("start")}<Icon name="right" size={16} className="cl-flip" /></Link>
      ) : t.kind === "custom" ? (
        <button type="button" className="btn ghost small cl-task-go" onClick={() => onMark(t)}><Icon name="check" size={16} />{T("mark")}</button>
      ) : null}
    </li>
  );
}

/* ── Тапсырма беру формасы ── */
function ClassComposer({ T, lang, tf, setTf, onAdd }) {
  return (
    <form className="cl-compose" onSubmit={(e) => { e.preventDefault(); onAdd(); }}>
      <div className="cl-kinds" role="radiogroup" aria-label={T("addTask")}>
        {KINDS.map((k) => (
          <label key={k} className={`cl-kind ${tf.kind === k ? "is-on" : ""}`}>
            <input type="radio" name="cl-kind" value={k} checked={tf.kind === k}
              onChange={(e) => setTf({ ...tf, kind: e.target.value, ref: e.target.value === "lesson" ? ALL_LESSONS[0].id : e.target.value === "game" ? GAMES[0].id : "" })} />
            <ClassTaskArt kind={k} size={40} />
            <span>{T(kindKey[k])}</span>
          </label>
        ))}
      </div>
      <div className="cl-compose-fields">
        {tf.kind === "lesson" && <select className="input cl-f-ref" aria-label={T("kLesson")} value={tf.ref} onChange={(e) => setTf({ ...tf, ref: e.target.value })}>{ALL_LESSONS.map((l) => <option key={l.id} value={l.id}>{l.id.split("-")[0]} · {lessonTitle(l, lang)}</option>)}</select>}
        {tf.kind === "game" && <select className="input cl-f-ref" aria-label={T("kGame")} value={tf.ref} onChange={(e) => setTf({ ...tf, ref: e.target.value })}>{GAMES.map((g) => <option key={g.id} value={g.id}>{L(g.name, lang)}</option>)}</select>}
        <input className="input cl-f-title" placeholder={T("taskTitle")} aria-label={T("taskTitle")} value={tf.title} onChange={(e) => setTf({ ...tf, title: e.target.value })} maxLength={80} />
        <label className="cl-f-due"><span>{T("due")}</span><input className="input" type="date" value={tf.due} onChange={(e) => setTf({ ...tf, due: e.target.value })} /></label>
        <button type="submit" className="btn gold cl-f-go"><Icon name="plus" size={18} />{T("addTask")}</button>
      </div>
    </form>
  );
}

function SecHead({ icon, title, count }) {
  return (
    <div className="cl-sec-head">
      <span className="cl-sec-ic"><Icon name={icon} size={18} /></span>
      <h3>{title}</h3>
      {count != null && <span className="cl-count">{count}</span>}
    </div>
  );
}

export default function ClassView(p) {
  const { T, li, lang, user, authReady, teacher, setup, err, classes, cur, setCur, isOwner, members, tasks, subs, my, doneCount, ago,
    name, setName, code, setCode, busy, copied, onCopy, tf, setTf, onMake, onEnter, onAddTask, onMark, onDropClass, onRemoveMember, onDeleteTask } = p;

  const myDone = tasks.filter((t) => my(t)?.done).length;
  const doneBy = (uid) => subs.filter((s) => s.user_id === uid && s.done).length;
  const xpSum = members.reduce((a, m) => a + (m.week_xp || 0), 0);
  const topXp = members.reduce((a, m) => Math.max(a, m.week_xp || 0), 0);

  return (
    <div className="class-page cl">
      <header className="page-head">
        <div>
          <span className="kicker">{T("kicker")}</span>
          <h1>{T("title")}</h1>
          <p>{teacher ? T("subT") : T("subS")}</p>
        </div>
        <div className="head-tools"><LangPicker /></div>
      </header>

      {!user ? (
        <section className="cl-gate">
          <div className="cl-gate-art"><ClassAul /><Qyran mood={authReady ? "support" : "sleep"} size={104} className="cl-gate-q" /></div>
          <div className="cl-gate-body">
            <p className="cl-gate-lead">{authReady ? T("login") : "…"}</p>
            <Link href="/login" className="btn blue big"><Icon name="user" size={20} />{T("signin")}</Link>
          </div>
        </section>
      ) : setup ? (
        <section className="cl-gate">
          <div className="cl-gate-art"><ClassAul night /><Qyran mood="think" size={104} className="cl-gate-q" /></div>
          <div className="cl-gate-body"><p className="cl-setup"><Icon name="lock" size={18} />{T("setup")}</p></div>
        </section>
      ) : (
        <>
          {err && <div className="alert cl-alert" role="alert"><Icon name="x" size={18} />{err}</div>}
          {classes.length > 1 && (
            <nav className="cl-tabs" aria-label={T("title")}>
              {classes.map((c) => (
                <button key={c.id} type="button" className={`cl-tab ${cur?.id === c.id ? "is-on" : ""}`} aria-pressed={cur?.id === c.id} onClick={() => setCur(c)}>
                  <Icon name={c.owner === user.id ? "star" : "home"} size={16} />{c.name}
                </button>
              ))}
            </nav>
          )}

          {cur ? (
            <div className="cl-grid">
              <div className="cl-main">
                {/* ── Ту-баннер ── */}
                <section className={`cl-banner ${isOwner ? "is-owner" : "is-student"}`} aria-labelledby="cl-name">
                  <div className="cl-banner-body">
                    <h2 id="cl-name" className="cl-name">{cur.name}</h2>
                    {isOwner ? (
                      <ul className="cl-facts">
                        <li><Icon name="user" size={16} /><b>{members.length}</b><span>{T("students")}</span></li>
                        <li><Icon name="scroll" size={16} /><b>{tasks.length}</b><span>{T("tasks")}</span></li>
                        <li><Icon name="star" size={16} /><b>{xpSum}</b><span>{T("weekXp")}</span></li>
                      </ul>
                    ) : (
                      <div className="cl-mine">
                        <ClassRing value={tasks.length ? myDone / tasks.length : 0} size={64} stroke={6}>
                          <Avatar value={p.myAvatar} size={48} />
                        </ClassRing>
                        <span><b>{myDone}/{tasks.length}</b> {T("done")}</span>
                      </div>
                    )}
                  </div>
                  <div className="cl-banner-foot">
                    <button type="button" className="cl-drop" onClick={onDropClass}>
                      <Icon name={isOwner ? "x" : "logout"} size={16} className={isOwner ? "" : "cl-flip"} />{isOwner ? T("del") : T("leave")}
                    </button>
                  </div>
                  <div className="cl-banner-art"><ClassAul /></div>
                  {isOwner && <ClassSeal code={cur.code} T={T} copied={copied} onCopy={onCopy} />}
                </section>

                {/* ── Оқушылар шеңбері ── */}
                {isOwner && (
                  <section className="cl-sec cl-people">
                    <SecHead icon="user" title={T("students")} count={members.length} />
                    {members.length === 0 ? (
                      <div className="cl-empty-row">
                        <Qyran mood="wow" size={84} />
                        <div>
                          <p>{T("noStudents")}</p>
                          <span className="cl-mini-code" translate="no"><Icon name="stamp" size={16} />{cur.code}</span>
                        </div>
                      </div>
                    ) : (
                      <ul className="cl-members">
                        {members.map((m, i) => (
                          <ClassMember key={m.user_id} m={m} i={i} T={T} li={li} ago={ago} done={doneBy(m.user_id)} total={tasks.length}
                            top={topXp > 0 && (m.week_xp || 0) === topXp} onRemove={() => onRemoveMember(m)} />
                        ))}
                      </ul>
                    )}
                  </section>
                )}

                {/* ── Киіз тақта: тапсырмалар ── */}
                <section className="cl-sec cl-board-sec">
                  <SecHead icon="scroll" title={isOwner ? T("tasks") : T("myTasks")} count={tasks.length || null} />
                  {isOwner && <ClassComposer T={T} lang={lang} tf={tf} setTf={setTf} onAdd={onAddTask} />}
                  {tasks.length === 0 ? (
                    <div className="cl-empty-row cl-board-empty">
                      <Qyran mood={isOwner ? "idle" : "sleep"} size={84} />
                      <p>{T("noTasks")}</p>
                    </div>
                  ) : (
                    <ul className="cl-board">
                      {tasks.map((t, i) => (
                        <ClassTask key={t.id} t={t} i={i} T={T} lang={lang} isOwner={isOwner} sub={my(t)} doneN={doneCount(t)} members={members.length}
                          onMark={onMark} onDelete={() => onDeleteTask(t)} />
                      ))}
                    </ul>
                  )}
                </section>
              </div>

              <aside className="cl-side">
                {teacher && (
                  <section className="cl-card">
                    <span className="cl-card-ic"><Icon name="plus" size={18} /></span>
                    <ClassCreate T={T} name={name} setName={setName} busy={busy} onMake={onMake} id="cl-new" />
                  </section>
                )}
                <section className="cl-card">
                  <span className="cl-card-ic"><Icon name="stamp" size={18} /></span>
                  <h3 className="cl-card-t">{T("join")}</h3>
                  <ClassCodeField code={code} setCode={setCode} T={T} id="cl-code" onEnter={onEnter} busy={busy} />
                </section>
                {!teacher && <p className="cl-tip"><Icon name="sparkle" size={16} />{T("teacherTip")}</p>}
              </aside>
            </div>
          ) : (
            /* ── Сынып жоқ: қақпа ── */
            <section className={`cl-gate cl-welcome ${teacher ? "is-teacher" : "is-student"}`}>
              <div className="cl-gate-art"><ClassAul /><Qyran mood={teacher ? "cheer" : "happy"} size={104} className="cl-gate-q" /></div>
              <div className="cl-gate-body">
                {teacher && <ClassCreate T={T} name={name} setName={setName} busy={busy} onMake={onMake} id="cl-new" big />}
                {teacher && <div className="cl-or" aria-hidden="true"><Icon name="stamp" size={16} /></div>}
                <div className="cl-gate-join">
                  <h3 className="cl-card-t">{T("join")}</h3>
                  <ClassCodeField code={code} setCode={setCode} T={T} id="cl-code" onEnter={onEnter} busy={busy} big={!teacher} />
                </div>
                {!teacher && <p className="cl-tip"><Icon name="sparkle" size={16} />{T("teacherTip")}</p>}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
