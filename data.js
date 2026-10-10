/* shared content for every concept — mirrors data/*.json of syndrome.com */
window.SYN = {
  brand: 'SYNDROME ୨୧ LIA',
  handle: '@syndrome',
  sub: 'yujin Archive',
  about: {
    title: 'ARCH SYNDROME ♡',
    lines: ['⁰ SEOL', '¹ ONLY 및 동담불가 성향 / 메인 기준 최대 1T2D 유지', '² 상호 직멘 및 유입까지 배려 원해요.'],
    img: 'img/seol.jpg'
  },
  playlist: ['BURN WITH ME', 'Set me free', 'Hold Me Under'],
  chars: [
    { id: 'sd', name: 'SYNDROME', ko: '신드롬', threat: 'CATASTROPHIC', attr: '불 (Pyre)', cls: 'S-Class Vanguard (Team 2)', age: '27세 / 대한민국', img: 'img/sd.jpg',
      quote: '가장 높은 곳에서 추락하여, 가장 뜨거운 곳에서 눈을 떴다. 코드네임 신드롬. 잿더미 위에서 타오르는 그의 분노는, 세상을 향한 가장 화려하고 무례한 해방선언이다.',
      ability: '프로미넌스 (Prominence)' },
    { id: 'lia', name: 'LIA', ko: '리아', threat: 'ETERNAL OCEAN', attr: '물 (Aqua)', cls: 'S-Class Elemental Guide', age: '21세 / 한국', img: 'img/lia.jpg',
      quote: '질식할 만큼 감미롭고, 파괴적일 만큼 고요하다. 코드네임 리아. 그녀가 선사하는 정화는 영혼을 집어 삼키는 해일이며, 그 깊은 수평선 아래에서 모든 반항은 포말이 되어 사라진다.',
      ability: '심해의 요람 (Abyssal Cradle)' }
  ],
  log: [['상견례',1],['소꿉친구 AU'],['더티토크',1],['수인화',1],['당근마켓에 남편 물건 팔아버리기'],['2세와 통화'],['리아 기록 말소',1],['멘헤라력',1],['신드롬의 우선순위',1],['푸들 머리 해 줘!'],['때려주라고 해도 안 때려주잖아',1],['별 따줘'],['반지 던져버리기'],['2세의 일기',1],['역시 착한남자가 최고지!'],['신드롬 한정판 아크릴 스탠드 12종 세트'],['남편 몰래 새벽에 치킨 시킴'],['꿈빛 파티시엘 AU'],['띵동-! [엽기적인그녀의떡볶이] 주문이 접수되었습니다!'],['300만원 사기당함'],['EMO LIA'],['헛둘헛둘 재롱잔치'],['상상임신'],['성유진 vs 강동원'],['사인']],
  ooc: ['강아지 샴푸','IF 짝사랑','서방님 쪼아대기','바보 여자친구','이상형 마주치게 하기','직장 내 괴롭힘으로 신고하기','입금자명','캬엉캬옹','제복에 와펜 붙이기','돌 던지고 튀기','미안하다 사랑한다','도둑놈, 쓰레기','당근마켓 내보내기','아기가 울지도 않고 의젓하네요…','킥보드 타다가 비둘기랑 충돌함'],
  share: ['[V5] 일하는데 방해하는 2인 프롬프트 공유','03. Characters','무릎 위에 앉아 끌어안는 프롬프트','인형 껴안는 프롬프트'],
  gallery: [83,82,81,80,78,77,76,74,72].map(function (n, i) { return { n: n, src: 'img/g' + (i + 1) + '.jpg' }; }),
  links: [['Twitter','https://twitter.com/SEONGYUJlN'],['Tistory','http://syndrome.love']]
};

/* small markup helpers; each concept styles these classes its own way */
SYN.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
SYN.logList = function (unlocked) {
  return '<ol class="syn-list">' + SYN.log.map(function (e, i) {
    var lock = e[1] && !unlocked;
    return '<li class="' + (lock ? 'is-locked' : (e[1] ? 'is-open' : '')) + '"><span class="syn-n">' + String(SYN.log.length - i).padStart(2, '0') + '</span><span class="syn-t">' + SYN.esc(e[0]) + '</span><span class="syn-s">' + (e[1] ? (unlocked ? '◇ OPEN' : '◆ LOCK') : '') + '</span></li>';
  }).join('') + '</ol>';
};
SYN.plainList = function (arr) {
  return '<ol class="syn-list">' + arr.map(function (t, i) { return '<li><span class="syn-n">' + String(i + 1).padStart(2, '0') + '</span><span class="syn-t">' + SYN.esc(t) + '</span></li>'; }).join('') + '</ol>';
};
SYN.charSheet = function (c) {
  return '<div class="syn-char"><img src="' + c.img + '" alt="' + c.name + '"><div class="syn-char-body">' +
    '<p class="syn-eyebrow">S-CLASS ENTITY · THREAT LEVEL: ' + c.threat + '</p><h3>' + c.name + ' <small>' + c.ko + '</small></h3>' +
    '<p class="syn-quote">‘' + SYN.esc(c.quote) + '’</p><dl>' +
    '<dt>Classification</dt><dd>' + c.cls + '</dd><dt>Attribute</dt><dd>' + c.attr + '</dd><dt>Age</dt><dd>' + c.age + '</dd><dt>Ability</dt><dd>' + c.ability + '</dd></dl></div></div>';
};
SYN.aboutSheet = function () {
  return '<div class="syn-char"><img src="' + SYN.about.img + '" alt="SEOL"><div class="syn-char-body"><p class="syn-eyebrow">OWNER</p><h3>' + SYN.about.title + '</h3><p>' + SYN.about.lines.join('<br>') + '</p>' +
    '<p class="syn-eyebrow" style="margin-top:1.2em">PLAYLIST</p><ol class="syn-list">' + SYN.playlist.map(function (t, i) { return '<li><span class="syn-n">0' + (i + 1) + '</span><span class="syn-t">' + t + '</span></li>'; }).join('') + '</ol>' +
    '<p class="syn-links">' + SYN.links.map(function (l) { return '<a href="' + l[1] + '" target="_blank" rel="noopener">' + l[0] + ' ↗</a>'; }).join(' ') + '</p></div></div>';
};
SYN.galleryGrid = function () {
  return '<div class="syn-grid">' + SYN.gallery.map(function (g) { return '<figure><img src="' + g.src + '" alt="IMAGE ' + g.n + '" loading="lazy"><figcaption>IMAGE ' + g.n + '</figcaption></figure>'; }).join('') + '</div>';
};
SYN.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
