"""Animated 1D spectral-mixture comb for the SLIM-KL / GSMP thumbnail.

Many frequency bumps, then most shrink to the baseline. Keepers stay and turn blue.
"""

from __future__ import annotations

import math
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "assets/img/publication_preview/gsmp.svg"

W, H = 512, 288  # 16:9
BASE = 228.0
MAX_H = 150.0
N = 13
KEEPERS = {2, 6, 10}
SIGMA = 16.5
GRAY = "#c8c8c8"
BLUE = "#4C72B0"
BG = "#f7f7f7"
DUR = "9s"

AMPS = [
    0.62, 0.74, 0.96, 0.68, 0.58, 0.80, 1.00,
    0.70, 0.55, 0.77, 0.90, 0.64, 0.60,
]


def bump_path(mu: float, amp: float) -> str:
    xs = [mu + SIGMA * t / 10.0 for t in range(-40, 41)]
    pts = [f"{xs[0]:.1f},{BASE:.1f}"]
    for x in xs:
        y = BASE - amp * math.exp(-0.5 * ((x - mu) / SIGMA) ** 2)
        pts.append(f"{x:.1f},{y:.1f}")
    pts.append(f"{xs[-1]:.1f},{BASE:.1f}")
    return "M " + " L ".join(pts) + " Z"


def main() -> None:
    x0, x1 = 40.0, 472.0
    mus = [x0 + (i + 0.5) * (x1 - x0) / N for i in range(N)]
    zeros = [i for i in range(N) if i not in KEEPERS]
    t0, dt = 0.16, 0.06

    bumps = []
    for i, mu in enumerate(mus):
        d = bump_path(mu, AMPS[i] * MAX_H)
        if i in KEEPERS:
            bumps.append(
                f'<path d="{d}" fill="{GRAY}" fill-opacity="0.88">'
                f'<animate attributeName="fill" values="{GRAY};{GRAY};{BLUE};{BLUE};{GRAY}" '
                f'keyTimes="0;0.70;0.74;0.92;1" dur="{DUR}" repeatCount="indefinite"/>'
                f"</path>"
            )
        else:
            k = zeros.index(i)
            t_drop = t0 + k * dt
            t_done = min(0.90, t_drop + 0.08)
            bumps.append(
                f'<g transform="translate({mu:.1f},{BASE:.1f})">'
                f'<g>'
                f'<animateTransform attributeName="transform" type="scale" '
                f'values="1 1;1 1;1 0;1 0;1 1" '
                f'keyTimes="0;{t_drop:.2f};{t_done:.2f};0.92;1" dur="{DUR}" '
                f'repeatCount="indefinite"/>'
                f'<path d="{d}" fill="{GRAY}" fill-opacity="0.75" '
                f'transform="translate({-mu:.1f},{-BASE:.1f})"/>'
                f"</g></g>"
            )

    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}"
     role="img" aria-label="Sparse spectral mixture">
  <title>GSMP sparse spectrum</title>
  <rect width="{W}" height="{H}" fill="{BG}"/>
  <line x1="32" y1="{BASE:.1f}" x2="480" y2="{BASE:.1f}"
        stroke="#e0e0e0" stroke-width="2"/>
  {"".join(bumps)}
</svg>
'''
    OUT.write_text(svg)
    print(f"Wrote {OUT} ({OUT.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
