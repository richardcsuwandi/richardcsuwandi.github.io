---
layout: distill
title: Learning with a goal
date: 2024-09-16 00:00:00 +0700
description: A unified perspective of Bayesian optimization and active learning
tags: [ACTIVE LEARNING, BAYESIAN OPTIMIZATION]
giscus_comments: true
related_posts: false
thumbnail: /assets/img/race.png
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
bibliography: 2024-09-16-learn-with-a-goal.bib

# Add a table of contents to your post.
#   - make sure that TOC names match the actual section names
#     for hyperlinks within the post to work correctly.
#   - please use this format rather than manually creating a markdown table of contents.
toc:
  - name: Goal-driven learning
  - name: Adaptive sampling
  - name: Learning and infill criteria
    subsections:
      - name: Learning criteria
      - name: Infill Criteria
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
    border: 1px solid #f9f9f9;
    border-left-width: 5px;
    border-radius: 5px 3px 3px 5px;
    position: relative;
  }
  
  /* Title styling for boxes */
  .box-note[title]::before, .box-warning[title]::before, .box-error[title]::before, .box-important[title]::before {
    content: attr(title);
    display: block;
    font-weight: bold;
    font-size: 1.1em;
    margin-bottom: 8px;
    padding-bottom: 5px;
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }
  
  d-article .box-note {
    background-color: #f9f9f9;
    border-left-color: #9db2d8;
  }
  d-article .box-note[title]::before {
    color:rgb(0, 0, 0);
  }
  
  d-article .box-warning {
    background-color: #f9f9f9;
    border-left-color: #f8de92;
  }
  d-article .box-warning[title]::before {
    color:rgb(0, 0, 0);
  }
  
  d-article .box-error {
    background-color: #f9f9f9;
    border-left-color: #ddb4be;
  }
  d-article .box-error[title]::before {
    color:rgb(0, 0, 0);
  }
  
  d-article .box-important {
    background-color: #f9f9f9;
    border-left-color: #a8c08a;
  }
  d-article .box-important[title]::before {
    color:rgb(0, 0, 0);
  }
  
  html[data-theme='dark'] d-article .box-note {
    background-color: #2f2f2f;
    border-left-color: #9db2d8;
  }
  html[data-theme='dark'] d-article .box-note[title]::before {
    color:rgb(255, 255, 255);
    border-bottom-color: #686868;
  }
  
  html[data-theme='dark'] d-article .box-warning {
    background-color: #2f2f2f;
    border-left-color: #f8de92;
  }
  html[data-theme='dark'] d-article .box-warning[title]::before {
    color:rgb(255, 255, 255);
    border-bottom-color: #686868;
  }
  
  html[data-theme='dark'] d-article .box-error {
    background-color: #2f2f2f;
    border-left-color: #ddb4be;
  }
  html[data-theme='dark'] d-article .box-error[title]::before {
    color:rgb(255, 255, 255);
    border-bottom-color: #686868;
  }
  
  html[data-theme='dark'] d-article .box-important {
    background-color: #2f2f2f;
    border-left-color: #a8c08a;
  }
  html[data-theme='dark'] d-article .box-important[title]::before {
    color:rgb(255, 255, 255);
    border-bottom-color: #686868;
  }
  d-article aside {
    border: 1px solid #aaa;
    border-radius: 4px;
    padding: .5em .5em 0;
    font-size: 90%
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

  /* Enhanced Code Block Styling */
  code {
    background-color: #f5f5f5;
    color: #d73027;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'SF Mono', Monaco, 'Inconsolata', 'Fira Code', 'Droid Sans Mono', 'Source Code Pro', monospace;
    font-size: 0.9em;
    font-weight: 500;
    border: 1px solid #e1e1e1;
  }

  .highlight {
    background-color: #f8f8f8;
    border: 1px solid #e1e1e1;
    border-radius: 8px;
    margin: 20px 0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    position: relative;
  }

  .highlight pre {
    background-color: transparent !important;
    border: none !important;
    border-radius: 0;
    padding: 16px 20px;
    margin: 0 !important;
    overflow-x: auto;
    box-shadow: none !important;
  }

  /* For standalone pre elements without .highlight wrapper */
  pre:not(.highlight pre) {
    background-color: #f8f8f8;
    border: 1px solid #e1e1e1;
    border-radius: 8px;
    margin: 20px 0;
    padding: 16px 20px;
    overflow-x: auto;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    position: relative;
  }

  pre code {
    background-color: transparent;
    color: #2d3748;
    padding: 0;
    border: none;
    font-size: 0.85em;
    line-height: 1.6;
    font-weight: 400;
    display: block;
  }

  /* Simple Python syntax highlighting for code blocks */
  pre code {
    color: #2d3748;
  }

  /* Keywords: class, def, if, while, return, etc. */
  pre code .token.keyword,
  pre code .language-python .hljs-keyword {
    color: #1976d2;
    font-weight: 600;
  }

  /* Strings */
  pre code .token.string,
  pre code .language-python .hljs-string {
    color: #388e3c;
  }

  /* Comments */
  pre code .token.comment,
  pre code .language-python .hljs-comment {
    color: #757575;
    font-style: italic;
  }

  /* Numbers */
  pre code .token.number,
  pre code .language-python .hljs-number {
    color: #d32f2f;
  }

  /* Function and class names */
  pre code .token.function,
  pre code .token.class-name,
  pre code .language-python .hljs-title {
    color: #7b1fa2;
    font-weight: 600;
  }

  /* Built-ins like self, True, False */
  pre code .token.builtin,
  pre code .language-python .hljs-built_in {
    color: #1976d2;
  }

  /* Manual highlighting for common Python patterns */
  pre code {
    white-space: pre;
    line-height: 1.6;
  }

  /* Dark mode styling */
  html[data-theme='dark'] code {
    background-color: #2d3748;
    color: #fbb6ce;
    border: 1px solid #4a5568;
  }

  html[data-theme='dark'] .highlight {
    background-color: #1a202c !important;
    border: 1px solid #2d3748 !important;
    box-shadow: none !important;
    border-radius: 8px;
  }

  html[data-theme='dark'] pre,
  html[data-theme='dark'] .highlight pre {
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
    margin: 0 !important;
    padding: 16px 20px !important;
  }

  /* For standalone pre elements without .highlight wrapper */
  html[data-theme='dark'] pre:not(.highlight pre) {
    background-color: #1a202c !important;
    border: 1px solid #2d3748 !important;
    border-radius: 8px;
  }

  html[data-theme='dark'] pre code {
    background-color: transparent !important;
    color: #e2e8f0 !important;
    border: none !important;
  }

  /* Dark mode syntax highlighting - ensure consistent base styling */
  html[data-theme='dark'] pre code,
  html[data-theme='dark'] .highlight code {
    background-color: transparent !important;
    color: #e2e8f0 !important;
    border: none !important;
  }

  /* Keywords in dark mode */
  html[data-theme='dark'] pre code .token.keyword,
  html[data-theme='dark'] pre code .language-python .hljs-keyword {
    color: #81d4fa;
    font-weight: 600;
  }

  /* Strings in dark mode */
  html[data-theme='dark'] pre code .token.string,
  html[data-theme='dark'] pre code .language-python .hljs-string {
    color: #a5d6a7;
  }

  /* Comments in dark mode */
  html[data-theme='dark'] pre code .token.comment,
  html[data-theme='dark'] pre code .language-python .hljs-comment {
    color: #90a4ae;
    font-style: italic;
  }

  /* Numbers in dark mode */
  html[data-theme='dark'] pre code .token.number,
  html[data-theme='dark'] pre code .language-python .hljs-number {
    color: #ffab91;
  }

  /* Function and class names in dark mode */
  html[data-theme='dark'] pre code .token.function,
  html[data-theme='dark'] pre code .token.class-name,
  html[data-theme='dark'] pre code .language-python .hljs-title {
    color: #ce93d8;
    font-weight: 600;
  }

  /* Built-ins in dark mode */
  html[data-theme='dark'] pre code .token.builtin,
  html[data-theme='dark'] pre code .language-python .hljs-built_in {
    color: #81d4fa;
  }

  /* Language label styling */
  pre::before {
    content: "Python";  /* Default label */
    position: absolute;
    top: 8px;
    right: 12px;
    background-color: rgba(0,0,0,0.1);
    color: #666;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.75em;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    backdrop-filter: blur(5px);
  }

  /* Override for BibTeX code blocks */
  pre.bibtex::before,
  pre.language-bibtex::before {
    content: "BibTeX" !important;
  }

  html[data-theme='dark'] pre::before {
    background-color: rgba(255,255,255,0.1);
    color: #a0aec0;
  }

  /* Citation box styling */
  .citation-box {
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 16px 20px;
    margin: 20px 0;
    font-family: 'SF Mono', Monaco, 'Inconsolata', 'Fira Mono', monospace;
    font-size: 0.9em;
    line-height: 1.6;
    overflow-x: auto;
  }

  /* Dark mode for citation box */
  html[data-theme='dark'] .citation-box {
    background-color: #2d3748;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    pre {
      margin: 15px -10px;
      border-radius: 0;
      border-left: none;
      border-right: none;
    }
    
    code {
      font-size: 0.85em;
    }
    
    pre code {
      font-size: 0.8em;
    }
  }
