// VR өмір: АВТОБУС. Тротуармен аялдамаға келеміз — 12-автобус бізге қарай жүріп кетеді, жолда көліктер ағып жатыр, алыста Алатау.
// Апай орындықта отыр, бізге бұрылады. Түйіндер: бағаналағы «32» тақтайшасы, кесте, апайдың жол картасы, аялдамадағы бағыт сызбасы.
// Соңында 32-автобус алыстан келіп тоқтайды, есігі бүктеліп ашылады, мінеміз, картаны валидаторға тигіземіз, терезеден қала өтеді.
import { C, ST, Box, Cone, Pool, Item, Person, Actor, Passerby, Horn, walkTo, beat, say, free } from "./kit";

const APAI = { f: true, skin: 1, hair: "#8E877E", hs: "scarf", scarf: "#EDE6D6", top: "#6E4B8A", skirt: "#3A3F4E", pants: "#3A3F4E", legs: "#5E5650", glasses: true };
const BOY = { kid: true, skin: 0, hair: "#2B1A12", hs: "cap", cap: C.red, top: "#4E6E8E" };
const P1 = { f: true, skin: 2, hair: "#2B1A12", hs: "long", top: C.teal };
const P2 = { skin: 1, hair: "#1E1A1A", hs: "short", top: "#7A4A21", coat: true, shirt: "#E9D9B8" };
const RIDE1 = { f: true, skin: 0, hair: "#4E2F1B", hs: "bun", top: "#C0602F" };
const RIDE2 = { skin: 2, hair: "#1E1A1A", hs: "short", top: C.green, glasses: true };
const RIDE3 = { f: true, skin: 1, hair: "#2B1A12", hs: "scarf", scarf: C.blue, top: "#9B3B30" };
const VP = [380, 186];
const BUS = "#E9B44C", BUS2 = "#C98A2E";

const spots = { bench: { x: 196, y: 420, s: 0.92 } };
const shots = {
  wide: { x: 400, y: 225, z: 1, a: "m" },
  walk: { x: 360, y: 250, z: 1.06 },
  stop: { x: 320, y: 262, z: 1.15 },
  wait: { x: 400, y: 250, z: 1.04 },
  door: { x: 590, y: 320, z: 2, a: "m" },
  through: { x: 604, y: 330, z: 4.4, a: "m" },
  ins: { x: 400, y: 225, z: 1.06, a: "m" },
  tap: { x: 560, y: 260, z: 1.4, a: "m" },
};

// Автобустың бүйірі: t — алдыңғы жиектен артқа (0..1), v — жоғарыдан төмен (0..1)
const F = (v) => [640, 196 + 244 * v];
const R = (v) => [458, 189 + 73 * v];
const S = (t, v) => { const f = F(v), r = R(v); return [f[0] + (r[0] - f[0]) * t, f[1] + (r[1] - f[1]) * t]; };
const quad = (t0, t1, v0, v1) => { const a = S(t0, v0), b = S(t1, v0), c = S(t1, v1), d = S(t0, v1); return `M${a}L${b}L${c}L${d}Z`; };

