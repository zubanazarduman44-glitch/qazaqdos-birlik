// VR «өмір» қабатының ортақ бөлшектері: буынды адам (Person), актёр орны (Actor), өтіп бара жатқан адам (Passerby),
// бірінші жақтағы қол (MyHand), заттар (Item) және бит (beat) көмекшілері. Барлық қимыл — CSS transform (app/vr.css, «lf-» класстары).
// Адамның координаттары: аяғы (0,0), басы шамамен y −300. Сол/оң — көрерменге қарай (l — x<0 жақ).

export const C = {
  cream: "#FAF6EE", surf: "#FFFDF7", felt: "#F4ECDA", ink: "#1F2430", thread: "#3A2210", red: "#B8322A", deep: "#8A2018",
  gold: "#E0A526", gold2: "#F2C14E", goldS: "#F6E3B0", blue: "#0F5E7A", blue2: "#0A4A61", sky: "#CFE6EC", green: "#2F6B4F",
  leaf: "#5E8C4A", leaf2: "#46703A", wood: "#A8703F", wood2: "#86532B", wood3: "#C48A52", grey: "#C9C2B2", navy: "#1F2A44", teal: "#2C7A78",
  pants: "#3A3F4E", glass: "#CFE3E6", warm: "#FBE3B4", shade: "rgba(58,34,16,.18)", dark: "rgba(31,20,10,.28)",
};
export const ST = "rgba(255,253,247,.6)";
export const SKINS = [["#EDC39C", "#D9A57C"], ["#DDA87E", "#C48D63"], ["#C98E65", "#AD7450"]];
const HORN = "M20 23V13C20 7.5 15 4.5 11 6.2C7.6 7.7 8.2 12.4 11.6 12.4C13.6 12.4 14.2 10 12.6 9.3M20 13C20 7.5 25 4.5 29 6.2C32.4 7.7 31.8 12.4 28.4 12.4C26.4 12.4 25.8 10 27.4 9.3M15 23H25";
export const Horn = ({ x, y, s = 1, c = C.gold, w = 2 }) => <path transform={`translate(${x} ${y}) scale(${s}) translate(-20 -15)`} d={HORN} fill="none" stroke={c} strokeWidth={w / s} strokeLinecap="round" />;

// Киіз тікбұрыш: көлеңке + үзік тігіс
export function Box({ x, y, w, h, r = 6, c, sh, st = ST, d = 4, op }) {
  return (
    <g opacity={op}>
      {sh && <rect x={x} y={y + d} width={w} height={h} rx={r} fill={sh} />}
      <rect x={x} y={y} width={w} height={h} rx={r} fill={c} />
      {st && w > 18 && h > 18 && <rect x={x + 5} y={y + 5} width={w - 10} height={h - 10} rx={Math.max(0, r - 3)} fill="none" stroke={st} strokeWidth="1.5" strokeDasharray="4 4" />}
    </g>
  );
}
// Жарық шоғы (шам астындағы конус) және еденге түскен жұмсақ дақ
export const Cone = ({ x, y, w = 120, h = 220, top = 18, c = "#FFE7A8", op = 0.22 }) => (
  <path className="lf-glow" d={`M${x - top} ${y}L${x + top} ${y}L${x + w / 2} ${y + h}L${x - w / 2} ${y + h}Z`} fill={c} opacity={op} />
);
export const Pool = ({ x, y, rx = 80, ry = 14, c = "#FFE7A8", op = 0.35 }) => <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={c} opacity={op} />;
export const Shadow = ({ x = 0, y = 0, rx = 46, ry = 9, op = 0.22 }) => <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#3A2210" opacity={op} />;