---
Traditionally, Bayesian optimization (BO) has been perceived as a technique for optimizing expensive objective functions through efficient data sampling, while active learning (AL) is often seen as a way to selectively query data to improve model performance. Recently, Fiore et al. (2024)<d-cite key="di2024active"></d-cite> proposed a unified perspective of BO and AL, arguing that both can be viewed as adaptive sampling schemes guided by common learning principles toward a given optimization goal. In this post, we will explore the key ideas presented in the paper and discuss the implications of this unified perspective.

## Goal-driven learning
Goal-driven learning<d-cite key="bui2007goal"></d-cite> can described as:
<aside class="l-body box-important" markdown="1" title="Definition">
A decision-making process in which each decision is made to acquire specific information about the system of interest that contributes the most to achieve a given a goal.
</aside>

BO and AL can be regarded as goal-driven procedures, where a surrogate model is built to capture the behavior of a system or effectively inform an optimization procedure to minimize the given objective.  This goal-driven process seeks to determine the "best" location of the domain to acquire information about the system, and refine the surrogate model towards the goal. Mathematically, it can be formulated as:

$$
  x^* = \arg \min_{x \in \mathcal{X}} f(R(x))
$$

where $$f$$ is the objective and $$R(x)$$ is the response of the system. Here, $$f$$ may represent the error between the surrogate approximation and the response, such that the goal is to minimize the error to improve the accuracy of the surrogate. Alternatively, $$f$$ may also represents a performance indicator based on the response, so the goal is to minimize this indicator to improve the system's performance.

