"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { T, UI_LANGS } from "../../lib/i18n";
import { consumeRedirect, getSession, getUser, loadCloud, saveCloud, signOut } from "../../lib/auth";
import Qyran from "./Qyran";

const KEY = "qd_state_v1";
export const DAILY_GOAL = 50;

export const EMPTY = {
  profile: { name: "", avatar: "🌱", goal: "travel", explain: "ru", ui: "kk", theme: null, onboarded: false },
  xp: 0,
  coins: 0,
  streak: 0,
  lastDay: null,
  today: { date: null, xp: 0 },
  stamps: {},
  sites: {},
  games: {},
  vocab: [],
  vision: [],
  chat: [],
  cefr: null,
  speaking: { level: null, best: {}, log: [] },
  updatedAt: 0,
};

// Деңгей: n-деңгейге жету үшін 50·n·(n−1) XP керек
export function levelOf(xp) {
  let n = 1;
  while (50 * (n + 1) * n <= xp) n++;
  const from = 50 * n * (n - 1);
  const to = 50 * (n + 1) * n;
  return { level: n, from, to, pct: Math.round(((xp - from) / (to - from)) * 100) };
}

// Күн — құрылғының жергілікті уақытымен (UTC емес): Қазақстанда күн түнгі 00:00-де ауысады
export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// Жергілікті күннің реттік нөмірі («күн сөзі» үшін)
export const localDayIndex = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60_000) / 86_400_000);

function readLocal() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "null");
    if (s && typeof s === "object") return { ...EMPTY, ...s, profile: { ...EMPTY.profile, ...(s.profile || {}) } };
  } catch {}
  return null;
}

