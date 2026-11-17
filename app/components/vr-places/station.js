// VR өмір: ТЕМІРЖОЛ ВОКЗАЛЫ. Сағатты мұнаралы ғимарат → ауыр қос есік → билет залы: кету тақтасы әріптерін аударады, орындықта
// жолаушылар күтіп отыр → кассаға барамыз, Гүлмира шыны терезенің арғы жағында. Әр түйін: тақтадан Алматы пойыздарын көрсету,
// баға кестесі, орын іздеу, куәлікті алу, билетті басып шығару, билеттегі вагон мен орынды көрсету.
import { C, ST, Box, Cone, Pool, Shadow, Item, Person, Actor, Passerby, Horn, walkTo, beat, say, free } from "./kit";

const CASHIER = { f: true, skin: 1, hair: "#3B2416", hs: "bun", top: "#9B3B30", collar: C.surf, badge: C.gold };
const W1 = { skin: 0, hair: "#3B2416", hs: "short", top: "#5B87A8" };
const W2 = { f: true, skin: 2, hair: "#1E1A1A", hs: "scarf", scarf: C.gold, top: C.green };
const W3 = { skin: 1, hair: "#2B1A12", hs: "cap", cap: C.navy, top: "#7A4A21" };
const W4 = { f: true, skin: 0, hair: "#4E2F1B", hs: "long", top: C.teal };
const W5 = { skin: 2, hair: "#1E1A1A", hs: "short", top: C.red, glasses: true };

const spots = { desk: { x: 546, y: 382, s: 0.9 } };
const shots = {
  wide: { x: 400, y: 236, z: 1, a: "m" },
  door: { x: 400, y: 282, z: 1.8, a: "m" },
  through: { x: 400, y: 300, z: 4.2, a: "m" },
  entry: { x: 400, y: 210, z: 1.1, a: "m" },
  board: { x: 230, y: 150, z: 1.55, a: "m" },
  walk: { x: 430, y: 232, z: 1.06 },
  front: { x: 430, y: 232, z: 1.03 },
};

const Suitcase = ({ c = C.red }) => (
  <g><path d="M-22 -112v-26h44v26" fill="none" stroke="#5D6675" strokeWidth="5" /><rect x="-46" y="-112" width="92" height="108" rx="12" fill={c} />
    {[-22, 0, 22].map((x) => <path key={x} d={`M${x} -104V-12`} stroke="rgba(0,0,0,.18)" strokeWidth="5" />)}<circle cx="-30" cy="0" r="6" fill={C.ink} /><circle cx="30" cy="0" r="6" fill={C.ink} /></g>
);
function Roller({ o, y, s = 0.5, x0, x1, d = 16, delay = 0, seed = 1, c }) {
  const dir = x1 > x0 ? 1 : -1;
  return (
    <g className="lf-pass" style={{ transform: `translate(${(x0 + x1) / 2}px, ${y}px) scale(${s})`, "--x0": `${x0}px`, "--x1": `${x1}px`, "--y": `${y}px`, "--s": s, animationDuration: `${d}s`, animationDelay: `${delay}s` }}>
      <Shadow op={0.16} rx={90} />
      <g style={{ transform: `scaleX(${dir})` }}><g transform="translate(72 0)"><Suitcase c={c} /></g><path d="M30 -128L50 -142" stroke="#5D6675" strokeWidth="5" /><Person o={o} pose="walk" hold="st-x" seed={seed} /></g>
    </g>
  );
}
// Билет: жоғарғы жолақ, бағыт, вагон/орын
const Ticket = ({ s = 1, big }) => (
  <g transform={`scale(${s})`}>
    <rect x="-40" y="-22" width="80" height="44" rx="3" fill={C.surf} stroke="#CFC6B2" strokeWidth="1.5" />
    <rect x="-40" y="-22" width="80" height="10" rx="2" fill={C.blue} />
    <text x="-34" y="-1" fontSize="8" fontWeight="800" fill={C.ink}>→ АЛМАТЫ</text>
    <text x="-34" y="9" fontSize="6.5" fontWeight="700" fill="#5D6675">19:40 · 2-жол</text>
    <g className={big ? "st-hl" : undefined}><rect x="-36" y="12" width="72" height="9" rx="2" fill={big ? C.goldS : "none"} /><text x="0" y="19" textAnchor="middle" fontSize="6.5" fontWeight="800" fill={C.deep}>7 ВАГОН · 12 ОРЫН</text></g>
  </g>
);
const HAND = { give: [116, -132], hands: [33, -118] };
function Held({ w }) {
  const at = HAND[w?.pose];
  if (w?.hold !== "st-tkt" || !at) return null;
  return <g className="st-held" style={{ transform: `translate(${at[0]}px, ${at[1]}px) rotate(-10deg)` }}><Ticket s={0.7} /></g>;
}

