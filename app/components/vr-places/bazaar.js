// VR өмір: БАЗАР. Көше → базар қақпасы → ашық аспан астындағы дүңгіршектер қатарымен жүреміз → Ерлан аға жәшіктерді реттеп тұр,
// бұрылып, сөресіне келеді. Әр түйін: алманы көрсету, баға тақтасы, саудаласу (баға 550-ге ауысады), таразыға тарту (екі келі),
// қызанақ, есептеу, телефонмен аудару немесе қолма-қол ақша мен қайтарым, пакеттерді беру.
import { C, ST, Box, Pool, Shadow, Item, Person, Actor, Passerby, Horn, walkTo, beat, say, free } from "./kit";

const SELLER = { skin: 2, hair: "#1E1A1A", hs: "cap", cap: "#2F3A34", top: "#C0602F", vest: C.navy, tache: true };
const S1 = { f: true, skin: 1, hair: "#2B1A12", hs: "scarf", scarf: C.leaf, top: "#7A4A21", apron: C.surf };
const S2 = { skin: 0, hair: "#3B2416", hs: "short", top: C.blue, apron: C.gold };
const B1 = { f: true, skin: 0, hair: "#4E2F1B", hs: "long", top: "#9B3B30" };
const B2 = { skin: 1, hair: "#2B1A12", hs: "cap", cap: C.red, top: "#5B87A8" };
const B3 = { f: true, skin: 2, hair: "#1E1A1A", hs: "scarf", scarf: C.gold, top: C.teal };
const B4 = { skin: 0, hair: "#3B2416", hs: "short", top: C.green, glasses: true };

const spots = {
  back: { x: 640, y: 330, s: 0.78 },
  stall: { x: 500, y: 384, s: 0.96 },
  crate: { x: 330, y: 384, s: 0.96 },
  scale: { x: 560, y: 384, s: 0.96 },
};
const shots = {
  wide: { x: 400, y: 236, z: 1, a: "m" },
  gate: { x: 400, y: 250, z: 1.6, a: "m" },
  through: { x: 400, y: 250, z: 3.6, a: "m" },
  entry: { x: 400, y: 214, z: 1.12, a: "m" },
  walk: { x: 410, y: 234, z: 1.06 },
  front: { x: 410, y: 232, z: 1.03 },
};

// Жолақ шатыр: жолақтар + толқынды жиек
function Awning({ x, y, w, h = 34, a = C.red, b = C.surf }) {
  const n = Math.max(4, Math.round(w / 26)), sw = w / n;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => <path key={i} d={`M${x + i * sw} ${y}h${sw}l${sw * 0.12} ${h}h${-sw * 1.12}Z`} fill={i % 2 ? b : a} />)}
      <path d={`M${x - 4} ${y + h}${Array.from({ length: n }, () => `q${sw / 2} 12 ${sw} 0`).join("")}`} fill={a} />
    </g>
  );
}
const Fruit = ({ x, y, n = 5, c = "#C8392E", c2 = "#E04A3A", r = 9 }) => (
  <g>{Array.from({ length: n }, (_, i) => <circle key={i} cx={x + i * r * 1.7 - (n * r * 1.7) / 2 + r} cy={y - (i % 2) * r * 0.6} r={r} fill={i % 3 === 1 ? c2 : c} />)}</g>
);
function Crate({ x, y, w = 92, kind = "ap" }) {
  const cfg = { ap: ["#C8392E", "#E04A3A", 11], gr: ["#8DB34A", "#A8C85A", 11], tm: ["#D9452F", "#EC5B3E", 10], cu: ["#3F7A3A", "#4E8E44", 7] }[kind];
  return (
    <g>
      {[0, 1].map((r) => <Fruit key={r} x={x + w / 2} y={y - 4 - r * 12} n={r ? 4 : 5} c={cfg[0]} c2={cfg[1]} r={cfg[2]} />)}
      {kind === "ap" && <path d={`M${x + 30} ${y - 30}l3 -6M${x + 58} ${y - 24}l3 -6`} stroke={C.thread} strokeWidth="2" />}
      <rect x={x} y={y} width={w} height="30" rx="3" fill={C.wood} />
      <path d={`M${x} ${y + 10}h${w}M${x} ${y + 20}h${w}`} stroke={C.wood2} strokeWidth="2" />
    </g>
  );
}
// Ұстап тұрған зат (өз заттарымыз): қол тұсындағы нүкте позаға байланысты
const HAND = { give: [116, -132], carry: [22, -134], walk: [22, -134], walkz: [22, -134], hands: [33, -118], stand: [63, -104] };
function Held({ w }) {
  const k = w?.hold, at = HAND[w?.pose];
  if (!k || !String(k).startsWith("bz-") || !at) return null;
  return (
    <g className="bz-held" style={{ transform: `translate(${at[0]}px, ${at[1]}px)` }}>
      {k === "bz-apple" && <><circle r="15" fill="#C8392E" /><circle cx="-5" cy="-5" r="5" fill="#E86A5A" /><path d="M0 -14l3 -8" stroke={C.thread} strokeWidth="3" /><path d="M3 -18q10 -6 14 2q-8 4 -14 -2Z" fill={C.leaf} /></>}
      {(k === "bz-bag" || k === "bz-tbag") && <Bag k={k === "bz-bag" ? "ap" : "tm"} />}
    </g>
  );
}
const Bag = ({ k }) => (
  <g>
    <path d="M-30 -30H30L34 26Q34 34 26 34H-26Q-34 34-34 26Z" fill="#F4F1E6" opacity=".92" stroke="#D2CBBB" strokeWidth="2" />
    <Fruit x={0} y={18} n={4} r={10} c={k === "ap" ? "#C8392E" : "#D9452F"} c2={k === "ap" ? "#8DB34A" : "#EC5B3E"} />
    <Fruit x={0} y={2} n={3} r={10} c={k === "ap" ? "#E04A3A" : "#D9452F"} />
    <path d="M-22 -30q-4 -18 8 -18M22 -30q4 -18 -8 -18" stroke="#D2CBBB" strokeWidth="3" fill="none" />
  </g>
);

