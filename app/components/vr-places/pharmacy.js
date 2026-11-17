// VR өмір: ДӘРІХАНА. Жасыл айқышы жыпылықтаған есік → таза, жарық зал: сөрелер толы қорап, витрина → Мадина сөрені реттеп тұр,
// бұрылып, сатушы орнына келеді. Әр түйін: сұрау, сөреден дәрі (не шәрбат) алып, қорапқа ішу мөлшерін жазу, кассадағы баға,
// рецепт керек емес (басын шайқайды), маска, терминал мен картамен төлеу.
import { C, ST, Box, Cone, Pool, Shadow, Item, Person, Actor, Passerby, walkTo, beat, say, free } from "./kit";

const PHARM = { f: true, skin: 0, hair: "#2B1A12", hs: "bun", top: "#FFFFFF", coat: true, shirt: C.teal, badge: C.green };
const CU = { skin: 1, hair: "#3B2416", hs: "short", top: "#7A4A21", glasses: true };
const P1 = { f: true, skin: 2, hair: "#1E1A1A", hs: "scarf", scarf: C.red, top: "#5B87A8" };
const P2 = { skin: 0, hair: "#4E2F1B", hs: "cap", cap: C.navy, top: C.green };
const MINT = "#DDEFE6", GRN = "#2F8F5B";

const spots = { shelf: { x: 650, y: 384, s: 0.96 }, desk: { x: 500, y: 384, s: 0.96 } };
const shots = {
  wide: { x: 400, y: 236, z: 1, a: "m" },
  door: { x: 400, y: 282, z: 1.85, a: "m" },
  through: { x: 400, y: 300, z: 4.4, a: "m" },
  entry: { x: 400, y: 204, z: 1.14, a: "m" },
  walk: { x: 420, y: 232, z: 1.06 },
  front: { x: 420, y: 232, z: 1.03 },
};

const Cross = ({ x, y, r = 20, c = GRN }) => <path transform={`translate(${x} ${y})`} d={`M${-r / 3} ${-r}h${r / 1.5}v${r / 1.5}h${r / 1.5}v${r / 1.5}h${-r / 1.5}v${r / 1.5}h${-r / 1.5}v${-r / 1.5}h${-r / 1.5}v${-r / 1.5}h${r / 1.5}Z`} fill={c} />;
const Pills = ({ dose }) => (
  <g>
    <rect x="-30" y="-18" width="60" height="36" rx="3" fill={C.surf} stroke="#CFC6B2" strokeWidth="1.5" />
    <rect x="-30" y="-18" width="60" height="10" rx="2" fill={C.blue} />
    <Cross x={-18} y={4} r={7} c={C.red} />
    <path d="M-6 0h28M-6 7h20" stroke="#9AA3B0" strokeWidth="2.4" />
    {dose && <g className="ph-dose"><rect x="-4" y="-34" width="40" height="18" rx="4" fill={C.gold2} /><text x="16" y="-21" textAnchor="middle" fontSize="11" fontWeight="800" fill={C.deep}>{dose}</text></g>}
  </g>
);
const Syrup = ({ dose }) => (
  <g>
    <rect x="-6" y="-40" width="12" height="8" rx="2" fill={C.ink} />
    <path d="M-14 -32H14V10Q14 16 8 16H-8Q-14 16-14 10Z" fill="#A0522D" />
    <rect x="-12" y="-16" width="24" height="18" rx="2" fill={C.surf} /><path d="M-8 -10h16M-8 -4h10" stroke={C.green} strokeWidth="2.4" />
    {dose && <g className="ph-dose"><rect x="10" y="-44" width="44" height="18" rx="4" fill={C.gold2} /><text x="32" y="-31" textAnchor="middle" fontSize="10" fontWeight="800" fill={C.deep}>{dose}</text></g>}
  </g>
);
const Masks = () => (
  <g><rect x="-26" y="-16" width="52" height="32" rx="4" fill="#BFE3D8" stroke="#8FC4B4" strokeWidth="1.5" /><path d="M-14 -4q14 -8 28 0v10q-14 8 -28 0Z" fill={C.surf} /><path d="M-14 0h-6M14 0h6" stroke={C.surf} strokeWidth="2" /></g>
);
const HAND = { give: [116, -132], carry: [22, -134], walk: [22, -134], walkz: [22, -134], reach: [74, -276], hands: [33, -118] };
function Held({ w }) {
  const k = w?.hold, at = HAND[w?.pose];
  if (!k || !String(k).startsWith("ph-") || !at) return null;
  return (
    <g className="ph-held" style={{ transform: `translate(${at[0]}px, ${at[1]}px)` }}>
      {k === "ph-box" && <g transform="scale(.75)"><Pills /></g>}
      {k === "ph-syr" && <g transform="scale(.9)"><Syrup /></g>}
      {k === "ph-mask" && <g transform="scale(.8)"><Masks /></g>}
    </g>
  );
}
const Shelf = ({ x, y, w, rows = 3, gap = 52, seed = 0 }) => (
  <g>
    <rect x={x} y={y} width={w} height={rows * gap + 12} fill="#F4F1E6" />
    {Array.from({ length: rows }, (_, r) => (
      <g key={r}>
        {Array.from({ length: Math.floor((w - 12) / 24) }, (_, i) => {
          const k = (i * 7 + r * 3 + seed) % 6, h = [30, 22, 36, 26, 32, 20][k];
          return <rect key={i} x={x + 8 + i * 24} y={y + (r + 1) * gap - h} width="19" height={h} rx="2" fill={[C.blue, "#F4F1E6", C.red, GRN, C.gold2, "#BFE3D8"][k]} stroke={k === 1 ? "#CFC6B2" : "none"} />;
        })}
        <rect x={x} y={y + (r + 1) * gap} width={w} height="7" fill="#B8C6C8" />
      </g>
    ))}
  </g>
);

