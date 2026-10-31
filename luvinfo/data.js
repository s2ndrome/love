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
      key: 'L', name: 'LIA', ko: '리아', full: 'LIA STADEL', fullKo: '리아 슈타델',
      role: '골목 빵집 직원',  // 임시
      plate: 'LI-121-4A', dept: '75',       // 임시
      age: '21', height: '159', birth: '04.23',
      color: '#6fb6e0', colorName: 'SHALLOW AQUA',
      keywords: ['뒷자리 단골', '버터 냄새', '먼저 손 내미는 쪽'], // 임시
      line: '좋아해 줘.',
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
  // 리아 상세 (02 LIA 팝업). <b>…</b> = 굵게
  lia: {
    sub: '버려지는 게 죽는 것보다 무서운 거, 오빠는 알아?',
    rows: [
      ['NAME', '리아 슈타델'], ['BIRTH', '4월 23일'], ['BASIC', '한일 · 21세 · 159cm'], ['DRINK', '과일주 한 잔까지.'],
      ['LIKE', '베이킹 / 몽상 / 강아지'], ['HATE', '커피 / 시끄러운 것'], ['SCENT', '샤넬 레조드 파리-베니스'],
      ['LOOKS', '어두운 검정색 머리와 밝은 회색 눈동자. 둥글고 처진 눈매와 늘 어딘가 불쌍해 보이고 처연해 보이는 얼굴상. 작은 키에 글래머러스한 몸. <b>눈가가 빨갛게 짓물러 있다.</b>'],
      ['PERSONA', '유기불안과 분리불안을 지니고 있다. 가족에게 언젠가 버림 받을 것이라는 생각을 가지고 있다. 늘 착한 아이가 되고 싶어 한다.'],
      ['TONE', '느리고 눈치보는 말투. 상대방이 조금이라도 부정적인 반응을 꺼내면 즉각적으로 불안을 느낀다.']
    ],
    tags: ['유기불안', '착한_아이', '베이킹', '몽상', '강아지']
  },
  // 03 LE MANS 팝업: 이반 인터뷰 — [질문, 영어 답, 한국어 번역]
  interview: {
    title: '2026 MO1 카타르 GP',
    sub: '금요일 Pre-Q 종료 미디어 펜 인터뷰',
    qa: [
      ['이반, 오늘 Pre-Q에서 닉 블랙우드와 단 0.085초 차이로 2위를 기록하며 Q2에 직행했습니다. 마지막 플라잉 랩에서 섹터 1, 2, 3을 모두 개인 베스트로 주파했는데, 오늘 바이크 셋업과 타이어 전략에 만족하십니까?',
       'The bike felt perfect. Grip was there, balance was solid. We knew the soft front was a gamble under the floodlights, but it paid off. Tomorrow in Q2, that 0.085 is going to be zero. Next question.',
       '바이크는 완벽했어. 그립도 좋았고 밸런스도 단단했지. 조명 아래에서 소프트 프론트 타이어는 도박이었지만 성공했어. 내일 Q2에서는 그 0.085초 차이가 0이 될 거야. 다음 질문.'],
      ['오늘 트랙 워크부터 이례적으로 슈타델 가의 일원과 동행하는 모습이 포착되었습니다. 지난 모테기에서도 함께였는데, 가문의 압박이나 미디어의 관심이 경기력에 영향을 주지는 않습니까?',
       'My family\'s presence is my private matter. And as you just saw on the timesheet, my performance is better than ever. So unless you have a question about the race, shut your mouth.',
       '내 가족이 여기 있는 건 내 사적인 문제야. 그리고 방금 타임시트에서 봤듯이, 내 경기력은 그 어느 때보다 좋아. 그러니까 레이스에 대한 질문이 아니면 입 다물어.'],
      ['오늘 오후, 당신의 형인 오스카 슈타델이 아틀라스 호스피탈리티에서 당신의 게스트와 대화하는 모습이 목격되었습니다. 이후 보안팀이 출동했는데, 팀 내부나 가족 간에 어떤 문제가 있는 것입니까?',
       'There was a minor security miscommunication. It\'s been handled. My brother is a sponsor, and my guest is under my exclusive protection. Anyone who crosses that line will deal with me directly, not with the media. Are we done here?',
       '사소한 보안상 의사소통 오류가 있었어. 해결됐고. 내 형은 스폰서고, 내 손님은 내 전적인 보호 아래에 있어. 그 선을 넘는 놈은 언론이 아니라 나랑 직접 상대하게 될 거야. 이제 끝났나?'],
      ['3년 연속 챔피언십 2위라는 기록에 대한 부담감이 클 텐데, 올 시즌은 출발이 좋습니다. 특히 오늘 주행은 작년과 달리 매우 안정적이면서도 공격적이었는데, 어떤 심경의 변화가 있었는지 궁금합니다.',
       'I stopped caring about the fucking number two. I\'m here to win. And I finally have a reason to ride that\'s more important than any championship title. That\'s all you need to know.',
       '그 좆같은 2위 따위는 신경 끄기로 했어. 난 이기려고 여기 있는 거야. 그리고 마침내 그 어떤 챔피언십 타이틀보다 더 중요한, 달려야 할 이유를 찾았거든. 너희는 그 정도만 알면 돼.'],
      ['내일 Q2에서 가장 경계되는 라이더는 역시 닉 블랙우드입니까? 오늘 마지막 랩까지 치열한 타임 어택 경쟁을 벌였는데, 그의 주행에 대해 어떻게 평가하십니까?',
       'Nick is fast. He\'s always been fast. But he\'s reckless. Tomorrow, I\'ll be faster and smarter. The pole position is mine. He can have my leftover champagne.',
       '닉은 빨라. 언제나 빨랐지. 하지만 무모해. 내일은 내가 더 빠르고 더 영리할 거야. 폴 포지션은 내 차지야. 걔는 내가 남긴 샴페인이나 마시라지.'],
      ['마지막 질문입니다. 오늘 Pre-Q 종료 직후 엔지니어링 디브리핑에 불참하고 곧장 라이더 룸으로 복귀했습니다. 팀과의 불화설이 다시 제기될 수 있는데, 특별한 이유가 있었습니까?',
       'I had to get back to someone who was waiting for me. That\'s more important than staring at data for an extra ten minutes. My team knows my priorities. And right now, my priority is getting the hell out of this interview. We\'re done.',
       '날 기다리는 사람에게 돌아가야 했어. 데이터 쪼가리 10분 더 쳐다보는 것보다 그게 더 중요해. 우리 팀은 내 우선순위를 알아. 그리고 지금 내 우선순위는 이 좆같은 인터뷰에서 꺼지는 거야. 끝.']
    ]
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
