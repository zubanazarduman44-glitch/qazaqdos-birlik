// Ұлы дала тарихы: 11 тарихи орын (ескі дәуірден орта ғасырға дейін, хронология бойынша).
// Бұл файл жеңіл: тек атау, дәуір, орын және 3 сөз (оны профиль мен сөздік те жүктейді).
// Оқу мәтіні мен сұрақтар — lib/historyText.js (тек Тарих беті), аудармалары — lib/l10n/history/<тіл>.js.
// art — lib/artifacts.js ішіндегі 3D жәдігер id (болса, карточкада «3D-де қарау» батырмасы шығады).
const L = (kk, ru, en) => ({ kk, ru, en });
const w = (kk, ru, en, e) => ({ kk, ru, en, e });

export const SITES = [
  {
    id: "botai", year: -3500, region: "north-kz", sym: "hl-hut", tsym: "ht-pot", tdx: -30, tdy: 6, art: "botai",
    name: L("Ботай", "Ботай", "Botai"),
    era: L("б.з.д. IV мыңжылдық", "IV тыс. до н. э.", "4th millennium BC"),
    words: [w("жылқы", "лошадь", "horse", "🐎"), w("ыдыс", "посуда", "dish", "🏺"), w("мекен", "поселение", "settlement", "🛖")],
  },
  {
    id: "issyk", dx: 46, dy: 30, year: -450, region: "almaty-reg", sym: "hl-kurgan", tsym: "ht-goldman", tdx: -34, tdy: 12, art: "goldman",
    name: L("Есік қорғаны", "Иссыкский курган", "Issyk kurgan"),
    era: L("Сақ дәуірі", "Эпоха саков", "Saka era"),
    words: [w("алтын", "золото", "gold", "🥇"), w("жауынгер", "воин", "warrior", "⚔️"), w("қорған", "курган", "burial mound", "⛰️")],
  },
  {
    id: "tamgaly", dx: -12, dy: -24, year: -1300, region: "almaty-reg", sym: "hl-petro", tsym: "ht-sun", tdx: 24, tdy: 8, art: "petroglyph",
    name: L("Тамғалы", "Тамгалы", "Tamgaly"),
    era: L("Қола дәуірі", "Бронзовый век", "Bronze Age"),
    words: [w("сурет", "рисунок", "picture", "🖼️"), w("жартас", "скала", "rock", "🪨"), w("аңшы", "охотник", "hunter", "🏹")],
  },
  {
    id: "berel", dx: 0, dy: 0, year: -300, region: "east-kz", sym: "hl-kurgan", tsym: "ht-goldhorse", tdx: 26, tdy: 10, art: "berel",
    name: L("Берел", "Берел", "Berel"),
    era: L("Сақ дәуірі, б.з.д. IV–III ғғ.", "Сакская эпоха, IV–III вв. до н. э.", "Saka era, 4th–3rd c. BC"),
    words: [w("қорған", "курган", "burial mound", "⛰️"), w("алтын", "золото", "gold", "🥇"), w("мұз", "лёд", "ice", "🧊")],
  },
  {
    id: "taraz", dx: 0, dy: 10, year: 500, region: "zhambyl", sym: "mausoleum", tsym: "ht-coin", tdx: 30, tdy: 10, art: "coin",
    name: L("Тараз", "Тараз", "Taraz"),
    era: L("Тарихы 2000 жылдан асады", "Более 2000 лет истории", "Over 2,000 years old"),
    words: [w("сауда", "торговля", "trade", "🤝"), w("кірпіш", "кирпич", "brick", "🧱"), w("ою", "узор", "ornament", "🌀")],
  },
  {
    id: "otrar", dx: -48, dy: -6, year: 900, region: "turkistan", sym: "hl-walls", tsym: "ht-scroll", tdx: -30, tdy: -4,
    name: L("Отырар", "Отрар", "Otrar"),
    era: L("Орта ғасырлар", "Средние века", "Middle Ages"),
    words: [w("кітапхана", "библиотека", "library", "📚"), w("ғалым", "учёный", "scholar", "🧑‍🔬"), w("қамал", "крепость", "fortress", "🏰")],
  },
  {
    id: "saraishyk", year: 1250, region: "atyrau", sym: "hl-minaret", tsym: "ht-coin", tdx: 26, tdy: 10,
    name: L("Сарайшық", "Сарайшык", "Saraishyk"),
    era: L("XIII–XVI ғасырлар", "XIII–XVI века", "13th–16th centuries"),
    words: [w("орда", "орда", "horde", "⛺"), w("жағалау", "берег", "riverbank", "🏞️"), w("керуен", "караван", "caravan", "🐫")],
  },
  {
    id: "syganak", year: 1350, region: "kyzylorda", sym: "hl-walls", tsym: "ht-helmet", tdx: 26, tdy: 10,
    name: L("Сығанақ", "Сыгнак", "Sygnak"),
    era: L("XIV ғасыр", "XIV век", "14th century"),
    words: [w("астана", "столица", "capital", "🏛️"), w("базар", "рынок", "market", "🛒"), w("түйе", "верблюд", "camel", "🐫")],
  },
  {
    id: "turkistan", dx: 16, dy: 26, year: 1390, region: "turkistan", sym: "yasawi", tsym: "ht-cauldron", tdx: 34, tdy: 12, art: "taikazan",
    name: L("Түркістан", "Туркестан", "Turkistan"),
    era: L("XIV ғасырдың соңы", "конец XIV века", "late 14th century"),
    words: [w("күмбез", "купол", "dome", "🔵"), w("кесене", "мавзолей", "mausoleum", "🕌"), w("зиярат", "паломничество", "pilgrimage", "🚶")],
  },
  {
    id: "sauran", dx: 44, dy: -24, year: 1450, region: "turkistan", sym: "hl-walls", tsym: "ht-bow", tdx: 28, tdy: 10,
    name: L("Сауран", "Сауран", "Sauran"),
    era: L("XIV–XVI ғасырлар", "XIV–XVI века", "14th–16th centuries"),
    words: [w("қабырға", "стена", "wall", "🧱"), w("қамал", "крепость", "fortress", "🏰"), w("дала", "степь", "steppe", "🌾")],
  },
  {
    id: "bozok", year: 800, region: "astana", sym: "yurt", tsym: "ht-balbal", tdx: 26, tdy: 10,
    name: L("Бозоқ", "Бозок", "Bozok"),
    era: L("Орта ғасырлар", "Средние века", "Middle Ages"),
    words: [w("қалашық", "городище", "settlement", "🏘️"), w("ғасыр", "век", "century", "⏳"), w("елорда", "столица", "capital", "🏛️")],
  },
].sort((a, b) => a.year - b.year);
