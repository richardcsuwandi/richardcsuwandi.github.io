#!/usr/bin/env python3
"""Generate the editorial SVG thumbnails used by the blog index.

The drawings deliberately use a small shared vocabulary (nodes, paths, fields,
and sparse labels) while giving every article its own visual metaphor.  Run
this file from the repository root; SVGs are written to
``assets/img/post_thumbnails``.
"""

from __future__ import annotations

from pathlib import Path

import matplotlib as mpl
mpl.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Circle, FancyArrowPatch, FancyBboxPatch, Polygon, Rectangle


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "img" / "post_thumbnails"

# Exact color family used by paper/figures/pipeline.svg.
INK = "#26323C"
MUTED = "#6B6B6B"
GRID = "#E6E6E6"
PAPER = "#FAFBFC"
BLUE = "#356FAE"
SKY = "#477FAE"
ORANGE = "#CB6B2E"
GOLD = "#D68C5C"
CORAL = "#865A39"
TEAL = "#4D7654"
PURPLE = "#675783"
PALE_BLUE = "#DFEAF6"
PALE_GOLD = "#F8DFCD"
PALE_CORAL = "#F4DED1"
PALE_TEAL = "#E3F0E5"
PALE_PURPLE = "#ECE7F5"
PALE_SLATE = "#E8EEF3"

mpl.rcParams.update(
    {
        "font.family": "Helvetica",
        "font.size": 16,
        "svg.fonttype": "none",
        "svg.hashsalt": "richard-post-thumbnails-v2",
        "axes.linewidth": 0,
    }
)


def canvas():
    fig, ax = plt.subplots(figsize=(12, 6.75), dpi=100)
    fig.subplots_adjust(0, 0, 1, 1)
    fig.patch.set_facecolor(PAPER)
    ax.set_facecolor(PAPER)
    ax.set_xlim(0, 1200)
    ax.set_ylim(0, 675)
    ax.set_aspect("equal")
    ax.axis("off")
    return fig, ax


def finish(fig, name: str):
    OUT.mkdir(parents=True, exist_ok=True)
    fig.savefig(OUT / f"{name}.svg", format="svg", facecolor=PAPER, edgecolor="none")
    plt.close(fig)


def arrow(ax, start, end, color=INK, lw=3, style="-", curve=0.0, scale=18, alpha=1):
    patch = FancyArrowPatch(
        start,
        end,
        arrowstyle="-|>",
        mutation_scale=scale,
        linewidth=lw,
        linestyle=style,
        color=color,
        connectionstyle=f"arc3,rad={curve}",
        shrinkA=2,
        shrinkB=3,
        alpha=alpha,
        zorder=5,
    )
    ax.add_patch(patch)
    return patch


def node(ax, xy, r=16, color=BLUE, ring=False, z=8):
    ax.add_patch(Circle(xy, r, facecolor=PAPER if ring else color, edgecolor=color, linewidth=7 if ring else 0, zorder=z))


def soft_blob(ax, xy, width, height, color, alpha=0.14):
    ax.add_patch(FancyBboxPatch((xy[0], xy[1]), width, height, boxstyle="round,pad=0,rounding_size=90", facecolor=color, edgecolor="none", alpha=alpha, zorder=0))