/* ── Вокзал алды ── */
function Front({ st }) {
  const open = st.p.door;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="320" fill="#CFE6EC" />
      <path d="M-40 150h80v-40h50v60h40V260H-40ZM700 260V90h60v50h80v120Z" fill="#B7CCD5" />
      <rect x="90" y="110" width="620" height="280" fill="#E8D9BC" />
      <path d="M80 100H720V120H80Z" fill={C.wood2} />
      {/* мұнара мен сағат */}
      <rect x="320" y="-10" width="160" height="130" fill="#E2CDA6" />
      <path d="M310 -10H490L400 -60Z" fill={C.green} />
      <circle cx="400" cy="46" r="40" fill={C.surf} stroke={C.wood2} strokeWidth="6" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => <path key={a} transform={`translate(400 46) rotate(${a})`} d="M0 -33v6" stroke={C.ink} strokeWidth={a % 90 ? 1.5 : 3} />)}
      <path d="M400 46L388 30" stroke={C.ink} strokeWidth="4" strokeLinecap="round" />
      <g className="st-min"><path d="M400 46V16" stroke={C.red} strokeWidth="3" strokeLinecap="round" /></g>
      <circle cx="400" cy="46" r="3.5" fill={C.ink} />
      <Box x={230} y={126} w={340} h={54} r={8} c={C.blue} sh="rgba(15,40,50,.3)" />
      <text x="400" y="164" textAnchor="middle" fontSize="30" fontWeight="700" letterSpacing="7" fill={C.cream} style={{ fontFamily: "var(--head)" }}>ВОКЗАЛ</text>
      <Horn x={258} y={153} s={0.6} c={C.gold} /><Horn x={542} y={153} s={0.6} c={C.gold} />
      {/* доғал терезелер */}
      {[130, 210, 530, 610].map((x) => (
        <g key={x}>
          <path d={`M${x} 360V240Q${x + 30} 200 ${x + 60} 240V360Z`} fill={C.wood2} />
          <path d={`M${x + 6} 354V242Q${x + 30} 210 ${x + 54} 242V354Z`} fill="#F6D9A0" />
          <path d={`M${x + 30} 220V354M${x + 6} 290H${x + 54}`} stroke={C.wood2} strokeWidth="4" />
        </g>
      ))}
      {/* қос есік */}
      <path d="M330 388V250Q400 196 470 250V388Z" fill={C.wood2} />
      <path d="M338 388V252Q400 206 462 252V388Z" fill="#F8DFA8" />
      <g transform="translate(338 236)"><g className="lf-mv" style={{ transform: open ? "scaleX(0.18) skewY(-10deg)" : "none" }}>
        <path d="M0 152V18Q30 -10 62 -14V152Z" fill={C.wood} /><rect x="10" y="30" width="42" height="56" rx="3" fill="#BFD9DD" /><rect x="10" y="98" width="42" height="44" rx="3" fill="none" stroke={C.wood2} strokeWidth="2" strokeDasharray="4 4" /><rect x="52" y="80" width="5" height="24" rx="2" fill={C.gold} />
      </g></g>
      <g transform="translate(462 236)"><g className="lf-mv" style={{ transform: open ? "scaleX(0.18) skewY(10deg)" : "none" }}>
        <path d="M0 152V18Q-30 -10 -62 -14V152Z" fill={C.wood} /><rect x="-52" y="30" width="42" height="56" rx="3" fill="#BFD9DD" /><rect x="-52" y="98" width="42" height="44" rx="3" fill="none" stroke={C.wood2} strokeWidth="2" strokeDasharray="4 4" /><rect x="-57" y="80" width="5" height="24" rx="2" fill={C.gold} />
      </g></g>
      <rect x="-40" y="388" width="880" height="110" fill="#CDBFA6" />
      <path d="M-40 388h880" stroke="#B3A386" strokeWidth="4" />
      {[-20, 70, 160, 250, 340, 430, 520, 610, 700, 790].map((x) => <path key={x} d={`M${x} 392l-26 70`} stroke="#BBAA8C" strokeWidth="2" />)}
      {[310, 330, 350].map((y, i) => <rect key={y} x={300 - i * 10} y={y + 78} width={200 + i * 20} height="8" fill="#BBAA8C" opacity=".6" />)}
      <rect x="60" y="250" width="8" height="140" fill="#3A3F4E" /><path d="M48 250h32l-6-20H54Z" fill="#3A3F4E" /><circle cx="64" cy="254" r="6" fill={C.gold2} />
      <Roller o={W4} y={450} s={0.62} x0={-80} x1={900} d={19} delay={-7} seed={3} c={C.teal} />
      <Passerby o={W3} y={458} s={0.66} x0={900} x1={-80} d={22} delay={-15} seed={5} />
    </g>
  );
}

