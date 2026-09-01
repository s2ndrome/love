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

// called from inline onclick="" in post HTML — copies the text of the
// nearest .copy-target (e.g. a prompt block) to the clipboard
window.copyPromptText = function (button) {
  const target = button.closest(".prompt-block")?.querySelector(".copy-target");
  if (!target) return;
  const text = target.innerText.trim();

  const showCopied = () => {
    button.classList.add("copied");
    button.innerHTML = checkIconSvg;
    setTimeout(() => {
      button.classList.remove("copied");
      button.innerHTML = copyIconSvg;
    }, 1400);
  };

  navigator.clipboard.writeText(text).then(showCopied).catch(() => {
    const scratch = document.createElement("textarea");
    scratch.value = text;
    scratch.style.position = "fixed";
    scratch.style.opacity = "0";
    document.body.appendChild(scratch);
    scratch.select();
    document.execCommand("copy");
    document.body.removeChild(scratch);
    showCopied();
  });
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
  world: "SHARE",
  ooc: "OOC",
  guestbook: "GUESTBOOK",
  prompt: "PROMPT",
  banner: "BANNER"
};

const noteIconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>`;
const copyIconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>`;
const checkIconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12l5 5L20 6"/></svg>`;
const lockIconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>`;
const lockBadgeSvg = `<span class="lock-badge">${lockIconSvg}</span>`;

/* ------------------------------------------------------------------ */
/* password-locked posts: a post file can be just
     <div class="locked-post" data-salt="…" data-iv="…" data-cipher="…"></div>
   instead of real HTML. The real content is AES-256-GCM encrypted with a
   PBKDF2(password, salt, 100000, SHA-256) key, so the plaintext never
   appears anywhere in the repo — only this decrypts it, client-side. */
/* ------------------------------------------------------------------ */
function parseLockedPost(html) {
  const match = html.match(/<div class="locked-post" data-salt="([^"]+)" data-iv="([^"]+)" data-cipher="([^"]+)">/);
  if (!match) return null;
  return { salt: match[1], iv: match[2], cipher: match[3] };
}

function base64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function decryptLockedPost(locked, password) {
  const baseKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: base64ToBytes(locked.salt), iterations: 100000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
  const plainBuf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBytes(locked.iv) },
    key,
    base64ToBytes(locked.cipher)
  );
  return new TextDecoder().decode(plainBuf);
}

function renderLockGate() {
  return `
    <div class="lock-gate">
      <div class="lock-gate-icon">${lockIconSvg}</div>
      <p class="lock-gate-hint">비밀번호가 필요한 글이에요</p>
      <div class="lock-gate-row">
        <input type="password" class="lock-gate-input" placeholder="비밀번호" autocomplete="off">
        <button type="button" class="lock-gate-submit">확인</button>
      </div>
      <p class="lock-gate-error" hidden>비밀번호가 틀렸어요</p>
    </div>
  `;
}

function wireLockGate(locked, category, item) {
  const input = contentBody.querySelector(".lock-gate-input");
  const submit = contentBody.querySelector(".lock-gate-submit");
  const error = contentBody.querySelector(".lock-gate-error");

  const tryUnlock = async () => {
    const password = input.value;
    if (!password || submit.disabled) return;

    submit.disabled = true;
    error.hidden = true;

    try {
      const html = await decryptLockedPost(locked, password);
      contentBody.innerHTML = wrapDetail(category, item, html);
      wireDetailButtons();
    } catch (err) {
      error.hidden = false;
      input.value = "";
      input.focus();
      submit.disabled = false;
    }
  };

  submit.addEventListener("click", tryUnlock);
  input.addEventListener("keydown", event => {
    if (event.key === "Enter") tryUnlock();
  });
  input.focus();
}

/* categories with a clickable list of entries; each entry's full content
   lives in its own file at posts/<category>/<id>.html */
const LIST_RENDERERS = {
  diary: items => `
    <nav class="entry-list">
      ${items.map(item => `<button data-id="${item.id}">${item.locked ? lockBadgeSvg : ""}${item.label}</button>`).join("")}
    </nav>
  `,
  world: items => `
    <nav class="entry-list">
      ${items.map(item => `<button data-id="${item.id}">${item.locked ? lockBadgeSvg : ""}${item.label}</button>`).join("")}
    </nav>
  `,
  ooc: items => `
    <nav class="entry-list">
      ${items.map(item => `<button data-id="${item.id}">${item.locked ? lockBadgeSvg : ""}${item.name}</button>`).join("")}
    </nav>
  `,
  characters: items => `
    <div class="character-grid">
      ${items.map(item => `
        <button class="character-card" data-id="${item.id}">
          ${item.thumb ? `<img src="${item.thumb}" alt="${item.name}">` : `<div class="fake-photo">${item.thumbLabel}</div>`}
          <h3>${item.locked ? lockBadgeSvg : ""}${item.name}</h3>
          <p>${item.blurb}</p>
        </button>
      `).join("")}
    </div>
  `,
  gallery: items => `
    <div class="gallery-grid">
      ${items.map(item => `
        <button class="gallery-item" data-id="${item.id}">
          ${item.locked ? lockBadgeSvg : ""}
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
  if (res.ok) return res.text();

  // Korean filenames uploaded from a Mac often end up NFD (decomposed)
  // on disk while ids in data/*.json are typed as NFC (composed) — same
  // glyphs, different bytes, so the exact-match fetch above 404s. Retry
  // once with the NFD form so a new post doesn't need a manual rename.
  const nfdPath = path.normalize("NFD");
  if (nfdPath !== path) {
    const retry = await fetch(nfdPath);
    if (retry.ok) return retry.text();
  }

  throw new Error(`failed to load ${path}`);
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

function wireDetailButtons() {
  // scoped to .note-card so this doesn't collide with .prompt-block's
  // self-contained copy buttons (those use inline onclick="copyPromptText(this)")
  const copyButton = contentBody.querySelector(".note-card .copy-button");
  if (copyButton) copyButton.addEventListener("click", () => copyNoteText(copyButton));
}

/* posts/guestbook.html's <form> posts to Formspree; intercept it so the
   visitor stays on this page instead of being redirected there */
function wireMessageForm() {
  const form = contentBody.querySelector(".message-form");
  if (!form) return;

  const status = form.querySelector(".message-form-status");
  const button = form.querySelector("button");

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (button.disabled) return;

    button.disabled = true;
    status.textContent = "";
    status.classList.remove("error");

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (!res.ok) throw new Error("send failed");

      form.reset();
      status.textContent = "메시지를 보냈어요 ♡";
    } catch (err) {
      status.textContent = "전송에 실패했어요. 잠시 후 다시 시도해주세요.";
      status.classList.add("error");
    } finally {
      button.disabled = false;
    }
  });
}

async function openDetail(category, id) {
  activeDetail = { category, id };
  updateBackLabel();
  contentBody.innerHTML = `<p class="loading-hint">불러오는 중…</p>`;

  try {
    const html = await fetchText(`posts/${category}/${id}.html`);
    const item = (lastListItems || []).find(entry => entry.id === id);
    const locked = parseLockedPost(html);

    if (locked) {
      contentBody.innerHTML = renderLockGate();
      wireLockGate(locked, category, item);
      return;
    }

    contentBody.innerHTML = wrapDetail(category, item, html);
    wireDetailButtons();
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

    if (category === "guestbook") {
      contentBody.innerHTML = await fetchText("posts/guestbook.html");
      wireMessageForm();
      return;
    }

    if (category === "prompt") {
      const html = await fetchText("posts/prompt.html");
      const locked = parseLockedPost(html);

      if (locked) {
        contentBody.innerHTML = renderLockGate();
        wireLockGate(locked, category, null);
        return;
      }

      contentBody.innerHTML = html;
      return;
    }

    if (category === "banner") {
      contentBody.innerHTML = await fetchText("posts/banner.html");
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

// same NFC/NFD self-heal as fetchText, but for <img> tags — "error"
// doesn't bubble, so this has to listen on the capture phase
document.addEventListener("error", event => {
  const img = event.target;
  if (!(img instanceof HTMLImageElement) || img.dataset.nfdRetried) return;

  const nfdSrc = img.getAttribute("src").normalize("NFD");
  if (nfdSrc === img.getAttribute("src")) return;

  img.dataset.nfdRetried = "1";
  img.src = nfdSrc;
}, true);

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
