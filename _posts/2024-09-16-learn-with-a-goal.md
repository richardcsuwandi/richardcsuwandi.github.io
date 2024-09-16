---
layout: post
title: Learning with a Goal
date: 2024-09-16 00:00:00 +0700
description: A unified perspective of Bayesian optimization and active learning
tags: [bayesian-optimization, active-learning]
categories:
giscus_comments: true
related_posts: false
thumbnail: /assets/img/target.jpeg
toc:
  sidebar: left
---
Traditionally, Bayesian optimization (BO) has been perceived as a technique for optimizing expensive objective functions through efficient data sampling, while active learning (AL) is often seen as a way to selectively query data to improve model performance. Recently, [Fiore et al.]((https://link.springer.com/article/10.1007/s11831-024-10064-z)) proposed a unified perspective of BO and AL, arguing that both can be viewed as adaptive sampling schemes guided by common learning principles toward a given optimization goal. In this post, we will explore the key ideas presented in the paper and discuss the implications of this unified perspective.

#### Goal-driven learning
*Goal-driven learning* can described as:
> a decision-making process in which each decision is made to acquire specific information about the system of interest that contributes the most to achieve a given a goal.
<!-- Accordingly, a *goal-driven learner* is an agent that makes decisions based on the current knowledge of the system, and acquires new information to accomplish a given goal while augmenting awareness about the system.-->

BO and AL can be regarded as goal-driven procedures, where a surrogate model is built to capture the behavior of a system or effectively inform an optimization procedure to minimize the given objective.  This goal-driven process seeks to determine the "best" location of the domain to acquire information about the system, and refine the surrogate model towards the goal. Mathematically, it can be formulated as:

$$
  x^* = \arg \min_{x \in \mathcal{X}} f(R(x))
$$

where $$f$$ is the objective and $$R(x)$$ is the response of the system. Here, $$f$$ may represent the error between the surrogate approximation and the response, such that the goal is to minimize the error to improve the accuracy of the surrogate. Alternatively, $$f$$ may also represents a performance indicator based on the response, so the goal is to minimize this indicator to improve the system’s performance.

#### Adaptive sampling
BO and AL use adaptive sampling schemes to efficiently accomplish a given goal while adapting to the previously collected information:
- In BO, the goal is to minimize the objective function by iteratively selecting the next location to sample based on the surrogate model. The surrogate model is updated after each sample to refine the approximation and guide the next decision.
- In AL, the goal is to minimize the generalization error of a model by iteratively selecting the next sample to improve the model's performance. The model is updated after each sample to refine the approximation and guide the next decision.

We can further classify adaptive sampling schemes into three main categories:
1. **Adaptive probing:** These methods do not rely on a surrogate model to assist the sampling procedure. Instead, they directly probe the system of interest to gather information, often in a sequential and adaptive manner.
2. **Adaptive modeling:** These approaches compute a surrogate model of the system, but the surrogate is not used to inform the sampling process. The model is built independently, and the sampling decisions are made without considering the surrogate information.
3. **Adaptive learning:** This category represents the goal-driven learning procedures, such as BO and pool-based AL, where the learner collects information from the surrogate model to make decisions towards a specific goal. Crucially, the surrogate model is then updated as a result of the learner's decisions, leading to a mutual exchange of information.

<p align="center">
  <img src="/assets/img/adaptive_sampling.png" style="max-width: 80%; height: auto;"/>
  <figcaption style="font-size: 0.9em; font-style: italic;">Classification of adaptive sampling techniques: Where adaptive sampling and active learning meet.</figcaption>
</p>
The key distinction between these categories lies in the concept of *goal-driven learning*, which is the distinctive element of the adaptive learning class. In this paradigm, the learner actively gathers information from the surrogate model to guide its decisions towards the desired goal, and the surrogate model is consequently improved by the outcome of these decisions. 

In contrast, the adaptive probing and adaptive modeling classes do not exhibit this goal-driven learning characteristic. Adaptive probing methods operate without the aid of a surrogate, while adaptive modeling approaches compute a surrogate that is not directly used to inform the sampling process.

#### Learning and infill criteria
The strong synergy between AL and BO is rooted in the substantial analogy between the learning criteria that drive the AL procedure and the infill criteria that characterize the BO scheme. 

Learning criteria establish a metric for quantifying the gains of all the possible learner decisions, and prescribe an optimal decision based in information acquired from the surrogate model. In AL, there are 3 essential learning criteria:
1. **Informativeness:** The sampling policy is driven by the goal of acquiring the *most informative samples*, i.e., the ones that are expected to contribute the maximum information.
2. **Representativeness:** The sampling policy aims to select *samples that are representative* of the target domain, exploiting the structure of the problem to direct queries to locations
3. **Diversity:** The sampling policy seeks to select *samples that are diverse*, i.e., well-spread across the domain, preventing the concentration of queries in small local regions.
<p align="center">
  <img src="/assets/img/learning_criteria.png" style="max-width: 100%; height: auto;"/>
<figcaption style="font-size: 0.9em; font-style: italic;">Illustration of the three learning criteria in watering optimization problem: (a) informativeness, (b) representativeness, and (c) diversity.</figcaption>
</p>

On the other hand, the infill criteria in BO provides a measure of the information gain that would result from sampling at a particular location. The most common infill criteria are:
1. **Global exploration:** This criterion focuses on choosing samples in regions of *high predictive uncertainty*, enhancing global awareness of the search space. However, this approach may not direct resources optimally towards the specific goal.
2. **Local exploitation:** This criterion prioritizes choosing samples in regions with *high predictive mean*, focusing the search on promising areas. Yet, it may result in less accurate knowledge of the overall objective function distribution.

Overall, we can observe a strong correspondence between the learning criteria in AL and the infill criteria in BO:
- **The "informativeness" criterion in AL aligns with the "local exploitation" criterion in BO**, as both aim to maximize the information gain.
- Similarly, **the "representativeness" and "diversity" criteria in AL correspond to the "global exploration" criterion in BO**, as they seek to ensure that the sampling process is well-distributed across the domain.

<p align="center">
  <img src="/assets/img/infill_criteria.png" style="max-width: 55%; height: auto;"/>
  <figcaption style="font-size: 0.9em; font-style: italic;">Relation between learning criteria in active learning and infill criteria in Bayesian optimization.</figcaption>
</p>

#### Takeaways
BO and AL have traditionally been viewed as distinct fields with separate goals and methodologies. However, this paper provides a unified perspective that highlights the shared principles underlying both fields. By recognizing the synergy between BO and AL, we can leverage the strengths of each field to develop more powerful and efficient learning algorithms.

#### References
- Di Fiore, F., Nardelli, M. and Mainini, L., 2024. [Active learning and Bayesian optimization: A unified perspective to learn with a goal](https://link.springer.com/article/10.1007/s11831-024-10064-z). *Archives of Computational Methods in Engineering*, pp.1-29.