## Adaptive sampling
BO and AL use adaptive sampling schemes to efficiently accomplish a given goal while adapting to the previously collected information:
- In BO, the goal is to minimize the objective function by iteratively selecting the next location to sample based on the surrogate model. The surrogate model is updated after each sample to refine the approximation and guide the next decision.
- In AL, the goal is to minimize the generalization error of a model by iteratively selecting the next sample to improve the model's performance. The model is updated after each sample to refine the approximation and guide the next decision.

We can further classify adaptive sampling schemes into three main categories:

| Category | Description |
|----------|-------------|
| Adaptive Probing | Methods that do not rely on a surrogate model and directly probe the system to gather information in a sequential manner. |
| Adaptive Modeling| Methods that compute a surrogate model independently, without using it to inform the sampling process. |
| Adaptive Learning| Methods that use information from the surrogate model to make decisions and update the model based on those decisions. |

The key distinction between these categories lies in the concept of *goal-driven learning*, which is the distinctive element of the adaptive learning class. In this paradigm, the learner actively gathers information from the surrogate model to guide its decisions towards the desired goal, and the surrogate model is consequently improved by the outcome of these decisions.

In contrast, the adaptive probing and adaptive modeling classes do not exhibit this goal-driven learning characteristic. Adaptive probing methods operate without the aid of a surrogate, while adaptive modeling approaches compute a surrogate that is not directly used to inform the sampling process.

