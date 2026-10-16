/* 홈페이지 관리 팝업 안에서 열릴 때(?embed=1) 툴 화면을 팝업에 맞게 정리해요.
   - 제목, 설명, 토큰 안내를 숨기고 배경/여백을 없애요
   - 토큰이 이미 저장돼 있으면 토큰 칸도 숨겨요
   - 토큰을 새로 넣으면 바로 저장해요 (홈에 관리 메뉴가 생기게) */
(function () {
  if (!/[?&]embed\b/.test(location.search)) return;
  document.documentElement.classList.add('embed');
  var css = document.createElement('style');
  css.textContent =
    'html.embed body{padding:6px 2px 24px;background:transparent;min-height:0}' +
    'html.embed main{max-width:none;box-shadow:none;padding:4px 10px;background:transparent;border-radius:0}' +
    'html.embed main>h1,html.embed main>p.hint,html.embed main>details{display:none}' +
    'html.embed.has-token label[for=token],html.embed.has-token #token{display:none}' +
    'html.embed main>label:first-of-type{margin-top:4px}';
  document.head.appendChild(css);
  var has = false;
  try { has = !!localStorage.getItem('gh_token'); } catch (e) {}
  if (has) document.documentElement.classList.add('has-token');
  document.addEventListener('DOMContentLoaded', function () {
    var t = document.getElementById('token');
    if (t) t.addEventListener('change', function () { try { if (t.value.trim()) localStorage.setItem('gh_token', t.value.trim()); } catch (e) {} });
  });
})();
