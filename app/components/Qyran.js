// Aqyl — TILIM кейіпкері: алтын қыран (бүркіт), бүйірден қараған, бұтақта отыр.
// mood: idle | happy | think | wow | support | cheer | sleep
import { useId } from "react";
import { useSkin } from "../../lib/skin";
import { AnimalArt } from "./Animals";

const INK = "#2a1708";
const WING_UP = "M98 104 C74 96 46 80 20 42 C32 46 38 42 42 34 C48 46 54 44 58 36 C62 50 70 50 74 42 C76 58 84 62 90 58 C92 74 96 86 100 100Z";

// Жыртқыш құстың шынайы көзі: алтын-құрыш қарашық, ауыр қас.
function Eye({ mood }) {
  const cx = 134, cy = 48;
  if (mood === "sleep") return <path d={`M${cx - 8} ${cy} Q${cx} ${cy + 6} ${cx + 8} ${cy - 1}`} stroke="#2a1708" strokeWidth="3" fill="none" strokeLinecap="round" />;
  if (mood === "happy" || mood === "cheer") return <path d={`M${cx - 8} ${cy + 3} Q${cx} ${cy - 7} ${cx + 8} ${cy + 2}`} stroke="#2a1708" strokeWidth="3.4" fill="none" strokeLinecap="round" />;
  const look = mood === "think" ? { x: -2, y: -2.4 } : { x: 1, y: 0.4 };
  const r = mood === "wow" ? 9.4 : 8;
  return (
    <g className="bk-eyes" style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <ellipse cx={cx} cy={cy} rx={r + 1.6} ry={r + 1} fill="#2a1708" />
      <circle cx={cx} cy={cy} r={r} fill="#e9a21c" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#a85f06" strokeWidth="1.6" />
      <circle cx={cx + look.x} cy={cy + look.y} r={r * 0.52} fill="#0d0805" />
      <circle cx={cx + look.x + 2.4} cy={cy + look.y - 2.6} r="2.2" fill="#fff" />
      <circle cx={cx + look.x - 2.2} cy={cy + look.y + 2.6} r="1" fill="#fff" opacity=".6" />
    </g>
  );
}

