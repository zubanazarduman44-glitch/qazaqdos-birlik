// Alash — TILIM кейіпкері. Аспан-көк, басында алтын шаңырақ, кеудесінде қошқар мүйіз өрнегі.
// mood: idle | happy | think | wow | support | cheer | sleep
import { useId } from "react";

const MOUTHS = {
  idle: <path d="M88 132 Q100 143 112 132" stroke="#0d2a44" strokeWidth="4" fill="none" strokeLinecap="round" />,
  happy: (
    <g>
      <path d="M85 128 Q100 150 115 128 Z" fill="#0d2a44" />
      <path d="M92 139 Q100 146 108 139 Q100 136 92 139Z" fill="#ff7a90" />
    </g>
  ),
  cheer: (
    <g>
      <path d="M83 126 Q100 154 117 126 Z" fill="#0d2a44" />
      <path d="M91 140 Q100 149 109 140 Q100 136 91 140Z" fill="#ff7a90" />
    </g>
  ),
  think: <path d="M92 136 Q102 132 110 136" stroke="#0d2a44" strokeWidth="4" fill="none" strokeLinecap="round" />,
  wow: <ellipse cx="100" cy="136" rx="8" ry="10" fill="#0d2a44" />,
  support: <path d="M90 134 Q100 141 110 134" stroke="#0d2a44" strokeWidth="4" fill="none" strokeLinecap="round" />,
  sleep: <path d="M93 136 Q100 139 107 136" stroke="#0d2a44" strokeWidth="3.5" fill="none" strokeLinecap="round" />,
};

function Eyes({ mood }) {
  if (mood === "sleep" || mood === "happy" || mood === "cheer") {
    // Жабық / күлген көздер
    const d = mood === "sleep" ? "M -11 0 Q 0 6 11 0" : "M -11 3 Q 0 -8 11 3";
    return (
      <g stroke="#0d2a44" strokeWidth="4.5" fill="none" strokeLinecap="round">
        <path d={d} transform="translate(78 108)" />
        <path d={d} transform="translate(122 108)" />
      </g>
    );
  }
  const look = mood === "think" ? { x: 3, y: -4 } : { x: 0, y: 0 };
  const big = mood === "wow" ? 1.12 : 1;
  return (
    <g className="bk-eyes">
      {[78, 122].map((cx) => (
        <g key={cx} transform={`translate(${cx} 106) scale(${big})`}>
          <ellipse rx="13" ry="15" fill="#fff" />
          <ellipse cx={look.x} cy={look.y + 1} rx="8" ry="9.5" fill="#0d2a44" />
          <circle cx={look.x + 3} cy={look.y - 3} r="3.2" fill="#fff" />
          <circle cx={look.x - 3} cy={look.y + 4} r="1.4" fill="#fff" opacity=".8" />
        </g>
      ))}
      {mood === "support" && (
        <g stroke="#0d2a44" strokeWidth="3.5" strokeLinecap="round">
          <path d="M66 86 L86 82" />
          <path d="M134 86 L114 82" />
        </g>
      )}
    </g>
  );
}

