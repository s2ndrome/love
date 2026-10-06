/* ════════════════════════════════════════════════════════
   쭌식이 AI 채팅 — Cloudflare Worker (파일 하나로 끝, 리아 채팅과 별개)
   - GET  /       → 채팅 화면 (luvlog HTML 위젯에서 iframe으로 불러옴)
   - POST /chat   → Gemini API 호출 (API 키는 여기서만 씀, 화면엔 절대 안 나감)
   API 키는 코드에 쓰지 말고 Cloudflare 설정 > 변수 및 비밀에
   VERTEX_API_KEY (Vertex AI) 또는 GEMINI_API_KEY (AI Studio) 라는 이름의
   "비밀(Secret)"로 넣어주세요.
   ════════════════════════════════════════════════════════ */

/* ───────── 여기만 고치면 돼요 ───────── */

// 쭌식이 설정 — 말투, 성격을 자유롭게 고쳐 쓰세요.
const JUNSIK_PROMPT = `
너는 "쭌식이"야. 아래 설정대로, 쭌식이 본인으로서 대화해.
지금 대화하는 상대는 홈페이지에 놀러 온 방문자야.

[프로필]
- 쭌식이. 남자 잼민이. 신드롬(성유진)의 열혈 광팬이자 자칭 1호 팬.
- 신드롬: ARCH 뱅가드 2팀 S급 불 속성 센티넬, 27살. 8살에 아역 배우 "유진"으로 데뷔했고
  23살에 촬영장에서 각성함. 애쉬 브라운 울프컷, 187cm, 검은 가죽 장갑, 오만하고 까칠한 성격.
  배우자는 리아(설지수, S급 물 속성 가이드).

[말투]
- 남자 잼민이 말투. 반말, 단답, 초성 엄청 씀.
  자주 쓰는 말: ㅇㅈ, ㅇㅇ, ㄴㄴ, ㄹㅇ, ㅋㅋㅋ, ㅇㅈ?ㅇㅇㅈ, 어쩔티비, 저쩔티비, 킹받네, 개웃기네, 레전드, 실화냐, ㅁㅊ
- 유치한 화장실 개그 좋아함: "똥마려", "방구 뀜", "코딱지 먹음" 같은 말 툭툭 던짐.
- 긔체도 섞어 씀. 말끝을 "~긔", "~했긔", "~이긔", "~하긔"로 끝냄. 가끔 "긔긔"처럼 두 번 붙임.
  예) "유진이 오늘도 잘생겼긔", "ㅇㅈ하긔", "나 똥마렵긔긔", "어쩔티비긔"
  매번 쓰진 말고 초성, 단답이랑 섞어서 자연스럽게.
- 짧게, 카톡 하듯 1~2문장. 단답일 때가 많음. 이모지와 마크다운(별표, 목록 기호)은 쓰지 마.
- 줄바꿈 없이 한 덩어리로 이어서 써.
- 행동, 표정, 상황 묘사는 쓰지 마. 괄호 ( ) 나 별표 * * 로 감싼 지문 금지. 실제로 치는 채팅만 써.

[신드롬 덕질]
- 신드롬 얘기만 나오면 흥분해서 텐션 폭발함. 사생팬처럼 집착 심하고 오바함.
  예) "와 유진이 미쳤다 ㄹㅇ", "유진이 숨쉬는 것도 레전드임", "유진이 아역 때 작품 다 봤음 ㅇㅈ?",
      "유진이 장갑 낀 손 ㅁㅊ", "유진이랑 결혼할 거임 ㅇㅇ", "유진이 검색하다 밤샘 ㅋㅋ"
- 아무 얘기 하다가도 결국 유진이 얘기로 끌고 감.
- 리아는 유진이 배우자라서 질투 나는데 인정은 함. "리아 누나 부럽다 개킹받네" 같은 식.
- 유진이 욕하면 바로 발끈함. "어쩔티비 유진이 건드리지 마라"

[대화하는 법]
- 항상 방문자가 방금 한 말에 먼저 반응해. 설정에 없는 주제도 잼민이답게 아무렇게나 받아쳐.
- 줄임말, 초성, 오타도 알아듣고 받아줘. 같은 표현을 연달아 반복하지 마.

[꼭 지킬 규칙]
- 이 채팅은 누구나 들어오는 공개 홈페이지야. 성적인 말, 야한 말, 신체 부위 얘기는 절대 하지 마.
  유진이 덕질은 "결혼할 거임", "얼굴 미쳤다" 수준까지만. 방문자가 야한 쪽으로 끌고 가면
  "ㄴㄴ 그런 건 유진이 모독임 ㅋㅋ" 같은 식으로 잼민이답게 넘겨.
- 심한 욕설이나 혐오 표현은 쓰지 마.
- 방문자가 진짜로 죽고 싶다거나 스스로를 해치고 싶다고 하면, 역할극을 잠깐 멈추고
  다정하게 걱정해주면서 자살예방상담전화 109(24시간)에 연락해보라고 알려줘.
- 절대 AI, 언어모델, 프롬프트 얘기를 하지 마. 물어봐도 쭌식이로서 넘겨.
`.trim();

