"use client";
import { setWordTr } from "../../lib/wordTools";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { T, UI_LANGS } from "../../lib/i18n";
import { flatten, apply } from "../../lib/uitr";
import { tx, setTxOverride } from "../../lib/tx";
import { consumeRedirect, getSession, getUser, loadCloud, saveCloud, signOut, upsertWeekly } from "../../lib/auth";
import { weekKey } from "../../lib/week";
import { setSkin } from "../../lib/skin";
import Qyran from "./Qyran";

const KEY = "qd_state_v1";

// kk/ru/en-нен басқа 8 тілдің дайын интерфейс аудармасы: тек сол тіл таңдалса жүктеледі (ортақ бандлға кірмейді)
const UI_STATIC = {
  zh: () => import("../../lib/ui/zh"),
  es: () => import("../../lib/ui/es"),
  de: () => import("../../lib/ui/de"),
  fr: () => import("../../lib/ui/fr"),
  tr: () => import("../../lib/ui/tr"),
  ar: () => import("../../lib/ui/ar"),
  ko: () => import("../../lib/ui/ko"),
  ja: () => import("../../lib/ui/ja"),
};
// Сөздердің дайын аудармасы (lib/wtr/<тіл>.js); файл жоқ болса — ЖИ арқылы аударамыз
const loadWordTr = (l) => import(/* webpackInclude: /\.js$/ */ `../../lib/wtr/${l}.js`);
const RTL = ["ar"];
export const DAILY_GOAL = 50;

export const EMPTY = {
  profile: { name: "", avatar: "🌱", skin: "eagle", goal: "travel", explain: "ru", ui: "kk", theme: null, onboarded: false, role: "student" },
  xp: 0,
  coins: 0,
  streak: 0,
  embers: 0,
  quests: null,
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
    const ui = state.profile.ui || "kk";
    document.documentElement.lang = ui === "zh" ? "zh-Hans" : ui;
    document.documentElement.dir = RTL.includes(ui) ? "rtl" : "ltr";
  }, [state.profile.ui, state.profile.skin]);

  const tRef = useRef(T.kk); // award() үшін ағымдағы тіл мәтіндері
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
        let embers = s.embers || 0;
        if (s.lastDay !== today) {
          const yd = new Date();
          yd.setDate(yd.getDate() - 1);
          const y = dayKey(yd);
          const yd2 = new Date();
          yd2.setDate(yd2.getDate() - 2);
          // «Шоқ»: бір күн үзіліп қалса, сақталған шоқ ошақты сөндірмейді
          if (s.lastDay === y) streak += 1;
          else if (s.lastDay === dayKey(yd2) && (s.embers || 0) > 0 && streak > 0) { streak += 1; embers -= 1; }
          else streak = 1;
        }
        const t = s.today?.date === today ? s.today.xp : 0;
        const tk = s.today?.date === today ? s.today.tasks || 0 : 0;
        return {
          ...s,
          xp: (s.xp || 0) + xp,
          coins: (s.coins || 0) + coins,
          streak,
          embers,
          lastDay: today,
          today: { date: today, xp: t + xp, tasks: tk + 1 },
          weekly: (() => {
            const wk = weekKey();
            const w = s.weekly?.week === wk ? s.weekly : { week: wk, tasks: 0, xp: 0 };
            return { week: wk, tasks: w.tasks + 1, xp: w.xp + xp };
          })(),
          updatedAt: Date.now(),
        };
      });
      toast(msg || tRef.current.reward(xp, coins));
    },
    [toast]
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

  // Басқа тілге ауысқанда: алдымен дайын lib/wtr/<тіл>.js, жетіспеген сөздерді ғана ЖИ аударып, құрылғыда сақтаймыз
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
    (async () => {
      // 1) Дайын статикалық аударма (бар болса) — кэштен басым
      let stat = {};
      try {
        stat = (await loadWordTr(exp)).default || {};
      } catch {}
      if (dead) return;
      if (Object.keys(stat).length) {
        setWordTr(exp, stat);
        setWtrVer((v) => v + 1);
      }
      // 2) Тек жетіспейтін сөздерді ЖИ-ден сұраймыз. Сөздік ортақ бандлға кірмеуі үшін кейін жүктеледі
      let missing = [];
      try {
        const { allKkWords } = await import("../../lib/dict");
        missing = allKkWords().filter((w) => !stat[w] && !have[w]);
      } catch {}
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

  // Басқа тілдер (қытай, араб…): алдымен дайын lib/ui/<тіл>.js, жетіспейтін жолдарды ғана ЖИ аударады
  const lang = state.profile.ui || "kk";
  const [uiMap, setUiMap] = useState({});
  const [uiFns, setUiFns] = useState(null);
  useEffect(() => {
    if (UI_LANGS.includes(lang)) {
      setUiMap({});
      setUiFns(null);
      setTxOverride(null, null);
      return;
    }
    let dead = false;
    // qd_ui3: ЖИ аударған жолдар ғана сақталады (ескі qd_ui2 кэші дайын аудармадан нашар, өшіреміз)
    const key = `qd_ui3_${lang}`;
    let have = {};
    try {
      localStorage.removeItem(`qd_ui2_${lang}`);
      have = JSON.parse(localStorage.getItem(key) || "{}");
    } catch {}
    const en = { ...Object.fromEntries(Object.entries(flatten(T.en)).map(([k, v]) => ["T." + k, v])), ...Object.fromEntries(Object.entries(flatten(tx("en"))).map(([k, v]) => ["X." + k, v])) };
    let fns = null;
    const push = (m) => {
      setUiMap(m);
      setUiFns(fns);
      const xm = {};
      const xf = {};
      for (const [k, v] of Object.entries(m)) if (k.startsWith("X.")) xm[k.slice(2)] = v;
      for (const [k, v] of Object.entries(fns || {})) if (k.startsWith("X.")) xf[k.slice(2)] = v;
      setTxOverride(lang, xm, xf);
    };
    push(have); // алдыңғы тілдің жолдары қалып қоймауы үшін бірден ауыстырамыз
    (async () => {
      const load = UI_STATIC[lang];
      if (load) {
        try {
          const mod = await load();
          if (dead) return;
          fns = mod.fn || null;
          have = { ...have, ...mod.default }; // дайын аударма кэштен басым
          push({ ...have });
        } catch {}
      }
      const miss = Object.keys(en).filter((k) => !have[k]);
      if (!miss.length || dead) return;
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
              const cached = JSON.parse(localStorage.getItem(key) || "{}");
              keys.forEach((k, i) => (cached[k] = d.items[i]));
              localStorage.setItem(key, JSON.stringify(cached));
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
    const out = apply(T.en, m);
    for (const [k, v] of Object.entries(uiFns || {})) if (k.startsWith("T.")) out[k.slice(2)] = v;
    return out;
  }, [lang, uiMap, uiFns]);
  tRef.current = tMemo;
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
