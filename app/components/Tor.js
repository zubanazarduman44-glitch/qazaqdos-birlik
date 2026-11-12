"use client";
// «Төр» — басты беттің құрметті орны: бүгінгі сабақ, ошақ (серия) және күндік тапсырмалар.
// Басты бет (app/app/page.js) бөліктерді бенто-торға бөлек қояды: useTor + TorLesson / TorHearth / TorQuests.
import Link from "next/link";
import { useApp, dayKey } from "./Store";
import Icon from "./Icon";
import TopicArt from "./TopicArt";
import { HomeFlame, HomeChest } from "./HomeArt";
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

// Барлық есеп бір жерде: бет бөліктері бірдей деректі көреді
export function useTor() {
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

  return { lang, T, done, doneCount, next, lev, unit, unitDone, lit, embers, coins, streak: state.streak || 0, quests, allDone, claimed, buyEmber, claim };
}

// 1 — Бүгінгі сабақ: беттің басты әрекеті
export function TorLesson({ tor }) {
  const { lang, T, done, doneCount, next, lev, unit, unitDone } = tor;
  return (
    <div className="hm-lesson">
      <span className="hm-kicker">{T("today")}</span>
      {next ? (
        <>
          <div className="hm-l-head">
            <TopicArt topic={next.topic} size={64} className="hm-l-art" />
            <div className="hm-l-tt">
              <h2>{lessonTitle(next, lang)}</h2>
              <p className="hm-l-meta">
                <span className="hm-lv">{lev?.id}</span> {TOPICS[next.topic]?.[lang] || TOPICS[next.topic]?.en} · {unitDone}/{unit.lessons.length} {T("of")}
              </p>
            </div>
          </div>
          <div className="hm-frets" role="img" aria-label={`${doneCount}/${ALL_LESSONS.length}`}>
            {unit.lessons.map((l, i) => <i key={l.id} style={{ "--i": i }} className={done[l.id] ? "on" : l.id === next.id ? "cur" : ""} />)}
          </div>
          <Link href={`/app/course?l=${next.id}`} className="btn primary big hm-cta">
            {doneCount ? T("cont") : T("start")} <Icon name="right" size={20} />
          </Link>
        </>
      ) : (
        <>
          <h2 className="hm-l-done">{T("allDone")}</h2>
          <Link href="/app/sozdik" className="btn primary big hm-cta">{T("review")} <Icon name="right" size={20} /></Link>
        </>
      )}
    </div>
  );
}

// 2 — Ошақ: серия, шоқтар
export function TorHearth({ tor }) {
  const { T, lit, streak, embers, coins, buyEmber } = tor;
  return (
    <section className={`hm-tile hm-hearth ${lit ? "is-lit" : "is-out"}`} aria-label={T("hearth")}>
      <div className="hm-h-art"><HomeFlame lit={lit} streak={streak} /></div>
      <div className="hm-h-body">
        <span className="hm-kicker">{T("hearth")}</span>
        <p className="hm-h-num"><b>{streak}</b> <span>{T("days")}</span></p>
        <p className="hm-h-state">{lit ? <Icon name="check" size={16} /> : <Icon name="flame" size={16} />}{lit ? T("lit") : T("unlit")}</p>
      </div>
      <div className="hm-embers" title={T("emberTip")}>
        <span className="hm-coals" role="img" aria-label={`${T("ember")}: ${embers}`}>
          {[0, 1].map((i) => <i key={i} className={i < embers ? "on" : ""} />)}
        </span>
        <small>{T("emberTip")}</small>
        {embers < 2 && <button type="button" className="link-btn" disabled={coins < 20} onClick={buyEmber}>{T("buy")}</button>}
      </div>
    </section>
  );
}

// 3 — Күндік тапсырмалар
export function TorQuests({ tor }) {
  const { T, quests, allDone, claimed, claim } = tor;
  const n = quests.filter((q) => q.v >= q.max).length;
  return (
    <section className="hm-tile hm-quests" aria-label={T("quests")}>
      <div className="hm-q-top">
        <h3>{T("quests")}</h3>
        <span className="hm-q-count">{n}/{quests.length}</span>
        <HomeChest open={Boolean(claimed)} ready={allDone && !claimed} />
      </div>
      <ul>
        {quests.map((q, i) => (
          <li key={q.k} className={q.v >= q.max ? "done" : ""} style={{ "--i": i }}>
            <span className="q-mark">{q.v >= q.max ? <Icon name="check" size={14} /> : null}</span>
            <span className="q-name">{T(q.k)}</span>
            <span className="q-num">{q.v}/{q.max}</span>
            <span className="q-bar"><i style={{ transform: `scaleX(${q.v / q.max})` }} /></span>
          </li>
        ))}
      </ul>
      {claimed ? <small className="hm-q-note">{T("claimed")}</small> : allDone ? <button type="button" className="btn gold small hm-claim" onClick={claim}><Icon name="coin" size={16} /> {T("claim")}</button> : null}
    </section>
  );
}

export default function Tor() {
  const tor = useTor();
  return (
    <section className="tor" aria-label={tor.T("today")}>
      <TorLesson tor={tor} />
      <TorHearth tor={tor} />
      <TorQuests tor={tor} />
    </section>
  );
}