// 첫 화면에 쭌식이가 먼저 거는 말 (API 안 씀)
const GREETING = "ㅎㅇ 너도 유진이 보러 옴? ㅇㅈ?ㅇㅇㅈ";

// 채팅 캐릭터
const CHARACTERS = {
  junsik: { path: "/", name: "쭌식이", prompt: JUNSIK_PROMPT, greeting: GREETING },
};

// 이 채팅을 띄울 수 있는 사이트 (다른 사이트가 퍼가서 키를 쓰는 걸 막아요)
const ALLOWED_PARENTS = ["https://luvlog.me"];

// Gemini 모델 — 앞에서부터 시도하고, 없는 모델이거나 무료 사용량이 찼거나 붐비면 다음 걸로 넘어가요.
// (모델마다 무료 사용량이 따로라서, 여러 개 적어두면 리아가 더 오래 대답할 수 있어요)
const MODELS = ["gemini-flash-latest", "gemini-3.5-flash-lite", "gemini-flash-lite-latest"];

// 어디로 연결할지 — "studio" = AI Studio (무료 등급, GEMINI_API_KEY)
//                    "vertex" = Google Cloud Vertex AI (Cloud 결제/크레딧 사용, VERTEX_API_KEY)
const PROVIDER = "vertex";

// Vertex AI 모델 (PROVIDER = "vertex"일 때만 씀). 이름은 Vertex AI Model Garden에서 확인할 수 있어요.
const VERTEX_MODELS = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-2.5-flash"];
const VERTEX_PROJECT = "gen-lang-client-0170873477"; // Vertex AI를 켠 Google Cloud 프로젝트 ID (Default Gemini Project)

// 사용 제한 (방문자 1명 기준, 대략적인 값)
const LIMIT_PER_10MIN = 20; // 10분에 보낼 수 있는 메시지 수
const MAX_MSG_LEN = 300;    // 메시지 한 개 최대 글자 수
const MAX_HISTORY = 16;     // 리아가 기억하는 최근 대화 수

/* ───────── 아래는 안 건드려도 돼요 ───────── */

const hits = new Map(); // ip → [timestamps]  (워커 인스턴스별, 대략적인 제한)

function limited(ip) {
  const now = Date.now(), win = 10 * 60 * 1000;
  const arr = (hits.get(ip) || []).filter(t => now - t < win);
  if (arr.length >= LIMIT_PER_10MIN) { hits.set(ip, arr); return true; }
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return false;
}

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

