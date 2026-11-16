// Деңгей тесті бетінің қосымша мәтіндері — 11 тіл (жоқ тіл ағылшыншаға түседі).
const L = {
  kk: { tip: "Асықпа. Білмесең — «Білмеймін» деп бас, бұл да жауап.", next: "Әрі қарай не болады?", per: "Деңгейлер бойынша", journey: "Деңгей сапары" },
  ru: { tip: "Не спешите. Если не знаете — нажмите «Не знаю», это тоже ответ.", next: "Что дальше?", per: "По уровням", journey: "Путь к уровню" },
  en: { tip: "Take your time. If you're not sure, tap “I don't know” — that's an answer too.", next: "What happens next?", per: "By level", journey: "Placement journey" },
  zh: { tip: "别着急。不知道就点“不知道”，这也是一个答案。", next: "接下来会怎样？", per: "各级别结果", journey: "水平之旅" },
  es: { tip: "Sin prisa. Si no lo sabes, pulsa «No lo sé»: también es una respuesta.", next: "¿Qué sigue?", per: "Por nivel", journey: "Viaje de nivel" },
  de: { tip: "Lass dir Zeit. Wenn du es nicht weißt, tippe auf „Weiß nicht“ – auch das ist eine Antwort.", next: "Wie geht es weiter?", per: "Nach Stufe", journey: "Einstufungsreise" },
  fr: { tip: "Prends ton temps. Si tu ne sais pas, touche « Je ne sais pas » : c'est aussi une réponse.", next: "Et ensuite ?", per: "Par niveau", journey: "Parcours de niveau" },
  tr: { tip: "Acele etme. Bilmiyorsan “Bilmiyorum”a dokun — bu da bir cevap.", next: "Sırada ne var?", per: "Seviyelere göre", journey: "Seviye yolculuğu" },
  ar: { tip: "لا تستعجل. إن لم تعرف فاضغط «لا أعرف» — فهذا أيضًا جواب.", next: "ماذا بعد؟", per: "حسب المستوى", journey: "رحلة تحديد المستوى" },
  ko: { tip: "천천히 하세요. 모르면 ‘모르겠어요’를 누르세요. 그것도 답이에요.", next: "다음은 무엇인가요?", per: "레벨별 결과", journey: "레벨 여정" },
  ja: { tip: "あせらずに。わからなければ「わからない」を押してください。それも答えです。", next: "次はどうなる？", per: "レベル別", journey: "レベルの旅" },
};
export const levelL = (lang) => L[lang] || L.en;