function Bus({ n, to, open }) {
  return (
    <g>
      <path d={quad(0, 1, 0, 1)} fill={BUS2} />
      <path d={quad(0, 1, 0, 0.12)} fill={C.surf} />
      {[0.36, 0.86].map((t) => { const [x, y] = S(t, 0.97); return <ellipse key={t} cx={x} cy={y} rx={24 - t * 14} ry={20 - t * 11} fill={C.ink} />; })}
      <path d={quad(0, 1, 0.84, 0.95)} fill="#8A6A2E" />
      {[0.34, 0.5, 0.66, 0.82].map((t) => <path key={t} d={quad(t, t + 0.14, 0.18, 0.5)} fill="#2E3E48" />)}
      {[0.34, 0.5].map((t) => <path key={t} d={quad(t + 0.02, t + 0.06, 0.2, 0.3)} fill="#fff" opacity=".25" />)}
      {/* бүктелетін есік */}
      <path d={quad(0.03, 0.3, 0.16, 0.94)} fill="#1C2129" />
      <g className={`bs-dr${open ? " off" : ""}`}>
        {[0.03, 0.165].map((t) => <g key={t}><path d={quad(t, t + 0.135, 0.16, 0.94)} fill="#B9D3D8" stroke="#5D6675" strokeWidth="2" /><path d={quad(t + 0.01, t + 0.03, 0.22, 0.4)} fill="#fff" opacity=".4" /></g>)}
      </g>
      <g className={`bs-dr${open ? "" : " off"}`}>
        <path d={quad(0.03, 0.06, 0.16, 0.94)} fill="#B9D3D8" stroke="#5D6675" strokeWidth="2" /><path d={quad(0.27, 0.3, 0.16, 0.94)} fill="#B9D3D8" stroke="#5D6675" strokeWidth="2" />
        <path d={quad(0.06, 0.27, 0.8, 0.94)} fill="#5D6675" /><path d={quad(0.06, 0.27, 0.3, 0.78)} fill="#F6E7C6" opacity=".55" />
      </g>
      {/* алды */}
      <rect x="640" y="196" width="262" height="244" rx="14" fill={BUS} />
      <rect x="652" y="202" width="238" height="28" rx="4" fill="#1C2129" />
      <text x="668" y="223" fontSize="18" fontWeight="800" fill="#FFB347">{n}</text>
      <text x="712" y="222" fontSize="13" fontWeight="800" fill="#FFB347">{to}</text>
      <rect x="652" y="236" width="238" height="100" rx="8" fill="#9CC3CC" />
      <path d="M664 246l40 0M664 254l24 0" stroke="#fff" strokeWidth="4" opacity=".6" />
      <circle cx="704" cy="300" r="15" fill="#3B2416" /><path d="M680 336q24 -30 48 0Z" fill={C.blue} />
      <path d="M700 336l60 -60M800 336l40 -40" stroke="#5D6675" strokeWidth="3" />
      <rect x="640" y="344" width="262" height="16" fill={C.surf} />
      {[676, 866].map((x) => <g key={x}><circle cx={x} cy="388" r="15" fill="#FFF3C8" /><circle cx={x} cy="388" r="9" fill="#fff" /></g>)}
      <rect x="730" y="378" width="82" height="22" rx="3" fill={C.surf} stroke="#5D6675" strokeWidth="2" />
      <text x="771" y="394" textAnchor="middle" fontSize="11" fontWeight="800" fill={C.ink}>KZ 032</text>
      <rect x="636" y="412" width="270" height="28" rx="6" fill="#5D6675" />
    </g>
  );
}

