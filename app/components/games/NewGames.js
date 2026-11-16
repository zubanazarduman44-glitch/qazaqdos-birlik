"use client";
// Тіл шеберханасы — қазақ тілінің нақты қиындықтарына арналған үш ойын:
//   Жалғау (жалғау мен үндестік) · Керуен (сөз тәртібі) · Тыңда (ұқсас дыбыстарды ажырату)
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../Store";
import Icon from "../Icon";
import Frame, { Burst, Camel, Clock, Dombyra, Options, Ready, TimeBar, useFinish } from "./Frame";
import { WORDS, shuffle, tr, wordsByTopic } from "../../../lib/words";
import { PHRASES } from "../../../lib/words2";
import { PHRASES_D } from "../../../lib/words6";
import { sayKk, stopKk } from "../../../lib/speak";
import { FORMS, NOUNS, allowed, attach, optionsFor } from "./jalgau";

const ROUND = 10; // бір айналымдағы сұрақ саны
const WIN = 7; // жеңіс үшін дұрыс жауап саны

/* ═════ Мәтіндер: 11 тіл (kk ru en zh es de fr tr ar ko ja); жоқ болса — ағылшынша ═════ */
const LANGS = ["kk", "ru", "en", "zh", "es", "de", "fr", "tr", "ar", "ko", "ja"];
const S = {
  next: ["Келесі", "Далее", "Next", "下一个", "Siguiente", "Weiter", "Suivant", "Sonraki", "التالي", "다음", "次へ"],
  check: ["Тексеру", "Проверить", "Check", "检查", "Comprobar", "Prüfen", "Vérifier", "Kontrol et", "تحقّق", "확인", "確認"],
  hint: ["Көмек", "Подсказка", "Hint", "提示", "Pista", "Tipp", "Indice", "İpucu", "تلميح", "힌트", "ヒント"],
  clear: ["Тазалау", "Сбросить", "Clear", "清空", "Borrar", "Leeren", "Effacer", "Temizle", "مسح", "지우기", "クリア"],
  answer: ["Дұрысы", "Правильно так", "Correct answer", "正确答案", "Respuesta correcta", "Richtig ist", "Bonne réponse", "Doğrusu", "الصواب", "정답", "正解"],
  streak: ["қатарынан", "подряд", "in a row", "连对", "seguidas", "in Folge", "d'affilée", "üst üste", "متتالية", "연속", "連続"],
  timeUp: ["Уақыт бітті", "Время вышло", "Time's up", "时间到", "Se acabó el tiempo", "Zeit abgelaufen", "Temps écoulé", "Süre doldu", "انتهى الوقت", "시간 종료", "時間切れ"],
  time: ["Уақыт", "Время", "Time", "时间", "Tiempo", "Zeit", "Temps", "Süre", "الوقت", "시간", "時間"],
  listen: ["Тыңдау", "Прослушать", "Listen", "听", "Escuchar", "Anhören", "Écouter", "Dinle", "استمع", "듣기", "聞く"],
  // Жалғау
  pick: ["Дұрыс жалғауды тігіп жалға", "Пришейте верное окончание", "Stitch on the right ending", "缝上正确的词尾", "Cose la terminación correcta", "Nähe die richtige Endung an", "Couds la bonne terminaison", "Doğru eki dik", "خِط اللاحقة الصحيحة", "알맞은 어미를 꿰매세요", "正しい語尾を縫い付けよう"],
  formHead: ["Жалғау түрі", "Тип окончания", "Ending type", "词尾类型", "Tipo de terminación", "Endungstyp", "Type de terminaison", "Ek türü", "نوع اللاحقة", "어미 종류", "語尾の種類"],
  mixed: ["Аралас", "Вперемешку", "Mixed", "混合", "Mezcla", "Gemischt", "Mélange", "Karışık", "متنوع", "섞어서", "ミックス"],
  f_pl: ["Көптік жалғау", "Множественное число", "Plural", "复数", "Plural", "Plural", "Pluriel", "Çoğul", "الجمع", "복수", "複数"],
  f_dat: ["Барыс септік", "Дательный падеж", "Dative", "向格", "Dativo", "Dativ", "Datif", "Yönelme hâli", "حالة الاتجاه", "여격", "与格"],
  f_loc: ["Жатыс септік", "Местный падеж", "Locative", "位格", "Locativo", "Lokativ", "Locatif", "Bulunma hâli", "حالة المكان", "처격", "位格"],
  f_abl: ["Шығыс септік", "Исходный падеж", "Ablative", "从格", "Ablativo", "Ablativ", "Ablatif", "Ayrılma hâli", "حالة المصدر", "탈격", "奪格"],
  f_acc: ["Табыс септік", "Винительный падеж", "Accusative", "宾格", "Acusativo", "Akkusativ", "Accusatif", "Belirtme hâli", "حالة النصب", "대격", "対格"],
  f_gen: ["Ілік септік", "Родительный падеж", "Genitive", "属格", "Genitivo", "Genitiv", "Génitif", "İlgi hâli", "حالة الإضافة", "속격", "属格"],
  f_ins: ["Көмектес септік", "Творительный падеж", "Instrumental", "工具格", "Instrumental", "Instrumental", "Instrumental", "Araç hâli", "حالة الأداة", "조격", "具格"],
  f_p1: ["Тәуелдік жалғау", "Притяжательное: мой", "Possessive: my", "领属：我的", "Posesivo: mi", "Possessiv: mein", "Possessif : mon", "İyelik: benim", "الملكية: لي", "소유: 나의", "所有：私の"],
  back: ["жуан дауысты", "твёрдая гласная", "back vowel", "后元音", "vocal posterior", "hinterer Vokal", "voyelle postérieure", "kalın ünlü", "صائت خلفي", "후설 모음", "後舌母音"],
  front: ["жіңішке дауысты", "мягкая гласная", "front vowel", "前元音", "vocal anterior", "vorderer Vokal", "voyelle antérieure", "ince ünlü", "صائت أمامي", "전설 모음", "前舌母音"],
  c_V: ["соңы дауысты", "на конце гласная", "ends in a vowel", "以元音结尾", "termina en vocal", "endet auf Vokal", "finit par une voyelle", "ünlüyle biter", "تنتهي بصائت", "모음으로 끝남", "母音で終わる"],
  c_S: ["соңы үнді", "на конце сонорный", "ends in a sonorant", "以响音结尾", "termina en sonante", "endet auf Sonorant", "finit par une sonante", "akıcı ünsüzle biter", "تنتهي بصوت رنّان", "공명음으로 끝남", "共鳴音で終わる"],
  c_Z: ["соңы ұяң", "на конце звонкий", "ends in a voiced consonant", "以浊辅音结尾", "termina en sonora", "endet stimmhaft", "finit par une sonore", "ötümlü ünsüzle biter", "تنتهي بصامت مجهور", "유성 자음으로 끝남", "有声子音で終わる"],
  c_T: ["соңы қатаң", "на конце глухой", "ends in a voiceless consonant", "以清辅音结尾", "termina en sorda", "endet stimmlos", "finit par une sourde", "ötümsüz ünsüzle biter", "تنتهي بصامت مهموس", "무성 자음으로 끝남", "無声子音で終わる"],
  // Керуен
  build: ["Сөйлемді құра", "Соберите предложение", "Build the sentence", "组成句子", "Forma la frase", "Bilde den Satz", "Forme la phrase", "Cümleyi kur", "كوّن الجملة", "문장을 만드세요", "文を作ろう"],
  tip: ["Баяндауыш сөйлемнің соңында тұрады", "Сказуемое стоит в конце предложения", "The predicate comes at the end of the sentence", "谓语位于句末", "El predicado va al final de la frase", "Das Prädikat steht am Satzende", "Le prédicat se place en fin de phrase", "Yüklem cümlenin sonunda yer alır", "يأتي المسند في آخر الجملة", "서술어는 문장 끝에 옵니다", "述語は文末に置かれます"],
  len: ["{n} сөзден тұратын сөйлемдер", "Предложения из {n} слов", "Sentences of {n} words", "{n} 个词的句子", "Frases de {n} palabras", "Sätze mit {n} Wörtern", "Phrases de {n} mots", "{n} kelimelik cümleler", "جمل من {n} كلمات", "{n}단어 문장", "{n}語の文"],
  empty: ["Төмендегі сөздерді бас", "Нажимайте на слова ниже", "Tap the words below", "点击下面的词", "Toca las palabras de abajo", "Tippe unten auf die Wörter", "Touche les mots ci-dessous", "Aşağıdaki kelimelere dokun", "اضغط على الكلمات أدناه", "아래 단어를 누르세요", "下の単語をタップ"],
  yours: ["Сенің сөйлемің", "Ваше предложение", "Your sentence", "你的句子", "Tu frase", "Dein Satz", "Ta phrase", "Senin cümlen", "جملتك", "내 문장", "あなたの文"],
  words: ["Сөздер", "Слова", "Words", "词语", "Palabras", "Wörter", "Mots", "Kelimeler", "الكلمات", "단어", "単語"],
  // Тыңда
  which: ["Қай сөз айтылды?", "Какое слово прозвучало?", "Which word did you hear?", "你听到的是哪个词？", "¿Qué palabra has oído?", "Welches Wort hast du gehört?", "Quel mot as-tu entendu ?", "Hangi kelimeyi duydun?", "أيّ كلمة سمعت؟", "어떤 단어를 들었나요?", "どの単語が聞こえた？"],
  replay: ["Қайта тыңдау", "Ещё раз", "Replay", "重听", "Repetir", "Nochmal", "Réécouter", "Tekrar dinle", "إعادة", "다시 듣기", "もう一度"],
  slow: ["Баяу", "Медленно", "Slowly", "慢速", "Despacio", "Langsam", "Lentement", "Yavaş", "ببطء", "천천히", "ゆっくり"],
  noAudio: ["Дыбыс қолжетімсіз", "Звук недоступен", "Audio unavailable", "音频不可用", "Audio no disponible", "Ton nicht verfügbar", "Audio indisponible", "Ses kullanılamıyor", "الصوت غير متاح", "소리를 사용할 수 없음", "音声が利用できません"],
  skip: ["Өткізіп жіберу", "Пропустить", "Skip", "跳过", "Saltar", "Überspringen", "Passer", "Geç", "تخطَّ", "건너뛰기", "スキップ"],
  retry: ["Қайталап көру", "Повторить попытку", "Try again", "重试", "Reintentar", "Erneut versuchen", "Réessayer", "Yeniden dene", "أعد المحاولة", "다시 시도", "再試行"],
  readMode: ["Дыбыссыз режим: аудармасына сай сөзді таңда", "Режим без звука: выберите слово по переводу", "Silent mode: pick the word that matches the translation", "无声模式：根据译文选词", "Modo sin sonido: elige la palabra según la traducción", "Modus ohne Ton: Wähle das Wort zur Übersetzung", "Mode sans son : choisis le mot d'après la traduction", "Sessiz mod: çeviriye uyan kelimeyi seç", "وضع بلا صوت: اختر الكلمة المطابقة للترجمة", "무음 모드: 번역에 맞는 단어를 고르세요", "無音モード：訳に合う単語を選ぼう"],
  loading: ["Жүктелуде…", "Загрузка…", "Loading…", "加载中…", "Cargando…", "Lädt…", "Chargement…", "Yükleniyor…", "جارٍ التحميل…", "불러오는 중…", "読み込み中…"],
};
function useNt() {
  const { lang } = useApp();
  return useMemo(() => {
    const i = LANGS.indexOf(lang);
    const out = {};
    for (const [k, v] of Object.entries(S)) out[k] = v[i < 0 ? 2 : i];
    return out;
  }, [lang]);
}

