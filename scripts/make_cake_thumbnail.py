"""Animated CAKE evolution-loop thumbnail.

Boxes stay put. Thick arrows draw one hop at a time:
Initial -> Mating Selection -> Mating -> Evaluation -> Survivor,
then either loop or End into Final Population.
"""

from __future__ import annotations

import math
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "assets/img/publication_preview/cake.svg"

W, H = 512, 288
DUR = "10s"
BG = "#f7f7f7"
INK = "#2f2f2f"
MUTED = "#6a6a6a"
ARROW = "#3d3d3d"
FONT = "ui-sans-serif, system-ui, sans-serif"

PINK_F, PINK_H = "#F6D6D6", "#E8A4A4"
PURPLE_F, PURPLE_H = "#E4D8F0", "#B9A4D0"
BLUE_F, BLUE_H = "#D2E4F4", "#9FC0DC"
GREEN_F, GREEN_H = "#D4EBD8", "#9CC8A4"
ORANGE_F, ORANGE_H = "#F5D8C0", "#E2B089"
YELLOW_F, YELLOW_H = "#F4E9B8", "#E2D07A"
LLM = "#F4F4F4"


def fade(begin: float, hold: float = 0.90) -> str:
    pre = max(0.0, begin - 0.02)
    return (
        f'<animate attributeName="opacity" values="0;0;1;1;0" '
        f'keyTimes="0;{pre:.2f};{begin:.2f};{hold:.2f};1" dur="{DUR}" '
        f'repeatCount="indefinite"/>'
    )


def draw_arrow(
    d: str,
    t0: float,
    t1: float,
    *,
    hold: float = 0.90,
    width: float = 7.2,
) -> str:
    """Stroke grows from t0 to t1, then holds until fade."""
    return (
        f'<path d="{d}" fill="none" stroke="{ARROW}" stroke-width="{width}" '
        f'stroke-linecap="round" stroke-linejoin="round" '
        f'marker-end="url(#ah)" pathLength="1" stroke-dasharray="1" '
        f'stroke-dashoffset="1" opacity="0">'
        f'<animate attributeName="opacity" values="0;0;1;1;0" '
        f'keyTimes="0;{max(0,t0-0.01):.2f};{t0:.2f};{hold:.2f};1" '
        f'dur="{DUR}" repeatCount="indefinite"/>'
        f'<animate attributeName="stroke-dashoffset" values="1;1;0;0;1" '
        f'keyTimes="0;{t0:.2f};{t1:.2f};{hold:.2f};1" '
        f'dur="{DUR}" repeatCount="indefinite"/>'
        f"</path>"
    )


def kernel_path(kind: str, x: float, y: float, w: float, h: float) -> tuple[str, str]:
    """Return (mean path, sample path) in a small panel."""
    n = 28
    mean, samp = [], []
    for i in range(n):
        t = i / (n - 1)
        u = t * 2 * math.pi
        if kind == "SE":
            m = math.exp(-((t - 0.5) ** 2) / 0.045)
            s = m + 0.18 * math.sin(3.2 * u)
        elif kind == "PER":
            m = 0.55 + 0.42 * math.sin(2.2 * u)
            s = m + 0.16 * math.sin(5.1 * u + 0.4)
        elif kind == "LIN":
            m = 0.18 + 0.72 * t
            s = m + 0.14 * math.sin(2.8 * u)
        elif kind == "RQ":
            m = math.exp(-((t - 0.42) ** 2) / 0.07)
            s = m + 0.2 * math.sin(2.4 * u)
        elif kind == "M3":
            m = 0.5 + 0.22 * math.sin(u) + 0.18 * math.sin(2.4 * u)
            s = m + 0.2 * math.sin(6.2 * u)
        elif kind == "M5":
            m = 0.48 + 0.28 * math.sin(1.3 * u) * math.exp(-0.6 * t)
            s = m + 0.18 * math.sin(4.6 * u)
        elif kind == "LINSE":
            m = 0.15 + 0.55 * t + 0.28 * math.exp(-((t - 0.65) ** 2) / 0.04)
            s = m + 0.14 * math.sin(3.1 * u)
        elif kind == "LINPER":
            m = 0.22 + 0.5 * t + 0.28 * math.sin(2.4 * u)
            s = m + 0.12 * math.sin(5 * u)
        elif kind == "LIN+PER":
            m = 0.35 + 0.28 * t + 0.32 * math.sin(2.1 * u)
            s = m + 0.12 * math.sin(4.2 * u)
        else:  # SEPER
            m = 0.45 + 0.38 * math.sin(2.3 * u) * math.exp(-((t - 0.5) ** 2) / 0.22)
            s = m + 0.14 * math.sin(4.8 * u)
        px = x + t * w
        mean.append(f"{px:.1f},{y + h - m * h:.1f}")
        samp.append(f"{px:.1f},{y + h - max(0.02, min(0.98, s)) * h:.1f}")
    return "M " + " L ".join(mean), "M " + " L ".join(samp)


