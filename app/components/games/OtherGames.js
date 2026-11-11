"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "../Store";
import Icon from "../Icon";
import Frame, { Burst, CoinIcon, Heart, Horse, Muiz, Ready, useFinish, useQuestions, useTx } from "./Frame";
import { shuffle, tr, wordsByTopic } from "../../../lib/words";

/* ═════ Теңге ілу ═════ */
export function Tenge({ game }) {
  const GOAL = 10;
  const [topic, setTopic] = useState("all");
  const [level, setLevel] = useState(1);
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
  const tx = useTx();
  const maxLives = [4, 3, 2][level - 1];

  const newWave = useCallback(
    (n) => {
      const q = nextQ({ reverse: level === 1 ? true : level === 2 ? true : Math.random() < 0.5 });
      setWave({ q, t0: performance.now(), dur: Math.max(1800, (4600 - n * 180) * [1.25, 1, 0.72][level - 1]) });
    },
    [nextQ, level]
  );

  function start() {
    reset();
    setGot(0);
    setLives([4, 3, 2][level - 1]);
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
            finish(win, ng, level);
            setResult({ win, text: `${ng} / ${GOAL}`, stars: !win ? 0 : nl >= [4, 3, 2][level - 1] ? 3 : nl >= [4, 3, 2][level - 1] - 1 ? 2 : 1 });
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
        <Ready game={game} topic={topic} setTopic={setTopic} onStart={start} level={level} setLevel={setLevel} />
      ) : (
        <section className={`card tenge ${flash ? (flash.ok ? "caught" : "dropped") : ""}`}>
          <div className="tenge-top">
            <span className="chip tenge-count">
              <CoinIcon /> <b key={got}>{got}</b> / {GOAL}
            </span>
            <span className="tenge-ask" key={wave?.q.answer}>
              {t.catchWord} <b>{wave?.q.prompt}</b>
            </span>
            <span className="chip tenge-lives" aria-label={`${t.lives}: ${Math.max(0, lives)}`}>
              {Array.from({ length: maxLives }, (_, i) => (
                <Heart key={i} on={i < lives} />
              ))}
            </span>
          </div>
          <div className="tenge-field" style={{ "--y": y }}>
            <span className="tenge-ground" aria-hidden="true" />
            {[0, 1, 2, 3].map((i) => {
              const fl = flash?.lane === i ? (flash.ok ? "ok" : "bad") : "";
              return (
                <button key={i} className={`tenge-lane ${fl} ${lane === i ? "here" : ""}`} onClick={() => goTo(i)} aria-label={`${tx.lane(i + 1)}${wave ? `: ${wave.q.options[i]?.label || ""}` : ""}`}>
                  {wave && (
                    <span className={`coin ${flash ? (wave.q.options[i]?.key === wave.q.answer ? "good" : "gone") : ""} ${fl}`} key={wave.t0}>
                      <span className="coin-in">{wave.q.options[i]?.label}</span>
                    </span>
                  )}
                  {fl === "ok" && <Burst n={12} className="low" />}
                </button>
              );
            })}
            <span className="rider-slot" style={{ transform: `translateX(${lane * 100}%)` }}>
              <span className={`rider ${flash ? (flash.ok ? "ok" : "bad") : ""}`}>
                <Horse coat="#3B2A20" mane="#1A120C" rider="#A63A2B" cloth="#1E8A8A" />
              </span>
            </span>
          </div>
          <div className="tenge-ctrl">
            <button className="btn ghost big" onClick={() => move(-1)} aria-label={tx.left}>
              <Icon name="left" size={22} />
            </button>
            <button className="btn ghost big" onClick={() => move(1)} aria-label={tx.right}>
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
  const [level, setLevel] = useState(1);
  const pairs = [4, 5, 6][level - 1];
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
    const ws = shuffle(wordsByTopic(topic)).slice(0, pairs);
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
          if (nm.length === pairs) {
            const score = Math.max(10, 100 - (moves + 1 - pairs) * 8);
            finish(true, score, level);
            const extra = moves + 1 - pairs;
            setResult({ win: true, text: `${t.moves}: ${moves + 1}`, stars: extra <= 1 ? 3 : extra <= 4 ? 2 : 1 });
            setPhase("end");
          }
        }, 450);
      } else setTimeout(() => setOpen([]), 900);
    }
  }

  return (
    <Frame game={game} result={result} onRestart={start}>
      {phase === "ready" ? (
        <Ready game={game} topic={topic} setTopic={setTopic} onStart={start} level={level} setLevel={setLevel} />
      ) : (
        <section className="card bestas">
          <div className="tenge-top">
            <span className="chip bt-pairs">
              {t.pairs}: <b key={matched.length}>{matched.length}</b> / {pairs}
              <span className="bt-pips" aria-hidden="true">
                {Array.from({ length: pairs }, (_, i) => (
                  <i key={i} className={i < matched.length ? "on" : ""} />
                ))}
              </span>
            </span>
            <span className="chip">
              {t.moves}: <b key={moves}>{moves}</b>
            </span>
          </div>
          <div className={`stones n${cards.length}`}>
            {cards.map((c, i) => {
              const up = open.includes(c.id) || matched.includes(c.pair);
              const miss = open.length === 2 && open.includes(c.id) && cards.find((x) => x.id === open[0])?.pair !== cards.find((x) => x.id === open[1])?.pair;
              const hit = open.length === 2 && open.includes(c.id) && !miss;
              return (
                <button key={c.id} className={`stone s${i % 5} ${up ? "up" : ""} ${matched.includes(c.pair) ? "done" : ""} ${miss ? "miss" : ""} ${hit ? "hit" : ""}`} style={{ "--i": i }} onClick={() => flip(c)} aria-label={up ? c.face : `${i + 1}`}>
                  <span className="stone-in">
                    <span className="stone-back">
                      <Muiz color="#FFFDF7" w={12} />
                    </span>
                    <span className={`stone-face ${c.kind}`}>{c.face}</span>
                  </span>
                  {hit && <Burst n={10} />}
                </button>
              );
            })}
          </div>
        </section>
      )}
    </Frame>
  );
}
