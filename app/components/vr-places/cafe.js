// VR өмір: КАФЕ «Дастарқан». Көше → есік ашылады → ішке кіріп, үстелге отырамыз → даяшы ас үйден мәзір әкеледі.
// Әр түйін: жазып алу, тамақ әкелу (сағат тілі 15 минутқа жылжиды), шай құю, есеп, картамен төлеу.
import { C, ST, Box, Cone, Pool, Shadow, Item, Person, Actor, Passerby, Horn, walkTo, beat, say, free } from "./kit";

const WAITER = { f: true, skin: 0, hair: "#2B1A12", hs: "bun", top: C.surf, apron: C.thread, collar: C.surf };
const G1 = { skin: 1, hair: "#3B2416", hs: "short", top: "#5B87A8" };
const G2 = { f: true, skin: 0, hair: "#4E2F1B", hs: "long", top: "#C0602F" };
const G3 = { skin: 2, hair: "#1E1A1A", hs: "short", top: C.green, glasses: true };
const P1 = { f: true, skin: 1, hair: "#2B1A12", hs: "scarf", scarf: C.blue, top: "#7A4A21" };
const P2 = { skin: 0, hair: "#3B2416", hs: "cap", cap: C.navy, top: "#9B3B30" };

const spots = {
  kitchen: { x: 646, y: 262, s: 0.5 },
  mid: { x: 560, y: 336, s: 0.74 },
  table: { x: 604, y: 476, s: 1.02 },
  counter: { x: 214, y: 268, s: 0.52 },
  aisle: { x: 330, y: 352, s: 0.8 },
};
const shots = {
  wide: { x: 400, y: 232, z: 1, a: "m" },
  door: { x: 400, y: 286, z: 1.85, a: "m" },
  through: { x: 400, y: 300, z: 4.4, a: "m" },
  entry: { x: 410, y: 196, z: 1.32, a: "m" },
  aisle: { x: 420, y: 238, z: 1.16 },
  seat: { x: 400, y: 236, z: 1.06 },
};

