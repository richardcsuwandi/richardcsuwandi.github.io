---
layout: page
title: Projects
permalink: /projects/
description: A collection of my open-source projects and research code
nav: true
nav_order: 1
display_categories:
horizontal: false
---

<!-- pages/projects.md -->

<style>
/* This page renders inside .container (default.liquid), capped at 1140px by
    _base.scss, unlike the About page's uncapped .wide-about-container.
    Widen it here so the project cards have more room. */
.container.mt-5 {
    max-width: 75% !important;
}

@media (max-width: 768px) {
    .container.mt-5 {
        max-width: 95% !important;
    }
}

/* Match the description font size to the Research page's intro paragraph
    instead of the small .post-description subtitle style used elsewhere. */
.post-description {
    font-size: 1rem;
}
</style>

{% assign project_categories = "Bayesian Optimization,Agentic AI Tools,ML & Optimization Libraries" | split: "," %}
{% for category in project_categories %}
{% assign category_projects = site.data.opensource | where: "category", category %}
{% if category_projects.size > 0 %}
<h3>{{ category }}</h3>
<div class="opensource-grid">
{% for item in category_projects %}
{% include opensource_repo.liquid item=item %}
{% endfor %}
</div>
{% endif %}
{% endfor %}