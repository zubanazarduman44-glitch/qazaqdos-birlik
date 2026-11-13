"use client";
// «Менің сыныбым» көрінісі: «Алқа-қотан» — «Өнер алды — қызыл тіл». Мұғалім — төрде, оқушылар айнала көрпешелерде отырады,
// әрқайсысының «сөзі» (апталық XP) бар. Тапсырмалар — мөрлі «сөз орамы». Барлық күй мен Supabase шақырулары
// app/app/class/page.js ішінде; бұл файл тек сызады.
import { useMemo, useState } from "react";
import Link from "next/link";
import LangPicker from "./LangPicker";
import Avatar from "./Avatar";
import Icon from "./Icon";
import Qyran from "./Qyran";
import { ClassBand, ClassMedallion, ClassCushion, ClassSeal, ClassKindGlyph, ClassThreadRing, ClassHourglass, ClassEmptyCircle, ClassHorn } from "./ClassArt";
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
  circle: ["Алқа", "Круг", "Circle", "圆座", "Círculo", "Kreis", "Cercle", "Halka", "الحلقة", "원형", "円座"],
  list: ["Тізім", "Список", "List", "列表", "Lista", "Liste", "Liste", "Liste", "قائمة", "목록", "リスト"],
  view: ["Көрініс", "Вид", "View", "视图", "Vista", "Ansicht", "Vue", "Görünüm", "العرض", "보기", "表示"],
  tor: ["Төр", "Тёр — почётное место", "Seat of honour", "上座", "Lugar de honor", "Ehrenplatz", "Place d’honneur", "Baş köşe", "صدر المجلس", "상석", "上座"],
  you: ["сен — мұғалім", "вы — учитель", "you, the teacher", "你是老师", "tú, el profesor", "du, die Lehrkraft", "toi, l’enseignant", "sen, öğretmen", "أنت المعلّم", "선생님(나)", "あなた（先生）"],
  pick: ["Оқушыны бас — ол туралы толығырақ осында шығады.", "Нажмите на ученика, чтобы увидеть подробности.", "Tap a student to see the details.", "点击学生查看详情。", "Toca a un estudiante para ver los detalles.", "Tippe auf eine Person, um Details zu sehen.", "Touche un élève pour voir les détails.", "Ayrıntılar için bir öğrenciye dokun.", "اضغط على طالب لعرض التفاصيل.", "학생을 누르면 자세히 보여요.", "生徒をタップすると詳細が見られます。"],
  streak: ["күн қатар", "дней подряд", "day streak", "连续天数", "días seguidos", "Tage in Folge", "jours d’affilée", "gün üst üste", "أيام متتالية", "일 연속", "日連続"],
  or: ["немесе", "или", "or", "或", "o", "oder", "ou", "veya", "أو", "또는", "または"],
  legend: ["Төрге жақын — апталық XP көп · алтын «сөз» — бүгін кірді · жалын — қатарынан күндер", "Ближе к тёру — больше XP за неделю · золотое «слово» — заходил сегодня · пламя — серия дней", "Closer to the seat of honour — more week XP · gold bubble — active today · flame — streak", "越靠近上座——本周 XP 越多 · 金色气泡——今天来过 · 火焰——连续天数", "Más cerca del lugar de honor: más XP semanal · burbuja dorada: activo hoy · llama: racha", "Näher am Ehrenplatz – mehr Wochen-XP · goldene Blase – heute aktiv · Flamme – Serie", "Plus près de la place d’honneur : plus d’XP cette semaine · bulle dorée : actif aujourd’hui · flamme : série", "Baş köşeye yakın: daha çok haftalık XP · altın balon: bugün aktif · alev: seri", "الأقرب إلى صدر المجلس = نقاط XP أسبوعية أكثر · فقاعة ذهبية = نشط اليوم · لهب = أيام متتالية", "상석에 가까울수록 주간 XP 많음 · 금색 말풍선 — 오늘 접속 · 불꽃 — 연속 학습", "上座に近いほど今週のXPが多い · 金色の吹き出し＝今日アクティブ · 炎＝連続日数"],
  emptyCircle: ["Алқа-қотан әзірге бос", "Круг пока пуст", "The circle is empty for now", "圆座暂时空着", "El círculo está vacío por ahora", "Der Kreis ist noch leer", "Le cercle est vide pour l’instant", "Halka şimdilik boş", "الحلقة فارغة حاليًا", "아직 자리가 비어 있어요", "円座はまだ空いています"],
  invite: ["Орындар дайын. Сынып аш та, оқушыларды алқаға шақыр.", "Места готовы. Создайте класс и пригласите учеников в круг.", "The seats are ready. Create a class and invite students to the circle.", "座位已备好。创建班级，邀请学生入座。", "Los asientos están listos. Crea una clase e invita a tus estudiantes al círculo.", "Die Plätze sind bereit. Erstelle eine Klasse und lade deine Lernenden in den Kreis ein.", "Les places sont prêtes. Crée une classe et invite tes élèves dans le cercle.", "Yerler hazır. Bir sınıf oluştur ve öğrencilerini halkaya davet et.", "المقاعد جاهزة. أنشئ صفًا وادعُ طلابك إلى الحلقة.", "자리가 준비됐어요. 반을 만들고 학생들을 초대하세요.", "席は整っています。クラスを作って生徒を円座に招きましょう。"],
  inviteS: ["Сенің орның дайын — мұғалімнің кодымен алқаға қосыл.", "Твоё место готово — войди в круг по коду учителя.", "Your seat is ready — join the circle with your teacher’s code.", "你的座位已备好——用老师的代码加入。", "Tu asiento está listo: únete al círculo con el código de tu profesor.", "Dein Platz ist bereit – tritt dem Kreis mit dem Code deiner Lehrkraft bei.", "Ta place est prête : rejoins le cercle avec le code de ton enseignant.", "Yerin hazır — öğretmeninin koduyla halkaya katıl.", "مقعدك جاهز — انضم إلى الحلقة برمز معلّمك.", "자리가 준비됐어요 — 선생님 코드로 참여하세요.", "あなたの席は用意できています。先生のコードで参加しましょう。"],
  proverb: ["Өнер алды — қызыл тіл", "Первое из искусств — красноречие", "Eloquence is the first of the arts", "口才乃百艺之首", "La elocuencia es la primera de las artes", "Beredsamkeit ist die erste der Künste", "L’éloquence est le premier des arts", "Sanatların başı güzel sözdür", "الفصاحة أولى الفنون", "말솜씨는 모든 재주의 으뜸", "雄弁こそ諸芸の第一"],
  progress: ["Менің жолым", "Мой путь", "My path", "我的进度", "Mi camino", "Mein Weg", "Mon parcours", "Yolum", "مساري", "나의 길", "わたしの道"],
  late: ["мерзімі өтті", "просрочено", "overdue", "已逾期", "vencida", "überfällig", "en retard", "süresi geçti", "متأخرة", "기한 지남", "期限切れ"],
  activeToday: ["бүгін белсенді", "активны сегодня", "active today", "今天活跃", "activos hoy", "heute aktiv", "actifs aujourd’hui", "bugün aktif", "نشطون اليوم", "오늘 활동", "今日アクティブ"],
};

