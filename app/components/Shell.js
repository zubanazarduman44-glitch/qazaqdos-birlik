"use client";
import Link from "next/link";
import Avatar from "./Avatar";
import ClassSync from "./ClassSync";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "./Store";
import Icon from "./Icon";
import Qyran from "./Qyran";
import Shanyrak from "./Shanyrak";
import WordTap from "./WordTap";
import { UI_LANGS, UI_LABELS } from "../../lib/i18n";

export const NAV = [
  { href: "/app", key: "home", icon: "home" },
  { href: "/app/travel", key: "travel", icon: "map" },
  { href: "/app/history", key: "history", icon: "scroll" },
  { href: "/app/games", key: "games", icon: "target" },
  { href: "/app/qyran", key: "chat", icon: "chat" },
  { href: "/app/vision", key: "vision", icon: "camera" },
  { href: "/app/tuzel", key: "tuzel", icon: "pen" },
  { href: "/app/course", key: "course", icon: "book" },
  { href: "/app/sozdik", key: "sozdik", icon: "stamp" },
  { href: "/app/level", key: "level", icon: "chart" },
  { href: "/app/saiys", key: "saiys", icon: "trophy" },
  { href: "/app/literature", key: "lit", icon: "book" },
  { href: "/app/class", key: "class", icon: "user" },
  { href: "/app/shop", key: "shop", icon: "bag" },
];
const MOBILE = ["home", "travel", "games", "chat"];

// Қошқар мүйіз өрнегі (алтын жолақ)
export function Orn({ className = "" }) {
  return (
    <svg className={`orn ${className}`} viewBox="0 0 240 18" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id="ornp" width="40" height="18" patternUnits="userSpaceOnUse">
          <path
            d="M20 15c0-5-4-8-7-6s-1 6 2 5M20 15c0-5 4-8 7-6s1 6-2 5M0 15h8M32 15h8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </pattern>
      </defs>
      <rect width="240" height="18" fill="url(#ornp)" />
    </svg>
  );
}

export function Logo({ small }) {
  return (
    <Link href="/" className={`logo ${small ? "sm" : ""}`} aria-label="TILIM">
      <span className="logo-mark">
        <Shanyrak size={small ? 32 : 40} />
      </span>
      <span className="logo-word">
        TIL<b>IM</b>
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

export function Stats() {
  const { state, lvl, t } = useApp();
  return (
    <div className="stats-pills">
      <span className="pill" title={t.streak}>
        <span className="pe">🔥</span> {state.streak || 0}
      </span>
      <span className="pill" title={t.coins}>
        <span className="pe">🪙</span> {state.coins || 0}
      </span>
      <span className="pill lvl" title={t.level}>
        <span className="pe">⭐</span> {t.levelN(lvl.level)}
        <i className="pill-bar">
          <i style={{ width: `${lvl.pct}%` }} />
        </i>
      </span>
    </div>
  );
}

export default function Shell({ children }) {
  const { state, ready, user, t, authReady } = useApp();
  const path = usePathname();
  const router = useRouter();
  const [more, setMore] = useState(false);

  useEffect(() => {
    if (ready && authReady && !state.profile.onboarded) router.replace("/onboarding");
  }, [ready, authReady, state.profile.onboarded, router]);
  useEffect(() => { setMore(false); try { window.speechSynthesis?.cancel(); } catch {} }, [path]);

  const active = (href) => (href === "/app" ? path === "/app" : path?.startsWith(href));
  const label = (k) => t.navLong[k] || t.nav[k];

  return (
    <div className="shell">
      <aside className="side">
        <Logo />
        <nav className="side-nav">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`side-link ${active(n.href) ? "on" : ""}`}>
              <Icon name={n.icon} size={20} />
              <span>{label(n.key)}</span>
            </Link>
          ))}
        </nav>
        <div className="side-foot">
          <Link href="/app/profile" className={`side-me ${active("/app/profile") ? "on" : ""}`}>
            <span className="me-av"><Avatar value={state.profile.avatar} size={40} /></span>
            <span className="me-txt">
              <b>{state.profile.name || t.guest}</b>
              <small>{user ? user.email : t.guest}</small>
            </span>
          </Link>
          <div className="side-tools">
            <LangSeg />
          </div>
        </div>
      </aside>

      <div className="main-col">
        <header className="topbar">
          <div className="top-left">
            <span className="mobile-logo">
              <Logo small />
            </span>
            {!user && authReady && (
              <Link href="/register" className="demo-note">
                <Icon name="lock" size={14} /> <span>{t.demoSave}</span>
              </Link>
            )}
          </div>
          <Stats />
        </header>
        <main className="main">{children}</main>
        <WordTap />
        <ClassSync />
      </div>

      {/* Телефондағы төменгі мәзір */}
      <nav className="bottom-nav">
        {NAV.filter((n) => MOBILE.includes(n.key)).map((n) => (
          <Link key={n.href} href={n.href} className={active(n.href) ? "on" : ""}>
            <Icon name={n.icon} size={22} />
            <span>{t.nav[n.key]}</span>
          </Link>
        ))}
        <button className={more ? "on" : ""} onClick={() => setMore((x) => !x)} aria-expanded={more}>
          <Icon name="menu" size={22} />
          <span>{t.nav.more}</span>
        </button>
      </nav>
      {more && (
        <div className="sheet-wrap" onClick={() => setMore(false)}>
          <div className="sheet card rise" onClick={(e) => e.stopPropagation()}>
            {NAV.filter((n) => !MOBILE.includes(n.key)).map((n) => (
              <Link key={n.href} href={n.href} className={`sheet-link ${active(n.href) ? "on" : ""}`}>
                <Icon name={n.icon} size={20} /> {label(n.key)}
              </Link>
            ))}
            <Link href="/app/profile" className={`sheet-link ${active("/app/profile") ? "on" : ""}`}>
              <Icon name="user" size={20} /> {t.nav.profile}
            </Link>
            <div className="sheet-tools">
              <LangSeg />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