const busT = (k) => `translate(${VP[0]}px, ${VP[1]}px) scale(${k}) translate(${-VP[0]}px, ${-VP[1]}px)`;
function Stop({ st, talk, mood }) {
  const p = st.p, a = st.a.npc;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="240" fill="#CFE6EC" />
      {/* Алатау */}
      <path d="M-40 150L60 70L120 110L210 40L300 110L380 60L470 120L560 50L660 120L740 80L840 130V190H-40Z" fill="#9DB8C6" />
      <path d="M190 56L210 40L232 58L220 54L210 62ZM540 66L560 50L582 68L568 64L560 72ZM366 72L380 60L396 74Z" fill="#fff" />
      {/* алыстағы үйлер */}
      <path d="M-40 186V120h60v-30h70v50h50v-20h80v66ZM420 186v-40h50v-24h70v30h60v-50h80v40h60v-16h100v60Z" fill="#B7CCD5" />
      {/* жол мен тротуар */}
      <path d={`M${VP[0]} ${VP[1]}L840 210V450H620Z`} fill="#8A8E92" />
      <path d={`M${VP[0]} ${VP[1]}H840V210Z`} fill="#CDBFA6" />
      <path d={`M-40 ${VP[1]}H${VP[0]}L620 450H-40Z`} fill="#D6C9AE" />
      <path d={`M${VP[0]} ${VP[1]}L620 450`} stroke="#E9E4D8" strokeWidth="7" />
      {[0.12, 0.26, 0.44, 0.68].map((u) => { const x0 = VP[0] + 460 * u, y0 = VP[1] + 154 * u; return <path key={u} d={`M${x0} ${y0}L${x0 + 46 * u} ${y0 + 15 * u}`} stroke="#F4F1E6" strokeWidth={2 + 6 * u} />; })}
      {[0.2, 0.4, 0.62, 0.86].map((u) => <path key={u} d={`M${-40} ${VP[1] + 264 * u}L${VP[0] + (620 - VP[0]) * u} ${VP[1] + 264 * u}`} stroke="#C6B897" strokeWidth="1.5" />)}
      {/* ағаштар (тротуар жиегі) */}
      {[0.18, 0.38].map((u) => { const x = VP[0] + (600 - VP[0]) * u, y = VP[1] + 250 * u, s = 0.3 + u * 1.4; return (
        <g key={u} transform={`translate(${x} ${y}) scale(${s})`}><rect x="-5" y="-110" width="10" height="110" fill={C.wood2} /><circle cx="0" cy="-130" r="40" fill={C.leaf2} /><circle cx="-22" cy="-112" r="24" fill={C.leaf} /><circle cx="20" cy="-150" r="22" fill={C.leaf} /></g>); })}
      {/* қарсы жолақ: алыстап бара жатқан көліктер */}
      <g className="bs-far" style={{ animationDelay: "-2s" }}><Car c="#5B87A8" back /></g>
      <g className="bs-far" style={{ animationDelay: "-6.5s" }}><Car c="#E9E4D8" back /></g>
      <g className="bs-near" style={{ animationDelay: "-1s" }}><Car c="#C0602F" /></g>
      <g className="bs-near" style={{ animationDelay: "-4.4s" }}><Car c={C.surf} /></g>
      <Passerby o={P1} y={250} s={0.36} x0={-40} x1={330} d={22} delay={-8} seed={3} />
      <Passerby o={P2} y={262} s={0.4} x0={340} x1={-60} d={26} delay={-15} seed={6} />
      {/* аялдама павильоны */}
      <g>
        <rect x="24" y="124" width="300" height="20" rx="4" fill={C.blue} />
        <path d="M24 144h300" stroke={C.gold} strokeWidth="3" />
        <text x="174" y="139" textAnchor="middle" fontSize="12" fontWeight="800" letterSpacing="2" fill={C.surf}>АЯЛДАМА</text>
        <rect x="34" y="144" width="280" height="226" fill="#CFE3E6" opacity=".55" />
        {[34, 314].map((x) => <rect key={x} x={x - 4} y="144" width="8" height="270" fill="#5D6675" />)}
        {/* бағыт сызбасы */}
        <g transform="translate(206 168)">
          <rect x="0" y="0" width="96" height="120" rx="4" fill={C.surf} />
          <text x="48" y="16" textAnchor="middle" fontSize="11" fontWeight="800" fill={C.red}>№ 32</text>
          <path d="M18 28V108" stroke={C.red} strokeWidth="3" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <circle key={i} cx="18" cy={28 + i * 11.4} r={i === 0 || i === 7 ? 4.4 : 3} fill={i === 0 ? C.blue : C.surf} stroke={C.red} strokeWidth="2" className={p.map && i > 0 ? "bs-dot" : ""} style={{ animationDelay: `${i * 0.18}s` }} />)}
          <path d="M28 30h40M28 109h44" stroke="#9AA3B0" strokeWidth="2" />
          <g className={`bs-goal${p.map ? " on" : ""}`}><rect x="26" y="100" width="66" height="16" rx="3" fill={C.gold2} /><text x="59" y="112" textAnchor="middle" fontSize="8.5" fontWeight="800" fill={C.ink}>КӨК БАЗАР</text></g>
        </g>
        {/* жарнама тақтасы */}
        <g transform="translate(46 168)"><rect width="140" height="88" rx="4" fill={C.deep} /><Horn x={34} y={44} s={1} c={C.gold2} /><text x="94" y="40" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.cream}>ТІЛ</text><text x="94" y="58" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.gold2}>ҮЙРЕН</text></g>
        <rect x="40" y="356" width="270" height="12" rx="4" fill={C.wood} /><path d="M56 368v40M294 368v40" stroke="#5D6675" strokeWidth="6" />
      </g>
      {/* бала мен апай */}
      <g className="bs-boy"><Actor a={{ x: 300, y: 436, s: 0.8 }}><Person o={BOY} pose="phone" hold="phone" look={-0.3} seed={5} /></Actor></g>
      <Actor a={a} dur={a?.dur}>
        <Person o={APAI} pose={a?.pose} talk={talk} mood={mood} look={a?.look || 0} head={a?.head} hold={a?.hold} holdL={a?.holdL} seat={!!a?.sit} seed={2} />
      </Actor>
      {/* бағана: маршрут нөмірлері, кесте */}
      <g transform="translate(8 444)">
        <rect x="-4" y="-300" width="8" height="300" fill="#5D6675" />
        {[["32", C.red], ["12", C.blue], ["45", C.green]].map(([n, c], i) => (
          <g key={n} className={n === "32" && p.sign ? "bs-pulse" : ""}><rect x="-26" y={-296 + i * 30} width="52" height="26" rx="4" fill={c} /><text x="0" y={-277 + i * 30} textAnchor="middle" fontSize="16" fontWeight="800" fill={C.surf}>{n}</text></g>
        ))}
        <g className={p.tt ? "bs-pulse" : ""}><rect x="-30" y="-196" width="60" height="44" rx="3" fill={C.surf} stroke="#5D6675" strokeWidth="2" />
          <text x="0" y="-180" textAnchor="middle" fontSize="9" fontWeight="800" fill={C.ink}>06:00–23:00</text><text x="0" y="-164" textAnchor="middle" fontSize="10" fontWeight="800" fill={C.red}>10 мин</text></g>
      </g>
      {/* автобустар */}
      <g className="lf-mv" style={{ transform: busT(p.b12 === "go" ? 2.6 : 1), opacity: p.b12 === "gone" ? 0 : 1, transitionDuration: "2.2s", transitionTimingFunction: "cubic-bezier(.55,0,.9,.6)" }}>
        {p.b12 !== "gone" && <Bus n="12" to="ОРТАЛЫҚ" />}
      </g>
      <g className="lf-mv" style={{ transform: busT(p.b32 ? 1 : 0.04), opacity: p.b32 ? 1 : 0, transitionDuration: "3s", transitionTimingFunction: "cubic-bezier(.2,.6,.3,1)" }}>
        <Bus n="32" to="КӨК БАЗАР" open={p.open} />
      </g>
    </g>
  );
}