/* ── Алқа-қотан орындары (детерминистік) ──
   Төр — жоғарғы ортада. Оқушылар XP бойынша: 1-орын — төрдің оң жағы, 2 — сол жағы, т.с.с. төменге қарай.
   Төменде — есік жақ (бос саңылау). 10-нан көп болса — ішкі қатар. */
function alqaLayout(n) {
  if (!n) return [];
  const rings = n <= 10 ? [{ r: 1, c: n, top: 37, door: 14 }] : [{ r: 1, c: Math.ceil(n * 0.6), top: 34, door: 12 }, { r: 0.6, c: 0, top: 48, door: 30 }];
  if (rings[1]) rings[1].c = n - rings[0].c;
  const out = [];
  rings.forEach(({ r, c, top, door }) => {
    const per = Math.ceil(c / 2), span = 180 - top - door;
    for (let j = 0; j < c; j++) {
      const k = Math.floor(j / 2), t = per > 1 ? k / (per - 1) : 0.35;
      const off = top + span * (per > 1 ? t : 0.35);
      const deg = j % 2 ? -90 - off : -90 + off;
      const a = (deg * Math.PI) / 180;
      out.push({ r, cx: +Math.cos(a).toFixed(4), sy: +Math.sin(a).toFixed(4) });
    }
  });
  return out;
}

