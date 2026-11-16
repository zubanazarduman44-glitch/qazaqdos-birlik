// «Шежіре» (профиль) бетінің суреттері: тұмар-таңба (аватар ішінде), бәйтерек (прогресс ағашы), мөр.
// Жалпақ «киіз аппликация» стилі: қою жиек, үзік тігіс, қошқар мүйіз өрнегі.
import Avatar from "./Avatar";
import Icon from "./Icon";

const RED = "#b8322a", DEEP = "#8a2018", GOLD = "#e0a526", GOLD2 = "#f6d27a", CREAM = "#fff7e6", INK = "#3a2210", OK = "#2f6b4f", OK2 = "#4f8f6c", BARK = "#6b4426";

const Horn = ({ x, y, s = 1, c = GOLD, w = 3 }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 0 c4 -10 15 -9 13 0 c-2 7 -11 5 -8 -1 M0 0 c-4 -10 -15 -9 -13 0 c2 7 11 5 8 -1" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" />
);

/* ───────── Тұмар: үшбұрыш бойтұмар, ортасында аватар ───────── */
export function ProfileTumar({ avatar, className = "" }) {
  const drop = (x, y, k) => (
    <g key={k} className="pf-drop" style={{ "--k": k }}>
      <path d={`M${x} ${y} v14`} stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <circle cx={x} cy={y + 18} r="4" fill={GOLD2} stroke={INK} strokeWidth="2" />
      <path d={`M${x} ${y + 22} l6 12 -6 8 -6 -8z`} fill={GOLD} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    </g>
  );
  return (
    <svg className={`pf-tumar ${className}`} viewBox="0 -18 240 288" aria-hidden="true" focusable="false">
      {/* бау */}
      <path d="M44 20 C70 -22 170 -22 196 20" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M44 20 C70 -22 170 -22 196 20" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeDasharray="5 5" />
      {/* салпыншақтар */}
      {drop(62, 128, 0)}{drop(120, 226, 1)}{drop(178, 128, 2)}
      {/* үшбұрыш киіз */}
      <path d="M20 42 H220 Q230 42 225 51 L127 222 Q120 233 113 222 L15 51 Q10 42 20 42Z" fill={DEEP} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M32 50 H208 Q214 50 211 55 L124 206 Q120 213 116 206 L29 55 Q26 50 32 50Z" fill={RED} />
      <path d="M40 57 H200 L120 196Z" fill="none" stroke="#f3c7b8" strokeWidth="1.8" strokeDasharray="3 5" strokeLinecap="round" opacity=".9" />
      <Horn x={120} y={186} s={0.9} c={GOLD} w={3.2} />
      <circle cx="46" cy="64" r="3.4" fill={GOLD} /><circle cx="194" cy="64" r="3.4" fill={GOLD} />
      {/* түтік */}
      <rect x="26" y="14" width="188" height="30" rx="15" fill={GOLD} stroke={INK} strokeWidth="3" />
      <path d="M40 29 H200" stroke={CREAM} strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
      <g fill={DEEP} stroke={INK} strokeWidth="1.6">
        <path d="M70 21 l8 8 -8 8 -8 -8z" /><path d="M120 21 l8 8 -8 8 -8 -8z" /><path d="M170 21 l8 8 -8 8 -8 -8z" />
      </g>
      {/* аватар */}
      <circle cx="120" cy="104" r="55" fill={CREAM} stroke={INK} strokeWidth="3" />
      <g transform="translate(70 54)"><Avatar value={avatar} size={100} /></g>
    </svg>
  );
}

/* ───────── CEFR мөрі ───────── */
export function ProfileSeal({ code, empty = false, className = "" }) {
  const c = empty ? "#6b5a3a" : DEEP;
  return (
    <svg className={`pf-seal-art ${empty ? "is-empty" : ""} ${className}`} viewBox="0 0 96 96" aria-hidden="true" focusable="false">
      <circle cx="48" cy="48" r="44" fill="none" stroke={c} strokeWidth="3" strokeDasharray={empty ? "4 6" : undefined} />
      <circle cx="48" cy="48" r="37" fill="none" stroke={c} strokeWidth="1.5" strokeDasharray="2 4" />
      {!empty && (
        <g fill={c}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} transform={`rotate(${i * 45} 48 48)`} d="M48 6.5 l2.6 3.5 -2.6 3.5 -2.6 -3.5z" />)}
        </g>
      )}
      <text x="48" y={empty ? 60 : 58} textAnchor="middle" fontFamily="var(--head)" fontWeight="800" fontSize={empty ? 34 : 28} fill={c}>{empty ? "?" : code}</text>
      {!empty && <Horn x={48} y={78} s={0.5} c={c} w={3.4} />}
    </svg>
  );
}

/* ───────── Бәйтерек ─────────
   branches: [{ id, icon, leaves (0–5), full }] — 6 бұтақ: 0,1,2 сол жақта (жоғарыдан төмен), 3,4,5 оң жақта.
   Жапырақ саны нақты прогреске тең; толған бұтақтың ұшы алтынға боялады. Төбесінде — алтын жұмыртқа (деңгей). */
const TIP_Y = [112, 212, 312];
const bez = (p, t) => {
  const u = 1 - t;
  return [0, 1].map((i) => u * u * u * p[0][i] + 3 * u * u * t * p[1][i] + 3 * u * t * t * p[2][i] + t * t * t * p[3][i]);
};
const tan = (p, t) => {
  const u = 1 - t;
  return [0, 1].map((i) => 3 * u * u * (p[1][i] - p[0][i]) + 6 * u * t * (p[2][i] - p[1][i]) + 3 * t * t * (p[3][i] - p[2][i]));
};

