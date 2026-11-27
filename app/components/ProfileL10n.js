// Профиль бетінің жергілікті мәтіндері — 11 тілде.
const D = {
  progT: { kk: "Оқу барысы", ru: "Мой прогресс", en: "My progress", zh: "我的进度", es: "Mi progreso", de: "Mein Fortschritt", fr: "Ma progression", tr: "İlerlemem", ar: "تقدّمي", ko: "나의 진도", ja: "学習の進み具合" },
  aboutT: { kk: "Мен туралы", ru: "Обо мне", en: "About me", zh: "关于我", es: "Sobre mí", de: "Über mich", fr: "À propos de moi", tr: "Hakkımda", ar: "عنّي", ko: "내 정보", ja: "わたしについて" },
  aqylT: { kk: "Менің Ақылым", ru: "Мой Aqyl", en: "My Aqyl", zh: "我的 Aqyl", es: "Mi Aqyl", de: "Mein Aqyl", fr: "Mon Aqyl", tr: "Aqyl’ım", ar: "Aqyl الخاص بي", ko: "나의 Aqyl", ja: "わたしのAqyl" },
  aqylS: {
    kk: "Жинаған тиыныңа Ақылға ұлттық киім ал.", ru: "Наряжайте Aqyl в национальную одежду за монеты.", en: "Dress Aqyl in traditional clothes for the coins you earn.",
    zh: "用赚到的金币给 Aqyl 换上民族服饰。", es: "Viste a Aqyl con trajes tradicionales usando tus monedas.", de: "Kleide Aqyl mit deinen Münzen in traditionelle Tracht.",
    fr: "Habille Aqyl en tenue traditionnelle avec tes pièces.", tr: "Kazandığın jetonlarla Aqyl’a geleneksel kıyafet al.", ar: "ألبِس Aqyl أزياءً تقليدية بالعملات التي تجمعها.",
    ko: "모은 코인으로 Aqyl에게 전통 의상을 입혀 보세요.", ja: "貯めたコインでAqylに民族衣装を着せよう。",
  },
  aqShop: { kk: "Дүкенде киіндіру", ru: "Одеть в магазине", en: "Dress up in the shop", zh: "去商店换装", es: "Vestir en la tienda", de: "Im Laden einkleiden", fr: "Habiller à la boutique", tr: "Mağazada giydir", ar: "ألبِسه في المتجر", ko: "상점에서 옷 입히기", ja: "ショップで着せ替え" },
  cefrGo: { kk: "Деңгейді анықтау", ru: "Узнать уровень", en: "Find your level", zh: "测一测水平", es: "Conoce tu nivel", de: "Niveau ermitteln", fr: "Trouver mon niveau", tr: "Seviyeni öğren", ar: "اعرف مستواك", ko: "레벨 알아보기", ja: "レベルを調べる" },
  explainNote: {
    kk: "Интерфейс те осы тілге ауысады.", ru: "Интерфейс тоже переключится на этот язык.", en: "The interface switches to this language too.",
    zh: "界面也会切换为该语言。", es: "La interfaz también cambia a este idioma.", de: "Die Oberfläche wechselt ebenfalls in diese Sprache.",
    fr: "L’interface passe aussi dans cette langue.", tr: "Arayüz de bu dile geçer.", ar: "ستتحوّل الواجهة أيضًا إلى هذه اللغة.",
    ko: "화면 언어도 이 언어로 바뀌어요.", ja: "画面の表示もこの言語に切り替わります。",
  },
  toNext: {
    kk: (n) => `Келесі деңгейге ${n} XP`, ru: (n) => `До следующего уровня ${n} XP`, en: (n) => `${n} XP to the next level`, zh: (n) => `距下一级还差 ${n} XP`,
    es: (n) => `${n} XP para el siguiente nivel`, de: (n) => `Noch ${n} XP bis zum nächsten Level`, fr: (n) => `${n} XP avant le niveau suivant`, tr: (n) => `Sonraki seviyeye ${n} XP`,
    ar: (n) => `${n} XP حتى المستوى التالي`, ko: (n) => `다음 레벨까지 ${n} XP`, ja: (n) => `次のレベルまで ${n} XP`,
  },
  role: { kk: "Рөлің", ru: "Ваша роль", en: "Your role", zh: "你的身份", es: "Tu rol", de: "Deine Rolle", fr: "Ton rôle", tr: "Rolün", ar: "دورك", ko: "역할", ja: "あなたの役割" },
  student: { kk: "Оқушы", ru: "Ученик", en: "Student", zh: "学生", es: "Estudiante", de: "Schüler", fr: "Élève", tr: "Öğrenci", ar: "طالب", ko: "학생", ja: "生徒" },
  studentD: {
    kk: "Сабақ оқып, ойын ойнап, сыныпқа кодпен қосыламын.", ru: "Учусь, играю и вступаю в класс по коду.", en: "I learn, play and join a class with a code.",
    zh: "我学习、玩游戏，并用代码加入班级。", es: "Aprendo, juego y me uno a una clase con un código.", de: "Ich lerne, spiele und trete einer Klasse per Code bei.",
    fr: "J’apprends, je joue et je rejoins une classe avec un code.", tr: "Öğrenirim, oynarım ve kodla sınıfa katılırım.", ar: "أتعلّم وألعب وأنضمّ إلى صف برمز.",
    ko: "배우고, 게임하고, 코드로 반에 참여해요.", ja: "学び、遊び、コードでクラスに参加します。",
  },
  teacher: { kk: "Мұғалім", ru: "Учитель", en: "Teacher", zh: "教师", es: "Profesor", de: "Lehrkraft", fr: "Enseignant", tr: "Öğretmen", ar: "معلّم", ko: "교사", ja: "先生" },
  teacherD: {
    kk: "Барлық функция бар + «Менің сыныбым»: сынып, тапсырма, белсенділік.", ru: "Все функции + «Мой класс»: классы, задания, активность.", en: "All features + “My class”: classes, tasks, activity.",
    zh: "全部功能 +「我的班级」：班级、任务、活跃度。", es: "Todas las funciones + «Mi clase»: clases, tareas, actividad.", de: "Alle Funktionen + „Meine Klasse“: Klassen, Aufgaben, Aktivität.",
    fr: "Toutes les fonctions + « Ma classe » : classes, devoirs, activité.", tr: "Tüm özellikler + “Sınıfım”: sınıflar, görevler, etkinlik.", ar: "كل المزايا + «صفّي»: الصفوف والمهام والنشاط.",
    ko: "모든 기능 + ‘내 반’: 반, 과제, 활동.", ja: "全機能＋「マイクラス」：クラス、課題、アクティビティ。",
  },
  join: {
    kk: "Сыныпқа қосылу (код бойынша)", ru: "Вступить в класс по коду", en: "Join a class with a code", zh: "用代码加入班级", es: "Unirme a una clase con código",
    de: "Klasse per Code beitreten", fr: "Rejoindre une classe avec un code", tr: "Kodla sınıfa katıl", ar: "انضمّ إلى صف برمز", ko: "코드로 반 참여하기", ja: "コードでクラスに参加",
  },
  uLessons: { kk: "сабақ", ru: "уроков", en: "lessons", zh: "课", es: "lecciones", de: "Lektionen", fr: "leçons", tr: "ders", ar: "دروس", ko: "레슨", ja: "レッスン" },
  uWords: { kk: "сөз", ru: "слов", en: "words", zh: "词", es: "palabras", de: "Wörter", fr: "mots", tr: "kelime", ar: "كلمات", ko: "단어", ja: "語" },
  uWins: { kk: "жеңіс", ru: "побед", en: "wins", zh: "胜", es: "victorias", de: "Siege", fr: "victoires", tr: "galibiyet", ar: "انتصارات", ko: "승", ja: "勝" },
  uStamps: { kk: "мөр", ru: "штампов", en: "stamps", zh: "印章", es: "sellos", de: "Stempel", fr: "tampons", tr: "damga", ar: "أختام", ko: "스탬프", ja: "スタンプ" },
  uPlaces: { kk: "орын", ru: "мест", en: "places", zh: "处古迹", es: "lugares", de: "Orte", fr: "lieux", tr: "yer", ar: "أماكن", ko: "유적", ja: "か所" },
  uWorks: { kk: "шығарма", ru: "произведений", en: "works", zh: "篇作品", es: "obras", de: "Werke", fr: "œuvres", tr: "eser", ar: "أعمال", ko: "작품", ja: "作品" },
  daysT: { kk: "Күн іздері", ru: "Следы дней", en: "Day traces", zh: "每日足迹", es: "Huellas de los días", de: "Spuren der Tage", fr: "Traces des jours", tr: "Gün izleri", ar: "آثار الأيام", ko: "하루의 발자취", ja: "日々の足あと" },
  activeDays: {
    kk: (n) => `Белсенді күн: ${n}`, ru: (n) => `Активных дней: ${n}`, en: (n) => `Active days: ${n}`, zh: (n) => `活跃天数：${n}`, es: (n) => `Días activos: ${n}`,
    de: (n) => `Aktive Tage: ${n}`, fr: (n) => `Jours actifs : ${n}`, tr: (n) => `Etkin gün: ${n}`, ar: (n) => `الأيام النشطة: ${n}`, ko: (n) => `활동한 날: ${n}`, ja: (n) => `アクティブな日：${n}`,
  },
  less: { kk: "Аз", ru: "Меньше", en: "Less", zh: "少", es: "Menos", de: "Weniger", fr: "Moins", tr: "Az", ar: "أقل", ko: "적음", ja: "少" },
  more: { kk: "Көп", ru: "Больше", en: "More", zh: "多", es: "Más", de: "Mehr", fr: "Plus", tr: "Çok", ar: "أكثر", ko: "많음", ja: "多" },
  ember: { kk: "Шоқ", ru: "Уголёк", en: "Ember", zh: "余烬", es: "Brasa", de: "Glut", fr: "Braise", tr: "Kor", ar: "جمرة", ko: "불씨", ja: "熾火" },
  emberTip: {
    kk: "Бір күн қалып қойсаң, шоқ ошақты сақтайды", ru: "Уголёк сохранит очаг, если пропустите один день", en: "An ember keeps the hearth alive if you miss one day",
    zh: "错过一天时，余烬能保住炉火", es: "Una brasa mantiene vivo el hogar si faltas un día", de: "Eine Glut hält das Feuer am Leben, wenn du einen Tag verpasst",
    fr: "Une braise garde le foyer allumé si tu manques un jour", tr: "Bir gün kaçırırsan kor ocağı canlı tutar", ar: "الجمرة تُبقي الموقد مشتعلًا إن فاتك يوم",
    ko: "하루를 놓쳐도 불씨가 화덕을 지켜 줘요", ja: "1日休んでも、熾火がかまどの火を守ります",
  },
  langs: { kk: "Тіл", ru: "Язык", en: "Language", zh: "语言", es: "Idioma", de: "Sprache", fr: "Langue", tr: "Dil", ar: "اللغة", ko: "언어", ja: "言語" },
  dangerNote: {
    kk: "Қайтарылмайды: XP, тиын, мөр, сөздер — бәрі өшеді.", ru: "Необратимо: XP, монеты, штампы и слова будут удалены.", en: "Cannot be undone: XP, coins, stamps and words are erased.",
    zh: "无法撤销：XP、金币、印章和单词都会被清除。", es: "No se puede deshacer: se borran XP, monedas, sellos y palabras.", de: "Nicht rückgängig zu machen: XP, Münzen, Stempel und Wörter werden gelöscht.",
    fr: "Irréversible : XP, pièces, tampons et mots sont effacés.", tr: "Geri alınamaz: XP, jetonlar, damgalar ve kelimeler silinir.", ar: "لا يمكن التراجع: تُمحى XP والعملات والأختام والكلمات.",
    ko: "되돌릴 수 없어요: XP, 코인, 스탬프, 단어가 모두 지워집니다.", ja: "元に戻せません：XP、コイン、スタンプ、単語がすべて消えます。",
  },
};

// P(lang)("key") → жол не функция; тіл табылмаса — ағылшынша
export const profileL10n = (lang) => (k) => D[k][lang] ?? D[k].en;
