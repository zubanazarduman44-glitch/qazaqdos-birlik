"use client";
// Сабақ ойнатқышы: танысу → әртүрлі жаттығулар → «Қайта орал» → қорытынды.
// Дүкенге (useApp) тәуелді емес: бәрі props арқылы келеді. Логика — lib/lessonPlan.js ішінде.
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import Icon from "./Icon";
import { sayKk, prefetchKk, stopKk } from "../../lib/speak";
import {
  buildPlan, checkBuild, checkChoice, explainLang, hashSeed, initMatch, initSession, lessonItems, matchDone, matchTap,
  norm, seededRng, sessionProgress, sessionReducer, sessionResult,
} from "../../lib/lessonPlan";

const TXT = {
  close: ["Сабақты жабу", "Закрыть урок", "Close lesson"],
  progress: ["Сабақ барысы", "Прогресс урока", "Lesson progress"],
  meetWords: ["Жаңа сөздермен таныс", "Познакомьтесь с новыми словами", "Meet the new words"],
  meetPhrases: ["Жаңа сөйлемдермен таныс", "Познакомьтесь с новыми фразами", "Meet the new phrases"],
  listen: ["Тыңдау", "Слушать", "Listen"],
  slow: ["Баяу тыңдау", "Слушать медленно", "Listen slowly"],
  slowShort: ["Баяу", "Медленно", "Slowly"],
  noSound: ["Дыбыс қазір қолжетімсіз", "Звук сейчас недоступен", "Sound is unavailable right now"],
  next: ["Келесі", "Далее", "Next"],
  back: ["Артқа", "Назад", "Back"],
  start: ["Жаттығуға көшу", "К упражнениям", "Start practising"],
  cont: ["Жалғастыру", "Продолжить", "Continue"],
  check: ["Тексеру", "Проверить", "Check"],
  again: ["Қайта орал", "Вернёмся ещё раз", "Come back"],
  chooseTr: ["Аудармасын таңда", "Выберите перевод", "Choose the translation"],
  chooseKk: ["Қазақшасын таңда", "Выберите казахский вариант", "Choose the Kazakh for this"],
  listenQ: ["Тыңда да, естігеніңді таңда", "Послушайте и выберите, что услышали", "Listen and choose what you heard"],
  cant: ["Қазір тыңдай алмаймын", "Сейчас не могу слушать", "I can't listen right now"],
  match: ["Жұбын тап", "Найдите пары", "Match the pairs"],
  matchHint: ["Алдымен бір тақташаны, сосын оның жұбын бас", "Нажмите на плитку, затем на её пару", "Tap a tile, then tap its pair"],
  notPair: ["Бұл жұп емес", "Это не пара", "Not a pair"],
  pairsFound: ["жұп табылды", "пар найдено", "pairs found"],
  build: ["Сөзді әріптерден құра", "Соберите слово из букв", "Spell the word from the letters"],
  buildWords: ["Сөздерден құрастыр", "Соберите из слов", "Build it from the words"],
  order: ["Сөйлемді құрастыр", "Составьте предложение", "Put the sentence together"],
  yourAnswer: ["Сенің жауабың", "Ваш ответ", "Your answer"],
  tiles: ["Тақташалар", "Плитки", "Tiles"],
  remove: ["алып тастау", "убрать", "remove"],
  tf: ["Аудармасы дұрыс па?", "Перевод верный?", "Is this translation right?"],
  yes: ["Иә, дұрыс", "Да, верно", "Yes, it is"],
  no: ["Жоқ, қате", "Нет, неверно", "No, it isn't"],
  gap: ["Түсіп қалған сөзді тап", "Найдите пропущенное слово", "Find the missing word"],
  right: ["Дұрыс!", "Верно!", "Correct!"],
  wrong: ["Дұрыс емес", "Неверно", "Not quite"],
  answerIs: ["Дұрыс жауабы:", "Правильный ответ:", "Correct answer:"],
  slips: ["Барлық жұп табылды, бірақ қате кетті", "Все пары найдены, но были ошибки", "All pairs found, with a few slips"],
  willReturn: ["Бұған сабақ соңында қайта ораламыз.", "Вернёмся к этому в конце урока.", "We'll come back to this at the end."],
  markRight: ["дұрыс", "верно", "correct"],
  markWrong: ["қате", "неверно", "wrong"],
  done: ["Сабақ аяқталды", "Урок завершён", "Lesson complete"],
  firstTry: ["бірінші реттен дұрыс", "верно с первой попытки", "right on the first try"],
  sumWords: ["Осы сабақтағы сөздер", "Слова этого урока", "Words in this lesson"],
  sumPhrases: ["Осы сабақтағы сөйлемдер", "Фразы этого урока", "Phrases in this lesson"],
  clean: ["бірден дұрыс", "сразу верно", "right first time"],
  repeated: ["қайталанды", "повторяли", "repeated"],
};

