// Өңірлер мен көрікті жерлер туралы қысқа анықтамалық мәтіндер (kk / ru / en).
// SIGHTS кілті — lib/regions.js ішіндегі sights[].en жолы. kind — SIGHT_KINDS тізімінен.
const L = (kk, ru, en) => ({ kk, ru, en });

export const SIGHT_KINDS = [
  "tower", "tent", "embankment", "ice", "hill", "ski", "park", "bazaar", "pineLake", "wetland",
  "reservoir", "lowMountains", "canyon", "alpineLakes", "river", "ruins", "mausoleum", "peaks", "dunes", "steppeReserve",
  "lakeShore", "rocket", "sea", "whiteCliffs", "cave", "rocks", "ancient", "horde", "snowPeak", "mountainLake",
];

export const SIGHTS = {
  // Астана
  "Baiterek": {
    kind: "tower",
    text: L(
      "Бәйтерек — Астананың басты символы, ол Самұрық құс бұтақтарының арасына жұмыртқа салған өмір ағашы туралы аңызды бейнелейді. Алтын шардың ішіндегі шолу алаңы 97 метр биіктікте орналасқан — бұл Астана елорда болған 1997 жылды білдіреді.",
      "Байтерек — главный символ Астаны: он изображает легендарное дерево жизни, в ветвях которого волшебная птица Самрук снесла яйцо. Смотровая площадка внутри золотого шара находится на высоте 97 метров — в честь 1997 года, когда Астана стала столицей.",
      "Baiterek is the main symbol of Astana, based on a legend about a tree of life where the magic bird Samruk laid her egg. Its viewing deck inside the golden sphere sits at 97 metres, a nod to 1997, when Astana became the capital."
    ),
  },
  "Khan Shatyr": {
    kind: "tent",
    text: L(
      "Хан Шатыр — алып мөлдір шатыр пішініндегі сауда-ойын-сауық орталығы, оны британ сәулетшісі Норман Фостер жобалаған. 2010 жылы ашылған ғимараттың шпильмен қоса биіктігі 150 метр, ал ішінде тіпті жасанды жағажай бар.",
      "Хан Шатыр — торгово-развлекательный центр в форме огромного прозрачного шатра, построенный по проекту британского архитектора Нормана Фостера. Здание открылось в 2010 году, его высота вместе со шпилем — 150 метров, а внутри есть даже пляж.",
      "Khan Shatyr is a shopping and leisure centre shaped like a giant see-through tent, designed by British architect Norman Foster. It opened in 2010, stands 150 metres tall including its spire, and even has an indoor beach."
    ),
  },
  "Yesil embankment": {
    kind: "embankment",
    text: L(
      "Есіл жағалауы — Астананың ортасынан ағып өтетін Есіл өзенінің бойындағы серуендеу орны. Мұнда 2018 жылы ашылған, балыққа ұқсайтын «Атырау» жаяу жүргіншілер көпірі бар, ал қыста жағалау үлкен мұз айдынына айналады.",
      "Набережная Есиля — любимое место прогулок вдоль реки, которая течёт через центр Астаны. Здесь стоит пешеходный мост «Атырау» 2018 года, похожий на рыбу, а зимой набережная превращается в большой каток.",
      "The Yesil embankment is a promenade along the river that flows through central Astana. Its fish-shaped Atyrau footbridge opened in 2018, and in winter the riverside turns into a big ice rink."
    ),
  },

  // Алматы
  "Medeu": {
    kind: "ice",
    text: L(
      "Медеу — Алматының үстіндегі тау шатқалында, теңіз деңгейінен шамамен 1691 метр биіктікте орналасқан әйгілі мұз айдыны. Ол 1972 жылы ашылған, мұнда конькимен жүгіруден көптеген әлемдік рекордтар орнатылған.",
      "Медеу — знаменитый высокогорный каток в ущелье над Алматы, на высоте около 1691 метра над уровнем моря. Он открылся в 1972 году, и на его льду установлено множество мировых рекордов по конькобежному спорту.",
      "Medeu is a famous high-mountain skating rink in a gorge above Almaty, about 1,691 metres above sea level. It opened in 1972, and many speed-skating world records have been set on its ice."
    ),
  },
  "Kok-Tobe": {
    kind: "hill",
    text: L(
      "Көктөбе — Алматының оңтүстік-шығыс шетіндегі, теңіз деңгейінен шамамен 1100 метр биіктіктегі төбе. Оның етегінде биіктігі 372 метр телемұнара тұр, ал төбенің басына қала ортасынан аспалы жолмен көтерілуге болады.",
      "Кок-Тобе — холм на юго-восточной окраине Алматы высотой около 1100 метров над уровнем моря. У его подножия стоит телебашня высотой 372 метра, а на вершину из центра города ведёт канатная дорога.",
      "Kok-Tobe is a hill on the south-eastern edge of Almaty, about 1,100 metres above sea level. A 372-metre TV tower stands at its foot, and a cable car carries visitors up from the city centre."
    ),
  },
  "Shymbulak": {
    kind: "ski",
    text: L(
      "Шымбұлақ — Іле Алатауындағы, Алматыдан шамамен 25 шақырым жердегі белгілі тау шаңғысы курорты. Оған Медеуден гондолалы аспалы жолмен көтеріледі, ал ең биік нүктесі — теңіз деңгейінен шамамен 3200 метр биіктіктегі Талғар асуы.",
      "Шымбулак — известный горнолыжный курорт в Заилийском Алатау, примерно в 25 км от Алматы. Сюда поднимаются на гондоле от Медеу, а самая высокая точка — перевал Талгар на высоте около 3200 метров.",
      "Shymbulak is a well-known ski resort in the Trans-Ili Alatau, about 25 km from Almaty. A gondola lifts visitors up from Medeu, and the highest point, Talgar Pass, is about 3,200 metres above sea level."
    ),
  },

  // Шымкент
  "Independence Park": {
    kind: "park",
    text: L(
      "Тәуелсіздік саябағы — Шымкенттегі саябақ, ол 2011 жылы Қазақстан тәуелсіздігінің 20 жылдығына орай ашылды. Мұнда әнші фонтан, ел халықтарының бірлігін бейнелейтін «Алтын шаңырақ» монументі және Ордабасы алаңына апаратын жаяу көпір бар.",
      "Парк Независимости в Шымкенте открылся в 2011 году к 20-летию независимости Казахстана. В нём есть поющий фонтан, монумент «Алтын шанырак» — символ единства народов страны — и пешеходный мост к площади Ордабасы.",
      "Independence Park in Shymkent opened in 2011 for the 20th anniversary of Kazakhstan's independence. It has a singing fountain, the Altyn Shanyrak monument to the unity of the country's peoples, and a footbridge to Ordabasy Square."
    ),
  },
  "Central bazaar": {
    kind: "bazaar",
    text: L(
      "Орталық базар — Шымкенттің у-шуы мол көне сауда орны, мұнда жеміс-жидек, дәмдеуіштер мен жергілікті тағамдар сатылады. Шымкент Жібек жолындағы Сайрамды қорғайтын керуен сарайдан өсіп шыққан, сондықтан сауда — бұл қаланың ежелгі дәстүрі.",
      "Центральный рынок — шумный старый базар Шымкента, где продают фрукты, специи и местную еду. Шымкент вырос из караван-сарая, охранявшего Сайрам на Шёлковом пути, поэтому торговля здесь — давняя традиция.",
      "The Central bazaar is Shymkent's busy old market, full of fruit, spices and local food. The city grew from a caravanserai that guarded the Silk Road town of Sayram, so trading here is an old tradition."
    ),
  },

  // Ақмола облысы
  "Burabay": {
    kind: "pineLake",
    text: L(
      "Бурабай — Көкшетау тауларының арасындағы қарағайлы ормандар мен мөлдір көлдерге толы ұлттық парк, оны «Қазақстанның інжу-маржаны» деп атайды. Бурабай көлінің ішінен көтеріліп тұрған Жұмбақтас жартасы туралы көптеген аңыздар айтылады.",
      "Бурабай — национальный парк с сосновыми лесами и прозрачными озёрами среди Кокшетауских гор, его называют «жемчужиной Казахстана». Со скалой Жумбактас, которая поднимается прямо из озера Бурабай, связано много легенд.",
      "Burabay is a national park of pine forests and clear lakes among the Kokshetau hills, often called the pearl of Kazakhstan. Many legends are told about Zhumbaktas, the riddle rock that rises out of Lake Burabay."
    ),
  },
  "Korgalzhyn Reserve": {
    kind: "wetland",
    text: L(
      "Қорғалжын қорығы 1968 жылы құрылған, ол Теңіз көлін және оның айналасындағы дала көлдерін қорғайды. Мұнда әлемдегі ең солтүстікте мекендейтін қызғылт фламинголар бар, ал 2008 жылы қорық ЮНЕСКО-ның Бүкіләлемдік мұра тізіміне енді.",
      "Коргалжынский заповедник основан в 1968 году и охраняет озеро Тенгиз и степные озёра вокруг него. Здесь живёт самая северная в мире популяция розовых фламинго, а в 2008 году заповедник вошёл в список Всемирного наследия ЮНЕСКО.",
      "Korgalzhyn Reserve, founded in 1968, protects Lake Tengiz and the steppe lakes around it. It is home to the world's northernmost population of pink flamingos and became part of a UNESCO World Heritage Site in 2008."
    ),
  },

  // Ақтөбе облысы
  "Aktobe reservoir": {
    kind: "reservoir",
    text: L(
      "Ақтөбе су қоймасы — Елек өзенінде 1988 жылы жасалған жасанды көл. Оның ауданы шамамен 32 шаршы шақырым, ол қаланы және маңайдағы егістіктерді сумен қамтамасыз етеді.",
      "Актюбинское водохранилище — искусственное озеро на реке Илек, созданное в 1988 году. Его площадь около 32 квадратных километров, оно снабжает водой город и окрестные поля.",
      "The Aktobe reservoir is a man-made lake on the Ilek River, created in 1988. It covers about 32 square kilometres and supplies water to the city and nearby farmland."
    ),
  },
  "Mugalzhar mountains": {
    kind: "lowMountains",
    text: L(
      "Мұғалжар — Ақтөбе облысындағы, Орал тауларының оңтүстіктегі жалғасы саналатын аласа таулар. Олар шамамен 200 шақырымға созылады, ең биік нүктесі — 657 метрлік Үлкен Боқтыбай, ал осы таулардан Ор, Ембі, Ырғыз өзендері бастау алады.",
      "Мугалжары — невысокие горы в Актюбинской области, которые считают южным продолжением Урала. Они тянутся примерно на 200 км, высшая точка — гора Большой Боктыбай (657 м), а здесь берут начало реки Орь, Эмба и Иргиз.",
      "The Mugalzhar are low mountains in Aktobe Region, seen as the southern tail of the Ural Mountains. They run for about 200 km, rise to 657 m at Ulken Boktybay, and are the source of the Or, Emba and Irgiz rivers."
    ),
  },

  // Алматы облысы
  "Charyn Canyon": {
    kind: "canyon",
    text: L(
      "Шарын шатқалы — Шарын өзені ұзақ уақыт бойы қашап жасаған, шамамен 154 шақырымға созылған каньон. Оның қабырғалары 150–300 метрге көтеріледі, ал өзен бойында мұз дәуірінен сақталған сирек кездесетін соғды шағанының тоғайы өседі.",
      "Чарынский каньон — ущелье длиной около 154 км, которое река Чарын промывала очень долгое время. Его стены поднимаются на 150–300 метров, а вдоль реки растёт редкая роща согдийского ясеня, сохранившаяся с ледникового периода.",
      "Charyn Canyon is a gorge about 154 km long, carved over a very long time by the Charyn River. Its walls rise 150 to 300 metres, and a rare grove of Sogdian ash, a tree left over from the Ice Age, grows along the river."
    ),
  },
  "Kolsai Lakes": {
    kind: "alpineLakes",
    text: L(
      "Көлсай көлдері — Күнгей Алатауындағы бір өзен жалғап жатқан үш тау көлі, оларды «Солтүстік Тянь-Шаньның інжу-маржаны» деп атайды. Ең төменгі көл теңіз деңгейінен шамамен 1800 метр биіктікте жатыр, ал жоғарғы көлдерге жаяу соқпақтар апарады.",
      "Кольсайские озёра — три горных озера в хребте Кунгей Алатау, нанизанные на одну реку; их называют «жемчужиной Северного Тянь-Шаня». Нижнее озеро лежит на высоте около 1800 метров, а к верхним ведут пешие тропы.",
      "The Kolsai Lakes are three mountain lakes in the Kungey Alatau, strung along one river and called the pearls of the Northern Tian Shan. The lowest lake lies about 1,800 metres above sea level, and hiking trails lead up to the higher ones."
    ),
  },

  // Атырау және Батыс Қазақстан облыстары
  "Ural River": {
    kind: "river",
    text: L(
      "Жайық — ұзындығы 2428 шақырым өзен, ол Ресейдегі Орал тауларынан басталып, Каспий теңізіне құяды. Оның бойында Орал мен Атырау қалалары тұр, ал өзеннің өзі дәстүрлі түрде Еуропа мен Азияның шекарасы саналады.",
      "Урал, или Жайык, — река длиной 2428 км: она начинается в Уральских горах в России и впадает в Каспийское море. На ней стоят Уральск и Атырау, а саму реку традиционно считают границей Европы и Азии.",
      "The Ural, called Zhaiyk in Kazakh, is a 2,428 km river that rises in the Ural Mountains of Russia and flows into the Caspian Sea. The cities of Oral and Atyrau stand on its banks, and it is traditionally seen as a border between Europe and Asia."
    ),
  },
  "Saraishyk": {
    kind: "ruins",
    text: L(
      "Сарайшық — Жайық өзенінің жағасындағы, XIII ғасырда Алтын Орда дәуірінде пайда болған ортағасырлық сауда қаласының орны. Кейін ол Ноғай Ордасының астанасы болып, 1580 жылы қиратылды, ал аңыз бойынша мұнда жеті хан жерленген.",
      "Сарайшык — городище на берегу Урала, где в XIII веке, во времена Золотой Орды, вырос торговый город. Позже он стал столицей Ногайской Орды и был разрушен в 1580 году, а по легенде здесь похоронены семь ханов.",
      "Saraishyk is the site of a medieval trading town on the Ural River that grew up in the 13th century, in the time of the Golden Horde. It later became the capital of the Nogai Horde and was destroyed in 1580; legend says seven khans are buried here."
    ),
  },

  // Абай облысы
  "Abai–Shakarim Mausoleum": {
    kind: "mausoleum",
    text: L(
      "Абай-Шәкәрім кесенесі — Жидебайдағы ұлы ақын Абайға және оның туысы әрі шәкірті, ақын әрі ойшыл Шәкәрімге арналған мемориалдық кешен. Ол 1995 жылы, Абайдың туғанына 150 жыл толғанда ашылды, Абай мұнарасының биіктігі — 37 метр.",
      "Мавзолей Абая и Шакарима — мемориальный комплекс в Жидебае, посвящённый великому поэту Абаю и его родственнику и ученику, поэту и мыслителю Шакариму. Он открыт в 1995 году, к 150-летию Абая, а башня Абая поднимается на 37 метров.",
      "The Abai–Shakarim Mausoleum is a memorial complex at Zhidebay honouring the great poet Abai and his relative and pupil, the poet and thinker Shakarim. It opened in 1995, the 150th anniversary of Abai's birth, and Abai's tower is 37 metres tall."
    ),
  },
  "Shyngystau": {
    kind: "peaks",
    text: L(
      "Шыңғыстау — Абай облысындағы шамамен 200 шақырымға созылған аласа таулы жота, оның ең биік нүктесі 1300 метрден сәл асады. Ұлы ақын Абай Құнанбайұлы осы таулардың баурайында туып-өскен.",
      "Чингистау — невысокий хребет в Абайской области длиной около 200 км, его высшая точка чуть выше 1300 метров. У подножия этих гор родился и вырос великий поэт Абай Кунанбайулы.",
      "Shyngystau is a low mountain range in Abai Region, about 200 km long, with its highest point just over 1,300 metres. The great poet Abai Kunanbayuly was born and grew up in the foothills of these hills."
    ),
  },

  // Жамбыл облысы
  "Aisha Bibi Mausoleum": {
    kind: "mausoleum",
    text: L(
      "Айша бибі кесенесі Тараздан шамамен 18 шақырым батыста, XI–XII ғасырларда салынған. Оның қабырғалары 60-қа жуық түрлі өрнегі бар ойма терракота плиталарымен көмкерілген, ал аңыз бойынша оны Қарахан өзінің қалыңдығы Айшаға арнап тұрғызған.",
      "Мавзолей Айши-биби построен в XI–XII веках примерно в 18 км к западу от Тараза. Его стены покрыты резной терракотовой плиткой почти 60 разных узоров, а по легенде правитель Карахан возвёл его для своей невесты Айши.",
      "The Aisha Bibi Mausoleum was built in the 11th or 12th century, about 18 km west of Taraz. Its walls are covered in carved terracotta tiles with some 60 different patterns, and legend says a ruler, Karakhan, built it for his bride Aisha."
    ),
  },
  "Ancient Taraz": {
    kind: "ruins",
    text: L(
      "Ежелгі Тараз — Ұлы Жібек жолындағы ең көне қалалардың бірі, ол жазба деректерде VI ғасырда-ақ аталады. Қала X–XII ғасырларда Қарахандар тұсында гүлденген, ал көне Тараздың қалдықтары қазіргі қала орталығының астында жатыр.",
      "Древний Тараз — один из старейших городов на Великом Шёлковом пути, он упоминается в письменных источниках уже в VI веке. Город расцвёл в X–XII веках при Караханидах, а остатки древнего Тараза лежат под центром современного города.",
      "Ancient Taraz is one of the oldest towns on the Great Silk Road, mentioned in written sources as early as the 6th century. It flourished under the Karakhanids in the 10th to 12th centuries, and the remains of the old town lie beneath today's city centre."
    ),
  },

  // Жетісу облысы
  "Altyn-Emel National Park": {
    kind: "steppeReserve",
    text: L(
      "Алтынемел ұлттық паркі 1996 жылы Іле өзенінің бойында құрылды, ол Қазақстандағы ең үлкен қорғалатын аумақтардың бірі. Мұнда құландар жайылады, түрлі түсті Ақтау таулары мен сақтар дәуірінің Бесшатыр қорғандары бар.",
      "Национальный парк Алтын-Эмель создан в 1996 году вдоль реки Или и стал одной из крупнейших охраняемых территорий Казахстана. Здесь пасутся куланы, стоят разноцветные горы Актау и сакские курганы Бесшатыр.",
      "Altyn-Emel National Park was created in 1996 along the Ili River and is one of the largest protected areas in Kazakhstan. Wild kulans roam here, and it has the colourful Aktau hills and the Saka burial mounds of Besshatyr."
    ),
  },
  "Singing Dune": {
    kind: "dunes",
    text: L(
      "Әнші бархан — Алтынемел паркіндегі, Іле өзенінің маңындағы биіктігі 100 метрден асатын құм төбе. Құрғақ күні құм сырғанағанда бархан органға ұқсас гуілдейді, бұл дыбыс бірнеше шақырымға дейін естіледі.",
      "Поющий бархан — песчаный холм высотой более 100 метров в парке Алтын-Эмель, недалеко от реки Или. В сухую погоду, когда песок осыпается, бархан гудит, как орган, и этот звук слышен за несколько километров.",
      "The Singing Dune is a sand hill more than 100 metres high in Altyn-Emel National Park, near the Ili River. In dry weather, when the sand slides down, it hums like an organ, and the sound can carry for several kilometres."
    ),
  },

  // Қарағанды облысы
  "Karkaraly": {
    kind: "lowMountains",
    text: L(
      "Қарқаралы — Сарыарқа даласының ортасында көтерілген, қарағайлы орманы мен шағын көлдері бар гранит таулар. 1998 жылы мұнда ұлттық парк құрылды, ең биік шыңы — Жиренсақал, оның биіктігі 1403 метр.",
      "Каркаралы — гранитные горы с сосновыми лесами и небольшими озёрами посреди степей Сарыарки. В 1998 году здесь создан национальный парк, а высшая вершина — Жиренсакал высотой 1403 метра.",
      "Karkaraly is a cluster of granite mountains with pine forests and small lakes rising from the Saryarka steppe. A national park was created here in 1998, and its highest peak, Zhirensakal, reaches 1,403 metres."
    ),
  },
  "Lake Balkhash": {
    kind: "lakeShore",
    text: L(
      "Балқаш — толығымен Қазақстан аумағында жатқан ең үлкен көл, оның ұзындығы шамамен 600 шақырым. Көлдің ерекшелігі: Сарыесік түбегі бөліп тұрған батыс бөлігінің суы тұщыға жақын, ал шығыс бөлігінің суы ащы.",
      "Балхаш — самое большое озеро, целиком лежащее в Казахстане, его длина около 600 км. Главная особенность озера: западная часть, отделённая полуостровом Сарыесик, почти пресная, а восточная — солёная.",
      "Balkhash is the largest lake lying entirely within Kazakhstan, stretching about 600 km. Its special feature is that the western part, separated by the Saryesik Peninsula, is almost fresh, while the eastern part is salty."
    ),
  },

  // Қостанай облысы
  "Naurzum Reserve": {
    kind: "steppeReserve",
    text: L(
      "Наурызым қорығы 1931 жылы Торғай үстіртінде құрылған. Ол дала ортасында өсетін қарағайлы ормандар мен құсқа бай көлдерді қорғайды, ал 2008 жылы ЮНЕСКО-ның Бүкіләлемдік мұра тізіміне енді.",
      "Наурзумский заповедник основан в 1931 году на Тургайском плато. Он охраняет сосновые леса, растущие посреди степи, и богатые птицами озёра, а в 2008 году вошёл в список Всемирного наследия ЮНЕСКО.",
      "Naurzum Reserve was founded in 1931 on the Turgay Plateau. It protects pine forests growing in the middle of the steppe and lakes full of birds, and in 2008 it became part of a UNESCO World Heritage Site."
    ),
  },
  "Tobol River": {
    kind: "river",
    text: L(
      "Тобыл — Торғай үстіртінен басталып, солтүстікке қарай ағатын, ұзындығы шамамен 1591 шақырым өзен. Оның жағасында Қостанай қаласы тұр, ал Ресейде, Тобольск қаласының тұсында Тобыл Ертіске құяды.",
      "Тобол — река длиной около 1591 км, которая начинается на Тургайском плато и течёт на север. На ней стоит город Костанай, а в России, у Тобольска, Тобол впадает в Иртыш.",
      "The Tobol is a river about 1,591 km long that starts on the Turgay Plateau and flows north. The city of Kostanay stands on its banks, and in Russia, at the town of Tobolsk, it joins the Irtysh."
    ),
  },

  // Қызылорда облысы
  "Baikonur": {
    kind: "rocket",
    text: L(
      "Байқоңыр — Қызылорда облысының даласындағы әлемге әйгілі ғарыш айлағы. 1957 жылы осы жерден Жердің алғашқы жасанды серігі ұшырылды, ал 1961 жылы дәл сол алаңнан Юрий Гагарин ғарышқа аттанды.",
      "Байконур — знаменитый космодром в степи Кызылординской области. В 1957 году отсюда запустили первый искусственный спутник Земли, а в 1961 году с той же площадки в космос отправился Юрий Гагарин.",
      "Baikonur is a world-famous spaceport in the steppe of Kyzylorda Region. The first artificial satellite was launched here in 1957, and Yuri Gagarin lifted off from the same pad in 1961."
    ),
  },
  "Aral Sea": {
    kind: "sea",
    text: L(
      "Арал теңізі бір кезде әлемдегі ең ірі төртінші көл болған, бірақ 1960 жылдардан бастап Әмудария мен Сырдария суы егістікке бұрылғандықтан қатты тартылды. 2005 жылы салынған Көкарал бөгеті Солтүстік Аралды бөліп, оның суы мен балығын ішінара қалпына келтіруге көмектесті.",
      "Аральское море когда-то было четвёртым по величине озером мира, но с 1960-х годов резко обмелело, потому что воду Амударьи и Сырдарьи стали забирать на поля. Кокаральская плотина, достроенная в 2005 году, отделила Северный Арал и помогла ему частично восстановиться: вернулись вода и рыба.",
      "The Aral Sea was once the fourth-largest lake in the world, but from the 1960s it shrank sharply as water from the Amu Darya and Syr Darya was taken for irrigation. The Kokaral dam, finished in 2005, separated the North Aral and helped it partly recover, bringing back water and fish."
    ),
  },

  // Маңғыстау облысы
  "Bozzhyra": {
    kind: "whiteCliffs",
    text: L(
      "Бозжыра — Үстірт қыратының батыс шетіндегі ақ әктас пен бор жартастары бар шатқал. Миллиондаған жыл бұрын бұл жер ежелгі Тетис мұхитының түбі болған, сондықтан жартастардан әлі күнге дейін тасқа айналған ұлу қабыршақтары мен акула тістері табылады.",
      "Бозжыра — урочище на западном краю плато Устюрт с белыми скалами из известняка и мела. Миллионы лет назад здесь было дно древнего океана Тетис, поэтому в скалах до сих пор находят окаменелые ракушки и зубы акул.",
      "Bozzhyra is a valley on the western edge of the Ustyurt Plateau, lined with white cliffs of limestone and chalk. Millions of years ago this was the floor of the ancient Tethys Ocean, so fossil shells and shark teeth are still found in the rocks."
    ),
  },
  "Beket Ata underground mosque": {
    kind: "cave",
    text: L(
      "Бекет ата жерасты мешіті — Маңғыстаудағы Оғланды жеріндегі бор жартасқа қашалып жасалған киелі орын. Мұнда 1750–1813 жылдары өмір сүрген сопы, ұстаз әрі ағартушы Бекет ата шәкірттерін оқытқан және осында жерленген, сондықтан мұнда көп адам зиярат етеді.",
      "Подземная мечеть Бекет-ата — святое место в Мангистау, высеченное в меловой скале урочища Огланды. Здесь учил учеников и похоронен суфий, наставник и просветитель Бекет-ата (1750–1813), поэтому сюда приезжает много паломников.",
      "The Beket Ata underground mosque is a holy site in Mangystau, carved into a chalk cliff at Oglandy. The Sufi teacher and educator Beket Ata (1750–1813) taught his students here and is buried here, so many pilgrims come to visit."
    ),
  },

  // Павлодар облысы
  "Bayanaul": {
    kind: "rocks",
    text: L(
      "Баянауыл — 1985 жылы құрылған Қазақстандағы алғашқы ұлттық парк, ол Павлодар даласының ортасындағы таулы өлке. Жел мен су мүсіндеген гранит жартастары аңдар мен адам бейнелеріне ұқсайды, ал демалушыларды Жасыбай, Сабындыкөл, Торайғыр көлдері тартады.",
      "Баянаул — первый национальный парк Казахстана, созданный в 1985 году среди павлодарских степей. Гранитные скалы, обточенные ветром и водой, похожи на зверей и людей, а отдыхающих привлекают озёра Жасыбай, Сабындыколь и Торайгыр.",
      "Bayanaul, founded in 1985, is Kazakhstan's first national park, a hilly island in the Pavlodar steppe. Its granite rocks, shaped by wind and water, look like animals and faces, and visitors come for lakes such as Zhasybay, Sabyndykol and Toraigyr."
    ),
  },
  "Irtysh River": {
    kind: "river",
    text: L(
      "Ертіс — Қытайдағы Алтай тауларынан басталып, Зайсан көлі арқылы өтетін, ұзындығы шамамен 4248 шақырым өзен. Оның бойында Өскемен, Семей және Павлодар қалалары тұр, ал Ресейде Ертіс Обь өзеніне құяды.",
      "Иртыш — река длиной около 4248 км, которая начинается в горах Алтая в Китае и проходит через озеро Зайсан. На ней стоят Усть-Каменогорск, Семей и Павлодар, а в России Иртыш впадает в Обь.",
      "The Irtysh is a river about 4,248 km long that rises in the Altai Mountains of China and flows through Lake Zaysan. Oskemen, Semey and Pavlodar stand on its banks, and in Russia it joins the Ob."
    ),
  },

  // Солтүстік Қазақстан облысы
  "Botai settlement": {
    kind: "ancient",
    text: L(
      "Ботай — шамамен 5500 жыл бұрынғы қоныс, мұнда табылған жануар сүйектерінің басым бөлігі жылқынікі. Құмыралардан табылған бие сүтінің іздері мұнда адамдар жылқыны алғашқылардың бірі болып пайдаланғанын көрсетеді, бірақ бұл жылқылардың қаншалық қолға үйретілгені туралы ғалымдар әлі де пікірталасуда.",
      "Ботай — поселение возрастом около 5500 лет, где почти все найденные кости животных принадлежат лошадям. Следы кобыльего молока в посуде говорят о том, что здесь одними из первых стали использовать лошадей, хотя учёные до сих пор спорят, насколько они были приручены.",
      "Botai is a settlement about 5,500 years old where almost all the animal bones found belong to horses. Traces of mare's milk in its pots suggest people here were among the first to use horses, though scientists still debate how tame these horses were."
    ),
  },
  "Ishim River": {
    kind: "river",
    text: L(
      "Есіл — Сарыарқа қыраттарынан басталатын, ұзындығы шамамен 2450 шақырым өзен. Ол Астана мен Петропавл арқылы ағып өтеді де, Ресейде Ертіске құяды.",
      "Ишим, или Есиль, — река длиной около 2450 км, которая берёт начало в Казахском мелкосопочнике. Она протекает через Астану и Петропавловск, а в России впадает в Иртыш.",
      "The Ishim, called Yesil in Kazakh, is a river about 2,450 km long that rises in the Kazakh Uplands. It flows through Astana and Petropavl before joining the Irtysh in Russia."
    ),
  },

  // Түркістан облысы
  "Mausoleum of Khoja Ahmed Yasawi": {
    kind: "mausoleum",
    text: L(
      "Қожа Ахмет Ясауи кесенесі XII ғасырда өмір сүрген әйгілі сопы ақынның басына Әмір Темірдің бұйрығымен 1389 жылы салына бастады. Диаметрі 18,2 метр күмбезі — Орталық Азиядағы сақталған ең үлкен кірпіш күмбез, ал 2003 жылы кесене ЮНЕСКО-ның Бүкіләлемдік мұра тізіміне енді.",
      "Мавзолей Ходжи Ахмеда Ясави начали строить в 1389 году по приказу Тимура над могилой знаменитого суфийского поэта XII века. Его купол диаметром 18,2 метра — крупнейший сохранившийся кирпичный купол Центральной Азии, а в 2003 году мавзолей вошёл в список Всемирного наследия ЮНЕСКО.",
      "Work on the Mausoleum of Khoja Ahmed Yasawi began in 1389 on Timur's orders, over the grave of a famous 12th-century Sufi poet. Its 18.2-metre dome is the largest surviving brick dome in Central Asia, and it became a UNESCO World Heritage Site in 2003."
    ),
  },
  "Aksu-Zhabagly": {
    kind: "peaks",
    text: L(
      "Ақсу-Жабағылы — 1926 жылы Батыс Тянь-Шаньда құрылған, Орталық Азиядағы ең көне қорық. Көктемде мұнда Грейг қызғалдағы сияқты жабайы қызғалдақтар гүлдейді, ал Ақсу өзенінің шатқалы шамамен 500 метр тереңдікке жетеді.",
      "Аксу-Жабаглы — старейший заповедник Центральной Азии, созданный в 1926 году в Западном Тянь-Шане. Весной здесь цветут дикие тюльпаны, например тюльпан Грейга, а каньон реки Аксу достигает глубины около 500 метров.",
      "Aksu-Zhabagly, founded in 1926 in the Western Tian Shan, is the oldest nature reserve in Central Asia. In spring wild tulips such as Greig's tulip bloom here, and the canyon of the Aksu River is about 500 metres deep."
    ),
  },

  // Ұлытау облысы
  "Ulytau mountains": {
    kind: "peaks",
    text: L(
      "Ұлытау — Сарыарқаның қақ ортасындағы, ұзындығы шамамен 200 шақырым аласа таулар, ең биік нүктесі — шамамен 1130 метрлік Ақмешіт тауы. Бұл өлке қазақ тарихында ерекше орын алады: маңында Жошы хан мен Алаша хан кесенелері тұр.",
      "Улытау — невысокие горы длиной около 200 км в самом центре Сарыарки, высшая точка — гора Акмешит, около 1130 метров. Этот край занимает особое место в истории казахов: рядом стоят мавзолеи Джучи-хана и Алаша-хана.",
      "The Ulytau are low mountains about 200 km long in the very centre of the Saryarka steppe, rising to about 1,130 metres at Mount Akmeshit. The area holds a special place in Kazakh history, with the mausoleums of Jochi Khan and Alasha Khan nearby."
    ),
  },
  "Jochi Khan Mausoleum": {
    kind: "mausoleum",
    text: L(
      "Жошы хан кесенесі Қаракеңгір өзенінің жағасында, Жезқазғаннан шамамен 50 шақырым жерде тұр. Дәстүр бойынша мұнда Шыңғыс ханның үлкен ұлы Жошы жерленген, ал ғалымдар ғимаратты XIII–XIV ғасырларға жатқызады.",
      "Мавзолей Джучи-хана стоит на берегу реки Каракенгир, примерно в 50 км от Жезказгана. По преданию, здесь похоронен Джучи, старший сын Чингисхана, а учёные относят здание к XIII–XIV векам.",
      "The Jochi Khan Mausoleum stands on the Kara-Kengir River, about 50 km from Zhezkazgan. Tradition says Jochi, the eldest son of Genghis Khan, is buried here, and scholars date the building to the 13th or 14th century."
    ),
  },

  // Батыс Қазақстан облысы
  "Bukey Horde": {
    kind: "horde",
    text: L(
      "Бөкей Ордасы — 1801 жылы Бөкей сұлтан негізін қалаған, Жайық пен Еділ арасындағы қазақ хандығы. Оның орталығы Хан Ордасы болды, ал 1836–1838 жылдары мұнда Исатай Тайманұлы мен ақын Махамбет Өтемісұлы бастаған көтеріліс болды.",
      "Бокеевская Орда — казахское ханство между Уралом и Волгой, основанное султаном Букеем в 1801 году. Её центром была Ханская Ставка, а в 1836–1838 годах здесь прошло восстание под руководством Исатая Тайманулы и поэта Махамбета Утемисулы.",
      "The Bukey Horde was a Kazakh khanate between the Ural and Volga rivers, founded by Sultan Bukey in 1801. Its centre was Khan Ordasy, and from 1836 to 1838 it saw an uprising led by Isatay Taimanuly and the poet Makhambet Utemisuly."
    ),
  },

  // Шығыс Қазақстан облысы
  "Mount Belukha": {
    kind: "snowPeak",
    text: L(
      "Мұзтау, яғни Белуха — биіктігі 4506 метр, Алтай тауларының ең биік шыңы. Ол Қазақстан мен Ресейдің шекарасында тұр, оның екі ұшар басы бар, ал беткейлерін ірі мұздықтар басып жатыр.",
      "Белуха, или Мұзтау, — высочайшая вершина Алтая высотой 4506 метров. Она стоит на границе Казахстана и России, у неё две вершины, а склоны покрыты большими ледниками.",
      "Mount Belukha, called Muztau in Kazakh, is the highest peak of the Altai at 4,506 metres. It stands on the border of Kazakhstan and Russia, has two summits, and its slopes are covered with large glaciers."
    ),
  },
  "Lake Markakol": {
    kind: "mountainLake",
    text: L(
      "Марқакөл — Оңтүстік Алтайдағы, теңіз деңгейінен шамамен 1450 метр биіктікте жатқан үлкен тау көлі. 1976 жылдан бері ол қорық құрамында, ал көлде ұскуч (ленок) пен хариус балықтары мекендейді.",
      "Маркаколь — большое горное озеро на Южном Алтае, на высоте около 1450 метров над уровнем моря. С 1976 года оно входит в заповедник, а в его воде водятся ускуч (ленок) и хариус.",
      "Markakol is a large mountain lake in the Southern Altai, about 1,450 metres above sea level. Since 1976 it has been part of a nature reserve, and its waters are home to the uskuch (lenok) and grayling."
    ),
  },
};