/* ═════════════ Заттар (қолда немесе үстелде) ═════════════ */
// Әр зат өз нүктесінің (0,0) айналасында салынады; қолда — алақан тұсында.
export function Item({ k, x = 0, y = 0, s = 1, r = 0 }) {
  const t = `translate(${x} ${y}) rotate(${r}) scale(${s})`;
  const body = ITEMS[k];
  return body ? <g transform={t} className={`lf-item lf-i-${k}`}><g className="lf-it">{body}</g></g> : null;
}
const ITEMS = {
  pad: (<><rect x="-14" y="-20" width="28" height="36" rx="3" fill={C.surf} stroke="#CFC6B2" strokeWidth="2" /><path d="M-8 -10h16M-8 -3h16M-8 4h10" stroke="#9AA3B0" strokeWidth="2" /><rect x="-14" y="-22" width="28" height="6" rx="2" fill={C.red} /></>),
  pen: (<><rect x="-2" y="-22" width="4" height="26" rx="2" fill={C.blue} /><path d="M-2 4L0 9L2 4Z" fill={C.ink} /></>),
  menu: (<><rect x="-20" y="-28" width="40" height="52" rx="4" fill={C.deep} /><rect x="-15" y="-23" width="30" height="42" rx="2" fill="none" stroke={C.gold} strokeWidth="1.6" strokeDasharray="3 3" /><Horn x={0} y={-2} s={0.5} c={C.gold} w={1.6} /></>),
  tray: (<><ellipse cx="0" cy="0" rx="34" ry="8" fill="#B9B3A6" /><ellipse cx="0" cy="-3" rx="34" ry="8" fill="#DCD6C8" /><ellipse cx="0" cy="-9" rx="20" ry="6" fill={C.surf} /><path d="M-14 -11Q0 -24 14 -11Z" fill="#E9B44C" /><circle cx="-5" cy="-15" r="2" fill="#C0602F" /><circle cx="5" cy="-14" r="2" fill="#C0602F" /></>),
  plov: (<><ellipse cx="0" cy="0" rx="40" ry="12" fill="#3F7F9C" /><ellipse cx="0" cy="-2" rx="36" ry="10" fill={C.surf} /><path d="M-26 -3Q0 -26 26 -3Q0 4 -26 -3Z" fill="#E9B44C" /><path d="M-10 -10l6 2M4 -14l5 3M10 -7l5 1M-18 -6l5 0" stroke="#C0602F" strokeWidth="3" strokeLinecap="round" /><path d="M-4 -16q2 -6 6 -2" stroke={C.leaf} strokeWidth="2" fill="none" /></>),
  cup: (<><path d="M-12 -14H12L9 4H-9Z" fill={C.blue} /><path d="M-12 -14H12" stroke={C.gold} strokeWidth="2.4" /><ellipse cx="0" cy="-14" rx="12" ry="3" fill="#B5652A" /><ellipse cx="0" cy="6" rx="13" ry="3" fill="#B9B3A6" /></>),
  teapot: (<><ellipse cx="0" cy="0" rx="18" ry="15" fill={C.blue} /><path d="M16 -4Q30 -8 32 -18" stroke={C.blue} strokeWidth="6" fill="none" strokeLinecap="round" /><path d="M-16 -8Q-28 -2 -16 8" stroke={C.blue2} strokeWidth="4" fill="none" /><ellipse cx="0" cy="-15" rx="8" ry="3" fill={C.blue2} /><circle cx="0" cy="-19" r="3" fill={C.gold} /><path d="M-12 2H12" stroke={C.gold} strokeWidth="2" /></>),
  bill: (<><rect x="-16" y="-24" width="32" height="44" rx="3" fill={C.thread} /><rect x="-12" y="-30" width="22" height="16" rx="1" fill={C.surf} /><path d="M-8 -26h14M-8 -21h10" stroke="#9AA3B0" strokeWidth="1.6" /></>),
  bread: (<><ellipse cx="0" cy="0" rx="30" ry="13" fill="#C98A3E" /><ellipse cx="0" cy="-3" rx="27" ry="10" fill="#E2A85A" /><path d="M-16 -8q4 6 0 10M-4 -10q4 6 0 12M8 -10q4 6 0 12" stroke="#B9772F" strokeWidth="2.4" fill="none" /></>),
  brown: (<><ellipse cx="0" cy="0" rx="30" ry="13" fill="#5E3A22" /><ellipse cx="0" cy="-3" rx="27" ry="10" fill="#7A4A2A" /><path d="M-16 -8q4 6 0 10M-4 -10q4 6 0 12M8 -10q4 6 0 12" stroke="#4E2F1B" strokeWidth="2.4" fill="none" /></>),
  milk: (<><path d="M-11 -30H11V10Q11 14 7 14H-7Q-11 14 -11 10Z" fill={C.surf} stroke="#CFC6B2" strokeWidth="1.6" /><path d="M-11 -30L-6 -40H6L11 -30Z" fill="#3F7F9C" /><rect x="-11" y="-14" width="22" height="12" fill="#3F7F9C" /><circle cx="0" cy="-8" r="3.2" fill={C.surf} /></>),
  card: (<><rect x="-16" y="-10" width="32" height="20" rx="3" fill={C.red} /><rect x="-12" y="-5" width="7" height="5" rx="1" fill={C.gold} /><path d="M-12 5h18" stroke={C.goldS} strokeWidth="1.6" /></>),
  note: (<><rect x="-22" y="-11" width="44" height="22" rx="2" fill="#7BA8C9" /><rect x="-18" y="-7" width="36" height="14" rx="1" fill="none" stroke="#4E7A9A" strokeWidth="1.4" /><circle cx="0" cy="0" r="4.5" fill="#E9D27A" /></>),
  coins: (<><ellipse cx="-6" cy="0" rx="8" ry="3.4" fill="#B48A2E" /><ellipse cx="-6" cy="-2" rx="8" ry="3.4" fill="#E0B954" /><ellipse cx="6" cy="1" rx="8" ry="3.4" fill="#9C9A92" /><ellipse cx="6" cy="-1" rx="8" ry="3.4" fill="#D3D0C6" /></>),
  phone: (<><rect x="-11" y="-20" width="22" height="40" rx="4" fill={C.ink} /><rect x="-8.5" y="-16" width="17" height="30" rx="2" fill="#3E8E7E" /><path d="M-5 -8h10M-5 -3h7M-5 6h10" stroke="#BFE3D8" strokeWidth="1.8" /></>),
  book: (<><path d="M-24 -16H0V16H-24Z" fill="#1F4E8C" /><path d="M0 -16H24V16H0Z" fill="#2A63A8" /><path d="M0 -16V16" stroke={C.surf} strokeWidth="2" /><path d="M6 -8h12M6 -2h10" stroke="#BFD3EA" strokeWidth="2" /></>),
  terminal: (<><rect x="-14" y="-24" width="28" height="44" rx="5" fill="#2E3440" /><rect x="-10" y="-20" width="20" height="13" rx="2" fill="#9FD3B4" /><g fill="#5D6675">{[-5, 2, 9].map((y) => [-6, 0, 6].map((x) => <rect key={`${x}${y}`} x={x - 2} y={y} width="4" height="4" rx="1" />))}</g></>),
};

