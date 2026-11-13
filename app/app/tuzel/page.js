"use client";
import "../../tuzel.css";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "../../components/Store";
import Writing from "../writing/page";
import Speaking from "../speaking/page";
import { tx } from "../../../lib/tx";
import SectionIntro from "../../components/SectionIntro";
import { TuzelArt } from "../../components/TuzelKit";

const INTRO = {
  kk: { title: "Түзел — жазуың мен айтылымыңды жетілдір", text: "Қазақша жазып не дауыстап айтып көр — Aqyl қатеңді тауып, дұрыс нұсқасын көрсетеді және неге солай екенін түсіндіреді.", points: ["Жазу: мәтініңді тексеріп, түзетілген нұсқасын береді", "Айтылым: дауысыңды тыңдап, дыбыстарды бағалайды", "Әр түзетуге қысқа түсіндірме"] },
  ru: { title: "Tuzel — улучшайте письмо и произношение", text: "Напишите текст по-казахски или произнесите фразу вслух — Aqyl найдёт ошибки, покажет правильный вариант и объяснит почему.", points: ["Письмо: проверка текста и исправленный вариант", "Произношение: Aqyl слушает голос и оценивает звуки", "Короткое объяснение к каждой правке"] },
  en: { title: "Tuzel — polish your writing and pronunciation", text: "Write something in Kazakh or say a phrase out loud — Aqyl finds your mistakes, shows the correct version and explains why.", points: ["Writing: checks your text and returns a corrected version", "Speaking: listens to your voice and scores the sounds", "A short explanation for every fix"] },
  zh: { title: "Tuzel — 提升你的写作和发音", text: "用哈萨克语写一段话或大声说一句 — Aqyl 会找出错误，给出正确版本并解释原因。", points: ["写作：检查文本并给出修改后的版本", "发音：听你的声音并给发音打分", "每处修改都有简短说明"] },
  es: { title: "Tuzel — mejora tu escritura y pronunciación", text: "Escribe algo en kazajo o di una frase en voz alta: Aqyl encuentra tus errores, muestra la versión correcta y explica por qué.", points: ["Escritura: revisa tu texto y devuelve una versión corregida", "Pronunciación: escucha tu voz y evalúa los sonidos", "Una breve explicación para cada corrección"] },
  de: { title: "Tuzel — verbessere Schreiben und Aussprache", text: "Schreib etwas auf Kasachisch oder sprich einen Satz laut aus — Aqyl findet deine Fehler, zeigt die richtige Version und erklärt, warum.", points: ["Schreiben: prüft deinen Text und gibt eine korrigierte Fassung", "Aussprache: hört deine Stimme und bewertet die Laute", "Zu jeder Korrektur eine kurze Erklärung"] },
  fr: { title: "Tuzel — améliore ton écriture et ta prononciation", text: "Écris quelque chose en kazakh ou dis une phrase à voix haute : Aqyl trouve tes erreurs, montre la bonne version et explique pourquoi.", points: ["Écriture : vérifie ton texte et propose une version corrigée", "Prononciation : écoute ta voix et évalue les sons", "Une courte explication pour chaque correction"] },
  tr: { title: "Tuzel — yazını ve telaffuzunu geliştir", text: "Kazakça bir şey yaz ya da bir cümleyi yüksek sesle söyle; Aqyl hatalarını bulur, doğrusunu gösterir ve nedenini açıklar.", points: ["Yazma: metnini kontrol eder ve düzeltilmiş hâlini verir", "Telaffuz: sesini dinler ve sesleri puanlar", "Her düzeltme için kısa bir açıklama"] },
  ar: { title: "Tuzel — حسِّن كتابتك ونطقك", text: "اكتب شيئًا بالكازاخية أو انطق جملة بصوت عالٍ، وسيجد Aqyl أخطاءك ويعرض الصيغة الصحيحة ويشرح السبب.", points: ["الكتابة: يراجع نصك ويقدّم نسخة مصحّحة", "النطق: يستمع إلى صوتك ويقيّم الأصوات", "شرح قصير لكل تصحيح"] },
  ko: { title: "Tuzel — 글쓰기와 발음을 다듬어요", text: "카자흐어로 글을 쓰거나 문장을 소리 내어 말해 보세요. Aqyl이 실수를 찾아 올바른 표현을 보여 주고 이유를 설명해요.", points: ["글쓰기: 글을 확인하고 고친 문장을 보여 줘요", "발음: 목소리를 듣고 소리를 평가해요", "고친 부분마다 짧은 설명"] },
  ja: { title: "Tuzel — 書く力と発音をみがこう", text: "カザフ語で文を書いたり、声に出して言ってみよう。Aqyl が間違いを見つけて、正しい言い方とその理由を教えてくれます。", points: ["作文：文章をチェックして直した文を表示", "発音：声を聞いて音を採点", "直すたびに短い解説つき"] },
};

const TABS = [
  ["write", "dapter", "tzWrite"],
  ["speak", "mic", "tzSpeak"],
];

// Tuzel: жазу көмекшісі + айтылым бір бөлімде
function Tuzel() {
  const { lang } = useApp();
  const x = tx(lang);
  const q = useSearchParams();
  const [tab, setTab] = useState(q.get("tab") === "speak" ? "speak" : "write");
  // Көрсеткі пернелер қойындылар арасында ауыстырады
  function onKey(e) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const next = tab === "write" ? "speak" : "write";
    const id = e.key === "Home" ? "write" : e.key === "End" ? "speak" : next;
    setTab(id);
    document.getElementById(`tz-tab-${id}`)?.focus();
  }
  return (
    <div className="tuzel">
      <SectionIntro icon="pen" {...(INTRO[lang] || INTRO.en)} />
      <div className="tz-tabs" role="tablist" aria-label="Tuzel" onKeyDown={onKey}>
        {TABS.map(([id, art, label]) => (
          <button
            key={id}
            id={`tz-tab-${id}`}
            type="button"
            role="tab"
            aria-selected={tab === id}
            aria-controls="tz-panel"
            tabIndex={tab === id ? 0 : -1}
            className={`tz-tab ${tab === id ? "on" : ""}`}
            onClick={() => setTab(id)}
          >
            <TuzelArt name={art} size={52} />
            <span className="tz-tab-l">{x[label]}</span>
          </button>
        ))}
      </div>
      <div id="tz-panel" role="tabpanel" aria-labelledby={`tz-tab-${tab}`} className="tz-panel">
        {tab === "write" ? <Writing /> : <Speaking />}
      </div>
    </div>
  );
}
export default function Page() {
  return (
    <Suspense fallback={null}>
      <Tuzel />
    </Suspense>
  );
}