export const REGION_ABOUT = {
  astana: L(
    "Астана Сарыарқа даласында, Есіл өзенінің екі жағасында орналасқан. 1997 жылдан бері елорда болған қала батыл заманауи сәулетімен танымал, ал 2017 жылы мұнда халықаралық ЭКСПО көрмесі өтті. Қысы ұзақ әрі аязды, ал жазда жасыл саябақтар мен Есіл жағалауындағы кешкі серуендер есте қалады.",
    "Астана стоит в степи Сарыарки, на обоих берегах реки Есиль. С 1997 года это столица Казахстана, город известен смелой современной архитектурой, а в 2017 году здесь прошла международная выставка ЭКСПО. Зимы здесь долгие и морозные, а летом запоминаются зелёные парки и вечерние прогулки по набережной.",
    "Astana lies in the Saryarka steppe on both banks of the Yesil River. The capital of Kazakhstan since 1997, it is known for bold modern architecture and hosted the international EXPO in 2017. Winters are long and frosty, while summer brings green parks and evening walks along the river."
  ),
  "almaty-city": L(
    "Алматы Іле Алатауының етегінде, қарлы шыңдардың дәл түбінде орналасқан. Ол 1997 жылға дейін елорда болған, ал қазір елдің ең ірі қаласы әрі іскерлік және мәдени орталығы. Қала маңындағы тауларда біз жейтін алманың арғы атасы — жабайы Сиверс алмасы әлі де өседі.",
    "Алматы лежит у подножия Заилийского Алатау, прямо под снежными вершинами. До 1997 года город был столицей, а сегодня это крупнейший город страны, её деловой и культурный центр. В горах вокруг до сих пор растёт дикая яблоня Сиверса — предок привычных нам яблок.",
    "Almaty sits at the foot of the Trans-Ili Alatau, right below snowy peaks. It was the capital until 1997 and is now the country's largest city and its business and cultural hub. The wild Sievers apple, ancestor of the apples we eat today, still grows in the mountains around it."
  ),
  shymkent: L(
    "Шымкент — Қазақстанның оңтүстігіндегі, жазы ұзақ әрі ыстық ірі қала. Ол Жібек жолындағы Сайрамды қорғайтын керуен сарайдан өсіп шыққан, ал атауы «шым» және «кент», яғни қала сөздерімен байланыстырылады. Қонақтардың есінде у-шулы базарлар, мол жеміс-жидек және оңтүстіктің кең пейілді қонақжайлығы қалады.",
    "Шымкент — крупный город на юге Казахстана с долгим жарким летом. Он вырос из караван-сарая, охранявшего Сайрам на Шёлковом пути, а его название связывают со словами «шым» (дёрн) и «кент» (город). Гостям запоминаются шумные базары, горы фруктов и щедрое южное гостеприимство.",
    "Shymkent is a large city in the south of Kazakhstan with long, hot summers. It grew from a caravanserai that guarded Sayram on the Silk Road, and its name is linked to the words for turf and town. Visitors remember its busy bazaars, piles of fruit and warm southern hospitality."
  ),
  akmola: L(
    "Ақмола облысы — Қазақстанның солтүстігіндегі кең дала, онда Көкшетау қыраттары мен көптеген көлдер бар. Облыс бидай өсірумен танымал, ал оның орталығы — Көкшетау қаласы. Саяхатшыларды қарағайлы Бурабай мен фламинголар мекендейтін Қорғалжын көлдері тартады.",
    "Акмолинская область — широкая степь на севере Казахстана с Кокшетаускими возвышенностями и множеством озёр. Регион известен выращиванием пшеницы, а его центр — город Кокшетау. Путешественников манят сосновый Бурабай и озёра Коргалжына, где живут фламинго.",
    "Akmola Region is a wide stretch of northern steppe dotted with the lakes and hills of Kokshetau. It is known for growing wheat, and its centre is the city of Kokshetau. Travellers come for the pine forests of Burabay and the flamingo lakes of Korgalzhyn."
  ),
  aktobe: L(
    "Ақтөбе облысы — Қазақстанның солтүстік-батысындағы дала, шөлейт пен аласа Мұғалжар таулары бар өлке. Облыс мұнай, газ және хроммен танымал, хром кені Хромтау қаласының маңында өндіріледі. Ақтөбе қаласы Елек өзенінің бойында тұр, ал далада жел мен шексіз кеңістік есте қалады.",
    "Актюбинская область лежит на северо-западе Казахстана: это степи, полупустыни и невысокие горы Мугалжары. Регион известен нефтью, газом и хромом — хромовую руду добывают у города Хромтау. Сам Актобе стоит на реке Илек, а в степи запоминаются ветер и бескрайний простор.",
    "Aktobe Region in north-western Kazakhstan is a land of steppe, semi-desert and the low Mugalzhar hills. It is known for oil, gas and chromium, which is mined near the town of Khromtau. Aktobe city stands on the Ilek River, and out in the steppe visitors remember the wind and the endless space."
  ),
  "almaty-reg": L(
    "Алматы облысы Іле және Күнгей Алатауының баурайынан Іле өзенінің алқабына дейін созылады. Облыс бау-бақшасы мен егіншілігімен танымал, ал оның орталығы — Қапшағай су қоймасының жағасындағы Қонаев қаласы. Мұнда Шарын шатқалы мен Көлсай көлдері сияқты еліміздің ең әсем табиғат орындары бар.",
    "Алматинская область тянется от склонов Заилийского и Кунгей Алатау до долины реки Или. Она славится садами и земледелием, а её центр — город Конаев на берегу Капшагайского водохранилища. Здесь находятся одни из самых красивых мест страны — Чарынский каньон и Кольсайские озёра.",
    "Almaty Region stretches from the slopes of the Trans-Ili and Kungey Alatau down to the Ili River valley. It is known for orchards and farming, and its centre is Konaev on the shore of the Kapchagay reservoir. Some of the country's most beautiful places are here, including Charyn Canyon and the Kolsai Lakes."
  ),
  atyrau: L(
    "Атырау облысы Каспий теңізінің солтүстік жағалауында, жартылай мұхит деңгейінен төмен жатқан ойпатта орналасқан. Өлке Теңіз сияқты ірі мұнай кен орындарымен және Жайық пен Каспийдің бекіре балықтарымен танымал. Атырау қаласы Жайықтың екі жағасында тұр, сондықтан мұнда көпір арқылы Еуропадан Азияға жаяу өтуге болады.",
    "Атырауская область лежит на северном побережье Каспия, в низменности, местами ниже уровня океана. Край известен крупными нефтяными месторождениями, такими как Тенгиз, и осетровыми рыбами Урала и Каспия. Атырау стоит на двух берегах Урала, поэтому здесь можно пешком перейти по мосту из Европы в Азию.",
    "Atyrau Region lies on the northern shore of the Caspian Sea, in a lowland partly below ocean level. It is known for big oil fields such as Tengiz and for the sturgeon of the Ural and the Caspian. Atyrau city spans both banks of the Ural, so you can walk across a bridge from Europe to Asia."
  ),
  abai: L(
    "Абай облысы Ертіс өзенінің жағасынан Шыңғыстау тауларына дейін созылады, оның орталығы — Семей қаласы. Бұл — Абай, Шәкәрім, Мұхтар Әуезов сияқты қазақ әдебиетінің ұлы тұлғаларының туған өлкесі. Өлке тарихында ауыр парақ та бар: 1991 жылы 29 тамызда жабылған Семей ядролық сынақ полигоны.",
    "Абайская область раскинулась от берегов Иртыша до гор Чингистау, её центр — город Семей. Это родина великих деятелей казахской литературы — Абая, Шакарима и Мухтара Ауэзова. В истории края есть и тяжёлая страница — Семипалатинский ядерный полигон, закрытый 29 августа 1991 года.",
    "Abai Region stretches from the Irtysh River to the Shyngystau hills, with Semey as its centre. It is the homeland of great figures of Kazakh literature, including Abai, Shakarim and Mukhtar Auezov. Its history also has a dark page: the Semipalatinsk nuclear test site, closed on 29 August 1991."
  ),
  zhambyl: L(
    "Жамбыл облысы Қазақстанның оңтүстігінде, Қаратау мен Қырғыз Алатауы аралығында, Талас пен Шу өзендерінің бойында жатыр. Облыс ақын Жамбыл Жабаевтың атымен аталған, ал оның орталығы — Ұлы Жібек жолындағы ежелгі Тараз. Мұнда Айша бибі сияқты көне кесенелер мен ортағасырлық қалалардың орындары көп.",
    "Жамбылская область лежит на юге Казахстана, между горами Каратау и Киргизским Алатау, в долинах рек Талас и Шу. Она названа в честь акына Жамбыла Жабаева, а её центр — древний Тараз на Великом Шёлковом пути. Здесь много старинных мавзолеев, таких как Айша-биби, и остатков средневековых городов.",
    "Zhambyl Region lies in southern Kazakhstan between the Karatau and Kyrgyz Alatau mountains, along the Talas and Shu rivers. It is named after the poet Zhambyl Zhabayev, and its centre is ancient Taraz on the Great Silk Road. It is rich in old mausoleums such as Aisha Bibi and in the ruins of medieval towns."
  ),
  zhetysu: L(
    "Жетісу облысы Іле өзенінің алқабынан Жетісу (Жоңғар) Алатауының қарлы шыңдарына дейін созылады. Атауы «жеті су», яғни жеті өзен деген мағына береді, ал облыс орталығы — Талдықорған қаласы. Саяхатшылардың есінде Алтынемелдегі Әнші бархан мен құландар, тау шатқалдары мен бау-бақшалар қалады.",
    "Область Жетысу тянется от долины реки Или до снежных вершин Жетысуского (Джунгарского) Алатау. Её название означает «семь вод», то есть семь рек, а центр области — город Талдыкорган. Путешественникам запоминаются Поющий бархан и куланы Алтын-Эмеля, горные ущелья и сады.",
    "Zhetysu Region stretches from the Ili River valley up to the snowy peaks of the Zhetysu (Dzungarian) Alatau. Its name means seven waters, or seven rivers, and its centre is the city of Taldykorgan. Visitors remember the Singing Dune and the kulans of Altyn-Emel, the mountain gorges and the orchards."
  ),
  karaganda: L(
    "Қарағанды облысы Сарыарқаның ортасында, дала мен аласа таулардың арасында жатыр, ал оңтүстігінде Балқаш көліне жетеді. Өлке көмір кеніштерімен және металлургиясымен танымал: Теміртауда болат, Балқашта мыс өндіріледі. Демалуға адамдар қарағайлы Қарқаралы тауларына және Балқаштың жағасына барады.",
    "Карагандинская область лежит в центре Сарыарки, среди степей и невысоких гор, и на юге доходит до озера Балхаш. Регион известен угольными шахтами и металлургией: в Темиртау выплавляют сталь, а в Балхаше — медь. Отдыхать сюда едут в сосновые горы Каркаралы и на берег Балхаша.",
    "Karaganda Region lies in the heart of the Saryarka steppe, among low hills, and reaches Lake Balkhash in the south. It is known for coal mines and metal-making: steel is produced in Temirtau and copper in Balkhash. For holidays people head to the pine-covered Karkaraly hills and the shores of Lake Balkhash."
  ),
  kostanay: L(
    "Қостанай облысы Қазақстанның солтүстігінде, Торғай үстірті мен Тобыл өзенінің бойында орналасқан. 1950 жылдары тың игеру кезінде мұнда ұланғайыр дала жыртылып, облыс елдің басты астықты өңірлерінің біріне айналды. Мұнда темір кені де өндіріледі, ал саяхатшылар дала ортасындағы қарағайлы Наурызым қорығына барады.",
    "Костанайская область лежит на севере Казахстана, на Тургайском плато и в долине Тобола. В 1950-е годы, во время освоения целины, здесь распахали огромные степи, и край стал одним из главных зерновых регионов страны. Здесь также добывают железную руду, а путешественники едут в Наурзум — сосновый бор посреди степи.",
    "Kostanay Region lies in northern Kazakhstan, on the Turgay Plateau and along the Tobol River. During the Virgin Lands campaign of the 1950s vast areas of steppe were ploughed here, and it became one of the country's main grain regions. Iron ore is also mined here, and travellers visit Naurzum, a pine forest in the middle of the steppe."
  ),
  kyzylorda: L(
    "Қызылорда облысы — Сырдарияның төменгі ағысындағы, Арал теңізіне дейін созылған шөл мен дала өлкесі. Мұнда күріш өсіріледі, ал 1920 жылдары Қызылорда Қазақ АКСР-інің астанасы болған. Облыстағы Байқоңыр ғарыш айлағы мен тартылып бара жатқан Арал теңізі бүкіл әлемге белгілі.",
    "Кызылординская область — край пустынь и степей в низовьях Сырдарьи, доходящий до Аральского моря. Здесь выращивают рис, а в 1920-е годы Кызылорда была столицей Казахской АССР. Всему миру известны здешний космодром Байконур и обмелевшее Аральское море.",
    "Kyzylorda Region is a land of desert and steppe along the lower Syr Darya, reaching all the way to the Aral Sea. Rice is grown here, and in the 1920s Kyzylorda was the capital of the Kazakh ASSR. It is world-famous for the Baikonur spaceport and the shrinking Aral Sea."
  ),
  mangystau: L(
    "Маңғыстау облысы Каспий теңізінің шығыс жағалауындағы шөлді Маңғыстау түбегі мен Үстірт қыратын алып жатыр, оның орталығы — Ақтау қаласы. Өлке мұнай мен газымен, ақ бор жартастарымен және жерасты мешіттерімен танымал. Мұнда Қазақстанның ең төменгі нүктесі — теңіз деңгейінен шамамен 132 метр төмен жатқан Қарақия ойпаты бар.",
    "Мангистауская область занимает пустынный полуостров Мангышлак и плато Устюрт на восточном берегу Каспия, её центр — город Актау. Край известен нефтью и газом, белыми меловыми скалами и подземными мечетями. Здесь находится самая низкая точка Казахстана — впадина Карагие, около 132 метров ниже уровня моря.",
    "Mangystau Region covers the desert Mangyshlak Peninsula and the Ustyurt Plateau on the eastern shore of the Caspian Sea, with Aktau as its centre. It is known for oil and gas, white chalk cliffs and underground mosques. The lowest point in Kazakhstan, the Karagiye Depression, about 132 metres below sea level, is here."
  ),
  pavlodar: L(
    "Павлодар облысы Қазақстанның солтүстік-шығысында, Ертіс өзенінің екі жағасындағы далада орналасқан. Облыс Екібастұздың көмірімен, электр станцияларымен, алюминий және мұнай өңдеу зауыттарымен танымал. Дала ортасындағы Баянауылдың гранит жартастары мен мөлдір көлдері саяхатшыларды таң қалдырады.",
    "Павлодарская область лежит на северо-востоке Казахстана, в степях по обоим берегам Иртыша. Регион известен углём Экибастуза, электростанциями, алюминиевым и нефтеперерабатывающим заводами. Путешественников удивляют гранитные скалы и чистые озёра Баянаула посреди степи.",
    "Pavlodar Region lies in north-eastern Kazakhstan, in the steppe on both banks of the Irtysh. It is known for Ekibastuz coal, power stations and its aluminium and oil-refining plants. Travellers are surprised by the granite rocks and clear lakes of Bayanaul in the middle of the steppe."
  ),
  "north-kz": L(
    "Солтүстік Қазақстан облысы — еліміздің ең солтүстіктегі өңірі, қайың тоғайлары мен көптеген көлдері бар орманды дала. Облыс бидай мен басқа да дәнді дақылдарымен танымал, ал оның орталығы Петропавл Есіл өзенінің жағасында тұр. Қысы ұзақ әрі қатты аязды, ал Ботай қонысы жылқы өсірудің көне тарихын еске салады.",
    "Северо-Казахстанская область — самый северный регион страны, лесостепь с берёзовыми рощами и множеством озёр. Край известен пшеницей и другими зерновыми, а его центр, Петропавловск, стоит на реке Ишим. Зимы здесь долгие и морозные, а поселение Ботай напоминает о древней истории коневодства.",
    "North Kazakhstan Region is the country's northernmost region, a forest-steppe of birch groves and many lakes. It is known for wheat and other grains, and its centre, Petropavl, stands on the Ishim River. Winters are long and very cold, and the Botai settlement recalls the ancient history of horse herding."
  ),
  turkistan: L(
    "Түркістан облысы Қазақстанның оңтүстігінде, Сырдария алқабы мен Қаратау және Батыс Тянь-Шань таулары аралығында жатыр. Түркістан қаласы ертеден рухани орталық болған, Қожа Ахмет Ясауи кесенесінде көптеген қазақ хандары мен батырлары, соның ішінде Абылай хан жерленген. Көктемде тауларда жабайы қызғалдақтар гүлдейді, ал Отырар сияқты көне қалалардың орындары өткенді еске салады.",
    "Туркестанская область лежит на юге Казахстана, между долиной Сырдарьи и горами Каратау и Западного Тянь-Шаня. Город Туркестан издавна был духовным центром, и в мавзолее Ходжи Ахмеда Ясави похоронены многие казахские ханы и батыры, в том числе Абылай-хан. Весной в горах цветут дикие тюльпаны, а руины древних городов, таких как Отрар, напоминают о прошлом.",
    "Turkistan Region lies in southern Kazakhstan, between the Syr Darya valley and the Karatau and Western Tian Shan mountains. Turkistan city has long been a spiritual centre, and many Kazakh khans and heroes, including Abylai Khan, are buried at the Mausoleum of Khoja Ahmed Yasawi. In spring wild tulips bloom in the mountains, and the ruins of ancient towns such as Otrar recall the past."
  ),
  ulytau: L(
    "Ұлытау облысы Сарыарқаның қақ ортасында, шексіз дала мен Ұлытау тауларының арасында жатыр, оның орталығы — Жезқазған қаласы. Өлке мыс кендерімен танымал: Жезқазған кен орнын геолог Қаныш Сәтбаев зерттеп, әлемге танытқан. Мұнда Жошы хан мен Алаша хан кесенелері сияқты қазақ тарихының маңызды ескерткіштері бар.",
    "Улытауская область лежит в самом центре Сарыарки, среди бескрайних степей и гор Улытау, её центр — Жезказган. Край известен медью: Жезказганское месторождение изучил и прославил геолог Каныш Сатпаев. Здесь стоят важные памятники казахской истории — мавзолеи Джучи-хана и Алаша-хана.",
    "Ulytau Region lies in the very heart of the Saryarka steppe, among endless plains and the Ulytau hills, with Zhezkazgan as its centre. It is known for copper: the geologist Kanysh Satpayev explored the Zhezkazgan deposit and made it famous. Important monuments of Kazakh history stand here, such as the mausoleums of Jochi Khan and Alasha Khan."
  ),
  "west-kz": L(
    "Батыс Қазақстан облысы Жайық өзенінің екі жағасындағы далада, Еуропа мен Азия түйісетін жерде орналасқан. Облыс Қарашығанақ мұнай-газ конденсаты кен орнымен және Бөкей Ордасының тарихымен танымал. Орал қаласының негізі 1613 жылы қаланған, ал 1833 жылы мұнда Пугачев көтерілісі туралы деректер жинау үшін Александр Пушкин келген.",
    "Западно-Казахстанская область раскинулась в степях по обоим берегам Урала, там, где встречаются Европа и Азия. Она известна нефтегазоконденсатным месторождением Карачаганак и историей Бокеевской Орды. Уральск основан в 1613 году, а в 1833 году сюда приезжал Александр Пушкин, собиравший материалы о восстании Пугачёва.",
    "West Kazakhstan Region spreads across the steppe on both banks of the Ural River, where Europe meets Asia. It is known for the Karachaganak oil and gas field and for the history of the Bukey Horde. Oral was founded in 1613, and in 1833 Alexander Pushkin came here to gather material about Pugachev's rebellion."
  ),
  "east-kz": L(
    "Шығыс Қазақстан облысы Алтай тауларының етегінде, Ертіс өзенінің жоғарғы ағысында орналасқан, оның орталығы — Өскемен қаласы. Өлке түсті металдарымен, ормандарымен, марал шаруашылығымен және Алтай балымен танымал. Мұнда Алтайдың ең биік шыңы Мұзтау (Белуха) мен таулар арасындағы Марқакөл көлі бар.",
    "Восточно-Казахстанская область лежит у подножия Алтая, в верховьях Иртыша, её центр — Усть-Каменогорск. Край известен цветными металлами, лесами, мараловодством и алтайским мёдом. Здесь находятся высочайшая вершина Алтая — Белуха — и горное озеро Маркаколь.",
    "East Kazakhstan Region lies at the foot of the Altai Mountains on the upper Irtysh, with Oskemen as its centre. It is known for non-ferrous metals, forests, maral deer farming and Altai honey. Here you will find Belukha, the highest peak of the Altai, and the mountain lake Markakol."
  ),
};
