// «Ақсүйек» квесінің деректері мен таза функциялары (React-сыз, сынақпен тексеріледі: aqsuiek.test.mjs).
// Ақсүйек — ай жарық түнде ойналатын қазақтың ұлттық ойыны: ақ сүйекті алысқа лақтырып, екі топ іздейді.
// Мәтіндер 11 тілде: kk ru en zh es de fr tr ar ko ja (жоқ болса — ағылшынша).

export const LANGS = ["kk", "ru", "en", "zh", "es", "de", "fr", "tr", "ar", "ko", "ja"];
export const pick = (arr, lang) => {
  const i = LANGS.indexOf(lang);
  return arr[i < 0 ? 2 : i];
};
const M = (...a) => a;

/* ═════ Интерфейс мәтіндері ═════ */
export const S = {
  night: M("{n}-түн", "Ночь {n}", "Night {n}", "第{n}夜", "Noche {n}", "Nacht {n}", "Nuit {n}", "{n}. gece", "الليلة {n}", "{n}번째 밤", "{n}夜目"),
  bones: M("Сүйектер", "Косточки", "Bones", "骨头", "Huesos", "Knochen", "Osselets", "Kemikler", "العظام", "뼈", "骨"),
  stars: M("Дұрыс", "Верно", "Correct", "答对", "Aciertos", "Richtig", "Justes", "Doğru", "صحيحة", "정답", "正解"),
  trail: M("Із көрсету", "Подсказать путь", "Show a trail", "显示线索", "Mostrar pista", "Spur zeigen", "Montrer une piste", "İz göster", "أظهر أثرًا", "흔적 보기", "手がかり"),
  explore: M(
    "Шырақпен даланы аралап, жасырынған сүйектерді тап. Сахнаны бас немесе ← ↑ → ↓ пернелерін қолдан.",
    "Пройдите по степи с фонарём и найдите спрятанные косточки. Нажимайте на сцену или используйте клавиши ← ↑ → ↓.",
    "Walk the steppe with your lantern and find the hidden bones. Tap the scene or use the ← ↑ → ↓ keys.",
    "提着灯笼在草原上走走，找出藏起来的骨头。点击画面或使用 ← ↑ → ↓ 键。",
    "Recorre la estepa con tu farol y encuentra los huesos escondidos. Toca la escena o usa las teclas ← ↑ → ↓.",
    "Geh mit deiner Laterne durch die Steppe und finde die versteckten Knochen. Tippe auf die Szene oder nutze die Tasten ← ↑ → ↓.",
    "Parcours la steppe avec ta lanterne et trouve les osselets cachés. Touche la scène ou utilise les touches ← ↑ → ↓.",
    "Fenerinle bozkırı dolaş ve saklı kemikleri bul. Sahneye dokun ya da ← ↑ → ↓ tuşlarını kullan.",
    "تجوّل في السهوب بفانوسك وابحث عن العظام المخبّأة. اضغط على المشهد أو استخدم المفاتيح ← ↑ → ↓.",
    "등불을 들고 초원을 돌아다니며 숨겨진 뼈를 찾으세요. 화면을 누르거나 ← ↑ → ↓ 키를 쓰세요.",
    "ランタンを持って草原を歩き、隠れた骨を探そう。画面をタップするか ← ↑ → ↓ キーを使おう。"
  ),
  whiteBone: M(
    "Барлық сөз табылды! Енді ақ сүйекті ізде — ол ай сәулесіндей жарқырайды.",
    "Все слова найдены! Теперь ищите белую кость — она светится, как лунный луч.",
    "All words found! Now look for the white bone — it shines like a moonbeam.",
    "所有的词都找到了！现在去找那根白骨——它像月光一样发亮。",
    "¡Has encontrado todas las palabras! Ahora busca el hueso blanco: brilla como un rayo de luna.",
    "Alle Wörter gefunden! Jetzt such den weißen Knochen – er leuchtet wie ein Mondstrahl.",
    "Tous les mots sont trouvés ! Cherche maintenant l'os blanc : il brille comme un rayon de lune.",
    "Bütün kelimeler bulundu! Şimdi beyaz kemiği ara; ay ışığı gibi parlıyor.",
    "وجدت كل الكلمات! ابحث الآن عن العظم الأبيض، فهو يلمع كشعاع القمر.",
    "단어를 모두 찾았어요! 이제 하얀 뼈를 찾으세요. 달빛처럼 빛나요.",
    "単語を全部見つけた！今度は白い骨を探そう。月の光のように輝いているよ。"
  ),
  found: M("Сүйек табылды!", "Косточка найдена!", "You found a bone!", "找到一块骨头！", "¡Encontraste un hueso!", "Knochen gefunden!", "Osselet trouvé !", "Bir kemik buldun!", "وجدت عظمة!", "뼈를 찾았어요!", "骨を見つけた！"),
  tMeaning: M("Мағынасын таңда", "Выберите значение", "Pick the meaning", "选出意思", "Elige el significado", "Wähle die Bedeutung", "Choisis le sens", "Anlamını seç", "اختر المعنى", "뜻을 고르세요", "意味を選ぼう"),
  tTranslate: M("Қазақшасын таңда", "Выберите слово по-казахски", "Pick the Kazakh word", "选出哈萨克语单词", "Elige la palabra en kazajo", "Wähle das kasachische Wort", "Choisis le mot kazakh", "Kazakça kelimeyi seç", "اختر الكلمة بالكازاخية", "카자흐어 단어를 고르세요", "カザフ語の単語を選ぼう"),
  tGap: M("Түсіп қалған әріпті қой", "Вставьте пропущенную букву", "Fill in the missing letter", "填上缺少的字母", "Completa la letra que falta", "Setze den fehlenden Buchstaben ein", "Complète la lettre manquante", "Eksik harfi yerleştir", "أكمل الحرف الناقص", "빠진 글자를 넣으세요", "抜けた文字を入れよう"),
  tBuild: M("Әріптерден сөз құра", "Соберите слово из букв", "Build the word from letters", "用字母拼出单词", "Forma la palabra con las letras", "Bilde das Wort aus Buchstaben", "Forme le mot avec les lettres", "Harflerden kelimeyi kur", "كوّن الكلمة من الحروف", "글자로 단어를 만드세요", "文字を並べて単語を作ろう"),
  riddle: M("Жұмбақ", "Загадка", "Riddle", "谜语", "Adivinanza", "Rätsel", "Devinette", "Bilmece", "لغز", "수수께끼", "なぞなぞ"),
  riddleAsk: M(
    "Жұмбақты шеш — сонда ақ сүйектің құпиясы ашылады.",
    "Отгадайте загадку — и белая кость откроет свою тайну.",
    "Solve the riddle and the white bone will share its secret.",
    "猜出谜语，白骨就会说出它的秘密。",
    "Resuelve la adivinanza y el hueso blanco te contará su secreto.",
    "Löse das Rätsel, dann verrät dir der weiße Knochen sein Geheimnis.",
    "Résous la devinette et l'os blanc te livrera son secret.",
    "Bilmeceyi çöz, beyaz kemik sırrını açsın.",
    "حُلّ اللغز وسيكشف لك العظم الأبيض سرّه.",
    "수수께끼를 풀면 하얀 뼈가 비밀을 알려 줘요.",
    "なぞなぞを解けば、白い骨が秘密を教えてくれる。"
  ),
  clue: M("Көмек", "Подсказка", "Hint", "提示", "Pista", "Tipp", "Indice", "İpucu", "تلميح", "힌트", "ヒント"),
  secret: M("Құпия мақал", "Тайная пословица", "The secret proverb", "秘密谚语", "El refrán secreto", "Das geheime Sprichwort", "Le proverbe secret", "Gizli atasözü", "المثل السرّي", "비밀 속담", "秘密のことわざ"),
  piece: M("Құпияның бір бөлігі ашылды", "Открыта часть тайны", "A piece of the secret is revealed", "秘密的一部分揭开了", "Se revela una parte del secreto", "Ein Teil des Geheimnisses ist enthüllt", "Une partie du secret est dévoilée", "Sırrın bir parçası açıldı", "انكشف جزء من السرّ", "비밀의 한 조각이 드러났어요", "秘密のかけらが現れた"),
  assemble: M(
    "Құпия бөліктерін дұрыс ретпен бас та, мақалды құрастыр.",
    "Нажимайте на части тайны по порядку и соберите пословицу.",
    "Tap the pieces of the secret in the right order to build the proverb.",
    "按正确顺序点击秘密的各个部分，拼出谚语。",
    "Toca las partes del secreto en el orden correcto para formar el refrán.",
    "Tippe die Teile des Geheimnisses in der richtigen Reihenfolge an und bilde das Sprichwort.",
    "Touche les morceaux du secret dans le bon ordre pour former le proverbe.",
    "Sırrın parçalarına doğru sırayla dokun ve atasözünü kur.",
    "اضغط على أجزاء السرّ بالترتيب الصحيح لتكوّن المثل.",
    "비밀 조각을 올바른 순서로 눌러 속담을 완성하세요.",
    "秘密のかけらを正しい順にタップして、ことわざを完成させよう。"
  ),
  meaning: M("Мағынасы", "Значение", "Meaning", "意思", "Significado", "Bedeutung", "Sens", "Anlamı", "المعنى", "뜻", "意味"),
  answer: M("Дұрысы", "Правильно так", "Correct answer", "正确答案", "Respuesta correcta", "Richtig ist", "Bonne réponse", "Doğrusu", "الصواب", "정답", "正解"),
  right: M("Дұрыс!", "Верно!", "Correct!", "答对了！", "¡Correcto!", "Richtig!", "Juste !", "Doğru!", "صحيح!", "정답!", "正解！"),
  wrong: M("Қате", "Ошибка", "Not quite", "不对", "No es correcto", "Nicht ganz", "Pas tout à fait", "Yanlış", "ليس تمامًا", "아쉬워요", "おしい"),
  next: M("Әрі қарай", "Дальше", "Continue", "继续", "Continuar", "Weiter", "Continuer", "Devam", "متابعة", "계속", "続ける"),
  nextNight: M("Келесі түнге", "В следующую ночь", "On to the next night", "前往下一夜", "A la noche siguiente", "Zur nächsten Nacht", "Vers la nuit suivante", "Sonraki geceye", "إلى الليلة التالية", "다음 밤으로", "次の夜へ"),
  toSecret: M("Құпияны ашу", "Открыть тайну", "Reveal the secret", "揭开秘密", "Revelar el secreto", "Geheimnis lüften", "Révéler le secret", "Sırrı aç", "اكشف السرّ", "비밀 열기", "秘密を明かす"),
  go: M("Ізде!", "Искать!", "Start searching", "开始寻找", "¡A buscar!", "Los, suchen!", "En route !", "Aramaya başla", "ابدأ البحث", "찾으러 가요", "探しに行こう"),
  check: M("Тексеру", "Проверить", "Check", "检查", "Comprobar", "Prüfen", "Vérifier", "Kontrol et", "تحقّق", "확인", "確認"),
  clear: M("Тазалау", "Сбросить", "Clear", "清空", "Borrar", "Leeren", "Effacer", "Temizle", "مسح", "지우기", "クリア"),
  finish: M("Квесті аяқтау", "Завершить квест", "Finish the quest", "完成任务", "Terminar la misión", "Quest abschließen", "Terminer la quête", "Görevi bitir", "أنهِ المغامرة", "퀘스트 완료", "クエストを終える"),
  scene: M("Түнгі дала", "Ночная степь", "The night steppe", "夜晚的草原", "La estepa de noche", "Die nächtliche Steppe", "La steppe la nuit", "Gece bozkırı", "السهوب ليلًا", "밤의 초원", "夜の草原"),
  lantern: M("Шырақ", "Фонарь", "Lantern", "灯笼", "Farol", "Laterne", "Lanterne", "Fener", "الفانوس", "등불", "ランタン"),
  up: M("Жоғары", "Вверх", "Up", "向上", "Arriba", "Hoch", "Haut", "Yukarı", "أعلى", "위", "上"),
  down: M("Төмен", "Вниз", "Down", "向下", "Abajo", "Runter", "Bas", "Aşağı", "أسفل", "아래", "下"),
  left: M("Солға", "Влево", "Left", "向左", "Izquierda", "Links", "Gauche", "Sol", "يسار", "왼쪽", "左"),
  right2: M("Оңға", "Вправо", "Right", "向右", "Derecha", "Rechts", "Droite", "Sağ", "يمين", "오른쪽", "右"),
  nights: M("4 түн · 4 жұмбақ · 1 құпия", "4 ночи · 4 загадки · 1 тайна", "4 nights · 4 riddles · 1 secret", "4个夜晚 · 4个谜语 · 1个秘密", "4 noches · 4 adivinanzas · 1 secreto", "4 Nächte · 4 Rätsel · 1 Geheimnis", "4 nuits · 4 devinettes · 1 secret", "4 gece · 4 bilmece · 1 sır", "4 ليالٍ · 4 ألغاز · سرّ واحد", "밤 4개 · 수수께끼 4개 · 비밀 1개", "4つの夜・4つのなぞなぞ・1つの秘密"),
  result: M("{a} / {b} дұрыс жауап", "{a} / {b} верных ответов", "{a} / {b} correct answers", "答对 {a} / {b}", "{a} / {b} respuestas correctas", "{a} / {b} richtige Antworten", "{a} / {b} bonnes réponses", "{a} / {b} doğru cevap", "{a} / {b} إجابات صحيحة", "정답 {a} / {b}", "正解 {a} / {b}"),
};