/* ── Көше ── */
function Street({ st }) {
  const open = st.p.door;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="300" fill="#CFE6EC" />
      <path d="M-40 150h70v-50h46v30h40v-70h52v90h20V260H-40Z" fill="#B7CCD5" />
      <path d="M640 260V96h56v40h40v-62h60v66h80v120Z" fill="#B7CCD5" />
      {/* қасбет */}
      <rect x="128" y="40" width="544" height="350" fill="#E2C49A" />
      <path d="M128 40h544v14H128Z" fill={C.wood2} />
      {[150, 230, 310].map((y) => <path key={y} d={`M128 ${y}h22M650 ${y}h22`} stroke="#C9A97A" strokeWidth="3" />)}
      {/* маңдайша */}
      <Box x={212} y={70} w={376} h={64} r={10} c={C.deep} sh="rgba(58,34,16,.3)" />
      <text x="400" y="112" textAnchor="middle" fontSize="34" fontWeight="700" letterSpacing="5" fill={C.cream} style={{ fontFamily: "var(--head)" }}>ДАСТАРҚАН</text>
      <Horn x={244} y={102} s={0.7} c={C.gold} /><Horn x={556} y={102} s={0.7} c={C.gold} />
      {/* шатыр */}
      <path d="M150 150H650L668 182H132Z" fill={C.red} />
      <path d={`M132 182${Array.from({ length: 12 }, (_, i) => `q${22.6} 16 ${45.2} 0`).join("")}`} fill={C.red} />
      <path d="M156 160H644" stroke={ST} strokeWidth="1.5" strokeDasharray="5 5" />
      {/* терезелер: ішінде жылы жарық пен отырған адамдардың сұлбасы */}
      {[[160, 336], [464, 640]].map(([a, b]) => (
        <g key={a}>
          <rect x={a} y="200" width={b - a} height="150" rx="6" fill={C.wood2} />
          <rect x={a + 8} y="208" width={b - a - 16} height="134" rx="3" fill="#F6D9A0" />
          <path d={`M${a + 30} 208v20M${b - 40} 208v24`} stroke={C.thread} strokeWidth="2" />
          <circle cx={a + 30} cy="234" r="7" fill={C.gold2} /><circle cx={b - 40} cy="238" r="7" fill={C.gold2} />
          <g fill="#C99A5E">
            <circle cx={a + 50} cy="282" r="12" /><path d={`M${a + 32} 342q0-42 18-44q18 2 18 44Z`} />
            <circle cx={b - 56} cy="286" r="11" /><path d={`M${b - 74} 342q0-38 18-40q18 2 18 40Z`} />
          </g>
          <rect x={a + 8} y="312" width={b - a - 16} height="30" fill="#E7C08A" />
          <path d={`M${(a + b) / 2} 208v134`} stroke={C.wood2} strokeWidth="6" />
          <path d={`M${a + 14} 216l40 -0M${a + 14} 222l26 0`} stroke="#fff" strokeWidth="3" opacity=".5" />
        </g>
      ))}
      {/* есік */}
      <rect x="352" y="196" width="96" height="190" fill={C.wood2} />
      <rect x="360" y="204" width="80" height="182" fill="#F8DFA8" />
      <path d="M360 386L330 450H470L440 386Z" fill="#F4D9A0" opacity=".55" />
      <g transform="translate(360 204)">
        <g className="lf-mv" style={{ transform: open ? "scaleX(0.16) skewY(-10deg)" : "none" }}>
          <rect width="80" height="182" fill={C.wood} />
          <rect x="10" y="10" width="60" height="108" rx="3" fill="#BFD9DD" />
          <path d="M18 20l20 0M18 28l12 0" stroke="#fff" strokeWidth="3" opacity=".6" />
          <rect x="10" y="128" width="60" height="44" rx="3" fill="none" stroke={C.wood2} strokeWidth="2" strokeDasharray="4 4" />
          <rect x="62" y="98" width="6" height="26" rx="3" fill={C.gold} />
        </g>
      </g>
      <g className={`cf-bell${open ? " on" : ""}`}><circle cx="452" cy="204" r="6" fill={C.gold} /><path d="M440 196q-6 8 0 16M464 196q6 8 0 16" stroke={C.gold} strokeWidth="2" fill="none" /></g>
      {/* тротуар */}
      <rect x="-40" y="386" width="880" height="110" fill="#CDBFA6" />
      <path d="M-40 386h880" stroke="#B3A386" strokeWidth="4" />
      {[-20, 60, 140, 220, 300, 380, 460, 540, 620, 700, 780].map((x) => <path key={x} d={`M${x} 390l-26 70`} stroke="#BBAA8C" strokeWidth="2" />)}
      <rect x="330" y="384" width="140" height="10" rx="3" fill="#B9A887" />
      {/* бағаналы шам, тақта, ағаш */}
      <rect x="68" y="190" width="8" height="200" fill="#3A3F4E" /><path d="M56 190h32l-6-22H62Z" fill="#3A3F4E" /><circle cx="72" cy="196" r="6" fill={C.gold2} />
      <g transform="translate(490 330)">
        <path d="M0 60L12 0H52L64 60" fill="none" stroke={C.wood2} strokeWidth="5" />
        <rect x="10" y="4" width="44" height="40" rx="3" fill="#2F3A34" />
        <text x="32" y="20" textAnchor="middle" fontSize="9" fontWeight="700" fill="#F4F1E6">ШАЙ</text>
        <text x="32" y="34" textAnchor="middle" fontSize="9" fontWeight="700" fill={C.gold2}>ПАЛАУ</text>
      </g>
      <g transform="translate(730 390)">
        <rect x="-22" y="-30" width="44" height="30" rx="4" fill={C.red} />
        <rect x="-4" y="-120" width="8" height="92" fill={C.wood2} />
        <circle cx="0" cy="-140" r="44" fill={C.leaf2} /><circle cx="-24" cy="-120" r="28" fill={C.leaf} /><circle cx="22" cy="-158" r="26" fill={C.leaf} />
      </g>
      <Passerby o={P1} y={448} s={0.62} x0={-80} x1={900} d={17} delay={-11} seed={3} />
      <Passerby o={P2} y={458} s={0.66} x0={900} x1={-80} d={21} delay={-3} seed={5} />
    </g>
  );
}

