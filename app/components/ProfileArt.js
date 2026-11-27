// Профиль бетінің шағын суреті: шоқ (серияны бір күнге сақтайтын ошақ көмірі).
const RED = "#b8322a", GOLD = "#e0a526", GOLD2 = "#f6d27a", INK = "#3a2210";

export function ProfileEmber({ on = false }) {
  return (
    <svg className={`pf-ember-art ${on ? "on" : ""}`} viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <path d="M4 16 C4 11 8 8 12 8 C16 8 20 11 20 16 C20 19 17 21 12 21 C7 21 4 19 4 16Z" fill={on ? RED : "none"} stroke={on ? INK : "#6b5a3a"} strokeWidth="1.8" strokeDasharray={on ? undefined : "3 3"} />
      {on && <path d="M12 3 C15 6 15 9 12 12 C9 9 9 6 12 3Z" fill={GOLD} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />}
      {on && <path d="M8.5 16.5 q3.5 2.5 7 0" stroke={GOLD2} strokeWidth="1.6" fill="none" strokeLinecap="round" />}
    </svg>
  );
}
