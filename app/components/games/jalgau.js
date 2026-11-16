// «Жалғау» ойынының ереже қозғалтқышы: қазақ тіліндегі жалғауларды дыбыс үндестігі бойынша таңдау.
// Таза функциялар (React жоқ) — jalgau.test.mjs арқылы тексеріледі.
//
// Екі заңдылық:
//  1) Буын үндестігі — соңғы буындағы дауысты жуан (а о ұ ы я) болса жуан, жіңішке (ә е ө ү і э) болса жіңішке жалғау.
//  2) Дыбыс үндестігі — сөздің соңғы дыбысына қарай жалғаудың басқы дауыссызы өзгереді.
// Әдейі қамтылмаған: соңғы дауыстысы и / у / ю болатын сөздер (үндестігі жазудан көрінбейді) — harmony() null қайтарады.

const BACK = "аоұыя";
const FRONT = "әеөүіэ";
const VOWELS = "аәеиоөұүыіэюяё";

const lower = (w) => w.toLowerCase();

/** Соңғы буынның үндестігі: "back" | "front" | null (анықталмайды). */
export function harmony(word) {
  const w = lower(word);
  for (let i = w.length - 1; i >= 0; i--) {
    const c = w[i];
    if (BACK.includes(c)) return "back";
    if (FRONT.includes(c)) return "front";
    if (c === "у") {
      // дауыстыдан кейінгі «у» — дауыссыз (тау, ауыл): әрі қарай іздейміз; дауыссыздан кейінгі «у» — екіұшты
      if (i > 0 && VOWELS.includes(w[i - 1])) continue;
      return null;
    }
    if (c === "и" || c === "ю" || c === "ё") return null;
  }
  return null;
}

/** Соңғы дыбыстың тобы: V дауысты · R (р й у) · L (л) · N (м н ң) · Z (ж з) · T қатаң және б в г д. */
export function endClass(word) {
  const w = lower(word);
  const c = w[w.length - 1];
  const prev = w[w.length - 2] || "";
  if (c === "у") return prev && VOWELS.includes(prev) ? "R" : "V";
  if (VOWELS.includes(c)) return "V";
  if (c === "р" || c === "й") return "R";
  if (c === "л") return "L";
  if ("мнң".includes(c)) return "N";
  if ("жз".includes(c)) return "Z";
  if ("кқпстфхһцчшщбвгд".includes(c)) return "T";
  return null;
}

// Әр форма: соңғы дыбыс тобы → [жуан, жіңішке] нұсқа
const TABLE = {
  pl: { V: ["лар", "лер"], R: ["лар", "лер"], L: ["дар", "дер"], N: ["дар", "дер"], Z: ["дар", "дер"], T: ["тар", "тер"] },
  dat: { V: ["ға", "ге"], R: ["ға", "ге"], L: ["ға", "ге"], N: ["ға", "ге"], Z: ["ға", "ге"], T: ["қа", "ке"] },
  loc: { V: ["да", "де"], R: ["да", "де"], L: ["да", "де"], N: ["да", "де"], Z: ["да", "де"], T: ["та", "те"] },
  abl: { V: ["дан", "ден"], R: ["дан", "ден"], L: ["дан", "ден"], N: ["нан", "нен"], Z: ["дан", "ден"], T: ["тан", "тен"] },
  acc: { V: ["ны", "ні"], R: ["ды", "ді"], L: ["ды", "ді"], N: ["ды", "ді"], Z: ["ды", "ді"], T: ["ты", "ті"] },
  gen: { V: ["ның", "нің"], R: ["дың", "дің"], L: ["дың", "дің"], N: ["ның", "нің"], Z: ["дың", "дің"], T: ["тың", "тің"] },
  ins: { V: ["мен", "мен"], R: ["мен", "мен"], L: ["мен", "мен"], N: ["мен", "мен"], Z: ["бен", "бен"], T: ["пен", "пен"] },
};

/** Барлық нұсқалар (ойындағы жауап нұсқалары үшін). */
export const VARIANTS = {
  pl: ["лар", "лер", "дар", "дер", "тар", "тер"],
  dat: ["ға", "ге", "қа", "ке"],
  loc: ["да", "де", "та", "те"],
  abl: ["дан", "ден", "тан", "тен", "нан", "нен"],
  acc: ["ны", "ні", "ды", "ді", "ты", "ті"],
  gen: ["ның", "нің", "дың", "дің", "тың", "тің"],
  ins: ["мен", "бен", "пен"],
  p1: ["ым", "ім", "м"],
};
export const FORMS = Object.keys(VARIANTS);

// Тәуелдік жалғауында соңғы қатаң ұяңданады: п→б, к→г, қ→ғ
const VOICE = { п: "б", к: "г", қ: "ғ" };

/**
 * Сөзге жалғау жалғау.
 * @returns {{stem:string, suffix:string, form:string, harmony:"back"|"front", cls:string, last:string, vowel:string, voiced:null|[string,string]}|null}
 */
export function attach(word, form) {
  const h = harmony(word);
  const cls = endClass(word);
  if (!h || !cls) return null;
  const w = word;
  const last = lower(w).slice(-1);
  const vowel = lastVowel(w);
  const base = { form, harmony: h, cls, last, vowel, voiced: null };
  if (form === "p1") {
    if (cls === "V") return { ...base, stem: w, suffix: "м", result: w + "м" };
    const v = VOICE[last];
    const stem = v ? w.slice(0, -1) + v : w;
    const suffix = h === "back" ? "ым" : "ім";
    return { ...base, stem, suffix, result: stem + suffix, voiced: v ? [last, v] : null };
  }
  const row = TABLE[form]?.[cls];
  if (!row) return null;
  const suffix = row[h === "back" ? 0 : 1];
  return { ...base, stem: w, suffix, result: w + suffix };
}

