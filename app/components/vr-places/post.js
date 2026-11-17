// VR өмір: ПОШТА. Көше (сары пошта жәшігі, есік) → ішке кіреміз: алдыңғы клиент түбіртегін алып, шығып кетеді → терезеге жақындаймыз.
// Түйіндер: сәлемдемені үстелге қою, «сынғыш» жапсырмасы, таразы (3,0 кг), мекенжай жазу, тариф тақтасы, картамен төлеу,
// трек-нөмірлі жапсырма басылып, мөр соғылады, түбіртек беріледі; соңында қызметкер қорапты сөреге апарады.
import { C, ST, Box, Cone, Pool, Item, Person, Actor, Passerby, Horn, walkTo, beat, say, free } from "./kit";

const CLERK = { skin: 1, hair: "#2B1A12", hs: "short", top: C.blue, collar: C.gold2, badge: C.gold, glasses: true };
const CUST = { skin: 0, hair: "#3B2416", hs: "short", top: "#7A4A21", coat: true, shirt: "#E9D9B8" };
const POSTMAN = { skin: 2, hair: "#1E1A1A", hs: "cap", cap: C.blue, top: C.blue, vest: C.gold };
const BOXER = { f: true, skin: 0, hair: "#4E2F1B", hs: "long", top: "#5B3FA8" };
const WRITER = { skin: 1, hair: "#1E1A1A", hs: "short", top: C.green, glasses: true };
const P1 = { f: true, skin: 2, hair: "#2B1A12", hs: "scarf", scarf: C.red, top: "#4E6E8E" };
const BLUE = C.blue;

const spots = {
  desk: { x: 620, y: 470, s: 1 },
  back: { x: 720, y: 338, s: 0.74 },
  mid: { x: 690, y: 400, s: 0.86 },
  cust: { x: 446, y: 470, s: 1 },
  out: { x: -120, y: 520, s: 1.15 },
};
const shots = {
  wide: { x: 400, y: 236, z: 1, a: "m" },
  door: { x: 400, y: 290, z: 1.9, a: "m" },
  through: { x: 400, y: 300, z: 4.4, a: "m" },
  entry: { x: 410, y: 222, z: 1.04, a: "m" },
  walk: { x: 560, y: 250, z: 1.1 },
  win: { x: 600, y: 262, z: 1.2 },
  shelf: { x: 640, y: 250, z: 1.08 },
};

