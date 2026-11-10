// Карта белгілері: орман, тау, киіз үй, құм және әр өңірдің үлкен белгісі (бәрі SVG <symbol>).
const S = ({ id, vb = "0 0 64 64", children }) => <symbol id={`ks-${id}`} viewBox={vb} overflow="visible">{children}</symbol>;

export default function KzSymbols() {
  return (
    <defs>
      {/* ── жер бедерінің кішкентай бөлшектері ── */}
      <S id="pine" vb="0 0 32 44">
        <path d="M16 2 L27 18 H21 L30 32 H19 V42 H13 V32 H2 L11 18 H5Z" fill="#2d7a3a" />
        <path d="M16 2 L27 18 H21 L30 32 H19 V42 H16Z" fill="#256b32" />
        <path d="M16 2 L10 12 L14 11 L9 20 L16 17Z" fill="#4fae52" opacity=".75" />
      </S>
      <S id="bush" vb="0 0 30 20">
        <ellipse cx="15" cy="13" rx="14" ry="7" fill="#4c9a3c" /><ellipse cx="10" cy="9" rx="7" ry="6" fill="#62b44a" /><ellipse cx="20" cy="10" rx="6" ry="5" fill="#57a843" />
      </S>
      <S id="mountain" vb="0 0 80 60">
        <path d="M2 58 L28 22 L40 36 L46 28 L78 58Z" fill="#8c7a5e" />
        <path d="M40 4 L72 58 H10Z" fill="#8a6a4a" />
        <path d="M40 4 L72 58 H46 L42 30Z" fill="#6b4f36" />
        <path d="M40 4 L53 26 L45 22 L40 31 L34 22 L27 26Z" fill="#fff" />
        <path d="M40 4 L53 26 L47 23 L44 17Z" fill="#d6e6f4" />
        <path d="M28 22 L36 34 L30 30 L26 36 L20 30Z" fill="#fff" opacity=".9" />
      </S>
      <S id="yurt" vb="0 0 44 36">
        <path d="M4 32 C4 18 14 10 22 10 C30 10 40 18 40 32Z" fill="#fffaf0" stroke="#a58a5a" strokeWidth="1.2" />
        <path d="M13 12 C16 5 28 5 31 12 C27 9 17 9 13 12Z" fill="#fff" stroke="#a58a5a" strokeWidth="1" />
        <rect x="4" y="22" width="36" height="5" fill="#0a8aa6" />
        <path d="M8 24.5 h28" stroke="#ffd35a" strokeWidth="1.4" strokeDasharray="2 2" />
        <path d="M18 32 V25 Q22 21 26 25 V32Z" fill="#b8322a" />
        <circle cx="22" cy="8" r="1.8" fill="#e8a400" />
      </S>
      <S id="dune" vb="0 0 60 22">
        <path d="M2 20 C12 4 24 4 32 12 C40 18 50 14 58 20Z" fill="#e6c474" />
        <path d="M32 12 C40 18 50 14 58 20 H34Z" fill="#cfa752" />
        <path d="M6 18 C14 8 22 8 28 13" stroke="#fff3c2" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </S>
      <S id="camelS" vb="0 0 44 36">
        <ellipse cx="22" cy="31" rx="14" ry="2.4" fill="#000" opacity=".12" />
        <path d="M8 26 C8 18 12 14 16 18 C18 12 24 12 26 18 C30 12 36 18 34 26 L34 31 H31 V26 H14 V31 H11 V26Z" fill="#c9954a" />
        <path d="M30 20 C34 14 36 8 40 8 C42 8 42 11 40 12 C38 14 38 18 36 22Z" fill="#b57f38" />
        <circle cx="39" cy="9.4" r="1" fill="#2a1708" />
        <path d="M14 21 H30 V24 H14Z" fill="#b8322a" />
      </S>

      {/* ── өңірлердің үлкен белгілері ── */}
      <S id="baiterek" vb="0 0 64 80">
        <ellipse cx="32" cy="76" rx="22" ry="4" fill="#000" opacity=".16" />
        <path d="M27 76 L30 34 H34 L37 76Z" fill="#dfe6f2" /><path d="M32 34 H34 L37 76 H32Z" fill="#b9c4d8" />
        <g stroke="#9fb0cc" strokeWidth="1.6" fill="none" strokeLinecap="round"><path d="M32 40 C20 38 14 30 14 20 M32 40 C44 38 50 30 50 20 M32 44 C24 44 18 36 20 26 M32 44 C40 44 46 36 44 26" /></g>
        <circle cx="32" cy="18" r="14" fill="#ffd35a" stroke="#b8822a" strokeWidth="1.6" />
        <circle cx="32" cy="18" r="9" fill="#ffe48a" stroke="#e39b00" strokeWidth="1.2" />
        <path d="M32 4 V2 M32 4 l2 -3 M32 4 l-2 -3" stroke="#b8822a" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 78 H40" stroke="#6b4a2a" strokeWidth="3" />
      </S>
      <S id="almaty" vb="0 0 72 64">
        <ellipse cx="36" cy="60" rx="30" ry="3.5" fill="#000" opacity=".14" />
        <path d="M4 58 L26 20 L36 34 L44 22 L68 58Z" fill="#8a6a4a" /><path d="M44 22 L68 58 H44 L40 36Z" fill="#6b4f36" />
        <path d="M26 20 L36 34 L28 30 L24 36 L18 30Z" fill="#fff" /><path d="M44 22 L53 38 L47 35 L44 41 L38 36Z" fill="#fff" />
        <path d="M14 58 C14 48 22 46 28 52 C34 44 44 46 46 58Z" fill="#4c9a3c" />
        <circle cx="50" cy="50" r="9" fill="#d62d2d" stroke="#8a1414" strokeWidth="1.4" /><path d="M50 41 q1 -6 6 -7" stroke="#4a2c12" strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M52 42 q5 -4 8 0 q-4 4 -8 0Z" fill="#4c9a3c" />
        <circle cx="46" cy="47" r="2" fill="#fff" opacity=".5" />
      </S>
      <S id="mosque" vb="0 0 64 64">
        <ellipse cx="32" cy="60" rx="26" ry="3.4" fill="#000" opacity=".14" />
        <rect x="12" y="36" width="40" height="24" fill="#f3e3c0" stroke="#a58a5a" strokeWidth="1.2" />
        <path d="M14 36 C14 18 50 18 50 36Z" fill="#12a1b8" stroke="#0a6f86" strokeWidth="1.4" />
        <path d="M32 18 V10" stroke="#e8a400" strokeWidth="2" /><circle cx="32" cy="9" r="2.4" fill="#ffd35a" />
        <path d="M26 60 V46 Q32 38 38 46 V60Z" fill="#8a5326" />
        <g fill="#e8a400"><rect x="4" y="22" width="5" height="38" fill="#f3e3c0" stroke="#a58a5a" strokeWidth="1" /><rect x="55" y="22" width="5" height="38" fill="#f3e3c0" stroke="#a58a5a" strokeWidth="1" /><path d="M3 22 L6.5 12 L10 22Z" fill="#12a1b8" /><path d="M54 22 L57.5 12 L61 22Z" fill="#12a1b8" /></g>
      </S>
      <S id="lake" vb="0 0 72 56">
        <ellipse cx="36" cy="46" rx="30" ry="9" fill="#2aa7d6" stroke="#1d7fa8" strokeWidth="1.6" />
        <ellipse cx="32" cy="44" rx="18" ry="4" fill="#7fd6f2" opacity=".8" />
        <path d="M6 42 L14 24 L22 34 L28 20 L38 40Z" fill="#8a8f98" /><path d="M28 20 L38 40 L30 38Z" fill="#6b707a" />
        <path d="M44 38 l8 -18 l8 18Z" fill="#2d7a3a" /><path d="M52 20 l8 18 h-8Z" fill="#256b32" /><path d="M56 40 l6 -13 l6 13Z" fill="#2d7a3a" />
        <path d="M18 46 q4 2 8 0 M42 48 q4 2 8 0" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </S>
      <S id="canyon" vb="0 0 72 56">
        <ellipse cx="36" cy="52" rx="32" ry="3.4" fill="#000" opacity=".14" />
        <path d="M4 52 L8 30 L18 22 L24 30 L30 14 L40 24 L46 16 L56 28 L62 22 L68 52Z" fill="#d9794a" />
        <path d="M30 14 L40 24 L46 16 L56 28 L62 22 L68 52 H44 L40 34Z" fill="#b95c34" />
        <g stroke="#f2a276" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".85"><path d="M10 38 H26 M20 30 H30 M32 30 H44 M46 36 H62 M12 46 H62" /></g>
        <path d="M30 52 C34 40 38 40 42 52Z" fill="#7a3a1a" />
      </S>
      <S id="fish" vb="0 0 72 56">
        <ellipse cx="36" cy="50" rx="30" ry="4" fill="#2aa7d6" opacity=".55" />
        <path d="M14 28 C22 12 44 10 54 26 C44 42 22 44 14 28Z" fill="#ff9d3a" stroke="#c9631a" strokeWidth="1.6" />
        <path d="M52 26 L68 12 V42Z" fill="#ff7a1c" stroke="#c9631a" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M30 16 C34 8 42 8 44 14Z" fill="#ff7a1c" /><path d="M28 40 C32 46 38 46 40 40Z" fill="#ff7a1c" />
        <path d="M24 22 C22 28 22 30 24 34 M32 20 C30 26 30 32 32 38" stroke="#fff" strokeWidth="1.6" fill="none" opacity=".6" />
        <circle cx="21" cy="25" r="3.2" fill="#fff" /><circle cx="20.4" cy="25" r="1.8" fill="#2a1708" />
        <path d="M6 44 q6 -5 12 0 t12 0 t12 0" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".8" />
      </S>
      <S id="monument" vb="0 0 56 72">
        <ellipse cx="28" cy="68" rx="22" ry="3.4" fill="#000" opacity=".14" />
        <path d="M10 66 H46 V58 H10Z" fill="#b9b2a2" /><path d="M16 58 H40 V28 H16Z" fill="#d6cfbf" /><path d="M32 58 H40 V28 H32Z" fill="#b9b2a2" />
        <path d="M12 28 H44 L36 18 H20Z" fill="#e6dfcf" />
        <path d="M14 18 C14 8 28 4 28 14 C28 4 42 8 42 18 C34 14 30 16 28 20 C26 16 22 14 14 18Z" fill="#ffd35a" stroke="#b8822a" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M28 14 V20" stroke="#b8822a" strokeWidth="1.2" />
        <path d="M22 40 h12 M22 46 h12 M22 52 h12" stroke="#a89f8c" strokeWidth="1.4" strokeLinecap="round" />
      </S>
      <S id="mausoleum" vb="0 0 64 64">
        <ellipse cx="32" cy="60" rx="24" ry="3.4" fill="#000" opacity=".14" />
        <path d="M12 58 V32 H52 V58Z" fill="#c9793c" stroke="#8a4a1e" strokeWidth="1.2" />
        <path d="M32 6 C40 16 52 22 52 32 H12 C12 22 24 16 32 6Z" fill="#e0a14a" stroke="#8a4a1e" strokeWidth="1.2" />
        <path d="M32 6 C40 16 52 22 52 32 H32Z" fill="#c9852f" />
        <path d="M24 58 V42 Q32 32 40 42 V58Z" fill="#4a2410" />
        <g stroke="#8a4a1e" strokeWidth="1" opacity=".55"><path d="M12 40 H52 M12 48 H52 M20 32 V58 M32 32 V42 M44 32 V58" /></g>
        <path d="M32 6 V1" stroke="#ffd35a" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 36 H50" stroke="#12a1b8" strokeWidth="3" />
      </S>
      <S id="mine" vb="0 0 64 68">
        <ellipse cx="32" cy="64" rx="26" ry="3.4" fill="#000" opacity=".14" />
        <path d="M2 62 L18 40 L32 52 L44 38 L62 62Z" fill="#7a746a" /><path d="M44 38 L62 62 H46Z" fill="#5f5a52" />
        <path d="M16 62 L26 12 H30 L34 62Z" fill="#e09a30" stroke="#8a5a14" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M18 54 L32 46 M20 42 L32 34 M22 30 L30 24" stroke="#8a5a14" strokeWidth="1.4" />
        <circle cx="28" cy="14" r="9" fill="#2f2f33" stroke="#e09a30" strokeWidth="2.4" /><circle cx="28" cy="14" r="2.6" fill="#e09a30" />
        <path d="M38 62 H58 L54 52 H42Z" fill="#9a4a2a" /><circle cx="44" cy="62" r="3" fill="#2f2f33" /><circle cx="54" cy="62" r="3" fill="#2f2f33" />
        <path d="M40 52 L42 46 H54 L56 52Z" fill="#2f2f33" />
      </S>
      <S id="wheat" vb="0 0 64 64">
        <ellipse cx="32" cy="60" rx="24" ry="3.4" fill="#000" opacity=".14" />
        <path d="M2 58 C14 50 50 50 62 58 V62 H2Z" fill="#8fc43c" />
        {[16, 32, 48].map((x, i) => (
          <g key={x} transform={`translate(0 ${i === 1 ? 0 : 6})`}>
            <path d={`M${x} 58 V22`} stroke="#b8860b" strokeWidth="2.4" strokeLinecap="round" />
            {[0, 7, 14, 21].map((o) => (<g key={o}><path d={`M${x} ${22 + o} q-8 -2 -8 -10 q8 0 8 10`} fill="#f2c13a" stroke="#b8860b" strokeWidth=".8" /><path d={`M${x} ${22 + o} q8 -2 8 -10 q-8 0 -8 10`} fill="#e8a400" stroke="#b8860b" strokeWidth=".8" /></g>))}
            <path d={`M${x} 22 q-3 -10 0 -16 q3 6 0 16`} fill="#f2c13a" stroke="#b8860b" strokeWidth=".8" />
          </g>
        ))}
      </S>
      <S id="rocket" vb="0 0 56 76">
        <ellipse cx="28" cy="72" rx="24" ry="3.6" fill="#000" opacity=".14" />
        <path d="M10 72 H46 L44 64 H12Z" fill="#8a8f98" /><path d="M20 64 V52 M36 64 V52" stroke="#6b707a" strokeWidth="3" />
        <path d="M28 4 C38 14 40 30 38 54 H18 C16 30 18 14 28 4Z" fill="#f4f6fb" stroke="#9aa3b4" strokeWidth="1.4" />
        <path d="M28 4 C38 14 40 30 38 54 H28Z" fill="#dfe4ef" />
        <path d="M28 4 C33 8 36 12 37 16 H19 C20 12 23 8 28 4Z" fill="#d62d2d" />
        <circle cx="28" cy="30" r="5.4" fill="#12a1b8" stroke="#6b707a" strokeWidth="1.6" /><circle cx="26.4" cy="28.6" r="1.6" fill="#fff" opacity=".7" />
        <path d="M18 44 L8 58 L18 54Z M38 44 L48 58 L38 54Z" fill="#d62d2d" stroke="#8a1414" strokeWidth="1" strokeLinejoin="round" />
        <path d="M22 54 L28 66 L34 54Z" fill="#ffb02e" /><path d="M25 54 L28 62 L31 54Z" fill="#fff3a0" />
        <circle cx="12" cy="66" r="5" fill="#fff" opacity=".7" /><circle cx="44" cy="66" r="6" fill="#fff" opacity=".7" />
      </S>
      <S id="camel" vb="0 0 72 60">
        <ellipse cx="36" cy="55" rx="26" ry="3.4" fill="#000" opacity=".14" />
        <path d="M14 42 C12 28 18 22 24 28 C26 18 36 18 38 28 C44 20 52 28 50 42 L50 54 H45 L44 44 H22 L21 54 H16Z" fill="#c9954a" stroke="#8a5a1e" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M46 30 C52 22 54 12 60 10 C64 9 64 15 62 17 C58 19 58 26 56 32Z" fill="#b57f38" stroke="#8a5a1e" strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx="61" cy="12.4" r="1.4" fill="#2a1708" /><path d="M64 14 q2 1 2 3" stroke="#8a5a1e" strokeWidth="1.2" fill="none" />
        <path d="M20 32 H44 L42 40 H22Z" fill="#b8322a" stroke="#6b1a14" strokeWidth="1" /><path d="M22 36 H42" stroke="#ffd35a" strokeWidth="1.6" strokeDasharray="3 2" />
        <path d="M14 42 C10 44 10 50 12 52" stroke="#8a5a1e" strokeWidth="2" fill="none" strokeLinecap="round" />
      </S>
      <S id="snowpine" vb="0 0 56 72">
        <ellipse cx="28" cy="68" rx="20" ry="3.4" fill="#000" opacity=".14" />
        <path d="M28 4 L42 26 H34 L48 48 H32 V64 H24 V48 H8 L22 26 H14Z" fill="#2d7a3a" /><path d="M28 4 L42 26 H34 L48 48 H32 V64 H28Z" fill="#256b32" />
        <path d="M28 4 L36 17 L30 15 L28 22 L24 15 L20 17Z" fill="#fff" /><path d="M16 38 L24 30 L30 38 L38 30 L44 40 L32 36 L22 41Z" fill="#fff" opacity=".95" />
        <path d="M10 48 L18 44 L26 50 L34 44 L46 48 L36 52 L24 52Z" fill="#fff" />
        <path d="M44 62 l4 -8 l4 8Z" fill="#fff" />
      </S>
      <S id="yasawi" vb="0 0 72 68">
        <ellipse cx="36" cy="64" rx="30" ry="3.6" fill="#000" opacity=".14" />
        <rect x="6" y="38" width="60" height="26" fill="#e8d1a0" stroke="#a58a5a" strokeWidth="1.2" />
        <path d="M22 64 V38 Q36 26 50 38 V64Z" fill="#d9bd86" stroke="#a58a5a" strokeWidth="1.2" />
        <path d="M28 64 V42 Q36 34 44 42 V64Z" fill="#1d3f6e" />
        <path d="M4 38 C4 28 18 24 20 30 L20 38Z" fill="#12a1b8" stroke="#0a6f86" strokeWidth="1.2" /><path d="M68 38 C68 28 54 24 52 30 L52 38Z" fill="#12a1b8" stroke="#0a6f86" strokeWidth="1.2" />
        <path d="M24 38 C24 8 48 8 48 38Z" fill="#14b4cc" stroke="#0a6f86" strokeWidth="1.6" />
        <g stroke="#0a6f86" strokeWidth="1.2" opacity=".6" fill="none"><path d="M36 10 V38 M30 12 C28 20 28 30 30 38 M42 12 C44 20 44 30 42 38" /></g>
        <path d="M36 10 V2" stroke="#ffd35a" strokeWidth="2.4" strokeLinecap="round" /><circle cx="36" cy="3" r="2.4" fill="#ffd35a" />
        <path d="M26 36 H46" stroke="#ffd35a" strokeWidth="2.4" /><path d="M10 48 H20 M52 48 H62" stroke="#12a1b8" strokeWidth="3" />
      </S>
      <S id="deer" vb="0 0 64 72">
        <ellipse cx="32" cy="68" rx="22" ry="3.4" fill="#000" opacity=".14" />
        <path d="M18 40 C18 30 28 28 38 30 C46 30 50 36 48 44 L48 64 H43 L42 50 H26 L25 64 H20Z" fill="#a8672e" stroke="#6b3d16" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M40 32 C44 24 44 16 48 12 C52 10 54 14 52 18 C50 22 50 30 48 36Z" fill="#b8742f" stroke="#6b3d16" strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx="52" cy="14" r="1.2" fill="#2a1708" />
        <g stroke="#6b4a2a" strokeWidth="2.4" strokeLinecap="round" fill="none"><path d="M46 12 L42 2 M43 6 L38 6 M42 2 L38 -1 M50 10 L56 2 M54 5 L59 5 M56 2 L60 -2" /></g>
        <path d="M22 44 C28 48 38 48 44 44" stroke="#e6c9a0" strokeWidth="3" fill="none" strokeLinecap="round" />
      </S>
    </defs>
  );
}
