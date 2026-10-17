/* 붙여넣기 한 번에 같은 사진이 두 번 들어오는 걸 막아요.
   (휴대폰/브라우저에 따라 사진 하나를 복사해도 PNG·JPG 두 가지로 같이 넘어오는 경우가 있어요)
   작게 그려서 픽셀을 비교하고, 똑같은 그림은 하나만 남겨요. */
window.uniqueImages = async function (files) {
  const out = [], seen = [];
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
