---
layout: page
title: News
permalink: /news/
description: Talks, papers, awards, and other updates
---

<!-- _pages/news.md -->
<style>
/* Same width as the Research, Work, and Talks pages. */
.container.mt-5 {
    max-width: 75% !important;
}

@media (max-width: 768px) {
    .container.mt-5 {
        max-width: 95% !important;
    }
}

.news-page {
    display: grid;
    gap: 1rem;
}

.news-page-card.blog-post-card-horizontal {
    display: grid;
    gap: 0.4rem;
    margin: 0 !important;
    padding: 1.1rem 1.4rem !important;
}

.news-page-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.25rem 0.75rem;
}

.news-page-meta time {
    color: var(--global-text-color-light, #666);
    font-size: 0.97rem;
    font-weight: 500;
}

.news-page-tag {
    color: var(--global-theme-color);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.news-page-body {
    font-size: 1.05rem;
    line-height: 1.55;
}
</style>

<div class="news-page">
  {% assign news_items = site.news | reverse %}
  {% for item in news_items %}
    <div class="blog-post-card-horizontal news-page-card">
      <div class="news-page-meta">
        <time datetime="{{ item.date | date_to_xmlschema }}">{{ item.date | date: '%b %-d, %Y' }}</time>
        {% if item.tag %}<span class="news-page-tag">{{ item.tag }}</span>{% endif %}
      </div>
      <div class="news-page-body">
        {% if item.inline %}
          {{ item.content | remove: '<p>' | remove: '</p>' | emojify }}
        {% else %}
          <a href="{{ item.url | relative_url }}">{{ item.title }}</a>
        {% endif %}
      </div>
    </div>
  {% endfor %}
</div>
