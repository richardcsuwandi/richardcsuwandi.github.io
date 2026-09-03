---
layout: page
permalink: /academics/
title: Academics
description: Education, honors & awards, teaching experience, and academic service
nav: true
nav_order: 3
---

<!-- _pages/academics.md -->
<style>
/* This page renders inside .container (default.liquid), capped at 1140px by
    _base.scss, unlike the About page's uncapped .wide-about-container.
    Widen it here so the multi-column cards have more room. */
.container.mt-5 {
    max-width: 75% !important;
}

@media (max-width: 768px) {
    .container.mt-5 {
        max-width: 95% !important;
    }
}

.org-logo {
    width: 20px;
    height: 20px;
    object-fit: contain;
    vertical-align: middle;
    margin-right: 0.4rem;
    margin-top: -0.15rem;
    padding: 2px;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid var(--global-divider-color, #eee);
    background: #fff;
}
</style>

<h2>Education</h2>
<div class="services-col mb-4">
  {% for edu in site.data.education %}
  <div class="service-card">
    <div class="service-meta">{{ edu.years }}</div>
    <div class="service-main">{{ edu.degree }}</div>
    <div class="service-meta">{{ edu.institution }}</div>
    {% if edu.description %}
      <div class="award-description" style="display: block;">{{ edu.description }}</div>
    {% endif %}
  </div>
  {% endfor %}
</div>

<h2>Honors &amp; Awards</h2>
<div class="services-col mb-4">
  {% for award in site.data.awards %}
  <div class="service-card">
    <div class="service-meta">{{ award.year }}</div>
    <div class="service-main">{{ award.title }}</div>
    {% if award.description %}
      <div class="award-description" style="display: block;">{{ award.description }}</div>
    {% endif %}
  </div>
  {% endfor %}
</div>

<h2>Teaching Experience</h2>
<div class="news">
{% for teaching in site.data.services.teaching %}
<div class="news-card">
  <div class="news-date">{{ teaching.semester }}</div>
  <div class="news-content">
    {{ teaching.role | default: "Teaching Assistant" }},
    {{ teaching.course }}
    , {{ teaching.institution }}
  </div>
</div>
{% endfor %}
</div>

<h2>Organizational Experience</h2>
<div class="news">
{% for org in site.data.services.organizations %}
<div class="news-card">
  <div class="news-date">{{ org.years }}</div>
  <div class="news-content">
    {% if org.logo %}
      <img src="{{ org.logo }}" alt="" class="org-logo">
    {% endif %}
    {{ org.role }},
    {% if org.url %}
      <a href="{{ org.url }}" target="_blank" rel="noopener noreferrer">{{ org.name }}</a>
    {% else %}
      {{ org.name }}
    {% endif %}
  </div>
</div>
{% endfor %}
</div>

<h2>Academic Service</h2>
<div class="news">
{% for review in site.data.services.reviewing %}
<div class="news-card">
  <div class="news-date">Reviewer</div>
  <div class="news-content"><a href="{{ review.url }}" target="_blank" rel="noopener noreferrer">{{ review.name }}</a></div>
</div>
{% endfor %}
</div>
