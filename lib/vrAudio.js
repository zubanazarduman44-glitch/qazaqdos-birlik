"use client";
// VR Әлем — айнала дыбысы. Ешбір аудио файл жоқ: бәрі Web Audio арқылы процедуралық жасалады
// (көше желі, көлік ағыны, кафе гуілі, базар у-шуы, такси моторы, мектеп қоңырауы, вокзал хабарландыруы, домбыра…).
// Ережелер: тек пайдаланушы әрекетінен кейін басталады; кейіпкер сөйлегенде ақырындайды (duck); дыбыс өшіргіші есте сақталады;
// вкладка жасырын болса — тоқтайды; сөзді (lib/speak.js) ешқашан бөгемейді — бөлек AudioContext, <audio> элементі қайта бағытталмайды.
const KEY = "qd_vr_snd_v1";
let ctx = null, out = null, duckG = null, amb = null, sfx = null, meterA = null, sink = null;
let NZ = null; // шу буферлері
let env = null; // { place, set, wx, tod }
let cur = null; // жүріп тұрған айнала: { g, nodes, ev, t, alive }
let active = false, walkT = 0, lastDoor = 0, lastSfx = {};
const plucks = new Map();
const W = typeof window !== "undefined" ? window : null;

export function soundOn() {
  try { return localStorage.getItem(KEY) !== "0"; } catch { return true; }
}
const running = () => !!ctx && ctx.state === "running" && !(typeof document !== "undefined" && document.hidden);
const now = () => ctx.currentTime;
const rnd = (a, b) => a + Math.random() * (b - a);

function ensure() {
  if (ctx) return ctx;
  const AC = W && (W.AudioContext || W.webkitAudioContext);
  if (!AC) return null;
  try { ctx = new AC({ latencyHint: "playback" }); } catch { try { ctx = new AC(); } catch { return null; } }
  out = ctx.createGain();
  out.gain.value = soundOn() ? 1 : 0;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -20; comp.knee.value = 12; comp.ratio.value = 4;
  out.connect(comp); comp.connect(ctx.destination);
  meterA = ctx.createAnalyser(); meterA.fftSize = 2048; comp.connect(meterA);
  sink = ctx.createGain(); sink.gain.value = 0; sink.connect(ctx.destination); // анализаторлар «тартылуы» үшін (үнсіз)
  duckG = ctx.createGain(); duckG.connect(out);
  amb = ctx.createGain(); amb.gain.value = 0.9; amb.connect(duckG);
  sfx = ctx.createGain(); sfx.gain.value = 0.8; sfx.connect(out);
  NZ = mkNoise();
  return ctx;
}

function mkNoise() {
  const sr = ctx.sampleRate, n = Math.floor(sr * 3);
  const mk = () => ctx.createBuffer(1, n, sr);
  const w = mk(), p = mk(), b = mk();
  const wd = w.getChannelData(0), pd = p.getChannelData(0), bd = b.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
  for (let i = 0; i < n; i++) {
    const x = Math.random() * 2 - 1;
    wd[i] = x * 0.5;
    b0 = 0.99886 * b0 + x * 0.0555179; b1 = 0.99332 * b1 + x * 0.0750759; b2 = 0.969 * b2 + x * 0.153852;
    b3 = 0.8665 * b3 + x * 0.3104856; b4 = 0.55 * b4 + x * 0.5329522; b5 = -0.7616 * b5 - x * 0.016898;
    pd[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + x * 0.5362) * 0.11; b6 = x * 0.115926;
    last = (last + 0.02 * x) / 1.02; bd[i] = last * 3.5;
  }
  // Цикл жігі естілмесін: соңғы 50 мс басына қарай сөнеді
  for (const d of [wd, pd, bd]) { const f = Math.floor(sr * 0.05); for (let i = 0; i < f; i++) { const k = i / f; d[n - f + i] = d[n - f + i] * (1 - k) + d[i] * k; } }
  return { white: w, pink: p, brown: b };
}