function Car({ c, back }) {
  return (
    <g>
      <path d="M-46 -40Q-40 -66-24 -68H24Q40 -66 46 -40Z" fill={c} /><path d="M-36 -42Q-32 -60-20 -61H20Q32 -60 36 -42Z" fill={back ? "#3E4E58" : "#9CC3CC"} />
      <rect x="-54" y="-42" width="108" height="34" rx="8" fill={c} />
      {[-38, 38].map((x) => <rect key={x} x={x - 9} y="-34" width="18" height="9" rx="3" fill={back ? "#D93A2E" : "#FFF3C8"} />)}
      <rect x="-50" y="-10" width="18" height="12" rx="3" fill={C.ink} /><rect x="32" y="-10" width="18" height="12" rx="3" fill={C.ink} />
    </g>
  );
}

/* ── Автобус іші ── */
function Inside({ st }) {
  const p = st.p;
  const V = [400, 170];
  return (
    <g>
      {/* терезедегі қала (екі жақта қарама-қарсы ағады) */}
      <rect x="-40" y="-40" width="880" height="540" fill="#CFE6EC" />
      <g className="bs-cityL">{Array.from({ length: 12 }, (_, i) => <rect key={i} x={-40 + i * 120} y={150 - (i % 3) * 40} width="96" height="300" fill={["#E2C49A", "#B7CCD5", "#E9D3B0"][i % 3]} />)}
        {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={10 + i * 120} cy={250} r="34" fill={C.leaf} />)}</g>
      <g className="bs-cityR">{Array.from({ length: 12 }, (_, i) => <rect key={i} x={-840 + i * 140} y={140 - (i % 2) * 50} width="110" height="320" fill={["#E9D3B0", "#C9B48A", "#B7CCD5"][i % 3]} />)}
        {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={-790 + i * 140} cy={260} r="30" fill={C.leaf2} />)}</g>
      {/* қабырғалар (терезе ойықтарымен) */}
      <path fillRule="evenodd" fill="#E8E2D4" d="M-40 -40H840V500H-40Z M-20 90L270 140L270 228L-20 250Z M530 140L820 90L820 250L530 228Z M310 110H490V196H310Z" />
      <path d="M-20 250L270 228M530 228L820 250M-20 90L270 140M530 140L820 90" stroke="#C9C2B2" strokeWidth="4" />
      {/* алдыңғы әйнек: жол */}
      <rect x="310" y="110" width="180" height="86" fill="#8A8E92" /><rect x="310" y="110" width="180" height="40" fill="#CFE6EC" />
      <path d="M396 150L404 150L440 196H360Z" fill="#9DA1A5" />
      <g className="bs-dash"><path d="M398 152h4l6 40h-16Z" fill="#F4F1E6" /></g>
      <rect x="306" y="106" width="188" height="94" fill="none" stroke="#5D6675" strokeWidth="6" />
      {/* жүргізуші кабинасы */}
      <path d="M300 200H400V250H300Z" fill="#B8B1A2" /><circle cx="340" cy="172" r="15" fill="#2B1A12" /><path d="M318 200q22 -20 44 0Z" fill={C.blue} />
      <rect x="294" y="196" width="112" height="8" fill="#5D6675" />
      {/* жүгірме жол */}
      <rect x="320" y="78" width="160" height="22" rx="3" fill="#1C2129" />
      <g className="bs-led"><text x="400" y="94" textAnchor="middle" fontSize="11" fontWeight="800" fill="#FFB347">КЕЛЕСІ: ЖІБЕК ЖОЛЫ</text></g>
      {/* еден, тұтқалар */}
      <path d={`M-40 500L${V[0] - 60} ${V[1] + 60}H${V[0] + 60}L840 500Z`} fill="#6F7378" />
      <path d={`M${V[0] - 40} ${V[1] + 60}L120 500M${V[0] + 40} ${V[1] + 60}L680 500`} stroke={C.gold} strokeWidth="5" />
      <path d="M-40 20L330 96M840 20L470 96" stroke="#A9B0B6" strokeWidth="6" />
      {[[120, 46], [690, 46], [260, 82]].map(([x, y]) => <g key={x}><path d={`M${x} ${y}v40`} stroke="#A9B0B6" strokeWidth="3" /><circle cx={x} cy={y + 48} r="9" fill="none" stroke={C.gold} strokeWidth="4" /></g>)}
      {/* жолаушылар */}
      <g className="bs-sway"><Actor a={{ x: 590, y: 330, s: 0.62 }}><Person o={RIDE2} pose="reach" look={-0.3} seed={7} /></Actor></g>
      <rect x="200" y="300" width="70" height="16" rx="4" fill={C.blue} /><rect x="200" y="250" width="12" height="60" rx="3" fill={C.blue2} />
      <Actor a={{ x: 236, y: 334, s: 0.58 }}><Person o={RIDE3} pose="sit" look={0.5} seed={4} /></Actor>
      <g className="bs-read"><Actor a={{ x: 104, y: 470, s: 0.92 }}><Person o={RIDE1} pose="phone" hold="phone" seat look={0.4} seed={9} /></Actor></g>
      <rect x="20" y="430" width="170" height="26" rx="6" fill={C.blue} />
      {/* валидатор */}
      <g transform="translate(560 300)">
        <rect x="-4" y="-300" width="8" height="500" fill="#A9B0B6" />
        <rect x="-34" y="-40" width="68" height="92" rx="8" fill={BUS} />
        <rect x="-24" y="-30" width="48" height="30" rx="3" fill={p.tap ? "#2F8F5B" : "#1C2129"} style={{ transition: "fill .25s" }} />
        <text x="0" y="-10" textAnchor="middle" fontSize="11" fontWeight="800" fill={p.tap ? "#fff" : "#7BE0A0"}>{p.tap ? "200 ₸ ✓" : "КАРТА"}</text>
        <rect x="-18" y="10" width="36" height="30" rx="5" fill="#C98A2E" /><path d="M-8 20q8 -6 16 0M-4 26q4 -3 8 0" stroke={C.surf} strokeWidth="2" fill="none" />
      </g>
    </g>
  );
}

