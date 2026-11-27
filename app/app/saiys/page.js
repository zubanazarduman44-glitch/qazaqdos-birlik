"use client";
import "../../saiys.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../../components/Store";
import Icon from "../../components/Icon";
import { authed } from "../../../lib/auth";
import { WORDS, tr } from "../../../lib/words";
import { weekKey, prevWeekKey, weekEnd, prizeKind, COIN_PRIZES } from "../../../lib/week";
import { tx } from "../../../lib/tx";
import { SaiysHero, SaiysPrize, SaiysRankList, SaiysLast, SaiysSkeleton, SaiysEmpty, SaiysHead, SaiysLoginGate, SaiysRoomGate, SaiysRoomView, SaiysSample, saiysStatus, sy } from "../../components/SaiysBoard";

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
  // Қонақ үлгісі: күнге бір сұрақ, тек осы бетте — award, рейтинг, Supabase жоқ
  const [demoSeed, setDemoSeed] = useState(null);
  const [demoPick, setDemoPick] = useState(null);
  useEffect(() => {
    if (!user) setDemoSeed(Math.floor(Date.now() / 864e5));
  }, [user]);
  const demoQ = useMemo(() => (demoSeed == null ? null : buildQs(demoSeed, explain)[0]), [demoSeed, explain]);

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

  // Орын көтерілсе — Aqyl қуанады (соңғы көрген орын осы құрылғыда сақталады)
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
    toast(t.coins(prize), "cheer");
  }

  const head = (
    <header className="page-head">
      <div>
        <span className="kicker">{x.sKicker}</span>
        <h1>{x.sTitle}</h1>
        <p>{x.sSub}</p>
      </div>
    </header>
  );

  if (!user)
    return (
      <div className="sy">
        {head}
        <SaiysLoginGate x={x} />
        <SaiysSample x={x} lang={lang} q={demoQ} picked={demoPick} onChoose={(k) => !demoPick && setDemoPick(k)} optLabel={(o) => tr(o, explain)} />
      </div>
    );

  const status = saiysStatus(rows, user.id, x, t, up);
  const TABS = [["week", "trophy", x.sWeekly, rows?.length || null], ["room", "target", x.sRoom, null]];
  return (
    <div className="sy">
      {head}
      <div className="sy-tabs" role="tablist" aria-label={x.sTitle}>
        {TABS.map(([id, ic, label, n]) => (
          <button key={id} type="button" role="tab" id={`sy-tab-${id}`} aria-controls={`sy-panel-${id}`} aria-selected={tab === id} className={tab === id ? "on" : ""} onClick={() => setTab(id)}>
            <Icon name={ic} size={17} /> <span>{label}</span>
            {n ? <em>{n}</em> : null}
          </button>
        ))}
      </div>
      {setup && <p className="alert sy-note"><Icon name="lock" size={18} /> <span>{x.sSetup}</span></p>}

      {tab === "week" && (
        <div className="sy-week" role="tabpanel" id="sy-panel-week" aria-labelledby="sy-tab-week">
          <SaiysHero x={x} t={t} status={status} up={up} loading={rows === null} ms={weekEnd() - now} />
          <div className="sy-wk">
            <SaiysPrize x={x} kind={kind}>
              {last.length > 0 && myPrev === 0 && lastKind === "gift" && <p className="alert ok sy-note"><Icon name="trophy" size={20} /> <span>{x.sWonGift}</span></p>}
              {last.length > 0 && myPrev >= 0 && lastKind === "coins" && !claimed && (
                <button type="button" className="btn primary sy-claim" onClick={claim}><Icon name="coin" size={20} /> {x.sClaim}: {COIN_PRIZES[myPrev]}</button>
              )}
            </SaiysPrize>

            <section className="sy-card sy-board" aria-labelledby="sy-board-h">
              <SaiysHead id="sy-board-h" icon={<Icon name="trophy" size={18} />} title={x.sPlayers} count={rows?.length || null} />
              {rows === null && <SaiysSkeleton />}
              {rows?.length === 0 && <SaiysEmpty text={x.sEmpty} />}
              {rows?.length > 0 && <SaiysRankList rows={rows} userId={user.id} x={x} />}
            </section>

            {last.length > 0 && <SaiysLast x={x} last={last} />}
          </div>
        </div>
      )}

      {tab === "room" && (
        <div role="tabpanel" id="sy-panel-room" aria-labelledby="sy-tab-room">
          <Room x={x} t={t} user={user} state={state} explain={explain} award={award} />
        </div>
      )}
    </div>
  );
}

function Room({ x, t, user, state, explain, award }) {
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
  const me = { name: state.profile.name || user.name || "Дос", avatar: state.profile.avatar || "" };

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

  const qs = useMemo(() => (room ? buildQs(room.seed, explain) : []), [room?.seed, explain]); // eslint-disable-line react-hooks/exhaustive-deps
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
  }, [done, allDone]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!code) return <SaiysRoomGate x={x} t={t} input={input} setInput={setInput} err={err} onCreate={create} onJoin={join} />;

  return (
    <SaiysRoomView
      x={x} code={code} room={room} players={players} userId={user.id} isHost={room?.host === user.id}
      qs={qs} qi={qi} qn={QN} picked={picked} score={score} done={done} allDone={allDone} rank={rank}
      onStart={start} onLeave={leave} onChoose={choose} optLabel={(o) => tr(o, explain)}
    />
  );
}
