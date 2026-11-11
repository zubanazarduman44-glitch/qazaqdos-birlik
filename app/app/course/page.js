"use client";
import { useEffect, useMemo, useState } from "react";
import LangPicker from "../../components/LangPicker";
import { NatArt } from "../../components/NatArt";
import Quiz from "../../components/Quiz";
import Icon from "../../components/Icon";
import { useApp } from "../../components/Store";
import { ALL_LESSONS, LEVELS, UNITS, levelStats, lessonTitle } from "../../../lib/course";
import { TOPICS, tr } from "../../../lib/words";
import { wordQuiz, phraseQuiz } from "../../../lib/quizgen";
import { sayKk, prefetchKk, stopKk } from "../../../lib/speak";
import { L } from "../../../lib/i18n";

const TXT = {
  kicker: ["Оқу жолы", "Путь обучения", "Learning path"],
  title: ["Қазақ тілі курсы", "Курс казахского", "Kazakh course"],
  sub: ["A1-ден B1-ге дейін: тақырып бойынша сабақтар, әр сабақта сөздер, тест және марапат.", "От A1 до B1: уроки по темам, в каждом — слова, тест и награда.", "From A1 to B1: lessons by topic, each with words, a quiz and a reward."],
  lessons: ["сабақ", "уроков", "lessons"],
  learn: ["Сөздерді үйрен", "Выучите слова", "Learn the words"],
  tapFlip: ["Картаны басып аудармасын көр", "Нажмите на карточку, чтобы увидеть перевод", "Tap a card to see the translation"],
  toQuiz: ["Тестке өту", "К тесту", "Go to the quiz"],
  back: ["Артқа", "Назад", "Back"],
  done: ["Сабақ аяқталды!", "Урок пройден!", "Lesson complete!"],
  next: ["Келесі сабақ", "Следующий урок", "Next lesson"],
  again: ["Қайталау", "Повторить", "Retry"],
  locked: ["Алдыңғы сабақты аяқта", "Сначала пройдите предыдущий урок", "Finish the previous lesson first"],
  words: ["Сөздер", "Слова", "Words"],
  phrases: ["Сөз тіркестері", "Фразы", "Phrases"],
  pass: ["Өту үшін кемінде 70% дұрыс жауап керек", "Нужно минимум 70% верных ответов", "You need at least 70% correct to pass"],
};