/* ═════ Төрт түн: көрініс, ай, сөз тақырыптары, сүйек жасыратын орындар (viewBox 400×250) ═════ */
export const NIGHTS = [
  {
    id: "aul", moon: 0.28, topics: ["family", "food", "greet"],
    name: M("Ауыл", "Аул", "The aul", "阿吾勒（村落）", "El aúl", "Der Aul", "L'aoul", "Köy (avıl)", "القرية (الأول)", "아울(마을)", "アウル（村）"),
    spots: [[48, 214], [118, 176], [176, 226], [236, 184], [300, 222], [352, 178], [86, 236], [266, 236], [208, 160]],
    start: [200, 200],
  },
  {
    id: "river", moon: 0.5, topics: ["nature", "colors"],
    name: M("Өзен жағасы", "Берег реки", "The riverbank", "河岸", "La orilla del río", "Am Flussufer", "Au bord de la rivière", "Nehir kıyısı", "ضفة النهر", "강가", "川辺"),
    spots: [[40, 176], [96, 226], [150, 172], [222, 230], [276, 170], [338, 222], [372, 172], [180, 204], [58, 236]],
    start: [226, 184],
  },
  {
    id: "jailau", moon: 0.75, topics: ["animals"],
    name: M("Жайлау", "Летнее пастбище", "The summer pasture", "夏季牧场", "El pasto de verano", "Die Sommerweide", "Le pâturage d'été", "Yayla", "المرعى الصيفي", "여름 목초지", "夏の牧草地"),
    spots: [[44, 200], [104, 168], [148, 230], [212, 176], [262, 224], [320, 168], [364, 214], [190, 236], [80, 236]],
    start: [200, 204],
  },
  {
    id: "tau", moon: 1, topics: ["travel", "numbers", "nature"],
    name: M("Тау етегі", "Предгорье", "The foothills", "山脚下", "Al pie de la montaña", "Am Fuß der Berge", "Au pied des montagnes", "Dağ eteği", "سفح الجبل", "산기슭", "山のふもと"),
    spots: [[36, 222], [92, 178], [146, 214], [206, 168], [254, 228], [312, 186], [366, 230], [176, 238], [336, 166]],
    start: [200, 210],
  },
];

