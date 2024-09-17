---
layout: distill
title: Gaussian Process in Action
date: 2021-09-21 00:00:00 +0700
description: Building a Gaussian process model with GPyTorch
tags: [gaussian-process, machine-learning]
categories: tutorial
giscus_comments: true
related_posts: false
thumbnail: /assets/img/gpr.png
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
bibliography:

# Add a table of contents to your post.
#   - make sure that TOC names match the actual section names
#     for hyperlinks within the post to work correctly.
#   - please use this format rather than manually creating a markdown table of contents.
toc:
  - name: Setup
  - name: Generating the data
  - name: Building the model
  - name: Training the model
  - name: Making predictions
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
---

<div style="display: none">
$$
\definecolor{input}{rgb}{0.42, 0.55, 0.74}
\definecolor{params}{rgb}{0.51,0.70,0.40}
\definecolor{output}{rgb}{0.843, 0.608, 0}
\def\mba{\boldsymbol a}
\def\mbb{\boldsymbol b}
\def\mbc{\boldsymbol c}
\def\mbd{\boldsymbol d}
\def\mbe{\boldsymbol e}
\def\mbf{\boldsymbol f}
\def\mbg{\boldsymbol g}
\def\mbh{\boldsymbol h}
\def\mbi{\boldsymbol i}
\def\mbj{\boldsymbol j}
\def\mbk{\boldsymbol k}
\def\mbl{\boldsymbol l}
\def\mbm{\boldsymbol m}
\def\mbn{\boldsymbol n}
\def\mbo{\boldsymbol o}
\def\mbp{\boldsymbol p}
\def\mbq{\boldsymbol q}
\def\mbr{\boldsymbol r}
\def\mbs{\boldsymbol s}
\def\mbt{\boldsymbol t}
\def\mbu{\boldsymbol u}
\def\mbv{\boldsymbol v}
\def\mbw{\textcolor{params}{\boldsymbol w}}
\def\mbx{\textcolor{input}{\boldsymbol x}}
\def\mby{\boldsymbol y}
\def\mbz{\boldsymbol z}
\def\mbA{\boldsymbol A}
\def\mbB{\boldsymbol B}
\def\mbE{\boldsymbol E}
\def\mbH{\boldsymbol{H}}
\def\mbK{\boldsymbol{K}}
\def\mbP{\boldsymbol{P}}
\def\mbR{\boldsymbol{R}}
\def\mbW{\textcolor{params}{\boldsymbol W}}
\def\mbQ{\boldsymbol{Q}}
\def\mbV{\boldsymbol{V}}
\def\mbtheta{\textcolor{params}{\boldsymbol \theta}}
\def\mbzero{\boldsymbol 0}
\def\mbI{\boldsymbol I}
\def\cF{\mathcal F}
\def\cH{\mathcal H}
\def\cL{\mathcal L}
\def\cM{\mathcal M}
\def\cN{\mathcal N}
\def\cX{\mathcal X}
\def\cY{\mathcal Y}
\def\cU{\mathcal U}
\def\bbR{\mathbb R}
\def\y{\textcolor{output}{y}}
$$
</div>

Gaussian processes (GPs) are a powerful yet often underappreciated model in machine learning. As a non-parametric and Bayesian approach, GPs are particularly effective for supervised learning tasks such as regression and classification. Compared to other algorithms, GPs offer several practical advantages:
- They perform well even with small datasets.
- They provide uncertainty quantification for predictions.

