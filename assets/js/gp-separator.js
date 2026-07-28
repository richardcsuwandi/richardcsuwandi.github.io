/**
 * Interactive GP / Bayesian optimization separator
 *
 * A full-width strip showing a Gaussian process posterior over an unknown 1-D
 * objective. The page starts with a single, randomly placed observation, so the
 * posterior is mostly prior: flat mean, wide band. Clicking anywhere on the
 * strip evaluates the latent objective at that x, conditions the GP on the new
 * observation and animates to the updated posterior. The band pinches where you
 * have sampled and stays wide where you have not, so the picture sharpens as
 * points accumulate. State lives in memory only: a reload starts over with one
 * point.
 *
 * Layers, back to front:
 *   1. The latent objective, very faint (the thing being learned)
 *   2. +/-2 sigma credible band
 *   3. Posterior mean
 *   4. Dashed line at the incumbent best value
 *   5. Observations, in query order
 *   6. Expected-improvement suggestion: dashed rule + hollow marker
 *   7. Hover/keyboard cursor: where the next click would land
 *
 * Markup: <div class="gp-separator"><svg class="gp-separator-svg"></svg></div>
 * Colours come from CSS (see _sass/_gp-separator.scss); JS only sets geometry.
 */
(function () {
  var SVG_NS = "http://www.w3.org/2000/svg";

  var container = document.querySelector(".gp-separator");
  if (!container) return;
  var svg = container.querySelector(".gp-separator-svg");
  if (!svg) return;

  // GP hyperparameters, in normalized x units on [0, 1].
  var LENGTHSCALE = 0.11;
  var SIGNAL_VAR = 1.0;
  var NOISE_VAR = 1e-4;
  var XI = 0.01; // EI exploration margin
  var GRID = 240;
  var MAX_OBS = 40; // keeps the O(n^3) refit imperceptible
  var MIN_SEP = 0.006; // ignore clicks that duplicate an existing design point
  var ANIM_MS = 380;

  // ---------------------------------------------------------------------------
  // Latent objective: a sum of bumps, i.e. the shape of a GP draw. Deterministic,
  // so the target is the same on every load even though the seed point is not.
  // Global optimum sits near t = 0.66, with a decoy peak on the left and a
  // trough in the middle to rule out.
  // ---------------------------------------------------------------------------
  function bump(t, center, width) {
    var d = (t - center) / width;
    return Math.exp(-0.5 * d * d);
  }

  function objective(t) {
    return (
      0.95 * bump(t, 0.66, 0.09) +
      0.6 * bump(t, 0.2, 0.12) +
      0.5 * bump(t, 0.93, 0.07) -
      0.55 * bump(t, 0.44, 0.1) -
      0.35 * bump(t, 0.04, 0.09)
    );
  }

  // ---------------------------------------------------------------------------
  // Linear algebra
  // ---------------------------------------------------------------------------
  function kernel(a, b) {
    var d = (a - b) / LENGTHSCALE;
    return SIGNAL_VAR * Math.exp(-0.5 * d * d);
  }

  /** Lower-triangular Cholesky factor of a symmetric positive-definite matrix. */
  function cholesky(A) {
    var n = A.length;
    var L = [];
    var i, j, k;
    for (i = 0; i < n; i++) L.push(new Float64Array(n));
    for (i = 0; i < n; i++) {
      for (j = 0; j <= i; j++) {
        var s = A[i][j];
        for (k = 0; k < j; k++) s -= L[i][k] * L[j][k];
        if (i === j) L[i][i] = Math.sqrt(Math.max(s, 1e-10));
        else L[i][j] = s / L[j][j];
      }
    }
    return L;
  }

  /** Solve L L^T x = b by forward then back substitution. */
  function cholSolve(L, b) {
    var n = L.length;
    var y = new Float64Array(n);
    var x = new Float64Array(n);
    var i, k, s;
    for (i = 0; i < n; i++) {
      s = b[i];
      for (k = 0; k < i; k++) s -= L[i][k] * y[k];
      y[i] = s / L[i][i];
    }
    for (i = n - 1; i >= 0; i--) {
      s = y[i];
      for (k = i + 1; k < n; k++) s -= L[k][i] * x[k];
      x[i] = s / L[i][i];
    }
    return x;
  }

  /** Standard normal CDF via an Abramowitz-Stegun erf approximation. */
  function normalCdf(z) {
    var sign = z < 0 ? -1 : 1;
    var a = Math.abs(z) / Math.SQRT2;
    var t = 1 / (1 + 0.3275911 * a);
    var poly =
      t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
    var erf = 1 - poly * Math.exp(-a * a);
    return 0.5 * (1 + sign * erf);
  }

  function normalPdf(z) {
    return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
  }

  // ---------------------------------------------------------------------------
  // GP posterior
  // ---------------------------------------------------------------------------
  function fitGP(xs, ys) {
    var n = xs.length;
    var K = [];
    var i, j;
    for (i = 0; i < n; i++) {
      K.push(new Float64Array(n));
      for (j = 0; j < n; j++) {
        K[i][j] = kernel(xs[i], xs[j]) + (i === j ? NOISE_VAR : 0);
      }
    }
    var L = cholesky(K);
    return { xs: xs.slice(), L: L, alpha: cholSolve(L, ys) };
  }

  /** Posterior mean and standard deviation at a single test point. */
  function predict(gp, x) {
    var n = gp.xs.length;
    var ks = new Float64Array(n);
    var mean = 0;
    var i;
    for (i = 0; i < n; i++) {
      ks[i] = kernel(x, gp.xs[i]);
      mean += ks[i] * gp.alpha[i];
    }
    var v = cholSolve(gp.L, ks);
    var variance = SIGNAL_VAR;
    for (i = 0; i < n; i++) variance -= ks[i] * v[i];
    return { mean: mean, sd: Math.sqrt(Math.max(variance, 0)) };
  }

  function expectedImprovement(mean, sd, best) {
    if (sd < 1e-9) return 0;
    var z = (mean - best - XI) / sd;
    return (mean - best - XI) * normalCdf(z) + sd * normalPdf(z);
  }

  // ---------------------------------------------------------------------------
  // State
  //
  // `shown` is what is currently on screen: after a query it eases from the old
  // posterior to the new one, so the band visibly collapses around the point you
  // just paid for.
  // ---------------------------------------------------------------------------
  var grid = [];
  var truth = [];
  var i;
  for (i = 0; i < GRID; i++) {
    grid.push(i / (GRID - 1));
    truth.push(objective(grid[i]));
  }

  // Fixed y-domain, generous enough for the prior band. A domain recomputed per
  // frame would make the whole picture jump on every click.
  var yLo = Math.min.apply(null, truth) - 0.45;
  var yHi = Math.max.apply(null, truth) + 0.45;

  var state = {
    xs: [],
    ys: [],
    born: [], // timestamp per observation, for the pop-in animation
    gp: null,
    best: -Infinity,
    nextX: 0.5,
    target: null, // posterior on `grid` after the latest observation
    from: null, // posterior the current animation started from
    shown: null, // what render() draws
    animStart: 0,
    cursorX: null, // pointer or keyboard cursor, null when neither is active
    keyboardX: 0.5,
    hinted: true, // hint shows until the first query
  };

  function posterior(gp) {
    return grid.map(function (t) {
      var p = predict(gp, t);
      return { mean: p.mean, sd: p.sd };
    });
  }

  function argmaxEI(gp, best) {
    var bestEi = -Infinity;
    var bestX = grid[0];
    for (var k = 0; k < grid.length; k++) {
      var p = predict(gp, grid[k]);
      var ei = expectedImprovement(p.mean, p.sd, best);
      if (ei > bestEi) {
        bestEi = ei;
        bestX = grid[k];
      }
    }
    return bestX;
  }

  /** Evaluate the objective at x, condition on it, and animate to the update. */
  function observe(x, animate) {
    if (state.xs.length >= MAX_OBS) return;
    for (var k = 0; k < state.xs.length; k++) {
      if (Math.abs(state.xs[k] - x) < MIN_SEP) return;
    }

    var now = performance.now();
    state.xs.push(x);
    state.ys.push(objective(x));
    state.born.push(animate ? now : 0);
    state.gp = fitGP(state.xs, state.ys);
    state.best = Math.max.apply(null, state.ys);
    state.nextX = argmaxEI(state.gp, state.best);

    state.from = animate && state.shown ? state.shown : null;
    state.target = posterior(state.gp);
    state.shown = state.from ? state.shown : state.target;
    state.animStart = now;
    requestRender();
  }

  function easeOutCubic(t) {
    var u = 1 - t;
    return 1 - u * u * u;
  }

  /** Advance the transition; returns true while more frames are needed. */
  function step(now) {
    var animating = false;

    if (state.from) {
      var t = Math.min(1, (now - state.animStart) / ANIM_MS);
      var e = easeOutCubic(t);
      state.shown = state.target.map(function (p, k) {
        var q = state.from[k];
        return { mean: q.mean + (p.mean - q.mean) * e, sd: q.sd + (p.sd - q.sd) * e };
      });
      if (t >= 1) state.from = null;
      else animating = true;
    }

    for (var k = 0; k < state.born.length; k++) {
      if (state.born[k] && now - state.born[k] < ANIM_MS) animating = true;
    }
    return animating;
  }

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------
  function el(name, attrs) {
    var node = document.createElementNS(SVG_NS, name);
    for (var key in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, key)) {
        node.setAttribute(key, attrs[key]);
      }
    }
    return node;
  }

  var geom = { padX: 8, padY: 9 };

  function render(now) {
    var width = container.clientWidth;
    var height = container.clientHeight;
    if (!width || !height || !state.shown) return;

    var innerH = height - 2 * geom.padY;
    var innerW = width - 2 * geom.padX;
    var span = yHi - yLo;

    function sx(x) {
      return geom.padX + x * innerW;
    }
    function sy(y) {
      return geom.padY + (1 - (y - yLo) / span) * innerH;
    }

    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    // 1) The latent objective, faint: what the GP is trying to recover.
    svg.appendChild(
      el("polyline", {
        class: "gp-truth",
        points: grid
          .map(function (t, k) {
            return sx(t).toFixed(2) + "," + sy(truth[k]).toFixed(2);
          })
          .join(" "),
      })
    );

    // 2) Credible band
    var upper = state.shown.map(function (p, k) {
      return sx(grid[k]).toFixed(2) + "," + sy(p.mean + 2 * p.sd).toFixed(2);
    });
    var lower = state.shown
      .map(function (p, k) {
        return sx(grid[k]).toFixed(2) + "," + sy(p.mean - 2 * p.sd).toFixed(2);
      })
      .reverse();
    svg.appendChild(el("polygon", { class: "gp-band", points: upper.concat(lower).join(" ") }));

    // 3) Posterior mean
    svg.appendChild(
      el("polyline", {
        class: "gp-mean",
        points: state.shown
          .map(function (p, k) {
            return sx(grid[k]).toFixed(2) + "," + sy(p.mean).toFixed(2);
          })
          .join(" "),
      })
    );

    // 4) Incumbent best
    svg.appendChild(
      el("line", {
        class: "gp-incumbent",
        x1: 0,
        x2: width,
        y1: sy(state.best).toFixed(2),
        y2: sy(state.best).toFixed(2),
      })
    );

    // 5) Observations, newest popping in
    state.xs.forEach(function (x, k) {
      var age = state.born[k] ? (now - state.born[k]) / ANIM_MS : 1;
      var grow = age >= 1 ? 1 : easeOutCubic(Math.max(age, 0));
      svg.appendChild(
        el("circle", {
          class: "gp-obs",
          cx: sx(x).toFixed(2),
          cy: sy(state.ys[k]).toFixed(2),
          r: (5 * (0.4 + 0.6 * grow)).toFixed(2),
        })
      );
    });

    // 6) Where expected improvement says to look next
    var nextMean = predict(state.gp, state.nextX).mean;
    svg.appendChild(
      el("line", {
        class: "gp-next-rule",
        x1: sx(state.nextX).toFixed(2),
        x2: sx(state.nextX).toFixed(2),
        y1: geom.padY,
        y2: height - geom.padY,
      })
    );
    svg.appendChild(
      el("circle", {
        class: "gp-next",
        cx: sx(state.nextX).toFixed(2),
        cy: sy(nextMean).toFixed(2),
        r: 5,
      })
    );

    // 7) Cursor: the query the next click would make
    if (state.cursorX !== null) {
      var cm = predict(state.gp, state.cursorX).mean;
      svg.appendChild(
        el("line", {
          class: "gp-cursor-rule",
          x1: sx(state.cursorX).toFixed(2),
          x2: sx(state.cursorX).toFixed(2),
          y1: geom.padY,
          y2: height - geom.padY,
        })
      );
      svg.appendChild(
        el("circle", {
          class: "gp-cursor",
          cx: sx(state.cursorX).toFixed(2),
          cy: sy(cm).toFixed(2),
          r: 4,
        })
      );
    }

    // 8) Labels
    var count = el("text", { class: "gp-label", x: geom.padX, y: height - geom.padY });
    count.textContent = "n = " + state.xs.length;
    svg.appendChild(count);

    if (state.hinted || state.xs.length >= MAX_OBS) {
      var hint = el("text", {
        class: "gp-label gp-hint",
        x: width - geom.padX,
        y: height - geom.padY,
        "text-anchor": "end",
      });
      hint.textContent =
        state.xs.length >= MAX_OBS ? "budget spent — reload to restart" : "click anywhere to sample the objective";
      svg.appendChild(hint);
    }
  }

  // ---------------------------------------------------------------------------
  // Frame loop: one rAF at a time, whether the trigger is a query or a hover.
  // ---------------------------------------------------------------------------
  var frame = null;

  function tick(now) {
    frame = null;
    var animating = step(now);
    render(now);
    if (animating) frame = requestAnimationFrame(tick);
  }

  function requestRender() {
    if (frame === null) frame = requestAnimationFrame(tick);
  }

  // ---------------------------------------------------------------------------
  // Input
  // ---------------------------------------------------------------------------
  function clamp01(v) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  function xFromEvent(event) {
    var rect = container.getBoundingClientRect();
    var innerW = rect.width - 2 * geom.padX;
    if (innerW <= 0) return 0.5;
    return clamp01((event.clientX - rect.left - geom.padX) / innerW);
  }

  function query(x) {
    state.hinted = false;
    observe(x, true);
  }

  container.addEventListener("pointermove", function (event) {
    if (event.pointerType === "touch") return;
    state.cursorX = xFromEvent(event);
    requestRender();
  });

  container.addEventListener("pointerleave", function () {
    if (document.activeElement === container) return;
    state.cursorX = null;
    requestRender();
  });

  container.addEventListener("pointerdown", function (event) {
    if (event.button !== undefined && event.button !== 0) return;
    query(xFromEvent(event));
  });

  container.addEventListener("focus", function () {
    state.cursorX = state.keyboardX;
    requestRender();
  });

  container.addEventListener("blur", function () {
    state.cursorX = null;
    requestRender();
  });

  container.addEventListener("keydown", function (event) {
    var stepSize = event.shiftKey ? 0.01 : 0.05;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      state.keyboardX = clamp01(state.keyboardX + (event.key === "ArrowRight" ? stepSize : -stepSize));
      state.cursorX = state.keyboardX;
      event.preventDefault();
      requestRender();
    } else if (event.key === "Enter" || event.key === " ") {
      query(state.keyboardX);
      event.preventDefault();
    }
  });

  if (typeof ResizeObserver === "function") {
    new ResizeObserver(requestRender).observe(container);
  } else {
    window.addEventListener("resize", requestRender);
  }

  // ---------------------------------------------------------------------------
  // Start: one observation, placed at random away from the boundaries. Reloading
  // the page is the reset.
  // ---------------------------------------------------------------------------
  container.removeAttribute("aria-hidden");
  container.setAttribute("tabindex", "0");
  container.setAttribute("role", "application");
  container.setAttribute(
    "aria-label",
    "Interactive Gaussian process demo: click, or use the arrow keys and Enter, to sample an unknown objective and update the posterior."
  );
  svg.removeAttribute("role");
  svg.setAttribute("aria-hidden", "true");

  observe(0.12 + 0.76 * Math.random(), false);
})();
