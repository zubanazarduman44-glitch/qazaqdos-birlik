// Gemini-мен жұмыс: диагноз да, чат та осы функцияны қолданады.
// Работа с Gemini: и диагноз, и чат используют эту функцию.

// Vercel-де GEMINI_MODEL айнымалысы арқылы өзгертуге болады
const MODELS = [
  process.env.GEMINI_MODEL,
  "gemini-flash-latest",
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
  // Ескі буын модельдері: әрқайсысының тегін лимиті бөлек (жоқ болса 404 → айналып өтеміз)
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
].filter(Boolean);

// Соңғы қорғаныс: Gemma модельдері сол кілтпен жұмыс істейді, тегін күндік лимиті әлдеқайда көп.
// Олар жүйелік нұсқаулықты, JSON-схеманы және «ойлануды» қолдамайды — төменде бейімдейміз.
// Сурет/дыбыс бар сұраныстарға қолданбаймыз.
const GEMMA_MODELS = [process.env.GEMMA_MODEL, "gemma-3-27b-it", "gemma-3-12b-it", "gemma-3n-e4b-it"].filter(Boolean);
const isGemma = (m) => /^gemma/.test(m);

// Күндік тегін лимит Тынық мұхит уақытымен түн ортасында жаңарады (≈ 07:00–08:00 UTC).
// Күндік лимиті біткен модельді сол уақытқа дейін айналып өтеміз — бос сұраныспен уақыт жоғалтпау үшін.
function msUntilDailyReset() {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 7, 5));
  if (next.getTime() <= now.getTime()) next.setUTCDate(next.getUTCDate() + 1);
  return Math.min(next.getTime() - now.getTime(), 24 * 3_600_000);
}

// Gemma үшін: жүйелік нұсқаулық пен JSON талабын бірінші хабарға қосамыз
function gemmaContents(contents, system, schema, json) {
  const notes = [];
  if (system) notes.push(system);
  if (schema) notes.push(`Reply ONLY with a JSON object (no markdown fences) that matches this JSON schema:\n${JSON.stringify(schema)}`);
  else if (json) notes.push("Reply ONLY with valid JSON (no markdown fences).");
  if (!notes.length) return contents;
  const out = contents.map((c) => ({ ...c, parts: [...(c.parts || [])] }));
  const i = out.findIndex((c) => c.role !== "model");
  if (i === -1) return [{ role: "user", parts: [{ text: notes.join("\n\n") }] }, ...out];
  out[i].parts.unshift({ text: notes.join("\n\n") + "\n\n---\n\n" });
  return out;
}
const hasMedia = (contents) => contents.some((c) => (c.parts || []).some((p) => p.inline_data || p.inlineData || p.file_data));
function stripFences(t) {
  const m = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  return (m ? m[1] : t).trim();
}

// Бір модельге қанша уақыт күтеміз, және барлығына жалпы уақыт (Vercel лимиті 60 с)
const PER_CALL_MS = 25_000;
const TOTAL_MS = 52_000;

// Чат үшін — жылдам/жеңіл модельдер алдымен
const FAST_MODELS = [
  process.env.GEMINI_FAST_MODEL,
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
  ...MODELS.filter((m) => m !== process.env.GEMINI_MODEL),
].filter(Boolean);

// Жұмыс істеген модельді есте сақтаймыз (диагноз және чат үшін бөлек)
const preferred = { full: null, fast: null };
// Лимиті біткен модельдерді біраз уақыт айналып өтеміз
const coolDown = new Map(); // model -> уақыт (ms) дейін

// Кілтке қолжетімді модельдерді өзі табады (1 сағатқа есте сақтайды)
let discovered = { at: 0, list: [] };
let discovering = null;
// Бұғаттамайды: тізім ескірсе фонда жаңартады, бірінші сұраныс күтпейді (жылдамдық үшін)
function discoverModels(apiKey) {
  if (Date.now() - discovered.at >= 3_600_000 && !discovering) {
    discovering = fetchModels(apiKey).finally(() => {
      discovering = null;
    });
  }
  return Promise.resolve(discovered.list);
}
async function fetchModels(apiKey) {
  try {
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", {
      headers: { "x-goog-api-key": apiKey },
      signal: AbortSignal.timeout(4_000),
    });
    if (r.ok) {
      const d = await r.json();
      const list = (d.models || [])
        .filter((m) => (m.supportedGenerationMethods || []).includes("generateContent"))
        .map((m) => String(m.name || "").replace(/^models\//, ""))
        .filter((n) => /flash/.test(n) && !/(image|tts|audio|live|embed|preview-0[0-9]|exp)/.test(n));
      discovered = { at: Date.now(), list };
    } else discovered = { at: Date.now() - 3_000_000, list: [] };
  } catch {
    discovered = { at: Date.now() - 3_000_000, list: [] };
  }
  return discovered.list;
}