/* ═════ Ортақ: айналым күйі (10 сұрақ), нәтиже, серия ═════ */
function useRound(id, makeQ) {
  const { t } = useApp();
  const { finish, reset } = useFinish(id);
  const [phase, setPhase] = useState("ready");
  const [q, setQ] = useState(null);
  const [picked, setPicked] = useState(null);
  const [marks, setMarks] = useState([]);
  const [streak, setStreak] = useState(0);
  const [result, setResult] = useState(null);
  const marksRef = useRef([]);
  const lv = useRef(1);
  const timer = useRef(0);
  const make = useRef(makeQ);
  make.current = makeQ;
  useEffect(() => () => clearTimeout(timer.current), []);

  const start = useCallback(
    (level = 1) => {
      reset();
      clearTimeout(timer.current);
      lv.current = level;
      marksRef.current = [];
      setMarks([]);
      setStreak(0);
      setResult(null);
      setPicked(null);
      setQ(make.current(0));
      setPhase("run");
    },
    [reset]
  );
  const mark = useCallback((ok) => {
    marksRef.current = [...marksRef.current, ok];
    setMarks(marksRef.current);
    setStreak((s) => (ok ? s + 1 : 0));
  }, []);
  const next = useCallback(() => {
    clearTimeout(timer.current);
    const m = marksRef.current;
    if (m.length >= ROUND) {
      const right = m.filter(Boolean).length;
      const win = right >= WIN;
      finish(win, right, lv.current);
      setResult({ win, text: t.score(right, ROUND), stars: !win ? 0 : right >= 9 ? 3 : right >= 8 ? 2 : 1 });
      setPhase("end");
    } else {
      setPicked(null);
      setQ(make.current(m.length));
    }
  }, [finish, t]);
  const auto = useCallback((ms) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(next, ms);
  }, [next]);
  const swap = useCallback(() => {
    // сұрақты есепке алмай ауыстыру (мысалы, дыбыс шықпаса)
    clearTimeout(timer.current);
    setPicked(null);
    setQ(make.current(marksRef.current.length));
  }, []);
  return { phase, q, picked, setPicked, marks, streak, result, start, mark, next, auto, swap };
}

