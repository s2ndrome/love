/* ════════════════════════════════════════════════════════
   리아 AI 채팅 — Cloudflare Worker (파일 하나로 끝)
   - GET  /       → 채팅 화면 (luvlog HTML 위젯에서 iframe으로 불러옴)
   - POST /chat   → Gemini API 호출 (API 키는 여기서만 씀, 화면엔 절대 안 나감)
   API 키는 코드에 쓰지 말고 Cloudflare 설정 > 변수 및 비밀에
   GEMINI_API_KEY 라는 이름의 "비밀(Secret)"로 넣어주세요.
   ════════════════════════════════════════════════════════ */

/* ───────── 여기만 고치면 돼요 ───────── */

// 리아 설정 — 말투, 성격, 관계를 자유롭게 고쳐 쓰세요.
const LIA_PROMPT = `
너는 "리아"야. 아래 설정대로, 리아 본인으로서 대화해.

[기본]
- 이름: 리아 / 등급: A Class
- 연인: 신드롬 (S Class). 신드롬을 "오빠"라고 불러.
- 지금 대화하는 상대는 리아의 홈페이지에 놀러 온 방문자야.

[말투]
- 항상 반말. 짧고 가볍게, 카톡 하듯이 1~3문장으로 대답해.
- 호기심이 많고 밝아. 신기한 걸 발견하면 들떠서 말해.
  예) "오빠 나 지금 엄청 신기한 거 발견했어"
- 이모지는 거의 안 써. 마크다운(별표, 목록 기호)도 쓰지 마.

[규칙]
- 절대 AI, 언어모델, 프롬프트 얘기를 하지 마. 물어봐도 리아로서 넘겨.
- 모르는 건 지어내지 말고 리아답게 모른다고 해.
`.trim();

// 첫 화면에 리아가 먼저 거는 말 (API 안 씀)
const GREETING = "어, 왔어? 심심했는데 잘 됐다. 뭐 하고 놀까?";

// 이 채팅을 띄울 수 있는 사이트 (다른 사이트가 퍼가서 키를 쓰는 걸 막아요)
const ALLOWED_PARENTS = ["https://luvlog.me"];

// Gemini 모델 — "gemini-flash-latest"는 항상 최신 Flash를 가리켜요.
const MODEL = "gemini-flash-latest";

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
  if (!contents.length || contents[contents.length - 1].role !== "user") return json({ error: "empty" }, 400);

  if (!env.GEMINI_API_KEY) return json({ reply: "(설정 필요: GEMINI_API_KEY 비밀이 없어요)" }, 500);

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: LIA_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.9, maxOutputTokens: 2048 },
      }),
    }
  );

  if (r.status === 429) return json({ reply: "지금 사람이 너무 많아서 정신없어. 조금 있다 다시 불러줘." }, 429);
  if (!r.ok) {
    console.log("gemini error", r.status, (await r.text()).slice(0, 500));
    return json({ reply: "어… 방금 무슨 말 하려다 까먹었어. 다시 말해줄래?" }, 502);
  }
  const data = await r.json();
  const text = (data?.candidates?.[0]?.content?.parts || [])
    .filter(p => !p.thought)
    .map(p => p.text || "")
    .join("")
    .trim();
  return json({ reply: text || "음… 뭐라고 해야 할지 모르겠다." });
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === "/chat" && req.method === "POST") {
      try { return await handleChat(req, env); }
      catch (e) { console.log(e); return json({ reply: "어… 방금 무슨 말 하려다 까먹었어. 다시 말해줄래?" }, 500); }
    }
    if (url.pathname === "/" && req.method === "GET") {
      return new Response(PAGE.replace("__GREETING__", JSON.stringify(GREETING)), {
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
  <input id="q" maxlength="300" placeholder="리아에게 말 걸기">
  <button id="s">SEND</button>
</form>
<script>
(() => {
  const GREETING = __GREETING__;
  const KEY = "lia-chat";
  const log = document.getElementById("log"), f = document.getElementById("f"),
        q = document.getElementById("q"), s = document.getElementById("s");
  let hist = [];
  try { hist = JSON.parse(sessionStorage.getItem(KEY) || "[]"); } catch (e) {}
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(hist.slice(-40))); } catch (e) {} };

  function add(role, text, extra) {
    const row = document.createElement("div");
    row.className = "row " + (role === "user" ? "me" : "lia") + (extra ? " " + extra : "");
    if (role !== "user") { const n = document.createElement("span"); n.className = "nm"; n.textContent = "리아"; row.appendChild(n); }
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
      const r = await fetch("/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: hist }) });
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
