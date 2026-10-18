---
layout: page
permalink: /talks/
title: Talks
description: My invited talks, posters, and slides
nav: true
nav_order: 4
---

<!-- _pages/talks.md -->
<!-- Cards reuse the paper-card layout from _sass/_paper-card.scss. Thumbnails come from scripts/talk_thumbnail.sh. -->
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

.talk-card .talk-date {
    color: var(--global-text-color-light, #666);
    font-size: 0.92rem;
    font-weight: 500;
}
</style>

{% assign talks_sorted = site.data.talks | sort: "sort_date" | reverse %}
{% for talk in talks_sorted %}
  {% assign slides_href = nil %}
  {% if talk.slides %}
    {% if talk.slides_kind == "image" %}
      {% assign slides_href = '/assets/img/talks/' | append: talk.slides | relative_url %}
    {% elsif talk.slides_kind == "url" %}
      {% assign slides_href = talk.slides | relative_url %}
    {% else %}
      {% assign slides_href = '/assets/pdf/' | append: talk.slides | relative_url %}
    {% endif %}
  {% endif %}
  {% assign poster_href = nil %}
  {% if talk.poster %}
    {% assign poster_href = '/assets/pdf/' | append: talk.poster | relative_url %}
  {% endif %}
  {% assign thumb_href = slides_href | default: poster_href %}

<div class="blog-post-card-horizontal paper-card talk-card mb-4"{% if talk.id %} id="{{ talk.id }}"{% endif %}>
  <div class="paper-card-main">
    <div class="paper-card-text">
      <time class="talk-date" datetime="{{ talk.sort_date | date_to_xmlschema }}">{{ talk.sort_date | date: '%b %-d, %Y' }}</time>
      <h2 class="post-title-horizontal">{{ talk.title }}</h2>
      <div class="publication-venue paper-card-venue">
        {% if talk.award %}<span class="presentation-badge presentation-badge-award">{{ talk.award }}</span>{% endif %}
        {% if talk.presentation == "oral" %}<span class="presentation-badge presentation-badge-oral">ORAL</span>{% endif %}
        {% if talk.venue %}<em>{{ talk.venue }}</em>{% endif %}
      </div>
      {% if slides_href or poster_href or talk.recording %}
        <div class="paper-actions talk-actions">
          {% if slides_href %}
            <a class="talk-link-badge" href="{{ slides_href }}" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M12 16v4M8 20h8"/></svg>
              <span>Slides</span>
            </a>
          {% endif %}
          {% if poster_href %}
            <a class="talk-link-badge" href="{{ poster_href }}" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>
              <span>Poster</span>
            </a>
          {% endif %}
          {% if talk.recording %}
            <a class="talk-link-badge talk-link-badge-recording" href="{{ talk.recording }}" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path class="talk-play" d="M10 8.5v7l6-3.5z"/></svg>
              <span>Recording</span>
            </a>
          {% endif %}
        </div>
      {% endif %}
    </div>

    {% if talk.thumbnail %}
      <a class="paper-card-figure talk-thumb" href="{{ thumb_href }}" target="_blank" rel="noopener noreferrer" aria-label="Open {% if slides_href %}slides{% else %}poster{% endif %} for {{ talk.title | escape }}">
        <img src="{{ '/assets/img/talks/thumbs/' | append: talk.thumbnail | relative_url }}" alt="" class="paper-thumbnail" loading="lazy">
      </a>
    {% endif %}
  </div>
</div>
{% endfor %}