/* ───────── Қабаттар (тұрақты фон) ───────── */
function filt(type, hz, q = 0.7) { const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = hz; f.Q.value = q; return f; }
function lfo(hz, depth, param, nodes) {
  const o = ctx.createOscillator(); o.frequency.value = hz;
  const d = ctx.createGain(); d.gain.value = depth;
  o.connect(d); d.connect(param); o.start(); nodes.push(o);
}
// Шу төсемі: n — түрі, f — сүзгі, hz, lv — деңгей, am — амплитуда тербелісі [Гц, тереңдік], fm — сүзгі жиілігінің тербелісі [Гц, ±Гц]
function bed(g, nodes, { n = "pink", f = "lowpass", hz = 800, q = 0.7, lv = 0.1, am, fm, hp }) {
  const s = ctx.createBufferSource(); s.buffer = NZ[n]; s.loop = true;
  const fl = filt(f, hz, q);
  const v = ctx.createGain(); v.gain.value = lv;
  s.connect(fl);
  let last = fl;
  if (hp) { const h = filt("highpass", hp); fl.connect(h); last = h; }
  last.connect(v); v.connect(g);
  if (am) lfo(am[0], lv * am[1], v.gain, nodes);
  if (fm) lfo(fm[0], fm[1], fl.frequency, nodes);
  s.start(0, rnd(0, 2.5)); nodes.push(s);
}
function hum(g, nodes, hz, lv) {
  [[hz, lv], [hz * 2, lv * 0.35], [hz * 3, lv * 0.12]].forEach(([f, l]) => {
    const o = ctx.createOscillator(); o.frequency.value = f;
    const v = ctx.createGain(); v.gain.value = l; o.connect(v); v.connect(g); o.start(); nodes.push(o);
  });
}
// Адамдар гуілі: сөз формантындағы үш жолақ, әрқайсысы өз ырғағымен «тыныстайды»
function murmur(g, nodes, lv, kids) {
  const k = kids ? 1.35 : 1;
  [[380 * k, 0.9, 1.1], [950 * k, 1.7, 0.7], [2300 * k, 2.9, 0.35]].forEach(([hz, r, l], i) => {
    bed(g, nodes, { n: "pink", f: "bandpass", hz, q: 3.2, lv: lv * l, am: [r + i * 0.13, 0.75], fm: [0.31 + i * 0.07, hz * 0.12] });
  });
}
function engine(g, nodes, lv) {
  const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = 41;
  const f = filt("lowpass", 130, 1.2); const v = ctx.createGain(); v.gain.value = lv;
  o.connect(f); f.connect(v); v.connect(g); o.start(); nodes.push(o);
  lfo(0.23, 2.4, o.frequency, nodes);
  bed(g, nodes, { n: "brown", f: "lowpass", hz: 380, lv: lv * 1.6, am: [0.17, 0.25] });
}

