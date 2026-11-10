"use client";
import { use } from "react";
import Link from "next/link";
import { GAMES } from "../../../../lib/games";
import { Arkan, Asyk, Baige } from "../../../components/games/QuizGames";
import { BesTas, Tenge, Togyz } from "../../../components/games/OtherGames";

const MAP = { baige: Baige, arkan: Arkan, asyk: Asyk, tenge: Tenge, bestas: BesTas, togyz: Togyz };

export default function GamePage({ params }) {
  const { id } = use(params);
  const game = GAMES.find((g) => g.id === id);
  const Comp = MAP[id];
  if (!game || !Comp) {
    return (
      <p>
        <Link href="/app/games">←</Link>
      </p>
    );
  }
  return <Comp game={game} />;
}