/* ═════ Жұмбақтар (халықтық). opts: дұрыс жауап бірінші; ru/en — нұсқалардың аудармасы ═════ */
export const RIDDLES = [
  {
    id: "it",
    kk: "Отырса — бойы ұзын, тұрса — бойы қысқа.",
    opts: [{ kk: "Ит", ru: "Собака", en: "Dog" }, { kk: "Мысық", ru: "Кошка", en: "Cat" }, { kk: "Жылқы", ru: "Лошадь", en: "Horse" }, { kk: "Түйе", ru: "Верблюд", en: "Camel" }],
    tr: M(
      "Үйді күзетеді, бөтен адамды көрсе үреді.",
      "Сидит — ростом высок, стоит — ростом мал.",
      "When it sits, it is tall; when it stands, it is short.",
      "坐着个子高，站着个子矮。",
      "Sentado es alto, de pie es bajo.",
      "Im Sitzen ist er groß, im Stehen ist er klein.",
      "Assis, il est grand ; debout, il est petit.",
      "Otursa boyu uzun, kalksa boyu kısa.",
      "إذا جلس كان طويلًا، وإذا وقف كان قصيرًا.",
      "앉으면 키가 크고, 서면 키가 작다.",
      "座ると背が高く、立つと背が低い。"
    ),
  },
  {
    id: "agash",
    kk: "Жазда киінеді, қыста шешінеді.",
    opts: [{ kk: "Ағаш", ru: "Дерево", en: "Tree" }, { kk: "Адам", ru: "Человек", en: "Person" }, { kk: "Тау", ru: "Гора", en: "Mountain" }, { kk: "Қой", ru: "Овца", en: "Sheep" }],
    tr: M(
      "Жапырағы жазда жайқалып, күзде түсіп қалады.",
      "Летом одевается, зимой раздевается.",
      "In summer it gets dressed, in winter it undresses.",
      "夏天穿上衣服，冬天脱掉衣服。",
      "En verano se viste, en invierno se desviste.",
      "Im Sommer zieht er sich an, im Winter zieht er sich aus.",
      "L'été il s'habille, l'hiver il se déshabille.",
      "Yazın giyinir, kışın soyunur.",
      "في الصيف يلبس، وفي الشتاء يخلع ثيابه.",
      "여름에는 옷을 입고, 겨울에는 옷을 벗는다.",
      "夏に服を着て、冬に服を脱ぐ。"
    ),
  },
  {
    id: "jumyrtqa",
    kk: "Бір қазанда екі түрлі ас.",
    opts: [{ kk: "Жұмыртқа", ru: "Яйцо", en: "Egg" }, { kk: "Алма", ru: "Яблоко", en: "Apple" }, { kk: "Қарбыз", ru: "Арбуз", en: "Watermelon" }, { kk: "Нан", ru: "Хлеб", en: "Bread" }],
    tr: M(
      "Ішінде сарысы мен ағы бар, оны тауық береді.",
      "В одном котле — два разных кушанья.",
      "One cauldron holds two different foods.",
      "一口锅里装着两种饭。",
      "En un caldero, dos comidas distintas.",
      "In einem Kessel zwei verschiedene Speisen.",
      "Dans un seul chaudron, deux plats différents.",
      "Bir kazanda iki çeşit aş.",
      "في قِدرٍ واحد طعامان مختلفان.",
      "한 솥에 두 가지 음식.",
      "ひとつの鍋に二種類の料理。"
    ),
  },
  {
    id: "jel",
    kk: "Қолы жоқ, аяғы жоқ, есік ашады.",
    opts: [{ kk: "Жел", ru: "Ветер", en: "Wind" }, { kk: "Су", ru: "Вода", en: "Water" }, { kk: "Мысық", ru: "Кошка", en: "Cat" }, { kk: "Бала", ru: "Ребёнок", en: "Child" }],
    tr: M(
      "Оны көзбен көрмейсің, бірақ даладан соғып тұрады.",
      "Без рук, без ног, а дверь открывает.",
      "No hands, no feet, yet it opens the door.",
      "没有手，也没有脚，却能把门打开。",
      "Sin manos ni pies, abre la puerta.",
      "Ohne Hände, ohne Füße – und öffnet doch die Tür.",
      "Sans mains ni pieds, il ouvre la porte.",
      "Eli yok, ayağı yok, kapı açar.",
      "بلا يدين ولا قدمين، ومع ذلك يفتح الباب.",
      "손도 없고 발도 없는데 문을 연다.",
      "手も足もないのに、戸を開ける。"
    ),
  },
  {
    id: "jyl",
    kk: "Бір атаның он екі ұлы бар, әр ұлдың отыз баласы бар.",
    opts: [{ kk: "Жыл", ru: "Год", en: "Year" }, { kk: "Апта", ru: "Неделя", en: "Week" }, { kk: "Сағат", ru: "Час", en: "Hour" }, { kk: "Отбасы", ru: "Семья", en: "Family" }],
    tr: M(
      "Ұлдары — айлар, ал балалары — күндер.",
      "У одного отца двенадцать сыновей, у каждого сына тридцать детей.",
      "One father has twelve sons, and each son has thirty children.",
      "一位父亲有十二个儿子，每个儿子有三十个孩子。",
      "Un padre tiene doce hijos y cada hijo tiene treinta niños.",
      "Ein Vater hat zwölf Söhne, und jeder Sohn hat dreißig Kinder.",
      "Un père a douze fils, et chaque fils a trente enfants.",
      "Bir babanın on iki oğlu var, her oğlunun otuz çocuğu var.",
      "لأبٍ واحد اثنا عشر ابنًا، ولكل ابن ثلاثون طفلًا.",
      "한 아버지에게 아들이 열둘, 아들마다 자식이 서른.",
      "ひとりの父に十二人の息子、息子にはそれぞれ三十人の子。"
    ),
  },
];

