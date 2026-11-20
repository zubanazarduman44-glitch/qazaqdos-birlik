// Қайталау жүйесі (жеңіл аралықты қайталау, Лейтнер қораптары).
// Қате кеткен сөз 1-қорапқа түседі және сол күні-ақ қайталауға шығады.
// Дұрыс жауап — келесі қорап: 1 → 3 → 7 → 14 → 30 күннен кейін. 5-қораптан өтсе — «меңгерілді», тізімнен шығады.
// Қате жауап — қайта 1-қорап, ертең қайталанады.
// Күй: state.review = { [kk]: { box, due, miss } }  (due — жергілікті күннің реттік нөмірі, localDayIndex)

export const INTERVALS = [0, 1, 3, 7, 14, 30];
const MAX = 400;

function cap(r) {
  const keys = Object.keys(r);
  if (keys.length <= MAX) return r;
  // Ең ертеректе қайталанатындарын қалдырамыз
  const keep = keys.sort((a, b) => r[a].due - r[b].due).slice(0, MAX);
  return Object.fromEntries(keep.map((k) => [k, r[k]]));
}

// Сабақтағы қателерді қосу: бүгін-ақ қайталауға шығады
export function addMistakes(review, words, today) {
  const r = { ...(review || {}) };
  for (const kk of words || []) {
    if (!kk) continue;
    const cur = r[kk];
    r[kk] = { box: 1, due: today, miss: (cur?.miss || 0) + 1 };
  }
  return cap(r);
}

// Қайталау кезіндегі жауап
export function grade(review, kk, ok, today) {
  const r = { ...(review || {}) };
  const cur = r[kk];
  if (!cur) return r;
  if (ok) {
    // Ағымдағы қораптың аралығы: 1-қорап → 1 күн, 2 → 3, 3 → 7, 4 → 14, 5 → 30; 6-қораптан кейін — меңгерілді
    if (cur.box >= INTERVALS.length) delete r[kk];
    else r[kk] = { ...cur, box: cur.box + 1, due: today + INTERVALS[cur.box] };
  } else {
    r[kk] = { ...cur, box: 1, due: today + 1, miss: (cur.miss || 0) + 1 };
  }
  return r;
}

// Бүгін қайталанатын сөздер: ең көп қателескені мен ең көп кешіккені бірінші
export function dueWords(review, today) {
  return Object.entries(review || {})
    .filter(([, v]) => v && v.due <= today)
    .sort((a, b) => a[1].due - b[1].due || (b[1].miss || 0) - (a[1].miss || 0))
    .map(([k]) => k);
}

// Екі құрылғының қайталау тізімін біріктіру: әр сөз үшін — соңғы қайталанған (due үлкені) нұсқа
export function mergeReview(a, b) {
  const out = { ...(b || {}) };
  for (const [k, v] of Object.entries(a || {})) if (!out[k] || (v?.due || 0) >= (out[k]?.due || 0)) out[k] = v;
  return out;
}

const TX = {
  kk: { tab: "Қайталау", due: (n) => `Бүгін қайталайтын ${n} сөз`, none: "Бүгін қайталайтын сөз жоқ. Сабақта қателескен сөздер осында келеді және 1, 3, 7, 14, 30 күннен кейін қайта шығады.", start: "Қайталауды бастау", done: "Бүгінгі қайталау аяқталды!", hint: "Қате кеткен сөздер ұмытылмас үшін дәл уақытында қайта шығады." },
  ru: { tab: "Повтор", due: (n) => `Слов на повтор сегодня: ${n}`, none: "Сегодня повторять нечего. Слова с ошибками из уроков появятся здесь и вернутся через 1, 3, 7, 14 и 30 дней.", start: "Начать повтор", done: "Повтор на сегодня завершён!", hint: "Слова с ошибками возвращаются как раз тогда, когда начинают забываться." },
  en: { tab: "Review", due: (n) => `${n} words to review today`, none: "Nothing to review today. Words you miss in lessons land here and come back after 1, 3, 7, 14 and 30 days.", start: "Start review", done: "Today's review is done!", hint: "Missed words come back just before you'd forget them." },
  zh: { tab: "复习", due: (n) => `今天要复习 ${n} 个词`, none: "今天没有要复习的词。课上答错的词会出现在这里，并在 1、3、7、14、30 天后再次出现。", start: "开始复习", done: "今天的复习完成了！", hint: "答错的词会在你快忘记时再次出现。" },
  es: { tab: "Repaso", due: (n) => `${n} palabras para repasar hoy`, none: "Hoy no hay nada que repasar. Las palabras que falles en las lecciones aparecerán aquí y volverán a los 1, 3, 7, 14 y 30 días.", start: "Empezar repaso", done: "¡Repaso de hoy terminado!", hint: "Las palabras falladas vuelven justo antes de que las olvides." },
  de: { tab: "Wiederholen", due: (n) => `Heute ${n} Wörter wiederholen`, none: "Heute gibt es nichts zu wiederholen. Wörter, die du in Lektionen falsch hast, landen hier und kommen nach 1, 3, 7, 14 und 30 Tagen wieder.", start: "Wiederholung starten", done: "Die heutige Wiederholung ist fertig!", hint: "Falsche Wörter kommen kurz bevor du sie vergisst zurück." },
  fr: { tab: "Révision", due: (n) => `${n} mots à réviser aujourd'hui`, none: "Rien à réviser aujourd'hui. Les mots ratés en leçon arrivent ici et reviennent après 1, 3, 7, 14 et 30 jours.", start: "Commencer la révision", done: "Révision du jour terminée !", hint: "Les mots ratés reviennent juste avant que tu les oublies." },
  tr: { tab: "Tekrar", due: (n) => `Bugün tekrar edilecek ${n} kelime`, none: "Bugün tekrar edilecek kelime yok. Derslerde yanlış yaptığın kelimeler buraya gelir ve 1, 3, 7, 14 ve 30 gün sonra yeniden çıkar.", start: "Tekrara başla", done: "Bugünkü tekrar bitti!", hint: "Yanlış yapılan kelimeler tam unutmak üzereyken geri gelir." },
  ar: { tab: "مراجعة", due: (n) => `${n} كلمات للمراجعة اليوم`, none: "لا شيء للمراجعة اليوم. الكلمات التي تخطئ فيها في الدروس تظهر هنا وتعود بعد 1 و3 و7 و14 و30 يومًا.", start: "ابدأ المراجعة", done: "انتهت مراجعة اليوم!", hint: "تعود الكلمات الخاطئة قبل أن تنساها مباشرة." },
  ko: { tab: "복습", due: (n) => `오늘 복습할 단어 ${n}개`, none: "오늘은 복습할 단어가 없어요. 수업에서 틀린 단어가 여기에 모이고 1, 3, 7, 14, 30일 후에 다시 나와요.", start: "복습 시작", done: "오늘 복습을 마쳤어요!", hint: "틀린 단어는 잊어버리기 직전에 다시 나와요." },
  ja: { tab: "復習", due: (n) => `今日の復習：${n}語`, none: "今日復習する単語はありません。レッスンでまちがえた単語がここに入り、1・3・7・14・30日後にまた出てきます。", start: "復習をはじめる", done: "今日の復習が終わりました！", hint: "まちがえた単語は、忘れかけたころにまた出てきます。" },
};
export const reviewTx = (lang) => TX[lang] || TX.en;
