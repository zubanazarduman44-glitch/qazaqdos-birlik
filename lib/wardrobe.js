// Ақылдың киім жинағы (aqyl-wardrobe): әр кейіпкерге 600×1120 өлшемді бір кадрға шақталған қабаттар.
// public/aqyl/wardrobe/<female|male>/ — base.webp, base-hat.webp (бас киім кигенде: үкісіз / тақиясыз), <id>.svg
// Дерек көзі — lib/shop.js (id, баға, санат). Слот = item.cat (head | body | foot | acc).
import { ITEMS } from "./shop.js";

export const WARDROBE_ROOT = "/aqyl/wardrobe";
export const WARDROBE_W = 600;
export const WARDROBE_H = 1120;
export const PERSON = { qyz: "female", jigit: "male" };
const ORDER = ["foot", "body", "acc", "head"]; // төменнен жоғары: аяқ → дене → әшекей → бас

/** Киілген заттардан қабаттар тізімі (төменгісі бірінші). Белгісіз id не бос слот еленбейді. */
export function wardrobeLayers(person, equipped = {}, items = ITEMS) {
  if (!["female", "male"].includes(person)) throw new Error("Unknown Aqyl character");
  const chosen = ORDER.map((slot) => items.find((it) => it.cat === slot && it.id === equipped?.[slot])).filter(Boolean);
  const base = chosen.some((it) => it.cat === "head") ? "base-hat" : "base";
  return [`${base}.webp`, ...chosen.map((it) => `${it.id}.svg`)].map((f) => `${WARDROBE_ROOT}/${person}/${f}`);
}
