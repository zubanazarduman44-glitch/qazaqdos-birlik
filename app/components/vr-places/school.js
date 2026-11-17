// VR өмір: МЕКТЕП. Мектеп ауласы (ту желбіреп тұр, балалар кіріп жатыр) → қос есік ашылады → сыныпқа кіріп, партаға отырамыз.
// Айгүл терезе жанынан бізге қарай келеді. Түйіндер: тақтаны көрсету, қалам беру, қасына отыру, мұғалім кіргенде бәрі орнынан тұру,
// қоңырау соғылып, үзіліс — Айгүл есікке шақырады.
import { C, ST, Box, Cone, Pool, Item, Person, Actor, Passerby, Horn, walkTo, beat, say, free } from "./kit";

const AIGUL = { f: true, skin: 0, hair: "#2B1A12", hs: "bows", kid: true, top: "#1F2A44", collar: C.surf, skirt: "#1F2A44", pants: "#2B2F3A", legs: "#2B2F3A" };
const TEACH = { f: true, skin: 1, hair: "#3B2416", hs: "bun", top: C.blue, collar: C.surf, skirt: C.blue2, glasses: true, pants: "#C48D63", legs: "#C48D63" };
const K1 = { kid: true, skin: 1, hair: "#1E1A1A", hs: "short", top: "#1F2A44", collar: C.surf };
const K2 = { kid: true, f: true, skin: 2, hair: "#3B2416", hs: "braid", top: "#1F2A44", collar: C.surf };
const K3 = { kid: true, skin: 0, hair: "#4E2F1B", hs: "short", top: "#1F2A44", collar: C.surf, glasses: true };
const KID_OUT = [
  { kid: true, skin: 1, hair: "#1E1A1A", hs: "short", top: "#1F2A44", collar: C.surf },
  { kid: true, f: true, skin: 0, hair: "#2B1A12", hs: "bows", top: "#1F2A44", skirt: "#1F2A44", collar: C.surf },
];

const spots = {
  window: { x: 676, y: 300, s: 0.6 },
  mid: { x: 640, y: 372, s: 0.8 },
  beside: { x: 616, y: 484, s: 0.94 },
  seat: { x: 690, y: 470, s: 0.94 },
  tdoor: { x: 536, y: 272, s: 0.54 },
  tdesk: { x: 236, y: 280, s: 0.56 },
};
const shots = {
  wide: { x: 400, y: 236, z: 1, a: "m" },
  door: { x: 400, y: 290, z: 1.9, a: "m" },
  through: { x: 400, y: 300, z: 4.4, a: "m" },
  entry: { x: 400, y: 190, z: 1.3, a: "m" },
  aisle: { x: 410, y: 236, z: 1.14 },
  seat: { x: 400, y: 236, z: 1.04 },
};

