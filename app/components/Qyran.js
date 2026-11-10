// Aqyl — TILIM кейіпкері: алтын қыран (бүркіт), бүйірден қараған, бұтақта отыр.
// mood: idle | happy | think | wow | support | cheer | sleep
import { useId } from "react";
import { useSkin } from "../../lib/skin";
import { AnimalArt } from "./Animals";

const INK = "#2a1708";
const WING_DOWN = "M96 92 C126 100 134 140 114 176 C104 194 86 204 64 207 C73 188 70 160 72 134 C74 112 84 96 96 92Z";
const WING_UP = "M98 100 C70 90 40 64 24 26 C42 34 50 30 58 18 C64 34 76 34 84 28 C90 52 98 76 102 100Z";

function Eye({ mood }) {
  const cx = 132, cy = 56;
  if (mood === "sleep") return <path d={`M${cx - 9} ${cy + 1} Q${cx} ${cy + 8} ${cx + 9} ${cy + 1}`} stroke={INK} strokeWidth="3.6" fill="none" strokeLinecap="round" />;
  if (mood === "happy" || mood === "cheer") return <path d={`M${cx - 9} ${cy + 3} Q${cx} ${cy - 8} ${cx + 9} ${cy + 3}`} stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />;
  const look = mood === "think" ? { x: -2, y: -3 } : { x: 1, y: 0 };
  const s = mood === "wow" ? 1.15 : 1;
  return (
    <g className="bk-eyes" style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <g transform={`translate(${cx} ${cy}) scale(${s})`}>
        <circle r="11" fill="#fff6d6" stroke="#e0a21a" strokeWidth="1.6" />
        <circle cx={look.x} cy={look.y} r="8" fill="#f0a000" />
        <circle cx={look.x} cy={look.y} r="4.8" fill={INK} />
        <circle cx={look.x + 2.6} cy={look.y - 3} r="2.4" fill="#fff" />
      </g>
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
  const browY = mood === "support" ? 3 : mood === "wow" ? -4 : 0;
  return (
    <svg className={`qyran bk-${mood} ${className}`} viewBox="0 0 200 230" width={size} height={(size * 230) / 200} role="img" aria-label={title}>
      <defs>
        <linearGradient id={B} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9a6026" />
          <stop offset="1" stopColor="#5b3211" />
        </linearGradient>
        <linearGradient id={W} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7b4619" />
          <stop offset="1" stopColor="#3f220a" />
        </linearGradient>
        <linearGradient id={G} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd84f" />
          <stop offset="1" stopColor="#e88f00" />
        </linearGradient>
        <radialGradient id={H} cx="45%" cy="35%" r="75%">
          <stop offset="0" stopColor="#ffd778" />
          <stop offset="1" stopColor="#d98b25" />
        </radialGradient>
        <linearGradient id={C} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9a8" />
          <stop offset="1" stopColor="#e9b25a" />
        </linearGradient>
      </defs>

      <ellipse className="bk-shadow" cx="100" cy="224" rx="62" ry="6" fill="#2a1708" opacity=".16" />
      {/* Бұтақ */}
      <path d="M22 208 Q100 198 184 210 L184 219 Q100 211 22 220Z" fill="#6b4220" />
      <path d="M40 209 l6 -5 M150 207 l7 -5" stroke="#8a5a2e" strokeWidth="3" strokeLinecap="round" />

      <g className="bk-float">
        {/* Құйрық */}
        <path d="M66 168 L30 212 L48 217 L56 206 L68 219 L86 192Z" fill={`url(#${W})`} />
        <path d="M48 196 l12 -6 M42 206 l16 -8" stroke="#e8c48a" strokeWidth="2.4" strokeLinecap="round" opacity=".6" />

        {/* Дене */}
        <path d="M112 78 C148 86 158 126 142 162 C132 186 108 201 84 197 C62 191 53 160 61 130 C69 100 90 76 112 78Z" fill={`url(#${B})`} />
        {/* Кеуде */}
        <path d="M124 98 C148 122 142 164 118 190 C106 172 108 130 124 98Z" fill={`url(#${C})`} />
        <g stroke="#c9953f" strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M118 118 q7 8 14 0 M114 134 q8 8 16 0 M112 150 q8 8 16 0 M112 166 q8 8 14 0" />
        </g>
        {/* Қошқар мүйіз өрнегі кеудеде */}
        <g stroke={`url(#${G})`} strokeWidth="3" fill="none" strokeLinecap="round" transform="translate(0 2)">
          <path d="M123 182 C123 174 117 171 113 174 C110 177 112 182 116 181" />
        </g>

        {/* Аяқ */}
        <path d="M88 188 q12 14 26 2 v14 h-26z" fill={`url(#${C})`} stroke="#c9953f" strokeWidth="1.5" />
        <g stroke="#e89a00" strokeWidth="4.2" strokeLinecap="round" fill="none">
          <path d="M92 206 q-8 3 -8 11 M100 207 q0 8 -3 13 M108 206 q6 4 8 11" />
        </g>

        {/* Мойын қауырсындары */}
        <path d="M94 76 L80 90 L96 90 L88 106 L106 94 L108 112 L120 96 L134 104 L132 80Z" fill={`url(#${H})`} />

        {/* Қанат */}
        <g className="bk-arm-r" style={{ transformOrigin: "98px 98px" }}>
          <path d={up ? WING_UP : WING_DOWN} fill={`url(#${W})`} />
          {up ? (
            <path d="M44 40 Q60 62 90 92 M58 24 Q72 52 96 88" stroke="#e8b46a" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".6" />
          ) : (
            <g stroke="#e8b46a" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".6">
              <path d="M100 112 C112 134 108 164 92 190" />
              <path d="M88 122 C94 142 90 168 76 192" />
              <path d="M80 140 C82 160 78 180 70 198" />
            </g>
          )}
          {!up && <path d="M64 207 L56 216 L72 211 L68 220 L86 209Z" fill="#3f220a" />}
        </g>

        {/* Бас */}
        <path d="M96 48 C100 32 112 26 126 28 C116 34 110 42 109 54Z" fill={`url(#${H})`} />
        <circle cx="118" cy="62" r="31" fill={`url(#${H})`} />
        <path d="M100 56 C104 48 112 44 120 44" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity=".35" />
        {/* Қас */}
        <path d={`M120 ${46 + browY} C128 ${40 + browY} 142 ${42 + browY} 149 ${52 + (mood === "support" ? -3 : 0)}`} stroke="#5a3417" strokeWidth="5.4" strokeLinecap="round" fill="none" />
        <Eye mood={mood} />
        <ellipse cx="127" cy="74" rx="8" ry="4.6" fill="#ff8fb0" opacity=".5" />

        {/* Тұмсық: ілгек пішінді */}
        <g transform="translate(142 62) scale(.8) translate(-142 -62)">
        <path d="M142 49 C164 44 186 57 184 84 C181 75 172 69 160 69 L142 67Z" fill={`url(#${G})`} stroke="#c97a00" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M184 84 C185 76 181 66 175 61" stroke="#6b3a00" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".8" />
        {open ? (
          <g>
            <path d="M146 70 C158 72 170 74 174 80 C166 90 152 90 146 80Z" fill="#4a1d10" />
            <ellipse cx="158" cy="83" rx="6" ry="3.4" fill="#ff7a90" />
            <path d="M146 72 C157 74 166 77 172 82 C166 94 152 92 146 84Z" fill={`url(#${G})`} stroke="#c97a00" strokeWidth="1.4" strokeLinejoin="round" transform="translate(0 4)" />
          </g>
        ) : (
          <path d="M146 68 C157 70 168 72 172 77 C166 83 152 81 146 76Z" fill={`url(#${G})`} stroke="#c97a00" strokeWidth="1.4" strokeLinejoin="round" />
        )}
        <ellipse cx="148" cy="58" rx="6" ry="4.6" fill="#ffe36b" stroke="#c97a00" strokeWidth="1" />
        <ellipse cx="156" cy="57" rx="1.6" ry="2.2" fill="#6b3a00" />
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
