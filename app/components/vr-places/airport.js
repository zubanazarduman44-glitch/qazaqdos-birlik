// VR өмір: ӘУЕЖАЙ. Терминал алды (аспанда ұшақ) → жылжымалы шыны есіктер ашылады → тіркеу залы (ұшу тақтасы әріптерін аударады,
// терезеден ұшақ жүріп барады) → тіркеу үстеліне келеміз, Ақмарал бізді шақырады. Әр түйін: төлқұжатты алу, компьютерге қарау,
// чемоданды таразыға қою (25 кг — артық), тағы 2 келіні алып тастау, жүкке белгі ілу және лентамен кетуі, отырғызу талонын басу, бағыт көрсету.
import { C, ST, Box, Cone, Pool, Shadow, Item, Person, Actor, Passerby, Horn, walkTo, beat, say, free } from "./kit";

const AGENT = { f: true, skin: 0, hair: "#2B1A12", hs: "bun", top: C.navy, shirt: C.surf, coat: true, scarf: C.red, badge: C.gold };
const AG2 = { skin: 1, hair: "#1E1A1A", hs: "short", top: C.navy, collar: C.surf, tie: C.red };
const T1 = { f: true, skin: 1, hair: "#4E2F1B", hs: "long", top: "#C0602F" };
const T2 = { skin: 0, hair: "#3B2416", hs: "cap", cap: C.green, top: "#5B87A8" };
const T3 = { skin: 2, hair: "#1E1A1A", hs: "short", top: C.teal, glasses: true };
const T4 = { f: true, skin: 0, hair: "#2B1A12", hs: "scarf", scarf: C.blue, top: "#7A4A21" };

const spots = { desk: { x: 528, y: 386, s: 0.96 }, side: { x: 600, y: 386, s: 0.96 } };
const shots = {
  wide: { x: 400, y: 236, z: 1, a: "m" },
  door: { x: 400, y: 282, z: 1.8, a: "m" },
  through: { x: 400, y: 300, z: 4.2, a: "m" },
  entry: { x: 400, y: 200, z: 1.12, a: "m" },
  walk: { x: 410, y: 232, z: 1.06 },
  front: { x: 410, y: 232, z: 1.03 },
};

const Suitcase = ({ big = true, c = C.red }) => (
  <g>
    <path d={big ? "M-22 -112v-26h44v26" : "M-14 -66v-16h28v16"} fill="none" stroke="#5D6675" strokeWidth="5" />
    <rect x={big ? -46 : -32} y={big ? -112 : -66} width={big ? 92 : 64} height={big ? 108 : 62} rx="12" fill={c} />
    {(big ? [-22, 0, 22] : [-10, 10]).map((x) => <path key={x} d={`M${x} ${big ? -104 : -60}V${big ? -12 : -10}`} stroke="rgba(0,0,0,.18)" strokeWidth="5" />)}
    <circle cx={big ? -30 : -20} cy="0" r="6" fill={C.ink} /><circle cx={big ? 30 : 20} cy="0" r="6" fill={C.ink} />
  </g>
);
// Чемодан сүйреген жолаушы (Passerby сияқты, бірақ қолында тұтқа)
function Roller({ o, y, s = 0.5, x0, x1, d = 16, delay = 0, seed = 1, c }) {
  const dir = x1 > x0 ? 1 : -1;
  return (
    <g className="lf-pass" style={{ transform: `translate(${(x0 + x1) / 2}px, ${y}px) scale(${s})`, "--x0": `${x0}px`, "--x1": `${x1}px`, "--y": `${y}px`, "--s": s, animationDuration: `${d}s`, animationDelay: `${delay}s` }}>
      <Shadow op={0.16} rx={90} />
      <g style={{ transform: `scaleX(${dir})` }}>
        <g transform="translate(72 0)"><Suitcase c={c} /></g>
        <path d="M30 -128L50 -142" stroke="#5D6675" strokeWidth="5" />
        <Person o={o} pose="walk" hold="ap-x" seed={seed} />
      </g>
    </g>
  );
}
const HAND = { give: [116, -132], hands: [33, -118] };
function Held({ w }) {
  const at = HAND[w?.pose];
  if (w?.hold !== "ap-pass" || !at) return null;
  return <g className="ap-held" style={{ transform: `translate(${at[0]}px, ${at[1]}px) rotate(-8deg)` }}><Pass s={0.8} /></g>;
}
const Pass = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x="-34" y="-16" width="68" height="32" rx="3" fill={C.surf} stroke="#CFC6B2" strokeWidth="1.5" />
    <rect x="-34" y="-16" width="14" height="32" rx="2" fill={C.blue} />
    <path d="M-14 -8h26M-14 -2h18M-14 6h8" stroke="#9AA3B0" strokeWidth="2.4" />
    <text x="24" y="8" textAnchor="middle" fontSize="13" fontWeight="800" fill={C.deep}>14</text>
  </g>
);

