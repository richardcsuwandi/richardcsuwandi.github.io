---
layout: page
permalink: /research/
title: Research
description: >-
  My research focuses on **scalable and adaptive learning for optimization and discovery**: building models and decision rules that use limited data and computation effectively.
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
    margin-bottom: 2rem;
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


**How can a learning system use limited data and computation effectively when its modeling assumptions may need to change?**
{: .no-readmore }

I study this question through **inductive bias**, the assumptions that make some patterns easier to learn than others. A kernel determines how observations inform predictions at unseen inputs, which relationships the model favors, and how uncertainty guides the next experiment. My work makes these choices [more affordable to learn](#scalable-learning), [adaptable to the task](#adaptive-optimization), and [open to discovery](#model-structure-and-discovery).
{: .no-readmore }

## Scalable learning

Useful models must be affordable to train. My [grid spectral mixture kernels](#suwandi2022gaussian) use structured representations for multidimensional covariance. [SLIM-KL](#suwandi2023gaussian) exploits sparse kernel weights to distribute fitting and reduce communication while keeping raw data local. [ZAP](#suwandi2026breaking) estimates a full hyperparameter gradient from two loss evaluations per iteration, making updates practical when direct gradients are expensive or unavailable.

The same interest in computational structure extends beyond kernels. [FedMAvg](#wang2021demystifying) combines alternating minimization and model averaging for communication-efficient federated matrix factorization. [MIMOMamba](#li2026mimomamba) uses structured state-space dynamics to capture interactions across channels while limiting parameter and computation costs.

<div class="publications research-pubs">
{% bibliography --group_by none --query @*[key=suwandi2022gaussian]* %}
{% bibliography --group_by none --query @*[key=suwandi2023gaussian]* %}
{% bibliography --group_by none --query @*[key=suwandi2026breaking]* %}
{% bibliography --group_by none --query @*[key=wang2021demystifying]* %}
{% bibliography --group_by none --query @*[key=li2026mimomamba]* %}
</div>

## Adaptive optimization

When evaluations are expensive, uncertainty should help decide where to spend them. [GRAPE](#suwandi-grape) refines a local gradient posterior, then chooses a direction using expected progress conditional on descent. [Q-exponential Bayesian optimization](#suwandi2026qed) changes predictive tail shape while retaining tractable acquisition calculations. These methods address different parts of the decision process: allocating queries and adapting the predictive assumptions behind them.

In ongoing work on **Multiverse Bayesian Optimization (MvBO)**, I study how a finite representation budget should be shared across complementary kernels whose features are fitted jointly. The question is which useful directions survive that budget and how the omitted structure affects optimization.

<div class="publications research-pubs">
{% bibliography --group_by none --query @*[key=suwandi-grape]* %}
{% bibliography --group_by none --query @*[key=suwandi2026qed]* %}
</div>

## Model structure and discovery

A useful modeling assumption may never be considered if it is difficult to express or find. [CAKE](#suwandi2025cake) makes kernel structure part of the optimization loop: a language model proposes and revises kernel compositions using task context and accumulated observations. Candidates are ranked through both statistical fit and the utility of the experiments they recommend.

My ongoing work on **Kernel Autoresearch (Kernaut)** extends this search to executable features and input transformations assembled through trusted kernel constructions. I analyze what the resulting representations preserve, which relationships they favor, and whether they transfer to tasks withheld from search. The aim is to discover useful inductive biases and explain why they help.

<div class="publications research-pubs">
{% bibliography --group_by none --query @*[key=suwandi2025cake]* %}
</div>

Across these areas, I combine algorithm design, mathematical analysis, and empirical evaluation to make learning and optimization more effective under practical constraints. If this overlaps with your interests, [email me](mailto:{{ site.email | encode_email }})!
{: .no-readmore }
