"use client";
import { ANIMALS } from "../../components/Animals";
import { tx } from "../../../lib/tx";
import { L } from "../../../lib/i18n";
import Link from "next/link";
import { useState } from "react";
import { useApp } from "../../components/Store";
import Qyran from "../../components/Qyran";
import Avatar from "../../components/Avatar";
import LangPicker from "../../components/LangPicker";
import { NatArt } from "../../components/NatArt";
import Icon from "../../components/Icon";
import { LangSeg } from "../../components/Shell";
import { AVATARS, EXPLAIN_LANGS } from "../../../lib/i18n";
import { REGIONS } from "../../../lib/regions";
import { SITES } from "../../../lib/history";

export default function Profile() {
  const { t, lang, state, setProfile, user, logout, resetAll, lvl } = useApp();
  const [name, setName] = useState(state.profile.name);
  const wins = Object.values(state.games || {}).reduce((a, g) => a + (g.wins || 0), 0);

  const li = lang === "kk" ? 0 : lang === "ru" ? 1 : 2;
  const kick = ["Жеке бет", "Личный кабинет", "My space"][li];
  const sub = ["Аватарың, ойын жетістіктерің және баптауларың осында.", "Ваш аватар, достижения и настройки в одном месте.", "Your avatar, achievements and settings in one place."][li];
  return (
    <div className="profile">
      <header className="page-head">
        <div>
          <span className="kicker">{kick}</span>
          <h1>{t.profileTitle}</h1>
          <p>{sub}</p>
        </div>
        <div className="head-tools"><LangPicker /></div>
      </header>

      <div className="prof-grid">
      <aside className="prof-side">
        <section className="card prof-top rise">
          <Avatar value={state.profile.avatar} size={112} className="prof-avatar" />
          <div className="prof-main">
            <h2>{state.profile.name || t.guest}</h2>
            <span className="chip gold">⭐ {t.levelN(lvl.level)} · {state.xp} XP</span>
            <div className="bar">
              <i style={{ width: `${lvl.pct}%` }} />
            </div>
          </div>
          <Qyran mood="happy" size={96} />
        </section>
        <div className="prof-stats">
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
        <div className="prof-art"><NatArt name="dombyra" size={80} /><NatArt name="taqiya" size={70} /><NatArt name="kamshy" size={80} /></div>
      </aside>
      <div className="prof-col">
      <section className="card">
        <h3>{["Рөлің", "Ваша роль", "Your role"][li]}</h3>
        <div className="role-pick">
          {[["student", "🎒", ["Оқушы", "Ученик", "Student"], ["Сабақ оқып, ойын ойнап, сыныпқа кодпен қосыламын.", "Учусь, играю и вступаю в класс по коду.", "I learn, play and join a class with a code."]],
            ["teacher", "🧑‍🏫", ["Мұғалім", "Учитель", "Teacher"], ["Барлық функция бар + «Менің сыныбым»: сынып, тапсырма, белсенділік.", "Все функции + «Мой класс»: классы, задания, активность.", "All features + “My class”: classes, tasks, activity."]]].map(([id, e, n, d]) => (
            <button key={id} className={`role-card ${(state.profile.role || "student") === id ? "on" : ""}`} onClick={() => setProfile({ role: id })}>
              <span className="role-e">{e}</span><b>{n[li]}</b><small>{d[li]}</small>
            </button>
          ))}
        </div>
        {(state.profile.role || "student") !== "teacher" && (
          <Link href="/app/class" className="btn blue small role-join">{["Сыныпқа қосылу (код бойынша)", "Вступить в класс по коду", "Join a class with a code"][li]}</Link>
        )}
      </section>
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
              <button key={a} className={`av ${state.profile.avatar === a ? "on" : ""}`} onClick={() => setProfile({ avatar: a })} aria-label={a}>
                <Avatar value={a} size={60} />
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
          <span>{tx(lang).chPick}</span>
          <p className="muted small">{tx(lang).chNote}</p>
          <div className="skin-grid">
            {ANIMALS.map((a) => (
              <button key={a.id} className={`skin ${(state.profile.skin || "eagle") === a.id ? "on" : ""}`} onClick={() => setProfile({ skin: a.id })} title={L(a.name, lang)}>
                <Qyran skin={a.id} mood="idle" size={64} />
                <b>{L(a.name, lang)}</b>
              </button>
            ))}
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
      </div>
    </div>
  );
}