def mini_plot(kind: str, x: float, y: float, w: float = 42, h: float = 26, label: str = "") -> str:
    d_m, d_s = kernel_path(kind, x + 3, y + 2, w - 6, h - 10)
    lab = label or kind
    return (
        f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" '
        f'rx="3" fill="#fff" stroke="#d8d8d8" stroke-width="0.8"/>'
        f'<path d="{d_s}" fill="none" stroke="#C44E52" stroke-width="1.15" '
        f'stroke-linecap="round"/>'
        f'<path d="{d_m}" fill="none" stroke="#4C72B0" stroke-width="1.35" '
        f'stroke-linecap="round"/>'
        f'<text x="{x + w / 2:.1f}" y="{y + h + 10:.1f}" text-anchor="middle" '
        f'fill="{MUTED}" font-size="8" font-family="{FONT}">{lab}</text>'
    )


def header_box(
    x: float,
    y: float,
    w: float,
    h: float,
    fill: str,
    header: str,
    title: str,
    body: str = "",
    *,
    hh: float = 20,
) -> str:
    return (
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="7" fill="{fill}" '
        f'stroke="#cfcfcf" stroke-width="0.9"/>'
        f'<path d="M {x} {y + hh} L {x} {y + 7} Q {x} {y} {x + 7} {y} '
        f'L {x + w - 7} {y} Q {x + w} {y} {x + w} {y + 7} L {x + w} {y + hh} Z" '
        f'fill="{header}"/>'
        f'<text x="{x + w / 2}" y="{y + 14.5}" text-anchor="middle" fill="{INK}" '
        f'font-size="10.5" font-weight="700" font-family="{FONT}">{title}</text>'
        f"{body}"
    )


def pill(x: float, y: float, w: float, h: float, fill: str, title: str) -> str:
    return (
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{h / 2}" fill="{fill}" '
        f'stroke="#cfcfcf" stroke-width="0.9"/>'
        f'<text x="{x + w / 2}" y="{y + h / 2 + 3.8}" text-anchor="middle" fill="{INK}" '
        f'font-size="10.5" font-weight="700" font-family="{FONT}">{title}</text>'
    )


def pulse_ring(x: float, y: float, w: float, h: float, t: float, rx: float = 7) -> str:
    return (
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="none" '
        f'stroke="{ARROW}" stroke-width="2.4" opacity="0">'
        f'<animate attributeName="opacity" values="0;0;0.55;0;0" '
        f'keyTimes="0;{t:.2f};{min(0.99, t + 0.04):.2f};{min(0.99, t + 0.12):.2f};1" '
        f'dur="{DUR}" repeatCount="indefinite"/>'
        f"</rect>"
    )


