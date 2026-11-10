// Жаңа бөлімдердің мәтіндері: Dengei (деңгей тесті), Aitylym (айтылым), сөз аудармасы.
// Әр кілт: [қазақша, орысша, ағылшынша]. Басқа түсіндіру тілдері ағылшынша көрсетіледі.
const S = {
  // ── Dengei ──
  lvlKicker: ["Бастар алдында", "Перед стартом", "Before you start"],
  lvlTitle: ["Dengei", "Мой уровень", "My level"],
  lvlSub: ["Қысқа тест қазақ тіліндегі деңгейіңді анықтайды. Шамамен 3 минут, 20 сұрақ.", "Короткий тест определит ваш уровень казахского. Около 3 минут, 20 вопросов.", "A short test finds your Kazakh level. About 3 minutes, 20 questions."],
  lvlStart: ["Тестті бастау", "Начать тест", "Start the test"],
  lvlSkip: ["Кейінірек", "Позже", "Later"],
  lvlQ: [(i, n) => `${i} / ${n} сұрақ`, (i, n) => `Вопрос ${i} из ${n}`, (i, n) => `Question ${i} of ${n}`],
  lvlDont: ["Білмеймін", "Не знаю", "I don't know"],
  lvlResult: ["Сенің деңгейің", "Ваш уровень", "Your level"],
  lvlScore: [(a, b) => `${a} / ${b} дұрыс жауап`, (a, b) => `Верно: ${a} из ${b}`, (a, b) => `${a} of ${b} correct`],
  lvlRetake: ["Қайта тапсыру", "Пройти заново", "Retake"],
  lvlGo: ["Үйренуді бастау", "Начать учиться", "Start learning"],
  lvlHint: ["Тест нәтижесі Aqyl-ның түсіндіруін саған бейімдейді.", "Результат поможет Aqyl подстроить объяснения под вас.", "The result helps Aqyl adapt explanations to you."],
  lvlBanner: ["Қазақ тіліндегі деңгейіңді анықта", "Определите свой уровень казахского", "Find out your Kazakh level"],
  lvlNames: [
    { A0: "Жаңадан бастаушы", A1: "Бастапқы", A2: "Негізгі", B1: "Орташа", B2: "Жоғары орташа" },
    { A0: "Начинающий", A1: "Начальный", A2: "Базовый", B1: "Средний", B2: "Выше среднего" },
    { A0: "Beginner", A1: "Elementary", A2: "Basic", B1: "Intermediate", B2: "Upper-intermediate" },
  ],
  lvlDesc: [
    { A0: "Алғашқы сөздерден бастаймыз: сәлемдесу, сандар, түстер.", A1: "Сәлемдесу, қарапайым сөздер мен қысқа сөйлемдерді білесің.", A2: "Қарапайым әңгіме, өткен шақ және негізгі жалғауларды қолданасың.", B1: "Күнделікті тақырыпта ойыңды жеткізе аласың, септіктерді білесің.", B2: "Күрделі сөйлемдер мен мақал-мәтелдерді түсініп, еркін сөйлейсің." },
    { A0: "Начнём с первых слов: приветствия, числа, цвета.", A1: "Вы знаете приветствия, простые слова и короткие фразы.", A2: "Вы ведёте простой разговор, знаете прошедшее время и основные окончания.", B1: "Вы выражаете мысли на бытовые темы и знаете падежи.", B2: "Вы понимаете сложные предложения и пословицы и говорите свободно." },
    { A0: "We start with the first words: greetings, numbers, colours.", A1: "You know greetings, simple words and short phrases.", A2: "You hold simple conversations and use the past tense and basic endings.", B1: "You express yourself on everyday topics and know the cases.", B2: "You understand complex sentences and proverbs and speak freely." },
  ],
  lvlNext: [
    { A0: "Саяхат бөлімінен баста: әр өңірде 4 жаңа сөз.", A1: "Ойындар мен Aqyl-мен чатта сөздерді бекіт.", A2: "Jazu бөлімінде қысқа мәтіндер жазып көр.", B1: "Aitylym бөлімінде айтылымыңды жаттықтыр.", B2: "Тарих бөлімі мен мақал-мәтелдерді зерттей бер." },
    { A0: "Начните с раздела «Путешествие»: 4 новых слова в каждом регионе.", A1: "Закрепляйте слова в играх и в чате с Aqyl.", A2: "Попробуйте писать короткие тексты в разделе «Письмо».", B1: "Тренируйте произношение в разделе «Речь».", B2: "Изучайте историю и пословицы." },
    { A0: "Start with Travel: 4 new words in every region.", A1: "Reinforce words in games and in chat with Aqyl.", A2: "Try writing short texts in the Writing coach.", B1: "Practise pronunciation in Speaking.", B2: "Keep exploring history and proverbs." },
  ],

  // ── Aitylym ──
  spKicker: ["Сөйлеу жаттығуы", "Тренировка речи", "Speaking practice"],
  spTitle: ["Aitylym", "Произношение", "Speaking"],
  spSub: ["Фразаны дауыстап айт: Aqyl айтылымыңды тыңдап, сөйлеу деңгейіңді анықтайды.", "Произнесите фразу вслух: Aqyl оценит произношение и определит ваш уровень речи.", "Say the phrase out loud: Aqyl checks your pronunciation and finds your speaking level."],
  spLevelNow: ["Сөйлеу деңгейің", "Ваш уровень речи", "Your speaking level"],
  spLevelNone: ["Әлі анықталмаған", "Пока не определён", "Not set yet"],
  spLevelHow: ["Кемінде 70 ұпай алған ең күрделі фраза деңгейің болады.", "Уровнем станет самая сложная фраза, оценённая на 70 баллов и выше.", "Your level is the hardest phrase you score 70+ on."],
  spPick: ["Фраза таңда", "Выберите фразу", "Choose a phrase"],
  spTarget: ["Айтатын фраза", "Фраза для произнесения", "Phrase to say"],
  spListen: ["Тыңдау", "Послушать", "Listen"],
  spNoVoice: ["Бұл құрылғыда қазақша дауыс жоқ", "На этом устройстве нет казахского голоса", "No Kazakh voice on this device"],
  spRec: ["Айтуды бастау", "Начать запись", "Start speaking"],
  spStop: ["Тоқтату", "Остановить", "Stop"],
  spRecording: ["Жазылып жатыр…", "Идёт запись…", "Recording…"],
  spAnalyzing: ["Aqyl тыңдап жатыр…", "Aqyl слушает…", "Aqyl is listening…"],
  spMicDenied: ["Микрофонға рұқсат берілмеді. Браузер баптауларынан рұқсат бер.", "Нет доступа к микрофону. Разрешите его в настройках браузера.", "Microphone access denied. Allow it in your browser settings."],
  spNoMic: ["Бұл браузер дыбыс жазуды қолдамайды", "Этот браузер не поддерживает запись звука", "This browser does not support audio recording"],
  spScore: ["Ұпай", "Баллы", "Score"],
  spHeard: ["Aqyl естігені", "Что услышал Aqyl", "What Aqyl heard"],
  spTips: ["Кеңестер", "Советы", "Tips"],
  spTryAgain: ["Қайталау", "Ещё раз", "Try again"],
  spNext: ["Келесі фраза", "Следующая фраза", "Next phrase"],
  spHistory: ["Соңғы әрекеттер", "Последние попытки", "Recent attempts"],
  spLimit: ["Ең көбі 15 секунд", "Не более 15 секунд", "Up to 15 seconds"],
  spCustom: ["Өз фразаң", "Своя фраза", "Your own phrase"],
  spCustomPh: ["Қазақша бір сөйлем жаз…", "Напишите фразу по-казахски…", "Type a phrase in Kazakh…"],
  spUse: ["Қолдану", "Использовать", "Use"],
  spNewLevel: ["Жаңа сөйлеу деңгейі", "Новый уровень речи", "New speaking level"],
  spHint: ["Тыныш жерде, микрофонға жақын сөйле.", "Говорите в тихом месте, ближе к микрофону.", "Speak somewhere quiet, close to the microphone."],
  spPrivacy: ["Дыбыс тек бағалау үшін жіберіледі және сақталмайды.", "Аудио отправляется только для оценки и не сохраняется.", "Audio is sent only for scoring and is not stored."],

  hPrev: ["Алдыңғы дәуір", "Раньше", "Earlier"],
  hNext: ["Келесі дәуір", "Позже", "Later"],

  proverb: ["Күннің мақалы", "Пословица дня", "Proverb of the day"],
  tradition: ["Қазақ дәстүрі", "Казахская традиция", "Kazakh tradition"],

  lpTitle: ["Қазақшаны қай тілмен үйренесің?", "На каком языке учить казахский?", "Learn Kazakh through which language?"],
  tzWrite: ["Жазу көмекшісі", "Помощник письма", "Writing coach"],
  tzSpeak: ["Айтылым", "Произношение", "Speaking"],
  brTitle: ["Aqyl өңір туралы айтады", "Aqyl рассказывает о регионе", "Aqyl on this region"],
  brLoading: ["Aqyl ақпарат жинап жатыр…", "Aqyl собирает информацию…", "Aqyl is gathering info…"],
  litTrans: ["Аудару", "Перевести", "Translate"],
  litTransHide: ["Аударманы жасыру", "Скрыть перевод", "Hide translation"],
  listen: ["Тыңдау", "Слушать", "Listen"],

  // ── Saiys ──
  sTitle: ["Saiys", "Saiys", "Saiys"],
  sKicker: ["Жарыс", "Соревнование", "Competition"],
  sSub: ["Апта бойы тапсырма орындап рейтингте көтеріл немесе достарыңмен 8 адамға дейін жарыс.", "Выполняйте задания всю неделю и поднимайтесь в рейтинге или соревнуйтесь с друзьями до 8 человек.", "Complete tasks all week and climb the ranking, or compete with up to 8 friends."],
  sWeekly: ["Апталық рейтинг", "Рейтинг недели", "Weekly ranking"],
  sRoom: ["Бөлме (8 адамға дейін)", "Комната (до 8 человек)", "Room (up to 8 players)"],
  sLogin: ["Жарысқа қатысу үшін аккаунтқа кір", "Войдите в аккаунт, чтобы участвовать", "Sign in to take part"],
  sLoginBtn: ["Кіру / тіркелу", "Войти / регистрация", "Sign in / sign up"],
  sTasks: ["тапсырма", "заданий", "tasks"],
  sYou: ["Сен", "Вы", "You"],
  sEnds: ["Апта аяқталуына", "До конца недели", "Week ends in"],
  sPrize: ["Осы аптаның жүлдесі", "Приз недели", "This week's prize"],
  sPrizeGift: ["Бағалы сыйлық: бірінші орын иесі әкімшіден нақты сыйлық алады", "Ценный подарок: победитель получает настоящий приз от администратора", "A valuable gift: the winner receives a real prize from the admin"],
  sPrizeCoins: ["Монета жүлдесі: 1-орын 500, 2-орын 300, 3-орын 150 🪙", "Призы монетами: 1 место — 500, 2 — 300, 3 — 150 🪙", "Coin prizes: 1st 500, 2nd 300, 3rd 150 🪙"],
  sLast: ["Өткен апта жеңімпаздары", "Победители прошлой недели", "Last week's winners"],
  sClaim: ["Жүлдені алу", "Забрать приз", "Claim prize"],
  sWonGift: ["Құттықтаймыз! Өткен аптада 1-орын алдың: бағалы сыйлық үшін әкімшіге хабарлас.", "Поздравляем! Вы заняли 1 место на прошлой неделе: свяжитесь с администратором за подарком.", "Congrats! You won last week: contact the admin for your gift."],
  sEmpty: ["Әзірге ешкім жоқ. Тапсырма орындап, бірінші бол!", "Пока никого нет. Выполняйте задания и будьте первым!", "Nobody yet. Complete tasks and be first!"],
  sSetup: ["Жарыс бөлімі әлі қосылмаған: Supabase-те qd_saiys.sql файлын бір рет іске қосу керек.", "Раздел ещё не подключён: выполните qd_saiys.sql в Supabase один раз.", "Not set up yet: run qd_saiys.sql in Supabase once."],
  sCreate: ["Бөлме ашу", "Создать комнату", "Create a room"],
  sJoin: ["Қосылу", "Войти", "Join"],
  sCode: ["Бөлме коды", "Код комнаты", "Room code"],
  sCodePh: ["Кодты жаз…", "Введите код…", "Enter code…"],
  sFull: ["Бөлме толы (8 адам)", "Комната заполнена (8 человек)", "Room is full (8 players)"],
  sNoRoom: ["Мұндай бөлме табылмады", "Комната не найдена", "Room not found"],
  sPlayers: ["Ойыншылар", "Игроки", "Players"],
  sStart: ["Жарысты бастау", "Начать", "Start"],
  sWaitHost: ["Бастаушыны күтіп тұрмыз…", "Ждём, пока ведущий начнёт…", "Waiting for the host…"],
  sShare: ["Достарыңа осы кодты жібер", "Отправьте этот код друзьям", "Share this code with friends"],
  sLeave: ["Бөлмеден шығу", "Выйти из комнаты", "Leave room"],
  sQ: [(i, n) => `${i} / ${n}`, (i, n) => `${i} / ${n}`, (i, n) => `${i} / ${n}`],
  sWaitOthers: ["Басқалар аяқтауын күтіп тұрмыз…", "Ждём остальных…", "Waiting for the others…"],
  sResults: ["Нәтиже", "Итоги", "Results"],
  sPoints: ["ұпай", "очков", "pts"],
  sAgain: ["Жаңа бөлме", "Новая комната", "New room"],
  sTrans: ["Сөздің аудармасын таңда", "Выберите перевод слова", "Pick the translation"],

  chPick: ["Кейіпкерді таңда", "Выберите персонажа", "Choose your character"],
  chNote: ["Кейіпкердің аты әрқашан Aqyl болып қалады, тек сырт келбеті өзгереді.", "Имя всегда остаётся Aqyl, меняется только облик.", "The name always stays Aqyl, only the look changes."],
  vTitle: ["Qazaqsha skaner", "Казахский сканер", "Kazakh scanner"],
  vHint: ["Затты рамкаға салып, суретке түсір", "Наведите на предмет и сфотографируйте", "Frame an object and take a photo"],
  vShot: ["Түсіру", "Снять", "Capture"],
  vCamera: ["Камера", "Камера", "Camera"],
  vGallery: ["Галерея", "Галерея", "Gallery"],
  vRetake: ["Қайта түсіру", "Снять заново", "Retake"],
  vResultTitle: ["Табылған сөз", "Найденное слово", "Found word"],

  // ── Duken ──
  shTitle: ["Duken", "Магазин", "Costume shop"],
  shKicker: ["Ұлттық киім", "Национальная одежда", "National costume"],
  shSub: ["Жинаған тиындарыңа қазақтың ұлттық киімдерін сатып алып, Aqyl-ға кигіз.", "Покупайте национальную одежду за монеты и наряжайте Aqyl.", "Buy national costume with your coins and dress Aqyl."],
  shBuy: ["Сатып алу", "Купить", "Buy"],
  shWear: ["Кигізу", "Надеть", "Wear"],
  shOff: ["Шешу", "Снять", "Take off"],
  shOwned: ["Сатып алынды", "Куплено", "Owned"],
  shNoCoins: ["Тиын жеткіліксіз", "Не хватает монет", "Not enough coins"],
  shBought: ["Сатып алынды!", "Куплено!", "Purchased!"],
  shAll: ["Барлығы", "Все", "All"],
  shYou: ["Aqyl-ның киімі", "Наряд Aqyl", "Aqyl's outfit"],
  shEarn: ["Тиынды ойын мен жаттығудан жина", "Монеты можно заработать в играх и заданиях", "Earn coins from games and practice"],

  // ── Adebiet ──
  litTitle: ["Adebiet", "Литература", "Literature"],
  litKicker: ["Қазақ әдебиеті", "Казахская литература", "Kazakh literature"],
  litSub: ["15 танымал шығарма: мәтінді оқы, Aqyl бірге оқиды, сосын сұрақтарға жауап бер.", "15 известных произведений: читайте, Aqyl читает вместе с вами, затем отвечайте на вопросы.", "15 famous works: read, Aqyl reads along, then answer questions."],
  litBack: ["Барлық шығармалар", "Все произведения", "All works"],
  litRead: ["Aqyl оқиды", "Aqyl читает", "Aqyl reads"],
  litPause: ["Тоқтату", "Пауза", "Pause"],
  litDone: ["Оқып бітірдім", "Дочитал", "I finished"],
  litDoneMark: ["Оқылды", "Прочитано", "Read"],
  litNote: ["Мәтін — қарапайым қазақшамен жазылған қысқаша баяндама. Сөзге бассаң, аудармасы шығады.", "Текст — краткое изложение простым казахским. Нажмите на слово — увидите перевод.", "The text is a short retelling in simple Kazakh. Tap a word to translate it."],
  litNoVoice: ["Қазақша дауыс қолжетімсіз, сондықтан орыс дауысымен оқылады (айтылуы шамалы өзгеше болуы мүмкін).", "Казахский голос недоступен, поэтому читает русский голос (произношение может немного отличаться).", "Kazakh voice unavailable, so a fallback voice reads (pronunciation may differ a little)."],
  litChatTitle: ["Aqyl-нан сұра", "Спросите Aqyl", "Ask Aqyl"],
  litAskBtn: ["Aqyl-нан мәтін туралы сұра", "Спросить Aqyl о тексте", "Ask Aqyl about the text"],
  litTest: ["Шығарма бойынша тест (5 сұрақ)", "Тест по произведению (5 вопросов)", "Quiz on the work (5 questions)"],
  litTestLoading: ["Aqyl тест құрастырып жатыр…", "Aqyl составляет тест…", "Aqyl is preparing the quiz…"],
  litTestScore: [(a, b) => `Нәтиже: ${a} / ${b}`, (a, b) => `Результат: ${a} из ${b}`, (a, b) => `Score: ${a} of ${b}`],
  litAsk: ["Мәтін туралы сұра немесе жауап жаз…", "Спросите о тексте или напишите ответ…", "Ask about the text or write your answer…"],
  litFirst: ["Мен оқып бітірдім. Маған мәтін бойынша сұрақтар қой.", "Я дочитал. Задай мне вопросы по тексту.", "I finished reading. Ask me questions about the text."],
  litGist: ["Қысқаша", "Кратко", "Summary"],

  // ── Сөзге басу ──
  tapKk: ["Қазақша", "По-казахски", "Kazakh"],
  tapRu: ["Орысша", "По-русски", "Russian"],
  tapEn: ["Ағылшынша", "По-английски", "English"],
  tapLoading: ["Аударылып жатыр…", "Перевожу…", "Translating…"],
  tapErr: ["Аударма табылмады", "Перевод не найден", "No translation found"],
  tapSave: ["Сөз қорына қосу", "Добавить в словарь", "Add to my words"],
  tapSaved: ["Сақталды", "Сохранено", "Saved"],
  tapHint: ["Кез келген сөзге бас — аудармасын көр", "Нажмите на любое слово — увидите перевод", "Tap any word to see its translation"],
};

import { apply } from "./uitr";
const IDX = { kk: 0, ru: 1 };
let OV = null; // басқа тілге аударылған жолдар (Store орнатады)
export function setTxOverride(lang, map) {
  OV = map && Object.keys(map).length ? { lang, map } : null;
}
export function tx(lang) {
  const i = IDX[lang] ?? 2;
  const out = {};
  for (const [k, v] of Object.entries(S)) out[k] = v[i];
  return OV && OV.lang === lang ? apply(out, OV.map) : out;
}

// Ағылшынша мәтіндер тізімі (аудару үшін)
export function txEnglish() {
  return tx("__en__");
}
