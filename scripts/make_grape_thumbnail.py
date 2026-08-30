"""Animated GRAPE Stage-2 thumbnail from the paper TikZ figure.

Zoomed crop: contours, iterates, and arrows only. No labels or legend.
"""

from __future__ import annotations

import math
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "assets/img/publication_preview/grape.svg"

S = 100
PANEL_H = 4.95
XT = (3.55, 2.95)
RED = "#C44E52"
PURPLE = "#9467BD"


def polar(deg: float, r: float) -> tuple[float, float]:
    rad = math.radians(deg)
    return XT[0] + r * math.cos(rad), XT[1] + r * math.sin(rad)


def sx(x: float) -> float:
    return x * S


def sy(y: float) -> float:
    return PANEL_H * S - y * S


def xy(p: tuple[float, float]) -> str:
    return f"{sx(p[0]):.1f},{sy(p[1]):.1f}"


def fade(begin: float, hold: float = 0.92) -> str:
    pre = max(0.0, begin - 0.02)
    return (
        f'<animate attributeName="opacity" values="0;0;1;1;0" '
        f'keyTimes="0;{pre:.2f};{begin:.2f};{hold:.2f};1" dur="9s" '
        f'repeatCount="indefinite"/>'
    )


def arrow(end: tuple[float, float], color: str, width: float, dashed: bool = False) -> str:
    dash = ' stroke-dasharray="10 7"' if dashed else ""
    return (
        f'<line x1="{sx(XT[0]):.1f}" y1="{sy(XT[1]):.1f}" '
        f'x2="{sx(end[0]):.1f}" y2="{sy(end[1]):.1f}" '
        f'stroke="{color}" stroke-width="{width}" '
        f'stroke-linecap="round" marker-end="url(#ah-{color[1:]})"{dash}/>'
    )


def marker(color: str) -> str:
    cid = color[1:]
    return (
        f'<marker id="ah-{cid}" markerWidth="7" markerHeight="7" '
        f'refX="5.4" refY="3.5" orient="auto">'
        f'<path d="M0,0.6 L6.2,3.5 L0,6.4 z" fill="{color}"/></marker>'
    )


def main() -> None:
    h = PANEL_H * S
    shallow = polar(138, 1.2)
    steep = polar(215, 2.15)
    candidates = [
        (shallow, "#5a5a5a", 5.2, True, 0.10),
        (polar(155, 1.25), "#b0b0b0", 4.4, False, 0.32),
        (polar(168, 1.4), "#9a9a9a", 4.6, False, 0.40),
        (polar(188, 1.55), "#ae7b7d", 5.0, False, 0.48),
        (polar(238, 1.4), "#ba6265", 5.4, False, 0.56),
    ]

    ellipses = []
    for s in range(1, 6):
        rx, ry = 1.35 + 0.85 * s, 1.0 + 0.65 * s
        ellipses.append(
            f'<ellipse cx="{sx(-0.7):.1f}" cy="{sy(-0.5):.1f}" '
            f'rx="{rx*S:.1f}" ry="{ry*S:.1f}" fill="none" '
            f'stroke="#c8c8c8" stroke-width="2.4"/>'
        )

    p145, p245 = polar(145, 2.05), polar(245, 2.05)
    fan = f'M {xy(XT)} L {xy(p145)} A {2.05*S:.1f} {2.05*S:.1f} 0 0 0 {xy(p245)} Z'

    colors = {c[1] for c in candidates} | {RED}
    markers = "\n    ".join(marker(c) for c in colors)

    cand_svg = []
    for end, color, width, dashed, t0 in candidates:
        cand_svg.append(
            f'<g opacity="0">{fade(t0)}{arrow(end, color, width, dashed)}</g>'
        )

    # Match other paper thumbnails (16:9). Content is compact; extra width is padding.
    vb_h = 288
    vb_w = int(round(vb_h * 16 / 9))
    vb_x, vb_y = 4, 68

    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb_x} {vb_y} {vb_w} {vb_h}"
     role="img" aria-label="GRAPE progress-aware exploitation">
  <title>GRAPE Stage 2</title>
  <defs>
    {markers}
  </defs>
  <rect x="{vb_x}" y="{vb_y}" width="{vb_w}" height="{vb_h}" fill="#f7f7f7"/>
  {"".join(ellipses)}
  <g opacity="0">{fade(0.08)}
    <path d="{fan}" fill="{RED}" fill-opacity="0.08"/>
  </g>
  {"".join(cand_svg)}
  <g opacity="0">{fade(0.22)}
    <text x="{sx(shallow[0]) - 8:.1f}" y="{sy(shallow[1]) - 8:.1f}"
          text-anchor="end" fill="#5a5a5a" font-size="25" font-weight="600"
          font-family="ui-sans-serif, system-ui, sans-serif"
          stroke="#f7f7f7" stroke-width="4" paint-order="stroke">certain, shallow</text>
  </g>
  <g opacity="0">
    <animate attributeName="opacity" values="0;0;1;1;0"
             keyTimes="0;0.60;0.62;0.92;1" dur="9s" repeatCount="indefinite"/>
    <line x1="{sx(XT[0]):.1f}" y1="{sy(XT[1]):.1f}"
          x2="{sx(steep[0]):.1f}" y2="{sy(steep[1]):.1f}"
          stroke="{RED}" stroke-width="8.4" stroke-linecap="round"
          marker-end="url(#ah-{RED[1:]})" pathLength="1"
          stroke-dasharray="1" stroke-dashoffset="1">
      <animate attributeName="stroke-dashoffset" values="1;1;0;0;1"
               keyTimes="0;0.62;0.72;0.92;1" dur="9s" repeatCount="indefinite"/>
    </line>
  </g>
  <g opacity="0">{fade(0.74)}
    <circle cx="{sx(steep[0]):.1f}" cy="{sy(steep[1]):.1f}" r="11" fill="{PURPLE}" fill-opacity="0.85"/>
    <circle cx="{sx(steep[0]):.1f}" cy="{sy(steep[1]):.1f}" r="4.3" fill="#fff"/>
  </g>
  <g opacity="0">{fade(0.78)}
    <text x="{sx(steep[0]) + 36:.1f}" y="{sy(steep[1]) - 28:.1f}"
          fill="#9a3d40" font-size="25" font-weight="700"
          font-family="ui-sans-serif, system-ui, sans-serif"
          stroke="#f7f7f7" stroke-width="4" paint-order="stroke">steep progress</text>
  </g>
  <circle cx="{sx(XT[0]):.1f}" cy="{sy(XT[1]):.1f}" r="11.5" fill="{PURPLE}"/>
  <circle cx="{sx(XT[0]):.1f}" cy="{sy(XT[1]):.1f}" r="4.5" fill="#fff"/>
</svg>
'''
    OUT.write_text(svg)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
