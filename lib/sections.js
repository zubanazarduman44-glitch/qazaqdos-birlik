// Бөлім қолтаңбалары: әр бөлімнің өз реңі (tint), қою реңі (deep), ашық фоны (soft) және киіз белгісі (glyph).
// Әр бөлім түс шеңберінде өз орнында тұрады — мәзір топтарының ішінде көршілер бір-біріне ұқсамайды.
// tint — ақ мәтінмен ≥ 4.9:1 (түйме, белсенді мәзір), deep — soft фонда ≥ 6.9:1 (тақырып, белгі, чип мәтіні),
// soft — сол реңнің өте ашық түрі (тақырып жолағы, белгі тақтайшасы). Қате/дұрыс түстері (шарап/жасыл) бөлек.
// Қабық (Shell) осы мәндерді --sec / --sec-deep / --sec-soft айнымалылары етіп <main data-section> ішіне береді.
export const SECTIONS = {
  home: { href: "/app", tint: "#A3242B", deep: "#741820", soft: "#F8E3E4", glyph: "shanyrak" }, // ошақ: бренд қызылы
  course: { href: "/app/course", tint: "#2C7A48", deep: "#1D5532", soft: "#E1F1E6", glyph: "trail" }, // дала жасылы
  sozdik: { href: "/app/sozdik", tint: "#3A4FB0", deep: "#283784", soft: "#E7EAFA", glyph: "chest" }, // сия көгі (индиго)
  games: { href: "/app/games", tint: "#B4510E", deep: "#833A08", soft: "#FCEADB", glyph: "asyk" }, // асық сарғылт-қызылы
  chat: { href: "/app/qyran", tint: "#1D6FA3", deep: "#134E75", soft: "#E0EFF9", glyph: "feather" }, // қыран аспаны
  vr: { href: "/app/vr", tint: "#6B3FB0", deep: "#4C2A82", soft: "#EFE7FA", glyph: "portal" }, // түнгі күлгін
  tuzel: { href: "/app/qyran?mode=write", tint: "#1F4E8C", deep: "#153968", soft: "#E2EAF5", glyph: "nib" }, // сия көгі; мәзірде жоқ — Aqyl чатының жазу режимі (басты беттегі тақтайша)
  travel: { href: "/app/travel", tint: "#0B7A86", deep: "#075860", soft: "#DDF2F2", glyph: "compass" }, // көл көгілдірі
  history: { href: "/app/history", tint: "#7F5426", deep: "#5C3A17", soft: "#F5EADD", glyph: "dome" }, // қола-қоңыр
  lit: { href: "/app/literature", tint: "#82306F", deep: "#5E2150", soft: "#F7E5F1", glyph: "book" }, // қара өрік
  saiys: { href: "/app/saiys", tint: "#93690A", deep: "#6B4C03", soft: "#FBF0D4", glyph: "pennant" }, // алтын
  class: { href: "/app/class", tint: "#A12A5E", deep: "#741C43", soft: "#F9E3EC", glyph: "circle" }, // таңқурай
  shop: { href: "/app/shop", tint: "#0E7560", deep: "#09523F", soft: "#DCF2EA", glyph: "bag" }, // базар жасыл-көгі
  profile: { href: "/app/profile", tint: "#4A5672", deep: "#323C53", soft: "#E7EBF2", glyph: "tumar" }, // тақта сұры
  admin: { href: "/app/admin", tint: "#4A5160", deep: "#1F2430", soft: "#ECEBE7", glyph: "bars" },
};

// Қосымша беттер қай бөлімге жатады
const ALIAS = [
  ["/app/speaking", "chat"],
  ["/app/writing", "chat"],
  ["/app/tuzel", "chat"],
  ["/app/vision", "chat"],
  ["/app/level", "home"],
];