/* ───────── Бір реттік дыбыстар ───────── */
function env1(v, t, a, lv, d) {
  v.gain.setValueAtTime(0.0001, t);
  v.gain.exponentialRampToValueAtTime(lv, t + a);
  v.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
}
function tone(g, { hz, type = "sine", t = now(), a = 0.004, lv = 0.05, d = 0.3, to }) {
  const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(hz, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + a + d);
  const v = ctx.createGain(); env1(v, t, a, lv, d);
  o.connect(v); v.connect(g); o.start(t); o.stop(t + a + d + 0.05);
}
function burst(g, { n = "white", f = "bandpass", hz = 1000, q = 1, t = now(), a = 0.004, lv = 0.05, d = 0.1, to, pan }) {
  const s = ctx.createBufferSource(); s.buffer = NZ[n];
  const fl = filt(f, hz, q); if (to) fl.frequency.exponentialRampToValueAtTime(to, t + a + d);
  const v = ctx.createGain(); env1(v, t, a, lv, d);
  s.connect(fl); fl.connect(v);
  if (pan !== undefined && ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = pan; v.connect(p); p.connect(g); } else v.connect(g);
  s.start(t, rnd(0, 2)); s.stop(t + a + d + 0.05);
}
// Домбыра шегі: Карплус–Стронг (буфер бір рет есептеледі)
function pluckBuf(hz) {
  const k = Math.round(hz);
  if (plucks.has(k)) return plucks.get(k);
  const sr = ctx.sampleRate, n = Math.floor(sr * 1.5), L = Math.max(2, Math.round(sr / hz));
  const b = ctx.createBuffer(1, n, sr), y = b.getChannelData(0);
  for (let i = 0; i < L; i++) y[i] = (Math.random() * 2 - 1) * 0.9;
  for (let i = L; i < n; i++) y[i] = 0.4975 * (y[i - L] + (i - L - 1 >= 0 ? y[i - L - 1] : 0));
  let pk = 0; for (let i = 0; i < n; i++) pk = Math.max(pk, Math.abs(y[i]));
  const f = Math.floor(sr * 0.08);
  for (let i = 0; i < n; i++) y[i] = (y[i] / (pk || 1)) * 0.6 * (i > n - f ? (n - i) / f : 1);
  plucks.set(k, b);
  return b;
}
function pluck(g, hz, t, lv, dark) {
  const s = ctx.createBufferSource(); s.buffer = pluckBuf(hz);
  const v = ctx.createGain(); v.gain.value = lv;
  const f = filt("lowpass", dark ? 900 : 3200);
  s.connect(f); f.connect(v); v.connect(g); s.start(t);
}
const N = { A2: 110, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196, A3: 220, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392 };
// Күйдің шағын үзінділері (екі шек қатар: тың-тың-тыңк)
const KUI = [
  [["D3", "A3"], 0, ["D3", "A3"], 0.16, ["D3", "G3"], 0.32, ["F3", "C4"], 0.64, ["E3", "A3"], 0.8, ["D3", "A3"], 0.96, ["D3", "D4"], 1.44],
  [["G3", "D4"], 0, ["G3", "C4"], 0.18, ["F3", "A3"], 0.36, ["E3", "G3"], 0.54, ["D3", "A3"], 0.9, ["D3", "A3"], 1.08],
  [["A3", "E4"], 0, ["A3", "D4"], 0.15, ["G3", "C4"], 0.3, ["A3", "D4"], 0.6, ["F3", "C4"], 0.75, ["E3", "A3"], 0.9, ["D3", "A3"], 1.35],
];
function kui(g, lv, i) {
  const ph = KUI[i ?? Math.floor(Math.random() * KUI.length)];
  const t0 = now() + 0.05;
  for (let j = 0; j < ph.length; j += 2) for (const nm of ph[j]) pluck(g, N[nm], t0 + ph[j + 1] + rnd(0, 0.012), lv);
}