/* ═════ Құпия мақалдар: әр түн бір бөлігін ашады (4 бөлік) ═════ */
export const PROVERBS = [
  {
    id: "oner",
    parts: ["Өнер", "алды —", "қызыл", "тіл."],
    mean: M(
      "Өнердің ең асылы — шешен, көркем сөз.",
      "Венец всех искусств — красноречие (досл.: «Начало искусства — красный язык»).",
      "The finest of all arts is eloquent speech (literally: “the first of arts is the red tongue”).",
      "百艺之首，是能言善辩的口才。",
      "El primero de los artes es la palabra elocuente.",
      "Die erste aller Künste ist die beredte Rede.",
      "Le premier des arts, c'est la parole éloquente.",
      "Hünerlerin başı güzel söz söylemektir.",
      "أسمى الفنون هو الكلام البليغ.",
      "모든 재주 가운데 으뜸은 말솜씨다.",
      "あらゆる芸の第一は、巧みな言葉である。"
    ),
  },
  {
    id: "birlik",
    parts: ["Бірлік", "бар", "жерде", "тірлік бар."],
    mean: M(
      "Ынтымақ бар жерде өмір де, береке де бар.",
      "Где единство, там и жизнь.",
      "Where there is unity, there is life.",
      "哪里有团结，哪里就有生活。",
      "Donde hay unidad, hay vida.",
      "Wo Einigkeit ist, da ist Leben.",
      "Là où il y a l'unité, il y a la vie.",
      "Birlik olan yerde dirlik olur.",
      "حيث توجد الوحدة توجد الحياة.",
      "단합이 있는 곳에 삶이 있다.",
      "団結のあるところに、暮らしがある。"
    ),
  },
  {
    id: "olshep",
    parts: ["Жеті рет", "өлшеп,", "бір рет", "кес."],
    mean: M(
      "Асықпа: әр ісіңді әбден ойлап барып істе.",
      "Семь раз отмерь — один раз отрежь.",
      "Measure seven times, cut once.",
      "量七次，裁一次（三思而后行）。",
      "Mide siete veces y corta una.",
      "Siebenmal messen, einmal schneiden.",
      "Mesure sept fois, coupe une fois.",
      "Yedi kere ölç, bir kere biç.",
      "قِس سبع مرات، واقطع مرة واحدة.",
      "일곱 번 재고 한 번 자르라.",
      "七度測って一度裁て。"
    ),
  },
  {
    id: "oqu",
    parts: ["Оқу —", "инемен", "құдық", "қазғандай."],
    mean: M(
      "Білім алу көп еңбек пен шыдамдылықты қажет етеді.",
      "Учиться — что иглой колодец копать.",
      "Learning is like digging a well with a needle.",
      "学习就像用针挖井。",
      "Aprender es como cavar un pozo con una aguja.",
      "Lernen ist wie mit einer Nadel einen Brunnen graben.",
      "Apprendre, c'est comme creuser un puits avec une aiguille.",
      "Okumak, iğneyle kuyu kazmak gibidir.",
      "التعلّم كحفر بئرٍ بإبرة.",
      "배움은 바늘로 우물을 파는 것과 같다.",
      "学ぶことは、針で井戸を掘るようなものだ。"
    ),
  },
];

