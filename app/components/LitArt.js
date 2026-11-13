// LitArt — «Әдебиет» бетінің киіз-аппликация суреттері.
// Әр шығарманың мұқабасына символдық белгі (адам бейнесі жоқ): қауырсын, тұлпар, қалқан, домбыра…
// Таза SVG, <defs>/id жоқ — бір бетте қанша дана болса да қайшылық жоқ.

const CR = "#FAF6EE"; // киіз ақшылы
const GD = "#E0A526"; // алтын
const PG = "#F6E3B0"; // ақшыл алтын
const RD = "#B8322A"; // анар
const RDD = "#8A2018";
const BR = "#7A4A22";
const BRD = "#4F2E14";
const GR = "#2F6B4F";
const KK = "#0F5E7A";
const IN = "#1F2430";

// Мұқаба түстері: [фон, қою жиек]
export const LIT_COVER = {
  "abai-sozder": ["#8A2018", "#5E140F"],
  "abai-zholy": ["#0F5E7A", "#0A4256"],
  kobylandy: ["#7A4A22", "#4F2E14"],
  alpamys: ["#2F6B4F", "#1E4A36"],
  "kyz-zhibek": ["#A63A2B", "#73241A"],
  "kozy-bayan": ["#3E4E7A", "#29355A"],
  "er-targyn": ["#4A2C3A", "#2F1B25"],
  magzhan: ["#B8322A", "#7E1F19"],
  baitursynuly: ["#2F6B4F", "#1E4A36"],
  shakarim: ["#1E5F66", "#134248"],
  kulager: ["#7A4A22", "#4F2E14"],
  zhambyl: ["#8A2018", "#5E140F"],
  seifullin: ["#4A2C3A", "#2F1B25"],
  altynsarin: ["#0F5E7A", "#0A4256"],
  koshpendiler: ["#A63A2B", "#73241A"],
};

// Шығарма → белгі
export const LIT_MOTIF = {
  "abai-sozder": "quill",
  "abai-zholy": "road",
  kobylandy: "horse",
  alpamys: "shield",
  "kyz-zhibek": "saukele",
  "kozy-bayan": "swans",
  "er-targyn": "swords",
  magzhan: "sun",
  baitursynuly: "fox",
  shakarim: "branch",
  kulager: "horseshoe",
  zhambyl: "dombyra",
  seifullin: "pass",
  altynsarin: "book",
  koshpendiler: "banner",
};

// Авторлардың туған жылы (уақыт сызығы үшін). Халық жырларында жыл жоқ.
export const LIT_YEAR = {
  altynsarin: 1841,
  "abai-sozder": 1845,
  zhambyl: 1846,
  shakarim: 1858,
  baitursynuly: 1872,
  magzhan: 1893,
  seifullin: 1894,
  kulager: 1894,
  "abai-zholy": 1897,
  koshpendiler: 1915,
};

const qoshqar = (d) => (
  <g fill="none" stroke={d} strokeWidth="3" strokeLinecap="round">
    <path d="M50 68c0-11-9-16-15-11-5 4-2 11 4 9" />
    <path d="M50 68c0-11 9-16 15-11 5 4 2 11-4 9" />
    <path d="M50 68v8" />
  </g>
);

