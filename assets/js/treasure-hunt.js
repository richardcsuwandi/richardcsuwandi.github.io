(function () {
  "use strict";
  const root = document.getElementById("treasure-hunt");
  const engine = window.TreasureHuntEngine;
  if (!root || !engine) return;

  const $ = function (id) {
    return document.getElementById("th-" + id);
  };
  const NS = "http://www.w3.org/2000/svg";
  const STORAGE_KEY = "field-station:treasure-hunt:v1";
  const terrainCache = new Map();
  let storageAvailable = true;
  let store = readStore();
  let round;
  let terrain;
  let observations = [];
  let selection = null;
  let replayStep = engine.BUDGET;
  let result = null;
  const api = root.dataset.apiUrl && window.TreasureHuntAPI ? new window.TreasureHuntAPI(root.dataset.apiUrl) : null;
  let liveState = null;
  let busy = false;
  let registered = false;
  let pendingProbe = null;
  let refreshPending = false;

  function isLocked() {
    return busy || Boolean(liveState && liveState.closed) || Boolean(api && round.mode === "daily" && !liveState);
  }
  function setBusy(value) {
    busy = value;
    $("x").disabled = value;
    $("y").disabled = value;
    ["daily", "practice", "new-practice", "new-day-button"].forEach(function (id) {
      $(id).disabled = value;
    });
    $("submit").disabled = value || !selection || observations.length === engine.BUDGET || isLocked();
  }
  function activateShared(next) {
    liveState = next;
    round = next.round;
    terrain = next.terrainSeed ? getTerrain(next.terrainSeed) : null;
    observations = next.observations;
    result = next.result;
    selection = null;
    replayStep = engine.BUDGET;
    $("x").value = "";
    $("y").value = "";
    $("replay-step").value = engine.BUDGET;
    $("terrain").replaceChildren();
    render();
  }
  function fillIdentity(visitor) {
    $("name").value = visitor.name === "Anonymous visitor" ? "" : visitor.name;
    $("kind").value = visitor.kind;
    $("agent").value = visitor.agent || "";
    $("model").value = visitor.model || "";
  }
  async function identify(details) {
    if (!api) throw new Error("Shared play is not configured.");
    const visitor = await api.checkIn(details);
    registered = true;
    fillIdentity(visitor);
    await refreshCommunity();
    return visitor;
  }
  async function openSharedDaily() {
    if (busy) return;
    setBusy(true);
    status("Connecting to today’s shared challenge…");
    try {
      if (!registered) {
        fillIdentity(await api.checkIn());
        registered = true;
      }
      activateShared(await api.start());
      status(
        liveState.complete
          ? "Score saved to today’s leaderboard. Terrain opens after midnight UTC."
          : "Connected. Your daily probes and score are saved by the server."
      );
      pendingProbe = null;
      await refreshCommunity();
    } catch (error) {
      status(error.message, true);
    } finally {
      setBusy(false);
    }
  }
  async function probeShared(x, y) {
    if (busy) throw new Error("A request is already in progress.");
    if (!liveState) throw new Error("Connect to the daily challenge first.");
    if (pendingProbe && (pendingProbe.x !== x || pendingProbe.y !== y)) {
      throw new Error("Retry the pending coordinates first, or reopen Daily challenge to refresh your state.");
    }
    pendingProbe = pendingProbe || { x: x, y: y, id: crypto.randomUUID() };
    setBusy(true);
    status("Recording probe…");
    try {
      const next = await api.probe(round.id, x, y, pendingProbe.id);
      pendingProbe = null;
      activateShared(next);
      status(
        next.complete ? "Five probes complete. Your score is on the shared leaderboard." : "Probe recorded. " + next.remaining + " probes remain."
      );
      if (next.complete) await refreshCommunity();
      return state();
    } catch (error) {
      if (error.status) {
        pendingProbe = null;
        try {
          activateShared(await api.get(round.id));
        } catch (_) {
          /* Preserve last known state. */
        }
      }
      status(error.message, true);
      throw error;
    } finally {
      setBusy(false);
    }
  }
  function tableRows(target, rows, empty) {
    target.replaceChildren();
    if (!rows.length) {
      const row = element("tr");
      const cell = element("td", "th-muted", empty);
      cell.colSpan = 4;
      row.appendChild(cell);
      target.appendChild(row);
    }
    rows.forEach(function (values) {
      const row = element("tr");
      values.forEach(function (value) {
        row.appendChild(element("td", "", value));
      });
      target.appendChild(row);
    });
  }
  async function refreshCommunity() {
    if (!api || refreshPending) return;
    refreshPending = true;
    try {
      const [board, activity] = await Promise.all([api.leaderboard(), api.activity()]);
      tableRows(
        $("leaderboard"),
        board.entries.map(function (entry) {
          return [
            entry.name,
            [entry.agent, entry.model].filter(Boolean).join(" / ") || (entry.kind === "human" ? "Human" : "Unspecified"),
            formatSignal(entry.score),
            relativeTime(entry.completedAt),
          ];
        }),
        "No completed searches today. The first score is yours to set."
      );
      tableRows(
        $("activity"),
        activity.recent.map(function (entry) {
          return [
            entry.name,
            [entry.agent, entry.model].filter(Boolean).join(" / ") || "Unspecified agent",
            entry.checkins,
            relativeTime(entry.lastSeen),
          ];
        }),
        "No agents have checked in yet."
      );
      $("activity-counts").textContent =
        activity.agentIdentities +
        " agent identities · " +
        activity.agentCheckinsToday +
        " agent check-ins today · " +
        activity.checkins +
        " total check-ins · " +
        activity.completedGames +
        " completed games";
      $("agent-types").textContent = activity.types
        .map(function (entry) {
          return entry.agent + ": " + entry.checkins + (entry.checkins === 1 ? " check-in" : " check-ins");
        })
        .join(" · ");
      $("live-status").textContent = board.day + " UTC · updated just now";
    } catch (_) {
      $("live-status").textContent = "Updates unavailable. Retrying shortly.";
    } finally {
      refreshPending = false;
    }
  }

  function utcDay() {
    return new Date().toISOString().slice(0, 10);
  }
  function svg(name, attributes, text) {
    const element = document.createElementNS(NS, name);
    Object.keys(attributes || {}).forEach(function (key) {
      element.setAttribute(key, attributes[key]);
    });
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function element(name, className, text) {
    const node = document.createElement(name);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function mapPoint(point) {
    return { x: 40 + point.x * 5.6, y: 600 - point.y * 5.6 };
  }
  function setVisible(node, visible) {
    if (visible) node.removeAttribute("hidden");
    else node.setAttribute("hidden", "");
  }
  function formatSignal(signal) {
    return signal.toFixed(1);
  }
  function getTerrain(seed) {
    if (!terrainCache.has(seed)) {
      if (terrainCache.size >= 10) terrainCache.delete(terrainCache.keys().next().value);
      terrainCache.set(seed, engine.createTerrain(seed));
    }
    return terrainCache.get(seed);
  }

  function validRound(candidate) {
    if (!candidate || typeof candidate !== "object" || typeof candidate.id !== "string" || candidate.id.length > 100) return false;
    if (!["daily", "practice"].includes(candidate.mode) || candidate.seed !== candidate.id) return false;
    if (typeof candidate.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(candidate.date)) return false;
    if (candidate.mode === "daily" && candidate.id !== "daily:" + candidate.date) return false;
    if (candidate.mode === "practice" && !/^practice:[a-z0-9-]+$/.test(candidate.id)) return false;
    if (!validTimestamp(candidate.startedAt) || !validTimestamp(candidate.updatedAt)) return false;
    if (!Array.isArray(candidate.points) || candidate.points.length > engine.BUDGET) return false;
    const seen = new Set();
    return candidate.points.every(function (point) {
      if (!point || !engine.validPoint(point.x, point.y) || !validTimestamp(point.at)) return false;
      const key = point.x + "," + point.y;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function validTimestamp(value) {
    return Number.isFinite(value) && value >= 0 && value <= 8640000000000000;
  }

  function readStore() {
    const empty = { version: engine.VERSION, activeId: null, rounds: [] };
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return empty;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== engine.VERSION || !Array.isArray(parsed.rounds)) return empty;
      const ids = new Set();
      empty.rounds = parsed.rounds.slice(-40).filter(function (item) {
        if (!validRound(item) || ids.has(item.id)) return false;
        ids.add(item.id);
        return true;
      });
      empty.activeId = typeof parsed.activeId === "string" ? parsed.activeId : null;
      return empty;
    } catch (error) {
      // Corrupt JSON can be replaced on the next save. Storage denial is different.
      if (!(error instanceof SyntaxError)) storageAvailable = false;
      return empty;
    }
  }

  function save() {
    if (storageAvailable) {
      const latest = readStore();
      // Merge other tabs' expeditions without replacing the active in-memory round.
      latest.rounds.forEach(function (item) {
        const existing = store.rounds.findIndex(function (candidate) {
          return candidate.id === item.id;
        });
        if (item.id !== round.id && (existing < 0 || store.rounds[existing].updatedAt < item.updatedAt)) {
          if (existing < 0) store.rounds.push(item);
          else store.rounds[existing] = item;
        }
      });
    }
    store.rounds = store.rounds
      .filter(function (item) {
        return item.id !== round.id;
      })
      .concat([round])
      .slice(-40);
    store.activeId = round.id;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (_) {
      storageAvailable = false;
    }
    $("storage-warning").hidden = storageAvailable;
  }

  function makeRound(mode) {
    const date = utcDay();
    let id = "daily:" + date;
    if (mode === "practice") {
      const token = new Uint32Array(1);
      window.crypto.getRandomValues(token);
      id = "practice:" + Date.now().toString(36) + "-" + token[0].toString(36);
    }
    return { id: id, seed: id, mode: mode, date: date, startedAt: Date.now(), updatedAt: Date.now(), points: [] };
  }

  function activate(next) {
    liveState = null;
    pendingProbe = null;
    round = next;
    terrain = getTerrain(round.seed);
    observations = round.points.map(function (point) {
      return { x: point.x, y: point.y, signal: terrain.signal(point.x, point.y), at: point.at };
    });
    selection = null;
    result = null;
    replayStep = engine.BUDGET;
    $("x").value = "";
    $("y").value = "";
    $("replay-step").value = engine.BUDGET;
    $("terrain").replaceChildren();
    save();
    render();
    status(
      observations.length === engine.BUDGET
        ? "All five probes are in. Trace your search on the revealed map."
        : observations.length
          ? "Expedition resumed. Your previous observations are saved below."
          : "Choose a point on the map, or enter coordinates."
    );
  }

  function openDaily() {
    if (api) return openSharedDaily();
    if (storageAvailable) store = readStore();
    activate(
      store.rounds.find(function (item) {
        return item.id === "daily:" + utcDay();
      }) || makeRound("daily")
    );
  }

  function bestObservation() {
    return observations.reduce(function (best, point) {
      return !best || point.signal > best.signal ? point : best;
    }, null);
  }

  function status(message, isError) {
    $("status").textContent = message;
    $("status").classList.toggle("is-error", Boolean(isError));
  }

  function state() {
    if (liveState) return JSON.parse(JSON.stringify(liveState));
    if (api && round.mode === "daily") return { edition: "shared-daily", connected: false, observations: [], remaining: null };
    const best = bestObservation();
    return {
      version: engine.VERSION,
      edition: "local-unranked",
      round: { id: round.id, mode: round.mode, date: round.date },
      domain: { x: [0, 100], y: [0, 100], integersOnly: true },
      budget: engine.BUDGET,
      remaining: engine.BUDGET - observations.length,
      observations: observations.map(function (point) {
        return Object.assign({}, point);
      }),
      best: best ? Object.assign({}, best) : null,
      complete: observations.length === engine.BUDGET,
      result: result ? JSON.parse(JSON.stringify(result)) : null,
    };
  }

  function probe(x, y) {
    if (api && round.mode === "daily") return probeShared(x, y);
    // A completed daily expedition in another tab must not regain its budget here.
    if (storageAvailable) {
      const latest = readStore().rounds.find(function (item) {
        return item.id === round.id;
      });
      if (latest && latest.points.length > round.points.length) activate(latest);
    }
    let point;
    try {
      point = engine.observe(terrain, observations, x, y);
    } catch (error) {
      status(error.message, true);
      throw error;
    }
    point.at = Date.now();
    observations.push(point);
    round.points.push({ x: x, y: y, at: point.at });
    round.updatedAt = point.at;
    selection = null;
    $("x").value = "";
    $("y").value = "";
    save();
    render();
    const remaining = engine.BUDGET - observations.length;
    status(
      "Probe " +
        observations.length +
        ": signal " +
        formatSignal(point.signal) +
        " at (" +
        x +
        ", " +
        y +
        "). " +
        (remaining ? remaining + (remaining === 1 ? " probe remains." : " probes remain.") : "Expedition complete. The full terrain is now revealed.")
    );
    return state();
  }

  function updateSelection() {
    const x = $("x").value === "" ? NaN : Number($("x").value);
    const y = $("y").value === "" ? NaN : Number($("y").value);
    selection = engine.validPoint(x, y) ? { x: x, y: y } : null;
    $("submit").disabled = !selection || observations.length === engine.BUDGET || isLocked();
    drawCrosshair();
  }

  function select(x, y) {
    if (observations.length === engine.BUDGET || isLocked()) return;
    $("x").value = x;
    $("y").value = y;
    updateSelection();
    status("Selected (" + x + ", " + y + "). Send a probe to measure the signal.");
  }

  function drawCrosshair() {
    setVisible($("crosshair"), Boolean(selection) && observations.length < engine.BUDGET);
    if (selection) {
      const position = mapPoint(selection);
      $("crosshair").setAttribute("transform", "translate(" + position.x + " " + position.y + ")");
    }
    setVisible($("empty-map"), observations.length === 0 && !selection);
  }

  function drawProbes() {
    const completed = observations.length === engine.BUDGET || Boolean(liveState && liveState.closed);
    const visible = completed ? observations.slice(0, replayStep) : observations;
    $("probes").replaceChildren();
    $("route").replaceChildren();
    if (completed && visible.length > 1) {
      const path = visible
        .map(function (point, index) {
          const p = mapPoint(point);
          return (index ? "L" : "M") + p.x.toFixed(1) + " " + p.y.toFixed(1);
        })
        .join(" ");
      $("route").appendChild(svg("path", { d: path }));
    }
    visible.forEach(function (point, index) {
      const p = mapPoint(point);
      const group = svg("g", { transform: "translate(" + p.x + " " + p.y + ")" });
      group.appendChild(svg("title", {}, "Probe " + (index + 1) + ", (" + point.x + ", " + point.y + "), signal " + formatSignal(point.signal)));
      group.appendChild(svg("circle", { r: 16, class: "th-pin-halo" }));
      group.appendChild(svg("circle", { r: 8, class: "th-pin" }));
      group.appendChild(svg("text", { y: 0.5, class: "th-pin-number" }, index + 1));
      const alignRight = point.x > 83;
      group.appendChild(
        svg(
          "text",
          { x: alignRight ? -15 : 15, y: point.y < 5 ? -12 : 19, "text-anchor": alignRight ? "end" : "start", class: "th-pin-signal" },
          formatSignal(point.signal)
        )
      );
      $("probes").appendChild(group);
    });
    $("replay-step").max = observations.length || engine.BUDGET;
    $("replay-label").textContent = Math.min(replayStep, observations.length) + " / " + observations.length + " probes";
    drawCrosshair();
  }

  function revealTerrain() {
    if ($("terrain").childNodes.length) return;
    // The raster and contours are created only after the last probe.
    const canvas = document.createElement("canvas");
    canvas.width = 101;
    canvas.height = 101;
    const context = canvas.getContext("2d");
    if (context) {
      const pixels = context.createImageData(101, 101);
      for (let y = 0; y <= 100; y++) {
        for (let x = 0; x <= 100; x++) {
          const signal = terrain.signal(x, 100 - y) / 100;
          const offset = (y * 101 + x) * 4;
          pixels.data[offset] = Math.round(205 - 150 * signal);
          pixels.data[offset + 1] = Math.round(221 - 102 * signal);
          pixels.data[offset + 2] = Math.round(204 - 72 * signal);
          pixels.data[offset + 3] = 255;
        }
      }
      context.putImageData(pixels, 0, 0);
      $("terrain").appendChild(
        svg("image", { x: 40, y: 40, width: 560, height: 560, href: canvas.toDataURL(), class: "th-terrain-image", preserveAspectRatio: "none" })
      );
    }
    // Marching triangles avoids ambiguous saddle cells in marching squares.
    for (let level = 10; level < 100; level += 10) {
      const segments = [];
      for (let y = 0; y < 100; y += 2) {
        for (let x = 0; x < 100; x += 2) {
          const corners = [
            [x, y],
            [x + 2, y],
            [x + 2, y + 2],
            [x, y + 2],
          ].map(function (p) {
            return { x: p[0], y: p[1], value: terrain.signal(p[0], p[1]) };
          });
          [
            [corners[0], corners[1], corners[2]],
            [corners[0], corners[2], corners[3]],
          ].forEach(function (triangle) {
            const intersections = [];
            for (let edge = 0; edge < 3; edge++) {
              const a = triangle[edge];
              const b = triangle[(edge + 1) % 3];
              if (a.value < level === b.value < level) continue;
              const t = (level - a.value) / (b.value - a.value);
              intersections.push(mapPoint({ x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) }));
            }
            if (intersections.length === 2)
              segments.push(
                "M" +
                  intersections[0].x.toFixed(1) +
                  " " +
                  intersections[0].y.toFixed(1) +
                  "L" +
                  intersections[1].x.toFixed(1) +
                  " " +
                  intersections[1].y.toFixed(1)
              );
          });
        }
      }
      $("terrain").appendChild(svg("path", { d: segments.join(""), class: "th-contour" + (level % 20 === 0 ? " th-contour-major" : "") }));
    }
    const peak = mapPoint(terrain.peak);
    $("peak").replaceChildren();
    const group = svg("g", { transform: "translate(" + peak.x + " " + peak.y + ")" });
    group.appendChild(svg("path", { d: "M0-12 3-3 12 0 3 3 0 12-3 3-12 0-3-3Z", class: "th-peak-star" }));
    group.appendChild(
      svg(
        "text",
        { x: terrain.peak.x > 75 ? -16 : 16, y: -12, "text-anchor": terrain.peak.x > 75 ? "end" : "start", class: "th-peak-label" },
        "Maximum: 100"
      )
    );
    $("peak").appendChild(group);
  }

  function render() {
    const completed = observations.length === engine.BUDGET || Boolean(liveState && liveState.closed);
    const revealed = completed && Boolean(terrain);
    const best = bestObservation();
    $("daily").setAttribute("aria-pressed", round.mode === "daily");
    $("practice").setAttribute("aria-pressed", round.mode === "practice");
    $("map-id").textContent = round.mode === "daily" ? round.date + " / UTC" : "PRACTICE / " + round.id.split("-").pop().toUpperCase();
    $("remaining").textContent = engine.BUDGET - observations.length;
    $("probe-dots")
      .querySelectorAll("i")
      .forEach(function (dot, index) {
        dot.classList.toggle("is-used", index < observations.length);
      });
    $("best").textContent = best ? formatSignal(best.signal) : "—";
    $("best-location").textContent = best ? "at (" + best.x + ", " + best.y + ")" : "No observations yet";
    $("probe-form").hidden = completed;
    $("submit").disabled = !selection || completed || isLocked();
    $("map").classList.toggle("is-complete", completed);
    $("map").setAttribute(
      "aria-label",
      revealed
        ? "Revealed terrain and your probe locations. Use the replay slider below to retrace your search."
        : "Survey map. Use arrow keys to choose coordinates and Enter to probe."
    );
    $("map-label").textContent = revealed ? "Revealed landscape" : completed ? "Your completed search" : "Search space";
    $("map-help").textContent = revealed
      ? "✦ marks the highest point."
      : completed
        ? "Terrain opens after midnight UTC."
        : "Click to select. Probe to discover.";
    $("legend-text").textContent = completed ? "Your probes" : "Observed signal";
    setVisible($("terrain"), revealed);
    setVisible($("peak"), revealed);
    $("replay").hidden = !completed;
    $("result").hidden = !completed;
    $("new-practice").hidden = !completed;
    $("export").hidden = observations.length === 0;
    $("log-count").textContent = "0" + observations.length + " / 05";
    $("log").replaceChildren();
    if (!observations.length) $("log").appendChild(element("li", "th-log-empty", "No observations yet."));
    observations.forEach(function (point, index) {
      const row = element("li");
      row.appendChild(element("span", "th-log-index", "0" + (index + 1)));
      row.appendChild(element("span", "th-log-coordinates", "(" + point.x + ", " + point.y + ")"));
      const score = element("span", "th-log-score" + (point === best ? " th-log-best" : ""), formatSignal(point.signal));
      if (point === best) score.title = "Strongest signal so far";
      row.appendChild(score);
      $("log").appendChild(row);
    });
    if (completed) {
      if (!result)
        result = { score: best.signal, peak: Object.assign({}, terrain.peak), randomBaseline: engine.randomBaseline(terrain, best.signal) };
      if (revealed) revealTerrain();
      $("result-title").textContent =
        result.score >= 99.5 ? "Near the maximum" : result.score >= 75 ? "Strong result" : result.score >= 40 ? "Search complete" : "Search complete";
      if (result.score === 100) $("result-title").textContent = "Maximum found";
      $("result-copy").textContent =
        "Your best signal was " +
        formatSignal(result.score) +
        (revealed
          ? ". The highest point is at (" + terrain.peak.x + ", " + terrain.peak.y + "), with a signal of 100."
          : ". Saved to today’s leaderboard. The full terrain opens after midnight UTC.");
      $("baseline").textContent = result.randomBaseline
        ? "Better than " +
          result.randomBaseline.percentile +
          "% of 512 simulated five-probe random searches on this map. A little context, not a model benchmark."
        : "";
    }
    drawProbes();
    renderHistory();
    checkNewDay();
  }

  function relativeTime(timestamp) {
    const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
    if (minutes < 1) return "just now";
    if (minutes < 60) return minutes + (minutes === 1 ? " minute ago" : " minutes ago");
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + (hours === 1 ? " hour ago" : " hours ago");
    const days = Math.floor(hours / 24);
    return days + (days === 1 ? " day ago" : " days ago");
  }

  function renderHistory() {
    const completed = store.rounds
      .filter(function (item) {
        return item.points.length === engine.BUDGET;
      })
      .sort(function (a, b) {
        return b.updatedAt - a.updatedAt;
      });
    $("journal-total").textContent = completed.length
      ? completed.length + (completed.length === 1 ? " saved game" : " saved games") + " · local only"
      : "Saved in this browser";
    $("history").replaceChildren();
    if (!completed.length) $("history").appendChild(element("p", "th-history-empty", "Your completed games will appear here."));
    completed.slice(0, 6).forEach(function (item) {
      const itemTerrain = getTerrain(item.seed);
      const score = Math.max.apply(
        null,
        item.points.map(function (point) {
          return itemTerrain.signal(point.x, point.y);
        })
      );
      const row = element("div", "th-history-row");
      const name = element("div", "th-history-name", item.mode === "daily" ? "Daily challenge" : "Practice game");
      name.appendChild(element("small", "", item.mode === "daily" ? item.date : item.id.split("-").pop().toUpperCase()));
      const scoreElement = element("div", "th-history-score", formatSignal(score) + " ");
      scoreElement.appendChild(element("small", "", "/ 100"));
      const time = element("time", "th-history-time", relativeTime(item.updatedAt));
      time.dateTime = new Date(item.updatedAt).toISOString();
      time.title = new Date(item.updatedAt).toLocaleString();
      row.append(name, scoreElement, time);
      $("history").appendChild(row);
    });
  }

  function checkNewDay() {
    $("new-day").hidden = round.mode !== "daily" || round.date === utcDay();
  }
  async function refreshExpiredTerrain() {
    if (busy || !liveState || liveState.closed || Date.now() < Date.parse(liveState.revealAt)) return;
    const id = round.id;
    try {
      const next = await api.get(id);
      if (!busy && liveState && round.id === id) {
        activateShared(next);
        status("This daily challenge has closed. Its full terrain is now available.");
      }
    } catch (_) {
      /* Retry on the next refresh. */
    }
  }

  $("probe-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!selection) return;
    try {
      await probe(selection.x, selection.y);
    } catch (error) {
      status(error.message, true);
    }
  });
  ["x", "y"].forEach(function (id) {
    $(id).addEventListener("input", updateSelection);
  });
  $("map").addEventListener("click", function (event) {
    const matrix = $("map").getScreenCTM();
    if (!matrix) return;
    const point = $("map").createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const local = point.matrixTransform(matrix.inverse());
    if (local.x < 40 || local.x > 600 || local.y < 40 || local.y > 600) return;
    select(Math.round((local.x - 40) / 5.6), Math.round((600 - local.y) / 5.6));
  });
  $("map").addEventListener("keydown", async function (event) {
    if (observations.length === engine.BUDGET || isLocked()) return;
    const keys = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] };
    if (keys[event.key]) {
      event.preventDefault();
      const current = selection || observations[observations.length - 1] || { x: 50, y: 50 };
      const step = event.shiftKey ? 10 : 1;
      select(Math.min(100, Math.max(0, current.x + keys[event.key][0] * step)), Math.min(100, Math.max(0, current.y + keys[event.key][1] * step)));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (!selection) select(50, 50);
      else {
        try {
          await probe(selection.x, selection.y);
        } catch (error) {
          status(error.message, true);
        }
      }
    }
  });
  $("daily").addEventListener("click", openDaily);
  $("new-day-button").addEventListener("click", openDaily);
  $("practice").addEventListener("click", function () {
    if (round.mode === "practice") return;
    const existing = store.rounds
      .slice()
      .reverse()
      .find(function (item) {
        return item.mode === "practice" && item.points.length < engine.BUDGET;
      });
    activate(existing || makeRound("practice"));
  });
  $("new-practice").addEventListener("click", function () {
    activate(makeRound("practice"));
  });
  $("replay-step").addEventListener("input", function () {
    replayStep = Number($("replay-step").value);
    drawProbes();
  });
  $("export").addEventListener("click", function () {
    const blob = new Blob([JSON.stringify(state(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "treasure-hunt-" + round.id.replace(":", "-") + ".json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  });
  window.addEventListener("storage", function (event) {
    if (event.key !== STORAGE_KEY || liveState) return;
    store = readStore();
    const updated = store.rounds.find(function (item) {
      return item.id === round.id;
    });
    if (updated && updated.points.length > round.points.length) activate(updated);
    else renderHistory();
  });
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      checkNewDay();
      renderHistory();
    }
  });
  window.setInterval(function () {
    checkNewDay();
    renderHistory();
  }, 60000);

  const currentDay = utcDay();
  const savedActive = store.rounds.find(function (item) {
    return item.id === store.activeId;
  });
  const initial =
    savedActive && (savedActive.mode === "practice" || savedActive.date === currentDay)
      ? savedActive
      : store.rounds.find(function (item) {
          return item.id === "daily:" + currentDay;
        }) || makeRound("daily");
  activate(initial);
  let ready = Promise.resolve();
  if (api) {
    $("community").hidden = false;
    ready = openSharedDaily();
    $("identity-form").addEventListener("submit", async function (event) {
      event.preventDefault();
      const button = event.currentTarget.querySelector("button");
      button.disabled = true;
      try {
        await ready;
        await identify({ name: $("name").value, kind: $("kind").value, agent: $("agent").value, model: $("model").value });
        $("identity-status").textContent = "Public identity saved.";
      } catch (error) {
        $("identity-status").textContent = error.message;
      } finally {
        button.disabled = false;
      }
    });
    window.setInterval(function () {
      if (!document.hidden) {
        refreshCommunity();
        refreshExpiredTerrain();
      }
    }, 30000);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) {
        refreshCommunity();
        refreshExpiredTerrain();
      }
    });
  }
  window.treasureHunt = Object.freeze({ getState: state, probe: probe, identify: identify, ready: ready });
})();
