// VR өмір: ДҮКЕН. Көше → қоңыраулы есік → сөрелер арасымен сатушыға жақындаймыз (сөре алдыңғы қабаты үлкейеді).
// Сәуле апай нан сөресін реттеп тұр, бұрылып, сатушы орнына келеді. Әр түйін: нанды сөреден алу, тоңазытқыштан сүт,
// кассадағы баға, қайтарым, терминал және картамен төлеу.
import { C, ST, Box, Cone, Pool, Item, Person, Actor, Passerby, Horn, walkTo, beat, say, free } from "./kit";

const SELLER = { f: true, skin: 1, hair: "#3B2416", hs: "scarf", scarf: C.red, top: C.teal, apron: C.red };
const BUYER = { skin: 0, hair: "#4E2F1B", hs: "short", top: "#7A4A21" };
const P1 = { f: true, skin: 2, hair: "#1E1A1A", hs: "long", top: "#5B3FA8" };
const P2 = { skin: 1, hair: "#2B1A12", hs: "short", top: C.blue, vest: "#3A3F4E" };

const spots = {
  rack: { x: 226, y: 336, s: 0.8 },
  counter: { x: 470, y: 402, s: 0.96 },
  fridge: { x: 640, y: 338, s: 0.8 },
  mid: { x: 360, y: 350, s: 0.84 },
};
const shots = {
  wide: { x: 400, y: 236, z: 1, a: "m" },
  door: { x: 400, y: 282, z: 1.9, a: "m" },
  through: { x: 400, y: 300, z: 4.4, a: "m" },
  entry: { x: 400, y: 200, z: 1.18, a: "m" },
  walk: { x: 410, y: 232, z: 1.08 },
  front: { x: 400, y: 232, z: 1.03 },
};

function Street({ st }) {
  const open = st.p.door;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="300" fill="#CFE6EC" />
      <path d="M-40 120h90v-40h60v160H-40Z" fill="#B7CCD5" /><path d="M690 260V70h70v40h80v150Z" fill="#B7CCD5" />
      <rect x="110" y="56" width="580" height="334" fill="#EFE6D2" />
      <rect x="110" y="56" width="580" height="18" fill={C.green} />
      <Box x={230} y={88} w={340} h={60} r={8} c={C.green} sh="rgba(31,42,30,.3)" />
      <text x="400" y="128" textAnchor="middle" fontSize="32" fontWeight="700" letterSpacing="6" fill={C.cream} style={{ fontFamily: "var(--head)" }}>ДҮКЕН</text>
      <text x="400" y="168" textAnchor="middle" fontSize="13" fontWeight="800" letterSpacing="4" fill={C.green}>АЗЫҚ-ТҮЛІК</text>
      {/* витриналар */}
      <g>
        <rect x="140" y="188" width="190" height="166" rx="6" fill={C.green} />
        <rect x="148" y="196" width="174" height="150" rx="3" fill="#FFF3D6" />
        {[240, 290, 336].map((y) => <rect key={y} x="148" y={y} width="174" height="6" fill={C.wood} />)}
        {[170, 214, 258, 300].map((x, i) => <Item key={x} k={i % 2 ? "brown" : "bread"} x={x} y={232} s={0.6} />)}
        {[176, 226, 276].map((x) => <Item key={x} k="milk" x={x} y={278} s={0.7} />)}
        <path d="M156 204l50 0M156 212l30 0" stroke="#fff" strokeWidth="3" opacity=".6" />
      </g>
      <g>
        <rect x="470" y="188" width="190" height="166" rx="6" fill={C.green} />
        <rect x="478" y="196" width="174" height="150" rx="3" fill="#FFF3D6" />
        {[260, 336].map((y) => <rect key={y} x="478" y={y} width="174" height="6" fill={C.wood} />)}
        {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={500 + i * 26} cy={248 - (i % 2) * 6} r="11" fill={i % 3 ? "#C8392E" : "#E9B44C"} />)}
        {[0, 1, 2, 3].map((i) => <rect key={i} x={494 + i * 38} y={290} width="28" height="40" rx="3" fill={[C.red, C.gold, C.blue, C.leaf][i]} />)}
        <path d="M486 204l50 0M486 212l30 0" stroke="#fff" strokeWidth="3" opacity=".6" />
      </g>
      {/* есік: шыны, «АШЫҚ» белгісі */}
      <rect x="350" y="192" width="100" height="196" fill={C.green} />
      <rect x="358" y="200" width="84" height="188" fill="#F8E6BC" />
      <g transform="translate(358 200)">
        <g className="lf-mv" style={{ transform: open ? "scaleX(0.16) skewY(-10deg)" : "none" }}>
          <rect width="84" height="188" fill="#2F6B4F" />
          <rect x="8" y="8" width="68" height="150" rx="3" fill="#BFD9DD" />
          <path d="M16 18l26 0M16 26l14 0" stroke="#fff" strokeWidth="3" opacity=".6" />
          <path d="M28 40l14 -14l14 14" stroke={C.ink} strokeWidth="1.5" fill="none" />
          <rect x="16" y="40" width="52" height="22" rx="3" fill={C.surf} />
          <text x="42" y="56" textAnchor="middle" fontSize="11" fontWeight="800" fill={C.green}>АШЫҚ</text>
          <rect x="66" y="96" width="6" height="30" rx="3" fill={C.gold} />
        </g>
      </g>
      <g className={`sh-bell${open ? " on" : ""}`}><path d="M450 188q8 0 8 10h-16q0-10 8-10Z" fill={C.gold} /><path d="M436 182q-6 8 0 16M464 182q6 8 0 16" stroke={C.gold} strokeWidth="2" fill="none" /></g>
      {/* жәшіктер, тротуар */}
      {[96, 150].map((x, i) => (
        <g key={x}><rect x={x} y="340" width="50" height="40" rx="3" fill={C.wood} /><path d={`M${x} 352h50M${x} 366h50`} stroke={C.wood2} strokeWidth="2" />
          {[0, 1, 2].map((k) => <circle key={k} cx={x + 12 + k * 13} cy={336} r="8" fill={i ? "#E9B44C" : "#C8392E"} />)}</g>
      ))}
      <rect x="-40" y="388" width="880" height="110" fill="#CDBFA6" />
      <path d="M-40 388h880" stroke="#B3A386" strokeWidth="4" />
      {[-20, 70, 160, 250, 340, 430, 520, 610, 700, 790].map((x) => <path key={x} d={`M${x} 392l-26 70`} stroke="#BBAA8C" strokeWidth="2" />)}
      <rect x="340" y="386" width="120" height="10" rx="3" fill="#B9A887" />
      <Passerby o={P1} y={452} s={0.64} x0={900} x1={-80} d={18} delay={-12} seed={2} />
      <Passerby o={P2} y={444} s={0.6} x0={-80} x1={900} d={23} delay={-2} seed={6} />
    </g>
  );
}

