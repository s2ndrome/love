/* E 팝업 내용 공통 (rock 시안용): ROCK.bind() 한 번이면 data-open 버튼 6개가 E와 같은 팝업을 열어요 */
(function () {
  var L = LUV, K = KIT, e = L.esc;
  // 01 YVAN 팝업: 기존 프로필 레이아웃 그대로, 내용만 data.js 의 LUV.yvan 에서
  function yvanPop() {
    var V = L.yvan, R = V.race, tile = {}; V.tiles.forEach(function (t) { tile[t[0]] = t[1]; });
    var off = {}; V.off.forEach(function (o) { off[o[0]] = o[1]; });
    function row(k, v) { return '<dt>' + k + '</dt><dd>' + v + '</dd>'; }
    var career = R.timeline.map(function (t) { return '<span class="cr"><b>' + t[0] + '</b>' + (t[1] ? '<em>' + t[1] + '</em>' : '') + (t[2] ? '<i>' + t[2] + '</i>' : '') + t[3] + '</span>'; }).join('');
    return '<div class="pf pf-y">' +
      '<div class="pf-head"><b class="pf-name">YVAN</b><span class="pf-plate"><i>No</i>ATLAS<s>2</s></span></div>' +
      '<p class="pf-line">' + e(R.head) + '</p><p class="pf-sub">' + e(R.sub) + '</p>' +
      '<dl class="pf-dl">' +
      row('NAME', tile['NAME']) + row('RIDER', tile['RIDER NAME']) +
      row('BASIC', tile['BASIC']) + row('BIRTH', off['BIRTH']) +
      row('TEAM', tile['TEAM']) + row('LIKE', off['LIKE']) + row('HATE', e(off['HATE'])) + row('SCENT', off['SCENT']) + row('DRINK', off['DRINK']) +
      row('LOOKS', V.looks.join('<br>')) + row('PERSONA', V.personality.join('<br>')) + row('TONE', V.habits.join('<br>')) +
      row('STYLE', '<b>' + R.style + '</b><span class="thr"><i></i><i></i><i></i><i></i><i></i></span>' + R.styleText) +
      row('LEAN', R.lean) + row('CAREER', career) +
      '</dl><p class="pf-kw">' + ['풀_스로틀', '만년_2등', '냉소', '완벽주의', '체스', '레몬_타르트'].map(function (k) { return '<span>#' + k + '</span>'; }).join(' ') + '</p></div>';
  }
  // 02 LIA 팝업: 이반과 같은 레이아웃, 내용은 data.js 의 LUV.lia
  function liaPop() {
    var V = L.lia;
    return '<div class="pf pf-l">' +
      '<div class="pf-head"><b class="pf-name">LIA</b><span class="pf-plate"><i>P</i>PASSENGER<s>2</s></span></div>' +
      '<p class="pf-line">' + e(L.chars[1].line) + '</p><p class="pf-sub">' + e(V.sub) + '</p>' +
      '<dl class="pf-dl">' + V.rows.map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>'; }).join('') + '</dl>' +
      '<p class="pf-kw">' + V.tags.map(function (k) { return '<span>#' + k + '</span>'; }).join(' ') + '</p></div>';
  }
  // 03 LE MANS 팝업: 이반 인터뷰
  function interviewPop() {
    var I = L.interview;
    return '<div class="iv"><div class="iv-h"><span>MEDIA PEN · FRI · PRE-Q</span><b>' + e(I.title) + '</b><em>' + e(I.sub) + '</em></div>' +
      I.qa.map(function (q, i) {
        return '<div class="iv-q"><i>Q' + (i + 1) + '</i><p>' + e(q[0]) + '</p></div>' +
          '<div class="iv-a"><i>A' + (i + 1) + '</i><div><small>YVAN STADEL · ATLAS FACTORY</small><p class="en">“' + e(q[1]) + '”</p><p class="ko">' + e(q[2]) + '</p></div></div>';
      }).join('') + '</div>';
  }
  // 06 NOTICE: 안내 3줄 + BGM 버튼 (유튜브, 팝업을 닫아도 계속 재생)
  var bgm = { frame: null, on: false };
  function noticePop() {
    var N = L.noticeE, B = L.bgm;
    return '<div class="nt-e"><b>' + e(N[0]) + '</b><ul>' + N.slice(1).map(function (t) { return '<li>' + e(t) + '</li>'; }).join('') + '</ul></div>' +
      '<button type="button" class="bgm" aria-pressed="false"><span class="bgm-ic"><i></i><i></i><i></i><i></i></span><span class="bgm-k">BGM</span><span class="bgm-t"><b>' + e(B.title) + '</b><em>' + e(B.artist) + '</em></span><span class="bgm-s">PLAY</span></button>';
  }
  function ytCmd(f) { if (bgm.frame) bgm.frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func: f, args: [] }), '*'); }
  function paintBgm() { document.querySelectorAll('.bgm').forEach(function (b) { b.setAttribute('aria-pressed', bgm.on); b.classList.toggle('on', bgm.on); b.querySelector('.bgm-s').textContent = bgm.on ? 'PAUSE' : 'PLAY'; }); }
  function bindBgm(w) {
    var b = w.querySelector('.bgm');
    b.onclick = function () {
      if (!bgm.frame) {
        var id = L.bgm.yt, f = document.createElement('iframe');
        f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&playsinline=1&loop=1&playlist=' + id + '&enablejsapi=1&rel=0';
        f.allow = 'autoplay; encrypted-media'; f.title = 'BGM ' + L.bgm.title; f.className = 'bgm-frame'; f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1;
        document.body.appendChild(f); bgm.frame = f; bgm.on = true;
      } else { bgm.on = !bgm.on; ytCmd(bgm.on ? 'playVideo' : 'pauseVideo'); }
      paintBgm();
    };
    paintBgm();
  }
  // 04 ON AIR: 브라운관 TV 속 모토사이클 레이스 중계 (3D 장면 → CRT 셰이더)
  function tvPop() {
    return '<div class="tv"><div class="tv-box"><canvas class="tv-cv" aria-label="브라운관 TV 속 오토바이 레이스 중계 화면"></canvas><i class="tv-glass"></i></div>' +
      '<p class="tv-cap"><span><i class="tv-dot"></i>CH 04 · MO1 QATAR GP · LUSAIL</span><span>NIGHT RACE · LIVE</span></p></div>';
  }
  function startTv(w) {
    var cv = w.querySelector('.tv-cv'); if (!cv || cv.dataset.on || !window.THREE) return; cv.dataset.on = 1;
    var T = window.THREE, R = new T.WebGLRenderer({ canvas: cv, antialias: true });
    R.setPixelRatio(Math.min(devicePixelRatio, 2));
    var RW = 640, RH = 480, rt = new T.WebGLRenderTarget(RW, RH);
    // ---- 3D 서킷 ----
    var sc = new T.Scene(); sc.background = new T.Color(0x14163a); sc.fog = new T.Fog(0x1c1f48, 12, 80);
    var cam = new T.PerspectiveCamera(42, 4 / 3, .1, 300);
    var P = []; for (var i = 0; i < 18; i++) { var a = i / 18 * Math.PI * 2; P.push(new T.Vector3(Math.cos(a) * (34 + Math.sin(a * 3) * 9), 0, Math.sin(a) * (24 + Math.cos(a * 2) * 7))); }
    var C = new T.CatmullRomCurve3(P, true, 'centripetal'), N = 900, UP = new T.Vector3(0, 1, 0);
    function frame(u) { var p = C.getPointAt(u), t = C.getTangentAt(u), sd = new T.Vector3().crossVectors(t, UP).normalize(); return { p: p, t: t, s: sd }; }
    function strip(w0, w1, colorFn, y) {
      var pos = [], col = [], idx = [];
      for (var i = 0; i <= N; i++) { var f = frame(i / N % 1), c = colorFn(i);
        var a = f.p.clone().addScaledVector(f.s, w0), b = f.p.clone().addScaledVector(f.s, w1);
        pos.push(a.x, y, a.z, b.x, y, b.z); col.push(c[0], c[1], c[2], c[0], c[1], c[2]);
        if (i < N) { var k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); } }
      var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new T.Float32BufferAttribute(col, 3)); g.setIndex(idx);
      sc.add(new T.Mesh(g, new T.MeshBasicMaterial({ vertexColors: true, side: T.DoubleSide })));
    }
    strip(-2.4, 2.4, function () { return [.3, .31, .42]; }, 0);
    strip(2.4, 2.9, function (i) { return (Math.floor(i / 4) % 2) ? [.92, .9, .95] : [.75, .2, .28]; }, .01);
    strip(-2.9, -2.4, function (i) { return (Math.floor(i / 4) % 2) ? [.92, .9, .95] : [.75, .2, .28]; }, .01);
    strip(-40, -2.9, function () { return [.1, .12, .2]; }, -.02); strip(2.9, 40, function () { return [.1, .12, .2]; }, -.02);
    var dash = []; for (var d = 0; d < N; d += 6) { var f1 = frame(d / N), f2 = frame((d + 3) / N); dash.push(f1.p.x, .02, f1.p.z, f2.p.x, .02, f2.p.z); }
    var dg = new T.BufferGeometry(); dg.setAttribute('position', new T.Float32BufferAttribute(dash, 3)); sc.add(new T.LineSegments(dg, new T.LineBasicMaterial({ color: 0xd8d8f0 })));
    // 조명탑 + 빛번짐
    var gc = document.createElement('canvas'); gc.width = gc.height = 64; var gg = gc.getContext('2d'), rg = gg.createRadialGradient(32, 32, 0, 32, 32, 32);
    rg.addColorStop(0, 'rgba(255,255,240,1)'); rg.addColorStop(.25, 'rgba(220,225,255,.6)'); rg.addColorStop(1, 'rgba(160,170,255,0)'); gg.fillStyle = rg; gg.fillRect(0, 0, 64, 64);
    var glow = new T.SpriteMaterial({ map: new T.CanvasTexture(gc), transparent: true, depthWrite: false, blending: T.AdditiveBlending });
    var poles = [];
    for (var q = 0; q < N; q += 45) { var f = frame(q / N), b = f.p.clone().addScaledVector(f.s, (q / 45) % 2 ? 7 : -7);
      poles.push(b.x, 0, b.z, b.x, 9, b.z); var sp = new T.Sprite(glow); sp.position.set(b.x, 9, b.z); sp.scale.setScalar(3.2); sc.add(sp); }
    var pg2 = new T.BufferGeometry(); pg2.setAttribute('position', new T.Float32BufferAttribute(poles, 3)); sc.add(new T.LineSegments(pg2, new T.LineBasicMaterial({ color: 0x6a6e9a })));
    // 먼 스카이라인(관중석)
    for (var z = 0; z < 40; z++) { var ang = z / 40 * Math.PI * 2, rr = 70 + (z % 3) * 4, hgt = 4 + (z * 37 % 9);
      var bx = new T.Mesh(new T.BoxGeometry(9, hgt, 3), new T.MeshBasicMaterial({ color: 0x0f1130 })); bx.position.set(Math.cos(ang) * rr, hgt / 2, Math.sin(ang) * rr); bx.lookAt(0, hgt / 2, 0); sc.add(bx); }
    // 오토바이 2대 + 라이더
    function rider(bk, col) {
      var m = new T.LineBasicMaterial({ color: col }), g = new T.Group();
      var hl = new T.Mesh(new T.SphereGeometry(.32, 14, 10), new T.MeshBasicMaterial({ color: 0x8a8db8 })); hl.position.set(-.1, 2.35, 0); g.add(hl);
      var pts = [[-.2, 2.1], [-1.0, 1.7], [-.6, 1.1], [.1, .5]]; g.add(new T.Line(new T.BufferGeometry().setFromPoints(pts.map(function (p) { return new T.Vector3(p[0], p[1], .25); })), m));
      g.add(new T.Line(new T.BufferGeometry().setFromPoints(pts.map(function (p) { return new T.Vector3(p[0], p[1], -.25); })), m));
      g.add(new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(-.4, 2.0, .3), new T.Vector3(.85, 1.8, .55), new T.Vector3(-.4, 2.0, -.3), new T.Vector3(.85, 1.8, -.55)]), m));
      bk.add(g);
    }
    var bA = K.bike3D(T, { line: 0xffffff, faint: 0xc8ccff, dims: false, ground: false }), bB = K.bike3D(T, { line: 0xffd6c8, faint: 0xb08a90, dims: false, ground: false });
    rider(bA, 0xf4f4ff); rider(bB, 0xffd6c8); bA.scale.setScalar(.55); bB.scale.setScalar(.55); sc.add(bA, bB);
    function place(bk, u, off) {
      var f = frame(u), f2 = frame((u + .004) % 1), k = f2.t.clone().sub(f.t).dot(f.s);
      bk.position.copy(f.p).addScaledVector(f.s, off).setY(.55);
      var q1 = new T.Quaternion().setFromUnitVectors(new T.Vector3(1, 0, 0), f.t), lean = Math.max(-.85, Math.min(.85, -k * 60));
      bk.quaternion.copy(q1).multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(1, 0, 0), lean)); return f;
    }
    // ---- 중계 그래픽 (2D 캔버스 → 같이 휘도록 셰이더로 합성) ----
    var oc = document.createElement('canvas'); oc.width = 640; oc.height = 480; var og = oc.getContext('2d'), otx = new T.CanvasTexture(oc);
    var lap = 5, lead = 0, lastO = -1;
    function drawOver(t) {
      og.clearRect(0, 0, 640, 480);
      og.fillStyle = 'rgba(40,52,190,.92)'; og.fillRect(462, 34, 136, 64); og.fillStyle = 'rgba(210,40,60,.9)'; og.fillRect(462, 96, 136, 4);
      og.fillStyle = '#fff'; og.font = '900 36px "Big Shoulders Display", Impact, sans-serif'; og.fillText('LIVE', 474, 78);
      og.beginPath(); og.arc(566, 62, 17, 0, Math.PI * 2); og.lineWidth = 4; og.strokeStyle = '#fff'; og.stroke(); og.beginPath(); og.arc(566, 62, 7, 0, Math.PI * 2); og.fillStyle = '#fff'; og.fill();
      og.fillStyle = 'rgba(10,12,40,.82)'; og.fillRect(30, 300, 230, 96);
      og.fillStyle = '#fff'; og.font = '500 13px "IBM Plex Mono", monospace'; og.fillText('LAP ' + String(lap).padStart(2, '0') + '/22', 42, 322);
      var rows = lead ? [['1', '#2 YVAN', 'LEADER'], ['2', '#9 NINE', '+0.0' + (40 + Math.floor((t * 7) % 45))]] : [['1', '#9 NINE', 'LEADER'], ['2', '#2 YVAN', '+0.085']];
      rows.forEach(function (r, i) { var y = 350 + i * 30; if (r[1].indexOf('YVAN') > -1) { og.fillStyle = 'rgba(230,232,255,.95)'; og.fillRect(36, y - 20, 218, 26); og.fillStyle = '#0b0b2a'; } else og.fillStyle = '#fff';
        og.font = '900 20px "Big Shoulders Display", Impact, sans-serif'; og.fillText(r[0] + '  ' + r[1], 44, y); og.font = '500 12px "IBM Plex Mono", monospace'; og.fillText(r[2], 196, y); });
      og.fillStyle = 'rgba(10,12,40,.82)'; og.fillRect(30, 418, 580, 30); og.fillStyle = '#fff'; og.font = '500 14px "IBM Plex Mono", monospace';
      og.fillText('MO1 · QATAR GP · LUSAIL INTERNATIONAL CIRCUIT · NIGHT RACE', 44, 438);
      otx.needsUpdate = true;
    }
    // ---- CRT 셰이더 (볼록 화면 · 노이즈 · 색번짐 · 주사선 · 세로 결 · 롤링 바) ----
    var post = new T.Scene(), oCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    var U = { tS: { value: rt.texture }, tO: { value: otx }, uT: { value: 0 }, uRes: { value: new T.Vector2(640, 480) }, uOn: { value: 0 }, uGlitch: { value: 0 } };
    post.add(new T.Mesh(new T.PlaneGeometry(2, 2), new T.ShaderMaterial({ uniforms: U,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }',
      fragmentShader: [
        'uniform sampler2D tS; uniform sampler2D tO; uniform float uT; uniform vec2 uRes; uniform float uOn; uniform float uGlitch; varying vec2 vUv;',
        'float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }',
        'vec3 pick(vec2 uv){ vec3 s = texture2D(tS, uv).rgb; vec4 o = texture2D(tO, vec2(uv.x, uv.y)); return mix(s, o.rgb, o.a); }',
        'void main(){',
        '  vec2 c = vUv * 2. - 1.; float r2 = dot(c, c);',
        '  vec2 bc = c * (1. + .16 * r2 + .06 * r2 * r2) * .94;',           // 볼록(배럴) 왜곡
        '  vec2 uv = bc * .5 + .5;',
        '  vec2 q = abs(bc) - vec2(.9, .88); float box = length(max(q, 0.)) - .1;',  // 둥근 모서리
        '  if (box > 0. || abs(c.y) > uOn) { gl_FragColor = vec4(vec3(.015,.015,.03), 1.); return; }',
        '  float line = floor(uv.y * 240.);',
        '  uv.x += (h(vec2(line, floor(uT * 24.))) - .5) * .006;',            // 가로 흔들림
        '  float tear = step(.985 - uGlitch * .2, h(vec2(floor(uT * 6.), 3.))) * smoothstep(.04, 0., abs(uv.y - fract(uT * .37)));',
        '  uv.x += tear * .05;',
        '  vec2 ca = vec2(.0045 + uGlitch * .01, 0.);',
        '  vec3 col; col.r = pick(uv + ca).r; col.g = pick(uv).g; col.b = pick(uv - ca).b;',
        '  vec3 bl = (pick(uv + vec2(.004,0.)) + pick(uv - vec2(.004,0.)) + pick(uv + vec2(0.,.004))) / 3.;',
        '  col = mix(col, bl, .3) + bl * .18;',                                // 번짐 + 블룸
        '  col = col * vec3(.82, .86, 1.12) + vec3(.16, .17, .34) * .5;',     // 라벤더 블루 톤
        '  float sl = .78 + .22 * sin(uv.y * uRes.y * 3.14159);',               // 주사선
        '  float px = mod(gl_FragCoord.x, 3.); vec3 mask = vec3(px < 1. ? 1.15 : .82, (px >= 1. && px < 2.) ? 1.15 : .82, px >= 2. ? 1.15 : .82);',  // 세로 RGB 결
        '  col *= sl * mask;',
        '  float n = h(uv * uRes + vec2(uT * 61.7, uT * 37.3));',
        '  col += (n - .5) * (.34 + uGlitch * .4);',                            // 지지직 노이즈
        '  col += step(.993, h(floor(uv * uRes * .5) + floor(uT * 30.))) * .6;', // 눈송이
        '  col += .09 * exp(-pow((fract(uv.y + uT * .11) - .5) * 9., 2.));',   // 굴러가는 밝은 띠
        '  col *= .75 + .25 * smoothstep(1.35, .2, length(c));',                // 비네트
        '  col += vec3(.12,.13,.2) * smoothstep(.6, 0., length(c - vec2(-.45, .5))) * .6;', // 유리 반사
        '  col += (1. - smoothstep(0., .02, abs(c.y) - uOn + .02)) * .8 * step(uOn, .99);', // 켜질 때 흰 줄
        '  gl_FragColor = vec4(clamp(col, 0., 1.), 1.);',
        '}'].join('\n')
    })));
    function size() { var b = cv.getBoundingClientRect(); R.setSize(b.width, b.height, false); U.uRes.value.set(b.width, b.height); }
    size(); addEventListener('resize', size);
    var t0 = performance.now(), mode = 0, lastMode = 0, RM = L.reduced;
    (function loop() {
      if (!document.body.contains(cv)) { removeEventListener('resize', size); R.dispose(); rt.dispose(); return; }
      var t = (performance.now() - t0) / 1000, ts = RM ? 3 : t;
      U.uT.value = t; U.uOn.value = Math.min(1, t / .55);
      U.uGlitch.value = Math.max(0, 1 - (t - lastMode) * 3) + (t < .6 ? 1 : 0);
      if (t - lastMode > 5.5) { lastMode = t; mode = (mode + 1) % 3; if (mode === 0) { lap = lap % 22 + 1; lead = 1 - lead; } }
      var uA = (ts * .016) % 1, gap = .0025 + Math.sin(ts * .45) * .002, uB = (uA + (lead ? -gap : gap) + 1) % 1;
      var fA = place(bA, uA, -.7 + Math.sin(ts * .7) * .4), fB = place(bB, uB, .8 + Math.sin(ts * .5 + 1) * .3);
      bA.tick(ts * 9); bB.tick(ts * 9);
      var tgt = bA.position.clone().lerp(bB.position, .5), sh = Math.sin(t * 23) * .03;
      if (mode === 0) { var fc = frame((uA - .014 + 1) % 1); cam.position.copy(fc.p).setY(1.9 + sh); cam.lookAt(tgt.x, .6, tgt.z); }
      else if (mode === 1) { cam.position.copy(fA.p).addScaledVector(fA.s, -7).addScaledVector(fA.t, 2).setY(1.1 + sh); cam.lookAt(tgt.x, .7, tgt.z); }
      else { var fh = frame((uA - .01 + 1) % 1); cam.position.copy(fh.p).addScaledVector(fh.s, 5).setY(11); cam.lookAt(tgt.x, 0, tgt.z); }
      if (Math.floor(t * 5) !== lastO) { lastO = Math.floor(t * 5); drawOver(t); }
      R.setRenderTarget(rt); R.render(sc, cam); R.setRenderTarget(null); R.render(post, oCam);
      requestAnimationFrame(loop);
    })();
  }
  var one = function (f) { return function () { if (innerWidth <= 720) K.closeAll(); f(); }; };
  window.ROCK = { bind: function (titles) {
    titles = titles || ['01 — YVAN', '02 — LIA', '03 — LE MANS', '04 — ON AIR', '05 — REÇU', '06 — NOTICE'];
    K.bind({
      p0: one(function () { K.open('p0', titles[0], yvanPop(), { center: true, w: 440 }); }),
      p1: one(function () { K.open('p1', titles[1], liaPop(), { center: true, w: 440 }); }),
      rel: one(function () { K.open('rel', titles[2], interviewPop(), { center: true, w: 480 }); }),
      route: one(function () { var w = K.open('route', titles[3], tvPop(), { center: true, w: 560 }); startTv(w); }),
      bread: one(function () { K.open('bread', titles[4], K.receipt(), { center: true, w: 300 }); }),
      notice: one(function () { var w = K.open('notice', titles[5], noticePop(), { center: true, w: 340 }); bindBgm(w); })
    });
  } };
})();
