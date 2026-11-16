// Aqyl мұғалім-кейіпкерінің мәтіндері — 11 тіл (жоқ тіл ағылшыншаға түседі).
// Қолданылуы: Aqyl.js, AqylExplain.js, AqylGuide.js, LessonPlayer.js, Quiz.js, /app/qyran.
import { useEffect, useState } from "react";

const L = {
  kk: {
    explains: "Aqyl түсіндіреді", askMore: "Толығырақ түсіндірші", why: "Неге қате?", thinking: "Aqyl ойланып жатыр…",
    aiFail: "Aqyl қазір жауап бере алмады. Кейінірек қайталап көр.", close: "Жабу", rightIs: "Дұрысы:",
    hard: "Жуан сөз (а, о, ұ, ы): жалғаулары да жуан, а мен ы әрпімен келеді.",
    soft: "Жіңішке сөз (ә, е, ө, ү, і): жалғаулары да жіңішке, е мен і әрпімен келеді.",
    forms: { pl: "көпше", dat: "барыс: қайда? кімге?", loc: "жатыс: қайда? кімде?" },
    letters: { "ә": "ә — жіңішке, ашық «а» (ағылш. cat)", "ғ": "ғ — тамақтан шығатын жұмсақ «г»", "қ": "қ — тамақтың түбінен шығатын қатаң «к»", "ң": "ң — мұрыннан айтылатын «нг» (ағылш. sing)", "ө": "ө — ерінді, жіңішке дауысты (неміс. ö)", "ұ": "ұ — қысқа, ерінді, жуан «у»", "ү": "ү — ерінді, жіңішке дауысты (неміс. ü)", "һ": "һ — жеңіл «х» (ағылш. h)", "і": "і — өте қысқа, жіңішке «и»" },
    q: "Соңындағы ма/ме (ба/бе, па/пе) сөйлемді «иә ма, жоқ па?» деген сұраққа айналдырады.",
    polite: "Сіз — сыпайы түрі (үлкенге, бейтанысқа), сен — досқа, балаға.",
    neg: "«емес» сөзі болымсыздықты білдіреді: Бұл үй емес.",
    verb: "Етістіктің сөздік түрі -у әрпімен бітеді: бару (бар-), келу (кел-).",
    wrongTr: (l, k) => `«${l}» — «${k}» сөзінің аудармасы.`,
    notThis: (p) => `«${p}» мұнда келмейді.`,
    letter: (a, b) => `Әріпке қара: «${a}» емес, «${b}».`,
    root: (a, b) => `Түбірі бір, бірақ жалғауы басқа: «${a}» емес, «${b}».`,
    tfYes: (k, t) => `Иә, «${k}» шынымен «${t}» дегенді білдіреді.`,
    tfNo: (k, t, s) => `«${k}» — «${t}», «${s}» емес.`,
    built: (x) => `Сен құрастырғаның: «${x}».`,
    verbLast: "Қазақ сөйлемінде етістік әдетте ең соңында тұрады.",
    pairs: "Дұрыс жұптар:",
    praise: { s3: "Жарайсың! Қатарынан үш дұрыс жауап!", s5: "Керемет! Бес жауап қатарынан дұрыс!", perfect: "Мінсіз! Бір қате де жібермедің.", great: "Тамаша нәтиже! Сөздер есіңде жақсы қалды.", good: "Жақсы! Қателерді тағы бір қайталасақ, бәрі есте қалады.", keep: "Бастысы — талпыныс. Тағы бір өтейік, мен көмектесемін!" },
    guide: {
      kicker: "Aqyl кеңесі",
      level: ["Алдымен деңгейіңді анықтайық — қысқа тест, шамамен 3 минут.", "Тестті бастау"],
      streak: (n) => [`Ошағың ${n} күн қатарынан жанып тұр. Бүгін бір қысқа сабақ өтсең, от сөнбейді!`, "Ошақты сақтау"],
      start: (t) => [`Бүгінді «${t}» сабағынан бастайық!`, "Сабақты бастау"],
      more: (n) => [`Жақсы бастадың! Бүгінгі мақсатқа ${n} XP қалды.`, "Жалғастыру"],
      weak: (n) => [`Өткен сабақта ${n} сөзде қателестің — оларды бірге қайталайық.`, "Сөздерді қайталау"],
      vr: ["Бүгінгі мақсат орындалды — жарайсың! Енді VR Әлемде тірі әңгімеге қатысып көр.", "VR Әлемге өту"],
      chat: ["Бүгін жақсы еңбектендің! Қазақ тілі туралы сұрағың болса, маған жаз.", "Aqyl-мен сөйлесу"],
    },
    chat: {
      idle: "Сұрағыңды жаз — мен тыңдап тұрмын.", thinking: "Ойланып жатырмын…", talking: "Міне, жауабым!", explaining: "Қадам-қадаммен түсіндірейін.",
      listening: "Тыңдап тұрмын — қазақша айтып көр!", looking: "Затты көрсет, атын айтайын.", oops: "Бірдеңе дұрыс болмады — қайталап көрейік.",
      tryAsk: "Мынаны сұрап көр", more: ["Үндестік заңын қарапайым түсіндірші", "Тамаққа қатысты 5 сөзді мысалымен бер", "Сандар бойынша маған 3 сұрақ қой", "Бір мақал айтып, мағынасын түсіндірші"],
      listen: "Тыңдау", copy: "Көшіру", copied: "Көшірілді", words: "Сөздерді тыңда", role: "қазақ тілінің ұстазы",
    },
  },
  ru: {
    explains: "Aqyl объясняет", askMore: "Спросить Aqyl подробнее", why: "Почему неверно?", thinking: "Aqyl думает…",
    aiFail: "Aqyl сейчас не смог ответить. Попробуйте позже.", close: "Закрыть", rightIs: "Правильно:",
    hard: "Твёрдое слово (а, о, ұ, ы): окончания тоже твёрдые — с буквами а и ы.",
    soft: "Мягкое слово (ә, е, ө, ү, і): окончания тоже мягкие — с буквами е и і.",
    forms: { pl: "мн. число", dat: "дательный: куда? кому?", loc: "местный: где? у кого?" },
    letters: { "ә": "ә — открытый мягкий «а», как в англ. cat", "ғ": "ғ — мягкий гортанный «г», похож на французское r", "қ": "қ — глубокий твёрдый «к» из горла", "ң": "ң — носовой «нг», как в англ. sing", "ө": "ө — как немецкое ö, губы округлены", "ұ": "ұ — краткий твёрдый «у»", "ү": "ү — как немецкое ü", "һ": "һ — лёгкий выдох, как англ. h", "і": "і — очень краткий мягкий «и»" },
    q: "Частица ма/ме (ба/бе, па/пе) в конце превращает фразу в вопрос «да или нет?».",
    polite: "Сіз — вежливое «вы» (старшим, незнакомым), сен — «ты» для друзей и детей.",
    neg: "«емес» — отрицание «не»: Бұл үй емес — Это не дом.",
    verb: "Словарная форма глагола оканчивается на -у: бару (бар-), келу (кел-).",
    wrongTr: (l, k) => `«${l}» — это перевод слова «${k}».`,
    notThis: (p) => `«${p}» здесь не подходит.`,
    letter: (a, b) => `Посмотрите на букву: не «${a}», а «${b}».`,
    root: (a, b) => `Корень тот же, но окончание другое: не «${a}», а «${b}».`,
    tfYes: (k, t) => `Да, «${k}» действительно значит «${t}».`,
    tfNo: (k, t, s) => `«${k}» — это «${t}», а не «${s}».`,
    built: (x) => `У вас получилось: «${x}».`,
    verbLast: "В казахском предложении глагол обычно стоит в самом конце.",
    pairs: "Правильные пары:",
    praise: { s3: "Молодец! Три верных ответа подряд!", s5: "Отлично! Пять верных подряд!", perfect: "Идеально! Ни одной ошибки.", great: "Прекрасный результат! Слова хорошо запомнились.", good: "Хорошо! Повторим ошибки — и всё запомнится.", keep: "Главное — стараться. Пройдём ещё раз, я помогу!" },
    guide: {
      kicker: "Совет Aqyl",
      level: ["Сначала определим ваш уровень — короткий тест, около 3 минут.", "Пройти тест"],
      streak: (n) => [`Ваш очаг горит ${n} дн. подряд. Один короткий урок сегодня — и огонь не погаснет!`, "Сохранить очаг"],
      start: (t) => [`Начнём сегодня с урока «${t}»!`, "Начать урок"],
      more: (n) => [`Хорошее начало! До цели дня осталось ${n} XP.`, "Продолжить"],
      weak: (n) => [`В прошлом уроке были ошибки в ${n} словах — давайте повторим их вместе.`, "Повторить слова"],
      vr: ["Цель дня выполнена — молодец! Попробуйте живой разговор в VR Әлем.", "Открыть VR Әлем"],
      chat: ["Сегодня вы хорошо поработали! Есть вопрос о казахском — пишите мне.", "Чат с Aqyl"],
    },
    chat: {
      idle: "Пишите вопрос — я слушаю.", thinking: "Думаю…", talking: "Вот мой ответ!", explaining: "Объясню шаг за шагом.",
      listening: "Слушаю — скажите по-казахски!", looking: "Покажите предмет — я назову его.", oops: "Что-то пошло не так — попробуем ещё раз.",
      tryAsk: "Спросите меня", more: ["Объясни закон сингармонизма простыми словами", "Дай 5 слов о еде с примерами", "Задай мне 3 вопроса на числа", "Расскажи казахскую пословицу и объясни её"],
      listen: "Слушать", copy: "Копировать", copied: "Скопировано", words: "Послушать слова", role: "учитель казахского",
    },
  },
  en: {
    explains: "Aqyl explains", askMore: "Ask Aqyl for more", why: "Why is it wrong?", thinking: "Aqyl is thinking…",
    aiFail: "Aqyl couldn't answer right now. Please try again later.", close: "Close", rightIs: "Correct:",
    hard: "Back-vowel word (а, о, ұ, ы): its endings are back too — with а and ы.",
    soft: "Front-vowel word (ә, е, ө, ү, і): its endings are front too — with е and і.",
    forms: { pl: "plural", dat: "to … (dative)", loc: "in / at … (locative)" },
    letters: { "ә": "ә — open 'a' as in cat", "ғ": "ғ — soft throaty 'g', close to French r", "қ": "қ — deep 'k' from the back of the throat", "ң": "ң — nasal 'ng' as in sing", "ө": "ө — like German ö, rounded lips", "ұ": "ұ — short 'u' as in put", "ү": "ү — like German ü / French u", "һ": "һ — soft 'h' as in hat", "і": "і — very short 'i' as in bit" },
    q: "The particle ма/ме (ба/бе, па/пе) at the end turns the sentence into a yes/no question.",
    polite: "Сіз is the polite 'you' (elders, strangers); сен is for friends and children.",
    neg: "«емес» means 'not': Бұл үй емес — This is not a house.",
    verb: "A verb's dictionary form ends in -у: бару (бар-), келу (кел-).",
    wrongTr: (l, k) => `"${l}" is the translation of «${k}».`,
    notThis: (p) => `«${p}» doesn't fit here.`,
    letter: (a, b) => `Look at the letter: not «${a}» but «${b}».`,
    root: (a, b) => `Same root, different ending: not «${a}» but «${b}».`,
    tfYes: (k, t) => `Yes — «${k}» really means "${t}".`,
    tfNo: (k, t, s) => `«${k}» means "${t}", not "${s}".`,
    built: (x) => `You built: «${x}».`,
    verbLast: "In a Kazakh sentence the verb usually comes last.",
    pairs: "Correct pairs:",
    praise: { s3: "Well done! Three right in a row!", s5: "Brilliant! Five right in a row!", perfect: "Perfect! Not a single mistake.", great: "Great result! The words really stuck.", good: "Good! Let's review the slips and it'll all stick.", keep: "Effort is what counts. Let's go again — I'll help!" },
    guide: {
      kicker: "Aqyl's advice",
      level: ["First, let's find your level — a short test, about 3 minutes.", "Take the test"],
      streak: (n) => [`Your fire has burned ${n} days in a row. One short lesson today keeps it alive!`, "Keep the fire"],
      start: (t) => [`Let's start today with the lesson "${t}"!`, "Start lesson"],
      more: (n) => [`Good start! ${n} XP left to today's goal.`, "Continue"],
      weak: (n) => [`You slipped on ${n} words last lesson — let's review them together.`, "Review words"],
      vr: ["Today's goal is done — well done! Now try a live conversation in VR Әлем.", "Open VR Әлем"],
      chat: ["You worked well today! Any question about Kazakh — just write to me.", "Chat with Aqyl"],
    },
    chat: {
      idle: "Type your question — I'm listening.", thinking: "Thinking…", talking: "Here's my answer!", explaining: "Let me explain step by step.",
      listening: "I'm listening — say it in Kazakh!", looking: "Show me the object and I'll name it.", oops: "Something went wrong — let's try again.",
      tryAsk: "Try asking", more: ["Explain vowel harmony simply", "Give me 5 food words with examples", "Quiz me with 3 questions on numbers", "Tell me a Kazakh proverb and explain it"],
      listen: "Listen", copy: "Copy", copied: "Copied", words: "Hear the words", role: "your Kazakh teacher",
    },
  },
};

