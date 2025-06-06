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
  <p>Simulate querying a black-box function and see how BayesOpt finds the maximum</p>
  <canvas id="bayesianOptimizationChart"></canvas>
  
  <div class="form-group mt-3">
    <label for="acquisitionFunctionSelect">Acquisition function:</label>
    <select class="form-control" id="acquisitionFunctionSelect">
      <option value="UCB" selected>Upper Confidence Bound (UCB)</option>
      <option value="EI">Expected Improvement (EI)</option>
      <option value="TS">Thompson Sampling (TS)</option>
    </select>
  </div>

  <div class="mt-3">
    <button id="addSamplePoint" class="btn btn-primary">Add point</button>
    <button id="resetDemoButton" class="btn btn-secondary ml-2">Reset</button>
  </div>

  <p class="mt-2">Iteration: <span id="iterationCount">0</span></p>
  <p>Best value found: <span id="bestValue">N/A</span> at x = <span id="bestX">N/A</span></p>
</div>

<script src="{{ '/assets/js/bayesian-optimization-demo.js' | relative_url }}"></script>