/* debugStep: сан — толық тізбектегі орын (алдымен танысу карталары, сосын қадамдар);
   жол — "intro", "intro:2", "summary", "summary:bad", немесе қадам түрі: "match", "build:mid", "choose:ok", "gap:bad",
   "choose:tr2kk", "listen:reveal". */
function debugSession(debugStep, plan, introN, items) {
  const base = initSession(plan, introN);
  const raw = String(debugStep);
  if (/^\d+$/.test(raw)) {
    const n = Number(raw);
    if (n < introN) return [{ ...base, introIdx: n }, null];
    if (n - introN < plan.length) return [{ ...base, phase: "steps", pos: n - introN }, null];
    return [{ ...base, phase: "summary", pos: plan.length, first: Object.fromEntries(plan.map((p) => [p.origin, true])) }, null];
  }
  const [name, arg] = raw.split(":");
  if (name === "intro") return [{ ...base, introIdx: Math.min(Math.max(Number(arg) || 0, 0), Math.max(introN - 1, 0)) }, null];
  if (name === "summary") {
    const bad = arg === "bad" ? items.slice(1, 3).map((x) => x.kk) : [];
    const first = Object.fromEntries(plan.map((p, i) => [p.origin, !(arg === "bad" && (i === 1 || i === 4))]));
    return [{ ...base, phase: "summary", pos: plan.length, first, mistakes: bad }, null];
  }
  let pos = plan.findIndex((p) => p.type === name && (!arg || !p.dir || !/2/.test(arg) || p.dir === arg));
  if (pos < 0) pos = 0;
  const preset = arg && !/2/.test(arg) ? arg : null;
  const step = plan[pos];
  const answered = preset === "ok" ? { correct: true, requeued: false } : preset === "bad" ? { correct: false, requeued: true } : null;
  const st = { ...base, phase: "steps", pos, answered, mistakes: answered && !answered.correct ? step.items.slice(0, 2) : [] };
  if (preset === "again") st.queue = plan.map((p, i) => (i === pos ? { ...p, repeat: 1 } : p));
  return [st, preset];
}

function useSpeak() {
  const [snd, setSnd] = useState({ key: "", st: "" });
  const say = useCallback((text, slow = false) => {
    const key = (slow ? "s|" : "n|") + text;
    try {
      Promise.resolve(sayKk(text, { slow, onState: (st) => setSnd({ key, st: st === "idle" ? "" : st }) })).catch(() => setSnd({ key, st: "error" }));
    } catch {
      setSnd({ key, st: "error" });
    }
  }, []);
  return [snd, say];
}

/* ── Ортақ бөлшектер ── */
function SayButtons({ text, snd, say, T, big = false }) {
  const st = (slow) => (snd.key === (slow ? "s|" : "n|") + text ? snd.st : "");
  return (
    <div className={`lp-audio ${big ? "lp-audio-big" : ""}`}>
      <button type="button" className={`lp-say ${st(false)}`} aria-label={T("listen")} aria-busy={st(false) === "loading"} onClick={() => say(text, false)}>
        <Icon name="volume" size={big ? 40 : 22} />
        {!big && <span>{T("listen")}</span>}
      </button>
      <button type="button" className={`lp-say lp-turtle ${st(true)}`} aria-label={T("slow")} aria-busy={st(true) === "loading"} onClick={() => say(text, true)}>
        <span className="lp-turtle-e" aria-hidden="true">🐢</span>
        <span>{T("slowShort")}</span>
      </button>
    </div>
  );
}