/* ── Көше ── */
function Street({ st }) {
  const open = st.p.door;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="300" fill="#CFE6EC" />
      <path d="M-40 150h80v-60h60v170H-40Z" fill="#B7CCD5" /><path d="M690 260V80h50v30h100v150Z" fill="#B7CCD5" />
      <rect x="110" y="50" width="580" height="340" fill="#F1E4C6" />
      <rect x="110" y="50" width="580" height="16" fill={BLUE} />
      {[90, 150].map((y) => <path key={y} d={`M110 ${y + 210}h580`} stroke="#E2D2AE" strokeWidth="3" />)}
      <Box x={236} y={80} w={328} h={62} r={8} c={BLUE} sh="rgba(15,40,60,.3)" />
      <text x="420" y="122" textAnchor="middle" fontSize="32" fontWeight="700" letterSpacing="7" fill={C.cream} style={{ fontFamily: "var(--head)" }}>ПОШТА</text>
      {/* конверт белгісі */}
      <g transform="translate(278 111)"><rect x="-20" y="-13" width="40" height="26" rx="3" fill={C.gold2} /><path d="M-20 -13L0 3L20 -13" stroke={BLUE} strokeWidth="2.4" fill="none" /></g>
      {/* терезелер */}
      {[[146, 316], [486, 656]].map(([a, b]) => (
        <g key={a}><rect x={a} y="178" width={b - a} height="150" rx="6" fill={BLUE} /><rect x={a + 8} y="186" width={b - a - 16} height="134" rx="3" fill="#F6E7C6" />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={a + 20 + i * 36} y={230 + (i % 2) * 8} width="28" height={34 - (i % 2) * 8} rx="2" fill={["#C98A3E", "#B8322A", "#E0A526", "#86532B"][i]} />)}
          <rect x={a + 8} y="270" width={b - a - 16} height="6" fill={C.wood} />
          <path d={`M${(a + b) / 2} 186v134`} stroke={BLUE} strokeWidth="6" /><path d={`M${a + 14} 196l40 0M${a + 14} 204l24 0`} stroke="#fff" strokeWidth="3" opacity=".6" /></g>
      ))}
      {/* есік */}
      <rect x="352" y="196" width="96" height="192" fill={BLUE} />
      <rect x="360" y="204" width="80" height="184" fill="#F8E6BC" />
      <g transform="translate(360 204)">
        <g className="lf-mv" style={{ transform: open ? "scaleX(0.16) skewY(-10deg)" : "none" }}>
          <rect width="80" height="184" fill={C.blue2} />
          <rect x="9" y="10" width="62" height="104" rx="3" fill="#BFD9DD" /><path d="M17 20l22 0M17 28l12 0" stroke="#fff" strokeWidth="3" opacity=".6" />
          <rect x="18" y="126" width="44" height="34" rx="2" fill="none" stroke={C.gold2} strokeWidth="2" strokeDasharray="4 4" />
          <rect x="62" y="98" width="6" height="28" rx="3" fill={C.gold} />
        </g>
      </g>
      {/* пошта жәшігі */}
      <g transform="translate(560 336)">
        <rect x="-26" y="-50" width="52" height="64" rx="8" fill={C.gold} />
        <rect x="-16" y="-38" width="32" height="5" rx="2" fill={C.ink} />
        <path d="M-12 -18h24v14h-24ZM-12 -18l12 8 12-8" fill="none" stroke={BLUE} strokeWidth="2" />
        <rect x="-4" y="14" width="8" height="38" fill="#3A3F4E" />
      </g>
      <rect x="-40" y="388" width="880" height="110" fill="#CDBFA6" />
      <path d="M-40 388h880" stroke="#B3A386" strokeWidth="4" />
      {[-20, 70, 160, 250, 340, 430, 520, 610, 700, 790].map((x) => <path key={x} d={`M${x} 392l-26 70`} stroke="#BBAA8C" strokeWidth="2" />)}
      <g transform="translate(60 390)"><rect x="-4" y="-180" width="8" height="180" fill="#3A3F4E" /><path d="M-14 -180h28l-5-18h-18Z" fill="#3A3F4E" /><circle cx="0" cy="-174" r="5" fill={C.gold2} /></g>
      <Passerby o={POSTMAN} y={452} s={0.64} x0={900} x1={-80} d={20} delay={-14} seed={2} />
      <Passerby o={P1} y={444} s={0.6} x0={-80} x1={900} d={24} delay={-5} seed={6} />
    </g>
  );
}

