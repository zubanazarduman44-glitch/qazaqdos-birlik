// VR өмір: ЕМХАНА. Ғимарат алдында жедел жәрдем көлігі → дәліз: тіркеу терезесі, күту орындықтары (біреу жөтеледі) → біз де отырамыз,
// 112-кабинеттің шамы жанып, есік ашылады: Нұрлан Серікұлы шақырады. Кабинетте: дәрігер үстел басында жазады, орнынан тұрып,
// фонендоскоппен тыңдайды, шамшамен тамақты қарайды, қайта отырып жолдама мен еңбекке жарамсыздық парағын береді, 205-кабинетті көрсетеді.
import { C, ST, Box, Cone, Pool, Shadow, Item, Person, Actor, Passerby, walkTo, beat, say, free } from "./kit";

const DOC = { skin: 1, hair: "#6B6660", hs: "short", top: "#FFFFFF", coat: true, shirt: C.blue, glasses: true, badge: C.blue };
const REG = { f: true, skin: 0, hair: "#2B1A12", hs: "bun", top: "#FFFFFF", coat: true, shirt: C.teal };
const W1 = { f: true, skin: 2, hair: "#1E1A1A", hs: "scarf", scarf: C.leaf, top: "#9B3B30" };
const W2 = { skin: 0, hair: "#3B2416", hs: "short", top: "#5B87A8", tache: true };
const P1 = { f: true, skin: 1, hair: "#4E2F1B", hs: "long", top: C.teal };
const P2 = { skin: 2, hair: "#1E1A1A", hs: "cap", cap: C.red, top: "#7A4A21" };
const BLUE = "#2D6FA3", WALL = "#E6EEF0";

const spots = {
  hdoor: { x: 662, y: 304, s: 0.62 },
  chair: { x: 520, y: 404, s: 0.96 },
  side: { x: 800, y: 404, s: 0.96 },
  near: { x: 560, y: 472, s: 1.12 },
};
const shots = {
  wide: { x: 400, y: 236, z: 1, a: "m" },
  door: { x: 400, y: 282, z: 1.8, a: "m" },
  through: { x: 400, y: 300, z: 4.2, a: "m" },
  hall: { x: 400, y: 206, z: 1.1, a: "m" },
  reg: { x: 200, y: 200, z: 1.45, a: "m" },
  wait: { x: 560, y: 226, z: 1.3, a: "m" },
  room: { x: 664, y: 226, z: 3.2, a: "m" },
  office: { x: 420, y: 214, z: 1.1, a: "m" },
  seat: { x: 420, y: 232, z: 1.04 },
};

const Paper = ({ c = BLUE, t }) => (
  <g>
    <rect x="-22" y="-28" width="44" height="56" rx="2" fill={C.surf} stroke="#CFC6B2" strokeWidth="1.5" />
    <rect x="-22" y="-28" width="44" height="10" rx="2" fill={c} />
    <path d="M-15 -10h30M-15 -3h24M-15 4h28M-15 11h18" stroke="#9AA3B0" strokeWidth="2" />
    {t && <text x="0" y="24" textAnchor="middle" fontSize="8" fontWeight="800" fill={c}>{t}</text>}
  </g>
);
const sat = (w) => (w?.seat || w?.pose === "sit" ? 46 : 0);
const HAND = { give: [116, -132], point: [141, -183], hands: [33, -118] };
function Held({ w }) {
  const k = w?.hold, at = HAND[w?.pose];
  if (!k || !String(k).startsWith("cl-") || k === "cl-steth" || !at) return null;
  return (
    <g className="cl-held" style={{ transform: `translate(${at[0]}px, ${at[1] + sat(w)}px)` }}>
      {k === "cl-ref" && <g transform="rotate(-8) scale(.8)"><Paper t="ЖОЛДАМА" /></g>}
      {k === "cl-sick" && <g transform="rotate(-8) scale(.8)"><Paper c={C.green} t="ПАРАҚ" /></g>}
      {k === "cl-lamp" && <g><rect x="-4" y="-6" width="26" height="9" rx="4" fill="#5D6675" /><circle cx="24" cy="-1.5" r="4" fill="#FFF3C8" /><path className="cl-beam" d="M26 -2L80 -22V18Z" fill="#FFF3C8" opacity=".55" /></g>}
    </g>
  );
}
// Фонендоскоп: мойында; тыңдағанда — созылған қолда
function Steth({ w }) {
  const listen = w?.hold === "cl-steth" && w.pose === "give";
  return (
    <g transform={`translate(0 ${sat(w)})`} fill="none" stroke="#3A3F4E" strokeWidth="4" strokeLinecap="round">
      <path d="M-24 -206Q-32 -172 -8 -160H8Q32 -172 24 -206" />
      {listen ? <><path className="cl-tube" d="M0 -160Q64 -170 112 -132" /><circle cx="116" cy="-130" r="9" fill="#B8C6C8" stroke="#5D6675" strokeWidth="3" /></>
        : <><path d="M0 -160V-128" /><circle cx="0" cy="-121" r="8" fill="#B8C6C8" stroke="#5D6675" strokeWidth="3" /></>}
    </g>
  );
}
function Doctor({ w, talk, mood }) {
  return (
    <Actor a={w} dur={w?.dur}>
      <Person o={DOC} pose={w?.pose} talk={talk} mood={mood} look={w?.look || 0} head={w?.head} hold={w?.hold?.startsWith?.("cl-") ? null : w?.hold} holdL={w?.holdL} seat={!!w?.seat} seed={2} />
      <Steth w={w} />
      <Held w={w} />
    </Actor>
  );
}

