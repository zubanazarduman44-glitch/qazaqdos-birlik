"use client";
import Link from "next/link";
import { useState } from "react";
import { useApp } from "../../components/Store";
import Qyran from "../../components/Qyran";
import Icon from "../../components/Icon";
import { LangSeg } from "../../components/Shell";
import { AVATARS, EXPLAIN_LANGS } from "../../../lib/i18n";
import { REGIONS } from "../../../lib/regions";
import { SITES } from "../../../lib/history";

export default function Profile() {
  const { t, state, setProfile, user, logout, resetAll, lvl } = useApp();
  const [name, setName] = useState(state.profile.name);
  const wins = Object.values(state.games || {}).reduce((a, g) => a + (g.wins || 0), 0);

  return (
    <div className="profile">
      <header className="page-head">
        <div>
          <h1>{t.profileTitle}</h1>
        </div>
      </header>

      <section className="card prof-top">
        <span className="prof-av">{state.profile.avatar}</span>
        <div className="prof-main">
          <h2>{state.profile.name || t.guest}</h2>
          <span className="chip gold">⭐ {t.levelN(lvl.level)} · {state.xp} XP</span>
          <div className="bar">
            <i style={{ width: `${lvl.pct}%` }} />
          </div>
        </div>
        <Qyran mood="happy" size={90} />
      </section>

      <div className="grid g4">
        {[
          ["🛂", `${Object.keys(state.stamps || {}).length}/${REGIONS.length}`, t.statsStamps],
          ["🏺", `${Object.keys(state.sites || {}).length}/${SITES.length}`, t.nav.history],
          ["🏆", wins, t.wins],
          ["📚", state.vocab?.length || 0, t.saveWord],
        ].map(([e, v, l]) => (
          <div key={l} className="card tight stat">
            <span className="stat-e">{e}</span>
            <b>{v}</b>
            <small className="muted">{l}</small>
          </div>
        ))}
      </div>

      <section className="card">
        <label className="field">
          <span>{t.nick}</span>
          <div className="row-inline">
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={30} />
            <button className="btn blue" onClick={() => setProfile({ name: name.trim() || state.profile.name })}>
              {t.saveBtn}
            </button>
          </div>
        </label>
        <div className="field">
          <span>{t.avatar}</span>
          <div className="av-row">
            {AVATARS.map((a) => (
              <button key={a} className={`av ${state.profile.avatar === a ? "on" : ""}`} onClick={() => setProfile({ avatar: a })}>
                {a}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <span>{t.uiLang}</span>
          <div>
            <LangSeg />
          </div>
        </div>
        <div className="field">
          <span>{t.explainLang}</span>
          <div className="opt-grid">
            {EXPLAIN_LANGS.map((l) => (
              <button key={l.id} className={`opt ${state.profile.explain === l.id ? "on" : ""}`} onClick={() => setProfile({ explain: l.id })}>
                <span className="opt-e">{l.flag}</span>
                <span>
                  <b>{l.name}</b>
                  <small>{l.hint}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <span>{t.theme}</span>
          <div className="seg">
            {[
              [null, "Auto"],
              ["light", t.light],
              ["dark", t.dark],
            ].map(([v, l]) => (
              <button key={l} className={state.profile.theme === v ? "on" : ""} onClick={() => setProfile({ theme: v })}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="card">
        <h3>{t.account}</h3>
        {user ? (
          <div className="acc">
            <p>
              <Icon name="check" size={16} /> {user.email} · <span className="muted">{t.cloudOk}</span>
            </p>
            <button className="btn ghost" onClick={logout}>
              <Icon name="logout" size={18} /> {t.logout}
            </button>
          </div>
        ) : (
          <div className="acc">
            <p className="muted">{t.demo}</p>
            <div className="row-btns" style={{ justifyContent: "flex-start" }}>
              <Link href="/register" className="btn gold">
                {t.register}
              </Link>
              <Link href="/login" className="btn ghost">
                {t.login}
              </Link>
            </div>
          </div>
        )}
        <button
          className="btn ghost small danger-btn"
          onClick={() => {
            if (window.confirm(t.resetAsk)) resetAll();
          }}
        >
          {t.resetProgress}
        </button>
      </section>
    </div>
  );
}
