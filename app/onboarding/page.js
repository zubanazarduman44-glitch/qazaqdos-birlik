"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "../components/Store";
import Qyran from "../components/Qyran";
import Icon from "../components/Icon";
import { LangSeg, Logo } from "../components/Shell";
import { AVATARS, EXPLAIN_LANGS } from "../../lib/i18n";

export default function Onboarding() {
  const { t, state, setProfile, user, award } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [explain, setExplain] = useState(state.profile.explain || "ru");
  const [name, setName] = useState(state.profile.name || "");
  const [goal, setGoal] = useState(state.profile.goal || "travel");
  const [avatar, setAvatar] = useState(state.profile.avatar || "🌱");

  useEffect(() => {
    if (!name && (state.profile.name || user?.name)) setName(state.profile.name || user?.name || "");
  }, [state.profile.name, user]);

  function finish() {
    const first = !state.profile.onboarded;
    setProfile({ explain, name: name.trim() || "Дос", goal, avatar, onboarded: true });
    if (first) award(10, 5);
    router.push(first ? "/app/level?first=1" : "/app");
  }

  return (
    <div className="auth">
      <header className="l-head">
        <Logo />
        <LangSeg />
      </header>
      <div className="ob card rise">
        <div className="ob-top">
          <Qyran mood={step === 1 ? "happy" : "wow"} size={96} />
          <div>
            <span className="badge">{step} / 2</span>
            <h1>{step === 1 ? t.ob1 : t.ob2}</h1>
            {step === 1 && <p className="muted">{t.ob1Sub}</p>}
          </div>
        </div>

        {step === 1 ? (
          <div className="opt-grid">
            {EXPLAIN_LANGS.map((l) => (
              <button key={l.id} className={`opt ${explain === l.id ? "on" : ""}`} onClick={() => setExplain(l.id)}>
                <span className="opt-e">{l.flag}</span>
                <span>
                  <b>{l.name}</b>
                  <small>{l.hint}</small>
                </span>
                {explain === l.id && <Icon name="check" size={18} stroke={3} className="opt-ok" />}
              </button>
            ))}
          </div>
        ) : (
          <>
            <label className="field">
              <span>{t.nick}</span>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={30} placeholder="Айгерім" />
            </label>
            <div className="field">
              <span>{t.goal}</span>
              <div className="opt-grid two">
                {t.goals.map((g) => (
                  <button key={g.id} className={`opt ${goal === g.id ? "on" : ""}`} onClick={() => setGoal(g.id)}>
                    <span className="opt-e">{g.e}</span>
                    <span>
                      <b>{g.t}</b>
                      <small>{g.d}</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <span>{t.avatar}</span>
              <div className="av-row">
                {AVATARS.map((a) => (
                  <button key={a} className={`av ${avatar === a ? "on" : ""}`} onClick={() => setAvatar(a)} aria-label={a}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="ob-actions">
          {step === 2 && (
            <button className="btn ghost" onClick={() => setStep(1)}>
              <Icon name="left" size={18} /> {t.back}
            </button>
          )}
          <button className="btn gold big" onClick={() => (step === 1 ? setStep(2) : finish())}>
            {step === 1 ? t.cont : t.obDone} <Icon name="right" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
