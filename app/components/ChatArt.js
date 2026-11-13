// ChatArt — «Дастарқан» чатының киіз-аппликация суреттері (таза SVG, id жоқ).

// Aqyl Vision бастау картасы: киіз фотоаппарат + жұлдызша
export function ChatCamArt({ size = 64 }) {
  return (
    <svg className="cx-camart" viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      <rect x="2" y="2" width="116" height="116" rx="28" fill="#0A4A61" />
      <rect x="9" y="9" width="102" height="102" rx="22" fill="none" stroke="#E0A526" strokeWidth="2" strokeDasharray="5 5" opacity="0.7" />
      <path d="M40 38l6-10h28l6 10z" fill="#F6E3B0" />
      <rect x="20" y="36" width="80" height="56" rx="14" fill="#FAF6EE" />
      <rect x="20" y="78" width="80" height="14" rx="7" fill="#F4ECDA" />
      <circle cx="60" cy="64" r="21" fill="#E0A526" />
      <circle cx="60" cy="64" r="14" fill="#1F2430" />
      <circle cx="60" cy="64" r="8" fill="#0F5E7A" />
      <circle cx="55" cy="59" r="3.5" fill="#FAF6EE" />
      <circle cx="88" cy="47" r="4.5" fill="#B8322A" />
      <path d="M96 14l3.2 8.8L108 26l-8.8 3.2L96 38l-3.2-8.8L84 26l8.8-3.2z" fill="#E0A526" />
      <path d="M22 96l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#F6E3B0" />
    </svg>
  );
}

// Тақырыптағы шаңырақ доғасы (Aqyl артындағы киіз дөңгелек)
export function ChatDisc() {
  return (
    <svg className="cx-disc" viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="98" fill="#B8322A" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="#E0A526" strokeWidth="3" strokeDasharray="7 7" />
      <g className="cx-disc-rays" stroke="#8A2018" strokeWidth="6" strokeLinecap="round" opacity="0.9">
        <path d="M100 30v26M100 144v26M30 100h26M144 100h26M51 51l18 18M131 131l18 18M149 51l-18 18M69 131l-18 18" />
      </g>
      <circle cx="100" cy="100" r="44" fill="#8A2018" />
      <circle cx="100" cy="100" r="36" fill="none" stroke="#F6E3B0" strokeWidth="2" strokeDasharray="4 5" opacity="0.6" />
    </svg>
  );
}
