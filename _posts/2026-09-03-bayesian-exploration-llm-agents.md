---
layout: distill
title: "Bayesian Exploration for LLM Agents"
date: 2026-09-02 00:00:00 +0800
description: Why raising temperature is not curiosity, and how posterior sampling turns uncertainty into coherent, hypothesis-driven exploration
thumbnail: /assets/img/post_thumbnails/exploration.png
tags: [Agents, Exploration]
giscus_comments: true
related_posts: false
future: true
htmlwidgets: true
exploration_viz: true

authors:
 - name: Richard Cornelius Suwandi
   url: "https://richardcsuwandi.github.io/"
   affiliations:
     name: The Chinese University of Hong Kong, Shenzhen

bibliography: 2026-09-03-bayesian-exploration-llm-agents.bib

toc:
  - name: Randomness is not exploration
    subsections:
      - name: Four notions of uncertainty
      - name: Why local noise fails on long horizons
  - name: Posterior sampling creates coherent behavior
  - name: Where current LLM agents fall short
  - name: Curiosity chooses the direction
    subsections:
      - name: Surprise
      - name: Information gain
      - name: Empowerment
  - name: Four layers of a curious agent
  - name: A hidden-mechanism demo
  - name: Limitations
  - name: Takeaways

_styles: >

  .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  d-article {
    overflow-x: visible;
  }

  .box-note, .box-warning, .box-important {
    padding: 15px 15px 15px 12px;
    margin: 24px 12px;
    border: 1px solid var(--global-divider-color);
    border-left-width: 5px;
    border-radius: 5px;
  }

  .box-note[title]::before, .box-warning[title]::before, .box-important[title]::before {
    content: attr(title);
    display: block;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .box-note {
    background: rgba(87, 143, 202, 0.08);
    border-left-color: #578fca;
  }

  .box-warning {
    background: rgba(221, 163, 63, 0.08);
    border-left-color: #dda33f;
  }

  .box-important {
    background: rgba(88, 166, 109, 0.08);
    border-left-color: #58a66d;
  }

  .caption {
    font-size: 80%;
    line-height: 1.2;
    text-align: left;
  }

  .curious-agent-figure {
    overflow-x: auto;
    overscroll-behavior-inline: contain;
  }

  .curious-agent-figure img {
    display: block;
    width: 100%;
    height: auto;
    background: transparent !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }

  .curious-agent-figure .figure-dark { display: none; }
  html[data-theme="dark"] .curious-agent-figure .figure-light { display: none; }
  html[data-theme="dark"] .curious-agent-figure .figure-dark { display: block; }

  @media (max-width: 700px) {
    .curious-agent-figure img { min-width: 720px; }
  }

---

<div class="box-note" markdown="1" title="Summary">
Raising temperature makes an LLM agent's outputs more diverse, not more exploratory. Coherent exploration instead samples a hypothesis about the environment, commits long enough to test it, and revises beliefs from the result. This is the logic behind Thompson sampling and posterior sampling for reinforcement learning. The post explains why stepwise resampling fails on long horizons, where surprise, information gain, and empowerment fit, and how belief state, objective selection, commitment, and belief revision can form an exploratory agent. Three interactive demonstrations and an exact probability comparison make the differences concrete.
</div>

Suppose two agents face a lock that opens only after the correct five-action sequence. The lock provides no feedback until a complete sequence has been entered. The first agent changes strategy midway through each attempt. The second samples one theory of the mechanism and follows it until the attempt produces evidence. Both agents use the same model, prompt, and sampling temperature. Both are stochastic, but only one conducts an interpretable experiment.

A common recipe for making an LLM agent exploratory is to raise its temperature, ask for diverse ideas, or sample more trajectories. These interventions increase variation in the model's outputs. They do not determine whether that variation is aimed at resolving uncertainty, sustained across a long-horizon plan, or useful for later decisions. A model can emit many different tokens while remaining in the same region of behavior space.

The organizing idea is **coherent exploration**: randomness structured around persistent hypotheses about how the world works. [Arumugam and Griffiths](https://www.alphaxiv.org/abs/2504.20997) recently implemented this pattern by using LLM subroutines to perform posterior sampling for reinforcement learning<d-cite key="arumugam2025efficient"></d-cite>. This post builds on that result to connect posterior sampling with curiosity, empowerment, commitment, and structured memory. Instead of sampling each action independently because several completions look linguistically plausible, the agent samples a plausible model of the environment, acts consistently with it, observes what happens, and revises its beliefs.

**Temperature controls output diversity. Exploration is a policy for acquiring decision-relevant information.** Closing that gap takes more than a new decoding rule. An exploratory agent needs a representation of epistemic uncertainty, a commitment horizon, a curiosity objective, and a memory that supports belief revision.

<div class="box-note" markdown="1" title="Background">
This post sharpens a point from my earlier post, [Exploration as a Path to General Intelligence](https://richardcsuwandi.github.io/blog/2025/exploration-in-ai/). Previously, I argued that exploration is essential for general intelligence and here I make it clear that real exploration means sampling persistent hypotheses about the environment, following them to test and revise, instead of injecting random variation at every step.
</div>

## Randomness is not exploration

At temperature $$\tau>0$$, a language model samples its next token from a rescaled distribution

$$
p_{\tau}(x_t\mid x_{1:t-1},c)
=
\frac{\exp(z_t(x_t)/\tau)}
{\sum_{v}\exp(z_t(v)/\tau)},
$$

where $$z_t(v)$$ is the logit of token $$v$$, $$c$$ is the context, and a larger $$\tau$$ flattens the distribution. This makes lower-probability tokens easier to sample. It can produce more phrasings, plans, and actions, which is often useful. But the distribution is over **tokens conditioned on a textual history**, not over hypotheses about the environment. A useful formalization separates this micro-policy over token sequences from the macro-policy over parsed environment actions, making clear that diversity at the first level need not become diversity at the second<d-cite key="li2025languageagent"></d-cite>.

The distinction becomes obvious when multiple strings mean the same thing. “Search the documentation,” “look through the docs,” and “consult the manual” differ at the token level but may implement the same action. Conversely, two nearly identical tool calls may test very different causal hypotheses. Work on semantic uncertainty addresses one part of this mismatch by grouping generations according to meaning before measuring their entropy<d-cite key="kuhn2023semantic"></d-cite>. Yet even semantic diversity is not sufficient for exploration. An agent can generate ten meaningfully different plans without choosing the plan whose outcome would teach it the most.

The toy decoder below is a next-action distribution for a debugging session. Several wordings are the same action, and several actions test the same hypothesis. Raise the temperature: entropy grows, but the number of hypotheses in a short sample often does not.

<div class="cev cev-temperature" data-cev-temperature>
  <div class="cev-header">
    <div>
      <h3 class="cev-title">Temperature changes wording first</h3>
    </div>
    <div class="cev-controls">
      <div class="cev-control">
        <label for="cev-temperature-input">Temperature <output data-cev-temperature-output>0.80</output></label>
        <input id="cev-temperature-input" data-cev-temperature-input type="range" min="0.2" max="2" step="0.05" value="0.8" aria-label="Decoder temperature">
      </div>
      <button class="cev-resample" data-cev-temperature-resample type="button">Resample</button>
    </div>
  </div>
  <div class="cev-metrics" aria-hidden="true">
    <div class="cev-metric">
      <span class="cev-metric-label">Entropy</span>
      <span class="cev-metric-value" data-cev-metric="entropy">-</span>
    </div>
    <div class="cev-metric">
      <span class="cev-metric-label">Wordings</span>
      <span class="cev-metric-value" data-cev-metric="wordings">-</span>
    </div>
    <div class="cev-metric">
      <span class="cev-metric-label">Actions</span>
      <span class="cev-metric-value" data-cev-metric="actions">-</span>
    </div>
    <div class="cev-metric">
      <span class="cev-metric-label">Hypotheses</span>
      <span class="cev-metric-value" data-cev-metric="hypotheses">-</span>
    </div>
  </div>
  <div class="cev-legend" aria-label="Hypothesis color legend">
    <span class="cev-legend-item"><span class="cev-swatch" style="--swatch: var(--cev-h1)"></span>API</span>
    <span class="cev-legend-item"><span class="cev-swatch" style="--swatch: var(--cev-h2)"></span>Runtime</span>
    <span class="cev-legend-item"><span class="cev-swatch" style="--swatch: var(--cev-h3)"></span>Input</span>
    <span class="cev-legend-item"><span class="cev-swatch" style="--swatch: var(--cev-h4)"></span>Parser</span>
    <span class="cev-legend-item"><span class="cev-swatch" style="--swatch: var(--cev-h5)"></span>Order</span>
  </div>
  <svg class="cev-plot" role="img" aria-label="Probability distribution over twelve synthetic next-action completions"></svg>
  <p class="cev-note">Color is the hypothesis being tested. Counts are 24 draws from a toy decoder.</p>
  <p class="cev-sr-only" data-cev-temperature-live aria-live="polite"></p>
</div>
<div class="l-gutter caption" markdown="1">
**Figure 1.** Temperature flattens a distribution over outputs. Semantic actions and causal hypotheses are coarser objects, so greater output diversity does not translate one-for-one into broader exploration.
</div>

Exploration is therefore not a property of an isolated completion. It is a property of a **policy interacting with an uncertain environment over time**. The relevant question is not "how unpredictable is the next output?" but 'How does this action change what the agent will know and be able to do later?"

This is why random action selection is often called *dithering*. Dithering moves, but it need not make progress. In a coding task, an agent that randomly alternates between editing the parser, changing dependencies, and weakening tests displays behavioral variety. An agent that hypothesizes a parser bug, constructs a discriminating test, and follows the resulting evidence displays exploration.

### Four notions of uncertainty

Discussions of “uncertainty” in LLMs often slide between several different quantities. Separating them prevents a high-entropy decoder from being mistaken for a curious agent.

| Quantity | Distribution or question | What it tells us | What it does not tell us |
|---|---|---|---|
| Token entropy | $$H(X_t\mid x_{1:t-1},c)$$ | How diffuse the next-token distribution is | Whether different tokens imply different actions |
| Semantic uncertainty | Entropy over meaning-equivalent answer classes | Whether the model supports competing answers | Which answer should be tested in the world |
| Epistemic uncertainty | $$p(\theta\mid H_t)$$ over environment hypotheses | What the agent does not know but may learn | Whether learning it is worth the cost |
| Decision value | Expected utility or regret after an observation | Whether information can improve future action | How to represent or obtain that information |

<div class="l-gutter caption" markdown="1">
**Table 1.** Four notions of uncertainty that are related but not interchangeable. Temperature directly modifies only the first.
</div>

Here, $$H_t$$ denotes the agent's interaction history, and $$\theta$$ indexes an unknown reward function, transition rule, user preference, program behavior, or some other part of the environment. **Epistemic uncertainty** is uncertainty caused by missing knowledge: in principle, an informative observation can reduce it. This differs from **aleatoric uncertainty**, which describes irreducible randomness in the environment. A noisy sensor can remain variable even after the agent understands it perfectly.

That difference is essential for curiosity. If an agent receives a fresh random number whenever it presses a button, the observation has high entropy. Repeatedly pressing the button may still teach the agent nothing after it has learned the generator's distribution. An exploration rule that equates surprise with learning will remain captivated by the noise.

Decision value introduces a second filter. Some unknowns are learnable but irrelevant. A travel agent may be uncertain about the aircraft's paint color, but resolving that uncertainty will not improve the itinerary. Efficient exploration targets uncertainty that can change a consequential decision<d-footnote>Information gain and information value answer different questions. Information gain depends on how beliefs change. Decision-theoretic value of information also depends on consequences and measures the improvement in optimal expected utility made possible by an observation. Howard developed this distinction explicitly<d-cite key="howard1966information"></d-cite>.</d-footnote>.

<div class="box-important" markdown="1" title="A useful hierarchy">
Output entropy asks whether the model can say different things. Epistemic uncertainty asks which worlds remain plausible. Information value asks which distinction matters. Exploration is the policy that connects all three to action.
</div>

### Why local noise fails on long horizons

Many open-ended tasks hide their value behind a sequence of individually unrewarding actions. Discovering a scientific mechanism may require designing an experiment, calibrating an instrument, collecting a sample, and waiting for a result. Discovering a new strategy in a game may require moving away from immediate reward. Debugging may require preserving one theory across several tests before any single observation becomes diagnostic.

Consider a chain with two actions, left and right. The left action pays a small reward immediately. The unknown reward lies $$L$$ steps to the right, and the agent receives it only if it chooses right at every step. An independent random policy that chooses right with probability $$1/2$$ reaches the unknown reward with probability $$2^{-L}$$. Increasing local randomness does not repair the exponential dependence. It only changes the base of an exponential that still vanishes.

More generally, suppose no informative feedback arrives before the end, the correct world hypothesis has fixed posterior mass $$q$$, and every competing hypothesis prescribes a different action at each relevant decision point. If the agent independently resamples its hypothesis before every action, completing an $$L$$-step trajectory has probability

$$
P(\text{success}\mid\text{stepwise sampling})=q^L.
$$

Sampling once and committing for the episode instead gives

$$
P(\text{success}\mid\text{episode sampling})=q.
$$

If hypotheses prescribe the same action at some steps, $$L$$ should be replaced by the number of decision points at which they disagree. The figure below uses the distinct-action case and keeps $$q$$ fixed. Stretch the horizon: the left panel collapses, while the right panel does not.

<div class="cev cev-horizon" data-cev-horizon>
  <div class="cev-header">
    <div>
      <h3 class="cev-title">Sample once, then commit</h3>
    </div>
    <div class="cev-controls">
      <div class="cev-control">
        <label for="cev-horizon-input">Horizon <output data-cev-horizon-output>8</output></label>
        <input id="cev-horizon-input" data-cev-horizon-input type="range" min="2" max="16" step="1" value="8" aria-label="Commitment horizon">
      </div>
      <div class="cev-control">
        <label for="cev-q-input"><i>q</i> <output data-cev-q-output>0.70</output></label>
        <input id="cev-q-input" data-cev-q-input type="range" min="0.5" max="0.95" step="0.05" value="0.7" aria-label="Probability of the correct hypothesis">
      </div>
      <button class="cev-resample" data-cev-horizon-resample type="button">Resample</button>
    </div>
  </div>
  <div class="cev-metrics" aria-hidden="true">
    <div class="cev-metric">
      <span class="cev-metric-label">Every step</span>
      <span class="cev-metric-value" data-cev-metric="local-probability">-</span>
    </div>
    <div class="cev-metric">
      <span class="cev-metric-label">Once per episode</span>
      <span class="cev-metric-value" data-cev-metric="coherent-probability">-</span>
    </div>
    <div class="cev-metric">
      <span class="cev-metric-label">Advantage</span>
      <span class="cev-metric-value" data-cev-metric="advantage">-</span>
    </div>
  </div>
  <div class="cev-legend">
    <span class="cev-legend-item"><span class="cev-swatch" style="--swatch: var(--cev-accent)"></span>Correct</span>
    <span class="cev-legend-item"><span class="cev-swatch" style="--swatch: var(--cev-wrong)"></span>Wrong</span>
    <span class="cev-legend-item"><span class="cev-swatch" style="--swatch: var(--cev-success)"></span>Finished</span>
  </div>
  <svg class="cev-plot" role="img" aria-label="Twenty-four simulated episodes comparing stepwise and episode-level posterior sampling"></svg>
  <p class="cev-note">Each row is an episode. A green dot means every step followed the correct hypothesis.</p>
  <p class="cev-sr-only" data-cev-horizon-live aria-live="polite"></p>
</div>
<div class="l-gutter caption" markdown="1">
**Figure 2.** In this deliberately feedback-free comparison, both agents face the same fixed posterior throughout the episode. One sample per episode changes success from $$q^L$$ to $$q$$.
</div>

A coherent strategy samples the hypothesis that the right branch is valuable and follows it for the whole episode. The actions are correlated through that hypothesis. This is the essence of **deep exploration**. Bootstrapped DQN made the same point by sampling a randomized value-function head once per episode. Unlike stepwise dithering, the resulting policy stayed consistent across a long trajectory<d-cite key="osband2016deep"></d-cite>.

Commitment is only part of the long-horizon problem. An agent can also lose contact with a promising frontier because it forgets how to return there, or because exploratory noise knocks it off course before it arrives. Go-Explore calls these failures **detachment** and **derailment**. It counters them by remembering promising states, returning to one, and only then exploring outward<d-cite key="ecoffet2021first"></d-cite>. For an LLM agent, the analogue is not merely storing an interesting finding, but retaining a reliable procedure for reconstructing the context in which that finding becomes useful.

For LLM agents, coherence is even more fragile. The model may articulate a promising theory in one turn, then abandon it because a different continuation becomes locally probable after a tool response. A transcript preserves the words of the theory, but preservation is not commitment. The agent still needs a control rule: which uncertainty is being tested, how long the test should run, and what evidence warrants switching.

Open-ended tasks make this worse. There may be no terminal reward that tells the agent it was right, so a local novelty bonus can collect isolated curiosities instead of capabilities that compound.

## Posterior sampling creates coherent behavior

Thompson sampling offers a different use of randomness. Let $$\theta$$ describe the unknown environment and let $$H_t$$ contain all observations collected so far. The agent maintains a posterior

$$
p(\theta\mid H_t) \propto p(H_t\mid\theta)p(\theta).
$$

At a decision point, it samples one plausible hypothesis

$$
\tilde{\theta}_t \sim p(\theta\mid H_t),
$$

then chooses the action with the greatest expected cumulative value if that hypothesis were true:

$$
a_t \in \arg\max_{a\in\mathcal{A}}
Q_{\tilde{\theta}_t}(H_t,a).
$$

The algorithm explores because uncertain actions are optimal under some posterior samples. As evidence accumulates, implausible hypotheses are sampled less often. Randomness is neither injected uniformly nor used as a generic creativity bonus. Its structure comes from uncertainty about the decision problem. This probability-matching interpretation makes Thompson sampling a practical bridge between Bayesian beliefs and sequential action<d-cite key="russo2018tutorial"></d-cite>.

For long-horizon environments, **Posterior Sampling for Reinforcement Learning** (PSRL) lifts the same idea from actions to world models. At the start of episode $$k$$, it samples an MDP $$\widetilde{M}_k$$ from the posterior, computes a policy $$\pi_k$$ that is optimal for that sample, follows $$\pi_k$$ for the episode, and then updates the posterior using the complete trajectory<d-cite key="osband2013psrl"></d-cite>:

$$
\widetilde{M}_k \sim p(M\mid H_k),
\qquad
\pi_k \in \arg\max_{\pi}V_{\widetilde{M}_k}^{\pi}.
$$

This produces exactly the correlation that token-level dithering lacks. Every action in the episode is conditioned on the same sampled account of the world<d-footnote>Episode-level PSRL is not identical to Bayes-optimal planning in belief space. A Bayes-adaptive MDP treats the posterior as part of the state and can plan for how actions change future beliefs, but solving it exactly is generally computationally demanding. Guez, Silver, and Dayan developed a sample-based approximation using Monte Carlo tree search<d-cite key="guez2012bayesadaptive"></d-cite>.</d-footnote>. A failed trajectory is also interpretable: it supplies evidence against a specific hypothesis rather than merely adding another unsuccessful action to the context.

The implementation by Arumugam and Griffiths assigns LLM subroutines three roles: sampling a plausible environment hypothesis from a textual approximation to the posterior, acting consistently with that sample, and updating the approximate posterior after the episode<d-cite key="arumugam2025efficient"></d-cite>. In combination-lock and Wordle environments, this explicit implementation explored more effectively than several agent baselines, even though its constituent LLMs were not prompted with a generic instruction to explore.

A list of textual hypotheses is not automatically a calibrated Bayesian posterior. The updater may omit possibilities, invent evidence, or assign verbal confidence inconsistently. Calling it a posterior describes the role the representation plays in the algorithm, not a guarantee that exact Bayesian inference occurred.

Their Wordle environment makes the orchestration concrete. The hidden state is a five-letter English word with no repeated letters. An episode is one complete five-letter attempt: the sampler proposes a target-word hypothesis, the policy commits to its five letters in sequence, the environment returns position-level feedback, and the posterior updater revises the remaining constraints. The agent gets at most six episodes. The interactive visualizer below is a finite-vocabulary analogue of that loop: it performs exact filtering so that the belief update is inspectable, whereas their agent represents the approximate posterior in language.

<div class="cev cev-wordle" data-cev-wordle>
  <div class="cev-header">
    <div>
      <p class="cev-kicker">Wordle example</p>
      <h3 class="cev-title">Sample a word, commit, then update</h3>
    </div>
    <div class="cev-controls">
      <button class="cev-action" data-cev-wordle-step type="button">Run episode 1</button>
      <button class="cev-resample" data-cev-wordle-target type="button">New target</button>
      <button class="cev-resample" data-cev-wordle-reveal type="button" aria-pressed="false">Reveal target</button>
    </div>
  </div>
  <div class="cev-metrics" aria-hidden="true">
    <div class="cev-metric">
      <span class="cev-metric-label">Episode</span>
      <span class="cev-metric-value" data-cev-wordle-metric="episode">0 / 6</span>
    </div>
    <div class="cev-metric">
      <span class="cev-metric-label">Posterior support</span>
      <span class="cev-metric-value" data-cev-wordle-metric="support">-</span>
    </div>
    <div class="cev-metric">
      <span class="cev-metric-label">Target mass</span>
      <span class="cev-metric-value" data-cev-wordle-metric="mass">-</span>
    </div>
    <div class="cev-metric">
      <span class="cev-metric-label">State</span>
      <span class="cev-metric-value" data-cev-wordle-metric="state">Ready</span>
    </div>
  </div>
  <div class="cev-wordle-stage">
    <div>
      <div class="cev-wordle-board" data-cev-wordle-board role="img" aria-label="Six Wordle attempts"></div>
      <div class="cev-wordle-keyboard" data-cev-wordle-keyboard aria-label="Observed letter feedback"></div>
      <div class="cev-legend" aria-label="Wordle feedback legend">
        <span class="cev-legend-item"><span class="cev-swatch cev-wordle-correct-swatch"></span>Correct position</span>
        <span class="cev-legend-item"><span class="cev-swatch cev-wordle-present-swatch"></span>Wrong position</span>
        <span class="cev-legend-item"><span class="cev-swatch cev-wordle-absent-swatch"></span>Absent</span>
      </div>
    </div>
    <div class="cev-wordle-belief">
      <div class="cev-wordle-cycle" aria-label="Posterior sampling cycle">
        <div class="cev-wordle-cycle-step" data-cev-wordle-phase="posterior"><span>1</span><strong>Posterior</strong><small>consistent words</small></div>
        <div class="cev-wordle-cycle-arrow" aria-hidden="true">→</div>
        <div class="cev-wordle-cycle-step" data-cev-wordle-phase="sample"><span>2</span><strong>Sample</strong><small>one hypothesis</small></div>
        <div class="cev-wordle-cycle-arrow" aria-hidden="true">→</div>
        <div class="cev-wordle-cycle-step" data-cev-wordle-phase="commit"><span>3</span><strong>Commit</strong><small>five actions</small></div>
        <div class="cev-wordle-cycle-arrow" aria-hidden="true">→</div>
        <div class="cev-wordle-cycle-step" data-cev-wordle-phase="update"><span>4</span><strong>Update</strong><small>use feedback</small></div>
      </div>
      <p class="cev-wordle-status" data-cev-wordle-status>Start with a uniform prior over the vocabulary, then sample one plausible target.</p>
      <div class="cev-wordle-sample">
        <span>Current posterior sample</span>
        <strong data-cev-wordle-sample>-</strong>
      </div>
      <div class="cev-wordle-candidates-wrap">
        <span class="cev-wordle-candidates-label">Posterior support</span>
        <div class="cev-wordle-candidates" data-cev-wordle-candidates></div>
      </div>
      <p class="cev-wordle-secret" data-cev-wordle-secret aria-live="polite">Target hidden</p>
    </div>
  </div>
  <p class="cev-note">Pedagogical simulation, not a replay of the reported LLM traces. It uses a curated finite vocabulary and an exact uniform posterior. The experiment used LLM-generated textual posteriors over a filtered English corpus.</p>
  <p class="cev-sr-only" data-cev-wordle-live aria-live="polite"></p>
</div>
<div class="l-gutter caption" markdown="1">
**Figure 3.** A transparent analogue of LLM-based PSRL in the customized Wordle environment. One posterior sample determines all five letter actions in an episode. Only after observing the complete attempt does the agent update its belief for the next sample.
</div>

This suggests a useful design principle: **use the LLM to implement the uncertain parts of a known decision algorithm, rather than hoping that stochastic generation will implicitly rediscover the algorithm**. Natural language is especially helpful when hypotheses are structured objects (rules, causal stories, user preferences, program invariants) that are awkward to encode as a small parametric posterior.

## Where current LLM agents fall short

The same token-versus-posterior gap shows up as several recurring weaknesses in LLM agents.

**First, next-token prediction provides local plausibility instead of a drive to explore.** Pretraining trains a model to extend trajectories that appear in data. The model may capture many strategies, but the likelihood objective alone does not specify which real-world uncertainty the agent should aim to resolve when deployed. At inference, temperature modifies the distribution over possible continuations, but it does not create a belief state about the environment the agent faces.

**Second, a context window is not a belief state.** Interaction histories mix observations, failed plans, tool errors, speculative reasoning, and outdated conclusions. Even when every fact remains in context, the agent may not distinguish evidence from conjecture or track which hypotheses survived. Exploration requires a state representation that says what is known, what remains possible, and which observation would discriminate among the possibilities<d-footnote>Li frames an agent state as a lossy compression of its growing interaction history and the state-update function as a memory policy<d-cite key="li2025languageagent"></d-cite>. For exploration, that compression should preserve hypotheses, supporting and contradicting evidence, attempted tests, and unresolved distinctions. Agent-BRACE implements this separation with a belief model that maintains atomic claims annotated by Words of Estimative Probability labels and a distinct policy model that acts from the compact belief rather than the full history<d-cite key="singh2026brace"></d-cite>. Memory management is therefore part of the exploration architecture, not only a response to context limits.</d-footnote>.

**Third, independently sampled actions destroy temporal credit.** Open-ended discoveries often lie behind sequences whose intermediate steps look unpromising. If the model resamples its strategy after every step, it rarely reaches the observation that would reveal whether the original idea was good. This is the language-agent analogue of shallow exploration in a long chain.

**Fourth, novelty and usefulness are different.** Language models are excellent at generating unusual combinations, but an unusual action may be infeasible, redundant, or impossible to interpret. Efficient decision-making requires an acquisition rule: what will this action teach, how could that knowledge change future behavior, and what will it cost?

Evidence from an open-ended Little Alchemy 2 benchmark illustrates the gap. Players start with water, fire, earth, and air, then combine elements to grow an inventory. Over 500 trials, GPT-4o and two Llama 3.1 models discovered fewer elements on average than humans, while the reasoning-oriented DeepSeek-R1 and o1 systems discovered more<d-cite key="pan2025think"></d-cite>.

<img src="{{ '/assets/img/little-alchemy-performance.jpg' | relative_url }}" alt="Little Alchemy 2 task setup and final-inventory distributions. GPT-4o and both Llama 3.1 models fall below the human mean. DeepSeek-R1 and o1 fall above it." class="center rounded z-depth-1 l-body" width="100%">
<div class="l-gutter caption" markdown="1">
**Figure 4.** Little Alchemy 2 as an open-ended exploration task (A, B) and the distribution of final inventories after 500 trials (C). Means: Llama 3.1 8B 9, Llama 3.1 70B 25, GPT-4o 35, humans 42, DeepSeek-R1 85, o1 177. Figure from Pan, Xie, and Wilson<d-cite key="pan2025think"></d-cite>.
</div>

Increasing temperature strengthened the tested models' preference for less-used elements, which served as the work's proxy for uncertainty, but it did not increase their measured preference for combinations that expanded future possibilities. More randomness produced more novelty-seeking, not more foresight.

<img src="{{ '/assets/img/little-alchemy-strategies.jpg' | relative_url }}" alt="Regression weights for empowerment and uncertainty by model and temperature. Raising temperature lifts uncertainty-seeking in GPT-4o and Llama 3.1, while empowerment stays near zero." class="center rounded z-depth-1 l-body" width="100%">
<div class="l-gutter caption" markdown="1">
**Figure 5.** Regression weights for empowerment (left) and the less-used-element uncertainty proxy (right). Among the models whose temperature could be varied, higher temperature raises this uncertainty-seeking measure and leaves empowerment near zero. Only o1, whose temperature is fixed, matches or exceeds the human empowerment weight. Figure from Pan, Xie, and Wilson<d-cite key="pan2025think"></d-cite>.
</div>

That work covers one benchmark, and its operational measure of empowerment is tailored to the game's combination graph. It should not be read as a universal ranking of models or as proof of an architectural cause. The useful lesson is methodological: open-ended exploration must be evaluated through the **structure of the trajectories an agent creates**, not just the entropy of its individual choices.

A companion result, measured in humans and standard RL agents rather than LLM agents, points the same way. In Crafter, state-visitation entropy and one-step experienced empowerment correlated positively with human exploration progress, while the work's log-count proxy for information gain did not<d-cite key="lidayan2025intrinsically"></d-cite>. That proxy measures diminishing novelty in observed state-action transitions rather than the Bayesian belief update defined below. The authors suggest that it may correlate less well with progress because an agent can try many actions that have no effect. Entropy provided more signal early, when many states were still unseen, while empowerment grew steadily as players learned what they could reliably control. That timing is a reason to expect a single fixed weighting of curiosity and empowerment to be the wrong target in the first place.

Recent work identifies two complementary training failures behind this gap. [Look Before You Leap](https://www.alphaxiv.org/abs/2605.16143) calls one **premature exploitation** and introduces Exploration Checkpoint Coverage to measure how broadly an agent discovers important states, objects, and affordances. It finds that task-oriented training, including GRPO for task completion, can produce narrow and repetitive behavior rather than broad exploration<d-cite key="ye2026look"></d-cite>. [Clearing the Fog](https://www.alphaxiv.org/abs/2608.14339) offers a training-level account: expert demonstrations often omit the exploratory actions that preceded success, while RL rarely samples useful exploration and therefore has little signal to reinforce it. Its SAFARI method addresses these problems with exploration-rich trajectories and contrastive optimization that separates productive exploration from redundant wandering<d-cite key="guan2026clearing"></d-cite>.

## Curiosity chooses the direction

Posterior sampling explains how uncertainty can generate coherent behavior, but open-ended agents face a broader question: what should they explore when external rewards are sparse, delayed, or not yet defined? This is the role of curiosity and intrinsic motivation.

“Curiosity” is often used as if it were a single reward. In practice, it names several objectives with different failure modes.

### Surprise

A simple surprise bonus rewards an observation that the agent's forward model predicts poorly. Here, surprise is measured as the squared prediction error in a learned representation space<d-footnote>With a fixed-variance Gaussian predictive model, squared error is proportional to negative log predictive probability. Outside that special case, predictive surprise is more generally the negative log probability assigned to the observation, so “surprise” and squared error are not interchangeable.</d-footnote>:

$$
r_t^{\mathrm{pred}}
=
\left\|f_{\phi}(s_t,a_t)-\psi(s_{t+1})\right\|_2^2.
$$

Here, $$f_{\phi}$$ predicts the next-state representation $$\psi(s_{t+1})$$. This formulation can drive an agent through sparse-reward visual environments and help it learn transferable exploratory behavior<d-cite key="pathak2017curiosity"></d-cite>. It is also easy to understand: visit what remains difficult to predict.

But prediction error confounds ignorance with randomness and model inadequacy. A stochastic television remains difficult to predict forever. An agent rewarded by error may watch it indefinitely, a failure observed when prediction-based curiosity is tested in stochastic environments<d-cite key="burda2019large"></d-cite>. Complex observations can also remain surprising because the model lacks capacity, not because another sample will resolve anything.

### Information gain

A Bayesian curiosity objective instead rewards how much an observation changes beliefs about the environment<d-footnote>The displayed divergence is realized information gain: it can be evaluated after the outcome arrives. Before acting, an agent must average over possible outcomes to obtain expected information gain.</d-footnote>:

$$
r_t^{\mathrm{IG}}
=
D_{\mathrm{KL}}\!\left(
p(\theta\mid H_t,a_t,o_{t+1})
\,\|\,
p(\theta\mid H_t)
\right).
$$

This quantity becomes small once the agent understands the source of randomness, even if individual outcomes remain surprising. VIME made this principle practical in deep reinforcement learning by approximating information gain about a Bayesian dynamics model<d-cite key="houthooft2016vime"></d-cite>. Ensemble disagreement offers another approximation: seek states where plausible world models predict different outcomes, not states that are merely noisy<d-cite key="pathak2019disagreement"></d-cite>.

Information gain is more disciplined than raw surprise, but it can still pursue useless trivia. An agent might perfectly map irrelevant parts of an environment while neglecting the uncertainty that blocks its goal. The missing ingredient is decision relevance.

### Empowerment

Some actions are valuable because they create more useful actions later. For a finite horizon $$h$$, a standard extension of **empowerment** formalizes this as the channel capacity between a sequence of actions and a future state<d-cite key="klyubin2005empowerment"></d-cite>:

$$
\mathcal{E}_h(s_t)
=
\max_{p(a_{t:t+h-1})}
I\!\left(A_{t:t+h-1};S_{t+h}\mid S_t=s_t\right).
$$

An empowered state is one from which the agent can reliably reach many distinguishable futures. In Little Alchemy, an element that enables dozens of later combinations is more empowering than an isolated novelty. For a coding agent, a minimal reproduction may be empowering because it unlocks many targeted tests. For a scientist, a measurement platform may be empowering because it makes a family of future experiments possible.

<div class="curious-agent-figure l-body">
  <img class="figure-light" src="{{ '/assets/img/curiosity-objectives.svg' | relative_url }}" alt="Three curiosity signals. Surprise asks whether an outcome was unexpected, information gain asks whether beliefs changed, and empowerment asks whether an action created controllable future options. A meta-controller balances these signals against task value, cost, and risk.">
  <img class="figure-dark" src="{{ '/assets/img/curiosity-objectives.svg#dark' | relative_url }}" alt="" aria-hidden="true">
</div>
<div class="l-gutter caption" markdown="1">
**Figure 6.** Surprise, information gain, and empowerment value different consequences of an action and fail in different ways. A belief-conditioned controller can emphasize the signal that addresses the agent's current bottleneck while accounting for task value, cost, and risk.
</div>

Related work on unsupervised skill discovery turns a nearby information-theoretic idea into a repertoire: DIAYN learns distinguishable behaviors without requiring an external task reward<d-cite key="eysenbach2019diayn"></d-cite>. Such skills matter not because every one is immediately useful, but because they give a later planner more ways to act.

Empowerment is particularly relevant to open-endedness because it values **option creation**. This connects it to a broader open-ended-search tradition. Novelty search preserves behavioral stepping stones that an objective might discard<d-cite key="lehman2011abandoning"></d-cite>. MAP-Elites keeps an archive of high-performing but behaviorally different solutions<d-cite key="mouret2015illuminating"></d-cite>. Enhanced POET expands the set of problems while transferring solutions between them<d-cite key="wang2020enhanced"></d-cite>. These methods do not optimize the same quantity<d-footnote>Empowerment measures controllable futures from a current state. Novelty search and quality-diversity methods preserve behavioral diversity across a population or archive, while POET expands a paired space of problems and solutions. The connection is structural rather than mathematical: each resists collapsing search too early onto one endpoint.</d-footnote>. Yet maximizing options without restraint can still pull the agent away from external goals. The agent needs to balance immediate utility, information, future controllability, and cost:

$$
J(a_t)
=
\underbrace{\mathbb{E}[R_t\mid a_t]}_{\text{task value}}
+ \beta_t\underbrace{\mathbb{E}[r_t^{\mathrm{IG}}\mid a_t]}_{\text{learning value}}
+ \lambda_t\underbrace{\mathbb{E}[\mathcal{E}_h(S_{t+1})\mid a_t]}_{\text{option value}}
- \underbrace{C(a_t)}_{\text{cost and risk}}.
$$

The coefficients should not be fixed personality traits. They describe a control problem at a slower time scale than token generation. The relevant inputs include the current belief state, the cost of an experiment, the remaining interaction budget, and whether the agent lacks information or capability. [Calibrate-Then-Act](https://www.alphaxiv.org/abs/2602.16699) provides direct evidence for externalizing this calibration step: on a simplified Pandora's Box task, Qwen3-8B matched the oracle policy on 94% of examples when given explicit priors, compared with 23% without them, while baseline agents in retrieval and file-reading tasks tended toward static policies across cost regimes<d-cite key="ding2026calibrate"></d-cite>.

Combining information gain and empowerment is not itself a new idea. Magrans de Abril and Kanai let curiosity and empowerment share an internal model<d-cite key="magrans2018unified"></d-cite>. Dai, Xu, Hofmann, and Williams combined both signals as exploration bonuses for sparse-reward robotic manipulation<d-cite key="dai2021empowerment"></d-cite>. A later comparison across MiniGrid, Procgen, and Atari found fixed sums sensitive to their weights and reported scheduled cycling as the most consistently robust fusion strategy tested<d-cite key="yuan2025hire"></d-cite>.

This suggests a **meta-controller** rather than a fixed mixture of intrinsic rewards. The agent's belief state, remaining interaction budget, and current option bottlenecks determine which objective should dominate. Information gathering is valuable when it can still change a later decision. Empowerment is valuable when limited capabilities block progress. Exploitation dominates when little time remains to use newly acquired information. Whether such belief-conditioned control improves language-agent exploration is an empirical question.

This proposal is narrower than claiming a new intrinsic reward. It places an adaptive controller above the reward signals and the posterior-sampling loop. The entropy-then-empowerment pattern observed in human exploration motivates the idea<d-cite key="lidayan2025intrinsically"></d-cite>, but does not establish how a controller should switch. A useful test would compare belief-conditioned control against fixed weights and scheduled cycling under the same interaction budget.

## Four layers of a curious agent

Put together, this is an agent with four explicit layers.

1. **Belief state.** Convert the raw interaction history into a set or distribution of plausible environment hypotheses. Record supporting evidence, contradictions, and unresolved uncertainty.
2. **Exploration objective.** Score candidate actions by task reward, expected information gain, empowerment, cost, and risk. Do not treat every unknown as equally valuable.
3. **Commitment mechanism.** Sample a hypothesis or exploratory objective and preserve it across a meaningful horizon. Switch when the episode ends or when evidence crosses a specified contradiction threshold, not whenever another token sequence becomes locally attractive.
4. **Belief revision.** Update the uncertainty representation from the resulting trajectory. Preserve failed experiments as evidence, not merely as prose in an ever-growing transcript.

<div class="curious-agent-figure l-body">
  <img class="figure-light" src="{{ '/assets/img/four-layers-curious-agent.svg' | relative_url }}" alt="Four-layer curious-agent loop. A belief state represents plausible worlds, an exploration objective selects a useful test, a commitment mechanism preserves one hypothesis across an episode, and belief revision records the resulting evidence before the cycle repeats.">
  <img class="figure-dark" src="{{ '/assets/img/four-layers-curious-agent.svg#dark' | relative_url }}" alt="" aria-hidden="true">
</div>
<div class="l-gutter caption" markdown="1">
**Figure 7.** The four layers form a closed experimental loop. Beliefs constrain what is plausible, the objective chooses which distinction matters, commitment turns that choice into a coherent trajectory, and revision converts the trajectory into evidence for the next cycle.
</div>

Together, these layers create three kinds of coherence:
- **Hypothesis coherence.** Consecutive actions test the same account of the world.
- **Objective coherence.** The agent preserves what it is trying to learn long enough for its actions to accumulate meaning.
- **Evidential coherence.** Observations become support or contradiction for explicit hypotheses instead of undifferentiated additions to a transcript.

[Align While Search](https://www.alphaxiv.org/abs/2512.24461) provides a narrower existence proof for part of this design. In partially observable search tasks, it maintains an external structured belief, updates that belief from action-conditioned observations, and selects actions using predicted information gain without additional training. It improves search success-cost tradeoffs over several inference-time and train-time baselines, though it does not implement the full commitment and meta-control architecture proposed here<d-cite key="bae2025align"></d-cite>.

One possible implementation could look like this:

$$
\begin{aligned}
b_k &\leftarrow \operatorname{UpdateBeliefs}(b_{k-1},\tau_{k-1}),\\
\widetilde{M}_k &\sim b_k,\\
g_k &\leftarrow \operatorname{SelectGoal}(\widetilde{M}_k,b_k),\\
\pi_k &\leftarrow \operatorname{Plan}(\widetilde{M}_k,g_k),\\
\tau_k &\leftarrow \operatorname{Execute}(\pi_k,\text{stop rule}).
\end{aligned}
$$

The LLM can participate in every operation, but the orchestration carries the decision-theoretic structure. A language model may summarize the belief state, propose a compact world hypothesis, generate a plan, interpret feedback, and suggest a revision. External components can check calibration, maintain counts or ensembles, enforce budgets, and decide when the accumulated evidence warrants replanning<d-footnote>Randomized ensembles offer one tractable approximation when exact posterior sampling is too expensive. Ensemble++ uses a shared-factor ensemble and reports Thompson-sampling-style regret guarantees with an ensemble of order <i>d</i> log <i>T</i> for linear contextual bandits, then extends the construction to learned neural representations<d-cite key="li2025scalable"></d-cite>. This addresses computational scaling in parameterized settings, but it does not by itself provide a calibrated posterior over open-ended textual hypotheses.</d-footnote>.

Commitment should be conditional, not merely long. For a sampled hypothesis $$\widetilde{M}_k$$, the agent should continue while the hypothesis remains plausible, staying with the current test is more valuable than replanning, and the action stays inside a risk budget. One compact stopping rule is

$$
T_k
=
\inf\left\{t:
p(\widetilde{M}_k\mid H_t)<\varepsilon
\,\text{or}\,
V_{\mathrm{continue}}(b_t,\widetilde{M}_k)
\leq
V_{\mathrm{replan}}(b_t)-C_{\mathrm{switch}}
\,\text{or}\,
\operatorname{Risk}(a_t)>\rho_{\max}
\right\},
$$

Information gathering enters these value functions through its effect on later decisions, not through information gain alone. This rule turns commitment into a test with explicit interruption conditions.

| Layer | A coding agent | A scientific agent | An open-world game agent |
|---|---|---|---|
| Belief state | Candidate bug mechanisms | Competing causal models | Hypotheses about hidden dynamics |
| Informative action | Minimal discriminating test | Experiment separating predictions | Action revealing a transition rule |
| Empowering action | Build a reusable test harness | Calibrate a general instrument | Acquire a reusable skill or resource |
| Commitment horizon | Debugging episode | Experimental campaign | Quest or trajectory segment |
| Update | Eliminate inconsistent causes | Revise model probabilities | Update map, rules, and affordances |

<div class="l-gutter caption" markdown="1">
**Table 2.** The same architecture applies across domains once the belief, action, feedback, and commitment horizon are made explicit.
</div>

This architecture also clarifies the role of reasoning models. More test-time computation can improve exploration when it helps the agent compare hypotheses, anticipate multi-step consequences, and preserve a strategy. Longer reasoning alone is not the objective. A model can deliberate extensively over the wrong uncertainty. The benefit comes from using computation to construct a better belief-conditioned policy.

<div class="box-important" markdown="1" title="The design shift">
Do not ask the model to "be more exploratory". Ask the system to maintain competing hypotheses, choose which distinction matters, commit to a test, and update from the result.
</div>

## A hidden-mechanism demo

Before trying this architecture on an LLM, I implemented a small tabular version to check whether coherent commitment does what the argument predicts, with the posterior and information gain computed exactly rather than approximated. The map below is that world. The task is to open the gate, and each episode conceals which rule does so. I plan to share the code once it is cleaned up.

You can play it. Click a room to walk there. The dock under the map shows what you can do in that room. Left and Right, when they appear, are lock presses for the gate. The keys on the right are the posterior over the two possible codes. A new episode draws a new hidden rule. Reveal shows the true code.

<div class="cev cev-lab" data-cev-lab>
  <div class="cev-header">
    <div>
      <p class="cev-kicker">Hidden-mechanism lab</p>
      <h3 class="cev-title">Open the gate</h3>
    </div>
    <div class="cev-controls">
      <div class="cev-control">
        <label for="cev-lab-accuracy">Reading accuracy <output data-cev-lab-accuracy-output>0.90</output></label>
        <input id="cev-lab-accuracy" data-cev-lab-accuracy type="range" min="0.55" max="0.95" step="0.05" value="0.90" aria-label="Diagnostic reading accuracy">
      </div>
      <button class="cev-resample" data-cev-lab-reveal type="button" aria-pressed="false">Reveal</button>
      <button class="cev-resample" data-cev-lab-reset type="button">New episode</button>
    </div>
  </div>
  <div class="cev-metrics" aria-hidden="true">
    <div class="cev-metric">
      <span class="cev-metric-label">Instrument</span>
      <span class="cev-metric-value" data-cev-lab-metric="instrument">None</span>
    </div>
    <div class="cev-metric">
      <span class="cev-metric-label">Reading</span>
      <span class="cev-metric-value" data-cev-lab-metric="reading">0 / 1</span>
    </div>
    <div class="cev-metric">
      <span class="cev-metric-label">Gate</span>
      <span class="cev-metric-value" data-cev-lab-metric="progress">0 / 3</span>
    </div>
  </div>
  <div class="cev-lab-stage">
    <div class="cev-lab-floor">
      <svg class="cev-lab-map" data-cev-lab-map role="img" aria-label="Laboratory floorplan"></svg>
    </div>
    <div class="cev-lab-under">
      <div class="cev-lab-dock">
        <p class="cev-lab-dock-room" data-cev-lab-here>Junction</p>
        <div class="cev-lab-actions" data-cev-lab-actions></div>
        <p class="cev-lab-status" data-cev-lab-status></p>
      </div>
      <div class="cev-lab-sidebar">
        <p class="cev-lab-belief-heading">Posterior</p>
        <div class="cev-lab-belief" data-cev-lab-belief></div>
      </div>
    </div>
  </div>
  <p class="cev-sr-only" data-cev-lab-live aria-live="polite"></p>
</div>
<div class="l-gutter caption" markdown="1">
**Figure 8.** Click a room to move. The dock under the map is what you can do in that room. The keys are the posterior over the two codes.
</div>

Once you have tried it, two observations are easier to see than they were in the earlier sections. The noisy-television failure mode is not hypothetical. Watching the television produces a new random observation every time and leaves the posterior unchanged, which is exactly what a prediction-error bonus would keep asking for. Other rooms look as if they ought to matter and do not.

The second observation is about commitment. Opening the gate yourself is less interesting than asking what an exact Bayesian agent should do. The comparison can be calculated without simulation. Assume two complementary codes, a uniform prior, an $$L$$-press lock, and one diagnostic reading that identifies the true code with accuracy $$\alpha\geq 1/2$$. A stepwise agent samples a new code before every press. A blind-commit agent samples once. A read-then-commit agent obtains the diagnostic and follows the code favored by its posterior.

The exact success probabilities are

$$
\begin{aligned}
P(\text{success}\mid\text{stepwise}) &= 2^{-L},\\
P(\text{success}\mid\text{blind commit}) &= \tfrac{1}{2},\\
P(\text{success}\mid\text{read then commit}) &= \alpha.
\end{aligned}
$$

The interactive lab does not impose a numerical interaction budget. For the decision comparison below, let success have value one and let building and using the diagnostic have total cost $$c=0.10$$. The net value of reading is therefore $$\alpha-c$$. A blind commitment has value $$1/2$$, so the diagnostic is worth acquiring exactly when

$$
\alpha-c>\frac{1}{2}.
$$

| Reading accuracy $$\alpha$$ | Stepwise for $$L=3,5,7$$ | Blind commit | Read then commit | Net value after cost $$c=0.10$$ |
|---|---:|---:|---:|---:|
| 0.90 | 0.125, 0.031, 0.008 | 0.500 | 0.900 | **0.800** |
| 0.70 | 0.125, 0.031, 0.008 | 0.500 | 0.700 | **0.600** |
| 0.55 | 0.125, 0.031, 0.008 | **0.500** | 0.550 | 0.450 |

<div class="l-gutter caption" markdown="1">
**Table 3.** Exact success probabilities under a uniform prior over two complementary lock codes. The final column subtracts an illustrative diagnostic cost of 0.10. These are analytical values, not estimates from sampled episodes.
</div>

The comparison separates three effects. Commitment removes the exponential dependence on lock length. Information improves the committed choice from probability $$1/2$$ to $$\alpha$$. Cost determines whether that improvement is worth acquiring. At accuracy 0.90 and 0.70, read-then-commit has higher net value than a blind commitment. At accuracy 0.55, the free information still improves success from 0.50 to 0.55, but the improvement does not repay a cost of 0.10.

This last point is general. A Bayes-optimal agent cannot be harmed by free information because it can always ignore the observation and retain its previous action<d-footnote>This is the simplest comparison between an experiment and no experiment. Blackwell's ordering formalizes when one experiment is at least as useful as another for every decision problem<d-cite key="blackwell1953equivalent"></d-cite>.</d-footnote>. If $$b$$ is the prior belief and $$b_o$$ is the posterior after observation $$o$$, then

$$
\mathbb{E}_{o}\!\left[\max_a \mathbb{E}_{\theta\sim b_o}U(a,\theta)\right]
\geq
\max_a \mathbb{E}_{\theta\sim b}U(a,\theta).
$$

Information becomes undesirable only through acquisition cost, delay, risk, or a constrained opportunity to use it. Commitment does not replace the choice of what to learn. It makes the consequences of that choice persist across the trajectory.

This is a small proof of concept with two represented hypotheses and an exact posterior. The harder question is whether an LLM's approximate textual belief preserves enough structure for the same advantage to survive.

## Limitations

This architecture organizes exploration, but it does not finish the problem. Four gaps remain, and any one of them can undo the rest:

- **The hypothesis space may not contain the right model.** Posterior sampling only chooses among represented explanations. Truly open-ended exploration also needs hypothesis generation. When one hypothesis fails, the agent should update its weight. When every hypothesis repeatedly predicts poorly, the agent should propose new variables, mechanisms, skills, or objectives and expand the space itself.

- **Commitment is dangerous when the hypothesis is wrong.** An agent can pursue a consistent but false story, waste an episode, or cause harm. Commitment therefore needs interruption conditions, calibrated risk estimates, and conservative defaults for irreversible actions. Coherence is useful only inside a safety envelope.

- **Curiosity still has to be specified.** Information gain depends on what the model represents, so an agent cannot seek information about a mechanism it has no language to express. Empowerment can reward control for its own sake. Novelty can favor noise. External reward can shut exploration down too early. No generic task-independent bonus decides which uncertainties, capabilities, and outcomes matter.

- **Exact Bayesian inference is usually unavailable.** In the environments where LLM agents are most interesting, textual beliefs, ensembles, verbalized confidence, and sampled hypotheses are approximations. Judge them by their consequences: calibration, cumulative regret, coverage of distinct hypotheses, information gained per interaction, and whether the agent can recover after being wrong.

The practical question is how to build approximate epistemic states that are expressive enough for natural-language worlds, disciplined enough for reliable updating, and cheap enough to keep throughout a long interaction.

## Takeaways

The difference between the two agents at the locked door was never how much randomness they used. It was where that randomness lived. One randomized actions. The other randomized over explanations and let a single explanation organize an experiment. That shift from diverse outputs to coherent tests is the architectural change exploratory LLM agents need.

Coherent exploration begins with an explicit belief state. Posterior sampling supplies hypothesis coherence. A decision-relevant curiosity objective supplies objective coherence. Belief revision supplies evidential coherence. Conditional stopping rules keep commitment useful without turning it into stubbornness. Hypothesis generation expands the space when none of the represented explanations survives contact with evidence.

The design problem is therefore not how to make a model speak more randomly. It is how to represent what the agent does not know, decide which distinction can change future action, commit long enough to test it, and recognize when the current vocabulary of explanations is inadequate.

## Citation

If you find this post useful, please cite it as:

<div class="citation-box">
Suwandi, R. C. (Sep 2026). Bayesian Exploration for LLM Agents. https://richardcsuwandi.github.io/blog/2026/bayesian-exploration-llm-agents/.
</div>

Or in BibTeX format:

```bibtex
@article{suwandi2026bayesian,
    title   = "Bayesian Exploration for LLM Agents",
    author  = "Suwandi, Richard Cornelius",
    year    = "2026",
    month   = "Sep",
    url     = "https://richardcsuwandi.github.io/blog/2026/bayesian-exploration-llm-agents/"
}
```
