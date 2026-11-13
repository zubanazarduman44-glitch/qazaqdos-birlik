// TopicArt — «Ақ киіз» felt-appliqué illustrations for the 38 Tilbil topics.
// Pure SVG, no <defs>/ids, so any number of instances can live on one page.
// Each picture = a rounded felt patch + one bold subject cut from solid shapes.

const K = "#0F5E7A"; // көк
const KD = "#0A4A61"; // dark көк
const R = "#A63A2B"; // madder
const G = "#E0A526"; // gold
const PG = "#F6E3B0"; // pale gold
const C = "#FAF6EE"; // cream
const I = "#1F2430"; // ink
const GR = "#2F6B4F"; // green
const T = "#1E8A8A"; // turquoise
const B = "#7A4A22"; // warm brown
const F = "#D9D2C2"; // felt grey

export const TOPIC_TINT = {
  greet: { bg: R, fg: PG },
  family: { bg: GR, fg: G },
  numbers: { bg: G, fg: I },
  colors: { bg: C, fg: I },
  food: { bg: T, fg: C },
  animals: { bg: K, fg: PG },
  home: { bg: K, fg: C },
  body: { bg: T, fg: PG },
  clothes: { bg: PG, fg: K },
  time: { bg: G, fg: C },
  school: { bg: R, fg: C },
  city: { bg: GR, fg: C },
  verbs: { bg: G, fg: I },
  adj: { bg: R, fg: PG },
  weather: { bg: K, fg: C },
  nature: { bg: PG, fg: K },
  jobs: { bg: C, fg: I },
  transport: { bg: T, fg: G },
  health: { bg: C, fg: R },
  shop: { bg: GR, fg: G },
  direction: { bg: G, fg: KD },
  travel: { bg: T, fg: I },
  feelings: { bg: R, fg: G },
  hobby: { bg: K, fg: G },
  tradition: { bg: R, fg: G },
  tech: { bg: G, fg: I },
  society: { bg: K, fg: C },
  eco: { bg: C, fg: GR },
  work: { bg: PG, fg: B },
  hist: { bg: GR, fg: PG },
  // B2 «Қыстау»
  media: { bg: K, fg: PG },
  economy: { bg: GR, fg: G },
  science: { bg: T, fg: C },
  art: { bg: R, fg: PG },
  edu: { bg: K, fg: G },
  law: { bg: PG, fg: B },
  mind: { bg: C, fg: K },
  idiom: { bg: GR, fg: C },
};

const FALLBACK_TINT = { bg: F, fg: K };
const LIGHT_BG = new Set([C, PG, G, F]);

// bottom band that follows the patch's rounded corners (ground, water…)
const groundPath = (y) =>
  `M2 ${y}H118V92a26 26 0 0 1-26 26H28a26 26 0 0 1-26-26Z`;

