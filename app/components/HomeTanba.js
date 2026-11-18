// Таңба — басты беттегі жетістік белгісі (мөр-медальон). Бөлек файл: басты бет HomeArt-ты (NatArt) тартпайды.
// glyph: first | stamp1 | streak7 | words50 | stamp5 | a1 | a2 | kosh
const TG = {
  first: "M20 29V12M13 18l7-6.5 7 6.5",
  stamp1: "M20 11l9 9-9 9-9-9z M20 16.5v7",
  streak7: "M20 30c-5 0-7.5-3.6-6.6-7.6.8-3.2 3.9-4.4 4.2-8.6 3.6 2.3 7.6 5.8 7.6 10.4 0 3.7-2 5.8-5.2 5.8z",
  words50: "M11 13.5c3-1 6-1 9 1v15c-3-2-6-2-9-1zM29 13.5c-3-1-6-1-9 1v15c3-2 6-2 9-1z",
  stamp5: "M20 10.5l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2-5.6-3.2-5.6 3.2 1.3-6.2-4.7-4.3 6.3-.7z",
  kosh: "M20 11.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17M11.5 20h17M20 11.5v17M14 14l12 12M26 14L14 26",
};
export function HomeTanba({ glyph, on = false, size = 52 }) {
  const txt = glyph === "a1" || glyph === "a2" ? glyph.toUpperCase() : null;
  return (
    <svg className={`hm-tanba${on ? " on" : ""}`} viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      <circle cx="20" cy="20" r="19" className="tb-disc" />
      <circle cx="20" cy="20" r="15.5" className="tb-ring" />
      {txt ? <text x="20" y="24.6" className="tb-txt">{txt}</text> : <path d={TG[glyph]} className="tb-g" />}
    </svg>
  );
}
