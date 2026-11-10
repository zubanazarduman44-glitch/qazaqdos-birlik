"use client";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../Store";
import Alash from "../Alash";
import Icon from "../Icon";
import Frame, { Options, TopicPicker, useFinish, useQuestions } from "./Frame";

function Ready({ topic, setTopic, onStart, children }) {
  const { t } = useApp();
  return (
    <section className="card g-ready">
      {children}
      <h3>{t.topic}</h3>
      <TopicPicker topic={topic} setTopic={setTopic} />
      <button className="btn gold big" onClick={onStart}>
        {t.play} <Icon name="right" size={18} />
      </button>
    </section>
  );
}

/* ═════ Бәйге ═════ */
export function Baige({ game }) {
  const [topic, setTopic] = useState("all");
  const [phase, setPhase] = useState("ready");
  const [pos, setPos] = useState([0, 0, 0, 0]);
  const [q, setQ] = useState(null);
  const [picked, setPicked] = useState(null);
  const [right, setRight] = useState(0);
  const [result, setResult] = useState(null);
  const speeds = useRef([0, 0, 0, 0]);
  const nextQ = useQuestions(topic);
  const { finish, reset } = useFinish(game.id);
  const { t } = useApp();

  function start() {
    reset();
    speeds.current = [0, 0.26 + Math.random() * 0.08, 0.22 + Math.random() * 0.08, 0.3 + Math.random() * 0.08];
    setPos([0, 0, 0, 0]);
    setRight(0);
    setQ(nextQ());
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
      finish(win, right);
      setResult({ win, text: t.score(right, right) });
    }
  }, [pos, phase]);

  function pick(k) {
    setPicked(k);
    const ok = k === q.answer;
    if (ok) setRight((r) => r + 1);
    setPos((p) => [Math.max(0, Math.min(100, p[0] + (ok ? 9 : -2))), ...p.slice(1)]);
    setTimeout(() => {
      setQ(nextQ());
      setPicked(null);
    }, ok ? 350 : 700);
  }

  return (
    <Frame game={game} result={result} onRestart={start}>
      {phase === "ready" ? (
        <Ready topic={topic} setTopic={setTopic} onStart={start}>
          <div className="g-hero">🏇🏇🏇🏇</div>
        </Ready>
      ) : (
        <>
          <section className="card track">
            {pos.map((v, i) => (
              <div key={i} className={`lane ${i === 0 ? "me" : ""}`}>
                <span className="lane-n">{i === 0 ? "★" : i}</span>
                <span className="lane-run">
                  <span className="horse" style={{ left: `calc(${v}% - ${v * 0.36}px)` }}>
                    🏇
                  </span>
                </span>
                <span className="finish">🏁</span>
              </div>
            ))}
          </section>
          {q && (
            <section className="card g-q">
              <h3 className="g-prompt">
                {q.word.e} <b>{q.prompt}</b>
              </h3>
              <Options q={q} picked={picked} onPick={pick} />
            </section>
          )}
        </>
      )}
    </Frame>
  );
}

/* ═════ Арқан тартыс ═════ */
export function Arkan({ game }) {
  const [topic, setTopic] = useState("all");
  const [phase, setPhase] = useState("ready");
  const [v, setV] = useState(0);
  const [time, setTime] = useState(90);
  const [q, setQ] = useState(null);
  const [picked, setPicked] = useState(null);
  const [right, setRight] = useState(0);
  const [result, setResult] = useState(null);
  const nextQ = useQuestions(topic);
  const { finish, reset } = useFinish(game.id);
  const { t } = useApp();

  function start() {
    reset();
    setV(0);
    setTime(90);
    setRight(0);
    setQ(nextQ());
    setPicked(null);
    setResult(null);
    setPhase("run");
  }
  useEffect(() => {
    if (phase !== "run") return;
    const pull = setInterval(() => setV((x) => x - (5 + Math.random() * 4)), 1000);
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
      finish(win, right);
      setResult({ win, draw: time <= 0 && Math.round(v) === 0, text: t.score(right, right) });
    }
  }, [v, time, phase]);

  function pick(k) {
    setPicked(k);
    const ok = k === q.answer;
    if (ok) setRight((r) => r + 1);
    setV((x) => Math.min(100, x + (ok ? 17 : -6)));
    setTimeout(() => {
      setQ(nextQ());
      setPicked(null);
    }, ok ? 300 : 650);
  }
  const shift = Math.max(-100, Math.min(100, v));

  return (
    <Frame game={game} result={result} onRestart={start}>
      {phase === "ready" ? (
        <Ready topic={topic} setTopic={setTopic} onStart={start}>
          <div className="g-hero">💪🪢🐺</div>
        </Ready>
      ) : (
        <>
          <section className="card tug">
            <div className="tug-top">
              <span className="chip">⏱ {time}</span>
            </div>
            <div className="tug-field">
              <div className="tug-team me">
                <Alash mood={shift > 20 ? "cheer" : shift < -40 ? "support" : "happy"} size={84} />
              </div>
              <div className="tug-rope">
                <span className="tug-mark left" />
                <span className="tug-mark right" />
                <span className="tug-line" style={{ transform: `translateX(${-shift * 0.42}%)` }}>
                  <span className="tug-flag">🎀</span>
                </span>
              </div>
              <div className="tug-team them">🐺</div>
            </div>
          </section>
          {q && (
            <section className="card g-q">
              <h3 className="g-prompt">
                {q.word.e} <b>{q.prompt}</b>
              </h3>
              <Options q={q} picked={picked} onPick={pick} />
            </section>
          )}
        </>
      )}
    </Frame>
  );
}

