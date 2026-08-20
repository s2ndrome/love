const menuLayer = document.getElementById("menuLayer");
const contentLayer = document.getElementById("contentLayer");
const openMenu = document.getElementById("openMenu");
const contentTitle = document.getElementById("contentTitle");
const contentBody = document.getElementById("contentBody");
const backToMenu = document.getElementById("backToMenu");

const pages = {
  about: {
    title: "About",
    html: `
      <div class="feed-card">
        <div class="card-header"><span class="card-icon">•</span><span class="card-title">Intro</span></div>
        <section class="intro-card">
          <div class="fake-photo">YOUR<br>PHOTO</div>
          <div>
            <h2>hello, little visitor</h2>
            <p>여기는 나의 작은 인터넷 공간입니다. 좋아하는 것, 만든 것, 기록하고 싶은 것들을 천천히 모아두고 있어요.</p>
            <p>아직 준비 중인 페이지가 많지만, 이곳을 나만의 아카이브처럼 채워갈 예정이에요.</p>
            <div class="info-list">
              NAME : YOUR NAME<br>
              SINCE : 2026<br>
              FAVORITE : pink, ribbons, tiny things
            </div>
          </div>
        </section>
      </div>

      <div class="feed-card playlist-card">
        <div class="card-header"><span class="card-icon">•</span><span class="card-title">Playlist</span></div>
        <div class="track-thumb">▶</div>
        <ul class="track-list">
          <li><span class="track-num">01</span>song title one</li>
          <li><span class="track-num">02</span>song title two</li>
          <li><span class="track-num">03</span>song title three</li>
        </ul>
      </div>
    `
  },

  characters: {
    title: "Characters",
    html: `
      <div class="feed-card">
        <div class="card-header"><span class="card-icon">•</span><span class="card-title">Cast</span></div>
        <div class="character-grid">
          <article class="character-card">
            <div class="fake-photo">CHARACTER<br>01</div>
            <h3>Character One</h3>
            <p>간단한 캐릭터 소개를 적는 공간.</p>
          </article>
          <article class="character-card">
            <div class="fake-photo">CHARACTER<br>02</div>
            <h3>Character Two</h3>
            <p>성격, 설정, 관계 등을 적어주세요.</p>
          </article>
          <article class="character-card">
            <div class="fake-photo">CHARACTER<br>03</div>
            <h3>Character Three</h3>
            <p>나중에 노션 데이터로 교체할 예정.</p>
          </article>
        </div>
      </div>
    `
  },

  gallery: {
    title: "Gallery",
    html: `
      <div class="feed-card">
        <div class="card-header"><span class="card-icon">•</span><span class="card-title">Snapshots</span></div>
        <div class="gallery-grid">
          <div class="gallery-item">IMAGE 01</div>
          <div class="gallery-item">IMAGE 02</div>
          <div class="gallery-item">IMAGE 03</div>
          <div class="gallery-item">IMAGE 04</div>
          <div class="gallery-item">IMAGE 05</div>
          <div class="gallery-item">IMAGE 06</div>
        </div>
        <p style="margin-top:18px;text-align:center;font-size:10px;">이미지만 추가하면 갤러리로 바로 사용할 수 있어요</p>
      </div>
    `
  },

  world: {
    title: "World",
    html: `
      <div class="feed-card">
        <div class="card-header"><span class="card-icon">•</span><span class="card-title">Setting</span></div>
        <article class="world-entry" style="border:0;margin:0;padding:0;background:transparent;">
          <p>세계관의 기본 설정을 적는 공간입니다.</p>
          <p>지역 · 조직 · 사건 · 역사 · 용어집 등을 이곳에 쌓아갈 수 있어요.</p>
        </article>
      </div>
      <div class="feed-card">
        <div class="card-header"><span class="card-icon">•</span><span class="card-title">Index</span></div>
        <article class="world-entry" style="border:0;margin:0;padding:0;background:transparent;">
          <p>01. Setting</p>
          <p>02. Organizations</p>
          <p>03. Characters</p>
          <p>04. Timeline</p>
        </article>
      </div>
    `
  },

  guestbook: {
    title: "Guestbook",
    html: `
      <div class="feed-card">
        <div class="card-header"><span class="card-icon">•</span><span class="card-title">Guestbook</span></div>
        <article class="guestbook-entry" style="border:0;margin:0 0 10px;padding:0;background:transparent;">
          <strong>mocha</strong>
          <p>사이트 너무 귀여워요</p>
        </article>
        <article class="guestbook-entry" style="border:0;margin:0;padding:0;background:transparent;">
          <strong>ribbon</strong>
          <p>다녀갑니다</p>
        </article>
        <p style="text-align:center;margin-top:22px;font-size:10px;">방명록 기능은 나중에 외부 서비스나 별도 DB와 연결할 수 있어요.</p>
      </div>
    `
  }
};

const noteIconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>`;

const diaryEntries = [
  {
    id: "2026",
    label: "2026",
    html: `
      <p>하루치요랑 마린 서로 부양욕 있어서 서로가 보호자라고 생각할 것 같다 … ~
하루치요 &gt; 마린 : 지켜줘야 하는 여자친구
마린 &gt; 하루치요 : 보듬어줘야 하는 남자친구
근데 또 서로한테 나데나데 받는 거 좋아해서 서로 속으로 역시 나는 너 없으면 안 돼! 이러고 있을 것 같음</p>
      <div class="diary-dots">• &nbsp; • &nbsp; •</div>
      <p>하루치요 퇴근하고 마린한테 재킷 벗어서 넘겨주며 오늘 회사에서 이런 새끼가 이러이러한 폐급짓해서 종일 짜증 났다는 둥의 하루 일과 얘기해 주면 마린 갑자기 엄마 모드 발동함 [뭐어? 그 사람이 하루치요한테 그랬어? 진짜 나쁘다! 나중에 내가 도시락 싸서 갈 때 뭐라 말 좀 해줄까?! 그 사람 어떻게 생겼어] 순해 빠진 얼굴 주제에 나름 화낸다며 찌푸리고 대체 하루치요한테 누가 그랬냐며 자기가 따끔하게 말 좀 해주겠다고 나서면 하루치요 어이없고 웃겨서 네가 잘도 그러겠다 하고 넘기는데 며칠 뒤에 진짜 마린이 하루치요 회사에 도시락 주러 가서 폐급 부하 마주하게 됨 [어이, 마린. 저 새끼가 며칠 전에 얘기한 그 새끼야.] 하루치요 일부러 옆에서 이러면 마린 진짜 벌벌 떨면서 당황하고 갑자기 무서워져서 앞에 있는 폐급부하 눈도 못 마주침 [아, 어..... 앗, 그게 에... 안녕하세요오......] 이러고 냅다 하루치요 뒤에 숨어서 고개만 빼꼼 나와서 인사함 (하루치요 : 얼탱)</p>
      <div class="diary-dots">• &nbsp; • &nbsp; •</div>
      <p>캣초딩 시절 하루치요 너무 귀여워서 맨날 놀려주고 싶어 ㅠ.ㅠ 만약 마린이 옆집 누나였으면 답지 않은 오지랖 부려가며 며칠 전에 집 앞에 찾아온 그 자식은 뭐냐고 따져 묻고 정말 네 따위를 (절대 누나라고 하지 않음) 좋아하는 거냐 그 자식 눈 돌아간 거 아니냐 등등 악담 퍼붓는데 사실 진짜 눈 돌아간 거 본인임. 아침마다 계단에서 자꾸 넘어지는 것도, 하루치요가 평소 먹지도 않는 쿠키 구워서 갖다 주는 모습도 전부 한심했는데 이제는 전부 귀여워 보이고 이제 저 멍청한 여자는 자신이 옆에 없으면 도대체 어떻게 살아갈까 싶음 (나름 잘 살음) 마린은 그냥 남동생 보는 기분으로 챙겨준 건데 점점 남자처럼 구는 하루치요 모습에 기분 이상해질 것 같고 … 그런 기분이 드는 자신에게 죄책감 들 것 같고 … ~~ 결국 본인은 더 삐뚤어져서 관동만지회 들어가고 마린은 졸업하고 먼 곳으로 대학교 입학한다고 하니까 냅다 고백 공격 갈겨서 그 여자 아무데도 못 가게 할 것 같으네 후후</p>
      <p class="diary-note-gap">연하 마린은 절대 생각이 나지 않는다 … 왜냐면 이 여자는 30대 아주머니 되어서도 남자에게 아양을 부리기 때문이다 .
