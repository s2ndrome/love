/* 러브인포 시안 공통 엔진 — 팝업 창, 위젯 내용, 3D 바이크.
   시안마다 CSS만 다르게 입혀요. 내용은 data.js 에서 가져와요. */
(function () {
  var L = window.LUV, e = L.esc, K = window.KIT = {};
  var top = 10, layer;

  /* ---------- 팝업 창 ---------- */
  // K.open(id, title, html, opts)  opts: { x, y, w, cls }
  K.open = function (id, title, html, o) {
    o = o || {};
    layer = layer || document.getElementById('wins') || document.body;
    var w = document.getElementById('w-' + id);
    if (w) { w.style.zIndex = ++top; w.classList.remove('lw-pop'); void w.offsetWidth; w.classList.add('lw-pop'); return w; }
    w = document.createElement('section');
    w.className = 'lw lw-pop ' + (o.cls || ''); w.id = 'w-' + id; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', title.replace(/<[^>]+>/g, ''));
    w.innerHTML = '<header class="lw-bar"><span class="lw-t">' + title + '</span><button type="button" class="lw-x" aria-label="닫기">' + (o.x || '×') + '</button></header><div class="lw-body">' + html + '</div>';
    var small = innerWidth < 640;
    if (o.w) w.style.width = small ? '' : o.w + 'px';
    var n = layer.querySelectorAll('.lw').length;
    w.style.left = (small ? 12 : (o.left != null ? o.left : 80 + n * 26)) + 'px';
    w.style.top = (small ? 64 + n * 14 : (o.top != null ? o.top : 70 + n * 22)) + 'px';
    w.style.zIndex = ++top;
    layer.appendChild(w);
    w.querySelector('.lw-x').onclick = function () { w.remove(); };
    w.addEventListener('pointerdown', function () { w.style.zIndex = ++top; });
    drag(w, w.querySelector('.lw-bar'));
    return w;
  };
  // 미리보기용: 주소 끝이 #pop 이면 팝업 몇 개를 미리 띄워 둠. list = [['p0', left, top], ...]
  K.demo = function (list) {
    if ((location.hash !== '#pop' && !window.DEMO) || !K.map) return;
    setTimeout(function () {
      list.forEach(function (d) {
        var f = K.map[d[0]]; if (!f) return; f();
        var w = document.getElementById('w-' + d[0]); if (!w || innerWidth < 640) return;
        w.style.left = d[1] + 'px'; w.style.top = d[2] + 'px'; w.classList.remove('lw-pop');
      });
    }, 300);
  };
  K.closeAll = function () { document.querySelectorAll('.lw').forEach(function (w) { w.remove(); }); };
  function drag(w, h) {
    var s = null;
    h.addEventListener('pointerdown', function (ev) {
      if (ev.target.closest('button')) return;
      s = { x: ev.clientX - w.offsetLeft, y: ev.clientY - w.offsetTop }; h.setPointerCapture(ev.pointerId);
    });
    h.addEventListener('pointermove', function (ev) {
      if (!s) return;
      var x = Math.max(-w.offsetWidth + 80, Math.min(innerWidth - 60, ev.clientX - s.x));
      var y = Math.max(0, Math.min(innerHeight - 40, ev.clientY - s.y));
      w.style.left = x + 'px'; w.style.top = y + 'px';
    });
    h.addEventListener('pointerup', function () { s = null; });
  }
  // data-open="profile-0" 같은 버튼을 자동으로 연결
  K.bind = function (map) {
    K.map = map;
    // 키보드: role=button 요소도 Enter/Space 로 열기
    document.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Enter' && ev.key !== ' ') return;
      var b = ev.target.closest('[data-open]'); if (!b || b.tagName === 'BUTTON' || b.tagName === 'SELECT') return;
      ev.preventDefault(); var f = map[b.getAttribute('data-open')]; if (f) f(b);
    });
    document.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-open]'); if (!b) return;
      ev.preventDefault(); var k = b.getAttribute('data-open'), f = map[k]; if (f) f(b);
    });
  };

  /* ---------- 내용 ---------- */
  K.dday = function () { return L.days(); };
  K.since = function (sep) { return L.since.split('-').join(sep || '.'); };
  K.profile = function (i) {
    var c = L.chars[i];
    return '<div class="pf pf-' + c.key.toLowerCase() + '">' +
      '<div class="pf-head"><b class="pf-name">' + c.name + '</b><span class="pf-ko">' + c.ko + '</span><span class="pf-plate"><i>F</i>' + c.plate + '<s>' + c.dept + '</s></span></div>' +
      '<p class="pf-line">' + e(c.line) + '</p>' +
      '<dl class="pf-dl">' +
      '<dt>ROLE</dt><dd>' + e(c.role) + '</dd>' +
      '<dt>AGE</dt><dd>' + c.age + '</dd>' +
      '<dt>HEIGHT</dt><dd>' + c.height + 'cm</dd>' +
      '<dt>BIRTH</dt><dd>' + c.birth + '</dd>' +
      '<dt>LIKE</dt><dd>' + e(c.likes) + '</dd>' +
      '<dt>DISLIKE</dt><dd>' + e(c.dislikes) + '</dd></dl>' +
      '<p class="pf-kw">' + c.keywords.map(function (k) { return '<span>#' + e(k).replace(/ /g, '_') + '</span>'; }).join(' ') + '</p></div>';
  };
  K.relation = function () { return '<ol class="rl">' + L.relation.map(function (t) { return '<li>' + e(t) + '</li>'; }).join('') + '</ol>'; };
  K.notice = function () { return '<ul class="nt">' + L.notice.map(function (t) { return '<li>' + e(t) + '</li>'; }).join('') + '</ul>'; };
  K.links = function () { return '<nav class="lk">' + L.links.map(function (l) { return '<a href="' + e(l[1]) + '" target="_blank" rel="noopener">' + e(l[0]) + '<i>↗</i></a>'; }).join('') + '</nav>'; };
  K.route = function () {
    var max = L.route[L.route.length - 1][1];
    return '<ol class="rt">' + L.route.map(function (r) { return '<li style="--p:' + (r[1] / max) + '"><b>' + r[0] + '</b><span>' + r[1] + ' km</span></li>'; }).join('') + '</ol>';
  };
  K.bike = function () { var b = L.bike; return '<dl class="bk"><dt>MODEL</dt><dd>' + e(b.model) + '</dd><dt>CC</dt><dd>' + b.cc + '</dd><dt>YEAR</dt><dd>' + b.year + '</dd><dt>COLOR</dt><dd>' + e(b.color) + '</dd><dt>PLATE</dt><dd>' + L.chars[0].plate + ' · ' + L.chars[0].dept + '</dd></dl>'; };
  K.receipt = function () {
    var now = new Date(), t = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    return '<div class="rc"><p class="rc-h">BOULANGERIE Y·L<br><small>12 RUE DES ROSIERS 75004</small></p>' +
      '<p class="rc-m"><span>' + K.since('/') + '</span><span>' + t + '</span></p><ul>' +
      L.bakery.map(function (m) { return '<li><span>1 × ' + e(m[0]) + '</span><span>' + m[1] + '</span></li>'; }).join('') +
      '</ul><p class="rc-t"><span>TOTAL</span><span>€ ' + L.bakery.reduce(function (a, m) { return a + parseFloat(m[1]); }, 0).toFixed(2) + '</span></p><p class="rc-f">MERCI · À DEMAIN 06:00</p></div>';
  };

  /* ---------- 3D 오토바이 (카페 레이서, 선으로만) ---------- */
  // K.bike3D(THREE, { line, faint, accent, dims, ground }) → Group.  앞 = +x, 위 = +y
  K.bike3D = function (T, o) {
    o = o || {};
    var col = o.line != null ? o.line : 0x111111;
    var main = new T.LineBasicMaterial({ color: col });
    var faint = new T.LineBasicMaterial({ color: o.faint != null ? o.faint : col, transparent: true, opacity: .4 });
    var acc = new T.LineBasicMaterial({ color: o.accent != null ? o.accent : 0x2546a8 });
    var root = new T.Group(), R = 1, WB = 3.3, fx = WB / 2, rx = -WB / 2;
    function add(x, p, r) { if (p) x.position.set(p[0], p[1], p[2] || 0); if (r) x.rotation.set(r[0] || 0, r[1] || 0, r[2] || 0); root.add(x); return x; }
    function ed(g, m, th) { return new T.LineSegments(new T.EdgesGeometry(g, th || 24), m || main); }
    function seg(pts, m) { return new T.Line(new T.BufferGeometry().setFromPoints(pts.map(function (p) { return new T.Vector3(p[0], p[1], p[2] || 0); })), m || main); }
    function both(fn) { fn(1); fn(-1); }
    function circ(r, n) { var p = []; for (var i = 0; i <= n; i++) { var a = i / n * Math.PI * 2; p.push(new T.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0)); } return p; }
    function ring(r, m, n) { return new T.Line(new T.BufferGeometry().setFromPoints(circ(r, n || 40)), m || main); }
    function tube(a, b, r, m) { // a→b 원통을 선 두 줄로
      var A = new T.Vector3(a[0], a[1], a[2] || 0), B = new T.Vector3(b[0], b[1], b[2] || 0), d = B.clone().sub(A).normalize();
      var n = new T.Vector3(0, 0, 1).cross(d).normalize().multiplyScalar(r);
      var g = new T.BufferGeometry().setFromPoints([A.clone().add(n), B.clone().add(n), A.clone().sub(n), B.clone().sub(n), A.clone().add(n), A.clone().sub(n), B.clone().add(n), B.clone().sub(n)]);
      var l = new T.LineSegments(g, m || main); root.add(l); return l;
    }
    function ellipsoid(c, sx, sy, sz, m) { // 등고선으로 그린 타원체
      var g = new T.Group(); g.position.set(c[0], c[1], c[2] || 0);
      [-.55, 0, .55].forEach(function (k) { var rr = Math.sqrt(1 - k * k), e = ring(1, m, 40); e.scale.set(sx * rr, sz * rr, 1); e.rotation.x = Math.PI / 2; e.position.y = k * sy; g.add(e); });
      var side = ring(1, m, 40); side.scale.set(sx, sy, 1); g.add(side);
      var cross = ring(1, faint, 30); cross.scale.set(sz, sy, 1); cross.rotation.y = Math.PI / 2; g.add(cross);
      [-.5, .5].forEach(function (k) { var c2 = ring(1, faint, 30); var rr = Math.sqrt(1 - k * k); c2.scale.set(sz * rr, sy * rr, 1); c2.rotation.y = Math.PI / 2; c2.position.x = k * sx; g.add(c2); });
      root.add(g); return g;
    }
    root.wheels = [];
    // 바퀴: 두꺼운 타이어 + 림 + 5스포크 캐스트 휠 + 디스크
    [[rx, false], [fx, true]].forEach(function (w) {
      var g = new T.Group(); g.position.x = w[0];
      g.add(ring(R, main, 56));
      [-.19, .19].forEach(function (z) { var c = ring(R - .16, main, 56); c.position.z = z; g.add(c); });
      g.add(ring(R - .38, main, 48));
      [-.16, .16].forEach(function (z) { var c = ring(R - .38, faint, 48); c.position.z = z; g.add(c); });
      var tr = []; for (var q = 0; q < 36; q++) { var qa = q / 36 * Math.PI * 2, ca = Math.cos(qa), sa = Math.sin(qa);
        tr.push(new T.Vector3(ca * R, sa * R, 0), new T.Vector3(ca * (R - .16), sa * (R - .16), q % 2 ? .19 : -.19)); }
      g.add(new T.LineSegments(new T.BufferGeometry().setFromPoints(tr), faint));
      var sp = []; for (var i = 0; i < 5; i++) { var a = i / 5 * Math.PI * 2, b = .16;
        [-.05, .05].forEach(function (z) { sp.push(new T.Vector3(Math.cos(a - b) * .17, Math.sin(a - b) * .17, z), new T.Vector3(Math.cos(a - .05) * (R - .4), Math.sin(a - .05) * (R - .4), z),
          new T.Vector3(Math.cos(a + b) * .17, Math.sin(a + b) * .17, z), new T.Vector3(Math.cos(a + .05) * (R - .4), Math.sin(a + .05) * (R - .4), z)); }); }
      g.add(new T.LineSegments(new T.BufferGeometry().setFromPoints(sp), main));
      g.add(ring(.17, main, 20));
      var disc = ring(w[1] ? .5 : .38, main, 36); disc.position.z = w[1] ? .22 : -.22; g.add(disc);
      var cal = ed(new T.BoxGeometry(.22, .3, .1)); cal.position.set(w[1] ? -.35 : .3, w[1] ? .3 : .22, w[1] ? .26 : -.26); g.add(cal);
      root.add(g); root.wheels.push(g);
    });
    // 앞 포크 (굵은 2개) + 트리플 클램프
    both(function (s) { tube([fx, 0, .2 * s], [fx - .55, 1.75, .2 * s], .075); tube([fx - .2, .65, .2 * s], [fx - .55, 1.75, .2 * s], .1, faint); });
    add(ed(new T.BoxGeometry(.24, .1, .62)), [fx - .52, 1.7], [0, 0, .3]); add(ed(new T.BoxGeometry(.2, .08, .56)), [fx - .62, 1.96], [0, 0, .3]);
    // 클립온 핸들 + 미러 없는 짧은 바
    both(function (s) { add(seg([[fx - .55, 1.84, .22 * s], [fx - .72, 1.8, .62 * s], [fx - .86, 1.76, .66 * s]])); });
    // 원형 헤드라이트
    [[.3, fx - .1], [.26, fx - .36]].forEach(function (h) { var c = ring(h[0], main, 30); c.rotation.y = Math.PI / 2; c.position.set(h[1], 1.55, 0); root.add(c); });
    var lens = ring(.2, faint, 24); lens.rotation.y = Math.PI / 2; lens.position.set(fx - .06, 1.55, 0); root.add(lens);
    both(function (s) { add(seg([[fx - .1, 1.55 + .3 * (s > 0 ? 1 : -1) * 0, .3 * s], [fx - .36, 1.55, .26 * s]])); });
    // 앞 펜더
    function arc(cx, r, a0, a1, z, m) { var p = []; for (var i = 0; i <= 20; i++) { var a = a0 + (a1 - a0) * i / 20; p.push([cx + Math.cos(a) * r, Math.sin(a) * r, z]); } add(seg(p, m)); }
    both(function (s) { arc(fx, R + .08, Math.PI * .2, Math.PI * .75, .2 * s, faint); });
    // 연료탱크 (크고 긴 물방울형)
    ellipsoid([.25, 1.6], .88, .36, .4, main);
    // 카페 레이서 시트 + 테일 험프
    both(function (s) { add(seg([[-.45, 1.5, .24 * s], [-.5, 1.62, .22 * s], [-1.35, 1.6, .22 * s], [-1.5, 1.82, .18 * s], [-1.9, 1.78, .16 * s], [-1.95, 1.45, .16 * s], [-.45, 1.42, .24 * s], [-.45, 1.5, .24 * s]])); });
    [[-.5, 1.62, .22], [-1.35, 1.6, .22], [-1.5, 1.82, .18], [-1.9, 1.78, .16], [-1.95, 1.45, .16]].forEach(function (p) { add(seg([[p[0], p[1], p[2]], [p[0], p[1], -p[2]]], faint)); });
    // 프레임
    add(seg([[fx - .62, 1.84], [-.15, 1.72], [-1.75, 1.42]]));
    add(seg([[fx - .62, 1.84], [.75, .9], [.3, .15], [-.45, .2], [-.45, .75], [-.15, 1.72]]));
    add(seg([[-.45, .75], [-1.75, 1.42]], faint));
    // 엔진: 크랭크케이스 + 2기통 실린더(냉각핀) + 사이드 커버
    add(ed(new T.BoxGeometry(1.15, .55, .62)), [.12, .45]);
    both(function (s) { var c = ring(.3, main, 30); c.position.set(-.05, .45, .33 * s); root.add(c); var c2 = ring(.18, faint, 24); c2.position.set(.4, .4, .33 * s); root.add(c2); });
    var cyl = new T.Group(); cyl.position.set(.32, .78, 0); cyl.rotation.z = -.32; root.add(cyl);
    cyl.add(ed(new T.BoxGeometry(.5, .6, .56))); cyl.add(ed(new T.BoxGeometry(.6, .12, .62))); cyl.children[1].position.y = .34;
    var fins = []; for (var f = 0; f < 6; f++) { var y = -.24 + f * .09; fins.push(new T.Vector3(-.3, y, .3), new T.Vector3(.3, y, .3), new T.Vector3(-.3, y, -.3), new T.Vector3(.3, y, -.3)); }
    cyl.add(new T.LineSegments(new T.BufferGeometry().setFromPoints(fins), faint));
    // 카뷰레터 / 에어필터
    both(function (s) { var c = ring(.12, main, 18); c.rotation.y = Math.PI / 2; c.position.set(-.25, 1.0, .2 * s); root.add(c); add(seg([[-.25, 1.0, .2 * s], [.05, .98, .2 * s]], faint)); });
    // 머플러 2개 (메가폰)
    both(function (s) {
      add(seg([[.55, .95, .2 * s], [.75, .55, .3 * s], [.55, .1, .34 * s], [-.4, .12, .4 * s]]));
      [[.1, -.4, .12], [.15, -1.7, .3]].forEach(function (m) { var c = ring(m[0], main, 20); c.rotation.y = Math.PI / 2; c.position.set(m[1], m[2], .42 * s); root.add(c); });
      add(seg([[-.4, .22, .42 * s], [-1.7, .45, .42 * s]])); add(seg([[-.4, .02, .42 * s], [-1.7, .15, .42 * s]]));
    });
    // 스윙암 + 쇼크업소버
    both(function (s) {
      tube([-.45, .5, .26 * s], [rx, 0, .26 * s], .06);
      tube([-1.3, .2, .3 * s], [-1.62, 1.38, .3 * s], .06, faint);
      var coil = []; for (var c = 0; c <= 24; c++) { var tt = c / 24, a = tt * Math.PI * 12; coil.push([-1.33 - tt * .26 + Math.cos(a) * .1, .32 + tt * .92, .3 * s + Math.sin(a) * .1]); }
      add(seg(coil, main));
    });
    // 뒤 펜더 짧게
    both(function (s) { arc(rx, R + .08, Math.PI * .45, Math.PI * .85, .2 * s, faint); });
    // 발판
    both(function (s) { add(seg([[-.55, .35, .3 * s], [-.55, .35, .55 * s]])); add(seg([[.5, .3, .3 * s], [.5, .3, .55 * s]])); });
    if (o.dims !== false) {
      var dy = -1.45;
      add(seg([[rx, dy], [fx, dy]], acc)); add(seg([[rx, dy - .15], [rx, -1.12]], acc)); add(seg([[fx, dy - .15], [fx, -1.12]], acc));
      add(seg([[2.35, -R], [2.35, 2.0]], acc)); add(seg([[2.22, 2.0], [2.48, 2.0]], acc)); add(seg([[2.22, -R], [2.48, -R]], acc));
    }
    if (o.ground !== false) { var gr = new T.GridHelper(8, 16); gr.material = faint; gr.position.y = -R - .01; root.add(gr); }
    root.tick = function (t) { root.wheels.forEach(function (w) { w.rotation.z = -t * 1.2; }); };
    return root;
  };

  /* ---------- 3D 공통 셋업 ---------- */
  // K.stage(canvas, { fov, z }) → { scene, cam, renderer, loop(fn) }
  K.stage = function (cv, o) {
    o = o || {};
    var T = window.THREE; if (!T) return null;
    var r = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, preserveDrawingBuffer: true });
    r.setPixelRatio(Math.min(devicePixelRatio, 2));
    var scene = new T.Scene(), cam = new T.PerspectiveCamera(o.fov || 30, 1, .1, 200);
    cam.position.set(0, o.y || 0, o.z || 10);
    function size() { var w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return; r.setSize(w, h, false); cam.aspect = w / h; if (o.fit) o.fit(cam, w, h); cam.updateProjectionMatrix(); }
    addEventListener('resize', size); size();
    return { T: T, scene: scene, cam: cam, renderer: r, size: size, loop: function (fn) {
      (function f(t) { t = (t || 0) / 1000; fn(L.reduced ? 0 : t, t); r.render(scene, cam); requestAnimationFrame(f); })();
    } };
  };
  // 드래그로 돌리기
  K.spin = function (cv, obj, base) {
    var d = null, rx = base.x, ry = base.y;
    cv.addEventListener('pointerdown', function (ev) { d = { x: ev.clientX, y: ev.clientY }; cv.setPointerCapture(ev.pointerId); });
    cv.addEventListener('pointermove', function (ev) { if (!d) return; ry += (ev.clientX - d.x) * .006; rx = Math.max(-.6, Math.min(.9, rx + (ev.clientY - d.y) * .004)); d = { x: ev.clientX, y: ev.clientY }; });
    cv.addEventListener('pointerup', function () { d = null; });
    var last = 0;
    return function (t, auto) { var dt = Math.min(.05, t - last); last = t; if (!d && dt > 0) ry += dt * (auto || 0); obj.rotation.x = rx; obj.rotation.y = ry; };
  };
})();
