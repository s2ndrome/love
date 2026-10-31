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
      key: 'Y', name: 'YVAN', ko: '이반', full: 'YVAN STADEL', fullKo: '이반 슈타델',
      role: '라이더 · 바이크 정비사',  // 임시
      plate: 'YV-211-AN', dept: '75',       // 임시: 프랑스식 번호판 (75 = 파리)
      age: '25', height: '186', birth: '02.18',
      color: '#2b3a67', colorName: 'MIDNIGHT INK', // 임시
      keywords: ['가죽 재킷', '무심한 다정', '헬멧은 늘 두 개'], // 임시
      line: '씨발, 또 2등?',
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
  // 이반 상세 (01 YVAN 팝업). <b>…</b> = 굵게
  yvan: {
    tiles: [['NAME', '이반 슈타델'], ['RIDER NAME', '이반'], ['BASIC', '프랑스 · 25세 · 186cm'], ['TEAM', '아틀라스 No.2']],
    looks: [
      '짙은 회색 머리와 새까만 눈동자, 창백한 피부. 날카롭게 찢어진 눈매와 조각처럼 또렷한 이목구비. 길고 단단하게 다져진 몸. <b>가만히 서 있기만 해도 위에서 내려다보는 것 같은 얼굴.</b>',
      '어두운 톤의 니트와 셔츠, 테일러드 슬랙스. <b>로고 하나 없이도 소재와 핏에서 값이 드러나는 옷</b>을 입는다.'
    ],
    personality: [
      '지독하게 냉소적이고 오만하다.<br>완벽주의에 자존심이 하늘을 찌른다. 세 시즌 연속 준우승이 남긴 건 굴욕과 열등감뿐. 칭찬은 의심하고, 위로는 동정으로 받아들인다.'
    ],
    habits: [
      '<b>짧고 건조한 말투.</b> 비꼬는 말은 정확하고 유려하다.',
      '스트레스가 쌓이면 담배를 줄줄이 태운다. 끊을 생각은 없다.'
    ],
    off: [['BIRTH', '2월 18일'], ['LIKE', '레몬 타르트 / 체스 / 날 귀찮게 하지 않는 것'], ['HATE', '2등 / 미지근한 커피 / {{user}}'], ['SCENT', '프라다 인퓨전 디리스 세드르'], ['DRINK', '와인은 사교용. <b>주량은 형편없다.</b>']],
    race: {
      head: '씨발, 또 2등?',
      sub: '이제 슬슬 참을성의 한계가 몰려오기 시작했다.',
      lean: '코너에 억지로 쑤셔 넣고, 미끄러지면 손으로 억지로 붙잡는다.',
      style: '풀 스로틀 모드',
      styleText: '참을성은 바닥, 스로틀은 끝까지.<br>앞에 누가 있으면 일단 꽂고 본다.<br>안정성이 철학인 팀과는 늘 삐걱인다.',
      timeline: [
        ['2022', '21세', '', '아틀라스 팩토리 데뷔.'],
        ['2023', '22세', 'P2', '그랑프리 우승만 여러 번. 그리고 나인에게 밀려 준우승.'],
        ['2024', '', 'P2', '이번엔 에이트. 또 준우승.'],
        ['2025', '', 'P2', '세븐. 세 시즌 연속 준우승, 세 번 다 다른 챔피언.'],
        ['현재', '', '', '다섯 번째 시즌. 올해는. 올해만큼은.']
      ]
    }
  },
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
