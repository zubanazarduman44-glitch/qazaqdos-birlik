// «Нақты прогресс» ережесі — басты бет (лендинг), «Басты» тақта және деңгей тесті бір ережеге сүйенеді.
// Бастапқы сыйлық XP-і, тақтаға жай кіру немесе бос профиль прогреске жатпайды:
// тек оқу әрекеті — сабақ, VR жағдаят, ойын, өңір мөрі, сөздік, әдебиет, аяқталған деңгей тесті.
import { ALL_LESSONS, LEVELS } from "./courseIndex";

export const FIRST_LESSON = ALL_LESSONS[0].id; // A1 · «Сәлемдесу · 1» (greet-w1)
export const lessonHref = (id) => `/app/course?l=${id || FIRST_LESSON}`;
export const VR_BREAD = "/app/vr?s=shop-bread"; // VR «Нан сатып алу»

const n = (o) => (o && typeof o === "object" ? Object.keys(o).length : 0);

export function hasRealProgress(s) {
  if (!s) return false;
  if (n(s.course?.done) || n(s.vr?.done) || n(s.stamps) || n(s.sozdik?.learned) || n(s.lit)) return true;
  if (Object.values(s.games || {}).some((g) => (g?.plays || 0) > 0 || (g?.wins || 0) > 0)) return true;
  // Деңгей тесті аяқталса — прогресс; өткізіп жіберу (skipped) прогресс емес
  if (s.levelTest?.done || (s.cefr && !s.levelTest?.skipped)) return true;
  return false;
}

// Деңгей бойынша бастау сабағы: A0 / белгісіз → A1-дің алғашқы өтілмеген сабағы,
// A1–B2 → курстың өз ережесі (жол сол деңгейден ашылады) — сол деңгейдегі алғашқы өтілмеген сабақ
export function startLessonFor(cefr, done = {}) {
  const lev = LEVELS.find((l) => l.id === cefr) || LEVELS[0];
  const inLevel = ALL_LESSONS.filter((l) => lev.units.includes(l.topic));
  const hit = inLevel.find((l) => !done?.[l.id]) || ALL_LESSONS.find((l) => !done?.[l.id]);
  return hit ? hit.id : null;
}

// «Жалғастыру»: соңғы ашылған, бірақ аяқталмаған сабақ → соңғы өтілген сабақтан кейінгі өтілмегені → деңгейдің бастау сабағы
export function continueLesson(s) {
  const done = s?.course?.done || {};
  const last = s?.course?.last;
  if (last?.id && !done[last.id] && ALL_LESSONS.some((l) => l.id === last.id)) return last.id;
  let recent = null;
  for (const [id, d] of Object.entries(done)) if (!recent || (d?.at || 0) > recent.at) recent = { id, at: d?.at || 0 };
  if (recent) {
    const i = ALL_LESSONS.findIndex((l) => l.id === recent.id);
    const after = i >= 0 ? ALL_LESSONS.slice(i + 1).find((l) => !done[l.id]) : null;
    if (after) return after.id;
  }
  return startLessonFor(s?.cefr, done);
}

export { saveLevelResult, skipLevelTest, mergeLevelTest } from "./levelState";
