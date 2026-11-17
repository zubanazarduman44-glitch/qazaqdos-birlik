// VR өмір: БАНК. Көше → шыны есік екі жаққа сырғиды → ішке кіріп, кезек аппаратынан талон аламыз → таблода нөміріміз
// «2-терезе» болып жанады → кассир шкафтан оралып, орнына отырады. Түйіндер: валюта бағамы (таблоға нұсқау), куәлік (науаға),
// қосымша (телефон), комиссия (белгі), келісімшартқа қол қою + PIN-пад, карта беру.
import { C, ST, Box, Cone, Pool, Item, Person, Actor, Passerby, Horn, walkTo, beat, say, free } from "./kit";

const TELLER = { f: true, skin: 0, hair: "#2B1A12", hs: "bun", top: C.navy, collar: C.surf, badge: C.gold, pants: C.navy };
const TELLER2 = { skin: 1, hair: "#1E1A1A", hs: "short", top: C.navy, collar: C.surf, tie: C.red, glasses: true };
const W1 = { f: true, skin: 2, hair: "#3B2416", hs: "long", top: "#7A4A21" };
const W2 = { skin: 0, hair: "#4E2F1B", hs: "cap", cap: C.green, top: "#5B87A8" };
const W3 = { f: true, skin: 1, hair: "#2B1A12", hs: "scarf", scarf: C.gold, top: "#9B3B30" };
const P1 = { skin: 1, hair: "#2B1A12", hs: "short", top: C.navy, coat: true, shirt: C.surf, pants: "#2B2F3A" };
const P2 = { f: true, skin: 0, hair: "#4E2F1B", hs: "long", top: C.teal };
const GREEN = "#1E5A4C";

const spots = {
  cab: { x: 772, y: 336, s: 0.74 },
  mid: { x: 742, y: 400, s: 0.86 },
  chair: { x: 690, y: 452, s: 0.98 },
};
const shots = {
  wide: { x: 400, y: 236, z: 1, a: "m" },
  door: { x: 400, y: 290, z: 1.9, a: "m" },
  through: { x: 400, y: 300, z: 4.4, a: "m" },
  entry: { x: 400, y: 214, z: 1.08, a: "m" },
  kiosk: { x: 176, y: 268, z: 1.9, a: "m" },
  board: { x: 380, y: 150, z: 1.5, a: "m" },
  walk: { x: 560, y: 250, z: 1.12 },
  win: { x: 640, y: 262, z: 1.2 },
};

