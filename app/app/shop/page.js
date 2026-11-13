"use client";
import "../../shop.css";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../../components/Store";
import DressUp from "../../components/Dress";
import ItemArt from "../../components/ItemArt";
import Icon from "../../components/Icon";
import { ShopCoin, ShopPurse, ShopCrown, ShopRug } from "../../components/ShopArt";
import { ITEMS, CATS } from "../../../lib/shop";
import { tx } from "../../../lib/tx";
import { L } from "../../../lib/i18n";

// Тек осы беттің безендіру мәтіндері (дүкен логикасы өзгермейді)
const T = {
  purse: { kk: "Әмиян", ru: "Кошелёк", en: "Purse", zh: "钱袋", es: "Monedero", de: "Geldbeutel", fr: "Bourse", tr: "Kese", ar: "المحفظة", ko: "지갑", ja: "財布" },
  coins: { kk: "тиын", ru: "монет", en: "coins", zh: "枚硬币", es: "monedas", de: "Münzen", fr: "pièces", tr: "jeton", ar: "عملات", ko: "코인", ja: "コイン" },
  mirror: { kk: "Киім үйі", ru: "Примерочная", en: "Fitting room", zh: "试衣间", es: "Probador", de: "Umkleide", fr: "Cabine d’essayage", tr: "Kabin", ar: "غرفة القياس", ko: "탈의실", ja: "試着室" },
  tryOn: { kk: "Киіп көру", ru: "Примерить", en: "Try on", zh: "试穿", es: "Probar", de: "Anprobieren", fr: "Essayer", tr: "Dene", ar: "جرّب", ko: "입어 보기", ja: "試着する" },
  trying: { kk: "Айнада киіп көріп тұрсың", ru: "Вы примеряете", en: "You're trying on", zh: "正在试穿", es: "Te lo estás probando", de: "Du probierst gerade an", fr: "Tu essaies", tr: "Deniyorsun", ar: "أنت تجرّب", ko: "입어 보는 중", ja: "試着中" },
  back: { kk: "Қайтару", ru: "Отменить", en: "Cancel", zh: "取消", es: "Cancelar", de: "Abbrechen", fr: "Annuler", tr: "Vazgeç", ar: "إلغاء", ko: "취소", ja: "キャンセル" },
  wearing: { kk: "Киіп тұр", ru: "Надето", en: "Wearing", zh: "已穿戴", es: "Puesto", de: "Angezogen", fr: "Porté", tr: "Giyili", ar: "مرتدى", ko: "착용 중", ja: "着用中" },
  empty: { kk: "бос", ru: "пусто", en: "empty", zh: "空", es: "vacío", de: "leer", fr: "vide", tr: "boş", ar: "فارغ", ko: "비어 있음", ja: "なし" },
  toMirror: { kk: "Айнаға оралу", ru: "К зеркалу", en: "Back to mirror", zh: "回到镜子", es: "Volver al espejo", de: "Zum Spiegel", fr: "Retour au miroir", tr: "Aynaya dön", ar: "العودة إلى المرآة", ko: "거울로 돌아가기", ja: "鏡に戻る" },
  need: { kk: (n) => `Тағы ${n} тиын керек`, ru: (n) => `Не хватает ${n}`, en: (n) => `${n} more coins needed`, zh: (n) => `还差 ${n} 枚硬币`, es: (n) => `Faltan ${n} monedas`, de: (n) => `Noch ${n} Münzen nötig`, fr: (n) => `Encore ${n} pièces`, tr: (n) => `${n} jeton daha gerekli`, ar: (n) => `تحتاج إلى ${n} عملات إضافية`, ko: (n) => `코인 ${n}개 더 필요`, ja: (n) => `あと${n}コイン必要` },
  rare: [
    { kk: "Қарапайым", ru: "Обычный", en: "Common", zh: "普通", es: "Común", de: "Gewöhnlich", fr: "Commun", tr: "Sıradan", ar: "عادي", ko: "일반", ja: "ふつう" },
    { kk: "Сапалы", ru: "Добротный", en: "Fine", zh: "精良", es: "Fino", de: "Edel", fr: "Raffiné", tr: "Kaliteli", ar: "جيد", ko: "고급", ja: "上質" },
    { kk: "Сирек", ru: "Редкий", en: "Rare", zh: "稀有", es: "Raro", de: "Selten", fr: "Rare", tr: "Nadir", ar: "نادر", ko: "희귀", ja: "レア" },
    { kk: "Қазына", ru: "Сокровище", en: "Treasure", zh: "珍宝", es: "Tesoro", de: "Schatz", fr: "Trésor", tr: "Hazine", ar: "كنز", ko: "보물", ja: "お宝" },
  ],
};
const CAT_ART = { head: "kalpak", body: "shapan", foot: "etik", acc: "dombyra" };
const rarity = (p) => (p <= 25 ? 0 : p <= 40 ? 1 : p <= 60 ? 2 : 3);
const reduced = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const center = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, vis: r.bottom > 0 && r.top < window.innerHeight && r.width > 0 }; };

