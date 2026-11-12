"""Search Wikimedia Commons for freely licensed Shanghai photos/videos.

Stage 1 of the media pipeline: writes candidate metadata (no downloads of
full files) to scripts/media/candidates.json plus small thumbnails used to
build contact sheets for manual selection.

Only files whose license is CC0, Public domain, CC BY or CC BY-SA are kept.
"""
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

API = "https://commons.wikimedia.org/w/api.php"
UA = "ShanghaiJourneyGame/0.1 (educational text game; build-time media script)"
HERE = Path(__file__).resolve().parent
OUT = HERE / "candidates.json"
THUMBS = HERE / "thumbs"

ALLOWED = re.compile(r"^(cc0|public domain|pd|cc by(-sa)? [1-4]\.0|cc by(-sa)? 2\.5|cc by(-sa)? 2\.0|cc by(-sa)? 3\.0)", re.I)

# location key -> list of search queries
QUERIES = {
    "airport": ["Shanghai Pudong International Airport terminal interior", "Shanghai Maglev train"],
    "bund": ["The Bund Shanghai buildings", "Bund Shanghai promenade", "Customs House Shanghai Bund"],
    "nanjing_road": ["Nanjing Road pedestrian street Shanghai", "Nanjing Road Shanghai night"],
    "yuyuan": ["Yu Garden Shanghai", "Yuyuan Garden rockery", "Huxinting teahouse Shanghai", "Nine-turn bridge Yuyuan"],
    "xiaolongbao": ["Xiaolongbao Shanghai", "Nanxiang steamed bun restaurant", "Xiaolongbao"],
    "lujiazui": ["Lujiazui skyline", "Shanghai Tower Lujiazui", "Lujiazui pedestrian bridge"],
    "metro": ["Shanghai Metro station platform", "Shanghai Metro train interior", "Shanghai Metro map"],
    "xintiandi": ["Xintiandi Shanghai", "Shikumen Xintiandi", "Site of the First National Congress of the Communist Party of China"],
    "zhujiajiao": ["Zhujiajiao water town", "Fangsheng Bridge Zhujiajiao", "Zhujiajiao canal boat"],
    "museum": ["Shanghai Museum People's Square", "Shanghai Museum bronze ding", "Shanghai Museum gallery"],
    "shengjian": ["Shengjian mantou", "Shengjianbao", "Sheng jian bao pan"],
    "huangpu_night": ["Huangpu River night Shanghai", "Huangpu River ferry", "Bund night skyline Pudong"],
    "oriental_pearl": ["Oriental Pearl Tower", "Oriental Pearl Tower observation deck"],
    "tianzifang": ["Tianzifang", "Taikang Road Tianzifang alley"],
    "wukang": ["Wukang Mansion", "Wukang Road Shanghai", "Normandie Apartments Shanghai"],
    "breakfast": ["Youtiao", "Cifantuan", "Doujiang soy milk breakfast", "Shanghai breakfast street"],
    "local": ["Fuxing Park Shanghai", "People's Park Shanghai", "Shanghai park mahjong elderly"],
    "streets": ["Shanghai street plane trees", "Shanghai street scene", "Hengshan Road Shanghai"],
    "lilong": ["Shanghai lilong", "Shanghai longtang alley", "Shikumen alley laundry Shanghai"],
    "waibaidu": ["Waibaidu Bridge", "Bund sunrise Shanghai"],
    # second pass: food photos actually taken in Shanghai
    "breakfast_sh": ["Shanghai breakfast youtiao", "粢饭团 上海", "大饼油条", "Shanghai breakfast stall", "Shanghai soy milk breakfast", "Cifantuan Shanghai"],
    "shengjian_sh": ["Shengjian Shanghai", "Yang's Fry Dumpling", "小杨生煎", "生煎 上海", "Shengjianbao Shanghai restaurant"],
    "huanghe": ["Huanghe Road Shanghai", "Huanghe Road food street"],
    "hongshaorou": ["Hongshao rou Shanghai", "红烧肉 上海", "Shanghai cuisine braised pork"],
    "gaotuan": ["Shen Dacheng Shanghai", "Shanghai No. 1 Food Store", "Nanjing Road food store Shanghai"],
    "zongzi_zjj": ["Zhujiajiao zongzi", "Zhujiajiao food street"],
}

