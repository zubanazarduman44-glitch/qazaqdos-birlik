// Aqyl — «Qyzyl til» кейіпкері: жас алтын қыран (бүркіт), алдынан қарап, бұтақта отыр.
// Киіз-аппликация стилі: тегіс қабаттар, ою-өрнекті қызыл орамал (қошқар мүйіз), басында үкі.
// mood: idle | happy | think | wow | support | cheer | sleep
import { useId } from "react";
import { useSkin } from "../../lib/skin";
import { AnimalArt } from "./Animals";

// Палитра
const INK = "#2A1A10"; // қою қоңыр-қара (қас, қарашық)
const BODY = "#7C4522"; // дене
const BODY_D = "#5E3218"; // көлеңке қабат
const WING = "#6A3819"; // қанат
const WING_L = "#94582B"; // жамылғы қауырсын
const HEAD = "#C98A3A"; // бас
const NAPE = "#E8B14F"; // алтын желке
const BELLY = "#B97A41"; // кеуде
const BELLY_M = "#94592C"; // кеуде белгілері
const LEG = "#A8693A"; // жүнді аяқ
const CREAM = "#FFF4DE";
const RED = "#B8322A";
const RED_D = "#8A2018";
const GOLD = "#E0A526";
const BEAK = "#F2B53A";
const BEAK_D = "#C98414";
const TIP = "#3A3430";
const FOOT = "#E9A92C";
const MOUTH = "#8A2018";
const TONGUE = "#E46A5E";
const BLUSH = "#E8735E";

// Қошқар мүйіз: (0,0) ортасында, ені ~14.
const RAM = "M0 4.5 V0 C0 -4.5 -6.4 -5.4 -6.6 -1.4 C-6.7 1.2 -3.8 2 -3 -0.2 M0 0 C0 -4.5 6.4 -5.4 6.6 -1.4 C6.7 1.2 3.8 2 3 -0.2";

// Қанат: иық (0,0) нүктесінде, төмен салбырап тұрады (жергілікті -x — сыртқа қарай).
function Wing() {
  return (
    <g>
      <path d="M6 -8 C-14 -8 -26 14 -26 42 C-26 56 -22 68 -18 76 L-12 70 L-9 80 L-3 72 L1 80 L5 70 C11 48 16 18 6 -8Z" fill={WING} />
      {/* жамылғы қауырсындар */}
      <path d="M6 -8 C-14 -8 -24 10 -24 30 C-16 36 -2 36 10 28 C14 14 12 0 6 -8Z" fill={WING_L} />
      <path d="M-22 30 q5 6 11 0 q5 6 11 0 q4 5 8 0" fill="none" stroke={WING} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* жас бүркіттің ақ дағы */}
      <path d="M-24 48 C-16 51 -4 51 8 47 L7.4 52 C-4 56 -16 56 -24.4 53Z" fill="#D9BF91" />
    </g>
  );
}

// Көз: ақ алма + үлкен қоңыр қарашық + жылт.
function Eye({ cx, cy, mood, side, look, lid }) {
  if (mood === "sleep") {
    return <path d={`M${cx - 10} ${cy + 1} Q${cx} ${cy + 9} ${cx + 10} ${cy + 1}`} stroke={INK} strokeWidth="3.6" fill="none" strokeLinecap="round" />;
  }
  if (mood === "cheer") {
    return <path d={`M${cx - 10} ${cy + 4} Q${cx} ${cy - 9} ${cx + 10} ${cy + 4}`} stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />;
  }
  const big = mood === "wow";
  const rx = big ? 15 : 13.5, ry = big ? 17 : 15.5;
  const ir = big ? 7.4 : 9.4;
  const lx = cx + look.x, ly = cy + look.y;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" />
      <circle cx={lx} cy={ly} r={ir} fill="#5A3416" />
      <circle cx={lx} cy={ly} r={ir * 0.62} fill={INK} />
      <circle cx={lx + ir * 0.38} cy={ly - ir * 0.42} r={big ? 2.6 : 3.3} fill="#fff" />
      <circle cx={lx - ir * 0.4} cy={ly + ir * 0.42} r={1.4} fill="#fff" opacity=".8" />
      {/* жоғарғы қабақ (support, think) */}
      {lid > 0 && (
        <path d={`M${cx - rx - 1} ${cy - ry - 1} H${cx + rx + 1} V${cy - ry + lid} Q${cx} ${cy - ry + lid + (side < 0 ? 3 : 3)} ${cx - rx - 1} ${cy - ry + lid}Z`} fill={HEAD} />
      )}
      {/* күлімдеген төменгі қабақ (happy) */}
      {mood === "happy" && <path d={`M${cx - rx - 2} ${cy + ry + 2} V${cy + 7} Q${cx} ${cy - 1} ${cx + rx + 2} ${cy + 7} V${cy + ry + 2}Z`} fill={HEAD} />}
    </g>
  );
}

