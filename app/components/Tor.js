"use client";
// «Төр» — басты беттің құрметті орны: бүгінгі сабақ, ошақ (серия) және күндік тапсырмалар.
import Link from "next/link";
import { useApp, dayKey, DAILY_GOAL } from "./Store";
import Icon from "./Icon";
import { ALL_LESSONS, LEVELS, UNITS, lessonTitle } from "../../lib/course";
import { TOPICS } from "../../lib/words";

const X = {
  today: ["Бүгінгі сабақ", "Сегодняшний урок", "Today's lesson"],
  start: ["Сабақты бастау", "Начать урок", "Start the lesson"],
  cont: ["Жалғастыру", "Продолжить", "Continue"],
  allDone: ["Курс толық өтілді. Сөздерді қайталап тұр.", "Курс пройден. Повторяйте слова.", "Course complete. Keep reviewing your words."],
  review: ["Сөздікке өту", "Открыть словарь", "Open the dictionary"],
  of: ["сабақ", "уроков", "lessons"],
  hearth: ["Ошақ", "Очаг", "Hearth"],
  days: ["күн қатарынан", "дней подряд", "days in a row"],
  lit: ["Бүгін от жағылды", "Сегодня огонь зажжён", "The fire is lit today"],
  unlit: ["Бүгін бір сабақ өтсең, от сөнбейді", "Один урок сегодня — и огонь не погаснет", "One lesson today keeps the fire going"],
  ember: ["Шоқ", "Уголёк", "Ember"],
  emberTip: ["Бір күн қалып қойсаң, шоқ ошақты сақтайды", "Уголёк сохранит очаг, если пропустите один день", "An ember keeps the hearth alive if you miss one day"],
  buy: ["Шоқ сақтау · 20 тиын", "Запасти уголёк · 20 монет", "Bank an ember · 20 coins"],
  quests: ["Бүгінгі тапсырмалар", "Задания на сегодня", "Today's tasks"],
  q1: ["30 XP жина", "Наберите 30 XP", "Earn 30 XP"],
  q2: ["Курстан 1 сабақ өт", "Пройдите 1 урок курса", "Finish 1 course lesson"],
  q3: ["3 түрлі жаттығу жаса", "Сделайте 3 упражнения", "Do 3 activities"],
  claim: ["Сыйлықты алу · 15 тиын", "Забрать награду · 15 монет", "Collect reward · 15 coins"],
  claimed: ["Бүгінгі сыйлық алынды", "Награда за сегодня получена", "Today's reward collected"],
};

function Hearth({ lit }) {
  return (
    <svg className={`hearth ${lit ? "lit" : ""}`} viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
      <path className="h-flame" d="M32 6c2 9 12 13 12 25a12 12 0 0 1-24 0c0-6 4-9 6-14 1 4 3 6 5 7-1-7 0-12 1-18Z" />
      <path className="h-core" d="M32 26c1 4 5 6 5 11a5 5 0 0 1-10 0c0-4 3-6 5-11Z" />
      <path className="h-pot" d="M12 44h40l-4 12a4 4 0 0 1-4 3H20a4 4 0 0 1-4-3l-4-12Z" />
      <path className="h-rim" d="M10 44h44" />
    </svg>
  );
}

export default function Tor() {
  const { lang, state, update, toast } = useApp();
  const li = lang === "kk" ? 0 : lang === "ru" ? 1 : 2;
  const T = (k) => X[k][li];
  const done = state.course?.done || {};
  const doneCount = ALL_LESSONS.filter((l) => done[l.id]).length;
  const next = ALL_LESSONS.find((l) => !done[l.id]);
  const lev = next && LEVELS.find((v) => v.units.includes(next.topic));
  const unit = next && UNITS[next.topic];
  const unitDone = unit ? unit.lessons.filter((l) => done[l.id]).length : 0;

  const today = dayKey();
  const isToday = state.today?.date === today;
  const xpToday = isToday ? state.today.xp || 0 : 0;
  const tasksToday = isToday ? state.today.tasks || 0 : 0;
  const lessonsToday = Object.values(done).filter((d) => d?.at && dayKey(new Date(d.at)) === today).length;
  const lit = state.lastDay === today;
  const embers = state.embers || 0;
  const coins = state.coins || 0;

  const quests = [
    { k: "q1", v: Math.min(xpToday, 30), max: 30 },
    { k: "q2", v: Math.min(lessonsToday, 1), max: 1 },
    { k: "q3", v: Math.min(tasksToday, 3), max: 3 },
  ];
  const allDone = quests.every((q) => q.v >= q.max);
  const claimed = state.quests?.date === today && state.quests.claimed;

  const buyEmber = () => update((s) => ((s.coins || 0) >= 20 && (s.embers || 0) < 2 ? { ...s, coins: s.coins - 20, embers: (s.embers || 0) + 1 } : s));
  const claim = () => { update((s) => ({ ...s, coins: (s.coins || 0) + 15, quests: { date: today, claimed: true } })); toast("+15 🪙"); };

  return (
    <section className="tor" aria-label={T("today")}>
      <div className="tor-lesson">
        <span className="tor-cap">{T("today")}</span>
        {next ? (
          <>
            <h2>{TOPICS[next.topic]?.e} {lessonTitle(next, lang)}</h2>
            <p className="tor-meta">{lev?.id} · {TOPICS[next.topic]?.[lang] || TOPICS[next.topic]?.en} · {unitDone}/{unit.lessons.length} {T("of")}</p>
            <div className="frets" role="img" aria-label={`${doneCount}/${ALL_LESSONS.length}`}>
              {unit.lessons.map((l) => <i key={l.id} className={done[l.id] ? "on" : l.id === next.id ? "cur" : ""} />)}
            </div>
            <Link href={`/app/course?l=${next.id}`} className="btn primary big tor-cta">{doneCount ? T("cont") : T("start")} <Icon name="right" size={18} /></Link>
          </>
        ) : (
          <>
            <h2>{T("allDone")}</h2>
            <Link href="/app/sozdik" className="btn primary big tor-cta">{T("review")}</Link>
          </>
        )}
      </div>

      <div className="tor-side">
        <div className="tor-hearth">
          <Hearth lit={lit} />
          <div className="tor-h-txt">
            <b>{state.streak || 0} <small>{T("days")}</small></b>
            <span>{lit ? T("lit") : T("unlit")}</span>
          </div>
          <div className="tor-embers" title={T("emberTip")}>
            <span aria-label={`${T("ember")}: ${embers}`}>{[0, 1].map((i) => <i key={i} className={i < embers ? "on" : ""} />)}</span>
            {embers < 2 && <button className="link-btn" disabled={coins < 20} onClick={buyEmber}>{T("buy")}</button>}
          </div>
        </div>

        <div className="tor-quests">
          <h3>{T("quests")}</h3>
          <ul>
            {quests.map((q) => (
              <li key={q.k} className={q.v >= q.max ? "done" : ""}>
                <span className="q-mark">{q.v >= q.max ? <Icon name="check" size={14} /> : null}</span>
                <span className="q-name">{T(q.k)}</span>
                <span className="q-bar"><i style={{ width: `${(q.v / q.max) * 100}%` }} /></span>
                <span className="q-num">{q.v}/{q.max}</span>
              </li>
            ))}
          </ul>
          {claimed ? <small className="muted">{T("claimed")}</small> : allDone ? <button className="btn gold small" onClick={claim}>{T("claim")}</button> : null}
        </div>
      </div>
    </section>
  );
}