/* ── Сынып коды: қызыл киіздегі алтын кесте ── */
function ClassCode({ code, T, copied, onCopy }) {
  const ch = String(code || "").split("");
  return (
    <div className={`cl-code ${copied ? "is-copied" : ""}`}>
      <span className="cl-code-cap" id="cl-code-cap">{T("code")}</span>
      <div className="cl-badge" role="group" aria-labelledby="cl-code-cap">
        <b className="cl-stitch" translate="no">
          {ch.map((c, i) => <span key={i} className="cl-letter" style={{ "--i": i }}>{c}</span>)}
        </b>
        <span className="cl-badge-shine" aria-hidden="true" />
      </div>
      <button type="button" className={`cl-copy ${copied ? "is-ok" : ""}`} onClick={onCopy}>
        <Icon name={copied ? "check" : "stamp"} size={18} />
        <span aria-live="polite">{copied ? T("copied") : T("copy")}</span>
      </button>
    </div>
  );
}

/* ── Код енгізу: алты киіз-ұяшық, артында бір нақты өріс ── */
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
              {code[i] || <i className="cl-cell-x" />}
            </span>
          ))}
        </div>
      </div>
      <button type="submit" className="btn cl-gold cl-join-btn" disabled={busy || !code.trim()}>
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
        <button type="submit" className="btn cl-red" disabled={busy || !name.trim()}><Icon name="plus" size={18} /><span>{T("create")}</span></button>
      </div>
    </form>
  );
}

