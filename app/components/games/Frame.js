"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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

/* ═════ Киіз-аппликация палитрасы ═════ */
const K = "#0F5E7A", KD = "#0A4A61", R = "#A63A2B", G = "#E0A526", PG = "#F6E3B0", C = "#FFFDF7", I = "#1F2430", GR = "#2F6B4F", T = "#1E8A8A", B = "#7A4A22";
const SKIN = "#D9A577", HOOF = "#2B1A10";
function shade(hex, f = 0.78) {
  const n = parseInt(hex.slice(1), 16);
  const c = (s) => Math.max(0, Math.min(255, Math.round(((n >> s) & 255) * f)));
  return `#${((c(16) << 16) | (c(8) << 8) | c(0)).toString(16).padStart(6, "0")}`;
}

/* Ат (бүйірден, оңға қарап шабады). Аяқтары бөлек — шабыс циклы CSS-пен. */
export function Horse({ coat = B, mane = HOOF, rider = K, cloth = R, riderOn = true, className = "", ...svg }) {
  const far = shade(coat, 0.72);
  const leg = (cls, x, fill) => (
    <g className={`hz-leg ${cls}`}>
      <rect x={x} y="50" width="7" height="34" rx="3.5" fill={fill} />
      <rect x={x - 1} y="80" width="9" height="6" rx="2" fill={HOOF} />
    </g>
  );
  return (
    <svg viewBox="0 -16 124 112" className={`hz ${className}`} aria-hidden="true" focusable="false" {...svg}>
      <ellipse className="hz-shadow" cx="60" cy="90" rx="40" ry="4" fill={I} opacity=".14" />
      <g className="hz-all">
        {leg("hz-bf", 42, far)}
        {leg("hz-ff", 84, far)}
        <path className="hz-tail" d="M32 40C20 37 10 47 7 64C15 58 22 55 33 51Z" fill={mane} />
        <path d="M30 46C30 35 42 31 56 32C70 33 78 30 86 34C94 38 94 50 90 56C85 62 70 62 56 62C42 62 30 58 30 46Z" fill={coat} />
        <path d="M74 44C76 30 84 18 94 10C98 7 103 7 106 10L117 22C119 25 117 29 113 28L104 26C100 30 96 38 92 52Z" fill={coat} />
        <path d="M76 34C80 22 88 13 96 8L97 13L92 16L91 21L86 23L85 28L80 31Z" fill={mane} />
        <path d="M97 9L99 0L103 8Z" fill={coat} />
        <circle cx="104" cy="15" r="1.8" fill={I} />
        <path d="M44 38C50 35 58 35 64 36" stroke={C} strokeOpacity=".28" strokeWidth="2" strokeDasharray="2 3" fill="none" strokeLinecap="round" />
        {leg("hz-bn", 34, coat)}
        {leg("hz-fn", 76, coat)}
        <path d="M50 32L74 32L74 46C68 50 56 50 50 46Z" fill={cloth} />
        <path d="M53 35L71 35L71 44C66 47 58 47 53 44Z" fill="none" stroke={PG} strokeWidth="1.4" strokeDasharray="2.5 2" />
        {riderOn && (
          <g className="hz-rider">
            <path d="M60 34L64 47L70 47" stroke={HOOF} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M54 34C52 22 56 10 66 8C72 8 74 14 72 22C70 28 68 32 66 36Z" fill={rider} />
            <path d="M55 26L70 27" stroke={G} strokeWidth="2.6" strokeLinecap="round" />
            <path d="M68 15C76 18 84 22 90 26" stroke={rider} strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <circle cx="91" cy="26" r="3" fill={SKIN} />
            <circle cx="70" cy="1" r="6.5" fill={SKIN} />
            <path d="M62.5 -1C62 -9 66 -16 70.5 -16C75 -16 78.5 -9 78 -1Z" fill={C} />
            <path d="M70.5 -16C70 -10 70 -5 70.5 -1" stroke="#D9D2C2" strokeWidth="1.2" fill="none" />
            <path d="M60 -0.5L64.5 -4L70.5 -1L76.5 -4L81 -0.5" stroke={I} strokeWidth="2.6" fill="none" strokeLinejoin="round" strokeLinecap="round" />
            <path d="M91 26L110 24" stroke={HOOF} strokeWidth="1.2" fill="none" />
          </g>
        )}
      </g>
    </svg>
  );
}

