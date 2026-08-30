---
layout: page
permalink: /talks/
title: Talks
description: Conference talks, posters, and slides
nav: true
nav_order: 3
---

<!-- _pages/talks.md -->
<style>
.container.mt-5 {
    max-width: 75% !important;
}

@media (max-width: 768px) {
    .container.mt-5 {
        max-width: 95% !important;
    }
}

.talk-card {
    scroll-margin-top: 5.5rem;
}

.talk-card .post-date {
    font-size: 0.97rem;
    font-weight: 500;
    color: var(--global-text-color-light, #666);
    letter-spacing: 0.2px;
    margin-bottom: 0.55rem;
}

.talk-card-body {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    column-gap: 1rem;
    align-items: start;
}

.talk-card-body:not(:has(.post-tags-left)) {
    grid-template-columns: minmax(0, 1fr);
}

.talk-card .post-tags-left {
    padding-top: 0.12rem;
}

.talk-card .post-title-horizontal {
    font-size: 1.28rem !important;
    font-weight: 600 !important;
    color: var(--global-text-color, #222);
    line-height: 1.28 !important;
    letter-spacing: -0.01em;
    margin: 0 !important;
    padding: 0;
    border: none !important;
    border-bottom: none !important;
}

.talk-card .publication-venue {
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    color: var(--global-text-color-light, #666);
    line-height: 1.4;
    margin-top: 0.12rem;
}

.talk-card .publication-venue em {
    font-style: normal;
    color: inherit;
}

@media (min-width: 992px) {
    .talk-card.blog-post-card-horizontal .row {
        display: block;
    }

    .talk-card .post-left-section,
    .talk-card .post-middle-section {
        width: auto !important;
        padding-right: 0;
    }
}

@media (max-width: 991px) {
    .talk-card-body {
        grid-template-columns: max-content minmax(0, 1fr);
    }
}
</style>

{% assign talks_sorted = site.data.talks | sort: "sort_date" | reverse %}
{% for talk in talks_sorted %}
<div class="blog-post-card-horizontal talk-card mb-4"{% if talk.id %} id="{{ talk.id }}"{% endif %}>
  <div class="post-date">{{ talk.date }}</div>
  <div class="talk-card-body">
    {% if talk.poster or talk.slides %}
    <div class="post-tags-left">
      {% if talk.slides %}
        {% if talk.slides_kind == "image" %}
          {% assign slides_href = '/assets/img/talks/' | append: talk.slides %}
        {% else %}
          {% assign slides_href = '/assets/pdf/' | append: talk.slides %}
        {% endif %}
        <a href="{{ slides_href | relative_url }}" target="_blank" rel="noopener noreferrer" class="tag-link">Slides</a>
      {% endif %}
      {% if talk.poster %}
        <a href="{{ '/assets/pdf/' | append: talk.poster | relative_url }}" target="_blank" rel="noopener noreferrer" class="tag-link">Poster</a>
      {% endif %}
    </div>
    {% endif %}
    <div class="talk-card-main">
      <h2 class="post-title-horizontal">{{ talk.title }}</h2>
      {% if talk.venue %}
      <div class="publication-venue">
        <div class="publication-venue-line">
          <span class="publication-venue-text">
            {% if talk.award %}
              <span class="presentation-badge presentation-badge-award">{{ talk.award }}</span>
            {% endif %}
            {% if talk.presentation == "oral" %}
              <span class="presentation-badge presentation-badge-oral">ORAL</span>
            {% endif %}
            <em>{{ talk.venue }}</em>
          </span>
        </div>
      </div>
      {% endif %}
    </div>
  </div>
</div>
{% endfor %}
