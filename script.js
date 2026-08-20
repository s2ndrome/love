// called from inline onclick="" in post HTML (e.g. the About playlist card),
// since content injected via innerHTML never runs its own <script> tags
window.playTrack = function (button, videoId) {
  const frame = document.getElementById("playlistFrame");
  if (frame) frame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  const list = button.closest(".track-list");
  if (list) list.querySelectorAll("li").forEach(li => li.classList.remove("active"));

  const li = button.closest("li");
  if (li) li.classList.add("active");
};

const menuLayer = document.getElementById("menuLayer");
const contentLayer = document.getElementById("contentLayer");
const openMenu = document.getElementById("openMenu");
const contentTitle = document.getElementById("contentTitle");
const contentBody = document.getElementById("contentBody");
const backToMenu = document.getElementById("backToMenu");

const CATEGORY_TITLES = {
  about: "SEOL",
  characters: "Characters",
  gallery: "Gallery",
  diary: "LOG",
  world: "World",
  ooc: "OOC"
};

const noteIconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>`;
const copyIconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>`;
const checkIconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12l5 5L20 6"/></svg>`;

/* categories with a clickable list of entries; each entry's full content
   lives in its own file at posts/<category>/<id>.html */
const LIST_RENDERERS = {
  diary: items => `
    <nav class="entry-list">
      ${items.map(item => `<button data-id="${item.id}">${item.label}</button>`).join("")}
    </nav>
  `,
  world: items => `
    <nav class="entry-list">
      ${items.map(item => `<button data-id="${item.id}">${item.label}</button>`).join("")}
    </nav>
  `,
  ooc: items => `
    <nav class="entry-list">
      ${items.map(item => `<button data-id="${item.id}">${item.name}</button>`).join("")}
    </nav>
  `,
  characters: items => `
    <div class="character-grid">
      ${items.map(item => `
        <button class="character-card" data-id="${item.id}">
          ${item.thumb ? `<img src="${item.thumb}" alt="${item.name}">` : `<div class="fake-photo">${item.thumbLabel}</div>`}
          <h3>${item.name}</h3>
          <p>${item.blurb}</p>
        </button>
      `).join("")}
    </div>
  `,
  gallery: items => `
    <div class="gallery-grid">
      ${items.map(item => `
        <button class="gallery-item" data-id="${item.id}">
          ${item.thumb ? `<img src="${item.thumb}" alt="${item.thumbLabel || ""}">` : item.thumbLabel}
        </button>
      `).join("")}
    </div>
  `
};

/* diary + guestbook entries get a note-card wrapper (tag + body + a bottom
   bar); everything else's post file is already a self-contained .feed-card */
function wrapDetail(category, item, html) {
  if (category === "diary") {
    return `
      <div class="note-card">
        <span class="note-tag">${item ? item.label : ""}</span>
        <div class="note-body">${html}</div>
        <div class="note-compose">
          <span class="note-cursor">|</span>
          <span class="note-icon">${noteIconSvg}</span>
        </div>
      </div>
    `;
  }

  if (category === "ooc") {
    return `
      <div class="note-card">
        <span class="note-tag">${item ? item.name : ""}</span>
        <div class="note-body">${html}</div>
        <div class="note-compose">
          <button class="copy-button" type="button" aria-label="복사하기">${copyIconSvg}</button>
        </div>
      </div>
    `;
  }

  return html;
}

async function copyNoteText(button) {
  const text = button.closest(".note-card").querySelector(".note-body").innerText.trim();

  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    const scratch = document.createElement("textarea");
    scratch.value = text;
    scratch.style.position = "fixed";
    scratch.style.opacity = "0";
    document.body.appendChild(scratch);
    scratch.select();
    document.execCommand("copy");
    document.body.removeChild(scratch);
  }

  button.classList.add("copied");
  button.innerHTML = checkIconSvg;
  button.setAttribute("aria-label", "복사됨");

  setTimeout(() => {
    button.classList.remove("copied");
    button.innerHTML = copyIconSvg;
    button.setAttribute("aria-label", "복사하기");
  }, 1400);
}

