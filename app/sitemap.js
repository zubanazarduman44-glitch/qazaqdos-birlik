// /sitemap.xml (Next.js файл конвенциясы): ашық беттер ғана (әкімші, профиль, API жоқ)
const SITE = "https://tilim-kz.vercel.app";
const PATHS = [
  ["", 1, "weekly"],
  ["/app", 0.9, "daily"],
  ["/app/course", 0.9, "weekly"],
  ["/app/travel", 0.8, "monthly"],
  ["/app/history", 0.8, "monthly"],
  ["/app/games", 0.8, "monthly"],
  ["/app/sozdik", 0.8, "daily"],
  ["/app/literature", 0.7, "monthly"],
  ["/app/qyran", 0.7, "monthly"],
  ["/app/vr", 0.7, "monthly"],
  ["/app/saiys", 0.6, "weekly"],
  ["/app/class", 0.5, "monthly"],
  ["/app/shop", 0.5, "monthly"],
  ["/app/level", 0.6, "monthly"],
  ["/register", 0.6, "yearly"],
  ["/login", 0.4, "yearly"],
];

export default function sitemap() {
  return PATHS.map(([p, priority, changeFrequency]) => ({ url: SITE + p, changeFrequency, priority }));
}
