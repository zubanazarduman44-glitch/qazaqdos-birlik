// «Көш» — басты беттегі оқу жолы: курс бөлімдері Қазақстан өңірлеріне жол бойымен бөлінеді.
// Жеңіл модуль (геометриясыз): басты бет те, карта (KoshMap, жалқау жүктеледі) те осыны қолданады.
//
// Жол реті — тұйық шеңбер. Көш елдің жүрегі Ұлытаудан (Жошы хан кесенесі, мемлекеттіліктің бесігі) шығады,
// солтүстікке — Қарағанды, Астана, Ақмола, Солтүстік Қазақстан; шығысқа — Павлодар, Абай, Шығыс Қазақстан;
// оңтүстікке — Жетісу, Алматы облысы мен қаласы, Жамбыл, Шымкент, Түркістан, Қызылорда; батысқа — Маңғыстау,
// Атырау, Батыс Қазақстан, Ақтөбе; соңында Ұлытаумен шектес Қостанайға келіп, шеңбер тұйықталады.
// Бөлімдер өңірлерге тең үлеспен бөлінеді (38 бөлім → 20 өңір: 1–2 бөлімнен), сондықтан курс өзгерсе де жол бұзылмайды.
import { LEVELS, UNITS } from "../../lib/courseIndex";

// [id (lib/regions.js), kzmap кілті]
export const KOSH = [
  ["ulytau", "Ұлытау облысы"], ["karaganda", "Қарағанды облысы"], ["astana", "Астана"], ["akmola", "Ақмола облысы"],
  ["north-kz", "Солтүстік Қазақстан облысы"], ["pavlodar", "Павлодар облысы"], ["abai", "Абай облысы"], ["east-kz", "Шығыс Қазақстан облысы"],
  ["zhetysu", "Жетісу облысы"], ["almaty-reg", "Алматы облысы"], ["almaty-city", "Алматы"], ["zhambyl", "Жамбыл облысы"],
  ["shymkent", "Шымкент"], ["turkistan", "Түркістан облысы"], ["kyzylorda", "Қызылорда облысы"], ["mangystau", "Маңғыстау облысы"],
  ["atyrau", "Атырау облысы"], ["west-kz", "Батыс Қазақстан облысы"], ["aktobe", "Ақтөбе облысы"], ["kostanay", "Қостанай облысы"],
];

