"use client";
import "../../vr.css";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "../../components/Store";
import Icon from "../../components/Icon";
import ShellGlyph from "../../components/ShellGlyph";
import VrPlay, { Stars, trLang } from "../../components/VrPlay";
import VrTalk from "../../components/VrTalk";
import { VrScene, VrBuilding, VrTownBg } from "../../components/VrArt";
import { vrL, vf } from "../../components/VrL10n";
import { L } from "../../../lib/i18n";
import { PLACES, SCENES } from "../../../lib/vr/scenes";

const LEVELS = ["A1", "A2", "B1", "B2"];
// Картадағы орындар: [x%, y%] — үлкен экран және телефон (төменгі ортасы)
const POS = {
  guest: [[10, 32], [13, 25]], school: [[32, 29], [38, 25]], office: [[55, 30], [63, 25]], airport: [[80, 30], [88, 25]],
  clinic: [[20, 54], [13, 49]], phone: [[43, 52], [38, 49]], bank: [[66, 54], [63, 49]], hotel: [[89, 53], [88, 49]],
  pharmacy: [[9, 76], [13, 73]], post: [[31, 75], [38, 73]], cafe: [[54, 77], [63, 73]], station: [[78, 75], [88, 73]],
  shop: [[20, 97], [13, 97]], bazaar: [[43, 97], [38, 97]], bus: [[66, 97], [63, 97]], taxi: [[88, 97], [88, 97]],
};

