// Басты беттегі санақтар нақты каталогтардан алынады (қолмен жазылмайды):
// ойындар мен квест — lib/games.js (квест — «Quest» белгісі бар бөлек санат), өңірлер — lib/regions.js,
// түсіндірме тілдері — онбордингтегі таңдау тізімі EXPLAIN_LANGS (lib/i18n.js), сол бір тізім.
import { GAMES } from "./games";
import { REGIONS } from "./regions";
import { EXPLAIN_LANGS } from "./i18n";

export const isQuest = (g) => g?.tag?.en === "Quest";

export function catalogCounts() {
  const quests = GAMES.filter(isQuest).length;
  return { games: GAMES.length - quests, quests, regions: REGIONS.length, explain: EXPLAIN_LANGS.length };
}
