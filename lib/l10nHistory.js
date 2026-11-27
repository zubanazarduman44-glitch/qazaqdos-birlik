// Тарих бөлімінің аудармалары. Тарихи атаулар (ескерткіш аттары) аударылмайды.
// lib/l10n/history/<тіл>.js тек керек кезде жүктеледі (бір тіл — бір шағын чанк):
//  • интерфейс тілі (lang) — дәуір атаулары (H.<id>.era), сүзгілер (ERA.*), жыл үлгілері (YEAR.*);
//  • түсіндіру тілі (explain) — қазақша мәтіннің аудармасы (P.<id>.<n>) мен сұрақтардың аудармасы (Q.<id>.<n>).
// ru/en дәуір атаулары lib/history.js ішінде; ал мәтін аудармалары барлық 10 тілде бөлек файлда.
import { useEffect, useState } from "react";
import { SITES } from "./history";

const LANGS = ["ru", "en", "zh", "es", "de", "fr", "tr", "ar", "ko", "ja"];
const cache = {};
// Дәуір сүзгілерінің аттары мен жыл үлгілері: { lang: { "ERA.old": "...", "YEAR.bc": "{n} ..." } }
export const HIST_UI = {};
// Мәтін мен сұрақ аудармалары: { lang: { "P.botai.0": "...", "Q.botai.0": "..." } }
export const HIST_TR = {};

function load(lang) {
  if (!LANGS.includes(lang)) return Promise.resolve(null);
  if (!cache[lang]) cache[lang] = import(`./l10n/history/${lang}.js`).then((m) => m.default || null).catch(() => null);
  return cache[lang];
}

function patch(map, lang) {
  if (HIST_TR[lang]) return;
  const byId = Object.fromEntries(SITES.map((s) => [s.id, s]));
  const ui = (HIST_UI[lang] = HIST_UI[lang] || {});
  const tr = (HIST_TR[lang] = {});
  for (const [k, v] of Object.entries(map)) {
    if (!v) continue;
    if (k.startsWith("H.")) {
      const [, id, field] = k.split(".");
      const obj = byId[id]?.[field];
      if (obj && typeof obj === "object" && !obj[lang]) obj[lang] = v;
    } else if (k.startsWith("P.") || k.startsWith("Q.")) tr[k] = v;
    else ui[k] = v;
  }
}

// Интерфейс тілі мен түсіндіру тілінің файлдарын жүктейді; жүктелген соң бетті қайта салу үшін нұсқа нөмірін қайтарады
export function useHistoryL10n(lang, explain) {
  const [ver, setVer] = useState(0);
  useEffect(() => {
    let dead = false;
    for (const l of new Set([lang, explain])) {
      load(l).then((map) => {
        if (!map || dead) return;
        patch(map, l);
        setVer((v) => v + 1);
      });
    }
    return () => {
      dead = true;
    };
  }, [lang, explain]);
  return ver;
}

export const histTr = (lang, key) => HIST_TR[lang]?.[key] || "";

