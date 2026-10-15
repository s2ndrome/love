/* 글 에디터 — 티스토리처럼 보이는 그대로 쓰는 본문 편집기.
   textarea 하나를 받아서 툴바 + 편집 칸으로 바꿔요. 'HTML' 버튼을 누르면 원래 textarea가 보여서 코드로도 고칠 수 있어요.
   본문에 넣은 사진은 저장할 때 finalize(upload)로 올라가요 (upload가 압축·업로드 후 경로를 돌려줘요). */
(function () {
  const CSS = `
  .re { position: relative; border: 1px solid rgba(0,0,0,.12); border-radius: 8px; background: #fff; }
  .re-bar { position: sticky; top: 0; z-index: 3; display: flex; flex-wrap: wrap; align-items: center; gap: 2px; padding: 6px; border-bottom: 1px solid rgba(0,0,0,.08); background: #fafafa; border-radius: 8px 8px 0 0; }
  .re-bar button, .re-bar select { margin: 0; height: 30px; min-width: 28px; padding: 0 6px; border: 0; border-radius: 6px; background: transparent; color: #1d1d1f; font: 500 13px/1 -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif; cursor: pointer; }
  .re-bar button:hover, .re-bar select:hover { background: #ececf0; }
  .re-bar button.on { background: #dfe9f0; color: #2a6f9c; }
  .re-bar select { width: auto; padding: 0 4px; }
  .re-bar .sep { width: 1px; height: 18px; margin: 0 3px; background: rgba(0,0,0,.12); }
  .re-bar .c { position: relative; }
  .re-bar .c i { position: absolute; left: 7px; right: 7px; bottom: 4px; height: 3px; border-radius: 1px; }
  .re-bar .html { margin-left: auto !important; font: 600 11px/1 ui-monospace, Menlo, monospace; letter-spacing: .04em; }
  .re-pop { position: absolute; z-index: 5; display: none; padding: 8px; border: 1px solid rgba(0,0,0,.12); border-radius: 8px; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,.12); }
  .re-pop.open { display: block; }
  .re-pop .sw { display: grid; grid-template-columns: repeat(8, 22px); gap: 4px; }
  .re-pop .sw button { width: 22px; height: 22px; min-width: 0; margin: 0; padding: 0; border: 1px solid rgba(0,0,0,.12); border-radius: 4px; cursor: pointer; }
  .re-pop .row { display: flex; align-items: center; gap: 6px; margin-top: 8px; font-size: 12px; color: #6e6e73; }
  .re-pop .row input[type=color] { width: 34px; height: 24px; padding: 0; border: 1px solid rgba(0,0,0,.12); border-radius: 4px; background: none; }
  .re-pop .row button { margin: 0 0 0 auto; padding: 4px 8px; border: 1px solid rgba(0,0,0,.12); border-radius: 4px; background: #fff; color: #1d1d1f; font-size: 11.5px; font-weight: 500; cursor: pointer; }
  .re-q { min-width: 268px; }
  .re-q h6 { margin: 0 0 8px; font: 600 12px/1.4 -apple-system, sans-serif; color: #1d1d1f; }
  .re-q label { display: flex; align-items: center; gap: 6px; margin: 0 0 8px; font-size: 12.5px; font-weight: 500; color: #1d1d1f; }
  .re-q label input { width: auto; margin: 0; }
  .re-q .sw button.on { outline: 2px solid #1d1d1f; outline-offset: 1px; }
  .re-q .acts { display: flex; gap: 6px; margin-top: 10px; }
  .re-q .acts button { flex: 1; margin: 0; padding: 7px 0; border: 1px solid rgba(0,0,0,.12); border-radius: 6px; background: #fff; color: #1d1d1f; font-size: 12px; font-weight: 600; cursor: pointer; }
  .re-q .acts button.go { background: #1d1d1f; border-color: #1d1d1f; color: #fff; }
  .re-q .msg { margin-top: 8px; font-size: 11.5px; color: #6e6e73; }
  .re-area { min-height: 320px; max-height: 70vh; overflow-y: auto; padding: 16px 18px; outline: none; white-space: pre-line; word-break: break-word; font: 400 13.5px/1.9 -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif; color: #3c3c43; }
  .re-area:empty::before { content: attr(data-ph); color: #b0b0b5; }
  .re-area p { margin: 0 0 16px; }
  .re-area img { display: block; width: auto; max-width: 100%; max-height: 360px; height: auto; margin: 6px 0; cursor: pointer; }
  .re-area img.sel { outline: 2px solid #86c4ee; }
  .re-area blockquote { margin: 0 0 12px; padding: 2px 0 2px 12px; border-left: 2px solid #c0d1dc; color: #6e6e73; }
  .re-area hr { border: 0; border-top: 1px solid #c0d1dc; margin: 18px 0; }
  .re-area a { color: #2a6f9c; }
  .re-area ul, .re-area ol { margin: 0 0 12px; padding-left: 22px; white-space: normal; }
  .re textarea.re-src { display: block; width: 100%; min-height: 320px; margin: 0; border: 0; border-radius: 0 0 8px 8px; padding: 14px 16px; font: 12px/1.6 ui-monospace, Menlo, monospace; resize: vertical; }
  `;
  const COLORS = ['#1d1d1f', '#6e6e73', '#b0b0b5', '#ffffff', '#c0d1dc', '#86c4ee', '#6fb0dc', '#2a6f9c',
                  '#e5484d', '#f08c8c', '#f5a524', '#f7d070', '#46a758', '#9bd18f', '#8e4ec6', '#e8a6c8'];
  const SIZES = { small: '11px', big: '16px', bigger: '20px' };

  function RichEditor(ta, opts) {
    opts = opts || {};
    const base = opts.base || '../'; // 도구 페이지는 /tools/ 안에 있어서 img/... 를 보려면 ../ 이 필요해요
    if (!document.getElementById('re-css')) {
      const s = document.createElement('style'); s.id = 're-css'; s.textContent = CSS; document.head.appendChild(s);
    }
    const wrap = document.createElement('div'); wrap.className = 're';
    wrap.innerHTML =
      '<div class="re-bar">' +
        '<button type="button" data-cmd="bold" title="굵게"><b>B</b></button>' +
        '<button type="button" data-cmd="italic" title="기울임"><i style="font-family:Georgia,serif">I</i></button>' +
        '<button type="button" data-cmd="underline" title="밑줄"><u>U</u></button>' +
        '<button type="button" data-cmd="strikeThrough" title="취소선"><s>S</s></button>' +
        '<span class="sep"></span>' +
        '<select data-size title="글자 크기"><option value="">크기</option><option value="small">작게</option><option value="normal">보통</option><option value="big">크게</option><option value="bigger">아주 크게</option></select>' +
        '<button type="button" class="c" data-pop="fore" title="글자색">가<i style="background:#e5484d"></i></button>' +
        '<button type="button" class="c" data-pop="back" title="글자 배경색"><span style="padding:0 2px;background:#f7d070">가</span><i style="background:#f7d070"></i></button>' +
        '<span class="sep"></span>' +
        '<button type="button" data-cmd="justifyLeft" title="왼쪽 정렬">⇤</button>' +
        '<button type="button" data-cmd="justifyCenter" title="가운데 정렬">≡</button>' +
        '<button type="button" data-cmd="justifyRight" title="오른쪽 정렬">⇥</button>' +
        '<span class="sep"></span>' +
        '<button type="button" data-act="quote" title="인용">❝</button>' +
        '<button type="button" data-act="hr" title="구분선">―</button>' +
        '<button type="button" data-cmd="insertUnorderedList" title="목록">•</button>' +
        '<button type="button" data-act="link" title="링크">🔗</button>' +
        '<button type="button" data-act="image" title="사진">🖼</button>' +
        '<button type="button" data-act="quotes" title="“대사” 한 번에 꾸미기">“대사”</button>' +
        '<span class="sep"></span>' +
        '<button type="button" data-cmd="removeFormat" title="서식 지우기">⌫</button>' +
        '<button type="button" data-cmd="undo" title="되돌리기">↶</button>' +
        '<button type="button" data-cmd="redo" title="다시">↷</button>' +
        '<button type="button" class="html" data-act="html" title="HTML 코드로 보기">HTML</button>' +
      '</div>' +
      '<div class="re-area" contenteditable="true"></div>' +
      '<div class="re-pop"><div class="sw"></div><div class="row">직접 고르기 <input type="color" value="#6fb0dc"><button type="button" data-none>없애기</button></div></div>' +
      '<div class="re-pop re-q"><h6>“ ” 안의 대사를 한 번에 꾸며요</h6>' +
        '<label><input type="checkbox" data-qb checked> 굵게</label>' +
        '<div class="sw"></div>' +
        '<div class="row">직접 고르기 <input type="color" data-qc value="#6fb0dc"><button type="button" data-qnone>색 없음</button></div>' +
        '<div class="acts"><button type="button" data-qoff>대사 꾸밈 풀기</button><button type="button" class="go" data-qgo>적용</button></div>' +
        '<div class="msg"></div></div>' +
      '<input type="file" accept="image/*" multiple hidden>';
    ta.parentNode.insertBefore(wrap, ta);
    wrap.appendChild(ta); ta.classList.add('re-src'); ta.style.display = 'none';
    const bar = wrap.querySelector('.re-bar'), area = wrap.querySelector('.re-area'), pop = wrap.querySelector('.re-pop'),
          fileIn = wrap.querySelector('input[type=file]'), htmlBtn = bar.querySelector('[data-act=html]');
    area.dataset.ph = ta.getAttribute('placeholder') && !/^</.test(ta.getAttribute('placeholder')) ? ta.getAttribute('placeholder') : '여기에 글을 써주세요';
    const pending = new Map(); let seq = 0, saved = null, popMode = null, srcMode = false;

    // 툴바를 눌러도 글 선택이 풀리지 않게 마지막 선택 위치를 기억해요
    document.addEventListener('selectionchange', () => {
      const s = getSelection();
      if (s.rangeCount && area.contains(s.anchorNode)) saved = s.getRangeAt(0).cloneRange();
    });
    function restore() {
      const s = getSelection();
      if (s.rangeCount && area.contains(s.anchorNode)) saved = s.getRangeAt(0).cloneRange(); // 지금 선택이 편집 칸 안이면 그걸 써요
      area.focus();
      if (saved) { s.removeAllRanges(); s.addRange(saved); }
    }
    function exec(cmd, val, css) {
      restore();
      document.execCommand('styleWithCSS', false, !!css);
      document.execCommand(cmd, false, val);
      const sel = getSelection(); if (sel.rangeCount && area.contains(sel.anchorNode)) saved = sel.getRangeAt(0).cloneRange();
      sync(); state();
    }
    function sync() { if (!srcMode) ta.value = getHTML(); }

    // 툴바 버튼 상태 (지금 커서 위치가 굵게인지 등)
    function state() {
      bar.querySelectorAll('[data-cmd]').forEach(b => {
        const c = b.dataset.cmd;
        if (/^(bold|italic|underline|strikeThrough|justify|insertUnorderedList)/.test(c)) {
          try { b.classList.toggle('on', document.queryCommandState(c)); } catch (e) {}
        }
      });
    }
    document.addEventListener('selectionchange', () => { if (area.contains(getSelection().anchorNode)) state(); });

    bar.addEventListener('mousedown', e => { if (e.target.closest('button')) e.preventDefault(); });
    bar.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.cmd) return exec(b.dataset.cmd);
      if (b.dataset.pop) return openPop(b);
      const a = b.dataset.act;
      if (a === 'quote') {
        restore();
        const blk = getSelection().anchorNode && (getSelection().anchorNode.nodeType === 1 ? getSelection().anchorNode : getSelection().anchorNode.parentNode).closest('blockquote');
        exec('formatBlock', blk && area.contains(blk) ? 'div' : 'blockquote');
      }
      if (a === 'hr') exec('insertHTML', '<hr>');
      if (a === 'link') {
        const url = prompt('링크 주소를 넣어주세요', 'https://');
        if (url && url !== 'https://') {
          exec('createLink', url);
          area.querySelectorAll('a[href]').forEach(x => { x.target = '_blank'; x.rel = 'noopener'; });
          sync();
        }
      }
      if (a === 'image') fileIn.click();
      if (a === 'quotes') toggleQ(b);
      if (a === 'html') toggleSrc();
    });
    bar.querySelector('[data-size]').addEventListener('change', e => {
      const v = e.target.value; e.target.value = ''; if (!v) return;
      exec('fontSize', '7');
      let first = null, last = null;
      area.querySelectorAll('font[size="7"]').forEach(f => {
        const sp = document.createElement('span');
        if (SIZES[v]) sp.style.fontSize = SIZES[v];
        while (f.firstChild) sp.appendChild(f.firstChild);
        f.replaceWith(sp); if (SIZES[v]) { first = first || sp; last = sp; }
        if (!SIZES[v]) { // 보통: 안쪽에 남아있던 크기도 같이 지워요
          sp.querySelectorAll('[style*="font-size"]').forEach(x => x.style.fontSize = '');
          sp.replaceWith(...sp.childNodes);
        }
      });
      cleanSpans();
      if (first) { // 바꾼 글자를 계속 선택된 상태로 둬요
        const r = document.createRange(); r.setStartBefore(first); r.setEndAfter(last);
        const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); saved = r.cloneRange();
      }
      sync();
    });

    // 색 고르기 팝업
    pop.querySelector('.sw').innerHTML = COLORS.map(c => '<button type="button" data-c="' + c + '" style="background:' + c + '" title="' + c + '"></button>').join('');
    function openPop(b) {
      if (popMode === b.dataset.pop && pop.classList.contains('open')) return closePop();
      popMode = b.dataset.pop;
      pop.classList.add('open');
      pop.style.top = (b.offsetTop + b.offsetHeight + 4) + 'px';
      pop.style.left = Math.max(4, Math.min(b.offsetLeft, wrap.clientWidth - pop.offsetWidth - 4)) + 'px';
    }
    function closePop() { pop.classList.remove('open'); popMode = null; }
    function applyColor(c) {
      const btn = bar.querySelector('[data-pop="' + popMode + '"]');
      if (popMode === 'fore') { exec('foreColor', c || '#3c3c43', true); if (c) btn.querySelector('i').style.background = c; }
      else { exec('hiliteColor', c || 'transparent', true); if (c) btn.querySelector('i').style.background = c; }
      cleanSpans(); sync(); closePop();
    }
    pop.addEventListener('mousedown', e => { if (e.target.closest('button')) e.preventDefault(); });
    pop.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.c) applyColor(b.dataset.c);
      if (b.hasAttribute('data-none')) applyColor('');
    });
    pop.querySelector('input[type=color]').addEventListener('change', e => applyColor(e.target.value));
    document.addEventListener('mousedown', e => { if (!pop.contains(e.target) && !e.target.closest('[data-pop]')) closePop(); });

    // “대사” 한 번에 꾸미기 — 따옴표 안 글자에 굵게/색을 한꺼번에 입혀요 (<span data-q>로 감싸서 나중에 한 번에 풀 수도 있어요)
    const qp = wrap.querySelector('.re-q'), qmsg = qp.querySelector('.msg');
    let qColor = '';
    try { const v = JSON.parse(localStorage.getItem('re_q') || '{}'); if ('b' in v) qp.querySelector('[data-qb]').checked = v.b; qColor = v.c || ''; } catch (e) {}
    qp.querySelector('.sw').innerHTML = COLORS.map(c => '<button type="button" data-qc="' + c + '" style="background:' + c + '" title="' + c + '"></button>').join('');
    function markQ() { qp.querySelectorAll('.sw button').forEach(x => x.classList.toggle('on', x.dataset.qc === qColor)); }
    markQ();
    function toggleQ(b) {
      closePop();
      if (qp.classList.toggle('open')) {
        qmsg.textContent = '';
        qp.style.top = (b.offsetTop + b.offsetHeight + 4) + 'px';
        qp.style.left = Math.max(4, Math.min(b.offsetLeft, wrap.clientWidth - qp.offsetWidth - 4)) + 'px';
      }
    }
    qp.addEventListener('mousedown', e => { if (e.target.closest('button')) e.preventDefault(); });
    qp.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.qc) { qColor = qColor === b.dataset.qc ? '' : b.dataset.qc; markQ(); }
      if (b.hasAttribute('data-qnone')) { qColor = ''; markQ(); }
      if (b.hasAttribute('data-qoff')) { const n = unQ(); sync(); qmsg.textContent = n ? '대사 ' + n + '곳의 꾸밈을 풀었어요' : '꾸민 대사가 없어요'; }
      if (b.hasAttribute('data-qgo')) applyQ();
    });
    qp.querySelector('input[data-qc]').addEventListener('input', e => { qColor = e.target.value; markQ(); });
    document.addEventListener('mousedown', e => { if (!qp.contains(e.target) && !e.target.closest('[data-act=quotes]')) qp.classList.remove('open'); });
    function unQ() {
      const xs = area.querySelectorAll('span[data-q]');
      xs.forEach(x => x.replaceWith(...x.childNodes));
      area.normalize();
      return xs.length;
    }
    function applyQ() {
      const bold = qp.querySelector('[data-qb]').checked;
      if (!bold && !qColor) { qmsg.textContent = '굵게나 색 중 하나는 골라주세요'; return; }
      try { localStorage.setItem('re_q', JSON.stringify({ b: bold, c: qColor })); } catch (e) {}
      unQ(); // 다시 적용해도 겹치지 않게 먼저 풀어요
      // 글자를 순서대로 훑으면서 여는 따옴표 ~ 닫는 따옴표 구간을 모아요 (줄이 바뀌면 끊어요)
      const BLOCK = /^(BR|DIV|P|BLOCKQUOTE|LI|UL|OL|HR|IMG|H[1-6])$/;
      const pieces = []; let open = null;
      const w = document.createTreeWalker(area, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      let n, quotes = 0;
      while ((n = w.nextNode())) {
        if (n.nodeType === 1) { if (BLOCK.test(n.tagName)) open = null; continue; }
        const t = n.data;
        let from = open ? 0 : -1;
        for (let i = 0; i < t.length; i++) {
          const ch = t[i];
          if (ch === '\n') { open = null; from = -1; continue; } // 줄이 바뀌면 안 닫힌 따옴표는 버려요
          if (!open && (ch === '“' || ch === '"')) { open = { parts: [], close: ch === '“' ? '”' : '"' }; from = i; }
          else if (open && ch === open.close) {
            open.parts.push([n, from, i + 1]); pieces.push(...open.parts); quotes++; open = null; from = -1;
          }
        }
        if (open && from >= 0 && from < t.length) open.parts.push([n, from, t.length]);
      }
      // 뒤에서부터 감싸야 앞쪽 위치가 안 흐트러져요
      for (let i = pieces.length - 1; i >= 0; i--) {
        const [node, a, b] = pieces[i];
        if (a >= b) continue;
        const r = document.createRange(); r.setStart(node, a); r.setEnd(node, b);
        const sp = document.createElement('span'); sp.dataset.q = '';
        if (bold) sp.style.fontWeight = '700';
        if (qColor) sp.style.color = qColor;
        r.surroundContents(sp);
      }
      sync();
      qmsg.textContent = quotes ? '대사 ' + quotes + '개에 적용했어요' : '“ ” 로 감싼 대사를 못 찾았어요';
    }

    // 엔터는 줄바꿈(<br>)만 — 사이트에서 보이는 줄 간격이랑 똑같이
    area.addEventListener('beforeinput', e => {
      if (e.inputType === 'insertParagraph' && !getSelection().anchorNode.parentNode.closest('li')) {
        e.preventDefault();
        lineBreak();
      }
    });
    area.addEventListener('input', () => { sync(); });
    // 줄바꿈은 항상 <br>로 — 어느 카테고리에서든 사이트에 똑같이 보이게
    function lineBreak() {
      const sel = getSelection(); if (!sel.rangeCount) return;
      const r = sel.getRangeAt(0); r.deleteContents();
      const br = document.createElement('br'); r.insertNode(br);
      // 맨 끝에서 줄을 바꾸면 빈 줄이 보이도록 하나 더 넣어요
      let n = br.nextSibling; while (n && n.nodeType === 3 && !n.data.length) n = n.nextSibling;
      if (!n) br.after(document.createElement('br'));
      r.setStartAfter(br); r.collapse(true); sel.removeAllRanges(); sel.addRange(r);
      saved = r.cloneRange(); sync();
    }

    // 붙여넣기: 사진 파일은 사진으로, 글은 서식 없이 (다른 곳 스타일이 딸려오지 않게)
    area.addEventListener('paste', e => {
      const files = [...(e.clipboardData.files || [])].filter(f => f.type.startsWith('image/'));
      e.preventDefault();
      if (files.length) return addImages(files);
      const t = e.clipboardData.getData('text/plain');
      if (t) document.execCommand('insertHTML', false, esc(t).replace(/\r?\n/g, '<br>'));
      if (t && /\n$/.test(t)) lineBreak();
      sync();
    });
    area.addEventListener('drop', e => {
      const files = [...(e.dataTransfer.files || [])].filter(f => f.type.startsWith('image/'));
      if (!files.length) return;
      e.preventDefault();
      const r = document.caretRangeFromPoint ? document.caretRangeFromPoint(e.clientX, e.clientY) : null;
      if (r) { const s = getSelection(); s.removeAllRanges(); s.addRange(r); saved = r.cloneRange(); }
      addImages(files);
    });
    fileIn.addEventListener('change', () => { addImages([...fileIn.files]); fileIn.value = ''; });
    function addImages(files) {
      const html = files.map(f => {
        const id = 'p' + (++seq); pending.set(id, f);
        return '<img src="' + URL.createObjectURL(f) + '" data-pending="' + id + '" width="100%"><br>';
      }).join('');
      exec('insertHTML', html);
    }
    // 사진을 누르면 선택돼서 Delete/Backspace로 지울 수 있어요
    area.addEventListener('click', e => {
      area.querySelectorAll('img.sel').forEach(x => x.classList.remove('sel'));
      if (e.target.tagName === 'IMG') {
        e.target.classList.add('sel');
        const r = document.createRange(); r.selectNode(e.target);
        const s = getSelection(); s.removeAllRanges(); s.addRange(r);
      }
    });

    function cleanSpans() {
      // 스타일이 다 빠진 빈 span은 풀어요
      area.querySelectorAll('span').forEach(sp => { if (!sp.getAttribute('style') && !sp.className) sp.replaceWith(...sp.childNodes); });
    }
    function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    // 편집 칸 <-> 저장용 HTML (사진 경로 앞의 ../ 만 바꿔요)
    function setHTML(html) {
      pending.clear();
      area.innerHTML = html || '';
      area.querySelectorAll('img').forEach(img => {
        const s = img.getAttribute('src') || '';
        if (s && !/^(https?:|data:|blob:|\/)/.test(s)) { img.dataset.orig = s; img.setAttribute('src', base + s); }
      });
      ta.value = html || '';
    }
    function getHTML() {
      const c = area.cloneNode(true);
      c.querySelectorAll('img').forEach(img => {
        if (img.dataset.orig) { img.setAttribute('src', img.dataset.orig); img.removeAttribute('data-orig'); }
        img.classList.remove('sel'); if (!img.className) img.removeAttribute('class');
      });
      // 글자가 하나도 없는 빈 서식 태그는 빼요
      let again = true;
      while (again) {
        again = false;
        c.querySelectorAll('b,strong,i,em,u,s,strike,span,font,a').forEach(x => { if (!x.textContent && !x.querySelector('img,br,hr')) { x.remove(); again = true; } });
      }
      return c.innerHTML;
    }
    function toggleSrc() {
      if (!srcMode) {
        ta.value = getHTML(); srcMode = true;
        area.style.display = 'none'; ta.style.display = 'block'; htmlBtn.classList.add('on');
        bar.querySelectorAll('button:not(.html), select').forEach(x => x.disabled = true);
      } else {
        const keep = new Map(pending); setHTML(ta.value); keep.forEach((f, id) => { if (area.querySelector('[data-pending="' + id + '"]')) pending.set(id, f); });
        srcMode = false;
        area.style.display = ''; ta.style.display = 'none'; htmlBtn.classList.remove('on');
        bar.querySelectorAll('button, select').forEach(x => x.disabled = false);
      }
    }

    return {
      setHTML,
      // 사이트에서 줄바꿈이 보이는 방식에 맞춰요 (LOG는 글 안의 줄바꿈이 그대로 보여요)
      setMode(ws) { area.style.whiteSpace = ws; },
      getHTML: () => srcMode ? ta.value : getHTML(),
      isEmpty() { const h = this.getHTML(); return !h.replace(/<br\s*\/?>|&nbsp;|\s/g, '').length; },
      clear() { setHTML(''); },
      // 본문 안 새 사진을 올리고 진짜 경로로 바꾼 최종 HTML을 돌려줘요
      async finalize(upload) {
        if (srcMode) toggleSrc();
        const imgs = [...area.querySelectorAll('img[data-pending]')];
        for (let i = 0; i < imgs.length; i++) {
          const img = imgs[i], id = img.dataset.pending, f = pending.get(id);
          if (!f) continue;
          const path = await upload(f, i + 1, imgs.length);
          img.removeAttribute('data-pending'); img.dataset.orig = path; img.setAttribute('src', base + path);
          pending.delete(id);
        }
        sync();
        return getHTML();
      }
    };
  }
  window.RichEditor = RichEditor;
})();