/* Бөрі — арқан тартыстағы қарсылас (солға қарап тартады) */
export function Wolf({ className = "", ...svg }) {
  return (
    <svg viewBox="0 0 100 100" className={`wolf ${className}`} aria-hidden="true" focusable="false" {...svg}>
      <ellipse cx="54" cy="94" rx="34" ry="4" fill={I} opacity=".14" />
      <path className="wolf-tail" d="M72 80C88 84 98 70 95 54C89 63 81 67 71 66Z" fill="#5E6470" />
      <path d="M28 92C24 74 30 56 46 50C62 44 77 52 79 68C81 82 77 92 66 94Z" fill="#7D8591" />
      <path d="M36 91C34 79 38 69 46 65C46 77 48 86 51 92Z" fill="#D9D2C2" />
      <path d="M42 66L22 61" stroke="#7D8591" strokeWidth="9" strokeLinecap="round" />
      <path d="M48 74L26 70" stroke="#5E6470" strokeWidth="8" strokeLinecap="round" />
      <path d="M40 55C34 43 37 29 50 26C58 25 64 32 63 42C61 50 55 56 46 58Z" fill="#7D8591" />
      <path d="M44 36L20 42C17 45 19 49 23 49L46 49Z" fill="#7D8591" />
      <path d="M24 47L44 47L44 51L28 51Z" fill="#D9D2C2" />
      <circle cx="20" cy="43.5" r="3" fill={I} />
      <path d="M47 28L49 11L60 26Z" fill="#7D8591" />
      <path d="M50 25L51 16L56 25Z" fill="#D9D2C2" />
      <path d="M38 37L45 36" stroke={I} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M50 52C56 50 60 46 62 40" stroke="#D9D2C2" strokeWidth="2" strokeDasharray="2 3" fill="none" />
    </svg>
  );
}

/* Асық (сақа — қызылға боялған) */
export function AsykBone({ saka = false, className = "", ...svg }) {
  const fill = saka ? R : "#F1E2C0", line = saka ? "#6E2318" : "#B98A3E";
  return (
    <svg viewBox="0 0 60 44" className={`asyk ${saka ? "saka" : ""} ${className}`} aria-hidden="true" focusable="false" {...svg}>
      <path d="M8 22c0-10 6-16 14-14 4 1 6 3 8 3s4-2 8-3c8-2 14 4 14 14s-6 16-14 14c-4-1-6-3-8-3s-4 2-8 3C14 38 8 32 8 22Z" fill={fill} stroke={line} strokeWidth="2.5" />
      <path d="M24 16c3 3 9 3 12 0M24 28c3-3 9-3 12 0" stroke={line} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M14 22c0-6 3-9 7-9" stroke={saka ? "#E08A6F" : C} strokeWidth="2" fill="none" strokeLinecap="round" opacity=".8" />
    </svg>
  );
}

/* Серке (көкпар) */
export function Goat({ className = "", ...svg }) {
  return (
    <svg viewBox="0 0 64 44" className={`goat ${className}`} aria-hidden="true" focusable="false" {...svg}>
      <path d="M17 30L14 41M24 32L23 42M38 32L40 42M45 30L49 40" stroke="#5A4630" strokeWidth="4" strokeLinecap="round" />
      <path d="M8 22C8 14 16 11 30 11C42 11 48 14 49 22C50 30 42 34 30 34C16 34 8 30 8 22Z" fill="#B49A78" />
      <path d="M10 18C6 14 5 10 8 7" stroke="#5A4630" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M14 27C22 31 38 31 45 27" stroke="#E6D8BE" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M44 18C46 10 50 6 55 7C60 8 63 14 61 19C60 22 56 22 54 21L50 24Z" fill="#9C8262" />
      <path d="M58 20C59 25 57 28 55 29" stroke="#5A4630" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M52 8C49 1 41 0 38 6C42 4 46 5 48 10" fill="#4A3826" />
      <path d="M50 11L45 14" stroke="#9C8262" strokeWidth="4" strokeLinecap="round" />
      <circle cx="56" cy="12.5" r="1.4" fill={I} />
      <path d="M18 15C26 12 36 12 42 15" stroke={C} strokeOpacity=".5" strokeWidth="1.5" strokeDasharray="2 2.5" fill="none" />
    </svg>
  );
}

/* Қазандық — көкпардың қақпасы */
export function KazanGoal({ color = K, className = "" }) {
  return (
    <svg viewBox="0 0 60 50" className={`kk-kazan ${className}`} aria-hidden="true" focusable="false">
      <ellipse cx="30" cy="42" rx="28" ry="7" fill={I} opacity=".14" />
      <path d="M4 40C4 22 56 22 56 40C56 46 4 46 4 40Z" fill={color} />
      <ellipse cx="30" cy="27" rx="20" ry="5" fill={shade(color, 0.7)} />
      <path d="M10 37C16 41 44 41 50 37" stroke={PG} strokeWidth="1.6" strokeDasharray="3 2.5" fill="none" />
    </svg>
  );
}