나잇값 영원히 못 하는 아주머니가 될테야</p>
    `
  },
  { id: "2025-11", label: "2025.11 ~ 2025.12", html: null },
  { id: "2025-09", label: "2025.09 ~ 2025.10", html: null },
  { id: "2025-07", label: "2025.07 ~ 2025.08", html: null },
  { id: "2025-05", label: "2025.05 ~ 2025.06", html: null },
  { id: "2025-03", label: "2025.03 ~ 2025.04", html: null }
];

let diaryDetailOpen = false;

function renderDiaryList() {
  diaryDetailOpen = false;
  contentTitle.textContent = "Diary";
  contentBody.innerHTML = `
    <nav class="diary-list">
      ${diaryEntries.map(entry => `<button data-diary="${entry.id}">${entry.label}</button>`).join("")}
    </nav>
  `;

  contentBody.querySelectorAll("[data-diary]").forEach(button => {
    button.addEventListener("click", () => {
      const entry = diaryEntries.find(item => item.id === button.dataset.diary);
      if (entry) renderDiaryDetail(entry);
    });
  });
}

function renderDiaryDetail(entry) {
  diaryDetailOpen = true;
  contentBody.innerHTML = `
    <div class="diary-note">
      <span class="diary-note-date">${entry.label}</span>
      <div class="diary-note-body">
        ${entry.html || `<p style="text-align:center;color:#c7c7cc;">아직 작성된 기록이 없어요.</p>`}
      </div>
      <div class="diary-note-compose">
        <span class="diary-note-cursor">|</span>
        <span class="diary-note-icon">${noteIconSvg}</span>
      </div>
    </div>
  `;
}

function openLayer(layer) {
  layer.classList.add("active");
  layer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLayer(layer) {
  layer.classList.remove("active");
  layer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

openMenu.addEventListener("click", () => openLayer(menuLayer));

document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", () => {
    if (button.dataset.page === "diary") {
      renderDiaryList();
      closeLayer(menuLayer);
      openLayer(contentLayer);
      return;
    }

    const page = pages[button.dataset.page];
    if (!page) return;

    diaryDetailOpen = false;
    contentTitle.textContent = page.title;
    contentBody.innerHTML = page.html;

    closeLayer(menuLayer);
    openLayer(contentLayer);
  });
});

backToMenu.addEventListener("click", () => {
  if (diaryDetailOpen) {
    renderDiaryList();
    return;
  }

  closeLayer(contentLayer);
  openLayer(menuLayer);
});

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => {
    closeLayer(document.getElementById(button.dataset.close));
  });
});

[menuLayer, contentLayer].forEach(layer => {
  layer.addEventListener("click", event => {
    if (event.target === layer) closeLayer(layer);
  });
});

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;

  if (contentLayer.classList.contains("active")) {
    if (diaryDetailOpen) {
      renderDiaryList();
      return;
    }
    closeLayer(contentLayer);
    openLayer(menuLayer);
  } else if (menuLayer.classList.contains("active")) {
    closeLayer(menuLayer);
    openMenu.focus();
  }
});

/* menu bar live clock */
function updateMenubarClock() {
  const el = document.getElementById("menubarClock");
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleString("ko-KR", {
    weekday: "short",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

updateMenubarClock();
setInterval(updateMenubarClock, 1000 * 15);
