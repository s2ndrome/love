import json, re, html
D='/home/user/love/risu-themes/status-widget'
F=json.load(open(D+'/fields.json'))
names=[f[0] for f in F]
idx={n:i+1 for i,n in enumerate(names)}
def v(n): return '$%d' % idx[n]

C='#0284c7'
card='background:rgba(255,255,255,.78);border:1px solid #dbeafe;border-radius:14px;padding:10px 11px;min-width:0;'
lab=lambda t,c='#64748b',extra='': f'<div style="font-size:10px;color:{c};letter-spacing:.06em;margin-bottom:4px;{extra}">{t}</div>'
panel='background:linear-gradient(180deg,rgba(240,249,255,.9),rgba(255,255,255,.96));border:1px solid #dbeafe;border-radius:18px;padding:12px 13px;'

W = f'''<div style="background:linear-gradient(180deg,#ffffff 0%,#f8fbfd 30%,#f0f9ff 70%,#ffffff 100%);border:1px solid #dbeafe;border-radius:24px;padding:16px;margin:14px auto 4px;color:#334155;font-family:-apple-system,'Apple SD Gothic Neo','Noto Sans KR',sans-serif;font-style:normal;font-weight:400;max-width:450px;box-shadow:0 4px 20px rgba(186,230,253,.18);line-height:1.5;text-align:left;text-shadow:none;">
<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;border-bottom:1px solid rgba(186,230,253,.6);padding-bottom:8px;margin-bottom:8px;">
<div style="font-weight:900;letter-spacing:2px;color:{C};font-size:12px;text-shadow:0 0 3px rgba(255,255,255,.9),0 0 10px rgba(125,211,252,.55);">🫧 UNDERWATER SCENARIO</div>
<div style="font-size:11px;color:#64748b;">{v('날짜_정보')}<span style="margin-left:8px;color:{C};font-weight:700;">♥ {v('디데이')}</span></div>
</div>
<div style="font-size:10px;color:#64748b;font-weight:700;margin-bottom:12px;">{v('장면_태그')}</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
<div style="{card}">{lab('📍 LOCATION')}<div style="font-size:12px;">{v('촬영_장소')}</div></div>
<div style="{card}">{lab('👕 APPEARANCE')}<div style="font-size:12px;white-space:pre-line;">{v('등장_의상')}</div></div>
</div>
<div style="{panel}margin-bottom:12px;">
{lab('🌊 SURFACE RECORD',C,'font-size:11px;font-weight:700;')}
<div style="font-size:13px;color:#334155;">{v('현재_상황')}</div>
<div style="margin-top:8px;padding-top:6px;border-top:1px solid rgba(186,230,253,.5);font-size:11px;color:#0369a1;">⚓ {v('다음_일정')}</div>
<div style="margin-top:6px;font-size:11px;color:#475569;white-space:pre-line;">🫧 {v('계획')}</div>
<div style="margin-top:6px;font-size:11px;color:#64748b;white-space:pre-line;">🐚 {v('NPC_계획')}</div>
</div>
<div style="margin-bottom:12px;">
<div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px;color:#64748b;"><span>🌊 GUIDING LEVEL</span><span style="color:{C};font-weight:700;">{v('가이딩_수치')}</span></div>
<div style="background:#e0f2fe;height:8px;border-radius:999px;overflow:hidden;"><div style="background:linear-gradient(90deg,#bae6fd,#7dd3fc,#38bdf8);width:{v('가이딩_수치')};height:100%;border-radius:999px;"></div></div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
<div style="{card}">{lab('🪞 CONNECTION','#94a3b8')}<div style="font-size:12px;font-weight:700;">{v('관계_정의')}</div></div>
<div style="{card}">{lab('💭 INNER VOICE','#94a3b8')}<div style="font-size:11px;font-style:italic;">"{v('배우_해석')}"</div></div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
<div style="{card}">{lab('{{char}}',C,'font-weight:700;letter-spacing:0;')}<div style="font-size:11px;">{v('NPC_감정')}</div></div>
<div style="{card}">{lab('{{user}}',C,'font-weight:700;letter-spacing:0;')}<div style="font-size:11px;">{v('PC_감정')}</div></div>
</div>
<details style="margin:0;">
<summary style="cursor:pointer;list-style:none;text-align:center;font-size:11px;color:{C};font-weight:700;padding:6px;border-radius:999px;background:rgba(224,242,254,.7);margin-bottom:12px;">🫧 NOTE · LOG · RECEIPT 펼치기</summary>
<div style="{panel}margin-bottom:12px;">
{lab('📖 SUBMERGED NOTE',C,'font-size:11px;font-weight:700;')}
<div style="font-size:12px;">{v('메모')}</div>
<div style="margin-top:8px;color:#0369a1;font-size:12px;">✍ {v('대본_낙서')}</div>
</div>
<div style="{card}margin-bottom:12px;">{lab('🫧 FOAM LOG',C,'font-size:11px;font-weight:700;')}<div style="font-size:11px;line-height:1.45;">{v('커플_로그')}</div></div>
<div style="{card}border-style:dashed;margin-bottom:12px;">{lab('🧾 RECEIPT LOG',C,'font-size:11px;font-weight:700;')}<div style="font-size:11px;color:#475569;font-family:ui-monospace,monospace;white-space:pre-line;">{v('영수증')}</div></div>
<div style="display:flex;flex-direction:column;gap:6px;font-size:11px;color:#475569;margin-bottom:12px;">
<div>🐚 {v('오늘_TMI')}</div>
<div style="{card}white-space:pre-line;">{v('배우_인터뷰')}</div>
</div>
<div style="{card}font-size:11px;color:#475569;white-space:pre-line;">🔞 {v('SEX수치')}</div>
</details>
</div>'''

OUT = re.sub(r'>\s*\n\s*<', '><', W).replace('\n','')
# regex IN
def esc(s): return re.escape(s)
parts = [r'\[상태창\]\s*']
for i,n in enumerate(names):
    parts.append(esc(n) + r'\s*[:：]\s*([\s\S]*?)\s*')
parts.append(r'\[/상태창\]')
IN=''.join(parts)

PROMPT = '''[상태창 출력 규칙]
매 답변의 맨 마지막에, 본문이 끝난 뒤 아래 형식의 상태창을 반드시 붙인다.
- 항목 순서와 이름을 절대 바꾸지 않는다. 항목을 빼거나 추가하지 않는다.
- 각 항목은 "항목이름: 값" 형식. 값이 여러 줄이면 줄바꿈해서 쓰되 빈 줄은 넣지 않는다.
- 상태창 안에서는 마크다운(*, **, #, -)을 쓰지 않는다.
- [상태창] 으로 시작해서 [/상태창] 으로 끝낸다.

[상태창]
''' + '\n'.join(f'{n}: ({d})' for n,d,_ in F) + '\n[/상태창]\n'

sample = '[상태창]\n' + '\n'.join(f'{n}: {s}' for n,_,s in F) + '\n[/상태창]'
open(D+'/prompt.txt','w').write(PROMPT)
open(D+'/regex-in.txt','w').write(IN+'\n')
open(D+'/regex-out.html','w').write(OUT+'\n')
open(D+'/widget-readable.html','w').write(W+'\n')
open(D+'/sample-output.txt','w').write(sample+'\n')
# verify regex with JS-like python
m=re.search(IN, sample)
assert m, 'no match'
assert len(m.groups())==len(names)
print('groups',len(m.groups()), 'OUT chars', len(OUT))
