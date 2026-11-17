// VR өмір: ТЕЛЕФОН. Кешкі бөлме, үстелде телефон мен дәптер → «Самал» нөмірін тереміз, гудок → кадр екіге бөлінеді:
// оң жақта мейрамхана, телефон шырылдайды, әкімші (Арман) залдан келіп, гарнитурамен жауап береді. Әр түйін: жұмыс уақыты тақтасы,
// брон кітабына жазу, залдағы терезе жанындағы үстелді көрсету, даяшы «БРОН» белгісін қояды; біз дәптерге белгі түсіреміз.
// Соңында қоңырау аяқталады, кадр қайта біздің бөлмеге оралады.
import { C, ST, Box, Cone, Pool, Item, Person, Actor, Passerby, Horn, walkTo, beat, say, free } from "./kit";

const HOST = { skin: 0, hair: "#1E1A1A", hs: "short", top: C.deep, coat: true, shirt: C.surf, badge: C.gold, pants: "#2B2F3A" };
const WAITER = { f: true, skin: 1, hair: "#2B1A12", hs: "bun", top: C.surf, vest: "#2B2F3A", pants: "#2B2F3A" };
const D1 = { f: true, skin: 2, hair: "#3B2416", hs: "bun", top: C.teal };
const D2 = { skin: 0, hair: "#4E2F1B", hs: "short", top: "#5B87A8", glasses: true };

const spots = {
  hall: { x: 700, y: 318, s: 0.6 },
  desk: { x: 650, y: 446, s: 0.88 },
  wHall: { x: 790, y: 300, s: 0.56 },
  wWin: { x: 520, y: 304, s: 0.56 },
};
const shots = {
  wide: { x: 400, y: 225, z: 1, a: "m" },
  desk: { x: 240, y: 300, z: 1.5, a: "m" },
  split: { x: 400, y: 232, z: 1, a: "m" },
  notes: { x: 290, y: 352, z: 1.7, a: "m" },
};

