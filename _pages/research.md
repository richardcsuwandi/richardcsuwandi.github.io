---
layout: page
permalink: /research/
title: Research
description: >-
  I develop **adaptive inductive biases for data-efficient optimization and discovery**: assumptions that can be learned from limited data, revised during search, and proposed by open-ended search.
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

I study this through **inductive bias**, the assumptions that make some patterns easier to learn than others. A kernel sets which inputs count as similar, how observations constrain unseen points, and where uncertainty sends the next experiment. Two flexible models can still disagree about a small dataset, because one makes the useful pattern cheap and the other makes it expensive. My PhD thesis makes these choices [efficient to fit](#efficient-learning), [revisable during optimization](#adaptive-optimization), and [open to discovery](#open-ended-model-discovery).
{: .no-readmore }

## Efficient learning

Fitting the bias has to stay cheap enough to leave budget for experiments. [Grid spectral mixture kernels](#suwandi2022gaussian) give multidimensional covariance a structured spectrum. [SLIM-KL](#suwandi2023gaussian) uses the sparsity of those weights so agents can fit a kernel while raw data stays local. [ZAP](#suwandi2026breaking) estimates a full hyperparameter gradient from two loss evaluations, however many parameters there are.

The same interest in computational structure shows up outside kernels. [FedMAvg](#wang2021demystifying) pairs alternating minimization with model averaging for communication-efficient federated matrix factorization. [MIMOMamba](#li2026mimomamba) uses a matrix polynomial so a state-space model can mix channels and still train in linear time.

<div class="publications research-pubs">
{% bibliography --group_by none --query @*[key=suwandi2022gaussian]* %}
{% bibliography --group_by none --query @*[key=suwandi2023gaussian]* %}
{% bibliography --group_by none --query @*[key=suwandi2026breaking]* %}
{% bibliography --group_by none --query @*[key=wang2021demystifying]* %}
{% bibliography --group_by none --query @*[key=li2026mimomamba]* %}
</div>

## Adaptive optimization

When each evaluation is expensive, the bias also chooses the next query. [GRAPE](#suwandi2026grape) first reduces uncertainty about a local gradient, then picks the direction with the largest expected decrease conditional on descent. The target is high-dimensional black-box search, including adversarial attacks and LLM prompt optimization, where a step that is almost sure to descend can still be too small to justify the query.

[Q-exponential Bayesian optimization](#suwandi2026qed) keeps a closed-form acquisition and uses a shape parameter to set how heavily large deviations are weighted. On beamformer and adaptive-filter tuning, the heavier tail improves the search under impulsive outliers.

In ongoing work on **Multiverse Bayesian Optimization (MvBO)**, I study how a finite representation budget should be shared across complementary kernels whose features are fitted jointly. The question is which useful directions survive that budget, and how the structure left out changes later optimization.

<div class="publications research-pubs">
{% bibliography --group_by none --query @*[key=suwandi2026grape]* %}
{% bibliography --group_by none --query @*[key=suwandi2026qed]* %}
</div>

## Open-ended model discovery

A search can only use an assumption it is able to propose. [CAKE](#suwandi2025cake) puts kernel structure inside the optimization loop. A language model proposes and revises compositions from the task and the data so far, and each candidate is ranked by fit and by the experiments it would recommend.

[Kernel Autoresearch (Kernaut)](#suwandi2026kernaut) treats kernel design as open-ended model discovery. Coding agents write kernels as programs. Construction contracts keep every accepted program a valid kernel, and a quality-diversity archive retains high-performing kernels whose behavior differs.

Kernels found this way transfer to optimization, forecasting, and scientific tasks withheld from search, with no further language-model calls. I study what those programs preserve, which symmetries they favor, and when a bias found on one family of tasks still helps on another.

Kernaut is the kernel case of a broader question I work on with the [AIDDA Institute](https://algorithmdiscovery.org/): open-ended algorithm and model discovery, where agents propose candidates and the result has to hold on problems the search did not see.

<div class="publications research-pubs">
{% bibliography --group_by none --query @*[key=suwandi2025cake]* %}
{% bibliography --group_by none --query @*[key=suwandi2026kernaut]* %}
</div>

What a model treats as cheap to learn, how fast that preference can be fitted, and which alternatives search can propose, decide what limited data can teach. I combine algorithm design, mathematical analysis, and empirical evaluation. If this overlaps with your interests, [email me](mailto:{{ site.email | encode_email }})!
{: .no-readmore }
