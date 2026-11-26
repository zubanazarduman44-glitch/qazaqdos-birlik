// Әр жәдігердің 3D құрастырушысы бөлек чанкта — тек қажет кезде жүктеледі.
export const MODELS = {
  goldman: () => import("./models/goldman.js"),
  deer: () => import("./models/deer.js"),
  berel: () => import("./models/berel.js"),
  botai: () => import("./models/botai.js"),
  andronovo: () => import("./models/andronovo.js"),
  cauldron: () => import("./models/cauldron.js"),
  petroglyph: () => import("./models/petroglyph.js"),
  coin: () => import("./models/coin.js"),
  taikazan: () => import("./models/taikazan.js"),
  torsyk: () => import("./models/torsyk.js"),
  dombyra: () => import("./models/dombyra.js"),
};