/* ── Біздің бөлме ── */
function Home({ st }) {
  const p = st.p;
  const scr = p.end ? ["Қоңырау", "аяқталды", "#9AA3B0"] : p.answer ? ["Самал", "00:47", "#7BE0A0"] : p.dial ? ["Самал", "қоңырау…", C.gold2] : ["", "", "#1C2129"];
  return (
    <g>
      <rect x="-40" y="-40" width="880" height="540" fill="#D8CBB0" />
      <path d="M-40 -40H840V12H-40Z" fill="#C9B998" />
      {/* терезе: кешкі қала */}
      <g transform="translate(30 40)">
        <rect width="230" height="190" rx="4" fill={C.wood2} />
        <rect x="10" y="10" width="210" height="170" fill="#2F3A5A" />
        <path d="M10 120h30v-40h30v30h26v-56h34v66h26v-30h40v30h24v60H10Z" fill="#1F2A44" />
        {[[24, 132], [52, 96], [80, 124], [108, 74], [120, 100], [150, 120], [176, 134], [204, 140], [30, 150], [140, 152]].map(([x, y], i) => <rect key={i} className="ph-tw" style={{ animationDelay: `${-i * 0.9}s` }} x={x} y={y} width="6" height="8" fill={C.gold2} />)}
        <circle cx="180" cy="44" r="14" fill="#F6E3B0" /><circle cx="186" cy="40" r="12" fill="#2F3A5A" />
        <path d="M115 10v170M10 95h210" stroke={C.wood2} strokeWidth="6" />
      </g>
      {/* сағат, сурет, шам */}
      <g transform="translate(330 70)"><circle r="24" fill={C.surf} stroke={C.wood2} strokeWidth="4" /><path d="M0 0V-15M0 0l10 5" stroke={C.ink} strokeWidth="3" strokeLinecap="round" /></g>
      <path d="M560 -40V40" stroke={C.thread} strokeWidth="2" /><path d="M530 64Q560 30 590 64Z" fill={C.gold} /><Cone x={560} y={64} w={300} h={300} top={24} op={0.2} />
      <rect x="610" y="90" width="150" height="110" rx="3" fill={C.wood2} /><rect x="618" y="98" width="134" height="94" fill="#CFE6EC" /><path d="M618 192l40 -50 26 30 30 -40 38 60Z" fill="#7FA3B4" />
      {/* мысық креслода */}
      <g transform="translate(560 330)">
        <rect x="-70" y="-90" width="140" height="100" rx="20" fill="#5B87A8" /><rect x="-84" y="-40" width="168" height="60" rx="14" fill="#4E7A9A" />
        <g className="ph-cat"><ellipse cx="0" cy="-48" rx="34" ry="16" fill="#C0602F" /><circle cx="26" cy="-56" r="11" fill="#C0602F" /><path d="M20 -64l3 -8 4 6M30 -66l4 -7 2 8" fill="#C0602F" /><path d="M-34 -46q-14 6 -6 14" stroke="#C0602F" strokeWidth="6" fill="none" strokeLinecap="round" /></g>
      </g>
      {/* жұмыс үстелі */}
      <path d="M-40 330H840V500H-40Z" fill={C.wood} />
      <path d="M-40 330H840" stroke={C.wood3} strokeWidth="8" />
      <Pool x={240} y={392} rx={200} ry={30} op={0.25} />
      {/* телефон (үстелде, динамик қосулы) */}
      <g transform="translate(184 394) rotate(-8)">
        <rect x="-44" y="-74" width="88" height="148" rx="12" fill={C.ink} />
        <rect x="-38" y="-64" width="76" height="126" rx="6" fill="#1C2129" />
        <rect x="-38" y="-64" width="76" height="126" rx="6" fill={scr[2]} opacity={p.dial || p.answer || p.end ? 0.18 : 0} />
        <circle cx="0" cy="-30" r="16" fill={p.dial || p.answer ? C.deep : "#2E3440"} />
        {(p.dial || p.answer) && <text x="0" y="-25" textAnchor="middle" fontSize="13" fontWeight="800" fill={C.cream}>С</text>}
        <text x="0" y="2" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.cream}>{scr[0]}</text>
        <text x="0" y="18" textAnchor="middle" fontSize="10" fontWeight="700" fill={scr[2]}>{scr[1]}</text>
        <circle cx="0" cy="44" r="10" fill={p.answer || p.dial ? "#C8392E" : "#2E3440"} />
        <g className={`ph-ring${p.dial && !p.answer && !p.end ? " on" : ""}`}><path d="M52 -50q12 14 0 28M62 -58q20 22 0 44" stroke={C.gold2} strokeWidth="3" fill="none" /></g>
      </g>
      {/* дәптер: жазбалар */}
      <g transform="translate(330 402) rotate(4)">
        <rect x="-62" y="-52" width="124" height="96" rx="4" fill={C.surf} />
        <path d="M-62 -52v96" stroke={C.red} strokeWidth="5" />
        {[-34, -16, 2, 20].map((y) => <path key={y} d={`M-52 ${y}h104`} stroke="#D7E3EA" strokeWidth="1.4" />)}
        {[["Самал", "m0"], ["Сенбі, 19:00", "m1"], ["4 адам", "m2"], ["терезе жаны ✓", "m3"]].map(([t, k], i) => (
          <g key={k} className={`ph-w${p[k] ? " on" : ""}`}><text x="-50" y={-38 + i * 18} fontSize="12" fontStyle="italic" fontWeight="700" fill={C.blue2}>{t}</text></g>
        ))}
      </g>
      <g className={`ph-pen${p.pen ? " on" : ""}`}><g transform="translate(400 390) rotate(30)"><Item k="pen" s={1.6} /></g></g>
      <g transform="translate(-6 378)"><Item k="cup" s={1.4} /><g className="ph-steam"><path d="M-4 -30q-6 -8 2 -14t0 -14" stroke="#fff" strokeWidth="3" fill="none" opacity=".7" /></g></g>
    </g>
  );
}

