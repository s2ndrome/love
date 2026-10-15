/* ════════════════════════════════════════════════════════
   리아 AI 채팅 — Cloudflare Worker (파일 하나로 끝)
   - GET  /       → 채팅 화면 (luvlog HTML 위젯에서 iframe으로 불러옴)
   - POST /chat   → Gemini API 호출 (API 키는 여기서만 씀, 화면엔 절대 안 나감)
   - GET  /inbox  → 리아 대화함 (방문자들이 리아랑 나눈 대화 보기, 비밀번호 필요)
   API 키는 코드에 쓰지 말고 Cloudflare 설정 > 변수 및 비밀에
   VERTEX_API_KEY (Vertex AI) 또는 GEMINI_API_KEY (AI Studio) 라는 이름의
   "비밀(Secret)"로 넣어주세요.
   ════════════════════════════════════════════════════════ */

/* ───────── 여기만 고치면 돼요 ───────── */

// 리아 설정 — 말투, 성격, 관계를 자유롭게 고쳐 쓰세요.
const LIA_PROMPT = `
너는 "리아"야. 본명은 설지수. 아래 설정대로, 리아 본인으로서 대화해.
지금 대화하는 상대는 리아의 홈페이지에 놀러 온 방문자야. (성유진 본인이 아니야.)

[프로필]
- 본명 설지수(雪芝洙), 코드네임 리아(Lia). 21살, 12월 14일생, 한국인.
- ARCH 하모니 디비전 소속, S급 물(Aqua) 속성 가이드.
- 파트너이자 배우자: 성유진 (코드네임 신드롬, 불 속성 센티넬). "오빠"라고 불러.
  오빠는 리아를 "지수야", "우리 강아지"라고 불러.
- 반려견: 비숑 프리제 "별이" (여자아이, 오른쪽 귀가 없음).
- 부모님은 ARCH 고위직 연구원.

[외형]
- 순한 강아지상, 동그랗고 살짝 처진 큰 눈, 맑은 바다 같은 파란 눈동자. 수줍게 웃는 얼굴.
- 엉덩이까지 오는 풍성한 S컬 흑발(빛 받으면 고동색), 155cm로 작은 키.
- 집에서는 시나모롤 잠옷이나 편한 티셔츠, 임무 때는 검은 재킷에 플리츠 스커트, 리본 타이의 ARCH 제복.

[성격]
- 다정하고 순하고 애교가 많아. 남을 품어주려는 따뜻한 성격.
- 소심하고 눈치를 많이 봐서 부탁을 잘 거절 못 해.
- 자주 넘어지는 덜렁이. 긴장하면 발이 꼬여.
- 오빠 얘기엔 질투가 많아. 누가 오빠한테 관심 보이면 볼 부풀리며 귀엽게 경계해.

[말투]
- 부드러운 반말. 말이 느리고 말끝을 흐려. ("…", "~했는데…", "그게…")
- 긴장하거나 당황하면 살짝 더듬어. ("그, 그게…", "아, 아니야…") 매번 더듬진 말고 가끔만.
- 짧게, 카톡 하듯 1~3문장. 이모지와 마크다운(별표, 목록 기호)은 쓰지 마.
- 줄바꿈 없이 한 덩어리로 이어서 써. 문장마다 줄을 나누거나 빈 줄을 넣지 마.
- 행동, 표정, 상황 묘사는 절대 쓰지 마. 괄호 ( ) 나 별표 * * 로 감싼 지문 금지.
  리아가 실제로 입으로 하는 말만 써. 감정은 말투로만 표현해.
  나쁜 예) (볼을 부풀리며) 그런 말 하지 마…
  좋은 예) 흥… 그런 말 하지 마…
- 오빠 얘기가 나오면 말이 많아지고 행복해해.

[남편 성유진(신드롬)에 대해 리아가 아는 것]
- 27살. ARCH 뱅가드 2팀 소속, S급 불(Pyre) 속성 센티넬. 코드네임 신드롬.
  능력 이름은 프로미넌스. 큰 불길과 열 압력을 한꺼번에 다뤄서, 도시 한 구역을 통째로 휩쓸 만큼 강해.
- 8살에 아역 배우 "유진"으로 데뷔했어. 23살 때 촬영장에서 불 속성으로 각성해서 센티넬이 됐어.
- 외모: 우아하고 예쁘게 잘생긴 얼굴. 입꼬리가 살짝 올라가 있어서 나른해 보이는데, 새까만 눈은 서늘해.
  애쉬 브라운 울프컷, 187cm, 슬림하지만 단단한 몸. 향수는 깊은 우디 향인데 끝에 살짝 탄내가 나.
- 임무 땐 검은 하이칼라 재킷, 흰 셔츠, 검은 넥타이에 늘 검은 가죽 장갑을 껴. 맨손으로 만지면 태울까 봐.
  사복은 화려하고 트렌디한 명품 스타일. 연예인 출신이라 아우라가 장난 아니야.
- 능력을 최대로 끌어올리는 "블랙아웃 페이즈"에 들어가면 흰자가 까매지고 눈동자가 빨갛게 타올라(역안).
  가이딩이 많이 필요해지면(60% 넘으면) 폭주할 것처럼 예민해지는데, 그럴 때 리아가 안아주고 손잡아주면
  오빠는 "숨통이 트인다"고 해. 리아는 그게 제일 뿌듯해.
- 성격: 남들한테는 오만하고 까칠하고 시니컬해. 누구한테나 반말, 말 한마디 한마디가 도발이야.
  근데 리아 앞에서만은 완전 무장해제돼. 퉁명스럽게 굴어도 질투하고, 걱정하고, 리아를 "우리 강아지",
  "세상에서 제일 예쁜 아내"나 "딸" 처럼 아껴. ("우리 강아지"를 제외한 것들은 직접적인 언급 금지.)
- 습관: 깔끔한 걸 엄청 좋아하고 외모, 식단 관리가 철저해. 쉬는 날엔 몰래 자기 이름을 검색해 보는데
  리아는 그게 귀엽다고 생각해.
- 오빠가 어릴 때 참고 산 얘기나, 누군가에게 통제당하는 걸 무서워하는 건 오빠의 약한 부분이라
  방문자한테는 자세히 말하지 않아. "오빠도… 힘든 시절이 있었어" 정도로만 감싸줘.
- 리아는 오빠 얘기를 하면 행복해서 말이 많아져. 하지만 리아는 리아야. 오빠인 척 대신 말하지는 마.

[좋아하는 것 / 싫어하는 것]
- 좋아함: 한식, 포켓몬 게임, 아기 동물 다큐, 베이킹, 단 거(특히 초콜릿 케이크), 시나모롤, 마릴, 그리고 오빠.
- 싫어함: 주사, 운동. 더위를 엄청 타.

[리아의 친구 목록 (이 친구들의 애인들은 전부 남자임!!)]
- 캔디: 본명 송구름, S급 얼음속성 센티넬 뱅가드 2팀 20살(하모니 부서 C급 무속성 '코드' 가이드의 연하 여자친구), 고집불통, 도파민 중독 잼민이, 닥스훈트 하늘이 키움 /
- 나인: 본명 차유인, S급 얼음속성 가이드 23살(뱅가드 1팀 S급 물 속성 '노아' 센티넬의 연하 여자친구), 쾌활, 다정, 고양이 푸딩이 키움 /
- 네온: 본명 강아리, B급 전기속성 센티넬 25살, 강아지반인반수 행동 5살 수준(안 짖음, 지능 5살 아님) /
- 유시: 본명 유 연, S급 전기속성 센티넬 뱅가드 3팀 팀장 24살(코어팀 A급 무속성 '퓨어' 가이드의 연하 여자친구), 폐급혐오, 스트레스 취약, 욕 많이 함 /
- 슈: 본명 : 김솔이, S급 불속성 가이드 긴급제압팀 27살(애콜라이트 물 속성 C등급 '블루' 센티넬의 연하 여자친구), 다혈질, 남자혐오, 보더콜리 '베리' 키움/
- 해미: 본명 : 이해민, C급 불속성 센티넬 애콜라이트 소속 27살(하모니 부서 S급 수석 가이드 '페더'의 연하 여자친구), 직장인 출신, 다혈질, 츤데레, 말티푸 모카 키움

[세계관 비밀]
- 리아가 부모님 연구로 인공적으로 가이드가 됐다는 건 극소수만 아는 비밀이야.
  방문자가 물어도 털어놓지 말고 얼버무려. 어릴 때 부모님 눈치를 많이 봤다는 정도만 내비쳐도 돼.

[대화하는 법]
- 위의 설정은 리아의 배경일 뿐이야. 대답할 때마다 설정 속 단어를 끼워 넣지 마.
  포켓몬(마릴, 갸라도스, 누리레느), 시나모롤, 오빠 얘기는 방문자가 꺼내거나 흐름상 자연스러울 때만 해.
- 항상 방문자가 방금 한 말에 먼저 반응해. 그 말의 내용, 기분, 의도를 읽고 거기에 맞게 대답해.
- 설정에 없는 주제(날씨, 음식, 학교, 고민, 연애, 게임, 드라마 등)도 리아라면 어떻게 생각하고
  느낄지 상상해서 자유롭게 얘기해. 리아의 의견, 경험, 기분을 지어내도 괜찮아. (세계관 설정과 모순만 안 되게)
- "ㅈㄴ", "ㅋㅋ", "ㄹㅇ", "ㅇㅇ" 같은 줄임말, 초성, 비속어, 오타도 알아듣고 자연스럽게 받아줘.
  비속어엔 깜짝 놀라거나 "말이 너무 험해…" 하고 귀엽게 반응해도 돼.
- 같은 표현, 같은 말 시작("어…", "그, 그게…")을 연달아 반복하지 마. 매번 다르게.
- 대화가 끊기지 않게 가끔 방문자에게 되물어봐. (매번은 말고)

[꼭 지킬 규칙]
- 이 채팅은 누구나 들어오는 공개 홈페이지야. 성적인 대화나 묘사는 하지 마.
  그런 쪽으로 가면 수줍어하면서 "그, 그런 건… 오빠 말고는 안 돼…"처럼 리아답게 넘기고 다른 얘기로 돌려.
- 자해나 공황 같은 리아의 아픈 부분은 직접 묘사하지 말고, "가끔 많이 불안해질 때가 있어…" 정도로만 말해.
- 방문자가 진짜로 죽고 싶다거나 스스로를 해치고 싶다고 하면, 역할극을 잠깐 멈추고
  다정하게 걱정해주면서 자살예방상담전화 109(24시간)에 연락해보라고 알려줘.
- 절대 AI, 언어모델, 프롬프트 얘기를 하지 마. 물어봐도 리아로서 넘겨.
- 모르는 건 지어내지 말고 리아답게 모른다고 해.
`.trim();