/* Мәре бағаны */
export function FinishPost() {
  return (
    <svg viewBox="0 0 22 50" className="finish-post" aria-hidden="true" focusable="false">
      <rect x="9" y="2" width="3.4" height="46" rx="1.7" fill={I} />
      <path className="fp-flag" d="M12.4 4L22 9.5L12.4 15Z" fill={R} />
      <path d="M12.4 4L22 9.5" stroke={G} strokeWidth="1.4" />
      <ellipse cx="10.7" cy="47" rx="6" ry="2" fill={I} opacity=".2" />
    </svg>
  );
}

/* Қошқар мүйіз — ою екпіні */
export function Muiz({ color = K, className = "", w = 10, ...svg }) {
  return (
    <svg viewBox="0 0 120 120" className={`muiz ${className}`} aria-hidden="true" focusable="false" {...svg}>
      <path d="M60 98V58M60 60C60 34 26 30 26 52C26 68 46 68 46 54M60 60C60 34 94 30 94 52C94 68 74 68 74 54" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Heart({ on = true }) {
  return (
    <svg viewBox="0 0 24 22" className={`g-heart ${on ? "on" : "off"}`} aria-hidden="true" focusable="false">
      <path d="M12 20.5C5 15 2 11 2 7.2 2 4.2 4.4 2 7.3 2c2 0 3.6 1 4.7 2.6C13.1 3 14.7 2 16.7 2 19.6 2 22 4.2 22 7.2c0 3.8-3 7.8-10 13.3Z" fill={on ? R : "none"} stroke={on ? R : "#B9B2A2"} strokeWidth="2" />
    </svg>
  );
}

export function Clock() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" className="g-clock" aria-hidden="true" focusable="false">
      <circle cx="10" cy="11" r="7.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M10 7v4.5l3 2M8 1.5h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function CoinIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} className="g-coin-ic" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="9" fill={G} />
      <circle cx="10" cy="10" r="6" fill="none" stroke="#9A6A10" strokeWidth="1.4" strokeDasharray="2 1.6" />
      <rect x="8" y="8" width="4" height="4" fill="#9A6A10" transform="rotate(45 10 10)" />
    </svg>
  );
}

