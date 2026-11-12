"""Print the Wikipedia summary for every source cited in src/content/facts.ts
so facts can be checked by hand against the source text. Slow on purpose
(Wikimedia rate limits)."""
import json, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

UA = {"User-Agent": "ShanghaiJourneyGame/0.1 (fact check script)"}
src = (Path(__file__).resolve().parent.parent / "src/content/facts.ts").read_text()
pages = sorted(set(re.findall(r"wiki\('([^']+)'(?:, '(\w+)')?\)", src)))
skip = set(sys.argv[1:])
for title, lang in pages:
    lang = lang or "en"
    if title in skip:
        continue
    url = f"https://{lang}.wikipedia.org/w/api.php?" + urllib.parse.urlencode({
        "action": "query", "prop": "extracts", "explaintext": 1, "exintro": 1,
        "redirects": 1, "titles": title, "format": "json", "formatversion": 2})
    for attempt in range(5):
        try:
            d = json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30))
            p = d["query"]["pages"][0]
            status = "MISSING" if p.get("missing") else "OK"
            print(f"== {status} {lang} {title} -> {p.get('title')}\n{(p.get('extract') or '')[:1500]}\n", flush=True)
            break
        except Exception as e:  # noqa: BLE001
            time.sleep(5 * (attempt + 1))
    else:
        print(f"== ERR {lang} {title}")
    time.sleep(2)
