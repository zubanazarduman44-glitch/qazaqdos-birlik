"use client";
// «Көш» картасы — басты беттің ортасындағы оқу жолы. Жалқау жүктеледі (next/dynamic, ssr: false):
// геометрия (lib/kzmap.js, тек оқу) бастапқы JS-ке кірмейді.
// Әр өңір — бір path; пернетақта мен экран оқу құралы үшін — жол бойындағы аялдамалар (route ретімен, Tab).
// Анимация тек Aqyl белгісінің шағын толқыны (transform/opacity), экраннан тыс кідіреді (AnimGate).
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { KZ_CENTERS, KZ_PATHS, KZ_VIEW } from "../../lib/kzmap";
import { regionName } from "./KoshRoute";
import Qyran from "./Qyran";
import Icon from "./Icon";

const OPEN = { done: 1, cur: 1, open: 1 };
const CITY = { astana: 1, "almaty-city": 1, shymkent: 1 };
const href = (r) => `/app/course?l=${r.go}`;

function Stop({ r }) {
  if (r.state === "done") return (
    <g className="km-stamp">
      <circle r="13" />
      <circle r="9.5" className="km-stamp-ring" />
      <path d="M-4.6 0.4l3.2 3.3 6-6.6" className="km-stamp-tick" />
    </g>
  );
  if (r.state === "cur") return (
    <g className="km-cur">
      <circle r="14" className="km-pulse" />
      <circle r="12" className="km-cur-dot" />
    </g>
  );
  if (r.state === "locked") return <circle r="6" className="km-lock-dot" />;
  return (
    <g className={`km-num s-${r.state}`}>
      <circle r="11" />
      <text y="4">{r.i + 1}</text>
    </g>
  );
}

export default function KoshMap({ regions, lang, L }) {
  const router = useRouter();
  const [hover, setHover] = useState(null);
  const [pin, setPin] = useState(null);
  const cur = regions.find((r) => r.state === "cur");
  const show = regions.find((r) => r.id === (hover || pin)) || cur || regions[regions.length - 1];
  const paint = useMemo(() => [...regions].sort((a, b) => (CITY[a.id] ? 1 : 0) - (CITY[b.id] ? 1 : 0)), [regions]);

  const pts = regions.map((r) => KZ_CENTERS[r.map]);
  const line = (n) => pts.slice(0, n).map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join("");
  const reach = cur ? cur.i + 1 : regions.length;

  const act = (r) => {
    if (OPEN[r.state]) router.push(href(r));
    else setPin(r.id);
  };
  const label = (r) => `${r.i + 1}. ${regionName(r.id, lang)} — ${L.st[r.state]}, ${L.lessons(r.doneN, r.total)}`;
  const prev = show.i > 0 ? regions[show.i - 1] : null;

  return (
    <div className="km" onMouseLeave={() => setHover(null)}>
      <svg className="km-svg" viewBox={KZ_VIEW} role="group" aria-label={L.mapT}>
        <g className="km-land" aria-hidden="true">
          {paint.map((r) => (
            <path
              key={r.id}
              d={KZ_PATHS[r.map]}
              className={`km-r s-${r.state}${show.id === r.id ? " is-on" : ""}`}
              onClick={() => act(r)}
              onMouseEnter={() => setHover(r.id)}
            />
          ))}
        </g>
        <path className="km-route" d={line(regions.length)} aria-hidden="true" />
        {reach > 1 && <path className="km-route-done" d={line(reach)} aria-hidden="true" />}
        <g className="km-stops">
          {regions.map((r) => {
            const [x, y] = pts[r.i];
            const inner = (
              <g transform={`translate(${x} ${y})`}>
                <circle r="20" className="km-hit" />
                <Stop r={r} />
              </g>
            );
            const ev = { onFocus: () => setHover(r.id), onBlur: () => setHover(null), onMouseEnter: () => setHover(r.id) };
            return OPEN[r.state] ? (
              <a key={r.id} href={href(r)} className="km-stop" aria-label={label(r)} onClick={(e) => { e.preventDefault(); act(r); }} {...ev}>{inner}</a>
            ) : (
              <g
                key={r.id}
                className="km-stop"
                role="button"
                tabIndex={0}
                aria-label={label(r)}
                onClick={() => act(r)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(r); } }}
                {...ev}
              >
                {inner}
              </g>
            );
          })}
        </g>
        {cur && (
          <g className="km-aqyl" transform={`translate(${pts[cur.i][0] - 30} ${pts[cur.i][1] - 84})`} aria-hidden="true">
            <Qyran mood="happy" size={60} />
          </g>
        )}
      </svg>

      <div className={`km-info s-${show.state}`} aria-live="polite">
        <span className="km-info-mark" aria-hidden="true">
          {show.state === "done" ? <Icon name="check" size={18} /> : show.state === "locked" || show.state === "next" ? <Icon name="lock" size={16} /> : <b>{show.i + 1}</b>}
        </span>
        <span className="km-info-b">
          <b>{regionName(show.id, lang)}</b>
          <small>
            {L.st[show.state]} · {show.level} · {L.lessons(show.doneN, show.total)}
          </small>
          {!OPEN[show.state] && prev && <small className="km-info-lock">{L.unlock(regionName(prev.id, lang))}</small>}
        </span>
        {OPEN[show.state] && (
          <a href={href(show)} className="btn ghost km-info-go" onClick={(e) => { e.preventDefault(); act(show); }}>
            {L.go} <Icon name="right" size={16} className="km-flip" />
          </a>
        )}
      </div>
    </div>
  );
}
