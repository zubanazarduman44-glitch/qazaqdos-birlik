// Өңір туралы қысқа мәтін (kk / ru / en). lib/sights.js те осыны қайта экспорттайды.
const L = (kk, ru, en) => ({ kk, ru, en });

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
