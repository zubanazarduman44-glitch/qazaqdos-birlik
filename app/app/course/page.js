"use client";
import { useEffect, useState } from "react";
import SectionIntro from "../../components/SectionIntro";
import LangPicker from "../../components/LangPicker";
import Icon from "../../components/Icon";
import dynamic from "next/dynamic";
import TopicArt from "../../components/TopicArt";
import { useApp } from "../../components/Store";
import { ALL_LESSONS, LEVELS, UNITS, levelStats, lessonTitle } from "../../../lib/course";
import { TOPICS } from "../../../lib/words";
import { L } from "../../../lib/i18n";
import { whenIdle } from "../../../lib/idle";

// Сабақ ойнатқышы (сабақ жоспары, дыбыс) тек сабақ ашылғанда керек: бөлек чанк, жол беті ашылған соң алдын ала жүктеледі
const loadPlayer = () => import("../../components/LessonPlayer");
const LessonPlayer = dynamic(() => import("../../components/LessonPlayer"), { loading: () => <section className="lp" aria-busy="true" /> });

const INTRO = {
  kk: { title: "Tilbil — қазақ тілін ретімен үйрен", text: "A1-ден B2-ге дейінгі жол: әр аялдама — бір тақырыптағы шағын сабақ. Алдымен жаңа сөздермен танысасың, сосын оларды әртүрлі жаттығулармен бекітесің.", points: ["Бір сабақ — бірнеше минут", "70% дұрыс жауап берсең, келесі сабақ ашылады", "Қате жіберген сөздерің соңында қайталанады"] },
  ru: { title: "Tilbil — учите казахский по порядку", text: "Путь от A1 до B2: каждая остановка — короткий урок по одной теме. Сначала знакомитесь с новыми словами, потом закрепляете их разными упражнениями.", points: ["Урок занимает несколько минут", "70% верных ответов открывают следующий урок", "Слова с ошибками повторяются в конце"] },
  en: { title: "Tilbil — learn Kazakh step by step", text: "A path from A1 to B2: each stop is a short lesson on one topic. Meet the new words first, then lock them in with a mix of exercises.", points: ["Each lesson takes a few minutes", "70% correct answers unlock the next lesson", "Words you missed come back at the end"] },
  zh: { title: "Tilbil — 循序渐进学哈萨克语", text: "从 A1 到 B2 的学习路线：每一站都是一个主题的短课。先认识新单词，再通过多种练习把它们记牢。", points: ["每课只需几分钟", "答对 70% 即可解锁下一课", "答错的单词会在最后复习"] },
  es: { title: "Tilbil — aprende kazajo paso a paso", text: "Un camino de A1 a B2: cada parada es una lección corta sobre un tema. Primero conoces las palabras nuevas y luego las fijas con ejercicios variados.", points: ["Cada lección dura unos minutos", "Con un 70 % de aciertos se abre la siguiente lección", "Las palabras que fallas se repasan al final"] },
  de: { title: "Tilbil — Kasachisch Schritt für Schritt", text: "Ein Weg von A1 bis B2: Jede Station ist eine kurze Lektion zu einem Thema. Erst lernst du die neuen Wörter kennen, dann festigst du sie mit verschiedenen Übungen.", points: ["Eine Lektion dauert nur ein paar Minuten", "Mit 70 % richtigen Antworten öffnet sich die nächste Lektion", "Falsch beantwortete Wörter kommen am Ende noch einmal"] },
  fr: { title: "Tilbil — apprends le kazakh pas à pas", text: "Un parcours de A1 à B2 : chaque étape est une courte leçon sur un thème. Tu découvres d’abord les nouveaux mots, puis tu les fixes avec des exercices variés.", points: ["Une leçon prend quelques minutes", "70 % de bonnes réponses débloquent la leçon suivante", "Les mots ratés reviennent à la fin"] },
  tr: { title: "Tilbil — Kazakçayı adım adım öğren", text: "A1'den B2'ye bir yol: her durak tek bir konuda kısa bir derstir. Önce yeni kelimelerle tanışır, sonra onları farklı alıştırmalarla pekiştirirsin.", points: ["Bir ders birkaç dakika sürer", "%70 doğru cevap bir sonraki dersi açar", "Yanlış yaptığın kelimeler sonda tekrar gelir"] },
  ar: { title: "Tilbil — تعلّم الكازاخية خطوة بخطوة", text: "طريق من المستوى A1 إلى B2: كل محطة درس قصير عن موضوع واحد. تتعرّف أولًا على الكلمات الجديدة، ثم تثبّتها بتمارين متنوّعة.", points: ["يستغرق الدرس بضع دقائق", "70% من الإجابات الصحيحة تفتح الدرس التالي", "الكلمات التي أخطأت فيها تتكرر في النهاية"] },
  ko: { title: "Tilbil — 카자흐어를 차근차근 배워요", text: "A1부터 B2까지의 길: 정류장마다 한 가지 주제의 짧은 수업이 있어요. 먼저 새 단어를 익히고, 여러 가지 연습으로 확실히 외워요.", points: ["한 수업은 몇 분이면 끝나요", "70% 이상 맞히면 다음 수업이 열려요", "틀린 단어는 마지막에 다시 나와요"] },
  ja: { title: "Tilbil — カザフ語を一歩ずつ", text: "A1 から B2 までの道のり。各ステップは一つのテーマの短いレッスンです。まず新しい単語に出会い、いろいろな練習でしっかり覚えます。", points: ["1レッスンは数分で完了", "70% 正解で次のレッスンが開く", "間違えた単語は最後にもう一度"] },
};

