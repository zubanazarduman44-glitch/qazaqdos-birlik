"use client";
// Өңір келбеті: атлас-карта (шекара өзі сызылады, орталыққа түйреуіш түседі),
// «Өңір туралы» мәтіні және көрікті жерлердің суретті карточкалары. Барлық мәтін — өзіміздікі (lib/sights.js).
import { useId, useMemo } from "react";
import { KZ_PATHS, KZ_CENTERS } from "../../lib/kzmap";
import { REGIONS } from "../../lib/regions";
import { SIGHTS, REGION_ABOUT } from "../../lib/sights";
import { L } from "../../lib/i18n";
import { useTravelL10n } from "../../lib/l10nTravel";
import { tx } from "../../lib/tx";
import SightArt, { kindOf } from "./SightArt";

const LBL = {
  about: { kk: "Өңір туралы", ru: "О регионе", en: "About the region" },
  count: { kk: "Көрікті жер", ru: "Мест", en: "Sights" },
  north: { kk: "С", ru: "С", en: "N" },
};

function bbox(d) {
  const n = (d.match(/-?\d+\.?\d*/g) || []).map(Number);
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (let i = 0; i + 1 < n.length; i += 2) {
    x0 = Math.min(x0, n[i]); x1 = Math.max(x1, n[i]);
    y0 = Math.min(y0, n[i + 1]); y1 = Math.max(y1, n[i + 1]);
  }
  return [x0, y0, x1, y1];
}
const BY_MAP = Object.fromEntries(REGIONS.map((r) => [r.map, r]));
const shortName = (r, lang) =>
  r.city ? L(r.center, lang) : L(r.name, lang).replace(/ облысы$| область$| Region$/i, "");

function AtlasMap({ region, lang, x }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const d = KZ_PATHS[region.map];
  const geo = useMemo(() => {
    if (!d) return null;
    const [x0, y0, x1, y1] = bbox(d);
    const w = x1 - x0, h = y1 - y0;
    const pad = Math.max(w, h) * 0.2;
    const vx = x0 - pad, vy = y0 - pad, vw = w + pad * 2, vh = h + pad * 2;
    const k = Math.max(vw, vh) / 300;
    // Градус торы (шартты)
    const raw = 40 * k, mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw) || raw;
    const gx = [], gy = [];
    for (let v = Math.floor((vx - vw) / step) * step; v < vx + vw * 2; v += step) gx.push(v);
    for (let v = Math.floor((vy - vh) / step) * step; v < vy + vh * 2; v += step) gy.push(v);
    return { vb: `${vx} ${vy} ${vw} ${vh}`, vx, vy, vw, vh, k, gx, gy };
  }, [d]);
  if (!d || !geo) return null;
  const { vx, vy, vw, vh, k } = geo;
  const c = KZ_CENTERS[region.map];
  const inView = ([cx, cy]) => cx > vx - vw * 0.25 && cx < vx + vw * 1.25 && cy > vy + 4 * k && cy < vy + vh - 4 * k;
  const others = Object.entries(KZ_PATHS).filter(([m]) => m !== region.map);
  const cities = others.filter(([m]) => BY_MAP[m]?.city);
  const name = L(region.name, lang);
  return (
    <figure className="ra-map">
      <figcaption className="ra-cap">
        <span>{x.atBorder}</span>
        <b>{name}</b>
      </figcaption>
      <svg viewBox={geo.vb} preserveAspectRatio="xMidYMid meet" role="img" aria-label={name}>
        <defs>
          <linearGradient id={`${id}t`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E3E7C6" />
            <stop offset=".55" stopColor="#EADFB6" />
            <stop offset="1" stopColor="#DFC99A" />
          </linearGradient>
          <radialGradient id={`${id}l`} cx=".3" cy=".25" r=".8">
            <stop offset="0" stopColor="#fff" stopOpacity=".55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${id}c`}>
            <path d={d} />
          </clipPath>
        </defs>
        <g className="ra-grid" strokeWidth={0.6 * k}>
          {geo.gx.map((v) => <path key={`x${v}`} d={`M${v} ${vy - vh}V${vy + vh * 2}`} />)}
          {geo.gy.map((v) => <path key={`y${v}`} d={`M${vx - vw}  ${v}H${vx + vw * 2}`} />)}
        </g>
        {others.filter(([m]) => !BY_MAP[m]?.city).map(([m, p]) => <path key={m} d={p} className="ra-nb" strokeWidth={0.9 * k} />)}
        <g className="ra-region">
          <path d={d} className="ra-fill" fill={`url(#${id}t)`} />
          <path d={d} className="ra-fill" fill={`url(#${id}l)`} />
          <g clipPath={`url(#${id}c)`}>
            <path d={d} className="ra-halo" strokeWidth={12 * k} />
          </g>
          <path d={d} className="ra-border" strokeWidth={2.2 * k} pathLength="1" />
        </g>
        {cities.map(([m, p]) => <path key={m} d={p} className="ra-city" strokeWidth={0.9 * k} />)}
        <g className="ra-labels" fontSize={9.5 * k}>
          {others.map(([m]) => {
            const r = BY_MAP[m], cc = KZ_CENTERS[m];
            if (!r || !cc || !inView(cc)) return null;
            return (
              <text key={m} x={cc[0]} y={cc[1]} textAnchor="middle" strokeWidth={3 * k}>
                {shortName(r, lang)}
              </text>
            );
          })}
        </g>
        <g transform={`translate(${vx + vw - 20 * k} ${vy + 24 * k}) scale(${k})`} className="ra-compass">
          <circle r="11" />
          <path d="M0 -9 L3.5 2 L0 0 L-3.5 2Z" className="ra-n1" />
          <path d="M0 9 L3.5 2 L0 0 L-3.5 2Z" className="ra-n2" />
          <text y="-14" textAnchor="middle">{L(LBL.north, lang)}</text>
        </g>
        {c && (
          <g transform={`translate(${c[0]} ${c[1]}) scale(${k})`}>
            <ellipse className="ra-shadow" rx="6" ry="2.2" />
            <circle className="ra-rip" r="10" />
            <circle className="ra-rip ra-rip2" r="10" />
            <g className="ra-drop">
              <path d="M0 0 C-2 -6 -9 -10 -9 -17 a9 9 0 0 1 18 0 C9 -10 2 -6 0 0Z" className="ra-pin" />
              <circle cy="-17" r="3.4" fill="#FFFDF7" />
            </g>
            <text className="ra-ctr" x="12" y="-12" strokeWidth="3.4">
              {L(region.center, lang)}
            </text>
          </g>
        )}
      </svg>
      <div className="ra-legend">
        <span><i className="ra-lg-r" /> {shortName(region, lang)}</span>
        <span><i className="ra-lg-c" /> {x.atCenter}: {L(region.center, lang)}</span>
      </div>
    </figure>
  );
}