/* ── Емхана алды ── */
function Front({ st }) {
  const open = st.p.door;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="300" fill="#CFE6EC" />
      <path d="M-40 120h70v-40h60v180H-40ZM700 260V90h50v30h90v140Z" fill="#B7CCD5" />
      <rect x="110" y="40" width="580" height="350" fill="#F4F6F2" />
      <rect x="110" y="40" width="580" height="16" fill={BLUE} />
      {[90, 170].map((y) => [150, 230, 310, 490, 570, 650].map((x) => <g key={`${x}${y}`}><rect x={x - 26} y={y} width="52" height="52" rx="3" fill="#BFD9DD" /><path d={`M${x} ${y}v52M${x - 26} ${y + 26}h52`} stroke="#E6EEF0" strokeWidth="3" /></g>))}
      <Box x={290} y={176} w={220} h={54} r={8} c={BLUE} sh="rgba(15,40,70,.3)" />
      <text x="420" y="214" textAnchor="middle" fontSize="28" fontWeight="700" letterSpacing="5" fill={C.cream} style={{ fontFamily: "var(--head)" }}>ЕМХАНА</text>
      <circle cx="318" cy="203" r="18" fill={C.surf} /><path d="M312 191h12v6h6v12h-6v6h-12v-6h-6v-12h6Z" fill={BLUE} />
      <path d="M300 246H500L520 262H280Z" fill={BLUE} />
      <rect x="340" y="262" width="120" height="128" fill="#5D6675" />
      <rect x="348" y="268" width="104" height="122" fill="#F4E7C8" />
      {[-1, 1].map((d) => (
        <g key={d} transform={`translate(${d < 0 ? 348 : 452} 268)`}><g className="lf-mv" style={{ transform: open ? `scaleX(0.16) skewY(${d * -10}deg)` : "none" }}>
          <rect x={d < 0 ? 0 : -52} width="52" height="122" fill="#BFD9DD" stroke="#8FA9AF" strokeWidth="3" />
          <rect x={d < 0 ? 42 : -46} y="50" width="4" height="22" rx="2" fill="#8B9698" />
        </g></g>
      ))}
      <path d="M330 390h140l10 10H320Z" fill="#B8C6C8" />
      <rect x="-40" y="390" width="880" height="110" fill="#CDBFA6" />
      <path d="M-40 390h880" stroke="#B3A386" strokeWidth="4" />
      {[-20, 70, 160, 250, 340, 430, 520, 610, 700, 790].map((x) => <path key={x} d={`M${x} 394l-26 70`} stroke="#BBAA8C" strokeWidth="2" />)}
      {/* жедел жәрдем */}
      <g transform="translate(560 420)">
        <path d="M0 -10V-96Q0 -104 8 -104H150L196 -64V-10Z" fill={C.surf} stroke="#CFC6B2" strokeWidth="2" />
        <path d="M154 -98L188 -66H154Z" fill="#BFD9DD" />
        <path d="M0 -50H196" stroke={C.red} strokeWidth="10" />
        <text x="70" y="-62" textAnchor="middle" fontSize="16" fontWeight="800" fill={C.red}>103</text>
        <rect x="60" y="-114" width="30" height="10" rx="3" fill={BLUE} className="cl-siren" />
        <circle cx="40" cy="-8" r="15" fill={C.ink} /><circle cx="160" cy="-8" r="15" fill={C.ink} /><circle cx="40" cy="-8" r="6" fill="#B8C6C8" /><circle cx="160" cy="-8" r="6" fill="#B8C6C8" />
      </g>
      <Passerby o={P1} y={452} s={0.64} x0={-80} x1={900} d={19} delay={-12} seed={3} />
      <Passerby o={P2} y={460} s={0.66} x0={900} x1={-80} d={23} delay={-5} seed={5} />
    </g>
  );
}

