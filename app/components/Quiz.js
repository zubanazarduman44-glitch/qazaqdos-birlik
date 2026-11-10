"use client";
import { useState } from "react";
import { useApp } from "./Store";
import Alash from "./Alash";
import Icon from "./Icon";

// Жалпы тест: questions = [{ prompt, options: [{key,label,e}], answer }]
export default function Quiz({ questions, onDone, pass = Math.ceil(questions.length * 0.8) }) {
  const { t } = useApp();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [right, setRight] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[i];

  function choose(key) {
    if (picked) return;
    setPicked(key);
    if (key === q.answer) setRight((r) => r + 1);
  }
  function next() {
    if (i + 1 >= questions.length) {
      setDone(true);
      onDone?.(right, questions.length);
    } else {
      setI(i + 1);
      setPicked(null);
    }
  }

  if (done) {
    const ok = right >= pass;
    return (
      <div className="quiz-done pop">
        <Alash mood={ok ? "cheer" : "support"} size={110} />
        <h3>{t.score(right, questions.length)}</h3>
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="quiz-top">
        <span className="badge">{t.quizQ(i + 1, questions.length)}</span>
        <div className="bar blue quiz-bar">
          <i style={{ width: `${(i / questions.length) * 100}%` }} />
        </div>
      </div>
      <h3 className="quiz-q">{q.prompt}</h3>
      <div className="quiz-opts">
        {q.options.map((o) => {
          const state = picked ? (o.key === q.answer ? "ok" : o.key === picked ? "bad" : "") : "";
          return (
            <button key={o.key} className={`qopt ${state} ${state === "bad" ? "shake" : ""}`} onClick={() => choose(o.key)} disabled={Boolean(picked)}>
              {o.e && <span className="qopt-e">{o.e}</span>}
              <span>{o.label}</span>
              {state === "ok" && <Icon name="check" size={18} stroke={3} />}
              {state === "bad" && <Icon name="x" size={18} stroke={3} />}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className={`quiz-fb rise ${picked === q.answer ? "ok" : "bad"}`}>
          <b>{picked === q.answer ? t.correct : t.wrong}</b>
          <button className="btn blue" onClick={next} autoFocus>
            {t.next} <Icon name="right" size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
