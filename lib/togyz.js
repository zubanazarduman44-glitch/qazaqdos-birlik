// Тоғызқұмалақ ережелері. Отаулар: 0–8 — ойыншы (A), 9–17 — компьютер (B).
// Таратылу бағыты: сағат тіліне қарсы (0→8→9→17→0).

export function newGame() {
  return { pits: Array(18).fill(9), kazan: [0, 0], tuz: [-1, -1], turn: 0, over: false, winner: null, last: null };
}

const own = (p, i) => (p === 0 ? i < 9 : i >= 9);

export function legalMoves(g, p = g.turn) {
  const res = [];
  for (let k = 0; k < 9; k++) {
    const i = p === 0 ? k : 9 + k;
    if (g.pits[i] > 0 && g.tuz[0] !== i && g.tuz[1] !== i) res.push(i);
  }
  return res;
}

// Жүріс жасау. Қайтарады: жаңа күй (ескісі өзгермейді)
export function play(g0, from) {
  const g = { pits: [...g0.pits], kazan: [...g0.kazan], tuz: [...g0.tuz], turn: g0.turn, over: false, winner: null, last: null };
  const p = g.turn;
  let n = g.pits[from];
  g.pits[from] = 0;
  let i = from;
  const path = [];
  if (n === 1) {
    i = (i + 1) % 18;
    drop(g, i, path);
  } else {
    drop(g, i, path); // біріншісі өз орнына
    n--;
    while (n > 0) {
      i = (i + 1) % 18;
      drop(g, i, path);
      n--;
    }
  }
  let captured = 0;
  let madeTuz = false;
  // Соңғы құмалақ қарсыластың отауына түссе
  if (!own(p, i) && g.tuz[0] !== i && g.tuz[1] !== i) {
    const cnt = g.pits[i];
    const oppIdx = p === 0 ? i - 9 : i; // қарсыластың отау нөмірі 0–8
    const symmetric = p === 0 ? g.tuz[1] : g.tuz[0];
    const symIdx = symmetric === -1 ? -1 : symmetric >= 9 ? symmetric - 9 : symmetric;
    if (cnt === 3 && g.tuz[p] === -1 && oppIdx !== 8 && symIdx !== oppIdx) {
      g.tuz[p] = i;
      g.kazan[p] += cnt;
      captured = cnt;
      g.pits[i] = 0;
      madeTuz = true;
    } else if (cnt % 2 === 0) {
      g.kazan[p] += cnt;
      captured = cnt;
      g.pits[i] = 0;
    }
  }
  g.last = { from, to: i, path, captured, madeTuz, by: p };
  g.turn = 1 - p;
  checkEnd(g);
  return g;
}

function drop(g, i, path) {
  if (g.tuz[0] === i) g.kazan[0] += 1;
  else if (g.tuz[1] === i) g.kazan[1] += 1;
  else g.pits[i] += 1;
  path.push(i);
}

function checkEnd(g) {
  if (g.kazan[0] >= 82 || g.kazan[1] >= 82) {
    g.over = true;
    g.winner = g.kazan[0] >= 82 ? 0 : 1;
    return;
  }
  if (g.kazan[0] === 81 && g.kazan[1] === 81) {
    g.over = true;
    g.winner = -1;
    return;
  }
  // Кезегі келген ойыншының жүрісі жоқ — қалған құмалақтарды қарсыласы алады
  if (legalMoves(g, g.turn).length === 0) {
    const other = 1 - g.turn;
    for (let i = 0; i < 18; i++) {
      if (own(other, i)) {
        g.kazan[other] += g.pits[i];
        g.pits[i] = 0;
      }
    }
    g.over = true;
    g.winner = g.kazan[0] === g.kazan[1] ? -1 : g.kazan[0] > g.kazan[1] ? 0 : 1;
  }
}

function score(g, p) {
  return g.kazan[p] - g.kazan[1 - p] + (g.tuz[p] !== -1 ? 6 : 0) - (g.tuz[1 - p] !== -1 ? 6 : 0);
}

// Компьютер: 2 қадам алға қарайтын минимакс (level: 1 — оңай, 2 — орташа)
export function aiMove(g, level = 2) {
  const p = g.turn;
  const moves = legalMoves(g, p);
  if (!moves.length) return null;
  let best = moves[0];
  let bestVal = -Infinity;
  for (const m of moves) {
    const g1 = play(g, m);
    let val;
    if (g1.over) val = g1.winner === p ? 1000 : g1.winner === -1 ? 0 : -1000;
    else if (level < 2) val = score(g1, p);
    else {
      let worst = Infinity;
      for (const m2 of legalMoves(g1, g1.turn)) {
        const g2 = play(g1, m2);
        const v = g2.over ? (g2.winner === p ? 1000 : g2.winner === -1 ? 0 : -1000) : score(g2, p);
        if (v < worst) worst = v;
      }
      val = worst === Infinity ? score(g1, p) : worst;
    }
    val += Math.random() * 0.5; // бірдей жүрістер арасында кездейсоқ таңдау
    if (val > bestVal) {
      bestVal = val;
      best = m;
    }
  }
  return best;
}
