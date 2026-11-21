// Әдебиет мәтіндерінің дайын аудармасы (орысша, ағылшынша): сұраусыз, лезде көрсетіледі.
// LIT_TR[id] = [ru, en] — шығарма туралы мәлімет (WORKS[].text).
// LIT_EP_TR[id] = { ru: [кіріспе, эпизод], en: [...] } — тек негізгі деңгейдегі (WORKS[].lvl) эпизодтың аудармасы; сөйлем саны мәтінмен бірдей.
// Басқа деңгейлер мен тілдер /api/translate арқылы аударылып, құрылғыда сақталады.
export const LIT_TR = {
  ormekshi: [
    "Ыбырай Алтынсарин — великий казахский просветитель, учитель, открывший первые школы для детей. Для учеников он писал короткие и понятные рассказы. Рассказ «Паук, муравей и ласточка» учит трудолюбию и упорству.",
    "Ibrai Altynsarin was a great Kazakh educator, a teacher who opened the first schools for children. He wrote short, clear stories for his pupils. The story The Spider, the Ant and the Swallow teaches hard work and perseverance.",
  ],
  "altynsarin-ake": [
    "«Отец и сын» — короткий рассказ Ыбырая Алтынсарина для детей. В нём отец на простом случае даёт сыну жизненный урок. Рассказ показывает, что пренебрежение малым делом оборачивается большими хлопотами.",
    "Father and Son is a short story for children by Ibrai Altynsarin. In it a father teaches his son a life lesson through a simple event. The story shows that ignoring a small task leads to a lot of trouble later.",
  ],
  kobylandy: [
    "Кобланды — известный батыр казахских дастанов. Его верный товарищ — талантливый скакун по имени Тайбурыл. Кобланды женится на умной девушке Курткé.",
    "Kobylandy is a famous hero of Kazakh epic songs. His faithful companion is a gifted racehorse called Taiburyl. Kobylandy marries a clever girl named Kurtka.",
  ],
  alpamys: [
    "Алпамыс — сын Байбури, сильный и смелый юноша. Он женится на красавице Гульбаршын. Потом Алпамыс попадает в чужую страну и оказывается в плену.",
    "Alpamys is the son of Baibori, a strong and brave young man. He marries the beautiful Gulbarshyn. Later Alpamys travels to a foreign land and is taken prisoner.",
  ],
  "kyz-zhibek": [
    "Кыз Жибек — красивая и умная девушка. Юноша по имени Толеген хочет посвататься к Жибек и отправляется в дальний путь. Дастан показывает любовь и верность, дружбу и храбрость.",
    "Kyz Zhibek is a beautiful and clever girl. A young man named Tolegen wants to ask for Zhibek's hand and sets out on a long journey. The epic shows love and loyalty, friendship and courage.",
  ],
  "kozy-bayan": [
    "Козы Корпеш и красавица Баян были помолвлены ещё в детстве. Хитрый человек по имени Кодар не даёт им соединиться. Этот дастан — один из древнейших и самых любимых казахских рассказов о любви.",
    "Kozy Korpesh and the beautiful Bayan were betrothed to each other in childhood. A cunning man named Kodar does not let them be together. This epic is one of the oldest and best-loved Kazakh love stories.",
  ],
  kokserek: [
    "Мухтар Ауэзов — великий казахский писатель. Повесть «Коксерек» рассказывает о волке, выросшем в руках человека. Произведение заставляет задуматься о дружбе, природе и силе происхождения.",
    "Mukhtar Auezov is a great Kazakh writer. The novella Kokserek tells of a wolf raised by people. The work makes us think about friendship, nature and the power of one's origins.",
  ],
  "abai-zholy": [
    "«Путь Абая» — знаменитый роман Мухтара Ауэзова. В нём рассказывается о детстве Абая и годах, когда он становился поэтом. Роман широко показывает жизнь казахского народа.",
    "Abai's Path is a famous novel by Mukhtar Auezov. It tells of Abai's childhood and the years when he became a poet. The novel shows the life of the Kazakh people broadly.",
  ],
  "abai-sozder": [
    "Абай Кунанбайулы — великий казахский поэт и мыслитель. «Слова назидания» — сорок пять размышлений Абая. В них поэт думает о характере человека, знании, труде, правде и справедливости.",
    "Abai Kunanbaiuly is the great Kazakh poet and thinker. The Book of Words is a collection of forty-five reflections by Abai. In them the poet thinks about human character, knowledge, work, truth and justice.",
  ],
  "er-targyn": [
    "Ер Таргын — отважный батыр ногайлинской эпохи. Он поступает на службу к Акша-хану и знакомится с ханской дочерью Акжунис. Дастан воспевает доблесть, любовь и верность.",
    "Er Targyn is a lion-hearted hero of the Nogai era. He enters the service of Aksha Khan and meets the khan's daughter, Akzhunis. The epic sings of courage, love and loyalty.",
  ],
  shuga: [
    "Беимбет Майлин — один из основоположников казахской прозы. В повести «Памятник Шуге» рассказывается о печальной судьбе красивой и умной девушки Шуги. Произведение показывает столкновение искренней любви и старых обычаев.",
    "Beimbet Mailin is one of the founders of Kazakh prose. The novella Shuga's Marker tells the sad fate of Shuga, a beautiful and clever girl. The work shows the clash between true love and old customs.",
  ],
  ulpan: [
    "Габит Мусрепов — видный казахский писатель и драматург. Роман «Улпан её имя» — о мудрой женщине Улпан, жившей в XIX веке. Став женой бия Есенея, она стремится принести новое в жизнь народа.",
    "Gabit Musrepov is a prominent Kazakh writer and playwright. The novel Her Name Is Ulpan is about Ulpan, a wise woman who lived in the 19th century. As the wife of the judge Yesenei, she tries to bring change to the life of her people.",
  ],
  seifullin: [
    "Сакен Сейфуллин — один из основоположников казахской литературы. «Тернистый путь» — его мемуарный роман. В нём описаны перемены начала XX века и годы гражданской войны.",
    "Saken Seifullin is one of the founders of Kazakh literature. The Thorny Path is his memoir novel. It describes the changes of the early twentieth century and the years of the civil war.",
  ],
  koshpendiler: [
    "«Кочевники» — трилогия исторических романов Ильяса Есенберлина. В ней рассказывается о создании Казахского ханства и истории XV–XVIII веков. Роман изображает жизнь таких ханов, как Керей и Жанибек.",
    "The Nomads is a trilogy of historical novels by Ilyas Yesenberlin. It tells of the founding of the Kazakh Khanate and the history of the fifteenth to eighteenth centuries. The novel portrays the lives of khans such as Kerey and Zhanibek.",
  ],
};

