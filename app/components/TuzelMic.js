"use client";
// «Түзел · Айтылым»: үлкен жазу түймесі (киіз розетка), 15 секундтық таймер-сақина,
// жазу кезінде толқын мен пульс, талдау кезінде ойланған Aqyl.
import Icon from "./Icon";
import Qyran from "./Qyran";
import { TuzelWave } from "./TuzelKit";

const TICKS = 15;

export default function TuzelMic({ x, phase = "idle", ms = 0, stream = null, onStart, onStop }) {
  const secs = Math.min(15, ms / 1000);
  const rec = phase === "rec";
  const busy = phase === "busy";
  return (
    <div className={`tzs-rec ${phase}`}>
      <div className="tzs-dial">
        {rec && (
          <span className="tzs-pulse" aria-hidden="true">
            <i /><i /><i />
          </span>
        )}
        <svg className="tzs-ticks" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="86" className="tzs-track" />
          {Array.from({ length: TICKS }, (_, i) => (
            <g key={i} transform={`rotate(${(i * 360) / TICKS + 12} 100 100)`}>
              <rect x="96.5" y="6" width="7" height="15" rx="3.5" className={`tzs-tick ${rec && secs > i ? "on" : ""}`} />
            </g>
          ))}
        </svg>
        {rec && (
          <span className="tzs-bead" aria-hidden="true" style={{ transform: `rotate(${(secs / 15) * 360}deg)` }}>
            <i />
          </span>
        )}
        <button type="button" className="tzs-mic" disabled={busy} onClick={rec ? onStop : onStart} aria-label={rec ? x.spStop : x.spRec}>
          <span className="tzs-mic-oyu" aria-hidden="true" />
          {busy ? (
            <span className="tzs-mic-bird"><Qyran mood="think" size={58} /></span>
          ) : (
            <Icon name={rec ? "stop" : "mic"} size={rec ? 34 : 40} stroke={2.4} />
          )}
        </button>
      </div>

      <div className="tzs-wave-slot">{rec ? <TuzelWave stream={stream} /> : busy ? <span className="tz-dots big" aria-hidden="true"><i /><i /><i /></span> : null}</div>

      <p className="tzs-status" aria-live="polite">
        {rec ? (
          <>
            <span className="tzs-dot" aria-hidden="true" /> {x.spRecording} <b className="tzs-time">{secs.toFixed(1)}</b> / 15
          </>
        ) : busy ? (
          x.spAnalyzing
        ) : (
          x.spRec
        )}
      </p>
      <p className="tzs-hint">
        <Icon name="sparkle" size={14} /> {x.spLimit} · {x.spHint}
      </p>
    </div>
  );
}