/* ═════════════ Буынды адам ═════════════ */
// o — киім/түр: { skin:0..2, hair, hs:"short|bun|long|braid|scarf|cap|bows|taqiya", top, pants, shoes, apron, collar, tie, glasses, tache,
//   skirt, coat, shirt, vest, scarf, cap, sleeve:"short", f (әйел), kid (бала: басы үлкенірек) }
// pose: stand|walk|walkz|sit|write|give|point|wave|pour|reach|hands|type|drive|phone|carry
// head: nod|tilt|down|shake|turn ; look: −1..1 (бет бұрылуы)
// seat — отырған күйде (такси, парта): аяқтары бүгулі, кез келген қол позасымен
export function Person({ o = {}, pose = "stand", talk = false, mood = null, look = 0, head = null, hold = null, holdL = null, seed = 0, seat = false }) {
  const [skin, skd] = SKINS[o.skin || 0];
  const top = o.top || C.teal;
  const sleeve = o.sleeveC || top;
  const pants = o.pants || C.pants;
  const hair = o.hair || "#2B1A12";
  const hs = o.hs || "short";
  const arm = (side) => {
    const l = side === "l";
    const item = l ? holdL : hold;
    return (
      <g transform={`translate(${l ? -54 : 54} -92)`}>
        <g className={`lf-ua ${side}`}>
          <path d="M0 0V44" stroke={sleeve} strokeWidth="21" strokeLinecap="round" />
          <g transform="translate(0 44)">
            <g className={`lf-fa ${side}`}>
              <path d="M0 0V38" stroke={o.sleeve === "short" ? skin : sleeve} strokeWidth="18" strokeLinecap="round" />
              {o.cuff && <path d="M-9 30H9" stroke={o.cuff} strokeWidth="5" />}
              <circle cx="0" cy="44" r="10" fill={skin} />
              {item && <Item k={item} y={48} />}
            </g>
          </g>
        </g>
      </g>
    );
  };
  const leg = (side) => (
    <g transform={`translate(${side === "l" ? -19 : 19} -98)`}>
      <g className={`lf-th ${side}`}>
        <path d="M0 0V44" stroke={pants} strokeWidth="29" strokeLinecap="round" />
        <g transform="translate(0 44)">
          <g className={`lf-sh ${side}`}>
            <path d="M0 0V40" stroke={o.legs || pants} strokeWidth="25" strokeLinecap="round" />
            <ellipse cx={side === "l" ? -5 : 5} cy="49" rx="19" ry="8" fill={o.shoes || C.ink} />
          </g>
        </g>
      </g>
    </g>
  );
  return (
    <g className={`lf-fig p-${pose}${seat ? " is-seat" : ""}${hold ? " has-hold" : ""}${talk ? " is-talk" : ""}${mood ? ` is-${mood}` : ""}${head ? ` h-${head}` : ""}`} style={{ "--look": look, "--bd": `${-(seed % 9) * 0.53}s` }}>
      <g className="lf-root">
        {leg("l")}
        {leg("r")}
        <g transform="translate(0 -100)">
          <g className="lf-tor">
            {/* артқы шаш */}
            <g transform="translate(0 -120)"><g className="lf-hd"><g transform={o.kid ? "scale(1.13) translate(0 220)" : "translate(0 220)"}>
              {hs === "long" && <path d="M-37 -262C-46 -304 46 -304 37 -262L44 -188C28 -178-28 -178-44 -188Z" fill={hair} />}
              {hs === "bun" && <circle cx="0" cy="-294" r="16" fill={hair} />}
            </g></g></g>
            <g transform="translate(0 100)">
              {o.skirt && <path d="M-46 -104L-58 -36H58L46 -104Z" fill={o.skirt} />}
              <path d={o.coat ? "M-56 -206C-74 -200-78 -170-76 -140L-70 -40H70L76 -140C78 -170 74 -200 56 -206C30 -214-30 -214-56 -206Z" : "M-56 -206C-74 -200-76 -170-72 -140L-64 -96C-40 -90 40 -90 64 -96L72 -140C76 -170 74 -200 56 -206C30 -214-30 -214-56 -206Z"} fill={top} />
              {o.vest && <path d="M-50 -200C-62 -170-60 -130-58 -98H-14L-20 -204ZM50 -200C62 -170 60 -130 58 -98H14L20 -204Z" fill={o.vest} />}
              <path d="M-50 -196C-64 -188-66 -168-63 -142L-57 -104M50 -196C64 -188 66 -168 63 -142L57 -104" fill="none" stroke={top === "#FFFFFF" || top === C.surf ? "#C8C0AE" : ST} strokeWidth="1.6" strokeDasharray="4 4" />
              {!o.coat && <path d="M-62 -98C-40 -92 40 -92 62 -98" stroke="rgba(0,0,0,.2)" strokeWidth="5" fill="none" />}
              {o.coat && <path d="M-17 -209L0 -170L17 -209ZM0 -150V-46" fill={o.shirt || C.teal} stroke="#D2CBBB" strokeWidth="2.5" />}
              {o.collar && <path d="M-18 -210L0 -176L18 -210Z" fill={o.collar} />}
              {o.tie && <path d="M-5 -200H5L8 -150L0 -138L-8 -150Z" fill={o.tie} />}
              {o.apron && (
                <>
                  <path d="M-38 -168H38L46 -66H-46Z" fill={o.apron} />
                  <path d="M-38 -168L-28 -206M38 -168L28 -206" stroke={o.apron} strokeWidth="6" />
                  <path d="M-32 -160H32L38 -74H-38Z" fill="none" stroke={ST} strokeWidth="1.5" strokeDasharray="4 4" />
                  <Horn x={0} y={-112} s={0.7} c={o.apron === C.gold ? C.deep : C.gold} w={2} />
                </>
              )}
              {o.badge && <rect x="24" y="-182" width="20" height="10" rx="2" fill={o.badge} />}
              <rect x="-11" y="-226" width="22" height="24" fill={skd} />
            </g>
            {/* бас: мойын түбінде айналады */}
            <g transform="translate(0 -120)"><g className="lf-hd"><g transform={o.kid ? "scale(1.13) translate(0 220)" : "translate(0 220)"}>
              {hs === "braid" && <path d="M-30 -270C-40 -300 40 -300 30 -270Z" fill={hair} />}
              <circle cx="-31" cy="-252" r="7" fill={skd} />
              <circle cx="31" cy="-252" r="7" fill={skd} />
              <ellipse cx="0" cy="-254" rx="31" ry="35" fill={skin} />
              <g className="lf-face">
                <g className="lf-eyes">
                  <ellipse cx="-11" cy="-256" rx="3.4" ry="4.4" fill={C.ink} />
                  <ellipse cx="11" cy="-256" rx="3.4" ry="4.4" fill={C.ink} />
                  <circle cx="-10" cy="-258" r="1.1" fill="#fff" />
                  <circle cx="12" cy="-258" r="1.1" fill="#fff" />
                </g>
                <path d={o.f ? "M-18 -266Q-11 -270-5 -266M5 -266Q11 -270 18 -266" : "M-19 -265Q-11 -271-4 -266M4 -266Q11 -271 19 -265"} fill="none" stroke={o.brow || hair} strokeWidth={o.f ? 2.4 : 3.6} strokeLinecap="round" />
                <path d="M1 -251Q5 -244-1 -242" fill="none" stroke={skd} strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="-19" cy="-242" r="6" fill="#E07B6A" opacity=".3" />
                <circle cx="19" cy="-242" r="6" fill="#E07B6A" opacity=".3" />
                <path className="lf-smile" d="M-8 -233Q0 -226 8 -233" fill="none" stroke="#7A2A22" strokeWidth="2.6" strokeLinecap="round" />
                <g className="lf-grin">
                  <path d="M-11 -235Q0 -233 11 -235Q9 -223 0 -223Q-9 -223-11 -235Z" fill="#7A2A22" />
                  <path d="M-8 -233.6Q0 -232.4 8 -233.6V-231H-8Z" fill="#fff" />
                </g>
                <path className="lf-hmm" d="M-7 -230Q-2 -234 3 -231T9 -232" fill="none" stroke="#7A2A22" strokeWidth="2.6" strokeLinecap="round" />
                <ellipse className="lf-mouth" cx="0" cy="-231" rx="6" ry="4" fill="#7A2A22" />
                {o.tache && <path d="M-13 -236Q-6 -242 0 -237Q6 -242 13 -236Q6 -232 0 -235Q-6 -232-13 -236Z" fill={hair} />}
                {o.glasses && (
                  <g fill="none" stroke={C.ink} strokeWidth="2">
                    <circle cx="-12" cy="-256" r="8.5" /><circle cx="12" cy="-256" r="8.5" /><path d="M-3.5 -257h7" />
                  </g>
                )}
              </g>
              {hs === "short" && <path d="M-32 -258C-37 -300 37 -300 32 -258C28 -276 14 -283 0 -281C-14 -283-28 -276-32 -258Z" fill={hair} />}
              {(hs === "long" || hs === "braid" || hs === "bows") && <path d="M-33 -256C-35 -298 35 -298 33 -256C24 -278 6 -278 0 -268C-8 -279-26 -276-33 -256Z" fill={hair} />}
              {hs === "bun" && <path d="M-33 -256C-36 -299 36 -299 33 -256C26 -278-26 -278-33 -256Z" fill={hair} />}
              {hs === "braid" && (
                <g>
                  {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={30 + i * 2.4} cy={-236 + i * 15} rx="8" ry="9" fill={hair} />)}
                  <circle cx="42" cy="-160" r="6" fill={C.gold} />
                </g>
              )}
              {hs === "bows" && (
                <g>
                  {[-1, 1].map((d) => (
                    <g key={d} transform={`translate(${d * 34} -276)`}>
                      <ellipse cx={d * 4} cy="26" rx="7" ry="16" fill={hair} />
                      <path d="M0 0C-16 -14-22 6-8 6C-22 14-8 26 0 8C8 26 22 14 8 6C22 6 16 -14 0 0Z" fill="#FFFFFF" stroke="#D8D2C4" strokeWidth="1.5" />
                    </g>
                  ))}
                </g>
              )}
              {hs === "scarf" && (
                <g>
                  <path d="M-41 -250C-47 -308 47 -308 41 -250C39 -226 31 -212 22 -208L20 -240C16 -276-16 -276-20 -240L-22 -208C-31 -212-39 -226-41 -250Z" fill={o.scarf || C.red} />
                  <path d="M-34 -258C-34 -294 34 -294 34 -258" fill="none" stroke={ST} strokeWidth="1.6" strokeDasharray="4 4" />
                  {[[-26, -280], [0, -292], [26, -280]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r="2.4" fill={C.goldS} />)}
                </g>
              )}
              {hs === "cap" && (
                <g>
                  <rect x="-34" y="-262" width="8" height="16" rx="3" fill={hair} />
                  <rect x="26" y="-262" width="8" height="16" rx="3" fill={hair} />
                  <path d="M-34 -262C-34 -302 34 -302 34 -262Z" fill={o.cap || "#3A3F4E"} />
                  <path d="M-34 -266C-10 -274 30 -272 50 -261C30 -256-10 -258-34 -262Z" fill={C.ink} opacity=".85" />
                </g>
              )}
              {/* реакция белгісі «?» */}
              <g transform="translate(58 -312)"><g className="lf-q">
                <circle r="17" fill={C.surf} stroke={C.gold} strokeWidth="2.5" />
                <path d="M-5 -4Q-5 -10 0 -10Q6 -10 6 -5Q6 -1 1 1V4" fill="none" stroke={C.deep} strokeWidth="3.4" strokeLinecap="round" />
                <circle cy="9.5" r="2.2" fill={C.deep} />
              </g></g>
            </g></g></g>
            {arm("l")}
            {arm("r")}
          </g>
        </g>
      </g>
    </g>
  );
}