/* ── Көше: базар қақпасы ── */
function Gate() {
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="320" fill="#CFE6EC" />
      <path d="M-40 230L60 150L140 196L240 120L340 190L430 136L540 200L640 128L760 196L840 160V280H-40Z" fill="#B7CCD5" />
      <path d="M216 138l24 -18l24 18l-12 -4l-12 8l-10 -6ZM616 146l24 -18l24 18l-12 -4l-12 8Z" fill="#fff" opacity=".8" />
      {/* қақпа ішінен көрінетін дүңгіршектер */}
      <rect x="250" y="160" width="300" height="230" fill="#E9D7B6" />
      <Awning x={262} y={200} w={130} h={26} a={C.red} />
      <Awning x={408} y={196} w={130} h={26} a={C.blue} />
      <rect x="262" y="236" width="130" height="70" fill={C.wood2} /><rect x="408" y="232" width="130" height="74" fill={C.wood2} />
      <Fruit x={327} y={250} n={6} r={8} /><Fruit x={473} y={248} n={6} r={8} c="#E9B44C" c2="#F2C14E" />
      <rect x="258" y="300" width="284" height="14" fill={C.wood} />
      <Passerby o={B1} y={372} s={0.42} x0={240} x1={560} d={14} delay={-4} seed={2} />
      <Passerby o={B4} y={380} s={0.44} x0={560} x1={240} d={17} delay={-9} seed={5} />
      {/* қақпа */}
      <path d="M190 390V120H250V390ZM550 390V120H610V390Z" fill="#2C7A78" />
      <path d="M198 130H242V382H198ZM558 130H602V382H558Z" fill="none" stroke={ST} strokeWidth="1.6" strokeDasharray="5 5" />
      {[170, 240, 310].map((y) => <g key={y}><Horn x={220} y={y} s={0.8} c={C.gold} /><Horn x={580} y={y} s={0.8} c={C.gold} /></g>)}
      <path d="M176 120H624V160Q400 120 176 160Z" fill={C.blue2} />
      <Box x={170} y={40} w={460} h={80} r={10} c={C.blue} sh="rgba(15,40,50,.3)" />
      <path d="M400 18l20 22H380Z" fill={C.gold} />
      <text x="400" y="96" textAnchor="middle" fontSize="40" fontWeight="700" letterSpacing="10" fill={C.cream} style={{ fontFamily: "var(--head)" }}>БАЗАР</text>
      <Horn x={232} y={82} s={0.8} c={C.gold} /><Horn x={568} y={82} s={0.8} c={C.gold} />
      {/* қоршау, ағаштар, арба */}
      <rect x="-40" y="250" width="230" height="140" fill="#D8C29C" /><rect x="610" y="250" width="230" height="140" fill="#D8C29C" />
      {[-30, 30, 90, 150, 620, 680, 740, 800].map((x) => <rect key={x} x={x} y="262" width="36" height="20" rx="3" fill="#C9AF84" />)}
      {[70, 730].map((x) => (
        <g key={x} className="bz-tree" style={{ transformOrigin: `${x}px 390px` }}>
          <rect x={x - 5} y="270" width="10" height="120" fill={C.wood2} />
          <circle cx={x} cy="240" r="48" fill={C.leaf2} /><circle cx={x - 26} cy="262" r="30" fill={C.leaf} /><circle cx={x + 24} cy="220" r="28" fill={C.leaf} />
        </g>
      ))}
      <rect x="-40" y="388" width="880" height="110" fill="#CDBFA6" />
      <path d="M-40 388h880" stroke="#B3A386" strokeWidth="4" />
      {[-20, 70, 160, 250, 340, 430, 520, 610, 700, 790].map((x) => <path key={x} d={`M${x} 392l-26 70`} stroke="#BBAA8C" strokeWidth="2" />)}
      <g transform="translate(640 404)">
        <rect x="0" y="-36" width="86" height="34" rx="4" fill={C.wood} />
        <Fruit x={43} y={-40} n={5} r={9} c="#E9B44C" c2="#C8392E" />
        <circle cx="16" cy="2" r="9" fill={C.ink} /><circle cx="70" cy="2" r="9" fill={C.ink} />
        <path d="M86 -30l26 -18" stroke={C.wood2} strokeWidth="5" strokeLinecap="round" />
      </g>
      <Passerby o={B3} y={450} s={0.64} x0={-80} x1={900} d={19} delay={-6} seed={3} />
      <Passerby o={B2} y={460} s={0.66} x0={900} x1={-80} d={23} delay={-15} seed={7} />
    </g>
  );
}

