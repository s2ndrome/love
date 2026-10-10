/* 커플 옷장 — 세트를 고르면 두 사람이 그 옷으로 갈아입어요.
   새 세트 추가: 1024×1024 JPG를 img/closet/에 넣고 SETS에 한 줄 추가하면 돼요.
   sub는 이름 옆에 작게 붙는 글자예요 (예: 여름 ver) */
(function () {
  var SETS = [
    { name: '기본', img: 'img/closet/basic.jpg' },
    { name: '제복', img: 'img/closet/uniform.jpg' },
    { name: '파자마', sub: '여름 ver', img: 'img/closet/pajama.jpg' },
    { name: '교복', sub: '여름 ver', img: 'img/closet/school.jpg' },
    { name: '화이트룩', img: 'img/closet/white.jpg' },
    { name: '사복', sub: '여름 ver', img: 'img/closet/casual-summer.jpg' },
    { name: '사복', sub: '겨울 ver', img: 'img/closet/casual-winter.jpg' },
    { name: '마린룩', img: 'img/closet/marine.jpg' },
    { name: '동화 속', img: 'img/closet/fairytale.jpg' },
    { name: '천악', img: 'img/closet/angel-devil.jpg' },
    { name: '고딕', img: 'img/closet/gothic.jpg' },
    { name: '하라주쿠', img: 'img/closet/harajuku.jpg' },
    { name: '포근룩', img: 'img/closet/cozy.jpg' }
  ];

  function mount(host) {
    var cur = 0;
    host.innerHTML =
      '<div class="du"><div class="du-stage"><img id="duImg" src="' + SETS[0].img + '" alt="SYNDROME & LIA" draggable="false"></div>' +
      '<div class="du-side"><h5 class="du-h">CLOSET</h5><div class="du-sets">' + SETS.map(function (s, i) {
        return '<button data-i="' + i + '"' + (i ? '' : ' class="on"') + '><span><i>' + String(i + 1).padStart(2, '0') + '</i>' + s.name + (s.sub ? ' <small>' + s.sub + '</small>' : '') + '</span></button>';
      }).join('') + '</div></div></div>';
    var img = host.querySelector('#duImg');
    SETS.forEach(function (s) { new Image().src = s.img; }); // 미리 불러와서 바로 갈아입게
    host.querySelectorAll('[data-i]').forEach(function (b) {
      b.onclick = function () {
        cur = +b.dataset.i; img.classList.remove('swap'); void img.offsetWidth; img.src = SETS[cur].img; img.classList.add('swap');
        host.querySelectorAll('[data-i]').forEach(function (x) { x.classList.toggle('on', x === b); });
      };
    });
  }
  window.Dressup = { mount: mount, SETS: SETS };
})();
