/**
 * Interactive evolutionary search separator
 *
 * A population of candidate solutions searches for a hidden objective via a
 * real generational loop: evaluate fitness, keep the fittest as elites,
 * repopulate the rest by mutating around them. Every generation is a single
 * eased transition between two discrete states (like the homepage GP
 * separator's posterior update), not continuously integrated physics, so the
 * motion is always purposeful and can't drift into a jittery look. Evolution
 * runs on its own, roughly every two and a half seconds; a click relocates
 * the objective and widens the mutation radius, so the population visibly
 * scrambles and re-converges, which is the "update beliefs as new evidence
 * arrives" part made literal.
 *
 * Layers, back to front:
 *   1. Hollow marker at the current objective
 *   2. Population, as small dots
 *   3. The fittest individual this generation, as a solid accent dot
 *   4. Labels: generation count, and a hint until the first click
 *
 * Markup: <div class="discovery-separator"><svg class="discovery-separator-svg"></svg></div>
 * Colours come from CSS (see _sass/_discovery-separator.scss); JS only sets geometry.
 */
(function () {
  var SVG_NS = "http://www.w3.org/2000/svg";

  var container = document.querySelector(".discovery-separator");
  if (!container) return;
  var svg = container.querySelector(".discovery-separator-svg");
  if (!svg) return;

  var POP_SIZE = 25;
  var ELITE_FRACTION = 0.25;
  var SIGMA = 0.1; // spread of the fitness bump around the objective
  var MARGIN = 0.08;
  var GEN_INTERVAL_MS = 2500;
  var ANIM_MS = 700;
  var MUTATION_START = 0.22;
  var MUTATION_FLOOR = 0.018;
  var MUTATION_DECAY = 0.82; // per generation, until it hits the floor
  var MAX_IMMIGRANTS = 3; // fresh random individuals, only while still searching

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }
  function randIn(lo, hi) {
    return lo + Math.random() * (hi - lo);
  }
  function gaussian() {
    // Box-Muller
    var u = Math.max(Math.random(), 1e-6);
    var v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function easeOutCubic(t) {
    var u = 1 - t;
    return 1 - u * u * u;
  }

  // The panel is much wider than it is tall, so a raw normalized distance in
  // x covers far more pixels than the same distance in y. Scaling x by the
  // container's aspect ratio makes "close" mean visually close, not just
  // close in the arbitrary [0, 1] x [0, 1] parametrization.
  var aspect = 1;
  function updateAspect() {
    var w = container.clientWidth - 2 * geom.padX;
    var h = container.clientHeight - 2 * geom.padY;
    if (w > 0 && h > 0) aspect = w / h;
  }

  function fitness(x, y, target) {
    var dx = (x - target.x) * aspect;
    var dy = y - target.y;
    return Math.exp(-(dx * dx + dy * dy) / (2 * SIGMA * SIGMA));
  }

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  var state = {
    target: { x: 0.25 + 0.5 * Math.random(), y: 0.3 + 0.4 * Math.random() },
    generation: 1,
    mutation: MUTATION_START,
    shown: [], // { x, y } currently displayed, eased between generations
    from: null,
    to: null,
    animStart: 0,
    bestIdx: 0,
    nextGenAt: 0,
    hinted: true,
  };

  function randomIndividual() {
    return {
      x: MARGIN + Math.random() * (1 - 2 * MARGIN),
      y: MARGIN + Math.random() * (1 - 2 * MARGIN),
    };
  }

  for (var i = 0; i < POP_SIZE; i++) state.shown.push(randomIndividual());
  updateBestIdx(state.shown);

  function updateBestIdx(pop) {
    var bestI = 0;
    var bestF = -Infinity;
    for (var k = 0; k < pop.length; k++) {
      var f = fitness(pop[k].x, pop[k].y, state.target);
      if (f > bestF) {
        bestF = f;
        bestI = k;
      }
    }
    state.bestIdx = bestI;
  }

  /** Evaluate the current population, breed the next one, and animate to it. */
  function evolve(now) {
    updateAspect();
    var current = state.shown;
    var scored = current.map(function (p, idx) {
      return { p: p, fit: fitness(p.x, p.y, state.target), idx: idx };
    });
    scored.sort(function (a, b) {
      return b.fit - a.fit;
    });

    var nEliteCount = Math.max(1, Math.round(POP_SIZE * ELITE_FRACTION));
    var elites = scored.slice(0, nEliteCount).map(function (s) {
      return s.p;
    });

    var next = elites.map(function (e) {
      return { x: e.x, y: e.y };
    });

    // A few fresh, uniformly random individuals ("random immigrants"), so a
    // relocated objective is always reachable even after the exploitation
    // radius below has decayed to almost nothing. Tied to the same decay
    // curve as the mutation radius, so once the population has actually
    // settled near the objective, no more stray dots keep appearing.
    var searchProgress = (state.mutation - MUTATION_FLOOR) / (MUTATION_START - MUTATION_FLOOR);
    var immigrantCount = Math.round(MAX_IMMIGRANTS * clamp(searchProgress, 0, 1));
    for (var r = 0; r < immigrantCount && next.length < POP_SIZE; r++) {
      next.push(randomIndividual());
    }

    while (next.length < POP_SIZE) {
      var parent = elites[Math.floor(Math.random() * elites.length)];
      next.push({
        x: clamp(parent.x + gaussian() * state.mutation, MARGIN, 1 - MARGIN),
        y: clamp(parent.y + gaussian() * state.mutation, MARGIN, 1 - MARGIN),
      });
    }

    state.mutation = Math.max(MUTATION_FLOOR, state.mutation * MUTATION_DECAY);
    state.generation += 1;
    state.from = current;
    state.to = next;
    state.animStart = now;
    state.nextGenAt = now + GEN_INTERVAL_MS;
  }

  /** Relocate the objective: widen the search again so the population visibly scrambles. */
  function retarget(x, y) {
    state.target = { x: x, y: y };
    state.mutation = MUTATION_START;
    state.hinted = false;
    state.nextGenAt = performance.now(); // evolve immediately toward the new objective
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

  var geom = { padX: 12, padY: 12 };

  function render() {
    var width = container.clientWidth;
    var height = container.clientHeight;
    if (!width || !height) return;

    var innerW = width - 2 * geom.padX;
    var innerH = height - 2 * geom.padY;

    function sx(x) {
      return geom.padX + x * innerW;
    }
    function sy(y) {
      return geom.padY + y * innerH;
    }

    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    // 1) Objective
    svg.appendChild(
      el("circle", {
        class: "discovery-target",
        cx: sx(state.target.x).toFixed(2),
        cy: sy(state.target.y).toFixed(2),
        r: 7,
      })
    );

    // 2) Population
    for (var k = 0; k < state.shown.length; k++) {
      if (k === state.bestIdx) continue;
      var p = state.shown[k];
      svg.appendChild(
        el("circle", {
          class: "discovery-dot",
          cx: sx(p.x).toFixed(2),
          cy: sy(p.y).toFixed(2),
          r: 3,
        })
      );
    }

    // 3) Fittest this generation
    var best = state.shown[state.bestIdx];
    if (best) {
      svg.appendChild(
        el("circle", {
          class: "discovery-current",
          cx: sx(best.x).toFixed(2),
          cy: sy(best.y).toFixed(2),
          r: 5,
        })
      );
    }

    // 4) Labels
    var count = el("text", { class: "discovery-label", x: geom.padX, y: height - 4 });
    count.textContent = "generation = " + state.generation;
    svg.appendChild(count);

    if (state.hinted) {
      var hint = el("text", {
        class: "discovery-label discovery-hint",
        x: width - geom.padX,
        y: height - 4,
        "text-anchor": "end",
      });
      hint.textContent = "click to move the objective";
      svg.appendChild(hint);
    }
  }

  // ---------------------------------------------------------------------------
  // Frame loop
  // ---------------------------------------------------------------------------
  function tick(now) {
    if (state.from) {
      var t = Math.min(1, (now - state.animStart) / ANIM_MS);
      var e = easeOutCubic(t);
      state.shown = state.to.map(function (p, k) {
        var q = state.from[k];
        return { x: q.x + (p.x - q.x) * e, y: q.y + (p.y - q.y) * e };
      });
      if (t >= 1) state.from = null;
      updateBestIdx(state.shown);
    } else if (now >= state.nextGenAt) {
      evolve(now);
    }
    render();
    requestAnimationFrame(tick);
  }

  // ---------------------------------------------------------------------------
  // Input
  // ---------------------------------------------------------------------------
  function coordsFromEvent(event) {
    var rect = container.getBoundingClientRect();
    var innerW = rect.width - 2 * geom.padX;
    var innerH = rect.height - 2 * geom.padY;
    if (innerW <= 0 || innerH <= 0) return { x: 0.5, y: 0.5 };
    return {
      x: clamp((event.clientX - rect.left - geom.padX) / innerW, 0, 1),
      y: clamp((event.clientY - rect.top - geom.padY) / innerH, 0, 1),
    };
  }

  container.addEventListener("pointerdown", function (event) {
    if (event.button !== undefined && event.button !== 0) return;
    var p = coordsFromEvent(event);
    retarget(p.x, p.y);
  });

  container.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      retarget(MARGIN + Math.random() * (1 - 2 * MARGIN), MARGIN + Math.random() * (1 - 2 * MARGIN));
      event.preventDefault();
    }
  });

  if (typeof ResizeObserver === "function") {
    new ResizeObserver(render).observe(container);
  } else {
    window.addEventListener("resize", render);
  }

  container.removeAttribute("aria-hidden");
  container.setAttribute("tabindex", "0");
  container.setAttribute("role", "application");
  container.setAttribute(
    "aria-label",
    "Interactive evolutionary search demo: a population evolves toward a hidden objective every few seconds. Click, or focus and press Enter, to move the objective."
  );
  svg.removeAttribute("role");
  svg.setAttribute("aria-hidden", "true");

  updateAspect();
  state.nextGenAt = performance.now() + GEN_INTERVAL_MS;
  requestAnimationFrame(tick);
})();