export default function Vr() {
  const { lang, explain, state } = useApp();
  const T = vrL(lang);
  const tl = trLang(explain);
  const done = state.vr?.done || {};
  const [view, setView] = useState({ kind: "hub" });
  const [lv, setLv] = useState("all");
  const [place, setPlace] = useState(null);

  // ?s=<жағдаят> немесе ?p=<орын> сілтемесі
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const s = q.get("s");
      const p = q.get("p");
      if (s && SCENES.some((x) => x.id === s)) setView({ kind: "scene", id: s });
      else if (p && PLACES[p]) setPlace(p);
    } catch {}
  }, []);
  useEffect(() => {
    try { window.scrollTo({ top: 0 }); } catch {}
  }, [view.kind, view.id]);

  const list = useMemo(() => SCENES.filter((s) => (lv === "all" || s.level === lv) && (!place || s.place === place)), [lv, place]);
  const byPlace = useMemo(() => {
    const m = {};
    for (const s of SCENES) (m[s.place] ||= []).push(s);
    return m;
  }, []);
  const defLevel = lv !== "all" ? lv : LEVELS.includes(state.cefr) ? state.cefr : "A1";

  if (view.kind === "scene") {
    const sc = SCENES.find((s) => s.id === view.id);
    if (sc) {
      // Келесі: осы деңгейдегі өтілмеген, болмаса тізімдегі келесі жағдаят
      const i = SCENES.indexOf(sc);
      const rest = [...SCENES.slice(i + 1), ...SCENES.slice(0, i)];
      const nx = rest.find((s) => s.level === sc.level && !done[s.id]) || rest.find((s) => !done[s.id]) || rest[0];
      return (
        <div className="vr" data-view="scene">
          <VrPlay
            key={sc.id}
            scene={sc}
            place={PLACES[sc.place]}
            hasNext={!!nx}
            onNext={() => nx && setView({ kind: "scene", id: nx.id })}
            onBack={() => setView({ kind: "hub" })}
            onTalk={() => setView({ kind: "talk", scene: sc.id })}
          />
        </div>
      );
    }
  }
  if (view.kind === "talk") {
    const sc = SCENES.find((s) => s.id === view.scene) || null;
    return (
      <div className="vr" data-view="talk">
        <VrTalk places={PLACES} scenes={SCENES} scene={sc} place={view.place} level={view.level} onClose={() => setView(sc ? { kind: "scene", id: sc.id } : { kind: "hub" })} />
      </div>
    );
  }

  const doneAll = SCENES.filter((s) => done[s.id]).length;
  return (
    <div className="vr" data-view="hub">
      <header className="vr-head">
        <div className="vr-head-t">
          <small className="vr-kicker">{T.kicker}</small>
          <h1>VR Әлем</h1>
          <p>{T.sub}</p>
          <span className="vr-chip">{vf(T.doneN, doneAll, SCENES.length)}</span>
        </div>
        <button type="button" className="vr-talk-cta big" onClick={() => setView({ kind: "talk", place: place || "shop", level: defLevel })}>
          <span className="vr-talk-ic"><ShellGlyph name="feather" size={24} /></span>
          <span><b lang="kk">{T.free}</b><small>{T.freeSub}</small></span>
          <Icon name="right" size={18} className="vr-flip" />
        </button>
      </header>

      <section className="vr-map card" aria-labelledby="vr-map-h">
        <div className="vr-map-h">
          <h2 id="vr-map-h">{T.mapTitle}</h2>
          <small>{T.mapHint}</small>
        </div>
        <div className="vr-board">
          <VrTownBg />
          {Object.entries(PLACES).map(([k, p]) => {
            const [d, m] = POS[k] || [[50, 50], [50, 50]];
            const all = byPlace[k] || [];
            const got = all.filter((s) => done[s.id]).length;
            const on = place === k;
            return (
              <button
                key={k}
                type="button"
                className={`vr-pin ${on ? "on" : ""} ${all.length && got === all.length ? "full" : ""}`}
                style={{ "--x": `${d[0]}%`, "--y": `${d[1]}%`, "--mx": `${m[0]}%`, "--my": `${m[1]}%` }}
                aria-pressed={on}
                aria-label={`${L(p.name, "kk")} — ${L(p.name, tl)}. ${vf(T.count, all.length)}, ${vf(T.doneN, got, all.length)}`}
                onClick={() => {
                  setPlace(on ? null : k);
                  if (!on) requestAnimationFrame(() => document.getElementById("vr-list")?.scrollIntoView({ behavior: "smooth", block: "start" }));
                }}
              >
                <VrBuilding kind={p.art || k} />
                <span className="vr-pin-n" lang="kk">{L(p.name, "kk")}</span>
                {got > 0 && <span className="vr-pin-c" aria-hidden="true">{got}/{all.length}</span>}
              </button>
            );
          })}
        </div>
      </section>

      <section className="vr-list" id="vr-list" aria-label={T.levelLbl}>
        <div className="vr-filters">
          <div className="vr-seg" role="group" aria-label={T.levelLbl}>
            {["all", ...LEVELS].map((l) => (
              <button key={l} type="button" className={lv === l ? "on" : ""} aria-pressed={lv === l} onClick={() => setLv(l)}>
                {l === "all" ? T.all : l}
              </button>
            ))}
          </div>
          {place && (
            <button type="button" className="vr-chip vr-place-chip" onClick={() => setPlace(null)}>
              <span lang="kk">{L(PLACES[place].name, "kk")}</span>
              <Icon name="x" size={14} />
              <span className="sr-only">{T.allPlaces}</span>
            </button>
          )}
          <small className="vr-count">{vf(T.count, list.length)}</small>
        </div>

        {list.length === 0 ? (
          <p className="vr-empty">{T.empty}</p>
        ) : (
          <ul className="vr-grid">
            {list.map((s, i) => {
              const d = done[s.id];
              const p = PLACES[s.place] || {};
              return (
                <li key={s.id} style={{ "--d": `${Math.min(i, 8) * 40}ms` }}>
                  <button type="button" className={`vr-card ${d ? "done" : ""}`} onClick={() => setView({ kind: "scene", id: s.id })}>
                    <span className="vr-card-art">
                      <VrScene art={p.art || s.place} npc={s.npc} />
                      <span className={`vr-lv lv-${s.level}`}>{s.level}</span>
                      {d && <span className="vr-card-done"><Stars n={d.stars || 1} size={15} label={`${T.doneMark}: ${vf(T.stars, d.stars || 1)}`} /></span>}
                    </span>
                    <span className="vr-card-b">
                      <small lang="kk">{L(p.name, "kk")}</small>
                      <b lang="kk">{L(s.title, "kk")}</b>
                      <span className="vr-card-tr">{L(s.title, tl)}</span>
                      <span className="vr-card-npc">
                        <ShellGlyph name="circle" size={14} /> {s.npc.name} · {L(s.npc.role, tl)}
                      </span>
                    </span>
                    <span className="vr-card-go">{d ? T.again : T.enter} <Icon name="right" size={16} className="vr-flip" /></span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
