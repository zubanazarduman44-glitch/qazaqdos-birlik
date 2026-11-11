// Ұлттық ойындар тізімі
const L = (kk, ru, en) => ({ kk, ru, en });

export const GAMES = [
  {
    id: "baige", e: "🐎", color: "#f59e0b",
    name: L("Бәйге", "Байге", "Baige"),
    desc: L("Ат жарысы: дұрыс жауап берген сайын атың алға шабады.", "Скачки: каждый верный ответ продвигает вашего коня.", "Horse race: every correct answer pushes your horse ahead."),
    how: L("Сөздің аудармасын тез тап. Қарсыластар күтпейді!", "Быстро выбирайте перевод. Соперники не ждут!", "Pick the translation fast. Rivals won't wait!"),
  },
  {
    id: "arkan", e: "🪢", color: "#ef4444",
    name: L("Арқан тартыс", "Перетягивание каната", "Tug of war"),
    desc: L("Әр дұрыс жауап арқанды өзіңе қарай тартады.", "Каждый верный ответ тянет канат к вам.", "Each correct answer pulls the rope your way."),
    how: L("Арқанды өз жағыңдағы белгіге дейін тарт.", "Перетяните канат до своей отметки.", "Pull the rope all the way to your mark."),
  },
  {
    id: "asyk", e: "🦴", color: "#a16207",
    name: L("Асық ату", "Асык ату", "Asyk atu"),
    desc: L("Сұраққа жауап бер де, дәл көздеп асықты құлат.", "Ответьте на вопрос и метко выбейте асык.", "Answer the question, then aim and knock the asyk down."),
    how: L("Күш жолағы жасыл аймаққа келгенде «Ату» бас.", "Нажмите «Бросок», когда шкала в зелёной зоне.", "Hit \"Throw\" when the power bar is in the green zone."),
  },
  {
    id: "tenge", e: "🪙", color: "#eab308",
    name: L("Теңге ілу", "Тенге илу", "Tenge ilu"),
    desc: L("Шауып келе жатып, дұрыс сөзі бар теңгені іліп ал.", "На скаку подхватите монету с нужным словом.", "At full gallop, grab the coin with the right word."),
    how: L("Атты ← → пернелерімен немесе батырмалармен жүргіз.", "Управляйте конём стрелками ← → или кнопками.", "Steer the horse with ← → keys or the buttons."),
  },
  {
    id: "bestas", e: "🪨", color: "#64748b",
    name: L("Бес тас", "Бес тас", "Bes tas"),
    desc: L("Бес жұп тасты тап: қазақша сөз және оның мағынасы.", "Найдите пять пар камней: слово и его значение.", "Find five pairs of stones: a word and its meaning."),
    how: L("Екі тасты аш. Жұбы сәйкес келсе, ашық қалады.", "Открывайте по два камня. Совпавшие пары остаются.", "Flip two stones. Matching pairs stay open."),
  },
  {
    id: "kokpar", e: "🐐", color: "#b8322a",
    name: L("Көкпар", "Кокпар", "Kokpar"),
    desc: L("Ат үстіндегі көкпар: дұрыс жауап серкені қарсыластың қақпасына жеткізеді.", "Конная игра: верные ответы несут козла к воротам соперника.", "Horseback game: correct answers carry the goat to the rival's goal."),
    how: L("Жауап беруге: оңай — 8, орташа — 5, қиын — 3 секунд. Бірінші болып гол соққан жеңеді!", "Время на ответ: легко — 8, средне — 5, сложно — 3 секунды. Побеждает тот, кто первым забьёт нужные голы!", "Time to answer: easy 8, medium 5, hard 3 seconds. First to score the goals wins!"),
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