async function fetchJSON(path) {
  if (window.__EMBEDDED__ && path in window.__EMBEDDED__) return window.__EMBEDDED__[path];
  const res = await fetch(path);
  if (!res.ok) throw new Error(`failed to load ${path}`);
  return res.json();
}

async function fetchText(path) {
  if (window.__EMBEDDED__ && path in window.__EMBEDDED__) return window.__EMBEDDED__[path];
  const res = await fetch(path);
  if (!res.ok) throw new Error(`failed to load ${path}`);
  return res.text();
}

let activeDetail = null; // { category, id } | null
let lastListCategory = null;
let lastListItems = null;
let listPage = 0;

const PAGE_SIZE = 6;
const PAGINATED_CATEGORIES = new Set(["gallery", "diary", "world", "ooc"]);

function updateBackLabel() {
  backToMenu.setAttribute("aria-label", activeDetail ? "목록으로" : "메뉴로");
}

function renderPager(totalItems, page) {
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  if (totalPages <= 1) return "";

  return `
    <div class="pager">
      <button class="pager-btn" data-pager="prev" ${page === 0 ? "disabled" : ""} aria-label="이전 페이지">‹</button>
      <span class="pager-status">${page + 1} / ${totalPages}</span>
      <button class="pager-btn" data-pager="next" ${page >= totalPages - 1 ? "disabled" : ""} aria-label="다음 페이지">›</button>
    </div>
  `;
}

function renderList(category, items, page = 0) {
  lastListCategory = category;
  lastListItems = items;
  listPage = page;
  activeDetail = null;
  updateBackLabel();

  const paginate = PAGINATED_CATEGORIES.has(category);
  const pageItems = paginate ? items.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE) : items;

  contentBody.innerHTML = LIST_RENDERERS[category](pageItems) + (paginate ? renderPager(items.length, page) : "");

  contentBody.querySelectorAll("[data-id]").forEach(button => {
    button.addEventListener("click", () => openDetail(category, button.dataset.id));
  });

  contentBody.querySelectorAll("[data-pager]").forEach(button => {
    button.addEventListener("click", () => {
      renderList(category, items, page + (button.dataset.pager === "next" ? 1 : -1));
    });
  });
}

async function openDetail(category, id) {
  activeDetail = { category, id };
  updateBackLabel();
  contentBody.innerHTML = `<p class="loading-hint">불러오는 중…</p>`;

  try {
    const html = await fetchText(`posts/${category}/${id}.html`);
    const item = (lastListItems || []).find(entry => entry.id === id);
    contentBody.innerHTML = wrapDetail(category, item, html);

    const copyButton = contentBody.querySelector(".copy-button");
    if (copyButton) copyButton.addEventListener("click", () => copyNoteText(copyButton));
  } catch (err) {
    contentBody.innerHTML = `<p class="loading-hint">불러오지 못했어요.</p>`;
  }
}

async function openCategory(category) {
  contentTitle.textContent = CATEGORY_TITLES[category] || "";
  activeDetail = null;
  lastListCategory = null;
  lastListItems = null;
  updateBackLabel();
  contentBody.innerHTML = `<p class="loading-hint">불러오는 중…</p>`;

  try {
    if (category === "about") {
      contentBody.innerHTML = await fetchText("posts/about/about.html");
      return;
    }

    const items = await fetchJSON(`data/${category}.json`);
    renderList(category, items);
  } catch (err) {
    contentBody.innerHTML = `<p class="loading-hint">불러오지 못했어요. (${err.message})</p>`;
  }
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
    closeLayer(menuLayer);
    openLayer(contentLayer);
    openCategory(button.dataset.page);
  });
});

backToMenu.addEventListener("click", () => {
  if (activeDetail) {
    const category = activeDetail.category;
    if (lastListCategory === category && lastListItems) {
      renderList(category, lastListItems, listPage);
    } else {
      openCategory(category);
    }
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
    if (activeDetail) {
      backToMenu.click();
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
