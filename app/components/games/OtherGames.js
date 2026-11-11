"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "../Store";
import Qyran from "../Qyran";
import Icon from "../Icon";
import Frame, { TopicPicker, useFinish, useQuestions } from "./Frame";
import { shuffle, tr, wordsByTopic } from "../../../lib/words";

/* ═════ Теңге ілу ═════ */
export function Tenge({ game }) {
  const GOAL = 10;
  const [topic, setTopic] = useState("all");
  const [phase, setPhase] = useState("ready");
  const [lane, setLane] = useState(1);
  const [wave, setWave] = useState(null); // { q, y, t0, dur }
  const [got, setGot] = useState(0);
  const [lives, setLives] = useState(3);
  const [flash, setFlash] = useState(null);
  const [result, setResult] = useState(null);
  const laneRef = useRef(1);
  const raf = useRef(0);
  const nextQ = useQuestions(topic);
  const { finish, reset } = useFinish(game.id);
  const { t } = useApp();

  const newWave = useCallback(
    (n) => {
      const q = nextQ({ reverse: true });
      setWave({ q, t0: performance.now(), dur: Math.max(2600, 4600 - n * 180) });
    },
    [nextQ]
  );

  function start() {
    reset();
    setGot(0);
    setLives(3);
    setResult(null);
    laneRef.current = 1;
    setLane(1);
    setPhase("run");
    newWave(0);
  }
  const move = useCallback((d) => {
    laneRef.current = Math.max(0, Math.min(3, laneRef.current + d));
    setLane(laneRef.current);
  }, []);
  const goTo = (i) => {
    laneRef.current = i;
    setLane(i);
  };

  useEffect(() => {
    if (phase !== "run") return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, move]);

  const [y, setY] = useState(0);
  useEffect(() => {
    if (phase !== "run" || !wave) return;
    let done = false;
    const loop = (now) => {
      const p = (now - wave.t0) / wave.dur;
      setY(Math.min(1, p));
      if (p >= 1 && !done) {
        done = true;
        const caught = wave.q.options[laneRef.current];
        const ok = caught?.key === wave.q.answer;
        setFlash({ ok, lane: laneRef.current });
        const ng = got + (ok ? 1 : 0);
        const nl = lives - (ok ? 0 : 1);
        setGot(ng);
        setLives(nl);
        setTimeout(() => {
          setFlash(null);
          if (ng >= GOAL || nl <= 0) {
            setPhase("end");
            const win = ng >= GOAL;
            finish(win, ng);
            setResult({ win, text: `🪙 ${ng} / ${GOAL}` });
          } else newWave(ng);
        }, 650);
        return;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [wave, phase]);

  return (
    <Frame game={game} result={result} onRestart={start}>
      {phase === "ready" ? (
        <section className="card g-ready">
          <div className="g-hero">🏇🪙</div>
          <h3>{t.topic}</h3>
          <TopicPicker topic={topic} setTopic={setTopic} />
          <button className="btn gold big" onClick={start}>
            {t.play} <Icon name="right" size={18} />
          </button>
        </section>
      ) : (
        <section className="card tenge">
          <div className="tenge-top">
            <span className="chip">🪙 {got} / {GOAL}</span>
            <span className="tenge-ask">
              {t.catchWord} <b>{wave?.q.prompt}</b>
            </span>
            <span className="chip">{"❤️".repeat(Math.max(0, lives))}</span>
          </div>
          <div className="tenge-field">
            {[0, 1, 2, 3].map((i) => (
              <button key={i} className={`tenge-lane ${flash?.lane === i ? (flash.ok ? "ok" : "bad") : ""}`} onClick={() => goTo(i)} aria-label={`lane ${i + 1}`}>
                {wave && (
                  <span className="coin" style={{ top: `calc(${y * 100}% - ${y * 64}px)` }}>
                    {wave.q.options[i]?.label}
                  </span>
                )}
              </button>
            ))}
            <span className="rider" style={{ left: `calc(${lane * 25}% + 12.5% - 28px)` }}>
              🏇
            </span>
          </div>
          <div className="tenge-ctrl">
            <button className="btn ghost big" onClick={() => move(-1)} aria-label="left">
              <Icon name="left" size={22} />
            </button>
            <button className="btn ghost big" onClick={() => move(1)} aria-label="right">
              <Icon name="right" size={22} />
            </button>
          </div>
        </section>
      )}
    </Frame>
  );
}

/* ═════ Бес тас (есте сақтау) ═════ */
export function BesTas({ game }) {
  const [topic, setTopic] = useState("all");
  const [phase, setPhase] = useState("ready");
  const [cards, setCards] = useState([]);
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [result, setResult] = useState(null);
  const { finish, reset } = useFinish(game.id);
  const { t, explain } = useApp();

  function start() {
    reset();
    const ws = shuffle(wordsByTopic(topic)).slice(0, 5);
    const cs = shuffle(ws.flatMap((w) => [
      { id: `${w.kk}-a`, pair: w.kk, face: w.kk, kind: "kk" },
      { id: `${w.kk}-b`, pair: w.kk, face: tr(w, explain), e: w.e, kind: "tr" },
    ]));
    setCards(cs);
    setOpen([]);
    setMatched([]);
    setMoves(0);
    setResult(null);
    setPhase("run");
  }
  function flip(c) {
    if (open.length === 2 || open.includes(c.id) || matched.includes(c.pair)) return;
    const o = [...open, c.id];
    setOpen(o);
    if (o.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = o.map((id) => cards.find((x) => x.id === id));
      if (a.pair === b.pair) {
        const nm = [...matched, a.pair];
        setTimeout(() => {
          setMatched(nm);
          setOpen([]);
          if (nm.length === 5) {
            const score = Math.max(10, 100 - (moves + 1 - 5) * 8);
            finish(true, score);
            setResult({ win: true, text: `${t.moves}: ${moves + 1}` });
            setPhase("end");
          }
        }, 450);
      } else setTimeout(() => setOpen([]), 900);
    }
  }

  return (
    <Frame game={game} result={result} onRestart={start}>
      {phase === "ready" ? (
        <section className="card g-ready">
          <div className="g-hero">🪨🪨🪨🪨🪨</div>
          <h3>{t.topic}</h3>
          <TopicPicker topic={topic} setTopic={setTopic} />
          <button className="btn gold big" onClick={start}>
            {t.play} <Icon name="right" size={18} />
          </button>
        </section>
      ) : (
        <section className="card bestas">
          <div className="tenge-top">
            <span className="chip">
              {t.pairs}: {matched.length} / 5
            </span>
            <span className="chip">
              {t.moves}: {moves}
            </span>
          </div>
          <div className="stones">
            {cards.map((c) => {
              const up = open.includes(c.id) || matched.includes(c.pair);
              return (
                <button key={c.id} className={`stone ${up ? "up" : ""} ${matched.includes(c.pair) ? "done" : ""}`} onClick={() => flip(c)}>
                  <span className="stone-in">
                    <span className="stone-back">🪨</span>
                    <span className={`stone-face ${c.kind}`}>
                      {c.e && <span className="stone-e">{c.e}</span>}
                      {c.face}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </Frame>
  );
}
