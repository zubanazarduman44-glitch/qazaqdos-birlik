// VR өмір: «ЕСІЛ» ҚОНАҚ ҮЙІ. Кешкі көше, жарық терезелер → шыны есік → вестибюль (шамшырақ, кілт шкафы, лифт, газет оқып отырған қонақ)
// → ресепшн қоңырауын соғамыз, Ерлан кеңседен шығады. Әр түйін: куәлікті тексеру, кілт-карта 408, бір сағаттан кейін (сағат жылжиды)
// телефонмен сөйлесу, шеберді шақыру (шебер құралымен лифтке барады), шебердің басын шайқауы, люкс, менеджермен келісу, жаңа алтын кілт.
import { C, ST, Box, Cone, Pool, Shadow, Item, Person, Actor, Passerby, Horn, walkTo, beat, say, free } from "./kit";

const CLERK = { skin: 0, hair: "#2B1A12", hs: "short", top: C.navy, coat: true, shirt: C.surf, tie: C.red, badge: C.gold };
const TECH = { skin: 2, hair: "#1E1A1A", hs: "cap", cap: C.blue, top: C.blue, pants: C.blue2, tache: true };
const G1 = { skin: 1, hair: "#3B2416", hs: "short", top: "#5B87A8", glasses: true };
const P1 = { f: true, skin: 0, hair: "#4E2F1B", hs: "long", top: "#9B3B30" };
const P2 = { skin: 2, hair: "#1E1A1A", hs: "short", top: C.green };

const spots = {
  office: { x: 700, y: 330, s: 0.8 },
  desk: { x: 520, y: 384, s: 0.96 },
  lift: { x: 118, y: 300, s: 0.56 },
  mid: { x: 300, y: 318, s: 0.62 },
  tside: { x: 712, y: 340, s: 0.74 },
};
const shots = {
  wide: { x: 400, y: 236, z: 1, a: "m" },
  door: { x: 400, y: 286, z: 1.8, a: "m" },
  through: { x: 400, y: 304, z: 4.2, a: "m" },
  entry: { x: 400, y: 206, z: 1.1, a: "m" },
  walk: { x: 420, y: 232, z: 1.06 },
  front: { x: 420, y: 232, z: 1.03 },
};

const Star = ({ x, y, r = 6, c = C.gold2 }) => <path transform={`translate(${x} ${y})`} d={`M0 ${-r}L${r * 0.3} ${-r * 0.3}L${r} ${-r * 0.3}L${r * 0.45} ${r * 0.15}L${r * 0.62} ${r}L0 ${r * 0.5}L${-r * 0.62} ${r}L${-r * 0.45} ${r * 0.15}L${-r} ${-r * 0.3}L${-r * 0.3} ${-r * 0.3}Z`} fill={c} />;
const KeyCard = ({ gold, n }) => (
  <g>
    <rect x="-18" y="-12" width="36" height="24" rx="3" fill={gold ? C.gold2 : C.surf} stroke={gold ? "#B48A2E" : "#CFC6B2"} strokeWidth="1.5" />
    <path d="M-12 -4h12" stroke={gold ? C.deep : C.blue} strokeWidth="3" />
    <text x="0" y="8" textAnchor="middle" fontSize="8" fontWeight="800" fill={gold ? C.deep : C.ink}>{n}</text>
  </g>
);
const HAND = { give: [116, -132], carry: [22, -134], walk: [22, -134], walkz: [22, -134], stand: [63, -104] };
function Held({ w }) {
  const k = w?.hold, at = HAND[w?.pose];
  if (!k || !String(k).startsWith("ht-") || !at) return null;
  return (
    <g className="ht-held" style={{ transform: `translate(${at[0]}px, ${at[1]}px)` }}>
      {k === "ht-key" && <KeyCard n="408" />}
      {k === "ht-key2" && <KeyCard gold n="ЛЮКС" />}
      {k === "ht-box" && <g transform="translate(0 20)"><rect x="-30" y="-6" width="60" height="34" rx="4" fill={C.red} /><path d="M-14 -6v-10h28v10" fill="none" stroke={C.ink} strokeWidth="4" /><path d="M-30 6H30" stroke="rgba(0,0,0,.2)" strokeWidth="4" /></g>}
    </g>
  );
}