export class GeminiError extends Error {
  constructor(message, status = 502) {
    super(message);
    this.status = status;
  }
}

// «Ойлану» уақытын азайтамыз — жауап жылдамырақ келеді
function thinkingFor(model, level = "low") {
  if (/2\.5/.test(model)) return { thinkingBudget: /lite/.test(model) || level === "minimal" ? 0 : 512 };
  return { thinkingLevel: level };
}

/**
 * contents — Gemini форматындағы хабарламалар
 * opts.schema — JSON схемасы (болса, жауап JSON болады)
 * opts.system — жүйелік нұсқаулық
 * Жауап: мәтін (string)
 */
export async function callGemini(
  contents,
  { schema, json = false, system, temperature = 0.2, fast = false, thinking = "low", mediaResolution, maxTokens, perCallMs } = {}
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiError("Серверде GEMINI_API_KEY бапталмаған / На сервере не настроен GEMINI_API_KEY", 500);
  }

  const started = Date.now();
  const kind = fast ? "fast" : "full";
  // Белгілі модельдер + кілтке қолжетімді басқа flash модельдер (лимит біткенде ауысу үшін)
  const extra = await discoverModels(apiKey);
  const lite = extra.filter((m) => /lite/.test(m));
  const full = extra.filter((m) => !/lite/.test(m));
  const gemini = [...new Set([...(fast ? FAST_MODELS : MODELS), ...(fast ? [...lite, ...full] : [...full, ...lite])])].slice(0, 14);
  // Gemma — тек мәтіндік сұраныстарға, ең соңында
  const base = hasMedia(contents) ? gemini : [...gemini, ...GEMMA_MODELS];
  const pref = preferred[kind];
  const now = Date.now();
  let order = pref ? [pref, ...base.filter((m) => m !== pref)] : base;
  // Лимиті жуырда біткен модельдерді соңына жылжытамыз
  order = [...order.filter((m) => !(coolDown.get(m) > now)), ...order.filter((m) => coolDown.get(m) > now)];
  let lastError = "";
  const allErrors = [];
  let allLimited = true;
  let anyLimited = false;
  let dailyHit = false;

  for (const model of order) {
    const gemma = isGemma(model);
    let useSchema = Boolean(schema) && !gemma;
    let useThinking = !gemma;
    let useMedia = Boolean(mediaResolution);
    let level = thinking;

    // Бір модельге ең көбі 3 әрекет: қате параметрді алып тастап қайталаймыз
    for (let attempt = 0; attempt < 3; attempt++) {
      const left = TOTAL_MS - (Date.now() - started);
      if (left < 3_000) {
        throw new GeminiError(
          `ЖИ тым ұзақ ойланды, қайталап көріңіз / ИИ думал слишком долго, попробуйте ещё раз — ${lastError}`,
          504
        );
      }

      const generationConfig = { temperature };
      if ((schema || json) && !gemma) generationConfig.responseMimeType = "application/json";
      if (useSchema) generationConfig.responseSchema = schema;
      if (useThinking) generationConfig.thinkingConfig = thinkingFor(model, level);
      // Суретті орташа сапада өңдеу — токен аз, жауап жылдам
      if (useMedia) generationConfig.mediaResolution = mediaResolution;
      if (maxTokens) generationConfig.maxOutputTokens = maxTokens;

      const body = { contents: gemma ? gemmaContents(contents, system, schema, json) : contents, generationConfig };
      if (system && !gemma) body.systemInstruction = { parts: [{ text: system }] };

      const t0 = Date.now();
      let res;
      try {
        res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(Math.min(perCallMs || PER_CALL_MS, left - 2_000)),
          }
        );
      } catch (e) {
        lastError = `${model}: ${e.name === "TimeoutError" ? "timeout" : e.message}`;
        allLimited = false;
        console.error("Gemini fetch failed", lastError, `${Date.now() - t0}ms`);
        break; // келесі модель
      }

      if (res.ok) {
        const data = await res.json();
        const text = (data?.candidates?.[0]?.content?.parts || [])
          .filter((p) => !p.thought)
          .map((p) => p.text || "")
          .join("")
          .trim();
        console.log("Gemini ok", model, `${Date.now() - t0}ms`);
        if (text && gemma && (schema || json)) {
          // Gemma JSON-ды кейде ```json ішінде береді — тазалап, тексереміз
          const clean = stripFences(text);
          try {
            JSON.parse(clean);
            preferred[kind] = model;
            coolDown.delete(model);
            return clean;
          } catch {
            lastError = `${model}: invalid JSON`;
            break;
          }
        }
        if (text) {
          preferred[kind] = model;
          coolDown.delete(model);
          return text;
        }
        lastError = `${model}: empty response (${data?.candidates?.[0]?.finishReason || "?"})`;
        // Жауап лимитке жетіп кесілсе — сол модельмен лимитсіз қайталаймыз
        if (data?.candidates?.[0]?.finishReason === "MAX_TOKENS" && maxTokens) {
          maxTokens = undefined;
          continue;
        }
        break;
      }

      const errText = await res.text();
      let msg = errText;
      try {
        msg = JSON.parse(errText)?.error?.message || errText;
      } catch {}
      lastError = `${model} (${res.status}): ${msg}`.slice(0, 300);
      allErrors.push(lastError.slice(0, 140));
      console.error("Gemini error", lastError);

      // Лимит бітті — бұл модельді 60 с айналып өтіп, келесі модельді көреміз (әр модельдің лимиті бөлек)
      if (res.status === 429) {
        anyLimited = true;
        if (/per.?day|daily|PerDay/i.test(msg)) dailyHit = true;
        // Күндік лимит біткен болса — бұл модельді ұзағырақ айналып өтеміз
        coolDown.set(model, Date.now() + (/per.?day|daily|PerDay/i.test(msg) ? msUntilDailyReset() : 60_000));
        if (preferred[kind] === model) preferred[kind] = null;
        break;
      }
      // Модель жоқ/қолжетімсіз (404) — лимит сияқты есептеп, келесіге өтеміз
      if (res.status === 404 || /not found|not supported|is not available/i.test(msg)) {
        coolDown.set(model, Date.now() + 30 * 60_000);
        break;
      }
      allLimited = false;
      if (/API key not valid|API_KEY_INVALID/i.test(msg)) {
        throw new GeminiError("Gemini кілті жарамсыз / Ключ Gemini недействителен — проверьте GEMINI_API_KEY в Vercel");
      }
      if (res.status === 400 && useMedia) {
        useMedia = false;
        continue;
      }
      if (res.status === 400 && useThinking && /think/i.test(msg)) {
        // «minimal» қолдамаса — «low»-ға, ол да болмаса — ойлануды өшіреміз
        if (level === "minimal") level = "low";
        else useThinking = false;
        continue;
      }
      if (res.status === 400 && useSchema && /schema|enum/i.test(msg)) {
        useSchema = false;
        continue;
      }
      break; // басқа қате — келесі модель
    }
    if (preferred[kind] === model) preferred[kind] = null;
  }

  if (allLimited || anyLimited) {
    throw new GeminiError(
      dailyHit
        ? "Google Gemini тегін күндік лимиті бітті — ол күн сайын шамамен 13:00-де (Қазақстан уақыты) жаңарады / Дневной бесплатный лимит Google Gemini исчерпан — обновляется ежедневно около 13:00 по времени Казахстана"
        : "Google Gemini тегін лимиті уақытша бітті — 1 минуттан кейін қайталаңыз / Бесплатный лимит Google Gemini временно исчерпан — повторите через минуту",
      429
    );
  }
  throw new GeminiError(`ЖИ жауап бермеді / ИИ не ответил — ${allErrors.length ? allErrors.join(" | ") : lastError}`);
}

