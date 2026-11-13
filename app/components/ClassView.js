"use client";
// «Менің сыныбым» көрінісі: «Жұлдызды аспан». Мұғалім — Темірқазық (орталықта), оқушылар — айналасындағы жұлдыздар,
// тапсырмалар — жолдар/орбиталар. Барлық күй мен Supabase шақырулары app/app/class/page.js ішінде; бұл файл тек сызады.
import { useMemo, useState } from "react";
import Link from "next/link";
import LangPicker from "./LangPicker";
import Avatar from "./Avatar";
import Icon from "./Icon";
import Qyran from "./Qyran";
import { ClassStarfield, ClassStarGlyph, ClassPoleStar, ClassGlyph, ClassMoon, ClassOrbit, ClassDipper, ClassPleiades } from "./ClassArt";
import { GAMES } from "../../lib/games";
import { ALL_LESSONS, lessonTitle } from "../../lib/course";
import { L } from "../../lib/i18n";

const todayISO = () => new Date().toISOString().slice(0, 10);
const KINDS = ["lesson", "game", "custom"];
const kindKey = { lesson: "kLesson", game: "kGame", custom: "kCustom" };
const DAY = 86400000;
const daysSince = (iso) => (iso ? Math.floor((Date.now() - new Date(iso).getTime()) / DAY) : Infinity);
const daysTo = (d) => Math.round((new Date(d + "T00:00:00Z").getTime() - new Date(todayISO() + "T00:00:00Z").getTime()) / DAY);

/* Тек осы көрініске қажет жазулар — 11 тілде (V_LANGS ретімен). */
const V_LANGS = ["kk", "ru", "en", "zh", "es", "de", "fr", "tr", "ar", "ko", "ja"];
let VI = 2; // ағымдағы тілдің индексі (негізгі компонент әр рендерде қояды)
const V = {
  sky: ["Аспан", "Небо", "Sky", "天空", "Cielo", "Himmel", "Ciel", "Gökyüzü", "السماء", "하늘", "空"],
  list: ["Тізім", "Список", "List", "列表", "Lista", "Liste", "Liste", "Liste", "قائمة", "목록", "リスト"],
  view: ["Көрініс", "Вид", "View", "视图", "Vista", "Ansicht", "Vue", "Görünüm", "العرض", "보기", "表示"],
  pole: ["Темірқазық", "Темирказык", "Pole Star", "北极星", "Estrella Polar", "Polarstern", "Étoile polaire", "Kutup Yıldızı", "النجم القطبي", "북극성", "北極星"],
  you: ["сен — мұғалім", "вы — учитель", "you, the teacher", "你是老师", "tú, el profesor", "du, die Lehrkraft", "toi, l’enseignant", "sen, öğretmen", "أنت المعلّم", "선생님(나)", "あなた（先生）"],
  pick: ["Жұлдызды бас — оқушы туралы толығырақ көрсетіледі.", "Нажмите на звезду, чтобы увидеть ученика.", "Tap a star to see the student.", "点击星星查看学生信息。", "Toca una estrella para ver al estudiante.", "Tippe auf einen Stern, um die Schülerin oder den Schüler zu sehen.", "Touche une étoile pour voir l’élève.", "Öğrenciyi görmek için bir yıldıza dokun.", "اضغط على نجمة لعرض الطالب.", "별을 누르면 학생 정보가 보여요.", "星をタップすると生徒の情報が見られます。"],
  streak: ["күн қатар", "дней подряд", "day streak", "连续天数", "días seguidos", "Tage in Folge", "jours d’affilée", "gün üst üste", "أيام متتالية", "일 연속", "日連続"],
  or: ["немесе", "или", "or", "或", "o", "oder", "ou", "veya", "أو", "또는", "または"],
  rank: ["Жарқырауы бойынша", "По яркости", "By brightness", "按亮度", "Por brillo", "Nach Helligkeit", "Par éclat", "Parlaklığa göre", "حسب السطوع", "밝기순", "明るさ順"],
  legend: ["Үлкен жұлдыз — көп апталық XP · жыпылықтау — бүгін кірді · жалын — қатарынан күндер", "Крупнее звезда — больше XP за неделю · мерцает — заходил сегодня · пламя — серия дней", "Bigger star — more week XP · pulse — active today · flame — streak", "星越大——本周 XP 越多 · 闪烁——今天来过 · 火焰——连续天数", "Estrella más grande: más XP semanal · parpadeo: activo hoy · llama: racha", "Größerer Stern – mehr Wochen-XP · Funkeln – heute aktiv · Flamme – Serie", "Plus grande étoile : plus d’XP cette semaine · scintille : actif aujourd’hui · flamme : série", "Büyük yıldız: daha çok haftalık XP · parıltı: bugün aktif · alev: seri", "نجمة أكبر = نقاط XP أسبوعية أكثر · وميض = نشط اليوم · لهب = أيام متتالية", "큰 별 — 주간 XP 많음 · 반짝임 — 오늘 접속 · 불꽃 — 연속 학습", "大きな星＝今週のXPが多い · またたき＝今日アクティブ · 炎＝連続日数"],
  emptySky: ["Аспан әзірге бос", "Небо пока пустое", "The sky is empty for now", "天空暂时是空的", "El cielo está vacío por ahora", "Der Himmel ist noch leer", "Le ciel est vide pour l’instant", "Gökyüzü şimdilik boş", "السماء فارغة حاليًا", "아직 하늘이 비어 있어요", "空はまだ空っぽです"],
  progress: ["Менің жолым", "Мой путь", "My path", "我的进度", "Mi camino", "Mein Weg", "Mon parcours", "Yolum", "مساري", "나의 길", "わたしの道"],
  late: ["мерзімі өтті", "просрочено", "overdue", "已逾期", "vencida", "überfällig", "en retard", "süresi geçti", "متأخرة", "기한 지남", "期限切れ"],
  activeToday: ["бүгін белсенді", "активны сегодня", "active today", "今天活跃", "activos hoy", "heute aktiv", "actifs aujourd’hui", "bugün aktif", "نشطون اليوم", "오늘 활동", "今日アクティブ"],
};

