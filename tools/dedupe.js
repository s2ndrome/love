/* 붙여넣은 사진을 안전하게 받아요: 바로 복사해 두고, 한 번에 같은 사진이 두 번 들어오면 하나만 남겨요.
   (휴대폰/브라우저에 따라 사진 하나를 복사해도 PNG·JPG 두 가지로 같이 넘어오는 경우가 있어요)
   작게 그려서 픽셀을 비교하고, 똑같은 그림은 하나만 남겨요. */
window.uniqueImages = async function (files) {
  const out = [], seen = [];
  // 붙여넣은 사진은 그 순간 바로 복사해 둬요. (아이폰 등은 나중에 읽으면 그때 클립보드에 있는
  // 다른 사진이 읽혀서, 서로 다른 사진을 붙여넣어도 같은 사진으로 올라가는 일이 있었어요)
  files = await Promise.all(files.map(async (f, i) => {
    try {
      const buf = await f.arrayBuffer();
      const ext = (f.type.split('/')[1] || 'png').replace('jpeg', 'jpg');
      return new File([buf], 'paste-' + Date.now() + '-' + i + '.' + ext, { type: f.type || 'image/png' });
    } catch (e) { return f; }
  }));
  for (const f of files) {
    let fp = null;
    try {
      const bm = await createImageBitmap(f);
      const c = document.createElement('canvas'); c.width = c.height = 12;
      const g = c.getContext('2d'); g.drawImage(bm, 0, 0, 12, 12);
      fp = { r: bm.width / bm.height, d: g.getImageData(0, 0, 12, 12).data };
      bm.close && bm.close();
    } catch (e) {}
    const dup = fp && seen.some(s => Math.abs(s.r - fp.r) < 0.01 && s.d.every((v, i) => Math.abs(v - fp.d[i]) <= 24));
    if (dup) continue;
    if (fp) seen.push(fp);
    out.push(f);
  }
  return out;
};

/* 투명 배경 사진은 JPG로 바꾸지 않고 PNG 그대로 올려요 (JPG는 투명이 안 돼서 배경이 생겨요).
   크기도 그대로 두고, 픽셀만 다시 그려서 메타데이터를 전부 지워요.
   NovelAI 같은 툴이 픽셀 맨 끝 비트에 숨겨 둔 프롬프트도 같이 지워요 (눈으로는 차이가 안 보여요).
   투명한 부분이 없는 사진이면 null을 돌려줘요 → 원래대로 JPG로 압축 */
window.cleanTransparent = async function (file) {
  if (/gif$/i.test(file.type) || /\.gif$/i.test(file.name || '')) return null;
  let bm;
  try { bm = await createImageBitmap(file, { premultiplyAlpha: 'none', colorSpaceConversion: 'none' }); } catch (e) { return null; }
  const c = document.createElement('canvas'); c.width = bm.width; c.height = bm.height;
  const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(bm, 0, 0); bm.close && bm.close();
  const img = g.getImageData(0, 0, c.width, c.height), d = img.data;
  let clear = false;
  for (let i = 3; i < d.length; i += 4) if (d[i] < 255) { clear = true; break; }
  if (!clear) return null;
  for (let i = 0; i < d.length; i += 4) {
    const a = d[i + 3];
    d[i + 3] = a <= 1 ? 0 : (a | 1);                                   // 투명도 끝 비트에 숨긴 글자 지우기
    const r = (Math.random() * 8) | 0;                                  // 색 끝 비트에 숨긴 글자 지우기
    d[i] ^= r & 1; d[i + 1] ^= (r >> 1) & 1; d[i + 2] ^= (r >> 2) & 1;
  }
  g.putImageData(img, 0, 0);
  return await new Promise(res => c.toBlob(res, 'image/png'));
};