export const LANG_NAMES = {
  kk: "қазақ тілінде (Kazakh)",
  ru: "на русском языке (Russian)",
  en: "in English",
  zh: "用中文 (Chinese, simplified)",
  es: "en español (Spanish)",
  de: "auf Deutsch (German)",
  fr: "en français (French)",
  tr: "Türkçe (Turkish)",
  ar: "بالعربية (Arabic)",
  ko: "한국어 (Korean)",
  ja: "日本語 (Japanese)",
};

// ══════════ Қазақ тілінің сапасы: барлық промптқа ортақ нұсқаулық + жауапты жеңіл тазалау ══════════
// Kazakh quality block shared by every prompt. Written in English: models follow English meta-rules most reliably.
export const KK_STYLE = `Kazakh language quality (strict):
- Write Kazakh in natural, modern standard literary Kazakh, Cyrillic script only. Use the Kazakh letters ә ғ қ ң ө ұ ү һ і exactly where they belong; never replace them with Russian а г к н о у и or with Latin look-alike letters.
- Obey vowel harmony and consonant assimilation in every suffix: back-vowel stems take -лар/-дар/-тар, -ға/-қа, -да/-та, -дан/-тан/-нан, -ның/-дың/-тың, -мын/-мыз; front-vowel stems take -лер/-дер/-тер, -ге/-ке, -де/-те, -ден/-тен/-нен, -нің/-дің/-тің, -мін/-міз. Examples: балалар, үйлер, қыздар, мектептер; қалаға, үйге, кітапқа, мектепке; қалада, үйде, мектепте.
- Kazakh word order: subject – object – verb, the verb at the end; use postpositions (үшін, туралы, арқылы, сияқты, бойынша).
- No calques from Russian or English: write how Kazakh speakers really say it (Менің атым Айгерім; Рақмет; Қалайсыз?; Сау болыңыз). Prefer the common Kazakh word (ұшақ, тоңазытқыш, дүкен, аурухана) and use international words only where Kazakhs normally use them.
- Do not mix languages inside a Kazakh sentence. Any other language appears only in explanations written in the learner's explanation language.
- Keep sentences short, clear and friendly; choose everyday vocabulary that fits the learner's level (A1–A2: 3–8 words per Kazakh sentence).
- Before answering, re-read every Kazakh word and sentence: spelling, endings, harmony. If unsure that a form is correct, use a simpler sentence you are sure about. Never invent words.`;

