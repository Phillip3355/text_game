"""Stage 2 of the media pipeline.

Reads selection.json, re-fetches each file's metadata from Wikimedia Commons
(license is re-checked here), downloads a 1280px (a standard Commons thumbnail size) and an 800px rendition of
every photo plus Commons' own WebM/MP4 transcodes and a poster for every
video, and writes src/content/media.ts.

Run:  python3 -I scripts/media/build_media.py
"""
import io
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
OUT_DIR = ROOT / "public" / "media"
TS_OUT = ROOT / "src" / "content" / "media.ts"
API = "https://commons.wikimedia.org/w/api.php"
UA = "ShanghaiJourneyGame/0.1 (educational text game; build-time media script)"
ALLOWED = re.compile(r"^(cc0|public domain|pd|cc by(-sa)? \d\.\d)", re.I)


def get(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(8):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                data = r.read()
                return data if binary else json.loads(data)
        except Exception as e:  # noqa: BLE001
            print("  retry", attempt, e, file=sys.stderr)
            time.sleep(30 * (attempt + 1))
    raise RuntimeError("failed: " + url)


def api(params):
    params = {**params, "format": "json", "formatversion": "2"}
    return get(API + "?" + urllib.parse.urlencode(params))


def strip(s):
    s = re.sub(r"<[^>]+>", "", s or "")
    return re.sub(r"\s+", " ", s).strip()


def meta(info):
    md = info.get("extmetadata") or {}
    lic = strip((md.get("LicenseShortName") or {}).get("value"))
    if not ALLOWED.match(lic):
        raise SystemExit(f"license not allowed: {lic}")
    author = strip((md.get("Artist") or {}).get("value")) or strip((md.get("Credit") or {}).get("value")) or "Unknown"
    if len(author) > 90:
        author = author[:87] + "…"
    return {
        "license": lic,
        "licenseUrl": strip((md.get("LicenseUrl") or {}).get("value")),
        "author": author,
        "sourceUrl": info["descriptionurl"],
    }


def fetch_info(titles, video=False):
    out = {}
    for i in range(0, len(titles), 20):
        chunk = titles[i : i + 20]
        if video:
            r = api({"action": "query", "titles": "|".join(chunk), "prop": "videoinfo",
                     "viprop": "url|extmetadata|derivatives", "viurlwidth": 1280})
            key = "videoinfo"
        else:
            r = api({"action": "query", "titles": "|".join(chunk), "prop": "imageinfo",
                     "iiprop": "url|extmetadata|size", "iiurlwidth": 1280})
            key = "imageinfo"
        norm = {n["to"]: n["from"] for n in r["query"].get("normalized", [])}
        for p in r["query"]["pages"]:
            if p.get("missing"):
                raise SystemExit("missing file: " + p["title"])
            out[norm.get(p["title"], p["title"])] = p[key][0]
        time.sleep(1)
    return out


def save_jpeg(data, path, width):
    im = Image.open(io.BytesIO(data))
    im = im.convert("RGB")
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "JPEG", quality=80, optimize=True, progressive=True)
    return im.width, im.height


def ts_str(s):
    return json.dumps(s, ensure_ascii=False)


def main():
    sel = json.loads((HERE / "selection.json").read_text())
    cands = json.loads((HERE / "candidates.json").read_text())
    entries = []

    # photos
    img_titles = {}
    for mid, (src, idx, loc, caption) in sel["images"].items():
        title = src["title"] if isinstance(src, dict) else cands[src][idx]["title"]
        img_titles[mid] = (title, loc, caption)
    infos = fetch_info(sorted({t for t, _, _ in img_titles.values()}))
    for mid, (title, loc, caption) in img_titles.items():
        info = infos[title]
        m = meta(info)
        big = OUT_DIR / "img" / f"{mid}.jpg"
        small = OUT_DIR / "img" / f"{mid}-800.jpg"
        if not big.exists() or not small.exists():
            data = get(info["thumburl"], binary=True)
            save_jpeg(data, big, 1280)
            save_jpeg(data, small, 800)
            time.sleep(1)
        w, h = Image.open(big).size
        entries.append({"id": mid, "kind": "image", "src": f"media/img/{mid}.jpg", "srcSmall": f"media/img/{mid}-800.jpg",
                        "width": w, "height": h, "location": loc, "caption": caption, **m})
        print("img", mid, m["license"], flush=True)

    # videos
    vids = sel["videos"]
    vinfos = fetch_info([v[0] for v in vids.values()], video=True)
    for mid, (title, loc, caption, _events) in vids.items():
        info = vinfos[title]
        m = meta(info)
        ders = {d.get("transcodekey"): d for d in info.get("derivatives", [])}
        webm = ders.get("480p.vp9.webm") or ders.get("360p.vp9.webm")
        mov = ders.get("360p.mpeg4.mov")
        if not webm:
            raise SystemExit("no webm transcode for " + title)
        sources = []
        for d, ext, typ in [(webm, "webm", "video/webm"), (mov, "mov", "video/mp4")]:
            if not d:
                continue
            path = OUT_DIR / "video" / f"{mid}.{ext}"
            if not path.exists():
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(get(d["src"], binary=True))
                time.sleep(1)
            sources.append({"src": f"media/video/{mid}.{ext}", "type": typ})
        poster = OUT_DIR / "video" / f"{mid}-poster.jpg"
        if not poster.exists():
            save_jpeg(get(info["thumburl"], binary=True), poster, 1280)
        entries.append({"id": mid, "kind": "video", "src": sources[0]["src"], "sources": sources,
                        "poster": f"media/video/{mid}-poster.jpg", "location": loc, "caption": caption, **m})
        print("video", mid, m["license"], [s["src"] for s in sources], flush=True)

    lines = [
        "// GENERATED by scripts/media/build_media.py — do not edit by hand.",
        "// Every file comes from Wikimedia Commons under the license listed with it.",
        "import type { MediaAsset } from '../engine/types'",
        "",
        "const list: Omit<MediaAsset, 'events'>[] = [",
    ]
    for e in entries:
        lines.append("  " + json.dumps(e, ensure_ascii=False) + ",")
    lines += [
        "]",
        "",
        "export const media: Record<string, MediaAsset> = Object.fromEntries(list.map((m) => [m.id, { ...m, events: [] }]))",
        "",
    ]
    TS_OUT.write_text("\n".join(lines))
    print(f"wrote {len(entries)} entries to {TS_OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
