/**
 * Interactive figures for “Bayesian Exploration for LLM Agents”.
 *
 * The simulations are intentionally small and transparent. The temperature
 * figure applies softmax temperature to a synthetic, head-heavy decoder over
 * plausible next actions. The horizon figure compares independent hypothesis
 * samples at every step with one posterior sample per episode.
 */
(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";
  var N_DRAWS = 24;

  function svgEl(name, attrs, text) {
    var node = document.createElementNS(SVG_NS, name);
    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function clamp(value, lo, hi) {
    return Math.max(lo, Math.min(hi, value));
  }

  function formatPercent(value, digits) {
    return (100 * value).toFixed(digits === undefined ? 0 : digits) + "%";
  }

  // Deterministic PRNG: changing a control preserves the episode/sample seed,
  // while “new draws” advances it. This makes comparisons visually stable.
  function mulberry32(seed) {
    return function () {
      var t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function softmax(logits, temperature) {
    var scaled = logits.map(function (z) {
      return z / temperature;
    });
    var max = Math.max.apply(null, scaled);
    var exps = scaled.map(function (z) {
      return Math.exp(z - max);
    });
    var total = exps.reduce(function (a, b) {
      return a + b;
    }, 0);
    return exps.map(function (x) {
      return x / total;
    });
  }

  function entropyBits(probabilities) {
    return probabilities.reduce(function (sum, p) {
      return p > 0 ? sum - p * (Math.log(p) / Math.LN2) : sum;
    }, 0);
  }

  function sampleCategorical(probabilities, rng) {
    var target = rng();
    var cumulative = 0;
    for (var i = 0; i < probabilities.length; i++) {
      cumulative += probabilities[i];
      if (target <= cumulative) return i;
    }
    return probabilities.length - 1;
  }

  function uniqueCount(values) {
    return new Set(values).size;
  }

  function setLiveText(node, value) {
    if (node) node.textContent = value;
  }

  var decoder = [
    { label: "Read the API docs", action: "documentation", hypothesis: "api", logit: 4.2 },
    { label: "Check the reference", action: "documentation", hypothesis: "api", logit: 3.9 },
    { label: "Consult the manual", action: "documentation", hypothesis: "api", logit: 3.6 },
    { label: "Inspect the call site", action: "call-site", hypothesis: "api", logit: 3.1 },
    { label: "Compare function signatures", action: "call-site", hypothesis: "api", logit: 2.9 },
    { label: "Re-run with debug logs", action: "logging", hypothesis: "runtime", logit: 2.55 },
    { label: "Inspect the stack trace", action: "logging", hypothesis: "runtime", logit: 2.35 },
    { label: "Build a minimal repro", action: "reproduction", hypothesis: "input", logit: 1.9 },
    { label: "Try a smaller input", action: "reproduction", hypothesis: "input", logit: 1.75 },
    { label: "Read the parser source", action: "source-reading", hypothesis: "parser", logit: 1.2 },
    { label: "Trace the network call", action: "network-tracing", hypothesis: "runtime", logit: 0.65 },
    { label: "Perturb request order", action: "order-testing", hypothesis: "concurrency", logit: 0.15 },
  ];

  var hypothesisLabels = {
    api: "API",
    runtime: "Runtime",
    input: "Input",
    parser: "Parser",
    concurrency: "Order",
  };

  function initTemperature(root) {
    var slider = root.querySelector("[data-cev-temperature-input]");
    var output = root.querySelector("[data-cev-temperature-output]");
    var button = root.querySelector("[data-cev-temperature-resample]");
    var svg = root.querySelector("svg");
    var live = root.querySelector("[data-cev-temperature-live]");
    var metricEntropy = root.querySelector("[data-cev-metric='entropy']");
    var metricWordings = root.querySelector("[data-cev-metric='wordings']");
    var metricActions = root.querySelector("[data-cev-metric='actions']");
    var metricHypotheses = root.querySelector("[data-cev-metric='hypotheses']");
    if (!slider || !svg) return;

    var seed = 1729;
    var frame = null;

    function render() {
      frame = null;
      var temperature = clamp(parseFloat(slider.value) || 0.8, 0.2, 2);
      var probabilities = softmax(
        decoder.map(function (d) {
          return d.logit;
        }),
        temperature
      );
      var rng = mulberry32(seed);
      var draws = [];
      for (var i = 0; i < N_DRAWS; i++) draws.push(sampleCategorical(probabilities, rng));

      var wordings = uniqueCount(draws);
      var actions = uniqueCount(
        draws.map(function (idx) {
          return decoder[idx].action;
        })
      );
      var hypotheses = uniqueCount(
        draws.map(function (idx) {
          return decoder[idx].hypothesis;
        })
      );
      var entropy = entropyBits(probabilities);

      output.textContent = temperature.toFixed(2);
      metricEntropy.textContent = entropy.toFixed(2) + " bits";
      metricWordings.textContent = wordings + " / " + decoder.length;
      metricActions.textContent = actions + " / 7";
      metricHypotheses.textContent = hypotheses + " / 5";

      var width = Math.max(300, Math.round(root.clientWidth || 700));
      var compact = width < 520;
      var labelWidth = compact ? Math.min(148, width * 0.47) : Math.min(230, width * 0.36);
      var rightPad = 44;
      var barX = labelWidth;
      var barWidth = Math.max(80, width - barX - rightPad);
      var top = 30;
      var rowHeight = compact ? 24 : 25;
      var height = top + decoder.length * rowHeight + 10;

      clear(svg);
      svg.setAttribute("viewBox", "0 0 " + width + " " + height);
      svg.setAttribute("height", height);
      svg.appendChild(svgEl("title", {}, "Temperature changes a synthetic decoder distribution"));
      svg.appendChild(
        svgEl(
          "desc",
          {},
          "Probability bars for twelve debugging continuations. Color groups outputs by the hypothesis they test."
        )
      );
      svg.appendChild(
        svgEl("text", { class: "cev-axis", x: width, y: 14, "text-anchor": "end" }, "probability")
      );

      decoder.forEach(function (item, idx) {
        var y = top + idx * rowHeight;
        var p = probabilities[idx];
        var hypothesisName = hypothesisLabels[item.hypothesis];
        svg.appendChild(svgEl("text", { class: "cev-svg-label", x: 0, y: y + 5 }, item.label));
        svg.appendChild(
          svgEl("rect", {
            class: "cev-bar-track",
            x: barX,
            y: y - 3,
            width: barWidth,
            height: 8,
            rx: 4,
          })
        );
        var bar = svgEl("rect", {
          class: "cev-bar",
          "data-hypothesis": item.hypothesis,
          x: barX,
          y: y - 3,
          width: Math.max(1.5, barWidth * p),
          height: 8,
          rx: 4,
        });
        bar.appendChild(svgEl("title", {}, item.label + " · " + hypothesisName));
        svg.appendChild(bar);
        svg.appendChild(
          svgEl("text", { class: "cev-svg-value", x: width, y: y + 5 }, formatPercent(p, p < 0.01 ? 1 : 0))
        );
      });

      var summary =
        "At temperature " +
        temperature.toFixed(2) +
        ", output entropy is " +
        entropy.toFixed(2) +
        " bits. In 24 synthetic draws, the decoder produced " +
        wordings +
        " wordings, " +
        actions +
        " semantic actions, and tested " +
        hypotheses +
        " environment hypotheses.";
      setLiveText(live, summary);
    }

    function requestRender() {
      if (frame === null) frame = requestAnimationFrame(render);
    }

    slider.addEventListener("input", requestRender);
    button.addEventListener("click", function () {
      seed = (seed + 0x9e3779b9) >>> 0;
      requestRender();
    });
    if (typeof ResizeObserver === "function") new ResizeObserver(requestRender).observe(root);
    else window.addEventListener("resize", requestRender);
    render();
  }

  function simulateHorizon(horizon, q, seed) {
    var localRng = mulberry32(seed);
    var coherentRng = mulberry32((seed ^ 0x85ebca6b) >>> 0);
    var local = [];
    var coherent = [];
    for (var episode = 0; episode < N_DRAWS; episode++) {
      var localRow = [];
      for (var step = 0; step < horizon; step++) localRow.push(localRng() < q);
      local.push(localRow);
      var sampledCorrect = coherentRng() < q;
      coherent.push(
        Array.from({ length: horizon }, function () {
          return sampledCorrect;
        })
      );
    }
    return { local: local, coherent: coherent };
  }

  function successfulRows(matrix) {
    return matrix.reduce(function (count, row) {
      return count + (row.every(Boolean) ? 1 : 0);
    }, 0);
  }

  function initHorizon(root) {
    var horizonInput = root.querySelector("[data-cev-horizon-input]");
    var horizonOutput = root.querySelector("[data-cev-horizon-output]");
    var qInput = root.querySelector("[data-cev-q-input]");
    var qOutput = root.querySelector("[data-cev-q-output]");
    var button = root.querySelector("[data-cev-horizon-resample]");
    var svg = root.querySelector("svg");
    var live = root.querySelector("[data-cev-horizon-live]");
    var localMetric = root.querySelector("[data-cev-metric='local-probability']");
    var coherentMetric = root.querySelector("[data-cev-metric='coherent-probability']");
    var advantageMetric = root.querySelector("[data-cev-metric='advantage']");
    if (!horizonInput || !qInput || !svg) return;

    var seed = 2027;
    var frame = null;

    function drawPanel(x, y, panelWidth, title, subtitle, matrix, horizon) {
      svg.appendChild(svgEl("text", { class: "cev-panel-title", x: x, y: y + 14 }, title));
      svg.appendChild(svgEl("text", { class: "cev-panel-subtitle", x: x, y: y + 31 }, subtitle));

      var matrixTop = y + 48;
      var cellGap = 2;
      var rowGap = 2;
      var cellHeight = 6;
      var cellWidth = Math.min(16, Math.max(5, (panelWidth - 34 - (horizon - 1) * cellGap) / horizon));
      var usedWidth = horizon * cellWidth + (horizon - 1) * cellGap;
      var successX = x + usedWidth + 12;

      svg.appendChild(svgEl("text", { class: "cev-axis", x: x, y: matrixTop - 7 }, "step 1"));
      if (horizon > 2) {
        svg.appendChild(
          svgEl(
            "text",
            { class: "cev-axis", x: x + usedWidth, y: matrixTop - 7, "text-anchor": "end" },
            "step " + horizon
          )
        );
      }

      matrix.forEach(function (row, rowIndex) {
        var rowY = matrixTop + rowIndex * (cellHeight + rowGap);
        row.forEach(function (correct, colIndex) {
          svg.appendChild(
            svgEl("rect", {
              class: correct ? "cev-cell-correct" : "cev-cell-wrong",
              x: x + colIndex * (cellWidth + cellGap),
              y: rowY,
              width: cellWidth,
              height: cellHeight,
              rx: 1.5,
            })
          );
        });
        if (row.every(Boolean)) {
          svg.appendChild(
            svgEl("circle", {
              class: "cev-success-mark",
              cx: successX,
              cy: rowY + cellHeight / 2,
              r: 2.7,
            })
          );
        }
      });
    }

    function render() {
      frame = null;
      var horizon = clamp(parseInt(horizonInput.value, 10) || 8, 2, 16);
      var q = clamp(parseFloat(qInput.value) || 0.7, 0.5, 0.95);
      var simulation = simulateHorizon(horizon, q, seed);
      var localSuccess = successfulRows(simulation.local);
      var coherentSuccess = successfulRows(simulation.coherent);
      var localProbability = Math.pow(q, horizon);
      var coherentProbability = q;
      var advantage = coherentProbability / localProbability;

      horizonOutput.textContent = horizon;
      qOutput.textContent = q.toFixed(2);
      localMetric.innerHTML = "<i>q</i><sup>" + horizon + "</sup> = " + formatPercent(localProbability, 1);
      coherentMetric.innerHTML = "<i>q</i> = " + formatPercent(coherentProbability, 0);
      advantageMetric.textContent = "×" + (advantage >= 100 ? advantage.toFixed(0) : advantage.toFixed(1));

      var width = Math.max(300, Math.round(root.clientWidth || 700));
      var stacked = width < 620;
      var panelGap = stacked ? 32 : 34;
      var panelWidth = stacked ? width : (width - panelGap) / 2;
      var panelHeight = 248;
      var height = stacked ? panelHeight * 2 + panelGap : panelHeight;

      clear(svg);
      svg.setAttribute("viewBox", "0 0 " + width + " " + height);
      svg.setAttribute("height", height);
      svg.appendChild(svgEl("title", {}, "Stepwise versus episode-level posterior sampling"));
      svg.appendChild(
        svgEl(
          "desc",
          {},
          "Each row is an episode. Blue means the action followed the correct hypothesis. A green dot means the full horizon stayed correct."
        )
      );

      drawPanel(
        0,
        0,
        panelWidth,
        "Resample every step",
        localSuccess + " / " + N_DRAWS + " succeeded",
        simulation.local,
        horizon
      );

      if (stacked) {
        svg.appendChild(
          svgEl("line", {
            class: "cev-panel-rule",
            x1: 0,
            x2: width,
            y1: panelHeight + panelGap / 2,
            y2: panelHeight + panelGap / 2,
          })
        );
        drawPanel(
          0,
          panelHeight + panelGap,
          panelWidth,
          "Sample once per episode",
          coherentSuccess + " / " + N_DRAWS + " succeeded",
          simulation.coherent,
          horizon
        );
      } else {
        svg.appendChild(
          svgEl("line", {
            class: "cev-panel-rule",
            x1: panelWidth + panelGap / 2,
            x2: panelWidth + panelGap / 2,
            y1: 0,
            y2: panelHeight - 12,
          })
        );
        drawPanel(
          panelWidth + panelGap,
          0,
          panelWidth,
          "Sample once per episode",
          coherentSuccess + " / " + N_DRAWS + " succeeded",
          simulation.coherent,
          horizon
        );
      }

      setLiveText(
        live,
        "With q = " +
          q.toFixed(2) +
          " and horizon " +
          horizon +
          ", resampling every step succeeds with probability " +
          formatPercent(localProbability, 1) +
          ". Sampling once per episode succeeds with probability " +
          formatPercent(coherentProbability, 0) +
          ". In 24 episodes the counts are " +
          localSuccess +
          " and " +
          coherentSuccess +
          "."
      );
    }

    function requestRender() {
      if (frame === null) frame = requestAnimationFrame(render);
    }

    horizonInput.addEventListener("input", requestRender);
    qInput.addEventListener("input", requestRender);
    button.addEventListener("click", function () {
      seed = (seed + 0x9e3779b9) >>> 0;
      requestRender();
    });
    if (typeof ResizeObserver === "function") new ResizeObserver(requestRender).observe(root);
    else window.addEventListener("resize", requestRender);
    render();
  }

  // A compact, exact analogue of the paper's customized Wordle experiment.
  // The paper delegates these operations to LLMs and stores the approximate
  // posterior as text; here a finite vocabulary makes every update visible.
  var wordleVocabulary = (
    "adieu arise arose audio badge baker basic beach beard began black blame blast blind block board " +
    "brace brain brake brand brave bread break brick bride bring broad brown cabin cable cairn cause " +
    "chain chair chalk charm chase cheap chest claim clean clear climb cloud coast coral could crane " +
    "crate crawl crazy dance dealt diary dream drink earth email faith false field final first flame " +
    "flash float force frame fresh giant given glory grace grain grand grape graph great grief hotel " +
    "house ideal image joint knife large later learn light magic metal money month mouse movie music " +
    "night noise ocean olive paint panel panic peach piano pilot place plain plane plant point pride " +
    "prime print radio raise reach react ready rival route scale score share shark shine shirt shock " +
    "short since slate smart smile solar solid solve sound south space spare speak spend spice spike " +
    "spoil sport stage stain stare steam stone store style sugar table teach their thing think tiger " +
    "trade trail train trend trial under value video vital voice waste watch water weird white " +
    "whole woman world worse write young"
  ).split(" ").filter(function (word) {
    return word.length === 5 && uniqueCount(word.split("")) === 5;
  });

  function wordleFeedback(guess, target) {
    return guess.split("").map(function (letter, index) {
      if (target[index] === letter) return "correct";
      return target.indexOf(letter) >= 0 ? "present" : "absent";
    });
  }

  function sameFeedback(left, right) {
    return left.every(function (value, index) {
      return value === right[index];
    });
  }

  function initWordle(root) {
    var board = root.querySelector("[data-cev-wordle-board]");
    var keyboard = root.querySelector("[data-cev-wordle-keyboard]");
    var stepButton = root.querySelector("[data-cev-wordle-step]");
    var targetButton = root.querySelector("[data-cev-wordle-target]");
    var revealButton = root.querySelector("[data-cev-wordle-reveal]");
    var status = root.querySelector("[data-cev-wordle-status]");
    var sampleNode = root.querySelector("[data-cev-wordle-sample]");
    var candidatesNode = root.querySelector("[data-cev-wordle-candidates]");
    var secretNode = root.querySelector("[data-cev-wordle-secret]");
    var live = root.querySelector("[data-cev-wordle-live]");
    var episodeMetric = root.querySelector("[data-cev-wordle-metric='episode']");
    var supportMetric = root.querySelector("[data-cev-wordle-metric='support']");
    var massMetric = root.querySelector("[data-cev-wordle-metric='mass']");
    var stateMetric = root.querySelector("[data-cev-wordle-metric='state']");
    var phaseNodes = root.querySelectorAll("[data-cev-wordle-phase]");
    if (!board || !stepButton || !candidatesNode) return;

    var targetCursor = Math.max(0, wordleVocabulary.indexOf("world"));
    var target = wordleVocabulary[targetCursor];
    var candidates = wordleVocabulary.slice();
    var attempts = [];
    var currentSample = null;
    var revealed = false;
    var running = false;
    var runToken = 0;
    var seed = 81173;
    var guessRng = mulberry32(seed);

    function setPhase(name) {
      phaseNodes.forEach(function (node) {
        node.classList.toggle("is-active", node.getAttribute("data-cev-wordle-phase") === name);
      });
    }

    function makeTile(letter, result, visible) {
      var tile = document.createElement("span");
      tile.className = "cev-wordle-tile" + (visible && result ? " is-" + result : "");
      tile.textContent = visible && letter ? letter.toUpperCase() : "";
      if (visible && letter) tile.setAttribute("aria-label", letter.toUpperCase() + ", " + result);
      else tile.setAttribute("aria-hidden", "true");
      return tile;
    }

    function renderBoard() {
      clear(board);
      for (var rowIndex = 0; rowIndex < 6; rowIndex++) {
        var row = document.createElement("div");
        row.className = "cev-wordle-row";
        var attempt = attempts[rowIndex];
        for (var col = 0; col < 5; col++) {
          var visible = attempt && col < attempt.visible;
          row.appendChild(
            makeTile(attempt ? attempt.guess[col] : "", attempt ? attempt.feedback[col] : "", visible)
          );
        }
        board.appendChild(row);
      }
      board.setAttribute(
        "aria-label",
        attempts.length
          ? attempts
              .map(function (attempt) {
                return attempt.guess.toUpperCase() + ": " + attempt.feedback.join(", ");
              })
              .join(". ")
          : "Six empty Wordle attempts"
      );
    }

    function renderCandidates() {
      clear(candidatesNode);
      var limit = 10;
      candidates.slice(0, limit).forEach(function (word) {
        var chip = document.createElement("span");
        chip.textContent = word.toUpperCase();
        candidatesNode.appendChild(chip);
      });
      if (candidates.length > limit) {
        var more = document.createElement("span");
        more.className = "cev-wordle-more";
        more.textContent = "+" + (candidates.length - limit);
        candidatesNode.appendChild(more);
      }
    }

    function renderKeyboard() {
      if (!keyboard) return;
      clear(keyboard);
      var rank = { absent: 1, present: 2, correct: 3 };
      var letterState = {};
      attempts.forEach(function (attempt) {
        if (attempt.visible < 5) return;
        attempt.guess.split("").forEach(function (letter, index) {
          var next = attempt.feedback[index];
          if (!letterState[letter] || rank[next] > rank[letterState[letter]]) letterState[letter] = next;
        });
      });
      ["qwertyuiop", "asdfghjkl", "zxcvbnm"].forEach(function (letters) {
        var row = document.createElement("div");
        row.className = "cev-wordle-keyboard-row";
        letters.split("").forEach(function (letter) {
          var key = document.createElement("span");
          key.className = "cev-wordle-key" + (letterState[letter] ? " is-" + letterState[letter] : "");
          key.textContent = letter.toUpperCase();
          row.appendChild(key);
        });
        keyboard.appendChild(row);
      });
    }

    function solved() {
      return attempts.some(function (attempt) {
        return attempt.guess === target && attempt.visible === 5;
      });
    }

    function renderSummary() {
      episodeMetric.textContent = attempts.length + " / 6";
      supportMetric.textContent = candidates.length + " words";
      massMetric.textContent = formatPercent(1 / candidates.length, candidates.length > 20 ? 1 : 0);
      sampleNode.textContent = currentSample ? currentSample.toUpperCase() : "-";
      secretNode.textContent = revealed || solved() || attempts.length === 6 ? "Target · " + target.toUpperCase() : "Target hidden";
      revealButton.textContent = revealed ? "Hide target" : "Reveal target";
      revealButton.setAttribute("aria-pressed", revealed ? "true" : "false");
      stepButton.disabled = running || solved() || attempts.length >= 6;
      targetButton.disabled = running;
      revealButton.disabled = running;
      stepButton.textContent = solved()
        ? "Solved"
        : attempts.length >= 6
          ? "Six episodes used"
          : "Run episode " + (attempts.length + 1);
      stateMetric.textContent = running ? "Committing" : solved() ? "Solved" : attempts.length >= 6 ? "Exhausted" : "Ready";
      renderBoard();
      renderKeyboard();
      renderCandidates();
    }

    function reset(advanceTarget) {
      runToken += 1;
      if (advanceTarget) {
        targetCursor = (targetCursor + 37) % wordleVocabulary.length;
        seed = (seed + 0x9e3779b9) >>> 0;
      }
      target = wordleVocabulary[targetCursor];
      candidates = wordleVocabulary.slice();
      attempts = [];
      currentSample = null;
      revealed = false;
      running = false;
      guessRng = mulberry32(seed);
      status.textContent = "Start with a uniform prior over the vocabulary, then sample one plausible target.";
      setPhase("posterior");
      renderSummary();
      setLiveText(live, "New hidden target. The posterior contains " + candidates.length + " possible words.");
    }

    function runEpisode() {
      if (running || solved() || attempts.length >= 6) return;
      running = true;
      var token = ++runToken;
      var before = candidates.length;
      currentSample = candidates[Math.floor(guessRng() * candidates.length)];
      var feedback = wordleFeedback(currentSample, target);
      var attempt = { guess: currentSample, feedback: feedback, visible: 0 };
      attempts.push(attempt);
      setPhase("sample");
      status.textContent =
        "Sampled " + currentSample.toUpperCase() + " from " + before + " plausible targets. Treat that hypothesis as true for this episode.";
      renderSummary();

      var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var delay = reducedMotion ? 0 : 105;
      setTimeout(function () {
        if (token !== runToken) return;
        setPhase("commit");
        status.textContent = "Commit to the sample: issue five correlated letter actions before revising the belief.";
      }, delay);

      for (var col = 1; col <= 5; col++) {
        (function (visibleLetters) {
          setTimeout(function () {
            if (token !== runToken) return;
            attempt.visible = visibleLetters;
            renderBoard();
          }, delay * (visibleLetters + 1));
        })(col);
      }

      setTimeout(function () {
        if (token !== runToken) return;
        candidates = candidates.filter(function (candidate) {
          return sameFeedback(wordleFeedback(currentSample, candidate), feedback);
        });
        running = false;
        setPhase("update");
        var didSolve = currentSample === target;
        status.textContent = didSolve
          ? "The sampled hypothesis matched the environment. The episode receives reward 1."
          : "Feedback removes inconsistent hypotheses: posterior support contracts from " + before + " to " + candidates.length + ".";
        setLiveText(
          live,
          "Episode " + attempts.length + " guessed " + currentSample.toUpperCase() + ". " +
            (didSolve ? "It found the target." : "The posterior shrank from " + before + " to " + candidates.length + " words.")
        );
        renderSummary();
      }, delay * 7 + (reducedMotion ? 0 : 100));
    }

    stepButton.addEventListener("click", runEpisode);
    targetButton.addEventListener("click", function () {
      reset(true);
    });
    revealButton.addEventListener("click", function () {
      if (running) return;
      revealed = !revealed;
      renderSummary();
    });
    reset(false);
  }

  // Pedagogical replica of HiddenMechanismMDP: hub-and-spoke world, exact
  // two-hypothesis posterior, one diagnostic reading, length-3 gate.
  var LAB_GATE_LENGTH = 3;
  var LAB_MAX_PROBES = 1;
  var LAB_TV_ALPHABET = 8;
  var LAB_SEQUENCES = [
    ["GATE_RIGHT", "GATE_LEFT", "GATE_RIGHT"],
    ["GATE_LEFT", "GATE_RIGHT", "GATE_LEFT"],
  ];
  var LAB_SEQUENCE_WORDS = [
    ["Right", "Left", "Right"],
    ["Left", "Right", "Left"],
  ];
  var LAB_SEQUENCE_LABELS = ["Right, Left, Right", "Left, Right, Left"];
  var LAB_SEQUENCE_KEYS = [
    ["R", "L", "R"],
    ["L", "R", "L"],
  ];
  var LAB_MAP = { width: 720, height: 312 };
  var LAB_ROOMS = [
    { id: "START", label: "Junction", role: "Hub with passages to every room.", x: 16, y: 16, w: 162, h: 136 },
    { id: "LAB", label: "Lab", role: "Workshop. Build the diagnostic instrument here.", x: 191, y: 16, w: 162, h: 136 },
    { id: "GATE", label: "Gate", role: "Combination lock. Left and Right are presses, not map directions.", x: 366, y: 16, w: 162, h: 136 },
    { id: "SAFE", label: "Safe", role: "Three reversible levers. High local control, no reward.", x: 541, y: 16, w: 162, h: 136 },
    { id: "PROBE", label: "Probe", role: "Instrument mount. One informative reading after the instrument is built.", x: 16, y: 164, w: 162, h: 132 },
    { id: "TV", label: "TV", role: "Noisy television. High entropy, no information.", x: 191, y: 164, w: 162, h: 132 },
    { id: "SIDE", label: "Cabinet", role: "A locked cabinet. Opening it does not help with the gate.", x: 366, y: 164, w: 162, h: 132 },
    { id: "DOOR", label: "Door", role: "Heavy door. Opening it is irreversible.", x: 541, y: 164, w: 162, h: 132 },
  ];
  var LAB_ROOM_BY_ID = LAB_ROOMS.reduce(function (acc, room) {
    acc[room.id] = room;
    return acc;
  }, {});

  // Lucide icons (ISC). Stroke geometry in a 24x24 viewBox.
  var LAB_ICONS = {
    flask: [
      { tag: "path", attrs: { d: "M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" } },
      { tag: "path", attrs: { d: "M6.453 15h11.094" } },
      { tag: "path", attrs: { d: "M8.5 2h7" } }
    ],
    radio: [
      { tag: "path", attrs: { d: "M16.247 7.761a6 6 0 0 1 0 8.478" } },
      { tag: "path", attrs: { d: "M19.075 4.933a10 10 0 0 1 0 14.134" } },
      { tag: "path", attrs: { d: "M4.925 19.067a10 10 0 0 1 0-14.134" } },
      { tag: "path", attrs: { d: "M7.753 16.239a6 6 0 0 1 0-8.478" } },
      { tag: "circle", attrs: { cx: "12", cy: "12", r: "2" } }
    ],
    tv: [
      { tag: "path", attrs: { d: "m17 2-5 5-5-5" } },
      { tag: "rect", attrs: { width: "20", height: "15", x: "2", y: "7", rx: "2" } }
    ],
    archive: [
      { tag: "rect", attrs: { width: "20", height: "5", x: "2", y: "3", rx: "1" } },
      { tag: "path", attrs: { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" } },
      { tag: "path", attrs: { d: "M10 12h4" } }
    ],
    fork: [
      { tag: "circle", attrs: { cx: "12", cy: "18", r: "3" } },
      { tag: "circle", attrs: { cx: "6", cy: "6", r: "3" } },
      { tag: "circle", attrs: { cx: "18", cy: "6", r: "3" } },
      { tag: "path", attrs: { d: "M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" } },
      { tag: "path", attrs: { d: "M12 12v3" } }
    ],
    vault: [
      { tag: "rect", attrs: { width: "18", height: "18", x: "3", y: "3", rx: "2" } },
      { tag: "circle", attrs: { cx: "7.5", cy: "7.5", r: "0.5", class: "is-fill" } },
      { tag: "path", attrs: { d: "m7.9 7.9 2.7 2.7" } },
      { tag: "circle", attrs: { cx: "16.5", cy: "7.5", r: "0.5", class: "is-fill" } },
      { tag: "path", attrs: { d: "m13.4 10.6 2.7-2.7" } },
      { tag: "circle", attrs: { cx: "7.5", cy: "16.5", r: "0.5", class: "is-fill" } },
      { tag: "path", attrs: { d: "m7.9 16.1 2.7-2.7" } },
      { tag: "circle", attrs: { cx: "16.5", cy: "16.5", r: "0.5", class: "is-fill" } },
      { tag: "path", attrs: { d: "m13.4 13.4 2.7 2.7" } },
      { tag: "circle", attrs: { cx: "12", cy: "12", r: "2" } }
    ],
    lockKey: [
      { tag: "circle", attrs: { cx: "12", cy: "16", r: "1" } },
      { tag: "rect", attrs: { x: "3", y: "10", width: "18", height: "12", rx: "2" } },
      { tag: "path", attrs: { d: "M7 10V7a5 5 0 0 1 10 0v3" } }
    ],
    lock: [
      { tag: "rect", attrs: { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2" } },
      { tag: "path", attrs: { d: "M7 11V7a5 5 0 0 1 10 0v4" } }
    ],
    door: [
      { tag: "path", attrs: { d: "M10 12h.01" } },
      { tag: "path", attrs: { d: "M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" } },
      { tag: "path", attrs: { d: "M2 20h20" } }
    ],
    user: [
      { tag: "path", attrs: { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" } },
      { tag: "circle", attrs: { cx: "12", cy: "7", r: "4" } }
    ],
    check: [
      { tag: "circle", attrs: { cx: "12", cy: "12", r: "10" } },
      { tag: "path", attrs: { d: "m9 12 2 2 4-4" } }
    ]
  };

  function labHere(episode) {
    return episode.location === "DEADEND" ? "DOOR" : episode.location;
  }

  function labSpecials(state) {
    if (state.location === "LAB" && !state.instrument) {
      return [{ id: "BUILD_INSTRUMENT", label: "Build instrument", kind: "work" }];
    }
    if (state.location === "PROBE" && state.probesUsed < LAB_MAX_PROBES) {
      return [{ id: "PROBE_ACT", label: state.instrument ? "Take reading" : "Read anyway", kind: "work" }];
    }
    if (state.location === "TV") return [{ id: "WATCH_TV", label: "Watch static", kind: "distract" }];
    if (state.location === "SIDE" && !state.cabinetOpen) {
      return [{ id: "INSPECT_SIDE", label: "Open cabinet", kind: "distract" }];
    }
    if (state.location === "SAFE") {
      return ["A", "B", "C"].map(function (letter) {
        return { id: "SAFE_" + letter, label: "Lever " + letter, kind: "lever" };
      });
    }
    if (state.location === "GATE" && state.instrument && state.probesUsed > 0) {
      return [
        { id: "GATE_LEFT", label: "Left", kind: "pad" },
        { id: "GATE_RIGHT", label: "Right", kind: "pad" },
      ];
    }
    if (state.location === "DOOR" && !state.doorTaken) {
      return [{ id: "DOOR_ACT", label: "Open door", kind: "danger" }];
    }
    return [];
  }

  function updateBelief(probs, observed, accuracy) {
    var unnormalized = probs.map(function (p, theta) {
      return p * (observed === theta ? accuracy : 1 - accuracy);
    });
    var total = unnormalized.reduce(function (a, b) {
      return a + b;
    }, 0);
    return unnormalized.map(function (p) {
      return p / total;
    });
  }

  function appendLabIcon(parent, name, x, y, size, extraClass) {
    var icon = svgEl("svg", {
      class: "cev-lab-icon" + (extraClass ? " " + extraClass : ""),
      viewBox: "0 0 24 24",
      fill: "none",
      x: x,
      y: y,
      width: size,
      height: size,
    });
    (LAB_ICONS[name] || []).forEach(function (part) {
      icon.appendChild(svgEl(part.tag, part.attrs));
    });
    parent.appendChild(icon);
  }

  function drawLabGlyph(parent, room, episode) {
    var g = svgEl("g", { class: "cev-lab-glyph" });
    var size = 36;
    var x = room.x + (room.w - size) / 2;
    var y = room.y + 22;
    var key = {
      START: "fork",
      LAB: "flask",
      PROBE: "radio",
      TV: "tv",
      SIDE: "archive",
      SAFE: "vault",
      GATE: "lockKey",
      DOOR: "door",
    }[room.id];
    appendLabIcon(g, key, x, y, size);
    if (room.id === "LAB" && episode.instrument) {
      appendLabIcon(g, "check", room.x + room.w - 28, room.y + 10, 16, "is-badge");
    }
    if (room.id === "GATE") {
      var locked = !(episode.instrument && episode.probesUsed > 0);
      if (locked) appendLabIcon(g, "lock", room.x + room.w - 28, room.y + 10, 16, "is-badge");
      var slotY = room.y + room.h - 36;
      var slotX = room.x + room.w / 2 - 14;
      for (var step = 0; step < LAB_GATE_LENGTH; step++) {
        g.appendChild(
          svgEl("circle", {
            class: "cev-lab-lock-slot" + (step < episode.gateProgress ? " is-set" : ""),
            cx: slotX + step * 14,
            cy: slotY,
            r: 3.5,
          })
        );
      }
    }
    if (room.id === "TV" && episode.lastTv !== null) {
      g.appendChild(
        svgEl(
          "text",
          {
            class: "cev-lab-tv-digit",
            x: room.x + room.w - 18,
            y: room.y + 22,
            "text-anchor": "middle",
          },
          String(episode.lastTv)
        )
      );
    }
    if (room.id === "PROBE" && episode.lastProbe !== null) {
      g.appendChild(
        svgEl(
          "text",
          {
            class: "cev-lab-probe-digit",
            x: room.x + room.w - 18,
            y: room.y + 22,
            "text-anchor": "middle",
          },
          String(episode.lastProbe)
        )
      );
    }
    parent.appendChild(g);
  }

  function initLab(root) {
    var svg = root.querySelector("[data-cev-lab-map]");
    var actionsNode = root.querySelector("[data-cev-lab-actions]");
    var hereNode = root.querySelector("[data-cev-lab-here]");
    var status = root.querySelector("[data-cev-lab-status]");
    var live = root.querySelector("[data-cev-lab-live]");
    var accuracyInput = root.querySelector("[data-cev-lab-accuracy]");
    var accuracyOutput = root.querySelector("[data-cev-lab-accuracy-output]");
    var resetButton = root.querySelector("[data-cev-lab-reset]");
    var revealButton = root.querySelector("[data-cev-lab-reveal]");
    var instrumentMetric = root.querySelector("[data-cev-lab-metric='instrument']");
    var readingMetric = root.querySelector("[data-cev-lab-metric='reading']");
    var progressMetric = root.querySelector("[data-cev-lab-metric='progress']");
    if (!svg || !actionsNode || !accuracyInput) return;

    var seed = 4242;
    var rng = mulberry32(seed);
    var revealed = false;
    var frame = null;
    var episode = {
      theta: 0,
      location: "START",
      instrument: false,
      probesUsed: 0,
      cabinetOpen: false,
      gateProgress: 0,
      doorTaken: false,
      safeVariant: "A",
      lastTv: null,
      lastProbe: null,
      done: false,
      outcome: null,
      belief: [0.5, 0.5],
      last: "",
    };

    function note(message) {
      episode.last = message;
    }

    function outcomeLine() {
      if (episode.outcome === "success") return "Gate opened.";
      if (episode.outcome === "deadend") return "Dead end.";
      if (episode.outcome === "fail") return "Wrong press. Episode over.";
      return "";
    }

    function idleCopy() {
      var loc = episode.location;
      if (loc === "START") return "Pick a room.";
      if (loc === "GATE" && (!episode.instrument || episode.probesUsed === 0)) {
        return "Locked until you build the instrument and take a reading at Probe.";
      }
      if (loc === "GATE") return "One wrong press ends the episode.";
      if (loc === "LAB" && episode.instrument) return "Instrument is built. Take it to Probe.";
      if (loc === "PROBE" && episode.probesUsed >= LAB_MAX_PROBES) return "You already used the one reading.";
      if (loc === "SIDE" && episode.cabinetOpen) return "The drawer is empty. Nothing here about the gate.";
      return "";
    }

    function dockStatus() {
      if (revealed && !episode.done) return "True code: " + LAB_SEQUENCE_LABELS[episode.theta] + ".";
      if (episode.done) return "";
      if (episode.last) return episode.last;
      return idleCopy();
    }

    function reset() {
      seed = (seed + 0x9e3779b9) >>> 0;
      rng = mulberry32(seed);
      episode = {
        theta: rng() < 0.5 ? 0 : 1,
        location: "START",
        instrument: false,
        probesUsed: 0,
        cabinetOpen: false,
        gateProgress: 0,
        doorTaken: false,
        safeVariant: "A",
        lastTv: null,
        lastProbe: null,
        done: false,
        outcome: null,
        belief: [0.5, 0.5],
        last: "",
      };
      revealed = false;
      requestRender();
      setLiveText(live, "New episode.");
    }

    function act(action) {
      if (episode.done) return;
      var accuracy = clamp(parseFloat(accuracyInput.value) || 0.9, 0.55, 0.95);

      if (action.indexOf("MOVE_") === 0) {
        var dest = action.slice(5);
        if (episode.doorTaken && dest === "LAB") {
          note("The lab is sealed from this side.");
          render();
          return;
        }
        episode.location = dest;
        note("");
        render();
        return;
      }

      if (action === "BUILD_INSTRUMENT") {
        episode.instrument = true;
        note("Instrument built. Take it to Probe.");
      } else if (action === "PROBE_ACT") {
        var observed;
        if (episode.instrument) {
          var correct = rng() < accuracy;
          observed = correct ? episode.theta : 1 - episode.theta;
          episode.lastProbe = observed;
          episode.belief = updateBelief(episode.belief, observed, accuracy);
          note("The reading favors " + LAB_SEQUENCE_LABELS[observed] + ".");
        } else {
          episode.lastProbe = rng() < 0.5 ? 0 : 1;
          note("No instrument. That reading is noise, so the posterior does not move.");
        }
        episode.probesUsed += 1;
      } else if (action === "WATCH_TV") {
        episode.lastTv = Math.floor(rng() * LAB_TV_ALPHABET);
        note("Random static. The posterior does not move.");
      } else if (action === "INSPECT_SIDE") {
        episode.cabinetOpen = true;
        note("The drawer is empty. Nothing here about the gate.");
      } else if (action.indexOf("SAFE_") === 0) {
        episode.safeVariant = action.slice(-1);
        note("Lever " + episode.safeVariant + " moved. The safe is not the gate.");
      } else if (action === "DOOR_ACT") {
        episode.doorTaken = true;
        episode.location = "DEADEND";
        episode.done = true;
        episode.outcome = "deadend";
        note("");
      } else if (action === "GATE_LEFT" || action === "GATE_RIGHT") {
        var expected = LAB_SEQUENCES[episode.theta][episode.gateProgress];
        if (action === expected) {
          episode.gateProgress += 1;
          if (episode.gateProgress === LAB_GATE_LENGTH) {
            episode.done = true;
            episode.outcome = "success";
            note("");
          } else {
            var remaining = LAB_GATE_LENGTH - episode.gateProgress;
            note(
              (action === "GATE_LEFT" ? "Left" : "Right") +
                " is correct. " +
                remaining +
                (remaining === 1 ? " press remaining." : " presses remaining.")
            );
          }
        } else {
          episode.done = true;
          episode.outcome = "fail";
          note("");
        }
      }

      render();
      setLiveText(live, episode.done ? outcomeLine() : dockStatus());
    }

    function renderMap() {
      clear(svg);
      svg.setAttribute("viewBox", "0 0 " + LAB_MAP.width + " " + LAB_MAP.height);
      svg.removeAttribute("height");

      var here = labHere(episode);
      LAB_ROOMS.forEach(function (room) {
        var isHere = here === room.id;
        var lockedGate = room.id === "GATE" && !(episode.instrument && episode.probesUsed > 0);
        var sealed = room.id === "DOOR" && episode.doorTaken;
        var group = svgEl("g", {
          class:
            "cev-lab-room" +
            (isHere ? " is-here" : "") +
            (lockedGate ? " is-locked" : "") +
            (sealed ? " is-sealed" : "") +
            (episode.done && episode.outcome === "success" && room.id === "GATE" ? " is-open" : ""),
          tabindex: episode.done || isHere ? "-1" : "0",
          role: "button",
          "aria-label": (isHere ? "You are in " : "Move to ") + room.label + ". " + room.role,
          "data-move": room.id,
        });
        if (isHere) group.setAttribute("aria-current", "location");
        group.appendChild(
          svgEl("rect", {
            class: "cev-lab-room-fill",
            x: room.x,
            y: room.y,
            width: room.w,
            height: room.h,
            rx: 10,
          })
        );
        drawLabGlyph(group, room, episode);
        group.appendChild(
          svgEl(
            "text",
            {
              class: "cev-lab-room-label",
              x: room.x + room.w / 2,
              y: room.y + room.h - 16,
              "text-anchor": "middle",
            },
            sealed ? "Sealed" : room.label
          )
        );
        if (isHere) {
          appendLabIcon(group, "user", room.x + 10, room.y + 10, 16, "is-pawn");
        }
        if (!episode.done && !isHere) {
          group.addEventListener("click", function () {
            act("MOVE_" + room.id);
          });
          group.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              act("MOVE_" + room.id);
            }
          });
        }
        svg.appendChild(group);
      });
    }

    function renderBelief() {
      var bars = root.querySelector("[data-cev-lab-belief]");
      if (!bars) return;
      clear(bars);
      episode.belief.forEach(function (p, theta) {
        var row = document.createElement("div");
        row.className = "cev-lab-belief-row" + (revealed && theta === episode.theta ? " is-true" : "");
        var seq = document.createElement("div");
        seq.className = "cev-lab-seq";
        seq.setAttribute("aria-label", LAB_SEQUENCE_LABELS[theta]);
        LAB_SEQUENCE_KEYS[theta].forEach(function (key, step) {
          var chip = document.createElement("span");
          chip.className = "cev-lab-key";
          chip.textContent = key;
          chip.title = LAB_SEQUENCE_WORDS[theta][step];
          if (episode.location === "GATE" && step === episode.gateProgress && !episode.done) {
            chip.className += " is-next";
          }
          if (step < episode.gateProgress) chip.className += " is-set";
          seq.appendChild(chip);
        });
        var track = document.createElement("div");
        track.className = "cev-lab-belief-track";
        var fill = document.createElement("div");
        fill.className = "cev-lab-belief-fill";
        fill.style.width = formatPercent(p, 0);
        var value = document.createElement("span");
        value.className = "cev-lab-belief-p";
        value.textContent = formatPercent(p, 0);
        track.appendChild(fill);
        row.appendChild(seq);
        row.appendChild(track);
        row.appendChild(value);
        bars.appendChild(row);
      });
    }

    function renderActions() {
      clear(actionsNode);
      var current = LAB_ROOM_BY_ID[labHere(episode)];
      if (hereNode) hereNode.textContent = episode.doorTaken ? "Sealed chamber" : current.label;
      if (episode.done) {
        var done = document.createElement("p");
        done.className = "cev-lab-done" + (episode.outcome === "success" ? " is-win" : " is-lose");
        done.textContent = outcomeLine();
        actionsNode.appendChild(done);
        return;
      }
      labSpecials(episode).forEach(function (item) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "cev-action cev-lab-" + item.kind;
        button.textContent = item.label;
        button.addEventListener("click", function () {
          act(item.id);
        });
        actionsNode.appendChild(button);
      });
    }

    function requestRender() {
      if (frame === null) frame = requestAnimationFrame(render);
    }

    function render() {
      frame = null;
      var accuracy = clamp(parseFloat(accuracyInput.value) || 0.9, 0.55, 0.95);
      if (accuracyOutput) accuracyOutput.textContent = accuracy.toFixed(2);
      if (instrumentMetric) instrumentMetric.textContent = episode.instrument ? "Built" : "None";
      if (readingMetric) readingMetric.textContent = episode.probesUsed + " / " + LAB_MAX_PROBES;
      if (progressMetric) progressMetric.textContent = episode.gateProgress + " / " + LAB_GATE_LENGTH;
      if (revealButton) {
        revealButton.textContent = revealed ? "Hide" : "Reveal";
        revealButton.setAttribute("aria-pressed", revealed ? "true" : "false");
      }
      if (status) status.textContent = dockStatus();
      renderMap();
      renderBelief();
      renderActions();
    }

    if (accuracyInput) accuracyInput.addEventListener("input", requestRender);
    if (resetButton) resetButton.addEventListener("click", reset);
    if (revealButton) {
      revealButton.addEventListener("click", function () {
        revealed = !revealed;
        requestRender();
      });
    }
    if (typeof ResizeObserver === "function") {
      new ResizeObserver(requestRender).observe(root);
    } else {
      window.addEventListener("resize", requestRender);
    }
    reset();
  }

  function boot() {
    document.querySelectorAll("[data-cev-temperature]").forEach(initTemperature);
    document.querySelectorAll("[data-cev-horizon]").forEach(initHorizon);
    document.querySelectorAll("[data-cev-wordle]").forEach(initWordle);
    document.querySelectorAll("[data-cev-lab]").forEach(initLab);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