def unified_view():
    fig, ax = canvas()
    x = np.linspace(-30, 1230, 600)
    objective = 250 + 150 * np.exp(-((x - 800) / 170) ** 2) + 38 * np.sin(x / 105)
    uncertainty = 60 + 105 * (1 - np.exp(-((x - 730) / 185) ** 2))
    ax.fill_between(x, objective - uncertainty, objective + uncertainty, color=PALE_BLUE, alpha=.92)
    ax.plot(x, objective, color=INK, lw=5)
    for offset, alpha in [(92, .58), (174, .38), (250, .20)]:
        ax.plot(x, objective + uncertainty + offset, color=BLUE, lw=2.5, alpha=alpha)
    samples = np.array([90, 275, 455, 650, 915, 1110])
    ys = np.interp(samples, x, objective)
    ax.scatter(samples, ys, s=185, c=[BLUE, BLUE, SKY, ORANGE, GOLD, ORANGE], edgecolors=PAPER, linewidths=5, zorder=8)
    # Uncertainty and utility streams converge on the same next query.
    node(ax, (235, 575), 30, BLUE, ring=True)
    node(ax, (1015, 560), 30, ORANGE, ring=True)
    arrow(ax, (270, 565), (758, 386), BLUE, 7, curve=-.10, scale=30)
    arrow(ax, (980, 550), (782, 386), ORANGE, 7, curve=.18, scale=30)
    node(ax, (770, 376), 30, ORANGE)
    ax.add_patch(Circle((770, 376), 50, fill=False, edgecolor=INK, linewidth=5, zorder=7))
    ax.plot([770, 770], [35, 330], color=ORANGE, lw=3, ls=(0, (2, 5)), alpha=.85)
    finish(fig, "unified-view")


def algorithm_search():
    fig, ax = canvas()
    soft_blob(ax, (20, 35), 1160, 605, PALE_GOLD, .72)
    levels = [
        [(70, 335)],
        [(265, 530), (265, 335), (265, 140)],
        [(500, 600), (500, 470), (500, 335), (500, 205), (500, 70)],
        [(755, 565), (755, 405), (755, 245), (755, 85)],
    ]
    edges = [
        ((70, 335), (265, 530)), ((70, 335), (265, 335)), ((70, 335), (265, 140)),
        ((265, 530), (500, 600)), ((265, 530), (500, 470)),
        ((265, 335), (500, 335)), ((265, 335), (500, 205)),
        ((265, 140), (500, 70)),
        ((500, 600), (755, 565)), ((500, 470), (755, 405)),
        ((500, 335), (755, 245)), ((500, 205), (755, 85)),
    ]
    chosen = {((70, 335), (265, 530)), ((265, 530), (500, 470)), ((500, 470), (755, 405))}
    for a, b in edges:
        ax.plot(*zip(a, b), color=ORANGE if (a, b) in chosen else "#D6D6D6", lw=7 if (a, b) in chosen else 3, zorder=2)
    palette = [BLUE, SKY, TEAL, PURPLE, ORANGE, GOLD, CORAL]
    for li, level in enumerate(levels):
        for i, p in enumerate(level):
            c = palette[(li + 2 * i) % len(palette)]
            node(ax, p, 21 + 4 * li, c, ring=(li > 1 and i % 2 == 1))
    node(ax, (755, 405), 38, ORANGE)
    ax.add_patch(Circle((755, 405), 59, fill=False, edgecolor=CORAL, linewidth=5, zorder=6))
    # Candidate fitness bars and an LLM-like mutation return arc.
    heights = [55, 92, 42, 126, 78, 153]
    for i, h in enumerate(heights):
        ax.add_patch(Rectangle((900 + i * 43, 90), 29, h * 1.25, color=palette[i], alpha=.95))
    ax.plot([875, 1180], [90, 90], color=INK, lw=3)
    arrow(ax, (805, 455), (1040, 375), ORANGE, 5, style=(0, (2, 5)), curve=-.26, scale=26)
    arrow(ax, (1080, 360), (720, 500), INK, 4, style=(0, (2, 5)), curve=.38, scale=24)
    finish(fig, "algorithm-search")