/* ── Базар іші ── */
function Market({ st, talk, mood }) {
  const p = st.p, w = st.a.npc;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="300" fill="#CFE6EC" />
      <path d="M-40 120L80 60L200 110L330 40L470 100L600 50L740 110L840 80V200H-40Z" fill="#B7CCD5" />
      {/* артқы қатар дүңгіршектер */}
      {[[-30, C.red, "#E9B44C"], [180, C.green, "#C8392E"], [390, C.blue, "#8DB34A"], [600, C.red, "#F2C14E"]].map(([x, c, f], i) => (
        <g key={x}>
          <rect x={x + 6} y="92" width="8" height="190" fill={C.wood2} /><rect x={x + 186} y="92" width="8" height="190" fill={C.wood2} />
          <Awning x={x} y={84} w={200} h={30} a={c} />
          <rect x={x + 10} y="208" width="180" height="70" fill={C.wood2} />
          <rect x={x + 6} y="200" width="188" height="12" rx="3" fill={C.wood} />
          <Fruit x={x + 100} y={196} n={8} r={9} c={f} c2={i % 2 ? "#E04A3A" : "#F2C14E"} />
          {i === 0 && [30, 60, 90, 120].map((dx) => <path key={dx} d={`M${x + dx} 116v20`} stroke="#E9C46A" strokeWidth="9" strokeLinecap="round" />)}
          {i === 2 && [40, 70, 100, 130, 160].map((dx) => <path key={dx} className="bz-sway" style={{ transformOrigin: `${x + dx}px 116px` }} d={`M${x + dx} 116q-6 18 0 30`} stroke="#C8392E" strokeWidth="7" strokeLinecap="round" fill="none" />)}
        </g>
      ))}
      {/* фондағы сатушылар мен сатып алушылар */}
      <g className="bz-weigh"><Actor a={{ x: 290, y: 236, s: 0.46 }}><Person o={S1} pose="type" look={0.3} seed={6} /></Actor></g>
      <Actor a={{ x: 360, y: 300, s: 0.52, face: -1 }}><Person o={B1} pose="hands" look={-0.6} seed={8} /></Actor>
      <g className="bz-call"><Actor a={{ x: 700, y: 236, s: 0.46 }}><Person o={S2} pose="stand" look={-0.4} seed={4} /></Actor></g>
      <path d="M-40 262H840V500H-40Z" fill="#D7C9AC" />
      {[290, 330, 390].map((y) => <path key={y} d={`M-40 ${y}H840`} stroke="#C8B894" strokeWidth="1.6" />)}
      <Passerby o={B3} y={322} s={0.6} x0={-80} x1={880} d={17} delay={-3} seed={3} />
      <Passerby o={B4} y={330} s={0.62} x0={880} x1={-80} d={21} delay={-11} seed={5} />
      <Passerby o={B2} y={318} s={0.58} x0={-80} x1={880} d={25} delay={-19} seed={9} />
      {/* біздің дүңгіршек: жақындағанда үлкейеді */}
      <g className="lf-mv bz-near" style={{ transform: p.near ? "none" : "translate(400px, 200px) scale(0.8) translate(-400px, -200px)" }}>
        <rect x="206" y="-10" width="10" height="350" fill={C.wood2} /><rect x="684" y="-10" width="10" height="350" fill={C.wood2} />
        <g className="bz-flap"><Awning x={190} y={-14} w={520} h={46} a={C.deep} b={C.goldS} /></g>
        {[260, 330, 400, 470, 540, 610].map((x, i) => <g key={x}><path d={`M${x} 42v${14 + (i % 2) * 8}`} stroke={C.thread} strokeWidth="1.6" /><circle cx={x} cy={60 + (i % 2) * 8} r="6" fill="#FFF3C8" /></g>)}
        <Actor a={w} dur={w?.dur}>
          <Person o={SELLER} pose={w?.pose} talk={talk} mood={mood} look={w?.look || 0} head={w?.head} hold={w?.hold} holdL={w?.holdL} seed={2} />
          <Held w={w} />
        </Actor>
        {/* сөре: жәшіктер, баға, таразы */}
        <path d="M210 330H690L706 470H194Z" fill={C.wood2} />
        <path d="M222 344H678V462H222Z" fill="none" stroke={ST} strokeWidth="1.5" strokeDasharray="5 5" />
        <Horn x={450} y={404} s={1.2} c={C.gold} />
        <rect x="200" y="318" width="500" height="18" rx="4" fill={C.wood} />
        <Crate x={226} y={292} kind="ap" /><Crate x={324} y={292} kind="gr" />
        <Crate x={424} y={296} w={78} kind="tm" /><Crate x={508} y={298} w={66} kind="cu" />
        <g className={`bz-tag${p.hl ? " hl" : ""}`} transform="translate(270 288)">
          <path d="M0 0V-30" stroke={C.thread} strokeWidth="2" />
          <rect x="-34" y="-58" width="68" height="32" rx="4" fill={C.surf} stroke={C.deep} strokeWidth="2" />
          <text y="-36" textAnchor="middle" fontSize="15" fontWeight="800" fill={C.deep}>{p.price || "600"} тг</text>
        </g>
        <g transform="translate(372 288)"><path d="M0 0V-24" stroke={C.thread} strokeWidth="2" /><rect x="-30" y="-50" width="60" height="28" rx="4" fill={C.surf} /><text y="-31" textAnchor="middle" fontSize="13" fontWeight="800" fill={C.green}>500 тг</text></g>
        {/* таразы: табақ салмақпен төмен түседі, экранда — келі */}
        <g transform="translate(650 318)">
          <rect x="-34" y="-20" width="68" height="20" rx="4" fill="#DCE3E4" />
          <rect x="-26" y="-16" width="40" height="12" rx="2" fill="#2E3440" />
          <text x="-6" y="-6.5" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#9FD3B4">{p.kg || "0,000"}</text>
          <g className="lf-mv" style={{ transform: p.pan ? "translateY(4px)" : "none" }}>
            <rect x="-4" y="-34" width="8" height="14" fill="#B8C6C8" />
            <ellipse cx="0" cy="-36" rx="38" ry="7" fill="#B8C6C8" />
            <g className={`bz-on${p.pan ? " on" : ""}`}><g transform="translate(0 -70) scale(.9)"><Bag k={p.pan === "tm" ? "tm" : "ap"} /></g></g>
          </g>
        </g>
        <g transform="translate(560 350)"><rect x="-22" y="-30" width="44" height="46" rx="5" fill={C.surf} stroke="#D2CBBB" strokeWidth="2" /><g fill={C.ink}><rect x="-14" y="-22" width="10" height="10" /><rect x="4" y="-22" width="10" height="10" /><rect x="-14" y="-4" width="10" height="10" /><rect x="6" y="-2" width="4" height="4" /><rect x="10" y="2" width="4" height="4" /></g><rect x="-22" y="10" width="44" height="6" rx="2" fill={C.red} /></g>
        <g className={`bz-on${p.bag1 ? " on" : ""}${p.gone ? " gone" : ""}`}><g transform="translate(470 330)"><Bag k="ap" /></g></g>
        <g className={`bz-on${p.bag2 ? " on" : ""}${p.gone ? " gone" : ""}`}><g transform="translate(400 336) scale(.9)"><Bag k="tm" /></g></g>
        <g className={`bz-on${p.note ? " on" : ""}`}><Item k="note" x={330} y={336} s={1} r={-8} /></g>
        <g className={`bz-on${p.coins ? " on" : ""}`}><Item k="coins" x={540} y={338} s={1.3} /></g>
      </g>
      {p.paid && <g className="bz-paid"><circle cx="520" cy="250" r="20" fill="#2F8F5B" /><path d="M510 250l7 7 13-14" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" /></g>}
    </g>
  );
}