const EV = {
  car: (g) => { const p = Math.random() < 0.5 ? -1 : 1; burst(g, { n: "pink", f: "bandpass", hz: 300, q: 0.9, a: 1.4, d: 1.8, to: 520, lv: 0.16, pan: -p * 0.8 }); },
  bird: (g) => { const t = now(); const b = rnd(2600, 3400); for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) tone(g, { hz: b, to: b * 1.35, t: t + i * 0.13, d: 0.07, lv: 0.025 }); },
  crow: (g) => { const t = now(); for (let i = 0; i < 2; i++) burst(g, { n: "white", f: "bandpass", hz: 900, q: 6, t: t + i * 0.42, a: 0.02, d: 0.28, lv: 0.05, to: 700 }); },
  clink: (g) => { const t = now(), k = rnd(0.9, 1.15); tone(g, { hz: 2900 * k, t, d: 0.35, lv: 0.018 }); tone(g, { hz: 4170 * k, t, d: 0.22, lv: 0.012 }); },
  beep: (g) => tone(g, { hz: 1850, type: "square", d: 0.08, lv: 0.008 }),
  pa: (g) => { const t = now(); [[659.25, 0], [523.25, 0.5], [392, 1.0]].forEach(([hz, dt]) => { tone(g, { hz, t: t + dt, d: 1.1, lv: 0.035 }); tone(g, { hz: hz * 2, t: t + dt, d: 0.5, lv: 0.008 }); }); },
  bell: (g) => { const t = now(); [2350, 3520, 4700].forEach((hz, i) => tone(g, { hz, t, d: 0.9 - i * 0.2, lv: 0.022 / (i + 1) })); tone(g, { hz: 2350, t: t + 0.18, d: 0.7, lv: 0.012 }); },
  schoolBell: (g) => { const t = now(); for (let i = 0; i < 14; i++) tone(g, { hz: 1180, type: "triangle", t: t + i * 0.09, a: 0.003, d: 0.07, lv: 0.022 }); },
  type: (g) => { const t = now(), n = 4 + Math.floor(Math.random() * 7); for (let i = 0; i < n; i++) burst(g, { f: "highpass", hz: 2200, t: t + i * rnd(0.08, 0.17), a: 0.002, d: 0.025, lv: 0.035 }); },
  stamp: (g) => { const t = now(); tone(g, { hz: 120, to: 55, t, d: 0.16, lv: 0.09 }); burst(g, { f: "lowpass", hz: 900, t, d: 0.05, lv: 0.06 }); },
  pour: (g) => burst(g, { n: "white", f: "bandpass", hz: 1100, q: 4, a: 0.25, d: 1.6, to: 1900, lv: 0.03 }),
  page: (g) => burst(g, { n: "white", f: "highpass", hz: 3000, a: 0.03, d: 0.22, lv: 0.025 }),
  ring: (g) => { const t = now(); for (let i = 0; i < 2; i++) { tone(g, { hz: 440, t: t + i * 0.5, a: 0.01, d: 0.35, lv: 0.008 }); tone(g, { hz: 480, t: t + i * 0.5, a: 0.01, d: 0.35, lv: 0.008 }); } },
  tick: (g) => { const t = now(); for (let i = 0; i < 6; i++) burst(g, { f: "bandpass", hz: 1800, q: 3, t: t + i * 0.42, a: 0.001, d: 0.02, lv: 0.05 }); },
  cricket: (g) => { const t = now(); for (let i = 0; i < 5; i++) tone(g, { hz: 4400, t: t + i * 0.07, a: 0.004, d: 0.03, lv: 0.006 }); },
  kui: (g) => kui(g, 0.05),
  scale: (g) => { const t = now(); tone(g, { hz: 1500, t, d: 0.18, lv: 0.012 }); tone(g, { hz: 2250, t: t + 0.12, d: 0.25, lv: 0.01 }); },
  call: (g) => { const t = now(); tone(g, { hz: 880, t, d: 0.5, lv: 0.025 }); tone(g, { hz: 660, t: t + 0.35, d: 0.8, lv: 0.025 }); },
  bag: (g) => burst(g, { n: "white", f: "bandpass", hz: 4200, q: 0.8, a: 0.05, d: 0.35, lv: 0.02 }),
  roll: (g) => burst(g, { n: "brown", f: "bandpass", hz: 260, q: 1.5, a: 0.6, d: 2.2, lv: 0.12, pan: rnd(-0.6, 0.6) }),
};