def self_improving_agent():
    fig, ax = canvas()
    # A sequence of code cards climbs with measured performance.
    cards = [(55, 65, BLUE), (315, 165, TEAL), (585, 285, ORANGE), (860, 420, CORAL)]
    for i, (x, y, c) in enumerate(cards):
        ax.add_patch(FancyBboxPatch((x, y), 220, 180, boxstyle="round,pad=0,rounding_size=20", facecolor=PAPER, edgecolor=c, linewidth=5, zorder=4))
        # Oversized code brackets, drawn as geometry rather than text.
        ax.plot([x + 82, x + 52, x + 82], [y + 132, y + 94, y + 56], color=c, lw=8, solid_capstyle="round", zorder=6)
        ax.plot([x + 138, x + 168, x + 138], [y + 132, y + 94, y + 56], color=c, lw=8, solid_capstyle="round", zorder=6)
        ax.plot([x + 126, x + 96], [y + 142, y + 46], color=c, lw=6, solid_capstyle="round", zorder=6)
        # Small evaluation trace rises in every successive version.
        ax.plot([x + 28, x + 72, x + 116, x + 190], [y + 22, y + 28 + 7*i, y + 30 + 12*i, y + 35 + 18*i], color=c, lw=4, alpha=.55, zorder=6)
        if i:
            arrow(ax, (cards[i-1][0] + 220, cards[i-1][1] + 105), (x, y + 72), c, 5, curve=-.08, scale=24)
    # The last version reaches back to rewrite the first: self-improvement.
    arrow(ax, (1080, 545), (150, 300), ORANGE, 6, style=(0, (2, 5)), curve=.38, scale=32)
    finish(fig, "self-improving-agent")


def agent_world_loop():
    fig, ax = canvas()
    # Actual world grid.
    for x in np.arange(35, 625, 105):
        ax.plot([x, x], [25, 650], color=GRID, lw=2.5)
    for y in np.arange(25, 650, 105):
        ax.plot([35, 625], [y, y], color=GRID, lw=2.5)
    actual = np.array([[70, 80], [175, 80], [175, 185], [280, 185], [280, 290], [385, 290], [385, 395], [525, 395]])
    ax.plot(actual[:, 0], actual[:, 1], color=BLUE, lw=14, solid_capstyle="round", zorder=3)
    for p in actual[::2]: node(ax, p, 19, BLUE)
    # World-model bubble, with several imagined futures.
    bubble = Circle((875, 345), 295, facecolor=PALE_BLUE, edgecolor=SKY, linewidth=4, alpha=.95)
    ax.add_patch(bubble)
    start = (690, 270)
    futures = [[start, (800, 330), (915, 430), (1090, 500)], [start, (815, 230), (950, 165), (1110, 230)], [start, (770, 390), (865, 525), (1010, 590)]]
    for i, path in enumerate(futures):
        p = np.array(path)
        ax.plot(p[:, 0], p[:, 1], color=[ORANGE, TEAL, PURPLE][i], lw=6, ls=(0, (2, 5)), solid_capstyle="round")
        node(ax, path[-1], 23, [ORANGE, TEAL, PURPLE][i], ring=True)
    node(ax, start, 32, ORANGE)
    arrow(ax, (520, 440), (665, 360), INK, 5, curve=.08, scale=26)
    arrow(ax, (660, 275), (515, 205), ORANGE, 5, style=(0, (2, 5)), curve=.12, scale=25)
    finish(fig, "agent-world-loop")


def open_endedness():
    fig, ax = canvas()
    # An evolutionary tree that becomes more diverse and deliberately exits the frame.
    rng = np.random.default_rng(7)
    generations = [45, 275, 535, 805, 1080]
    nodes = [[(45, 337)], [(275, 145), (275, 337), (275, 530)]]
    for g, x in enumerate(generations[2:], start=2):
        count = 3 + g * 2
        ys = np.linspace(35, 640, count) + rng.normal(0, 16, count)
        nodes.append([(x, float(y)) for y in ys])
    palette = [BLUE, SKY, TEAL, GOLD, ORANGE, CORAL, PURPLE]
    for g in range(1, len(nodes)):
        prev = nodes[g - 1]
        for i, p in enumerate(nodes[g]):
            parent = min(prev, key=lambda q: abs(q[1] - p[1] + rng.normal(0, 45)))
            ax.plot([parent[0], p[0]], [parent[1], p[1]], color="#D6D6D6" if g < 3 else palette[i % len(palette)], lw=3.5, alpha=.95)
    for g, level in enumerate(nodes):
        for i, p in enumerate(level):
            c = palette[(i + g) % len(palette)]
            if g < 2:
                node(ax, p, 25, c)
            elif i % 3 == 0:
                ax.add_patch(Polygon([(p[0], p[1] + 29), (p[0] - 27, p[1] - 22), (p[0] + 27, p[1] - 22)], closed=True, facecolor=c, edgecolor=PAPER, linewidth=3, zorder=5))
            elif i % 3 == 1:
                node(ax, p, 25, c, ring=True)
            else:
                ax.add_patch(Rectangle((p[0] - 22, p[1] - 22), 44, 44, angle=45, rotation_point="center", facecolor=c, edgecolor=PAPER, linewidth=3, zorder=5))
    for y, c in [(95, CORAL), (330, TEAL), (565, PURPLE)]:
        arrow(ax, (1090, y), (1230, y + 25), c, 5, style=(0, (2, 5)), scale=25)
    finish(fig, "open-endedness")