/* ── Кешкі көше ── */
function Street({ st }) {
  const open = st.p.door;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="320" fill="#F2C9A0" />
      <rect x="-40" y="-40" width="880" height="110" fill="#C9A3B8" />
      <rect x="-40" y="70" width="880" height="60" fill="#E6B3A4" />
      <circle cx="700" cy="40" r="5" fill="#FFF3C8" /><circle cx="120" cy="20" r="3" fill="#FFF3C8" /><circle cx="560" cy="10" r="3" fill="#FFF3C8" />
      <path d="M-40 200h60v-90h70v120h30V260H-40ZM690 260V100h60v40h90v120Z" fill="#8E7D93" />
      {[0, 30].map((dx) => <rect key={dx} x={-10 + dx} y="130" width="14" height="14" fill="#FFE7A8" opacity=".8" />)}
      <rect x="140" y="20" width="520" height="370" fill="#D9C3A0" />
      <rect x="130" y="12" width="540" height="16" fill={C.wood2} />
      {/* терезелер: кейбірі жарық */}
      {[50, 110].map((y, r) => [170, 250, 330, 470, 550, 630].map((x, i) => (
        <g key={`${x}${y}`}><rect x={x - 22} y={y} width="44" height="44" rx="3" fill={(i + r) % 3 ? "#FFE7A8" : "#6E6A7A"} />
          <path d={`M${x} ${y}v44M${x - 22} ${y + 22}h44`} stroke="#B9A07A" strokeWidth="3" /><g className={(i + r) % 4 === 1 ? "ht-win" : undefined}><rect x={x - 20} y={y + 2} width="18" height="18" fill="#FFF3C8" opacity=".6" /></g></g>
      )))}
      <Box x={250} y={176} w={300} h={56} r={8} c={C.navy} sh="rgba(20,20,40,.35)" />
      <text x="400" y="214" textAnchor="middle" fontSize="30" fontWeight="700" letterSpacing="8" fill={C.gold2} style={{ fontFamily: "var(--head)" }}>ЕСІЛ</text>
      {[0, 1, 2, 3].map((i) => <Star key={i} x={364 + i * 24} y={246} r={7} />)}
      <text x="400" y="272" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="4" fill={C.navy}>ҚОНАҚ ҮЙІ</text>
      {/* шатыр мен есік */}
      <path d="M300 282H500L520 300H280Z" fill={C.deep} />
      <rect x="340" y="300" width="120" height="90" fill={C.wood2} />
      <rect x="348" y="306" width="104" height="84" fill="#FBE3B4" />
      <Cone x={400} y={300} w={150} h={90} top={30} op={0.3} />
      {[-1, 1].map((d) => (
        <g key={d} transform={`translate(${d < 0 ? 348 : 452} 306)`}><g className="lf-mv" style={{ transform: open ? `scaleX(0.16) skewY(${d * -10}deg)` : "none" }}>
          <rect x={d < 0 ? 0 : -52} width="52" height="84" fill="#BFD9DD" opacity=".85" stroke={C.gold} strokeWidth="3" />
          <rect x={d < 0 ? 42 : -46} y="34" width="4" height="20" rx="2" fill={C.gold} />
        </g></g>
      ))}
      {[310, 490].map((x) => <g key={x}><rect x={x - 14} y="350" width="28" height="40" rx="3" fill={C.wood} /><circle cx={x} cy="334" r="20" fill={C.leaf2} /><circle cx={x - 8} cy="324" r="12" fill={C.leaf} /></g>)}
      {[210, 590].map((x) => <g key={x}><rect x={x - 3} y="300" width="6" height="90" fill="#3A3F4E" /><circle cx={x} cy="296" r="9" fill="#FFE7A8" /><Pool x={x} y={392} rx={40} ry={6} op={0.4} /></g>)}
      <rect x="-40" y="388" width="880" height="110" fill="#B9A98C" />
      <path d="M-40 388h880" stroke="#A39274" strokeWidth="4" />
      <path d="M330 388h140l20 40H310Z" fill={C.deep} opacity=".85" />
      {[-20, 70, 160, 250, 540, 630, 720, 810].map((x) => <path key={x} d={`M${x} 392l-26 70`} stroke="#A99877" strokeWidth="2" />)}
      <Passerby o={P1} y={452} s={0.64} x0={-80} x1={900} d={20} delay={-8} seed={3} />
      <Passerby o={P2} y={460} s={0.66} x0={900} x1={-80} d={24} delay={-17} seed={5} />
    </g>
  );
}

