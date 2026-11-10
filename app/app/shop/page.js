"use client";
import { useMemo, useState } from "react";
import { useApp } from "../../components/Store";
import DressUp from "../../components/Dress";
import Qyran from "../../components/Qyran";
import Icon from "../../components/Icon";
import { ITEMS, CATS } from "../../../lib/shop";
import { tx } from "../../../lib/tx";
import { L } from "../../../lib/i18n";

export default function Shop() {
  const { lang, state, update, toast } = useApp();
  const x = tx(lang);
  const [cat, setCat] = useState("all");
  const shop = state.shop || { owned: [], wear: {} };
  const coins = state.coins || 0;
  const byId = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

  function buy(it) {
    if (coins < it.price) return toast(x.shNoCoins, "support");
    update((s) => {
      const sh = s.shop || { owned: [], wear: {} };
      return { ...s, coins: (s.coins || 0) - it.price, shop: { owned: [...sh.owned, it.id], wear: { ...sh.wear, [it.cat]: it.id } } };
    });
    toast(`${x.shBought} ${it.e} ${L(it.name, lang)}`, "cheer");
  }
  function wear(it, on) {
    update((s) => {
      const sh = s.shop || { owned: [], wear: {} };
      const w = { ...sh.wear };
      if (on) w[it.cat] = it.id;
      else delete w[it.cat];
      return { ...s, shop: { ...sh, wear: w } };
    });
  }
  const list = ITEMS.filter((i) => cat === "all" || i.cat === cat);
  const wearing = (c) => byId[shop.wear?.[c]];

  return (
    <div className="shop">
      <header className="page-head">
        <div>
          <span className="kicker">{x.shKicker}</span>
          <h1>{x.shTitle}</h1>
          <p>{x.shSub}</p>
        </div>
        <span className="chip gold">🪙 {coins}</span>
      </header>

      <div className="shop-grid">
        <section className="card shop-stage">
          <h3>{x.shYou}</h3>
          <div className="dress">
            <DressUp skin={state.profile?.skin || "eagle"} wear={shop.wear || {}} size={230} mood="idle" />
          </div>
          <ul className="dress-list">
            {Object.keys(CATS).map((c) => (
              <li key={c}>
                <span>{L(CATS[c], lang)}</span>
                <b>{wearing(c) ? `${wearing(c).e} ${L(wearing(c).name, lang)}` : "—"}</b>
              </li>
            ))}
          </ul>
          <p className="muted small">{x.shEarn}</p>
        </section>

        <section className="shop-main">
          <div className="shop-tabs">
            {["all", ...Object.keys(CATS)].map((c) => (
              <button key={c} className={`chip tab ${cat === c ? "on" : ""}`} onClick={() => setCat(c)}>
                {c === "all" ? x.shAll : L(CATS[c], lang)}
              </button>
            ))}
          </div>
          <div className="items">
            {list.map((it, i) => {
              const own = shop.owned?.includes(it.id);
              const on = shop.wear?.[it.cat] === it.id;
              return (
                <article key={it.id} className={`card item ${on ? "on" : ""}`} style={{ animationDelay: `${i * 0.04}s` }}>
                  <span className="item-e">{it.e}</span>
                  <h4>{L(it.name, lang)}</h4>
                  <p>{L(it.desc, lang)}</p>
                  <div className="item-foot">
                    <span className="price">🪙 {it.price}</span>
                    {!own ? (
                      <button className={`btn small ${coins >= it.price ? "gold" : "ghost"}`} onClick={() => buy(it)}>
                        <Icon name="bag" size={15} /> {x.shBuy}
                      </button>
                    ) : on ? (
                      <button className="btn small ghost" onClick={() => wear(it, false)}>{x.shOff}</button>
                    ) : (
                      <button className="btn small blue" onClick={() => wear(it, true)}>{x.shWear}</button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