const VP = [400, 170];
function Inside({ st, talk, mood }) {
  const p = st.p, w = st.a.npc;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="320" fill="#F1E4C6" />
      <rect x="-40" y="-40" width="880" height="30" fill={C.green} />
      <path d="M-40 270H840V500H-40Z" fill="#D8CCB2" />
      {[-300, -150, 0, 150, 300, 450, 600, 750, 900, 1050].map((x) => <path key={x} d={`M${VP[0] + (x - VP[0]) * 0.3} 270L${x} 500`} stroke="#C7B999" strokeWidth="2" />)}
      {[300, 350, 420].map((y) => <path key={y} d={`M-40 ${y}H840`} stroke="#C7B999" strokeWidth="1.6" />)}
      {/* артқы сөрелер: тауарлар */}
      {[300, 380, 460, 540].map((x) => <Cone key={x} x={x} y={-10} w={180} h={290} top={14} op={0.14} />)}
      {[[290, 560]].map(([a, b]) => (
        <g key={a}>
          <rect x={a} y="40" width={b - a} height="230" fill={C.wood2} />
          {[96, 156, 216].map((y, r) => (
            <g key={y}>
              <rect x={a + 8} y={y - 48} width={b - a - 16} height="50" fill="#E7D7B5" />
              {Array.from({ length: 9 }, (_, i) => {
                const x = a + 22 + i * 29, k = (i + r * 3) % 5;
                return k === 0 ? <rect key={i} x={x - 10} y={y - 34} width="20" height="34" rx="3" fill={C.red} /> :
                  k === 1 ? <path key={i} d={`M${x - 9} ${y}V${y - 26}q9-8 18 0V${y}Z`} fill="#E9B44C" /> :
                    k === 2 ? <rect key={i} x={x - 11} y={y - 24} width="22" height="24" rx="4" fill={C.blue} /> :
                      k === 3 ? <circle key={i} cx={x} cy={y - 12} r="12" fill="#C8392E" /> :
                        <rect key={i} x={x - 9} y={y - 40} width="18" height="40" rx="2" fill={C.leaf} />;
              })}
              <rect x={a} y={y} width={b - a} height="8" fill={C.wood} />
            </g>
          ))}
        </g>
      ))}
      {/* нан сөресі (сол жақ) */}
      <g>
        <rect x="70" y="80" width="190" height="200" fill={C.wood2} />
        {[130, 186, 242].map((y, r) => (
          <g key={y}>
            <path d={`M78 ${y}L252 ${y - 20}V${y + 6}H78Z`} fill={C.wood} />
            {[0, 1, 2, 3].map((i) => <Item key={i} k={r === 1 ? "brown" : "bread"} x={104 + i * 42} y={y - 10 - i * 4} s={0.62} r={-6} />)}
          </g>
        ))}
        <rect x="96" y="56" width="138" height="26" rx="4" fill={C.surf} /><text x="165" y="74" textAnchor="middle" fontSize="15" fontWeight="800" fill={C.deep}>НАН</text>
      </g>
      {/* тоңазытқыш (оң жақ) */}
      <g>
        <rect x="586" y="40" width="190" height="244" rx="8" fill="#DCE3E4" />
        <rect x="596" y="52" width="170" height="220" rx="4" fill="#E9F3F4" />
        {[110, 170, 230].map((y) => (
          <g key={y}>{[0, 1, 2, 3, 4].map((i) => <Item key={i} k="milk" x={622 + i * 30} y={y} s={0.66} />)}<rect x="596" y={y + 10} width="170" height="5" fill="#B8C6C8" /></g>
        ))}
        <g transform="translate(596 52)">
          <g className="lf-mv" style={{ transform: p.fridge ? "scaleX(0.22) skewY(8deg)" : "none" }}>
            <rect width="170" height="220" rx="4" fill="#CFE6EC" opacity=".55" />
            <path d="M14 14l40 0M14 22l24 0" stroke="#fff" strokeWidth="4" opacity=".8" />
            <rect x="152" y="80" width="8" height="60" rx="4" fill="#8B9698" />
          </g>
        </g>
        <rect x="586" y="22" width="190" height="24" rx="6" fill={C.blue} /><text x="681" y="40" textAnchor="middle" fontSize="13" fontWeight="800" fill={C.surf}>СҮТ</text>
      </g>
      {/* фондағы сатып алушы */}
      <Passerby o={BUYER} y={300} s={0.5} x0={300} x1={560} d={26} delay={-8} seed={4} />
      {/* жақындағанда үлкейетін алдыңғы қабат: сатушы мен сатушы үстелі */}
      <g className="lf-mv sh-near" style={{ transform: p.near ? "none" : "translate(400px, 200px) scale(0.78) translate(-400px, -200px)" }}>
        <Actor a={w} dur={w?.dur}>
          <Person o={SELLER} pose={w?.pose} talk={talk} mood={mood} look={w?.look || 0} head={w?.head} hold={w?.hold} seed={3} />
        </Actor>
        <g>
          <rect x="220" y="332" width="460" height="22" rx="4" fill={C.wood} />
          <path d="M228 354H672V470H228Z" fill={C.wood2} />
          <path d="M240 366H660V462H240Z" fill="none" stroke={ST} strokeWidth="1.5" strokeDasharray="5 5" />
          <Horn x={450} y={410} s={1.2} c={C.gold} />
          <Pool x={450} y={336} rx={200} ry={8} op={0.25} />
          {/* касса: баға экраны */}
          <g transform="translate(300 300)">
            <rect x="-36" y="0" width="72" height="34" rx="4" fill="#3A3F4E" />
            <rect x="-30" y="-34" width="60" height="30" rx="4" fill="#2E3440" />
            <rect x="-25" y="-29" width="50" height="20" rx="2" fill="#9FD3B4" />
            {p.price && <text x="0" y="-14" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1E3B2B">{p.price}</text>}
          </g>
          {/* таразы */}
          <g transform="translate(610 316)"><rect x="-26" y="0" width="52" height="16" rx="3" fill="#DCE3E4" /><ellipse cx="0" cy="-2" rx="30" ry="6" fill="#B8C6C8" /></g>
          <g className="lf-mv" style={{ transform: p.term ? "translate(-40px, 70px) scale(1.5)" : "none" }}><Item k="terminal" x={548} y={312} s={0.9} /></g>
          <g className={`sh-on${p.bread ? " on" : ""}`}><Item k="bread" x={410} y={334} s={1.05} /></g>
          <g className={`sh-on${p.milk ? " on" : ""}`}><Item k="milk" x={482} y={326} s={1.05} /></g>
          <g className={`sh-on${p.note ? " on" : ""}`}><Item k="note" x={372} y={340} s={0.9} r={-8} /></g>
          <g className={`sh-on${p.coins ? " on" : ""}`}><Item k="coins" x={520} y={344} s={1.2} /></g>
        </g>
      </g>
      {p.paid && <g className="sh-paid"><circle cx="508" cy="340" r="20" fill="#2F8F5B" /><path d="M498 340l7 7 13-14" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" /></g>}
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

const S = (patch) => ({ a: { npc: patch } });
const back = (item, where, ms = 900) => [...walkTo("npc", where, ms, "reach"), beat(450, S({ hold: item })), ...walkTo("npc", "counter", ms, "give", { hold: item })];

export default {
  spots,
  shots,
  dip: "#FFF3D6",
  init: { set: "out", cam: "wide", p: { door: false, near: false }, a: { npc: { at: "rack", pose: "reach", face: -1 } } },
  intro: [
    beat(900),
    beat(1500, { cam: "door", walk: true }),
    beat(650, { walk: false, p: { door: true } }),
    beat(900, { cam: "through", walk: true }),
    beat(380, { dip: true }),
    beat(60, { set: "in", cam: "entry", camMs: 0 }),
    beat(600, { dip: false }),
    beat(1700, { cam: "walk", walk: true, p: { near: true } }),
    beat(500, { walk: false, cam: "front", camMs: 800, ...S({ pose: "stand", look: 0.4 }) }),
    ...walkTo("npc", "counter", 1300, "hands"),
  ],
  acts: {
    talk: [beat(250, S({ pose: "hands", hold: null, head: null, look: 0 })), say(), free()],
    rack: [beat(400, S({ pose: "point", face: -1, look: -0.5, head: null })), say(1200), beat(0, S({ pose: "hands", look: 0 })), free()],
    bread: [beat(200, S({ head: null, look: 0 })), ...back("bread", "rack"), say(350, { p: { bread: true }, ...S({ hold: null }) }), beat(0, S({ pose: "hands" })), free()],
    milk: [beat(200, S({ head: null })), ...walkTo("npc", "fridge", 900, "stand"), beat(350, { p: { fridge: true }, ...S({ pose: "reach" }) }), beat(350, S({ hold: "milk" })), beat(200, { p: { fridge: false } }),
      ...walkTo("npc", "counter", 900, "give", { hold: "milk" }), say(350, { p: { milk: true }, ...S({ hold: null }) }), beat(0, S({ pose: "hands" })), free()],
    price: ({ node }) => [beat(700, S({ pose: "type", head: null, look: -0.4 })), beat(300, { p: { price: node === "n5b" ? "800 тг" : "250 тг" } }), say(400, S({ pose: "hands", look: 0 })), free()],
    change: [beat(800, { hand: "note" }), beat(400, { hand: null, p: { note: true } }), beat(600, S({ pose: "type", head: null })), beat(400, S({ pose: "give", face: -1, hold: "coins" })), say(400, { p: { coins: true, note: false }, ...S({ hold: null }) }), beat(0, S({ pose: "hands" })), free()],
    card: [beat(400, S({ pose: "give", face: -1, head: null })), say(400, { p: { term: true } }), beat(0, S({ pose: "hands" })), free()],
    pay: ({ st }) => [
      ...(st.p.term ? [beat(900, { hand: "card" }), beat(450, { p: { paid: true } }), beat(300, { hand: null })]
        : st.p.coins ? [] : [beat(900, { hand: "note" }), beat(400, { hand: null, p: { note: true } })]),
      beat(400, S({ pose: "wave", head: "nod", hold: null })), say(), free(),
    ],
  },
  script: {
    "shop-bread": { n1: "talk", n2: "rack", n3: "bread", m4: "milk", n5: "price", n5b: "price", c6: "change", n6: "card", fin: "pay" },
  },
  css: `
.sh-on{opacity:0;transform:translateY(-16px);transition:opacity .35s ease,transform .45s cubic-bezier(.3,1.3,.5,1)}
.sh-on.on{opacity:1;transform:none}
.sh-bell{transform-box:fill-box;transform-origin:50% 0;opacity:.9}.sh-bell.on{animation:sh-ring .7s ease-out 2}
.sh-paid{transform-box:fill-box;transform-origin:50% 50%;animation:vr-stamp .5s ease-out both}
.sh-near{transition-duration:1.7s!important}
@keyframes sh-ring{0%{transform:rotate(0)}25%{transform:rotate(18deg)}60%{transform:rotate(-14deg)}100%{transform:rotate(0)}}
`,
  Stage,
};