function Pips({ marks, className = "" }) {
  const n = Math.min(marks.length + 1, ROUND);
  return (
    <span className={`ng-pips ${className}`} role="img" aria-label={`${n} / ${ROUND}`}>
      {Array.from({ length: ROUND }, (_, i) => (
        <i key={i} className={marks[i] === true ? "ok" : marks[i] === false ? "bad" : i === marks.length ? "cur" : ""} />
      ))}
    </span>
  );
}
function TopBar({ marks, streak, nt, children }) {
  return (
    <div className="ng-top">
      <Pips marks={marks} />
      <span className="ng-side">
        {children}
        {streak >= 2 && (
          <span className="g-streak" key={streak} aria-live="polite">
            <Icon name="flame" size={16} /> ×{streak} <small>{nt.streak}</small>
          </span>
        )}
        <span className="ng-count">
          <b>{Math.min(marks.length + 1, ROUND)}</b> / {ROUND}
        </span>
      </span>
    </div>
  );
}
function Mark({ ok }) {
  return (
    <span className={`ng-mark ${ok ? "ok" : "bad"}`} aria-hidden="true">
      <Icon name={ok ? "check" : "x"} size={16} stroke={3} />
    </span>
  );
}
function SayBtn({ text, label, slow = false }) {
  return (
    <button type="button" className="ng-say" onClick={() => sayKk(text, { slow })} aria-label={`${label}: ${text}`}>
      <Icon name="volume" size={18} />
    </button>
  );
}
function Feedback({ ok, onNext, nt, children }) {
  return (
    <div className={`ng-fb ${ok ? "ok" : "bad"}`} role="status">
      <Mark ok={ok} />
      <div className="ng-fb-txt">{children}</div>
      <button type="button" className="btn blue small ng-next" onClick={onNext}>
        {nt.next} <Icon name="right" size={15} />
      </button>
    </div>
  );
}
// 1–4 пернелері (нұсқа таңдау) және Enter (келесі сұрақ)
function useKeys({ active, options, picked, onPick, onNext, extra }) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "Enter" && picked) {
        if (e.target?.closest?.("button, a")) return; // түйменің өз әрекеті орындалсын
        e.preventDefault();
        return onNext();
      }
      if (extra?.(e)) return;
      const i = "123456789".indexOf(e.key);
      if (i < 0 || picked || !options?.[i]) return;
      onPick(options[i].key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
}

