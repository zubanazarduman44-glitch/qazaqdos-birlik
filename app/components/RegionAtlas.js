"use client";
// Өңір келбеті: өңірдің толық шекарасы (масштабталған карта) + көрікті жерлер (Wikipedia фотосы мен қысқаша мәтіні).
import { useEffect, useId, useMemo, useState } from "react";
import { KZ_PATHS, KZ_CENTERS } from "../../lib/kzmap";
import { L } from "../../lib/i18n";
import { tx } from "../../lib/tx";

function bbox(d) {
  const n = (d.match(/-?\d+\.?\d*/g) || []).map(Number);
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (let i = 0; i + 1 < n.length; i += 2) {
    x0 = Math.min(x0, n[i]); x1 = Math.max(x1, n[i]);
    y0 = Math.min(y0, n[i + 1]); y1 = Math.max(y1, n[i + 1]);
  }
  return [x0, y0, x1, y1];
}

const cache = new Map();
function loadLS() {
  try { return JSON.parse(localStorage.getItem("qd_wp1") || "{}"); } catch { return {}; }
}
function saveLS(k, v) {
  try { const o = loadLS(); o[k] = v; const keys = Object.keys(o); if (keys.length > 160) delete o[keys[0]]; localStorage.setItem("qd_wp1", JSON.stringify(o)); } catch {}
}
async function wiki(sight, lang) {
  const tries = lang === "ru" ? [["ru", sight.ru], ["en", sight.en]] : [["en", sight.en], ["ru", sight.ru]];
  const key = `${lang}|${sight.en}`;
  if (cache.has(key)) return cache.get(key);
  const ls = loadLS()[key];
  if (ls) { cache.set(key, ls); return ls; }
  let out = null;
  for (const [wl, title] of tries) {
    try {
      const r = await fetch(`https://${wl}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}?redirect=true`);
      if (!r.ok) continue;
      const d = await r.json();
      if (d.type === "disambiguation") continue;
      const img = d.originalimage?.source || d.thumbnail?.source || null;
      const thumb = d.thumbnail?.source ? d.thumbnail.source.replace(/\/\d+px-/, "/900px-") : img;
      const cur = { img: thumb, text: d.extract || "", url: d.content_urls?.desktop?.page || "" };
      if (!out) out = cur;
      else { out.img = out.img || cur.img; out.text = out.text || cur.text; }
      if (out.img && out.text) break;
    } catch {}
  }
  if (out) { cache.set(key, out); saveLS(key, out); }
  return out;
}

function Sight({ s, i, lang, x, e }) {
  const [d, setD] = useState(null);
  const [bad, setBad] = useState(false);
  useEffect(() => {
    let ok = true;
    wiki(s, lang).then((r) => ok && setD(r));
    return () => { ok = false; };
  }, [s.en, lang]); // eslint-disable-line react-hooks/exhaustive-deps
  const name = L(s, lang);
  return (
    <article className="sight" style={{ animationDelay: `${i * 90}ms` }}>
      <div className="sight-ph">
        {d?.img && !bad ? <img src={d.img} alt={name} loading="lazy" onError={() => setBad(true)} /> : <span className="sight-fb">{e}</span>}
        <span className="sight-n">{i + 1}</span>
        <span className="sight-shade" />
        <h4>{name}</h4>
      </div>
      <p>{d ? (d.text.length > 190 ? d.text.slice(0, 190).replace(/\s+\S*$/, "") + "…" : d.text) : x.atLoad}</p>
      {d?.url && <a href={d.url} target="_blank" rel="noopener noreferrer">{x.atMore} →</a>}
    </article>
  );
}

export default function RegionAtlas({ region, lang }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const x = tx(lang);
  const d = KZ_PATHS[region.map];
  const [vb, c] = useMemo(() => {
    if (!d) return [null, null];
    const [x0, y0, x1, y1] = bbox(d);
    const w = x1 - x0, h = y1 - y0;
    const pad = Math.max(w, h) * 0.14;
    return [`${x0 - pad} ${y0 - pad} ${w + pad * 2} ${h + pad * 2}`, KZ_CENTERS[region.map]];
  }, [d, region.map]);
  if (!d) return null;
  return (
    <section className="atlas">
      <div className="atlas-map">
        <div className="atlas-cap"><span>{x.atBorder}</span><b>{L(region.name, lang)}</b></div>
        <svg viewBox={vb} role="img" aria-label={L(region.name, lang)}>
          <defs>
            <linearGradient id={`ag${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffe48a" /><stop offset="1" stopColor="#e39b00" /></linearGradient>
            <pattern id={`ap${id}`} width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
              <path d="M13 21c0-5-4-8-7-5s-1 6 2 5M13 21c0-5 4-8 7-5s1 6-2 5M13 6l3 3-3 3-3-3z" fill="none" stroke="#b8322a" strokeWidth="1.2" opacity=".42" />
            </pattern>
            <filter id={`as${id}`} x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#6b4220" floodOpacity=".4" /></filter>
          </defs>
          {Object.entries(KZ_PATHS).map(([k, p]) => k !== region.map && <path key={k} d={p} className="atlas-bg" />)}
          <g filter={`url(#as${id})`}>
            <path d={d} fill={`url(#ag${id})`} stroke="#b8322a" strokeWidth="3" strokeLinejoin="round" />
            <path d={d} fill={`url(#ap${id})`} />
            <path d={d} fill="none" stroke="#fff7e2" strokeWidth="1.6" strokeDasharray="10 8" strokeLinejoin="round" className="atlas-march" />
          </g>
          {c && (
            <g transform={`translate(${c[0]} ${c[1]})`}>
              <circle r="14" className="atlas-ring" />
              <circle r="6" fill="#b8322a" stroke="#fff7e2" strokeWidth="2.4" />
              <text className="atlas-e" textAnchor="middle" dy="-16">{region.e}</text>
            </g>
          )}
        </svg>
        <div className="atlas-center"><span>{x.atCenter}</span><b>{L(region.center, lang)}</b></div>
      </div>
      <div className="atlas-sights">
        <h3>{x.atSights}</h3>
        <div className="sights">
          {region.sights.map((s, i) => <Sight key={s.en} s={s} i={i} lang={lang} x={x} e={region.e} />)}
        </div>
      </div>
    </section>
  );
}