/* ───────── Орындардың дыбыс «рецепті» ───────── */
// b — тұрақты қабаттар, e — оқиғалар [атауы, мин с, макс с]
const ROOM = (g, nodes, lv = 0.05) => bed(g, nodes, { n: "brown", f: "lowpass", hz: 220, lv });
const IN = {
  cafe: { b: (g, n) => { ROOM(g, n); murmur(g, n, 0.07); }, e: [["clink", 2, 6], ["pour", 14, 30], ["kui", 16, 32]] },
  shop: { b: (g, n) => { ROOM(g, n, 0.04); hum(g, n, 100, 0.006); murmur(g, n, 0.025); }, e: [["beep", 3, 8], ["bag", 6, 14]] },
  bazaar: { b: (g, n) => { murmur(g, n, 0.11); bed(g, n, { n: "pink", f: "bandpass", hz: 500, q: 0.6, lv: 0.04, fm: [0.09, 160] }); }, e: [["scale", 6, 14], ["bag", 3, 8], ["call", 9, 20]] },
  taxi: { b: (g, n) => engine(g, n, 0.07), e: [["tick", 22, 40]] },
  bus: { b: (g, n) => { engine(g, n, 0.06); murmur(g, n, 0.03); }, e: [["tick", 30, 50], ["page", 12, 25]] },
  school: { b: (g, n) => { ROOM(g, n); murmur(g, n, 0.045, true); }, e: [["page", 4, 10], ["stamp", 18, 34]], first: "schoolBell" },
  airport: { b: (g, n) => { murmur(g, n, 0.06); bed(g, n, { n: "brown", f: "lowpass", hz: 160, lv: 0.08 }); }, e: [["pa", 20, 38], ["roll", 7, 16]] },
  station: { b: (g, n) => { murmur(g, n, 0.07); bed(g, n, { n: "brown", f: "lowpass", hz: 140, lv: 0.09, am: [0.05, 0.4] }); }, e: [["pa", 18, 34], ["roll", 8, 16]] },
  hotel: { b: (g, n) => { ROOM(g, n, 0.035); murmur(g, n, 0.018); }, e: [["kui", 22, 40], ["page", 10, 22]], first: "bell" },
  pharmacy: { b: (g, n) => { ROOM(g, n, 0.04); hum(g, n, 100, 0.004); }, e: [["beep", 8, 16], ["bag", 10, 20]], first: "bell" },
  clinic: { b: (g, n) => { bed(g, n, { n: "pink", f: "lowpass", hz: 320, lv: 0.06 }); murmur(g, n, 0.015); }, e: [["call", 16, 30], ["page", 8, 18]] },
  bank: { b: (g, n) => { ROOM(g, n, 0.04); hum(g, n, 120, 0.004); }, e: [["call", 14, 26], ["type", 5, 12]] },
  post: { b: (g, n) => { ROOM(g, n, 0.045); murmur(g, n, 0.02); }, e: [["stamp", 4, 10], ["bag", 8, 16]], first: "bell" },
  guest: { b: (g, n) => ROOM(g, n, 0.04), e: [["kui", 9, 18], ["clink", 4, 9], ["pour", 15, 28]] },
  phone: { b: (g, n) => { ROOM(g, n); murmur(g, n, 0.04); }, e: [["clink", 3, 7], ["kui", 18, 34]] },
  office: { b: (g, n) => { bed(g, n, { n: "pink", f: "lowpass", hz: 280, lv: 0.05 }); hum(g, n, 60, 0.004); }, e: [["type", 3, 8], ["ring", 25, 45], ["page", 10, 20]] },
};
const winter = (e) => e.wx === "snow";
function outRecipe(e) {
  const night = e.tod === "night";
  return {
    b: (g, n) => {
      bed(g, n, { n: "brown", f: "lowpass", hz: 200, lv: night ? 0.06 : winter(e) ? 0.08 : 0.12, am: [0.07, 0.3] }); // алыс көлік ағыны
      bed(g, n, { n: "pink", f: "bandpass", hz: winter(e) ? 520 : 700, q: 0.8, lv: winter(e) ? 0.06 : 0.03, am: [0.11, 0.7], fm: [0.07, 220] }); // жел
      if (e.place === "bazaar") murmur(g, n, 0.05);
    },
    e: [["car", night ? 9 : 4, night ? 20 : 11], ...(winter(e) ? [["crow", 18, 40]] : night ? [["cricket", 3, 8]] : [["bird", 4, 10]])],
  };
}