function Motif({ name, d }) {
  switch (name) {
    case "quill":
      return (
        <g>
          <path d="M84 8C58 14 34 38 30 72c22-8 46-30 54-64Z" fill={CR} />
          <path d="M84 8 26 80" stroke={d} strokeWidth="2.4" strokeLinecap="round" />
          <g stroke={d} strokeWidth="1.8" strokeLinecap="round" opacity=".55">
            <path d="M66 22l8 4M58 32l9 4M50 42l9 4M43 52l8 3" />
          </g>
          <path d="M30 72l-9 16 4 2 10-14Z" fill={GD} />
          <circle cx="18" cy="94" r="3.4" fill={GD} />
          <path d="M70 66l2.5 5 5 2.5-5 2.5-2.5 5-2.5-5-5-2.5 5-2.5Z" fill={GD} />
        </g>
      );
    case "road":
      return (
        <g>
          <circle cx="74" cy="30" r="11" fill={GD} />
          <path d="M0 68q25-14 50-4t50-4v40H0Z" fill={d} />
          <path d="M40 66c0-9 20-9 20 0Z" fill={CR} />
          <rect x="48" y="60" width="4" height="6" fill={GD} />
          <path d="M34 100c4-14 30-16 22-26-4-5-6-6-4-8h3c-1 3 3 5 6 9 8 11-15 13-11 25Z" fill={CR} />
          <path d="M8 56q6-6 12 0M84 52q5-5 10 0" fill="none" stroke={PG} strokeWidth="2" strokeLinecap="round" opacity=".8" />
        </g>
      );
    case "horse":
      return (
        <g>
          <path d="M56 12C46 24 37 40 32 58c-3 12-4 24-4 36h-8c0-18 5-38 14-56C40 26 48 17 56 12Z" fill={GD} />
          <path d="M30 94c0-20 3-38 13-52 6-8 10-18 13-30l6 9c7 1 15 9 21 21 5 10 4 17-2 18-6 1-10-2-15-4-5 9-4 24 0 38Z" fill={CR} />
          <circle cx="62" cy="36" r="3.2" fill={d} />
          <circle cx="79" cy="57" r="1.9" fill={d} />
          <path d="M57 50c8-5 17-6 25-3M60 40l-2 12" fill="none" stroke={GD} strokeWidth="2.6" strokeLinecap="round" />
        </g>
      );
    case "shield":
      return (
        <g>
          <circle cx="50" cy="52" r="36" fill={CR} />
          <circle cx="50" cy="52" r="29" fill="none" stroke={GD} strokeWidth="3" />
          {qoshqar(d)}
          <circle cx="50" cy="40" r="6" fill={GD} />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <circle key={a} cx={50 + 32.5 * Math.cos((a * Math.PI) / 180)} cy={52 + 32.5 * Math.sin((a * Math.PI) / 180)} r="2.2" fill={GD} />
          ))}
        </g>
      );
    case "saukele":
      return (
        <g>
          <path d="M50 22c-7-6-8-14-3-19 1 4 3 5 3 5s2-1 3-5c5 5 4 13-3 19Z" fill={PG} />
          <path d="M38 86 44 28c1-7 11-7 12 0l6 58Z" fill={CR} />
          <path d="M43 40h14M41.6 54h16.8M40.2 68h19.6" stroke={GD} strokeWidth="3" />
          <g fill={d}><path d="M50 44l3 4-3 4-3-4Z" /><path d="M50 58l3.5 4.5-3.5 4.5-3.5-4.5Z" /></g>
          <path d="M28 86q22 8 44 0v6q-22 9-44 0Z" fill={GD} />
          <g stroke={PG} strokeWidth="1.6"><path d="M32 92v6M68 92v6" /></g>
          <g fill={GD}><circle cx="32" cy="99" r="2.2" /><circle cx="68" cy="99" r="2.2" /></g>
        </g>
      );
    case "swans": {
      const swan = (
        <g>
          <path d="M40 80C24 68 18 46 26 32c6-10 18-8 20 2" fill="none" stroke={CR} strokeWidth="6.5" strokeLinecap="round" />
          <circle cx="44" cy="36" r="5" fill={CR} />
          <path d="M47 38l6 5-7-1Z" fill={GD} />
          <path d="M18 80c4-8 16-10 26-4 4 2 4 6 0 8H22c-4 0-6-2-4-4Z" fill={CR} />
        </g>
      );
      return (
        <g>
          <path d="M50 10c-2-4-8-4-8 1 0 4 8 8 8 10 0-2 8-6 8-10 0-5-6-5-8-1Z" fill={GD} />
          {swan}
          <g transform="translate(100 0) scale(-1 1)">{swan}</g>
          <path d="M8 94q7-4 14 0t14 0t14 0t14 0t14 0t14 0" fill="none" stroke={GD} strokeWidth="2.2" strokeLinecap="round" />
        </g>
      );
    }
    case "swords": {
      const sabre = (
        <g>
          <path d="M22 90C40 68 60 40 80 12l5 3C67 43 47 71 27 93Z" fill={CR} />
          <path d="M18 80l14 14" stroke={GD} strokeWidth="5" strokeLinecap="round" />
          <path d="M22 90l-8 8" stroke={d} strokeWidth="6" strokeLinecap="round" />
          <circle cx="13" cy="99" r="2.6" fill={GD} />
        </g>
      );
      return (
        <g>
          {sabre}
          <g transform="translate(100 0) scale(-1 1)">{sabre}</g>
          <path d="M50 30l4 6-4 6-4-6Z" fill={GD} />
        </g>
      );
    }
    case "sun":
      return (
        <g>
          <g stroke={GD} strokeWidth="4" strokeLinecap="round">
            {[-80, -60, -40, -20, 0, 20, 40, 60, 80].map((a) => {
              const r = (a * Math.PI) / 180;
              return <path key={a} d={`M${50 + 30 * Math.sin(r)} ${66 - 30 * Math.cos(r)}L${50 + 42 * Math.sin(r)} ${66 - 42 * Math.cos(r)}`} />;
            })}
          </g>
          <path d="M26 66a24 24 0 0 1 48 0Z" fill={CR} />
          <path d="M0 66h100v34H0Z" fill={d} />
          <path d="M10 78h26M50 84h40M20 92h30" stroke={PG} strokeWidth="2.4" strokeLinecap="round" opacity=".7" />
        </g>
      );
    case "fox":
      return (
        <g>
          <path d="M50 84 18 44l6-30 18 20h16l18-20 6 30Z" fill={GD} />
          <path d="M26 22l10 12-8 6Z M74 22 64 34l8 6Z" fill={d} />
          <path d="M50 84 20 46l24 10Z M50 84l30-38-24 10Z" fill={CR} />
          <ellipse cx="40" cy="50" rx="3" ry="4" fill={d} />
          <ellipse cx="60" cy="50" rx="3" ry="4" fill={d} />
          <circle cx="50" cy="80" r="3.6" fill={d} />
        </g>
      );
    case "branch":
      return (
        <g>
          <path d="M28 12a15 15 0 1 0 16 22 12 12 0 1 1-16-22Z" fill={GD} />
          <path d="M22 94C40 76 58 56 82 30" fill="none" stroke={CR} strokeWidth="3.4" strokeLinecap="round" />
          <g fill={CR}>
            <path d="M40 76c-12 0-18-8-18-8s10-6 18 8Z" />
            <path d="M54 60c-2-12 4-18 4-18s8 8-4 18Z" />
            <path d="M64 50c-12 0-18-8-18-8s10-6 18 8Z" />
            <path d="M74 38c-2-12 4-18 4-18s8 8-4 18Z" />
          </g>
          <path d="M46 70c-2-10 4-16 4-16s6 8-4 16Z" fill={GD} />
        </g>
      );
    case "horseshoe":
      return (
        <g>
          <path d="M32 26v28c0 17 8 28 18 28s18-11 18-28V26" fill="none" stroke={CR} strokeWidth="13" />
          <g fill={d}>
            <circle cx="32" cy="34" r="2" /><circle cx="32" cy="48" r="2" /><circle cx="36" cy="62" r="2" />
            <circle cx="68" cy="34" r="2" /><circle cx="68" cy="48" r="2" /><circle cx="64" cy="62" r="2" />
          </g>
          <path d="M4 40h14M2 54h16M6 68h14" stroke={GD} strokeWidth="3.4" strokeLinecap="round" />
          <path d="M50 8l2.6 5.4 5.4 2.6-5.4 2.6L50 24l-2.6-5.4-5.4-2.6 5.4-2.6Z" fill={GD} />
        </g>
      );
    case "dombyra":
      return (
        <g transform="rotate(-20 50 54)">
          <rect x="46.5" y="10" width="7" height="48" rx="2.5" fill={d} />
          <path d="M45 12c0-9 10-9 10 0l1 7H44Z" fill={GD} />
          <rect x="38" y="12" width="6" height="4" rx="2" fill={PG} />
          <rect x="56" y="16" width="6" height="4" rx="2" fill={PG} />
          <g stroke={GD} strokeWidth="1.6"><path d="M46.5 28h7M46.5 38h7M46.5 48h7" /></g>
          <path d="M46 54c-10 7-17 17-17 28 0 11 10 16 21 16s21-5 21-16c0-11-7-21-17-28-2-2-6-2-8 0Z" fill={CR} />
          <circle cx="50" cy="76" r="6" fill={d} />
          <circle cx="50" cy="76" r="6" fill="none" stroke={GD} strokeWidth="2" />
          <path d="M40 90q10 6 20 0" fill="none" stroke={GD} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M48.6 16v76M51.4 16v76" stroke={PG} strokeWidth="1" />
        </g>
      );
    case "pass":
      return (
        <g>
          <path d="M50 10l2.4 5 5 2.4-5 2.4-2.4 5-2.4-5-5-2.4 5-2.4Z" fill={GD} />
          <path d="M0 100V30l14-10 12 16 10 64Z" fill={CR} />
          <path d="M100 100V34l-14-10-12 18-10 58Z" fill={CR} />
          <path d="M14 20l12 16-8 2Z M86 24 74 42l8 0Z" fill={d} opacity=".35" />
          <path d="M50 100l-6-14 12-12-10-12 8-10-4-10" fill="none" stroke={GD} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "book":
      return (
        <g>
          <path d="M50 12l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" fill={GD} />
          <path d="M50 40c-10-6-26-8-38-4v48c12-4 28-2 38 4Z" fill={CR} />
          <path d="M50 40c10-6 26-8 38-4v48c-12-4-28-2-38 4Z" fill={PG} />
          <path d="M50 40v48" stroke={d} strokeWidth="2.4" />
          <g stroke={d} strokeWidth="2" strokeLinecap="round" opacity=".45">
            <path d="M20 48c8-2 16-1 22 2M20 58c8-2 16-1 22 2M20 68c8-2 16-1 22 2" />
            <path d="M80 48c-8-2-16-1-22 2M80 58c-8-2-16-1-22 2M80 68c-8-2-16-1-22 2" />
          </g>
          <path d="M8 86c14-4 30-2 42 6 12-8 28-10 42-6v4c-14-4-30-2-42 6-12-8-28-10-42-6Z" fill={GD} />
        </g>
      );
    case "banner":
      return (
        <g>
          <path d="M32 2l6 12H26Z" fill={GD} />
          <rect x="30" y="12" width="4" height="84" rx="2" fill={CR} />
          <path d="M28 16c-4 6-6 14-4 22M32 16c0 8 0 16 2 22M36 16c4 6 4 14 2 20" fill="none" stroke={PG} strokeWidth="3" strokeLinecap="round" />
          <path d="M34 24c16-6 30 8 52 0v32c-22 8-36-6-52 0Z" fill={GD} />
          <g transform="translate(10 -27) scale(.9)">{qoshqar(d)}</g>
          <path d="M8 96h84" stroke={CR} strokeWidth="3" strokeLinecap="round" opacity=".6" />
        </g>
      );
    default:
      return <circle cx="50" cy="50" r="30" fill={CR} />;
  }
}