/* ── Көше ── */
function Street({ st }) {
  const open = st.p.door;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="300" fill="#CFE6EC" />
      <path d="M-40 160h60v-80h70v40h40v140H-40Z" fill="#B7CCD5" /><path d="M700 260V60h60v50h80v150Z" fill="#B7CCD5" />
      <rect x="96" y="28" width="608" height="362" fill="#E9E1CF" />
      <path d="M96 28h608v20H96Z" fill={GREEN} />
      {/* фронтон: банк атауы */}
      <path d="M150 148L400 60L650 148Z" fill="#DCD1B8" /><path d="M176 140L400 72L624 140Z" fill="none" stroke={ST} strokeWidth="2" strokeDasharray="5 5" />
      <circle cx="400" cy="112" r="20" fill={GREEN} /><Horn x={400} y={114} s={0.62} c={C.gold2} w={2.2} />
      <Box x={268} y={152} w={264} h={44} r={6} c={GREEN} sh="rgba(20,40,30,.3)" />
      <text x="400" y="183" textAnchor="middle" fontSize="26" fontWeight="700" letterSpacing="8" fill={C.cream} style={{ fontFamily: "var(--head)" }}>БАНК</text>
      {/* бағаналар мен терезелер */}
      {[130, 220, 580, 670].map((x) => (
        <g key={x}><rect x={x - 14} y="200" width="28" height="186" fill="#F5EFE2" /><rect x={x - 20} y="196" width="40" height="10" fill="#D6CBB2" /><rect x={x - 20} y="378" width="40" height="10" fill="#D6CBB2" /></g>
      ))}
      {[[152, 196], [602, 646]].map(([a, b]) => (
        <g key={a}><rect x={a - 4} y="224" width={b - a + 8} height="120" rx="3" fill="#B9C9CC" /><rect x={a} y="228" width={b - a} height="112" fill="#D9ECEF" /><path d={`M${a + 6} 236l20 0M${a + 6} 244l12 0`} stroke="#fff" strokeWidth="3" opacity=".7" /></g>
      ))}
      {/* банкомат */}
      <g transform="translate(266 250)">
        <rect x="-26" y="0" width="52" height="96" rx="4" fill="#3A3F4E" /><rect x="-20" y="8" width="40" height="28" rx="2" fill="#9FD3B4" />
        <rect x="-14" y="46" width="28" height="4" rx="2" fill={C.ink} />{[56, 64, 72].map((y) => <path key={y} d={`M-12 ${y}h24`} stroke="#5D6675" strokeWidth="4" strokeDasharray="4 4" />)}
        <text x="0" y="-6" textAnchor="middle" fontSize="9" fontWeight="800" fill={GREEN}>24/7</text>
      </g>
      {/* шыны сырғымалы есік */}
      <rect x="334" y="214" width="132" height="174" fill="#5D6675" />
      <rect x="340" y="220" width="120" height="168" fill="#F6E7C6" />
      <path d="M352 388L320 452H480L448 388Z" fill="#F6E7C6" opacity=".5" />
      {[-1, 1].map((d) => (
        <g key={d} className="lf-mv" style={{ transform: open ? `translateX(${d * 58}px)` : "none", transitionDuration: "1.1s" }}>
          <rect x={d < 0 ? 340 : 400} y="220" width="60" height="168" fill="#BFD9DD" opacity=".88" />
          <rect x={d < 0 ? 340 : 400} y="220" width="60" height="168" fill="none" stroke="#8B9698" strokeWidth="3" />
          <path d={`M${d < 0 ? 350 : 410} 232l22 0M${d < 0 ? 350 : 410} 240l12 0`} stroke="#fff" strokeWidth="3" opacity=".7" />
          <rect x={d < 0 ? 392 : 404} y="290" width="4" height="34" rx="2" fill="#8B9698" />
        </g>
      ))}
      <rect x="330" y="206" width="140" height="10" rx="2" fill="#3A3F4E" /><circle cx="400" cy="211" r="2.5" fill={open ? "#7BE0A0" : "#C8392E"} />
      {/* баспалдақ, тротуар */}
      <rect x="296" y="386" width="208" height="8" fill="#D6CBB2" /><rect x="282" y="394" width="236" height="8" fill="#C9BDA2" />
      <rect x="-40" y="400" width="880" height="100" fill="#CDBFA6" />
      <path d="M-40 400h880" stroke="#B3A386" strokeWidth="4" />
      {[-20, 70, 160, 250, 340, 430, 520, 610, 700, 790].map((x) => <path key={x} d={`M${x} 404l-24 60`} stroke="#BBAA8C" strokeWidth="2" />)}
      <g transform="translate(46 404)"><rect x="-4" y="-150" width="8" height="150" fill="#3A3F4E" /><path d="M-14 -150h28l-5-18h-18Z" fill="#3A3F4E" /><circle cx="0" cy="-144" r="5" fill={C.gold2} /></g>
      <g transform="translate(752 404)"><rect x="-18" y="-26" width="36" height="26" rx="4" fill={C.wood2} /><circle cx="0" cy="-58" r="34" fill={C.leaf2} /><circle cx="-14" cy="-44" r="20" fill={C.leaf} /></g>
      <Passerby o={P1} y={456} s={0.64} x0={-80} x1={900} d={19} delay={-13} seed={2} />
      <Passerby o={P2} y={446} s={0.6} x0={900} x1={-80} d={23} delay={-4} seed={6} />
    </g>
  );
}

