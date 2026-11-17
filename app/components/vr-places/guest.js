// VR өмір: ҚОНАҚҚА БАРУ. Ауладағы ақ үй, көк қақпа, алма ағашы → есік ашылып, апа шығады (артында ата) → «Төрге шық!».
// Кіреберісте аяқ киімімізді шешеміз → бөлмеге кіріп, төрге, дөңгелек үстел басына отырамыз. Түйіндер: сыйлық беру,
// сүт қосып шай құю (кесені толтырмай), бауырсақ ұсыну, келіннің бесбармақ әкелуі, салат, тағы шай,
// атаның батасы (алақан жайып тыңдаймыз), «Әумин» — бәрі бетін сипайды, соңында қоштасу.
import { C, ST, Box, Cone, Pool, Item, Person, Actor, Passerby, Horn, walkTo, beat, say, free } from "./kit";

const APA = { f: true, skin: 1, hair: "#8E877E", hs: "scarf", scarf: "#EDE6D6", top: "#7A2A40", vest: "#4E1A2A", skirt: "#3A2B4E", pants: "#3A2B4E", legs: "#5E5650" };
const ATA = { skin: 2, hair: "#B9B3A6", hs: "short", top: "#E9E2D2", vest: "#2F3A34", tache: true, brow: "#8E877E", pants: "#2B2F3A" };
const KELIN = { f: true, skin: 0, hair: "#2B1A12", hs: "scarf", scarf: C.red, top: C.teal, skirt: "#1F4E5A", pants: "#1F4E5A" };
const KID = { kid: true, skin: 1, hair: "#1E1A1A", hs: "short", top: C.gold, pants: C.blue };

const spots = {
  inside: { x: 404, y: 372, s: 0.84 },
  porch: { x: 488, y: 440, s: 1 },
  ataDoor: { x: 380, y: 380, s: 0.84 },
  host: { x: 612, y: 418, s: 0.92 },
  ata: { x: 268, y: 392, s: 0.8 },
  kdoor: { x: 740, y: 312, s: 0.66 },
  kmid: { x: 560, y: 360, s: 0.8 },
};
const shots = {
  wide: { x: 400, y: 236, z: 1, a: "m" },
  gate: { x: 400, y: 262, z: 1.3, a: "m" },
  porch: { x: 440, y: 262, z: 1.2 },
  shoes: { x: 400, y: 330, z: 1.5, a: "b" },
  entry: { x: 400, y: 200, z: 1.2, a: "m" },
  aisle: { x: 420, y: 236, z: 1.1 },
  seat: { x: 410, y: 250, z: 1.06 },
  rise: { x: 410, y: 210, z: 1.02, a: "m" },
};