// Тарих бетінің жаңа белгілері — 11 тіл
const HL = {
  kk: {
    sub: "Уақыт жолымен жүріп, Ұлы даланың көне мекендерімен таныс. Әр орында — қысқа мәтін, 3 жаңа сөз және шағын тест.",
    tabSites: "Тарихи орындар", tabArts: "Жәдігерлер",
    parts: ["Не табылды?", "Қалай өмір сүрген?", "Неге маңызды?", "Қызық дерек"],
    view3d: "3D-де қарау", trShow: "Аудармасын көрсету", trHide: "Аударманы жасыру",
    guide: "Мәтінді оқып шық. Сұрақтардың жауабы осы мәтінде бар.",
    inText: "Мәтінде:", words: "Жаңа сөздер", quiz: "Сұрақтарға жауап беру",
    qCount: (n) => `${n} сұрақ`, wordQ: (w) => `«${w}» сөзі нені білдіреді?`,
  },
  ru: {
    sub: "Пройдите по ленте времени и познакомьтесь с древними местами Великой степи. В каждом месте — короткий текст, 3 новых слова и небольшой тест.",
    tabSites: "Исторические места", tabArts: "Артефакты",
    parts: ["Что нашли?", "Как жили?", "Почему это важно?", "Интересный факт"],
    view3d: "Смотреть в 3D", trShow: "Показать перевод", trHide: "Скрыть перевод",
    guide: "Прочитайте текст: ответы на все вопросы есть в нём.",
    inText: "В тексте:", words: "Новые слова", quiz: "Ответить на вопросы",
    qCount: (n) => `${n} вопросов`, wordQ: (w) => `Что значит слово «${w}»?`,
  },
  en: {
    sub: "Follow the timeline and meet the ancient places of the Great Steppe. Each site has a short text, 3 new words and a short quiz.",
    tabSites: "Historic sites", tabArts: "Artifacts",
    parts: ["What was found?", "How did people live?", "Why does it matter?", "Fun fact"],
    view3d: "View in 3D", trShow: "Show translation", trHide: "Hide translation",
    guide: "Read the text: the answers to all the questions are in it.",
    inText: "In the text:", words: "New words", quiz: "Answer the questions",
    qCount: (n) => `${n} questions`, wordQ: (w) => `What does «${w}» mean?`,
  },
  zh: {
    sub: "沿着时间线，认识欧亚大草原的古老遗址。每个地方都有一篇短文、3个新词和一个小测验。",
    tabSites: "历史遗址", tabArts: "文物",
    parts: ["发现了什么？", "人们如何生活？", "为什么重要？", "趣闻"],
    view3d: "3D查看", trShow: "显示译文", trHide: "隐藏译文",
    guide: "先读短文：所有问题的答案都在里面。",
    inText: "原文：", words: "生词", quiz: "回答问题",
    qCount: (n) => `${n}道题`, wordQ: (w) => `“${w}”是什么意思？`,
  },
  es: {
    sub: "Recorre la línea del tiempo y conoce los lugares antiguos de la Gran Estepa. Cada lugar tiene un texto breve, 3 palabras nuevas y un test corto.",
    tabSites: "Lugares históricos", tabArts: "Artefactos",
    parts: ["¿Qué se encontró?", "¿Cómo vivían?", "¿Por qué es importante?", "Dato curioso"],
    view3d: "Ver en 3D", trShow: "Mostrar traducción", trHide: "Ocultar traducción",
    guide: "Lee el texto: las respuestas a todas las preguntas están en él.",
    inText: "En el texto:", words: "Palabras nuevas", quiz: "Responder a las preguntas",
    qCount: (n) => `${n} preguntas`, wordQ: (w) => `¿Qué significa «${w}»?`,
  },
  de: {
    sub: "Folge der Zeitleiste und lerne die alten Orte der Großen Steppe kennen. Jeder Ort hat einen kurzen Text, 3 neue Wörter und ein kleines Quiz.",
    tabSites: "Historische Orte", tabArts: "Artefakte",
    parts: ["Was wurde gefunden?", "Wie lebten die Menschen?", "Warum ist es wichtig?", "Wissenswertes"],
    view3d: "In 3D ansehen", trShow: "Übersetzung zeigen", trHide: "Übersetzung ausblenden",
    guide: "Lies den Text: Alle Antworten auf die Fragen stehen darin.",
    inText: "Im Text:", words: "Neue Wörter", quiz: "Fragen beantworten",
    qCount: (n) => `${n} Fragen`, wordQ: (w) => `Was bedeutet „${w}“?`,
  },
  fr: {
    sub: "Suivez la frise chronologique et découvrez les lieux anciens de la Grande Steppe. Chaque site propose un court texte, 3 mots nouveaux et un petit quiz.",
    tabSites: "Sites historiques", tabArts: "Artefacts",
    parts: ["Qu'a-t-on trouvé ?", "Comment vivait-on ?", "Pourquoi est-ce important ?", "Le saviez-vous ?"],
    view3d: "Voir en 3D", trShow: "Afficher la traduction", trHide: "Masquer la traduction",
    guide: "Lisez le texte : toutes les réponses s'y trouvent.",
    inText: "Dans le texte :", words: "Mots nouveaux", quiz: "Répondre aux questions",
    qCount: (n) => `${n} questions`, wordQ: (w) => `Que signifie « ${w} » ?`,
  },
  tr: {
    sub: "Zaman çizgisini izle, Büyük Bozkır'ın eski yerlerini tanı. Her yerde kısa bir metin, 3 yeni kelime ve küçük bir test var.",
    tabSites: "Tarihî yerler", tabArts: "Eserler",
    parts: ["Ne bulundu?", "Nasıl yaşadılar?", "Neden önemli?", "İlginç bilgi"],
    view3d: "3D olarak bak", trShow: "Çeviriyi göster", trHide: "Çeviriyi gizle",
    guide: "Metni oku: Bütün soruların cevabı bu metinde.",
    inText: "Metinde:", words: "Yeni kelimeler", quiz: "Soruları yanıtla",
    qCount: (n) => `${n} soru`, wordQ: (w) => `“${w}” ne demek?`,
  },
  ar: {
    sub: "اتبع خط الزمن وتعرّف إلى الأماكن القديمة في السهوب الكبرى. في كل موقع نص قصير و3 كلمات جديدة واختبار قصير.",
    tabSites: "المواقع التاريخية", tabArts: "القطع الأثرية",
    parts: ["ماذا وُجد؟", "كيف عاش الناس؟", "لماذا هو مهم؟", "معلومة طريفة"],
    view3d: "عرض ثلاثي الأبعاد", trShow: "إظهار الترجمة", trHide: "إخفاء الترجمة",
    guide: "اقرأ النص: إجابات كل الأسئلة موجودة فيه.",
    inText: "في النص:", words: "كلمات جديدة", quiz: "أجب عن الأسئلة",
    qCount: (n) => `${n} أسئلة`, wordQ: (w) => `ما معنى «${w}»؟`,
  },
  ko: {
    sub: "시간의 흐름을 따라 대초원의 옛 장소들을 만나 보세요. 장소마다 짧은 글, 새 낱말 3개, 짧은 퀴즈가 있습니다.",
    tabSites: "역사 유적", tabArts: "유물",
    parts: ["무엇이 발견되었나?", "어떻게 살았나?", "왜 중요한가?", "흥미로운 사실"],
    view3d: "3D로 보기", trShow: "번역 보기", trHide: "번역 숨기기",
    guide: "글을 읽어 보세요. 모든 질문의 답이 글 안에 있습니다.",
    inText: "본문:", words: "새 낱말", quiz: "질문에 답하기",
    qCount: (n) => `질문 ${n}개`, wordQ: (w) => `'${w}'은(는) 무슨 뜻일까요?`,
  },
  ja: {
    sub: "年表をたどって、大草原の古い場所を訪ねよう。どの場所にも短い文章、新しい単語3つ、ミニテストがあります。",
    tabSites: "史跡", tabArts: "遺物",
    parts: ["何が見つかった？", "どう暮らしていた？", "なぜ重要？", "豆知識"],
    view3d: "3Dで見る", trShow: "訳を表示", trHide: "訳を隠す",
    guide: "文章を読もう。質問の答えはすべてこの中にあります。",
    inText: "本文：", words: "新しい単語", quiz: "質問に答える",
    qCount: (n) => `${n}問`, wordQ: (w) => `「${w}」の意味は？`,
  },
};
export const hl = (lang) => HL[lang] || HL.en;
