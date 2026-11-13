"use client";
// «Түзел · Айтылым» нәтижесі: ұпай сақинасы, Aqyl үкімі, естігені және кеңестер (сөз көпіршіктері).
import Icon from "./Icon";
import Qyran from "./Qyran";
import { TuzelMeter, band } from "./TuzelKit";

export default function TuzelSpeakResult({ x, res, pass = 70, target, onRetry }) {
  const score = Math.max(0, Math.min(100, Math.round(Number(res?.score) || 0)));
  const good = score >= pass;
  const tips = Array.isArray(res?.tips) ? res.tips : [];
  return (
    <section className={`tzs-res rise b-${band(score)}`} aria-live="polite">
      <div className="tzs-res-top">
        <TuzelMeter value={score} label={x.spScore} size={168} />
        <div className="tzs-verdict">
          <span className={`tzs-badge ${good ? "ok" : ""}`}>
            <Icon name={good ? "trophy" : "target"} size={16} /> {score} / 100
          </span>
          <h3>{res?.verdict}</h3>
          <div className="tzs-heard">
            <span className="tzs-heard-l">
              <Icon name="chat" size={16} /> {x.spHeard}
            </span>
            <q dir="auto" lang="kk">{res?.heard || "—"}</q>
            {target && (
              <span className="tzs-target">
                <small>{x.spTarget}:</small> <span dir="auto" lang="kk">{target}</span>
              </span>
            )}
          </div>
        </div>
        <span className="tzs-res-bird">
          <Qyran mood={good ? "cheer" : "support"} size={110} />
        </span>
      </div>

      {tips.length > 0 && (
        <div className="tzs-tips">
          <h4>{x.spTips}</h4>
          <ul>
            {tips.map((tp, i) => (
              <li key={i} style={{ "--i": i }}>
                <span className="tzs-tip-n" aria-hidden="true"><Icon name="sparkle" size={14} /></span>
                <p>{tp}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="tzs-res-act">
        <button type="button" className="tz-cta" onClick={onRetry}>
          <Icon name="refresh" size={18} /> {x.spTryAgain}
        </button>
      </div>
    </section>
  );
}