VIDEO_QUERIES = {
    "video_bund": ["Bund Shanghai filetype:video", "Huangpu River filetype:video"],
    "video_lujiazui": ["Lujiazui filetype:video", "Shanghai skyline filetype:video"],
    "video_metro": ["Shanghai Metro filetype:video", "Shanghai Maglev filetype:video"],
    "video_street": ["Shanghai street filetype:video", "Zhujiajiao filetype:video", "Nanjing Road filetype:video"],
}


def api(params):
    params = {**params, "format": "json", "formatversion": "2"}
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(8):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except Exception as e:  # noqa: BLE001
            print("  retry", attempt, e, file=sys.stderr)
            time.sleep(15 * (attempt + 1))
    raise RuntimeError("API failed: " + url)


def strip_html(s):
    return re.sub(r"<[^>]+>", "", s or "").strip()


def search(query, limit, video=False):
    q = query if video else query + " filetype:bitmap"
    data = api({
        "action": "query",
        "generator": "search",
        "gsrsearch": q,
        "gsrnamespace": 6,
        "gsrlimit": limit,
        "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata",
        "iiurlwidth": 320,
    })
    pages = (data.get("query") or {}).get("pages") or []
    out = []
    for p in pages:
        ii = (p.get("imageinfo") or [None])[0]
        if not ii:
            continue
        md = ii.get("extmetadata") or {}
        lic = strip_html((md.get("LicenseShortName") or {}).get("value"))
        if not ALLOWED.match(lic):
            continue
        if not video and (ii.get("width", 0) < 1200 or ii.get("height", 0) < 700):
            continue
        out.append({
            "title": p["title"],
            "pageUrl": ii.get("descriptionurl"),
            "fileUrl": ii.get("url"),
            "thumbUrl": ii.get("thumburl"),
            "mime": ii.get("mime"),
            "width": ii.get("width"),
            "height": ii.get("height"),
            "license": lic,
            "licenseUrl": strip_html((md.get("LicenseUrl") or {}).get("value")),
            "artist": strip_html((md.get("Artist") or {}).get("value")),
            "credit": strip_html((md.get("Credit") or {}).get("value"))[:200],
            "description": strip_html((md.get("ImageDescription") or {}).get("value"))[:300],
            "attributionRequired": (md.get("AttributionRequired") or {}).get("value"),
            "query": query,
            "duration": ii.get("duration"),
        })
    return out


def fetch_thumb(c, key, idx):
    if not c.get("thumbUrl"):
        return None
    THUMBS.mkdir(parents=True, exist_ok=True)
    path = THUMBS / f"{key}_{idx:02d}.jpg"
    if not path.exists():
        req = urllib.request.Request(c["thumbUrl"], headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                path.write_bytes(r.read())
        except Exception as e:  # noqa: BLE001
            print("  thumb fail", c["title"], e, file=sys.stderr)
            return None
        time.sleep(1)
    return path.name


def main():
    result = json.loads(OUT.read_text()) if OUT.exists() else {}
    for key, queries in list(QUERIES.items()) + list(VIDEO_QUERIES.items()):
        if key in result:
            continue
        video = key.startswith("video_")
        seen = set()
        cands = []
        for q in queries:
            for c in search(q, 20 if video else 14, video):
                if c["title"] in seen:
                    continue
                seen.add(c["title"])
                cands.append(c)
            time.sleep(2)
        cands = cands[:30]
        for i, c in enumerate(cands):
            c["thumb"] = fetch_thumb(c, key, i)
        result[key] = cands
        print(key, len(cands), flush=True)
        OUT.write_text(json.dumps(result, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
