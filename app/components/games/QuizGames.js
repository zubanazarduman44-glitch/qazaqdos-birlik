"use client";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../Store";
import Qyran from "../Qyran";
import Icon from "../Icon";
import Frame, { AsykBone, Burst, Clock, FinishPost, Goat, Horse, KazanGoal, QPanel, Ready, TimeBar, Wolf, useFinish, useQuestions, useTx } from "./Frame";

// Жеңіс жұлдыздары (тек көрініс үшін, ұпайға әсер етпейді)
const accStars = (win, right, asked) => {
  if (!win) return 0;
  const a = right / Math.max(1, asked);
  return a >= 0.9 ? 3 : a >= 0.7 ? 2 : 1;
};

const RACERS = [
  { coat: "#7A4A22", mane: "#2B1A10", rider: "#0F5E7A", cloth: "#E0A526" },
  { coat: "#3B2A20", mane: "#1A120C", rider: "#A63A2B", cloth: "#1E8A8A" },
  { coat: "#B07A3A", mane: "#5A3A1A", rider: "#2F6B4F", cloth: "#A63A2B" },
  { coat: "#8E8A80", mane: "#4A4A4A", rider: "#1E8A8A", cloth: "#0F5E7A" },
];

/* ═════ Бәйге ═════ */
export function Baige({ game }) {
  const [topic, setTopic] = useState("all");
  const [level, setLevel] = useState(1);
  const hard = () => (level === 3 ? { reverse: Math.random() < 0.5 } : {});
  const [phase, setPhase] = useState("ready");
  const [pos, setPos] = useState([0, 0, 0, 0]);
  const [q, setQ] = useState(null);
  const [picked, setPicked] = useState(null);
  const [right, setRight] = useState(0);
  const [result, setResult] = useState(null);
  const asked = useRef(0);
  const speeds = useRef([0, 0, 0, 0]);
  const nextQ = useQuestions(topic);
  const { finish, reset } = useFinish(game.id);
  const { t } = useApp();
  const tx = useTx();

  function start() {
    reset();
    asked.current = 0;
    const m = [0.78, 1, 1.32][level - 1];
    speeds.current = [0, (0.26 + Math.random() * 0.08) * m, (0.22 + Math.random() * 0.08) * m, (0.3 + Math.random() * 0.08) * m];
    setPos([0, 0, 0, 0]);
    setRight(0);
    setQ(nextQ(hard()));
    setPicked(null);
    setResult(null);
    setPhase("run");
  }

  useEffect(() => {
    if (phase !== "run") return;
    const id = setInterval(() => {
      setPos((p) => p.map((v, i) => (i === 0 ? v : Math.min(100, v + speeds.current[i] * (0.7 + Math.random() * 0.6)))));
    }, 100);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "run") return;
    const lead = pos.findIndex((v) => v >= 100);
    if (lead !== -1) {
      setPhase("end");
      const win = lead === 0;
      finish(win, right, level);
      setResult({ win, text: t.score(right, Math.max(asked.current, right)), stars: accStars(win, right, asked.current) });
    }
  }, [pos, phase]);

  function pick(k) {
    setPicked(k);
    const ok = k === q.answer;
    asked.current += 1;
    if (ok) setRight((r) => r + 1);
    setPos((p) => [Math.max(0, Math.min(100, p[0] + (ok ? 9 : -2))), ...p.slice(1)]);
    setTimeout(() => {
      setQ(nextQ(hard()));
      setPicked(null);
    }, ok ? 350 : 700);
  }

  const place = 1 + pos.slice(1).filter((x) => x > pos[0]).length;
  const fx = picked ? (picked === q?.answer ? "boost" : "stumble") : "";
  return (
    <Frame game={game} result={result} onRestart={start}>
      {phase === "ready" ? (
        <Ready game={game} topic={topic} setTopic={setTopic} onStart={start} level={level} setLevel={setLevel} />
      ) : (
        <>
          <section className="card track">
            <div className="track-top">
              <span className={`chip g-place p${place}`} key={place}>
                <Icon name="trophy" size={15} /> {tx.place(place)}
              </span>
              <span className="track-fin">{tx.finish}</span>
            </div>
            {pos.map((v, i) => (
              <div key={i} className={`lane ${i === 0 ? `me ${fx}` : ""}`}>
                <span className="lane-n" style={{ "--rc": RACERS[i].rider }}>{i === 0 ? tx.you : i}</span>
                <span className="lane-run">
                  <span className="lane-slot" style={{ transform: `translateX(calc(${v}% - ${v / 100} * var(--hw)))` }}>
                    <span className="lane-horse">
                      <Horse {...RACERS[i]} />
                    </span>
                    {i === 0 && fx === "boost" && <Burst n={8} className="small" key={asked.current} />}
                  </span>
                </span>
                <FinishPost />
              </div>
            ))}
          </section>
          {q && <QPanel q={q} picked={picked} onPick={pick} />}
        </>
      )}
    </Frame>
  );
}

