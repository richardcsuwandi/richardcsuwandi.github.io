---
layout: distill
title: The Science of Intelligent Exploration
date: 2025-07-23 10:00:00 +0700
description: Why we need to re-center exploration in AI
tags: [OPEN-ENDEDNESS, EXPLORATION]
giscus_comments: true
related_posts: false
thumbnail: /assets/img/flashlight.png
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
bibliography: 2025-07-23-exploration-in-ai.bib

# Add a table of contents to your post.
#   - make sure that TOC names match the actual section names
#     for hyperlinks within the post to work correctly.
#   - please use this format rather than manually creating a markdown table of contents.
toc:
  - name: Embracing the unexpected
  - name: Beyond a single solution
  - name: Towards endless innovation
  - name: A path to general intelligence
    subsections:
      - name: Meta-learning architectures
      - name: Meta-Learning learning algorithms
      - name: Generating effective learning environments
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
One of the most thought-provoking moments for me at [ICML 2025](https://icml.cc/) didn’t come from a new architecture or a scaling law. It emerged from a simple, unsettling question: What happens when AI stops exploring? Recent breakthroughs in AI—especially in LLMs—have been fueled not by curiosity, but by curation. By training on vast swaths of human-generated text, models like LLMs bypass the messy, uncertain process of active exploration. Instead, they absorb a pre-digested version of our collective knowledge, effectively "pre-exploring" the world through the lens of what’s already been written. While these models can recombine, paraphrase, and simulate, they rarely discover new things. This is the core mission of the [Exploration in AI Today (EXAIT)](https://exait-workshop.github.io/) Workshop at ICML 2025: to confront the quiet crisis of over-exploitation and re-center exploration to enable progress in modern AI. Because whether it’s a robot learning to walk, a recommender system fighting filter bubbles<d-footnote>"Filter bubbles" refers to the phenomenon where users are only shown familiar content.</d-footnote>, or an AI searching for a drug in a vast space of possible molecules, the path to breakthroughs isn’t paved by more data alone. In this post, we will explore the science of intelligent exploration, from the basics of novelty search to the cutting-edge of open-endedness.

<img src="{{ '/assets/img/exait.png' | relative_url }}" alt="EXAIT Workshop" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 1.** List of research questions at the [EXAIT](https://exait-workshop.github.io/) Workshop at ICML 2025.
</div>

## Embracing the unexpected

Let's start with a counterintuitive concept that flips traditional optimization on its head: novelty search<d-cite key="lehman2011abandoning"></d-cite>. Imagine trying to solve a maze by obsessively chasing the exit, only to hit dead end after dead end. Now imagine wandering the maze, seeking out new paths regardless of the goal—and stumbling upon the exit by accident. This is the essence of novelty search, a paradigm that prioritizes exploring new behaviors over optimizing for a specific objective<d-footnote>Novelty search algorithms work by defining a behavior characterizatio (BC)—a set of features that describe how an agent behaves, not just what it achieves. For a robot, this might be the sequence of positions it visits; for a neural network, it could be the activation patterns it produces.</d-footnote>. The novelty of a new solution is measured by its distance (typically Euclidean) from previously discovered behaviors in this BC space. The algorithm maintains an **archive** of all discovered behaviors and calculates novelty as::

$$\text{Novelty}(x) = \frac{1}{k} \sum_{i=1}^{k} \text{distance}(x, x_i)$$

where $k$ is the number of nearest neighbors in the archive. This encourages agents to venture into unexplored regions of behavior space, creating a diverse portfolio of solutions.

In a classic maze experiment<d-cite key="lehman2008exploiting"></d-cite>, algorithms chasing rewards failed to escape complex mazes, getting trapped in local optima. But those maximizing novelty—exploring diverse paths without fixating on the goal—succeeded. Why? Because chasing ambitious objectives can lead to **deception**, where the objective function becomes a false compass. Consider the "deceptive maze" where the path to the goal requires initially moving away from it. Traditional fitness-based search gets trapped in dead ends that appear promising (high fitness) but lead nowhere. Novelty search, by ignoring the goal entirely, naturally explores the entire maze and discovers the true path.

<img src="{{ '/assets/img/fitness_vs_novelty.png' | relative_url }}" alt="Fitness vs Novelty" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 1.** Novelty search vs fitness-based search in a maze.
</div>

The stepping stones to success often look nothing like the goal itself. For example, the path from abacuses to laptops involved seemingly unrelated innovations like electricity and vacuum tubes. An interesting experiment that demonstrates this is [Picbreeder](https://nbenko1.github.io/#/), a platform where users evolve images through novelty search. A user aiming for a car might end up with a spaceship-like form that, through further exploration, morphs into a car. The lesson? Ignoring the objective can sometimes get you there faster.

<img src="{{ '/assets/img/picbreeder.png' | relative_url }}" alt="Picbreeder" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 2.** What Picbreeder shows: The stepping stones almost never resemble the final product! You can only find things by not looking for them.
</div>

But novelty alone isn’t enough. What if we could balance exploration with quality? That's where quality diversity comes in.

## Beyond a single solution

While novelty search embraces exploration, quality diversity (QD) takes it a step further by seeking diverse solutions that are also high-performing. Instead of finding a single "best" solution, QD algorithms like MAP-Elite<d-cite key="mouret2015illuminating"></d-cite> or Go-Explore<d-cite key="ecoffet2019go"></d-cite> illuminate the entire space of possibilities, collecting a portfolio of solutions that solve a problem in different ways. The MAP-Elites<d-cite key="mouret2015illuminating"></d-cite> discretizes the behavior space into a grid (the "map"), with each cell representing a unique combination of behavioral features. The algorithm seeks to fill each cell with the highest-performing solution found for that behavior type, creating a diverse "archive" of elite solutions. The process is elegantly simple:

1. **Initialize**: Create an empty map with predefined behavioral dimensions
2. **Generate**: Create new solutions through mutation or crossover
3. **Evaluate**: Measure both performance (fitness) and behavior characteristics
4. **Place**: Assign each solution to its corresponding map cell
5. **Select**: Keep only the best-performing solution in each cell
6. **Repeat**: Continue until the map is sufficiently filled

<img src="{{ '/assets/img/map_elites.png' | relative_url }}" alt="MAP-Elites" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 3.** MAP-Elites in action.
</div>

The result is a comprehensive "atlas" of high-quality solutions across the entire behavioral landscape<d-footnnote>This connects to the concept of **illumination**—the goal is not just to find good solutions, but to understand the entire fitness landscape.</d-footnnote>. This approach answers the question: "What is the best possible performance achievable for each way of solving this problem?" By explicitly maintaining diversity, they prevent the population from collapsing to a single solution type<d-footnote>This is also known as "premature convergence" or "convergence to a local optimum" in the context of optimization.</d-footnote>.

One of QD's most striking successes came in robotics, where MAP-Elites generated diverse walking gaits for six-legged robots<d-cite key="cully2015robots"></d-cite>. When a robot loses a leg, it can immediately switch to a pre-evolved gait adapted to that specific damage pattern—recovering in under two minutes without any learning or simulation.

{% include youtube.html id="KFDMm666QBU" %}

Another notable QD algorithm is Go-Explore<d-cite key="ecoffet2019go"></d-cite>. Go-Explore works in two phases: first, it systematically explores and remembers promising states—even those that seem irrelevant at first. Then, in a second phase, it robustifies these solutions to ensure they work reliably in the real, noisy environment. By explicitly separating exploration from exploitation, Go-Explore was able to crack [Montezuma's Revenge](https://en.wikipedia.org/wiki/Montezuma%27s_Revenge_(video_game)), discovering not just one way to win, but mapping out a constellation of valuable approaches.

{% include youtube.html id="L_E3w_gHBOY" %}

Yet, QD still operates within a finite, predefined domain. What if we could go beyond finding what's possible and start inventing new possibilities? This brings us to open-ended algorithms.

## Towards endless innovation

Open-ended algorithms aim to mimic the boundless creativity of natural evolution or human culture. Unlike traditional algorithms that converge on a solution, open-ended systems **diverge**, endlessly generating new challenges and solving them. The goal? To keep learning and innovating, no matter how much time or compute is available.

<div class="box-note" markdown="1" title="Note">
Interested readers can refer to my previous [post](https://richardcsuwandi.github.io/blog/2025/open-endedness/) for a comprehensive overview of open-endedness.
</div>

A prime example of modern open-endedness is the [Paired Open-Ended Trailblazer (POET)](https://www.uber.com/en-HK/blog/poet-open-ended-deep-learning/)<d-cite key="wang2019paired"></d-cite> algorithm. POET creates a dynamic ecosystem of tasks and agents, where each agent evolves to tackle new challenges generated by the system itself. The process is as follows:

1. **Environment Generation**: Create new training environments by mutating existing ones (e.g., changing terrain difficulty, adding obstacles)
2. **Agent Training**: Each environment trains its own population of agents using standard RL
3. **Transfer Evaluation**: Regularly test agents on environments other than their native ones
4. **Selective Transfer**: Move high-performing agents to environments where they can contribute
5. **Environment Selection**: Preserve environments that are "minimal criteria" (not too easy, not impossibly hard)

{% include youtube.html id="D1WWhQY9N4g" %}

The most interesting part lies in the **co-evolutionary arms race**: as agents get better, environments become more challenging; as environments become harder, agents must develop more sophisticated strategies. Open-endedness is about more than solving problems—it's about creating a system that generates its own problems and learns from them. This brings us to the next frontier: AI-generating algorithms (AI-GAs)<d-cite key="clune2019ai"></d-cite>.

## A path to general intelligence

In his 2019 paper, Jeff Clune proposed AI-GAs as a path to AGI, built on three pillars:

1. **Meta-learning architectures**: Automatically designing neural network structures tailored to specific tasks.
2. **Meta-learning learning algorithms**: Evolving the rules of learning itself, like how gradients are updated.
3. **Generating effective learning environments**: Creating diverse, challenging environments to train AI systems.

### Meta-learning architectures

Traditional [neural architecture search (NAS)](https://en.wikipedia.org/wiki/Neural_architecture_search) focuses on finding good architectures for specific datasets. AI-GA approaches go further by evolving architectures that can quickly adapt to new tasks. Recent examples include:

- **ENAS (Efficient neural architecture search)**<d-cite key="pham2018efficient"></d-cite>: Uses reinforcement learning to discover architectures, dramatically reducing search time from thousands to single GPU-days.
- **DARTS (Differentiable architecture search)**<d-cite key="liu2018darts"></d-cite>: Makes architecture search differentiable, enabling gradient-based optimization of network topology.
- **AutoML-Zero**<d-cite key="real2020automl"></d-cite>: Evolves entire machine learning algorithms from scratch, starting with mathematical primitives and building up to complex architectures and optimizers.

<div class="box-important" markdown="1" title="Insight">
Instead of hand-designing architectures, let evolution discover designs optimized for specific problem classes or computational constraints.
</div>

### Meta-learning learning algorithms

This involves evolving not just what the network learns, but *how* it learns. Examples include:

- **Learned optimizers**<d-cite key="metz2019understanding"></d-cite>: Instead of using SGD or Adam, train neural networks to optimize other neural networks. These "learned optimizers" can adapt their strategy based on the loss landscape.
- **Meta-learning with gradient descent**<d-cite key="finn2017model"></d-cite>: Model-agnostic meta-learning (MAML) trains models to be good at learning new tasks with just a few gradient steps.
- **Evolutionary strategy for RL**<d-cite key="salimans2017evolution"></d-cite>: Replace backpropagation entirely with evolution strategies that can discover entirely new learning rules.

### Generating effective learning environments

Traditional AI training has relied on fixed datasets or hand-crafted environments. While this approach has enabled progress, it is fundamentally limited: hand-coding environments is brittle, and it is notoriously difficult to define what makes a task "interesting" or "useful" for learning. Early attempts to automate environment generation often used simple heuristics, such as:

- **Goldilocks Principle**: Environments should be neither too easy (boring) nor too hard (impossible)
- **Learning progress**: Prioritize environments where agents are improving fastest
- **Behavioral diversity**: Generate environments that elicit different behaviors

But these approaches often miss the nuanced understanding of what makes a problem genuinely interesting or valuable for developing intelligence. A recent example is [OMNI](https://www.jennyzhangzt.com/omni)<d-cite key="zhang2023omni"></d-cite><d-cite key="faldor2024omni"></d-cite>. OMNI uses foundation models (FMs) to propose and implement new reinforcement learning tasks that maximize agent learning progress and align with human intuitions about what is "interesting." The core idea is to use the FM's broad knowledge<d-footnote>FMs are trained on vast swaths of the internet, and they implicitly understand what humans find interesting—they've read our blogs, tweets, and papers, after all.</d-footnote> to guide the creation of a diverse and ever-expanding set of environments.

<img src="{{ '/assets/img/omni.png' | relative_url }}" alt="OMNI" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 4.** OMNI combines a learning progress auto-curriculum and a model of interestingness, to train an RL agent in a task-conditioned manner.
</div>

Despite this, OMNI is still fundamentally limited by the scope of their environment generators—typically confined to a narrow, predefined distribution of tasks. This limitation restricts the true potential of open-ended learning, which aspires to create agents capable of tackling an unbounded variety of challenges. On the other hand, the grand vision of open-endedness in AI is to continuously generate and solve increasingly complex and diverse tasks, much like the creative explosion seen in biological evolution and human culture Achieving this would require algorithms that can operate within a truly vast—ideally infinite—space of possible environments. A key concept here is Darwin Completeness.

<div class="box-note" markdown="1" title="Definition">
Darwin Completeness is the ability of an environment generator to, in principle, create *any* possible learning environment. This means not just tweaking parameters within a fixed simulator, but being able to generate entirely new worlds, rules, and reward structures.
</div>

[OMNI-EPIC](https://omni-epic.vercel.app/)<d-cite key="faldor2024omni"></d-cite> is a recent framework that takes a major step toward Darwin Completeness. It augments the OMNI approach by leveraging foundation models not just to select the next interesting and learnable task, but also to generate the code for entirely new environments and reward functions. In OMNI-EPIC, the FM can write Python code to specify new simulated worlds, define novel reward and termination conditions, and even modify or create new simulators if needed. This enables OMNI-EPIC to, in principle, generate any computable environment—ranging from physical obstacle courses to logic puzzles or even quests in virtual worlds.

<img src="{{ '/assets/img/omni-epic.jpeg' | relative_url }}" alt="OMNI-EPIC" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 5.** Examples of environments generated by OMNI-EPIC. All of these are generated using only 3 initial seeds!
</div>

Another notable advance in this direction is Genie<d-cite key="bruce2024genie"></d-cite>, a foundation world model developed by Google DeepMind. Genie, and especially its latest version [Genie 2](https://deepmind.google/discover/blog/genie-2-a-large-scale-foundation-world-model/), represents a significant leap forward in the automatic generation of diverse, interactive environments for both human and AI agents. Genie 2 is designed to generate an endless variety of action-controllable, playable 3D environments from a single prompt image. Unlike earlier world models that were limited to narrow domains or 2D settings, Genie 2 can create rich, fully interactive 3D worlds<d-footnote>These environments are not just visually diverse—they are also physically consistent and can be explored and manipulated by agents in real time.</d-footnote> with emergent properties such as object interactions, complex character animations, realistic physics (including gravity, water, smoke, and lighting effects), and dynamic environmental responses. A key feature of Genie 2 is its ability to rapidly prototype new interactive experiences. Researchers and designers can prompt Genie 2 with concept art, drawings, or even real-world images, and the model will generate a corresponding 3D world that can be immediately explored by an agent<d-footnote>This enables a new workflow for environment design, where creative ideas can be quickly tested and iterated upon, dramatically accelerating the pace of research and development.</d-footnote>.

<video src="{{ '/assets/img/genie2_image.mp4' | relative_url }}" alt="Genie 2" class="center" width="100%" autoplay muted loop controls>
  Your browser does not support the video tag.
</video>
<div class="l-gutter caption" markdown="1">
**Figure 6.** From concept art and drawings to fully interactive environments.
</div>

To showcase the power of Genie 2, DeepMind introduced [SIMA](https://deepmind.google/discover/blog/sima-generalist-ai-agent-for-3d-virtual-environments/)<d-cite key="raad2024scaling"></d-cite>, a generalist agent capable of following natural language instructions and acting within a wide range of Genie-generated environments. SIMA can be given high-level goals—such as "open the blue door" or "go up the stairs"—and will control an avatar using keyboard and mouse inputs to accomplish these tasks, even in worlds it has never seen before.

<video src="{{ '/assets/img/sima.mp4' | relative_url }}" alt="SIMA" class="center" width="100%" autoplay muted loop controls>
  Your browser does not support the video tag.
</video>
<div class="l-gutter caption" markdown="1">
**Figure 7.** SIMA can follow natural language instructions in an unseen environment. The environment is generated via a single prompt image using [Imagen](https://imagen.research.google/) and turned into a 3D world by Genie 2.
</div>

<div class="box-warning" markdown="1" title="Remark">
The combination of a powerful environment generator and an agent forms a virtuous cycle: as the environment generator creates new worlds, the agent must adapt and learn, and their progress can be used to further refine both the agent and the environment generation process.
</div>

## Takeaways

The science of intelligent exploration is at the heart of progress in all domains where discovery, creativity, and adaptation matter-including AI. We have just seen that breakthroughs rarely come from following a single, well-trodden path. Instead, they emerge from venturing into the unknown, embracing diversity, and allowing for serendipity and surprise. As AI advances, the most powerful and resilient systems will be those that do not just optimize for what is already known, but continuously seek out the adjacent possible, illuminate new landscapes, and expand the boundaries of what is achievable. To build the next generation of intelligent systems, we must treat exploration not as an afterthought, but as a scientific principle—a driving force for innovation, robustness, and true generality. The future belongs to those who explore. Let us design AI that does the same.

## Citation

If you find this post useful, please cite it as:

<div class="citation-box">
Suwandi, R. C. (Jul 2025). The Science of Intelligent Exploration. Posterior Update. https://richardcsuwandi.github.io/blog/2025/exploration-in-ai/.
</div>

Or in BibTeX format:

```bibtex
@article{suwandi2025explorationai,
    title   = "The Science of Intelligent Exploration",
    author  = "Suwandi, Richard Cornelius",
    journal = "Posterior Update",
    year    = "2025",
    month   = "Jul",
    url     = "https://richardcsuwandi.github.io/blog/2025/exploration-in-ai/"
}
```