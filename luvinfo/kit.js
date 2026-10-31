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
    if (location.hash !== '#pop' || !K.map) return;
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
      '</ul><p class="rc-t"><span>TOTAL</span><span>D+' + L.days() + '</span></p><p class="rc-f">MERCI · À DEMAIN 06:00</p></div>';
  };

  /* ---------- 3D 바이크 (선으로만) ---------- */
  // K.bike3D(THREE, { line: 0x111111, faint: 0x111111, accent: 0x2546a8 }) → Group
  K.bike3D = function (T, o) {
    o = o || {};
    var main = new T.LineBasicMaterial({ color: o.line != null ? o.line : 0x111111, transparent: true, opacity: o.op || 1 });
    var faint = new T.LineBasicMaterial({ color: o.faint != null ? o.faint : (o.line != null ? o.line : 0x111111), transparent: true, opacity: .32 });
    var acc = new T.LineBasicMaterial({ color: o.accent != null ? o.accent : 0x2546a8 });
    var root = new T.Group(), R = 1, WB = 3.1;
    function add(x) { root.add(x); return x; }
    function edges(g, m) { return new T.LineSegments(new T.EdgesGeometry(g, 20), m || main); }
    function seg(pts, m) { return new T.Line(new T.BufferGeometry().setFromPoints(pts.map(function (p) { return new T.Vector3(p[0], p[1], p[2] || 0); })), m || main); }
    root.wheels = [];
    [-WB / 2, WB / 2].forEach(function (x) {
      var g = new T.Group(); g.position.x = x;
      g.add(new T.LineSegments(new T.WireframeGeometry(new T.TorusGeometry(R, .14, 4, 36)), main));
      g.add(edges(new T.CylinderGeometry(.8, .8, .06, 40).rotateX(Math.PI / 2), faint));
      var sp = []; for (var i = 0; i < 18; i++) { var a = i / 18 * Math.PI * 2, z = i % 2 ? .07 : -.07; sp.push(new T.Vector3(0, 0, z), new T.Vector3(Math.cos(a) * .8, Math.sin(a) * .8, 0)); }
      g.add(new T.LineSegments(new T.BufferGeometry().setFromPoints(sp), faint));
      g.add(edges(new T.CylinderGeometry(.12, .12, .3, 16).rotateX(Math.PI / 2)));
      add(g); root.wheels.push(g);
    });
    add(seg([[-WB / 2, 0, .12], [-.2, .55, .12], [.35, .45, .12]])); add(seg([[-WB / 2, 0, -.12], [-.2, .55, -.12], [.35, .45, -.12]]));
    add(seg([[-.2, .55], [-.55, 1.35], [.95, 1.45], [1.15, 1.25], [.35, .45], [-.2, .55]]));
    add(seg([[-.55, 1.35], [-1.6, 1.25], [-WB / 2, 0]]));
    add(seg([[WB / 2, 0, .1], [1.2, 1.75, .1]])); add(seg([[WB / 2, 0, -.1], [1.2, 1.75, -.1]]));
    add(seg([[1.05, 1.95, -.55], [1.18, 1.78, -.3], [1.18, 1.78, .3], [1.05, 1.95, .55]]));
    var tank = edges(new T.SphereGeometry(.62, 18, 10)); tank.scale.set(1.05, .42, .5); tank.position.set(.35, 1.62, 0); add(tank);
    var seat = edges(new T.BoxGeometry(1.05, .16, .46)); seat.position.set(-.85, 1.48, 0); add(seat);
    add(seg([[-1.38, 1.4], [-1.85, 1.62], [-1.85, 1.4], [-1.38, 1.4]]));
    var eng = edges(new T.BoxGeometry(.95, .78, .62)); eng.position.set(.15, .62, 0); add(eng);
    var fins = []; for (var f = 0; f < 6; f++) { var y = .95 + f * .07; fins.push(new T.Vector3(-.25, y, .36), new T.Vector3(.55, y, .36), new T.Vector3(-.25, y, -.36), new T.Vector3(.55, y, -.36)); }
    add(new T.LineSegments(new T.BufferGeometry().setFromPoints(fins), faint));
    var muf = edges(new T.CylinderGeometry(.12, .1, 1.6, 14).rotateZ(Math.PI / 2 - .12)); muf.position.set(-.85, .35, .42); add(muf);
    add(seg([[.45, .45, .36], [-.05, .3, .42]]));
    var hl = edges(new T.CylinderGeometry(.24, .2, .22, 20).rotateZ(Math.PI / 2)); hl.position.set(1.42, 1.5, 0); add(hl);
    if (o.dims !== false) {
      var dy = -1.45;
      add(seg([[-WB / 2, dy], [WB / 2, dy]], acc)); add(seg([[-WB / 2, dy - .15], [-WB / 2, -1.12]], acc)); add(seg([[WB / 2, dy - .15], [WB / 2, -1.12]], acc));
      add(seg([[2.25, -R], [2.25, 1.95]], acc)); add(seg([[2.12, 1.95], [2.38, 1.95]], acc)); add(seg([[2.12, -R], [2.38, -R]], acc));
    }
    if (o.ground !== false) { var gr = new T.GridHelper(8, 16); gr.material = faint; gr.position.y = -R - .01; add(gr); }
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
