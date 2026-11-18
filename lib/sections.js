// Бөлім қолтаңбалары: әр бөлімнің өз реңі (tint), қою реңі (deep), ашық фоны (soft) және киіз белгісі (glyph).
// Бренд қызылы — жақтау түсі; бөлім реңі — тек екпін. Барлық tint ақ мәтінмен ≥ 4.5:1, deep/soft ≥ 6.4:1.
// Қабық (Shell) осы мәндерді --sec / --sec-deep / --sec-soft айнымалылары етіп <main data-section> ішіне береді.
export const SECTIONS = {
  home: { href: "/app", tint: "#B8322A", deep: "#8A2018", soft: "#F6E5DE", glyph: "shanyrak" }, // ошақ: қызыл + алтын
  course: { href: "/app/course", tint: "#3A7440", deep: "#24522B", soft: "#E7EDE1", glyph: "trail" }, // дала жасылы
  sozdik: { href: "/app/sozdik", tint: "#A62448", deep: "#7A1634", soft: "#F4E3E2", glyph: "chest" }, // рян қызылы
  games: { href: "/app/games", tint: "#B4510E", deep: "#873A06", soft: "#F6E8DB", glyph: "asyk" }, // ер-тұрман қызғылт сарысы
  chat: { href: "/app/qyran", tint: "#7A4A21", deep: "#583212", soft: "#EFE8DD", glyph: "feather" }, // қыран қоңыры
  vr: { href: "/app/vr", tint: "#5B3FA8", deep: "#432C80", soft: "#ECE7F3", glyph: "portal" }, // киіз үй есігі: түнгі күлгін
  tuzel: { href: "/app/tuzel", tint: "#1F4E8C", deep: "#153968", soft: "#E4E8EA", glyph: "nib" }, // сия көгі
  travel: { href: "/app/travel", tint: "#0B7A90", deep: "#075A6B", soft: "#E2EDEB", glyph: "compass" }, // көгілдір
  history: { href: "/app/history", tint: "#876519", deep: "#644A0E", soft: "#F1EBDC", glyph: "dome" }, // қола
  lit: { href: "/app/literature", tint: "#7A2E6E", deep: "#591F50", soft: "#EFE4E7", glyph: "book" }, // қара өрік
  saiys: { href: "/app/saiys", tint: "#96690A", deep: "#6F4D03", soft: "#F2EBDB", glyph: "pennant" }, // алтын
  class: { href: "/app/class", tint: "#8A2018", deep: "#66140E", soft: "#F1E2DC", glyph: "circle" }, // қою қызыл
  shop: { href: "/app/shop", tint: "#0F6E62", deep: "#0A5148", soft: "#E2ECE5", glyph: "bag" }, // базар жасыл-көгі
  profile: { href: "/app/profile", tint: "#3F3D9A", deep: "#2D2B75", soft: "#E8E6EC", glyph: "tumar" }, // индиго
  admin: { href: "/app/admin", tint: "#4A5160", deep: "#1F2430", soft: "#E9E8E5", glyph: "bars" },
};