export const LIT_EP_TR = {
  kobylandy: {
    ru: ["Приходит весть, что Казан-хан напал на страну, и Кобланды отправляется в поход.",
      "Куртка долго готовила Тайбурыла. Она давала коню хорошее сено и поила его чистой водой. Теперь Куртка седлает Тайбурыла и подводит его к батыру. «Счастливого пути, мой батыр, возвращайся домой живым!» — говорит Куртка. Кобланды садится на коня и отправляется в путь. Тайбурыл мчится, как ветер. Из-под его копыт летят камни. Горы и озёра остаются позади. Даже птицы не могут его догнать. Сильный ветер выбивает слёзы из глаз батыра. Месячный путь Тайбурыл проходит за один день. Кобланды достигает земли Казан-хана. Он гладит Тайбурыла по шее и говорит: «Спасибо, друг мой!»"],
    en: ["News comes that Kazan Khan has attacked the land, and Kobylandy sets out on a campaign.",
      "Kurtka has prepared Taiburyl for a long time. She gave the horse good hay and clean water to drink. Now Kurtka saddles Taiburyl and brings him to the hero. \"Have a good journey, my hero, come home safe!\" says Kurtka. Kobylandy mounts the horse and sets off. Taiburyl gallops like the wind. Stones fly from under his hooves. Mountains and lakes are left behind. Even birds cannot catch up with him. The strong wind brings tears to the hero's eyes. Taiburyl covers a month's journey in a single day. Kobylandy reaches Kazan Khan's land. He strokes Taiburyl's neck and says: \"Thank you, my friend!\""],
  },
  alpamys: {
    ru: ["Пролежав семь лет в зиндане, Алпамыс наконец возвращается на родину.",
      "Подъезжая к аулу, он встречает в пути старого пастуха Култая. Култай не узнаёт его, потому что у Алпамыса отросли борода и волосы. Пастух плачет и рассказывает дурную весть. «Страной завладел злой человек по имени Ултан, завтра он женится на Гульбаршын», — говорит он. Алпамыс меняется с Култаем одеждой. Под видом старого пастуха он идёт на свадьбу. На свадьбе джигиты пробуют натянуть большой лук Алпамыса. Но никто не может его натянуть. Тогда «старый пастух» берёт лук и легко натягивает его. Люди в изумлении спрашивают: «Кто это?» Народ узнаёт в нём Алпамыса. Алпамыс наказывает Ултана и освобождает свою страну. Народ снова радуется и устраивает большой праздник."],
    en: ["After seven years in a dungeon, Alpamys finally returns to his homeland.",
      "As he nears the aul, he meets the old shepherd Kultai on the road. Kultai does not recognise him, because Alpamys's beard and hair have grown long. The shepherd weeps and tells him bad news. \"A wicked man named Ultan has seized the land, and tomorrow he will marry Gulbarshyn,\" he says. Alpamys swaps clothes with Kultai. Disguised as an old shepherd, he goes to the wedding. At the wedding the young men try to draw Alpamys's great bow. But none of them can draw it. Then the \"old shepherd\" takes the bow and draws it easily. People ask in amazement: \"Who is this?\" The people recognise him as Alpamys. Alpamys punishes Ultan and frees his land. The people rejoice again and hold a great feast."],
  },
  "kyz-zhibek": {
    ru: ["Возвращаясь снова к Жибек, Толеген останавливается в пути на берегу озера.",
      "По озеру плавают шесть гусей. Толеген долго смотрит на них. Он думает о Жибек, и сердце его радуется. Но в камышах прячется Бекежан. Бекежану тоже нравится Жибек, поэтому он ненавидит Толегена. Он натягивает лук и стреляет в Толегена. Стрела попадает юноше в грудь. Толеген падает с коня на землю. Он смотрит на гусей, взлетевших в небо. «Эй, гуси, если полетите в мою страну, передайте мой привет», — говорит он. «Скажите отцу с матерью и моей любимой Жибек», — говорит он. Гуси делают круг и улетают вдаль. Юноша погибает на том месте."],
    en: ["On his way back to Zhibek, Tolegen stops on the shore of a lake.",
      "Six geese are swimming on the lake. Tolegen sits and watches them for a long time. He thinks of Zhibek, and his heart is glad. But Bekezhan is hiding in the reeds. Bekezhan likes Zhibek too, so he hates Tolegen. He draws his bow and shoots at Tolegen. The arrow strikes the young man in the chest. Tolegen falls from his horse to the ground. He looks at the geese flying up into the sky. \"Hey, geese, if you fly to my land, carry my greetings,\" he says. \"Tell my father and mother, and my beloved Zhibek,\" he says. The geese circle and fly far away. The young man dies on that spot."],
  },
  "kozy-bayan": {
    ru: ["После того как Кодар убил Козы, Баян остаётся одна.",
      "Баян глубоко скорбит, но не показывает слёз. Она задумывает отомстить Кодару. Однажды Баян говорит Кодару: «Я хочу пить, достань мне воды из колодца». Колодец очень глубокий, до его дна трудно добраться. «Держись за мои длинные косы и спускайся», — говорит Баян. Кодар радуется, хватается за косы девушки и спускается в колодец. Когда он добирается до середины колодца, Баян берёт нож. Она отрезает свои косы. Кодар падает на дно колодца и погибает. Баян приходит к могиле Козы и долго плачет. В конце концов Баян тоже уходит из жизни, и её хоронят рядом с Козы. Близ Аягоза до сих пор стоит их старинный мавзолей."],
    en: ["After Kodar kills Kozy, Bayan is left alone.",
      "Bayan grieves deeply but does not show her tears. She plans to take revenge on Kodar. One day Bayan says to Kodar: \"I'm thirsty, fetch me water from the well.\" The well is very deep; it is hard to reach the bottom. \"Hold on to my long braids and climb down,\" says Bayan. Kodar is pleased, grabs the girl's braids and goes down into the well. When he reaches the middle of the well, Bayan takes a knife. She cuts off her braids. Kodar falls to the bottom of the well and dies. Bayan goes to Kozy's grave and weeps for a long time. In the end Bayan also passes away and is buried beside Kozy. Their old mausoleum still stands near Ayagoz."],
  },
  "abai-zholy": {
    ru: ["Тринадцатилетний Абай возвращается домой из городского медресе.",
      "Он три года проучился в Семее. С ним едет джигит из аула, но Абай обгоняет его и всё погоняет коня. Он очень соскучился по родной степи. Запах полыни, широкая равнина, далёкий Шынгыстау — всё кажется ему родным и милым. К вечеру вдали показываются юрты аула. Сначала Абай здоровается с отцом Кунанбаем. Отец лишь сдержанно спрашивает: «Приехал, ну как учёба?» Потом Абай бежит к бабушке Зере и матери Улжан. Бабушка обнимает внука и целует его в щёку. «Жеребёночек мой, приехал, свет моих очей!» — говорит она. Мать с улыбкой смотрит на сына и говорит ему тёплые слова. Абай снова чувствует себя счастливым ребёнком. Но вскоре он видит жестокие дела отца и глубоко задумывается."],
    en: ["Thirteen-year-old Abai is coming home from the madrasa in town.",
      "He has studied in Semey for three years. A young man from the aul rides with him, but Abai overtakes him and keeps spurring his horse. He has missed his native steppe very much. The smell of wormwood, the wide plain, the distant Shyngystau — everything feels dear to him. Towards evening the yurts of the aul appear in the distance. First Abai greets his father, Kunanbai. His father calmly asks only: \"So you're back; how are your studies?\" Then Abai runs to his grandmother Zere and his mother Ulzhan. His grandmother hugs her grandson and kisses his cheek. \"My little foal, you've come, light of my eyes!\" she says. His mother looks at her son with a smile and speaks warm words to him. Abai feels like a happy child again. But soon he sees his father's harsh deeds and begins to think deeply."],
  },
  "abai-sozder": {
    ru: ["Наступил вечер; Абай, которому уже за сорок, сидит дома один, погружённый в думы.",
      "Он спрашивает себя: «Как я прожил жизнь до этих лет?» Много лет он занимался делами народа, спорил, препирался, но что он от этого получил? «Чем же мне теперь занять оставшуюся жизнь?» — думает он. «Хотел бы управлять народом — народ не слушает советов», — говорит Абай. «Хотел бы пасти скот — дети выросли, пусть скот пасут они.» «Хотел бы заняться наукой — мало людей, с кем можно поделиться мыслями.» Он долго думает и наконец принимает решение. «Буду записывать на бумагу всё, что приходит мне на ум», — говорит он. «Пусть белая бумага и чёрные чернила станут мне товарищами.» «Если кому-то нужно — пусть читает, а не нужно — пусть мои слова останутся при мне.» Так начинаются «Слова назидания» Абая."],
    en: ["Evening has fallen; Abai, now past forty, sits alone at home, lost in thought.",
      "He asks himself: \"How have I spent my life up to these years?\" For many years he dealt with public affairs, argued and quarrelled, but what did he gain from it? \"What shall I do with the rest of my life?\" he wonders. \"If I tried to govern people, they would not listen to advice,\" says Abai. \"If I tried to herd livestock, my children have grown up; let them herd it.\" \"If I took up learning, there are few people to share my thoughts with.\" He thinks for a long time and finally makes a decision. \"I will simply write down on paper whatever comes to my mind,\" he says. \"Let white paper and black ink be my companions.\" \"If someone needs these words, let them read; if not, let my words stay with me.\" This is how Abai's Book of Words begins."],
  },
  "er-targyn": {
    ru: ["Акжунис и Таргын бегут из ставки Акша-хана и выезжают в широкую степь.",
      "Разгневанный Акша-хан посылает за ними Старого Кожака. Старый Кожак — самый опытный батыр ханской ставки. Он вскоре настигает молодых. Таргын берёт копьё и выходит на бой со стариком. Два батыра долго бьются, но ни один не может победить. Тогда Акжунис встаёт между ними и обращается к старику. «Отец, мы любим друг друга, не преграждайте нам путь», — говорит девушка. «Таргын — воин, защищающий народ, не проливайте его кровь», — говорит она. Старый Кожак задумывается и опускает копьё. Он признаёт доблесть Таргына. «Дети мои, будьте счастливы, пусть ваш путь будет открыт», — говорит старик. Он благословляет молодых и поворачивает назад."],
    en: ["Akzhunis and Targyn flee from Aksha Khan's camp and ride out into the wide steppe.",
      "Aksha Khan is furious and sends Old Kozhak after them. Old Kozhak is the most experienced warrior at the khan's camp. He soon catches up with the young pair. Targyn takes up his spear and goes out to fight the old man. The two warriors fight for a long time, but neither can win. Then Akzhunis comes between them and speaks to the old man. \"Grandfather, we love each other, do not block our way,\" says the girl. \"Targyn is a hero who defends the people, do not shed his blood,\" she says. Old Kozhak thinks and lowers his spear. He acknowledges Targyn's courage. \"My children, be happy, may your road be open,\" says the old man. He gives the young couple his blessing and turns back."],
  },
  seifullin: {
    ru: ["Летом 1918 года в Акмолинске сменяется власть, и молодой Сакен вместе с товарищами попадает в плен.",
      "Сначала их запирают в городской тюрьме, а потом сажают в железнодорожный вагон. В тесном вагоне не хватает воздуха, заключённым дают мало еды и воды. Поезд медленно ползёт от станции к станции, а на каждой остановке охранники запугивают узников. Народ прозвал этот вагон «вагоном смерти». Сакен своими глазами видит все эти мучения и позже, ничего не скрывая, описывает их в книге. Дни складываются в месяцы, но узники не теряют надежды. Наконец Сакен находит момент бежать из тюрьмы. Ночью, скрываясь, он выбирается в широкую степь. По пути он находит приют в домах аульных жителей. Простые казахи прячут его, дают ему еду и коня. Автор сравнивает эти дни с тернистым путём и скользкой переправой."],
    en: ["In the summer of 1918 power changes hands in Akmolinsk, and young Saken and his comrades are taken prisoner.",
      "First they are locked in the town prison, and later they are put into a railway wagon. There is not enough air in the cramped wagon, and the prisoners are given little food or water. The train crawls slowly from station to station, and at every stop the guards terrorise the prisoners. People came to call this wagon the \"death wagon\". Saken sees all this suffering with his own eyes and later describes it in his book, hiding nothing. Days turn into months, but the prisoners do not lose hope. At last Saken finds a moment to escape from prison. At night, in hiding, he makes his way out into the wide steppe. Along the way he finds shelter in the homes of village people. Ordinary Kazakhs hide him and give him food and a horse. The author compares these days to a narrow path and a slippery crossing."],
  },
  koshpendiler: {
    ru: ["Казахское и джунгарское войска стоят друг против друга на двух краях широкой степи.",
      "Со стороны джунгар выезжает батыр по имени Шарыш и вызывает на поединок. Это был грозный батыр, чья слава шла далеко. В казахском войске на какое-то время воцаряется тишина. Тогда вперёд выходит молодой парень, пасший верблюдов. Люди звали его «Сабалак», потому что волосы у него были всклокочены. Удивлённые старейшины дают ему коня и копьё. Скача на врага, юноша выкрикивает боевой клич: «Абылай!» Абылай — имя его деда. Два батыра яростно бьются, и наконец юноша сбрасывает Шарыша с коня. Воодушевлённое этой победой, казахское войско бросается на врага. После битвы все хотят узнать, кто этот молодой батыр. Юноша рассказывает, что он Абылмансур и происходит из ханского рода. С того дня народ называет его именем деда — Абылай."],
    en: ["The Kazakh and Dzungar armies stand face to face at the two ends of a wide steppe.",
      "From the Dzungar side a warrior named Sharysh rides out and challenges anyone to single combat. He was a fearsome warrior whose fame had spread far. For a while silence falls over the Kazakh host. Then a young man who herded camels steps forward. People called him \"Sabalak\", because his hair was shaggy and tangled. The surprised elders give him a horse and a spear. Galloping towards the enemy, the young man shouts the battle cry: \"Abylai!\" Abylai was the name of his grandfather. The two warriors fight fiercely, and at last the young man throws Sharysh from his horse. Inspired by this victory, the Kazakh army charges the enemy. After the battle everyone wants to know who the young hero is. The young man says that he is Abylmansur and comes from a line of khans. From that day the people call him by his grandfather's name, Abylai."],
  },
};
