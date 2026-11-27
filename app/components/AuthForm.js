"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "./Store";
import Icon from "./Icon";
import AuthStage from "./AuthStage";
import { authL } from "./AuthL10n";
import { startL } from "./StartL10n";
import { getAuthConfig, resetPassword, signIn, signInWithGoogle, signUp } from "../../lib/auth";

export default function AuthForm({ mode }) {
  const { t, state, lang } = useApp();
  const router = useRouter();
  const reg = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [cfg, setCfg] = useState(undefined);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    getAuthConfig().then((c) => setCfg(c));
  }, []);

  // Кіргеннен кейін: онбординг өтпеген болса — онбордингке
  function after() {
    window.location.href = state.profile.onboarded ? "/app" : "/onboarding";
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setOk("");
    if (reg && pw.length < 8) return setErr(t.pwHint);
    if (reg && pw !== pw2) return setErr(t.pwMismatch);
    setBusy(true);
    try {
      if (reg) {
        const r = await signUp(email.trim(), pw, name.trim());
        if (r.confirm) setOk(t.confirmSent);
        else after();
      } else {
        await signIn(email.trim(), pw);
        after();
      }
    } catch (e2) {
      const m = String(e2.message || "");
      if (/invalid login|invalid_credentials|Invalid login/i.test(m)) setErr(t.badLogin);
      else if (/not.?confirmed/i.test(m)) setErr(t.confirmSent);
      else if (m === "auth-not-configured") setErr(t.authOff);
      else setErr(m || t.errGeneric);
    } finally {
      setBusy(false);
    }
  }

  async function forgot() {
    setErr("");
    if (!email.trim()) return setErr(t.email);
    try {
      await resetPassword(email.trim());
      setOk(t.resetSent);
    } catch (e2) {
      setErr(e2.message);
    }
  }

  const a = authL(lang);
  const pwType = showPw ? "text" : "password";

  return (
    <AuthStage mood={err ? "support" : ok ? "cheer" : reg ? "cheer" : "happy"} bubble={t.heroBubble} perks={a.perks}>
      <form className="au-card" onSubmit={submit}>
        <div className="au-tabs" role="navigation">
          <Link href="/login" className={reg ? "" : "on"} aria-current={reg ? undefined : "page"}>{t.login}</Link>
          <Link href="/register" className={reg ? "on" : ""} aria-current={reg ? "page" : undefined}>{t.register}</Link>
        </div>
        <h1>{reg ? t.regTitle : t.welcome}</h1>
        <p className="au-sub">{t.welcomeSub}</p>
        {cfg === null && (
          <p className="alert">
            <Icon name="lock" size={16} /> {t.authOff}
          </p>
        )}
        {reg && (
          <label className="field au-field">
            <span>{t.name}</span>
            <span className="au-in">
              <Icon name="user" size={18} />
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} required maxLength={40} autoComplete="name" />
            </span>
          </label>
        )}
        <label className="field au-field">
          <span>{t.email}</span>
          <span className="au-in">
            <Icon name="send" size={18} />
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" dir="ltr" />
          </span>
        </label>
        <div className="field au-field">
          <label htmlFor="au-pw">{t.password}</label>
          <span className="au-in has-btn">
            <Icon name="lock" size={18} />
            <input
              id="au-pw"
              className="input"
              type={pwType}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
              minLength={reg ? 8 : 1}
              autoComplete={reg ? "new-password" : "current-password"}
              aria-describedby={reg ? "au-pw-hint" : undefined}
              dir="ltr"
            />
            <button type="button" className="au-eye" onClick={() => setShowPw((v) => !v)} aria-pressed={showPw}>
              {showPw ? a.hide : a.show}
            </button>
          </span>
          {reg && (
            <small id="au-pw-hint" className={`au-hint ${pw.length >= 8 ? "ok" : ""}`}>
              <Icon name={pw.length >= 8 ? "check" : "lock"} size={13} stroke={pw.length >= 8 ? 3 : 2} /> {t.pwHint}
            </small>
          )}
        </div>
        {reg && (
          <label className="field au-field">
            <span>{t.password2}</span>
            <span className="au-in">
              <Icon name="lock" size={18} />
              <input className="input" type={pwType} value={pw2} onChange={(e) => setPw2(e.target.value)} required autoComplete="new-password" dir="ltr" />
            </span>
          </label>
        )}
        {err && <p className="alert" role="alert">{err}</p>}
        {ok && <p className="alert ok" role="status">{ok}</p>}
        <button className="btn blue big block" disabled={busy || cfg === null}>
          {busy ? "…" : reg ? t.register : t.login} {!busy && <Icon name="right" size={18} />}
        </button>
        {!reg && (
          <button type="button" className="link-btn au-forgot" onClick={forgot}>
            {t.forgot}
          </button>
        )}
        <div className="or">
          <span>{t.or}</span>
        </div>
        <button type="button" className="btn ghost block au-google" disabled={cfg === null} onClick={() => signInWithGoogle().catch((e2) => setErr(e2.message))}>
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
          </svg>
          {t.google}
        </button>
        <div className="au-links">
          <Link href={reg ? "/login" : "/register"}>{reg ? t.haveAccount : t.noAccount}</Link>
          <Link href="/onboarding" className="au-try">
            {startL(lang).guest} <Icon name="right" size={16} />
          </Link>
        </div>
      </form>
    </AuthStage>
  );
}
