// Аккаунт: email + құпиясөз немесе Google (Supabase Auth), прогресті бұлтта сақтау.
// Тек браузерде жұмыс істейді. Кілттер /api/auth-config арқылы келеді (тек жария publishable кілт).

const SESSION_KEY = "qd_session_v1";
let cfgPromise = null;

export function getAuthConfig() {
  if (!cfgPromise) {
    cfgPromise = fetch("/api/auth-config")
      .then((r) => (r.ok ? r.json() : {}))
      .then((c) => (c?.url && c?.key ? c : null))
      .catch(() => null);
  }
  return cfgPromise;
}

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}
function writeSession(s) {
  try {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  } catch {}
}
function saveTokens(d) {
  writeSession({
    access_token: d.access_token,
    refresh_token: d.refresh_token,
    expires_at: Date.now() + (d.expires_in || 3600) * 1000,
  });
}

async function authFetch(path, body) {
  const cfg = await getAuthConfig();
  if (!cfg) throw new Error("auth-not-configured");
  const r = await fetch(`${cfg.url}${path}`, {
    method: "POST",
    headers: { apikey: cfg.key, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = d.msg || d.error_description || d.message || d.error || `HTTP ${r.status}`;
    const err = new Error(msg);
    err.code = d.error_code || d.code || r.status;
    throw err;
  }
  return d;
}

// Supabase тек рұқсат етілген мекенжайға қайтарады, әйтпесе басқа сайтқа (Site URL) лақтырады.
// Сондықтан негізгі домен болмаса (мысалы, Vercel алдын ала қарау сілтемесі) — әрқашан негізгі доменге қайтарамыз.
const CANONICAL = "https://tilim-kz.vercel.app";
function siteOrigin() {
  const o = window.location.origin;
  const h = window.location.hostname;
  if (h === "localhost" || h === "127.0.0.1") return o;
  if (o === CANONICAL) return o;
  return CANONICAL;
}

// Тіркелу. Поштаны растау қосулы болса — { confirm: true } қайтарады.
export async function signUp(email, password, name) {
  const redirect = `${siteOrigin()}/app`;
  const d = await authFetch(`/auth/v1/signup?redirect_to=${encodeURIComponent(redirect)}`, {
    email,
    password,
    data: { name, full_name: name, app: "tilim" },
  });
  if (d.access_token) {
    saveTokens(d);
    return { confirm: false };
  }
  return { confirm: true };
}

export async function signIn(email, password) {
  const d = await authFetch("/auth/v1/token?grant_type=password", { email, password });
  saveTokens(d);
}

export async function resetPassword(email) {
  const redirect = `${siteOrigin()}/login`;
  await authFetch(`/auth/v1/recover?redirect_to=${encodeURIComponent(redirect)}`, { email });
}

export async function signInWithGoogle() {
  const cfg = await getAuthConfig();
  if (!cfg) throw new Error("auth-not-configured");
  const redirect = `${siteOrigin()}/app`;
  window.location.href =
    `${cfg.url}/auth/v1/authorize?provider=google` +
    `&redirect_to=${encodeURIComponent(redirect)}&prompt=select_account`;
}

// Google-дан немесе поштадағы сілтемеден қайтқанда URL-дағы токендерді аламыз
export function consumeRedirect() {
  if (typeof window === "undefined") return { error: null, got: false };
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const query = new URLSearchParams(window.location.search);
  const error = hash.get("error_description") || query.get("error_description");
  const access = hash.get("access_token");
  if (access) {
    saveTokens({ access_token: access, refresh_token: hash.get("refresh_token"), expires_in: Number(hash.get("expires_in") || 3600) });
  }
  if (access || error) window.history.replaceState(null, "", window.location.pathname);
  return { error, got: Boolean(access) };
}

export async function getSession() {
  const s = readSession();
  if (!s?.access_token) return null;
  if (s.expires_at - 60_000 > Date.now()) return s;
  const cfg = await getAuthConfig();
  if (!cfg || !s.refresh_token) return null;
  try {
    const r = await fetch(`${cfg.url}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { apikey: cfg.key, "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: s.refresh_token }),
    });
    if (r.status === 400 || r.status === 401) {
      writeSession(null);
      return null;
    }
    if (!r.ok) return null;
    const d = await r.json();
    saveTokens(d);
    return readSession();
  } catch {
    return null;
  }
}

export async function authed(path, init = {}) {
  const cfg = await getAuthConfig();
  const s = await getSession();
  if (!cfg || !s) throw new Error("not-signed-in");
  const r = await fetch(`${cfg.url}${path}`, {
    ...init,
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${s.access_token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await r.text();
  if (!r.ok) throw Object.assign(new Error(`HTTP ${r.status}`), { status: r.status, body: text });
  return text ? JSON.parse(text) : null;
}

export async function getUser() {
  const u = await authed("/auth/v1/user");
  if (!u?.id) return null;
  const m = u.user_metadata || {};
  return {
    id: u.id,
    email: u.email,
    name: m.name || m.full_name || (u.email || "").split("@")[0],
    avatar: m.avatar_url || m.picture || null,
  };
}

export async function signOut() {
  try {
    await authed("/auth/v1/logout", { method: "POST" });
  } catch {}
  writeSession(null);
}

export async function loadCloud(userId) {
  const rows = await authed(`/rest/v1/qd_progress?user_id=eq.${userId}&select=data,display_name,updated_at`);
  return rows?.[0] || null;
}

export async function saveCloud(userId, data, displayName) {
  await authed("/rest/v1/qd_progress?on_conflict=user_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ user_id: userId, data, display_name: displayName || null, updated_at: new Date().toISOString() }),
  });
}

export async function deleteCloud(userId) {
  await authed(`/rest/v1/qd_progress?user_id=eq.${userId}`, { method: "DELETE" });
}

export async function upsertWeekly(row) {
  await authed("/rest/v1/qd_weekly?on_conflict=week,user_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ ...row, updated_at: new Date().toISOString() }),
  });
}
