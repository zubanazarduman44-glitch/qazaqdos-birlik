"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAnimGate } from "../AnimGate";
import { useApp } from "../Store";
import Qyran from "../Qyran";
import Icon from "../Icon";
import TopicArt from "../TopicArt";
import { L } from "../../../lib/i18n";
import { TOPICS, makeQuestion, wordsByTopic } from "../../../lib/words";

// Ойын нәтижесін сақтау + марапат
export function useFinish(id) {
  const { update, award } = useApp();
  const doneRef = useRef(false);
  const reset = useCallback(() => (doneRef.current = false), []);
  const finish = useCallback(
    (win, score = 0, level = 1) => {
      if (doneRef.current) return;
      doneRef.current = true;
      update((s) => {
        const g = s.games?.[id] || {};
        return { ...s, games: { ...s.games, [id]: { wins: (g.wins || 0) + (win ? 1 : 0), plays: (g.plays || 0) + 1, best: Math.max(g.best || 0, score), lv: win ? Math.max(g.lv || 0, level) : g.lv || 0 } } };
      });
      if (win) award(20 + (level - 1) * 10, 10 + (level - 1) * 5);
      else award(5, 1);
    },
    [id, update, award]
  );
  return { finish, reset };
}

export function useQuestions(topic) {
  const { explain } = useApp();
  const recent = useRef([]);
  return useCallback(
    (opts = {}) => {
      const pool = wordsByTopic(topic);
      const q = makeQuestion(pool, explain, { exclude: recent.current, ...opts });
      recent.current = [...recent.current, q.answer].slice(-Math.min(8, pool.length - 4));
      return q;
    },
    [topic, explain]
  );
}

/* ═════ Ойын ішіндегі шағын мәтіндер (3 тіл) ═════ */
const TX = {
  kk: { you: "Сен", rival: "Қарсылас", place: (n) => `${n}-орын`, streak: "қатарынан", missed: "Тимеді", timeUp: "Уақыт бітті", goal: "ГОЛ!", rivalGoal: "Қарсылас соқты", finish: "Мәре", more: (n) => `Тағы ${n}`, less: "Жасыру", lane: (n) => `${n}-жол`, left: "Солға", right: "Оңға", time: "Уақыт", stars: (n) => `${n} жұлдыз`, round: "Айналым", how: "Ережесі" },
  ru: { you: "Вы", rival: "Соперник", place: (n) => `${n}-е место`, streak: "подряд", missed: "Мимо", timeUp: "Время вышло", goal: "ГОЛ!", rivalGoal: "Гол соперника", finish: "Финиш", more: (n) => `Ещё ${n}`, less: "Свернуть", lane: (n) => `Дорожка ${n}`, left: "Влево", right: "Вправо", time: "Время", stars: (n) => `Звёзд: ${n}`, round: "Раунд", how: "Правила" },
  en: { you: "You", rival: "Rival", place: (n) => `${n}${["st", "nd", "rd"][n - 1] || "th"} place`, streak: "in a row", missed: "Missed", timeUp: "Time's up", goal: "GOAL!", rivalGoal: "Rival scores", finish: "Finish", more: (n) => `${n} more`, less: "Show less", lane: (n) => `Lane ${n}`, left: "Left", right: "Right", time: "Time", stars: (n) => `${n} stars`, round: "Round", how: "How to play" },
};
export function useTx() {
  const { lang } = useApp();
  return TX[lang] || TX.kk;
}

import { K, KD, R, G, PG, C, I, GR, T, B, SKIN, HOOF, Horse, Wolf, AsykBone, Goat, KazanGoal, FinishPost, Muiz, Heart, Clock, CoinIcon, GameScene } from "./GameArt";
// Суреттер GameArt.js-те; ескі импорттар бұзылмауы үшін осы жерден де экспортталады
export { Horse, Wolf, AsykBone, Goat, KazanGoal, FinishPost, Muiz, Heart, Clock, CoinIcon, GameScene };

function Star({ on, i }) {
  return (
    <svg viewBox="0 0 24 24" className={`g-star ${on ? "on" : ""}`} style={{ "--i": i }} aria-hidden="true" focusable="false">
      <path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17.1l-5.9 3.2 1.3-6.5L2.5 9.3l6.6-.8Z" fill={on ? G : "none"} stroke={on ? "#B9821A" : "#CFC6B0"} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}


/* ═════ Ұшқын — дұрыс жауаптағы бөлшектер ═════ */
export function Burst({ n = 12, className = "" }) {
  return (
    <span className={`g-burst ${className}`} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <i key={i} style={{ "--a": `${(360 / n) * i + (i % 2 ? 9 : -9)}deg`, "--d": `${44 + (i % 3) * 16}px` }} />
      ))}
    </span>
  );
}

