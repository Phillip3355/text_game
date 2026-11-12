"""Build numbered contact sheets from thumbnails for manual selection."""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
d = json.loads((HERE / "candidates.json").read_text())
out = HERE / "sheets"
out.mkdir(exist_ok=True)
W, H, COLS = 220, 150, 6
font = ImageFont.load_default(size=22)
for key, cands in d.items():
    n = len(cands)
    if not n:
        continue
    rows = (n + COLS - 1) // COLS
    sheet = Image.new("RGB", (COLS * W, rows * H), "white")
    draw = ImageDraw.Draw(sheet)
    for i, c in enumerate(cands):
        x, y = (i % COLS) * W, (i // COLS) * H
        p = HERE / "thumbs" / (c.get("thumb") or "")
        if c.get("thumb") and p.exists():
            try:
                im = Image.open(p).convert("RGB")
                im.thumbnail((W - 4, H - 4))
                sheet.paste(im, (x + 2, y + 2))
            except Exception:
                pass
        draw.rectangle([x + 2, y + 2, x + 34, y + 28], fill="black")
        draw.text((x + 5, y + 3), str(i), fill="yellow", font=font)
    sheet.save(out / f"{key}.jpg", quality=80)
print("ok")
