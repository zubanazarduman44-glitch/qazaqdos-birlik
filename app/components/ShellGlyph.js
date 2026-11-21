// Бөлім белгілері: киіз аппликация стиліндегі шағын екі түсті SVG.
// Негізгі пішін — currentColor, екпін — --gl2 (әдепкі алтын). lib/sections.js ішіндегі glyph атауларына сай.
const A = "var(--gl2, #E8B23A)";
const G = {
  // Шаңырақ (Basty)
  shanyrak: (
    <>
      <circle cx="12" cy="12" r="8.4" fill="none" stroke="currentColor" strokeWidth="2.8" />
      <path d="M12 5v14M5 12h14" stroke={A} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M12 9.2 14.8 12 12 14.8 9.2 12Z" fill="currentColor" />
    </>
  ),
  // Көш жолы (Жаттығу)
  trail: (
    <>
      <path d="M6.5 21c-.6-4 3-4.6 6.2-5.4 3.4-.9 5.4-2.6 4.2-5.2-1.2-2.5-5.4-1.6-6.6-4.2" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="9.6" cy="4" r="2.4" fill={A} />
      <circle cx="6.5" cy="21" r="1.6" fill="currentColor" />
    </>
  ),
  // Сандық (Sozdik)
  chest: (
    <>
      <path d="M4 10.2A5.2 5.2 0 0 1 9.2 5h5.6a5.2 5.2 0 0 1 5.2 5.2V11H4Z" fill="currentColor" />
      <path d="M4 12.4h16v6.1a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5Z" fill="currentColor" />
      <path d="M12 9.6 14.4 12.4 12 15.4 9.6 12.4Z" fill={A} />
    </>
  ),
  // Асық (Oiyndar)
  asyk: (
    <>
      <path d="M7 4.9c2-1.6 3.9.5 5 .5s3-2.1 5-.5c1.9 1.5.5 3.7.5 5.6s1.6 4.6-.4 6.4c-2 1.7-4-.6-5.1-.6s-3.1 2.3-5.1.6c-2-1.8-.4-4.5-.4-6.4S5.1 6.4 7 4.9Z" fill="currentColor" />
      <path d="M9.2 10.6c1.8-1.2 3.8-1.2 5.6 0" fill="none" stroke={A} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="14.2" r="1.5" fill={A} />
    </>
  ),
  // Қыран қауырсыны (Aqyl)
  feather: (
    <>
      <path d="M19.6 3.4c-7.4-.4-13.2 4.4-13.4 11.2L4 19.8l1.4.8 2.3-3.3c6.8-.2 12-5.7 11.9-13.9Z" fill="currentColor" />
      <path d="M7.8 16.6 15.6 8" stroke={A} strokeWidth="2" strokeLinecap="round" />
      <path d="M11 13.2h3.6M13.4 10.6h3" stroke={A} strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  // Киіз үй есігі — басқа әлемге кіретін «портал» (VR Әлем)
  portal: (
    <>
      <path d="M4.2 21V11.4a7.8 7.8 0 0 1 15.6 0V21Z" fill="currentColor" />
      <path d="M8.3 21v-8.6a3.7 3.7 0 0 1 7.4 0V21Z" fill={A} />
      <path d="M12 12.4 13.8 14.8 12 17.2 10.2 14.8Z" fill="currentColor" />
      <circle cx="12" cy="5.6" r="1.3" fill={A} />
    </>
  ),
  // Қалам ұшы (Tuzel)
  nib: (
    <>
      <path d="M12 2.8 17.6 10.4 14.6 18h-5.2L6.4 10.4Z" fill="currentColor" />
      <path d="M8.8 19.4h6.4v1.2a.8.8 0 0 1-.8.8H9.6a.8.8 0 0 1-.8-.8Z" fill={A} />
      <circle cx="12" cy="11" r="1.9" fill={A} />
      <path d="M12 12.6V17" stroke={A} strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  // Компас (Sayahat)
  compass: (
    <>
      <circle cx="12" cy="12" r="8.4" fill="none" stroke="currentColor" strokeWidth="2.8" />
      <path d="M16.2 7.8 13.6 13.6 7.8 16.2 10.4 10.4Z" fill={A} />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </>
  ),
  // Кесене күмбезі (Tarih)
  dome: (
    <>
      <path d="M12 2.4v2.4" stroke={A} strokeWidth="2" strokeLinecap="round" />
      <path d="M5.6 11.4a6.4 6.4 0 0 1 12.8 0Z" fill="currentColor" />
      <path d="M4.6 12.8h14.8V20a1 1 0 0 1-1 1H5.6a1 1 0 0 1-1-1Z" fill="currentColor" />
      <path d="M9.8 21v-3.8a2.2 2.2 0 0 1 4.4 0V21Z" fill={A} />
    </>
  ),
  // Ашық кітап (Adebiet)
  book: (
    <>
      <path d="M3.4 6.2c2.8-1 5.4-.7 7.6.9v12.3c-2.2-1.5-4.8-1.8-7.6-.9Z" fill="currentColor" />
      <path d="M20.6 6.2c-2.8-1-5.4-.7-7.6.9v12.3c2.2-1.5 4.8-1.8 7.6-.9Z" fill="currentColor" />
      <path d="M15.2 6.3v6l1.7-1.3 1.7 1.3V5.9c-1.2-.1-2.3 0-3.4.4Z" fill={A} />
    </>
  ),
  // Бәйге жалауы (Saiys)
  pennant: (
    <>
      <path d="M6 3v18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M7.6 4h11.8l-3.4 4.3 3.4 4.3H7.6Z" fill="currentColor" />
      <circle cx="11" cy="8.3" r="1.8" fill={A} />
    </>
  ),
  // Шешендер алқасы (Synyp)
  circle: (
    <>
      <circle cx="12" cy="6" r="3.2" fill="currentColor" />
      <circle cx="5.8" cy="16.4" r="3.2" fill="currentColor" />
      <circle cx="18.2" cy="16.4" r="3.2" fill="currentColor" />
      <path d="M12 10.4 14.2 13 12 15.6 9.8 13Z" fill={A} />
    </>
  ),
  // Базар дорбасы (Duken)
  bag: (
    <>
      <path d="M8.8 9V7.2a3.2 3.2 0 0 1 6.4 0V9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M5.6 8.6h12.8l1.1 10.7a1.5 1.5 0 0 1-1.5 1.7H6a1.5 1.5 0 0 1-1.5-1.7Z" fill="currentColor" />
      <path d="M12 16.8c0-2.2-1.6-3.3-2.9-2.4M12 16.8c0-2.2 1.6-3.3 2.9-2.4" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  // Тұмар (Profil)
  tumar: (
    <>
      <path d="M7 3.4c3 2.4 7 2.4 10 0" fill="none" stroke={A} strokeWidth="2" strokeLinecap="round" />
      <path d="M12 6.2 20.4 19.6a.9.9 0 0 1-.8 1.4H4.4a.9.9 0 0 1-.8-1.4Z" fill="currentColor" />
      <path d="M12 12.2 15 17.4H9Z" fill={A} />
    </>
  ),
  // Әкімші
  bars: (
    <>
      <path d="M4.5 13h3.6v7H4.5ZM15.9 4h3.6v16h-3.6Z" fill="currentColor" />
      <path d="M10.2 9h3.6v11h-3.6Z" fill={A} />
    </>
  ),
  // «Тағы» — төрт тас
  more: (
    <>
      <rect x="4" y="4" width="6.8" height="6.8" rx="2.2" fill="currentColor" />
      <rect x="13.2" y="4" width="6.8" height="6.8" rx="2.2" fill={A} />
      <rect x="4" y="13.2" width="6.8" height="6.8" rx="2.2" fill="currentColor" />
      <rect x="13.2" y="13.2" width="6.8" height="6.8" rx="2.2" fill="currentColor" />
    </>
  ),
  // ── Жоғарғы жолақ белгілері (өз түстерімен) ──
  flame: (
    <>
      <path d="M12 21.5c4.1 0 6.9-2.7 6.9-6.5 0-3.6-2.5-5.9-3.8-8.7-.3 2.1-1.3 3.3-2.5 4 .2-3.1-1.1-5.9-3.6-7.7.2 3.4-1.5 5.4-2.8 7.1A8 8 0 0 0 5.1 15c0 3.7 2.8 6.5 6.9 6.5Z" fill="#A3242B" />
      <path d="M12 20c2 0 3.4-1.4 3.4-3.3 0-1.9-1.3-2.9-2-4.4-.9.8-1.2 1.7-1.2 2.6-.7-.4-1.2-1.1-1.4-1.9-1.1 1-2.2 2.2-2.2 3.7 0 1.9 1.4 3.3 3.4 3.3Z" fill="#E8B23A" />
    </>
  ),
  coin: (
    <>
      <circle cx="12" cy="12" r="9" fill="#E8B23A" />
      <circle cx="12" cy="12" r="6.3" fill="none" stroke="#8A5A00" strokeWidth="1.6" />
      <path d="M12 8.2 14.6 12 12 15.8 9.4 12Z" fill="#8A5A00" />
    </>
  ),
  star: (
    <>
      <path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17.1 6.4 20l1.1-6.2L2.9 9.4l6.3-.9Z" fill="#E8B23A" />
      <path d="m12 7.4 1.4 2.9 3.2.4-2.3 2.2.5 3.1L12 14.5Z" fill="#8A5A00" opacity=".55" />
    </>
  ),
};

export const GLYPHS = Object.keys(G);

export default function ShellGlyph({ name, size = 20, className = "" }) {
  return (
    <svg className={`sx-g ${className}`} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      {G[name] || G.shanyrak}
    </svg>
  );
}