export default function Shop() {
  const { lang, state, update, toast } = useApp();
  const x = tx(lang);
  const t = (k) => L(T[k], lang);
  const [cat, setCat] = useState("all");
  const [tryId, setTryId] = useState(null); // тек көрініс: сақталмайды
  const [fx, setFx] = useState(null); // ұшатын тиындар
  const [sewn, setSewn] = useState(0); // айнадағы «тігілу» әсері
  const [shake, setShake] = useState(null);
  const [dock, setDock] = useState(false);
  const purseRef = useRef(null), mirrorRef = useRef(null), dockRef = useRef(null), stageRef = useRef(null);
  const shop = state.shop || { owned: [], wear: {} };
  const coins = state.coins || 0;
  const byId = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

  function buy(it) {
    if (coins < it.price) return toast(x.shNoCoins, "support");
    update((s) => {
      const sh = s.shop || { owned: [], wear: {} };
      return { ...s, coins: (s.coins || 0) - it.price, shop: { owned: [...sh.owned, it.id], wear: { ...sh.wear, [it.cat]: it.id } } };
    });
    toast(`${x.shBought} ${L(it.name, lang)}`, "cheer");
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
  const wearing = (c) => byId[shop.wear?.[c]];

  // ── Безендіру: сатып алу анимациясы (логика — жоғарыдағы buy) ──
  function target() {
    const m = mirrorRef.current && center(mirrorRef.current);
    if (m?.vis) return m;
    const d = dockRef.current && center(dockRef.current);
    return d?.vis ? d : m;
  }
  function onBuy(it, el) {
    const ok = coins >= it.price;
    buy(it);
    if (!ok) { setShake({ id: it.id, n: Date.now() }); return; }
    setTryId(null);
    setSewn(Date.now());
    if (reduced() || !el || !purseRef.current) return;
    const from = center(purseRef.current), tile = center(el), to = target();
    setFx({ n: Date.now(), id: it.id, from, tile, to });
  }
  function onWear(it, on) { wear(it, on); if (on) setSewn(Date.now()); if (tryId === it.id) setTryId(null); }
  function onTry(it) { setTryId((v) => (v === it.id ? null : it.id)); }

  useEffect(() => { if (!fx) return; const k = setTimeout(() => setFx(null), 1500); return () => clearTimeout(k); }, [fx]);
  useEffect(() => { if (!shake) return; const k = setTimeout(() => setShake(null), 520); return () => clearTimeout(k); }, [shake]);
  useEffect(() => { if (!sewn) return; const k = setTimeout(() => setSewn(0), 1600); return () => clearTimeout(k); }, [sewn]);
  // Кіші экранда айна көрінбей қалса — қалқымалы кішкене айна
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setDock(!e.isIntersecting), { rootMargin: "-80px 0px 0px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const tryIt = tryId && byId[tryId] && !shop.owned?.includes(tryId) ? byId[tryId] : null;
  const look = tryIt ? { ...(shop.wear || {}), [tryIt.cat]: tryIt.id } : shop.wear || {};
  const cats = Object.keys(CATS);
  const shown = cat === "all" ? cats : [cat];
  const ownedIn = (c) => ITEMS.filter((i) => i.cat === c && shop.owned?.includes(i.id)).length;
  const totalIn = (c) => ITEMS.filter((i) => i.cat === c).length;
  const skin = state.profile?.skin || "eagle";

  const tryBar = tryIt && (
    <div className="sh-try" role="status">
      <span className="sh-try-art" aria-hidden="true"><ItemArt id={tryIt.id} size={40} /></span>
      <span className="sh-try-txt"><small>{t("trying")}</small><b>{L(tryIt.name, lang)}</b></span>
      <span className="sh-try-acts">
        <button className={`btn small ${coins >= tryIt.price ? "gold" : "ghost sh-poor"}`} onClick={(e) => onBuy(tryIt, document.getElementById(`sh-${tryIt.id}`) || e.currentTarget)}>
          <Icon name={coins >= tryIt.price ? "bag" : "lock"} size={16} /> {x.shBuy} · {tryIt.price}
        </button>
        <button className="btn small ghost sh-icon-btn" onClick={() => setTryId(null)} aria-label={t("back")}><Icon name="x" size={16} /></button>
      </span>
    </div>
  );

  return (
    <div className="shop sh">
      <div className="sh-bunting" aria-hidden="true" />
      <header className="sh-head">
        <div className="sh-head-txt">
          <span className="kicker">{x.shKicker}</span>
          <h1>{x.shTitle}</h1>
          <p>{x.shSub}</p>
        </div>
        <div className="sh-purse" ref={purseRef}>
          <ShopPurse size={64} />
          <div className="sh-purse-txt" aria-live="polite">
            <span>{t("purse")}</span>
            <b key={coins} className="sh-coins"><ShopCoin size={22} />{coins} <small>{t("coins")}</small></b>
          </div>
        </div>

      </header>

      <div className="sh-grid">
        {/* ── Киім үйі: әмиян + айна + киім орындары ── */}
        <aside className="sh-stage" ref={stageRef} aria-label={t("mirror")}>
          <div className={`sh-mirror ${sewn ? "sewn" : ""} ${tryIt ? "trying" : ""}`} ref={mirrorRef}>
            <ShopCrown />
            <div className="sh-glass">
              <span className="sh-glass-label">{tryIt ? t("tryOn") : x.shYou}</span>
              <span className="sh-tassel s1" aria-hidden="true" /><span className="sh-tassel s2" aria-hidden="true" />
              <div className="sh-model">
                <ShopRug />
                <div className="sh-model-fig"><DressUp skin={skin} wear={look} size={210} mood={sewn ? "happy" : "idle"} /></div>
                <span className="sh-stitch" aria-hidden="true" />
                <span className="sh-spark k1" aria-hidden="true" /><span className="sh-spark k2" aria-hidden="true" /><span className="sh-spark k3" aria-hidden="true" />
              </div>
            </div>
          </div>

          {tryBar}

          <ul className="sh-slots">
            {cats.map((c) => {
              const w = tryIt && tryIt.cat === c ? tryIt : wearing(c);
              return (
                <li key={c}>
                  <button className={`sh-slot ${w ? "full" : ""} ${tryIt?.cat === c ? "try" : ""}`} onClick={() => setCat(c)} aria-pressed={cat === c}>
                    <span className="sh-slot-art" aria-hidden="true">{w ? <ItemArt id={w.id} size={34} /> : <span className="sh-slot-ghost"><ItemArt id={CAT_ART[c]} size={30} /></span>}</span>
                    <span className="sh-slot-txt"><small>{L(CATS[c], lang)}</small><b>{w ? L(w.name, lang) : t("empty")}</b></span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="sh-earn"><Icon name="sparkle" size={16} /> {x.shEarn}</p>
        </aside>

        {/* ── Базар: дүкен сөрелері ── */}
        <section className="sh-market">
          <div className="sh-tabs" role="group" aria-label={x.shTitle}>
            {["all", ...cats].map((c) => (
              <button key={c} className={`sh-tab ${cat === c ? "on" : ""}`} aria-pressed={cat === c} onClick={() => setCat(c)}>
                <span className="sh-tab-art" aria-hidden="true">{c === "all" ? <Icon name="bag" size={22} /> : <ItemArt id={CAT_ART[c]} size={34} />}</span>
                <span className="sh-tab-name">{c === "all" ? x.shAll : L(CATS[c], lang)}</span>
                {c === "all" && <span className="sh-tab-n">{shop.owned?.length || 0}/{ITEMS.length}</span>}
              </button>
            ))}
          </div>

          {shown.map((c, si) => {
            const list = ITEMS.filter((i) => i.cat === c).sort((a, b) => a.price - b.price);
            return (
              <section key={c} className={`sh-stall st-${c}`} style={{ "--si": si }} aria-labelledby={`sh-st-${c}`}>
                <div className="sh-awning" aria-hidden="true" />
                <div className="sh-sign">
                  <span className="sh-sign-art" aria-hidden="true"><ItemArt id={CAT_ART[c]} size={40} /></span>
                  <h2 id={`sh-st-${c}`}>{L(CATS[c], lang)}</h2>
                  <span className="sh-sign-n">{ownedIn(c)}/{totalIn(c)}</span>
                </div>
                <div className="sh-shelf">
                  {list.map((it, i) => {
                    const own = shop.owned?.includes(it.id);
                    const on = shop.wear?.[it.cat] === it.id;
                    const can = coins >= it.price;
                    const r = rarity(it.price);
                    const st = on ? "on" : own ? "own" : can ? "buy" : "lock";
                    const trying = tryIt?.id === it.id;
                    return (
                      <article key={it.id} id={`sh-${it.id}`} className={`sh-good r${r} is-${st} ${trying ? "trying" : ""} ${shake?.id === it.id ? "shake" : ""}`} data-shake={shake?.id === it.id ? shake.n : undefined} style={{ "--i": i }}>
                        <div className="sh-good-top">
                          <span className="sh-rare" title={L(T.rare[r], lang)}>
                            <span className="sh-rare-dots" aria-hidden="true">{[0, 1, 2, 3].map((d) => <i key={d} className={d <= r ? "f" : ""} />)}</span>
                            {L(T.rare[r], lang)}
                          </span>
                          {own ? (
                            <span className="sh-tag own" title={x.shOwned}><Icon name="check" size={15} stroke={2.8} /><span className="sh-sr">{x.shOwned}</span></span>
                          ) : (
                            <span className="sh-tag"><ShopCoin size={16} /> {it.price}</span>
                          )}
                        </div>
                        <div className="sh-plate">
                          <span className="sh-plate-art"><ItemArt id={it.id} size={100} /></span>
                          {on && <span className="sh-worn"><Icon name="star" size={13} stroke={2.4} /> {t("wearing")}</span>}
                        </div>
                        <h3>{L(it.name, lang)}</h3>
                        <p>{L(it.desc, lang)}</p>
                        {st === "lock" && <span className="sh-need"><Icon name="lock" size={13} /> {L(T.need, lang)(it.price - coins)}</span>}
                        <div className="sh-acts">
                          {!own ? (
                            <>
                              <button className={`btn small sh-trybtn ${trying ? "on" : ""}`} aria-pressed={trying} onClick={() => onTry(it)}>
                                <Icon name={trying ? "x" : "user"} size={15} /> {trying ? t("back") : t("tryOn")}
                              </button>
                              <button className={`btn small ${can ? "gold" : "ghost sh-poor"}`} onClick={(e) => onBuy(it, e.currentTarget.closest("article"))}>
                                <Icon name={can ? "bag" : "lock"} size={15} /> {x.shBuy}
                              </button>
                            </>
                          ) : on ? (
                            <button className="btn small ghost sh-wide" onClick={() => onWear(it, false)}><Icon name="x" size={15} /> {x.shOff}</button>
                          ) : (
                            <button className="btn small blue sh-wide" onClick={() => onWear(it, true)}><Icon name="sparkle" size={15} /> {x.shWear}</button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </section>
      </div>

      {/* Кіші экран: айна көрінбегенде — қалқымалы кішкене айна */}
      <div className={`sh-dock ${dock ? "show" : ""} ${tryIt ? "wide" : ""} ${sewn ? "sewn" : ""}`} ref={dockRef}>
        <button className="sh-dock-mirror" onClick={() => stageRef.current?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" })} aria-label={t("toMirror")}>
          <DressUp skin={skin} wear={look} size={46} mood="idle" />
        </button>
        <span className="sh-dock-coins"><ShopCoin size={16} />{coins}</span>
        {tryIt && (
          <>
            <button className={`btn small ${coins >= tryIt.price ? "gold" : "ghost sh-poor"}`} onClick={() => onBuy(tryIt, document.getElementById(`sh-${tryIt.id}`))}>
              <Icon name={coins >= tryIt.price ? "bag" : "lock"} size={15} /> {tryIt.price}
            </button>
            <button className="btn small ghost sh-icon-btn" onClick={() => setTryId(null)} aria-label={t("back")}><Icon name="x" size={15} /></button>
          </>
        )}
      </div>

      {fx && (
        <div className="sh-fly" key={fx.n} aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <span key={k} className="sh-fly-coin" style={{ "--x0": `${fx.from.x}px`, "--y0": `${fx.from.y}px`, "--x1": `${fx.tile.x + (k - 2.5) * 14}px`, "--y1": `${fx.tile.y - 30 + (k % 2) * 16}px`, "--d": `${k * 55}ms` }}><ShopCoin size={22} /></span>
          ))}
          <span className="sh-fly-item" style={{ "--x0": `${fx.tile.x}px`, "--y0": `${fx.tile.y - 20}px`, "--x1": `${fx.to.x}px`, "--y1": `${fx.to.y}px` }}><ItemArt id={fx.id} size={84} /></span>
        </div>
      )}
    </div>
  );
}