/* ── Көше ── */
function Street({ st }) {
  const open = st.p.door;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="300" fill="#CFE6EC" />
      <path d="M-40 140h80v-50h60v170H-40ZM690 260V80h60v40h90v140Z" fill="#B7CCD5" />
      <rect x="120" y="50" width="560" height="340" fill="#F4F1E6" />
      <rect x="120" y="50" width="560" height="16" fill={GRN} />
      <Box x={210} y={84} w={380} h={60} r={8} c={GRN} sh="rgba(20,60,40,.3)" />
      <text x="420" y="125" textAnchor="middle" fontSize="30" fontWeight="700" letterSpacing="5" fill={C.cream} style={{ fontFamily: "var(--head)" }}>ДӘРІХАНА</text>
      <g className="ph-blink"><rect x="222" y="92" width="44" height="44" rx="6" fill={C.surf} /><Cross x={244} y={114} r={16} /></g>
      {/* витриналар */}
      {[[140, 320], [480, 660]].map(([a, b], j) => (
        <g key={a}>
          <rect x={a} y="176" width={b - a} height="170" rx="6" fill={GRN} />
          <rect x={a + 8} y="184" width={b - a - 16} height="154" rx="3" fill={MINT} />
          {j ? <g><Cross x={(a + b) / 2} y={232} r={30} c={C.surf} /><rect x={a + 24} y="280" width={b - a - 48} height="40" rx="4" fill={C.surf} /><text x={(a + b) / 2} y="306" textAnchor="middle" fontSize="13" fontWeight="800" fill={GRN}>24/7</text></g>
            : <Shelf x={a + 14} y={190} w={b - a - 28} rows={2} gap={66} />}
          <path d={`M${a + 14} 192l40 0M${a + 14} 200l24 0`} stroke="#fff" strokeWidth="3" opacity=".7" />
        </g>
      ))}
      <rect x="350" y="180" width="100" height="210" fill={GRN} />
      <rect x="358" y="188" width="84" height="202" fill="#F8F1DC" />
      <g transform="translate(358 188)"><g className="lf-mv" style={{ transform: open ? "scaleX(0.16) skewY(-10deg)" : "none" }}>
        <rect width="84" height="202" fill="#BFD9DD" stroke={GRN} strokeWidth="6" />
        <path d="M14 18l26 0M14 26l14 0" stroke="#fff" strokeWidth="3" opacity=".7" />
        <rect x="18" y="50" width="48" height="48" rx="6" fill={C.surf} /><Cross x={42} y={74} r={14} />
        <rect x="66" y="110" width="6" height="30" rx="3" fill="#8B9698" />
      </g></g>
      <g className={`ph-chime${open ? " on" : ""}`}>{[0, 1, 2].map((i) => <rect key={i} x={446 + i * 6} y="182" width="3" height={14 + i * 4} rx="1.5" fill={C.gold} />)}</g>
      <rect x="-40" y="388" width="880" height="110" fill="#CDBFA6" />
      <path d="M-40 388h880" stroke="#B3A386" strokeWidth="4" />
      {[-20, 70, 160, 250, 340, 430, 520, 610, 700, 790].map((x) => <path key={x} d={`M${x} 392l-26 70`} stroke="#BBAA8C" strokeWidth="2" />)}
      <rect x="340" y="386" width="120" height="10" rx="3" fill="#B9A887" />
      <g transform="translate(740 390)"><rect x="-4" y="-110" width="8" height="110" fill={C.wood2} /><circle cx="0" cy="-130" r="40" fill={C.leaf2} /><circle cx="-22" cy="-110" r="24" fill={C.leaf} /></g>
      <Passerby o={P1} y={450} s={0.64} x0={-80} x1={900} d={18} delay={-10} seed={3} />
      <Passerby o={P2} y={458} s={0.66} x0={900} x1={-80} d={22} delay={-4} seed={5} />
    </g>
  );
}

