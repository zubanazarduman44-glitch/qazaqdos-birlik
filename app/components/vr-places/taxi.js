// VR өмір: ТАКСИ. Көше жиегінде тұрмыз → такси келіп тоқтайды → артқы емес, алдыңғы есік ашылады → ішке отырамыз.
// Іште: жүргізуші сол жақта рульде, алдыңғы әйнектен жол «бізге қарай» ағады (жолақтар, бағаналар). Түйіндер: кептеліс (жол баяулайды),
// әуежай (ұшақ), музыка (эквалайзер), келу (жол тоқтап, кіреберіс шығады), төлеу (қолма-қол / Kaspi).
import { C, ST, Box, Item, Person, Actor, Passerby, Horn, beat, say, free } from "./kit";

const DRIVER = { skin: 1, hair: "#2B1A12", hs: "cap", cap: "#3A3F4E", top: "#7A4A21", tache: true, vest: "#5A3A22" };
const P1 = { f: true, skin: 0, hair: "#3B2416", hs: "bun", top: C.blue };
const P2 = { skin: 2, hair: "#1E1A1A", hs: "short", top: C.leaf2 };

const spots = { seat: { x: 190, y: 524, s: 1.3 } };
const shots = {
  wide: { x: 400, y: 236, z: 1, a: "m" },
  door: { x: 470, y: 300, z: 1.8, a: "m" },
  through: { x: 470, y: 300, z: 4.2, a: "m" },
  seat: { x: 400, y: 225, z: 1 },
  look: { x: 380, y: 225, z: 1.06 },
};

function Car({ open }) {
  return (
    <g>
      <ellipse cx="400" cy="398" rx="250" ry="12" fill="#3A2210" opacity=".2" />
      <path d="M170 380V318Q172 296 196 290L276 280L334 226Q348 214 372 214H520Q546 214 562 230L612 280L660 290Q690 298 692 326V380Z" fill="#F4EEE1" />
      <path d="M346 232Q352 224 366 224H430V282H300Z" fill="#9FC4CF" />
      <path d="M440 224H516Q530 224 540 234L584 282H440Z" fill="#9FC4CF" />
      {/* жүргізушінің сұлбасы */}
      <g fill="#5B4A3A" opacity=".55"><circle cx="388" cy="248" r="14" /><path d="M366 282q0-22 22-22t22 22Z" /></g>
      {/* шахмат жолағы */}
      <g>{Array.from({ length: 26 }, (_, i) => <rect key={i} x={186 + i * 18} y={i % 2 ? 314 : 322} width="9" height="8" fill="#2E3440" />)}</g>
      <path d="M176 330H688" stroke={C.gold} strokeWidth="4" />
      {/* төбедегі белгі */}
      <rect x="402" y="194" width="74" height="22" rx="6" fill={C.gold2} />
      <text x="439" y="210" textAnchor="middle" fontSize="13" fontWeight="800" fill={C.ink}>ТАКСИ</text>
      {/* есіктер */}
      <path d="M432 230V372" stroke="#D9D0BE" strokeWidth="3" />
      <g transform="translate(436 226)">
        <g className="lf-mv" style={{ transform: open ? "scaleX(1.25) skewY(-14deg) translateX(-6px)" : "none" }}>
          <path d="M4 4H80Q94 4 104 14L148 56V146H4Z" fill="#ECE3D2" stroke="#D2C7B2" strokeWidth="2" />
          <path d="M8 4H80Q94 4 104 14L146 56H8Z" fill="#9FC4CF" />
          <rect x="22" y="76" width="26" height="7" rx="3" fill="#B8AE9B" />
        </g>
      </g>
      <rect x="664" y="300" width="22" height="14" rx="4" fill="#F6E3B0" /><rect x="172" y="306" width="14" height="14" rx="4" fill="#C8392E" />
      {[260, 600].map((x) => (
        <g key={x} transform={`translate(${x} 380)`}>
          <circle r="34" fill={C.ink} /><circle r="18" fill="#B8C1C6" />
          <g className="tx-wheel"><path d="M0 -16V16M-16 0H16" stroke="#7E878C" strokeWidth="4" /></g>
        </g>
      ))}
    </g>
  );
}