/* ── Мейрамхана (оң жақ панель) ── */
function Resto({ st, talk, mood }) {
  const p = st.p, w = st.a.npc, wt = st.a.wai;
  return (
    <g>
      <rect x="410" y="-40" width="460" height="540" fill="#F3E4C8" />
      <rect x="410" y="-40" width="460" height="64" fill={C.deep} />
      <text x="640" y="12" textAnchor="middle" fontSize="22" fontWeight="700" letterSpacing="6" fill={C.gold2} style={{ fontFamily: "var(--head)" }}>САМАЛ</text>
      {/* үлкен терезе және үстелдер */}
      <rect x="430" y="60" width="160" height="170" rx="4" fill={C.wood2} /><rect x="438" y="68" width="144" height="154" fill="#3A4A6A" />
      <path d="M438 180h30v-30h24v40h30v-56h30v46h30v42H438Z" fill="#1F2A44" />
      {[[452, 170], [500, 152], [548, 160], [470, 196]].map(([x, y], i) => <rect key={i} className="ph-tw" style={{ animationDelay: `${-i * 1.3}s` }} x={x} y={y} width="5" height="7" fill={C.gold2} />)}
      <path d="M510 68v154" stroke={C.wood2} strokeWidth="5" />
      <g className={`ph-hl${p.win ? " on" : ""}`}><ellipse cx="514" cy="300" rx="78" ry="16" fill={C.gold2} opacity=".35" /></g>
      <rect x="490" y="290" width="48" height="8" rx="3" fill={C.surf} /><path d="M514 298v30" stroke={C.wood2} strokeWidth="4" />
      <g className={`ph-res${p.res ? " on" : ""}`}><rect x="500" y="268" width="28" height="18" rx="2" fill={C.deep} /><text x="514" y="281" textAnchor="middle" fontSize="7" fontWeight="800" fill={C.gold2}>БРОН</text></g>
      <g className="ph-d1"><Actor a={{ x: 714, y: 316, s: 0.52 }}><Person o={D1} pose="sit" hold="cup" look={0.6} seed={3} /></Actor></g>
      <g className="ph-d2"><Actor a={{ x: 796, y: 316, s: 0.52, face: -1 }}><Person o={D2} pose="sit" look={0.6} seed={7} /></Actor></g>
      <ellipse cx="756" cy="298" rx="60" ry="10" fill={C.surf} /><path d="M756 306v28" stroke={C.wood2} strokeWidth="4" /><Item k="teapot" x={756} y={286} s={0.5} />
      {[540, 740].map((x) => <g key={x}><path d={`M${x} 24V50`} stroke={C.thread} strokeWidth="2" /><path d={`M${x - 18} 66Q${x} 40 ${x + 18} 66Z`} fill={C.gold} /><Cone x={x} y={66} w={150} h={200} top={16} op={0.18} /></g>)}
      {/* жұмыс уақыты тақтасы */}
      <g transform="translate(640 92)" className={p.hours ? "ph-pop" : ""}><rect x="-50" y="0" width="100" height="40" rx="5" fill={C.surf} stroke={C.gold} strokeWidth="2" />
        <text x="0" y="16" textAnchor="middle" fontSize="9" fontWeight="800" fill={C.deep}>КҮН САЙЫН</text><text x="0" y="31" textAnchor="middle" fontSize="11" fontWeight="800" fill={C.ink}>10:00–00:00</text></g>
      <Actor a={wt} dur={wt?.dur}><Person o={WAITER} pose={wt?.pose} look={wt?.look || 0} head={wt?.head} hold={wt?.hold} seed={5} /></Actor>
      <path d="M410 340H870V500H410Z" fill="#A9703F" opacity=".35" />
      {/* әкімші + гарнитура */}
      <Actor a={w} dur={w?.dur}>
        <Person o={HOST} pose={w?.pose} talk={talk} mood={mood} look={w?.look || 0} head={w?.head} hold={w?.hold} holdL={w?.holdL} seed={1} />
        {w?.set && <g><path d="M-36 -262Q-30 -298 0 -298Q30 -298 36 -262" fill="none" stroke={C.ink} strokeWidth="5" /><rect x="-42" y="-266" width="12" height="20" rx="4" fill={C.ink} /><path d="M-36 -248Q-34 -228 -14 -230" stroke={C.ink} strokeWidth="3" fill="none" /><circle cx="-12" cy="-230" r="4" fill={C.ink} /></g>}
      </Actor>
      {/* подиум: брон кітабы, телефон базасы */}
      <path d="M520 380H780L770 500H530Z" fill={C.wood2} />
      <rect x="510" y="368" width="280" height="16" rx="4" fill={C.wood} />
      <Horn x={650} y={440} s={1.2} c={C.gold} />
      <g transform="translate(724 362)"><rect x="-20" y="-10" width="40" height="12" rx="4" fill="#3A3F4E" /><circle cx="0" cy="-4" r="3" fill={p.answer ? "#7BE0A0" : "#C8392E"} />
        <g className={`ph-ring${p.split && !p.answer && !p.end ? " on" : ""}`}><path d="M24 -20q8 8 0 18M30 -26q14 14 0 30" stroke={C.red} strokeWidth="2.4" fill="none" /></g></g>
      <g transform="translate(608 362)">
        <path d="M-50 4L-46 -14H0V4Z" fill={C.surf} /><path d="M0 4V-14H46L50 4Z" fill="#F7F1E4" /><path d="M0 -14V4" stroke="#CFC6B2" strokeWidth="2" />
        <g className={`ph-w${p.b1 ? " on" : ""}`}><path d="M6 -10h30" stroke={C.blue2} strokeWidth="2" /></g>
        <g className={`ph-w${p.b2 ? " on" : ""}`}><path d="M6 -6h22" stroke={C.blue2} strokeWidth="2" /></g>
        <g className={`ph-w${p.b3 ? " on" : ""}`}><path d="M6 -2h34" stroke={C.blue2} strokeWidth="2" /></g>
      </g>
      {/* бөлу сызығы */}
      <rect x="402" y="-40" width="10" height="540" fill={C.gold} />
      <g transform="translate(407 40)"><circle r="18" fill={C.deep} stroke={C.gold} strokeWidth="3" /><path d="M-7 -6q0 -4 4 -4l3 4 -2 3q2 4 5 6l3 -2 4 3q0 4 -4 4q-13 -2 -13 -14Z" fill={C.cream} /></g>
    </g>
  );
}