/* ── Аула ── */
function Yard({ st, talk, mood }) {
  const p = st.p, a = st.a;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="320" fill="#CFE6EC" />
      <path d="M-40 170L80 110L180 150L300 90L420 150L560 100L700 160L840 120V260H-40Z" fill="#B7CCD5" />
      {/* үй */}
      <path d="M140 150L400 60L660 150Z" fill={C.green} /><path d="M160 150L400 74L640 150" fill="none" stroke={ST} strokeWidth="2" strokeDasharray="5 5" />
      <rect x="150" y="150" width="500" height="240" fill="#F7F1E4" />
      <rect x="150" y="150" width="500" height="10" fill="#E3D8C2" />
      {[[186, 290], [510, 614]].map(([a2, b]) => (
        <g key={a2}>
          <rect x={a2 - 8} y="182" width={b - a2 + 16} height="120" rx="4" fill={C.blue} />
          <rect x={a2} y="190" width={b - a2} height="104" fill="#F6D9A0" />
          <path d={`M${(a2 + b) / 2} 190v104M${a2} 232h${b - a2}`} stroke={C.blue} strokeWidth="5" />
          <path d={`M${a2 - 14} 182q${(b - a2) / 2 + 14} -22 ${b - a2 + 28} 0`} fill={C.blue} />
          <path d={`M${a2 + 10} 178q8 -10 16 0q8 -10 16 0M${b - 42} 178q8 -10 16 0q8 -10 16 0`} stroke={C.surf} strokeWidth="2.4" fill="none" />
          <path d={`M${a2 + 4} 196q14 30 0 92M${b - 4} 196q-14 30 0 92`} stroke="#E9C7C2" strokeWidth="10" fill="none" />
        </g>
      ))}
      {/* есік пен баспалдақ */}
      <rect x="350" y="200" width="100" height="190" fill={C.blue2} />
      <rect x="358" y="208" width="84" height="182" fill="#F2D9A6" />
      <Actor a={a.ata} dur={a.ata?.dur}><Person o={ATA} pose={a.ata?.pose} look={a.ata?.look || 0} head={a.ata?.head} seed={4} /></Actor>
      <g transform="translate(358 208)">
        <g className="lf-mv" style={{ transform: p.door ? "scaleX(0.16) skewY(-10deg)" : "none" }}>
          <rect width="84" height="182" fill={C.blue} />
          <rect x="10" y="12" width="64" height="70" rx="3" fill="none" stroke={C.surf} strokeWidth="2.4" /><Horn x={42} y={48} s={0.9} c={C.surf} />
          <rect x="10" y="96" width="64" height="72" rx="3" fill="none" stroke={C.surf} strokeWidth="2.4" />
          <rect x="68" y="92" width="6" height="26" rx="3" fill={C.gold} />
        </g>
      </g>
      <path d="M340 200q60 -30 120 0" fill="none" stroke={C.blue} strokeWidth="8" />
      <rect x="320" y="388" width="160" height="10" fill="#D6CBB2" /><rect x="306" y="398" width="188" height="10" fill="#C9BDA2" />
      {/* алма ағашы, гүлдер, қақпа, қоршау */}
      <g transform="translate(96 410)"><rect x="-7" y="-150" width="14" height="150" fill={C.wood2} /><circle cx="0" cy="-180" r="60" fill={C.leaf2} /><circle cx="-36" cy="-150" r="36" fill={C.leaf} /><circle cx="34" cy="-206" r="34" fill={C.leaf} />
        {[[-30, -180], [10, -150], [30, -196], [-10, -214], [-44, -146]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" fill={C.red} />)}</g>
      {[540, 580, 620].map((x, i) => <g key={x}><path d={`M${x} 404v-24`} stroke={C.leaf2} strokeWidth="3" /><circle cx={x} cy={376} r="8" fill={[C.red, C.gold2, "#C0602F"][i]} /></g>)}
      <path d="M-40 404H840V500H-40Z" fill="#D2C3A2" />
      <path d="M400 404L330 500H470Z" fill="#E4D7B8" />
      <g transform="translate(700 404)"><rect x="0" y="-130" width="120" height="130" fill={C.blue} /><path d="M8 -122h104v114H8Z" fill="none" stroke={C.surf} strokeWidth="2" strokeDasharray="5 5" /><Horn x={60} y={-66} s={1.4} c={C.surf} /></g>
      <Actor a={{ x: 620, y: 452, s: 0.62 }}><g className="gs-kid"><Person o={KID} pose="wave" look={-0.5} seed={8} /></g></Actor>
      {/* апа */}
      <Actor a={a.npc} dur={a.npc?.dur}>
        <Person o={APA} pose={a.npc?.pose} talk={talk} mood={mood} look={a.npc?.look || 0} head={a.npc?.head} hold={a.npc?.hold} seed={1} />
        {a.npc?.gift && <g transform="translate(0 -158)"><Gift /></g>}
      </Actor>
      <g className={`gs-gift${p.gift ? " on" : ""}`}><g transform="translate(470 420)"><Gift s={1.5} /></g></g>
    </g>
  );
}

function Gift({ s = 1 }) {
  return (
    <g transform={`scale(${s})`}>
      <rect x="-26" y="-24" width="52" height="36" rx="3" fill={C.deep} /><rect x="-26" y="-30" width="52" height="10" rx="2" fill={C.red} />
      <path d="M-3 -30V12M3 -30V12" stroke={C.gold2} strokeWidth="3" /><path d="M0 -30q-14 -14 -16 -2q8 4 16 2q14 -14 16 -2q-8 4 -16 2" fill={C.gold2} />
    </g>
  );
}

/* ── Кіреберіс: аяқ киім ── */
function Hall({ st }) {
  const p = st.p;
  const shoe = (x, y, c, s = 1, k) => <g key={k} transform={`translate(${x} ${y}) scale(${s})`}><path d="M-22 0Q-24 -14 -10 -16L4 -14Q10 -6 22 -4Q26 0 22 4H-20Z" fill={c} /><path d="M-20 4H22" stroke="rgba(0,0,0,.25)" strokeWidth="3" /></g>;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="320" fill="#EFE3CC" />
      <rect x="-40" y="230" width="880" height="270" fill="#B98A57" />
      {[300, 360, 430].map((y) => <path key={y} d={`M-40 ${y}H840`} stroke="#A6784A" strokeWidth="1.4" />)}
      {/* ілгіштегі киімдер, айна */}
      <rect x="120" y="40" width="240" height="10" rx="3" fill={C.wood2} />
      {[150, 210, 270, 330].map((x, i) => <path key={x} d={`M${x} 50l-24 120h48Z`} fill={["#3A3F4E", "#7A4A21", C.deep, "#5B87A8"][i]} />)}
      <rect x="520" y="40" width="120" height="150" rx="60" fill={C.wood} /><rect x="530" y="50" width="100" height="130" rx="50" fill="#CFE3E6" /><path d="M550 80l30 -20" stroke="#fff" strokeWidth="4" opacity=".6" />
      {/* кілемше және аяқ киімдер */}
      <path d="M120 300H680L720 420H80Z" fill={C.red} /><path d="M140 310H660L692 410H108Z" fill="none" stroke={C.gold} strokeWidth="2" strokeDasharray="6 6" />
      <Horn x={180} y={370} s={1} c={C.gold} /><Horn x={620} y={370} s={1} c={C.gold} />
      {[[200, 330, "#3A3F4E"], [260, 334, "#7A4A21"], [330, 330, C.ink], [390, 336, "#C0602F", 0.7]].map(([x, y, c, s = 1], i) => <g key={i}>{shoe(x, y, c, s, "a")}{shoe(x + 6, y + 14, c, s, "b")}</g>)}
      <g className={`gs-shoe${p.shoes ? " on" : ""}`}>{shoe(500, 352, "#5E3A22", 1.2, "c")}{shoe(508, 370, "#5E3A22", 1.2, "d")}</g>
      <g transform="translate(640 380)"><path d="M-30 0q0 -14 14 -16h22q10 4 10 16Z" fill={C.teal} /><path d="M6 6q0 -14 14 -16h22q10 4 10 16Z" fill={C.teal} /></g>
    </g>
  );
}