// Актёр: орны (x,y), тереңдік масштабы s және бағыты face. Орын ауысқанда CSS transition (ұзақтығы dur) жүреді.
export function Actor({ a, dur = 0, children, shadow = true, cls = "" }) {
  if (!a || a.hide) return null;
  const { x = 0, y = 0, s = 1, face = 1 } = a;
  return (
    <g className={`lf-actor ${cls}`} style={{ transform: `translate(${x}px, ${y}px) scale(${s})`, transitionDuration: `${dur}ms` }}>
      {shadow && <Shadow op={a.pose === "sit" ? 0 : 0.2} />}
      <g className="lf-facing" style={{ transform: `scaleX(${face < 0 ? -1 : 1})` }}>{children}</g>
    </g>
  );
}

// Фондағы өтіп бара жатқан адам: x0→x1 бойы шексіз (CSS айнымалылары), d — цикл ұзақтығы
export function Passerby({ o, y, s = 0.5, x0 = -60, x1 = 860, d = 16, delay = 0, seed = 1 }) {
  const dir = x1 > x0 ? 1 : -1;
  return (
    <g className="lf-pass" style={{ transform: `translate(${(x0 + x1) / 2}px, ${y}px) scale(${s})`, "--x0": `${x0}px`, "--x1": `${x1}px`, "--y": `${y}px`, "--s": s, animationDuration: `${d}s`, animationDelay: `${delay}s` }}>
      <Shadow op={0.16} />
      <g style={{ transform: `scaleX(${dir})` }}>
        <Person o={o} pose="walk" seed={seed} />
      </g>
    </g>
  );
}

