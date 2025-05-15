---
layout: distill
title: Can we use LLMs to discover new algorithms?
date: 2025-05-15 00:00:00 +0700
description: Automated algorithm discovery with LLMs
tags: [large-language-models, agents]
categories: paper-summary
giscus_comments: true
related_posts: false
thumbnail: /assets/img/algorithms.png
future: true
htmlwidgets: true

# Anonymize when submitting
# authors:
#   - name: Anonymous
#     affiliations:
#       name: Anonymous

authors:
 - name: Richard Cornelius Suwandi
   url: "https://richardcsuwandi.github.io/"
   affiliations:
     name: The Chinese University of Hong Kong, Shenzhen

# must be the exact same name as your blogpost
bibliography: 2025-05-15-llm-algorithm-discovery.bib

# Add a table of contents to your post.
#   - make sure that TOC names match the actual section names
#     for hyperlinks within the post to work correctly.
#   - please use this format rather than manually creating a markdown table of contents.
toc:
  - name: Introduction
  - name: "FunSearch: Finding Functions with LLMs"
    subsections:
      - name: How FunSearch Works
      - name: Key Discoveries and Benefits
  - name: "AlphaEvolve: Designing Advanced Algorithms with Gemini"
    subsections:
      - name: Benefits of AlphaEvolve
  - name: Takeaways

# Below is an example of injecting additional post-specific styles.
# This is used in the 'Layouts' section of this post.
# If you use this post as a template, delete this _styles block.
_styles: >

  .center {
      display: block;
      margin-left: auto;
      margin-right: auto;
  }

  .framed {
    border: 1px var(--global-text-color) dashed !important;
    padding: 20px;
  }

  d-article {
    overflow-x: visible;
  }

  .underline {
    text-decoration: underline;
  }

  .todo{
      display: block;
      margin: 12px 0;
      font-style: italic;
      color: red;
  }
  .todo:before {
      content: "TODO: ";
      font-weight: bold;
      font-style: normal;
  }
  summary {
    color: steelblue;
    font-weight: bold;
  }

  summary-math {
    text-align:center;
    color: black
  }

  [data-theme="dark"] summary-math {
    text-align:center;
    color: white
  }

  details[open] {
  --bg: #e2edfc;
  color: black;
  border-radius: 15px;
  padding-left: 8px;
  background: var(--bg);
  outline: 0.5rem solid var(--bg);
  margin: 0 0 2rem 0;
  font-size: 80%;
  line-height: 1.4;
  }

  [data-theme="dark"] details[open] {
  --bg: #112f4a;
  color: white;
  border-radius: 15px;
  padding-left: 8px;
  background: var(--bg);
  outline: 0.5rem solid var(--bg);
  margin: 0 0 2rem 0;
  font-size: 80%;
  }
  .box-note, .box-warning, .box-error, .box-important {
    padding: 15px 15px 15px 10px;
    margin: 20px 20px 20px 5px;
    border: 1px solid #eee;
    border-left-width: 5px;
    border-radius: 5px 3px 3px 5px;
  }
  d-article .box-note {
    background-color: #eee;
    border-left-color: #2980b9;
  }
  d-article .box-warning {
    background-color: #fdf5d4;
    border-left-color: #f1c40f;
  }
  d-article .box-error {
    background-color: #f4dddb;
    border-left-color: #c0392b;
  }
  d-article .box-important {
    background-color: #d4f4dd;
    border-left-color: #2bc039;
  }
  html[data-theme='dark'] d-article .box-note {
    background-color: #555555;
    border-left-color: #2980b9;
  }
  html[data-theme='dark'] d-article .box-warning {
    background-color: #7f7f00;
    border-left-color: #f1c40f;
  }
  html[data-theme='dark'] d-article .box-error {
    background-color: #800000;
    border-left-color: #c0392b;
  }
  html[data-theme='dark'] d-article .box-important {
    background-color: #006600;
    border-left-color: #2bc039;
  }
  d-article aside {
    border: 1px solid #aaa;
    border-radius: 4px;
    padding: .5em .5em 0;
    font-size: 90%;
  }
  .caption { 
    font-size: 80%;
    line-height: 1.2;
    text-align: left;
  }
---

