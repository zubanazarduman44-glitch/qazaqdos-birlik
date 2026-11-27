// Саяхат: өңір тесті (5 сұрақ, мөрге 4 дұрыс жауап керек). Тексеру: scripts/check-travel-quiz.mjs
//
// Әр сұрақ карточкада көрсетілген нәрсені ғана тексереді:
//  • облыс — «орталығы қай қала?» (орталығы карточкада жазылған); қате нұсқалар — басқа облыстардың
//    орталықтары, республикалық маңызы бар қалалар мен өңірдің бұрынғы орталықтарынсыз (екі дұрыс жауап болмасын);
//  • республикалық маңызы бар қала (Астана, Алматы, Шымкент) — «орталығы» деген сұрақ қойылмайды:
//    оның орнына карточкадағы деректен «Бос орынды толтыр» сұрағы;
//  • өңірдің 4 сөзі — «аудармасы қандай?», қате нұсқалар аудармасы да, мағынасы жақын топтағы сөздері де басқа.
import { REGIONS } from "./regions";

const L = (o, lang) => (o ? o[lang] || o.en || o.kk || "" : "");

export const TQ = {
  blank: { kk: "Бос орынды толтыр", ru: "Заполните пропуск", en: "Fill in the blank", zh: "填空", es: "Completa el espacio", de: "Ergänze die Lücke", fr: "Complète la phrase", tr: "Boşluğu doldur", ar: "املأ الفراغ", ko: "빈칸을 채우세요", ja: "空欄を埋めよう" },
  center: {
    kk: (n) => `${n}ның орталығы — қай қала?`,
    ru: (n) => `${n}: какой город — областной центр?`,
    en: (n) => `${n}: which city is the regional centre?`,
    zh: (n) => `${n}的首府是哪座城市？`,
    es: (n) => `${n}: ¿cuál es su capital?`,
    de: (n) => `${n}: Welche Stadt ist das Verwaltungszentrum?`,
    fr: (n) => `${n} : quelle ville est le chef-lieu ?`,
    tr: (n) => `${n}: il merkezi hangi şehir?`,
    ar: (n) => `${n}: ما المدينة المركز الإداري؟`,
    ko: (n) => `${n}의 중심 도시는 어디일까요?`,
    ja: (n) => `${n}の州都はどこ？`,
  },
  // Карточкада «Орталығы: Астана» орнына — қаланың мәртебесі
  status: { kk: "Мәртебесі", ru: "Статус", en: "Status", zh: "地位", es: "Estatus", de: "Status", fr: "Statut", tr: "Statü", ar: "الوضع", ko: "지위", ja: "地位" },
  cityStatus: { kk: "Республикалық маңызы бар қала", ru: "Город республиканского значения", en: "City of republican significance", zh: "直辖市", es: "Ciudad de importancia republicana", de: "Stadt von republikanischer Bedeutung", fr: "Ville d’importance républicaine", tr: "Cumhuriyet önemindeki şehir", ar: "مدينة ذات أهمية جمهورية", ko: "공화국 직할시", ja: "共和国直轄市" },
  capital: { kk: "Елорда", ru: "Столица", en: "Capital", zh: "首都", es: "Capital", de: "Hauptstadt", fr: "Capitale", tr: "Başkent", ar: "العاصمة", ko: "수도", ja: "首都" },
  again: { kk: "Мөр паспортта бар — қайта тапсырғанда XP берілмейді.", ru: "Штамп уже в паспорте — за повтор XP не начисляются.", en: "The stamp is already in your passport — retakes give no XP.", zh: "护照里已有这枚印章——重考不再获得XP。", es: "El sello ya está en tu pasaporte: repetir no da XP.", de: "Der Stempel ist schon im Pass – Wiederholungen bringen keine XP.", fr: "Le tampon est déjà dans ton passeport : refaire le test ne rapporte pas d’XP.", tr: "Damga zaten pasaportunda — tekrar çözmek XP kazandırmaz.", ar: "الختم موجود في جوازك بالفعل — الإعادة لا تمنح نقاط XP.", ko: "이미 여권에 도장이 있어요 — 다시 풀어도 XP는 없어요.", ja: "スタンプはもうパスポートにあります — 再挑戦ではXPはもらえません。" },
};
export const tq = (key, lang) => TQ[key]?.[lang] || TQ[key]?.en;