function Mark({ state, T }) {
  if (state !== "is-right" && state !== "is-wrong") return <span className="lp-mark" aria-hidden="true" />;
  return (
    <span className="lp-mark">
      <Icon name={state === "is-right" ? "check" : "x"} size={18} stroke={3} />
      <span className="lp-sr">{state === "is-right" ? T("markRight") : T("markWrong")}</span>
    </span>
  );
}

function Options({ options, picked, answerKey, done, onPick, kkLabels, long, T }) {
  return (
    <div className={`lp-opts ${long ? "lp-opts-long" : ""}`} role="group">
      {options.map((o, i) => {
        const isAns = norm(o.key) === norm(answerKey);
        const state = !done ? "" : isAns ? "is-right" : picked === o.key ? "is-wrong" : "is-dim";
        return (
          <button key={o.key} type="button" className={`lp-opt ${state}`} disabled={done} onClick={() => onPick(o.key)}>
            <span className="lp-key" aria-hidden="true">{i + 1}</span>
            <span className="lp-opt-label" lang={kkLabels ? "kk" : undefined}>{o.label}</span>
            <Mark state={state} T={T} />
          </button>
        );
      })}
    </div>
  );
}

function Ask({ children, step, T }) {
  return (
    <div className="lp-ask">
      {step.repeat > 0 && (
        <span className="lp-again"><Icon name="refresh" size={14} /> {T("again")}</span>
      )}
      <h2>{children}</h2>
    </div>
  );
}

// 1–4 пернелері мен жауапты бір жерде басқаратын ілмек
function usePick(step, { answered, onAnswer, keys, preset }, isRight) {
  const [picked, setPicked] = useState(() => {
    if (preset === "ok") return step.type === "truefalse" ? String(step.answer) : step.answer;
    if (preset === "bad") return step.type === "truefalse" ? String(!step.answer) : step.options.find((o) => norm(o.key) !== norm(step.answer))?.key ?? null;
    return null;
  });
  const done = !!answered;
  const pick = (key) => {
    if (done || picked != null) return;
    setPicked(key);
    onAnswer(isRight(key));
  };
  useEffect(() => {
    const list = step.type === "truefalse" ? ["true", "false"] : step.options.map((o) => o.key);
    keys.current = { digit: (i) => list[i] != null && pick(list[i]) };
    return () => { keys.current = {}; };
  });
  return [picked, pick, done];
}

/* ── Қадам түрлері ── */
function ChooseStep(p) {
  const { step, T, snd, say } = p;
  const [picked, pick, done] = usePick(step, p, (k) => checkChoice(step, k));
  const kk2tr = step.dir === "kk2tr";
  const long = step.options.some((o) => o.label.length > 20);
  return (
    <>
      <Ask step={step} T={T}>{kk2tr ? T("chooseTr") : T("chooseKk")}</Ask>
      <div className={`lp-prompt ${kk2tr ? "" : "lp-prompt-tr"} ${step.prompt.length > 20 ? "lp-prompt-long" : ""}`}>
        <span className="lp-prompt-word" lang={kk2tr ? "kk" : undefined}>{step.prompt}</span>
        {kk2tr && <SayButtons text={step.item.kk} snd={snd} say={say} T={T} />}
      </div>
      <Options T={T} options={step.options} picked={picked} answerKey={step.answer} done={done} onPick={pick} kkLabels={!kk2tr} long={long} />
    </>
  );
}