/* ── Вестибюль ── */
function Lobby({ st, talk, mood }) {
  const p = st.p, w = st.a.npc, t = st.a.tech;
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="310" fill="#E9D3B0" />
      {[20, 120, 220, 320, 420, 520, 620, 720, 820].map((x) => <rect key={x} x={x - 40} y="-40" width="80" height="302" fill="none" stroke="#DCC29A" strokeWidth="3" />)}
      {/* лифт */}
      <rect x="60" y="120" width="116" height="152" fill="#B8C6C8" />
      <g className="lf-mv" style={{ transform: p.lift ? "translateX(-26px)" : "none" }}><rect x="66" y="126" width="52" height="146" fill="#DCE3E4" /></g>
      <g className="lf-mv" style={{ transform: p.lift ? "translateX(26px)" : "none" }}><rect x="118" y="126" width="52" height="146" fill="#CFD8D9" /></g>
      <rect x="92" y="100" width="44" height="16" rx="3" fill={C.ink} /><text x="114" y="112" textAnchor="middle" fontSize="10" fontWeight="800" fill={C.gold2}>{p.lift ? "▲4" : "1"}</text>
      {/* қабырға сағаты: сағат тілі уақыт өткенде жылжиды */}
      <g transform="translate(724 96)">
        <circle r="30" fill={C.surf} stroke={C.gold} strokeWidth="5" />
        {[0, 90, 180, 270].map((a) => <path key={a} transform={`rotate(${a})`} d="M0 -24v6" stroke={C.ink} strokeWidth="2.4" />)}
        <g className="ht-hand" style={{ transform: `rotate(${210 + (p.h || 0) * 30}deg)` }}><path d="M0 0V-14" stroke={C.ink} strokeWidth="4" strokeLinecap="round" /></g>
        <g className="ht-hand" style={{ transform: `rotate(${(p.h || 0) * 360}deg)` }}><path d="M0 0V-22" stroke={C.red} strokeWidth="2.6" strokeLinecap="round" /></g>
        <circle r="3" fill={C.ink} />
      </g>
      {/* кеңсе есігі */}
      <rect x="650" y="150" width="96" height="124" fill={C.wood2} />
      <rect x="656" y="156" width="84" height="118" fill="#6B3F1E" />
      <g transform="translate(656 156)"><g className="lf-mv" style={{ transform: p.odoor ? "scaleX(0.18) skewY(8deg)" : "none" }}>
        <rect width="84" height="118" fill={C.wood} /><rect x="10" y="10" width="64" height="44" rx="3" fill="none" stroke={C.wood2} strokeWidth="2" strokeDasharray="4 4" /><rect x="72" y="60" width="5" height="18" rx="2" fill={C.gold} />
      </g></g>
      {/* шамшырақ */}
      <g className="ht-chand">
        <path d="M400 -40V30" stroke={C.gold} strokeWidth="3" />
        <path d="M340 44Q400 74 460 44" fill="none" stroke={C.gold} strokeWidth="4" />
        {[340, 370, 400, 430, 460].map((x, i) => <g key={x}><path d={`M${x} ${44 + (i % 2) * 8}v-12`} stroke={C.gold} strokeWidth="3" /><circle cx={x} cy={28 + (i % 2) * 8} r="6" fill="#FFF3C8" /></g>)}
        {[350, 380, 420, 450].map((x, i) => <path key={x} d={`M${x} ${56 + i % 2 * 6}l-3 8h6Z`} fill="#CFE6EC" />)}
      </g>
      <Cone x={400} y={40} w={420} h={240} top={60} op={0.16} />
      {/* еден: тақтайша */}
      <path d="M-40 262H840V500H-40Z" fill="#E4DAC6" />
      {[-300, -150, 0, 150, 300, 450, 600, 750, 900, 1050].map((x) => <path key={x} d={`M${400 + (x - 400) * 0.3} 262L${x} 500`} stroke="#D2C6AE" strokeWidth="2" />)}
      {[290, 330, 390].map((y) => <path key={y} d={`M-40 ${y}H840`} stroke="#D2C6AE" strokeWidth="2" />)}
      <path d="M180 300H620L660 340H140Z" fill={C.deep} opacity=".55" />
      {/* қонақ: креслода газет оқиды */}
      <g transform="translate(250 330)"><rect x="-44" y="-50" width="88" height="54" rx="12" fill={C.green} /><rect x="-52" y="-30" width="18" height="40" rx="8" fill="#26573F" /><rect x="34" y="-30" width="18" height="40" rx="8" fill="#26573F" /></g>
      <g className="ht-read"><Actor a={{ x: 250, y: 324, s: 0.52 }} shadow={false}><Person o={G1} pose="sit" look={0.1} head="down" seed={5} /></Actor>
        <g className="ht-paper"><path d="M222 262h56v34h-56Z" fill="#F4F1E6" stroke="#CFC6B2" /><path d="M228 270h20M228 276h44M228 282h40M252 270h20" stroke="#9AA3B0" strokeWidth="2" /></g></g>
      <g transform="translate(350 320)"><rect x="-16" y="-24" width="32" height="28" rx="4" fill={C.wood} /><circle cx="0" cy="-44" r="24" fill={C.leaf2} /><circle cx="-12" cy="-58" r="14" fill={C.leaf} /><circle cx="12" cy="-54" r="12" fill={C.leaf} /></g>
      {t && !t.hide && t.at !== "tside" && <Actor a={t} dur={t.dur}><Person o={TECH} pose={t.pose} head={t.head} hold={t.hold} look={t.look || 0} seed={6} /><Held w={t} /></Actor>}
      <Passerby o={P1} y={344} s={0.6} x0={880} x1={-80} d={26} delay={-9} seed={3} />
      {/* ресепшн (жақындағанда үлкейеді) */}
      <g className="lf-mv ht-near" style={{ transform: p.near ? "none" : "translate(400px, 200px) scale(0.8) translate(-400px, -200px)" }}>
        {/* кілт шкафы мен жазу */}
        <rect x="414" y="96" width="220" height="150" rx="4" fill={C.wood2} />
        {[0, 1, 2].map((r) => [0, 1, 2, 3, 4, 5].map((c) => (
          <g key={`${r}${c}`}><rect x={422 + c * 35} y={104 + r * 46} width="30" height="40" rx="2" fill="#6B3F1E" />
            {(r * 6 + c) % 4 !== 2 && <g><circle cx={437 + c * 35} cy={112 + r * 46} r="3" fill={C.gold} /><rect x={433 + c * 35} y={115 + r * 46} width="8" height="14" rx="2" fill={C.gold2} /></g>}</g>
        )))}
        <text x="524" y="80" textAnchor="middle" fontSize="22" fontWeight="700" letterSpacing="6" fill={C.navy} style={{ fontFamily: "var(--head)" }}>ЕСІЛ</text>
        {[0, 1, 2, 3].map((i) => <Star key={i} x={488 + i * 24} y={88} r={5} c={C.gold} />)}
        <Actor a={w} dur={w?.dur}>
          <Person o={CLERK} pose={w?.pose} talk={talk} mood={mood} look={w?.look || 0} head={w?.head} hold={w?.hold} seed={2} />
          <Held w={w} />
        </Actor>
        {t && !t.hide && t.at === "tside" && <Actor a={t} dur={t.dur}><Person o={TECH} pose={t.pose} head={t.head} hold={t.hold} look={t.look || 0} seed={6} /><Held w={t} /></Actor>}
        {/* үстел */}
        <path d="M250 334H730L744 470H236Z" fill={C.wood2} />
        <rect x="236" y="318" width="508" height="20" rx="5" fill="#3A2210" />
        <path d="M236 336H744" stroke={C.gold} strokeWidth="3" />
        <path d="M262 352H718V460H252Z" fill="none" stroke={ST} strokeWidth="1.5" strokeDasharray="5 5" />
        <Horn x={490} y={404} s={1.3} c={C.gold} />
        <Pool x={490} y={320} rx={220} ry={8} op={0.22} />
        <g transform="translate(650 284)"><rect x="-34" y="-28" width="68" height="46" rx="4" fill="#5D6675" /><rect x="-5" y="18" width="10" height="16" fill="#5D6675" /></g>
        <g transform="translate(330 300)"><rect x="-22" y="0" width="44" height="18" rx="3" fill={C.surf} /><rect x="-18" y="-22" width="36" height="22" rx="3" fill="#CFC6B2" /><text y="-7" textAnchor="middle" fontSize="9" fontWeight="800" fill={C.navy}>ҚОШ</text></g>
        {/* қоңырау */}
        <g transform="translate(420 318)">
          <ellipse cx="0" cy="-2" rx="18" ry="4" fill="#8B6A2A" />
          <path d="M-14 -4Q-14 -22 0 -22Q14 -22 14 -4Z" fill={C.gold2} /><circle cx="0" cy="-24" r="3" fill={C.gold} />
          <g className={`ht-ding${p.ring ? " on" : ""}`}><path d="M-22 -26q-6 -8 0 -16M22 -26q6 -8 0 -16M-30 -30q-8 -10 0 -22M30 -30q8 -10 0 -22" stroke={C.gold} strokeWidth="2.4" fill="none" strokeLinecap="round" /></g>
        </g>
        <g className={`ht-on${p.id ? " on" : ""}`}><Item k="card" x={470} y={326} s={1} r={-6} /></g>
        <g className={`ht-on${p.key ? " on" : ""}`}><g transform="translate(540 326) rotate(-6) scale(1.2)"><KeyCard n="408" /></g></g>
        <g className={`ht-on${p.key2 ? " on" : ""}`}><g transform="translate(540 326) rotate(-6) scale(1.3)"><KeyCard gold n="ЛЮКС" /></g></g>
        <g className={`ht-on${p.disc ? " on" : ""}`}><g transform="translate(380 330) rotate(4)"><rect x="-26" y="-14" width="52" height="28" rx="3" fill={C.red} /><text y="5" textAnchor="middle" fontSize="13" fontWeight="800" fill={C.surf}>−20%</text></g></g>
      </g>
    </g>
  );
}

