// Қазақ мәдениеті: мақал-мәтелдер және дәстүрлер (күн сайын жаңарады)
const P = (kk, ru, en) => ({ kk, ru, en });
export const PROVERBS = [
  P("Білекті бірді жығады, білімді мыңды жығады.", "Сильный одолеет одного, а знающий — тысячу.", "The strong beat one, the learned beat a thousand."),
  P("Ер жігіттің құны — бір ауыз сөз.", "Цена мужчины — его слово.", "A person's worth is his word."),
  P("Бірлік бар жерде тірлік бар.", "Где единство — там и жизнь.", "Where there is unity, there is life."),
  P("Еңбек етсең емерсің.", "Потрудишься — не пропадёшь.", "Work, and you will prosper."),
  P("Жеті рет өлшеп, бір рет кес.", "Семь раз отмерь, один раз отрежь.", "Measure seven times, cut once."),
  P("Өнерлі өрге жүзер.", "Умелый пойдёт вверх.", "The skilled rise higher."),
  P("Достық — дәулеттен артық.", "Дружба дороже богатства.", "Friendship is worth more than wealth."),
  P("Ана тілің — арың бар, ұлтың бар.", "Родной язык — твоя честь и народ.", "Your mother tongue is your honour and your nation."),
  P("Үлкенге — құрмет, кішіге — ізет.", "Старшему — почёт, младшему — внимание.", "Respect the elder, be kind to the younger."),
  P("Туған жердей жер болмас.", "Нет места лучше родной земли.", "There is no land like your native land."),
  P("Асыл сөз — арындағы алтын.", "Золотое слово — украшение человека.", "A noble word is gold."),
  P("Тіл тас жарады, тас жармаса, бас жарады.", "Язык камень расколет, а не камень — так голову.", "Words can split stone, or else a head."),
  P("Жақсының жақсылығын айт, нұры тасысын.", "Говори о добре хорошего человека, пусть светит.", "Praise the good, and let their light grow."),
  P("Оқусыз білім жоқ, білімсіз күнің жоқ.", "Без учёбы нет знаний, без знаний нет будущего.", "No knowledge without study, no future without knowledge."),
];
export const TRADITIONS = [
  { e: "🏕️", t: P("Киіз үй", "Юрта", "Yurt"), d: P("Киіз үйдің төбесіндегі шаңырақ — отбасының, өмірдің белгісі. Ол ұрпақтан ұрпаққа беріледі.", "Шанырак на вершине юрты — символ семьи и жизни. Его передают из поколения в поколение.", "The shanyrak at the top of the yurt symbolises family and life and is passed down through generations.") },
  { e: "🍵", t: P("Қонақжайлылық", "Гостеприимство", "Hospitality"), d: P("Қонақ келсе, үйге шақырып, шай мен дастарқан жайылады. «Қонақ — құдайдың сыйы».", "Гостя приглашают в дом и накрывают стол с чаем. «Гость — дар Божий».", "A guest is invited in and offered tea and a full table. “A guest is a gift.”") },
  { e: "🎉", t: P("Наурыз", "Наурыз", "Nauryz"), d: P("Наурыз — көктем мен жаңа жылдың мейрамы, 21–23 наурызда тойланады. Наурыз көже жеті түрлі тағамнан жасалады.", "Наурыз — праздник весны и Нового года, 21–23 марта. Наурыз-коже готовят из семи ингредиентов.", "Nauryz is the spring New Year, celebrated on 21–23 March. Nauryz kozhe is made of seven ingredients.") },
  { e: "🪕", t: P("Домбыра", "Домбра", "Dombyra"), d: P("Домбыра — екі ішекті ұлттық аспап. Күй мен жыр көбіне домбырамен орындалады.", "Домбра — двухструнный инструмент; на ней исполняют кюи и песни.", "The dombyra is a two-stringed instrument used for küis and songs.") },
  { e: "🦅", t: P("Бүркітші", "Беркутчи", "Eagle hunters"), d: P("Қазақ бүркітшілері қыста аңшылыққа үйретілген бүркітті пайдаланады. Бұл өнер ғасырлар бойы сақталған.", "Казахские беркутчи охотятся зимой с обученным беркутом. Это искусство сохраняется веками.", "Kazakh eagle hunters hunt in winter with trained golden eagles, a tradition kept for centuries.") },
  { e: "👶", t: P("Тұсау кесу", "Тусау кесу", "Tusau kesu"), d: P("Бала алғашқы қадам жасағанда, аяғындағы тұсауды кеседі: «жолың ашық болсын» деген ниет.", "Когда ребёнок делает первые шаги, разрезают путы на ногах — пожелание лёгкого пути.", "When a child takes first steps, a ribbon on the feet is cut, wishing an open road.") },
  { e: "🐎", t: P("Көкпар", "Кокпар", "Kokpar"), d: P("Көкпар — салт атты ойыны: шабандоздар серкені алып, мәреге жеткізуге тырысады.", "Кокпар — конная игра: всадники борются за тушу, стремясь донести её до цели.", "Kokpar is a horseback game where riders compete to carry a carcass to the goal.") },
  { e: "🧣", t: P("Шапан жабу", "Накинуть шапан", "Shapan gift"), d: P("Құрметті қонаққа шапан жабу — ең үлкен құрметтің белгісі.", "Накинуть шапан на почётного гостя — знак величайшего уважения.", "Draping a shapan over an honoured guest is a sign of deep respect.") },
];
