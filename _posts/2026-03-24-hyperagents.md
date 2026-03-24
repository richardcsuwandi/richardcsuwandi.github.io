---
layout: distill
title: "AI That Evolves Its Own Evolution"
date: 2026-03-24 10:00:00 +0700
description: A deep dive into Hyperagents and metacognitive self-modification 
tags: [AGENTS, LARGE LANGUAGE MODELS]
giscus_comments: true
related_posts: false
thumbnail: /assets/img/improve_improve.png
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
bibliography: 2026-03-24-hyperagents.bib

# Add a table of contents to your post.
#   - make sure that TOC names match the actual section names
#     for hyperlinks within the post to work correctly.
#   - please use this format rather than manually creating a markdown table of contents.
toc:
  - name: The bottleneck of self-improvement
  - name: Hyperagents
    subsections:
      - name: What is a hyperagent?
      - name: Metacognitive self-modification
      - name: How DGM-Hyperagents works
  - name: What DGM-H discovers on its own
  - name: Can DGM-H really improve itself?
    subsections:
      - name: Coding
      - name: Beyond coding
      - name: Meta-level transfer
      - name: Compounding self-improvements
  - name: Comparison with other self-improving systems
  - name: Can we trust an AI that improves its own improvement?
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

In my [previous post](https://richardcsuwandi.github.io/blog/2025/dgm/) on the [Darwin-Gödel Machine (DGM)](https://sakana.ai/dgm/), we have explored how an AI agent can iteratively rewrite its own code, evolving better tools and strategies without humans redesigning it from scratch. But there's a limitation hiding in the DGM's design that only becomes apparent when you step outside coding. The DGM's self-improvement process is driven by a handcrafted **instruction-generation mechanism**: a fixed piece of logic, designed by humans, that looks at the agent's past performance and decides what to improve next. This mechanism never changes. It's the ghost in the machine, always guiding the evolution but immune to it.

Think of a student who reviews their own notes, rewrites summaries, and redoes practice problems after every poor result. That's the DGM. But the student's *study method* (when to review, how to identify gaps, how to prioritize) was set by a teacher at the start of the semester and locked forever. No matter how much the student improves at the subject, the method stays fixed. What if the student could also redesign *how they study*?

That's the question **Hyperagents** <d-cite key="zhang2026hyperagents"></d-cite> try to answer.

## The bottleneck of self-improvement

The DGM works because of a convenient alignment: *improving at coding also makes you better at modifying code*. The two skills are essentially the same. A better coder writes more targeted edits, proposes more focused changes, and understands codebases more deeply. So when the agent improves at coding tasks, it simultaneously improves at self-modification. However, this alignment does not hold in other domains. Improving at a given task (such as analysis, design, or evaluation) does not necessarily make you better at modifying the code that controls the improvement process itself. The required skills are different.

So there's a ceiling: the mechanism for self-improvement remains stuck at the quality set by its original human design. The agent might get better at the domain task, but not at improving its own methods for self-improvement. And this challenge is not unique to the DGM. Almost all existing self-improving AI systems have a fixed meta-level:

<aside class="l-body box-warning" markdown="1" title="A shared blind spot">
Almost all existing self-improving AI systems have a fixed meta-level:

- **ADAS** <d-cite key="hu2025adas"></d-cite> automatically designs agentic systems, but its meta-level LLM agent (the one proposing changes) is fixed throughout.
- **AlphaEvolve** <d-cite key="deepmind2025alphaevolve"></d-cite> evolves algorithms through an evolutionary loop, but the loop itself is entirely human-engineered.
- **AlphaZero** <d-cite key="silver2017mastering"></d-cite> achieves superhuman performance via self-play<d-footnote>Self-play is a training method where an AI system improves by playing against versions of itself rather than relying on human gameplay data. This approach allows the agent to continually encounter new strategies and learn from its own mistakes, resulting in progressively stronger performance.</d-footnote>, but the underlying training algorithm is designed by humans and never modified.

In every case, the *mechanism of improvement* remains frozen. The agent gets better at the task, but the process that drives improvement never does. Progress is ultimately bounded by the quality of human engineering at the meta level.
</aside>

## Hyperagents

### What is a hyperagent?

The core idea behind Hyperagents <d-cite key="zhang2026hyperagents"></d-cite> is simple: instead of having separate, fixed layers for task-solving and self-improvement, merge them into one editable program.

The framework defines three things:

- A **task agent** solves a given task: generating code edits, writing paper reviews, designing robot reward functions, etc.
- A **meta agent** modifies other agents and generates improved versions of them. Given the archive of past agents and evaluation results, it proposes changes intended to improve future performance.
- A **hyperagent** combines both into a single editable codebase, such that the meta agent (like everything else) can rewrite itself.

<img src="{{ '/assets/img/hyperagents.png' | relative_url }}" alt="DGM vs DGM-Hyperagents" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 1.** DGM (top) vs. DGM-Hyperagents (bottom): fixed instruction generation versus one editable program that includes the meta agent.
</div>

The diagram is the architectural contrast in one glance. In DGM, the same coding agent is both task solver and modifier, but *how* it proposes improvements is frozen in a hand-written instruction generator. In DGM-H, task and meta logic live in one codebase, so the meta agent can change its own improvement process, not only the task policy—in principle for any computable task.

Since the hyperagent is implemented in Python, which is Turing-complete<d-footnote>A programming language is Turing-complete if, given enough resources, it can compute anything that is computable by any other general-purpose computer. Most modern languages, including Python, are Turing-complete, meaning they can theoretically simulate any other computation.</d-footnote> and can edit any part of its own codebase, it can in principle build any computable machine. Therefore, there is no ceiling on the performance of the hyperagent.

### Metacognitive self-modification

Hyperagents can improve not only how they solve tasks, but also how they generate future improvements, since the meta agent is part of the same editable program. This enables **metacognitive self-modification**—the agent can computationally update the very process that produces future updates. Drawing from cognitive science, where metacognition means thinking about and regulating one’s own thinking, Hyperagents perform this at the level of code: the meta agent can modify itself, not just the task logic. This means the process for generating improvements can itself evolve over time, independently of task performance. Unlike the original DGM architecture, which required the agent to get better at self-modification only by improving at the underlying task, Hyperagents remove this constraint: the meta agent, being just another editable component, can autonomously become better at proposing improvements, no matter what the task domain is.

This raises a natural question: if the meta agent can rewrite itself, do we now need a “meta-meta” agent to oversee those changes, and so on in an infinite hierarchy? Hyperagents resolve this by making the entire system *self-referential*. Rather than introducing higher and higher levels (meta, meta-meta, etc.), the entire program is empowered to edit itself at any level. It’s like asking, “who reviews the reviewer?” In this framework, the reviewer—and everything else—can modify itself. There is no separate hierarchy and no infinite regress, because the program is both the executor and the improver all in one.

### How DGM-Hyperagents works

The authors build **DGM-Hyperagents (DGM-H)** by extending the DGM with this idea. The open-ended exploration structure is preserved (the growing archive of agents, probabilistic parent selection, continuous accumulation of variants) but the meta-level mechanism is now editable.

The loop has two phases:

1. **Metacognitive self-modification:** A parent hyperagent from the archive generates a modified version of itself. Modifications can target any part of the codebase: task logic, meta logic, or both.

2. **Evaluation:** The new hyperagent is tested on the target tasks, scored, and added to the archive as a potential parent for future generations.

The starting point is deliberately minimal: a bash tool, a file editor, and a single LLM call doing double duty as both task solver and meta agent. No hand-coded strategies, no domain-specific prompts. The system starts from scratch and figures the rest out.<d-footnote>The  outer loop (parent selection and evaluation protocol) is kept fixed and cannot be self-modified. This is a deliberate safety choice, not a hard constraint of the framework. Keeping it fixed ensures the system cannot redefine what "better" means or game its own evaluation. The paper notes preliminary experiments where the outer loop is also modified, with comparable results, leaving full outer-loop self-modification for future work.</d-footnote>

## What DGM-H discovers on its own

What's most interesting about this paper isn't the benchmark numbers. It's what DGM-H starts building on its own. Starting from a minimal agent with no memory and no structure, DGM-H gradually invents infrastructure for doing self-improvement better. Two things stand out.

**Performance tracking:** Rather than treating each iteration as isolated, DGM-H learns to record and compare metrics across generations. This sounds obvious in retrospect, but there's nothing in the original setup that told the system it should do this. It invents a `PerformanceTracker` class (not given by engineers, but written by the system itself) that logs scores, computes moving averages, and tracks which changes actually stuck. Here's a snippet:<d-footnote>The tracker's design mirrors standard software engineering practice: instrumentation and observability. What's notable is that the system arrived at this on its own, recognizing that improvement requires memory of what worked, not just raw evaluation scores from the outer loop.</d-footnote>

```python
class PerformanceTracker:
    """Tracks performance metrics across agent generations."""
    def __init__(self, tracking_file="./outputs/performance_history.json"):
        self.tracking_file = tracking_file
        self.history = self._load_history()

    def record_generation(self, generation_id, domain, score, metadata=None):
        entry = {
            "generation_id": generation_id,
            "domain": domain,
            "score": score,
            "timestamp": datetime.now().isoformat(),
            "metadata": metadata or {}
        }
        self.history.append(entry)
        self._save_history()

    def get_improvement_trend(self, domain=None, window=5):
        """Calculate improvement trend using moving average."""
        filtered = [h for h in self.history if not domain or h.get('domain') == domain]
        if len(filtered) < window * 2:
            return None
        recent_avg = sum(h['score'] for h in filtered[-window:]) / window
        older_avg = sum(h['score'] for h in filtered[-window*2:-window]) / window
        return recent_avg - older_avg  # Positive if improving
```

**Persistent memory:** Beyond logging scores, DGM-H learns to write down synthesized insights, causal hypotheses, and plans that get consulted in future iterations. Essentially, it builds and maintains its own research journal. A real example from the paper:

> *"Gen55: best accuracy but too harsh. Gen64: improved balance but lower accuracy. Need to combine Gen55's critical reasoning with Gen64's balance."*

The system wrote that. Then acted on it.

<aside class="l-body box-important" markdown="1" title="Key insight">
Neither the performance tracker nor the persistent memory system was designed by human engineers. They emerged from DGM-H modifying its own meta agent. Crucially, both are **domain-agnostic**: they encode general principles of effective self-improvement, not facts about any specific task. This is precisely why they transfer across domains.
</aside>

## Can DGM-H really improve itself?

The paper tests DGM-H across four domains: coding, paper review, robotics reward design, and Olympiad-level math grading.

### Coding

On the Polyglot benchmark, a multi-language coding evaluation spanning 16 programming languages<d-cite key="gauthier2024polyglot"></d-cite>, DGM-H improves from 14.0% to **26.7%**. The original DGM reaches 30.7% from the same starting point, which is unsurprising: DGM was tuned specifically for coding tasks, while DGM-H incorporates no domain-specific logic. Still, a 4-point gap is a small price for generality: DGM-H is nearly as strong, without any assumptions about the task.

### Beyond coding

This is where DGM-H starts to pull away from the original DGM.

<img src="{{ '/assets/img/hyperagents-results.png' | relative_url }}" alt="DGM-H results on paper review and robotics" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 2.** Paper review (top) and robotics reward design (bottom): training (left) and test (right).
</div>

On both domains, full DGM-H tracks above the original DGM (without per-domain customization) and above ablations that remove self-improvement or open-ended exploration.

**Paper review.** The task is predicting conference acceptance decisions for ML papers.<d-footnote>The evaluation metric is Spearman correlation between the agent's predicted scores and the ground-truth accept/reject decisions. The initial agent scores 0.0 not because its predictions are wrong, but because it cannot produce outputs in the format the evaluator expects: a bare LLM call generates free-form text rather than structured scores. The original DGM fails identically; its instruction-generation logic was written to improve coding agents and has no concept of structured output for a non-coding task.</d-footnote> The initial agent scores 0.0; the original DGM, applied without customization, also scores 0.0. DGM-H, starting from the same blank slate, reaches **0.710** on the test set, beating the open-sourced baseline from AI-Scientist-v2 <d-cite key="yamada2025aiscientist"></d-cite> (0.630). Along the way, it stops doing crude prompt tweaks and builds explicit multi-stage evaluation pipelines with structured checklists and decision criteria.

**Robotics reward design.** Given a natural language description of a robot task, the agent writes a reward function. Initial score: 0.060. DGM-H's best agents reach **0.372**, surpassing the default handcrafted reward (0.348). More interestingly, DGM-H almost always discovers reward functions that make the robot jump (the correct behavior for maximizing torso height) rather than settling for simply standing tall.

A manually customized DGM variant (DGM-custom), where engineers hand-wrote domain-specific instruction-generation logic for each task, gets comparable numbers. That comparison is telling: DGM-H, without any per-domain human engineering, matches what careful human customization achieves.

The ablation studies confirm that both components are essential:<d-footnote>The ablation removes one component at a time. "DGM-H w/o self-improve" keeps open-ended exploration but fixes the meta agent, removing its ability to self-modify. "DGM-H w/o open-ended exploration" keeps self-modification but replaces the archive-based probabilistic selection with greedy selection. Both variants score 0.0 on paper review, showing that neither component alone is sufficient: effective improvement requires both the diversity from exploration and the adaptability from meta-level self-modification.</d-footnote>

| Method | Paper review (test) | Robotics (test) |
|---|---|---|
| DGM (no customization) | 0.0 | 0.0 |
| DGM-custom (human-engineered) | 0.590 | 0.348 |
| DGM-H w/o self-improve | 0.0 | 0.213 |
| DGM-H w/o open-ended exploration | 0.0 | 0.116 |
| **DGM-H (full)** | **0.710** | **0.372** |

### Meta-level transfer

The transfer experiment is where things get genuinely surprising.

DGM-H is optimized on paper review and robotics. Then, without any further modification, its meta agent is handed a completely new task: grading solutions to International Mathematical Olympiad problems (IMO-GradingBench<d-cite key="luong2025towards"></d-cite>). It has never seen this domain. To measure how good a meta agent is at generating improvements, the paper introduces **imp@k**<d-footnote>Formally, imp@k is defined as: given a starting meta agent M₀, run k iterations of metacognitive self-modification to produce candidates M₁, ..., Mₖ. The score is max<sub>i≤k</sub> score(Mᵢ) − score(M₀). This isolates the meta agent's quality as an improvement generator, independent of the task agent's initial performance.</d-footnote>: start from a given meta agent, run for k iterations, and measure the performance gain of the best discovered agent relative to the starting point.

<img src="{{ '/assets/img/hyperagents-transfer.png' | relative_url }}" alt="Meta-level transfer to IMO math grading" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 3.** Meta-level transfer to IMO-style math grading after optimizing only on paper review and robotics.
</div>

Each curve is **imp@50** starting from a meta agent *transferred* into math without further self-modification on that domain (**w/o self-improve + transfer** for the DGM-H line). The hyperagent checkpoint is the only one that gains on IMO grading; the initial and DGM-custom transfers stay flat.

The results:

- Initial meta agent: imp@50 = 0.0. It can't generate improvements for math grading at all.
- DGM-custom transfer agents: imp@50 ≈ 0.0. Their improvements were domain-specific and don't carry over.
- DGM-H transfer hyperagents: imp@50 = **0.630**.

That 0.630 from a meta agent never trained on math is the central result of this section. DGM-custom learned tricks specific to paper review and robotics. DGM-H learned *how to self-improve*, which turns out to be domain-agnostic.

### Compounding self-improvements

Transfer shows that DGM-H's meta agent generalizes. But the deeper question is whether those improvements can *build on each other*: whether running DGM-H again, starting from a prior run's output, yields more than starting fresh.

To test this, the authors take transfer hyperagents selected from prior DGM-H runs on paper review and robotics, then use them as the starting point for a brand new 200-iteration run on Olympiad-level math grading. The comparison is straightforward: does beginning from an already-improved meta agent give you a head start?

<img src="{{ '/assets/img/hyperagents-compound.png' | relative_url }}" alt="Compounding self-improvements across DGM-H runs" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 4.** IMO grading: compounding gains when starting from transfer and from a ProofAutoGrader-seeded meta agent.
</div>

On the training side (left), **DGM-H + transfer** (orange) climbs faster than **from scratch** (blue), and **+ from ProofAutoGrader** (green) starts higher and ends strongest. On the test side (right), that same green condition beats the ProofAutoGrader baseline reported by Luong et al. <d-cite key="luong2025towards"></d-cite>.

The results:

- **DGM-H from scratch**: best test-set score of 0.610 (CI: 0.510–0.680) after 200 iterations.
- **DGM-H + transfer**: best test-set score of **0.640** (CI: 0.550–0.720), a higher median and tighter upper bound.

The transfer agent consistently achieves higher median performance and higher confidence intervals. And the playing field is not level: improvements at higher performance levels are harder to come by due to saturation effects. Gaining 0.03 near 0.6 is a different proposition than gaining 0.03 near 0.1. The gains are modest in absolute terms, and meaningful in context. These results suggest that DGM-H's self-improvements are reusable: as prior runs leave behind something useful, not just a set of task-specific hacks.

## Comparison with other self-improving systems

The clearest way to situate Hyperagents is through what each system evolves and what stays fixed:

| System | What evolves | Improvement mechanism | Domain |
|---|---|---|---|
| Gödel Machine <d-cite key="schmidhuber2003godel"></d-cite> | Agent weights + code | Formal proof of benefit | Theoretical |
| DGM <d-cite key="zhang2025darwingodelmachineopenended"></d-cite> | Agent code | Fixed handcrafted prompt | Coding |
| ADAS <d-cite key="hu2025adas"></d-cite> | Agent prompts/workflows | Fixed LLM meta agent | General (fixed meta) |
| AlphaEvolve <d-cite key="deepmind2025alphaevolve"></d-cite> | Algorithms/code | Fixed evolutionary loop | Coding and math |
| AlphaZero <d-cite key="silver2017mastering"></d-cite> | Game-playing policy | Fixed self-play + RL | Games |
| **DGM-Hyperagents** <d-cite key="zhang2026hyperagents"></d-cite> | **Agent code + meta agent** | **Editable, self-modifiable** | **Any computable task** |

There's also a connection to earlier work on self-referential meta-learning <d-cite key="kirsch2022self"></d-cite>, which studied systems that learn to improve the mechanisms by which learning occurs, though in neural networks via weight updates rather than code. Hyperagents do the same thing at the program level using language models, making the approach practically applicable outside controlled training environments.

<aside class="l-body box-error" markdown="1" title="Analogy">
Imagine three research labs. The DGM lab does great coding research, but its management philosophy (hiring, resource allocation, what to study) was set at founding and never revisited. The ADAS lab brings in a consultant to reorganize periodically, but the consultant never gets better at consulting. The Hyperagents lab can redesign not just its research agenda but its own management processes based on what's actually worked. Over time, it gets better at getting better.
</aside>

## Can we trust an AI that improves its own improvement?

The safety considerations for DGM-H are meaningfully more complex than those for the DGM. In the DGM, the concern was that agents might game their evaluation metrics, for instance by [hallucinating test results](https://richardcsuwandi.github.io/blog/2025/dgm/#can-we-trust-a-self-improving-ai). In DGM-H, the concern goes one level higher: an agent that can modify its meta agent could in principle modify how it evaluates itself, or what it decides to improve next.

<aside class="l-body box-warning" markdown="1" title="The alignment question, one level up">
In the [DGM post](https://richardcsuwandi.github.io/blog/2025/dgm/#can-we-trust-a-self-improving-ai), we saw [Goodhart's Law](https://en.wikipedia.org/wiki/Goodhart%27s_law) show up at the task level: the agent faked test results rather than passing them. In DGM-H, the same risk appears one level higher. A meta agent that can modify *how it evaluates progress* could redefine what "improvement" means in ways that look fine on the outer metric but drift from what we actually want. The fixed outer loop is the current answer, not a permanent one.
</aside>

The authors address this through several practical safeguards: sandboxed execution with enforced resource limits, restricted internet access, a fixed outer loop that the system cannot modify, and full lineage tracing for every change.<d-footnote>The lineage tracing is especially important here. Every modification is recorded, so in principle you can audit exactly what modified what, when, and why. Whether this is sufficient at larger scales is a separate question.</d-footnote>

But there's a harder question underneath. As these systems improve faster, human oversight may not scale. The speed of self-improvement could outpace the speed at which humans can meaningfully audit or correct what's happening. The authors name this directly rather than glossing over it.

There's something worth dwelling on: the outer loop stays fixed not because it's technically necessary, but because making it editable would make the whole thing harder to trust. That tradeoff is central to the challenge. We might call it a recursive alignment problem: just as we need AI systems to stay aligned as they improve at tasks, we also need them to stay aligned as they improve at *improving*. Sandboxing and human oversight are a reasonable first step, but they're not a long-term answer.

## Takeaways

Look at what this line of work has been doing, step by step. The [Gödel Machine](https://en.wikipedia.org/wiki/G%C3%B6del_machine) asked: *can an AI rewrite itself when it can prove the rewrite is better?* DGM asked: *can it skip the proof and just try?* Hyperagents ask: *can it get better at trying?* Each step moves the whole question up a level, rather than refining the previous answer. The ceiling keeps moving.

Three open questions feel most pressing to me. Can we read what the meta agent has actually *learned* about how to improve, not just what changes it made? Lineage trees give us a record; they don't give us mechanistic understanding. Do the compounding gains keep building, or do they saturate? One domain hop is not enough to know. And who designs the next outer loop? As these systems grow more capable in domains humans understand less well, keeping the evaluation protocol human-engineered is both the safest and the most limiting choice. At some point those two things will be in direct tension.

In the [DGM post](https://richardcsuwandi.github.io/blog/2025/dgm/), I framed that work as an early step toward [Life 3.0](https://en.wikipedia.org/wiki/Life_3.0): intelligence that can redesign not just its behavior but its underlying architecture. Hyperagents take this one step further. DGM was about redesigning the design. This is about redesigning the designer. The scale is still modest, the outer loop still depends on human judgment, and a lot of the hard questions remain open. But a system that started with a bash tool and a single LLM call invented its own infrastructure for self-improvement, then transferred it to a domain it had never seen. Whether the process of improvement can itself become open-ended is the right question now, and I don't think we know the answer yet.


## Citation

If you find this post useful, please cite it as:

<div class="citation-box">
Suwandi, R. C. (Mar 2026). AI That Evolves Its Own Evolution. Posterior Update. https://richardcsuwandi.github.io/blog/2026/hyperagents/.
</div>

Or in BibTeX format:

```bibtex
@article{suwandi2026hyperagents,
    title   = "AI That Evolves Its Own Evolution",
    author  = "Suwandi, Richard Cornelius",
    journal = "Posterior Update",
    year    = "2026",
    month   = "Mar",
    url     = "https://richardcsuwandi.github.io/blog/2026/hyperagents/"
}
```
