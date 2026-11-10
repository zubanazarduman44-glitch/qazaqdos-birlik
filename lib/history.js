// Ұлы дала тарихы: 10 тарихи орын (ескі дәуірден орта ғасырға дейін, хронология бойынша).
const L = (kk, ru, en) => ({ kk, ru, en });
const w = (kk, ru, en, e) => ({ kk, ru, en, e });

export const SITES = [
  {
    id: "botai", e: "🐎", year: -3500, region: "north-kz",
    name: L("Ботай", "Ботай", "Botai"),
    era: L("б.з.д. IV мыңжылдық", "IV тыс. до н. э.", "4th millennium BC"),
    story: L(
      "Ботай қонысы — Солтүстік Қазақстандағы көне мекен. Ғалымдар мұнда адамдардың жылқыны ерте қолға үйреткені туралы іздер тапты: сүт қалдығы бар қыш ыдыстар мен жылқы сүйектері.",
      "Ботай — древнее поселение в Северном Казахстане. Учёные нашли здесь следы раннего одомашнивания лошади: керамику со следами молока и кости лошадей.",
      "Botai is an ancient settlement in North Kazakhstan. Scientists found signs of early horse domestication here: pottery with milk residue and horse bones."
    ),
    words: [w("жылқы", "лошадь", "horse", "🐎"), w("ыдыс", "посуда", "dish", "🏺"), w("мекен", "поселение", "settlement", "🛖")],
    q: { kk: "Ботай қонысы немен танымал?", ru: "Чем известен Ботай?", en: "What is Botai known for?" },
    a: [L("Жылқыны ерте қолға үйрету", "Ранним одомашниванием лошади", "Early horse domestication"), L("Ғарыш айлағы", "Космодромом", "A spaceport"), L("Теңіз порты", "Морским портом", "A sea port")],
  },
  {
    id: "tamgaly", e: "🦌", year: -1300, region: "almaty-reg",
    name: L("Тамғалы", "Тамгалы", "Tamgaly"),
    era: L("Қола дәуірі", "Бронзовый век", "Bronze Age"),
    story: L(
      "Тамғалы шатқалындағы жартастарда мыңдаған петроглиф — ежелгі суреттер бар: күн бас адамдар, жануарлар, аңшылық көріністері. 2004 жылы ЮНЕСКО тізіміне енді.",
      "На скалах ущелья Тамгалы — тысячи петроглифов: солнцеголовые фигуры, животные, сцены охоты. В 2004 году включены в список ЮНЕСКО.",
      "The rocks of Tamgaly gorge hold thousands of petroglyphs: sun-headed figures, animals and hunting scenes. Listed by UNESCO in 2004."
    ),
    words: [w("сурет", "рисунок", "picture", "🖼️"), w("жартас", "скала", "rock", "🪨"), w("аңшы", "охотник", "hunter", "🏹")],
    q: { kk: "Тамғалыда не сақталған?", ru: "Что сохранилось в Тамгалы?", en: "What survives at Tamgaly?" },
    a: [L("Жартастағы көне суреттер", "Древние рисунки на скалах", "Ancient rock drawings"), L("Ортағасырлық мешіт", "Средневековая мечеть", "A medieval mosque"), L("Хан сарайы", "Ханский дворец", "A khan's palace")],
  },
  {
    id: "berel", e: "🏔️", year: -300, region: "east-kz",
    name: L("Берел", "Берел", "Berel"),
    era: L("Сақ дәуірі, б.з.д. IV–III ғғ.", "Сакская эпоха, IV–III вв. до н. э.", "Saka era, 4th–3rd c. BC"),
    story: L(
      "Алтайдағы Берел қорғандары мәңгі тоңның арқасында жақсы сақталған. Мұнда әшекейленген ер-тұрманы бар жылқылар мен сақ көсемдерінің жерлеулері табылды.",
      "Курганы Берел на Алтае хорошо сохранились благодаря вечной мерзлоте. Здесь нашли погребения сакских вождей и лошадей в украшенной сбруе.",
      "The Berel kurgans in the Altai are well preserved thanks to permafrost. Burials of Saka chiefs and horses in decorated harness were found here."
    ),
    words: [w("қорған", "курган", "burial mound", "⛰️"), w("алтын", "золото", "gold", "🥇"), w("мұз", "лёд", "ice", "🧊")],
    q: { kk: "Берел қорғандары неге жақсы сақталған?", ru: "Почему курганы Берел хорошо сохранились?", en: "Why are the Berel kurgans well preserved?" },
    a: [L("Мәңгі тоңның арқасында", "Благодаря вечной мерзлоте", "Thanks to permafrost"), L("Су астында болғандықтан", "Потому что были под водой", "They were under water"), L("Құммен жабылғандықтан", "Их засыпал песок", "They were covered in sand")],
  },
  {
    id: "taraz", e: "🕌", year: 500, region: "zhambyl",
    name: L("Тараз", "Тараз", "Taraz"),
    era: L("Тарихы 2000 жылдан асады", "Более 2000 лет истории", "Over 2,000 years old"),
    story: L(
      "Тараз — Ұлы Жібек жолындағы сауда қаласы. Қала маңында XI–XII ғасырлардағы Айша бибі кесенесі тұр — оның қабырғалары ою-өрнекті терракота кірпішпен қапталған.",
      "Тараз — торговый город на Великом Шёлковом пути. Рядом стоит мавзолей Айши-биби XI–XII веков с узорной терракотовой облицовкой.",
      "Taraz was a trading city on the Great Silk Road. Nearby stands the 11th–12th-century Aisha Bibi Mausoleum with patterned terracotta tiles."
    ),
    words: [w("сауда", "торговля", "trade", "🤝"), w("кірпіш", "кирпич", "brick", "🧱"), w("ою", "узор", "ornament", "🌀")],
    q: { kk: "Тараз қай жолдың бойында орналасқан?", ru: "На каком пути стоял Тараз?", en: "Which route did Taraz stand on?" },
    a: [L("Ұлы Жібек жолы", "Великий Шёлковый путь", "The Great Silk Road"), L("Темір жол", "Железная дорога", "The railway"), L("Теңіз жолы", "Морской путь", "A sea route")],
  },
  {
    id: "otrar", e: "🏺", year: 900, region: "turkistan",
    name: L("Отырар", "Отрар", "Otrar"),
    era: L("Орта ғасырлар", "Средние века", "Middle Ages"),
    story: L(
      "Отырар — орта ғасырлардағы ірі қала, үлкен кітапханасымен әйгілі болған. Ұлы ғалым әл-Фараби осы өңірден шыққан деп саналады. 1219–1220 жылдары қаланы моңғол әскері қиратты.",
      "Отрар — крупный средневековый город, славившийся большой библиотекой. Считается, что из этих мест родом великий учёный аль-Фараби. В 1219–1220 годах город разрушили монголы.",
      "Otrar was a major medieval city famed for its great library. The great scholar al-Farabi is believed to come from this area. Mongol armies destroyed the city in 1219–1220."
    ),
    words: [w("кітапхана", "библиотека", "library", "📚"), w("ғалым", "учёный", "scholar", "🧑‍🔬"), w("қамал", "крепость", "fortress", "🏰")],
    q: { kk: "Отырар немен әйгілі болған?", ru: "Чем славился Отрар?", en: "What was Otrar famous for?" },
    a: [L("Үлкен кітапханасымен", "Большой библиотекой", "Its great library"), L("Мұнай кенімен", "Нефтяным месторождением", "An oil field"), L("Ғарыш айлағымен", "Космодромом", "A spaceport")],
  },
  {
    id: "saraishyk", e: "⛵", year: 1250, region: "atyrau",
    name: L("Сарайшық", "Сарайшык", "Saraishyk"),
    era: L("XIII–XVI ғасырлар", "XIII–XVI века", "13th–16th centuries"),
    story: L(
      "Сарайшық Жайық өзенінің жағасында тұрған. Ол Алтын Орда мен Ноғай Ордасының маңызды қаласы, керуен жолдарының түйіскен жері болған.",
      "Сарайшык стоял на берегу Урала (Жайыка). Это был важный город Золотой Орды и Ногайской Орды, узел караванных путей.",
      "Saraishyk stood on the bank of the Ural River. It was an important city of the Golden Horde and the Nogai Horde, a hub of caravan routes."
    ),
    words: [w("орда", "орда", "horde", "⛺"), w("жағалау", "берег", "riverbank", "🏞️"), w("керуен", "караван", "caravan", "🐫")],
    q: { kk: "Сарайшық қай өзеннің бойында тұрған?", ru: "На какой реке стоял Сарайшык?", en: "Which river did Saraishyk stand on?" },
    a: [L("Жайық", "Урал (Жайык)", "The Ural (Zhaiyk)"), L("Ертіс", "Иртыш", "The Irtysh"), L("Сырдария", "Сырдарья", "The Syr Darya")],
  },
  {
    id: "syganak", e: "🛡️", year: 1350, region: "kyzylorda",
    name: L("Сығанақ", "Сыгнак", "Sygnak"),
    era: L("XIV ғасыр", "XIV век", "14th century"),
    story: L(
      "Сығанақ — Сырдария бойындағы көне қала. XIV ғасырда ол Ақ Орданың астанасы болған.",
      "Сыгнак — древний город на Сырдарье. В XIV веке он был столицей Ак-Орды.",
      "Sygnak was an ancient city on the Syr Darya. In the 14th century it was the capital of the White Horde (Ak Orda)."
    ),
    words: [w("астана", "столица", "capital", "🏛️"), w("қақпа", "ворота", "gate", "🚪"), w("мұнара", "башня", "tower", "🗼")],
    q: { kk: "XIV ғасырда Сығанақ қай мемлекеттің астанасы болған?", ru: "Столицей чего был Сыгнак в XIV веке?", en: "What was Sygnak the capital of in the 14th century?" },
    a: [L("Ақ Орда", "Ак-Орды", "The White Horde"), L("Рим империясы", "Римской империи", "The Roman Empire"), L("Қытай", "Китая", "China")],
  },
  {
    id: "turkistan", e: "🕌", year: 1390, region: "turkistan",
    name: L("Түркістан", "Туркестан", "Turkistan"),
    era: L("XIV ғасырдың соңы", "конец XIV века", "late 14th century"),
    story: L(
      "Қожа Ахмет Ясауи кесенесі Әмір Темірдің бұйрығымен XIV ғасырдың соңында салынған. Көгілдір күмбездері алыстан көрінеді. 2003 жылы ЮНЕСКО тізіміне енді.",
      "Мавзолей Ходжи Ахмеда Ясави построен в конце XIV века по приказу Тимура. Его голубые купола видны издалека. В 2003 году включён в список ЮНЕСКО.",
      "The Mausoleum of Khoja Ahmed Yasawi was built in the late 14th century on Timur's orders. Its blue domes are visible from afar. UNESCO-listed in 2003."
    ),
    words: [w("күмбез", "купол", "dome", "🔵"), w("кесене", "мавзолей", "mausoleum", "🕌"), w("зиярат", "паломничество", "pilgrimage", "🚶")],
    q: { kk: "Ясауи кесенесі кімнің бұйрығымен салынған?", ru: "По чьему приказу построен мавзолей Ясави?", en: "On whose orders was the Yasawi Mausoleum built?" },
    a: [L("Әмір Темір", "Тимура", "Timur"), L("Шыңғыс хан", "Чингисхана", "Genghis Khan"), L("Абылай хан", "Абылай-хана", "Ablai Khan")],
  },
  {
    id: "sauran", e: "🧱", year: 1450, region: "turkistan",
    name: L("Сауран", "Сауран", "Sauran"),
    era: L("XIV–XVI ғасырлар", "XIV–XVI века", "14th–16th centuries"),
    story: L(
      "Сауран — биік қамал қабырғаларымен қоршалған ортағасырлық қала. Оның қираған қабырғалары әлі күнге дейін даладан көрініп тұр.",
      "Сауран — средневековый город, окружённый высокими крепостными стенами. Их руины до сих пор возвышаются над степью.",
      "Sauran was a medieval city ringed by tall fortress walls. Their ruins still rise above the steppe today."
    ),
    words: [w("қабырға", "стена", "wall", "🧱"), w("қамал", "крепость", "fortress", "🏰"), w("дала", "степь", "steppe", "🌾")],
    q: { kk: "Сауранның ерекшелігі не?", ru: "Чем примечателен Сауран?", en: "What is special about Sauran?" },
    a: [L("Биік қамал қабырғалары", "Высокими крепостными стенами", "Its tall fortress walls"), L("Ғарыш айлағы", "Космодромом", "A spaceport"), L("Жерасты метросы", "Метрополитеном", "An underground metro")],
  },
  {
    id: "bozok", e: "🏕️", year: 800, region: "astana",
    name: L("Бозоқ", "Бозок", "Bozok"),
    era: L("Орта ғасырлар", "Средние века", "Middle Ages"),
    story: L(
      "Бозоқ — Астана маңындағы ортағасырлық қалашық. Оның орны бүгінгі елорданың тарихы ғасырлар тереңінен басталатынын көрсетеді.",
      "Бозок — средневековое городище недалеко от Астаны. Оно показывает, что история нынешней столицы уходит в глубь веков.",
      "Bozok is a medieval settlement near Astana. It shows that the history of today's capital reaches back many centuries."
    ),
    words: [w("қалашық", "городище", "settlement", "🏘️"), w("ғасыр", "век", "century", "⏳"), w("елорда", "столица", "capital", "🏛️")],
    q: { kk: "Бозоқ қай қаланың маңында орналасқан?", ru: "Возле какого города находится Бозок?", en: "Which city is Bozok near?" },
    a: [L("Астана", "Астаны", "Astana"), L("Ақтау", "Актау", "Aktau"), L("Шымкент", "Шымкента", "Shymkent")],
  },
].sort((a, b) => a.year - b.year);