// Қосымша беттер қай бөлімге жатады
const ALIAS = [
  ["/app/speaking", "tuzel"],
  ["/app/writing", "tuzel"],
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
  home: { kk: "Бүгінгі миссия · осыдан баста", ru: "Миссия дня · начни отсюда", en: "Today's mission · start here", zh: "今日任务 · 从这里开始", es: "Misión de hoy · empieza aquí", de: "Mission des Tages · hier starten", fr: "Mission du jour · commence ici", tr: "Günün görevi · buradan başla", ar: "مهمة اليوم · ابدأ من هنا", ko: "오늘의 미션 · 여기서 시작", ja: "今日のミッション · ここから" },
  course: { kk: "A1-ден B2-ге дейінгі сабақтар", ru: "Уроки от A1 до B2", en: "Lessons from A1 to B2", zh: "A1到B2的课程", es: "Lecciones de A1 a B2", de: "Lektionen von A1 bis B2", fr: "Leçons de A1 à B2", tr: "A1'den B2'ye dersler", ar: "دروس من A1 إلى B2", ko: "A1부터 B2까지 수업", ja: "A1からB2までのレッスン" },
  sozdik: { kk: "Күн сөздері мен өз сөздігің", ru: "Слова дня и твой словарь", en: "Daily words and your word bank", zh: "每日单词与生词本", es: "Palabras del día y tu vocabulario", de: "Tageswörter und dein Wortschatz", fr: "Mots du jour et ton lexique", tr: "Günün kelimeleri ve sözlüğün", ar: "كلمات اليوم وقاموسك", ko: "오늘의 단어와 단어장", ja: "今日の単語と単語帳" },
  tuzel: { kk: "Жазу мен айтылымды түзету", ru: "Исправление письма и речи", en: "Fix your writing and speaking", zh: "纠正写作与发音", es: "Corrige tu escritura y pronunciación", de: "Schreiben und Aussprache verbessern", fr: "Corriger l'écrit et la prononciation", tr: "Yazı ve telaffuzu düzelt", ar: "تصحيح الكتابة والنطق", ko: "글쓰기와 발음 교정", ja: "作文と発音の添削" },
  games: { kk: "Ұлттық ойындармен жаттығу", ru: "Практика в народных играх", en: "Practise with folk games", zh: "用民族游戏练习", es: "Practica con juegos tradicionales", de: "Üben mit Volksspielen", fr: "S'entraîner avec des jeux traditionnels", tr: "Geleneksel oyunlarla pratik", ar: "تدرّب بالألعاب الشعبية", ko: "전통 놀이로 연습", ja: "伝統遊びで練習" },
  chat: { kk: "Aqyl-мен сөйлесу, сұрақ қою", ru: "Разговор и вопросы с Aqyl", en: "Talk to Aqyl, ask anything", zh: "和Aqyl对话、提问", es: "Habla con Aqyl y pregunta", de: "Mit Aqyl sprechen und fragen", fr: "Parler avec Aqyl, poser des questions", tr: "Aqyl ile konuş, soru sor", ar: "تحدّث مع Aqyl واسأله", ko: "Aqyl과 대화하고 질문하기", ja: "Aqylと話して質問する" },
  vr: { kk: "Тірі көріністерде диалог", ru: "Диалоги в живых сценах", en: "Dialogues in living scenes", zh: "在生动场景中对话", es: "Diálogos en escenas vivas", de: "Dialoge in lebendigen Szenen", fr: "Dialogues dans des scènes vivantes", tr: "Canlı sahnelerde diyalog", ar: "حوارات في مشاهد حيّة", ko: "생생한 장면 속 대화", ja: "生きた場面で会話" },
  saiys: { kk: "Апталық жарыс пен рейтинг", ru: "Еженедельные состязания", en: "Weekly contests and ranking", zh: "每周比赛与排名", es: "Concursos semanales y ranking", de: "Wöchentliche Wettkämpfe", fr: "Concours de la semaine", tr: "Haftalık yarışma ve sıralama", ar: "مسابقات أسبوعية وترتيب", ko: "주간 대회와 순위", ja: "週間コンテストとランキング" },
  travel: { kk: "Өңірлер бойынша сөз үйрену", ru: "Слова по регионам страны", en: "Learn words region by region", zh: "按地区学单词", es: "Aprende palabras por regiones", de: "Wörter Region für Region", fr: "Des mots, région par région", tr: "Bölge bölge kelime öğren", ar: "تعلّم الكلمات منطقةً بمنطقة", ko: "지역별로 단어 배우기", ja: "地域ごとに単語を学ぶ" },
  history: { kk: "Ұлы дала тарихы мен қалалары", ru: "История и города Великой степи", en: "Great Steppe history and cities", zh: "大草原的历史与城市", es: "Historia y ciudades de la Gran Estepa", de: "Geschichte und Städte der Steppe", fr: "Histoire et villes de la Grande Steppe", tr: "Büyük Bozkır tarihi ve şehirleri", ar: "تاريخ السهوب الكبرى ومدنها", ko: "대초원의 역사와 도시", ja: "大草原の歴史と都市" },
  lit: { kk: "Жыр мен шығармаларды оқу", ru: "Чтение эпосов и классики", en: "Read epics and classics", zh: "阅读史诗与经典", es: "Lee epopeyas y clásicos", de: "Epen und Klassiker lesen", fr: "Lire épopées et classiques", tr: "Destan ve eserleri oku", ar: "اقرأ الملاحم والأعمال الكلاسيكية", ko: "서사시와 고전 읽기", ja: "叙事詩と名作を読む" },
  class: { kk: "Мұғалім берген тапсырмалар", ru: "Задания от учителя", en: "Tasks from your teacher", zh: "老师布置的任务", es: "Tareas de tu profesor", de: "Aufgaben deiner Lehrkraft", fr: "Devoirs de ton enseignant", tr: "Öğretmeninden görevler", ar: "مهام من معلّمك", ko: "선생님이 낸 과제", ja: "先生からの課題" },
  shop: { kk: "Тиынға ұлттық киім", ru: "Нацкостюмы за монеты", en: "Traditional outfits for coins", zh: "用金币换民族服饰", es: "Trajes tradicionales por monedas", de: "Trachten für Münzen", fr: "Tenues traditionnelles contre des pièces", tr: "Jetonla geleneksel kıyafet", ar: "أزياء تقليدية مقابل العملات", ko: "코인으로 전통 의상", ja: "コインで民族衣装" },
  profile: { kk: "Прогресс пен баптаулар", ru: "Прогресс и настройки", en: "Progress and settings", zh: "进度与设置", es: "Progreso y ajustes", de: "Fortschritt und Einstellungen", fr: "Progrès et réglages", tr: "İlerleme ve ayarlar", ar: "التقدّم والإعدادات", ko: "진도와 설정", ja: "進捗と設定" },
};
export const pickL = (m, lang) => (m ? m[lang] || m.en : "");
