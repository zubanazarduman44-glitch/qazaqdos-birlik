import { useEffect, useState } from "react";
// Басты бет (/app) мәтіндері — 11 тіл (kk/ru/en осында, қалғаны HomeL10nMore.js-те, жалқау). Жоқ кілт ағылшыншаға түседі.
const kk = {
  tipK: "Тіл сыры:", claim: "Бүгінгі сыйлықты алу · 15 тиын", claimed: "Бүгінгі сыйлық алынды",
  tagline: "Қазақ тілін Aqyl-мен бірге үйрен",
  mission: "Бүгінгі оқу миссиясы", ask: "Бүгін не үйренемін?",
  words: (n) => `~${n} жаңа сөз`, phrases: "Күнделікті сөйлемдер", min: (n) => `${n} минут`,
  start: "Сабақты бастау", today: "Бүгінгі мақсат", streak: (n) => `${n} күн қатарынан`,
  allDone: "Бүкіл көш жолы өтілді! Енді сөздерді қайталап, біліміңді бекіт.", review: "Сөздерді қайталау",
  mapT: "Көш жолы", mapSub: "Әр сабақ көшті алға жылжытады. Өңірді аяқтасаң — таңба аласың.",
  regions: (a, b) => `${a}/${b} өңір`,
  st: { done: "Өтілді", cur: "Көш осында", open: "Басталған", next: "Келесі өңір", locked: "Жабық" },
  lessons: (a, b) => `${a}/${b} сабақ`, unlock: (n) => `Ашу үшін алдымен мына өңірді аяқта: ${n}.`,
  go: "Сабаққа өту", hint: "Өңірді таңда — оның сабағы ашылады.", loading: "Карта жүктеліп жатыр…",
  last: "Соңғы сабақ", lastNone: "Алғашқы сабағың алда — бастауға бір қадам.", score: (n) => `${n}% дұрыс`, repeat: "Қайта өту",
  prog: "Менің жолым", level: "Деңгей", learned: "Үйренген сөз", lessonsDone: "Өтілген сабақ",
  badges: "Таңбалар", earned: "алынды", b: { first: "Алғашқы сабақ", stamp1: "Алғашқы таңба", streak7: "7 күн ошақ", words50: "50 сөз", stamp5: "5 өңір", a1: "A1 аяқталды", a2: "A2 аяқталды", kosh: "Бүкіл Көш" },
  askAqyl: "Aqyl-ге сұрақ қой",
};
const ru = {
  tipK: "Секрет языка:", claim: "Забрать награду · 15 монет", claimed: "Награда за сегодня получена",
  tagline: "Учите казахский вместе с Aqyl",
  mission: "Учебная миссия на сегодня", ask: "Что я изучаю сегодня?",
  words: (n) => `~${n} новых слов`, phrases: "Повседневные фразы", min: (n) => `${n} минут`,
  start: "Начать урок", today: "Цель на сегодня", streak: (n) => `${n} дн. подряд`,
  allDone: "Весь путь кочевья пройден! Повторяйте слова, чтобы закрепить знания.", review: "Повторить слова",
  mapT: "Путь кочевья", mapSub: "Каждый урок продвигает кочевье вперёд. Завершите регион — получите тамгу.",
  regions: (a, b) => `${a}/${b} регионов`,
  st: { done: "Пройден", cur: "Кочевье здесь", open: "Начат", next: "Следующий регион", locked: "Закрыт" },
  lessons: (a, b) => `${a}/${b} уроков`, unlock: (n) => `Чтобы открыть, сначала завершите: ${n}.`,
  go: "К уроку", hint: "Выберите регион — откроется его урок.", loading: "Карта загружается…",
  last: "Последний урок", lastNone: "Первый урок впереди — всего один шаг.", score: (n) => `${n}% верно`, repeat: "Пройти снова",
  prog: "Мой путь", level: "Уровень", learned: "Выучено слов", lessonsDone: "Пройдено уроков",
  badges: "Тамги", earned: "получено", b: { first: "Первый урок", stamp1: "Первая тамга", streak7: "Очаг 7 дней", words50: "50 слов", stamp5: "5 регионов", a1: "A1 пройден", a2: "A2 пройден", kosh: "Всё кочевье" },
  askAqyl: "Спросить Aqyl",
};
const en = {
  tipK: "Language tip:", claim: "Collect today’s reward · 15 coins", claimed: "Today’s reward collected",
  tagline: "Learn Kazakh together with Aqyl",
  mission: "Today's learning mission", ask: "What do I learn today?",
  words: (n) => `~${n} new words`, phrases: "Everyday phrases", min: (n) => `${n} min`,
  start: "Start lesson", today: "Today's goal", streak: (n) => `${n}-day streak`,
  allDone: "You've travelled the whole Kosh route! Review your words to make them stick.", review: "Review words",
  mapT: "The Kosh route", mapSub: "Every lesson moves the caravan forward. Finish a region to earn its tamga.",
  regions: (a, b) => `${a}/${b} regions`,
  st: { done: "Completed", cur: "The caravan is here", open: "Started", next: "Next region", locked: "Locked" },
  lessons: (a, b) => `${a}/${b} lessons`, unlock: (n) => `To unlock, first finish ${n}.`,
  go: "Go to lesson", hint: "Pick a region to open its lesson.", loading: "Loading the map…",
  last: "Last lesson", lastNone: "Your first lesson is one step away.", score: (n) => `${n}% correct`, repeat: "Do it again",
  prog: "My journey", level: "Level", learned: "Words learned", lessonsDone: "Lessons done",
  badges: "Tamgas", earned: "earned", b: { first: "First lesson", stamp1: "First tamga", streak7: "7-day hearth", words50: "50 words", stamp5: "5 regions", a1: "A1 complete", a2: "A2 complete", kosh: "Whole Kosh" },
  askAqyl: "Ask Aqyl",
};
const ALL = { kk, ru, en };
let more = null, pending = null;
const loadMore = () => (pending ||= import("./HomeL10nMore").then((m) => { more = m.default; Object.assign(ALL, more); }).catch(() => {}));
export const homeL = (lang) => ALL[lang] || en;
export const loadHomeL = loadMore;
// Компонент ішінде: kk/ru/en бірден; қалған тілдер жүктелгенде қайта көрсетеді (оған дейін — ағылшынша).
export function useHomeL(lang) {
  const [, bump] = useState(0);
  useEffect(() => {
    if (ALL[lang] || more) return;
    let on = true;
    loadMore().then(() => on && bump((n) => n + 1));
    return () => { on = false; };
  }, [lang]);
  return homeL(lang);
}
