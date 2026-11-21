"use client";
import Link from "next/link";
import Avatar from "./Avatar";
import ClassSync from "./ClassSync";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp, DAILY_GOAL, dayKey } from "./Store";
import Icon from "./Icon";
import Qyran from "./Qyran";
import QyzylMark from "./QyzylMark";
import ShellGlyph from "./ShellGlyph";
import WordTap from "./WordTap";
import { authed } from "../../lib/auth";
import { whenIdle } from "../../lib/idle";
import { UI_LANGS, UI_LABELS } from "../../lib/i18n";
import { SECTIONS, SECTION_HINT, pickL, sectionOf, secVars } from "../../lib/sections";

export const NAV = [
  { href: "/app", key: "home", icon: "home" },
  { href: "/app/course", key: "course", icon: "book" },
  { href: "/app/sozdik", key: "sozdik", icon: "stamp" },
  { href: "/app/tuzel", key: "tuzel", icon: "pen" },
  { href: "/app/games", key: "games", icon: "target" },
  { href: "/app/qyran", key: "chat", icon: "chat" },
  { href: "/app/vr", key: "vr", icon: "sparkle" },
  { href: "/app/saiys", key: "saiys", icon: "trophy" },
  { href: "/app/travel", key: "travel", icon: "map" },
  { href: "/app/history", key: "history", icon: "globe" },
  { href: "/app/literature", key: "lit", icon: "scroll" },
  { href: "/app/class", key: "class", icon: "user" },
  { href: "/app/shop", key: "shop", icon: "bag" },
];
const MOBILE = ["home", "course", "games", "chat"];
// Бүйір мәзір топтары: «Басты» → оқу → тәжірибе → әлем → қауым
const GROUPS = [
  { id: "top", keys: ["home"] },
  { id: "learn", name: { kk: "Оқу", ru: "Учёба", en: "Learn", zh: "学习", es: "Aprender", de: "Lernen", fr: "Apprendre", tr: "Öğren", ar: "تعلّم", ko: "학습", ja: "学ぶ" }, keys: ["course", "sozdik", "tuzel"] },
  { id: "practice", name: { kk: "Тәжірибе", ru: "Практика", en: "Practise", zh: "练习", es: "Practicar", de: "Üben", fr: "Pratiquer", tr: "Pratik", ar: "تدرّب", ko: "연습", ja: "練習" }, keys: ["games", "chat", "vr", "saiys"] },
  { id: "world", name: { kk: "Әлем", ru: "Мир", en: "World", zh: "世界", es: "Mundo", de: "Welt", fr: "Monde", tr: "Dünya", ar: "العالم", ko: "세계", ja: "世界" }, keys: ["travel", "history", "lit"] },
  { id: "community", name: { kk: "Қауым", ru: "Сообщество", en: "Community", zh: "社区", es: "Comunidad", de: "Gemeinschaft", fr: "Communauté", tr: "Topluluk", ar: "المجتمع", ko: "커뮤니티", ja: "コミュニティ" }, keys: ["class", "shop"] },
];
const groupOf = (key) => GROUPS.find((g) => g.keys.includes(key));
const PROVERB = "Өнер алды — қызыл тіл";

export function Logo({ small }) {
  return (
    <Link href="/" className={`logo ${small ? "sm" : ""}`} aria-label="Qyzyl til">
      <span className="logo-mark">
        <QyzylMark size={small ? 32 : 38} />
      </span>
      <span className="logo-word">
        Qyzyl <b>til</b>
      </span>
    </Link>
  );
}

export function LangSeg() {
  const { state, setProfile } = useApp();
  return (
    <div className="seg" role="group">
      {UI_LANGS.map((l) => (
        <button key={l} className={state.profile.ui === l ? "on" : ""} onClick={() => setProfile({ ui: l })}>
          {UI_LABELS[l]}
        </button>
      ))}
    </div>
  );
}