<img src="{{ '/assets/img/adaptive_sampling.png' | relative_url }}" alt="transformer" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 1.** Classification of adaptive sampling techniques: Where adaptive sampling and active learning meet.
</div>

## Learning and infill criteria
The strong synergy between AL and BO is rooted in the substantial analogy between the learning criteria that drive the AL procedure and the infill criteria that characterize the BO scheme.

### Learning criteria
Learning criteria establish a metric for quantifying the gains of all the possible learner decisions, and prescribe an optimal decision based in information acquired from the surrogate model. In AL, there are 3 essential learning criteria<d-cite key="he2014active"></d-cite>:
1. **Informativeness:** The sampling policy is driven by the goal of acquiring the *most informative samples*, i.e., the ones that are expected to contribute the maximum information.
2. **Representativeness:** The sampling policy aims to select *samples that are representative* of the target domain, exploiting the structure of the problem to direct queries to locations
3. **Diversity:** The sampling policy seeks to select *samples that are diverse*, i.e., well-spread across the domain, preventing the concentration of queries in small local regions.

<img src="{{ '/assets/img/learning_criteria.png' | relative_url }}" alt="transformer" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 2.** Illustration of the three learning criteria in watering optimization problem: (a) informativeness, (b) representativeness, and (c) diversity.
</div>

### Infill criteria
On the other hand, the infill criteria in BO provides a measure of the information gain that would result from sampling at a particular location. The most common infill criteria are<d-cite key="garnett2023bayesian"></d-cite>:
1. **Global exploration:** This criterion focuses on choosing samples in regions of *high predictive uncertainty*, enhancing global awareness of the search space. However, this approach may not direct resources optimally towards the specific goal.
2. **Local exploitation:** This criterion prioritizes choosing samples in regions with *high predictive mean*, focusing the search on promising areas. Yet, it may result in less accurate knowledge of the overall objective function distribution.

<aside class="l-body box-warning" markdown="1" title="Remark">
Overall, we can observe a strong correspondence between the learning criteria in AL and the infill criteria in BO:
- **The "informativeness" criterion in AL aligns with the "local exploitation" criterion in BO**, as both aim to maximize the information gain.
- Similarly, **the "representativeness" and "diversity" criteria in AL correspond to the "global exploration" criterion in BO**, as they seek to ensure that the sampling process is well-distributed across the domain.
</aside>

## Takeaways
BO and AL have traditionally been viewed as distinct fields with separate goals and methodologies. However, this paper provides a unified perspective that highlights the shared principles underlying both fields. By recognizing the synergy between BO and AL, we can leverage the strengths of each field to develop more powerful and efficient learning algorithms.

## Citation

If you find this post useful, please cite it as:

<div class="citation-box">
Suwandi, R. C. (Sep 2024). Learning with a goal. Posterior Update. https://richardcsuwandi.github.io/blog/2024/learn-with-a-goal/.
</div>

Or in BibTeX format:

```bibtex
@article{suwandi2024learnwithagoal,
    title   = "Learning with a goal",
    author  = "Suwandi, Richard Cornelius",
    journal = "Posterior Update",
    year    = "2024",
    month   = "Sep",
    url     = "https://richardcsuwandi.github.io/blog/2024/learn-with-a-goal/"
}
```