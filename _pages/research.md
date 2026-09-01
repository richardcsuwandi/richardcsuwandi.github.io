---
layout: page
permalink: /research/
title: Research
description: >-
  My research develops **adaptive intelligence for sequential decision-making and optimization**. Below, I highlight key 
  contributions from my research, organized by topic.
nav: true
nav_order: 0
---

<!-- _pages/research.md -->

<style>
/* This page renders inside .container (default.liquid), capped at 1140px by
    _base.scss, unlike the About page's uncapped .wide-about-container.
    Widen it here so the publication cards have more room. */
.container.mt-5 {
    max-width: 75% !important;
}

@media (max-width: 768px) {
    .container.mt-5 {
        max-width: 95% !important;
    }
}

/* Compact publication cards for inline use within the topic sections below */
.research-pubs .blog-post-card-horizontal {
    padding: 1.1rem 1.25rem;
    min-height: auto;
    margin-bottom: 1rem;
}
.research-pubs .post-title-horizontal {
    font-size: 1.4rem !important;
    margin-bottom: 0.35rem;
}
.research-pubs .post-date {
    font-size: 1.05rem;
    margin-bottom: 0.6rem;
}
.research-pubs .post-tags-left .tag-link {
    font-size: 0.76rem;
    padding: 0.32rem 0.78rem;
}
.research-pubs .post-right-section {
    padding-top: 0;
}
.research-pubs .paper-thumbnail {
    max-height: 190px;
}

.post article .gp-separator {
    margin-top: 1.5rem;
}

.post article .gp-separator + h2 {
    margin-top: 3rem !important;
}

.research-pubs {
    margin-bottom: 0.75rem;
}

.research-pubs .publication-abstract {
    margin-top: 1.5rem;
}

.post article .research-pubs + h2 {
    margin-top: 4.5rem !important;
}

/* Three-line clamp with inline "read more..." (see assets/js/research-readmore.js).
   The toggle matches .more-authors-toggle: gray, underlined, theme-color hover. */
.research-clamp {
    position: relative;
}

.research-clamp > p {
    margin-bottom: 0;
}

.post article .research-clamp {
    margin-bottom: 1.5rem;
}

.research-clamp.is-clamped > p {
    max-height: var(--clamp-height);
    overflow: hidden;
}

.research-clamp-toggle {
    appearance: none;
    -webkit-appearance: none;
    display: inline;
    margin: 0;
    border: 0;
    background: none;
    padding: 0;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    color: #999;
    cursor: pointer;
    text-decoration: underline;
}

.research-clamp-toggle:hover,
.research-clamp-toggle:focus-visible {
    color: var(--global-theme-color);
}

.research-clamp-toggle:focus-visible {
    outline: 2px solid #999;
    outline-offset: 2px;
}

.research-clamp.is-clamped .research-clamp-toggle {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 1;
    padding: 0 0 0 3.5em;
    background: linear-gradient(
        to right,
        transparent 0%,
        var(--global-bg-color) 2.6em,
        var(--global-bg-color) 100%
    );
}
</style>
<script defer src="{{ '/assets/js/research-readmore.js' | relative_url }}"></script>

<!-- GP / Bayesian optimization separator -->
<div class="gp-separator" aria-hidden="true">
  <svg class="gp-separator-svg" role="presentation" focusable="false"></svg>
</div>
<script src="{{ '/assets/js/gp-separator.js' | relative_url }}"></script>

## AI-driven surrogate design and discovery

Most Bayesian optimization (BO) methods fix a surrogate model before the search begins. When that choice is a poor match for the problem, performance suffers. [CAKE](#suwandi2025cake) uses a large language model to design the surrogate instead of selecting from a fixed catalog: the LLM proposes, mutates, and recombines model structures using the task description, the data collected so far, and the optimization history. A selection criterion then balances how well a candidate fits the data against how useful the experiments it would recommend are likely to be. CAKE improves results on hyperparameter tuning, controller tuning, and photonic chip design, and is an early example of a foundation model acting as a designer of interpretable models rather than only as a predictor.

<div class="publications research-pubs">
{% bibliography --group_by none --query @*[key=suwandi2025cake]* %}
</div>

## Scalable surrogate learning and optimization

Gaussian processes (GPs) are a natural surrogate for unknown functions: they provide both predictions and calibrated uncertainty from small amounts of data, which is essential when every experiment is costly. The bottleneck is the kernel, the function that encodes assumptions about how the target behaves. As kernels become more expressive, choosing and tuning them becomes slow, high-dimensional, and numerically unstable. I address this in two ways. First, I design [grid spectral mixture (GSM) kernels](#suwandi2022gaussian) that scale to multidimensional data. Building on a sparse structure I identified in their training, I then develop [SLIM-KL](#suwandi2023gaussian), a distributed method that lets multiple parties jointly train expressive GPs without sharing raw data. Second, I develop [ZAP](#suwandi2026breaking), an optimizer that estimates a model's full gradient from only two evaluations of the training loss, independent of the number of hyperparameters. This makes tuning tractable even when computing gradients directly is impractical. Dimensionality is also a problem for BO itself: as the search space grows, GP surrogates and their acquisition functions become harder to fit and optimize. [GRAPE](#suwandi-grape) uses gradient information to refine the surrogate locally and to adjust the exploration-exploitation trade-off as the search proceeds, which improves query efficiency in high-dimensional black-box optimization.

<div class="publications research-pubs">
{% bibliography --group_by none --query @*[key=suwandi2022gaussian]* %}
{% bibliography --group_by none --query @*[key=suwandi2023gaussian]* %}
{% bibliography --group_by none --query @*[key=suwandi2026breaking]* %}
{% bibliography --group_by none --query @*[key=suwandi-grape]* %}
</div>

## Structured and communication-efficient learning

I am also interested in how practical constraints, such as limited communication or a required model structure, should shape learning systems. [FedMAvg](#wang2021demystifying) is a federated method for matrix factorization, a standard building block of recommender systems. It combines alternating minimization with model averaging to reduce the number of communication rounds across participants with heterogeneous data. [MIMOMamba](#li2026mimomamba) extends Mamba, a class of efficient state-space models, from a single input-output stream to many streams at once, matching or exceeding Transformer performance with substantially fewer parameters.

<div class="publications research-pubs">
{% bibliography --group_by none --query @*[key=wang2021demystifying]* %}
{% bibliography --group_by none --query @*[key=li2026mimomamba]* %}
</div>

Together, this line of work moves from optimizing inside a fixed, human-designed model class toward systems that can adapt their representations, hypotheses, and actions as they collect data. If any of this is your interest too, [email me](mailto:{{ site.email | encode_email }})!
{: .no-readmore }
