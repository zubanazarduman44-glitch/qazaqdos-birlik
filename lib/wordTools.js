// Сөзге қатысты жеңіл көмекшілер (сөз қорының өзінсіз). lib/words.js бәрін қайта экспорттайды.
// Бөлек модуль: Store мен беттер үлкен сөз қорын (lib/words*.js) жүктемей-ақ қолдана алады.

// Басқа тілдердегі аудармалар (ЖИ арқылы алынып, құрылғыда сақталады): { tr: { "сәлем": "merhaba" } }
export const WTR = {};
export function setWordTr(lang, map) {
  WTR[lang] = { ...(WTR[lang] || {}), ...map };
}
// Аударма: ru/en бар; басқа тілдерде алдымен сақталған аударма, болмаса ағылшынша
export function tr(w, lang) {
  if (!w) return "";
  if (lang === "ru" || lang === "kk") return w.ru;
  if (lang === "en") return w.en;
  return WTR[lang]?.[w.kk] || w.en;
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
