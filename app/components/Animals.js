// 15 кейіпкер: бүркіт (Aqyl-ның өзі) және 14 жануар. Аты бәрінде Aqyl болып қалады.
const A = (id, e, kk, ru, en) => ({ id, e, name: { kk, ru, en } });
export const ANIMALS = [
  A("eagle", "🦅", "Бүркіт", "Беркут", "Golden eagle"),
  A("wolf", "🐺", "Қасқыр", "Волк", "Wolf"),
  A("bear", "🐻", "Аю", "Медведь", "Bear"),
  A("fox", "🦊", "Түлкі", "Лиса", "Fox"),
  A("leopard", "🐆", "Барыс", "Барс", "Snow leopard"),
  A("horse", "🐴", "Жылқы", "Лошадь", "Horse"),
  A("camel", "🐫", "Түйе", "Верблюд", "Camel"),
  A("deer", "🦌", "Марал", "Марал", "Maral deer"),
  A("saiga", "🫎", "Ақбөкен", "Сайгак", "Saiga"),
  A("owl", "🦉", "Жапалақ", "Сова", "Owl"),
  A("sheep", "🐑", "Қой", "Овца", "Sheep"),
  A("rabbit", "🐰", "Қоян", "Заяц", "Hare"),
  A("cat", "🐱", "Мысық", "Кот", "Cat"),
  A("squirrel", "🐿️", "Тиін", "Белка", "Squirrel"),
  A("tiger", "🐯", "Жолбарыс", "Тигр", "Tiger"),
];

const PAL = {
  wolf: { m: "#7f8a98", l: "#e9eef3", d: "#2f3640" },
  bear: { m: "#8b5a2b", l: "#dcb98f", d: "#3a2210" },
  fox: { m: "#ef7d1f", l: "#fff1dc", d: "#3a2210" },
  leopard: { m: "#c8ced7", l: "#f5f7f9", d: "#3b4350" },
  horse: { m: "#a5662e", l: "#dba46b", d: "#2f1b0a" },
  camel: { m: "#d5a760", l: "#efd6a6", d: "#5a3d17" },
  deer: { m: "#b4753e", l: "#f2dcb9", d: "#3a2210" },
  saiga: { m: "#dbb97e", l: "#f8eed8", d: "#4a3418" },
  owl: { m: "#8c6c4b", l: "#f2e3c8", d: "#2b1d10" },
  sheep: { m: "#3d322d", l: "#efe9df", d: "#241c18" },
  rabbit: { m: "#ebe5db", l: "#ffffff", d: "#e08aa4" },
  cat: { m: "#e3a85f", l: "#fff3df", d: "#4a2f16" },
  squirrel: { m: "#b8671f", l: "#f6dfb9", d: "#3a2210" },
  tiger: { m: "#f2a233", l: "#fff4df", d: "#2a1a0a" },
};
const INK = "#1d1612";

