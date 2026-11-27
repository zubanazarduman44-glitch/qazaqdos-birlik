"use client";
import "../auth.css";
import Avatar from "../components/Avatar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "../components/Store";
import Icon from "../components/Icon";
import AuthStage from "../components/AuthStage";
import ShellGlyph from "../components/ShellGlyph";
import { authL } from "../components/AuthL10n";
import { AVATARS, EXPLAIN_LANGS, avatarName } from "../../lib/i18n";
import { secVars } from "../../lib/sections";

// Тіл тақтайшасындағы қысқа белгі (жалау эмодзиінің орнына)
const LANG_TAG = { ru: "RU", en: "EN", zh: "中", es: "ES", de: "DE", fr: "FR", tr: "TR", ar: "ع", ko: "한", ja: "あ", kk: "ҚЗ" };
// Мақсат → киіз белгі мен бөлім реңі
const GOAL_ART = { travel: ["compass", "travel"], study: ["book", "lit"], work: ["nib", "tuzel"], life: ["shanyrak", "home"] };
const MOODS = ["happy", "wow", "think", "cheer"];
const STEPS = 4;

export default function Onboarding() {
  const { t, state, setProfile, user, award, lang } = useApp();
  const router = useRouter();
  const a = authL(lang);
  const [step, setStep] = useState(1);
  const [explain, setExplain] = useState(state.profile.explain || "ru");
  const [name, setName] = useState(state.profile.name || "");
  const [goal, setGoal] = useState(state.profile.goal || "travel");
  const [avatar, setAvatar] = useState(state.profile.avatar && state.profile.avatar.startsWith("av:") ? state.profile.avatar : "av:zhigit");

  useEffect(() => {
    if (!name && (state.profile.name || user?.name)) setName(state.profile.name || user?.name || "");
  }, [state.profile.name, user]);

  function finish() {
    const first = !state.profile.onboarded;
    // Алғашқы кіруден кейін — таңдау беті: «Нөлден бастаймын» немесе «Деңгейімді анықтаймын» (тест міндетті емес)
    setProfile({ explain, name: name.trim() || "Дос", goal, avatar, onboarded: true, levelPending: false });
    if (first) award(10, 5);
    router.push(first ? "/app/level?first=1" : "/app");
  }
  const next = () => (step < STEPS ? setStep(step + 1) : finish());
  const first = !state.profile.onboarded;
  const goalNow = t.goals.find((g) => g.id === goal);
  const title = [t.ob1, t.ob2, a.goalTitle, a.avatarTitle][step - 1];
  const sub = [t.ob1Sub, a.nameSub, a.goalSub, a.avatarSub][step - 1];

  return (
    <AuthStage mood={MOODS[step - 1]} bubble={a.say[step - 1]} steps={a.steps} step={step - 1}>
      <form
        className="au-card obx"
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
      >
        <div className="obx-prog">
          <span className="obx-count">{a.stepOf(step, STEPS)}</span>
          <div className="obx-bar" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS} aria-valuenow={step} aria-label={a.stepOf(step, STEPS)}>
            {a.steps.map((s, i) => (
              <i key={s} className={i + 1 < step ? "done" : i + 1 === step ? "now" : ""} />
            ))}
          </div>
        </div>

        <div className="obx-step" key={step}>
          <h1>{title}</h1>
          <p className="au-sub">{sub}</p>

          {step === 1 && (
            <div className="obx-langs" role="radiogroup" aria-label={a.steps[0]}>
              {EXPLAIN_LANGS.map((l) => (
                <button type="button" key={l.id} role="radio" aria-checked={explain === l.id} className={`obx-opt ${explain === l.id ? "on" : ""}`} onClick={() => setExplain(l.id)}>
                  <span className="obx-tag" aria-hidden="true">{LANG_TAG[l.id] || l.id.toUpperCase()}</span>
                  <span className="obx-opt-t">
                    <b>{l.name}</b>
                    <small>{l.hint}</small>
                  </span>
                  <span className="obx-ok" aria-hidden="true"><Icon name="check" size={14} stroke={3} /></span>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="obx-name">
              <label className="field au-field">
                <span>{t.nick}</span>
                <span className="au-in">
                  <Icon name="user" size={18} />
                  <input className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={30} placeholder="Айгерім" autoComplete="nickname" autoFocus />
                </span>
              </label>
              <p className="obx-hello" lang="kk" aria-hidden="true">
                Сәлем, <b>{name.trim() || "Дос"}</b>!
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="obx-goals" role="radiogroup" aria-label={t.goal}>
              {t.goals.map((g) => {
                const [glyph, sec] = GOAL_ART[g.id] || GOAL_ART.life;
                return (
                  <button type="button" key={g.id} role="radio" aria-checked={goal === g.id} className={`obx-opt obx-goal ${goal === g.id ? "on" : ""}`} onClick={() => setGoal(g.id)} style={secVars(sec, "it")}>
                    <span className="obx-gl" aria-hidden="true"><ShellGlyph name={glyph} size={26} /></span>
                    <span className="obx-opt-t">
                      <b>{g.t}</b>
                      <small>{g.d}</small>
                    </span>
                    <span className="obx-ok" aria-hidden="true"><Icon name="check" size={14} stroke={3} /></span>
                  </button>
                );
              })}
            </div>
          )}

          {step === 4 && (
            <>
              <div className="obx-pass">
                <span className="obx-pass-av"><Avatar value={avatar} size={84} /></span>
                <span className="obx-pass-t">
                  <b>{name.trim() || "Дос"}</b>
                  <span className="obx-chips">
                    <span>{EXPLAIN_LANGS.find((l) => l.id === explain)?.name}</span>
                    {goalNow && <span>{goalNow.t}</span>}
                  </span>
                </span>
              </div>
              <div className="obx-avs" role="radiogroup" aria-label={t.avatar}>
                {AVATARS.map((v) => (
                  <button type="button" key={v} role="radio" aria-checked={avatar === v} className={`obx-av ${avatar === v ? "on" : ""}`} onClick={() => setAvatar(v)} aria-label={avatarName(v, lang)}>
                    <Avatar value={v} size={60} />
                    <span className="obx-ok" aria-hidden="true"><Icon name="check" size={13} stroke={3} /></span>
                  </button>
                ))}
              </div>
              {first && (
                <p className="obx-after">
                  <ShellGlyph name="trail" size={18} /> {a.after}
                </p>
              )}
            </>
          )}
        </div>

        <div className="obx-actions">
          {step > 1 && (
            <button type="button" className="btn ghost" onClick={() => setStep(step - 1)}>
              <Icon name="left" size={18} /> {t.back}
            </button>
          )}
          <button type="submit" className="btn blue big obx-next">
            {step < STEPS ? t.cont : t.obDone} <Icon name="right" size={18} />
          </button>
        </div>
      </form>
    </AuthStage>
  );
}
