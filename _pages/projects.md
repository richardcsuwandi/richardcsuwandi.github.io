---
layout: page
title: Projects
permalink: /projects/
description: A collection of my open-source projects and research code
nav: true
nav_order: 2
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

.opensource-title {
    font-size: 1.1rem !important;
}

.opensource-description {
    font-size: 1rem !important;
    line-height: 1.5 !important;
}

.opensource-stats {
    font-size: 0.9rem !important;
}

.opensource-grid {
    margin-top: 0.75rem;
}

.post article .opensource-grid + h2 {
    margin-top: 3rem !important;
}
</style>

{% assign project_categories = "Bayesian Optimization,Agentic AI Tools,ML & Optimization Libraries" | split: "," %}
{% for category in project_categories %}
{% assign category_projects = site.data.opensource | where: "category", category %}
{% if category_projects.size > 0 %}
<h2>{{ category }}</h2>
<div class="opensource-grid">
{% for item in category_projects %}
{% include opensource_repo.liquid item=item %}
{% endfor %}
</div>
{% endif %}
{% endfor %}