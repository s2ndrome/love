/* cupid's bow in three.js: glitter-wrapped silver bow, satin ribbon bows, a heart-tipped arrow that fires on click */
window.Cupid = (function () {
  var V = function (x, y, z) { return new THREE.Vector3(x, y, z || 0); };
  // image-space (from the reference photo) → world
  var P = function (px, py) { return V((px - 400) / 100, -(py - 480) / 100, 0); };

  function glitterTex() {
    var c = document.createElement('canvas'); c.width = c.height = 256; var x = c.getContext('2d');
    x.fillStyle = '#e9ebef'; x.fillRect(0, 0, 256, 256);
    for (var k = 0; k < 900; k++) { var v = Math.random(); x.fillStyle = v > .7 ? 'rgba(255,255,255,.9)' : 'rgba(205,210,220,.6)'; x.fillRect(Math.random() * 256, Math.random() * 256, .9, .9); }
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(10, 2); t.anisotropy = 4; return t;
  }
  // soft studio environment so metal and satin pick up real reflections
  function studioEnv(R) {
    var c = document.createElement('canvas'); c.width = 512; c.height = 256; var x = c.getContext('2d');
    var g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, '#ffffff'); g.addColorStop(.45, '#f1f3f7'); g.addColorStop(.55, '#c9ced8'); g.addColorStop(1, '#8e94a0');
    x.fillStyle = g; x.fillRect(0, 0, 512, 256);
    x.fillStyle = 'rgba(255,255,255,1)'; x.fillRect(60, 40, 90, 120); x.fillRect(340, 60, 120, 60);
    var t = new THREE.CanvasTexture(c); t.mapping = THREE.EquirectangularReflectionMapping; t.encoding = THREE.sRGBEncoding;
    var pm = new THREE.PMREMGenerator(R); var env = pm.fromEquirectangular(t).texture; pm.dispose(); return env;
  }
  function satin(color) { return new THREE.MeshPhysicalMaterial({ map: satinTex(color), color: 0xffffff, roughness: .34, metalness: 0, sheen: .8, sheenRoughness: .3, sheenColor: new THREE.Color(0xffffff), clearcoat: .6, clearcoatRoughness: .18, side: THREE.DoubleSide }); }

  // satin ribbon texture: a soft lengthwise sheen band, faint woven grain, slightly darker selvedge edges
  function satinTex(hex) {
    var c = document.createElement('canvas'); c.width = 64; c.height = 512; var x = c.getContext('2d');
    var col = new THREE.Color(hex), r = Math.round(col.r * 255), g = Math.round(col.g * 255), b = Math.round(col.b * 255);
    var gr = x.createLinearGradient(0, 0, 64, 0);
    gr.addColorStop(0, 'rgb(' + (r - 28) + ',' + (g - 22) + ',' + (b - 14) + ')');
    gr.addColorStop(.08, 'rgb(' + r + ',' + g + ',' + b + ')');
    gr.addColorStop(.42, 'rgb(' + Math.min(255, r + 26) + ',' + Math.min(255, g + 22) + ',' + Math.min(255, b + 14) + ')');
    gr.addColorStop(.55, 'rgb(' + r + ',' + g + ',' + b + ')');
    gr.addColorStop(.92, 'rgb(' + (r - 8) + ',' + (g - 6) + ',' + (b - 4) + ')');
    gr.addColorStop(1, 'rgb(' + (r - 30) + ',' + (g - 24) + ',' + (b - 16) + ')');
    x.fillStyle = gr; x.fillRect(0, 0, 64, 512);
    for (var y = 0; y < 512; y += 2) { x.fillStyle = 'rgba(255,255,255,' + (Math.random() * .05) + ')'; x.fillRect(0, y, 64, 1); }
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t;
  }
  // a strip of ribbon following a curve, with uv (u across, v along) and a gentle twist
  function strip(curve, w, n, twist, taper, notch, base) {
    var pts = curve.getSpacedPoints(n), fr = curve.computeFrenetFrames(n, curve.closed), pos = [], uv = [], idx = [];
    for (var i = 0; i <= n; i++) {
      var u = i / n, bn = fr.binormals[i].clone(), nn = fr.normals[i].clone(), a = (base || 0) + (twist || 0) * Math.sin(u * Math.PI);
      var dir = bn.multiplyScalar(Math.cos(a)).add(nn.multiplyScalar(Math.sin(a))), ww = w * (taper ? 1 - u * taper : 1) / 2;
      var p = pts[i], tan = fr.tangents[i], nl = 0, nr = 0;
      if (notch && i === n) { nl = -w * .45; }   // V-cut end: pull the centre back by offsetting one edge
      pos.push(p.x + dir.x * ww + tan.x * nl, p.y + dir.y * ww + tan.y * nl, p.z + dir.z * ww + tan.z * nl, p.x - dir.x * ww + tan.x * nr, p.y - dir.y * ww + tan.y * nr, p.z - dir.z * ww + tan.z * nr);
      uv.push(0, u * 3, 1, u * 3);
      if (i < n) { var k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
    }
    var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g;
  }
  function ribbonBow(mat, s) {
    var g = new THREE.Group(), C = function (a, closed) { return new THREE.CatmullRomCurve3(a.map(function (p) { return V(p[0], p[1], p[2] || 0); }), !!closed, 'centripetal'); };
    [-1, 1].forEach(function (sd) {
      // a teardrop loop; the ribbon face is tilted toward the viewer so it reads as satin, not a tube
      var loop = C([[sd * .02, .01, .02], [sd * .14, .15, .05], [sd * .34, .2, .04], [sd * .47, .1, 0], [sd * .44, -.04, -.02], [sd * .26, -.07, .02], [sd * .06, -.02, .03]], true);
      g.add(new THREE.Mesh(strip(loop, .2, 110, sd * .35, 0, false, sd * 1.05), mat));
      // tail: falls with one soft turn and a V-cut end, face toward the viewer
      var tail = C([[sd * .02, -.03, .06], [sd * .09, -.2, .08], [sd * .1, -.4, .05], [sd * .19, -.58, .09], [sd * .27, -.74, .05]]);
      g.add(new THREE.Mesh(strip(tail, .17, 70, sd * 1.1, .05, true, Math.PI / 2), mat));
    });
    var knot = C([[0, .1, .07], [.075, 0, .1], [0, -.1, .07], [-.075, 0, .1]], true);
    var km = new THREE.Mesh(strip(knot, .12, 40, 0), mat); km.scale.set(1, 1, .6); g.add(km);
    g.scale.setScalar(s || 1); return g;
  }
  function heartGeo() {
    var s = new THREE.Shape(); s.moveTo(0, -.5);
    s.bezierCurveTo(-.2, -.33, -.62, -.08, -.62, .2); s.bezierCurveTo(-.62, .5, -.25, .58, 0, .34);
    s.bezierCurveTo(.25, .58, .62, .5, .62, .2); s.bezierCurveTo(.62, -.08, .2, -.33, 0, -.5);
    var g = new THREE.ExtrudeGeometry(s, { depth: .06, bevelEnabled: true, bevelThickness: .09, bevelSize: .07, bevelSegments: 8, curveSegments: 24 });
    g.center(); return g;
  }

  function mount(host, o) {
    o = o || {};
    if (!window.THREE) return null;
    var R = new THREE.WebGLRenderer({ antialias: true, alpha: true }); R.setPixelRatio(Math.min(2, devicePixelRatio || 1)); R.outputEncoding = THREE.sRGBEncoding; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = .95;
    host.appendChild(R.domElement); R.domElement.style.cssText = 'width:100%;height:100%;display:block;touch-action:none';
    var scene = new THREE.Scene(); scene.environment = studioEnv(R); var cam = new THREE.PerspectiveCamera(30, 1, .1, 100); cam.position.set(0, 0, 15);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8f9a, .35));
    var key = new THREE.DirectionalLight(0xffffff, .6); key.position.set(-4, 5, 6); scene.add(key);
    var spark = new THREE.PointLight(0xffffff, .5, 20); spark.position.set(2, 1, 4); scene.add(spark);

    var root = new THREE.Group(); scene.add(root);
    var blue = satin(o.accent || 0x8cc6ea);

    // the bow body
    var pts = [P(148, 268), P(205, 215), P(300, 205), P(395, 255), P(448, 330), P(452, 400), P(470, 448), P(535, 500), P(572, 575), P(555, 655), P(500, 712)];
    var curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', .5);
    var tubeGeo = new THREE.TubeGeometry(curve, 200, .2, 28, false);
    // taper the very ends a little
    var tp = tubeGeo.attributes.position, segs = 201, rad = 29;
    for (var i = 0; i < segs; i++) {
      var u = i / (segs - 1), k = (.72 + .28 * Math.sin(Math.min(1, u / .5, (1 - u) / .5) * Math.PI / 2)), c = curve.getPointAt(u);
      for (var j = 0; j < rad; j++) { var idx = i * rad + j; tp.setXYZ(idx, c.x + (tp.getX(idx) - c.x) * k, c.y + (tp.getY(idx) - c.y) * k, c.z + (tp.getZ(idx) - c.z) * k); }
    }
    tubeGeo.computeVertexNormals();
    var gt = glitterTex();
    var silver = new THREE.MeshPhysicalMaterial({ map: gt, color: 0xf2f4f8, roughness: .3, metalness: .85, clearcoat: .5, clearcoatRoughness: .2 });
    var chrome = new THREE.MeshPhysicalMaterial({ color: 0xf5f6f9, roughness: .12, metalness: 1 });
    root.add(new THREE.Mesh(tubeGeo, silver));
    [0, 1].forEach(function (e) { var cap = new THREE.Mesh(new THREE.SphereGeometry(.15, 20, 14), silver); cap.position.copy(curve.getPointAt(e)); root.add(cap); });

    var tipTop = P(160, 282), tipBot = P(492, 718), rest = P(205, 590), head = P(615, 268);
    var dir = head.clone().sub(rest).normalize(), arrowLen = head.distanceTo(rest);

    // string: two thin cylinders meeting at the nock
    var strMat = new THREE.MeshStandardMaterial({ color: 0xf3f4f7, roughness: .3, transparent: true, opacity: .85 });
    var s1 = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, 1, 6), strMat), s2 = s1.clone(); root.add(s1, s2);
    function stretch(m, a, b) { var mid = a.clone().add(b).multiplyScalar(.5); m.position.copy(mid); m.scale.set(1, a.distanceTo(b), 1); m.quaternion.setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize()); }

    // arrow: shaft + heart head + a ribbon near the nock
    var arrow = new THREE.Group(); root.add(arrow);
    var shaft = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, arrowLen, 16), chrome); shaft.position.y = arrowLen / 2; arrow.add(shaft);
    var heart = new THREE.Mesh(heartGeo(), blue.clone()); heart.position.y = arrowLen + .32; heart.scale.setScalar(1.25); heart.position.y = arrowLen + .4; arrow.add(heart);
    var mid = ribbonBow(blue, 1.7); mid.position.set(0, .95, .06); mid.rotation.z = -Math.atan2(dir.y, dir.x) + Math.PI / 2 + .2; arrow.add(mid);
    function placeArrow(nock) { arrow.position.copy(nock); arrow.quaternion.setFromUnitVectors(V(0, 1, 0), dir); }

    // ribbons at the tips
    var b1 = ribbonBow(blue, 1.7); b1.position.copy(P(140, 262)).add(V(0, 0, .15)); b1.rotation.z = .5; 
    var b2 = ribbonBow(blue, 1.7); b2.position.copy(P(500, 735)).add(V(0, 0, .15)); b2.rotation.z = -.3; 

    // centre the whole thing
    var box = new THREE.Box3().setFromObject(root), ctr = box.getCenter(V()); root.children.forEach(function (ch) { ch.position.sub(ctr); });
    tipTop.sub(ctr); tipBot.sub(ctr); rest.sub(ctr);

    var st = { vy: o.spin || .006, vx: 0, rx: 0, ry: 0, tx: 0, ty: 0, drag: null, speed: 0, onClick: null, onSpin: null, setOpen: function () {} };
    function size() { var w = host.clientWidth, h = host.clientHeight || w; R.setSize(w, h, false); cam.aspect = w / h; cam.position.z = 15 * Math.max(1, 1 / cam.aspect); cam.updateProjectionMatrix(); }
    size(); addEventListener('resize', size);
    var el = R.domElement; el.style.cursor = 'grab';
    el.addEventListener('pointerdown', function (e) { st.drag = { x: e.clientX, y: e.clientY, m: 0 }; el.setPointerCapture(e.pointerId); });
    el.addEventListener('pointermove', function (e) { if (!st.drag) return; var dx = e.clientX - st.drag.x, dy = e.clientY - st.drag.y; st.vy = dx * .006; st.vx = dy * .003; st.drag.m += Math.abs(dx) + Math.abs(dy); st.drag.x = e.clientX; st.drag.y = e.clientY; });
    el.addEventListener('pointerup', function () { if (st.drag && st.drag.m < 5) { st.shoot(); if (st.onClick) st.onClick(); } st.drag = null; });
    addEventListener('pointermove', function (e) { st.tx = (e.clientY / innerHeight - .5) * .25; st.ty = (e.clientX / innerWidth - .5) * .35; });

    // shooting: draw → release → fly → reload
    var phase = 'rest', pt = 0, pull = 0, fly = 0, vib = 0, shots = 0;
    st.shoot = function () { if (phase !== 'rest') return; phase = 'draw'; pt = 0; };
    var t = 0, reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    (function loop() {
      t += .016;
      st.ry += reduced ? 0 : st.vy; st.rx += st.vx; st.vy += ((o.spin || .006) - st.vy) * .015; st.vx *= .92; st.rx *= .95;
      st.speed = Math.abs(st.vy); if (st.onSpin) st.onSpin(st.speed);
      root.rotation.y = Math.sin(st.ry) * .35 + st.ty; root.rotation.x = st.rx + st.tx; root.position.y = .45 + Math.sin(t * 1.1) * .1; root.position.x = -.35;
      pt += .016;
      if (phase === 'draw') { pull = Math.min(1, pt / .35); if (pt > .5) { phase = 'fly'; pt = 0; fly = 0; vib = 1; shots++; if (st.onShot) st.onShot(shots); } }
      else if (phase === 'fly') { pull = Math.max(0, pull - .25); fly += .5 + fly * .08; arrow.traverse(function (m) { if (m.material) { m.material.transparent = true; } }); if (pt > 1.1) { phase = 'reload'; pt = 0; fly = 0; } }
      else if (phase === 'reload') { if (pt > .5) { phase = 'rest'; } }
      vib *= .9;
      var back = dir.clone().multiplyScalar(-.55 * pull), wob = V(-dir.y, dir.x, 0).multiplyScalar(Math.sin(t * 60) * .08 * vib);
      var nock = rest.clone().add(back).add(wob);
      stretch(s1, tipTop, nock); stretch(s2, nock, tipBot);
      var arrowNock = rest.clone().add(back).add(dir.clone().multiplyScalar(fly));
      placeArrow(arrowNock);
      arrow.visible = phase !== 'reload' || pt > .25;
      var a = phase === 'reload' ? Math.min(1, (pt - .25) / .25) : 1;
      heart.material.opacity = a; shaft.material.opacity = 1; heart.material.transparent = a < 1;
      R.render(scene, cam); requestAnimationFrame(loop);
    })();
    return st;
  }
  return { mount: mount };
})();