/* ── Алқа-қотан (мұғалім) ── */
function ClassCircle({ members, T, li, ago, sel, onSel, myAvatar }) {
  const pos = useMemo(() => alqaLayout(members.length), [members.length]);
  const two = members.length > 10;
  return (
    <div className={`cl-alqa ${two ? "is-two" : ""}`}>
      <span className="cl-rug" aria-hidden="true" />
      {two && <span className="cl-rug is-in" aria-hidden="true" />}
      <span className="cl-alqa-mid" aria-hidden="true"><ClassMedallion size={96} /></span>
      <div className="cl-tor" aria-hidden="true">
        <span className="cl-sitter"><Avatar value={myAvatar} size={52} /><ClassCushion tor /></span>
        <b>{V.tor[VI]}</b>
        <small>{V.you[VI]}</small>
      </div>
      <ul className="cl-seats">
        {members.map((m, i) => {
          const p = pos[i];
          const fresh = daysSince(m.last_active) <= 0;
          const st = m.streak || 0;
          const xp = m.week_xp || 0;
          const label = `${m.name || "—"}: ${xp} ${T("weekXp")}, ${m.lessons || 0} ${T("lessons")}, ${st} ${V.streak[VI]}, ${T("last")}: ${ago(m.last_active, li)}`;
          return (
            <li key={m.user_id} className="cl-seat-li" style={{ "--r": p.r, "--c": p.cx, "--s": p.sy, "--i": i }}>
              <button type="button" className={`cl-seat ${sel === m.user_id ? "is-sel" : ""} ${fresh ? "is-fresh" : ""} ${xp === 0 ? "is-quiet" : ""}`}
                aria-pressed={sel === m.user_id} aria-controls="cl-seat-card" aria-label={label} onClick={() => onSel(m.user_id)}>
                <span className="cl-say">{xp}<small>XP</small></span>
                <span className="cl-sitter">
                  <Avatar value={m.avatar} size={44} /><ClassCushion />
                  {st > 0 && <span className="cl-fl"><Icon name="flame" size={11} />{st}</span>}
                </span>
                <span className="cl-seat-name" dir="auto">{(m.name || "—").split(" ")[0]}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ClassSeatCard({ m, T, li, ago, done, total, rank, onRemove }) {
  if (!m) return <div className="cl-card is-hint" id="cl-seat-card" aria-live="polite"><ClassHorn size={56} /><p>{V.pick[VI]}</p></div>;
  const fresh = daysSince(m.last_active) <= 0;
  return (
    <div className="cl-card" id="cl-seat-card" aria-live="polite">
      <div className="cl-card-head">
        <ClassThreadRing done={done} total={total} size={78} light label={`${done} / ${total} ${T("done")}`}>
          <Avatar value={m.avatar} size={56} />
        </ClassThreadRing>
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
      <button type="button" className="cl-drop is-ink" onClick={onRemove}><Icon name="x" size={16} />{T("del")}</button>
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

/* ── Тапсырма — сөз орамы ── */
function ClassTask({ t, i, T, li, lang, isOwner, sub, doneN, members, onMark, onDelete }) {
  const lesson = t.kind === "lesson" ? ALL_LESSONS.find((l) => l.id === t.ref) : null;
  const game = t.kind === "game" ? GAMES.find((g) => g.id === t.ref) : null;
  const done = !isOwner && sub?.done;
  const late = t.due && !done && t.due < todayISO();
  const soon = t.due && !late && !done && daysTo(t.due) <= 2;
  const what = lesson ? lessonTitle(lesson, lang) : game ? L(game.name, lang) : T("kCustom");
  const p = isOwner ? (members ? Math.min(doneN, members) / members : 0) : done ? 1 : 0;
  return (
    <li className={`cl-task k-${t.kind} ${done ? "is-done" : ""} ${late ? "is-late" : ""}`} style={{ "--i": i, "--p": p }}>
      <span className="cl-task-seal"><ClassSeal kind={t.kind} done={done} size={54} /></span>
      <div className="cl-task-body">
        <span className="cl-task-kind">{T(kindKey[t.kind] || "kCustom")}</span>
        <b className="cl-task-title" dir="auto">{t.title}</b>
        {what !== t.title && <small className="cl-task-what">{what}</small>}
        {t.due && (
          <span className={`cl-due ${late ? "is-late" : soon ? "is-soon" : ""}`}>
            <ClassHourglass />{T("due")}: {t.due}
          </span>
        )}
        {late && <em className="cl-late">{V.late[VI]}</em>}
      </div>
      <div className="cl-task-side">
        {isOwner ? (
          <span className="cl-task-count"><b>{doneN}<small>/{members}</small></b><span>{T("done")}</span></span>
        ) : done ? (
          <span className="cl-done-chip"><Icon name="check" size={16} stroke={3} />{T("done")}</span>
        ) : lesson ? (
          <Link className="btn cl-red small cl-task-go" href={`/app/course?l=${t.ref}`}>{T("start")}<Icon name="right" size={16} className="cl-flip" /></Link>
        ) : game ? (
          <Link className="btn cl-red small cl-task-go" href={`/app/games/${game.id}`}>{T("start")}<Icon name="right" size={16} className="cl-flip" /></Link>
        ) : t.kind === "custom" ? (
          <button type="button" className="cl-line-btn cl-task-go" onClick={() => onMark(t)}><Icon name="check" size={16} />{T("mark")}</button>
        ) : null}
      </div>
      <span className="cl-thread" aria-hidden="true"><i /></span>
      {isOwner && <button type="button" className="cl-x is-ink" aria-label={`${T("del")}: ${t.title}`} onClick={onDelete}><Icon name="x" size={16} /></button>}
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
            <ClassKindGlyph kind={k} size={26} />
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
        <button type="submit" className="btn cl-red cl-f-go"><Icon name="plus" size={18} />{T("addTask")}</button>
      </div>
    </form>
  );
}

function SecHead({ title, count, children }) {
  return (
    <div className="cl-sec-head">
      <ClassHorn size={30} className="cl-sec-horn" />
      <h3>{title}</h3>
      {count != null && <span className="cl-count">{count}</span>}
      {children}
    </div>
  );
}

/* ── Бос алқа (кіру / баптау / сынып жоқ) ── */
function EmptyCircle({ mood, children, cls = "" }) {
  return (
    <section className={`cl-empty ${cls}`}>
      <div className="cl-empty-art" aria-hidden="true">
        <ClassEmptyCircle />
        <span className="cl-empty-q"><Qyran mood={mood} size={112} /></span>
      </div>
      <div className="cl-empty-body">{children}</div>
    </section>
  );
}

export default function ClassView(p) {
  const { T, li, lang, user, authReady, teacher, setup, err, classes, cur, setCur, isOwner, members, tasks, subs, my, doneCount, ago,
    name, setName, code, setCode, busy, copied, onCopy, tf, setTf, onMake, onEnter, onAddTask, onMark, onDropClass, onRemoveMember, onDeleteTask } = p;
  VI = V_LANGS.indexOf(lang); if (VI < 0) VI = 2;

  const ranked = useMemo(() => [...members].sort((a, b) => (b.week_xp || 0) - (a.week_xp || 0)), [members]);
  const [mode, setMode] = useState(null);
  const view = mode || (ranked.length > 18 ? "list" : "circle");
  const [selId, setSel] = useState(null);
  const sel = ranked.find((m) => m.user_id === selId) || ranked[0] || null;

  const myDone = tasks.filter((t) => my(t)?.done).length;
  const doneBy = (uid) => subs.filter((s) => s.user_id === uid && s.done).length;
  const xpSum = members.reduce((a, m) => a + (m.week_xp || 0), 0);
  const maxXp = ranked[0]?.week_xp || 0;
  const activeToday = members.filter((m) => daysSince(m.last_active) <= 0).length;

  return (
    <div className="class-page cl">
      <ClassBand id="cl-band-top" className="cl-band-top" />
      <header className="page-head cl-head">
        <div>
          <span className="kicker">{T("kicker")}</span>
          <h1>{T("title")}</h1>
          <p>{teacher ? T("subT") : T("subS")}</p>
        </div>
        <div className="head-tools"><LangPicker /></div>
      </header>

      {!user ? (
        <EmptyCircle mood={authReady ? "support" : "sleep"}>
          <h2 className="cl-empty-t">{V.emptyCircle[VI]}</h2>
          <p className="cl-empty-p">{authReady ? T("login") : "…"}</p>
          <Link href="/login" className="btn cl-gold big cl-cta"><Icon name="user" size={20} />{T("signin")}</Link>
        </EmptyCircle>
      ) : setup ? (
        <EmptyCircle mood="think">
          <p className="cl-setup"><Icon name="lock" size={18} />{T("setup")}</p>
        </EmptyCircle>
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
              {/* ── Сынып тақырыбы ── */}
              <section className={`cl-hero ${isOwner ? "is-owner" : "is-student"}`} aria-labelledby="cl-name">
                <div className="cl-hero-body">
                  <p className="cl-proverb"><ClassHorn size={26} /><span lang="kk" translate="no">Өнер алды — қызыл тіл</span>{VI !== 0 && <small>{V.proverb[VI]}</small>}</p>
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
                      <ClassThreadRing done={myDone} total={tasks.length} size={92} label={`${myDone} / ${tasks.length} ${T("done")}`}>
                        <Avatar value={p.myAvatar} size={64} />
                      </ClassThreadRing>
                      <div><small>{V.progress[VI]}</small><b>{myDone}/{tasks.length}</b><span>{T("done")}</span></div>
                    </div>
                  )}
                  <button type="button" className="cl-drop" onClick={onDropClass}>
                    <Icon name={isOwner ? "x" : "logout"} size={16} className={isOwner ? "" : "cl-flip"} />{isOwner ? T("del") : T("leave")}
                  </button>
                </div>
                {isOwner && <ClassCode code={cur.code} T={T} copied={copied} onCopy={onCopy} />}
              </section>

              {/* ── Алқа / Тізім ── */}
              {isOwner && (
                <section className="cl-sec cl-people" aria-labelledby="cl-people-h">
                  <SecHead title={<span id="cl-people-h">{T("students")}</span>} count={members.length}>
                    {members.length > 0 && (
                      <div className="cl-toggle" role="group" aria-label={V.view[VI]}>
                        <button type="button" aria-pressed={view === "circle"} onClick={() => setMode("circle")}><Icon name="user" size={15} />{V.circle[VI]}</button>
                        <button type="button" aria-pressed={view === "list"} onClick={() => setMode("list")}><Icon name="menu" size={15} />{V.list[VI]}</button>
                      </div>
                    )}
                  </SecHead>
                  {members.length === 0 ? (
                    <div className="cl-quiet is-circle">
                      <div className="cl-quiet-art" aria-hidden="true"><ClassEmptyCircle /><span className="cl-empty-q"><Qyran mood="sleep" size={84} /></span></div>
                      <div>
                        <p>{T("noStudents")}</p>
                        <span className="cl-mini-code" translate="no">{cur.code}</span>
                      </div>
                    </div>
                  ) : view === "circle" ? (
                    <>
                      <div className="cl-alqa-wrap">
                        <ClassCircle members={ranked} T={T} li={li} ago={ago} sel={sel?.user_id} onSel={setSel} myAvatar={p.myAvatar} />
                        <ClassSeatCard m={sel} T={T} li={li} ago={ago} done={sel ? doneBy(sel.user_id) : 0} total={tasks.length}
                          rank={sel ? ranked.indexOf(sel) + 1 : 0} onRemove={() => onRemoveMember(sel)} />
                      </div>
                      <p className="cl-legend">{V.legend[VI]}</p>
                    </>
                  ) : (
                    <ClassList members={ranked} T={T} li={li} ago={ago} doneBy={doneBy} total={tasks.length} onRemove={onRemoveMember} maxXp={maxXp} />
                  )}
                </section>
              )}

              {/* ── Сөз орамдары: тапсырмалар ── */}
              <section className="cl-sec cl-scrolls" aria-labelledby="cl-tasks-h">
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
            /* ── Сынып жоқ: бос алқа ── */
            <EmptyCircle mood={teacher ? "support" : "happy"} cls={teacher ? "is-teacher" : "is-student"}>
              <h2 className="cl-empty-t">{V.emptyCircle[VI]}</h2>
              {teacher ? (
                <>
                  <p className="cl-empty-p">{V.invite[VI]}</p>
                  <div className="cl-panel-light"><ClassCreate T={T} name={name} setName={setName} busy={busy} onMake={onMake} id="cl-new" big /></div>
                  <div className="cl-or"><span>{V.or[VI]}</span></div>
                  <div className="cl-panel-dark">
                    <h3 className="cl-panel-t">{T("join")}</h3>
                    <ClassCodeField code={code} setCode={setCode} T={T} id="cl-code" onEnter={onEnter} busy={busy} />
                  </div>
                </>
              ) : (
                <>
                  <p className="cl-empty-p">{V.inviteS[VI]}</p>
                  <ClassCodeField code={code} setCode={setCode} T={T} id="cl-code" onEnter={onEnter} busy={busy} big />
                  <p className="cl-tip"><Icon name="sparkle" size={16} />{T("teacherTip")}</p>
                </>
              )}
            </EmptyCircle>
          )}
        </>
      )}
    </div>
  );
}