function ListenStep(p) {
  const { step, T, snd, say, preset, live } = p;
  const [picked, pick, done] = usePick(step, p, (k) => checkChoice(step, k));
  const [reveal, setReveal] = useState(preset === "reveal");
  const failed = snd.st === "error" && snd.key.endsWith("|" + step.audio);
  useEffect(() => { if (live) say(step.audio, false); }, []); // eslint-disable-line
  const show = reveal || failed || done;
  return (
    <>
      <Ask step={step} T={T}>{T("listenQ")}</Ask>
      <div className="lp-listen">
        <SayButtons text={step.audio} snd={snd} say={say} T={T} big />
        {show ? (
          <p className="lp-reveal" lang="kk">{step.audio}</p>
        ) : (
          <button type="button" className="lp-cant" onClick={() => setReveal(true)}>{T("cant")}</button>
        )}
        {failed && !done && <p className="lp-note" role="status">{T("noSound")}</p>}
      </div>
      <Options T={T} options={step.options} picked={picked} answerKey={step.answer} done={done} onPick={pick} kkLabels long={step.options.some((o) => o.label.length > 20)} />
    </>
  );
}

function TrueFalseStep(p) {
  const { step, T, snd, say } = p;
  const [picked, pick, done] = usePick(step, p, (k) => (k === "true") === step.answer);
  const opts = [["true", T("yes")], ["false", T("no")]];
  return (
    <>
      <Ask step={step} T={T}>{T("tf")}</Ask>
      <div className="lp-tf">
        <span className="lp-tf-kk" lang="kk">{step.kk}</span>
        <span className="lp-tf-eq" aria-hidden="true">=</span>
        <span className="lp-tf-tr">{step.shown}</span>
        <SayButtons text={step.kk} snd={snd} say={say} T={T} />
      </div>
      <div className="lp-opts lp-opts-two" role="group">
        {opts.map(([key, label], i) => {
          const isAns = (key === "true") === step.answer;
          const state = !done ? "" : isAns ? "is-right" : picked === key ? "is-wrong" : "is-dim";
          return (
            <button key={key} type="button" className={`lp-opt ${state}`} disabled={done} onClick={() => pick(key)}>
              <span className="lp-key" aria-hidden="true">{i + 1}</span>
              <span className="lp-opt-label">{label}</span>
              <Mark state={state} T={T} />
            </button>
          );
        })}
      </div>
    </>
  );
}

function GapStep(p) {
  const { step, T } = p;
  const [picked, pick, done] = usePick(step, p, (k) => checkChoice(step, k));
  const ok = done && picked != null && checkChoice(step, picked);
  return (
    <>
      <Ask step={step} T={T}>{T("gap")}</Ask>
      <div className="lp-gap">
        <p className="lp-gap-kk" lang="kk">
          {step.before ? step.before + " " : ""}
          <span className={`lp-blank ${done ? (ok ? "is-right" : "is-fixed") : ""}`}>{done ? step.answer : " "}</span>
          {step.after}
          {step.tail ? " " + step.tail : ""}
        </p>
        <p className="lp-gap-tr">{step.prompt}</p>
      </div>
      <Options T={T} options={step.options} picked={picked} answerKey={step.answer} done={done} onPick={pick} kkLabels />
    </>
  );
}