function Stage({ st, talk, mood }) {
  const ride = st.set === "in" && st.p.ride;
  return (
    <>
      <g className={`lf-set${st.set === "out" ? "" : " off"}`}><Stop st={st} talk={talk} mood={mood} /></g>
      <g className={`lf-set${st.set === "in" ? "" : " off"}${ride ? " bs-go" : " bs-hold"}`}><Inside st={st} /></g>
    </>
  );
}

const A = (patch) => ({ a: { npc: patch } });
const sitI = (extra = {}) => A({ pose: "hands", sit: true, head: null, hold: null, look: 0, ...extra });

export default {
  spots,
  shots,
  dip: "#CFE6EC",
  init: { set: "out", cam: "wide", p: { b12: "stop" }, a: { npc: { at: "bench", pose: "hands", sit: true, look: 0.8 } } },
  intro: [
    beat(800),
    beat(400, { p: { b12: "go" } }),
    beat(1800, { cam: "walk", walk: true }),
    beat(400, { p: { b12: "gone" } }),
    beat(1300, { cam: "stop", camMs: 1300, walk: true }),
    beat(500, { walk: false }),
    beat(700, A({ look: 0.3, head: "up" })),
    beat(300, sitI({ look: 0 })),
  ],
  acts: {
    talk: [beat(250, sitI()), say(), free()],
    hello: [beat(300, sitI({ head: "tilt" })), say(), free()],
    sign: [beat(400, { p: { sign: true }, ...A({ pose: "point", face: -1, sit: true, head: null, look: -0.6 }) }), say(1400), beat(0, sitI()), free()],
    again: [beat(300, { p: { sign: false } }), beat(200, { p: { sign: true }, ...A({ pose: "point", face: -1, sit: true, head: "nod", look: -0.6 }) }), say(1600), beat(0, sitI()), free()],
    often: [beat(300, { p: { sign: false, tt: true }, ...A({ pose: "point", face: -1, sit: true, head: null, look: -0.6 }) }), say(1000), beat(0, sitI({ head: "nod" })), free()],
    card: [beat(300, { p: { tt: false } }), beat(500, A({ pose: "give", sit: true, hold: "card", head: null, look: 0 })), say(1600), beat(0, sitI()), free()],
    map: [beat(300, A({ pose: "reach", sit: true, hold: null, head: null, look: -0.3 })), say(300, { p: { map: true } }), beat(1500, sitI()), free()],
    bye: [
      beat(300, { cam: "wait", camMs: 1200, p: { b32: true, map: false } }),
      beat(400, A({ pose: "point", face: 1, sit: true, look: 0.7, head: null })), say(2600),
      beat(500, A({ pose: "wave", sit: false, look: 0, head: "nod" })), free(),
      beat(1600, { cam: "door", camMs: 1400, walk: true }),
      beat(800, { walk: false, p: { open: true } }),
      beat(900, { cam: "through", walk: true }),
      beat(380, { dip: true }),
      beat(60, { set: "in", cam: "ins", camMs: 0, walk: false }),
      beat(700, { dip: false }),
      beat(700, { cam: "tap", camMs: 700 }),
      beat(800, { hand: "card" }), beat(600, { p: { tap: true } }), beat(400, { hand: null }),
      beat(0, { cam: "ins", camMs: 1200, p: { ride: true } }),
    ],
  },
  script: {
    "bus-route": { n1: "hello", n2: "sign", r2: "again", n3: "often", n4: "card", n5: "map", fin: "bye" },
  },
  css: `
.bs-near{transform-box:view-box;transform-origin:0 0;animation:bs-near 6.6s ease-in infinite}
.bs-far{transform-box:view-box;transform-origin:0 0;animation:bs-far 9s ease-out infinite}
@keyframes bs-near{0%{transform:translate(380px,186px) scale(.04);opacity:0}8%{opacity:1}100%{transform:translate(860px,560px) scale(1.7)}}
@keyframes bs-far{0%{transform:translate(900px,330px) scale(1.1)}88%{opacity:1}100%{transform:translate(384px,187px) scale(.04);opacity:0}}
.bs-dr{transition:opacity .45s ease}.bs-dr.off{opacity:0}
.bs-pulse{transform-box:fill-box;transform-origin:50% 50%;animation:bs-pulse .7s ease-in-out 3}
@keyframes bs-pulse{50%{transform:scale(1.18)}}
.bs-dot{animation:bs-dot .5s ease-out both}@keyframes bs-dot{0%{fill:#FFFDF7}100%{fill:#F2C14E}}
.bs-goal{opacity:.0;transition:opacity .5s .9s}.bs-goal.on{opacity:1}
.bs-boy .lf-hd{animation:bs-peek 8s ease-in-out infinite}
@keyframes bs-peek{0%,60%,100%{transform:rotate(0)}68%,88%{transform:rotate(8deg)}}
.bs-cityL{animation:bs-left 7s linear infinite}.bs-cityR{animation:bs-right 7s linear infinite}
.bs-dash{transform-box:view-box;transform-origin:400px 150px;animation:bs-road 1.2s linear infinite}
.bs-led{animation:bs-led 2.4s steps(1) infinite}
.bs-sway{animation:bs-sway 3.2s ease-in-out infinite}
.bs-hold :is(.bs-cityL,.bs-cityR,.bs-dash,.bs-sway){animation-play-state:paused}
@keyframes bs-left{from{transform:translateX(0)}to{transform:translateX(-360px)}}
@keyframes bs-right{from{transform:translateX(0)}to{transform:translateX(420px)}}
@keyframes bs-road{0%{transform:scale(.2);opacity:0}20%{opacity:1}100%{transform:scale(1.4);opacity:1}}
@keyframes bs-led{0%,70%{opacity:1}85%{opacity:.35}}
@keyframes bs-sway{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}
`,
  Stage,
};
