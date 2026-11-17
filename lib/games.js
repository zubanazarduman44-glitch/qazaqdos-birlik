// Ұлттық ойындар тізімі
const L = (kk, ru, en) => ({ kk, ru, en });
// 11 тілдегі мәтін (L(obj, lang) керек тілді өзі таңдайды, жоқ болса ағылшыншаға түседі)
const M = (kk, ru, en, zh, es, de, fr, tr, ar, ko, ja) => ({ kk, ru, en, zh, es, de, fr, tr, ar, ko, ja });

export const GAMES = [
  // ── Ақсүйек: ай жарық түндегі үлкен квест (тізімде бірінші, кең «featured» карточка; мәтіндері 11 тілде) ──
  {
    id: "aqsuiek", e: "🦴", color: "#2B4C7E", featured: true,
    tag: M("Квест", "Квест", "Quest", "探险任务", "Misión", "Quest", "Quête", "Görev", "مغامرة", "퀘스트", "クエスト"),
    name: M("Ақсүйек", "Ақсүйек: ночной квест", "Aq Suiek Quest", "白骨 · Aq Suiek 夜间探险", "Aq Suiek: misión nocturna", "Aq Suiek: Nacht-Quest", "Aq Suiek : quête nocturne", "Aq Suiek: gece görevi", "آق سويك: مغامرة ليلية", "악수이옉: 밤의 퀘스트", "アクスイェク：夜のクエスト"),
    desc: M(
      "Ақсүйек — ай жарық түнде ойналатын ұлттық ойын. Шырақпен далада жасырынған сөз сүйектерін тап, тапсырмаларды орында, жұмбақ шешіп, төрт түннің құпия мақалын аш.",
      "Ақсүйек — народная игра лунной ночью. С фонарём ищите в степи спрятанные косточки-слова, выполняйте задания, отгадывайте загадки и откройте тайную пословицу четырёх ночей.",
      "Aq suiek is a Kazakh folk game played on moonlit nights. Search the steppe with a lantern for hidden word bones, solve tasks and riddles, and uncover the secret proverb of four nights.",
      "Aq suiek（白骨）是在月夜里玩的哈萨克民间游戏。提着灯笼在草原上寻找藏起来的单词骨头，完成任务、猜出谜语，揭开四个夜晚的秘密谚语。",
      "Aq suiek es un juego tradicional kazajo de las noches de luna. Busca con un farol los huesos-palabra escondidos en la estepa, resuelve tareas y adivinanzas y descubre el refrán secreto de cuatro noches.",
      "Aq suiek ist ein kasachisches Volksspiel für Mondnächte. Suche mit der Laterne versteckte Wortknochen in der Steppe, löse Aufgaben und Rätsel und lüfte das geheime Sprichwort aus vier Nächten.",
      "Aq suiek est un jeu traditionnel kazakh des nuits de lune. Cherche avec ta lanterne les osselets-mots cachés dans la steppe, résous tâches et devinettes, et découvre le proverbe secret de quatre nuits.",
      "Aq suiek, mehtaplı gecelerde oynanan bir Kazak halk oyunudur. Fenerle bozkırda saklı kelime kemiklerini ara, görevleri ve bilmeceleri çöz, dört gecenin gizli atasözünü ortaya çıkar.",
      "«آق سويك» لعبة كازاخية شعبية تُلعب في الليالي المقمرة. ابحث بالفانوس عن عظام الكلمات المخبّأة في السهوب، وحُلّ المهام والألغاز، واكشف المثل السرّي لأربع ليالٍ.",
      "악수이옉은 달 밝은 밤에 하는 카자흐 전통 놀이예요. 등불을 들고 초원에 숨은 단어 뼈를 찾고, 과제와 수수께끼를 풀어 네 밤의 비밀 속담을 밝혀내세요.",
      "アクスイェクは月夜に遊ぶカザフの伝統遊び。ランタンで草原に隠れた単語の骨を探し、課題となぞなぞを解いて、四つの夜の秘密のことわざを明かそう。"
    ),
    how: M(
      "Сахнаны бас немесе ← ↑ → ↓ пернелерімен жүр. Сүйекке жақындасаң, тапсырма ашылады.",
      "Нажимайте на сцену или ходите клавишами ← ↑ → ↓. Подойдите к косточке — откроется задание.",
      "Tap the scene or walk with the ← ↑ → ↓ keys. Get close to a bone to open its task.",
      "点击画面或用 ← ↑ → ↓ 键行走。走近骨头就会出现任务。",
      "Toca la escena o camina con las teclas ← ↑ → ↓. Acércate a un hueso para abrir su tarea.",
      "Tippe auf die Szene oder lauf mit den Tasten ← ↑ → ↓. Geh nah an einen Knochen, um seine Aufgabe zu öffnen.",
      "Touche la scène ou marche avec les touches ← ↑ → ↓. Approche-toi d'un osselet pour ouvrir sa tâche.",
      "Sahneye dokun ya da ← ↑ → ↓ tuşlarıyla yürü. Bir kemiğe yaklaşınca görevi açılır.",
      "اضغط على المشهد أو امشِ بالمفاتيح ← ↑ → ↓. اقترب من العظمة لتظهر مهمتها.",
      "화면을 누르거나 ← ↑ → ↓ 키로 걸어요. 뼈에 가까이 가면 과제가 열려요.",
      "画面をタップするか ← ↑ → ↓ キーで歩こう。骨に近づくと課題が開くよ。"
    ),
  },
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
