"use client";
import LangPicker from "../../components/LangPicker";
import Link from "next/link";
import { useApp } from "../../components/Store";
import Qyran from "../../components/Qyran";
import Icon from "../../components/Icon";
import { GameScene, Muiz } from "../../components/games/Frame";
import { GAMES } from "../../../lib/games";
import { L } from "../../../lib/i18n";

export default function Games() {
  const { t, lang, state } = useApp();
  return (
    <div className="games">
      <header className="page-head games-head">
        <div>
          <span className="kicker">{t.gamesKicker}</span>
          <h1>{t.gamesTitle}</h1>
          <p>{t.gamesSub}</p>
        </div>
        <div className="head-tools">
          <LangPicker />
          <Qyran mood="cheer" size={90} />
        </div>
      </header>
      <div className="gl-grid">
        {GAMES.map((g, i) => {
          const s = state.games?.[g.id];
          return (
            <Link key={g.id} href={`/app/games/${g.id}`} className="gl-card" style={{ "--gc": g.color, "--i": i }}>
              <span className="gl-art">
                <GameScene id={g.id} />
                <span className="gl-n">0{i + 1}</span>
              </span>
              <span className="gl-body">
                <span className="gl-title">
                  <Muiz color={g.color} w={14} />
                  <b>{L(g.name, lang)}</b>
                </span>
                <span className="gl-desc">{L(g.desc, lang)}</span>
                <span className="gl-how">{L(g.how, lang)}</span>
                <span className="gl-foot">
                  <span className="gl-wins">
                    <Icon name="trophy" size={16} /> {t.wins}: <b>{s?.wins || 0}</b>
                  </span>
                  <span className="btn blue small gl-play">
                    {t.play} <Icon name="right" size={15} />
                  </span>
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
