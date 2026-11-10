"use client";
import Link from "next/link";
import { useApp } from "../../components/Store";
import Alash from "../../components/Alash";
import Icon from "../../components/Icon";
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
        <Alash mood="cheer" size={100} />
      </header>
      <div className="grid g3">
        {GAMES.map((g, i) => {
          const s = state.games?.[g.id];
          return (
            <Link key={g.id} href={`/app/games/${g.id}`} className="card hover game-card rise" style={{ animationDelay: `${i * 0.05}s`, "--gc": g.color }}>
              <span className="gc-n">0{i + 1}</span>
              <span className="gc-e">{g.e}</span>
              <h3>{L(g.name, lang)}</h3>
              <p className="muted">{L(g.desc, lang)}</p>
              <div className="gc-foot">
                <span className="muted small">
                  🏆 {t.wins}: {s?.wins || 0}
                </span>
                <span className="btn blue small">
                  {t.play} <Icon name="right" size={15} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