function Player({ lesson, onClose, onNext, hasNext }) {
  const { explain, lang, state, update, award, saveWord } = useApp();
  const li = lang === "kk" ? 0 : lang === "ru" ? 1 : 2;
  const T = (k) => TXT[k][li];
  const [step, setStep] = useState("learn");
  const [flip, setFlip] = useState({});
  const [round, setRound] = useState(0);
  const [res, setRes] = useState(null);
  const qs = useMemo(() => (lesson.kind === "words" ? wordQuiz(lesson.words, explain) : phraseQuiz(lesson.phrases, explain)), [lesson.id, explain, round]); // eslint-disable-line
  const items = lesson.kind === "words" ? lesson.words : lesson.phrases;
  const [vs, setVs] = useState({}); // дыбыс күйі: { "сөз|n": "loading" }
  const speak = (kk, slow) => sayKk(kk, { slow, onState: (st) => setVs((m) => ({ ...m, [kk]: st === "idle" ? "" : st })) });
  useEffect(() => { prefetchKk(items.slice(0, 3).map((x) => x.kk)); return () => stopKk(); }, [lesson.id]); // eslint-disable-line
  const trOf = (it) => (lesson.kind === "words" ? tr(it, explain) : explain === "ru" ? it.ru : it.en);

  function finish(right, total) {
    const ok = right / total >= 0.7;
    setRes({ ok, right, total });
    if (!ok) return;
    const first = !state.course?.done?.[lesson.id];
    update((s) => ({ ...s, course: { ...(s.course || {}), done: { ...(s.course?.done || {}), [lesson.id]: { score: Math.round((right / total) * 100), at: Date.now() } } } }));
    if (first) award(15, 8);
    else award(3, 1);
    if (lesson.kind === "words") lesson.words.forEach((w) => saveWord({ kk: w.kk, ru: w.ru, en: w.en, e: w.e, src: "course" }));
  }

  return (
    <section className="card crs-player rise">
      <div className="crs-pl-head">
        <button className="btn ghost small" onClick={onClose}><Icon name="left" size={16} /> {T("back")}</button>
        <h3>{lessonTitle(lesson, lang)}</h3>
        <span className="chip">{lesson.kind === "words" ? T("words") : T("phrases")}</span>
      </div>
      {step === "learn" ? (
        <>
          <p className="muted small">{T("tapFlip")}</p>
          <div className={`crs-cards ${lesson.kind}`}>
            {items.map((it, i) => (
              <button key={it.kk} className={`crs-card ${flip[it.kk] ? "on" : ""}`} style={{ animationDelay: `${i * 0.06}s` }} onClick={() => { setFlip((f) => ({ ...f, [it.kk]: !f[it.kk] })); }}>
                {it.e && <span className="crs-e">{it.e}</span>}
                <b>{flip[it.kk] ? trOf(it) : it.kk}</b>
                <i className={`crs-say ${vs[it.kk] || ""}`} role="button" aria-label="listen" onClick={(e) => { e.stopPropagation(); speak(it.kk, false); }}>{vs[it.kk] === "loading" ? "…" : <Icon name="volume" size={16} />}</i>
                <i className="crs-say crs-slow" role="button" aria-label="slow" title="🐢" onClick={(e) => { e.stopPropagation(); speak(it.kk, true); }}>🐢</i>
              </button>
            ))}
          </div>
          <button className="btn gold big" onClick={() => { setStep("quiz"); setRes(null); }}>{T("toQuiz")} <Icon name="right" size={18} /></button>
        </>
      ) : (
        <>
          <Quiz key={round} questions={qs} onDone={finish} pass={Math.ceil(qs.length * 0.7)} />
          {res && (
            <div className={`alert ${res.ok ? "ok" : ""} rise`}>
              {res.ok ? `🎉 ${T("done")} +15 XP` : T("pass")}
              <span className="crs-actions">
                <button className="btn ghost small" onClick={() => { setRound((n) => n + 1); setRes(null); }}><Icon name="refresh" size={15} /> {T("again")}</button>
                {res.ok && hasNext && <button className="btn gold small" onClick={onNext}>{T("next")} <Icon name="right" size={15} /></button>}
              </span>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default function Course() {
  const { lang, state } = useApp();
  const li = lang === "kk" ? 0 : lang === "ru" ? 1 : 2;
  const T = (k) => TXT[k][li];
  const done = state.course?.done || {};
  const [lv, setLv] = useState(state.cefr && ["A1", "A2", "B1"].includes(state.cefr) ? state.cefr : "A1");
  const [open, setOpen] = useState(null);
  useEffect(() => {
    try {
      const id = new URLSearchParams(window.location.search).get("l");
      const les = id && ALL_LESSONS.find((x) => x.id === id);
      if (les) { const lev = LEVELS.find((v) => v.units.includes(les.topic)); if (lev) setLv(lev.id); setOpen(les.id); }
    } catch {}
  }, []);
  const level = LEVELS.find((l) => l.id === lv);
  const flat = level.units.flatMap((u) => UNITS[u].lessons);

  const cur = open && flat.find((l) => l.id === open);
  const nextOf = (l) => { const u = UNITS[l.topic].lessons; return u[u.findIndex((x) => x.id === l.id) + 1] || null; };

  return (
    <div className="course">
      <header className="page-head">
        <div>
          <span className="kicker">{T("kicker")}</span>
          <h1>{T("title")}</h1>
          <p>{T("sub")}</p>
        </div>
        <div className="head-tools"><LangPicker /></div>
      </header>

      <div className="crs-levels">
        {LEVELS.map((l) => {
          const st = levelStats(l, done);
          return (
            <button key={l.id} className={`crs-lv ${lv === l.id ? "on" : ""}`} onClick={() => { setLv(l.id); setOpen(null); }}>
              <b>{l.id}</b>
              <small>{st.done} / {st.total}</small>
              <span className="crs-lv-bar"><i style={{ width: `${(st.done / st.total) * 100}%` }} /></span>
            </button>
          );
        })}
      </div>

      {cur ? (
        <Player key={cur.id} lesson={cur} onClose={() => setOpen(null)} hasNext={!!nextOf(cur)} onNext={() => setOpen(nextOf(cur).id)} />
      ) : (
        <div className="crs-units">
          {level.units.map((u, ui) => {
            const unit = UNITS[u];
            const m = TOPICS[u];
            const nDone = unit.lessons.filter((l) => done[l.id]).length;
            return (
              <article key={u} className="card crs-unit rise" style={{ animationDelay: `${ui * 0.04}s` }}>
                <div className="crs-unit-h">
                  <span className="crs-unit-e">{m.e}</span>
                  <div>
                    <h3>{L(m, lang)}</h3>
                    <small className="muted">{nDone} / {unit.lessons.length} {T("lessons")}</small>
                  </div>
                  <NatArt name={["dombyra", "taqiya", "bowl", "kamshy", "kobyz", "yurt"][ui % 6]} size={54} />
                </div>
                <div className="crs-path">
                  {unit.lessons.map((l, i) => {
                    const prev = unit.lessons[i - 1];
                    const locked = prev && !done[prev.id];
                    return (
                      <button key={l.id} className={`crs-node ${done[l.id] ? "done" : ""} ${locked ? "lock" : ""} ${l.kind}`} disabled={locked} title={locked ? T("locked") : ""} onClick={() => setOpen(l.id)} style={{ "--o": i % 2 ? 14 : 0 }}>
                        {done[l.id] ? "✓" : l.kind === "phrases" ? "💬" : i + 1}
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
