// «VR Әлем» еркін сөйлесу: Aqyl жағдаяттағы кейіпкердің рөлін ойнайды (тек қазақша, деңгейге сай),
// оқушы қателессе — соңында «✎ » деп басталатын бір қысқа түзету жолы (түсіндіру тілінде).
import { callGemini, GeminiError, LANG_NAMES } from "../../../lib/gemini";
import { PLACES, SCENES } from "../../../lib/vr/scenes";

export const maxDuration = 60;
const MAX_MESSAGES = 10;
const MAX_LEN = 600;
const LEVELS = ["A1", "A2", "B1", "B2"];
const LEVEL_HINT = {
  A1: "very simple, high-frequency words; present tense; short phrases of 3–7 words; speak slowly and clearly",
  A2: "simple everyday sentences; present, past and future tense; common polite forms",
  B1: "connected everyday sentences; some subordinate clauses; common set phrases used sparingly",
  B2: "natural, fluent everyday Kazakh with varied grammar and idioms, but still short turns",
};
const pick = (o, k = "en") => (o && typeof o === "object" ? o[k] || o.en || o.ru || o.kk || "" : "");

function system({ scene, npc = {}, place, level, explain }) {
  const p = PLACES?.[place] || {};
  const lang = LANG_NAMES[explain] || LANG_NAMES.en;
  const who = npc.name ? `${npc.name}, ${pick(npc.role, "kk")} (${pick(npc.role)})` : `a friendly local person who works or is present at the ${pick(p.name)}`;
  return `You are role-playing inside "VR Әлем", a Kazakh speaking-practice scene on the Qyzyl til learning site.
Place: ${pick(p.name, "kk")} (${pick(p.name)}).
Your character: ${who}.${scene ? `\nSituation: ${pick(scene.title)}. The learner's goal: ${pick(scene.goal)}.` : "\nSituation: an ordinary everyday visit to this place; invent a natural, simple reason for the visit."}
Learner's level: CEFR ${level} — use ${LEVEL_HINT[level]}.

Rules:
- Stay in character the whole time. Your character lines are ONLY in Kazakh (Cyrillic), suitable for ${level}.
- Each turn: 1–2 short sentences, usually ending with a simple question or prompt the learner can answer. Keep the situation moving forward naturally (prices, directions, times, choices, next steps).
- After each learner message: if it has a mistake (grammar, endings, word choice, spelling, or it is not Kazakh), add ONE short final line that starts with "✎ " written in ${lang}: give the corrected Kazakh phrase and a very brief reason (max 20 words). If there is no mistake, add no such line. Use "✎" for nothing else.
- If the learner writes in another language, reply in role in simple Kazakh, and in the ✎ line show how to say their message in Kazakh.
- Never break character except in the ✎ line. Do not say you are an AI. No grammar lectures, no translations of your own lines, no transliteration, no emoji, no markdown.
- If the learner brings up unsafe, sexual, violent, hateful or otherwise inappropriate topics, decline politely in character in simple Kazakh and steer back to the situation. Children use this site; always be kind and respectful.
- When the scene starts, greet the learner in role and open the situation with one question.`;
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  const { scene: sceneId, place: placeIn, level: levelIn, messages = [], explain = "en" } = body || {};
  if (!Array.isArray(messages)) return Response.json({ error: "Bad request" }, { status: 400 });
  const list = Array.isArray(SCENES) ? SCENES : [];
  const byId = typeof sceneId === "string" ? list.find((s) => s.id === sceneId) : null;
  const place = byId?.place || (typeof placeIn === "string" && PLACES?.[placeIn] ? placeIn : null);
  if (!place) return Response.json({ error: "Unknown place" }, { status: 400 });
  // Тек орын берілсе — сол орынның алғашқы жағдаятының кейіпкері (картадағы бейнесімен бірдей болсын)
  const scene = byId || list.find((s) => s.place === place) || null;
  const level = LEVELS.includes(levelIn) ? levelIn : scene?.level || "A1";

  const turns = messages
    .slice(-MAX_MESSAGES)
    .filter((m) => typeof m?.text === "string" && m.text.trim())
    .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.text.slice(0, MAX_LEN) }] }));
  if (turns.length && turns[turns.length - 1].role !== "user") return Response.json({ error: "Bad request" }, { status: 400 });
  // Gemini әңгімесі пайдаланушыдан басталуы керек: сахна басталды деген белгі қосамыз
  const start = "[The scene starts now. Stay in role.]";
  const contents = turns[0]?.role === "user" ? [{ role: "user", parts: [{ text: `${start}\n\n${turns[0].parts[0].text}` }] }, ...turns.slice(1)] : [{ role: "user", parts: [{ text: start }] }, ...turns];

  try {
    const raw = await callGemini(contents, {
      system: system({ scene: byId, npc: scene?.npc || {}, place, level, explain }),
      temperature: 0.7,
      fast: true,
      thinking: "minimal",
      maxTokens: 600,
      perCallMs: 14_000,
    });
    const text = String(raw || "")
      .replace(/\*\*|__|`/g, "")
      .replace(/^\s*[-*]\s+/gm, "")
      .trim();
    if (!text) return Response.json({ error: "Empty reply" }, { status: 502 });
    return Response.json({ text });
  } catch (e) {
    const status = e instanceof GeminiError ? e.status : 500;
    return Response.json({ error: e.message || "AI error" }, { status });
  }
}
