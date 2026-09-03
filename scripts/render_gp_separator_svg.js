#!/usr/bin/env node
/**
 * Bake the interactive GP separator into static, GitHub-README-safe SVGs.
 *
 * GitHub markdown cannot run JS, so this replays the same GP / EI loop as
 * assets/js/gp-separator.js and writes SMIL-animated light and dark SVGs.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const LENGTHSCALE = 0.11;
const SIGNAL_VAR = 1.0;
const NOISE_VAR = 1e-4;
const XI = 0.01;
const GRID = 160;
const SEED_X = 0.18;
const N_OBS = 8;
const WIDTH = 1100;
const HEIGHT = 140;
const PAD_X = 10;
const PAD_Y = 12;
const HOLD = 0.78; // fraction of each step spent holding the posterior
const STEP_S = 1.85;
const DUR = (N_OBS * STEP_S).toFixed(2);

const THEMES = {
  light: {
    accent: "#0063c9",
    band: "rgba(0, 99, 201, 0.12)",
    text: "#0f172a",
    muted: "#6b7280",
    fill: "#ffffff",
  },
  dark: {
    accent: "#68b2ff",
    band: "rgba(104, 178, 255, 0.16)",
    text: "#f1f5f9",
    muted: "#94a3b8",
    fill: "#0d1117",
  },
};

function bump(t, center, width) {
  const d = (t - center) / width;
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

function kernel(a, b) {
  const d = (a - b) / LENGTHSCALE;
  return SIGNAL_VAR * Math.exp(-0.5 * d * d);
}

function cholesky(A) {
  const n = A.length;
  const L = Array.from({ length: n }, () => new Float64Array(n));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = A[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) L[i][i] = Math.sqrt(Math.max(s, 1e-10));
      else L[i][j] = s / L[j][j];
    }
  }
  return L;
}

function cholSolve(L, b) {
  const n = L.length;
  const y = new Float64Array(n);
  const x = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let s = b[i];
    for (let k = 0; k < i; k++) s -= L[i][k] * y[k];
    y[i] = s / L[i][i];
  }
  for (let i = n - 1; i >= 0; i--) {
    let s = y[i];
    for (let k = i + 1; k < n; k++) s -= L[k][i] * x[k];
    x[i] = s / L[i][i];
  }
  return x;
}

function normalCdf(z) {
  const sign = z < 0 ? -1 : 1;
  const a = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * a);
  const poly =
    t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const erf = 1 - poly * Math.exp(-a * a);
  return 0.5 * (1 + sign * erf);
}

function normalPdf(z) {
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
}

function fitGP(xs, ys) {
  const n = xs.length;
  const K = [];
  for (let i = 0; i < n; i++) {
    K.push(new Float64Array(n));
    for (let j = 0; j < n; j++) {
      K[i][j] = kernel(xs[i], xs[j]) + (i === j ? NOISE_VAR : 0);
    }
  }
  const L = cholesky(K);
  return { xs: xs.slice(), L, alpha: cholSolve(L, ys) };
}

function predict(gp, x) {
  const n = gp.xs.length;
  const ks = new Float64Array(n);
  let mean = 0;
  for (let i = 0; i < n; i++) {
    ks[i] = kernel(x, gp.xs[i]);
    mean += ks[i] * gp.alpha[i];
  }
  const v = cholSolve(gp.L, ks);
  let variance = SIGNAL_VAR;
  for (let i = 0; i < n; i++) variance -= ks[i] * v[i];
  return { mean, sd: Math.sqrt(Math.max(variance, 0)) };
}

function expectedImprovement(mean, sd, best) {
  if (sd < 1e-9) return 0;
  const z = (mean - best - XI) / sd;
  return (mean - best - XI) * normalCdf(z) + sd * normalPdf(z);
}

const grid = Array.from({ length: GRID }, (_, i) => i / (GRID - 1));
const truth = grid.map(objective);
const yLo = Math.min(...truth) - 0.45;
const yHi = Math.max(...truth) + 0.45;
const span = yHi - yLo;
const innerW = WIDTH - 2 * PAD_X;
const innerH = HEIGHT - 2 * PAD_Y;

function sx(x) {
  return PAD_X + x * innerW;
}
function sy(y) {
  return PAD_Y + (1 - (y - yLo) / span) * innerH;
}

function argmaxEI(gp, best) {
  let bestEi = -Infinity;
  let bestX = grid[0];
  for (const t of grid) {
    const p = predict(gp, t);
    const ei = expectedImprovement(p.mean, p.sd, best);
    if (ei > bestEi) {
      bestEi = ei;
      bestX = t;
    }
  }
  return bestX;
}

function posterior(gp) {
  return grid.map((t) => predict(gp, t));
}

function fmt(n) {
  return n.toFixed(2);
}

function bandPoints(post) {
  const upper = post.map((p, k) => `${fmt(sx(grid[k]))},${fmt(sy(p.mean + 2 * p.sd))}`);
  const lower = post
    .map((p, k) => `${fmt(sx(grid[k]))},${fmt(sy(p.mean - 2 * p.sd))}`)
    .reverse();
  return upper.concat(lower).join(" ");
}

function meanPoints(post) {
  return post.map((p, k) => `${fmt(sx(grid[k]))},${fmt(sy(p.mean))}`).join(" ");
}

function animate(attr, values, extra = "") {
  const keys = keyTimes(values.length);
  return `<animate attributeName="${attr}" values="${values.join(";")}" keyTimes="${keys}" dur="${DUR}s" repeatCount="indefinite" calcMode="linear"${extra}/>`;
}

function keyTimes(nValues) {
  // values layout: F0, F0, F1, F1, ..., F{N-1}, F{N-1}, F0
  // that's 2*N_OBS + 1 entries
  const times = [];
  const n = N_OBS;
  for (let i = 0; i < n; i++) {
    times.push(i / n);
    times.push((i + HOLD) / n);
  }
  times.push(1);
  if (times.length !== nValues) {
    throw new Error(`keyTimes ${times.length} != values ${nValues}`);
  }
  return times.map((t) => t.toFixed(4)).join(";");
}

function pairCycle(frames) {
  const vals = [];
  for (const f of frames) vals.push(f, f);
  vals.push(frames[0]);
  return vals;
}

// Replay EI: start at a fixed seed, then follow expected improvement.
const xs = [SEED_X];
const ys = [objective(SEED_X)];
const frames = [];

for (let n = 1; n <= N_OBS; n++) {
  const gp = fitGP(xs, ys);
  const best = Math.max(...ys);
  const nextX = argmaxEI(gp, best);
  const post = posterior(gp);
  const nextMean = predict(gp, nextX).mean;
  frames.push({
    n,
    xs: xs.slice(),
    ys: ys.slice(),
    best,
    nextX,
    nextMean,
    band: bandPoints(post),
    mean: meanPoints(post),
  });
  if (n < N_OBS) {
    xs.push(nextX);
    ys.push(objective(nextX));
  }
}

const truthPoints = grid.map((t, k) => `${fmt(sx(t))},${fmt(sy(truth[k]))}`).join(" ");

function opacityCycle(appearAt) {
  // 1 once observation index `appearAt` (0-based) is visible, else 0.
  const vals = [];
  for (let i = 0; i < N_OBS; i++) {
    const v = i >= appearAt ? "1" : "0";
    vals.push(v, v);
  }
  vals.push(appearAt === 0 ? "1" : "0");
  return vals;
}

function render(theme) {
  const c = THEMES[theme];
  const bandVals = pairCycle(frames.map((f) => f.band));
  const meanVals = pairCycle(frames.map((f) => f.mean));
  const incY = pairCycle(frames.map((f) => fmt(sy(f.best))));
  const nextX = pairCycle(frames.map((f) => fmt(sx(f.nextX))));
  const nextY = pairCycle(frames.map((f) => fmt(sy(f.nextMean))));

  const obs = frames[frames.length - 1].xs
    .map((x, k) => {
      const y = frames[frames.length - 1].ys[k];
      // Use the observation's own coordinates from when it first appears;
      // later frames keep the same (x, y) since observations are fixed.
      const op = opacityCycle(k);
      return `    <circle cx="${fmt(sx(x))}" cy="${fmt(sy(y))}" r="5" fill="${c.text}">
      ${animate("opacity", op, ' fill="freeze"')}
    </circle>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" role="img" aria-labelledby="title desc">
  <title id="title">Gaussian process Bayesian optimization</title>
  <desc id="desc">A looping animation of a Gaussian process posterior. Observations accumulate, the credible band pinches around sampled points, and a dashed marker shows the next expected-improvement query.</desc>
  <style>
    .truth { fill: none; stroke: ${c.muted}; stroke-width: 1.5; stroke-dasharray: 2 4; opacity: 0.35; }
    .band { fill: ${c.band}; stroke: none; }
    .mean { fill: none; stroke: ${c.accent}; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .incumbent { stroke: ${c.muted}; stroke-width: 1.6; stroke-dasharray: 6 6; opacity: 0.55; }
    .next-rule { stroke: ${c.muted}; stroke-width: 1; stroke-dasharray: 3 5; opacity: 0.5; }
    .next { fill: ${c.fill}; stroke: ${c.accent}; stroke-width: 2; }
  </style>

  <polyline class="truth" points="${truthPoints}"/>
  <polygon class="band" points="${frames[0].band}">
    ${animate("points", bandVals)}
  </polygon>
  <polyline class="mean" points="${frames[0].mean}">
    ${animate("points", meanVals)}
  </polyline>
  <line class="incumbent" x1="0" x2="${WIDTH}" y1="${fmt(sy(frames[0].best))}" y2="${fmt(sy(frames[0].best))}">
    ${animate("y1", incY)}
    ${animate("y2", incY)}
  </line>
  <line class="next-rule" x1="${fmt(sx(frames[0].nextX))}" x2="${fmt(sx(frames[0].nextX))}" y1="${PAD_Y}" y2="${HEIGHT - PAD_Y}">
    ${animate("x1", nextX)}
    ${animate("x2", nextX)}
  </line>
  <circle class="next" cx="${fmt(sx(frames[0].nextX))}" cy="${fmt(sy(frames[0].nextMean))}" r="5">
    ${animate("cx", nextX)}
    ${animate("cy", nextY)}
  </circle>
${obs}
</svg>
`;
}

const outDir =
  process.argv[2] ||
  path.join(__dirname, "..", "assets", "img");
fs.mkdirSync(outDir, { recursive: true });

const lightPath = path.join(outDir, "gp-separator.svg");
const darkPath = path.join(outDir, "gp-separator-dark.svg");
fs.writeFileSync(lightPath, render("light"));
fs.writeFileSync(darkPath, render("dark"));

console.log("wrote", lightPath);
console.log("wrote", darkPath);
console.log(
  "query path:",
  frames.map((f) => `n=${f.n} x=${f.xs[f.xs.length - 1].toFixed(3)} best=${f.best.toFixed(3)} next=${f.nextX.toFixed(3)}`).join(" | ")
);