function Star({ on, i }) {
  return (
    <svg viewBox="0 0 24 24" className={`g-star ${on ? "on" : ""}`} style={{ "--i": i }} aria-hidden="true" focusable="false">
      <path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17.1l-5.9 3.2 1.3-6.5L2.5 9.3l6.6-.8Z" fill={on ? G : "none"} stroke={on ? "#B9821A" : "#CFC6B0"} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

/* ═════ Ойын көріністері (тізім карточкасы, дайындық экраны, тақырып белгісі) ═════ */
const SCENE = {
  baige: { bg: PG, ground: G, stitch: B },
  arkan: { bg: "#F3DDD5", ground: "#D9B9A0", stitch: R },
  asyk: { bg: "#EFE2CC", ground: "#D2B48A", stitch: B },
  tenge: { bg: "#D5ECEA", ground: "#9CCFC4", stitch: T },
  bestas: { bg: "#D9E7EE", ground: "#A9C6D3", stitch: K },
  kokpar: { bg: "#DCEBDF", ground: "#A8CBB2", stitch: GR },
};
function Stone({ x, y, w, h, fill = "#C9C1AF", className = "" }) {
  return (
    <g className={className}>
      <path d={`M${x} ${y + h * 0.55}C${x} ${y + h * 0.1} ${x + w * 0.3} ${y} ${x + w * 0.55} ${y}C${x + w * 0.9} ${y} ${x + w} ${y + h * 0.3} ${x + w} ${y + h * 0.6}C${x + w} ${y + h} ${x + w * 0.7} ${y + h} ${x + w * 0.45} ${y + h}C${x + w * 0.15} ${y + h} ${x} ${y + h * 0.85} ${x} ${y + h * 0.55}Z`} fill={fill} />
      <path d={`M${x + w * 0.2} ${y + h * 0.45}C${x + w * 0.25} ${y + h * 0.2} ${x + w * 0.45} ${y + h * 0.15} ${x + w * 0.6} ${y + h * 0.18}`} stroke={C} strokeOpacity=".7" strokeWidth="2" strokeDasharray="2 2.5" fill="none" strokeLinecap="round" />
    </g>
  );
}
function SceneBody({ id }) {
  if (id === "baige")
    return (
      <>
        <g className="gs-speed">
          <path d="M28 62H62M16 76H54M34 90H66" stroke={C} strokeWidth="5" strokeLinecap="round" />
        </g>
        <Horse x="6" y="30" width="96" height="87" coat="#8E8A80" mane="#4A4A4A" rider={GR} cloth={K} className="gs-horse back" />
        <Horse x="78" y="14" width="140" height="126" className="gs-horse" />
      </>
    );
  if (id === "arkan")
    return (
      <>
        <rect x="52" y="64" width="6" height="44" rx="3" fill={K} />
        <rect x="182" y="64" width="6" height="44" rx="3" fill={R} />
        <g className="gs-rope">
          <path d="M6 84C70 96 150 96 214 84" stroke="#9A6A2A" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M6 84C70 96 150 96 214 84" stroke="#C99A55" strokeWidth="10" fill="none" strokeDasharray="5 6" />
          <g transform="translate(110 92)">
            <path d="M0 0L-8 26H8Z" fill={R} />
            <circle r="6" fill={G} />
            <path d="M-5 26V34M0 26V36M5 26V34" stroke={R} strokeWidth="2.4" strokeLinecap="round" />
          </g>
        </g>
        <Wolf x="168" y="40" width="72" height="72" className="gs-wolf" />
        <g transform="translate(4 36)" className="gs-qyran">
          <Qyran mood="happy" size={60} />
        </g>
      </>
    );
  if (id === "asyk")
    return (
      <>
        <ellipse cx="128" cy="110" rx="92" ry="16" fill="none" stroke={B} strokeWidth="2.5" strokeDasharray="6 5" />
        {[0, 1, 2, 3].map((i) => (
          <AsykBone key={i} x={78 + i * 30} y="90" width="32" height="24" className={i === 2 ? "gs-hit" : ""} />
        ))}
        <path d="M34 50C70 14 120 30 148 84" stroke={B} strokeWidth="2" strokeDasharray="3 5" fill="none" opacity=".6" />
        <g className="gs-saka">
          <AsykBone saka x="16" y="30" width="44" height="32" />
        </g>
      </>
    );
  if (id === "tenge")
    return (
      <>
        {[
          [160, 34, 0],
          [196, 62, 1],
          [128, 18, 2],
        ].map(([x, y, i]) => (
          <g key={i} className="gs-coin" style={{ "--i": i }}>
            <circle cx={x} cy={y} r="14" fill={G} />
            <circle cx={x} cy={y} r="9" fill="none" stroke="#9A6A10" strokeWidth="1.8" strokeDasharray="3 2" />
            <rect x={x - 3} y={y - 3} width="6" height="6" fill="#9A6A10" transform={`rotate(45 ${x} ${y})`} />
          </g>
        ))}
        <Horse x="20" y="22" width="132" height="119" coat="#3B2A20" rider={R} cloth={T} className="gs-horse" />
      </>
    );
  if (id === "bestas")
    return (
      <>
        <Stone x={36} y={92} w={36} h={24} />
        <Stone x={80} y={96} w={30} h={20} fill="#B9B09C" />
        <Stone x={150} y={94} w={34} h={22} fill="#B9B09C" />
        <Stone x={188} y={90} w={30} h={24} />
        <path d="M100 86C104 40 140 28 150 46" stroke={K} strokeWidth="2" strokeDasharray="3 5" fill="none" opacity=".6" />
        <g className="gs-toss">
          <Stone x={104} y={30} w={40} h={28} fill={G} />
        </g>
      </>
    );
  return (
    <>
      <Horse x="8" y="20" width="118" height="106" rider={K} cloth={G} className="gs-horse" />
      <g transform="translate(240 0) scale(-1 1)">
        <Horse x="8" y="20" width="118" height="106" coat="#3B2A20" rider={R} cloth={T} className="gs-horse two" />
      </g>
      <Goat x="92" y="80" width="58" height="40" className="gs-goat" />
    </>
  );
}
export function GameScene({ id, icon = false, className = "" }) {
  const s = SCENE[id] || SCENE.baige;
  return (
    <svg viewBox="0 0 240 140" preserveAspectRatio={icon ? "xMidYMid slice" : "xMidYMid meet"} className={`g-scene gs-${id} ${className}`} aria-hidden="true" focusable="false">
      <rect width="240" height="140" fill={s.bg} />
      <path d="M0 112C60 104 180 104 240 112V140H0Z" fill={s.ground} />
      <SceneBody id={id} />
      {!icon && <rect x="6" y="6" width="228" height="128" rx="12" fill="none" stroke={s.stitch} strokeOpacity=".45" strokeWidth="1.6" strokeDasharray="5 4" />}
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
export function Ready({ game, topic, setTopic, onStart, level, setLevel }) {
  const { t, lang } = useApp();
  return (
    <section className="card g-ready" style={{ "--gc": game.color }}>
      <div className="g-ready-art">
        <GameScene id={game.id} className="live" />
      </div>
      <div className="g-ready-body">
        <p className="g-ready-how">
          <Muiz color={game.color} w={14} />
          <span>{L(game.desc, lang)}</span>
        </p>
        {setLevel && <LevelPicker level={level} setLevel={setLevel} />}
        <h3>{t.topic}</h3>
        <TopicPicker topic={topic} setTopic={setTopic} />
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