/* ── Үй іші: дастарқан ── */
function Room({ st, talk, mood }) {
  const p = st.p, a = st.a;
  const fam = p.amin ? " gs-amin" : "";
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="320" fill="#F3E8D2" />
      <rect x="-40" y="248" width="880" height="252" fill="#9E3B2E" />
      <path d="M-40 248H840" stroke={C.wood2} strokeWidth="6" />
      {[290, 340, 410].map((y) => <path key={y} d={`M-40 ${y}H840`} stroke="#8A3226" strokeWidth="2" />)}
      {/* қабырға кілемі */}
      <g transform="translate(140 30)">
        <rect width="380" height="200" rx="4" fill={C.deep} />
        <rect x="10" y="10" width="360" height="180" fill="none" stroke={C.gold} strokeWidth="3" />
        <rect x="22" y="22" width="336" height="156" fill={C.red} />
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(${78 + i * 112} 100)`}><path d="M0 -50L44 0L0 50L-44 0Z" fill={C.deep} /><Horn x={0} y={2} s={1.2} c={C.gold2} /></g>)}
        <path d="M22 34H358M22 166H358" stroke={C.gold} strokeWidth="2" strokeDasharray="8 6" />
      </g>
      {/* жүк (сандық + көрпелер), терезе, есік */}
      <g transform="translate(-10 120)">
        {["#C0602F", C.blue, C.gold, C.green, C.red].map((c, i) => <rect key={i} x="0" y={i * 18} width="120" height="18" rx="6" fill={c} />)}
        <rect x="-4" y="90" width="128" height="50" rx="4" fill={C.wood2} /><path d="M4 100h112M4 130h112" stroke={C.gold} strokeWidth="2" /><Horn x={60} y={116} s={0.8} c={C.gold} />
      </g>
      <rect x="560" y="50" width="120" height="120" fill={C.blue} /><rect x="568" y="58" width="104" height="104" fill="#CFE6EC" /><path d="M620 58v104M568 110h104" stroke={C.blue} strokeWidth="4" />
      <path d="M556 50q30 60 10 130M684 50q-30 60 -10 130" stroke="#E9C7C2" strokeWidth="16" fill="none" />
      <rect x="704" y="90" width="96" height="164" fill={C.wood2} /><rect x="712" y="98" width="80" height="156" fill="#F6E7C6" />
      <g transform="translate(712 98)"><g className="lf-mv" style={{ transform: p.kdoor ? "scaleX(0.18) skewY(8deg)" : "none" }}><rect width="80" height="156" fill={C.wood} /><rect x="10" y="12" width="60" height="58" rx="2" fill="none" stroke={C.wood2} strokeWidth="2" strokeDasharray="4 4" /></g></g>
      <Cone x={400} y={-20} w={420} h={300} top={30} op={0.14} />
      {/* самауыр */}
      <g transform="translate(724 396)">
        <ellipse cx="0" cy="4" rx="34" ry="7" fill={C.dark} />
        <path d="M-24 0Q-32 -40 -18 -60H18Q32 -40 24 0Z" fill="#C9A24A" /><path d="M-20 -30H20" stroke="#B38A36" strokeWidth="3" />
        <rect x="-10" y="-74" width="20" height="14" rx="3" fill="#B38A36" /><Item k="teapot" x={0} y={-90} s={0.6} />
        <path d="M24 -26h12v8" stroke="#B38A36" strokeWidth="4" fill="none" />
        <g className="gs-steam"><path d="M-6 -104q-6 -10 2 -18t0 -18" stroke="#fff" strokeWidth="3" fill="none" opacity=".7" /></g>
      </g>
      {/* отбасы */}
      <g className={fam}>
        <Actor a={a.ata} dur={a.ata?.dur}><Person o={ATA} pose={a.ata?.pose} look={a.ata?.look || 0} head={a.ata?.head} seat={!!a.ata?.sit} seed={4} /></Actor>
        <Actor a={a.kel} dur={a.kel?.dur}>
          <Person o={KELIN} pose={a.kel?.pose} look={a.kel?.look || 0} head={a.kel?.head} seat={!!a.kel?.sit} seed={6} />
          {a.kel?.dish && <g transform="translate(0 -150) scale(.9)"><Tabaq /></g>}
        </Actor>
        <Actor a={a.npc} dur={a.npc?.dur}>
          <Person o={APA} pose={a.npc?.pose} talk={talk} mood={mood} look={a.npc?.look || 0} head={a.npc?.head} hold={a.npc?.hold} seat={!!a.npc?.sit && a.npc?.pose !== "walk"} seed={1} />
        </Actor>
      </g>
      {/* дөңгелек үстел: отырғанда төменнен көтеріледі */}
      <g className="lf-mv" style={{ transform: p.table ? "none" : "translate(400px, 560px) scale(1.5) translate(-400px, -440px)", transitionDuration: "1s" }}>
        <ellipse cx="400" cy="440" rx="380" ry="74" fill={C.wood2} />
        <ellipse cx="400" cy="430" rx="370" ry="70" fill={C.surf} />
        <ellipse cx="400" cy="430" rx="350" ry="62" fill="none" stroke={C.red} strokeWidth="6" />
        <ellipse cx="400" cy="430" rx="336" ry="56" fill="none" stroke={C.gold} strokeWidth="1.6" strokeDasharray="6 6" />
        {/* тәттілер, нан */}
        <g transform="translate(560 400)"><ellipse rx="34" ry="10" fill={C.blue} /><ellipse cy="-3" rx="28" ry="7" fill={C.surf} />{[[-14, -6, C.red], [-2, -9, C.gold2], [10, -6, C.green], [4, -3, "#C0602F"], [-8, -2, C.blue]].map(([x, y, c], i) => <rect key={i} x={x - 4} y={y - 3} width="8" height="6" rx="2" fill={c} />)}</g>
        <g transform="translate(240 420)"><Item k="bread" s={0.9} /></g>
        <g className="lf-mv" style={{ transform: p.baur ? "translate(20px, 22px)" : "none" }}><g transform="translate(320 414)"><Baursak /></g></g>
        <g className="lf-mv" style={{ transform: p.salad ? "translate(-30px, 26px)" : "none" }}><g transform="translate(620 430)">
          <ellipse rx="40" ry="12" fill={C.surf} stroke="#CFC6B2" strokeWidth="2" /><path d="M-30 -2q30 -24 60 0Z" fill={C.leaf} />{[[-16, -6], [0, -10], [14, -5]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill={C.red} />)}<circle cx="6" cy="-4" r="4" fill={C.gold2} />
        </g></g>
        <g className={`gs-on${p.meat ? " on" : ""}`}><g transform="translate(420 420)"><Tabaq /><g className="gs-steam"><path d="M-10 -34q-6 -10 2 -18t0 -18M14 -32q-5 -9 2 -16" stroke="#fff" strokeWidth="3" fill="none" opacity=".8" /></g></g></g>
        {/* біздің кесе: сүтті шай, жартылай */}
        <g className={`gs-on${p.tea ? " on" : ""}`}><g transform="translate(500 432)">
          <path d="M-22 -18H22L16 10H-16Z" fill={C.surf} stroke={C.blue} strokeWidth="3" /><path d="M-20 -12H20" stroke={C.blue} strokeWidth="2.4" strokeDasharray="4 3" />
          <ellipse cx="0" cy="-18" rx="22" ry="5" fill={C.surf} />
          <g className={`gs-fill${p.pour ? " on" : ""}`}><ellipse cx="0" cy="-15" rx="18" ry="4" fill="#C9A27A" /></g>
          <g className="gs-steam"><path d="M-4 -26q-6 -8 2 -14t0 -14" stroke="#fff" strokeWidth="3" fill="none" opacity=".8" /></g>
        </g></g>
      </g>
    </g>
  );
}

function Baursak() {
  return (
    <g><ellipse rx="44" ry="13" fill={C.blue} /><ellipse cy="-3" rx="38" ry="10" fill={C.surf} />
      {[[-22, -8], [-6, -12], [10, -9], [24, -6], [-12, -2], [4, -3], [-2, -18], [14, -16]].map(([x, y], i) => <g key={i}><rect x={x - 8} y={y - 7} width="16" height="13" rx="5" fill="#D9963E" /><rect x={x - 6} y={y - 6} width="9" height="5" rx="2" fill="#EDB55C" /></g>)}</g>
  );
}
function Tabaq() {
  return (
    <g><ellipse rx="70" ry="20" fill={C.blue} /><ellipse cy="-3" rx="62" ry="16" fill={C.surf} /><ellipse cy="-3" rx="54" ry="13" fill="none" stroke={C.blue} strokeWidth="1.6" strokeDasharray="4 4" />
      <ellipse cy="-6" rx="48" ry="11" fill="#F3E2B8" /><path d="M-40 -6l14 -4 12 6 14 -6 14 6 14 -4" stroke="#E2C88E" strokeWidth="3" fill="none" />
      {[[-24, -12], [-6, -16], [12, -13], [28, -10], [2, -8], [-14, -6]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="11" ry="7" fill={i % 2 ? "#8A4A2A" : "#A35E36"} />)}
      {[[-18, -18], [10, -20], [24, -15]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="6" ry="3" fill="none" stroke="#F4F1E6" strokeWidth="2" />)}
      <path d="M-4 -20q2 -6 6 -2" stroke={C.leaf} strokeWidth="2" fill="none" /></g>
  );
}

function Stage({ st, talk, mood }) {
  return (
    <>
      <g className={`lf-set${st.set === "out" ? "" : " off"}`}><Yard st={st} talk={talk} mood={mood} /></g>
      <g className={`lf-set${st.set === "hall" ? "" : " off"}`}><Hall st={st} /></g>
      <g className={`lf-set${st.set === "in" ? "" : " off"}`}><Room st={st} talk={talk} mood={mood} /></g>
    </>
  );
}

const A = (patch, more = {}) => ({ a: { npc: patch, ...more } });
const sitI = (extra = {}) => A({ pose: "hands", sit: true, head: null, hold: null, look: 0, ...extra });
// Үйге кіру: аяқ киім шешу → бөлмеге кіріп, төрге отыру (апа самауыр жанына, ата қарсы жаққа отырады)
const goIn = [
  beat(300, A({ pose: "point", face: -1, look: -0.3, head: null, gift: false })),
  beat(900, { cam: "gate", walk: true, camMs: 900 }),
  beat(380, { dip: true }),
  beat(60, { set: "hall", cam: "shoes", camMs: 0, walk: false }),
  beat(500, { dip: false }),
  beat(900, { p: { shoes: true } }),
  beat(380, { dip: true }),
  beat(60, { set: "in", cam: "entry", camMs: 0, a: { npc: { at: "host", sit: true, pose: "hands", look: 0.2 }, ata: { at: "ata", sit: true, pose: "hands", look: 0.4 } } }),
  beat(600, { dip: false }),
  beat(1300, { cam: "aisle", walk: true }),
  beat(1000, { walk: false, cam: "seat", camMs: 1000, p: { table: true } }),
];

export default {
  spots,
  shots,
  dip: "#F3E8D2",
  init: { set: "out", cam: "wide", p: { door: false }, a: { npc: { at: "inside", pose: "stand", hide: true }, ata: { at: "ataDoor", pose: "stand", hide: true }, kel: { at: "kdoor", pose: "stand", hide: true } } },
  intro: [
    beat(900),
    beat(1600, { cam: "gate", walk: true }),
    beat(400, { walk: false }),
    beat(500, { p: { door: true }, a: { npc: { hide: false }, ata: { hide: false } } }),
    beat(0, { cam: "porch", camMs: 1100 }),
    ...walkTo("npc", "porch", 1100, "hands"),
    beat(300, A({ look: 0.1 }, { ata: { pose: "hands", head: "nod" } })),
  ],
  acts: {
    talk: [beat(300, sitI()), say(), free()],
    welcome: [beat(200, A({ pose: "wave", head: null, look: 0 })), say(900), beat(0, A({ pose: "hands" })), free()],
    gift: [beat(700, { p: { gift: true } }), beat(500, A({ pose: "give", face: -1, look: -0.3 })), beat(300, { p: { gift: false }, ...A({ pose: "carry", gift: true, head: "nod" }) }), say(), free()],
    sit: [...goIn, beat(400, sitI({ hold: "teapot", look: 0 })), say(), free()],
    tea: [beat(300, sitI({ hold: "teapot" })), beat(400, A({ pose: "pour", sit: true, hold: "teapot", look: -0.4 })), beat(500, { p: { tea: true } }), beat(900, { p: { pour: true } }),
      beat(300, sitI()), beat(400, A({ pose: "give", face: -1, sit: true, look: -0.2 })), say(300, { p: { baur: 2 } }), beat(400, sitI()), free()],
    meat: [beat(200, { p: { kdoor: true }, a: { kel: { hide: false, pose: "carry", dish: true } } }),
      beat(1300, { a: { kel: { at: "kmid", pose: "walk", dur: 1300 }, npc: { pose: "hands", sit: true, look: 0.6 } }, p: { kdoor: false } }),
      beat(500, { a: { kel: { pose: "give", face: -1, look: -0.3 } } }),
      beat(400, { p: { meat: true }, a: { kel: { pose: "hands", dish: false, head: "nod" } } }),
      beat(200, A({ pose: "give", face: -1, sit: true, look: 0 })), say(500),
      beat(1300, { a: { kel: { at: "kdoor", pose: "walk", dur: 1300, head: null } } }), beat(0, { a: { kel: { hide: true } } }), beat(0, sitI()), free()],
    salad: [beat(300, A({ pose: "give", face: -1, sit: true, head: "tilt", look: 0 })), say(300, { p: { salad: 2 } }), beat(400, sitI()), free()],
    more: [beat(300, sitI({ hold: "teapot", head: "tilt" })), say(), free()],
    pour: [beat(300, { p: { pour: false } }), beat(500, A({ pose: "pour", sit: true, hold: "teapot", look: -0.4, head: null })), beat(900, { p: { pour: true } }), beat(0, sitI({ head: "nod" })), say(), free()],
    bata: [beat(300, sitI({ look: -0.6 })), beat(400, { a: { ata: { pose: "hands", sit: true, look: 0, head: "up" } } }), say(400, { hand: "bata" }), free()],
    amin: [beat(200, { hand: null, p: { amin: true } }), beat(2300, { a: { ata: { head: null } } }), beat(0, { p: { amin: false }, ...sitI({ head: "nod" }) }), say(), free()],
    bye: [beat(300, A({ pose: "wave", sit: true, head: "nod", look: 0 }, { ata: { pose: "hands", sit: true, head: "nod" } })), say(1200), free(), beat(1000, { cam: "rise", camMs: 1200 })],
  },
  script: {
    "guest-dastarkhan": { n1: "welcome", g2: "gift", n2: "sit", n3: "tea", n4: "meat", v5: "salad", n5: "more", t5: "pour", n6: "bata", n7: "amin", fin: "bye" },
  },
  css: `
.gs-on{opacity:0;transform:translateY(-14px);transition:opacity .35s ease,transform .5s cubic-bezier(.3,1.3,.5,1)}
.gs-on.on{opacity:1;transform:none}
.gs-gift{opacity:0;transform:translateY(120px);transition:transform .7s cubic-bezier(.3,1.2,.4,1),opacity .3s}.gs-gift.on{opacity:1;transform:none}
.gs-shoe{opacity:0;transform:translateY(60px);transition:transform .7s ease-out,opacity .4s}.gs-shoe.on{opacity:1;transform:none}
.gs-fill{transform-box:fill-box;transform-origin:50% 50%;transform:scale(.4);opacity:.4;transition:transform 1s ease-out,opacity .6s}.gs-fill.on{transform:none;opacity:1}
.gs-steam{animation:gs-steam 2.6s ease-in-out infinite}
.gs-kid .lf-fa.r{animation-duration:.5s}
.gs-amin .lf-ua.l{animation:gs-ual 2.2s ease-in-out both}.gs-amin .lf-fa.l{animation:gs-fal 2.2s ease-in-out both}
.gs-amin .lf-ua.r{animation:gs-uar 2.2s ease-in-out both}.gs-amin .lf-fa.r{animation:gs-far 2.2s ease-in-out both}
@keyframes gs-ual{0%{transform:rotate(16deg)}35%{transform:rotate(-158deg)}70%{transform:rotate(-132deg)}100%{transform:rotate(14deg)}}
@keyframes gs-fal{0%{transform:rotate(-64deg)}35%{transform:rotate(22deg)}70%{transform:rotate(30deg)}100%{transform:rotate(-80deg)}}
@keyframes gs-uar{0%{transform:rotate(-16deg)}35%{transform:rotate(158deg)}70%{transform:rotate(132deg)}100%{transform:rotate(-14deg)}}
@keyframes gs-far{0%{transform:rotate(64deg)}35%{transform:rotate(-22deg)}70%{transform:rotate(-30deg)}100%{transform:rotate(80deg)}}
@keyframes gs-steam{0%,100%{opacity:0;transform:translateY(4px)}40%{opacity:.85}80%{opacity:0;transform:translateY(-8px)}}
`,
  Stage,
};
