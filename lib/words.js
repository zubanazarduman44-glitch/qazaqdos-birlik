// Сөз қоры: ойындар мен сабақтарда қолданылады. ru/en — аударма, e — эмодзи.
export const TOPICS = {
  greet: { kk: "Сәлемдесу", ru: "Приветствия", en: "Greetings", e: "👋" },
  family: { kk: "Отбасы", ru: "Семья", en: "Family", e: "👨‍👩‍👧" },
  animals: { kk: "Жануарлар", ru: "Животные", en: "Animals", e: "🐎" },
  food: { kk: "Тағам", ru: "Еда", en: "Food", e: "🍞" },
  nature: { kk: "Табиғат", ru: "Природа", en: "Nature", e: "⛰️" },
  travel: { kk: "Саяхат", ru: "Путешествие", en: "Travel", e: "✈️" },
  colors: { kk: "Түстер", ru: "Цвета", en: "Colours", e: "🎨" },
  numbers: { kk: "Сандар", ru: "Числа", en: "Numbers", e: "🔢" },
};

import { EXTRA, EXTRA_TOPICS } from "./words2";
import { MORE_A } from "./words3";
import { MORE_B } from "./words4";
import { MORE_C } from "./words5";
import { WTR, setWordTr, tr, shuffle } from "./wordTools";
const W = (t, kk, ru, en, e) => ({ t, kk, ru, en, e });

export const WORDS = [
  W("greet", "Сәлем", "Привет", "Hello", "👋"),
  W("greet", "Рақмет", "Спасибо", "Thank you", "🙏"),
  W("greet", "Кешіріңіз", "Извините", "Excuse me", "🙇"),
  W("greet", "Сау болыңыз", "До свидания", "Goodbye", "👋"),
  W("greet", "Иә", "Да", "Yes", "✅"),
  W("greet", "Жоқ", "Нет", "No", "❌"),
  W("greet", "Қайырлы таң", "Доброе утро", "Good morning", "🌅"),
  W("greet", "Қош келдіңіз", "Добро пожаловать", "Welcome", "🤗"),

  W("family", "ана", "мама", "mother", "👩"),
  W("family", "әке", "папа", "father", "👨"),
  W("family", "әже", "бабушка", "grandmother", "👵"),
  W("family", "ата", "дедушка", "grandfather", "👴"),
  W("family", "бала", "ребёнок", "child", "🧒"),
  W("family", "дос", "друг", "friend", "🧑‍🤝‍🧑"),
  W("family", "отбасы", "семья", "family", "👨‍👩‍👧"),
  W("family", "аға", "старший брат", "elder brother", "👦"),

  W("animals", "жылқы", "лошадь", "horse", "🐎"),
  W("animals", "түйе", "верблюд", "camel", "🐫"),
  W("animals", "қой", "овца", "sheep", "🐑"),
  W("animals", "сиыр", "корова", "cow", "🐄"),
  W("animals", "ит", "собака", "dog", "🐕"),
  W("animals", "мысық", "кошка", "cat", "🐈"),
  W("animals", "бүркіт", "беркут", "golden eagle", "🦅"),
  W("animals", "қасқыр", "волк", "wolf", "🐺"),
  W("animals", "түлкі", "лиса", "fox", "🦊"),
  W("animals", "барыс", "снежный барс", "snow leopard", "🐆"),
  W("animals", "құс", "птица", "bird", "🐦"),
  W("animals", "балық", "рыба", "fish", "🐟"),

  W("food", "нан", "хлеб", "bread", "🍞"),
  W("food", "су", "вода", "water", "💧"),
  W("food", "сүт", "молоко", "milk", "🥛"),
  W("food", "шай", "чай", "tea", "🍵"),
  W("food", "ет", "мясо", "meat", "🥩"),
  W("food", "алма", "яблоко", "apple", "🍎"),
  W("food", "қымыз", "кумыс", "kumis", "🍶"),
  W("food", "бауырсақ", "баурсак", "baursak", "🥯"),
  W("food", "жұмыртқа", "яйцо", "egg", "🥚"),
  W("food", "бал", "мёд", "honey", "🍯"),
  W("food", "қарбыз", "арбуз", "watermelon", "🍉"),

  W("nature", "күн", "солнце", "sun", "☀️"),
  W("nature", "ай", "луна", "moon", "🌙"),
  W("nature", "жұлдыз", "звезда", "star", "⭐"),
  W("nature", "тау", "гора", "mountain", "⛰️"),
  W("nature", "көл", "озеро", "lake", "🏞️"),
  W("nature", "өзен", "река", "river", "🌊"),
  W("nature", "дала", "степь", "steppe", "🌾"),
  W("nature", "орман", "лес", "forest", "🌲"),
  W("nature", "гүл", "цветок", "flower", "🌸"),
  W("nature", "ағаш", "дерево", "tree", "🌳"),
  W("nature", "қар", "снег", "snow", "❄️"),
  W("nature", "жаңбыр", "дождь", "rain", "🌧️"),
  W("nature", "жел", "ветер", "wind", "💨"),

  W("travel", "үй", "дом", "house", "🏠"),
  W("travel", "қала", "город", "city", "🏙️"),
  W("travel", "ауыл", "село", "village", "🏡"),
  W("travel", "жол", "дорога", "road", "🛣️"),
  W("travel", "көлік", "машина", "car", "🚗"),
  W("travel", "пойыз", "поезд", "train", "🚆"),
  W("travel", "ұшақ", "самолёт", "plane", "✈️"),
  W("travel", "әуежай", "аэропорт", "airport", "🛫"),
  W("travel", "дүкен", "магазин", "shop", "🏪"),
  W("travel", "мектеп", "школа", "school", "🏫"),
  W("travel", "ақша", "деньги", "money", "💰"),
  W("travel", "киіз үй", "юрта", "yurt", "⛺"),

  W("colors", "ақ", "белый", "white", "⚪"),
  W("colors", "қара", "чёрный", "black", "⚫"),
  W("colors", "қызыл", "красный", "red", "🔴"),
  W("colors", "көк", "синий", "blue", "🔵"),
  W("colors", "сары", "жёлтый", "yellow", "🟡"),
  W("colors", "жасыл", "зелёный", "green", "🟢"),

  W("numbers", "бір", "один", "one", "1️⃣"),
  W("numbers", "екі", "два", "two", "2️⃣"),
  W("numbers", "үш", "три", "three", "3️⃣"),
  W("numbers", "төрт", "четыре", "four", "4️⃣"),
  W("numbers", "бес", "пять", "five", "5️⃣"),
  W("numbers", "алты", "шесть", "six", "6️⃣"),
  W("numbers", "жеті", "семь", "seven", "7️⃣"),
  W("numbers", "сегіз", "восемь", "eight", "8️⃣"),
  W("numbers", "тоғыз", "девять", "nine", "9️⃣"),
  W("numbers", "он", "десять", "ten", "🔟"),
];

