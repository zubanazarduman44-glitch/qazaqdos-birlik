// Айтылым фразалары: деңгей бойынша (A1–B2)
const P = (lvl, kk, ru, en) => ({ lvl, kk, ru, en });
export const PHRASES = [
  P("A1", "Сәлем, менің атым Айгерім.", "Привет, меня зовут Айгерим.", "Hello, my name is Aigerim."),
  P("A1", "Рақмет, жақсы.", "Спасибо, хорошо.", "Thank you, I'm fine."),
  P("A1", "Бұл менің анам.", "Это моя мама.", "This is my mother."),
  P("A1", "Маған су керек.", "Мне нужна вода.", "I need water."),
  P("A2", "Мен Алматыда тұрамын.", "Я живу в Алматы.", "I live in Almaty."),
  P("A2", "Кеше біз мектепке бардық.", "Вчера мы ходили в школу.", "Yesterday we went to school."),
  P("A2", "Сіз қазақша сөйлейсіз бе?", "Вы говорите по-казахски?", "Do you speak Kazakh?"),
  P("A2", "Бүгін ауа райы өте жақсы.", "Сегодня очень хорошая погода.", "The weather is very nice today."),
  P("B1", "Мен қазақ тілін үйренгім келеді, себебі ол маған қызық.", "Я хочу выучить казахский, потому что мне интересно.", "I want to learn Kazakh because it interests me."),
  P("B1", "Ертең достарыммен бірге тауға барамыз.", "Завтра мы с друзьями поедем в горы.", "Tomorrow we are going to the mountains with friends."),
  P("B1", "Жаздан бері мен күнде бір сағат оқимын.", "С лета я занимаюсь каждый день по часу.", "Since summer I have studied for an hour every day."),
  P("B2", "Жеті рет өлшеп, бір рет кес.", "Семь раз отмерь, один раз отрежь.", "Measure seven times, cut once."),
  P("B2", "Егер уақытым болса, мен Қазақстанның барлық өңірін аралап шығар едім.", "Если бы у меня было время, я бы объехал все регионы Казахстана.", "If I had time, I would travel through every region of Kazakhstan."),
  P("B2", "Тіл — халықтың жаны, ал сөз — оның көркі.", "Язык — душа народа, а слово — его красота.", "Language is the soul of a nation, and the word is its beauty."),
];
export const SP_PASS = 70;
export const SP_LEVELS = ["A1", "A2", "B1", "B2"];