/* ── Билет залы ── */
const ROWS = [["08:10", "АЛМАТЫ", "1", true], ["12:35", "ҚАРАҒАНДЫ", "3"], ["16:20", "ПАВЛОДАР", "4"], ["19:40", "АЛМАТЫ", "2", true], ["21:05", "ТҮРКІСТАН", "5"]];
function Hall({ st, talk, mood }) {
  const p = st.p, w = st.a.npc;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="310" fill="#EADCC0" />
      {[0, 200, 600].map((x) => (
        <g key={x}><path d={`M${x + 20} 200V60Q${x + 90} -10 ${x + 160} 60V200Z`} fill="#D6C29C" /><path d={`M${x + 30} 196V64Q${x + 90} 4 ${x + 150} 64V196Z`} fill="#CFE6EC" />
          <path d={`M${x + 90} 20V196M${x + 30} 120H${x + 150}`} stroke="#D6C29C" strokeWidth="5" /></g>
      ))}
      {[340, 460].map((x) => <Cone key={x} x={x} y={-10} w={170} h={280} top={12} op={0.14} />)}
      {/* кету тақтасы */}
      <rect x="60" y="20" width="330" height="150" rx="8" fill={C.navy} />
      <text x="76" y="42" fontSize="12" fontWeight="800" letterSpacing="2" fill={C.gold2}>КЕТУ</text>
      <text x="374" y="42" textAnchor="end" fontSize="10" fontWeight="800" fill="#8FA9AF">ЖОЛ</text>
      {ROWS.map(([t, c, g, al], i) => (
        <g key={t} className={`st-row${p.flip && i === 3 ? " flip" : ""}${i === 1 ? " idle" : ""}`} style={{ transformOrigin: `225px ${59 + i * 22}px` }}>
          <rect x="70" y={50 + i * 22} width="310" height="19" rx="2" fill={p.hl && al ? "#5A4A1E" : "#2A3656"} />
          <text x="78" y={64 + i * 22} fontSize="12" fontWeight="700" fill={C.gold2} style={{ fontFamily: "monospace" }}>{t}</text>
          <text x="132" y={64 + i * 22} fontSize="12" fontWeight="700" fill="#F4F1E6" style={{ fontFamily: "monospace" }}>{c}</text>
          <text x="370" y={64 + i * 22} textAnchor="end" fontSize="12" fontWeight="700" fill={C.gold2} style={{ fontFamily: "monospace" }}>{g}</text>
        </g>
      ))}
      <path d="M-40 262H840V500H-40Z" fill="#C9B48E" />
      {[-300, -150, 0, 150, 300, 450, 600, 750, 900, 1050].map((x) => <path key={x} d={`M${400 + (x - 400) * 0.3} 262L${x} 500`} stroke="#B8A27A" strokeWidth="2" />)}
      {[290, 330, 390].map((y) => <path key={y} d={`M-40 ${y}H840`} stroke="#B8A27A" strokeWidth="1.6" />)}
      {/* күту орындықтары */}
      <g className="st-read"><Actor a={{ x: 90, y: 300, s: 0.5 }}><Person o={W1} pose="sit" hold="book" look={0.2} seed={2} /></Actor></g>
      <Actor a={{ x: 150, y: 300, s: 0.5 }}><Person o={W2} pose="sit" look={-0.3} head="down" seed={7} /></Actor>
      <g className="st-doze"><Actor a={{ x: 250, y: 300, s: 0.5 }}><Person o={W5} pose="sit" seed={4} /></Actor></g>
      <rect x="50" y="284" width="250" height="14" rx="4" fill={C.wood} /><rect x="60" y="298" width="8" height="20" fill={C.wood2} /><rect x="282" y="298" width="8" height="20" fill={C.wood2} />
      <g transform="translate(206 318) scale(.4)"><Suitcase c={C.navy} /></g>
      <Roller o={W3} y={352} s={0.62} x0={-80} x1={880} d={20} delay={-4} seed={5} c={C.red} />
      <Passerby o={W4} y={340} s={0.58} x0={880} x1={-80} d={24} delay={-13} seed={3} />
      {/* касса: қабырға, шыны терезе (жақындағанда үлкейеді) */}
      <g className="lf-mv st-near" style={{ transform: p.near ? "none" : "translate(400px, 200px) scale(0.8) translate(-400px, -200px)" }}>
        <path d="M410 70H700V330H410Z" fill="#F4E7C8" /><rect x="410" y="200" width="290" height="10" fill="#E2CDA6" />
        <Actor a={w} dur={w?.dur}>
          <Person o={CASHIER} pose={w?.pose} talk={talk} mood={mood} look={w?.look || 0} head={w?.head} hold={w?.hold} seed={2} />
          <Held w={w} />
        </Actor>
        <g transform="translate(640 276)"><rect x="-34" y="-30" width="68" height="48" rx="4" fill="#5D6675" /><rect x="-29" y="-25" width="58" height="38" rx="2" fill={p.screen ? "#9FD3B4" : "#3E4A5C"} /><rect x="-5" y="18" width="10" height="16" fill="#5D6675" /></g>
        <g transform="translate(470 312)">
          <rect x="-26" y="-12" width="52" height="24" rx="4" fill="#8B9698" />
          <g className={`st-print${p.print ? " on" : ""}`}><rect x="-18" y="-40" width="36" height="30" fill={C.surf} stroke="#CFC6B2" /><rect x="-18" y="-40" width="36" height="6" fill={C.blue} /></g>
          <rect x="-20" y="-14" width="40" height="5" rx="2" fill="#2E3440" />
        </g>
        {/* шыны */}
        <path d="M430 330V150Q555 96 680 150V330Z" fill="#CFE6EC" opacity=".28" />
        <path d="M450 160l40 -20M450 182l24 -12M640 300l24 -12" stroke="#fff" strokeWidth="4" opacity=".6" />
        {/* қабырға жақтаулары */}
        <path d="M370 40H770V500H370ZM430 330V150Q555 96 680 150V330Z" fill="#B98A57" fillRule="evenodd" />
        <path d="M430 330V150Q555 96 680 150V330" fill="none" stroke={C.wood2} strokeWidth="8" />
        <path d="M382 52H758" stroke={ST} strokeWidth="1.5" strokeDasharray="5 5" />
        <rect x="480" y="56" width="150" height="34" rx="4" fill={C.surf} /><text x="555" y="80" textAnchor="middle" fontSize="16" fontWeight="800" letterSpacing="2" fill={C.deep}>КАССА 3</text>
        <Horn x={400} y={190} s={0.9} c={C.gold} /><Horn x={400} y={280} s={0.9} c={C.gold} />
        {/* баға тақтайшасы */}
        <g className={`st-price${p.prices ? " on" : ""}`}>
          <rect x="692" y="206" width="74" height="76" rx="5" fill={C.surf} stroke={C.blue} strokeWidth="2" />
          <text x="729" y="224" textAnchor="middle" fontSize="8.5" fontWeight="800" fill={C.blue}>АЛМАТЫ</text>
          <text x="698" y="242" fontSize="8" fontWeight="700" fill={C.ink}>Плацкарт</text><text x="760" y="254" textAnchor="end" fontSize="9" fontWeight="800" fill={C.deep}>9 000</text>
          <text x="698" y="266" fontSize="8" fontWeight="700" fill={C.ink}>Купе</text><text x="760" y="276" textAnchor="end" fontSize="9" fontWeight="800" fill={C.deep}>15 000</text>
        </g>
        {/* сөре мен науа */}
        <rect x="360" y="326" width="420" height="22" rx="4" fill={C.wood} />
        <path d="M500 330h110l-8 14H508Z" fill="#8B9698" />
        <path d="M370 348H770V470H370Z" fill={C.wood2} />
        <path d="M382 360H758V462H382Z" fill="none" stroke={ST} strokeWidth="1.5" strokeDasharray="5 5" />
        <g className={`st-on${p.id ? " on" : ""}`}><Item k="card" x={540} y={336} s={1} /></g>
        <g className={`st-on${p.tkt ? " on" : ""}`}><g transform="translate(570 336) rotate(-4)"><Ticket s={0.9} /></g></g>
      </g>
      {/* билетті жақыннан көрсету */}
      <g className={`st-zoom${p.zoom ? " on" : ""}`}><g transform="translate(330 286) rotate(-5)"><Ticket s={2.3} big /></g></g>
    </g>
  );
}

