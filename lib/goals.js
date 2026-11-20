// Пайдаланушының мақсаты (онбордингте / Профильде таңдалады: state.profile.goal) → оған керек тақырыптар.
// Сөздік: күнделікті 10 сөздің көбі осы тақырыптардан. Тілбіл: осы тақырыптар белгімен ерекшеленеді.
export const GOAL_TOPICS = {
  travel: ["travel", "transport", "direction", "city", "food", "weather", "nature", "shop", "greet", "numbers", "tradition"],
  study: ["school", "edu", "science", "hist", "media", "verbs", "adj", "tech", "art", "mind"],
  work: ["work", "jobs", "economy", "tech", "society", "numbers", "time", "law", "city", "greet"],
  life: ["family", "home", "food", "greet", "time", "clothes", "health", "shop", "feelings", "hobby", "body", "weather"],
};

export const goalTopics = (goal) => new Set(GOAL_TOPICS[goal] || []);

// Күнделікті сөздер: `n` сөздің ~70%-ы мақсат тақырыптарынан, қалғаны басқа тақырыптардан (сөз қоры кең болсын).
// list — кездейсоқ ретпен араластырылған сөздер ({ kk, t }).
export function pickForGoal(list, goal, n = 10) {
  const set = goalTopics(goal);
  if (!set.size) return list.slice(0, n);
  const mine = list.filter((w) => set.has(w.t));
  const other = list.filter((w) => !set.has(w.t));
  const k = Math.min(mine.length, Math.round(n * 0.7));
  const out = [...mine.slice(0, k), ...other.slice(0, n - k)];
  if (out.length < n) out.push(...mine.slice(k, k + n - out.length));
  // Мақсат сөздері бір жерге жиналып қалмасын: қайта араластырамыз (тұрақты ретпен — тізімдегі орны бойынша)
  const pos = new Map(list.map((w, i) => [w.kk, i]));
  return out.sort((a, b) => pos.get(a.kk) - pos.get(b.kk));
}

const TX = {
  kk: { badge: "Мақсатыңа сай", note: (g) => `Мақсатың — ${g}. Белгісі бар тақырыптар осы мақсатқа көбірек көмектеседі.`, daily: "Бүгінгі сөздердің көбі — мақсатыңа сай" },
  ru: { badge: "Для вашей цели", note: (g) => `Ваша цель — ${g}. Отмеченные темы помогут ей больше всего.`, daily: "Большинство слов дня — под вашу цель" },
  en: { badge: "For your goal", note: (g) => `Your goal: ${g}. Marked topics help with it most.`, daily: "Most of today's words match your goal" },
  zh: { badge: "适合你的目标", note: (g) => `你的目标：${g}。带标记的主题对它最有帮助。`, daily: "今天的大部分单词符合你的目标" },
  es: { badge: "Para tu objetivo", note: (g) => `Tu objetivo: ${g}. Los temas marcados te ayudarán más.`, daily: "La mayoría de las palabras de hoy van con tu objetivo" },
  de: { badge: "Für dein Ziel", note: (g) => `Dein Ziel: ${g}. Markierte Themen helfen dir dabei am meisten.`, daily: "Die meisten Wörter von heute passen zu deinem Ziel" },
  fr: { badge: "Pour ton objectif", note: (g) => `Ton objectif : ${g}. Les thèmes marqués t'aideront le plus.`, daily: "La plupart des mots du jour correspondent à ton objectif" },
  tr: { badge: "Hedefine uygun", note: (g) => `Hedefin: ${g}. İşaretli konular sana en çok yardımcı olur.`, daily: "Bugünkü kelimelerin çoğu hedefine uygun" },
  ar: { badge: "مناسب لهدفك", note: (g) => `هدفك: ${g}. المواضيع المميزة تساعدك أكثر.`, daily: "معظم كلمات اليوم تناسب هدفك" },
  ko: { badge: "목표에 맞춤", note: (g) => `목표: ${g}. 표시된 주제가 가장 도움이 돼요.`, daily: "오늘 단어 대부분이 목표에 맞아요" },
  ja: { badge: "目標にぴったり", note: (g) => `目標：${g}。印のついたテーマが一番役立ちます。`, daily: "今日の単語の多くは目標に合わせています" },
};
export const goalTx = (lang) => TX[lang] || TX.en;