// Латын «егіздері» → кирилл (тек кирилл әрпі бар сөздің ішінде)
const LAT2CYR = { a: "а", A: "А", e: "е", E: "Е", o: "о", O: "О", p: "р", P: "Р", c: "с", C: "С", x: "х", X: "Х", y: "у", Y: "У", i: "і", I: "І", h: "һ", H: "Н", K: "К", k: "к", M: "М", T: "Т", B: "В" };
// Басқа жазулардағы ұқсас әріптер → қазақ әрпі (кез келген жерде)
const ODD2KK = { "ə": "ә", "Ə": "Ә", "ɵ": "ө", "Ɵ": "Ө", "ӊ": "ң", "Ӊ": "Ң", "ҥ": "ң", "Ҥ": "Ң", "ҡ": "қ", "Ҡ": "Қ", "ӄ": "қ", "Ӄ": "Қ", "ӷ": "ғ", "Ӷ": "Ғ", "ӧ": "ө", "Ӧ": "Ө", "ӱ": "ү", "Ӱ": "Ү" };
const CYR = /[Ѐ-ӿ]/;
const LAT = /[A-Za-z]/;

/** Кирилл сөздің ішіне кіріп кеткен латын әріптерін және бөтен ұқсас әріптерді түзетеді. */
export function kkFix(text) {
  if (typeof text !== "string" || !text) return text;
  return text
    .replace(/[əƏɵƟӊӉҥҤҡҠӄӃӷӶӧӦӱӰ]/g, (ch) => ODD2KK[ch] || ch)
    .replace(/[\p{L}̀-ͯ]+/gu, (w) => (CYR.test(w) && LAT.test(w) ? w.replace(/[A-Za-z]/g, (ch) => LAT2CYR[ch] || ch) : w));
}

/** Объектінің барлық жолдарына kkFix қолданады (JSON жауаптар үшін). */
export function kkFixDeep(v) {
  if (typeof v === "string") return kkFix(v);
  if (Array.isArray(v)) return v.map(kkFixDeep);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, kkFixDeep(x)]));
  return v;
}

/**
 * Жауапты жеңіл тазалау. markdown=true — чаттағы **жуан**, тізім, кесте қалады; false — таза мәтін.
 * Код қоршаулары, HTML тегтері, «Aqyl:» деген бастама, артық бос жолдар алынады.
 */
export function tidy(text, { markdown = true } = {}) {
  if (typeof text !== "string") return "";
  let t = text
    .replace(/\r/g, "")
    .replace(/^\s*```[a-z]*\s*\n?/i, "")
    .replace(/\n?```\s*$/, "")
    .replace(/```[a-z]*\n?/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(?:b|strong|i|em|p|span|div|u)\b[^>]*>/gi, "")
    .replace(/^\s*(?:\*\*)?(?:Aqyl|Ақыл|Акыл)(?:\*\*)?\s*[:：]\s*/i, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n");
  if (markdown) {
    // # және ## тақырыптарды ### етеміз (бет тек кіші тақырыпты көрсетеді); жалғыз қалған ** алынады
    t = t.replace(/^\s{0,3}#{1,2}\s+/gm, "### ");
    t = t
      .split("\n")
      .map((line) => ((line.match(/\*\*/g) || []).length % 2 ? line.replace(/\*\*(?!.*\*\*)/, "") : line))
      .join("\n");
  } else {
    t = t
      .replace(/\*\*|__|`/g, "")
      .replace(/^\s{0,3}#{1,6}\s+/gm, "")
      .replace(/^\s*[-*•]\s+/gm, "")
      .replace(/(^|\s)\*(\S[^*\n]*\S|\S)\*(?=\s|$|[.,!?])/g, "$1$2");
  }
  return kkFix(t.trim());
}
