// Деңгей тестінің күйі (state.levelTest): тәуелділіксіз шағын модуль — Store.js-ке де жеңіл.
// levelTest: { done, run, cefr, total, count, per, at } немесе { skipped: true, at }

// Деңгей тестінің нәтижесін сақтау: бір «run» бір рет қана жазылады (қайта жүктеу/екі рет басу марапатты қайталамайды)
export function saveLevelResult(s, run, g, at = Date.now()) {
  if (s.levelTest?.run === run && s.levelTest?.done) return s;
  return {
    ...s,
    cefr: g.cefr,
    levelTest: { done: true, run, cefr: g.cefr, total: g.total, count: g.count, per: g.per, at },
    profile: { ...s.profile, levelPending: false },
  };
}

// Тестті өткізіп жіберу: нәтиже ретінде есептелмейді (cefr өзгермейді, XP берілмейді)
export function skipLevelTest(s, at = Date.now()) {
  const levelTest = s.levelTest?.done ? s.levelTest : { ...(s.levelTest || {}), skipped: true, at };
  return { ...s, levelTest, profile: { ...s.profile, levelPending: false } };
}

// Құрылғы мен бұлттағы тест нәтижесін біріктіру: аяқталған және жаңасы басым
export function mergeLevelTest(a, b) {
  if (!a) return b || null;
  if (!b) return a;
  if (a.done !== b.done) return a.done ? a : b;
  return (a.at || 0) >= (b.at || 0) ? a : b;
}