def exploration_cone():
    fig, ax = canvas()
    xx, yy = np.meshgrid(np.linspace(0, 1200, 180), np.linspace(0, 675, 110))
    z = (1.5 * np.exp(-((xx - 250) ** 2 + (yy - 360) ** 2) / 70000)
         + 2.0 * np.exp(-((xx - 930) ** 2 + (yy - 470) ** 2) / 90000)
         - 1.4 * np.exp(-((xx - 720) ** 2 + (yy - 170) ** 2) / 65000))
    ax.contour(xx, yy, z, levels=13, colors=GRID, linewidths=1.5)
    origin = (205, 260)
    # Familiar short moves.
    for end in [(370, 210), (390, 285), (350, 390), (325, 145)]:
        arrow(ax, origin, end, MUTED, 3, scale=18, alpha=.75)
    # Broad uncertainty cone and a committed exploratory move.
    ax.add_patch(Polygon([origin, (1035, 105), (1110, 590)], closed=True, facecolor=PALE_BLUE, edgecolor="none", alpha=.88, zorder=1))
    ax.plot([origin[0], 1035], [origin[1], 105], color=BLUE, lw=3, ls=(0, (2, 5)))
    ax.plot([origin[0], 1110], [origin[1], 590], color=BLUE, lw=3, ls=(0, (2, 5)))
    arrow(ax, origin, (980, 485), ORANGE, 9, curve=.04, scale=38)
    node(ax, origin, 27, BLUE)
    node(ax, (980, 485), 36, ORANGE)
    ax.add_patch(Circle((980, 485), 62, fill=False, edgecolor=CORAL, linewidth=5))
    finish(fig, "exploration-cone")


def world_model_rollout():
    fig, ax = canvas()
    colors = [BLUE, TEAL, ORANGE, PURPLE]
    xs = [20, 315, 610, 905]
    for i, (x, c) in enumerate(zip(xs, colors)):
        ax.add_patch(FancyBboxPatch((x, 105), 255, 420, boxstyle="round,pad=0,rounding_size=22", facecolor="white", edgecolor=c, linewidth=5, zorder=2, alpha=.98))
        # A tiny evolving scene: horizon, agent, obstacle, goal.
        ax.plot([x + 18, x + 237], [225, 225], color=GRID, lw=4)
        ax.add_patch(Circle((x + 50 + i * 38, 285 + 24 * np.sin(i)), 25, facecolor=c, edgecolor="none", zorder=5))
        ax.add_patch(Rectangle((x + 140, 225), 38, 78 + i * 17, color=PALE_CORAL, ec=ORANGE, lw=3))
        # Goal is a geometric beacon instead of a label.
        gx, gy = x + 210, 425 - i * 25
        ax.add_patch(Circle((gx, gy), 19, facecolor=ORANGE, edgecolor="none", zorder=6))
        ax.add_patch(Circle((gx, gy), 34, fill=False, edgecolor=ORANGE, linewidth=3, zorder=5))
        if i < 3:
            arrow(ax, (x + 258, 330), (xs[i + 1] - 5, 330), INK, 3.5, style=(0, (2, 4)), scale=21)
    # Alternate imagined branch from frame three.
    arrow(ax, (720, 530), (835, 610), BLUE, 3.5, style=(0, (2, 5)), curve=-.2, scale=20)
    ax.add_patch(FancyBboxPatch((845, 550), 180, 105, boxstyle="round,pad=0,rounding_size=16", facecolor=PALE_BLUE, edgecolor=BLUE, linewidth=4))
    ax.plot([875, 985], [580, 625], color=PURPLE, lw=7)
    finish(fig, "world-model-rollout")