In this tutorial, we will implement GP regression using GPyTorch, a GP library built on PyTorch that is designed for creating scalable and flexible GP models. To learn more about GPyTorch, I recommend visiting their [official website](https://gpytorch.ai/).

<aside class="l-body box-warning" markdown="1">
**Note:** If you want to follow along with this tutorial, you can find the notebook [here](https://github.com/richardcsuwandi/gp/blob/main/GP%20Regression%20using%20GPyTorch.ipynb).
</aside>

## Setup
Before we begin, we need to install the `gpytorch` library. You can do this using either `pip` or `conda` with the following commands:

```bash
pip install gpytorch # using pip
conda install gpytorch -c gpytorch # using conda
```

## Generating the data
Next, we will generate training data for our model by modeling the following function:

$$
y = \sin{(2\pi x)} + \epsilon, \epsilon \sim \mathcal{N}(0,0.04)
$$

We will evaluate this function at 15 equally spaced points in the interval $$[0,1]$$. The generated training data is illustrated in the following plot:

<img src="{{ '/assets/img/gpr_data.png' | relative_url }}" alt="transformer" class="center" width="60%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 1.** The generated training data by evaluating the true function on 15 equally-spaced points from $$[0,1]$$.
</div>

## Building the model
Now that we have our training data, we can start building our GP model. GPyTorch provides a flexible framework for constructing GP models, similar to building neural networks in standard PyTorch. For most GP regression models, you will need to create the following components:

<aside class="l-body box-note" markdown="1">
- **A GP model:** For exact (non-variational) GP models, use `gpytorch.models.ExactGP`.
- **A likelihood function:** For GP regression, we typically use `gpytorch.likelihoods.GaussianLikelihood`.
- **A mean function:** This serves as the prior mean of the GP. If you're unsure which mean function to use, `gpytorch.means.ConstantMean` is a good starting point.
- **A kernel function:** This defines the prior covariance of the GP. For this tutorial, we will use the [spectral mixture (SM)](https://arxiv.org/pdf/1302.4245.pdf) kernel (`gpytorch.kernels.SpectralMixtureKernel`).
- **A multivariate normal distribution:** Represented by `gpytorch.distributions.MultivariateNormal`.
</aside>

We can build our GP model by assembling these components as follows:

{% details Show code %}
```python
class SpectralMixtureGP(gpytorch.models.ExactGP):
    def __init__(self, x_train, y_train, likelihood):
        super(SpectralMixtureGP, self).__init__(x_train, y_train, likelihood)
        self.mean = gpytorch.means.ConstantMean() # Construct the mean function
        self.cov = gpytorch.kernels.SpectralMixtureKernel(num_mixtures=4) # Construct the kernel function
        self.cov.initialize_from_data(x_train, y_train) # Initialize the hyperparameters from data

    def forward(self, x):
        # Evaluate the mean and kernel function at x
        mean_x = self.mean(x)
        cov_x = self.cov(x)
        # Return the multivariate normal distribution using the evaluated mean and kernel function
        return gpytorch.distributions.MultivariateNormal(mean_x, cov_x) 

# Initialize the likelihood and model
likelihood = gpytorch.likelihoods.GaussianLikelihood()
model = SpectralMixtureGP(x_train, y_train, likelihood)
```
{% enddetails %}

Here's a breakdown of the code:
<aside class="l-body box-important" markdown="1">
- The GP model consists of two main components: the `__init__` and `forward` methods.
- The `__init__` method initializes the model with training data and a likelihood, constructing necessary objects like the mean and kernel functions.
- The forward method takes the input data `x` and returns a multivariate normal distribution based on the evaluated mean and covariance.
- We initialize the likelihood function for the GP model using the Gaussian likelihood, which assumes a homoskedastic noise model (i.e., uniform noise across inputs).
</aside>

## Training the model
With the model built, we can now train it to find the optimal hyperparameters. Training a GP model in GPyTorch is akin to training a neural network in standard PyTorch. The training loop involves the following steps:

- Setting all parameter gradients to zero.
- Calling the model to compute the loss.
- Backpropagating the loss to compute gradients.
- Taking a step with the optimizer.

<aside class="l-body box-warning" markdown="1">
**Remark:** By creating a custom training loop, we gain greater flexibility in training, such as saving parameters at each step or using different learning rates for different parameters.
</aside>

Here's the code for the training loop:
{% details Show code %}
```python
# Put the model into training mode
model.train()
likelihood.train()

# Use the Adam optimizer, with learning rate set to 0.1
optimizer = torch.optim.Adam(model.parameters(), lr=0.1)

# Use the negative marginal log-likelihood as the loss function
mll = gpytorch.mlls.ExactMarginalLogLikelihood(likelihood, model)

# Set the number of training iterations
n_iter = 50

for i in range(n_iter):
    # Set the gradients from previous iteration to zero
    optimizer.zero_grad()
    # Output from model
    output = model(x_train)
    # Compute loss and backprop gradients
    loss = -mll(output, y_train)
    loss.backward()
    print('Iter %d/%d - Loss: %.3f' % (i + 1, n_iter, loss.item()))
    optimizer.step()
```
{% enddetails %}

In this code, we first set our model to training mode. Then, we define the loss function and optimizer to use during training. We use the negative marginal log-likelihood as the loss and Adam as the optimizer, running the loop for 50 iterations.

## Making predictions
Finally, we can make predictions with the trained model. The routine for evaluating the model and generating predictions is as follows:

{% details Show code %}
```python
# The test data is 50 equally-spaced points from [0,5]
x_test = torch.linspace(0, 5, 50)

# Put the model into evaluation mode
model.eval()
likelihood.eval()

# The gpytorch.settings.fast_pred_var flag activates LOVE (for fast variances)
# See https://arxiv.org/abs/1803.06058
with torch.no_grad(), gpytorch.settings.fast_pred_var():
    # Obtain the predictive mean and covariance matrix
    f_preds = model(x_test)
    f_mean = f_preds.mean
    f_cov = f_preds.covariance_matrix

    # Make predictions by feeding model through likelihood
    observed_pred = likelihood(model(x_test))

    # Initialize plot
    f, ax = plt.subplots(1, 1, figsize=(8, 6))
    # Get upper and lower confidence bounds
    lower, upper = observed_pred.confidence_region()
    # Plot training data as black stars
    ax.plot(x_train.numpy(), y_train.numpy(), 'k*')
    # Plot predictive means as blue line
    ax.plot(x_test.numpy(), observed_pred.mean.numpy(), 'b')
    # Shade between the lower and upper confidence bounds
    ax.fill_between(x_test.numpy(), lower.numpy(), upper.numpy(), alpha=0.5)
    ax.set_ylim([-3, 3])
    ax.legend(['Observed Data', 'Mean', 'Confidence'])
    plt.show()
```
{% enddetails %}

The above code performs several things:
<aside class="l-body box-important" markdown="1">
- It generates test data using 50 equally spaced points from $$[0, 5]$$.
- The model is set to evaluation mode, and we utilize `gpytorch.settings.fast_pred_var()` for faster predictive distributions.
- The trained GP model returns a MultivariateNormal distribution containing the posterior mean and covariance, from which we extract the predictive mean and covariance matrix.
- Finally, we plot the mean and confidence region of the fitted GP model. The `confidence_region()` method provides the upper and lower bounds, representing two standard deviations above and below the mean.
</aside>

The resulting plot is shown below:

<img src="{{ '/assets/img/gpr_pred.png' | relative_url }}" alt="transformer" class="center" width="60%" class="l-body rounded z-depth-1 center">
<div class="l-gutter caption" markdown="1">
**Figure 2.** Plot of the fitted GP model given by the mean (blue line) and confidence region (shaded area). The observed data (black stars) is also plotted in the figure.
</div>

In this plot, the black stars (★) represent the training (observed) data, while the blue line and shaded area (🟦) indicate the mean and confidence bounds, respectively. Notice how the uncertainty decreases near the observed points. If we added more data points, we would see the mean function adjust to pass through them, further reducing uncertainty close to the observations.

## Takeaways
In this tutorial, we learned how to build a GP model using GPyTorch. There are many additional [features](https://docs.gpytorch.ai/en/latest/) in GPyTorch that I did not cover here. I hope this tutorial serves as a solid foundation for you to explore GPyTorch and Gaussian processes further.