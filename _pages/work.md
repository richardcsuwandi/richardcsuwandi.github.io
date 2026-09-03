---
layout: page
title: Work
permalink: /work/
description: My research and engineering experiences
nav: true
nav_order: 2
---

<!-- _pages/work.md -->

<style>
/* This page renders inside .container (default.liquid), capped at 1140px by
    _base.scss, unlike the About page's uncapped .wide-about-container.
    Widen it here so the work cards have more room. */
.container.mt-5 {
    max-width: 75% !important;
}

@media (max-width: 768px) {
    .container.mt-5 {
        max-width: 95% !important;
    }
}

.work-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.work-card {
    background: var(--global-card-bg-color, #fff);
    border: 1.5px solid var(--global-divider-color, #e3f0fa);
    border-radius: 1.2rem;
    padding: 1.5rem 1.6rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
    transition: box-shadow 0.2s;
}

.work-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
}

.work-header {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: flex-start;
    gap: 1rem;
}

@media (max-width: 600px) {
    .work-header {
        grid-template-columns: 1fr;
    }

    .work-meta {
        text-align: left;
    }
}

.work-identity {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 0;
}

.work-logo {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    object-fit: contain;
    padding: 6px;
    box-sizing: border-box;
    flex-shrink: 0;
    border: 1px solid var(--global-divider-color, #e3f0fa);
    background: #fff;
}

.work-titles {
    min-width: 0;
}

.work-company {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--global-text-color, #222);
    line-height: 1.3;
}

.work-role {
    font-size: 1rem;
    font-weight: 400;
    color: var(--global-text-color, #222);
}

.work-role a {
    color: inherit;
    text-decoration: underline;
    text-decoration-color: var(--global-divider-color, #ccc);
    text-underline-offset: 2px;
}

.work-role a:hover {
    color: var(--global-theme-color, #0063c9);
}

.work-meta {
    text-align: right;
    flex-shrink: 0;
}

.work-dates {
    font-size: 0.97rem;
    font-weight: 600;
    color: var(--global-text-color-light, #666);
}

.work-location {
    font-size: 0.93rem;
    font-style: italic;
    color: var(--global-text-color-light, #888);
}

.work-highlights {
    margin: 1rem 0 0 0;
    padding-left: 1.2rem;
    font-size: 0.98rem;
    line-height: 1.55;
    color: var(--global-text-color, #333);
}

.work-highlights li {
    margin-bottom: 0.35rem;
}

.work-highlights li:last-child {
    margin-bottom: 0;
}

.work-highlights a {
    color: var(--global-theme-color, #0063c9);
    text-decoration: underline;
    text-decoration-color: var(--global-divider-color, #ccc);
    text-underline-offset: 2px;
}

.work-highlights a:hover {
    text-decoration-color: var(--global-theme-color, #0063c9);
}

.work-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1.1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--global-divider-color, #eee);
}

.work-link-card {
    flex: 1 1 260px;
    min-width: 240px;
    display: block;
    border: 1px solid var(--global-divider-color, #e3f0fa);
    border-radius: 0.8rem;
    padding: 0.8rem 1rem;
    text-decoration: none !important;
    transition: border-color 0.18s, box-shadow 0.18s;
}

.work-link-card:hover {
    border-color: var(--global-theme-color, #0063c9);
    box-shadow: 0 2px 8px rgba(0, 99, 201, 0.1);
}

.work-link-title {
    font-size: 0.97rem;
    font-weight: 700;
    color: var(--global-theme-color, #0063c9);
}

.work-link-subtitle {
    font-size: 0.85rem;
    line-height: 1.4;
    color: var(--global-text-color-light, #888);
    margin-top: 0.25rem;
}
</style>

<div class="work-list">
{% for job in site.data.work %}
<div class="work-card">
  <div class="work-header">
    <div class="work-identity">
      <img class="work-logo" src="{{ job.logo }}" alt="{{ job.company }} logo" loading="lazy">
      <div class="work-titles">
        <div class="work-company">{{ job.company }}</div>
        <div class="work-role">
          {% if job.role_url %}
            <a href="{{ job.role_url }}" target="_blank" rel="noopener noreferrer">{{ job.role }}</a>
          {% else %}
            {{ job.role }}
          {% endif %}
        </div>
      </div>
    </div>
    <div class="work-meta">
      <div class="work-dates">{{ job.dates }}</div>
      <div class="work-location">{{ job.location }}</div>
    </div>
  </div>

  {% if job.highlights.size > 0 %}
  <ul class="work-highlights">
    {% for point in job.highlights %}
    <li>{{ point }}</li>
    {% endfor %}
  </ul>
  {% endif %}

  {% if job.links.size > 0 %}
  <div class="work-links">
    {% for link in job.links %}
    <a class="work-link-card" href="{{ link.url }}">
      <div class="work-link-title">{{ link.title }}</div>
      <div class="work-link-subtitle">{{ link.subtitle }}</div>
    </a>
    {% endfor %}
  </div>
  {% endif %}
</div>
{% endfor %}
</div>
