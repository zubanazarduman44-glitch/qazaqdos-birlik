"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "../Store";
import Birlik from "../Birlik";
import Icon from "../Icon";
import Frame, { TopicPicker, useFinish, useQuestions } from "./Frame";
import { shuffle, tr, wordsByTopic } from "../../../lib/words";
import { aiMove, legalMoves, newGame, play } from "../../../lib/togyz";
import { kazNumber } from "../../../lib/games";

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

/* ═════ Тоғызқұмалақ ═════ */
function Pit({ n, onClick, disabled, hot, tuz, label, last }) {
  const dots = Math.min(n, 12);
  return (
    <button className={`pit ${hot ? "hot" : ""} ${tuz ? "tuz" : ""} ${last ? "last" : ""}`} onClick={onClick} disabled={disabled} title={kazNumber(n)}>
      <span className="pit-label">{label}</span>
      <span className="pit-dots">
        {Array.from({ length: dots }, (_, i) => (
          <i key={i} />
        ))}
      </span>
      <b className="pit-n">{tuz ? "✕" : n}</b>
    </button>
  );
}

export function Togyz({ game }) {
  const { t } = useApp();
  const [g, setG] = useState(newGame);
  const [level, setLevel] = useState(1);
  const [log, setLog] = useState("");
  const [result, setResult] = useState(null);
  const { finish, reset } = useFinish(game.id);

  function restart() {
    reset();
    setG(newGame());
    setLog("");
    setResult(null);
  }
  function describe(st, who) {
    const L = st.last;
    if (!L) return "";
    const n = L.path.length;
    return t.togyzMove(who, n, kazNumber(n), L.captured, L.madeTuz);
  }
  function end(st) {
    const win = st.winner === 0;
    finish(win, st.kazan[0]);
    setResult({ win, draw: st.winner === -1, text: `${t.you} ${st.kazan[0]} : ${st.kazan[1]} ${t.computer}` });
  }
  function myMove(i) {
    if (g.turn !== 0 || g.over) return;
    const st = play(g, i);
    setG(st);
    setLog(describe(st, t.you));
    if (st.over) setTimeout(() => end(st), 900);
  }
  useEffect(() => {
    if (g.turn !== 1 || g.over) return;
    const id = setTimeout(() => {
      const m = aiMove(g, level === 1 ? 1 : 2);
      if (m == null) return;
      const st = play(g, m);
      setG(st);
      setLog(describe(st, t.computer));
      if (st.over) setTimeout(() => end(st), 900);
    }, 850);
    return () => clearTimeout(id);
  }, [g, level]);

  const legal = legalMoves(g, 0);
  const lastPath = new Set(g.last?.path || []);
  return (
    <Frame game={game} result={result} onRestart={restart}>
      <section className="card togyz">
        <div className="togyz-top">
          <div className="seg">
            {[1, 2].map((l) => (
              <button key={l} className={level === l ? "on" : ""} onClick={() => setLevel(l)}>
                {l === 1 ? t.easy : t.medium}
              </button>
            ))}
          </div>
          <button className="btn ghost small" onClick={restart}>
            <Icon name="refresh" size={15} /> {t.newGame}
          </button>
        </div>

        <div className="board">
          <div className="side-row them">
            {Array.from({ length: 9 }, (_, k) => 17 - k).map((i) => (
              <Pit key={i} n={g.pits[i]} disabled label={i - 8} tuz={g.tuz[0] === i} last={lastPath.has(i)} />
            ))}
          </div>
          <div className="kazans">
            <div className="kazan them">
              <span>🖥️ {t.computer}</span>
              <b>{g.kazan[1]}</b>
            </div>
            <div className="turn-ind">
              {g.turn === 0 ? (
                <>
                  <Birlik mood="think" size={54} /> {t.yourTurn}
                </>
              ) : (
                <>
                  <span className="spin">⏳</span> {t.aiTurn}
                </>
              )}
            </div>
            <div className="kazan me">
              <span>
                {"⭐"} {t.you}
              </span>
              <b>{g.kazan[0]}</b>
            </div>
          </div>
          <div className="side-row me">
            {Array.from({ length: 9 }, (_, k) => k).map((i) => (
              <Pit
                key={i}
                n={g.pits[i]}
                label={i + 1}
                onClick={() => myMove(i)}
                disabled={g.turn !== 0 || !legal.includes(i)}
                hot={g.turn === 0 && legal.includes(i)}
                tuz={g.tuz[1] === i}
                last={lastPath.has(i)}
              />
            ))}
          </div>
        </div>
        <p className="togyz-log">{log || " "}</p>
        <p className="muted small">
          {t.tuzdyk}: ✕ · {t.kazan}: 82+ 🏆
        </p>
      </section>
    </Frame>
  );
}