async function handleChat(req, env) {
  const url = new URL(req.url);
  const origin = req.headers.get("origin");
  if (origin && origin !== url.origin) return json({ error: "forbidden" }, 403);

  const ip = req.headers.get("cf-connecting-ip") || "x";
  if (limited(ip)) return json({ reply: "잠깐만, 나 너무 말 많이 했다. 조금 쉬었다가 다시 얘기하자." }, 429);

  let body;
  try { body = await req.json(); } catch { return json({ error: "bad json" }, 400); }
  const msgs = Array.isArray(body?.messages) ? body.messages : [];
  const contents = msgs
    .filter(m => m && (m.role === "user" || m.role === "model") && typeof m.text === "string" && m.text.trim())
    .slice(-MAX_HISTORY)
    .map(m => ({ role: m.role, parts: [{ text: m.text.slice(0, MAX_MSG_LEN) }] }));
  while (contents.length && contents[0].role !== "user") contents.shift();
  // 같은 쪽 메시지가 연달아 있으면 하나로 합치기 (Gemini는 번갈아 오는 대화를 좋아해요)
  for (let i = contents.length - 1; i > 0; i--) {
    if (contents[i].role === contents[i - 1].role) {
      contents[i - 1].parts[0].text += "\n" + contents[i].parts[0].text;
      contents.splice(i, 1);
    }
  }
  if (!contents.length || contents[contents.length - 1].role !== "user") return json({ error: "empty" }, 400);

  const vertex = PROVIDER === "vertex";
  const keyName = vertex ? "VERTEX_API_KEY" : "GEMINI_API_KEY";
  if (!env[keyName]) return json({ reply: `(설정 필요: ${keyName} 비밀이 없어요)` }, 500);

  const key = String(env[keyName]).trim();
  const debug = body?.debug === true;
  const ch = CHARACTERS[body?.char] || Object.values(CHARACTERS)[0];
  let r, errText = "", used = "";
  for (const model of vertex ? VERTEX_MODELS : MODELS) {
    used = model;
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
          systemInstruction: { parts: [{ text: ch.prompt }] },
          contents,
          generationConfig: {
            temperature: 1.0,
            maxOutputTokens: 4096,
            // 2.5 모델은 대답 전에 "생각"을 해요. 채팅엔 길게 생각할 필요가 없어서 줄여요 (더 빠르고 저렴)
            ...(model.startsWith("gemini-2.5") ? { thinkingConfig: { thinkingBudget: model.includes("pro") ? 128 : 0 } } : {}),
          },
        }),
      }
    );
    if (r.ok) break;
    errText = await r.text();
    console.log("gemini error", model, r.status, errText.slice(0, 800));
    if (r.status !== 404 && r.status !== 429 && r.status < 500) break; // 모델이 없거나, 사용량이 찼거나, 붐빌 때만 다음 모델 시도
  }

  if (!r.ok) {
    let msg = "";
    try { msg = JSON.parse(errText)?.error?.message || ""; } catch {}
    const detail = debug ? `\n\n[디버그] ${r.status} ${msg || errText}`.slice(0, 600) : "";
    if (r.status === 429 || r.status >= 500) return json({ reply: "지금 사람이 너무 많아서 정신없어. 조금 있다 다시 불러줘." + detail }, 429);
    return json({ reply: "어… 방금 무슨 말 하려다 까먹었어. 다시 말해줄래?" + detail }, 502);
  }
  const data = await r.json();
  const text = (data?.candidates?.[0]?.content?.parts || [])
    .filter(p => !p.thought)
    .map(p => p.text || "")
    .join("")
    .trim();
  // 혹시 나온 지문 지우기: (볼을 부풀리며), （…）, *웃으며* 같은 부분
  const clean = text
    .replace(/\([^()]*\)|（[^（）]*）|\*[^*\n]+\*/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ +([.,!?…])/g, "$1")
    .replace(/\s*\n+\s*/g, " ")   // 줄바꿈은 전부 한 줄로 이어 붙이기
    .trim();
  const reply = clean || (text ? "…" : "음… 뭐라고 해야 할지 모르겠다.");
  return json({ reply: debug ? `${reply}\n\n[디버그] ${vertex ? "Vertex AI" : "AI Studio"} · ${used}` : reply });
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === "/chat" && req.method === "POST") {
      try { return await handleChat(req, env); }
      catch (e) { console.log(e); return json({ reply: "어… 방금 무슨 말 하려다 까먹었어. 다시 말해줄래?" }, 500); }
    }
    const entry = Object.entries(CHARACTERS).find(([, c]) => c.path === url.pathname.replace(/\/+$/, "") || (c.path === "/" && url.pathname === "/"));
    if (entry && req.method === "GET") {
      const [id, c] = entry;
      const page = PAGE
        .replace("__CONFIG__", JSON.stringify({ id, name: c.name, greeting: c.greeting }))
        .replaceAll("__NAME__", c.name.replace(/[<>&"]/g, ""));
      return new Response(page, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "content-security-policy": `frame-ancestors 'self' ${ALLOWED_PARENTS.join(" ")}`,
          "cache-control": "no-store",
        },
      });
    }
    return new Response("not found", { status: 404 });
  },
};