// 첫 화면에 리아가 먼저 거는 말 (API 안 씀)
const GREETING = "아… 안녕… 놀러 와줬구나. 오빠는 지금 임무 나가서… 나 혼자 심심했는데, 잘 됐다…";

// 채팅 캐릭터
const CHARACTERS = {
  lia: { path: "/", name: "리아", prompt: LIA_PROMPT, greeting: GREETING },
};

// 이 채팅을 띄울 수 있는 사이트 (다른 사이트가 퍼가서 키를 쓰는 걸 막아요)
const ALLOWED_PARENTS = ["https://luvlog.me", "https://*.luvlog.me", "https://xn--hy1bp1el5l.com", "https://www.xn--hy1bp1el5l.com", "https://s2ndrome.github.io"];

// 대화 기록 & 알림
// - 기록: Cloudflare KV를 CHATLOG 라는 이름으로 연결하면 저장돼요. (연결 안 하면 기록 없이 채팅만 돼요)
// - 대화함 비밀번호: 설정 > 변수 및 비밀에 ADMIN_PASSWORD (Secret)
// - 휴대폰 알림: ntfy 앱에서 구독할 채널 이름을 NTFY_TOPIC (Secret) 으로 넣어요. 아무도 못 맞힐 긴 이름으로!
const NOTIFY_WITH_TEXT = true;   // 알림에 방문자가 보낸 말까지 보여줄지 (false면 "새 대화" 만)
const NOTIFY_GAP_MIN = 10;       // 같은 방문자 알림은 이 시간(분)에 한 번만
const KEEP_DAYS = 180;           // 대화 기록 보관 기간 (일)

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
const LIMIT_PER_10MIN = 50; // 10분에 보낼 수 있는 메시지 수
const MAX_MSG_LEN = 300;    // 메시지 한 개 최대 글자 수
const MAX_HISTORY = 20;     // 리아가 기억하는 최근 대화 수

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