function Yard({ st }) {
  const open = st.p.door;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="320" fill="#CFE6EC" />
      <circle cx="720" cy="40" r="26" fill={C.gold2} opacity=".8" />
      {/* ту */}
      <rect x="40" y="30" width="6" height="360" fill="#9AA3B0" />
      <g transform="translate(46 34)"><g className="sc-flag">
        <rect width="110" height="62" fill="#1FA8C9" />
        <path d="M6 4v54" stroke={C.gold} strokeWidth="5" strokeDasharray="6 4" />
        <circle cx="62" cy="24" r="10" fill={C.gold} />
        {Array.from({ length: 12 }, (_, i) => <path key={i} transform={`rotate(${i * 30} 62 24)`} d="M62 10v-5" stroke={C.gold} strokeWidth="2" />)}
        <path d="M40 46q22 -12 44 0q-22 -4 -44 0Z" fill={C.gold} />
      </g></g>
      {/* ғимарат */}
      <rect x="110" y="70" width="640" height="320" fill="#EFE3CC" />
      <rect x="110" y="70" width="640" height="16" fill={C.blue} />
      <rect x="110" y="214" width="640" height="10" fill="#E2D2B2" />
      {[0, 1].map((r) => Array.from({ length: 8 }, (_, c) => {
        const x = 132 + c * 76, y = 102 + r * 132;
        if (r === 1 && (c === 3 || c === 4)) return null;
        return (
          <g key={`${r}${c}`}>
            <rect x={x} y={y} width="52" height="86" rx="4" fill={C.blue} />
            <rect x={x + 5} y={y + 5} width="42" height="76" rx="2" fill="#DCEFF3" />
            <path d={`M${x + 26} ${y + 5}v76M${x + 5} ${y + 34}h42`} stroke={C.blue} strokeWidth="3" />
          </g>
        );
      }))}
      {/* кіреберіс */}
      <path d="M330 236L430 196L530 236Z" fill={C.blue} />
      <rect x="338" y="236" width="184" height="154" fill="#E2D2B2" />
      <Box x={352} y={244} w={156} h={30} r={5} c={C.blue} st={null} />
      <text x="430" y="265" textAnchor="middle" fontSize="18" fontWeight="800" letterSpacing="4" fill={C.cream}>МЕКТЕП</text>
      <rect x="378" y="284" width="104" height="106" fill="#6B3F1E" />
      <rect x="382" y="288" width="96" height="102" fill="#F6E3BE" />
      {[[382, 0], [430, 1]].map(([x, r]) => (
        <g key={x} transform={`translate(${r ? 478 : 382} 288)`}>
          <g className="lf-mv" style={{ transform: open ? `scaleX(0.16) skewY(${r ? 10 : -10}deg)` : "none" }}>
            <rect x={r ? -48 : 0} width="48" height="102" fill={C.wood} />
            <rect x={r ? -40 : 8} y="8" width="32" height="50" rx="2" fill="#BFD9DD" />
            <rect x={r ? -12 : 4} y="60" width="8" height="4" rx="2" fill={C.gold} />
          </g>
        </g>
      ))}
      <rect x="350" y="388" width="160" height="10" fill="#C9B994" />
      <rect x="-40" y="396" width="880" height="110" fill="#C9BCA3" />
      {[700, 780].map((x, i) => (
        <g key={x} transform={`translate(${x} 396)`}><rect x="-5" y="-110" width="10" height="110" fill={C.wood2} /><circle cy="-130" r={40 - i * 6} fill={C.leaf2} /><circle cx="-20" cy="-110" r="24" fill={C.leaf} /></g>
      ))}
      <Passerby o={KID_OUT[0]} y={410} s={0.42} x0={-40} x1={430} d={12} delay={-3} seed={2} />
      <Passerby o={KID_OUT[1]} y={428} s={0.44} x0={860} x1={430} d={14} delay={-9} seed={5} />
    </g>
  );
}

function Kid({ o, a, stand, cls, seed, hold }) {
  return <g className={cls}><Actor a={a}><Person o={o} pose={stand ? "stand" : "sit"} hold={hold} seed={seed} look={stand ? 0 : a.look || 0} /></Actor></g>;
}
function Desk({ x, y, w = 150, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-w / 2 + 8} y="10" width="8" height="54" fill="#5E6670" /><rect x={w / 2 - 16} y="10" width="8" height="54" fill="#5E6670" />
      <path d={`M${-w / 2} 0H${w / 2}L${w / 2 + 8} 14H${-w / 2 - 8}Z`} fill={C.wood3} />
      <rect x={-w / 2 - 8} y="14" width={w + 16} height="8" fill={C.wood} />
      <rect x={-w / 2 + 4} y="22" width={w - 8} height="30" fill={C.wood2} />
    </g>
  );
}