/* ── Кафе іші ── */
const VP = [400, 150];
function Room({ st, talk, mood }) {
  const p = st.p;
  const w = st.a.npc;
  return (
    <g>
      {/* қабырға мен еден (перспектива) */}
      <rect x="-40" y="-40" width="880" height="310" fill="#F1DDB8" />
      {[60, 180, 300, 420, 540, 660, 780].map((x) => <path key={x} d={`M${x} -40V258`} stroke="#E8CFA4" strokeWidth="16" />)}
      <rect x="-40" y="196" width="880" height="66" fill={C.wood3} />
      <path d="M-40 196h880" stroke={C.wood2} strokeWidth="5" />
      <path d="M-40 262H840V500H-40Z" fill="#B98A57" />
      {[-400, -260, -130, 0, 130, 260, 400, 540, 670, 800, 930, 1060, 1200].map((x) => <path key={x} d={`M${VP[0] + (x - VP[0]) * 0.33} 262L${x} 500`} stroke="#A6784A" strokeWidth="2" />)}
      {[290, 330, 390].map((y) => <path key={y} d={`M-40 ${y}H840`} stroke="#A6784A" strokeWidth="1.4" opacity=".6" />)}
      {/* сурет: Алатау; домбыра; сағат */}
      <Box x={84} y={52} w={120} h={80} r={4} c={C.wood2} st={null} />
      <rect x="92" y="60" width="104" height="64" fill="#CFE6EC" />
      <path d="M92 124l30-40 18 20 24-34 32 54Z" fill="#7FA3B4" /><path d="M146 70l-8 10h16Z" fill="#fff" />
      <g transform="translate(470 40) rotate(18)">
        <ellipse cx="0" cy="96" rx="20" ry="28" fill={C.wood} /><rect x="-4" y="0" width="8" height="78" fill={C.wood2} /><circle cx="0" cy="92" r="5" fill={C.thread} />
        <path d="M-2 4v110M2 4v110" stroke={C.goldS} strokeWidth="0.8" />
      </g>
      <g transform="translate(560 70)">
        <circle r="26" fill={C.surf} stroke={C.wood2} strokeWidth="5" />
        {[0, 90, 180, 270].map((a) => <path key={a} transform={`rotate(${a})`} d="M0 -20v5" stroke={C.ink} strokeWidth="2.4" />)}
        <path d="M0 0L-7 -10" stroke={C.ink} strokeWidth="3.4" strokeLinecap="round" />
        <g className="cf-min" style={{ transform: `rotate(${p.clock ? 90 : 0}deg)` }}><path d="M0 0V-18" stroke={C.red} strokeWidth="2.6" strokeLinecap="round" /></g>
        <circle r="2.6" fill={C.ink} />
      </g>
      {/* бар: самауыр, шәйнектер */}
      <rect x="-40" y="112" width="330" height="8" fill={C.wood2} />
      {[20, 70, 120, 170, 220].map((x, i) => <Item key={x} k="cup" x={x} y={104} s={0.7} />)}
      <g transform="translate(250 166)">
        <ellipse cx="0" cy="22" rx="26" ry="6" fill={C.wood2} />
        <path d="M-18 20Q-26 -10-14 -24H14Q26 -10 18 20Z" fill="#C9A24A" />
        <rect x="-10" y="-34" width="20" height="12" rx="3" fill="#B38A36" /><circle cx="0" cy="-38" r="5" fill="#B38A36" />
        <path d="M18 0h12v6" stroke="#B38A36" strokeWidth="4" fill="none" />
        <g className="cf-steam"><path d="M-4 -46q-6 -10 2 -18t0 -18M6 -48q-5 -9 2 -16" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".7" /></g>
      </g>
      <rect x="-40" y="190" width="330" height="80" fill={C.wood2} />
      <rect x="-40" y="184" width="336" height="12" rx="3" fill={C.wood} />
      <path d="M-30 206H280V258H-30Z" fill="none" stroke={ST} strokeWidth="1.5" strokeDasharray="5 5" />
      <Horn x={120} y={232} s={0.9} c={C.gold} />
      {/* ас үй есігі */}
      <rect x="604" y="112" width="86" height="152" fill={C.wood2} />
      <rect x="610" y="118" width="74" height="146" fill="#6B3F1E" />
      <g transform="translate(610 118)">
        <g className="lf-mv" style={{ transform: p.kdoor ? "scaleX(0.2) skewY(8deg)" : "none" }}>
          <rect width="74" height="146" fill={C.wood} />
          <circle cx="37" cy="44" r="16" fill="#F6D9A0" stroke={C.wood2} strokeWidth="4" />
          <rect x="10" y="80" width="54" height="54" rx="3" fill="none" stroke={C.wood2} strokeWidth="2" strokeDasharray="4 4" />
        </g>
      </g>
      {/* аспалы шамдар */}
      {[200, 400, 600].map((x, i) => (
        <g key={x}>
          <path d={`M${x} -40V${70 + i % 2 * 10}`} stroke={C.thread} strokeWidth="2" />
          <path d={`M${x - 24} ${92 + i % 2 * 10}Q${x} ${58 + i % 2 * 10} ${x + 24} ${92 + i % 2 * 10}Z`} fill={i === 1 ? C.red : C.gold} />
          <ellipse cx={x} cy={93 + i % 2 * 10} rx="9" ry="4" fill="#FFF3C8" />
          <Cone x={x} y={94 + i % 2 * 10} w={200} h={220} top={22} />
        </g>
      ))}
      {/* фондағы үстелдер мен адамдар */}
      <g className="cf-ta"><Actor a={{ x: 168, y: 340, s: 0.6 }}><Person o={G1} pose="sit" look={0.7} hold="cup" seed={2} /></Actor></g>
      <g className="cf-tb"><Actor a={{ x: 278, y: 340, s: 0.6, face: -1 }}><Person o={G2} pose="sit" look={0.7} seed={7} /></Actor></g>
      <Table x={222} y={318} w={150} c="#F7EFDD" />
      <Item k="teapot" x={222} y={300} s={0.55} />
      <g className="cf-sip"><Actor a={{ x: 500, y: 314, s: 0.5 }}><Person o={G3} pose="sit" hold="cup" seed={4} /></Actor></g>
      <Table x={500} y={298} w={110} c="#F7EFDD" />
      <Pool x={222} y={350} rx={110} ry={12} op={0.25} />
      {/* даяшы */}
      <Actor a={w} dur={w?.dur}>
        <Person o={WAITER} pose={w?.pose} talk={talk} mood={mood} look={w?.look || 0} head={w?.head} hold={w?.hold} holdL={w?.holdL} seed={1} />
      </Actor>
      {/* біздің үстел: отырғанда төменнен көтеріледі */}
      <g className="lf-mv" style={{ transform: p.table ? "none" : "translate(400px, 520px) scale(1.5) translate(-400px, -440px)" }}>
        <path d="M60 404Q400 372 740 404L790 470H10Z" fill="#FFFDF7" />
        <path d="M10 470L60 404Q400 372 740 404L790 470" fill="none" stroke={C.red} strokeWidth="10" />
        <path d="M70 414Q400 384 730 414" fill="none" stroke={C.gold} strokeWidth="1.6" strokeDasharray="6 6" />
        <Horn x={120} y={440} s={1} c={C.red} /><Horn x={680} y={440} s={1} c={C.red} />
        <Shadow x={400} y={436} rx={60} ry={8} op={0.12} />
        <g className={`cf-on${p.menu ? " on" : ""}`}><Item k="menu" x={250} y={420} s={1.15} r={-74} /></g>
        <g className={`cf-on${p.tea ? " on" : ""}`}><Item k="cup" x={480} y={414} s={1.3} /><g className="cf-steam"><path d="M476 388q-6 -8 2 -14t0 -14" stroke="#fff" strokeWidth="3" fill="none" opacity=".8" /></g></g>
        <g className={`cf-on${p.plov ? " on" : ""}`}><Item k="plov" x={380} y={428} s={1.5} /><g className="cf-steam"><path d="M370 384q-6 -9 2 -16t0 -16M392 386q-5 -8 2 -14" stroke="#fff" strokeWidth="3" fill="none" opacity=".8" /></g></g>
        <g className={`cf-on${p.bill ? " on" : ""}`}><Item k="bill" x={560} y={430} s={1.1} r={-70} /></g>
      </g>
      {p.paid && <g className="cf-paid"><circle cx="604" cy="300" r="20" fill="#2F8F5B" /><path d="M594 300l7 7 13-14" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" /></g>}
    </g>
  );
}

function Table({ x, y, w, c }) {
  return (
    <g>
      <rect x={x - 4} y={y + 6} width="8" height="40" fill={C.wood2} />
      <ellipse cx={x} cy={y} rx={w / 2} ry={w / 9} fill={c} />
      <path d={`M${x - w / 2} ${y}q0 ${w / 9 + 6} ${w / 2} ${w / 9 + 6}t${w / 2} ${-w / 9 - 6}`} fill="none" stroke={C.red} strokeWidth="4" />
    </g>
  );
}

function Stage({ st, talk, mood }) {
  return (
    <>
      <g className={`lf-set${st.set === "out" ? "" : " off"}`}><Street st={st} /></g>
      <g className={`lf-set${st.set === "in" ? "" : " off"}`}><Room st={st} talk={talk} mood={mood} /></g>
    </>
  );
}

// Даяшының ас үйге барып, бір нәрсе алып қайтуы
const fetchFrom = (where, item, wait = 700, extra = []) => [
  { ms: 300, a: { npc: { pose: "stand", hold: null, holdL: null, head: null } } },
  ...walkTo("npc", "mid", 900, "walk"),
  ...walkTo("npc", where, 1000, "stand"),
  { ms: where === "kitchen" ? 160 : 0, p: { kdoor: where === "kitchen" } },
  { ms: wait, a: { npc: where === "kitchen" ? { hide: true } : { pose: "pour", hold: "teapot" } }, ...extra[0] },
  { ms: 200, a: { npc: { hide: false, pose: "stand", hold: item } } },
  ...walkTo("npc", "mid", 1000, "walk"),
  { ms: 0, p: { kdoor: false } },
  ...walkTo("npc", "table", 1000, "stand"),
];

export default {
  spots,
  shots,
  dip: "#FBE3B4",
  init: { set: "out", cam: "wide", p: { door: false, table: false }, a: { npc: { at: "kitchen", pose: "stand", hide: true, hold: "menu" } } },
  intro: [
    beat(900),
    beat(1600, { cam: "door", walk: true }),
    beat(650, { walk: false, p: { door: true } }),
    beat(900, { cam: "through", walk: true }),
    beat(380, { dip: true }),
    beat(60, { set: "in", cam: "entry", camMs: 0 }),
    beat(650, { dip: false }),
    beat(1500, { cam: "aisle", walk: true }),
    beat(900, { walk: false, cam: "seat", camMs: 1000, p: { table: true } }),
    beat(260, { p: { kdoor: true } }),
    beat(200, { a: { npc: { hide: false } } }),
    ...walkTo("npc", "mid", 1200, "walk"),
    beat(0, { p: { kdoor: false } }),
    ...walkTo("npc", "table", 1100, "stand"),
  ],
  acts: {
    talk: [beat(250, { a: { npc: { pose: "stand", head: null, hold: null, holdL: null } } }), say(), free()],
    menu: [beat(420, { a: { npc: { pose: "give", face: -1, hold: "menu", head: null } } }), say(500, { p: { menu: true }, a: { npc: { pose: "give", face: -1, hold: null } } }), beat(500, { a: { npc: { pose: "hands" } } }), free()],
    write: [beat(450, { a: { npc: { pose: "write", hold: "pen", holdL: "pad", head: null } } }), say(1400), free()],
    point: [beat(400, { a: { npc: { pose: "give", face: -1, hold: null, holdL: null, head: "tilt" } } }), say(900), beat(0, { a: { npc: { pose: "write", hold: "pen", holdL: "pad", head: null } } }), free()],
    wait: [beat(500, { a: { npc: { pose: "write", hold: "pen", holdL: "pad", head: null } } }), beat(700, { a: { npc: { pose: "hands", hold: null, holdL: null, head: "nod" } } }), say(), free()],
    serve: [...fetchFrom("kitchen", "tray", 900, [{ p: { clock: true } }]), beat(400, { a: { npc: { pose: "give", face: -1 } } }), say(400, { p: { plov: true }, a: { npc: { hold: null } } }), beat(0, { a: { npc: { pose: "hands", head: "nod" } } }), free()],
    ask: [beat(300, { a: { npc: { pose: "hands", hold: null, holdL: null, head: "tilt" } } }), say(), free()],
    tea: [...fetchFrom("counter", "cup", 1300), beat(400, { a: { npc: { pose: "give", face: -1 } } }), say(300, { p: { tea: true }, a: { npc: { hold: null } } }), beat(0, { a: { npc: { pose: "hands" } } }), free()],
    bill: [...fetchFrom("counter", "bill", 500), beat(380, { a: { npc: { pose: "give", face: -1 } } }), say(300, { p: { bill: true, menu: false }, a: { npc: { hold: null } } }), beat(0, { a: { npc: { pose: "hands" } } }), free()],
    pay: [beat(500, { a: { npc: { pose: "give", face: -1, hold: "terminal", head: null } } }), beat(900, { hand: "card" }), beat(500, { p: { paid: true } }), beat(300, { hand: null, a: { npc: { pose: "wave", hold: null, head: "nod" } } }), say(), free()],
  },
  script: {
    "cafe-order": { n1: "menu", n2: "write", k2: "write", n3: "point", n4: "wait", n5: "serve", n6: "ask", t6: "tea", n7: "bill", fin: "pay" },
  },
  css: `
.cf-on{opacity:0;transform:translateY(-14px);transition:opacity .35s ease,transform .45s cubic-bezier(.3,1.3,.5,1)}
.cf-on.on{opacity:1;transform:none}
.cf-min{transition:transform 1.6s cubic-bezier(.5,0,.3,1)}
.cf-steam{animation:cf-steam 2.6s ease-in-out infinite}
.cf-bell{opacity:0}.cf-bell.on{animation:cf-ring .9s ease-out}
.cf-paid{transform-box:fill-box;transform-origin:50% 50%;animation:vr-stamp .5s ease-out both}
.cf-ta .lf-mouth{opacity:1;animation:lf-talk .27s ease-in-out infinite alternate,cf-chat 9s steps(1) infinite}
.cf-tb .lf-mouth{opacity:1;animation:lf-talk .27s ease-in-out infinite alternate,cf-chat 9s steps(1) -4.5s infinite}
.cf-tb .lf-hd{animation:lf-nod 1.2s ease-in-out 1s infinite}
.cf-sip .lf-ua.r{animation:cf-sipu 8s ease-in-out infinite}
.cf-sip .lf-fa.r{animation:cf-sipf 8s ease-in-out infinite}
.cf-ta .lf-ua.r{animation:cf-sipu 11s ease-in-out -5s infinite}
.cf-ta .lf-fa.r{animation:cf-sipf 11s ease-in-out -5s infinite}
@keyframes cf-steam{0%,100%{opacity:0;transform:translateY(4px)}40%{opacity:.85}80%{opacity:0;transform:translateY(-8px)}}
@keyframes cf-ring{0%{opacity:1;transform:rotate(0)}30%{transform:rotate(14deg)}60%{transform:rotate(-10deg)}100%{opacity:0}}
@keyframes cf-chat{0%{opacity:1}50%{opacity:0}}
@keyframes cf-sipu{0%,55%,85%,100%{transform:rotate(-14deg)}62%,78%{transform:rotate(-4deg)}}
@keyframes cf-sipf{0%,55%,85%,100%{transform:rotate(80deg)}62%,78%{transform:rotate(150deg)}}
`,
  Stage,
};
