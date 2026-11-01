# rock 시안 6종 빌더: 공통 머리 + 시안별 CSS/본문/스크립트 → r1.html ~ r6.html
import os, json
D = os.path.dirname(os.path.abspath(__file__))
def page(name, title, fonts, css, body, js='', three=False, popchrome=''):
    head = f'''<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{fonts}&family=Noto+Sans+KR:wght@400;500;700;900&family=IBM+Plex+Mono:wght@400;500&family=Big+Shoulders+Display:wght@700;900&family=Barlow+Condensed:ital,wght@0,500;0,600;1,500;1,600&display=swap">
<link rel="stylesheet" href="../rock-pop.css">
<style>
* {{ box-sizing: border-box; }}
html, body {{ margin: 0; }}
button {{ font: inherit; color: inherit; }}
#wins {{ position: fixed; inset: 0; pointer-events: none; z-index: 40; }}
.lw {{ position: absolute; width: 400px; max-width: calc(100vw - 24px); pointer-events: auto; }}
.lw-bar {{ display: flex; justify-content: space-between; align-items: center; cursor: move; touch-action: none; }}
.lw-body {{ max-height: 72vh; overflow: auto; }}
.lw-x {{ cursor: pointer; }}
{css}
{popchrome}
@media (prefers-reduced-motion: reduce) {{ *, *::before, *::after {{ animation: none !important; transition: none !important; }} }}
</style>
</head>
<body>
{body}
<div id="wins"></div>
{'<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>' if True else ''}
<script src="../data.js"></script>
<script src="../kit.js"></script>
<script src="../rock-pop.js"></script>
<script>
(function () {{
  var L = LUV, K = KIT, e = L.esc;
  ROCK.bind();
{js}
}})();
</script>
</body>
</html>
'''
    open(os.path.join(D, name), 'w').write(head)