/* ═════ Деңгейлер ═════ */
// bones — бір түндегі сөз сүйектері; r — шырақ шеңбері; trails — бір түндегі «із» саны
export const LEVELS = [
  { bones: 3, r: 66, trails: 3, shimmer: true, types: ["meaning", "translate", "gap"] },
  { bones: 4, r: 56, trails: 2, shimmer: true, types: ["meaning", "translate", "gap", "build"] },
  { bones: 5, r: 48, trails: 1, shimmer: false, types: ["translate", "gap", "build", "meaning", "build"] },
];
export const W = 400, H = 250, HORIZON = 150;

/* ═════ Таза көмекшілер ═════ */
export function shuffleWith(arr, rnd = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export const lower = (s) => s.toLocaleLowerCase("kk");
// Әріп тапсырмаларына жарамды сөз: бір сөз, тек кирилл әріптері, 3–8 әріп
export const isPlain = (kk) => /^[а-яёәөүұіқғңһ]{3,8}$/i.test(kk);

// Ұқсас естілетін / жазылатын әріптер (қазақ тіліне тән қиындықтар)
const CONF = [["а", "ә"], ["о", "ө"], ["у", "ү", "ұ"], ["ы", "і"], ["к", "қ"], ["г", "ғ"], ["н", "ң"], ["е", "ә"], ["с", "ш"], ["ж", "ш"], ["и", "і"], ["х", "һ", "қ"], ["б", "п"], ["д", "т"], ["з", "с"]];
const SPECIAL = new Set([..."әөүұіқғңһ"]);
const VOWELS = [..."аәеиоөуүұыіэюя"];
const CONS = [..."бвгғдежзйкқлмнңпрстфхһцчшщ"];

export function confusers(ch, rnd = Math.random) {
  const out = new Set();
  for (const g of CONF) if (g.includes(ch)) g.forEach((c) => c !== ch && out.add(c));
  const fill = VOWELS.includes(ch) ? VOWELS : CONS;
  for (const c of shuffleWith(fill, rnd)) {
    if (out.size >= 3) break;
    if (c !== ch) out.add(c);
  }
  return shuffleWith([...out], rnd).slice(0, 3);
}

// Сөз іріктеу: түннің тақырыбынан, қайталанбайтын, аудармасы бар сөздер
export function poolFor(words, topics) {
  const seen = new Set();
  const own = [], rest = [];
  for (const w of words) {
    const k = lower(w.kk);
    if (!w.kk || !w.en || seen.has(k)) continue;
    seen.add(k);
    (topics.includes(w.t) ? own : rest).push(w);
  }
  return { own, rest };
}

/*
 * Тапсырма жасау.
 *   word  — { kk, ru, en, ... }, pool — дистрактор үшін сөздер, trf(w) — аудармасы
 *   type  — meaning | translate | gap | build
 * Қайтарады: { type, word, prompt, sub, options?:[{key,label}], answer, letters? }
 */
export function makeTask(word, type, pool, trf, rnd = Math.random) {
  const plain = isPlain(word.kk);
  if ((type === "gap" || type === "build") && !plain) type = "meaning";
  const kk = word.kk;
  if (type === "meaning" || type === "translate") {
    const mine = trf(word);
    const others = [];
    const usedT = new Set([lower(mine)]), usedK = new Set([lower(kk)]);
    for (const w of shuffleWith(pool, rnd)) {
      if (others.length >= 3) break;
      const t = trf(w);
      if (!t || usedT.has(lower(t)) || usedK.has(lower(w.kk))) continue;
      usedT.add(lower(t));
      usedK.add(lower(w.kk));
      others.push(w);
    }
    const opts = shuffleWith([word, ...others], rnd);
    return type === "meaning"
      ? { type, word, prompt: kk, sub: null, options: opts.map((w) => ({ key: w.kk, label: trf(w) })), answer: kk }
      : { type, word, prompt: mine, sub: null, options: opts.map((w) => ({ key: w.kk, label: w.kk })), answer: kk };
  }
  const low = lower(kk);
  if (type === "gap") {
    // Жасырылатын әріп: алдымен қазаққа тән әріптер, бірінші әріп емес
    const idx = [...low].map((c, i) => i).filter((i) => i > 0);
    const special = idx.filter((i) => SPECIAL.has(low[i]) || CONF.some((g) => g.includes(low[i])));
    const from = special.length ? special : idx;
    const i = from[Math.floor(rnd() * from.length)];
    const ch = low[i];
    const options = shuffleWith([ch, ...confusers(ch, rnd)], rnd).map((c) => ({ key: c, label: c }));
    return { type, word, prompt: low.slice(0, i) + "_" + low.slice(i + 1), gapAt: i, sub: trf(word), options, answer: ch };
  }
  // build: араласқан әріптер (бастапқы ретпен бірдей болмауы керек)
  const chars = [...low];
  let mixed = shuffleWith(chars, rnd);
  for (let k = 0; k < 6 && mixed.join("") === low; k++) mixed = shuffleWith(chars, rnd);
  if (mixed.join("") === low) mixed = [...chars.slice(1), chars[0]];
  return { type: "build", word, prompt: trf(word), sub: null, letters: mixed.map((c, i) => ({ id: i, c })), answer: low };
}

// Түн жоспары: сүйек орындары, сөздер, тапсырма түрлері, ақ сүйектің орны
export function planNight(nightIdx, level, words, trf, rnd = Math.random, usedWords = new Set()) {
  const night = NIGHTS[nightIdx];
  const lv = LEVELS[level - 1] || LEVELS[0];
  const { own, rest } = poolFor(words, night.topics);
  const fresh = (arr) => arr.filter((w) => !usedWords.has(lower(w.kk)));
  // Әріп тапсырмалары үшін қарапайым сөздер керек
  const types = Array.from({ length: lv.bones }, (_, i) => lv.types[i % lv.types.length]);
  const chosen = [];
  const take = (pred) => {
    for (const src of [fresh(own), fresh(rest), own, rest]) {
      const c = shuffleWith(src.filter((w) => pred(w) && !chosen.includes(w)), rnd)[0];
      if (c) return c;
    }
    return null;
  };
  for (const ty of types) {
    const w = take((x) => (ty === "gap" || ty === "build" ? isPlain(x.kk) : true));
    if (w) chosen.push(w);
  }
  const all = [...own, ...rest];
  const spots = shuffleWith(night.spots, rnd);
  const bones = chosen.map((w, i) => ({
    id: i,
    x: spots[i][0],
    y: spots[i][1],
    task: makeTask(w, types[i], own.length >= 8 ? own : all, trf, rnd),
  }));
  const white = { x: spots[chosen.length][0], y: spots[chosen.length][1] };
  return { night, bones, white };
}

export const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
export const clampPos = ([x, y]) => [Math.max(14, Math.min(W - 14, x)), Math.max(HORIZON + 6, Math.min(H - 10, y))];
export const starsFor = (good, total) => (total <= 0 ? 3 : good / total >= 0.9 ? 3 : good / total >= 0.7 ? 2 : 1);