function MatchStep({ step, T, answered, onAnswer, keys, preset }) {
  const [m, setM] = useState(() => {
    const st = initMatch();
    const all = step.pairs.map((x) => x.kk);
    if (preset === "ok") return { ...st, locked: all };
    if (preset === "bad") return { ...st, locked: all, wrong: step.items.slice(0, 2) };
    if (preset === "mid") return { ...st, locked: step.left.slice(0, 2), pick: { side: "l", kk: step.left[2] } };
    if (preset === "miss") return { ...st, locked: step.left.slice(0, 1), miss: { l: step.left[1], r: step.right.find((k) => k !== step.left[1] && k !== step.left[0]) } };
    return st;
  });
  const done = !!answered;
  const by = useMemo(() => Object.fromEntries(step.pairs.map((x) => [x.kk, x])), [step]);
  const tap = (side, kk) => { if (!done) setM((st) => matchTap(st, side, kk)); };
  const finished = matchDone(m, step);
  useEffect(() => {
    if (finished && !done && !preset) onAnswer(m.wrong.length === 0, m.wrong);
  }, [finished]); // eslint-disable-line
  useEffect(() => {
    if (!m.miss || preset) return;
    const t = setTimeout(() => setM((st) => (st.miss === m.miss ? { ...st, miss: null } : st)), 900);
    return () => clearTimeout(t);
  }, [m.miss]); // eslint-disable-line
  useEffect(() => { keys.current = {}; });
  const long = step.pairs.some((x) => x.kk.length > 16 || x.tr.length > 16);
  const col = (side) => (
    <div className="lp-col">
      {(side === "l" ? step.left : step.right).map((kk) => {
        const locked = m.locked.includes(kk);
        const miss = m.miss && m.miss[side] === kk;
        const sel = m.pick && m.pick.side === side && m.pick.kk === kk;
        const state = locked ? "is-locked" : miss ? "is-miss" : sel ? "is-pick" : "";
        return (
          <button key={kk} type="button" className={`lp-tile lp-pair ${state}`} disabled={locked || done} aria-pressed={sel ? true : undefined} onClick={() => tap(side, kk)} lang={side === "l" ? "kk" : undefined}>
            <span className="lp-pair-label">{side === "l" ? kk : by[kk].tr}</span>
            {locked && <span className="lp-mark"><Icon name="check" size={16} stroke={3} /><span className="lp-sr">{T("markRight")}</span></span>}
            {miss && <span className="lp-mark"><Icon name="x" size={16} stroke={3} /><span className="lp-sr">{T("markWrong")}</span></span>}
          </button>
        );
      })}
    </div>
  );
  return (
    <>
      <Ask step={step} T={T}>{T("match")}</Ask>
      <p className="lp-hint">{T("matchHint")}</p>
      <div className={`lp-match ${long ? "lp-match-long" : ""}`}>
        {col("l")}
        {col("r")}
      </div>
      <p className={`lp-status ${m.miss ? "is-miss" : ""}`} role="status" aria-live="polite">
        {m.miss ? (
          <><Icon name="x" size={16} stroke={3} /> {T("notPair")}</>
        ) : (
          <>{m.locked.length} / {step.pairs.length} {T("pairsFound")}</>
        )}
      </p>
    </>
  );
}

function BuildStep({ step, T, answered, onAnswer, keys, preset }) {
  const need = step.solution.length;
  const [placed, setPlaced] = useState(() => {
    if (preset === "ok") return step.solution.map((_, i) => `t${i}`);
    if (preset === "bad") return step.tiles.filter((t) => !t.extra).map((t) => t.id);
    if (preset === "mid") return step.solution.slice(0, Math.max(1, Math.ceil(need / 2))).map((_, i) => `t${i}`);
    return [];
  });
  const done = !!answered;
  const by = useMemo(() => Object.fromEntries(step.tiles.map((t) => [t.id, t])), [step]);
  const letters = step.mode === "letters";
  const ready = letters ? placed.length === need : placed.length >= Math.min(need, 2);
  const put = (id) => { if (!done) setPlaced((p) => (p.includes(id) || (letters && p.length >= need) ? p : [...p, id])); };
  const take = (id) => { if (!done) setPlaced((p) => p.filter((x) => x !== id)); };
  const check = () => {
    if (done || !ready) return;
    onAnswer(checkBuild(placed.map((id) => by[id].ch), step.answer, step.mode));
  };
  useEffect(() => {
    keys.current = {
      enter: check,
      back: () => setPlaced((p) => p.slice(0, -1)),
      char: (ch) => { const t = step.tiles.find((x) => !placed.includes(x.id) && letters && norm(x.ch) === norm(ch)); if (t) put(t.id); },
      digit: (i) => { if (!letters) { const free = step.tiles.filter((x) => !placed.includes(x.id)); if (free[i]) put(free[i].id); } },
    };
    return () => { keys.current = {}; };
  });
  const ok = done && answered.correct;
  const empty = letters ? Math.max(0, need - placed.length) : 0;
  return (
    <>
      <Ask step={step} T={T}>{step.type === "order" ? T("order") : letters ? T("build") : T("buildWords")}</Ask>
      <div className={`lp-prompt lp-prompt-tr ${step.prompt.length > 20 ? "lp-prompt-long" : ""}`}>
        {step.item.e ? <span className="lp-prompt-e" aria-hidden="true">{step.item.e}</span> : null}
        <span className="lp-prompt-word">{step.prompt}</span>
      </div>
      <div className={`lp-slots lp-${step.mode} ${done ? (ok ? "is-right" : "is-wrong") : ""}`} role="group" aria-label={T("yourAnswer")} lang="kk">
        {placed.map((id) => (
          <button key={id} type="button" className="lp-tile lp-chip is-placed" disabled={done} onClick={() => take(id)} aria-label={`${by[id].ch} — ${T("remove")}`}>
            {by[id].ch}
          </button>
        ))}
        {Array.from({ length: empty }, (_, i) => <span key={`e${i}`} className="lp-slot" aria-hidden="true" />)}
        {!letters && !placed.length && <span className="lp-slot lp-slot-wide" aria-hidden="true" />}
        {done && <span className="lp-mark"><Icon name={ok ? "check" : "x"} size={18} stroke={3} /><span className="lp-sr">{ok ? T("markRight") : T("markWrong")}</span></span>}
      </div>
      <div className={`lp-bank lp-${step.mode}`} role="group" aria-label={T("tiles")} lang="kk">
        {step.tiles.map((t) => {
          const used = placed.includes(t.id);
          return (
            <button key={t.id} type="button" className={`lp-tile lp-chip ${used ? "is-used" : ""}`} disabled={used || done} aria-hidden={used ? true : undefined} onClick={() => put(t.id)}>
              {t.ch}
            </button>
          );
        })}
      </div>
      {!done && (
        <div className="lp-actions">
          <button type="button" className="btn primary big lp-cta" disabled={!ready} onClick={check}>{T("check")}</button>
        </div>
      )}
    </>
  );
}

