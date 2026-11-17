// VR өмір: КЕҢСЕ (жұмысқа сұхбат). Бизнес-орталық → шыны есік → ресепшн қызметкері лифтіні нұсқайды → лифт есігі ашылады →
// сұхбат бөлмесі: есікті қағамыз, басшы орнынан тұрып, қол алысады. Түйіндер: орындыққа шақыру, түйіндеме (CV) үстелде,
// жазба, ноутбук, жеңілдіктер парағы, шыны қабырға артындағы командаға нұсқау, соңында тағы қол алысу.
import { C, ST, Box, Cone, Pool, Item, Person, Actor, Passerby, Horn, walkTo, beat, say, free } from "./kit";

const BOSS = { f: true, skin: 1, hair: "#2B1A12", hs: "bun", top: "#2B2F3A", coat: true, shirt: C.surf, glasses: true, pants: "#2B2F3A" };
const REC = { f: true, skin: 0, hair: "#3B2416", hs: "long", top: C.teal, collar: C.surf, badge: C.gold };
const T1 = { f: true, skin: 2, hair: "#2B1A12", hs: "bun", top: "#C0602F" };
const T2 = { skin: 0, hair: "#4E2F1B", hs: "short", top: "#5B87A8", glasses: true };
const T3 = { f: true, skin: 1, hair: "#1E1A1A", hs: "long", top: C.green };
const T4 = { skin: 2, hair: "#2B1A12", hs: "short", top: "#7A4A21" };
const P1 = { skin: 1, hair: "#3B2416", hs: "short", top: C.navy, coat: true, shirt: "#E9D9B8" };
const P2 = { f: true, skin: 0, hair: "#2B1A12", hs: "bun", top: "#9B3B30" };
const GL = "#BFD9DD";

const spots = { chair: { x: 560, y: 452, s: 0.98 }, rec: { x: 250, y: 400, s: 0.86 } };
const shots = {
  wide: { x: 400, y: 225, z: 1, a: "m" },
  door: { x: 400, y: 300, z: 1.9, a: "m" },
  through: { x: 400, y: 310, z: 4.4, a: "m" },
  lobby: { x: 400, y: 220, z: 1.06, a: "m" },
  lift: { x: 640, y: 250, z: 1.9, a: "m" },
  lin: { x: 640, y: 270, z: 4, a: "m" },
  room: { x: 420, y: 250, z: 1.02 },
  near: { x: 500, y: 250, z: 1.14 },
  seat: { x: 480, y: 262, z: 1.12 },
  glass: { x: 330, y: 262, z: 1.1 },
};

/* ── Бизнес-орталық ── */
function Tower({ st }) {
  const open = st.p.door;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="300" fill="#CFE6EC" />
      <path d="M-40 260V40h80v-40h60v260ZM680 260V20h70v60h90v180Z" fill="#B7CCD5" />
      <rect x="160" y="-40" width="480" height="430" fill="#8FB3BF" />
      {Array.from({ length: 6 }, (_, r) => Array.from({ length: 8 }, (_, c) => <rect key={`${r}${c}`} x={172 + c * 58} y={-30 + r * 40} width="50" height="32" fill={(r + c) % 3 ? "#A9C8D2" : "#CFE3E6"} />))}
      <path d="M180 -20l60 0M300 20l40 0" stroke="#fff" strokeWidth="4" opacity=".5" />
      <rect x="160" y="210" width="480" height="180" fill="#E9E1CF" />
      <Box x={262} y={222} w={276} h={44} r={6} c={C.navy} sh="rgba(20,30,50,.3)" />
      <path d="M284 254l14 -18 10 12 8 -8 12 14Z" fill={C.surf} />
      <text x="420" y="252" textAnchor="middle" fontSize="18" fontWeight="700" letterSpacing="4" fill={C.cream} style={{ fontFamily: "var(--head)" }}>БИЗНЕС ОРТАЛЫҚ</text>
      <rect x="334" y="276" width="132" height="114" fill="#5D6675" /><rect x="340" y="282" width="120" height="108" fill="#F6E7C6" />
      {[-1, 1].map((d) => (
        <g key={d} className="lf-mv" style={{ transform: open ? `translateX(${d * 58}px)` : "none", transitionDuration: "1.1s" }}>
          <rect x={d < 0 ? 340 : 400} y="282" width="60" height="108" fill={GL} opacity=".9" stroke="#8B9698" strokeWidth="3" />
          <path d={`M${d < 0 ? 350 : 410} 292l20 0M${d < 0 ? 350 : 410} 300l12 0`} stroke="#fff" strokeWidth="3" opacity=".7" />
        </g>
      ))}
      {[200, 600].map((x) => <g key={x} transform={`translate(${x} 390)`}><rect x="-22" y="-30" width="44" height="30" rx="4" fill="#5D6675" /><circle cx="0" cy="-56" r="28" fill={C.leaf2} /><circle cx="-12" cy="-44" r="16" fill={C.leaf} /></g>)}
      <rect x="-40" y="390" width="880" height="110" fill="#CDBFA6" /><path d="M-40 390h880" stroke="#B3A386" strokeWidth="4" />
      {[-20, 70, 160, 250, 340, 430, 520, 610, 700, 790].map((x) => <path key={x} d={`M${x} 394l-24 60`} stroke="#BBAA8C" strokeWidth="2" />)}
      <Passerby o={P1} y={452} s={0.64} x0={-80} x1={900} d={17} delay={-10} seed={2} />
      <Passerby o={P2} y={444} s={0.6} x0={900} x1={-80} d={22} delay={-3} seed={6} />
    </g>
  );
}