/* ── Дәріхана іші ── */
function Inside({ st, talk, mood }) {
  const p = st.p, w = st.a.npc;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="310" fill={MINT} />
      <rect x="-40" y="-40" width="880" height="26" fill={GRN} />
      {[180, 400, 620].map((x) => <g key={x}><rect x={x - 50} y="-14" width="100" height="8" rx="4" fill="#FFFFFF" /><Cone x={x} y={-6} w={200} h={280} top={46} c="#FFFFFF" op={0.3} /></g>)}
      {/* сол жақ: өзіне-өзі қызмет сөресі мен сатып алушы */}
      <Shelf x={20} y={96} w={190} rows={3} gap={54} seed={2} />
      <g className="ph-browse"><Actor a={{ x: 150, y: 318, s: 0.56 }}><Person o={CU} pose="hands" look={-0.7} seed={4} /></Actor></g>
      <rect x="230" y="70" width="100" height="130" rx="6" fill={C.surf} />
      <Cross x={280} y={110} r={20} c={C.red} /><path d="M248 150h64M248 162h50M248 174h58" stroke="#9AA3B0" strokeWidth="3" />
      <path d="M-40 262H840V500H-40Z" fill="#E8EEEA" />
      {[-300, -150, 0, 150, 300, 450, 600, 750, 900, 1050].map((x) => <path key={x} d={`M${400 + (x - 400) * 0.3} 262L${x} 500`} stroke="#D3DED8" strokeWidth="2" />)}
      {[290, 330, 390].map((y) => <path key={y} d={`M-40 ${y}H840`} stroke="#D3DED8" strokeWidth="2" />)}
      <Passerby o={P1} y={334} s={0.6} x0={880} x1={-80} d={24} delay={-7} seed={3} />
      {/* дәріханашы аймағы (жақындағанда үлкейеді) */}
      <g className="lf-mv ph-near" style={{ transform: p.near ? "none" : "translate(400px, 200px) scale(0.8) translate(-400px, -200px)" }}>
        <Shelf x={380} y={40} w={360} rows={4} gap={62} seed={1} />
        <g className={p.took ? "ph-gap" : undefined}><rect x="704" y="72" width="19" height="30" rx="2" fill={C.blue} /></g>
        <rect x="380" y="28" width="360" height="16" rx="4" fill={GRN} /><text x="560" y="40" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="3" fill={C.surf}>ДӘРІ-ДӘРМЕК</text>
        <Actor a={w} dur={w?.dur}>
          <Person o={PHARM} pose={w?.pose} talk={talk} mood={mood} look={w?.look || 0} head={w?.head} hold={w?.hold} holdL={w?.holdL} seed={2} />
          <Held w={w} />
        </Actor>
        {/* витрина-үстел */}
        <rect x="220" y="318" width="500" height="18" rx="4" fill={C.surf} />
        <path d="M228 336H712V470H228Z" fill="#BFD9DD" opacity=".9" />
        <path d="M228 400H712" stroke="#8FA9AF" strokeWidth="5" />
        {[260, 320, 380, 440, 520, 580, 640].map((x, i) => <rect key={x} x={x} y={370 - (i % 2) * 8} width="40" height={28 + (i % 2) * 8} rx="3" fill={[C.blue, C.red, GRN, C.gold2][i % 4]} opacity=".85" />)}
        <path d="M240 346l40 0M240 354l24 0" stroke="#fff" strokeWidth="3" opacity=".8" />
        <path d="M228 470V336M712 470V336" stroke={GRN} strokeWidth="8" />
        <Pool x={470} y={322} rx={220} ry={8} op={0.3} c="#FFFFFF" />
        {/* касса */}
        <g transform="translate(300 300)">
          <rect x="-36" y="0" width="72" height="20" rx="4" fill="#3A3F4E" />
          <rect x="-30" y="-34" width="60" height="32" rx="4" fill="#2E3440" /><rect x="-25" y="-29" width="50" height="22" rx="2" fill="#9FD3B4" />
          {p.price && <text x="0" y="-13" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1E3B2B">{p.price}</text>}
        </g>
        <g className="lf-mv" style={{ transform: p.term ? "translate(-40px, 70px) scale(1.5)" : "none" }}><Item k="terminal" x={640} y={306} s={0.9} /></g>
        <g className={`ph-on${p.box ? " on" : ""}`}><g transform="translate(440 318) scale(1.1)"><Pills dose={p.dose} /></g></g>
        <g className={`ph-on${p.syr ? " on" : ""}`}><g transform="translate(440 316) scale(1.15)"><Syrup dose={p.dose} /></g></g>
        <g className={`ph-on${p.mask ? " on" : ""}`}><g transform="translate(540 320)"><Masks /></g></g>
      </g>
      {p.paid && <g className="ph-paid"><circle cx="560" cy="300" r="20" fill={GRN} /><path d="M550 300l7 7 13-14" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" /></g>}
    </g>
  );
}

function Stage({ st, talk, mood }) {
  return (
    <>
      <g className={`lf-set${st.set === "out" ? "" : " off"}`}><Street st={st} /></g>
      <g className={`lf-set${st.set === "in" ? "" : " off"}`}><Inside st={st} talk={talk} mood={mood} /></g>
    </>
  );
}

const A = (patch) => ({ a: { npc: patch } });
// Сөреден алып, үстелге қойып, мөлшерін жазу
const take = (item, flag, dose) => [
  beat(200, A({ head: null, look: 0, hold: null })),
  ...walkTo("npc", "shelf", 800, "reach", { look: 0.5 }),
  beat(500, { p: { took: true }, ...A({ hold: item }) }),
  ...walkTo("npc", "desk", 800, "give", { hold: item, look: 0 }),
  beat(350, { p: { [flag]: true }, ...A({ hold: null }) }),
  beat(1100, A({ pose: "write", hold: "pen", head: "down", look: -0.3 })),
  beat(200, { p: { dose } }),
];

export default {
  spots,
  shots,
  dip: "#F4F1E6",
  init: { set: "out", cam: "wide", p: { door: false, near: false }, a: { npc: { at: "shelf", pose: "reach", look: 0.5 } } },
  intro: [
    beat(900),
    beat(1500, { cam: "door", walk: true }),
    beat(650, { walk: false, p: { door: true } }),
    beat(900, { cam: "through", walk: true }),
    beat(380, { dip: true }),
    beat(60, { set: "in", cam: "entry", camMs: 0 }),
    beat(600, { dip: false }),
    beat(1700, { cam: "walk", walk: true, p: { near: true } }),
    beat(500, { walk: false, cam: "front", camMs: 800, ...A({ pose: "stand", look: -0.4 }) }),
    ...walkTo("npc", "desk", 1100, "hands"),
  ],
  acts: {
    talk: [beat(250, A({ pose: "hands", hold: null, head: null, look: 0 })), say(), free()],
    hi: [beat(400, A({ pose: "hands", head: "nod", look: 0 })), say(), free()],
    ask: [beat(400, A({ pose: "hands", head: "tilt", look: 0 })), say(), free()],
    tabs: [...take("ph-box", "box", "3 × 1"), say(500, A({ pose: "point", face: -1, look: -0.3, hold: null })), beat(1200), beat(0, A({ pose: "hands", head: null, look: 0 })), free()],
    syrup: [...take("ph-syr", "syr", "2 × 1"), say(500, A({ pose: "point", face: -1, look: -0.3, hold: null })), beat(1200), beat(0, A({ pose: "hands", head: null, look: 0 })), free()],
    price: [beat(800, A({ pose: "type", head: null, look: -0.4 })), beat(300, { p: { price: "2 800 тг" } }), say(400, A({ pose: "hands", look: 0 })), free()],
    norx: [beat(300, A({ pose: "hands", head: "shake", look: 0 })), say(1300), beat(0, A({ head: null })), free()],
    masks: [beat(700, A({ pose: "hands", head: "down", look: 0.2 })), beat(450, A({ pose: "give", face: -1, hold: "ph-mask", head: null, look: 0 })), beat(350, { p: { mask: true }, ...A({ hold: null }) }),
      beat(700, A({ pose: "type", look: -0.4 })), say(300, { p: { price: "3 400 тг" }, ...A({ pose: "hands", look: 0 }) }), free()],
    pay: [beat(500, { p: { term: true }, ...A({ pose: "give", face: -1, head: null }) }), beat(900, { hand: "card" }), beat(500, { p: { paid: true } }), beat(300, { hand: null, ...A({ pose: "hands", head: "nod" }) }), say(), free()],
    bye: [beat(300, { p: { term: false }, ...A({ pose: "wave", head: "nod", look: 0 }) }), say(1200), beat(0, A({ pose: "hands", head: null })), free()],
  },
  script: {
    "pharmacy-cold": { n1: "hi", n2: "ask", n3: "tabs", c3: "syrup", n4: "price", n5: "norx", m6: "masks", n6: "pay", fin: "bye" },
  },
  css: `
.ph-held{transform-box:view-box;transform-origin:0 0;animation:ph-in .35s .15s ease both}
.ph-on{opacity:0;transform:translateY(-14px);transition:opacity .35s ease,transform .45s cubic-bezier(.3,1.3,.5,1)}
.ph-on.on{opacity:1;transform:none}
.ph-near{transition-duration:1.7s!important}
.ph-dose{animation:ph-pop .45s cubic-bezier(.3,1.5,.5,1) both}
.ph-gap{opacity:0;transition:opacity .2s}
.ph-blink{animation:ph-blink 2.4s ease-in-out infinite}
.ph-chime{transform-origin:452px 182px}.ph-chime.on{animation:ph-ring .6s ease-out 2}
.ph-browse .lf-ua.r{animation:ph-reachu 8s ease-in-out infinite}
.ph-browse .lf-face{animation:ph-look 8s ease-in-out infinite}
.ph-paid{transform-box:fill-box;transform-origin:50% 50%;animation:vr-stamp .5s ease-out both}
@keyframes ph-in{from{opacity:0}to{opacity:1}}
@keyframes ph-pop{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:none}}
@keyframes ph-blink{0%,100%{opacity:1}50%{opacity:.6}}
@keyframes ph-ring{0%,100%{transform:rotate(0)}30%{transform:rotate(14deg)}65%{transform:rotate(-10deg)}}
@keyframes ph-reachu{0%,55%,90%,100%{transform:rotate(-16deg)}62%,84%{transform:rotate(-150deg)}}
@keyframes ph-look{0%,50%,100%{transform:translateX(-5px)}60%,85%{transform:translateX(-7px) translateY(-3px)}}
`,
  Stage,
};