export default function Qyran({ mood = "idle", size = 160, className = "", title = "Aqyl", skin: skinProp }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cur = useSkin();
  const skin = skinProp || cur;
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

  // ── Қалып параметрлері ──
  const P = {
    idle: { l: 4, r: 4, look: { x: 0.5, y: 0.5 }, lid: 0, beak: "smile", blush: false },
    happy: { l: 4, r: 132, look: { x: 0, y: 0 }, lid: 0, beak: "open", blush: true },
    think: { l: -124, r: 4, look: { x: 4.4, y: -4.6 }, lid: 3, beak: "side", blush: false },
    wow: { l: 52, r: 52, look: { x: 0, y: 0 }, lid: 0, beak: "o", blush: false },
    support: { l: 4, r: -48, look: { x: 0, y: 1.6 }, lid: 4, beak: "smile", blush: true },
    cheer: { l: 140, r: 140, look: { x: 0, y: 0 }, lid: 0, beak: "open", blush: true },
    sleep: { l: 0, r: 0, look: { x: 0, y: 0 }, lid: 0, beak: "closed", blush: false },
  }[mood] || null;
  const p = P || { l: 4, r: 4, look: { x: 0, y: 0 }, lid: 0, beak: "smile", blush: false };
  const EL = { x: 80, y: 60 }, ER = { x: 120, y: 60 };

  // Қастар: қыранның «қабақ сүйегі» — көздің үстін сәл жабады. [ішкі y, сыртқы y] сол / оң көз үшін.
  const BR = {
    idle: [[45, 45.5], [45, 45.5]],
    happy: [[42, 40], [42, 40]],
    cheer: [[40, 38], [40, 38]],
    wow: [[33, 35], [33, 35]],
    think: [[48, 48], [39, 35]],
    support: [[40, 46], [40, 46]],
    sleep: [[49, 48], [49, 48]],
  }[mood] || [[49, 46], [49, 46]];
  const brow = (cx, side, [yi, yo]) => {
    const xi = cx - side * 12, xo = cx + side * 15;
    const my = (yi + yo) / 2;
    return `M${xi} ${yi + 2} Q${cx} ${my - 7} ${xo} ${yo} Q${cx} ${my - 2} ${xi} ${yi + 2}Z`;
  };

  const wing = (side, a, cls, k = 1) => {
    const x = side < 0 ? 63 : 137;
    const t = side < 0 ? `translate(${x} 120)` : `translate(${x} 120) scale(-1 1)`;
    return (
      <g transform={t}>
        <g className={cls} style={{ transformOrigin: "0px 0px" }}>
          <g transform={`rotate(${a})${k !== 1 ? ` scale(${k})` : ""}`}>
            <Wing />
          </g>
        </g>
      </g>
    );
  };

  const bodyClose = mood === "think" || mood === "support"; // бір қанат алдында

  return (
    <svg className={`qyran aq bk-${mood} ${className}`} viewBox="0 0 200 230" width={size} height={(size * 230) / 200} role="img" aria-label={title}>
      <ellipse className="bk-shadow" cx="100" cy="224" rx="60" ry="5" fill="#2A1A10" opacity=".16" />

      {/* Құйрық (жас бүркіт: ақ түп, қою ұш) */}
      <g>
        <path d="M84 196 L76 222 Q100 230 124 222 L116 196Z" fill={CREAM} />
        <path d="M78.4 214 Q100 220 121.6 214 L124 222 Q100 230 76 222Z" fill={WING} />
        <path d="M92 200 L90 222 M100 200 V225 M108 200 L110 222" stroke="#E5D3B0" strokeWidth="1.6" />
      </g>

      {/* Бұтақ */}
      <g>
        <path d="M18 206 C60 200 140 199 186 205 C189 208 189 213 185 215 C140 211 60 212 20 216 C15 214 14 209 18 206Z" fill="#6B4423" />
        <path d="M30 206 C70 202 130 201 176 205" stroke="#8C5E33" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M40 210 l9 -2 M150 210 l10 -1" stroke="#4E301A" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 208 C16 200 10 198 4 199 C8 205 14 208 24 208Z" fill="#2F6B4F" />
        <path d="M30 207 C26 196 28 190 32 186 C36 194 36 200 30 207Z" fill="#3E8A62" />
        <path d="M184 206 L194 200" stroke="#6B4423" strokeWidth="4" strokeLinecap="round" />
      </g>

      <g className="bk-float">
        <g className="an-body">
          {/* артқы қанат (алдында тұрмайтын) */}
          {!bodyClose && p.l > 20 && wing(-1, p.l, "bk-arm-l")}
          {!bodyClose && p.r > 20 && wing(1, p.r, "bk-arm-r")}
          {bodyClose && mood === "think" && wing(1, p.r, "bk-arm-r")}
          {bodyClose && mood === "support" && wing(-1, p.l, "bk-arm-l")}

          {/* Дене */}
          <path d="M100 86 C132 86 150 114 150 150 C150 184 128 206 100 206 C72 206 50 184 50 150 C50 114 68 86 100 86Z" fill={BODY} />
          <path d="M150 150 C150 184 128 206 100 206 C118 196 134 176 136 148 C138 124 132 104 122 92 C140 102 150 124 150 150Z" fill={BODY_D} opacity=".55" />
          {/* Кеуде: ақшылдау қабат + мойын астындағы қауырсын «төсеніш» */}
          <path d="M100 118 C120 118 132 138 132 160 C132 186 118 202 100 202 C82 202 68 186 68 160 C68 138 80 118 100 118Z" fill={BELLY_M} />
          <path d="M100 124 C116 124 126 141 126 160 C126 183 115 196 100 196 C85 196 74 183 74 160 C74 141 84 124 100 124Z" fill="none" stroke={CREAM} strokeWidth="1.1" strokeDasharray="3 3" opacity=".45" />
          <path d="M70 112 Q100 128 130 112 L130 134 L122 128 L115 140 L107 131 L100 144 L93 131 L85 140 L78 128 L70 134Z" fill={BELLY} />
          <path d="M84 150 q4 4 8 0 M108 150 q4 4 8 0 M96 164 q4 4 8 0" stroke={BODY} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          {/* Қауырсынды «шалбар» (бүркіттің аяғы жүнді) */}
          {[85, 115].map((x) => (
            <path key={x} d={`M${x - 13} 202 C${x - 14} 192 ${x - 7} 186 ${x} 187 C${x + 7} 186 ${x + 14} 192 ${x + 13} 202 L${x + 8} 206 L${x + 4} 201 L${x} 207 L${x - 4} 201 L${x - 8} 206Z`} fill={LEG} />
          ))}

          {/* Аяқ: алтын саусақтар, қою тырнақтар */}
          <g>
            {[86, 114].map((x) => (
              <g key={x}>
                <path d={`M${x - 10} 206 C${x - 10} 198 ${x + 10} 198 ${x + 10} 206 L${x + 9} 210 C${x + 4} 212 ${x - 4} 212 ${x - 9} 210Z`} fill={FOOT} />
                <path d={`M${x - 8} 209 q-1 5 2 7 M${x} 211 q0 5 2 6 M${x + 8} 209 q1 5 -1 7`} stroke={TIP} strokeWidth="2.6" fill="none" strokeLinecap="round" />
              </g>
            ))}
          </g>

          {/* Алдыңғы (тыныш) қанаттар */}
          {!bodyClose && p.l <= 20 && wing(-1, p.l, "bk-arm-l")}
          {!bodyClose && p.r <= 20 && wing(1, p.r, "bk-arm-r")}

          {/* Орамал: қызыл, алтын қошқар мүйіз өрнегі */}
          <g className="aq-scarf">
            <path d="M58 100 Q100 122 142 100 L145 113 Q100 138 55 113Z" fill={RED} />
            <path d="M57 107 Q100 130 143 107" stroke={RED_D} strokeWidth="1.2" fill="none" strokeDasharray="2.5 2.5" opacity=".7" />
            <g fill="none" stroke={GOLD} strokeWidth="1.7" strokeLinecap="round">
              <path d={RAM} transform="translate(72 112) rotate(14) scale(.85)" />
              <path d={RAM} transform="translate(100 120) scale(.9)" />
            </g>
            {/* түйін мен ұштары */}
            <path d="M124 114 L118 146 L127 141 L132 149 L134 114Z" fill={RED_D} />
            <path d="M128 113 L136 142 L141 134 L148 138 L138 110Z" fill={RED} />
            <path d="M131 140 l3 -4 M139 132 l3 -3" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="129" cy="112" r="7" fill={GOLD} />
            <circle cx="129" cy="112" r="4.6" fill={RED_D} />
            <path d={RAM} transform="translate(129 111.6) scale(.5)" fill="none" stroke={GOLD} strokeWidth="2.4" strokeLinecap="round" />
          </g>
        </g>

        <g className="an-head">
          {/* Үкі: қызыл-алтын түйреуіш пен қауырсын шоғы */}
          <g className="aq-uki" style={{ transformOrigin: "128px 30px" }}>
            <path d="M128 30 C124 18 116 10 106 8 C114 14 120 22 124 32Z" fill={RED} />
            <path d="M128 30 C130 16 138 6 148 4 C142 12 136 22 132 32Z" fill={RED} />
            <path d="M128 31 C126 18 128 8 134 0 C136 10 134 22 131 32Z" fill={GOLD} />
            <path d="M131.5 4 C131 12 130.5 20 129.5 29" stroke="#B9801A" strokeWidth="1" fill="none" />
          </g>
          {/* Желке қауырсындары (алтын «жал») */}
          <path d="M52 76 L34 90 L50 92 L40 106 L60 100 L58 112 L74 100Z" fill={NAPE} />
          <path d="M148 76 L166 90 L150 92 L160 106 L140 100 L142 112 L126 100Z" fill={NAPE} />
          {/* Бас */}
          <path d="M100 20 C136 20 156 40 156 64 C156 90 136 108 100 108 C64 108 44 90 44 64 C44 40 64 20 100 20Z" fill={HEAD} />
          {/* алтын төбе */}
          <path d="M50 54 C56 30 78 20 100 20 C122 20 144 30 150 54 C138 42 120 36 100 36 C80 36 62 42 50 54Z" fill={NAPE} />
          <path d="M72 30 L66 22 L80 25Z M88 24 L86 15 L96 21Z" fill={NAPE} />
          {/* үкі түйреуіші */}
          <g>
            <circle cx="128" cy="31" r="6" fill={GOLD} />
            <circle cx="128" cy="31" r="3.4" fill={RED} />
          </g>

          {/* Көздер */}
          <g className="bk-eyes" style={{ transformOrigin: "100px 60px" }}>
            <Eye cx={EL.x} cy={EL.y} side={-1} mood={mood} look={p.look} lid={p.lid} />
            <Eye cx={ER.x} cy={ER.y} side={1} mood={mood} look={p.look} lid={p.lid} />
          </g>

          {/* Қас (қабақ сүйегі) — көздің үстіне түседі */}
          <path d={brow(EL.x, -1, BR[0])} fill={INK} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
          <path d={brow(ER.x, 1, BR[1])} fill={INK} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />

          {p.blush && (
            <g fill={BLUSH} opacity=".55">
              <ellipse cx="63" cy="82" rx="7" ry="4" />
              <ellipse cx="137" cy="82" rx="7" ry="4" />
            </g>
          )}

          {/* Тұмсық: алтын ілгек, қою ұшы */}
          <g className="aq-beak">
            {p.beak === "open" && (
              <g>
                <path d="M77 80 Q100 92 123 80 Q121 104 100 111 Q79 104 77 80Z" fill={MOUTH} />
                <path d="M87 103 Q100 96 113 103 Q107 110 100 111 Q93 110 87 103Z" fill={TONGUE} />
                <path d="M80 94 Q100 120 120 94 Q118 104 100 113 Q82 104 80 94Z" fill={BEAK_D} />
              </g>
            )}
            {p.beak === "o" && (
              <g>
                <ellipse cx="100" cy="102" rx="10" ry="11" fill={MOUTH} />
                <ellipse cx="100" cy="108" rx="6" ry="3.6" fill={TONGUE} />
                <path d="M89 106 Q100 120 111 106 Q110 114 100 115 Q90 114 89 106Z" fill={BEAK_D} />
              </g>
            )}
            {p.beak === "smile" && <path d="M73 79 Q100 104 127 79" stroke={BEAK_D} strokeWidth="3.2" fill="none" strokeLinecap="round" />}
            {p.beak === "closed" && <path d="M80 84 Q100 98 120 84" stroke={BEAK_D} strokeWidth="3" fill="none" strokeLinecap="round" />}
            {p.beak === "side" && <path d="M78 88 Q92 96 124 82" stroke={BEAK_D} strokeWidth="3" fill="none" strokeLinecap="round" />}
            {/* жоғарғы ілгек */}
            <path d="M84 70 C84 62 116 62 116 70 C118 84 110 98 100 106 C90 98 82 84 84 70Z" fill={BEAK} />
            <path d="M93 96 Q100 100 107 96 C105 100 103 103 100 106 C97 103 95 100 93 96Z" fill={TIP} />
            <path d="M85 71 C90 64.5 110 64.5 115 71 C110 68.6 90 68.6 85 71Z" fill={BEAK_D} />
            <path d="M93 74 q1.2 -1.8 2.8 0 M104.2 74 q1.6 -1.8 2.8 0" stroke={BEAK_D} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M89 75 C89 82 93 90 97 96" stroke="#FFDA80" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity=".75" />
          </g>
        </g>
        {/* денені қиып өтетін қанат: think — иекте, support — жүрек тұсында */}
        {mood === "think" && wing(-1, p.l, "bk-arm-l aq-chin", 0.56)}
        {mood === "support" && wing(1, p.r, "bk-arm-r aq-heart", 0.9)}
      </g>

      {/* Эффекттер */}
      {mood === "think" && (
        <g className="bk-fx aq-dots">
          <circle cx="152" cy="34" r="3.6" fill="#fff" stroke={GOLD} strokeWidth="1.8" />
          <circle cx="163" cy="22" r="5.4" fill="#fff" stroke={GOLD} strokeWidth="1.8" />
          <circle cx="180" cy="8" r="11" fill="#fff" stroke={GOLD} strokeWidth="2" />
          <path d="M176 5 C176 0 184 0 184 5 C184 8.5 180 8.5 180 12" stroke={RED} strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <circle cx="180" cy="15.6" r="1.7" fill={RED} />
        </g>
      )}
      {(mood === "wow" || mood === "cheer") && (
        <g className="bk-fx bk-sparkle" fill={GOLD}>
          <path d="M22 62 l3.6 9 9 3.6 -9 3.6 -3.6 9 -3.6 -9 -9 -3.6 9 -3.6z" />
          <path d="M176 30 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" />
          <path d="M164 4 l2.2 5.4 5.4 2.2 -5.4 2.2 -2.2 5.4 -2.2 -5.4 -5.4 -2.2 5.4 -2.2z" fill={RED} />
        </g>
      )}
      {mood === "cheer" && (
        <g className="bk-fx aq-confetti">
          <path d="M33 22 L38.5 19.5 L40 22.6 L34.4 25.2Z" fill={RED} />
          <path d="M152 57 L157.4 60 L155.7 63 L150.3 60Z" fill="#0F5E7A" />
          <circle cx="46" cy="40" r="2.4" fill="#0F5E7A" />
          <circle cx="160" cy="76" r="2.2" fill={RED} />
        </g>
      )}
      {mood === "sleep" && (
        <g className="bk-fx bk-zzz" fill="none" stroke="#D0901C" strokeLinecap="round" strokeLinejoin="round">
          <path d="M146 30 h10 l-10 11 h10" strokeWidth="3" />
          <path d="M162 14 h8 l-8 9 h8" strokeWidth="2.6" />
          <path d="M175 2 h6 l-6 6.5 h6" strokeWidth="2.2" />
        </g>
      )}
    </svg>
  );
}