/* ── Терминал алды ── */
function Terminal({ st }) {
  const open = st.p.door;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="320" fill="#CFE6EC" />
      <g className="ap-sky"><g transform="scale(.7)"><Plane /></g></g>
      <path d="M-40 70Q400 20 840 70V96H-40Z" fill="#DCE3E4" />
      <rect x="-40" y="92" width="880" height="296" fill="#BFD9DD" />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${-40 + i * 64} 92V388`} stroke="#8FA9AF" strokeWidth="6" />)}
      {[160, 250].map((y) => <path key={y} d={`M-40 ${y}H840`} stroke="#8FA9AF" strokeWidth="4" />)}
      <path d="M-30 110l60 0M290 110l40 0M610 110l50 0" stroke="#fff" strokeWidth="5" opacity=".6" />
      {/* ішіндегі сұлбалар */}
      <g fill="#9DB8BE"><circle cx="150" cy="300" r="12" /><path d="M134 386q0-56 16-58q16 2 16 58Z" /><circle cx="640" cy="304" r="11" /><path d="M625 386q0-52 15-54q15 2 15 54Z" /></g>
      <Box x={250} y={18} w={300} h={58} r={10} c={C.blue} sh="rgba(15,40,50,.3)" />
      <text x="400" y="58" textAnchor="middle" fontSize="32" fontWeight="700" letterSpacing="7" fill={C.cream} style={{ fontFamily: "var(--head)" }}>ӘУЕЖАЙ</text>
      <path d="M272 47l18 0l-6 -6M528 47l-18 0l6 -6" stroke={C.gold} strokeWidth="3" fill="none" />
      {/* жылжымалы есік */}
      <rect x="326" y="190" width="148" height="198" fill="#5D6675" />
      <rect x="334" y="198" width="132" height="190" fill="#F4E7C8" />
      <rect x="334" y="166" width="132" height="24" rx="4" fill={C.ink} /><text x="400" y="183" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.gold2}>ҰШУ · КІРУ</text>
      {[-1, 1].map((d) => (
        <g key={d} className="lf-mv" style={{ transform: open ? `translateX(${d * 60}px)` : "none" }}>
          <rect x={d < 0 ? 334 : 400} y="198" width="66" height="190" fill="#BFD9DD" opacity=".9" stroke="#8FA9AF" strokeWidth="3" />
          <path d={`M${d < 0 ? 344 : 410} 210l20 0M${d < 0 ? 344 : 410} 218l10 0`} stroke="#fff" strokeWidth="3" opacity=".7" />
        </g>
      ))}
      {/* шатыр мен баған */}
      <path d="M180 150H620L650 166H150Z" fill="#5D6675" />
      <rect x="196" y="166" width="10" height="222" fill="#8B9698" /><rect x="594" y="166" width="10" height="222" fill="#8B9698" />
      <rect x="-40" y="388" width="880" height="40" fill="#CDBFA6" />
      <path d="M-40 388h880" stroke="#B3A386" strokeWidth="4" />
      <rect x="-40" y="428" width="880" height="70" fill="#7E8487" />
      <path d="M-40 428h880" stroke="#E7E1D3" strokeWidth="6" />
      {[0, 120, 240, 360, 480, 600, 720].map((x) => <rect key={x} x={x} y="458" width="60" height="5" fill="#E7E1D3" />)}
      {/* такси */}
      <g transform="translate(40 462)">
        <path d="M0 -10V-40Q0 -50 12 -52L40 -76H118L146 -52H170Q182 -50 182 -38V-10Z" fill={C.gold2} />
        <path d="M46 -70H80V-52H32ZM88 -70H112L132 -52H88Z" fill="#BFD9DD" />
        <rect x="74" y="-88" width="30" height="12" rx="3" fill={C.ink} /><text x="89" y="-79" textAnchor="middle" fontSize="8" fontWeight="800" fill={C.gold2}>TAXI</text>
        <circle cx="38" cy="-8" r="15" fill={C.ink} /><circle cx="146" cy="-8" r="15" fill={C.ink} /><circle cx="38" cy="-8" r="6" fill="#B8C6C8" /><circle cx="146" cy="-8" r="6" fill="#B8C6C8" />
      </g>
      <Roller o={T1} y={392} s={0.56} x0={-80} x1={900} d={18} delay={-6} seed={3} c={C.teal} />
      <Roller o={T3} y={398} s={0.6} x0={900} x1={-80} d={22} delay={-15} seed={5} c={C.navy} />
      <Passerby o={T4} y={384} s={0.52} x0={-80} x1={900} d={26} delay={-20} seed={8} />
    </g>
  );
}
const Plane = () => (
  <g>
    <path d="M-120 -6Q-130 0-120 6H90Q112 4 124 0Q112 -4 90 -6Z" fill={C.surf} stroke="#C8C0AE" strokeWidth="2" />
    <path d="M-10 0L-60 46H-38L30 4ZM-10 -2L-44 -40H-26L24 -4Z" fill="#DCE3E4" />
    <path d="M-104 -4L-128 -40H-112L-82 -4Z" fill={C.red} />
    {[-70, -50, -30, -10, 10, 30, 50, 70].map((x) => <circle key={x} cx={x} cy="-1" r="2.6" fill={C.blue} />)}
    <path d="M-100 2H100" stroke={C.red} strokeWidth="2.4" />
  </g>
);

/* ── Тіркеу залы ── */
const ROWS = [["09:05", "ТАШКЕНТ", "12"], ["09:50", "ЫСТАМБҰЛ", "14"], ["10:10", "АСТАНА", "03"], ["10:40", "ДУБАЙ", "08"], ["11:25", "БАКУ", "16"]];
function Hall({ st, talk, mood }) {
  const p = st.p, w = st.a.npc;
  const big = p.bag === "big";
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="310" fill="#E8EEEE" />
      {/* терезе: ұшу алаңы */}
      <rect x="330" y="-10" width="520" height="190" fill="#CFE6EC" />
      <path d="M330 140H850V180H330Z" fill="#9AA6A8" /><path d="M330 158H850" stroke="#E7E1D3" strokeWidth="3" strokeDasharray="20 16" />
      <g className="ap-taxi"><g transform="translate(560 136) scale(.62)"><Plane /></g></g>
      {[330, 434, 538, 642, 746, 850].map((x) => <path key={x} d={`M${x} -10V180`} stroke="#8FA9AF" strokeWidth="7" />)}
      <path d="M330 -10H850" stroke="#8FA9AF" strokeWidth="8" />
      {/* ұшу тақтасы */}
      <rect x="52" y="16" width="270" height="150" rx="8" fill={C.navy} />
      <text x="70" y="40" fontSize="12" fontWeight="800" letterSpacing="2" fill={C.gold2}>ҰШУ</text>
      {ROWS.map(([t, c, g], i) => (
        <g key={t} className={i === 1 ? "ap-flip" : i === 3 ? "ap-flip b" : undefined} style={{ transformOrigin: `187px ${60 + i * 22}px` }}>
          <rect x="62" y={50 + i * 22} width="250" height="19" rx="2" fill="#2A3656" />
          <text x="70" y={64 + i * 22} fontSize="12" fontWeight="700" fill={C.gold2} style={{ fontFamily: "monospace" }}>{t}</text>
          <text x="122" y={64 + i * 22} fontSize="12" fontWeight="700" fill="#F4F1E6" style={{ fontFamily: "monospace" }}>{c}</text>
          <text x="304" y={64 + i * 22} fontSize="12" fontWeight="700" fill={C.gold2} textAnchor="end" style={{ fontFamily: "monospace" }}>{g}</text>
        </g>
      ))}
      <g className={`ap-sign${p.sign ? " on" : ""}`}>
        <path d="M700 -40V18M790 -40V18" stroke="#5D6675" strokeWidth="3" />
        <rect x="660" y="18" width="160" height="34" rx="4" fill={C.ink} />
        <text x="728" y="41" textAnchor="middle" fontSize="14" fontWeight="800" fill={C.gold2}>ШЫҒУ 1–20</text>
        <path d="M790 35h18l-7 -7M808 35l-7 7" stroke={C.gold2} strokeWidth="3" fill="none" />
      </g>
      <path d="M-40 262H840V500H-40Z" fill="#DCD6C8" />
      {[-300, -150, 0, 150, 300, 450, 600, 750, 900, 1050].map((x) => <path key={x} d={`M${400 + (x - 400) * 0.3} 262L${x} 500`} stroke="#CBC4B4" strokeWidth="2" />)}
      {/* артқы тіркеу үстелдері мен кезек */}
      {[[60, "10"], [700, "13"]].map(([x, n]) => (
        <g key={x}>
          <rect x={x} y="190" width="90" height="26" rx="3" fill={C.blue} /><text x={x + 45} y="208" textAnchor="middle" fontSize="13" fontWeight="800" fill={C.surf}>{n}</text>
        </g>
      ))}
      <g className="ap-type"><Actor a={{ x: 105, y: 286, s: 0.46 }}><Person o={AG2} pose="type" look={0.3} seed={6} /></Actor></g>
      <rect x="40" y="250" width="130" height="40" rx="3" fill="#B8C6C8" /><rect x="40" y="246" width="130" height="8" rx="3" fill="#DCE3E4" />
      <Actor a={{ x: 160, y: 314, s: 0.5, face: -1 }}><Person o={T2} pose="hands" look={-0.6} seed={2} /></Actor>
      <g transform="translate(212 314) scale(.5)"><Suitcase c={C.green} /></g>
      <g className="ap-wait"><Actor a={{ x: 250, y: 318, s: 0.52, face: -1 }}><Person o={T4} pose="phone" hold="phone" look={-0.4} seed={9} /></Actor></g>
      {/* кезек тірегі */}
      {[110, 230, 350].map((x) => <g key={x}><rect x={x - 3} y="300" width="6" height="42" fill="#5D6675" /><ellipse cx={x} cy="342" rx="12" ry="4" fill="#5D6675" /></g>)}
      <path d="M110 306H350" stroke={C.blue} strokeWidth="5" />
      <Roller o={T3} y={340} s={0.6} x0={-80} x1={880} d={19} delay={-5} seed={5} c={C.navy} />
      <Roller o={T1} y={346} s={0.62} x0={880} x1={-80} d={24} delay={-14} seed={3} c={C.teal} />
      {/* біздің тіркеу үстелі (жақындағанда үлкейеді) */}
      <g className="lf-mv ap-near" style={{ transform: p.near ? "none" : "translate(400px, 200px) scale(0.8) translate(-400px, -200px)" }}>
        <rect x="430" y="44" width="190" height="284" rx="6" fill={C.blue} />
        <rect x="446" y="56" width="158" height="36" rx="4" fill={C.surf} />
        <text x="525" y="80" textAnchor="middle" fontSize="17" fontWeight="800" letterSpacing="2" fill={C.blue}>ТІРКЕУ 12</text>
        <path d="M446 300H604" stroke={C.gold} strokeWidth="3" strokeDasharray="6 6" />
        {/* жүк лентасы */}
        <rect x="196" y="236" width="150" height="100" rx="4" fill="#5D6675" />
        <g className="ap-strip">{Array.from({ length: 9 }, (_, i) => <rect key={i} x={206 + i * 15} y="244" width="12" height="86" fill="#2E3440" opacity=".85" />)}</g>
        <Actor a={w} dur={w?.dur}>
          <Person o={AGENT} pose={w?.pose} talk={talk} mood={mood} look={w?.look || 0} head={w?.head} hold={w?.hold} holdL={w?.holdL} seed={2} />
          <Held w={w} />
        </Actor>
        <path d="M190 336H350V470H190Z" fill="#8B9698" />
        <rect x="186" y="330" width="168" height="10" rx="3" fill="#B8C6C8" />
        <g className="ap-belt">{[200, 236, 272, 308, 344].map((x) => <path key={x} d={`M${x} 330v10`} stroke="#5D6675" strokeWidth="2" />)}</g>
        {/* чемодан: таразыда → белгі → лентамен кетеді */}
        <g className={`ap-bag${p.bag ? " on" : ""}${p.belt ? " go" : ""}`}>
          <g transform="translate(276 334)">
            <Suitcase big={big} c={C.red} />
            {p.tag && <g className="ap-tag"><path d={big ? "M-18 -140q-6 14 4 22" : "M-10 -82q-4 10 2 16"} stroke={C.gold} strokeWidth="2" fill="none" /><rect x={big ? -30 : -22} y={big ? -122 : -68} width="26" height="16" rx="2" fill={C.gold2} /></g>}
          </g>
        </g>
        <g transform="translate(366 300)">
          <rect x="-3" y="0" width="6" height="40" fill="#5D6675" />
          <rect x="-34" y="-26" width="68" height="28" rx="4" fill="#2E3440" />
          <text y="-6" textAnchor="middle" fontSize="15" fontWeight="800" fill={p.over ? "#FF8A7A" : "#9FD3B4"} style={{ fontFamily: "monospace" }}>{p.kg || "0.0"}</text>
        </g>
        {/* үстел */}
        <path d="M384 334H700L714 470H372Z" fill="#DCE3E4" />
        <path d="M396 348H690V462H392Z" fill="none" stroke="#B8C6C8" strokeWidth="1.5" strokeDasharray="5 5" />
        <rect x="372" y="320" width="342" height="18" rx="4" fill={C.surf} />
        <rect x="380" y="400" width="326" height="14" fill={C.blue} />
        <Pool x={540} y={322} rx={160} ry={8} op={0.3} c="#FFFFFF" />
        <g transform="translate(640 278)"><rect x="-38" y="-30" width="76" height="52" rx="4" fill="#5D6675" /><rect x="-6" y="22" width="12" height="20" fill="#5D6675" /><rect x="-20" y="38" width="40" height="6" rx="2" fill="#5D6675" /></g>
        <g transform="translate(436 306)">
          <rect x="-26" y="-10" width="52" height="24" rx="4" fill="#8B9698" />
          <g className={`ap-print${p.print ? " on" : ""}`}><rect x="-16" y="-34" width="32" height="26" fill={C.surf} stroke="#CFC6B2" /></g>
          <rect x="-20" y="-12" width="40" height="5" rx="2" fill="#2E3440" />
        </g>
        <g className={`ap-on${p.pass ? " on" : ""}`}><Item k="book" x={512} y={330} s={0.9} r={-6} /></g>
        <g className={`ap-on${p.bpass ? " on" : ""}`}><g transform="translate(520 326) rotate(-4)"><Item k="book" x={-8} y={4} s={0.9} /><Pass s={1.1} /></g></g>
      </g>
    </g>
  );
}

function Stage({ st, talk, mood }) {
  return (
    <>
      <g className={`lf-set${st.set === "out" ? "" : " off"}`}><Terminal st={st} /></g>
      <g className={`lf-set${st.set === "in" ? "" : " off"}`}><Hall st={st} talk={talk} mood={mood} /></g>
    </>
  );
}

const A = (patch) => ({ a: { npc: patch } });

export default {
  spots,
  shots,
  dip: "#F4F1E6",
  init: { set: "out", cam: "wide", p: { door: false, near: false }, a: { npc: { at: "desk", pose: "type", look: 0.3 } } },
  intro: [
    beat(900),
    beat(1500, { cam: "door", walk: true }),
    beat(700, { walk: false, p: { door: true } }),
    beat(900, { cam: "through", walk: true }),
    beat(380, { dip: true }),
    beat(60, { set: "in", cam: "entry", camMs: 0 }),
    beat(900, { dip: false }),
    beat(1700, { cam: "walk", walk: true, p: { near: true } }),
    beat(500, { walk: false, cam: "front", camMs: 800, ...A({ pose: "type", look: 0.2, head: "down" }) }),
    beat(700, A({ pose: "stand", head: null, look: -0.2 })),
    beat(600, A({ pose: "wave", look: 0 })),
  ],
  acts: {
    talk: [beat(250, A({ pose: "hands", hold: null, head: null, look: 0 })), say(), free()],
    pass: [beat(300, A({ pose: "hands", head: "nod", look: 0 })), beat(400, A({ pose: "give", face: -1, head: null })), say(1100), beat(300, { hand: "book" }), beat(0, A({ pose: "hands" })), free()],
    check: [beat(500, { hand: null, p: { pass: true } }), beat(500, { p: { pass: false }, ...A({ pose: "give", face: -1, hold: "book", head: null }) }),
      beat(900, A({ pose: "hands", look: -0.2, head: "down" })), beat(900, A({ pose: "type", hold: null, look: 0.3 })), say(700, A({ pose: "hands", head: null, look: 0 })), free()],
    big: [beat(400, A({ pose: "point", face: -1, look: -0.7, head: null })), say(1000, { p: { bag: "big", kg: "0.0" } }), beat(900, { p: { kg: "25.0", over: true } }), beat(0, A({ pose: "hands", look: -0.3, head: "tilt" })), free()],
    small: [beat(400, A({ pose: "point", face: -1, look: -0.7, head: null })), say(1500), beat(500, { p: { bag: "small", kg: "0.0" } }), beat(700, { p: { kg: "5.0" } }), beat(0, A({ pose: "hands", look: 0 })), free()],
    fee: [beat(1000, A({ pose: "type", head: null, look: 0.3 })), say(600, A({ pose: "hands", look: 0, head: "tilt" })), free()],
    ok: ({ st }) => [
      ...(st.p.bag === "big" ? [beat(900, { p: { kg: "23.0", over: false } }), beat(600, A({ pose: "hands", head: "nod", look: -0.5 })),
        beat(500, { p: { tag: true }, ...A({ pose: "give", face: -1, head: null }) }), beat(1200, { p: { belt: true }, ...A({ pose: "hands", look: -0.6 }) })]
        : [beat(600, A({ pose: "hands", head: "nod", look: -0.5 })), beat(600, { p: { bag: null } })]),
      say(400, A({ pose: "hands", head: "tilt", look: 0 })), free(),
    ],
    print: [beat(800, A({ pose: "type", head: null, look: 0.3 })), beat(900, { p: { print: true } }), beat(500, { p: { print: false }, ...A({ pose: "give", face: -1, hold: "ap-pass", look: 0 }) }),
      say(500, { p: { bpass: true }, ...A({ hold: null }) }), beat(0, A({ pose: "hands" })), free()],
    way: [beat(500, { p: { sign: true }, ...A({ pose: "point", face: 1, look: 0.8, head: null }) }), say(1400), beat(0, A({ pose: "hands", look: 0 })), free()],
    bye: [beat(300, A({ pose: "wave", head: "nod", look: 0 })), say(1200), beat(0, A({ pose: "hands", head: null })), free()],
  },
  script: {
    "airport-checkin": { n1: "pass", n2: "check", n3: "big", h3: "small", x3: "fee", n4: "ok", n5: "print", n6: "way", fin: "bye" },
  },
  css: `
.ap-held{transform-box:view-box;transform-origin:0 0;animation:ap-in .35s .15s ease both}
.ap-on{opacity:0;transform:translateY(-14px);transition:opacity .35s ease,transform .45s cubic-bezier(.3,1.3,.5,1)}
.ap-on.on{opacity:1;transform:none}
.ap-near{transition-duration:1.7s!important}
.ap-bag{opacity:0;transform:translateY(120px);transition:opacity .4s ease,transform .6s cubic-bezier(.3,1.25,.5,1)}
.ap-bag.on{opacity:1;transform:none}
.ap-bag.on.go{opacity:0;transform:translateX(-70px) scale(.8);transition:opacity .5s ease .9s,transform 1.4s cubic-bezier(.5,0,.5,1)}
.ap-tag{animation:ap-in .4s ease both}
.ap-print{transform:translateY(22px);transition:transform .9s linear}.ap-print.on{transform:none}
.ap-sign{transition:opacity .4s}.ap-sign.on{animation:ap-blink .5s ease-in-out 3}
.ap-flip{animation:ap-flip 7s ease-in-out infinite}.ap-flip.b{animation-delay:-3.4s}
.ap-sky{animation:ap-fly 16s linear infinite}
.ap-taxi{animation:ap-taxi 22s ease-in-out infinite}
.ap-strip{animation:ap-sw 4s ease-in-out infinite;transform-origin:270px 244px}
.ap-type .lf-fa.r{animation:lf-tap .5s ease-in-out infinite alternate}
.ap-wait .lf-hd{animation:lf-nod 4s ease-in-out infinite}
@keyframes ap-in{from{opacity:0}to{opacity:1}}
@keyframes ap-blink{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes ap-flip{0%,86%,100%{transform:scaleY(1)}90%{transform:scaleY(.05)}94%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
@keyframes ap-fly{0%{transform:translate(-160px,150px) rotate(-8deg)}100%{transform:translate(980px,-40px) rotate(-8deg)}}
@keyframes ap-taxi{0%,100%{transform:translateX(0)}50%{transform:translateX(-170px)}}
@keyframes ap-sw{0%,100%{transform:skewX(0)}50%{transform:skewX(-3deg)}}
`,
  Stage,
};