export default function Qyran({ mood = "idle", size = 160, className = "", title = "Aqyl", skin: skinProp }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cur = useSkin();
  const skin = skinProp || cur;
  const B = `qyB${uid}`, W = `qyW${uid}`, G = `qyG${uid}`, H = `qyH${uid}`, C = `qyC${uid}`;
  if (skin !== "eagle") {
    return (
      <svg className={`qyran bk-${mood} ${className}`} viewBox="0 0 200 230" width={size} height={(size * 230) / 200} role="img" aria-label={title}>
        <ellipse className="bk-shadow" cx="100" cy="226" rx="56" ry="5" fill="#2a1708" opacity=".16" />
        <g className="bk-float">
          <AnimalArt id={skin} mood={mood} uid={uid} />
        </g>
        {mood === "think" && (
          <g className="bk-fx">
            <circle cx="170" cy="30" r="4.5" fill="#fff" stroke="#e0b56a" strokeWidth="2" />
            <circle cx="180" cy="14" r="9" fill="#fff" stroke="#e0b56a" strokeWidth="2" />
            <text x="180" y="19" textAnchor="middle" fontSize="13" fontWeight="800" fill="#a8601b">?</text>
          </g>
        )}
        {(mood === "wow" || mood === "cheer") && (
          <g className="bk-fx bk-sparkle" fill="#ffc83d">
            <path d="M24 70 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z" />
            <path d="M172 24 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" />
          </g>
        )}
        {mood === "sleep" && (
          <g className="bk-fx bk-zzz" fill="#a8601b" fontWeight="800">
            <text x="150" y="36" fontSize="18">z</text><text x="164" y="20" fontSize="14">z</text>
          </g>
        )}
      </svg>
    );
  }
  const up = mood === "happy" || mood === "cheer";
  const open = mood === "happy" || mood === "cheer" || mood === "wow";
  const browY = mood === "support" ? 3 : mood === "wow" ? -3 : 0;
  const hk = (x, y, r, l = 16) => `M${x} ${y} l${(Math.cos(r) * l).toFixed(1)} ${(Math.sin(r) * l).toFixed(1)}`;
  return (
    <svg className={`qyran bk-${mood} ${className}`} viewBox="0 0 200 230" width={size} height={(size * 230) / 200} role="img" aria-label={title}>
      <defs>
        <linearGradient id={B} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a5326" />
          <stop offset=".6" stopColor="#5a3314" />
          <stop offset="1" stopColor="#35200c" />
        </linearGradient>
        <linearGradient id={W} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6b4019" />
          <stop offset="1" stopColor="#2c1a09" />
        </linearGradient>
        <linearGradient id={G} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f3c43a" />
          <stop offset=".35" stopColor="#d9a21c" />
          <stop offset=".6" stopColor="#4a4540" />
          <stop offset="1" stopColor="#1c1a18" />
        </linearGradient>
        <radialGradient id={H} cx="40%" cy="30%" r="80%">
          <stop offset="0" stopColor="#e8b24c" />
          <stop offset=".6" stopColor="#b9792a" />
          <stop offset="1" stopColor="#7a4a18" />
        </radialGradient>
        <linearGradient id={C} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c99a55" />
          <stop offset="1" stopColor="#8b5a28" />
        </linearGradient>
      </defs>

      <ellipse className="bk-shadow" cx="100" cy="224" rx="62" ry="6" fill="#2a1708" opacity=".18" />
      {/* Бұтақ */}
      <path d="M14 208 Q100 197 190 208 L190 220 Q100 211 14 221Z" fill="#5a3a1c" />
      <path d="M14 208 Q100 197 190 208" stroke="#8a6234" strokeWidth="2" fill="none" />
      <path d="M40 212 l8 -3 M120 210 l9 -3 M160 212 l8 -2" stroke="#3a2410" strokeWidth="2" strokeLinecap="round" />

      <g className="bk-float">
        <g className="an-body">
        {/* Құйрық: қабаттасқан қауырсындар, ақшыл жолақтармен */}
        <g>
          {[[-62, 0], [-50, 0], [-38, 0], [-26, 0], [-14, 0]].map(([r], i) => (
            <path key={i} d="M74 168 L66 214 Q72 222 80 214 L86 170Z" fill={`url(#${W})`} stroke="#1f1206" strokeWidth="1" transform={`rotate(${r} 80 160)`} />
          ))}
          <path d="M58 200 h22 M60 192 h22" stroke="#d8b684" strokeWidth="2.4" opacity=".55" transform="rotate(-20 80 160)" />
          <path d="M70 206 h18" stroke="#d8b684" strokeWidth="2.2" opacity=".5" />
        </g>

        {/* Дене */}
        <path d="M106 76 C142 82 160 120 152 164 C146 190 124 206 98 206 C70 206 54 178 58 144 C62 112 78 80 106 76Z" fill={`url(#${B})`} />
        {/* Кеуде қауырсындары (қабатты ұсақ қабыршақ) */}
        <path d="M126 92 C152 118 148 168 120 198 C102 176 108 128 126 92Z" fill={`url(#${C})`} />
        <g fill="none" stroke="#5a3314" strokeWidth="1.6" strokeLinecap="round" opacity=".75">
          {[104, 116, 128, 140, 152, 164, 176].map((y, i) => (
            <path key={y} d={`M${116 + (i % 2) * 5} ${y} q6 7 12 0 q6 7 12 0 M${112 + (i % 2) * 5} ${y + 6} q6 7 12 0 q6 7 11 0`} />
          ))}
        </g>
        {/* Бұтталы «шалбар» қауырсындар */}
        <path d="M82 178 C80 198 92 212 106 208 C120 204 124 188 120 174 C110 182 94 184 82 178Z" fill={`url(#${C})`} stroke="#5a3314" strokeWidth="1.2" />
        <g stroke="#5a3314" strokeWidth="1.4" strokeLinecap="round" opacity=".6" fill="none"><path d="M88 188 l3 12 M97 186 l2 14 M106 186 l1 14 M114 184 l-1 14" /></g>

        {/* Аяқ пен тырнақ */}
        <g stroke="#d9a21c" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M92 207 q-1 5 0 8 M110 207 q0 5 1 8" />
          <path d="M84 211 q8 5 20 1 M104 212 q8 4 18 0" strokeWidth="4.4" />
        </g>
        <g stroke="#1c1a18" strokeWidth="3" strokeLinecap="round" fill="none"><path d="M82 211 q-3 4 -2 9 M122 212 q3 3 2 8 M99 214 q-1 4 0 7 M112 214 q1 4 3 6" /></g>

        {/* Қанат: қабат-қабат қауырсын (жамылғы, екінші, негізгі) */}
        <g className="bk-arm-r" style={{ transformOrigin: "98px 98px" }}>
          {up ? (
            <g>
              <path d={WING_UP} fill={`url(#${W})`} stroke="#1f1206" strokeWidth="1.2" strokeLinejoin="round" />
              <g stroke="#c9953f" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".6">
                <path d="M44 38 Q62 66 92 94 M58 40 Q72 62 94 90 M74 46 Q82 66 96 90" />
              </g>
              <path d="M96 100 C84 84 62 66 40 52 C60 80 76 96 98 108Z" fill="#8a5326" opacity=".8" />
            </g>
          ) : (
            <g>
              {/* негізгі қауырсындар (ұзын, қуыс шетті) */}
              <path d="M98 96 C128 104 136 150 120 188 C110 208 90 218 60 224 C70 206 66 170 70 140 C74 112 84 98 98 96Z" fill={`url(#${W})`} stroke="#1f1206" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M60 224 L52 222 M66 216 L56 218 M74 204 L64 206" stroke="#1f1206" strokeWidth="2.2" strokeLinecap="round" />
              {/* жамылғы қауырсындар, қабыршақ */}
              <g fill="#7a4a1f" stroke="#2c1a09" strokeWidth="1">
                {[[102, 110], [114, 118], [90, 118], [104, 126], [116, 134], [92, 134], [105, 142], [117, 150], [93, 150], [106, 158], [96, 166], [108, 172]].map(([x, y], i) => (
                  <path key={i} d={`M${x - 8} ${y} q8 -9 16 0 q0 9 -8 12 q-8 -3 -8 -12Z`} />
                ))}
              </g>
              <g stroke="#d8b684" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".45">
                <path d="M104 174 C108 190 98 206 76 218 M92 168 C94 184 84 200 66 214" />
              </g>
            </g>
          )}
        </g>
        </g>

        <g className="an-head">
        {/* Мойын: алтын «жал» қауырсындар */}
        <path d="M92 70 C92 54 100 44 112 42 C124 50 138 58 140 78 C130 90 108 92 92 70Z" fill={`url(#${H})`} />
        <g stroke="#a86b1c" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".85">
          <path d="M96 66 l-9 6 M100 76 l-8 8 M108 82 l-5 10 M118 86 l-2 11 M128 84 l3 10 M96 56 l-9 3 M100 48 l-8 0" />
        </g>
        <g fill="#e6b04a" stroke="#a86b1c" strokeWidth="1">
          {[[94, 64, 200], [98, 74, 215], [106, 82, 240], [116, 86, 255], [126, 85, 275]].map(([x, y, a], i) => (
            <path key={i} d="M0 0 C-3 4 -3 10 0 15 C3 10 3 4 0 0Z" transform={`translate(${x} ${y}) rotate(${a})`} />
          ))}
        </g>
        {/* Бас */}
        <path d="M100 58 C98 38 112 24 130 26 C144 28 152 38 154 50 L152 62 C148 76 134 84 118 84 C106 82 101 72 100 58Z" fill={`url(#${H})`} />
        <path d="M108 40 C114 32 124 28 134 30" stroke="#f5d68a" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".55" />
        <g stroke="#a86b1c" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".7"><path d="M110 50 l6 4 M106 60 l8 3 M116 44 l5 5 M112 70 l7 2" /></g>
        {/* Ауыр қас сүйегі */}
        <path d={`M120 ${44 + browY} C130 ${36 + browY} 144 ${38 + browY} 152 ${48 + (mood === "support" ? -3 : 0)} L150 ${51 + browY} C142 ${45 + browY} 132 ${44 + browY} 124 ${49 + browY}Z`} fill="#3a200a" />
        <Eye mood={mood} />
        {/* Тұмсық: жоғарғы ілгек */}
        <g transform="translate(146 52) scale(.82 .78) translate(-146 -52)">
        <path d="M146 40 C168 36 186 50 184 76 C183 86 176 92 170 86 C174 76 168 68 156 66 L146 64Z" fill={`url(#${G})`} stroke="#1c1a18" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M146 40 C152 40 158 42 160 48 L156 66 L146 64Z" fill="#f2c13a" stroke="#c78b00" strokeWidth="1" strokeLinejoin="round" />
        <ellipse cx="153" cy="49" rx="2.1" ry="3" fill="#3a2a00" transform="rotate(-12 153 49)" />
        <path d="M150 64 C160 66 170 70 176 78" stroke="#0f0d0b" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        {open ? (
          <g>
            <path d="M152 66 C162 68 170 72 174 78 C168 92 156 92 150 80Z" fill="#6a1f16" />
            <ellipse cx="160" cy="82" rx="6" ry="3" fill="#e0576a" />
            <path d="M150 74 C160 78 168 82 172 88 C164 98 152 96 148 84Z" fill="#2c2a28" stroke="#1c1a18" strokeWidth="1.2" />
          </g>
        ) : (
          <path d="M150 66 C160 68 170 72 174 79 C166 84 154 82 148 74Z" fill="#2c2a28" stroke="#1c1a18" strokeWidth="1.2" strokeLinejoin="round" />
        )}
        </g>
        </g>
      </g>

      {mood === "think" && (
        <g className="bk-fx">
          <circle cx="166" cy="30" r="4.5" fill="#fff" stroke="#e0b56a" strokeWidth="2" />
          <circle cx="178" cy="14" r="9" fill="#fff" stroke="#e0b56a" strokeWidth="2" />
          <text x="178" y="19" textAnchor="middle" fontSize="13" fontWeight="800" fill="#a8601b">?</text>
        </g>
      )}
      {(mood === "wow" || mood === "cheer") && (
        <g className="bk-fx bk-sparkle" fill={`url(#${G})`}>
          <path d="M24 70 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z" />
          <path d="M170 24 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" />
          <path d="M150 10 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" />
        </g>
      )}
      {mood === "sleep" && (
        <g className="bk-fx bk-zzz" fill="#a8601b" fontWeight="800">
          <text x="150" y="36" fontSize="18">z</text>
          <text x="164" y="20" fontSize="14">z</text>
          <text x="176" y="8" fontSize="11">z</text>
        </g>
      )}
    </svg>
  );
}
