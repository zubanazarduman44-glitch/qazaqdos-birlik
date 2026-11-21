// lib/vr/sceneIndex.js файлын lib/vr/scenes.js-тен жасайды: VR картасына керек жеңіл мәлімет
// (орындар + әр жағдаяттың id, орны, деңгейі, атауы, кейіпкері) — диалог түйіндерінсіз (~200 KB үнемдейді).
// Іске қосу: node --no-warnings scripts/gen-vr-index.mjs   (scenes.js өзгерсе — қайта іске қос)
import { register } from "node:module";
import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

// lib/* импорттары кеңейтімсіз ("./words") — Node үшін ".js" қосамыз
register(
  "data:text/javascript," +
    encodeURIComponent(`export async function resolve(s, c, next) {
      try { return await next(s, c); } catch (e) { if (s.startsWith(".") && !s.endsWith(".js")) return next(s + ".js", c); throw e; }
    }`),
  import.meta.url
);

const root = fileURLToPath(new URL("..", import.meta.url));
const { PLACES, SCENES } = await import(pathToFileURL(root + "lib/vr/scenes.js").href);
const meta = SCENES.map(({ id, place, level, title, npc }) => ({ id, place, level, title, npc }));

const out = `// ⚠ ЖАСАЛҒАН ФАЙЛ — қолмен өзгертпе. Көзі: lib/vr/scenes.js; жасаушы: node --no-warnings scripts/gen-vr-index.mjs
// VR картасының жеңіл индексі: орындар мен жағдаяттардың атаулары — диалогсыз.
// Толық жағдаят (nodes, words, goal) тек ойнағанда жүктеледі: import("./scenes").

export const PLACES = ${JSON.stringify(PLACES)};

export const SCENES = ${JSON.stringify(meta)};
`;
writeFileSync(root + "lib/vr/sceneIndex.js", out);
console.log(`sceneIndex.js: ${meta.length} scenes, ${Object.keys(PLACES).length} places, ${out.length} bytes`);