def meta_self_modification():
    fig, ax = canvas()
    center = (600, 335)
    rings = [(145, BLUE, 9), (255, ORANGE, 7), (365, PURPLE, 6)]
    for r, c, lw in rings:
        theta = np.linspace(.18, 1.86 * np.pi, 260)
        ax.plot(center[0] + r * np.cos(theta), center[1] + r * np.sin(theta), color=c, lw=lw, solid_capstyle="round")
        end = (center[0] + r * np.cos(theta[-1]), center[1] + r * np.sin(theta[-1]))
        prev = (center[0] + r * np.cos(theta[-1] - .1), center[1] + r * np.sin(theta[-1] - .1))
        arrow(ax, prev, end, c, lw, scale=27)
    # Outer loop edits the mechanism of the inner loop.
    arrow(ax, (930, 505), (765, 440), PURPLE, 6, style=(0, (2, 5)), curve=.2, scale=28)
    arrow(ax, (765, 440), (705, 360), ORANGE, 6, style=(0, (2, 5)), curve=-.1, scale=28)
    # Central code/evaluation glyph.
    ax.add_patch(FancyBboxPatch((510, 255), 180, 160, boxstyle="round,pad=0,rounding_size=18", facecolor="white", edgecolor=INK, linewidth=4, zorder=9))
    ax.plot([580, 545, 580], [375, 335, 295], color=BLUE, lw=9, solid_capstyle="round", zorder=10)
    ax.plot([620, 655, 620], [375, 335, 295], color=ORANGE, lw=9, solid_capstyle="round", zorder=10)
    finish(fig, "meta-self-modification")


def discovery_cycle():
    fig, ax = canvas()
    # Competing causal explanations.
    graphs = [
        ((65, 350), [(80, 555), (265, 390), (105, 145)], [(0, 1), (0, 2), (2, 1)]),
        ((365, 350), [(390, 555), (575, 390), (415, 145)], [(0, 2), (2, 1), (1, 0)]),
    ]
    for gi, (_, pts, edges) in enumerate(graphs):
        for a, b in edges:
            arrow(ax, pts[a], pts[b], MUTED, 4, scale=20)
        for i, p in enumerate(pts): node(ax, p, 29, [BLUE, TEAL, ORANGE][i], ring=(gi == 1 and i == 1))
    ax.add_patch(Circle((330, 350), 18, facecolor=MUTED, edgecolor="none"))
    ax.add_patch(Circle((330, 350), 34, fill=False, edgecolor=GRID, linewidth=6))
    # Intervention selects an experiment and separates the models.
    arrow(ax, (615, 350), (775, 350), ORANGE, 8, scale=34)
    ax.plot([680, 680], [245, 455], color=ORANGE, lw=9)
    ax.plot([645, 715], [420, 280], color=ORANGE, lw=9, solid_capstyle="round")
    # Result and revised explanatory model.
    xs = np.linspace(785, 1190, 180)
    y1 = 350 + 145 * np.sin((xs - 785) / 92) * np.exp(-(xs - 785) / 520)
    y2 = 350 + 42 * np.sin((xs - 785) / 58)
    ax.fill_between(xs, y1, y2, color=PALE_GOLD, alpha=.9)
    ax.plot(xs, y1, color=BLUE, lw=7)
    ax.plot(xs, y2, color=ORANGE, lw=5, ls=(0, (2, 4)))
    node(ax, (1135, float(np.interp(1135, xs, y1))), 31, ORANGE)
    arrow(ax, (1100, 165), (470, 85), BLUE, 5, style=(0, (2, 5)), curve=-.20, scale=28)
    finish(fig, "discovery-cycle")