/* ── Пошта бөлімшесі ── */
const VP = [400, 160];
function Hall({ st, talk, mood }) {
  const p = st.p, w = st.a.npc, c = st.a.cust;
  const boxAt = p.box === "scale" || p.box === "gone" ? "translate(176px, -2px)" : "none";
  return (
    <g>
      <rect x="-40" y="-40" width="1120" height="300" fill="#F2E9D6" />
      <rect x="-40" y="-40" width="1120" height="24" fill={BLUE} />
      <rect x="-40" y="240" width="1120" height="14" fill="#DCCBA6" />
      <path d="M-40 252H1080V500H-40Z" fill="#CFC3AA" />
      {[-400, -200, 0, 200, 400, 600, 800, 1000, 1200, 1400, 1600].map((x) => <path key={x} d={`M${VP[0] + (x - VP[0]) * 0.3} 252L${x} 500`} stroke="#BFB295" strokeWidth="2" />)}
      {[284, 330, 400].map((y) => <path key={y} d={`M-40 ${y}H1080`} stroke="#BFB295" strokeWidth="1.6" />)}
      {[160, 400, 640].map((x) => <Cone key={x} x={x} y={-16} w={210} h={270} top={18} op={0.13} />)}
      {/* абоненттік жәшіктер (сол жақ қабырға) */}
      <g transform="translate(20 60)">
        <rect x="0" y="0" width="200" height="180" rx="4" fill="#C9B48A" />
        {Array.from({ length: 20 }, (_, i) => <g key={i}><rect x={8 + (i % 5) * 38} y={8 + Math.floor(i / 5) * 42} width="32" height="36" rx="2" fill="#E9DDBF" /><circle cx={34 + (i % 5) * 38} cy={26 + Math.floor(i / 5) * 42} r="2.4" fill={C.wood2} /></g>)}
        <g className="ps-lid"><rect x="122" y="92" width="32" height="36" rx="2" fill="#D9CBA6" /></g>
      </g>
      <g className="ps-box"><Actor a={{ x: 156, y: 330, s: 0.62 }}><Person o={BOXER} pose="reach" look={0.3} seed={4} /></Actor></g>
      {/* жазу үстелі */}
      <g className="ps-wr"><Actor a={{ x: 300, y: 330, s: 0.6 }}><Person o={WRITER} pose="write" hold="pen" holdL="pad" seed={6} /></Actor></g>
      <rect x="250" y="276" width="104" height="10" rx="3" fill={C.wood} /><path d="M258 286v46M346 286v46" stroke={C.wood2} strokeWidth="5" />
      <Passerby o={POSTMAN} y={300} s={0.5} x0={-60} x1={400} d={22} delay={-9} seed={9} />
      {/* артқы сөрелер: сәлемдемелер */}
      <rect x="400" y="60" width="680" height="184" fill="#E6D8B8" />
      {[110, 170, 230].map((y, r) => (
        <g key={y}>
          {Array.from({ length: 11 }, (_, i) => <g key={i}><rect x={420 + i * 58} y={y - 30 - (i + r) % 3 * 8} width={40 + (i % 2) * 8} height={30 + (i + r) % 3 * 8} rx="2" fill={["#C98A3E", "#B9772F", "#D9A75E"][(i + r) % 3]} /><path d={`M${430 + i * 58} ${y - 22 - (i + r) % 3 * 8}h16`} stroke={C.surf} strokeWidth="5" /></g>)}
          <rect x="404" y={y} width="672" height="8" fill={C.wood} />
        </g>
      ))}
      {/* тариф экраны (сөре үстінде) */}
      <g transform="translate(672 128)">
        <rect x="0" y="0" width="160" height="66" rx="5" fill={BLUE} />
        <g className={`ps-tar${p.tar === "slow" ? " hl" : ""}`}><rect x="6" y="6" width="148" height="25" rx="3" fill={C.surf} /><text x="12" y="23" fontSize="10.5" fontWeight="800" fill={BLUE}>ЖАЙ · 5 күн</text><text x="148" y="23" textAnchor="end" fontSize="11" fontWeight="800" fill={C.ink}>2 900 ₸</text></g>
        <g className={`ps-tar${p.tar === "fast" ? " hl" : ""}`}><rect x="6" y="35" width="148" height="25" rx="3" fill={C.gold2} /><text x="12" y="52" fontSize="10.5" fontWeight="800" fill={C.deep}>ЖЕДЕЛ · 2 күн</text><text x="148" y="52" textAnchor="end" fontSize="11" fontWeight="800" fill={C.ink}>4 500 ₸</text></g>
      </g>
      {/* қызметкер және алдыңғы клиент */}
      <Actor a={w} dur={w?.dur}>
        <Person o={CLERK} pose={w?.pose} talk={talk} mood={mood} look={w?.look || 0} head={w?.head} hold={w?.hold} holdL={w?.holdL} seed={1} />
        {w?.box && <g transform="translate(0 -168)"><Parcel lab fr={p.fr} /></g>}
      </Actor>
      <Actor a={c} dur={c?.dur}><Person o={CUST} pose={c?.pose} look={c?.look || 0} hold={c?.hold} head={c?.head} seed={5} /></Actor>
      {/* үстел */}
      <rect x="380" y="384" width="720" height="18" rx="4" fill="#ECE2CB" />
      <path d="M384 402H1096V500H384Z" fill={BLUE} />
      <path d="M396 414H1084V476H396Z" fill="none" stroke={ST} strokeWidth="1.5" strokeDasharray="5 5" />
      <Horn x={470} y={446} s={1} c={C.gold2} /><Horn x={780} y={446} s={1} c={C.gold2} /><Horn x={990} y={446} s={1} c={C.gold2} />
      <rect x="380" y="150" width="8" height="240" fill="#8B9698" /><path d="M396 170l30 -30M404 186l40 -40" stroke="#fff" strokeWidth="4" opacity=".3" />
      {/* жапсырма принтері */}
      <g transform="translate(470 384)">
        <rect x="-26" y="-30" width="52" height="30" rx="5" fill="#3A3F4E" /><rect x="-18" y="-24" width="36" height="5" rx="2" fill={C.ink} />
        <g className={`ps-lab${p.print ? " on" : ""}${p.stuck ? " gone" : ""}`}><Label /></g>
      </g>
      {/* таразы */}
      <g transform="translate(736 384)">
        <rect x="-44" y="-12" width="88" height="12" rx="3" fill="#DCE3E4" /><rect x="-40" y="-16" width="80" height="6" rx="2" fill="#B8C6C8" />
        <rect x="-30" y="0" width="60" height="16" rx="2" fill="#2E3440" />
        <text x="0" y="12" textAnchor="middle" fontSize="11" fontWeight="800" fill="#7BE0A0">{p.box === "scale" ? "3,0 кг" : "0,0 кг"}</text>
      </g>
      {/* біздің сәлемдеме */}
      <g className={`ps-on${p.box ? " on" : ""}`}><g className="lf-mv" style={{ transform: boxAt, opacity: p.box === "gone" ? 0 : 1, transitionDuration: p.box === "gone" ? ".2s" : ".9s" }}>
        <g transform="translate(560 366)"><Parcel lab={p.stuck} fr={p.fr} /></g>
      </g></g>
      {/* терминал, түбіртек, мөр */}
      <g className="lf-mv" style={{ transform: p.term ? "translate(30px, 40px)" : "none" }}><Item k="terminal" x={432} y={374} s={0.95} />
        {p.paid && <g className="ps-ok"><circle cx="432" cy="336" r="11" fill="#2F8F5B" /><path d="M427 336l4 4 7-8" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" /></g>}</g>
      <g className={`ps-on${p.rec ? " on" : ""}`}><g transform="translate(624 392) rotate(-5)">
        <rect x="-20" y="-14" width="40" height="26" rx="1" fill={C.surf} stroke="#CFC6B2" /><path d="M-14 -8h22M-14 -3h16M-14 2h22" stroke="#9AA3B0" strokeWidth="1.3" />
        <g className={`ps-mark${p.stamp ? " on" : ""}`}><circle cx="10" cy="4" r="7" fill="none" stroke={BLUE} strokeWidth="1.6" /><path d="M6 4h8" stroke={BLUE} strokeWidth="1.4" /></g>
      </g></g>
      <g className={`ps-stamp${p.stamp ? " on" : ""}`}><g transform="translate(634 360)"><rect x="-6" y="-26" width="12" height="18" rx="5" fill={C.wood2} /><rect x="-10" y="-8" width="20" height="8" rx="2" fill={C.ink} /></g></g>
      <Pool x={620} y={392} rx={190} ry={8} op={0.2} />
    </g>
  );
}

function Parcel({ lab, fr }) {
  return (
    <g>
      <rect x="-36" y="-30" width="72" height="48" rx="2" fill="#C98A3E" />
      <path d="M-36 -30L-26 -38H46L36 -30Z" fill="#D9A75E" /><path d="M36 -30L46 -38V10L36 18Z" fill="#A9712F" />
      <path d="M-4 -30V18M-36 -6H36" stroke="#E9D2A0" strokeWidth="5" />
      {fr && <g><rect x="-32" y="-26" width="26" height="16" rx="2" fill={C.red} /><path d="M-22 -23h6l-1 6h-4ZM-19 -17v4M-22 -13h6" stroke={C.surf} strokeWidth="1.4" fill="none" /></g>}
      {lab && <g transform="translate(14 4)"><Label /></g>}
    </g>
  );
}
function Label() {
  return (
    <g><rect x="-16" y="-10" width="32" height="20" rx="1" fill={C.surf} stroke="#CFC6B2" />
      <g stroke={C.ink}>{[-12, -9, -7, -4, -1, 1, 4, 6, 9, 12].map((x, i) => <path key={x} d={`M${x} -6v9`} strokeWidth={i % 3 ? 1 : 2} />)}</g>
      <path d="M-12 6h24" stroke="#9AA3B0" strokeWidth="1.2" /></g>
  );
}

function Stage({ st, talk, mood }) {
  return (
    <>
      <g className={`lf-set${st.set === "out" ? "" : " off"}`}><Street st={st} /></g>
      <g className={`lf-set${st.set === "in" ? "" : " off"}`}><Hall st={st} talk={talk} mood={mood} /></g>
    </>
  );
}

const K = (patch) => ({ a: { npc: patch } });
const idle = (extra = {}) => K({ pose: "hands", head: null, hold: null, holdL: null, look: 0, ...extra });

export default {
  spots,
  shots,
  dip: "#F2E9D6",
  init: { set: "out", cam: "wide", p: { door: false }, a: { npc: { at: "desk", pose: "give", face: -1, hold: "bill", look: -0.5 }, cust: { at: "cust", pose: "hands", look: 0.5 } } },
  intro: [
    beat(900),
    beat(1500, { cam: "door", walk: true }),
    beat(650, { walk: false, p: { door: true } }),
    beat(900, { cam: "through", walk: true }),
    beat(380, { dip: true }),
    beat(60, { set: "in", cam: "entry", camMs: 0 }),
    beat(700, { dip: false }),
    beat(600, { a: { cust: { pose: "give", hold: "bill" }, npc: { hold: null } } }),
    beat(500, { a: { cust: { head: "nod" }, npc: { pose: "wave", face: 1, look: -0.4, head: "nod" } } }),
    beat(1500, { a: { cust: { at: "out", pose: "walk", dur: 1500, head: null } }, cam: "walk", walk: true, camMs: 1500 }),
    beat(200, { a: { cust: { hide: true }, npc: { pose: "hands", head: null, hold: null, look: 0.2 } } }),
    beat(700, { walk: false, cam: "win", camMs: 900 }),
  ],
  acts: {
    talk: [beat(300, idle()), say(), free()],
    next: [beat(300, idle({ look: 0 })), say(300, K({ pose: "wave", head: null })), beat(600, idle()), free()],
    put: [beat(700, { p: { box: "desk" } }), beat(500, K({ pose: "give", face: -1, look: -0.5, head: "tilt" })), say(600, K({ head: null })), beat(0, idle()), free()],
    fragile: [beat(300, K({ pose: "give", face: -1, look: -0.5, head: null })), say(500, { p: { fr: true } }), beat(400, idle()), free()],
    weigh: [beat(400, K({ pose: "give", face: -1, look: -0.5, head: null })), beat(900, { p: { box: "scale" }, ...K({ pose: "point", face: 1, look: 0.6 }) }), say(800), beat(0, idle()), free()],
    write: [beat(400, K({ pose: "write", hold: "pen", holdL: "pad", head: null, look: 0 })), say(1500), free()],
    tariff: [beat(300, K({ pose: "point", hold: null, holdL: null, head: null, look: 0.5 })), say(600, { p: { tar: "both" } }), beat(1200, { p: { tar: "fast" } }), beat(1200, { p: { tar: "slow" } }), beat(0, idle()), free()],
    slow: [beat(300, { p: { tar: "slow" }, ...idle({ head: "nod" }) }), say(500, { p: { term: true } }), beat(0, K({ pose: "type", head: null })), free()],
    receipt: ({ st }) => [
      beat(300, { p: { term: true, tar: st.p.tar === "slow" ? "slow" : "fast" }, ...K({ pose: "type", head: null, hold: null, holdL: null }) }),
      beat(900, { hand: "card" }), beat(450, { p: { paid: true } }), beat(300, { hand: null }),
      beat(1100, { p: { print: true, term: false } }),
      beat(700, K({ pose: "give", face: -1, look: -0.4 })), beat(300, { p: { stuck: true } }),
      beat(300, { p: { rec: true } }), beat(500, { p: { stamp: true } }),
      beat(200, K({ pose: "give", face: -1, look: 0, hold: "bill" })), say(500, K({ hold: null })), beat(0, idle()), free(),
    ],
    bye: [beat(300, K({ pose: "wave", head: "nod", look: 0 })), say(1200), free(),
      beat(400, { p: { box: "gone" }, ...K({ pose: "carry", head: null, box: true }) }),
      beat(1100, { cam: "shelf", camMs: 1200, a: { npc: { at: "back", pose: "walk", dur: 1100 } } }),
      beat(500, K({ pose: "reach", box: false, look: 0.5 })), beat(300, { p: { shelved: true } }), beat(0, K({ pose: "stand", look: -0.3 }))],
  },
  script: {
    "post-parcel": { n1: "next", n2: "put", f3: "fragile", n3: "weigh", n4: "write", n5: "tariff", s6: "slow", n6: "receipt", fin: "bye" },
  },
  css: `
.ps-on{opacity:0;transform:translateY(-14px);transition:opacity .35s ease,transform .45s cubic-bezier(.3,1.3,.5,1)}
.ps-on.on{opacity:1;transform:none}
.ps-tar{transition:opacity .3s}.ps-tar.hl{animation:ps-hl 1s ease-in-out 2}
.ps-lab{transform-box:fill-box;transform-origin:50% 0;transform:translateY(-14px) scaleY(0);opacity:0;transition:transform 1s ease-out,opacity .3s}
.ps-lab.on{transform:translateY(8px);opacity:1}.ps-lab.gone{opacity:0}
.ps-stamp{opacity:0;transform:translateY(-30px)}.ps-stamp.on{animation:ps-thump .9s ease-in-out both}
.ps-mark{opacity:0}.ps-mark.on{opacity:1;transition:opacity .2s .45s}
.ps-ok{transform-box:fill-box;transform-origin:50% 50%;animation:vr-stamp .5s ease-out both}
.ps-box .lf-fa.r{animation:ps-dig 4s ease-in-out infinite}
.ps-lid{transform-box:fill-box;transform-origin:0 50%;animation:ps-lid 8s ease-in-out infinite}
.ps-wr .lf-hd{animation:ps-think 7s ease-in-out infinite}
@keyframes ps-hl{50%{opacity:.55}}
@keyframes ps-thump{0%{opacity:0;transform:translateY(-30px)}25%{opacity:1;transform:translateY(-20px)}50%{opacity:1;transform:translateY(0)}75%{opacity:1;transform:translateY(-22px)}100%{opacity:0;transform:translateY(-30px)}}
@keyframes ps-dig{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(8deg)}}
@keyframes ps-lid{0%,30%,90%,100%{transform:scaleX(1)}40%,80%{transform:scaleX(.2)}}
@keyframes ps-think{0%,60%,100%{transform:rotate(0)}70%,90%{transform:rotate(-6deg)}}
`,
  Stage,
};
