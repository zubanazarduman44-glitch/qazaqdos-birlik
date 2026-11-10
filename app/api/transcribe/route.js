// Дыбысты мәтінге айналдыру (чаттағы микрофон). Дыбыс сақталмайды.
import { callGemini, GeminiError } from "../../../lib/gemini";

export const maxDuration = 30;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  const { audio } = body || {};
  if (typeof audio !== "string" || audio.length < 500 || audio.length > 3_000_000) return Response.json({ error: "Bad audio" }, { status: 400 });
  try {
    const text = await callGemini(
      [{ role: "user", parts: [{ text: "Transcribe this speech exactly as spoken, in the language spoken (Kazakh in Cyrillic, Russian in Cyrillic, English in Latin). Output only the transcript, nothing else. If there is no speech, output an empty string." }, { inline_data: { mime_type: "audio/wav", data: audio } }] }],
      { temperature: 0, fast: true, thinking: "minimal", maxTokens: 300 }
    );
    return Response.json({ text: text.replace(/^["«]|["»]$/g, "").trim() });
  } catch (e) {
    const status = e instanceof GeminiError ? e.status : 500;
    return Response.json({ error: e.message || "AI error" }, { status });
  }
}