const STEPS = { choose: ChooseStep, listen: ListenStep, truefalse: TrueFalseStep, gap: GapStep, match: MatchStep, build: BuildStep, order: BuildStep };

/* ── Танысу ── */
function Intro({ item, idx, total, phrases, T, snd, say }) {
  const err = snd.st === "error" && snd.key.endsWith("|" + item.kk);
  return (
    <div className={`lp-intro ${phrases ? "lp-intro-phrase" : ""}`}>
      <p className="lp-kicker">{phrases ? T("meetPhrases") : T("meetWords")} <span className="lp-kicker-n">{idx + 1} / {total}</span></p>
      <div className="lp-meet">
        <div className="lp-art" aria-hidden="true">{item.e ? <span>{item.e}</span> : <Icon name="chat" size={48} stroke={1.6} />}</div>
        <h2 className="lp-word" lang="kk">{item.kk}</h2>
        <span className="lp-horn" aria-hidden="true" />
        <p className="lp-tr">{item.tr}</p>
        <SayButtons text={item.kk} snd={snd} say={say} T={T} />
        {err && <p className="lp-note" role="status">{T("noSound")}</p>}
      </div>
    </div>
  );
}

/* ── Қорытынды ── */
function Summary({ items, result, phrases, T }) {
  const pct = result.total ? Math.round((result.right / result.total) * 100) : 100;
  const bad = new Set(result.mistakes);
  return (
    <div className="lp-sum">
      <div className="lp-sum-head">
        <span className="lp-sum-badge" aria-hidden="true"><Icon name="check" size={30} stroke={3} /></span>
        <h2 tabIndex={-1}>{T("done")}</h2>
        <p className="lp-sum-score"><b>{pct}%</b><span>{result.right} / {result.total} · {T("firstTry")}</span></p>
      </div>
      <h3 className="lp-sum-cap">{phrases ? T("sumPhrases") : T("sumWords")}</h3>
      <ul className="lp-sum-list">
        {items.map((it) => {
          const rep = bad.has(it.kk);
          return (
            <li key={it.kk} className={rep ? "is-rep" : "is-clean"}>
              {it.e ? <span className="lp-sum-e" aria-hidden="true">{it.e}</span> : null}
              <span className="lp-sum-w"><b lang="kk">{it.kk}</b><span>{it.tr}</span></span>
              <span className="lp-sum-mark"><Icon name={rep ? "refresh" : "check"} size={16} stroke={2.6} /> {rep ? T("repeated") : T("clean")}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function LessonPlayer({ lesson, lang, explain, onFinish, onClose, debugStep }) {
  const li = lang === "kk" ? 0 : lang === "ru" ? 1 : 2;
  const T = (k) => TXT[k][li];
  const ex = explainLang(explain);
  const phrases = lesson.kind === "phrases";
  const debug = debugStep !== undefined && debugStep !== null && debugStep !== "";
  const items = useMemo(() => lessonItems(lesson, ex), [lesson, ex]);

  // Алғашқы көрініс тұрақты тұқыммен құрылады (сервер мен браузерде бірдей), кейін кездейсоқ жоспарға ауысады.
  const boot = () => {
    const plan = buildPlan(lesson, ex, seededRng(hashSeed(lesson.id)));
    return debug ? debugSession(debugStep, plan, items.length, items) : [initSession(plan, items.length), null];
  };
  const presetRef = useRef(null);
  const [s, dispatch] = useReducer(sessionReducer, null, () => { const [st, preset] = boot(); presetRef.current = preset; return st; });
  const finished = useRef(false);
  const keys = useRef({});
  const live = useRef(s);
  live.current = s;
  const stageRef = useRef(null);
  const rootRef = useRef(null);
  const ctaRef = useRef(null);
  const [snd, say] = useSpeak();

  useEffect(() => {
    if (debug) return undefined;
    finished.current = false;
    dispatch({ type: "reset", plan: buildPlan(lesson, ex), introCount: items.length });
    try { prefetchKk(items.map((x) => x.kk)); } catch {}
    return () => { try { stopKk(); } catch {} };
  }, [lesson.id, ex]); // eslint-disable-line

  const step = s.phase === "steps" ? s.queue[s.pos] : null;
  const result = useMemo(() => sessionResult(s), [s]);

  // Қорытындыға жеткенде ата-компонентке бір-ақ рет хабарлаймыз
  useEffect(() => {
    if (s.phase !== "summary" || finished.current || debug) return;
    finished.current = true;
    if (onFinish) onFinish(result);
  }, [s.phase]); // eslint-disable-line

  // Танысуда келесі сөзге өткенде оны дауыстап айтамыз (бірінші карта — тек түйме басылғанда)
  useEffect(() => {
    if (!debug && s.phase === "intro" && s.introIdx > 0 && items[s.introIdx]) say(items[s.introIdx].kk, false);
  }, [s.phase, s.introIdx]); // eslint-disable-line

  // Фокус: жауаптан кейін — «Жалғастыру», жаңа қадамда — сахна
  const answeredNow = !!s.answered;
  useEffect(() => { if (!debug && answeredNow && ctaRef.current) ctaRef.current.focus(); }, [answeredNow]); // eslint-disable-line
  const viewKey = s.phase === "intro" ? `i${s.introIdx}` : s.phase === "steps" ? step?.id : "sum";
  const firstView = useRef(true);
  useEffect(() => {
    if (firstView.current) { firstView.current = false; return; }
    if (debug) return;
    // Жаңа қадамның басы экраннан жоғары қалып қоймасын
    const root = rootRef.current;
    if (root && root.getBoundingClientRect().top < 0 && root.scrollIntoView) root.scrollIntoView({ block: "start" });
    if (stageRef.current) stageRef.current.focus({ preventScroll: true });
  }, [viewKey]); // eslint-disable-line

  // Пернетақта: 1–4 — нұсқа, Enter — тексеру / жалғастыру, әріптер мен Backspace — тақташалар
  useEffect(() => {
    const onKey = (e) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      const within = (sel) => !!(t && t.closest && t.closest(sel));
      if (within("input, textarea, select, [contenteditable='true']")) return;
      const st = live.current;
      if (e.key === "Enter") {
        if (e.repeat || within("button:not(:disabled), a[href]")) return; // батырманың өз басылуы жеткілікті
        if (st.phase === "intro") dispatch({ type: "introNext" });
        else if (st.phase === "steps") { if (st.answered) dispatch({ type: "continue" }); else if (keys.current.enter) keys.current.enter(); }
        return;
      }
      if (st.phase !== "steps" || st.answered) return;
      if (/^[1-9]$/.test(e.key)) { if (keys.current.digit) keys.current.digit(Number(e.key) - 1); }
      else if (e.key === "Backspace") { if (keys.current.back) keys.current.back(); }
      else if (e.key.length === 1 && keys.current.char) keys.current.char(e.key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onAnswer = (correct, wrong) => dispatch({ type: "answer", correct, wrong, seed: Math.random() });
  const prog = sessionProgress(s);
  const Step = step ? STEPS[step.type] : null;
  const fb = s.answered;

  return (
    <section ref={rootRef} className={`lp lp-phase-${s.phase}`} data-step={step ? step.type : s.phase}>
      <header className="lp-top">
        <button type="button" className="lp-close" aria-label={T("close")} onClick={onClose}><Icon name="x" size={22} /></button>
        <div className="lp-frets" role="progressbar" aria-label={T("progress")} aria-valuemin={0} aria-valuemax={prog.total} aria-valuenow={prog.done}>
          {Array.from({ length: prog.total }, (_, i) => (
            <i key={i} className={`${i < prog.done ? "on" : i === prog.current ? "cur" : ""}${i === s.introN && s.introN > 0 ? " lp-nut" : ""}`} />
          ))}
        </div>
      </header>

      <div className="lp-stage" ref={stageRef} tabIndex={-1} key={viewKey}>
        {s.phase === "intro" && items[s.introIdx] && <Intro item={items[s.introIdx]} idx={s.introIdx} total={s.introN} phrases={phrases} T={T} snd={snd} say={say} />}
        {Step && <Step step={step} T={T} answered={s.answered} onAnswer={onAnswer} keys={keys} snd={snd} say={say} preset={presetRef.current} live={!debug} />}
        {s.phase === "summary" && <Summary items={items} result={result} phrases={phrases} T={T} />}
      </div>

      {s.phase === "intro" && (
        <footer className="lp-foot">
          <div className="lp-foot-row">
            {s.introIdx > 0 && (
              <button type="button" className="btn ghost big lp-back" aria-label={T("back")} onClick={() => dispatch({ type: "introBack" })}><Icon name="left" size={20} /></button>
            )}
            <button type="button" className="btn primary big lp-cta" onClick={() => dispatch({ type: "introNext" })}>
              {s.introIdx + 1 < s.introN ? T("next") : T("start")} <Icon name="right" size={20} />
            </button>
          </div>
        </footer>
      )}

      {s.phase === "steps" && fb && (
        <footer className={`lp-foot lp-fb ${fb.correct ? "is-ok" : "is-bad"}`}>
          <div className="lp-fb-body" role="status" aria-live="polite">
            <span className="lp-fb-ic" aria-hidden="true"><Icon name={fb.correct ? "check" : "x"} size={22} stroke={3} /></span>
            <div className="lp-fb-txt">
              <b>{fb.correct ? T("right") : step.type === "match" ? T("slips") : T("wrong")}</b>
              {step.item && (
                <p className="lp-fb-ans">
                  {!fb.correct && <span className="lp-fb-cap">{T("answerIs")}</span>}
                  <span lang="kk" className="lp-fb-kk">{step.item.kk}</span>
                  <span className="lp-fb-tr">{step.item.tr}</span>
                </p>
              )}
              {!fb.correct && fb.requeued && <p className="lp-fb-note">{T("willReturn")}</p>}
            </div>
          </div>
          <button type="button" ref={ctaRef} className="btn primary big lp-cta" onClick={() => dispatch({ type: "continue" })}>
            {T("cont")} <Icon name="right" size={20} />
          </button>
        </footer>
      )}
    </section>
  );
}
