const menuLayer = document.getElementById("menuLayer");
const contentLayer = document.getElementById("contentLayer");
const openMenu = document.getElementById("openMenu");
const contentTitle = document.getElementById("contentTitle");
const contentBody = document.getElementById("contentBody");
const backToMenu = document.getElementById("backToMenu");

const pages = {
  about: {
    title: "ABOUT",
    html: `
      <div class="feed-card">
        <div class="card-header"><span class="card-icon">♡</span><span class="card-title">INTRO</span></div>
        <section class="intro-card">
          <div class="fake-photo">YOUR<br>PHOTO</div>
          <div>
            <h2>hello, little visitor ♡</h2>
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
        <div class="card-header"><span class="card-icon">✧</span><span class="card-title">PLAYLIST</span></div>
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
    title: "CHARACTERS",
    html: `
      <div class="feed-card">
        <div class="card-header"><span class="card-icon">✦</span><span class="card-title">CAST</span></div>
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
    title: "GALLERY",
    html: `
      <div class="feed-card">
        <div class="card-header"><span class="card-icon">♡</span><span class="card-title">SNAPSHOTS</span></div>
        <div class="gallery-grid">
          <div class="gallery-item">IMAGE 01</div>
          <div class="gallery-item">IMAGE 02</div>
          <div class="gallery-item">IMAGE 03</div>
          <div class="gallery-item">IMAGE 04</div>
          <div class="gallery-item">IMAGE 05</div>
          <div class="gallery-item">IMAGE 06</div>
        </div>
        <p style="margin-top:18px;text-align:center;font-size:10px;">이미지만 추가하면 갤러리로 바로 사용할 수 있어요 ♡</p>
      </div>
    `
  },

  diary: {
    title: "DIARY",
    html: `
      <div class="feed-card">
        <div class="card-header"><span class="card-icon">✧</span><span class="card-title">2026.08.20</span></div>
        <article class="diary-entry" style="border:0;margin:0;padding:0;background:transparent;">
          <h2>welcome to my diary</h2>
          <p>첫 번째 기록. 앞으로 이 부분은 노션에서 작성한 일기를 자동으로 가져오도록 만들 수 있어요.</p>
        </article>
      </div>
      <div class="feed-card">
        <div class="card-header"><span class="card-icon">✧</span><span class="card-title">2026.08.18</span></div>
        <article class="diary-entry" style="border:0;margin:0;padding:0;background:transparent;">
          <h2>little things</h2>
          <p>좋아하는 것과 하루의 작은 순간들을 기록하는 공간.</p>
        </article>
      </div>
    `
  },

  world: {
    title: "WORLD",
    html: `
      <div class="feed-card">
        <div class="card-header"><span class="card-icon">♡</span><span class="card-title">SETTING</span></div>
        <article class="world-entry" style="border:0;margin:0;padding:0;background:transparent;">
          <p>세계관의 기본 설정을 적는 공간입니다.</p>
          <p>지역 · 조직 · 사건 · 역사 · 용어집 등을 이곳에 쌓아갈 수 있어요.</p>
        </article>
      </div>
      <div class="feed-card">
        <div class="card-header"><span class="card-icon">✦</span><span class="card-title">INDEX</span></div>
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
    title: "GUESTBOOK",
    html: `
      <div class="feed-card">
        <div class="card-header"><span class="card-icon">✦</span><span class="card-title">GUESTBOOK</span></div>
        <article class="guestbook-entry" style="border:0;margin:0 0 10px;padding:0;background:transparent;">
          <strong>mocha</strong>
          <p>사이트 너무 귀여워요 ♡</p>
        </article>
        <article class="guestbook-entry" style="border:0;margin:0;padding:0;background:transparent;">
          <strong>ribbon</strong>
          <p>다녀갑니다 ✦</p>
        </article>
        <p style="text-align:center;margin-top:22px;font-size:10px;">방명록 기능은 나중에 외부 서비스나 별도 DB와 연결할 수 있어요.</p>
      </div>
    `
  }
};

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
    const page = pages[button.dataset.page];
    if (!page) return;

    contentTitle.textContent = page.title;
    contentBody.innerHTML = page.html;

    closeLayer(menuLayer);
    openLayer(contentLayer);
  });
});

backToMenu.addEventListener("click", () => {
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
    closeLayer(contentLayer);
    openLayer(menuLayer);
  } else if (menuLayer.classList.contains("active")) {
    closeLayer(menuLayer);
    openMenu.focus();
  }
});
