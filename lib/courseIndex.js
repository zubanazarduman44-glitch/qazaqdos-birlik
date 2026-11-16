// ⚠ ЖАСАЛҒАН ФАЙЛ — қолмен өзгертпе. Көзі: lib/course.js + lib/words.js; жасаушы: node --no-warnings scripts/gen-course-index.mjs
// Курстың жеңіл индексі: сабақ id-лері, тақырып атаулары, деңгей құрылымы — сөз массивтерінсіз (~110 KB үнемдейді).
// Тек тізім/санақ/атау керек беттерге (сынып, профиль, басты бет «Төр»). Сабақ мазмұны (words/phrases) — lib/course.js-те.

export const LEVELS = [{"id":"A1","units":["greet","family","numbers","colors","food","animals","home","body","clothes","time"]},{"id":"A2","units":["school","city","verbs","adj","weather","nature","jobs","transport","health","shop","direction","travel"]},{"id":"B1","units":["feelings","hobby","tradition","tech","society","eco","work","hist"]},{"id":"B2","units":["media","economy","science","art","edu","law","mind","idiom"]}];

// Тақырып атаулары (11 тілде) мен эмодзи — lib/words.js TOPICS-тен
export const TOPICS = {
  "greet": {"kk":"Сәлемдесу","ru":"Приветствия","en":"Greetings","e":"👋","zh":"问候","es":"Saludos","de":"Begrüßungen","fr":"Salutations","tr":"Selamlaşma","ar":"التحيات","ko":"인사","ja":"あいさつ"},
  "family": {"kk":"Отбасы","ru":"Семья","en":"Family","e":"👨‍👩‍👧","zh":"家庭","es":"Familia","de":"Familie","fr":"Famille","tr":"Aile","ar":"العائلة","ko":"가족","ja":"家族"},
  "numbers": {"kk":"Сандар","ru":"Числа","en":"Numbers","e":"🔢","zh":"数字","es":"Números","de":"Zahlen","fr":"Nombres","tr":"Sayılar","ar":"الأرقام","ko":"숫자","ja":"数字"},
  "colors": {"kk":"Түстер","ru":"Цвета","en":"Colours","e":"🎨","zh":"颜色","es":"Colores","de":"Farben","fr":"Couleurs","tr":"Renkler","ar":"الألوان","ko":"색깔","ja":"色"},
  "food": {"kk":"Тағам","ru":"Еда","en":"Food","e":"🍞","zh":"食物","es":"Comida","de":"Essen","fr":"Nourriture","tr":"Yemek","ar":"الطعام","ko":"음식","ja":"食べ物"},
  "animals": {"kk":"Жануарлар","ru":"Животные","en":"Animals","e":"🐎","zh":"动物","es":"Animales","de":"Tiere","fr":"Animaux","tr":"Hayvanlar","ar":"الحيوانات","ko":"동물","ja":"動物"},
  "home": {"kk":"Үй","ru":"Дом","en":"Home","e":"🏠","zh":"家居","es":"Casa","de":"Zuhause","fr":"Maison","tr":"Ev","ar":"البيت","ko":"집","ja":"家"},
  "body": {"kk":"Дене мүшелері","ru":"Тело","en":"Body","e":"🧍","zh":"身体","es":"Cuerpo","de":"Körper","fr":"Corps","tr":"Vücut","ar":"الجسم","ko":"몸","ja":"からだ"},
  "clothes": {"kk":"Киім","ru":"Одежда","en":"Clothes","e":"👕","zh":"衣服","es":"Ropa","de":"Kleidung","fr":"Vêtements","tr":"Giysiler","ar":"الملابس","ko":"옷","ja":"服"},
  "time": {"kk":"Уақыт","ru":"Время","en":"Time","e":"⏰","zh":"时间","es":"Tiempo","de":"Zeit","fr":"Temps","tr":"Zaman","ar":"الوقت","ko":"시간","ja":"時間"},
  "school": {"kk":"Мектеп","ru":"Школа","en":"School","e":"🏫","zh":"学校","es":"Escuela","de":"Schule","fr":"École","tr":"Okul","ar":"المدرسة","ko":"학교","ja":"学校"},
  "city": {"kk":"Қала","ru":"Город","en":"City","e":"🏙️","zh":"城市","es":"Ciudad","de":"Stadt","fr":"Ville","tr":"Şehir","ar":"المدينة","ko":"도시","ja":"街"},
  "verbs": {"kk":"Етістіктер","ru":"Глаголы","en":"Verbs","e":"🏃","zh":"动词","es":"Verbos","de":"Verben","fr":"Verbes","tr":"Fiiller","ar":"الأفعال","ko":"동사","ja":"動詞"},
  "adj": {"kk":"Сын есімдер","ru":"Прилагательные","en":"Adjectives","e":"🎯","zh":"形容词","es":"Adjetivos","de":"Adjektive","fr":"Adjectifs","tr":"Sıfatlar","ar":"الصفات","ko":"형용사","ja":"形容詞"},
  "weather": {"kk":"Ауа райы","ru":"Погода","en":"Weather","e":"⛅","zh":"天气","es":"El tiempo","de":"Wetter","fr":"Météo","tr":"Hava durumu","ar":"الطقس","ko":"날씨","ja":"天気"},
  "nature": {"kk":"Табиғат","ru":"Природа","en":"Nature","e":"⛰️","zh":"自然","es":"Naturaleza","de":"Natur","fr":"Nature","tr":"Doğa","ar":"الطبيعة","ko":"자연","ja":"自然"},
  "jobs": {"kk":"Мамандықтар","ru":"Профессии","en":"Jobs","e":"👷","zh":"职业","es":"Profesiones","de":"Berufe","fr":"Métiers","tr":"Meslekler","ar":"المهن","ko":"직업","ja":"職業"},
  "transport": {"kk":"Көлік","ru":"Транспорт","en":"Transport","e":"🚌","zh":"交通","es":"Transporte","de":"Verkehr","fr":"Transports","tr":"Ulaşım","ar":"المواصلات","ko":"교통","ja":"乗り物"},
  "health": {"kk":"Денсаулық","ru":"Здоровье","en":"Health","e":"🩺","zh":"健康","es":"Salud","de":"Gesundheit","fr":"Santé","tr":"Sağlık","ar":"الصحة","ko":"건강","ja":"健康"},
  "shop": {"kk":"Сауда","ru":"Покупки","en":"Shopping","e":"🛒","zh":"购物","es":"Compras","de":"Einkaufen","fr":"Achats","tr":"Alışveriş","ar":"التسوق","ko":"쇼핑","ja":"買い物"},
  "direction": {"kk":"Бағыт","ru":"Направления","en":"Directions","e":"🧭","zh":"方向","es":"Direcciones","de":"Richtungen","fr":"Directions","tr":"Yön tarifi","ar":"الاتجاهات","ko":"방향","ja":"道案内"},
  "travel": {"kk":"Саяхат","ru":"Путешествие","en":"Travel","e":"✈️","zh":"旅行","es":"Viajes","de":"Reisen","fr":"Voyage","tr":"Seyahat","ar":"السفر","ko":"여행","ja":"旅行"},
  "feelings": {"kk":"Сезім","ru":"Чувства","en":"Feelings","e":"😊","zh":"情感","es":"Sentimientos","de":"Gefühle","fr":"Sentiments","tr":"Duygular","ar":"المشاعر","ko":"감정","ja":"気持ち"},
  "hobby": {"kk":"Хобби","ru":"Хобби","en":"Hobbies","e":"🎨","zh":"爱好","es":"Aficiones","de":"Hobbys","fr":"Loisirs","tr":"Hobiler","ar":"الهوايات","ko":"취미","ja":"趣味"},
  "tradition": {"kk":"Салт-дәстүр","ru":"Традиции","en":"Traditions","e":"🪕","zh":"传统","es":"Tradiciones","de":"Bräuche","fr":"Traditions","tr":"Gelenekler","ar":"التقاليد","ko":"전통","ja":"伝統"},
  "tech": {"kk":"Технология","ru":"Технологии","en":"Technology","e":"💻","zh":"科技","es":"Tecnología","de":"Technik","fr":"Technologie","tr":"Teknoloji","ar":"التكنولوجيا","ko":"기술","ja":"テクノロジー"},
  "society": {"kk":"Қоғам","ru":"Общество","en":"Society","e":"🏛️","zh":"社会","es":"Sociedad","de":"Gesellschaft","fr":"Société","tr":"Toplum","ar":"المجتمع","ko":"사회","ja":"社会"},
  "eco": {"kk":"Экология","ru":"Экология","en":"Ecology","e":"🌍","zh":"生态","es":"Ecología","de":"Umwelt","fr":"Écologie","tr":"Ekoloji","ar":"البيئة","ko":"환경","ja":"環境"},
  "work": {"kk":"Жұмыс","ru":"Работа","en":"Work","e":"💼","zh":"工作","es":"Trabajo","de":"Arbeit","fr":"Travail","tr":"İş","ar":"العمل","ko":"일","ja":"仕事"},
  "hist": {"kk":"Тарих","ru":"История","en":"History","e":"🏺","zh":"历史","es":"Historia","de":"Geschichte","fr":"Histoire","tr":"Tarih","ar":"التاريخ","ko":"역사","ja":"歴史"},
  "media": {"kk":"Бұқаралық ақпарат","ru":"СМИ","en":"Media","e":"📰","zh":"媒体","es":"Medios","de":"Medien","fr":"Médias","tr":"Medya","ar":"الإعلام","ko":"미디어","ja":"メディア"},
  "economy": {"kk":"Экономика мен қаржы","ru":"Экономика и финансы","en":"Economy & finance","e":"📈","zh":"经济与金融","es":"Economía y finanzas","de":"Wirtschaft & Finanzen","fr":"Économie et finances","tr":"Ekonomi ve finans","ar":"الاقتصاد والمال","ko":"경제와 금융","ja":"経済と金融"},
  "science": {"kk":"Ғылым мен зерттеу","ru":"Наука и исследования","en":"Science & research","e":"🔬","zh":"科学与研究","es":"Ciencia e investigación","de":"Wissenschaft & Forschung","fr":"Science et recherche","tr":"Bilim ve araştırma","ar":"العلم والبحث","ko":"과학과 연구","ja":"科学と研究"},
  "art": {"kk":"Өнер мен мәдениет","ru":"Искусство и культура","en":"Arts & culture","e":"🎭","zh":"艺术与文化","es":"Arte y cultura","de":"Kunst & Kultur","fr":"Arts et culture","tr":"Sanat ve kültür","ar":"الفن والثقافة","ko":"예술과 문화","ja":"芸術と文化"},
  "edu": {"kk":"Жоғары білім","ru":"Высшее образование","en":"Higher education","e":"🎓","zh":"高等教育","es":"Educación superior","de":"Hochschule","fr":"Études supérieures","tr":"Yükseköğretim","ar":"التعليم العالي","ko":"고등 교육","ja":"高等教育"},
  "law": {"kk":"Құқық және азамат","ru":"Право и гражданство","en":"Law & citizenship","e":"⚖️","zh":"法律与公民","es":"Derecho y ciudadanía","de":"Recht & Bürgerschaft","fr":"Droit et citoyenneté","tr":"Hukuk ve vatandaşlık","ar":"القانون والمواطنة","ko":"법과 시민","ja":"法と市民"},
  "mind": {"kk":"Мінез бен сана","ru":"Характер и психика","en":"Mind & character","e":"🧠","zh":"心理与性格","es":"Mente y carácter","de":"Psyche & Charakter","fr":"Esprit et caractère","tr":"Zihin ve karakter","ar":"العقل والشخصية","ko":"마음과 성격","ja":"心と性格"},
  "idiom": {"kk":"Фразеологизмдер","ru":"Идиомы и пословицы","en":"Idioms & proverbs","e":"🗝️","zh":"成语与谚语","es":"Modismos y refranes","de":"Redewendungen & Sprichwörter","fr":"Expressions et proverbes","tr":"Deyimler ve atasözleri","ar":"التعابير والأمثال","ko":"관용구와 속담","ja":"慣用句とことわざ"},
};

