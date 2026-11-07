# RisuAI 채팅 테마 6종

리스 기본 화면의 실제 class(`default-chat-screen`, `risu-chat`, `chattext`, `mark[risu-mark]`)에 맞춘 테마.
프로필 사진을 숨기고 메시지 사이 칸 없이 채팅 화면 전체가 한 장으로 이어진다.
테마마다 `.html`(장식)과 `.css`(화면 색 + 본문 글씨)가 한 쌍. `preview.html`로 미리 볼 수 있다.

| 테마 | 이름 | 느낌 |
|---|---|---|
| 01-novel | 문고본 | 미색 종이, 고운바탕, 하늘색 대사 |
| 02-editorial | 에디토리얼 | 흰 지면, 파란 포인트, 헤더에 {{char}}·날짜 |
| 03-sclass | S급 기록 | 검정 + 주황, 네 귀퉁이 브래킷 |
| 04-messenger | 메신저 | 상단바에 {{char}}, 대사 말풍선 |
| 05-bedtime | 새벽 네 시 | 남색 밤 + 스탠드 주황빛, 별, 달 |
| 06-rushes | 러시스 | 레터박스, 필름 구멍, 영화 자막 |

## 적용

- 간단하게: HTML 뒤에 CSS를 `<style>…</style>`로 붙여서 캐릭터 설정의 배경 임베딩에 넣는다.
- 따로: HTML은 배경 임베딩, CSS는 설정 → 디스플레이 → 커스텀 CSS.
- 대사는 리스가 자동으로 붙이는 `mark[risu-mark]`를 잡으므로 정규식이 필요 없다.
- `{{char}}`, `{{date::YYYY.MM.DD}}`는 리스가 실제 값으로 바꾼다.

리스 class 선택자는 `[class~="chattext"]`처럼 속성 선택자로 써서, 리스가 class 앞에 `x-risu-`를 붙여도 영향을 받지 않는다.
