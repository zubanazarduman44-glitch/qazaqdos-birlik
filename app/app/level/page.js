"use client";
import "../../level.css";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "../../components/Store";
import Qyran from "../../components/Qyran";
import { NatArt } from "../../components/NatArt";
import Icon from "../../components/Icon";
import ShellGlyph from "../../components/ShellGlyph";
import { levelL } from "../../components/LevelL10n";
import { QUESTIONS, LEVELS, PASS, grade } from "../../../lib/levelTest";
import { tx } from "../../../lib/tx";
import { shuffle } from "../../../lib/wordTools";
import { FIRST_LESSON, lessonHref, saveLevelResult, skipLevelTest, startLessonFor } from "../../../lib/progress";

const pick = (v, lang) => (typeof v === "string" ? v : v[lang] || v.en || v.ru || v.kk);

// Деңгей тесті. Бұрынғы «1/20 қайта көрінетін» қате: тест аяқталғанда levelPending өшіп, Shell басқа орауышқа
// ауысатын → бет қайта монтталып, ?first=1 тестті автоматты түрде қайта бастайтын (нәтиже профильде сақталып қойған).
// Енді: (1) Shell тұрақты; (2) автоматты бастау жоқ — пайдаланушы өзі таңдайды; (3) нәтиже state.levelTest-те сақталады,
// сондықтан жаңарту/артқа қайту нәтиже экранын көрсетеді; (4) бір «run» бір рет қана жазылады және марапатталады.
const RUN_KEY = "qd_level_run";
const readRun = () => {
  try {
    const r = JSON.parse(sessionStorage.getItem(RUN_KEY) || "null");
    if (r && r.run && Array.isArray(r.order) && Array.isArray(r.answers) && r.order.length === QUESTIONS.length) return r;
  } catch {}
  return null;
};
const saveRun = (r) => { try { sessionStorage.setItem(RUN_KEY, JSON.stringify(r)); } catch {} };
const clearRun = () => { try { sessionStorage.removeItem(RUN_KEY); } catch {} };