/** Үндестікті анықтаған дауысты әріп. */
export function lastVowel(word) {
  const w = lower(word);
  for (let i = w.length - 1; i >= 0; i--) if (BACK.includes(w[i]) || FRONT.includes(w[i])) return w[i];
  return "";
}

/** Жалғаудың «егізі»: сол дауыссыз, бірақ қарсы үндестік (мыс. лар ↔ лер). */
export function twin(form, suffix) {
  const swap = { а: "е", е: "а", ы: "і", і: "ы" };
  const t = suffix.replace(/[аеыі]/, (c) => swap[c]);
  return t !== suffix && VARIANTS[form].includes(t) ? t : null;
}

/**
 * Жауап нұсқалары: дұрысы + үндестік егізі + дыбыс үндестігінің қате нұсқалары.
 * @param {number} n нұсқа саны (3 немесе 4)
 */
export function optionsFor(form, suffix, n, rnd = Math.random) {
  const all = VARIANTS[form];
  const out = [suffix];
  const tw = twin(form, suffix);
  if (tw) out.push(tw);
  const sameHarm = all.filter((s) => !out.includes(s) && harmOf(s) === harmOf(suffix));
  const rest = all.filter((s) => !out.includes(s) && !sameHarm.includes(s));
  const pick = (arr) => arr.splice(Math.floor(rnd() * arr.length), 1)[0];
  while (out.length < Math.min(n, all.length)) out.push(sameHarm.length ? pick(sameHarm) : pick(rest));
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
function harmOf(s) {
  if (/[аы]/.test(s)) return "back";
  if (/[еі]/.test(s)) return "front";
  return "none";
}

/* ═════ Тексерілген сөз тізімі ═════
   Тек жалғауы ережеге дәл бағынатын, жиі қолданылатын зат есімдер.
   Кірмейтіндер: кірме сөздер (билет, паспорт…), соңғы дауыстысы и/у/ю сөздер (су, ту, би, ит, аю, ми…). */
export const NOUNS = (
  "ана әке әже ата бала дос аға шеше іні апа ұл қыз немере көрші жезде жігіт бөбек әйел ақсақал келін қонақ " +
  "жылқы түйе қой сиыр мысық бүркіт қасқыр түлкі барыс құс балық ешкі қоян арыстан піл тауық қаз үйрек жылан бақа көбелек ара марал тышқан сұңқар торғай қозы құлын бота қарға шыбын есек қошқар маса бұқа кірпі жолбарыс үкі тасбақа қабан құлан бөдене бұғы " +
  "нан алма жұмыртқа қарбыз қауын сәбіз пияз жеміс көкөніс алмұрт жүзім өрік тамақ шай ет сүт қымыз бал тұз қант май қияр " +
  "күн ай жұлдыз тау көл өзен дала орман гүл ағаш теңіз шөл бұлт жапырақ тас шың бұлақ құдық арал жер от қайың терек тал шөп үңгір жартас аңғар қарағай қар жаңбыр жел құм мұз аспан " +
  "үй қала ауыл жол көлік дүкен мектеп сапар кезек жүк орын ұшақ әуежай ақша " +
  "бөлме есік терезе төсек үстел орындық шам кілем бақша қабат шатыр кілт шаңырақ қабырға еден төбе айна қақпа перде жастық көрпе ыдыс қасық пышақ кесе тәрелке шанышқы дәліз аула " +
  "бас көз құлақ мұрын ауыз тіс қол саусақ аяқ жүрек арқа иық шаш бет мойын тіл қабақ кірпік ерін сақал маңдай жақ иек тырнақ білек шынтақ кеуде бел тізе табан өкше бауыр өкпе сүйек тері " +
  "көйлек шалбар бөрік қолғап етік шұлық жейде шапан белбеу сөмке қалпақ тон қалта түйме сақина білезік алқа сырға киім " +
  "түн таң кеш сағат апта жыл күз қыс жаз көктем " +
  "мұғалім оқушы кітап дәптер қалам қарындаш сабақ сынып тақта сұрақ жауап сөздік оқулық өшіргіш сызғыш қоңырау пән " +
  "көше базар аурухана дәріхана мешіт саябақ көпір алаң мұражай кітапхана аудан ғимарат ескерткіш тұрғын " +
  "дәрігер жүргізуші аспаз сатушы малшы ақын әнші ұшқыш ғалым тігінші ұста жазушы сарбаз заңгер суретші " +
  "кеме аялдама арба шана ат доңғалақ тұрақ " +
  "домбыра қобыз бата сыйлық дастархан асық кереге сандық жайлау қыстау көш " +
  "баға теңге сөре тауар ел ұлт хат жұмыс мақсат хан батыр қылыш найза садақ қалқан керуен ғасыр жыр сурет ән ойын арман үміт халық заң азамат көмек білім тапсырма жоба еңбек зауыт қағаз көшет"
).split(" ");

// Санауға келмейтін (заттық, дерексіз) есімдер — көптік жалғауда сұралмайды
export const NO_PLURAL = new Set("шай ет сүт қымыз бал тұз қант май қар жаңбыр жел құм мұз аспан ақша тамақ еңбек білім көмек үміт".split(" "));
// Тәуелдік жалғауында түбірі өзгеретін сөздер (ауыз → аузым, халық → халқым…) — тәуелдікте сұралмайды
export const NO_POSS = new Set("ауыз мұрын ерін орын мойын халық бөрік".split(" "));

export function allowed(word, form) {
  const w = lower(word);
  if (form === "pl" && NO_PLURAL.has(w)) return false;
  if (form === "p1" && NO_POSS.has(w)) return false;
  return true;
}