// Құрылғы мен бұлттағы прогресті біріктіру (ештеңе жоғалмауы үшін)
function merge(a, b) {
  if (!b) return a;
  if (!a) return b;
  const byKk = (x, y) => {
    const m = new Map();
    for (const v of [...(y || []), ...(x || [])]) if (v?.kk && !m.has(v.kk)) m.set(v.kk, v);
    return [...m.values()].slice(0, 500);
  };
  const games = { ...(b.games || {}) };
  for (const [k, v] of Object.entries(a.games || {})) {
    const o = games[k] || {};
    games[k] = { wins: Math.max(v.wins || 0, o.wins || 0), plays: Math.max(v.plays || 0, o.plays || 0), best: Math.max(v.best || 0, o.best || 0) };
  }
  const newer = (a.updatedAt || 0) >= (b.updatedAt || 0) ? a : b;
  return {
    ...EMPTY,
    ...newer,
    profile: { ...b.profile, ...a.profile, onboarded: Boolean(a.profile?.onboarded || b.profile?.onboarded), name: a.profile?.name || b.profile?.name || "" },
    xp: Math.max(a.xp || 0, b.xp || 0),
    coins: Math.max(a.coins || 0, b.coins || 0),
    streak: Math.max(a.streak || 0, b.streak || 0),
    stamps: { ...(b.stamps || {}), ...(a.stamps || {}) },
    sites: { ...(b.sites || {}), ...(a.sites || {}) },
    games,
    vocab: byKk(a.vocab, b.vocab),
    vision: byKk(a.vision, b.vision),
    chat: (newer.chat || []).slice(-40),
    updatedAt: Date.now(),
  };
}

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [state, setState] = useState(EMPTY);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null); // null = кірмеген
  const [authReady, setAuthReady] = useState(false);
  const [toasts, setToasts] = useState([]);
  const saveTimer = useRef(null);
  const userRef = useRef(null);

  // Бастапқы жүктеу
  useEffect(() => {
    const local = readLocal();
    if (local) setState(local);
    setReady(true);
    consumeRedirect();
    (async () => {
      try {
        const s = await getSession();
        if (s) {
          const u = await getUser();
          if (u) {
            userRef.current = u;
            setUser(u);
            const cloud = await loadCloud(u.id).catch(() => null);
            setState((cur) => {
              const base = merge(cur, cloud?.data ? { ...EMPTY, ...cloud.data, profile: { ...EMPTY.profile, ...(cloud.data.profile || {}) } } : null);
              if (!base.profile.name && u.name) base.profile = { ...base.profile, name: u.name };
              return { ...base, updatedAt: Date.now() };
            });
          }
        }
      } catch {}
      setAuthReady(true);
    })();
  }, []);

  // Сақтау: браузерге бірден, бұлтқа 1.5 с кейін
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
    if (userRef.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        const u = userRef.current;
        if (u) saveCloud(u.id, { ...state, chat: (state.chat || []).slice(-20) }, state.profile.name).catch(() => {});
      }, 1500);
    }
  }, [state, ready]);

  // Тақырып және тіл
  useEffect(() => {
    const th = state.profile.theme;
    if (th) document.documentElement.dataset.theme = th;
    else delete document.documentElement.dataset.theme;
    try {
      if (th) localStorage.setItem("qd_theme", th);
      else localStorage.removeItem("qd_theme");
    } catch {}
    document.documentElement.lang = state.profile.ui || "kk";
  }, [state.profile.theme, state.profile.ui]);

  const update = useCallback((fn) => {
    setState((s) => ({ ...fn(s), updatedAt: Date.now() }));
  }, []);

  const toast = useCallback((msg, mood = "cheer") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((x) => [...x.slice(-2), { id, msg, mood }]);
    setTimeout(() => setToasts((x) => x.filter((t) => t.id !== id)), 2600);
  }, []);

  // Марапат: XP, тиын, күндік серия
  const award = useCallback(
    (xp, coins = 0, msg) => {
      setState((s) => {
        const today = dayKey();
        let streak = s.streak || 0;
        if (s.lastDay !== today) {
          const yd = new Date();
          yd.setDate(yd.getDate() - 1);
          const y = dayKey(yd);
          streak = s.lastDay === y ? streak + 1 : 1;
        }
        const t = s.today?.date === today ? s.today.xp : 0;
        return {
          ...s,
          xp: (s.xp || 0) + xp,
          coins: (s.coins || 0) + coins,
          streak,
          lastDay: today,
          today: { date: today, xp: t + xp },
          updatedAt: Date.now(),
        };
      });
      const tt = T[state.profile.ui] || T.kk;
      toast(msg || tt.reward(xp, coins));
    },
    [toast, state.profile.ui]
  );

  // Түсіндіру тілін өзгерткенде интерфейс те сол тілге ауысады (kk/ru/en болса)
  const setProfile = useCallback(
    (p) =>
      update((s) => {
        const profile = { ...s.profile, ...p };
        if (p.explain && UI_LANGS.includes(p.explain)) profile.ui = p.explain;
        return { ...s, profile };
      }),
    [update]
  );

  const saveWord = useCallback(
    (word) =>
      update((s) => (s.vocab.some((v) => v.kk === word.kk) ? s : { ...s, vocab: [{ ...word, at: Date.now() }, ...s.vocab].slice(0, 500) })),
    [update]
  );

  const logout = useCallback(async () => {
    await signOut();
    userRef.current = null;
    setUser(null);
  }, []);

  const resetAll = useCallback(() => {
    setState({ ...EMPTY, profile: { ...state.profile }, updatedAt: Date.now() });
  }, [state.profile]);

  const lang = state.profile.ui || "kk";
  const value = useMemo(
    () => ({
      state,
      ready,
      user,
      authReady,
      lang,
      explain: state.profile.explain || "ru",
      t: T[lang] || T.kk,
      update,
      award,
      toast,
      setProfile,
      saveWord,
      logout,
      resetAll,
      lvl: levelOf(state.xp || 0),
    }),
    [state, ready, user, authReady, lang, update, award, toast, setProfile, saveWord, logout, resetAll]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((x) => (
          <div key={x.id} className="toast pop">
            <Qyran mood={x.mood} size={44} />
            <span>{x.msg}</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