/* ── Жұлдыздарды орбиталарға орналастыру (детерминистік) ── */
function skyLayout(n) {
  if (!n) return [];
  const k = n <= 7 ? 1 : n <= 18 ? 2 : n <= 32 ? 3 : 4;
  const radii = { 1: [0.62], 2: [0.56, 0.95], 3: [0.4, 0.69, 0.96], 4: [0.34, 0.56, 0.78, 0.98] }[k];
  const sum = radii.reduce((a, r) => a + r, 0);
  const counts = radii.map((r) => Math.max(1, Math.round((n * r) / sum)));
  counts[counts.length - 1] += n - counts.reduce((a, c) => a + c, 0);
  const out = [];
  radii.forEach((r, ri) => {
    const c = counts[ri];
    for (let j = 0; j < c; j++) {
      const deg = -90 + (360 / c) * j + (ri % 2 ? 180 / c : 0) + 14 * ri + 8;
      const a = (deg * Math.PI) / 180;
      out.push({ r, deg: Math.round(deg), cx: +Math.cos(a).toFixed(4), sy: +Math.sin(a).toFixed(4) });
    }
  });
  return out.slice(0, n);
}

/* ── Сынып коды: шоқжұлдыз ── */
const LIFT = [0, -12, 6, -8, 10, -4, 4, -10];
function ClassCode({ code, T, copied, onCopy }) {
  const ch = String(code || "").split("");
  const n = ch.length || 1;
  const pts = ch.map((_, i) => `${(((i + 0.5) / n) * 100).toFixed(2)},${(50 + (LIFT[i % 8] / 92) * 100).toFixed(2)}`).join(" ");
  return (
    <div className={`cl-code ${copied ? "is-copied" : ""}`}>
      <span className="cl-code-cap" id="cl-code-cap">{T("code")}</span>
      <div className="cl-code-sky" style={{ "--n": n }} aria-labelledby="cl-code-cap" role="group">
        <svg className="cl-code-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
        </svg>
        <b className="cl-code-plates" translate="no">
          {ch.map((c, i) => (
            <span key={i} className="cl-plate" style={{ "--i": i, "--lift": `${LIFT[i % 8]}px` }}>{c}</span>
          ))}
        </b>
      </div>
      <button type="button" className={`cl-copy ${copied ? "is-ok" : ""}`} onClick={onCopy}>
        <Icon name={copied ? "check" : "stamp"} size={18} />
        <span aria-live="polite">{copied ? T("copied") : T("copy")}</span>
      </button>
    </div>
  );
}