function Stage({ st, talk, mood }) {
  return (
    <g>
      <Home st={st} />
      <g className="lf-mv ph-panel" style={{ transform: st.p.split ? "none" : "translateX(480px)" }}><Resto st={st} talk={talk} mood={mood} /></g>
    </g>
  );
}

const H = (patch) => ({ a: { npc: patch } });
const idle = (extra = {}) => H({ pose: "hands", head: null, hold: null, holdL: null, look: 0, ...extra });
const write = (extra = {}) => H({ pose: "write", hold: "pen", holdL: "pad", head: null, look: 0, ...extra });

export default {
  spots,
  shots,
  dip: "#F3E4C8",
  init: { set: "in", cam: "wide", p: {}, a: { npc: { at: "hall", pose: "pour", hold: "teapot", look: 0.4, set: true }, wai: { at: "wHall", pose: "stand", hold: "tray" } } },
  intro: [
    beat(900),
    beat(1200, { cam: "desk", camMs: 1200 }),
    beat(500, { hand: "tap" }),
    beat(300, { p: { dial: true, m0: true } }),
    beat(900, { hand: null }),
    beat(1300, { p: { split: true }, cam: "split", camMs: 1300 }),
    beat(400, H({ pose: "stand", hold: null, look: 0.2 })),
    ...walkTo("npc", "desk", 1300, "type"),
    beat(500, { p: { answer: true } }),
    beat(200, idle()),
  ],
  acts: {
    talk: [beat(300, idle()), say(), free()],
    hello: [beat(300, idle({ head: "tilt" })), say(), free()],
    hours: [beat(300, { p: { hours: true }, ...H({ pose: "point", face: -1, look: -0.4, head: null }) }), say(1400), beat(0, idle()), free()],
    book: [beat(300, idle({ head: "nod" })), say(500, write()), free()],
    when: [beat(300, { p: { pen: true } }), beat(700, { p: { m1: true, b1: true } }), beat(300, write({ head: "tilt", look: 0 })), say(), free()],
    where: [beat(300, { p: { m2: true, b2: true } }), beat(300, H({ pose: "point", face: -1, hold: null, holdL: null, look: -0.5, head: null })), say(400, { p: { win: true } }), beat(1400), beat(0, idle()), free()],
    name: [beat(300, { p: { m3: true } }), beat(300, write({ head: "down" })), say(), free()],
    done: [beat(500, { p: { b3: true, pen: false } }), beat(200, idle({ head: "nod" })), say(300),
      beat(1600, { a: { wai: { at: "wWin", pose: "walk", dur: 1600 } } }), beat(400, { a: { wai: { pose: "reach", hold: null } } }), beat(300, { p: { res: true } }), beat(200, { a: { wai: { pose: "stand", look: 0.4 } } }), free()],
    bye: [beat(300, idle({ head: "nod" })), say(300, H({ pose: "wave" })), beat(800, idle()), free(),
      beat(500, { p: { answer: false, end: true }, a: { npc: { pose: "type" } } }),
      beat(1300, { p: { split: false, win: false }, cam: "notes", camMs: 1300 })],
  },
  script: {
    "phone-booking": { n1: "hello", h2: "hours", n2: "book", n3: "when", n4: "where", n5: "name", n6: "done", fin: "bye" },
  },
  css: `
.ph-panel{transition-duration:1.2s!important}
.ph-tw{animation:ph-tw 5s ease-in-out infinite}
@keyframes ph-tw{0%,70%,100%{opacity:1}80%{opacity:.25}}
.ph-ring{opacity:0}.ph-ring.on{animation:ph-ring .8s ease-in-out infinite}
@keyframes ph-ring{0%,100%{opacity:0}40%,60%{opacity:1}}
.ph-w{transform-box:fill-box;transform-origin:0 50%;transform:scaleX(0);opacity:0;transition:transform .8s ease-out,opacity .2s}.ph-w.on{transform:none;opacity:1}
.ph-pen{opacity:0;transform:translateY(40px);transition:opacity .3s,transform .5s}.ph-pen.on{opacity:1;transform:none;animation:ph-scrib .5s ease-in-out .5s 4 alternate}
@keyframes ph-scrib{from{transform:translateX(0)}to{transform:translateX(-14px) translateY(2px)}}
.ph-steam{animation:ph-steam 2.6s ease-in-out infinite}
@keyframes ph-steam{0%,100%{opacity:0;transform:translateY(4px)}40%{opacity:.85}80%{opacity:0;transform:translateY(-8px)}}
.ph-cat{transform-box:fill-box;transform-origin:50% 100%;animation:ph-breathe 3.4s ease-in-out infinite}
@keyframes ph-breathe{50%{transform:scaleY(1.06)}}
.ph-hl{opacity:0;transition:opacity .5s}.ph-hl.on{opacity:1;animation:ph-glow 1.2s ease-in-out 3}
@keyframes ph-glow{50%{opacity:.4}}
.ph-res{opacity:0;transform:translateY(-12px);transition:opacity .3s,transform .45s cubic-bezier(.3,1.3,.5,1)}.ph-res.on{opacity:1;transform:none}
.ph-pop{transform-box:fill-box;transform-origin:50% 50%;animation:ph-pop .7s ease-in-out 2}
@keyframes ph-pop{50%{transform:scale(1.15)}}
.ph-d1 .lf-ua.r{animation:ph-sipu 9s ease-in-out infinite}.ph-d1 .lf-fa.r{animation:ph-sipf 9s ease-in-out infinite}
.ph-d2 .lf-mouth{opacity:1;animation:lf-talk .27s ease-in-out infinite alternate}
@keyframes ph-sipu{0%,55%,85%,100%{transform:rotate(-14deg)}62%,78%{transform:rotate(-4deg)}}
@keyframes ph-sipf{0%,55%,85%,100%{transform:rotate(80deg)}62%,78%{transform:rotate(150deg)}}
`,
  Stage,
};
