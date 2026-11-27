"use client";
import "../../profile.css";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { tx } from "../../../lib/tx";
import { L, AVATARS, EXPLAIN_LANGS, UI_LANGS, UI_LABELS } from "../../../lib/i18n";
import { useApp, DAILY_GOAL, dayKey } from "../../components/Store";
import Avatar from "../../components/Avatar";
import DressUp from "../../components/Dress";
import { AqylChoice } from "../../components/AqylPicker";
import { aqylL } from "../../../lib/aqyl";
import Icon from "../../components/Icon";
import ShellGlyph from "../../components/ShellGlyph";
import { ProfileEmber } from "../../components/ProfileArt";
import { profileL10n } from "../../components/ProfileL10n";

// Бөлімдердің жалпы саны үшін ауыр деректер модульдері (өңірлер, тарих, сабақтар, шығармалар) бет ашылған соң жүктеледі.
// Оған дейін соңғы белгілі сандар көрсетіледі — жүктелгенде нақты мәнмен ауысады.
const TOTALS0 = { course: 282, travel: 20, history: 11, lit: 14, works: null };
let totalsCache = null;
const loadTotals = () =>
  (totalsCache ||= Promise.all([import("../../../lib/courseIndex"), import("../../../lib/regions"), import("../../../lib/history"), import("../../../lib/literature")]).then(([c, r, h, l]) => ({
    course: c.ALL_LESSONS.length,
    travel: r.REGIONS.length,
    history: h.SITES.length,
    lit: l.WORKS.length,
    works: l.WORKS.map((w) => w.id),
  })));

const GOAL_ICON = { travel: "map", study: "book", work: "chart", life: "sun" };
const WEEKS = 8;
const KK_DAYS = ["Дс", "Сс", "Ср", "Бс", "Жм", "Сн", "Жк"];
// Жалпы саны жоқ көрсеткіштер (сөз, жеңіс) үшін бес саты
const STEPS = [1, 5, 15, 40, 100];

// Күні белгілі нақты жазбалардан ғана: сабақ (course.done[].at), шығарма (lit[id]), сақталған сөз (vocab[].at), Sozdik күні, соңғы белсенді күн
function dayMarks(state) {
  const m = {};
  const add = (k) => { if (k) m[k] = (m[k] || 0) + 1; };
  const ts = (v) => { if (typeof v === "number" && v > 0) add(dayKey(new Date(v))); };
  Object.values(state.course?.done || {}).forEach((d) => ts(d?.at));
  Object.values(state.lit || {}).forEach(ts);
  (state.vocab || []).forEach((v) => ts(v?.at));
  Object.keys(state.sozdik?.days || {}).forEach(add);
  if (state.lastDay && !m[state.lastDay]) m[state.lastDay] = 1;
  return m;
}

