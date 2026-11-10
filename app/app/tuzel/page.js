"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "../../components/Store";
import Icon from "../../components/Icon";
import Writing from "../writing/page";
import Speaking from "../speaking/page";
import { tx } from "../../../lib/tx";

// Tuzel: жазу көмекшісі + айтылым бір бөлімде
function Tuzel() {
  const { lang } = useApp();
  const x = tx(lang);
  const q = useSearchParams();
  const [tab, setTab] = useState(q.get("tab") === "speak" ? "speak" : "write");
  return (
    <div className="tuzel">
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