const TXT = {
  kicker: ["Оқу жолы", "Путь обучения", "Learning path"],
  title: ["Tilbil", "Tilbil", "Tilbil"],
  sub: ["A1-ден B2-ге дейін: тақырып бойынша сабақтар, әр сабақта сөздер, тест және марапат.", "От A1 до B2: уроки по темам, в каждом — слова, тест и награда.", "From A1 to B2: lessons by topic, each with words, a quiz and a reward."],
  lessons: ["сабақ", "уроков", "lessons"],
  season: [["Көктеу", "Жайлау", "Күзеу", "Қыстау"], ["Коктеу · весна", "Жайлау · лето", "Кузеу · осень", "Кыстау · зима"], ["Kokteu · spring", "Zhailau · summer", "Kuzeu · autumn", "Kystau · winter"]],
  seasonSub: [["Алғашқы қадамдар", "Еркін сөйлесу", "Терең түсіну", "Шеберлік"], ["Первые шаги", "Свободный разговор", "Глубокое понимание", "Мастерство"], ["First steps", "Everyday talk", "Deeper understanding", "Mastery"]],
  here: ["Осы жерден жалғастыр", "Продолжить отсюда", "Continue from here"],
  begin: ["Бастау", "Начать", "Start"],
  repeat: ["Қайталау", "Повторить", "Review"],
  unitDone: ["Бөлім өтілді", "Раздел пройден", "Unit complete"],
  passed: ["Сабақ есепке алынды", "Урок засчитан", "Lesson counted"],
  failed: ["Әзірге жетпеді — тағы бір рет көр", "Пока не хватило — попробуйте ещё раз", "Not quite yet — have another go"],
  toPath: ["Жолға оралу", "Вернуться к пути", "Back to the path"],
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
  const [res, setRes] = useState(null);
  const [round, setRound] = useState(0);

  function finish({ right, total }) {
    const ok = total > 0 && right / total >= 0.7;
    setRes({ ok, right, total });
    if (!ok) return;
    const first = !state.course?.done?.[lesson.id];
    update((s) => ({ ...s, course: { ...(s.course || {}), done: { ...(s.course?.done || {}), [lesson.id]: { score: Math.round((right / total) * 100), at: Date.now() } } } }));
    if (first) award(15, 8);
    else award(3, 1);
    if (lesson.kind === "words") lesson.words.forEach((w) => saveWord({ kk: w.kk, ru: w.ru, en: w.en, e: w.e, src: "course" }));
  }

  return (
    <section className="crs-play">
      <LessonPlayer key={`${lesson.id}-${round}`} lesson={lesson} lang={lang} explain={explain} onFinish={finish} onClose={onClose} />
      {res && (
        <div className={`crs-after ${res.ok ? "ok" : "no"}`} role="status">
          <b>{res.ok ? T("passed") : T("failed")}</b>
          <span>{res.right} / {res.total}{res.ok ? "" : ` · ${T("pass")}`}</span>
          <div className="crs-after-btns">
            {res.ok && hasNext && <button className="btn primary big" onClick={onNext}>{T("next")} <Icon name="right" size={18} /></button>}
            {!res.ok && <button className="btn primary big" onClick={() => { setRes(null); setRound((r) => r + 1); }}><Icon name="refresh" size={18} /> {T("again")}</button>}
            <button className="btn ghost big" onClick={onClose}>{T("toPath")}</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default function Course() {
  const { lang, state } = useApp();
  const li = lang === "kk" ? 0 : lang === "ru" ? 1 : 2;
  const T = (k) => TXT[k][li];
  const done = state.course?.done || {};
  const [lv, setLv] = useState(state.cefr && LEVELS.some((l) => l.id === state.cefr) ? state.cefr : "A1");
  const [open, setOpen] = useState(null);
  useEffect(() => whenIdle(loadPlayer), []);
  useEffect(() => {
    try {
      const id = new URLSearchParams(window.location.search).get("l");
      const les = id && ALL_LESSONS.find((x) => x.id === id);
      if (les) { const lev = LEVELS.find((v) => v.units.includes(les.topic)); if (lev) setLv(lev.id); setOpen(les.id); }
    } catch {}
  }, []);
  const level = LEVELS.find((l) => l.id === lv);
  const lvi = LEVELS.findIndex((l) => l.id === lv);
  const flat = level.units.flatMap((u) => UNITS[u].lessons);
  const cur = open && flat.find((l) => l.id === open);
  const nextOf = (l) => { const u = UNITS[l.topic].lessons; return u[u.findIndex((x) => x.id === l.id) + 1] || null; };
  // Жолдағы ағымдағы аялдама: осы деңгейдегі алғашқы өтілмеген сабақ
  const here = flat.find((l) => !done[l.id]);

  if (cur) return <div className="course playing"><Player key={cur.id} lesson={cur} onClose={() => setOpen(null)} hasNext={!!nextOf(cur)} onNext={() => setOpen(nextOf(cur).id)} /></div>;

  return (
    <div className="course">
      <header className="page-head">
        <div>
          <span className="kicker">{T("kicker")}</span>
          <h1>{T("title")}</h1>
        </div>
        <div className="head-tools"><LangPicker /></div>
      </header>
      <SectionIntro icon="map" {...(INTRO[lang] || INTRO.en)} />

      <div className="kosh-levels" role="tablist">
        {LEVELS.map((l, i) => {
          const st = levelStats(l, done);
          return (
            <button key={l.id} role="tab" aria-selected={lv === l.id} className={`kosh-lv s${i} ${lv === l.id ? "on" : ""}`} onClick={() => setLv(l.id)}>
              <span className="kosh-lv-id">{l.id}</span>
              <span className="kosh-lv-t"><b>{TXT.season[li][i]}</b><small>{TXT.seasonSub[li][i]}</small></span>
              <span className="kosh-lv-n">{st.done}/{st.total}</span>
              <span className="kosh-lv-bar"><i style={{ width: `${(st.done / st.total) * 100}%` }} /></span>
            </button>
          );
        })}
      </div>

      <ol className={`kosh s${lvi}`}>
        {level.units.map((u, ui) => {
          const unit = UNITS[u];
          const m = TOPICS[u];
          const nDone = unit.lessons.filter((l) => done[l.id]).length;
          const full = nDone === unit.lessons.length;
          const nextL = unit.lessons.find((l) => !done[l.id]);
          const isHere = here && here.topic === u;
          return (
            <li key={u} className={`aul ${ui % 2 ? "r" : "l"} ${full ? "full" : ""} ${isHere ? "here" : ""}`}>
              <div className="aul-art"><TopicArt topic={u} size={132} />{full && <span className="aul-seal" aria-label={T("unitDone")}><Icon name="check" size={20} /></span>}</div>
              <div className="aul-body">
                <span className="aul-n">{ui + 1}</span>
                <h3>{L(m, lang)}</h3>
                <p className="aul-meta">{nDone} / {unit.lessons.length} {T("lessons")}{full ? ` · ${T("unitDone")}` : ""}</p>
                <div className="trail">
                  {unit.lessons.map((l, i) => {
                    const prev = unit.lessons[i - 1];
                    const locked = prev && !done[prev.id];
                    const isCur = nextL && nextL.id === l.id;
                    return (
                      <button key={l.id} className={`stop ${done[l.id] ? "done" : ""} ${locked ? "lock" : ""} ${isCur ? "cur" : ""} ${l.kind}`} disabled={locked} aria-label={`${lessonTitle(l, lang)}${locked ? ` — ${T("locked")}` : ""}`} title={locked ? T("locked") : lessonTitle(l, lang)} onClick={() => setOpen(l.id)}>
                        {done[l.id] ? <Icon name="check" size={18} /> : locked ? <Icon name="lock" size={15} /> : l.kind === "phrases" ? <Icon name="chat" size={17} /> : i + 1}
                      </button>
                    );
                  })}
                </div>
                {nextL ? (
                  <button className={`btn ${isHere ? "primary" : "ghost"} aul-cta`} onClick={() => setOpen(nextL.id)}>{isHere ? T("here") : nDone ? T("next") : T("begin")} <Icon name="right" size={16} /></button>
                ) : (
                  <button className="btn ghost aul-cta" onClick={() => setOpen(unit.lessons[0].id)}><Icon name="refresh" size={16} /> {T("repeat")}</button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
