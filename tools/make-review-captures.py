"""Compose planche | produit cote a cote pour la revue d'implementation (etape 07b).

Usage : python tools/make-review-captures.py <dossier-captures> <dossier-sortie>
Les paires sont nommees : planche-01-post.png + produit-post.png -> 01-post.png
"""
import sys
from pathlib import Path

from PIL import Image

PAIRS = [
    ("planche-01-post.png", "produit-post.png", "01-post"),
    ("planche-02-jeu.png", "produit-jeu.png", "02-jeu"),
    ("planche-03-carte-de-fin.png", "produit-fin.png", "03-carte-de-fin"),
    ("planche-04-series-classement.png", "produit-stats.png", "04-series-classement"),
]


def main() -> int:
    src = Path(sys.argv[1])
    out = Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    for planche_name, produit_name, label in PAIRS:
        planche = Image.open(src / planche_name).convert("RGB")
        produit = Image.open(src / produit_name).convert("RGB")
        width = planche.width + produit.width + 24
        height = max(planche.height, produit.height)
        canvas = Image.new("RGB", (width, height), "#eceae6")
        canvas.paste(planche, (0, 0))
        canvas.paste(produit, (planche.width + 24, 0))
        canvas.save(out / f"{label}.png")
        print(f"{label}.png : planche {planche.size} | produit {produit.size}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