/* ── Фойе: ресепшн, лифт ── */
function Lobby({ st }) {
  const p = st.p, r = st.a.rec;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="310" fill="#E9E4DA" />
      <rect x="-40" y="-40" width="880" height="20" fill={C.navy} />
      <path d="M-40 260H840V500H-40Z" fill="#D9D3C7" />
      {[290, 340, 410].map((y) => <path key={y} d={`M-40 ${y}H840`} stroke="#C8C1B3" strokeWidth="1.6" />)}
      {[200, 460].map((x) => <Cone key={x} x={x} y={-20} w={240} h={280} top={20} op={0.12} />)}
      <rect x="110" y="40" width="300" height="80" rx="6" fill={C.navy} /><path d="M140 100l20 -26 14 16 10 -10 18 20Z" fill={C.surf} />
      <text x="290" y="92" textAnchor="middle" fontSize="26" fontWeight="700" letterSpacing="5" fill={C.cream} style={{ fontFamily: "var(--head)" }}>АЛАТАУ</text>
      <Passerby o={P2} y={300} s={0.5} x0={-60} x1={520} d={20} delay={-7} seed={8} />
      <Actor a={r} dur={r?.dur}><Person o={REC} pose={r?.pose} look={r?.look || 0} head={r?.head} seed={3} /></Actor>
      <path d="M120 340H380L370 430H130Z" fill={C.surf} /><rect x="110" y="328" width="280" height="16" rx="4" fill={C.wood} /><path d="M120 360H380" stroke={C.navy} strokeWidth="6" />
      <Horn x={250} y={398} s={1.1} c={C.navy} />
      {/* лифт */}
      <rect x="560" y="80" width="160" height="200" fill="#B8C6C8" />
      <rect x="590" y="88" width="100" height="22" rx="3" fill="#1C2129" /><text x="640" y="104" textAnchor="middle" fontSize="13" fontWeight="800" fill="#FFB347">{p.lift ? "1 ▲" : "5 ▼"}</text>
      <rect x="580" y="116" width="120" height="164" fill="#F6E7C6" />
      {[-1, 1].map((d) => (
        <g key={d} className="lf-mv" style={{ transform: p.lift ? `translateX(${d * 56}px)` : "none", transitionDuration: "1s" }}>
          <rect x={d < 0 ? 580 : 640} y="116" width="60" height="164" fill="#C9D3D6" stroke="#8B9698" strokeWidth="2" />
          <path d={`M${d < 0 ? 590 : 650} 130l14 0`} stroke="#fff" strokeWidth="3" opacity=".7" />
        </g>
      ))}
      <rect x="560" y="76" width="20" height="208" fill="#E9E4DA" /><rect x="700" y="76" width="20" height="208" fill="#E9E4DA" />
      <rect x="730" y="170" width="16" height="30" rx="4" fill="#5D6675" /><circle cx="738" cy="185" r="4" fill={p.call ? C.gold2 : "#C9C2B2"} />
      <g transform="translate(790 300)"><rect x="-22" y="-36" width="44" height="36" rx="4" fill={C.wood2} /><circle cx="0" cy="-74" r="34" fill={C.leaf2} /><circle cx="-16" cy="-56" r="20" fill={C.leaf} /></g>
    </g>
  );
}