export default function Alash({ mood = "idle", size = 160, className = "", title = "Alash" }) {
  // Әр кейіпкерге бөлек градиент id (жасырын SVG-дегі анықтамаға сілтеме жасалмауы үшін)
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const B = `bkB${uid}`, G = `bkG${uid}`, Y = `bkY${uid}`;
  const armsUp = mood === "happy" || mood === "cheer";
  return (
    <svg
      className={`alash bk-${mood} ${className}`}
      viewBox="0 0 200 230"
      width={size}
      height={(size * 230) / 200}
      role="img"
      aria-label={title}
    >
      <defs>
        <radialGradient id={B} cx="38%" cy="30%" r="80%">
          <stop offset="0" stopColor="#8fe0ff" />
          <stop offset=".55" stopColor="#32aef0" />
          <stop offset="1" stopColor="#1576c9" />
        </radialGradient>
        <linearGradient id={G} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe27a" />
          <stop offset="1" stopColor="#e9a400" />
        </linearGradient>
        <radialGradient id={Y} cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".95" />
          <stop offset="1" stopColor="#c9f0ff" stopOpacity=".9" />
        </radialGradient>
      </defs>

      {/* Көлеңке */}
      <ellipse className="bk-shadow" cx="100" cy="220" rx="46" ry="7" fill="#0d2a44" opacity=".14" />

      <g className="bk-float">
        {/* Аяқтар */}
        <ellipse cx="80" cy="205" rx="15" ry="9" fill="#1576c9" />
        <ellipse cx="120" cy="205" rx="15" ry="9" fill="#1576c9" />

        {/* Дене */}
        <path
          d="M100 42 C150 42 172 82 172 128 C172 176 142 206 100 206 C58 206 28 176 28 128 C28 82 50 42 100 42 Z"
          fill={`url(#${B})`}
        />
        {/* Жылтыр */}
        <path d="M60 70 Q72 54 92 50" stroke="#fff" strokeWidth="7" strokeLinecap="round" fill="none" opacity=".55" />
        <ellipse cx="100" cy="166" rx="40" ry="30" fill={`url(#${Y})`} />

        {/* Қолдар */}
        <g className="bk-arm-l" style={{ transformOrigin: "40px 140px" }}>
          <path
            d={armsUp ? "M44 132 Q22 108 24 84" : mood === "think" ? "M42 142 Q26 160 34 178" : "M40 140 Q22 156 26 178"}
            stroke="#2496e0"
            strokeWidth="15"
            strokeLinecap="round"
            fill="none"
          />
        </g>
        <g className="bk-arm-r" style={{ transformOrigin: "160px 140px" }}>
          <path
            d={armsUp ? "M156 132 Q178 108 176 84" : mood === "think" ? "M160 142 Q150 166 124 156" : "M160 140 Q178 156 174 178"}
            stroke="#2496e0"
            strokeWidth="15"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Қошқар мүйіз өрнегі */}
        <g stroke={`url(#${G})`} strokeWidth="4" fill="none" strokeLinecap="round">
          <path d="M100 178 C100 166 92 160 86 164 C80 168 84 176 90 174" />
          <path d="M100 178 C100 166 108 160 114 164 C120 168 116 176 110 174" />
          <path d="M100 178 L100 186" />
        </g>

        {/* Шаңырақ (алтын тәж) */}
        <g className="bk-crown">
          <path d="M66 50 Q100 18 134 50" fill="none" stroke={`url(#${G})`} strokeWidth="6" strokeLinecap="round" />
          <circle cx="100" cy="30" r="13" fill={`url(#${G})`} stroke="#c98a00" strokeWidth="2" />
          <g stroke="#c98a00" strokeWidth="2.2">
            <path d="M91 30 H109" />
            <path d="M100 21 V39" />
            <path d="M94 24 L106 36" />
            <path d="M106 24 L94 36" />
          </g>
          <circle cx="100" cy="30" r="4" fill="#fff6c8" />
          <path d="M80 44 L86 34 M120 44 L114 34" stroke={`url(#${G})`} strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* Бет */}
        <Eyes mood={mood} />
        <ellipse cx="62" cy="128" rx="10" ry="6" fill="#ff8fb0" opacity=".55" />
        <ellipse cx="138" cy="128" rx="10" ry="6" fill="#ff8fb0" opacity=".55" />
        {MOUTHS[mood] || MOUTHS.idle}
      </g>

      {/* Қосымша эффектілер */}
      {mood === "think" && (
        <g className="bk-fx">
          <circle cx="160" cy="58" r="5" fill="#fff" stroke="#9cc7e6" strokeWidth="2" />
          <circle cx="172" cy="40" r="8" fill="#fff" stroke="#9cc7e6" strokeWidth="2" />
          <text x="172" y="45" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1576c9">?</text>
        </g>
      )}
      {(mood === "wow" || mood === "cheer") && (
        <g className="bk-fx bk-sparkle" fill={`url(#${G})`}>
          <path d="M30 40 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z" />
          <path d="M170 60 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" />
          <path d="M160 18 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" />
        </g>
      )}
      {mood === "sleep" && (
        <g className="bk-fx bk-zzz" fill="#1576c9" fontWeight="800">
          <text x="150" y="60" fontSize="18">z</text>
          <text x="164" y="42" fontSize="14">z</text>
          <text x="175" y="28" fontSize="11">z</text>
        </g>
      )}
    </svg>
  );
}