/* ── Дәліз ── */
function Hall({ st, talk, mood }) {
  const p = st.p, w = st.a.npc;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="310" fill={WALL} />
      <rect x="-40" y="190" width="880" height="80" fill="#BFD9DD" />
      <path d="M-40 190h880" stroke="#8FA9AF" strokeWidth="4" />
      {[200, 600].map((x) => <g key={x}><rect x={x - 60} y="-20" width="120" height="10" rx="4" fill="#FFFFFF" /><Cone x={x} y={-10} w={220} h={280} top={50} c="#FFFFFF" op={0.35} /></g>)}
      {/* тіркеу терезесі */}
      <rect x="40" y="80" width="230" height="40" rx="4" fill={BLUE} /><text x="155" y="107" textAnchor="middle" fontSize="16" fontWeight="800" letterSpacing="3" fill={C.surf}>ТІРКЕУ</text>
      <rect x="40" y="120" width="230" height="170" fill="#8FA9AF" />
      <rect x="52" y="130" width="206" height="120" fill="#F4F6F2" />
      <g className="cl-type"><Actor a={st.a.reg} dur={st.a.reg?.dur} shadow={false}><Person o={REG} pose={st.a.reg?.pose} look={st.a.reg?.look || 0} head={st.a.reg?.head} seed={6} /></Actor></g>
      <rect x="52" y="130" width="206" height="120" fill="#CFE6EC" opacity=".25" />
      <path d="M60 140l30 -0M60 148l18 0" stroke="#fff" strokeWidth="3" opacity=".7" />
      <rect x="34" y="246" width="242" height="14" rx="3" fill={C.surf} />
      {/* 112-кабинет есігі */}
      <rect x="610" y="96" width="112" height="190" fill="#8FA9AF" />
      <rect x="618" y="104" width="96" height="182" fill="#F4E7C8" />
      <Cone x={666} y={110} w={90} h={170} top={30} op={0.25} />
      <g transform="translate(618 104)"><g className="lf-mv" style={{ transform: p.odoor ? "scaleX(0.18) skewY(-8deg)" : "none" }}>
        <rect width="96" height="182" fill="#F4F6F2" stroke="#B8C6C8" strokeWidth="3" />
        <rect x="18" y="20" width="60" height="30" rx="3" fill={C.surf} stroke={BLUE} strokeWidth="2" />
        <text x="48" y="34" textAnchor="middle" fontSize="11" fontWeight="800" fill={BLUE}>112</text>
        <text x="48" y="45" textAnchor="middle" fontSize="7" fontWeight="800" fill={C.ink}>ТЕРАПЕВТ</text>
        <rect x="80" y="90" width="6" height="22" rx="3" fill="#8B9698" />
      </g></g>
      <g transform="translate(666 78)"><rect x="-36" y="-12" width="72" height="24" rx="6" fill={C.ink} />
        <text y="5" textAnchor="middle" fontSize="11" fontWeight="800" fill={p.lamp ? "#7FE0A0" : "#5D6675"}>{p.lamp ? "КІРІҢІЗ" : "КҮТІҢІЗ"}</text></g>
      <path d="M-40 270H840V500H-40Z" fill="#D8DCD6" />
      {[-300, -150, 0, 150, 300, 450, 600, 750, 900, 1050].map((x) => <path key={x} d={`M${400 + (x - 400) * 0.3} 270L${x} 500`} stroke="#C8CDC6" strokeWidth="2" />)}
      {/* күту орындықтары */}
      {[336, 403, 470, 537].map((x) => <g key={x}><rect x={x - 28} y="292" width="56" height="12" rx="4" fill={BLUE} /><rect x={x - 26} y="250" width="52" height="42" rx="6" fill={BLUE} opacity=".85" /></g>)}
      <rect x="300" y="304" width="270" height="6" fill="#5D6675" /><rect x="306" y="304" width="6" height="34" fill="#5D6675" /><rect x="558" y="304" width="6" height="34" fill="#5D6675" />
      <g className="cl-cough"><Actor a={{ x: 336, y: 318, s: 0.62 }}><Person o={W1} pose="sit" look={0.3} seed={4} /></Actor></g>
      <Actor a={{ x: 470, y: 318, s: 0.62 }}><Person o={W2} pose="sit" hold="phone" look={-0.2} head="down" seed={7} /></Actor>
      <Passerby o={P1} y={360} s={0.66} x0={-80} x1={880} d={22} delay={-6} seed={3} />
      {st.set === "hall" && <Doctor w={w} talk={talk} mood={mood} />}
    </g>
  );
}