function Eyes({ mood, kind, p }) {
  const ex = [78, 122];
  if (kind === "owl") {
    return (
      <g>
        {ex.map((x) => (
          <g key={x}>
            <circle cx={x} cy="96" r="20" fill="#fff6e2" stroke={p.d} strokeWidth="2" />
            {mood === "sleep" || mood === "happy" || mood === "cheer" ? (
              <path d={`M${x - 10} 98 Q${x} ${mood === "sleep" ? 106 : 88} ${x + 10} 98`} stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
            ) : (
              <>
                <circle cx={x} cy="96" r={mood === "wow" ? 13 : 10} fill="#f0a000" />
                <circle cx={x} cy="96" r="6" fill={INK} />
                <circle cx={x + 3} cy="92" r="2.4" fill="#fff" />
              </>
            )}
          </g>
        ))}
      </g>
    );
  }
  if (mood === "sleep") return <g stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round">{ex.map((x) => <path key={x} d={`M${x - 8} 96 Q${x} 102 ${x + 8} 96`} />)}</g>;
  if (mood === "happy" || mood === "cheer") return <g stroke={INK} strokeWidth="4.2" fill="none" strokeLinecap="round">{ex.map((x) => <path key={x} d={`M${x - 8} 98 Q${x} 87 ${x + 8} 98`} />)}</g>;
  const r = mood === "wow" ? 10 : 8.5;
  const lx = mood === "think" ? -2 : 0;
  const ly = mood === "think" ? -3 : 0;
  return (
    <g className="bk-eyes" style={{ transformOrigin: "100px 94px" }}>
      {mood === "support" && <g stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none"><path d="M68 80 Q78 74 88 80" transform="rotate(-8 78 80)" /><path d="M112 80 Q122 74 132 80" transform="rotate(8 122 80)" /></g>}
      {ex.map((x) => (
        <g key={x}>
          <ellipse cx={x + lx} cy={94 + ly} rx={r} ry={r + 1.5} fill={INK} />
          <circle cx={x + lx + 3} cy={90 + ly} r="3" fill="#fff" />
          <circle cx={x + lx - 2} cy={98 + ly} r="1.4" fill="#fff" opacity=".7" />
        </g>
      ))}
    </g>
  );
}

function Mouth({ mood, y = 126 }) {
  const c = INK;
  if (mood === "happy" || mood === "cheer") return <g><path d={`M90 ${y} Q100 ${y + 20} 110 ${y} Z`} fill="#5a1d14" /><ellipse cx="100" cy={y + 10} rx="5" ry="3.4" fill="#ff7a90" /></g>;
  if (mood === "wow") return <ellipse cx="100" cy={y + 8} rx="5.5" ry="7" fill="#5a1d14" />;
  if (mood === "think") return <path d={`M92 ${y + 6} Q101 ${y + 2} 109 ${y + 6}`} stroke={c} strokeWidth="3.2" fill="none" strokeLinecap="round" />;
  if (mood === "sleep") return <path d={`M94 ${y + 5} Q100 ${y + 8} 106 ${y + 5}`} stroke={c} strokeWidth="3" fill="none" strokeLinecap="round" />;
  return <path d={`M91 ${y + 3} Q100 ${y + 11} 109 ${y + 3}`} stroke={c} strokeWidth="3.4" fill="none" strokeLinecap="round" />;
}

function Ear({ x, flip, kind, p }) {
  const s = flip ? -1 : 1;
  const tf = `translate(${x} 0) scale(${s} 1)`;
  switch (kind) {
    case "point": // қасқыр, түлкі, мысық
      return <g transform={tf}><path d="M-34 70 L-46 20 L-8 54Z" fill={p.m} /><path d="M-32 64 L-40 32 L-16 54Z" fill={p.d} opacity=".85" /></g>;
    case "round": // аю, жолбарыс, барыс, тиін
      return <g transform={tf}><circle cx="-38" cy="64" r="17" fill={p.m} /><circle cx="-38" cy="64" r="9" fill={p.l} /></g>;
    case "long": // қоян
      return <g transform={tf}><ellipse cx="-22" cy="38" rx="13" ry="40" fill={p.m} /><ellipse cx="-22" cy="40" rx="6.5" ry="30" fill={p.d} opacity=".75" /></g>;
    case "horse": // жылқы, марал, ақбөкен
      return <g transform={tf}><path d="M-34 66 L-48 24 L-14 54Z" fill={p.m} /><path d="M-33 62 L-42 34 L-20 54Z" fill={p.d} opacity=".6" /></g>;
    case "side": // қой
      return <g transform={tf}><ellipse cx="-56" cy="96" rx="20" ry="9" fill={p.m} transform="rotate(20 -56 96)" /></g>;
    case "tuft": // жапалақ
      return <g transform={tf}><path d="M-30 62 L-46 24 L-12 52Z" fill={p.m} /></g>;
    default:
      return null;
  }
}

const KIND = { wolf: "point", fox: "point", cat: "point", bear: "round", tiger: "round", leopard: "round", squirrel: "round", camel: "round", rabbit: "long", horse: "horse", deer: "horse", saiga: "horse", sheep: "side", owl: "tuft" };

export function AnimalArt({ id, mood = "idle", uid }) {
  const p = PAL[id];
  const up = mood === "happy" || mood === "cheer";
  const gm = `gm${uid}`;
  const headFill = id === "sheep" ? p.m : p.m;
  const snout = { wolf: [24, 22], fox: [22, 20], horse: [24, 27], saiga: [20, 22], deer: [22, 22], camel: [24, 24] }[id] || [26, 20];
  return (
    <g>
      <defs>
        <radialGradient id={gm} cx="40%" cy="30%" r="80%">
          <stop offset="0" stopColor={p.m} />
          <stop offset="1" stopColor={p.m} stopOpacity=".86" />
        </radialGradient>
      </defs>

      {/* Артқы бөліктер */}
      {id === "fox" && <g><path d="M140 200 C190 190 200 130 170 120 C176 150 160 172 138 176Z" fill={p.m} /><path d="M170 120 C196 140 190 176 176 188 C186 160 178 140 170 120Z" fill="#fff" /></g>}
      {id === "squirrel" && <path d="M142 200 C206 200 204 110 164 84 C186 126 168 162 138 172Z" fill={p.m} stroke={p.d} strokeWidth="2" opacity=".95" />}
      {id === "leopard" && <path d="M138 206 C190 214 204 168 176 150 C184 178 164 192 138 192Z" fill={p.m} stroke={p.d} strokeWidth="2" />}
      {id === "camel" && <g fill={p.m}><ellipse cx="70" cy="140" rx="24" ry="30" /><ellipse cx="130" cy="140" rx="24" ry="30" /></g>}
      {id === "deer" && (
        <g stroke="#6b3f1d" strokeWidth="5" fill="none" strokeLinecap="round">
          <path d="M70 56 L52 22 M62 40 L44 40 M54 26 L42 14" />
          <path d="M130 56 L148 22 M138 40 L156 40 M146 26 L158 14" />
        </g>
      )}
      {id === "saiga" && (
        <g stroke="#5a4020" strokeWidth="5" fill="none" strokeLinecap="round"><path d="M76 56 L70 22" /><path d="M124 56 L130 22" /></g>
      )}
      {id === "sheep" && (
        <g fill={p.l}>
          {[[52, 60, 22], [78, 42, 24], [108, 38, 24], [134, 46, 22], [150, 74, 20], [48, 90, 18], [152, 100, 18]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} />)}
        </g>
      )}
      {id === "horse" && <path d="M76 52 C70 80 66 112 74 146 C60 122 56 90 64 58Z" fill={p.d} />}

      {/* Құлақ */}
      {KIND[id] && id !== "sheep" ? (<><Ear x={100} flip={false} kind={KIND[id]} p={p} /><Ear x={100} flip kind={KIND[id]} p={p} /></>) : null}
      {id === "sheep" && (<><Ear x={100} kind="side" p={{ ...p, m: p.m }} /><Ear x={100} flip kind="side" p={{ ...p, m: p.m }} /></>)}

      {/* Дене */}
      <ellipse cx="100" cy="176" rx="50" ry="50" fill={id === "sheep" ? p.l : `url(#${gm})`} />
      <ellipse cx="100" cy="188" rx="30" ry="32" fill={id === "sheep" ? "#fff" : p.l} opacity={id === "sheep" ? 0.6 : 0.95} />
      {id === "sheep" && <g fill={p.l}>{[[62, 168, 16], [138, 170, 16], [78, 204, 15], [124, 206, 15]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} />)}</g>}
      {id === "leopard" && <g fill={p.d} opacity=".7">{[[70, 160], [130, 164], [84, 200], [118, 196], [100, 150]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="5" />)}</g>}
      {id === "tiger" && <g stroke={p.d} strokeWidth="5" strokeLinecap="round" fill="none"><path d="M54 160 Q62 164 66 176 M146 160 Q138 164 134 176 M58 192 Q66 192 70 202 M142 192 Q134 192 130 202" /></g>}

      {/* Аяқ */}
      <ellipse cx="76" cy="224" rx="19" ry="8" fill={id === "sheep" ? p.d : p.m} stroke={p.d} strokeWidth="1.5" />
      <ellipse cx="124" cy="224" rx="19" ry="8" fill={id === "sheep" ? p.d : p.m} stroke={p.d} strokeWidth="1.5" />

      {/* Қол */}
      <g className="bk-arm-l" style={{ transformOrigin: "56px 150px" }}>
        <ellipse cx="46" cy="170" rx="12" ry="26" fill={id === "sheep" ? p.m : p.m} transform={up ? "rotate(150 56 150)" : "rotate(14 56 150)"} />
      </g>
      <g className="bk-arm-r" style={{ transformOrigin: "144px 150px" }}>
        <ellipse cx="154" cy="170" rx="12" ry="26" fill={id === "sheep" ? p.m : p.m} transform={up ? "rotate(-150 144 150)" : "rotate(-14 144 150)"} />
      </g>

      {/* Бас */}
      <ellipse cx="100" cy="100" rx="55" ry="49" fill={headFill === p.m ? `url(#${gm})` : headFill} />
      {id === "fox" && <><path d="M48 104 Q62 134 100 140 Q74 112 52 96Z" fill="#fff" /><path d="M152 104 Q138 134 100 140 Q126 112 148 96Z" fill="#fff" /></>}
      {id === "wolf" && <><path d="M46 100 Q60 132 100 140 Q70 110 50 90Z" fill={p.l} opacity=".9" /><path d="M154 100 Q140 132 100 140 Q130 110 150 90Z" fill={p.l} opacity=".9" /></>}
      {id === "tiger" && <g stroke={p.d} strokeWidth="5" strokeLinecap="round" fill="none"><path d="M100 54 V70 M86 58 L90 72 M114 58 L110 72 M48 96 H62 M50 112 L64 108 M152 96 H138 M150 112 L136 108" /></g>}
      {id === "leopard" && <g fill={p.d} opacity=".7">{[[70, 70], [130, 70], [58, 100], [142, 100], [100, 64]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="4.4" />)}</g>}
      {id === "cat" && <g stroke={p.d} strokeWidth="4" strokeLinecap="round" fill="none"><path d="M92 56 V70 M100 54 V72 M108 56 V70" /></g>}
      {id === "squirrel" && <><path d="M40 70 L34 46 L58 62Z" fill={p.d} opacity=".6" /><path d="M160 70 L166 46 L142 62Z" fill={p.d} opacity=".6" /></>}
      {id === "sheep" && <ellipse cx="100" cy="106" rx="42" ry="42" fill={p.d} />}
      {id === "owl" && <><ellipse cx="100" cy="100" rx="46" ry="42" fill={p.l} opacity=".85" /><path d="M100 118 L90 134 L110 134Z" fill="#f0a000" stroke="#c07a00" strokeWidth="1.5" strokeLinejoin="round" /></>}
      {id === "rabbit" && <><ellipse cx="100" cy="116" rx="30" ry="24" fill={p.l} /></>}

      {/* Тұмсық */}
      {id !== "owl" && id !== "sheep" && <ellipse cx="100" cy={id === "horse" || id === "saiga" ? 122 : 118} rx={snout[0]} ry={snout[1]} fill={p.l} />}
      {id === "sheep" && <ellipse cx="100" cy="122" rx="24" ry="18" fill="#52453e" />}
      {id === "saiga" && <ellipse cx="100" cy="112" rx="17" ry="19" fill={p.l} stroke={p.d} strokeWidth="1.6" />}
      {id === "bear" && <ellipse cx="100" cy="118" rx="22" ry="17" fill={p.l} />}
      {id !== "owl" && <ellipse cx="100" cy={id === "horse" ? 112 : id === "saiga" ? 106 : 111} rx={id === "rabbit" ? 5.5 : 7.5} ry={id === "rabbit" ? 4 : 5.5} fill={id === "rabbit" ? "#e0607f" : id === "sheep" ? "#241c18" : INK} />}
      {(id === "horse") && <g fill={INK}><ellipse cx="90" cy="130" rx="3" ry="2.4" /><ellipse cx="110" cy="130" rx="3" ry="2.4" /></g>}
      {(id === "cat" || id === "rabbit") && <g stroke={INK} strokeWidth="1.8" strokeLinecap="round" opacity=".7"><path d="M64 112 H42 M64 120 L44 126 M136 112 H158 M136 120 L156 126" /></g>}
      {id === "camel" && <g stroke={INK} strokeWidth="2.4" strokeLinecap="round"><path d="M70 86 L64 80 M74 84 L72 77 M130 86 L136 80 M126 84 L128 77" /></g>}

      <Eyes mood={mood} kind={id === "owl" ? "owl" : "std"} p={p} />
      <ellipse cx="62" cy="110" rx="8" ry="5" fill="#ff8fb0" opacity=".45" />
      <ellipse cx="138" cy="110" rx="8" ry="5" fill="#ff8fb0" opacity=".45" />
      {id !== "owl" && <Mouth mood={mood} y={id === "horse" || id === "saiga" ? 132 : 123} />}
    </g>
  );
}