function Stage({ st, talk, mood }) {
  return (
    <>
      <g className={`lf-set${st.set === "out" ? "" : " off"}`}><Gate /></g>
      <g className={`lf-set${st.set === "in" ? "" : " off"}`}><Market st={st} talk={talk} mood={mood} /></g>
    </>
  );
}

const A = (patch) => ({ a: { npc: patch } });
// Жәшіктен пакетке салып, таразыға тарту, сосын сөреге қою
const weigh = (bag, kind, kg, put) => [
  beat(200, A({ head: null, look: 0, hold: null })),
  ...walkTo("npc", "crate", 900, "hands", { look: -0.3 }),
  beat(700, A({ head: "down" })),
  beat(300, A({ pose: "carry", hold: bag, head: null })),
  ...walkTo("npc", "scale", 1000, "give", { hold: bag }),
  beat(250, { p: { pan: kind, kg: "0,000" }, ...A({ pose: "hands", hold: null, look: 0.6 }) }),
  beat(900, { p: { kg } }),
  beat(400, A({ head: "nod" })),
  beat(300, { p: { pan: null, kg: "0,000", [put]: true }, ...A({ head: null, look: 0 }) }),
  ...walkTo("npc", "stall", 500, "hands"),
];

export default {
  spots,
  shots,
  dip: "#FFF3D6",
  init: { set: "out", cam: "wide", p: { near: false }, a: { npc: { at: "back", pose: "carry", hold: "bz-bag", look: 0.6 } } },
  intro: [
    beat(900),
    beat(1700, { cam: "gate", walk: true }),
    beat(1000, { cam: "through", walk: true }),
    beat(380, { dip: true }),
    beat(60, { set: "in", cam: "entry", camMs: 0 }),
    beat(600, { dip: false }),
    beat(1700, { cam: "walk", walk: true, p: { near: true }, ...A({ pose: "hands", hold: null, head: "down" }) }),
    beat(500, { walk: false, cam: "front", camMs: 800, ...A({ pose: "stand", head: null, look: -0.4 }) }),
    ...walkTo("npc", "stall", 1100, "hands"),
  ],
  acts: {
    talk: [beat(250, A({ pose: "hands", hold: null, head: null, look: 0 })), say(), free()],
    call: [beat(500, A({ pose: "give", face: -1, hold: "bz-apple", head: null, look: 0 })), say(1500), beat(400, A({ pose: "wave", hold: null })), beat(0, A({ pose: "hands" })), free()],
    price: [beat(450, { p: { hl: true }, ...A({ pose: "point", face: -1, look: -0.6, head: null }) }), say(1300), beat(0, { p: { hl: false }, ...A({ pose: "hands", look: 0 }) }), free()],
    haggle: [beat(900, A({ pose: "hands", head: "shake", look: 0 })), beat(500, A({ head: "tilt" })), beat(300, A({ pose: "point", face: -1, look: -0.6, head: null })), say(900, { p: { price: "550", hl: true } }), beat(0, { p: { hl: false }, ...A({ pose: "hands", look: 0, head: "nod" }) }), free()],
    weigh: [...weigh("bz-bag", "ap", "2,000", "bag1"), say(), free()],
    tomato: [...weigh("bz-tbag", "tm", "1,000", "bag2"), say(), free()],
    count: [beat(1500, A({ pose: "write", hold: "pen", holdL: "pad", head: "down", look: -0.2 })), say(1000, A({ head: null, look: 0 })), beat(0, A({ pose: "hands", hold: null, holdL: null })), free()],
    number: [beat(700, A({ pose: "phone", hold: "phone", head: null })), say(600), beat(200, { hand: "phone" }), free()],
    change: [beat(900, { hand: "note" }), beat(400, { hand: null, p: { note: true } }), beat(500, { p: { note: false }, ...A({ pose: "give", face: -1, hold: "note", head: null }) }),
      beat(700, A({ pose: "hands", hold: null, head: "down" })), beat(400, A({ pose: "give", face: -1, hold: "coins", head: null })), say(400, { p: { coins: true }, ...A({ hold: null }) }), beat(0, A({ pose: "hands" })), free()],
    bye: ({ st }) => [
      ...(st.hand === "phone" ? [beat(900, A({ pose: "phone", hold: "phone", head: "down" })), beat(400, { p: { paid: true }, hand: null, ...A({ head: "nod" }) })] : []),
      beat(500, A({ pose: "give", face: -1, hold: "bz-bag", head: null })), beat(400, { p: { gone: true }, ...A({ hold: null }) }),
      beat(300, { hand: null, ...A({ pose: "wave", head: "nod" }) }), say(), free(),
    ],
  },
  script: {
    "bazaar-apples": { n1: "call", n2: "price", b3: "haggle", n3: "weigh", n4: "tomato", n5: "count", n6: "number", c6: "change", fin: "bye" },
  },
  css: `
.bz-held{transform-box:view-box;transform-origin:0 0;transition:transform .42s cubic-bezier(.3,.7,.3,1);animation:bz-in .3s ease both}
.bz-on{opacity:0;transform:translateY(-16px);transition:opacity .35s ease,transform .45s cubic-bezier(.3,1.3,.5,1)}
.bz-on.on{opacity:1;transform:none}
.bz-on.on.gone{opacity:0;transform:translateY(90px) scale(1.2);transition-duration:.6s}
.bz-near{transition-duration:1.7s!important}
.bz-tag{transition:opacity .3s}.bz-tag.hl{animation:bz-pulse .6s ease-in-out 3}
.bz-flap{animation:bz-flap 5s ease-in-out infinite;transform-origin:450px -14px}
.bz-sway{animation:bz-sway 3.4s ease-in-out infinite}
.bz-tree{animation:bz-sway 6s ease-in-out infinite}
.bz-weigh .lf-fa.r{animation:lf-tap .9s ease-in-out infinite alternate}
.bz-call .lf-ua.r{animation:bz-wv 7s ease-in-out infinite}
.bz-call .lf-mouth{opacity:1;animation:lf-talk .27s ease-in-out infinite alternate,bz-chat 7s steps(1) infinite}
.bz-paid{transform-box:fill-box;transform-origin:50% 50%;animation:vr-stamp .5s ease-out both}
@keyframes bz-in{from{opacity:0}to{opacity:1}}
@keyframes bz-pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes bz-flap{0%,100%{transform:skewX(0deg) scaleY(1)}50%{transform:skewX(1.2deg) scaleY(.97)}}
@keyframes bz-sway{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
@keyframes bz-wv{0%,60%,100%{transform:rotate(-9deg)}68%,90%{transform:rotate(-150deg)}}
@keyframes bz-chat{0%{opacity:1}50%{opacity:0}}
`,
  Stage,
};