/* ── Кабинет ── */
function Office({ st, talk, mood }) {
  const p = st.p, w = st.a.npc;
  const front = w?.at === "near";
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="310" fill="#EAF2F4" />
      <rect x="-40" y="196" width="880" height="74" fill="#D3E3E8" />
      {/* терезе, жалюзи */}
      <rect x="30" y="30" width="180" height="150" fill="#CFE6EC" stroke="#B8C6C8" strokeWidth="6" />
      <g className="cl-blind">{Array.from({ length: 9 }, (_, i) => <rect key={i} x="34" y={36 + i * 15} width="172" height="7" fill="#F4F6F2" opacity=".9" />)}</g>
      {/* кушетка */}
      <rect x="20" y="246" width="230" height="40" rx="6" fill={C.teal} /><rect x="30" y="236" width="210" height="14" rx="4" fill={C.surf} /><rect x="30" y="286" width="8" height="30" fill="#5D6675" /><rect x="232" y="286" width="8" height="30" fill="#5D6675" />
      {/* плакат: адам сұлбасы, жүрек */}
      <rect x="262" y="40" width="96" height="130" rx="4" fill={C.surf} stroke="#B8C6C8" strokeWidth="2" />
      <circle cx="310" cy="66" r="12" fill="#BFD9DD" /><path d="M292 82h36l-6 50h-24Z" fill="#BFD9DD" /><path d="M306 98q4 -6 8 0q-4 8 -4 8q0 0 -4 -8Z" fill={C.red} className="cl-beat" />
      <path d="M276 150h68M276 158h48" stroke="#9AA3B0" strokeWidth="2.4" />
      {/* шкаф */}
      <rect x="620" y="40" width="150" height="230" rx="4" fill="#F4F6F2" stroke="#B8C6C8" strokeWidth="3" />
      {[90, 150, 210].map((y) => <g key={y}><rect x="628" y={y} width="134" height="5" fill="#B8C6C8" />{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={636 + i * 25} y={y - 26 + (i % 2) * 6} width="16" height={26 - (i % 2) * 6} rx="2" fill={[BLUE, C.red, C.surf, C.green, C.gold2][(i + y) % 5]} stroke="#CFC6B2" />)}</g>)}
      <path d="M-40 270H840V500H-40Z" fill="#D8DCD6" />
      {[290, 330, 390].map((y) => <path key={y} d={`M-40 ${y}H840`} stroke="#C8CDC6" strokeWidth="2" />)}
      <rect x="436" y="280" width="168" height="80" rx="10" fill="#3A3F4E" />
      {!front && <Doctor w={w} talk={talk} mood={mood} />}
      {/* дәрігер үстелі: біз отырғанда төменнен көтеріледі */}
      <g className="lf-mv" style={{ transform: p.desk ? "none" : "translate(400px, 520px) scale(1.5) translate(-400px, -440px)" }}>
        <path d="M110 360H770L800 470H80Z" fill="#E7D7B5" />
        <path d="M80 470L110 360H770L800 470" fill="none" stroke={C.wood} strokeWidth="10" />
        <path d="M124 370H756" stroke={ST} strokeWidth="1.5" strokeDasharray="6 6" />
        <g transform="translate(660 330)"><rect x="-44" y="-38" width="88" height="60" rx="4" fill="#5D6675" /><rect x="-38" y="-32" width="76" height="48" rx="2" fill={p.screen ? "#BFE3D8" : "#3E4A5C"} /><rect x="-6" y="22" width="12" height="14" fill="#5D6675" /><rect x="-24" y="34" width="48" height="6" rx="2" fill="#5D6675" /></g>
        <g transform="translate(220 352)"><rect x="-30" y="-12" width="60" height="22" rx="4" fill="#8B9698" />
          <g className={`cl-print${p.print ? " on" : ""}`}><rect x="-20" y="-40" width="40" height="30" fill={C.surf} stroke="#CFC6B2" /><rect x="-20" y="-40" width="40" height="6" fill={C.green} /></g>
          <rect x="-24" y="-14" width="48" height="5" rx="2" fill="#2E3440" /></g>
        <g transform="translate(150 380)"><rect x="-12" y="-28" width="24" height="30" rx="4" fill={BLUE} /><path d="M-6 -28l-4 -18M4 -28l6 -16" stroke={C.red} strokeWidth="3" /></g>
        <g className={`cl-on${p.ref ? " on" : ""}`}><g transform="translate(380 404) rotate(-80) scale(1.2)"><Paper t="ЖОЛДАМА" /></g></g>
        <g className={`cl-on${p.sick ? " on" : ""}`}><g transform="translate(470 410) rotate(-84) scale(1.2)"><Paper c={C.green} t="ПАРАҚ" /></g></g>
        <g className={`cl-on${p.note ? " on" : ""}`}><g transform="translate(560 410) rotate(6)"><rect x="-30" y="-20" width="60" height="40" rx="2" fill={C.gold2} /><text y="-2" textAnchor="middle" fontSize="15" fontWeight="800" fill={C.deep}>205</text><text y="13" textAnchor="middle" fontSize="8" fontWeight="800" fill={C.deep}>2-ҚАБАТ · ЖҰМА</text></g></g>
      </g>
      {front && <Doctor w={w} talk={talk} mood={mood} />}
    </g>
  );
}

