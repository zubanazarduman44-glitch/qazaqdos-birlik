// VR картасы мен ойнатқышқа ортақ шағын бөліктер. Карта (app/app/vr/page.js) ауыр VrPlay-ді
// бірден жүктемеуі үшін бөлек файлда тұр; VrPlay оларды осы жерден алып, қайта экспорттайды.

export const trLang = (explain) => (explain === "ru" ? "ru" : "en");

// Ауа райы белгісі (кадрдағы жазудың кішкентай суреті)
export function WxIcon({ a }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      {a.wx === "snow" ? <path {...p} d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5" />
        : a.wx === "rain" ? <><path {...p} d="M7 14a4 4 0 0 1 .5-8A5.5 5.5 0 0 1 18 8a3 3 0 0 1 0 6Z" /><path {...p} d="M8 17l-1 3M12 17l-1 3M16 17l-1 3" /></>
        : a.wx === "cloud" ? <path {...p} d="M7 18a4.5 4.5 0 0 1 .6-9A6 6 0 0 1 19 11a3.5 3.5 0 0 1-.5 7Z" />
        : a.tod === "night" || a.tod === "evening" ? <path {...p} d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5Z" />
        : <><circle {...p} cx="12" cy="12" r="4" /><path {...p} d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></>}
    </svg>
  );
}

export function Stars({ n, size = 18, label }) {
  return (
    <span className="vr-stars" role="img" aria-label={label}>
      {[1, 2, 3].map((i) => (
        <svg key={i} className={i <= n ? "on" : ""} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
          <path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17.1 6.4 20l1.1-6.2L2.9 9.4l6.3-.9Z" />
        </svg>
      ))}
    </span>
  );
}