function Room({ st, talk, mood }) {
  const p = st.p, g = st.a.npc, t = st.a.teacher;
  const up = p.stand && !p.brk;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="330" fill="#EADFC6" />
      <rect x="-40" y="200" width="880" height="80" fill="#7FA89A" />
      <path d="M-40 200h880" stroke="#5E8C7C" strokeWidth="4" />
      <path d="M-40 280H840V500H-40Z" fill="#C49A68" />
      {[-300, -150, 0, 150, 300, 450, 600, 750, 900, 1050].map((x) => <path key={x} d={`M${400 + (x - 400) * 0.3} 280L${x} 500`} stroke="#B0855A" strokeWidth="2" />)}
      {/* терезелер мен күн сәулесі */}
      {[620, 730].map((x) => (
        <g key={x}>
          <rect x={x} y="40" width="90" height="150" rx="4" fill="#F4ECDA" />
          <rect x={x + 6} y="46" width="78" height="138" rx="2" fill="#CFE6EC" />
          <path d={`M${x + 45} 46v138M${x + 6} 100h78`} stroke="#F4ECDA" strokeWidth="5" />
          <circle cx={x + 26} cy="172" r="8" fill={C.leaf} /><rect x={x + 18} y="176" width="16" height="12" rx="2" fill={C.red} />
          <path className="lf-glow" d={`M${x + 6} 46L${x + 84} 46L${x - 60} 420L${x - 200} 420Z`} fill="#FFF3C8" opacity=".2" />
        </g>
      ))}
      {/* тақта, Абай портреті */}
      <g transform="translate(270 22)">
        <rect x="-26" y="0" width="52" height="64" rx="3" fill={C.wood2} /><rect x="-21" y="5" width="42" height="54" fill="#E9DFC8" />
        <circle cx="0" cy="26" r="11" fill="#C98E65" /><path d="M-11 22q11-16 22 0" fill="#BDB6AA" /><path d="M-8 32q8 10 16 0" fill="#BDB6AA" /><path d="M-16 58q0-18 16-18t16 18Z" fill="#3A3F4E" />
      </g>
      <rect x="96" y="94" width="350" height="128" rx="6" fill={C.wood2} />
      <rect x="104" y="100" width="334" height="114" rx="3" fill="#2F4A3E" />
      <text x="271" y="140" textAnchor="middle" fontSize="24" fill="#F4F1E6" style={{ fontFamily: "var(--head)" }}>Қазақ тілі</text>
      <text x="140" y="176" fontSize="15" fill="#F4F1E6" opacity=".85">Сәлем, мектеп!</text>
      <path d="M140 196h120" stroke="#F4F1E6" strokeWidth="2" opacity=".5" />
      <rect x="110" y="214" width="320" height="6" fill={C.wood} />
      {/* сынып есігі */}
      <rect x="494" y="104" width="86" height="172" fill={C.wood2} />
      <rect x="500" y="110" width="74" height="166" fill="#8B5A2E" />
      <g transform="translate(500 110)"><g className="lf-mv" style={{ transform: p.cdoor ? "scaleX(0.2) skewY(8deg)" : "none" }}>
        <rect width="74" height="166" fill={C.wood} /><rect x="12" y="14" width="50" height="56" rx="2" fill="#DCEFF3" /><circle cx="62" cy="96" r="4" fill={C.gold} />
      </g></g>
      <g className={`sc-bell${p.bell ? " on" : ""}`} transform="translate(537 86)"><path d="M-12 8q0-18 12-18t12 18Z" fill={C.gold} /><circle cy="10" r="3" fill={C.gold} /><path d="M-20 -6q-6 8 0 16M20 -6q6 8 0 16" stroke={C.gold} strokeWidth="2.4" fill="none" /></g>
      {/* мұғалім үстелі */}
      <rect x="150" y="250" width="180" height="12" fill={C.wood} /><rect x="160" y="262" width="160" height="40" fill={C.wood2} />
      <g transform="translate(300 236)"><circle r="14" fill="#5B87A8" /><path d="M-9 -6q9 4 6 14M4 -12q-2 8 8 8" stroke={C.leaf} strokeWidth="4" fill="none" /><path d="M0 14v6M-10 22h20" stroke={C.wood2} strokeWidth="3" /></g>
      <Actor a={t} dur={t?.dur}><Person o={TEACH} pose={t?.pose} look={t?.look || 0} head={t?.head} hold={t?.hold} seed={6} /></Actor>
      {/* сынып оқушылары */}
      <Kid o={K1} a={{ x: 180, y: 336, s: 0.62, look: 0.3 }} stand={up} cls="sc-write" seed={1} hold="pen" />
      <Kid o={K2} a={{ x: 300, y: 336, s: 0.62, look: -0.6 }} stand={up} cls="sc-look" seed={3} />
      <Desk x={240} y={300} w={220} s={0.62} />
      <Kid o={K3} a={{ x: 470, y: 336, s: 0.62 }} stand={up} cls="sc-hand" seed={8} />
      <Desk x={490} y={300} w={180} s={0.62} />
      <Pool x={340} y={330} rx={260} ry={14} c="#FFF3C8" op={0.25} />
      <Actor a={g} dur={g?.dur}>
        <Person o={AIGUL} pose={g?.pose} talk={talk} mood={mood} look={g?.look || 0} head={g?.head} hold={g?.hold} seed={2} />
      </Actor>
      {/* біздің парта */}
      <g className="lf-mv" style={{ transform: p.desk ? "none" : "translate(400px, 520px) scale(1.5) translate(-400px, -440px)" }}>
        <path d="M40 410H760L800 470H0Z" fill={C.wood3} />
        <path d="M0 470H800" stroke={C.wood} strokeWidth="12" />
        <path d="M60 418H740" stroke={ST} strokeWidth="1.5" strokeDasharray="6 6" />
        <g transform="translate(300 436) rotate(-4)"><path d="M-70 -18H0V20H-70Z" fill="#F4F1E6" /><path d="M0 -18H70V20H0Z" fill="#FFFDF7" /><path d="M-60 -8h50M-60 0h44M10 -8h50M10 0h40" stroke="#B8C6C8" strokeWidth="2" /></g>
        <g className={`sc-on${p.book ? " on" : ""}`}><Item k="book" x={470} y={436} s={1.4} r={4} /></g>
        <g className={`sc-on${p.pen ? " on" : ""}`}><Item k="pen" x={380} y={438} s={1.4} r={-70} /></g>
      </g>
    </g>
  );
}