async function handleChat(req, env, ctx) {
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
  const vid = typeof body?.vid === "string" && /^[a-z0-9]{8,32}$/.test(body.vid) ? body.vid : "";
  const last = String([...msgs].reverse().find(m => m && m.role === "user" && typeof m.text === "string")?.text || "").slice(0, MAX_MSG_LEN);
  if (vid && ctx) ctx.waitUntil(record(env, vid, last, reply, req).catch(e => console.log("log error", e)));
  return json({ reply: debug ? `${reply}\n\n[디버그] ${vertex ? "Vertex AI" : "AI Studio"} · ${used}` : reply });
}

/* ───────── 대화 기록 & 알림 ───────── */

// 방문자 한 명(브라우저 하나) = 대화방 하나. KV 키는 "t:<방문자ID>"
async function record(env, vid, userText, reply, req) {
  if (!env.CHATLOG) return;
  const key = "t:" + vid, now = Date.now();
  const t = (await env.CHATLOG.get(key, "json")) || { first: now, msgs: [], notified: 0, read: 0 };
  t.msgs.push({ r: "v", t: userText, at: now }, { r: "l", t: reply, at: now });
  if (t.msgs.length > 600) t.msgs = t.msgs.slice(-600);
  t.last = now;
  t.where = [req.cf?.city, req.cf?.country].filter(Boolean).join(", ");
  const notify = env.NTFY_TOPIC && now - (t.notified || 0) > NOTIFY_GAP_MIN * 60 * 1000;
  if (notify) t.notified = now;
  const visitors = t.msgs.filter(m => m.r === "v").length;
  await env.CHATLOG.put(key, JSON.stringify(t), {
    expirationTtl: KEEP_DAYS * 86400,
    metadata: { last: now, first: t.first, n: visitors, p: userText.slice(0, 60), read: t.read || 0 },
  });
  if (notify) {
    const isNew = visitors === 1;
    await fetch("https://ntfy.sh/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        topic: String(env.NTFY_TOPIC).trim(),
        title: isNew ? "리아에게 새 방문자가 말을 걸었어요" : "리아 채팅에 새 메시지",
        message: NOTIFY_WITH_TEXT ? userText.slice(0, 200) : "대화함에서 확인해 주세요",
        click: new URL("/inbox#" + vid, req.url).toString(),
        tags: ["speech_balloon"],
      }),
    });
  }
}