/* ── Банк залы ── */
const VP = [400, 160];
function Hall({ st, talk, mood }) {
  const p = st.p, w = st.a.npc;
  return (
    <g>
      <rect x="-40" y="-40" width="1120" height="300" fill="#EEE6D4" />
      <rect x="-40" y="-40" width="1120" height="26" fill={GREEN} />
      {[90, 250, 560, 720, 980].map((x) => <path key={x} d={`M${x} -14V256`} stroke="#E4DAC4" strokeWidth="20" />)}
      <rect x="-40" y="246" width="1120" height="12" fill="#D6CBB2" />
      <path d="M-40 256H1080V500H-40Z" fill="#D9D3C7" />
      {[-400, -200, 0, 200, 400, 600, 800, 1000, 1200, 1400, 1600].map((x) => <path key={x} d={`M${VP[0] + (x - VP[0]) * 0.3} 256L${x} 500`} stroke="#C8C1B3" strokeWidth="2" />)}
      {[286, 330, 400].map((y) => <path key={y} d={`M-40 ${y}H1080`} stroke="#C8C1B3" strokeWidth="1.6" />)}
      {[200, 400, 600].map((x) => <Cone key={x} x={x} y={-14} w={210} h={270} top={20} op={0.12} />)}
      {/* кезек таблосы */}
      <g transform="translate(380 30)">
        <rect x="-96" y="0" width="192" height="74" rx="6" fill="#2E3440" />
        <rect x="-88" y="8" width="176" height="58" rx="3" fill="#1C2129" />
        <text x="-76" y="30" fontSize="13" fontWeight="800" fill="#7BE0A0">Е-023</text><text x="40" y="30" fontSize="13" fontWeight="800" fill="#7BE0A0">▸ 1</text>
        <g className={`bk-call${p.call ? " on" : ""}`}><rect x="-84" y="38" width="168" height="24" rx="3" fill="#E0A526" opacity=".2" />
          <text x="-76" y="56" fontSize="15" fontWeight="800" fill={C.gold2}>Е-024</text><text x="36" y="56" fontSize="15" fontWeight="800" fill={C.gold2}>▸ 2</text></g>
      </g>
      <Passerby o={W2} y={300} s={0.5} x0={-60} x1={420} d={24} delay={-6} seed={7} />
      {/* кезек аппараты */}
      <g transform="translate(176 372)">
        <rect x="-34" y="-196" width="68" height="196" rx="8" fill={GREEN} />
        <rect x="-26" y="-186" width="52" height="40" rx="4" fill="#E8F2EE" />
        <text x="0" y="-169" textAnchor="middle" fontSize="9" fontWeight="800" fill={GREEN}>КЕЗЕК</text>
        <rect x="-20" y="-162" width="40" height="10" rx="3" fill={C.gold} className={`bk-btn${p.press ? " on" : ""}`} />
        <rect x="-18" y="-128" width="36" height="5" rx="2" fill={C.ink} />
        <g className={`bk-tk${p.ticket ? " on" : ""}${p.took ? " gone" : ""}`}>
          <rect x="-13" y="-126" width="26" height="34" rx="1" fill={C.surf} stroke="#CFC6B2" />
          <text x="0" y="-108" textAnchor="middle" fontSize="8" fontWeight="800" fill={C.ink}>Е-024</text>
          <path d="M-8 -100h16" stroke="#9AA3B0" strokeWidth="1.4" />
        </g>
        <Horn x={0} y={-50} s={0.8} c={C.gold2} />
      </g>
      {/* күту орны: орындықтағы адамдар */}
      <g className="bk-wa"><Actor a={{ x: 264, y: 356, s: 0.6 }}><Person o={W1} pose="sit" hold="phone" seed={3} /></Actor></g>
      <g className="bk-wb"><Actor a={{ x: 352, y: 356, s: 0.6, face: -1 }}><Person o={W3} pose="sit" look={0.6} seed={5} /></Actor></g>
      <g>
        <rect x="222" y="330" width="176" height="12" rx="4" fill="#3A3F4E" />
        <rect x="222" y="300" width="176" height="30" rx="6" fill={C.teal} opacity=".9" />
        <path d="M232 342v26M388 342v26" stroke="#3A3F4E" strokeWidth="5" />
      </g>
      {/* кассир кабинасы: шкаф, екінші кассир */}
      <rect x="430" y="104" width="650" height="152" fill="#E2D8C0" />
      <g transform="translate(796 150)"><rect x="-40" y="0" width="80" height="106" fill={C.wood2} />{[14, 48, 82].map((y) => <rect key={y} x="-34" y={y} width="68" height="28" rx="2" fill={C.wood} />)}
        {[0, 1, 2].map((i) => <rect key={i} x={-28 + i * 20} y={-14} width="14" height="14" fill={["#B8322A", "#0F5E7A", "#E0A526"][i]} />)}</g>
      <Actor a={{ x: 512, y: 452, s: 0.98 }}><Person o={TELLER2} pose="type" seat look={0.2} seed={8} /></Actor>
      <Actor a={w} dur={w?.dur}>
        <Person o={TELLER} pose={w?.pose} talk={talk} mood={mood} look={w?.look || 0} head={w?.head} hold={w?.hold} holdL={w?.holdL} seat={!!w?.sit && w?.pose !== "walk"} seed={1} />
      </Actor>
      {/* шыны қалқан + тақтайша нөмірлері + бағам жолы */}
      <rect x="430" y="96" width="650" height="16" fill={GREEN} />
      <g transform="translate(870 300)"><rect x="-34" y="-22" width="68" height="30" rx="4" fill={C.surf} stroke="#8B9698" strokeWidth="2" /><text x="0" y="-2" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.deep}>ЖАБЫҚ</text></g>
      <rect x="854" y="118" width="32" height="22" rx="4" fill="#2E3440" /><text x="870" y="134" textAnchor="middle" fontSize="14" fontWeight="800" fill={C.surf}>3</text>
      {[[512, "1"], [690, "2"]].map(([x, n]) => (
        <g key={n}><rect x={x - 16} y="118" width="32" height="22" rx="4" fill={n === "2" && p.call ? C.gold : "#2E3440"} className={n === "2" ? "bk-num" : ""} />
          <text x={x} y="134" textAnchor="middle" fontSize="14" fontWeight="800" fill={n === "2" && p.call ? C.ink : C.surf}>{n}</text></g>
      ))}
      <g className={`bk-rate${p.rate ? " on" : ""}`}><rect x="604" y="146" width="172" height="22" rx="4" fill="#1C2129" />
        <text x="616" y="162" fontSize="12" fontWeight="800" fill="#7BE0A0">$ 515</text><text x="672" y="162" fontSize="12" fontWeight="800" fill={C.gold2}>€ 560</text><text x="728" y="162" fontSize="12" fontWeight="800" fill="#7BE0A0">₽ 5,6</text></g>
      <rect x="430" y="176" width="650" height="224" fill="#CFE3E6" opacity=".2" />
      {[430, 600, 780, 960].map((x) => <rect key={x} x={x - 4} y="112" width="8" height="290" fill="#8B9698" />)}
      <path d="M444 190l40 -40M456 200l50 -50M620 196l40 -40M632 206l50 -50" stroke="#fff" strokeWidth="5" opacity=".35" />
      {/* алдыңғы үстел (бізге жақын) */}
      <rect x="420" y="398" width="680" height="18" rx="4" fill="#ECE7DD" />
      <path d="M424 416H1096V500H424Z" fill={GREEN} />
      <path d="M436 426H1084V476H436Z" fill="none" stroke={ST} strokeWidth="1.5" strokeDasharray="5 5" />
      <Horn x={512} y={452} s={1} c={C.gold2} /><Horn x={760} y={452} s={1} c={C.gold2} /><Horn x={980} y={452} s={1} c={C.gold2} />
      <rect x="606" y="386" width="88" height="14" rx="3" fill="#B8C6C8" /><rect x="606" y="382" width="88" height="6" rx="3" fill="#DCE3E4" />
      <g className={`bk-on${p.zero ? " on" : ""}`}><g className={p.zero === 2 ? "bk-hl" : ""}><rect x="704" y="350" width="76" height="40" rx="4" fill={C.surf} stroke={GREEN} strokeWidth="2" />
        <text x="742" y="368" textAnchor="middle" fontSize="11" fontWeight="800" fill={GREEN}>0 %</text><text x="742" y="383" textAnchor="middle" fontSize="9" fontWeight="700" fill={C.ink}>200 000 ₸</text></g>
        <path d="M728 390l-6 8M756 390l6 8" stroke="#8B9698" strokeWidth="3" /></g>
      {/* науадағы заттар */}
      <g className={`bk-on${p.id ? " on" : ""}`}><g transform="translate(630 386) rotate(-6)"><rect x="-17" y="-11" width="34" height="22" rx="3" fill="#BFD9EA" /><rect x="-13" y="-7" width="10" height="13" rx="1" fill="#7A9AB4" /><path d="M0 -4h12M0 1h10M0 6h8" stroke="#5D7A93" strokeWidth="1.6" /></g></g>
      <g className={`bk-on${p.doc ? " on" : ""}`}><g transform="translate(664 382) rotate(-4)"><rect x="-22" y="-16" width="44" height="30" rx="2" fill={C.surf} stroke="#CFC6B2" />
        <path d="M-16 -9h30M-16 -4h26M-16 1h30" stroke="#9AA3B0" strokeWidth="1.4" /><path d="M2 9h16" stroke={C.ink} strokeWidth="1" />
        <g className={`bk-sign${p.signed ? " on" : ""}`}><path d="M3 8q3 -6 5 0t5 -1q2 -4 4 0" stroke={C.blue} strokeWidth="1.6" fill="none" /></g></g></g>
      <g className={`bk-on${p.card ? " on" : ""}`}><Item k="card" x={676} y={384} s={0.85} r={-8} /></g>
      {/* PIN-пад */}
      <g className="lf-mv" style={{ transform: p.pin ? "translate(30px, 40px)" : "none" }}>
        <g transform="translate(572 384)">
          <Item k="terminal" s={1.05} />
          <g className={`bk-pin${p.pin ? " on" : ""}`}>{[-6, -2, 2, 6].map((x, i) => <circle key={x} cx={x} cy={-14.5} r="1.4" fill="#1E3B2B" style={{ animationDelay: `${0.5 + i * 0.35}s` }} />)}</g>
          {p.ok && <g className="bk-ok"><circle cx="0" cy="-42" r="11" fill="#2F8F5B" /><path d="M-5 -42l4 4 7-8" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" /></g>}
        </g>
      </g>
      <Pool x={640} y={406} rx={170} ry={8} op={0.2} />
    </g>
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

const T = (patch) => ({ a: { npc: patch } });
const sit = (extra = {}) => T({ pose: "hands", sit: true, head: null, hold: null, holdL: null, look: 0, ...extra });

export default {
  spots,
  shots,
  dip: "#EEE6D4",
  init: { set: "out", cam: "wide", p: { door: false }, a: { npc: { at: "cab", pose: "reach", face: 1, look: 0.6 } } },
  intro: [
    beat(900),
    beat(1500, { cam: "door", walk: true }),
    beat(900, { walk: false, p: { door: true } }),
    beat(900, { cam: "through", walk: true }),
    beat(380, { dip: true }),
    beat(60, { set: "in", cam: "entry", camMs: 0 }),
    beat(700, { dip: false }),
    beat(1300, { cam: "kiosk", walk: true }),
    beat(500, { walk: false, hand: "tap" }),
    beat(300, { p: { press: true } }),
    beat(900, { p: { press: false, ticket: true }, hand: null }),
    beat(500, { hand: "tap", p: { took: true } }),
    beat(300, { hand: null }),
    beat(900, { cam: "board", camMs: 900, p: { call: true } }),
    beat(700, T({ pose: "stand", look: 0 })),
    beat(0, { cam: "walk", walk: true, camMs: 1500 }),
    ...walkTo("npc", "mid", 800, "walkz"),
    beat(700, { a: { npc: { at: "chair", pose: "walkz", dur: 700 } } }),
    beat(600, { walk: false, cam: "win", camMs: 900, ...sit({ look: 0.2 }) }),
  ],
  acts: {
    talk: [beat(300, sit()), say(), free()],
    hello: [beat(250, sit({ head: "nod" })), say(), free()],
    rate: [beat(300, { p: { rate: true }, ...T({ pose: "reach", sit: true, head: null, look: 0.3 }) }), say(1100), beat(0, sit()), free()],
    id: [beat(300, sit()), say(500, T({ pose: "give", face: -1, sit: true })), beat(0, sit()), free()],
    app: [beat(600, { p: { id: true } }), beat(1000, T({ pose: "type", sit: true, look: 0.3, head: "down" })), beat(300, T({ pose: "give", face: -1, sit: true, hold: "phone", head: null, look: 0 })), say(1200), beat(0, sit()), free()],
    fee: [beat(400, { p: { zero: 1 } }), beat(400, T({ pose: "point", sit: true, head: null, look: 0.4 })), say(600, { p: { zero: 2 } }), beat(500, sit()), free()],
    sign: [beat(500, T({ pose: "give", face: -1, sit: true, head: null })), say(300, { p: { doc: true, zero: false } }), beat(400, sit()),
      beat(700, { hand: "pen" }), beat(900, { p: { signed: true } }), beat(400, { hand: null }),
      beat(300, { p: { pin: true } }), beat(2000, T({ pose: "type", sit: true, look: 0.2 })), beat(300, { p: { ok: true } }), beat(0, sit({ head: "nod" })), free()],
    card: [beat(800, T({ pose: "type", sit: true, head: null, look: 0.2 })), beat(400, { p: { pin: false, ok: false } }), beat(400, T({ pose: "give", face: -1, sit: true, hold: "card", look: 0 })),
      say(500, { p: { card: true, doc: false }, ...T({ hold: null }) }), beat(0, sit()), free()],
    block: [beat(300, T({ pose: "give", face: -1, sit: true, hold: "phone", head: "tilt" })), say(1400), beat(0, sit()), free()],
    bye: [beat(300, { hand: "card", p: { card: false, id: false } }), beat(600, { hand: null, ...T({ pose: "wave", sit: true, head: "nod", hold: null }) }), say(1200), beat(0, sit()), free()],
  },
  script: {
    "bank-card": { n1: "hello", x2: "rate", n2: "id", n3: "app", n4: "fee", n5: "sign", n6: "card", q6: "block", fin: "bye" },
  },
  css: `
.bk-on{opacity:0;transform:translateY(-12px);transition:opacity .35s ease,transform .45s cubic-bezier(.3,1.3,.5,1)}
.bk-on.on{opacity:1;transform:none}
.bk-btn{transition:opacity .2s}.bk-btn.on{opacity:.55}
.bk-tk{transform-box:fill-box;transform-origin:50% 0;transform:scaleY(0);transition:transform 1s cubic-bezier(.4,0,.3,1),opacity .4s}
.bk-tk.on{transform:none}.bk-tk.gone{opacity:0;transform:translateY(30px)}
.bk-call{opacity:0}.bk-call.on{animation:bk-blink 1.3s ease-out both}
.bk-num{transition:fill .4s}
.bk-rate{transition:opacity .4s}.bk-rate.on rect{animation:bk-glow 1s ease-in-out 3}
.bk-hl{transform-box:fill-box;transform-origin:50% 100%;animation:bk-pop .6s ease-out}
.bk-sign{transform-box:fill-box;transform-origin:0 50%;transform:scaleX(0);transition:transform .8s ease-out}.bk-sign.on{transform:none}
.bk-pin circle{opacity:0}.bk-pin.on circle{animation:bk-dot .2s ease-out both}
.bk-ok{transform-box:fill-box;transform-origin:50% 50%;animation:vr-stamp .5s ease-out both}
.bk-wa .lf-ua.r{animation:bk-scroll 5s ease-in-out infinite}
.bk-wb .lf-hd{animation:bk-look 9s ease-in-out infinite}
@keyframes bk-blink{0%{opacity:0}15%,45%{opacity:1}30%{opacity:.2}100%{opacity:1}}
@keyframes bk-glow{50%{opacity:.6}}
@keyframes bk-pop{0%{transform:scale(1)}40%{transform:scale(1.12)}100%{transform:scale(1)}}
@keyframes bk-dot{from{opacity:0}to{opacity:1}}
@keyframes bk-scroll{0%,100%{transform:rotate(-14deg)}50%{transform:rotate(-20deg)}}
@keyframes bk-look{0%,40%,100%{transform:rotate(0)}50%,85%{transform:rotate(-6deg) translateY(-2px)}}
`,
  Stage,
};