function Street({ st }) {
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="300" fill="#CFE6EC" />
      <rect x="-40" y="40" width="200" height="230" fill="#E2C49A" /><rect x="170" y="80" width="230" height="190" fill="#D9B98C" />
      <rect x="410" y="20" width="190" height="250" fill="#E9D3B0" /><rect x="610" y="70" width="240" height="200" fill="#CDB58E" />
      {[[-20, 70], [190, 110], [430, 50], [630, 100]].map(([x, y]) => [0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${x}${r}${c}`} x={x + 14 + c * 40} y={y + 12 + r * 46} width="24" height="30" rx="2" fill="#F6E7C6" />)))}
      <rect x="-40" y="262" width="880" height="16" fill="#B9A887" />
      <rect x="-40" y="278" width="880" height="122" fill="#6F7378" />
      {[0, 120, 240, 360, 480, 600, 720].map((x) => <rect key={x} x={x} y="334" width="70" height="6" rx="2" fill="#E9E4D8" />)}
      <rect x="-40" y="396" width="880" height="14" fill="#B9A887" />
      <rect x="-40" y="410" width="880" height="90" fill="#CDBFA6" />
      <Passerby o={P1} y={274} s={0.4} x0={-60} x1={880} d={20} delay={-7} seed={1} />
      <g className="lf-mv" style={{ transform: st.p.car ? "none" : "translateX(760px)", transitionDuration: "1.8s", transitionTimingFunction: "cubic-bezier(.15,.6,.25,1)" }}>
        <g className={st.p.car ? "tx-stop" : "tx-roll"}><Car open={st.p.cdoor} /></g>
      </g>
      <Passerby o={P2} y={270} s={0.38} x0={880} x1={-60} d={24} delay={-15} seed={8} />
    </g>
  );
}

// Алдыңғы әйнектен көрінетін жол: жолақтар мен бағаналар ортадағы «жоғалу нүктесінен» бізге қарай ағады
const VP = [470, 150];
function Road({ p }) {
  const mode = p.arrive || p.parked ? " stop" : p.jam ? " jam" : p.fast ? " fast" : "";
  return (
    <g className={`tx-road${mode}`}>
      <rect x="-40" y="-40" width="880" height="200" fill="#CFE6EC" />
      <path d="M-40 150h60v-40h50v-20h60v60h70v-30h40v30h60v-50h50v50H520v-70h70v40h50v-26h60v56h180v20H-40Z" fill="#B7CCD5" />
      <rect x="-40" y="150" width="880" height="300" fill="#8A8E92" />
      <path d={`M${VP[0] - 4} 150L-40 400V150ZM${VP[0] + 4} 150L840 330V150Z`} fill="#A8B59A" />
      <path d={`M${VP[0]} 150L-40 400M${VP[0]} 150L840 330`} stroke="#E9E4D8" strokeWidth="4" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} className="tx-dash" style={{ animationDelay: `${-i * 0.35}s` }}>
          <path d={`M${VP[0] - 2} 150L${VP[0] + 2} 150L${VP[0] + 14} 450L${VP[0] - 14} 450Z`} fill="#F4F1E6" />
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i} className="tx-pole" style={{ animationDelay: `${-i * 0.7}s` }}><rect x="-3" y="-60" width="6" height="60" fill="#5E6670" /><circle cx="0" cy="-60" r="7" fill={C.leaf} /><circle cx="-6" cy="-52" r="6" fill={C.leaf2} /></g>
      ))}
      {/* алдағы көліктер */}
      <g className="tx-ahead"><path d="M436 196h70l6 16h-82Z" fill="#5B87A8" /><rect x="430" y="210" width="82" height="16" rx="4" fill="#5B87A8" /><rect x="434" y="212" width="12" height="6" rx="2" fill={p.jam ? "#FF4A3A" : "#C8392E"} /><rect x="496" y="212" width="12" height="6" rx="2" fill={p.jam ? "#FF4A3A" : "#C8392E"} /></g>
      <g className={`tx-jam${p.jam ? " on" : ""}`}>
        <path d="M380 172h40l4 10h-48Z" fill="#C0602F" /><rect x="374" y="180" width="52" height="11" rx="3" fill="#C0602F" /><rect x="377" y="182" width="8" height="4" fill="#FF4A3A" /><rect x="415" y="182" width="8" height="4" fill="#FF4A3A" />
        <path d="M520 168h36l4 9h-44Z" fill="#E9E4D8" /><rect x="514" y="175" width="48" height="10" rx="3" fill="#E9E4D8" /><rect x="517" y="177" width="7" height="4" fill="#FF4A3A" /><rect x="551" y="177" width="7" height="4" fill="#FF4A3A" />
      </g>
      <g className={`tx-plane${p.plane ? " on" : ""}`}><path d="M0 0l40 -4 18 -12h8l-8 14 20 -2 6 -6h6l-4 9 4 9h-6l-6 -6 -20 -2 8 14h-8l-18 -12Z" fill="#fff" /></g>
      {/* келген жер: кіреберіс */}
      <g className="lf-mv" style={{ transform: p.arrive ? "none" : "translate(470px,150px) scale(.05) translate(-470px,-150px)", opacity: p.arrive ? 1 : 0, transitionDuration: "1.6s" }}>
        <rect x="560" y="40" width="300" height="250" fill="#E9D3B0" />
        <rect x="620" y="150" width="90" height="140" fill={C.wood2} /><rect x="630" y="160" width="70" height="130" fill="#BFD9DD" />
        <rect x="604" y="124" width="122" height="22" rx="4" fill={C.blue} /><text x="665" y="140" textAnchor="middle" fontSize="13" fontWeight="800" fill={C.surf}>150</text>
        {[0, 1, 2].map((c) => <rect key={c} x={740 + c * 0} y={60 + c * 50} width="60" height="34" rx="2" fill="#F6E7C6" />)}
      </g>
    </g>
  );
}

function Cabin({ st, talk, mood }) {
  const p = st.p, d = st.a.npc;
  return (
    <g>
      <g className={`tx-ride${p.arrive || p.parked ? " stop" : ""}`}>
        <Road p={p} />
      </g>
      {/* әйнек жақтауы, төбе, айна, тұмар */}
      <path d="M-40 -40H840V40Q600 22 400 24Q180 26 -40 60Z" fill="#3A3F4E" />
      <path d="M-40 60Q-10 200 30 290L-40 300Z" fill="#3A3F4E" />
      <path d="M840 40Q810 200 780 300L840 300Z" fill="#3A3F4E" />
      <path d="M120 40l60 0M150 46l30 0" stroke="#fff" strokeWidth="4" opacity=".25" />
      <g transform="translate(460 30)">
        <rect x="-4" y="-10" width="8" height="18" fill="#2E3440" />
        <rect x="-60" y="6" width="120" height="30" rx="10" fill="#2E3440" /><rect x="-54" y="11" width="108" height="20" rx="7" fill="#8FA6AE" />
        <g className="tx-charm"><path d="M0 36V70" stroke={C.red} strokeWidth="2" /><path d="M-10 70H10L0 88Z" fill={C.red} /><path d="M-6 72H6L0 82Z" fill="none" stroke={C.gold} strokeWidth="1.5" /></g>
      </g>
      {/* панель */}
      <path d="M-40 300Q400 250 840 300V500H-40Z" fill="#4A4F5A" />
      <path d="M-40 300Q400 250 840 300" stroke="#2E3440" strokeWidth="8" fill="none" />
      <path d="M-20 318Q400 272 820 318" stroke={ST} strokeWidth="1.5" strokeDasharray="6 6" fill="none" opacity=".5" />
      {/* жүргізуші */}
      <Actor a={d} dur={d?.dur} shadow={false}>
        <Person o={DRIVER} pose={d?.pose} talk={talk} mood={mood} look={d?.look ?? -0.8} head={d?.head} hold={d?.hold} seed={5} seat />
      </Actor>
      {/* руль */}
      <g transform="translate(196 404)">
        <ellipse rx="82" ry="62" fill="none" stroke="#2E3440" strokeWidth="16" />
        <path d="M-68 0Q0 30 68 0" stroke="#2E3440" strokeWidth="16" fill="none" /><circle r="22" fill="#2E3440" /><Horn x={0} y={0} s={0.5} c={C.gold} />
      </g>
      {/* навигатор (телефон) */}
      <g transform="translate(560 280)">
        <rect x="-44" y="-30" width="88" height="56" rx="8" fill={C.ink} />
        <rect x="-38" y="-24" width="76" height="44" rx="4" fill="#E8EFE6" />
        <path d="M-30 12Q-10 -16 6 0T30 -16" stroke="#C9D3C6" strokeWidth="6" fill="none" />
        <path d="M-30 12Q-10 -16 6 0T30 -16" stroke={C.blue} strokeWidth="3" fill="none" />
        {p.plane ? <path d="M22 -20l8 4-8 4z" fill={C.red} /> : <circle cx="30" cy="-16" r="4" fill={C.red} />}
        <circle className="tx-gps" cx="-30" cy="12" r="4" fill={C.gold} />
      </g>
      {/* радио: музыка */}
      <g transform="translate(560 360)">
        <rect x="-60" y="-18" width="120" height="36" rx="6" fill="#2E3440" />
        <g className={`tx-eq${p.music ? " on" : ""}`}>{[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={-44 + i * 13} y="-10" width="7" height="20" rx="2" fill={p.music ? "#9FD3B4" : "#4A5260"} style={{ animationDelay: `${-i * 0.13}s` }} />)}</g>
      </g>
      <g className={`tx-notes${p.music ? " on" : ""}`}><path d="M600 300v-26l14 -4v24" stroke={C.gold} strokeWidth="3" fill="none" /><circle cx="597" cy="301" r="5" fill={C.gold} /><circle cx="611" cy="295" r="5" fill={C.gold} /></g>
      <g className={`tx-on${p.shown ? " on" : ""}`}><g transform="translate(380 300)"><rect x="-58" y="-34" width="116" height="40" rx="8" fill={C.surf} stroke={C.gold} strokeWidth="2" /><text x="0" y="-9" textAnchor="middle" fontSize="16" fontWeight="800" fill={C.ink}>8 707 456 78 90</text></g></g>
      {p.paid && <g className="tx-paid"><circle cx="420" cy="230" r="22" fill="#2F8F5B" /><path d="M409 230l8 8 14-15" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" /></g>}
    </g>
  );
}

function Stage({ st, talk, mood }) {
  return (
    <>
      <g className={`lf-set${st.set === "out" ? "" : " off"}`}><Street st={st} /></g>
      <g className={`lf-set${st.set === "in" ? "" : " off"}`}><Cabin st={st} talk={talk} mood={mood} /></g>
    </>
  );
}

const D = (patch) => ({ a: { npc: patch } });
const turn = (ms = 350, extra = {}) => beat(ms, D({ pose: "drive", look: 0.75, head: null, hold: null, ...extra }));
const road = (ms = 500) => beat(ms, D({ pose: "drive", look: -0.8, head: null, hold: null }));

export default {
  spots,
  shots,
  dip: "#E8EFE6",
  init: { set: "out", cam: "wide", p: { car: false, cdoor: false }, a: { npc: { at: "seat", pose: "drive", look: -0.8 } } },
  intro: [
    beat(700),
    beat(2000, { p: { car: true } }),
    beat(500, { p: { cdoor: true } }),
    beat(1300, { cam: "door", walk: true }),
    beat(700, { cam: "through", walk: true }),
    beat(380, { dip: true, walk: false }),
    beat(60, { set: "in", cam: "look", camMs: 0, p: { parked: true } }),
    beat(700, { dip: false }),
    beat(900, { cam: "seat", camMs: 900 }),
  ],
  acts: {
    talk: [turn(), say(), free()],
    greet: [turn(400, { head: "nod" }), say(), free()],
    go: [turn(300, { head: "nod" }), say(300, { p: { parked: false } }), road(900), beat(800, { p: { jam: true } }), free()],
    airport: [turn(300, { head: "tilt" }), say(200, { p: { parked: false, plane: true } }), road(400), free()],
    hurry: [turn(300, { head: "nod" }), say(500, { p: { fast: true } }), road(0), free()],
    music: [beat(600, { p: { jam: false }, ...D({ pose: "drive", look: -0.8, head: null }) }), turn(300, { head: "tilt" }), say(400, { p: { music: true } }), road(0), free()],
    arrive: [beat(1600, { p: { jam: false, fast: false, music: false, plane: false, arrive: true } }), turn(300), say(), free()],
    price: [turn(300), say(300, D({ pose: "give", look: 0.75, hold: "phone" })), beat(0, D({ pose: "drive", hold: null })), free()],
    number: [turn(300), beat(400, { ...D({ pose: "give", look: 0.75, hold: "phone" }), p: { shown: true } }), say(), free()],
    pay: ({ st }) => [
      ...(st.p.shown ? [beat(900, { hand: "phone" }), beat(500, { p: { paid: true } })] : [beat(900, { hand: "note" }), beat(500, D({ pose: "give", look: 0.75, hold: "note" }))]),
      beat(300, { hand: null, p: { shown: false }, ...D({ pose: "wave", hold: null, look: 0.75, head: "nod" }) }), say(), free(),
    ],
  },
  script: {
    "taxi-ride": { n1: "greet", n2: "go", a2: "airport", a3: "hurry", n3: "music", n4: "arrive", n5: "price", k6: "number", fin: "pay" },
  },
  css: `
.tx-roll .tx-wheel{animation:tx-spin .4s linear infinite}
.tx-wheel{transform-box:fill-box;transform-origin:50% 50%}
.tx-dash{transform-box:view-box;transform-origin:470px 150px;animation:tx-dash 1.4s linear infinite}
.tx-pole{transform-box:view-box;transform-origin:0 0;animation:tx-pole 2.1s ease-in infinite}
.tx-road.jam .tx-dash{animation-duration:4.2s}.tx-road.jam .tx-pole{animation-duration:6.3s}
.tx-road.fast .tx-dash{animation-duration:.8s}.tx-road.fast .tx-pole{animation-duration:1.2s}
.tx-road.stop .tx-dash,.tx-road.stop .tx-pole{animation-play-state:paused}
.tx-road.stop .tx-pole{opacity:0}
.tx-ride{animation:tx-rumble .5s ease-in-out infinite}.tx-ride.stop{animation:none}
.tx-ahead{animation:tx-ahead 6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
.tx-road.stop .tx-ahead,.tx-jam{opacity:0;transition:opacity .6s}.tx-jam.on{opacity:1}
.tx-plane{opacity:0}.tx-plane.on{opacity:1;animation:tx-fly 9s linear infinite}
.tx-charm{transform-box:view-box;transform-origin:0 36px;animation:tx-swing 2.4s ease-in-out infinite}
.tx-eq rect{transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(.3)}
.tx-eq.on rect{animation:vr-eq .4s ease-in-out infinite alternate}
.tx-notes{opacity:0}.tx-notes.on{animation:tx-note 2s ease-out infinite}
.tx-on{opacity:0;transform:translateY(10px);transition:opacity .35s,transform .4s}.tx-on.on{opacity:1;transform:none}
.tx-paid{transform-box:fill-box;transform-origin:50% 50%;animation:vr-stamp .5s ease-out both}
.tx-gps{animation:tx-gps 1.4s ease-in-out infinite}
@keyframes tx-spin{to{transform:rotate(360deg)}}
@keyframes tx-dash{0%{transform:scale(.02,.02);opacity:0}15%{opacity:1}100%{transform:scale(1.6,1.6)}}
@keyframes tx-pole{0%{transform:translate(500px,152px) scale(.08);opacity:0}15%{opacity:1}100%{transform:translate(900px,470px) scale(2.6);opacity:1}}
@keyframes tx-rumble{0%,100%{transform:translateY(0)}50%{transform:translateY(1.2px)}}
@keyframes tx-ahead{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(2px) scale(1.04)}}
@keyframes tx-fly{0%{transform:translate(-80px,60px)}100%{transform:translate(900px,10px)}}
@keyframes tx-swing{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}
@keyframes tx-note{0%{opacity:0;transform:translate(0,0)}30%{opacity:1}100%{opacity:0;transform:translate(14px,-40px)}}
@keyframes tx-gps{0%,100%{opacity:1}50%{opacity:.35}}
`,
  Stage,
};