/* ── Сұхбат бөлмесі ── */
function Room({ st, talk, mood }) {
  const p = st.p, w = st.a.npc;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="310" fill="#EDE8DE" />
      <path d="M-40 262H840V500H-40Z" fill="#B8AE9C" />
      {[300, 350, 420].map((y) => <path key={y} d={`M-40 ${y}H840`} stroke="#A9A08D" strokeWidth="1.4" />)}
      {/* шыны қабырға артында — команда */}
      <rect x="-40" y="40" width="330" height="222" fill="#E2DCCD" />
      <g className="of-t1"><Actor a={{ x: 30, y: 250, s: 0.46 }}><Person o={T1} pose="type" seat look={0.3} seed={2} /></Actor></g>
      <g className="of-t2"><Actor a={{ x: 120, y: 250, s: 0.46 }}><Person o={T2} pose={p.team ? "wave" : "type"} seat look={p.team ? 0.7 : -0.2} seed={5} /></Actor></g>
      <g className="of-t3"><Actor a={{ x: 210, y: 250, s: 0.46 }}><Person o={T3} pose="sit" seat look={0.5} hold="cup" seed={7} /></Actor></g>
      <rect x="-30" y="212" width="300" height="10" rx="3" fill={C.wood} />
      {[0, 90, 180].map((x) => <g key={x}><rect x={x + 6} y="184" width="34" height="26" rx="2" fill="#2E3440" /><rect x={x + 9} y="187" width="28" height="18" fill="#9CC3CC" /></g>)}
      <Passerby o={T4} y={262} s={0.44} x0={-60} x1={300} d={14} delay={-4} seed={9} />
      <rect x="-40" y="40" width="330" height="222" fill="#CFE3E6" opacity=".35" />
      <path d="M290 40V262M-40 40H290" stroke="#8B9698" strokeWidth="6" /><path d="M10 80l60 -40M40 110l80 -70M200 150l60 -60" stroke="#fff" strokeWidth="5" opacity=".35" />
      <g className={`of-hl${p.team ? " on" : ""}`}><rect x="-36" y="44" width="322" height="214" fill="none" stroke={C.gold} strokeWidth="5" /></g>
      {/* терезе, логотип, тақта */}
      <rect x="560" y="40" width="250" height="170" fill="#8B9698" /><rect x="568" y="48" width="234" height="154" fill="#CFE6EC" />
      <path d="M568 202V150h26v-40h30v60h24v-80h36v90h30v-50h40v72Z" fill="#9DB8C6" /><path d="M685 48v154" stroke="#8B9698" strokeWidth="5" />
      <rect x="330" y="60" width="190" height="120" rx="4" fill={C.surf} stroke="#C9C2B2" strokeWidth="3" />
      <path d="M350 160l30 -30 30 14 40 -50 40 22" stroke={C.blue} strokeWidth="4" fill="none" strokeLinecap="round" /><circle cx="490" cy="116" r="5" fill={C.red} />
      {[[350, 80], [350, 92]].map(([x, y], i) => <path key={i} d={`M${x} ${y}h${70 - i * 20}`} stroke="#9AA3B0" strokeWidth="3" />)}
      <g transform="translate(790 262)"><rect x="-22" y="-36" width="44" height="36" rx="4" fill={C.wood2} /><circle cx="0" cy="-74" r="32" fill={C.leaf2} /><circle cx="16" cy="-58" r="20" fill={C.leaf} /></g>
      <Cone x={500} y={-20} w={360} h={300} top={30} op={0.12} />
      {/* басшы */}
      <rect x="500" y="300" width="120" height="120" rx="12" fill="#2E3440" />
      <Actor a={w} dur={w?.dur}>
        <Person o={BOSS} pose={w?.pose} talk={talk} mood={mood} look={w?.look || 0} head={w?.head} hold={w?.hold} holdL={w?.holdL} seat={!!w?.sit && w?.pose !== "walk"} seed={1} />
      </Actor>
      {/* үстел: отырғанда сәл жоғары көтеріледі */}
      <g className="lf-mv" style={{ transform: p.desk ? "none" : "translateY(36px)", transitionDuration: "1s" }}>
        <path d="M300 392H840L860 432H280Z" fill={C.wood3} />
        <path d="M280 432H860V500H280Z" fill={C.wood2} />
        <path d="M296 444H844V490H296Z" fill="none" stroke={ST} strokeWidth="1.5" strokeDasharray="5 5" />
        {/* ноутбук */}
        <g transform="translate(700 398)"><path d="M-40 -48H40L36 0H-36Z" fill="#3A3F4E" /><path d="M-34 -44H34L31 -4H-31Z" fill={p.screen ? "#9CC3CC" : "#4E5868"} style={{ transition: "fill .4s" }} /><path d="M-48 0H48L52 8H-52Z" fill="#9AA3B0" /></g>
        <Item k="cup" x={790} y={404} s={0.9} />
        <g className={`of-on${p.cv ? " on" : ""}`}><g transform="translate(470 416) rotate(-6)"><rect x="-28" y="-18" width="56" height="36" rx="2" fill={C.surf} stroke="#CFC6B2" strokeWidth="1.5" />
          <rect x="-22" y="-12" width="12" height="14" rx="1" fill="#C9B48A" /><text x="8" y="-5" textAnchor="middle" fontSize="7" fontWeight="800" fill={C.ink}>ТҮЙІНДЕМЕ</text>
          <path d="M-6 0h28M-22 6h44M-22 11h36" stroke="#9AA3B0" strokeWidth="1.3" /></g></g>
        <g className={`of-on${p.sheet ? " on" : ""}`}><g transform="translate(560 420) rotate(5)"><rect x="-22" y="-15" width="44" height="30" rx="2" fill="#FFF7E2" stroke="#CFC6B2" />
          {[-8, -2, 4, 10].map((y) => <g key={y}><circle cx="-14" cy={y} r="2" fill={C.green} /><path d={`M-9 ${y}h24`} stroke="#9AA3B0" strokeWidth="1.3" /></g>)}</g></g>
      </g>
      {p.knock && <g className="of-knock"><path d="M60 300q14 14 0 28M74 292q22 22 0 44" stroke={C.ink} strokeWidth="3" fill="none" opacity=".5" /></g>}
    </g>
  );
}

