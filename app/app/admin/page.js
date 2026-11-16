"use client";
import "../../admin.css";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "../../components/Store";
import AdminView from "../../components/AdminView";
import { adT } from "../../components/AdminL10n";
import { authed } from "../../../lib/auth";

// Деректер: admin_overview RPC (supabase/admin.sql). Қауіпсіздік тексерісі — серверде (qd_admins), мұнда тек көрсетеміз.
export default function Admin() {
  const { user, authReady, lang } = useApp();
  const T = useMemo(() => adT(lang), [lang]);
  const [d, setD] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadedAt, setLoadedAt] = useState("");

  async function load() {
    setBusy(true); setErr("");
    try {
      setD(await authed("/rest/v1/rpc/admin_overview", { method: "POST", body: "{}" }));
      setLoadedAt(new Date().toLocaleTimeString("kk-KZ", { hour: "2-digit", minute: "2-digit" }));
    }
    catch (e) { setErr(/forbidden/.test(e.body || "") ? "forbidden" : /404|PGRST202|does not exist/i.test((e.body || "") + e.status) ? "setup" : e.message || "error"); }
    setBusy(false);
  }
  useEffect(() => { if (user) load(); }, [user?.id]); // eslint-disable-line

  return <AdminView T={T} user={user} authReady={authReady} d={d} err={err} busy={busy} loadedAt={loadedAt} onReload={load} />;
}