function build(e) {
  const outSide = e.set === "out";
  const r = outSide ? outRecipe(e) : IN[e.place] || { b: (g, n) => ROOM(g, n), e: [] };
  const g = ctx.createGain(); g.gain.value = 0.0001; g.connect(amb);
  const nodes = [];
  r.b(g, nodes);
  // Жаңбыр: далада толық, көлікте — шатырға тиген, үй ішінде — терезе сыртында
  if (e.wx === "rain") bed(g, nodes, { n: "white", f: "lowpass", hz: outSide ? 6500 : e.place === "taxi" || e.place === "bus" ? 2600 : 1400, hp: 700, lv: outSide ? 0.1 : 0.04, am: [0.13, 0.15] });
  g.gain.setTargetAtTime(1, now(), 0.5);
  const L = { g, nodes, alive: true, ev: r.e.map(([k, a, b]) => ({ k, a, b, next: performance.now() / 1000 + rnd(a * 0.25, b * 0.6) })) };
  if (!outSide && r.first) setTimeout(() => L.alive && running() && EV[r.first](g), 900);
  const tick = () => {
    if (!L.alive) return;
    const t = performance.now() / 1000;
    for (const ev of L.ev) if (t >= ev.next) {
      if (running()) try { EV[ev.k](g); } catch {}
      ev.next = t + rnd(ev.a, ev.b);
    }
    L.t = setTimeout(tick, 350);
  };
  L.t = setTimeout(tick, 350);
  return L;
}
function kill(L, ms = 900) {
  if (!L) return;
  L.alive = false; clearTimeout(L.t);
  try { L.g.gain.cancelScheduledValues(now()); L.g.gain.setTargetAtTime(0.0001, now(), ms / 4000); } catch {}
  setTimeout(() => { for (const n of L.nodes) try { n.stop(); } catch {} try { L.g.disconnect(); } catch {} }, ms + 200);
}
function restart() {
  if (!ctx || !active || !env || !soundOn()) { kill(cur); cur = null; return; }
  const k = `${env.place}|${env.set === "out" ? "out" : "in"}|${env.wx}|${env.tod}`;
  if (cur && cur.k === k) return;
  kill(cur);
  cur = build(env); cur.k = k;
}

/* ───────── Сыртқы API ───────── */
function unlock() {
  if (!active) return;
  if (!ensure()) return;
  if (soundOn() && ctx.state === "suspended" && !document.hidden) ctx.resume().catch(() => {});
  restart();
}
const onVis = () => {
  if (!ctx) return;
  if (document.hidden) { ctx.suspend().catch(() => {}); clearInterval(walkT); walkT = 0; }
  else if (active && soundOn()) ctx.resume().catch(() => {});
};
const GEST = ["pointerdown", "keydown", "touchend"];

// Сахнаға кіру: { place, wx, tod }
export function enter(o) {
  if (!W) return;
  active = true;
  env = { set: "out", ...o };
  if (/[?&]vrdebug/.test(W.location?.search || "")) W.__vrA = { _rms, cue, play, duck, setSound }; // тек тексеру үшін
  for (const ev of GEST) W.addEventListener(ev, unlock, { capture: true, passive: true });
  document.addEventListener("visibilitychange", onVis);
  if (ctx || W.navigator?.userActivation?.hasBeenActive) unlock();
}
export function leave() {
  active = false;
  clearInterval(walkT); walkT = 0;
  if (W) for (const ev of GEST) W.removeEventListener(ev, unlock, { capture: true });
  if (typeof document !== "undefined") document.removeEventListener("visibilitychange", onVis);
  kill(cur, 600); cur = null;
  if (duckG && ctx) duckG.gain.setTargetAtTime(1, now(), 0.1);
  if (ctx) setTimeout(() => { if (!active && ctx?.state === "running") ctx.suspend().catch(() => {}); }, 900);
}
// Сахна күйінің белгілері (VrLife): set — көше/іші, walk — қадам, dip — есіктен өту
export function cue({ set, walk, dip }) {
  if (!active || !env) return;
  if (set && set !== env.set) { env = { ...env, set }; if (ctx) restart(); }
  if (!ctx || !soundOn()) return;
  if (walk && !walkT && running()) { step(); walkT = setInterval(() => (running() ? step() : null), 320); }
  if (!walk && walkT) { clearInterval(walkT); walkT = 0; }
  if (dip && running() && performance.now() - lastDoor > 2500) { lastDoor = performance.now(); door(); }
}
function step() {
  const t = now();
  if (env.set === "out" && winter(env)) {
    for (let i = 0; i < 3; i++) burst(sfx, { n: "white", f: "bandpass", hz: rnd(1800, 3200), q: 0.9, t: t + i * 0.022, a: 0.004, d: 0.05, lv: 0.05 }); // қар сықыры
  } else {
    tone(sfx, { hz: 95, to: 50, t, a: 0.004, d: 0.08, lv: env.set === "out" ? 0.07 : 0.05 });
    burst(sfx, { n: "pink", f: "lowpass", hz: 700, t, a: 0.002, d: 0.04, lv: 0.03 });
  }
}
function door() {
  burst(sfx, { n: "pink", f: "bandpass", hz: 260, q: 0.8, a: 0.12, d: 0.45, to: 1300, lv: 0.06 });
}
// Кейіпкер не өзің сөйлегенде айнала ақырындайды
export function duck(on) {
  if (!ctx || !duckG) return;
  try { duckG.gain.setTargetAtTime(on ? 0.28 : 1, now(), on ? 0.06 : 0.45); } catch {}
}
// Ойын дыбыстары: ok — домбыраның екі шегі, bad — тұйық бір шек, win — шағын күй (жұлдыз саны бойынша)
export function play(k, arg) {
  if (!ctx || !soundOn() || !running()) return;
  const p = performance.now();
  if (p - (lastSfx[k] || 0) < 180) return;
  lastSfx[k] = p;
  const t = now() + 0.02;
  if (k === "ok") { pluck(sfx, N.G3, t, 0.12); pluck(sfx, N.D4, t + 0.09, 0.12); }
  else if (k === "bad") pluck(sfx, N.A2, t, 0.1, true);
  else if (k === "win") {
    const seq = ["D3", "A3", "D4", "E4", "G4"].slice(0, 2 + (arg || 1));
    seq.forEach((nm, i) => { pluck(sfx, N[nm], t + i * 0.14, 0.11); if (i === seq.length - 1) pluck(sfx, N.D4, t + i * 0.14 + 0.02, 0.08); });
  }
}
export function setSound(on) {
  try { localStorage.setItem(KEY, on ? "1" : "0"); } catch {}
  if (on && active) { unlock(); }
  if (!ctx) return;
  out.gain.setTargetAtTime(on ? 1 : 0, now(), 0.08);
  if (!on) { clearInterval(walkT); walkT = 0; }
  restart();
}