function Stage({ st, talk, mood }) {
  return (
    <>
      <g className={`lf-set${st.set === "out" ? "" : " off"}`}><Tower st={st} /></g>
      <g className={`lf-set${st.set === "lobby" ? "" : " off"}`}><Lobby st={st} /></g>
      <g className={`lf-set${st.set === "in" ? "" : " off"}`}><Room st={st} talk={talk} mood={mood} /></g>
    </>
  );
}

const B = (patch) => ({ a: { npc: patch } });
const sitI = (extra = {}) => B({ pose: "hands", sit: true, head: null, hold: null, holdL: null, look: 0, ...extra });

export default {
  spots,
  shots,
  dip: "#EDE8DE",
  init: { set: "out", cam: "wide", p: { door: false }, a: { npc: { at: "chair", pose: "type", sit: true, look: 0.4 }, rec: { at: "rec", pose: "type", look: 0.2 } } },
  intro: [
    beat(900),
    beat(1500, { cam: "door", walk: true }),
    beat(900, { walk: false, p: { door: true } }),
    beat(900, { cam: "through", walk: true }),
    beat(380, { dip: true }),
    beat(60, { set: "lobby", cam: "lobby", camMs: 0, walk: false }),
    beat(600, { dip: false }),
    beat(500, { a: { rec: { pose: "wave", look: 0, head: "nod" } } }),
    beat(900, { a: { rec: { pose: "point", face: 1, look: 0.5, head: null } }, p: { call: true } }),
    beat(1300, { cam: "lift", walk: true, a: { rec: { pose: "type" } } }),
    beat(800, { walk: false, p: { lift: true } }),
    beat(800, { cam: "lin", walk: true }),
    beat(380, { dip: true }),
    beat(60, { set: "in", cam: "room", camMs: 0, walk: false }),
    beat(600, { dip: false }),
    beat(700, { p: { knock: true } }),
    beat(500, B({ pose: "hands", look: 0, head: "up" })),
    beat(500, B({ pose: "stand", sit: false, head: null })),
    beat(1200, { cam: "near", walk: true, camMs: 1200 }),
    beat(300, { walk: false, p: { knock: false }, ...B({ pose: "give", face: -1 }) }),
    beat(500, { hand: "shake" }),
    beat(600, { hand: null, ...B({ pose: "hands", head: "nod" }) }),
  ],
  acts: {
    talk: [beat(300, sitI()), say(), free()],
    sit: [beat(300, B({ pose: "point", face: -1, head: null, look: -0.2 })), say(900), beat(800, { cam: "seat", camMs: 900, p: { desk: true }, ...sitI() }), free()],
    cv: [beat(600, { p: { cv: true } }), beat(1100, sitI({ head: "down", look: -0.3 })), beat(200, sitI({ head: "tilt" })), say(), free()],
    note: [beat(400, B({ pose: "write", sit: true, hold: "pen", holdL: "pad", head: null, look: 0 })), say(1200), free()],
    think: [beat(400, sitI({ head: "tilt" })), say(), free()],
    money: [beat(500, B({ pose: "type", sit: true, hold: null, holdL: null, head: "down", look: 0.4 })), beat(600, { p: { screen: true } }), beat(200, sitI()), say(), free()],
    perks: [beat(400, B({ pose: "give", face: -1, sit: true, hold: "pad", head: null })), say(400, { p: { sheet: true }, ...B({ hold: null }) }), beat(400, sitI()), free()],
    ask: [beat(300, sitI({ head: "nod" })), say(), free()],
    team: [beat(700, { cam: "glass", camMs: 900, ...B({ pose: "point", face: -1, sit: true, head: null, look: -0.6 }) }), beat(300, { p: { team: true } }), say(2200), beat(900, { cam: "seat", camMs: 900, p: { team: false }, ...sitI({ look: 0 }) }), free()],
    bye: [beat(400, B({ pose: "stand", sit: false, head: null, look: 0 })), beat(300, { cam: "near", camMs: 900, p: { desk: false } }), beat(400, B({ pose: "give", face: -1 })), beat(500, { hand: "shake" }), say(400, { hand: null, ...B({ pose: "hands", head: "nod" }) }), free()],
  },
  script: {
    "office-interview": { n1: "sit", n2: "cv", n3: "note", n4: "think", n5: "money", b6: "perks", n6: "ask", n7: "team", fin: "bye" },
  },
  css: `
.of-on{opacity:0;transform:translateY(30px);transition:opacity .35s ease,transform .5s cubic-bezier(.3,1.2,.5,1)}
.of-on.on{opacity:1;transform:none}
.of-hl{opacity:0;transition:opacity .4s}.of-hl.on{opacity:1;animation:of-glow 1.1s ease-in-out 3}
@keyframes of-glow{50%{opacity:.35}}
.of-knock{animation:of-knock .35s ease-out 3}
@keyframes of-knock{0%{opacity:0}50%{opacity:1}100%{opacity:0}}
.of-t3 .lf-ua.r{animation:of-sipu 10s ease-in-out infinite}.of-t3 .lf-fa.r{animation:of-sipf 10s ease-in-out infinite}
.of-t1 .lf-hd{animation:of-look 9s ease-in-out infinite}
@keyframes of-sipu{0%,55%,85%,100%{transform:rotate(-14deg)}62%,78%{transform:rotate(-4deg)}}
@keyframes of-sipf{0%,55%,85%,100%{transform:rotate(80deg)}62%,78%{transform:rotate(150deg)}}
@keyframes of-look{0%,50%,100%{transform:rotate(0)}60%,85%{transform:rotate(6deg)}}
`,
  Stage,
};
