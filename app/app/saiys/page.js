"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../../components/Store";
import Qyran from "../../components/Qyran";
import Icon from "../../components/Icon";
import { authed } from "../../../lib/auth";
import { WORDS, tr } from "../../../lib/words";
import { weekKey, prevWeekKey, weekEnd, prizeKind, COIN_PRIZES } from "../../../lib/week";
import { tx } from "../../../lib/tx";

const QN = 10;
const Q_MS = 12000;
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

// Бірдей сұрақтар барлығында шығуы үшін: seed бойынша араластыру
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seeded(arr, r) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function buildQs(seed, lang) {
  const r = rng(seed);
  return seeded(WORDS, r).slice(0, QN).map((w) => {
    const others = seeded(WORDS.filter((o) => o.kk !== w.kk && tr(o, lang) !== tr(w, lang)), r).slice(0, 3);
    return { w, options: seeded([w, ...others], r) };
  });
}
const left = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
};

export default function Saiys() {
  const { lang, explain, user, state, update, award, toast } = useApp();
  const x = useMemo(() => tx(lang), [lang]);
  const [tab, setTab] = useState("week");
  const [rows, setRows] = useState(null);
  const [last, setLast] = useState([]);
  const [setup, setSetup] = useState(false);
  const [now, setNow] = useState(Date.now());
  const wk = weekKey();
  const kind = prizeKind(wk);
  const lastKind = prizeKind(prevWeekKey());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const loadWeek = useCallback(async () => {
    if (!user) return;
    try {
      const cur = await authed(`/rest/v1/qd_weekly?week=eq.${wk}&select=user_id,name,avatar,tasks,xp&order=tasks.desc,xp.desc&limit=30`);
      setRows(cur || []);
      const prev = await authed(`/rest/v1/qd_weekly?week=eq.${prevWeekKey()}&select=user_id,name,avatar,tasks,xp&order=tasks.desc,xp.desc&limit=3`);
      setLast(prev || []);
      setSetup(false);
    } catch (e) {
      if (e.status === 404 || /relation|schema cache/i.test(e.body || "")) setSetup(true);
      setRows([]);
    }
  }, [user, wk]);
  useEffect(() => {
    loadWeek();
  }, [loadWeek]);

  // Өткен аптадағы монета жүлдесін алу
  const myPrev = last.findIndex((r) => r.user_id === user?.id);
  const claimed = state.saiys?.claimed?.[prevWeekKey()];
  function claim() {
    const prize = COIN_PRIZES[myPrev];
    if (!prize || claimed) return;
    update((s) => ({ ...s, coins: (s.coins || 0) + prize, saiys: { claimed: { ...(s.saiys?.claimed || {}), [prevWeekKey()]: true } } }));
    toast(`🪙 +${prize}`, "cheer");
  }

  if (!user)
    return (
      <div className="saiys">
        <Head x={x} />
        <section className="card s-login">
          <Qyran mood="support" size={110} />
          <p>{x.sLogin}</p>
          <Link href="/login" className="btn gold big">{x.sLoginBtn}</Link>
        </section>
      </div>
    );

  return (
    <div className="saiys">
      <Head x={x} />
      <div className="tz-tabs" role="tablist">
        <button className={tab === "week" ? "on" : ""} onClick={() => setTab("week")}><Icon name="trophy" size={18} /> {x.sWeekly}</button>
        <button className={tab === "room" ? "on" : ""} onClick={() => setTab("room")}><Icon name="target" size={18} /> {x.sRoom}</button>
      </div>
      {setup && <p className="alert">{x.sSetup}</p>}

      {tab === "week" && (
        <>
          <section className="card prize rise">
            <span className="prize-e">{kind === "gift" ? "🎁" : "🪙"}</span>
            <div>
              <span className="badge">{x.sPrize}</span>
              <p>{kind === "gift" ? x.sPrizeGift : x.sPrizeCoins}</p>
              <small className="muted">{x.sEnds}: <b>{left(weekEnd() - now)}</b></small>
            </div>
          </section>

          {last.length > 0 && myPrev === 0 && lastKind === "gift" && <p className="alert ok">{x.sWonGift}</p>}
          {last.length > 0 && myPrev >= 0 && lastKind === "coins" && !claimed && (
            <button className="btn gold big" onClick={claim}>🪙 {x.sClaim}: {COIN_PRIZES[myPrev]}</button>
          )}

          <section className="card board">
            {rows === null && <p className="muted">…</p>}
            {rows?.length === 0 && <p className="muted">{x.sEmpty}</p>}
            {rows?.length > 0 && (
              <>
                <div className="podium">
                  {[1, 0, 2].map((i) => rows[i] && (
                    <div key={i} className={`pod p${i + 1} ${rows[i].user_id === user.id ? "me" : ""}`}>
                      <span className="pod-av">{rows[i].avatar || "🌱"}</span>
                      <b>{rows[i].name}</b>
                      <small>{rows[i].tasks} {x.sTasks}</small>
                      <span className="pod-step">{["🥇", "🥈", "🥉"][i]}</span>
                    </div>
                  ))}
                </div>
                <ol className="rank">
                  {rows.map((r, i) => (
                    <li key={r.user_id} className={r.user_id === user.id ? "me" : ""}>
                      <span className="rk">{i + 1}</span>
                      <span className="rk-av">{r.avatar || "🌱"}</span>
                      <span className="rk-name">{r.name}{r.user_id === user.id ? ` (${x.sYou})` : ""}</span>
                      <b>{r.tasks}</b> <small>{x.sTasks}</small>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </section>

          {last.length > 0 && (
            <section className="card last">
              <h3>{x.sLast} · {lastKind === "gift" ? "🎁" : "🪙"}</h3>
              <ul>{last.map((r, i) => <li key={r.user_id}>{["🥇", "🥈", "🥉"][i]} {r.avatar} {r.name} — {r.tasks} {x.sTasks}</li>)}</ul>
            </section>
          )}
        </>
      )}

      {tab === "room" && <Room x={x} user={user} state={state} explain={explain} award={award} />}
    </div>
  );
}

function Head({ x }) {
  return (
    <header className="page-head">
      <div>
        <span className="kicker">{x.sKicker}</span>
        <h1>{x.sTitle}</h1>
        <p>{x.sSub}</p>
      </div>
    </header>
  );
}

function Room({ x, user, state, explain, award }) {
  const [code, setCode] = useState(null);
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [input, setInput] = useState("");
  const [err, setErr] = useState("");
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const t0 = useRef(0);
  const paid = useRef(false);
  const me = { name: state.profile.name || user.name || "Дос", avatar: state.profile.avatar || "🌱" };

  const poll = useCallback(async () => {
    if (!code) return;
    try {
      const [r] = await authed(`/rest/v1/qd_rooms?code=eq.${code}&select=*`);
      const p = await authed(`/rest/v1/qd_room_players?code=eq.${code}&select=*&order=score.desc`);
      setRoom(r || null);
      setPlayers(p || []);
    } catch {}
  }, [code]);
  useEffect(() => {
    if (!code) return;
    poll();
    const id = setInterval(poll, 2000);
    return () => clearInterval(id);
  }, [code, poll]);

  async function create() {
    setErr("");
    const c = Array.from({ length: 5 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");
    try {
      await authed("/rest/v1/qd_rooms", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ code: c, host: user.id, seed: Math.floor(Math.random() * 2e9) }) });
      await authed("/rest/v1/qd_room_players", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ code: c, user_id: user.id, ...me }) });
      reset();
      setCode(c);
    } catch {
      setErr(x.sSetup);
    }
  }
  async function join() {
    setErr("");
    const c = input.trim().toUpperCase();
    if (!c) return;
    try {
      const [r] = await authed(`/rest/v1/qd_rooms?code=eq.${c}&select=*`);
      if (!r) return setErr(x.sNoRoom);
      const p = await authed(`/rest/v1/qd_room_players?code=eq.${c}&select=user_id`);
      if (!p.some((q) => q.user_id === user.id)) {
        if (p.length >= 8) return setErr(x.sFull);
        await authed("/rest/v1/qd_room_players", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ code: c, user_id: user.id, ...me }) });
      }
      reset();
      setCode(c);
    } catch (e) {
      setErr(e.status === 403 || e.status === 401 ? x.sFull : x.sNoRoom);
    }
  }
  function reset() {
    setQi(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    paid.current = false;
  }
  async function start() {
    await authed(`/rest/v1/qd_rooms?code=eq.${code}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: "play" }) }).catch(() => {});
    poll();
  }
  function leave() {
    setCode(null);
    setRoom(null);
    setPlayers([]);
    reset();
  }

  const qs = useMemo(() => (room ? buildQs(room.seed, explain) : []), [room?.seed, explain]);
  const playing = room?.status === "play" && !done;
  useEffect(() => {
    if (playing) t0.current = Date.now();
  }, [playing, qi]);

  async function push(sc, answered, fin) {
    await authed(`/rest/v1/qd_room_players?code=eq.${code}&user_id=eq.${user.id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ score: sc, answered, done: fin }) }).catch(() => {});
  }
  function choose(key) {
    if (picked) return;
    const ok = key === qs[qi].w.kk;
    const gain = ok ? 10 + Math.max(0, Math.round((Q_MS - (Date.now() - t0.current)) / Q_MS * 5)) : 0;
    const sc = score + gain;
    setPicked(key);
    setScore(sc);
    const fin = qi + 1 >= QN;
    push(sc, qi + 1, fin);
    setTimeout(() => {
      if (fin) setDone(true);
      else {
        setQi(qi + 1);
        setPicked(null);
      }
    }, 800);
  }

  const allDone = players.length > 0 && players.every((p) => p.done);
  const rank = players.findIndex((p) => p.user_id === user.id);
  useEffect(() => {
    if (done && allDone && !paid.current) {
      paid.current = true;
      award(15 + Math.max(0, 4 - rank) * 5, rank === 0 ? 10 : 2);
    }
  }, [done, allDone]);

  if (!code)
    return (
      <section className="card room-join rise">
        <div className="rj">
          <h3>{x.sCreate}</h3>
          <button className="btn gold big" onClick={create}><Icon name="plus" size={18} /> {x.sCreate}</button>
        </div>
        <div className="rj">
          <h3>{x.sCode}</h3>
          <div className="sp-custom-row">
            <input className="input" value={input} onChange={(e) => setInput(e.target.value.toUpperCase())} placeholder={x.sCodePh} maxLength={6} />
            <button className="btn blue" onClick={join}>{x.sJoin}</button>
          </div>
        </div>
        {err && <p className="alert">{err}</p>}
      </section>
    );

  const isHost = room?.host === user.id;
  return (
    <section className="card room rise">
      <div className="room-top">
        <div>
          <small className="muted">{x.sShare}</small>
          <div className="room-code">{code}</div>
        </div>
        <button className="btn ghost small" onClick={leave}>{x.sLeave}</button>
      </div>

      <h3>{x.sPlayers} {players.length}/8</h3>
      <ul className="players">
        {players.map((p, i) => (
          <li key={p.user_id} className={p.user_id === user.id ? "me" : ""}>
            <span className="rk">{room?.status === "play" ? i + 1 : "•"}</span>
            <span className="rk-av">{p.avatar}</span>
            <span className="rk-name">{p.name}{p.done ? " ✅" : ""}</span>
            <b>{p.score}</b> <small>{x.sPoints}</small>
          </li>
        ))}
      </ul>

      {room?.status === "lobby" && (isHost ? (
        <button className="btn gold big" disabled={players.length < 2} onClick={start}>{x.sStart}</button>
      ) : (
        <p className="muted">{x.sWaitHost}</p>
      ))}

      {playing && qs[qi] && (
        <div className="room-q">
          <span className="chip">{x.sQ(qi + 1, QN)}</span>
          <p className="muted small">{x.sTrans}</p>
          <h2 className="lv-q">{qs[qi].w.e} {qs[qi].w.kk}</h2>
          <div className="lv-opts">
            {qs[qi].options.map((o) => (
              <button key={o.kk} disabled={Boolean(picked)} className={`lv-opt ${picked && o.kk === qs[qi].w.kk ? "right" : ""} ${picked === o.kk && o.kk !== qs[qi].w.kk ? "bad" : ""}`} onClick={() => choose(o.kk)}>
                <span>{tr(o, explain)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {done && !allDone && <p className="muted">{x.sWaitOthers}</p>}
      {done && allDone && (
        <div className="room-end">
          <Qyran mood={rank === 0 ? "cheer" : "happy"} size={90} />
          <h3>{x.sResults}: {["🥇", "🥈", "🥉"][rank] || `#${rank + 1}`}</h3>
          <button className="btn gold" onClick={leave}>{x.sAgain}</button>
        </div>
      )}
    </section>
  );
}