// Республикалық маңызы бар қалалар: «Бос орынды толтыр» — сөйлем карточкадағы деректен (fact.kk), жауабы сол деректе бар
export const CITY_BLANK = {
  astana: { text: "Астана — Қазақстанның ___.", answer: "елордасы", wrong: ["ауылы", "өзені", "тауы"] },
  "almaty-city": { text: "Алматының атауы «___» сөзімен байланысты.", answer: "алма", wrong: ["нан", "мұз", "көл"] },
  shymkent: { text: "Шымкент 2018 жылдан бері ___ маңызы бар қала.", answer: "республикалық", wrong: ["ауылдық", "аудандық", "облыстық"] },
};

// Облыстың бұрынғы орталықтары (немесе оған жақын тарихи орталықтар): бұларды қате нұсқа ретінде бермейміз
export const PAST_CENTERS = {
  "almaty-reg": ["Талдықорған"],
  zhetysu: ["Қонаев"],
  ulytau: ["Қарағанды"],
  karaganda: ["Жезқазған"],
  abai: ["Өскемен"],
  "east-kz": ["Семей"],
};

// Мағынасы жақын сөздер: бір-біріне қате нұсқа болмайды
export const CLOSE = [["егін", "бидай", "дән"], ["кесене", "күмбез"], ["тау", "шың", "төбе", "жартас"], ["шөл", "құм", "бархан"], ["көмір", "кеніш"]];
const closeTo = (a, b) => CLOSE.some((g) => g.includes(a) && g.includes(b));

const norm = (s) => String(s || "").toLocaleLowerCase().replace(/ё/g, "е").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const overlap = (a, b) => {
  const x = norm(a), y = norm(b);
  return !x || !y || x === y || x.includes(y) || y.includes(x);
};

const defShuffle = (a) => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

// Сөз сұрағына жарайтын қате нұсқалар (тек қазақшасы, ру/ағылшынша және таңдалған тілдегі аудармасы басқа)
export function wordDistractors(w, trFn, explain) {
  const seen = new Set();
  const out = [];
  for (const p of REGIONS.flatMap((x) => x.words)) {
    if (seen.has(p.kk)) continue;
    seen.add(p.kk);
    if (p.kk === w.kk || closeTo(p.kk, w.kk)) continue;
    if (overlap(p.en, w.en) || overlap(p.ru, w.ru) || overlap(trFn(p, explain), trFn(w, explain))) continue;
    out.push(p);
  }
  return out;
}

// Облыс сұрағының қате нұсқалары: басқа облыстардың орталықтары
export function centerDistractors(r) {
  const past = new Set(PAST_CENTERS[r.id] || []);
  return REGIONS.filter((x) => !x.city && x.id !== r.id && x.center.kk !== r.center.kk && !past.has(x.center.kk)).map((x) => x.center);
}

export const PASS = 4;
// Тест нәтижесі → мөр: ok — өтті ме, had — мөр бұрыннан бар ма, grant — мөр басып, XP/тиын беру керек пе.
// Мөр мен марапат әр өңірге бір рет қана (қайта ашып тапсырғанда да, қатаң түрде state.stamps бойынша).
export function stampOutcome(stamps, id, right, pass = PASS) {
  const ok = right >= pass;
  const had = Boolean(stamps?.[id]);
  return { ok, had, grant: ok && !had };
}

// t.quizWord — интерфейстің ««w» сөзінің аудармасы қандай?» үлгісі; trFn — lib/wordTools tr
export function buildRegionQuiz(r, { lang, explain, quizWord, trFn, shuffle = defShuffle }) {
  const qs = [];
  if (r.city) {
    const b = CITY_BLANK[r.id];
    if (b) {
      qs.push({
        prompt: `${tq("blank", lang)}: ${b.text}`,
        options: shuffle([b.answer, ...b.wrong]).map((o) => ({ key: o, label: o })),
        answer: b.answer,
        kind: "blank",
      });
    }
  } else {
    const fn = TQ.center[lang] || TQ.center.en;
    const wrong = shuffle(centerDistractors(r)).slice(0, 3);
    qs.push({
      prompt: fn(L(r.name, lang)),
      options: shuffle([r.center, ...wrong]).map((c) => ({ key: c.kk, label: L(c, lang) })),
      answer: r.center.kk,
      kind: "center",
    });
  }
  for (const w of r.words) {
    const picked = [];
    for (const p of shuffle(wordDistractors(w, trFn, explain))) {
      if (picked.length >= 3) break;
      // қате нұсқалардың өзара аудармасы да қайталанбасын
      if (picked.some((z) => overlap(trFn(z, explain), trFn(p, explain)) || closeTo(z.kk, p.kk))) continue;
      picked.push(p);
    }
    qs.push({
      prompt: quizWord(w.kk),
      options: shuffle([w, ...picked]).map((o) => ({ key: o.kk, label: trFn(o, explain), e: o.e })),
      answer: w.kk,
      kind: "word",
    });
  }
  return qs;
}
