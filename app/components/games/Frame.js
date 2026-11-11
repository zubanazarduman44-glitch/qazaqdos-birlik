"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { useApp } from "../Store";
import Qyran from "../Qyran";
import Icon from "../Icon";
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

const LV_NAME = [["Жеңіл", "Лёгкий", "Easy"], ["Орташа", "Средний", "Medium"], ["Қиын", "Сложный", "Hard"]];
export function LevelPicker({ level, setLevel }) {
  const { lang } = useApp();
  const li = lang === "kk" ? 0 : lang === "ru" ? 1 : 2;
  const head = ["Деңгей", "Уровень", "Level"][li];
  return (
    <div className="lv-pick">
      <span className="lv-pick-t">{head}</span>
      <div className="lv-pick-row" role="radiogroup">
        {[1, 2, 3].map((n) => (
          <button key={n} role="radio" aria-checked={level === n} className={`lv-pick-b ${level === n ? "on" : ""}`} onClick={() => setLevel(n)}>
            <span className="lv-stars">{"★".repeat(n)}{"☆".repeat(3 - n)}</span>
            <b>{n} · {LV_NAME[n - 1][li]}</b>
          </button>
        ))}
      </div>
    </div>
  );
}

export function TopicPicker({ topic, setTopic, disabled }) {
  const { t, lang } = useApp();
  return (
    <div className="topic-row">
      <button className={`chip ${topic === "all" ? "on" : ""}`} onClick={() => setTopic("all")} disabled={disabled}>
        ✨ {t.allTopics}
      </button>
      {Object.entries(TOPICS).map(([k, v]) => (
        <button key={k} className={`chip ${topic === k ? "on" : ""}`} onClick={() => setTopic(k)} disabled={disabled}>
          {v.e} {L(v, lang)}
        </button>
      ))}
    </div>
  );
}

export function Options({ q, onPick, picked, disabled }) {
  return (
    <div className="g-opts">
      {q.options.map((o) => {
        const st = picked ? (o.key === q.answer ? "ok" : o.key === picked ? "bad" : "") : "";
        return (
          <button key={o.key} className={`qopt ${st}`} disabled={disabled || Boolean(picked)} onClick={() => onPick(o.key)}>
            <span>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Frame({ game, children, result, onRestart }) {
  const { t, lang } = useApp();
  useEffect(() => {
    if (result) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [result]);
  return (
    <div className="game">
      <header className="game-head">
        <Link href="/app/games" className="icon-btn" aria-label={t.toGames}>
          <Icon name="left" size={20} />
        </Link>
        <span className="game-e" style={{ background: `${game.color}22` }}>
          {game.e}
        </span>
        <div>
          <h1>{L(game.name, lang)}</h1>
          <p className="muted small">{L(game.how, lang)}</p>
        </div>
      </header>
      {result ? (
        <section className="card game-result pop">
          <Qyran mood={result.win ? "cheer" : result.draw ? "idle" : "support"} size={140} />
          <h2>{result.win ? t.youWin : result.draw ? t.draw : t.youLose}</h2>
          {result.text && <p className="muted">{result.text}</p>}
          <span className="chip gold">{result.win ? t.reward(20, 10) : t.reward(5, 1)}</span>
          <div className="row-btns">
            <button className="btn gold big" onClick={onRestart}>
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