// Бірінші жақтағы қол: экранның төменгі жиегінен шығады (камерадан тәуелсіз). Қызыл шапан жеңі, алтын жиек.
export function MyHand({ item }) {
  return (
    <g className={`lf-myhand${item ? " on" : ""}`} aria-hidden="true">
      <g transform="translate(560 470) rotate(-24)">
        <path d="M-34 0V-120" stroke={C.red} strokeWidth="60" strokeLinecap="round" />
        <path d="M-64 -118H-4" stroke={C.gold} strokeWidth="8" />
        <ellipse cx="-34" cy="-150" rx="25" ry="29" fill="#DDA87E" />
        <path d="M-56 -160q-8 -4 -6 -14 4 -6 12 0" fill="#DDA87E" />
        {item && <Item k={item} x={-34} y={-176} s={1.7} r={24} />}
      </g>
    </g>
  );
}

/* ═════════════ Бит көмекшілері ═════════════ */
// Бит = күйге «жамау» + ms күту. Өрістер: set, cam, camMs, walk, dip, hand, a:{id:{at,pose,look,head,hold,holdL,face,dur,hide}}, p:{...}, say, free.
export const beat = (ms, patch = {}) => ({ ms, ...patch });
// Актёрді нүктеге апару: жүру → тоқтау (end-позасы)
export const walkTo = (id, at, ms, end = "stand", extra = {}) => [
  { ms, a: { [id]: { at, pose: "walk", dur: ms, ...extra } } },
  { ms: 120, a: { [id]: { pose: end } } },
];
export const pose = (id, p, ms = 600, extra = {}) => ({ ms, a: { [id]: { pose: p, ...extra } } });
export const say = (ms = 0, patch = {}) => ({ ms, say: true, ...patch });
export const free = (ms = 0, patch = {}) => ({ ms, free: true, ...patch });