Large language models (LLMs) are useful assistants. They excel at combining concepts and can read, write and code to help people solve problems. But could they discover entirely new knowledge? As LLMs have been shown to "hallucinate" factually incorrect information, using them to make verifiably correct discoveries is a challenge. But what if we could harness the creativity of LLMs by identifying and building upon only their very best ideas? This question is at the heart of recent breakthroughs from [Google DeepMind](https://deepmind.google/), which explore how LLMs can be guided to make novel discoveries in mathematics and algorithm design. This post delves into two pioneering systems, FunSearch and the more recent AlphaEvolve, showcasing their approaches and implications for the future of automated algorithm discovery.

## FunSearch: Finding functions with LLMs

In a paper published in Nature<d-cite key="romera2024mathematical"></d-cite>, Google DeepMind introduced [FunSearch](https://deepmind.google/discover/blog/funsearch-making-new-discoveries-in-mathematical-sciences-using-large-language-models/), a groundbreaking method demonstrating that LLMs can make new discoveries in mathematical sciences. The core idea is to search for novel "functions" written in computer code, hence the name FunSearch. FunSearch tackles the challenge of LLM creativity versus correctness by pairing a pre-trained LLM with an automated "evaluator." This evaluator guards against hallucinations and incorrect ideas, ensuring that the system builds upon solid foundations.

### How FunSearch works

<img src="{{ '/assets/img/funsearch.png' | relative_url }}" alt="Overview of FunSearch" class="center" width="80%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 1.** The FunSearch process. The LLM is shown a selection of the best programs it has generated so far, and asked to generate an even better one. The programs proposed by the LLM are automatically executed, and evaluated. The best programs are added to the database, for selection in subsequent cycles.
</div>

FunSearch uses an evolutionary approach. To start, the user writes a description of the problem in code. This includes a way to evaluate programs and an initial "seed" program to begin the process. The system then follows these steps:

1. It selects the most promising programs from the current pool.
2. These programs are sent to an LLM<d-footnote>In their work, Google's PaLM 2 was used, though other code-trained LLMs can also work.</d-footnote>, which creatively builds upon them to generate new program proposals.
3. The new programs are automatically run and checked by the evaluator.
4. The best-performing, valid programs are added back into the pool, improving the collection for the next round.

<aside class="l-body box-note" markdown="1">
This cycle of selection, generation, evaluation, and update creates a *self-improving loop*. Starting from basic knowledge about the problem and using strategies to keep the pool diverse, FunSearch is able to evolve simple solutions into more advanced ones. It can solve complex problems where human intuition might fall short.
</aside>

### Benefits of FunSearch

FunSearch's capabilities were demonstrated on challenging problems. For example, it was used to solve the **[cap set problem](https://en.wikipedia.org/wiki/Cap_set)**, which involves finding the largest set of points in a high-dimensional grid where no three points lie on a line. This longstanding open problem in extremal combinatorics, once described by renowned mathematician Terence Tao as his [favorite open question](https://terrytao.wordpress.com/2007/02/23/open-question-best-bounds-for-cap-sets/), was solved by FunSearch, in collaboration with [Prof. Jordan Ellenberg](https://people.math.wisc.edu/~ellenberg/). This marked the first time an LLM made a new discovery for such a challenging scientific problem, outperforming state-of-the-art computational solvers.

<img src="{{ '/assets/img/capset.png' | relative_url }}" alt="Benefits of FunSearch" class="center" width="30%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 2.** Illustration of the cap set problem. The circles are the elements of $\mathbb{Z}_3^2$ with the ones belonging to the cap set shown in blue. The possible lines in $\mathbb{Z}_3^2$ are also shown (with colours indicating lines that wrap around in arithmetic modulo 3). No three elements of the cap set are in a line.
</div>

A significant advantage of FunSearch is that it does not just provide solutions. It generates programs that describe *how* these solutions are constructed. FunSearch also favors highly compact, concise programs, making them easier for researchers to comprehend and learn from.

> "The solutions generated by FunSearch are **far conceptually richer** than a mere list of numbers. When I study them, I learn something." — Jordan Ellenberg, Professor of Mathematics at the University of Wisconsin–Madison

<img src="{{ '/assets/img/funsearch_code.png' | relative_url }}" alt="Code generated by FunSearch" class="center" width="80%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 3.** Code generated by FunSearch for the cap set problem. 
</div>

The success of FunSearch <d-cite key="romera2024mathematical"></d-cite> underscores that LLMs, when carefully guided and their outputs rigorously verified, can be powerful engines for scientific discovery.

## AlphaEvolve: Designing advanced algorithms with Gemini

More recently, in May 2025, Google DeepMind announced [AlphaEvolve](https://deepmind.google/discover/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/), an evolutionary coding agent powered by large language models for general-purpose algorithm discovery and optimization<d-cite key="deepmind2025alphaevolve"></d-cite>. This development builds upon the success of systems like FunSearch and represents a significant step towards leveraging AI for complex problem-solving across various domains. Unlike FunSearch, which focuses on discovering single functions, AlphaEvolve is designed to evolve entire codebases and develop much more intricate algorithms.

<img src="{{ '/assets/img/alphaevolve.png' | relative_url }}" alt="Overview of AlphaEvolve" class="center" width="80%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 4.** The AlphaEvolve process. A prompt sampler assembles prompts for the LLMs, which generate new programs. These are then evaluated and stored in a programs database, which uses an evolutionary algorithm to select programs for future prompts.
</div>

AlphaEvolve pairs the creative problem-solving capabilities of Google's Gemini models with automated evaluators. It uses an ensemble approach: [Gemini Flash](https://deepmind.google/discover/blog/gemini-flash-a-new-generation-of-large-language-models-with-fast-inference-and-high-quality-outputs/), the fastest and most efficient model, is used to maximize the breadth of ideas explored, while [Gemini Pro](https://deepmind.google/discover/blog/gemini-pro-a-new-generation-of-large-language-models-with-fast-inference-and-high-quality-outputs/), the most powerful model, provides critical depth with insightful suggestions. Together, these models propose computer programs that implement algorithmic solutions.

These proposed programs are then verified, run, and scored using automated evaluation metrics that provide an objective assessment of each solution's accuracy and quality. This makes AlphaEvolve particularly effective in domains where progress can be clearly and systematically measured, like mathematics and computer science.

### Benefits of AlphaEvolve

AlphaEvolve has already demonstrated significant real-world impact. Here are a couple of examples:

1. **Improving data center scheduling:** AlphaEvolve discovered a simple yet highly effective heuristic to help [Borg])(https://research.google/pubs/large-scale-cluster-management-at-google-with-borg/), Google's cluster management system, orchestrate its vast data centers more efficiently. This solution, which has been in production for over a year, continuously recovers, on average, 0.7% of Google's worldwide compute resources. This sustained efficiency gain allows more tasks to be completed on the same computational footprint. A key benefit is that AlphaEvolve's solution is human-readable code, offering interpretability, debuggability, predictability, and ease of deployment.

2. **Enhancing AI training and inference:** AlphaEvolve has significantly accelerated AI performance. By finding smarter ways to divide large matrix multiplication operations into more manageable subproblems, it sped up this vital [kernel](https://docs.jax.dev/en/latest/pallas/index.html) in Gemini's architecture by 23%. This led to a 1% reduction in Gemini's overall training time, a considerable saving given the substantial computing resources required for developing generative AI models. Furthermore, AlphaEvolve can optimize low-level GPU instructions, achieving up to a 32.5% speedup for the [FlashAttention](https://arxiv.org/abs/2205.14135) kernel implementation in Transformer-based AI models. This not only boosts performance but also reduces engineering time for kernel optimization from weeks to days.

Beyond these, AlphaEvolve has assisted in hardware design by proposing [Verilog](https://en.wikipedia.org/wiki/Verilog) rewrites for [TPUs](https://cloud.google.com/tpu?hl=en) and has advanced mathematical frontiers, such as finding an improved algorithm for multiplying 4-by-4 complex-valued matrices and making progress on the [kissing number problem](https://en.wikipedia.org/wiki/Kissing_number).

<img src="{{ '/assets/img/alphaevolve_applications.png' | relative_url }}" alt="Overview of AlphaEvolve" class="center" width="80%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 5.** How AlphaEvolve helps Google deliver a more efficient digital ecosystem, from data center scheduling and hardware design to AI model training.
</div>

## Takeaways

The development of FunSearch<d-cite key="romera2024mathematical"></d-cite> and AlphaEvolve<d-cite key="deepmind2025alphaevolve"></d-cite> marks an exciting advancement in the application of LLMs. Overall, these systems demonstrate LLMs are moving beyond text generation and coding assistance to become tools for genuine discovery and sophisticated optimization in mathematics, computer science, and engineering. Combining LLM creativity with rigorous, automated evaluation within an evolutionary framework is a powerful and promising strategy for tackling complex, real-world problems by evolving entire codebases. While the journey is still ongoing, the prospect of LLMs significantly augmenting, or even leading in some cases, algorithmic and mathematical discovery is becoming increasingly tangible.
