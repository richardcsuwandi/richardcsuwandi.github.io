"""Animated sparse kernel-weight bars (idea 1). Writes gsmp-bars.svg."""

from __future__ import annotations

from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "assets/img/publication_preview/gsmp-bars.svg"

W, H = 512, 288  # 16:9
BASE = 232.0
MAX_H = 148.0
N = 15
KEEPERS = {2, 7, 12}
GRAY = "#c8c8c8"
BLUE = "#4C72B0"
BG = "#f7f7f7"
DUR = "9s"

INIT = [
    0.78, 0.86, 0.94, 0.81, 0.73, 0.88, 0.76, 0.98,
    0.84, 0.71, 0.90, 0.80, 0.92, 0.77, 0.83,
]
TINY = 0.06


def main() -> None:
    margin_x = 44.0
    gap = 7.0
    inner = W - 2 * margin_x
    bar_w = (inner - (N - 1) * gap) / N
    rx = min(3.6, bar_w * 0.28)

    zeros = [i for i in range(N) if i not in KEEPERS]
    t0 = 0.16
    dt = 0.055

    bars = []
    for i in range(N):
        x = margin_x + i * (bar_w + gap)
        h0 = INIT[i] * MAX_H
        y0 = BASE - h0
        if i in KEEPERS:
            bars.append(
                f'<rect x="{x:.1f}" y="{y0:.1f}" width="{bar_w:.1f}" height="{h0:.1f}" '
                f'rx="{rx:.1f}" fill="{GRAY}">'
                f'<animate attributeName="fill" values="{GRAY};{GRAY};{BLUE};{BLUE};{GRAY}" '
                f'keyTimes="0;0.70;0.74;0.92;1" dur="{DUR}" repeatCount="indefinite"/>'
                f"</rect>"
            )
        else:
            k = zeros.index(i)
            t_drop = t0 + k * dt
            t_done = t_drop + 0.06
            h1 = TINY * MAX_H
            y1 = BASE - h1
            bars.append(
                f'<rect x="{x:.1f}" y="{y0:.1f}" width="{bar_w:.1f}" height="{h0:.1f}" '
                f'rx="{rx:.1f}" fill="{GRAY}">'
                f'<animate attributeName="height" values="{h0:.1f};{h0:.1f};{h1:.1f};{h1:.1f};{h0:.1f}" '
                f'keyTimes="0;{t_drop:.2f};{t_done:.2f};0.92;1" dur="{DUR}" '
                f'repeatCount="indefinite"/>'
                f'<animate attributeName="y" values="{y0:.1f};{y0:.1f};{y1:.1f};{y1:.1f};{y0:.1f}" '
                f'keyTimes="0;{t_drop:.2f};{t_done:.2f};0.92;1" dur="{DUR}" '
                f'repeatCount="indefinite"/>'
                f"</rect>"
            )

    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}"
     role="img" aria-label="Sparse kernel weights">
  <title>SLIM-KL sparse weights</title>
  <rect width="{W}" height="{H}" fill="{BG}"/>
  <line x1="{margin_x - 8:.1f}" y1="{BASE:.1f}" x2="{W - margin_x + 8:.1f}" y2="{BASE:.1f}"
        stroke="#e0e0e0" stroke-width="2"/>
  {"".join(bars)}
</svg>
'''
    OUT.write_text(svg)
    print(f"Wrote {OUT} ({OUT.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