export default function Profile() {
  const { t, lang, state, setProfile, user, logout, resetAll, lvl } = useApp();
  const [name, setName] = useState(state.profile.name);
  const [savedTick, setSavedTick] = useState(false);
  const touched = useRef(false);
  const P = profileL10n(lang);
  const x = tx(lang);

  // Сақталған ат кейін жүктелсе (құрылғыдан/бұлттан) — өріске түседі; қолданушы жаза бастаса, тимейміз
  useEffect(() => {
    if (!touched.current) setName(state.profile.name || "");
  }, [state.profile.name]);
  useEffect(() => {
    if (!savedTick) return;
    const id = setTimeout(() => setSavedTick(false), 2200);
    return () => clearTimeout(id);
  }, [savedTick]);

  // Күнтізбе тек браузерде есептеледі (сервер мен құрылғы күні әртүрлі болуы мүмкін)
  const [now, setNow] = useState(null);
  useEffect(() => { setNow(new Date()); }, []);

  const role = state.profile.role || "student";
  const cefr = state.cefr;
  const cefrName = cefr ? x.lvlNames?.[cefr] : null;
  const wear = state.shop?.wear || {};
  const xp = state.xp || 0;
  const streak = state.streak || 0;
  const embers = state.embers || 0;
  const todayXp = now && state.today?.date === dayKey(now) ? state.today.xp || 0 : 0;
  const goalPct = Math.min(100, Math.round((todayXp / DAILY_GOAL) * 100));
  const trimmed = (name || "").trim();
  const nameDirty = !!trimmed && trimmed !== (state.profile.name || "");

  const wins = Object.values(state.games || {}).reduce((a, g) => a + (g.wins || 0), 0);
  const lessonsN = Object.keys(state.course?.done || {}).length;
  const wordsN = Object.keys(state.sozdik?.learned || {}).length;
  const stampsN = Object.keys(state.stamps || {}).length;
  const sitesN = Object.keys(state.sites || {}).length;
  const [tot, setTot] = useState(TOTALS0);
  useEffect(() => {
    let on = true;
    loadTotals().then((v) => on && setTot(v)).catch(() => {});
    return () => { on = false; };
  }, []);
  const worksN = tot.works ? tot.works.filter((id) => state.lit?.[id]).length : Math.min(tot.lit, Object.keys(state.lit || {}).length);
  const skills = [
    { id: "course", icon: "book", href: "/app/course", name: t.nav.course, v: lessonsN, total: tot.course, unit: P("uLessons") },
    { id: "sozdik", icon: "pen", href: "/app/sozdik", name: t.nav.sozdik, v: wordsN, unit: P("uWords") },
    { id: "games", icon: "trophy", href: "/app/games", name: t.nav.games, v: wins, unit: P("uWins") },
    { id: "travel", icon: "stamp", href: "/app/travel", name: t.nav.travel, v: stampsN, total: tot.travel, unit: P("uStamps") },
    { id: "history", icon: "scroll", href: "/app/history", name: t.nav.history, v: sitesN, total: tot.history, unit: P("uPlaces") },
    { id: "lit", icon: "sparkle", href: "/app/literature", name: t.nav.lit, v: worksN, total: tot.lit, unit: P("uWorks") },
  ].map((b) => ({ ...b, full: !!b.total && b.v >= b.total }));

  const cal = useMemo(() => {
    if (!now) return null;
    const marks = dayMarks(state);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dow = (end.getDay() + 6) % 7; // дүйсенбі = 0
    const start = new Date(end);
    start.setDate(end.getDate() - dow - (WEEKS - 1) * 7);
    const p2 = (n) => String(n).padStart(2, "0");
    const fmt = (dt) => `${p2(dt.getDate())}.${p2(dt.getMonth() + 1)}`;
    // Апта күндерінің қысқа аты: қазақшаға — дайын тізім (браузерлер көбіне ағылшынша қайтарады), басқа тілге — Intl, болмаса бос
    let wd = null;
    try {
      if (lang !== "kk" && Intl.DateTimeFormat.supportedLocalesOf([lang]).length) wd = new Intl.DateTimeFormat(lang, { weekday: "narrow" });
    } catch {}
    const weeks = [];
    let active = 0;
    for (let w = 0; w < WEEKS; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const dt = new Date(start);
        dt.setDate(start.getDate() + w * 7 + d);
        const future = dt > end;
        const n = future ? 0 : marks[dayKey(dt)] || 0;
        if (n) active++;
        days.push({ key: dayKey(dt), n, future, today: dt.getTime() === end.getTime(), label: fmt(dt) });
      }
      weeks.push({ key: days[0].key, days });
    }
    const names = weeks[0].days.map((_, i) => { const dt = new Date(start); dt.setDate(start.getDate() + i); return lang === "kk" ? KK_DAYS[i] : wd ? wd.format(dt) : ""; });
    return { weeks, names, active, from: weeks[0].days[0].label, to: fmt(end) };
  }, [now, state, lang]);

  const saveName = (e) => {
    e.preventDefault();
    if (!nameDirty) return;
    setProfile({ name: name.trim() || state.profile.name });
    touched.current = false;
    setSavedTick(true);
  };

  const emptyWeeks = Array.from({ length: WEEKS }, (_, i) => ({ key: i, days: Array.from({ length: 7 }, (_, d) => ({ key: d, n: 0, future: true })) }));

  return (
    <div className="profile pf">
      {/* ── 1. Кім екенің: аватар, есім, деңгей және XP · тиын · серия бір жолда ── */}
      <header className="pf-id" aria-labelledby="pf-name">
        <a href="#pf-avatars" className="pf-id-av" aria-label={t.avatar}>
          <Avatar value={state.profile.avatar} size={72} />
          <span className="pf-id-pen" aria-hidden="true"><Icon name="pen" size={13} stroke={2.4} /></span>
        </a>
        <div className="pf-id-main">
          <h1 id="pf-name" dir="auto">{state.profile.name || t.guest}</h1>
          <div className="pf-id-tags">
            <span className="pf-tag">{t.levelN(lvl.level)}</span>
            <Link href="/app/level" className={`pf-tag pf-tag-go ${cefr ? "" : "is-empty"}`}>
              {cefr ? <><b>{cefr}</b>{cefrName ? ` · ${cefrName}` : ""}</> : P("cefrGo")}
              <Icon name="right" size={14} stroke={2.4} className="pf-arrow" />
            </Link>
          </div>
        </div>
        <ul className="pf-stats">
          <li><ShellGlyph name="star" size={20} /><b>{xp}</b><span>{t.xp}</span></li>
          <li><ShellGlyph name="coin" size={20} /><b>{state.coins || 0}</b><span>{t.statsCoins}</span></li>
          <li><ShellGlyph name="flame" size={20} /><b>{streak}</b><span>{t.statsStreak}</span></li>
        </ul>
      </header>

      {/* ── 2. Оқу барысы: деңгей, бүгінгі мақсат, бөлімдер, соңғы 8 апта ── */}
      <section className="pf-card pf-prog" aria-labelledby="pf-prog-h">
        <h2 id="pf-prog-h" className="pf-h"><span className="pf-h-ic"><Icon name="chart" size={18} /></span>{P("progT")}</h2>
        <div className="pf-meters">
          <div className="pf-meter">
            <div className="pf-meter-top"><b>{t.levelN(lvl.level)}</b><span>{P("toNext")(Math.max(0, lvl.to - xp))}</span></div>
            <div className="pf-xp-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={lvl.pct} aria-label={t.levelN(lvl.level)}>
              <i style={{ transform: `scaleX(${Math.max(0.02, lvl.pct / 100)})` }} />
            </div>
          </div>
          <div className={`pf-meter ${goalPct >= 100 ? "done" : ""}`}>
            <div className="pf-meter-top">
              <b>{t.todayGoal}</b>
              <span>{goalPct >= 100 && <Icon name="check" size={14} stroke={3} />}{t.todayGoalTxt(todayXp, DAILY_GOAL)}</span>
            </div>
            <div className="pf-xp-bar gold" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={goalPct} aria-label={t.todayGoal}>
              <i style={{ transform: `scaleX(${goalPct / 100})` }} />
            </div>
          </div>
        </div>

        <ul className="pf-skills">
          {skills.map((b) => (
            <li key={b.id}>
              <Link href={b.href} className={`pf-sk ${b.v ? "has" : ""} ${b.full ? "full" : ""}`}>
                <span className="pf-sk-ic"><Icon name={b.icon} size={17} /></span>
                <span className="pf-sk-name">{b.name}</span>
                <span className="pf-sk-v"><b>{b.v}</b>{b.total ? <i>/{b.total}</i> : null} <em>{b.unit}</em></span>
                {b.total ? (
                  <span className="pf-xp-bar pf-sk-bar" aria-hidden="true"><i style={{ transform: `scaleX(${Math.min(1, b.v / b.total)})` }} /></span>
                ) : (
                  <span className="pf-sk-dots" aria-hidden="true">{STEPS.map((s) => <i key={s} className={b.v >= s ? "on" : ""} />)}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="pf-act">
          <div className="pf-cal" role="img" aria-label={cal ? `${P("daysT")}: ${P("activeDays")(cal.active)} (${cal.from} – ${cal.to})` : P("daysT")}>
            <div className="pf-cal-names" aria-hidden="true">{(cal?.names || Array(7).fill("")).map((n, i) => <span key={i}>{n}</span>)}</div>
            {(cal?.weeks || emptyWeeks).map((w, wi) => (
              <div key={w.key} className="pf-cal-week" style={{ "--w": wi }} aria-hidden="true">
                {w.days.map((d) => (
                  <i key={d.key} className={`${d.future ? "fut" : ""} ${d.today ? "today" : ""}`} data-n={d.n ? Math.min(3, d.n) : 0} title={d.label ? `${d.label}${d.n ? ` · ${d.n}` : ""}` : undefined} />
                ))}
              </div>
            ))}
          </div>
          <div className="pf-act-side">
            <h3>{P("daysT")}</h3>
            <p className="pf-act-n">{cal ? P("activeDays")(cal.active) : " "}{cal && <span>{cal.from} – {cal.to}</span>}</p>
            <span className="pf-cal-legend" aria-hidden="true">{P("less")} <i data-n="0" /><i data-n="1" /><i data-n="2" /><i data-n="3" /> {P("more")}</span>
          </div>
          <p className="pf-embers">
            <span className="pf-embers-art" role="img" aria-label={`${P("ember")}: ${embers}/2`}>
              <ProfileEmber on={embers > 0} /><ProfileEmber on={embers > 1} />
            </span>
            <small>{P("emberTip")}</small>
          </p>
        </div>
      </section>

      {/* ── 3. Баптаулар ── */}
      <div className="pf-set">
        <div className="pf-col">
          <section className="pf-card" id="pf-about" aria-labelledby="pf-about-h">
            <h2 id="pf-about-h" className="pf-h"><span className="pf-h-ic"><Icon name="user" size={18} /></span>{P("aboutT")}</h2>
            <form className="pf-field" onSubmit={saveName}>
              <label htmlFor="pf-nick">{t.nick}</label>
              <div className="pf-name-row">
                <input id="pf-nick" className="input" value={name} onChange={(e) => { touched.current = true; setName(e.target.value); }} maxLength={30} autoComplete="nickname" enterKeyHint="done" />
                <button type="submit" className="btn pf-btn-main" disabled={!nameDirty}>{t.saveBtn}</button>
              </div>
              <p className="pf-saved" role="status" aria-live="polite">{savedTick && <><Icon name="check" size={16} /> {t.saved}</>}</p>
            </form>
            <fieldset className="pf-field" id="pf-avatars">
              <legend>{t.avatar}</legend>
              <div className="pf-avs">
                {AVATARS.map((a) => (
                  <button key={a} type="button" className={`pf-av ${state.profile.avatar === a ? "on" : ""}`} onClick={() => setProfile({ avatar: a })} aria-label={a.replace("av:", "")} aria-pressed={state.profile.avatar === a}>
                    <Avatar value={a} size={52} />
                    {state.profile.avatar === a && <span className="pf-tick"><Icon name="check" size={12} stroke={3} /></span>}
                  </button>
                ))}
              </div>
            </fieldset>
            {t.goals?.length > 0 && (
              <fieldset className="pf-field">
                <legend>{t.goal}</legend>
                <div className="pf-chips">
                  {t.goals.map((g) => (
                    <button key={g.id} type="button" className={`pf-chip ${state.profile.goal === g.id ? "on" : ""}`} onClick={() => setProfile({ goal: g.id })} aria-pressed={state.profile.goal === g.id}>
                      <Icon name={GOAL_ICON[g.id] || "target"} size={17} /> {g.t}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            <fieldset className="pf-field">
              <legend>{P("role")}</legend>
              <div className="pf-roles">
                {[["student", "book"], ["teacher", "chat"]].map(([id, ic]) => (
                  <button key={id} type="button" className={`pf-role ${role === id ? "on" : ""}`} onClick={() => setProfile({ role: id })} aria-pressed={role === id}>
                    <span className="pf-role-ic"><Icon name={ic} size={18} /></span>
                    <span className="pf-role-txt"><b>{P(id)}</b><small>{P(`${id}D`)}</small></span>
                  </button>
                ))}
              </div>
              <Link href="/app/class" className="pf-go">
                {role === "teacher" ? t.navLong?.class || t.nav.class : P("join")} <Icon name="right" size={16} className="pf-arrow" />
              </Link>
            </fieldset>
          </section>
        </div>

        <div className="pf-col">
          <section className="pf-card pf-aq" id="pf-aqyl" aria-labelledby="pf-aq-h">
            <h2 id="pf-aq-h" className="pf-h"><span className="pf-h-ic"><ShellGlyph name="feather" size={18} /></span>{P("aqylT")}</h2>
            <div className="pf-aq-row">
              <div className="pf-aq-fig">
                <DressUp wear={wear} size={128} mood="happy" />
              </div>
              <div className="pf-aq-side">
                <p className="pf-note">{P("aqylS")}</p>
                <b className="pf-aq-look">{aqylL(lang).look}</b>
                <AqylChoice size={56} />
                <Link href="/app/shop" className="btn pf-btn-main pf-aq-shop"><Icon name="bag" size={18} /> {P("aqShop")}</Link>
              </div>
            </div>
          </section>

          <section className="pf-card" id="pf-lang" aria-labelledby="pf-lang-h">
            <h2 id="pf-lang-h" className="pf-h"><span className="pf-h-ic"><Icon name="globe" size={18} /></span>{P("langs")}</h2>
            <div className="pf-field">
              <span className="pf-label" id="pf-ui-l">{t.uiLang}</span>
              <div className="pf-seg" role="group" aria-labelledby="pf-ui-l">
                {UI_LANGS.map((l) => (
                  <button key={l} type="button" lang={l} className={state.profile.ui === l ? "on" : ""} onClick={() => setProfile({ ui: l })} aria-pressed={state.profile.ui === l}>
                    {UI_LABELS[l]}
                  </button>
                ))}
              </div>
            </div>
            <fieldset className="pf-field">
              <legend>{t.explainLang}</legend>
              <div className="pf-langs">
                {EXPLAIN_LANGS.map((l) => (
                  <button key={l.id} type="button" lang={l.id} className={`pf-lng ${state.profile.explain === l.id ? "on" : ""}`} onClick={() => setProfile({ explain: l.id })} aria-pressed={state.profile.explain === l.id}>
                    <span className="pf-lng-code" aria-hidden="true">{l.id}</span>
                    <b>{l.name}</b>
                  </button>
                ))}
              </div>
              <p className="pf-note">{P("explainNote")}</p>
            </fieldset>
          </section>
        </div>
      </div>

      {/* ── 4. Аккаунт ── */}
      <section className="pf-card pf-acc" id="pf-acc" aria-labelledby="pf-acc-h">
        <h2 id="pf-acc-h" className="pf-h"><span className="pf-h-ic"><Icon name="lock" size={18} /></span>{t.account}</h2>
        {user ? (
          <div className="pf-acc-row">
            <p className="pf-acc-who"><span className="pf-ok"><Icon name="check" size={14} stroke={3} /></span><span><b>{user.email}</b><small>{t.cloudOk}</small></span></p>
            <button type="button" className="btn ghost pf-acc-btn" onClick={logout}><Icon name="logout" size={18} /> {t.logout}</button>
          </div>
        ) : (
          <div className="pf-acc-row">
            <p className="pf-acc-demo">{t.demo}</p>
            <div className="pf-acc-btns">
              <Link href="/register" className="btn pf-btn-main pf-acc-btn">{t.register}</Link>
              <Link href="/login" className="btn ghost pf-acc-btn">{t.login}</Link>
            </div>
          </div>
        )}
        <div className="pf-danger">
          <p>{P("dangerNote")}</p>
          <button type="button" className="pf-danger-btn" onClick={() => { if (window.confirm(t.resetAsk)) resetAll(); }}>
            <Icon name="refresh" size={16} /> {t.resetProgress}
          </button>
        </div>
      </section>
    </div>
  );
}