const LANGS = ["kk", "ru", "en", "zh", "es", "de", "fr", "tr", "ar", "ko", "ja"];
// Өңір атаулары, 11 тілде (LANGS ретімен). Саяхат бөліміндегі аудармалармен бірдей.
const N = {
  ulytau: ["Ұлытау облысы", "Улытауская область", "Ulytau Region", "乌勒套州", "Región de Ulytau", "Gebiet Ulytau", "Région d’Oulytaou", "Ulıtav Bölgesi", "منطقة أوليتاو", "울르타우주", "ウルタウ州"],
  karaganda: ["Қарағанды облысы", "Карагандинская область", "Karaganda Region", "卡拉干达州", "Región de Karagandá", "Gebiet Qaraghandy", "Région de Karaganda", "Karağandı Bölgesi", "منطقة قاراغاندا", "카라간다주", "カラガンダ州"],
  astana: ["Астана қаласы", "город Астана", "Astana city", "阿斯塔纳市", "Astaná", "Astana (Stadt)", "Astana (ville)", "Astana şehri", "مدينة أستانا", "아스타나시", "アスタナ市"],
  akmola: ["Ақмола облысы", "Акмолинская область", "Akmola Region", "阿克莫拉州", "Región de Akmola", "Gebiet Aqmola", "Région d’Akmola", "Akmola Bölgesi", "منطقة أقمولا", "아크몰라주", "アクモラ州"],
  "north-kz": ["Солтүстік Қазақстан облысы", "Северо-Казахстанская область", "North Kazakhstan Region", "北哈萨克斯坦州", "Región de Kazajistán Septentrional", "Gebiet Nordkasachstan", "Région du Kazakhstan-Septentrional", "Kuzey Kazakistan Bölgesi", "منطقة شمال كازاخستان", "북카자흐스탄주", "北カザフスタン州"],
  pavlodar: ["Павлодар облысы", "Павлодарская область", "Pavlodar Region", "巴甫洛达尔州", "Región de Pávlodar", "Gebiet Pawlodar", "Région de Pavlodar", "Pavlodar Bölgesi", "منطقة بافلودار", "파블로다르주", "パヴロダル州"],
  abai: ["Абай облысы", "Абайская область", "Abai Region", "阿拜州", "Región de Abái", "Gebiet Abai", "Région d’Abaï", "Abay Bölgesi", "منطقة أباي", "아바이주", "アバイ州"],
  "east-kz": ["Шығыс Қазақстан облысы", "Восточно-Казахстанская область", "East Kazakhstan Region", "东哈萨克斯坦州", "Región de Kazajistán Oriental", "Gebiet Ostkasachstan", "Région du Kazakhstan-Oriental", "Doğu Kazakistan Bölgesi", "منطقة شرق كازاخستان", "동카자흐스탄주", "東カザフスタン州"],
  zhetysu: ["Жетісу облысы", "область Жетысу", "Zhetysu Region", "杰特苏州", "Región de Zhetysu", "Gebiet Schetissu", "Région de Jetyssou", "Jetisu Bölgesi", "منطقة جيتيسو", "제티수주", "ジェティス州"],
  "almaty-reg": ["Алматы облысы", "Алматинская область", "Almaty Region", "阿拉木图州", "Región de Almatý", "Gebiet Almaty", "Région d’Almaty", "Almatı Bölgesi", "منطقة ألماتي", "알마티주", "アルマトイ州"],
  "almaty-city": ["Алматы қаласы", "город Алматы", "Almaty city", "阿拉木图市", "Almatý (ciudad)", "Almaty (Stadt)", "Almaty (ville)", "Almatı şehri", "مدينة ألماتي", "알마티시", "アルマトイ市"],
  zhambyl: ["Жамбыл облысы", "Жамбылская область", "Zhambyl Region", "江布尔州", "Región de Zhambyl", "Gebiet Schambyl", "Région de Jambyl", "Jambıl Bölgesi", "منطقة جامبيل", "잠빌주", "ジャンブル州"],
  shymkent: ["Шымкент қаласы", "город Шымкент", "Shymkent city", "奇姆肯特市", "Shymkent (ciudad)", "Schymkent (Stadt)", "Chymkent (ville)", "Şımkent şehri", "مدينة شيمكنت", "심켄트시", "シムケント市"],
  turkistan: ["Түркістан облысы", "Туркестанская область", "Turkistan Region", "突厥斯坦州", "Región de Turkestán", "Gebiet Türkistan", "Région du Turkestan", "Türkistan Bölgesi", "منطقة تركستان", "투르키스탄주", "トルキスタン州"],
  kyzylorda: ["Қызылорда облысы", "Кызылординская область", "Kyzylorda Region", "克孜勒奥尔达州", "Región de Kyzylorda", "Gebiet Qysylorda", "Région de Kyzylorda", "Kızılorda Bölgesi", "منطقة قيزيلوردا", "크질오르다주", "クズロルダ州"],
  mangystau: ["Маңғыстау облысы", "Мангистауская область", "Mangystau Region", "曼格斯套州", "Región de Mangystau", "Gebiet Mangghystau", "Région de Manguistaou", "Mangıstav Bölgesi", "منطقة مانغيستاو", "망기스타우주", "マンギスタウ州"],
  atyrau: ["Атырау облысы", "Атырауская область", "Atyrau Region", "阿特劳州", "Región de Atyrau", "Gebiet Atyrau", "Région d’Atyraou", "Atırav Bölgesi", "منطقة أتيراو", "아티라우주", "アティラウ州"],
  "west-kz": ["Батыс Қазақстан облысы", "Западно-Казахстанская область", "West Kazakhstan Region", "西哈萨克斯坦州", "Región de Kazajistán Occidental", "Gebiet Westkasachstan", "Région du Kazakhstan-Occidental", "Batı Kazakistan Bölgesi", "منطقة غرب كازاخستان", "서카자흐스탄주", "西カザフスタン州"],
  aktobe: ["Ақтөбе облысы", "Актюбинская область", "Aktobe Region", "阿克托别州", "Región de Aktobé", "Gebiet Aqtöbe", "Région d’Aktioubé", "Aktöbe Bölgesi", "منطقة أقتوبي", "아크토베주", "アクトベ州"],
  kostanay: ["Қостанай облысы", "Костанайская область", "Kostanay Region", "科斯塔奈州", "Región de Kostanái", "Gebiet Qostanai", "Région de Kostanaï", "Kostanay Bölgesi", "منطقة قوستاناي", "코스타나이주", "コスタナイ州"],
};
export const regionName = (id, lang) => { const a = N[id]; if (!a) return id; const i = LANGS.indexOf(lang); return a[i < 0 ? 2 : i] || a[2]; };

const ALL_UNITS = LEVELS.flatMap((l) => l.units);

/**
 * Көш күйі: әр өңір үшін бөлімдері, сабақтары және күйі.
 * state: "done" (бәрі өтілді — таңба) · "cur" (Aqyl осында) · "open" (алда, бірақ ішінде өтілген сабақ бар)
 *        · "next" (келесі ашылатын) · "locked" (жабық)
 * go — басқанда ашылатын сабақ id (бірінші өтілмеген, не бәрі өтілсе — біріншісі, қайталауға).
 */
export function koshRegions(done = {}) {
  const R = KOSH.length, U = ALL_UNITS.length;
  let cur = -1;
  const out = KOSH.map(([id, map], i) => {
    const units = ALL_UNITS.slice(Math.floor((i * U) / R), Math.floor(((i + 1) * U) / R));
    const lessons = units.flatMap((u) => UNITS[u]?.lessons || []);
    const doneN = lessons.filter((l) => done[l.id]).length;
    const first = lessons.find((l) => !done[l.id]) || lessons[0];
    return { id, map, i, units, lessons, total: lessons.length, doneN, go: first?.id, level: LEVELS.find((v) => v.units.includes(units[0]))?.id };
  });
  out.forEach((r) => {
    if (r.total && r.doneN >= r.total) r.state = "done";
    else if (cur < 0) { cur = r.i; r.state = "cur"; }
    else r.state = r.doneN > 0 ? "open" : r.i === cur + 1 ? "next" : "locked";
  });
  return out;
}