/* ═════════════════════════ 1. ЖАЛҒАУ ═════════════════════════ */
const NOUN_SET = new Set(NOUNS);
let nounPool = null;
function nouns() {
  if (!nounPool) {
    const seen = new Set();
    nounPool = WORDS.filter((w) => NOUN_SET.has(w.kk) && !seen.has(w.kk) && seen.add(w.kk));
  }
  return nounPool;
}
// Сұрақ сөздері (әрқашан қазақша)
const ASK = { pl: "кімдер? нелер?", dat: "кімге? неге? қайда?", loc: "кімде? неде? қайда?", abl: "кімнен? неден? қайдан?", acc: "кімді? нені?", gen: "кімнің? ненің?", ins: "кіммен? немен?", p1: "менің …" };
const LV_FORMS = [["pl", "loc", "dat"], ["pl", "loc", "dat", "abl", "acc", "p1"], FORMS];
const CLS_KEY = { V: "c_V", R: "c_S", L: "c_S", N: "c_S", Z: "c_Z", T: "c_T" };

function ruleLine(r, nt) {
  const parts = [];
  if (r.form !== "ins" && !(r.form === "p1" && r.cls === "V")) parts.push(`${nt[r.harmony]} «${r.vowel}»`);
  parts.push(`${nt[CLS_KEY[r.cls]]} «${r.last}»`);
  return parts.join(" · ");
}