function Stage({ st, talk, mood }) {
  return (
    <>
      <g className={`lf-set${st.set === "out" ? "" : " off"}`}><Front st={st} /></g>
      <g className={`lf-set${st.set === "in" ? "" : " off"}`}><Hall st={st} talk={talk} mood={mood} /></g>
    </>
  );
}

const A = (patch) => ({ a: { npc: patch } });

export default {
  spots,
  shots,
  dip: "#F4E7C8",
  init: { set: "out", cam: "wide", p: { door: false, near: false }, a: { npc: { at: "desk", pose: "type", look: 0.4, head: "down" } } },
  intro: [
    beat(900),
    beat(1500, { cam: "door", walk: true }),
    beat(700, { walk: false, p: { door: true } }),
    beat(900, { cam: "through", walk: true }),
    beat(380, { dip: true }),
    beat(60, { set: "in", cam: "entry", camMs: 0 }),
    beat(700, { dip: false }),
    beat(1300, { cam: "board", camMs: 1300 }),
    beat(1300, { p: { flip: true } }),
    beat(1700, { cam: "walk", walk: true, p: { near: true } }),
    beat(500, { walk: false, cam: "front", camMs: 800 }),
    beat(600, A({ pose: "hands", head: null, look: 0 })),
  ],
  acts: {
    talk: [beat(250, A({ pose: "hands", hold: null, head: null, look: 0 })), say(), free()],
    hi: [beat(400, A({ pose: "hands", head: "nod", look: 0 })), say(), free()],
    trains: [beat(900, A({ pose: "type", head: "down", look: 0.4 })), beat(300, { p: { hl: true, screen: true } }), say(300, A({ pose: "point", face: -1, look: -0.8, head: null })), beat(1600), beat(0, A({ pose: "hands", look: 0 })), free()],
    cls: [beat(300, A({ pose: "hands", head: "tilt", look: 0 })), say(), free()],
    prices: [beat(500, { p: { prices: true }, ...A({ pose: "point", face: 1, look: 0.7, head: null }) }), say(1400), beat(0, A({ pose: "hands", look: 0 })), free()],
    seat: [beat(1200, A({ pose: "type", head: "down", look: 0.4 })), say(500, A({ pose: "hands", head: "nod", look: 0 })), free()],
    id: [beat(400, A({ pose: "give", face: -1, head: null, look: 0 })), say(1000), beat(300, { hand: "card" }), beat(0, A({ pose: "hands" })), free()],
    ticket: [
      beat(500, { hand: null, p: { id: true } }), beat(600, { p: { id: false }, ...A({ pose: "give", face: -1, hold: "card" }) }),
      beat(900, A({ pose: "hands", head: "down", look: -0.2 })), beat(1000, A({ pose: "type", hold: null, look: 0.4 })),
      beat(1000, { p: { print: true } }), beat(500, { p: { print: false }, ...A({ pose: "give", face: -1, hold: "st-tkt", head: null, look: -0.3 }) }),
      say(400, { p: { tkt: true, id: true }, ...A({ hold: null }) }), beat(0, A({ pose: "hands" })), free(),
    ],
    where: [beat(500, { p: { zoom: true }, ...A({ pose: "point", face: -1, look: -0.4, head: "down" }) }), say(1600), beat(0, A({ pose: "hands", head: null, look: 0 })), free()],
    bye: [beat(300, { p: { zoom: false }, ...A({ pose: "wave", head: "nod", look: 0 }) }), say(1200), beat(0, A({ pose: "hands", head: null })), free()],
  },
  script: {
    "station-ticket": { n1: "hi", n2: "trains", n3: "cls", p4: "prices", n4: "seat", n5: "id", n6: "ticket", n7: "where", fin: "bye" },
  },
  css: `
.st-held{transform-box:view-box;transform-origin:0 0;animation:st-in .35s .15s ease both}
.st-on{opacity:0;transform:translateY(-14px);transition:opacity .35s ease,transform .45s cubic-bezier(.3,1.3,.5,1)}
.st-on.on{opacity:1;transform:none}
.st-near{transition-duration:1.7s!important}
.st-print{transform:translateY(26px);transition:transform .9s linear}.st-print.on{transform:none}
.st-price{opacity:0;transform:scaleY(0);transform-origin:730px 206px;transition:opacity .3s,transform .5s cubic-bezier(.3,1.3,.5,1)}.st-price.on{opacity:1;transform:none}
.st-row.flip{animation:st-flip .9s steps(1) 1}
.st-row.idle{animation:st-flap 9s ease-in-out infinite}
.st-zoom{opacity:0;transform:translateY(160px);transition:opacity .4s ease,transform .6s cubic-bezier(.3,1.2,.4,1);pointer-events:none}.st-zoom.on{opacity:1;transform:none}
.st-hl{animation:st-pulse .7s ease-in-out 3}
.st-min{transform-origin:400px 46px;animation:st-tick 60s steps(60) infinite}
.st-read .lf-face{animation:st-look 8s ease-in-out infinite}
.st-doze .lf-hd{animation:st-doze 5s ease-in-out infinite}
@keyframes st-in{from{opacity:0}to{opacity:1}}
@keyframes st-flip{0%{transform:scaleY(1)}15%{transform:scaleY(.1)}30%{transform:scaleY(1)}45%{transform:scaleY(.1)}60%{transform:scaleY(1)}}
@keyframes st-flap{0%,88%,100%{transform:scaleY(1)}92%{transform:scaleY(.08)}96%{transform:scaleY(1)}}
@keyframes st-pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes st-tick{to{transform:rotate(360deg)}}
@keyframes st-look{0%,45%,100%{transform:translate(0,5px)}55%,90%{transform:translate(4px,5px)}}
@keyframes st-doze{0%,100%{transform:rotate(0)}50%{transform:rotate(9deg)}}
`,
  Stage,
};