/* ═════ Асық ату ═════ */
function AsykSvg({ down }) {
  return (
    <svg viewBox="0 0 60 44" className={`asyk ${down ? "down" : ""}`} aria-hidden="true">
      <path d="M8 22c0-10 6-16 14-14 4 1 6 3 8 3s4-2 8-3c8-2 14 4 14 14s-6 16-14 14c-4-1-6-3-8-3s-4 2-8 3C14 38 8 32 8 22Z" fill="#f1d9a7" stroke="#b98a3e" strokeWidth="2.5" />
      <path d="M24 16c3 3 9 3 12 0M24 28c3-3 9-3 12 0" stroke="#b98a3e" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function Asyk({ game }) {
  const ROUNDS = 5;
  const [topic, setTopic] = useState("all");
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

  function start() {
    reset();
    setRound(0);
    setHits([]);
    setResult(null);
    setQ(nextQ());
    setPicked(null);
    setMsg("");
    setPhase("ask");
  }
  useEffect(() => {
    if (phase !== "aim") return;
    const t0 = performance.now();
    const speed = 1.6 + round * 0.25;
    const loop = (now) => {
      setPower(50 + 50 * Math.sin(((now - t0) / 1000) * speed * Math.PI));
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [phase, round]);

  function endRound(hit) {
    const nh = [...hits, hit];
    setHits(nh);
    setPhase("shot");
    setTimeout(() => {
      if (nh.length >= ROUNDS) {
        const n = nh.filter(Boolean).length;
        const win = n >= 3;
        finish(win, n);
        setResult({ win, text: `${n} / ${ROUNDS} 🦴` });
        setPhase("end");
      } else {
        setRound(nh.length);
        setQ(nextQ());
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
        const w = 22 - round * 2;
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
    setMsg(hit ? "💥 " + t.correct : "💨");
    endRound(hit);
  }

  return (
    <Frame game={game} result={result} onRestart={start}>
      {phase === "ready" ? (
        <Ready topic={topic} setTopic={setTopic} onStart={start}>
          <div className="g-hero asyk-row">
            {[0, 1, 2, 3, 4].map((i) => (
              <AsykSvg key={i} />
            ))}
          </div>
        </Ready>
      ) : (
        <>
          <section className="card asyk-field">
            <div className="asyk-row">
              {Array.from({ length: ROUNDS }, (_, i) => (
                <AsykSvg key={i} down={hits[i] === true} />
              ))}
            </div>
            <div className="asyk-info">
              <span className="chip">
                {Math.min(round + 1, ROUNDS)} / {ROUNDS}
              </span>
              {msg && <b className="pop">{msg}</b>}
            </div>
            {phase === "aim" && (
              <div className="aim rise">
                <div className="power">
                  <span className="zone" style={{ left: `${zone[0]}%`, width: `${zone[1] - zone[0]}%` }} />
                  <span className="needle" style={{ left: `${power}%` }} />
                </div>
                <button className="btn gold big" onClick={shoot} autoFocus>
                  🎯 {t.throwBtn}
                </button>
              </div>
            )}
          </section>
          {phase === "ask" && q && (
            <section className="card g-q">
              <h3 className="g-prompt">
                {q.word.e} <b>{q.prompt}</b>
              </h3>
              <Options q={q} picked={picked} onPick={pick} />
            </section>
          )}
        </>
      )}
    </Frame>
  );
}
