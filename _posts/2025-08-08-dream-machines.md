---
layout: distill
title: The Dream Machines
date: 2025-08-11 10:00:00 +0700
description: How AI is learning to simulate our physical world
tags: [WORLD MODEL, OPEN-ENDEDNESS]
giscus_comments: true
related_posts: false
thumbnail: /assets/img/dream_machines.png
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
bibliography: 2025-08-08-dream-machines.bib

# Add a table of contents to your post.
#   - make sure that TOC names match the actual section names
#     for hyperlinks within the post to work correctly.
#   - please use this format rather than manually creating a markdown table of contents.
toc:
  - name: The birth of dream machines
    subsections:
      - name: What is a "world model"?
      - name: How to build a world model?
      - name: Learning inside dreams
  - name: A whole new world
    subsections:
      - name: How Genie works
      - name: Beyond 2D worlds
      - name: Interactive 3D worlds
  - name: The future of dream machines
  - name: Waking up to a new reality
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
  .box-note, .box-warning, .box-error, .box-important, .box-example {
    padding: 15px 15px 15px 10px;
    margin: 20px 20px 20px 5px;
    border: 1px solid #f9f9f9;
    border-left-width: 5px;
    border-radius: 5px 3px 3px 5px;
    position: relative;
  }
  
  /* Title styling for boxes */
  .box-note[title]::before, .box-warning[title]::before, .box-error[title]::before, .box-important[title]::before, .box-example[title]::before {
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

  d-article .box-example {
    background-color: #f9f9f9;
    border-left-color:rgb(170, 170, 170);
  }
  d-article .box-example[title]::before {
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

  html[data-theme='dark'] d-article .box-example {
    background-color: #2f2f2f;
    border-left-color:rgb(170, 170, 170);
  }
  html[data-theme='dark'] d-article .box-example[title]::before {
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
  
  /* References styling: keep link beside title and prevent overlap */
  d-citation-list .references li {
    margin: 0 0 .6rem 0;
  }
  d-citation-list .references .title {
    display: inline;
    margin: 0;
    line-height: 1.4;
    font-weight: 600;
  }
  d-citation-list .references a {
    white-space: nowrap;
    margin-left: .5em;
  }
  d-citation-list .references {
    line-height: 1.5;
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
A young girl sits, not in front of a screen, but within a world of her own making. With a thought, she conjures a cyberpunk metropolis—a sprawling cityscape alive with neon lights and towering skyscrapers. The air is thick with the scent of rain as crowds of people navigate elevated walkways under umbrellas, their reflections shimmering on wet surfaces below. She slips into the body of a luminous [koi](https://en.wikipedia.org/wiki/Koi), diving through this immersive world from an aquatic perspective. The city comes alive around her, its neon glow reflecting off her scales as she swims past towering buildings and floating advertisements. She is not just playing a game; she is living in a dream—a world that responds to her every whim, a world that learns and grows with her. This is not a scene from a distant science fiction novel. This is the future that "dream machines" like [Genie 3](https://deepmind.google/discover/blog/genie-3-a-new-frontier-for-world-models/) are beginning to build, one pixel at a time. 

<video src="{{ '/assets/img/genie3_koi.mp4' | relative_url }}" alt="Genie 3" class="center" width="100%" autoplay muted loop controls>
  Your browser does not support the video tag.
</video>
<div class="l-gutter caption" markdown="1">
**Figure 1.**  A sample world generated by Genie 3. Clip from @apples_jimmy and @MattMcGill_ on X.
</div>

These models aren't just tools for creating games. They are engines of experience, simulators of reality, and perhaps, the key to unlocking the next stage of artificial general intelligence (AGI). But what does it mean when the line between our dreams and our digital realities begins to blur? In this post, we will explore how foundation world models like Genie are reshaping our digital world and where they might take us next.

## The birth of dream machines

For years, AI has dazzled us with its creative abilities, from [writing eloquent stories](https://www.theatlantic.com/technology/archive/2022/12/chatgpt-ai-writing-college-student-essays/672371/) and [generating stunning artwork](https://www.midjourney.com/explore?tab=video_top) to [producing convincing video](https://deepmind.google/models/veo/). But now, with models like Genie, we are witnessing a new kind of breakthrough. Rather than simply creating content to be observed, these models generate *worlds* that can be explored and shaped in real time. For example, we can now generate a 3D world from a single image, and even interact with it in real time. This shift marks the beginning of what NVIDIA's Jensen Huang envisioned—a future where [every single pixel will be generated, not rendered](https://www.youtube.com/watch?v=Y2F8yisiS6E).

The path to interactive world generation began with a crucial realization: the most sophisticated video generation models were inadvertently learning to simulate reality. When OpenAI unveiled [Sora](https://openai.com/index/video-generation-models-as-world-simulators/)<d-cite key="videoworldsimulators2024"></d-cite> in early 2024, they explicitly positioned it not just as a video generator, but as a "world simulator"<d-footnote>During that time, OpenAI claimed that scaling video generation models is a promising path towards building general purpose simulators of the physical world.</d-footnote>. What made Sora remarkable wasn't just its visual fidelity, but its apparent understanding of physical laws. Objects moved with convincing momentum, liquids flowed naturally, and complex interactions emerged without explicit programming. The model had learned these behaviors by observing millions of hours of video, internalizing patterns of how the world works at a level that went far beyond surface appearances.

<video src="{{ '/assets/img/sora_demo.mp4' | relative_url }}" alt="Sora" class="center" width="100%" autoplay muted loop controls>
  Your browser does not support the video tag.
</video>
<div class="l-gutter caption" markdown="1">
**Figure 2.**  A video generated by Sora using the prompt: "Photorealistic closeup video of two pirate ships battling each other as they sail inside a cup of coffee."
</div>

Google's [Veo 3](https://deepmind.google/models/veo/)<d-cite key="veo3"></d-cite> pushed these capabilities further, offering unprecedented creative control through reference images, camera movement specifications, and synchronized audio generation. The result was a new genre of AI-generated content, including entirely novel forms like AI [ASMR](https://en.wikipedia.org/wiki/ASMR) videos that pushed the boundaries of synthetic media.


{% include youtube.html id="3lAOdrskl1Y" %}

Yet for all their sophistication, these systems shared a fundamental limitation that highlighted the next frontier. You could watch their generated worlds, but you couldn't inhabit them<d-footnote>While AI models like Sora and Veo can generate stunning, immersive scenes, they lack the interactivity to let users freely explore or alter the environment in real time.</d-footnote>.  This gap between observation and interaction represents one of the most significant challenges in AI today: how do we move from systems that generate convincing simulations to systems that generate inhabitable realities? The answer lies in understanding the so-called "world models"—AI systems that don't just generate plausible content, but maintain consistent internal representations of how worlds work.

### What is a "world model"?

Before we dive deeper, let's clarify what we mean by a "world model." 

<div class="box-note" markdown="1" title="Definition">
A world model is a system that can simulate the dynamics of an environment.
</div>
In other words, it is a model that is able to predict how actions change states and how the environment evolves over time. Perhaps the best way to understand world models is to consider how humans operate. As [Jay Wright Forrester](https://en.wikipedia.org/wiki/Jay_Wright_Forrester), a pioneer of systems dynamics, observed:

> "The image of the world around us, which we carry in our head, is just a model. Nobody in his head imagines all the world, government or country. He has only selected concepts, and relationships between them, and uses those to represent the real system." <d-cite key="forrester1971counterintuitive"></d-cite>

To understand this better, consider the following intuitive example from <d-cite key="ha2018world"></d-cite>:

<div class="box-warning" markdown="1" title="Example">
Imagine you're playing a baseball game. You have mere milliseconds to decide how to swing—less time than it takes for visual signals to travel from eyes to brain. Yet professional players consistently make contact. How? Their brains have developed predictive models that can anticipate where and when the ball will arrive, allowing for subconscious, reflexive responses based on internal simulations of the ball's trajectory.
</div>

AI world models also use similar principles to simulate our physical world. They learn the "rules" not through explicit programming, but by *observing countless examples of how things behave*. For instance, a world model might discover that water flows downward and around obstacles, objects cast shadows that change with lighting, and characters maintain consistent appearances from different angles.

### How to build a world model?

The classic [world model](https://worldmodels.github.io/)<d-cite key="ha2018world"></d-cite>, proposed by [David Ha](https://x.com/hardmaru) and [Jürgen Schmidhuber](https://x.com/SchmidhuberAI), consists of three key components that work together to create and navigate simulated realities:

<div class="box-example" markdown="1" title="Vision (V)">
The role of the V component is to take high-dimensional observations and encodes them into compact, meaningful representations<d-footnote>This is similar to how our brains process visual information, where we can recognize objects even when they are partially occluded or in different lighting conditions.</d-footnote>.
</div>

<div class="box-example" markdown="1" title="Memory (M)">
The role of the M component is to learn temporal patterns and predicts future states based on past experience<d-footnote>This is similar to how our brains works, where we can speculate future events based on what we have seen in the past.</d-footnote>. 
</div>

<div class="box-example" markdown="1" title="Controller (C)">
The role of the C is to map the current compressed state and predicted future to select actions <d-footnote>This is similar to how our brains make decisions, where we can plan our actions based on our current state and predicted future state.</d-footnote>. 
</div>

<img src="{{ '/assets/img/world_model_overview.svg' | relative_url }}" alt="World Model Overview" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 3.** Overview of a world model architecture showing the interaction between Vision (V), Memory (M), and Controller (C) components <d-cite key="ha2018world"></d-cite>.
</div>

### Learning inside dreams

Perhaps the most remarkable capability of world models is to "learn inside dreams". Instead of learning in the real world, an agent can learn to perform tasks entirely within the simulated environment generated by its own world model. The process works like this: 
1. The world model observes the real environment and learns its dynamics. 
2. The controller trains by taking actions in this learned simulation, experiencing consequences and rewards without ever touching the actual environment.
3. The trained policy transfers back to reality.

This approach offers several advantages:

- **Accelerated learning**: Time moves at computational speed rather than physical speed. For example, a robotic system can experience years of practice in days of compute time, potentially learning from more diverse scenarios than would be possible in a lifetime of real-world operation.

- **Rare event training**: Edge cases that might occur once in millions of real-world interactions can be generated on demand in simulation. For example, a rescue robot can train for disaster scenarios that haven't happened yet.

- **Safety and ethics**: Dangerous scenarios—car crashes, medical emergencies, military conflicts—can be simulated without real-world consequences. For example, an autonomous vehicle can experience thousands of potential accidents in simulation, learning to avoid them without endangering anyone.

While traditional simulators rely on people manually programming how things move and interact, including rare or complex situations, world models learn these behaviors by analyzing real-world data, which allows them to capture details that humans might overlook or find too hard to describe.

## A whole new world

Building on the foundational insights from world models research, DeepMind's [Genie](https://sites.google.com/view/genie-2024/home)<d-cite key="bruce2024genie"></d-cite> represents a significant leap forward. While the original world models work focused on learning compressed representations for efficient control in constrained environments, Genie scales this vision to create photorealistic, explorable worlds that respond to human input in real-time.

### How Genie works

Unlike traditional game engines that rely on hand-coded physics and pre-designed assets, or video models that generate fixed sequences, Genie learns to create controllable environments entirely from observing unlabeled internet videos<d-footnote>Genie was trained on over 200,000 hours of publicly available gaming footage.</d-footnote>, without being explicitly taught anything about the environments. Genie consists of 3 main components that work together to enable interactive world generation:

<div class="box-note" markdown="1" title="Spatiotemporal video tokenizer">
Converts raw video frames into compressed discrete tokens that capture both spatial and temporal patterns. Rather than processing each frame independently, this component uses a novel spatiotemporal approach that understands how visual elements change over time. It compresses 16×16 pixel patches across multiple frames into discrete tokens<d-footnote> This compression is crucial—it reduces the computational burden while preserving the essential dynamics needed for interactive control.</d-footnote>, learning to represent not just what objects look like, but how they move and change.
</div>

<div class="box-warning" markdown="1" title="Latent action model">
Discovers and learns a discrete action space entirely from observing video transitions, without any action labels. This component observes pairs of consecutive video frames and learns to infer what "action" must have occurred to cause the transition from frame A to frame B.
</div>

<div class="box-error" markdown="1" title="Autoregressive dynamics model">
Generates the next frame tokens given the current state and a chosen latent action<d-footnote>This component uses a sophisticated autoregressive architecture based on MaskGIT, which generates video tokens in parallel rather than sequentially.</d-footnote>. When a user selects an action, the dynamics model predicts how the world should change, generating new video tokens that maintain visual and physical consistency with the previous frame.
</div>


<img src="{{ '/assets/img/genie_architecture.png' | relative_url }}" alt="Genie Architecture" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 4.** Genie takes in $T$ frames of video as input, tokenizes them into discrete tokens $\mathbf{z}$ via the video tokenizer, and infers the latent actions $\tilde{\mathbf{a}}$ between each frame with the latent action model. Both are then passed to the dynamics model to generate predictions for the next $T$ frames in an iterative manner.
</div>

What makes Genie remarkable is how these components learn to work together without explicit supervision. The system watches millions of video transitions and automatically discovers that certain types of changes occur repeatedly—characters moving in different directions, jumping, interacting with objects. It learns to represent these as **discrete latent actions**. Simultaneously, the dynamics model learns to predict what happens when each type of action is taken in different contexts. It develops an understanding of physics, object interactions, and environmental consistency. All three components are trained together, creating a feedback loop where better action recognition improves dynamics prediction, and better dynamics prediction enables more precise action discovery.

### Beyond 2D worlds

The original Genie's transformation of 2D sprite-based games into interactive, explorable worlds was just the beginning. By late 2024, DeepMind had set its sights on a far more ambitious target: scaling these insights to create fully three-dimensional, photorealistic worlds that could rival modern game engines in visual quality while surpassing them in creative flexibility. Just eight months after the original Genie captured the world's imagination with its 2D interactive environments, DeepMind unveiled [Genie 2](https://deepmind.google/discover/blog/genie-2-a-large-scale-foundation-world-model/)<d-cite key="parkerholder2024genie2"></d-cite>—a foundation world model that represents one of the most significant advances in AI-generated interactive content to date. Where Genie transformed simple 2D videos into playable experiences, Genie 2 creates rich, three-dimensional worlds from nothing more than a single prompt image.

<img src="{{ '/assets/img/genie2.png' | relative_url }}" alt="Genie 2" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 5.** Overview of the diffusion world model used in Genie 2.
</div>

While the original Genie operated on discrete video tokens in 2D space, Genie 2 employs an **autoregressive latent diffusion model**<d-cite key="rombach2022high"></d-cite> trained on a massive dataset of 3D game videos. This hybrid approach combines the sequential prediction capabilities of autoregressive models with the high-quality generation of diffusion models. The system processes video through a sophisticated **autoencoder**<d-cite key="kingma2013auto"></d-cite> that maps high-resolution 3D scenes into a compressed latent space. Within this space, a large **transformer**<d-cite key="dosovitskiy2020image"></d-cite> dynamics model—similar in structure to large language models but adapted for spatial-temporal prediction—learns to generate coherent sequences of 3D environments. The use of **classifier-free guidance**<d-cite key="ho2022classifier"></d-cite> during inference allows for precise control over action execution, ensuring that user inputs translate reliably into desired environmental changes.

One of Genie 2's most impressive capabilities is its ability to transform **real-world photographs** into interactive 3D environments. Show it a picture of a forest path, and it generates a navigable woodland where grass sways in the wind and leaves rustle overhead. Provide an image of a rushing river, and it creates a dynamic aquatic environment with flowing water and realistic fluid dynamics. This capability suggests that Genie 2 has developed sophisticated *scene understanding* that goes beyond simple pattern matching. The model appears to infer the three-dimensional structure of scenes, the likely physics governing environmental elements, and the potential interaction affordances—all from a single static image.

<video src="{{ '/assets/img/genie2_demo.mp4' | relative_url }}" alt="Genie 2" class="center" width="100%" autoplay muted loop controls>
  Your browser does not support the video tag.
</video>
<div class="l-gutter caption" markdown="1">
**Figure 6.**  An environment concept by Max Cant transformed into a 3D world by Genie 2.
</div>

### Interactive 3D worlds

More recently, DeepMind released [Genie 3](https://deepmind.google/discover/blog/genie-3-a-new-frontier-for-world-models/)<d-cite key="genie3"></d-cite>, which represents the next evolution in interactive world generation. While Genie 2 demonstrated the ability to create 3D environments from single images, Genie 3 transforms these capabilities into truly **real-time, high-fidelity interactive experiences** that approach the quality and responsiveness of modern game engines.

Perhaps Genie 3's most impressive advancement is its **visual memory** that remembers objects, textures, and even text for up to a minute. Turn away from a scene and look back—the world remains exactly as you left it, with objects in their previous positions and environmental details intact. This consistency enables longer storytelling sessions, complex navigation tasks, and meaningful interaction with persistent world elements. It's the difference between a fleeting dream and a stable reality you can truly inhabit.

<video src="{{ '/assets/img/genie3_consistency.mp4' | relative_url }}" alt="Genie 3 consistency" class="center" width="100%" autoplay muted loop controls>
  Your browser does not support the video tag.
</video>
<div class="l-gutter caption" markdown="1">
**Figure 7.**  A demonstration of Genie 3's visual memory, where the world remains consistent even when the camera is turned away.
</div>

Genie 3 also introduces **promptable world events**, where you can instantly transform the world (e.g., change the weather, add a character, or trigger an event) using natural language. These changes integrate seamlessly into the ongoing experience without breaking immersion or requiring scene resets. This capability also enables the generation of "what if" scenarios that can be learned by agents to handle unforeseen events.

<video src="{{ '/assets/img/genie3_prompt.mp4' | relative_url }}" alt="Genie 3 prompt" class="center" width="100%" autoplay muted loop controls>
  Your browser does not support the video tag.
</video>
<div class="l-gutter caption" markdown="1">
**Figure 8.**  With Genie 3, we can use natural language promps like "spawn a brown bear" to trigger events in the world.
</div>

The progression from Genie 1 to Genie 3 is mind-blowing considering that the timeframe was only about 1.5 years! Here's a table comparing the features of the three generations:

| Feature | Genie 1 | Genie 2 | Genie 3 |
|---------|---------|---------|---------|
| **Resolution** | Low (2D sprites) | 360p | 720p |
| **Control** | Basic 2D actions | Limited keyboard/mouse actions | Navigation + promptable world events |
| **Interaction latency** | Not real-time | Not real-time | Real-time |
| **Interaction horizon** | Few seconds | 10–20 seconds | Multiple minutes |
| **Visual memory** | Minimal consistency | Minimal, scenes changed quickly | Remembers objects and details for ~1 minute |
| **Scene consistency** | 2D sprite coherence | Frequent visual shifts in 3D | Stable, believable 3D environments |

### Waking up to a new reality

We stand at the threshold of a transformative era—one where the ancient human dream of creation becomes as accessible as natural language. The dream machines like Genie represent more than technological achievement. They herald a fundamental shift in how we conceive of digital creation, learning, and experience. Imagine:
- *AI that learns like life evolved*—trained in vast, dynamic worlds simulating billions of real-world experiences<d-footnote>This what Jeff Clune usually refers to as "Darwinian complete" search spaces, an environment that can generate any possible learning environment. </d-footnote>, accelerating the path to true AGI through immersive, adaptive environments.
- *Creativity without limits*—filmmakers, artists, and storytellers bringing entire worlds to life from a single sentence, turning imagination into interactive reality in real time.
- *Education redefined*—students stepping into history, medicine, or engineering challenges through lifelike simulations, mastering skills in safe, personalized, and endlessly adaptable virtual environments.

Yet perhaps the most exciting part is what we *cannot yet* imagine. We are likely only glimpsing the surface<d-footnote>As Tim Rocktäschel tweeted, "we have only scratched the surface of what can be done with prompting and post-training of foundational world models."</d-footnote> of what becomes possible when anyone can conjure interactive worlds from imagination alone. Though the challenges ahead are substantial and real<d-footnote>As DeepMind suggests, the computational costs and accessibility barriers are not the only challenges. There are also ethical concerns about authenticity and potential misuse.</d-footnote>, history suggests a familiar pattern, "the most transformative technologies initially seem impossible, then inevitable". Dream machines appear to be following this well-trodden path, moving rapidly from research curiosity to practical capability. The question is not whether this future will arrive, but how we will shape it as it emerges. The dream machines are awakening, offering unprecedented creative possibilities while challenging fundamental assumptions about reality, creativity, and human-AI collaboration. As we stand at this inflection point, we have the opportunity—and responsibility—to guide this technology toward applications that amplify human creativity, accelerate learning, and expand the boundaries of what we can experience and achieve together.

> If you could dream up any world and bring it to life, what would you create?

## Citation

If you find this post useful, please cite it as:

<div class="citation-box">
Suwandi, R. C. (Aug 2025). The Dream Machines. Posterior Update. https://richardcsuwandi.github.io/blog/2025/dream-machines/.
</div>

Or in BibTeX format:

```bibtex
@article{suwandi2025dream,
    title   = "The Dream Machines",
    author  = "Suwandi, Richard Cornelius",
    journal = "Posterior Update",
    year    = "2025",
    month   = "Aug",
    url     = "https://richardcsuwandi.github.io/blog/2025/dream-machines/"
}
```