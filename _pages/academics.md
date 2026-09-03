---
layout: page
permalink: /academics/
title: Academics
description: My education, honors & awards, teaching experience, and academic services
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
    width: 32px;
    height: 32px;
    object-fit: contain;
    vertical-align: middle;
    margin-right: 0.6rem;
    margin-top: -0.3rem;
    padding: 3px;
    box-sizing: border-box;
    border-radius: 6px;
    border: 1px solid var(--global-divider-color, #eee);
    background: #fff;
}

.service-main {
    display: flex;
    align-items: center;
}

/* Education / Honors & Awards only: big logo as its own left column. */
.service-card-with-logo {
    display: flex;
    align-items: center;
    gap: 1.3rem;
}

.service-card-logo-col {
    flex: 0 0 84px;
    width: 84px;
    height: 84px;
    object-fit: contain;
    border-radius: 14px;
    border: 1px solid var(--global-divider-color, #eee);
    background: #fff;
    padding: 8px;
    box-sizing: border-box;
}

.service-card-body {
    min-width: 0;
    flex: 1 1 auto;
}

@media (max-width: 480px) {
    .service-card-with-logo {
        flex-direction: column;
        align-items: flex-start;
    }

    .service-card-logo-col {
        width: 64px;
        height: 64px;
        flex-basis: 64px;
    }
}
</style>

<h2>Education</h2>
<div class="services-col mb-4">
  {% for edu in site.data.education %}
  <div class="service-card{% if edu.logo %} service-card-with-logo{% endif %}">
    {% if edu.logo %}<img src="{{ edu.logo }}" alt="" class="service-card-logo-col">{% endif %}
    <div class="service-card-body">
      <div class="service-meta">{{ edu.years }}</div>
      <div class="service-main">{{ edu.degree }}</div>
      <div class="service-meta">{{ edu.institution }}</div>
      {% if edu.description %}
        <div class="award-description" style="display: block;">{{ edu.description }}</div>
      {% endif %}
    </div>
  </div>
  {% endfor %}
</div>

<h2>Honors &amp; Awards</h2>
<div class="services-col mb-4">
  {% for award in site.data.awards %}
  <div class="service-card{% if award.logo %} service-card-with-logo{% endif %}">
    {% if award.logo %}<img src="{{ award.logo }}" alt="" class="service-card-logo-col">{% endif %}
    <div class="service-card-body">
      <div class="service-meta">{{ award.year }}</div>
      <div class="service-main">{{ award.title }}</div>
      {% if award.description %}
        <div class="award-description" style="display: block;">{{ award.description }}</div>
      {% endif %}
    </div>
  </div>
  {% endfor %}
</div>

<h2>Teaching Experience</h2>
<div class="news">
{% for teaching in site.data.services.teaching %}
<div class="news-card">
  <div class="news-date">{{ teaching.semester }}</div>
  <div class="news-content">
    {% if teaching.logo %}<img src="{{ teaching.logo }}" alt="" class="org-logo">{% endif %}
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
  <div class="news-content">
    {% if review.logo %}<img src="{{ review.logo }}" alt="" class="org-logo">{% endif %}
    <a href="{{ review.url }}" target="_blank" rel="noopener noreferrer">{{ review.name }}</a>
  </div>
</div>
{% endfor %}
</div>
