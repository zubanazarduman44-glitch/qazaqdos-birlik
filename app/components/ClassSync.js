"use client";
import { useEffect, useRef } from "react";
import { useApp } from "./Store";
import { joinedClasses, listTasks, listSubs, upsertSub, syncMember } from "../../lib/classes";

// Оқушының белсенділігін сыныпқа жібереді және автоматты тапсырмаларды (сабақ, ойын) белгілейді
export default function ClassSync() {
  const { user, state } = useApp();
  const ref = useRef(state);
  ref.current = state;
  const classes = useRef([]);

  useEffect(() => {
    if (!user) return;
    let dead = false;
    const run = async () => {
      try {
        const cls = await joinedClasses(user.id);
        if (dead) return;
        classes.current = cls;
        const s = ref.current;
        for (const c of cls) {
          const tasks = await listTasks(c.id);
          const subs = await listSubs(tasks.map((t) => t.id));
          for (const t of tasks) {
            const sub = subs.find((x) => x.task_id === t.id);
            if (sub?.done || t.kind === "custom") continue;
            if (t.kind === "lesson") {
              const d = s.course?.done?.[t.ref];
              if (d) await upsertSub({ task_id: t.id, user_id: user.id, done: true, score: d.score || 100, base: sub?.base || 0 });
              else if (!sub) await upsertSub({ task_id: t.id, user_id: user.id, done: false, score: 0, base: 0 });
            } else if (t.kind === "game") {
              const wins = s.games?.[t.ref]?.wins || 0;
              if (!sub) await upsertSub({ task_id: t.id, user_id: user.id, done: false, score: 0, base: wins });
              else if (wins > (sub.base || 0)) await upsertSub({ task_id: t.id, user_id: user.id, done: true, score: wins, base: sub.base || 0 });
            }
          }
        }
      } catch {}
    };
    run();
    const id = setInterval(run, 60000);
    return () => { dead = true; clearInterval(id); };
  }, [user?.id, state.course?.done, state.games]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user) return;
    const id = setTimeout(async () => {
      const s = ref.current;
      const cls = classes.current;
      const stats = { xp: s.xp || 0, week_xp: s.weekly?.xp || 0, streak: s.streak || 0, lessons: Object.keys(s.course?.done || {}).length, words: (s.vocab || []).length, name: s.profile?.name || undefined, avatar: s.profile?.avatar || undefined };
      for (const c of cls) { try { await syncMember(c.id, user.id, stats); } catch {} }
    }, 8000);
    return () => clearTimeout(id);
  }, [user?.id, state.xp, state.vocab?.length, state.course?.done]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