export function ProfileTree({ branches = [], level = 1, className = "" }) {
  return (
    <svg className={`pf-tree-art ${className}`} viewBox="0 0 360 452" aria-hidden="true" focusable="false">
      {/* жер және тамыр */}
      <ellipse cx="180" cy="430" rx="128" ry="11" fill="#e9dcbd" />
      <g fill="none" stroke={BARK} strokeWidth="7" strokeLinecap="round">
        <path d="M172 420 C150 420 140 432 122 428 C108 425 108 410 120 410 C128 410 130 418 124 420" />
        <path d="M188 420 C210 420 220 432 238 428 C252 425 252 410 240 410 C232 410 230 418 236 420" />
      </g>
      {/* бұтақтар */}
      {branches.slice(0, 6).map((b, i) => {
        const right = i > 2, row = i % 3, ty = TIP_Y[row];
        const X = (x) => (right ? 360 - x : x);
        const p = [[X(178), ty + 62], [X(140), ty + 58], [X(96), ty + 22], [X(44), ty]];
        const slots = [0.34, 0.5, 0.64, 0.78, 0.9];
        return (
          <g key={b.id} className={`pf-branch ${b.leaves ? "has" : ""}`} style={{ "--b": i }}>
            <path d={`M${p[0]} C${p[1]} ${p[2]} ${p[3]}`} fill="none" stroke={INK} strokeWidth="10" strokeLinecap="round" />
            <path d={`M${p[0]} C${p[1]} ${p[2]} ${p[3]}`} fill="none" stroke={BARK} strokeWidth="6" strokeLinecap="round" />
            {slots.map((t, k) => {
              const [x, y] = bez(p, t), [dx, dy] = tan(p, t);
              const up = k % 2 === 0;
              const ang = (Math.atan2(dy, dx) * 180) / Math.PI + (up ? (right ? 20 : -20) : right ? 160 : -160) + 90;
              const on = k < b.leaves;
              return (
                <g key={k} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(0)})`}>
                  <path
                    className={on ? "pf-leaf on" : "pf-leaf"}
                    style={{ "--k": k }}
                    d="M0 0 C-12 -9 -12 -24 0 -34 C12 -24 12 -9 0 0Z"
                    fill={on ? (k % 2 ? OK2 : OK) : "none"}
                    stroke={on ? INK : "#b9a77c"}
                    strokeWidth={on ? 1.8 : 1.5}
                    strokeDasharray={on ? undefined : "3 3"}
                    strokeLinejoin="round"
                  />
                  {on && <path d="M0 -5 V-26" stroke={CREAM} strokeWidth="1.2" strokeDasharray="2 3" strokeLinecap="round" opacity=".8" />}
                </g>
              );
            })}
            <g className="pf-tip" transform={`translate(${p[3][0]} ${p[3][1]})`}>
              <circle r="19" fill={b.full ? GOLD : CREAM} stroke={INK} strokeWidth="2.5" />
              <circle r="14.5" fill="none" stroke={b.full ? "#fff1c4" : "#d8c9a3"} strokeWidth="1.4" strokeDasharray="2 3" />
              <g transform="translate(-9 -9)" style={{ color: b.full ? INK : b.leaves ? DEEP : "#6b5a3a" }}><Icon name={b.icon} size={18} stroke={2.2} /></g>
            </g>
          </g>
        );
      })}
      {/* дің */}
      <path d="M166 424 C172 330 174 200 176 84 H184 C186 200 188 330 194 424Z" fill={BARK} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M180 410 V96" stroke="#e6d2ad" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" opacity=".85" />
      <Horn x={180} y={300} s={0.5} c="#e6d2ad" w={3} />
      <Horn x={180} y={200} s={0.42} c="#e6d2ad" w={3} />
      {/* төбе: ұя және алтын жұмыртқа (деңгей) */}
      <g className="pf-egg">
        <g stroke={GOLD} strokeWidth="3" strokeLinecap="round">
          {[-70, -42, -14, 14, 42, 70].map((a) => <path key={a} transform={`rotate(${a} 180 50)`} d="M180 6 V-2" />)}
        </g>
        <path d="M142 74 C150 96 210 96 218 74" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <path d="M142 74 C150 96 210 96 218 74" fill="none" stroke={BARK} strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="180" cy="50" rx="30" ry="34" fill={GOLD} stroke={INK} strokeWidth="3" />
        <ellipse cx="180" cy="50" rx="23.5" ry="27.5" fill="none" stroke="#fff1c4" strokeWidth="1.6" strokeDasharray="2 4" />
        <text x="180" y="60" textAnchor="middle" fontFamily="var(--head)" fontWeight="800" fontSize={level > 99 ? 20 : 27} fill={INK}>{level}</text>
      </g>
    </svg>
  );
}

/* ───────── Шоқ (ошақ көмірі) ───────── */
export function ProfileEmber({ on = false }) {
  return (
    <svg className={`pf-ember-art ${on ? "on" : ""}`} viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <path d="M4 16 C4 11 8 8 12 8 C16 8 20 11 20 16 C20 19 17 21 12 21 C7 21 4 19 4 16Z" fill={on ? RED : "none"} stroke={on ? INK : "#6b5a3a"} strokeWidth="1.8" strokeDasharray={on ? undefined : "3 3"} />
      {on && <path d="M12 3 C15 6 15 9 12 12 C9 9 9 6 12 3Z" fill={GOLD} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />}
      {on && <path d="M8.5 16.5 q3.5 2.5 7 0" stroke={GOLD2} strokeWidth="1.6" fill="none" strokeLinecap="round" />}
    </svg>
  );
}