// Кеңейтілген сөз қоры (lib/words2.js): қайталанбайтындарын қосамыз
Object.assign(TOPICS, EXTRA_TOPICS);
{
  const have = new Set(WORDS.map((w) => w.kk));
  for (const [t, list] of [...Object.entries(EXTRA), ...Object.entries(MORE_A), ...Object.entries(MORE_B), ...Object.entries(MORE_C)]) {
    for (const [kk, ru, en, e] of list) {
      if (have.has(kk)) continue;
      have.add(kk);
      WORDS.push(W(t, kk, ru, en, e));
    }
  }
}


// Аударма көмекшілері (WTR, setWordTr, tr, shuffle) — lib/wordTools.js
export { WTR, setWordTr, tr, shuffle };

// Сұрақ: қазақша сөз → 4 нұсқа (аударма) немесе керісінше
export function makeQuestion(pool, lang, { reverse = false, exclude = [] } = {}) {
  const src = pool.filter((w) => !exclude.includes(w.kk));
  const right = src[Math.floor(Math.random() * src.length)] || pool[0];
  const others = shuffle(pool.filter((w) => w.kk !== right.kk && tr(w, lang) !== tr(right, lang))).slice(0, 3);
  const options = shuffle([right, ...others]);
  return {
    word: right,
    prompt: reverse ? tr(right, lang) : right.kk,
    options: options.map((w) => ({ key: w.kk, label: reverse ? w.kk : tr(w, lang), e: w.e })),
    answer: right.kk,
  };
}

export function wordsByTopic(t) {
  return t && t !== "all" ? WORDS.filter((w) => w.t === t) : WORDS;
}