def plug_bo_diagram():
    fig, ax = canvas()
    # Objective landscape in the center.
    x = np.linspace(345, 850, 320)
    mean = 315 + 80 * np.sin((x - 360) / 95) + 45 * np.cos((x - 330) / 42)
    band = 35 + 75 * np.abs(x - 590) / 270
    ax.fill_between(x, mean - band, mean + band, color=SKY, alpha=.22)
    ax.plot(x, mean, color=BLUE, lw=4)
    sample_x = np.array([395, 485, 625, 760])
    ax.scatter(sample_x, np.interp(sample_x, x, mean), s=120, c=[TEAL, BLUE, ORANGE, CORAL], edgecolors=PAPER, linewidths=3, zorder=7)
    # Plug-in modules are visually different but snap into one loop.
    modules = [(25, 470, PALE_BLUE, BLUE), (955, 470, PALE_GOLD, ORANGE), (955, 65, PALE_CORAL, CORAL), (25, 65, PALE_TEAL, TEAL)]
    for mi, (mx, my, fill, edge) in enumerate(modules):
        ax.add_patch(FancyBboxPatch((mx, my), 220, 140, boxstyle="round,pad=0,rounding_size=20", facecolor=fill, edgecolor=edge, linewidth=4))
        # connector pins
        side = 1 if mx < 600 else -1
        px = mx + 220 if side == 1 else mx
        for dy in (-25, 0, 25):
            ax.add_patch(Rectangle((px if side == 1 else px - 18, my + 70 + dy - 6), 18, 12, facecolor=edge, edgecolor="none"))
        cx, cy = mx + 110, my + 70
        if mi == 0:  # surrogate wave
            qx = np.linspace(cx - 72, cx + 72, 80)
            ax.plot(qx, cy + 27*np.sin((qx-cx)/24), color=edge, lw=7)
        elif mi == 1:  # acquisition target
            for rr in (18, 38, 58):
                ax.add_patch(Circle((cx, cy), rr, fill=False, edgecolor=edge, linewidth=5))
            node(ax, (cx + 18, cy + 12), 9, edge)
        elif mi == 2:  # tools
            ax.plot([cx-55, cx+55], [cy-38, cy+38], color=edge, lw=10, solid_capstyle="round")
            ax.plot([cx-55, cx+55], [cy+38, cy-38], color=edge, lw=10, solid_capstyle="round")
        else:  # context stack
            for j, width in enumerate((130, 95, 115)):
                ax.plot([cx-width/2, cx+width/2], [cy+34-j*34]*2, color=edge, lw=8, solid_capstyle="round")
    arrow(ax, (250, 535), (390, 450), BLUE, 5, curve=.08, scale=25)
    arrow(ax, (840, 450), (950, 535), ORANGE, 5, curve=.08, scale=25)
    arrow(ax, (950, 135), (820, 225), CORAL, 5, curve=.08, scale=25)
    arrow(ax, (385, 220), (250, 135), TEAL, 5, curve=.08, scale=25)
    # One highlighted recommendation closes the BO loop.
    chosen_x = 705
    chosen_y = float(np.interp(chosen_x, x, mean))
    node(ax, (chosen_x, chosen_y), 30, ORANGE)
    ax.add_patch(Circle((chosen_x, chosen_y), 52, fill=False, edgecolor=ORANGE, linewidth=5))
    arrow(ax, (705, chosen_y + 58), (705, 630), ORANGE, 5, style=(0, (2, 5)), scale=27)
    finish(fig, "plug-bo-diagram")


def main():
    unified_view()
    algorithm_search()
    self_improving_agent()
    agent_world_loop()
    open_endedness()
    exploration_cone()
    world_model_rollout()
    meta_self_modification()
    discovery_cycle()
    plug_bo_diagram()
    print(f"Generated 10 thumbnails in {OUT}")


if __name__ == "__main__":
    main()