/* ═════ Арқан тартыс ═════ */
export function Arkan({ game }) {
  const [topic, setTopic] = useState("all");
  const [level, setLevel] = useState(1);
  const hard = () => (level === 3 ? { reverse: Math.random() < 0.5 } : {});
  const [phase, setPhase] = useState("ready");
  const [v, setV] = useState(0);
  const [time, setTime] = useState(30);
  const [q, setQ] = useState(null);
  const [picked, setPicked] = useState(null);
  const [right, setRight] = useState(0);
  const [result, setResult] = useState(null);
  const asked = useRef(0);
  const nextQ = useQuestions(topic);
  const { finish, reset } = useFinish(game.id);
  const { t } = useApp();
  const tx = useTx();

  function start() {
    reset();
    asked.current = 0;
    setV(0);
    setTime([36, 30, 24][level - 1]);
    setRight(0);
    setQ(nextQ(hard()));
    setPicked(null);
    setResult(null);
    setPhase("run");
  }
  useEffect(() => {
    if (phase !== "run") return;
    const pull = setInterval(() => setV((x) => x - (5 + Math.random() * 4) * [0.75, 1, 1.4][level - 1]), 1000);
    const clock = setInterval(() => setTime((s) => s - 1), 1000);
    return () => {
      clearInterval(pull);
      clearInterval(clock);
    };
  }, [phase]);
  useEffect(() => {
    if (phase !== "run") return;
    if (v >= 100 || v <= -100 || time <= 0) {
      setPhase("end");
      const win = v >= 100 || (time <= 0 && v > 0);
      finish(win, right, level);
      setResult({ win, draw: time <= 0 && Math.round(v) === 0, text: t.score(right, Math.max(asked.current, right)), stars: accStars(win, right, asked.current) });
    }
  }, [v, time, phase]);

  function pick(k) {
    setPicked(k);
    const ok = k === q.answer;
    asked.current += 1;
    if (ok) setRight((r) => r + 1);
    setV((x) => Math.min(100, x + (ok ? 17 : -6)));
    setTimeout(() => {
      setQ(nextQ(hard()));
      setPicked(null);
    }, ok ? 300 : 650);
  }
  const shift = Math.max(-100, Math.min(100, v));
  const total = [36, 30, 24][level - 1];
  const fx = picked ? (picked === q?.answer ? "pull-me" : "pull-them") : "";

  return (
    <Frame game={game} result={result} onRestart={start}>
      {phase === "ready" ? (
        <Ready game={game} topic={topic} setTopic={setTopic} onStart={start} level={level} setLevel={setLevel} />
      ) : (
        <>
          <section className={`card tug ${fx} ${shift > 40 ? "near-me" : shift < -40 ? "near-them" : ""}`}>
            <div className="tug-top">
              <span className="chip tug-side me">{tx.you}</span>
              <span className={`chip g-tchip-time ${time / total < 0.3 ? "low" : ""}`}>
                <Clock /> {Math.max(0, time)}
              </span>
              <span className="chip tug-side them">{tx.rival}</span>
            </div>
            <div className="tug-field">
              <div className="tug-team me">
                <Qyran mood={shift > 20 ? "cheer" : shift < -40 ? "support" : "happy"} size={84} />
              </div>
              <div className="tug-rope">
                <span className="tug-zone left" />
                <span className="tug-zone right" />
                <span className="tug-mid" />
                <span className="tug-line" style={{ transform: `translateX(${-shift * 0.21}%)` }}>
                  <span className="tug-rope-in" />
                  <span className="tug-flag">
                    <svg viewBox="0 0 24 40" aria-hidden="true" focusable="false">
                      <path d="M12 6L4 30H20Z" fill="#A63A2B" />
                      <circle cx="12" cy="8" r="6.5" fill="#E0A526" />
                      <path d="M7 30V37M12 30V39M17 30V37" stroke="#A63A2B" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                  </span>
                </span>
              </div>
              <div className="tug-team them">
                <Wolf />
              </div>
            </div>
            <TimeBar frac={time / total} label={tx.time} />
          </section>
          {q && <QPanel q={q} picked={picked} onPick={pick} />}
        </>
      )}
    </Frame>
  );
}