export function Jalgau({ game }) {
  const { explain } = useApp();
  const nt = useNt();
  const [level, setLevel] = useState(1);
  const [form, setForm] = useState("all");
  const recent = useRef([]);
  const [time, setTime] = useState(0);
  const LIMIT = 12;

  const makeQ = () => {
    const forms = form === "all" ? LV_FORMS[level - 1] : [form];
    const f = forms[Math.floor(Math.random() * forms.length)];
    const pool = nouns().filter((w) => allowed(w.kk, f) && !recent.current.includes(w.kk));
    const word = pool[Math.floor(Math.random() * pool.length)];
    recent.current = [...recent.current, word.kk].slice(-30);
    const r = attach(word.kk, f);
    const opts = optionsFor(f, r.suffix, level === 1 ? 3 : 4);
    return { word, form: f, r, answer: r.suffix, options: opts.map((s) => ({ key: s, label: <span lang="kk" dir="ltr" className="jg-opt">-{s}</span> })) };
  };
  const G = useRound(game.id, makeQ);
  const { q, picked } = G;
  const ok = picked === q?.answer;

  const pick = (k) => {
    if (G.picked) return;
    G.setPicked(k);
    const good = k === q.answer;
    G.mark(good);
    if (good) G.auto(1900);
  };
  // Қиын деңгей: әр сұраққа 12 секунд
  useEffect(() => {
    if (G.phase !== "run" || level !== 3 || !q || picked) return;
    setTime(LIMIT);
    const id = setInterval(() => setTime((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [q, G.phase, level, picked]);
  useEffect(() => {
    if (G.phase === "run" && level === 3 && q && !picked && time <= 0) {
      G.setPicked("__time");
      G.mark(false);
    }
  }, [time]);
  useKeys({ active: G.phase === "run" && Boolean(q), options: q?.options, picked, onPick: pick, onNext: G.next });

  const start = () => {
    setTime(LIMIT);
    G.start(level);
  };
  const r = q?.r;
  return (
    <Frame game={game} result={G.result} onRestart={start}>
      {G.phase === "ready" ? (
        <Ready
          game={game}
          onStart={start}
          level={level}
          setLevel={setLevel}
          extra={
            <>
              <h3>{nt.formHead}</h3>
              <div className="topic-row ng-forms">
                <button className={`chip g-tchip ${form === "all" ? "on" : ""}`} onClick={() => setForm("all")} aria-pressed={form === "all"}>
                  {nt.mixed}
                </button>
                {FORMS.map((f) => (
                  <button key={f} className={`chip g-tchip ${form === f ? "on" : ""}`} onClick={() => setForm(f)} aria-pressed={form === f}>
                    {nt[`f_${f}`]}
                  </button>
                ))}
              </div>
            </>
          }
        />
      ) : (
        q && (
          <section className={`card g-q ng jg ${picked ? (ok ? "ok" : "bad") : ""}`}>
            <TopBar marks={G.marks} streak={G.streak} nt={nt}>
              {level === 3 && !picked && (
                <span className={`chip g-tchip-time ${time <= 4 ? "low" : ""}`}>
                  <Clock /> {Math.max(0, time)}
                </span>
              )}
              {picked === "__time" && <span className="g-timeup">{nt.timeUp}</span>}
            </TopBar>
            <div className="jg-cloth" key={q.word.kk + q.form}>
              <span className="jg-form">
                <b>{nt[`f_${q.form}`]}</b>
                <i lang="kk" dir="ltr">{ASK[q.form]}</i>
              </span>
              <p className="jg-word" lang="kk" dir="ltr">
                <span className="jg-stem">
                  {picked && r.voiced ? (
                    <>
                      {r.stem.slice(0, -1)}
                      <em>{r.stem.slice(-1)}</em>
                    </>
                  ) : (
                    q.word.kk
                  )}
                </span>
                <span className={`jg-suf ${picked ? "on" : ""}`}>
                  {picked ? r.suffix : "?"}
                  <i className="jg-thread" aria-hidden="true" />
                  {picked && ok && <Burst n={10} className="small" />}
                </span>
                <svg viewBox="0 0 40 40" className="jg-needle" aria-hidden="true" focusable="false">
                  <path d="M6 34L34 6" stroke="#5f6470" strokeWidth="4" strokeLinecap="round" />
                  <path d="M27 13L31 9" stroke="#fffdf7" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </p>
              <p className="jg-tr">
                <span lang="kk" dir="ltr">{q.word.kk}</span> — <bdi>{tr(q.word, explain)}</bdi>
              </p>
              {!picked && <p className="jg-ask">{nt.pick}</p>}
            </div>
            {level === 3 && !picked && <TimeBar frac={time / LIMIT} label={nt.time} />}
            <Options q={q} picked={picked} onPick={pick} />
            {picked && (
              <Feedback ok={ok} onNext={G.next} nt={nt}>
                <span className="ng-fb-word">
                  <b lang="kk" dir="ltr">{r.result}</b>
                  <SayBtn text={r.result} label={nt.listen} />
                </span>
                <span className="ng-fb-rule">
                  {ruleLine(r, nt)}
                  {r.voiced && (
                    <>
                      {" · "}
                      <span lang="kk" dir="ltr">{r.voiced[0]} → {r.voiced[1]}</span>
                    </>
                  )}{" "}
                  → <b lang="kk" dir="ltr">-{r.suffix}</b>
                </span>
              </Feedback>
            )}
          </section>
        )
      )}
    </Frame>
  );
}

/* ═════════════════════════ 2. КЕРУЕН ═════════════════════════ */
const PUNCT = /[.,!?…—–«»"“”:;()]/g;
const PROPER = new Set(["Айдос", "Қазақстан", "Наурыз", "Алтын", "Жібек"]);
const LEN = [[3, 3], [4, 5], [6, 7]];
let sentPool = null;
function sentences() {
  if (!sentPool) {
    sentPool = [];
    for (const list of Object.values({ ...PHRASES, ...PHRASES_D })) {
      for (const [kk, ru, en] of list) {
        const tokens = kk.replace(PUNCT, " ").split(/\s+/).filter(Boolean);
        if (tokens.length < 3 || tokens.length > 7) continue;
        if (!PROPER.has(tokens[0])) tokens[0] = tokens[0].toLowerCase(); // бас әріп бірінші сөзді «сатпасын»
        sentPool.push({ kk, ru, en, tokens });
      }
    }
  }
  return sentPool;
}
const same = (a, b) => a.length === b.length && a.every((x, i) => x.toLowerCase() === b[i].toLowerCase());

function Yurt() {
  return (
    <svg viewBox="0 0 60 44" className="kr-yurt" aria-hidden="true" focusable="false">
      <path d="M6 42V24C6 12 20 4 30 4C40 4 54 12 54 24V42Z" fill="#fffdf7" />
      <path d="M6 24C6 12 20 4 30 4C40 4 54 12 54 24Z" fill="#f4ecda" />
      <path d="M6 24H54" stroke="#b8322a" strokeWidth="3.4" />
      <path d="M8 29H52" stroke="#e0a526" strokeWidth="1.6" strokeDasharray="3 2.5" />
      <rect x="24" y="24" width="12" height="18" rx="2" fill="#8a2018" />
      <circle cx="30" cy="5" r="3.4" fill="#7a4a22" />
    </svg>
  );
}

export function Keruen({ game }) {
  const { explain } = useApp();
  const nt = useNt();
  const [level, setLevel] = useState(1);
  const recent = useRef([]);
  const [placed, setPlaced] = useState([]); // тақтайша id-лері, орналасу ретімен
  const [checked, setChecked] = useState(null); // null | "ok" | "bad"
  const [hints, setHints] = useState(0);
  const [walk, setWalk] = useState(false);
  const walkT = useRef(0);

  const makeQ = () => {
    const [lo, hi] = LEN[level - 1];
    const pool = sentences().filter((s) => s.tokens.length >= lo && s.tokens.length <= hi);
    const fresh = pool.filter((s) => !recent.current.includes(s.kk));
    const s = (fresh.length ? fresh : pool)[Math.floor(Math.random() * (fresh.length ? fresh.length : pool.length))];
    recent.current = [...recent.current, s.kk].slice(-Math.min(18, pool.length - 1));
    let tiles;
    for (let k = 0; k < 8; k++) {
      tiles = shuffle(s.tokens.map((w, i) => ({ id: i, w })));
      if (!same(tiles.map((x) => x.w), s.tokens)) break;
    }
    return { ...s, tiles };
  };
  const G = useRound(game.id, makeQ);
  const { q } = G;
  useEffect(() => {
    setPlaced([]);
    setChecked(null);
  }, [q]);
  useEffect(() => () => clearTimeout(walkT.current), []);

  const word = (id) => q.tiles.find((x) => x.id === id).w;
  const place = (id) => !checked && !placed.includes(id) && setPlaced((p) => [...p, id]);
  const remove = (id) => !checked && setPlaced((p) => p.filter((x) => x !== id));
  const full = q && placed.length === q.tokens.length;
  const check = () => {
    if (!full || checked) return;
    const good = same(placed.map(word), q.tokens);
    setChecked(good ? "ok" : "bad");
    G.setPicked(good ? "ok" : "bad");
    G.mark(good);
    if (good) {
      sayKk(q.kk);
      setWalk(true);
      clearTimeout(walkT.current);
      walkT.current = setTimeout(() => setWalk(false), 1500);
      G.auto(2600);
    }
  };
  const hint = () => {
    if (checked || hints <= 0) return;
    let i = 0;
    while (i < placed.length && word(placed[i]).toLowerCase() === q.tokens[i].toLowerCase()) i++;
    const keep = placed.slice(0, i);
    const nextTile = q.tiles.find((x) => !keep.includes(x.id) && x.w.toLowerCase() === q.tokens[i]?.toLowerCase());
    if (!nextTile) return;
    setPlaced([...keep, nextTile.id]);
    setHints((h) => h - 1);
  };
  const start = () => {
    setHints([3, 2, 0][level - 1]);
    setWalk(false);
    G.start(level);
  };
  const bank = q ? q.tiles.filter((x) => !placed.includes(x.id)) : [];
  useKeys({
    active: G.phase === "run" && Boolean(q),
    options: bank.map((x) => ({ key: x.id })),
    picked: checked,
    onPick: place,
    onNext: G.next,
    extra: (e) => {
      if (checked) return false;
      if (e.key === "Backspace" && placed.length) {
        e.preventDefault();
        setPlaced((p) => p.slice(0, -1));
        return true;
      }
      if (e.key === "Enter" && full && !e.target?.closest?.("button, a")) {
        e.preventDefault();
        check();
        return true;
      }
      return false;
    },
  });
  const done = G.marks.filter(Boolean).length;
  const [lo, hi] = LEN[level - 1];
  return (
    <Frame game={game} result={G.result} onRestart={start}>
      {G.phase === "ready" ? (
        <Ready game={game} onStart={start} level={level} setLevel={setLevel} extra={<p className="ng-note">{nt.len.replace("{n}", lo === hi ? lo : `${lo}–${hi}`)}</p>} />
      ) : (
        q && (
          <>
            <section className={`card kr-steppe ${walk ? "walk" : ""}`} dir="ltr" aria-hidden="true">
              <span className="kr-sun" />
              <span className="kr-dune" />
              <Yurt />
              <span className="kr-track" style={{ "--p": done / ROUND }}>
                <span className="kr-van">
                  <Camel coat="#B98548" load="#0F5E7A" />
                  <Camel coat="#C9965A" load="#2F6B4F" />
                  <Camel coat="#D3A468" load="#B8322A" />
                </span>
              </span>
            </section>
            <section className={`card g-q ng kr ${checked || ""}`}>
              <TopBar marks={G.marks} streak={G.streak} nt={nt} />
              <div className="kr-ask">
                <span className="kr-ask-cap">{nt.build}</span>
                <h3 className="kr-prompt" key={q.kk} dir="auto">{tr(q, explain)}</h3>
              </div>
              <div className={`kr-line ${checked || ""}`} lang="kk" dir="ltr" role="group" aria-label={nt.yours}>
                {placed.length === 0 && <span className="kr-empty" lang="">{nt.empty}</span>}
                {placed.map((id, i) => {
                  const st = checked ? (word(id).toLowerCase() === q.tokens[i].toLowerCase() ? "ok" : "bad") : "";
                  return (
                    <button key={id} type="button" className={`kr-tile in ${st}`} style={{ "--i": i }} onClick={() => remove(id)} disabled={Boolean(checked)}>
                      {word(id)}
                    </button>
                  );
                })}
                {checked === "ok" && <Burst n={12} />}
              </div>
              <div className="kr-bank" lang="kk" dir="ltr" role="group" aria-label={nt.words}>
                {q.tiles.map((x) => {
                  const used = placed.includes(x.id);
                  const n = used ? 0 : bank.indexOf(x) + 1;
                  return (
                    <button key={x.id} type="button" className={`kr-tile ${used ? "used" : ""}`} onClick={() => place(x.id)} disabled={used || Boolean(checked)} aria-hidden={used || undefined} tabIndex={used ? -1 : 0}>
                      {!used && !checked && <kbd className="kr-k" aria-hidden="true">{n}</kbd>}
                      {x.w}
                    </button>
                  );
                })}
              </div>
              {!checked ? (
                <div className="kr-actions">
                  {[3, 2, 0][level - 1] > 0 && (
                    <button type="button" className="btn ghost small" onClick={hint} disabled={hints <= 0 || full}>
                      <Icon name="sparkle" size={16} /> {nt.hint} · {hints}
                    </button>
                  )}
                  <button type="button" className="btn ghost small" onClick={() => setPlaced([])} disabled={!placed.length}>
                    <Icon name="refresh" size={16} /> {nt.clear}
                  </button>
                  <button type="button" className="btn blue kr-check" onClick={check} disabled={!full}>
                    <Icon name="check" size={18} /> {nt.check}
                  </button>
                </div>
              ) : (
                <Feedback ok={checked === "ok"} onNext={G.next} nt={nt}>
                  <span className="ng-fb-word">
                    {checked === "bad" && <small>{nt.answer}:</small>}
                    <b lang="kk" dir="ltr">{q.kk}</b>
                    <SayBtn text={q.kk} label={nt.listen} />
                  </span>
                  {checked === "bad" && <span className="ng-fb-rule">{nt.tip}</span>}
                </Feedback>
              )}
            </section>
          </>
        )
      )}
    </Frame>
  );
}

/* ═════════════════════════ 3. ТЫҢДА ═════════════════════════ */
// Шатастырылатын дыбыстар: ә/а, ө/о, ү/ұ/у, і/ы, қ/к, ғ/г, ң/н, һ/х
const CONF = { ә: "а", ө: "о", ү: "у", ұ: "у", і: "ы", қ: "к", ғ: "г", ң: "н", һ: "х" };
const HAS_CONF = /[әаөоүұуіықкғгңнһх]/;
const norm = (s) => [...s].map((c) => CONF[c] || c).join("");
function lev(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
let earPool = null;
function earWords() {
  if (!earPool) {
    const seen = new Set();
    earPool = [];
    for (const w of WORDS) {
      if (!/^[а-яёәғқңөұүһі]+$/i.test(w.kk)) continue; // бір сөз, тыныс белгісіз
      if (w.kk !== w.kk.toLowerCase() && w.t !== "greet") continue; // жалқы есімдер
      const kk = w.kk.toLowerCase();
      if (kk.length < 2 || seen.has(kk)) continue;
      seen.add(kk);
      earPool.push({ ...w, kk, src: w, n: norm(kk) });
    }
  }
  return earPool;
}
export function closeness(a, b) {
  if (a.n === b.n) return 100; // нағыз минимал жұп: тек шатастырылатын дыбыспен ажыратылады
  let s = -3 * lev(a.n, b.n);
  if (a.kk.length === b.kk.length) s += 2;
  if (a.n[0] === b.n[0]) s += 2;
  if (a.n.at(-1) === b.n.at(-1)) s += 1;
  if (HAS_CONF.test(b.kk)) s += 1;
  if (a.t === b.t) s += 0.5;
  return s;
}
function distractors(target, level, lang) {
  const all = earWords().filter((w) => w.kk !== target.kk && tr(w.src, lang) !== tr(target.src, lang));
  const ranked = all.map((w) => ({ w, s: closeness(target, w) })).sort((x, y) => y.s - x.s).map((x) => x.w);
  if (level === 3) return ranked.slice(0, 3);
  if (level === 2) return shuffle(ranked.slice(0, 6)).slice(0, 3);
  // жеңіл: бір ұқсас сөз + сол тақырыптан бір сөз
  const near = shuffle(ranked.slice(0, 4))[0];
  const topic = shuffle(all.filter((w) => w.t === target.t && w.kk !== near.kk))[0] || ranked[5];
  return [near, topic];
}
// Жауаптан өзгеше әріптерді белгілеу (ең ұзын ортақ тізбек арқылы)
function diffMarks(word, ref) {
  const a = [...word], b = [...ref];
  const m = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) m[i][j] = a[i] === b[j] ? m[i + 1][j + 1] + 1 : Math.max(m[i + 1][j], m[i][j + 1]);
  const out = [];
  let i = 0, j = 0;
  while (i < a.length) {
    if (j < b.length && a[i] === b[j]) out.push([a[i++], false]), j++;
    else if (j < b.length && m[i][j + 1] > m[i + 1][j]) j++;
    else out.push([a[i++], true]);
  }
  return out;
}
function Diff({ word, to }) {
  return (
    <span lang="kk" dir="ltr" className="ty-w">
      {diffMarks(word, to).map(([c, d], i) => (d ? <mark key={i}>{c}</mark> : <span key={i}>{c}</span>))}
    </span>
  );
}

// Дыбыс күйі: idle | loading | playing | error. Жүктеу 9 секундтан асса — қате деп есептейміз.
function useSay() {
  const [st, setSt] = useState("idle");
  const tok = useRef(0);
  const tm = useRef(0);
  const say = useCallback((text, slow = false) => {
    const my = ++tok.current;
    clearTimeout(tm.current);
    setSt("loading");
    tm.current = setTimeout(() => {
      if (tok.current !== my) return;
      tok.current++;
      try {
        stopKk();
      } catch {}
      setSt("error");
    }, 9000);
    const on = (s) => {
      if (tok.current !== my) return;
      if (s !== "loading") clearTimeout(tm.current);
      setSt(s);
    };
    try {
      Promise.resolve(sayKk(text, { slow, onState: on })).catch(() => on("error"));
    } catch {
      on("error");
    }
  }, []);
  useEffect(
    () => () => {
      tok.current++;
      clearTimeout(tm.current);
      try {
        stopKk();
      } catch {}
    },
    []
  );
  return [st, say];
}

export function Tynda({ game }) {
  const { explain } = useApp();
  const nt = useNt();
  const [topic, setTopic] = useState("all");
  const [level, setLevel] = useState(1);
  const [audio, say] = useSay();
  const [mute, setMute] = useState(false); // дыбыс шықпаса — аударма бойынша ойнаймыз
  const recent = useRef([]);

  const makeQ = () => {
    const ear = earWords();
    let pool = topic === "all" ? ear : ear.filter((w) => w.t === topic);
    if (pool.length < 6) pool = ear;
    const fresh = pool.filter((w) => !recent.current.includes(w.kk));
    const target = (fresh.length ? fresh : pool)[Math.floor(Math.random() * (fresh.length ? fresh.length : pool.length))];
    recent.current = [...recent.current, target.kk].slice(-Math.min(20, pool.length - 1));
    const opts = shuffle([target, ...distractors(target, level, explain)]);
    return { word: target, answer: target.kk, opts };
  };
  const G = useRound(game.id, makeQ);
  const { q, picked } = G;
  const ok = picked === q?.answer;

  // Әр жаңа сұрақта сөз өзі айтылады (дыбыс істеп тұрса)
  useEffect(() => {
    if (G.phase === "run" && q && !mute) say(q.answer);
  }, [q, G.phase]);
  useEffect(() => {
    if (audio === "error") setMute(true);
    if (audio === "playing") setMute(false);
  }, [audio]);

  const pick = (k) => {
    if (G.picked) return;
    G.setPicked(k);
    const good = k === q.answer;
    G.mark(good);
    if (good) G.auto(1700);
  };
  const replay = (slow = false) => q && say(q.answer, slow);
  const options = useMemo(
    () =>
      q
        ? q.opts.map((w) => ({
            key: w.kk,
            label: picked && w.kk !== q.answer ? <Diff word={w.kk} to={q.answer} /> : <span lang="kk" dir="ltr" className="ty-w">{w.kk}</span>,
          }))
        : [],
    [q, picked]
  );
  useKeys({
    active: G.phase === "run" && Boolean(q),
    options,
    picked,
    onPick: pick,
    onNext: G.next,
    extra: (e) => {
      const k = e.key.toLowerCase();
      if (k === "r" || k === " ") {
        if (e.target?.closest?.("button, a")) return false;
        e.preventDefault();
        replay(false);
        return true;
      }
      if (k === "s" && level !== 3) {
        replay(true);
        return true;
      }
      return false;
    },
  });
  const start = () => {
    setMute(false);
    G.start(level);
  };
  return (
    <Frame game={game} result={G.result} onRestart={start}>
      {G.phase === "ready" ? (
        <Ready game={game} topic={topic} setTopic={setTopic} onStart={start} level={level} setLevel={setLevel} />
      ) : (
        q && (
          <section className={`card g-q ng ty ${picked ? (ok ? "ok" : "bad") : ""}`}>
            <TopBar marks={G.marks} streak={G.streak} nt={nt} />
            <div className={`ty-stage ${audio}`}>
              <svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMax slice" className="ty-mt" aria-hidden="true" focusable="false">
                <path d="M0 120L70 44L112 86L170 22L236 120Z" fill="#8F86C7" />
                <path d="M170 22L152 48L165 43L173 53L184 42L192 50Z" fill="#fffdf7" />
                <path d="M190 120L290 34L400 120Z" fill="#6E63B0" />
                <path d="M290 34L273 52L286 48L294 58L306 50Z" fill="#fffdf7" />
              </svg>
              <Dombyra className="ty-dmb" />
              <button type="button" className="ty-play" onClick={() => replay(false)} aria-label={nt.replay} aria-busy={audio === "loading"}>
                <i className="ty-ring" aria-hidden="true" />
                <i className="ty-ring r2" aria-hidden="true" />
                <Icon name="volume" size={34} />
              </button>
              <div className="ty-ctl">
                <button type="button" className="btn ghost small" onClick={() => replay(false)}>
                  <Icon name="refresh" size={16} /> {nt.replay}
                </button>
                {level !== 3 && (
                  <button type="button" className="btn ghost small" onClick={() => replay(true)}>
                    <Clock /> {nt.slow}
                  </button>
                )}
              </div>
            </div>
            {mute ? (
              <div className="ty-err" role="status">
                <b>{nt.noAudio}</b>
                <span>{nt.readMode}</span>
                <span className="ty-err-btns">
                  <button type="button" className="btn ghost small" onClick={() => replay(false)} disabled={audio === "loading"}>
                    <Icon name="refresh" size={15} /> {audio === "loading" ? nt.loading : nt.retry}
                  </button>
                  {!picked && (
                    <button type="button" className="btn ghost small ty-skip" onClick={G.swap}>
                      {nt.skip} <Icon name="right" size={15} />
                    </button>
                  )}
                </span>
              </div>
            ) : null}
            <h3 className="ty-ask" key={q.answer + mute} dir="auto">
              {mute ? tr(q.word.src, explain) : audio === "loading" ? nt.loading : nt.which}
            </h3>
            <Options q={{ options, answer: q.answer }} picked={picked} onPick={pick} />
            {picked && (
              <Feedback ok={ok} onNext={G.next} nt={nt}>
                <span className="ng-fb-word">
                  <b lang="kk" dir="ltr">{q.answer}</b>
                  <SayBtn text={q.answer} label={nt.listen} />
                  <bdi className="ty-tr">— {tr(q.word.src, explain)}</bdi>
                </span>
                {!ok && picked !== "__time" && (
                  <span className="ng-fb-rule">
                    <Diff word={picked} to={q.answer} /> ≠ <Diff word={q.answer} to={picked} />
                  </span>
                )}
              </Feedback>
            )}
          </section>
        )
      )}
    </Frame>
  );
}
