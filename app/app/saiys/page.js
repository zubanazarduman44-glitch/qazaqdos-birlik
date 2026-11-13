"use client";
import "../../saiys.css";
import Avatar from "../../components/Avatar";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../../components/Store";
import Qyran from "../../components/Qyran";
import Icon from "../../components/Icon";
import { authed } from "../../../lib/auth";
import { WORDS, tr } from "../../../lib/words";
import { weekKey, prevWeekKey, weekEnd, prizeKind, COIN_PRIZES } from "../../../lib/week";
import { tx } from "../../../lib/tx";
import { SaiysHero, SaiysPrize, SaiysPodium, SaiysRace, SaiysRankList, SaiysLast, SaiysSkeleton, saiysStatus, sy } from "../../components/SaiysBoard";
import { SaiysMedal } from "../../components/SaiysArt";

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
  const x = tx(lang);
  const t = sy(lang);
  const [tab, setTab] = useState("week");
  const [rows, setRows] = useState(null);
  const [last, setLast] = useState([]);
  const [setup, setSetup] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [up, setUp] = useState(0);
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

  // Орын көтерілсе — хабаршы қуанады (соңғы көрген орын осы құрылғыда сақталады)
  const myIdx = rows ? rows.findIndex((r) => r.user_id === user?.id) : -1;
  useEffect(() => {
    if (!rows || myIdx < 0) return;
    const key = `qd_saiys_rank_${wk}`;
    try {
      const seen = Number(localStorage.getItem(key));
      if (seen > 0 && seen > myIdx + 1) setUp(seen - myIdx - 1);
      localStorage.setItem(key, String(myIdx + 1));
    } catch {}
  }, [rows, myIdx, wk]);

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
      <div className="saiys sy">
        <SaiysHero x={x} t={t} mood="support" />
        <section className="card sy-gate-card">
          <SaiysPodium ghost x={x} t={t} />
          <div className="sy-gate-text">
            <Icon name="lock" size={22} />
            <p>{x.sLogin}</p>
            <Link href="/login" className="btn gold big">{x.sLoginBtn}</Link>
          </div>
        </section>
      </div>
    );

  const status = tab === "week" ? saiysStatus(rows, user.id, x, t, up) : null;
  return (
    <div className="saiys sy">
      <SaiysHero x={x} t={t} status={status} up={up} mood={rows === null ? "think" : "idle"} />
      <div className="sy-tabs" role="tablist">
        <button role="tab" aria-selected={tab === "week"} className={tab === "week" ? "on" : ""} onClick={() => setTab("week")}><Icon name="trophy" size={18} /> {x.sWeekly}</button>
        <button role="tab" aria-selected={tab === "room"} className={tab === "room" ? "on" : ""} onClick={() => setTab("room")}><Icon name="target" size={18} /> {x.sRoom}</button>
      </div>
      {setup && <p className="alert sy-note"><Icon name="lock" size={18} /> <span>{x.sSetup}</span></p>}

      {tab === "week" && (
        <div className="sy-week">
          <div className="sy-wk">
            <div className="sy-side">
              <SaiysPrize x={x} t={t} kind={kind} ms={weekEnd() - now} label={left(weekEnd() - now)} />

              {last.length > 0 && myPrev === 0 && lastKind === "gift" && <p className="alert ok sy-note"><Icon name="trophy" size={20} /> <span>{x.sWonGift}</span></p>}
              {last.length > 0 && myPrev >= 0 && lastKind === "coins" && !claimed && (
                <button className="btn gold big sy-claim" onClick={claim}><Icon name="coin" size={20} /> {x.sClaim}: {COIN_PRIZES[myPrev]}</button>
              )}

              {rows?.length > 0 && <SaiysRace rows={rows} userId={user.id} x={x} t={t} meAvatar={state.profile.avatar} />}
            </div>

            <section className="card sy-board">
              {rows === null && <SaiysSkeleton />}
              {rows?.length === 0 && (
                <div className="sy-empty">
                  <SaiysPodium ghost x={x} t={t} />
                  <p>{x.sEmpty}</p>
                </div>
              )}
              {rows?.length > 0 && (
                <>
                  <SaiysPodium rows={rows} userId={user.id} x={x} t={t} />
                  <SaiysRankList rows={rows} userId={user.id} x={x} />
                </>
              )}
            </section>

            {last.length > 0 && <SaiysLast x={x} last={last} kind={lastKind} />}
          </div>
        </div>
      )}

      {tab === "room" && <Room x={x} user={user} state={state} explain={explain} award={award} />}
    </div>
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
      <section className="sy-join rise">
        <div className="card sy-gate">
          <span className="sy-gate-ic"><Icon name="plus" size={26} /></span>
          <h3>{x.sCreate}</h3>
          <button className="btn gold big" onClick={create}><Icon name="plus" size={18} /> {x.sCreate}</button>
        </div>
        <div className="card sy-gate">
          <span className="sy-gate-ic blue"><Icon name="target" size={26} /></span>
          <h3><label htmlFor="sy-code">{x.sCode}</label></h3>
          <div className="sy-join-row">
            <input id="sy-code" className="input sy-code-in" value={input} onChange={(e) => setInput(e.target.value.toUpperCase())} placeholder={x.sCodePh} maxLength={6} autoComplete="off" />
            <button className="btn blue" onClick={join}>{x.sJoin}</button>
          </div>
        </div>
        {err && <p className="alert sy-note"><Icon name="x" size={18} /> <span>{err}</span></p>}
      </section>
    );

  const isHost = room?.host === user.id;
  return (
    <section className="card sy-room rise">
      <div className="sy-room-top">
        <div>
          <small className="muted">{x.sShare}</small>
          <div className="sy-code" aria-label={code}>{code.split("").map((c, i) => <span key={i} aria-hidden="true">{c}</span>)}</div>
        </div>
        <button className="btn ghost small" onClick={leave}><Icon name="logout" size={16} /> {x.sLeave}</button>
      </div>

      <h3 className="sy-h">{x.sPlayers} <span className="sy-count">{players.length}/8</span></h3>
      <ul className="sy-players">
        {players.map((p, i) => (
          <li key={p.user_id} className={`${p.user_id === user.id ? "me" : ""} ${p.done ? "done" : ""}`}>
            <span className="sy-rk">{room?.status === "play" ? (i < 3 ? <SaiysMedal place={i} size={22} /> : i + 1) : <Icon name="user" size={14} />}</span>
            <Avatar value={p.avatar} size={36} />
            <span className="sy-pl-name"><span>{p.name}</span>{p.done ? <Icon name="check" size={16} className="sy-done" /> : ""}</span>
            <span className="sy-rk-score"><b>{p.score}</b> <small>{x.sPoints}</small></span>
          </li>
        ))}
      </ul>

      {room?.status === "lobby" && (isHost ? (
        <button className="btn gold big" disabled={players.length < 2} onClick={start}><Icon name="flame" size={18} /> {x.sStart}</button>
      ) : (
        <p className="sy-wait"><Qyran mood="think" size={54} /> <span>{x.sWaitHost}</span></p>
      ))}

      {playing && qs[qi] && (
        <div className="sy-q">
          <div className="sy-q-top">
            <span className="chip">{x.sQ(qi + 1, QN)}</span>
            <span className="sy-q-steps" aria-hidden="true">{qs.map((_, k) => <i key={k} className={k < qi ? "on" : k === qi ? "cur" : ""} />)}</span>
          </div>
          <p className="muted small">{x.sTrans}</p>
          <h2 className="lv-q sy-q-word" key={qi}>{qs[qi].w.e} {qs[qi].w.kk}</h2>
          <div className="lv-opts sy-opts">
            {qs[qi].options.map((o) => (
              <button key={o.kk} disabled={Boolean(picked)} className={`lv-opt ${picked && o.kk === qs[qi].w.kk ? "right" : ""} ${picked === o.kk && o.kk !== qs[qi].w.kk ? "bad" : ""}`} onClick={() => choose(o.kk)}>
                <span>{tr(o, explain)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {done && !allDone && <p className="sy-wait"><Qyran mood="think" size={54} /> <span>{x.sWaitOthers}</span></p>}
      {done && allDone && (
        <div className="sy-end">
          <Qyran mood={rank === 0 ? "cheer" : "happy"} size={110} />
          <h3>{x.sResults}: {rank >= 0 && rank < 3 ? <SaiysMedal place={rank} size={34} /> : `#${rank + 1}`}</h3>
          <button className="btn gold" onClick={leave}><Icon name="refresh" size={18} /> {x.sAgain}</button>
        </div>
      )}
    </section>
  );
}