const ART = {
  // Сәлемдесу — a waving hand
  greet: () => (
    <>
      <g transform="translate(3 -4) rotate(-12 60 64)">
        <rect x="42" y="82" width="37" height="24" rx="5" fill={K} />
        <rect x="42" y="82" width="37" height="6" fill={G} />
        <path d="M45 74 27 57" stroke={PG} strokeWidth="12" strokeLinecap="round" />
        <rect x="38" y="30" width="10" height="36" rx="5" fill={PG} />
        <rect x="49.5" y="21" width="10" height="44" rx="5" fill={PG} />
        <rect x="61" y="23" width="10" height="42" rx="5" fill={PG} />
        <rect x="72.5" y="32" width="10" height="34" rx="5" fill={PG} />
        <rect x="38" y="50" width="44.5" height="38" rx="14" fill={PG} />
      </g>
      <path d="M90 30q9 9 7 22M98 20q12 14 8 33" fill="none" stroke={G} strokeWidth="5" strokeLinecap="round" />
    </>
  ),

  // Отбасы — three figures under a yurt-roof arc
  family: () => (
    <>
      <path d="M13 66C21 36 44 21 60 21s39 15 47 45H96C90 45 75 33 60 33S30 45 24 66Z" fill={G} />
      <circle cx="60" cy="23" r="7" fill={R} />
      <circle cx="37" cy="57" r="10" fill={C} />
      <path d="M24 102V83a13 13 0 0 1 26 0v19Z" fill={C} />
      <circle cx="83" cy="57" r="10" fill={PG} />
      <path d="M70 102V83a13 13 0 0 1 26 0v19Z" fill={PG} />
      <circle cx="60" cy="74" r="7.5" fill={G} />
      <path d="M51 102V93a9 9 0 0 1 18 0v9Z" fill={G} />
    </>
  ),

  // Сандар — 1 2 3 as fat felt cords
  numbers: () => (
    <g fill="none" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 46 29 36V86" stroke={I} />
      <path d="M45 48a13 13 0 0 1 26 0C71 62 46 70 45 86H72" stroke={R} />
      <path d="M84 36H104L93 55a15 15 0 1 1-11 25" stroke={K} />
    </g>
  ),

  // Түстер — three overlapping felt circles
  colors: () => (
    <>
      <circle cx="43" cy="46" r="27" fill={R} />
      <circle cx="77" cy="46" r="27" fill={G} opacity="0.92" />
      <circle cx="60" cy="76" r="27" fill={K} opacity="0.9" />
    </>
  ),

  // Тағам — piala with steaming tea and baursaks
  food: () => (
    <>
      <path d="M47 16q-7 8 0 15t0 14M68 12q-7 8 0 16t0 16" fill="none" stroke={PG} strokeWidth="5" strokeLinecap="round" />
      <rect x="47" y="90" width="26" height="9" rx="3" fill={C} />
      <path d="M22 58C22 82 38 95 60 95S98 82 98 58Z" fill={C} />
      <ellipse cx="60" cy="58" rx="38" ry="8" fill={C} />
      <ellipse cx="60" cy="58" rx="31" ry="5" fill={B} />
      <path d="M27 72Q60 84 93 72" fill="none" stroke={R} strokeWidth="6" />
      <ellipse cx="23" cy="98" rx="11" ry="8" fill={G} />
      <ellipse cx="98" cy="98" rx="11" ry="8" fill={G} />
    </>
  ),

  // Жануарлар — horse head
  animals: () => (
    <>
      <g transform="translate(60 62) scale(0.92) translate(-61 -60)">
        <path d="M76 22C98 34 106 66 102 106H86C90 72 84 46 68 34Z" fill={R} />
        <path d="M60 32 62 10 76 24C92 36 98 66 94 106H46C50 90 52 78 50 68L37 80C28 86 17 78 21 68Z" fill={PG} />
        <circle cx="57" cy="46" r="4.2" fill={I} />
        <circle cx="29" cy="72" r="2.8" fill={I} />
      </g>
    </>
  ),

  // Үй — yurt
  home: () => (
    <>
      <rect x="12" y="95" width="96" height="6" rx="3" fill={G} />
      <rect x="51" y="15" width="18" height="10" rx="3" fill={R} />
      <path d="M20 62C26 38 45 25 54 23H66C75 25 94 38 100 62Z" fill={C} />
      <rect x="20" y="60" width="80" height="36" fill={PG} />
      <rect x="20" y="60" width="80" height="8" fill={R} />
      <path d="M53 25 35 60M67 25 85 60" stroke={G} strokeWidth="4" />
      <path d="M49 96V76a11 11 0 0 1 22 0v20Z" fill={R} />
      <rect x="58" y="74" width="4" height="22" fill={G} />
    </>
  ),

  // Дене мүшелері — a face in profile
  body: () => (
    <>
      <path d="M68 20C48 20 38 34 38 48L27 64 37 67V76C37 86 44 90 56 89L57 106H94V58C96 36 88 20 68 20Z" fill={PG} />
      <path d="M68 13C46 12 34 28 37 44C46 36 58 34 66 36C67 46 74 52 82 54L86 78 96 82C104 52 98 14 68 13Z" fill={I} />
      <ellipse cx="72" cy="58" rx="5" ry="7.5" fill={R} />
      <circle cx="48" cy="52" r="3.6" fill={I} />
      <path d="M38 77H47" stroke={R} strokeWidth="4" strokeLinecap="round" />
    </>
  ),

  // Киім — shapan (robe)
  clothes: () => (
    <>
      <path d="M44 20H76L106 44 95 60 81 49 86 102H34L39 49 25 60 14 44Z" fill={K} />
      <path d="M49 20H71L60 38Z" fill={PG} />
      <path d="M60 36V102" stroke={G} strokeWidth="8" />
      <path d="M48 20 60 38 72 20" fill="none" stroke={G} strokeWidth="5" strokeLinejoin="round" />
      <path d="M35 95H85" stroke={G} strokeWidth="7" />
      <path d="M17 46 27 59M103 46 93 59" stroke={G} strokeWidth="6" />
      <rect x="38" y="60" width="44" height="8" fill={R} />
    </>
  ),

  // Уақыт — sun and crescent on a split patch
  time: () => (
    <>
      <path d="M60 2H92a26 26 0 0 1 26 26V92a26 26 0 0 1-26 26H60Z" fill={KD} />
      <circle cx="32" cy="60" r="13" fill={C} />
      <path
        d="M32 41V35M32 79V85M13 60H8M51 60H55M18.6 46.6 14.5 42.5M45.4 46.6 49.5 42.5M18.6 73.4 14.5 77.5M45.4 73.4 49.5 77.5"
        stroke={C}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M96 41A20 20 0 1 0 96 79A15.5 15.5 0 1 1 96 41Z" fill={PG} />
      <circle cx="100" cy="32" r="3" fill={G} />
      <circle cx="104" cy="90" r="2.4" fill={G} />
    </>
  ),

  // Мектеп — open book
  school: () => (
    <>
      <path d="M12 40H108V96H12Z" fill={KD} />
      <path d="M55 92H65V110L60 104 55 110Z" fill={G} />
      <path d="M60 40C50 31 32 29 17 33V87C32 83 50 85 60 93Z" fill={C} />
      <path d="M60 40C70 31 88 29 103 33V87C88 83 70 85 60 93Z" fill={PG} />
      <path d="M26 45Q40 43 51 49M26 58Q40 56 51 62M26 71Q40 69 51 75" fill="none" stroke={K} strokeWidth="4" strokeLinecap="round" />
      <path d="M94 45Q80 43 69 49M94 58Q80 56 69 62M94 71Q80 69 69 75" fill="none" stroke={R} strokeWidth="4" strokeLinecap="round" />
    </>
  ),

  // Қала — buildings and a tower with a sphere
  city: () => (
    <>
      <rect x="14" y="56" width="24" height="44" fill={PG} />
      <rect x="34" y="72" width="14" height="28" fill={F} />
      <rect x="74" y="42" width="20" height="58" fill={C} />
      <rect x="90" y="66" width="16" height="34" fill={PG} />
      <path d="M55 100 57.5 50H62.5L65 100Z" fill={C} />
      <path d="M44 32C46 50 53 56 60 56S74 50 76 32H69C67 44 64 48 60 48S53 44 51 32Z" fill={C} />
      <circle cx="60" cy="30" r="12" fill={G} />
      <path d="M20 64H32M20 74H32M20 84H32M79 52H89M79 62H89M79 72H89M79 82H89" stroke={KD} strokeWidth="4" />
      <rect x="10" y="98" width="100" height="6" rx="3" fill={I} />
    </>
  ),

  // Етістіктер — a running figure
  verbs: () => (
    <>
      <path d="M12 44H28M8 60H26M14 76H26" stroke={R} strokeWidth="5" strokeLinecap="round" />
      <circle cx="76" cy="24" r="10" fill={I} />
      <path
        d="M70 40 58 68M68 44 86 54 98 44M66 43 48 46 40 60M58 68 76 78 72 102M58 68 44 84 24 86"
        fill="none"
        stroke={I}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),

  // Сын есімдер — big and small
  adj: () => (
    <>
      <path d="M50 14 86 56 50 98 14 56Z" fill={PG} />
      <path d="M50 32 70 56 50 80 30 56Z" fill={K} />
      <path d="M50 46 59 56 50 66 41 56Z" fill={G} />
      <path d="M93 74 107 90 93 106 79 90Z" fill={G} />
    </>
  ),

  // Ауа райы — cloud, sun, rain
  weather: () => (
    <>
      <circle cx="80" cy="36" r="18" fill={G} />
      <path d="M80 12V8M104 36H108M97 19 100 16" stroke={G} strokeWidth="5" strokeLinecap="round" />
      <circle cx="40" cy="58" r="17" fill={C} />
      <circle cx="60" cy="48" r="21" fill={C} />
      <circle cx="82" cy="60" r="15" fill={C} />
      <rect x="23" y="56" width="74" height="19" rx="9.5" fill={C} />
      <path d="M42 86 37 100M62 86 57 100M82 86 77 100" stroke={PG} strokeWidth="6" strokeLinecap="round" />
    </>
  ),

  // Табиғат — mountains and a river
  nature: () => (
    <>
      <circle cx="92" cy="28" r="10" fill={R} />
      <path d="M8 90 44 26 80 90Z" fill={K} />
      <path d="M44 26 33 46 40 43 45 50 50 43 56 47Z" fill={C} />
      <path d="M50 90 82 46 112 90Z" fill={T} />
      <path d="M82 46 74 57 80 55 84 60 89 55Z" fill={C} />
      <path d={groundPath(86)} fill={GR} />
      <path d="M62 86C76 94 46 102 52 118H82C76 104 96 96 74 86Z" fill={C} />
    </>
  ),

  // Мамандықтар — hammer and pen crossed
  jobs: () => (
    <>
      <g transform="rotate(42 60 60)">
        <rect x="54" y="26" width="12" height="82" rx="5" fill={B} />
        <rect x="36" y="10" width="48" height="24" rx="5" fill={I} />
      </g>
      <g transform="rotate(-42 60 60)">
        <rect x="52" y="12" width="16" height="66" rx="3" fill={K} />
        <rect x="52" y="12" width="16" height="12" rx="3" fill={R} />
        <path d="M52 78H68L60 104Z" fill={G} />
        <path d="M57 94H63L60 104Z" fill={I} />
      </g>
    </>
  ),

  // Көлік — bus
  transport: () => (
    <>
      <rect x="10" y="30" width="100" height="58" rx="13" fill={G} />
      <rect x="10" y="66" width="100" height="8" fill={R} />
      <rect x="19" y="40" width="20" height="20" rx="4" fill={C} />
      <rect x="44" y="40" width="20" height="20" rx="4" fill={C} />
      <rect x="69" y="40" width="20" height="20" rx="4" fill={C} />
      <path d="M94 40H102a8 8 0 0 1 8 8V60H94Z" fill={KD} />
      <circle cx="34" cy="89" r="12" fill={I} />
      <circle cx="34" cy="89" r="4.5" fill={F} />
      <circle cx="86" cy="89" r="12" fill={I} />
      <circle cx="86" cy="89" r="4.5" fill={F} />
    </>
  ),

  // Денсаулық — heart with a pulse line
  health: () => (
    <>
      <path d="M60 104C16 74 8 44 26 28C40 16 56 24 60 38C64 24 80 16 94 28C112 44 104 74 60 104Z" fill={R} />
      <path d="M22 60H42L51 42 62 80 71 54 76 60H98" fill="none" stroke={C} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  // Сауда — market basket
  shop: () => (
    <>
      <path d="M30 58C30 8 90 8 90 58" fill="none" stroke={PG} strokeWidth="7" />
      <circle cx="46" cy="46" r="14" fill={R} />
      <circle cx="74" cy="46" r="14" fill={C} />
      <path d="M18 56H102L92 102H28Z" fill={G} />
      <rect x="14" y="52" width="92" height="11" rx="5.5" fill={B} />
      <path d="M40 70 43 94M60 70V94M80 70 77 94" stroke={B} strokeWidth="5" strokeLinecap="round" />
    </>
  ),

  // Бағыт — compass
  direction: () => (
    <>
      <circle cx="60" cy="13" r="7" fill={KD} />
      <circle cx="60" cy="62" r="44" fill={KD} />
      <circle cx="60" cy="62" r="34" fill={C} />
      <g transform="rotate(32 60 62)">
        <path d="M60 30 71 62H49Z" fill={R} />
        <path d="M60 94 71 62H49Z" fill={K} />
      </g>
      <circle cx="60" cy="62" r="5" fill={G} />
    </>
  ),

  // Саяхат — a road to the horizon
  travel: () => (
    <>
      <circle cx="60" cy="62" r="24" fill={G} />
      <path d="M2 66 30 44 52 66ZM70 66 92 48 118 66Z" fill={KD} />
      <path d={groundPath(64)} fill={GR} />
      <path d="M55 64H65L92 118H28Z" fill={I} />
      <path d="M60 68V74M60 82V92M60 101V114" stroke={PG} strokeWidth="4.5" />
    </>
  ),

  // Сезім — a glad face and a sad face
  feelings: () => (
    <>
      <circle cx="43" cy="46" r="29" fill={G} />
      <circle cx="33" cy="40" r="4" fill={I} />
      <circle cx="52" cy="40" r="4" fill={I} />
      <path d="M29 52Q43 68 57 52" fill="none" stroke={I} strokeWidth="5" strokeLinecap="round" />
      <circle cx="80" cy="78" r="30" fill={R} />
      <circle cx="80" cy="78" r="26" fill={C} />
      <circle cx="71" cy="73" r="3.8" fill={K} />
      <circle cx="89" cy="73" r="3.8" fill={K} />
      <path d="M69 92Q80 81 91 92" fill="none" stroke={K} strokeWidth="5" strokeLinecap="round" />
    </>
  ),

  // Хобби — dombyra (pear body, no waist, long thin neck, two strings)
  hobby: () => (
    <g transform="translate(61 59) rotate(40) scale(0.95) translate(-60 -54)">
      <rect x="55.5" y="8" width="9" height="50" fill={PG} />
      <rect x="53" y="-2" width="14" height="16" rx="3" fill={PG} />
      <circle cx="50" cy="3" r="4" fill={R} />
      <circle cx="70" cy="9" r="4" fill={R} />
      <path d="M60 42C54 58 35 66 35 86C35 100 46 110 60 110S85 100 85 86C85 66 66 58 60 42Z" fill={G} />
      <circle cx="60" cy="78" r="4" fill={I} />
      <path d="M58.6 12V96M61.4 12V96" stroke={I} strokeWidth="1.5" />
      <rect x="52" y="95" width="16" height="4.5" rx="1.5" fill={R} />
    </g>
  ),

  // Салт-дәстүр — shanyrak
  tradition: () => (
    <>
      <path d="M60 20V100M47 22Q53 60 47 98M73 22Q67 60 73 98" fill="none" stroke={PG} strokeWidth="5" />
      <path d="M20 60H100M22 47Q60 53 98 47M22 73Q60 67 98 73" fill="none" stroke={PG} strokeWidth="5" />
      <circle cx="60" cy="60" r="40" fill="none" stroke={G} strokeWidth="13" />
      {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((a) => (
        <circle key={a} cx="60" cy="20" r="2.6" fill={R} transform={`rotate(${a} 60 60)`} />
      ))}
    </>
  ),

  // Технология — phone
  tech: () => (
    <g transform="rotate(8 60 60)">
      <rect x="33" y="10" width="54" height="100" rx="11" fill={I} />
      <rect x="39" y="22" width="42" height="68" rx="3" fill={C} />
      <rect x="44" y="28" width="14" height="14" rx="3" fill={R} />
      <rect x="62" y="28" width="14" height="14" rx="3" fill={K} />
      <rect x="44" y="46" width="14" height="14" rx="3" fill={T} />
      <rect x="62" y="46" width="14" height="14" rx="3" fill={GR} />
      <rect x="44" y="66" width="32" height="6" rx="3" fill={F} />
      <rect x="44" y="76" width="22" height="6" rx="3" fill={F} />
      <circle cx="60" cy="100" r="4.5" fill={G} />
    </g>
  ),

  // Қоғам — people in a circle
  society: () => (
    <>
      <circle cx="34" cy="30" r="8" fill={PG} />
      <path d="M23 54V50a11 11 0 0 1 22 0v4Z" fill={PG} />
      <circle cx="60" cy="22" r="8" fill={C} />
      <path d="M49 46V42a11 11 0 0 1 22 0v4Z" fill={C} />
      <circle cx="86" cy="30" r="8" fill={PG} />
      <path d="M75 54V50a11 11 0 0 1 22 0v4Z" fill={PG} />
      <ellipse cx="60" cy="64" rx="30" ry="11" fill={G} />
      <ellipse cx="60" cy="64" rx="13" ry="4.5" fill={R} />
      <circle cx="33" cy="76" r="10" fill={C} />
      <path d="M18 106V102a15 15 0 0 1 30 0v4Z" fill={C} />
      <circle cx="87" cy="76" r="10" fill={C} />
      <path d="M72 106V102a15 15 0 0 1 30 0v4Z" fill={C} />
    </>
  ),

  // Экология — a sprout
  eco: () => (
    <>
      <circle cx="26" cy="26" r="9" fill={G} />
      <path d="M56 54H64V92H56Z" fill={GR} />
      <path d="M60 72C36 72 22 58 20 36C44 36 60 50 60 72Z" fill={GR} />
      <path d="M60 60C60 34 76 18 100 16C100 42 84 60 60 60Z" fill={T} />
      <path d="M18 104Q60 68 102 104Z" fill={B} />
    </>
  ),

  // Жұмыс — briefcase
  work: () => (
    <>
      <path d="M44 42V32a8 8 0 0 1 8-8H68a8 8 0 0 1 8 8V42" fill="none" stroke={I} strokeWidth="8" />
      <rect x="14" y="40" width="92" height="60" rx="11" fill={B} />
      <path d="M14 51a11 11 0 0 1 11-11H95a11 11 0 0 1 11 11V62Q60 78 14 62Z" fill={R} />
      <rect x="51" y="60" width="18" height="16" rx="3" fill={G} />
    </>
  ),

  // Тарих — warrior's helmet
  hist: () => (
    <>
      <path d="M60 22C70 12 86 14 92 6C92 24 76 30 60 28Z" fill={R} />
      <rect x="56" y="12" width="8" height="18" rx="2" fill={G} />
      <path d="M28 76V106L48 96V76ZM92 76V106L72 96V76Z" fill={F} />
      <path d="M28 70C28 44 42 30 60 26C78 30 92 44 92 70Z" fill={PG} />
      <rect x="55" y="70" width="10" height="26" rx="3" fill={G} />
      <rect x="24" y="66" width="72" height="11" rx="3" fill={G} />
      <circle cx="40" cy="71.5" r="2.5" fill={R} />
      <circle cx="80" cy="71.5" r="2.5" fill={R} />
    </>
  ),
  // БАҚ — microphone on air
  media: () => (
    <>
      <path d="M28 40q-9 14 0 28M18 32q-15 22 0 44M92 40q9 14 0 28M102 32q15 22 0 44" fill="none" stroke={C} strokeWidth="5" strokeLinecap="round" />
      <path d="M38 52v4a22 22 0 0 0 44 0v-4" fill="none" stroke={G} strokeWidth="6" strokeLinecap="round" />
      <rect x="45" y="14" width="30" height="52" rx="15" fill={PG} />
      <path d="M49 30H71M49 40H71M49 50H71" stroke={KD} strokeWidth="3.5" strokeLinecap="round" />
      <rect x="56" y="78" width="8" height="18" fill={G} />
      <rect x="40" y="94" width="40" height="9" rx="4.5" fill={R} />
      <circle cx="98" cy="18" r="5.5" fill={R} />
    </>
  ),

  // Экономика — rising bars, an arrow and a coin
  economy: () => (
    <>
      <rect x="16" y="72" width="18" height="30" rx="3" fill={PG} />
      <rect x="38" y="56" width="18" height="46" rx="3" fill={C} />
      <rect x="60" y="40" width="18" height="62" rx="3" fill={G} />
      <rect x="12" y="100" width="96" height="6" rx="3" fill={I} />
      <path d="M16 62 38 44 54 52 86 22" fill="none" stroke={R} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M72 20H90V38" fill="none" stroke={R} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="96" cy="80" r="14" fill={G} />
      <circle cx="96" cy="80" r="8.5" fill="none" stroke={B} strokeWidth="3" />
    </>
  ),

  // Ғылым — a flask with bubbles
  science: () => (
    <>
      <circle cx="82" cy="28" r="4.5" fill={C} />
      <circle cx="91" cy="15" r="3" fill={C} />
      <rect x="50" y="20" width="20" height="30" fill={C} />
      <rect x="45" y="14" width="30" height="9" rx="4.5" fill={C} />
      <path d="M50 46 24 96a8 8 0 0 0 7 12H89a8 8 0 0 0 7-12L70 46Z" fill={C} />
      <path d="M34.4 76H85.6L96 96a8 8 0 0 1-7 12H31a8 8 0 0 1-7-12Z" fill={G} />
      <rect x="50" y="34" width="20" height="5" fill={R} />
      <circle cx="50" cy="92" r="5" fill={PG} />
      <circle cx="68" cy="86" r="3.5" fill={PG} />
      <circle cx="74" cy="98" r="2.6" fill={PG} />
    </>
  ),

  // Өнер — palette and brush
  art: () => (
    <>
      <path d="M60 20C88 20 106 38 106 58C106 74 94 78 86 74C78 70 72 76 76 86C80 96 70 104 58 104C34 104 14 86 14 62C14 38 34 20 60 20Z" fill={PG} />
      <circle cx="38" cy="82" r="7" fill={R} />
      <circle cx="36" cy="52" r="9" fill={K} />
      <circle cx="58" cy="38" r="9" fill={G} />
      <circle cx="84" cy="44" r="8.5" fill={GR} />
      <circle cx="58" cy="64" r="7.5" fill={T} />
      <path d="M68 112 97 83" stroke={B} strokeWidth="7" strokeLinecap="round" />
      <path d="M96 84 103 77" stroke={F} strokeWidth="9" />
      <path d="M100 80C103 74 107 70 112 68 110 74 107 78 101 82Z" fill={I} />
    </>
  ),

  // Жоғары білім — graduation cap and diploma
  edu: () => (
    <>
      <path d="M32 50V70C32 82 88 82 88 70V50L60 62Z" fill={C} />
      <path d="M60 20 108 40 60 60 12 40Z" fill={PG} />
      <path d="M60 40 98 48V72" fill="none" stroke={G} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="60" cy="40" r="4.5" fill={R} />
      <path d="M93 70H103L106 86H90Z" fill={G} />
      <rect x="22" y="90" width="68" height="14" rx="7" fill={PG} />
      <rect x="52" y="87" width="8" height="20" fill={R} />
    </>
  ),

  // Құқық — balance scales
  law: () => (
    <>
      <path d="M24 40 12 72M24 40 36 72M96 40 84 72M96 40 108 72" stroke={I} strokeWidth="3" />
      <rect x="56" y="28" width="8" height="64" fill={B} />
      <rect x="18" y="34" width="84" height="8" rx="4" fill={B} />
      <circle cx="60" cy="24" r="7" fill={G} />
      <path d="M36 104C36 94 48 88 60 88S84 94 84 104Z" fill={B} />
      <path d="M8 72H40a16 16 0 0 1-32 0Z" fill={R} />
      <path d="M80 72H112a16 16 0 0 1-32 0Z" fill={K} />
    </>
  ),

  // Мінез бен сана — a head with a ram's-horn thought
  mind: () => (
    <>
      <path d="M68 20C48 20 38 34 38 48L27 64 37 67V76C37 86 44 90 56 89L57 106H94V58C96 36 88 20 68 20Z" fill={K} />
      <path
        d="M70 72V56M70 58C70 46 54 44 54 54C54 61 63 61 63 55M70 58C70 46 86 44 86 54C86 61 77 61 77 55"
        fill="none"
        stroke={G}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="96" cy="24" r="5" fill={R} />
      <circle cx="102" cy="38" r="3" fill={G} />
    </>
  ),

  // Фразеологизмдер — two speech bubbles, one with an ornament
  idiom: () => (
    <>
      <rect x="12" y="16" width="72" height="52" rx="20" fill={C} />
      <path d="M26 62 20 86 46 66Z" fill={C} />
      <path
        d="M48 58V44M48 46C48 36 35 35 35 43C35 48 42 48 42 44M48 46C48 36 61 35 61 43C61 48 54 48 54 44"
        fill="none"
        stroke={R}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="58" y="60" width="50" height="38" rx="16" fill={G} />
      <path d="M90 94 100 110 78 96Z" fill={G} />
      <circle cx="72" cy="79" r="4" fill={I} />
      <circle cx="83" cy="79" r="4" fill={I} />
      <circle cx="94" cy="79" r="4" fill={I} />
    </>
  ),
};

// Unknown topic — қошқар мүйіз (ram's horn)
function Fallback() {
  return (
    <path
      d="M60 98V58M60 60C60 34 26 30 26 52C26 68 46 68 46 54M60 60C60 34 94 30 94 52C94 68 74 68 74 54"
      fill="none"
      stroke={K}
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

export default function TopicArt({ topic, size = 96, className = "" }) {
  const Draw = Object.prototype.hasOwnProperty.call(ART, topic) ? ART[topic] : Fallback;
  const tint = TOPIC_TINT[topic] || FALLBACK_TINT;
  const stitch = LIGHT_BG.has(tint.bg) ? I : "#FFFFFF";
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={`topic-art ${className}`.trim()}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2" y="2" width="116" height="116" rx="26" fill={tint.bg === C ? F : tint.bg} />
      {tint.bg === C && <rect x="5" y="5" width="110" height="110" rx="23" fill={C} />}
      <Draw />
      <rect
        x="8.5"
        y="8.5"
        width="103"
        height="103"
        rx="19.5"
        fill="none"
        stroke={stitch}
        strokeOpacity={LIGHT_BG.has(tint.bg) ? 0.22 : 0.34}
        strokeWidth="1.4"
        strokeDasharray="3 4.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