// Қалған 8 тіл бөлек файлда: тек таңдалған тіл жүктеледі (бетті жеңілдету үшін).
const LOADERS = {
  zh: () => import("./aqyl-l10n/zh"), es: () => import("./aqyl-l10n/es"), de: () => import("./aqyl-l10n/de"),
  fr: () => import("./aqyl-l10n/fr"), tr: () => import("./aqyl-l10n/tr"), ar: () => import("./aqyl-l10n/ar"),
  ko: () => import("./aqyl-l10n/ko"), ja: () => import("./aqyl-l10n/ja"),
};
const pending = {};
export function loadAqylL(lang) {
  if (L[lang] || !LOADERS[lang]) return Promise.resolve(L[lang] || L.en);
  return (pending[lang] ||= LOADERS[lang]().then((m) => (L[lang] = m.default)).catch(() => L.en));
}
export const aqylL = (lang) => L[lang] || L.en;

// Компонент ішінде: тіл жүктелгенде қайта көрсетеді.
export function useAqylL(lang) {
  const [, bump] = useState(0);
  useEffect(() => {
    if (L[lang] || !LOADERS[lang]) return;
    let on = true;
    loadAqylL(lang).then(() => on && bump((n) => n + 1));
    return () => { on = false; };
  }, [lang]);
  return aqylL(lang);
}