// тақырып → [сөз сабақтарының саны, сөйлем сабағы (1/0)]
const SHAPE = {"greet":[5,1],"family":[6,1],"numbers":[7,1],"colors":[4,1],"food":[10,1],"animals":[10,1],"home":[8,1],"body":[8,1],"clothes":[7,1],"time":[8,1],"school":[7,1],"city":[5,1],"verbs":[11,1],"adj":[10,1],"weather":[5,1],"nature":[8,1],"jobs":[8,1],"transport":[5,1],"health":[6,1],"shop":[5,1],"direction":[7,1],"travel":[7,1],"feelings":[6,1],"hobby":[6,1],"tradition":[8,1],"tech":[7,1],"society":[7,1],"eco":[6,1],"work":[7,1],"hist":[8,1],"media":[4,1],"economy":[4,1],"science":[4,1],"art":[4,1],"edu":[4,1],"law":[4,1],"mind":[4,1],"idiom":[4,1]};

export const UNITS = Object.fromEntries(
  LEVELS.flatMap((l) => l.units).map((t) => {
    const [w, p] = SHAPE[t];
    const lessons = Array.from({ length: w }, (_, i) => ({ id: `${t}-w${i + 1}`, kind: "words", topic: t }));
    if (p) lessons.push({ id: `${t}-p`, kind: "phrases", topic: t });
    return [t, { topic: t, meta: TOPICS[t], lessons }];
  })
);
export const ALL_LESSONS = Object.values(UNITS).flatMap((u) => u.lessons);
export const lessonById = (id) => ALL_LESSONS.find((l) => l.id === id);
export const lessonTitle = (l, lang) => {
  const m = TOPICS[l.topic];
  const n = (m && (m[lang] || m.en || m.kk)) || l.topic;
  const idx = UNITS[l.topic].lessons.findIndex((x) => x.id === l.id) + 1;
  return `${n} · ${idx}`;
};
export const levelStats = (lv, done) => {
  const ls = lv.units.flatMap((u) => UNITS[u].lessons);
  return { total: ls.length, done: ls.filter((l) => done?.[l.id]).length };
};
export const levelOfTopic = (topic) => LEVELS.find((v) => v.units.includes(topic));
// Келесі өтілмеген сабақ (done — state.course.done)
export const nextLesson = (done) => ALL_LESSONS.find((l) => !done?.[l.id]);
