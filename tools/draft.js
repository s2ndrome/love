// 임시저장: 쓰는 중인 글을 이 브라우저에 자동으로 저장해 두고, 다음에 열면 불러올 수 있어요.
// (이 기기·이 브라우저에만 저장돼요. 아직 안 올린 사진은 저장되지 않아요)
(function () {
  const css = document.createElement('style');
  css.textContent =
    '.draft-bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:12px 0;padding:10px 12px;border:1px solid #c9d5de;border-radius:10px;background:#f6f9fb;font-size:13px;color:#2b2c31}' +
    '.draft-bar span{flex:1 1 auto}.draft-bar small{color:#9a9ca3}' +
    '.draft-bar button{width:auto;margin:0;padding:6px 12px;border:1px solid #c9d5de;border-radius:8px;background:#fff;color:#2b2c31;font-size:12.5px;cursor:pointer}' +
    '.draft-bar button.go{background:#7f97a9;border-color:#7f97a9;color:#fff}' +
    '.draft-note{margin:8px 0 0;font-size:11.5px;color:#9a9ca3;min-height:1em}';
  document.head.appendChild(css);

  const PFX = 'draft:';
  const time = t => { const d = new Date(t), p = n => String(n).padStart(2, '0'); return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()); };
  // 아직 안 올린 사진(blob: 주소)은 다시 열면 깨지니까 빼고 저장해요
  const cleanHTML = h => String(h || '').replace(/<img[^>]*data-pending[^>]*>(<br\s*\/?>)?/g, '');
  const read = k => { try { return JSON.parse(localStorage.getItem(PFX + k) || 'null'); } catch (e) { return null; } };

  // opt: key() → 저장 칸 이름(없으면 저장 안 함), get() → 지금 상태, set(state) → 불러오기,
  //      empty(state) → 저장할 게 없는지, before → 안내 막대를 넣을 자리, note → "자동 저장됨" 표시 자리
  window.Draft = function (opt) {
    let last = '', paused = false, bar = null;
    const note = document.createElement('p'); note.className = 'draft-note'; opt.note.after(note);
    function save() {
      const k = opt.key(); if (!k || paused) return;
      const s = opt.get(); s.html = cleanHTML(s.html);
      const j = JSON.stringify(s); if (j === last) return; last = j;
      try {
        if (opt.empty(s)) localStorage.removeItem(PFX + k);
        else { localStorage.setItem(PFX + k, JSON.stringify(Object.assign({}, s, { t: Date.now() }))); note.textContent = '임시저장됨 · ' + time(Date.now()); }
      } catch (e) { note.textContent = '임시저장을 못 했어요 (저장 공간이 꽉 찼어요)'; }
    }
    function hideBar() { if (bar) { bar.remove(); bar = null; } paused = false; }
    // 저장된 글이 있으면 불러올지 물어봐요 (고르기 전에는 덮어쓰지 않아요)
    function check() {
      hideBar(); last = ''; note.textContent = '';
      const k = opt.key(); const d = k && read(k); if (!d) return;
      const now = opt.get(); now.html = cleanHTML(now.html);
      if (now.html === d.html && (now.title || '') === (d.title || '')) return;
      paused = true;
      bar = document.createElement('div'); bar.className = 'draft-bar';
      bar.innerHTML = '<span>임시저장된 글이 있어요 <small>' + time(d.t) + '</small></span><button type="button" class="go" data-ld>불러오기</button><button type="button" data-rm>지우기</button>';
      bar.querySelector('[data-ld]').onclick = () => { hideBar(); opt.set(d); save(); };
      bar.querySelector('[data-rm]').onclick = () => { try { localStorage.removeItem(PFX + k); } catch (e) {} hideBar(); };
      opt.before.before(bar);
    }
    function clear() { const k = opt.key(); if (k) try { localStorage.removeItem(PFX + k); } catch (e) {} hideBar(); last = ''; note.textContent = ''; }
    let tm = 0;
    document.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(save, 600); }, true);
    setInterval(save, 4000); // 서식 버튼처럼 input이 안 생기는 변화도 놓치지 않게
    addEventListener('pagehide', save);
    document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
    return { check, clear, save };
  };
})();
