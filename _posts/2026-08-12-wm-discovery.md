---
layout: distill
title: "World Models for Scientific Discovery"
date: 2026-08-12 10:00:00 +0700
description: Why prediction alone is not discovery, and what world models need to support explanation, experimentation, and abduction
thumbnail: /assets/img/post_thumbnails/wm-discovery.png
tags: [WORLD MODELS, SCIENTIFIC DISCOVERY]
giscus_comments: true
related_posts: false
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
bibliography: 2026-08-12-wm-discovery.bib

# Add a table of contents to your post.
#   - make sure that TOC names match the actual section names
#     for hyperlinks within the post to work correctly.
#   - please use this format rather than manually creating a markdown table of contents.
toc:
  - name: Prediction is not discovery
    subsections:
      - name: The observational equivalence trap
      - name: Three scopes of world modeling
  - name: What must a scientific world model represent?
    subsections:
      - name: Variables, mechanisms, and structure
      - name: Organizing knowledge for reuse
  - name: The missing jump
    subsections:
      - name: Induction, deduction, and abduction
      - name: Abduction without mysticism
  - name: Discovery requires intervention
    subsections:
      - name: A Bayesian discovery loop
      - name: When the model class is wrong
  - name: From world models to agentic laboratories
  - name: A research agenda for autonomous science
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
Most AI systems are judged by a simple test: given observations they have not seen before, can they predict the right answer? A model can pass every such test, forecast the next observation, and reproduce familiar trajectories while still misunderstanding the system it describes. [Evaluations of LLMs for science](https://alphaxiv.org/abs/2512.15567) expose a related gap: even perfect performance on static, decontextualized questions does not establish readiness for discovery, which also demands iterative reasoning, hypothesis generation, and evidence interpretation<d-cite key="song2026sde"></d-cite>. Such tests reveal whether a model can produce the right answer, but not whether it can identify the variables and mechanisms behind that answer, anticipate the effects of an intervention, or explain what evidence would prove it wrong. The model may know what happens next without understanding why.

That gap matters because science advances by doing more than extending observed patterns. Scientists propose hidden mechanisms, design experiments that force competing explanations apart, and sometimes replace the very concepts with which a problem was framed. An autonomous scientific agent must therefore maintain a model that can be questioned and revised, not just queried for another prediction.

This is the role I envision for **scientific world models**. At their mechanistic core, they represent scientific systems through variables, mechanisms, their organization, and the interventions that can act upon them. A broader scientific layer connects this representation to hypotheses, evidence, instruments, protocols, and the changing physical state of experimentation. My central argument is that this shared, revisable model provides the missing epistemic foundation for autonomous science<d-footnote>Here, epistemic refers to how knowledge is organized: what the system believes, how strongly it holds those beliefs, which evidence supports them, and what observations would lead it to revise them.</d-footnote>. Language models can propose hypotheses, Bayesian methods can quantify uncertainty, and robots can execute protocols. A scientific world model brings these capabilities into a coherent discovery process by giving each of them the same representation to inspect, test, and revise.

<div class="box-note" markdown="1" title="Background">
This post focuses on world models as representations for scientific reasoning. Interested readers can refer to my previous post, [The Dream Machines](https://richardcsuwandi.github.io/blog/2025/dream-machines/), for a broader introduction to world models, latent dynamics, and generative interactive environments.
</div>

A world model alone will not make a machine a scientist. The system must still generate genuinely different explanations, choose and execute informative interventions, and recognize when its current vocabulary cannot express the answer. Yet without a shared model, hypotheses remain detached from experiments and experimental results have no coherent structure to revise. The world model is not the whole discovery process, but it is what allows that process to hold together as evidence accumulates.

<img src="{{ '/assets/img/scientific-world-model-stack.svg' | relative_url }}" alt="Three scopes of a scientific world model, from prediction through mechanisms to scientific inquiry and experimental action." class="center rounded z-depth-1 l-body" width="100%">
<div class="l-gutter caption" markdown="1">
**Figure 1.** A scientific world model connects three scopes: predictive dynamics, mechanistic explanation, and scientific inquiry grounded in experimental action. Autonomous discovery needs all three, but they solve different problems.
</div>

## Prediction is not discovery

Suppose a model learns a transition distribution

$$
p_\theta(x_{t+1}\mid x_{\leq t}, a_{\leq t}),
$$

where $$x_t$$ is an observation and $$a_t$$ is an action. If its predictions are accurate, the model can simulate possible futures and support planning<d-footnote>The term world model now covers several traditions, from compact latent simulators for control to large generative video models. Their shared idea is that an agent can use learned dynamics to evaluate possible futures before acting.</d-footnote>. An agent can then rehearse actions inside the model before paying their cost in the real world. The [classic world model](https://worldmodels.github.io/) formulation makes this idea concrete by separating the system into a compressed state representation, learned dynamics, and a controller<d-cite key="ha2018world"></d-cite>.

Accurate prediction, however, does not guarantee that the model represents the world in scientifically meaningful terms. One model might describe a trajectory using familiar quantities such as position, mass, and force, while another might reproduce the same trajectory using an opaque feature vector. If both are evaluated solely by prediction error, there may be no reason to prefer the interpretable representation over the opaque one.

[Vafa et al.](https://alphaxiv.org/abs/2507.06952) showed why this distinction has practical consequences by training foundation models to predict planetary motion and then probing the physical structure they had learned<d-cite key="vafa2025foundation"></d-cite>. Accurate orbital predictions did not imply that the models had recovered Newtonian mechanics: they could reproduce the visible trajectories while organizing the underlying system incorrectly. 

<img src="{{ '/assets/img/newtonian-forces.png' | relative_url }}" alt="True Newtonian force vectors compared with force vectors predicted by a transformer across the planets, alongside the true and recovered force laws." class="center rounded z-depth-1 l-body" width="100%">
<div class="l-gutter caption" markdown="1">
**Figure 2.** A transformer can approximate planetary force vectors across the Solar System while recovering a force law that differs sharply from Newton's inverse-square law. Accurate trajectories therefore do not guarantee that the model has learned the correct physical mechanism.
</div>

The example makes the distinction concrete because predictive performance tells us whether a model reproduces observations, whereas scientific usefulness depends on whether its internal organization supports explanation, intervention, falsification, and reuse. Optimizing only for predictive performance gives a system no reason to acquire those additional properties.

### The observational equivalence trap

Let $$M_1$$ and $$M_2$$ be two candidate mechanisms. It is possible that

$$
p(y\mid M_1, D_{\mathrm{obs}}) \approx p(y\mid M_2, D_{\mathrm{obs}})
$$

for every observation in the available dataset, while

$$
p(y\mid \operatorname{do}(a), M_1) \neq p(y\mid \operatorname{do}(a), M_2)
$$

under an intervention $$a$$<d-footnote>Pearl's notation do(<i>a</i>) distinguishes actively setting a variable from merely observing that it took the same value. The distinction matters whenever the observed value and the intervention have different causes.</d-footnote>. Passive data leave the mechanisms observationally equivalent, so distinguishing them requires a perturbation chosen to make their predictions diverge. Causal knowledge therefore cannot, in general, be reduced to a sufficiently flexible curve fit<d-cite key="pearl2009causality"></d-cite>.

The same ambiguity arises across scientific domains. Two biochemical pathways may produce the same steady-state expression profile yet respond differently to a knockout. Two force laws may approximate the same short orbit yet diverge when the charge or initial conditions change. A spurious biomarker may predict an outcome as accurately as a causal driver in the hospital where the data were collected, only to behave differently under a new treatment policy.

A scientific model should therefore be judged not only by its performance on held-out samples drawn from the same process, but also by whether its explanations remain valid under deliberately chosen changes to that process.

### Three scopes of world modeling

The term **world model** is now broad enough to describe several different objects. For scientific discovery, it helps to distinguish them as follows:

| Model | What it represents | Central question | Capability added |
|---|---|---|---|
| Predictive world model | State and dynamics | What happens next? | Prediction and planning |
| Mechanistic world model | Variables, mechanisms, their composition, and possible interventions | Why does it happen, and what changes under intervention? | Explanation, intervention, and transfer |
| Scientific world model | Mechanisms and scientific beliefs linked to samples, instruments, protocols, provenance, and physical state | What should we investigate next, and can we do so reliably? | Experiment selection and execution, provenance tracking, and belief revision |

<div class="l-gutter caption" markdown="1">
**Table 1.** Three scopes of world modeling, distinguished by what they represent and the questions they answer.
</div>

These models describe progressively broader scopes. A predictive model can operate without an explicit mechanism, while a mechanistic model adds explanatory structure and intervention semantics. A **scientific world model** then connects that mechanistic account to the changing material context in which experiments are selected, executed, and interpreted. Each broader scope incorporates the capabilities below it while adding new state and new criteria for success.

## What must a scientific world model represent?

[Posner, Lei, and Schölkopf](https://alphaxiv.org/abs/2607.12474) propose **mechanistic world models** (MWMs), which organize representations around the reusable mechanisms that generate observations rather than around the observations alone<d-cite key="posner2026mechanistic"></d-cite>. In this view, a model represents scientifically meaningful variables and mechanisms in a form that allows them to be composed, tested through intervention, and reused across related systems.

One way to formalize this idea is

$$
\mathcal{W} = (\mathcal{V}, \mathcal{F}, \mathcal{G}, \Theta, \mathcal{U}),
$$

where $$\mathcal{V}$$ is a set of variables, $$\mathcal{F}=\{f_k\}$$ is a library of mechanisms, $$\mathcal{G}$$ is the structure that binds them together, $$\Theta$$ contains their uncertain parameters, and $$\mathcal{U}$$ is the set of admissible interventions. Observations arise from this organized system rather than from a single monolithic map.

This decomposition supports five scientific operations:

1. **Prediction:** run the composed model forward.
2. **Explanation:** identify which variables and mechanisms produced an outcome.
3. **Intervention:** modify a variable, mechanism, or connection and simulate the result.
4. **Transfer:** reuse a mechanism in a new system with a different binding structure.
5. **Revision:** change parameters, replace a mechanism, or reorganize the structure when evidence disagrees.

<img src="{{ '/assets/img/wm-vs-mwm.png' | relative_url }}" alt="A traditional predictive world model compared with a mechanistic world model built from variables, reusable mechanisms, and binding structures." class="center rounded z-depth-1 l-body" width="100%">
<div class="l-gutter caption" markdown="1">
**Figure 3.** A predictive world model learns a monolithic transition through latent states. A mechanistic world model instead binds reusable mechanisms to scientifically meaningful variables, allowing related environments to share explanatory structure. Source: Posner, Lei, and Schölkopf<d-cite key="posner2026mechanistic"></d-cite>.
</div>


### Variables, mechanisms, and structure

**Variable discovery** comes first because scientific variables are more than compressed observations or features with high predictive weight. They are abstractions chosen for the stable relationships they reveal. Temperature, for example, is useful because many physical mechanisms take a simpler form when expressed in terms of it. Likewise, a reaction coordinate makes progress through a chemical transformation easier to describe. If the variables are poorly chosen, even the correct law may appear needlessly complicated or become impossible to express.

**Mechanism discovery** seeks a reusable account of how change occurs. That account might take the form of an equation, causal module, program, stochastic transition, or structured neural operator. It need not be fully symbolic, as long as its boundaries are clear and it supports well-defined reasoning about interventions. [Causal representation learning](https://alphaxiv.org/abs/2102.11107), [equation discovery](https://alphaxiv.org/abs/1905.11481), modular architectures, and mechanistic interpretability each address a different part of this problem<d-cite key="scholkopf2021causalrepr"></d-cite><d-cite key="udrescu2020aifeynman"></d-cite><d-cite key="olah2020circuits"></d-cite>.

Appropriate variables and mechanisms are still not enough. **Structure discovery** determines which mechanisms act on which variables, how they compose, and at what scale. Even a library of correct parts explains little until those parts are bound into a coherent system. Conversely, a plausible structure can still recommend the wrong intervention if one of its mechanisms is misspecified.

<img src="{{ '/assets/img/representation-discovery.svg' | relative_url }}" alt="A progression from raw observations to scientific variables, reusable mechanisms, and binding structure, with interventions testing the representation." class="center rounded z-depth-1 l-body" width="100%">
<div class="l-gutter caption" markdown="1">
**Figure 4.** Representation discovery has three coupled targets: variables define the state, mechanisms describe how it changes, and structure specifies how those mechanisms compose. Interventions test whether these elements work together to account for changes in the system.
</div>

<div class="box-warning" markdown="1" title="Mechanistic does not mean symbolic">
Equations are easy to inspect, but symbolic form is neither necessary nor sufficient for scientific understanding. A neural mechanism can be scientifically useful if it is modular, stable, calibrated, and meaningful under intervention. Conversely, a compact equation may offer little scientific value if it relies on a spurious variable or holds only within a narrow regime.
</div>

### Organizing knowledge for reuse

Although modular mechanisms are easier to interpret, their greater scientific value lies in **compositional generalization**. A mechanism learned once can help explain many phenomena. Diffusion reappears in heat, particles, populations, and information, conservation principles travel across systems, and receptor binding, feedback, and inhibition recur throughout biology.

If a mechanism $$f_k$$ appears across environments $$e=1,\ldots,E$$, learning it as a shared object amortizes its cost. Each environment needs only a new binding or a small set of parameters. This resembles minimum-description-length reasoning: pay once to encode the reusable mechanism, then cheaply specify where it applies<d-cite key="rissanen1978mdl"></d-cite>.

<img src="{{ '/assets/img/mechanism-reuse.svg' | relative_url }}" alt="A reusable mechanism shared across three environments with different variables, binding structures, and parameters." class="center rounded z-depth-1 l-body" width="100%">
<div class="l-gutter caption" markdown="1">
**Figure 5.** Compositional generalization reuses a stable mechanism across environments. Instead of learning three unrelated predictors, the model retains $$f_k$$ and specifies only the variables, binding structure, and parameters that differ in each system.
</div>

This gives a concrete test for a scientific abstraction: does it make many systems simpler without erasing the differences that matter? A good mechanism should support reuse, sparse recombination, and targeted modification. Whereas a monolithic predictor must relearn the whole mapping whenever the environment changes, a mechanistic model can ask which module changed.

Modularity also creates a subtler danger: explanations can *look* scientific merely because they contain named parts and arrows. The architecture supplies a grammar of explanation, not a guarantee that the explanation is true, so a proposed mechanism earns its status only by surviving interventions designed to distinguish it from plausible alternatives.

## The missing jump

If the goal were merely to select the best model from a complete list, scientific discovery would reduce to Bayesian bookkeeping<d-footnote>By Bayesian bookkeeping, I mean updating posterior probabilities over a fixed set of candidate models as evidence arrives. This can identify which existing candidate is best supported, but it cannot introduce a missing variable, mechanism, or explanatory language.</d-footnote>. In practice, the explanation that matters is often absent from the list, and discovery begins precisely when the existing hypothesis space proves inadequate.

Zahavy frames this through Einstein's description of invention as a jump from sense experience to axioms<d-cite key="zahavy2026llmscantjump"></d-cite>. The provocative claim is that contemporary generative models are strong at induction and increasingly strong at deduction, but lack the abductive move that invents a new explanatory premise<d-footnote>“LLMs can't jump” is best read as a position to test, not a theorem about model classes. Systems can clearly generate unfamiliar combinations. The open question is whether they can originate a well-grounded explanatory frame, recognize when it is needed, and validate it against the world without a human first specifying the problem.</d-footnote>.

<img src="{{ '/assets/img/llm-jump.png' | relative_url }}" alt="A conceptual sketch in which scientific invention requires a jump from sense experience to a system of axioms before deduction can produce testable consequences." class="center rounded z-depth-1 l-body" width="100%">
<div class="l-gutter caption" markdown="1">
**Figure 6.** Deduction moves from axioms to consequences, but invention must first propose the axioms that organize experience. Zahavy calls this abductive step the jump that current language models still struggle to ground and validate<d-cite key="zahavy2026llmscantjump"></d-cite>.
</div>

### Induction, deduction, and abduction

The three modes of inference play different roles:

| Mode | Schematic move | Role in discovery |
|---|---|---|
| Deduction | rule + case $$\rightarrow$$ result | Derive predictions and check logical consequences |
| Induction | cases + results $$\rightarrow$$ rule | Learn recurring regularities from data |
| Abduction | surprising result $$\rightarrow$$ possible explanation | Propose a mechanism that would make the result intelligible |

<div class="l-gutter caption" markdown="1">
**Table 2.** Scientific discovery is not one kind of inference. It cycles among generating explanations, deriving consequences, and testing them against experience.
</div>

Einstein's equivalence principle is the canonical illustration because its decisive step did not come from fitting a large dataset. Einstein imagined the experience of a freely falling observer and proposed that uniform acceleration and a gravitational field were locally indistinguishable, thereby changing which concepts should be treated as equivalent before the later mathematics unfolded their consequences.

This example also exposes a limitation of text-only scientific agents. The scientific literature records the products of past discovery, including names, equations, arguments, and experimental reports, but captures much less of the sensorimotor and tacit process by which new concepts were formed. An LLM can recombine recorded theories and propose valuable hypotheses, yet fluency in the archive does not by itself ground a new variable in the world.

### Abduction without mysticism

Still, “the jump” should not become a label for an irreducibly human miracle. We can decompose it into computational capabilities:

- Detect an anomaly or inconsistency that the current model cannot absorb.
- Construct counterfactual situations, including experiments never observed.
- Retrieve distant analogies and compose mechanisms across domains.
- Propose new variables, mechanism boundaries, or structural relations.
- Prefer hypotheses that are coherent, reusable, and testable.
- Derive observations that would distinguish the new account from its rivals.

World models connect abduction to evidence by allowing a candidate idea to be simulated, subjected to interventions, and compared with reality. The hypothesis must then produce testable consequences rather than merely sound plausible in language.

<div class="box-important" markdown="1" title="Integrating Generative and Mechanistic Models">
Current AI scientists can propose hypotheses and equations, but they rarely couple that generative capacity to a disciplined, revisable model of the world. Without such a model, hypothesis generation remains speculative. Without a source of new hypotheses, world model learning remains system identification. Scientific discovery requires each process to challenge the other.
</div>

## Discovery requires intervention

Once we admit multiple explanations, the next scientific question is not “Which one best fits the data?” but “Which experiment would most efficiently make them disagree?” Experiments are epistemic actions: they change the world in order to change what we know about it.

### A Bayesian discovery loop

Let $$M$$ denote model structure, $$\theta$$ its parameters, and $$D$$ the evidence collected so far. The agent maintains

$$
p(M,\theta\mid D) \propto p(D\mid M,\theta)p(\theta\mid M)p(M).
$$

An experiment $$\xi$$ specifies an intervention, initial condition, and measurement protocol. A classical Bayesian design chooses the experiment with the largest expected reduction in uncertainty<d-cite key="lindley1956information"></d-cite><d-cite key="chaloner1995bayesian"></d-cite>:

$$
\xi^* = \arg\max_{\xi}\, \mathbb{E}_{y\sim p(y\mid \xi,D)}
\left[H[p(M,\theta\mid D)]-H[p(M,\theta\mid D,\xi,y)]\right].
$$

The objective favors actions whose possible outcomes would reduce uncertainty the most, although information gain is only one possible design criterion<d-footnote>Depending on the scientific goal, an experiment may instead minimize expected decision regret, distinguish among a small set of models, or estimate one particularly important parameter.</d-footnote>. Cost, time, safety, feasibility, and scientific value also matter, and the most discriminating experiment may require an unavailable instrument or destroy a unique sample.

Kevin Murphy's [Model Discovery Agent](https://alphaxiv.org/abs/2608.09696) (MDA) gives this loop a concrete form<d-cite key="murphy2026mda"></d-cite>. It uses an LLM to propose mechanisms, Bayesian inference to compare them, and value of information to choose the next experiment<d-footnote>More specifically, MDA uses sequential Monte Carlo for posterior inference over parameters and structures, simulation-based inference when the likelihood is unavailable, and posterior predictive checks to detect model inadequacy. It is evaluated on interactive benchmarks spanning force laws, chemical kinetics, and partially observed neuron dynamics.</d-footnote>. Its main contribution is to show how **proposal, inference, and experiment design can reinforce one another** inside a single loop.

<img src="{{ '/assets/img/model-discovery-agent.png' | relative_url }}" alt="The Model Discovery Agent loop connecting hypothesis generation, posterior inference, experiment design, experiment execution, and forecasting." class="center rounded z-depth-1 l-body" width="100%">
<div class="l-gutter caption" markdown="1">
**Figure 7.** The Model Discovery Agent alternates between proposing models, comparing their posterior support, selecting an informative intervention, and incorporating the result into the next round. The LLM proposes hypotheses, while probabilistic inference and experimental feedback constrain them<d-cite key="murphy2026mda"></d-cite>.
</div>

### When the model class is wrong

Standard Bayesian model selection often assumes that the true mechanism, or at least a useful approximation, exists among the candidates, an assumption that scientific inquiry frequently violates. MDA instead works in an **M-open** setting, where every current model may be wrong<d-footnote>In an M-closed problem, the true model is assumed to be in the candidate set. In an M-complete problem it is unavailable but treated as approximable by that set. In an M-open problem, no such adequate candidate is assumed to exist, so model criticism and hypothesis-space expansion are part of inference rather than afterthoughts.</d-footnote>. Posterior predictive checks determine whether the best available explanation can reproduce held-out behavior, and systematic failure prompts the agent to propose alternatives.

This separates three kinds of revision:

1. **Parameter revision:** the structure is adequate, but its constants are uncertain.
2. **Structural revision:** the mechanisms are available, but connected incorrectly.
3. **Vocabulary revision:** the necessary variable or mechanism is missing altogether.

Parameter revision is an estimation problem, while structural revision searches for a better explanation within an existing language. Vocabulary revision is harder because the system must enlarge the language in which explanations can be expressed.

<img src="{{ '/assets/img/open-discovery-loop.svg' | relative_url }}" alt="An open-ended scientific discovery loop with model expansion after predictive failure." class="center rounded z-depth-1 l-body" width="100%">
<div class="l-gutter caption" markdown="1">
**Figure 8.** An open discovery loop must do more than update beliefs inside a fixed hypothesis space. When every available model fails, it must revise the space by proposing a new variable, mechanism, or explanatory vocabulary.
</div>

MDA is an important proof of concept, but its proposer receives a domain-specific physical vocabulary and a constrained experimental interface. These choices make controlled evaluation possible while leaving the hardest representational question unresolved: how can a system recognize that its current vocabulary is itself the problem?

<div class="box-warning" markdown="1" title="A failed prediction is ambiguous">
A residual may indicate a wrong parameter, a missing mechanism, corrupted data, instrument drift, an unrecorded intervention, or irreducible noise. Adding a mechanism after every surprise produces unwarranted complexity, while dismissing every surprise as noise prevents discovery. A capable system must gather enough evidence to distinguish among these possibilities.
</div>

## From world models to agentic laboratories

A discovery loop on a benchmark interacts with a clean simulator, whereas a laboratory confronts calibration histories, contaminated samples, queueing constraints, tacit knowledge, and measurements whose reliability is itself uncertain. [A recent critique](https://alphaxiv.org/abs/2605.08956) argues that adding more tools or a longer context window cannot close this gap because the limitations span problem selection, hypothesis diversity, experimental execution, and learning from physical feedback<d-cite key="bisht2026agenticscientists"></d-cite>.

The recent vision of [**agentic laboratories**](https://doi.org/10.20944/preprints202608.0213.v1) treats the laboratory as a human-AI-robot system coordinated through a persistent, shared world model<d-cite key="fu2026agenticlabs"></d-cite>. The paper is an architectural proposal rather than an established recipe, and its focus is the coordination problem that appears when scientific reasoning meets physical execution.

An agentic laboratory needs two coupled representations. The **scientific-system model** describes the object of inquiry, including its hypotheses, causal variables, mechanisms, uncertainty, and expected responses to intervention. The **physical-action model** describes the experiment itself, including sample identity, instrument state, environmental conditions, protocol progress, and failure modes<d-footnote>A digital twin can represent a particular instrument, sample, or process. A scientific world model is broader because it connects such local representations to hypotheses, provenance, and plans for an experimental campaign.</d-footnote>.

Conflating these representations creates two failure modes. An agent may design a decisive experiment that cannot be executed reliably, or execute a flawless protocol whose result says nothing about the disputed mechanism. Scientific autonomy requires both forms of competence and a reliable correspondence between them.

<img src="{{ '/assets/img/coupled-scientific-world-model.svg' | relative_url }}" alt="A scientific-system model and physical-action model exchange experimental intent and grounded evidence through a harnessing layer." class="center rounded z-depth-1 l-body" width="100%">
<div class="l-gutter caption" markdown="1">
**Figure 9.** A scientific world model couples beliefs about the object of inquiry to the physical state of experimentation. The harnessing layer translates scientific intent into constrained action and returns observations, failures, and provenance to the scientific model.
</div>

Within this architecture, the **agentic harnessing layer** translates hypotheses into feasible protocols, checks physical constraints, records provenance, and updates scientific beliefs after each observation. The scientific world model therefore also serves as institutional memory. It records what happened alongside what is believed, which assumptions remain fragile, and what evidence could change them.

Experiment selection still assumes that the system already knows what question to pursue. [Van der Schaar](https://www.vanderschaar-lab.com/open-beginningness/) calls the earlier decision to treat a phenomenon as worthy of inquiry **open-beginningness**<d-cite key="vanderschaar2026openbeginning"></d-cite>. A persistent world model can retain weak effects, protocol deviations, and unresolved observations until recurrence or new evidence makes them meaningful. It can then recommend a cheap triage experiment before redirecting an entire research program.

<div class="box-important" markdown="1" title="From experiment selection to problem formation">
Expected information gain answers, “Which experiment best separates the hypotheses I already have?” Open-beginningness asks, “Which observation deserves hypotheses in the first place?” An autonomous laboratory needs both. Otherwise it may optimize its experimental loop indefinitely around a question that is measurable and tractable but scientifically unimportant.
</div>

Evidence from 41.3 million papers suggests that AI tools can raise individual productivity and citations while narrowing the collective range of topics studied<d-cite key="hao2026focus"></d-cite>. The result is observational, but it warns that faster search within machine-friendly questions may still shrink the frontier of questions pursued. A scientific world model should therefore represent uncertainty about the current objective, not only uncertainty about the system under study.

## A research agenda for autonomous science

The preceding sections point to four research problems that form a cycle rather than independent modules on a checklist. A system needs a representation before it can formulate hypotheses, inquiry to decide how that representation should be tested, physical grounding to obtain trustworthy evidence, and evaluation to determine whether the resulting update deserves confidence. Evidence then returns to the representation, where it may change a parameter, a mechanism, or the vocabulary itself.

<img src="{{ '/assets/img/autonomous-science-research-agenda.svg' | relative_url }}" alt="Four connected research problems for autonomous science: representation, inquiry, grounding, and evaluation and governance." class="center rounded z-depth-1 l-body" width="100%">
<div class="l-gutter caption" markdown="1">
**Figure 10.** The research agenda is a closed loop. Representation enables hypotheses, inquiry selects experiments, grounding returns evidence, and evaluation determines how that evidence should revise the model. Governance constrains what the system may test and when human judgment is required.
</div>

The cycle begins with **representation**. Most systems assume that the relevant variables, intervention targets, and scales are already known, although discovery often changes exactly these objects. A scientific world model must be able to propose new variables, connect mechanisms across levels of abstraction, and state where assumptions enter. Otherwise, every later stage is confined to the ontology chosen by its designers.

That representation defines the starting point for **inquiry**, in which the system generates genuinely different causal explanations and chooses experiments that distinguish among them. This requires more than sampling several language models, since shared training data and [preference optimization](https://alphaxiv.org/abs/2310.06452) can pull apparently independent agents toward familiar hypotheses<d-cite key="bisht2026agenticscientists"></d-cite><d-cite key="kirk2024rlhfdiversity"></d-cite>. A capable system should [actively seek evidence that could falsify its favored account](https://alphaxiv.org/abs/2502.09858) instead of choosing only experiments likely to improve its score<d-cite key="huang2025popper"></d-cite>.

Inquiry becomes scientifically useful only through **grounding**. Experiments are scarce, costly, and path-dependent, so the model must learn from few interventions while tracking how each result was produced. It must recognize simulation-to-reality gaps, retain tacit and failed-procedure knowledge, and recover from execution errors without corrupting the scientific record. Without this connection to physical state, an elegant mechanistic explanation may rest on an unnoticed calibration error or a mislabeled sample.

The final problem is **evaluation and governance**. Prediction accuracy alone does not show whether a model supports discovery. Evaluation must also test interventional accuracy, mechanism recovery, calibration under misspecification, compositional transfer, experimental efficiency, execution reliability, and reproducibility<d-footnote>A realistic benchmark should also be multi-step, path-dependent, physically grounded, and able to revise its objective as evidence accumulates.</d-footnote>. These criteria cannot be separated from governance, because the model's representation determines what the system records, ignores, and optimizes. Provenance, permissions, stopping conditions, and human approval must therefore shape the discovery loop from the beginning.

Progress on any one problem changes the demands on the others. Better representations create more informative interventions, but those interventions matter only if they can be executed and interpreted reliably. Better laboratory automation produces more data, but its scientific value depends on whether the system can use those data to reject or revise an explanation. The research target is therefore not four isolated components, but a world model that keeps the entire cycle coherent as evidence accumulates.

## Takeaways

The common picture of autonomous science places a robot at the bench and a language model above it, replacing one human task after another until the loop closes. This task-automation view misses the harder problem because science is also a process for deciding which representations, questions, interventions, and explanations deserve trust.

Mechanistic world models would make that process more explicit without removing scientists from it. A shared model can expose assumptions that were previously scattered across notebooks and individual memory, preserve uncertainty across handoffs, compare theories against interventions, and keep experimental execution coupled to scientific intent. In turn, scientists may spend less time on routine coordination and more on the parts of discovery that remain difficult to formalize: framing questions, noticing meaningful anomalies, judging explanations, inventing measurements, and deciding which risks are worth taking.

For the foreseeable future, the right principle is not merely *human in the loop*, which imagines a person waiting to rescue a machine. It is **human in the lead**: humans set the scientific and ethical direction, while agents maintain models, execute bounded actions, and surface the moments where judgment is required.

The most consequential scientific world model may therefore be judged less by how accurately it predicts familiar observations than by whether it helps us choose experiments that change how we understand them.

## Citation

If you find this post useful, please cite it as:

<div class="citation-box">
Suwandi, R. C. (Aug 2026). World Models for Scientific Discovery. https://richardcsuwandi.github.io/blog/2026/wm-discovery/.
</div>

Or in BibTeX format:

```bibtex
@article{suwandi2026wmdiscovery,
    title   = "World Models for Scientific Discovery",
    author  = "Suwandi, Richard Cornelius",
    year    = "2026",
    month   = "Aug",
    url     = "https://richardcsuwandi.github.io/blog/2026/wm-discovery/"
}
```