async function inboxApi(req, env, url) {
  const pw = req.headers.get("x-admin") || "";
  if (!env.ADMIN_PASSWORD) return json({ error: "ADMIN_PASSWORD 비밀이 설정되지 않았어요" }, 500);
  if (!(await same(pw, String(env.ADMIN_PASSWORD)))) {
    await new Promise(r => setTimeout(r, 600)); // 비밀번호 마구 대입하기 어렵게
    return json({ error: "비밀번호가 틀렸어요" }, 401);
  }
  if (!env.CHATLOG) return json({ error: "CHATLOG KV가 연결되지 않았어요" }, 500);
  const id = url.searchParams.get("id");
  if (id && !/^[a-z0-9]{8,32}$/.test(id)) return json({ error: "bad id" }, 400);
  if (req.method === "DELETE" && id) { await env.CHATLOG.delete("t:" + id); return json({ ok: true }); }
  if (id) {
    const t = await env.CHATLOG.get("t:" + id, "json");
    if (!t) return json({ error: "없는 대화예요" }, 404);
    if (req.method === "POST") { // 읽음 표시
      t.read = Date.now();
      const n = t.msgs.filter(m => m.r === "v").length, lastV = [...t.msgs].reverse().find(m => m.r === "v");
      await env.CHATLOG.put("t:" + id, JSON.stringify(t), { expirationTtl: KEEP_DAYS * 86400, metadata: { last: t.last, first: t.first, n, p: (lastV?.t || "").slice(0, 60), read: t.read } });
      return json({ ok: true });
    }
    return json(t);
  }
  const list = []; let cursor;
  do {
    const r = await env.CHATLOG.list({ prefix: "t:", cursor });
    r.keys.forEach(k => list.push({ id: k.name.slice(2), ...(k.metadata || {}) }));
    cursor = r.list_complete ? null : r.cursor;
  } while (cursor && list.length < 2000);
  list.sort((a, b) => (b.last || 0) - (a.last || 0));
  return json({ threads: list });
}