function Stage({ st, talk, mood }) {
  return (
    <>
      <g className={`lf-set${st.set === "out" ? "" : " off"}`}><Yard st={st} /></g>
      <g className={`lf-set${st.set === "in" ? "" : " off"}`}><Room st={st} talk={talk} mood={mood} /></g>
    </>
  );
}

const A = (patch) => ({ a: { npc: patch } });

export default {
  spots,
  shots,
  dip: "#FFF3C8",
  init: { set: "out", cam: "wide", p: { door: false, desk: false, book: true }, a: { npc: { at: "window", pose: "stand", look: 0.8 }, teacher: { at: "tdoor", hide: true, pose: "stand", hold: "book" } } },
  intro: [
    beat(900),
    beat(1500, { cam: "door", walk: true }),
    beat(650, { walk: false, p: { door: true } }),
    beat(900, { cam: "through", walk: true }),
    beat(380, { dip: true }),
    beat(60, { set: "in", cam: "entry", camMs: 0 }),
    beat(650, { dip: false }),
    beat(1400, { cam: "aisle", walk: true }),
    beat(800, { walk: false, cam: "seat", camMs: 900, p: { desk: true } }),
    beat(500, A({ look: -0.3, head: "tilt" })),
    ...walkTo("npc", "mid", 1000, "walk"),
    ...walkTo("npc", "beside", 1000, "stand"),
  ],
  acts: {
    talk: [beat(250, A({ pose: "stand", head: null, hold: null, look: 0 })), say(), free()],
    hello: [beat(500, A({ pose: "wave", head: null, look: 0 })), say(600), beat(0, A({ pose: "hands" })), free()],
    board: [beat(400, A({ pose: "point", face: -1, look: -0.7, head: null })), say(1300), beat(0, A({ pose: "hands", look: 0 })), free()],
    pen: [beat(500, A({ pose: "give", face: -1, hold: "pen", head: null })), say(500, { p: { pen: true }, ...A({ hold: null }) }), beat(0, A({ pose: "hands" })), free()],
    share: [beat(300, A({ head: "nod" })), say(300), ...walkTo("npc", "seat", 700, "sit"), free()],
    teacher: [
      beat(300, { p: { cdoor: true }, a: { teacher: { hide: false } } }),
      beat(1300, { a: { teacher: { at: "tdesk", pose: "walk" } } }),
      beat(150, { p: { cdoor: false, stand: true }, a: { teacher: { pose: "hands", look: 0.3 }, npc: { at: "beside", pose: "stand", look: -0.5, head: null, dur: 500 } } }),
      say(), free(),
    ],
    bell: [beat(900, { p: { bell: true, brk: true }, a: { teacher: { hide: true } } }), beat(300, A({ pose: "point", face: 1, look: 0, head: null })), say(900), beat(0, A({ pose: "hands" })), free()],
    bye: [beat(300, A({ pose: "wave", head: "nod", look: 0 })), say(1200), free(), ...walkTo("npc", "tdoor", 1800, "stand")],
  },
  script: {
    "school-classmate": { n1: "hello", n2: "talk", n3: "board", n4: "pen", b4: "share", n5: "teacher", n6: "bell", fin: "bye" },
  },
  css: `
.sc-flag{transform-box:view-box;transform-origin:0 0;animation:sc-wave 3s ease-in-out infinite}
.sc-on{opacity:0;transform:translateY(-14px);transition:opacity .35s ease,transform .45s cubic-bezier(.3,1.3,.5,1)}
.sc-on.on{opacity:1;transform:none}
.sc-bell{opacity:.85}.sc-bell.on{animation:sc-ring .25s ease-in-out 8}
.sc-write .lf-fa.r{animation:lf-scrib .5s ease-in-out infinite alternate}
.sc-look .lf-face{animation:sc-look 7s ease-in-out infinite}
.sc-hand .p-sit .lf-ua.r{animation:sc-handu 9s ease-in-out infinite}
@keyframes sc-wave{0%,100%{transform:skewY(0deg) scaleX(1)}50%{transform:skewY(4deg) scaleX(.96)}}
@keyframes sc-ring{0%,100%{transform:translate(537px,86px) rotate(0)}50%{transform:translate(537px,86px) rotate(16deg)}}
@keyframes sc-look{0%,40%,100%{transform:translateX(-4px)}50%,85%{transform:translateX(6px)}}
@keyframes sc-handu{0%,60%,90%,100%{transform:rotate(-14deg)}66%,84%{transform:rotate(-170deg)}}
`,
  Stage,
};
