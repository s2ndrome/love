/* ════════════════════════════════════════════════════════
   대사 찾기 — Cloudflare Worker (리아 채팅이랑 따로, 파일 하나로 끝)
   - POST /quote → 글을 줄 단위로 받아서, 따옴표 없이 쓴 "대사" 줄 번호를 돌려줘요
   글 에디터(tools/editor.js)의 “대사” → "AI로 대사 찾기" 버튼이 여기를 불러요.

   설정 (Cloudflare > 이 워커 > 설정 > 변수 및 비밀):
   - 리아 채팅이랑 같은 키를 같은 이름의 "비밀(Secret)"로 넣어주세요.
     VERTEX_API_KEY (Vertex AI) 또는 GEMINI_API_KEY (AI Studio)
   - 아무나 못 쓰게, 홈 관리자 토큰(GitHub 토큰, 이 저장소에 쓰기 권한 있는 것)이 있어야만 동작해요.
   ════════════════════════════════════════════════════════ */

/* ───────── 여기만 고치면 돼요 ───────── */
const PROVIDER = "vertex"; // "vertex" 또는 "studio" — 리아 채팅이랑 똑같이
const VERTEX_MODELS = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-2.5-flash"];
const VERTEX_PROJECT = "gen-lang-client-0170873477";
const MODELS = ["gemini-flash-latest", "gemini-3.5-flash-lite", "gemini-flash-lite-latest"];
const REPO = "s2ndrome/love"; // 이 저장소에 쓰기 권한이 있는 토큰만 통과
const ALLOWED_ORIGINS = ["https://xn--hy1bp1el5l.com", "https://www.xn--hy1bp1el5l.com", "https://s2ndrome.github.io"];
/* ───────────────────────────────────── */

const PROMPT = `너는 한국어 소설(로그) 원고 교정 도우미야.
원고 전체가 번호 붙은 줄로 주어져. 번호 뒤에 "?"가 붙은 줄(예: "12?:")이 따옴표가 빠져 있을 수 있는 줄이야.
"?" 줄을 하나도 빠짐없이 전부 살펴서, 등장인물이 소리 내어 말한 대사인 줄의 번호를 모두 골라.
- 대사: 인물이 직접 한 말 그대로인 줄. 반말·존댓말·말줄임(…)·감탄·질문 모두 포함.
  (예: 오빠 나 배고파 / 밥은 먹었어? / 아, 진짜... 미치겠네 / 지수야. / 응, 알았어.)
- 원고 안에서 이미 “ ”로 감싼 줄들이 이 글의 대사 말투 예시야. 비슷한 말투면 대사로 봐.
- 대사가 아닌 것: 서술·묘사 지문(~했다, ~였다, ~는 그를 바라보았다 등), 제목·소제목, 문서 양식(이름:, 작성자:), 효과음만 있는 줄.
- 한 줄 안에 서술 지문과 대사가 섞여 있으면 고르지 마.
글이 길어도 중간에 멈추지 말고 끝까지 다 확인해.
답은 고른 번호의 JSON 배열만. 없으면 [].`;

const CORS = origin => ({
  "access-control-allow-origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "authorization, content-type",
  "access-control-max-age": "86400",
  vary: "origin",
});
const json = (o, status, origin) => new Response(JSON.stringify(o), { status: status || 200, headers: { "content-type": "application/json; charset=utf-8", ...CORS(origin) } });

// 토큰 확인은 10분 동안 기억해요 (매번 GitHub에 안 물어보게)
const OK = new Map();
async function sha(s) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join(""); }
async function canWrite(token) {
  if (!token || token.length > 400) return false;
  const h = await sha(token), c = OK.get(h);
  if (c && c > Date.now()) return true;
  const r = await fetch(`https://api.github.com/repos/${REPO}`, { headers: { authorization: `Bearer ${token}`, accept: "application/vnd.github+json", "user-agent": "syndrome-quote" } });
  if (!r.ok) return false;
  const ok = !!(await r.json())?.permissions?.push;
  if (ok) OK.set(h, Date.now() + 10 * 60 * 1000);
  return ok;
}

async function findQuotes(env, lines, ask) {
  const vertex = PROVIDER === "vertex";
  const keyName = vertex ? "VERTEX_API_KEY" : "GEMINI_API_KEY";
  if (!env[keyName]) throw Object.assign(new Error(`${keyName} 비밀이 없어요`), { status: 500 });
  const key = String(env[keyName]).trim();
  const askSet = new Set(ask && ask.length ? ask : lines.map((_, i) => i + 1));
  const text = lines.map((l, i) => `${i + 1}${askSet.has(i + 1) ? "?" : ""}: ${l}`).join("\n");
  let r, err = "";
  for (const model of vertex ? VERTEX_MODELS : MODELS) {
    r = await fetch(
      vertex
        ? (VERTEX_PROJECT
            ? `https://aiplatform.googleapis.com/v1/projects/${VERTEX_PROJECT}/locations/global/publishers/google/models/${model}:generateContent`
            : `https://aiplatform.googleapis.com/v1/publishers/google/models/${model}:generateContent`)
        : `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: PROMPT }] },
          contents: [{ role: "user", parts: [{ text }] }],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 8192, // 생각(thinking)에 쓰는 몫까지 넉넉하게 — 모자라면 답이 중간에 잘려요
            responseMimeType: "application/json",
            responseSchema: { type: "ARRAY", items: { type: "INTEGER" } },
            ...(model.startsWith("gemini-2.5") ? { thinkingConfig: { thinkingBudget: 0 } } : model.startsWith("gemini-3") ? { thinkingConfig: { thinkingLevel: "low" } } : {}),
          },
        }),
      }
    );
    if (r.ok) break;
    err = await r.text();
    console.log("gemini error", model, r.status, err.slice(0, 500));
    if (r.status !== 404 && r.status !== 429 && r.status < 500) break;
  }
  if (!r.ok) throw Object.assign(new Error("AI가 답을 못 했어요 (" + r.status + ")"), { status: r.status === 429 ? 429 : 502 });
  const data = await r.json();
  const out = (data?.candidates?.[0]?.content?.parts || []).filter(p => !p.thought).map(p => p.text || "").join("");
  let arr = [];
  try { arr = JSON.parse(out); } catch { arr = (out.match(/\d+/g) || []).map(Number); }
  return [...new Set(arr.map(Number).filter(n => askSet.has(n)))].sort((a, b) => a - b);
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url), origin = req.headers.get("origin") || "";
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS(origin) });
    if (url.pathname !== "/quote" || req.method !== "POST") return json({ error: "not found" }, 404, origin);
    if (origin && !ALLOWED_ORIGINS.includes(origin)) return json({ error: "forbidden" }, 403, origin);
    const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
    if (!(await canWrite(token))) return json({ error: "관리자 토큰이 필요해요" }, 401, origin);
    let body; try { body = await req.json(); } catch { return json({ error: "bad json" }, 400, origin); }
    const lines = Array.isArray(body?.lines) ? body.lines.map(x => String(x).slice(0, 2000)) : [];
    if (!lines.length) return json({ lines: [] }, 200, origin);
    if (lines.length > 800 || lines.join("").length > 80000) return json({ error: "글이 너무 길어요. 나눠서 해주세요." }, 413, origin);
    const ask = Array.isArray(body?.ask) ? body.ask.map(Number).filter(n => Number.isInteger(n) && n >= 1 && n <= lines.length) : null;
    try { return json({ lines: await findQuotes(env, lines, ask) }, 200, origin); }
    catch (e) { return json({ error: e.message }, e.status || 500, origin); }
  },
};