/* ── Код енгізу: алты жұлдыз-ұяшық, артында бір нақты өріс ── */
function ClassCodeField({ code, setCode, T, id, onEnter, busy, big }) {
  const n = Math.max(6, code.length);
  return (
    <form className={`cl-join ${big ? "is-big" : ""}`} onSubmit={(e) => { e.preventDefault(); onEnter(); }}>
      <label className="cl-label" htmlFor={id}>{T("enterCode")}</label>
      <div className="cl-cells" style={{ "--n": n }}>
        <input id={id} className="cl-cells-input" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={8}
          autoComplete="off" autoCapitalize="characters" spellCheck={false} inputMode="text" />
        <div className="cl-cells-row" aria-hidden="true">
          {Array.from({ length: n }, (_, i) => (
            <span key={i} className={`cl-cell ${code[i] ? "is-on" : ""} ${i === Math.min(code.length, n - 1) ? "is-cur" : ""}`}>
              {code[i] || <ClassStarGlyph className="cl-cell-star" />}
            </span>
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
      <label className="cl-label cl-create-t" htmlFor={id}>{T("newClass")}</label>
      <div className="cl-create-row">
        <input id={id} className="input cl-create-in" placeholder={T("className")} value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
        <button type="submit" className="btn blue" disabled={busy || !name.trim()}><Icon name="plus" size={18} /><span>{T("create")}</span></button>
      </div>
    </form>
  );
}

/* ── Жұлдыздар аспаны (мұғалім) ── */
function ClassSky({ members, T, li, ago, sel, onSel, maxXp }) {
  const ranked = members;
  const pos = useMemo(() => skyLayout(ranked.length), [ranked.length]);
  const rings = [...new Set(pos.map((p) => p.r))];
  return (
    <div className="cl-skyfield">
      {rings.map((r) => <span key={r} className="cl-ring" style={{ "--r": r }} aria-hidden="true" />)}
      <div className="cl-pole" aria-hidden="true">
        <ClassPoleStar size={72} />
        <b>{V.pole[VI]}</b>
        <small>{V.you[VI]}</small>
      </div>
      <ul className="cl-stars">
        {ranked.map((m, i) => {
          const p = pos[i];
          const b = maxXp ? (m.week_xp || 0) / maxXp : 0;
          const size = Math.round(14 + 22 * Math.sqrt(b));
          const fresh = daysSince(m.last_active) <= 0;
          const st = m.streak || 0;
          const label = `${m.name || "—"}: ${m.week_xp || 0} ${T("weekXp")}, ${m.lessons || 0} ${T("lessons")}, ${st} ${V.streak[VI]}, ${T("last")}: ${ago(m.last_active, li)}`;
          return (
            <li key={m.user_id} className="cl-star-li" style={{ "--r": p.r, "--c": p.cx, "--s": p.sy, "--i": i }}>
              <button type="button" className={`cl-star ${sel === m.user_id ? "is-sel" : ""} ${fresh ? "is-fresh" : ""} ${b === 0 ? "is-dim" : ""}`}
                style={{ "--sz": `${size}px`, "--deg": `${p.deg}deg`, "--tail": `${12 + Math.min(st, 14) * 2.2}px` }}
                aria-pressed={sel === m.user_id} aria-controls="cl-star-card" aria-label={label} onClick={() => onSel(m.user_id)}>
                <span className="cl-star-pt">
                  {st > 0 && <span className="cl-tail" aria-hidden="true" />}
                  {fresh && <span className="cl-pulse" aria-hidden="true" />}
                  <span className="cl-halo" aria-hidden="true" />
                  <ClassStarGlyph />
                </span>
                <span className="cl-star-name" dir="auto">{(m.name || "—").split(" ")[0]}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ClassStarCard({ m, T, li, ago, done, total, rank, onRemove }) {
  if (!m) return <div className="cl-card-star is-hint" id="cl-star-card" aria-live="polite"><ClassPleiades /><p>{V.pick[VI]}</p></div>;
  const fresh = daysSince(m.last_active) <= 0;
  return (
    <div className="cl-card-star" id="cl-star-card" aria-live="polite">
      <div className="cl-card-head">
        <ClassOrbit done={done} total={total} size={76} label={`${done} / ${total} ${T("done")}`}>
          <Avatar value={m.avatar} size={52} />
        </ClassOrbit>
        <div className="cl-card-who">
          <span className="cl-rank">#{rank}</span>
          <b dir="auto">{m.name || "—"}</b>
          <small><i className={`cl-dot ${fresh ? "on" : ""}`} aria-hidden="true" />{T("last")}: {ago(m.last_active, li)}</small>
        </div>
      </div>
      <dl className="cl-stats">
        <div><dt><Icon name="star" size={15} />{T("weekXp")}</dt><dd>{m.week_xp || 0}</dd></div>
        <div><dt><Icon name="book" size={15} />{T("lessons")}</dt><dd>{m.lessons || 0}</dd></div>
        <div><dt><Icon name="scroll" size={15} />{T("tasks")}</dt><dd>{done}/{total}</dd></div>
        <div><dt><Icon name="flame" size={15} />{V.streak[VI]}</dt><dd>{m.streak || 0}</dd></div>
      </dl>
      <button type="button" className="cl-drop" onClick={onRemove}><Icon name="x" size={16} />{T("del")}</button>
    </div>
  );
}

function ClassList({ members, T, li, ago, doneBy, total, onRemove, maxXp }) {
  return (
    <ol className="cl-list">
      {members.map((m, i) => {
        const fresh = daysSince(m.last_active) <= 0;
        const d = doneBy(m.user_id);
        return (
          <li key={m.user_id} className="cl-row" style={{ "--i": i, "--b": maxXp ? (m.week_xp || 0) / maxXp : 0 }}>
            <span className="cl-row-n">{i + 1}</span>
            <Avatar value={m.avatar} size={40} />
            <div className="cl-row-who">
              <b dir="auto">{m.name || "—"}</b>
              <small><i className={`cl-dot ${fresh ? "on" : ""}`} aria-hidden="true" />{T("last")}: {ago(m.last_active, li)}</small>
            </div>
            <dl className="cl-row-stats">
              <div title={T("weekXp")}><dt><Icon name="star" size={14} /><span className="sr-only">{T("weekXp")}</span></dt><dd>{m.week_xp || 0}</dd></div>
              <div title={T("lessons")}><dt><Icon name="book" size={14} /><span className="sr-only">{T("lessons")}</span></dt><dd>{m.lessons || 0}</dd></div>
              <div title={T("tasks")}><dt><Icon name="scroll" size={14} /><span className="sr-only">{T("tasks")}</span></dt><dd>{d}/{total}</dd></div>
              <div title={V.streak[VI]}><dt><Icon name="flame" size={14} /><span className="sr-only">{V.streak[VI]}</span></dt><dd>{m.streak || 0}</dd></div>
            </dl>
            <button type="button" className="cl-x" aria-label={`${T("del")}: ${m.name || "—"}`} onClick={() => onRemove(m)}><Icon name="x" size={16} /></button>
          </li>
        );
      })}
    </ol>
  );
}

/* ── Тапсырма — жол ── */
function ClassTask({ t, i, T, li, lang, isOwner, sub, doneN, members, onMark, onDelete }) {
  const lesson = t.kind === "lesson" ? ALL_LESSONS.find((l) => l.id === t.ref) : null;
  const game = t.kind === "game" ? GAMES.find((g) => g.id === t.ref) : null;
  const done = !isOwner && sub?.done;
  const late = t.due && !done && t.due < todayISO();
  const what = lesson ? lessonTitle(lesson, lang) : game ? L(game.name, lang) : T("kCustom");
  return (
    <li className={`cl-task k-${t.kind} ${done ? "is-done" : ""} ${late ? "is-late" : ""}`} style={{ "--i": i }}>
      <span className="cl-task-glyph"><ClassGlyph kind={t.kind} size={30} /></span>
      <div className="cl-task-body">
        <span className="cl-task-kind">{T(kindKey[t.kind] || "kCustom")}</span>
        <b className="cl-task-title" dir="auto">{t.title}</b>
        {what !== t.title && <small className="cl-task-what">{what}</small>}
        {t.due && (
          <span className={`cl-due ${late ? "is-late" : ""}`}>
            <ClassMoon days={daysTo(t.due)} late={late} />
            {T("due")}: {t.due}
          </span>
        )}
        {late && <em className="cl-late">{V.late[VI]}</em>}
      </div>
      <div className="cl-task-side">
        {isOwner ? (
          <ClassOrbit done={doneN} total={members} size={64} label={`${doneN} / ${members} ${T("done")}`}>
            <b>{doneN}</b><small>/{members}</small>
          </ClassOrbit>
        ) : done ? (
          <span className="cl-done-chip"><Icon name="check" size={16} stroke={3} />{T("done")}</span>
        ) : lesson ? (
          <Link className="btn blue small cl-task-go" href={`/app/course?l=${t.ref}`}>{T("start")}<Icon name="right" size={16} className="cl-flip" /></Link>
        ) : game ? (
          <Link className="btn blue small cl-task-go" href={`/app/games/${game.id}`}>{T("start")}<Icon name="right" size={16} className="cl-flip" /></Link>
        ) : t.kind === "custom" ? (
          <button type="button" className="cl-line-btn cl-task-go" onClick={() => onMark(t)}><Icon name="check" size={16} />{T("mark")}</button>
        ) : null}
      </div>
      {isOwner && <button type="button" className="cl-x" aria-label={`${T("del")}: ${t.title}`} onClick={onDelete}><Icon name="x" size={16} /></button>}
    </li>
  );
}

/* ── Тапсырма беру формасы (ашық панель) ── */
function ClassComposer({ T, lang, tf, setTf, onAdd }) {
  return (
    <form className="cl-compose" onSubmit={(e) => { e.preventDefault(); onAdd(); }}>
      <fieldset className="cl-kinds">
        <legend className="cl-compose-t">{T("addTask")}</legend>
        <div className="cl-kinds-row">
        {KINDS.map((k) => (
          <label key={k} className={`cl-kind ${tf.kind === k ? "is-on" : ""}`}>
            <input type="radio" name="cl-kind" value={k} checked={tf.kind === k}
              onChange={(e) => setTf({ ...tf, kind: e.target.value, ref: e.target.value === "lesson" ? ALL_LESSONS[0].id : e.target.value === "game" ? GAMES[0].id : "" })} />
            <ClassGlyph kind={k} size={26} />
            <span>{T(kindKey[k])}</span>
          </label>
        ))}
        </div>
      </fieldset>
      <div className="cl-compose-fields">
        {tf.kind === "lesson" && <select className="input cl-f-ref" aria-label={T("kLesson")} value={tf.ref} onChange={(e) => setTf({ ...tf, ref: e.target.value })}>{ALL_LESSONS.map((l) => <option key={l.id} value={l.id}>{l.id.split("-")[0]} · {lessonTitle(l, lang)}</option>)}</select>}
        {tf.kind === "game" && <select className="input cl-f-ref" aria-label={T("kGame")} value={tf.ref} onChange={(e) => setTf({ ...tf, ref: e.target.value })}>{GAMES.map((g) => <option key={g.id} value={g.id}>{L(g.name, lang)}</option>)}</select>}
        <input className="input cl-f-title" placeholder={T("taskTitle")} aria-label={T("taskTitle")} value={tf.title} onChange={(e) => setTf({ ...tf, title: e.target.value })} maxLength={80} />
        <label className="cl-f-due"><span>{T("due")}</span><input className="input" type="date" value={tf.due} onChange={(e) => setTf({ ...tf, due: e.target.value })} /></label>
        <button type="submit" className="btn blue cl-f-go"><Icon name="plus" size={18} />{T("addTask")}</button>
      </div>
    </form>
  );
}

function SecHead({ title, count, children }) {
  return (
    <div className="cl-sec-head">
      <h3>{title}</h3>
      {count != null && <span className="cl-count">{count}</span>}
      {children}
    </div>
  );
}

/* ── Бос аспан (кіру / баптау / сынып жоқ) ── */
function EmptySky({ mood, children, cls = "" }) {
  return (
    <section className={`cl-empty ${cls}`}>
      <div className="cl-empty-sky" aria-hidden="true">
        <ClassDipper className="cl-empty-dipper" />
        <span className="cl-empty-pole"><ClassPoleStar size={44} /></span>
        <Qyran mood={mood} size={128} className="cl-empty-q" />
      </div>
      <div className="cl-empty-body">{children}</div>
    </section>
  );
}

export default function ClassView(p) {
  const { T, li, lang, user, authReady, teacher, setup, err, classes, cur, setCur, isOwner, members, tasks, subs, my, doneCount, ago,
    name, setName, code, setCode, busy, copied, onCopy, tf, setTf, onMake, onEnter, onAddTask, onMark, onDropClass, onRemoveMember, onDeleteTask } = p;
  VI = Math.max(0, V_LANGS.indexOf(lang)); if (VI < 0 || !V_LANGS.includes(lang)) VI = 2;

  const ranked = useMemo(() => [...members].sort((a, b) => (b.week_xp || 0) - (a.week_xp || 0)), [members]);
  const [mode, setMode] = useState(null);
  const view = mode || (ranked.length > 24 ? "list" : "sky");
  const [selId, setSel] = useState(null);
  const sel = ranked.find((m) => m.user_id === selId) || ranked[0] || null;

  const myDone = tasks.filter((t) => my(t)?.done).length;
  const doneBy = (uid) => subs.filter((s) => s.user_id === uid && s.done).length;
  const xpSum = members.reduce((a, m) => a + (m.week_xp || 0), 0);
  const maxXp = ranked[0]?.week_xp || 0;
  const activeToday = members.filter((m) => daysSince(m.last_active) <= 0).length;

  return (
    <div className="class-page cl">
      <ClassStarfield />
      <header className="page-head cl-head">
        <div>
          <span className="kicker">{T("kicker")}</span>
          <h1>{T("title")}</h1>
          <p>{teacher ? T("subT") : T("subS")}</p>
        </div>
        <div className="head-tools"><LangPicker /></div>
      </header>

      {!user ? (
        <EmptySky mood={authReady ? "support" : "sleep"}>
          <h2 className="cl-empty-t">{V.emptySky[VI]}</h2>
          <p className="cl-empty-p">{authReady ? T("login") : "…"}</p>
          <Link href="/login" className="btn blue big cl-cta"><Icon name="user" size={20} />{T("signin")}</Link>
        </EmptySky>
      ) : setup ? (
        <EmptySky mood="think">
          <p className="cl-setup"><Icon name="lock" size={18} />{T("setup")}</p>
        </EmptySky>
      ) : (
        <>
          {err && <div className="cl-alert" role="alert"><Icon name="x" size={18} />{err}</div>}
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
            <div className="cl-stack">
              {/* ── Сынып: аспан тақырыбы ── */}
              <section className={`cl-hero ${isOwner ? "is-owner" : "is-student"}`} aria-labelledby="cl-name">
                <ClassDipper className="cl-hero-dipper" />
                <div className="cl-hero-body">
                  <h2 id="cl-name" className="cl-name" dir="auto">{cur.name}</h2>
                  {isOwner ? (
                    <ul className="cl-facts">
                      <li><b>{members.length}</b><span>{T("students")}</span></li>
                      <li><b>{tasks.length}</b><span>{T("tasks")}</span></li>
                      <li><b>{xpSum}</b><span>{T("weekXp")}</span></li>
                      <li><b>{activeToday}</b><span>{V.activeToday[VI]}</span></li>
                    </ul>
                  ) : (
                    <div className="cl-mine">
                      <ClassOrbit done={myDone} total={tasks.length} size={92} label={`${myDone} / ${tasks.length} ${T("done")}`}>
                        <Avatar value={p.myAvatar} size={60} />
                      </ClassOrbit>
                      <div><small>{V.progress[VI]}</small><b>{myDone}/{tasks.length}</b><span>{T("done")}</span></div>
                    </div>
                  )}
                  <button type="button" className="cl-drop" onClick={onDropClass}>
                    <Icon name={isOwner ? "x" : "logout"} size={16} className={isOwner ? "" : "cl-flip"} />{isOwner ? T("del") : T("leave")}
                  </button>
                </div>
                {isOwner && <ClassCode code={cur.code} T={T} copied={copied} onCopy={onCopy} />}
              </section>

              {/* ── Аспан / Тізім ── */}
              {isOwner && (
                <section className="cl-sec cl-people" aria-labelledby="cl-people-h">
                  <SecHead title={<span id="cl-people-h">{T("students")}</span>} count={members.length}>
                    {members.length > 0 && (
                      <div className="cl-toggle" role="group" aria-label={V.view[VI]}>
                        <button type="button" aria-pressed={view === "sky"} onClick={() => setMode("sky")}><Icon name="star" size={15} />{V.sky[VI]}</button>
                        <button type="button" aria-pressed={view === "list"} onClick={() => setMode("list")}><Icon name="menu" size={15} />{V.list[VI]}</button>
                      </div>
                    )}
                  </SecHead>
                  {members.length === 0 ? (
                    <div className="cl-quiet">
                      <Qyran mood="sleep" size={96} />
                      <div>
                        <p>{T("noStudents")}</p>
                        <span className="cl-mini-code" translate="no">{cur.code}</span>
                      </div>
                    </div>
                  ) : view === "sky" ? (
                    <>
                      <div className="cl-sky-wrap">
                        <ClassSky members={ranked} T={T} li={li} ago={ago} sel={sel?.user_id} onSel={setSel} maxXp={maxXp} />
                        <ClassStarCard m={sel} T={T} li={li} ago={ago} done={sel ? doneBy(sel.user_id) : 0} total={tasks.length}
                          rank={sel ? ranked.indexOf(sel) + 1 : 0} onRemove={() => onRemoveMember(sel)} />
                      </div>
                      <p className="cl-legend">{V.legend[VI]}</p>
                    </>
                  ) : (
                    <ClassList members={ranked} T={T} li={li} ago={ago} doneBy={doneBy} total={tasks.length} onRemove={onRemoveMember} maxXp={maxXp} />
                  )}
                </section>
              )}

              {/* ── Жолдар: тапсырмалар ── */}
              <section className="cl-sec cl-paths" aria-labelledby="cl-tasks-h">
                <SecHead title={<span id="cl-tasks-h">{isOwner ? T("tasks") : T("myTasks")}</span>} count={tasks.length || null} />
                {isOwner && <ClassComposer T={T} lang={lang} tf={tf} setTf={setTf} onAdd={onAddTask} />}
                {tasks.length === 0 ? (
                  <div className="cl-quiet">
                    <Qyran mood={isOwner ? "idle" : "sleep"} size={88} />
                    <p>{T("noTasks")}</p>
                  </div>
                ) : (
                  <ul className="cl-tasks">
                    {tasks.map((t, i) => (
                      <ClassTask key={t.id} t={t} i={i} T={T} li={li} lang={lang} isOwner={isOwner} sub={my(t)} doneN={doneCount(t)} members={members.length}
                        onMark={onMark} onDelete={() => onDeleteTask(t)} />
                    ))}
                  </ul>
                )}
              </section>

              {/* ── Тағы сынып / қосылу ── */}
              <div className={`cl-more ${teacher ? "is-two" : ""}`}>
                {teacher && (
                  <section className="cl-panel-light">
                    <ClassCreate T={T} name={name} setName={setName} busy={busy} onMake={onMake} id="cl-new" />
                  </section>
                )}
                <section className="cl-panel-dark">
                  <h3 className="cl-panel-t">{T("join")}</h3>
                  <ClassCodeField code={code} setCode={setCode} T={T} id="cl-code" onEnter={onEnter} busy={busy} />
                </section>
              </div>
              {!teacher && <p className="cl-tip"><Icon name="sparkle" size={16} />{T("teacherTip")}</p>}
            </div>
          ) : (
            /* ── Сынып жоқ: бос аспан ── */
            <EmptySky mood="sleep" cls={teacher ? "is-teacher" : "is-student"}>
              <h2 className="cl-empty-t">{V.emptySky[VI]}</h2>
              {teacher ? (
                <>
                  <div className="cl-panel-light"><ClassCreate T={T} name={name} setName={setName} busy={busy} onMake={onMake} id="cl-new" big /></div>
                  <div className="cl-or"><span>{V.or[VI]}</span></div>
                  <div className="cl-panel-dark">
                    <h3 className="cl-panel-t">{T("join")}</h3>
                    <ClassCodeField code={code} setCode={setCode} T={T} id="cl-code" onEnter={onEnter} busy={busy} />
                  </div>
                </>
              ) : (
                <>
                  <p className="cl-empty-p">{T("join")}</p>
                  <ClassCodeField code={code} setCode={setCode} T={T} id="cl-code" onEnter={onEnter} busy={busy} big />
                  <p className="cl-tip"><Icon name="sparkle" size={16} />{T("teacherTip")}</p>
                </>
              )}
            </EmptySky>
          )}
        </>
      )}
    </div>
  );
}