// Мұқабадағы белгі
export function LitEmblem({ id, size = 84, className = "" }) {
  const [, dark] = LIT_COVER[id] || ["#8A2018", "#5E140F"];
  return (
    <svg className={`lit-emblem ${className}`} viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" focusable="false">
      <Motif name={LIT_MOTIF[id]} d={dark} />
    </svg>
  );
}

// Мұқаба бұрышындағы алтын ою (бір бұрыш; CSS арқылы айналады)
export function LitCorner() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <path d="M3 21V9a6 6 0 0 1 6-6h12" fill="none" stroke={GD} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 16c0-4 3-6 6-4 2 2 0 5-2 4" fill="none" stroke={GD} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="3" cy="21" r="1.6" fill={GD} />
      <circle cx="21" cy="3" r="1.6" fill={GD} />
    </svg>
  );
}

// Басты сурет: ашық кітап, домбыра, қауырсын, дала мен күн (Aqyl үстіне қонады)
export function LitHeroArt() {
  return (
    <svg className="lit-hero-svg" viewBox="0 0 340 230" aria-hidden="true" focusable="false">
      {/* киіз жамау-фон */}
      <path d="M30 120c-8-52 34-96 98-100 40-3 64 12 100 6 50-8 92 20 96 70 4 46-20 86-74 96-46 8-74-6-118 0-62 8-96-20-102-72Z" fill="#F4ECDA" />
      <path d="M44 120c-6-44 30-82 86-86" fill="none" stroke="#E6D9BC" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" />
      {/* күн */}
      <g className="lit-hero-sun">
        <circle cx="262" cy="62" r="24" fill={GD} />
        <g stroke={GD} strokeWidth="4" strokeLinecap="round" opacity=".55">
          <path d="M262 26v-10M262 108v-6M298 62h10M226 62h-8M287 37l7-7M237 87l-6 6M287 87l6 6M237 37l-6-6" />
        </g>
      </g>
      {/* дала */}
      <path d="M22 168c40-18 90-22 150-14s110 4 150-8v40H22Z" fill="#E7D3A5" />
      <path d="M22 178c50-10 100-10 150-4s100 2 150-6v34c-50 14-260 14-300 0Z" fill={GR} opacity=".9" />
      {/* домбыра (сол жақта, сүйеніп тұр) */}
      <g transform="rotate(-24 70 140)">
        <rect x="66" y="42" width="9" height="80" rx="3" fill={BRD} />
        <path d="M64 44c0-12 13-12 13 0l1 9H63Z" fill={GD} />
        <rect x="56" y="45" width="7" height="4.5" rx="2" fill={PG} />
        <rect x="78" y="50" width="7" height="4.5" rx="2" fill={PG} />
        <g stroke={GD} strokeWidth="1.8"><path d="M66 64h9M66 78h9M66 92h9M66 106h9" /></g>
        <path d="M64 116c-14 9-24 22-24 36 0 15 14 22 30 22s30-7 30-22c0-14-10-27-24-36-3-3-9-3-12 0Z" fill={BR} />
        <path d="M50 148c0-12 8-22 16-26" fill="none" stroke="#9A6235" strokeWidth="3" strokeLinecap="round" />
        <circle cx="70" cy="146" r="8" fill={BRD} />
        <circle cx="70" cy="146" r="8" fill="none" stroke={GD} strokeWidth="2.2" />
        <path d="M58 162q12 8 24 0" fill="none" stroke={GD} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M68.6 50v116M72.4 50v116" stroke={PG} strokeWidth="1.1" />
      </g>
      {/* ашық кітап */}
      <g>
        <path d="M96 190c30-12 66-12 86-2 20-10 56-10 86 2v10c-30-10-66-10-86 2-20-12-56-12-86-2Z" fill={RDD} />
        <path d="M100 118c30-10 62-8 82 6v66c-20-12-52-14-82-4Z" fill="#FFFDF7" />
        <path d="M264 118c-30-10-62-8-82 6v66c20-12 52-14 82-4Z" fill="#FFF7E6" />
        <path d="M182 124v66" stroke="#D9C79E" strokeWidth="2" />
        <g stroke="#C9B48A" strokeWidth="2.4" strokeLinecap="round">
          <path d="M114 134c18-4 38-3 56 4M114 148c18-4 38-3 56 4M114 162c18-4 38-3 56 4M114 176c14-3 28-2 40 2" />
          <path d="M250 134c-18-4-38-3-56 4M250 148c-18-4-38-3-56 4M250 162c-18-4-38-3-56 4" />
        </g>
        {/* бас әріп */}
        <rect x="112" y="128" width="12" height="14" rx="2" fill={RD} />
        <path d="M100 186c30-10 62-8 82 6 20-14 52-16 82-6v6c-30-10-62-8-82 6-20-14-52-16-82-6Z" fill={RD} />
        {/* бетбелгі */}
        <path d="M232 112v34l6-6 6 6v-36Z" fill={GD} />
      </g>
      {/* сия сауыт пен қауырсын */}
      <g>
        <path d="M282 178h28l-3 22h-22Z" fill={KK} />
        <rect x="280" y="172" width="32" height="8" rx="3" fill="#0A4256" />
        <path d="M290 186h12" stroke={PG} strokeWidth="2" strokeLinecap="round" />
        <g className="lit-hero-quill">
          <path d="M330 92c-20 6-32 26-34 56 16-8 30-28 34-56Z" fill={CR} />
          <path d="M330 92l-34 84" stroke={BR} strokeWidth="2.2" strokeLinecap="round" />
          <g stroke="#D9C79E" strokeWidth="1.6" strokeLinecap="round"><path d="M320 110l6 3M314 124l7 3M308 138l6 2" /></g>
        </g>
      </g>
      {/* ұшқын жұлдыздар */}
      <g fill={GD}>
        <path d="M150 44l3 6 6 3-6 3-3 6-3-6-6-3 6-3Z" className="lit-tw" />
        <path d="M208 30l2 4 4 2-4 2-2 4-2-4-4-2 4-2Z" className="lit-tw lit-tw2" />
      </g>
      <path d="M22 206c80 10 220 10 300 0" stroke={IN} strokeOpacity=".08" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}
