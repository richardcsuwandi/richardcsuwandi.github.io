---
layout: distill
title: Can we use LLMs to discover new algorithms?
date: 2025-05-15 10:00:00 +0700
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
  - name: "FunSearch"
    subsections:
      - name: How FunSearch Works
      - name: Benefits of FunSearch
  - name: "AlphaEvolve"
    subsections:
      - name: How AlphaEvolve Works
      - name: Benefits of AlphaEvolve
  - name: FunSe
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
  
  /* Fix spacing in references section */
  d-citation-list .references .title {
    margin-bottom: -5px;
    line-height: 1.3;
  }
  d-citation-list .references .authors {
    margin-top: -5px;
    line-height: 1.3;
  }
  d-citation-list .references {
    line-height: 1.3;
  }
---

Large language models (LLMs) have rapidly become indispensable AI assistants. They excel at synthesizing concepts, writing, and coding to help humans solve complex problems<d-cite key="chen2021evaluating"></d-cite> . But could they discover entirely new knowledge? As LLMs have been shown to "hallucinate"<d-cite key="farquhar2024detecting"></d-cite> factually incorrect information, using them to make verifiably correct discoveries is a challenge. But what if we could harness the creativity of LLMs by identifying and building upon only their very best ideas? This question is at the heart of recent breakthroughs from [Google DeepMind](https://deepmind.google/), which explore how LLMs can be guided to make novel discoveries in mathematics and algorithm design. This post delves into two pioneering works, FunSearch and the more recent AlphaEvolve, showcasing their approaches and implications for the future of automated algorithm discovery.

## FunSearch

In a paper published in Nature<d-cite key="romera2024mathematical"></d-cite>, Google DeepMind introduced [FunSearch](https://deepmind.google/discover/blog/funsearch-making-new-discoveries-in-mathematical-sciences-using-large-language-models/), a groundbreaking method demonstrating that LLMs can make new discoveries in mathematical sciences. The core idea is to search for novel "functions" written in computer code, hence the name FunSearch. FunSearch tackles the trade-off between LLMs' creativity and correctness by pairing a pre-trained LLM with an automated "evaluator." This evaluator guards against hallucinations and incorrect ideas, ensuring that the system builds upon solid foundations.

### How FunSearch works

<img src="{{ '/assets/img/funsearch.png' | relative_url }}" alt="Overview of FunSearch" class="center" width="80%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 1.** The FunSearch process. The LLM is shown a selection of the best programs it has generated so far, and asked to generate an even better one. The programs proposed by the LLM are automatically executed, and evaluated. The best programs are added to the database, for selection in subsequent cycles.
</div>

FunSearch uses an evolutionary approach. To start, the user writes a description of the problem in code. This includes a way to evaluate programs and an initial "seed" program to begin the process. The system then follows these steps:

1. It selects the most promising programs from the current database.
2. These programs are sent to an LLM<d-footnote>In their work, Google's PaLM 2 was used, though other code-trained LLMs can also work.</d-footnote>, which creatively builds upon them to generate new program proposals.
3. The new programs are automatically run and checked by the evaluator.
4. The best-performing valid programs are added back into the database, improving the database for the next round.

<aside class="l-body box-note" markdown="1">
This cycle of selection, generation, evaluation, and update creates a *self-improving loop*. Starting from basic knowledge about the problem and using strategies to keep the database diverse, FunSearch is able to evolve simple solutions into more advanced ones. It can solve complex problems where human intuition might fall short.
</aside>

### Benefits of FunSearch

FunSearch's capabilities were tested on challenging problems. For example, it was used to solve the **[cap set problem](https://en.wikipedia.org/wiki/Cap_set)**, which involves finding the largest set of points in a high-dimensional grid where no three points lie on a line. This longstanding open problem in extremal combinatorics, once described by renowned mathematician Terence Tao as his [favorite open question](https://terrytao.wordpress.com/2007/02/23/open-question-best-bounds-for-cap-sets/), was solved by FunSearch, in collaboration with [Prof. Jordan Ellenberg](https://people.math.wisc.edu/~ellenberg/). This marked the first time an LLM made a new discovery for such a challenging scientific problem, outperforming state-of-the-art computational solvers.

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

## AlphaEvolve

More recently, in May 2025, Google DeepMind announced [AlphaEvolve](https://deepmind.google/discover/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/), an evolutionary coding agent powered by large language models for general-purpose algorithm discovery and optimization<d-cite key="deepmind2025alphaevolve"></d-cite>. This development builds upon the success of systems like FunSearch and represents a significant step towards leveraging AI for complex problem-solving across various domains. Unlike FunSearch, which focuses on discovering single functions, AlphaEvolve is designed to evolve entire codebases and develop much more intricate algorithms.

### How AlphaEvolve works

<img src="{{ '/assets/img/alphaevolve.png' | relative_url }}" alt="Overview of AlphaEvolve" class="center" width="80%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 4.** The AlphaEvolve process. A prompt sampler assembles prompts for the LLMs, which generate new programs. These are then evaluated and stored in a programs database, which uses an evolutionary algorithm to select programs for future prompts.
</div>

AlphaEvolve pairs the creative problem-solving capabilities of Google's Gemini models with automated evaluators. It uses an ensemble approach: [Gemini Flash](https://deepmind.google/discover/blog/gemini-flash-a-new-generation-of-large-language-models-with-fast-inference-and-high-quality-outputs/), the fastest and most efficient model, is used to maximize the breadth of ideas explored, while [Gemini Pro](https://deepmind.google/discover/blog/gemini-pro-a-new-generation-of-large-language-models-with-high-quality-outputs/), the most powerful model, provides critical depth with insightful suggestions. Together, these models propose computer programs that implement algorithmic solutions. These proposed programs are then verified, run, and scored using automated evaluation metrics that provide an objective assessment of each solution's accuracy and quality. This makes AlphaEvolve particularly effective in domains where progress can be clearly and systematically measured, like mathematics and computer science.

### Benefits of AlphaEvolve

AlphaEvolve has already demonstrated significant real-world impact across multiple domains:

1. **Improving data center scheduling:** AlphaEvolve discovered a simple yet highly effective heuristic to help [Borg](https://research.google/pubs/large-scale-cluster-management-at-google-with-borg/), Google's cluster management system, orchestrate its vast data centers more efficiently. This solution, which has been in production for over a year, continuously recovers, on average, 0.7% of Google's worldwide compute resources. This sustained efficiency gain allows more tasks to be completed on the same computational footprint. A key benefit is that AlphaEvolve's solution is human-readable code, offering interpretability, debuggability, predictability, and ease of deployment.

2. **Hardware design optimization:** AlphaEvolve proposed a [Verilog](https://en.wikipedia.org/wiki/Verilog) rewrite that removed unnecessary bits in a key, highly optimized arithmetic circuit for matrix multiplication. The proposal passed robust verification methods to confirm functional correctness and was integrated into an upcoming Tensor Processing Unit (TPU). By suggesting modifications in the standard language of chip designers, AlphaEvolve promotes collaboration between AI and hardware engineers to accelerate specialized chip design.

3. **Enhancing AI training and inference:** AlphaEvolve found more efficient ways to divide large matrix multiplication operations into manageable subproblems, achieving a 23% speedup in Gemini's architecture's vital [kernel](https://docs.jax.dev/en/latest/pallas/index.html), resulting in a 1% reduction in overall training time. In the realm of low-level GPU optimization, AlphaEvolve demonstrated remarkable efficiency by achieving up to a 32.5% speedup for the [FlashAttention](https://arxiv.org/abs/2205.14135) kernel implementation in Transformer-based AI models.

<img src="{{ '/assets/img/alphaevolve_applications.png' | relative_url }}" alt="Overview of AlphaEvolve" class="center" width="80%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 6.** How AlphaEvolve helps Google deliver a more efficient digital ecosystem, from data center scheduling and hardware design to AI model training.
</div>

Beyond these applications, AlphaEvolve made a groundbreaking contribution by discovering an algorithm for multiplying 4x4 complex-valued matrices using just 48 scalar multiplications, surpassing the efficiency of [Strassen's 1969 algorithm](https://en.wikipedia.org/wiki/Strassen_algorithm). When applied to a diverse set of over 50 open problems spanning mathematical analysis, geometry, combinatorics, and number theory, AlphaEvolve demonstrated remarkable versatility: it successfully rediscovered state-of-the-art solutions in 75% of cases and improved upon previously best-known solutions in 20% of cases. One of its most notable achievements was advancing the [300-year-old kissing number problem](https://plus.maths.org/content/newton-and-kissing-problem), where it discovered a configuration of 593 outer spheres and established a new lower bound in 11 dimensions, showcasing its ability to tackle complex geometric challenges.

<img src="{{ '/assets/img/alphaevolve_math.png' | relative_url }}" alt="Overview of AlphaEvolve" class="center" width="80%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 7.** Examples of ground-breaking mathematical contributions discovered with AlphaEvolve.
</div>

<aside class="l-body box-note" markdown="1">
Looking ahead, AlphaEvolve is expected to continue improving alongside the capabilities of large language models, especially as they become more proficient at coding. Google DeepMind is also planning an [Early Access Program](https://docs.google.com/forms/d/e/1FAIpQLSfaLUgKtUOJWdQtyLNAYb3KAkABAlKDmZoIqPbHtwmy3YXlCg/viewform) for selected academic users and exploring possibilities to make AlphaEvolve more broadly available. While currently focused on math and computing, its general nature means it could potentially transform many other areas such as material science, drug discovery, sustainability, and broader applications.
</aside>

## FunSearch vs AlphaEvolve

While both FunSearch and AlphaEvolve leverage evolutionary methods combined with LLMs for algorithm discovery, AlphaEvolve represents a substantial enhancement over its predecessor. Here's a detailed comparison of their capabilities:

| Capability | FunSearch | AlphaEvolve |
|------------|-----------|-------------|
| Code Scope | Evolves single function | Evolves entire code file |
| Code Size | Evolves up to 10-20 lines of code | Evolves up to hundreds of lines of code |
| Language Support | Python only | Any programming language |
| Computation | Needs fast evaluation (≤ 20min on 1 CPU) | Can evaluate for hours, in parallel, on accelerators |
| LLM Usage | Millions of LLM samples used | Thousands of LLM samples suffice |
| Model Scale | Small LLMs used, no benefit from using larger models | Benefits from using state-of-the-art LLMs |
| Context Handling | Minimal context (only previous solutions) | Rich context and feedback in prompts |
| Optimization | Optimizes single metric | Can simultaneously optimize multiple metrics |


<aside class="l-body box-note" markdown="1">
The evolution from FunSearch to AlphaEvolve demonstrates significant advances in **scale** and **generality**. While FunSearch was groundbreaking in showing how LLMs could aid mathematical discovery, AlphaEvolve extends this approach to tackle more complex, real-world problems across multiple domains. This progression also reflects the rapid advancement in LLM capabilities, where newer state-of-the-art models can generate more sophisticated and accurate code with fewer samples.
</aside>

## Takeaways

The development of FunSearch<d-cite key="romera2024mathematical"></d-cite> and AlphaEvolve<d-cite key="deepmind2025alphaevolve"></d-cite> marks an exciting advancement in the application of LLMs. Overall, these systems demonstrate LLMs are moving beyond text generation and coding assistance to become tools for genuine discovery and sophisticated optimization in mathematics, computer science, and engineering. Combining LLM creativity with rigorous, automated evaluation within an evolutionary framework is a powerful and promising strategy for tackling complex, real-world problems by evolving entire codebases. While the journey is still ongoing, the prospect of LLMs significantly augmenting, or even leading in some cases, algorithmic and mathematical discovery is becoming increasingly tangible.
