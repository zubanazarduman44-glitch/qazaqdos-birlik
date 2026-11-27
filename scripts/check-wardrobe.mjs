// Киім жинағы: әр заттың екі кейіпкерге суреті бар ма, қабаттар реті мен base/base-hat ережесі дұрыс па.
// node --no-warnings scripts/check-wardrobe.mjs
import { existsSync } from "node:fs";
import { ITEMS } from "../lib/shop.js";
import { wardrobeLayers } from "../lib/wardrobe.js";
const fail = [];
const pub = (p) => new URL("../public" + p, import.meta.url);
for (const person of ["female", "male"]) {
  for (const f of ["base.webp", "base-hat.webp"]) if (!existsSync(pub(`/aqyl/wardrobe/${person}/${f}`))) fail.push(`${person}/${f} жоқ`);
  for (const it of ITEMS) {
    const L = wardrobeLayers(person, { [it.cat]: it.id });
    if (L.length !== 2) fail.push(`${person} ${it.id}: ${L.length} қабат`);
    for (const p of L) if (!existsSync(pub(p))) fail.push(`файл жоқ: ${p}`);
    const wantBase = it.cat === "head" ? "base-hat.webp" : "base.webp";
    if (!L[0].endsWith(wantBase)) fail.push(`${person} ${it.id}: негізі ${L[0]}`);
  }
  const all = wardrobeLayers(person, { head: "borik", body: "shapan", foot: "etik", acc: "algha" });
  const order = all.map((p) => p.split("/").pop());
  if (order.join() !== "base-hat.webp,etik.svg,shapan.svg,algha.svg,borik.svg") fail.push(`${person} реті: ${order}`);
  if (wardrobeLayers(person, { head: "", body: "nope" }).length !== 1) fail.push(`${person}: бос/белгісіз слот еленбеді`);
  if (!wardrobeLayers(person, {})[0].endsWith("/base.webp")) fail.push(`${person}: шешілгенде base.webp болуы керек`);
}
if (ITEMS.length !== 23) fail.push(`каталогта ${ITEMS.length} зат (23 күтілді)`);
if (fail.length) { console.error(fail.join("\n")); process.exit(1); }
console.log(`✓ Киім жинағы: ${ITEMS.length} зат × 2 кейіпкер, барлық файл бар, қабат реті дұрыс`);