function SightCard({ s, i, lang }) {
  const info = SIGHTS && SIGHTS[s.en];
  const text = info && info.text ? L(info.text, lang) : "";
  const name = L(s, lang);
  return (
    <article className="ra-card" style={{ "--i": i }}>
      <div className="ra-art">
        <SightArt kind={kindOf(s)} title={name} />
        <span className="ra-n">{i + 1}</span>
      </div>
      <div className="ra-body">
        <h4>{name}</h4>
        {text && <p>{text}</p>}
      </div>
    </article>
  );
}

const L10N_EXTRA = { sights: SIGHTS, labels: LBL };

export default function RegionAtlas({ region, lang }) {
  useTravelL10n(lang, L10N_EXTRA);
  const x = tx(lang);
  const aboutObj = REGION_ABOUT && REGION_ABOUT[region.id];
  const about = aboutObj ? L(aboutObj, lang) : L(region.fact, lang);
  return (
    <section className="ra">
      <div className="ra-top">
        <AtlasMap region={region} lang={lang} x={x} />
        <div className="ra-about">
          <span className="ra-kicker">{L(LBL.about, lang)}</span>
          {about && <p className="ra-lead">{about}</p>}
          <dl className="ra-facts">
            <div>
              <dt>{x.atCenter}</dt>
              <dd>{L(region.center, lang)}</dd>
            </div>
            <div>
              <dt>{L(LBL.count, lang)}</dt>
              <dd>{region.sights.length}</dd>
            </div>
          </dl>
          <ol className="ra-list">
            {region.sights.map((s, i) => (
              <li key={s.en} style={{ "--i": i }}>
                <SightArt kind={kindOf(s)} mini />
                <span className="ra-ln">{i + 1}</span>
                <b>{L(s, lang)}</b>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="ra-sights">
        <h3>{x.atSights}</h3>
        <div className="ra-grid-cards">
          {region.sights.map((s, i) => (
            <SightCard key={s.en} s={s} i={i} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
