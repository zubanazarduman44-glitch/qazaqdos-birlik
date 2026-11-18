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
  listen: {
    kk: "Сөйлемді тыңдау", ru: "Прослушать предложение", en: "Listen to the sentence", zh: "收听句子", es: "Escuchar la frase", de: "Satz anhören",
    fr: "Écouter la phrase", tr: "Cümleyi dinle", ar: "استمع إلى الجملة", ko: "문장 듣기", ja: "文を聞く",
  },
  trOne: {
    kk: "Сөйлем аудармасы", ru: "Перевод предложения", en: "Translate sentence", zh: "翻译句子", es: "Traducir la frase", de: "Satz übersetzen",
    fr: "Traduire la phrase", tr: "Cümleyi çevir", ar: "ترجمة الجملة", ko: "문장 번역", ja: "文を訳す",
  },
  readAll: {
    kk: "Бәрін тыңдау", ru: "Слушать всё", en: "Listen to all", zh: "全部收听", es: "Escuchar todo", de: "Alles anhören",
    fr: "Tout écouter", tr: "Hepsini dinle", ar: "استمع إلى الكل", ko: "전체 듣기", ja: "全部聞く",
  },
  episode: {
    kk: "Эпизод", ru: "Эпизод", en: "Episode", zh: "片段", es: "Episodio", de: "Episode",
    fr: "Épisode", tr: "Bölüm", ar: "مقطع", ko: "에피소드", ja: "場面",
  },
};
export const LT = (lang) => new Proxy({}, { get: (_, k) => T[k]?.[lang] || T[k]?.en || "" });