/* Уақыт жолағы: 30%-дан аз қалса қызарып, соғады */
export function TimeBar({ frac, label }) {
  const f = Math.max(0, Math.min(1, frac));
  return (
    <div className={`g-time ${f < 0.3 ? "low" : ""}`} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(f * 100)}>
      <i style={{ transform: `scaleX(${f})` }} />
    </div>
  );
}

function LvStars({ n }) {
  return (
    <span className="lv-stars" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <svg key={i} viewBox="0 0 24 24" width="16" height="16">
          <path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17.1l-5.9 3.2 1.3-6.5L2.5 9.3l6.6-.8Z" fill={i < n ? G : "none"} stroke={i < n ? "#B9821A" : "#CFC6B0"} strokeWidth="2" strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  );
}

const LV_NAME = [["Жеңіл", "Лёгкий", "Easy"], ["Орташа", "Средний", "Medium"], ["Қиын", "Сложный", "Hard"]];
export function LevelPicker({ level, setLevel }) {
  const { lang } = useApp();
  const li = lang === "kk" ? 0 : lang === "ru" ? 1 : 2;
  const head = ["Деңгей", "Уровень", "Level"][li];
  return (
    <div className="lv-pick">
      <span className="lv-pick-t">{head}</span>
      <div className="lv-pick-row" role="radiogroup" aria-label={head}>
        {[1, 2, 3].map((n) => (
          <button key={n} role="radio" aria-checked={level === n} className={`lv-pick-b ${level === n ? "on" : ""}`} onClick={() => setLevel(n)}>
            <LvStars n={n} />
            <b>{LV_NAME[n - 1][li]}</b>
          </button>
        ))}
      </div>
    </div>
  );
}

const FIRST = 8;
export function TopicPicker({ topic, setTopic, disabled }) {
  const { t, lang } = useApp();
  const tx = useTx();
  const [all, setAll] = useState(false);
  const entries = Object.entries(TOPICS);
  const shown = all ? entries : entries.filter(([k], i) => i < FIRST || k === topic);
  return (
    <div className="topic-row">
      <button className={`chip g-tchip ${topic === "all" ? "on" : ""}`} onClick={() => setTopic("all")} disabled={disabled} aria-pressed={topic === "all"}>
        <span className="g-tchip-all"><Icon name="sparkle" size={16} /></span> {t.allTopics}
      </button>
      {shown.map(([k, v]) => (
        <button key={k} className={`chip g-tchip ${topic === k ? "on" : ""}`} onClick={() => setTopic(k)} disabled={disabled} aria-pressed={topic === k}>
          <TopicArt topic={k} size={24} /> {L(v, lang)}
        </button>
      ))}
      {entries.length > FIRST && (
        <button className="chip g-tchip more" onClick={() => setAll((x) => !x)} aria-expanded={all}>
          {all ? tx.less : tx.more(entries.length - FIRST)}
        </button>
      )}
    </div>
  );
}

/* Дайындық экраны — барлық ойынға ортақ */
export function Ready({ game, topic, setTopic, onStart, level, setLevel, extra = null }) {
  const { t, lang } = useApp();
  const gArt = useAnimGate(); // экраннан тыс — анимация кідіреді
  return (
    <section className="card g-ready" style={{ "--gc": game.color }}>
      <div ref={gArt} className="g-ready-art">
        <GameScene id={game.id} className="live" />
      </div>
      <div className="g-ready-body">
        <p className="g-ready-how">
          <Muiz color={game.color} w={14} />
          <span>{L(game.desc, lang)}</span>
        </p>
        {setLevel && <LevelPicker level={level} setLevel={setLevel} />}
        {extra}
        {setTopic && (
          <>
            <h3>{t.topic}</h3>
            <TopicPicker topic={topic} setTopic={setTopic} />
          </>
        )}
        <button className="btn gold big g-go" onClick={onStart}>
          {t.play} <Icon name="right" size={18} />
        </button>
      </div>
    </section>
  );
}

export function Options({ q, onPick, picked, disabled }) {
  return (
    <div className="g-opts">
      {q.options.map((o, i) => {
        const st = picked ? (o.key === q.answer ? "ok" : o.key === picked ? "bad" : "dim") : "";
        return (
          <button key={o.key} className={`qopt ${st}`} disabled={disabled || Boolean(picked)} onClick={() => onPick(o.key)}>
            <kbd className="qk" aria-hidden="true">{i + 1}</kbd>
            <span>{o.label}</span>
            {st === "ok" && picked === o.key && <Burst />}
          </button>
        );
      })}
    </div>
  );
}

/* Сұрақ панелі: тақырып белгісі, сөз, қатар серия, нұсқалар, 1–4 пернелері */
export function QPanel({ q, picked, onPick, disabled, children }) {
  const tx = useTx();
  const [streak, setStreak] = useState(0);
  const seen = useRef(null);
  const timeUp = picked === "__time";
  useEffect(() => {
    if (!picked || seen.current === q) return;
    seen.current = q;
    setStreak((s) => (picked === q.answer ? s + 1 : 0));
  }, [picked, q]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const i = "1234".indexOf(e.key);
      if (i < 0 || picked || disabled || !q.options[i]) return;
      onPick(q.options[i].key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [q, picked, disabled, onPick]);
  const st = picked ? (picked === q.answer ? "ok" : "bad") : "";
  return (
    <section className={`card g-q ${st}`}>
      <div className="g-q-top">
        <span className="g-q-topic">
          <TopicArt topic={q.word.t} size={40} />
        </span>
        <h3 className="g-prompt" key={q.answer + q.prompt}>
          <b>{q.prompt}</b>
        </h3>
        <span className="g-q-side">
          {streak >= 2 && (
            <span className="g-streak" key={streak} aria-live="polite">
              <Icon name="flame" size={16} /> ×{streak} <small>{tx.streak}</small>
            </span>
          )}
          {timeUp && <span className="g-timeup">{tx.timeUp}</span>}
        </span>
      </div>
      {children}
      <Options q={q} picked={picked} onPick={onPick} disabled={disabled || timeUp} />
    </section>
  );
}

/* Сандарды 0-ден санап көрсету */
function CountUp({ text }) {
  const [k, setK] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return setK(1);
    let raf;
    const t0 = performance.now();
    const loop = (now) => {
      const p = Math.min(1, (now - t0) / 900);
      setK(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [text]);
  return String(text)
    .split(/(\d+)/)
    .map((p, i) => (/^\d+$/.test(p) ? <b key={i}>{Math.round(Number(p) * k)}</b> : <span key={i}>{p}</span>));
}

export default function Frame({ game, children, result, onRestart }) {
  const { t, lang } = useApp();
  const tx = useTx();
  useEffect(() => {
    if (result) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [result]);
  const stars = result ? (result.stars ?? (result.win ? 3 : result.draw ? 1 : 0)) : 0;
  return (
    <div className={`game g-${game.id}`} style={{ "--gc": game.color }}>
      <header className="game-head">
        <Link href="/app/games" className="icon-btn" aria-label={t.toGames}>
          <Icon name="left" size={20} />
        </Link>
        <span className="game-e">
          <GameScene id={game.id} icon />
        </span>
        <div>
          <h1>{L(game.name, lang)}</h1>
          <p className="muted small">{L(game.how, lang)}</p>
        </div>
      </header>
      {result ? (
        <section className={`card game-result ${result.win ? "win" : result.draw ? "draw" : "lose"}`}>
          <div className="gr-stage">
            <svg viewBox="0 0 200 200" className="gr-rays" aria-hidden="true" focusable="false">
              {Array.from({ length: 12 }, (_, i) => (
                <g key={i} transform={`rotate(${i * 30} 100 100)`}>
                  <path d="M100 30V14M100 22C100 12 88 10 88 18C88 23 94 23 94 19M100 22C100 12 112 10 112 18C112 23 106 23 106 19" stroke={i % 2 ? R : K} strokeWidth="3" fill="none" strokeLinecap="round" />
                </g>
              ))}
              <circle cx="100" cy="100" r="64" fill={PG} />
              <circle cx="100" cy="100" r="58" fill="none" stroke={G} strokeWidth="2" strokeDasharray="4 4" />
            </svg>
            {result.win && (
              <span className="gr-confetti" aria-hidden="true">
                {Array.from({ length: 18 }, (_, i) => (
                  <i key={i} style={{ "--x": `${((i * 37) % 100) - 50}%`, "--r": `${(i * 47) % 360}deg`, "--t": `${0.9 + (i % 5) * 0.18}s`, "--dl": `${(i % 6) * 0.07}s` }} />
                ))}
              </span>
            )}
            {result.win && <Burst n={16} className="big" />}
            <Qyran mood={result.win ? "cheer" : result.draw ? "idle" : "support"} size={130} />
          </div>
          <div className="gr-stars" role="img" aria-label={tx.stars(stars)}>
            {[0, 1, 2].map((i) => (
              <Star key={i} i={i} on={i < stars} />
            ))}
          </div>
          <h2>{result.win ? t.youWin : result.draw ? t.draw : t.youLose}</h2>
          {result.text && (
            <p className="gr-score">
              <CountUp text={result.text} />
            </p>
          )}
          <span className="chip gold gr-reward">
            <CoinIcon size={16} /> {result.win ? t.reward(20, 10) : t.reward(5, 1)}
          </span>
          <div className="row-btns">
            <button className="btn gold big" onClick={onRestart} autoFocus>
              <Icon name="refresh" size={18} /> {t.playAgain}
            </button>
            <Link href="/app/games" className="btn ghost big">
              {t.toGames}
            </Link>
          </div>
        </section>
      ) : (
        children
      )}
    </div>
  );
}
