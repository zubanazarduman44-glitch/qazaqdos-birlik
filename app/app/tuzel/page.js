"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "../../components/Store";
import Icon from "../../components/Icon";
import Writing from "../writing/page";
import Speaking from "../speaking/page";
import { tx } from "../../../lib/tx";
import SectionIntro from "../../components/SectionIntro";

const INTRO = {
  kk: { title: "Түзел — жазуың мен айтылымыңды жетілдір", text: "Қазақша жазып не дауыстап айтып көр — Aqyl қатеңді тауып, дұрыс нұсқасын көрсетеді және неге солай екенін түсіндіреді.", points: ["Жазу: мәтініңді тексеріп, түзетілген нұсқасын береді", "Айтылым: дауысыңды тыңдап, дыбыстарды бағалайды", "Әр түзетуге қысқа түсіндірме"] },
  ru: { title: "Tuzel — улучшайте письмо и произношение", text: "Напишите текст по-казахски или произнесите фразу вслух — Aqyl найдёт ошибки, покажет правильный вариант и объяснит почему.", points: ["Письмо: проверка текста и исправленный вариант", "Произношение: Aqyl слушает голос и оценивает звуки", "Короткое объяснение к каждой правке"] },
  en: { title: "Tuzel — polish your writing and pronunciation", text: "Write something in Kazakh or say a phrase out loud — Aqyl finds your mistakes, shows the correct version and explains why.", points: ["Writing: checks your text and returns a corrected version", "Speaking: listens to your voice and scores the sounds", "A short explanation for every fix"] },
};

// Tuzel: жазу көмекшісі + айтылым бір бөлімде
function Tuzel() {
  const { lang } = useApp();
  const x = tx(lang);
  const q = useSearchParams();
  const [tab, setTab] = useState(q.get("tab") === "speak" ? "speak" : "write");
  return (
    <div className="tuzel">
      <SectionIntro icon="pen" {...(INTRO[lang] || INTRO.en)} />
      <div className="tz-tabs" role="tablist">
        <button role="tab" aria-selected={tab === "write"} className={tab === "write" ? "on" : ""} onClick={() => setTab("write")}>
          <Icon name="pen" size={18} /> {x.tzWrite}
        </button>
        <button role="tab" aria-selected={tab === "speak"} className={tab === "speak" ? "on" : ""} onClick={() => setTab("speak")}>
          <Icon name="mic" size={18} /> {x.tzSpeak}
        </button>
      </div>
      {tab === "write" ? <Writing /> : <Speaking />}
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
