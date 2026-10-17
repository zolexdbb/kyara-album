#!/usr/bin/env python3
"""Télécharge le catalogue public de Kyara et régénère data/catalog.js.

Usage : python3 tools/update_catalog.py
"""
import datetime
import json
import pathlib
import urllib.request

API = "https://kyara.games/api/characters"
RARITIES = ["C", "U", "R", "E", "L", "M"]
OUT = pathlib.Path(__file__).resolve().parent.parent / "data" / "catalog.js"


def main():
    req = urllib.request.Request(API, headers={"User-Agent": "kyara-albums"})
    with urllib.request.urlopen(req, timeout=60) as r:
        chars = json.load(r)

    series = sorted({c["series"] for c in chars})
    index = {s: i for i, s in enumerate(series)}
    cards = [
        [c["id"], c["name"], RARITIES.index(c["rarity"]),
         int(c["num"][1:].split("/")[0]), index[c["series"]]]
        for c in chars
    ]
    data = {"d": datetime.date.today().isoformat(), "s": series, "c": cards}
    js = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text("// Généré par tools/update_catalog.py, ne pas modifier à la main.\nconst DATA=" + js + ";\n", encoding="utf-8")
    print(f"{len(cards)} cartes, {len(series)} albums -> {OUT}")


if __name__ == "__main__":
    main()
