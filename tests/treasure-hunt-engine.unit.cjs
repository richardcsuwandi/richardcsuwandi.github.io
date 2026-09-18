const { test } = require("node:test");
const assert = require("node:assert/strict");
const engine = require("../assets/js/treasure-hunt-engine.js");

test("daily maps are reproducible, bounded, and have an exact attainable maximum", () => {
  const terrain = engine.createTerrain("daily:2026-09-19");
  const repeated = engine.createTerrain("daily:2026-09-19");
  const nextDay = engine.createTerrain("daily:2026-09-20");
  let min = Infinity;
  let max = -Infinity;
  for (let y = 0; y <= 100; y++) {
    for (let x = 0; x <= 100; x++) {
      const signal = terrain.signal(x, y);
      assert.equal(signal, repeated.signal(x, y));
      min = Math.min(min, signal);
      max = Math.max(max, signal);
    }
  }
  assert.equal(min, 0);
  assert.equal(max, 100);
  assert.equal(terrain.signal(terrain.peak.x, terrain.peak.y), 100);
  assert.notEqual(terrain.signal(50, 50), nextDay.signal(50, 50));
});

test("invalid, repeated, and excess probes do not alter the observation history", () => {
  const terrain = engine.createTerrain("test");
  const observations = [];
  for (const [x, y] of [
    [-1, 0],
    [101, 50],
    [2.5, 4],
    [NaN, 0],
    [0, Infinity],
    ["2", 4],
    [null, 0],
  ]) {
    assert.throws(() => engine.observe(terrain, observations, x, y), RangeError);
    assert.equal(observations.length, 0);
  }
  observations.push(engine.observe(terrain, observations, 0, 100));
  assert.throws(() => engine.observe(terrain, observations, 0, 100), /already sampled/);
  assert.equal(observations.length, 1);
  for (let x = 1; x < 5; x++) observations.push(engine.observe(terrain, observations, x, 100));
  assert.throws(() => engine.observe(terrain, observations, 50, 50), /complete/);
  assert.equal(observations.length, 5);
});

test("random comparison is repeatable and monotonic in the player score", () => {
  const terrain = engine.createTerrain("daily:2026-09-19");
  assert.deepEqual(engine.randomBaseline(terrain, 50), engine.randomBaseline(terrain, 50));
  assert.equal(engine.randomBaseline(terrain, 0).beaten, 0);
  const low = engine.randomBaseline(terrain, 30);
  const high = engine.randomBaseline(terrain, 80);
  assert.ok(high.beaten >= low.beaten);
  assert.equal(high.runs, 512);
  assert.ok(high.percentile >= 0 && high.percentile <= 100);
});
