// Aqyl чатының режимдері (11 тіл): сөйлесу, жазуды түзету, айтылымды тексеру.
// Қолданылуы: /app/qyran (режим қойындылары), басты беттегі «Түзету» тақтайшасы.
const L = {
  kk: { group: "Aqyl-мен жұмыс түрі", chat: "Сөйлесу", write: "Жазуымды түзет", speak: "Айтылымды тексер" },
  ru: { group: "Режим работы с Aqyl", chat: "Разговор", write: "Исправь мой текст", speak: "Проверь произношение" },
  en: { group: "Aqyl mode", chat: "Chat", write: "Fix my writing", speak: "Check my pronunciation" },
  zh: { group: "Aqyl 模式", chat: "聊天", write: "修改我的写作", speak: "检查我的发音" },
  es: { group: "Modo de Aqyl", chat: "Conversar", write: "Corrige mi texto", speak: "Revisa mi pronunciación" },
  de: { group: "Aqyl-Modus", chat: "Gespräch", write: "Text korrigieren", speak: "Aussprache prüfen" },
  fr: { group: "Mode Aqyl", chat: "Discuter", write: "Corrige mon texte", speak: "Vérifie ma prononciation" },
  tr: { group: "Aqyl modu", chat: "Sohbet", write: "Yazımı düzelt", speak: "Telaffuzumu kontrol et" },
  ar: { group: "وضع Aqyl", chat: "محادثة", write: "صحّح كتابتي", speak: "افحص نطقي" },
  ko: { group: "Aqyl 모드", chat: "대화", write: "글 고치기", speak: "발음 확인" },
  ja: { group: "Aqylのモード", chat: "会話", write: "作文を添削", speak: "発音をチェック" },
};

export const modeL = (lang) => L[lang] || L.en;
export const MODES = ["chat", "write", "speak"];
