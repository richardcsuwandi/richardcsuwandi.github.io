---
layout: distill
title: No world model, no general AI
date: 2025-06-11 10:00:00 +0700
description: From Ilya's prediction to Google DeepMind's proof.
tags: [AGENTS, REINFORCEMENT LEARNING]
giscus_comments: true
related_posts: false
thumbnail: /assets/img/robot_world.png
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
bibliography: 2025-06-10-agents-world-models.bib

# Add a table of contents to your post.
#   - make sure that TOC names match the actual section names
#     for hyperlinks within the post to work correctly.
#   - please use this format rather than manually creating a markdown table of contents.
toc:
  - name: Do we need a world model?
    subsections:
      - name: Ilya was right all along?
  - name: Agents and world models
    subsections:
      - name: Environment
      - name: Goals
      - name: Agents
      - name: World Models
  - name: How to recover the world model?
  - name: Experiments
    subsections:
      - name: Connection to related works
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
---
Imagine if we could build an AI that thinks and plans like a human. Recent breakthroughs in large language models (LLMs) have brought us closer to this goal. As these models grow larger and trained on more data, they develop the so-called *emergent abilities*<d-cite key="wei2022emergent"></d-cite> that significantly improve their performance on a wide range of downstream tasks. This has sparked a new wave of research into creating general AI agents that can tackle complex, long-horizon tasks in the real world environments<d-cite key="yao2023react"></d-cite><d-cite key="hao2023reasoning"></d-cite>. But here is the fascinating part: humans do not just react to what they see, we build rich [mental models](https://www.youtube.com/watch?v=OKkEdTchsiE)<d-cite key="johnson1983mental"></d-cite><d-cite key="lecun2022path"></d-cite> of how the world works. These [world models](https://worldmodels.github.io)<d-cite key="ha2018world"></d-cite> help us set ambitious goals<d-cite key="locke2013goal"></d-cite> and make thoughtful plans<d-cite key="bratman1987intention"></d-cite>. Hence, based on this observation, it is natural to ask:

> "Is learning a world model useful to achieve a human-level AI?"

Recently, researchers at Google DeepMind showed that learning a world model is not only beneficial, but also *necessary* for general agents<d-cite key="richens2025generalagentsneedworld"></d-cite>. In this post, we will discuss the key findings from the paper and the implications for the future of AI agents.

## Do we need a world model?

In 1991, [Rodney Brooks](https://en.wikipedia.org/wiki/Rodney_Brooks) made a famous claim that "the world is its own best model"<d-cite key="brooks1991intelligence"></d-cite>.

<img src="{{ '/assets/img/brooks_intelligence.png' | relative_url }}" alt="Intelligence without representation" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 1.** In *Intelligence without representation*, Rodney Brooks famously proposed that "the world is its own best model".
</div>

He argued that intelligent behavior could emerge naturally from model-free agents simply by interacting with their environment through a cycle of actions and perceptions, without needing to build explicit representations of how the world works. Brooks' argument has been strongly supported by the remarkable success of *model-free* agents, which have demonstrated impressive generalization capabilities across diverse tasks and environments<d-cite key="reed2022generalist"></d-cite><d-cite key="driess2023palm"></d-cite><d-cite key="raad2024scaling"></d-cite>. This model-free approach offers an appealing path to creating general AI agents while avoiding the complexities of learning explicit world models. However, recent works suggest an intriguing possibility: even these supposedly model-free agents might be learning *implicit* world models<d-cite key="li2023emergent"></d-cite> and planning algorithms<d-cite key="hou2023towards"></d-cite> beneath the surface.

### Ilya was right all along?
Looking back to March 2023, [Ilya Sutskever](https://en.wikipedia.org/wiki/Ilya_Sutskever) made a profound claim that large neural networks are doing far more than just next-word prediction and are actually [learning "world models"](https://www.youtube.com/watch?v=I6qQinoY9WM). The way he put it,

<div class="center">
<blockquote class="twitter-tweet" data-media-max-width="560"><p lang="en" dir="ltr">In March 2023, <a href="https://twitter.com/ilyasut?ref_src=twsrc%5Etfw">@ilyasut</a> made a profound claim about LLMs learning &quot;world models&quot;. Now, researchers at <a href="https://twitter.com/GoogleDeepMind?ref_src=twsrc%5Etfw">@GoogleDeepMind</a> have proven he glimpsed something even deeper; a fundamental law governing ALL intelligent agents. 🧵 <a href="https://t.co/MsMx8snUZs">pic.twitter.com/MsMx8snUZs</a></p>&mdash; ohqay (@ohqayy) <a href="https://twitter.com/ohqayy/status/1930418880696201317?ref_src=twsrc%5Etfw">June 5, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

He believed that what neural networks learn are not just textual information, but rather a compressed representation of our world. Thus, the more accurately we can predict the next word, the higher fidelity of the world model we can achieve.

## Agents and world models
While Ilya's claim was intriguing, it was not clear how to formalize it at that time. But now, [researchers at Google DeepMind](https://x.com/jonathanrichens/status/1930221408199516657) have proven that what Ilya said is not just a hypothesis, but a fundamental law governing *all* general agents<d-cite key="richens2025generalagentsneedworld"></d-cite>. In the paper, the authors showed that,

> "Any agent capable of generalizing to a broad range of simple goal-directed tasks must have learned a predictive model capable of simulating its environment, and this model can always be recovered from the agent."

<img src="{{ '/assets/img/agents_learn_world_models.jpeg' | relative_url }}" alt="Agents learn world models" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 2.** Any agent satisfying a regret bound must have learned an environment transition function, which can be extracted from its goal-conditional policy. This holds true for agents that can handle basic tasks like reaching specific states.
</div>

1. *There is no "model-free shortcut" to building general AI agents*. If we want agents that generalize to diverse tasks, we cannot avoid learning world models.
2. *Better performance requires better world models*. The only path to lower regret or handling more complex goals is through learning increasingly accurate world models.

<aside class="l-body box-note" markdown="1" title="Note">
The above only holds true for agents that plan over multi-step horizons, as they need to understand how actions affect future states. However, "myopic" agents that only consider immediate rewards can potentially avoid learning world models since they do not need to predict long-term consequences.
</aside>

To make the above claims more precise, the authors develop a rigorous mathematical framework built on 4 key components: environments, goals, agents, and world models.

### Environments
The environment is assumed to be a controlled Markov process (cMP)<d-cite key="sutton1998reinforcement"></d-cite>, which is essentially a Markov decision process without a specified reward function. A cMP consists of a state space $$\boldsymbol{S}$$, an action space $$\boldsymbol{A}$$, and a transition function $$P_{ss'}(a) = P(S_{t+1} = s' \mid A_t = a, S_t = s)$$. The authors assume the environment is irreducible<d-footnote>A Markov process is irreducible if every state is reachable from every other state.</d-footnote> and stationary<d-footnote>A Markov process is stationary if the transition probabilities do not change over time.</d-footnote>.

### Goals
Rather than defining complex goal structures, the paper focused on simple, intuitive goals expressed in Linear Temporal Logic (LTL)<d-cite key="pnueli1977temporal"></d-cite><d-cite key="baier2008principles"></d-cite>. A goal $$\varphi$$ has the form $$\varphi = \mathcal{O}([(s,a) \in \boldsymbol{g}])$$ where $$\boldsymbol{g}$$ is a set of goal states and $$\mathcal{O} \in \{\bigcirc, \diamond, \top\}$$ specifies the time horizon ($$\bigcirc$$ = next, $$\diamond$$ = eventually, $$\top$$ = now). More complex composite goals $$\psi$$ can be formed by combining sequential goals in ordered sequences: $$\psi = \langle\varphi_1, \varphi_2, \ldots, \varphi_n\rangle$$ where the agent must achieve each sub-goal in order. The depth of a goal as the number of sub-goals: $$\text{depth}(\psi) = n$$.

### Agents
The authors focused on *goal-conditioned agents*<d-cite key="liu2022goal"></d-cite>, which are defined as a policy $$\pi(a_t \mid h_t; \psi)$$ that maps a history $$h_t$$ to an action $$a_t$$ conditioned on a goal $$\psi$$. This leads to a natural definition of an optimal goal-conditioned agent for a given environment and set of goals $$\boldsymbol{\Psi}$$, which is a policy that maximizes the probability that $$\psi$$ is achieved, for all $$\psi \in \boldsymbol{\Psi}$$. However, real agents are rarely optimal, especially when operating in complex environments and for tasks that require coordinating many sub-goals over long time horizons. Instead of requiring perfect optimality, the authors define a *bounded* agent that is capable of achieving goals of some maximum goal depth with a failure rate that is bounded relative to the optimal agent. A bounded goal-conditioned agent $$\pi(a_t \mid h_t; \psi)$$ satisfies:

$$P(\tau \models \psi \mid \pi, s_0) \geq \max_{\pi'} P(\tau \models \psi \mid \pi', s_0)(1-\delta)$$

for all goals $$\psi \in \boldsymbol{\Psi}_n$$, where $$\boldsymbol{\Psi}_n$$ is the set of all composite goals with depth at most $$n$$ and $$\delta \in [0,1]$$ is the failure rate parameter.

### World Models
The authors considered the predictive world models, which can be used by agents to plan. They defined a world model as any approximation $$\hat{P}_{ss'}(a)$$ of the transition function of the environment $$P_{ss'}(a) = P(S_{t+1} = s' \mid A_t = a, S_t = s)$$, with bounded error $$\left|\hat{P}_{ss'}(a) - P_{ss'}(a)\right| \leq \varepsilon$$. The authors showed that, for any such bounded goal-conditioned agent, an approximation of the environment's transition function (a world model) can be recovered from the agent's policy alone:

<div class="box-important" markdown="1" title="Theorem">
Let $$\pi$$ be a goal-conditioned agent with maximum failure rate $$\delta$$ for all goals $$\psi \in \boldsymbol{\Psi}_n$$ where $$n > 1$$. Then $$\pi$$ fully determines a model $$\hat{P}_{ss'}(a)$$ for the environment transition probabilities with bounded error:

$$\left|\hat{P}_{ss'}(a) - P_{ss'}(a)\right| \leq \sqrt{\frac{2P_{ss'}(a)(1-P_{ss'}(a))}{(n-1)(1-\delta)}}$$

For $$\delta \ll 1$$ and $$n \gg 1$$, the error scales as $$\mathcal{O}(\delta/\sqrt{n}) + \mathcal{O}(1/n)$$.
</div>

The above result reveals two crucial insights:
1. As agents become more competent ($$\delta \to 0$$), the recoverable world model becomes more accurate.
2. As agents handle longer-horizon goals (larger $$n$$), they must learn increasingly precise world models.

It also implies that learning a sufficiently general goal-conditioned policy is *informationally equivalent* to learning an accurate world model.

## How to recover the world model?
The authors also derived an algorithm to recover the world model from a bounded agent. The algorithm works by querying the agent with carefully designed composite goals that correspond to "either-or" decisions. For instance, it presents goals like "achieve transition $$(s,a) \to s'$$ at most $$r$$ times out of $$n$$ attempts" versus "achieve it more than $$r$$ times". The agent's choice of action reveals information about which outcome has higher probability, allowing us to estimate $$P_{ss'}(a)$$.

<img src="{{ '/assets/img/recovering_world_models.png' | relative_url }}" alt="Algorithm for recovering world models" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 3.** The derived algorithm for recovering a world model from a bounded agent.
</div>

## Experiments
To test the effectiveness of the algorithm, the authors conducted experiments on a randomly generated controlled Markov process with 20 states and 5 actions, featuring a sparse transition function to make learning more challenging. They trained agents using trajectories sampled from the environment under a random policy, increasing agent competency by extending the training trajectory length ($$N_{\text{samples}}$$). The results show that:
- Even when agents strongly violated the theoretical assumptions (achieving worst-case regret $$\delta = 1$$ for some goals), their algorithm still recovered accurate world models.
- The average error in recovered world models decreased as $$\mathcal{O}(n^{-1/2})$$, matching the theoretical scaling relationship between error bounds and goal depth.
- As agents learned to handle longer-horizon goals (larger maximum depth $$n$$), the extracted world models became increasingly accurate. This confirms the fundamental link between agent capabilities and world model quality.

<img src="{{ '/assets/img/world_model_error.png' | relative_url }}" alt="Error in recovered world models" class="center" width="100%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 4.** a) Mean error in recovered world model decreases as agent handles deeper goals. b) Mean error scales with agent's regret at depth 50. Error bars show 95% confidence intervals over 10 experiments.
</div>

### Connection to related works
The results of this work complement several other areas of AI research:

- The proposed algorithm completes a the "triangle" between environment, goal, and policy. Planning determines an optimal policy given a world model and goal (world model + goal → policy), while inverse reinforcement learning (IRL)<d-cite key="ng2000algorithms"></d-cite> recovers goals given a world model and policy (world model + policy → goal). The proposed algorithm fills in the remaining direction by recovering the world model given the agent's policy and goal (policy + goal → world model). Just as IRL requires observing policies across multiple environments to fully determine goals<d-cite key="amin2016towards"></d-cite>, the algorithm needs to observe the agent's behavior across multiple goals to fully recover the world model.

<img src="{{ '/assets/img/triangle_planning.jpeg' | relative_url }}" alt="The triangle of environment, goal, and policy" class="center" width="60%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 5.** While planning uses a world model and a goal to determine a policy, and IRL and inverse planning use an agent’s policy and a world model to identify its goal, the proposed algorithm uses an agent’s policy and its goal to identify a world model.
</div>

- Traditional mechanistic interpretability (MI) typically relies on analyzing neural network activations<d-cite key="li2023emergent"></d-cite> or using supervised probes<d-cite key="alain2016understanding"></d-cite>, on the other hand, the proposed algorithm provides a novel approach that extracts world models directly from an agent's policy behavior, making it applicable even when model internals are inaccessible. This unsupervised and architecture-agnostic approach works for any agent that satisfies the bounded regret condition, regardless of its specific implementation. For LLMs, this means we can potentially uncover their implicit world models by analyzing their goal-directed behavior, without needing to access their internal representations.

- A recent work<d-cite key="richens2024robust"></d-cite> showed that agents adapting to distributional shifts must learn causal world models. This work complements it by focusing on task generalization rather than domain generalization. Interestingly, domain generalization requires deeper causal understanding than task generalization. For example, in a system where state variables $$X$$ and $$Y$$ are causally related ($$X \to Y$$), an agent can achieve optimal task performance by learning just the transition probabilities, without needing to understand the underlying causal relationship. This suggests an agential version of Pearl's causal hierarchy<d-cite key="bareinboim2022pearl"></d-cite>, where different agent capabilities (like domain or task generalization) require different levels of causal knowledge.

<aside class="l-body box-warning" markdown="1" title="Remark">
The findings also have significant implications for AI development and safety. The emergence of new capabilities in large language models and other AI systems could be explained by implicit world models learned while optimizing for diverse training tasks. The ability to extract world models from capable agents provides a new tool for verification and alignment, as model fidelity scales with agent capability. However, the inherent difficulty of learning accurate world models of complex real-world systems also places fundamental limits on general agent capabilities.
</aside>

## Takeaways
Perhaps Ilya's 2023 prediction was more prophetic than we realized. If the above results hold true, then the current race toward artificial superintelligence (ASI) through scaling language models might be secretly a race toward building more sophisticated world models. It is also possible that we may be witnessing something even more profound: the transition from what David Silver and Richard Sutton call the ["Era of Human Data" to the "Era of Experience"](https://storage.googleapis.com/deepmind-media/Era-of-Experience%20/The%20Era%20of%20Experience%20Paper.pdf). While current AI systems have achieved remarkable capabilities by imitating human-generated data, Silver and Sutton argue that superhuman intelligence will emerge through agents learning predominantly from their own experience<d-cite key="silver2025welcome"></d-cite>. For example, with recent developments in foundation world models like [Genie 2](https://deepmind.google/discover/blog/genie-2-a-large-scale-foundation-world-model/), we can generate endless 3D environments from single images<d-cite key="parker2024genie"></d-cite> and allow agents to inhabit "streams of experience" in richly grounded environments that adapt and evolve with their capabilities.

<video src="{{ '/assets/img/genie2.mp4' | relative_url }}" alt="Genie 2" class="center" width="100%" autoplay muted loop controls>
  Your browser does not support the video tag.
</video>
<div class="l-gutter caption" markdown="1">
**Figure 6.** Genie 2, a foundation world model capable of generating an endless variety of action-controllable, playable 3D environments for training and evaluating embodied agents. Based on a single prompt image, it can be played by a human or AI agent using keyboard and mouse inputs.
</div>

If general agents must learn world models, and superhuman intelligence requires learning from experience rather than human data, then foundation world models like Genie 2 might be the ultimate scaling law for the Era of Experience. Rather than hitting the ceiling of human knowledge, we are entering a phase where the quality of AI agents is fundamentally limited by the fidelity of the worlds they can simulate and explore. The agent that can dream the most accurate dreams, and learn the most from those dreams, might just be the most intelligent.