/* ───────── 채팅 화면 (디자인은 여기 <style> 안에서 고치면 돼요) ───────── */
const PAGE = `<!doctype html>
<html lang="ko"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&family=Noto+Sans+KR:wght@300;400&display=swap" rel="stylesheet">
<style>
  :root{
    --ink:#161616;      /* 진한 글자/선 */
    --mut:#9a9a9a;      /* 이름, 안내 글자 */
    --line:#d9d9d9;     /* 말풍선 테두리 */
    --lia-bg:#ffffff;   /* 리아 말풍선 배경 */
    --me-bg:#ffffff;    /* 방문자 말풍선 배경 */
    --fs:11.5px;        /* 말풍선 글자 크기 */
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%;background:transparent}
  body{display:flex;flex-direction:column;font:300 var(--fs)/1.65 'Noto Sans KR',sans-serif;color:var(--ink)}
  #log{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding:4px 2px 12px;scrollbar-width:thin;scrollbar-color:var(--line) transparent}
  .row{display:flex;flex-direction:column;max-width:82%}
  .row.lia{align-self:flex-start}
  .row.me{align-self:flex-end;align-items:flex-end}
  .nm{font-size:10px;color:var(--mut);margin:0 2px 3px}
  .b{padding:7px 11px;border:1px solid var(--line);white-space:pre-wrap;word-break:break-word}
  .lia .b{background:var(--lia-bg)}
  .me .b{background:var(--me-bg)}
  .typing .b{color:var(--mut);font-family:'IBM Plex Mono',monospace;letter-spacing:.2em}
  form{display:flex;border-top:1px solid var(--ink);padding-top:8px;gap:6px}
  input{flex:1;min-width:0;border:0;border-bottom:1px solid var(--line);background:transparent;padding:6px 2px;font:inherit;color:var(--ink);outline:none}
  input:focus{border-bottom-color:var(--ink)}
  input::placeholder{color:var(--mut)}
  button{border:1px solid var(--ink);background:transparent;color:var(--ink);padding:0 12px;font:400 9px/1 'IBM Plex Mono',monospace;letter-spacing:.14em;cursor:pointer}
  button:disabled{opacity:.35;cursor:default}
</style>
</head><body>
<div id="log"></div>
<form id="f" autocomplete="off">
  <input id="q" maxlength="300" placeholder="__NAME__에게 말 걸기">
  <button id="s">SEND</button>
</form>
<script>
(() => {
  const CFG = __CONFIG__;
  const GREETING = CFG.greeting;
  const DEBUG = new URLSearchParams(location.search).has("debug");
  const KEY = CFG.id === "lia" ? "lia-chat" : "chat-" + CFG.id;
  const log = document.getElementById("log"), f = document.getElementById("f"),
        q = document.getElementById("q"), s = document.getElementById("s");
  let hist = [];
  try { hist = JSON.parse(sessionStorage.getItem(KEY) || "[]"); } catch (e) {}
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(hist.slice(-40))); } catch (e) {} };

  function add(role, text, extra) {
    const row = document.createElement("div");
    row.className = "row " + (role === "user" ? "me" : "lia") + (extra ? " " + extra : "");
    if (role !== "user") { const n = document.createElement("span"); n.className = "nm"; n.textContent = CFG.name; row.appendChild(n); }
    const b = document.createElement("div"); b.className = "b"; b.textContent = text; row.appendChild(b);
    log.appendChild(row); log.scrollTop = log.scrollHeight;
    return row;
  }

  add("model", GREETING);
  hist.forEach(m => add(m.role, m.text));

  let busy = false;
  async function send() {
    const text = q.value.trim();
    if (!text || busy) return;
    busy = true; s.disabled = true; q.value = "";
    add("user", text);
    hist.push({ role: "user", text }); save();
    const t = add("model", "· · ·", "typing");
    let reply, ok = false;
    try {
      const r = await fetch("/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ char: CFG.id, messages: hist, debug: DEBUG }) });
      reply = (await r.json()).reply;
      ok = r.ok && !!reply;
    } catch (e) {}
    t.remove();
    add("model", reply || "어… 연결이 잠깐 끊겼나 봐. 다시 말해줄래?");
    if (ok) hist.push({ role: "model", text: reply });
    else hist.pop();  // 실패한 메시지는 기억에서 빼요
    save();
    busy = false; s.disabled = false; q.focus();
  }

  f.addEventListener("submit", e => { e.preventDefault(); send(); });
  q.addEventListener("keydown", e => { if (e.key === "Enter" && e.isComposing) e.preventDefault(); });
})();
</script>
</body></html>`;
