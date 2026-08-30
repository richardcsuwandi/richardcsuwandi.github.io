"""Build an animated SVG thumbnail from the original ZAP contour script.

Source: /Users/richardsuwandi/code/zap/zap_thumbnail.py
"""

from __future__ import annotations

import base64
import io
import sys
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import rcParams

sys.path.insert(0, "/Users/richardsuwandi/code/zap")
from zap import ZAP

rcParams["font.family"] = "serif"
rcParams["font.size"] = 11
rcParams["axes.linewidth"] = 1.1

W_RANGE = (-4.0, 6.0)
B_RANGE = (-6.0, 4.0)
OUT = Path(__file__).resolve().parents[1] / "assets/img/publication_preview/zap.svg"


def loss_landscape(theta):
    w, b = np.asarray(theta, dtype=float)
    return (
        0.5 * (w - 0.5) ** 2
        + 0.3 * (b - 1) ** 2
        + 0.2 * np.sin(2 * w) * np.cos(b)
        + 0.1 * (w + b) ** 2
    )


def run_zap():
    theta_init = np.array([5.0, 3.5])
    zap = ZAP(
        a=0.3,
        A=5,
        b=0.2,
        tau=0.602,
        gamma=0.101,
        max_iter=80,
        tol=1e-6,
        seed=123,
    )
    result = zap.optimize(loss_landscape, theta_init, verbose=False)
    traj = np.array(result["history"]["theta"])
    print(
        f"Converged: {result['converged']} in {result['iterations']} iterations, "
        f"final=({result['theta'][0]:.3f}, {result['theta'][1]:.3f}), n={len(traj)}"
    )
    return traj


def render_and_transform(traj):
    w = np.linspace(W_RANGE[0], W_RANGE[1], 280)
    b = np.linspace(B_RANGE[0], B_RANGE[1], 280)
    W, B = np.meshgrid(w, b)
    Z = (
        0.5 * (W - 0.5) ** 2
        + 0.3 * (B - 1) ** 2
        + 0.2 * np.sin(2 * W) * np.cos(B)
        + 0.1 * (W + B) ** 2
    )

    fig, ax = plt.subplots(figsize=(5.2, 3.9), dpi=140)
    ax.contourf(W, B, Z, levels=50, cmap="RdBu_r", alpha=0.95)
    ax.contour(W, B, Z, levels=20, colors="white", alpha=0.15, linewidths=0.5)
    ax.set_xlim(W_RANGE)
    ax.set_ylim(B_RANGE)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.tick_params(width=1.1, length=4, labelsize=9)
    fig.tight_layout(pad=0.25)
    fig.canvas.draw()
    width, height = fig.canvas.get_width_height()
    disp = ax.transData.transform(traj)
    pts = np.column_stack([disp[:, 0], height - disp[:, 1]])
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=140, facecolor="white", edgecolor="none")
    png = buf.getvalue()
    plt.close(fig)
    return png, width, height, pts


def path_d(pts):
    cmds = [f"M {pts[0, 0]:.2f},{pts[0, 1]:.2f}"]
    for x, y in pts[1:]:
        cmds.append(f"L {x:.2f},{y:.2f}")
    return " ".join(cmds)


def write_svg(png, width, height, pts):
    b64 = base64.b64encode(png).decode("ascii")
    d = path_d(pts)
    x0, y0 = pts[0]
    x1, y1 = pts[-1]
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 {width} {height}" role="img" aria-label="ZAP optimization trajectory">
  <title>ZAP optimization trajectory</title>
  <image width="{width}" height="{height}" href="data:image/png;base64,{b64}"/>
  <g fill="none" stroke="#1E3A8A" stroke-linecap="round" stroke-linejoin="round">
    <path id="zap-traj" d="{d}" pathLength="1" stroke-width="3.2" stroke-opacity="0.92"
          stroke-dasharray="1" stroke-dashoffset="1">
      <animate attributeName="stroke-dashoffset" values="1;0;0;1" keyTimes="0;0.62;0.86;1"
               dur="6.5s" repeatCount="indefinite" calcMode="linear"/>
    </path>
  </g>
  <circle r="4.2" fill="#1E3A8A" stroke="#fff" stroke-width="1.2">
    <animateMotion dur="6.5s" repeatCount="indefinite" rotate="0"
                   keyPoints="0;1;1;0" keyTimes="0;0.62;0.86;1" calcMode="linear">
      <mpath href="#zap-traj" xlink:href="#zap-traj"/>
    </animateMotion>
  </circle>
  <circle cx="{x0:.2f}" cy="{y0:.2f}" r="4" fill="#1E3A8A" stroke="#fff" stroke-width="1.1"/>
  <circle cx="{x1:.2f}" cy="{y1:.2f}" r="7" fill="#1E3A8A" stroke="#fff" stroke-width="2" opacity="0">
    <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.5;0.62;0.86;1"
             dur="6.5s" repeatCount="indefinite"/>
  </circle>
</svg>
'''
    OUT.write_text(svg)
    print(f"Wrote {OUT} ({OUT.stat().st_size / 1024:.0f} KB)")


def main():
    traj = run_zap()
    png, width, height, pts = render_and_transform(traj)
    write_svg(png, width, height, pts)


if __name__ == "__main__":
    main()
