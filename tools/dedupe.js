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
