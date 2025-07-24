---
layout: page
title: Projects
permalink: /projects/
description: Collection of my personal and research projects
nav: false
nav_order: 3
chart:
  chartjs: true
display_categories:
horizontal: false
---

<!-- pages/projects.md -->

<div class="bayesian-optimization-demo mb-5">
  <h3>Interactive BayesOpt Demo</h3>
  <p>Explore Bayesian optimization by drawing custom functions or using presets. Watch how different acquisition functions guide the search for optimal points.</p>
  
  <!-- Function Selection and Drawing -->
  <div class="function-controls mb-4">
    <div class="row">
      <div class="col-md-6">
        <label for="functionModeSelect">Function mode:</label>
        <select class="form-control" id="functionModeSelect">
          <option value="preset" selected>Preset functions</option>
          <option value="draw">Draw your own</option>
        </select>
      </div>
      <div class="col-md-6" id="presetFunctionGroup">
        <label for="presetFunctionSelect">Preset function:</label>
        <select class="form-control" id="presetFunctionSelect">
          <option value="forrester" selected>Forrester (multi-modal)</option>
          <option value="sinc">Sinc function</option>
          <option value="quadratic">Simple quadratic</option>
          <option value="branin">Branin function</option>
          <option value="rosenbrock">Rosenbrock (1D slice)</option>
        </select>
      </div>
    </div>
  </div>

  <!-- Drawing Canvas (hidden by default) -->
  <div id="drawingSection" class="drawing-section" style="display: none;">
    <h5>Draw Your Objective Function</h5>
    <p class="small text-muted">Click and drag on the canvas below to draw your objective function. The function will be smoothed automatically.</p>
    <canvas id="drawingCanvas" class="drawing-canvas"></canvas>
    <div class="drawing-controls mt-2">
      <button id="clearDrawing" class="btn btn-secondary btn-sm">Clear Drawing</button>
      <button id="smoothDrawing" class="btn btn-info btn-sm">Smooth Function</button>
      <button id="confirmDrawing" class="btn btn-success btn-sm">Use This Function</button>
    </div>
  </div>

  <!-- Main Visualization -->
  <canvas id="bayesianOptimizationChart"></canvas>
  
  <!-- Controls -->
  <div class="controls-section mt-4">
    <div class="row">
      <div class="col-md-4">
        <label for="acquisitionFunctionSelect">Acquisition function:</label>
        <select class="form-control" id="acquisitionFunctionSelect">
          <option value="UCB" selected>Upper Confidence Bound (UCB)</option>
          <option value="EI">Expected Improvement (EI)</option>
          <option value="TS">Thompson Sampling (TS)</option>
          <option value="PI">Probability of Improvement (PI)</option>
        </select>
      </div>
      <div class="col-md-4">
        <label for="explorationParam">Exploration parameter:</label>
        <input type="range" class="form-range" id="explorationParam" min="0.1" max="3.0" step="0.1" value="1.96">
        <small class="form-text text-muted">Current: <span id="explorationValue">1.96</span></small>
      </div>
      <div class="col-md-4">
        <label for="animationSpeed">Animation speed:</label>
        <input type="range" class="form-range" id="animationSpeed" min="0.5" max="3.0" step="0.1" value="1.0">
        <small class="form-text text-muted">Current: <span id="speedValue">1.0</span>x</small>
      </div>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="action-buttons mt-3">
    <button id="addSamplePoint" class="btn btn-primary">Add Next Point</button>
    <button id="autoRunButton" class="btn btn-success ml-2">Auto Run (5 steps)</button>
    <button id="resetDemoButton" class="btn btn-secondary ml-2">Reset</button>
    <button id="toggleTruth" class="btn btn-outline-info ml-2">Toggle Ground Truth</button>
  </div>

  <!-- Status Display -->
  <div class="status-display mt-4">
    <div class="row">
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-value" id="iterationCount">0</div>
          <div class="stat-label">Iterations</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-value" id="bestValue">N/A</div>
          <div class="stat-label">Best Value</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-value" id="bestX">N/A</div>
          <div class="stat-label">Best X</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-value" id="regret">N/A</div>
          <div class="stat-label">Simple Regret</div>
        </div>
      </div>
    </div>
  </div>
<script src="{{ '/assets/js/bayesian-optimization-demo.js' | relative_url }}"></script>