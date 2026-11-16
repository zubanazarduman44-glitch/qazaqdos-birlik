// «Шежіре» (профиль) бетінің жергілікті мәтіндері — 11 тілде.
// kk / ru / en жолдары бұрынғы беттегі мәтінмен бірдей; қалған тілдер соның аудармасы.
const D = {
  kick: { kk: "Жеке бет", ru: "Личный кабинет", en: "My space", zh: "我的空间", es: "Mi espacio", de: "Mein Bereich", fr: "Mon espace", tr: "Kişisel sayfam", ar: "صفحتي", ko: "내 공간", ja: "マイページ" },
  sub: {
    kk: "Аватарың, ойын жетістіктерің және баптауларың осында.", ru: "Ваш аватар, достижения и настройки в одном месте.", en: "Your avatar, achievements and settings in one place.",
    zh: "头像、成就和设置都在这里。", es: "Tu avatar, tus logros y tus ajustes en un solo lugar.", de: "Dein Avatar, deine Erfolge und Einstellungen an einem Ort.",
    fr: "Ton avatar, tes réussites et tes réglages au même endroit.", tr: "Avatarın, başarıların ve ayarların tek yerde.", ar: "صورتك الرمزية وإنجازاتك وإعداداتك في مكان واحد.",
    ko: "아바타, 성과, 설정을 한곳에서.", ja: "アバター、実績、設定をひとつの場所で。",
  },
  heroCap: { kk: "Менің шежірем", ru: "Моя летопись", en: "My chronicle", zh: "我的成长谱", es: "Mi crónica", de: "Meine Chronik", fr: "Ma chronique", tr: "Şecerem", ar: "سجلّي", ko: "나의 연대기", ja: "わたしの年代記" },
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
  treeT: { kk: "Бәйтерегің", ru: "Ваш Байтерек", en: "Your Baiterek", zh: "你的生命树", es: "Tu Baiterek", de: "Dein Baiterek", fr: "Ton Baïterek", tr: "Bayterek’in", ar: "شجرة بايتيرك", ko: "나의 바이테렉", ja: "あなたのバイテレク" },
  treeS: {
    kk: "Әр бұтақ — бір дағды. Оқыған сайын жапырақ жаяды.", ru: "Каждая ветвь — навык. Чем больше учитесь, тем больше листьев.", en: "Each branch is a skill. The more you learn, the more leaves it grows.",
    zh: "每根树枝代表一项技能，学得越多，叶子越茂盛。", es: "Cada rama es una habilidad. Cuanto más aprendes, más hojas brotan.", de: "Jeder Ast ist eine Fähigkeit. Je mehr du lernst, desto mehr Blätter wachsen.",
    fr: "Chaque branche est une compétence. Plus tu apprends, plus elle se couvre de feuilles.", tr: "Her dal bir beceri. Öğrendikçe yaprak açar.", ar: "كل غصن مهارة. كلما تعلّمت أكثر نمت أوراقه.",
    ko: "가지 하나가 기술 하나예요. 배울수록 잎이 자라요.", ja: "枝ひとつがスキルひとつ。学ぶほど葉が茂ります。",
  },
  uLessons: { kk: "сабақ", ru: "уроков", en: "lessons", zh: "课", es: "lecciones", de: "Lektionen", fr: "leçons", tr: "ders", ar: "دروس", ko: "레슨", ja: "レッスン" },
  uWords: { kk: "сөз", ru: "слов", en: "words", zh: "词", es: "palabras", de: "Wörter", fr: "mots", tr: "kelime", ar: "كلمات", ko: "단어", ja: "語" },
  uWins: { kk: "жеңіс", ru: "побед", en: "wins", zh: "胜", es: "victorias", de: "Siege", fr: "victoires", tr: "galibiyet", ar: "انتصارات", ko: "승", ja: "勝" },
  uStamps: { kk: "мөр", ru: "штампов", en: "stamps", zh: "印章", es: "sellos", de: "Stempel", fr: "tampons", tr: "damga", ar: "أختام", ko: "스탬프", ja: "スタンプ" },
  uPlaces: { kk: "орын", ru: "мест", en: "places", zh: "处古迹", es: "lugares", de: "Orte", fr: "lieux", tr: "yer", ar: "أماكن", ko: "유적", ja: "か所" },
  uWorks: { kk: "шығарма", ru: "произведений", en: "works", zh: "篇作品", es: "obras", de: "Werke", fr: "œuvres", tr: "eser", ar: "أعمال", ko: "작품", ja: "作品" },
  savedWords: {
    kk: "Сақталған сөз", ru: "Сохранённые слова", en: "Saved words", zh: "已保存的词", es: "Palabras guardadas", de: "Gespeicherte Wörter",
    fr: "Mots enregistrés", tr: "Kaydedilen kelimeler", ar: "كلمات محفوظة", ko: "저장한 단어", ja: "保存した単語",
  },
  daysT: { kk: "Күн іздері", ru: "Следы дней", en: "Day traces", zh: "每日足迹", es: "Huellas de los días", de: "Spuren der Tage", fr: "Traces des jours", tr: "Gün izleri", ar: "آثار الأيام", ko: "하루의 발자취", ja: "日々の足あと" },
  daysS: {
    kk: "Соңғы 8 апта. Белгіленеді: өткен сабақ, оқылған шығарма, сақталған сөз, Sozdik күні.",
    ru: "Последние 8 недель. Отмечаются: пройденный урок, прочитанное произведение, сохранённое слово, день в Sozdik.",
    en: "Last 8 weeks. Marked: a finished lesson, a work you read, a saved word, a Sozdik day.",
    zh: "最近 8 周。记录：完成的课程、读过的作品、保存的单词、Sozdik 学习日。",
    es: "Últimas 8 semanas. Se marcan: lección terminada, obra leída, palabra guardada, día de Sozdik.",
    de: "Die letzten 8 Wochen. Markiert werden: abgeschlossene Lektion, gelesenes Werk, gespeichertes Wort, Sozdik-Tag.",
    fr: "8 dernières semaines. Sont marqués : leçon terminée, œuvre lue, mot enregistré, jour Sozdik.",
    tr: "Son 8 hafta. İşaretlenir: biten ders, okunan eser, kaydedilen kelime, Sozdik günü.",
    ar: "آخر 8 أسابيع. يُسجَّل: درس مكتمل، عمل مقروء، كلمة محفوظة، يوم Sozdik.",
    ko: "최근 8주. 표시: 끝낸 레슨, 읽은 작품, 저장한 단어, Sozdik 학습일.",
    ja: "直近8週間。記録対象：修了したレッスン、読んだ作品、保存した単語、Sozdikの日。",
  },
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
  look: { kk: "Келбет", ru: "Облик", en: "Look", zh: "形象", es: "Aspecto", de: "Aussehen", fr: "Apparence", tr: "Görünüm", ar: "المظهر", ko: "모습", ja: "見た目" },
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