// Анализатор (ерін қозғалысы, микрофон толқыны): level() — 0…1
function analyse(srcNode, stopFn) {
  const a = ctx.createAnalyser(); a.fftSize = 512; a.smoothingTimeConstant = 0.5;
  srcNode.connect(a); a.connect(sink);
  const buf = new Float32Array(a.fftSize);
  return {
    level() {
      a.getFloatTimeDomainData(buf);
      let s = 0; for (let i = 0; i < buf.length; i++) s += buf[i] * buf[i];
      return Math.min(1, Math.sqrt(s / buf.length) * 7);
    },
    stop() { try { srcNode.disconnect(); a.disconnect(); } catch {} stopFn?.(); },
  };
}
// Ойнап тұрған <audio> дыбысының қаттылығы. captureStream шығысты өзгертпейді (дыбыс бұрынғыдай естіледі); жоқ болса — null
export function tap(el) {
  if (!el || typeof el.captureStream !== "function" || !ctx || ctx.state !== "running") return null;
  let ms;
  try { ms = el.captureStream(); } catch { return null; }
  let inner = null, dead = false;
  const hook = () => {
    if (dead || inner || !ms.getAudioTracks().length) return;
    try { inner = analyse(ctx.createMediaStreamSource(ms)); } catch {}
  };
  hook();
  if (!inner) ms.addEventListener?.("addtrack", hook);
  return {
    level: () => (inner ? inner.level() : -1),
    stop() { dead = true; ms.removeEventListener?.("addtrack", hook); inner?.stop(); },
  };
}
// Микрофон деңгейі (жазу кезіндегі толқын, үнсіздікте өзі тоқтау)
export function micMeter(stream) {
  if (!ensure()) return null;
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  try { return analyse(ctx.createMediaStreamSource(stream)); } catch { return null; }
}
// Тексеру үшін: шығыстың RMS деңгейі
export function _rms() {
  if (!meterA) return -1;
  const b = new Float32Array(meterA.fftSize); meterA.getFloatTimeDomainData(b);
  let s = 0, pk = 0; for (const x of b) { s += x * x; pk = Math.max(pk, Math.abs(x)); }
  return { rms: Math.sqrt(s / b.length), pk, state: ctx.state, env: cur?.k || null };
}
