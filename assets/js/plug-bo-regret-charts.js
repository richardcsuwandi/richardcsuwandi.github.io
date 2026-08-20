/* Interactive, theme-aware regret charts for the PlugBO companion post.
   Hover and legend behavior follow plugbo's sara-viz compare view. */

(() => {
  const COLORS = {
    vanilla: "var(--cat-4)",
    cake: "var(--cat-1)",
    turbo: "var(--cat-6)",
    pibo: "var(--cat-2)",
    "sara-lenz": "var(--cat-3)",
    "sara-lenz-cake": "var(--cat-7)",
    "sara-lenz-pibo": "var(--cat-8)",
    "sara-lenz-turbo": "var(--cat-8)",
    "sara-only": "var(--cat-5)",
  };
  const FALLBACK = [
    "var(--cat-1)",
    "var(--cat-2)",
    "var(--cat-3)",
    "var(--cat-4)",
    "var(--cat-5)",
    "var(--cat-6)",
    "var(--cat-7)",
    "var(--cat-8)",
  ];

  function colorOf(name, i) {
    return COLORS[name] || FALLBACK[i % FALLBACK.length];
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  function fmtNum(n, digits = 4) {
    if (n === null || n === undefined || Number.isNaN(n) || !Number.isFinite(n)) return "—";
    if (n === 0) return "0";
    if (Math.abs(n) >= 1e5 || Math.abs(n) < 1e-3) return n.toExponential(2);
    let s = n.toFixed(digits);
    if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "");
    return s;
  }

  function fmtTick(v, span) {
    if (!Number.isFinite(v)) return "";
    if (span < 0.05) return v.toExponential(1);
    if (span < 1) return v.toFixed(3);
    if (span < 20) return v.toFixed(2);
    return v.toFixed(1);
  }

  function withEvalZero(trace) {
    return [Infinity, ...trace];
  }

  function ensureTooltip() {
    let tip = document.getElementById("plug-bo-regret-tooltip");
    if (tip) return tip;
    tip = document.createElement("div");
    tip.id = "plug-bo-regret-tooltip";
    tip.className = "regret-tooltip";
    tip.setAttribute("role", "tooltip");
    document.body.appendChild(tip);
    window.addEventListener(
      "scroll",
      () => {
        tip.style.display = "none";
      },
      { passive: true }
    );
    return tip;
  }

  function mountChart(container) {
    if (container.dataset.bound === "1") return;
    container.dataset.bound = "1";
    const src = container.getAttribute("data-src");
    if (!src) return;

    const hidden = new Set();
    let data = null;

    function draw() {
      if (!data) return;
      const series = data.series || [];
      const visible = series.filter((s) => !hidden.has(s.name));
      const labels = (visible.length ? visible : series).map((s) => s.name);
      const byName = Object.fromEntries(series.map((s) => [s.name, s]));

      const W = Math.max(container.clientWidth || 820, 320);
      const H = Math.max(520, Math.round(W * 0.66));
      const pad = { l: 58, r: 18, t: 16, b: 36 };
      const x0 = pad.l;
      const y1 = pad.t;
      const x1 = W - pad.r;
      const y0 = H - pad.b;

      const isLog = data.scale === "log";
      const plotTraces = {};
      for (const name of labels) plotTraces[name] = withEvalZero(byName[name].trace);
      const finiteVals = labels.flatMap((name) => plotTraces[name].filter((v) => Number.isFinite(v)));
      const nMax = Math.max(data.budget || 0, ...series.map((s) => s.trace.length)) + 1;
      const padTrace = (trace) => {
        if (trace.length >= nMax) return trace.slice(0, nMax);
        return trace.concat(Array(nMax - trace.length).fill(trace[trace.length - 1]));
      };

      let X, Y, grid, span, yMin, yMax, floor, logMin, logMax;
      X = (i) => x0 + ((x1 - x0) * i) / Math.max(nMax - 1, 1);

      if (isLog) {
        // Log scale: BoLT-style regret spans orders of magnitude between the
        // warm-start and the converged tail, so a linear axis crushes the
        // whole interesting part of the curve against the bottom. Bands can
        // dip through zero (a lower stderr bound below the mean); those get
        // floored to half the smallest positive value on screen rather than
        // dropped, so the band still renders instead of clipping.
        const positiveVals = finiteVals.filter((v) => v > 0);
        yMin = positiveVals.length ? Math.min(...positiveVals) : 1e-6;
        yMax = positiveVals.length ? Math.max(...positiveVals) : 1;
        if (yMax <= yMin) yMax = yMin * 10;
        floor = yMin * 0.5;
        logMin = Math.log10(floor);
        logMax = Math.log10(yMax);
        Y = (v) => {
          if (!Number.isFinite(v)) return y1;
          const lv = Math.log10(Math.max(v, floor));
          return y1 + (y0 - y1) * (1 - (lv - logMin) / (logMax - logMin));
        };
        grid = "";
        for (const frac of [0, 0.25, 0.5, 0.75, 1]) {
          const v = Math.pow(10, logMin + frac * (logMax - logMin));
          const yy = y1 + (y0 - y1) * (1 - frac);
          grid += `<line class="gridline" x1="${x0}" x2="${x1}" y1="${yy}" y2="${yy}"></line>`;
          grid += `<text class="axis-label" x="${x0 - 8}" y="${yy + 4}" text-anchor="end">${fmtNum(v, 3)}</text>`;
        }
      } else {
        yMin = finiteVals.length ? Math.min(0, ...finiteVals) : 0;
        yMax = finiteVals.length ? Math.max(...finiteVals) : 1;
        if (yMax <= yMin) yMax = yMin + 1;
        span = yMax - yMin;
        Y = (v) => {
          if (!Number.isFinite(v)) return y1;
          return y1 + (y0 - y1) * (1 - (v - yMin) / (yMax - yMin));
        };
        grid = "";
        for (const frac of [0, 0.25, 0.5, 0.75, 1]) {
          const v = yMin + frac * span;
          const yy = Y(v);
          grid += `<line class="gridline" x1="${x0}" x2="${x1}" y1="${yy}" y2="${yy}"></line>`;
          grid += `<text class="axis-label" x="${x0 - 8}" y="${yy + 4}" text-anchor="end">${fmtTick(v, span)}</text>`;
        }
      }

      let seriesSvg = "";
      const legendRows = [];
      series.forEach((s, i) => {
        const color = colorOf(s.name, i);
        const nObs = s.trace.length;
        const evalNote = nObs < nMax - 1 ? `, ${nObs} eval${nObs === 1 ? "" : "s"}` : "";
        const seNote = s.stderr ? ` ±${fmtNum(s.stderr[s.stderr.length - 1], 4)}` : "";
        const faded = hidden.has(s.name);
        legendRows.push({
          name: s.name,
          text: `${s.name} (${s.stderr ? "mean" : "best"} ${fmtNum(s.best, 4)}${seNote}${evalNote})`,
          color,
          faded,
        });
        if (faded) return;
        const padded = padTrace(plotTraces[s.name]);
        if (s.stderr) {
          const stderrPadded = padTrace(withEvalZero(s.stderr).map((v, j) => (j === 0 ? 0 : v)));
          const upper = padded.map((v, j) => (Number.isFinite(v) ? v + stderrPadded[j] : v));
          const lower = padded.map((v, j) => (Number.isFinite(v) ? v - stderrPadded[j] : v));
          const bandPts =
            upper.map((v, j) => `${X(j)},${Y(v)}`).join(" L ") +
            " L " +
            lower
              .slice()
              .reverse()
              .map((v, j) => `${X(upper.length - 1 - j)},${Y(v)}`)
              .join(" L ");
          seriesSvg += `<path d="M ${bandPts} Z" fill="${color}" class="band"></path>`;
        }
        const pts = padded.map((v, j) => `${X(j)},${Y(v)}`).join(" ");
        seriesSvg += `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2"></polyline>`;
        seriesSvg += `<circle cx="${X(nObs)}" cy="${Y(s.trace[nObs - 1])}" r="4" fill="${color}" class="end-marker"></circle>`;
      });

      let legendHtml = `<div class="regret-legend">`;
      legendRows.forEach((row) => {
        legendHtml += `<button type="button" class="regret-legend-item" data-name="${escapeHtml(row.name)}" style="opacity:${row.faded ? 0.4 : 1}">`;
        legendHtml += `<span class="regret-legend-swatch" style="background:${row.color}"></span>`;
        legendHtml += `<span class="regret-legend-label">${escapeHtml(row.text)}</span>`;
        legendHtml += `</button>`;
      });
      legendHtml += `</div>`;

      container.innerHTML = `
        <svg class="regret-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeHtml(container.getAttribute("aria-label") || data.yLabel)}">
          ${grid}
          <line class="baseline" x1="${x0}" x2="${x1}" y1="${y0}" y2="${y0}"></line>
          <line class="baseline" x1="${x0}" x2="${x0}" y1="${y0}" y2="${y1}"></line>
          <text class="axis-label" x="${x0}" y="${y0 + 22}">0</text>
          <text class="axis-label" x="${x1}" y="${y0 + 22}" text-anchor="end">${nMax - 1} ${escapeHtml(data.xLabel || "evals")}</text>
          ${seriesSvg}
          <g class="hover-layer"></g>
        </svg>
        ${legendHtml}
      `;

      const svg = container.querySelector("svg");
      const hoverLayer = container.querySelector(".hover-layer");
      const tooltip = ensureTooltip();

      container.querySelectorAll(".regret-legend-item").forEach((item) => {
        item.addEventListener("click", (evt) => {
          evt.stopPropagation();
          const name = item.getAttribute("data-name");
          if (hidden.has(name)) hidden.delete(name);
          else if (hidden.size < series.length - 1) hidden.add(name);
          draw();
        });
      });

      svg.addEventListener("mousemove", (evt) => {
        const rect = svg.getBoundingClientRect();
        const mx = ((evt.clientX - rect.left) / rect.width) * W;
        const evalIdx = Math.round(((mx - x0) / (x1 - x0)) * (nMax - 1));
        const clamped = Math.max(0, Math.min(nMax - 1, evalIdx));
        let tipRows = `<div class="tip-step">eval ${clamped}</div>`;
        let dots = `<line class="crosshair" x1="${X(clamped)}" x2="${X(clamped)}" y1="${y1}" y2="${y0}"></line>`;
        labels.forEach((name) => {
          const trace = plotTraces[name];
          const idx = Math.min(clamped, trace.length - 1);
          const v = trace[idx];
          const color = colorOf(name, series.findIndex((s) => s.name === name));
          dots += `<circle class="hover-dot" cx="${X(clamped)}" cy="${Y(v)}" r="4.5" style="fill:${color}"></circle>`;
          tipRows += `<div><span style="color:${color}">●</span> ${escapeHtml(name)}: ${fmtNum(v)}</div>`;
        });
        hoverLayer.innerHTML = dots;
        tooltip.style.display = "block";
        tooltip.style.left = `${evt.clientX + 14}px`;
        tooltip.style.top = `${evt.clientY - 10}px`;
        tooltip.innerHTML = tipRows;
      });
      svg.addEventListener("mouseleave", () => {
        hoverLayer.innerHTML = "";
        tooltip.style.display = "none";
      });
    }

    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then((json) => {
        data = json;
        draw();
      })
      .catch(() => {
        container.textContent = "Could not load chart data.";
      });

    if (!container._resizeObserver) {
      let raf = null;
      const ro = new ResizeObserver(() => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      });
      ro.observe(container);
      container._resizeObserver = ro;
    }
  }

  const TOOL_COLORS = {
    submit: "var(--cat-1)",
    suggest: "var(--cat-2)",
    status: "var(--cat-3)",
    incumbent: "var(--cat-4)",
    diagnostics: "var(--cat-5)",
    trials: "var(--cat-6)",
    score: "var(--cat-7)",
  };

  function mountToolUseChart(container) {
    if (container.dataset.bound === "1") return;
    container.dataset.bound = "1";
    const src = container.getAttribute("data-src");
    if (!src) return;

    let data = null;

    function draw() {
      if (!data) return;
      const cats = data.categories;
      const W = Math.max(container.clientWidth || 820, 320);
      const H = Math.max(420, Math.round(W * 0.52));
      const pad = { l: 42, r: 18, t: 16, b: 36 };
      const x0 = pad.l;
      const y1 = pad.t;
      const x1 = W - pad.r;
      const y0 = H - pad.b;
      const X = (f) => x0 + (x1 - x0) * f;
      const Y = (f) => y0 - (y0 - y1) * f;

      // Bin midpoints, with the first/last fraction held flat out to the
      // plot edges so the stack fills the full [0,1] width.
      const xs = [0, ...data.bins.map((b) => (b.x0 + b.x1) / 2), 1];
      const stacks = xs.map((_, i) => {
        const bin = data.bins[Math.min(Math.max(i - 1, 0), data.bins.length - 1)];
        const total = cats.reduce((s, c) => s + (bin.counts[c] || 0), 0) || 1;
        let cum = 0;
        const layer = {};
        cats.forEach((c) => {
          const f = (bin.counts[c] || 0) / total;
          layer[c] = [cum, cum + f];
          cum += f;
        });
        return layer;
      });

      let grid = "";
      for (const frac of [0, 0.25, 0.5, 0.75, 1]) {
        const yy = Y(frac);
        grid += `<line class="gridline" x1="${x0}" x2="${x1}" y1="${yy}" y2="${yy}"></line>`;
        grid += `<text class="axis-label" x="${x0 - 8}" y="${yy + 4}" text-anchor="end">${frac.toFixed(2)}</text>`;
      }

      let bandsSvg = "";
      cats.forEach((c, i) => {
        const color = TOOL_COLORS[c] || FALLBACK[i % FALLBACK.length];
        const upperPts = xs.map((f, j) => `${X(f)},${Y(stacks[j][c][1])}`).join(" L ");
        const lowerPts = xs
          .slice()
          .reverse()
          .map((f, j) => `${X(f)},${Y(stacks[xs.length - 1 - j][c][0])}`)
          .join(" L ");
        bandsSvg += `<path d="M ${upperPts} L ${lowerPts} Z" fill="${color}" fill-opacity="0.85"></path>`;
      });

      const legendRows = cats.map((c, i) => ({
        name: c,
        color: TOOL_COLORS[c] || FALLBACK[i % FALLBACK.length],
        text: `${c} (${data.totals[c]}, ${fmtNum((100 * data.totals[c]) / data.nCalls, 1)}%)`,
      }));
      let legendHtml = `<div class="regret-legend">`;
      legendRows.forEach((row) => {
        legendHtml += `<span class="regret-legend-item" style="cursor:default">`;
        legendHtml += `<span class="regret-legend-swatch" style="background:${row.color}"></span>`;
        legendHtml += `<span class="regret-legend-label">${escapeHtml(row.text)}</span>`;
        legendHtml += `</span>`;
      });
      legendHtml += `</div>`;

      const statsHtml = `
        <div class="tool-use-stats">
          <div><strong>${data.nCalls}</strong><span>lenz calls</span></div>
          <div><strong>${data.nRuns}</strong><span>runs (sara-lenz family)</span></div>
          <div><strong>${fmtNum(data.nCalls / data.nEvals, 2)}</strong><span>calls / evaluation</span></div>
          <div><strong>${cats.length}</strong><span>call-type buckets</span></div>
        </div>
      `;

      container.innerHTML = `
        ${statsHtml}
        <svg class="regret-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeHtml(container.getAttribute("aria-label") || "lenz call type over normalized trial progress")}">
          ${grid}
          <line class="baseline" x1="${x0}" x2="${x1}" y1="${y0}" y2="${y0}"></line>
          <line class="baseline" x1="${x0}" x2="${x0}" y1="${y0}" y2="${y1}"></line>
          <text class="axis-label" x="${x0}" y="${y0 + 22}">0</text>
          <text class="axis-label" x="${x1}" y="${y0 + 22}" text-anchor="end">1.0 normalized trial progress</text>
          ${bandsSvg}
        </svg>
        ${legendHtml}
      `;
    }

    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then((json) => {
        data = json;
        draw();
      })
      .catch(() => {
        container.textContent = "Could not load chart data.";
      });

    if (!container._resizeObserver) {
      let raf = null;
      const ro = new ResizeObserver(() => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      });
      ro.observe(container);
      container._resizeObserver = ro;
    }
  }

  function boot() {
    document.querySelectorAll(".regret-chart[data-src]:not(.tool-use-chart)").forEach(mountChart);
    document.querySelectorAll(".tool-use-chart[data-src]").forEach(mountToolUseChart);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  window.addEventListener("load", boot);
})();
