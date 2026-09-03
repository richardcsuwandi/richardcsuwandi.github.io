"""Animated CAKE thumbnail: paper figure, arrows drawing hop by hop."""

from __future__ import annotations

import base64
import io
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PREVIEW = ROOT / "assets" / "img" / "publication_preview"
OUT = PREVIEW / "cake.svg"
PNG = PREVIEW / "cake.png"

SRC_W, SRC_H = 1018, 564
W, H = 512, 284  # same aspect as the paper figure
S = W / SRC_W
DUR = "11s"
ARROW = "#2b2b2b"

# Paper-figure coordinates (1018 x 564), then scaled.
HOPS = [
    ("M 318 95 C 370 30, 420 18, 458 58", 0.06, 0.18, 10),
    ("M 612 58 C 655 22, 675 48, 698 92", 0.20, 0.32, 10),
    ("M 718 408 C 705 485, 678 505, 650 438", 0.34, 0.48, 10),
    ("M 408 405 C 375 398, 355 380, 360 358", 0.50, 0.62, 10),
    ("M 335 328 C 305 210, 355 95, 468 72", 0.64, 0.78, 9),
    ("M 295 338 C 268 318, 252 305, 242 298", 0.80, 0.88, 8),
]


def scale_path(d: str) -> str:
    parts = []
    for tok in d.replace(",", " ").split():
        try:
            parts.append(f"{float(tok) * S:.1f}")
        except ValueError:
            parts.append(tok)
    return " ".join(parts)


def hop(d: str, t0: float, t1: float, width: float, hold: float = 0.91) -> str:
    pre = max(0.0, t0 - 0.01)
    sw = width * S
    return (
        f'<path d="{d}" fill="none" stroke="{ARROW}" stroke-width="{sw:.1f}" '
        f'stroke-linecap="round" stroke-linejoin="round" marker-end="url(#ah)" '
        f'pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" opacity="0">'
        f'<animate attributeName="opacity" values="0;0;1;1;0" '
        f'keyTimes="0;{pre:.2f};{t0:.2f};{hold:.2f};1" dur="{DUR}" '
        f'repeatCount="indefinite"/>'
        f'<animate attributeName="stroke-dashoffset" values="1;1;0;0;1" '
        f'keyTimes="0;{t0:.2f};{t1:.2f};{hold:.2f};1" dur="{DUR}" '
        f'repeatCount="indefinite"/>'
        f"</path>"
    )


def main() -> None:
    im = Image.open(PNG).convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, format="PNG", optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")

    paths, beads = [], []
    for i, (d, t0, t1, width) in enumerate(HOPS):
        sd = scale_path(d)
        pid = f"p{i}"
        paths.append(
            hop(sd, t0, t1, width).replace('d="', f'id="{pid}" d="', 1)
        )
        beads.append(
            f'<circle r="{3.8 * S:.1f}" fill="{ARROW}" stroke="#fff" '
            f'stroke-width="{1.0 * S:.1f}" opacity="0">'
            f'<animate attributeName="opacity" values="0;0;1;1;0" '
            f'keyTimes="0;{t0:.2f};{t0:.2f};0.91;1" dur="{DUR}" '
            f'repeatCount="indefinite"/>'
            f'<animateMotion dur="{DUR}" repeatCount="indefinite" rotate="0" '
            f'keyPoints="0;0;1;1;0" keyTimes="0;{t0:.2f};{t1:.2f};0.91;1" '
            f'calcMode="linear">'
            f'<mpath href="#{pid}"/>'
            f"</animateMotion>"
            f"</circle>"
        )

    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 {W} {H}" role="img" aria-label="CAKE kernel evolution loop">
  <title>CAKE evolution loop</title>
  <defs>
    <marker id="ah" markerWidth="5.6" markerHeight="5.6" refX="4.7" refY="2.8" orient="auto">
      <path d="M0,0.4 L5.3,2.8 L0,5.2 z" fill="{ARROW}"/>
    </marker>
  </defs>
  <image width="{W}" height="{H}" href="data:image/png;base64,{b64}"/>
  {"".join(paths)}
  {"".join(beads)}
</svg>
'''
    OUT.write_text(svg)
    print(f"Wrote {OUT} ({OUT.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