// Жоғарғы жолақ: күндік мақсат, от (серия), тиын, деңгей. Сан өзгергенде key ауысып, CSS «секіру» анимациясы ойнайды.
export function Stats() {
  const { state, lvl, t } = useApp();
  const todayXp = state.today?.date === dayKey() ? state.today.xp || 0 : 0;
  const goalPct = Math.max(0, Math.min(100, Math.round((todayXp / DAILY_GOAL) * 100)));
  const done = todayXp >= DAILY_GOAL;
  const streak = state.streak || 0;
  const coins = state.coins || 0;
  const C = 2 * Math.PI * 9;
  return (
    <div className="stats-pills">
      <span className={`pill sx-chip sx-goal ${done ? "done" : ""}`} title={t.todayGoal} role="img" aria-label={`${t.todayGoal}: ${t.todayGoalTxt(Math.min(todayXp, 9999), DAILY_GOAL)}`}>
        <svg className="sx-ring" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" className="sx-ring-bg" strokeWidth="3.2" />
          <circle cx="12" cy="12" r="9" fill="none" className="sx-ring-fg" strokeWidth="3.2" strokeLinecap="round" strokeDasharray={`${(C * goalPct) / 100} ${C}`} transform="rotate(-90 12 12)" />
          {done && <path d="m8.2 12.3 2.6 2.6 5-5.4" fill="none" className="sx-ring-ok" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
        <span className="sx-goal-t" aria-hidden="true">
          <small>{t.todayGoal}</small>
          <b key={todayXp} className="sx-num">{t.todayGoalTxt(todayXp, DAILY_GOAL)}</b>
        </span>
      </span>
      <span className={`pill sx-chip sx-fire ${streak ? "" : "cold"}`} title={t.streak} role="img" aria-label={`${t.streak}: ${streak}`}>
        <ShellGlyph name="flame" size={18} />
        <b key={streak} className="sx-num" aria-hidden="true">{streak}</b>
      </span>
      <span className="pill sx-chip sx-coin" title={t.coins} role="img" aria-label={`${t.coins}: ${coins}`}>
        <ShellGlyph name="coin" size={18} />
        <b key={coins} className="sx-num" aria-hidden="true">{coins}</b>
      </span>
      <span className="pill lvl sx-chip sx-lvl" title={t.level}>
        <ShellGlyph name="star" size={18} />
        <b key={lvl.level} className="sx-num">{t.levelN(lvl.level)}</b>
        <i className="pill-bar">
          <i style={{ width: `${lvl.pct}%` }} />
        </i>
      </span>
    </div>
  );
}

export default function Shell({ children }) {
  const { state, ready, user, t, authReady, lang } = useApp();
  const path = usePathname();
  const router = useRouter();
  const [more, setMore] = useState(false);
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    if (!user) return setAdmin(false);
    // Әкімші тексерісі бетті ашуға кедергі болмасын: браузер бос кезде
    return whenIdle(() => authed("/rest/v1/rpc/admin_overview", { method: "POST", body: "{}" }).then(() => setAdmin(true)).catch(() => setAdmin(false)));
  }, [user?.id]); // eslint-disable-line

  useEffect(() => {
    if (ready && authReady && !state.profile.onboarded) router.replace("/onboarding");
  }, [ready, authReady, state.profile.onboarded, router]);
  // Жаңа тіркелген қолданушы алдымен деңгей тестін тапсырады, сосын ғана сайтқа өтеді
  const levelPending = Boolean(state.profile.levelPending) && state.profile.onboarded;
  useEffect(() => {
    if (ready && levelPending && path !== "/app/level") router.replace("/app/level?first=1");
  }, [ready, levelPending, path, router]);
  useEffect(() => { setMore(false); try { window.speechSynthesis?.cancel(); } catch {} }, [path]);
  // «Тағы» парағы Esc пернесімен жабылады
  useEffect(() => {
    if (!more) return;
    const onKey = (e) => { if (e.key === "Escape") setMore(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [more]);

  const showNav = () => true;
  const active = (href) => (href === "/app" ? path === "/app" : path?.startsWith(href));
  const label = (k) => t.navLong[k] || t.nav[k];
  const hint = (k) => pickL(SECTION_HINT[k], lang);
  const cap = (g) => (g?.name ? g.name[lang] || g.name.en : null);

  // Ағымдағы бөлім қолтаңбасы: реңі мен белгісі қабықтың барлық жерінде бірдей
  const secKey = sectionOf(path);
  const sec = SECTIONS[secKey];
  const secName = secKey === "profile" ? t.nav.profile : secKey === "admin" ? "Әкімші" : label(secKey);
  const secCap = cap(groupOf(secKey)) || "Qyzyl til";
  const inBar = MOBILE.includes(secKey);

  if (levelPending) {
    return (
      <div className="shell-focus sx-focus" data-section="home" style={secVars("home")}>
        <header className="focus-head">
          <Logo />
          <span className="focus-prov" lang="kk">{PROVERB}</span>
        </header>
        <main className="focus-main" data-section="home">{children}</main>
      </div>
    );
  }

  const sideLink = (n) => {
    const on = active(n.href);
    return (
      <Link key={n.href} href={n.href} className={`side-link ${on ? "on" : ""}`} aria-current={on ? "page" : undefined} title={hint(n.key)} style={secVars(n.key, "it")}>
        <span className="sx-gl"><ShellGlyph name={SECTIONS[n.key].glyph} size={n.key === "home" ? 22 : 18} /></span>
        <span className="sx-lbl">
          <b>{label(n.key)}</b>
          <small>{hint(n.key)}</small>
        </span>
      </Link>
    );
  };
  const sheetLink = (href, key, text) => (
    <Link key={href} href={href} className={`sheet-link ${active(href) ? "on" : ""}`} aria-current={active(href) ? "page" : undefined} style={secVars(key, "it")}>
      <span className="sx-gl"><ShellGlyph name={SECTIONS[key].glyph} size={20} /></span>
      <span className="sx-lbl">
        <b>{text}</b>
        <small>{hint(key)}</small>
      </span>
    </Link>
  );

  return (
    <div className="shell sx" data-section={secKey} style={secVars(secKey)}>
      <aside className="side">
        <Logo />
        <nav className="side-nav">
          {GROUPS.map((g) => (
            <div key={g.id} className="side-group">
              {g.name && <span className="side-cap">{cap(g)}</span>}
              {g.keys.map((k) => NAV.find((n) => n.key === k)).filter(showNav).map(sideLink)}
            </div>
          ))}
          {admin && (
            <Link href="/app/admin" className={`side-link ${active("/app/admin") ? "on" : ""}`} style={secVars("admin", "it")}>
              <span className="sx-gl"><ShellGlyph name="bars" size={18} /></span>
              <span className="sx-lbl">Әкімші</span>
            </Link>
          )}
        </nav>
        <div className="side-foot">
          <Link href="/app/profile" className={`side-me ${active("/app/profile") ? "on" : ""}`} aria-current={active("/app/profile") ? "page" : undefined} style={secVars("profile", "it")}>
            <span className="me-av"><Avatar value={state.profile.avatar} size={40} /></span>
            <span className="me-txt">
              <b>{state.profile.name || t.guest}</b>
              <small>{user ? user.email : t.guest}</small>
            </span>
            <span className="me-go"><ShellGlyph name="tumar" size={16} /></span>
          </Link>
        </div>
      </aside>

      <div className="main-col">
        <header className="topbar">
          <div className="top-left">
            <span className="mobile-logo">
              <Logo small />
            </span>
            <div className="sx-crest" key={secKey}>
              <span className="sx-gl sx-crest-gl"><ShellGlyph name={sec.glyph} size={22} /></span>
              <span className="sx-crest-t">
                <small>{secCap}</small>
                <b>{secName}</b>
              </span>
            </div>
            {!user && authReady && (
              <Link href="/register" className="demo-note" title={t.demoSave} aria-label={t.demoSave}>
                <Icon name="lock" size={14} /> <span>{t.demoSave}</span>
              </Link>
            )}
          </div>
          <Stats />
        </header>
        <main className="main" data-section={secKey}>{children}</main>
        <WordTap />
        <ClassSync />
      </div>

      {/* Телефондағы төменгі мәзір */}
      <nav className="bottom-nav">
        {NAV.filter(showNav).filter((n) => MOBILE.includes(n.key)).map((n) => (
          <Link key={n.href} href={n.href} className={active(n.href) ? "on" : ""} aria-current={active(n.href) ? "page" : undefined} style={secVars(n.key, "it")}>
            <span className="sx-gl"><ShellGlyph name={SECTIONS[n.key].glyph} size={20} /></span>
            <span>{n.key === "home" ? label("home") : t.nav[n.key]}</span>
          </Link>
        ))}
        <button className={more || !inBar ? "on" : ""} onClick={() => setMore((x) => !x)} aria-expanded={more} style={secVars(more ? "admin" : inBar ? "home" : secKey, "it")}>
          <span className="sx-gl"><ShellGlyph name={!inBar && !more ? sec.glyph : "more"} size={20} /></span>
          <span>{t.nav.more}</span>
        </button>
      </nav>
      {more && (
        <div className="sheet-wrap" onClick={() => setMore(false)}>
          <div className="sheet card rise" role="dialog" aria-label={t.nav.more} onClick={(e) => e.stopPropagation()}>
            {GROUPS.map((g) => (
              <div key={g.id} className="sx-sheet-g">
                {g.name && <span className="side-cap">{cap(g)}</span>}
                <div className="sx-sheet-grid">
                  {g.keys.map((k) => NAV.find((n) => n.key === k)).filter(showNav).map((n) => sheetLink(n.href, n.key, label(n.key)))}
                  {g.id === "top" && sheetLink("/app/profile", "profile", t.nav.profile)}
                  {g.id === "top" && admin && sheetLink("/app/admin", "admin", "Әкімші")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