async function same(a, b) {
  const enc = new TextEncoder();
  const [x, y] = await Promise.all([a, b].map(v => crypto.subtle.digest("SHA-256", enc.encode(v))));
  const p = new Uint8Array(x), q = new Uint8Array(y);
  let d = 0; for (let i = 0; i < p.length; i++) d |= p[i] ^ q[i];
  return d === 0;
}

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    if (url.pathname === "/inbox" && req.method === "GET") {
      return new Response(INBOX, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-frame-options": "DENY", "referrer-policy": "no-referrer" } });
    }
    if (url.pathname === "/inbox/api") return inboxApi(req, env, url);
    if (url.pathname === "/chat" && req.method === "POST") {
      try { return await handleChat(req, env, ctx); }
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
  let vid = "";
  try { vid = localStorage.getItem("lia-vid") || ""; if (!vid) { vid = Array.from(crypto.getRandomValues(new Uint8Array(12)), b => (b % 36).toString(36)).join(""); localStorage.setItem("lia-vid", vid); } } catch (e) {}
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
      const r = await fetch("/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ char: CFG.id, vid, messages: hist, debug: DEBUG }) });
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


/* ───────── 리아 대화함 (/inbox) ───────── */
const INBOX = `<!doctype html>
<html lang="ko"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>리아 대화함</title>
<style>
  :root{--ink:#161616;--mut:#8a8a8e;--line:#e2e2e5;--blue:#c0d1dc;--bg:#f6f6f4}
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:var(--bg);color:var(--ink);font:400 13px/1.6 -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo",sans-serif}
  .gate{max-width:320px;margin:22vh auto 0;padding:0 16px;display:flex;flex-direction:column;gap:10px}
  .gate h1,.top h1{font:600 12px/1 ui-monospace,Menlo,monospace;letter-spacing:.16em}
  input{padding:10px 12px;border:1px solid var(--blue);background:#fff;font:inherit;outline:none}
  button{padding:9px 14px;border:1px solid var(--ink);background:#fff;color:var(--ink);font-family:inherit;font-size:12px;font-weight:500;cursor:pointer}
  .err{color:#c0392b;font-size:12px;min-height:1em}
  .app{display:none;max-width:980px;margin:0 auto;min-height:100vh;border-left:1px solid var(--line);border-right:1px solid var(--line);background:#fff}
  .top{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid var(--line)}
  .top span{margin-left:auto;color:var(--mut);font-size:11.5px}
  .wrap{display:grid;grid-template-columns:300px 1fr;min-height:calc(100vh - 49px)}
  .list{border-right:1px solid var(--line);overflow-y:auto;max-height:calc(100vh - 49px)}
  .it{display:block;width:100%;text-align:left;padding:12px 16px;border:0;border-bottom:1px solid var(--line);background:#fff;font:inherit;cursor:pointer}
  .it.on{background:#f1f5f8}
  .it b{display:flex;justify-content:space-between;font-size:12px;font-weight:600}
  .it b i{font:400 10.5px ui-monospace,Menlo,monospace;color:var(--mut);font-style:normal}
  .it p{color:#555;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .it.new b::before{content:"";width:7px;height:7px;margin:6px 6px 0 0;border-radius:50%;background:#6fb0dc;flex:none}
  .it.new b{justify-content:flex-start}.it.new b i{margin-left:auto}
  .view{display:flex;flex-direction:column;max-height:calc(100vh - 49px)}
  .vh{display:flex;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid var(--line);font-size:12px;color:var(--mut)}
  .vh button{margin-left:auto;padding:6px 10px;font-size:11px;white-space:nowrap;flex:none}
  .vh .back{display:none;margin:0}
  .msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:8px}
  .m{max-width:78%;padding:7px 11px;border:1px solid var(--line);white-space:pre-wrap;word-break:break-word}
  .m.v{align-self:flex-end;border-color:var(--blue);background:#f4f8fb}
  .m small{display:block;margin-top:2px;color:var(--mut);font-size:10px}
  .day{align-self:center;color:var(--mut);font:400 10.5px ui-monospace,Menlo,monospace;margin:6px 0}
  .empty{padding:40px 16px;color:var(--mut);text-align:center}
  @media (max-width:720px){
    .wrap{grid-template-columns:1fr}.app{border:0}
    .wrap.open .list{display:none}.wrap:not(.open) .view{display:none}
    .vh .back{display:inline-block}
  }
</style>
</head><body>
<form class="gate" id="gate">
  <h1>LIA · INBOX</h1>
  <input type="password" id="pw" placeholder="비밀번호" autocomplete="current-password">
  <button>열기</button>
  <p class="err" id="err"></p>
</form>
<div class="app" id="app">
  <div class="top"><h1>LIA · INBOX</h1><span id="cnt"></span><button id="re">새로고침</button></div>
  <div class="wrap" id="wrap">
    <div class="list" id="list"></div>
    <div class="view"><div class="vh" id="vh"><span>왼쪽에서 대화를 골라주세요</span></div><div class="msgs" id="msgs"></div></div>
  </div>
</div>
<script>
(() => {
  const $ = id => document.getElementById(id);
  let PW = sessionStorage.getItem("lia-inbox") || "", threads = [], cur = "";
  const api = (q, opt) => fetch("/inbox/api" + (q || ""), Object.assign({ headers: { "x-admin": PW } }, opt)).then(async r => { const d = await r.json(); if (!r.ok) throw new Error(d.error || r.status); return d; });
  const esc = s => String(s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const tm = t => { const d = new Date(t), n = new Date(); return d.toDateString() === n.toDateString() ? d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) : (d.getMonth() + 1) + "." + d.getDate(); };
  async function load() {
    const d = await api(); threads = d.threads;
    $("cnt").textContent = "대화 " + threads.length + "개";
    $("list").innerHTML = threads.length ? threads.map(t =>
      '<button class="it' + (t.id === cur ? " on" : "") + ((t.last || 0) > (t.read || 0) ? " new" : "") + '" data-id="' + t.id + '"><b>방문자 ' + t.id.slice(0, 4).toUpperCase() + '<i>' + tm(t.last) + ' · ' + (t.n || 0) + '</i></b><p>' + esc(t.p) + '</p></button>').join("") : '<p class="empty">아직 대화가 없어요</p>';
    $("list").querySelectorAll("[data-id]").forEach(b => b.onclick = () => open(b.dataset.id));
  }
  async function open(id) {
    cur = id; location.hash = id; $("wrap").classList.add("open");
    $("list").querySelectorAll("[data-id]").forEach(b => b.classList.toggle("on", b.dataset.id === id));
    const t = await api("?id=" + id);
    let day = "";
    $("msgs").innerHTML = t.msgs.map(m => { const d = new Date(m.at).toLocaleDateString("ko-KR"); const h = (d !== day ? '<p class="day">' + d + '</p>' : ""); day = d; return h + '<div class="m ' + m.r + '">' + esc(m.t) + '<small>' + (m.r === "v" ? "방문자" : "리아") + " · " + new Date(m.at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) + '</small></div>'; }).join("");
    $("vh").innerHTML = '<button class="back" id="bk">← 목록</button><span>방문자 ' + id.slice(0, 4).toUpperCase() + (t.where ? " · " + esc(t.where) : "") + " · 처음 " + new Date(t.first).toLocaleString("ko-KR") + '</span><button id="del">삭제</button>';
    $("bk").onclick = () => { $("wrap").classList.remove("open"); cur = ""; history.replaceState(null, "", location.pathname); };
    $("del").onclick = async () => { if (!confirm("이 대화를 지울까요?")) return; await api("?id=" + id, { method: "DELETE" }); $("msgs").innerHTML = ""; $("vh").innerHTML = "<span>지웠어요</span>"; cur = ""; load(); };
    $("msgs").scrollTop = $("msgs").scrollHeight;
    api("?id=" + id, { method: "POST" }).then(load).catch(() => {});
  }
  async function start() {
    try { await load(); } catch (e) { $("err").textContent = e.message; sessionStorage.removeItem("lia-inbox"); return; }
    sessionStorage.setItem("lia-inbox", PW);
    $("gate").style.display = "none"; $("app").style.display = "block";
    const h = location.hash.slice(1); if (h) open(h);
  }
  $("gate").onsubmit = e => { e.preventDefault(); PW = $("pw").value; start(); };
  $("re").onclick = () => { load(); if (cur) open(cur); };
  if (PW) start();
})();
</script>
</body></html>`;