export function sectionOf(path) {
  const p = path || "/app";
  for (const [pre, key] of ALIAS) if (p.startsWith(pre)) return key;
  let best = "home";
  let len = 0;
  for (const [key, s] of Object.entries(SECTIONS)) {
    if (s.href !== "/app" && p.startsWith(s.href) && s.href.length > len) {
      best = key;
      len = s.href.length;
    }
  }
  return best;
}

// style={{...secVars("course")}} — бөлім айнымалылары; prefix="it" болса --it / --it-deep / --it-soft
export function secVars(key, prefix = "sec") {
  const s = SECTIONS[key] || SECTIONS.home;
  return { [`--${prefix}`]: s.tint, [`--${prefix}-deep`]: s.deep, [`--${prefix}-soft`]: s.soft };
}

// Мәзір мәтіндері (11 тіл): басты бет «Бүгін» деп аталады, әр бөлімнің бір жолдық мақсаты бар.
export const TODAY_LABEL = { kk: "Бүгін", ru: "Сегодня", en: "Today", zh: "今天", es: "Hoy", de: "Heute", fr: "Aujourd'hui", tr: "Bugün", ar: "اليوم", ko: "오늘", ja: "今日" };
export const SECTION_HINT = {
  home: { kk: "Сабақ, серия және күннің сөзі", ru: "Уроки, серия и слово дня", en: "Lessons, streak and word of the day", zh: "课程、连续学习和每日一词", es: "Lecciones, racha y palabra del día", de: "Lektionen, Serie und Wort des Tages", fr: "Leçons, série et mot du jour", tr: "Dersler, seri ve günün kelimesi", ar: "الدروس والسلسلة وكلمة اليوم", ko: "수업, 연속 기록, 오늘의 단어", ja: "レッスン・連続記録・今日の単語" },
  course: { kk: "A1-ден B2-ге дейінгі сабақтар", ru: "Уроки от A1 до B2", en: "Lessons from A1 to B2", zh: "A1到B2的课程", es: "Lecciones de A1 a B2", de: "Lektionen von A1 bis B2", fr: "Leçons de A1 à B2", tr: "A1'den B2'ye dersler", ar: "دروس من A1 إلى B2", ko: "A1부터 B2까지 수업", ja: "A1からB2までのレッスン" },
  sozdik: { kk: "Күн сөздері мен өз сөздігің", ru: "Слова дня и твой словарь", en: "Daily words and your word bank", zh: "每日单词与生词本", es: "Palabras del día y tu vocabulario", de: "Tageswörter und dein Wortschatz", fr: "Mots du jour et ton lexique", tr: "Günün kelimeleri ve sözlüğün", ar: "كلمات اليوم وقاموسك", ko: "오늘의 단어와 단어장", ja: "今日の単語と単語帳" },
  tuzel: { kk: "Жазу мен айтылымды түзету", ru: "Исправление письма и речи", en: "Fix your writing and speaking", zh: "纠正写作与发音", es: "Corrige tu escritura y pronunciación", de: "Schreiben und Aussprache verbessern", fr: "Corriger l'écrit et la prononciation", tr: "Yazı ve telaffuzu düzelt", ar: "تصحيح الكتابة والنطق", ko: "글쓰기와 발음 교정", ja: "作文と発音の添削" },
  games: { kk: "Ұлттық ойындармен жаттығу", ru: "Практика в народных играх", en: "Practise with folk games", zh: "用民族游戏练习", es: "Practica con juegos tradicionales", de: "Üben mit Volksspielen", fr: "S'entraîner avec des jeux traditionnels", tr: "Geleneksel oyunlarla pratik", ar: "تدرّب بالألعاب الشعبية", ko: "전통 놀이로 연습", ja: "伝統遊びで練習" },
  chat: { kk: "Сөйлесу, жазу мен айтылымды тексеру", ru: "Разговор, проверка письма и произношения", en: "Chat, writing and pronunciation checks", zh: "对话、写作与发音检查", es: "Conversación, escritura y pronunciación", de: "Gespräch, Schreib- und Aussprachecheck", fr: "Discussion, écrit et prononciation", tr: "Sohbet, yazı ve telaffuz kontrolü", ar: "محادثة وتصحيح الكتابة والنطق", ko: "대화, 글쓰기·발음 확인", ja: "会話・作文と発音のチェック" },
  vr: { kk: "Тірі көріністерде диалог", ru: "Диалоги в живых сценах", en: "Dialogues in living scenes", zh: "在生动场景中对话", es: "Diálogos en escenas vivas", de: "Dialoge in lebendigen Szenen", fr: "Dialogues dans des scènes vivantes", tr: "Canlı sahnelerde diyalog", ar: "حوارات في مشاهد حيّة", ko: "생생한 장면 속 대화", ja: "生きた場面で会話" },
  saiys: { kk: "Апталық жарыс пен рейтинг", ru: "Еженедельные состязания", en: "Weekly contests and ranking", zh: "每周比赛与排名", es: "Concursos semanales y ranking", de: "Wöchentliche Wettkämpfe", fr: "Concours de la semaine", tr: "Haftalık yarışma ve sıralama", ar: "مسابقات أسبوعية وترتيب", ko: "주간 대회와 순위", ja: "週間コンテストとランキング" },
  travel: { kk: "Өңірлер бойынша сөз үйрену", ru: "Слова по регионам страны", en: "Learn words region by region", zh: "按地区学单词", es: "Aprende palabras por regiones", de: "Wörter Region für Region", fr: "Des mots, région par région", tr: "Bölge bölge kelime öğren", ar: "تعلّم الكلمات منطقةً بمنطقة", ko: "지역별로 단어 배우기", ja: "地域ごとに単語を学ぶ" },
  history: { kk: "Ұлы дала тарихы мен қалалары", ru: "История и города Великой степи", en: "Great Steppe history and cities", zh: "大草原的历史与城市", es: "Historia y ciudades de la Gran Estepa", de: "Geschichte und Städte der Steppe", fr: "Histoire et villes de la Grande Steppe", tr: "Büyük Bozkır tarihi ve şehirleri", ar: "تاريخ السهوب الكبرى ومدنها", ko: "대초원의 역사와 도시", ja: "大草原の歴史と都市" },
  lit: { kk: "Деңгейіңе сай көркем шығармалар", ru: "Классика по уровням", en: "Classics by level", zh: "按级别阅读经典", es: "Clásicos por niveles", de: "Klassiker nach Niveau", fr: "Classiques par niveau", tr: "Seviyene göre klasikler", ar: "أعمال كلاسيكية حسب مستواك", ko: "수준별 고전 읽기", ja: "レベル別に名作を読む" },
  class: { kk: "Мұғалім берген тапсырмалар", ru: "Задания от учителя", en: "Tasks from your teacher", zh: "老师布置的任务", es: "Tareas de tu profesor", de: "Aufgaben deiner Lehrkraft", fr: "Devoirs de ton enseignant", tr: "Öğretmeninden görevler", ar: "مهام من معلّمك", ko: "선생님이 낸 과제", ja: "先生からの課題" },
  shop: { kk: "Тиынға ұлттық киім", ru: "Нацкостюмы за монеты", en: "Traditional outfits for coins", zh: "用金币换民族服饰", es: "Trajes tradicionales por monedas", de: "Trachten für Münzen", fr: "Tenues traditionnelles contre des pièces", tr: "Jetonla geleneksel kıyafet", ar: "أزياء تقليدية مقابل العملات", ko: "코인으로 전통 의상", ja: "コインで民族衣装" },
  profile: { kk: "Прогресс пен баптаулар", ru: "Прогресс и настройки", en: "Progress and settings", zh: "进度与设置", es: "Progreso y ajustes", de: "Fortschritt und Einstellungen", fr: "Progrès et réglages", tr: "İlerleme ve ayarlar", ar: "التقدّم والإعدادات", ko: "진도와 설정", ja: "進捗と設定" },
};
export const pickL = (m, lang) => (m ? m[lang] || m.en : "");
