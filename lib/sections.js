// Бөлім қолтаңбалары: әр бөлімнің өз реңі (tint), қою реңі (deep), ашық фоны (soft) және киіз белгісі (glyph).
// Бренд қызылы — жақтау түсі; бөлім реңі — тек екпін. Барлық tint ақ мәтінмен ≥ 4.5:1, deep/soft ≥ 6.4:1.
// Қабық (Shell) осы мәндерді --sec / --sec-deep / --sec-soft айнымалылары етіп <main data-section> ішіне береді.
export const SECTIONS = {
  home: { href: "/app", tint: "#B8322A", deep: "#8A2018", soft: "#F6E5DE", glyph: "shanyrak" }, // ошақ: қызыл + алтын
  course: { href: "/app/course", tint: "#3A7440", deep: "#24522B", soft: "#E7EDE1", glyph: "trail" }, // дала жасылы
  sozdik: { href: "/app/sozdik", tint: "#A62448", deep: "#7A1634", soft: "#F4E3E2", glyph: "chest" }, // рян қызылы
  games: { href: "/app/games", tint: "#B4510E", deep: "#873A06", soft: "#F6E8DB", glyph: "asyk" }, // ер-тұрман қызғылт сарысы
  chat: { href: "/app/qyran", tint: "#7A4A21", deep: "#583212", soft: "#EFE8DD", glyph: "feather" }, // қыран қоңыры
  vr: { href: "/app/vr", tint: "#5B3FA8", deep: "#432C80", soft: "#ECE7F3", glyph: "portal" }, // киіз үй есігі: түнгі күлгін
  tuzel: { href: "/app/tuzel", tint: "#1F4E8C", deep: "#153968", soft: "#E4E8EA", glyph: "nib" }, // сия көгі
  travel: { href: "/app/travel", tint: "#0B7A90", deep: "#075A6B", soft: "#E2EDEB", glyph: "compass" }, // көгілдір
  history: { href: "/app/history", tint: "#876519", deep: "#644A0E", soft: "#F1EBDC", glyph: "dome" }, // қола
  lit: { href: "/app/literature", tint: "#7A2E6E", deep: "#591F50", soft: "#EFE4E7", glyph: "book" }, // қара өрік
  saiys: { href: "/app/saiys", tint: "#96690A", deep: "#6F4D03", soft: "#F2EBDB", glyph: "pennant" }, // алтын
  class: { href: "/app/class", tint: "#8A2018", deep: "#66140E", soft: "#F1E2DC", glyph: "circle" }, // қою қызыл
  shop: { href: "/app/shop", tint: "#0F6E62", deep: "#0A5148", soft: "#E2ECE5", glyph: "bag" }, // базар жасыл-көгі
  profile: { href: "/app/profile", tint: "#3F3D9A", deep: "#2D2B75", soft: "#E8E6EC", glyph: "tumar" }, // индиго
  admin: { href: "/app/admin", tint: "#4A5160", deep: "#1F2430", soft: "#E9E8E5", glyph: "bars" },
};

// Қосымша беттер қай бөлімге жатады
const ALIAS = [
  ["/app/speaking", "tuzel"],
  ["/app/writing", "tuzel"],
  ["/app/vision", "chat"],
  ["/app/level", "home"],
];

export function sectionOf(path) {
  const p = path || "/app";
  for (const [pre, key] of ALIAS) if (p.startsWith(pre)) return key;
  let best = "home";
  let len = 0;
  for (const [key, s] of Object.entries(SECTIONS)) {
    if (s.href !== "/app" && p.startsWith(s.href) && s.href.length > len) {
      best = key;
      len = s.href.length;
    }
  }
  return best;
}

// style={{...secVars("course")}} — бөлім айнымалылары; prefix="it" болса --it / --it-deep / --it-soft
export function secVars(key, prefix = "sec") {
  const s = SECTIONS[key] || SECTIONS.home;
  return { [`--${prefix}`]: s.tint, [`--${prefix}-deep`]: s.deep, [`--${prefix}-soft`]: s.soft };
}
