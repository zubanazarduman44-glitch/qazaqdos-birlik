"use client";
import { setWordTr } from "../../lib/words";
import { allKkWords } from "../../lib/dict";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { T, UI_LANGS } from "../../lib/i18n";
import { flatten, apply } from "../../lib/uitr";
import { tx, setTxOverride } from "../../lib/tx";
import { consumeRedirect, getSession, getUser, loadCloud, saveCloud, signOut, upsertWeekly } from "../../lib/auth";
import { weekKey } from "../../lib/week";
import { setSkin } from "../../lib/skin";
import Qyran from "./Qyran";

const KEY = "qd_state_v1";
export const DAILY_GOAL = 50;

export const EMPTY = {
  profile: { name: "", avatar: "🌱", skin: "eagle", goal: "travel", explain: "ru", ui: "kk", theme: null, onboarded: false, role: "student" },
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
  weekly: null,
  saiys: { claimed: {} },
  shop: { owned: [], wear: {} },
  sozdik: { days: {}, learned: {}, done: {} },
  course: { done: {} },
  lit: {},
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
    const rd = consumeRedirect();
    // Google/пошта сілтемесі кейде басты бетке (/) қайтарады: кіру сәтті болса, қолданбаға өтеміз
    if (rd.got && !window.location.pathname.startsWith("/app")) window.location.replace("/app");
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
    document.documentElement.dataset.theme = "light";
    try { localStorage.removeItem("qd_theme"); } catch {}
    setSkin(state.profile.skin || "eagle");
    document.documentElement.lang = state.profile.ui || "kk";
    document.documentElement.dir = state.profile.ui === "ar" ? "rtl" : "ltr";
  }, [state.profile.ui, state.profile.skin]);

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
          weekly: (() => {
            const wk = weekKey();
            const w = s.weekly?.week === wk ? s.weekly : { week: wk, tasks: 0, xp: 0 };
            return { week: wk, tasks: w.tasks + 1, xp: w.xp + xp };
          })(),
          updatedAt: Date.now(),
        };
      });
      const tt = T[state.profile.ui] || T.en;
      toast(msg || tt.reward(xp, coins));
    },
    [toast, state.profile.ui]
  );

  // Түсіндіру тілін өзгерткенде интерфейс те сол тілге ауысады (kk/ru/en болса)
  const setProfile = useCallback(
    (p) =>
      update((s) => {
        const profile = { ...s.profile, ...p };
        if (p.explain) profile.ui = p.explain;
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

  // Басқа тілге ауысқанда сөздердің аудармасын ЖИ арқылы бір рет алып, құрылғыда сақтаймыз
  const [wtrVer, setWtrVer] = useState(0);
  const exp = state.profile.explain || "ru";
  useEffect(() => {
    if (["ru", "en", "kk"].includes(exp)) return;
    let dead = false;
    const key = `qd_wtr_${exp}`;
    let have = {};
    try {
      have = JSON.parse(localStorage.getItem(key) || "{}");
    } catch {}
    setWordTr(exp, have);
    setWtrVer((v) => v + 1);
    const missing = allKkWords().filter((w) => !have[w]);
    (async () => {
      for (let i = 0; i < missing.length && !dead; i += 80) {
        try {
          const r = await fetch("/api/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ words: missing.slice(i, i + 80), to: exp }) });
          const d = await r.json();
          if (!r.ok || !d.map) break;
          have = { ...have, ...d.map };
          try {
            localStorage.setItem(key, JSON.stringify(have));
          } catch {}
          setWordTr(exp, d.map);
          if (!dead) setWtrVer((v) => v + 1);
        } catch {
          break;
        }
      }
    })();
    return () => {
      dead = true;
    };
  }, [exp]);

  // Апталық рейтинг: орындалған тапсырма санын бұлтқа жібереміз (аздап кідіріспен)
  useEffect(() => {
    if (!user || !state.weekly) return;
    const w = state.weekly;
    const id = setTimeout(() => {
      upsertWeekly({ week: w.week, user_id: user.id, name: state.profile.name || user.name || "Дос", avatar: state.profile.avatar || "🌱", tasks: w.tasks, xp: w.xp }).catch(() => {});
    }, 6000);
    return () => clearTimeout(id);
  }, [user, state.weekly, state.profile.name, state.profile.avatar]);

  // Басқа тілдер (қытай, араб…): интерфейсті ЖИ бір рет аударып, құрылғыда сақтаймыз
  const lang = state.profile.ui || "kk";
  const [uiMap, setUiMap] = useState({});
  useEffect(() => {
    if (UI_LANGS.includes(lang)) {
      setUiMap({});
      setTxOverride(null, null);
      return;
    }
    let dead = false;
    const key = `qd_ui2_${lang}`;
    let have = {};
    try {
      have = JSON.parse(localStorage.getItem(key) || "{}");
    } catch {}
    const en = { ...Object.fromEntries(Object.entries(flatten(T.en)).map(([k, v]) => ["T." + k, v])), ...Object.fromEntries(Object.entries(flatten(tx("en"))).map(([k, v]) => ["X." + k, v])) };
    const push = (m) => {
      setUiMap(m);
      const xm = {};
      for (const [k, v] of Object.entries(m)) if (k.startsWith("X.")) xm[k.slice(2)] = v;
      setTxOverride(lang, xm);
    };
    push(have);
    const miss = Object.keys(en).filter((k) => !have[k]);
    (async () => {
      const chunks = [];
      for (let i = 0; i < miss.length; i += 70) chunks.push(miss.slice(i, i + 70));
      await Promise.all(
        chunks.map(async (keys) => {
          try {
            const r = await fetch("/api/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ui: keys.map((k) => en[k]), to: lang }) });
            const d = await r.json();
            if (!r.ok || !d.items || dead) return;
            keys.forEach((k, i) => (have[k] = d.items[i]));
            try {
              localStorage.setItem(key, JSON.stringify(have));
            } catch {}
            push({ ...have });
          } catch {}
        })
      );
    })();
    return () => {
      dead = true;
    };
  }, [lang]);
  const tMemo = useMemo(() => {
    if (T[lang]) return T[lang];
    const m = {};
    for (const [k, v] of Object.entries(uiMap)) if (k.startsWith("T.")) m[k.slice(2)] = v;
    return apply(T.en, m);
  }, [lang, uiMap]);
  const value = useMemo(
    () => ({
      state,
      ready,
      user,
      authReady,
      lang,
      explain: state.profile.explain || "ru",
      t: tMemo,
      update,
      award,
      toast,
      setProfile,
      saveWord,
      logout,
      resetAll,
      lvl: levelOf(state.xp || 0),
    }),
    [state, wtrVer, uiMap, tMemo, ready, user, authReady, lang, update, award, toast, setProfile, saveWord, logout, resetAll]
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