function Stage({ st, talk, mood }) {
  return (
    <>
      <g className={`lf-set${st.set === "out" ? "" : " off"}`}><Street st={st} /></g>
      <g className={`lf-set${st.set === "in" ? "" : " off"}`}><Lobby st={st} talk={talk} mood={mood} /></g>
    </>
  );
}

const A = (patch) => ({ a: { npc: patch } });
const T = (patch) => ({ a: { tech: patch } });
// Уақыт өтті: экран сәл қараяды, сағат жылжиды
const later = (h, patch = {}) => [beat(380, { dip: true }), beat(80, { ...patch, p: { h, ...patch.p } }), beat(700, { dip: false })];

export default {
  spots,
  shots,
  dip: "#FBE3B4",
  init: { set: "out", cam: "wide", p: { door: false, near: false, h: 0 }, a: { npc: { at: "office", pose: "stand", hide: true }, tech: { at: "office", pose: "stand", hide: true } } },
  intro: [
    beat(900),
    beat(1500, { cam: "door", walk: true }),
    beat(700, { walk: false, p: { door: true } }),
    beat(900, { cam: "through", walk: true }),
    beat(380, { dip: true }),
    beat(60, { set: "in", cam: "entry", camMs: 0 }),
    beat(800, { dip: false }),
    beat(1700, { cam: "walk", walk: true, p: { near: true } }),
    beat(600, { walk: false, cam: "front", camMs: 800 }),
    beat(900, { p: { ring: true } }),
    beat(300, { p: { ring: false, odoor: true } }),
    beat(200, A({ hide: false })),
    ...walkTo("npc", "desk", 1200, "hands"),
    beat(0, { p: { odoor: false } }),
  ],
  acts: {
    talk: [beat(250, A({ pose: "hands", hold: null, head: null, look: 0 })), say(), free()],
    hi: [beat(400, A({ pose: "hands", head: "nod", look: 0 })), say(), free()],
    id: [beat(400, A({ pose: "give", face: -1, head: null })), beat(600, { hand: "card" }), beat(400, { hand: null, p: { id: true } }),
      beat(500, { p: { id: false }, ...A({ pose: "give", face: -1, hold: "card" }) }), beat(700, A({ pose: "hands", head: "down", look: -0.2 })),
      say(1600, A({ pose: "type", hold: null, look: 0.4 })), beat(0, A({ pose: "hands", head: null, look: 0 })), free()],
    key: [beat(400, A({ pose: "hands", head: "tilt", look: 0 })), say(1200), beat(900, A({ pose: "type", head: null, look: 0.4 })),
      beat(500, A({ pose: "give", face: -1, hold: "ht-key", look: 0 })), beat(400, { p: { key: true, id: true }, ...A({ hold: null }) }), beat(0, A({ pose: "hands" })), free()],
    later: [...later(1, { p: { key: false, id: false }, ...A({ pose: "phone", hold: "phone", head: null, look: 0.4 }) }), beat(900, A({ head: "nod" })), beat(400, A({ pose: "hands", hold: null, head: null, look: 0 })), say(), free()],
    master: [beat(300, A({ pose: "hands", head: "tilt" })), say(500, A({ pose: "phone", hold: "phone", head: null, look: 0.4 })), beat(1600), beat(300, { p: { odoor: true }, ...A({ pose: "hands", hold: null, look: -0.3 }), ...T({ hide: false, hold: "ht-box" }) }),
      free(), ...walkTo("tech", "mid", 1500, "walk", { hold: "ht-box" }), beat(0, { p: { odoor: false, lift: true } }), ...walkTo("tech", "lift", 1300, "stand", { hold: "ht-box" }), beat(500, T({ hide: true })), beat(0, { p: { lift: false } })],
    hour: [...later(2, { a: { tech: { at: "tside", hide: false, pose: "stand", hold: "ht-box", head: null, dur: 0 }, npc: { pose: "hands", look: 0.6 } } }), beat(900, T({ head: "shake", look: -0.5 })),
      beat(300, A({ look: 0, head: "tilt" })), say(), free(), beat(1200, T({ head: null })), beat(0, { p: { odoor: true } }), ...walkTo("tech", "office", 900, "stand", { hold: "ht-box" }), beat(200, { p: { odoor: false }, ...T({ hide: true }) })],
    lux: [beat(0, { p: { odoor: false, lift: false }, ...T({ hide: true }) }), beat(1100, A({ pose: "type", head: "down", look: 0.4 })), say(400, A({ pose: "hands", head: "tilt", look: 0 })), free()],
    manager: [beat(0, { p: { odoor: false, lift: false }, ...T({ hide: true }) }), beat(400, A({ pose: "phone", hold: "phone", head: null, look: 0.4 })), beat(1200, A({ head: "nod" })), beat(300, A({ pose: "hands", hold: null, head: null, look: 0 })), say(1200, { p: { disc: true } }), free()],
    newkey: [beat(800, A({ pose: "type", head: "down", look: 0.4 })), beat(500, A({ pose: "give", face: -1, hold: "ht-key2", head: null, look: 0 })), say(400, { p: { key2: true }, ...A({ hold: null }) }),
      beat(600, A({ pose: "hands", head: "nod" })), free()],
  },
  script: {
    "hotel-complaint": { n1: "hi", n2: "id", n3: "key", n4: "later", n5: "master", w6: "hour", n6: "lux", n7: "manager", fin: "newkey" },
  },
  css: `
.ht-held{transform-box:view-box;transform-origin:0 0;animation:ht-in .35s .15s ease both}
.ht-on{opacity:0;transform:translateY(-14px);transition:opacity .35s ease,transform .45s cubic-bezier(.3,1.3,.5,1)}
.ht-on.on{opacity:1;transform:none}
.ht-near{transition-duration:1.7s!important}
.ht-hand{transition:transform 1.1s cubic-bezier(.5,0,.3,1)}
.ht-ding{opacity:0}.ht-ding.on{animation:ht-ding .45s ease-out 2}
.ht-chand{animation:ht-glow 5s ease-in-out infinite}
.ht-win{animation:ht-win 9s steps(1) infinite}
.ht-paper{animation:ht-page 7s ease-in-out infinite;transform-origin:250px 296px}
@keyframes ht-in{from{opacity:0}to{opacity:1}}
@keyframes ht-ding{0%{opacity:1;transform:scale(.8)}100%{opacity:0;transform:scale(1.15)}}
@keyframes ht-glow{0%,100%{opacity:1}50%{opacity:.88}}
@keyframes ht-win{0%{opacity:1}60%{opacity:0}}
@keyframes ht-page{0%,80%,100%{transform:none}86%{transform:scaleX(.9) skewY(-3deg)}}
`,
  Stage,
};