def main() -> None:
    # Layout (16:9), matching the paper figure's clockwise loop.
    ix, iy, iw, ih = 16, 14, 168, 112
    msx, msy, msw, msh = 210, 18, 128, 34
    mx, my, mw, mh = 358, 16, 138, 156
    ex, ey, ew, eh = 208, 198, 132, 74
    sx, sy, sw, sh = 188, 148, 132, 34
    fx, fy, fw, fh = 16, 176, 168, 96

    init_plots = []
    kinds = [("SE", 0, 0), ("PER", 1, 0), ("LIN", 2, 0), ("RQ", 0, 1), ("M3", 1, 1), ("M5", 2, 1)]
    for kind, c, r in kinds:
        init_plots.append(mini_plot(kind, ix + 10 + c * 52, iy + 28 + r * 40, 46, 24, kind))

    llm = (
        f'<rect x="{mx + 10}" y="{my + 48}" width="{mw - 20}" height="36" rx="5" '
        f'fill="{LLM}" stroke="#d0d0d0" stroke-width="0.8"/>'
        f'<text x="{mx + mw / 2}" y="{my + 62}" text-anchor="middle" fill="{INK}" '
        f'font-size="10" font-weight="700" font-family="{FONT}">LLM</text>'
        f'<text x="{mx + mw / 2}" y="{my + 75}" text-anchor="middle" fill="{MUTED}" '
        f'font-size="7.2" font-family="{FONT}">crossover · mutation</text>'
    )
    mating_body = (
        f'<text x="{mx + mw / 2}" y="{my + 36}" text-anchor="middle" fill="{MUTED}" '
        f'font-size="8.5" font-family="{FONT}">Crossover  |  Mutation</text>'
        f"{llm}"
        + mini_plot("LINSE", mx + 12, my + 94, 52, 26, "LIN × SE")
        + mini_plot("LINPER", mx + 74, my + 94, 52, 26, "LIN × PER")
    )

    eval_body = (
        mini_plot("LINSE", ex + 8, ey + 26, 52, 22, "")
        + mini_plot("LINPER", ex + 72, ey + 26, 52, 22, "")
        + f'<text x="{ex + 34}" y="{ey + 64}" text-anchor="middle" fill="{INK}" '
        f'font-size="9.5" font-weight="700" font-family="{FONT}">0.53</text>'
        + f'<text x="{ex + 98}" y="{ey + 64}" text-anchor="middle" fill="{INK}" '
        f'font-size="9.5" font-weight="700" font-family="{FONT}">0.71</text>'
    )

    final_body = (
        mini_plot("LINSE", fx + 12, fy + 26, 66, 24, "LIN × SE")
        + mini_plot("LINPER", fx + 90, fy + 26, 66, 24, "LIN × PER")
        + mini_plot("LIN+PER", fx + 12, fy + 62, 66, 24, "LIN + PER")
        + mini_plot("SEPER", fx + 90, fy + 62, 66, 24, "SE × PER")
    )

    # Hop times along a 10s loop. Last 1s is a reset.
    a1 = draw_arrow(
        f"M {ix + iw} {iy + 28} C {ix + iw + 18} {iy + 8}, {msx - 16} {msy + 6}, {msx} {msy + msh / 2}",
        0.08,
        0.20,
    )
    a2 = draw_arrow(
        f"M {msx + msw} {msy + msh / 2} C {msx + msw + 16} {msy + 8}, {mx - 14} {my + 18}, {mx} {my + 36}",
        0.22,
        0.34,
    )
    a3 = draw_arrow(
        f"M {mx + 18} {my + mh} C {mx - 8} {my + mh + 28}, {ex + ew - 8} {ey - 18}, {ex + ew} {ey + 16}",
        0.36,
        0.48,
    )
    a4 = draw_arrow(
        f"M {ex} {ey + 22} C {ex - 28} {ey + 8}, {sx + sw + 18} {sy + sh + 10}, {sx + sw} {sy + sh / 2}",
        0.50,
        0.62,
    )
    a_loop = draw_arrow(
        f"M {sx + sw / 2} {sy} C {sx + 40} {sy - 36}, {msx + 20} {msy + msh + 28}, {msx + msw / 2} {msy + msh}",
        0.64,
        0.76,
        width=6.4,
    )
    a_end = draw_arrow(
        f"M {sx} {sy + sh / 2} C {sx - 22} {sy + 4}, {fx + fw + 16} {fy + 28}, {fx + fw} {fy + 38}",
        0.78,
        0.88,
        width=6.6,
    )

    end_label = (
        f'<text x="178" y="168" fill="{INK}" font-size="9.5" font-weight="700" '
        f'font-family="{FONT}" opacity="0">End'
        f'{fade(0.86)}</text>'
    )

    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}"
     role="img" aria-label="CAKE kernel evolution loop">
  <title>CAKE evolution loop</title>
  <defs>
    <marker id="ah" markerWidth="6.2" markerHeight="6.2" refX="5.1" refY="3.1" orient="auto">
      <path d="M0,0.5 L5.8,3.1 L0,5.7 z" fill="{ARROW}"/>
    </marker>
  </defs>
  <rect width="{W}" height="{H}" fill="{BG}"/>
  {header_box(ix, iy, iw, ih, PINK_F, PINK_H, "Initial Population", "".join(init_plots))}
  {pill(msx, msy, msw, msh, PURPLE_F, "Mating Selection")}
  {header_box(mx, my, mw, mh, BLUE_F, BLUE_H, "Mating", mating_body)}
  {header_box(ex, ey, ew, eh, GREEN_F, GREEN_H, "Evaluation", eval_body)}
  {pill(sx, sy, sw, sh, ORANGE_F, "Survivor Selection")}
  {header_box(fx, fy, fw, fh, YELLOW_F, YELLOW_H, "Final Population", final_body, hh=20)}
  {pulse_ring(msx, msy, msw, msh, 0.20, rx=17)}
  {pulse_ring(mx, my, mw, mh, 0.34)}
  {pulse_ring(ex, ey, ew, eh, 0.48)}
  {pulse_ring(sx, sy, sw, sh, 0.62, rx=17)}
  {pulse_ring(msx, msy, msw, msh, 0.76, rx=17)}
  {pulse_ring(fx, fy, fw, fh, 0.88)}
  {a1}{a2}{a3}{a4}{a_loop}{a_end}
  {end_label}
</svg>
'''
    OUT.write_text(svg)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
