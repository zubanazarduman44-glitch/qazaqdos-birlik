// Qyran — TILIM кейіпкері: мейірімді алтын қыран (бүркіт). Маңдайында күн белгісі, кеудесінде қошқар мүйіз өрнегі.
// mood: idle | happy | think | wow | support | cheer | sleep
import { useId } from "react";

const INK = "#2a1708";

function Mouth({ mood }) {
  switch (mood) {
    case "happy":
    case "cheer":
      return (
        <g>
          <path d="M90 146 Q100 168 110 146 Z" fill="#4a1d10" />
          <ellipse cx="100" cy="159" rx="6" ry="4" fill="#ff7a90" />
        </g>
      );
    case "wow":
      return <ellipse cx="100" cy="160" rx="6" ry="8" fill="#4a1d10" />;
    case "think":
      return <path d="M92 158 Q102 154 110 158" stroke={INK} strokeWidth="3.4" fill="none" strokeLinecap="round" />;
    case "support":
      return <path d="M91 158 Q100 164 109 158" stroke={INK} strokeWidth="3.4" fill="none" strokeLinecap="round" />;
    case "sleep":
      return <path d="M94 158 Q100 161 106 158" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />;
    default:
      return <path d="M90 157 Q100 165 110 157" stroke={INK} strokeWidth="3.4" fill="none" strokeLinecap="round" />;
  }
}

function Eyes({ mood }) {
  const brow = (dy = 0, tilt = 0) => (
    <g stroke="#6b3a10" strokeWidth="6" strokeLinecap="round" fill="none">
      <path d={`M60 ${88 + dy} Q76 ${80 + dy + tilt} 92 ${90 + dy}`} />
      <path d={`M140 ${88 + dy} Q124 ${80 + dy + tilt} 108 ${90 + dy}`} />
    </g>
  );
  if (mood === "sleep" || mood === "happy" || mood === "cheer") {
    const d = mood === "sleep" ? "M -11 0 Q 0 6 11 0" : "M -11 3 Q 0 -8 11 3";
    return (
      <g>
        {brow(mood === "sleep" ? 4 : -2)}
        <g stroke={INK} strokeWidth="4.5" fill="none" strokeLinecap="round">
          <path d={d} transform="translate(77 102)" />
          <path d={d} transform="translate(123 102)" />
        </g>
      </g>
    );
  }
  const look = mood === "think" ? { x: 3, y: -4 } : { x: 0, y: 0 };
  const big = mood === "wow" ? 1.12 : 1;
  return (
    <g>
      {brow(mood === "support" ? -4 : 0, mood === "support" ? -6 : 3)}
      <g className="bk-eyes">
        {[77, 123].map((cx) => (
          <g key={cx} transform={`translate(${cx} 102) scale(${big})`}>
            <ellipse rx="13" ry="14" fill="#fff" />
            <circle cx={look.x} cy={look.y + 1} r="9" fill="#f2a516" />
            <circle cx={look.x} cy={look.y + 1} r="5.6" fill={INK} />
            <circle cx={look.x + 3} cy={look.y - 3} r="3" fill="#fff" />
          </g>
        ))}
      </g>
    </g>
  );
}

// Қанат (сол жақ күйі; оң жағы айналдырылады)
const WING_DOWN = "M42 118 C14 130 8 176 24 202 C29 191 33 196 37 184 C41 193 47 190 50 178 C54 160 52 138 42 118Z";
const WING_UP = "M42 122 C10 112 4 74 22 52 C27 63 31 59 34 50 C39 61 45 59 48 52 C54 76 54 102 42 122Z";
const WING_FOLD = "M42 126 C22 148 34 180 66 172 C56 164 48 150 42 126Z";

