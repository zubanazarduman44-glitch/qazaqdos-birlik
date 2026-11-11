// Сабақ сұрақтарын құрау: түрлері араласады, әр рет басқаша
import { WORDS, shuffle, tr } from "./words";

export function wordQuiz(words, explain) {
  const kinds = ["kk2tr", "tr2kk", "e2kk", "kk2e"];
  const qs = [];
  shuffle([...words, ...words]).slice(0, Math.max(words.length + 3, 8)).forEach((w, i) => {
    const kind = kinds[(i + Math.floor(Math.random() * 2)) % kinds.length];
    const pool = WORDS.filter((z) => z.kk !== w.kk && tr(z, explain) !== tr(w, explain));
    const near = shuffle(pool.filter((z) => z.t === w.t)).slice(0, 2);
    const far = shuffle(pool.filter((z) => z.t !== w.t));
    const opts = shuffle([w, ...near, ...far].slice(0, 4));
    if (kind === "kk2tr") qs.push({ prompt: `${w.kk} → ?`, options: opts.map((o) => ({ key: o.kk, label: tr(o, explain) })), answer: w.kk });
    else if (kind === "tr2kk") qs.push({ prompt: `${tr(w, explain)} → ?`, options: opts.map((o) => ({ key: o.kk, label: o.kk })), answer: w.kk });
    else if (kind === "e2kk") qs.push({ prompt: `${w.e}  ?`, options: opts.map((o) => ({ key: o.kk, label: o.kk })), answer: w.kk });
    else qs.push({ prompt: `${w.kk} ?`, options: opts.map((o) => ({ key: o.kk, label: o.e })), answer: w.kk });
  });
  // қатарынан бірдей сөз келмесін
  return qs.filter((q, i, a) => i === 0 || q.answer !== a[i - 1].answer);
}

export function phraseQuiz(phrases, explain) {
  const t = (p) => (explain === "ru" ? p.ru : p.en);
  return shuffle(phrases).flatMap((p) => {
    const others = shuffle(phrases.filter((z) => z.kk !== p.kk)).slice(0, 3);
    const o1 = shuffle([p, ...others]);
    return [
      { prompt: p.kk, options: o1.map((o) => ({ key: o.kk, label: t(o) })), answer: p.kk },
      { prompt: t(p), options: shuffle(o1).map((o) => ({ key: o.kk, label: o.kk })), answer: p.kk },
    ];
  }).slice(0, 8);
}
