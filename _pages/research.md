---
layout: page
permalink: /research/
title: Research
description:
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
    font-size: 1.3rem !important;
    margin-bottom: 0.35rem;
}
.research-pubs .publication-authors,
.research-pubs .publication-venue {
    font-size: 0.9rem;
}
.research-pubs .post-date {
    font-size: 0.8rem;
    margin-bottom: 0.6rem;
}
.research-pubs .post-tags-left .tag-link {
    font-size: 0.62rem;
    padding: 0.25rem 0.5rem;
}
.research-pubs .post-right-section {
    padding-top: 0;
}
.research-pubs .paper-thumbnail {
    max-height: 130px;
}
</style>

My research develops **adaptive intelligence for scientific discovery and engineering design**: AI systems that build a model of an unknown environment, select the next experiment worth running under a limited budget, and update their beliefs as new evidence arrives. Below, I highlight key contributions from my research, organized by topic.

### Scalable and robust surrogate learning

Gaussian processes (GPs) are a natural choice for surrogate modeling of an unknown environment, since they provide predictions along with calibrated uncertainty estimates from small amounts of data, a property that is essential when every experiment is costly. Their practicality, however, is limited by the kernel, the function that encodes assumptions about how the environment behaves. As models are made more expressive, choosing and tuning a kernel becomes slow, high-dimensional, and numerically unstable. I address this limitation from two directions. First, I design [grid spectral mixture (GSM) kernels](#suwandi2022gaussian) that scale to multidimensional data, and, building on a sparse structure I identify in how they are trained, develop [SLIM-KL](#suwandi2023gaussian), a distributed learning method that allows multiple parties to jointly train expressive GPs without sharing their raw data. Second, I develop [ZAP](#suwandi2026breaking), an optimizer that estimates a model's full gradient from only two evaluations of the training loss, regardless of the number of hyperparameters, which makes tuning tractable even for large models where computing gradients directly is impractical.

<div class="publications research-pubs">
{% bibliography --query @*[key=suwandi2022gaussian]* %}
{% bibliography --query @*[key=suwandi2023gaussian]* %}
{% bibliography --query @*[key=suwandi2026breaking]* %}
</div>

### AI-driven surrogate design and discovery

Most Bayesian optimization methods fix a kernel before the search begins, which limits performance whenever that choice is poorly matched to the problem at hand. I introduce [CAKE](#suwandi2025cake), which places a large language model in charge of this choice: rather than selecting from a fixed menu, the LLM proposes, mutates, and recombines kernel structures based on the task description, the data collected so far, and the optimization history, guided by a criterion that balances how well a kernel fits the data against how useful the experiments it recommends are likely to be. CAKE improves performance across hyperparameter tuning, controller tuning, and photonic chip design, and provides an early example of foundation models acting as designers of interpretable models rather than only as predictors.

<div class="publications research-pubs">
{% bibliography --query @*[key=suwandi2025cake]* %}
</div>

### Structured and communication-efficient learning

More broadly, I am interested in how learning systems should be shaped by the practical constraints under which they operate, such as limited communication or a need for specific model structure. [FedMAvg](#wang2021demystifying) is a federated learning method for matrix factorization, a workhorse technique behind recommender systems, that combines alternating minimization with model averaging to reduce the number of communication rounds required across a network of participants with heterogeneous data. [MIMOMamba](#li2026mimomamba) extends Mamba, a recent class of efficient sequence models, from handling a single input and output stream to handling many simultaneously, matching or exceeding Transformer performance while using substantially fewer parameters.

<div class="publications research-pubs">
{% bibliography --query @*[key=wang2021demystifying]* %}
{% bibliography --query @*[key=li2026mimomamba]* %}
</div>

Together, this work moves from optimizing within a fixed, human-designed model space toward systems that can adapt their representations, experiments, and hypotheses as they interact with the world.
