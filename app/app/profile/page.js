"use client";
import "../../profile.css";
import { ANIMALS } from "../../components/Animals";
import { tx } from "../../../lib/tx";
import { L } from "../../../lib/i18n";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useApp, DAILY_GOAL, dayKey } from "../../components/Store";
import Qyran from "../../components/Qyran";
import Avatar from "../../components/Avatar";
import DressUp from "../../components/Dress";
import Icon from "../../components/Icon";
import { LangSeg } from "../../components/Shell";
import { ProfileTumar, ProfileSeal, ProfileTree, ProfileEmber } from "../../components/ProfileArt";
import { profileL10n } from "../../components/ProfileL10n";
import { AVATARS, EXPLAIN_LANGS } from "../../../lib/i18n";

// Бөлімдердің жалпы саны үшін ауыр деректер модульдері (өңірлер, тарих, сабақтар, шығармалар) бет ашылған соң жүктеледі.
// Оған дейін соңғы белгілі сандар көрсетіледі — жүктелгенде нақты мәнмен ауысады.
const TOTALS0 = { course: 282, travel: 20, history: 11, lit: 15, works: null };
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
// Жалпы саны жоқ көрсеткіштер (сөз, жеңіс) үшін жапырақ шектері
const STEPS = [1, 5, 15, 40, 100];
const leavesOf = (v, total) => (total ? (v <= 0 ? 0 : Math.max(1, Math.min(5, Math.floor((v / total) * 5)))) : STEPS.filter((s) => v >= s).length);

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
  const wins = Object.values(state.games || {}).reduce((a, g) => a + (g.wins || 0), 0);
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
  const goal = (t.goals || []).find((g) => g.id === state.profile.goal);
  const cefr = state.cefr;
  const cefrName = cefr ? x.lvlNames?.[cefr] : null;
  const wear = state.shop?.wear || {};
  const skin = state.profile.skin || "eagle";
  const streak = state.streak || 0;
  const embers = state.embers || 0;
  const todayXp = now && state.today?.date === dayKey(now) ? state.today.xp || 0 : 0;
  const goalPct = Math.min(100, Math.round((todayXp / DAILY_GOAL) * 100));
  const trimmed = (name || "").trim();
  const nameDirty = !!trimmed && trimmed !== (state.profile.name || "");

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
  const branches = [
    { id: "course", icon: "book", href: "/app/course", name: t.nav.course, v: lessonsN, total: tot.course, unit: P("uLessons") },
    { id: "sozdik", icon: "pen", href: "/app/sozdik", name: t.nav.sozdik, v: wordsN, unit: P("uWords") },
    { id: "games", icon: "trophy", href: "/app/games", name: t.nav.games, v: wins, unit: P("uWins") },
    { id: "travel", icon: "stamp", href: "/app/travel", name: t.nav.travel, v: stampsN, total: tot.travel, unit: P("uStamps") },
    { id: "history", icon: "scroll", href: "/app/history", name: t.nav.history, v: sitesN, total: tot.history, unit: P("uPlaces") },
    { id: "lit", icon: "sparkle", href: "/app/literature", name: t.nav.lit, v: worksN, total: tot.lit, unit: P("uWorks") },
  ].map((b) => ({ ...b, leaves: leavesOf(b.v, b.total), full: !!b.total && b.v >= b.total }));

  const cal = useMemo(() => {
    if (!now) return null;
    const marks = dayMarks(state);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dow = (end.getDay() + 6) % 7; // дүйсенбі = 0
    const start = new Date(end);
    start.setDate(end.getDate() - dow - (WEEKS - 1) * 7);
    const p2 = (n) => String(n).padStart(2, "0");
    const fmt = { format: (dt) => `${p2(dt.getDate())}.${p2(dt.getMonth() + 1)}` };
    // Апта күндерінің қысқа аты: браузер бұл тілді білмесе (мысалы, қазақша) — дайын тізім не бос
    let wd = null;
    try {
      if (Intl.DateTimeFormat.supportedLocalesOf([lang]).length) wd = new Intl.DateTimeFormat(lang, { weekday: "narrow" });
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
        days.push({ key: dayKey(dt), n, future, today: dt.getTime() === end.getTime(), label: fmt.format(dt) });
      }
      weeks.push({ key: days[0].key, days, from: days[0].label });
    }
    const names = weeks[0].days.map((_, i) => { const dt = new Date(start); dt.setDate(start.getDate() + i); return wd ? wd.format(dt) : lang === "kk" ? KK_DAYS[i] : ""; });
    return { weeks, names, active, from: weeks[0].days[0].label, to: fmt.format(end) };
  }, [now, state, lang]);

  const saveName = (e) => {
    e.preventDefault();
    if (!nameDirty) return;
    setProfile({ name: name.trim() || state.profile.name });
    touched.current = false;
    setSavedTick(true);
  };

  return (
    <div className="profile pf">
      <header className="page-head">
        <div>
          <span className="kicker">{P("kick")}</span>
          <h1>{t.profileTitle}</h1>
          <p>{P("sub")}</p>
        </div>
      </header>

      {/* ── Шежіре беті: тұмар-таңба, есім, деңгей мөрі ── */}
      <section className="pf-hero" aria-labelledby="pf-name">
        <div className="pf-crest">
          <ProfileTumar avatar={state.profile.avatar} />
        </div>
        <div className="pf-id">
          <span className="pf-cap">{P("heroCap")}</span>
          <h2 id="pf-name">{state.profile.name || t.guest}</h2>
          <dl className="pf-pass">
            <div><dt>{t.level}</dt><dd>{t.levelN(lvl.level)}</dd></div>
            <div><dt>{P("role")}</dt><dd>{P(role === "teacher" ? "teacher" : "student")}</dd></div>
            {goal && <div><dt>{t.goal}</dt><dd>{goal.t}</dd></div>}
          </dl>
          <div className="pf-xp">
            <div className="pf-xp-top"><b>{state.xp || 0} XP</b><span>{P("toNext")(Math.max(0, lvl.to - (state.xp || 0)))}</span></div>
            <div className="pf-xp-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={lvl.pct} aria-label={t.levelN(lvl.level)}>
              <i style={{ transform: `scaleX(${Math.max(0.02, lvl.pct / 100)})` }} />
            </div>
          </div>
        </div>
        <div className="pf-hero-side">
          <Link href="/app/level" className={`pf-seal ${cefr ? "" : "is-empty"}`}>
            <ProfileSeal code={cefr} empty={!cefr} />
            <span className="pf-seal-txt">
              <small>{cefr ? x.lvlResult : t.nav.level}</small>
              <b>{cefr ? `${cefr}${cefrName ? ` · ${cefrName}` : ""}` : x.lvlBanner}</b>
            </span>
          </Link>
          <Link href="/app/shop" className="pf-mate" aria-label={t.nav.shop}>
            <DressUp skin={skin} wear={wear} size={96} mood="happy" />
            <span><Icon name="bag" size={15} /> {t.nav.shop}</span>
          </Link>
        </div>
      </section>

      <nav className="pf-jump" aria-label={t.profileTitle}>
        <a href="#pf-look"><Icon name="user" size={16} /> {P("look")}</a>
        <a href="#pf-lang"><Icon name="globe" size={16} /> {P("langs")}</a>
        <a href="#pf-role"><Icon name="book" size={16} /> {P("role")}</a>
        <a href="#pf-acc"><Icon name="lock" size={16} /> {t.account}</a>
      </nav>

      {/* ── Бәйтерек: әр бұтақ — бір дағды ── */}
      <section className="pf-sec pf-tree" aria-labelledby="pf-tree-h">
        <div className="pf-sec-head">
          <h2 id="pf-tree-h">{P("treeT")}</h2>
          <p>{P("treeS")}</p>
        </div>
        <div className="pf-tree-grid">
          <div className="pf-tree-fig"><ProfileTree branches={branches} level={lvl.level} /></div>
          {branches.map((b, i) => (
            <Link key={b.id} href={b.href} className={`pf-leafcard ${b.v ? "has" : ""} ${b.full ? "full" : ""} ${i > 2 ? "r" : "l"}`} style={{ "--row": (i % 3) + 1, "--i": i }}>
              <span className="pf-lc-ic"><Icon name={b.icon} size={18} /></span>
              <span className="pf-lc-txt">
                <small>{b.name}</small>
                <b>{b.v}{b.total ? <i>/{b.total}</i> : null} <em>{b.unit}</em></b>
              </span>
              {b.total ? (
                <span className="pf-lc-bar" aria-hidden="true"><i style={{ transform: `scaleX(${Math.min(1, b.v / b.total)})` }} /></span>
              ) : (
                <span className="pf-lc-dots" aria-hidden="true">{STEPS.map((s) => <i key={s} className={b.v >= s ? "on" : ""} />)}</span>
              )}
            </Link>
          ))}
        </div>
        <ul className="pf-roots">
          <li><Icon name="star" size={18} /><b>{state.xp || 0}</b><span>{t.statsXp}</span></li>
          <li><Icon name="coin" size={18} /><b>{state.coins || 0}</b><span>{t.statsCoins}</span></li>
          <li><Icon name="flame" size={18} /><b>{streak}</b><span>{t.statsStreak}</span></li>
          <li><Icon name="check" size={18} /><b>{state.vocab?.length || 0}</b><span>{P("savedWords")}</span></li>
        </ul>
      </section>

      {/* ── Күн іздері: ошақ (қатар күн, шоқ, бүгінгі мақсат) + 8 апталық күнтізбе ── */}
      <section className="pf-sec pf-days" aria-labelledby="pf-days-h">
        <div className="pf-hearth">
          <div className="pf-streak">
            <span className="pf-streak-n"><Icon name="flame" size={26} /><b>{streak}</b></span>
            <span className="pf-streak-l">{t.statsStreak}</span>
          </div>
          <div className="pf-embers" title={P("emberTip")}>
            <span className="pf-embers-art" role="img" aria-label={`${P("ember")}: ${embers}/2`}>
              <ProfileEmber on={embers > 0} /><ProfileEmber on={embers > 1} />
            </span>
            <small>{P("emberTip")}</small>
          </div>
          <div className="pf-today">
            <div className="pf-today-top"><span>{t.todayGoal}</span><b>{t.todayGoalTxt(todayXp, DAILY_GOAL)}</b></div>
            <div className="pf-xp-bar gold" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={goalPct} aria-label={t.todayGoal}>
              <i style={{ transform: `scaleX(${goalPct / 100})` }} />
            </div>
          </div>
        </div>
        <div className="pf-cal">
          <div className="pf-sec-head">
            <h2 id="pf-days-h">{P("daysT")}</h2>
            <p>{P("daysS")}</p>
          </div>
          <div className="pf-cal-wrap">
            <div className="pf-cal-grid" role="img" aria-label={cal ? `${P("activeDays")(cal.active)} (${cal.from} – ${cal.to})` : P("daysT")}>
              <div className="pf-cal-names" aria-hidden="true">{(cal?.names || Array(7).fill("")).map((n, i) => <span key={i}>{n}</span>)}</div>
              {(cal?.weeks || Array.from({ length: WEEKS }, (_, i) => ({ key: i, days: Array.from({ length: 7 }, (_, d) => ({ key: d, n: 0, future: true })) }))).map((w, wi) => (
                <div key={w.key} className="pf-cal-week" style={{ "--w": wi }}>
                  {w.days.map((d) => (
                    <i key={d.key} className={`${d.future ? "fut" : ""} ${d.today ? "today" : ""}`} data-n={d.n ? Math.min(3, d.n) : 0} title={d.label ? `${d.label}${d.n ? ` · ${d.n}` : ""}` : undefined} />
                  ))}
                </div>
              ))}
            </div>
            <div className="pf-cal-foot">
              <b>{cal ? P("activeDays")(cal.active) : " "}</b>
              {cal && <span className="pf-cal-range">{cal.from} – {cal.to}</span>}
              <span className="pf-cal-legend" aria-hidden="true">{P("less")} <i data-n="0" /><i data-n="1" /><i data-n="2" /><i data-n="3" /> {P("more")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Баптаулар ── */}
      <div className="pf-set">
        <section className="pf-card pf-look" id="pf-look" aria-labelledby="pf-look-h">
          <h3 id="pf-look-h"><span className="pf-h-ic"><Icon name="user" size={18} /></span>{P("look")}</h3>
          <form className="pf-field" onSubmit={saveName}>
            <label htmlFor="pf-nick">{t.nick}</label>
            <div className="pf-name-row">
              <input id="pf-nick" className="input" value={name} onChange={(e) => { touched.current = true; setName(e.target.value); }} maxLength={30} autoComplete="nickname" enterKeyHint="done" />
              <button type="submit" className="btn blue" disabled={!nameDirty}>{t.saveBtn}</button>
            </div>
            <p className="pf-saved" role="status" aria-live="polite">{savedTick && <><Icon name="check" size={16} /> {t.saved}</>}</p>
          </form>
          <fieldset className="pf-field">
            <legend>{t.avatar}</legend>
            <div className="pf-avs">
              {AVATARS.map((a) => (
                <button key={a} type="button" className={`pf-av ${state.profile.avatar === a ? "on" : ""}`} onClick={() => setProfile({ avatar: a })} aria-label={a.replace("av:", "")} aria-pressed={state.profile.avatar === a}>
                  <Avatar value={a} size={56} />
                  {state.profile.avatar === a && <span className="pf-tick"><Icon name="check" size={12} stroke={3} /></span>}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="pf-field">
            <legend>{x.chPick}</legend>
            <p className="pf-note">{x.chNote}</p>
            <div className="pf-skins">
              {ANIMALS.map((a) => (
                <button key={a.id} type="button" className={`pf-skin ${skin === a.id ? "on" : ""}`} onClick={() => setProfile({ skin: a.id })} aria-pressed={skin === a.id}>
                  <Qyran skin={a.id} mood="idle" size={58} />
                  <b>{L(a.name, lang)}</b>
                  {skin === a.id && <span className="pf-tick"><Icon name="check" size={12} stroke={3} /></span>}
                </button>
              ))}
            </div>
          </fieldset>
          {t.goals?.length > 0 && (
            <fieldset className="pf-field">
              <legend>{t.goal}</legend>
              <div className="pf-goals">
                {t.goals.map((g) => (
                  <button key={g.id} type="button" className={`pf-goal ${state.profile.goal === g.id ? "on" : ""}`} onClick={() => setProfile({ goal: g.id })} aria-pressed={state.profile.goal === g.id}>
                    <Icon name={GOAL_ICON[g.id] || "target"} size={18} /> {g.t}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
        </section>

        <div className="pf-set-col">
          <section className="pf-card" id="pf-lang" aria-labelledby="pf-lang-h">
            <h3 id="pf-lang-h"><span className="pf-h-ic"><Icon name="globe" size={18} /></span>{P("langs")}</h3>
            <div className="pf-field">
              <span className="pf-label">{t.uiLang}</span>
              <div><LangSeg /></div>
            </div>
            <fieldset className="pf-field">
              <legend>{t.explainLang}</legend>
              <div className="pf-langs">
                {EXPLAIN_LANGS.map((l) => (
                  <button key={l.id} type="button" lang={l.id} className={`pf-lng ${state.profile.explain === l.id ? "on" : ""}`} onClick={() => setProfile({ explain: l.id })} aria-pressed={state.profile.explain === l.id}>
                    <span className="pf-lng-code" aria-hidden="true">{l.id}</span>
                    <span className="pf-lng-txt"><b>{l.name}</b><small>{l.hint}</small></span>
                  </button>
                ))}
              </div>
            </fieldset>
          </section>

          <section className="pf-card" id="pf-role" aria-labelledby="pf-role-h">
            <h3 id="pf-role-h"><span className="pf-h-ic"><Icon name="book" size={18} /></span>{P("role")}</h3>
            <div className="pf-roles">
              {[["student", "book"], ["teacher", "chat"]].map(([id, ic]) => (
                <button key={id} type="button" className={`pf-role ${role === id ? "on" : ""}`} onClick={() => setProfile({ role: id })} aria-pressed={role === id}>
                  <span className="pf-role-ic"><Icon name={ic} size={20} /></span>
                  <b>{P(id)}</b>
                  <small>{P(`${id}D`)}</small>
                  {role === id && <span className="pf-tick"><Icon name="check" size={12} stroke={3} /></span>}
                </button>
              ))}
            </div>
            {role !== "teacher" ? (
              <Link href="/app/class" className="btn blue small pf-role-go">{P("join")} <Icon name="right" size={16} className="pf-arrow" /></Link>
            ) : (
              <Link href="/app/class" className="btn blue small pf-role-go">{t.nav.class} <Icon name="right" size={16} className="pf-arrow" /></Link>
            )}
          </section>

          <section className="pf-card" id="pf-acc" aria-labelledby="pf-acc-h">
            <h3 id="pf-acc-h"><span className="pf-h-ic"><Icon name="lock" size={18} /></span>{t.account}</h3>
            {user ? (
              <div className="pf-acc">
                <p className="pf-acc-mail"><span className="pf-ok"><Icon name="check" size={14} stroke={3} /></span><span><b>{user.email}</b><small>{t.cloudOk}</small></span></p>
                <button type="button" className="btn ghost" onClick={logout}>
                  <Icon name="logout" size={18} /> {t.logout}
                </button>
              </div>
            ) : (
              <div className="pf-acc">
                <p className="pf-acc-demo">{t.demo}</p>
                <div className="pf-acc-btns">
                  <Link href="/register" className="btn gold">{t.register}</Link>
                  <Link href="/login" className="btn ghost">{t.login}</Link>
                </div>
              </div>
            )}
            <div className="pf-danger">
              <p>{P("dangerNote")}</p>
              <button
                type="button"
                className="pf-danger-btn"
                onClick={() => {
                  if (window.confirm(t.resetAsk)) resetAll();
                }}
              >
                <Icon name="refresh" size={16} /> {t.resetProgress}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
