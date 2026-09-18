/* Deterministic local game rules, shared by the browser and Node tests. */
(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.TreasureHuntEngine = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const VERSION = 1;
  const BUDGET = 5;
  const SIZE = 101;

  function random(seed) {
    let state = 2166136261;
    for (let i = 0; i < seed.length; i++) state = Math.imul(state ^ seed.charCodeAt(i), 16777619);
    return function () {
      state = (state + 0x6d2b79f5) | 0;
      let t = Math.imul(state ^ (state >>> 15), 1 | state);
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function validPoint(x, y) {
    return Number.isInteger(x) && Number.isInteger(y) && x >= 0 && x <= 100 && y >= 0 && y <= 100;
  }

  function createTerrain(seed) {
    const rng = random("field-station-v" + VERSION + ":" + seed);
    const hills = Array.from({ length: 5 }, function () {
      return { x: 8 + rng() * 84, y: 8 + rng() * 84, sx: 9 + rng() * 13, sy: 9 + rng() * 13, height: 0.45 + rng() * 0.8 };
    });
    const values = new Float64Array(SIZE * SIZE);
    let min = Infinity;
    let max = -Infinity;
    let peak = { x: 0, y: 0 };
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const value = hills.reduce(function (sum, hill) {
          return sum + hill.height * Math.exp(-0.5 * (((x - hill.x) / hill.sx) ** 2 + ((y - hill.y) / hill.sy) ** 2));
        }, 0);
        values[y * SIZE + x] = value;
        min = Math.min(min, value);
        if (value > max) {
          max = value;
          peak = { x: x, y: y };
        }
      }
    }
    for (let i = 0; i < values.length; i++) values[i] = ((values[i] - min) / (max - min)) * 100;
    return Object.freeze({
      seed: seed,
      peak: Object.freeze({ x: peak.x, y: peak.y, signal: 100 }),
      signal: function (x, y) {
        if (!validPoint(x, y)) throw new RangeError("Coordinates must be integers from 0 to 100.");
        return values[y * SIZE + x];
      },
    });
  }

  function observe(terrain, observations, x, y) {
    if (!validPoint(x, y)) throw new RangeError("Choose integer coordinates from 0 to 100.");
    if (observations.length >= BUDGET) throw new Error("This expedition is complete. All five probes have been used.");
    if (
      observations.some(function (point) {
        return point.x === x && point.y === y;
      })
    )
      throw new Error("You have already sampled that point. Choose somewhere new.");
    return { x: x, y: y, signal: terrain.signal(x, y) };
  }

  function randomBaseline(terrain, score) {
    const rng = random("baseline:" + terrain.seed);
    const runs = 512;
    let beaten = 0;
    for (let run = 0; run < runs; run++) {
      const seen = new Set();
      let best = 0;
      while (seen.size < BUDGET) {
        const x = Math.floor(rng() * SIZE);
        const y = Math.floor(rng() * SIZE);
        const key = x + "," + y;
        if (seen.has(key)) continue;
        seen.add(key);
        best = Math.max(best, terrain.signal(x, y));
      }
      if (score > best) beaten++;
    }
    return { runs: runs, beaten: beaten, percentile: Math.round((100 * beaten) / runs) };
  }

  return Object.freeze({
    VERSION: VERSION,
    BUDGET: BUDGET,
    validPoint: validPoint,
    createTerrain: createTerrain,
    observe: observe,
    randomBaseline: randomBaseline,
  });
});
