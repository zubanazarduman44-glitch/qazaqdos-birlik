// «Жәдігерлер галереясы» — Тарих бетіндегі цифрлық музей.
// Әр жәдігер: атауы, кезеңі, табылған жері, сақталған жері, материалы, қысқа сипаттамасы,
// толық мәліметі және тарихи маңызы (kk / ru / en; басқа тілдерде — ағылшынша).
// site — lib/history.js ішіндегі SITES id (сәйкес тарихи орынмен байланыс).
// model — app/components/artifacts3d/models/<model>.js 3D құрастырушысы.
const L = (kk, ru, en) => ({ kk, ru, en });

export const ARTIFACTS = [
  {
    id: "goldman", model: "goldman", site: "issyk", year: -450, tone: "gold",
    name: L("Алтын адамның бас киімі", "Головной убор Золотого человека", "Golden Man's headdress"),
    period: L("Сақ дәуірі, б.з.д. V–IV ғасырлар", "Сакская эпоха, V–IV вв. до н. э.", "Saka era, 5th–4th c. BC"),
    place: L("Есік қорғаны, Алматы облысы (1969–1970)", "Иссыкский курган, Алматинская область (1969–1970)", "Issyk kurgan, Almaty Region (1969–1970)"),
    museum: L("Қалпына келтірілген нұсқасы — ҚР Ұлттық музейінде (Астана)", "Реконструкция — в Национальном музее РК (Астана)", "Reconstruction: National Museum of Kazakhstan, Astana"),
    material: L("Киіз, алтын тақташалар", "Войлок, золотые пластины", "Felt, gold plaques"),
    short: L(
      "Биіктігі 65 сантиметрдей сүйір бөрік. Оны қанатты тұлпарлар, алтын жебелер мен тау бейнелі тақташалар безендіреді, ұшында — алтын арқар мүсіншесі.",
      "Островерхий убор высотой около 65 см. Его украшают крылатые кони, золотые стрелы и пластины в виде гор, а на вершине стоит фигурка архара.",
      "A pointed cap about 65 cm tall, decorated with winged horses, gold arrows and mountain-shaped plaques, crowned by a small gold argali."
    ),
    details: L(
      "Есік қорғанын археолог Кемал Ақышев зерттеді. Жас сақ жауынгерінің киімі мен қаруы төрт мыңнан астам алтын бұйыммен әшекейленген екен. Бас киімдегі әр бейненің мәні бар: тау — әлемнің ортасы, құс — көк аспан, тұлпар мен арқар — күш пен қасиеттің белгісі.",
      "Иссыкский курган исследовал археолог Кемаль Акишев. Одежда и оружие молодого сакского воина были украшены более чем четырьмя тысячами золотых деталей. Каждый образ на уборе значим: гора — центр мира, птица — небо, конь и архар — сила и святость.",
      "The Issyk kurgan was excavated by archaeologist Kemal Akishev. The young Saka warrior's clothing and weapons carried more than four thousand gold pieces. Every image on the cap has meaning: the mountain is the centre of the world, the bird is the sky, the horse and argali stand for strength and sanctity."
    ),
    sig: L(
      "«Алтын адам» Қазақстан тәуелсіздігінің рәміздерінің біріне айналды: оның бейнесі Алматыдағы Тәуелсіздік монументінің ұшында тұр.",
      "«Золотой человек» стал одним из символов независимого Казахстана: его фигура венчает монумент Независимости в Алматы.",
      "The Golden Man became a symbol of independent Kazakhstan: his figure crowns the Independence Monument in Almaty."
    ),
  },
  {
    id: "deer", model: "deer", site: "berel", year: -700, tone: "gold",
    name: L("Шіліктінің алтын бұғысы", "Золотой олень из Шиликты", "Golden deer of Shilikty"),
    period: L("Ерте сақ дәуірі, б.з.д. VIII–VII ғасырлар", "Раннесакская эпоха, VIII–VII вв. до н. э.", "Early Saka era, 8th–7th c. BC"),
    place: L("Шілікті алқабы, Бәйгетөбе қорғаны, Шығыс Қазақстан (2003)", "Долина Шиликты, курган Байгетобе, Восточный Казахстан (2003)", "Shilikty valley, Baigetobe kurgan, East Kazakhstan (2003)"),
    museum: L("ҚР Ұлттық музейі, Астана", "Национальный музей РК, Астана", "National Museum of Kazakhstan, Astana"),
    material: L("Алтын", "Золото", "Gold"),
    short: L(
      "Аяғын бауырына бүгіп жатқан бұғы бейнелі алтын қапсырма. Мүйізі арқасын бойлай толқын сияқты созылып жатыр.",
      "Золотая бляха в виде оленя с подогнутыми ногами. Его рога волнами тянутся вдоль всей спины.",
      "A gold plaque of a deer with its legs folded beneath it; the antlers run in waves along its back."
    ),
    details: L(
      "Бұл — «аң стилінің» үздік үлгісі. Сақ шеберлері жануарды бір қимылдың ішінде, қарапайым әрі әсерлі етіп бейнелеген. Бәйгетөбе қорғанын Әбдеш Төлеубаев зерттеп, мұнан төрт мыңдай алтын бұйым тапты.",
      "Это образец «звериного стиля»: сакские мастера изображали животное в одном движении — просто и выразительно. Курган Байгетобе исследовал Абдеш Толеубаев и нашёл здесь около четырёх тысяч золотых изделий.",
      "This is a fine example of the 'animal style': Saka craftsmen showed the animal in a single, simple and expressive pose. Abdesh Toleubayev excavated the Baigetobe kurgan and found about four thousand gold objects there."
    ),
    sig: L(
      "Бұғы сақтар үшін күн мен көктің, жаңарудың белгісі болған. Бұл олжа Шілікті алқабын «Сақ патшаларының аңғары» деп атауға негіз болды.",
      "Олень был для саков знаком солнца, неба и обновления. Находка подтвердила, что Шиликты — «долина сакских царей».",
      "For the Saka the deer symbolised the sun, the sky and renewal. The find confirmed Shilikty as a 'valley of Saka kings'."
    ),
  },
  {
    id: "berel", model: "berel", site: "berel", year: -300, tone: "gold",
    name: L("Берелдің мүйізді жылқы бетпердесі", "Рогатая маска коня из Берела", "Horned horse mask from Berel"),
    period: L("Сақ дәуірі, б.з.д. IV–III ғасырлар", "Сакская эпоха, IV–III вв. до н. э.", "Saka era, 4th–3rd c. BC"),
    place: L("Берел қорғандары, Алтай, Шығыс Қазақстан (1998)", "Курганы Берел, Алтай, Восточный Казахстан (1998)", "Berel kurgans, Altai, East Kazakhstan (1998)"),
    museum: L("ҚР Ұлттық музейі, Астана", "Национальный музей РК, Астана", "National Museum of Kazakhstan, Astana"),
    material: L("Ағаш, былғары, алтын жапырақ", "Дерево, кожа, сусальное золото", "Wood, leather, gold leaf"),
    short: L(
      "Ағаштан ойылып, алтын жапырақпен қапталған жылқы бетпердесі. Оған тау ешкісінің үлкен қырлы мүйіздері бекітілген.",
      "Маска коня, вырезанная из дерева и покрытая золотым листом. К ней прикреплены большие ребристые рога горного козла.",
      "A horse mask carved from wood and covered in gold leaf, fitted with the large ridged horns of a mountain ibex."
    ),
    details: L(
      "Берелдің 11-қорғанын Зейнолла Самашев зерттеді. Мәңгі тоңның арқасында ағаш, былғары, киіз және жылқылардың өзі де жақсы сақталған. Көсеммен бірге ер-тұрманы толық он үш жылқы жерленген.",
      "Курган №11 Берела исследовал Зайнолла Самашев. Благодаря вечной мерзлоте сохранились дерево, кожа, войлок и даже сами лошади. Вместе с вождём были погребены тринадцать коней в полной сбруе.",
      "Berel kurgan No. 11 was excavated by Zainolla Samashev. Thanks to permafrost, wood, leather, felt and even the horses themselves survived. Thirteen horses in full harness were buried with the chief."
    ),
    sig: L(
      "Мүйізді бетперде жылқыны киелі аңға — тау ешкісіне айналдырып, көсемнің рухын о дүниеге апарады деп сенген.",
      "Рогатая маска превращала коня в священного горного козла, который, как верили, уносил душу вождя в иной мир.",
      "The horned mask turned the horse into a sacred ibex, believed to carry the chief's soul to the other world."
    ),
  },
  {
    id: "botai", model: "botai", site: "botai", year: -3500, tone: "clay",
    name: L("Ботай қыш құмырасы", "Ботайский глиняный сосуд", "Botai clay pot"),
    period: L("Энеолит, б.з.д. 3500 жыл шамасы", "Энеолит, около 3500 г. до н. э.", "Eneolithic, c. 3500 BC"),
    place: L("Ботай қонысы, Солтүстік Қазақстан облысы", "Поселение Ботай, Северо-Казахстанская область", "Botai settlement, North Kazakhstan Region"),
    museum: L("Солтүстік Қазақстан облыстық тарихи-өлкетану музейі, Петропавл", "Северо-Казахстанский областной историко-краеведческий музей, Петропавловск", "North Kazakhstan Regional Museum of Local History, Petropavl"),
    material: L("Күйдірілген саз", "Обожжённая глина", "Fired clay"),
    short: L(
      "Қолмен жапсырып жасалған қалың қабырғалы құмыра. Беті тұтасымен шұқыр мен тарақ таңбасынан тұратын өрнекпен безендірілген.",
      "Толстостенный сосуд, вылепленный вручную. Вся его поверхность покрыта узором из ямок и оттисков гребёнки.",
      "A thick-walled, hand-built pot whose whole surface is covered with rows of pits and comb impressions."
    ),
    details: L(
      "Ботай қонысын археолог Виктор Зайберт зерттеді. Мұнан жүз мыңдаған жылқы сүйегі табылды. Ғалымдар құмыралардың қабырғасына сіңген майды талдап, олардан бие сүтінің ізін тапты.",
      "Поселение Ботай исследовал археолог Виктор Зайберт; здесь найдены сотни тысяч костей лошадей. Учёные проанализировали жиры, впитавшиеся в стенки сосудов, и нашли следы кобыльего молока.",
      "Botai was excavated by archaeologist Viktor Zaibert; hundreds of thousands of horse bones were found. Scientists analysed fats absorbed into the pot walls and found traces of mare's milk."
    ),
    sig: L(
      "Бұл — адамдардың жылқыны қолға үйретіп, сүтін пайдаланғаны туралы әлемдегі ең көне дәлелдердің бірі. Қымыздың тарихы осы далада басталған болуы мүмкін.",
      "Это одно из древнейших в мире свидетельств того, что люди приручили лошадь и пили её молоко. Возможно, история кумыса началась именно в этой степи.",
      "This is among the world's earliest evidence that people tamed horses and used their milk; the story of kumys may have begun on this steppe."
    ),
  },
  {
    id: "andronovo", model: "andronovo", site: "tamgaly", year: -1600, tone: "clay",
    name: L("Андронов мәдениетінің ыдысы", "Сосуд андроновской культуры", "Andronovo culture vessel"),
    period: L("Қола дәуірі, б.з.д. XVIII–XV ғасырлар", "Бронзовый век, XVIII–XV вв. до н. э.", "Bronze Age, 18th–15th c. BC"),
    place: L("Орталық және Солтүстік Қазақстан қоныстары мен қорымдары", "Поселения и могильники Центрального и Северного Казахстана", "Settlements and cemeteries of Central and North Kazakhstan"),
    museum: L("Қазақстанның өлкетану музейлері (Қарағанды, Қостанай т.б.)", "Краеведческие музеи Казахстана (Караганда, Костанай и др.)", "Regional museums of Kazakhstan (Karaganda, Kostanay and others)"),
    material: L("Күйдірілген саз", "Обожжённая глина", "Fired clay"),
    short: L(
      "Түбі тегіс, иығы айқын көрінетін ыдыс. Бетіне ілмелі үшбұрыштар, меандр және штрихталған үшбұрыштар сызылған.",
      "Плоскодонный сосуд с чётким плечом. На нём начерчены подвесные треугольники, меандр и заштрихованные треугольники.",
      "A flat-based pot with a sharp shoulder, incised with hanging triangles, a meander and hatched triangles."
    ),
    details: L(
      "Андроновтықтар малшы әрі егінші болған, қоладан құрал-сайман құйған. Ыдыс өрнегі тісті штамппен белдеу-белдеу етіп басылған. Әр белдеудің өз ырғағы бар — бұл кейінгі қазақ оюының алыс бастауы іспетті.",
      "Андроновцы были скотоводами и земледельцами, отливали орудия из бронзы. Узор на сосуде нанесён зубчатым штампом поясами, у каждого пояса свой ритм — словно далёкий исток будущего казахского орнамента.",
      "The Andronovo people herded livestock, farmed and cast bronze tools. The pattern was pressed with a toothed stamp in bands, each with its own rhythm, a distant forerunner of later Kazakh ornament."
    ),
    sig: L(
      "Андронов мәдениеті Еуразия даласының үлкен бөлігін алып жатқан. Қазақстан оның негізгі ошақтарының бірі болған.",
      "Андроновская культура охватывала огромную часть евразийских степей, и Казахстан был одним из её главных очагов.",
      "The Andronovo culture spread across much of the Eurasian steppe, and Kazakhstan was one of its main centres."
    ),
  },
  {
    id: "cauldron", model: "cauldron", site: "issyk", year: -400, tone: "bronze",
    name: L("Сақтардың құрбандық қазаны", "Сакский жертвенный котёл", "Saka sacrificial cauldron"),
    period: L("Сақ дәуірі, б.з.д. V–III ғасырлар", "Сакская эпоха, V–III вв. до н. э.", "Saka era, 5th–3rd c. BC"),
    place: L("Жетісу (Іле Алатауы баурайы)", "Семиречье (предгорья Заилийского Алатау)", "Zhetysu (foothills of the Trans-Ili Alatau)"),
    museum: L("ҚР Орталық мемлекеттік музейі, Алматы", "Центральный государственный музей РК, Алматы", "Central State Museum of Kazakhstan, Almaty"),
    material: L("Қола", "Бронза", "Bronze"),
    short: L(
      "Қоладан құйылған жарты шар тәрізді қазан. Ол конус пішінді қуыс аяқта тұр, ернеуінде тік доға құлақтары бар.",
      "Полусферический котёл, отлитый из бронзы. Он стоит на полой конической ножке, на краю — вертикальные дуговые ручки.",
      "A hemispherical cast-bronze cauldron standing on a hollow conical foot, with upright arched handles on the rim."
    ),
    details: L(
      "Мұндай қазандарды сақтар үлкен жиындар мен рәсімдерде пайдаланған: онда құрбандыққа шалынған малдың еті пісірілген. Конус аяқ қазанды тікелей от үстіне қоюға мүмкіндік берген.",
      "Такие котлы саки использовали на больших собраниях и обрядах: в них варили мясо жертвенных животных. Коническая ножка позволяла ставить котёл прямо над огнём.",
      "The Saka used such cauldrons at gatherings and rituals to cook the meat of sacrificial animals; the conical foot let the cauldron stand right over the fire."
    ),
    sig: L(
      "Қазан ортақ ас пен бірліктің белгісі болған. Бұл дәстүр ғасырлар бойы жалғасып, Тайқазанға дейін жетті.",
      "Котёл был символом общей трапезы и единства — традиция, дожившая через века до Тайказана.",
      "The cauldron symbolised the shared meal and unity, a tradition that lived on for centuries up to the Taikazan."
    ),
  },
  {
    id: "petroglyph", model: "petroglyph", site: "tamgaly", year: -1300, tone: "stone",
    name: L("Тамғалының күн бас петроглифі", "Солнцеголовый петроглиф Тамгалы", "Sun-headed petroglyph of Tamgaly"),
    period: L("Қола дәуірі, б.з.д. XIV–XIII ғасырлар", "Бронзовый век, XIV–XIII вв. до н. э.", "Bronze Age, 14th–13th c. BC"),
    place: L("Тамғалы шатқалы, Алматы облысы", "Урочище Тамгалы, Алматинская область", "Tamgaly gorge, Almaty Region"),
    museum: L("Орнында — «Тамғалы» мемлекеттік тарихи-мәдени қорық-музейі (ЮНЕСКО, 2004)", "На месте — государственный историко-культурный заповедник-музей «Тамгалы» (ЮНЕСКО, 2004)", "In situ: Tamgaly State Historical and Cultural Reserve Museum (UNESCO, 2004)"),
    material: L("Құмтас, шекіп салынған сурет", "Песчаник, выбитое изображение", "Sandstone, pecked image"),
    short: L(
      "Жартасқа шекіп салынған күн бас адам бейнесі. Басын сәулелер қоршаған, жанында кішірек тұлға, өгіз және бұғы бар.",
      "Выбитая на скале фигура человека с солнечной головой в ореоле лучей. Рядом — фигура поменьше, бык и олень.",
      "A sun-headed figure pecked into the rock, its head ringed with rays, beside a smaller figure, a bull and a deer."
    ),
    details: L(
      "Ежелгі суретшілер жартастың күңгірт қабатын тас құралмен шекіп, астындағы ашық тасты ашқан. Тамғалыда бес мыңға жуық петроглиф бар. Күн бас тұлғаларды ғалымдар көне күн құдайларының бейнесі деп топшылайды.",
      "Древние художники выбивали тёмную корку скалы каменным орудием, открывая светлый камень. В Тамгалы около пяти тысяч петроглифов; солнцеголовых учёные считают изображениями древних солнечных божеств.",
      "Ancient artists pecked away the dark rock varnish with stone tools to expose the lighter stone. Tamgaly holds about five thousand petroglyphs; scholars see the sun-headed figures as ancient solar deities."
    ),
    sig: L(
      "Тамғалы — Қазақстандағы ЮНЕСКО-ның Бүкіләлемдік мұра тізіміне енген алғашқы нысандардың бірі.",
      "Тамгалы — один из первых объектов Казахстана в Списке всемирного наследия ЮНЕСКО.",
      "Tamgaly was one of Kazakhstan's first sites on the UNESCO World Heritage List."
    ),
  },
  {
    id: "coin", model: "coin", site: "taraz", year: 740, tone: "bronze",
    name: L("Түргеш теңгесі", "Тюргешская монета", "Turgesh coin"),
    period: L("Түргеш қағанаты, VIII ғасыр", "Тюргешский каганат, VIII век", "Turgesh Khaganate, 8th century"),
    place: L("Жетісу мен Тараз өңірі, Ұлы Жібек жолы бойы", "Семиречье и район Тараза, Великий Шёлковый путь", "Zhetysu and the Taraz area, Great Silk Road"),
    museum: L("Жамбыл облыстық тарихи-өлкетану музейі (Тараз) және басқа музейлер", "Жамбылский областной историко-краеведческий музей (Тараз) и другие музеи", "Zhambyl Regional Museum (Taraz) and other museums"),
    material: L("Қола", "Бронза", "Bronze"),
    short: L(
      "Ортасында шаршы тесігі бар дөңгелек қола теңге. Бір бетінде соғды жазуы, екінші бетінде түргеш тамғасы бар.",
      "Круглая бронзовая монета с квадратным отверстием. На одной стороне — согдийская надпись, на другой — тюргешская тамга.",
      "A round bronze coin with a square hole: a Sogdian inscription on one side, the Turgesh tamga on the other."
    ),
    details: L(
      "Түргештер теңгені қытай үлгісімен қалыпқа құйған, бірақ жазуын соғды тілінде жазған. Жазуда «Тәңірі түргеш қағанның теңгесі» деген мағына бар. Тесігіне жіп өткізіп, теңгені бумен санаған. Модельдегі жазу шартты түрде көрсетілген.",
      "Тюргеши отливали монеты по китайскому образцу, но надпись делали по-согдийски — со значением «монета божественного тюргешского кагана». Через отверстие монеты нанизывали на шнур и считали связками. Надпись на модели условная.",
      "The Turgesh cast coins on the Chinese model but wrote the legend in Sogdian, meaning 'coin of the divine Turgesh khagan'. Coins were strung through the hole and counted in strings. The inscription on the model is stylised."
    ),
    sig: L(
      "Бұл — Қазақстан жерінде соғылған алғашқы өз теңгелердің бірі. Ол Жібек жолындағы сауданың қаншалықты қызу болғанын көрсетеді.",
      "Это одни из первых собственных монет, выпущенных на земле Казахстана, — свидетельство оживлённой торговли на Шёлковом пути.",
      "These are among the first coins issued on the territory of Kazakhstan, evidence of lively trade on the Silk Road."
    ),
  },
  {
    id: "taikazan", model: "taikazan", site: "turkistan", year: 1399, tone: "bronze",
    name: L("Тайқазан", "Тайказан", "Taikazan"),
    period: L("1399 жыл, Әмір Темір дәуірі", "1399 год, эпоха Тимура", "1399, era of Timur"),
    place: L("Қожа Ахмет Ясауи кесенесі, Түркістан", "Мавзолей Ходжи Ахмеда Ясави, Туркестан", "Mausoleum of Khoja Ahmed Yasawi, Turkistan"),
    museum: L("Қожа Ахмет Ясауи кесенесі (1935–1989 жылдары Эрмитажда болған)", "Мавзолей Ходжи Ахмеда Ясави (в 1935–1989 гг. находился в Эрмитаже)", "Yasawi Mausoleum (held in the Hermitage from 1935 to 1989)"),
    material: L("Жеті металл қорытпасы", "Сплав семи металлов", "Alloy of seven metals"),
    short: L(
      "Әмір Темірдің бұйрығымен құйылған алып қазан. Диаметрі 2,45 метр, салмағы шамамен екі тонна, иығында он құлағы бар.",
      "Огромный котёл, отлитый по приказу Тимура. Диаметр 2,45 м, вес около двух тонн, на плечах десять ручек.",
      "A giant cauldron cast by order of Timur: 2.45 m across, about two tonnes in weight, with ten handles on its shoulder."
    ),
    details: L(
      "Тайқазанды тәбриздік шебер Әбдел Әзиз Шарафуддин ұлы құйған. Бетіндегі араб жазуында оның кесенеге сыйға тартылғаны жазылған. Мерекелерде оған тәтті су құйып, жұртқа таратқан. Модельдегі жазу белдеуі шартты түрде берілген.",
      "Тайказан отлил мастер Абд аль-Азиз ибн Шарафуддин из Тебриза. Арабская надпись гласит, что котёл подарен мавзолею. По праздникам в нём раздавали людям подслащённую воду. Надписи на модели условные.",
      "The Taikazan was cast by master Abd al-Aziz ibn Sharafuddin of Tabriz. Its Arabic inscription records that it was a gift to the mausoleum; on feast days sweetened water was served from it. The inscription band on the model is stylised."
    ),
    sig: L(
      "Тайқазан 1989 жылы Түркістанға оралды. Ол елдің бірлігі мен береке-дастарқанының белгісі ретінде қадірленеді.",
      "В 1989 году Тайказан вернулся в Туркестан; его чтят как символ единства и щедрого дастархана.",
      "The Taikazan returned to Turkistan in 1989 and is honoured as a symbol of unity and hospitality."
    ),
  },
  {
    id: "torsyk", model: "torsyk", site: null, year: 1850, tone: "leather",
    name: L("Торсық", "Торсык", "Torsyk (leather flask)"),
    period: L("XIX ғасыр", "XIX век", "19th century"),
    place: L("Қазақ даласы, көшпелі ауыл тұрмысы", "Казахская степь, быт кочевого аула", "Kazakh steppe, nomadic household"),
    museum: L("ҚР Орталық мемлекеттік музейі, Алматы (этнография қоры)", "Центральный государственный музей РК, Алматы (этнографический фонд)", "Central State Museum of Kazakhstan, Almaty (ethnography collection)"),
    material: L("Илеген былғары, ағаш", "Выделанная кожа, дерево", "Tanned leather, wood"),
    short: L(
      "Қымыз бен су сақтайтын жалпақ былғары ыдыс. Бетінде «қошқар мүйіз» өрнегі бедерленген, аузы ағаш тығынмен жабылады.",
      "Плоский кожаный сосуд для кумыса и воды. На нём выдавлен узор «қошқар мүйіз», горлышко закрывается деревянной пробкой.",
      "A flat leather vessel for kumys and water, embossed with the 'ram's horn' ornament and closed with a wooden stopper."
    ),
    details: L(
      "Торсықты екі бөлек былғарыдан пішіп, бүйірін қалың жіппен тігеді. Ыстық күнде қымыздың дәмі бұзылмас үшін оны жас күйінде пішіп, құммен толтырып кептірген. Бау өткізетін құлақтары арқылы оны ерге іліп алып жүрген.",
      "Торсык кроили из двух кусков кожи и сшивали по краю толстой нитью. Сырую кожу набивали песком и сушили, чтобы сосуд держал форму. За ушки с ремнём его подвешивали к седлу.",
      "A torsyk was cut from two pieces of leather and sewn along the edge with thick thread. The wet leather was packed with sand and dried so the vessel kept its shape; leather loops let it hang from the saddle."
    ),
    sig: L(
      "Торсық көшпелі өмірге өте ыңғайлы: сынбайды, жеңіл, қымыздың салқынын сақтайды. «Қымыз — қасиетті ас» деген сенім оны құрметті бұйымға айналдырған.",
      "Торсык идеален для кочевой жизни: не бьётся, лёгок и сохраняет кумыс прохладным. Почитание кумыса сделало его почётной вещью.",
      "The torsyk suited nomadic life perfectly: unbreakable, light and keeping kumys cool. Reverence for kumys made it a treasured object."
    ),
  },
  {
    id: "dombyra", model: "dombyra", site: null, year: 1870, tone: "wood",
    name: L("Домбыра", "Домбра", "Dombyra"),
    period: L("XIX ғасыр", "XIX век", "19th century"),
    place: L("Қазақ даласы", "Казахская степь", "Kazakh steppe"),
    museum: L("Ықылас атындағы Қазақ халық музыка аспаптары музейі, Алматы", "Музей казахских народных музыкальных инструментов имени Ыкыласа, Алматы", "Ykylas Museum of Kazakh Folk Musical Instruments, Almaty"),
    material: L("Ағаш, ішек", "Дерево, жильные струны", "Wood, gut strings"),
    short: L(
      "Алмұрт пішінді шанағы мен ұзын мойны бар екі ішекті аспап. Пернелері мойынға ішекпен байланған.",
      "Двухструнный инструмент с грушевидным корпусом и длинным грифом. Лады навязаны на гриф из жил.",
      "A two-stringed instrument with a pear-shaped body and a long neck, its frets tied on with gut."
    ),
    details: L(
      "Шанағы жіңішке ағаш тақталардан құрастырылып, жұқа қақпақпен жабылады. Домбырамен күй тартылып, жыр мен термелер айтылған. Құрманғазы, Дина, Тәттімбет сияқты күйшілер халық жадында мәңгі қалды.",
      "Корпус собирали из тонких деревянных планок и закрывали тонкой декой. Под домбру исполняли кюи, эпосы и терме; имена кюйши Курмангазы, Дины, Таттимбета навсегда остались в памяти народа.",
      "The body was assembled from thin wooden staves under a thin soundboard. Kuis, epics and terme were performed on it; kuishi such as Kurmangazy, Dina and Tattimbet live on in the people's memory."
    ),
    sig: L(
      "Домбыра — қазақ мәдениетінің жаны. Домбыра күйі мен өнері ЮНЕСКО-ның материалдық емес мәдени мұра тізіміне енген (2014).",
      "Домбра — душа казахской культуры. Традиция кюя и искусство домбры внесены в Список нематериального наследия ЮНЕСКО (2014).",
      "The dombyra is the soul of Kazakh culture; the art of the dombyra kui is on UNESCO's Intangible Heritage list (2014)."
    ),
  },
];

export const ART_LANGS = ["kk", "ru", "en"];
export const at = (obj, lang) => (obj ? obj[lang] || obj.en || obj.kk : "");
