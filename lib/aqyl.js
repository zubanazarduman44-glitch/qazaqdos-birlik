// Aqyl — сайттың кейіпкер-мұғалімі. Екі бейне бар: әңгімеші қыз (qyz, әдепкі) мен әңгімеші жігіт (jigit).
// Таңдау state.profile.aqyl ішінде сақталады (Store → setProfile), бейнелер public/aqyl/*.webp
// (scripts/build-aqyl-art.cjs art/aqyl-pair.webp суретінен қабаттарға бөліп шығарады).
// Барлық координат — кенептің бастапқы пиксельдерімен (490×950).

export const AQYL_IDS = ["qyz", "jigit"];
export const AQYL_DEFAULT = "qyz";
export const aqylId = (v) => (v === "jigit" ? "jigit" : "qyz");
export const aqylSrc = (id, layer) => `/aqyl/${aqylId(id)}-${layer}.webp`;

export const CANVAS = { w: 490, h: 950 };

// pivot — иық (қол осы нүктені айнала бұрылады); eyes — [cx, cy, rx, ry]; mouth — [cx, cy];
// face — портрет кадры [x, y, қабырға]; A — киім кигізетін нүктелер.
export const AQYL_GEOM = {
  qyz: {
    pivot: [208, 338],
    eyes: [[228, 197, 30, 28], [335, 217, 38, 25]],
    mouth: [270, 267],
    face: [91, 9, 380],
    A: {
      cx: 262, // дененің ортасы
      headCx: 270, headTop: 56, hairline: 150, headW: 250, hatRot: 0, // бас (шаш үсті, маңдай сызығы)
      ears: [[402, 268]], // көрінетін құлақ (сол жағы шаштың астында)
      neck: [282, 328], collarY: 352,
      sh: [206, 330], // иық сызығы (x сол/оң)
      shY: 340,
      waistY: 478, waistX: [202, 365], buckle: [255, 478],
      hipY: 520, hemY: 905, hemX: [92, 440],
      feet: [[150, 926], [345, 926]], footW: 112,
      // білек: оң қол (денеде), төмен түскен қол, көтерілген қол; elbow — шапан жеңі үшін
      wristR: [392, 583], wristDown: [138, 583], wristUp: [110, 404],
      armR: [[330, 345], [392, 583]], armDown: [[200, 345], [138, 583]], armUp: [[200, 345], [118, 476], [110, 408]],
      handR: [393, 625],
    },
  },
  jigit: {
    pivot: [219, 338],
    eyes: [[247, 184, 24, 24], [335, 202, 31, 23]],
    mouth: [280, 255],
    face: [107, 2, 368],
    A: {
      cx: 281,
      headCx: 304, headTop: 50, hairline: 126, headW: 252, hatRot: 7, // бас сәл оңға қисайған; бас киім тақияны толық жабады
      ears: [[176, 228], [392, 258]],
      neck: [282, 300], collarY: 330,
      sh: [214, 350],
      shY: 338,
      waistY: 508, waistX: [212, 352], buckle: [277, 508],
      hipY: 545, hemY: 900, hemX: [112, 430],
      feet: [[172, 922], [367, 922]], footW: 112,
      wristR: [404, 594], wristDown: [158, 594], wristUp: [140, 418],
      armR: [[345, 345], [404, 594]], armDown: [[218, 345], [158, 594]], armUp: [[218, 345], [150, 470], [142, 420]],
      handR: [400, 640],
    },
  },
};

// Атаулар (11 тіл). Қазақшасы: «Ақылдың бейнесі», «Әңгімеші қыз», «Әңгімеші жігіт».
export const AQYL_L10N = {
  kk: { look: "Ақылдың бейнесі", qyz: "Әңгімеші қыз", jigit: "Әңгімеші жігіт", my: "Менің Ақылым" },
  ru: { look: "Образ Ақыл", qyz: "Рассказчица", jigit: "Рассказчик", my: "Мой Ақыл" },
  en: { look: "Aqyl's look", qyz: "Storyteller girl", jigit: "Storyteller boy", my: "My Aqyl" },
  zh: { look: "Aqyl 的形象", qyz: "讲故事的女孩", jigit: "讲故事的男孩", my: "我的 Aqyl" },
  es: { look: "Aspecto de Aqyl", qyz: "Narradora", jigit: "Narrador", my: "Mi Aqyl" },
  de: { look: "Aqyls Aussehen", qyz: "Erzählerin", jigit: "Erzähler", my: "Mein Aqyl" },
  fr: { look: "Apparence d'Aqyl", qyz: "Conteuse", jigit: "Conteur", my: "Mon Aqyl" },
  tr: { look: "Aqyl'ın görünümü", qyz: "Anlatıcı kız", jigit: "Anlatıcı genç", my: "Aqyl'ım" },
  ar: { look: "مظهر أقيل", qyz: "الراوية", jigit: "الراوي", my: "أقيل الخاص بي" },
  ko: { look: "Aqyl의 모습", qyz: "이야기꾼 소녀", jigit: "이야기꾼 소년", my: "나의 Aqyl" },
  ja: { look: "Aqylの姿", qyz: "語り手の女の子", jigit: "語り手の男の子", my: "わたしのAqyl" },
};
export const aqylL = (lang) => AQYL_L10N[lang] || AQYL_L10N.en;