/* ═════ Асық ату ═════ */
export function Asyk({ game }) {
  const ROUNDS = 5;
  const [topic, setTopic] = useState("all");
  const [level, setLevel] = useState(1);
  const hard = () => (level === 3 ? { reverse: Math.random() < 0.5 } : {});
  const [phase, setPhase] = useState("ready"); // ready | ask | aim | shot | end
  const [round, setRound] = useState(0);
  const [hits, setHits] = useState([]);
  const [q, setQ] = useState(null);
  const [picked, setPicked] = useState(null);
  const [power, setPower] = useState(0);
  const [zone, setZone] = useState([40, 62]);
  const [msg, setMsg] = useState("");
  const [result, setResult] = useState(null);
  const raf = useRef(0);
  const nextQ = useQuestions(topic);
  const { finish, reset } = useFinish(game.id);
  const { t } = useApp();
  const tx = useTx();

  function start() {
    reset();
    setRound(0);
    setHits([]);
    setResult(null);
    setQ(nextQ(hard()));
    setPicked(null);
    setMsg("");
    setPhase("ask");
  }
  useEffect(() => {
    if (phase !== "aim") return;
    const t0 = performance.now();
    const speed = (1.6 + round * 0.25) * [0.8, 1, 1.35][level - 1];
    const loop = (now) => {
      setPower(50 + 50 * Math.sin(((now - t0) / 1000) * speed * Math.PI));
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [phase, round, level]);

  function endRound(hit) {
    const nh = [...hits, hit];
    setHits(nh);
    setPhase("shot");
    setTimeout(() => {
      if (nh.length >= ROUNDS) {
        const n = nh.filter(Boolean).length;
        const win = n >= 3;
        finish(win, n, level);
        setResult({ win, text: `${n} / ${ROUNDS}`, stars: n >= 5 ? 3 : n >= 4 ? 2 : n >= 3 ? 1 : 0 });
        setPhase("end");
      } else {
        setRound(nh.length);
        setQ(nextQ(hard()));
        setPicked(null);
        setMsg("");
        setPhase("ask");
      }
    }, 1100);
  }
  function pick(k) {
    setPicked(k);
    if (k === q.answer) {
      setTimeout(() => {
        const w = [30, 22, 15][level - 1] - round * 2;
        const s = 12 + Math.random() * (76 - w);
        setZone([s, s + w]);
        setPhase("aim");
      }, 450);
    } else {
      setMsg(t.wrong);
      setTimeout(() => endRound(false), 700);
    }
  }
  function shoot() {
    cancelAnimationFrame(raf.current);
    const hit = power >= zone[0] && power <= zone[1];
    setMsg(hit ? t.correct : tx.missed);
    endRound(hit);
  }

  const last = hits.length - 1;
  const thrown = phase === "shot" && msg !== t.wrong;
  const inZone = power >= zone[0] && power <= zone[1];
  return (
    <Frame game={game} result={result} onRestart={start}>
      {phase === "ready" ? (
        <Ready game={game} topic={topic} setTopic={setTopic} onStart={start} level={level} setLevel={setLevel} />
      ) : (
        <>
          <section className={`card asyk-field ph-${phase}`}>
            <div className="asyk-info">
              <span className="asyk-pips" aria-label={`${tx.round} ${Math.min(round + 1, ROUNDS)} / ${ROUNDS}`}>
                {Array.from({ length: ROUNDS }, (_, i) => (
                  <i key={i} className={hits[i] === true ? "hit" : hits[i] === false ? "miss" : i === round ? "cur" : ""} />
                ))}
              </span>
              {msg && (
                <b className={`asyk-msg ${hits[last] ? "ok" : "bad"}`} key={msg + hits.length}>
                  {msg}
                </b>
              )}
            </div>
            <div className="asyk-ring">
              <div className="asyk-row">
                {Array.from({ length: ROUNDS }, (_, i) => (
                  <span key={i} className={`asyk-t ${hits[i] === true ? "down" : ""} ${thrown && i === last ? "now" : ""} ${i === round && phase !== "shot" ? "target" : ""}`}>
                    <AsykBone />
                    {thrown && i === last && hits[i] && <Burst n={10} />}
                  </span>
                ))}
              </div>
              <span className={`asyk-saka ${thrown ? (hits[last] ? "fly-hit" : "fly-miss") : phase === "aim" ? "ready" : ""}`} style={{ "--i": Math.max(0, thrown ? last : round) }} key={`${round}-${thrown}`}>
                <AsykBone saka />
              </span>
            </div>
            {phase === "aim" && (
              <div className="aim rise">
                <div className={`power ${inZone ? "in" : ""}`}>
                  <span className="zone" style={{ left: `${zone[0]}%`, width: `${zone[1] - zone[0]}%` }} />
                  <span className="needle-slot" style={{ transform: `translateX(${power}%)` }}>
                    <span className="needle" />
                  </span>
                </div>
                <button className="btn gold big" onClick={shoot} autoFocus>
                  <Icon name="target" size={18} /> {t.throwBtn}
                </button>
              </div>
            )}
          </section>
          {phase === "ask" && q && <QPanel q={q} picked={picked} onPick={pick} />}
        </>
      )}
    </Frame>
  );
}

/* ═════ Көкпар ═════ */
export function Kokpar({ game }) {

  const [topic, setTopic] = useState("all");
  const [level, setLevel] = useState(1);
  const hard = () => (level === 3 ? { reverse: Math.random() < 0.5 } : {});
  const GOALS = [2, 3, 3][level - 1], STEPS = [3, 4, 4][level - 1], SEC = [8, 5, 3][level - 1];
  const [phase, setPhase] = useState("ready");
  const [pos, setPos] = useState(0); // -STEPS..STEPS : оң жаққа қарай — біздің ұпай
  const [me, setMe] = useState(0);
  const [them, setThem] = useState(0);
  const [q, setQ] = useState(null);
  const [picked, setPicked] = useState(null);
  const [left, setLeft] = useState(SEC);
  const [burst, setBurst] = useState(null);
  const [right, setRight] = useState(0);
  const [result, setResult] = useState(null);
  const nextQ = useQuestions(topic);
  const { finish, reset } = useFinish(game.id);
  const { t } = useApp();
  const tx = useTx();
  const lock = useRef(false);

  function start() {
    reset();
    setPos(0); setMe(0); setThem(0); setRight(0); setPicked(null); setResult(null); setBurst(null);
    setQ(nextQ(hard())); setLeft(SEC); lock.current = false;
    setPhase("run");
  }
  function move(d) {
    lock.current = true;
    let p = pos + d, m = me, th = them, goal = null;
    if (p >= STEPS) { m += 1; p = 0; goal = "me"; }
    if (p <= -STEPS) { th += 1; p = 0; goal = "them"; }
    setPos(p);
    if (goal) { setMe(m); setThem(th); setBurst({ who: goal, k: Date.now() }); }
    setTimeout(() => {
      if (m >= GOALS || th >= GOALS) {
        const win = m >= GOALS;
        finish(win, right, level);
        setResult({ win, text: `${m} : ${th}`, stars: !win ? 0 : th === 0 ? 3 : m - th >= 2 ? 2 : 1 });
        setPhase("end");
        return;
      }
      setQ(nextQ(hard())); setPicked(null); setLeft(SEC); setBurst(null); lock.current = false;
    }, goal ? 1100 : ok0(d) ? 450 : 800);
  }
  const ok0 = (d) => d > 0;
  function pick(k) {
    if (lock.current) return;
    setPicked(k);
    const ok = k === q.answer;
    if (ok) setRight((r) => r + 1);
    move(ok ? 1 : -1);
  }
  useEffect(() => {
    if (phase !== "run") return;
    const id = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [phase]);
  useEffect(() => {
    if (phase === "run" && left <= 0 && !lock.current) { setPicked("__time"); move(-1); }
  }, [left, phase]);

  const pct = 50 + (pos / STEPS) * 38;
  const fx = picked ? (picked === q?.answer ? "push-me" : "push-them") : "";
  return (
    <Frame game={game} result={result} onRestart={start}>
      {phase === "ready" ? (
        <Ready game={game} topic={topic} setTopic={setTopic} onStart={start} level={level} setLevel={setLevel} />
      ) : (
        <>
          <section className={`card kokpar ${fx} ${burst ? `goal-${burst.who}` : ""}`}>
            <div className="kk-score">
              <span className="chip kk-team me"><i /> {tx.you} <b key={me}>{me}</b></span>
              <span className={`chip g-tchip-time ${left / SEC < 0.3 ? "low" : ""}`}><Clock /> {Math.max(0, left)}</span>
              <span className="chip kk-team them"><b key={them}>{them}</b> {tx.rival} <i /></span>
            </div>
            <div className="kk-field">
              <span className="kk-ground" />
              <div className="kk-goal l"><KazanGoal color="#A63A2B" /></div>
              <div className="kk-goal r"><KazanGoal color="#0F5E7A" /></div>
              <div className="kk-mid" />
              <div className="kk-slot" style={{ transform: `translateX(${pct}%)` }}>
                <span className="kk-dust" />
                <span className="kk-rider me"><Horse rider="#0F5E7A" cloth="#E0A526" /></span>
                <span className="kk-goat"><Goat /></span>
                <span className="kk-rider them"><Horse coat="#3B2A20" mane="#1A120C" rider="#A63A2B" cloth="#1E8A8A" /></span>
              </div>
              {burst && (
                <div key={burst.k} className={`kk-burst ${burst.who}`}>
                  {burst.who === "me" && <Burst n={14} className="big" />}
                  <b>{burst.who === "me" ? tx.goal : tx.rivalGoal}</b>
                </div>
              )}
            </div>
            <TimeBar frac={left / SEC} label={tx.time} />
          </section>
          {q && <QPanel q={q} picked={picked} onPick={pick} />}
        </>
      )}
    </Frame>
  );
}
