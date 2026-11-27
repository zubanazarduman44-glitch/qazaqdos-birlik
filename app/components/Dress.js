"use client";
// Кию үлгісі: таңдалған Ақыл (әңгімеші қыз не жігіт) + ұлттық киімдер — aqyl-wardrobe жинағы.
// Барлық қабат бір 600×1120 контейнерде (position:absolute; inset:0; 100%) — бүкіл көрініс бірдей масштабта.
// Қимыл (тыныс, секіру) тек сыртқы контейнерге қолданылады, сондықтан кейіпкер мен киім бірге қозғалады.
// size < 100 → портрет: толық композиция жиналып, бір шаршы тереземен қиылады.
import { useApp } from "./Store";
import { useAqylChoice } from "../../lib/aqylChoice";
import { aqylId, aqylL } from "../../lib/aqyl";
import { PERSON, WARDROBE_W, WARDROBE_H, wardrobeLayers } from "../../lib/wardrobe";

// Портрет терезесі (600×1120 кадрдағы координат): бас киім мен иық сыйятын шаршы
const BUST = { x: 90, y: 40, s: 420 };

export default function DressUp({ wear = {}, size = 220, mood = "idle", char, className = "" }) {
  const { lang } = useApp();
  const chosen = useAqylChoice();
  const id = aqylId(char || chosen);
  const layers = wardrobeLayers(PERSON[id], wear);
  const label = aqylL(lang)[id];
  const imgs = layers.map((src) => <img key={src} src={src} alt="" draggable="false" decoding="async" />);
  if (size < 100) {
    const k = size / BUST.s;
    return (
      <span className={`wd wd-bust ${className}`} style={{ width: size, height: size }} role="img" aria-label={label}>
        <span className={`wd-doll m-${mood}`} style={{ width: WARDROBE_W * k, height: WARDROBE_H * k, left: -BUST.x * k, top: -BUST.y * k }}>{imgs}</span>
      </span>
    );
  }
  const h = Math.round(size * 1.25);
  return (
    <span className={`wd ${className}`} style={{ height: h, width: Math.round((h * WARDROBE_W) / WARDROBE_H) }} role="img" aria-label={label}>
      <span className={`wd-doll m-${mood}`} key={id}>{imgs}</span>
    </span>
  );
}