function Stage({ st, talk, mood }) {
  return (
    <>
      <g className={`lf-set${st.set === "out" ? "" : " off"}`}><Front st={st} /></g>
      <g className={`lf-set${st.set === "hall" ? "" : " off"}`}><Hall st={st} talk={talk} mood={mood} /></g>
      <g className={`lf-set${st.set === "in" ? "" : " off"}`}><Office st={st} talk={talk} mood={mood} /></g>
    </>
  );
}

const A = (patch) => ({ a: { npc: patch } });
const SIT = { at: "chair", pose: "write", seat: true, hold: "pen", holdL: "pad", head: "down", look: -0.2 };
// Дәліздегі есіктен кабинетке кіріп, үстел алдына отыру
const enter = (st) => st.set !== "hall" ? [] : [
  beat(500, A({ pose: "stand", look: 0, head: null, hide: true })),
  beat(1300, { cam: "room", walk: true }),
  beat(380, { dip: true }),
  beat(80, { set: "in", cam: "office", camMs: 0, walk: false, p: { desk: false, odoor: false }, ...A({ ...SIT, hide: false, dur: 0 }) }),
  beat(500, { dip: false }),
  beat(900, { cam: "seat", camMs: 900, p: { desk: true } }),
];

export default {
  spots,
  shots,
  dip: "#F4F6F2",
  init: { set: "out", cam: "wide", p: { door: false, odoor: false, desk: true }, a: { npc: { at: "hdoor", pose: "stand", hide: true }, reg: { x: 150, y: 300, s: 0.55, pose: "type", look: 0.3 } } },
  intro: [
    beat(900),
    beat(1500, { cam: "door", walk: true }),
    beat(650, { walk: false, p: { door: true } }),
    beat(900, { cam: "through", walk: true }),
    beat(380, { dip: true }),
    beat(60, { set: "hall", cam: "hall", camMs: 0 }),
    beat(600, { dip: false }),
    beat(1300, { cam: "reg", walk: true }),
    beat(500, { walk: false, a: { reg: { pose: "hands", look: -0.2, head: "nod" } } }),
    beat(900, { a: { reg: { pose: "point", face: 1, look: 0.6, head: null } } }),
    beat(1400, { cam: "wait", walk: true, a: { reg: { pose: "type", look: 0.3 } } }),
    beat(1200, { walk: false }),
    beat(500, { p: { lamp: true } }),
    beat(400, { p: { odoor: true } }),
    beat(300, A({ hide: false, pose: "stand", look: -0.4 })),
  ],
  acts: {
    talk: [beat(250, A({ pose: "hands", hold: null, holdL: null, head: null, look: 0 })), say(), free()],
    invite: [beat(400, A({ pose: "wave", head: null, look: -0.3 })), say(700), beat(800, A({ pose: "point", face: 1, look: 0.4 })), beat(0, A({ pose: "hands", look: 0 })), free()],
    fever: ({ st }) => [...enter(st), beat(600, A(SIT)), say(400, A({ pose: "hands", hold: null, holdL: null, head: null, look: 0 })), free()],
    weak: [beat(900, A({ ...SIT })), say(400, A({ pose: "hands", hold: null, holdL: null, head: "tilt", look: 0 })), free()],
    throat: [
      beat(400, A({ pose: "stand", seat: false, hold: null, holdL: null, head: null, look: 0 })),
      ...walkTo("npc", "side", 900, "walk"), ...walkTo("npc", "near", 1000, "hands"),
      beat(500, A({ pose: "give", face: -1, hold: "cl-steth", look: -0.2, head: "down" })),
      beat(1600, A({ head: "tilt" })),
      beat(500, A({ pose: "point", face: -1, hold: "cl-lamp", head: null, look: -0.3 })),
      say(2200), beat(0, A({ pose: "hands", hold: null, head: "nod", look: 0 })), free(),
    ],
    allergy: ({ st }) => [
      ...(st.a.npc?.at === "near" ? [beat(200, A({ head: null })), ...walkTo("npc", "side", 900, "walk"), ...walkTo("npc", "chair", 900, "stand"), beat(300, A({ pose: "sit", seat: true, face: 1 }))] : []),
      beat(500, A(SIT)), say(400, A({ pose: "hands", hold: null, holdL: null, head: "tilt", look: 0 })), free(),
    ],
    refer: [beat(1200, A(SIT)), beat(500, A({ pose: "give", face: -1, hold: "cl-ref", holdL: null, head: null, look: 0 })), say(400, { p: { ref: true }, ...A({ hold: null }) }), beat(0, A({ pose: "hands" })), free()],
    sick: [beat(1000, A({ pose: "type", seat: true, hold: null, holdL: null, head: null, look: 0.5 })), beat(300, { p: { screen: true } }), beat(1000, { p: { print: true } }),
      beat(500, { p: { print: false }, ...A({ pose: "give", face: -1, hold: "cl-sick", look: 0 }) }), say(400, { p: { sick: true }, ...A({ hold: null }) }), beat(0, A({ pose: "hands" })), free()],
    room: [beat(900, A({ ...SIT })), beat(300, { p: { note: true } }), say(300, A({ pose: "point", face: 1, hold: null, holdL: null, head: "up", look: 0.5 })), beat(1600), beat(0, A({ pose: "hands", head: null, look: 0 })), free()],
    bye: [beat(500, A({ pose: "stand", seat: false, hold: null, holdL: null, head: null, look: 0 })), beat(300, A({ pose: "wave", head: "nod" })), say(1200), beat(0, A({ pose: "hands", head: null })), free()],
  },
  script: {
    "clinic-doctor": { n1: "invite", n2: "fever", b3: "weak", n3: "throat", n4: "allergy", n5: "refer", n6: "sick", t6: "room", fin: "bye" },
  },
  css: `
.cl-held{transform-box:view-box;transform-origin:0 0;animation:cl-in .35s .15s ease both}
.cl-on{opacity:0;transform:translateY(-14px);transition:opacity .35s ease,transform .45s cubic-bezier(.3,1.3,.5,1)}
.cl-on.on{opacity:1;transform:none}
.cl-print{transform:translateY(26px);transition:transform .9s linear}.cl-print.on{transform:none}
.cl-tube{animation:cl-in .4s .2s ease both}
.cl-beam{animation:cl-beam 1.2s ease-in-out infinite}
.cl-siren{animation:cl-siren 1.6s steps(1) infinite}
.cl-beat{transform-box:fill-box;transform-origin:50% 50%;animation:cl-hb 1s ease-in-out infinite}
.cl-type .p-type .lf-fa.r{animation:lf-tap .5s ease-in-out infinite alternate}
.cl-cough .lf-hd{animation:cl-cough 6s ease-in-out infinite}
.cl-cough .lf-ua.r{animation:cl-hand 6s ease-in-out infinite}
@keyframes cl-in{from{opacity:0}to{opacity:1}}
@keyframes cl-beam{0%,100%{opacity:.35}50%{opacity:.7}}
@keyframes cl-siren{0%{fill:#2D6FA3}50%{fill:#B8322A}}
@keyframes cl-hb{0%,100%{transform:scale(1)}20%{transform:scale(1.25)}}
@keyframes cl-cough{0%,70%,100%{transform:rotate(0)}74%,82%{transform:rotate(10deg)}78%,86%{transform:rotate(4deg)}}
@keyframes cl-hand{0%,66%,92%,100%{transform:rotate(9deg)}72%,88%{transform:rotate(-150deg)}}
`,
  Stage,
};
