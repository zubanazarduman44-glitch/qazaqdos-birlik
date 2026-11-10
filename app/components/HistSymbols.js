// Тарих картасының белгілері: ескерткіштер (hl-*) және сол дәуірдің құнды заттары (ht-*).
const S = ({ id, vb = "0 0 64 64", children }) => <symbol id={`${id}`} viewBox={vb} overflow="visible">{children}</symbol>;
const GOLD = "#e8a400", GOLD2 = "#ffd35a", RED = "#b8322a", BRN = "#7a3a12", SAND = "#e9cf94", STONE = "#b9a98a";

export default function HistSymbols() {
  return (
    <defs>
      <linearGradient id="hgold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff0a8" /><stop offset=".5" stopColor={GOLD2} /><stop offset="1" stopColor="#c47e00" /></linearGradient>
      <linearGradient id="hclay" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e39a5c" /><stop offset="1" stopColor="#a8532a" /></linearGradient>
      <linearGradient id="hbronze" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e7b36a" /><stop offset="1" stopColor="#8a5420" /></linearGradient>
      <linearGradient id="hbrick" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8c88b" /><stop offset="1" stopColor="#c9a263" /></linearGradient>

      {/* ── Ескерткіштер ── */}
      <S id="hl-hut">{/* Ботай: жартылай жерұлы үй */}
        <ellipse cx="32" cy="54" rx="26" ry="5" fill="#000" opacity=".15" />
        <path d="M6 52 Q32 -6 58 52Z" fill="#a8744a" /><path d="M32 4 Q52 20 58 52 H32Z" fill="#8a5a36" />
        <path d="M14 40 Q32 6 50 40" fill="none" stroke="#d9b07a" strokeWidth="2" strokeDasharray="4 3" />
        <path d="M24 52 V38 Q32 30 40 38 V52Z" fill="#3a1d0c" />
        <path d="M32 4 L28 -6 M32 4 L36 -6" stroke={BRN} strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="52" cy="50" r="2" fill={RED} />
      </S>
      <S id="hl-petro">{/* Тамғалы: күн бас адамы бар жартас */}
        <ellipse cx="32" cy="58" rx="26" ry="4" fill="#000" opacity=".15" />
        <path d="M8 58 L12 14 Q22 4 34 8 Q50 6 56 18 L54 58Z" fill="#8f7b63" /><path d="M34 8 Q50 6 56 18 L54 58 H34Z" fill="#7b6850" />
        <path d="M12 14 Q22 4 34 8" fill="none" stroke="#c9b595" strokeWidth="2" />
        <g stroke="#f2e3c2" strokeWidth="2.2" strokeLinecap="round" fill="none"><circle cx="28" cy="22" r="5" /><path d="M28 12v-3M28 32v-3M18 22h-3M38 22h-3M21 15l-2-2M35 15l2-2" /><path d="M28 27v12M28 32l-7 5M28 32l7 5M28 39l-5 10M28 39l5 10" /><path d="M44 40q4-6 8-3M44 48q4-6 9-3M46 34l-3-6" /></g>
      </S>
      <S id="hl-kurgan">{/* Берел / Есік: қорған */}
        <ellipse cx="32" cy="54" rx="30" ry="6" fill="#000" opacity=".15" />
        <path d="M2 52 Q8 14 32 10 Q56 14 62 52Z" fill="#9fc15a" /><path d="M32 10 Q56 14 62 52 H32Z" fill="#86a845" />
        <path d="M10 40 Q32 22 54 40" fill="none" stroke="#c9dc8a" strokeWidth="2" opacity=".7" />
        {Array.from({ length: 11 }).map((_, i) => <ellipse key={i} cx={6 + i * 5.2} cy={52 + (i % 2)} rx="3.2" ry="2.4" fill={i % 2 ? STONE : "#9a8a6c"} />)}
        <path d="M32 10 V-2" stroke={BRN} strokeWidth="2.4" /><path d="M32 -2 L44 2 L32 6Z" fill={RED} />
      </S>
      <S id="hl-walls">{/* қала қабырғасы мен қақпа */}
        <ellipse cx="32" cy="58" rx="30" ry="5" fill="#000" opacity=".15" />
        <path d="M2 56 V28 H10 V22 H14 V28 H20 V20 H26 V28 H38 V20 H44 V28 H50 V22 H54 V28 H62 V56Z" fill="url(#hbrick)" />
        <path d="M32 56 V28 H38 V20 H44 V28 H50 V22 H54 V28 H62 V56Z" fill="#b88f55" opacity=".45" />
        <path d="M22 56 V40 Q32 28 42 40 V56Z" fill="#4a2a10" /><path d="M22 40 Q32 28 42 40" fill="none" stroke={GOLD} strokeWidth="2" />
        <rect x="5" y="34" width="4" height="9" rx="2" fill="#4a2a10" /><rect x="55" y="34" width="4" height="9" rx="2" fill="#4a2a10" />
        <path d="M6 20 L6 14 L16 14 L16 20Z" fill="#00afca" /><path d="M2 20 H20" stroke={GOLD} strokeWidth="2" />
      </S>
      <S id="hl-minaret">{/* Сарайшық: мұнара мен күмбез */}
        <ellipse cx="32" cy="58" rx="24" ry="4" fill="#000" opacity=".15" />
        <path d="M24 58 V16 H40 V58Z" fill="url(#hbrick)" /><path d="M32 16 H40 V58 H32Z" fill="#b88f55" opacity=".5" />
        {[22, 30, 38, 46].map((y) => <path key={y} d={`M24 ${y}H40`} stroke="#00afca" strokeWidth="3" />)}
        <path d="M22 16 H42 L38 10 H26Z" fill="#00afca" /><path d="M26 10 Q32 -4 38 10Z" fill="#0a7f99" /><path d="M32 -4 V-10" stroke={GOLD} strokeWidth="2.4" /><circle cx="32" cy="-11" r="2.4" fill={GOLD2} />
        <path d="M6 58 V44 Q14 32 22 44 V58Z" fill="#c9a263" /><path d="M6 44 Q14 32 22 44" fill="#00afca" />
      </S>

      {/* ── Құнды заттар ── */}
      <S id="ht-pot">{/* Ботай қыш құмырасы */}
        <ellipse cx="32" cy="60" rx="18" ry="3.5" fill="#000" opacity=".18" />
        <path d="M20 12 H44 L46 20 Q58 32 46 52 Q32 62 18 52 Q6 32 18 20Z" fill="url(#hclay)" />
        <path d="M18 20 H46" stroke="#5a2a10" strokeWidth="3" /><path d="M16 30 q8 5 16 0 t16 0" fill="none" stroke="#f8d9a8" strokeWidth="2.4" />
        <g fill="#f8d9a8"><path d="M24 44 q2-6 8-6 l4-5 2 3 -2 2 q6 0 6 6 h-3 l-1 5 h-2 l-1-4 h-6 l-1 4 h-2 l-1-5z" /></g>
      </S>
      <S id="ht-sun">{/* күн бас петроглифі (алтын) */}
        <circle cx="32" cy="32" r="14" fill="url(#hgold)" stroke={RED} strokeWidth="2" /><circle cx="32" cy="32" r="6" fill="none" stroke={RED} strokeWidth="2" />
        {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M32 ${12} V4`} stroke={GOLD} strokeWidth="3.4" strokeLinecap="round" transform={`rotate(${i * 30} 32 32)`} />)}
      </S>
      <S id="ht-goldhorse">{/* Берел алтын жылқы әшекейі */}
        <ellipse cx="32" cy="60" rx="20" ry="3" fill="#000" opacity=".15" />
        <path d="M10 44 Q14 24 28 20 L34 8 L38 16 Q50 14 54 22 L52 28 Q44 26 42 32 L46 50 H40 L36 38 Q26 40 22 50 H14Z" fill="url(#hgold)" stroke="#a46c00" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="44" cy="22" r="2" fill={RED} /><path d="M20 34 q6 -6 14 -2" fill="none" stroke="#a46c00" strokeWidth="1.6" /><circle cx="26" cy="30" r="2.2" fill="#00afca" />
      </S>
      <S id="ht-goldman">{/* Алтын адам дулығасы */}
        <ellipse cx="32" cy="60" rx="18" ry="3" fill="#000" opacity=".15" />
        <path d="M14 56 V34 Q14 10 32 8 Q50 10 50 34 V56Z" fill="url(#hgold)" stroke="#a46c00" strokeWidth="1.6" />
        <path d="M32 8 L22 -6 L28 4 L32 -10 L36 4 L42 -6Z" fill={GOLD2} stroke="#a46c00" strokeWidth="1.4" />
        <g fill="#a46c00"><path d="M20 22 l4 -8 2 8z M30 18 l2 -10 2 10z M38 22 l2 -8 4 8z" /><circle cx="24" cy="34" r="2" /><circle cx="40" cy="34" r="2" /><circle cx="32" cy="44" r="2" /></g>
        <path d="M18 28 Q32 22 46 28" fill="none" stroke={RED} strokeWidth="2.2" />
      </S>
      <S id="ht-coin">{/* Жібек жолы теңгесі */}
        <ellipse cx="32" cy="60" rx="18" ry="3" fill="#000" opacity=".15" />
        <circle cx="32" cy="32" r="24" fill="url(#hgold)" stroke="#a46c00" strokeWidth="2.4" /><circle cx="32" cy="32" r="18" fill="none" stroke="#a46c00" strokeWidth="1.6" strokeDasharray="3 3" />
        <rect x="26" y="26" width="12" height="12" fill="none" stroke={RED} strokeWidth="2.6" /><path d="M32 22 V42 M22 32 H42" stroke={RED} strokeWidth="2" />
      </S>
      <S id="ht-scroll">{/* Отырар кітапханасы */}
        <ellipse cx="32" cy="60" rx="22" ry="3" fill="#000" opacity=".15" />
        <rect x="12" y="14" width="40" height="38" rx="4" fill="#f6e7c1" stroke="#b88f55" strokeWidth="2" /><ellipse cx="12" cy="33" rx="5" ry="19" fill="#e7cf98" stroke="#b88f55" strokeWidth="2" /><ellipse cx="52" cy="33" rx="5" ry="19" fill="#e7cf98" stroke="#b88f55" strokeWidth="2" />
        <g stroke={BRN} strokeWidth="2" strokeLinecap="round"><path d="M20 22H44M20 29H40M20 36H44M20 43H34" /></g><circle cx="42" cy="44" r="4" fill={RED} />
      </S>
      <S id="ht-helmet">{/* жауынгер дулығасы */}
        <ellipse cx="32" cy="60" rx="20" ry="3" fill="#000" opacity=".15" />
        <path d="M10 46 Q10 14 32 10 Q54 14 54 46Z" fill="#c9d3da" stroke="#5c6b76" strokeWidth="2" /><path d="M32 10 Q54 14 54 46 H32Z" fill="#9aa8b3" /><path d="M32 10 V-4" stroke="#5c6b76" strokeWidth="3" /><circle cx="32" cy="-5" r="3" fill={GOLD2} stroke="#a46c00" />
        <path d="M10 46 H54 V52 H10Z" fill={GOLD} /><path d="M26 28 V46 M38 28 V46" stroke="#5c6b76" strokeWidth="3" />
      </S>
      <S id="ht-cauldron">{/* Тасқазан */}
        <ellipse cx="32" cy="60" rx="22" ry="3" fill="#000" opacity=".18" />
        <path d="M8 26 Q8 54 32 54 Q56 54 56 26Z" fill="url(#hbronze)" stroke="#5a3410" strokeWidth="2" /><ellipse cx="32" cy="26" rx="24" ry="7" fill="#6a3d14" stroke="#5a3410" strokeWidth="2" />
        <path d="M4 26 q-4 -8 2 -10 M60 26 q4 -8 -2 -10" stroke="#5a3410" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M12 38 q10 6 20 0 t20 0" fill="none" stroke="#f8d9a8" strokeWidth="2" /><path d="M14 46 L12 58 M50 46 L52 58" stroke="#5a3410" strokeWidth="4" strokeLinecap="round" />
      </S>
      <S id="ht-bow">{/* садақ пен жебе */}
        <ellipse cx="32" cy="60" rx="18" ry="3" fill="#000" opacity=".15" />
        <path d="M18 6 Q54 32 18 58" fill="none" stroke="#8a4a1a" strokeWidth="5" strokeLinecap="round" /><path d="M18 6 L18 58" stroke="#f4e3b8" strokeWidth="1.6" />
        <path d="M12 32 H52" stroke="#5a3410" strokeWidth="3" strokeLinecap="round" /><path d="M52 32 l-8 -5 v10z" fill="#9aa8b3" /><path d="M14 32 l-5 -4 M14 32 l-5 4" stroke={RED} strokeWidth="2.4" strokeLinecap="round" />
      </S>
      <S id="ht-balbal">{/* балбал тас мүсін */}
        <ellipse cx="32" cy="60" rx="16" ry="3" fill="#000" opacity=".15" />
        <path d="M20 58 V30 Q16 22 24 18 Q22 6 32 6 Q42 6 40 18 Q48 22 44 30 V58Z" fill="#a8a08e" stroke="#6b6354" strokeWidth="2" /><path d="M32 6 Q42 6 40 18 Q48 22 44 30 V58 H32Z" fill="#8c8472" />
        <circle cx="28" cy="16" r="1.6" fill="#3a2f1e" /><circle cx="36" cy="16" r="1.6" fill="#3a2f1e" /><path d="M28 22 q4 3 8 0" fill="none" stroke="#3a2f1e" strokeWidth="1.6" /><path d="M20 38 H44" stroke="#6b6354" strokeWidth="2.4" /><circle cx="32" cy="38" r="3" fill={GOLD} />
      </S>
    </defs>
  );
}
