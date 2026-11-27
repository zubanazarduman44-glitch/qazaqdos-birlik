// Әдебиет бетінің жаңа белгілері (эпизод оқу): 11 тіл. LT(lang).key
const T = {
  about: {
    kk: "Шығарма туралы", ru: "О произведении", en: "About the work", zh: "作品简介", es: "Sobre la obra", de: "Über das Werk",
    fr: "À propos de l’œuvre", tr: "Eser hakkında", ar: "عن العمل", ko: "작품 소개", ja: "作品について",
  },
  start: {
    kk: "Оқуды бастау", ru: "Начать чтение", en: "Start reading", zh: "开始阅读", es: "Empezar a leer", de: "Lesen beginnen",
    fr: "Commencer la lecture", tr: "Okumaya başla", ar: "ابدأ القراءة", ko: "읽기 시작", ja: "読み始める",
  },
  adapted: {
    kk: "Бейімделген үзінді", ru: "Адаптированный эпизод", en: "Adapted episode", zh: "改编片段", es: "Episodio adaptado", de: "Bearbeitete Episode",
    fr: "Épisode adapté", tr: "Uyarlanmış bölüm", ar: "مقطع مُبسَّط", ko: "각색된 에피소드", ja: "やさしく書き直した場面",
  },
  adaptedNote: {
    kk: "Тілі оқушыларға арнап жеңілдетілген: бұл — түпнұсқадан дәйексөз емес, оқиғаның қысқа баяндауы.",
    ru: "Язык упрощён для изучающих: это не цитата из оригинала, а краткий пересказ эпизода.",
    en: "Simplified for learners: this is a short retelling of the episode, not a quotation from the original.",
    zh: "为学习者简化的语言：这是情节的简短复述，并非原文引用。",
    es: "Lenguaje simplificado para estudiantes: es un breve recuento del episodio, no una cita del original.",
    de: "Für Lernende vereinfacht: eine kurze Nacherzählung der Episode, kein Zitat aus dem Original.",
    fr: "Langue simplifiée pour les apprenants : un bref récit de l’épisode, pas une citation de l’original.",
    tr: "Öğrenciler için sadeleştirildi: bu, orijinalden alıntı değil, bölümün kısa bir anlatımıdır.",
    ar: "لغة مبسّطة للمتعلمين: هذا سرد موجز للحدث وليس اقتباسًا من النص الأصلي.",
    ko: "학습자를 위해 쉽게 다시 쓴 글입니다. 원문 인용이 아니라 장면을 짧게 다시 이야기한 것입니다.",
    ja: "学習者向けにやさしくした文です。原文の引用ではなく、場面の短い再話です。",
  },
  hint: {
    kk: "Сөзге бассаң — аудармасы. Сөйлемді таңдап, «Бәрін тыңдау» батырмасын бассаң — сол жерден оқиды.",
    ru: "Нажмите на слово — увидите перевод. Выберите предложение и нажмите «Слушать всё» — чтение начнётся с него.",
    en: "Tap a word to see its translation. Pick a sentence and press Listen to all to start reading from there.",
    zh: "点击单词查看翻译。选中一句后点“全部收听”，即从该句开始朗读。",
    es: "Toca una palabra para ver su traducción. Elige una frase y pulsa Escuchar todo para leer desde ahí.",
    de: "Tippe auf ein Wort für die Übersetzung. Wähle einen Satz und drücke „Alles anhören“, um dort zu beginnen.",
    fr: "Touchez un mot pour sa traduction. Choisissez une phrase et appuyez sur Tout écouter pour lire à partir de là.",
    tr: "Çevirisi için bir kelimeye dokun. Bir cümle seçip Hepsini dinle’ye basarsan okuma oradan başlar.",
    ar: "اضغط على كلمة لترى ترجمتها. اختر جملة واضغط «استمع إلى الكل» لتبدأ القراءة منها.",
    ko: "단어를 누르면 번역이 나옵니다. 문장을 고르고 전체 듣기를 누르면 거기서부터 읽어 줍니다.",
    ja: "単語をタップすると訳が出ます。文を選んで「全部聞く」を押すと、そこから読み上げます。",
  },
  readAll: {
    kk: "Бәрін тыңдау", ru: "Слушать всё", en: "Listen to all", zh: "全部收听", es: "Escuchar todo", de: "Alles anhören",
    fr: "Tout écouter", tr: "Hepsini dinle", ar: "استمع إلى الكل", ko: "전체 듣기", ja: "全部聞く",
  },
  // Деңгей ауыстырғыш (бір оқиға — бірнеше деңгейде)
  level: {
    kk: "Мәтін деңгейі", ru: "Уровень текста", en: "Text level", zh: "文本难度", es: "Nivel del texto", de: "Textniveau",
    fr: "Niveau du texte", tr: "Metin seviyesi", ar: "مستوى النص", ko: "텍스트 수준", ja: "文章のレベル",
  },
  // Мәтіндегі сөз белгілері (сызықша түсі): апта сөзі · үйреніп жатырсың · меңгерілді
  legend: {
    kk: "Сөз белгілері", ru: "Обозначения слов", en: "Word marks", zh: "词汇标记", es: "Marcas de palabras", de: "Wortmarkierungen",
    fr: "Repères des mots", tr: "Kelime işaretleri", ar: "علامات الكلمات", ko: "단어 표시", ja: "単語の印",
  },
  week: {
    kk: "Апта сөзі", ru: "Слово недели", en: "Word of the week", zh: "本周词汇", es: "Palabra de la semana", de: "Wort der Woche",
    fr: "Mot de la semaine", tr: "Haftanın kelimesi", ar: "كلمة الأسبوع", ko: "이번 주 단어", ja: "今週の単語",
  },
  learning: {
    kk: "Үйреніп жатырсың", ru: "Изучаете", en: "Learning", zh: "正在学习", es: "Aprendiendo", de: "Am Lernen",
    fr: "En cours d’apprentissage", tr: "Öğreniyorsun", ar: "قيد التعلّم", ko: "학습 중", ja: "学習中",
  },
  mastered: {
    kk: "Меңгерілді", ru: "Выучено", en: "Mastered", zh: "已掌握", es: "Dominada", de: "Beherrscht",
    fr: "Maîtrisé", tr: "Öğrenildi", ar: "تمّ إتقانها", ko: "익힘", ja: "習得済み",
  },
  savedN: {
    kk: (n) => `${n} сақталған сөз осы мәтінде`,
    ru: (n) => `Сохранённых слов в этом тексте: ${n}`,
    en: (n) => `${n} saved ${n === 1 ? "word" : "words"} in this text`,
    zh: (n) => `本文中有 ${n} 个已保存的词`,
    es: (n) => `${n} ${n === 1 ? "palabra guardada" : "palabras guardadas"} en este texto`,
    de: (n) => `${n} ${n === 1 ? "gespeichertes Wort" : "gespeicherte Wörter"} in diesem Text`,
    fr: (n) => `${n} ${n > 1 ? "mots enregistrés" : "mot enregistré"} dans ce texte`,
    tr: (n) => `Bu metinde ${n} kayıtlı kelime`,
    ar: (n) => `الكلمات المحفوظة في هذا النص: ${n}`,
    ko: (n) => `이 글에 저장한 단어 ${n}개`,
    ja: (n) => `この文章に保存した単語：${n}語`,
  },
  // Дауыстап оқу жылдамдығы
  speed: {
    kk: "Оқу жылдамдығы", ru: "Скорость чтения", en: "Reading speed", zh: "朗读速度", es: "Velocidad de lectura", de: "Lesetempo",
    fr: "Vitesse de lecture", tr: "Okuma hızı", ar: "سرعة القراءة", ko: "읽기 속도", ja: "読み上げ速度",
  },
  loadErr: {
    kk: "Мәтін жүктелмеді. Қайта көріңіз.", ru: "Текст не загрузился. Попробуйте ещё раз.", en: "The text didn’t load. Please try again.",
    zh: "文本未能加载，请重试。", es: "No se pudo cargar el texto. Inténtalo de nuevo.", de: "Der Text wurde nicht geladen. Bitte versuche es erneut.",
    fr: "Le texte ne s’est pas chargé. Réessayez.", tr: "Metin yüklenmedi. Lütfen tekrar dene.", ar: "تعذّر تحميل النص. حاول مرة أخرى.",
    ko: "텍스트를 불러오지 못했습니다. 다시 시도해 주세요.", ja: "文章を読み込めませんでした。もう一度お試しください。",
  },
  // Кітапхана тақырыбының түсініктемесі (шығарма саны өзгерсе де дұрыс)
  sub: {
    kk: "Қазақ классикасы төрт деңгейде: деңгейіңді таңда, оқы, тыңда, сосын сұрақтарға жауап бер.",
    ru: "Казахская классика на четырёх уровнях: выберите свой уровень, читайте, слушайте и отвечайте на вопросы.",
    en: "Kazakh classics at four levels: pick your level, read, listen, then answer questions.",
    zh: "四个级别的哈萨克经典：选择你的级别，阅读、收听，然后回答问题。",
    es: "Clásicos kazajos en cuatro niveles: elige tu nivel, lee, escucha y responde a las preguntas.",
    de: "Kasachische Klassiker in vier Stufen: Wähle dein Niveau, lies, hör zu und beantworte die Fragen.",
    fr: "Classiques kazakhs en quatre niveaux : choisissez votre niveau, lisez, écoutez, puis répondez aux questions.",
    tr: "Dört seviyede Kazak klasikleri: seviyeni seç, oku, dinle, sonra soruları yanıtla.",
    ar: "روائع الأدب الكازاخي في أربعة مستويات: اختر مستواك، اقرأ واستمع، ثم أجب عن الأسئلة.",
    ko: "네 단계로 읽는 카자흐 고전: 수준을 고르고, 읽고 듣고, 질문에 답해 보세요.",
    ja: "4つのレベルで読むカザフの名作：レベルを選び、読んで聞いて、質問に答えましょう。",
  },
  // Деңгей сөрелері
  shelfA1: {
    kk: "Алғашқы қадам", ru: "Первые шаги", en: "First steps", zh: "起步", es: "Primeros pasos", de: "Erste Schritte",
    fr: "Premiers pas", tr: "İlk adımlar", ar: "الخطوات الأولى", ko: "첫걸음", ja: "はじめの一歩",
  },
  shelfA2: {
    kk: "Негізгі деңгей", ru: "Базовый уровень", en: "Elementary", zh: "初级", es: "Nivel básico", de: "Grundstufe",
    fr: "Niveau élémentaire", tr: "Temel seviye", ar: "المستوى الأساسي", ko: "기초", ja: "初級",
  },
  shelfB1: {
    kk: "Орта деңгей", ru: "Средний уровень", en: "Intermediate", zh: "中级", es: "Nivel intermedio", de: "Mittelstufe",
    fr: "Niveau intermédiaire", tr: "Orta seviye", ar: "المستوى المتوسط", ko: "중급", ja: "中級",
  },
  shelfB2: {
    kk: "Ортадан жоғары", ru: "Выше среднего", en: "Upper intermediate", zh: "中高级", es: "Intermedio alto", de: "Obere Mittelstufe",
    fr: "Intermédiaire avancé", tr: "Orta üstü", ar: "فوق المتوسط", ko: "중상급", ja: "中上級",
  },
};
export const LT = (lang) => new Proxy({}, { get: (_, k) => T[k]?.[lang] || T[k]?.en || "" });