export default function Qyran({ mood = "idle", size = 160, className = "", title = "Qyran" }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const P = `qyP${uid}`, W = `qyW${uid}`, G = `qyG${uid}`, F = `qyF${uid}`, H = `qyH${uid}`;
  const up = mood === "happy" || mood === "cheer";
  const left = up ? WING_UP : WING_DOWN;
  const right = up ? WING_UP : mood === "think" ? WING_FOLD : WING_DOWN;
  return (
    <svg className={`qyran bk-${mood} ${className}`} viewBox="0 0 200 230" width={size} height={(size * 230) / 200} role="img" aria-label={title}>
      <defs>
        <linearGradient id={P} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6c95f" />
          <stop offset=".55" stopColor="#dd8f2c" />
          <stop offset="1" stopColor="#a8601b" />
        </linearGradient>
        <linearGradient id={W} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b56a1f" />
          <stop offset="1" stopColor="#6e3d12" />
        </linearGradient>
        <linearGradient id={G} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd34d" />
          <stop offset="1" stopColor="#ec9a00" />
        </linearGradient>
        <radialGradient id={H} cx="50%" cy="35%" r="70%">
          <stop offset="0" stopColor="#ffdc85" />
          <stop offset="1" stopColor="#e9a23a" />
        </radialGradient>
        <radialGradient id={F} cx="50%" cy="40%" r="62%">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="1" stopColor="#ffe6b0" />
        </radialGradient>
      </defs>

      <ellipse className="bk-shadow" cx="100" cy="221" rx="46" ry="7" fill="#2a1708" opacity=".15" />

      <g className="bk-float">
        {/* Құйрық қауырсындары */}
        <path d="M80 194 L70 224 L90 214 L100 228 L110 214 L130 224 L120 194Z" fill={`url(#${W})`} />
        {/* Аяқтар */}
        <g fill="#f2a516" stroke="#b86d00" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M68 205 q11 5 22 0 l2 8 q-13 7 -26 0Z" />
          <path d="M110 205 q11 5 22 0 l2 8 q-13 7 -26 0Z" />
        </g>
        <g stroke="#b86d00" strokeWidth="1.6" strokeLinecap="round">
          <path d="M70 214 v6M79 215 v6M88 214 v6M112 214 v6M121 215 v6M130 214 v6" />
        </g>

        {/* Дене */}
        <path d="M100 38 C150 38 172 80 172 128 C172 176 142 206 100 206 C58 206 28 176 28 128 C28 80 50 38 100 38 Z" fill={`url(#${P})`} />
        <path d="M58 66 Q70 50 92 46" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity=".4" />

        {/* Кеуде */}
        <ellipse cx="100" cy="170" rx="40" ry="33" fill={`url(#${F})`} />
        <g stroke="#e3be78" strokeWidth="2.2" fill="none" strokeLinecap="round">
          <path d="M70 158 q7 9 15 0 q7 9 15 0 q7 9 15 0 q7 9 15 0" />
          <path d="M76 176 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 12 0" />
        </g>
        {/* Қошқар мүйіз өрнегі */}
        <g stroke={`url(#${G})`} strokeWidth="3.6" fill="none" strokeLinecap="round">
          <path d="M100 196 C100 186 93 181 88 184 C83 187 86 194 91 192" />
          <path d="M100 196 C100 186 107 181 112 184 C117 187 114 194 109 192" />
        </g>

        {/* Қанаттар */}
        <g className="bk-arm-l" style={{ transformOrigin: "42px 124px" }}>
          <path d={left} fill={`url(#${W})`} />
          <path d={up ? "M30 70 Q24 96 38 112" : "M30 140 Q22 168 30 190"} stroke="#e8a85a" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".7" />
        </g>
        <g className="bk-arm-r" style={{ transformOrigin: "158px 124px" }}>
          <g transform="translate(200 0) scale(-1 1)">
            <path d={right} fill={`url(#${W})`} />
            <path d={up ? "M30 70 Q24 96 38 112" : mood === "think" ? "M36 146 Q40 164 58 168" : "M30 140 Q22 168 30 190"} stroke="#e8a85a" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".7" />
          </g>
        </g>

        {/* Бет */}
        <ellipse cx="100" cy="104" rx="56" ry="46" fill={`url(#${H})`} />
        <ellipse cx="76" cy="103" rx="21" ry="18" fill={`url(#${F})`} opacity=".92" />
        <ellipse cx="124" cy="103" rx="21" ry="18" fill={`url(#${F})`} opacity=".92" />
        <ellipse cx="100" cy="146" rx="26" ry="14" fill={`url(#${F})`} opacity=".85" />
        {/* Төбедегі қауырсындар: артқа қарай сыпырылған */}
        <g fill={`url(#${W})`}>
          <path d="M96 46 C100 28 114 16 134 14 C124 24 116 34 112 50Z" />
          <path d="M84 48 C84 34 92 24 106 18 C100 28 98 38 100 50Z" />
          <path d="M74 54 C72 44 76 36 86 30 C84 38 86 46 92 52Z" />
        </g>
        {/* Маңдайдағы күн белгісі */}
        <g transform="translate(100 66)">
          <g stroke={`url(#${G})`} strokeWidth="2.2" strokeLinecap="round">
            {Array.from({ length: 8 }, (_, i) => (
              <path key={i} d="M0 -8 V-12" transform={`rotate(${i * 45})`} />
            ))}
          </g>
          <circle r="6" fill={`url(#${G})`} stroke="#c98a00" strokeWidth="1.2" />
        </g>

        <Eyes mood={mood} />
        <ellipse cx="58" cy="124" rx="9" ry="5.5" fill="#ff8fb0" opacity=".5" />
        <ellipse cx="142" cy="124" rx="9" ry="5.5" fill="#ff8fb0" opacity=".5" />

        <Mouth mood={mood} />
        {/* Тұмсық */}
        <path d="M83 117 C86 104 114 104 117 117 C118 134 112 148 101 157 C102 150 98 146 93 142 C86 135 83 127 83 117Z" fill={`url(#${G})`} stroke="#c97a00" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M100 124 C102 134 101 144 99 150" stroke="#c97a00" strokeWidth="1.6" strokeLinecap="round" opacity=".4" fill="none" />
        <ellipse cx="94" cy="118" rx="2.2" ry="3" fill="#8a4d00" opacity=".7" />
        <ellipse cx="106" cy="118" rx="2.2" ry="3" fill="#8a4d00" opacity=".7" />
      </g>

      {mood === "think" && (
        <g className="bk-fx">
          <circle cx="164" cy="58" r="5" fill="#fff" stroke="#e0b56a" strokeWidth="2" />
          <circle cx="176" cy="40" r="8" fill="#fff" stroke="#e0b56a" strokeWidth="2" />
          <text x="176" y="45" textAnchor="middle" fontSize="13" fontWeight="800" fill="#a8601b">?</text>
        </g>
      )}
      {(mood === "wow" || mood === "cheer") && (
        <g className="bk-fx bk-sparkle" fill={`url(#${G})`}>
          <path d="M26 40 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z" />
          <path d="M172 60 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" />
          <path d="M160 16 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" />
        </g>
      )}
      {mood === "sleep" && (
        <g className="bk-fx bk-zzz" fill="#a8601b" fontWeight="800">
          <text x="150" y="60" fontSize="18">z</text>
          <text x="164" y="42" fontSize="14">z</text>
          <text x="175" y="28" fontSize="11">z</text>
        </g>
      )}
    </svg>
  );
}
