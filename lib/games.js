// Ұлттық ойындар тізімі
const L = (kk, ru, en) => ({ kk, ru, en });
// 11 тілдегі мәтін (L(obj, lang) керек тілді өзі таңдайды, жоқ болса ағылшыншаға түседі)
const M = (kk, ru, en, zh, es, de, fr, tr, ar, ko, ja) => ({ kk, ru, en, zh, es, de, fr, tr, ar, ko, ja });

export const GAMES = [
  {
    id: "baige", e: "🐎", color: "#E0A526",
    name: L("Бәйге", "Байге", "Baige"),
    desc: L("Ат жарысы: дұрыс жауап берген сайын атың алға шабады.", "Скачки: каждый верный ответ продвигает вашего коня.", "Horse race: every correct answer pushes your horse ahead."),
    how: L("Сөздің аудармасын тез тап. Қарсыластар күтпейді!", "Быстро выбирайте перевод. Соперники не ждут!", "Pick the translation fast. Rivals won't wait!"),
  },
  {
    id: "arkan", e: "🪢", color: "#A63A2B",
    name: L("Арқан тартыс", "Перетягивание каната", "Tug of war"),
    desc: L("Әр дұрыс жауап арқанды өзіңе қарай тартады.", "Каждый верный ответ тянет канат к вам.", "Each correct answer pulls the rope your way."),
    how: L("Арқанды өз жағыңдағы белгіге дейін тарт.", "Перетяните канат до своей отметки.", "Pull the rope all the way to your mark."),
  },
  {
    id: "asyk", e: "🦴", color: "#7A4A22",
    name: L("Асық ату", "Асык ату", "Asyk atu"),
    desc: L("Сұраққа жауап бер де, дәл көздеп асықты құлат.", "Ответьте на вопрос и метко выбейте асык.", "Answer the question, then aim and knock the asyk down."),
    how: L("Күш жолағы жасыл аймаққа келгенде «Ату» бас.", "Нажмите «Бросок», когда шкала в зелёной зоне.", "Hit \"Throw\" when the power bar is in the green zone."),
  },
  {
    id: "tenge", e: "🪙", color: "#1E8A8A",
    name: L("Теңге ілу", "Тенге илу", "Tenge ilu"),
    desc: L("Шауып келе жатып, дұрыс сөзі бар теңгені іліп ал.", "На скаку подхватите монету с нужным словом.", "At full gallop, grab the coin with the right word."),
    how: L("Атты ← → пернелерімен немесе батырмалармен жүргіз.", "Управляйте конём стрелками ← → или кнопками.", "Steer the horse with ← → keys or the buttons."),
  },
  {
    id: "bestas", e: "🪨", color: "#0F5E7A",
    name: L("Бес тас", "Бес тас", "Bes tas"),
    desc: L("Бес жұп тасты тап: қазақша сөз және оның мағынасы.", "Найдите пять пар камней: слово и его значение.", "Find five pairs of stones: a word and its meaning."),
    how: L("Екі тасты аш. Жұбы сәйкес келсе, ашық қалады.", "Открывайте по два камня. Совпавшие пары остаются.", "Flip two stones. Matching pairs stay open."),
  },
  {
    id: "kokpar", e: "🐐", color: "#2F6B4F",
    name: L("Көкпар", "Кокпар", "Kokpar"),
    desc: L("Ат үстіндегі көкпар: дұрыс жауап серкені қарсыластың қақпасына жеткізеді.", "Конная игра: верные ответы несут козла к воротам соперника.", "Horseback game: correct answers carry the goat to the rival's goal."),
    how: L("Жауап беруге: оңай — 8, орташа — 5, қиын — 3 секунд. Қажетті голдарды бірінші соққан жеңеді!", "Время на ответ: легко — 8, средне — 5, сложно — 3 секунды. Побеждает тот, кто первым забьёт нужные голы!", "Time to answer: easy 8, medium 5, hard 3 seconds. First to score the goals wins!"),
  },
  // ── Тіл шеберханасы: қазақ тілінің нақты қиындықтарына арналған үш ойын (мәтіндері 11 тілде) ──
  {
    id: "jalgau", e: "🧵", color: "#B8322A",
    tag: M("Грамматика", "Грамматика", "Grammar", "语法", "Gramática", "Grammatik", "Grammaire", "Dil bilgisi", "القواعد", "문법", "文法"),
    name: M("Жалғау", "Жалгау: окончания", "Jalgau: endings", "Jalgau · 词尾", "Jalgau: sufijos", "Jalgau: Endungen", "Jalgau : suffixes", "Jalgau: ekler", "جالغاو: اللواحق", "잘가우: 어미", "ジャルガウ：語尾"),
    desc: M(
      "Кесте тігу: сөзге дұрыс жалғауды алтын жіппен тігіп жалға. Буын және дыбыс үндестігін үйретеді.",
      "Вышивка: пришейте к слову верное окончание золотой нитью. Тренирует гармонию гласных и согласных.",
      "Embroidery: stitch the right ending onto the word with gold thread. Trains vowel harmony and consonant assimilation.",
      "刺绣：用金线把正确的词尾缝到单词上，练习元音和谐与辅音同化。",
      "Bordado: cose la terminación correcta a la palabra con hilo dorado. Practica la armonía vocálica y la asimilación de consonantes.",
      "Stickerei: Nähe die richtige Endung mit goldenem Faden an das Wort. Trainiert Vokalharmonie und Konsonantenangleichung.",
      "Broderie : couds la bonne terminaison au mot avec un fil d'or. Entraîne l'harmonie vocalique et l'assimilation des consonnes.",
      "Nakış: doğru eki altın iplikle kelimeye dik. Ünlü uyumunu ve ünsüz benzeşmesini çalıştırır.",
      "تطريز: خِط اللاحقة الصحيحة على الكلمة بخيط ذهبي. تدريب على التوافق الصوتي وتماثل الصوامت.",
      "자수: 금실로 단어에 알맞은 어미를 꿰매세요. 모음조화와 자음 동화를 익힙니다.",
      "刺繍：金の糸で単語に正しい語尾を縫い付けよう。母音調和と子音同化を練習します。"
    ),
    how: M(
      "Сөздің соңғы дауыстысы мен соңғы дыбысына қарап, жалғаудың дұрыс нұсқасын таңда.",
      "Смотрите на последнюю гласную и последний звук слова и выбирайте верный вариант окончания.",
      "Look at the word's last vowel and final sound, then pick the right variant of the ending.",
      "看单词的最后一个元音和最后一个音，选出正确的词尾形式。",
      "Fíjate en la última vocal y el último sonido de la palabra y elige la variante correcta.",
      "Achte auf den letzten Vokal und den letzten Laut des Wortes und wähle die richtige Variante.",
      "Regarde la dernière voyelle et le dernier son du mot, puis choisis la bonne variante.",
      "Kelimenin son ünlüsüne ve son sesine bak, ekin doğru biçimini seç.",
      "انظر إلى آخر صائت وآخر صوت في الكلمة ثم اختر الصيغة الصحيحة للاحقة.",
      "단어의 마지막 모음과 끝소리를 보고 알맞은 어미 형태를 고르세요.",
      "単語の最後の母音と最後の音を見て、正しい語尾の形を選ぼう。"
    ),
  },
  {
    id: "keruen", e: "🐪", color: "#B4571F",
    tag: M("Сөз тәртібі", "Порядок слов", "Word order", "语序", "Orden de palabras", "Wortstellung", "Ordre des mots", "Söz dizimi", "ترتيب الكلمات", "어순", "語順"),
    name: M("Керуен", "Керуен: караван", "Keruen: caravan", "Keruen · 驼队", "Keruen: caravana", "Keruen: Karawane", "Keruen : caravane", "Keruen: kervan", "كيروين: القافلة", "케루엔: 대상", "ケルエン：隊商"),
    desc: M(
      "Әр сөз — түйеге артылған тең. Сөздерді дұрыс ретпен тізсең, керуен далада алға жылжиды.",
      "Каждое слово — тюк на верблюде. Расставьте слова в верном порядке, и караван пойдёт по степи.",
      "Each word is a load on a camel. Put the words in the right order and the caravan moves across the steppe.",
      "每个词都是骆驼背上的货物。把词按正确顺序排好，驼队就会穿过草原。",
      "Cada palabra es una carga sobre un camello. Ordena las palabras y la caravana avanzará por la estepa.",
      "Jedes Wort ist eine Last auf einem Kamel. Bringe die Wörter in die richtige Reihenfolge, und die Karawane zieht durch die Steppe.",
      "Chaque mot est un chargement sur un chameau. Mets les mots dans le bon ordre et la caravane avance dans la steppe.",
      "Her kelime bir devenin yüküdür. Kelimeleri doğru sıraya diz, kervan bozkırda ilerlesin.",
      "كل كلمة حِمل على جمل. رتّب الكلمات ترتيبًا صحيحًا فتسير القافلة عبر السهوب.",
      "단어 하나하나가 낙타에 실린 짐입니다. 단어를 올바른 순서로 놓으면 대상이 초원을 건너갑니다.",
      "単語はラクダの荷物。正しい順に並べると、隊商が草原を進みます。"
    ),
    how: M(
      "Аудармасына қарап, сөздерді басып сөйлем құра. Есіңде болсын: баяндауыш соңында тұрады.",
      "По переводу соберите предложение, нажимая на слова. Помните: сказуемое стоит в конце.",
      "Read the translation and tap the words to build the sentence. Remember: the predicate comes last.",
      "看译文，点击词语组成句子。记住：谓语放在句末。",
      "Lee la traducción y toca las palabras para formar la frase. Recuerda: el predicado va al final.",
      "Lies die Übersetzung und tippe die Wörter an, um den Satz zu bilden. Merke: Das Prädikat steht am Ende.",
      "Lis la traduction et touche les mots pour former la phrase. Rappel : le prédicat vient à la fin.",
      "Çeviriye bak ve kelimelere dokunarak cümleyi kur. Unutma: yüklem sonda gelir.",
      "اقرأ الترجمة واضغط على الكلمات لتكوين الجملة. تذكّر: المسند يأتي في آخر الجملة.",
      "번역을 보고 단어를 눌러 문장을 만드세요. 서술어는 문장 끝에 옵니다.",
      "訳を見て、単語をタップして文を作ろう。述語は文末に来ます。"
    ),
  },
  {
    id: "tynda", e: "🪕", color: "#5B4B9A",
    tag: M("Тыңдалым", "Аудирование", "Listening", "听力", "Escucha", "Hören", "Écoute", "Dinleme", "الاستماع", "듣기", "聞き取り"),
    name: M("Тыңда", "Тында: на слух", "Tynda: listen", "Tynda · 听辨", "Tynda: escucha", "Tynda: Hör zu", "Tynda : écoute", "Tynda: dinle", "تيندا: استمع", "튼다: 듣기", "トゥンダ：聞き取り"),
    desc: M(
      "Таудағы жаңғырық: сөзді тыңда да, ұқсас естілетін сөздердің ішінен дәл сол сөзді тап.",
      "Эхо в горах: послушайте слово и найдите именно его среди похожих по звучанию.",
      "Echo in the mountains: listen to a word and find exactly that word among similar-sounding ones.",
      "山中回声：听一个词，在发音相近的词中找出它。",
      "Eco en las montañas: escucha una palabra y encuéntrala entre otras que suenan parecido.",
      "Echo in den Bergen: Höre ein Wort und finde genau dieses unter ähnlich klingenden Wörtern.",
      "Écho dans les montagnes : écoute un mot et retrouve-le parmi des mots qui lui ressemblent.",
      "Dağlarda yankı: kelimeyi dinle ve benzer sesli kelimeler arasından tam onu bul.",
      "صدى في الجبال: استمع إلى الكلمة ثم اعثر عليها بين كلمات متشابهة في النطق.",
      "산속의 메아리: 단어를 듣고 비슷하게 들리는 단어들 가운데서 바로 그 단어를 찾으세요.",
      "山のこだま：単語を聞いて、よく似た響きの単語の中からその単語を見つけよう。"
    ),
    how: M(
      "ә–а, ө–о, ү–ұ, і–ы, қ–к, ғ–г, ң–н дыбыстарын ажырат. Қайта тыңдауға және баяу тыңдауға болады.",
      "Различайте звуки ә–а, ө–о, ү–ұ, і–ы, қ–к, ғ–г, ң–н. Можно прослушать ещё раз и медленно.",
      "Tell apart ә–а, ө–о, ү–ұ, і–ы, қ–к, ғ–г, ң–н. You can replay the word and hear it slowly.",
      "分辨 ә–а、ө–о、ү–ұ、і–ы、қ–к、ғ–г、ң–н 这些音。可以重听，也可以慢速听。",
      "Distingue ә–а, ө–о, ү–ұ, і–ы, қ–к, ғ–г, ң–н. Puedes repetir la palabra y oírla despacio.",
      "Unterscheide ә–а, ө–о, ү–ұ, і–ы, қ–к, ғ–г, ң–н. Du kannst das Wort wiederholen und langsam hören.",
      "Distingue ә–а, ө–о, ү–ұ, і–ы, қ–к, ғ–г, ң–н. Tu peux réécouter le mot et l'entendre lentement.",
      "ә–а, ө–о, ү–ұ, і–ы, қ–к, ғ–г, ң–н seslerini ayırt et. Kelimeyi tekrar ve yavaş dinleyebilirsin.",
      "ميّز بين الأصوات ә–а، ө–о، ү–ұ، і–ы، қ–к، ғ–г، ң–н. يمكنك إعادة الاستماع والاستماع ببطء.",
      "ә–а, ө–о, ү–ұ, і–ы, қ–к, ғ–г, ң–н 소리를 구별하세요. 다시 듣기와 천천히 듣기가 가능합니다.",
      "ә–а、ө–о、ү–ұ、і–ы、қ–к、ғ–г、ң–н の音を聞き分けよう。もう一度聞くことも、ゆっくり聞くこともできます。"
    ),
  },
];

// Санды қазақша жазу (0–199)
const ONES = ["", "бір", "екі", "үш", "төрт", "бес", "алты", "жеті", "сегіз", "тоғыз"];
const TENS = ["", "он", "жиырма", "отыз", "қырық", "елу", "алпыс", "жетпіс", "сексен", "тоқсан"];
export function kazNumber(n) {
  if (n === 0) return "нөл";
  const parts = [];
  if (n >= 100) {
    parts.push(n >= 200 ? `${ONES[Math.floor(n / 100)]} жүз` : "жүз");
    n %= 100;
  }
  if (n >= 10) {
    parts.push(TENS[Math.floor(n / 10)]);
    n %= 10;
  }
  if (n) parts.push(ONES[n]);
  return parts.join(" ");
}
