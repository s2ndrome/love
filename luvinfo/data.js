/* YVAN ୨୧ LIA — 러브인포 시안 6종이 같이 쓰는 내용.
   여기만 고치면 a~f 시안 전부에 반영돼요.
   ※ 표시(임시)가 붙은 값은 자리 채우기용 예시라서 실제 설정으로 바꿔 주세요. */
window.LUV = {
  pair: 'YVAN ୨୧ LIA',
  pairKo: '이반 ୨୧ 리아',
  since: '2026-03-14',              // 임시: 처음 만난 날 / 연성 시작일 (D+ 계산용)
  tagline: '운전은 이반, 뒷자리는 리아', // 임시
  city: 'PARIS',
  bike: { model: 'CAFÉ RACER', cc: '900', year: '1974', color: 'NOIR / CHROME' }, // 임시: 이반의 바이크
  chars: [
    {
      key: 'Y', name: 'YVAN', ko: '이반',
      role: '라이더 · 바이크 정비사',  // 임시
      plate: 'YV-211-AN', dept: '75',       // 임시: 프랑스식 번호판 (75 = 파리)
      age: '27', height: '188', birth: '02.11',   // 임시
      color: '#2b3a67', colorName: 'MIDNIGHT INK', // 임시
      keywords: ['가죽 재킷', '무심한 다정', '헬멧은 늘 두 개'], // 임시
      line: '타. 해 뜨기 전에 바다까지 데려다줄게.',          // 임시
      likes: '새벽 국도, 엔진 정비, 리아의 잔소리',  // 임시
      dislikes: '비 오는 날 주행, 소란'              // 임시
    },
    {
      key: 'L', name: 'LIA', ko: '리아',
      role: '골목 빵집 직원',  // 임시
      plate: 'LI-121-4A', dept: '75',       // 임시
      age: '21', height: '162', birth: '12.14',
      color: '#6fb6e0', colorName: 'SHALLOW AQUA',
      keywords: ['뒷자리 단골', '버터 냄새', '먼저 손 내미는 쪽'], // 임시
      line: '오늘 첫 크루아상은 네 거야. 대신 천천히 달려.',              // 임시
      likes: '갓 구운 바게트, 센 강 산책, 이반의 등', // 임시
      dislikes: '혼자 남겨지는 밤'                    // 임시
    }
  ],
  route: [ // 둘이 자주 가는 길 (임시) — ['지명', km]
    ['PARIS', 0], ['ROUEN', 135], ['HONFLEUR', 190], ['DEAUVILLE', 204]
  ],
  bakery: [ // 리아네 빵집 메뉴판 (임시) — ['메뉴', '가격 €']
    ['CROISSANT', '1.40'], ['PAIN AU CHOCOLAT', '1.60'], ['BAGUETTE TRADITION', '1.30'], ['CAFÉ CRÈME', '2.80']
  ],
  relation: [ // 관계 키워드 / 설정 (임시)
    '첫 만남은 빵집 앞에 세워 둔 바이크 때문에.',
    '매일 새벽 6시, 이반은 빵집 앞에서 시동을 끄고 기다린다.',
    '싸우면 먼저 연락하는 건 리아, 먼저 찾아가는 건 이반.',
    '서로를 부르는 호칭: 이반 → “리아야”, 리아 → “반아”.'
  ],
  notice: [ // 안내 (임시)
    'ONLY 성향이에요. 동담은 어려워요.',
    '연성 · 썰은 자유롭게 이용 가능, 출처만 남겨 주세요.',
    '문의는 DM으로 편하게 주세요.'
  ],
  links: [ // ['이름', '주소'] (임시)
    ['Twitter', 'https://twitter.com/'],
    ['Tistory', 'https://syndrome.love/'],
    ['Info', 'https://luvinfo.me/']
  ]
};
LUV.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
LUV.days = function () {
  var a = new Date(LUV.since + 'T00:00:00'), b = new Date(); b.setHours(0, 0, 0, 0);
  return Math.floor((b - a) / 864e5) + 1;
};
LUV.reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
