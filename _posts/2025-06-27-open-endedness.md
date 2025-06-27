---
layout: distill
title: The future of AI is open-ended
date: 2025-06-27 10:00:00 +0700
description: Embracing open-endedness in the pursuit of creative AI
tags: [AGENTS, OPEN-ENDEDNESS]
giscus_comments: true
related_posts: false
thumbnail: /assets/img/what_if.png
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
bibliography: 2025-06-27-open-endedness.bib

# Add a table of contents to your post.
#   - make sure that TOC names match the actual section names
#     for hyperlinks within the post to work correctly.
#   - please use this format rather than manually creating a markdown table of contents.
toc:
  - name: The endless creativity of nature
  - name: What is open-endedness?
  - name: The quest for open-endedness
    subsections:
      - name: The cybernetic dreamers (1940s-50s)
      - name: The evolution revolution (1960s-70s)
      - name: The artificial life explosion (1980s-90s)
      - name: The modern renaissance (2010s-2020s)
  - name: Why today's AI hits walls (and how open-endedness may break them)
  - name: Open-endedness in action
    subsections:
      - name: Voyager
      - name: The AI Scientist
      - name: AI-Generating Algorithms
  - name: Research frontiers
  - name: Safety in an open-ended world
  - name: The future of AI is open-ended
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
    content: "Python";
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

  html[data-theme='dark'] pre::before {
    background-color: rgba(255,255,255,0.1);
    color: #a0aec0;
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
Why do humans keep inventing new musical genres, designing cities that float on water, and imagining life beyond our universe? It’s because we've inherited nature’s restless, boundary-pushing creativity. We are an **open-ended species**: driven by curiosity, dissatisfied with "good enough", and always reaching for what’s next. But here’s the catch: most of our AI systems today are not open-ended. They’re built for specific tasks, optimized for efficiency rather than exploration. While this approach has taken us far, researchers at Google DeepMind recently argued<d-cite key="hughes2024position"></d-cite> that it won’t be enough to reach artificial superintelligence (ASI). So, the big question is: 

> Can we teach AI to be as endlessly creative as nature itself?

In this post, we’ll dive into the fascinating world of open-ended AI and explore how embracing open-endedness might finally break through the walls of today’s AI systems.

## The endless creativity of nature

Before we talk about AI, let's take a moment to appreciate the masterpiece that is biological evolution. Over 3.5 billion years, evolution has produced an almost unimaginable diversity of life forms. From extremophile bacteria that party in boiling volcanic vents to the 86 billion neurons in your brain that somehow let you understand these words, nature has been running the ultimate open-ended algorithm. What makes evolution so special? It's the ultimate improvisational artist. There's no predetermined goal, no final "perfect organism" to achieve, no optimization objective written in stone. Instead, evolution continuously explores the space of possible life forms through three deceptively simple ingredients:
- **Variation** (mutation and recombination create new possibilities)
- **Selection** (the environment acts as a brutal but fair critic)  
- **Retention** (successful innovations become building blocks for the next experiment)

This process has given us everything from the compound eyes of dragonflies (which inspired fiber optic technology) to the echolocation abilities of bats (which influenced radar development) to the language capabilities of humans (which... well, led to this blog post). Each innovation becomes a stepping stone for further exploration, creating an open-ended spiral of increasing complexity and capability. But perhaps most remarkably, evolution never gets "stuck" in local optima for long. When faced with mass extinctions (e.g., ice ages, asteroid impacts, dramatic atmospheric changes), life doesn't just survive, it reinvents itself. Not through careful planning, but through relentless exploration of what Stuart Kauffman calls ["the adjacent possible"](https://www.youtube.com/watch?v=nEtATZePGmg). Thus, evolution is basically the universe's way of asking: "I wonder what would happen if...?", and now imagine if we could capture even a fraction of this creative restlessness in our AI systems. This is where open-endedness comes in.

## What is open-endedness?
Imagine you're playing with LEGO blocks. A *closed system* is like following the instruction manual to build the exact model shown on the box — step by step, brick by brick. You follow steps 1–47, and voilà: you’ve built a sleek-looking car that looks just like everyone else’s.

<img src="{{ '/assets/img/lego.jpeg' | relative_url }}" alt="LEGO bricks" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 1.** A pile of LEGO bricks.
</div>

But an *open-ended system* is what happens when you toss the instructions aside and let curiosity take the wheel. You start building a car, but then wonder: "What if it could fly?" So you add propellers. Then you think, "What if it could go underwater too?" So you give it fins and a submersible dome. Before long, you’ve created something entirely new — a flying, diving, transforming vehicle that reconfigures itself depending on where it is. The beauty of open-endedness is this endless sense of possibility — no fixed goal, no final answer. Just a continuous chain of ideas sparking even better ones.

More formally, researchers from Google DeepMind define a system as open-ended if it continuously produces artifacts that are both **novel** (new and different) and **learnable** (useful and comprehensible)<d-cite key="hughes2024position"></d-cite>. Think of it as the sweet spot between pure randomness (novel but useless) and pure repetition (learnable but boring).

<div class="box-note" markdown="1" title="Novelty">
The artifacts must be genuinely new or different from what came before. This could mean statistical novelty (different from the training distribution) or functional novelty (performing new behaviors or solving problems in unexpected ways).
</div>

<div class="box-important" markdown="1" title="Learnability">
The observer must be able to learn something useful from the artifacts. Random noise might be novel, but it's not learnable. The artifacts should provide insights, capabilities, or stepping stones for further development.
</div>

But here's where it gets interesting: open-endedness is fundamentally **observer-dependent**. What seems groundbreaking to a beginner might be trivial to an expert, and vice versa.

<img src="{{ '/assets/img/novelty_learnability.png' | relative_url }}" alt="Human-AI open-ended system" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 2.** Open-endedness is in the eye of the beholder. The same aircraft design system produces different levels of novelty and learnability for different observers.
</div>

Consider a system that generates aircraft designs. For a mouse, these flying machines might be utterly novel but completely incomprehensible. For a human aerospace engineer, they hit that sweet spot of being both novel and learnable. But for a hypothetical superintelligent alien civilization, even our most advanced designs might seem as primitive as paper airplanes.

<div class="box-warning" markdown="1" title="Remark">
This observer-dependence isn't a bug, it's a feature! It means that as we build more capable AI systems, they can continue to surprise and teach us in ways we never expected.
</div>

## The quest for open-endedness

The quest for open-ended AI isn't new. In fact, it has been a dream of computer scientists for decades. Let me take you on a whirlwind tour through the key milestones that brought us to where we are today.

### The cybernetic dreamers (1940s-50s)

It all started with [Norbert Wiener](https://en.wikipedia.org/wiki/Norbert_Wiener) in the 1940s, who introduced the concept of cybernetics<d-cite key="wiener1948cybernetics"></d-cite> – self-regulating systems that could adapt through feedback loops. Around the same time, [John von Neumann](https://en.wikipedia.org/wiki/John_von_Neumann) was dreaming up self-replicating automata<d-cite key="neumann1966theory"></d-cite> that could evolve beyond their initial programming. These pioneers laid the theoretical groundwork for machines that could grow and adapt, but the technology wasn't quite there yet<d-footnote> Ironically, Wiener himself was skeptical about AI. He particularly doubted the feasibility of mechanical translation, given the ambiguous nature of language and its emotional connotations.</d-footnote>.

### The evolution revolution (1960s-70s)

[John Holland](https://en.wikipedia.org/wiki/John_Henry_Holland) changed everything in the 1970s with genetic algorithms<d-cite key="holland1992adaptation"></d-cite>. For the first time, we had a computational process that could evolve solutions through variation, selection, and retention – just like biological evolution, but in silicon. It was a proof of concept that machines could indeed create endless novelty.

### The artificial life explosion (1980s-90s)

The 1980s and 90s saw the birth of [Artificial Life (ALife)](https://en.wikipedia.org/wiki/Artificial_life), spearheaded by researchers like [Christopher Langton](https://en.wikipedia.org/wiki/Christopher_Langton). But the real showstopper was [Thomas Ray's](https://en.wikipedia.org/wiki/Thomas_S._Ray) [Tierra](https://web.stanford.edu/class/sts129/Alife/html/Tierra.htm), a digital world where self-replicating programs evolved through natural selection. Notably, Tierra had no explicit optimization function, the fitness function was determined purely by survival and reproduction.

<img src="{{ '/assets/img/tierra.mp4' | relative_url }}" alt="Tierra" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 3.** Tierra, a virtual ecosystem where digital organisms could reproduce, mutate, and compete for computational resources. These digital creatures evolved increasingly sophisticated survival strategies, including parasitism, immunity, and even altruism, all without any explicit programming for these behaviors!
</div>

### The modern renaissance (2010s-2020s)

Fast forward to the 2010s, and we hit the modern era of open-ended AI. Generative Adversarial Networks (GANs)<d-cite key="goodfellow2014generative"></d-cite> showed us how two neural networks could engage in an endless creative arms race, generating increasingly realistic images through adversarial competition. Then came [AlphaGo and AlphaZero](https://en.wikipedia.org/wiki/AlphaGo)<d-cite key="silver2016mastering,silver2017mastering"></d-cite>, which didn't just master board games, they invented entirely new strategies that human experts had never conceived. Move 37 in AlphaGo's match against Lee Sedol wasn't just a game-winning move; it was a moment when a machine demonstrated genuine creativity.

<img src="{{ '/assets/img/move37.jpg' | relative_url }}" alt="Move 37" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 4.** Move 37, the famous move in AlphaGo's match against Lee Sedol that changed the course of AI history.
</div>

## Why today's AI hits walls (and how open-endedness may break them)

Most AI systems today follow a predictable pattern: they are trained to optimize for a specific objective, and then they are deployed to solve that problem. This is a very efficient way to solve problems, but it has a few limitations. As [Kenneth Stanley](https://www.kennethstanley.net/) and [Joel Lehman](https://joellehman.com) brilliantly articulate in "Why Greatness Cannot Be Planned"<d-cite key="stanley2015greatness"></d-cite>, this goal-oriented approach creates the so-called *objective deception*, such that the pursuit of specific goals often leads us away from more interesting discoveries. Once these systems reach their optimization target, they become what I call *intellectual fossils* – perfectly preserved specimens that can't evolve further. Their capabilities are frozen at the moment their training ended, unable to learn from new experiences or develop novel skills.

Open-ended systems offer an elegant escape from these limitations. Instead of optimizing for fixed objectives, they embrace what we might call "productive uncertainty", or the willingness to explore without knowing exactly what they're looking for. Here's how open-endedness may break through each barrier:
- Open-ended systems don't just solve predefined problems; they discover new problems worth solving. They develop meta-skills – abilities to learn, adapt, and transfer knowledge across domains. Instead of being chess grandmasters, they become learning machines that can master new games.
- Rather than pursuing specific objectives, open-ended systems use what Stanley calls "novelty search" and "quality-diversity" approaches. They ask "What's interesting?" rather than "What optimizes metric X?" This shift in perspective allows them to discover valuable capabilities that no human would have thought to optimize for directly.
- Open-ended systems treat every achievement as a stepping stone rather than a destination. When they master one skill, they use it as a foundation for exploring new challenges. They exhibit what researchers call *continual learning*<d-cite key="wang2024comprehensive"></d-cite>, the ability to keep growing throughout their operational lifetime.

<div class="box-important" markdown="1" title="Insight">
The shift from goal-oriented to open-ended AI isn't just a technical upgrade. It's a fundamental reimagining of what AI can be. Instead of tools that solve known problems efficiently, we're building partners that can help us discover problems we never knew existed and solutions we never imagined possible.
</div>

## Open-endedness in action
Enough theory let's see open-endedness in action! Below are some of the most exciting demonstrations of open-ended AI systems that I have come across.

### Voyager
Our first example is [Voyager](https://github.com/MineDojo/Voyager)<d-cite key="wang2023voyager"></d-cite>, an AI agent that explores Minecraft with endless curiosity. Unlike traditional game AI that follows scripted behaviors, Voyager is powered by large language models (specifically GPT-4) and consists of three key innovations: an automatic curriculum that maximizes exploration, a growing skill library that stores reusable code for complex behaviors, and an iterative prompting system that incorporates feedback to improve performance. What makes Voyager special is its ability to learn continuously without human intervention - it sets its own goals, acquires diverse skills, and makes novel discoveries through pure experimentation. The results are impressive: compared to previous approaches, Voyager collects 3.3x more unique items, travels 2.3x further, and reaches key technological milestones up to 15.3x faster. Most importantly, the skills it develops are interpretable, compositional, and transferable to new scenarios. Voyager can take what it learns in one Minecraft world and apply those capabilities to solve novel challenges in entirely new environments, demonstrating true open-ended learning.

<img src="{{ '/assets/img/voyager.mp4' | relative_url }}" alt="Voyager" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 5.** Voyager, an AI agent that explores Minecraft with endless curiosity.
</div>

### The AI Scientist

Perhaps the most ambitious demonstration of open-endedness is [The AI Scientist](https://github.com/SakanaAI/AI-Scientist)<d-cite key="lu2024ai"></d-cite>, developed by [Sakana AI](https://sakana.ai/ai-scientist/) in collaboration with the University of Oxford and University of British Columbia. This groundbreaking system represents the first comprehensive framework for fully automatic scientific discovery, enabling foundation models to perform research independently across the entire research lifecycle. The AI Scientist automates four main processes: 
- **Idea generation** (brainstorming novel research directions and checking novelty via Semantic Scholar)
- **Experimental iteration** (executing experiments and generating visualizations)
- **Paper write-up** (producing complete manuscripts in LaTeX)
- **Automated peer review** (evaluating papers with near-human accuracy)

<img src="{{ '/assets/img/ai-scientist.png' | relative_url }}" alt="AI Scientist" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 6.** The AI Scientist automates the full research cycle: brainstorming ideas, implementing algorithms, running experiments, writing papers, and conducting peer review - all while learning from previous iterations to improve future research.
</div>

Remarkably, the system generates complete research papers at approximately $15 per paper, demonstrating both the cost-effectiveness and scalability of AI-driven research. In its initial demonstration, The AI Scientist successfully conducted research across diverse machine learning subfields, discovering novel contributions in diffusion models, transformers, and grokking. The generated papers achieved "Weak Accept" ratings from automated reviewers based on top-tier conference standards, with some proposing genuinely interesting new directions backed by solid experimental results. While critics argue about the quality of its output, [they're missing the bigger picture](https://x.com/AcerbiLuigi/status/1823714921512886510): this represents the first step toward AI systems that can discover genuinely new knowledge without human guidance, potentially democratizing research and significantly accelerating scientific progress.

Even more impressively, The AI Scientist-v2<d-cite key="yamada2025ai"></d-cite> has recently achieved a historic milestone by becoming the first entirely AI-generated system to produce a peer-review-accepted [workshop paper at ICLR 2025](https://sakana.ai/ai-scientist-first-publication/). This next-generation system eliminates reliance on human-authored code templates, generalizes across diverse ML domains, and employs a novel progressive agentic tree-search methodology. Enhanced with Vision-Language Model feedback loops for iterative refinement, one of its three submitted manuscripts exceeded the average human acceptance threshold – marking the first instance of a fully autonomous AI paper successfully navigating peer review.

<img src="{{ '/assets/img/ai-scientist-v2.png' | relative_url }}" alt="AI Scientist" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 7.** An example of a peer-review-accepted paper generated by The AI Scientist-v2. This paper reported a negative result that The AI Scientist encountered while trying to innovate on novel regularization methods for training neural networks that can improve their compositional generalization. This manuscript received an average reviewer score of 6.33 at the ICLR workshop, placing it above the average acceptance threshold.
</div>

### AI-Generating Algorithms

[Jeff Clune](https://www.jeffclune.com/) has proposed one of the most ambitious visions: [AI-Generating Algorithms (AI-GAs)](https://arxiv.org/abs/1905.10985)<d-cite key="clune2019ai"></d-cite>, representing an alternate paradigm to the dominant "manual AI approach" where researchers attempt to discover and combine individual pieces of intelligence. Instead of hand-designing solutions, AI-GAs automatically learn how to produce general AI, following the clear trend in machine learning where learned solutions eventually replace hand-designed ones. The AI-GA approach rests on 3 pillars**: 

1. **Meta-learning architectures** that can automatically discover neural network designs
2. **Meta-learning the learning algorithms themselves** rather than using fixed optimization methods
3. **Generating effective learning environments** that provide the right training conditions for developing intelligence

We're already seeing promising implementations of this vision. The [Automated Design of Agentic Systems (ADAS)](https://www.shengranhu.com/ADAS/)<d-cite key="hu2024automated"></d-cite> project, which won Outstanding Paper at the NeurIPS 2024 Open-World Agent Workshop, demonstrates that agents can literally invent novel agent designs by programming in code. Using their "Meta Agent Search" algorithm, the system iteratively programs new agents, tests their performance, archives discoveries, and uses this growing knowledge base to inform subsequent iterations. Remarkably, these AI-discovered agents consistently outperform hand-designed baselines across multiple domains and maintain superior performance even when transferred across different tasks and models.

<img src="{{ '/assets/img/adas.png' | relative_url }}" alt="Meta Agent Search" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 8.** In Meta Agent Search, the "meta" agent is instructed to iteratively program new agents, test their performance on tasks, add them to an archive of discovered agents, and use this archive to inform the meta agent in subsequent iterations.
</div>

Similarly, Sakana AI's [Darwin-Gödel Machine (DGM)](https://sakana.ai/dgm/)<d-cite key="zhang2025darwin"></d-cite> represents another step toward self-improving AI systems, exploring how AI can autonomously evolve and enhance its own capabilities through recursive self-improvement.

<div class="box-note" markdown="1" title="Note">
Interested readers can refer to my previous [post](https://richardcsuwandi.github.io/blog/2025/dgm/) for a comprehensive overview of the Darwin-Gödel Machine.
</div>

The full vision involves AI that can design not just its software and algorithms, but potentially even its hardware and architecture, making AI-GAs a compelling candidate for achieving AGI through automated discovery rather than manual engineering.

## Safety in an open-ended world
Now for the elephant in the room: if we build AI systems that can continuously discover new capabilities and behaviors, how do we ensure they remain safe and beneficial? Open-endedness is incredibly powerful, but as they say, "with great power comes great responsibility". By definition, we can't predict what open-ended systems will discover (because that's the whole point!). This creates unique safety challenges:
- What if an open-ended system discovers new ways to manipulate humans?
- How do we prevent it from finding exploits in its environment or constraints?
- Can we ensure it maintains beneficial goals even as it develops new capabilities?

Most of these safety questions remain open challenges and active areas of research. One of the most feasible directions is to maintain meaningful human involvement throughout the development and deployment of open-ended AI systems. This "human-in-the-loop" approach emphasizes:

- **Collaborative discovery**: Humans and AI working together to explore new possibilities, with humans providing guidance and oversight
- **Iterative feedback**: Human operators continuously evaluating and shaping the direction of AI exploration
- **Democratic participation**: Involving diverse communities of humans in decisions about AI capabilities and their deployment

The idea is that rather than trying to solve all safety challenges through purely technical means, we can create robust frameworks where human judgment and values remain central to how open-ended systems develop.

<img src="{{ '/assets/img/open_ended_system.png' | relative_url }}" alt="Human-AI open-ended system" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 9.** An illustration of how open-ended artifacts emerge from human-AI collaborative process, where AI systems engaged in self-improvement and automated discovery, and humans providing guidance and oversight.
</div>

## Takeaways
Long ago on Earth, life was simple — just single-celled organisms. Then came the [Cambrian Explosion](https://en.wikipedia.org/wiki/Cambrian_explosion), a time when life suddenly became much more complex and diverse as creatures of all shapes and sizes began to appear. Now imagine something similar happening with AI. We’re getting close to a moment when AI systems won’t just be tools — they'll be creative, evolving partners that help us in many different areas. Here’s what that could look like:
- **AI Scientists** who keep exploring and making discoveries around the clock
- **AI Artists** who create new kinds of music, art, and stories we’ve never seen before
- **AI Engineers** who design buildings, spaceships, and even new types of computers
- **AI Teachers** who help every student learn in the way that works best for them
- **AI Doctors** who find new treatments and maybe even help people live longer

These AIs won’t be fixed or limited — they’ll keep learning and improving over time. And importantly, they won’t just work in their own little corners - they’ll be able to connect ideas from different fields. The [Renaissance](https://en.wikipedia.org/wiki/Renaissance) was a time when great progress happened not just because of smart individuals, but because of ideas mixing together. Artists learned from science, scientists looked to nature, and engineers borrowed ideas from art. Open-ended AI could spark a new kind of Renaissance. Imagine an AI working on music discovering something useful for architecture. Or an AI studying animals finding a solution that helps computer design. With open-ended AI, the lines between different fields might blur in exciting ways — helping us solve problems and create things we can barely imagine today.