function Level() {
  const { lang, state, update, award, ready } = useApp();
  const router = useRouter();
  // Онбордингтен кейінгі алғашқы кіру: таңдау мен «тестті өткізу» батырмасы көрінеді, бірақ тест өздігінен басталмайды
  const first = useSearchParams().get("first") === "1" || Boolean(state.profile.levelPending);
  const x = tx(lang);
  const lx = levelL(lang);
  const [quiz, setQuiz] = useState(null); // { run, order, answers } — жүріп жатқан тест
  const [picked, setPicked] = useState(null);
  const lock = useRef(false);
  const timer = useRef(null);
  const finished = useRef(new Set());
  const stateRef = useRef(state);
  stateRef.current = state;

  function finish(q) {
    if (finished.current.has(q.run)) return;
    finished.current.add(q.run);
    clearRun();
    const g = grade(q.answers);
    const prev = stateRef.current.levelTest;
    update((s) => saveLevelResult(s, q.run, g));
    // Марапат тек алғашқы аяқталған тест үшін және тек бір рет (қайта тапсыру XP жинау тәсілі болмайды)
    if (!prev?.done) award(20 + g.total * 2, 10);
    setQuiz(null);
    setPicked(null);
    lock.current = false;
  }

  // Жаңартудан кейін: жүріп жатқан тест сол сұрақтан жалғасады; 20 жауап берілген болса — бірден нәтиже
  useEffect(() => {
    if (!ready) return;
    const r = readRun();
    if (!r) return;
    if (r.answers.length >= QUESTIONS.length) finish(r);
    else setQuiz(r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
  useEffect(() => () => clearTimeout(timer.current), []);

  function start() {
    const q = { run: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, order: QUESTIONS.map((qq) => shuffle(qq.o.map((_, k) => k))), answers: [] };
    saveRun(q);
    lock.current = false;
    setPicked(null);
    setQuiz(q);
  }
  // «Нөлден бастаймын» / «Тестті өткізу»: нәтиже ретінде есептелмейді, бірден A1-дің алғашқы сабағы
  function fromZero() {
    clearTimeout(timer.current);
    clearRun();
    setQuiz(null);
    update((s) => skipLevelTest(s));
    router.push(lessonHref(FIRST_LESSON));
  }
  function answer(k) {
    if (!quiz || picked !== null || lock.current) return;
    lock.current = true;
    setPicked(k);
    const next = { ...quiz, answers: [...quiz.answers, k] };
    saveRun(next);
    timer.current = setTimeout(() => {
      if (next.answers.length < QUESTIONS.length) {
        setQuiz(next);
        setPicked(null);
        lock.current = false;
      } else finish(next);
    }, 650);
  }

  const lvls = ["A0", ...LEVELS];
  // localStorage жүктелгенше ештеңе көрсетпейміз (кіріспе бір сәтке жыпылықтамасын)
  if (!ready) return <div className="level lvx" aria-busy="true" />;
  const saved = state.levelTest?.done && state.levelTest.per ? state.levelTest : null;
  const phase = quiz ? "quiz" : saved ? "result" : "intro";
  if (phase === "intro")
    return (
      <div className="level lvx">
        <section className="card lv-intro lvx-intro rise">
          <Qyran mood="wow" size={140} />
          <span className="kicker">{x.lvlKicker}</span>
          <h1>{x.lvlTitle}</h1>
          <p>{x.lvlSub}</p>
          {state.cefr && (
            <p className="chip gold">
              {x.lvlResult}: {state.cefr} · {x.lvlNames[state.cefr]}
            </p>
          )}
          <h2 className="lvx-choose">{lx.choose}</h2>
          <div className="lvx-choices">
            <button type="button" className="lvx-choice is-zero" onClick={fromZero}>
              <span className="lvx-choice-gl" aria-hidden="true"><ShellGlyph name="trail" size={24} /></span>
              <span className="lvx-choice-t"><b>{lx.zero}</b><small>{lx.zeroSub}</small></span>
              <Icon name="right" size={18} className="lvx-choice-go" />
            </button>
            <button type="button" className="lvx-choice is-find" onClick={start}>
              <span className="lvx-choice-gl" aria-hidden="true"><Icon name="chart" size={22} /></span>
              <span className="lvx-choice-t"><b>{lx.find}</b><small>{lx.findSub}</small></span>
              <Icon name="right" size={18} className="lvx-choice-go" />
            </button>
          </div>
          <p className="muted small">{lx.later}</p>
        </section>
        <section className="card lv-how rise">
          <h2>{x.lvlHow}</h2>
          <ol>
            {x.lvlSteps?.map(([h, d], n) => (
              <li key={n}><b>{n + 1}</b><div><strong>{h}</strong><span>{d}</span></div></li>
            ))}
          </ol>
          <div className="lv-art"><NatArt name="dombyra" size={90} /><NatArt name="yurt" size={90} /><NatArt name="taqiya" size={80} /><NatArt name="bowl" size={80} /><NatArt name="kamshy" size={90} /></div>
        </section>
      </div>
    );

  if (phase === "quiz") {
    const i = quiz.answers.length;
    const order = quiz.order;
    const q = QUESTIONS[i];
    const pct = ((i + (picked !== null ? 1 : 0)) / QUESTIONS.length) * 100;
    const mood = picked === null ? "think" : picked === q.a ? "happy" : "support";
    return (
      <div className="level lvx">
        <div className="lvx-trail" aria-hidden="true">
          {lvls.slice(1).map((l) => (
            <span key={l} className={`lvx-stop ${q.lvl === l ? "now" : lvls.indexOf(l) < lvls.indexOf(q.lvl) ? "past" : ""}`}>{l}</span>
          ))}
        </div>
        <section className="card lv-quiz lvx-quiz">
          <div className="lv-top lvx-top">
            <span className="lvx-count">{x.lvlQ(i + 1, QUESTIONS.length)}</span>
            <div className="lvx-bar" role="progressbar" aria-valuemin={0} aria-valuemax={QUESTIONS.length} aria-valuenow={i + 1} aria-label={x.lvlQ(i + 1, QUESTIONS.length)}>
              <i style={{ transform: `scaleX(${pct / 100})` }} />
            </div>
          </div>
          <div className="lvx-ask" key={i}>
            <span className="lvx-aqyl"><Qyran mood={mood} size={74} /></span>
            <h2 className="lv-q">{pick(q.p, lang)}</h2>
          </div>
          <div className="lv-opts lvx-opts" key={`o${i}`}>
            {order[i].map((k, n) => {
              const on = picked === k;
              const right = picked !== null && k === q.a;
              const bad = on && k !== q.a;
              return (
                <button key={k} className={`lv-opt ${right ? "right" : ""} ${bad ? "bad" : ""}`} disabled={picked !== null} onClick={() => answer(k)} style={{ animationDelay: `${n * 0.05}s` }}>
                  <i>{right ? <Icon name="check" size={16} stroke={3} /> : bad ? <Icon name="x" size={16} stroke={3} /> : String.fromCharCode(65 + n)}</i>
                  <span>{pick(q.o[k], lang)}</span>
                </button>
              );
            })}
          </div>
          <div className="lvx-dont">
            <button className={`lvx-dont-b ${picked === -1 ? "on" : ""}`} disabled={picked !== null} onClick={() => answer(-1)}>
              <ShellGlyph name="feather" size={18} /> {x.lvlDont}
            </button>
            <small>{lx.tip}</small>
          </div>
          {first && (
            <button type="button" className="lvx-skip" onClick={fromZero} disabled={picked !== null}>
              {lx.skip} <Icon name="right" size={16} />
            </button>
          )}
        </section>
      </div>
    );
  }

  const res = saved;
  const cur = res.cefr;
  const startId = startLessonFor(cur, state.course?.done || {});
  const ci = lvls.indexOf(cur);
  return (
    <div className="level lvx">
      <section className="card lv-res lvx-res">
        <div className="lvx-burst" aria-hidden="true">
          {Array.from({ length: 10 }, (_, n) => <i key={n} style={{ "--a": `${n * 36}deg`, "--d": `${n * 0.03}s` }} />)}
        </div>
        <Qyran mood={cur === "A0" ? "support" : "cheer"} size={130} />
        <span className="kicker">{x.lvlResult}</span>
        <div className="lv-badge lvx-badge">{cur}</div>
        <h2>{x.lvlNames[cur]}</h2>
        <p className="lvx-desc">{x.lvlDesc[cur]}</p>
        <ol className="lvx-scale" aria-label={x.lvlResult}>
          {lvls.map((l, n) => (
            <li key={l} className={n === ci ? "on" : n < ci ? "past" : ""} aria-current={n === ci ? "true" : undefined}>
              <i />
              <b>{l}</b>
            </li>
          ))}
        </ol>
        <div className="lvx-per" aria-label={lx.per}>
          {LEVELS.map((l) => (
            <span key={l} className={(res.per[l]?.ok || 0) >= PASS[l] ? "ok" : ""}>
              <b>{l}</b> {res.per[l]?.ok || 0}/{res.per[l]?.n || 0}
            </span>
          ))}
        </div>
        <p className="muted small">{x.lvlScore(res.total, res.count)}</p>
        <div className="lvx-next">
          <span className="lvx-next-gl"><ShellGlyph name="trail" size={22} /></span>
          <div>
            <b>{lx.next}</b>
            <p>{x.lvlNext[cur]}</p>
            <small>{x.lvlHint}</small>
          </div>
        </div>
        <div className="lv-actions">
          <Link href={startId ? lessonHref(startId) : "/app/course"} className="btn blue big">
            {lx.lesson} <Icon name="right" size={18} />
          </Link>
          <Link href="/app" className="btn ghost">
            {lx.home}
          </Link>
          <button className="btn ghost" onClick={start}>
            <Icon name="refresh" size={16} /> {x.lvlRetake}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Level />
    </Suspense>
  );
}
